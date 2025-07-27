const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkUserCredentials() {
  try {
    console.log('🔍 Checking user credentials in database...\n')

    // Check User table
    const user = await prisma.user.findUnique({
      where: { email: 'test@starcast.co.za' }
    })

    if (user) {
      console.log('👤 User Record Found:')
      console.log(`   ID: ${user.id}`)
      console.log(`   Email: ${user.email}`)
      console.log(`   Name: ${user.name}`)
      console.log(`   First Name: ${user.firstName}`)
      console.log(`   Last Name: ${user.lastName}`)
      console.log(`   Email Verified: ${user.emailVerified}`)
      console.log(`   Active: ${user.active}`)
      console.log(`   Created: ${user.createdAt}`)
    } else {
      console.log('❌ No user found with email: test@starcast.co.za')
      return
    }

    console.log('\n🔐 BetterAuth Account Records:')
    
    // Check Account table (BetterAuth accounts)
    const accounts = await prisma.account.findMany({
      where: { userId: user.id }
    })

    if (accounts.length === 0) {
      console.log('❌ No BetterAuth account records found')
      console.log('💡 This means the user exists in the User table but has no authentication credentials')
      console.log('📋 The user needs to register through /register to create BetterAuth credentials')
    } else {
      accounts.forEach((account, index) => {
        console.log(`   Account ${index + 1}:`)
        console.log(`     Provider: ${account.providerId}`)
        console.log(`     Account ID: ${account.accountId}`)
        console.log(`     Has Password: ${account.password ? 'Yes (hashed)' : 'No'}`)
        console.log(`     Created: ${account.createdAt}`)
      })
    }

    // Check for active sessions
    console.log('\n🔗 Active Sessions:')
    const sessions = await prisma.session.findMany({
      where: { userId: user.id }
    })

    if (sessions.length === 0) {
      console.log('   No active sessions')
    } else {
      sessions.forEach((session, index) => {
        console.log(`   Session ${index + 1}: Expires ${session.expiresAt}`)
      })
    }

    // Check orders for this user
    console.log('\n📦 User Orders:')
    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      include: {
        package: {
          include: {
            provider: true
          }
        }
      }
    })

    if (orders.length === 0) {
      console.log('   No orders found')
    } else {
      orders.forEach((order, index) => {
        console.log(`   Order ${index + 1}: ${order.package.name} (${order.package.provider.name}) - Status: ${order.status}`)
      })
    }

  } catch (error) {
    console.error('❌ Error checking credentials:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkUserCredentials()