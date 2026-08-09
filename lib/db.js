/**
 * Lightweight native IndexedDB manager for AfriChange PWA.
 * Rates, history and favorites stay on the user's device.
 */

const DB_NAME = 'AfriChangeDB';
const DB_VERSION = 2;

const STORES = {
  RATES: 'rates_cache',
  HISTORY: 'conversion_history',
  FAVORITES: 'user_favorites',
};

const openDB = () => new Promise((resolve) => {
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
  request.onsuccess = (event) => resolve(event.target.result);
  request.onerror = () => resolve(null);
});

const withStore = async (storeName, mode, operation, fallback) => {
  try {
    const db = await openDB();
    if (!db) return fallback;
    return await new Promise((resolve) => {
      const tx = db.transaction(storeName, mode);
      const store = tx.objectStore(storeName);
      operation(store, resolve);
      tx.onerror = () => resolve(fallback);
      tx.onabort = () => resolve(fallback);
    });
  } catch {
    return fallback;
  }
};

export const saveRatesCache = async (baseCurrency, rates, source = 'api', updatedAt = Date.now()) =>
  withStore(STORES.RATES, 'readwrite', (store, resolve) => {
    const request = store.put({
      base: baseCurrency.toUpperCase(),
      rates,
      source,
      updatedAt,
      schemaVersion: 2,
    });
    request.onsuccess = () => resolve(true);
    request.onerror = () => resolve(false);
  }, false);

export const getRatesCache = async (baseCurrency) =>
  withStore(STORES.RATES, 'readonly', (store, resolve) => {
    const request = store.get(baseCurrency.toUpperCase());
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => resolve(null);
  }, null);

export const saveConversionHistory = async (conversion) =>
  withStore(STORES.HISTORY, 'readwrite', (store, resolve) => {
    const request = store.add({ ...conversion, timestamp: Date.now() });
    request.onsuccess = () => resolve(true);
    request.onerror = () => resolve(false);
  }, false);

export const getConversionHistory = async (limit = 20) =>
  withStore(STORES.HISTORY, 'readonly', (store, resolve) => {
    const request = store.getAll();
    request.onsuccess = () => {
      const results = request.result || [];
      results.sort((a, b) => b.timestamp - a.timestamp);
      resolve(results.slice(0, limit));
    };
    request.onerror = () => resolve([]);
  }, []);

export const clearConversionHistory = async () =>
  withStore(STORES.HISTORY, 'readwrite', (store, resolve) => {
    const request = store.clear();
    request.onsuccess = () => resolve(true);
    request.onerror = () => resolve(false);
  }, false);

export const saveFavorite = async (favorite) => {
  const from = String(favorite.from || '').toUpperCase();
  const to = String(favorite.to || '').toUpperCase();
  if (!from || !to) return false;
  return withStore(STORES.FAVORITES, 'readwrite', (store, resolve) => {
    const request = store.put({
      ...favorite,
      from,
      to,
      pair: `${from}_${to}`,
      updatedAt: Date.now(),
    });
    request.onsuccess = () => resolve(true);
    request.onerror = () => resolve(false);
  }, false);
};

export const getFavorites = async (limit = 5) =>
  withStore(STORES.FAVORITES, 'readonly', (store, resolve) => {
    const request = store.getAll();
    request.onsuccess = () => {
      const results = request.result || [];
      results.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
      resolve(results.slice(0, limit));
    };
    request.onerror = () => resolve([]);
  }, []);

export const removeFavorite = async (from, to) =>
  withStore(STORES.FAVORITES, 'readwrite', (store, resolve) => {
    const request = store.delete(`${String(from).toUpperCase()}_${String(to).toUpperCase()}`);
    request.onsuccess = () => resolve(true);
    request.onerror = () => resolve(false);
  }, false);
