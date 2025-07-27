const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function fixTestUser() {
  try {
    console.log('🔧 Fixing test user for BetterAuth compatibility...')

    // Delete existing test user and recreate properly
    const existingUser = await prisma.user.findUnique({
      where: { email: 'test@starcast.co.za' }
    })

    if (existingUser) {
      console.log('🗑️ Removing existing user records...')
      
      // Delete in dependency order
      await prisma.session.deleteMany({
        where: { userId: existingUser.id }
      })
      
      await prisma.account.deleteMany({
        where: { userId: existingUser.id }
      })
      
      // Don't delete orders and user - just update them
    }

    console.log('✅ Now use BetterAuth to register properly')
    console.log('📋 Instructions:')
    console.log('1. Go to: http://localhost:3002/register')
    console.log('2. Register with: test@starcast.co.za')
    console.log('3. Use any password (min 6 chars)')
    console.log('4. After registration, the dashboard will show your package')
    console.log('')
    console.log('🎯 This ensures BetterAuth creates all records with proper structure')

  } catch (error) {
    console.error('❌ Error fixing user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

fixTestUser()