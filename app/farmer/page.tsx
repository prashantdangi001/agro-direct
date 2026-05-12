import FarmerNavbar from "@/components/layout/FarmerNavbar";
import FarmerSidebar from "@/components/layout/FarmerSidebar";
import DashboardStats from "@/components/farmer/DashboardStats";
import MarketTrends from "@/components/farmer/MarketTrends";
import LogisticsBanner from "@/components/farmer/LogisticsBanner";
import Link from "next/link";

export default function FarmerDashboard() {
  return (
    <div className="bg-background min-h-screen flex flex-col">
      <FarmerNavbar />
      
      <div className="flex flex-1 max-w-[1280px] mx-auto w-full relative">
        <FarmerSidebar />

        <main className="flex-1 p-6 md:p-10 lg:ml-64 animate-in fade-in duration-300">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-on-surface mb-2 tracking-tight">Dashboard Overview</h1>
              <p className="text-on-surface-variant">Welcome back, Green Valley Farm. Here is what is happening today.</p>
            </div>
            <Link 
              href="/farmer/add-listing"
              className="bg-primary text-white px-6 py-3 rounded-lg font-bold shadow-sm hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined">add</span>
              New Listing
            </Link>
          </div>

          {/* 1. Dynamic Top Stats */}
          <DashboardStats />

          {/* 2. Middle Grid: Chart & Ticker/Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left 2/3: Market Trends Chart */}
            <div className="lg:col-span-2">
              <MarketTrends />
            </div>

            {/* Right 1/3: Quick Actions / Market Ticker */}
            <div className="space-y-6 flex flex-col">
              <div className="bg-surface-container-lowest p-6 rounded-lg border border-outline-variant elevation-1 flex-1">
                <h3 className="text-lg font-bold text-on-surface mb-4 border-b border-outline-variant pb-2">Market Commodity Prices</h3>
                <div className="space-y-4">
                  {[
                    { crop: "Red Onions", price: "INR 85/kg", trend: "+2.4%", isUp: true },
                    { crop: "Yellow Maize", price: "INR 3,200/bag", trend: "-1.2%", isUp: false },
                    { crop: "Roma Tomatoes", price: "INR 120/kg", trend: "+5.0%", isUp: true }
                  ].map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 hover:bg-surface-container-low rounded-lg transition-colors cursor-default">
                      <span className="font-bold text-on-surface text-sm">{item.crop}</span>
                      <div className="text-right">
                        <span className="block text-sm font-bold text-on-surface-variant">{item.price}</span>
                        <span className={`text-[10px] font-bold ${item.isUp ? 'text-primary' : 'text-error'}`}>
                          {item.isUp ? '▲' : '▼'} {item.trend}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* 3. Logistics Alert Banner */}
          <LogisticsBanner />

        </main>
      </div>
    </div>
  );
}