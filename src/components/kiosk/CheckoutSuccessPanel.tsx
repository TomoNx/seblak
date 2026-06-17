import React from 'react';
import { Order } from '../../types';
import { Check, RefreshCw } from 'lucide-react';
import Receipt from '../Receipt';

interface CheckoutSuccessPanelProps {
  completedOrder: Order;
  onScanQR?: (orderId: string) => void;
  onReset: () => void;
}

export default function CheckoutSuccessPanel({
  completedOrder,
  onScanQR,
  onReset
}: CheckoutSuccessPanelProps) {
  return (
    <div className="flex-1 p-6 overflow-y-auto flex flex-col items-center justify-center bg-amber-50/20">
      <div className="text-center space-y-2 mb-4 shrink-0 max-w-sm">
        <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-1">
          <Check className="w-5 h-5 stroke-[3px]" />
        </div>
        <h2 className="text-base font-extrabold text-slate-800">PESANAN TERKIRIM KE KASIR!</h2>
        <p className="text-xs text-slate-500">Pemesanan atas nama <span className="font-bold text-slate-800 uppercase">{completedOrder.customerName}</span> berhasil disimpan. Silakan tunjukkan struk di bawah ini ke meja kasir untuk membayar.</p>
      </div>

      <div className="w-full max-w-sm">
        <Receipt order={completedOrder} onScanQR={onScanQR} />
      </div>

      <button
        onClick={onReset}
        className="mt-6 flex items-center justify-center gap-1.5 py-2.5 px-6 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold shadow-md transition-all uppercase"
      >
        <RefreshCw className="w-4 h-4" />
        Pesan Baru Lagi
      </button>
    </div>
  );
}
