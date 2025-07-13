import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import SignupForm from '../components/forms/SignupForm';
import LTEPackageSummary from '../components/common/LTEPackageSummary';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { submitLTEApplication, validatePromoCode } from '../services/api';
import './LTESignupPage.css';

const LTESignupPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null); // null, 'success', 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const [successData, setSuccessData] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [promoData, setPromoData] = useState(null);
  const [promoError, setPromoError] = useState('');

  // Get package ID and promo code from URL params
  const packageId = searchParams.get('package_id');
  const promoCode = searchParams.get('promo');

  // Helper function to format speed with Mbps
  const formatSpeed = (speed) => {
    if (!speed || speed === '0' || speed === '') return '';
    const speedNumber = speed.toString().replace(/[^0-9]/g, '');
    return speedNumber ? speedNumber + 'Mbps' : speed;
  };

  // Helper function to format data allowance with dynamic FUP
  const formatDataAllowance = (data, aup) => {
    if (!data) return '';
    const dataLower = data.toLowerCase();
    if (dataLower.includes('unlimited') || dataLower.includes('uncapped')) {
      if (aup && aup !== '' && aup !== '0') {
        const aupNumber = aup.toString().replace(/[^0-9]/g, '');
        return aupNumber ? aupNumber + 'GB FUP' : 'Uncapped';
      }
      return 'Uncapped';
    }
    return data;
  };

  // Helper function to generate dynamic package title
  const generatePackageTitle = (pkg) => {
    const provider = pkg.provider || '';
    const speed = formatSpeed(pkg.speed);
    const data = formatDataAllowance(pkg.data, pkg.aup);
    const type = pkg.type || 'fixed-lte';
    
    let typeLabel = 'Fixed LTE';
    if (type === 'fixed-5g') typeLabel = '5G';
    if (type === 'mobile-data') typeLabel = 'Mobile';
    
    // Build dynamic title: "Provider Type Speed" or "Provider Data" for mobile
    let title = provider;
    if (type === 'mobile-data') {
      title += data ? ` ${data}` : ' Mobile';
    } else {
      title += ` ${typeLabel}`;
      if (speed) title += ` ${speed}`;
    }
    
    return title.trim();
  };

  // Helper function to enhance package data
  const enhancePackageData = (pkg) => {
    const enhancedPkg = { ...pkg };
    
    // Generate dynamic title if not already present or if generic
    if (!pkg.name || pkg.name.includes('default') || pkg.name.length < 10) {
      enhancedPkg.name = generatePackageTitle(pkg);
    }
    
    // Format speed and data consistently
    if (pkg.speed) enhancedPkg.speed = formatSpeed(pkg.speed);
    if (pkg.data) enhancedPkg.data = formatDataAllowance(pkg.data, pkg.aup);
    
    return enhancedPkg;
  };

  useEffect(() => {
    // Load package data if package ID is provided
    if (packageId) {
      loadPackageData(packageId);
    } else {
      // Try to load from session storage
      const storedPackage = sessionStorage.getItem('selectedPackage');
      if (storedPackage) {
        try {
          const pkg = JSON.parse(storedPackage);
          // Enhance package with dynamic formatting
          const enhancedPackage = enhancePackageData(pkg);
          setSelectedPackage(enhancedPackage);
        } catch (error) {
          console.error('Error parsing stored package:', error);
        }
      }
    }
  }, [packageId]);

  useEffect(() => {
    // Validate promo code if provided
    if (promoCode && (packageId || selectedPackage)) {
      validatePromo();
    }
  }, [promoCode, packageId, selectedPackage]);

  const loadPackageData = async (id) => {
    try {
      // Try to get from session storage first
      const storedPackage = sessionStorage.getItem('selectedPackage');
      if (storedPackage) {
        const pkg = JSON.parse(storedPackage);
        if (pkg.id === id || pkg.id === `default_${id}`) {
          // Enhance package with dynamic title formatting
          const enhancedPackage = enhancePackageData(pkg);
          setSelectedPackage(enhancedPackage);
          return;
        }
      }

      // If not found in storage, we could fetch from API
      // For now, show error message
      setErrorMessage('Package not found. Please go back and select a package.');
    } catch (error) {
      console.error('Error loading package data:', error);
      setErrorMessage('Error loading package information.');
    }
  };

  const validatePromo = async () => {
    try {
      const pkgId = packageId || selectedPackage?.id;
      if (!pkgId || !selectedPackage) return;

      setPromoError(''); // Clear previous errors
      
      // LTE-specific promo validation (no fixed package_id requirement)
      const result = await validatePromoCode(promoCode, pkgId, 'lte');
      if (result.success) {
        // Calculate dynamic promo pricing based on current package
        const originalPrice = selectedPackage.price;
        let promoPrice = originalPrice;
        let discount = 0;
        
        if (result.data.discount_type === 'percentage') {
          discount = originalPrice * (result.data.discount_value / 100);
          promoPrice = originalPrice - discount;
        } else if (result.data.discount_type === 'fixed') {
          discount = result.data.discount_value;
          promoPrice = Math.max(0, originalPrice - discount);
        }
        
        setPromoData({
          ...result.data,
          original_price: originalPrice,
          promo_price: promoPrice,
          discount: discount,
          discount_percentage: Math.round((discount / originalPrice) * 100)
        });
        setPromoError('');
      } else {
        setPromoError(result.message || 'Invalid promo code');
        setPromoData(null);
      }
    } catch (error) {
      console.error('Error validating promo code:', error);
      setPromoError('Error validating promo code. Please try again.');
      setPromoData(null);
    }
  };

  const handleFormSubmit = async (formData) => {
    setLoading(true);
    setSubmissionStatus(null);
    setErrorMessage('');

    try {
      const applicationData = {
        ...formData,
        package_id: packageId || selectedPackage?.id,
        package_type: 'lte',
        promo_code: promoCode || '',
        promo_data: promoData,
        package_data: selectedPackage
      };

      const result = await submitLTEApplication(applicationData);
      
      if (result.success) {
        setSubmissionStatus('success');
        setSuccessData({
          order_id: result.order_id,
          package_name: selectedPackage?.name || 'Selected Package'
        });
      } else {
        setSubmissionStatus('error');
        setErrorMessage(result.message || 'There was an error processing your application. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      setSubmissionStatus('error');
      setErrorMessage('There was an error processing your application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReturnHome = () => {
    navigate('/');
  };

  const handleBrowsePackages = () => {
    navigate('/package-selection');
  };

  if (loading) {
    return (
      <div className="lte-signup-page">
        <div className="container">
          <div className="signup-card">
            <LoadingSpinner size="large" />
            <p className="loading-text">Submitting your application...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="lte-signup-page">
      <div className="container">
        <div className="signup-card">
          <h2 className="signup-title">
            Complete Your <span>LTE Application</span>
          </h2>

          {submissionStatus === 'success' && successData && (
            <div className="success-message">
              <div className="success-icon">✓</div>
              <h3>Application Submitted Successfully!</h3>
              <p>
                Thank you for choosing our LTE service! Your application has been received and assigned reference number <strong>#{successData.order_id}</strong>.
              </p>
              
              <div className="next-steps">
                <h4>What happens next?</h4>
                <ol>
                  <li>Our team will review your application within 24 hours</li>
                  <li>We'll check LTE coverage in your area</li>
                  <li>You'll receive an email with account access once approved</li>
                  <li>Device delivery or collection typically within 3-5 days</li>
                </ol>
              </div>
              
              <div className="contact-info">
                <p>Questions? Contact us at <a href="mailto:starcast.tech@gmail.com">starcast.tech@gmail.com</a></p>
              </div>

              <div className="return-actions">
                <button onClick={handleReturnHome} className="btn-secondary">
                  Return to Home
                </button>
                <button onClick={handleBrowsePackages} className="btn-primary">
                  Browse More Packages
                </button>
              </div>
            </div>
          )}

          {submissionStatus === 'error' && (
            <div className="error-message">
              {errorMessage}
            </div>
          )}

          {submissionStatus !== 'success' && (
            <>
              {!selectedPackage && !packageId && (
                <div className="warning-message">
                  <p>No package selected. Please <a href="/package-selection" className="link-highlight">return to the package selection page</a> and select a package first.</p>
                </div>
              )}

              {selectedPackage && (
                <LTEPackageSummary 
                  package={selectedPackage} 
                  promoData={promoData}
                  promoError={promoError}
                  promoCode={promoCode}
                />
              )}

              <SignupForm 
                onSubmit={handleFormSubmit}
                disabled={!selectedPackage}
                loading={loading}
                packageType="lte"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LTESignupPage; 