/**
 * Lightweight native IndexedDB manager for AfriChange PWA
 * Database Name: AfriChangeDB
 */

const DB_NAME = 'AfriChangeDB';
const DB_VERSION = 1;

const STORES = {
  RATES: 'rates_cache',
  HISTORY: 'conversion_history',
  FAVORITES: 'user_favorites',
};

const openDB = () => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      resolve(null);
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      if (!db.objectStoreNames.contains(STORES.RATES)) {
        db.createObjectStore(STORES.RATES, { keyPath: 'base' });
      }

      if (!db.objectStoreNames.contains(STORES.HISTORY)) {
        const historyStore = db.createObjectStore(STORES.HISTORY, { keyPath: 'id', autoIncrement: true });
        historyStore.createIndex('timestamp', 'timestamp', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORES.FAVORITES)) {
        db.createObjectStore(STORES.FAVORITES, { keyPath: 'pair' });
      }
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      console.warn('IndexedDB failed to open:', event.target.error);
      resolve(null);
    };
  });
};

/**
 * Save rates snapshot for a base currency
 */
export const saveRatesCache = async (baseCurrency, rates, source = 'api') => {
  try {
    const db = await openDB();
    if (!db) return false;

    return new Promise((resolve) => {
      const tx = db.transaction(STORES.RATES, 'readwrite');
      const store = tx.objectStore(STORES.RATES);
      const record = {
        base: baseCurrency.toUpperCase(),
        rates,
        source,
        updatedAt: Date.now(),
      };
      store.put(record);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
    });
  } catch (e) {
    console.warn('IndexedDB saveRatesCache error:', e);
    return false;
  }
};

/**
 * Get cached rates snapshot for a base currency
 */
export const getRatesCache = async (baseCurrency) => {
  try {
    const db = await openDB();
    if (!db) return null;

    return new Promise((resolve) => {
      const tx = db.transaction(STORES.RATES, 'readonly');
      const store = tx.objectStore(STORES.RATES);
      const request = store.get(baseCurrency.toUpperCase());
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => resolve(null);
    });
  } catch (e) {
    console.warn('IndexedDB getRatesCache error:', e);
    return null;
  }
};

/**
 * Save a conversion entry to history
 */
export const saveConversionHistory = async (conversion) => {
  try {
    const db = await openDB();
    if (!db) return false;

    return new Promise((resolve) => {
      const tx = db.transaction(STORES.HISTORY, 'readwrite');
      const store = tx.objectStore(STORES.HISTORY);
      const entry = {
        ...conversion,
        timestamp: Date.now(),
      };
      store.add(entry);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
    });
  } catch (e) {
    console.warn('IndexedDB saveConversionHistory error:', e);
    return false;
  }
};

/**
 * Get recent conversion history entries
 */
export const getConversionHistory = async (limit = 20) => {
  try {
    const db = await openDB();
    if (!db) return [];

    return new Promise((resolve) => {
      const tx = db.transaction(STORES.HISTORY, 'readonly');
      const store = tx.objectStore(STORES.HISTORY);
      const request = store.getAll();

      request.onsuccess = () => {
        const results = request.result || [];
        results.sort((a, b) => b.timestamp - a.timestamp);
        resolve(results.slice(0, limit));
      };
      request.onerror = () => resolve([]);
    });
  } catch (e) {
    console.warn('IndexedDB getConversionHistory error:', e);
    return [];
  }
};

/**
 * Clear conversion history
 */
export const clearConversionHistory = async () => {
  try {
    const db = await openDB();
    if (!db) return false;

    return new Promise((resolve) => {
      const tx = db.transaction(STORES.HISTORY, 'readwrite');
      const store = tx.objectStore(STORES.HISTORY);
      store.clear();
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
    });
  } catch (e) {
    console.warn('IndexedDB clearConversionHistory error:', e);
    return false;
  }
};
