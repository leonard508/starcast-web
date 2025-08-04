// Seed Railway database with package data
const { execSync } = require('child_process')

console.log('🌱 Starting Railway database seeding...')

try {
  console.log('📋 Generating Prisma client...')
  execSync('npx prisma generate --no-engine', { stdio: 'inherit' })
  
  console.log('🔄 Pushing database schema...')
  execSync('npx prisma db push', { stdio: 'inherit' })
  
  console.log('🌱 Running database seed...')
  execSync('npx tsx prisma/seed.ts', { stdio: 'inherit' })
  
  console.log('✅ Database seeding completed!')
  
} catch (error) {
  console.error('❌ Seeding failed:', error.message)
  
  // Try alternative seeding methods
  console.log('🔄 Trying alternative seed method...')
  try {
    execSync('npx prisma db seed', { stdio: 'inherit' })
    console.log('✅ Alternative seeding successful!')
  } catch (altError) {
    console.error('❌ Alternative seeding also failed:', altError.message)
    process.exit(1)
  }
}