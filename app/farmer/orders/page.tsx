import FarmerNavbar from "@/components/layout/FarmerNavbar";
import FarmerSidebar from "@/components/layout/FarmerSidebar";
import OrderHistoryTable from "@/components/farmer/OrderHistoryTable";

export default function OrderHistoryPage() {
  return (
    <div className="bg-background min-h-screen flex flex-col">
      <FarmerNavbar />
      
      <div className="flex flex-1 max-w-[1280px] mx-auto w-full">
        <FarmerSidebar />

        <main className="flex-1 p-6 md:p-10 lg:ml-64">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-on-surface mb-2 tracking-tight">Incoming Orders</h1>
            <p className="text-on-surface-variant">Track new wholesale orders, manage fulfillment, and update shipping statuses.</p>
          </div>

          <OrderHistoryTable />
        </main>
      </div>
    </div>
  );
}