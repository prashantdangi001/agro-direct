import FarmerNavbar from "@/components/layout/FarmerNavbar";
import ProductGallery from "@/components/product/ProductGallery";
import ProductPurchaseCard from "@/components/product/ProductPurchaseCard";
import FarmerSnippet from "@/components/product/FarmerSnippet";
import TraceabilityTimeline from "@/components/product/TraceabilityTimeline";
import NutritionalInfo from "@/components/product/NutritionalInfo";

export default function ProductDetails() {
  return (
    <div className="bg-background min-h-screen flex flex-col">
      <FarmerNavbar />
      
      {/* THE FIX: This main tag restricts the width to 1280px and centers it. */}
      <main className="w-full max-w-[1280px] mx-auto px-4 md:px-12 py-8 flex-grow">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 mb-8 text-on-surface-variant text-sm font-semibold">
          <span>Marketplace</span>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <span>Vegetables</span>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <span className="text-primary">Organic Roma Tomatoes</span>
        </nav>

        {/* The Grid: lg:grid-cols-2 forces the left side (images) and right side (text) side-by-side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 items-start">
          
          {/* Left Column: Constrained Image Gallery */}
          <div className="w-full overflow-hidden">
            <ProductGallery />
          </div>
          
          {/* Right Column: Details & Purchase */}
          <div className="flex flex-col w-full">
            <div className="mb-2">
              <span className="inline-flex items-center gap-1 bg-primary-container/10 text-primary px-3 py-1 rounded-full text-xs font-bold">
                <span className="material-symbols-outlined text-[18px] filled-icon">verified</span>
                Verified Farmer
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-2 text-on-surface tracking-tight">
              Organic Roma Tomatoes
            </h1>
            <p className="text-on-surface-variant text-lg mb-6 font-medium">
              Green Valley Farm • Nakuru, Kenya
            </p>
            
            <div className="flex items-baseline gap-4 mb-8">
              <span className="text-4xl font-bold text-on-surface">$4.50</span>
              <span className="text-on-surface-variant font-medium">/ kg</span>
              <span className="ml-auto text-primary text-sm font-bold tracking-wide">In Stock (120kg)</span>
            </div>

            <ProductPurchaseCard />
            
            <div className="mt-4">
              <FarmerSnippet />
            </div>
          </div>
          
        </div>

        {/* Details & Nutrition Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="md:col-span-2 bg-white p-8 rounded-xl border border-outline-variant elevation-1">
            <h3 className="text-2xl font-bold mb-4 text-on-surface">Product Description</h3>
            <p className="text-on-surface-variant leading-relaxed mb-4">
              Our Organic Roma Tomatoes are sun-ripened on the vine in the rich volcanic soils of the Nakuru region. Known for their firm texture and low moisture content, they are the gold standard for sauces, pastes, and roasting.
            </p>
            <p className="text-on-surface-variant leading-relaxed">
              We utilize regenerative farming practices, avoiding synthetic pesticides and fertilizers to ensure you receive a product that is as healthy as it is flavorful. Hand-picked at peak ripeness to ensure maximum sweetness and nutritional density.
            </p>
          </div>
          <NutritionalInfo />
        </div>

        {/* Traceability */}
        <TraceabilityTimeline />
        
      </main>
    </div>
  );
}