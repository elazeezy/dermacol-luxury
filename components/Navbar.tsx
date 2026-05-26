"use client";

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
  { name: "Home",    path: "/",       icon: Home },
  { name: "Beauty",  path: "/beauty", icon: Sparkles },
  { name: "Kitchen", path: "/kitchen",icon: Utensils },
  { name: "Ads",     path: "/ads",    icon: Megaphone },
];

export default function Navbar({ onCartClick }: NavbarProps) {
  const pathname = usePathname();
  const { cart } = useCart();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-100 px-4"
      style={{ paddingBottom: "max(env(safe-area-inset-bottom), 10px)" }}
    >
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        className="mx-auto max-w-lg rounded-4xl border backdrop-blur-2xl px-2 py-2 flex items-center justify-between"
        style={{
          background: isDark ? "rgba(13,13,13,0.94)" : "rgba(255,255,255,0.94)",
          borderColor: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)",
          boxShadow: isDark
            ? "0 -2px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)"
            : "0 -2px 32px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)",
        }}
      >
        {/* Nav links */}
        {NAV_ITEMS.map(({ name, path, icon: Icon }) => {
          const isActive = pathname === path;
          return (
            <Link key={path} href={path} className="relative flex-1 group">
              <motion.div
                whileTap={{ scale: 0.86 }}
                className="flex flex-col items-center gap-[3px] py-2 px-1 rounded-[1.6rem] transition-colors relative"
                style={{
                  background: isActive
                    ? isDark ? "rgba(255,133,161,0.13)" : "rgba(255,133,161,0.10)"
                    : "transparent",
                }}
              >
                <Icon
                  size={20}
                  strokeWidth={isActive ? 2.4 : 1.7}
                  style={{
                    color: isActive
                      ? "#FF85A1"
                      : isDark ? "rgba(255,255,255,0.32)" : "rgba(0,0,0,0.32)",
                    transition: "color 0.18s",
                  }}
                />
                <span
                  className="text-[7.5px] font-black uppercase tracking-widest transition-colors leading-none"
                  style={{
                    color: isActive
                      ? "#FF85A1"
                      : isDark ? "rgba(255,255,255,0.28)" : "rgba(0,0,0,0.28)",
                  }}
                >
                  {name}
                </span>

                {/* Active pill */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      layoutId="navPill"
                      initial={{ scaleX: 0, opacity: 0 }}
                      animate={{ scaleX: 1, opacity: 1 }}
                      exit={{ scaleX: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 380, damping: 28 }}
                      className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-5 h-[3px] rounded-full bg-dermacol-pink"
                    />
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          );
        })}

        {/* Cart button */}
        <motion.button
          whileTap={{ scale: 0.86 }}
          onClick={onCartClick}
          className="relative flex-1 flex flex-col items-center gap-[3px] py-2 px-1 rounded-[1.6rem] transition-colors"
          style={{
            background: cart.length > 0
              ? isDark ? "rgba(255,133,161,0.13)" : "rgba(255,133,161,0.10)"
              : "transparent",
          }}
          aria-label="Open cart"
        >
          <div className="relative">
            <ShoppingBag
              size={20}
              strokeWidth={cart.length > 0 ? 2.4 : 1.7}
              style={{
                color: cart.length > 0
                  ? "#FF85A1"
                  : isDark ? "rgba(255,255,255,0.32)" : "rgba(0,0,0,0.32)",
                transition: "color 0.18s",
              }}
            />
            <AnimatePresence>
              {cart.length > 0 && (
                <motion.span
                  key="badge"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 420, damping: 22 }}
                  className="absolute -top-1.5 -right-2 min-w-3.5 h-3.5 bg-dermacol-pink text-white text-[7px] font-black flex items-center justify-center rounded-full px-0.5 border-[1.5px]"
                  style={{ borderColor: isDark ? "#0d0d0d" : "#ffffff" }}
                >
                  {cart.length > 9 ? "9+" : cart.length}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <span
            className="text-[7.5px] font-black uppercase tracking-widest leading-none"
            style={{
              color: cart.length > 0
                ? "#FF85A1"
                : isDark ? "rgba(255,255,255,0.28)" : "rgba(0,0,0,0.28)",
            }}
          >
            Cart
          </span>
        </motion.button>
      </motion.div>
    </nav>
  );
}
