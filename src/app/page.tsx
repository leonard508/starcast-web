'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import styles from './home.module.css'

export default function Home() {
  const router = useRouter()
  const [activeTestimonial, setActiveTestimonial] = useState(0)

  useEffect(() => {
    // Auto-rotate testimonials
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % 3)
    }, 5000)
    
    // Fix viewport height for mobile browsers
    const setVH = () => {
      const vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vh', `${vh}px`)
    }
    
    setVH()
    window.addEventListener('resize', setVH)
    window.addEventListener('orientationchange', setVH)
    
    return () => {
      clearInterval(interval)
      window.removeEventListener('resize', setVH)
      window.removeEventListener('orientationchange', setVH)
    }
  }, [])

  const testimonials = [
    {
      text: "Starcast transformed our business with lightning-fast fibre. Their support team is incredible!",
      author: "Sarah Johnson",
      role: "CEO, TechStart",
      rating: 5
    },
    {
      text: "Finally, reliable internet in our rural area. The LTE solution is perfect for our needs.",
      author: "Mike Chen",
      role: "Remote Developer",
      rating: 5
    },
    {
      text: "Professional installation and ongoing support. Couldn't ask for better service!",
      author: "Lisa Rodriguez",
      role: "Home Office Professional",
      rating: 5
    }
  ]

  const features = [
    {
      icon: "⚡",
      title: "Lightning Fast",
      description: "Experience blazing-fast internet speeds with our fibre and LTE solutions"
    },
    {
      icon: "🛡️",
      title: "Reliable Connection",
      description: "99.9% uptime guarantee with 24/7 network monitoring"
    },
    {
      icon: "🎯",
      title: "Nationwide Coverage",
      description: "Available across South Africa with local Garden Route support"
    },
    {
      icon: "🔧",
      title: "Expert Support",
      description: "Professional technical support and installation services"
    }
  ]

  return (
    <div className={`${styles.newHomePage} fullscreen-mobile no-horizontal-scroll`}>

      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Connect to the Future with
            <br />
            <span style={{ color: '#fbbf24' }}>Starcast Technologies</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Experience lightning-fast fibre and LTE internet solutions nationwide. 
            Professional technical support and installations across the Garden Route.
          </p>
          <div className={styles.heroButtons}>
            <button 
              onClick={() => router.push('/fibre')} 
              className={`${styles.btn} ${styles.btnPrimary}`}
            >
              🌐 Explore Fibre Packages
            </button>
            <button 
              onClick={() => router.push('/lte')} 
              className={`${styles.btn} ${styles.btnSecondary}`}
            >
              📱 View LTE Solutions
            </button>

            <Link href="/api" className={`${styles.btn} ${styles.btnSecondary}`}>
              🔧 Backend API
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.statsSection}>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>7</div>
            <div className={styles.statLabel}>Day Installation</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>24/7</div>
            <div className={styles.statLabel}>Expert Support</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>100%</div>
            <div className={styles.statLabel}>Local Service</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>99.9%</div>
            <div className={styles.statLabel}>Uptime Guarantee</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.featuresSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Why Choose Starcast?</h2>
          <p className={styles.sectionSubtitle}>
            We're committed to delivering exceptional internet connectivity and technical support 
            that keeps you connected to what matters most.
          </p>
        </div>
        <div className={styles.featuresGrid}>
          {features.map((feature, index) => (
            <div key={index} className={styles.featureCard}>
              <span className={styles.featureIcon}>{feature.icon}</span>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDescription}>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={styles.testimonialsSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>What Our Customers Say</h2>
          <p className={styles.sectionSubtitle}>
            Don't just take our word for it. Here's what our satisfied customers have to say.
          </p>
        </div>
        <div className={styles.testimonialsContainer}>
          <div className={`${styles.testimonialCard} ${activeTestimonial === 0 ? styles.active : ''}`}>
            <p className={styles.testimonialText}>"{testimonials[0].text}"</p>
            <div className={styles.testimonialAuthor}>{testimonials[0].author}</div>
            <div className={styles.testimonialRole}>{testimonials[0].role}</div>
          </div>
          <div className={`${styles.testimonialCard} ${activeTestimonial === 1 ? styles.active : ''}`}>
            <p className={styles.testimonialText}>"{testimonials[1].text}"</p>
            <div className={styles.testimonialAuthor}>{testimonials[1].author}</div>
            <div className={styles.testimonialRole}>{testimonials[1].role}</div>
          </div>
          <div className={`${styles.testimonialCard} ${activeTestimonial === 2 ? styles.active : ''}`}>
            <p className={styles.testimonialText}>"{testimonials[2].text}"</p>
            <div className={styles.testimonialAuthor}>{testimonials[2].author}</div>
            <div className={styles.testimonialRole}>{testimonials[2].role}</div>
          </div>
          <div className={styles.testimonialDots}>
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className={`${styles.dot} ${activeTestimonial === index ? styles.active : ''}`}
                onClick={() => setActiveTestimonial(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>Ready to Get Started?</h2>
          <p className={styles.ctaDescription}>
            Join thousands of satisfied customers who enjoy fast, reliable internet 
            and exceptional technical support from Starcast Technologies.
          </p>
          <div className={styles.ctaButtons}>
            <a href="tel:+27872502788" className={`${styles.btn} ${styles.btnPrimary}`}>
              📞 Call Us: 087 250 2788
            </a>
            <a href="mailto:support@starcast.co.za" className={`${styles.btn} ${styles.btnOutline}`}>
              ✉️ Email Support
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}