# Next.js Starcast Application - Website Implementation Documentation

## Latest Cleanup (Date: 2025-07-23)

### Files Removed (Redundant React Components)
✅ **Removed**: `src/index.js` - React entry point (not needed in Next.js)
✅ **Removed**: `src/reportWebVitals.js` - React performance monitoring (replaced by Next.js analytics)
✅ **Removed**: `src/components/common/Button.js` - Duplicate JS version (kept TypeScript version)
✅ **Removed**: `src/components/common/LoadingSpinner.js` - Duplicate JS version (kept TypeScript version)
✅ **Removed**: `src/components/design-system/Button.js` - Redundant Button component
✅ **Removed**: `src/components/ui/button.js` - Redundant ui Button component

### Issues Identified (To Be Fixed)
❌ **ESLint Errors Found**: 
- `img` tags should use Next.js `Image` component (5 instances)
- Unused variables in multiple files (8 instances)
- Unescaped HTML entities in JSX (12 instances)
- Missing dependencies in useEffect hooks (2 instances)

❌ **TypeScript Issues**:
- `any` types used (4 instances) - need proper typing
- Unused imports and variables throughout codebase

❌ **Console Statements**: 
- 75+ console.log statements in production code
- Need removal or proper logging implementation

### CLAUDE.md Updates
✅ **Refocused Content**: Updated to reflect ISP reseller platform focus
✅ **Added Security Section**: Data protection and payment security considerations
✅ **Updated Deployment**: Railway hosting with GitHub CI/CD
✅ **Development Guidelines**: Added code quality and workflow standards

---

# Next.js Starcast Application - Complete Fibre Page Layout Documentation

## Fibre Page Complete Layout (Current Perfect State)

### Overview
This document captures the complete fibre page layout configuration including all sections, components, styling, and functionality. Use this as a comprehensive reference if changes are needed and you want to revert to this working state.

## Page Structure

### Main Component Structure
```tsx
export default function FibrePage() {
  // State management
  const [providerData, setProviderData] = useState<ProviderData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeProviderIndex, setActiveProviderIndex] = useState(0)

  // JSX Structure
  return (
    <div className="fibre-page">
      <header className="fibre-header">
        {/* Hero Banner */}
      </header>
      <section className="fibre-section">
        {/* Carousel Section */}
      </section>
    </div>
  )
}
```

## Complete CSS Configuration

### Page Container
```css
.fibre-page {
  font-family: 'Poppins', 'Inter', sans-serif;
  color: #4a453f;
  background: #e8e8e8;
  width: 100%;
  overflow-x: hidden;
  min-height: 100vh;
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}
```

### Hero Banner Section
```css
.fibre-header {
  text-align: center;
  padding: 80px 0 20px;
  background: #e8e8e8;
  position: relative;
}

.heading-gradient {
  font-family: 'Poppins', sans-serif;
  font-size: 2.8rem;
  font-weight: 800;
  color: #2d2823;
  margin-bottom: 20px;
  line-height: 1.2;
  letter-spacing: -0.02em;
  position: relative;
  z-index: 2;
}

.heading-gradient span {
  color: #d67d3e;
}
```

### Main Section
```css
.fibre-section {
  padding: 10px 0 100px;
  background: #e8e8e8;
  position: relative;
}

.title-container {
  width: 100%;
  text-align: center;
  margin-bottom: 30px;
  position: relative;
  z-index: 2;
}

.section-title {
  text-align: center;
  color: #2d2823;
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0 auto;
  display: inline-block;
  position: relative;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

.section-title::after {
  content: "";
  position: absolute;
  bottom: -12px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background: #d67d3e;
  border-radius: 2px;
}
```

## Carousel System

### Carousel Container
```css
.desktop-scroll-container {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 100vw;
  overflow: hidden;
}

.provider-package-display {
  display: flex;
  gap: 60px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  -ms-overflow-style: none;
  margin: 0;
  padding: 20px 0;
  position: relative;
  z-index: 2;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  background: #e8e8e8;
  border-radius: 0;
  width: 100%;
  max-width: 100%;
  justify-content: flex-start;
}

.provider-package-display::-webkit-scrollbar {
  display: none;
}

.provider-package-card {
  scroll-snap-align: center;
  flex-shrink: 0;
}
```

### Navigation Arrows
```css
.desktop-scroll-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.7);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(15px);
  opacity: 1;
}

.desktop-scroll-arrow:hover {
  background: rgba(0, 0, 0, 0.85);
  color: white;
  transform: translateY(-50%) scale(1.05);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
  border-color: rgba(255, 255, 255, 0.5);
}

.desktop-scroll-arrow:disabled {
  opacity: 0.3;
  cursor: not-allowed;
  pointer-events: none;
}

.desktop-scroll-left {
  left: 20px;
}

.desktop-scroll-right {
  right: 20px;
}

.desktop-scroll-arrow svg {
  width: 32px;
  height: 32px;
}
```

### Scroll Indicators
```css
.scroll-indicators {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  margin: 15px auto;
  position: relative;
  z-index: 2;
  padding: 10px 16px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  border: 1px solid #000000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: fit-content;
  max-width: 90%;
  min-height: 28px;
}

.scroll-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(45, 40, 35, 0.4);
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.scroll-dot.active {
  background: #4a90e2;
  transform: scale(1.4);
  box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.3);
}

.scroll-dot:hover {
  background: #4a90e2;
  opacity: 0.8;
  transform: scale(1.2);
}
```

## Card Component (ProviderCard)

### Card Container
```css
.provider-package-card {
  background: #ffffff;
  backdrop-filter: blur(20px);
  border-radius: 16px;
  box-shadow: 
    0 12px 40px rgba(0, 0, 0, 0.15),
    0 4px 16px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  border: 1px solid #000000;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 380px;
  min-width: 380px;
  max-width: 380px;
  height: auto;
  max-height: 580px;
  flex-shrink: 0;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: visible;
  scroll-snap-align: center;
}

.provider-package-card:hover {
  transform: translateY(-8px);
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.2),
    0 8px 24px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
}
```

### Card Elements
```css
.provider-logo-main {
  max-width: 160px;
  max-height: 60px;
  margin-bottom: 8px;
  object-fit: contain;
}

.speed-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  font-size: 1.1rem;
  color: #2d2823;
  font-weight: 500;
}

.speed-info .download-arrow {
  color: #4a90e2;
  font-weight: 600;
  font-size: 1.2rem;
}

.speed-info .upload-arrow {
  color: #7ed321;
  font-weight: 600;
  font-size: 1.2rem;
}

.price-display {
  display: flex;
  align-items: baseline;
  margin-bottom: 12px;
  gap: 8px;
}

.price-main {
  font-size: 2.4rem;
  font-weight: 700;
  color: #4a90e2;
  line-height: 1;
}

.price-period {
  font-size: 1.2rem;
  color: #6b6355;
}

.price-strikethrough {
  text-decoration: line-through;
  opacity: 0.6;
  font-size: 1.2rem;
  color: #6b6355;
}
```

### Package Selector
```css
.package-selector {
  width: 100%;
  max-width: 400px;
  margin-bottom: 8px;
  position: relative;
}

.package-dropdown {
  width: 100%;
  padding: 12px 12px;
  border: 1px solid #000000;
  border-radius: 8px;
  background: #ffffff;
  font-family: 'Roboto', sans-serif;
  font-size: 1.1rem;
  font-weight: 500;
  color: #2d2823;
  cursor: pointer;
  appearance: none;
  background-image: url('data:image/svg+xml;charset=US-ASCII,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4 5"><path fill="%236b6355" d="M2 0L0 2h4zm0 5L0 3h4z"/></svg>');
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 14px;
  min-height: 56px;
  text-align: center;
  line-height: 1.3;
}

.package-dropdown:focus {
  outline: none;
  border-color: #4a90e2;
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
}
```

### Feature Checklist
```css
.feature-checklist {
  width: 100%;
  max-width: 400px;
  margin-bottom: 16px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 0;
  border-bottom: 1px dotted #e8e3db;
}

.feature-item:last-child {
  border-bottom: none;
}

.feature-checkmark {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #4a90e2;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.feature-checkmark::after {
  content: "✓";
  color: white;
  font-size: 10px;
  font-weight: 600;
}

.feature-text {
  font-size: 0.85rem;
  color: #6b6355;
  line-height: 1.3;
}
```

### Promo Badge
```css
.promo-badge-corner {
  position: absolute;
  top: -10px;
  right: 10px;
  background: #7ed321;
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 15;
}
```

### Sign Up Button
```css
.check-availability-btn {
  width: 100%;
  max-width: 280px;
  padding: 16px 24px;
  background: #ff6b35;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  line-height: 1.2;
  margin: 0 auto;
}

.check-availability-btn:hover {
  background: #e55a2b;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(255, 107, 53, 0.4);
}
```

## Responsive Design

### Tablet (1024px and below)
```css
@media (max-width: 1024px) {
  .provider-package-card {
    width: 340px;
    min-width: 340px;
    max-width: 340px;
    padding: 24px;
    margin: 0 auto;
    max-height: 560px;
    scroll-snap-align: center;
  }
}
```

### Mobile (768px and below)
```css
@media (max-width: 768px) {
  .container {
    padding: 0 16px;
  }

  .heading-gradient {
    font-size: 1.8rem;
  }

  .section-title {
    font-size: 1.5rem;
  }

  .title-container {
    margin-bottom: 20px;
  }

  .desktop-scroll-arrow {
    display: none;
  }

  .desktop-scroll-container {
    width: 100vw;
    max-width: 100vw;
    margin-left: calc(-50vw + 50%);
    margin-right: calc(-50vw + 50%);
    overflow: hidden;
  }

  .provider-package-display {
    gap: 20px;
    padding: 20px 16px;
    background: #e8e8e8;
    width: 100vw;
    max-width: 100vw;
    scroll-snap-type: x mandatory;
    scroll-padding: 0 16px;
    justify-content: flex-start;
  }

  .provider-package-card {
    width: calc((100vw - 40px) * 0.9);
    min-width: calc((100vw - 40px) * 0.9);
    max-width: calc((100vw - 40px) * 0.9);
    padding: 20px;
    margin: 0 20px;
    max-height: 540px;
    scroll-snap-align: center;
  }

  .provider-logo-main {
    max-width: 160px;
    max-height: 65px;
  }

  .price-main {
    font-size: 2.5rem;
  }

  .scroll-indicators {
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    margin: 10px auto 15px auto;
    padding: 8px 14px;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(15px);
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
    gap: 5px;
    width: fit-content;
    max-width: calc(100% - 32px);
    min-height: 24px;
  }
}
```

### Small Mobile (480px and below)
```css
@media (max-width: 480px) {
  .desktop-scroll-container {
    width: 100vw;
    max-width: 100vw;
    margin-left: calc(-50vw + 50%);
    margin-right: calc(-50vw + 50%);
    overflow: hidden;
  }

  .provider-package-display {
    gap: 16px;
    padding: 20px 12px;
    background: #e8e8e8;
    width: 100vw;
    max-width: 100vw;
    scroll-snap-type: x mandatory;
    scroll-padding: 0 12px;
    scrollbar-width: none;
    -ms-overflow-style: none;
    justify-content: flex-start;
  }

  .provider-package-card {
    width: calc((100vw - 32px) * 0.9);
    min-width: calc((100vw - 32px) * 0.9);
    max-width: calc((100vw - 32px) * 0.9);
    padding: 18px;
    margin: 0 16px;
    max-height: 520px;
    scroll-snap-align: center;
  }

  .provider-logo-main {
    max-width: 140px;
    max-height: 55px;
  }

  .price-main {
    font-size: 2.2rem;
  }

  .feature-checklist {
    margin-bottom: 20px;
  }

  .check-availability-btn {
    padding: 12px 18px;
    font-size: 0.95rem;
    max-width: 280px;
  }

  .scroll-indicators {
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    margin: 8px auto 12px auto;
    position: sticky;
    top: 60px;
    z-index: 10;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(15px);
    padding: 8px 14px;
    border-radius: 12px;
    border: 1px solid #000000;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    gap: 4px;
    width: fit-content;
    max-width: calc(100% - 32px);
    min-height: 22px;
  }

  .scroll-dot {
    width: 6px;
    height: 6px;
  }

  .scroll-dot.active {
    background: #4a90e2;
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
  }
}
```

## JavaScript Functionality

### Scroll Management
```javascript
// Add scroll functionality and indicators
useEffect(() => {
  const scrollContainer = document.getElementById('provider-package-display')
  const leftArrow = document.getElementById('desktop-scroll-left')
  const rightArrow = document.getElementById('desktop-scroll-right')
  const indicatorsContainer = document.getElementById('scroll-indicators')

  if (!scrollContainer || !leftArrow || !rightArrow || !indicatorsContainer) return

  const scrollAmount = 400 // Adjust scroll distance

  const handleLeftScroll = () => {
    scrollContainer.scrollBy({
      left: -scrollAmount,
      behavior: 'smooth'
    })
  }

  const handleRightScroll = () => {
    scrollContainer.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    })
  }

  // Add event listeners
  leftArrow.addEventListener('click', handleLeftScroll)
  rightArrow.addEventListener('click', handleRightScroll)

  // Update active indicator and arrow visibility based on scroll position
  const updateScrollState = () => {
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainer
    
    // Update active indicator based on scroll position
    const cardWidth = 380 // Desktop card width
    const gap = 60 // Desktop gap
    
    // Calculate mobile card width and gap
    let mobileCardWidth, mobileGap
    if (window.innerWidth <= 480) {
      mobileCardWidth = (window.innerWidth - 32) * 0.9 // calc((100vw - 32px) * 0.9)
      mobileGap = 32 // 16px margin on each side
    } else if (window.innerWidth <= 768) {
      mobileCardWidth = (window.innerWidth - 40) * 0.9 // calc((100vw - 40px) * 0.9)
      mobileGap = 40 // 20px margin on each side
    } else {
      mobileCardWidth = cardWidth
      mobileGap = gap
    }
    
    const currentCardWidth = window.innerWidth <= 768 ? mobileCardWidth : cardWidth
    const currentGap = window.innerWidth <= 768 ? mobileGap : gap
    
    const currentIndex = Math.round(scrollLeft / (currentCardWidth + currentGap))
    if (currentIndex !== activeProviderIndex && currentIndex < providerData.length) {
      setActiveProviderIndex(currentIndex)
    }
    
    // Update arrow visibility
    leftArrow.style.opacity = scrollLeft > 0 ? '1' : '0.3'
    rightArrow.style.opacity = scrollLeft < scrollWidth - clientWidth - 10 ? '1' : '0.3'
  }

  // Initial state
  updateScrollState()

  // Add scroll event listener
  scrollContainer.addEventListener('scroll', updateScrollState)

  // Add keyboard navigation
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      handleLeftScroll()
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      handleRightScroll()
    }
  }

  document.addEventListener('keydown', handleKeyDown)

  // Cleanup
  return () => {
    leftArrow.removeEventListener('click', handleLeftScroll)
    rightArrow.removeEventListener('click', handleRightScroll)
    scrollContainer.removeEventListener('scroll', updateScrollState)
    document.removeEventListener('keydown', handleKeyDown)
  }
}, [providerData.length, activeProviderIndex])
```

### Data Fetching
```javascript
const fetchData = async () => {
  try {
    setLoading(true)
    setError(null)

    // Fetch providers and packages
    const [providersResponse, packagesResponse] = await Promise.all([
      fetch('/api/providers'),
      fetch('/api/packages?type=FIBRE&include_promotions=true')
    ])

    if (!providersResponse.ok || !packagesResponse.ok) {
      throw new Error('Failed to fetch data')
    }

    const providers = await providersResponse.json()
    const packages = await packagesResponse.json()

    // Group packages by provider
    const providerMap = new Map()
    providers.forEach(provider => {
      providerMap.set(provider.id, {
        ...provider,
        packages: []
      })
    })

    packages.forEach(pkg => {
      const provider = providerMap.get(pkg.providerId)
      if (provider) {
        provider.packages.push(pkg)
      }
    })

    // Convert to array and sort by priority
    const providerData = Array.from(providerMap.values())
      .filter(provider => provider.packages.length > 0)
      .sort((a, b) => a.priority - b.priority)

    setProviderData(providerData)
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to load data')
  } finally {
    setLoading(false)
  }
}
```

### Package Selection
```javascript
const handlePackageSelect = (packageId: string) => {
  router.push(`/signup?package=${packageId}`)
}
```

## Loading and Error States

### Loading State
```tsx
if (loading) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-orange-500 mx-auto"></div>
        <p className="mt-4 text-lg text-gray-600">Loading fibre networks...</p>
      </div>
    </div>
  )
}
```

### Error State
```tsx
if (error) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Networks</h1>
        <p className="text-gray-600 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600"
        >
          Try Again
        </button>
      </div>
    </div>
  )
}
```

## TypeScript Interfaces

### Package Interface
```typescript
interface FibrePackage {
  id: string
  name: string
  type: string
  speed?: string
  data?: string
  aup?: string
  throttle?: string
  basePrice: number
  currentPrice: number
  active: boolean
  provider: {
    name: string
    slug: string
    logo?: string
  }
  promotions?: Array<{
    id: string
    code: string
    name: string
    discountType: string
    discountValue: number
  }>
  downloadSpeed?: number
  hasPromo?: boolean
  promoPrice?: number
  effectivePrice?: number
  promoSavings?: number
  promoDisplayText?: string
  promoBadgeHtml?: string
  promoDuration?: string
  promoType?: string
}
```

### Provider Interface
```typescript
interface ProviderData {
  name: string
  slug: string
  logo?: string
  packages: FibrePackage[]
  priority: number
}
```

## Key Features Summary

1. **Responsive Design**: Adapts to all screen sizes
2. **One Card at a Time**: Mobile shows one card with peek effect
3. **Smooth Scrolling**: CSS and JavaScript smooth scrolling
4. **Snap to Center**: Cards snap to center when scrolling
5. **Navigation**: Arrow keys, touch, and click navigation
6. **Scroll Indicators**: Visual dots for position tracking
7. **Loading States**: Proper loading and error handling
8. **Type Safety**: Full TypeScript support
9. **Accessibility**: Keyboard navigation support
10. **Performance**: Optimized rendering and scrolling

## File Locations

- **Main File**: `src/app/fibre/page.tsx`
- **Documentation**: `nextjs.md`
- **Server Port**: 3005 (http://localhost:3005/fibre)

## Complete Revert Instructions

If anything breaks and you need to restore this perfect state:

1. **Replace the entire file content** of `src/app/fibre/page.tsx` with the complete implementation
2. **Copy all CSS configurations** from this document
3. **Ensure all TypeScript interfaces** are properly defined
4. **Verify all JavaScript functionality** is intact
5. **Test responsive behavior** on all screen sizes
6. **Check scroll functionality** and snap behavior
7. **Verify loading and error states** work correctly

## Testing Checklist

- [ ] Desktop carousel works with arrow navigation
- [ ] Mobile shows one card at a time with peek effect
- [ ] Scroll indicators work and show correct position
- [ ] Keyboard navigation (arrow keys) works
- [ ] Touch scrolling works on mobile
- [ ] Cards snap to center properly
- [ ] Loading state displays correctly
- [ ] Error state displays correctly
- [ ] Package selection works
- [ ] Responsive design works on all screen sizes
- [ ] No console errors
- [ ] Smooth animations and transitions 

---

# 🏢 WEBSITE ARCHITECTURE & IMPLEMENTATION DETAILS

## Project Overview
A modern ISP reseller website for fibre and LTE products built with Next.js 14, featuring:
- **Full-Stack Architecture**: Next.js App Router with API routes
- **Database**: Prisma ORM with SQLite/PostgreSQL support
- **Authentication**: BetterAuth integration implemented
- **Payments**: Ozow payment gateway integration planned  
- **Security**: Built-in user data protection and admin controls
- **Deployment**: Railway hosting with GitHub CI/CD

## Current Stack
✅ **Next.js 15** with App Router (`src/app/`)  
✅ **API Routes** for backend logic (`src/app/api/`)  
✅ **TypeScript** throughout the application
✅ **Prisma ORM** with SQLite database (`prisma/`)  
✅ **Tailwind CSS** for responsive styling
✅ **Component System** for reusable UI (`src/components/`)
✅ **BetterAuth** - Free, open-source authentication system (`src/lib/auth.ts`)

## Development Commands
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Database operations
npx prisma generate
npx prisma db push
npx prisma db seed
npx prisma studio
```

## Project Structure
```
starcast-nextjs/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # Backend API routes
│   │   │   ├── packages/      # Package management
│   │   │   ├── promotions/    # Promotion system
│   │   │   └── providers/     # Provider endpoints
│   │   ├── fibre/            # Fibre packages page
│   │   ├── lte/              # LTE packages page
│   │   ├── signup/           # Application form
│   │   ├── layout.tsx        # Root layout with header
│   │   └── page.tsx          # Homepage
│   ├── components/           # Reusable components
│   │   ├── common/          # Shared UI components
│   │   ├── design-system/   # Design system components
│   │   ├── forms/           # Form components
│   │   ├── layout/          # Layout components
│   │   └── ui/              # Base UI components
│   └── lib/                 # Utilities and database
├── prisma/
│   ├── schema.prisma        # Database schema
│   ├── seed.ts             # Database seeding
│   └── dev.db              # SQLite database
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── tailwind.config.js      # Tailwind CSS config
└── next.config.js          # Next.js configuration
```

## Backend Features
### Database Schema (Prisma + SQLite)
- **Providers**: ISP provider information
- **Packages**: Fibre and LTE packages with pricing
- **Promotions**: Discount codes and special offers
- **Special Rates**: Customer-specific pricing
- **Users**: Customer information
- **Orders**: Purchase tracking

### API Endpoints
```bash
# Package Management
GET  /api/packages              # List packages with filtering
POST /api/packages              # Create new package

# Promotion System  
GET  /api/promotions            # List active promotions
POST /api/promotions            # Create new promotion
POST /api/promotions/validate   # Validate promo code

# Provider Management
GET  /api/providers             # List all providers
POST /api/providers             # Create new provider
```

## Core Pages
- **Homepage** (`/`): Hero section, testimonials, features showcase
- **Fibre Packages** (`/fibre`): Provider comparison with package selection
- **LTE Packages** (`/lte`): Mobile and fixed LTE options
- **Signup Forms** (`/signup`, `/lte/signup`): Package application with promo codes
- **Admin Import** (`/admin/import`): Excel data import interface

## Key Features Implemented
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Package Management**: Dynamic pricing with promotional codes
- **Provider System**: Logo management and package organization  
- **Data Import**: Excel/CSV import functionality for bulk updates
- **Type Safety**: Full TypeScript implementation
- **Performance**: Next.js optimizations and caching

## Environment Setup
1. Copy `.env.example` to `.env.local`
2. Configure database URL:
   ```
   DATABASE_URL="file:./dev.db"
   ```

## Database Management
### Initial Setup
```bash
# Generate Prisma client
npx prisma generate

# Create database and tables
npx prisma db push

# Seed with sample data
npx prisma db seed
```

### Data Management
```bash
# View data in browser
npx prisma studio

# Reset database
npx prisma db push --force-reset
```

## Deployment Strategy
- **Primary**: Railway hosting with PostgreSQL database
- **CI/CD**: GitHub Actions for automated deployment
- **Monitoring**: Built-in logging and error tracking
- **Security**: Environment variables and secret management

## Security Considerations
- **Data Protection**: Customer information encrypted at rest
- **API Security**: Rate limiting and input validation
- **Authentication**: BetterAuth with proper session management
- **Payment Security**: Ozow integration with proper callbacks
- **Admin Access**: Role-based permissions and audit logging

## Performance & Features
- **Server-Side Rendering**: Optimized SEO and initial load times
- **Dynamic Pricing**: Real-time package pricing with promotions
- **Responsive Design**: Mobile-first approach for all devices
- **Caching Strategy**: API responses cached for better performance
- **Error Handling**: Comprehensive error boundaries and user feedback

## API Integration Patterns
### Client-Side Data Fetching
```typescript
// In page components
const [packages, setPackages] = useState([])

useEffect(() => {
  fetch('/api/packages')
    .then(res => res.json())
    .then(setPackages)
}, [])
```

### Server-Side Data (Future Enhancement)
```typescript
// For SEO-critical pages
export async function generateStaticParams() {
  // Pre-fetch data at build time
}
```

## Development Workflow
1. **Feature Development**: Create feature branch → implement → test → merge
2. **Database Changes**: Update Prisma schema → migrate → seed
3. **Component Updates**: Update UI components → test responsiveness → deploy
4. **One Task at a Time**: Always complete current task before starting new one
5. **Update Documentation**: Keep CLAUDE.md and nextjs.md current after changes

## File Organization
```
starcast-nextjs/
├── src/app/              # Next.js App Router (pages & API routes)
├── src/components/       # Reusable UI components
├── src/lib/             # Database client and utilities
├── prisma/              # Database schema and migrations
├── public/              # Static assets (logos, images)
├── scripts/             # Database management scripts
└── data/               # CSV/Excel import files
```

## Development Guidelines
- **Code Quality**: TypeScript strict mode, ESLint, Prettier
- **Testing**: Test functionality after each major change
- **Security First**: Never expose sensitive data, validate all inputs
- **Performance**: Optimize images, cache API responses, minimize bundle size
- **Documentation**: Update both technical docs and user-facing content
- **Git Workflow**: Commit frequently with descriptive messages

---

# 🎉 BETTERAUTH IMPLEMENTATION STATUS

## ✅ **COMPLETED AUTHENTICATION SYSTEM**

### **Phase 1: Core Implementation - ✅ DONE**
- **✅ BetterAuth Installation**: `better-auth` and `@better-auth/cli` packages installed
- **✅ Configuration Created**: `src/lib/auth.ts` with Prisma adapter
- **✅ Environment Variables**: Added `BETTER_AUTH_SECRET` and base URL
- **✅ Database Schema Extended**: Added Session, Account, and Verification models
- **✅ API Routes**: `/api/auth/[...all]/route.ts` handles all authentication endpoints
- **✅ Client Library**: `src/lib/auth-client.ts` ready for React components

### **Available Authentication Endpoints**
```bash
POST /api/auth/sign-up      # User registration
POST /api/auth/sign-in      # User login
POST /api/auth/sign-out     # User logout
GET  /api/auth/session      # Get current session
POST /api/auth/forgot-password  # Password reset
POST /api/auth/reset-password   # Password reset confirmation
```

### **Security Features Implemented**
- **✅ Session Management**: 7-day sessions with 1-day refresh
- **✅ CSRF Protection**: Built-in cross-site request forgery protection
- **✅ Rate Limiting**: Prevents brute force attacks
- **✅ Password Security**: Scrypt hashing algorithm (memory-hard)
- **✅ Environment Security**: Secret key validation
- **✅ Database Integration**: Secure Prisma adapter with SQLite

### **Database Schema Updates**
Extended existing User model with BetterAuth compatibility:
- Added `name`, `image` fields for profile data
- Made `firstName`, `lastName`, `password` optional
- Added `Session`, `Account`, `Verification` models

### **Files Created/Modified**
```
✅ src/lib/auth.ts                    # BetterAuth server configuration
✅ src/lib/auth-client.ts             # Client-side auth functions
✅ src/app/api/auth/[...all]/route.ts # API endpoint handler
✅ prisma/schema.prisma               # Extended with auth models
✅ .env                               # Added BETTER_AUTH_SECRET
✅ .env.example                       # Updated with BetterAuth vars
✅ package.json                       # Added better-auth dependencies
```

### **ISP Platform Ready**
The authentication foundation is now production-ready for your Starcast ISP reseller platform:
- **✅ No Vendor Lock-in**: Self-hosted, open-source solution
- **✅ Cost Effective**: Zero authentication costs regardless of user count  
- **✅ Scalable**: Handles growing ISP customer base
- **✅ Secure**: Enterprise-grade security features built-in
- **✅ Customizable**: Full control over authentication logic and flows

**Next Phase**: Ready to build customer-facing login forms and admin dashboard components.

---

# 📡 LTE-5G PAGE IMPLEMENTATION CHECKLIST

## **✅ ANALYSIS COMPLETED**

Based on analysis of the existing fibre page structure and Axxess pricing data, here's the implementation plan for the LTE-5G page:

### **🎯 LTE-5G Page Requirements**

#### **Provider Structure Identified:**
- **Vodacom**: Uncapped Fixed LTE, Uncapped Fixed 5G  
- **MTN**: Uncapped Fixed LTE, Uncapped Fixed 5G
- **Telkom**: Uncapped LTE (no 5G offering)

#### **Package Types to Implement:**
1. **Vodacom Fixed LTE** - 4 uncapped packages (20Mbps-PRO)
2. **Vodacom Fixed 5G** - 4 uncapped packages (STANDARD-PRO+)
3. **MTN Fixed LTE** - 5 uncapped packages (30Mbps-PRO)
4. **MTN Fixed 5G** - 4 uncapped packages (STANDARD-PRO+)
5. **Telkom LTE** - 3 uncapped packages (10-30Mbps)

## **📋 IMPLEMENTATION CHECKLIST**

### **Phase 1: Database Schema & Data Setup**

#### **☐ Task 1.1: Extend Database Schema**
- [ ] Update `Package` model to support LTE/5G specific fields:
  - `speed` (e.g., "Up to 30Mbps")
  - `fupLimit` (Fair Use Policy limit in GB - renamed from aupLimit)
  - `throttleSpeed` (Speed after FUP limit reached)
  - `secondaryThrottleSpeed` (Final throttle speed for Telkom multi-tier)
  - `networkType` enum: LTE | 5G
  - `fupDescription` (Detailed FUP terms for card subtext)
  - `specialTerms` (Additional terms like P2P throttling)
- [ ] Add LTE/5G providers if not exist:
  - Vodacom (slug: vodacom)
  - MTN (slug: mtn) 
  - Telkom (slug: telkom)

#### **☐ Task 1.2: Create Seed Data with Complete FUP Terms**
- [ ] **Vodacom Fixed LTE Packages:**
  ```typescript
  // Package 1: Up to 20Mbps - R269/pm
  fupLimit: 50, throttleSpeed: "2Mbps", 
  fupDescription: "50GB at up to 20Mbps, then 2Mbps unlimited"
  
  // Package 2: Up to 30Mbps - R369/pm  
  fupLimit: 150, throttleSpeed: "2Mbps",
  fupDescription: "150GB at up to 30Mbps, then 2Mbps unlimited"
  
  // Package 3: Up to 50Mbps - R469/pm
  fupLimit: 300, throttleSpeed: "2Mbps",
  fupDescription: "300GB at up to 50Mbps, then 2Mbps unlimited"
  
  // Package 4: Uncapped LTE PRO - R669/pm
  fupLimit: 600, throttleSpeed: "1Mbps",
  fupDescription: "600GB at full speed, then 1Mbps unlimited"
  ```

- [ ] **Vodacom Fixed 5G Packages:**
  ```typescript
  // STANDARD - R445/pm
  fupLimit: 250, throttleSpeed: "2Mbps",
  fupDescription: "250GB at up to 500Mbps, then 2Mbps unlimited"
  
  // ADVANCED - R645/pm
  fupLimit: 350, throttleSpeed: "2Mbps", 
  fupDescription: "350GB at up to 500Mbps, then 2Mbps unlimited"
  
  // PRO - R845/pm
  fupLimit: 550, throttleSpeed: "2Mbps",
  fupDescription: "550GB at up to 500Mbps, then 2Mbps unlimited"
  
  // PRO+ - R945/pm
  fupLimit: 750, throttleSpeed: "2Mbps",
  fupDescription: "750GB at up to 500Mbps, then 2Mbps unlimited"
  ```

- [ ] **MTN Fixed LTE Packages:**
  ```typescript
  // Package 1: Up to 30Mbps - R339/pm
  fupLimit: 50, throttleSpeed: "2Mbps",
  fupDescription: "50GB at up to 30Mbps, then 2Mbps unlimited"
  
  // Package 2: Up to 75Mbps - R379/pm
  fupLimit: 150, throttleSpeed: "2Mbps",
  fupDescription: "150GB at up to 75Mbps, then 2Mbps unlimited"
  
  // Package 3: Up to 125Mbps - R469/pm
  fupLimit: 300, throttleSpeed: "2Mbps",
  fupDescription: "300GB at up to 125Mbps, then 2Mbps unlimited"
  
  // Package 4: Up to 150Mbps - R569/pm
  fupLimit: 500, throttleSpeed: "2Mbps",
  fupDescription: "500GB at up to 150Mbps, then 2Mbps unlimited"
  
  // Package 5: Uncapped LTE PRO - R799/pm
  fupLimit: 1000, throttleSpeed: "1Mbps",
  fupDescription: "1000GB at full speed, then 1Mbps unlimited"
  ```

- [ ] **MTN Fixed 5G Packages:**
  ```typescript
  // STANDARD - R399/pm
  fupLimit: 300, throttleSpeed: "2Mbps",
  fupDescription: "300GB at up to 500Mbps, then 2Mbps unlimited"
  
  // ADVANCED - R549/pm
  fupLimit: 450, throttleSpeed: "2Mbps",
  fupDescription: "450GB at up to 500Mbps, then 2Mbps unlimited"
  
  // PRO - R649/pm
  fupLimit: 600, throttleSpeed: "2Mbps",
  fupDescription: "600GB at up to 500Mbps, then 2Mbps unlimited"
  
  // PRO+ - R849/pm
  fupLimit: 1000, throttleSpeed: "2Mbps",
  fupDescription: "1000GB at up to 500Mbps, then 2Mbps unlimited"
  ```

- [ ] **Telkom LTE Packages (Multi-tier FUP):**
  ```typescript
  // Package 1: 10 Mbps - R298/pm (PROMO until Dec 2025)
  fupLimit: 100, throttleSpeed: "4Mbps", secondaryThrottleSpeed: "2Mbps",
  fupDescription: "100GB @ 10Mbps, then 20GB @ 4Mbps, then 2Mbps unlimited",
  specialTerms: "P2P/NNTP traffic further throttled"
  
  // Package 2: 20 Mbps - R589/pm
  fupLimit: 500, throttleSpeed: "4Mbps", secondaryThrottleSpeed: "2Mbps",
  fupDescription: "500GB @ 20Mbps, then 50GB @ 4Mbps, then 2Mbps unlimited",
  specialTerms: "P2P/NNTP traffic further throttled"
  
  // Package 3: 30 Mbps - R679/pm
  fupLimit: 600, throttleSpeed: "4Mbps", secondaryThrottleSpeed: "2Mbps", 
  fupDescription: "600GB @ 30Mbps, then 50GB @ 4Mbps, then 2Mbps unlimited",
  specialTerms: "P2P/NNTP traffic further throttled"
  ```