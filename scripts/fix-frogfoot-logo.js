// Script to fix Frogfoot logo to use placeholder
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🔍 Checking Frogfoot provider logo...')
  
  // Find Frogfoot provider
  const frogfoot = await prisma.provider.findFirst({
    where: {
      name: 'Frogfoot'
    }
  })
  
  if (!frogfoot) {
    console.log('❌ Frogfoot provider not found')
    return
  }
  
  console.log(`Current Frogfoot logo: ${frogfoot.logo}`)
  
  // Update to placeholder if it's not already
  if (frogfoot.logo !== '/assets/providers/placeholder.svg') {
    await prisma.provider.update({
      where: { id: frogfoot.id },
      data: { logo: '/assets/providers/placeholder.svg' }
    })
    console.log('✅ Updated Frogfoot logo to placeholder')
  } else {
    console.log('✅ Frogfoot already has placeholder logo')
  }
  
  // Show all provider logos for verification
  console.log('\n📋 All provider logos:')
  const providers = await prisma.provider.findMany({
    select: { name: true, logo: true }
  })
  
  providers.forEach(provider => {
    const status = provider.logo === '/assets/providers/placeholder.svg' ? '✅' : '❌'
    console.log(`${status} ${provider.name}: ${provider.logo}`)
  })
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })