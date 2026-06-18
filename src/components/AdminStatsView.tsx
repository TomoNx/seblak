import React, { useMemo, useState } from 'react';
import { Order } from '../types';
import { formatRupiah, TOPPINGS } from '../data';
import { 
  TrendingUp, ShoppingCart, Award, Flame, Zap, DollarSign, 
  BarChart2, ClipboardCheck, ChevronLeft, ChevronRight, Calendar
} from 'lucide-react';

interface AdminStatsViewProps {
  orders: Order[];
}

type QuickFilter = 'today' | 'week' | 'month' | '6months' | 'year' | 'custom' | 'all';

const PAGE_SIZE = 10;

function getDateRange(preset: QuickFilter): { from: string; to: string } {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const fmt = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const today = fmt(now);

  if (preset === 'today') return { from: today, to: today };
  if (preset === 'week') {
    const mon = new Date(now);
    mon.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1));
    return { from: fmt(mon), to: today };
  }
  if (preset === 'month') {
    return { from: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-01`, to: today };
  }
  if (preset === '6months') {
    const d = new Date(now);
    d.setMonth(d.getMonth() - 5);
    d.setDate(1);
    return { from: fmt(d), to: today };
  }
  if (preset === 'year') {
    return { from: `${now.getFullYear()}-01-01`, to: today };
  }
  return { from: '', to: '' };
}

export default function AdminStatsView({ orders }: AdminStatsViewProps) {
  const [quickFilter, setQuickFilter] = useState<QuickFilter>('today');
  const [filterDateFrom, setFilterDateFrom] = useState<string>('');
  const [filterDateTo, setFilterDateTo] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);

  // Derived date range based on quick filter or custom inputs
  const { from: activeFrom, to: activeTo } = useMemo(() => {
    if (quickFilter === 'custom') return { from: filterDateFrom, to: filterDateTo };
    if (quickFilter === 'all') return { from: '', to: '' };
    return getDateRange(quickFilter);
  }, [quickFilter, filterDateFrom, filterDateTo]);

  const handleQuickFilter = (f: QuickFilter) => {
    setQuickFilter(f);
    setCurrentPage(1);
  };

  const handleCustomDate = (field: 'from' | 'to', val: string) => {
    setQuickFilter('custom');
    if (field === 'from') setFilterDateFrom(val);
    else setFilterDateTo(val);
    setCurrentPage(1);
  };

  // Filter orders berdasarkan rentang tanggal aktif
  const filteredOrders = useMemo(() => {
    if (!activeFrom && !activeTo) return orders;
    return orders.filter(o => {
      const d = o.createdAt.slice(0, 10);
      if (activeFrom && d < activeFrom) return false;
      if (activeTo && d > activeTo) return false;
      return true;
    });
  }, [orders, activeFrom, activeTo]);

  // Reset pagination when filter changes
  const logOrders = filteredOrders.filter(o => o.status !== 'draft');
  const totalPages = Math.max(1, Math.ceil(logOrders.length / PAGE_SIZE));
  const pagedOrders = logOrders.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // Stats
  const stats = useMemo(() => {
    const paid = filteredOrders.filter(o => o.status === 'paid' || o.status === 'completed');
    const totalRev = paid.reduce((sum, o) => sum + o.totalPrice, 0);
    let totalBowls = 0;
    paid.forEach(o => o.items.forEach(it => { totalBowls += it.quantity; }));
    let tunai = 0, qris = 0, debit = 0;
    paid.forEach(o => {
      if (o.paymentMethod === 'Tunai') tunai++;
      if (o.paymentMethod === 'QRIS') qris++;
      if (o.paymentMethod === 'Debit') debit++;
    });
    const pending = filteredOrders.filter(o => o.status === 'pending_payment').length;
    return { revenue: totalRev, transactionCount: paid.length, bowlsCount: totalBowls, pendingCount: pending, paymentDistribution: { Tunai: tunai, QRIS: qris, Debit: debit } };
  }, [filteredOrders]);

  const topToppings = useMemo(() => {
    const paid = filteredOrders.filter(o => o.status === 'paid' || o.status === 'completed');
    const counts: { [k: string]: number } = {};
    paid.forEach(o => o.items.forEach(it => it.toppings?.forEach(t => { counts[t.name] = (counts[t.name] || 0) + t.quantity * it.quantity; })));
    return Object.entries(counts).map(([name, count]) => ({ name, count, id: TOPPINGS.find(t => t.name === name)?.id || '' })).sort((a, b) => b.count - a.count).slice(0, 5);
  }, [filteredOrders]);

  const spiceStats = useMemo(() => {
    const paid = filteredOrders.filter(o => o.status === 'paid' || o.status === 'completed');
    const counts = [0, 0, 0, 0, 0, 0];
    paid.forEach(o => o.items.forEach(it => { if (it.level !== undefined && it.level >= 0 && it.level <= 5) counts[it.level] += it.quantity; }));
    return counts;
  }, [filteredOrders]);

  const QUICK_FILTERS: { key: QuickFilter; label: string }[] = [
    { key: 'today', label: 'Hari Ini' },
    { key: 'week', label: 'Minggu Ini' },
    { key: 'month', label: 'Bulan Ini' },
    { key: '6months', label: '6 Bulan' },
    { key: 'year', label: 'Tahun Ini' },
    { key: 'all', label: 'Semua' },
  ];

  const filterLabel = useMemo(() => {
    if (quickFilter === 'all') return 'Semua Data';
    if (quickFilter === 'custom') return `${activeFrom || '?'} s/d ${activeTo || '?'}`;
    return QUICK_FILTERS.find(f => f.key === quickFilter)?.label || '';
  }, [quickFilter, activeFrom, activeTo]);

  return (
    <div className="p-4 md:p-6 bg-slate-50 space-y-5 h-full overflow-y-auto text-slate-800 w-full">
      
      {/* Header */}
      <div className="pb-3 border-b border-slate-200">
        <h1 className="text-xl font-black text-slate-800 uppercase flex items-center gap-1.5">
          <BarChart2 className="w-5 h-5 text-amber-600" />
          Dashboard Analitik
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">Ringkasan operasional • Seblak Jebred</p>
      </div>

      {/* === FILTER PANEL === */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
        {/* Quick presets */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1 shrink-0">
            <Calendar className="w-3 h-3" /> Periode:
          </span>
          {QUICK_FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => handleQuickFilter(f.key)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wide transition-all ${
                quickFilter === f.key
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Custom date range */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider shrink-0">Rentang Kustom:</span>
          <input
            type="date"
            value={quickFilter === 'custom' ? filterDateFrom : activeFrom}
            onChange={e => handleCustomDate('from', e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium outline-none focus:border-amber-500 text-slate-700"
          />
          <span className="text-[10px] text-slate-400 font-bold">s/d</span>
          <input
            type="date"
            value={quickFilter === 'custom' ? filterDateTo : activeTo}
            onChange={e => handleCustomDate('to', e.target.value)}
            min={quickFilter === 'custom' ? filterDateFrom : activeFrom}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium outline-none focus:border-amber-500 text-slate-700"
          />
        </div>

        {/* Active filter info bar */}
        <div className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          <p className="text-[10px] text-amber-800 font-black">
            📅 {filterLabel} — <span className="text-amber-600">{filteredOrders.length}</span> dari <span>{orders.length}</span> transaksi
          </p>
          {quickFilter !== 'all' && (
            <button
              onClick={() => handleQuickFilter('all')}
              className="text-[10px] font-black text-red-500 hover:text-red-700 transition-colors"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* === STATS CARDS === */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200/70 shadow-sm flex items-center gap-3">
          <div className="bg-emerald-50 p-2.5 rounded-lg text-emerald-600 shrink-0"><DollarSign className="w-5 h-5" /></div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Omzet Lunas</p>
            <h3 className="text-base font-bold font-mono text-emerald-600 mt-0.5">{formatRupiah(stats.revenue)}</h3>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200/70 shadow-sm flex items-center gap-3">
          <div className="bg-amber-50 p-2.5 rounded-lg text-amber-600 shrink-0"><TrendingUp className="w-5 h-5" /></div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Porsi Seblak</p>
            <h3 className="text-base font-bold font-mono text-slate-800 mt-0.5">{stats.bowlsCount} Mangkuk</h3>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200/70 shadow-sm flex items-center gap-3">
          <div className="bg-indigo-50 p-2.5 rounded-lg text-indigo-600 shrink-0"><ShoppingCart className="w-5 h-5" /></div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Transaksi Lunas</p>
            <h3 className="text-base font-bold font-mono text-indigo-800 mt-0.5">{stats.transactionCount} Nota</h3>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200/70 shadow-sm flex items-center gap-3">
          <div className="bg-red-50 p-2.5 rounded-lg text-red-600 shrink-0"><Zap className="w-5 h-5" /></div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Menunggu Bayar</p>
            <h3 className={`text-base font-bold font-mono mt-0.5 ${stats.pendingCount > 0 ? 'text-red-600 animate-pulse' : 'text-slate-400'}`}>
              {stats.pendingCount} Antrean
            </h3>
          </div>
        </div>
      </div>

      {/* === CHARTS === */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Top Toppings */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/65 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-600" />
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Top 5 Topping Terpopuler</h3>
          </div>
          {topToppings.length === 0 ? (
            <p className="text-xs text-slate-400 italic py-8 text-center bg-slate-50 rounded-lg">Belum ada data topping.</p>
          ) : (
            <div className="space-y-3.5">
              {topToppings.map((tp, i) => {
                const maxCount = Math.max(...topToppings.map(t => t.count));
                const pct = maxCount > 0 ? (tp.count / maxCount) * 100 : 0;
                return (
                  <div key={tp.id || tp.name} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-700 uppercase text-[11px]">{i + 1}. {tp.name}</span>
                      <span className="font-mono text-slate-500 font-bold">{tp.count} Pcs</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Spice Level */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/65 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-red-600" />
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Distribusi Level Kepedasan</h3>
          </div>
          {stats.transactionCount === 0 ? (
            <p className="text-xs text-slate-400 italic py-8 text-center bg-slate-50 rounded-lg">Belum ada data level.</p>
          ) : (
            <div className="space-y-2.5">
              {spiceStats.map((count, lvl) => {
                const total = spiceStats.reduce((s, c) => s + c, 0);
                const pct = total > 0 ? (count / total) * 100 : 0;
                const colors = ['bg-slate-100 text-slate-600', 'bg-green-100 text-green-800', 'bg-yellow-100 text-yellow-800', 'bg-orange-100 text-orange-900', 'bg-rose-100 text-rose-800', 'bg-red-500 text-white'];
                const barColors = ['bg-slate-400', 'bg-green-500', 'bg-yellow-500', 'bg-orange-500', 'bg-rose-500', 'bg-red-600 animate-pulse'];
                return (
                  <div key={lvl} className="flex items-center gap-3">
                    <span className={`text-[9px] font-bold font-mono py-1 rounded w-16 text-center shrink-0 uppercase tracking-wider ${colors[lvl]}`}>LVL {lvl}</span>
                    <div className="flex-1 bg-slate-100 h-3 rounded overflow-hidden">
                      <div className={`h-full transition-all duration-500 rounded ${barColors[lvl]}`} style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-slate-500 shrink-0 w-16 text-right">{count} ({pct.toFixed(0)}%)</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* === LOG TRANSAKSI + PAGINATION === */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ClipboardCheck className="w-4 h-4 text-slate-600" />
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
              Log Transaksi ({logOrders.length})
            </h3>
          </div>
          <span className="text-[10px] text-slate-400 font-bold uppercase">Update Real-Time</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 text-[10px] font-black uppercase tracking-wider">
                <th className="py-2.5 px-3">ID Nota</th>
                <th className="py-2.5 px-3">Tanggal & Waktu</th>
                <th className="py-2.5 px-3">Nama Pelanggan</th>
                <th className="py-2.5 px-3">Ringkasan</th>
                <th className="py-2.5 px-3">Metode</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Jumlah</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pagedOrders.map((or) => {
                const itemsStr = or.items.map(it => `${it.quantity}x ${it.name}`).join(', ');
                return (
                  <tr key={or.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-400">{or.id}</td>
                    <td className="py-2.5 px-3 text-[11px] text-slate-500 whitespace-nowrap">
                      {new Date(or.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}{' '}
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
                      }`}>{or.status}</span>
                    </td>
                    <td className="py-2.5 px-3 font-mono font-black text-amber-700 text-right">{formatRupiah(or.totalPrice)}</td>
                  </tr>
                );
              })}
              {logOrders.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400 italic text-xs">
                    Belum ada log transaksi{(activeFrom || activeTo) ? ' untuk periode ini.' : '.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <p className="text-[10px] text-slate-400 font-bold">
              Halaman <span className="text-slate-700">{currentPage}</span> dari <span className="text-slate-700">{totalPages}</span>
              {' '}· {logOrders.length} transaksi
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5 text-slate-600" />
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                // Smart pagination window
                let page = i + 1;
                if (totalPages > 5) {
                  if (currentPage <= 3) page = i + 1;
                  else if (currentPage >= totalPages - 2) page = totalPages - 4 + i;
                  else page = currentPage - 2 + i;
                }
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-7 h-7 rounded-lg text-[11px] font-black transition-colors ${
                      currentPage === page
                        ? 'bg-amber-500 text-slate-950'
                        : 'border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
