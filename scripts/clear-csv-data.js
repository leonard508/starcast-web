import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const prisma = new PrismaClient()

async function clearCSVData() {
  try {
    console.log('🧹 Clearing CSV imported data...')
    
    // Delete all price history first (foreign key constraint)
    const priceHistoryDeleted = await prisma.priceHistory.deleteMany({
      where: {
        changedBy: 'CSV_IMPORT'
      }
    })
    console.log(`🗑️ Deleted ${priceHistoryDeleted.count} price history records`)
    
    // Delete all packages
    const packagesDeleted = await prisma.package.deleteMany({})
    console.log(`🗑️ Deleted ${packagesDeleted.count} packages`)
    
    // Delete all providers
    const providersDeleted = await prisma.provider.deleteMany({})
    console.log(`🗑️ Deleted ${providersDeleted.count} providers`)
    
    console.log('✅ CSV data cleared successfully!')
    
    // Verify cleanup
    const remainingPackages = await prisma.package.count()
    const remainingProviders = await prisma.provider.count()
    const remainingPriceHistory = await prisma.priceHistory.count()
    
    console.log('📊 Database after cleanup:')
    console.log(`   Packages: ${remainingPackages}`)
    console.log(`   Providers: ${remainingProviders}`)
    console.log(`   Price History: ${remainingPriceHistory}`)
    
  } catch (error) {
    console.error('❌ Error clearing CSV data:', error)
  } finally {
    await prisma.$disconnect()
  }
}

clearCSVData()