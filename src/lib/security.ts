import FingerprintJS from '@fingerprintjs/fingerprintjs';

/**
 * Detects if the browser is in Incognito/Private mode.
 * Uses multiple heuristics for better coverage.
 */
export async function isIncognito(): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  // 1. Storage Estimate heuristic (Chrome/Edge/Brave)
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    const { quota } = await navigator.storage.estimate();
    if (quota && quota < 120000000) return true; // Less than 120MB is a common sign of incognito
  }

  // 2. FileSystem API heuristic (older Chrome)
  const fs = (window as any).RequestFileSystem || (window as any).webkitRequestFileSystem;
  if (fs) {
    return new Promise((resolve) => {
      fs(
        (window as any).TEMPORARY,
        100,
        () => resolve(false),
        () => resolve(true)
      );
    });
  }

  // 3. IndexedDB heuristic (Firefox/Safari)
  try {
    if (!window.indexedDB && (window as any).PointerEvent && !((window as any).MSPointerEvent)) {
      return true;
    }
  } catch (e) {
    return true;
  }

  // 4. Safari specific check
  if (/Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)) {
    try {
      (window as any).openDatabase(null, null, null, null);
    } catch (e) {
      return true;
    }
  }

  return false;
}

/**
 * Generates a browser fingerprint hash.
 */
export async function getFingerprint(): Promise<string> {
  const fpPromise = FingerprintJS.load();
  const fp = await fpPromise;
  const result = await fp.get();
  return result.visitorId;
}

/**
 * Gets or creates a persistent token stored in LocalStorage.
 */
export function getPersistentToken(): string {
  if (typeof window === 'undefined') return '';
  
  let token = localStorage.getItem('__webs_baca_token');
  if (!token) {
    token = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2) + Date.now().toString(36);
    localStorage.setItem('__webs_baca_token', token);
  }
  return token;
}
