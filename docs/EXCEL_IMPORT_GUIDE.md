# Excel Import Guide for Starcast Fibre Pricing

This guide explains how to import fibre pricing data from Excel files into the Starcast Next.js application.

## Overview

The application supports importing fibre package pricing data from Excel files (.xlsx, .xls) through multiple methods:

1. **Command Line Import** - Direct script execution
2. **Web Interface** - Admin upload page
3. **API Endpoint** - Programmatic import

## Prerequisites

- Node.js and npm installed
- Database set up and running
- Excel file with fibre pricing data

## Excel File Format

Your Excel file should contain the following columns (column names are flexible):

| Column | Description | Example |
|--------|-------------|---------|
| Provider/ISP | Internet Service Provider name | "Frogfoot", "Vumatel", "Openserve" |
| Speed/Bandwidth | Connection speed | "10/2Mbps", "100/20Mbps" |
| Price/Cost | Monthly price in Rands | 399, 799 |
| Data/Limit | Data allowance | "Unlimited", "500GB" |
| AUP | Acceptable Use Policy | "200GB" (optional) |
| Throttle | Throttling info | "2Mbps after FUP" (optional) |

### Example Excel Structure

```
Provider    | Speed      | Price | Data      | AUP   | Throttle
Frogfoot    | 10/2Mbps   | 389   | Unlimited | 200GB | 2Mbps after FUP
Vumatel     | 20/20Mbps  | 649   | Unlimited | 300GB | 4Mbps after FUP
Openserve   | 50/10Mbps  | 799   | Unlimited | 500GB | 10Mbps after FUP
```

## Import Methods

### 1. Command Line Import

Run the import script directly:

```bash
# Test the Excel file first
npm run test:excel

# Import the data
npm run import:excel
```

### 2. Web Interface

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to: `http://localhost:3000/admin/import`

3. Upload your Excel file and click "Import Data"

### 3. API Endpoint

Use the REST API for programmatic imports:

```bash
curl -X POST http://localhost:3000/api/import-excel \
  -H "Content-Type: application/json" \
  -d '{
    "data": "base64_encoded_excel_content",
    "filename": "pricing.xlsx",
    "sheetName": "Sheet1"
  }'
```

## Database Schema

The import process creates/updates the following database tables:

### Providers Table
- `id`: Unique identifier
- `name`: Provider name (e.g., "Frogfoot")
- `slug`: URL-friendly name (e.g., "frogfoot")
- `active`: Whether provider is active

### Packages Table
- `id`: Unique identifier (e.g., "frogfoot_10mbps")
- `name`: Package name (e.g., "Frogfoot Fibre 10/2Mbps")
- `providerId`: Reference to provider
- `type`: Package type ("FIBRE")
- `speed`: Connection speed
- `data`: Data allowance
- `basePrice`: Original price
- `currentPrice`: Current active price
- `active`: Whether package is active

### Price History Table
- Tracks all price changes for audit purposes

## Import Process

1. **File Validation**: Checks if file is a valid Excel format
2. **Sheet Detection**: Automatically finds the most relevant sheet
3. **Data Parsing**: Converts Excel data to structured format
4. **Provider Creation**: Creates new providers if they don't exist
5. **Package Creation**: Creates or updates fibre packages
6. **Price History**: Records initial pricing for new packages
7. **Error Handling**: Logs and reports any issues

## Error Handling

The import process handles various error scenarios:

- **Invalid Excel files**: Returns clear error messages
- **Missing required fields**: Skips invalid rows and reports them
- **Invalid prices**: Logs warnings for non-numeric prices
- **Database errors**: Provides detailed error information

## Output

Successful imports return:

```json
{
  "success": true,
  "message": "Excel data imported successfully",
  "results": {
    "providersCreated": 2,
    "packagesCreated": 15,
    "packagesUpdated": 3,
    "errors": [],
    "totalProcessed": 20,
    "sheetName": "Pricing"
  }
}
```

## Troubleshooting

### Common Issues

1. **"Excel file not found"**
   - Ensure the Excel file is in the project root directory
   - Check file permissions

2. **"No data found in sheet"**
   - Verify the Excel file has data in the expected format
   - Check if the sheet name is correct

3. **"Invalid price" errors**
   - Ensure price columns contain numeric values
   - Remove currency symbols and formatting

4. **Database connection errors**
   - Run `npm run db:push` to ensure database is up to date
   - Check database configuration in `.env`

### Debug Mode

Enable detailed logging by setting the environment variable:

```bash
DEBUG=excel-import npm run import:excel
```

## Best Practices

1. **Backup Data**: Always backup your database before large imports
2. **Test First**: Use `npm run test:excel` to validate your file
3. **Clean Data**: Ensure your Excel file has clean, consistent data
4. **Version Control**: Keep track of your Excel file versions
5. **Regular Updates**: Schedule regular imports to keep pricing current

## API Reference

### POST /api/import-excel

**Request Body:**
```json
{
  "data": "base64_encoded_excel_content",
  "filename": "pricing.xlsx",
  "sheetName": "Sheet1"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Excel data imported successfully",
  "results": {
    "providersCreated": 0,
    "packagesCreated": 10,
    "packagesUpdated": 5,
    "errors": [],
    "totalProcessed": 15,
    "sheetName": "Pricing"
  }
}
```

## Support

For issues or questions:

1. Check the troubleshooting section above
2. Review the console logs for detailed error messages
3. Verify your Excel file format matches the expected structure
4. Ensure your database is properly configured and accessible 