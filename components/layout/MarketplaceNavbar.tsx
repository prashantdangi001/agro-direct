'use client'; 
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, usePathname } from 'next/navigation'; 
import { useLanguage } from '@/context/LanguageContext'; 
import { Language } from '@/utils/translations';

export default function MarketplaceNavbar() {
  const { getCartCount } = useCart();
  const cartCount = getCartCount();
  const router = useRouter();
  const pathname = usePathname(); 
  const { locale, setLocale, t } = useLanguage(); 

  const [user, setUser] = useState<any>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  
  const userMenuRef = useRef<HTMLDivElement>(null);
  const langMenuRef = useRef<HTMLDivElement>(null);

  // ✨ THE SQUEEZE PAGE CHECK ✨
  const isLandingPage = pathname === '/';

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) setUser(session.user);
    };
    fetchUser();

    // Close dropdowns if clicked outside
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setIsLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsUserMenuOpen(false);
    router.push('/');
  };

  const profilePic = user?.user_metadata?.profile_pic_url || "https://ui-avatars.com/api/?name=User&background=random";

  // Helper to get display name for current language
  const getLangDisplayName = (code: string) => {
    switch(code) {
      case 'en': return 'ENG';
      case 'hi': return 'HINDI';
      case 'pa': return 'PUNJABI';
      case 'mr': return 'MARATHI';
      default: return 'ENG';
    }
  };

  return (
    <header className="sticky top-0 w-full z-50 flex justify-between items-center px-4 md:px-12 py-4 max-w-[1280px] mx-auto bg-surface border-b border-outline-variant shadow-sm transition-all duration-300">
      
      {/* 1. LOGO (Always visible, Top Left) */}
      <div className="flex items-center gap-4">
        <Link href="/" className="text-3xl font-black tracking-tight text-primary hover:opacity-80 transition-opacity">
          KHETIFY
        </Link>
      </div>

      {/* --- CONDITIONAL RENDERING STARTS HERE --- */}
      
      {isLandingPage ? (
        
        /* 🔥 LANDING PAGE MODE (Minimalistic Squeeze Header) 🔥 */
        <div className="flex items-center gap-4 ml-auto" ref={langMenuRef}>
          <div className="relative">
            <button 
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)} 
              className="flex items-center gap-2 px-4 py-2 border-2 border-outline-variant rounded-xl hover:border-primary hover:text-primary transition-all text-sm font-bold text-on-surface bg-surface shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">translate</span>
              {getLangDisplayName(locale)}
              <span className="material-symbols-outlined text-[20px] transition-transform duration-200" style={{ transform: isLangMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>expand_more</span>
            </button>

            {isLangMenuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-outline-variant rounded-xl shadow-lg py-2 z-50 animate-in fade-in slide-in-from-top-2">
                {(['en', 'hi', 'pa', 'mr'] as Language[]).map((lang) => (
                  <button 
                    key={lang} 
                    onClick={() => { setLocale(lang); setIsLangMenuOpen(false); }} 
                    className={`w-full text-left px-5 py-2.5 text-sm font-bold hover:bg-surface-container-low transition-colors flex items-center justify-between ${locale === lang ? 'text-primary bg-primary/5' : 'text-on-surface-variant'}`}
                  >
                    {getLangDisplayName(lang)}
                    {locale === lang && <span className="material-symbols-outlined text-[16px]">check</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

      ) : (

        /* 🛒 MARKETPLACE MODE (Full Feature Header) 🛒 */
        <>
          {/* SEARCH BAR */}
          <div className="flex-1 max-w-2xl mx-8 hidden md:flex items-center relative animate-in fade-in">
            <div className="relative w-full">
              <input className="w-full bg-surface-container-low border border-outline-variant rounded-lg py-2 pl-4 pr-12 focus:border-primary focus:ring-1 outline-none transition-all" placeholder={t('nav_search')} type="text" />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <button className="p-2 text-on-surface-variant hover:bg-surface-variant rounded-full"><span className="material-symbols-outlined">mic</span></button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            
            {/* COMPACT LANGUAGE DROPDOWN FOR APP */}
            <div className="relative" ref={langMenuRef}>
              <button onClick={() => setIsLangMenuOpen(!isLangMenuOpen)} className="flex items-center gap-1 p-2 rounded-full hover:bg-surface-container-low transition-colors text-on-surface-variant">
                <span className="material-symbols-outlined">translate</span>
              </button>
              {isLangMenuOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white border border-outline-variant rounded-xl shadow-lg py-2 z-50 animate-in fade-in zoom-in-95">
                  {(['en', 'hi', 'pa', 'mr'] as Language[]).map((lang) => (
                    <button key={lang} onClick={() => { setLocale(lang); setIsLangMenuOpen(false); }} className={`w-full text-left px-4 py-2 text-sm font-bold hover:bg-surface-container-low ${locale === lang ? 'text-primary' : 'text-on-surface-variant'}`}>
                      {getLangDisplayName(lang)}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* CART */}
            <Link href="/checkout" className="relative p-2 text-primary hover:bg-surface-container-high rounded-full transition-colors animate-in fade-in">
              <span className="material-symbols-outlined">shopping_cart</span>
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-[#ba1a1a] text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-surface animate-in zoom-in">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* USER PROFILE OR SIGN IN */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="w-10 h-10 rounded-full overflow-hidden border-2 border-outline-variant hover:border-primary transition-all relative group">
                  <img alt="Profile" className="w-full h-full object-cover" src={profilePic} />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white border border-outline-variant rounded-xl shadow-lg elevation-2 overflow-hidden animate-in fade-in slide-in-from-top-2 z-50">
                    <div className="p-4 border-b border-outline-variant bg-surface-container-lowest">
                      <p className="font-bold text-sm text-on-surface truncate">{user.user_metadata?.full_name || 'Account'}</p>
                      <p className="text-xs text-on-surface-variant truncate">{user.email}</p>
                    </div>
                    <div className="p-2 flex flex-col gap-1">
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
        </>
      )}
    </header>
  );
}