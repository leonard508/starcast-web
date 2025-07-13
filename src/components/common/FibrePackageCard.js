import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PackageCard.css';

const FibrePackageCard = ({ package: pkg, provider, onSelect }) => {
  const navigate = useNavigate();
  
  if (!pkg) return null;

  const handleClick = () => {
    if (onSelect) {
      onSelect(pkg);
    } else {
      navigate(`/signup?package_id=${pkg.id}`);
    }
  };

  const getSpeedDisplay = (speed) => {
    if (!speed) return 'N/A';
    return String(speed).replace(/\s*Mbps/i, '');
  };

  const downloadSpeed = getSpeedDisplay(pkg.download_display || pkg.speed || pkg.download);
  const uploadSpeed = getSpeedDisplay(pkg.upload_display || pkg.upload_speed || pkg.upload || pkg.speed);

  const originalPrice = pkg.price;
  const promoPrice = pkg.promo_price;
  const effectivePrice = pkg.effective_price || promoPrice || originalPrice;
  const hasPromo = pkg.has_promo && promoPrice && promoPrice < originalPrice;

  const renderPromoBadge = () => {
    if (!hasPromo) return null;
    
    return (
      <div className="promo-badge promo-badge-promo">
        PROMO
      </div>
    );
  };

  const renderPriceBadge = () => {
    if (hasPromo) {
      return (
        <div className="package-price-badge promo-active">
          <div className="original-price">
            R{originalPrice} <small>/pm</small>
          </div>
          <div className="promo-price">
            <span className="currency">R</span>
            <span className="price-main">{promoPrice}</span> <small>/pm</small>
          </div>
        </div>
      );
    }
    
    return (
      <div className="package-price-badge">
        <span className="currency">R</span>
        <span className="price-main">{effectivePrice}</span> <small>/pm</small>
      </div>
    );
  };

  const renderPromoText = () => {
    if (!hasPromo) return null;
    
    const savings = originalPrice - promoPrice;
    const promoText = pkg.promo_display_text || `Save R${savings}/month`;
    
    return (
      <div className="fibre-promo-text">
        {promoText}
      </div>
    );
  };

  return (
    <div 
      className={`package-card ${hasPromo ? 'has-promo' : ''}`}
      onClick={handleClick}
    >
      {renderPromoBadge()}
      
      {provider && provider.logo ? (
        <img 
          src={provider.logo} 
          alt={provider.name} 
          className="package-provider-logo"
        />
      ) : (
        <div className="package-provider-name">
          {provider?.name || 'Provider'}
        </div>
      )}
      
      {renderPriceBadge()}
      
      <div className="package-speeds-row">
        <div className="speeds-inline">
          <span>{downloadSpeed} Mbps</span>
          <span className="slash">|</span>
          <span>{uploadSpeed} Mbps</span>
        </div>
        <div className="speed-labels-inline">
          <span>Download</span>
          <span>Upload</span>
        </div>
      </div>
      
      <div className="package-feature-badge">
        {pkg.data_display || pkg.data || 'Uncapped'}
      </div>
      
      {renderPromoText()}
    </div>
  );
};

export default FibrePackageCard;