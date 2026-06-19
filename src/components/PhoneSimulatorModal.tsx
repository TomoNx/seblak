/**
 * PhoneSimulatorModal — Simulates a customer's mobile phone experience
 *
 * Shows order tracking, QRIS payment simulation, and order status
 * within a realistic smartphone frame UI.
 */

import React from 'react';
import { Order } from '../types';
import { QrCode } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatRupiah } from '../utils/formatters';

interface PhoneSimulatorModalProps {
  order: Order | null;
  onClose: () => void;
  onSimulatePayment: (orderId: string) => void;
}

export default function PhoneSimulatorModal({ order, onClose, onSimulatePayment }: PhoneSimulatorModalProps) {
  if (!order) return null;

  const isPendingPayment = order.status === 'pending_payment';
  const isPaid = order.status === 'paid';
  const isCompleted = order.status === 'completed';
  const isCancelled = order.status === 'cancelled';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto"
    >
      {/* Smartphone Frame */}
      <motion.div
        initial={{ scale: 0.9, y: 40 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 40 }}
        className="relative w-full max-w-[375px] bg-slate-900 rounded-[50px] p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] border-[6px] border-slate-750 flex flex-col overflow-hidden"
        style={{ minHeight: '620px', maxHeight: '90vh' }}
      >
        {/* Dynamic Island */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-5.5 bg-black rounded-2xl z-30 flex items-center justify-center">
          <div className="w-2h rounded-full bg-[#1e293b] mr-8"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-[#1e293b]"></div>
        </div>

        {/* Status Bar */}
        <div className="w-full flex justify-between px-6 pt-1 pb-2 text-[10px] font-extrabold text-slate-300 select-none z-20">
          <span>13:20</span>
          <div className="flex items-center gap-1">
            <span>📶</span>
            <span>🔋</span>
            <span>98%</span>
          </div>
        </div>

        {/* Screen Content */}
        <div className="bg-slate-50 flex-1 rounded-[38px] overflow-hidden flex flex-col relative text-slate-800 border border-slate-950 shadow-inner">
          {/* App Header */}
          <div className="bg-amber-600 px-4 pt-4.5 pb-3 text-white text-center bg-gradient-to-br from-amber-500 to-amber-700 relative shadow-md">
            <p className="text-[9.5px] text-amber-100 font-extrabold tracking-widest uppercase">E-Struk & Wallet Pelanggan</p>
            <h4 className="text-xs font-black tracking-wide uppercase mt-0.5">SeblakPOS Mobile Companion</h4>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {/* Customer Details */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-3 text-center shadow-3xs">
              <p className="text-[9px] text-slate-400 font-black uppercase tracking-wider">DETAIL PELANGGAN</p>
              <h2 className="text-xl font-black text-amber-600 tracking-tight my-0.5 uppercase">{order.customerName}</h2>
              <p className="text-[10px] text-slate-600 font-mono font-bold">ID PESANAN: {order.id}</p>
            </div>

            {/* Status Panel: Pending Payment */}
            {isPendingPayment && (
              <div className="bg-amber-50/70 border-2 border-dashed border-amber-300 rounded-2xl p-4 flex flex-col items-center text-center space-y-3">
                <div className="text-amber-700">
                  <QrCode className="w-8 h-8 mx-auto stroke-[2.5]" />
                  <p className="text-xs font-black uppercase tracking-wide mt-1">SCAN QRIS UNTUK BAYAR VIA HP</p>
                  <p className="text-[9px] text-slate-400 mt-0.5">Mendukung GoPay, OVO, Dana, LinkAja & BCA</p>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-3xs relative group">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(window.location.origin + '/?pay=' + order.id)}`}
                    alt="QRIS Mock"
                    className="w-32 h-32 object-contain"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-emerald-600/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                    <span className="bg-emerald-600 text-white text-[8px] font-black px-2 py-1 rounded">MOCK QRIS SECURE</span>
                  </div>
                </div>

                <div className="w-full">
                  <p className="text-[10px] text-slate-500 font-semibold mb-2">Total Tagihan:</p>
                  <p className="text-lg font-black text-slate-900 font-mono leading-none">{formatRupiah(order.totalPrice)}</p>
                </div>

                <button
                  type="button"
                  onClick={() => onSimulatePayment(order.id)}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[10.5px] uppercase tracking-wider rounded-xl cursor-pointer shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-1"
                >
                  <span>📲</span> Simulasikan Bayar QRIS HP
                </button>
              </div>
            )}

            {/* Status Panel: Paid */}
            {isPaid && (
              <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-4 text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto text-lg font-bold shadow-3xs">
                  ✓
                </div>
                <div>
                  <p className="text-xs font-black text-emerald-800 uppercase tracking-wide">Pembayaran QRIS Sukses</p>
                  <p className="text-[9px] text-slate-500 mt-1">Status Anda otomatis berganti menjadi <span className="font-extrabold text-emerald-750 bg-emerald-100 px-1 py-0.5 rounded leading-none">LUNAS</span> dan tercatat aman di sistem POS Seblak.</p>
                </div>
                <div className="border-t border-dashed border-emerald-200/60 pt-2 text-[9.5px] text-slate-500 font-bold">
                  <p className="uppercase text-[9px] tracking-wider">Antrean Ke Dapur</p>
                  <p className="text-emerald-750 font-black uppercase mt-1 animate-pulse">Sedang Dimasak Koki... 🍳</p>
                </div>
              </div>
            )}

            {/* Status Panel: Completed */}
            {isCompleted && (
              <div className="bg-blue-50 border border-blue-200/80 rounded-2xl p-4 text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center mx-auto text-lg font-bold shadow-3xs">
                  🥣
                </div>
                <div>
                  <p className="text-xs font-black text-blue-800 uppercase tracking-wide">Pesanan Selesai Disajikan</p>
                  <p className="text-[9px] text-slate-500 mt-1">Selesai dimasak oleh koki kami. Selamat menikmati! Silakan ambil hidangan Anda.</p>
                </div>
              </div>
            )}

            {/* Status Panel: Cancelled */}
            {isCancelled && (
              <div className="bg-rose-50 border border-rose-200/80 rounded-2xl p-4 text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-rose-500 text-white flex items-center justify-center mx-auto text-lg font-bold shadow-3xs">
                  ✕
                </div>
                <div>
                  <p className="text-xs font-black text-rose-800 uppercase tracking-wide">Pesanan Dibatalkan</p>
                  <p className="text-[9px] text-slate-500 mt-1">Pesanan dibatalkan. Hubungi kasir apabila ada kekeliruan.</p>
                </div>
              </div>
            )}

            {/* Order Details */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 space-y-2.5 text-left">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-1.5">Rincian Belanja Anda</p>
              <div className="space-y-3 max-h-48 overflow-y-auto pr-0.5 divide-y divide-slate-100">
                {order.items.map((item, idx) => (
                  <div key={idx} className="pt-2 first:pt-0 space-y-1">
                    <div className="flex justify-between font-extrabold text-[10.5px] text-slate-800">
                      <span className="max-w-[160px] truncate">{item.quantity}x {item.name}</span>
                      <span className="font-mono text-amber-600">{formatRupiah(item.pricePerUnit * item.quantity)}</span>
                    </div>

                    {(item.type === 'custom' || item.type === 'preset') ? (
                      <div className="text-[9px] text-slate-500 pl-2 leading-tight space-y-1">
                        <p>• Pedas: <span className="font-extrabold text-rose-600">Level {item.level}</span></p>

                        {item.toppings && item.toppings.length > 0 && (
                          <div className="pt-1">
                            <span className="font-bold text-slate-400 text-[8px] uppercase tracking-wider block mb-1">Pilihan Toppers:</span>
                            <div className="flex flex-wrap gap-1">
                              {item.toppings.map((t, tIdx) => (
                                <span key={tIdx} className="bg-amber-100 border border-amber-200/65 text-amber-900 font-extrabold px-1.5 py-0.5 rounded-md uppercase text-[8px] tracking-wide inline-block">
                                  {t.name} (x{t.quantity})
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-[9px] text-indigo-700 pl-2 font-bold">• Pendamping Dingin / Cemilan</p>
                    )}

                    {item.notes && (
                      <p className="text-[9px] italic text-rose-500 pl-2">"* Catatan: {item.notes}"</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Control Bar */}
          <div className="bg-slate-100 border-t border-slate-200 px-4 py-3 flex flex-col gap-1 text-center font-bold">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 bg-slate-900 hover:bg-slate-950 text-white font-extrabold tracking-wider rounded-xl text-[10px] uppercase cursor-pointer text-center shadow-3xs transition-transform active:scale-[0.98]"
            >
              Tutup Layar HP
            </button>
            <p className="text-[7.5px] text-slate-400 font-medium">Digital Companion powered by SeblakPOS</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
