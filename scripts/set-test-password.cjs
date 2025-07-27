const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function setTestPassword() {
  try {
    console.log('🔑 Setting password for test@starcast.co.za...')

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email: 'test@starcast.co.za' }
    })

    if (!user) {
      console.log('❌ User not found')
      return
    }

    // Hash the password
    const password = 'testpass123'
    const hashedPassword = await bcrypt.hash(password, 12)

    // Update the account record with the password
    await prisma.account.updateMany({
      where: {
        userId: user.id,
        providerId: 'credential'
      },
      data: {
        password: hashedPassword
      }
    })

    console.log('✅ Password set successfully!')
    console.log('📧 Email: test@starcast.co.za')
    console.log('🔑 Password: testpass123')
    console.log('🚀 You can now login at: http://localhost:3002/login')

  } catch (error) {
    console.error('❌ Error setting password:', error)
    console.log('💡 Make sure to install bcryptjs: npm install bcryptjs')
  } finally {
    await prisma.$disconnect()
  }
}

setTestPassword()