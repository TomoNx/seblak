/**
 * App.tsx — SeblakPOS Root Component
 *
 * Slim orchestrator that composes:
 * - useOrders hook for order state management
 * - useMenuData hook for menu configuration
 * - useLocalStorageSync for cross-tab synchronization
 * - React Router for URL-based navigation
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Order } from './types';
import KioskView from './components/KioskView';
import KasirView from './components/KasirView';
import PhoneSimulatorModal from './components/PhoneSimulatorModal';
import { AnimatePresence } from 'motion/react';
import { useOrders } from './hooks/useOrders';
import { useMenuData, DEFAULT_SETTINGS } from './hooks/useMenuData';
import { useStorageListener, saveAllToStorage, STORAGE_KEYS, loadFromStorage } from './hooks/useLocalStorageSync';
import * as api from './services/api';
import { TOPPINGS, BROTHS, PRESETS, SNACKS_AND_DRINKS } from './data';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

/** Client-side fallback seed orders (when server is unreachable) */
const FALLBACK_ORDERS: Order[] = [
  {
    id: 'SEB-1542', customerName: 'Kang Asep',
    items: [{
      name: 'Seblak Rakyat Murmer', type: 'preset',
      brothName: 'Kuah Cikur Original (Juara)', level: 2,
      toppings: [
        { name: 'Kerupuk Bawang Pelangi', quantity: 1, price: 0 },
        { name: 'Makaroni Spiral', quantity: 1, price: 0 },
        { name: 'Mie Keriting', quantity: 1, price: 0 },
        { name: 'Telur Ayam Orak-arik', quantity: 1, price: 0 },
        { name: 'Batagor Kering (3 pcs)', quantity: 1, price: 0 }
      ],
      pricePerUnit: 12000, quantity: 1, notes: 'Kuah agak banyak ya kang, gurih'
    }],
    totalPrice: 12000, paymentMethod: null, status: 'pending_payment',
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString()
  }
];

function AppContent() {
  const [trackedOrderId, setTrackedOrderId] = useState<string | null>(null);

  // Custom hooks for state management
  const {
    orders, setOrders, addOrder, confirmPayment, cancelOrder,
    restoreOrder, deleteOrderById, updateOrder
  } = useOrders();

  const {
    toppings, broths, presets, snacksAndDrinks,
    toppingCategories, menuCategories, settings,
    saveToppings, saveBroths, savePresets, saveSnacksAndDrinks,
    saveToppingCategories, saveMenuCategories, saveSettings,
    setAllMenuData
  } = useMenuData();

  // Load all data from server on mount, with localStorage fallback
  useEffect(() => {
    const loadAllData = async () => {
      try {
        const dbData = await api.fetchAllData();
        setOrders(dbData.orders || []);
        setAllMenuData({
          toppings: dbData.toppings,
          broths: dbData.broths,
          presets: dbData.presets,
          snacksAndDrinks: dbData.snacksAndDrinks,
          toppingCategories: dbData.toppingCategories,
          menuCategories: dbData.menuCategories,
          settings: dbData.settings || DEFAULT_SETTINGS
        });
        saveAllToStorage(dbData);
      } catch (err) {
        console.warn("Could not retrieve data from server, applying localStorage fallback:", err);
        setOrders(loadFromStorage(STORAGE_KEYS.orders, FALLBACK_ORDERS));
        setAllMenuData({
          toppings: loadFromStorage(STORAGE_KEYS.toppings, TOPPINGS),
          broths: loadFromStorage(STORAGE_KEYS.broths, BROTHS),
          presets: loadFromStorage(STORAGE_KEYS.presets, PRESETS),
          snacksAndDrinks: loadFromStorage(STORAGE_KEYS.snacksDrinks, SNACKS_AND_DRINKS),
          toppingCategories: loadFromStorage(STORAGE_KEYS.toppingCategories, []),
          menuCategories: loadFromStorage(STORAGE_KEYS.menuCategories, []),
          settings: loadFromStorage(STORAGE_KEYS.settings, DEFAULT_SETTINGS)
        });
      }
    };
    loadAllData();
  }, []);

  // Cross-tab synchronization via StorageEvent
  const storageSetters = useMemo(() => ({
    [STORAGE_KEYS.orders]: setOrders,
    [STORAGE_KEYS.toppings]: (v: any) => setAllMenuData({ toppings: v }),
    [STORAGE_KEYS.broths]: (v: any) => setAllMenuData({ broths: v }),
    [STORAGE_KEYS.presets]: (v: any) => setAllMenuData({ presets: v }),
    [STORAGE_KEYS.snacksDrinks]: (v: any) => setAllMenuData({ snacksAndDrinks: v }),
    [STORAGE_KEYS.toppingCategories]: (v: any) => setAllMenuData({ toppingCategories: v }),
    [STORAGE_KEYS.menuCategories]: (v: any) => setAllMenuData({ menuCategories: v }),
    [STORAGE_KEYS.settings]: (v: any) => setAllMenuData({ settings: v }),
  }), [setOrders, setAllMenuData]);
  useStorageListener(storageSetters);

  // Update dynamic document title based on settings
  useEffect(() => {
    if (settings?.shopName) {
      document.title = `${settings.shopName} - POS & Self-Service Kiosk`;
    }
  }, [settings?.shopName]);

  // Phone simulator payment handler
  const handleSimulatePayment = useCallback((orderId: string) => {
    confirmPayment(orderId, 'QRIS');
  }, [confirmPayment]);

  // Tracked order for phone simulator
  const trackedOrder = useMemo(() =>
    trackedOrderId ? orders.find(o => o.id === trackedOrderId) || null : null
  , [orders, trackedOrderId]);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-100 font-sans">
      <div className="flex-1 overflow-hidden">
        <Routes>
          <Route path="/" element={<Navigate to="/kiosk" replace />} />
          <Route path="/kiosk" element={
            <KioskView
              onAddOrder={addOrder}
              onScanQR={setTrackedOrderId}
              toppings={toppings}
              broths={broths}
              presets={presets}
              snacksAndDrinks={snacksAndDrinks}
              toppingCategories={toppingCategories}
              menuCategories={menuCategories}
              settings={settings}
            />
          } />

          <Route path="/kasir" element={
            <ProtectedRoute>
              <KasirView
                orders={orders}
                onConfirmPayment={confirmPayment}
                onCancelOrder={cancelOrder}
                onRestoreOrder={restoreOrder}
                onDeleteOrder={deleteOrderById}
                onUpdateOrder={updateOrder}
                onScanQR={setTrackedOrderId}
                toppings={toppings}
                onSaveToppings={saveToppings}
                broths={broths}
                onSaveBroths={saveBroths}
                presets={presets}
                onSavePresets={savePresets}
                snacksAndDrinks={snacksAndDrinks}
                onSaveSnacksAndDrinks={saveSnacksAndDrinks}
                toppingCategories={toppingCategories}
                onSaveToppingCategories={saveToppingCategories}
                menuCategories={menuCategories}
                onSaveMenuCategories={saveMenuCategories}
                settings={settings}
                onSaveSettings={saveSettings}
              />
            </ProtectedRoute>
          } />

          <Route path="/admin" element={<Navigate to="/kasir" replace />} />
        </Routes>
      </div>

      {/* Phone Simulator Modal */}
      <AnimatePresence>
        {trackedOrder && (
          <PhoneSimulatorModal
            order={trackedOrder}
            onClose={() => setTrackedOrderId(null)}
            onSimulatePayment={handleSimulatePayment}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}
