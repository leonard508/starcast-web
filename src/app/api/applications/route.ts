import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { requireAdmin, rateLimit, securityHeaders, corsHeaders } from '../../../lib/auth/middleware';
import { applicationFilterSchema } from '../../../lib/validation/schemas';
import * as Brevo from '@getbrevo/brevo';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Add security headers
    const headers = {
      ...securityHeaders(),
      ...corsHeaders(request.headers.get('origin') || undefined)
    };

    // Rate limiting for data access
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitResult = rateLimit(clientIp, 20, 60000);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { success: false, error: 'Too many requests' },
        { status: 429, headers }
      );
    }

    // Require admin authentication to view applications
    const authResult = await requireAdmin(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { searchParams } = new URL(request.url);
    
    // Validate query parameters
    const filterParams = {
      status: searchParams.get('status') || undefined,
      packageType: searchParams.get('packageType') || undefined,
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '20'),
      sortBy: searchParams.get('sortBy') || undefined,
      sortOrder: searchParams.get('sortOrder') || 'desc',
      dateFrom: searchParams.get('dateFrom') || undefined,
      dateTo: searchParams.get('dateTo') || undefined
    };

    const validatedFilters = applicationFilterSchema.parse(filterParams);

    // Build where clause with validated filters
    const where: any = {};
    if (validatedFilters.status) {
      where.status = validatedFilters.status;
    }
    if (validatedFilters.packageType) {
      where.package = { type: validatedFilters.packageType };
    }
    if (validatedFilters.dateFrom || validatedFilters.dateTo) {
      where.submittedAt = {};
      if (validatedFilters.dateFrom) {
        where.submittedAt.gte = new Date(validatedFilters.dateFrom);
      }
      if (validatedFilters.dateTo) {
        where.submittedAt.lte = new Date(validatedFilters.dateTo);
      }
    }

    // Calculate pagination
    const skip = (validatedFilters.page - 1) * validatedFilters.limit;
    const take = validatedFilters.limit;

    // Get total count for pagination
    const totalCount = await prisma.application.count({ where });

    const applications = await prisma.application.findMany({
      where,
      skip,
      take,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        package: {
          include: {
            provider: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        [validatedFilters.sortBy || 'submittedAt']: validatedFilters.sortOrder,
      },
    });

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / validatedFilters.limit);

    return NextResponse.json({
      success: true,
      data: applications,
      pagination: {
        page: validatedFilters.page,
        limit: validatedFilters.limit,
        totalCount,
        totalPages,
        hasNext: validatedFilters.page < totalPages,
        hasPrev: validatedFilters.page > 1
      }
    }, { headers });
  } catch (error) {
    console.error('Failed to fetch applications:', error);
    
    const errorMessage = error instanceof Error && error.message.includes('validation') 
      ? error.message 
      : 'Failed to fetch applications';
      
    return NextResponse.json(
      { success: false, error: errorMessage },
      { 
        status: error instanceof Error && error.message.includes('validation') ? 400 : 500,
        headers: {
          ...securityHeaders(),
          ...corsHeaders()
        }
      }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Add security headers
    const headers = {
      ...securityHeaders(),
      ...corsHeaders(request.headers.get('origin') || undefined)
    };

    // Rate limiting for application creation - 3 per hour per IP
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitResult = rateLimit(`create_app_${clientIp}`, 3, 3600000);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { success: false, error: 'Too many application submissions. Please try again later.' },
        { status: 429, headers }
      );
    }

    const body = await request.json();
    const { 
      packageId, 
      firstName, 
      lastName, 
      email, 
      phone, 
      address, 
      city, 
      province, 
      postalCode
    } = body;

    // Validate required fields
    if (!packageId || !firstName || !lastName || !email || !phone || !address || !city || !province || !postalCode) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields',
          required: ['packageId', 'firstName', 'lastName', 'email', 'phone', 'address', 'city', 'province', 'postalCode']
        },
        { status: 400, headers }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid email address'
        },
        { status: 400, headers }
      );
    }

    // Check if package exists
    const packageExists = await prisma.package.findUnique({
      where: { id: packageId },
      include: { provider: true }
    });

    if (!packageExists) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Package not found'
        },
        { status: 404, headers }
      );
    }

    // Create or find user first
    let user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      // Create a new user for the application
      user = await prisma.user.create({
        data: {
          email,
          firstName,
          lastName,
          phone,
          address,
          city,
          province,
          postalCode,
          packageId: packageId,
          applicationStatus: 'PENDING_APPROVAL'
        }
      });
    }

    // Check for existing application with same user and package
    const existingApplication = await prisma.application.findFirst({
      where: {
        userId: user.id,
        packageId,
        status: { in: ['PENDING_APPROVAL', 'APPROVED'] }
      }
    });

    if (existingApplication) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'You already have a pending or approved application for this package'
        },
        { status: 409, headers }
      );
    }

    // Generate application number
    const applicationNumber = `APP-${Date.now()}`;

    const serviceAddressData = {
      street: address,
      city,
      province,
      postalCode,
      fullAddress: `${address}, ${city}, ${province} ${postalCode}`
    };

    const application = await prisma.application.create({
      data: {
        applicationNumber,
        userId: user.id,
        packageId,
        serviceAddress: serviceAddressData,
        contactNumber: phone,
        status: 'PENDING_APPROVAL'
      },
      include: {
        user: true,
        package: {
          include: {
            provider: true,
          },
        }
      },
    });

    // Send confirmation email to customer
    await sendCustomerConfirmationEmail(application);

    // Send notification email to admin
    await sendAdminNotificationEmail(application);

    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully',
      data: {
        applicationId: application.id,
        applicationNumber: application.applicationNumber,
        packageName: application.package.name,
        provider: application.package.provider.name,
        estimatedContactTime: '24 hours'
      }
    }, { headers });
  } catch (error) {
    console.error('Failed to create application:', error);
    
    const errorMessage = error instanceof Error && error.message.includes('validation') 
      ? error.message 
      : 'Failed to create application';
      
    return NextResponse.json(
      { success: false, error: errorMessage },
      { 
        status: error instanceof Error && error.message.includes('validation') ? 400 : 500,
        headers: {
          ...securityHeaders(),
          ...corsHeaders()
        }
      }
    );
  }
}

// Helper function to send customer confirmation email
async function sendCustomerConfirmationEmail(application: any) {
  try {
    const emailProvider = process.env.EMAIL_PROVIDER || 'brevo';
    
    const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Application Confirmation - Starcast ISP</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">
              Starcast ISP
            </h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">
              Application Confirmation
            </p>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #2d3748; margin: 0 0 20px 0; font-size: 24px;">
              Thank you for your application!
            </h2>
            
            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
              Dear ${application.user.firstName} ${application.user.lastName},
            </p>
            
            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
              We have successfully received your application for internet service. Here are the details:
            </p>
            
            <div style="background: #f7fafc; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 4px;">
              <h3 style="color: #2d3748; margin: 0 0 15px 0; font-size: 18px;">Application Details</h3>
              <div style="color: #4a5568; font-size: 16px; line-height: 1.8;">
                <strong>Package:</strong> ${application.package.name}<br>
                <strong>Provider:</strong> ${application.package.provider.name}<br>
                <strong>Application ID:</strong> ${application.applicationNumber}<br>
                <strong>Status:</strong> Pending Review
              </div>
            </div>
            
            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 20px 0;">
              <strong>What happens next?</strong><br>
              Our team will review your application and contact you within 24 hours to:
            </p>
            
            <ul style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0 0 20px 30px;">
              <li>Confirm your package details</li>
              <li>Schedule installation if approved</li>
              <li>Provide payment and contract information</li>
            </ul>
            
            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 20px 0 0 0;">
              Best regards,<br>
              <strong>Starcast Support Team</strong>
            </p>
          </div>
          
          <!-- Footer -->
          <div style="background: #edf2f7; padding: 20px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="color: #718096; font-size: 14px; margin: 0;">
              Questions? Contact us at ${process.env.FROM_EMAIL || 'info@starcast.co.za'}
            </p>
          </div>
        </div>
      </body>
    </html>`;

    const textContent = `
Application Confirmation - Starcast ISP

Dear ${application.user.firstName} ${application.user.lastName},

We have successfully received your application for internet service.

Application Details:
- Package: ${application.package.name}
- Provider: ${application.package.provider.name}
- Application ID: ${application.applicationNumber}
- Status: Pending Review

What happens next?
Our team will review your application and contact you within 24 hours to:
• Confirm your package details
• Schedule installation if approved
• Provide payment and contract information

Best regards,
Starcast Support Team

Questions? Contact us at ${process.env.FROM_EMAIL || 'info@starcast.co.za'}
    `.trim();

    if (emailProvider === 'brevo' && process.env.BREVO_API_KEY && process.env.BREVO_API_KEY !== 'your-brevo-api-key-here') {
      // Send via Brevo
      const apiInstance = new Brevo.TransactionalEmailsApi();
      apiInstance.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY!);

      const sendSmtpEmail = new Brevo.SendSmtpEmail();
      sendSmtpEmail.sender = {
        name: process.env.FROM_NAME || 'Starcast',
        email: process.env.FROM_EMAIL || 'info@starcast.co.za'
      };
      sendSmtpEmail.to = [{ email: application.user.email, name: `${application.user.firstName} ${application.user.lastName}` }];
      sendSmtpEmail.subject = 'Application Confirmation - Starcast ISP';
      sendSmtpEmail.htmlContent = htmlContent;
      sendSmtpEmail.textContent = textContent;

      await apiInstance.sendTransacEmail(sendSmtpEmail);
      console.log('Customer confirmation email sent via Brevo');

    } else if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      // Send via SMTP
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtpout.secureserver.net',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        },
        tls: {
          ciphers: 'SSLv3'
        }
      });

      await transporter.sendMail({
        from: `"${process.env.FROM_NAME || 'Starcast'}" <${process.env.FROM_EMAIL || 'info@starcast.co.za'}>`,
        to: application.user.email,
        subject: 'Application Confirmation - Starcast ISP',
        text: textContent,
        html: htmlContent
      });

      console.log('Customer confirmation email sent via SMTP');
    }

  } catch (error) {
    console.error('Error sending customer confirmation email:', error);
  }
}

// Helper function to send admin notification email
async function sendAdminNotificationEmail(application: any) {
  try {
    const emailProvider = process.env.EMAIL_PROVIDER || 'brevo';
    const adminEmail = process.env.ADMIN_EMAIL || 'starcast.tech@gmail.com';
    
    const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Application - Starcast Admin</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">
              New Application Received
            </h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">
              Starcast Admin Dashboard
            </p>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #2d3748; margin: 0 0 20px 0; font-size: 24px;">
              Application Details
            </h2>
            
            <div style="background: #f7fafc; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 4px;">
              <div style="color: #2d3748; font-size: 16px; line-height: 1.8;">
                <strong>Customer:</strong> ${application.user.firstName} ${application.user.lastName}<br>
                <strong>Email:</strong> ${application.user.email}<br>
                <strong>Phone:</strong> ${application.user.phone}<br>
                <strong>Address:</strong> ${application.serviceAddress.fullAddress}<br><br>
                <strong>Package:</strong> ${application.package.name}<br>
                <strong>Provider:</strong> ${application.package.provider.name}<br>
                <strong>Application ID:</strong> ${application.applicationNumber}<br>
                <strong>Submitted:</strong> ${new Date(application.submittedAt).toLocaleString()}
              </div>
            </div>
            
            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 20px 0;">
              Please review this application in your admin dashboard and contact the customer within 24 hours.
            </p>
          </div>
        </div>
      </body>
    </html>`;

    const textContent = `
New Application Received - Starcast Admin

Application Details:
- Customer: ${application.user.firstName} ${application.user.lastName}
- Email: ${application.user.email}
- Phone: ${application.user.phone}
- Address: ${application.serviceAddress.fullAddress}
- Package: ${application.package.name}
- Provider: ${application.package.provider.name}
- Application ID: ${application.applicationNumber}
- Submitted: ${new Date(application.submittedAt).toLocaleString()}

Please review this application in your admin dashboard and contact the customer within 24 hours.
    `.trim();

    if (emailProvider === 'brevo' && process.env.BREVO_API_KEY && process.env.BREVO_API_KEY !== 'your-brevo-api-key-here') {
      // Send via Brevo
      const apiInstance = new Brevo.TransactionalEmailsApi();
      apiInstance.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY!);

      const sendSmtpEmail = new Brevo.SendSmtpEmail();
      sendSmtpEmail.sender = {
        name: process.env.FROM_NAME || 'Starcast',
        email: process.env.FROM_EMAIL || 'info@starcast.co.za'
      };
      sendSmtpEmail.to = [{ email: adminEmail, name: 'Starcast Admin' }];
      sendSmtpEmail.subject = 'New Application Received - Starcast ISP';
      sendSmtpEmail.htmlContent = htmlContent;
      sendSmtpEmail.textContent = textContent;

      await apiInstance.sendTransacEmail(sendSmtpEmail);
      console.log('Admin notification email sent via Brevo');

    } else if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      // Send via SMTP
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtpout.secureserver.net',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        },
        tls: {
          ciphers: 'SSLv3'
        }
      });

      await transporter.sendMail({
        from: `"${process.env.FROM_NAME || 'Starcast'}" <${process.env.FROM_EMAIL || 'info@starcast.co.za'}>`,
        to: adminEmail,
        subject: 'New Application Received - Starcast ISP',
        text: textContent,
        html: htmlContent
      });

      console.log('Admin notification email sent via SMTP');
    }

  } catch (error) {
    console.error('Error sending admin notification email:', error);
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      ...corsHeaders(request.headers.get('origin') || undefined),
      ...securityHeaders()
    }
  });
}