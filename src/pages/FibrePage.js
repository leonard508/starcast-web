import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { packageService } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import FibrePackageCard from '../components/common/FibrePackageCard';
import './FibrePage.css';

const FibrePage = () => {
  const navigate = useNavigate();
  const [providers, setProviders] = useState([]);
  const [currentProviderIndex, setCurrentProviderIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [, setIsScrolling] = useState(false);
  const providerSliderRef = useRef(null);

  // Define allowed providers in the exact order we want them displayed (matching PHP)
  const allowedProviders = ['openserve', 'octotel', 'frogfoot', 'vuma', 'metrofibre', 'metrofibre-north', 'metrofibre-south'];

  useEffect(() => {
    fetchFibrePackages();
  }, []);

  const fetchFibrePackages = async () => {
    try {
      setLoading(true);
      console.log('Starting fibre packages fetch...'); // Debug log
      
      const response = await packageService.getFibrePackages();
      
      console.log('API Response:', response.data); // Debug log
      
      // Handle WordPress REST API response format (array of posts)
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        const packages = response.data;
        console.log('Packages received:', packages); // Debug log
        const groupedProviders = groupPackagesByProvider(packages);
        setProviders(groupedProviders);
      } else if (response.data && response.data.success && response.data.data) {
        // Handle custom API response format (fallback)
        const packages = response.data.data;
        console.log('Packages received:', packages); // Debug log
        const groupedProviders = groupPackagesByProvider(packages);
        setProviders(groupedProviders);
      } else {
        console.log('No packages found in API response, using fallback'); // Debug log
        // Use fallback data if API returns no packages
        const fallbackProviders = createFallbackProviders();
        setProviders(fallbackProviders);
      }
    } catch (err) {
      console.error('Error fetching fibre packages:', err);
      console.log('API failed, using fallback providers'); // Debug log
      // Use fallback data on API error
      const fallbackProviders = createFallbackProviders();
      setProviders(fallbackProviders);
    } finally {
      setLoading(false);
    }
  };

  const createFallbackProviders = () => {
    const fallbackPackages = [
      {
        id: 'default_fibre_1',
        title: 'Openserve 25Mbps Uncapped',
        provider: 'Openserve',
        speed: '25Mbps',
        download: '25',
        upload_speed: '25',
        upload: '25',
        price: 429,
        promo_price: null,
        data: 'Unlimited'
      },
      {
        id: 'default_fibre_2',
        title: 'Openserve 50Mbps Uncapped',
        provider: 'Openserve',
        speed: '50Mbps',
        download: '50',
        upload_speed: '50',
        upload: '50',
        price: 629,
        promo_price: null,
        data: 'Unlimited'
      },
      {
        id: 'default_fibre_3',
        title: 'Vuma 25Mbps Uncapped',
        provider: 'Vuma',
        speed: '25Mbps',
        download: '25',
        upload_speed: '25',
        upload: '25',
        price: 459,
        promo_price: null,
        data: 'Unlimited'
      },
      {
        id: 'default_fibre_4',
        title: 'MetroFibre 100Mbps Uncapped',
        provider: 'MetroFibre',
        speed: '100Mbps',
        download: '100',
        upload_speed: '100',
        upload: '100',
        price: 899,
        promo_price: null,
        data: 'Unlimited'
      }
    ];

    return groupPackagesByProvider(fallbackPackages);
  };

  const groupPackagesByProvider = (packages) => {
    console.log('=== DEBUGGING PACKAGES ===');
    console.log('Total packages received:', packages.length);
    
    // Debug: Show first 10 package titles
    packages.slice(0, 10).forEach((pkg, index) => {
      const title = typeof pkg.title === 'object' ? pkg.title.rendered : pkg.title;
      console.log(`Package ${index + 1}: "${title}"`);
    });
    
    const grouped = {};
    
    packages.forEach((pkg, index) => {
      const title = typeof pkg.title === 'object' ? pkg.title.rendered : pkg.title;
      console.log(`Processing package ${index + 1}:`, title); // Debug log
      
      // Extract provider name from package title or use provider field directly
      // Handle WordPress post format where title is an object
      const packageTitle = typeof pkg.title === 'object' ? pkg.title.rendered : pkg.title;
      
      // Extract provider name from package title - this was working before
      const providerName = extractProviderName(packageTitle) || 'Other';
      const providerSlug = providerName.toLowerCase().replace(/\s+/g, '-');
      
      if (!grouped[providerSlug]) {
        grouped[providerSlug] = {
          name: providerName,
          slug: providerSlug,
          packages: [],
          logo: null // Will be set if available
        };
      }
      
      // Map the package data with proper field names from WordPress API
      const mappedPackage = {
        ...pkg,
        // Handle WordPress post title format
        title: packageTitle,
        // Map speed fields - WordPress ACF fields use 'download' and 'upload'
        download_speed_value: extractSpeedValue(pkg.acf?.download || pkg.speed || pkg.download || '0'),
        upload_speed_value: extractSpeedValue(pkg.acf?.upload || pkg.upload_speed || pkg.upload || '0'),
        // Keep original fields for display
        download_display: pkg.acf?.download || pkg.speed || pkg.download || 'N/A',
        upload_display: pkg.acf?.upload || pkg.upload_speed || pkg.upload || 'N/A',
        // Handle pricing from ACF fields
        price: pkg.acf?.price || pkg.price || 0,
        promo_price: pkg.acf?.promo_price || pkg.promo_price,
        has_promo: (pkg.acf?.promo_price || pkg.promo_price) && (pkg.acf?.promo_price || pkg.promo_price) !== (pkg.acf?.price || pkg.price),
        effective_price: pkg.acf?.promo_price || pkg.promo_price || pkg.acf?.price || pkg.price,
        // Ensure we have the data field
        data_display: pkg.acf?.data || pkg.data || 'Unlimited'
      };
      
      console.log('Mapped package:', mappedPackage); // Debug log
      
      grouped[providerSlug].packages.push(mappedPackage);
    });

    // Sort packages within each provider by download speed
    Object.values(grouped).forEach(provider => {
      provider.packages.sort((a, b) => a.download_speed_value - b.download_speed_value);
    });

    // Return all providers - this was working with 8 providers
    const allProviders = Object.values(grouped).filter(provider => provider.packages.length > 0);
    
    console.log('Final grouped providers:', allProviders); // Debug log
    return allProviders;
  };

  const extractProviderName = (title) => {
    // Extract provider name from package title - working list from first 100 packages
    const providers = [
      'PPHG', 'Lightstruck', 'Netstream', 'Zoom Fibre', 'Steyn City', 
      'Nova', 'Nexus', 'Link Layer'
    ];
    
    // Check for exact provider name at start of title
    for (const provider of providers) {
      if (title.toLowerCase().startsWith(provider.toLowerCase())) {
        return provider;
      }
    }
    
    // If no known provider found, try to extract from title
    const parts = title.split(' ');
    return parts[0] || 'Other';
  };

  const extractSpeedValue = (speedString) => {
    // Extract numeric value from speed string (e.g., "100Mbps" -> 100)
    if (!speedString) return 0;
    const match = String(speedString).match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  };

  const handleProviderSelect = (index) => {
    setCurrentProviderIndex(index);
    scrollToProvider(index);
  };

  const scrollToProvider = (index) => {
    if (!providerSliderRef.current || !providers[index]) return;
    
    setIsScrolling(true);
    
    const slider = providerSliderRef.current;
    const cards = slider.querySelectorAll('.provider-card');
    const card = cards[index];
    
    if (card) {
      const sliderRect = slider.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();
      
      const cardCenter = card.offsetLeft + (cardRect.width / 2);
      const sliderCenter = sliderRect.width / 2;
      const targetScrollLeft = cardCenter - sliderCenter;
      
      slider.scrollTo({
        left: Math.max(0, targetScrollLeft),
        behavior: 'smooth'
      });
    }
    
    setTimeout(() => {
      setIsScrolling(false);
    }, 500);
  };

  const handlePrevProvider = () => {
    const newIndex = currentProviderIndex - 1 < 0 ? providers.length - 1 : currentProviderIndex - 1;
    handleProviderSelect(newIndex);
  };

  const handleNextProvider = () => {
    const newIndex = currentProviderIndex + 1 >= providers.length ? 0 : currentProviderIndex + 1;
    handleProviderSelect(newIndex);
  };

  const handlePackageSelect = (pkg) => {
    try {
      const selectedPackage = {
        id: pkg.id,
        name: `${providers[currentProviderIndex].name} ${pkg.download_display}`,
        price: pkg.effective_price || pkg.price,
        provider: providers[currentProviderIndex].name,
        download: pkg.download_display,
        upload: pkg.upload_display
      };
      
      console.log('Selected package:', selectedPackage); // Debug log
      
      sessionStorage.setItem('selectedPackage', JSON.stringify(selectedPackage));
      
      // Navigate to React signup page instead of WordPress
      navigate(`/signup?package_id=${pkg.id}`);
    } catch (error) {
      console.error('Error storing package:', error);
      // Fallback to React signup page
      navigate(`/signup?package_id=${pkg.id}`);
    }
  };

  if (loading) {
    return (
      <div className="fibre-page">
        <div className="loading-container">
          <LoadingSpinner />
          <p>Loading fibre packages...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fibre-page">
        <div className="error-container">
          <h2>Error Loading Packages</h2>
          <p>{error}</p>
          <button onClick={fetchFibrePackages} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const currentProvider = providers[currentProviderIndex];

  return (
    <div className="fibre-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Lightning-Fast Fibre
              <span className="hero-accent">Internet</span>
            </h1>
            <p className="hero-subtitle">
              Experience seamless connectivity with uncapped fibre packages. 
              Professional installation within 7 days.
            </p>
            <div className="hero-features">
              <div className="feature-item">
                <div className="feature-icon">⚡</div>
                <span>Uncapped Data</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🏠</div>
                <span>Home & Business</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">📅</div>
                <span>7-Day Installation</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Provider Selection */}
      <section className="provider-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Choose Your Network</h2>
            <p className="section-subtitle">Select from our trusted fibre network providers</p>
          </div>
          
          {providers.length > 0 ? (
            <>
              <div className="provider-selector">
                <button 
                  className="nav-arrow nav-prev" 
                  onClick={handlePrevProvider}
                  aria-label="Previous provider"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                
                <div className="provider-slider" ref={providerSliderRef}>
                  {providers.map((provider, index) => (
                    <div
                      key={provider.slug}
                      className={`provider-card ${index === currentProviderIndex ? 'active' : ''}`}
                      onClick={() => handleProviderSelect(index)}
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
                  ))}
                </div>
                
                <button 
                  className="nav-arrow nav-next" 
                  onClick={handleNextProvider}
                  aria-label="Next provider"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
              
              <div className="provider-indicators">
                {providers.map((_, index) => (
                  <div
                    key={index}
                    className={`indicator ${index === currentProviderIndex ? 'active' : ''}`}
                    onClick={() => handleProviderSelect(index)}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="no-providers">
              <p>No providers available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Packages Grid */}
      {currentProvider && currentProvider.packages.length > 0 && (
        <section className="packages-section">
          <div className="container">
            <div className="packages-header">
              <h3 className="packages-title">{currentProvider.name} Packages</h3>
              <p className="packages-subtitle">Select the perfect plan for your needs</p>
            </div>
            
            <div className="packages-grid">
              {currentProvider.packages.map((pkg) => (
                <FibrePackageCard 
                  key={pkg.id} 
                  package={pkg} 
                  provider={currentProvider} 
                  onSelect={handlePackageSelect} 
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default FibrePage;