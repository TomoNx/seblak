/**
 * API Service Layer — SeblakPOS
 *
 * Centralized fetch wrapper for all server API calls.
 * Provides error handling and consistent response types.
 */

import { Order } from '../types';

const API_BASE = '/api';

/** Fetch all data on app mount (orders + all configs) */
export async function fetchAllData(): Promise<{
  orders: Order[];
  toppings: any[];
  broths: any[];
  presets: any[];
  snacksAndDrinks: any[];
  toppingCategories: { id: string; name: string }[];
  menuCategories: { id: string; name: string }[];
  settings: { qrisImage: string; shopName: string; shopAddress?: string; shopPhone?: string };
}> {
  const res = await fetch(`${API_BASE}/all-data`);
  if (!res.ok) throw new Error(`Server responded with ${res.status}`);
  return res.json();
}

/** Create a new order */
export async function createOrder(order: Partial<Order>): Promise<Order> {
  const res = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order)
  });
  if (!res.ok) throw new Error(`Failed to create order: ${res.status}`);
  return res.json();
}

/** Update an existing order */
export async function updateOrder(orderId: string, order: Partial<Order>): Promise<Order> {
  const res = await fetch(`${API_BASE}/orders/${orderId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order)
  });
  if (!res.ok) throw new Error(`Failed to update order: ${res.status}`);
  return res.json();
}

/** Delete an order */
export async function deleteOrder(orderId: string): Promise<void> {
  const res = await fetch(`${API_BASE}/orders/${orderId}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error(`Failed to delete order: ${res.status}`);
}

/** Save a specific configuration key */
export async function saveConfig(key: string, data: unknown): Promise<void> {
  const res = await fetch(`${API_BASE}/save-config/${key}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data })
  });
  if (!res.ok) throw new Error(`Failed to save config ${key}: ${res.status}`);
}

/** Reset the database to seeded defaults */
export async function resetDatabase(): Promise<void> {
  const res = await fetch(`${API_BASE}/reset`, { method: 'POST' });
  if (!res.ok) throw new Error(`Failed to reset database: ${res.status}`);
}

/** Upload an image file by converting it to Base64 and sending it via JSON */
export async function uploadImage(file: File): Promise<{ url: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64Data = reader.result as string;
        const res = await fetch(`${API_BASE}/upload`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            filename: file.name,
            data: base64Data
          })
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `Failed to upload image: ${res.status}`);
        }

        resolve(await res.json());
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file."));
    reader.readAsDataURL(file);
  });
}
