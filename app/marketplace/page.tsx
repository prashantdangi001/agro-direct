import MarketplaceNavbar from "@/components/layout/MarketplaceNavbar";
import MarketplaceSidebar from "@/components/marketplace/MarketplaceSidebar";
import ProductGrid from "@/components/marketplace/ProductGrid";
import PriceTicker from "@/components/marketplace/PriceTicker";

export default function MarketplacePage() {
  return (
    <div className="bg-background min-h-screen flex flex-col">
      <MarketplaceNavbar />
      
      <div className="flex flex-1 max-w-[1280px] mx-auto w-full relative">
        {/* Left: Filter Sidebar (Hidden on mobile) */}
        <MarketplaceSidebar />

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

          <ProductGrid />
        </main>
      </div>

      {/* Mobile Floating Filter Button (Mobile only) */}
      <button className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center z-40 active:scale-95 transition-transform">
        <span className="material-symbols-outlined">filter_list</span>
      </button>
    </div>
  );
}