"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { MessageCircle, RefreshCw, Check, X, Clock, ShoppingBag, TrendingUp, Loader2, ChevronDown, ChevronUp } from 'lucide-react';

type Order = {
  id: number;
  order_ref: string;
  customer_name: string;
  customer_whatsapp: string;
  items: { id: string; name: string; price: number }[];
  total_amount: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  category: string;
  created_at: string;
  confirmed_at: string | null;
};

type Filter = 'all' | 'pending' | 'confirmed' | 'cancelled';

const statusConfig = {
  pending: { label: 'Pending', dot: 'bg-yellow-400', badge: 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20' },
  confirmed: { label: 'Confirmed', dot: 'bg-green-400', badge: 'bg-green-400/10 text-green-400 border border-green-400/20' },
  cancelled: { label: 'Cancelled', dot: 'bg-red-400', badge: 'bg-red-400/10 text-red-400 border border-red-400/20' },
};

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    + ' · ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

function formatTimeShort(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(mins / 60);
  const days = Math.floor(hrs / 24);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  if (hrs < 24) return `${hrs}h ago`;
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>('all');
  const [updating, setUpdating] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);

  const fetchOrders = async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    const { data } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    setOrders((data as Order[]) || []);
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleConfirm = async (id: number) => {
    setUpdating(id);
    await supabase.from('orders').update({ status: 'confirmed', confirmed_at: new Date().toISOString() }).eq('id', id);
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'confirmed', confirmed_at: new Date().toISOString() } : o));
    setUpdating(null);
  };

  const handleCancel = async (id: number) => {
    setUpdating(id);
    await supabase.from('orders').update({ status: 'cancelled' }).eq('id', id);
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'cancelled' } : o));
    setUpdating(null);
  };

  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const confirmedCount = orders.filter(o => o.status === 'confirmed').length;
  const todayRevenue = orders
    .filter(o => o.status === 'confirmed' && new Date(o.confirmed_at || '').toDateString() === new Date().toDateString())
    .reduce((sum, o) => sum + o.total_amount, 0);

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto pb-28 md:pb-10">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-white">Orders</h1>
          <p className="text-gray-600 text-xs mt-0.5">{orders.length} total orders</p>
        </div>
        <button
          onClick={() => fetchOrders(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 active:scale-95 text-gray-400 hover:text-white rounded-xl text-xs font-bold transition-all"
        >
          <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-[#1a1a1a] rounded-2xl p-4 border border-yellow-400/10">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-yellow-400 shrink-0" />
            <span className="text-gray-500 text-[9px] font-black uppercase tracking-wider truncate">Pending</span>
          </div>
          <p className="text-2xl md:text-3xl font-black text-white">{pendingCount}</p>
        </div>

        <div className="bg-[#1a1a1a] rounded-2xl p-4 border border-green-400/10">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-green-400 shrink-0" />
            <span className="text-gray-500 text-[9px] font-black uppercase tracking-wider truncate">Done</span>
          </div>
          <p className="text-2xl md:text-3xl font-black text-white">{confirmedCount}</p>
        </div>

        <div className="bg-[#1a1a1a] rounded-2xl p-4 border border-dermacol-pink/10">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-dermacol-pink shrink-0" />
            <span className="text-gray-500 text-[9px] font-black uppercase tracking-wider truncate">Today</span>
          </div>
          <p className="text-lg md:text-2xl font-black text-white">
            {todayRevenue === 0 ? '₦0' : todayRevenue >= 1000
              ? `₦${(todayRevenue / 1000).toFixed(0)}k`
              : `₦${todayRevenue.toLocaleString()}`}
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1 scrollbar-hide">
        {(['all', 'pending', 'confirmed', 'cancelled'] as Filter[]).map(f => {
          const count = f === 'all' ? orders.length : orders.filter(o => o.status === f).length;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                filter === f
                  ? 'bg-dermacol-pink text-white'
                  : 'bg-white/5 text-gray-500 hover:text-white hover:bg-white/10'
              }`}
            >
              {f}
              {f !== 'all' && count > 0 && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-lg font-black ${
                  filter === f ? 'bg-white/20' : 'bg-white/5'
                }`}>{count}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 size={28} className="animate-spin text-dermacol-pink" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24">
          <div className="p-5 bg-white/5 rounded-2xl inline-block mb-4">
            <ShoppingBag size={32} className="text-gray-700" />
          </div>
          <p className="text-gray-500 font-black text-sm">No orders here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(order => {
            const isExpanded = expanded === order.id;
            const cfg = statusConfig[order.status];
            return (
              <div
                key={order.id}
                className={`bg-[#1a1a1a] rounded-2xl border overflow-hidden transition-all ${
                  order.status === 'pending' ? 'border-yellow-400/15' :
                  order.status === 'confirmed' ? 'border-green-400/10' :
                  'border-white/5'
                }`}
              >
                {/* Order Row — always visible */}
                <button
                  onClick={() => setExpanded(isExpanded ? null : order.id)}
                  className="w-full flex items-center gap-3 p-4 text-left"
                >
                  {/* Status dot */}
                  <div className={`w-2 h-2 rounded-full shrink-0 ${cfg.dot}`} />

                  {/* Main info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span className="text-white font-black text-sm">{order.customer_name}</span>
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${cfg.badge}`}>
                        {cfg.label}
                      </span>
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-lg ${
                        order.category === 'beauty'
                          ? 'bg-dermacol-pink/10 text-dermacol-pink'
                          : 'bg-orange-400/10 text-orange-400'
                      }`}>
                        {order.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600 text-[10px] font-mono">{order.order_ref}</span>
                      <span className="text-gray-700 text-[10px]">·</span>
                      <span className="text-gray-600 text-[10px]">{formatTimeShort(order.created_at)}</span>
                    </div>
                  </div>

                  {/* Total + chevron */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-white font-black text-sm">₦{order.total_amount.toLocaleString()}</span>
                    {isExpanded
                      ? <ChevronUp size={14} className="text-gray-500" />
                      : <ChevronDown size={14} className="text-gray-500" />
                    }
                  </div>
                </button>

                {/* Expanded detail */}
                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-white/5 pt-4 space-y-4">

                    {/* WhatsApp */}
                    <a
                      href={`https://wa.me/${order.customer_whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 w-fit px-4 py-2.5 bg-green-400/10 hover:bg-green-400/20 text-green-400 rounded-xl text-xs font-black transition-all active:scale-95"
                    >
                      <MessageCircle size={13} />
                      WhatsApp · {order.customer_whatsapp}
                    </a>

                    {/* Items */}
                    <div className="space-y-1.5">
                      <p className="text-gray-600 text-[10px] font-black uppercase tracking-wider">Items Ordered</p>
                      {order.items.map((item, i) => (
                        <div key={i} className="flex items-center justify-between bg-white/5 rounded-xl px-3 py-2.5">
                          <span className="text-gray-300 text-xs font-medium">{item.name}</span>
                          <span className="text-white font-black text-xs">₦{item.price.toLocaleString()}</span>
                        </div>
                      ))}
                      <div className="flex items-center justify-between px-3 py-2">
                        <span className="text-gray-500 text-xs font-black uppercase">Total</span>
                        <span className="text-white font-black text-base">₦{order.total_amount.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Timestamps */}
                    <div className="text-gray-700 text-[10px] space-y-0.5">
                      <p>Ordered: {formatTime(order.created_at)}</p>
                      {order.confirmed_at && order.status === 'confirmed' && (
                        <p className="text-green-600">Confirmed: {formatTime(order.confirmed_at)}</p>
                      )}
                    </div>

                    {/* Actions */}
                    {order.status === 'pending' && (
                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => handleCancel(order.id)}
                          disabled={updating === order.id}
                          className="flex-1 flex items-center justify-center gap-1.5 py-3 bg-red-400/10 hover:bg-red-400/20 active:scale-95 text-red-400 rounded-xl text-xs font-black transition-all disabled:opacity-40"
                        >
                          {updating === order.id ? <Loader2 size={13} className="animate-spin" /> : <X size={13} />}
                          Cancel
                        </button>
                        <button
                          onClick={() => handleConfirm(order.id)}
                          disabled={updating === order.id}
                          className="flex-2 flex items-center justify-center gap-1.5 py-3 bg-green-400 hover:bg-green-300 active:scale-95 text-black rounded-xl text-xs font-black transition-all disabled:opacity-40"
                        >
                          {updating === order.id ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
                          Confirm Order
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
