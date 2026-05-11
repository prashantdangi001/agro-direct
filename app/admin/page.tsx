import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminStats from "@/components/admin/AdminStats";
import AdminVolumeChart from "@/components/admin/AdminVolumeChart";
import AdminPendingVerifications from "@/components/admin/AdminPendingVerifications";

export default function AdminDashboard() {
  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col md:flex-row">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader />
        
        <main className="p-4 md:p-12 space-y-6 flex-1">
          <AdminStats />
          <AdminVolumeChart />
          <AdminPendingVerifications />
        </main>
      </div>
    </div>
  );
}