'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getProviderLogo } from '@/utils/providerLogos'

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
    description?: string
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

interface ProviderData {
  name: string
  slug: string
  logo?: string
  packages: FibrePackage[]
  priority: number
}

export default function FibrePage() {
  const router = useRouter()
  const [providerData, setProviderData] = useState<ProviderData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeProviderIndex, setActiveProviderIndex] = useState(0)

  useEffect(() => {
    fetchData()
    
    // Add global error handler for unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.warn('Unhandled promise rejection caught:', event.reason)
      event.preventDefault()
    }
    
    window.addEventListener('unhandledrejection', handleUnhandledRejection)
    
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [])

  // Add scroll functionality and indicators
  useEffect(() => {
    try {
      const scrollContainer = document.getElementById('provider-package-display')
      const leftArrow = document.getElementById('desktop-scroll-left')
      const rightArrow = document.getElementById('desktop-scroll-right')

      if (!scrollContainer || !leftArrow || !rightArrow) return

    const scrollAmount = 400

    const handleLeftScroll = () => {
      try {
        if (!scrollContainer) return
        
        // Enhanced smooth scroll with momentum
        if (scrollContainer.style) {
          scrollContainer.style.scrollBehavior = 'smooth'
        }
        
        scrollContainer.scrollBy({
          left: -scrollAmount,
          behavior: 'smooth'
        })
        
        // Add visual feedback
        if (leftArrow && leftArrow.style) {
          leftArrow.style.transform = 'translateY(-50%) scale(0.9)'
          setTimeout(() => {
            if (leftArrow && leftArrow.style && rightArrow && rightArrow.style) {
              leftArrow.style.transform = 'translateY(-50%) scale(1)'
              leftArrow.style.opacity = '1'
              rightArrow.style.opacity = '1'
            }
          }, 150)
        }
      } catch (error) {
        console.warn('handleLeftScroll error:', error)
      }
    }

    const handleRightScroll = () => {
      try {
        if (!scrollContainer) return
        
        // Enhanced smooth scroll with momentum
        if (scrollContainer.style) {
          scrollContainer.style.scrollBehavior = 'smooth'
        }
        
        scrollContainer.scrollBy({
          left: scrollAmount,
          behavior: 'smooth'
        })
        
        // Add visual feedback
        if (rightArrow && rightArrow.style) {
          rightArrow.style.transform = 'translateY(-50%) scale(0.9)'
          setTimeout(() => {
            if (leftArrow && leftArrow.style && rightArrow && rightArrow.style) {
              rightArrow.style.transform = 'translateY(-50%) scale(1)'
              leftArrow.style.opacity = '1'
              rightArrow.style.opacity = '1'
            }
          }, 150)
        }
      } catch (error) {
        console.warn('handleRightScroll error:', error)
      }
    }

    // Add event listeners
    leftArrow.addEventListener('click', handleLeftScroll)
    rightArrow.addEventListener('click', handleRightScroll)

    // Optimized scroll state with cached calculations
    const updateScrollState = () => {
      try {
        if (!scrollContainer) return
        
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainer
        const viewportCenter = scrollLeft + (clientWidth / 2)
        
        // Use cached card elements
        const cardElements = getCachedCardElements()
        
        // Fast distance calculation using scroll position estimation
        let currentIndex = 0
        let minDistance = Infinity
        
        // More efficient approach: estimate positions first, then verify with DOM
        const cardWidth = window.innerWidth <= 768 ? 
          (window.innerWidth <= 480 ? Math.min(300, window.innerWidth - 40) : Math.min(320, window.innerWidth - 60)) : 380
        const gap = window.innerWidth <= 768 ? 
          (window.innerWidth <= 480 ? 16 : 20) : 60
        const padding = window.innerWidth <= 768 ? 
          (window.innerWidth <= 480 ? 20 : 30) : 80
        
        // Quick estimation first
        const estimatedIndex = Math.round((viewportCenter - padding - (cardWidth / 2)) / (cardWidth + gap))
        const startIndex = Math.max(0, estimatedIndex - 1)
        const endIndex = Math.min(cardElements.length - 1, estimatedIndex + 1)
        
        // Only check DOM positions for nearby cards
        for (let i = startIndex; i <= endIndex; i++) {
          const card = cardElements[i]
          if (card) {
            const cardRect = card.getBoundingClientRect()
            const containerRect = scrollContainer.getBoundingClientRect()
            const cardCenter = cardRect.left - containerRect.left + scrollLeft + (cardRect.width / 2)
            const distance = Math.abs(cardCenter - viewportCenter)
            
            if (distance < minDistance) {
              minDistance = distance
              currentIndex = i
            }
          }
        }
        
        // Batch DOM updates to avoid layout thrashing
        requestAnimationFrame(() => {
          cardElements.forEach((card, index) => {
            if (card && card.classList) {
              const shouldBeActive = index === currentIndex
              const isActive = card.classList.contains('snap-active')
              
              if (shouldBeActive && !isActive) {
                card.classList.add('snap-active')
              } else if (!shouldBeActive && isActive) {
                card.classList.remove('snap-active')
              }
            }
          })
        })
        
        // Debounced state update to prevent excessive re-renders
        if (currentIndex !== activeProviderIndex && currentIndex < providerData.length && currentIndex >= 0) {
          try {
            setActiveProviderIndex(currentIndex)
          } catch {
            // Ignore state update errors
          }
        }
        
        // Update arrow visibility
        if (leftArrow && leftArrow.style && rightArrow && rightArrow.style) {
          leftArrow.style.opacity = scrollLeft > 10 ? '1' : '0.5'
          rightArrow.style.opacity = scrollLeft < scrollWidth - clientWidth - 10 ? '1' : '0.5'
        }
        
      } catch (error) {
        console.warn('updateScrollState error:', error)
      }
    }

    updateScrollState()
    
    // Optimized scroll handling with throttling
    let isScrolling = false
    let scrollTimeout: NodeJS.Timeout | null = null
    let animationFrame: number | null = null
    let lastScrollTime = 0
    let cardElementsCache: NodeListOf<Element> | null = null
    
    // Cache DOM queries for performance
    const getCachedCardElements = () => {
      if (!cardElementsCache) {
        cardElementsCache = scrollContainer.querySelectorAll('.provider-package-card')
      }
      return cardElementsCache
    }
    
    // Throttled scroll handler using requestAnimationFrame
    const handleScroll = (_event: Event) => {
      try {
        const now = performance.now()
        
        // Throttle to 60fps max
        if (now - lastScrollTime < 16) return
        lastScrollTime = now
        
        if (animationFrame) {
          cancelAnimationFrame(animationFrame)
        }
        
        animationFrame = requestAnimationFrame(() => {
          updateScrollState()
        })
        
        if (!isScrolling) {
          if (scrollContainer && scrollContainer.style) {
            scrollContainer.style.scrollSnapType = 'none'
          }
          isScrolling = true
        }
        
        if (scrollTimeout) {
          clearTimeout(scrollTimeout)
        }
        
        scrollTimeout = setTimeout(() => {
          if (scrollContainer && scrollContainer.style) {
            scrollContainer.style.scrollSnapType = 'x mandatory'
          }
          isScrolling = false
          
          // Final state update after snapping
          if (animationFrame) {
            cancelAnimationFrame(animationFrame)
          }
          animationFrame = requestAnimationFrame(() => {
            updateScrollState()
          })
        }, 150)
        
      } catch (error) {
        console.warn('Scroll handler error:', error)
      }
    }
    
    scrollContainer.addEventListener('scroll', handleScroll, { passive: true })

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

      return () => {
        try {
          if (leftArrow) leftArrow.removeEventListener('click', handleLeftScroll)
          if (rightArrow) rightArrow.removeEventListener('click', handleRightScroll)
          if (scrollContainer) scrollContainer.removeEventListener('scroll', handleScroll)
          document.removeEventListener('keydown', handleKeyDown)
          if (scrollTimeout) clearTimeout(scrollTimeout)
          if (animationFrame) cancelAnimationFrame(animationFrame)
          cardElementsCache = null
        } catch (cleanupError) {
          console.warn('Cleanup error:', cleanupError)
        }
      }
    } catch (effectError) {
      console.warn('useEffect error:', effectError)
      return () => {}
    }
  }, [providerData.length, activeProviderIndex])

  const fetchData = async () => {
    try {
      const [packagesResponse, providersResponse] = await Promise.all([
        fetch('/api/fibre-packages?include_promotions=true'),
        fetch('/api/providers')
      ])

      if (!packagesResponse.ok || !providersResponse.ok) {
        throw new Error('Failed to fetch data')
      }

      const packagesData = await packagesResponse.json()
      const providersData = await providersResponse.json()

      const packages = packagesData.data || []
      const providers = providersData.data || []

      const grouped: ProviderData[] = []

      providers.forEach((provider: any) => {
        const providerPackages = packages.filter((pkg: FibrePackage) => 
          pkg.provider.slug === provider.slug
        )

        if (providerPackages.length > 0) {
          const sortedPackages = providerPackages.sort((a: FibrePackage, b: FibrePackage) => {
            const aSpeed = parseInt(a.speed?.replace(/[^0-9]/g, '') || '0')
            const bSpeed = parseInt(b.speed?.replace(/[^0-9]/g, '') || '0')
            return aSpeed - bSpeed
          })

          grouped.push({
            name: provider.name,
            slug: provider.slug,
            logo: getProviderLogo(provider.name, provider.slug) || provider.logo,
            packages: sortedPackages,
            priority: 0
          })
        }
      })

      grouped.sort((a, b) => a.name.localeCompare(b.name))
      setProviderData(grouped)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handlePackageSelect = (packageId: string) => {
    router.push(`/signup?package=${packageId}`)
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0ebe3 0%, #e8dfd5 30%, #ede4d8 70%, #f0ebe3 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ animation: 'spin 1s linear infinite', borderRadius: '50%', height: '8rem', width: '8rem', border: '4px solid #d67d3e', borderTop: '4px solid transparent', margin: '0 auto' }}></div>
          <p style={{ marginTop: '1rem', fontSize: '1.125rem', color: '#6b6355' }}>Loading fibre networks...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0ebe3 0%, #e8dfd5 30%, #ede4d8 70%, #f0ebe3 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: '#dc2626', fontSize: '3.75rem', marginBottom: '1rem' }}>⚠️</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>Error Loading Networks</h1>
          <p style={{ color: '#6b6355', marginBottom: '1rem' }}>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            style={{ background: '#d67d3e', color: 'white', padding: '0.5rem 1.5rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer' }}
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      
      <div className="fibre-page">
        <header className="fibre-header">
          <div className="container">
            <h1 className="heading-gradient">
              Uncapped Fibre. <span>Installed Within 7 Days.</span>
            </h1>
          </div>
        </header>

        <section className="fibre-section">
          <div className="container">
            <div className="title-container">
              <h2 className="section-title">Choose a Fibre Network</h2>
            </div>
            
            <div className="scroll-indicators" id="scroll-indicators">
              {providerData.map((provider, index) => (
                <div 
                  key={provider.slug}
                  className={`scroll-dot ${index === activeProviderIndex ? 'active' : ''}`}
                  onClick={() => {
                    try {
                      const scrollContainer = document.getElementById('provider-package-display')
                      if (scrollContainer) {
                        // Use actual DOM to center card; avoid unused local vars
                        
                        // Find the actual card element and scroll to center it
                        const allCards = scrollContainer.querySelectorAll('.provider-package-card')
                        const targetCard = allCards[index]
                        
                        if (targetCard) {
                          const cardRect = targetCard.getBoundingClientRect()
                          const containerRect = scrollContainer.getBoundingClientRect()
                          const cardLeft = cardRect.left - containerRect.left + scrollContainer.scrollLeft
                          const cardCenter = cardLeft + (cardRect.width / 2)
                          const viewportCenter = scrollContainer.clientWidth / 2
                          const scrollPosition = cardCenter - viewportCenter
                          
                          scrollContainer.scrollTo({
                            left: Math.max(0, scrollPosition),
                            behavior: 'smooth'
                          })
                        }
                        
                        try {
                          setActiveProviderIndex(index)
                        } catch {
                          // Ignore state update errors
                        }
                      }
                    } catch (error) {
                      console.warn('Scroll indicator click error:', error)
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
                  <div className="no-packages">No providers available at the moment.</div>
                ) : (
                  providerData.map((provider, providerIndex) => (
                    <FibrePackageCard
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
          max-width: 100%;
          margin: 0 auto;
          padding: 0;
        }

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
          overscroll-behavior-x: contain;
          background: #e8e8e8;
          border-radius: 0;
          width: 100%;
          max-width: 100%;
          justify-content: flex-start;
          transform: translateZ(0);
          will-change: scroll-position;
          scroll-snap-type: x mandatory;
        }

        .provider-package-display::-webkit-scrollbar {
          display: none;
        }

        .provider-package-card {
          scroll-snap-align: center;
          scroll-snap-stop: always;
          flex-shrink: 0;
          transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), 
                     box-shadow 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                     border-color 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          will-change: transform;
          transform: translateZ(0);
          backface-visibility: hidden;
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
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          flex-shrink: 0;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .scroll-dot.active {
          background: #4a90e2;
          transform: scale(1.4);
          box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.3);
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0% { box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.3); }
          50% { box-shadow: 0 0 0 4px rgba(74, 144, 226, 0.6); }
          100% { box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.3); }
        }

        .scroll-dot:hover {
          background: #4a90e2;
          opacity: 0.8;
          transform: scale(1.2);
          animation: bounce 0.6s ease;
        }
        
        @keyframes bounce {
          0%, 100% { transform: scale(1.2); }
          50% { transform: scale(1.35); }
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
            padding: 20px 30px;
            background: #e8e8e8;
            width: 100vw;
            max-width: 100vw;
            scroll-snap-type: x mandatory;
            scroll-padding-left: calc(50vw - 160px);
            scroll-padding-right: calc(50vw - 160px);
            scroll-snap-stop: always;
            justify-content: flex-start;
            transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
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
            padding: 20px 20px;
            background: #e8e8e8;
            width: 100vw;
            max-width: 100vw;
            scroll-snap-type: x mandatory;
            scroll-padding-left: calc(50vw - 150px);
            scroll-padding-right: calc(50vw - 150px);
            scroll-snap-stop: always;
            scrollbar-width: none;
            -ms-overflow-style: none;
            justify-content: flex-start;
            transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
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
    </>
  )
}

interface FibrePackageCardProps {
  provider: ProviderData
  providerIndex: number
  onPackageSelect: (packageId: string) => void
}

function FibrePackageCard({ provider, providerIndex, onPackageSelect }: FibrePackageCardProps) {
  const [selectedPackage, setSelectedPackage] = useState(provider.packages[0] || null)
  const [showPromotionTooltip, setShowPromotionTooltip] = useState(false)

  const handlePackageChange = (packageId: string) => {
    const newPackage = provider.packages.find(pkg => pkg.id === packageId)
    if (newPackage) {
      setSelectedPackage(newPackage)
    }
  }

  const handleSignUpClick = () => {
    if (selectedPackage) {
      const packageData = {
        id: selectedPackage.id,
        name: selectedPackage.name,
        price: selectedPackage.currentPrice,
        provider: selectedPackage.provider.name,
        speed: selectedPackage.speed,
        data: selectedPackage.data,
        hasPromo: selectedPackage.hasPromo,
        promoPrice: selectedPackage.promoPrice,
        effectivePrice: selectedPackage.effectivePrice,
        promoSavings: selectedPackage.promoSavings,
        promoDisplayText: selectedPackage.promoDisplayText
      }
      
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('selectedPackage', JSON.stringify(packageData))
      }
      
      onPackageSelect(selectedPackage.id)
    }
  }

  if (!selectedPackage) {
    return null
  }

  const speeds = selectedPackage.speed ? selectedPackage.speed.split('/') : ['10', '10']
  const downloadSpeed = speeds[0]?.replace(/[^0-9]/g, '') || '10'
  const uploadSpeed = speeds[1]?.replace(/[^0-9]/g, '') || downloadSpeed

  const hasPromo = Array.isArray(selectedPackage.promotions) && selectedPackage.promotions.length > 0
  const promotion = hasPromo ? selectedPackage.promotions?.[0] : null
  
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

      {provider.logo ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={provider.logo} 
            alt={provider.name} 
            className="provider-logo-main"
          />
        </>
      ) : (
        <div className="provider-name-main">{provider.name}</div>
      )}

      <div className="speed-info">
        <span className="download-arrow">↓</span>
        <span className="current-download">{downloadSpeed}</span>
        <span className="upload-arrow">↑</span>
        <span className="current-upload">{uploadSpeed}</span>
        <span>Mbps</span>
      </div>

      <div className="price-display">
        {hasPromo && displayPrice !== selectedPackage.currentPrice && (
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
            const pkgSpeeds = pkg.speed ? pkg.speed.split('/') : ['10', '10']
            const pkgDown = pkgSpeeds[0]?.replace(/[^0-9]/g, '') || '10'
            const pkgUp = pkgSpeeds[1]?.replace(/[^0-9]/g, '') || pkgDown
            
            return (
              <option 
                key={pkg.id} 
                value={pkg.id}
              >
                {pkgDown}/{pkgUp} Mbps Uncapped
              </option>
            )
          })}
        </select>
      </div>

      <div className="feature-checklist">
        <div className="promo-tooltip"></div>
        <div className="feature-item">
          <div className="feature-checkmark"></div>
          <div 
            className={`feature-text ${hasPromo ? 'promo-tooltip-trigger' : 'no-promo'}`}
            onMouseEnter={() => hasPromo && setShowPromotionTooltip(true)}
            onMouseLeave={() => setShowPromotionTooltip(false)}
          >
            How our promotion works
            {showPromotionTooltip && hasPromo && (
              <div className="promo-tooltip show">
                {promotion?.description || "Currently no promotion"}
              </div>
            )}
          </div>
        </div>
        <div className="feature-item">
          <div className="feature-checkmark"></div>
          <div className="feature-text">Free-to-use router</div>
        </div>
        <div className="feature-item">
          <div className="feature-checkmark"></div>
          <div className="feature-text">Free setup worth R2732</div>
        </div>
        <div className="feature-item">
          <div className="feature-checkmark"></div>
          <div className="feature-text">Installation time: 7 days</div>
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
        /* Provider Card Styles - Using LTE card styling */
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
          transform: translateY(-8px) scale(1.02);
          box-shadow: 
            0 20px 60px rgba(0, 0, 0, 0.2),
            0 8px 24px rgba(0, 0, 0, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.8);
        }
        
        .provider-package-card.snap-active {
          transform: scale(1.02);
          box-shadow: 
            0 12px 32px rgba(74, 144, 226, 0.15),
            0 4px 16px rgba(74, 144, 226, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.9);
          border-color: #4a90e2;
          border-width: 2px;
        }

        .provider-logo-main {
          max-width: 160px;
          max-height: 60px;
          margin-bottom: 8px;
          object-fit: contain;
        }
        
        .provider-name-main {
          font-size: 1.3rem;
          font-weight: 700;
          color: #2d2823;
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
        
        .speed-info .upload-arrow {
          color: #7ed321;
          font-weight: 600;
          font-size: 1.2rem;
        }
        
        .price-display {
          display: flex;
          align-items: baseline;
          margin-bottom: 12px;
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
          margin-left: 8px;
        }
        
        .price-strikethrough {
          text-decoration: line-through;
          opacity: 0.6;
          font-size: 1.2rem;
          color: #6b6355;
          margin-right: 12px;
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
          position: relative;
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
        
        /* Promo Text Tooltip Styles - Exact copy from PHP */
        .promo-tooltip-trigger {
          cursor: pointer;
          color: #4a90e2;
          text-decoration: underline;
          position: relative;
        }
        
        .promo-tooltip-trigger:hover {
          color: #357abd;
        }
        
        .promo-tooltip {
          position: absolute;
          top: 40px;
          left: 0;
          right: 0;
          background: #ffffff;
          color: #2d2823;
          border: 1px dotted #000000;
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 0.8rem;
          line-height: 1.4;
          z-index: 1500;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.3s ease, visibility 0.3s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          white-space: normal;
          word-wrap: break-word;
          font-weight: 500;
        }
        
        .promo-tooltip::before {
          content: '';
          position: absolute;
          top: -6px;
          left: 20px;
          width: 12px;
          height: 12px;
          background: #ffffff;
          border-left: 1px dotted #000000;
          border-top: 1px dotted #000000;
          transform: rotate(45deg);
        }
        
        .promo-tooltip.show {
          opacity: 1;
          visibility: visible;
        }
        
        .promo-tooltip-trigger.no-promo {
          cursor: default;
          color: #6b6355;
          text-decoration: none;
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
        
        /* Responsive Adjustments - Using LTE styling */
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
            width: min(320px, calc(100vw - 60px));
            min-width: min(320px, calc(100vw - 60px));
            max-width: min(320px, calc(100vw - 60px));
            padding: 20px;
            margin: 0 10px;
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
        }
        
        @media (max-width: 480px) {
          .provider-package-card {
            width: min(300px, calc(100vw - 40px));
            min-width: min(300px, calc(100vw - 40px));
            max-width: min(300px, calc(100vw - 40px));
            padding: 18px;
            margin: 0 8px;
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
        }
        
        @media (max-width: 600px) {
          .provider-package-card {
            padding: 18px;
            width: min(310px, calc(100vw - 50px));
            min-width: min(310px, calc(100vw - 50px));
            max-width: min(310px, calc(100vw - 50px));
            margin: 0 12px;
            max-height: 520px;
            scroll-snap-align: center;
          }
          
          .price-main {
            font-size: 2.2rem;
          }
          
          .feature-text {
            font-size: 0.9rem;
          }
        }
        
        /* Mobile devices with better constraints */
        @media (max-width: 380px) {
          .provider-package-card {
            width: min(280px, calc(100vw - 32px));
            min-width: min(280px, calc(100vw - 32px));
            max-width: min(280px, calc(100vw - 32px));
            margin: 0 8px;
            padding: 16px;
            max-height: 500px;
          }
        }
      `}</style>
    </div>
  );
}