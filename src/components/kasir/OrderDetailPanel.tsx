import React, { useState, useMemo } from 'react';
import { Order } from '../../types';
import { formatRupiah } from '../../data';
import { QrCode, CreditCard, DollarSign, CheckCircle2, Trash2, Printer, Edit3 } from 'lucide-react';
import Receipt from '../Receipt';

interface OrderDetailPanelProps {
  order: Order | null;
  onConfirmPayment: (orderId: string, paymentMethod: 'Tunai' | 'QRIS' | 'Debit') => void;
  onCancelOrder: (orderId: string) => void;
  onRestoreOrder?: (orderId: string) => void;
  onDeleteOrder?: (orderId: string) => void;
  onBeginEditOrder: (order: Order) => void;
  settings?: { qrisImage: string; shopName: string; shopAddress?: string; shopPhone?: string; adminPin?: string };
}

export default function OrderDetailPanel({
  order,
  onConfirmPayment,
  onCancelOrder,
  onRestoreOrder,
  onDeleteOrder,
  onBeginEditOrder,
  settings
}: OrderDetailPanelProps) {
  const [cashReceived, setCashReceived] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'Tunai' | 'QRIS' | 'Debit'>('Tunai');

  const cashChangeNum = useMemo(() => {
    if (!order || paymentMethod !== 'Tunai') return 0;
    const received = parseFloat(cashReceived) || 0;
    return Math.max(0, received - order.totalPrice);
  }, [order, cashReceived, paymentMethod]);

  const quickCashValues = useMemo(() => {
    if (!order) return [];
    const total = order.totalPrice;
    
    const bills = [10000, 20000, 50000, 100000];
    const suggestions = new Set<number>();
    
    suggestions.add(total);
    
    bills.forEach(bill => {
      if (bill >= total) suggestions.add(bill);
      const roundedToNearestTen = Math.ceil(total / 10000) * 10000;
      if (roundedToNearestTen > total) suggestions.add(roundedToNearestTen);
      const roundedToNearestFifty = Math.ceil(total / 50000) * 50000;
      if (roundedToNearestFifty > total) suggestions.add(roundedToNearestFifty);
    });

    return Array.from(suggestions).sort((a, b) => a - b).slice(0, 4);
  }, [order]);

  const handlePayConfirm = () => {
    if (!order) return;
    if (paymentMethod === 'Tunai') {
      const rec = parseFloat(cashReceived) || 0;
      if (rec < order.totalPrice) {
        alert('⚠️ Jumlah uang tunai kurang dari total tagihan!');
        return;
      }
    }
    onConfirmPayment(order.id, paymentMethod);
    setCashReceived('');
  };

  const handlePrint = (_orderId: string) => {
    window.print();
  };

  const handlePayConfirmAndPrint = () => {
    if (!order) return;
    if (paymentMethod === 'Tunai') {
      const rec = parseFloat(cashReceived) || 0;
      if (rec < order.totalPrice) {
        alert('⚠️ Jumlah uang tunai kurang dari total tagihan!');
        return;
      }
    }
    onConfirmPayment(order.id, paymentMethod);
    setCashReceived('');

    // Wait a brief moment for state changes to reflect, then open print dialog
    setTimeout(() => {
      handlePrint(order.id);
    }, 100);
  };

  if (!order) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-4">
        <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 border border-slate-100 mb-2">
          <DollarSign className="w-5 h-5" />
        </div>
        <p className="text-xs text-slate-500 font-extrabold font-sans">Belum ada pesanan terpilih</p>
        <p className="text-[10px] text-slate-400 mt-1 max-w-[180px] leading-relaxed">
          Pilih salah satu kartu pesanan di sebelah kiri untuk melihat detail atau menyelesaikan pembayaran.
        </p>
      </div>
    );
  }

  const isPaid = order.status === 'paid' || order.status === 'completed';

  return (
    <div className="space-y-5 h-full flex flex-col text-slate-800">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-amber-100 text-amber-700 rounded-lg flex items-center justify-center font-black">
            {order.customerName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-extrabold text-xs uppercase text-slate-900">{order.customerName}</h3>
            <p className="text-[9px] text-slate-400 font-mono">ID: {order.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {(isPaid || order.status === 'pending_payment') && (
            <button
              onClick={() => handlePrint(order.id)}
              className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md transition-colors cursor-pointer"
              title="Print Struk"
            >
              <Printer className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 pb-4">
        <div id={`receipt-container-${order.id}`} className="transform origin-top scale-[0.98]">
          <Receipt order={order} settings={settings} />
        </div>
        
        {order.status !== 'cancelled' && order.status !== 'paid' && order.status !== 'completed' && (
          <div className="mt-4 border-t border-dashed border-slate-200 pt-4">
            <button
              onClick={() => onBeginEditOrder(order)}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold py-2.5 rounded-xl text-xs uppercase flex items-center justify-center gap-1.5 transition-colors border border-slate-200"
            >
              <Edit3 className="w-3.5 h-3.5 text-slate-500" />
              Kelola & Tambah Pesanan
            </button>
          </div>
        )}
      </div>

      {order.status === 'pending_payment' ? (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 shrink-0">
          <div className="grid grid-cols-3 gap-1.5 mb-3 bg-slate-200/50 p-1 rounded-lg">
            {(['Tunai', 'QRIS', 'Debit'] as const).map(method => (
              <button
                key={method}
                onClick={() => {
                  setPaymentMethod(method);
                  setCashReceived('');
                }}
                className={`py-2 text-[10px] font-black rounded-md flex justify-center items-center gap-1.5 transition-all ${
                  paymentMethod === method 
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {method === 'QRIS' ? <QrCode className="w-3.5 h-3.5" /> : 
                 method === 'Debit' ? <CreditCard className="w-3.5 h-3.5" /> : 
                 <DollarSign className="w-3.5 h-3.5" />}
                {method}
              </button>
            ))}
          </div>

          {paymentMethod === 'Tunai' ? (
            <div className="space-y-2.5 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
                {quickCashValues.map((val, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCashReceived(val.toString())}
                    className="bg-white border border-slate-200 text-slate-700 text-[10px] font-mono font-bold px-2.5 py-1.5 rounded-lg whitespace-nowrap hover:border-amber-400 hover:text-amber-700 transition-colors"
                  >
                    {formatRupiah(val)}
                  </button>
                ))}
              </div>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs font-black text-slate-400">Rp</span>
                <input
                  type="number"
                  value={cashReceived}
                  onChange={(e) => setCashReceived(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm font-mono font-bold outline-none focus:border-amber-500 shadow-sm"
                  placeholder="Jumlah bayar tunai..."
                />
              </div>
              <div className="flex justify-between items-center px-1 text-xs">
                <span className="font-bold text-slate-500">Kembalian:</span>
                <span className={`font-mono font-black ${cashChangeNum > 0 ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {formatRupiah(cashChangeNum)}
                </span>
              </div>
            </div>
          ) : paymentMethod === 'QRIS' ? (
            <div className="flex flex-col items-center justify-center py-2 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-24 h-24 bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm mb-2">
                {settings?.qrisImage ? (
                  <img src={settings.qrisImage} alt="QRIS" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                    <QrCode className="w-8 h-8 mb-1" />
                    <span className="text-[8px] font-bold text-center leading-tight">Belum Ada<br/>QRIS</span>
                  </div>
                )}
              </div>
              <p className="text-[10px] font-bold text-slate-500 text-center uppercase tracking-wider">Arahkan Pelanggan Scan QRIS</p>
            </div>
          ) : (
            <div className="py-6 text-center animate-in fade-in zoom-in-95 duration-200">
              <CreditCard className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Gesek Kartu di Mesin EDC</p>
            </div>
          )}

          <div className="flex flex-col gap-2 mt-4 pt-3 border-t border-slate-200">
            <div className="flex gap-2">
              <button
                onClick={() => onCancelOrder(order.id)}
                className="w-full border-2 border-red-100 hover:border-red-200 hover:bg-red-50 text-red-600 font-extrabold py-3 rounded-xl transition-all text-xs uppercase flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                Batalkan Pesanan
              </button>
            </div>

            <button
              onClick={handlePayConfirmAndPrint}
              disabled={paymentMethod === 'Tunai' && (!cashReceived || parseFloat(cashReceived) < order.totalPrice)}
              className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-slate-200 disabled:text-slate-400 text-slate-900 font-black py-3.5 rounded-xl shadow-md transition-all text-xs uppercase flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-slate-900" />
              Bayar & Cetak Struk
            </button>
          </div>
        </div>
      ) : (
        <div className="shrink-0 space-y-4">
          {order.status === 'cancelled' ? (
            <div className="bg-rose-50 text-rose-800 border border-rose-100 rounded-xl p-3 text-xs text-center flex flex-col gap-2">
              <p className="font-bold">Pesanan Ini Telah Dibatalkan</p>
              {onRestoreOrder && onDeleteOrder && (
                <div className="flex gap-2 mt-1">
                  <button onClick={() => onRestoreOrder(order.id)} className="flex-1 py-2 bg-white rounded shadow-sm font-black text-[10px] uppercase border border-rose-200 hover:bg-rose-100">
                    Pulihkan Pesanan
                  </button>
                  <button onClick={() => onDeleteOrder(order.id)} className="flex-1 py-2 bg-red-600 text-white rounded shadow-sm font-black text-[10px] uppercase hover:bg-red-700">
                    Hapus Permanen
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-xl p-3 text-xs text-center">
              <p className="font-bold mb-1">Transaksi Selesai & Lunas</p>
              <p className="text-[10px] opacity-80">Dibayar melalui: {order.paymentMethod}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
