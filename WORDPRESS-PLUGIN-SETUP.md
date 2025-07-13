# WordPress Plugin Setup Instructions

## Overview
The React application requires a WordPress plugin to properly expose fibre package data via the REST API. The current WordPress site has custom post types but they are not properly registered for REST API access.

## Problem Identified
- ✅ WordPress has fibre package data
- ❌ Custom post types not registered with `show_in_rest => true`
- ❌ Taxonomies not exposed to REST API
- ❌ ACF fields not accessible via REST API
- ❌ Missing providers: Openserve, Vumatel, Octotel

## Solution: Install the Starcast Fibre API Plugin

### Step 1: Install the Plugin
1. Upload `starcast-fibre-api-plugin.php` to your WordPress `/wp-content/plugins/` directory
2. Activate the plugin in WordPress Admin > Plugins

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

## WordPress REST API Endpoints

### Providers
```
GET /wp-json/wp/v2/fibre_provider
GET /wp-json/wp/v2/fibre_provider/{id}
```

### Packages  
```
GET /wp-json/wp/v2/fibre_packages
GET /wp-json/wp/v2/fibre_packages?fibre_provider={provider_id}
GET /wp-json/wp/v2/fibre_packages/{id}
```

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