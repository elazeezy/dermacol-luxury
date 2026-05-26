"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2, Pencil, Check, X } from 'lucide-react';

type AdPrice = {
  id: number;
  category: string;
  name: string;
  price: string;
  note: string | null;
  sort_order: number;
};

type AdCategory = {
  category: string;
  items: AdPrice[];
};

export default function AdminAdsPage() {
  const [adCategories, setAdCategories] = useState<AdCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const [saving, setSaving] = useState<number | null>(null);

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('ad_prices')
      .select('*')
      .order('sort_order', { ascending: true });
    const rows = (data as AdPrice[]) || [];
    const grouped: Record<string, AdPrice[]> = {};
    rows.forEach(row => {
      if (!grouped[row.category]) grouped[row.category] = [];
      grouped[row.category].push(row);
    });
    setAdCategories(Object.entries(grouped).map(([category, items]) => ({ category, items })));
    setLoading(false);
  };

  const startEdit = (ad: AdPrice) => {
    setEditingId(ad.id);
    setEditValue(ad.price);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue('');
  };

  const savePrice = async (id: number) => {
    const trimmed = editValue.trim();
    if (!trimmed) { cancelEdit(); return; }
    setSaving(id);
    await supabase.from('ad_prices').update({ price: trimmed }).eq('id', id);
    setAdCategories(prev =>
      prev.map(cat => ({
        ...cat,
        items: cat.items.map(item => item.id === id ? { ...item, price: trimmed } : item),
      }))
    );
    setEditingId(null);
    setSaving(null);
  };

  const formatPrice = (price: string) => {
    const num = parseInt(price.replace(/,/g, ''));
    if (!isNaN(num)) return `₦${num.toLocaleString()}`;
    return price;
  };

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto pb-28 md:pb-10">
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-black text-white">Ads Pricing</h1>
        <p className="text-gray-600 text-xs mt-0.5">Click any price to edit it live</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <Loader2 size={28} className="animate-spin text-dermacol-pink" />
        </div>
      ) : (
        <div className="space-y-8">
          {adCategories.map((cat, i) => (
            <div key={i}>
              <h2 className="text-xs font-black uppercase text-gray-500 tracking-widest mb-3">{cat.category}</h2>
              <div className="space-y-2">
                {cat.items.map(ad => (
                  <div key={ad.id} className="bg-[#1a1a1a] rounded-2xl border border-white/5 p-4 flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-black text-sm truncate">{ad.name}</p>
                      {ad.note && <p className="text-dermacol-pink text-[10px] italic mt-0.5">{ad.note}</p>}
                    </div>

                    {editingId === ad.id ? (
                      <div className="flex items-center gap-1 shrink-0">
                        <input
                          type="text"
                          value={editValue}
                          onChange={e => setEditValue(e.target.value)}
                          onKeyDown={e => { if (e.key === 'Enter') savePrice(ad.id); if (e.key === 'Escape') cancelEdit(); }}
                          placeholder="e.g. 50000 or Contact Us"
                          className="w-32 bg-[#252525] text-white text-sm px-3 py-1.5 rounded-xl border border-dermacol-pink focus:outline-none"
                          autoFocus
                        />
                        <button onClick={() => savePrice(ad.id)} disabled={saving === ad.id} className="p-1.5 text-green-400 hover:text-green-300">
                          {saving === ad.id ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
                        </button>
                        <button onClick={cancelEdit} className="p-1.5 text-gray-600 hover:text-gray-400">
                          <X size={13} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => startEdit(ad)}
                        className="flex items-center gap-1.5 group shrink-0"
                        title="Edit price"
                      >
                        <span className="text-white font-black text-sm group-hover:text-dermacol-pink transition-colors">
                          {formatPrice(ad.price)}
                        </span>
                        <Pencil size={10} className="text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
