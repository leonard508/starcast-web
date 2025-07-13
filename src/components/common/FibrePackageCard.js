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

  const renderPrice = () => (
    <div className="package-price">
      <div className="price-main">
        <span className="currency">R</span>
        {effectivePrice}
        <span className="period">/pm</span>
      </div>
      {hasPromo && (
        <div className="original-price">R{originalPrice}</div>
      )}
    </div>
  );

  return (
    <div 
      className={`package-card ${hasPromo ? 'has-promo' : ''}`}
      onClick={handleClick}
    >
      <div className="package-header">
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
        {hasPromo && <div className="package-badge">Promo</div>}
      </div>

      <div className="package-body">
        <h3 className="package-name">{pkg.title || pkg.name}</h3>
        
        <div className="package-speeds">
          <div className="speed-item">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 15.586l-4.293-4.293-1.414 1.414L12 18.414l5.707-5.707-1.414-1.414z"/><path d="M12 5.586l-4.293 4.293-1.414-1.414L12 2.586l5.707 5.707-1.414 1.414z"/></svg>
            <div className="speed-details">
              <div className="speed-value">{downloadSpeed} Mbps</div>
              <div className="speed-label">Download</div>
            </div>
          </div>
          <div className="speed-item">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 8.414l4.293 4.293 1.414-1.414L12 5.586 6.293 11.293l1.414 1.414z"/><path d="M12 18.414l4.293-4.293 1.414 1.414L12 21.414l-5.707-5.707 1.414-1.414z"/></svg>
            <div className="speed-details">
              <div className="speed-value">{uploadSpeed} Mbps</div>
              <div className="speed-label">Upload</div>
            </div>
          </div>
        </div>

        <div className="package-price-container">
          {renderPrice()}
          {hasPromo && (
            <p className="promo-text">{pkg.promo_display_text || `Save R${originalPrice - promoPrice}/month`}</p>
          )}
          <div className="package-cta">
            <button className="btn btn-primary">Choose Plan</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FibrePackageCard;