'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import ProductCard from './ProductCard';

export default function ProductGrid() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      // Fetch all products from Supabase, newest first
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error);
      } else if (data) {
        setProducts(data);
      }
      setLoading(false);
    }

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-surface-container-high border-t-primary rounded-full animate-spin"></div>
        <p className="mt-4 text-on-surface-variant font-bold">Loading fresh harvest...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-xl border border-outline-variant elevation-1">
        <span className="material-symbols-outlined text-6xl text-outline mb-4">eco</span>
        <h3 className="text-2xl font-bold text-on-surface mb-2">No Produce Found</h3>
        <p className="text-on-surface-variant">Check back later or adjust your filters.</p>
      </div>
    );
  }

// Inside components/marketplace/ProductGrid.tsx (Replace the return statement at the bottom)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard 
          key={product.id}
          name={product.name}
          farm="AgroDirect Verified Farm" 
          price={`KES ${product.price.toFixed(2)}`}
          unit={product.unit}
          tag={product.status === 'In Stock' ? 'Verified' : product.status}
          // USE REAL IMAGE OR FALLBACK
          image={product.image_url || "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?q=80&w=600&auto=format&fit=crop"} 
        />
      ))}
    </div>
  );
}