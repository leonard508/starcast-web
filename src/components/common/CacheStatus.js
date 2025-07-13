import React, { useState, useEffect } from 'react';
import { packageService } from '../../services/api';

const CacheStatus = () => {
  const [cacheStatus, setCacheStatus] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    updateCacheStatus();
  }, []);

  const updateCacheStatus = () => {
    const status = packageService.getCacheStatus();
    setCacheStatus(status);
  };

  const clearCache = () => {
    packageService.clearCache();
    updateCacheStatus();
  };

  // Only show in development or when localStorage has debug flag
  if (process.env.NODE_ENV === 'production' && !localStorage.getItem('starcast_debug')) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      zIndex: 9999,
      backgroundColor: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '8px',
      borderRadius: '4px',
      fontSize: '12px',
      fontFamily: 'monospace'
    }}>
      <div 
        onClick={() => setIsVisible(!isVisible)}
        style={{ cursor: 'pointer', fontWeight: 'bold' }}
      >
        📊 Cache {isVisible ? '▼' : '▶'}
      </div>
      
      {isVisible && cacheStatus && (
        <div style={{ marginTop: '8px', minWidth: '200px' }}>
          <div>Status: {cacheStatus.isValid ? '✅ Valid' : '❌ Expired'}</div>
          <div>Updated: {cacheStatus.lastUpdated}</div>
          <div>Next Refresh: {cacheStatus.nextRefresh}</div>
          <div>Fibre: {cacheStatus.fibrePackagesCount} packages</div>
          <div>LTE: {cacheStatus.ltePackagesCount} packages</div>
          <button 
            onClick={clearCache}
            style={{
              marginTop: '4px',
              padding: '2px 6px',
              fontSize: '10px',
              backgroundColor: '#ff4444',
              color: 'white',
              border: 'none',
              borderRadius: '2px',
              cursor: 'pointer'
            }}
          >
            Clear Cache
          </button>
          <button 
            onClick={updateCacheStatus}
            style={{
              marginTop: '4px',
              marginLeft: '4px',
              padding: '2px 6px',
              fontSize: '10px',
              backgroundColor: '#4444ff',
              color: 'white',
              border: 'none',
              borderRadius: '2px',
              cursor: 'pointer'
            }}
          >
            Refresh
          </button>
        </div>
      )}
    </div>
  );
};

export default CacheStatus;