/**
 * useLocalStorageSync — Cross-tab state synchronization via localStorage
 *
 * Handles reading from, writing to, and listening for StorageEvent changes.
 */

import { useEffect, useCallback } from 'react';

/** All localStorage keys used by SeblakPOS */
export const STORAGE_KEYS = {
  orders: 'seblak_pos_orders',
  toppings: 'seblak_pos_toppings',
  broths: 'seblak_pos_broths',
  presets: 'seblak_pos_presets',
  snacksDrinks: 'seblak_pos_snacks_drinks',
  toppingCategories: 'seblak_pos_topping_categories',
  menuCategories: 'seblak_pos_menu_categories',
  settings: 'seblak_pos_settings'
} as const;

type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];

/**
 * Save a value to localStorage as JSON.
 */
export function saveToStorage<T>(key: StorageKey, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Failed to save to localStorage key "${key}":`, err);
  }
}

/**
 * Load a value from localStorage, parsing JSON. Returns fallback on failure.
 */
export function loadFromStorage<T>(key: StorageKey, fallback: T): T {
  try {
    const saved = localStorage.getItem(key);
    if (saved) return JSON.parse(saved) as T;
  } catch (err) {
    console.error(`Failed to load from localStorage key "${key}":`, err);
  }
  return fallback;
}

/**
 * Save all data to localStorage at once (e.g. after server fetch).
 */
export function saveAllToStorage(data: {
  orders: unknown[];
  toppings: unknown[];
  broths: unknown[];
  presets: unknown[];
  snacksAndDrinks: unknown[];
  toppingCategories: unknown[];
  menuCategories: unknown[];
  settings: unknown;
}): void {
  saveToStorage(STORAGE_KEYS.orders, data.orders);
  saveToStorage(STORAGE_KEYS.toppings, data.toppings);
  saveToStorage(STORAGE_KEYS.broths, data.broths);
  saveToStorage(STORAGE_KEYS.presets, data.presets);
  saveToStorage(STORAGE_KEYS.snacksDrinks, data.snacksAndDrinks);
  saveToStorage(STORAGE_KEYS.toppingCategories, data.toppingCategories);
  saveToStorage(STORAGE_KEYS.menuCategories, data.menuCategories);
  saveToStorage(STORAGE_KEYS.settings, data.settings);
}

/**
 * Hook: Listen for cross-tab StorageEvent updates and dispatch to setters.
 */
export function useStorageListener(setters: Record<StorageKey, (val: any) => void>): void {
  useEffect(() => {
    const handleStorageUpdate = (event: StorageEvent) => {
      if (!event.key || !event.newValue) return;

      const setter = setters[event.key as StorageKey];
      if (setter) {
        try {
          setter(JSON.parse(event.newValue));
        } catch (e) {
          console.error("Failed to parse storage sync", e);
        }
      }
    };

    window.addEventListener('storage', handleStorageUpdate);
    return () => window.removeEventListener('storage', handleStorageUpdate);
  }, [setters]);
}
