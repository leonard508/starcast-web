import React from 'react';
import { motion } from 'framer-motion';
import Button from './Button';

/**
 * Service Card Component - Light Earthy Theme
 * Uses CSS classes from design-system.css
 */
const ServiceCard = ({ 
  title, 
  subtitle, 
  price, 
  features = [], 
  ctaText, 
  onCTAClick, 
  icon,
  highlight = false,
  badge = null 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`service-card ${highlight ? 'highlighted' : ''}`}
    >
      {/* Popular Badge */}
      {badge && (
        <div className="badge">
          {badge}
        </div>
      )}

      {/* Icon */}
      <div className="flex items-center mb-4">
        <div className={`service-card-icon ${highlight ? 'highlighted' : 'default'}`}>
          {icon}
        </div>
        {highlight && (
          <div style={{ marginLeft: 'auto' }}>
            <span className="best-value-badge">
              BEST VALUE
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <h3 className="service-card-title">{title}</h3>
      <p className="service-card-subtitle">{subtitle}</p>

      {/* Price */}
      <div className="service-card-price">
        <span className="service-card-price-currency">R</span>
        {price}
        <span className="service-card-price-period">/month</span>
      </div>

      {/* Features */}
      <ul className="service-card-features">
        {features.map((feature, index) => (
          <li key={index}>
            {feature}
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <Button
        variant={highlight ? 'filled' : 'outlined'}
        fullWidth
        onClick={onCTAClick}
      >
        {ctaText}
      </Button>
    </motion.div>
  );
};

export default ServiceCard;