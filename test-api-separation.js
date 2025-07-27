// Test script to verify API separation between fibre and LTE endpoints
const BASE_URL = 'http://localhost:3000'

async function testAPISeparation() {
  console.log('🧪 Testing API Separation between Fibre and LTE endpoints...\n')

  try {
    // Test 1: Fibre packages endpoint
    console.log('1️⃣ Testing /api/fibre-packages endpoint...')
    const fibreResponse = await fetch(`${BASE_URL}/api/fibre-packages`)
    const fibreData = await fibreResponse.json()
    
    if (fibreData.success) {
      console.log(`✅ Fibre packages found: ${fibreData.count}`)
      console.log(`📊 Response type: ${fibreData.type}`)
      
      // Verify all packages are fibre type
      const nonFibrePackages = fibreData.data.filter(pkg => pkg.type !== 'FIBRE')
      if (nonFibrePackages.length === 0) {
        console.log('✅ All packages are correctly filtered to FIBRE type')
      } else {
        console.log(`❌ Found ${nonFibrePackages.length} non-fibre packages in fibre endpoint`)
      }
    } else {
      console.log('❌ Fibre packages endpoint failed:', fibreData.error)
    }

    console.log('')

    // Test 2: LTE packages endpoint
    console.log('2️⃣ Testing /api/lte-packages endpoint...')
    const lteResponse = await fetch(`${BASE_URL}/api/lte-packages`)
    const lteData = await lteResponse.json()
    
    if (lteData.success) {
      console.log(`✅ LTE packages found: ${lteData.count}`)
      console.log(`📊 Response type: ${lteData.type}`)
      
      // Verify all packages are LTE type
      const nonLTEPackages = lteData.data.filter(pkg => !pkg.type.startsWith('LTE'))
      if (nonLTEPackages.length === 0) {
        console.log('✅ All packages are correctly filtered to LTE types')
      } else {
        console.log(`❌ Found ${nonLTEPackages.length} non-LTE packages in LTE endpoint`)
      }
    } else {
      console.log('❌ LTE packages endpoint failed:', lteData.error)
    }

    console.log('')

    // Test 3: Original packages endpoint (should still work)
    console.log('3️⃣ Testing original /api/packages endpoint...')
    const originalResponse = await fetch(`${BASE_URL}/api/packages`)
    const originalData = await originalResponse.json()
    
    if (originalData.success) {
      console.log(`✅ Original packages endpoint works: ${originalData.count} packages`)
    } else {
      console.log('❌ Original packages endpoint failed:', originalData.error)
    }

    console.log('')

    // Test 4: Compare package counts
    if (fibreData.success && lteData.success && originalData.success) {
      console.log('4️⃣ Package Count Comparison:')
      console.log(`📡 Fibre packages: ${fibreData.count}`)
      console.log(`📱 LTE packages: ${lteData.count}`)
      console.log(`📦 Total packages (original endpoint): ${originalData.count}`)
      
      const expectedTotal = fibreData.count + lteData.count
      if (originalData.count >= expectedTotal) {
        console.log('✅ Package counts are consistent')
      } else {
        console.log('⚠️ Package counts may have some overlap or missing packages')
      }
    }

    console.log('')
    console.log('🎉 API separation test completed!')

  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

// Run the test
testAPISeparation()