import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the CSV file
const csvContent = fs.readFileSync(path.join(__dirname, '..', 'Starcast_Fibre_Pricing_Industry_With_Formulas.csv'), 'utf-8');
const lines = csvContent.split('\n').filter(line => line.trim());

// Skip header line
const dataLines = lines.slice(1);

const packages = [];

dataLines.forEach((line, index) => {
  if (!line.trim()) return;
  
  const parts = line.split(';');
  if (parts.length < 8) return;
  
  const [provider, productName, downloadSpeed, uploadSpeed, terms, wholesalePrice, adjustedPercentage, retailPrice] = parts;
  
  if (!provider || !productName || !retailPrice) return;
  
  // Clean up provider name for use as slug
  const cleanProvider = provider.trim()
    .replace('TT Connect', 'TT Connect')
    .replace('MetroFibre Nexus', 'MetroFibre Nexus')
    .replace('MetroFibre Nova', 'MetroFibre Nova')
    .replace('Connectivity Services - Steyn City', 'Steyn City')
    .replace('Zoom Fibre', 'Zoom Fibre')
    .replace('Lightstruck - Zinkwazi Glenwood', 'Lightstruck')
    .replace('Port Edward - Paarl - Hermanus - Greytown', 'PPHG')
    .replace('Link Layer', 'Link Layer')
    .replace('TelkomOne', 'TelkomOne');
  
  // Generate unique ID
  const id = cleanProvider.toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '') + 
    '_' + 
    productName.toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
  
  // Speed format (Download/Upload)
  const speed = `${downloadSpeed}/${uploadSpeed}`;
  
  packages.push({
    id,
    name: productName.trim(),
    provider: cleanProvider,
    price: parseInt(retailPrice) || 0,
    type: 'FIBRE',
    speed,
    data: 'Uncapped',
    fupDescription: terms.trim() || 'Pro Rata applies to all Fibre Accounts',
    specialTerms: null
  });
});

// Generate the JavaScript array
const jsArray = packages.map(pkg => 
  `  { "id": "${pkg.id}", "name": "${pkg.name}", "provider": "${pkg.provider}", "price": ${pkg.price}, "type": "FIBRE", "speed": "${pkg.speed}", "data": "Uncapped", "fupDescription": "${pkg.fupDescription}", "specialTerms": null }`
).join(',\n');

const output = `// Complete fibre packages from official Starcast pricing CSV (${packages.length} packages)
const fibrePackagesData = [
${jsArray}
];

module.exports = { fibrePackagesData };`;

// Write to file
fs.writeFileSync(path.join(__dirname, 'generated-fibre-packages.js'), output);

console.log(`✅ Generated ${packages.length} fibre packages`);
console.log('📄 Output written to scripts/generated-fibre-packages.js');

// Also log provider summary
const providerCounts = {};
packages.forEach(pkg => {
  providerCounts[pkg.provider] = (providerCounts[pkg.provider] || 0) + 1;
});

console.log('\n📊 Provider breakdown:');
Object.entries(providerCounts).forEach(([provider, count]) => {
  console.log(`  ${provider}: ${count} packages`);
});