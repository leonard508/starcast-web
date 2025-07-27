const fs = require('fs');
const path = require('path');
const { convertExcelToCSV, parseCSV, importFibreData } = require('./scripts/import-excel-data.js');

async function testExcelImport() {
  try {
    console.log('🧪 Testing Excel import functionality...');
    
    const excelFilePath = path.join(__dirname, 'Starcast_Fibre_Pricing_Industry_With_Formulas.xlsx');
    const outputDir = path.join(__dirname, 'data');
    
    // Check if Excel file exists
    if (!fs.existsSync(excelFilePath)) {
      console.log('❌ Excel file not found. Please ensure the file exists at:', excelFilePath);
      return;
    }
    
    console.log('✅ Excel file found');
    
    // Test CSV conversion
    console.log('\n📊 Testing CSV conversion...');
    const csvFiles = convertExcelToCSV(excelFilePath, outputDir);
    console.log(`✅ Converted ${csvFiles.length} sheets to CSV`);
    
    // Test CSV parsing
    console.log('\n📋 Testing CSV parsing...');
    if (csvFiles.length > 0) {
      const sampleData = parseCSV(csvFiles[0].data);
      console.log(`✅ Parsed ${sampleData.length} rows from ${csvFiles[0].sheetName}`);
      console.log('📋 Sample row structure:', JSON.stringify(sampleData[0], null, 2));
    }
    
    console.log('\n🎉 All tests passed!');
    console.log('\n📝 Next steps:');
    console.log('1. Run: npm run db:push (to ensure database is up to date)');
    console.log('2. Run: npm run import:excel (to import the data)');
    console.log('3. Or visit: http://localhost:3000/admin/import (to use the web interface)');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testExcelImport(); 