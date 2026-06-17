/**
 * useOrders — Custom hook for order state management
 *
 * Manages the orders array and provides handlers for all order operations
 * (create, update, cancel, restore, delete, complete).
 * Syncs changes to both localStorage and server.
 */

import { useState, useCallback } from 'react';
import { Order } from '../types';
import * as api from '../services/api';
import { saveToStorage, STORAGE_KEYS } from './useLocalStorageSync';

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);

  /** Save orders to state and localStorage */
  const saveOrders = useCallback((updatedOrders: Order[]) => {
    setOrders(updatedOrders);
    saveToStorage(STORAGE_KEYS.orders, updatedOrders);
  }, []);

  /** Kiosk: submit a new order */
  const addOrder = useCallback(async (newOrder: Partial<Order>) => {
    try {
      const saved = await api.createOrder(newOrder);
      setOrders(prev => {
        const filtered = prev.filter(o => o.id !== newOrder.id && o.id !== saved.id);
        const updated = [saved, ...filtered];
        saveToStorage(STORAGE_KEYS.orders, updated);
        return updated;
      });
      return saved;
    } catch (err) {
      console.error("Failed to add order to server:", err);
      throw err;
    }
  }, []);

  /** Helper: update an order by ID and sync to server */
  const updateOrderById = useCallback(async (orderId: string, updater: (order: Order) => Partial<Order>) => {
    try {
      setOrders(prev => {
        const current = prev.find(o => o.id === orderId);
        if (!current) return prev;
        const partialUpdate = updater(current);
        
        api.updateOrder(orderId, partialUpdate).then(res => {
          setOrders(p => {
            const upd = p.map(o => o.id === res.id ? res : o);
            saveToStorage(STORAGE_KEYS.orders, upd);
            return upd;
          });
        }).catch(err => {
          console.error(`Failed to sync order ${orderId} to server:`, err);
        });

        const optimisticallyUpdated = { ...current, ...partialUpdate } as Order;
        const updated = prev.map(order => order.id === orderId ? optimisticallyUpdated : order);
        saveToStorage(STORAGE_KEYS.orders, updated);
        return updated;
      });
    } catch (err) {
      console.error(`Failed to update order ${orderId}:`, err);
    }
  }, []);

  /** Kasir: confirm payment */
  const confirmPayment = useCallback((orderId: string, paymentMethod: 'Tunai' | 'QRIS' | 'Debit') => {
    updateOrderById(orderId, order => ({
      status: 'paid' as const,
      paymentMethod,
      paidAt: new Date().toISOString()
    }));
  }, [updateOrderById]);

  /** Kasir: cancel an unpaid order */
  const cancelOrder = useCallback((orderId: string) => {
    updateOrderById(orderId, order => ({
      status: 'cancelled' as const
    }));
  }, [updateOrderById]);

  /** Kasir: restore a cancelled order */
  const restoreOrder = useCallback((orderId: string) => {
    updateOrderById(orderId, order => ({
      status: 'pending_payment' as const,
      paymentMethod: null,
      paidAt: undefined,
      completedAt: undefined
    }));
  }, [updateOrderById]);

  /** Kasir: delete an order permanently */
  const deleteOrderById = useCallback((orderId: string) => {
    setOrders(prev => {
      const updated = prev.filter(order => order.id !== orderId);
      saveToStorage(STORAGE_KEYS.orders, updated);
      return updated;
    });
    api.deleteOrder(orderId).catch(err =>
      console.error("Failed to delete order on server:", err)
    );
  }, []);

  /** Kasir: update order contents (edit toppings, items, etc.) */
  const updateOrder = useCallback(async (updatedOrder: Order) => {
    try {
      const saved = await api.updateOrder(updatedOrder.id, updatedOrder);
      setOrders(prev => {
        const updated = prev.map(order =>
          order.id === saved.id ? saved : order
        );
        saveToStorage(STORAGE_KEYS.orders, updated);
        return updated;
      });
      return saved;
    } catch (err) {
      console.error("Failed to update order on server:", err);
      throw err;
    }
  }, []);

  /** Dapur: mark order as completed */
  const completeOrder = useCallback((orderId: string) => {
    updateOrderById(orderId, order => ({
      status: 'completed' as const,
      completedAt: new Date().toISOString()
    }));
  }, [updateOrderById]);

  return {
    orders,
    setOrders,
    saveOrders,
    addOrder,
    confirmPayment,
    cancelOrder,
    restoreOrder,
    deleteOrderById,
    updateOrder,
    completeOrder
  };
}
