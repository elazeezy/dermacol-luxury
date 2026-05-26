"use client";
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { LayoutDashboard, ShoppingBag, Package, LogOut, Menu, X, Megaphone } from 'lucide-react';
import Link from 'next/link';

const navItems = [
  { href: '/admin', label: 'Orders', icon: ShoppingBag },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/ads', label: 'Ads', icon: Megaphone },
  { href: '/admin/revenue', label: 'Revenue', icon: LayoutDashboard },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  if (pathname === '/admin/login') return <>{children}</>;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] md:flex">

      {/* ── DESKTOP SIDEBAR ───────────────────────────── */}
      <aside className="hidden md:flex w-56 bg-[#1a1a1a] border-r border-white/5 flex-col sticky top-0 h-screen shrink-0">
        <div className="px-6 py-7 border-b border-white/5">
          <h1 className="text-xl font-black italic text-dermacol-pink tracking-tighter">DERMACOL</h1>
          <p className="text-[9px] font-bold text-gray-600 uppercase tracking-[3px] mt-1">Admin</p>
        </div>

        <nav className="flex-1 p-3 space-y-0.5">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  active
                    ? 'bg-dermacol-pink text-white'
                    : 'text-gray-500 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={15} />{label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold text-gray-600 hover:text-red-400 hover:bg-white/5 transition-all"
          >
            <LogOut size={15} />Sign Out
          </button>
        </div>
      </aside>

      {/* ── MOBILE HEADER ─────────────────────────────── */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-[#1a1a1a]/95 backdrop-blur border-b border-white/5 flex items-center justify-between px-5 h-14">
        <h1 className="text-lg font-black italic text-dermacol-pink tracking-tighter">DERMACOL</h1>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 text-gray-400 hover:text-white transition-colors rounded-xl"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* ── MOBILE SLIDE-DOWN MENU ────────────────────── */}
      {menuOpen && (
        <div className="md:hidden fixed top-14 left-0 right-0 z-40 bg-[#1a1a1a]/98 backdrop-blur border-b border-white/5 px-3 py-3 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  active ? 'bg-dermacol-pink text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={15} />{label}
              </Link>
            );
          })}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold text-gray-600 hover:text-red-400 hover:bg-white/5 transition-all"
          >
            <LogOut size={15} />Sign Out
          </button>
        </div>
      )}

      {/* ── MAIN CONTENT ──────────────────────────────── */}
      <main className="flex-1 overflow-y-auto pt-14 md:pt-0 pb-20 md:pb-0">
        {children}
      </main>

      {/* ── MOBILE BOTTOM NAV ─────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#1a1a1a]/95 backdrop-blur border-t border-white/5 flex items-center px-2 py-2 safe-area-pb">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 flex-1 py-2 rounded-xl transition-all ${
                active ? 'text-dermacol-pink' : 'text-gray-600 hover:text-gray-300'
              }`}
            >
              <Icon size={19} strokeWidth={active ? 2.5 : 2} />
              <span className={`text-[9px] font-black uppercase tracking-wider ${active ? 'text-dermacol-pink' : ''}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
