'use client'; 
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, usePathname } from 'next/navigation'; 
import { useLanguage } from '@/context/LanguageContext'; 

export default function MarketplaceNavbar() {
  const { getCartCount } = useCart();
  const cartCount = getCartCount();
  const router = useRouter();
  const pathname = usePathname(); 
  
  const { locale, setLocale, t } = useLanguage(); 

  const [user, setUser] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // ✨ THE FIX: Check if we are on the landing page
  const isLandingPage = pathname === '/';

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
      }
    };
    fetchUser();

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setIsUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `avatar-${user.id}-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(fileName);

      const { error: updateError } = await supabase.auth.updateUser({
        data: { profile_pic_url: publicUrl }
      });
      if (updateError) throw updateError;

      setUser({ ...user, user_metadata: { ...user.user_metadata, profile_pic_url: publicUrl } });
    } catch (error: any) {
      alert(`Upload failed: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsMenuOpen(false);
    router.push('/');
  };

  const profilePic = user?.user_metadata?.profile_pic_url || "https://ui-avatars.com/api/?name=User&background=random";

  return (
    <header className="sticky top-0 w-full z-50 flex justify-between items-center px-4 md:px-12 py-4 max-w-[1280px] mx-auto bg-surface border-b border-outline-variant shadow-sm transition-all duration-300">
      
      {/* 1. LOGO */}
      <div className="flex items-center gap-4">
        <Link href="/" className="text-2xl font-bold text-primary hover:opacity-80 transition-opacity">
          Khetify
        </Link>
      </div>
      
      {/* 2. SEARCH BAR (Hidden on Landing Page) */}
      {!isLandingPage && (
        <div className="flex-1 max-w-2xl mx-8 hidden md:flex items-center relative animate-in fade-in">
          <div className="relative w-full">
            <input className="w-full bg-surface-container-low border border-outline-variant rounded-lg py-2 pl-4 pr-12 focus:border-primary focus:ring-1 outline-none transition-all" placeholder={t('nav_search')} type="text" />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <button className="p-2 text-on-surface-variant hover:bg-surface-variant rounded-full"><span className="material-symbols-outlined">mic</span></button>
            </div>
          </div>
        </div>
      )}

      {/* 3. RIGHT SIDE CONTROLS */}
      <div className="flex items-center gap-4 ml-auto">
        
        {/* Language Toggle */}
        <div className="bg-surface-container-low border border-outline-variant rounded-full p-1 flex items-center shadow-sm">
          <button onClick={() => setLocale('en')} className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${locale === 'en' ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}>EN</button>
          <button onClick={() => setLocale('hi')} className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${locale === 'hi' ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}>HI</button>
        </div>

        {/* CART (Hidden on Landing Page) */}
        {!isLandingPage && (
          <Link href="/checkout" className="relative p-2 text-primary hover:bg-surface-container-high rounded-full transition-colors animate-in fade-in">
            <span className="material-symbols-outlined">shopping_cart</span>
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 w-5 h-5 bg-[#ba1a1a] text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-surface animate-in zoom-in">
                {cartCount}
              </span>
            )}
          </Link>
        )}

        {/* USER PROFILE OR SIGN IN BUTTON */}
        {user ? (
          <div className="relative" ref={menuRef}>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="w-10 h-10 rounded-full overflow-hidden border-2 border-outline-variant hover:border-primary transition-all relative group">
              {isUploading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                </div>
              )}
              <img alt="Profile" className="w-full h-full object-cover" src={profilePic} />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-outline-variant rounded-xl shadow-lg elevation-2 overflow-hidden animate-in fade-in slide-in-from-top-2 z-50">
                <div className="p-4 border-b border-outline-variant bg-surface-container-lowest">
                  <p className="font-bold text-sm text-on-surface truncate">{user.user_metadata?.full_name || 'Account'}</p>
                  <p className="text-xs text-on-surface-variant truncate">{user.email}</p>
                </div>
                <div className="p-2 flex flex-col gap-1">
                  <label className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-on-surface-variant hover:text-primary hover:bg-primary/5 rounded-lg transition-colors cursor-pointer">
                    <span className="material-symbols-outlined text-[18px]">add_a_photo</span> Profile Picture
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploading} />
                  </label>
                  
                  {user.user_metadata?.role === 'admin' ? (
                    <Link href="/admin" className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-on-surface-variant hover:text-primary hover:bg-primary/5 rounded-lg transition-colors">
                      <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span> Admin Panel
                    </Link>
                  ) : user.user_metadata?.role === 'farmer' ? (
                    <Link href="/farmer" className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-on-surface-variant hover:text-primary hover:bg-primary/5 rounded-lg transition-colors">
                      <span className="material-symbols-outlined text-[18px]">dashboard</span> Dashboard
                    </Link>
                  ) : (
                    <Link href="/buyer/orders" className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-on-surface-variant hover:text-primary hover:bg-primary/5 rounded-lg transition-colors">
                      <span className="material-symbols-outlined text-[18px]">receipt_long</span> My Orders
                    </Link>
                  )}
                  
                  <div className="h-px bg-outline-variant my-1 mx-2"></div>
                  <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-error hover:bg-error/10 rounded-lg transition-colors w-full text-left">
                    <span className="material-symbols-outlined text-[18px]">logout</span> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          !['/login', '/register'].includes(pathname) && (
            <Link href="/login" className="px-5 py-2 bg-primary text-white text-sm font-bold rounded-lg shadow-sm hover:brightness-110 transition-all">
              {t('nav_signin')}
            </Link>
          )
        )}
      </div>
    </header>
  );
}