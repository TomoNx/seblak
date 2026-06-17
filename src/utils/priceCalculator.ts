/**
 * Price Calculator — Unified pricing logic for SeblakPOS
 *
 * Single source of truth for all price calculations:
 * - Custom seblak item pricing
 * - Preset seblak item pricing (with default topping coverage)
 * - Cart total calculation
 */

import { Topping, Broth, PresetMenu, CartItem } from '../types';

interface ToppingEntry {
  topping: Topping;
  quantity: number;
}

/**
 * Calculate the price of a single seblak item (custom or preset).
 * For custom: Base cook price + Broth + Sum(Topping * Qty)
 * For preset: Base package price + extra toppings beyond defaults
 */
export function calculateItemUnitPrice(
  type: 'custom' | 'preset',
  basePrice: number,
  broth: Broth | undefined,
  toppings: ToppingEntry[],
  preset?: PresetMenu
): number {
  const brothPrice = broth?.price || 0;

  const toppingsPrice = toppings.reduce((acc, curr) => {
    if (type === 'custom') {
      return acc + curr.topping.price * curr.quantity;
    }

    // Preset: default toppings (qty 1) are covered by base price
    const defaults = preset?.defaultToppings || [];
    const isDefault = defaults.includes(curr.topping.id);

    if (isDefault) {
      const extraQty = Math.max(0, curr.quantity - 1);
      return acc + curr.topping.price * extraQty;
    }

    return acc + curr.topping.price * curr.quantity;
  }, 0);

  return basePrice + brothPrice + toppingsPrice;
}

/**
 * Calculate the total price of the entire cart.
 */
export function calculateCartTotal(
  cart: CartItem[],
  presets: PresetMenu[]
): number {
  return cart.reduce((acc, item) => {
    if (item.type === 'snack' || item.type === 'drink') {
      return acc + item.basePrice * item.quantity;
    }

    const preset = presets.find(p => p.name === item.name);
    const unitPrice = calculateItemUnitPrice(
      item.type as 'custom' | 'preset',
      item.basePrice,
      item.broth,
      item.toppings || [],
      preset
    );

    return acc + unitPrice * item.quantity;
  }, 0);
}

/**
 * Determine the price to display for a topping in an order summary.
 * For preset items, default toppings show price as 0 (covered by package).
 */
export function getToppingDisplayPrice(
  toppingId: string,
  toppingPrice: number,
  itemType: 'custom' | 'preset',
  preset?: PresetMenu
): number {
  if (itemType === 'custom') return toppingPrice;

  const defaults = preset?.defaultToppings || [];
  return defaults.includes(toppingId) ? 0 : toppingPrice;
}
