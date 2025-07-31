import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Hr,
} from '@react-email/components';
import * as React from 'react';

interface AdminNotificationEmailProps {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  packageName: string;
  applicationId: string;
  serviceAddress: any; // JSON object
  submittedAt: string;
  specialRequirements?: string;
  dashboardUrl?: string;
}

export const AdminNotificationEmail = ({
  customerName = 'Customer',
  customerEmail = 'customer@example.com',
  customerPhone,
  packageName = 'Internet Package',
  applicationId = 'APP-001',
  serviceAddress,
  submittedAt = new Date().toLocaleDateString(),
  specialRequirements,
  dashboardUrl = 'https://starcast.co.za/admin',
}: AdminNotificationEmailProps) => {
  const previewText = `New application: ${customerName} - ${packageName}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logoContainer}>
            <Img
              src={`https://starcast.co.za/wp-content/uploads/2024/01/starcast-logo.png`}
              width="120"
              height="36"
              alt="Starcast"
              style={logo}
            />
          </Section>
          
          <Heading style={h1}>🚨 New Service Application</Heading>
          
          <Text style={heroText}>
            A new customer has submitted an application requiring your review.
          </Text>
          
          <Section style={alertBox}>
            <Text style={alertText}>
              Application ID
            </Text>
            <Text style={applicationText}>
              {applicationId}
            </Text>
            <Text style={timestampText}>
              Submitted: {submittedAt}
            </Text>
          </Section>
          
          <Section style={customerInfoBox}>
            <Text style={sectionTitle}>Customer Information</Text>
            <Hr style={hr} />
            
            <div style={infoRow}>
              <Text style={infoLabel}>Name:</Text>
              <Text style={infoValue}>{customerName}</Text>
            </div>
            
            <div style={infoRow}>
              <Text style={infoLabel}>Email:</Text>
              <Text style={infoValue}>{customerEmail}</Text>
            </div>
            
            {customerPhone && (
              <div style={infoRow}>
                <Text style={infoLabel}>Phone:</Text>
                <Text style={infoValue}>{customerPhone}</Text>
              </div>
            )}
            
            <div style={infoRow}>
              <Text style={infoLabel}>Package:</Text>
              <Text style={infoValue}>{packageName}</Text>
            </div>
          </Section>
          
          <Section style={addressBox}>
            <Text style={sectionTitle}>Service Address</Text>
            <Hr style={hr} />
            
            {serviceAddress && (
              <>
                {serviceAddress.street && (
                  <div style={infoRow}>
                    <Text style={infoLabel}>Street:</Text>
                    <Text style={infoValue}>{serviceAddress.street}</Text>
                  </div>
                )}
                
                {serviceAddress.suburb && (
                  <div style={infoRow}>
                    <Text style={infoLabel}>Suburb:</Text>
                    <Text style={infoValue}>{serviceAddress.suburb}</Text>
                  </div>
                )}
                
                {serviceAddress.city && (
                  <div style={infoRow}>
                    <Text style={infoLabel}>City:</Text>
                    <Text style={infoValue}>{serviceAddress.city}</Text>
                  </div>
                )}
                
                {serviceAddress.province && (
                  <div style={infoRow}>
                    <Text style={infoLabel}>Province:</Text>
                    <Text style={infoValue}>{serviceAddress.province}</Text>
                  </div>
                )}
                
                {serviceAddress.postalCode && (
                  <div style={infoRow}>
                    <Text style={infoLabel}>Postal Code:</Text>
                    <Text style={infoValue}>{serviceAddress.postalCode}</Text>
                  </div>
                )}
              </>
            )}
          </Section>
          
          {specialRequirements && (
            <Section style={requirementsBox}>
              <Text style={sectionTitle}>Special Requirements</Text>
              <Hr style={hr} />
              <Text style={requirementsText}>{specialRequirements}</Text>
            </Section>
          )}
          
          <Section style={actionBox}>
            <Text style={actionTitle}>Action Required</Text>
            <Text style={actionText}>
              Please review this application and:
            </Text>
            
            <ul style={actionList}>
              <li>Verify service availability in the customer&apos;s area</li>
              <li>Check network capacity and installation requirements</li>
              <li>Approve or reject the application</li>
              <li>Contact the customer within 24 hours</li>
            </ul>
            
            {dashboardUrl && (
              <Link href={dashboardUrl} style={dashboardButton}>
                Open Admin Dashboard
              </Link>
            )}
          </Section>
          
          <Text style={text}>
            <strong>Customer Contact Information:</strong>
          </Text>
          
          <ul style={list}>
            <li><strong>Email:</strong> {customerEmail}</li>
            {customerPhone && <li><strong>Phone:</strong> {customerPhone}</li>}
            <li><strong>Application ID:</strong> {applicationId}</li>
          </ul>
          
          <Text style={text}>
            Please process this application promptly to maintain our 24-hour response commitment.
          </Text>
          
          <Text style={text}>
            This is an automated notification from the Starcast customer management system.
          </Text>
          
          <Section style={footer}>
            <Text style={footerText}>
              Starcast Admin System - Customer Application Management
            </Text>
            <Text style={footerText}>
              📧 starcast.tech@gmail.com
            </Text>
            <Link href="https://starcast.co.za" style={footerLink}>
              www.starcast.co.za
            </Link>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default AdminNotificationEmail;

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const logoContainer = {
  margin: '32px 0',
  textAlign: 'center' as const,
};

const logo = {
  margin: '0 auto',
};

const h1 = {
  color: '#1f2937',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '40px',
  margin: '0 0 20px',
  textAlign: 'center' as const,
};

const heroText = {
  color: '#6b7280',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 32px',
  textAlign: 'center' as const,
};

const alertBox = {
  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
  borderRadius: '8px',
  margin: '16px auto 40px',
  padding: '24px',
  textAlign: 'center' as const,
};

const alertText = {
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0 0 8px',
  textTransform: 'uppercase' as const,
  letterSpacing: '1px',
};

const applicationText = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: '700',
  margin: '0 0 8px',
};

const timestampText = {
  color: '#ffffff',
  fontSize: '14px',
  margin: '0',
  opacity: 0.9,
};

const customerInfoBox = {
  backgroundColor: '#f9fafb',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  margin: '16px auto 24px',
  padding: '24px',
};

const addressBox = {
  backgroundColor: '#f0f9ff',
  border: '1px solid #0ea5e9',
  borderRadius: '8px',
  margin: '16px auto 24px',
  padding: '24px',
};

const requirementsBox = {
  backgroundColor: '#fefce8',
  border: '1px solid #facc15',
  borderRadius: '8px',
  margin: '16px auto 24px',
  padding: '24px',
};

const actionBox = {
  backgroundColor: '#fef2f2',
  border: '1px solid #f87171',
  borderRadius: '8px',
  margin: '16px auto 32px',
  padding: '24px',
};

const sectionTitle = {
  color: '#1f2937',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 16px',
  textAlign: 'center' as const,
};

const actionTitle = {
  color: '#dc2626',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 16px',
  textAlign: 'center' as const,
};

const hr = {
  borderColor: '#e5e7eb',
  margin: '16px 0',
};

const infoRow = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  margin: '8px 0',
};

const infoLabel = {
  color: '#6b7280',
  fontSize: '14px',
  fontWeight: '500',
  margin: 0,
};

const infoValue = {
  color: '#1f2937',
  fontSize: '14px',
  fontWeight: '600',
  margin: 0,
};

const requirementsText = {
  color: '#92400e',
  fontSize: '14px',
  margin: '0',
  lineHeight: '20px',
};

const actionText = {
  color: '#7f1d1d',
  fontSize: '14px',
  margin: '0 0 16px',
  lineHeight: '20px',
  textAlign: 'center' as const,
};

const actionList = {
  color: '#7f1d1d',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0 0 20px',
  paddingLeft: '20px',
};

const dashboardButton = {
  backgroundColor: '#dc2626',
  borderRadius: '8px',
  color: '#ffffff',
  display: 'inline-block',
  fontSize: '16px',
  fontWeight: '600',
  padding: '12px 24px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  width: '200px',
  margin: '0 auto',
};

const text = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 16px',
  padding: '0 32px',
};

const list = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 16px',
  padding: '0 32px',
};

const footer = {
  margin: '32px 0 0',
  padding: '0 32px',
  textAlign: 'center' as const,
};

const footerText = {
  color: '#9ca3af',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0 0 8px',
};

const footerLink = {
  color: '#4f46e5',
  fontSize: '14px',
  textDecoration: 'underline',
};