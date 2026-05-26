"use client";
import { useEffect, useState } from 'react';
import { ShoppingBag, Utensils, ArrowLeft, Star, Clock, Loader2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';

type FoodItem = {
  id: number;
  name: string;
  new_price: number;
  media_url: string;
};

export default function KitchenPage() {
  const { addToCart } = useCart();
  const [foodMenu, setFoodMenu] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('products')
      .select('id, name, new_price, media_url')
      .eq('category', 'kitchen')
      .order('new_price', { ascending: true })
      .then(({ data }) => {
        setFoodMenu((data as FoodItem[]) || []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#E0F2FE] p-6 pb-24">
      {/* Header Navigation */}
      <Link href="/" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-8 hover:text-[#FF85A1] transition-colors">
        <ArrowLeft size={14} /> Back Home
      </Link>

      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <div className="flex items-center gap-3 mb-3">
          <Utensils className="text-orange-500" size={32} />
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-[#1A1A1A]">Dbolicious</h1>
        </div>
        <p className="text-[11px] text-gray-500 font-bold uppercase tracking-[2px] mb-4 italic">
          "Homemade delicacies, delivered with love."
        </p>
        <div className="flex gap-4">
          <span className="flex items-center gap-1 text-[10px] font-black bg-white px-3 py-1 rounded-full text-orange-500 shadow-sm">
            <Clock size={12} /> 30-45 MINS
          </span>
          <span className="flex items-center gap-1 text-[10px] font-black bg-white px-3 py-1 rounded-full text-yellow-500 shadow-sm">
            <Star size={12} fill="currentColor" /> 5.0 RATED
          </span>
        </div>
      </motion.div>

      {/* Menu Grid */}
      {loading ? (
        <div className="flex justify-center py-24">
          <Loader2 size={32} className="animate-spin text-orange-500" />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {foodMenu.map((food, index) => (
            <motion.div
              key={food.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-4 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="aspect-square rounded-[1.5rem] overflow-hidden mb-4 bg-gray-100 relative group">
                <img
                  src={food.media_url}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  alt={food.name}
                />
              </div>

              <div className="px-1 flex-1 flex flex-col">
                <h4 className="font-black text-[11px] uppercase text-gray-800 leading-tight mb-2">{food.name}</h4>
                <div className="flex justify-between items-center mt-auto">
                  <span className="text-orange-500 font-black text-sm">₦{food.new_price.toLocaleString()}</span>
                  <button
                    onClick={() => addToCart({
                      id: `food-${food.id}`,
                      name: food.name,
                      price: food.new_price,
                      category: 'kitchen'
                    })}
                    className="p-3 bg-orange-50 text-orange-500 rounded-2xl active:scale-90 transition-all hover:bg-orange-500 hover:text-white"
                  >
                    <ShoppingBag size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
