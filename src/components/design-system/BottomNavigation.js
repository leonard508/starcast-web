import React from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * Bottom Navigation - Earthy Theme
 * Mobile-first design with thumb-friendly touch targets
 */
const BottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: '🏠',
      path: '/',
      activeColor: 'text-primary-600'
    },
    {
      id: 'fibre',
      label: 'Fibre',
      icon: '🌐',
      path: '/fibre',
      activeColor: 'text-sage-600'
    },
    {
      id: 'lte',
      label: 'LTE',
      icon: '📶',
      path: '/lte-5g',
      activeColor: 'text-sand-600'
    },
    {
      id: 'support',
      label: 'Support',
      icon: '💬',
      path: '/support',
      activeColor: 'text-stone-600'
    }
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="bottom-nav">
      <div className="bottom-nav-container">
        {navItems.map((item) => {
          const active = isActive(item.path);
          
          return (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(item.path)}
              className={`bottom-nav-item ${active ? 'active' : ''}`}
            >
              {/* Active Indicator */}
              {active && (
                <motion.div
                  layoutId="activeTab"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to right, var(--stone-100), var(--sand-50))',
                    borderRadius: '1rem'
                  }}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              
              {/* Content */}
              <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span className="bottom-nav-icon">
                  {item.icon}
                </span>
                <span className="bottom-nav-label">
                  {item.label}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;