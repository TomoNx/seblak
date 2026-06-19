import React, { useEffect, useState } from 'react';
import { Order } from '../../types';
import { Check, RefreshCw } from 'lucide-react';
import Receipt from '../Receipt';

interface CheckoutSuccessPanelProps {
  completedOrder: Order;
  onScanQR?: (orderId: string) => void;
  onReset: () => void;
  settings?: { shopName: string; shopAddress?: string; shopPhone?: string };
}

export default function CheckoutSuccessPanel({
  completedOrder,
  onScanQR,
  onReset,
  settings
}: CheckoutSuccessPanelProps) {
  const [countdown, setCountdown] = useState(10);

  // Auto-print saat komponen muncul
  useEffect(() => {
    const printTimer = setTimeout(() => {
      window.print();
    }, 300); // sedikit delay agar layout sudah ter-render
    return () => clearTimeout(printTimer);
  }, []);

  // Countdown 10 detik lalu auto-reset
  useEffect(() => {
    if (countdown <= 0) {
      onReset();
      return;
    }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown, onReset]);

  return (
    <div className="flex-1 p-6 overflow-y-auto flex flex-col items-center justify-center bg-amber-50/20">
      <div className="text-center space-y-2 mb-4 shrink-0 max-w-sm">
        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-1 shadow-md">
          <Check className="w-6 h-6 stroke-[3px]" />
        </div>
        <h2 className="text-base font-extrabold text-slate-800">PESANAN BERHASIL!</h2>
        <p className="text-xs text-slate-500">
          Pesanan atas nama <span className="font-bold text-slate-800 uppercase">{completedOrder.customerName}</span> berhasil disimpan.
          <br />Silakan ke kasir untuk membayar.
        </p>

        {/* Countdown bar */}
        <div className="mt-3 bg-slate-100 rounded-full h-2 overflow-hidden w-full max-w-xs mx-auto">
          <div
            className="bg-amber-500 h-full rounded-full transition-all duration-1000"
            style={{ width: `${(countdown / 10) * 100}%` }}
          />
        </div>
        <p className="text-[10px] text-slate-400 font-bold">
          Otomatis kembali ke menu dalam <span className="text-amber-600 font-black">{countdown}</span> detik...
        </p>
      </div>

      <div className="w-full max-w-sm">
        <Receipt order={completedOrder} onScanQR={onScanQR} showActions={false} settings={settings} />
      </div>

      <button
        onClick={onReset}
        className="mt-6 flex items-center justify-center gap-1.5 py-2.5 px-6 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold shadow-md transition-all uppercase"
      >
        <RefreshCw className="w-4 h-4" />
        Pesan Baru Sekarang
      </button>
    </div>
  );
}
