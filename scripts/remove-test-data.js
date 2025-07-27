import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function removeTestData() {
  try {
    console.log('🧹 Removing test data from database...\n')

    // Remove test promotions first (they reference packages)
    const deletedPromotions = await prisma.promotion.deleteMany({
      where: {
        OR: [
          { code: 'TESTFIBRE20' },
          { code: 'TESTLTE15' },
          { code: 'TESTMOBILE10' }
        ]
      }
    })
    console.log(`✅ Deleted ${deletedPromotions.count} test promotions`)

    // Remove test packages
    const deletedPackages = await prisma.package.deleteMany({
      where: {
        OR: [
          { name: '100Mbps Uncapped Fibre' },
          { name: '50Mbps LTE Fixed' },
          { name: '25Mbps LTE Mobile' }
        ]
      }
    })
    console.log(`✅ Deleted ${deletedPackages.count} test packages`)

    // Remove test providers
    const deletedProviders = await prisma.provider.deleteMany({
      where: {
        OR: [
          { slug: 'test-fibre-provider' },
          { slug: 'test-lte-provider' }
        ]
      }
    })
    console.log(`✅ Deleted ${deletedProviders.count} test providers`)

    // Remove any price history entries for test packages
    const deletedPriceHistory = await prisma.priceHistory.deleteMany({
      where: {
        package: {
          OR: [
            { name: '100Mbps Uncapped Fibre' },
            { name: '50Mbps LTE Fixed' },
            { name: '25Mbps LTE Mobile' }
          ]
        }
      }
    })
    console.log(`✅ Deleted ${deletedPriceHistory.count} test price history entries`)

    console.log('\n🎉 Test data removal completed successfully!')
    console.log('📝 Only factual, real data remains in the database.')

  } catch (error) {
    console.error('❌ Error removing test data:', error)
  } finally {
    await prisma.$disconnect()
  }
}

removeTestData() 