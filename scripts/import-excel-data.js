const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Function to convert Excel to CSV
function convertExcelToCSV(excelFilePath, outputDir) {
  try {
    console.log('📊 Reading Excel file...');
    const workbook = XLSX.readFile(excelFilePath);
    
    // Get all sheet names
    const sheetNames = workbook.SheetNames;
    console.log('📋 Found sheets:', sheetNames);
    
    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
      console.log(`📁 Created output directory: ${outputDir}`);
    }
    
    // Convert each sheet to CSV
    const csvFiles = [];
    sheetNames.forEach(sheetName => {
      const worksheet = workbook.Sheets[sheetName];
      const csvData = XLSX.utils.sheet_to_csv(worksheet);
      
      const csvFileName = `${sheetName.replace(/[^a-zA-Z0-9]/g, '_')}.csv`;
      const csvFilePath = path.join(outputDir, csvFileName);
      
      fs.writeFileSync(csvFilePath, csvData);
      csvFiles.push({ sheetName, csvFilePath, data: csvData });
      
      console.log(`✅ Converted ${sheetName} to ${csvFileName}`);
    });
    
    return csvFiles;
  } catch (error) {
    console.error('❌ Error converting Excel to CSV:', error);
    throw error;
  }
}

// Function to parse CSV data (handles both comma and semicolon separated)
function parseCSV(csvData) {
  const lines = csvData.split('\n');
  const firstLine = lines[0];
  
  // Detect delimiter (comma or semicolon)
  const commaCount = (firstLine.match(/,/g) || []).length;
  const semicolonCount = (firstLine.match(/;/g) || []).length;
  const delimiter = semicolonCount > commaCount ? ';' : ',';
  
  const headers = firstLine.split(delimiter).map(h => h.trim().replace(/"/g, ''));
  const rows = [];
  
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim()) {
      const values = lines[i].split(delimiter).map(v => v.trim().replace(/"/g, ''));
      const row = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      rows.push(row);
    }
  }
  
  return rows;
}

// Function to import fibre data
async function importFibreData(csvFiles) {
  console.log('🚀 Starting fibre data import...');
  
  // Find the main pricing sheet (usually the first one or one with 'pricing' in name)
  const pricingSheet = csvFiles.find(file => 
    file.sheetName.toLowerCase().includes('pricing') || 
    file.sheetName.toLowerCase().includes('fibre') ||
    file.sheetName.toLowerCase().includes('packages')
  ) || csvFiles[0];
  
  console.log(`📊 Using sheet: ${pricingSheet.sheetName}`);
  
  const rows = parseCSV(pricingSheet.data);
  console.log(`📈 Found ${rows.length} rows of data`);
  
  // Log first few rows to understand structure
  console.log('📋 Sample data structure:');
  console.log(JSON.stringify(rows.slice(0, 3), null, 2));
  
  // Process each row
  for (const row of rows) {
    try {
      // Extract data based on actual Excel structure
      const provider = row.Provider
      const productName = row['Fibre Product Name']
      const downloadSpeed = row['Download Speed'] || row.Speed
      const uploadSpeed = row['Upload Speed']
      const wholesalePrice = row['Wholesale Price']
      const retailPrice = row['Retail Price']
      const terms = row.Terms
      
      // Skip empty rows or headers
      if (!provider || !productName || !retailPrice) {
        continue;
      }
      
      // Find or create provider
      const providerSlug = provider.toLowerCase().replace(/\s+/g, '-');
      let providerRecord = await prisma.provider.findUnique({
        where: { slug: providerSlug }
      });
      
      if (!providerRecord) {
        providerRecord = await prisma.provider.create({
          data: {
            name: provider,
            slug: providerSlug,
            active: true
          }
        });
        console.log(`✅ Created provider: ${provider}`);
      }
      
      // Create package ID
      const speedText = downloadSpeed || productName.replace(/[^a-zA-Z0-9]/g, '')
      const packageId = `${providerSlug}_${speedText}`;
      
      // Parse price - use retail price as primary, wholesale as fallback
      const price = parseFloat(retailPrice) || parseFloat(wholesalePrice) || 0;
      if (price === 0) {
        console.log(`⚠️ Skipping row with invalid price: ${provider} ${productName}`);
        continue;
      }
      
      // Create or update package
      const packageData = await prisma.package.upsert({
        where: { id: packageId },
        update: {
          currentPrice: price,
          updatedAt: new Date()
        },
        create: {
          id: packageId,
          name: productName,
          providerId: providerRecord.id,
          type: 'FIBRE',
          speed: downloadSpeed || productName,
          data: 'Unlimited',
          aup: terms || null,
          throttle: null,
          basePrice: price,
          currentPrice: price,
          active: true
        }
      });
      
      console.log(`✅ Created/Updated package: ${packageData.name} - R${price}`);
      
      // Create price history entry if it's a new package
      const existingHistory = await prisma.priceHistory.findFirst({
        where: { packageId: packageData.id }
      });
      
      if (!existingHistory) {
        await prisma.priceHistory.create({
          data: {
            packageId: packageData.id,
            oldPrice: 0,
            newPrice: price,
            changedBy: 'excel_import',
            reason: 'Initial import from Excel pricing sheet'
          }
        });
      }
      
    } catch (error) {
      console.error(`❌ Error processing row:`, row, error);
    }
  }
  
  console.log('🎉 Fibre data import completed!');
}

// Function to import fibre data directly from rows
async function importFibreDataFromRows(rows) {
  console.log('🚀 Starting fibre data import from CSV...');
  
  // Log first few rows to understand structure
  console.log('📋 Sample data structure:');
  console.log(JSON.stringify(rows.slice(0, 3), null, 2));
  
  // Process each row
  for (const row of rows) {
    try {
      // Extract data based on actual CSV structure
      const provider = row.Provider
      const productName = row['Fibre Product Name']
      const downloadSpeed = row['Download Speed']
      const uploadSpeed = row['Upload Speed']
      const wholesalePrice = row['Wholesale Price']
      const retailPrice = row['Retail Price']
      const terms = row.Terms
      
      // Skip empty rows or headers
      if (!provider || !productName || !retailPrice) {
        continue;
      }
      
      // Find or create provider
      const providerSlug = provider.toLowerCase().replace(/\s+/g, '-');
      let providerRecord = await prisma.provider.findUnique({
        where: { slug: providerSlug }
      });
      
      if (!providerRecord) {
        providerRecord = await prisma.provider.create({
          data: {
            name: provider,
            slug: providerSlug,
            active: true
          }
        });
        console.log(`✅ Created provider: ${provider}`);
      }
      
      // Create package ID
      const speedText = downloadSpeed || productName.replace(/[^a-zA-Z0-9]/g, '')
      const packageId = `${providerSlug}_${speedText}`;
      
      // Parse price - use retail price as primary, wholesale as fallback
      const price = parseFloat(retailPrice) || parseFloat(wholesalePrice) || 0;
      if (price === 0) {
        console.log(`⚠️ Skipping row with invalid price: ${provider} ${productName}`);
        continue;
      }
      
      // Create or update package
      const packageData = await prisma.package.upsert({
        where: { id: packageId },
        update: {
          currentPrice: price,
          updatedAt: new Date()
        },
        create: {
          id: packageId,
          name: productName,
          providerId: providerRecord.id,
          type: 'FIBRE',
          speed: downloadSpeed || productName,
          data: 'Unlimited',
          aup: terms || null,
          throttle: null,
          basePrice: price,
          currentPrice: price,
          active: true
        }
      });
      
      console.log(`✅ Created/Updated package: ${packageData.name} - R${price}`);
      
      // Create price history entry if it's a new package
      const existingHistory = await prisma.priceHistory.findFirst({
        where: { packageId: packageData.id }
      });
      
      if (!existingHistory) {
        await prisma.priceHistory.create({
          data: {
            packageId: packageData.id,
            oldPrice: 0,
            newPrice: price,
            changedBy: 'csv_import',
            reason: 'Initial import from CSV pricing sheet'
          }
        });
      }
      
    } catch (error) {
      console.error(`❌ Error processing row:`, row, error);
    }
  }
  
  console.log('🎉 Fibre data import from CSV completed!');
}

// Main function
async function main() {
  try {
    const csvFilePath = path.join(__dirname, '..', 'Starcast_Fibre_Pricing_Industry_With_Formulas.csv');
    const excelFilePath = path.join(__dirname, '..', 'Starcast_Fibre_Pricing_Industry_With_Formulas.xlsx');
    
    // Check if CSV file exists first, otherwise use Excel
    let csvData;
    if (fs.existsSync(csvFilePath)) {
      console.log('📊 Reading CSV file...');
      csvData = fs.readFileSync(csvFilePath, 'utf8');
      const rows = parseCSV(csvData);
      console.log(`📈 Found ${rows.length} rows in CSV`);
      
      // Import data directly from CSV
      await importFibreDataFromRows(rows);
    } else if (fs.existsSync(excelFilePath)) {
      console.log('📊 Reading Excel file...');
      const outputDir = path.join(__dirname, '..', 'data');
      
      // Create output directory if it doesn't exist
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      
      // Convert Excel to CSV
      const csvFiles = convertExcelToCSV(excelFilePath, outputDir);
      
      // Import data
      await importFibreData(csvFiles);
    } else {
      throw new Error('Neither CSV nor Excel file found');
    }
    
    console.log('✅ All operations completed successfully!');
    
  } catch (error) {
    console.error('❌ Error in main process:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { convertExcelToCSV, parseCSV, importFibreData };