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

// ── helpers ────────────────────────────────────────────────────────────────

function getLast7Days() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });
}

function getLast8Weeks() {
  return Array.from({ length: 8 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (7 - i) * 7);
    const week = `W${getWeekNumber(d)} '${d.getFullYear().toString().slice(2)}`;
    return { label: week, start: getWeekStart(d), end: getWeekEnd(d) };
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

function fmt(amount: number) {
  if (amount >= 1_000_000) return `₦${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `₦${(amount / 1_000).toFixed(0)}k`;
  return `₦${amount}`;
}

// ── custom tooltip ──────────────────────────────────────────────────────────

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#252525] border border-white/10 rounded-xl px-4 py-3 shadow-2xl">
      <p className="text-gray-400 text-[10px] font-bold uppercase mb-1">{label}</p>
      <p className="text-white font-black text-base">₦{payload[0].value.toLocaleString()}</p>
      <p className="text-gray-600 text-[10px] mt-0.5">{payload[0].payload.count} order{payload[0].payload.count !== 1 ? 's' : ''}</p>
    </div>
  );
}

// ── main component ──────────────────────────────────────────────────────────

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

  // ── chart data builders ────────────────────────────────────────────────

  const buildDaily = () => {
    const days = getLast7Days();
    return days.map(day => {
      const dayOrders = orders.filter(o => o.confirmed_at?.slice(0, 10) === day);
      return {
        label: new Date(day).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric' }),
        revenue: dayOrders.reduce((s, o) => s + o.total_amount, 0),
        count: dayOrders.length,
      };
    });
  };

  const buildWeekly = () => {
    return getLast8Weeks().map(({ label, start, end }) => {
      const weekOrders = orders.filter(o => {
        const d = o.confirmed_at?.slice(0, 10) || '';
        return d >= start && d <= end;
      });
      return {
        label,
        revenue: weekOrders.reduce((s, o) => s + o.total_amount, 0),
        count: weekOrders.length,
      };
    });
  };

  const buildMonthly = () => {
    return getLast12Months().map(({ label, year, month }) => {
      const monthOrders = orders.filter(o => {
        const d = new Date(o.confirmed_at);
        return d.getFullYear() === year && d.getMonth() === month;
      });
      return {
        label,
        revenue: monthOrders.reduce((s, o) => s + o.total_amount, 0),
        count: monthOrders.length,
      };
    });
  };

  const buildYearly = () => {
    const years = [...new Set(orders.map(o => new Date(o.confirmed_at).getFullYear()))].sort();
    if (years.length === 0) years.push(new Date().getFullYear());
    return years.map(year => {
      const yearOrders = orders.filter(o => new Date(o.confirmed_at).getFullYear() === year);
      return {
        label: String(year),
        revenue: yearOrders.reduce((s, o) => s + o.total_amount, 0),
        count: yearOrders.length,
      };
    });
  };

  const chartData = {
    daily: buildDaily(),
    weekly: buildWeekly(),
    monthly: buildMonthly(),
    yearly: buildYearly(),
  }[period];


  // ── summary stats ─────────────────────────────────────────────────────

  const now = new Date();

  const todayTotal = orders
    .filter(o => o.confirmed_at?.slice(0, 10) === now.toISOString().slice(0, 10))
    .reduce((s, o) => s + o.total_amount, 0);

  const thisWeekStart = getWeekStart(now);
  const thisWeekEnd = getWeekEnd(now);
  const weekTotal = orders
    .filter(o => { const d = o.confirmed_at?.slice(0, 10) || ''; return d >= thisWeekStart && d <= thisWeekEnd; })
    .reduce((s, o) => s + o.total_amount, 0);

  const monthTotal = orders
    .filter(o => {
      const d = new Date(o.confirmed_at);
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    })
    .reduce((s, o) => s + o.total_amount, 0);

  const yearTotal = orders
    .filter(o => new Date(o.confirmed_at).getFullYear() === now.getFullYear())
    .reduce((s, o) => s + o.total_amount, 0);

  const allTimeTotal = orders.reduce((s, o) => s + o.total_amount, 0);
  const allTimeOrders = orders.length;

  const periodLabels: Record<Period, string> = {
    daily: 'Last 7 Days',
    weekly: 'Last 8 Weeks',
    monthly: 'Last 12 Months',
    yearly: 'All Years',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full py-40">
        <Loader2 size={32} className="animate-spin text-dermacol-pink" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto pb-24 md:pb-8">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white">Revenue</h1>
        <p className="text-gray-500 text-sm mt-1">From confirmed orders only</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div className="bg-[#1a1a1a] rounded-2xl p-5 border border-white/5">
          <div className="flex items-center gap-2 mb-3">
            <Calendar size={14} className="text-dermacol-pink" />
            <span className="text-gray-500 text-[10px] font-black uppercase tracking-wider">Today</span>
          </div>
          <p className="text-3xl font-black text-white">₦{todayTotal.toLocaleString()}</p>
        </div>

        <div className="bg-[#1a1a1a] rounded-2xl p-5 border border-white/5">
          <div className="flex items-center gap-2 mb-3">
            <Calendar size={14} className="text-blue-400" />
            <span className="text-gray-500 text-[10px] font-black uppercase tracking-wider">This Week</span>
          </div>
          <p className="text-3xl font-black text-white">₦{weekTotal.toLocaleString()}</p>
        </div>

        <div className="bg-[#1a1a1a] rounded-2xl p-5 border border-white/5">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={14} className="text-green-400" />
            <span className="text-gray-500 text-[10px] font-black uppercase tracking-wider">This Month</span>
          </div>
          <p className="text-3xl font-black text-white">₦{monthTotal.toLocaleString()}</p>
        </div>

        <div className="bg-[#1a1a1a] rounded-2xl p-5 border border-white/5">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={14} className="text-yellow-400" />
            <span className="text-gray-500 text-[10px] font-black uppercase tracking-wider">This Year</span>
          </div>
          <p className="text-3xl font-black text-white">₦{yearTotal.toLocaleString()}</p>
        </div>
      </div>

      {/* All-time banner */}
      <div className="bg-dermacol-pink/10 border border-dermacol-pink/20 rounded-2xl p-5 mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-dermacol-pink/20 rounded-xl">
            <Award size={20} className="text-dermacol-pink" />
          </div>
          <div>
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-wider">All-Time Revenue</p>
            <p className="text-white font-black text-2xl mt-0.5">₦{allTimeTotal.toLocaleString()}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-gray-600 text-[10px] font-black uppercase tracking-wider">Total Orders</p>
          <p className="text-white font-black text-2xl mt-0.5 flex items-center gap-2">
            <ShoppingBag size={18} className="text-dermacol-pink" />
            {allTimeOrders}
          </p>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-white/5">
        {/* Period Tabs */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-white font-black text-sm">Revenue Chart</p>
            <p className="text-gray-600 text-xs mt-0.5">{periodLabels[period]}</p>
          </div>
          <div className="flex gap-2">
            {(['daily', 'weekly', 'monthly', 'yearly'] as Period[]).map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                  period === p
                    ? 'bg-dermacol-pink text-white'
                    : 'bg-white/5 text-gray-500 hover:text-white'
                }`}
              >
                {p === 'daily' ? '7D' : p === 'weekly' ? '8W' : p === 'monthly' ? '12M' : 'All'}
              </button>
            ))}
          </div>
        </div>

        {/* Chart */}
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: '#6b7280', fontSize: 10, fontWeight: 700 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={fmt}
              tick={{ fill: '#6b7280', fontSize: 10, fontWeight: 700 }}
              axisLine={false}
              tickLine={false}
              width={55}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
            <Bar
              dataKey="revenue"
              radius={[6, 6, 0, 0]}
              fill="#2a2a2a"
            />
          </BarChart>
        </ResponsiveContainer>

        {/* No data state */}
        {chartData.every(d => d.revenue === 0) && (
          <p className="text-center text-gray-700 text-sm font-bold mt-4">
            No confirmed orders in this period yet
          </p>
        )}
      </div>
    </div>
  );
}
