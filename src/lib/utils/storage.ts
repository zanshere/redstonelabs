// src/lib/utils/storage.ts

/**
 * Comprehensive storage utilities for browser storage management
 */

export interface StorageOptions {
  expiresIn?: number; // in milliseconds
  encrypt?: boolean;
}

interface StoredValue<T> {
  value: T;
  expiresAt?: number;
}

export class StorageService {
  private static instance: StorageService;
  private storage: Storage;
  private encryptionKey: string;

  constructor(storage: Storage = localStorage) {
    this.storage = storage;
    this.encryptionKey = process.env.NEXT_PUBLIC_STORAGE_KEY || 'default-key';
  }

  static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  /**
   * Set item with optional expiration and encryption
   */
  set<T>(key: string, value: T, options: StorageOptions = {}): void {
    try {
      let dataToStore: StoredValue<T> | string;

      if (options.expiresIn) {
        dataToStore = {
          value,
          expiresAt: Date.now() + options.expiresIn,
        };
      } else {
        dataToStore = { value };
      }

      let dataString: string;
      if (options.encrypt) {
        dataString = this.encrypt(JSON.stringify(dataToStore));
      } else {
        dataString = JSON.stringify(dataToStore);
      }

      this.storage.setItem(key, dataString);
    } catch (error: unknown) {
      console.error(`Failed to set storage item ${key}:`, error);
      throw new Error(`Storage set failed for key: ${key}`);
    }
  }

  /**
   * Get item with decryption and expiration check
   */
  get<T>(key: string, defaultValue: T | null = null): T | null {
    try {
      const item: string | null = this.storage.getItem(key);
      
      if (!item) {
        return defaultValue;
      }

      let parsedItem: StoredValue<T> | T;

      try {
        const decrypted: string = this.decrypt(item);
        parsedItem = JSON.parse(decrypted) as StoredValue<T>;
      } catch {
        parsedItem = JSON.parse(item) as StoredValue<T> | T;
      }

      if (
        typeof parsedItem === 'object' && 
        parsedItem !== null && 
        'expiresAt' in parsedItem
      ) {
        const storedValue = parsedItem as StoredValue<T>;
        
        if (storedValue.expiresAt && Date.now() > storedValue.expiresAt) {
          this.remove(key);
          return defaultValue;
        }
        
        return storedValue.value;
      }

      return parsedItem as T;
    } catch (error: unknown) {
      console.error(`Failed to get storage item ${key}:`, error);
      return defaultValue;
    }
  }

  /**
   * Remove item from storage
   */
  remove(key: string): void {
    try {
      this.storage.removeItem(key);
    } catch (error: unknown) {
      console.error(`Failed to remove storage item ${key}:`, error);
    }
  }

  /**
   * Clear all items from storage
   */
  clear(): void {
    try {
      this.storage.clear();
    } catch (error: unknown) {
      console.error('Failed to clear storage:', error);
    }
  }

  /**
   * Check if item exists in storage
   */
  has(key: string): boolean {
    return this.storage.getItem(key) !== null;
  }

  /**
   * Get all keys from storage
   */
  keys(): string[] {
    const keys: string[] = [];
    for (let i = 0; i < this.storage.length; i++) {
      const key: string | null = this.storage.key(i);
      if (key) {
        keys.push(key);
      }
    }
    return keys;
  }

  /**
   * Get multiple items at once
   */
  getMultiple<T>(keys: string[]): Record<string, T | null> {
    const result: Record<string, T | null> = {};
    keys.forEach((key: string) => {
      result[key] = this.get<T>(key);
    });
    return result;
  }

  /**
   * Set multiple items at once
   */
  setMultiple(items: Record<string, unknown>, options: StorageOptions = {}): void {
    Object.entries(items).forEach(([key, value]: [string, unknown]) => {
      this.set(key, value, options);
    });
  }

  /**
   * Remove multiple items at once
   */
  removeMultiple(keys: string[]): void {
    keys.forEach((key: string) => this.remove(key));
  }

  /**
   * Simple encryption (for sensitive data)
   */
  private encrypt(text: string): string {
    try {
      return btoa(unescape(encodeURIComponent(text)));
    } catch {
      return text;
    }
  }

  /**
   * Simple decryption
   */
  private decrypt(encryptedText: string): string {
    try {
      return decodeURIComponent(escape(atob(encryptedText)));
    } catch {
      return encryptedText;
    }
  }
}

export const localStorageService = new StorageService(localStorage);
export const sessionStorageService = new StorageService(sessionStorage);

export class AuthStorage {
  private static readonly TOKEN_KEY: string = 'auth_token';
  private static readonly USER_KEY: string = 'auth_user';
  private static readonly REFRESH_TOKEN_KEY: string = 'auth_refresh_token';
  private static readonly TOKEN_EXPIRY: number = 7 * 24 * 60 * 60 * 1000; // 7 days

  static setToken(token: string): void {
    localStorageService.set(this.TOKEN_KEY, token, {
      expiresIn: this.TOKEN_EXPIRY,
      encrypt: true,
    });
  }

  static getToken(): string | null {
    return localStorageService.get<string>(this.TOKEN_KEY);
  }

  static setUser(user: unknown): void {
    localStorageService.set(this.USER_KEY, user, {
      expiresIn: this.TOKEN_EXPIRY,
      encrypt: false,
    });
  }

  static getUser(): unknown {
    return localStorageService.get(this.USER_KEY);
  }

  static setRefreshToken(token: string): void {
    localStorageService.set(this.REFRESH_TOKEN_KEY, token, {
      expiresIn: this.TOKEN_EXPIRY,
      encrypt: true,
    });
  }

  static getRefreshToken(): string | null {
    return localStorageService.get<string>(this.REFRESH_TOKEN_KEY);
  }

  static clearAuth(): void {
    localStorageService.remove(this.TOKEN_KEY);
    localStorageService.remove(this.USER_KEY);
    localStorageService.remove(this.REFRESH_TOKEN_KEY);
  }

  static isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  static getAuthData(): { token: string | null; user: unknown } {
    return {
      token: this.getToken(),
      user: this.getUser(),
    };
  }
}

export class PreferencesStorage {
  private static readonly THEME_KEY: string = 'pref_theme';
  private static readonly LANGUAGE_KEY: string = 'pref_language';
  private static readonly SIDEBAR_KEY: string = 'pref_sidebar';
  private static readonly NOTIFICATIONS_KEY: string = 'pref_notifications';

  static setTheme(theme: 'light' | 'dark' | 'auto'): void {
    localStorageService.set(this.THEME_KEY, theme);
  }

  static getTheme(): 'light' | 'dark' | 'auto' {
    return localStorageService.get<'light' | 'dark' | 'auto'>(this.THEME_KEY) || 'light';
  }

  static setLanguage(language: string): void {
    localStorageService.set(this.LANGUAGE_KEY, language);
  }

  static getLanguage(): string {
    return localStorageService.get<string>(this.LANGUAGE_KEY) || 'en';
  }

  static setSidebarState(collapsed: boolean): void {
    localStorageService.set(this.SIDEBAR_KEY, collapsed);
  }

  static getSidebarState(): boolean {
    return localStorageService.get<boolean>(this.SIDEBAR_KEY) || false;
  }

  static setNotificationsEnabled(enabled: boolean): void {
    localStorageService.set(this.NOTIFICATIONS_KEY, enabled);
  }

  static getNotificationsEnabled(): boolean {
    return localStorageService.get<boolean>(this.NOTIFICATIONS_KEY) ?? true;
  }
}

export class CacheStorage {
  private static readonly CACHE_PREFIX: string = 'cache_';
  private static readonly DEFAULT_TTL: number = 5 * 60 * 1000; // 5 minutes

  static set<T>(key: string, value: T, ttl: number = this.DEFAULT_TTL): void {
    const cacheKey: string = this.CACHE_PREFIX + key;
    localStorageService.set(cacheKey, {
      value,
      cachedAt: Date.now(),
      ttl,
    });
  }

  static get<T>(key: string): T | null {
    const cacheKey: string = this.CACHE_PREFIX + key;
    const cached = localStorageService.get<{ value: T; cachedAt: number; ttl: number }>(cacheKey);
    
    if (!cached) {
      return null;
    }

    if (Date.now() - cached.cachedAt > cached.ttl) {
      this.remove(key);
      return null;
    }

    return cached.value;
  }

  static remove(key: string): void {
    const cacheKey: string = this.CACHE_PREFIX + key;
    localStorageService.remove(cacheKey);
  }

  static clearExpired(): void {
    const keys: string[] = localStorageService.keys();
    const now: number = Date.now();

    keys.forEach((key: string) => {
      if (key.startsWith(this.CACHE_PREFIX)) {
        const cached = localStorageService.get<{ cachedAt: number; ttl: number }>(key);
        if (cached && now - cached.cachedAt > cached.ttl) {
          localStorageService.remove(key);
        }
      }
    });
  }

  static clearAll(): void {
    const keys: string[] = localStorageService.keys();
    keys.forEach((key: string) => {
      if (key.startsWith(this.CACHE_PREFIX)) {
        localStorageService.remove(key);
      }
    });
  }
}

export const storage = StorageService.getInstance();