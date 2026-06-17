import React from 'react';
import { Order } from '../types';
import { formatRupiah } from '../data';
import { Flame, Printer, CheckCircle, QrCode } from 'lucide-react';

interface ReceiptProps {
  order: Order;
  onPrint?: () => void;
  showActions?: boolean;
  onScanQR?: (orderId: string) => void;
  settings?: { shopName: string; shopAddress?: string; shopPhone?: string };
}

export default function Receipt({ order, onPrint, showActions = true, onScanQR, settings }: ReceiptProps) {
  const isPaid = order.status === 'paid' || order.status === 'completed';

  const handlePrintAction = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  return (
    <div className="flex flex-col items-center bg-transparent">
      {/* Receipt Frame */}
      <div 
        id={`receipt-${order.id}`}
        className="w-full max-w-sm bg-white p-6 rounded-lg border-2 border-dashed border-slate-300 text-slate-800 font-mono text-xs shadow-md shadow-amber-900/5 select-none relative overflow-hidden"
      >
        {/* Decorative corner circles */}
        <div className="absolute -left-3 top-1/2 -mt-3 w-6 h-6 rounded-full bg-slate-50 border-r border-slate-200"></div>
        <div className="absolute -right-3 top-1/2 -mt-3 w-6 h-6 rounded-full bg-slate-50 border-l border-slate-200"></div>

        {/* Brand Header */}
        <div className="text-center mb-4 pb-4 border-b border-dashed border-slate-300">
          <div className="flex justify-center items-center gap-1.5 text-amber-600 font-bold text-lg tracking-wider">
            <Flame className="w-5 h-5 fill-red-500 stroke-red-600 animate-pulse" />
            <span>SEBLAK JEBRED</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1 uppercase">Sunda Authentic & Pedas Juara</p>
          <p className="text-[9px] text-slate-400">{settings?.shopAddress || 'Jln. Malioboro No. 25, Yogyakarta'}</p>
          <p className="text-[9px] text-slate-400">Telp: {settings?.shopPhone || '0812-3456-7890'}</p>
        </div>

        {/* Metadata */}
        <div className="mb-4 text-[10px] space-y-1 text-slate-600 border-b border-dashed border-slate-200 pb-2">
          <div className="flex justify-between">
            <span>No. Antrean:</span>
            <span className="text-base font-bold text-slate-900 bg-amber-100 px-1.5 rounded">{order.queueNumber}</span>
          </div>
          <div className="flex justify-between">
            <span>Kode Pesanan:</span>
            <span className="font-bold text-slate-900">{order.id}</span>
          </div>
          <div className="flex justify-between">
            <span>Tanggal:</span>
            <span>{new Date(order.createdAt).toLocaleString('id-ID')}</span>
          </div>
          <div className="flex justify-between">
            <span>Pelanggan:</span>
            <span className="font-semibold uppercase">{order.customerName || 'Pelanggan'}</span>
          </div>
          <div className="flex justify-between">
            <span>Status:</span>
            <span className={`font-bold px-1 rounded text-[9px] ${
              isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
            }`}>
              {isPaid ? 'TERBAYAR (Lunas)' : 'BELUM BAYAR (Kasir)'}
            </span>
          </div>
          {order.paymentMethod && (
            <div className="flex justify-between">
              <span>Pembayaran:</span>
              <span className="font-semibold">{order.paymentMethod}</span>
            </div>
          )}
        </div>

        {/* Items List */}
        <div className="space-y-4 border-b border-dashed border-slate-200 pb-3 mb-3">
          {order.items.map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between font-bold text-slate-900 text-[11px]">
                <span className="max-w-[180px] break-words">{item.quantity}x {item.name}</span>
                <span>{formatRupiah(item.pricePerUnit * item.quantity)}</span>
              </div>
              
              {/* Custom specs */}
              {(item.type === 'custom' || item.type === 'preset') ? (
                <div className="text-[9px] text-slate-500 pl-3 leading-tight space-y-0.5">
                  <p>• Pedas: <span className={`font-semibold ${item.level > 2 ? 'text-red-600 font-bold' : 'text-slate-700'}`}>Level {item.level}</span></p>
                  
                  {item.toppings && item.toppings.length > 0 && (
                    <div>
                      <span className="font-medium text-slate-600">Topping: </span>
                      <span>{item.toppings.map(t => `${t.name} (x${t.quantity})`).join(', ')}</span>
                    </div>
                  )}
                  
                  {item.notes && (
                    <p className="italic text-rose-500">Catatan: "{item.notes}"</p>
                  )}
                </div>
              ) : (
                item.notes && (
                  <div className="text-[9px] text-slate-500 pl-3 leading-tight">
                    <p className="italic text-rose-500">Catatan: "{item.notes}"</p>
                  </div>
                )
              )}
            </div>
          ))}
        </div>

        {/* Total Cost Section */}
        <div className="space-y-1 text-slate-700 border-b border-dashed border-slate-300 pb-3 mb-3 text-[11px]">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>{formatRupiah(order.totalPrice)}</span>
          </div>
          <div className="flex justify-between">
            <span>Pajak (PB1 10%):</span>
            <span>{formatRupiah(0)}</span> {/* free PB1 for now */}
          </div>
          <div className="flex justify-between text-base font-bold text-slate-900 pt-1.5 border-t border-dotted border-slate-200">
            <span>TOTAL:</span>
            <span>{formatRupiah(order.totalPrice)}</span>
          </div>
        </div>

        {/* Footer info/barcode mock */}
        <div className="text-center space-y-3 pt-2">
          {/* QR Code Option */}
          <div className="flex flex-col items-center justify-center p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <span className="text-[8px] text-slate-500 font-extrabold uppercase tracking-widest text-amber-750">
              QRIS / STRUK DIGITAL DI HP
            </span>
            <div 
              onClick={() => onScanQR && onScanQR(order.id)}
              className={`w-28 h-28 bg-white border border-slate-300 rounded-lg p-1.5 flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-amber-500 hover:border-amber-500 transition-all ${
                onScanQR ? 'cursor-pointer active:scale-95' : 'cursor-default'
              }`}
              title={onScanQR ? "Klik untuk mensimulasikan scan QR Code dengan HP!" : undefined}
            >
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(window.location.origin + '/?track=' + order.id)}`} 
                alt={`QR Code ${order.id}`}
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            {onScanQR && (
              <span className="text-[7.5px] text-amber-700 font-black tracking-wider uppercase animate-pulse">
                👉 KETUK QR UNTUK AKSES HP 👈
              </span>
            )}
          </div>

          <div className="flex flex-col items-center opacity-60">
            {/* Mock Barcode */}
            <div className="w-full h-5 bg-slate-100 flex items-center justify-center border border-slate-200 gap-0.5 mb-0.5 py-0.5">
              {Array.from({ length: 24 }).map((_, i) => (
                <div 
                  key={i} 
                  className="bg-slate-800 h-full" 
                  style={{ width: `${(i % 3 === 0 ? 0.5 : i % 5 === 0 ? 2 : 1)}px` }}
                ></div>
              ))}
            </div>
            <p className="text-[7px] text-slate-400 tracking-widest">{order.id}</p>
          </div>

          <div className="text-[9px] text-slate-400 uppercase leading-normal">
            {isPaid ? (
              <p className="text-emerald-700 font-bold bg-emerald-50 py-1 rounded">
                TERIMA KASIH!<br />Struk ini dicetak otomatis dari Kasir
              </p>
            ) : (
              <p className="text-rose-700 font-semibold bg-rose-50 py-1 rounded">
                HARAP LAKUKAN PEMBAYARAN DI KASIR<br />Dengan menunjukkan struk ini
              </p>
            )}
            <p className="mt-1">Powered by SeblakPOS Premium</p>
          </div>
        </div>
      </div>

      {/* Action panel underneath receipt */}
      {showActions && (
        <div className="mt-4 flex gap-2 w-full max-w-sm">
          <button
            onClick={handlePrintAction}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs font-semibold shadow transition-all duration-150"
            id={`btn-print-${order.id}`}
          >
            <Printer className="w-3.5 h-3.5" />
            Cetak Struk
          </button>
        </div>
      )}
    </div>
  );
}
