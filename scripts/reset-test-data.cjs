const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function resetTestData() {
  try {
    console.log('🧹 Resetting test data...')

    // Delete in order of dependencies
    await prisma.session.deleteMany({})
    await prisma.account.deleteMany({})
    await prisma.document.deleteMany({})
    await prisma.order.deleteMany({})
    await prisma.user.deleteMany({})
    await prisma.promotion.deleteMany({})
    await prisma.package.deleteMany({})
    await prisma.provider.deleteMany({})

    console.log('✅ All test data cleared!')
    console.log('📋 You can now:')
    console.log('1. Run: node scripts/create-test-user.cjs (to recreate sample data)')
    console.log('2. Register new users at: http://localhost:3002/register')
    console.log('3. Login with registered users at: http://localhost:3002/login')

  } catch (error) {
    console.error('❌ Error resetting data:', error)
  } finally {
    await prisma.$disconnect()
  }
}

resetTestData()