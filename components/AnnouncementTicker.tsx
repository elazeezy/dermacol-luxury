"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Truck, Star, Zap } from 'lucide-react';
import { useTheme } from 'next-themes';

const MESSAGES = [
  { icon: Truck,    text: "FREE DELIVERY FOR ALL WEBSITE ORDERS!" },
  { icon: Star,     text: "9 YEARS OF PREMIUM QUALITY — BEAUTY · ADS · FOOD" },
  { icon: Sparkles, text: "SHOP 500+ PREMIUM WIGS AT BEST PRICES" },
  { icon: Zap,      text: "WHATSAPP US FOR INSTANT SUPPORT · 08158942290" },
  { icon: Truck,    text: "ORDER NOW & GET YOUR DELIVERY SUPER FAST" },
];

export default function AnnouncementTicker() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const content = [...MESSAGES, ...MESSAGES]; // duplicate for seamless loop

  return (
    <div
      className="w-full overflow-hidden py-2.5 relative"
      style={{
        background: isDark
          ? "linear-gradient(90deg, #1a0810 0%, #2a0d18 50%, #1a0810 100%)"
          : "linear-gradient(90deg, #FF85A1 0%, #ff6b8e 50%, #FF85A1 100%)",
        borderTop: isDark ? "1px solid rgba(255,133,161,0.15)" : "none",
        borderBottom: isDark ? "1px solid rgba(255,133,161,0.15)" : "none",
      }}
    >
      {/* Fade edges */}
      <div
        className="absolute left-0 top-0 h-full w-10 z-10 pointer-events-none"
        style={{
          background: isDark
            ? "linear-gradient(90deg, #1a0810, transparent)"
            : "linear-gradient(90deg, #FF85A1, transparent)",
        }}
      />
      <div
        className="absolute right-0 top-0 h-full w-10 z-10 pointer-events-none"
        style={{
          background: isDark
            ? "linear-gradient(270deg, #1a0810, transparent)"
            : "linear-gradient(270deg, #FF85A1, transparent)",
        }}
      />

      <motion.div
        className="whitespace-nowrap inline-flex items-center gap-0"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
        style={{ willChange: "transform" }}
      >
        {content.map((msg, i) => {
          const Icon = msg.icon;
          return (
            <span
              key={i}
              className="inline-flex items-center gap-2 mx-8"
            >
              <Icon
                size={9}
                style={{ color: isDark ? "#FF85A1" : "rgba(255,255,255,0.7)" }}
              />
              <span
                className="text-[9px] font-black uppercase tracking-[2.5px]"
                style={{ color: isDark ? "#f5a0b8" : "#ffffff" }}
              >
                {msg.text}
              </span>
            </span>
          );
        })}
      </motion.div>
    </div>
  );
}
