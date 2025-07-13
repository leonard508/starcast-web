import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './FibrePackageCard.module.css';

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

  return (
    <div 
      className={`${styles.packageCard} ${hasPromo ? styles.hasPromo : ''}`
      onClick={handleClick}
    >
      {/* Promo Badge */}
      {hasPromo && (
        <div className={styles.promoBadge}>
          <span>SAVE R{originalPrice - promoPrice}</span>
        </div>
      )}

      {/* Card Header */}
      <div className={styles.cardHeader}>
        <div className={styles.providerInfo}>
          {provider && provider.logo ? (
            <img 
              src={provider.logo} 
              alt={provider.name} 
              className={styles.providerLogo}
            />
          ) : (
            <div className={styles.providerName}>
              {provider?.name || 'Provider'}
            </div>
          )}
        </div>
        
        <div className={styles.packageType}>
          <span>Uncapped Fibre</span>
        </div>
      </div>

      {/* Card Body */}
      <div className={styles.cardBody}>
        <h3 className={styles.packageTitle}>{pkg.title || pkg.name}</h3>
        
        {/* Speed Information */}
        <div className={styles.speedInfo}>
          <div className={styles.speedItem}>
            <div className={styles.speedIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="currentColor"/>
              </svg>
            </div>
            <div className={styles.speedDetails}>
              <div className={styles.speedValue}>{downloadSpeed}</div>
              <div className={styles.speedUnit}>Mbps</div>
              <div className={styles.speedLabel}>Download</div>
            </div>
          </div>
          
          <div className={styles.speedDivider}></div>
          
          <div className="speed-item">
            <div className="speed-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22L10.91 15.74L4 15L10.91 14.26L12 8L13.09 14.26L20 15L13.09 15.74L12 22Z" fill="currentColor"/>
              </svg>
            </div>
            <div className="speed-details">
              <div className="speed-value">{uploadSpeed}</div>
              <div className="speed-unit">Mbps</div>
              <div className="speed-label">Upload</div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className={styles.features}>
          <div className={styles.feature}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <span>Unlimited Data</span>
          </div>
          <div className="feature">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <span>7-Day Installation</span>
          </div>
          <div className="feature">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <span>24/7 Support</span>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className={styles.cardFooter}>
        <div className={styles.priceSection}>
          {hasPromo ? (
            <div className={styles.pricePromo}>
              <div className={styles.currentPrice}>
                <span className={styles.currency}>R</span>
                {promoPrice}
                <span className={styles.period}>/month</span>
              </div>
              <div className={styles.originalPrice}>
                <span className="currency">R</span>
                {originalPrice}
                <span className="period">/month</span>
              </div>
            </div>
          ) : (
            <div className={styles.priceRegular}>
              <span className="currency">R</span>
              {effectivePrice}
              <span className="period">/month</span>
            </div>
          )}
        </div>
        
        <button className={styles.selectButton}>
          Choose Plan
        </button>
      </div>
    </div>
  );
};

export default FibrePackageCard;