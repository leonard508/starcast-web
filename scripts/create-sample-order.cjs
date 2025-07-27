const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function createSampleOrder() {
  try {
    console.log('📦 Creating sample order for registered user...')

    // Find the registered user
    const user = await prisma.user.findUnique({
      where: { email: 'test@starcast.co.za' }
    })

    if (!user) {
      console.log('❌ User not found. Please register first at: http://localhost:3002/register')
      return
    }

    console.log('👤 Found user:', user.email)

    // Create provider
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

    // Create package
    const fibrePackage = await prisma.package.upsert({
      where: { id: 'sample-package-1' },
      update: {},
      create: {
        id: 'sample-package-1',
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

    // Create order for the user
    const order = await prisma.order.create({
      data: {
        userId: user.id,
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

    console.log('✅ Sample order created successfully!')
    console.log(`📦 Package: ${fibrePackage.name} (${provider.name})`)
    console.log(`💰 Final Price: R${order.finalPrice} (${promotion.discountValue}% discount applied)`)
    console.log(`📅 Installation Date: ${order.installationDate.toDateString()}`)
    console.log(`🆔 Order ID: ${order.id}`)
    console.log('')
    console.log('🚀 Ready for testing:')
    console.log('📧 Email: test@starcast.co.za')
    console.log('🔑 Password: mypassword123')
    console.log('🌐 Login: http://localhost:3002/login')

  } catch (error) {
    console.error('❌ Error creating sample order:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createSampleOrder()