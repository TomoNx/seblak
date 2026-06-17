import React, { useMemo } from 'react';
import { Order } from '../types';
import { formatRupiah, TOPPINGS } from '../data';
import { 
  TrendingUp, ShoppingCart, Award, Flame, Zap, DollarSign, 
  BarChart2, ShieldCheck, ClipboardCheck
} from 'lucide-react';

interface AdminStatsViewProps {
  orders: Order[];
}

export default function AdminStatsView({ orders }: AdminStatsViewProps) {
  
  // Computed stats derived from confirmed paid / completed transactions
  const stats = useMemo(() => {
    const paidAndDoneOrders = orders.filter(o => o.status === 'paid' || o.status === 'completed');
    
    // Revenue
    const totalRev = paidAndDoneOrders.reduce((sum, o) => sum + o.totalPrice, 0);
    
    // Total bowls / bowls qty cooked
    let totalBowlsCount = 0;
    paidAndDoneOrders.forEach(o => {
      o.items.forEach(item => {
        totalBowlsCount += item.quantity;
      });
    });

    // Counts of specific payment methods
    let tunaiCount = 0;
    let qrisCount = 0;
    let debitCount = 0;
    paidAndDoneOrders.forEach(o => {
      if (o.paymentMethod === 'Tunai') tunaiCount++;
      if (o.paymentMethod === 'QRIS') qrisCount++;
      if (o.paymentMethod === 'Debit') debitCount++;
    });

    // Unpaid/Pending count
    const pendingCount = orders.filter(o => o.status === 'pending_payment').length;

    return {
      revenue: totalRev,
      transactionCount: paidAndDoneOrders.length,
      bowlsCount: totalBowlsCount,
      pendingCount,
      paymentDistribution: { Tunai: tunaiCount, QRIS: qrisCount, Debit: debitCount }
    };
  }, [orders]);

  // Sifting top toppings sold
  const topToppings = useMemo(() => {
    const paidAndDoneOrders = orders.filter(o => o.status === 'paid' || o.status === 'completed');
    const counts: { [key: string]: number } = {};

    paidAndDoneOrders.forEach(o => {
      o.items.forEach(item => {
        if (item.toppings) {
          item.toppings.forEach(t => {
            counts[t.name] = (counts[t.name] || 0) + (t.quantity * item.quantity);
          });
        }
      });
    });

    // Convert to sorted array
    return Object.entries(counts)
      .map(([name, count]) => {
        const id = TOPPINGS.find(t => t.name === name)?.id || '';
        return { name, count, id };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // top 5
  }, [orders]);

  // Spice levels stats
  const spiceStats = useMemo(() => {
    const paidAndDoneOrders = orders.filter(o => o.status === 'paid' || o.status === 'completed');
    const counts = [0, 0, 0, 0, 0, 0]; // index matches level 0-5

    paidAndDoneOrders.forEach(o => {
      o.items.forEach(item => {
        if (item.level >= 0 && item.level <= 5) {
          counts[item.level] += item.quantity;
        }
      });
    });

    return counts;
  }, [orders]);

  return (
    <div className="p-6 bg-slate-50 space-y-6 h-full overflow-y-auto text-slate-800">
      
      {/* Title */}
      <div className="pb-3 border-b border-slate-200">
        <h1 className="text-xl font-black text-slate-800 uppercase flex items-center gap-1.5">
          <BarChart2 className="w-5 h-5 text-amber-600" />
          Dashboard Analitik Owner
        </h1>
        <p className="text-xs text-slate-400">Ringkasan operasional dwi-layar Kiosk & Kasir Seblak Jebred</p>
      </div>

      {/* Stats Cards Section */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Revenue */}
        <div className="bg-white p-4 rounded-xl border border-slate-250/50 shadow-sm flex items-center gap-3">
          <div className="bg-emerald-50 p-2.5 rounded-lg text-emerald-600 shrink-0">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Omzet Lunas</p>
            <h3 className="text-lg font-bold font-mono text-emerald-600 mt-0.5">{formatRupiah(stats.revenue)}</h3>
          </div>
        </div>

        {/* Bowls Volume */}
        <div className="bg-white p-4 rounded-xl border border-slate-250/50 shadow-sm flex items-center gap-3">
          <div className="bg-amber-50 p-2.5 rounded-lg text-amber-600 shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Porsi Seblak</p>
            <h3 className="text-lg font-bold font-mono text-slate-800 mt-0.5">{stats.bowlsCount} Mangkuk</h3>
          </div>
        </div>

        {/* Transactions Done */}
        <div className="bg-white p-4 rounded-xl border border-slate-250/50 shadow-sm flex items-center gap-3">
          <div className="bg-indigo-50 p-2.5 rounded-lg text-indigo-600 shrink-0">
            <ShoppingCart className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Transaksi Lunas</p>
            <h3 className="text-lg font-bold font-mono text-indigo-800 mt-0.5">{stats.transactionCount} Nota</h3>
          </div>
        </div>

        {/* Active queue waiting cashier */}
        <div className="bg-white p-4 rounded-xl border border-slate-250/50 shadow-sm flex items-center gap-3">
          <div className="bg-red-50 p-2.5 rounded-lg text-red-600 shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Menunggu Kasir</p>
            <h3 className={`text-lg font-bold font-mono mt-0.5 ${stats.pendingCount > 0 ? 'text-red-600 animate-pulse' : 'text-slate-400'}`}>
              {stats.pendingCount} Antrean
            </h3>
          </div>
        </div>

      </div>

      {/* Advanced Double Column analysis layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* TOP SELLING TOPPINGS CHART */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/65 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-600" />
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Top 5 Topping Seblak Terpopuler</h3>
          </div>

          {topToppings.length === 0 ? (
            <p className="text-xs text-slate-400 italic py-8 text-center bg-slate-50 rounded-lg">Belum ada topping tercatat lunas hari ini.</p>
          ) : (
            <div className="space-y-3.5">
              {topToppings.map((tp, i) => {
                const maxCount = Math.max(...topToppings.map(t => t.count));
                const percentageWidth = maxCount > 0 ? (tp.count / maxCount) * 100 : 0;

                return (
                  <div key={tp.id || tp.name} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-700 uppercase text-[11px]">{i + 1}. {tp.name}</span>
                      <span className="font-mono text-slate-500 font-bold">{tp.count} Pcs</span>
                    </div>
                    {/* Visual custom bar chart */}
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-amber-500 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${percentageWidth}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* SPICE LEVEL DISTRIBUTION CHART */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/65 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-red-600" />
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Distribusi Tingkat Ke-pedasan (Level)</h3>
          </div>

          {stats.transactionCount === 0 ? (
            <p className="text-xs text-slate-400 italic py-8 text-center bg-slate-50 rounded-lg">Belum ada statistik level cabai terjual.</p>
          ) : (
            <div className="space-y-2.5">
              {spiceStats.map((count, lvl) => {
                const totalLvlCount = spiceStats.reduce((s, c) => s + c, 0);
                const percent = totalLvlCount > 0 ? (count / totalLvlCount) * 100 : 0;
                
                const getLabelColor = (l: number) => {
                  if (l === 0) return 'bg-slate-100 text-slate-600';
                  if (l === 1) return 'bg-green-100 text-green-800';
                  if (l === 2) return 'bg-yellow-100 text-yellow-800';
                  if (l === 3) return 'bg-orange-100 text-orange-850';
                  if (l === 4) return 'bg-rose-100 text-rose-800';
                  return 'bg-red-500 text-white';
                };

                return (
                  <div key={lvl} className="flex items-center gap-3">
                    <span className={`text-[9px] font-bold font-mono py-1 rounded w-16 text-center shrink-0 uppercase tracking-wider ${getLabelColor(lvl)}`}>
                      LVL {lvl}
                    </span>
                    
                    {/* Visual Bar row */}
                    <div className="flex-1 bg-slate-100 h-3 rounded overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 rounded ${
                          lvl === 0 ? 'bg-slate-400' :
                          lvl === 1 ? 'bg-green-500' :
                          lvl === 2 ? 'bg-yellow-500' :
                          lvl === 3 ? 'bg-orange-500' :
                          lvl === 4 ? 'bg-rose-500' :
                          'bg-red-600 animate-pulse'
                        }`}
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>

                    <span className="text-[10px] font-mono font-bold text-slate-500 shrink-0 w-12 text-right">
                      {count} Porsi ({percent.toFixed(0)}%)
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* History log list simple */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ClipboardCheck className="w-4 h-4 text-slate-600" />
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Log Transaksi Hari Ini ({orders.filter(o => o.status !== 'draft').length})</h3>
          </div>
          <span className="text-[10px] text-slate-400 font-bold uppercase">Update Real-Time</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 text-[10px] font-black uppercase tracking-wider">
                <th className="py-2.5 px-3">ID Nota</th>
                <th className="py-2.5 px-3">Waktu</th>
                <th className="py-2.5 px-3">Nama Pelanggan</th>
                <th className="py-2.5 px-3">Ringkasan Mangkuk</th>
                <th className="py-2.5 px-3">Metode</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Jumlah</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.filter(o => o.status !== 'draft').slice(0, 8).map((or) => {
                const totalQty = or.items.reduce((s, it) => s + it.quantity, 0);
                const itemsStr = or.items.map(it => `${it.quantity}x ${it.name}`).join(', ');

                return (
                  <tr key={or.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-400">{or.id}</td>
                    <td className="py-2.5 px-3 text-[11px] text-slate-500">
                      {new Date(or.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-2.5 px-3 font-bold uppercase text-slate-800">{or.customerName}</td>
                    <td className="py-2.5 px-3 text-slate-500 truncate max-w-[180px]">{itemsStr}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-700">{or.paymentMethod || '-'}</td>
                    <td className="py-2.5 px-3 text-[9px] uppercase font-bold">
                      <span className={`px-2 py-0.5 rounded ${
                        or.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                        or.status === 'paid' ? 'bg-indigo-100 text-indigo-800' :
                        or.status === 'pending_payment' ? 'bg-amber-100 text-amber-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {or.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono font-black text-amber-700 text-right">{formatRupiah(or.totalPrice)}</td>
                  </tr>
                );
              })}
              {orders.filter(o => o.status !== 'draft').length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-slate-400 italic">Belum ada log transaksi.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
