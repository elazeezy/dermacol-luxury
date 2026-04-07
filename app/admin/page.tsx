"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { MessageCircle, RefreshCw, Check, X, Clock, ShoppingBag, TrendingUp, Loader2 } from 'lucide-react';

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

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>('all');
  const [updating, setUpdating] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);

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

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleConfirm = async (id: number) => {
    setUpdating(id);
    await supabase
      .from('orders')
      .update({ status: 'confirmed', confirmed_at: new Date().toISOString() })
      .eq('id', id);
    setOrders(prev =>
      prev.map(o => o.id === id ? { ...o, status: 'confirmed', confirmed_at: new Date().toISOString() } : o)
    );
    setUpdating(null);
  };

  const handleCancel = async (id: number) => {
    setUpdating(id);
    await supabase.from('orders').update({ status: 'cancelled' }).eq('id', id);
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'cancelled' } : o));
    setUpdating(null);
  };

  // Summary stats
  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const confirmedCount = orders.filter(o => o.status === 'confirmed').length;
  const todayRevenue = orders
    .filter(o => {
      const today = new Date().toDateString();
      return o.status === 'confirmed' && new Date(o.confirmed_at || '').toDateString() === today;
    })
    .reduce((sum, o) => sum + o.total_amount, 0);

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) +
      ' · ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  };

  const statusConfig = {
    pending: { label: 'Pending', color: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20' },
    confirmed: { label: 'Confirmed', color: 'bg-green-400/10 text-green-400 border-green-400/20' },
    cancelled: { label: 'Cancelled', color: 'bg-red-400/10 text-red-400 border-red-400/20' },
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-white">Orders</h1>
          <p className="text-gray-500 text-sm mt-1">{orders.length} total orders</p>
        </div>
        <button
          onClick={() => fetchOrders(true)}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl text-xs font-bold transition-all"
        >
          <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-[#1a1a1a] rounded-2xl p-5 border border-white/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-yellow-400/10 rounded-lg">
              <Clock size={16} className="text-yellow-400" />
            </div>
            <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">Pending</span>
          </div>
          <p className="text-3xl font-black text-white">{pendingCount}</p>
          <p className="text-gray-600 text-xs mt-1">Awaiting confirmation</p>
        </div>

        <div className="bg-[#1a1a1a] rounded-2xl p-5 border border-white/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-green-400/10 rounded-lg">
              <ShoppingBag size={16} className="text-green-400" />
            </div>
            <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">Confirmed</span>
          </div>
          <p className="text-3xl font-black text-white">{confirmedCount}</p>
          <p className="text-gray-600 text-xs mt-1">Successfully processed</p>
        </div>

        <div className="bg-[#1a1a1a] rounded-2xl p-5 border border-white/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-[#FF85A1]/10 rounded-lg">
              <TrendingUp size={16} className="text-[#FF85A1]" />
            </div>
            <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">Today's Revenue</span>
          </div>
          <p className="text-3xl font-black text-white">₦{todayRevenue.toLocaleString()}</p>
          <p className="text-gray-600 text-xs mt-1">From confirmed orders</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {(['all', 'pending', 'confirmed', 'cancelled'] as Filter[]).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
              filter === f
                ? 'bg-[#FF85A1] text-white'
                : 'bg-white/5 text-gray-500 hover:text-white hover:bg-white/10'
            }`}
          >
            {f} {f !== 'all' && `(${orders.filter(o => o.status === f).length})`}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-[#FF85A1]" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <ShoppingBag size={40} className="mx-auto text-gray-700 mb-3" />
          <p className="text-gray-600 font-bold">No orders yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(order => (
            <div
              key={order.id}
              className={`bg-[#1a1a1a] rounded-2xl p-6 border transition-all ${
                order.status === 'pending'
                  ? 'border-yellow-400/20'
                  : order.status === 'confirmed'
                  ? 'border-green-400/10'
                  : 'border-white/5'
              }`}
            >
              <div className="flex items-start justify-between gap-4">

                {/* Left: Order Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <span className="text-white font-black text-sm">{order.order_ref}</span>
                    <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full border ${statusConfig[order.status].color}`}>
                      {statusConfig[order.status].label}
                    </span>
                    <span className="text-[10px] font-bold text-gray-600 uppercase bg-white/5 px-2 py-1 rounded-lg">
                      {order.category}
                    </span>
                  </div>

                  {/* Customer */}
                  <div className="flex items-center gap-4 mb-3">
                    <div>
                      <p className="text-white font-bold text-sm">{order.customer_name}</p>
                      <a
                        href={`https://wa.me/${order.customer_whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-[#FF85A1] text-xs font-bold hover:underline mt-0.5"
                      >
                        <MessageCircle size={11} />
                        {order.customer_whatsapp}
                      </a>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {order.items.map((item, i) => (
                      <span key={i} className="text-[11px] text-gray-400 bg-white/5 px-3 py-1 rounded-lg font-medium">
                        {item.name} — ₦{item.price.toLocaleString()}
                      </span>
                    ))}
                  </div>

                  <p className="text-gray-600 text-[11px]">{formatTime(order.created_at)}</p>
                </div>

                {/* Right: Total + Actions */}
                <div className="flex flex-col items-end gap-3 shrink-0">
                  <p className="text-white font-black text-xl">₦{order.total_amount.toLocaleString()}</p>

                  {order.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleCancel(order.id)}
                        disabled={updating === order.id}
                        className="flex items-center gap-1.5 px-3 py-2 bg-red-400/10 hover:bg-red-400/20 text-red-400 rounded-xl text-xs font-black transition-all disabled:opacity-40"
                      >
                        {updating === order.id ? <Loader2 size={12} className="animate-spin" /> : <X size={12} />}
                        Cancel
                      </button>
                      <button
                        onClick={() => handleConfirm(order.id)}
                        disabled={updating === order.id}
                        className="flex items-center gap-1.5 px-4 py-2 bg-green-400 hover:bg-green-300 text-black rounded-xl text-xs font-black transition-all disabled:opacity-40"
                      >
                        {updating === order.id ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                        Confirm
                      </button>
                    </div>
                  )}

                  {order.status === 'confirmed' && order.confirmed_at && (
                    <p className="text-green-400 text-[10px] font-bold">
                      Confirmed {formatTime(order.confirmed_at)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
