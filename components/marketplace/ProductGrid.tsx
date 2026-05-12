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
  const [followedFarms, setFollowedFarms] = useState<string[]>([]);

  const fetchProducts = async () => {
    try {
      // 1. Fetch all products normally (No complex SQL joins)
      const { data: productsData, error: productError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (productError) throw productError;

      // 2. Fetch the farm profiles
      const { data: profilesData, error: profileError } = await supabase
        .from('farm_profiles')
        .select('id, farm_name');

      if (profileError) throw profileError;

      // 3. Manually map the Farm Name to the Product in the frontend!
      if (productsData) {
        const combinedProducts = productsData.map((product) => {
          // Find the farmer who owns this product
          const farmerProfile = profilesData?.find(p => p.id === product.farmer_id);
          
          return {
            ...product,
            farm_profiles: {
              farm_name: farmerProfile?.farm_name || "Khetify Producer"
            }
          };
        });
        
        setProducts(combinedProducts);
      }
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateFollowedFarms = () => {
    const followed = JSON.parse(localStorage.getItem('followedFarms') || '[]');
    setFollowedFarms(followed);
  };

  useEffect(() => {
    fetchProducts();
    updateFollowedFarms();

    const channel = supabase.channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => fetchProducts())
      .subscribe();

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

  if (activeTab === 'Organic') {
    displayProducts = displayProducts.filter(p => p.name.toLowerCase().includes('organic') || (p.description && p.description.toLowerCase().includes('organic')));
  } else if (activeTab === 'Bulk Orders') {
    displayProducts = displayProducts.filter(p => p.unit === 'tons' || p.unit === 'bags' || p.stock >= 100);
  } else if (activeTab === 'Traceability') {
    displayProducts = displayProducts.filter(p => p.stock > 10);
  }

  if (selectedCategories.length > 0) {
    displayProducts = displayProducts.filter(p => selectedCategories.includes(p.category));
  }

  // Push Followed Farms to the top
  displayProducts.sort((a, b) => {
    const aIsFollowed = followedFarms.includes(a.farmer_id);
    const bIsFollowed = followedFarms.includes(b.farmer_id);
    if (aIsFollowed && !bIsFollowed) return -1;
    if (!aIsFollowed && bIsFollowed) return 1;
    return 0;
  });

  // ----------------------------------------------------
  // RENDERING
  // ----------------------------------------------------
  if (loading) return <div className="flex justify-center py-20"><div className="w-12 h-12 border-4 border-surface-container-high border-t-primary rounded-full animate-spin"></div></div>;

  if (displayProducts.length === 0) return (
    <div className="text-center py-20 bg-white rounded-xl border border-outline-variant elevation-1">
      <span className="material-symbols-outlined text-6xl text-outline mb-4">eco</span>
      <h3 className="text-2xl font-bold text-on-surface mb-2">No Produce Found</h3>
      <p className="text-on-surface-variant">Check back later for fresh harvests.</p>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in duration-300">
      {displayProducts.map((product) => {
        const isFollowed = followedFarms.includes(product.farmer_id);

        return (
          <ProductCard 
            key={product.id}
            id={product.id}
            name={product.name}
            farm={product.farm_profiles?.farm_name || "Khetify Producer"} 
            price={`INR ${product.price.toFixed(2)}`}
            unit={product.unit}
            tag={isFollowed ? '★ Followed Farm' : product.stock > 10 ? 'Verified' : product.stock > 0 ? 'Low Stock' : 'Out of Stock'}
            image={product.image_url || "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?q=80&w=600&auto=format&fit=crop"} 
            farmerId={product.farmer_id} 
          />
        );
      })}
    </div>
  );
}