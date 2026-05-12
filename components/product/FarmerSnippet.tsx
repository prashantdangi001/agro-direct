'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function FarmerSnippet({ farmerId }: { farmerId: string }) {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    async function fetchFarmer() {
      if (!farmerId) return;
      const { data } = await supabase
        .from('farm_profiles')
        .select('*')
        .eq('id', farmerId)
        .single();
        
      if (data) setProfile(data);
    }
    fetchFarmer();
  }, [farmerId]);

  // Show a loading skeleton while fetching
  if (!profile) {
    return <div className="bg-surface-container border border-outline-variant rounded-xl p-6 h-48 animate-pulse"></div>;
  }

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 elevation-1">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 shrink-0 rounded-full bg-surface-container-high overflow-hidden border border-outline-variant">
          <img 
            src={profile.profile_pic_url || "https://lh3.googleusercontent.com/aida-public/AB6AXuD6dPgaJjE2DEckCIPPBSoJIhLB-dRYtSE6dSt_KmsP9YM4GranUC7B0cUqnzRWjsThRSsraY8GSxis64EWZdMFbox6yHIwskmIozTB1oZIDK4clkJNPZ99d_ZIthWKkIKY7aKfPNz_7TlAe45qdrzXV0s8i3Kvk67pDNqtPSKOhUH-uRNhHdN6-4x9oHn8P8cpyTDs53F_nNdXv2dTJqqXQB_9JZHxK5Pzwu1CyIsg_hT2fdtPVDMStjtR94-gHrhSMyzf0QGiG2Dz"} 
            alt={profile.farm_name} 
            className="w-full h-full object-cover" 
          />
        </div>
        <div className="overflow-hidden">
          <h3 className="font-bold text-lg text-on-surface flex items-center gap-1 truncate">
            {profile.farm_name || "Khetify Producer"}
            {profile.verification_status === 'Verified' && (
              <span className="material-symbols-outlined text-primary text-[18px] filled-icon shrink-0">verified</span>
            )}
          </h3>
          <div className="flex items-center gap-1 text-sm text-on-surface-variant font-medium truncate">
            <span className="material-symbols-outlined text-[16px] text-primary shrink-0">location_on</span>
            <span className="truncate">{profile.location || "Location pending"}</span>
          </div>
        </div>
      </div>
      
      <p className="text-sm text-on-surface-variant mb-6 leading-relaxed line-clamp-3">
        {profile.about || "This producer has not added a description to their farm profile yet."}
      </p>
      
      {/* THE FIX: Dynamic Link to their actual profile! */}
      <Link 
        href={`/producers/${farmerId}`}
        className="w-full py-3 border-2 border-primary text-primary font-bold rounded-lg hover:bg-primary/5 transition-colors flex items-center justify-center gap-2 block text-center active:scale-95"
      >
        View Full Profile
      </Link>
    </div>
  );
}