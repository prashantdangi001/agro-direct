'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import MarketplaceNavbar from '@/components/layout/MarketplaceNavbar';
import ProductPurchaseCard from '@/components/product/ProductPurchaseCard';
import TraceabilityTimeline from '@/components/product/TraceabilityTimeline';
import NutritionalInfo from '@/components/product/NutritionalInfo';
import FarmerSnippet from '@/components/product/FarmerSnippet';
import Link from 'next/link';
import BackButton from '@/components/ui/BackButton';

export default function ProductDetailsPage() {
  const params = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // ... (keep your existing state variables)

  // NEW: Add this block to increment views when someone visits!
  useEffect(() => {
    const recordView = async () => {
      // 1. Get the current view count
      const { data } = await supabase.from('farm_profiles').select('profile_views').eq('id', 'demo-farm').single();
      
      if (data) {
        // 2. Add 1 and save it back to the database
        await supabase
          .from('farm_profiles')
          .update({ profile_views: data.profile_views + 1 })
          .eq('id', 'demo-farm');
      }
    };

    recordView();
  }, []); // Empty array ensures this only happens ONCE when the page loads

  // ... (keep your existing fetchData and Realtime useEffect exactly as it is)

  useEffect(() => {
    async function fetchProduct() {
      if (!params.id) return;
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', params.id)
        .single();

      if (!error && data) {
        setProduct(data);
      }
      setLoading(false);
    }
    fetchProduct();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <MarketplaceNavbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-surface-container-high border-t-primary rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <MarketplaceNavbar />
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
          <span className="material-symbols-outlined text-6xl text-outline mb-4">search_off</span>
          <h2 className="text-2xl font-bold mb-2">Produce Not Found</h2>
          <p className="text-on-surface-variant mb-6">This listing may have been removed or sold out.</p>
          <Link href="/marketplace" className="bg-primary text-white px-6 py-3 rounded-lg font-bold">Return to Market</Link>
        </div>
      </div>
    );
  }

  return (
    
    
    <div className="bg-background min-h-screen flex flex-col">
      <MarketplaceNavbar />

      <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 md:px-12 py-8">
        {/* 2. DROP THE BACK BUTTON HERE */}
        <BackButton label="Back to Marketplace" />
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-sm text-on-surface-variant font-medium mb-8">
          <Link href="/marketplace" className="hover:text-primary transition-colors">Marketplace</Link>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <span>{product.category}</span>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <span className="text-on-surface font-bold truncate">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          
          {/* Left Column: Image & Details (TaINR up 2/3 of space) */}
          <div className="lg:col-span-2 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Hero Image */}
            <div className="w-full aspect-[4/3] md:aspect-[16/9] bg-surface-container-lowest rounded-2xl overflow-hidden border border-outline-variant elevation-1">
              <img 
                src={product.image_url || "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?q=80&w=1200&auto=format&fit=crop"} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Description Section */}
            <section>
              <h2 className="text-2xl font-bold text-on-surface mb-4">About this Harvest</h2>
              <p className="text-on-surface-variant leading-relaxed text-lg">
                {product.description || "Freshly harvested produce sourced directly from verified local farms. Grown with sustainable practices to ensure the highest quality and nutritional value for wholesale buyers."}
              </p>
            </section>

            {/* The WOW Factor: Traceability Timeline */}
            <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-8 elevation-1">
              <div className="flex items-center gap-3 mb-6 border-b border-outline-variant pb-4">
                <span className="material-symbols-outlined text-primary text-3xl">qr_code_scanner</span>
                <div>
                  <h2 className="text-xl font-bold text-on-surface">Verified Origin Traceability</h2>
                  <p className="text-xs font-bold text-primary uppercase tracking-widest">Blockchain Verified</p>
                </div>
              </div>
              <TraceabilityTimeline />
            </section>

            {/* Nutritional & Quality Info */}
            <NutritionalInfo />
          </div>

          {/* Right Column: Checkout & Farmer Profile (TaINR up 1/3 of space) */}
          <div className="space-y-6 relative">
            <div className="sticky top-28 space-y-6 animate-in fade-in slide-in-from-right-8 duration-500 delay-150">
              
              {/* Add to Cart Card */}
              <ProductPurchaseCard 
                product={{
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  unit: product.unit,
                  stock: product.stock,
                  image: product.image_url,
                  farm: "Green Valley Farm",
                  farmerId: product.farmer_id || ""
                }} 
              />

              {/* Farmer Profile Snippet */}
              <FarmerSnippet />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}