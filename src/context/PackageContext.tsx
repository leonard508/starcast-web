'use client'

import React, { createContext, useContext, ReactNode } from 'react';
import { usePackages as usePackagesData } from '../hooks/usePackages';

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

interface PackageContextType {
  providers: Provider[];
  packages: Package[];
  loading: boolean;
  error: string | null;
}

const PackageContext = createContext<PackageContextType | undefined>(undefined);

export const usePackages = () => {
  const context = useContext(PackageContext);
  if (context === undefined) {
    throw new Error('usePackages must be used within a PackageProvider');
  }
  return context;
};

interface PackageProviderProps {
  children: ReactNode;
}

export const PackageProvider: React.FC<PackageProviderProps> = ({ children }) => {
  const packageData = usePackagesData();

  return (
    <PackageContext.Provider value={packageData}>
      {children}
    </PackageContext.Provider>
  );
};