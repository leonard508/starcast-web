import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ModernHomePage: React.FC = () => {
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqData = [
    {
      question: "How long does installation take?",
      answer: "For fibre and LTE installations nationwide, our turnaround time is typically 7 working days through our partner network. For Garden Route technical installations (TV, CCTV, WiFi), we can often complete the work within 2-3 working days, and sometimes even same-day service is possible."
    },
    {
      question: "Do you offer month-to-month contracts?",
      answer: "Yes, we offer flexible contract options including month-to-month agreements. Some services may offer discounted rates for longer-term commitments, but we believe in giving you the flexibility to choose what works best for your needs."
    },
    {
      question: "What areas do you serve for technical installations?",
      answer: "Our specialized technical installation services for TV, CCTV, routers, WiFi, and access points are available exclusively in the Garden Route area. However, our fibre and LTE internet services are available nationwide through our trusted partner network."
    },
    {
      question: "What happens if I experience technical issues?",
      answer: "Our technical support team is available during business hours at 087 250 2788 or support@starcast.co.za. For simple issues, we often provide immediate assistance over the phone. For Garden Route customers needing on-site support, we can dispatch a technician usually within 24-48 hours or the next business day."
    },
    {
      question: "Can I upgrade my package later?",
      answer: "Absolutely! You can upgrade (or downgrade) your package at any time. Changes to fibre packages typically take effect at the start of the next billing cycle, while LTE package changes can often be implemented immediately."
    }
  ];

  return (
    <div className="modern-home-page">
      <style>{`
        /* Reset and Base Styles */
        .modern-home-page * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        
        .modern-home-page {
          font-family: 'Poppins', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: linear-gradient(135deg, #faf7f4 0%, #f0ebe3 30%, #f7f2eb 70%, #faf7f4 100%);
          background-attachment: fixed;
          color: #4a453f;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          overflow-x: hidden;
          line-height: 1.6;
        }

        .container {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }
        
        /* Hero Section */
        .hero {
          position: relative;
          padding: 140px 0 120px;
          background: transparent;
          overflow: hidden;
          min-height: 100vh;
          display: flex;
          align-items: center;
        }

        .hero::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 20% 20%, rgba(214, 125, 62, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(242, 237, 230, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 40% 60%, rgba(232, 227, 219, 0.2) 0%, transparent 50%);
        }
        
        .hero-content {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          max-width: 800px;
          margin: 0 auto;
        }
        
        .hero h1 {
          font-size: 4rem;
          font-weight: 800;
          color: #2d2823;
          margin-bottom: 32px;
          line-height: 1.1;
          letter-spacing: -0.02em;
        }
        
        .hero h1 span {
          color: #d67d3e;
        }
        
        .hero p {
          font-size: 1.5rem;
          color: #6b6355;
          max-width: 600px;
          margin: 0 auto 48px;
          line-height: 1.6;
          font-weight: 400;
        }
        
        .hero-buttons {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          justify-content: center;
          margin-bottom: 80px;
        }
        
        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 16px 32px;
          border-radius: 8px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s ease;
          cursor: pointer;
          font-size: 1rem;
          line-height: 1.5;
          border: none;
          outline: none;
        }
        
        .btn svg {
          margin-right: 8px;
          width: 20px;
          height: 20px;
        }
        
        .btn-primary {
          background: #d67d3e;
          color: #ffffff;
          box-shadow: 0 4px 14px 0 rgba(214, 125, 62, 0.25);
        }
        
        .btn-primary:hover {
          background: #c56d31;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px 0 rgba(214, 125, 62, 0.35);
        }
        
        .btn-secondary {
          background: #f4f1ec;
          color: #4a453f;
          border: 2px solid #e8e3db;
        }
        
        .btn-secondary:hover {
          background: #ede8e0;
          border-color: #ddd6cb;
          transform: translateY(-1px);
        }
        
        .hero-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
          margin-top: 0;
          padding: 40px;
          background: rgba(250, 247, 244, 0.7);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          border: 1px solid rgba(232, 227, 219, 0.3);
          box-shadow: 
            0 8px 32px rgba(74, 69, 63, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.5);
        }
        
        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        
        .stat-value {
          font-size: 3rem;
          font-weight: 800;
          color: #d67d3e;
          margin-bottom: 8px;
          line-height: 1;
        }
        
        .stat-value.stat-text {
          font-size: 2.2rem;
        }
        
        .stat-label {
          font-size: 1rem;
          color: #6b6355;
          font-weight: 500;
        }
        
        /* Services Section */
        .services {
          padding: 120px 0;
          background: transparent;
          position: relative;
        }

        .services::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 70% 30%, rgba(242, 237, 230, 0.4) 0%, transparent 50%),
            radial-gradient(circle at 30% 70%, rgba(214, 125, 62, 0.05) 0%, transparent 50%);
        }
        
        .section-header {
          text-align: center;
          margin-bottom: 80px;
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
        }
        
        .section-title {
          font-size: 3rem;
          font-weight: 800;
          color: #2d2823;
          margin-bottom: 24px;
          line-height: 1.2;
          letter-spacing: -0.02em;
        }
        
        .section-subtitle {
          font-size: 1.25rem;
          color: #6b6355;
          font-weight: 400;
          line-height: 1.6;
        }
        
        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 32px;
        }
        
        .service-card {
          background: rgba(250, 247, 244, 0.6);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          box-shadow: 
            0 8px 32px rgba(74, 69, 63, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.4);
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          height: 100%;
          display: flex;
          flex-direction: column;
          border: 1px solid rgba(232, 227, 219, 0.3);
          padding: 40px 32px;
          position: relative;
        }

        .service-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #d67d3e, #f0a876);
          border-radius: 24px 24px 0 0;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .service-card:hover::before {
          opacity: 1;
        }

        .service-card:hover {
          transform: translateY(-8px) scale(1.02);
          background: rgba(250, 247, 244, 0.8);
          box-shadow: 
            0 20px 40px rgba(74, 69, 63, 0.12),
            0 8px 16px rgba(214, 125, 62, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.6);
          border-color: rgba(214, 125, 62, 0.2);
        }
        
        .service-icon {
          width: 72px;
          height: 72px;
          background: linear-gradient(135deg, rgba(214, 125, 62, 0.1), rgba(242, 237, 230, 0.3));
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
          position: relative;
          transition: all 0.3s ease;
        }

        .service-icon::before {
          content: '';
          position: absolute;
          inset: 1px;
          background: rgba(250, 247, 244, 0.8);
          border-radius: 19px;
          backdrop-filter: blur(10px);
        }

        .service-icon svg {
          width: 36px;
          height: 36px;
          color: #d67d3e;
          position: relative;
          z-index: 1;
          transition: all 0.3s ease;
        }

        .service-card:hover .service-icon {
          transform: scale(1.1) rotate(5deg);
        }

        .service-card:hover .service-icon svg {
          color: #c56d31;
        }
        
        .service-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #2d2823;
          margin-bottom: 16px;
          line-height: 1.3;
        }
        
        .service-description {
          font-size: 1rem;
          color: #6b6355;
          line-height: 1.6;
          margin-bottom: 24px;
          flex-grow: 1;
          font-weight: 400;
        }
        
        .service-link {
          display: inline-flex;
          align-items: center;
          color: #d67d3e;
          font-weight: 600;
          text-decoration: none;
          font-size: 1rem;
          transition: all 0.2s ease;
          cursor: pointer;
        }
        
        .service-link svg {
          margin-left: 8px;
          width: 16px;
          height: 16px;
          transition: transform 0.2s ease;
        }
        
        .service-link:hover {
          color: #c56d31;
        }
        
        .service-link:hover svg {
          transform: translateX(4px);
        }
        
        /* Testimonials Section */
        .testimonials {
          padding: 120px 0;
          background: #f4f1ec;
        }
        
        .testimonials-slider {
          margin-top: 80px;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 32px;
        }
        
        .testimonial-card {
          background: #faf7f4;
          border-radius: 16px;
          padding: 40px;
          box-shadow: 0 4px 6px -1px rgba(74, 69, 63, 0.1), 0 2px 4px -1px rgba(74, 69, 63, 0.06);
          transition: all 0.3s ease;
          border: 1px solid #e8e3db;
        }

        .testimonial-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 25px -5px rgba(74, 69, 63, 0.1), 0 10px 10px -5px rgba(74, 69, 63, 0.04);
        }
        
        .testimonial-content {
          font-size: 1.125rem;
          color: #4a453f;
          margin-bottom: 32px;
          line-height: 1.7;
          font-weight: 400;
          font-style: italic;
        }
        
        .testimonial-author {
          display: flex;
          align-items: center;
        }
        
        .author-avatar {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          overflow: hidden;
          margin-right: 16px;
          border: 2px solid #e8e3db;
          background: #e8e3db;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          color: #6b6355;
        }
        
        .author-info {
          display: flex;
          flex-direction: column;
        }
        
        .author-name {
          font-weight: 600;
          color: #2d2823;
          font-size: 1rem;
          margin-bottom: 4px;
        }
        
        .author-role {
          font-size: 0.875rem;
          color: #6b6355;
          font-weight: 400;
        }
        
        /* Call-to-Action Section */
        .cta {
          padding: 120px 0;
          background: #d67d3e;
          position: relative;
          overflow: hidden;
        }
        
        .cta-content {
          position: relative;
          z-index: 2;
          text-align: center;
          max-width: 700px;
          margin: 0 auto;
        }
        
        .cta-title {
          font-size: 3rem;
          font-weight: 800;
          color: #ffffff;
          margin-bottom: 24px;
          line-height: 1.2;
          letter-spacing: -0.02em;
        }
        
        .cta-description {
          font-size: 1.25rem;
          color: #f5e6d8;
          margin-bottom: 48px;
          line-height: 1.6;
          font-weight: 400;
        }
        
        .cta-buttons {
          display: flex;
          gap: 16px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .btn-white {
          background: #faf7f4;
          color: #d67d3e;
          border: 2px solid #faf7f4;
        }

        .btn-white:hover {
          background: #f4f1ec;
          transform: translateY(-1px);
        }

        .btn-outline {
          background: transparent;
          color: #faf7f4;
          border: 2px solid #faf7f4;
        }

        .btn-outline:hover {
          background: #faf7f4;
          color: #d67d3e;
          transform: translateY(-1px);
        }

        /* FAQ Section */
        .faq {
          padding: 120px 0;
          background: #faf7f4;
        }
        
        .faq-list {
          max-width: 800px;
          margin: 80px auto 0;
        }
        
        .faq-item {
          margin-bottom: 16px;
          border-radius: 12px;
          overflow: hidden;
          background: #f4f1ec;
          box-shadow: 0 1px 3px 0 rgba(74, 69, 63, 0.1), 0 1px 2px 0 rgba(74, 69, 63, 0.06);
          border: 1px solid #e8e3db;
          transition: all 0.3s ease;
        }

        .faq-item:hover {
          border-color: #ddd6cb;
          box-shadow: 0 4px 6px -1px rgba(74, 69, 63, 0.1), 0 2px 4px -1px rgba(74, 69, 63, 0.06);
        }
        
        .faq-question {
          padding: 32px;
          background: transparent;
          color: #2d2823;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: all 0.2s ease;
          font-size: 1.125rem;
          border: none;
          width: 100%;
          text-align: left;
        }

        .faq-question:hover {
          color: #d67d3e;
        }
        
        .faq-toggle {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6b6355;
          transition: transform 0.3s ease, color 0.2s ease;
          background: #ede8e0;
          border-radius: 50%;
          border: 1px solid #ddd6cb;
        }

        .faq-question:hover .faq-toggle {
          color: #d67d3e;
          background: #f2ede6;
          border-color: #e5d6c8;
        }
        
        .faq-answer {
          padding: 0 32px;
          max-height: 0;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        
        .faq-answer-content {
          padding-bottom: 32px;
          color: #6b6355;
          line-height: 1.7;
          font-weight: 400;
          font-size: 1rem;
        }
        
        .faq-item.active .faq-toggle {
          transform: rotate(180deg);
          background: #f2ede6;
          color: #d67d3e;
          border-color: #e5d6c8;
        }
        
        .faq-item.active .faq-answer {
          max-height: 1000px;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .container {
            padding: 0 16px;
          }

          .hero {
            padding: 80px 0 60px;
          }
          
          .hero h1 {
            font-size: 2.25rem;
            margin-bottom: 24px;
          }
          
          .hero p {
            font-size: 1.125rem;
            margin-bottom: 32px;
          }

          .hero-buttons {
            flex-direction: column;
            gap: 12px;
            margin-bottom: 60px;
            align-items: center;
          }

          .btn {
            width: 100%;
            max-width: 280px;
            padding: 16px 24px;
          }
          
          .hero-stats {
            grid-template-columns: 1fr;
            gap: 20px;
            padding: 32px 24px;
          }

          .stat-value {
            font-size: 2.5rem;
          }

          .services, .testimonials, .faq, .cta {
            padding: 60px 0;
          }
          
          .section-title {
            font-size: 2rem;
            margin-bottom: 20px;
          }

          .section-subtitle {
            font-size: 1.125rem;
          }
          
          .services-grid {
            grid-template-columns: 1fr;
          }

          .testimonials-slider {
            grid-template-columns: 1fr;
            margin-top: 48px;
          }

          .cta-title {
            font-size: 2rem;
            margin-bottom: 20px;
          }

          .cta-description {
            font-size: 1.125rem;
            margin-bottom: 32px;
          }

          .cta-buttons {
            flex-direction: column;
            align-items: center;
          }

          .faq-question, .faq-answer {
            padding-left: 20px;
            padding-right: 20px;
          }

          .faq-question {
            font-size: 1rem;
            padding-top: 24px;
            padding-bottom: 24px;
          }
        }

        @media (max-width: 480px) {
          .container {
            padding: 0 12px;
          }

          .hero {
            padding: 70px 0 50px;
          }
          
          .hero h1 {
            font-size: 1.875rem;
            margin-bottom: 20px;
          }
          
          .hero p {
            font-size: 1rem;
            margin-bottom: 28px;
          }

          .btn {
            padding: 14px 20px;
            font-size: 0.9rem;
            max-width: 260px;
          }

          .hero-stats {
            padding: 24px 20px;
            gap: 16px;
          }

          .stat-value {
            font-size: 2.25rem;
          }

          .services, .testimonials, .faq, .cta {
            padding: 50px 0;
          }

          .section-title {
            font-size: 1.75rem;
            margin-bottom: 16px;
          }

          .section-subtitle {
            font-size: 1rem;
          }

          .cta-title {
            font-size: 1.75rem;
            margin-bottom: 16px;
          }

          .cta-description {
            font-size: 1rem;
            margin-bottom: 28px;
          }
        }
      `}</style>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Connect to the Future <span>with Starcast Technologies</span></h1>
            <p>Your trusted ISP delivering lightning-fast fibre and LTE internet solutions nationwide, with professional technical support and installations across the Garden Route.</p>
            
            <div className="hero-buttons">
              <button onClick={() => navigate('/fibre')} className="btn btn-primary">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                </svg>
                Fibre Packages
              </button>
              <button onClick={() => navigate('/lte-5g')} className="btn btn-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                LTE Packages
              </button>
              <button onClick={() => navigate('/booking')} className="btn btn-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Book a Technician
              </button>
            </div>
            
            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-value">7</div>
                <div className="stat-label">Day Installation</div>
              </div>
              <div className="stat-item">
                <div className="stat-value stat-text">Expert</div>
                <div className="stat-label">Support</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">100%</div>
                <div className="stat-label">Local Service</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Our Services</h2>
            <p className="section-subtitle">Nationwide fibre and LTE connectivity solutions with specialized technical support and installations in the Garden Route region.</p>
          </div>
          
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                </svg>
              </div>
              <h3 className="service-title">Fibre Internet</h3>
              <p className="service-description">Experience lightning-fast, reliable connectivity with our uncapped fibre packages available nationwide through our trusted partner network.</p>
              <button onClick={() => navigate('/fibre')} className="service-link">
                Explore Packages
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            
            <div className="service-card">
              <div className="service-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="service-title">LTE Solutions</h3>
              <p className="service-description">Stay connected anywhere with our flexible LTE packages available nationwide. Perfect for areas without fibre infrastructure or as a reliable backup solution.</p>
              <button onClick={() => navigate('/lte-5g')} className="service-link">
                View LTE Options
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            
            <div className="service-card">
              <div className="service-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="service-title">Technical Services</h3>
              <p className="service-description">Professional installation and support for TV, CCTV, routers, WiFi, and access points exclusively in the Garden Route area. Expert technicians for all your connectivity needs.</p>
              <button onClick={() => navigate('/booking')} className="service-link">
                Book a Service
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">What Our Customers Say</h2>
            <p className="section-subtitle">Don't just take our word for it. Here's what our satisfied customers have to say about their experience with Starcast Technologies.</p>
          </div>
          
          <div className="testimonials-slider">
            <div className="testimonial-card">
              <p className="testimonial-content">"Switching to Starcast was the best decision we made for our business. Their fibre connection is rock solid, and whenever we've needed technical assistance, their team has been prompt and professional."</p>
              <div className="testimonial-author">
                <div className="author-avatar">JD</div>
                <div className="author-info">
                  <div className="author-name">John D.</div>
                  <div className="author-role">Small Business Owner</div>
                </div>
              </div>
            </div>
            
            <div className="testimonial-card">
              <p className="testimonial-content">"As someone working from home, reliable internet is essential. Starcast not only provided a fast connection but also helped set up my entire home office network. Their customer service is unmatched!"</p>
              <div className="testimonial-author">
                <div className="author-avatar">SM</div>
                <div className="author-info">
                  <div className="author-name">Sarah M.</div>
                  <div className="author-role">Remote Professional</div>
                </div>
              </div>
            </div>
            
            <div className="testimonial-card">
              <p className="testimonial-content">"Living in a more remote area, I never thought I'd have access to high-speed internet. Starcast's LTE solution changed everything for our family, and their technicians went above and beyond during installation."</p>
              <div className="testimonial-author">
                <div className="author-avatar">MK</div>
                <div className="author-info">
                  <div className="author-name">Michael K.</div>
                  <div className="author-role">Wilderness Resident</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Experience Better Connectivity?</h2>
            <p className="cta-description">Join thousands of satisfied customers nationwide who enjoy fast, reliable internet and exceptional technical support from Starcast Technologies.</p>
            
            <div className="cta-buttons">
              <a href="tel:+27872502788" className="btn btn-white">
                Call Us: 087 250 2788
              </a>
              <a href="mailto:support@starcast.co.za" className="btn btn-outline">
                Email Support
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-subtitle">Find answers to common questions about our services, installation process, and technical support.</p>
          </div>
          
          <div className="faq-list">
            {faqData.map((faq, index) => (
              <div key={index} className={`faq-item ${activeFaq === index ? 'active' : ''}`}>
                <button className="faq-question" onClick={() => toggleFaq(index)}>
                  {faq.question}
                  <div className="faq-toggle">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </div>
                </button>
                <div className="faq-answer">
                  <div className="faq-answer-content">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ModernHomePage;