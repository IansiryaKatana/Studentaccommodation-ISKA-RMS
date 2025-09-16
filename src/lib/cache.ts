/**
 * Cache management utilities
 */

export const cacheUtils = {
  /**
   * Clear all application cache
   */
  clearAll: () => {
    // Clear localStorage
    localStorage.clear();
    
    // Clear sessionStorage
    sessionStorage.clear();
    
    // Clear any cached data in memory
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          caches.delete(name);
        });
      });
    }
  },

  /**
   * Clear user-specific cache
   */
  clearUserCache: () => {
    // Remove user data from localStorage
    localStorage.removeItem('user');
    
    // Clear sessionStorage
    sessionStorage.clear();
  },

  /**
   * Clear specific cache keys
   */
  clearKeys: (keys: string[]) => {
    keys.forEach(key => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
  },

  /**
   * Get cache size information
   */
  getCacheInfo: () => {
    const localStorageSize = new Blob([JSON.stringify(localStorage)]).size;
    const sessionStorageSize = new Blob([JSON.stringify(sessionStorage)]).size;
    
    return {
      localStorage: {
        size: localStorageSize,
        sizeInKB: Math.round(localStorageSize / 1024 * 100) / 100
      },
      sessionStorage: {
        size: sessionStorageSize,
        sizeInKB: Math.round(sessionStorageSize / 1024 * 100) / 100
      }
    };
  }
}; 