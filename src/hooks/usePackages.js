import { useState, useEffect } from 'react';
import { packageService } from '../services/api';

export const usePackages = (type) => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        const response = type === 'fibre' 
          ? await packageService.getFibrePackages()
          : await packageService.getLTEPackages();
        setPackages(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, [type]);

  return { packages, loading, error };
}; 