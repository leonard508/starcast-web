'use client'

import { useState, useEffect } from 'react';

interface Package {
  id: number | string;
  title: string;
  download: string;
  upload: string;
  price: number;
  features: string[];
}

interface Provider {
  id: number | string;
  name: string;
  logo: string;
}

interface UsePackagesReturn {
  providers: Provider[];
  packages: Package[];
  loading: boolean;
  error: string | null;
}

export const usePackages = (): UsePackagesReturn => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, you'd fetch this from an API
        const mockProviders = [
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

        const mockPackages = [
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

        setProviders(mockProviders);
        setPackages(mockPackages);
      } catch (err) {
        setError('Failed to fetch package data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { providers, packages, loading, error };
};