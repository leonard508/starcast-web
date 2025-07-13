import React, { createContext, useContext } from 'react';
import { usePackages as usePackagesData } from '../hooks/usePackages';

const PackageContext = createContext();

export const usePackages = () => useContext(PackageContext);

export const PackageProvider = ({ children }) => {
  const packageData = usePackagesData();

  return (
    <PackageContext.Provider value={packageData}>
      {children}
    </PackageContext.Provider>
  );
};