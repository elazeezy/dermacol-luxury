"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  ShoppingBag, Sparkles, Megaphone, Utensils,
  Instagram, Mail, ExternalLink, Music,
  Sun, Moon, ChevronDown, ArrowUpRight,
  MapPin, Phone, ChevronLeft, ChevronRight,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useTheme } from "next-themes";
import AnnouncementTicker from "@/components/AnnouncementTicker";
import { InteractiveHero } from "@/components/ui/interactive-hero-backgrounds";
import { ShaderAnimation } from "@/components/ui/shader-animation";

// ─── Brand Data ────────────────────────────────────────────────────────────────
const BRANDS = [
  {
    name: "Beauty Concept",
    tagline: "9 Years of Natural Beauty",
    desc: "Premium skincare & cosmetics curated for radiant, confident living.",
    link: "/beauty",
    accent: "#FF85A1",
    darkAccent: "#ff9db5",
    icon: <Sparkles size={18} />,
    images: ["/hero-beauty.jpg", "/products/wig1.jpg", "/products/wig2.jpg"],
    stat: "500+ Products",
  },
  {
    name: "Ads Portal",
    tagline: "Amplify Your Brand",
    desc: "Strategic advertising solutions that connect you to your perfect audience.",
    link: "/ads",
    accent: "#1A1A1A",
    darkAccent: "#e5e5e5",
    icon: <Megaphone size={18} />,
    images: ["/hero-ads.jpg", "/products/ads-1.jpg", "/products/ads-2.jpg"],
    stat: "10K+ Reach",
  },
  {
    name: "Dbolicious",
    tagline: "Homemade with Love",
    desc: "Authentic Nigerian cuisine crafted from cherished family recipes.",
    link: "/kitchen",
    accent: "#f97316",
    darkAccent: "#fb923c",
    icon: <Utensils size={18} />,
    images: ["/hero-food.jpg", "/products/food-f1.jpg", "/products/food-f2.jpg"],
    stat: "30+ Dishes",
  },
];

// ─── Auto-Sliding Brand Card ───────────────────────────────────────────────────
function BrandCard({ brand, index }: { brand: typeof BRANDS[0]; index: number }) {
  const [slide, setSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    if (isPaused) return;
    const t = setInterval(() => setSlide((s) => (s + 1) % brand.images.length), 3200);
    return () => clearInterval(t);
  }, [isPaused, brand.images.length]);

  const prev = () => setSlide((s) => (s - 1 + brand.images.length) % brand.images.length);
  const next = () => setSlide((s) => (s + 1) % brand.images.length);

  const accent = isDark ? brand.darkAccent : brand.accent;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      className="group relative rounded-[2.5rem] overflow-hidden shadow-xl border dark:border-white/10 border-black/5"
      style={{ background: isDark ? "#1a1a1a" : "#fff" }}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Image Slider */}
      <div className="relative h-[220px] overflow-hidden">
        <AnimatePresence mode="sync">
          <motion.div
            key={slide}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            {/* Fallback gradient if image missing */}
            <div
              className="absolute inset-0 w-full h-full"
              style={{
                background: `linear-gradient(135deg, ${accent}cc 0%, ${accent}44 100%)`,
              }}
            />
            <img
              src={brand.images[slide]}
              alt={brand.name}
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Slide dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {brand.images.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              className="rounded-full transition-all duration-300"
              style={{
                width: slide === i ? 18 : 6,
                height: 6,
                background: slide === i ? "#fff" : "rgba(255,255,255,0.4)",
              }}
            />
          ))}
        </div>

        {/* Nav arrows */}
        <button
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 active:opacity-100 transition-opacity"
        >
          <ChevronLeft size={14} />
        </button>
        <button
          onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 active:opacity-100 transition-opacity"
        >
          <ChevronRight size={14} />
        </button>

        {/* Stat chip on image */}
        <div
          className="absolute top-4 right-4 z-10 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest text-white backdrop-blur-md border border-white/20"
          style={{ background: `${accent}cc` }}
        >
          {brand.stat}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest mb-2"
              style={{ background: `${accent}20`, color: accent }}
            >
              {brand.icon}
              {brand.tagline}
            </div>
            <h3
              className="text-2xl font-black italic uppercase tracking-tighter leading-none"
              style={{ color: isDark ? "#fff" : "#1a1a1a" }}
            >
              {brand.name}
            </h3>
          </div>
          <motion.a
            href={brand.link}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-lg"
            style={{ background: accent }}
          >
            <ArrowUpRight size={16} className="text-white" />
          </motion.a>
        </div>
        <p
          className="text-[11px] leading-relaxed font-medium"
          style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.45)" }}
        >
          {brand.desc}
        </p>
      </div>
    </motion.div>
  );
}

// ─── Theme Toggle ──────────────────────────────────────────────────────────────
function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-9 h-9" />;

  return (
    <motion.button
      whileTap={{ scale: 0.85 }}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="w-9 h-9 rounded-2xl flex items-center justify-center border dark:border-white/10 border-black/10 dark:bg-white/5 bg-black/5 transition-colors"
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={theme}
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: 90, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {theme === "dark" ? (
            <Sun size={15} className="text-yellow-400" />
          ) : (
            <Moon size={15} className="text-[#1a1a1a]" />
          )}
        </motion.div>
      </AnimatePresence>
    </motion.button>
  );
}

// ─── Landing Page ──────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const { cart, setIsCartOpen } = useCart();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => setMounted(true), []);

  const handleExplore = () => {
    document.getElementById("explore")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main
      className="min-h-screen pb-28 overflow-x-hidden transition-colors duration-300"
      style={{ background: isDark ? "#0d0d0d" : "#f5f0ee" }}
    >
      {/* ── FLOATING HEADER ── */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-3 left-1/2 -translate-x-1/2 w-[92%] max-w-md z-[100] flex justify-between items-center px-4 py-2.5 rounded-[2rem] border backdrop-blur-2xl shadow-2xl"
        style={{
          background: isDark ? "rgba(20,20,20,0.75)" : "rgba(255,255,255,0.7)",
          borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)",
        }}
      >
        <span className="text-base font-black italic tracking-tighter" style={{ color: isDark ? "#fff" : "#1a1a1a" }}>
          DERMACOL
        </span>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => setIsCartOpen(true)}
            className="relative w-9 h-9 rounded-2xl flex items-center justify-center border dark:border-white/10 border-black/10 dark:bg-white/5 bg-black/5"
            aria-label="Open cart"
          >
            <ShoppingBag size={15} style={{ color: isDark ? "#fff" : "#1a1a1a" }} />
            <AnimatePresence>
              {cart.length > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF85A1] text-white text-[8px] font-black flex items-center justify-center rounded-full border-2"
                  style={{ borderColor: isDark ? "#0d0d0d" : "#f5f0ee" }}
                >
                  {cart.length}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.nav>

    {/* ── HERO ── */}
      <section className="relative h-[92vh] min-h-[580px] w-full overflow-hidden" style={{ background: "#0a0a0a" }}>

        {/* LAYER 0: Shader (deep background glow) */}
        <div className="absolute inset-0 z-0 opacity-70 mix-blend-screen pointer-events-none">
          <ShaderAnimation />
        </div>

        {/* LAYER 1: BallPit (interactive physics) */}
        <div className="absolute inset-0 z-10">
          <InteractiveHero
            colors={["#FF85A1", "#ffffff", "#fce7f3", "#1a1a1a", "#ff4d6d"]}
            count={50}
            gravity={0.06}
          />
        </div>

        {/* LAYER 2: Radial vignette — darkens edges so text pops */}
        <div
          className="absolute inset-0 z-20 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 85% 75% at 50% 50%, transparent 20%, rgba(0,0,0,0.72) 100%)",
          }}
        />

        {/* LAYER 3: Content */}
        <div className="relative z-30 flex flex-col items-center justify-center h-full px-6 text-center pt-16">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.45, duration: 0.5 }}
              className="px-5 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-md mb-7"
            >
              <span className="text-[9px] font-black uppercase tracking-[4px] text-white">
                ✦ 9 Years of Excellence ✦
              </span>
            </motion.div>

            {/* Headline */}
            <h1
              className="font-black italic uppercase leading-[0.88] tracking-tighter text-white mb-5 drop-shadow-2xl"
              style={{ fontSize: "clamp(50px, 14vw, 92px)" }}
            >
              Welcome
              <br />
              <span
                style={{
                  color: "#FF85A1",
                  textShadow:
                    "0 0 30px rgba(255,133,161,0.55), 0 0 80px rgba(255,133,161,0.2)",
                }}
              >
                to Dermacol
              </span>
            </h1>

            {/* Sub-tagline */}
            <p className="text-[10px] font-bold uppercase tracking-[4px] text-white/50 mb-2 max-w-[260px] leading-relaxed">
              Quality · Classy · Extraordinary
            </p>
            <p className="text-[11px] text-white/30 mb-10 max-w-[280px] leading-relaxed">
              Curating beauty, advertising &amp; culinary experiences that define your lifestyle.
            </p>

            {/* CTA */}
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: "#FF85A1", color: "#fff" }}
              whileTap={{ scale: 0.94 }}
              onClick={handleExplore}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className="px-10 py-4 bg-white text-[#1a1a1a] rounded-[2rem] font-black uppercase tracking-widest shadow-2xl text-[11px] transition-colors"
            >
              Explore Services
            </motion.button>
          </motion.div>
        </div>

        {/* Scroll hint */}
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-1.5 text-white/25 pointer-events-none"
        >
          <span className="text-[7px] uppercase tracking-[3px] font-black">scroll</span>
          <ChevronDown size={13} />
        </motion.div>

        {/* Bottom fade into page bg */}
        <div
          className="absolute bottom-0 left-0 w-full h-32 z-30 pointer-events-none"
          style={{
            background: `linear-gradient(to top, ${isDark ? "#0d0d0d" : "#f5f0ee"}, transparent)`,
          }}
        />
      </section>

      {/* ── TICKER ── */}
      <AnnouncementTicker />
      
      {/* ── BRAND CARDS ── */}
      <section id="explore" className="px-5 pt-10 pb-4 max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 text-center"
        >
          <p
            className="text-[9px] font-black uppercase tracking-[5px] mb-2"
            style={{ color: "#FF85A1" }}
          >
            Our Brands
          </p>
          <h2
            className="text-3xl font-black italic uppercase tracking-tighter"
            style={{ color: isDark ? "#fff" : "#1a1a1a" }}
          >
            What We Do
          </h2>
        </motion.div>

        <div className="flex flex-col gap-5">
          {BRANDS.map((brand, i) => (
            <BrandCard key={brand.name} brand={brand} index={i} />
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="mt-16 mx-4 rounded-[2.5rem] overflow-hidden" style={{
        background: isDark ? "#111" : "#1a1a1a",
      }}>
        {/* Top gradient stripe */}
        <div className="h-1 w-full" style={{
          background: "linear-gradient(90deg, #FF85A1, #ff4d6d, #FF85A1)"
        }} />

        <div className="px-6 pt-10 pb-8">
          {/* Brand mark */}
          <div className="mb-10">
            <h2 className="text-3xl font-black italic tracking-tighter text-white mb-1">
              DERMACOL
            </h2>
            <p className="text-[9px] font-bold uppercase tracking-[3px] text-white/30">
              Beauty · Advertising · Culinary
            </p>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-8 mb-10">
            <div>
              <h4 className="text-[8px] font-black uppercase tracking-[3px] text-[#FF85A1] mb-3">
                Contact
              </h4>
              <ul className="space-y-2">
                {[
                  { label: "Beauty", num: "08065253247" },
                  { label: "Ads", num: "08158942290" },
                  { label: "Food", num: "08125666302" },
                ].map((c) => (
                  <li key={c.label} className="flex items-center gap-2">
                    <Phone size={9} className="text-[#FF85A1] shrink-0" />
                    <div>
                      <span className="text-[8px] font-black uppercase text-white/30 block">{c.label}</span>
                      <a href={`tel:${c.num}`} className="text-[10px] font-bold text-white/70 hover:text-[#FF85A1] transition-colors">
                        {c.num}
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-[8px] font-black uppercase tracking-[3px] text-[#FF85A1] mb-3">
                Location
              </h4>
              <div className="flex items-start gap-2 mb-5">
                <MapPin size={10} className="text-[#FF85A1] mt-0.5 shrink-0" />
                <p className="text-[10px] font-bold text-white/60 leading-relaxed">
                  Datboy Building,<br /> Ilaro, Ogun State.
                </p>
              </div>

              <h4 className="text-[8px] font-black uppercase tracking-[3px] text-[#FF85A1] mb-3">
                Follow Us
              </h4>
              <div className="flex gap-3">
                {[
                  { icon: <Instagram size={15} />, href: "https://www.instagram.com/babygirl_dermacol?igsh=MWh2czhtcTZrZDJ4bg==" },
                  { icon: <Music size={15} />, href: "https://www.tiktok.com/@babygirldermacol?_r=1&_t=ZS-94jFGxIIFwP" },
                  { icon: <Mail size={15} />, href: "mailto:dermacolconcepts@gmail.com" },
                ].map((s, i) => (
                  <motion.a
                    key={i}
                    href={s.href}
                    target="_blank"
                    whileHover={{ scale: 1.15, color: "#FF85A1" }}
                    whileTap={{ scale: 0.9 }}
                    className="w-9 h-9 rounded-2xl flex items-center justify-center border border-white/10 bg-white/5 text-white/40 hover:text-[#FF85A1] hover:border-[#FF85A1]/30 transition-colors"
                  >
                    {s.icon}
                  </motion.a>
                ))}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px w-full bg-white/8 mb-6" />

          {/* Bottom row */}
          <div className="flex flex-col items-center gap-3">
            <p className="text-[8px] font-bold text-white/20 uppercase tracking-[2px]">
              &copy; {new Date().getFullYear()} Dermacol — All rights reserved
            </p>
            <motion.a
              href="https://my-portfolio-website-eight-liard-64.vercel.app/"
              target="_blank"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/10 bg-white/5 text-[9px] font-black uppercase tracking-widest text-white/40 hover:bg-[#FF85A1] hover:text-white hover:border-transparent transition-all"
            >
              Crafted by <span className="text-[#FF85A1] group-hover:text-white">el_azeezy</span>
              <ExternalLink size={8} />
            </motion.a>
          </div>
        </div>
      </footer>
    </main>
  );
}
