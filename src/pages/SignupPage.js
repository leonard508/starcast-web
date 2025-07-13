import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import SignupForm from '../components/forms/SignupForm';
import PackageSummary from '../components/common/PackageSummary';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { submitFibreApplication, validatePromoCode } from '../services/api';
import './SignupPage.css';

const SignupPage = () => {
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

  useEffect(() => {
    // Load package data if package ID is provided
    if (packageId) {
      loadPackageData(packageId);
    }
  }, [packageId]);

  useEffect(() => {
    // Validate promo code if provided
    if (promoCode && packageId) {
      validatePromo();
    }
  }, [promoCode, packageId, validatePromo]);

  const loadPackageData = async (id) => {
    try {
      // This would typically come from your WordPress API
      // For now, we'll simulate loading package data
      const response = await fetch(`${process.env.REACT_APP_WP_API_URL}/starcast/v1/packages/fibre`);
      const packages = await response.json();
      const pkg = packages.find(p => p.id === parseInt(id));
      
      if (pkg) {
        setSelectedPackage(pkg);
      } else {
        setErrorMessage('Invalid package selected. Please go back and select a package.');
      }
    } catch (error) {
      console.error('Error loading package data:', error);
      setErrorMessage('Error loading package information.');
    }
  };

  const validatePromo = async () => {
    try {
      const result = await validatePromoCode(promoCode, packageId, 'fibre');
      if (result.success) {
        setPromoData(result.data);
        setPromoError('');
      } else {
        setPromoError(result.message || 'Invalid promo code');
      }
    } catch (error) {
      console.error('Error validating promo code:', error);
      setPromoError('Error validating promo code. Please try again.');
    }
  };

  const handleFormSubmit = async (formData) => {
    setLoading(true);
    setSubmissionStatus(null);
    setErrorMessage('');

    try {
      const applicationData = {
        ...formData,
        package_id: packageId,
        promo_code: promoCode || '',
        promo_data: promoData
      };

      const result = await submitFibreApplication(applicationData);
      
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
    navigate('/fibre');
  };

  if (loading) {
    return (
      <div className="signup-page">
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
    <div className="signup-page">
      <div className="container">
        <div className="signup-card">
          <h2 className="signup-title">
            Complete Your <span>Fibre Application</span>
          </h2>

          {submissionStatus === 'success' && successData && (
            <div className="success-message">
              <div className="success-icon">✓</div>
              <h3>Application Submitted Successfully!</h3>
              <p>
                Thank you for choosing our fibre service! Your application has been received and assigned reference number <strong>#{successData.order_id}</strong>.
              </p>
              
              <div className="next-steps">
                <h4>What happens next?</h4>
                <ol>
                  <li>Our team will review your application within 24 hours</li>
                  <li>We'll check fibre availability in your area</li>
                  <li>You'll receive an email with account access once approved</li>
                  <li>Professional installation typically completed within 7 days</li>
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
              {!packageId && (
                <div className="warning-message">
                  <p>No package selected. Please <a href="/fibre" className="link-highlight">return to the fibre page</a> and select a package first.</p>
                </div>
              )}

              {packageId && selectedPackage && (
                <PackageSummary 
                  package={selectedPackage} 
                  promoData={promoData}
                  promoError={promoError}
                  promoCode={promoCode}
                />
              )}

              <SignupForm 
                onSubmit={handleFormSubmit}
                disabled={!packageId || !selectedPackage}
                loading={loading}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignupPage; 