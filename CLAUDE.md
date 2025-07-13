# Starcast React Web App - Clean Production Build

## Overview
This directory contains ONLY the production React web application files needed for deployment. All documentation, WordPress plugins, and reference files are stored in the parent directory.

## What's Included
✅ **React Source Code** (`src/`)  
✅ **Public Assets** (`public/`)  
✅ **Build Configuration** (`package.json`, `tsconfig.json`)  
✅ **Environment Config** (`.env.example`)  
✅ **Build Output** (`build/`)  

## What's NOT Included
❌ **Documentation** → Moved to `../` root directory  
❌ **WordPress Plugins** → Moved to `../wordpress-plugins/`  
❌ **Implementation Guides** → Moved to `../` root directory  
❌ **README files** → Moved to `../` root directory  

## Development Commands
```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

## Project Structure
```
starcast-webapp/
├── src/                    # React source code
│   ├── components/         # Reusable components
│   ├── pages/             # Page components
│   ├── services/          # API integration
│   ├── context/           # React context
│   ├── hooks/             # Custom hooks
│   └── utils/             # Helper functions
├── public/                # Static assets
├── build/                 # Production build output
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
└── .env.example           # Environment variables template
```

## Environment Setup
1. Copy `.env.example` to `.env.local`
2. Configure WordPress API URL:
   ```
   REACT_APP_WORDPRESS_URL=https://starcast.co.za
   REACT_APP_WP_API_URL=https://starcast.co.za/wp-json
   ```

## WordPress Integration
This React app connects to WordPress via REST API. Ensure the WordPress server has the required plugins installed (located in `../wordpress-plugins/`).

## Deployment
- **GitHub Repository**: https://github.com/leonard508/starcast-web
- **Auto-Deploy**: Vercel monitors GitHub for changes
- **Clean Build**: Only React files are deployed, no server-side code

## Key Features
- WordPress REST API integration
- TypeScript support
- Mobile-first responsive design
- Performance caching system
- Error handling and loading states
- Component design system

## API Endpoints Used
```bash
# WordPress Native REST API
GET /wp-json/wp/v2/fibre_packages
GET /wp-json/wp/v2/fibre_provider

# Custom Business Logic
POST /wp-json/starcast/v1/bookings
POST /wp-json/starcast/v1/contact
POST /wp-json/starcast/v1/validate-promo
```

## File Organization
This directory follows React best practices with clean separation of concerns:
- Components are modular and reusable
- Pages handle routing and layout
- Services manage API calls
- Context provides global state
- Hooks encapsulate business logic

For all documentation, setup guides, and WordPress plugins, see the parent directory.