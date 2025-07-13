import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { packageService } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './LTEPage.css';

const LTEPage = () => {
  const navigate = useNavigate();
  const [providers, setProviders] = useState([]);
  const [currentProviderIndex, setCurrentProviderIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const providerSliderRef = useRef(null);

  // Define provider order
  const providerOrder = ['Vodacom', 'MTN', 'Telkom'];

  useEffect(() => {
    fetchLTEPackages();
  }, []);

  // Add scroll detection for auto-provider selection
  useEffect(() => {
    const slider = providerSliderRef.current;
    if (!slider) return;

    let scrollTimeout;
    
    const handleScroll = () => {
      if (isScrolling) return;
      
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        if (isScrolling) return;
        
        const sliderRect = slider.getBoundingClientRect();
        const sliderCenter = sliderRect.left + sliderRect.width / 2;
        let closestCard = 0;
        let minDistance = Infinity;
        
        const cards = slider.querySelectorAll('.provider-card');
        cards.forEach((card, index) => {
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

    slider.addEventListener('scroll', handleScroll);
    
    return () => {
      slider.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [currentProviderIndex, isScrolling, providers]);

  // Add window resize handler
  useEffect(() => {
    const handleResize = () => {
      setTimeout(() => {
        scrollToProvider(currentProviderIndex);
      }, 100);
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [currentProviderIndex]);

  const fetchLTEPackages = async () => {
    try {
      setLoading(true);
      const response = await packageService.getLTEPackages();
      
      console.log('LTE API Response:', response.data);
      
      if (response.data && response.data.success && response.data.data) {
        const packages = response.data.data;
        const groupedProviders = groupPackagesByProvider(packages);
        setProviders(groupedProviders);
      } else {
        // Use default packages if API fails
        const defaultProviders = createDefaultProviders();
        setProviders(defaultProviders);
      }
    } catch (err) {
      console.error('Error fetching LTE packages:', err);
      // Use default packages on error
      const defaultProviders = createDefaultProviders();
      setProviders(defaultProviders);
    } finally {
      setLoading(false);
    }
  };

  const createDefaultProviders = () => {
    const defaultPackages = [
      { id: 'default_0', name: 'Vodacom Fixed LTE 25GB', provider: 'Vodacom', provider_slug: 'vodacom', price: 169, type: 'fixed-lte', speed: '', data: '25GB', aup: '', throttle: '' },
      { id: 'default_1', name: 'Vodacom Fixed LTE 50GB', provider: 'Vodacom', provider_slug: 'vodacom', price: 269, type: 'fixed-lte', speed: '', data: '50GB', aup: '', throttle: '' },
      { id: 'default_2', name: 'MTN Fixed LTE 30Mbps', provider: 'MTN', provider_slug: 'mtn', price: 339, type: 'fixed-lte', speed: '30', data: 'Uncapped', aup: '50', throttle: '2Mbps' },
      { id: 'default_3', name: 'MTN Mobile 5GB', provider: 'MTN', provider_slug: 'mtn', price: 96, type: 'mobile-data', speed: '', data: '5.5GB', aup: '', throttle: '' },
      { id: 'default_4', name: 'Telkom 22.5GB + Night', provider: 'Telkom', provider_slug: 'telkom', price: 179, type: 'fixed-lte', speed: '', data: '22.5GB + 22.5GB Night', aup: '', throttle: '' },
    ];

    return groupPackagesByProvider(defaultPackages);
  };

  const groupPackagesByProvider = (packages) => {
    const grouped = [];
    
    providerOrder.forEach(providerName => {
      const providerPackages = packages.filter(pkg => 
        pkg.provider.toLowerCase() === providerName.toLowerCase()
      );
      
      if (providerPackages.length > 0) {
        // Sort packages: 5G first, then Fixed LTE, then Mobile at bottom
        const sortedPackages = providerPackages.sort(sortPackagesByType);
        
        // Try to get provider logo from first package or use default
        const providerLogo = providerPackages[0]?.provider_logo || 
                           providerPackages[0]?.logo || 
                           getDefaultProviderLogo(providerName);
        
        grouped.push({
          name: providerName,
          slug: providerName.toLowerCase(),
          logo: providerLogo,
          packages: sortedPackages
        });
      }
    });
    
    return grouped;
  };

  const getDefaultProviderLogo = (providerName) => {
    // Return default logo URLs or empty string for text fallback
    const logoMap = {
      'vodacom': '', // Add actual logo URLs when available
      'mtn': '',
      'telkom': ''
    };
    return logoMap[providerName.toLowerCase()] || '';
  };

  const sortPackagesByType = (a, b) => {
    // Check if package names contain "mobile" (case insensitive)
    const aIsMobile = a.name.toLowerCase().includes('mobile');
    const bIsMobile = b.name.toLowerCase().includes('mobile');
    
    // If one is mobile and the other isn't, mobile goes to bottom
    if (aIsMobile && !bIsMobile) return 1;
    if (!aIsMobile && bIsMobile) return -1;
    
    // If both are mobile or both are not mobile, sort by type then price
    if (aIsMobile === bIsMobile) {
      // Check for 5G in the name
      const aIs5G = a.name.toLowerCase().includes('5g');
      const bIs5G = b.name.toLowerCase().includes('5g');
      
      // 5G packages come first among non-mobile
      if (!aIsMobile && !bIsMobile) {
        if (aIs5G && !bIs5G) return -1;
        if (!aIs5G && bIs5G) return 1;
      }
      
      // Sort by price if same category
      return a.price - b.price;
    }
    
    return 0;
  };

  const selectPackage = (pkg) => {
    try {
      const selectedPackage = {
        id: pkg.id,
        name: pkg.name,
        price: pkg.price,
        provider: pkg.provider,
        speed: pkg.speed,
        data: pkg.data,
        aup: pkg.aup,
        throttle: pkg.throttle,
        type: pkg.type
      };
      
      sessionStorage.setItem('selectedPackage', JSON.stringify(selectedPackage));
      localStorage.setItem('lastSelectedPackage', JSON.stringify(selectedPackage));
      
      navigate('/lte-signup');
    } catch (error) {
      console.error('Error selecting package:', error);
      alert('Error selecting package. Please try again.');
    }
  };

  const updateProvider = (index) => {
    if (!providers[index]) return;
    setCurrentProviderIndex(index);
  };

  const scrollToProvider = (index) => {
    if (!providerSliderRef.current || !providers[index]) return;
    
    setIsScrolling(true);
    const slider = providerSliderRef.current;
    const cards = slider.querySelectorAll('.provider-card');
    const card = cards[index];
    
    if (card) {
      // Calculate center alignment more precisely
      const cardCenter = card.offsetLeft + (card.offsetWidth / 2);
      const sliderCenter = slider.offsetWidth / 2;
      const targetScrollLeft = cardCenter - sliderCenter;
      
      // Ensure we don't scroll beyond boundaries
      const maxScrollLeft = slider.scrollWidth - slider.clientWidth;
      const finalScrollLeft = Math.max(0, Math.min(targetScrollLeft, maxScrollLeft));
      
      slider.scrollTo({
        left: finalScrollLeft,
        behavior: 'smooth'
      });
    }
    
    // Use longer timeout to prevent interference with scroll detection
    setTimeout(() => setIsScrolling(false), 800);
  };

  const handlePrevProvider = () => {
    let newIndex = currentProviderIndex - 1;
    if (newIndex < 0) newIndex = providers.length - 1;
    updateProvider(newIndex);
    scrollToProvider(newIndex);
  };

  const handleNextProvider = () => {
    let newIndex = currentProviderIndex + 1;
    if (newIndex >= providers.length) newIndex = 0;
    updateProvider(newIndex);
    scrollToProvider(newIndex);
  };

  const renderPackageFeatures = (pkg) => {
    const features = [];
    
    if (pkg.speed && pkg.speed !== '0' && pkg.speed !== '') {
      const speedText = pkg.speed.includes('Mbps') ? pkg.speed : `${pkg.speed}Mbps`;
      features.push(
        <li key="speed">
          <CheckIcon />
          <strong>Speed:</strong> {speedText}
        </li>
      );
    }
    
    if (pkg.data && pkg.data !== '') {
      let dataValue = pkg.data.replace(/unlimited/gi, 'Uncapped').replace(/Unlimited/g, 'Uncapped');
      features.push(
        <li key="data">
          <CheckIcon />
          <strong>Data:</strong> {dataValue}
        </li>
      );
    }
    
    if (pkg.aup && pkg.aup !== '0' && pkg.aup !== '') {
      const aupText = pkg.aup.includes('GB') ? pkg.aup : `${pkg.aup}GB`;
      features.push(
        <li key="aup">
          <CheckIcon />
          <strong>Fair Use Policy:</strong> {aupText}
        </li>
      );
    }
    
    if (pkg.throttle && pkg.throttle !== '') {
      features.push(
        <li key="throttle">
          <CheckIcon />
          <strong>Throttled to:</strong> {pkg.throttle}
        </li>
      );
    }
    
    if (features.length === 0) {
      let typeLabel = 'Fixed LTE';
      if (pkg.type === 'mobile-data') typeLabel = 'Mobile Data';
      if (pkg.type === 'fixed-5g') typeLabel = '5G';
      features.push(
        <li key="type">
          <CheckIcon />
          <strong>Type:</strong> {typeLabel}
        </li>
      );
    }
    
    return features;
  };

  const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  const ArrowIcon = ({ direction }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
      <path 
        fill="currentColor" 
        d={direction === 'left' ? "M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" : "M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"} 
      />
    </svg>
  );

  if (loading) {
    return (
      <div className="lte-page">
        <div className="loading-container">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="lte-page">
        <div className="error-container">
          <h2>Error Loading Packages</h2>
          <p>{error}</p>
          <button onClick={fetchLTEPackages} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="lte-page">
      <header className="lte-header">
        <div className="container">
          <h1 className="heading-gradient">LTE, 5G & Mobile Data Packages</h1>
          <p className="subheading">Fast, reliable connectivity for home and business. No contracts, no hassle.</p>
        </div>
      </header>

      <section className="lte-section">
        <div className="container">
          <div className="title-container">
            <h2 className="section-title">Choose a Provider</h2>
          </div>
          
          <div className="provider-selector">
            <button 
              className="nav-arrow nav-prev" 
              onClick={handlePrevProvider}
              aria-label="Previous provider"
            >
              <ArrowIcon direction="left" />
            </button>
            
            <div className="provider-slider" ref={providerSliderRef}>
              {providers.length === 0 ? (
                <div className="no-packages">No providers available.</div>
              ) : (
                providers.map((provider, index) => (
                  <div 
                    key={provider.slug}
                    className={`provider-card ${index === currentProviderIndex ? 'active' : ''}`}
                    onClick={() => {
                      updateProvider(index);
                      scrollToProvider(index);
                    }}
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
              onClick={handleNextProvider}
              aria-label="Next provider"
            >
              <ArrowIcon direction="right" />
            </button>
          </div>
          
          <div className="provider-indicators">
            {providers.map((_, index) => (
              <div
                key={index}
                className={`indicator ${index === currentProviderIndex ? 'active' : ''}`}
                onClick={() => {
                  updateProvider(index);
                  scrollToProvider(index);
                }}
              />
            ))}
          </div>

          <div className="packages-grid">
            {providers.length === 0 ? (
              <div className="no-packages">No packages available at the moment.</div>
            ) : providers[currentProviderIndex] && providers[currentProviderIndex].packages.length > 0 ? (
              providers[currentProviderIndex].packages.map(pkg => (
                <div key={pkg.id} className="package-card">
                  <h3 className="package-name">{pkg.name}</h3>
                  <p className="package-provider">{pkg.provider}</p>
                  <div className="package-price">
                    <span className="currency">R</span>
                    {pkg.price}
                    <span className="period">/pm</span>
                  </div>
                  <ul className="package-features">
                    {renderPackageFeatures(pkg)}
                  </ul>
                  <button 
                    className="package-select-btn"
                    onClick={() => selectPackage(pkg)}
                  >
                    Choose Plan
                  </button>
                </div>
              ))
            ) : (
              <div className="no-packages">No packages available for this provider.</div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LTEPage; 