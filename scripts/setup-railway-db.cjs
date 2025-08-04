// Setup Railway Database Schema and Data
const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

async function setupRailwayDatabase() {
  console.log('🚀 Setting up Railway database...')
  
  const prisma = new PrismaClient({
    log: ['info', 'warn', 'error'],
  })
  
  try {
    // Test connection
    console.log('📡 Testing database connection...')
    await prisma.$queryRaw`SELECT 1`
    console.log('✅ Database connection successful')
    
    // Check if tables exist
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `
    console.log('📋 Existing tables:', tables.map(t => t.table_name))
    
    // Check for package data
    try {
      const packageCount = await prisma.package.count()
      const providerCount = await prisma.provider.count()
      console.log(`📊 Current data: ${packageCount} packages, ${providerCount} providers`)
      
      if (packageCount === 0) {
        console.log('⚠️ No package data found. Database schema exists but needs data import.')
      } else {
        console.log('✅ Database has data already')
      }
    } catch (error) {
      console.log('⚠️ Package table not accessible:', error.message)
    }
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

setupRailwayDatabase()