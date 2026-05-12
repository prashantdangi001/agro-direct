'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function AddListingForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Vegetables');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [unit, setUnit] = useState('kg');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert("Please login first");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from('products').insert({
      name,
      category,
      price: parseFloat(price),
      stock: parseInt(stock),
      unit,
      description,
      farmer_id: user.id // Isolation Key
    });

    if (!error) {
      router.push('/farmer/inventory');
    } else {
      alert(error.message);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl border border-outline-variant shadow-sm space-y-6 max-w-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-on-surface">Product Name</label>
          <input required value={name} onChange={e => setName(e.target.value)} className="p-3 bg-surface rounded-lg border border-outline-variant outline-none focus:border-primary" />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-on-surface">Category</label>
          <select value={category} onChange={e => setCategory(e.target.value)} className="p-3 bg-surface rounded-lg border border-outline-variant outline-none focus:border-primary">
            <option>Vegetables</option>
            <option>Fruits</option>
            <option>Grains</option>
            <option>Cereals</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-on-surface">Price (KES)</label>
          <input required type="number" value={price} onChange={e => setPrice(e.target.value)} className="p-3 bg-surface rounded-lg border border-outline-variant outline-none focus:border-primary" />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-on-surface">Initial Stock</label>
          <input required type="number" value={stock} onChange={e => setStock(e.target.value)} className="p-3 bg-surface rounded-lg border border-outline-variant outline-none focus:border-primary" />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-on-surface">Unit</label>
          <input required value={unit} onChange={e => setUnit(e.target.value)} className="p-3 bg-surface rounded-lg border border-outline-variant outline-none focus:border-primary" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-on-surface">Description</label>
        <textarea rows={4} value={description} onChange={e => setDescription(e.target.value)} className="p-3 bg-surface rounded-lg border border-outline-variant outline-none focus:border-primary resize-none" />
      </div>

      <button disabled={loading} type="submit" className="w-full py-4 bg-primary text-white font-bold rounded-lg shadow-sm hover:brightness-110 transition-all">
        {loading ? 'Processing...' : 'List Produce Now'}
      </button>
    </form>
  );
}