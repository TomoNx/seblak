export interface Topping {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
}

export interface Broth {
  id: string;
  name: string;
  price: number;
}

export interface PresetMenu {
  id: string;
  name: string;
  basePrice: number;
  defaultToppings: string[];
}

export interface ToppingEntry {
  topping: Topping;
  quantity: number;
}

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
