"use client";
import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, MessageCircle, Copy, Check, Printer, ShoppingBag, Loader2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { supabase } from '@/lib/supabase';

export default function CartDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { cart, removeFromCart, total } = useCart();
  const [copied, setCopied] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);

  // Customer info for order tracking
  const [customerName, setCustomerName] = useState('');
  const [customerWhatsapp, setCustomerWhatsapp] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [savedRef, setSavedRef] = useState('');

  // 1. PAYMENT CONFIGURATION
  const paymentData = {
    beauty: {
      bank: "Moniepoint",
      account: "5911834921",
      name: "Dermacol beauty concepts",
      whatsapp: "2348158942290"
    },
    kitchen: {
      bank: "OPay",
      account: "8125666302",
      name: "Damilola",
      whatsapp: "2348125666302"
    }
  };

  // 2. SWITCHING LOGIC
  const isKitchen = cart.some((item: any) => item.category === 'kitchen');
  const activeDetails = isKitchen ? paymentData.kitchen : paymentData.beauty;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeDetails.account);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  // Generate a real order reference
  const generateOrderRef = () => {
    const date = new Date();
    const datePart = date.toISOString().slice(0, 10).replace(/-/g, '');
    const randomPart = Math.floor(1000 + Math.random() * 9000);
    return `DC-${datePart}-${randomPart}`;
  };

  // Save order to Supabase then open WhatsApp
  const handleConfirmOrder = async () => {
    if (cart.length === 0) return;
    if (!customerName.trim() || !customerWhatsapp.trim()) return;

    setIsSaving(true);
    const ref = generateOrderRef();

    const whatsappMessage = `Hello Dermacol, I've paid for: ${cart.map((i: any) => i.name).join(', ')}. Total: ₦${total.toLocaleString()}. Order Ref: ${ref}`;
    const whatsappUrl = `https://wa.me/${activeDetails.whatsapp}?text=${encodeURIComponent(whatsappMessage)}`;

    await supabase.from('orders').insert({
      order_ref: ref,
      customer_name: customerName.trim(),
      customer_whatsapp: customerWhatsapp.trim(),
      items: cart.map((i: any) => ({ id: i.id, name: i.name, price: i.price })),
      total_amount: total,
      status: 'pending',
      category: isKitchen ? 'kitchen' : 'beauty',
    });

    setSavedRef(ref);
    setIsSaving(false);
    window.open(whatsappUrl, '_blank');
  };

  const canConfirm = customerName.trim().length > 0 && customerWhatsapp.trim().length > 0 && cart.length > 0;

  // Display ref: use saved real ref if available, else a preview placeholder
  const displayRef = savedRef || `DC-${new Date().toISOString().slice(0,10).replace(/-/g,'')}`;

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
                <div className="h-3 bg-[#FF85A1] w-full mb-8"></div>

                <div className="px-8 pb-10">
                  {/* Brand Header */}
                  <div className="text-center mb-8">
                    <h3 className="text-3xl font-black italic text-[#FF85A1] leading-none">DERMACOL</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[4px] mt-2">
                      {isKitchen ? "Kitchen Summary" : "Beauty Summary"}
                    </p>
                    <div className="mt-4 py-2 border-y border-dashed border-gray-100">
                       <p className="text-[9px] text-gray-400 italic font-medium">
                         {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} • Ref: {displayRef}
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
                        <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={idx} className="flex justify-between items-start group">
                          <div className="flex-1">
                            <p className="font-bold text-xs uppercase text-[#1A1A1A] tracking-tight">{item.name}</p>
                            <button onClick={() => removeFromCart(item.id.toString())} className="text-[9px] font-black text-red-400 uppercase mt-1 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Trash2 size={10} /> Remove Item
                            </button>
                          </div>
                          <p className="font-black text-[#1A1A1A] text-sm">₦{(item?.price || 0).toLocaleString()}</p>
                        </motion.div>
                      ))
                    )}
                  </div>

                  {/* Pricing Total */}
                  <div className="flex justify-between items-center mb-10 pt-6 border-t border-dashed border-gray-200">
                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Total Amount</span>
                    <span className="text-3xl font-black italic text-[#1A1A1A]">₦{total.toLocaleString()}</span>
                  </div>

                  {/* Dynamic Payment Details Box */}
                  <div className="bg-gray-50 rounded-[2rem] p-6 border border-gray-100 mb-6">
                    <div className="mb-6 text-center">
                      <h4 className="text-[10px] font-black uppercase text-[#FF85A1] mb-2 tracking-widest">How to Pay</h4>
                      <ul className="text-[9px] font-bold text-gray-500 uppercase space-y-1 italic">
                        <li>1. Copy the account number below</li>
                        <li>2. Transfer the total amount (₦{(total || 0).toLocaleString()})</li>
                        <li>3. Send your receipt to us on WhatsApp</li>
                      </ul>
                    </div>

                    <div onClick={handleCopy} className="bg-white p-5 rounded-2xl border border-dashed border-gray-300 flex justify-between items-center relative overflow-hidden cursor-pointer hover:border-[#FF85A1] transition-colors group active:scale-[0.98]">
                      <div className="relative z-10">
                        <p className="text-[10px] font-black text-[#FF85A1] uppercase mb-1 tracking-tighter">{activeDetails.bank}</p>
                        <p className="text-xl font-mono font-bold text-[#1A1A1A] tracking-tighter">{activeDetails.account}</p>
                        <p className="text-[9px] text-gray-400 font-bold uppercase mt-1">{activeDetails.name}</p>
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

                  {/* Customer Info Fields */}
                  <div className="space-y-3 mb-6">
                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest text-center">Your Details</p>
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-5 py-4 rounded-2xl border border-gray-200 text-sm font-bold text-[#1A1A1A] placeholder:text-gray-300 focus:outline-none focus:border-dermacol-pink transition-colors bg-gray-50"
                    />
                    <input
                      type="tel"
                      placeholder="Your WhatsApp Number (e.g. 08012345678)"
                      value={customerWhatsapp}
                      onChange={(e) => setCustomerWhatsapp(e.target.value)}
                      className="w-full px-5 py-4 rounded-2xl border border-gray-200 text-sm font-bold text-[#1A1A1A] placeholder:text-gray-300 focus:outline-none focus:border-dermacol-pink transition-colors bg-gray-50"
                    />
                  </div>

                  {/* Call to Action Button */}
                  <button
                    onClick={handleConfirmOrder}
                    disabled={!canConfirm || isSaving}
                    className="w-full py-5 bg-[#1A1A1A] text-white rounded-[1.5rem] font-black uppercase text-xs flex items-center justify-center gap-3 shadow-lg active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 size={18} className="animate-spin" /> Saving Order...
                      </>
                    ) : (
                      <>
                        Confirm Order on WhatsApp <MessageCircle size={18} className="text-dermacol-pink" />
                      </>
                    )}
                  </button>

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
