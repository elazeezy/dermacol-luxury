"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Sparkles, Utensils, Megaphone, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useTheme } from "next-themes";

interface NavbarProps {
  onCartClick: () => void;
}

const NAV_ITEMS = [
  { name: "Home", path: "/", icon: Home },
  { name: "Beauty", path: "/beauty", icon: Sparkles },
  { name: "Kitchen", path: "/kitchen", icon: Utensils },
  { name: "Ads", path: "/ads", icon: Megaphone },
];

export default function Navbar({ onCartClick }: NavbarProps) {
  const pathname = usePathname();
  const { cart } = useCart();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-[100] px-4 pb-safe"
      style={{ paddingBottom: "max(env(safe-area-inset-bottom), 12px)" }}
    >
      <div
        className="mx-auto max-w-md rounded-[2rem] border backdrop-blur-2xl px-2 py-2 flex items-center justify-between shadow-2xl"
        style={{
          background: isDark
            ? "rgba(15, 15, 15, 0.92)"
            : "rgba(255, 255, 255, 0.92)",
          borderColor: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)",
          boxShadow: isDark
            ? "0 -4px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)"
            : "0 -4px 40px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)",
        }}
      >
        {/* Nav links */}
        {NAV_ITEMS.map(({ name, path, icon: Icon }) => {
          const isActive = pathname === path;
          return (
            <Link key={path} href={path} className="relative flex-1">
              <motion.div
                whileTap={{ scale: 0.88 }}
                className="flex flex-col items-center gap-1 py-1.5 px-1 rounded-[1.5rem] transition-colors relative"
                style={{
                  background: isActive
                    ? isDark ? "rgba(255,133,161,0.12)" : "rgba(255,133,161,0.1)"
                    : "transparent",
                }}
              >
                <Icon
                  size={19}
                  strokeWidth={isActive ? 2.5 : 1.8}
                  style={{ color: isActive ? "#FF85A1" : isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)" }}
                />
                <span
                  className="text-[8px] font-black uppercase tracking-widest transition-colors"
                  style={{ color: isActive ? "#FF85A1" : isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)" }}
                >
                  {name}
                </span>

                {/* Active dot */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      layoutId="navDot"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#FF85A1]"
                    />
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          );
        })}

        {/* Cart button */}
        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={onCartClick}
          className="relative flex-1 flex flex-col items-center gap-1 py-1.5 px-1 rounded-[1.5rem] transition-colors"
          style={{ background: cart.length > 0 ? "rgba(255,133,161,0.1)" : "transparent" }}
          aria-label="Open cart"
        >
          <div className="relative">
            <ShoppingBag
              size={19}
              strokeWidth={cart.length > 0 ? 2.5 : 1.8}
              style={{ color: cart.length > 0 ? "#FF85A1" : isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)" }}
            />
            <AnimatePresence>
              {cart.length > 0 && (
                <motion.span
                  key="badge"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="absolute -top-1.5 -right-2 min-w-[14px] h-[14px] bg-[#FF85A1] text-white text-[7px] font-black flex items-center justify-center rounded-full px-0.5 border-2"
                  style={{ borderColor: isDark ? "#0f0f0f" : "#fff" }}
                >
                  {cart.length > 9 ? "9+" : cart.length}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <span
            className="text-[8px] font-black uppercase tracking-widest"
            style={{ color: cart.length > 0 ? "#FF85A1" : isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)" }}
          >
            Cart
          </span>
        </motion.button>
      </div>
    </nav>
  );
}
