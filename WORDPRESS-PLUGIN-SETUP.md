# WordPress Complete API Plugin Setup

## Overview
This is a unified WordPress plugin that combines all functionality needed for the Starcast Technologies React frontend. It replaces both the old plugins and provides complete REST API integration.

## What This Plugin Provides
✅ **Native WordPress REST API** support for packages and providers  
✅ **Custom endpoints** for bookings, applications, and contact forms  
✅ **Database tables** for customer data management  
✅ **Email notifications** for all customer interactions  
✅ **ACF field groups** automatically created  
✅ **Promo code system** with validation  
✅ **CORS headers** for React frontend  

## Replace Old Plugins
This single plugin replaces:
- `wordpress-rest-api-extension.php` 
- `starcast-fibre-api-plugin.php`
- Any other custom REST API plugins

## Installation: Starcast Complete API Plugin

### Step 1: Install the Plugin
1. **Remove old plugins** if they exist:
   - Deactivate and delete `wordpress-rest-api-extension.php`
   - Deactivate and delete `starcast-fibre-api-plugin.php`
2. Upload `starcast-complete-api-plugin.php` to your WordPress `/wp-content/plugins/` directory
3. Activate the plugin in WordPress Admin > Plugins

### Step 2: Verify Installation
After activation, you should see:
- New admin menu: "Fibre Packages" 
- New admin menu: "LTE Packages"
- REST API endpoints available:
  - `https://starcast.co.za/wp-json/wp/v2/fibre_packages`
  - `https://starcast.co.za/wp-json/wp/v2/fibre_provider`

### Step 3: Add Missing Providers
Add the following providers in WordPress Admin > Fibre Packages > Fibre Providers:

1. **Openserve**
   - Name: Openserve
   - Slug: openserve
   - Logo: Upload provider logo (optional)

2. **Vumatel** 
   - Name: Vumatel
   - Slug: vumatel
   - Logo: Upload provider logo (optional)

3. **Octotel**
   - Name: Octotel
   - Slug: octotel
   - Logo: Upload provider logo (optional)

### Step 4: Create Sample Packages
For each provider, create packages with these ACF fields:
- **Download Speed**: e.g., "100Mbps"
- **Upload Speed**: e.g., "100Mbps" 
- **Price**: e.g., 899
- **Promo Active**: true/false
- **Promo Price**: e.g., 699 (if promo active)
- **Promo Duration**: e.g., 2 (months)

### Step 5: Test REST API
Test the endpoints:
```bash
curl "https://starcast.co.za/wp-json/wp/v2/fibre_provider"
curl "https://starcast.co.za/wp-json/wp/v2/fibre_packages?per_page=5"
```

## Plugin Features

### Custom Post Types
- `fibre_packages` - Fibre internet packages
- `lte_packages` - LTE/5G packages

### Custom Taxonomies  
- `fibre_provider` - Fibre network providers
- `lte_provider` - LTE/5G providers

### ACF Field Groups
- **Fibre Package Fields**: download, upload, price, promo settings
- **Provider Fields**: logo, description, website

### REST API Integration
- All custom post types exposed with `show_in_rest => true`
- All taxonomies exposed with `show_in_rest => true`
- ACF fields automatically included in REST responses
- Proper WordPress REST API compliance

## Current Data Migration
The existing fibre packages on the site will need to be:
1. Reassigned to proper provider taxonomies
2. Have ACF fields populated
3. Ensure proper REST API visibility

## React App Configuration
Set the WordPress URL in your React app's `.env` file:
```
REACT_APP_WORDPRESS_URL=https://starcast.co.za
```

## Troubleshooting

### No packages showing in React app?
1. Check WordPress plugin is activated
2. Verify packages have provider taxonomy assigned  
3. Ensure ACF fields are populated
4. Test REST API endpoints directly

### ACF fields not showing?
1. Ensure ACF plugin is installed and active
2. Plugin automatically creates field groups
3. Check field group is assigned to correct post types

### Providers not filtering correctly?
React app looks for these exact provider names:
- openserve, frogfoot, vumatel, octotel, metrofibre

Provider names should match (case insensitive) or contain these keywords.

## Complete API Endpoints

### Native WordPress REST API (Primary)
```bash
# Providers
GET /wp-json/wp/v2/fibre_provider
GET /wp-json/wp/v2/lte_provider

# Packages  
GET /wp-json/wp/v2/fibre_packages
GET /wp-json/wp/v2/lte_packages
GET /wp-json/wp/v2/fibre_packages?fibre_provider={provider_id}
```

### Custom REST API Endpoints
```bash
# Legacy package endpoints (backward compatibility)
GET /wp-json/starcast/v1/packages/fibre
GET /wp-json/starcast/v1/packages/lte

# Bookings
POST /wp-json/starcast/v1/bookings
GET /wp-json/starcast/v1/bookings/availability/{date}

# Applications
POST /wp-json/starcast/v1/fibre-application
POST /wp-json/starcast/v1/lte-application

# Contact & Signup
POST /wp-json/starcast/v1/contact
POST /wp-json/starcast/v1/signup

# Promo validation
POST /wp-json/starcast/v1/validate-promo
```

### Database Tables Created
- `wp_starcast_bookings` - Technician bookings
- `wp_starcast_signups` - General signups  
- `wp_starcast_applications` - Package applications

### Example Response
```json
{
  "id": 123,
  "title": {"rendered": "Openserve 100/100Mbps"},
  "fibre_provider": [456],
  "acf": {
    "download": "100Mbps",
    "upload": "100Mbps", 
    "price": "899",
    "promo_active": true,
    "promo_price": "699"
  }
}
```

## Benefits of Unified Plugin

### Single Plugin Management
- ✅ One plugin to install and maintain
- ✅ Consistent versioning and updates  
- ✅ No conflicts between multiple plugins

### Complete Functionality
- ✅ WordPress native REST API integration
- ✅ Custom business logic endpoints
- ✅ Database management for customer data
- ✅ Email notification system
- ✅ Promo code validation

### Backward Compatibility
- ✅ Legacy `/starcast/v1/` endpoints preserved
- ✅ Existing React code continues working
- ✅ Gradual migration to native WordPress endpoints possible