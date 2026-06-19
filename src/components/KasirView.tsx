import React, { useState, useMemo } from 'react';
import { Order, Topping, Broth, PresetMenu } from '../types';
import { SnackOrDrink } from '../data';
import { DollarSign } from 'lucide-react';
import { AnimatePresence } from 'motion/react';

// Sub-components
import OrderQueueList from './kasir/OrderQueueList';
import OrderDetailPanel from './kasir/OrderDetailPanel';
import MenuManager from './kasir/MenuManager';
import AdminStatsView from './AdminStatsView';
import EditOrderModal from './kasir/EditOrderModal';
import EditOrderItemsModal from './kasir/EditOrderItemsModal';

interface KasirViewProps {
  orders: Order[];
  onConfirmPayment: (orderId: string, paymentMethod: 'Tunai' | 'QRIS' | 'Debit') => void;
  onCancelOrder: (orderId: string) => void;
  onRestoreOrder?: (orderId: string) => void;
  onDeleteOrder?: (orderId: string) => void;
  onUpdateOrder?: (order: Order) => void;
  onScanQR?: (orderId: string) => void;
  
  toppings?: Topping[];
  onSaveToppings?: (data: Topping[]) => void;
  broths?: Broth[];
  onSaveBroths?: (data: Broth[]) => void;
  presets?: PresetMenu[];
  onSavePresets?: (data: PresetMenu[]) => void;
  snacksAndDrinks?: SnackOrDrink[];
  onSaveSnacksAndDrinks?: (data: SnackOrDrink[]) => void;

  toppingCategories?: { id: string; name: string }[];
  onSaveToppingCategories?: (data: { id: string; name: string }[]) => void;
  menuCategories?: { id: string; name: string }[];
  onSaveMenuCategories?: (data: { id: string; name: string }[]) => void;
  settings?: { qrisImage: string; shopName: string; shopAddress?: string; shopPhone?: string; adminPin?: string };
  onSaveSettings?: (data: { qrisImage: string; shopName: string; shopAddress?: string; shopPhone?: string; adminPin?: string }) => void;
}

export default function KasirView({ 
  orders, 
  onConfirmPayment, 
  onCancelOrder,
  onRestoreOrder,
  onDeleteOrder,
  onUpdateOrder,
  toppings = [],
  onSaveToppings,
  broths = [],
  onSaveBroths,
  presets = [],
  onSavePresets,
  snacksAndDrinks = [],
  onSaveSnacksAndDrinks,
  toppingCategories = [],
  onSaveToppingCategories,
  menuCategories = [],
  onSaveMenuCategories,
  settings = { qrisImage: '', shopName: '' },
  onSaveSettings
}: KasirViewProps) {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'pending' | 'paid' | 'cancelled' | 'all' | 'menu_management' | 'analytics'>('pending');

  const [isEditingToppings, setIsEditingToppings] = useState<boolean>(false);
  const [editOrderObj, setEditOrderObj] = useState<Order | null>(null);
  const [editItemIdx, setEditItemIdx] = useState<number | null>(null);

  const [isEditingOrderItems, setIsEditingOrderItems] = useState<boolean>(false);
  const [editOrderItemsObj, setEditOrderItemsObj] = useState<Order | null>(null);

  const selectedOrder = useMemo(() => {
    return orders.find(o => o.id === selectedOrderId) || null;
  }, [orders, selectedOrderId]);

  const handleBeginEditToppings = (order: Order, itemIndex: number) => {
    setEditOrderObj(order);
    setEditItemIdx(itemIndex);
    setIsEditingToppings(true);
  };

  const handleBeginEditOrder = (order: Order) => {
    setEditOrderItemsObj(order);
    setIsEditingOrderItems(true);
  };

  return (
    <div className="flex flex-col h-full bg-slate-100 overflow-hidden text-slate-800">
      <div className="bg-slate-900 text-white px-6 py-3 shrink-0 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-3 border-b border-amber-500">
        <div className="flex items-center gap-2">
          <div className="bg-amber-500 p-1.5 rounded-lg select-none">
            <DollarSign className="w-5 h-5 text-slate-900 stroke-[2.5px]" />
          </div>
          <div>
            <h1 className="text-base font-extrabold tracking-tight">
              KASIR UTAMA {settings?.shopName ? settings.shopName.toUpperCase() : 'MALIOBORO'}
            </h1>
            <p className="text-[10px] text-slate-400 font-medium">Terminal Pembayaran & Antrean Struk Masuk • Seblak POS</p>
          </div>
        </div>

        <div className="flex bg-slate-800 rounded-lg p-0.5 text-xs font-bold font-mono overflow-x-auto max-w-full shrink-0">
          <button
            onClick={() => { setStatusFilter('pending'); setSelectedOrderId(null); }}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.2 transition-colors whitespace-nowrap ${
              statusFilter === 'pending' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Belum Bayar</span>
            <span className="bg-slate-950/20 text-slate-950 px-1.5 py-0.2 text-[10px] rounded-full font-sans font-black ml-1">
              {orders.filter(o => o.status === 'pending_payment').length}
            </span>
          </button>
          
          <button
            onClick={() => { setStatusFilter('paid'); setSelectedOrderId(null); }}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.2 transition-colors whitespace-nowrap ${
              statusFilter === 'paid' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Lunas</span>
            <span className="bg-white/10 text-white px-1.5 py-0.2 text-[10px] rounded-full font-sans font-black ml-1">
              {orders.filter(o => o.status === 'paid' || o.status === 'completed').length}
            </span>
          </button>

          <button
            onClick={() => { setStatusFilter('cancelled'); setSelectedOrderId(null); }}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.2 transition-colors whitespace-nowrap ${
              statusFilter === 'cancelled' ? 'bg-red-650 text-white bg-red-600 font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Batal</span>
            <span className="bg-white/10 text-white px-1.5 py-0.2 text-[10px] rounded-full font-sans font-black ml-1">
              {orders.filter(o => o.status === 'cancelled').length}
            </span>
          </button>

          <button
            onClick={() => { setStatusFilter('all'); setSelectedOrderId(null); }}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              statusFilter === 'all' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            Semua ({orders.length})
          </button>

          <button
            onClick={() => { setStatusFilter('menu_management'); setSelectedOrderId(null); }}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1 transition-colors whitespace-nowrap ${
              statusFilter === 'menu_management' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>⚙️ Kelola Menu</span>
          </button>

          <button
            onClick={() => { setStatusFilter('analytics'); setSelectedOrderId(null); }}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1 transition-colors whitespace-nowrap ${
              statusFilter === 'analytics' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>📊 Analitik</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
        {statusFilter === 'analytics' ? (
          <AdminStatsView orders={orders} settings={settings} />
        ) : statusFilter === 'menu_management' ? (
          <MenuManager
            toppings={toppings} onSaveToppings={onSaveToppings}
            broths={broths} onSaveBroths={onSaveBroths}
            presets={presets} onSavePresets={onSavePresets}
            snacksAndDrinks={snacksAndDrinks} onSaveSnacksAndDrinks={onSaveSnacksAndDrinks}
            toppingCategories={toppingCategories} onSaveToppingCategories={onSaveToppingCategories}
            menuCategories={menuCategories} onSaveMenuCategories={onSaveMenuCategories}
            settings={settings} onSaveSettings={onSaveSettings}
          />
        ) : (
          <>
            <OrderQueueList
              orders={orders}
              statusFilter={statusFilter}
              selectedOrderId={selectedOrderId}
              onSelectOrder={setSelectedOrderId}
            />
            <div className="w-full md:w-80 lg:w-96 bg-white border-t md:border-t-0 md:border-l border-slate-200 shrink-0 flex flex-col text-slate-850 p-5 shadow-2xl relative z-10 overflow-y-auto">
              <OrderDetailPanel
                order={selectedOrder}
                onConfirmPayment={onConfirmPayment}
                onCancelOrder={onCancelOrder}
                onRestoreOrder={onRestoreOrder}
                onDeleteOrder={onDeleteOrder}
                onBeginEditOrder={handleBeginEditOrder}
                settings={settings}
              />
            </div>
          </>
        )}
      </div>

      <AnimatePresence>
        {isEditingToppings && editOrderObj && editItemIdx !== null && onUpdateOrder && (
          <EditOrderModal
            order={editOrderObj}
            itemIdx={editItemIdx}
            toppings={toppings}
            broths={broths}
            presets={presets}
            onUpdateOrder={onUpdateOrder}
            onClose={() => {
              setIsEditingToppings(false);
              setEditOrderObj(null);
              setEditItemIdx(null);
            }}
          />
        )}

        {isEditingOrderItems && editOrderItemsObj && onUpdateOrder && (
          <EditOrderItemsModal
            order={editOrderItemsObj}
            toppings={toppings}
            broths={broths}
            presets={presets}
            snacksAndDrinks={snacksAndDrinks}
            onUpdateOrder={onUpdateOrder}
            onClose={() => {
              setIsEditingOrderItems(false);
              setEditOrderItemsObj(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
