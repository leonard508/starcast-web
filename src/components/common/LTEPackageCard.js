import React from 'react';
import './LTEPackageCard.css';

const LTEPackageCard = ({ package: pkg, onSelect }) => {
  if (!pkg) return null;

  const handleClick = () => {
    if (onSelect) {
      onSelect(pkg);
    }
  };

  const renderFeatures = () => {
    const features = [];
    const checkIcon = (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="feature-icon">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );

    // Speed feature
    if (pkg.speed && pkg.speed !== '0' && pkg.speed !== '') {
      const speedText = pkg.speed.includes('Mbps') ? pkg.speed : `${pkg.speed}Mbps`;
      features.push(
        <li key="speed">
          {checkIcon}
          <strong>Speed:</strong> {speedText}
        </li>
      );
    }

    // Data feature
    if (pkg.data && pkg.data !== '') {
      let dataValue = pkg.data.replace(/unlimited/gi, 'Uncapped').replace(/Unlimited/g, 'Uncapped');
      features.push(
        <li key="data">
          {checkIcon}
          <strong>Data:</strong> {dataValue}
        </li>
      );
    }

    // AUP (Fair Use Policy) feature
    if (pkg.aup && pkg.aup !== '0' && pkg.aup !== '') {
      const aupText = pkg.aup.includes('GB') ? pkg.aup : `${pkg.aup}GB`;
      features.push(
        <li key="aup">
          {checkIcon}
          <strong>Fair Use Policy:</strong> {aupText}
        </li>
      );
    }

    // Throttle feature
    if (pkg.throttle && pkg.throttle !== '') {
      features.push(
        <li key="throttle">
          {checkIcon}
          <strong>Throttled to:</strong> {pkg.throttle}
        </li>
      );
    }

    // If no features, show package type
    if (features.length === 0) {
      let typeLabel = 'Fixed LTE';
      if (pkg.type === 'mobile-data') typeLabel = 'Mobile Data';
      if (pkg.type === 'fixed-5g') typeLabel = '5G';
      
      features.push(
        <li key="type">
          {checkIcon}
          <strong>Type:</strong> {typeLabel}
        </li>
      );
    }

    return features;
  };

  return (
    <div className="lte-package-card" onClick={handleClick}>
      <div className="package-header">
        <h3 className="package-name">{pkg.name}</h3>
        <p className="package-provider">{pkg.provider}</p>
      </div>
      
      <div className="package-price">
        <span className="currency">R</span>
        <span className="price-amount">{pkg.price}</span>
        <span className="period">/pm</span>
      </div>
      
      <ul className="package-features">
        {renderFeatures()}
      </ul>
      
      <button className="package-select-btn">
        Choose Plan
      </button>
    </div>
  );
};

export default LTEPackageCard; 