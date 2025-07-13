import React, { useState, useEffect } from 'react';
import { packageService } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './PromoDealsPage.css';

const PromoDealsPage = () => {
  const [promoPackages, setPromoPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPromoPackages = async () => {
      try {
        setLoading(true);
        const fibreResponse = await packageService.getFibrePackages();
        const lteResponse = await packageService.getLTEPackages();

        const fibrePackages = fibreResponse.data.data || [];
        const ltePackages = lteResponse.data.data || [];

        const allPackages = [...fibrePackages, ...ltePackages];
        const promoPackages = allPackages.filter(pkg => pkg.has_promo);

        setPromoPackages(promoPackages);
      } catch (err) {
        setError('Failed to load promotional deals.');
      } finally {
        setLoading(false);
      }
    };

    fetchPromoPackages();
  }, []);

  if (loading) {
    return <div className="loading-container"><LoadingSpinner /></div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  return (
    <div className="promo-deals-page">
      <div className="container">
        <h1>Promotional Deals</h1>
        <div className="promo-grid">
          {promoPackages.map((pkg) => (
            <div key={pkg.id} className="promo-card">
              <div className="promo-card-header">
                <h3>{pkg.title}</h3>
                <p>{pkg.provider}</p>
              </div>
              <div className="promo-card-body">
                <p className="original-price">R{pkg.price}</p>
                <p className="promo-price">R{pkg.promo_price}</p>
                <p className="promo-text">{pkg.promo_text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PromoDealsPage;