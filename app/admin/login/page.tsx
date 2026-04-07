"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Loader2, Lock, Mail } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError('Invalid email or password.');
      setLoading(false);
    } else {
      router.push('/admin');
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black italic text-[#FF85A1] tracking-tighter">DERMACOL</h1>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[4px] mt-2">Admin Portal</p>
        </div>

        {/* Card */}
        <div className="bg-[#1a1a1a] rounded-[2rem] p-8 shadow-2xl border border-white/5">
          <h2 className="text-white font-black text-lg mb-1">Welcome back</h2>
          <p className="text-gray-500 text-xs mb-8">Sign in to manage your store</p>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div className="relative">
              <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#252525] text-white text-sm pl-11 pr-4 py-4 rounded-xl border border-white/5 focus:outline-none focus:border-[#FF85A1] placeholder:text-gray-600 transition-colors"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#252525] text-white text-sm pl-11 pr-4 py-4 rounded-xl border border-white/5 focus:outline-none focus:border-[#FF85A1] placeholder:text-gray-600 transition-colors"
              />
            </div>

            {/* Error */}
            {error && (
              <p className="text-red-400 text-xs font-bold text-center">{error}</p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#FF85A1] text-white font-black uppercase text-xs rounded-xl flex items-center justify-center gap-2 hover:bg-[#ff6e8e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <><Loader2 size={16} className="animate-spin" /> Signing in...</>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-700 text-[10px] mt-8 uppercase tracking-widest">
          Dermacol Luxury · Private Access
        </p>
      </div>
    </div>
  );
}
