"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import { CartProvider } from "@/context/CartContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Analytics } from "@vercel/analytics/react";

export default function ClientShell({ children }: { children: React.ReactNode }) {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange={false}
    >
      <CartProvider>
        <div className="pb-28">
          {children}
        </div>
        <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        <Navbar onCartClick={() => setIsCartOpen(true)} />
      </CartProvider>
      <Analytics />
    </ThemeProvider>
  );
}
