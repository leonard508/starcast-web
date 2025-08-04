// Import CSV data directly to Railway database
const { PrismaClient } = require('@prisma/client')
const fs = require('fs')

const prisma = new PrismaClient({
  log: ['info', 'warn', 'error'],
})

function parseCSV(filePath, delimiter = ',') {
  console.log(`📂 Reading CSV file: ${filePath}`)
  const content = fs.readFileSync(filePath, 'utf-8')
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
  
  console.log(`📊 Parsed ${data.length} rows from CSV`)
  return data
}

async function importData() {
  try {
    console.log('🚀 Starting Railway data import...')
    
    // Test connection
    console.log('📡 Testing database connection...')
    await prisma.$queryRaw`SELECT 1`
    console.log('✅ Database connection successful')
    
    // Clear existing data
    console.log('🧹 Clearing existing package data...')
    await prisma.package.deleteMany({})
    await prisma.provider.deleteMany({})
    console.log('✅ Existing data cleared')
    
    // Read CSV data
    const csvData = parseCSV('./data/Sheet1.csv')
    
    // Extract unique providers
    const providerNames = [...new Set(csvData.map(row => row.Provider).filter(Boolean))]
    console.log(`📋 Found ${providerNames.length} providers:`, providerNames.join(', '))
    
    // Create providers
    const providers = []
    for (const providerName of providerNames) {
      const provider = await prisma.provider.create({
        data: {
          name: providerName,
          slug: providerName.toLowerCase().replace(/\s+/g, '-'),
          active: true
        }
      })
      providers.push(provider)
      console.log(`✅ Created provider: ${providerName}`)
    }
    
    // Create packages
    let packageCount = 0
    for (const row of csvData) {
      if (!row.Provider || !row.Speed || !row.Price) continue
      
      const provider = providers.find(p => p.name === row.Provider)
      if (!provider) continue
      
      const packageId = `${provider.slug}_${row.Speed.toLowerCase().replace(/[^a-z0-9]/g, '_')}`
      const packageName = `${row.Provider} ${row.Speed}`
      
      await prisma.package.create({
        data: {
          id: packageId,
          name: packageName,
          providerId: provider.id,
          type: 'FIBRE',
          speed: row.Speed,
          data: 'Uncapped',
          fupDescription: 'Pro Rata applies to all Fibre Accounts',
          technology: 'Fibre',
          basePrice: parseInt(row.Price) || 0,
          currentPrice: parseInt(row.Price) || 0,
          active: true
        }
      })
      packageCount++
      
      if (packageCount % 10 === 0) {
        console.log(`📦 Created ${packageCount} packages...`)
      }
    }
    
    console.log(`✅ Import completed! Created ${providers.length} providers and ${packageCount} packages`)
    
  } catch (error) {
    console.error('❌ Import failed:', error.message)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

importData()