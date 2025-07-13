import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ServiceCard from '../components/design-system/ServiceCard';
import Button from '../components/design-system/Button';
import FibrePackageCard from '../components/common/FibrePackageCard';
import './FibrePage.css';

/**
 * Modern Homepage - Light Earthy Theme
 * Inspired by LottoStar/Betway mobile-first design
 */
const ModernHomePage = () => {
  const navigate = useNavigate();
  const [activeProvider, setActiveProvider] = useState(0);

  // Mock data for providers and packages
  const providers = [
    {
      id: 1,
      name: 'Openserve',
      logo: '/assets/providers/openserve.svg'
    },
    {
      id: 2,
      name: 'Vumatel',
      logo: '/assets/providers/vumatel.svg'
    },
    {
      id: 3,
      name: 'Frogfoot',
      logo: '/assets/providers/frogfoot.svg'
    }
  ];

  const packages = [
    {
      id: 1,
      title: 'Basic Fibre',
      download: '20',
      upload: '10',
      price: 499,
      features: ['No throttling', 'No shaping', '24/7 Support']
    },
    {
      id: 2,
      title: 'Premium Fibre',
      download: '50',
      upload: '25',
      price: 799,
      features: ['No throttling', 'No shaping', '24/7 Support']
    },
    {
      id: 3,
      title: 'Ultimate Fibre',
      download: '100',
      upload: '50',
      price: 999,
      features: ['No throttling', 'No shaping', '24/7 Support']
    }
  ];

  const heroVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sand-50 via-surface-warm to-stone-50">
      {/* Hero Section */}
      <section className="relative px-4 pt-20 pb-16 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-32 h-32 bg-primary-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-sage-500 rounded-full blur-3xl"></div>
        </div>

        <motion.div 
          className="relative max-w-md mx-auto text-center"
          variants={heroVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Brand Icon */}
          <motion.div 
            className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl shadow-lg"
            whileHover={{ scale: 1.05, rotate: 5 }}
          >
            <span className="text-3xl text-white">🌐</span>
          </motion.div>

          {/* Hero Text */}
          <h1 className="text-4xl font-bold text-stone-800 mb-4 leading-tight">
            Connecting You 
            <span className="block text-primary-600">Faster</span>
          </h1>
          
          <p className="text-lg text-stone-600 mb-8 leading-relaxed">
            Lightning-fast fibre & LTE internet across South Africa with professional support.
          </p>

          {/* Quick Stats */}
          <motion.div 
            className="flex justify-center space-x-8 mb-8"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div className="text-center" variants={heroVariants}>
              <div className="text-2xl font-bold text-primary-600">50K+</div>
              <div className="text-sm text-stone-500">Happy Clients</div>
            </motion.div>
            <motion.div className="text-center" variants={heroVariants}>
              <div className="text-2xl font-bold text-sage-600">99.9%</div>
              <div className="text-sm text-stone-500">Uptime</div>
            </motion.div>
            <motion.div className="text-center" variants={heroVariants}>
              <div className="text-2xl font-bold text-sand-600">24/7</div>
              <div className="text-sm text-stone-500">Support</div>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Provider Section */}
      <section className="provider-section">
        <div className="container">
          <motion.div 
            className="section-header"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            viewport={{ once: true }}
          >
            <motion.h2 
              className="section-title"
              variants={heroVariants}
            >
              Choose Your Provider
            </motion.h2>
            <motion.p 
              className="section-subtitle"
              variants={heroVariants}
            >
              Select from South Africa's leading fibre providers
            </motion.p>
          </motion.div>

          <motion.div 
            className="provider-selector"
            variants={heroVariants}
          >
            <button 
              className="nav-arrow nav-prev" 
              aria-label="Previous provider"
              onClick={() => setActiveProvider(prev => (prev > 0 ? prev - 1 : providers.length - 1))}
            >
              ←
            </button>
            <div className="provider-slider">
              {providers.map((provider, index) => (
                <motion.div 
                  key={provider.id} 
                  className={`provider-card ${index === activeProvider ? 'active' : ''}`}
                  onClick={() => setActiveProvider(index)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <img src={provider.logo} alt={provider.name} className="provider-logo" />
                  <span className="provider-text">{provider.name}</span>
                </motion.div>
              ))}
            </div>
            <button 
              className="nav-arrow nav-next" 
              aria-label="Next provider"
              onClick={() => setActiveProvider(prev => (prev < providers.length - 1 ? prev + 1 : 0))}
            >
              →
            </button>
          </motion.div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="packages-section">
        <div className="container">
          <motion.div 
            className="packages-header"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            viewport={{ once: true }}
          >
            <motion.h2 
              className="packages-title"
              variants={heroVariants}
            >
              Popular Packages
            </motion.h2>
            <motion.p 
              className="packages-subtitle"
              variants={heroVariants}
            >
              Find the perfect fibre package for your needs
            </motion.p>
          </motion.div>

          <motion.div 
            className="packages-grid"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            viewport={{ once: true }}
          >
            {packages.map((pkg) => (
              <motion.div 
                key={pkg.id}
                variants={heroVariants}
              >
                <FibrePackageCard 
                  package={pkg} 
                  provider={providers[activeProvider]}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Support CTA */}
      <section className="container mx-auto px-4 py-12">
        <motion.div 
          className="p-6 bg-gradient-to-r from-stone-100 to-sand-100 rounded-3xl border border-stone-200/50 text-center"
          variants={heroVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
        >
            <div className="text-3xl mb-3">💬</div>
            <h3 className="font-semibold text-stone-800 mb-2">Need Help Choosing?</h3>
            <p className="text-stone-600 text-sm mb-4">
              Our experts are here to help you find the perfect plan
            </p>
            <Button variant="outlined" className="border-stone-300 text-stone-700 hover:bg-stone-50">
              Chat with Expert
            </Button>
        </motion.div>
      </section>
    </div>
  );
};

export default ModernHomePage;