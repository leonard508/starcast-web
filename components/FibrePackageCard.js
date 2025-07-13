import React from 'react';
import { motion } from 'framer-motion';
import './FibrePackageCard.css';

const FibrePackageCard = ({ title, speed, price, features, promo }) => {
  return (
    <motion.div
      className={`package-card ${promo ? 'has-promo' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      {promo && (
        <div className="promo-badge">
          <span>{promo}</span>
        </div>
      )}

      <div className="package-header">
        <h3>{title}</h3>
        <div className="speed-info">
          <span className="speed">{speed}</span>
          <span className="speed-label">Download/Upload</span>
        </div>
      </div>

      <div className="package-body">
        <ul className="features-list">
          {features.map((feature, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <svg
                className="feature-icon"
                viewBox="0 0 24 24"
                width="16"
                height="16"
              >
                <path
                  fill="currentColor"
                  d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                />
              </svg>
              {feature}
            </motion.li>
          ))}
        </ul>
      </div>

      <div className="package-footer">
        <div className="price-section">
          <span className="currency">R</span>
          <span className="amount">{price}</span>
          <span className="period">/month</span>
        </div>
        <motion.button
          className="select-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Select Package
        </motion.button>
      </div>
    </motion.div>
  );
};

export default FibrePackageCard;