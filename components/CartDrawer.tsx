"use client";
import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, MessageCircle, Copy, Check, Download, Printer, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CartDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { cart, removeFromCart, total } = useCart();
  const [copied, setCopied] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText("0700090469");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop blur */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-[200] backdrop-blur-md"
          />
          
          {/* Drawer Wrapper */}
          <motion.div 
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full md:w-[450px] bg-[#E0F2FE] z-[201] shadow-2xl flex flex-col overflow-y-auto no-scrollbar"
          >
            {/* Header */}
            <div className="p-6 flex justify-between items-center sticky top-0 bg-[#E0F2FE]/80 backdrop-blur-md z-10">
              <button onClick={onClose} className="p-3 bg-white rounded-2xl shadow-sm hover:scale-110 transition-transform">
                <X size={20} className="text-gray-400" />
              </button>
              <h2 className="text-xl font-black italic uppercase tracking-tighter">Official Receipt</h2>
              <button onClick={handlePrint} className="p-3 bg-white rounded-2xl shadow-sm hover:text-[#FF85A1] transition-colors">
                <Printer size={20} />
              </button>
            </div>

            {/* THE RECEIPT CARD */}
            <div className="px-6 pb-10" id="printable-receipt" ref={receiptRef}>
              <div className="bg-white rounded-[3rem] shadow-xl overflow-hidden relative border border-white">
                {/* Receipt Pink Top Bar */}
                <div className="h-3 bg-[#FF85A1] w-full mb-8"></div>
                
                <div className="px-8 pb-10">
                  {/* Brand Header */}
                  <div className="text-center mb-8">
                    <h3 className="text-3xl font-black italic text-[#FF85A1] leading-none">DERMACOL</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[4px] mt-2">Luxury Summary</p>
                    <div className="mt-4 py-2 border-y border-dashed border-gray-100">
                       <p className="text-[9px] text-gray-400 italic font-medium">
                         {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} • ID: #{Math.floor(1000 + Math.random() * 9000)}
                       </p>
                    </div>
                  </div>

                  {/* Cart Items List */}
<div className="space-y-6 mb-8 min-h-[150px]">
  {cart.length === 0 ? (
    <div className="text-center py-10">
      <ShoppingBag size={40} className="mx-auto text-gray-200 mb-2" />
      <p className="text-gray-400 italic text-sm">Your bag is empty</p>
    </div>
  ) : (
    cart.map((item: any, idx: number) => (
      <motion.div 
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        key={idx} 
        className="flex justify-between items-start group"
      >
        <div className="flex-1">
          <p className="font-bold text-xs uppercase text-[#1A1A1A] tracking-tight">{item.name}</p>
          <button 
            // Fix: Pass item.id as a string to match the context function requirements
            onClick={() => removeFromCart(item.id.toString())} 
            className="text-[9px] font-black text-red-400 uppercase mt-1 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Trash2 size={10} /> Remove Item
          </button>
        </div>
        <p className="font-black text-[#1A1A1A] text-sm">
          {/* Fix: Added optional chaining and fallback to prevent runtime crashes */}
          ₦{(item?.price || 0).toLocaleString()}
        </p>
      </motion.div>
    ))
  )}
</div>

                  {/* Pricing Total */}
                  <div className="flex justify-between items-center mb-10 pt-6 border-t border-dashed border-gray-200">
                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Total Amount</span>
                    <span className="text-3xl font-black italic text-[#1A1A1A]">₦{total.toLocaleString()}</span>
                  </div>

                 {/* Payment Details Box */}
<div className="bg-gray-50 rounded-[2rem] p-6 border border-gray-100 mb-8">
  {/* 1. PAYMENT GUIDE - PUSHED TO TOP OF BOX */}
  <div className="mb-6 text-center">
    <h4 className="text-[10px] font-black uppercase text-[#FF85A1] mb-2 tracking-widest">
      How to Pay
    </h4>
    <ul className="text-[9px] font-bold text-gray-500 uppercase space-y-1 italic">
      <li>1. Copy the account number below</li>
      <li>2. Transfer the total amount (₦{(total || 0).toLocaleString()})</li>
      <li>3. Send your receipt to us on WhatsApp</li>
    </ul>
  </div>

  {/* 2. ENHANCED COPYABLE BOX */}
  <div 
    onClick={handleCopy}
    className="bg-white p-5 rounded-2xl border border-dashed border-gray-300 flex justify-between items-center relative overflow-hidden cursor-pointer hover:border-[#FF85A1] transition-colors group active:scale-[0.98]"
  >
    <div className="relative z-10">
      <p className="text-[10px] font-black text-[#FF85A1] uppercase mb-1 tracking-tighter">Moniepoint</p>
      <p className="text-xl font-mono font-bold text-[#1A1A1A] tracking-tighter">5911834921</p>
      <p className="text-[9px] text-gray-400 font-bold uppercase mt-1">Dermacol beauty concepts</p>
    </div>
    
    <div className="relative z-10 flex flex-col items-center gap-1">
      {copied ? (
        <div className="flex flex-col items-center animate-in zoom-in duration-300">
          <Check size={20} className="text-green-500" />
          <span className="text-[8px] font-black text-green-500 uppercase">Copied</span>
        </div>
      ) : (
        <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-[#FF85A1] group-hover:text-white transition-all">
          <Copy size={20} />
        </div>
      )}
    </div>
  </div>
</div>

                  {/* Call to Action */}
                  <a 
                    href={`https://wa.me/2348158942290?text=Hello%20Dermacol,%20I've%20paid%20for:%20${cart.map((i:any) => i.name).join(", ")}.%20Total:%20₦${total.toLocaleString()}.`} 
                    className="w-full py-5 bg-[#1A1A1A] text-white rounded-[1.5rem] font-black uppercase text-xs flex items-center justify-center gap-3 shadow-lg active:scale-95 transition-transform"
                  >
                    Confirm Order on WhatsApp <MessageCircle size={18} className="text-[#FF85A1]" />
                  </a>

                  {/* Footer Message */}
                  <div className="mt-8 text-center">
                    <p className="text-xs font-black uppercase tracking-[5px] text-gray-200">Thank You</p>
                    <p className="text-[10px] text-gray-400 italic mt-2 leading-tight">
                      "Your support fuels our passion for excellence."
                    </p>
                  </div>
                </div>

                {/* Scalloped Edge Effect */}
                <div className="flex justify-center gap-2 mb-4">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="w-5 h-5 rounded-full bg-[#E0F2FE] -mb-6"></div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}