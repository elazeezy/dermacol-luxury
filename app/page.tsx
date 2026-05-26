"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag, Sparkles, Megaphone, Utensils,
  Sun, Moon, ArrowUpRight, Star,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useTheme } from "next-themes";
import AnnouncementTicker from "@/components/AnnouncementTicker";
import Link from "next/link";

// ─── Brand Data ───────────────────────────────────────────────────────────────
const BRANDS = [
  {
    name: "Beauty Concept",
    tagline: "9 Years of Natural Beauty.",
    desc: "Premium skincare & cosmetics curated for radiant, confident living.",
    link: "/beauty",
    accent: "#FF85A1",
    overlayOpacity: 0.50,
    icon: Sparkles,
    img: "/hero-beauty.jpg",
    stat: "500+ Products",
  },
  {
    name: "Ads Portal",
    tagline: "Connect with more audience.",
    desc: "Strategic advertising solutions that reach your perfect audience.",
    link: "/ads",
    accent: "#1a1a1a",
    overlayOpacity: 0.48,
    icon: Megaphone,
    img: "/hero-ads.jpg",
    stat: "10K+ Reach",
  },
  {
    name: "Dbolicious",
    tagline: "Homemade Food Varieties.",
    desc: "Authentic Nigerian cuisine crafted from cherished family recipes.",
    link: "/kitchen",
    accent: "#f97316",
    overlayOpacity: 0.50,
    icon: Utensils,
    img: "/hero-food.jpg",
    stat: "30+ Dishes",
  },
];

// ─── Theme Toggle ─────────────────────────────────────────────────────────────
function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-9 h-9" />;

  const isDark = theme === "dark";
  return (
    <motion.button
      whileTap={{ scale: 0.82 }}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="w-9 h-9 rounded-2xl flex items-center justify-center border transition-all"
      style={{
        borderColor: isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)",
        background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
      }}
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={theme}
          initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.18 }}
        >
          {isDark
            ? <Sun size={14} className="text-yellow-300" />
            : <Moon size={14} style={{ color: "#1a1a1a" }} />}
        </motion.div>
      </AnimatePresence>
    </motion.button>
  );
}

// ─── Brand Card ───────────────────────────────────────────────────────────────
function BrandCard({ brand, index }: { brand: typeof BRANDS[0]; index: number }) {
  const Icon = brand.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-24px" }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={brand.link}>
        <motion.div
          whileHover={{ scale: 1.018, y: -3 }}
          whileTap={{ scale: 0.983 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="relative h-[280px] md:h-[320px] rounded-[2.4rem] overflow-hidden shadow-xl cursor-pointer"
          style={{ boxShadow: `0 12px 48px ${brand.accent}22` }}
        >
          {/* Photo */}
          <img
            src={brand.img}
            alt={brand.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={(e) => { (e.target as HTMLImageElement).style.opacity = "0"; }}
          />

          {/* Brand colour overlay */}
          <div
            className="absolute inset-0"
            style={{ background: brand.accent, opacity: brand.overlayOpacity }}
          />

          {/* Gradient for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />

          {/* Top gloss shine */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/8 to-transparent" />

          {/* Icon chip — top left */}
          <div
            className="absolute top-5 left-5 w-11 h-11 rounded-[1.2rem] flex items-center justify-center border border-white/20"
            style={{ background: "rgba(255,255,255,0.16)", backdropFilter: "blur(12px)" }}
          >
            <Icon size={17} className="text-white" />
          </div>

          {/* Stat chip — top right */}
          <div
            className="absolute top-5 right-5 px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest text-white border border-white/15"
            style={{ background: "rgba(0,0,0,0.28)", backdropFilter: "blur(12px)" }}
          >
            {brand.stat}
          </div>

          {/* Bottom content */}
          <div className="absolute bottom-0 left-0 right-0 p-5 flex items-end justify-between">
            <div>
              <h3 className="text-[28px] md:text-[32px] font-black italic uppercase leading-none tracking-tighter text-white drop-shadow-md">
                {brand.name}
              </h3>
              <p className="text-[9px] font-bold uppercase tracking-[2.5px] text-white/70 mt-1.5">
                {brand.tagline}
              </p>
            </div>
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
              style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(10px)" }}
            >
              <ArrowUpRight size={15} className="text-white" />
            </motion.div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

// ─── Floating Orb Background ──────────────────────────────────────────────────
function HeroOrbs({ isDark }: { isDark: boolean }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {/* Large orb left */}
      <div
        className="absolute -top-20 -left-20 w-[420px] h-[420px] rounded-full animate-pulse-glow"
        style={{
          background: isDark
            ? "radial-gradient(circle, rgba(255,133,161,0.18) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(255,133,161,0.22) 0%, transparent 70%)",
        }}
      />
      {/* Large orb right */}
      <div
        className="absolute -bottom-16 -right-16 w-[360px] h-[360px] rounded-full animate-float-delayed"
        style={{
          background: isDark
            ? "radial-gradient(circle, rgba(14,165,233,0.12) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(14,165,233,0.16) 0%, transparent 70%)",
        }}
      />
      {/* Small accent */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full"
        style={{
          background: isDark
            ? "radial-gradient(circle, rgba(255,133,161,0.08) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(255,133,161,0.10) 0%, transparent 70%)",
        }}
      />
      {/* Noise texture overlay for depth */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px",
        }}
      />
    </div>
  );
}

// ─── Stats Row ────────────────────────────────────────────────────────────────
const STATS = [
  { value: "9+", label: "Years" },
  { value: "500+", label: "Products" },
  { value: "10K+", label: "Reach" },
  { value: "5★", label: "Rated" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const { cart, setIsCartOpen } = useCart();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => setMounted(true), []);

  const fg     = isDark ? "#f5f5f5" : "#1a1a1a";
  const border = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)";

  const handleExplore = () => {
    document.getElementById("explore")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main
      className="min-h-screen pb-4 overflow-x-hidden transition-colors duration-300"
      style={{ background: "var(--bg)" }}
    >

      {/* ── FLOATING NAV ── */}
      <motion.nav
        initial={{ y: -70, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-3 left-1/2 -translate-x-1/2 w-[92%] max-w-lg z-[100] flex justify-between items-center px-4 py-2.5 rounded-[2rem] backdrop-blur-2xl border shadow-xl"
        style={{
          background: "var(--nav-bg)",
          borderColor: border,
          boxShadow: isDark
            ? "0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)"
            : "0 8px 32px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)",
        }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-[0.6rem] flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #FF85A1, #ff4d6d)" }}
          >
            <Sparkles size={12} className="text-white" />
          </div>
          <span className="text-[15px] font-black italic tracking-tighter" style={{ color: fg }}>
            DERMACOL
          </span>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <motion.button
            whileTap={{ scale: 0.82 }}
            onClick={() => setIsCartOpen(true)}
            className="relative w-9 h-9 rounded-2xl flex items-center justify-center border transition-colors"
            style={{
              borderColor: isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.08)",
              background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
            }}
            aria-label="Open cart"
          >
            <ShoppingBag size={14} style={{ color: fg }} />
            <AnimatePresence>
              {cart.length > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF85A1] text-white text-[7px] font-black flex items-center justify-center rounded-full border-2"
                  style={{ borderColor: "var(--bg)" }}
                >
                  {cart.length > 9 ? "9+" : cart.length}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.nav>

      {/* ── HERO ── */}
      <section
        className="relative w-full min-h-[78vh] md:min-h-[82vh] flex items-center justify-center px-6 pt-24 pb-12 overflow-hidden"
        style={{ background: "var(--bg)" }}
      >
        <HeroOrbs isDark={isDark} />

        <motion.div
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 w-full max-w-4xl text-center flex flex-col items-center"
        >
          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-2 mb-8 px-4 py-2 rounded-full border"
            style={{
              background: isDark ? "rgba(255,133,161,0.08)" : "rgba(255,133,161,0.10)",
              borderColor: isDark ? "rgba(255,133,161,0.18)" : "rgba(255,133,161,0.25)",
            }}
          >
            <Star size={10} fill="#FF85A1" stroke="none" />
            <span className="text-[9px] font-black uppercase tracking-[4px]" style={{ color: "#FF85A1" }}>
              Quality · Classy · Extraordinary
            </span>
            <Star size={10} fill="#FF85A1" stroke="none" />
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="font-black italic uppercase leading-[0.82] tracking-tighter mb-6"
            style={{ fontSize: "clamp(52px, 13vw, 96px)", color: "var(--fg)" }}
          >
            Welcome to{" "}
            <br />
            <span className="shimmer-text">Dermacol</span>
          </motion.h1>

          {/* Sub headline */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.34, duration: 0.6 }}
            className="text-[10px] md:text-[11px] font-bold uppercase tracking-[4px] mb-10 max-w-sm leading-loose"
            style={{ color: "var(--fg-sub)" }}
          >
            9 Years of Excellence in Beauty,
            <br />Advertising &amp; Culinary Experiences.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.44, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-3 items-center"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 12px 36px rgba(0,0,0,0.28)" }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExplore}
              className="px-10 py-4 rounded-full font-black uppercase tracking-[3px] text-[11px] text-white shadow-2xl transition-all"
              style={{ background: isDark ? "#f5f5f5" : "#1A1A1A", color: isDark ? "#1A1A1A" : "#ffffff" }}
            >
              Explore Services
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsCartOpen(true)}
              className="px-8 py-4 rounded-full font-black uppercase tracking-[3px] text-[11px] border transition-all"
              style={{
                borderColor: "#FF85A1",
                color: "#FF85A1",
                background: isDark ? "rgba(255,133,161,0.08)" : "rgba(255,133,161,0.06)",
              }}
            >
              View Cart
            </motion.button>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.56, duration: 0.5 }}
            className="mt-14 flex gap-6 md:gap-10 items-center justify-center"
          >
            {STATS.map((s, i) => (
              <div key={i} className="text-center">
                <div
                  className="text-[20px] md:text-[24px] font-black italic leading-none"
                  style={{ color: i === 0 ? "#FF85A1" : "var(--fg)" }}
                >
                  {s.value}
                </div>
                <div
                  className="text-[8px] font-black uppercase tracking-[3px] mt-1"
                  style={{ color: "var(--fg-muted)" }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Scroll hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="mt-10 flex flex-col items-center gap-1"
          >
            <div className="w-px h-10 rounded-full" style={{ background: "var(--fg-muted)" }} />
            <span className="text-[7px] font-black uppercase tracking-[3px]" style={{ color: "var(--fg-muted)" }}>
              Scroll
            </span>
          </motion.div>
        </motion.div>
      </section>

      {/* ── TICKER ── */}
      <AnnouncementTicker />

      {/* ── BRAND CARDS ── */}
      <section id="explore" className="px-5 pt-10 pb-4 max-w-2xl mx-auto">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="flex items-center justify-between mb-6"
        >
          <div>
            <p className="text-[9px] font-black uppercase tracking-[4px] text-[#FF85A1] mb-1">
              Our Brands
            </p>
            <h2
              className="text-[24px] md:text-[28px] font-black italic uppercase tracking-tighter leading-none"
              style={{ color: "var(--fg)" }}
            >
              What We Do
            </h2>
          </div>
          <div
            className="w-11 h-11 rounded-[1.1rem] flex items-center justify-center border"
            style={{
              background: isDark ? "rgba(255,133,161,0.10)" : "rgba(255,133,161,0.10)",
              borderColor: isDark ? "rgba(255,133,161,0.15)" : "rgba(255,133,161,0.15)",
            }}
          >
            <Sparkles size={15} style={{ color: "#FF85A1" }} />
          </div>
        </motion.div>

        {/* Cards — single column on mobile, 2-col on md for the first two */}
        <div className="flex flex-col gap-4 md:grid md:grid-cols-2">
          {BRANDS.map((brand, i) => (
            <div key={brand.name} className={i === 2 ? "md:col-span-2" : ""}>
              <BrandCard brand={brand} index={i} />
            </div>
          ))}
        </div>
      </section>

      {/* ── TRUST BAND ── */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-5 mt-6 mb-2 rounded-[2rem] py-6 px-8 flex flex-wrap justify-center gap-6 md:gap-12"
        style={{
          background: isDark ? "rgba(255,133,161,0.07)" : "rgba(255,133,161,0.07)",
          border: `1px solid rgba(255,133,161,0.14)`,
        }}
      >
        {[
          "Free Delivery on All Orders",
          "Secure Payment",
          "Premium Quality",
          "WhatsApp Support",
        ].map((t, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#FF85A1]" />
            <span
              className="text-[9px] font-black uppercase tracking-[2.5px]"
              style={{ color: "var(--fg-sub)" }}
            >
              {t}
            </span>
          </div>
        ))}
      </motion.div>

    </main>
  );
}
