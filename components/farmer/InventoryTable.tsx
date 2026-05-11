'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function InventoryTable() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch real products on load
  useEffect(() => {
    fetchInventory();
  }, []);

  async function fetchInventory() {
    setLoading(true);
    // In a full production app, you would filter by the logged-in farmer's ID here
    // e.g., .eq('farmer_id', currentUser.id)
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching inventory:', error);
    } else if (data) {
      setInventory(data);
    }
    setLoading(false);
  }

  // 2. Wire up the Delete Action
  async function handleDelete(id: string) {
    // Optimistic UI update: instantly remove from screen
    setInventory(inventory.filter((item) => item.id !== id));

    // Delete from Supabase
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product.');
      // If it fails, fetch again to restore the UI
      fetchInventory(); 
    }
  }

  return (
    <div className="bg-white rounded-lg border border-outline-variant elevation-1 overflow-hidden">
      {/* Table Header Controls */}
      <div className="p-4 border-b border-outline-variant bg-surface-container-lowest flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-72">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
          <input 
            type="text" 
            placeholder="Search inventory..." 
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm transition-all"
          />
        </div>
        <button className="flex items-center gap-2 text-sm font-bold text-on-surface-variant hover:text-primary transition-colors">
          <span className="material-symbols-outlined text-sm">filter_list</span>
          Filter
        </button>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto min-h-[300px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-surface-container-high border-t-primary rounded-full animate-spin"></div>
            <p className="mt-4 text-sm font-bold text-on-surface-variant">Syncing with database...</p>
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
                      {item.image_url && (
                        <img src={item.image_url} alt={item.name} className="w-10 h-10 rounded object-cover border border-outline-variant" />
                      )}
                      <div>
                        <p className="font-bold text-on-surface">{item.name}</p>
                        <p className="text-xs text-on-surface-variant font-medium">ID: {item.id.substring(0, 8)}...</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-on-surface-variant">{item.category}</td>
                  <td className="py-4 px-6 text-sm font-bold text-on-surface">KES {item.price.toFixed(2)}</td>
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
                      <button className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-lg transition-all" title="Edit">
                        <span className="material-symbols-outlined text-sm">edit</span>
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-on-surface-variant hover:text-error hover:bg-error-container/50 rounded-lg transition-all" 
                        title="Delete"
                      >
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
      
      {/* Pagination Footer */}
      <div className="p-4 border-t border-outline-variant bg-surface-container-lowest flex justify-between items-center text-sm text-on-surface-variant">
        <span>Showing {inventory.length} entries</span>
        <div className="flex gap-1">
          <button className="px-3 py-1 border border-outline-variant rounded hover:bg-surface-container transition-colors disabled:opacity-50" disabled>Prev</button>
          <button className="px-3 py-1 border border-outline-variant rounded bg-primary text-white font-bold">1</button>
          <button className="px-3 py-1 border border-outline-variant rounded hover:bg-surface-container transition-colors disabled:opacity-50" disabled>Next</button>
        </div>
      </div>
    </div>
  );
}