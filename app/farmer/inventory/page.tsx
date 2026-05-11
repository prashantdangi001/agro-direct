import FarmerNavbar from "@/components/layout/FarmerNavbar";
import FarmerSidebar from "@/components/layout/FarmerSidebar";
import InventoryTable from "@/components/farmer/InventoryTable";

export default function InventoryManagementPage() {
  return (
    <div className="bg-background min-h-screen flex flex-col">
      <FarmerNavbar />
      
      <div className="flex flex-1 max-w-[1280px] mx-auto w-full">
        {/* Persistent Farmer Sidebar */}
        <FarmerSidebar />

        {/* Main Content Area */}
        <main className="flex-1 p-6 md:p-10 lg:ml-64">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-on-surface mb-2 tracking-tight">Inventory Management</h1>
              <p className="text-on-surface-variant">Track your stock levels, update pricing, and manage active marketplace listings.</p>
            </div>
            
            {/* Primary Action Button */}
            <button className="bg-primary hover:bg-primary-container text-white px-6 py-3 rounded-lg font-bold shadow-sm transition-all active:scale-95 flex items-center gap-2">
              <span className="material-symbols-outlined">add</span>
              Add New Produce
            </button>
          </div>

          {/* Data Table Component */}
          <InventoryTable />
        </main>
      </div>
    </div>
  );
}