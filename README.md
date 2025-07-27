# Starcast Internet Packages - Consumer Site

A modern, responsive web application for managing and displaying internet packages (Fibre, LTE, 5G) with comprehensive admin capabilities, built with Next.js, TypeScript, and Prisma.

## 🏗️ Core Principles

### Database Integrity
- **Data Validation**: All operations validate data types, ranges, and relationships
- **Referential Integrity**: Package-provider relationships maintained across all operations
- **Transaction Safety**: All database operations use transactions to prevent partial updates
- **Audit Trail**: All changes logged with timestamps and user information
- **Backup Strategy**: Regular database backups and migration scripts

### Backward Compatibility
- **API Versioning**: All existing API endpoints remain functional
- **Data Migration**: Schema changes are additive, never breaking existing data
- **Legacy Support**: Old field names and formats remain accessible
- **Graceful Degradation**: System works even if new fields are missing

### Mobile Browser Compatibility
- **Responsive Design**: All interfaces adapt to mobile screen sizes (320px to 1920px+)
- **Touch-Friendly**: Buttons and forms optimized for touch interaction (44px minimum targets)
- **Progressive Enhancement**: Core functionality works without JavaScript
- **Cross-Browser Support**: Tested on Chrome, Safari, Firefox, Edge mobile
- **Performance**: Optimized for mobile network conditions and battery usage

## 🚀 Features

### Consumer-Facing Features
- **Fibre Packages**: Modern card-based display with horizontal scrolling
- **LTE Packages**: Identical UI with LTE-specific data and features
- **5G Packages**: Future-ready structure for 5G packages
- **Provider Logos**: Visual provider identification
- **Promotional Pricing**: Dynamic pricing with promotional badges
- **Mobile Optimized**: Perfect experience on all mobile devices

### Admin Dashboard
- **Package Management**: CRUD operations for all package types
- **Promotion Management**: Create and manage promotional offers
- **Price History**: Complete audit trail of all price changes
- **Bulk Import**: CSV import for wholesale and retail prices
- **Provider Management**: Manage service providers and their packages
- **Mobile Admin**: Full admin functionality on mobile devices

### Technical Features
- **Type Safety**: Full TypeScript implementation
- **Database ORM**: Prisma with SQLite for development
- **API Routes**: RESTful API with proper error handling
- **Session Management**: Secure session handling
- **Responsive Design**: Mobile-first approach

## 📱 Mobile Compatibility

### Responsive Design
- **Flexible Layout**: Adapts to all screen sizes
- **Touch Targets**: Minimum 44px for all interactive elements
- **Readable Text**: Minimum 16px font size
- **Proper Spacing**: Adequate spacing between elements

### Mobile-Specific Features
- **Swipe Navigation**: Swipe between tabs on mobile
- **Pull-to-Refresh**: Refresh data by pulling down
- **Offline Support**: Critical functions work without internet
- **Progressive Web App**: Can be installed as mobile app

### Performance Optimization
- **Lazy Loading**: Load data as needed
- **Image Optimization**: Compressed images for mobile networks
- **Caching**: Smart caching to reduce data usage
- **Network Resilience**: Handles poor network conditions

## 🗄️ Database Schema

### Core Models
```prisma
model Provider {
  id        String    @id @default(cuid())
  name      String
  slug      String    @unique
  logo      String?
  active    Boolean   @default(true)
  packages  Package[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

model Package {
  id                    String    @id @default(cuid())
  name                  String
  providerId            String
  type                  String    // FIBRE, LTE_FIXED, LTE_MOBILE, 5G
  speed                 String?
  data                  String?
  basePrice             Float     // Wholesale price
  currentPrice          Float     // Retail price
  active                Boolean   @default(true)
  featured              Boolean   @default(false)
  provider              Provider  @relation(fields: [providerId], references: [id])
  promotions            Promotion[]
  priceHistory          PriceHistory[]
  // Additional fields for FUP, technology, etc.
}

model Promotion {
  id            String    @id @default(cuid())
  code          String    @unique
  name          String
  description   String?
  discountType  String    // PERCENTAGE, FIXED_AMOUNT, OVERRIDE_PRICE
  discountValue Float
  startDate     DateTime
  endDate       DateTime
  usageLimit    Int       @default(0)
  timesUsed     Int       @default(0)
  active        Boolean   @default(true)
  packageId     String?
  package       Package?  @relation(fields: [packageId], references: [id])
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model PriceHistory {
  id          String   @id @default(cuid())
  packageId   String
  package     Package  @relation(fields: [packageId], references: [id])
  oldPrice    Float
  newPrice    Float
  changedBy   String
  reason      String?
  createdAt   DateTime @default(now())
}
```

## 🔧 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Setup
```bash
# Clone the repository
git clone <repository-url>
cd starcast-nextjs

# Install dependencies
npm install

# Set up environment variables
cp env.example .env
# Edit .env with your configuration

# Set up database
npx prisma generate
npx prisma db push

# Seed the database (optional)
npm run seed

# Start development server
npm run dev
```

### Environment Variables
```env
# Database
DATABASE_URL="file:./dev.db"

# Next.js
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# API Keys (if needed)
# PROVIDER_API_KEY="your-provider-api-key"
```

## 📊 API Endpoints

### Package Management
- `GET /api/packages` - Get all packages
- `GET /api/fibre-packages` - Get fibre packages only
- `GET /api/lte-packages` - Get LTE packages only
- `POST /api/packages` - Create new package
- `PUT /api/packages` - Update package
- `DELETE /api/packages/:id` - Delete package

### Promotion Management
- `GET /api/promotions` - Get all promotions
- `POST /api/promotions` - Create new promotion
- `PUT /api/promotions/:id` - Update promotion
- `DELETE /api/promotions/:id` - Delete promotion

### Price Management
- `POST /api/import-wholesale-prices` - Import wholesale prices
- `POST /api/import-retail-prices` - Import retail prices
- `GET /api/price-history` - Get price change history

### Provider Management
- `GET /api/providers` - Get all providers
- `POST /api/providers` - Create new provider
- `PUT /api/providers/:id` - Update provider
- `DELETE /api/providers/:id` - Delete provider

## 🧪 Testing

### API Testing
```bash
# Test API separation
node test-api-separation.js

# Test specific endpoints
curl http://localhost:3000/api/packages
curl http://localhost:3000/api/fibre-packages
curl http://localhost:3000/api/lte-packages
```

### Mobile Testing
- Test on real mobile devices (not just simulators)
- Test on various network conditions (3G, 4G, WiFi)
- Test on different browsers (Chrome, Safari, Firefox, Edge)
- Test accessibility features (screen readers)

### Database Integrity Testing
- Verify referential integrity
- Test transaction rollback scenarios
- Validate data constraints
- Check audit trail functionality

## 📱 Mobile Development Guidelines

### Design Principles
1. **Mobile First**: Design for mobile, enhance for desktop
2. **Touch Friendly**: Minimum 44px touch targets
3. **Readable**: Minimum 16px font size
4. **Fast**: Optimize for mobile network conditions

### Performance Best Practices
1. **Lazy Loading**: Load data as needed
2. **Image Optimization**: Compress images for mobile
3. **Caching**: Implement smart caching strategies
4. **Network Resilience**: Handle poor connectivity gracefully

### Testing Checklist
- [ ] Test on real mobile devices
- [ ] Test on various screen sizes
- [ ] Test on different browsers
- [ ] Test on slow network conditions
- [ ] Test accessibility features
- [ ] Test offline functionality

## 🔒 Security Considerations

### Data Protection
- **Input Validation**: All user inputs validated and sanitized
- **Output Encoding**: Prevent XSS attacks
- **Access Control**: Role-based access control
- **Audit Logging**: All admin actions logged

### Mobile Security
- **HTTPS Only**: All connections use HTTPS
- **Session Management**: Secure session handling
- **Data Encryption**: Sensitive data encrypted
- **Rate Limiting**: Prevent abuse of endpoints

## 📈 Performance Monitoring

### Key Metrics
- **Page Load Time**: Target < 3 seconds on mobile
- **Time to Interactive**: Target < 5 seconds
- **Database Query Performance**: Monitor slow queries
- **API Response Time**: Target < 500ms

### Monitoring Tools
- **Browser DevTools**: Performance profiling
- **Database Monitoring**: Query performance analysis
- **Network Monitoring**: API response times
- **User Analytics**: Real user performance data

## 🚀 Deployment

### Production Checklist
- [ ] Database backup completed
- [ ] Environment variables configured
- [ ] SSL certificate installed
- [ ] Mobile testing completed
- [ ] Performance optimization verified
- [ ] Security audit passed

### Deployment Commands
```bash
# Build for production
npm run build

# Start production server
npm start

# Database migration
npx prisma migrate deploy
```

## 📚 Documentation

### Guides
- [Admin Dashboard Guide](./ADMIN_DASHBOARD_GUIDE.md)
- [Pricing Import Guide](./PRICING_IMPORT_GUIDE.md)
- [LTE/Fibre Separation Summary](./LTE_FIBRE_SEPARATION_SUMMARY.md)

### API Documentation
- All API endpoints documented with examples
- Error handling and response formats
- Authentication and authorization details

## 🤝 Contributing

### Development Guidelines
1. **Database Integrity**: Always maintain data integrity
2. **Backward Compatibility**: Don't break existing functionality
3. **Mobile First**: Test on mobile devices first
4. **Code Quality**: Follow TypeScript best practices
5. **Documentation**: Update documentation with changes

### Code Review Checklist
- [ ] Database integrity maintained
- [ ] Backward compatibility verified
- [ ] Mobile compatibility tested
- [ ] Performance impact assessed
- [ ] Security considerations addressed
- [ ] Documentation updated

## 📞 Support

### Getting Help
- Check documentation first
- Review error logs and console output
- Test on different devices and browsers
- Contact development team with specific issues

### Reporting Issues
- Include device and browser information
- Provide steps to reproduce
- Include error messages and logs
- Specify expected vs actual behavior

## 📄 License

This project is proprietary software. All rights reserved.

---

**Remember**: Database integrity, backward compatibility, and mobile browser compatibility are critical for production systems. Always test thoroughly before deploying changes. 