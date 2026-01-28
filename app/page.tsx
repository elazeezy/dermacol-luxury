"use client";
import React, { useEffect, useState } from 'react';
import { 
  ShoppingBag, Utensils, Clock, Megaphone, 
  Instagram, Phone, Heart, MessageCircle, 
  Menu, X, Trash2, Calendar, Mail, Video, Copy, Check,ChevronDown
  } from 'lucide-react';
  

// --- UPDATED DATA SETS ---
const wigStore = [
  { id: 'w1', name: "Bone Straight Luxury", price: 185000 },
  { id: 'w2', name: "Curly Frontal Wig", price: 120000 },
  { id: 'w3', name: "Bouncing Kim K", price: 95000 },
];

const beautyServices = [
  { name: "Makeup", price: "25k" , img: "makeup.jpg"},
  { name: "Content space", price: "8k"  , img: "content-space.jpg"},
  { name: "Mobile photography", price: "20k" , img: "mobile-photography.jpg" },
  { name: "Hair installation", price: "15k"  , img: "hair-installation.jpg"},
  { name: "Braids", price: "Style dependent" , img: "braids.jpg"},
  { name: "Weaves", price: "Style dependent"  , img: "weaves.jpg" },
  { name: "Barbing", price: "2k" , img: "barbing.jpg"},
  { name: "Manicure", price: "5k" , img: "manicure.jpg"},
  { name: "Pedicure", price: "8k" , img: "pedicure.jpg"},
  { name: "Facials", price: "15k" , img: "facials.jpg"},
  { name: "Bodywash", price: "40k" , img: "bodywash.jpg"},
  { name: "Body massage", price: "15k" , img: "body-massage.jpg"},
  { name: "Waxing", price: "5k" , img: "waxing.jpg"},
  { name: "Teeth-whitening", price: "30k" , img: "teeth-whitening.jpg"},
  { name: "Skin tag removal", price: "10k" , img: "skin-tag-removal.jpg"},
  { name: "Braces", price: "20k" , img: "braces.jpg"},
  { name: "Tooth gems", price: "15k" , img: "tooth-gems.jpg"},
  { name: "Nails", price: "5k" , img: "nails.jpg"},
  { name: "Lash extensions", price: "8k" , img: "lash-extensions.jpg"},
];

const foodMenu = [
  { id: 'f1', name: "Boli, Sauce & Turkey", price: 4500 },
  { id: 'f2', name: "Spaghetti & Turkey", price: 4500 },
  { id: 'f3', name: "Asun Spaghetti", price: 5000 },
  { id: 'f4', name: "Chicken & Chips", price: 4000 },
  { id: 'f5', name: "Noodles & Egg", price: 2500 },
  { id: 'f6', name: "Yam and Egg", price: 3000 },
  { id: 'f7', name: "Snail Snacks", price: 6000 },
];

const ads = [
    { category: "Advert Repost", items: [
      { name: "Link Only", price: "6,000" },
      { name: "Link & Picture", price: "8,000" },
      { name: "Link & Video", price: "10,000" },
      { name: "Demo (With Prod)", price: "40,000" },
      { name: "Demo (No Prod)", price: "50,000" },
    ]},
    { category: "Influencing", items: [
      { name: "One Week", price: "100,000" },
      { name: "Two Weeks", price: "150,000" },
      { name: "One Month", price: "250,000" },
    ]},
    { category: "Ambassador Deal", items: [
      { name: "3 Months", price: "Contact" },
      { name: "6 Months", price: "Contact" },
      { name: "1 Year", price: "Contact" },
    ]}
  ];



export default function PremiumHome() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState<{id: string, name: string, price: number}[]>([])

  ;

  const [isLoaded, setIsLoaded] = useState(false);

useEffect(() => {
  setIsLoaded(true);
}, []);

   const [copied, setCopied] = useState(false);

const handleCopy = () => {
  navigator.clipboard.writeText("0700090469");
  setCopied(true);
  setTimeout(() => setCopied(false), 2000);
};  

  const addToCart = (item: {id: string, name: string, price: number}) => {
    setCart([...cart, item]);
    setIsCartOpen(true);
  };

  const removeFromCart = (index: number) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="min-h-screen bg-[#E0F2FE] text-[#1A1A1A] font-sans pb-10">
      
      {/* 1. TOP NAV BAR */}
      <nav className="fixed w-full z-[100] bg-white/90 backdrop-blur-lg border-b border-gray-100 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <span className="text-2xl font-black tracking-tighter text-[#FF85A1] italic leading-none">DERMACOL</span>
          <div className="hidden lg:flex gap-6 text-[11px] font-bold uppercase tracking-widest text-gray-500">
            <a href="#beauty" className="hover:text-[#FF85A1] transition">Beauty Concepts</a>
            <a href="#food" className="hover:text-[#FF85A1] transition">Dbolicious Kitchen</a>
            <a href="#ads" className="hover:text-[#FF85A1] transition">Ad Portal</a>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setIsCartOpen(true)} className="bg-[#1A1A1A] text-white p-3 rounded-2xl relative shadow-lg active:scale-95 transition">
            <ShoppingBag size={20} />
            {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-[#FF85A1] text-[9px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white font-bold">{cart.length}</span>}
          </button>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* MOBILE OVERLAY */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[95] bg-white pt-24 px-8 flex flex-col gap-6 text-2xl font-black italic text-[#FF85A1]">
          <a href="#beauty" onClick={() => setIsMenuOpen(false)}>BEAUTY CONCEPTS</a>
          <a href="#food" onClick={() => setIsMenuOpen(false)}>DBOLICIOUS</a>
          <a href="#ads" onClick={() => setIsMenuOpen(false)}>AD PORTAL</a>
        </div>
      )}

      {/* REORGANIZED MAIN WRAPPER FOR MOBILE ORDERING */}
      <div className="flex flex-col lg:flex-row gap-8 px-4 lg:px-12 pt-24">
        
        {/* SIDEBAR: Order-1 on mobile puts this ABOVE the shop */}
        <aside className="w-full lg:w-[360px] space-y-6 order-1 lg:order-2">


 
         {/* FOUNDER HEADER CARD */}
<div className={`transition-all duration-[1200] ease-out delay-500 transform ${
  isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-12'
}`}>
  <div className="bg-white rounded-[3rem] p-6 shadow-sm border border-gray-50 flex items-center gap-5 mx-4 mt-6">
    {/* Profile Image with subtle scale-up */}
    <div className={`relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#FF85A1]/20 p-1 transition-transform duration-1000 delay-1000 ${
      isLoaded ? 'scale-100' : 'scale-50'
    }`}>
      <img 
        src="/owner-portrait.jpg" 
        className="w-full h-full object-cover rounded-full" 
        
      />
    </div>
    
    <div className="flex-1">
      <h1 className="text-[10px] font-black uppercase tracking-[2px] text-[#1A1A1A]">
        Babygirl Dermacol
      </h1>
      <p className="text-[11px] text-gray-500 italic leading-tight mt-1">
        "9 years of promoting beauty with confidence and high quality products."
      </p>
    </div>
  </div>
</div>
           
          {/* HERO SECTION - FORCED SIDE-BY-SIDE ON MOBILE */}
<section className={`transition-all duration-1000 ease-out transform ${
  isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
}`}>
  {/* TOP HEADLINE */}
  <div className="text-center mb-6 px-2">
    <h1 className="text-2xl font-black italic tracking-tighter uppercase leading-none text-[#1A1A1A]">
      Define Your <span className="text-[#FF85A1]">Radiance</span>
    </h1>
    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[3px] mt-2">
      beauty • Homemade Delicacies • converting adverts
    </p>
  </div>

  {/* UNIFIED IMAGE GRID */}
  <div className="grid grid-cols-2 gap-3 mb-6">
    {[
      { img: "/hero-beauty.jpg", title: "Hair & Glam", link: "#beauty" },
      { img: "/hero-food.jpg", title: "Kitchen", link: "#food" }
    ].map((hero, i) => (
      <a 
        key={i} 
        href={hero.link} 
        className="relative h-[160px] rounded-2xl overflow-hidden shadow-md group active:scale-95 transition-transform"
      >
        <img src={hero.img} className="absolute inset-0 w-full h-full object-cover" alt={hero.title} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
          <h2 className="text-white text-[9px] font-black uppercase italic leading-none">{hero.title}</h2>
        </div>
      </a>
    ))}
  </div>

  {/* PRIMARY CTA */}
  <a 
    href="#beauty" 
    className="w-full py-4 bg-[#1A1A1A] rounded-2xl flex items-center justify-center gap-3 shadow-lg hover:bg-[#FF85A1] transition-colors"
  >
    <span className="text-[11px] font-black uppercase tracking-widest text-white">Explore All Services</span>
    <div className="w-6 h-6 bg-[#FF85A1] rounded-full flex items-center justify-center text-white">
      <ShoppingBag size={14} />
    </div>
  </a>
</section>


      
         {/* 3. AD PORTAL SECTION - ANIMATED WITH INSTRUCTIONS */}
<section className={`transition-all duration-1000 delay-[1200ms] transform ${
  isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
}`}>
  <div id="ads" className="bg-[#1A1A1A] p-8 rounded-[3rem] text-white shadow-2xl">
    <div className="flex items-center gap-3 mb-2">
      <Megaphone className="text-[#FF85A1]" size={20} />
      <h5 className="font-black italic text-[#FF85A1] uppercase">Ad Portal</h5>
    </div>
    <p className="text-[9px] text-gray-400 mb-6 leading-tight italic">
      "Babygirl Dermacol connects you with more WhatsApp audience giving more visibility to your brand."
    </p>

    <div className="space-y-4">
      {ads[0].items.map((ad, i) => {
        const [isOpen, setIsOpen] = useState(false);
        const [copied, setCopied] = useState(false);

        const handleCopy = () => {
          navigator.clipboard.writeText("0700090469");
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        };

        return (
          <div key={i} className="border-b border-white/10 pb-4">
            <div className="flex justify-between items-center mb-2">
              <div>
                <span className="text-[11px] text-gray-300 block">{ad.name}</span>
                <span className="text-sm font-bold italic text-[#FF85A1]">₦{ad.price}</span>
              </div>
              <button 
                onClick={() => setIsOpen(!isOpen)}
                className="px-4 py-2 bg-white/10 hover:bg-[#FF85A1] rounded-xl text-[10px] font-black uppercase transition-all flex items-center gap-2"
              >
                {isOpen ? 'Close' : 'Book Now'} <ChevronDown size={12} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* SURPRISE DROPDOWN */}
            {isOpen && (
              <div className="mt-4 p-5 bg-white/5 rounded-2xl border border-white/10 animate-in fade-in slide-in-from-top-4 duration-500">
                <p className="text-[10px] text-gray-400 uppercase font-black mb-1">Payment Details</p>
                
                {/* NEW INSTRUCTION TEXT */}
                <p className="text-[9px] text-[#FF85A1] italic mb-3 opacity-80">
                  Copy the account number, make payment, then send confirmation to WhatsApp.
                </p>

                <div className="flex justify-between items-center bg-black/40 p-3 rounded-xl mb-4">
                  <div className="text-[11px]">
                    <p className="text-[#FF85A1] font-bold">GTBANK</p>
                    <p className="font-mono">0700090469</p>
                    <p className="text-[9px] text-gray-500 uppercase">BABYGIRL DERMACOL</p>
                  </div>
                  <button onClick={handleCopy} className="p-2 hover:text-[#FF85A1]">
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
                
                <a 
                  href={`https://wa.me/2348158942290?text=Hi%20Dermacol,%20I%20just%20booked%20the%20${ad.name}%20ad%20space.%20Confirm%20my%20payment%20and%20here%20is%20my%20content.`}
                  className="w-full py-3 bg-[#FF85A1] rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-2 active:scale-95 transition-transform"
                >
                  Confirm Payment on WhatsApp <MessageCircle size={14}/>
                </a>
              </div>
            )}
          </div>
        );
      })}
    </div>
  </div>
</section> 
     </aside>
        

        {/* MAIN SHOP AREA: Order-2 on mobile */}
        <main className="flex-1 order-2 lg:order-1 space-y-16">
         
          {/* BEAUTY CONCEPTS SUPER-SHOP */}
          <section id="beauty">
            <div className="mb-8">
              <h2 className="text-4xl font-black italic uppercase tracking-tighter">Beauty Concepts</h2>
              <p className="text-[11px] text-gray-600 max-w-xl mt-3 leading-relaxed">
                "Promoting beauty with confidence and self-expression through innovative and high quality products."
                <span className="block font-bold text-[#FF85A1] mt-2 italic">
                  Opening Time: Mon-Sat (9am - 8pm), Sun (2pm - 8pm). Payment validates bookings.
                </span>
              </p>
            </div>

            

            {/* SERVICES (WHATSAPP) */}
            <h3 className="text-[10px] font-black uppercase tracking-[4px] text-gray-400 mb-6 mt-10">Professional Services</h3>
            <div className="grid grid-cols-2 gap-4">
  {beautyServices.map((service, i) => (
    <div key={i} className="bg-white/60 backdrop-blur-sm p-3 rounded-[2rem] border border-white flex flex-col">
    <div className={`aspect-[4/3] rounded-[1.5rem] overflow-hidden mb-3 bg-gray-100 ${i % 2 === 0 ? 'animate-float' : 'animate-float-delayed'}`}>
        {/* Assumes images named by service name: makeup.jpg, nails.jpg etc */}
        <img src={`/products/${service.img}`} className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" alt={service.name} />
      </div>
      <div className="px-1">
        <h4 className="font-bold text-[10px] uppercase text-gray-800">{service.name}</h4>
        <p className="text-[#FF85A1] font-black text-xs">₦{service.price}</p>
      </div>
      <a 
        href={`https://wa.me/2348158942290?text=Hello%20Dermacol,%20I%20want%20to%20book%20a%20session%20for%20${service.name}`}
        className="mt-3 w-full py-2 bg-white rounded-xl shadow-sm text-[10px] font-bold uppercase text-center flex justify-center items-center gap-2"
      >
        Book <Calendar size={12} />
      </a>
    </div>
  ))}
</div>
          </section>

          {/* WIGS (CART) */}
            <h3 className="text-[10px] font-black uppercase tracking-[4px] text-gray-400 mb-6">Luxury & Affordable Hairs</h3>
            <div className="flex overflow-x-auto gap-6 no-scrollbar pb-8 snap-x">
              {wigStore.map(wig => (
  <div key={wig.id} className="min-w-[280px] snap-center glass-card p-4 rounded-[2.5rem] bg-white shadow-lg hover:-translate-y-2 transition-transform duration-500">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] mb-4">
                    <img src={`/products/wig-${wig.id}.jpg`} className="w-full h-full object-cover" alt={wig.name} />
                    <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full text-[10px] font-black text-[#FF85A1]">₦{wig.price.toLocaleString()}</div>
                  </div>
                  <h4 className="font-bold text-sm uppercase px-2 mb-4">{wig.name}</h4>
                  <button onClick={() => addToCart(wig)} className="w-full py-4 bg-[#FF85A1] text-white rounded-2xl text-[10px] font-black uppercase">Add to Cart</button>
                </div>
              ))}
            </div>

       {/* KITCHEN SECTION */}
<section id="food" className="mt-12 px-2">
  <div className="flex flex-col mb-8">
    {/* Main Title Row */}
    <div className="flex items-center gap-3 mb-3">
      <Utensils className="text-orange-500" size={24} />
      <h2 className="text-3xl font-black italic uppercase tracking-tighter text-[#1A1A1A]">
        Dbolicious <span className="text-orange-500">Kitchen</span>
      </h2>
    </div>

    {/* Beautiful Description Row */}
    <div className="flex justify-between items-end gap-4 border-l-2 border-orange-500/20 pl-4">
      <p className="text-[11px] leading-tight text-gray-500 font-medium max-w-[200px] italic">
        "Dbolicious is a food brand that delivers basically home made delicacies in different varieties"
      </p>
      <div className="text-right flex flex-col items-end">
        <span className="text-[10px] font-black uppercase tracking-widest text-orange-500">Fast Delivery</span>
        <span className="text-xs font-bold text-[#1A1A1A]">30-45 mins</span>
      </div>
    </div>
  </div>

  <div className="grid grid-cols-2 gap-4">
    {foodMenu.map((food, index) => (
      <div key={food.id} className="bg-white p-3 rounded-[2.5rem] shadow-sm border border-gray-50 flex flex-col">
        <div className={`aspect-square rounded-[2rem] overflow-hidden mb-3 shadow-inner ${index % 2 === 0 ? 'animate-float' : 'animate-float-delayed'}`}>
      <img 
        src={`/products/food-${food.id}.jpg`} 
        className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" 
        alt={food.name}
          />
        </div>
        <div className="px-1 flex-1">
          <h4 className="font-bold text-[11px] leading-tight uppercase text-gray-800 mb-1">{food.name}</h4>
          <div className="flex justify-between items-center mt-auto">
            <p className="text-orange-500 font-black text-sm">₦{food.price.toLocaleString()}</p>
           <button 
  onClick={() => addToCart(food)} 
  className="p-3 bg-orange-50 text-orange-500 rounded-2xl active:scale-75 hover:bg-orange-500 hover:text-white transition-all duration-300"
>
              <ShoppingBag size={16}/>
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>
</section>

          {/* SLIM LUXURY FOOTER */}
<footer className="bg-[#1A1A1A] rounded-[2.5rem] p-8 mt-12 mb-6 text-white overflow-hidden relative mx-2">
  <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
    
    {/* Brand Section */}
    <div className="text-center md:text-left">
      <h5 className="text-[#FF85A1] font-black italic text-2xl uppercase tracking-tighter">Dermacol</h5>
     <p className={`text-[10px] font-black uppercase tracking-[5px] text-gray-400 transition-all duration-1000 delay-300 transform ${
  isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
}`}>
  Luxury Concept & Lifestyle
</p>
    </div>

    {/* Combined Links Row */}
    <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
      <div className="flex items-center gap-6">
        <a href="mailto:babygirldermacol@gmail.com" className="text-gray-400 hover:text-[#FF85A1] transition-all"><Mail size={18}/></a>
        <a href="https://wa.me/2348158942290" className="text-gray-400 hover:text-[#FF85A1] transition-all"><MessageCircle size={18}/></a>
        <a href="https://www.instagram.com/babygirl_dermacol?igsh=MWh2czhtcTZrZDJ4bg==" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#FF85A1] transition-all"><Instagram size={18}/></a>
        <a href="https://www.tiktok.com/@babygirldermacol?_r=1&_t=ZS-93RGfTj5Jtg" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#FF85A1] transition-all"><Video size={18}/></a>
      </div>
    </div>

    {/* Copyright Section */}
    <div className="text-center md:text-right border-t md:border-t-0 border-gray-800 pt-4 md:pt-0 w-full md:w-auto">
      <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">
        Copyright © 2026 Dermacol Concepts
      </p>
    </div>
  </div>
</footer>
        </main>
      </div>

{/* FULL SCREEN RECEIPT CHECKOUT */}
{isCartOpen && (
  <div className="fixed inset-0 z-[300] bg-[#E0F2FE] flex flex-col animate-in fade-in duration-300 overflow-y-auto">
    <div className="p-6 flex justify-between items-center">
      <button onClick={() => setIsCartOpen(false)} className="p-3 bg-white rounded-2xl shadow-sm">
        <X size={24} className="text-gray-400" />
      </button>
      <h2 className="text-xl font-black italic uppercase tracking-tighter">Your Receipt</h2>
      <div className="w-12"></div>
    </div>

    <div className="px-6 pb-12 max-w-lg mx-auto w-full">
      <div className="bg-white rounded-[3rem] shadow-2xl shadow-blue-200/50 overflow-hidden relative">
        <div className="h-2 bg-[#FF85A1] w-full mb-8"></div>
        <div className="px-8 pb-10">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-black italic text-[#FF85A1]">DERMACOL</h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order Summary</p>
          <p className="text-[11px] text-[#FF85A1] italic mt-2 leading-tight">
  "Copy account details, make payment, and send proof on WhatsApp"
</p>
          
          </div>

          <div className="space-y-6 mb-10 border-y border-dashed border-gray-200 py-8">
            {cart.length === 0 ? (
              <p className="text-center py-4 text-gray-400 italic">Your cart is empty</p>
            ) : (
              cart.map((item, idx) => (
                <div key={idx} className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-bold text-sm uppercase text-[#1A1A1A]">{item.name}</p>
                    <button onClick={() => removeFromCart(idx)} className="text-[9px] font-black text-red-400 uppercase mt-1 flex items-center gap-1">
                      <Trash2 size={10} /> Remove
                    </button>
                  </div>
                  <p className="font-black text-[#1A1A1A]">₦{item.price.toLocaleString()}</p>
                </div>
              ))
            )}
          </div>

          <div className="flex justify-between items-center mb-10 px-2">
            <span className="text-sm font-black text-gray-400 uppercase">Total Amount</span>
            <span className="text-3xl font-black italic text-[#1A1A1A]">₦{total.toLocaleString()}</span>
          </div>

          <div className="bg-gray-50 rounded-[2rem] p-6 border border-gray-100 mb-8">
            <h4 className="text-[11px] font-black uppercase text-gray-400 mb-2 tracking-widest text-center">Payment Details</h4>
            <div className="bg-white p-5 rounded-2xl border border-dashed border-gray-300 flex justify-between items-center">
              <div>
                <p className="text-[9px] font-black text-[#FF85A1] uppercase mb-1">GTBANK</p>
                <p className="text-xl font-mono font-bold text-[#1A1A1A]">0700090469</p>
                <p className="text-[9px] text-gray-400 font-bold uppercase">Babygirl Dermacol</p>
              </div>
              <button onClick={handleCopy} className="p-4 bg-gray-50 rounded-xl hover:bg-[#FF85A1] hover:text-white transition-all active:scale-90">
                {copied ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
              </button>
            </div>
          </div>

          <a href={`https://wa.me/2348158942290?text=Hello%20Dermacol,%20I%20just%20placed%20an%20order%20for:%20${cart.map(i => i.name).join(", ")}.%20Total:%20₦${total.toLocaleString()}.`} className="w-full py-5 bg-[#1A1A1A] text-white rounded-[1.5rem] font-black uppercase text-xs flex items-center justify-center gap-3">
            Confirm Order on WhatsApp <MessageCircle size={18} className="text-[#FF85A1]" />
          </a>
          <div className="mt-8 text-center border-t border-dashed border-gray-100 pt-6">
  <p className="text-xs font-black uppercase tracking-[3px] text-gray-300">Thank You</p>
  <p className="text-[10px] text-gray-400 italic mt-1">
    "Your support means the world to Babygirl Dermacol"
  </p>
</div>
        </div>
        <div className="flex justify-center gap-2 mb-4">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="w-4 h-4 rounded-full bg-[#E0F2FE] -mb-6"></div>
          ))}
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
}