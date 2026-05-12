'use client';
import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function FarmerNavbar() {
  const router = useRouter();
  const [unreadCount, setUnreadCount] = useState(0);
  const [popupNotification, setPopupNotification] = useState<any | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

 useEffect(() => {
    let orderChannel: any;
    let profileChannel: any;
    let isMounted = true;

    const setupRealtime = async () => {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user || !isMounted) return;

      const { data } = await supabase.from('farm_profiles').select('*').eq('id', authData.user.id).single();
      if (data && isMounted) setProfile(data);

      // BULLETPROOF FIX: We listen to ALL new orders, and filter them using JavaScript instead of Postgres!
      orderChannel = supabase.channel(`order-alerts-${Date.now()}`)
        .on('postgres_changes', { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'orders' 
        }, (payload) => {
          
          // JS-SIDE FILTER: Does this new order belong to ME?
          if (payload.new.farmer_id === authData.user.id) {
            setUnreadCount((prev) => prev + 1);
            setPopupNotification(payload.new);
            setTimeout(() => setPopupNotification(null), 5000);
          }

        })
        .subscribe();
    };

    setupRealtime();

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setIsMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => { 
      isMounted = false;
      if (orderChannel) supabase.removeChannel(orderChannel);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/'); 
  };

  return (
    <>
      <header className="h-16 bg-surface-container-lowest border-b border-outline-variant flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button className="md:hidden text-on-surface-variant hover:bg-surface-container p-2 rounded-lg transition-colors">
            <span className="material-symbols-outlined">menu</span>
          </button>
          <Link href="/farmer" className="font-bold text-xl text-primary tracking-tight">
            Khetify
          </Link>
        </div>

        <div className="flex items-center gap-2 md:gap-4 relative" ref={menuRef}>
          <button onClick={() => setUnreadCount(0)} className="relative p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors">
            <span className="material-symbols-outlined">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-error text-[9px] font-bold text-white ring-2 ring-white animate-in zoom-in">
                {unreadCount}
              </span>
            )}
          </button>

          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="h-9 w-9 rounded-full bg-surface-container-high border-2 border-transparent hover:border-primary transition-all overflow-hidden ml-2 elevation-1"
          >
            <img 
              src={profile?.profile_pic_url || "https://lh3.googleusercontent.com/aida-public/AB6AXuD6dPgaJjE2DEckCIPPBSoJIhLB-dRYtSE6dSt_KmsP9YM4GranUC7B0cUqnzRWjsThRSsraY8GSxis64EWZdMFbox6yHIwskmIozTB1oZIDK4clkJNPZ99d_ZIthWKkIKY7aKfPNz_7TlAe45qdrzXV0s8i3Kvk67pDNqtPSKOhUH-uRNhHdN6-4x9oHn8P8cpyTDs53F_nNdXv2dTJqqXQB_9JZHxK5Pzwu1CyIsg_hT2fdtPVDMStjtR94-gHrhSMyzf0QGiG2Dz"} 
              alt="Profile" 
              className="w-full h-full object-cover" 
            />
          </button>

          {isMenuOpen && (
            <div className="absolute top-12 right-0 mt-2 w-56 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg elevation-2 overflow-hidden animate-in fade-in slide-in-from-top-2 z-50">
              <div className="p-4 border-b border-outline-variant bg-surface-container-lowest">
                <p className="font-bold text-sm text-on-surface truncate">{profile?.farm_name || "Farmer Account"}</p>
                <p className="text-xs text-on-surface-variant truncate">{profile?.location || "No location set"}</p>
              </div>
              <div className="p-2 flex flex-col gap-1">
                <Link href="/farmer/settings" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-on-surface-variant hover:text-primary hover:bg-primary/5 rounded-lg transition-colors">
                  <span className="material-symbols-outlined text-[18px]">manage_accounts</span> Edit Profile
                </Link>
                <Link href={profile?.id ? `/producers/${profile.id}` : '#'} onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-on-surface-variant hover:text-primary hover:bg-primary/5 rounded-lg transition-colors">
                  <span className="material-symbols-outlined text-[18px]">storefront</span> View Public Store
                </Link>
                <div className="h-px bg-outline-variant my-1 mx-2"></div>
                <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-error hover:bg-error/10 rounded-lg transition-colors w-full text-left">
                  <span className="material-symbols-outlined text-[18px]">logout</span> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* THE REALTIME POPUP TOAST */}
      {popupNotification && (
        <div className="fixed bottom-6 right-6 z-[100] animate-in slide-in-from-bottom-8 fade-in duration-500 max-w-sm w-full">
          <div className="bg-surface-container-lowest border border-primary/20 shadow-lg rounded-xl p-4 elevation-2 flex gap-4 items-start relative overflow-hidden group cursor-pointer" onClick={() => setPopupNotification(null)}>
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
            <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center shrink-0 text-primary">
              <span className="material-symbols-outlined">local_mall</span>
            </div>
            <div className="flex-1 pt-1">
              <h4 className="font-bold text-on-surface text-sm mb-0.5 flex justify-between">
                New Order Received! <span className="text-xs font-bold text-primary">Just now</span>
              </h4>
              <p className="text-xs text-on-surface-variant font-medium mb-2 leading-relaxed">
                You received an order for delivery to <span className="font-bold text-on-surface">{popupNotification.delivery_address}</span>.
              </p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm font-bold text-primary tracking-tight">INR {Number(popupNotification.total_amount).toFixed(2)}</span>
                <Link href="/farmer/orders" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                  View Details <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
                </Link>
              </div>
            </div>
            <button onClick={() => setPopupNotification(null)} className="absolute top-2 right-2 text-on-surface-variant/50 hover:text-on-surface-variant transition-colors p-1">
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}