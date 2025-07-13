import React, { useState } from 'react';
import { motion } from 'framer-motion';
import FibrePackageCard from './components/FibrePackageCard';
import './ModernHomePage.css';
import './FibrePage.css';

const ModernHomePage = () => {
  const [selectedProvider, setSelectedProvider] = useState(null);

  const providers = [
    { id: 'openserve', name: 'Openserve', logo: '/assets/providers/openserve.svg' },
    { id: 'vumatel', name: 'Vumatel', logo: '/assets/providers/vumatel.svg' },
    { id: 'frogfoot', name: 'Frogfoot', logo: '/assets/providers/frogfoot.svg' }
  ];

  const packages = [
    {
      id: 1,
      provider: 'openserve',
      name: 'Basic Fibre',
      speed: '25/25 Mbps',
      price: 699,
      features: ['Unlimited Data', 'No Throttling', 'No Fair Usage Policy'],
      promo: 'Free Installation'
    },
    {
      id: 2,
      provider: 'vumatel',
      name: 'Premium Fibre',
      speed: '50/50 Mbps',
      price: 899,
      features: ['Unlimited Data', 'No Throttling', 'Free Router'],
      promo: 'First Month Free'
    },
    {
      id: 3,
      provider: 'frogfoot',
      name: 'Ultra Fibre',
      speed: '100/100 Mbps',
      price: 1099,
      features: ['Unlimited Data', 'Premium Support', 'Free Router'],
      promo: 'Free Installation + Router'
    }
  ];

  return (
    <div className="modern-home">
      {/* Hero Section */}
      <section className="hero-section">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          High-Speed Internet Solutions
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Experience lightning-fast connectivity with our premium internet packages
        </motion.p>
      </section>

      {/* Provider Section */}
      <section className="provider-section">
        <h2>Choose Your Provider</h2>
        <div className="provider-grid">
          {providers.map((provider) => (
            <motion.div
              key={provider.id}
              className={`provider-card ${selectedProvider === provider.id ? 'active' : ''}`}
              onClick={() => setSelectedProvider(provider.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img src={provider.logo} alt={provider.name} className="provider-logo" />
              <h3>{provider.name}</h3>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Packages Section */}
      {selectedProvider && (
        <section className="packages-section">
          <h2>Available Packages</h2>
          <div className="packages-grid">
            {packages
              .filter(pkg => pkg.provider === selectedProvider)
              .map(pkg => (
                <FibrePackageCard
                  key={pkg.id}
                  title={pkg.name}
                  speed={pkg.speed}
                  price={pkg.price}
                  features={pkg.features}
                  promo={pkg.promo}
                />
              ))}
          </div>
        </section>
      )}

      {/* Support CTA Section */}
      <section className="support-section">
        <h2>Need Help?</h2>
        <p>Our support team is here to assist you 24/7</p>
        <motion.button
          className="support-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Contact Support
        </motion.button>
      </section>
    </div>
  );
};

export default ModernHomePage;