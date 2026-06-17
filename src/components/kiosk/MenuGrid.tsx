import React from 'react';
import { PresetMenu, Topping, CartItem } from '../../types';
import { SnackOrDrink, formatRupiah } from '../../data';
import { Flame, Sparkles, ChevronRight, ClipboardList, Plus, Minus } from 'lucide-react';

interface MenuGridProps {
  kioskCategory: 'seblak' | 'snacks' | 'drinks';
  setKioskCategory: (cat: 'seblak' | 'snacks' | 'drinks') => void;
  presets: PresetMenu[];
  toppings: Topping[];
  snacksAndDrinks: SnackOrDrink[];
  cart: CartItem[];
  startCustomSeblak: () => void;
  startPresetSeblak: (p: PresetMenu) => void;
  handleAddSnackOrDrink: (item: { name: string; price: number; category: 'snack' | 'drink' }) => void;
  handleDecrementSnackOrDrink: (name: string) => void;
}

export default function MenuGrid({
  kioskCategory,
  setKioskCategory,
  presets,
  toppings,
  snacksAndDrinks,
  cart,
  startCustomSeblak,
  startPresetSeblak,
  handleAddSnackOrDrink,
  handleDecrementSnackOrDrink
}: MenuGridProps) {
  return (
    <div className="flex-1 p-6 overflow-y-auto space-y-6">
      {/* Category Selection Tabs - VERY Tablet Friendly */}
      <div className="flex bg-slate-200/70 rounded-xl p-1 shadow-inner border border-slate-300/30 max-w-sm">
        <button
          type="button"
          onClick={() => setKioskCategory('seblak')}
          className={`flex-1 py-2.5 rounded-lg font-black tracking-wide text-xs transition-all flex items-center justify-center gap-1.5 ${
            kioskCategory === 'seblak' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          Seblak Juara
        </button>
        <button
          type="button"
          onClick={() => setKioskCategory('snacks')}
          className={`flex-1 py-2.5 rounded-lg font-black tracking-wide text-xs transition-all flex items-center justify-center gap-1.5 ${
            kioskCategory === 'snacks' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          🍿 Cemilan
        </button>
        <button
          type="button"
          onClick={() => setKioskCategory('drinks')}
          className={`flex-1 py-2.5 rounded-lg font-black tracking-wide text-xs transition-all flex items-center justify-center gap-1.5 ${
            kioskCategory === 'drinks' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          🥤 Minuman
        </button>
      </div>

      {/* VIEW 1: SEBLAK SPECIAL MENU */}
      {kioskCategory === 'seblak' && (
        <>
          <div className="bg-amber-50 rounded-2xl border border-amber-200/60 p-5 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center md:text-left">
              <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">Kreasikan Seblakmu!</span>
              <h3 className="text-base font-extrabold text-slate-800 uppercase tracking-wide">Rakit Seblak Sesuai Seleramu</h3>
            </div>
            <button
              onClick={startCustomSeblak}
              className="w-full md:w-auto bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-150 flex items-center justify-center gap-2 group shrink-0"
            >
              <Sparkles className="w-4 h-4 text-amber-200 group-hover:scale-125 transition-transform" />
              Rakit Seblak Custom
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h2 className="text-sm font-bold text-slate-800 tracking-wider uppercase flex items-center gap-1.5">
                <ClipboardList className="w-4 h-4 text-red-600" />
                Pilihan Paket Seblak Juara
              </h2>
              <span className="text-xs text-slate-400">Tinggal klik & sesuaikan pedas</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {presets.map((p) => {
                const shortToppingDesc = p.defaultToppings
                  .map(tid => toppings.find(t => t.id === tid)?.name || '')
                  .filter(Boolean)
                  .slice(0, 4)
                  .join(', ') + '...';

                return (
                  <div 
                    key={p.id}
                    onClick={() => startPresetSeblak(p)}
                    className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md cursor-pointer transition-all duration-250 flex flex-col hover:border-amber-300 group animate-fadeIn"
                  >
                    <div className="relative h-28 bg-slate-100 overflow-hidden shrink-0">
                      <img 
                        src={p.image} 
                        alt={p.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
                      {p.isPopular && (
                        <span className="absolute top-2.5 right-2.5 bg-red-600 text-[9px] text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wide flex items-center gap-0.5 shadow-sm">
                          <Flame className="w-3 h-3 fill-yellow-400 stroke-none" /> Best Seller
                        </span>
                      )}
                      <div className="absolute bottom-2.5 left-3 text-white">
                        <span className="text-[10px] bg-amber-500/90 text-white font-bold px-2 py-0.5 rounded-md uppercase">Paket Praktis</span>
                      </div>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-extrabold text-slate-800 text-sm group-hover:text-amber-700 transition-colors uppercase leading-snug">{p.name}</h3>
                        <span className="text-amber-600 font-extrabold text-sm shrink-0 font-mono">{formatRupiah(p.basePrice)}</span>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <div className="text-[10px] text-slate-400 truncate max-w-[150px]">
                          Topping: <span className="font-semibold text-slate-600">{shortToppingDesc}</span>
                        </div>
                        <span className="text-[10px] bg-slate-100 group-hover:bg-amber-100 group-hover:text-amber-800 text-slate-500 font-bold px-2.5 py-1 rounded-md flex items-center gap-0.5 transition-colors">
                          Pesanan <Plus className="w-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* VIEW 2: CEMILAN / SNACKS */}
      {kioskCategory === 'snacks' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h2 className="text-sm font-bold text-slate-800 tracking-wider uppercase flex items-center gap-1.5">
              🍿 Cemilan Pendamping Gurih
            </h2>
            <span className="text-xs text-slate-450">Pelengkap nikmat makan seblak</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {snacksAndDrinks.filter(item => item.category === 'snack').map(item => {
              const existingInCart = cart.find(it => it.name === item.name);
              const quantityInCart = existingInCart?.quantity || 0;

              return (
                <div key={item.id} className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row hover:border-amber-300">
                  <div className="md:w-32 h-28 bg-slate-100 shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-extrabold text-slate-800 text-sm uppercase leading-tight">{item.name}</h3>
                        <span className="text-amber-600 font-extrabold text-xs shrink-0 font-mono pl-1">{formatRupiah(item.price)}</span>
                      </div>
                    </div>

                    <div className="flex justify-end items-center mt-3 pt-2 border-t border-slate-50">
                      {quantityInCart > 0 ? (
                        <div className="flex items-center gap-2 bg-amber-50 rounded-lg p-1 border border-amber-200 select-none">
                          <button
                            type="button"
                            onClick={() => handleDecrementSnackOrDrink(item.name)}
                            className="w-7 h-7 bg-white hover:bg-slate-100 text-amber-700 font-bold rounded flex items-center justify-center text-xs shadow-sm border border-slate-200/60 transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="font-mono text-xs font-black min-w-5 text-center text-slate-800">{quantityInCart}</span>
                          <button
                            type="button"
                            onClick={() => handleAddSnackOrDrink({ name: item.name, price: item.price, category: 'snack' })}
                            className="w-7 h-7 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded flex items-center justify-center text-xs shadow-sm transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleAddSnackOrDrink({ name: item.name, price: item.price, category: 'snack' })}
                          className="bg-amber-600 hover:bg-amber-700 text-white font-heavy py-1.5 px-4 rounded-lg text-xs shadow-sm hover:shadow transition-colors flex items-center gap-1 uppercase font-bold"
                        >
                          <Plus className="w-3.5 h-3.5" /> Tambah
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 3: MINUMAN / DRINKS */}
      {kioskCategory === 'drinks' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h2 className="text-sm font-bold text-slate-800 tracking-wider uppercase flex items-center gap-1.5">
              🥤 Penyegar Minuman Dingin & Manis
            </h2>
            <span className="text-xs text-slate-450">Peredas rasa pedas juara</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {snacksAndDrinks.filter(item => item.category === 'drink').map(item => {
              const existingInCart = cart.find(it => it.name === item.name);
              const quantityInCart = existingInCart?.quantity || 0;

              return (
                <div key={item.id} className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row hover:border-amber-300">
                  <div className="md:w-32 h-28 bg-slate-100 shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-extrabold text-slate-800 text-sm uppercase leading-tight">{item.name}</h3>
                        <span className="text-amber-600 font-extrabold text-xs shrink-0 font-mono pl-1">{formatRupiah(item.price)}</span>
                      </div>
                    </div>

                    <div className="flex justify-end items-center mt-3 pt-2 border-t border-slate-50">
                      {quantityInCart > 0 ? (
                        <div className="flex items-center gap-2 bg-amber-50 rounded-lg p-1 border border-amber-200 select-none">
                          <button
                            type="button"
                            onClick={() => handleDecrementSnackOrDrink(item.name)}
                            className="w-7 h-7 bg-white hover:bg-slate-100 text-amber-700 font-bold rounded flex items-center justify-center text-xs shadow-sm border border-slate-200/60 transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="font-mono text-xs font-black min-w-5 text-center text-slate-800">{quantityInCart}</span>
                          <button
                            type="button"
                            onClick={() => handleAddSnackOrDrink({ name: item.name, price: item.price, category: 'drink' })}
                            className="w-7 h-7 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded flex items-center justify-center text-xs shadow-sm transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleAddSnackOrDrink({ name: item.name, price: item.price, category: 'drink' })}
                          className="bg-amber-600 hover:bg-amber-700 text-white font-heavy py-1.5 px-4 rounded-lg text-xs shadow-sm hover:shadow transition-colors flex items-center gap-1 uppercase font-bold"
                        >
                          <Plus className="w-3.5 h-3.5" /> Tambah
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
