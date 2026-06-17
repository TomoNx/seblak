import React from 'react';
import { CartItem, PresetMenu } from '../../types';
import { formatRupiah } from '../../data';
import { ShoppingBasket, Trash2, User, AlertTriangle, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { calculateItemUnitPrice } from '../../utils/priceCalculator';

interface CartSidebarProps {
  cart: CartItem[];
  presets: PresetMenu[];
  customerName: string;
  setCustomerName: (name: string) => void;
  nameError: boolean;
  setNameError: (err: boolean) => void;
  cartTotalPrice: number;
  handleRemoveFromCart: (id: string) => void;
  handleCheckout: () => void;
}

export default function CartSidebar({
  cart,
  presets,
  customerName,
  setCustomerName,
  nameError,
  setNameError,
  cartTotalPrice,
  handleRemoveFromCart,
  handleCheckout
}: CartSidebarProps) {
  return (
    <div className="w-full md:w-80 bg-white border-t md:border-t-0 md:border-l border-slate-200 flex flex-col shrink-0 text-slate-800 p-4 shadow-2xl relative z-10">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
        <ShoppingBasket className="w-5 h-5 text-amber-600" />
        <h2 className="font-extrabold text-slate-800 tracking-wide text-sm">KERANJANG BELANJA ({cart.length})</h2>
      </div>

      <div className="flex-1 overflow-y-auto py-3 space-y-3 min-h-[140px] md:min-h-0">
        {cart.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4">
            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 border border-slate-100 mb-2">
              <ShoppingBasket className="w-5 h-5" />
            </div>
            <p className="text-xs text-slate-400 font-bold">Keranjang masih kosong</p>
          </div>
        ) : (
          <AnimatePresence>
            {cart.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-slate-50 p-3 rounded-lg border border-slate-200/80 hover:border-slate-300 transition-colors"
              >
                <div className="flex justify-between items-start gap-2">
                  <h4 className="font-bold text-xs uppercase text-slate-800 leading-snug">{item.name}</h4>
                  <button
                    onClick={() => handleRemoveFromCart(item.id)}
                    className="text-slate-400 hover:text-red-500 p-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                
                {(item.type === 'snack' || item.type === 'drink') ? (
                  <div className="text-[10px] text-slate-500 mt-1 space-y-0.5 border-l-2 border-emerald-400/45 pl-2">
                    <span className="text-emerald-700 font-extrabold text-[9px] bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 uppercase">
                      {item.type === 'drink' ? '🥤 Minuman' : '🍿 Cemilan'}
                    </span>
                    {item.notes && <p className="italic text-rose-500 text-[9px] truncate">"{item.notes}"</p>}
                  </div>
                ) : (
                  <div className="text-[10px] text-slate-500 mt-1 space-y-1.5 border-l-2 border-amber-400/40 pl-2">
                    <p>Pedas: <span className="font-bold text-rose-600">Level {item.level}</span></p>
                    <div className="space-y-1">
                      <span className="font-bold text-slate-400 block text-[9px] uppercase tracking-wider">Toppings Pilihan:</span>
                      <div className="flex flex-wrap gap-1">
                        {(item.toppings || []).length === 0 ? (
                          <span className="text-slate-400 italic text-[9px]">Tanpa topping ekstra</span>
                        ) : (
                          (item.toppings || []).map((t, idx) => (
                            <span key={idx} className="bg-amber-500/10 border border-amber-600/20 text-amber-800 font-extrabold px-1.5 py-0.5 rounded-md uppercase text-[8.5px] tracking-wide inline-block">
                              {t.topping.name} (x{t.quantity})
                            </span>
                          ))
                        )}
                      </div>
                    </div>
                    {item.notes && <p className="italic text-rose-550 text-[9.5px]">"* {item.notes}"</p>}
                  </div>
                )}

                <div className="mt-2.5 pt-2 border-t border-slate-200 flex justify-between items-center">
                  <span className="text-[10px] text-slate-400 font-mono">Jumlah: {item.quantity}x</span>
                  <span className="text-xs font-mono font-bold text-amber-700">
                    {formatRupiah(
                      (item.type === 'snack' || item.type === 'drink')
                        ? item.basePrice * item.quantity
                        : calculateItemUnitPrice(
                            item.type as 'custom' | 'preset',
                            item.basePrice,
                            item.broth,
                            item.toppings || [],
                            presets.find(p => p.name === item.name)
                          ) * item.quantity
                    )}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      <div className="border-t border-slate-200 pt-3 space-y-3.5 shrink-0 bg-white">
        <div className="space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Nama Pemesan</span>
          <div className="relative">
            <User className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Nama Anda..."
              value={customerName}
              onChange={(e) => {
                setCustomerName(e.target.value);
                if (e.target.value.trim()) setNameError(false);
              }}
              className={`w-full bg-slate-50 font-medium pl-8 pr-3 py-2 text-xs rounded border transition-colors outline-none text-slate-800 ${
                nameError ? 'border-red-500 focus:border-red-500 bg-red-50/20' : 'border-slate-200 focus:border-amber-500'
              }`}
            />
          </div>
        </div>

        {nameError && (
          <p className="text-[9px] text-red-500 font-medium flex items-center gap-1 mt-0.5 animate-bounce">
            <AlertTriangle className="w-2.5 h-2.5" /> Nama pemesan wajib diisi!
          </p>
        )}

        <div className="flex justify-between items-center text-xs pt-1">
          <span className="text-slate-500 font-semibold">Total Pembayaran</span>
          <span className="text-base font-mono font-black text-red-600">{formatRupiah(cartTotalPrice)}</span>
        </div>

        <button
          onClick={handleCheckout}
          disabled={cart.length === 0}
          className="w-full bg-red-600 hover:bg-red-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-black py-3 rounded-xl shadow-md transition-all duration-150 flex items-center justify-center gap-1.5 uppercase text-xs tracking-wider"
        >
          Selesai & Cetak Struk
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
