"use client";
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { wigs } from "@/data/wigsData";
import { services } from "@/data/servicesData";
import { ShoppingBag, X, ZoomIn, Calendar, Search, ArrowUpDown } from 'lucide-react';

export default function BeautyPage() {
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  // New States for Filter & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"none" | "low" | "high">("none");

  // Logic to Filter and Sort Wigs
  const filteredWigs = useMemo(() => {
    let result = wigs.filter((wig) =>
      wig.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wig.type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (sortOrder === "low") {
      result.sort((a, b) => a.newPrice - b.newPrice);
    } else if (sortOrder === "high") {
      result.sort((a, b) => b.newPrice - a.newPrice);
    }

    return result;
  }, [searchQuery, sortOrder]);

  return (
    <div className="min-h-screen bg-[#E0F2FE] pb-24 px-6 text-[#1A1A1A]">
      
      {/* 1. HERO HEADER */}
      <div className="pt-12 mb-6">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#FF85A1] to-[#ff6b8e] p-8 rounded-[3rem] shadow-xl text-center relative overflow-hidden"
        >
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white mb-2 relative z-10">
            Wigstore
          </h1>
          <p className="text-white/90 text-[11px] font-bold uppercase tracking-[2px] relative z-10">
            Shop quality and classy wigs from our store
          </p>
        </motion.div>
      </div>

      {/* 2. SEARCH & FILTER BAR */}
      <div className="flex gap-2 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text"
            placeholder="Search wigs, grams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/80 backdrop-blur-md border border-white p-4 pl-12 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-[#FF85A1] transition-all"
          />
        </div>
        <button 
          onClick={() => setSortOrder(sortOrder === "low" ? "high" : "low")}
          className="bg-white/80 backdrop-blur-md border border-white p-4 rounded-2xl flex items-center gap-2 text-[10px] font-black uppercase transition-all active:scale-95"
        >
          <ArrowUpDown size={14} className="text-[#FF85A1]" />
          {sortOrder === "low" ? "Price: Low" : sortOrder === "high" ? "Price: High" : "Sort"}
        </button>
      </div>

      {/* 3. WIG GRID */}
      <div className="grid grid-cols-2 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredWigs.length > 0 ? (
            filteredWigs.map((wig) => (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={wig.id} 
                className="bg-white p-3 rounded-[2rem] shadow-sm border border-white/50 flex flex-col h-full"
              >
                <div 
                  className="aspect-[4/5] rounded-[1.5rem] overflow-hidden mb-3 bg-gray-100 relative group cursor-pointer"
                  onClick={() => setSelectedImage(wig.media)}
                >
                  {wig.isVideo ? (
                    <video src={wig.media} className="w-full h-full object-cover" autoPlay muted loop playsInline />
                  ) : (
                    <img src={wig.media} alt={wig.name} className="w-full h-full object-cover" />
                  )}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <ZoomIn className="text-white" size={24} />
                  </div>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-[11px] font-black uppercase leading-tight">{wig.name}</h3>
                  <div className="flex flex-wrap gap-1 mt-1 mb-2">
                    <span className="text-[8px] bg-[#E0F2FE] text-[#1A1A1A] px-2 py-0.5 rounded-full font-bold uppercase">
                      {wig.inches}
                    </span>
                    <span className="text-[8px] bg-pink-50 text-[#FF85A1] px-2 py-0.5 rounded-full font-bold uppercase">
                      {wig.type}
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-2">
                  <div className="flex flex-col">
                    {wig.oldPrice && wig.oldPrice !== "N/A" && (
                      <span className="text-[8px] text-gray-400 line-through tracking-tighter">₦{wig.oldPrice}</span>
                    )}
                    <span className="text-sm font-black text-[#FF85A1]">₦{wig.newPrice.toLocaleString()}</span>
                  </div>
                  <button 
                    onClick={() => addToCart({
                      id: `wig-${wig.id}`,
                      name: `${wig.name} (${wig.type})`,
                      price: wig.newPrice
                    })}
                    className="bg-[#1A1A1A] text-white p-2.5 rounded-xl active:scale-90 transition-transform shadow-lg shadow-black/10"
                  >
                    <ShoppingBag size={14} />
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-2 py-20 text-center">
              <p className="text-gray-400 italic text-sm font-bold uppercase tracking-widest">No wigs found</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* 4. SERVICES SECTION */}
      <h2 className="text-2xl font-black italic uppercase mt-16 mb-6">
        Book <span className="text-[#FF85A1]">Service</span>
      </h2>
      <div className="space-y-3">
        {services.map((service, index) => (
          <motion.div 
            key={index}
            className="flex justify-between items-center bg-white p-4 rounded-[1.5rem] shadow-sm border border-white/50"
          >
            <span className="text-[11px] font-black uppercase text-gray-700 tracking-wide">{service}</span>
            <a 
              href={`https://wa.me/2348158942290?text=Hello%20Dermacol,%20I%20want%20to%20book%20a%20slot%20for%20${service}`}
              className="text-[9px] font-black uppercase bg-[#FF85A1] text-white px-4 py-2 rounded-xl flex items-center gap-2"
            >
              Book Now <Calendar size={12} />
            </a>
          </motion.div>
        ))}
      </div>

      {/* 5. LIGHTBOX */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[500] bg-black/95 flex items-center justify-center p-4 backdrop-blur-md"
            onClick={() => setSelectedImage(null)}
          >
            <button className="absolute top-8 right-8 text-white p-3 bg-white/10 rounded-full"><X size={24} /></button>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="max-w-full max-h-[85vh] rounded-3xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedImage.endsWith('.mp4') ? (
                <video src={selectedImage} controls autoPlay className="max-w-full max-h-[85vh] rounded-3xl" />
              ) : (
                <img src={selectedImage} alt="Preview" className="max-w-full max-h-[85vh] object-contain rounded-3xl" />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}