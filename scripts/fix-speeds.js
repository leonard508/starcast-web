const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function fixSpeeds() {
  try {
    console.log('🔧 Fixing incorrect speed formats...')

    // Speed fixes based on package names
    const speedFixes = [
      // Evotel
      { id: 'evotel_20Mbps', correctSpeed: '20/10Mbps' },
      
      // Mitsol
      { id: 'mitsol_50Mbps', correctSpeed: '50/25Mbps' },
      
      // Octotel
      { id: 'octotel_55Mbps', correctSpeed: '55/25Mbps' },
      { id: 'octotel_300Mbps', correctSpeed: '300/200Mbps' },
      { id: 'octotel_500Mbps', correctSpeed: '500/200Mbps' },
      { id: 'octotel_1000Mbps', correctSpeed: '1000/200Mbps' },
      
      // Openserve
      { id: 'openserve_50Mbps', correctSpeed: '50/25Mbps' },
      { id: 'openserve_100Mbps', correctSpeed: '100/50Mbps' },
      { id: 'openserve_200Mbps', correctSpeed: '200/100Mbps' },
      { id: 'openserve_300Mbps', correctSpeed: '300/150Mbps' },
      { id: 'openserve_500Mbps', correctSpeed: '500/250Mbps' },
      
      // PPHG
      { id: 'port-edward---paarl---hermanus---greytown_50Mbps', correctSpeed: '50/25Mbps' },
      { id: 'port-edward---paarl---hermanus---greytown_100Mbps', correctSpeed: '100/50Mbps' },
      { id: 'port-edward---paarl---hermanus---greytown_200Mbps', correctSpeed: '200/100Mbps' },
      
      // Vodacom
      { id: 'vodacom_20Mbps', correctSpeed: '20/10Mbps' },
      { id: 'vodacom_50Mbps', correctSpeed: '50/25Mbps' },
      
      // Vuma
      { id: 'vuma_50Mbps', correctSpeed: '50/25Mbps' },
      { id: 'vuma_100Mbps', correctSpeed: '100/50Mbps' },
      { id: 'vuma_500Mbps', correctSpeed: '500/200Mbps' },
      { id: 'vuma_1000Mbps', correctSpeed: '1000/250Mbps' },
      
      // Zoom Fibre
      { id: 'zoom-fibre_500Mbps', correctSpeed: '500/250Mbps' },
      { id: 'zoom-fibre_1000Mbps', correctSpeed: '1000/500Mbps' }
    ]

    let fixedCount = 0
    for (const fix of speedFixes) {
      try {
        const updated = await prisma.package.update({
          where: { id: fix.id },
          data: { speed: fix.correctSpeed }
        })
        console.log(`✅ Fixed ${fix.id}: "${updated.speed}" → "${fix.correctSpeed}"`)
        fixedCount++
      } catch (error) {
        console.log(`⚠️  Could not fix ${fix.id}: ${error.message}`)
      }
    }

    console.log(`\n🎉 Fixed ${fixedCount} speed formats!`)

    // Show summary of remaining packages
    const packages = await prisma.package.findMany({
      where: { type: 'FIBRE' },
      include: { provider: true },
      orderBy: [{ provider: { name: 'asc' } }, { currentPrice: 'asc' }]
    })

    console.log('\n📋 Updated package summary:')
    console.log('='.repeat(80))
    
    packages.forEach((pkg, index) => {
      console.log(`${index + 1}. ${pkg.provider.name} - ${pkg.name}`)
      console.log(`   Speed: "${pkg.speed}" | Price: R${pkg.currentPrice}`)
      console.log('')
    })

  } catch (error) {
    console.error('❌ Error fixing speeds:', error)
  } finally {
    await prisma.$disconnect()
  }
}

fixSpeeds() 