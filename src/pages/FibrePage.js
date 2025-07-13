import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { packageService } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
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
    
    if (pkg.download && pkg.download !== '0' && pkg.download !== '') {
      const downloadText = pkg.download.includes('Mbps') ? pkg.download : `${pkg.download}Mbps`;
      features.push(
        <li key="download">
          <CheckIcon />
          <strong>Download:</strong> {downloadText}
        </li>
      );
    }
    
    if (pkg.upload_speed && pkg.upload_speed !== '0' && pkg.upload_speed !== '') {
      const uploadText = pkg.upload_speed.includes('Mbps') ? pkg.upload_speed : `${pkg.upload_speed}Mbps`;
      features.push(
        <li key="upload">
          <CheckIcon />
          <strong>Upload:</strong> {uploadText}
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
    
    if (features.length === 0) {
      features.push(
        <li key="type">
          <CheckIcon />
          <strong>Type:</strong> Fibre Connection
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
      <header className="fibre-header">
        <div className="container">
          <h1 className="heading-gradient">
            Uncapped Fibre. <span>Installed Within 7 Days.</span>
          </h1>
          <p className="subheading">For Home and Business. Pro Rata Rates Apply.</p>
        </div>
      </header>

      <section className="fibre-section">
        <div className="container">
          <div className="title-container">
            <h2 className="section-title">Choose a Fibre Network</h2>
          </div>
          
          {providers.length > 0 ? (
            <>
              <div className="provider-selector">
                <button 
                  className="nav-arrow nav-prev" 
                  onClick={handlePrevProvider}
                  aria-label="Previous provider"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                    <path fill="currentColor" d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
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
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                    <path fill="currentColor" d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
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
              
              <div className="packages-grid">
                {currentProvider && currentProvider.packages.length > 0 ? (
                  currentProvider.packages.map((pkg) => (
                    <div key={pkg.id} className="package-card">
                      <h3 className="package-name">{pkg.title || pkg.name}</h3>
                      <p className="package-provider">{currentProvider.name}</p>
                      <div className="package-price">
                        <span className="currency">R</span>
                        {pkg.promo_price || pkg.price}
                        <span className="period">/pm</span>
                      </div>
                      <ul className="package-features">
                        {renderPackageFeatures(pkg)}
                      </ul>
                      <button 
                        className="package-select-btn"
                        onClick={() => handlePackageSelect(pkg)}
                      >
                        Choose Plan
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="no-packages">
                    No packages found for this provider.
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="no-packages">
              No providers available at the moment.
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default FibrePage; 