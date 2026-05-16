"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, ShoppingBag, Loader2, Calendar, Award } from 'lucide-react';

type Order = {
  id: number;
  total_amount: number;
  status: string;
  confirmed_at: string;
  created_at: string;
};

type Period = 'daily' | 'weekly' | 'monthly' | 'yearly';

function getLast7Days() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });
}

function getWeekNumber(d: Date) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

function getWeekStart(d: Date) {
  const s = new Date(d);
  s.setDate(d.getDate() - d.getDay() + 1);
  return s.toISOString().slice(0, 10);
}

function getWeekEnd(d: Date) {
  const e = new Date(d);
  e.setDate(d.getDate() - d.getDay() + 7);
  return e.toISOString().slice(0, 10);
}

function getLast8Weeks() {
  return Array.from({ length: 8 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (7 - i) * 7);
    return {
      label: `W${getWeekNumber(d)} '${d.getFullYear().toString().slice(2)}`,
      start: getWeekStart(d),
      end: getWeekEnd(d),
    };
  });
}

function getLast12Months() {
  return Array.from({ length: 12 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (11 - i));
    return {
      label: d.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' }),
      year: d.getFullYear(),
      month: d.getMonth(),
    };
  });
}

function fmt(amount: number) {
  if (amount >= 1_000_000) return `₦${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `₦${(amount / 1_000).toFixed(0)}k`;
  return `₦${amount}`;
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 shadow-2xl">
      <p className="text-gray-500 text-[10px] font-black uppercase tracking-wider mb-1">{label}</p>
      <p className="text-white font-black text-base">₦{payload[0].value.toLocaleString()}</p>
      <p className="text-gray-600 text-[10px] mt-0.5">
        {payload[0].payload.count} order{payload[0].payload.count !== 1 ? 's' : ''}
      </p>
    </div>
  );
}

export default function AdminRevenuePage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<Period>('monthly');

  useEffect(() => {
    supabase
      .from('orders')
      .select('id, total_amount, status, confirmed_at, created_at')
      .eq('status', 'confirmed')
      .order('confirmed_at', { ascending: true })
      .then(({ data }) => {
        setOrders((data as Order[]) || []);
        setLoading(false);
      });
  }, []);

  const buildDaily = () =>
    getLast7Days().map(day => {
      const dayOrders = orders.filter(o => o.confirmed_at?.slice(0, 10) === day);
      return {
        label: new Date(day).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric' }),
        revenue: dayOrders.reduce((s, o) => s + o.total_amount, 0),
        count: dayOrders.length,
      };
    });

  const buildWeekly = () =>
    getLast8Weeks().map(({ label, start, end }) => {
      const weekOrders = orders.filter(o => {
        const d = o.confirmed_at?.slice(0, 10) || '';
        return d >= start && d <= end;
      });
      return { label, revenue: weekOrders.reduce((s, o) => s + o.total_amount, 0), count: weekOrders.length };
    });

  const buildMonthly = () =>
    getLast12Months().map(({ label, year, month }) => {
      const monthOrders = orders.filter(o => {
        const d = new Date(o.confirmed_at);
        return d.getFullYear() === year && d.getMonth() === month;
      });
      return { label, revenue: monthOrders.reduce((s, o) => s + o.total_amount, 0), count: monthOrders.length };
    });

  const buildYearly = () => {
    const years = [...new Set(orders.map(o => new Date(o.confirmed_at).getFullYear()))].sort();
    if (years.length === 0) years.push(new Date().getFullYear());
    return years.map(year => {
      const yearOrders = orders.filter(o => new Date(o.confirmed_at).getFullYear() === year);
      return { label: String(year), revenue: yearOrders.reduce((s, o) => s + o.total_amount, 0), count: yearOrders.length };
    });
  };

  const chartData = { daily: buildDaily(), weekly: buildWeekly(), monthly: buildMonthly(), yearly: buildYearly() }[period];

  const now = new Date();
  const thisWeekStart = getWeekStart(now);
  const thisWeekEnd = getWeekEnd(now);

  const todayTotal = orders.filter(o => o.confirmed_at?.slice(0, 10) === now.toISOString().slice(0, 10)).reduce((s, o) => s + o.total_amount, 0);
  const weekTotal = orders.filter(o => { const d = o.confirmed_at?.slice(0, 10) || ''; return d >= thisWeekStart && d <= thisWeekEnd; }).reduce((s, o) => s + o.total_amount, 0);
  const monthTotal = orders.filter(o => { const d = new Date(o.confirmed_at); return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth(); }).reduce((s, o) => s + o.total_amount, 0);
  const yearTotal = orders.filter(o => new Date(o.confirmed_at).getFullYear() === now.getFullYear()).reduce((s, o) => s + o.total_amount, 0);
  const allTimeTotal = orders.reduce((s, o) => s + o.total_amount, 0);
  const allTimeOrders = orders.length;

  const periodLabels: Record<Period, string> = {
    daily: 'Last 7 Days',
    weekly: 'Last 8 Weeks',
    monthly: 'Last 12 Months',
    yearly: 'All Years',
  };

  const periodButtons: { key: Period; short: string }[] = [
    { key: 'daily', short: '7D' },
    { key: 'weekly', short: '8W' },
    { key: 'monthly', short: '12M' },
    { key: 'yearly', short: 'All' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full py-40">
        <Loader2 size={28} className="animate-spin text-dermacol-pink" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto pb-28 md:pb-10">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-black text-white">Revenue</h1>
        <p className="text-gray-600 text-xs mt-0.5">Confirmed orders only</p>
      </div>

      {/* All-time banner */}
      <div className="bg-linear-to-r from-dermacol-pink/15 to-dermacol-pink/5 border border-dermacol-pink/20 rounded-2xl p-5 mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-dermacol-pink/20 rounded-xl">
            <Award size={18} className="text-dermacol-pink" />
          </div>
          <div>
            <p className="text-gray-500 text-[9px] font-black uppercase tracking-widest">All-Time Revenue</p>
            <p className="text-white font-black text-2xl mt-0.5">₦{allTimeTotal.toLocaleString()}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-gray-600 text-[9px] font-black uppercase tracking-widest">Orders</p>
          <p className="text-white font-black text-2xl mt-0.5">{allTimeOrders}</p>
        </div>
      </div>

      {/* Summary Cards — 2x2 grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {[
          { label: 'Today', value: todayTotal, color: 'text-dermacol-pink', icon: <Calendar size={13} className="text-dermacol-pink" /> },
          { label: 'This Week', value: weekTotal, color: 'text-blue-400', icon: <Calendar size={13} className="text-blue-400" /> },
          { label: 'This Month', value: monthTotal, color: 'text-green-400', icon: <TrendingUp size={13} className="text-green-400" /> },
          { label: 'This Year', value: yearTotal, color: 'text-yellow-400', icon: <TrendingUp size={13} className="text-yellow-400" /> },
        ].map(({ label, value, icon }) => (
          <div key={label} className="bg-[#1a1a1a] rounded-2xl p-4 border border-white/5">
            <div className="flex items-center gap-1.5 mb-2">
              {icon}
              <span className="text-gray-500 text-[9px] font-black uppercase tracking-wider">{label}</span>
            </div>
            <p className="text-white font-black text-xl md:text-2xl">{fmt(value)}</p>
          </div>
        ))}
      </div>

      {/* Bar Chart */}
      <div className="bg-[#1a1a1a] rounded-2xl p-5 border border-white/5">
        {/* Period selector */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-white font-black text-sm">Revenue Chart</p>
            <p className="text-gray-600 text-[10px] mt-0.5">{periodLabels[period]}</p>
          </div>
          <div className="flex gap-1.5">
            {periodButtons.map(({ key, short }) => (
              <button
                key={key}
                onClick={() => setPeriod(key)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                  period === key
                    ? 'bg-dermacol-pink text-white'
                    : 'bg-white/5 text-gray-500 hover:text-white hover:bg-white/10'
                }`}
              >
                {short}
              </button>
            ))}
          </div>
        </div>

        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={chartData} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff06" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: '#6b7280', fontSize: 9, fontWeight: 700 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={fmt}
              tick={{ fill: '#6b7280', fontSize: 9, fontWeight: 700 }}
              axisLine={false}
              tickLine={false}
              width={48}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
            <Bar dataKey="revenue" radius={[5, 5, 0, 0]} fill="#FF85A1" opacity={0.85} />
          </BarChart>
        </ResponsiveContainer>

        {chartData.every(d => d.revenue === 0) && (
          <p className="text-center text-gray-700 text-xs font-bold mt-3">
            No confirmed orders in this period yet
          </p>
        )}
      </div>
    </div>
  );
}
