"use client"; // Needs to be client-side because of useState
import { useState } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import { CartProvider } from "@/context/CartContext";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

// Note: Metadata should technically be in a separate file (layout.tsx) 
// but since we need 'use client' for the drawer state, keep Metadata in a 
// server component file if you run into issues, or just keep it here for simplicity.

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#E0F2FE]`}>
        <CartProvider>
          <main className="pb-24">
            {children}
          </main>
          
          {/* Cart Drawer */}
          <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
          
          {/* Pass the toggle function to Navbar */}
          <Navbar onCartClick={() => setIsCartOpen(true)} />
        </CartProvider>
      </body>
    </html>
  );
}