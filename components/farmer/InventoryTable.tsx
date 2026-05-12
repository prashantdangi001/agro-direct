'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function InventoryTable() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Form State
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editPrice, setEditPrice] = useState<number | string>('');
  const [editStock, setEditStock] = useState<number | string>('');
  const [editUnit, setEditUnit] = useState('kg');
  const [editDescription, setEditDescription] = useState('');
  
  // Image State
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editPreviewUrl, setEditPreviewUrl] = useState<string | null>(null);

  // 1. Fetch real products
  useEffect(() => {
    fetchInventory();
  }, []);

  async function fetchInventory() {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) setInventory(data);
    setLoading(false);
  }

  // 2. Delete Action
  async function handleDelete(id: string) {
    setInventory(inventory.filter((item) => item.id !== id));
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      console.error('Delete failed:', error);
      fetchInventory(); 
    }
  }

  // 3. Open Edit Modal and pre-fill all data
  const openEditModal = (item: any) => {
    setEditingItem(item);
    setEditName(item.name || '');
    setEditCategory(item.category || '');
    setEditPrice(item.price || '');
    setEditStock(item.stock || '');
    setEditUnit(item.unit || 'kg');
    setEditDescription(item.description || '');
    setEditPreviewUrl(item.image_url || null);
    setEditImageFile(null); // Reset file selection
  };

  // Handle Image Selection inside Modal
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setEditImageFile(file);
      setEditPreviewUrl(URL.createObjectURL(file));
    }
  };

  // 4. Save Updates to Database
  const saveUpdates = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    let finalImageUrl = editingItem.image_url; // Default to existing image

    // If they selected a NEW image, upload it first
    if (editImageFile) {
      const fileName = `update-${Date.now()}-${editImageFile.name.replace(/\s+/g, '-')}`;
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, editImageFile);

      if (!uploadError) {
        const { data: publicUrlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);
        finalImageUrl = publicUrlData.publicUrl;
      }
    }

    // Update the entire record in Supabase
    const { error } = await supabase
      .from('products')
      .update({ 
        name: editName,
        category: editCategory,
        price: parseFloat(editPrice.toString()), 
        stock: parseInt(editStock.toString()),
        unit: editUnit,
        description: editDescription,
        image_url: finalImageUrl
      })
      .eq('id', editingItem.id);

    if (error) {
      alert("Failed to update listing");
      console.error(error);
    } else {
      fetchInventory();
      setEditingItem(null); 
    }
    setIsUpdating(false);
  };

  return (
    <>
      {/* --- THE FULL EDIT MODAL --- */}
      {editingItem && (
        <div className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-surface-container-lowest rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto elevation-1 animate-in zoom-in-95 relative">
            
            {/* Sticky Header */}
            <div className="sticky top-0 bg-surface-container-lowest p-6 border-b border-outline-variant flex justify-between items-center z-10">
              <h3 className="text-xl font-bold text-on-surface">Edit Listing</h3>
              <button onClick={() => setEditingItem(null)} className="text-on-surface-variant hover:bg-surface-container p-1 rounded-full transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={saveUpdates} className="p-6 space-y-6">
              
              {/* Photo Upload Area */}
              <div>
                <label className="block text-sm font-bold text-on-surface mb-2">Produce Photo</label>
                <input type="file" id="edit-photo-upload" accept="image/png, image/jpeg, image/webp" className="hidden" onChange={handleImageChange} />
                <label htmlFor="edit-photo-upload" className="w-full h-48 rounded-lg border-2 border-dashed border-outline-variant bg-surface-container-low flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-surface-container-high transition-colors group overflow-hidden relative">
                  {editPreviewUrl ? (
                    <>
                      <img src={editPreviewUrl} alt="Preview" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white font-bold gap-2">
                        <span className="material-symbols-outlined">edit</span> Change Photo
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container">
                        <span className="material-symbols-outlined">cloud_upload</span>
                      </div>
                      <p className="font-bold text-primary text-sm">Upload New Photo</p>
                    </>
                  )}
                </label>
              </div>

              {/* Grid Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-on-surface mb-2">Produce Name</label>
                  <input type="text" required value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-on-surface mb-2">Category</label>
                  <select required value={editCategory} onChange={(e) => setEditCategory(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:border-primary outline-none bg-white">
                    <option value="Vegetables">Vegetables</option>
                    <option value="Grains">Grains</option>
                    <option value="Fruits">Fruits</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-on-surface mb-2">Price (INR)</label>
                  <input type="number" step="0.01" required value={editPrice} onChange={(e) => setEditPrice(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-on-surface mb-2">Stock & Unit</label>
                  <div className="flex gap-2">
                    <input type="number" required value={editStock} onChange={(e) => setEditStock(e.target.value)} className="flex-1 px-4 py-3 rounded-lg border border-outline-variant focus:border-primary outline-none" />
                    <select value={editUnit} onChange={(e) => setEditUnit(e.target.value)} className="w-24 px-2 rounded-lg border border-outline-variant bg-surface-container-low font-bold text-sm">
                      <option value="kg">kg</option>
                      <option value="tons">tons</option>
                      <option value="sacks">sacks</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-bold text-on-surface mb-2">Description</label>
                <textarea rows={3} required value={editDescription} onChange={(e) => setEditDescription(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:border-primary outline-none resize-none" />
              </div>

              {/* Sticky Footer Actions */}
              <div className="sticky bottom-0 bg-surface-container-lowest pt-4 border-t border-outline-variant flex justify-end gap-3 pb-2">
                <button type="button" onClick={() => setEditingItem(null)} className="px-5 py-2 font-bold text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isUpdating} className="px-8 py-2 font-bold bg-[#D97706] hover:bg-[#b05f02] text-white rounded-lg active:scale-95 transition-all shadow-sm disabled:opacity-50 flex items-center gap-2">
                  {isUpdating ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : 'Save Full Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* --- END EDIT MODAL --- */}

      {/* --- TABLE RENDER (Unchanged) --- */}
      <div className="bg-white rounded-lg border border-outline-variant elevation-1 overflow-hidden">
        <div className="p-4 border-b border-outline-variant bg-surface-container-lowest flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-72">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
            <input type="text" placeholder="Search inventory..." className="w-full pl-10 pr-4 py-2 rounded-lg border border-outline-variant focus:border-primary outline-none text-sm" />
          </div>
        </div>

        <div className="overflow-x-auto min-h-[300px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="w-8 h-8 border-4 border-surface-container-high border-t-primary rounded-full animate-spin"></div>
            </div>
          ) : inventory.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-on-surface-variant">
              <span className="material-symbols-outlined text-4xl mb-2">inventory_2</span>
              <p className="font-bold">No products listed yet.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant">
                  <th className="py-3 px-6 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Produce</th>
                  <th className="py-3 px-6 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Category</th>
                  <th className="py-3 px-6 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Price</th>
                  <th className="py-3 px-6 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Stock</th>
                  <th className="py-3 px-6 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Status</th>
                  <th className="py-3 px-6 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {inventory.map((item) => (
                  <tr key={item.id} className="hover:bg-surface-bright transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        {item.image_url && <img src={item.image_url} alt={item.name} className="w-10 h-10 rounded object-cover border border-outline-variant" />}
                        <div>
                          <p className="font-bold text-on-surface">{item.name}</p>
                          <p className="text-xs text-on-surface-variant font-medium">ID: {item.id.substring(0, 8)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-on-surface-variant">{item.category}</td>
                    <td className="py-4 px-6 text-sm font-bold text-on-surface">INR {item.price.toFixed(2)}</td>
                    <td className="py-4 px-6 text-sm text-on-surface-variant font-medium">{item.stock} {item.unit}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        item.stock > 10 ? 'bg-primary/10 text-primary border-primary/20' : 
                        item.stock > 0 ? 'bg-[#fe932c]/10 text-[#904d00] border-[#fe932c]/20' : 
                        'bg-error/10 text-error border-error/20'
                      }`}>
                        {item.stock > 10 ? 'In Stock' : item.stock > 0 ? 'Low Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => openEditModal(item)}
                          className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-lg transition-all" title="Edit"
                        >
                          <span className="material-symbols-outlined text-sm">edit</span>
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="p-2 text-on-surface-variant hover:text-error hover:bg-error-container/50 rounded-lg transition-all" title="Delete">
                          <span className="material-symbols-outlined text-sm">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}