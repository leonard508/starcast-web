import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '../../../lib/auth';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    // Emergency secret key to prevent unauthorized access
    const emergencyKey = process.env.EMERGENCY_ADMIN_KEY || 'starcast-emergency-2024';
    const { emergencySecret } = await request.json();
    
    if (emergencySecret !== emergencyKey) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized emergency access' },
        { status: 401 }
      );
    }
    
    console.log('🚨 EMERGENCY ADMIN RESET INITIATED');
    
    // Clear all existing users and sessions
    await prisma.session.deleteMany({});
    await prisma.account.deleteMany({});
    await prisma.user.deleteMany({});
    
    console.log('✅ All users cleared');
    
    // Create admin user with BetterAuth
    const adminEmail = 'admin@starcast.co.za';
    const adminPassword = 'StarcastAdmin2024!';
    
    // Hash password using bcrypt (same as BetterAuth)
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    // Create user
    const adminUser = await prisma.user.create({
      data: {
        email: adminEmail,
        name: 'Starcast Admin',
        firstName: 'Starcast',
        lastName: 'Admin',
        role: 'ADMIN',
        emailVerified: true,
        active: true,
        mustChangePassword: false
      }
    });
    
    // Create account for BetterAuth
    await prisma.account.create({
      data: {
        userId: adminUser.id,
        accountId: adminUser.email,
        providerId: 'credential',
        password: hashedPassword
      }
    });
    
    console.log('✅ Admin user and account created');
    
    return NextResponse.json({
      success: true,
      message: 'Emergency admin reset completed',
      admin: {
        id: adminUser.id,
        email: adminUser.email,
        role: adminUser.role
      },
      credentials: {
        email: adminEmail,
        password: adminPassword,
        url: '/admin'
      }
    });
    
  } catch (error) {
    console.error('Emergency admin reset failed:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}