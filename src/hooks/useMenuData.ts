/**
 * useMenuData — Custom hook for menu configuration state management
 *
 * Manages toppings, broths, presets, snacks/drinks, categories, and settings.
 * Syncs changes to both localStorage and server.
 */

import { useState, useCallback } from 'react';
import { Topping, Broth, PresetMenu, SnackOrDrink, ShopSettings, Category } from '../types';
import { saveConfig } from '../services/api';
import { saveToStorage, STORAGE_KEYS } from './useLocalStorageSync';

const DEFAULT_SETTINGS: ShopSettings = {
  qrisImage: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=seblak-pos-payment-gateway',
  shopName: 'SEBLAK MALIOBORO JUARA',
  shopAddress: 'Jln. Malioboro No. 25, Yogyakarta',
  shopPhone: '08123456789'
};

const DEFAULT_TOPPING_CATEGORIES: Category[] = [
  { id: 'karbo', name: 'Karbohidrat (Mie, Makaroni, Aci)' },
  { id: 'protein', name: 'Protein (Daging, Sosis, Telur)' },
  { id: 'cuanki', name: 'Keringan & Cuanki' },
  { id: 'extra', name: 'Sayuran & Ekstra' }
];

const DEFAULT_MENU_CATEGORIES: Category[] = [
  { id: 'seblak', name: 'Seblak Juara' },
  { id: 'snack', name: 'Cemilan Pendamping' },
  { id: 'drink', name: 'Minuman Dingin' }
];

export { DEFAULT_SETTINGS, DEFAULT_TOPPING_CATEGORIES, DEFAULT_MENU_CATEGORIES };

export function useMenuData() {
  const [toppings, setToppings] = useState<Topping[]>([]);
  const [broths, setBroths] = useState<Broth[]>([]);
  const [presets, setPresets] = useState<PresetMenu[]>([]);
  const [snacksAndDrinks, setSnacksAndDrinks] = useState<SnackOrDrink[]>([]);
  const [toppingCategories, setToppingCategories] = useState<Category[]>([]);
  const [menuCategories, setMenuCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<ShopSettings>(DEFAULT_SETTINGS);

  /** Helper: sync a config change to localStorage + server */
  const syncConfig = useCallback(async (
    storageKey: string,
    serverKey: string,
    data: unknown
  ) => {
    saveToStorage(storageKey as any, data);
    try {
      await saveConfig(serverKey, data);
    } catch (err) {
      console.error(`Failed to sync config ${serverKey} to server:`, err);
    }
  }, []);

  const saveToppings = useCallback((data: Topping[]) => {
    setToppings(data);
    syncConfig(STORAGE_KEYS.toppings, 'toppings', data);
  }, [syncConfig]);

  const saveBroths = useCallback((data: Broth[]) => {
    setBroths(data);
    syncConfig(STORAGE_KEYS.broths, 'broths', data);
  }, [syncConfig]);

  const savePresets = useCallback((data: PresetMenu[]) => {
    setPresets(data);
    syncConfig(STORAGE_KEYS.presets, 'presets', data);
  }, [syncConfig]);

  const saveSnacksAndDrinks = useCallback((data: SnackOrDrink[]) => {
    setSnacksAndDrinks(data);
    syncConfig(STORAGE_KEYS.snacksDrinks, 'snacksAndDrinks', data);
  }, [syncConfig]);

  const saveToppingCategories = useCallback((data: Category[]) => {
    setToppingCategories(data);
    syncConfig(STORAGE_KEYS.toppingCategories, 'toppingCategories', data);
  }, [syncConfig]);

  const saveMenuCategories = useCallback((data: Category[]) => {
    setMenuCategories(data);
    syncConfig(STORAGE_KEYS.menuCategories, 'menuCategories', data);
  }, [syncConfig]);

  const saveSettings = useCallback((data: ShopSettings) => {
    setSettings(data);
    syncConfig(STORAGE_KEYS.settings, 'settings', data);
  }, [syncConfig]);

  /** Bulk set all menu data (e.g., from server fetch) */
  const setAllMenuData = useCallback((data: {
    toppings?: Topping[];
    broths?: Broth[];
    presets?: PresetMenu[];
    snacksAndDrinks?: SnackOrDrink[];
    toppingCategories?: Category[];
    menuCategories?: Category[];
    settings?: ShopSettings;
  }) => {
    if (data.toppings) setToppings(data.toppings);
    if (data.broths) setBroths(data.broths);
    if (data.presets) setPresets(data.presets);
    if (data.snacksAndDrinks) setSnacksAndDrinks(data.snacksAndDrinks);
    if (data.toppingCategories) setToppingCategories(data.toppingCategories);
    if (data.menuCategories) setMenuCategories(data.menuCategories);
    if (data.settings) setSettings(data.settings);
  }, []);

  return {
    // State
    toppings, broths, presets, snacksAndDrinks,
    toppingCategories, menuCategories, settings,

    // Setters (with sync)
    saveToppings, saveBroths, savePresets, saveSnacksAndDrinks,
    saveToppingCategories, saveMenuCategories, saveSettings,

    // Bulk setter
    setAllMenuData
  };
}
