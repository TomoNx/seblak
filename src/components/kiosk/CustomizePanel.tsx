import React, { useState, useMemo } from 'react';
import { CartItem, Broth, Topping, PresetMenu } from '../../types';
import { SPICE_LEVELS, formatRupiah } from '../../data';
import { getToppingEmoji } from './utils';
import { Flame, Check, Minus, Plus } from 'lucide-react';

interface CustomizePanelProps {
  customItem: Partial<CartItem>;
  setCustomItem: React.Dispatch<React.SetStateAction<Partial<CartItem>>>;
  broths: Broth[];
  toppings: Topping[];
  presets: PresetMenu[];
  onCancel: () => void;
  onAddToCart: () => void;
  currentItemTotalPrice: number;
}

export default function CustomizePanel({
  customItem,
  setCustomItem,
  broths,
  toppings,
  presets,
  onCancel,
  onAddToCart,
  currentItemTotalPrice
}: CustomizePanelProps) {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'karbo' | 'protein' | 'cuanki' | 'extra'>('all');

  const filteredToppings = useMemo(() => {
    // Hanya tampilkan topping yang aktif (isActive: true atau undefined = aktif)
    const activeToppings = toppings.filter(t => t.isActive !== false);
    if (selectedCategory === 'all') return activeToppings;
    return activeToppings.filter(t => t.category === selectedCategory);
  }, [selectedCategory, toppings]);

  const handleSelectBroth = (broth: Broth) => {
    setCustomItem(prev => ({ ...prev, broth }));
  };

  const handleSelectLevel = (level: number) => {
    setCustomItem(prev => ({ ...prev, level }));
  };

  const existingToppingQty = (toppingId: string) => {
    if (!customItem || !customItem.toppings) return 0;
    const found = customItem.toppings.find(t => t.topping.id === toppingId);
    return found ? found.quantity : 0;
  };

  const handleToppingQty = (topping: Topping, operation: 'inc' | 'dec') => {
    setCustomItem(prev => {
      const existingToppings = prev.toppings ? [...prev.toppings] : [];
      const foundIdx = existingToppings.findIndex(t => t.topping.id === topping.id);

      if (foundIdx > -1) {
        if (operation === 'inc') {
          existingToppings[foundIdx] = {
            ...existingToppings[foundIdx],
            quantity: existingToppings[foundIdx].quantity + 1
          };
        } else {
          const newQty = existingToppings[foundIdx].quantity - 1;
          if (newQty <= 0) {
            existingToppings.splice(foundIdx, 1);
          } else {
            existingToppings[foundIdx] = {
              ...existingToppings[foundIdx],
              quantity: newQty
            };
          }
        }
      } else if (operation === 'inc') {
        existingToppings.push({ topping, quantity: 1 });
      }

      return { ...prev, toppings: existingToppings };
    });
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-slate-100">
      <div className="flex-1 p-5 overflow-y-auto space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <button
            onClick={onCancel}
            className="text-xs text-slate-500 hover:text-slate-800 font-bold flex items-center gap-1 py-1"
          >
            ← Kembali ke Menu
          </button>
          <div className="text-right">
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Sedang Mengatur</p>
            <p className="text-xs font-black text-slate-800 uppercase">{customItem.name}</p>
          </div>
        </div>



        <div className="space-y-3 bg-white p-5 rounded-2xl border border-slate-200/60 shadow-md">
          <h3 className="text-xs font-black text-slate-800 tracking-wider uppercase flex items-center gap-1.5 border-b border-slate-100 pb-2">
            <span className="w-1.5 h-3.5 bg-red-600 rounded-full"></span>
            1. Atur Tingkat Kepedasan (Level)
          </h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 pt-1">
            {SPICE_LEVELS.map((sl) => {
              const isActive = customItem.level === sl.level;
              let activeBorderClass = '';
              if (isActive) {
                if (sl.level === 0) {
                  activeBorderClass = 'border-green-600 bg-green-50/50 text-green-950 ring-4 ring-green-100/70 font-extrabold shadow-sm scale-102';
                } else if (sl.level <= 2) {
                  activeBorderClass = 'border-amber-500 bg-amber-50/50 text-amber-950 ring-4 ring-amber-100/70 font-extrabold shadow-sm scale-102';
                } else if (sl.level <= 4) {
                  activeBorderClass = 'border-orange-500 bg-orange-50/50 text-orange-950 ring-4 ring-orange-100/70 font-extrabold shadow-sm scale-102';
                } else {
                  activeBorderClass = 'border-red-605 bg-red-50/50 text-red-955 ring-4 ring-red-100/70 font-extrabold shadow-sm scale-102';
                }
              } else {
                activeBorderClass = 'border-slate-200 bg-white text-slate-800 hover:border-slate-350 hover:bg-slate-50 font-medium';
              }

              return (
                <button
                  key={sl.level}
                  onClick={() => handleSelectLevel(sl.level)}
                  type="button"
                  className={`py-4 px-2 rounded-xl border-2 text-center flex flex-col items-center justify-center cursor-pointer transition-all ${activeBorderClass}`}
                >
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: Math.max(1, sl.level) }).map((_, i) => (
                      <Flame 
                        key={i} 
                        className={`w-3.5 h-3.5 ${
                          sl.level === 0 ? 'text-slate-400' :
                          sl.level === 1 ? 'text-green-600 fill-green-400' :
                          sl.level === 2 ? 'text-yellow-600 fill-yellow-400' :
                          sl.level === 3 ? 'text-orange-500 fill-orange-400' :
                          'text-red-605 fill-red-500'
                        }`} 
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold font-mono text-slate-800 mt-1">LVL {sl.level}</span>
                  <span className="text-[8px] text-slate-500 mt-0.5 truncate max-w-[80px] font-bold">{sl.level === 0 ? 'Polos' : sl.level === 5 ? 'Neraka!' : 'Pedas'}</span>
                </button>
              );
            })}
          </div>

          <div className="bg-red-50/50 p-2.5 rounded-lg border border-red-100/50 flex items-start gap-2">
            <Flame className="w-4 h-4 text-red-500 fill-red-400 shrink-0 mt-0.5" />
            <p className="text-[10px] text-red-800 font-medium leading-relaxed">
              <span className="font-bold">Info Rasa: </span>
              {SPICE_LEVELS.find(sl => sl.level === customItem.level)?.desc}
            </p>
          </div>
        </div>

        <div className="space-y-4 bg-white p-5 rounded-2xl border border-slate-200/60 shadow-md">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-3 border-b border-slate-150 pb-4">
            <div>
              <h3 className="text-sm font-black text-slate-800 tracking-wider uppercase flex items-center gap-2">
                 <span className="w-2 h-4 bg-emerald-500 rounded-full"></span>
                2. Tambah & Atur Topping Seblak pilihanmu
              </h3>
              <p className="text-[11px] text-slate-450 mt-1 font-medium">
                {customItem.type === 'custom' 
                  ? 'Rakit seblakmu secara bebas! Direkomendasikan pilih minimal 3 topping.' 
                  : 'Paket standar sudah termasuk topping bawaan. Silakan tambahkan topping ekstra!'}
              </p>
            </div>
            
            <div className="flex flex-wrap gap-1 bg-slate-100 border border-slate-200 rounded-xl p-1 text-[11px] font-black uppercase self-start">
              {(['all', 'karbo', 'protein', 'cuanki', 'extra'] as const).map(cat => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    selectedCategory === cat 
                      ? 'bg-amber-500 text-slate-950 font-black shadow-sm' 
                      : 'text-slate-600 hover:text-slate-800 hover:bg-slate-200/55'
                  }`}
                >
                  {cat === 'all' ? '✨ Semua' : cat === 'karbo' ? '🍜 Karbo' : cat === 'protein' ? '🥩 Protein' : cat === 'cuanki' ? '🍘 Keringan' : '🥬 Sayur'}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[390px] overflow-y-auto pr-1">
            {filteredToppings.map((topping) => {
              const activeQty = existingToppingQty(topping.id);
              const isPreset = customItem.type === 'preset';
              const originalPresetDef = presets.find(p => p.name === customItem.name);
              const isDefaultCovered = originalPresetDef?.defaultToppings.includes(topping.id) ?? false;
              const emoji = getToppingEmoji(topping.id, topping.category);

              return (
                <div
                  key={topping.id}
                  className={`p-3.5 rounded-xl border-2 text-left flex items-center gap-3 transition-all relative ${
                    activeQty > 0 
                      ? 'border-emerald-500 bg-emerald-55/65 shadow-[0_0_12px_rgba(16,185,129,0.06)] ring-2 ring-emerald-100 font-bold' 
                      : 'border-slate-200 bg-white hover:border-amber-400 hover:shadow-xs'
                  }`}
                >
                  <div className={`w-11 h-11 shrink-0 rounded-xl flex items-center justify-center text-xl shadow-xs transition-colors ${
                    activeQty > 0 ? 'bg-emerald-100 text-emerald-850 font-bold' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {emoji}
                  </div>

                  <div className="flex-1 min-w-0 pr-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-extrabold text-slate-800 uppercase truncate">
                        {topping.name}
                      </span>
                      {isPreset && isDefaultCovered && (
                        <span className="text-[8px] bg-sky-100 text-sky-850 px-1.5 py-0.5 rounded-md font-black shrink-0 uppercase tracking-wider">
                          Paket
                        </span>
                      )}
                      {topping.stock <= 5 && (
                        <span className="text-[8px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded-md font-black shrink-0 uppercase tracking-wider">
                          Sisa {topping.stock}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex flex-col mt-0.5">
                      <span className="text-xs font-mono font-black text-amber-700">
                        {formatRupiah(topping.price)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center bg-slate-200/60 border border-slate-350/50 rounded-lg p-0.5 select-none shrink-0 shadow-3xs scale-102">
                    {activeQty > 0 && (
                      <button
                        type="button"
                        onClick={() => handleToppingQty(topping, 'dec')}
                        className="w-6.5 h-6.5 rounded-md hover:bg-slate-100 text-slate-750 flex items-center justify-center transition-all cursor-pointer font-bold"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                    )}
                    
                    {activeQty > 0 ? (
                      <span className="text-xs font-mono font-black text-slate-850 min-w-5.5 text-center">
                        {activeQty}
                      </span>
                    ) : (
                      <span className="text-[9.5px] text-slate-600 px-1.5 font-extrabold">PILIH</span>
                    )}

                    <button
                      type="button"
                      onClick={() => handleToppingQty(topping, 'inc')}
                      className={`w-6.5 h-6.5 rounded-md flex items-center justify-center transition-all cursor-pointer ${
                        activeQty > 0 
                          ? 'bg-emerald-600 text-white hover:bg-emerald-700 font-extrabold' 
                          : 'hover:bg-amber-100 text-slate-755'
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


      </div>

      <div className="w-full md:w-[380px] bg-white border-t md:border-t-0 md:border-l border-slate-200 flex flex-col shrink-0 text-slate-800 p-5 shadow-2xl relative z-10">
        <h2 className="font-extrabold text-slate-800 tracking-wide text-xs uppercase pb-3 border-b border-slate-200 flex items-center gap-1.5">
          Review Rakitan Seblak
        </h2>

        <div className="flex-1 overflow-y-auto py-3 space-y-4">
          <div className="space-y-2 text-slate-700 text-xs">
            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-2">
              <p className="font-black text-slate-800 uppercase tracking-wide text-xs">{customItem.name}</p>
              
              <div className="text-[11px] space-y-1.5 pt-1 text-slate-500">
                <div>
                  <span className="font-bold text-slate-600">🌶️ Tingkat Kepedasan:</span>
                  <p className="font-bold text-rose-600">Level {customItem.level}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Topping Terpilih ({customItem.toppings?.length || 0})</p>
            
            {(!customItem.toppings || customItem.toppings.length === 0) ? (
              <p className="text-[10px] text-slate-400 italic bg-amber-50/50 p-2.5 rounded text-center">Belum ada topping dipilih.</p>
            ) : (
              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-lg space-y-2 max-h-[320px] overflow-y-auto">
                {customItem.toppings.map((t) => {
                  const originalPreset = presets.find(p => p.name === customItem.name);
                  const isPreset = customItem.type === 'preset';
                  const isDef = isPreset && (originalPreset?.defaultToppings.includes(t.topping.id) ?? false);
                  const displayPrice = isDef ? 'Termasuk' : formatRupiah(t.topping.price);
                  
                  return (
                    <div key={t.topping.id} className="flex justify-between items-center text-[10.5px] border-b border-slate-200/40 pb-1.5 last:border-0 last:pb-0 font-medium">
                      <span className="text-slate-700">{t.quantity}x {t.topping.name}</span>
                      <span className="font-mono text-slate-500">{displayPrice}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="space-y-2 bg-slate-50 border border-slate-200 p-3 rounded-lg">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider text-center">Porsi (Berapa Mangkuk?)</p>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setCustomItem(prev => ({ ...prev, quantity: Math.max(1, (prev.quantity || 1) - 1) }))}
                className="w-8 h-8 rounded-full border border-slate-300 hover:bg-slate-200 font-black flex items-center justify-center text-slate-600 text-sm bg-white shadow-sm"
              >
                -
              </button>
              <span className="text-base font-mono font-black text-slate-800 w-8 text-center">{customItem.quantity || 1}</span>
              <button
                onClick={() => setCustomItem(prev => ({ ...prev, quantity: (prev.quantity || 1) + 1 }))}
                className="w-8 h-8 rounded-full border border-slate-300 hover:bg-slate-200 font-black flex items-center justify-center text-slate-600 text-sm bg-white shadow-sm"
              >
                +
              </button>
            </div>
          </div>

        </div>

        <div className="border-t border-slate-200 pt-4 space-y-3.5 bg-white shrink-0">
          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
              📝 Catatan Khusus untuk Koki (Opsional)
            </label>
            <input
              type="text"
              placeholder="Cth: telur ceplok, kuah banyak, tanpa pakcoy..."
              value={customItem.notes || ''}
              onChange={(e) => setCustomItem(prev => ({ ...prev, notes: e.target.value }))}
              className="w-full bg-slate-50 text-xs text-slate-800 pl-3 pr-3 py-2.5 rounded-lg border border-slate-200 outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-lg border border-slate-100">
            <span className="text-xs text-slate-500 font-semibold">Harga Rakitan</span>
            <span className="text-sm font-mono font-black text-amber-700">{formatRupiah(currentItemTotalPrice)}</span>
          </div>

          <div className="flex gap-2.5">
            <button
              onClick={onCancel}
              className="flex-1 border-2 border-slate-200 hover:border-slate-300 text-slate-600 font-bold py-3 px-1 rounded-xl text-xs uppercase"
            >
              Batal
            </button>
            
            <button
              onClick={onAddToCart}
              className="flex-2 bg-red-600 hover:bg-red-700 text-white font-black py-3 px-1 rounded-xl shadow transition-colors text-xs uppercase text-center"
            >
              Masukkan Keranjang
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
