"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Sparkles, Utensils, Megaphone, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface NavbarProps {
  onCartClick: () => void;
}

export default function Navbar({ onCartClick }: NavbarProps) {
  const pathname = usePathname();
  const { cart } = useCart(); // Access the cart to show the badge

  const navItems = [
    { name: "Home", path: "/", icon: <Home size={20} /> },
    { name: "Beauty", path: "/beauty", icon: <Sparkles size={20} /> },
    { name: "Kitchen", path: "/kitchen", icon: <Utensils size={20} /> },
    { name: "Ads", path: "/ads", icon: <Megaphone size={20} /> },
  ];

  return (
    <nav className="fixed bottom-0 w-full z-[100] bg-white/90 backdrop-blur-lg border-t border-black/5 px-6 py-4 flex justify-between items-center shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      {navItems.map((item) => (
        <Link 
          key={item.path} 
          href={item.path}
          className={`flex flex-col items-center gap-1 transition-colors ${pathname === item.path ? 'text-[#FF85A1]' : 'text-gray-400'}`}
        >
          {item.icon}
          <span className="text-[9px] font-black uppercase tracking-widest">{item.name}</span>
        </Link>
      ))}
      
      {/* Updated Cart Trigger with Badge */}
      <button 
        onClick={onCartClick} 
        className="flex flex-col items-center gap-1 text-gray-400 hover:text-[#FF85A1] transition-all relative"
      >
        <ShoppingBag size={20} />
        <span className="text-[9px] font-black uppercase tracking-widest">Cart</span>
        
        {/* Cart count badge */}
        {cart.length > 0 && (
          <span className="absolute -top-1 right-2 bg-[#FF85A1] text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white">
            {cart.length}
          </span>
        )}
      </button>
    </nav>
  );
}