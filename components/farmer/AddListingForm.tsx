'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AddListingForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Image State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    unit: 'kg',
    description: ''
  });

  // Handle Image Selection and Preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // Creates a local preview instantly
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let uploadedImageUrl = null;

    // 1. Upload the image to Supabase Storage FIRST (if they selected one)
    if (imageFile) {
      // Create a unique file name to avoid overwriting
      const fileName = `${Date.now()}-${imageFile.name.replace(/\s+/g, '-')}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, imageFile);

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        alert('Failed to upload image.');
        setLoading(false);
        return;
      }

      // 2. Get the public URL of the image we just uploaded
      const { data: publicUrlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);
        
      uploadedImageUrl = publicUrlData.publicUrl;
    }

    // 3. Save the product data to the database, including the new image URL
    const { error: dbError } = await supabase
      .from('products')
      .insert([
        { 
          name: formData.name, 
          category: formData.category, 
          price: parseFloat(formData.price), 
          stock: parseInt(formData.stock), 
          unit: formData.unit,
          description: formData.description,
          image_url: uploadedImageUrl // Save the URL here!
        }
      ]);

    if (dbError) {
      console.error('Error saving product:', dbError);
      alert('Failed to save product.');
    } else {
      setSuccess(true);
      // Reset form and image preview
      setFormData({ name: '', category: '', price: '', stock: '', unit: 'kg', description: '' });
      setImageFile(null);
      setPreviewUrl(null);
      setTimeout(() => setSuccess(false), 3000);
    }
    setLoading(false);
  };

  return (
    <section className="bg-white rounded-lg border border-outline-variant elevation-1 p-6 md:p-10 relative">
      
      {success && (
        <div className="absolute top-4 right-4 bg-primary text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-4 z-50">
          <span className="material-symbols-outlined">check_circle</span>
          Product Listed Successfully!
        </div>
      )}

      <form className="space-y-8" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-on-surface mb-2">Produce Name</label>
              <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g. Red Sweet Onions" className="w-full h-12 px-4 rounded-lg border border-outline-variant focus:border-primary outline-none transition-all" />
            </div>

            <div>
              <label className="block text-sm font-bold text-on-surface mb-2">Category</label>
              <select required value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full h-12 px-4 rounded-lg border border-outline-variant focus:border-primary outline-none bg-surface-bright">
                <option value="" disabled>Select a Category</option>
                <option value="Vegetables">Vegetables</option>
                <option value="Grains">Grains</option>
                <option value="Fruits">Fruits</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-on-surface mb-2">Price per unit</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-bold text-sm">INR</span>
                <input type="number" required step="0.01" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} placeholder="0.00" className="w-full h-12 pl-16 pr-4 rounded-lg border border-outline-variant focus:border-primary outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-on-surface mb-2">Stock Quantity</label>
              <div className="flex gap-2">
                <input type="number" required value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} placeholder="Enter quantity" className="flex-1 h-12 px-4 rounded-lg border border-outline-variant focus:border-primary outline-none" />
                <select value={formData.unit} onChange={(e) => setFormData({...formData, unit: e.target.value})} className="w-24 h-12 px-2 rounded-lg border border-outline-variant bg-surface-container-low font-bold text-sm">
                  <option value="kg">kg</option>
                  <option value="tons">tons</option>
                  <option value="sacks">sacks</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-on-surface mb-2">Produce Photo</label>
              
              {/* HIDDEN FILE INPUT */}
              <input 
                type="file" 
                id="photo-upload" 
                accept="image/png, image/jpeg, image/webp" 
                className="hidden" 
                onChange={handleImageChange}
              />
              
              {/* CLICKABLE UPLOAD BOX / PREVIEW */}
              <label 
                htmlFor="photo-upload" 
                className="w-full aspect-[4/3] rounded-lg border-2 border-dashed border-outline-variant bg-surface-container-low flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-surface-container-high transition-colors group overflow-hidden relative"
              >
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <div className="w-14 h-14 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-3xl">cloud_upload</span>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-primary">Upload Produce Photo</p>
                      <p className="text-[10px] text-on-surface-variant uppercase tracking-tighter">JPG, PNG up to 10MB</p>
                    </div>
                  </>
                )}
              </label>
            </div>

            <div>
              <label className="block text-sm font-bold text-on-surface mb-2">Description/Notes</label>
              <textarea rows={4} required value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Detailed description..." className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:border-primary outline-none resize-none" />
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-end items-center gap-4 pt-6 border-t border-outline-variant">
          <button type="button" className="w-full md:w-auto px-8 py-3 rounded-lg border border-primary text-primary font-bold hover:bg-primary/5 transition-all">Cancel</button>
          <button type="submit" disabled={loading} className="w-full md:w-auto px-12 py-3 rounded-lg bg-[#D97706] text-white font-bold elevation-1 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50">
            {loading ? 'Uploading...' : 'Save Listing'}
          </button>
        </div>
      </form>
    </section>
  );
}