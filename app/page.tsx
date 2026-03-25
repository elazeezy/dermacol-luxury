"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Sparkles, Megaphone, Utensils, MapPin, Instagram, Youtube, Mail, ExternalLink, Phone, Music } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import AnnouncementTicker from '@/components/AnnouncementTicker';

export default function LandingPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const { cart, setIsCartOpen } = useCart(); // Accessing cart state

  useEffect(() => setIsLoaded(true), []);

  const brands = [
    { name: "Beauty Concept", desc: "9 years of natural beauty.", link: "/beauty", color: "bg-[#FF85A1]", icon: <Sparkles size={20}/>, img: "/hero-beauty.jpg" },
    { name: "Ads Portal", desc: "Connect with more audience.", link: "/ads", color: "bg-[#1A1A1A]", icon: <Megaphone size={20}/>, img: "/hero-ads.jpg" },
    { name: "Dbolicious", desc: "Homemade food varieties.", link: "/kitchen", color: "bg-orange-500", icon: <Utensils size={20}/>, img: "/hero-food.jpg" }
  ];

  return (
    <main className="min-h-screen bg-[#E0F2FE] pb-12 overflow-x-hidden">
      
      {/* 1. PREMIUM FLOATING HEADER */}
      <motion.nav 
        initial={{ y: -100 }} 
        animate={{ y: 0 }}
        className="fixed top-4 left-1/2 -translate-x-1/2 w-[92%] z-[100] bg-white/40 backdrop-blur-xl px-5 py-3 flex justify-between items-center border border-white/40 rounded-[2.5rem] shadow-[0_8px_32px_rgba(0,0,0,0.05)]"
      >
        <span className="text-lg font-black italic tracking-tighter text-[#1A1A1A]">
          DERMACOL
        </span>

        {/* Decorative "Meatballs" */}
        <div className="hidden sm:flex items-center gap-1.5 bg-black/5 px-4 py-2 rounded-full">
          <div className="w-1.5 h-1.5 rounded-full bg-[#FF85A1] opacity-60" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#1A1A1A] opacity-20" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#1A1A1A] opacity-20" />
        </div>

        <button 
          onClick={() => setIsCartOpen(true)}
          className="relative p-3 bg-white rounded-2xl shadow-sm border border-black/5 active:scale-90 transition-transform"
        >
          <ShoppingBag size={18} className="text-[#1A1A1A]" />
          {cart.length > 0 && (
            <motion.span 
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF85A1] text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-[#E0F2FE]"
            >
              {cart.length}
            </motion.span>
          )}
        </button>
        
      </motion.nav>

      

      {/* 2. HIGH ENERGY HERO */}
      <section className="pt-36 px-6 text-center mb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-6xl font-black italic uppercase leading-[0.85] mb-6 tracking-tighter">
            Welcome to <br/><span className="text-[#FF85A1]">Dermacol</span>
          </h1>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[4px] mb-8">
            Quality. Classy. Extraordinary.
          </p>
          <motion.a 
            href="#explore"
            whileTap={{ scale: 0.95 }}
            className="inline-block px-10 py-5 bg-[#1A1A1A] text-white rounded-[2rem] font-black uppercase tracking-widest shadow-xl text-[12px]"
          >
            Explore Services
          </motion.a>
        </motion.div>
      </section>

      <AnnouncementTicker />

      <div className="h-12" />
      
      {/* 3. EXPERIENCE CARDS */}
      <div id="explore" className="px-6 grid gap-6 max-w-2xl mx-auto">
        {brands.map((brand, i) => (
          <motion.a 
            key={i} href={brand.link}
            initial={{ opacity: 0, scale: 0.9 }} 
            whileInView={{ opacity: 1, scale: 1 }} 
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="group relative h-[300px] rounded-[3.5rem] overflow-hidden shadow-2xl border-4 border-white"
          >
            <img src={brand.img} alt={brand.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
            <div className={`absolute inset-0 ${brand.color} opacity-70 group-hover:opacity-60 transition-opacity`} />
            <div className="absolute inset-0 p-10 flex flex-col justify-between text-white">
              <div className="bg-white/20 w-14 h-14 rounded-[1.5rem] flex items-center justify-center backdrop-blur-md border border-white/30">
                {brand.icon}
              </div>
              <div>
                <h3 className="text-4xl font-black italic uppercase mb-1">{brand.name}</h3>
                <p className="text-[11px] opacity-90 uppercase font-bold tracking-[2px]">{brand.desc}</p>
              </div>
            </div>
          </motion.a>
        ))}
      </div>

      <footer className="mt-20 bg-white rounded-t-[2rem] pt-12 pb-8 px-6">
  <div className="max-w-4xl mx-auto">
    <div className="grid grid-cols-2 gap-y-10 gap-x-6 mb-12">
      
      {/* Brand Identity */}
      <div className="col-span-2 space-y-2">
        <h2 className="text-xl font-black italic tracking-tighter text-[#1A1A1A]">DERMACOL</h2>
        <p className="text-[9px] font-bold text-gray-400 uppercase leading-relaxed max-w-[200px]">
          Beauty, Ads, & Culinary Delights. 9 years of excellence.
        </p>
      </div>

      {/* Direct Contact */}
      <div className="space-y-3">
        <h4 className="text-[9px] font-black uppercase tracking-widest text-[#FF85A1]">Direct</h4>
        <ul className="space-y-2 text-[9px] font-bold uppercase text-gray-600">
          <li>Beauty: 08065253247</li>
          <li>Ads: 08158942290</li>
          <li>Food: 08125666302</li>
        </ul>
      </div>

      {/* Visit & Connect */}
      <div className="space-y-3">
        <h4 className="text-[9px] font-black uppercase tracking-widest text-[#FF85A1]">Visit & Connect</h4>
        <p className="text-[9px] font-bold text-gray-600 uppercase leading-tight mb-3">
          Datboy Building, <br/> Ilaro, Ogun State.
        </p>
        
        {/* Added clickable Social Links */}
        <div className="flex gap-4 pt-2">
          <a href="https://www.instagram.com/babygirl_dermacol?igsh=MWh2czhtcTZrZDJ4bg==" target="_blank"><Instagram size={16} className="text-gray-400 hover:text-[#FF85A1]" /></a>
          <a href="https://www.tiktok.com/@babygirldermacol?_r=1&_t=ZS-94jFGxIIFwP" target="_blank"><Music size={16} className="text-gray-400 hover:text-[#FF85A1]" /></a>
          <a href="mailto:dermacolconcepts@gmail.com"><Mail size={16} className="text-gray-400 hover:text-[#FF85A1]" /></a>
        </div>
      </div>
    </div>

    {/* Copyright & Dev Credit */}
    <div className="pt-6 border-t border-gray-100 flex flex-col items-center gap-4">
      <p className="text-[8px] font-bold text-gray-300 uppercase tracking-[2px]">
        &copy; {new Date().getFullYear()} Dermacol
      </p>
      <a 
        href="https://wa.me/2349031476912" 
        target="_blank"
        className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full text-[8px] font-black uppercase tracking-widest text-gray-500 hover:bg-[#1A1A1A] hover:text-white transition-all"
      >
        Developed by <span className="text-[#FF85A1]">el_azeezy</span>
        <ExternalLink size={8} />
      </a>
    </div>
  </div>
</footer>
    </main>
  );
}