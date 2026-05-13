'use client'; 
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function MarketplaceNavbar() {
  const { getCartCount } = useCart();
  const cartCount = getCartCount();
  const router = useRouter();

  // User & Menu State
  const [user, setUser] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Check if user is logged in
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
      }
    };
    fetchUser();

    // Close dropdown if clicked outside
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle Image Upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setIsUploading(true);

    try {
      // 1. Upload the file to the 'avatars' bucket
      const fileExt = file.name.split('.').pop();
      const fileName = `buyer-${user.id}-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // 2. Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // 3. Update the user's Supabase metadata with the new image
      const { error: updateError } = await supabase.auth.updateUser({
        data: { profile_pic_url: publicUrl }
      });

      if (updateError) throw updateError;

      // 4. Update local state immediately so the UI changes without refreshing
      setUser({
        ...user,
        user_metadata: { ...user.user_metadata, profile_pic_url: publicUrl }
      });

    } catch (error: any) {
      alert(`Upload failed: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsMenuOpen(false);
    router.refresh(); // Refresh the page to clear states
  };

  const profilePic = user?.user_metadata?.profile_pic_url || "https://ui-avatars.com/api/?name=User&background=random";

  return (
    <header className="sticky top-0 w-full z-50 flex justify-between items-center px-4 md:px-12 py-4 max-w-[1280px] mx-auto bg-surface border-b border-outline-variant shadow-sm">
      <div className="flex items-center gap-4">
        <Link href="/" className="text-2xl font-bold text-primary hover:opacity-80 transition-opacity">
          Khetify
        </Link>
      </div>
      
      <div className="flex-1 max-w-2xl mx-8 hidden md:flex items-center relative">
        <div className="relative w-full">
          <input className="w-full bg-surface-container-low border border-outline-variant rounded-lg py-2 pl-4 pr-12 focus:border-primary focus:ring-1 outline-none" placeholder="Search fresh produce..." type="text" />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <button className="p-2 text-on-surface-variant hover:bg-surface-variant rounded-full"><span className="material-symbols-outlined">mic</span></button>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Link href="/checkout" className="relative p-2 text-primary hover:bg-surface-container-high rounded-full transition-colors">
          <span className="material-symbols-outlined">shopping_cart</span>
          {cartCount > 0 && (
            <span className="absolute top-0 right-0 w-5 h-5 bg-[#ba1a1a] text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-surface animate-in zoom-in">
              {cartCount}
            </span>
          )}
        </Link>

        {/* DYNAMIC AUTH SECTION */}
        {user ? (
          <div className="relative" ref={menuRef}>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="w-10 h-10 rounded-full overflow-hidden border-2 border-outline-variant hover:border-primary transition-all relative group"
            >
              {isUploading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                </div>
              )}
              <img alt="Profile" className="w-full h-full object-cover" src={profilePic} />
            </button>

            {/* DROPDOWN MENU */}
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-outline-variant rounded-xl shadow-lg elevation-2 overflow-hidden animate-in fade-in slide-in-from-top-2 z-50">
                <div className="p-4 border-b border-outline-variant bg-surface-container-lowest">
                  <p className="font-bold text-sm text-on-surface truncate">{user.user_metadata?.full_name || 'Buyer Account'}</p>
                  <p className="text-xs text-on-surface-variant truncate">{user.email}</p>
                </div>
                
                <div className="p-2 flex flex-col gap-1">
                  {/* Hidden File Input mapped to a nice label */}
                  <label className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-on-surface-variant hover:text-primary hover:bg-primary/5 rounded-lg transition-colors cursor-pointer">
                    <span className="material-symbols-outlined text-[18px]">add_a_photo</span>
                    Change Profile Picture
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploading} />
                  </label>
                  
                  <Link href="/buyer/orders" className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-on-surface-variant hover:text-primary hover:bg-primary/5 rounded-lg transition-colors">
                    <span className="material-symbols-outlined text-[18px]">receipt_long</span> My Orders
                  </Link>
                  
                  <div className="h-px bg-outline-variant my-1 mx-2"></div>
                  
                  <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-error hover:bg-error/10 rounded-lg transition-colors w-full text-left">
                    <span className="material-symbols-outlined text-[18px]">logout</span> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link href="/login" className="px-5 py-2 bg-primary text-white text-sm font-bold rounded-lg shadow-sm hover:brightness-110 transition-all">
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
}