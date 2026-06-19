import React, { useState, useEffect } from 'react';
import { Order, Topping, Broth, PresetMenu } from '../../types';
import { Flame, Minus, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatRupiah } from '../../data';
import { calculateItemUnitPrice, getToppingDisplayPrice } from '../../utils/priceCalculator';

interface EditOrderModalProps {
  order: Order;
  itemIdx: number;
  toppings: Topping[];
  broths: Broth[];
  presets: PresetMenu[];
  onUpdateOrder: (order: Order) => void;
  onClose: () => void;
}

export default function EditOrderModal({
  order,
  itemIdx,
  toppings,
  broths,
  presets,
  onUpdateOrder,
  onClose
}: EditOrderModalProps) {
  const item = order.items[itemIdx];
  const [editItemLevel, setEditItemLevel] = useState<number>(item.level ?? 2);
  const [editItemBroth, setEditItemBroth] = useState<string>(item.brothName || '');
  const [editItemNotes, setEditItemNotes] = useState<string>(item.notes || '');
  const [editToppingMap, setEditToppingMap] = useState<Record<string, number>>({});

  useEffect(() => {
    const map: Record<string, number> = {};
    if (item.toppings) {
      item.toppings.forEach(t => {
        map[t.name] = t.quantity;
      });
    }
    setEditToppingMap(map);
    setEditItemLevel(item.level ?? 2);
    setEditItemBroth(item.brothName || '');
    setEditItemNotes(item.notes || '');
  }, [item]);

  const handleSaveEditedToppings = () => {
    const updatedItems = [...order.items];
    const itemToUpdate = { ...updatedItems[itemIdx] };

    // 1. Build the updated toppings list using ToppingEntry and mapping to simple Order item topping format
    const toppingsEntries = Object.entries(editToppingMap)
      .map(([name, qty]) => {
        const topDef = toppings.find(def => def.name === name);
        if (!topDef) return null;
        return { topping: topDef, quantity: Number(qty) };
      })
      .filter((t): t is { topping: Topping; quantity: number } => t !== null && t.quantity > 0);

    const originalPreset = presets.find(p => p.name === itemToUpdate.name);

    const updatedToppings = toppingsEntries.map(t => {
      const displayPrice = getToppingDisplayPrice(
        t.topping.id,
        t.topping.price,
        itemToUpdate.type as 'custom' | 'preset',
        originalPreset
      );
      return { name: t.topping.name, quantity: t.quantity, price: displayPrice };
    });

    // 2. Recalculate price per unit of the edited item
    let calculatedUnitPrice = 0;
    if (itemToUpdate.type === 'custom' || itemToUpdate.type === 'preset') {
      const brothObj = broths.find(b => b.name === editItemBroth);
      calculatedUnitPrice = calculateItemUnitPrice(
        itemToUpdate.type,
        itemToUpdate.type === 'custom' ? 6000 : (originalPreset?.basePrice || 0),
        brothObj,
        toppingsEntries,
        originalPreset
      );
    } else {
      calculatedUnitPrice = itemToUpdate.pricePerUnit;
    }

    itemToUpdate.toppings = updatedToppings;
    itemToUpdate.level = editItemLevel;
    itemToUpdate.brothName = editItemBroth;
    itemToUpdate.notes = editItemNotes;
    itemToUpdate.pricePerUnit = calculatedUnitPrice;

    updatedItems[itemIdx] = itemToUpdate;

    const newTotalPrice = updatedItems.reduce((sum, it) => sum + (it.pricePerUnit * it.quantity), 0);

    const updatedOrder: Order = {
      ...order,
      items: updatedItems,
      totalPrice: newTotalPrice
    };

    onUpdateOrder(updatedOrder);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full flex flex-col max-h-[90vh] overflow-hidden"
      >
        <div className="bg-slate-900 px-6 py-4.5 text-white flex justify-between items-center bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-600 to-amber-950">
          <div>
            <p className="text-[10px] text-amber-200 font-bold uppercase tracking-wider">MODUL KASIR MANDIRI</p>
            <h3 className="text-sm font-black uppercase tracking-wide">
              Ubah Topping & Level: {order.customerName}
            </h3>
            <p className="text-[10.5px] text-slate-200/90 mt-0.5">
              Menu: <span className="font-extrabold text-white">{item.name}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800/45 hover:bg-slate-800/80 flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">

          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">1. Tingkat Kepedasan</h4>
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {Array.from({ length: 6 }).map((_, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setEditItemLevel(idx)}
                  className={`flex-1 min-w-[75px] p-2.5 rounded-xl border-2 flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer ${
                    editItemLevel === idx
                      ? 'border-red-500 bg-red-50 text-red-950 font-extrabold shadow-sm ring-1 ring-red-500/30'
                      : 'border-slate-200 bg-slate-100/70 text-slate-800 hover:border-red-300 hover:bg-red-50/20'
                  }`}
                >
                  <div className="flex gap-px">
                    {Array.from({ length: idx }).map((_, i) => (
                      <Flame key={i} className="w-2.5 h-2.5 text-red-650 fill-red-500" />
                    ))}
                    {idx === 0 && <span className="text-[10px] font-bold">🍃</span>}
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider">Level {idx}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">2. Atur Topping Seblak</h4>
              <button
                type="button"
                onClick={() => setEditToppingMap({})}
                className="text-[9.5px] font-black uppercase text-red-600 hover:text-red-800 cursor-pointer bg-red-50 hover:bg-red-100 px-2 py-1 rounded transition-colors"
              >
                Clear All Topping
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1 border border-slate-200 rounded-xl p-3 bg-slate-100/40">
              {toppings.map((t) => {
                const qty = editToppingMap[t.name] || 0;
                return (
                  <div 
                    key={t.id} 
                    className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-colors ${
                      qty > 0 
                        ? 'border-emerald-500 bg-emerald-50/70 shadow-sm ring-1 ring-emerald-550/20' 
                        : 'border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100 hover:border-slate-350'
                    }`}
                  >
                    <div className="min-w-0 pr-1 select-none">
                      <p className="font-extrabold text-slate-800 capitalize truncate">{t.name}</p>
                      <p className="text-[10px] font-mono text-slate-500 font-bold">{formatRupiah(t.price)}</p>
                    </div>

                    <div className="flex items-center gap-1.5 select-none shrink-0 bg-slate-200/50 border border-slate-300 rounded-lg p-0.5 scale-90">
                      {qty > 0 && (
                        <button
                          type="button"
                          onClick={() => setEditToppingMap(prev => {
                            const newMap = { ...prev };
                            if (newMap[t.name] <= 1) {
                              delete newMap[t.name];
                            } else {
                              newMap[t.name] -= 1;
                            }
                            return newMap;
                          })}
                          className="w-5.5 h-5.5 rounded-md hover:bg-slate-100 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <span className="text-[11px] font-mono font-black text-slate-800 min-w-[14px] text-center">
                        {qty}
                      </span>

                      <button
                        type="button"
                        onClick={() => setEditToppingMap(prev => ({
                          ...prev,
                          [t.name]: (prev[t.name] || 0) + 1
                        }))}
                        className={`w-5.5 h-5.5 rounded-md flex items-center justify-center transition-colors cursor-pointer ${
                          qty > 0 ? 'bg-emerald-600 text-white font-black hover:bg-emerald-700' : 'hover:bg-slate-300 text-slate-800'
                        }`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-1 pt-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Catatan Khusus (Opsional)</label>
            <textarea
              rows={2}
              value={editItemNotes}
              onChange={(e) => setEditItemNotes(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium outline-none focus:border-amber-500 shadow-sm"
              placeholder="Contoh: Jangan pakai daun bawang ya..."
            />
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl border-2 border-slate-200 hover:bg-slate-100 text-slate-600 font-extrabold uppercase text-xs transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSaveEditedToppings}
            className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black shadow-md uppercase text-xs transition-colors cursor-pointer"
          >
            Simpan Perubahan
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
