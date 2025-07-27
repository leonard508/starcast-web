const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function createTestUser() {
  try {
    console.log('Creating test user and sample data...')

    // First, ensure we have providers and packages
    const provider = await prisma.provider.upsert({
      where: { slug: 'vumatel' },
      update: {},
      create: {
        name: 'Vumatel',
        slug: 'vumatel',
        logo: '/assets/providers/vumatel.svg',
        active: true
      }
    })

    const fibrePackage = await prisma.package.upsert({
      where: { id: 'test-package-1' },
      update: {},
      create: {
        id: 'test-package-1',
        name: '100Mbps Fibre',
        providerId: provider.id,
        type: 'FIBRE',
        speed: '100Mbps',
        data: 'Unlimited',
        aup: 'Fair usage policy applies',
        throttle: 'No throttling',
        basePrice: 899.00,
        currentPrice: 799.00,
        featured: true,
        active: true
      }
    })

    // Create promotion
    const promotion = await prisma.promotion.upsert({
      where: { code: 'WELCOME100' },
      update: {},
      create: {
        code: 'WELCOME100',
        name: 'Welcome Discount',
        description: '10% discount for new customers',
        packageId: fibrePackage.id,
        discountType: 'PERCENTAGE',
        discountValue: 10.0,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2025-12-31'),
        usageLimit: 1000,
        timesUsed: 1,
        active: true
      }
    })

    // Create test user account
    const testUser = await prisma.user.upsert({
      where: { email: 'test@starcast.co.za' },
      update: {},
      create: {
        email: 'test@starcast.co.za',
        firstName: 'John',
        lastName: 'Doe',
        name: 'John Doe',
        phone: '+27123456789',
        address: '123 Test Street',
        city: 'Cape Town',
        province: 'Western Cape',
        postalCode: '8000',
        role: 'USER',
        emailVerified: true,
        active: true
      }
    })

    // Create BetterAuth account record (without password for now)
    await prisma.account.upsert({
      where: {
        providerId_accountId: {
          providerId: 'credential',
          accountId: testUser.email
        }
      },
      update: {},
      create: {
        userId: testUser.id,
        accountId: testUser.email,
        providerId: 'credential',
        password: null // Will be set by BetterAuth when user registers
      }
    })

    // Create sample order for the test user
    const order = await prisma.order.create({
      data: {
        userId: testUser.id,
        packageId: fibrePackage.id,
        promotionId: promotion.id,
        status: 'INSTALLED',
        originalPrice: 799.00,
        discountAmount: 79.90,
        finalPrice: 719.10,
        installationDate: new Date('2024-11-15'),
        notes: 'Installation completed successfully'
      }
    })

    console.log('✅ Test user and data created successfully!')
    console.log('📧 Email: test@starcast.co.za')
    console.log('🔑 Note: Password will be set when user registers through BetterAuth')
    console.log(`👤 User ID: ${testUser.id}`)
    console.log(`📦 Order ID: ${order.id}`)
    console.log(`🏢 Package: ${fibrePackage.name} (${provider.name})`)
    console.log(`💰 Final Price: R${order.finalPrice} (${promotion.discountValue}% discount applied)`)
    console.log(`📅 Installation Date: ${order.installationDate.toDateString()}`)
    console.log('\n📋 Sample data created for dashboard testing')

  } catch (error) {
    console.error('❌ Error creating test user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createTestUser()