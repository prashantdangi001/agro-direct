'use client';
import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function FarmerNavbar() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from('farm_profiles').select('*').eq('id', user.id).single();
      if (data) setProfile(data);
    };
    fetchProfile();

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setIsMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <header className="h-16 bg-surface-container-lowest border-b border-outline-variant flex items-center justify-between px-6 sticky top-0 z-50">
      <Link href="/farmer" className="font-bold text-xl text-primary tracking-tight">AgroDirect</Link>
      <div className="flex items-center gap-4 relative" ref={menuRef}>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="h-9 w-9 rounded-full bg-surface-container-high border-2 border-transparent hover:border-primary transition-all overflow-hidden ml-2 elevation-1">
          <img src={profile?.profile_pic_url || "https://lh3.googleusercontent.com/aida-public/AB6AXuD6dPgaJjE2DEckCIPPBSoJIhLB-dRYtSE6dSt_KmsP9YM4GranUC7B0cUqnzRWjsThRSsraY8GSxis64EWZdMFbox6yHIwskmIozTB1oZIDK4clkJNPZ99d_ZIthWKkIKY7aKfPNz_7TlAe45qdrzXV0s8i3Kvk67pDNqtPSKOhUH-uRNhHdN6-4x9oHn8P8cpyTDs53F_nNdXv2dTJqqXQB_9JZHxK5Pzwu1CyIsg_hT2fdtPVDMStjtR94-gHrhSMyzf0QGiG2Dz"} alt="Profile" className="w-full h-full object-cover" />
        </button>
        {isMenuOpen && (
          <div className="absolute top-12 right-0 mt-2 w-56 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
            <div className="p-4 border-b border-outline-variant">
              <p className="font-bold text-sm text-on-surface truncate">{profile?.farm_name || "New Account"}</p>
              <p className="text-xs text-on-surface-variant truncate">{profile?.location || "Setup Location"}</p>
            </div>
            <div className="p-2 flex flex-col gap-1">
              <Link href="/farmer/settings" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-on-surface-variant hover:text-primary hover:bg-primary/5 rounded-lg transition-colors">
                <span className="material-symbols-outlined text-[18px]">manage_accounts</span> Edit Profile
              </Link>
              <Link href={`/producers/${profile?.id}`} onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-on-surface-variant hover:text-primary hover:bg-primary/5 rounded-lg transition-colors">
                <span className="material-symbols-outlined text-[18px]">storefront</span> View Store
              </Link>
              <div className="h-px bg-outline-variant my-1"></div>
              <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-error hover:bg-error/10 rounded-lg transition-colors w-full text-left">
                <span className="material-symbols-outlined text-[18px]">logout</span> Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}