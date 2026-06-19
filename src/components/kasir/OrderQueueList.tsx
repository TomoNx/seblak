import React, { useState, useMemo } from 'react';
import { Order } from '../../types';
import { Search, ShoppingBag, Clock } from 'lucide-react';
import { formatRupiah } from '../../data';

interface OrderQueueListProps {
  orders: Order[];
  statusFilter: 'pending' | 'paid' | 'cancelled' | 'all';
  selectedOrderId: string | null;
  onSelectOrder: (orderId: string) => void;
}

export default function OrderQueueList({ orders, statusFilter, selectedOrderId, onSelectOrder }: OrderQueueListProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      // Filter by status
      const matchesStatus = 
        statusFilter === 'pending' ? order.status === 'pending_payment' :
        statusFilter === 'paid' ? (order.status === 'paid' || order.status === 'completed') :
        statusFilter === 'cancelled' ? order.status === 'cancelled' :
        true;

      // Filter by search query
      const matchesSearch = 
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesStatus && matchesSearch;
    });
  }, [orders, searchQuery, statusFilter]);

  return (
    <div className="flex-1 p-5 overflow-y-auto space-y-4">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Cari order #ID, nama pelanggan, atau nomor antrean..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white border border-slate-200/80 rounded-xl pl-9 pr-4 py-3 text-xs font-medium outline-none focus:border-amber-500 shadow-sm text-slate-800"
          id="search-kasir-queue"
        />
      </div>

      {/* Orders queue grid */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-xl border border-dotted border-slate-300 p-8 text-center flex flex-col items-center justify-center">
          <ShoppingBag className="w-10 h-10 text-slate-300 mb-2 animate-pulse" />
          <p className="text-xs font-bold text-slate-500">Tidak Ada Transaksi Ditemukan</p>
          <p className="text-[10px] text-slate-400 max-w-xs mt-1">
            {statusFilter === 'pending' 
              ? 'Kiosk pesanan belum mengirimkan orderan baru, atau tidak ada yang sesuai kata kunci pencarian.' 
              : 'Belum ada transaksi seblak terbayar hari ini.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredOrders.map((order) => {
            const isPaid = order.status === 'paid' || order.status === 'completed';

            return (
              <div
                key={order.id}
                onClick={() => onSelectOrder(order.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedOrderId === order.id 
                    ? 'bg-amber-500/10 border-amber-500 shadow-md ring-1 ring-amber-400' 
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                }`}
                id={`order-queue-card-${order.id}`}
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] font-mono font-black text-slate-400">{order.id}</span>
                      <span className={`text-[8px] font-bold uppercase rounded px-1.5 py-0.5 ${
                        order.status === 'cancelled' ? 'bg-slate-200 text-slate-600' :
                        isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800 animate-pulse'
                      }`}>
                        {order.status === 'cancelled' ? 'Batal' : isPaid ? 'Lunas' : 'Belum Bayar'}
                      </span>
                      <span className={`text-[8px] font-bold uppercase rounded px-1.5 py-0.5 ${
                        order.orderType === 'take_away' ? 'bg-sky-100 text-sky-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {order.orderType === 'take_away' ? '🥡 Dibungkus' : '🍽️ Di Tempat'}
                      </span>
                    </div>
                    <h4 className="font-extrabold text-sm uppercase text-slate-800 truncate max-w-[140px] leading-snug">
                      {order.customerName}
                    </h4>
                  </div>
                </div>

                {/* Order items summaries */}
                <div className="mt-3 text-[10px] text-slate-500 leading-relaxed border-t border-slate-100 pt-2">
                  <p className="line-clamp-1 truncate font-medium">
                    {order.items.map(it => {
                      if (it.type === 'snack' || it.type === 'drink') {
                        return `${it.quantity}x ${it.name}`;
                      }
                      return `${it.quantity}x ${it.name} (Lvl ${it.level})`;
                    }).join(', ')}
                  </p>
                  <div className="flex justify-between items-center mt-2.5 pt-1.5 border-t border-dotted border-slate-200">
                    <span className="text-[9px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(order.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="font-mono font-black text-amber-700 text-xs">{formatRupiah(order.totalPrice)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
