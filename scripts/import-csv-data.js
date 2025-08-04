import { PrismaClient } from '@prisma/client'
import { readFileSync } from 'fs'
import dotenv from 'dotenv'

// Load environment variables - make sure we use Docker database
dotenv.config({ path: '.env.local' })
dotenv.config({ path: '.env' })

const prisma = new PrismaClient()

function parseCSV(filePath, delimiter = ',') {
  const content = readFileSync(filePath, 'utf-8')
  const lines = content.split('\n').filter(line => line.trim())
  
  if (lines.length === 0) return []
  
  const headers = lines[0].split(delimiter).map(h => h.trim())
  const data = []
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(delimiter).map(v => v.trim())
    const row = {}
    headers.forEach((header, index) => {
      row[header] = values[index] || ''
    })
    data.push(row)
  }
  
  return data
}

async function importCSVData() {
  try {
    console.log('📊 Starting CSV import...')
    
    // Parse CSV file
    console.log('📄 Reading CSV file...')
    const csvData = parseCSV('./data/Sheet1.csv')
    
    console.log(`📈 Found ${csvData.length} records in CSV`)
    console.log('📋 Sample data:', JSON.stringify(csvData[0], null, 2))
    
    const results = {
      providersCreated: 0,
      packagesCreated: 0,
      packagesUpdated: 0,
      errors: []
    }
    
    // Process each row
    for (const row of csvData) {
      try {
        const provider = row.Provider
        const productName = row['Fibre Product Name']
        const downloadSpeed = row['Download Speed']
        const uploadSpeed = row['Upload Speed'] 
        const wholesalePrice = parseFloat(row['Wholesale Price']) || 0
        const retailPrice = parseFloat(row['Retail Price']) || wholesalePrice
        const terms = row.Terms
        
        // Skip invalid rows
        if (!provider || !productName || !retailPrice) {
          console.log(`⚠️ Skipping invalid row: ${provider} - ${productName}`)
          continue
        }
        
        // Create provider slug
        const providerSlug = provider.toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '')
        
        // Find or create provider
        let providerRecord = await prisma.provider.findUnique({
          where: { slug: providerSlug }
        })
        
        if (!providerRecord) {
          providerRecord = await prisma.provider.create({
            data: {
              name: provider,
              slug: providerSlug,
              active: true
            }
          })
          results.providersCreated++
          console.log(`✅ Created provider: ${provider}`)
        }
        
        // Create package ID
        const speedText = downloadSpeed.replace(/[^0-9]/g, '')
        const packageId = `${providerSlug}-${speedText}mbps`
        
        // Create full speed text
        const fullSpeed = uploadSpeed && uploadSpeed !== downloadSpeed 
          ? `${downloadSpeed}/${uploadSpeed}`
          : downloadSpeed
        
        // Create or update package
        const existingPackage = await prisma.package.findUnique({
          where: { id: packageId }
        })
        
        if (existingPackage) {
          // Update existing package
          await prisma.package.update({
            where: { id: packageId },
            data: {
              currentPrice: retailPrice,
              basePrice: wholesalePrice,
              updatedAt: new Date()
            }
          })
          results.packagesUpdated++
          console.log(`🔄 Updated: ${productName}`)
        } else {
          // Create new package
          await prisma.package.create({
            data: {
              id: packageId,
              name: productName,
              providerId: providerRecord.id,
              type: 'FIBRE',
              speed: fullSpeed,
              data: 'Unlimited',
              specialTerms: terms,
              basePrice: wholesalePrice,
              currentPrice: retailPrice,
              active: true,
              featured: false
            }
          })
          results.packagesCreated++
          console.log(`✅ Created: ${productName}`)
          
          // Create price history entry
          await prisma.priceHistory.create({
            data: {
              packageId: packageId,
              oldPrice: 0,
              newPrice: retailPrice,
              changedBy: 'CSV_IMPORT',
              reason: `Initial import from CSV - ${provider} ${productName}`
            }
          })
        }
        
      } catch (error) {
        const errorMsg = `Error processing ${row.Provider} ${row['Fibre Product Name']}: ${error.message}`
        results.errors.push(errorMsg)
        console.error(`❌ ${errorMsg}`)
      }
    }
    
    console.log('\n🎉 CSV import completed!')
    console.log('📊 Results:')
    console.log(`   Providers created: ${results.providersCreated}`)
    console.log(`   Packages created: ${results.packagesCreated}`)
    console.log(`   Packages updated: ${results.packagesUpdated}`)
    console.log(`   Errors: ${results.errors.length}`)
    
    if (results.errors.length > 0) {
      console.log('\n❌ Errors encountered:')
      results.errors.forEach(error => console.log(`   - ${error}`))
    }
    
    // Show final database summary
    const totalProviders = await prisma.provider.count()
    const totalPackages = await prisma.package.count()
    const fibrePackages = await prisma.package.count({ where: { type: 'FIBRE' } })
    
    console.log('\n📈 Database Summary:')
    console.log(`   Total Providers: ${totalProviders}`)
    console.log(`   Total Packages: ${totalPackages}`)
    console.log(`   Fibre Packages: ${fibrePackages}`)
    
  } catch (error) {
    console.error('❌ Fatal error during CSV import:', error)
  } finally {
    await prisma.$disconnect()
  }
}

importCSVData()