import FarmerNavbar from "@/components/layout/FarmerNavbar";
import StatCard from "@/components/farmer/StatCard";
import ListingsTable from "@/components/farmer/ListingsTable";
import MarketTrends from "@/components/farmer/MarketTrends";
import LogisticsBanner from "@/components/farmer/LogisticsBanner";

export default function FarmerDashboard() {
  return (
    <div className="bg-background min-h-screen">
      <FarmerNavbar />
      
      <main className="max-w-[1280px] mx-auto px-4 md:px-12 py-8">
        {/* Header with High-Intent Action (Warm Amber) */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-on-surface">Dashboard Overview</h1>
            <p className="text-on-surface-variant">Manage your yields and market connections.</p>
          </div>
          <button className="bg-secondary-container hover:bg-secondary text-on-secondary-container hover:text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-all active:scale-95 shadow-sm">
            <span className="material-symbols-outlined filled-icon">add_circle</span>
            Add New Produce
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Content Column */}
          <div className="lg:col-span-8 space-y-6">
            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard title="Active Listings" value="14" trend="+2 this week" icon="inventory_2" />
              <StatCard title="Pending Orders" value="8" subtitle="Awaiting logistics pickup" icon="local_shipping" color="text-secondary" />
              <StatCard title="Total Earnings" value="$4,250" subtitle="Current harvest cycle" icon="payments" />
            </div>

            <ListingsTable />
          </div>

          {/* Sidebar Widgets Column */}
          <div className="lg:col-span-4 space-y-6">
            <MarketTrends />
            <LogisticsBanner />
          </div>
        </div>
      </main>
    </div>
  );
}