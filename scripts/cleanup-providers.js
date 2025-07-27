const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function cleanupProviders() {
  try {
    console.log('🧹 Starting provider cleanup...')

    // Find providers with external logo URLs or problematic names
    const problematicProviders = await prisma.provider.findMany({
      where: {
        OR: [
          { logo: { contains: 'starcast.co.za' } },
          { logo: { contains: 'http' } },
          { name: { contains: 'MetroFibre' } },
          { name: { contains: 'Metrofiber' } }
        ]
      }
    })

    console.log(`Found ${problematicProviders.length} problematic providers:`)
    problematicProviders.forEach(p => {
      console.log(`- ${p.name} (${p.slug}) - Logo: ${p.logo}`)
    })

    // Remove these providers and their packages
    for (const provider of problematicProviders) {
      console.log(`🗑️ Removing provider: ${provider.name}`)
      
      // Delete packages first
      await prisma.package.deleteMany({
        where: { providerId: provider.id }
      })
      
      // Delete promotions for this provider's packages
      await prisma.promotion.deleteMany({
        where: {
          package: {
            providerId: provider.id
          }
        }
      })
      
      // Delete the provider
      await prisma.provider.delete({
        where: { id: provider.id }
      })
      
      console.log(`✅ Removed provider: ${provider.name}`)
    }

    // Update remaining providers to use local logo paths
    const providersToUpdate = await prisma.provider.findMany({
      where: {
        name: {
          in: ['Frogfoot', 'Openserve', 'Vumatel']
        }
      }
    })

    for (const provider of providersToUpdate) {
      const logoMap = {
        'Frogfoot': '/assets/providers/frogfoot.svg',
        'Openserve': '/assets/providers/openserve.svg',
        'Vumatel': '/assets/providers/vumatel.svg'
      }
      
      if (logoMap[provider.name]) {
        await prisma.provider.update({
          where: { id: provider.id },
          data: { logo: logoMap[provider.name] }
        })
        console.log(`✅ Updated ${provider.name} logo to local path`)
      }
    }

    console.log('🎉 Provider cleanup completed!')
    
    // Show remaining providers
    const remainingProviders = await prisma.provider.findMany({
      include: {
        _count: {
          select: { packages: true }
        }
      }
    })
    
    console.log('\n📋 Remaining providers:')
    remainingProviders.forEach(p => {
      console.log(`- ${p.name} (${p.slug}) - ${p._count.packages} packages - Logo: ${p.logo || 'None'}`)
    })

  } catch (error) {
    console.error('❌ Error during cleanup:', error)
  } finally {
    await prisma.$disconnect()
  }
}

cleanupProviders() 