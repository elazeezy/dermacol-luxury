"use client";
import React, { createContext, useContext, useState } from 'react';

// Define the shape of your cart items
interface CartItem {
  id: string;
  name: string;
  price: number;
  category: 'beauty' | 'kitchen'; // Add this to track the shop
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  total: number; // Added to fix the 'total' property error
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (item: CartItem) => setCart((prev) => [...prev, item]);
  // Ensure this part in CartContext.tsx matches
const removeFromCart = (id: string) => {
  setCart((prev) => prev.filter((i) => i.id.toString() !== id));
};
  // Calculate total dynamically
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, total, isCartOpen, setIsCartOpen }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};