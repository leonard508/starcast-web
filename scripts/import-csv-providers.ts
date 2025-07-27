import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

interface CSVRow {
  Provider: string
  'Fibre Product Name': string
  'Download Speed': string
  'Upload Speed': string
  Terms: string
  'Wholesale Price': string
  'Adjusted Percentage': string
  'Retail Price': string
  [key: string]: string // Allow any additional properties
}

function parseCSV(content: string): CSVRow[] {
  const lines = content.trim().split('\n')
  const headers = lines[0].split(';')
  
  console.log('📋 CSV Headers:', headers)
  
  return lines.slice(1).map((line, index) => {
    const values = line.split(';')
    const row: any = {}
    headers.forEach((header, headerIndex) => {
      row[header] = values[headerIndex]?.trim() || ''
    })
    
    // Debug first few rows
    if (index < 3) {
      console.log(`🔍 Row ${index + 1}:`, row)
    }
    
    return row as CSVRow
  })
}

function createProviderSlug(providerName: string): string {
  return providerName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function createPackageId(providerName: string, productName: string): string {
  const provider = createProviderSlug(providerName)
  const product = productName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
  return `${provider}_${product}`
}

function formatSpeed(downloadSpeed: string, uploadSpeed: string): string {
  const down = downloadSpeed.replace('Mbps', '').trim()
  const up = uploadSpeed.replace('Mbps', '').trim()
  return `${down}/${up}Mbps`
}

async function main() {
  console.log('🚀 Starting CSV import...')
  
  // Read CSV file
  const csvPath = path.join(process.cwd(), 'Starcast_Fibre_Pricing_Industry_With_Formulas.csv')
  const csvContent = fs.readFileSync(csvPath, 'utf-8')
  
  // Parse CSV
  const rows = parseCSV(csvContent)
  console.log(`📊 Found ${rows.length} package entries`)
  
  // Group by provider
  const providerPackages: Record<string, CSVRow[]> = {}
  rows.forEach(row => {
    if (!row.Provider || !row['Fibre Product Name']) return
    
    if (!providerPackages[row.Provider]) {
      providerPackages[row.Provider] = []
    }
    providerPackages[row.Provider].push(row)
  })
  
  console.log(`🏢 Found ${Object.keys(providerPackages).length} unique providers`)
  
  // Create providers
  const createdProviders: Record<string, any> = {}
  
  for (const providerName of Object.keys(providerPackages)) {
    const slug = createProviderSlug(providerName)
    
    try {
      const provider = await prisma.provider.upsert({
        where: { slug },
        update: {
          name: providerName,
          active: true
        },
        create: {
          name: providerName,
          slug,
          active: true
        }
      })
      
      createdProviders[providerName] = provider
      console.log(`✅ Provider: ${providerName} (${provider.id})`)
    } catch (error) {
      console.error(`❌ Failed to create provider ${providerName}:`, error)
    }
  }
  
  // Create packages
  let packagesCreated = 0
  let packagesSkipped = 0
  
  for (const [providerName, packages] of Object.entries(providerPackages)) {
    const provider = createdProviders[providerName]
    if (!provider) {
      console.error(`❌ Provider ${providerName} not found, skipping packages`)
      continue
    }
    
    for (const packageData of packages) {
      const packageId = createPackageId(providerName, packageData['Fibre Product Name'])
      const retailPriceField = packageData['Retail Price'] || packageData['Retail Price\r'] || ''
      const priceString = retailPriceField.replace(/[^0-9.]/g, '')
      const retailPrice = parseFloat(priceString)
      
      if (isNaN(retailPrice) || retailPrice <= 0) {
        console.warn(`⚠️ Invalid price "${packageData['Retail Price']}" for ${packageData['Fibre Product Name']}, skipping`)
        packagesSkipped++
        continue
      }
      
      try {
        const pkg = await prisma.package.upsert({
          where: { id: packageId },
          update: {
            name: packageData['Fibre Product Name'],
            currentPrice: retailPrice,
            basePrice: retailPrice
          },
          create: {
            id: packageId,
            name: packageData['Fibre Product Name'],
            providerId: provider.id,
            type: 'FIBRE',
            speed: formatSpeed(packageData['Download Speed'], packageData['Upload Speed']),
            data: 'Unlimited',
            aup: packageData.Terms || 'Pro Rata applies to all Fibre Accounts',
            basePrice: retailPrice,
            currentPrice: retailPrice,
            active: true,
            featured: false
          }
        })
        
        packagesCreated++
        console.log(`  📦 ${packageData['Fibre Product Name']} - R${retailPrice}`)
      } catch (error) {
        console.error(`❌ Failed to create package ${packageData['Fibre Product Name']}:`, error)
        packagesSkipped++
      }
    }
  }
  
  console.log(`\n🎉 Import completed!`)
  console.log(`✅ Providers processed: ${Object.keys(createdProviders).length}`)
  console.log(`✅ Packages created: ${packagesCreated}`)
  console.log(`⚠️ Packages skipped: ${packagesSkipped}`)
}

main()
  .catch((e) => {
    console.error('❌ Import failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })