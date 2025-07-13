import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ServiceCard from '../components/design-system/ServiceCard';
import Button from '../components/design-system/Button';

/**
 * Modern Homepage - Light Earthy Theme
 * Inspired by LottoStar/Betway mobile-first design
 */
const ModernHomePage = () => {
  const navigate = useNavigate();

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

      {/* Services Section */}
      <section className="px-4 pb-20">
        <motion.div 
          className="max-w-md mx-auto"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-2xl font-bold text-stone-800 text-center mb-8"
            variants={heroVariants}
          >
            Choose Your Connection
          </motion.h2>

          <div className="space-y-6">
            {/* Fibre Card */}
            <motion.div variants={heroVariants}>
              <ServiceCard
                icon="🏠"
                title="Fibre Internet"
                subtitle="Ultra-fast home & business connections"
                price="299"
                features={[
                  "Speeds up to 1Gbps",
                  "Unlimited data",
                  "Free installation",
                  "24/7 technical support"
                ]}
                ctaText="View Fibre Plans"
                onCTAClick={() => navigate('/fibre')}
                highlight={true}
                badge="Most Popular"
              />
            </motion.div>

            {/* LTE Card */}
            <motion.div variants={heroVariants}>
              <ServiceCard
                icon="📶"
                title="LTE & 5G"
                subtitle="Mobile data, SIMs & router deals"
                price="99"
                features={[
                  "5G ready networks",
                  "Data & voice bundles",
                  "Router packages",
                  "Flexible contracts"
                ]}
                ctaText="Shop LTE Plans"
                onCTAClick={() => navigate('/lte-5g')}
              />
            </motion.div>
          </div>

          {/* Support CTA */}
          <motion.div 
            className="mt-12 p-6 bg-gradient-to-r from-stone-100 to-sand-100 rounded-3xl border border-stone-200/50"
            variants={heroVariants}
          >
            <div className="text-center">
              <div className="text-3xl mb-3">💬</div>
              <h3 className="font-semibold text-stone-800 mb-2">Need Help Choosing?</h3>
              <p className="text-stone-600 text-sm mb-4">
                Our experts are here to help you find the perfect plan
              </p>
              <Button variant="outlined" className="border-stone-300 text-stone-700 hover:bg-stone-50">
                Chat with Expert
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
};

export default ModernHomePage;