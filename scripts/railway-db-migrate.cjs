// Migrate database schema to Railway
const { execSync } = require('child_process')

console.log('🚀 Starting Railway database migration...')

try {
  console.log('📋 Generating Prisma client...')
  execSync('npx prisma generate', { stdio: 'inherit' })
  
  console.log('🔄 Pushing database schema...')
  execSync('npx prisma db push --force-reset', { stdio: 'inherit' })
  
  console.log('✅ Database migration completed!')
  
} catch (error) {
  console.error('❌ Migration failed:', error.message)
  process.exit(1)
}