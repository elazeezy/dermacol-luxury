"use client";
import { useState, useEffect } from 'react';
import { ChevronDown, Copy, MessageCircle, Megaphone, Check, TrendingUp, Users, Zap } from 'lucide-react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';

type AdPrice = {
  id: number;
  category: string;
  name: string;
  price: string;
  note: string | null;
  sort_order: number;
};

type AdCategory = {
  category: string;
  items: AdPrice[];
};

const CATEGORY_ICONS: Record<string, typeof TrendingUp> = {
  default: TrendingUp,
  "Instagram": Users,
  "TikTok": Zap,
};

const formatPrice = (price: string) => {
  const num = parseInt(price.replace(/,/g, ''));
  if (!isNaN(num)) return num.toLocaleString();
  return price;
};

export default function AdsPage() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [adCategories, setAdCategories] = useState<AdCategory[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    supabase
      .from('ad_prices')
      .select('*')
      .order('sort_order', { ascending: true })
      .then(({ data }) => {
        const rows = (data as AdPrice[]) || [];
        const grouped: Record<string, AdPrice[]> = {};
        rows.forEach(row => {
          if (!grouped[row.category]) grouped[row.category] = [];
          grouped[row.category].push(row);
        });
        setAdCategories(Object.entries(grouped).map(([category, items]) => ({ category, items })));
      });
  }, []);

  const isDark = mounted && theme === "dark";

  const handleCopy = () => {
    navigator.clipboard.writeText("2085491179");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
              ? "linear-gradient(135deg, #0d0d0d 0%, #111111 60%, #0a0d14 100%)"
              : "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 60%, #1a1a1a 100%)",
          }}
        >
          {/* Decorative orb */}
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-10 blur-3xl" style={{ background: "#FF85A1" }} />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full opacity-8 blur-3xl" style={{ background: "#FF85A1" }} />

          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-[0.7rem] flex items-center justify-center" style={{ background: "rgba(255,133,161,0.2)", border: "1px solid rgba(255,133,161,0.3)" }}>
                <Megaphone size={14} className="text-[#FF85A1]" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-[4px] text-white/50">
                Babygirl Dermacol
              </span>
            </div>
            <h1 className="text-[44px] md:text-[56px] font-black italic uppercase tracking-tighter text-white leading-none mb-3">
              Ads <span style={{ color: "#FF85A1" }}>Portal</span>
            </h1>
            <p className="text-white/50 text-[10px] font-bold uppercase tracking-[2.5px] mb-5">
              Scale your brand with our engaged audience.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-2">
              {[
                { label: "10K+ Reach" },
                { label: "High Engagement" },
                { label: "Fast Delivery" },
              ].map((s, i) => (
                <div
                  key={i}
                  className="px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-wider text-white/70 border border-white/10"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                >
                  {s.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 max-w-3xl mx-auto mt-8">

        {/* ── HOW IT WORKS ── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 p-5 rounded-[2rem] border"
          style={{
            background: isDark ? "rgba(255,133,161,0.06)" : "rgba(255,133,161,0.06)",
            borderColor: "rgba(255,133,161,0.16)",
          }}
        >
          <p className="text-[9px] font-black uppercase tracking-[3px] text-[#FF85A1] mb-4">How to Book</p>
          <div className="flex gap-4 flex-wrap">
            {[
              "1. Choose a package below",
              "2. Copy the account number",
              "3. Transfer & send receipt via WhatsApp",
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-2">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-black text-white shrink-0"
                  style={{ background: "#FF85A1" }}
                >
                  {i + 1}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--fg-sub)" }}>
                  {step.slice(3)}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── AD CATEGORIES ── */}
        <div className="space-y-8">
          {adCategories.map((cat, catIdx) => {
            const CatIcon = CATEGORY_ICONS[cat.category] ?? CATEGORY_ICONS.default;
            return (
              <motion.div
                key={catIdx}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: catIdx * 0.08 }}
              >
                {/* Category header */}
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-7 h-7 rounded-[0.6rem] flex items-center justify-center"
                    style={{ background: isDark ? "rgba(255,133,161,0.10)" : "rgba(26,26,26,0.06)" }}
                  >
                    <CatIcon size={13} style={{ color: isDark ? "#FF85A1" : "#1a1a1a" }} />
                  </div>
                  <h2
                    className="text-[12px] font-black uppercase tracking-[3px]"
                    style={{ color: "var(--fg-sub)" }}
                  >
                    {cat.category}
                  </h2>
                  <div className="flex-1 h-px ml-2" style={{ background: "var(--border)" }} />
                </div>

                {/* Items */}
                <div className="space-y-2">
                  {cat.items.map((ad) => {
                    const isOpen = selected === ad.name;
                    return (
                      <div
                        key={ad.id}
                        className="rounded-[1.8rem] overflow-hidden border transition-all"
                        style={{
                          background: "var(--bg-card)",
                          borderColor: isOpen ? "rgba(255,133,161,0.25)" : "var(--border-card)",
                          boxShadow: isOpen ? "0 4px 24px rgba(255,133,161,0.10)" : "var(--shadow-sm)",
                        }}
                      >
                        {/* Row header */}
                        <button
                          className="w-full flex justify-between items-center p-5 text-left"
                          onClick={() => setSelected(isOpen ? null : ad.name)}
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-0.5">
                              <p className="text-[12px] font-black uppercase tracking-wide" style={{ color: "var(--fg)" }}>
                                {ad.name}
                              </p>
                              {ad.note && (
                                <span className="text-[7px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#FF85A1]/10 text-[#FF85A1]">
                                  {ad.note}
                                </span>
                              )}
                            </div>
                            <p
                              className="text-[18px] md:text-[20px] font-black italic"
                              style={{ color: ad.price === "Contact Us" ? "#FF85A1" : "var(--fg)" }}
                            >
                              {ad.price === "Contact Us" ? "Contact Us" : `₦${formatPrice(ad.price)}`}
                            </p>
                          </div>

                          <motion.div
                            animate={{ rotate: isOpen ? 180 : 0 }}
                            transition={{ duration: 0.22 }}
                            className="w-9 h-9 rounded-xl flex items-center justify-center ml-4 shrink-0"
                            style={{
                              background: isOpen ? "rgba(255,133,161,0.12)" : "var(--bg-subtle)",
                              color: isOpen ? "#FF85A1" : "var(--fg-sub)",
                            }}
                          >
                            <ChevronDown size={16} />
                          </motion.div>
                        </button>

                        {/* Expanded content */}
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                              className="overflow-hidden"
                            >
                              <div
                                className="px-5 pb-6 pt-1 border-t"
                                style={{ borderColor: "var(--border)" }}
                              >
                                {/* Account copy box */}
                                <motion.div
                                  whileTap={{ scale: 0.98 }}
                                  onClick={handleCopy}
                                  className="flex justify-between items-center p-4 rounded-2xl cursor-pointer mb-4 border transition-all"
                                  style={{
                                    background: isDark ? "rgba(255,255,255,0.04)" : "rgba(26,26,26,0.03)",
                                    borderColor: copied ? "rgba(255,133,161,0.4)" : "var(--border)",
                                  }}
                                >
                                  <div>
                                    <p className="text-[9px] font-black text-[#FF85A1] uppercase tracking-widest mb-0.5">
                                      UBA Bank
                                    </p>
                                    <p className="text-[18px] font-mono font-bold" style={{ color: "var(--fg)" }}>
                                      2085491179
                                    </p>
                                    <p className="text-[9px] font-bold uppercase mt-0.5" style={{ color: "var(--fg-sub)" }}>
                                      Akakpo
                                    </p>
                                  </div>
                                  <div
                                    className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
                                    style={{
                                      background: copied ? "rgba(34,197,94,0.12)" : "rgba(255,133,161,0.10)",
                                    }}
                                  >
                                    {copied
                                      ? <Check size={16} className="text-green-500" />
                                      : <Copy size={16} className="text-[#FF85A1]" />}
                                  </div>
                                </motion.div>

                                {copied && (
                                  <motion.p
                                    initial={{ opacity: 0, y: -4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-[9px] font-black text-green-500 uppercase tracking-widest text-center mb-3"
                                  >
                                    Account number copied!
                                  </motion.p>
                                )}

                                {/* WhatsApp CTA */}
                                <motion.a
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.97 }}
                                  href={`https://wa.me/2348158942290?text=Hi!%20I%20just%20made%20a%20payment%20for%20the%20${encodeURIComponent(ad.name)}%20ad.%20Here%20is%20my%20receipt.`}
                                  className="w-full py-4 bg-[#FF85A1] text-white rounded-2xl text-[10px] font-black uppercase flex justify-center items-center gap-2 hover:opacity-90 transition-opacity shadow-lg"
                                  style={{ boxShadow: "0 8px 24px rgba(255,133,161,0.30)" }}
                                >
                                  Send Receipt on WhatsApp <MessageCircle size={14} />
                                </motion.a>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ── BOTTOM CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 p-6 rounded-[2rem] text-center border"
          style={{
            background: isDark ? "#111" : "#1a1a1a",
            borderColor: "rgba(255,133,161,0.15)",
          }}
        >
          <p className="text-[9px] font-black uppercase tracking-[4px] text-[#FF85A1] mb-2">Need custom pricing?</p>
          <h3 className="text-[22px] font-black italic uppercase tracking-tighter text-white mb-4">
            Let's Talk
          </h3>
          <motion.a
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            href="https://wa.me/2348158942290?text=Hi!%20I%20need%20a%20custom%20ad%20package."
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#FF85A1] text-white rounded-full text-[10px] font-black uppercase tracking-[3px] shadow-xl"
            style={{ boxShadow: "0 8px 32px rgba(255,133,161,0.35)" }}
          >
            <MessageCircle size={14} /> Chat on WhatsApp
          </motion.a>
        </motion.div>
      </div>
    </div>
  );
}
