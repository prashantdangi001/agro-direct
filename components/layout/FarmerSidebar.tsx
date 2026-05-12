'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function FarmerSidebar() {
  const pathname = usePathname();
  const [profile, setProfile] = useState<any>(null);

  const isActive = (path: string) => pathname === path;

  useEffect(() => {
    const fetchProfile = async () => {
      // Get real user
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) return;

      // Fetch real profile
      const { data } = await supabase
        .from('farm_profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();
        
      if (data) setProfile(data);
    };

    fetchProfile();

    const channel = supabase.channel('sidebar-profile-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'farm_profiles' }, () => fetchProfile())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <aside className="hidden md:flex flex-col py-6 gap-2 bg-surface-container-low h-[calc(100vh-64px)] w-64 fixed left-0 top-16 border-r border-outline-variant z-40">
      <div className="px-6 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-container overflow-hidden border border-outline-variant elevation-1">
            <img 
              alt="Farmer Profile" 
              className="w-full h-full object-cover" 
              src={profile?.profile_pic_url || "https://lh3.googleusercontent.com/aida-public/AB6AXuD6dPgaJjE2DEckCIPPBSoJIhLB-dRYtSE6dSt_KmsP9YM4GranUC7B0cUqnzRWjsThRSsraY8GSxis64EWZdMFbox6yHIwskmIozTB1oZIDK4clkJNPZ99d_ZIthWKkIKY7aKfPNz_7TlAe45qdrzXV0s8i3Kvk67pDNqtPSKOhUH-uRNhHdN6-4x9oHn8P8cpyTDs53F_nNdXv2dTJqqXQB_9JZHxK5Pzwu1CyIsg_hT2fdtPVDMStjtR94-gHrhSMyzf0QGiG2Dz"} 
            />
          </div>
          <div className="overflow-hidden">
            <p className="text-sm text-on-surface font-bold truncate">
              {profile?.farm_name || "New Farm Profile"}
            </p>
            <p className="text-[11px] font-bold text-primary flex items-center gap-1 uppercase tracking-widest mt-0.5">
              <span className="material-symbols-outlined text-[12px] filled-icon">verified</span>
              {profile?.verification_status === 'Verified' ? 'Verified' : 'Pending'}
            </p>
          </div>
        </div>
      </div>

      <nav className="flex flex-col gap-1 overflow-y-auto">
        <Link href="/farmer" className={`flex items-center gap-3 px-4 py-3 mx-2 transition-all active:scale-95 rounded-lg ${isActive('/farmer') ? 'bg-primary-container text-on-primary-container shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'}`}>
          <span className="material-symbols-outlined">dashboard</span>
          <span className="text-sm font-bold">Dashboard</span>
        </Link>
        <Link href="/farmer/add-listing" className={`flex items-center gap-3 px-4 py-3 mx-2 transition-all active:scale-95 rounded-lg ${isActive('/farmer/add-listing') ? 'bg-primary-container text-on-primary-container shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'}`}>
          <span className="material-symbols-outlined">add_box</span>
          <span className="text-sm font-bold">Add Listing</span>
        </Link>
        <Link href="/farmer/inventory" className={`flex items-center gap-3 px-4 py-3 mx-2 transition-all active:scale-95 rounded-lg ${isActive('/farmer/inventory') ? 'bg-primary-container text-on-primary-container shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'}`}>
          <span className="material-symbols-outlined">inventory_2</span>
          <span className="text-sm font-bold">Manage Stock</span>
        </Link>
        <Link href="/farmer/orders" className={`flex items-center gap-3 px-4 py-3 mx-2 transition-all active:scale-95 rounded-lg ${isActive('/farmer/orders') ? 'bg-primary-container text-on-primary-container shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'}`}>
          <span className="material-symbols-outlined">receipt_long</span>
          <span className="text-sm font-bold">Order History</span>
        </Link>
        <Link href="/farmer/settings" className={`flex items-center gap-3 px-4 py-3 mx-2 transition-all active:scale-95 rounded-lg ${isActive('/farmer/settings') ? 'bg-primary-container text-on-primary-container shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'}`}>
          <span className="material-symbols-outlined">settings</span>
          <span className="text-sm font-bold">Settings</span>
        </Link>
      </nav>

      <div className="mt-auto px-4 pb-6">
        <button className="w-full bg-secondary-container text-on-secondary-container hover:bg-secondary hover:text-white py-3 rounded-lg text-sm font-bold transition-all active:scale-95 shadow-sm">
          Upgrade to Pro
        </button>
      </div>
    </aside>
  );
}