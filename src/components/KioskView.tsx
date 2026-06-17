import React, { useState, useMemo } from 'react';
import { CartItem, Topping, Broth, PresetMenu, Order } from '../types';
import { TOPPINGS, BROTHS, PRESETS, SNACKS_AND_DRINKS, SnackOrDrink } from '../data';
import { Flame } from 'lucide-react';
import { calculateItemUnitPrice, calculateCartTotal, getToppingDisplayPrice } from '../utils/priceCalculator';

import MenuGrid from './kiosk/MenuGrid';
import CartSidebar from './kiosk/CartSidebar';
import CustomizePanel from './kiosk/CustomizePanel';
import CheckoutSuccessPanel from './kiosk/CheckoutSuccessPanel';

interface KioskViewProps {
  onAddOrder: (order: Partial<Order>) => Promise<Order>;
  onScanQR?: (orderId: string) => void;
  toppings?: Topping[];
  broths?: Broth[];
  presets?: PresetMenu[];
  snacksAndDrinks?: SnackOrDrink[];
  toppingCategories?: Array<{ id: string; name: string }>;
  menuCategories?: Array<{ id: string; name: string }>;
  settings?: { shopName: string; shopAddress?: string; shopPhone?: string; qrisImage?: string };
}

export default function KioskView({ 
  onAddOrder,
  onScanQR,
  toppings = TOPPINGS,
  broths = BROTHS,
  presets = PRESETS,
  snacksAndDrinks = SNACKS_AND_DRINKS,
  toppingCategories = [],
  menuCategories = [],
  settings = { shopName: 'SEBLAK COZY CO.' }
}: KioskViewProps) {
  const [step, setStep] = useState<'menu' | 'customize' | 'checkout_success'>('menu');
  
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);
  const [customItem, setCustomItem] = useState<Partial<CartItem>>({
    id: '', name: 'Seblak Custom Kreasimu', type: 'custom', basePrice: 6000,
    broth: broths[0] || BROTHS[0], level: 2, toppings: [], quantity: 1, notes: ''
  });

  const [cart, setCart] = useState<CartItem[]>([]);
  
  const [customerName, setCustomerName] = useState<string>('');
  const [nameError, setNameError] = useState<boolean>(false);

  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const [kioskCategory, setKioskCategory] = useState<'seblak' | 'snacks' | 'drinks'>('seblak');

  const startCustomSeblak = () => {
    setIsCustomMode(true);
    setCustomItem({
      id: Math.random().toString(36).substring(2, 9),
      name: 'Seblak Kreasimu (Custom)',
      type: 'custom',
      basePrice: 6000,
      broth: broths[0] || BROTHS[0],
      level: 2,
      toppings: [],
      quantity: 1,
      notes: ''
    });
    setStep('customize');
  };

  const startPresetSeblak = (preset: PresetMenu) => {
    setIsCustomMode(false);
    
    const populatedToppings = preset.defaultToppings.map(tid => {
      const toppingDef = toppings.find(t => t.id === tid);
      return {
        topping: toppingDef || { id: tid, name: 'Topping', category: 'karbo' as const, price: 0, stock: 10 },
        quantity: 1
      };
    });

    const defaultBrothObj = broths.find(b => b.id === preset.defaultBroth) || broths[0] || BROTHS[0];

    setCustomItem({
      id: Math.random().toString(36).substring(2, 9),
      name: preset.name,
      type: 'preset',
      basePrice: preset.basePrice,
      broth: defaultBrothObj,
      level: preset.defaultLevel,
      toppings: populatedToppings,
      quantity: 1,
      notes: ''
    });
    setStep('customize');
  };

  const currentItemTotalPrice = useMemo(() => {
    if (!customItem) return 0;
    const unitPrice = calculateItemUnitPrice(
      customItem.type as 'custom' | 'preset',
      customItem.basePrice || 0,
      customItem.broth,
      customItem.toppings || [],
      presets.find(p => p.name === customItem.name)
    );
    return unitPrice * (customItem.quantity || 1);
  }, [customItem, presets]);

  const handleAddToCart = () => {
    if (customItem.type === 'custom' && (!customItem.toppings || customItem.toppings.length < 2)) {
      alert('⚠️ Seblak kreasimu kurang lengkap! Pilih minimal 2 jenis topping agar rasa seblak makin maknyus.');
      return;
    }

    const itemToSubmit: CartItem = {
      id: customItem.id || Math.random().toString(36).substring(2, 9),
      name: customItem.name || 'Seblak Custom',
      type: customItem.type as 'custom' | 'preset',
      basePrice: customItem.basePrice || 6000,
      broth: customItem.broth as Broth,
      level: customItem.level ?? 2,
      toppings: customItem.toppings || [],
      quantity: customItem.quantity || 1,
      notes: customItem.notes || ''
    };

    setCart(prev => [...prev, itemToSubmit]);
    setStep('menu');
  };

  const handleRemoveFromCart = (cartId: string) => {
    setCart(prev => prev.filter(item => item.id !== cartId));
  };

  const handleAddSnackOrDrink = (item: { name: string; price: number; category: 'snack' | 'drink' }) => {
    const existing = cart.find(it => it.name === item.name);
    if (existing) {
      setCart(prev => prev.map(it => {
        if (it.name === item.name) {
          return { ...it, quantity: it.quantity + 1 };
        }
        return it;
      }));
    } else {
      setCart(prev => [...prev, {
        id: Math.random().toString(36).substring(2, 9),
        name: item.name,
        type: item.category,
        basePrice: item.price,
        quantity: 1,
        notes: ''
      }]);
    }
  };

  const handleDecrementSnackOrDrink = (itemName: string) => {
    const existing = cart.find(it => it.name === itemName);
    if (!existing) return;
    if (existing.quantity === 1) {
      setCart(prev => prev.filter(it => it.name !== itemName));
    } else {
      setCart(prev => prev.map(it => {
        if (it.name === itemName) {
          return { ...it, quantity: it.quantity - 1 };
        }
        return it;
      }));
    }
  };

  const cartTotalPrice = useMemo(() => {
    return calculateCartTotal(cart, presets);
  }, [cart, presets]);

  const handleCheckout = async () => {
    if (!customerName.trim()) {
      setNameError(true);
      return;
    }
    setNameError(false);

    const orderItems = cart.map(c => {
      if (c.type === 'snack' || c.type === 'drink') {
        return {
          name: c.name,
          type: c.type,
          quantity: c.quantity,
          notes: c.notes
        };
      }

      return {
        name: c.name,
        type: c.type,
        broth: c.broth,
        level: c.level,
        toppings: c.toppings?.map(t => ({
          topping: { id: t.topping.id, name: t.topping.name, price: t.topping.price },
          quantity: t.quantity
        })),
        quantity: c.quantity,
        notes: c.notes
      };
    });

    const newOrder: Partial<Order> = {
      customerName: customerName.trim(),
      items: orderItems as any
    };

    try {
      const savedOrder = await onAddOrder(newOrder);
      setCompletedOrder(savedOrder);
      setCart([]);
      setCustomerName('');
      setStep('checkout_success');
    } catch (err) {
      console.error("Gagal melakukan checkout:", err);
      alert("Gagal memproses pesanan ke server. Silakan coba lagi.");
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden relative">
      <div className="bg-gradient-to-r from-red-700 via-orange-600 to-amber-600 px-6 py-4 text-white shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white/10 p-2.5 rounded-xl border border-white/20 select-none">
            <Flame className="w-7 h-7 text-yellow-300 animate-pulse fill-yellow-400" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight">SEBLAK JEBRED</h1>
            <p className="text-xs text-orange-100 font-medium">Self-Service Ordering Kiosk • Pedasnya Poll Seuhahnya Mantap!</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs bg-black/20 px-3 py-1.5 rounded-full border border-white/10">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-mono text-[11px] font-semibold text-white">KIOSK-01 ACTIVE</span>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
        {step === 'menu' && (
          <>
            <MenuGrid
              kioskCategory={kioskCategory} setKioskCategory={setKioskCategory}
              presets={presets} toppings={toppings} snacksAndDrinks={snacksAndDrinks}
              cart={cart} startCustomSeblak={startCustomSeblak}
              startPresetSeblak={startPresetSeblak} handleAddSnackOrDrink={handleAddSnackOrDrink}
              handleDecrementSnackOrDrink={handleDecrementSnackOrDrink}
            />
            <CartSidebar
              cart={cart} presets={presets} customerName={customerName} setCustomerName={setCustomerName}
              nameError={nameError} setNameError={setNameError} cartTotalPrice={cartTotalPrice}
              handleRemoveFromCart={handleRemoveFromCart} handleCheckout={handleCheckout}
            />
          </>
        )}

        {step === 'customize' && customItem && (
          <CustomizePanel
            customItem={customItem} setCustomItem={setCustomItem}
            broths={broths} toppings={toppings} presets={presets}
            onCancel={() => setStep('menu')} onAddToCart={handleAddToCart}
            currentItemTotalPrice={currentItemTotalPrice}
          />
        )}

        {step === 'checkout_success' && completedOrder && (
          <CheckoutSuccessPanel
            completedOrder={completedOrder} onScanQR={onScanQR}
            onReset={() => { setCompletedOrder(null); setStep('menu'); }}
          />
        )}
      </div>
    </div>
  );
}
