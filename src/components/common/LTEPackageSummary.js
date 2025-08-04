import React from 'react';
import './LTEPackageSummary.css';

const LTEPackageSummary = ({ package: pkg, promoData, promoError, promoCode }) => {
  if (!pkg) return null;

  // Extract package details
  const provider = pkg.provider || 'Unknown';
  const price = pkg.price || 0;
  const speed = pkg.speed || '';
  const data = pkg.data || '';
  const aup = pkg.aup || '';
  const throttle = pkg.throttle || '';
  const type = pkg.type || 'fixed-lte';

  // Calculate promo pricing
  const originalPrice = promoData ? promoData.original_price : price;
  const promoPrice = promoData ? promoData.promo_price : null;
  const discount = promoData ? promoData.discount : 0;
  const discountPercentage = promoData && originalPrice > 0 ? Math.round((discount / originalPrice) * 100) : 0;

  const getTypeLabel = () => {
    switch (type) {
      case 'fixed-5g':
        return '5G';
      case 'mobile-data':
        return 'Mobile Data';
      case 'fixed-lte':
      default:
        return 'Fixed LTE';
    }
  };

  const renderFeatures = () => {
    const features = [];

    // Speed feature
    if (speed && speed !== '0' && speed !== '') {
      const speedText = speed.includes('Mbps') ? speed : `${speed}Mbps`;
      features.push(
        <div key="speed" className="package-feature">
          <span className="feature-label">Speed:</span>
          <span className="feature-value">{speedText}</span>
        </div>
      );
    }

    // Data feature
    if (data && data !== '') {
      const dataValue = data.replace(/unlimited/gi, 'Uncapped').replace(/Unlimited/g, 'Uncapped');
      features.push(
        <div key="data" className="package-feature">
          <span className="feature-label">Data:</span>
          <span className="feature-value">{dataValue}</span>
        </div>
      );
    }

    // AUP (Fair Use Policy) feature
    if (aup && aup !== '0' && aup !== '') {
      const aupText = aup.includes('GB') ? aup : `${aup}GB`;
      features.push(
        <div key="aup" className="package-feature">
          <span className="feature-label">Fair Use Policy:</span>
          <span className="feature-value">{aupText}</span>
        </div>
      );
    }

    // Throttle feature
    if (throttle && throttle !== '') {
      features.push(
        <div key="throttle" className="package-feature">
          <span className="feature-label">Throttled to:</span>
          <span className="feature-value">{throttle}</span>
        </div>
      );
    }

    // Always show package type
    features.push(
      <div key="type" className="package-feature">
        <span className="feature-label">Type:</span>
        <span className="feature-value">{getTypeLabel()}</span>
      </div>
    );

    return features;
  };

  return (
    <div className="lte-package-summary">
      <div className="package-details">
        <div className="package-header">
          <p className="package-provider">{provider}</p>
          <h3 className="package-name">{pkg.name}</h3>
        </div>
        
        <div className="package-price">
          {promoPrice !== null ? (
            <>
              <span className="original-price">R{originalPrice}</span>
              <span className="promo-price">R{promoPrice}</span>
            </>
          ) : (
            <span className="package-price-value">R{price}</span>
          )}
          <span className="price-period"> per month</span>
        </div>
        
        <div className="package-features">
          {renderFeatures()}
        </div>

        {/* Promo Badge */}
        {promoData && promoCode && (
          <div className="promo-badge">
            <div className="promo-content">
              <div className="promo-header">SPECIAL OFFER</div>
              <div className="promo-code">{promoCode}</div>
              <div className="promo-savings">
                <div className="saving-item">Save R{discount.toFixed(2)}</div>
                <div className="saving-item">{discountPercentage}% OFF</div>
              </div>
            </div>
          </div>
        )}

        {/* Promo Error */}
        {promoError && promoCode && (
          <div className="promo-error">
            <p className="error-title">Invalid promo code: {promoCode}</p>
            <p className="error-message">{promoError}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LTEPackageSummary; 