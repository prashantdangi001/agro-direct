import MarketplaceNavbar from "@/components/layout/MarketplaceNavbar";
import ProducerHero from "@/components/producer/ProducerHero";
import ProducerDetails from "@/components/producer/ProducerDetails";
import ProducerSidebar from "@/components/producer/ProducerSidebar";
import ProducerProducts from "@/components/producer/ProducerProducts";

export default function ProducerProfilePage() {
  return (
    <div className="bg-background min-h-screen flex flex-col">
      <MarketplaceNavbar />
      
      <main className="w-full flex-grow pb-24 md:pb-12">
        {/* Full-bleed Hero Section */}
        <ProducerHero />

        {/* Constrained Content Grid */}
        <div className="max-w-[1280px] mx-auto px-4 md:px-12 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Bio & Practices (8 Columns) */}
          <div className="lg:col-span-8 space-y-8">
            <ProducerDetails />
          </div>

          {/* Right Column: Stats & Quote CTA (4 Columns) */}
          <aside className="lg:col-span-4 space-y-8 sticky top-24">
            <ProducerSidebar />
          </aside>
          
        </div>

        {/* Bottom Section: Farmer's Products */}
        <div className="max-w-[1280px] mx-auto px-4 md:px-12 mt-16">
          <ProducerProducts />
        </div>
      </main>
    </div>
  );
}