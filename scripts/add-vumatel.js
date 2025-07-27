const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function addVumatel() {
  try {
    console.log('➕ Adding Vumatel back to database...')

    // Add Vumatel provider
    const vumatelProvider = await prisma.provider.create({
      data: {
        name: 'Vumatel',
        slug: 'vumatel',
        logo: '/assets/providers/vumatel.svg',
        active: true
      }
    })

    console.log(`✅ Created Vumatel provider: ${vumatelProvider.id}`)

    // Add Vumatel packages
    const vumatelPackages = [
      {
        id: 'vumatel_10mbps',
        name: 'Vumatel Fibre 10/10 Mbps',
        speed: '10/10Mbps',
        price: 449,
        data: 'Unlimited'
      },
      {
        id: 'vumatel_20mbps',
        name: 'Vumatel Fibre 20/20 Mbps',
        speed: '20/20Mbps',
        price: 649,
        data: 'Unlimited'
      },
      {
        id: 'vumatel_50mbps',
        name: 'Vumatel Fibre 50/50 Mbps',
        speed: '50/50Mbps',
        price: 899,
        data: 'Unlimited'
      },
      {
        id: 'vumatel_100mbps',
        name: 'Vumatel Fibre 100/100 Mbps',
        speed: '100/100Mbps',
        price: 1199,
        data: 'Unlimited'
      }
    ]

    for (const pkg of vumatelPackages) {
      const packageRecord = await prisma.package.create({
        data: {
          id: pkg.id,
          name: pkg.name,
          providerId: vumatelProvider.id,
          type: 'FIBRE',
          speed: pkg.speed,
          data: pkg.data,
          basePrice: pkg.price,
          currentPrice: pkg.price,
          active: true
        }
      })
      console.log(`✅ Created Vumatel package: ${pkg.name}`)
    }

    console.log('🎉 Vumatel added successfully!')

  } catch (error) {
    console.error('❌ Error adding Vumatel:', error)
  } finally {
    await prisma.$disconnect()
  }
}

addVumatel() 