import React from 'react';
import { motion } from 'framer-motion';

export default function AnnouncementTicker() {
  return (
    <div className="w-full bg-[#FF85A1] text-white py-1 overflow-hidden">
      <motion.div 
        className="whitespace-nowrap inline-block text-[10px] font-black uppercase tracking-[2px]"
        animate={{ x: ["100%", "-100%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <span>FREE DELIVERY FOR ALL WEBSITE ORDERS! </span>
        <span className="mx-10">FREE DELIVERY FOR ALL WEBSITE ORDERS! </span>
        <span className="mx-10">FREE DELIVERY FOR ALL WEBSITE ORDERS! </span>
      </motion.div>
    </div>
  );
}