export interface Topping {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  icon?: string;
  description?: string;
  isActive?: boolean; // undefined / true = aktif, false = non-aktif
}

export interface Broth {
  id: string;
  name: string;
  description: string;
  price: number;
}

export interface PresetMenu {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  defaultToppings: string[]; // Topping IDs
  defaultLevel: number;
  defaultBroth: string; // Broth ID
  image?: string;
  isPopular?: boolean;
}

export interface CartItem {
  id: string; // Unique ID for cart item session (since customers can customize multiple different seblak variants)
  name: string;
  type: 'custom' | 'preset' | 'snack' | 'drink';
  basePrice: number;
  broth?: Broth;
  level?: number;
  toppings?: { topping: Topping; quantity: number }[];
  quantity: number;
  notes: string;
}

export interface Order {
  id: string; // Format e.g., #SEB-1025
  queueNumber?: string; // Simple 2-digit number (e.g. 25, 26)
  customerName: string;
  items: {
    name: string;
    type: 'custom' | 'preset' | 'snack' | 'drink';
    brothName?: string;
    level?: number;
    toppings?: { name: string; quantity: number; price: number }[];
    pricePerUnit: number;
    quantity: number;
    notes: string;
  }[];
  totalPrice: number;
  paymentMethod: 'Tunai' | 'QRIS' | 'Debit' | null;
  status: 'draft' | 'pending_payment' | 'paid' | 'completed' | 'cancelled';
  createdAt: string;
  paidAt?: string;
  completedAt?: string;
  orderType?: 'dine_in' | 'take_away';
}

export interface SnackOrDrink {
  id: string;
  name: string;
  category: 'snack' | 'drink';
  price: number;
  description: string;
  image: string;
  isPopular?: boolean;
}

export interface ShopSettings {
  qrisImage: string;
  shopName: string;
  shopAddress?: string;
  shopPhone?: string;
  adminPin?: string;
}

export interface Category {
  id: string;
  name: string;
}
