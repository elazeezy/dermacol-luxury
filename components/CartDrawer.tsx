"use client";
import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, MessageCircle, Copy, Check, Printer, ShoppingBag, Loader2, Sparkles } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useTheme } from 'next-themes';
import { supabase } from '@/lib/supabase';

export default function CartDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { cart, removeFromCart, total } = useCart();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [copied, setCopied] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);
  const [customerName, setCustomerName] = useState('');
  const [customerWhatsapp, setCustomerWhatsapp] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [savedRef, setSavedRef] = useState('');

  const paymentData = {
    beauty: { bank: "Moniepoint", account: "5911834921", name: "Dermacol Beauty Concepts", whatsapp: "2348158942290" },
    kitchen: { bank: "OPay", account: "8125666302", name: "Damilola", whatsapp: "2348125666302" },
  };

  const isKitchen = cart.some((item: any) => item.category === 'kitchen');
  const activeDetails = isKitchen ? paymentData.kitchen : paymentData.beauty;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeDetails.account);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const generateOrderRef = () => {
    const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    return `DC-${datePart}-${Math.floor(1000 + Math.random() * 9000)}`;
  };

  const handleConfirmOrder = async () => {
    if (cart.length === 0 || !customerName.trim() || !customerWhatsapp.trim()) return;
    setIsSaving(true);
    const ref = generateOrderRef();
    const msg = `Hello Dermacol, I've paid for: ${cart.map((i: any) => i.name).join(', ')}. Total: ₦${total.toLocaleString()}. Order Ref: ${ref}`;
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
    window.open(`https://wa.me/${activeDetails.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const canConfirm = customerName.trim().length > 0 && customerWhatsapp.trim().length > 0 && cart.length > 0;
  const displayRef = savedRef || `DC-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[200] backdrop-blur-md"
            style={{ background: "rgba(0,0,0,0.55)" }}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 320 }}
            className="fixed right-0 top-0 h-full w-full md:w-[460px] z-[201] shadow-2xl flex flex-col overflow-y-auto no-scrollbar"
            style={{ background: "var(--bg)" }}
          >
            {/* Header */}
            <div
              className="p-5 flex justify-between items-center sticky top-0 z-10 backdrop-blur-xl border-b"
              style={{
                background: "var(--glass-bg)",
                borderColor: "var(--border)",
              }}
            >
              <motion.button
                whileTap={{ scale: 0.88 }}
                onClick={onClose}
                className="p-2.5 rounded-2xl border transition-all"
                style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
              >
                <X size={18} style={{ color: "var(--fg-sub)" }} />
              </motion.button>

              <div className="text-center">
                <p className="text-[8px] font-black uppercase tracking-[4px]" style={{ color: "var(--fg-muted)" }}>
                  {isKitchen ? "Kitchen" : "Beauty"} Order
                </p>
                <h2 className="text-[17px] font-black italic uppercase tracking-tighter" style={{ color: "var(--fg)" }}>
                  Official Receipt
                </h2>
              </div>

              <motion.button
                whileTap={{ scale: 0.88 }}
                onClick={() => window.print()}
                className="p-2.5 rounded-2xl border transition-all"
                style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
              >
                <Printer size={18} style={{ color: "var(--fg-sub)" }} />
              </motion.button>
            </div>

            {/* Receipt Card */}
            <div className="flex-1 px-5 py-6" id="printable-receipt" ref={receiptRef}>
              <div
                className="rounded-[2.8rem] overflow-hidden border relative"
                style={{ background: "var(--bg-card)", borderColor: "var(--border-card)", boxShadow: "var(--shadow-md)" }}
              >
                {/* Pink stripe */}
                <div className="h-[3px] w-full" style={{ background: "linear-gradient(90deg, #FF85A1, #ff4d6d, #FF85A1)" }} />

                <div className="px-7 pb-8 pt-7">
                  {/* Brand header */}
                  <div className="text-center mb-7">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <div
                        className="w-7 h-7 rounded-[0.6rem] flex items-center justify-center"
                        style={{ background: "linear-gradient(135deg, #FF85A1, #ff4d6d)" }}
                      >
                        <Sparkles size={12} className="text-white" />
                      </div>
                      <h3 className="text-[26px] font-black italic text-[#FF85A1] leading-none">DERMACOL</h3>
                    </div>
                    <p className="text-[9px] font-bold uppercase tracking-[4px] mt-1" style={{ color: "var(--fg-muted)" }}>
                      {isKitchen ? "Kitchen Summary" : "Beauty Summary"}
                    </p>
                    <div className="mt-4 py-2.5 border-y border-dashed" style={{ borderColor: "var(--border)" }}>
                      <p className="text-[9px] italic font-medium" style={{ color: "var(--fg-muted)" }}>
                        {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        {" • "} Ref: {displayRef}
                      </p>
                    </div>
                  </div>

                  {/* Cart items */}
                  <div className="space-y-4 mb-7 min-h-[120px]">
                    {cart.length === 0 ? (
                      <div className="text-center py-10">
                        <div
                          className="w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center"
                          style={{ background: "var(--bg-subtle)" }}
                        >
                          <ShoppingBag size={24} style={{ color: "var(--fg-muted)" }} />
                        </div>
                        <p className="font-bold text-sm italic" style={{ color: "var(--fg-muted)" }}>
                          Your bag is empty
                        </p>
                      </div>
                    ) : (
                      cart.map((item: any, idx: number) => (
                        <motion.div
                          layout
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          key={idx}
                          className="flex justify-between items-start group"
                        >
                          <div className="flex-1 pr-3">
                            <p className="font-bold text-[11px] uppercase tracking-tight" style={{ color: "var(--fg)" }}>
                              {item.name}
                            </p>
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() => removeFromCart(item.id.toString())}
                              className="text-[8px] font-black text-red-400 uppercase mt-1 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 size={9} /> Remove
                            </motion.button>
                          </div>
                          <p className="font-black text-[13px] shrink-0" style={{ color: "var(--fg)" }}>
                            ₦{(item?.price || 0).toLocaleString()}
                          </p>
                        </motion.div>
                      ))
                    )}
                  </div>

                  {/* Total */}
                  <div
                    className="flex justify-between items-center mb-7 pt-5 border-t border-dashed"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: "var(--fg-sub)" }}>
                      Total Amount
                    </span>
                    <span className="text-[28px] font-black italic" style={{ color: "var(--fg)" }}>
                      ₦{total.toLocaleString()}
                    </span>
                  </div>

                  {/* Payment box */}
                  <div
                    className="rounded-[1.8rem] p-5 border mb-5"
                    style={{ background: "var(--bg-subtle)", borderColor: "var(--border)" }}
                  >
                    <p className="text-[9px] font-black uppercase tracking-[3px] text-[#FF85A1] mb-4 text-center">
                      Payment Details
                    </p>

                    <motion.div
                      whileTap={{ scale: 0.98 }}
                      onClick={handleCopy}
                      className="flex justify-between items-center p-4 rounded-2xl cursor-pointer border mb-3 transition-all"
                      style={{
                        background: "var(--bg-card)",
                        borderColor: copied ? "rgba(255,133,161,0.4)" : "var(--border)",
                      }}
                    >
                      <div>
                        <p className="text-[9px] font-black text-[#FF85A1] uppercase tracking-widest mb-0.5">
                          {activeDetails.bank}
                        </p>
                        <p className="text-[18px] font-mono font-bold" style={{ color: "var(--fg)" }}>
                          {activeDetails.account}
                        </p>
                        <p className="text-[9px] font-bold uppercase mt-0.5" style={{ color: "var(--fg-sub)" }}>
                          {activeDetails.name}
                        </p>
                      </div>
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
                        style={{ background: copied ? "rgba(34,197,94,0.12)" : "rgba(255,133,161,0.10)" }}
                      >
                        {copied
                          ? <Check size={16} className="text-green-500" />
                          : <Copy size={16} className="text-[#FF85A1]" />}
                      </div>
                    </motion.div>

                    {copied && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[8px] font-black text-green-500 uppercase tracking-widest text-center mb-1"
                      >
                        Copied!
                      </motion.p>
                    )}

                    <ul
                      className="text-[9px] font-bold uppercase space-y-1 italic"
                      style={{ color: "var(--fg-sub)" }}
                    >
                      <li>1. Copy the account number above</li>
                      <li>2. Transfer ₦{(total || 0).toLocaleString()}</li>
                      <li>3. Send receipt to us via WhatsApp</li>
                    </ul>
                  </div>

                  {/* Customer details */}
                  <div className="space-y-3 mb-5">
                    <p
                      className="text-[9px] font-black uppercase tracking-[3px] text-center"
                      style={{ color: "var(--fg-muted)" }}
                    >
                      Your Details
                    </p>
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-4 py-3.5 rounded-2xl text-sm font-bold transition-all outline-none"
                      style={{
                        background: "var(--input-bg)",
                        color: "var(--fg)",
                        border: "1px solid var(--border)",
                      }}
                      onFocus={(e) => { e.target.style.borderColor = "#FF85A1"; e.target.style.boxShadow = "0 0 0 3px rgba(255,133,161,0.12)"; }}
                      onBlur={(e) => { e.target.style.borderColor = "var(--border)"; e.target.style.boxShadow = "none"; }}
                    />
                    <input
                      type="tel"
                      placeholder="WhatsApp Number (e.g. 08012345678)"
                      value={customerWhatsapp}
                      onChange={(e) => setCustomerWhatsapp(e.target.value)}
                      className="w-full px-4 py-3.5 rounded-2xl text-sm font-bold transition-all outline-none"
                      style={{
                        background: "var(--input-bg)",
                        color: "var(--fg)",
                        border: "1px solid var(--border)",
                      }}
                      onFocus={(e) => { e.target.style.borderColor = "#FF85A1"; e.target.style.boxShadow = "0 0 0 3px rgba(255,133,161,0.12)"; }}
                      onBlur={(e) => { e.target.style.borderColor = "var(--border)"; e.target.style.boxShadow = "none"; }}
                    />
                  </div>

                  {/* Confirm button */}
                  <motion.button
                    whileHover={canConfirm && !isSaving ? { scale: 1.02 } : {}}
                    whileTap={canConfirm && !isSaving ? { scale: 0.97 } : {}}
                    onClick={handleConfirmOrder}
                    disabled={!canConfirm || isSaving}
                    className="w-full py-4 rounded-[1.5rem] font-black uppercase text-[11px] flex items-center justify-center gap-3 shadow-xl transition-all"
                    style={{
                      background: canConfirm && !isSaving ? "#1A1A1A" : isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
                      color: canConfirm && !isSaving ? "#ffffff" : "var(--fg-muted)",
                      cursor: canConfirm && !isSaving ? "pointer" : "not-allowed",
                    }}
                  >
                    {isSaving ? (
                      <><Loader2 size={16} className="animate-spin" /> Saving Order...</>
                    ) : (
                      <>Confirm Order on WhatsApp <MessageCircle size={16} className="text-[#FF85A1]" /></>
                    )}
                  </motion.button>

                  {/* Footer */}
                  <div className="mt-7 text-center">
                    <p className="text-[10px] font-black uppercase tracking-[5px]" style={{ color: "var(--fg-muted)" }}>
                      Thank You
                    </p>
                    <p className="text-[9px] italic mt-1.5 leading-tight" style={{ color: "var(--fg-muted)" }}>
                      "Your support fuels our passion for excellence."
                    </p>
                  </div>
                </div>

                {/* Scalloped edge */}
                <div className="flex justify-center gap-2 pb-3">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="w-5 h-5 rounded-full -mb-4" style={{ background: "var(--bg)" }} />
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
