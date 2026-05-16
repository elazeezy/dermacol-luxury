"use client";
import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Trash2, Loader2, Upload, X, ImageIcon, Pencil, Check, ChevronDown } from 'lucide-react';
import Image from 'next/image';

type Product = {
  id: number;
  name: string;
  type: string;
  inches: string;
  old_price: string;
  new_price: number;
  media_url: string;
  is_video: boolean;
  category: string;
  created_at: string;
};

const emptyForm = {
  name: '',
  type: '',
  inches: '',
  old_price: '',
  new_price: '',
  category: 'beauty',
};

type CategoryFilter = 'all' | 'beauty' | 'kitchen';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [editingPrice, setEditingPrice] = useState<number | null>(null);
  const [editPriceValue, setEditPriceValue] = useState('');
  const [editingOldPrice, setEditingOldPrice] = useState<number | null>(null);
  const [editOldPriceValue, setEditOldPriceValue] = useState('');
  const [savingPrice, setSavingPrice] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const priceInputRef = useRef<HTMLInputElement>(null);

  const fetchProducts = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    setProducts((data as Product[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  // Focus price input when edit starts
  useEffect(() => {
    if (editingPrice !== null) {
      setTimeout(() => priceInputRef.current?.focus(), 50);
    }
  }, [editingPrice]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) { setError('Please select an image or video.'); return; }
    if (!form.name || !form.new_price) { setError('Name and price are required.'); return; }

    setSaving(true);
    setError('');

    const ext = imageFile.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(fileName, imageFile, { upsert: false });

    if (uploadError) {
      setError('Image upload failed. Try again.');
      setSaving(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName);

    const mediaUrl = urlData.publicUrl;
    const isVideo = ['mp4', 'mov', 'webm'].includes(ext?.toLowerCase() || '');

    const { data: inserted, error: insertError } = await supabase
      .from('products')
      .insert({
        name: form.name.trim(),
        type: form.type.trim(),
        inches: form.inches.trim(),
        old_price: form.old_price.trim(),
        new_price: parseInt(form.new_price),
        media_url: mediaUrl,
        is_video: isVideo,
        category: form.category,
      })
      .select()
      .single();

    if (insertError) {
      setError('Failed to save product. Try again.');
      setSaving(false);
      return;
    }

    setProducts(prev => [inserted as Product, ...prev]);
    setForm(emptyForm);
    setImageFile(null);
    setImagePreview('');
    setShowForm(false);
    setSaving(false);
  };

  const handleDelete = async (product: Product) => {
    if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    setDeleting(product.id);
    const fileName = product.media_url.split('/').pop();
    if (fileName) await supabase.storage.from('product-images').remove([fileName]);
    await supabase.from('products').delete().eq('id', product.id);
    setProducts(prev => prev.filter(p => p.id !== product.id));
    setDeleting(null);
  };

  const startEditPrice = (product: Product) => {
    setEditingPrice(product.id);
    setEditPriceValue(String(product.new_price));
    setEditingOldPrice(null);
  };

  const startEditOldPrice = (product: Product) => {
    setEditingOldPrice(product.id);
    setEditOldPriceValue(product.old_price || '');
    setEditingPrice(null);
  };

  const savePrice = async (productId: number) => {
    const val = parseInt(editPriceValue);
    if (!editPriceValue || isNaN(val) || val <= 0) {
      setEditingPrice(null);
      return;
    }
    setSavingPrice(productId);
    await supabase.from('products').update({ new_price: val }).eq('id', productId);
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, new_price: val } : p));
    setEditingPrice(null);
    setSavingPrice(null);
  };

  const saveOldPrice = async (productId: number) => {
    setSavingPrice(productId);
    await supabase.from('products').update({ old_price: editOldPriceValue.trim() }).eq('id', productId);
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, old_price: editOldPriceValue.trim() } : p));
    setEditingOldPrice(null);
    setSavingPrice(null);
  };

  const filtered = categoryFilter === 'all'
    ? products
    : products.filter(p => p.category === categoryFilter);

  const beautyCount = products.filter(p => p.category === 'beauty').length;
  const kitchenCount = products.filter(p => p.category === 'kitchen').length;

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto pb-28 md:pb-10">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-white">Products</h1>
          <p className="text-gray-600 text-xs mt-0.5">{products.length} total · {beautyCount} beauty · {kitchenCount} kitchen</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setError(''); setImagePreview(''); setImageFile(null); setForm(emptyForm); }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
            showForm
              ? 'bg-white/10 text-gray-400 hover:bg-white/15'
              : 'bg-dermacol-pink text-white hover:bg-[#ff6e8e]'
          }`}
        >
          {showForm ? <X size={13} /> : <Plus size={13} />}
          {showForm ? 'Cancel' : 'Add Product'}
        </button>
      </div>

      {/* Add Product Form */}
      {showForm && (
        <div className="bg-[#1a1a1a] rounded-2xl p-5 md:p-7 border border-white/5 mb-6">
          <h2 className="text-white font-black text-sm mb-5 flex items-center gap-2">
            <Plus size={14} className="text-dermacol-pink" /> New Product
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1.5 block">Product Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Full Frontal Bounce Wig"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-[#252525] text-white text-sm px-4 py-3 rounded-xl border border-white/5 focus:outline-none focus:border-dermacol-pink placeholder:text-gray-700 transition-colors"
                />
              </div>

              <div>
                <label className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1.5 block">Type / Style</label>
                <input
                  type="text"
                  placeholder="e.g. Human hair blend"
                  value={form.type}
                  onChange={e => setForm({ ...form, type: e.target.value })}
                  className="w-full bg-[#252525] text-white text-sm px-4 py-3 rounded-xl border border-white/5 focus:outline-none focus:border-dermacol-pink placeholder:text-gray-700 transition-colors"
                />
              </div>

              <div>
                <label className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1.5 block">Inches / Size</label>
                <input
                  type="text"
                  placeholder="e.g. 18 inches"
                  value={form.inches}
                  onChange={e => setForm({ ...form, inches: e.target.value })}
                  className="w-full bg-[#252525] text-white text-sm px-4 py-3 rounded-xl border border-white/5 focus:outline-none focus:border-dermacol-pink placeholder:text-gray-700 transition-colors"
                />
              </div>

              <div>
                <label className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1.5 block">Old Price — crossed out (optional)</label>
                <input
                  type="text"
                  placeholder="e.g. 60k"
                  value={form.old_price}
                  onChange={e => setForm({ ...form, old_price: e.target.value })}
                  className="w-full bg-[#252525] text-white text-sm px-4 py-3 rounded-xl border border-white/5 focus:outline-none focus:border-dermacol-pink placeholder:text-gray-700 transition-colors"
                />
              </div>

              <div>
                <label className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1.5 block">Selling Price (₦) *</label>
                <input
                  type="number"
                  placeholder="e.g. 45000"
                  value={form.new_price}
                  onChange={e => setForm({ ...form, new_price: e.target.value })}
                  className="w-full bg-[#252525] text-white text-sm px-4 py-3 rounded-xl border border-white/5 focus:outline-none focus:border-dermacol-pink placeholder:text-gray-700 transition-colors"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1.5 block">Category</label>
              <div className="flex gap-2">
                {(['beauty', 'kitchen'] as const).map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setForm({ ...form, category: cat })}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                      form.category === cat
                        ? 'bg-dermacol-pink text-white'
                        : 'bg-white/5 text-gray-500 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {cat === 'beauty' ? '💄 Beauty / Wigs' : '🍳 Kitchen'}
                  </button>
                ))}
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1.5 block">Product Image / Video *</label>
              <input ref={fileInputRef} type="file" accept="image/*,video/*" onChange={handleImageChange} className="hidden" />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-white/10 hover:border-dermacol-pink/50 rounded-2xl p-6 cursor-pointer transition-all flex flex-col items-center justify-center gap-3 group active:scale-[0.99]"
              >
                {imagePreview ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="relative w-28 h-28 rounded-xl overflow-hidden ring-2 ring-dermacol-pink/30">
                      <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                    </div>
                    <p className="text-dermacol-pink text-[11px] font-bold">Tap to change</p>
                  </div>
                ) : (
                  <>
                    <div className="p-4 bg-white/5 rounded-xl group-hover:bg-dermacol-pink/10 transition-colors">
                      <Upload size={22} className="text-gray-600 group-hover:text-dermacol-pink transition-colors" />
                    </div>
                    <div className="text-center">
                      <p className="text-gray-500 text-xs font-bold">Tap to upload</p>
                      <p className="text-gray-700 text-[10px] mt-0.5">Image or video</p>
                    </div>
                  </>
                )}
              </div>
              {imageFile && <p className="text-gray-600 text-[11px] mt-1.5 truncate">{imageFile.name}</p>}
            </div>

            {error && (
              <div className="bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">
                <p className="text-red-400 text-xs font-bold">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-full py-4 bg-dermacol-pink hover:bg-[#ff6e8e] active:scale-[0.98] text-white font-black uppercase text-xs rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {saving ? <><Loader2 size={15} className="animate-spin" /> Saving...</> : 'Save Product'}
            </button>
          </form>
        </div>
      )}

      {/* Category Filter */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1 scrollbar-hide">
        {([
          { key: 'all', label: 'All', count: products.length },
          { key: 'beauty', label: 'Beauty / Wigs', count: beautyCount },
          { key: 'kitchen', label: 'Kitchen', count: kitchenCount },
        ] as { key: CategoryFilter; label: string; count: number }[]).map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => setCategoryFilter(key)}
            className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
              categoryFilter === key
                ? 'bg-dermacol-pink text-white'
                : 'bg-white/5 text-gray-500 hover:text-white hover:bg-white/10'
            }`}
          >
            {label}
            <span className={`text-[10px] px-1.5 py-0.5 rounded-lg font-black ${
              categoryFilter === key ? 'bg-white/20' : 'bg-white/5'
            }`}>{count}</span>
          </button>
        ))}
      </div>

      {/* Products List */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 size={28} className="animate-spin text-dermacol-pink" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24">
          <div className="p-5 bg-white/5 rounded-2xl inline-block mb-4">
            <ImageIcon size={32} className="text-gray-700" />
          </div>
          <p className="text-gray-500 font-black text-sm">No products yet</p>
          <p className="text-gray-700 text-xs mt-1">Tap "Add Product" to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(product => (
            <div
              key={product.id}
              className="bg-[#1a1a1a] rounded-2xl border border-white/5 overflow-hidden"
            >
              <div className="flex items-center gap-4 p-4">

                {/* Thumbnail */}
                <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden shrink-0 bg-[#252525]">
                  {product.is_video ? (
                    <video src={product.media_url} className="w-full h-full object-cover" muted playsInline />
                  ) : (
                    <Image src={product.media_url} alt={product.name} fill className="object-cover" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-white font-black text-sm leading-tight truncate">{product.name}</p>
                  <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-lg ${
                      product.category === 'beauty'
                        ? 'bg-dermacol-pink/15 text-dermacol-pink'
                        : 'bg-orange-400/15 text-orange-400'
                    }`}>
                      {product.category}
                    </span>
                    {product.type && (
                      <span className="text-gray-600 text-[10px]">{product.type}</span>
                    )}
                    {product.inches && (
                      <span className="text-gray-700 text-[10px]">· {product.inches}</span>
                    )}
                  </div>

                  {/* Price row — editable */}
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    {/* Old price */}
                    {editingOldPrice === product.id ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={editOldPriceValue}
                          onChange={e => setEditOldPriceValue(e.target.value)}
                          onKeyDown={e => { if (e.key === 'Enter') saveOldPrice(product.id); if (e.key === 'Escape') setEditingOldPrice(null); }}
                          placeholder="e.g. 60k"
                          className="w-20 bg-[#252525] text-gray-400 text-xs px-2 py-1 rounded-lg border border-white/10 focus:outline-none focus:border-dermacol-pink line-through"
                          autoFocus
                        />
                        <button onClick={() => saveOldPrice(product.id)} disabled={savingPrice === product.id} className="p-1 text-green-400 hover:text-green-300">
                          {savingPrice === product.id ? <Loader2 size={11} className="animate-spin" /> : <Check size={11} />}
                        </button>
                        <button onClick={() => setEditingOldPrice(null)} className="p-1 text-gray-600 hover:text-gray-400">
                          <X size={11} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => startEditOldPrice(product)}
                        className="flex items-center gap-1 group"
                        title="Edit old price"
                      >
                        {product.old_price ? (
                          <span className="text-gray-600 text-xs line-through group-hover:text-gray-400 transition-colors">₦{product.old_price}</span>
                        ) : (
                          <span className="text-gray-700 text-[10px] group-hover:text-gray-500 transition-colors italic">+ old price</span>
                        )}
                        <Pencil size={9} className="text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    )}

                    {/* New price */}
                    {editingPrice === product.id ? (
                      <div className="flex items-center gap-1">
                        <span className="text-white text-xs font-black">₦</span>
                        <input
                          ref={priceInputRef}
                          type="number"
                          value={editPriceValue}
                          onChange={e => setEditPriceValue(e.target.value)}
                          onKeyDown={e => { if (e.key === 'Enter') savePrice(product.id); if (e.key === 'Escape') setEditingPrice(null); }}
                          className="w-24 bg-[#252525] text-white font-black text-sm px-2 py-1 rounded-lg border border-dermacol-pink focus:outline-none"
                        />
                        <button onClick={() => savePrice(product.id)} disabled={savingPrice === product.id} className="p-1 text-green-400 hover:text-green-300">
                          {savingPrice === product.id ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                        </button>
                        <button onClick={() => setEditingPrice(null)} className="p-1 text-gray-600 hover:text-gray-400">
                          <X size={12} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => startEditPrice(product)}
                        className="flex items-center gap-1.5 group"
                        title="Edit price"
                      >
                        <span className="text-white font-black text-sm group-hover:text-dermacol-pink transition-colors">
                          ₦{product.new_price.toLocaleString()}
                        </span>
                        <Pencil size={10} className="text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Delete */}
                <button
                  onClick={() => handleDelete(product)}
                  disabled={deleting === product.id}
                  className="shrink-0 p-2.5 bg-red-400/10 hover:bg-red-400/20 active:scale-95 text-red-400 rounded-xl transition-all disabled:opacity-40"
                >
                  {deleting === product.id
                    ? <Loader2 size={15} className="animate-spin" />
                    : <Trash2 size={15} />
                  }
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
