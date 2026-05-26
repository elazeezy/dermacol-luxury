"use client";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Sparkles, Phone, MapPin, Instagram, Music, Mail, ArrowUpRight, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted && theme === "dark";

  return (
    <footer
      className="mx-4 mt-10 mb-4 rounded-[2.4rem] overflow-hidden"
      style={{ background: isDark ? "#111111" : "#1a1a1a" }}
    >
      {/* Pink accent stripe */}
      <div
        className="h-0.75 w-full"
        style={{ background: "linear-gradient(90deg, #FF85A1 0%, #ff4d6d 50%, #FF85A1 100%)" }}
      />

      <div className="px-6 pt-10 pb-8">

        {/* Brand mark */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <div
              className="w-8 h-8 rounded-[0.7rem] flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #FF85A1, #ff4d6d)" }}
            >
              <Sparkles size={14} className="text-white" />
            </div>
            <h2 className="text-[26px] font-black italic tracking-tighter text-white leading-none">
              DERMACOL
            </h2>
          </div>
          <p className="text-[8px] font-bold uppercase tracking-[3px] text-white/25 mt-1">
            Beauty · Advertising · Culinary
          </p>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">

          {/* Contact */}
          <div>
            <h4 className="text-[8px] font-black uppercase tracking-[3px] text-dermacol-pink mb-3">Contact</h4>
            <ul className="space-y-3">
              {[
                { label: "Beauty", num: "08065253247" },
                { label: "Ads",    num: "08158942290" },
                { label: "Food",   num: "08125666302" },
              ].map((c) => (
                <li key={c.label} className="flex items-center gap-2">
                  <Phone size={8} className="text-dermacol-pink shrink-0" />
                  <div>
                    <span className="text-[7px] font-black uppercase text-white/25 block leading-none mb-0.5">{c.label}</span>
                    <a href={`tel:${c.num}`} className="text-[10px] font-bold text-white/55 hover:text-dermacol-pink transition-colors">
                      {c.num}
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Find Us + Follow */}
          <div>
            <h4 className="text-[8px] font-black uppercase tracking-[3px] text-dermacol-pink mb-3">Find Us</h4>
            <div className="flex items-start gap-2 mb-6">
              <MapPin size={9} className="text-dermacol-pink mt-0.5 shrink-0" />
              <p className="text-[10px] font-bold text-white/45 leading-relaxed">
                Datboy Building,<br />Ilaro, Ogun State.
              </p>
            </div>

            <h4 className="text-[8px] font-black uppercase tracking-[3px] text-dermacol-pink mb-3">Follow Us</h4>
            <div className="flex gap-2">
              {[
                { icon: <Instagram size={14} />, href: "https://www.instagram.com/babygirl_dermacol?igsh=MWh2czhtcTZrZDJ4bg==" },
                { icon: <Music size={14} />,     href: "https://www.tiktok.com/@babygirldermacol?_r=1&_t=ZS-94jFGxIIFwP" },
                { icon: <Mail size={14} />,      href: "mailto:dermacolconcepts@gmail.com" },
              ].map((s, i) => (
                <motion.a
                  key={i}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.88 }}
                  className="w-8 h-8 rounded-[0.8rem] flex items-center justify-center border border-white/10 bg-white/5 text-white/30 hover:text-dermacol-pink hover:border-dermacol-pink/30 transition-all"
                >
                  {s.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="text-[8px] font-black uppercase tracking-[3px] text-dermacol-pink mb-3">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { label: "Beauty Store", href: "/beauty" },
                { label: "Ads Portal",   href: "/ads" },
                { label: "Dbolicious",   href: "/kitchen" },
              ].map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-[10px] font-bold text-white/40 hover:text-dermacol-pink transition-colors flex items-center gap-1.5"
                  >
                    <ArrowUpRight size={9} />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full mb-5" style={{ background: "rgba(255,255,255,0.06)" }} />

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[7px] font-bold text-white/15 uppercase tracking-[2px]">
            &copy; {new Date().getFullYear()} Dermacol — All rights reserved
          </p>
          <motion.a
            href="https://my-portfolio-website-eight-liard-64.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/10 bg-white/5 text-[8px] font-black uppercase tracking-widest text-white/35 hover:text-white/60 transition-all"
          >
            Crafted by <span className="text-dermacol-pink">el_azeezy</span>
            <ExternalLink size={7} />
          </motion.a>
        </div>
      </div>
    </footer>
  );
}
