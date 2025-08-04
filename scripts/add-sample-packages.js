import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const prisma = new PrismaClient()

const fibrePackages = [
  {
    name: "Fibre 10Mbps",
    type: "FIBRE",
    speed: "10Mbps",
    basePrice: 399,
    currentPrice: 399,
    active: true,
    featured: false,
    description: "Basic fibre internet for light browsing and email",
    providerId: "openserve"
  },
  {
    name: "Fibre 20Mbps",
    type: "FIBRE", 
    speed: "20Mbps",
    basePrice: 599,
    currentPrice: 549,
    active: true,
    featured: true,
    description: "Fast fibre for streaming and remote work",
    providerId: "openserve"
  },
  {
    name: "Fibre 50Mbps",
    type: "FIBRE",
    speed: "50Mbps", 
    basePrice: 899,
    currentPrice: 799,
    active: true,
    featured: true,
    description: "High-speed fibre for gaming and 4K streaming",
    providerId: "openserve"
  },
  {
    name: "Fibre 100Mbps",
    type: "FIBRE",
    speed: "100Mbps",
    basePrice: 1299,
    currentPrice: 1199,
    active: true,
    featured: false,
    description: "Ultra-fast fibre for heavy users and businesses",
    providerId: "vumatel"
  },
  {
    name: "Fibre 200Mbps",
    type: "FIBRE",
    speed: "200Mbps",
    basePrice: 1899,
    currentPrice: 1699,
    active: true,
    featured: false,
    description: "Premium fibre for demanding applications",
    providerId: "vumatel"
  }
]

const ltePackages = [
  {
    name: "LTE 5GB",
    type: "LTE_MOBILE",
    data: "5GB",
    basePrice: 199,
    currentPrice: 179,
    active: true,
    featured: false,
    description: "Basic LTE data for light mobile usage",
    providerId: "vodacom"
  },
  {
    name: "LTE 20GB", 
    type: "LTE_MOBILE",
    data: "20GB",
    basePrice: 499,
    currentPrice: 449,
    active: true,
    featured: true,
    description: "Popular LTE package for regular mobile users",
    providerId: "mtn"
  },
  {
    name: "LTE 50GB",
    type: "LTE_MOBILE", 
    data: "50GB",
    basePrice: 899,
    currentPrice: 799,
    active: true,
    featured: true,
    description: "High data allowance for heavy mobile users",
    providerId: "vodacom"
  },
  {
    name: "LTE Fixed 100GB",
    type: "LTE_FIXED",
    data: "100GB",
    basePrice: 699,
    currentPrice: 629,
    active: true,
    featured: false,
    description: "Fixed LTE solution for home internet",
    providerId: "telkom"
  },
  {
    name: "LTE Fixed Unlimited",
    type: "LTE_FIXED",
    data: "Unlimited",
    basePrice: 1299,
    currentPrice: 1199,
    active: true,
    featured: true,
    description: "Unlimited fixed LTE with fair usage policy",
    providerId: "rain"
  }
]

async function addSamplePackages() {
  try {
    console.log('🏗️ Adding sample packages...')
    
    // Add fibre packages
    console.log('📡 Adding fibre packages...')
    for (const pkg of fibrePackages) {
      await prisma.package.create({
        data: {
          ...pkg,
          id: `fibre-${pkg.speed.toLowerCase().replace('mbps', '')}`,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })
      console.log(`✅ Added: ${pkg.name}`)
    }
    
    // Add LTE packages
    console.log('📱 Adding LTE packages...')
    for (const pkg of ltePackages) {
      await prisma.package.create({
        data: {
          ...pkg,
          id: `lte-${pkg.data.toLowerCase().replace('gb', '').replace('unlimited', 'unlim')}`,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })
      console.log(`✅ Added: ${pkg.name}`)
    }
    
    console.log('🎉 All sample packages added successfully!')
    
    // Show summary
    const totalPackages = await prisma.package.count()
    const fibreCount = await prisma.package.count({ where: { type: 'FIBRE' } })
    const lteCount = await prisma.package.count({ where: { type: { in: ['LTE_MOBILE', 'LTE_FIXED'] } } })
    
    console.log(`📊 Package Summary:`)
    console.log(`   Total: ${totalPackages}`)
    console.log(`   Fibre: ${fibreCount}`) 
    console.log(`   LTE: ${lteCount}`)
    
  } catch (error) {
    console.error('❌ Error adding packages:', error)
  } finally {
    await prisma.$disconnect()
  }
}

addSamplePackages()