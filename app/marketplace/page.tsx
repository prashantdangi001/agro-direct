import MarketplaceNavbar from "@/components/layout/MarketplaceNavbar";
import MarketplaceSidebar from "@/components/marketplace/MarketplaceSidebar";
import ProductGrid from "@/components/marketplace/ProductGrid";
import PriceTicker from "@/components/marketplace/PriceTicker";
// 1. Import Suspense from React
import { Suspense } from "react"; 

export default function MarketplacePage() {
  return (
    <div className="bg-background min-h-screen flex flex-col">
      <MarketplaceNavbar />
      
      <div className="flex flex-1 max-w-[1280px] mx-auto w-full relative">
        {/* Left: Filter Sidebar (Hidden on mobile) */}
        {/* If MarketplaceSidebar also uses search params, we can wrap it too, but ProductGrid is the main one */}
        <Suspense fallback={<div className="w-64 p-6 animate-pulse bg-surface-container-low hidden md:block"></div>}>
          <MarketplaceSidebar />
        </Suspense>

        {/* Right: Product Exploration Area */}
        <main className="flex-1 p-6 md:p-10 lg:ml-64">
          <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-on-surface mb-2 tracking-tight">Fresh Harvest</h1>
              <p className="text-on-surface-variant max-w-lg">
                Discover high-quality produce directly from local farms. Trace every item back to its root.
              </p>
            </div>
            
            {/* Contextual Market Ticker */}
            <PriceTicker label="Wheat" change="+2.4%" />
          </div>

          {/* 2. THE CRITICAL FIX: Wrap the ProductGrid in Suspense! */}
          <Suspense fallback={
            <div className="flex justify-center py-20">
              <div className="w-12 h-12 border-4 border-surface-container-high border-t-primary rounded-full animate-spin"></div>
            </div>
          }>
            <ProductGrid />
          </Suspense>

        </main>
      </div>

      {/* Mobile Floating Filter Button (Mobile only) */}
      <button className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center z-40 active:scale-95 transition-transform">
        <span className="material-symbols-outlined">filter_list</span>
      </button>
    </div>
  );
}