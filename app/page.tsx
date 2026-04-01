"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag, Sparkles, Megaphone, Utensils,
  Instagram, Mail, ExternalLink, Music,
  Sun, Moon, ArrowUpRight, MapPin, Phone,
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
    overlayOpacity: 0.52,
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
    overlayOpacity: 0.52,
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

  return (
    <motion.button
      whileTap={{ scale: 0.82 }}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="w-9 h-9 rounded-2xl flex items-center justify-center border transition-colors"
      style={{
        borderColor: theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)",
        background: theme === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
      }}
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={theme}
          initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.16 }}
        >
          {theme === "dark"
            ? <Sun size={14} className="text-yellow-400" />
            : <Moon size={14} className="text-[#1a1a1a]" />}
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
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.55, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={brand.link}>
        <div className="relative h-[270px] rounded-[2.2rem] overflow-hidden shadow-lg active:scale-[0.985] transition-transform duration-150 cursor-pointer">

          {/* Photo */}
          <img
            src={brand.img}
            alt={brand.name}
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.opacity = "0"; }}
          />

          {/* Brand colour overlay — the signature look from the screenshot */}
          <div
            className="absolute inset-0"
            style={{ background: brand.accent, opacity: brand.overlayOpacity }}
          />

          {/* Gradient for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

          {/* Icon chip — top left */}
          <div
            className="absolute top-5 left-5 w-11 h-11 rounded-[1.1rem] flex items-center justify-center backdrop-blur-md border border-white/20"
            style={{ background: "rgba(255,255,255,0.15)" }}
          >
            <Icon size={17} className="text-white" />
          </div>

          {/* Stat chip — top right */}
          <div
            className="absolute top-5 right-5 px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest text-white backdrop-blur-md border border-white/15"
            style={{ background: "rgba(0,0,0,0.22)" }}
          >
            {brand.stat}
          </div>

          {/* Bottom content */}
          <div className="absolute bottom-0 left-0 right-0 p-5 flex items-end justify-between">
            <div>
              <h3 className="text-[30px] font-black italic uppercase leading-none tracking-tighter text-white drop-shadow-md">
                {brand.name}
              </h3>
              <p className="text-[9px] font-bold uppercase tracking-[2px] text-white/75 mt-1">
                {brand.tagline}
              </p>
            </div>
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
              style={{ background: "rgba(255,255,255,0.18)", backdropFilter: "blur(8px)" }}
            >
              <ArrowUpRight size={14} className="text-white" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const { cart, setIsCartOpen } = useCart();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => setMounted(true), []);

  const bg      = isDark ? "#0d0d0d" : "#dce8f0";
  const fg      = isDark ? "#ffffff" : "#1a1a1a";
  const cardBg  = isDark ? "#161616" : "#ffffff";
  const border  = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)";
  const subText = isDark ? "rgba(255,255,255,0.38)" : "rgba(0,0,0,0.42)";

  const handleExplore = () => {
    document.getElementById("explore")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main
      className="min-h-screen pb-32 overflow-x-hidden transition-colors duration-300"
      style={{ background: bg }}
    >

      {/* ── FLOATING NAV ── */}
      <motion.nav
        initial={{ y: -70, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-3 left-1/2 -translate-x-1/2 w-[92%] max-w-md z-[100] flex justify-between items-center px-4 py-2.5 rounded-[2rem] backdrop-blur-2xl border shadow-xl"
        style={{
          background: isDark ? "rgba(15,15,15,0.88)" : "rgba(255,255,255,0.85)",
          borderColor: border,
        }}
      >
        <span className="text-[15px] font-black italic tracking-tighter" style={{ color: fg }}>
          DERMACOL
        </span>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <motion.button
            whileTap={{ scale: 0.82 }}
            onClick={() => setIsCartOpen(true)}
            className="relative w-9 h-9 rounded-2xl flex items-center justify-center border transition-colors"
            style={{
              borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)",
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
                  style={{ borderColor: isDark ? "#0d0d0d" : "#dce8f0" }}
                >
                  {cart.length > 9 ? "9+" : cart.length}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.nav>

      {/* ── CLEAN CENTERED HERO ── */}
<section className="relative w-full min-h-[70vh] flex items-center justify-center px-6 pt-20 overflow-hidden bg-[#E0F2FE]">
  {/* Optional: Add your InteractiveHero here as a background if you want the balls to float behind the text */}
  
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    className="w-full max-w-4xl text-center flex flex-col items-center"
  >
    {/* Eyebrow / 9 Years Badge */}
    <div className="flex items-center justify-center gap-3 mb-8">
      <div className="w-8 h-[1px] bg-black/20" />
      <span className="text-[10px] font-black uppercase tracking-[5px] text-gray-500">
        Quality. Classy. Extraordinary.
      </span>
      <div className="w-8 h-[1px] bg-black/20" />
    </div>

    {/* Main Headline from the Image */}
    <h1 
      className="font-black italic uppercase leading-[0.8] tracking-tighter mb-8"
      style={{ fontSize: "clamp(48px, 12vw, 90px)", color: "#1A1A1A" }}
    >
      Welcome to <br />
      <span style={{ color: "#FF85A1" }}>Dermacol</span>
    </h1>

    {/* Subheadline Text */}
    <p 
      className="text-[10px] md:text-[11px] font-bold uppercase tracking-[4px] mb-10 max-w-sm leading-relaxed" 
      style={{ color: "#1A1A1A" }}
    >
      9 Years of Excellence in Beauty, Advertising &amp; Culinary Experiences.
    </p>

    {/* Centered CTA Button */}
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleExplore}
      className="px-12 py-5 rounded-full font-black uppercase tracking-[3px] text-[12px] text-white shadow-2xl transition-all"
      style={{ background: "#1A1A1A" }} // Keeping it black like the image for that "Explore Services" look
    >
      Explore Services
    </motion.button>

    {/* Bottom Accent Line */}
    <div className="mt-16 w-12 h-1 bg-[#FF85A1] rounded-full opacity-50" />
  </motion.div>
</section>
      {/* ── TICKER ── */}
      <div className="mt-4">
        <AnnouncementTicker />
      </div>

      {/* ── BRAND CARDS ── */}
      <section id="explore" className="px-5 pt-8 pb-4 max-w-md mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="flex items-center justify-between mb-5"
        >
          <div>
            <p className="text-[9px] font-black uppercase tracking-[4px] text-[#FF85A1] mb-0.5">
              Our Brands
            </p>
            <h2
              className="text-[22px] font-black italic uppercase tracking-tighter leading-none"
              style={{ color: fg }}
            >
              What We Do
            </h2>
          </div>
          <div
            className="w-10 h-10 rounded-[1rem] flex items-center justify-center"
            style={{ background: isDark ? "rgba(255,133,161,0.1)" : "rgba(255,133,161,0.12)" }}
          >
            <Sparkles size={15} style={{ color: "#FF85A1" }} />
          </div>
        </motion.div>

        <div className="flex flex-col gap-4">
          {BRANDS.map((brand, i) => (
            <BrandCard key={brand.name} brand={brand} index={i} />
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        className="mt-14 mx-4 rounded-[2.2rem] overflow-hidden"
        style={{ background: isDark ? "#111111" : "#1a1a1a" }}
      >
        {/* Pink accent stripe */}
        <div
          className="h-[3px] w-full"
          style={{ background: "linear-gradient(90deg, #FF85A1 0%, #ff4d6d 50%, #FF85A1 100%)" }}
        />

        <div className="px-6 pt-9 pb-7">

          {/* Brand mark */}
          <div className="mb-8">
            <h2 className="text-[28px] font-black italic tracking-tighter text-white leading-none mb-1">
              DERMACOL
            </h2>
            <p className="text-[8px] font-bold uppercase tracking-[3px] text-white/25">
              Beauty · Advertising · Culinary
            </p>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-6 mb-8">

            <div>
              <h4 className="text-[8px] font-black uppercase tracking-[3px] text-[#FF85A1] mb-3">
                Contact
              </h4>
              <ul className="space-y-3">
                {[
                  { label: "Beauty", num: "08065253247" },
                  { label: "Ads",    num: "08158942290" },
                  { label: "Food",   num: "08125666302" },
                ].map((c) => (
                  <li key={c.label} className="flex items-center gap-2">
                    <Phone size={8} className="text-[#FF85A1] shrink-0" />
                    <div>
                      <span className="text-[7px] font-black uppercase text-white/25 block leading-none mb-0.5">
                        {c.label}
                      </span>
                      <a
                        href={`tel:${c.num}`}
                        className="text-[10px] font-bold text-white/55 hover:text-[#FF85A1] transition-colors"
                      >
                        {c.num}
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-[8px] font-black uppercase tracking-[3px] text-[#FF85A1] mb-3">
                Find Us
              </h4>
              <div className="flex items-start gap-2 mb-6">
                <MapPin size={9} className="text-[#FF85A1] mt-0.5 shrink-0" />
                <p className="text-[10px] font-bold text-white/45 leading-relaxed">
                  Datboy Building,<br />Ilaro, Ogun State.
                </p>
              </div>

              <h4 className="text-[8px] font-black uppercase tracking-[3px] text-[#FF85A1] mb-3">
                Follow Us
              </h4>
              <div className="flex gap-2">
                {[
                  {
                    icon: <Instagram size={14} />,
                    href: "https://www.instagram.com/babygirl_dermacol?igsh=MWh2czhtcTZrZDJ4bg==",
                  },
                  {
                    icon: <Music size={14} />,
                    href: "https://www.tiktok.com/@babygirldermacol?_r=1&_t=ZS-94jFGxIIFwP",
                  },
                  {
                    icon: <Mail size={14} />,
                    href: "mailto:dermacolconcepts@gmail.com",
                  },
                ].map((s, i) => (
                  <motion.a
                    key={i}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.88 }}
                    className="w-8 h-8 rounded-[0.8rem] flex items-center justify-center border border-white/10 bg-white/5 text-white/30 hover:text-[#FF85A1] hover:border-[#FF85A1]/30 transition-colors"
                  >
                    {s.icon}
                  </motion.a>
                ))}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px w-full mb-5" style={{ background: "rgba(255,255,255,0.06)" }} />

          {/* Bottom row */}
          <div className="flex flex-col items-center gap-3">
            <p className="text-[7px] font-bold text-white/15 uppercase tracking-[2px]">
              &copy; {new Date().getFullYear()} Dermacol — All rights reserved
            </p>
            <motion.a
              href="https://my-portfolio-website-eight-liard-64.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.04, backgroundColor: "#FF85A1" }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/10 bg-white/5 text-[8px] font-black uppercase tracking-widest text-white/35 transition-all"
            >
              Crafted by <span className="text-[#FF85A1]">el_azeezy</span>
              <ExternalLink size={7} />
            </motion.a>
          </div>
        </div>
      </footer>
    </main>
  );
}