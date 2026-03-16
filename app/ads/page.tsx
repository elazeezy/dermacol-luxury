"use client";
import React, { useState } from 'react';
import { Megaphone, ChevronDown, Check, Copy, MessageCircle, ArrowLeft, Star, Upload } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const adCategories = [
  {
    category: "Advert Repost",
    items: [
      { name: "Link Only", price: "6,000" },
      { name: "Link & Picture", price: "8,000" },
      { name: "Link & Video", price: "10,000" },
      { name: "Demo (With Prod)", price: "40,000", note: "Includes TikTok/Snap Story" },
      { name: "Demo (No Prod)", price: "50,000", note: "Includes TikTok/Snap Story" },
    ]
  },
  {
    category: "Influencing",
    items: [
      { name: "One Week", price: "100,000", note: "Includes TikTok/Snap Story" },
      { name: "Two Weeks", price: "150,000", note: "Includes TikTok/Snap Story" },
      { name: "One Month", price: "250,000", note: "Includes TikTok/Snap Story" },
    ]
  },
  {
    category: "Ambassador Deal",
    items: [
      { name: "3 Months", price: "Contact Us" },
      { name: "6 Months", price: "Contact Us" },
      { name: "1 Year", price: "Contact Us" },
    ]
  }
];

export default function AdsPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  return (
    <div className="min-h-screen bg-[#E0F2FE] p-6 pb-24">
      <Link href="/" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 mb-8">
        <ArrowLeft size={14} /> Back Home
      </Link>

      {/* WELCOME SECTION */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 text-center">
        <h1 className="text-4xl font-black italic uppercase tracking-tighter text-[#1A1A1A]">
          Babygirl Dermacol <span className="text-[#FF85A1]">Ads</span>
        </h1>
        <p className="text-[11px] font-bold text-gray-500 uppercase tracking-[2px] mt-2">Scale your brand with our audience.</p>
      </motion.div>

     {/* AD SERVICES */}
<div className="space-y-8">
  {adCategories.map((cat, i) => (
    <div key={i}>
      <h2 className="text-sm font-black uppercase text-[#1A1A1A] mb-4 opacity-60">{cat.category}</h2>
      <div className="space-y-3">
        {cat.items.map((ad, j) => (
          <div key={j} className="bg-white p-5 rounded-[2rem] shadow-sm border border-white/50">
            <div 
              className="flex justify-between items-center cursor-pointer" 
              onClick={() => setSelected(selected === ad.name ? null : ad.name)}
            >
              <div>
                <p className="text-xs font-bold uppercase">{ad.name}</p>
                {ad.note && <p className="text-[9px] text-[#FF85A1] italic">{ad.note}</p>}
                <p className="text-[#1A1A1A] font-black text-lg">₦{ad.price}</p>
              </div>
              <ChevronDown size={20} className={`transition-transform ${selected === ad.name ? "rotate-180" : ""}`} />
            </div>

            {selected === ad.name && (
              <div className="mt-6 pt-6 border-t border-gray-100 animate-in slide-in-from-top-2 duration-300">
                {/* 1. PAYMENT GUIDE */}
                <div className="mb-4 space-y-1">
                  <p className="text-[10px] font-black uppercase text-[#FF85A1] mb-2 tracking-widest">Booking Steps:</p>
                  <ul className="text-[9px] font-bold text-gray-500 uppercase space-y-1 italic">
                    <li>1. Copy the account number below</li>
                    <li>2. Make payment of ₦{ad.price}</li>
                    <li>3. Send receipt to Dermacol's WhatsApp</li>
                  </ul>
                </div>

                {/* 2. ENHANCED COPYABLE ACCOUNT BOX */}
                <div 
                  onClick={() => {
                    navigator.clipboard.writeText("5911834921");
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="bg-[#1A1A1A] text-white p-4 rounded-2xl flex justify-between items-center mb-4 cursor-pointer active:scale-[0.98] transition-all hover:bg-black group"
                >
                  <div className="text-[10px]">
                    <p className="text-[#FF85A1] font-black">Moniepoint: 5911834921</p>
                    <p className="opacity-70">Dermacol Beauty Concepts</p>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    {copied ? (
                      <span className="text-[8px] font-black text-[#FF85A1] animate-bounce">COPIED!</span>
                    ) : (
                      <Copy size={16} className="group-hover:text-[#FF85A1] transition-colors" />
                    )}
                  </div>
                </div>

                {/* 3. WHATSAPP BUTTON */}
                <a 
                  href={`https://wa.me/2348158942290?text=Hi! I just made a payment for the ${ad.name} ad. Here is my receipt.`} 
                  className="w-full py-4 bg-[#FF85A1] text-white rounded-2xl text-[10px] font-black uppercase flex justify-center items-center gap-2 hover:opacity-90 transition-opacity"
                >
                  Send Receipt on WhatsApp <MessageCircle size={14} />
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  ))}
</div>

     
    </div>
  );
}