'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import MarketplaceNavbar from '@/components/layout/MarketplaceNavbar';
import ProductPurchaseCard from '@/components/product/ProductPurchaseCard';
import TraceabilityTimeline from '@/components/product/TraceabilityTimeline';
import NutritionalInfo from '@/components/product/NutritionalInfo';
import FarmerSnippet from '@/components/product/FarmerSnippet';
import BackButton from '@/components/ui/BackButton';

export default function ProductDetailsPage() {
  const params = useParams();
  const productId = params.id as string;
  
  const [product, setProduct] = useState<any>(null);
  const [farmName, setFarmName] = useState<string>("Khetify Producer");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      if (!productId) return;
      
      // 1. Fetch the Product
      const { data: productData, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (!error && productData) {
        setProduct(productData);

        // 2. Fetch the Farm Name so we can pass it to the Purchase Card
        if (productData.farmer_id) {
          const { data: farmData } = await supabase
            .from('farm_profiles')
            .select('farm_name')
            .eq('id', productData.farmer_id)
            .single();
            
          if (farmData && farmData.farm_name) {
            setFarmName(farmData.farm_name);
          }
        }
      }
      setLoading(false);
    }
    fetchProduct();
  }, [productId]);

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
          <BackButton label="Return to Market" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <MarketplaceNavbar />

      <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 md:px-12 py-8">
        
        <BackButton label="Back to Marketplace" />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 mt-4">
          
          <div className="lg:col-span-2 space-y-10 animate-in fade-in duration-500">
            <div className="w-full aspect-[4/3] md:aspect-[16/9] bg-surface-container-lowest rounded-2xl overflow-hidden border border-outline-variant elevation-1">
              <img 
                src={product.image_url || "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?q=80&w=1200&auto=format&fit=crop"} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            </div>

            <section>
              <h2 className="text-3xl font-bold text-on-surface mb-4 tracking-tight">{product.name}</h2>
              <h3 className="text-xl font-bold text-on-surface mb-3">About this Harvest</h3>
              <p className="text-on-surface-variant leading-relaxed text-lg">
                {product.description || "Freshly harvested produce sourced directly from verified local farms."}
              </p>
            </section>

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

            <NutritionalInfo />
          </div>

          <div className="space-y-6 relative">
            <div className="sticky top-28 space-y-6 animate-in fade-in duration-500 delay-150">
              
              <ProductPurchaseCard 
                product={{
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  unit: product.unit,
                  stock: product.stock,
                  image: product.image_url,
                  farm: farmName,
                  farmerId: product.farmer_id // THE FIX: Pass the ID to the cart!
                }} 
              />

              {/* THE FIX: Pass the ID to the snippet! */}
              <FarmerSnippet farmerId={product.farmer_id} />
              
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}