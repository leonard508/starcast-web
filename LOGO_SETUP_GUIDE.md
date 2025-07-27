# Provider Logo Setup Guide

## 🎯 Current Status

### ✅ **Logos Already Available**
- **Frogfoot**: `/assets/providers/frogfoot.svg`
- **Vumatel**: `/assets/providers/vumatel.svg` 
- **Openserve**: `/assets/providers/openserve.svg`

### 🔄 **Placeholder System**
- All providers without logos now show a clean placeholder
- Placeholder: `/assets/providers/placeholder.svg`

## 📋 **Providers Needing Logos**

Here are the 17 providers that need logos added:

### **Major ISPs**
1. **Vuma** - `vuma.svg`
2. **Octotel** - `octotel.svg`
3. **TT Connect** - `tt-connect.svg`
4. **Vodacom** - `vodacom.svg`

### **Regional Providers**
5. **Mitsol** - `mitsol.svg`
6. **Evotel** - `evotel.svg`
7. **Thinkspeed** - `thinkspeed.svg`
8. **Clearaccess** - `clearaccess.svg`
9. **DNATel** - `dnatel.svg`
10. **Link Layer** - `link-layer.svg`

### **MetroFibre Brands**
11. **MetroFibre Nexus** - `metrofibre-nexus.svg`
12. **MetroFibre Nova** - `metrofibre-nova.svg`

### **Specialized Providers**
13. **Connectivity Services - Steyn City** - `steyn-city.svg`
14. **Zoom Fibre** - `zoom-fibre.svg`
15. **Netstream** - `netstream.svg`
16. **Lightstruck - Zinkwazi Glenwood** - `lightstruck.svg`
17. **Port Edward - Paarl - Hermanus - Greytown** - `pphg.svg`

## 🎨 **Logo Requirements**

### **Technical Specifications**
- **Format**: SVG (preferred) or PNG
- **Dimensions**: 160px × 60px (or scalable SVG)
- **Background**: Transparent
- **Colors**: Provider brand colors
- **Style**: Clean, professional, readable

### **File Naming Convention**
```
/assets/providers/[provider-slug].svg
```

### **Example File Structure**
```
public/
└── assets/
    └── providers/
        ├── frogfoot.svg ✅
        ├── vumatel.svg ✅
        ├── openserve.svg ✅
        ├── placeholder.svg ✅
        ├── vuma.svg ❌ (needed)
        ├── octotel.svg ❌ (needed)
        ├── tt-connect.svg ❌ (needed)
        └── ... (other logos)
```

## 🚀 **How to Add Logos**

### **Step 1: Get the Logo**
1. **Official Website**: Visit the provider's official website
2. **Press Kit**: Look for media/press resources
3. **Contact Provider**: Request official logo files
4. **Design**: Create logo if none available

### **Step 2: Prepare the Logo**
1. **Convert to SVG** (if not already)
2. **Resize to 160×60px** or make scalable
3. **Remove background** (make transparent)
4. **Optimize** for web use

### **Step 3: Add to Project**
1. Save as `[provider-slug].svg` in `/public/assets/providers/`
2. The logo will automatically appear on the fibre page
3. No code changes needed!

### **Step 4: Test**
1. Restart the development server
2. Visit `/fibre` page
3. Check that the logo appears correctly

## 🔧 **Logo Mapping System**

The system automatically maps provider names to logo files:

```typescript
// In /src/utils/providerLogos.ts
export const providerLogos: Record<string, string> = {
  'frogfoot': '/assets/providers/frogfoot.svg',
  'vuma': '/assets/providers/vuma.svg',
  'octotel': '/assets/providers/octotel.svg',
  // ... add more as you get them
}
```

### **How It Works**
1. **Slug Match**: First tries `provider.slug`
2. **Normalized Name**: Then tries `provider.name` (lowercase, hyphenated)
3. **Exact Match**: Finally tries exact `provider.name`
4. **Placeholder**: Falls back to placeholder if no logo found

## 📱 **Logo Display**

### **Current Implementation**
- **Size**: Max 160px × 60px
- **Position**: Centered above speed info
- **Fallback**: Clean placeholder with provider name
- **Responsive**: Scales on mobile devices

### **CSS Classes**
```css
.provider-logo-main {
  max-width: 160px;
  max-height: 60px;
  margin-bottom: 8px;
  object-fit: contain;
}
```

## 🎯 **Priority List**

### **High Priority** (Major Providers)
1. **Vuma** - Very popular fibre provider
2. **Octotel** - Large regional provider
3. **Vodacom** - Major telecom company
4. **TT Connect** - Growing provider

### **Medium Priority** (Regional Providers)
5. **MetroFibre Nexus/Nova** - MetroFibre brands
6. **Mitsol** - Regional provider
7. **Evotel** - Regional provider
8. **Thinkspeed** - Regional provider

### **Lower Priority** (Specialized Providers)
9. **Clearaccess** - Smaller provider
10. **DNATel** - Smaller provider
11. **Link Layer** - Smaller provider
12. **Others** - Specialized/local providers

## 🔍 **Logo Sources**

### **Official Websites**
- **Vuma**: https://vuma.co.za
- **Octotel**: https://octotel.co.za
- **Vodacom**: https://vodacom.co.za
- **TT Connect**: https://ttconnect.co.za
- **MetroFibre**: https://metrofibre.co.za

### **Alternative Sources**
- **Google Images**: Search "[Provider] logo SVG"
- **Logo Database**: Sites like logowik.com
- **Design Resources**: Freepik, Flaticon (check licensing)

## ✅ **Testing Checklist**

After adding each logo:

- [ ] Logo displays correctly on `/fibre` page
- [ ] Logo scales properly on mobile
- [ ] Logo has transparent background
- [ ] Logo is readable and professional
- [ ] No console errors
- [ ] Placeholder no longer shows for this provider

## 🎉 **Benefits**

Once all logos are added:

1. **Professional Appearance**: All providers have branded logos
2. **Better UX**: Users can easily identify providers
3. **Brand Recognition**: Builds trust with familiar logos
4. **Consistent Design**: Clean, organized package cards
5. **Apple-Level Quality**: Professional, polished interface

The logo system is now fully automated - just add the SVG files and they'll appear instantly! 