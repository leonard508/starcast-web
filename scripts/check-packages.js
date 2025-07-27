const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkPackages() {
  try {
    console.log('🔍 Checking all packages in database...')

    // Get all fibre packages with provider info
    const packages = await prisma.package.findMany({
      where: { type: 'FIBRE' },
      include: {
        provider: true
      },
      orderBy: [
        { provider: { name: 'asc' } },
        { currentPrice: 'asc' }
      ]
    })

    console.log(`\n📦 Found ${packages.length} fibre packages:`)
    console.log('='.repeat(80))

    packages.forEach((pkg, index) => {
      console.log(`${index + 1}. ${pkg.provider.name} - ${pkg.name}`)
      console.log(`   Speed: "${pkg.speed}" | Price: R${pkg.currentPrice} | ID: ${pkg.id}`)
      
      // Check for suspicious speed formats
      if (pkg.speed) {
        const speed = pkg.speed.toLowerCase()
        if (speed.includes('mbps') && speed.includes('/')) {
          const parts = speed.split('/')
          if (parts.length === 2) {
            const download = parts[0].replace(/[^0-9]/g, '')
            const upload = parts[1].replace(/[^0-9]/g, '')
            if (parseInt(download) < parseInt(upload)) {
              console.log(`   ⚠️  SUSPICIOUS: Download (${download}) < Upload (${upload})`)
            }
          }
        }
      }
      console.log('')
    })

    // Check for packages with no provider
    const orphanedPackages = await prisma.package.findMany({
      where: {
        type: 'FIBRE',
        provider: null
      }
    })

    if (orphanedPackages.length > 0) {
      console.log(`\n⚠️  Found ${orphanedPackages.length} orphaned packages (no provider):`)
      orphanedPackages.forEach(pkg => {
        console.log(`   - ${pkg.name} (ID: ${pkg.id})`)
      })
    }

    // Check for duplicate package IDs
    const packageIds = packages.map(p => p.id)
    const duplicates = packageIds.filter((id, index) => packageIds.indexOf(id) !== index)
    
    if (duplicates.length > 0) {
      console.log(`\n⚠️  Found duplicate package IDs: ${duplicates.join(', ')}`)
    }

    // Check for packages with zero or negative prices
    const invalidPrices = packages.filter(p => p.currentPrice <= 0)
    if (invalidPrices.length > 0) {
      console.log(`\n⚠️  Found ${invalidPrices.length} packages with invalid prices:`)
      invalidPrices.forEach(pkg => {
        console.log(`   - ${pkg.name}: R${pkg.currentPrice}`)
      })
    }

    console.log('\n✅ Package check completed!')

  } catch (error) {
    console.error('❌ Error checking packages:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkPackages() 