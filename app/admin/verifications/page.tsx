import AdminSidebar from "@/components/admin/AdminSidebar";
import VerificationHeader from "@/components/admin/VerificationHeader";
import VerificationTable from "@/components/admin/VerificationTable";
import VerificationStats from "@/components/admin/VerificationStats";

export default function VerificationsPage() {
  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col md:flex-row">
      {/* Reuse the existing sidebar */}
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        <VerificationHeader />
        
        <main className="p-4 md:p-12 space-y-8 flex-1 max-w-[1400px] mx-auto w-full">
          <VerificationTable />
          <VerificationStats />
        </main>
      </div>
    </div>
  );
}