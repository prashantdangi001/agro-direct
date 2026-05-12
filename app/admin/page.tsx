import AdminNavbar from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminStats from "@/components/admin/AdminStats";
import VerificationTable from "@/components/admin/VerificationTable";

export default function AdminDashboard() {
  return (
    <div className="bg-background min-h-screen flex flex-col">
      <AdminNavbar />
      
      <div className="flex flex-1 max-w-[1440px] mx-auto w-full relative">
        <AdminSidebar />

        <main className="flex-1 p-6 md:p-10 lg:ml-64 animate-in fade-in duration-300">
          <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <h1 className="text-3xl font-bold text-on-surface mb-2 tracking-tight">Platform Governance</h1>
              <p className="text-on-surface-variant">Monitor marketplace health, verify producers, and manage platform disputes.</p>
            </div>
            <button className="bg-surface-container-high text-on-surface border border-outline-variant px-6 py-2 rounded-lg font-bold shadow-sm hover:bg-surface-container-highest transition-all flex items-center gap-2">
              <span className="material-symbols-outlined">download</span>
              Export Compliance Report
            </button>
          </div>

          {/* High-level platform stats */}
          <AdminStats />

          <div className="mt-8">
            <h2 className="text-xl font-bold text-on-surface mb-4">Pending Farm Verifications</h2>
            {/* The interactive verification table */}
            <VerificationTable />
          </div>
        </main>
      </div>
    </div>
  );
}