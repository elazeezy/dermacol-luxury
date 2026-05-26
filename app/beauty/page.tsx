"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { useTheme } from 'next-themes';
import { services } from "@/data/servicesData";
import { ShoppingBag, X, ZoomIn, Calendar, Search, ArrowUpDown, Loader2, Sparkles, ArrowUpRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';

type Wig = {
  id: number;
  name: string;
  type: string;
  inches: string;
  old_price: string;
  new_price: number;
  media_url: string;
  is_video: boolean;
};

export default function BeautyPage() {
  const { addToCart } = useCart();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [wigs, setWigs] = useState<Wig[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"none" | "low" | "high">("none");

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    supabase
      .from('products')
      .select('*')
      .eq('category', 'beauty')
      .then(({ data }) => {
        setWigs((data as Wig[]) || []);
        setLoading(false);
      });
  }, []);

  const isDark = mounted && theme === "dark";

  const filteredWigs = useMemo(() => {
    let result = wigs.filter((wig) =>
      wig.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wig.type.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (sortOrder === "low") result.sort((a, b) => a.new_price - b.new_price);
    else if (sortOrder === "high") result.sort((a, b) => b.new_price - a.new_price);
    return result;
  }, [wigs, searchQuery, sortOrder]);

  return (
    <div
      className="min-h-screen pb-8 transition-colors duration-300"
      style={{ background: "var(--bg)", color: "var(--fg)" }}
    >
      {/* ── HERO HEADER ── */}
      <div className="relative overflow-hidden">
        <div
          className="px-5 pt-14 pb-10 md:pt-16 md:pb-12"
          style={{
            background: isDark
              ? "linear-gradient(135deg, #1a0a10 0%, #0d0d0d 50%, #0a0f1a 100%)"
              : "linear-gradient(135deg, #FF85A1 0%, #ff6b8e 60%, #f97316 100%)",
          }}
        >
          {/* Decorative orbs */}
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full opacity-20 blur-3xl" style={{ background: "#ffffff" }} />
          <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full opacity-15 blur-2xl" style={{ background: isDark ? "#FF85A1" : "#ffffff" }} />

          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-[0.7rem] flex items-center justify-center bg-white/15 backdrop-blur-sm">
                <Sparkles size={15} className="text-white" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-[4px] text-white/70">
                Beauty Concept
              </span>
            </div>
            <h1 className="text-[44px] md:text-[56px] font-black italic uppercase tracking-tighter text-white leading-none mb-3">
              Wig<span className="opacity-60">store</span>
            </h1>
            <p className="text-white/70 text-[10px] font-bold uppercase tracking-[2.5px]">
              Shop quality and classy wigs from our collection
            </p>

            {/* Stats row */}
            <div className="flex gap-4 mt-5">
              {["500+ Wigs", "Premium Quality", "Fast Delivery"].map((s, i) => (
                <div
                  key={i}
                  className="px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-wider text-white border border-white/20"
                  style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)" }}
                >
                  {s}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 max-w-3xl mx-auto">
        {/* ── SEARCH & FILTER ── */}
        <div className="flex gap-2 mt-6 mb-7">
          <div className="relative flex-1">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2"
              size={15}
              style={{ color: "var(--fg-sub)" }}
            />
            <input
              type="text"
              placeholder="Search wigs, type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-4 pl-11 rounded-2xl text-xs font-bold outline-none transition-all theme-input"
              style={{ background: "var(--bg-card)", color: "var(--fg)", border: "1px solid var(--border)" }}
            />
          </div>
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() => setSortOrder(sortOrder === "low" ? "high" : sortOrder === "high" ? "none" : "low")}
            className="px-4 py-3 rounded-2xl flex items-center gap-2 text-[10px] font-black uppercase transition-all border"
            style={{
              background: "var(--bg-card)",
              color: sortOrder !== "none" ? "#FF85A1" : "var(--fg-sub)",
              border: `1px solid ${sortOrder !== "none" ? "rgba(255,133,161,0.3)" : "var(--border)"}`,
            }}
          >
            <ArrowUpDown size={13} style={{ color: sortOrder !== "none" ? "#FF85A1" : "var(--fg-sub)" }} />
            {sortOrder === "low" ? "Low→High" : sortOrder === "high" ? "High→Low" : "Sort"}
          </motion.button>
        </div>

        {/* ── WIG GRID ── */}
        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2 size={30} className="animate-spin text-[#FF85A1]" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredWigs.length > 0 ? (
                filteredWigs.map((wig) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.92 }}
                    key={wig.id}
                    className="flex flex-col rounded-[2rem] overflow-hidden border transition-all"
                    style={{
                      background: "var(--bg-card)",
                      border: "1px solid var(--border-card)",
                      boxShadow: "var(--shadow-sm)",
                    }}
                  >
                    {/* Media */}
                    <div
                      className="aspect-[4/5] overflow-hidden relative group cursor-pointer"
                      onClick={() => setSelectedImage(wig.media_url)}
                    >
                      {wig.is_video ? (
                        <video src={wig.media_url} className="w-full h-full object-cover" autoPlay muted loop playsInline />
                      ) : (
                        <img src={wig.media_url} alt={wig.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-106" />
                      )}
                      <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                          <ZoomIn className="text-white" size={18} />
                        </div>
                      </div>
                      {/* Type pill overlay */}
                      {wig.type && (
                        <div className="absolute top-3 left-3 px-2 py-1 rounded-full text-[7px] font-black uppercase tracking-wider text-white bg-[#FF85A1]">
                          {wig.type}
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="p-3.5 flex flex-col flex-1">
                      <h3 className="text-[11px] font-black uppercase leading-tight mb-1.5" style={{ color: "var(--fg)" }}>
                        {wig.name}
                      </h3>

                      {wig.inches && (
                        <span
                          className="self-start text-[8px] font-bold uppercase px-2 py-0.5 rounded-full mb-2"
                          style={{
                            background: isDark ? "rgba(255,133,161,0.12)" : "rgba(224,242,254,0.9)",
                            color: isDark ? "#FF85A1" : "#1A1A1A",
                          }}
                        >
                          {wig.inches}
                        </span>
                      )}

                      <div className="flex justify-between items-center mt-auto pt-2 border-t" style={{ borderColor: "var(--border)" }}>
                        <div className="flex flex-col">
                          {wig.old_price && wig.old_price !== "N/A" && (
                            <span className="text-[8px] line-through" style={{ color: "var(--fg-muted)" }}>
                              ₦{wig.old_price}
                            </span>
                          )}
                          <span className="text-sm font-black text-[#FF85A1]">
                            ₦{wig.new_price.toLocaleString()}
                          </span>
                        </div>
                        <motion.button
                          whileTap={{ scale: 0.87 }}
                          whileHover={{ scale: 1.05 }}
                          onClick={() => addToCart({
                            id: `wig-${wig.id}`,
                            name: `${wig.name}${wig.type ? ` (${wig.type})` : ''}`,
                            price: wig.new_price,
                            category: 'beauty'
                          })}
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-md transition-all"
                          style={{ background: "#1A1A1A" }}
                        >
                          <ShoppingBag size={13} />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-2 md:col-span-3 py-24 text-center">
                  <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: "var(--bg-subtle)" }}>
                    <Search size={24} style={{ color: "var(--fg-muted)" }} />
                  </div>
                  <p className="font-bold text-sm uppercase tracking-widest" style={{ color: "var(--fg-muted)" }}>
                    No wigs found
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* ── SERVICES SECTION ── */}
        <div className="mt-16 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1 h-8 rounded-full bg-[#FF85A1]" />
            <div>
              <p className="text-[8px] font-black uppercase tracking-[4px] text-[#FF85A1]">Professional</p>
              <h2 className="text-[22px] md:text-[26px] font-black italic uppercase tracking-tighter leading-none" style={{ color: "var(--fg)" }}>
                Book a Service
              </h2>
            </div>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[2px] mt-3 mb-6" style={{ color: "var(--fg-sub)" }}>
            Professional styling services — book via WhatsApp
          </p>
        </div>

        <div className="space-y-2 md:grid md:grid-cols-2 md:gap-2 md:space-y-0">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.04, duration: 0.35 }}
              className="flex justify-between items-center p-4 rounded-[1.5rem] border transition-all"
              style={{
                background: "var(--bg-card)",
                borderColor: "var(--border-card)",
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ background: "#FF85A1" }}
                />
                <span className="text-[11px] font-black uppercase tracking-wide" style={{ color: "var(--fg)" }}>
                  {service}
                </span>
              </div>
              <motion.a
                whileTap={{ scale: 0.92 }}
                href={`https://wa.me/2348158942290?text=Hello%20Dermacol,%20I%20want%20to%20book%20a%20slot%20for%20${encodeURIComponent(service)}`}
                className="text-[8px] font-black uppercase px-4 py-2.5 rounded-xl flex items-center gap-1.5 text-white transition-all"
                style={{ background: "#FF85A1" }}
              >
                Book <Calendar size={10} />
              </motion.a>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── LIGHTBOX ── */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[500] bg-black/95 flex items-center justify-center p-4 backdrop-blur-md"
            onClick={() => setSelectedImage(null)}
          >
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="absolute top-6 right-6 p-3 rounded-full bg-white/10 text-white backdrop-blur-sm border border-white/15"
              onClick={() => setSelectedImage(null)}
            >
              <X size={20} />
            </motion.button>
            <motion.div
              initial={{ scale: 0.88, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.88, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 260 }}
              className="max-w-full max-h-[88vh] rounded-3xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedImage.endsWith('.mp4') ? (
                <video src={selectedImage} controls autoPlay className="max-w-full max-h-[88vh] rounded-3xl" />
              ) : (
                <img src={selectedImage} alt="Preview" className="max-w-full max-h-[88vh] object-contain rounded-3xl" />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
