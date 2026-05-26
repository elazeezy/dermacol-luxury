"use client";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";
import { CartProvider, useCart } from "@/context/CartContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Analytics } from "@vercel/analytics/react";

// Inner shell reads cart state from context (single source of truth)
function Shell({ children }: { children: React.ReactNode }) {
  const { isCartOpen, setIsCartOpen } = useCart();
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1">{children}</div>
      {/* pb-28 gives enough clearance so the fixed navbar never overlaps the footer */}
      <div className="pb-28">
        <Footer />
      </div>
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <Navbar onCartClick={() => setIsCartOpen(true)} />
    </div>
  );
}

export default function ClientShell({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange={false}
    >
      <CartProvider>
        <Shell>{children}</Shell>
      </CartProvider>
      <Analytics />
    </ThemeProvider>
  );
}
