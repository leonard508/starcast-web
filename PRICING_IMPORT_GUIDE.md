# Pricing Import Guide - Wholesale & Retail Pricing System

## Overview

This guide explains the new wholesale and retail pricing structure that separates cost prices from customer-facing prices, allowing for flexible pricing strategies and proper margin management.

## Database Integrity & Compatibility

### Database Integrity Requirements
- **Data Validation**: All imports must validate data types, ranges, and relationships
- **Referential Integrity**: Package-provider relationships must be maintained
- **Transaction Safety**: All price updates use database transactions to prevent partial updates
- **Audit Trail**: All changes are logged in `priceHistory` table for compliance
- **Backup Strategy**: Always backup database before bulk imports

### Backward Compatibility
- **API Versioning**: All existing API endpoints remain functional
- **Data Migration**: Existing packages automatically get `basePrice = currentPrice` if not set
- **Schema Evolution**: Database schema changes are additive, never breaking
- **Legacy Support**: Old pricing fields remain accessible for existing integrations

### Mobile Browser Compatibility
- **Responsive Design**: All admin interfaces work on mobile devices
- **Touch-Friendly**: Import buttons and forms are optimized for touch
- **Progressive Enhancement**: Core functionality works without JavaScript
- **Cross-Browser Support**: Tested on Chrome, Safari, Firefox, Edge mobile

## Database Fields

### Package Model Updates
- `basePrice` (number): **Wholesale price** - Cost from provider
- `currentPrice` (number): **Retail price** - Price shown to customers
- Both fields are required and must be positive numbers

### Price History Tracking
- `priceHistory` table records all price changes
- Includes old price, new price, change reason, and timestamp
- Maintains complete audit trail for compliance

## Admin Dashboard Display

### Package Management
- **Wholesale Price**: Green background, clearly labeled
- **Retail Price**: Blue background, clearly labeled
- **Margin Calculation**: Real-time display of profit/loss
- **Price History**: Complete change history with filters

### Import Buttons
- **Import Wholesale Prices** (Green): Updates `basePrice` field
- **Import Retail Prices** (Purple): Updates `currentPrice` field
- Both use CSV format with validation

## CSV Import Formats

### Wholesale Price Import
Required columns:
```csv
package_name,provider_name,wholesale_price
50Mbps Fibre,Vumatel,450
100Mbps Fibre,Openserve,650
25Mbps LTE,Vodacom,250
```

### Retail Price Import
Required columns:
```csv
package_name,provider_name,retail_price
50Mbps Fibre,Vumatel,599
100Mbps Fibre,Openserve,799
25Mbps LTE,Vodacom,399
```

## Import Process

### Step-by-Step Process
1. **Prepare CSV File**: Ensure correct format and data types
2. **Backup Database**: Always backup before bulk operations
3. **Validate Data**: Check for missing packages or invalid prices
4. **Run Import**: Use admin dashboard import buttons
5. **Verify Changes**: Check Price Changes tab for results
6. **Test Frontend**: Ensure customer-facing prices display correctly

### Error Handling
- **Missing Packages**: Logged but don't stop import
- **Invalid Prices**: Rejected with specific error messages
- **Duplicate Entries**: Handled gracefully with updates
- **Network Issues**: Retry mechanism with exponential backoff

## Benefits

### For Business
- **Clear Profit Tracking**: See margin between wholesale and retail
- **Flexible Pricing**: Update wholesale and retail independently
- **Promotional Pricing**: Allow retail prices below wholesale for special offers
- **Audit Trail**: Complete history of all price changes
- **Bulk Updates**: Efficient CSV import for large price changes

### For Development
- **Database Integrity**: Maintains referential integrity and data consistency
- **Backward Compatibility**: Existing integrations continue to work
- **Mobile Support**: Admin tools work on all devices
- **Error Recovery**: Robust error handling and rollback capabilities

## API Endpoints

### New Endpoints
- `POST /api/import-wholesale-prices`: Import wholesale prices
- `POST /api/import-retail-prices`: Import retail prices
- `GET /api/price-history`: View price change history

### Existing Endpoints (Unchanged)
- `GET /api/packages`: Returns packages with both price fields
- `GET /api/fibre-packages`: Fibre-specific packages
- `GET /api/lte-packages`: LTE-specific packages

## Security Considerations

### Data Protection
- **Input Validation**: All CSV data is validated and sanitized
- **Access Control**: Admin-only access to import functions
- **Rate Limiting**: Prevent abuse of import endpoints
- **Audit Logging**: All admin actions are logged

### Mobile Security
- **HTTPS Only**: All admin access requires secure connection
- **Session Management**: Proper session handling for mobile
- **Input Sanitization**: Prevent XSS and injection attacks

## Best Practices

### Data Management
1. **Test with Small Files**: Start with a few packages to verify format
2. **Backup Data**: Export current prices before bulk updates
3. **Review Changes**: Check Price Changes tab after imports
4. **Monitor Margins**: Track profit/loss margins for business decisions
5. **Promotional Pricing**: Use retail prices below wholesale for special offers

### Development Practices
1. **Database Migrations**: Use proper migration scripts for schema changes
2. **API Versioning**: Maintain backward compatibility in all APIs
3. **Mobile Testing**: Test all features on various mobile devices
4. **Error Handling**: Implement comprehensive error handling
5. **Performance**: Optimize for mobile network conditions

## Troubleshooting

### Common Issues
- **Import Fails**: Check CSV format and required columns
- **Missing Packages**: Verify package names match exactly
- **Price Validation**: Ensure prices are positive numbers
- **Mobile Display**: Check responsive design on different screen sizes

### Support
- **Error Messages**: Check browser console for detailed errors
- **Database Logs**: Review database logs for import issues
- **Mobile Debug**: Use browser dev tools for mobile testing
- **API Testing**: Test endpoints with Postman or similar tools

## Database Integrity Checklist

### Before Import
- [ ] Database backup completed
- [ ] CSV format validated
- [ ] Package names verified
- [ ] Price ranges checked
- [ ] Mobile interface tested

### After Import
- [ ] Price changes verified
- [ ] Margin calculations correct
- [ ] Frontend displays updated
- [ ] Mobile compatibility confirmed
- [ ] Error logs reviewed

### Ongoing Maintenance
- [ ] Regular database backups
- [ ] Monitor price history growth
- [ ] Test mobile responsiveness
- [ ] Validate API compatibility
- [ ] Review security logs 