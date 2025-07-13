/**
 * Cache Service - Implements daily cache refresh for API calls
 * Stores data in localStorage with timestamps
 */

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const CACHE_KEYS = {
  FIBRE_PACKAGES: 'starcast_fibre_packages',
  LTE_PACKAGES: 'starcast_lte_packages',
  LAST_UPDATED: 'starcast_last_updated'
};

class CacheService {
  /**
   * Check if cache is valid (less than 24 hours old)
   */
  isCacheValid() {
    try {
      const lastUpdated = localStorage.getItem(CACHE_KEYS.LAST_UPDATED);
      if (!lastUpdated) return false;
      
      const lastUpdatedTime = parseInt(lastUpdated);
      const now = Date.now();
      const timeDiff = now - lastUpdatedTime;
      
      return timeDiff < CACHE_DURATION;
    } catch (error) {
      console.warn('Cache validity check failed:', error);
      return false;
    }
  }

  /**
   * Force clear cache (useful for debugging API issues)
   */
  forceClearCache() {
    console.log('Force clearing all cache data');
    this.clearCache();
  }

  /**
   * Get cached data for a specific key
   */
  getCachedData(cacheKey) {
    try {
      if (!this.isCacheValid()) {
        console.log('Cache expired, will fetch fresh data');
        return null;
      }

      const cachedData = localStorage.getItem(cacheKey);
      if (!cachedData) {
        console.log('No cached data found for:', cacheKey);
        return null;
      }

      const parsedData = JSON.parse(cachedData);
      console.log('Using cached data for:', cacheKey, '- entries:', parsedData.length);
      return parsedData;
    } catch (error) {
      console.warn('Failed to get cached data:', error);
      return null;
    }
  }

  /**
   * Store data in cache with current timestamp
   */
  setCachedData(cacheKey, data) {
    try {
      localStorage.setItem(cacheKey, JSON.stringify(data));
      localStorage.setItem(CACHE_KEYS.LAST_UPDATED, Date.now().toString());
      console.log('Data cached successfully for:', cacheKey, '- entries:', data.length);
    } catch (error) {
      console.warn('Failed to cache data:', error);
      // If localStorage is full or disabled, continue without caching
    }
  }

  /**
   * Get Fibre packages from cache
   */
  getFibrePackages() {
    return this.getCachedData(CACHE_KEYS.FIBRE_PACKAGES);
  }

  /**
   * Set Fibre packages in cache
   */
  setFibrePackages(packages) {
    this.setCachedData(CACHE_KEYS.FIBRE_PACKAGES, packages);
  }

  /**
   * Get LTE packages from cache
   */
  getLTEPackages() {
    return this.getCachedData(CACHE_KEYS.LTE_PACKAGES);
  }

  /**
   * Set LTE packages in cache
   */
  setLTEPackages(packages) {
    this.setCachedData(CACHE_KEYS.LTE_PACKAGES, packages);
  }

  /**
   * Clear all cached data (useful for debugging)
   */
  clearCache() {
    try {
      Object.values(CACHE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      console.log('Cache cleared successfully');
    } catch (error) {
      console.warn('Failed to clear cache:', error);
    }
  }

  /**
   * Get cache status information
   */
  getCacheStatus() {
    const lastUpdated = localStorage.getItem(CACHE_KEYS.LAST_UPDATED);
    const isValid = this.isCacheValid();
    const fibreCount = this.getFibrePackages()?.length || 0;
    const lteCount = this.getLTEPackages()?.length || 0;

    return {
      isValid,
      lastUpdated: lastUpdated ? new Date(parseInt(lastUpdated)).toLocaleString() : 'Never',
      fibrePackagesCount: fibreCount,
      ltePackagesCount: lteCount,
      nextRefresh: lastUpdated ? 
        new Date(parseInt(lastUpdated) + CACHE_DURATION).toLocaleString() : 
        'On next API call'
    };
  }
}

// Export singleton instance
export const cacheService = new CacheService();
export default cacheService;