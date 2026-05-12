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
  
  // NEW: Image Upload State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert("Please login first");
      setLoading(false);
      return;
    }

    let finalImageUrl = "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?q=80&w=600&auto=format&fit=crop"; // Fallback image

    // NEW: Upload Image to Supabase Storage if one is selected
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `product-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('product-images').upload(fileName, imageFile);
      
      if (!uploadError) {
        const { data } = supabase.storage.from('product-images').getPublicUrl(fileName);
        finalImageUrl = data.publicUrl;
      } else {
        console.error("Image upload failed:", uploadError);
      }
    }

    const { error } = await supabase.from('products').insert({
      name,
      category,
      price: parseFloat(price),
      stock: parseInt(stock),
      unit,
      description,
      farmer_id: user.id, // Isolation Key
      image_url: finalImageUrl // NEW: Save the real image URL!
    });

    if (!error) {
      router.push('/farmer/inventory');
    } else {
      alert(error.message);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl border border-outline-variant shadow-sm space-y-8 max-w-3xl">
      
      {/* NEW: Product Image Upload Section */}
      <div>
        <label className="text-sm font-bold text-on-surface mb-3 block">Product Photo</label>
        <div className="relative h-48 w-full md:w-64 rounded-xl border-2 border-dashed border-outline-variant bg-surface-container-lowest hover:bg-surface-container transition-colors flex items-center justify-center overflow-hidden group cursor-pointer">
          {imagePreview ? (
            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <div className="text-center p-4">
              <span className="material-symbols-outlined text-4xl text-primary/60 mb-2">add_a_photo</span>
              <p className="text-sm font-bold text-on-surface-variant">Click to upload photo</p>
              <p className="text-xs text-on-surface-variant/70 mt-1">PNG, JPG up to 5MB</p>
            </div>
          )}
          {/* Invisible File Input */}
          <input type="file" onChange={handleImageChange} accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-on-surface">Product Name</label>
          <input required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Organic Roma Tomatoes" className="p-3 bg-surface rounded-lg border border-outline-variant outline-none focus:border-primary" />
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
          <label className="text-sm font-bold text-on-surface">Price (INR)</label>
          <input required type="number" placeholder="e.g. 150" value={price} onChange={e => setPrice(e.target.value)} className="p-3 bg-surface rounded-lg border border-outline-variant outline-none focus:border-primary" />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-on-surface">Initial Stock</label>
          <input required type="number" placeholder="e.g. 50" value={stock} onChange={e => setStock(e.target.value)} className="p-3 bg-surface rounded-lg border border-outline-variant outline-none focus:border-primary" />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-on-surface">Unit</label>
          <select value={unit} onChange={e => setUnit(e.target.value)} className="p-3 bg-surface rounded-lg border border-outline-variant outline-none focus:border-primary">
            <option value="kg">Kilograms (kg)</option>
            <option value="bags">Bags (90kg)</option>
            <option value="tons">Tons</option>
            <option value="crates">Crates</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-on-surface">Description</label>
        <textarea rows={4} value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe the quality, harvest date, and any certifications..." className="p-3 bg-surface rounded-lg border border-outline-variant outline-none focus:border-primary resize-none" />
      </div>

      <div className="pt-4 border-t border-outline-variant flex justify-end">
        <button disabled={loading} type="submit" className="w-full md:w-auto px-10 py-3 bg-primary text-white font-bold rounded-lg shadow-sm hover:brightness-110 transition-all flex items-center justify-center gap-2">
          {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : 'List Produce Now'}
        </button>
      </div>
    </form>
  );
}