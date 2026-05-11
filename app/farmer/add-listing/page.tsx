import FarmerSidebar from "@/components/layout/FarmerSidebar";
import FarmerNavbar from "@/components/layout/FarmerNavbar";
import AddListingForm from "@/components/farmer/AddListingForm";
import MarketTicker from "@/components/farmer/MarketTicker";

export default function AddListingPage() {
  return (
    <div className="bg-background min-h-screen flex flex-col">
      <FarmerNavbar />
      
      <div className="flex flex-1 max-w-[1280px] mx-auto w-full">
        {/* Left: Sticky Sidebar */}
        <FarmerSidebar />

        {/* Right: Scrollable Form Area */}
        <main className="flex-1 p-6 md:p-10 lg:ml-64">
          <div className="max-w-4xl mx-auto">
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-on-surface mb-2">Add New Produce</h1>
              <p className="text-on-surface-variant">
                List your fresh harvest on the AgriDirect marketplace for buyers to discover.
              </p>
            </header>

            <AddListingForm />
            
            {/* Contextual Market Rates Widget */}
            <div className="mt-8">
              <MarketTicker />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}