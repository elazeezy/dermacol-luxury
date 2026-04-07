"use client";
import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Trash2, Loader2, Upload, X, ImageIcon } from 'lucide-react';
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchProducts = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('products')
      .select('*')
      .order('new_price', { ascending: true });
    setProducts((data as Product[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) { setError('Please select an image.'); return; }
    if (!form.name || !form.new_price) { setError('Name and new price are required.'); return; }

    setSaving(true);
    setError('');

    // 1. Upload image to Supabase Storage
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

    // 2. Get the public URL
    const { data: urlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName);

    const mediaUrl = urlData.publicUrl;
    const isVideo = ['mp4', 'mov', 'webm'].includes(ext?.toLowerCase() || '');

    // 3. Save product to database
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

    setProducts(prev => [inserted as Product, ...prev].sort((a, b) => a.new_price - b.new_price));
    setForm(emptyForm);
    setImageFile(null);
    setImagePreview('');
    setShowForm(false);
    setSaving(false);
  };

  const handleDelete = async (product: Product) => {
    if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    setDeleting(product.id);

    // Extract filename from URL and delete from storage
    const fileName = product.media_url.split('/').pop();
    if (fileName) {
      await supabase.storage.from('product-images').remove([fileName]);
    }

    await supabase.from('products').delete().eq('id', product.id);
    setProducts(prev => prev.filter(p => p.id !== product.id));
    setDeleting(null);
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto pb-24 md:pb-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-white">Products</h1>
          <p className="text-gray-500 text-sm mt-1">{products.length} products in store</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setError(''); }}
          className="flex items-center gap-2 px-5 py-3 bg-dermacol-pink hover:bg-[#ff6e8e] text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all"
        >
          {showForm ? <X size={14} /> : <Plus size={14} />}
          {showForm ? 'Cancel' : 'Add Product'}
        </button>
      </div>

      {/* Add Product Form */}
      {showForm && (
        <div className="bg-[#1a1a1a] rounded-2xl p-7 border border-white/5 mb-8">
          <h2 className="text-white font-black text-base mb-6">New Product</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              {/* Name */}
              <div className="col-span-2">
                <label className="text-gray-500 text-[10px] font-black uppercase tracking-wider mb-2 block">Product Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Full Frontal Bounce"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-[#252525] text-white text-sm px-4 py-3 rounded-xl border border-white/5 focus:outline-none focus:border-dermacol-pink placeholder:text-gray-700 transition-colors"
                />
              </div>

              {/* Type */}
              <div>
                <label className="text-gray-500 text-[10px] font-black uppercase tracking-wider mb-2 block">Type / Style</label>
                <input
                  type="text"
                  placeholder="e.g. Human hair blend"
                  value={form.type}
                  onChange={e => setForm({ ...form, type: e.target.value })}
                  className="w-full bg-[#252525] text-white text-sm px-4 py-3 rounded-xl border border-white/5 focus:outline-none focus:border-dermacol-pink placeholder:text-gray-700 transition-colors"
                />
              </div>

              {/* Inches */}
              <div>
                <label className="text-gray-500 text-[10px] font-black uppercase tracking-wider mb-2 block">Inches / Size</label>
                <input
                  type="text"
                  placeholder="e.g. 18 inches"
                  value={form.inches}
                  onChange={e => setForm({ ...form, inches: e.target.value })}
                  className="w-full bg-[#252525] text-white text-sm px-4 py-3 rounded-xl border border-white/5 focus:outline-none focus:border-dermacol-pink placeholder:text-gray-700 transition-colors"
                />
              </div>

              {/* Old Price */}
              <div>
                <label className="text-gray-500 text-[10px] font-black uppercase tracking-wider mb-2 block">Old Price (crossed out)</label>
                <input
                  type="text"
                  placeholder="e.g. 60k"
                  value={form.old_price}
                  onChange={e => setForm({ ...form, old_price: e.target.value })}
                  className="w-full bg-[#252525] text-white text-sm px-4 py-3 rounded-xl border border-white/5 focus:outline-none focus:border-dermacol-pink placeholder:text-gray-700 transition-colors"
                />
              </div>

              {/* New Price */}
              <div>
                <label className="text-gray-500 text-[10px] font-black uppercase tracking-wider mb-2 block">New Price (₦) *</label>
                <input
                  type="number"
                  placeholder="e.g. 45000"
                  value={form.new_price}
                  onChange={e => setForm({ ...form, new_price: e.target.value })}
                  className="w-full bg-[#252525] text-white text-sm px-4 py-3 rounded-xl border border-white/5 focus:outline-none focus:border-dermacol-pink placeholder:text-gray-700 transition-colors"
                />
              </div>

              {/* Category */}
              <div className="col-span-2">
                <label className="text-gray-500 text-[10px] font-black uppercase tracking-wider mb-2 block">Category</label>
                <div className="flex gap-3">
                  {['beauty', 'kitchen'].map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setForm({ ...form, category: cat })}
                      className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                        form.category === cat
                          ? 'bg-dermacol-pink text-white'
                          : 'bg-white/5 text-gray-500 hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Image Upload */}
              <div className="col-span-2">
                <label className="text-gray-500 text-[10px] font-black uppercase tracking-wider mb-2 block">Product Image / Video *</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-white/10 hover:border-dermacol-pink rounded-2xl p-8 cursor-pointer transition-colors flex flex-col items-center justify-center gap-3 group"
                >
                  {imagePreview ? (
                    <div className="relative w-32 h-32 rounded-xl overflow-hidden">
                      <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                    </div>
                  ) : (
                    <>
                      <div className="p-4 bg-white/5 rounded-xl group-hover:bg-dermacol-pink/10 transition-colors">
                        <Upload size={24} className="text-gray-600 group-hover:text-dermacol-pink transition-colors" />
                      </div>
                      <p className="text-gray-600 text-xs font-bold">Click to upload image or video</p>
                    </>
                  )}
                </div>
                {imageFile && (
                  <p className="text-gray-500 text-xs mt-2 font-medium">{imageFile.name}</p>
                )}
              </div>
            </div>

            {error && <p className="text-red-400 text-xs font-bold mb-4">{error}</p>}

            <button
              type="submit"
              disabled={saving}
              className="w-full py-4 bg-dermacol-pink hover:bg-[#ff6e8e] text-white font-black uppercase text-xs rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {saving ? (
                <><Loader2 size={16} className="animate-spin" /> Uploading & Saving...</>
              ) : (
                'Save Product'
              )}
            </button>
          </form>
        </div>
      )}

      {/* Products Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-dermacol-pink" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <ImageIcon size={40} className="mx-auto text-gray-700 mb-3" />
          <p className="text-gray-600 font-bold">No products yet</p>
          <p className="text-gray-700 text-xs mt-1">Click "Add Product" to get started</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {products.map(product => (
            <div key={product.id} className="bg-[#1a1a1a] rounded-2xl p-5 border border-white/5 flex items-center gap-5">

              {/* Thumbnail */}
              <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-white/5">
                {product.is_video ? (
                  <video src={product.media_url} className="w-full h-full object-cover" muted />
                ) : (
                  <Image src={product.media_url} alt={product.name} fill className="object-cover" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-white font-black text-sm truncate">{product.name}</p>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  {product.type && (
                    <span className="text-gray-600 text-[11px] font-medium">{product.type}</span>
                  )}
                  {product.inches && (
                    <span className="text-gray-700 text-[11px]">· {product.inches}</span>
                  )}
                  <span className="text-[10px] font-bold text-gray-600 uppercase bg-white/5 px-2 py-0.5 rounded-lg">
                    {product.category}
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="text-right shrink-0">
                {product.old_price && (
                  <p className="text-gray-600 text-xs line-through">₦{product.old_price}</p>
                )}
                <p className="text-white font-black text-base">₦{product.new_price.toLocaleString()}</p>
              </div>

              {/* Delete */}
              <button
                onClick={() => handleDelete(product)}
                disabled={deleting === product.id}
                className="shrink-0 p-3 bg-red-400/10 hover:bg-red-400/20 text-red-400 rounded-xl transition-all disabled:opacity-40"
              >
                {deleting === product.id
                  ? <Loader2 size={16} className="animate-spin" />
                  : <Trash2 size={16} />
                }
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
