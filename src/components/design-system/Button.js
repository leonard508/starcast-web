import React from 'react';
import { motion } from 'framer-motion';

/**
 * Material Design 3.0 Button Component
 * Uses CSS classes from design-system.css
 */
const Button = ({ 
  variant = 'filled', 
  children, 
  disabled = false,
  fullWidth = false,
  startIcon,
  endIcon,
  onClick,
  className = '',
  ...props 
}) => {
  const variantClass = variant === 'outlined' ? 'btn-outlined' : 'btn-filled';
  const fullWidthClass = fullWidth ? 'btn-full-width' : '';

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      whileHover={{ scale: 1.02 }}
      className={`btn-modern ${variantClass} ${fullWidthClass} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {startIcon && (
        <span style={{ marginRight: '0.5rem' }}>
          {startIcon}
        </span>
      )}
      {children}
      {endIcon && (
        <span style={{ marginLeft: '0.5rem' }}>
          {endIcon}
        </span>
      )}
    </motion.button>
  );
};

export default Button;