// Script to clean database and import only CSV fibre data
const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

async function main() {
  console.log('🧹 Cleaning database...')
  
  // 1. Delete all existing packages and providers
  console.log('Deleting all existing packages...')
  await prisma.package.deleteMany()
  
  console.log('Deleting all existing providers...')
  await prisma.provider.deleteMany()
  
  // 2. Read and parse CSV data
  console.log('Reading CSV data...')
  const csvPath = path.join(__dirname, '..', 'Starcast_Fibre_Pricing_Industry_With_Formulas.csv')
  const csvContent = fs.readFileSync(csvPath, 'utf-8')
  
  const lines = csvContent.split('\n').filter(line => line.trim())
  const header = lines[0].split(';')
  console.log('CSV Header:', header)
  
  const packages = []
  const providerMap = new Map()
  
  // 3. Process each CSV row
  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split(';')
    if (row.length < 8) continue
    
    const [providerName, productName, downloadSpeed, uploadSpeed, terms, wholesalePrice, adjustedPercentage, retailPrice] = row
    
    if (!providerName || !productName || !retailPrice) continue
    
    // Create provider if doesn't exist
    if (!providerMap.has(providerName)) {
      const provider = await prisma.provider.create({
        data: {
          name: providerName,
          slug: providerName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          logo: '/assets/providers/placeholder.svg', // Use placeholder for all
          active: true
        }
      })
      providerMap.set(providerName, provider)
      console.log(`✅ Created provider: ${providerName}`)
    }
    
    // Create package
    const provider = providerMap.get(providerName)
    const price = parseFloat(retailPrice)
    
    if (isNaN(price)) {
      console.log(`⚠️ Skipping ${productName} - invalid price: ${retailPrice}`)
      continue
    }
    
    const packageData = {
      name: productName,
      providerId: provider.id,
      type: 'FIBRE',
      speed: `${downloadSpeed}/${uploadSpeed}`,
      data: 'Unlimited',
      aup: terms,
      basePrice: price,
      currentPrice: price,
      active: true,
      featured: false
    }
    
    const createdPackage = await prisma.package.create({ data: packageData })
    packages.push(createdPackage)
    console.log(`✅ Created package: ${productName} - R${price}`)
  }
  
  console.log(`\n🎉 Database cleaned and updated!`)
  console.log(`📦 Created ${providerMap.size} providers`)
  console.log(`📋 Created ${packages.length} fibre packages`)
  console.log(`🚫 Removed all non-fibre and fake packages`)
  
  // 4. Show summary by provider
  console.log('\n📊 Summary by Provider:')
  for (const [name, provider] of providerMap) {
    const count = packages.filter(p => p.providerId === provider.id).length
    console.log(`  ${name}: ${count} packages`)
  }
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })