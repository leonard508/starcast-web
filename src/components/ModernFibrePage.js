import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { packageService } from '../services/api';

const ModernFibrePage = () => {
  const navigate = useNavigate();
  const [providers, setProviders] = useState([]);
  const [currentProviderIndex, setCurrentProviderIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const providerSliderRef = useRef(null);
  const scrollTimeoutRef = useRef(null);

  // Define allowed providers in the exact order we want them displayed (matching PHP)
  const allowedProviders = ['openserve', 'frogfoot', 'vumatel', 'octotel', 'metrofibre'];

  useEffect(() => {
    fetchFibreData();
  }, []);

  const fetchFibreData = async () => {
    try {
      setLoading(true);
      
      // For now, always use fallback providers since this is a demo/development version
      // In production, this would connect to the WordPress REST API
      const fallbackProviders = createFallbackProviders();
      setProviders(fallbackProviders);
      
      // Optional: Try to fetch from API but don't fail if it doesn't work
      try {
        const response = await packageService.getFibrePackages();
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          const packages = response.data;
          const groupedProviders = groupPackagesByProvider(packages);
          if (groupedProviders.length > 0) {
            setProviders(groupedProviders);
          }
        }
      } catch (apiError) {
        console.log('API not available, using fallback data');
        // Keep using fallback data - no error state needed
      }
    } catch (err) {
      console.error('Error loading fibre data:', err);
      setError('Failed to load fibre packages');
      // Still provide fallback data even on error
      const fallbackProviders = createFallbackProviders();
      setProviders(fallbackProviders);
    } finally {
      setLoading(false);
    }
  };

  const groupPackagesByProvider = (packages) => {
    const grouped = {};
    const providerData = [];

    packages.forEach(pkg => {
      if (!pkg.acf) return; // Skip packages without ACF data

      const providerName = pkg.acf.provider || 'Unknown Provider';
      const providerSlug = providerName.toLowerCase().replace(/\s+/g, '');

      // Check if this provider is in our allowed list
      const isAllowed = allowedProviders.some(allowed => 
        providerSlug.includes(allowed) || providerName.toLowerCase().includes(allowed)
      );

      if (!isAllowed) return; // Skip providers not in our allowed list

      if (!grouped[providerSlug]) {
        grouped[providerSlug] = {
          name: providerName,
          slug: providerSlug,
          logo: pkg.acf.provider_logo || null,
          packages: [],
          priority: allowedProviders.findIndex(allowed => 
            providerSlug.includes(allowed) || providerName.toLowerCase().includes(allowed)
          )
        };
      }

      const packageData = {
        id: pkg.id,
        title: pkg.title?.rendered || 'Fibre Package',
        price: pkg.acf.price ? parseInt(pkg.acf.price) : 999,
        download: pkg.acf.download || 'N/A',
        upload: pkg.acf.upload || 'N/A',
        provider: providerName,
        download_speed: parseInt(pkg.acf.download?.replace(/[^0-9]/g, '') || '0'),
        has_promo: false,
        promo_price: null,
        effective_price: pkg.acf.price ? parseInt(pkg.acf.price) : 999
      };

      grouped[providerSlug].packages.push(packageData);
    });

    // Convert to array and sort packages by download speed
    Object.values(grouped).forEach(provider => {
      provider.packages.sort((a, b) => a.download_speed - b.download_speed);
    });

    // Sort providers by priority
    const sortedProviders = Object.values(grouped).sort((a, b) => a.priority - b.priority);

    return sortedProviders;
  };

  const createFallbackProviders = () => {
    return [
      {
        name: 'Openserve',
        slug: 'openserve',
        logo: null,
        packages: [
          { id: 1, title: '10Mbps/10Mbps', price: 299, download: '10Mbps', upload: '10Mbps', provider: 'Openserve', download_speed: 10, has_promo: false },
          { id: 2, title: '25Mbps/25Mbps', price: 399, download: '25Mbps', upload: '25Mbps', provider: 'Openserve', download_speed: 25, has_promo: false },
          { id: 3, title: '50Mbps/50Mbps', price: 599, download: '50Mbps', upload: '50Mbps', provider: 'Openserve', download_speed: 50, has_promo: false },
          { id: 4, title: '100Mbps/100Mbps', price: 899, download: '100Mbps', upload: '100Mbps', provider: 'Openserve', download_speed: 100, has_promo: false }
        ],
        priority: 0
      },
      {
        name: 'Frogfoot',
        slug: 'frogfoot',
        logo: null,
        packages: [
          { id: 5, title: '10Mbps/10Mbps', price: 329, download: '10Mbps', upload: '10Mbps', provider: 'Frogfoot', download_speed: 10, has_promo: false },
          { id: 6, title: '25Mbps/25Mbps', price: 449, download: '25Mbps', upload: '25Mbps', provider: 'Frogfoot', download_speed: 25, has_promo: false },
          { id: 7, title: '50Mbps/50Mbps', price: 649, download: '50Mbps', upload: '50Mbps', provider: 'Frogfoot', download_speed: 50, has_promo: false },
          { id: 8, title: '100Mbps/100Mbps', price: 949, download: '100Mbps', upload: '100Mbps', provider: 'Frogfoot', download_speed: 100, has_promo: false }
        ],
        priority: 1
      },
      {
        name: 'Vumatel',
        slug: 'vumatel',
        logo: null,
        packages: [
          { id: 9, title: '10Mbps/10Mbps', price: 309, download: '10Mbps', upload: '10Mbps', provider: 'Vumatel', download_speed: 10, has_promo: false },
          { id: 10, title: '25Mbps/25Mbps', price: 419, download: '25Mbps', upload: '25Mbps', provider: 'Vumatel', download_speed: 25, has_promo: false },
          { id: 11, title: '50Mbps/50Mbps', price: 619, download: '50Mbps', upload: '50Mbps', provider: 'Vumatel', download_speed: 50, has_promo: false },
          { id: 12, title: '100Mbps/100Mbps', price: 879, download: '100Mbps', upload: '100Mbps', provider: 'Vumatel', download_speed: 100, has_promo: false }
        ],
        priority: 2
      },
      {
        name: 'Octotel',
        slug: 'octotel',
        logo: null,
        packages: [
          { id: 13, title: '10Mbps/10Mbps', price: 319, download: '10Mbps', upload: '10Mbps', provider: 'Octotel', download_speed: 10, has_promo: false },
          { id: 14, title: '25Mbps/25Mbps', price: 439, download: '25Mbps', upload: '25Mbps', provider: 'Octotel', download_speed: 25, has_promo: false },
          { id: 15, title: '50Mbps/50Mbps', price: 639, download: '50Mbps', upload: '50Mbps', provider: 'Octotel', download_speed: 50, has_promo: false },
          { id: 16, title: '100Mbps/100Mbps', price: 919, download: '100Mbps', upload: '100Mbps', provider: 'Octotel', download_speed: 100, has_promo: false }
        ],
        priority: 3
      },
      {
        name: 'MetroFibre',
        slug: 'metrofibre',
        logo: null,
        packages: [
          { id: 17, title: '10Mbps/10Mbps', price: 349, download: '10Mbps', upload: '10Mbps', provider: 'MetroFibre', download_speed: 10, has_promo: false },
          { id: 18, title: '25Mbps/25Mbps', price: 469, download: '25Mbps', upload: '25Mbps', provider: 'MetroFibre', download_speed: 25, has_promo: false },
          { id: 19, title: '50Mbps/50Mbps', price: 669, download: '50Mbps', upload: '50Mbps', provider: 'MetroFibre', download_speed: 50, has_promo: false },
          { id: 20, title: '100Mbps/100Mbps', price: 969, download: '100Mbps', upload: '100Mbps', provider: 'MetroFibre', download_speed: 100, has_promo: false }
        ],
        priority: 4
      }
    ];
  };

  const scrollToProvider = (index) => {
    if (!providerSliderRef.current || !providerSliderRef.current.children[index]) return;
    
    setIsScrolling(true);
    
    const slider = providerSliderRef.current;
    const card = slider.children[index];
    const sliderRect = slider.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    
    // Calculate the scroll position to center the card perfectly
    const sliderScrollLeft = slider.scrollLeft;
    const cardCenter = card.offsetLeft + (cardRect.width / 2);
    const sliderCenter = sliderRect.width / 2;
    const targetScrollLeft = cardCenter - sliderCenter;
    
    slider.scrollTo({
      left: Math.max(0, targetScrollLeft),
      behavior: 'smooth'
    });
    
    setTimeout(() => {
      setIsScrolling(false);
    }, 500);
  };

  const handleProviderChange = (index) => {
    setCurrentProviderIndex(index);
    scrollToProvider(index);
  };

  const handleNavigation = (direction) => {
    let newIndex;
    if (direction === 'prev') {
      newIndex = currentProviderIndex - 1;
      if (newIndex < 0) newIndex = providers.length - 1;
    } else {
      newIndex = currentProviderIndex + 1;
      if (newIndex >= providers.length) newIndex = 0;
    }
    handleProviderChange(newIndex);
  };

  const handlePackageClick = (pkg, provider) => {
    try {
      const selectedPackage = {
        id: pkg.id,
        name: `${provider.name} ${pkg.download}/${pkg.upload}`,
        price: pkg.price,
        provider: pkg.provider,
        download: pkg.download,
        upload: pkg.upload
      };
      
      sessionStorage.setItem('selectedPackage', JSON.stringify(selectedPackage));
      navigate(`/signup?package_id=${pkg.id}`);
    } catch (error) {
      console.error('Error storing package:', error);
      navigate(`/signup?package_id=${pkg.id}`);
    }
  };

  // Handle scroll events to update active provider
  const handleScroll = () => {
    if (isScrolling || !providerSliderRef.current) return;
    
    clearTimeout(scrollTimeoutRef.current);
    
    scrollTimeoutRef.current = setTimeout(() => {
      if (isScrolling) return;
      
      const slider = providerSliderRef.current;
      const sliderRect = slider.getBoundingClientRect();
      const sliderCenter = sliderRect.left + sliderRect.width / 2;
      
      let closestCard = 0;
      let minDistance = Infinity;
      
      Array.from(slider.children).forEach((card, index) => {
        const cardRect = card.getBoundingClientRect();
        const cardCenter = cardRect.left + cardRect.width / 2;
        const distance = Math.abs(cardCenter - sliderCenter);
        
        if (distance < minDistance) {
          minDistance = distance;
          closestCard = index;
        }
      });
      
      if (closestCard !== currentProviderIndex) {
        setCurrentProviderIndex(closestCard);
      }
    }, 150);
  };

  if (loading) {
    return (
      <div className="fibre-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading fibre packages...</p>
        </div>
      </div>
    );
  }

  const currentProvider = providers[currentProviderIndex];

  return (
    <div className="fibre-page">
      <style>{`
        /* Reset and Base Styles */
        .fibre-page * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        
        .fibre-page {
          font-family: 'Poppins', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: linear-gradient(135deg, #faf7f4 0%, #f0ebe3 30%, #f7f2eb 70%, #faf7f4 100%);
          background-attachment: fixed;
          color: #4a453f;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          overflow-x: hidden;
          line-height: 1.6;
          width: 100%;
          min-height: 100vh;
        }

        .container {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }
        
        /* Header Styles */
        .fibre-header {
          text-align: center;
          padding: 140px 0 80px;
          background: transparent;
          position: relative;
          overflow: hidden;
        }

        .fibre-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 20% 20%, rgba(214, 125, 62, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(242, 237, 230, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 40% 60%, rgba(232, 227, 219, 0.2) 0%, transparent 50%);
        }

        .fibre-header .container {
          position: relative;
          z-index: 2;
        }
        
        .heading-gradient {
          font-size: 3.5rem;
          font-weight: 800;
          color: #2d2823;
          margin-bottom: 32px;
          line-height: 1.1;
          letter-spacing: -0.02em;
        }

        .heading-gradient span {
          color: #d67d3e;
        }
        
        .subheading {
          font-size: 1.25rem;
          color: #6b6355;
          max-width: 600px;
          margin: 0 auto;
          font-weight: 400;
          line-height: 1.6;
        }
        
        /* Section Styles */
        .fibre-section {
          padding: 80px 0 120px;
          background: transparent;
          position: relative;
        }

        .fibre-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 70% 30%, rgba(242, 237, 230, 0.4) 0%, transparent 50%),
            radial-gradient(circle at 30% 70%, rgba(214, 125, 62, 0.05) 0%, transparent 50%);
        }
        
        .title-container {
          width: 100%;
          text-align: center;
          margin-bottom: 60px;
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
        
        /* Provider Selector */
        .provider-selector {
          position: relative;
          display: flex;
          align-items: center;
          margin-bottom: 20px;
          max-width: 1400px;
          margin-left: auto;
          margin-right: auto;
          z-index: 2;
        }
        
        .provider-slider {
          display: flex;
          gap: 20px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          scrollbar-width: none;
          -ms-overflow-style: none;
          margin: 0 60px;
          padding: 20px 5px;
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
          flex-grow: 1;
        }
        
        .provider-slider::-webkit-scrollbar {
          display: none;
        }
        
        .provider-card {
          scroll-snap-align: center;
          flex: 0 0 auto;
          width: 300px;
          height: 140px;
          border-radius: 20px;
          background: rgba(250, 247, 244, 0.6);
          backdrop-filter: blur(20px);
          box-shadow: 
            0 8px 32px rgba(74, 69, 63, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.4);
          border: 1px solid rgba(232, 227, 219, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          padding: 24px;
        }

        .provider-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #d67d3e, #f0a876);
          border-radius: 20px 20px 0 0;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .provider-card:hover::before {
          opacity: 1;
        }
        
        .provider-logo {
          max-width: 85%;
          max-height: 85%;
          width: auto;
          height: auto;
          object-fit: contain;
          z-index: 2;
          transition: all 0.3s ease;
          display: block;
        }
        
        .provider-text {
          font-size: 1.2rem;
          font-weight: 600;
          color: #2d2823;
          text-align: center;
          padding: 0 15px;
          z-index: 2;
          margin: 0;
        }
        
        .provider-card:hover {
          transform: translateY(-8px) scale(1.02);
          background: rgba(250, 247, 244, 0.8);
          box-shadow: 
            0 20px 40px rgba(74, 69, 63, 0.12),
            0 8px 16px rgba(214, 125, 62, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.6);
          border-color: rgba(214, 125, 62, 0.2);
        }
        
        .provider-card.active {
          border-color: #d67d3e;
          background: rgba(250, 247, 244, 0.9);
          transform: translateY(-4px) scale(1.05);
          box-shadow: 
            0 20px 40px rgba(74, 69, 63, 0.15),
            0 8px 16px rgba(214, 125, 62, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.7);
        }
        
        .provider-card.active::before {
          opacity: 1;
        }
        
        .provider-card.active .provider-text {
          color: #d67d3e;
          font-weight: 700;
        }
        
        .nav-arrow {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: rgba(250, 247, 244, 0.8);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(232, 227, 219, 0.3);
          color: #6b6355;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 8px 32px rgba(74, 69, 63, 0.1);
          z-index: 5;
          flex-shrink: 0;
        }
        
        .nav-arrow:hover {
          background: #d67d3e;
          color: white;
          border-color: #c56d31;
          box-shadow: 0 12px 40px rgba(214, 125, 62, 0.3);
          transform: scale(1.1);
        }
        
        .nav-prev {
          margin-right: 0;
          position: absolute;
          left: 0;
        }
        
        .nav-next {
          margin-left: 0;
          position: absolute;
          right: 0;
        }
        
        .provider-indicators {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-bottom: 35px;
          position: relative;
          z-index: 2;
        }
        
        .indicator {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background-color: rgba(107, 99, 85, 0.3);
          cursor: pointer;
          transition: all 0.3s ease;
          border: 1px solid rgba(232, 227, 219, 0.3);
        }
        
        .indicator.active {
          background: #d67d3e;
          transform: scale(1.3);
          box-shadow: 0 4px 15px rgba(214, 125, 62, 0.4);
          border-color: #c56d31;
        }
        
        /* Packages Grid */
        .packages-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
          margin-top: 10px;
          max-width: 1400px;
          margin-left: auto;
          margin-right: auto;
          position: relative;
          z-index: 2;
        }
        
        .package-card {
          background: rgba(250, 247, 244, 0.6);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          box-shadow: 
            0 8px 32px rgba(74, 69, 63, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.4);
          border: 1px solid rgba(232, 227, 219, 0.3);
          padding: 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          max-width: 320px;
          margin: 0 auto;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          cursor: pointer;
        }

        .package-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #d67d3e, #f0a876);
          border-radius: 20px 20px 0 0;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .package-card:hover {
          transform: translateY(-8px) scale(1.02);
          background: rgba(250, 247, 244, 0.8);
          box-shadow: 
            0 20px 40px rgba(74, 69, 63, 0.12),
            0 8px 16px rgba(214, 125, 62, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.6);
          border-color: rgba(214, 125, 62, 0.2);
        }

        .package-card:hover::before {
          opacity: 1;
        }
        
        .package-provider-name {
          font-size: 1rem;
          color: #2d2823;
          font-weight: 600;
          margin-bottom: 16px;
          text-align: center;
          position: relative;
          z-index: 2;
        }
        
        .package-price-badge {
          font-size: 2rem;
          font-weight: 700;
          border-radius: 8px;
          padding: 8px 12px;
          margin-bottom: 16px;
          display: inline-flex;
          align-items: baseline;
          letter-spacing: -0.5px;
          line-height: 1;
          position: relative;
          z-index: 2;
        }

        .package-price-badge .price-main {
          color: #d67d3e;
        }
        
        .package-price-badge .currency {
          font-size: 1.4rem;
          font-weight: 600;
          color: #6b6355;
          margin-right: 4px;
          position: relative;
          top: 2px;
        }
        
        .package-price-badge small {
          font-size: 0.75rem;
          font-weight: 500;
          color: #6b6355;
          margin-left: 4px;
          position: relative;
          top: -4px;
        }
        
        .package-speeds-row {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 16px;
          width: 100%;
        }
        
        .speeds-inline {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 1.1rem;
          font-weight: 600;
          color: #2d2823;
          letter-spacing: 0.1px;
          flex-wrap: nowrap;
          margin-bottom: 6px;
          position: relative;
          z-index: 2;
        }
        
        .speeds-inline .slash {
          color: #6b6355;
          font-size: 1.1rem;
          font-weight: 400;
        }
        
        .speed-labels-inline {
          display: flex;
          flex-direction: row;
          justify-content: center;
          gap: 50px;
          width: 100%;
          font-size: 0.8rem;
          color: #6b6355;
          font-weight: 500;
          line-height: 1.2;
          letter-spacing: 0.1px;
          position: relative;
          z-index: 2;
        }
        
        .package-feature-badge {
          color: #ffffff;
          font-size: 0.9rem;
          font-weight: 600;
          background: #d67d3e;
          border: 1px solid #c56d31;
          border-radius: 8px;
          padding: 8px 16px;
          display: inline-block;
          text-transform: uppercase;
          position: relative;
          z-index: 2;
        }
        
        .no-packages {
          grid-column: 1 / -1;
          text-align: center;
          padding: 60px 40px;
          color: #6b6355;
          background: rgba(250, 247, 244, 0.6);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(232, 227, 219, 0.3);
          border-radius: 20px;
          box-shadow: 0 8px 32px rgba(74, 69, 63, 0.08);
          font-size: 1.1rem;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 50vh;
          color: #6b6355;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid rgba(214, 125, 62, 0.1);
          border-left-color: #d67d3e;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 16px;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        
        /* Mobile Optimizations */
        @media (max-width: 992px) {
          .fibre-header {
            padding: 120px 0 60px;
          }

          .heading-gradient {
            font-size: 3rem;
          }
          
          .section-title {
            font-size: 2rem;
          }

          .packages-grid {
            grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
            gap: 20px;
          }
        }

        @media (max-width: 768px) {
          .container {
            padding: 0 16px;
          }

          .fibre-header {
            padding: 100px 0 60px;
          }

          .heading-gradient {
            font-size: 2.5rem;
          }
          
          .section-title {
            font-size: 1.8rem;
          }
          
          .title-container {
            margin-bottom: 40px;
          }
          
          .provider-slider {
            margin: 0 60px;
            padding: 20px 10px;
            justify-content: flex-start;
          }
          
          .provider-card {
            width: 280px;
            min-width: 280px;
            height: 120px;
            padding: 16px;
            margin: 0 8px;
          }
          
          .packages-grid {
            grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
            gap: 16px;
          }

          .package-card {
            padding: 20px;
            max-width: 300px;
          }

          .fibre-section {
            padding: 60px 0 80px;
          }

          .nav-arrow {
            width: 44px;
            height: 44px;
          }
          
          .nav-prev {
            left: 8px;
          }
          
          .nav-next {
            right: 8px;
          }
        }

        @media (max-width: 480px) {
          .container {
            padding: 0 12px;
          }

          .fibre-header {
            padding: 80px 0 40px;
          }

          .heading-gradient {
            font-size: 2rem;
            margin-bottom: 24px;
          }

          .subheading {
            font-size: 1.125rem;
          }
          
          .fibre-section {
            padding: 40px 0 60px;
          }
          
          .provider-slider {
            margin: 0 50px;
            padding: 16px 8px;
          }
          
          .provider-card {
            width: 85vw;
            max-width: 260px;
            height: 110px;
            padding: 16px;
            margin: 0 6px;
          }

          .provider-text {
            font-size: 1.1rem;
          }
          
          .packages-grid {
            grid-template-columns: 1fr;
            gap: 16px;
            max-width: 100%;
          }
          
          .package-card {
            padding: 20px 16px;
            max-width: 100%;
            margin: 0;
          }

          .package-price-badge {
            font-size: 1.8rem;
          }

          .package-price-badge .currency {
            font-size: 1.2rem;
          }

          .speeds-inline {
            font-size: 1rem;
            gap: 6px;
          }

          .speed-labels-inline {
            gap: 40px;
            font-size: 0.75rem;
          }

          .nav-arrow {
            width: 40px;
            height: 40px;
          }

          .nav-prev {
            left: 4px;
          }
          
          .nav-next {
            right: 4px;
          }
        }

        /* Extra small mobile */
        @media (max-width: 360px) {
          .provider-card {
            width: 90vw;
            max-width: 240px;
            height: 100px;
          }

          .package-card {
            padding: 16px 12px;
          }

          .speeds-inline {
            font-size: 0.95rem;
          }

          .speed-labels-inline {
            gap: 35px;
          }
        }

        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }
      `}</style>

      {/* Header Section */}
      <header className="fibre-header">
        <div className="container">
          <h1 className="heading-gradient">Uncapped Fibre. <span>Installed Within 7 Days.</span></h1>
          <p className="subheading">For Home and Business. Pro Rata Rates Apply.</p>
        </div>
      </header>

      {/* Main Section */}
      <section className="fibre-section">
        <div className="container">
          <div className="title-container">
            <h2 className="section-title">Choose a Fibre Network</h2>
          </div>
          
          {/* Provider Selector */}
          <div className="provider-selector">
            <button 
              className="nav-arrow nav-prev" 
              aria-label="Previous provider"
              onClick={() => handleNavigation('prev')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                <path fill="currentColor" d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
              </svg>
            </button>
            
            <div 
              className="provider-slider" 
              ref={providerSliderRef}
              onScroll={handleScroll}
            >
              {providers.length === 0 ? (
                <div className="no-packages">No providers available at the moment.</div>
              ) : (
                providers.map((provider, index) => (
                  <div 
                    key={provider.slug}
                    className={`provider-card ${index === currentProviderIndex ? 'active' : ''}`}
                    onClick={() => handleProviderChange(index)}
                  >
                    {provider.logo ? (
                      <img 
                        src={provider.logo} 
                        alt={provider.name} 
                        className="provider-logo"
                      />
                    ) : (
                      <div className="provider-text">{provider.name}</div>
                    )}
                  </div>
                ))
              )}
            </div>
            
            <button 
              className="nav-arrow nav-next" 
              aria-label="Next provider"
              onClick={() => handleNavigation('next')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                <path fill="currentColor" d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
              </svg>
            </button>
          </div>
          
          {/* Provider Indicators */}
          <div className="provider-indicators">
            {providers.map((_, index) => (
              <div 
                key={index}
                className={`indicator ${index === currentProviderIndex ? 'active' : ''}`}
                onClick={() => handleProviderChange(index)}
              />
            ))}
          </div>
          
          {/* Packages Grid */}
          <div className="packages-grid">
            {providers.length === 0 ? (
              <div className="no-packages">No packages available at the moment.</div>
            ) : currentProvider?.packages?.length > 0 ? (
              currentProvider.packages.map((pkg) => (
                <div 
                  key={pkg.id}
                  className="package-card"
                  onClick={() => handlePackageClick(pkg, currentProvider)}
                >
                  <div className="package-provider-name">{currentProvider.name}</div>
                  
                  <div className="package-price-badge">
                    <span className="currency">R</span>
                    <span className="price-main">{pkg.price}</span>
                    <small>/pm</small>
                  </div>
                  
                  <div className="package-speeds-row">
                    <div className="speeds-inline">
                      <span>{String(pkg.download).replace(/\s*Mbps/i, '')} Mbps</span>
                      <span className="slash">|</span>
                      <span>{String(pkg.upload).replace(/\s*Mbps/i, '')} Mbps</span>
                    </div>
                    <div className="speed-labels-inline">
                      <span>Download</span>
                      <span>Upload</span>
                    </div>
                  </div>
                  
                  <div className="package-feature-badge">Uncapped</div>
                </div>
              ))
            ) : (
              <div className="no-packages">No packages found for this provider.</div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ModernFibrePage;