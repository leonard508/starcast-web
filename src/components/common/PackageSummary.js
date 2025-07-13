import React from 'react';
import './PackageSummary.css';

const PackageSummary = ({ package: pkg, promoData, promoError, promoCode }) => {
  if (!pkg) return null;

  // Extract package details
  const provider = pkg.provider || 'Unknown';
  const price = pkg.price || 0;
  const download = pkg.download || pkg.download_speed || 'N/A';
  const upload = pkg.upload || pkg.upload_speed || 'N/A';

  // Calculate promo pricing
  const originalPrice = promoData ? promoData.original_price : price;
  const promoPrice = promoData ? promoData.promo_price : null;
  const discount = promoData ? promoData.discount : 0;
  const discountPercentage = promoData && originalPrice > 0 ? Math.round((discount / originalPrice) * 100) : 0;

  return (
    <div className="package-summary">
      <div className="package-details">
        <p className="package-provider">{provider}</p>
        <p className="package-price">
          {promoPrice !== null ? (
            <>
              <span className="original-price">R{originalPrice}</span>
              <span className="promo-price">R{promoPrice}</span>
            </>
          ) : (
            <span className="package-price-value">R{price}</span>
          )}
          <span className="price-period"> per month</span>
        </p>
        <div className="package-speed">
          <div className="package-speed-item">
            <span className="speed-icon">↓</span>
            <span>{download} Download</span>
          </div>
          <div className="package-speed-item">
            <span className="speed-icon">↑</span>
            <span>{upload} Upload</span>
          </div>
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

export default PackageSummary; 