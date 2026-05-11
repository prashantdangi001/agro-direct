'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import ProductCard from './ProductCard';
import { useSearchParams } from 'next/navigation';

export default function ProductGrid() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'All Produce';
  const selectedCategories = searchParams.getAll('category');

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setProducts(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();

    // Keep Realtime Listener Active
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        () => fetchProducts()
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  // ----------------------------------------------------
  // FILTERING LOGIC
  // ----------------------------------------------------
  let displayProducts = [...products];

  // 1. Filter by Sidebar Tabs
  if (activeTab === 'Organic') {
    // Show only products with "organic" in the name or description
    displayProducts = displayProducts.filter(p => 
      p.name.toLowerCase().includes('organic') || 
      (p.description && p.description.toLowerCase().includes('organic'))
    );
  } else if (activeTab === 'Bulk Orders') {
    // Show items sold in tons or sacks, or having massive stock
    displayProducts = displayProducts.filter(p => 
      p.unit === 'tons' || p.unit === 'sacks' || p.stock >= 100
    );
  } else if (activeTab === 'Traceability') {
    // Show only verified/in-stock items as a placeholder for traceable items
    displayProducts = displayProducts.filter(p => p.stock > 10);
  }

  // 2. Filter by Category Checkboxes
  if (selectedCategories.length > 0) {
    displayProducts = displayProducts.filter(p => selectedCategories.includes(p.category));
  }

  // ----------------------------------------------------
  // RENDERING
  // ----------------------------------------------------
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-surface-container-high border-t-primary rounded-full animate-spin"></div>
        <p className="mt-4 text-on-surface-variant font-bold">Loading fresh harvest...</p>
      </div>
    );
  }

  // SPECIAL VIEW: Nearby Farmers Map
  if (activeTab === 'Nearby Farmers') {
    return (
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl h-[500px] flex flex-col items-center justify-center text-center p-8 elevation-1 animate-in fade-in zoom-in-95">
        <span className="material-symbols-outlined text-7xl text-primary mb-4 opacity-80">location_on</span>
        <h3 className="text-3xl font-bold mb-2 text-on-surface tracking-tight">Regional Farm Map</h3>
        <p className="text-on-surface-variant max-w-md mx-auto mb-6">
          Interactive map integration would display here, showing active farms within your selected 25km radius.
        </p>
        <button className="bg-primary text-white px-6 py-2 rounded-lg font-bold shadow-sm">
          Expand Map
        </button>
      </div>
    );
  }

  // EMPTY STATE
  if (displayProducts.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-xl border border-outline-variant elevation-1">
        <span className="material-symbols-outlined text-6xl text-outline mb-4">eco</span>
        <h3 className="text-2xl font-bold text-on-surface mb-2">No Produce Found</h3>
        <p className="text-on-surface-variant">Check back later or adjust your filters.</p>
        {selectedCategories.length > 0 && (
          <p className="text-primary font-bold mt-4 text-sm hover:underline cursor-pointer">Clear Filters</p>
        )}
      </div>
    );
  }

  // GRID STATE
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in duration-300">
      {displayProducts.map((product) => (
        <ProductCard 
          key={product.id}
          id={product.id}
          name={product.name}
          farm="AgroDirect Verified Farm" 
          price={`KES ${product.price.toFixed(2)}`}
          unit={product.unit}
          tag={product.stock > 10 ? 'Verified' : product.stock > 0 ? 'Low Stock' : 'Out of Stock'}
          image={product.image_url || "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?q=80&w=600&auto=format&fit=crop"} 
        />
      ))}
    </div>
  );
}