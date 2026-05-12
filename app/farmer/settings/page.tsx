import FarmerNavbar from "@/components/layout/FarmerNavbar";
import FarmerSidebar from "@/components/layout/FarmerSidebar";
import ProfileSettingsForm from "@/components/farmer/ProfileSettingsForm";
import BackButton from "@/components/ui/BackButton";

export default function SettingsPage() {
  return (
    <div className="bg-background min-h-screen flex flex-col">
      <FarmerNavbar />
      
      <div className="flex flex-1 max-w-[1280px] mx-auto w-full relative">
        <FarmerSidebar />

        <main className="flex-1 p-6 md:p-10 lg:ml-64 animate-in fade-in duration-300">
            {/* 2. DROP THE BACK BUTTON HERE */}
          <BackButton label="Back to Dashboard" />
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-on-surface mb-2 tracking-tight">Account Settings</h1>
            <p className="text-on-surface-variant">Manage your farm profile, public information, and payment preferences.</p>
          </div>

          <ProfileSettingsForm />
        </main>
      </div>
    </div>
  );
}