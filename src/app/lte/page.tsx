'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getProviderLogo } from '@/utils/providerLogos'

interface LTEPackage {
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
  technology?: string
  coverage?: string
  installation?: string
}

interface ProviderData {
  name: string
  slug: string
  logo?: string
  packages: LTEPackage[]
  priority: number
}

export default function LTEPage() {
  const router = useRouter()
  const [providerData, setProviderData] = useState<ProviderData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeProviderIndex, setActiveProviderIndex] = useState(0)

  useEffect(() => {
    fetchData()
  }, [])

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

  const fetchData = async () => {
    try {
      // Fetch LTE packages and providers - using dedicated LTE endpoint
      const [packagesResponse, providersResponse] = await Promise.all([
        fetch('/api/lte-packages?include_promotions=true'),
        fetch('/api/providers')
      ])

      if (!packagesResponse.ok || !providersResponse.ok) {
        throw new Error('Failed to fetch data')
      }

      const packagesData = await packagesResponse.json()
      const providersData = await providersResponse.json()

      const packages = packagesData.data || []
      const providers = providersData.data || []

      // Group packages by provider - show all providers from backend
      const grouped: ProviderData[] = []

      providers.forEach((provider: any) => {
        // Get packages for this provider - API already filters for LTE packages
        const providerPackages = packages.filter((pkg: LTEPackage) => 
          pkg.provider.slug === provider.slug
        )

        if (providerPackages.length > 0) {
          // Sort packages by price
          const sortedPackages = providerPackages.sort((a: LTEPackage, b: LTEPackage) => {
            return a.currentPrice - b.currentPrice
          })

          grouped.push({
            name: provider.name,
            slug: provider.slug,
            logo: getProviderLogo(provider.name, provider.slug) || provider.logo,
            packages: sortedPackages,
            priority: 0 // All providers have equal priority
          })
        }
      })

      // Sort providers alphabetically
      grouped.sort((a, b) => a.name.localeCompare(b.name))
      
      setProviderData(grouped)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handlePackageSelect = (packageId: string) => {
    router.push(`/lte/signup?package=${packageId}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading LTE networks...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Networks</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="lte-page">
      <header className="lte-header">
        <div className="container">
          <h1 className="heading-gradient">
            LTE Internet. <span>Connect Anywhere.</span>
          </h1>
        </div>
      </header>

      <section className="lte-section">
        <div className="container">
          <div className="title-container">
            <h2 className="section-title">Choose an LTE Network</h2>
          </div>
          
          <div className="scroll-indicators" id="scroll-indicators">
            {/* Mobile scroll indicators */}
            {providerData.map((provider, index) => (
              <div 
                key={provider.slug}
                className={`scroll-dot ${index === activeProviderIndex ? 'active' : ''}`}
                onClick={() => {
                  const scrollContainer = document.getElementById('provider-package-display')
                  if (scrollContainer) {
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
                    
                    const scrollPosition = (currentCardWidth + currentGap) * index
                    scrollContainer.scrollTo({
                      left: scrollPosition,
                      behavior: 'smooth'
                    })
                    setActiveProviderIndex(index)
                  }
                }}
              />
            ))}
          </div>
          
          <div className="desktop-scroll-container">
            <button className="desktop-scroll-arrow desktop-scroll-left" id="desktop-scroll-left">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                <path fill="currentColor" d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
              </svg>
            </button>
            
            <div className="provider-package-display" id="provider-package-display">
              {providerData.length === 0 ? (
                <div className="no-packages">No LTE providers available at the moment.</div>
              ) : (
                providerData.map((provider, providerIndex) => (
                  <LTEPackageCard
                    key={provider.slug}
                    provider={provider}
                    providerIndex={providerIndex}
                    onPackageSelect={handlePackageSelect}
                  />
                ))
              )}
            </div>
            
            <button className="desktop-scroll-arrow desktop-scroll-right" id="desktop-scroll-right">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                <path fill="currentColor" d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
              </svg>
            </button>
          </div>
        </div>
      </section>

      <style jsx>{`
        .lte-page {
          font-family: 'Poppins', 'Inter', sans-serif;
          color: #4a453f;
          background: #e8e8e8;
          width: 100%;
          overflow-x: hidden;
          min-height: 100vh;
        }

        .container {
          width: 100%;
          max-width: 100%;
          margin: 0 auto;
          padding: 0;
        }

        .lte-header {
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

        .lte-section {
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

        .desktop-scroll-container {
          position: relative;
          display: flex;
          align-items: center;
          width: 100vw;
          max-width: 100vw;
          overflow: hidden;
          margin-left: calc(-50vw + 50%);
          margin-right: calc(-50vw + 50%);
        }

        .provider-package-display {
          display: flex;
          gap: 60px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          scrollbar-width: none;
          -ms-overflow-style: none;
          margin: 0;
          padding: 20px 80px;
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

        .no-packages {
          grid-column: 1 / -1;
          text-align: center;
          padding: 40px;
          color: #6b6355;
          background: #ffffff;
          backdrop-filter: blur(20px);
          border: 1px solid #000000;
          border-radius: 20px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }

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
            padding: 20px 40px;
            background: #e8e8e8;
            width: 100vw;
            max-width: 100vw;
            scroll-snap-type: x mandatory;
            scroll-padding: 0 40px;
            justify-content: flex-start;
          }

          .provider-package-card {
            scroll-snap-align: center;
            margin: 0 auto;
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
            padding: 20px 24px;
            background: #e8e8e8;
            width: 100vw;
            max-width: 100vw;
            scroll-snap-type: x mandatory;
            scroll-padding: 0 24px;
            scrollbar-width: none;
            -ms-overflow-style: none;
            justify-content: flex-start;
          }

          .provider-package-card {
            scroll-snap-align: center;
            margin: 0 auto;
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
      `}</style>
    </div>
  )
}

interface LTEPackageCardProps {
  provider: ProviderData
  providerIndex: number
  onPackageSelect: (packageId: string) => void
}

function LTEPackageCard({ provider, providerIndex, onPackageSelect }: LTEPackageCardProps) {
  const [selectedPackage, setSelectedPackage] = useState(provider.packages[0] || null)

  const handlePackageChange = (packageId: string) => {
    const newPackage = provider.packages.find(pkg => pkg.id === packageId)
    if (newPackage) {
      setSelectedPackage(newPackage)
    }
  }

  const handleSignUpClick = () => {
    if (selectedPackage) {
      // Store package data for signup page
      const packageData = {
        id: selectedPackage.id,
        name: selectedPackage.name,
        price: selectedPackage.currentPrice,
        provider: selectedPackage.provider.name,
        speed: selectedPackage.speed,
        data: selectedPackage.data,
        type: selectedPackage.type,
        hasPromo: selectedPackage.hasPromo,
        promoPrice: selectedPackage.promoPrice,
        effectivePrice: selectedPackage.effectivePrice,
        promoSavings: selectedPackage.promoSavings,
        promoDisplayText: selectedPackage.promoDisplayText
      }
      
      // Store in sessionStorage for signup page
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('selectedLTEPackage', JSON.stringify(packageData))
      }
      
      onPackageSelect(selectedPackage.id)
    }
  }

  if (!selectedPackage) {
    return null
  }

  // Create download speed from the speed field if it exists
  let downloadSpeed = '10'
  
  if (selectedPackage.speed) {
    if (selectedPackage.speed.includes('unlimited')) {
      // For unlimited packages, show the full speed text including Mbps
      downloadSpeed = selectedPackage.speed
    } else {
      const speeds = selectedPackage.speed.split('/')
      downloadSpeed = speeds[0]?.replace(/[^0-9]/g, '') || '10'
    }
  }

  const hasPromo = Array.isArray(selectedPackage.promotions) && selectedPackage.promotions.length > 0
  const promotion = hasPromo ? selectedPackage.promotions?.[0] : null
  
  // Calculate promo price
  let displayPrice = selectedPackage.currentPrice
  if (promotion) {
    switch (promotion.discountType) {
      case 'PERCENTAGE':
        displayPrice = selectedPackage.currentPrice * (1 - promotion.discountValue / 100)
        break
      case 'FIXED_AMOUNT':
        displayPrice = Math.max(0, selectedPackage.currentPrice - promotion.discountValue)
        break
      case 'OVERRIDE_PRICE':
        displayPrice = promotion.discountValue
        break
    }
  }

  const isFixedLTE = selectedPackage.type === 'LTE_FIXED'

  return (
    <div 
      className="provider-package-card"
      data-provider-index={providerIndex}
    >
      {hasPromo && (
        <div className="promo-badge-corner">
          Promotion
        </div>
      )}

      <img 
        src={provider.logo} 
        alt={provider.name} 
        className="provider-logo-main"
      />

      <div className="lte-type-badge">
        {isFixedLTE ? '📡 Fixed LTE' : '📱 Mobile LTE'}
      </div>

      <div className="speed-info">
        <span className="download-arrow">↓</span>
        <span className="current-download">{downloadSpeed}</span>
        {!selectedPackage.speed?.includes('unlimited') && <span>Mbps</span>}
      </div>

      {selectedPackage.data && (
        <div className="data-info">
          {selectedPackage.data}
        </div>
      )}

      <div className="price-display">
        {hasPromo && (
          <span className="price-strikethrough">R{selectedPackage.currentPrice}pm</span>
        )}
        <span className="price-main current-price">R{Math.round(displayPrice)}</span>
        <span className="price-period">pm</span>
      </div>

      <div className="package-selector">
        <select 
          className="package-dropdown"
          value={selectedPackage.id}
          onChange={(e) => handlePackageChange(e.target.value)}
        >
          {provider.packages.map(pkg => {
            // Handle unlimited speeds properly
            let displaySpeed = '10'
            let displayText = ''
            
            if (pkg.speed) {
              if (pkg.speed.includes('unlimited')) {
                // For unlimited packages, show the full speed text including Mbps
                displayText = pkg.speed
              } else {
                const pkgSpeeds = pkg.speed.split('/')
                displaySpeed = pkgSpeeds[0]?.replace(/[^0-9]/g, '') || '10'
                displayText = `${displaySpeed} Mbps`
              }
            } else {
              displayText = `${displaySpeed} Mbps`
            }
            
            const pkgType = pkg.type === 'LTE_FIXED' ? 'Fixed' : 'Mobile'
            
            return (
              <option 
                key={pkg.id} 
                value={pkg.id}
                data-speed={pkg.speed}
                data-price={pkg.currentPrice}
                data-has-promo={Array.isArray(pkg.promotions) && pkg.promotions.length > 0}
              >
                {displayText} {pkgType} LTE
              </option>
            )
          })}
        </select>
      </div>

      <div className="feature-checklist">
        <div className="feature-item">
          <div className="feature-checkmark"></div>
          <div className="feature-text router-compatibility" data-tooltip="Compatible router models available">
            Compatible routers
            <div className="router-tooltip">
              {provider.name === 'MTN' && (
                <>
                  <div className="tooltip-header">MTN Approved Routers (2025):</div>
                  <div className="tooltip-section">
                    <strong>BROVI:</strong> 5G CPE 5 H155-381, H155-382, H352-381
                  </div>
                  <div className="tooltip-section">
                    <strong>HUAWEI:</strong> 5G CPE PRO 2, 5G SIC
                  </div>
                  <div className="tooltip-section">
                    <strong>NOKIA:</strong> FastMile 5G Gateway 3.2
                  </div>
                  <div className="tooltip-section">
                    <strong>TOZED:</strong> ZLT X100 PRO, ZLT X20
                  </div>
                  <div className="tooltip-section">
                    <strong>TP-LINK:</strong> NX510v
                  </div>
                  <div className="tooltip-section">
                    <strong>ZTE:</strong> MC801A, G5B, G5C, G5TS, MC888 5G, MC888D 5G, MC889 5G, MF296D, MF297D
                  </div>
                  <div className="tooltip-section">
                    <strong>ZYXEL:</strong> LTE7490-M904
                  </div>
                  <div className="tooltip-warning">
                    <strong>⚠️ Warning:</strong> Only approved devices work. Unapproved devices will be blocked.
                  </div>
                </>
              )}
              
              {provider.name === 'Vodacom' && (
                <>
                  <div className="tooltip-header">Vodacom Approved Routers (2024):</div>
                  <div className="tooltip-section">
                    <strong>Alcatel:</strong> Linkhub HH72v
                  </div>
                  <div className="tooltip-section">
                    <strong>Huawei:</strong> B315s, B535-932, B525S-65A, B612-233, B612S-25D, B618S-22D, 5G CPE PRO2
                  </div>
                  <div className="tooltip-section">
                    <strong>Nokia:</strong> Fastmile 5G Gateway (5G-04W-A)
                  </div>
                  <div className="tooltip-section">
                    <strong>TP-Link:</strong> TL-MR100, MR200, MR600, MR600 Archer
                  </div>
                  <div className="tooltip-section">
                    <strong>ZTE:</strong> MC801A1, MF286R, MF286C1, MF286C, MF283+, MC8010A
                  </div>
                  <div className="tooltip-section">
                    <strong>Teltonika:</strong> RUTX
                  </div>
                  <div className="tooltip-warning">
                    <strong>⚠️ Warning:</strong> Only Vodacom-approved devices work with Home LTE service.
                  </div>
                </>
              )}
              
              {provider.name === 'Telkom' && (
                <>
                  <div className="tooltip-header">Telkom Compatible Routers (2024):</div>
                  <div className="tooltip-section">
                    <strong>D-Link:</strong> DWR-957M/TK, DWR-956M/TK, DWR-921, G413K
                  </div>
                  <div className="tooltip-section">
                    <strong>General LTE:</strong> Most standard LTE routers work
                  </div>
                  <div className="tooltip-section">
                    <strong>Cat 6 Support:</strong> Up to 300Mbps capable devices
                  </div>
                  <div className="tooltip-section">
                    <strong>Frequencies:</strong> Compatible with 2300MHz LTE band
                  </div>
                  <div className="tooltip-info">
                    <strong>✓ Flexible:</strong> Telkom allows most LTE routers for SIM-only products. Less restrictive than other networks.
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="feature-item">
          <div className="feature-checkmark"></div>
          <div className="feature-text">Free delivery</div>
        </div>
        <div className="feature-item">
          <div className="feature-checkmark"></div>
          <div className="feature-text">Nationwide coverage</div>
        </div>
        <div className="feature-item">
          <div className="feature-checkmark"></div>
          <div className="feature-text">Order processing fee: R249</div>
        </div>
        <div className="feature-item">
          <div className="feature-checkmark"></div>
          <div className="feature-text">Pro rata rates apply</div>
        </div>
      </div>

      <button 
        className="check-availability-btn"
        onClick={handleSignUpClick}
      >
        Sign Up
      </button>

      <style jsx>{`
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

        .provider-logo-main {
          max-width: 160px;
          max-height: 60px;
          margin-bottom: 8px;
          object-fit: contain;
        }

        .lte-type-badge {
          background: #4a90e2;
          color: white;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 600;
          margin-bottom: 8px;
          text-align: center;
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



        .data-info {
          font-size: 0.9rem;
          color: #6b6355;
          margin-bottom: 8px;
          text-align: center;
          font-weight: 500;
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

        .router-compatibility {
          position: relative;
          cursor: pointer;
        }

        .router-tooltip {
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          background: #2d2823;
          color: white;
          padding: 12px 16px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          font-size: 0.7rem;
          line-height: 1.3;
          width: 350px;
          max-width: 95vw;
          max-height: 450px;
          overflow-y: auto;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
          z-index: 1000;
          border: 2px dotted #4a90e2;
          margin-bottom: 8px;
        }

        .router-compatibility:hover .router-tooltip {
          opacity: 1;
          visibility: visible;
        }

        .router-tooltip::after {
          content: '';
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          border: 6px solid transparent;
          border-top-color: #2d2823;
        }

        .tooltip-header {
          font-weight: 600;
          margin-bottom: 8px;
          color: #4a90e2;
          border-bottom: 1px dotted #4a90e2;
          padding-bottom: 4px;
        }

        .tooltip-section {
          margin-bottom: 6px;
        }

        .tooltip-section:last-child {
          margin-bottom: 0;
        }

        .tooltip-section strong {
          color: #4a90e2;
        }

        .tooltip-warning {
          margin-top: 8px;
          padding: 6px 8px;
          background: rgba(255, 107, 53, 0.1);
          border: 1px solid #ff6b35;
          border-radius: 4px;
          font-size: 0.65rem;
        }

        .tooltip-warning strong {
          color: #ff6b35;
        }

        .tooltip-info {
          margin-top: 8px;
          padding: 6px 8px;
          background: rgba(116, 185, 74, 0.1);
          border: 1px solid #74b94a;
          border-radius: 4px;
          font-size: 0.65rem;
        }

        .tooltip-info strong {
          color: #74b94a;
        }

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

        @media (max-width: 1024px) {
          .provider-package-card {
            width: 340px;
            min-width: 340px;
            max-width: 340px;
            padding: 24px;
            max-height: 560px;
          }
        }

        @media (max-width: 768px) {
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

          .router-tooltip {
            width: 320px;
            font-size: 0.68rem;
            max-height: 400px;
          }
        }

        @media (max-width: 480px) {
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

          .router-tooltip {
            width: 300px;
            font-size: 0.65rem;
            padding: 10px 12px;
            max-height: 350px;
          }
        }
      `}</style>
    </div>
  )
}