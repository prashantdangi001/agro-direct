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
  
  // Followed Farms State
  const [followedFarms, setFollowedFarms] = useState<string[]>([]);

  const fetchProducts = async () => {
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (!error && data) setProducts(data);
    setLoading(false);
  };

  // Sync LocalStorage for Followed Farms
  const updateFollowedFarms = () => {
    const followed = JSON.parse(localStorage.getItem('followedFarms') || '[]');
    setFollowedFarms(followed);
  };

  useEffect(() => {
    fetchProducts();
    updateFollowedFarms();

    // Listen for Realtime DB Changes
    const channel = supabase.channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => fetchProducts())
      .subscribe();

    // MAGIC: Listen for Cross-Tab LocalStorage Changes (when they click Follow in another tab!)
    window.addEventListener('storage', updateFollowedFarms);

    return () => { 
      supabase.removeChannel(channel); 
      window.removeEventListener('storage', updateFollowedFarms);
    };
  }, []);

  // ----------------------------------------------------
  // FILTERING & SORTING LOGIC
  // ----------------------------------------------------
  let displayProducts = [...products];

  // 1. Filter by Sidebar Tabs
  if (activeTab === 'Organic') {
    displayProducts = displayProducts.filter(p => p.name.toLowerCase().includes('organic') || (p.description && p.description.toLowerCase().includes('organic')));
  } else if (activeTab === 'Bulk Orders') {
    displayProducts = displayProducts.filter(p => p.unit === 'tons' || p.unit === 'sacks' || p.stock >= 100);
  } else if (activeTab === 'Traceability') {
    displayProducts = displayProducts.filter(p => p.stock > 10);
  }

  // 2. Filter by Category
  if (selectedCategories.length > 0) {
    displayProducts = displayProducts.filter(p => selectedCategories.includes(p.category));
  }

  // 3. SORTING: Push Followed Farms to the TOP
  const isFollowingDemoFarm = followedFarms.includes('demo-farm');
  
  if (isFollowingDemoFarm) {
    displayProducts.sort((a, b) => {
      // For the demo, we assume the first half of the database belongs to the followed farm
      // In a real app, this would check if a.farm_id === 'demo-farm'
      const aIsFollowed = a.id > b.id; // Just a mock condition to separate some items
      const bIsFollowed = b.id > a.id;
      if (aIsFollowed && !bIsFollowed) return -1;
      if (!aIsFollowed && bIsFollowed) return 1;
      return 0;
    });
  }

  // ----------------------------------------------------
  // RENDERING
  // ----------------------------------------------------
  if (loading) return <div className="flex justify-center py-20"><div className="w-12 h-12 border-4 border-surface-container-high border-t-primary rounded-full animate-spin"></div></div>;

  if (activeTab === 'Nearby Farmers') {
    return (
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl h-[500px] flex flex-col items-center justify-center text-center p-8 elevation-1 animate-in fade-in zoom-in-95">
        <span className="material-symbols-outlined text-7xl text-primary mb-4 opacity-80">location_on</span>
        <h3 className="text-3xl font-bold mb-2 text-on-surface tracking-tight">Regional Farm Map</h3>
        <p className="text-on-surface-variant max-w-md mx-auto mb-6">Interactive map integration would display here, showing active farms within your selected 25km radius.</p>
      </div>
    );
  }

  if (displayProducts.length === 0) return (
    <div className="text-center py-20 bg-white rounded-xl border border-outline-variant elevation-1">
      <span className="material-symbols-outlined text-6xl text-outline mb-4">eco</span>
      <h3 className="text-2xl font-bold text-on-surface mb-2">No Produce Found</h3>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in duration-300">
      {displayProducts.map((product, index) => {
        // Mock logic: If followed, the top items get the badge
        const showFollowedBadge = isFollowingDemoFarm && index < 3;

        return (
          <ProductCard 
            key={product.id}
            id={product.id}
            name={product.name}
            farm={showFollowedBadge ? "Green Valley Farm" : "AgroDirect Verified Farm"} 
            price={`KES ${product.price.toFixed(2)}`}
            unit={product.unit}
            tag={showFollowedBadge ? '★ Followed Farm' : product.stock > 10 ? 'Verified' : product.stock > 0 ? 'Low Stock' : 'Out of Stock'}
            image={product.image_url || "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?q=80&w=600&auto=format&fit=crop"} 
          />
        );
      })}
    </div>
  );
} 