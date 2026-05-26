"use client";
import { useEffect, useState } from 'react';
import { ShoppingBag, Utensils, Star, Clock, Loader2, Flame, Search } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';

type FoodItem = {
  id: number;
  name: string;
  new_price: number;
  media_url: string;
};

export default function KitchenPage() {
  const { addToCart } = useCart();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [foodMenu, setFoodMenu] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [addedId, setAddedId] = useState<number | null>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    supabase
      .from('products')
      .select('id, name, new_price, media_url')
      .eq('category', 'kitchen')
      .order('new_price', { ascending: true })
      .then(({ data }) => {
        setFoodMenu((data as FoodItem[]) || []);
        setLoading(false);
      });
  }, []);

  const isDark = mounted && theme === "dark";

  const filtered = foodMenu.filter(f =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = (food: FoodItem) => {
    addToCart({ id: `food-${food.id}`, name: food.name, price: food.new_price, category: 'kitchen' });
    setAddedId(food.id);
    setTimeout(() => setAddedId(null), 1200);
  };

  return (
    <div
      className="min-h-screen pb-8 transition-colors duration-300"
      style={{ background: "var(--bg)", color: "var(--fg)" }}
    >
      {/* ── HERO HEADER ── */}
      <div className="relative overflow-hidden">
        <div
          className="px-5 pt-14 pb-10 md:pt-16"
          style={{
            background: isDark
              ? "linear-gradient(135deg, #1a0e00 0%, #0d0d0d 60%, #0d0d0d 100%)"
              : "linear-gradient(135deg, #f97316 0%, #ea580c 50%, #dc2626 100%)",
          }}
        >
          {/* Decorative orbs */}
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-20 blur-3xl" style={{ background: "#ffffff" }} />
          <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full opacity-15 blur-2xl" style={{ background: isDark ? "#f97316" : "#ffffff" }} />

          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-[0.7rem] flex items-center justify-center bg-white/15 backdrop-blur-sm">
                <Utensils size={14} className="text-white" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-[4px] text-white/70">
                Dbolicious Kitchen
              </span>
            </div>
            <h1 className="text-[44px] md:text-[56px] font-black italic uppercase tracking-tighter text-white leading-none mb-3">
              Dbo<span className="opacity-60">licious</span>
            </h1>
            <p className="text-white/70 text-[10px] font-bold uppercase tracking-[2.5px] italic mb-5">
              "Homemade delicacies, delivered with love."
            </p>

            {/* Chips */}
            <div className="flex flex-wrap gap-2">
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-wider text-white border border-white/20"
                style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)" }}
              >
                <Clock size={10} /> 30–45 Mins
              </div>
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-wider text-white border border-white/20"
                style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)" }}
              >
                <Star size={10} fill="currentColor" /> 5.0 Rated
              </div>
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-wider text-white border border-white/20"
                style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)" }}
              >
                <Flame size={10} /> 30+ Dishes
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 max-w-3xl mx-auto">
        {/* ── SEARCH ── */}
        <div className="relative mt-6 mb-7">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2"
            size={15}
            style={{ color: "var(--fg-sub)" }}
          />
          <input
            type="text"
            placeholder="Search dishes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-4 pl-11 rounded-2xl text-xs font-bold outline-none transition-all"
            style={{ background: "var(--bg-card)", color: "var(--fg)", border: "1px solid var(--border)" }}
          />
        </div>

        {/* ── MENU LABEL ── */}
        <div className="flex items-center gap-2 mb-5">
          <div className="w-1 h-7 rounded-full bg-orange-500" />
          <div>
            <p className="text-[8px] font-black uppercase tracking-[4px] text-orange-500">Today's</p>
            <h2 className="text-[18px] font-black italic uppercase tracking-tighter leading-none" style={{ color: "var(--fg)" }}>
              Full Menu
            </h2>
          </div>
          <div className="ml-auto text-[9px] font-black uppercase tracking-widest" style={{ color: "var(--fg-muted)" }}>
            {filtered.length} items
          </div>
        </div>

        {/* ── GRID ── */}
        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2 size={30} className="animate-spin text-orange-500" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {filtered.map((food, index) => (
                <motion.div
                  layout
                  key={food.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ delay: index * 0.06, duration: 0.4 }}
                  className="flex flex-col rounded-[2rem] overflow-hidden border transition-all"
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-card)",
                    boxShadow: "var(--shadow-sm)",
                  }}
                >
                  {/* Image */}
                  <div className="aspect-square overflow-hidden relative group">
                    <img
                      src={food.media_url}
                      className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-110"
                      alt={food.name}
                    />
                    {/* Warm gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60" />
                    {/* Price overlay bottom */}
                    <div className="absolute bottom-3 left-3">
                      <span className="text-[13px] font-black text-white drop-shadow-md">
                        ₦{food.new_price.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-3 flex items-center justify-between">
                    <h4
                      className="font-black text-[11px] uppercase leading-tight flex-1 pr-2"
                      style={{ color: "var(--fg)" }}
                    >
                      {food.name}
                    </h4>
                    <AnimatePresence mode="wait">
                      <motion.button
                        key={addedId === food.id ? "added" : "idle"}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        whileTap={{ scale: 0.87 }}
                        onClick={() => handleAdd(food)}
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-md transition-all shrink-0"
                        style={{
                          background: addedId === food.id ? "#22c55e" : "#f97316",
                        }}
                      >
                        {addedId === food.id ? (
                          <Star size={13} fill="white" stroke="none" />
                        ) : (
                          <ShoppingBag size={13} />
                        )}
                      </motion.button>
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {filtered.length === 0 && !loading && (
              <div className="col-span-2 md:col-span-3 py-24 text-center">
                <div
                  className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                  style={{ background: "var(--bg-subtle)" }}
                >
                  <Utensils size={24} style={{ color: "var(--fg-muted)" }} />
                </div>
                <p className="font-bold text-sm uppercase tracking-widest" style={{ color: "var(--fg-muted)" }}>
                  No dishes found
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── ORDER NOTE ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 p-5 rounded-[2rem] border"
          style={{
            background: isDark ? "rgba(249,115,22,0.07)" : "rgba(249,115,22,0.06)",
            borderColor: "rgba(249,115,22,0.18)",
          }}
        >
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-orange-500/15 shrink-0">
              <Flame size={16} className="text-orange-500" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[2px] text-orange-500 mb-1">
                How to Order
              </p>
              <p className="text-[10px] font-bold leading-relaxed" style={{ color: "var(--fg-sub)" }}>
                Add items to your cart, then confirm your order via WhatsApp. Payment via OPay to 8125666302 (Damilola). Free delivery for all website orders!
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
