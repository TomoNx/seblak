import React, { useState, useMemo } from 'react';
import { Order, Topping, Broth, PresetMenu } from '../../types';
import { SnackOrDrink, formatRupiah } from '../../data';
import { Plus, Minus, Trash2, X, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import EditOrderModal from './EditOrderModal';

interface EditOrderItemsModalProps {
  order: Order;
  toppings: Topping[];
  broths: Broth[];
  presets: PresetMenu[];
  snacksAndDrinks: SnackOrDrink[];
  onUpdateOrder: (order: Order) => void;
  onClose: () => void;
}

type MenuCategory = 'seblak' | 'snacks' | 'drinks';

export default function EditOrderItemsModal({
  order,
  toppings,
  broths,
  presets,
  snacksAndDrinks,
  onUpdateOrder,
  onClose
}: EditOrderItemsModalProps) {
  const [localItems, setLocalItems] = useState([...order.items]);
  const [customerName, setCustomerName] = useState(order.customerName);
  const [activeTab, setActiveTab] = useState<MenuCategory>('seblak');
  const [nestedEditItemIdx, setNestedEditItemIdx] = useState<number | null>(null);

  // Calculate total price based on local items
  const computedTotalPrice = useMemo(() => {
    return localItems.reduce((sum, item) => sum + item.pricePerUnit * item.quantity, 0);
  }, [localItems]);

  // Adjust item quantity
  const handleQtyChange = (idx: number, delta: number) => {
    setLocalItems(prev => {
      const updated = [...prev];
      const newQty = updated[idx].quantity + delta;
      if (newQty <= 0) {
        updated.splice(idx, 1);
      } else {
        updated[idx] = { ...updated[idx], quantity: newQty };
      }
      return updated;
    });
  };

  // Remove item
  const handleRemoveItem = (idx: number) => {
    setLocalItems(prev => prev.filter((_, i) => i !== idx));
  };

  // Add new item from the menu lists
  const handleAddItem = (menuItem: PresetMenu | SnackOrDrink, category: MenuCategory) => {
    if (category === 'seblak') {
      const preset = menuItem as PresetMenu;
      // Default toppings for preset seblak
      const toppingsMapped = preset.defaultToppings.map(tid => {
        const topDef = toppings.find(t => t.id === tid);
        const price = 0; // Default toppings are covered in preset base price
        return { name: topDef?.name || 'Topping', quantity: 1, price };
      });

      const newItem = {
        name: preset.name,
        type: 'preset' as const,
        brothName: 'Kuah Cikur Original (Juara)',
        level: preset.defaultLevel,
        toppings: toppingsMapped,
        pricePerUnit: preset.basePrice,
        quantity: 1,
        notes: ''
      };
      setLocalItems(prev => [...prev, newItem]);
    } else {
      const snackOrDrink = menuItem as SnackOrDrink;
      // Check if snack/drink already exists in the list to increment it
      const existingIdx = localItems.findIndex(it => it.name === snackOrDrink.name);
      if (existingIdx > -1) {
        handleQtyChange(existingIdx, 1);
      } else {
        const newItem = {
          name: snackOrDrink.name,
          type: snackOrDrink.category,
          pricePerUnit: snackOrDrink.price,
          quantity: 1,
          notes: ''
        };
        setLocalItems(prev => [...prev, newItem]);
      }
    }
  };

  // Save changes and close modal
  const handleSave = () => {
    if (!customerName.trim()) {
      alert('Nama pelanggan tidak boleh kosong!');
      return;
    }
    onUpdateOrder({
      ...order,
      customerName: customerName.trim(),
      items: localItems,
      totalPrice: computedTotalPrice
    });
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto font-sans"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-4xl w-full flex flex-col h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4.5 text-white flex justify-between items-center bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-600 to-amber-955">
          <div>
            <p className="text-[10px] text-amber-250 font-bold uppercase tracking-wider font-mono">Panel Kasir Utama</p>
            <h3 className="text-sm font-black uppercase tracking-wide">
              Kelola & Tambah Pesanan: Antrean #{order.queueNumber}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800/45 hover:bg-slate-800/80 flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden text-slate-800">
          {/* Left Side: Current Order items */}
          <div className="flex-1 p-5 border-b md:border-b-0 md:border-r border-slate-200 flex flex-col overflow-y-auto">
            <div className="mb-4">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-1.5">Nama Pelanggan</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold outline-none focus:border-amber-500 transition-colors"
                placeholder="Nama pelanggan..."
              />
            </div>

            <div className="flex-1 flex flex-col">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-2.5 flex items-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5 text-amber-600" />
                Rincian Item Belanja ({localItems.length})
              </h4>

              <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 min-h-[220px]">
                {localItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-4">
                    <p className="text-xs text-slate-400 italic font-semibold">Belum ada item di pesanan ini.</p>
                    <p className="text-[10px] text-slate-400 mt-1">Silakan tambahkan item baru dari menu sebelah kanan.</p>
                  </div>
                ) : (
                  localItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-50 p-3 rounded-xl border border-slate-200/75 flex justify-between items-center gap-3 transition-all hover:bg-slate-100/50"
                    >
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h5 className="font-extrabold text-xs uppercase text-slate-850 truncate">{item.name}</h5>
                          <span className={`text-[8.5px] font-black px-1.5 py-0.2 rounded font-mono uppercase ${
                            item.type === 'drink' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                            item.type === 'snack' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                            'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}>
                            {item.type}
                          </span>
                        </div>

                        {(item.type === 'custom' || item.type === 'preset') ? (
                          <div className="text-[9.5px] text-slate-500 space-y-0.5 font-medium leading-none">
                            <p>🌶️ Level: <span className="font-bold text-rose-600">{item.level}</span></p>
                            {item.toppings && item.toppings.length > 0 && (
                              <p className="truncate max-w-[200px]">
                                Topping: <span className="font-semibold">{item.toppings.map(t => `${t.name} (x${t.quantity})`).join(', ')}</span>
                              </p>
                            )}
                          </div>
                        ) : null}

                        <p className="text-[10.5px] font-mono font-bold text-amber-700">{formatRupiah(item.pricePerUnit * item.quantity)}</p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        {/* Customizer for Seblak */}
                        {(item.type === 'custom' || item.type === 'preset') && (
                          <button
                            type="button"
                            onClick={() => setNestedEditItemIdx(idx)}
                            className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-extrabold px-2.5 py-1.5 rounded-lg text-[10px] uppercase transition-colors"
                          >
                            Sesuaikan
                          </button>
                        )}

                        {/* Quantity controls */}
                        <div className="flex items-center bg-slate-200 border border-slate-300 rounded-lg p-0.5 select-none scale-90">
                          <button
                            type="button"
                            onClick={() => handleQtyChange(idx, -1)}
                            className="w-6 h-6 rounded-md hover:bg-white text-slate-750 flex items-center justify-center transition-colors font-bold"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-mono font-black text-slate-800 min-w-5 text-center">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleQtyChange(idx, 1)}
                            className="w-6 h-6 rounded-md hover:bg-white text-slate-850 flex items-center justify-center transition-colors font-bold"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Trash */}
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          className="text-slate-400 hover:text-red-500 p-1.5 transition-colors"
                          title="Hapus Item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Side: Menu Items to Add */}
          <div className="w-full md:w-[380px] p-5 flex flex-col overflow-y-auto">
            {/* Tabs */}
            <div className="flex bg-slate-100 rounded-xl p-1 border border-slate-200 mb-4 select-none">
              {(['seblak', 'snacks', 'drinks'] as const).map(cat => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  className={`flex-1 py-2 rounded-lg font-black uppercase text-[10px] tracking-wide transition-all ${
                    activeTab === cat 
                      ? 'bg-amber-500 text-slate-950 font-black shadow-sm' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {cat === 'seblak' ? '🍲 Seblak' : cat === 'snacks' ? '🍿 Jajanan' : '🥤 Minuman'}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto pr-0.5 space-y-2.5 max-h-[50vh] md:max-h-none">
              {activeTab === 'seblak' ? (
                presets.map(p => (
                  <div
                    key={p.id}
                    className="p-3 bg-white border border-slate-200 rounded-xl flex justify-between items-center hover:border-amber-300 hover:bg-amber-50/5 transition-all shadow-3xs"
                  >
                    <div className="min-w-0 pr-2">
                      <p className="font-extrabold text-slate-800 text-xs uppercase truncate">{p.name}</p>
                      <p className="text-[10px] font-mono font-bold text-amber-700 mt-0.5">{formatRupiah(p.basePrice)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAddItem(p, 'seblak')}
                      className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-2.5 py-1.5 rounded-lg text-[10.5px] uppercase transition-colors shrink-0 flex items-center gap-1 shadow-3xs"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[2.5]" /> Tambah
                    </button>
                  </div>
                ))
              ) : activeTab === 'snacks' ? (
                snacksAndDrinks.filter(it => it.category === 'snack').map(s => (
                  <div
                    key={s.id}
                    className="p-3 bg-white border border-slate-200 rounded-xl flex justify-between items-center hover:border-amber-300 hover:bg-amber-50/5 transition-all shadow-3xs"
                  >
                    <div className="min-w-0 pr-2">
                      <p className="font-extrabold text-slate-800 text-xs uppercase truncate">{s.name}</p>
                      <p className="text-[10px] font-mono font-bold text-amber-700 mt-0.5">{formatRupiah(s.price)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAddItem(s, 'snacks')}
                      className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-2.5 py-1.5 rounded-lg text-[10.5px] uppercase transition-colors shrink-0 flex items-center gap-1 shadow-3xs"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[2.5]" /> Tambah
                    </button>
                  </div>
                ))
              ) : (
                snacksAndDrinks.filter(it => it.category === 'drink').map(d => (
                  <div
                    key={d.id}
                    className="p-3 bg-white border border-slate-200 rounded-xl flex justify-between items-center hover:border-amber-300 hover:bg-amber-50/5 transition-all shadow-3xs"
                  >
                    <div className="min-w-0 pr-2">
                      <p className="font-extrabold text-slate-800 text-xs uppercase truncate">{d.name}</p>
                      <p className="text-[10px] font-mono font-bold text-amber-700 mt-0.5">{formatRupiah(d.price)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAddItem(d, 'drinks')}
                      className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-2.5 py-1.5 rounded-lg text-[10.5px] uppercase transition-colors shrink-0 flex items-center gap-1 shadow-3xs"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[2.5]" /> Tambah
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4.5 bg-slate-50 border-t border-slate-200 flex justify-between items-center shrink-0">
          <div className="flex gap-1.5 items-baseline">
            <span className="text-[10px] font-bold text-slate-450 uppercase">Total Tagihan Baru</span>
            <span className="text-base font-mono font-black text-red-650">{formatRupiah(computedTotalPrice)}</span>
          </div>

          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl border-2 border-slate-200 hover:bg-slate-100 text-slate-650 font-extrabold uppercase text-xs transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={localItems.length === 0}
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-slate-950 font-black shadow-md uppercase text-xs transition-colors cursor-pointer"
            >
              Simpan Perubahan
            </button>
          </div>
        </div>
      </motion.div>

      {/* Nested Single Item Editor (Toppings / Levels for Seblak) */}
      <AnimatePresence>
        {nestedEditItemIdx !== null && (
          <EditOrderModal
            order={{ ...order, items: localItems }}
            itemIdx={nestedEditItemIdx}
            toppings={toppings}
            broths={broths}
            presets={presets}
            onUpdateOrder={(tempOrder) => {
              setLocalItems(tempOrder.items);
              setNestedEditItemIdx(null);
            }}
            onClose={() => setNestedEditItemIdx(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
