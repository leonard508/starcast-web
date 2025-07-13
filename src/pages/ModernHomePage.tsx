import React, { useState } from 'react';
import { usePackages } from '../context/PackageContext';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ServiceCard from '../components/design-system/ServiceCard';
import Button from '../components/design-system/Button';
import FibrePackageCard from '../components/common/FibrePackageCard';
import styles from './ModernHomePage.module.css';

/**
 * Modern Homepage - Light Earthy Theme
 * Inspired by LottoStar/Betway mobile-first design
 */
interface Package {
  id: number | string;
  name?: string;
  title?: string;
  speed?: string;
  download?: string;
  upload?: string;
  download_display?: string;
  upload_display?: string;
  upload_speed?: string;
  price: number;
  promo_price?: number;
  effective_price?: number;
  has_promo?: boolean;
}

interface Provider {
  id: number | string;
  name: string;
  logo?: string;
}

const ModernHomePage: React.FC = () => {
  const navigate = useNavigate();
  const { providers, packages, loading, error }: { providers: Provider[]; packages: Package[]; loading: boolean; error: string | null } = usePackages();
  const [activeProvider, setActiveProvider] = useState(0);

  const heroVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Or a more sophisticated loading spinner
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

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
      <section className={styles.providerSection}>
        <div className="container">
          <motion.div 
            className={styles.sectionHeader}
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            viewport={{ once: true }}
          >
            <motion.h2 
              className={styles.sectionTitle}
              variants={heroVariants}
            >
              Choose Your Provider
            </motion.h2>
            <motion.p 
              className={styles.sectionSubtitle}
              variants={heroVariants}
            >
              Select from South Africa's leading fibre providers
            </motion.p>
          </motion.div>

          <motion.div 
            className={styles.providerSelector}
            variants={heroVariants}
          >
            <button 
              className={`${styles.navArrow} ${styles.navPrev}`} 
              aria-label="Previous provider"
              onClick={() => setActiveProvider(prev => (prev > 0 ? prev - 1 : providers.length - 1))}
            >
              ←
            </button>
            <div className={styles.providerSlider}>
              {providers.map((provider: Provider, index: number) => (
                <motion.div 
                  key={provider.id} 
                  className={`${styles.providerCard} ${index === activeProvider ? styles.active : ''}`}
                  onClick={() => setActiveProvider(index)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <img src={provider.logo} alt={provider.name} className={styles.providerLogo} />
                  <span className={styles.providerText}>{provider.name}</span>
                </motion.div>
              ))}
            </div>
            <button 
              className={`${styles.navArrow} ${styles.navNext}`} 
              aria-label="Next provider"
              onClick={() => setActiveProvider(prev => (prev < providers.length - 1 ? prev + 1 : 0))}
            >
              →
            </button>
          </motion.div>
        </div>
      </section>

      {/* Packages Section */}
      <section className={styles.packagesSection}>
        <div className="container">
          <motion.div 
            className={styles.packagesHeader}
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            viewport={{ once: true }}
          >
            <motion.h2 
              className={styles.packagesTitle}
              variants={heroVariants}
            >
              Popular Packages
            </motion.h2>
            <motion.p 
              className={styles.packagesSubtitle}
              variants={heroVariants}
            >
              Find the perfect fibre package for your needs
            </motion.p>
          </motion.div>

          <motion.div 
            className={styles.packagesGrid}
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            viewport={{ once: true }}
          >
            {packages.map((pkg: Package) => (
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
            <Button 
              variant="outlined" 
              className="border-stone-300 text-stone-700 hover:bg-stone-50"
              onClick={() => {}}
              startIcon={undefined}
              endIcon={undefined}
            >
              Chat with Expert
            </Button>
        </motion.div>
      </section>
    </div>
  );
};

export default ModernHomePage;