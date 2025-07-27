// Simple API test script
const fetch = require('node-fetch');

async function testAPI() {
  console.log('🧪 Testing Starcast Backend API...\n');

  const baseURL = 'http://localhost:3000/api';

  const tests = [
    {
      name: 'Packages API',
      url: `${baseURL}/packages`,
      description: 'Should return list of packages'
    },
    {
      name: 'Providers API', 
      url: `${baseURL}/providers`,
      description: 'Should return list of providers'
    },
    {
      name: 'Current Promotions',
      url: `${baseURL}/promotions?current=true`,
      description: 'Should return active promotions'
    }
  ];

  for (const test of tests) {
    try {
      console.log(`Testing: ${test.name}`);
      console.log(`URL: ${test.url}`);
      
      const response = await fetch(test.url);
      const data = await response.json();
      
      if (response.ok && data.success) {
        console.log(`✅ ${test.name} - Success!`);
        console.log(`   Count: ${data.count || 'N/A'}`);
        if (data.data && data.data.length > 0) {
          console.log(`   Sample: ${data.data[0].name || data.data[0].code || 'N/A'}`);
        }
      } else {
        console.log(`❌ ${test.name} - Failed`);
        console.log(`   Error: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.log(`❌ ${test.name} - Connection Error`);
      console.log(`   ${error.message}`);
    }
    console.log('');
  }
}

testAPI().catch(console.error);