'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import MarketplaceNavbar from '@/components/layout/MarketplaceNavbar';
import ProducerSidebar from '@/components/producer/ProducerSidebar';
import ProductCard from '@/components/marketplace/ProductCard';

export default function ProducerProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [farmProducts, setFarmProducts] = useState<any[]>([]);
  const [isFollowed, setIsFollowed] = useState(false);

  const fetchData = async () => {
    // 1. Fetch the Farm Profile
    const { data: profileData } = await supabase.from('farm_profiles').select('*').eq('id', 'demo-farm').single();
    if (profileData) setProfile(profileData);

    // 2. Fetch the Farm's Products (Just grabbing the latest 3 for the demo)
    const { data: productData } = await supabase.from('products').select('*').limit(3).order('created_at', { ascending: false });
    if (productData) setFarmProducts(productData);
  };

  useEffect(() => {
    fetchData();

    // Check if user already follows this farm in LocalStorage
    const followedFarms = JSON.parse(localStorage.getItem('followedFarms') || '[]');
    setIsFollowed(followedFarms.includes('demo-farm'));

    // Realtime Listener for Profile Updates
    const channel = supabase.channel('profile-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'farm_profiles' }, () => fetchData())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  // Handle the Follow Button Click
  const toggleFollow = () => {
    let followedFarms = JSON.parse(localStorage.getItem('followedFarms') || '[]');
    
    if (isFollowed) {
      followedFarms = followedFarms.filter((id: string) => id !== 'demo-farm');
    } else {
      followedFarms.push('demo-farm');
    }
    
    localStorage.setItem('followedFarms', JSON.stringify(followedFarms));
    setIsFollowed(!isFollowed);
    
    // Dispatch an event so the marketplace tab updates instantly!
    window.dispatchEvent(new Event('storage'));
  };

  if (!profile) return (
    <div className="min-h-screen bg-background flex flex-col">
      <MarketplaceNavbar />
      <div className="flex-1 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-surface-container-high border-t-primary rounded-full animate-spin"></div>
      </div>
    </div>
  );

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <MarketplaceNavbar />
      <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 md:px-12 py-8 animate-in fade-in duration-500">
        
        {/* --- DYNAMIC HERO SECTION --- */}
        <div className="relative rounded-2xl overflow-hidden bg-white border border-outline-variant elevation-1 mb-8">
          <div className="h-48 md:h-64 w-full bg-surface-container-high relative">
            <img src={profile.cover_photo_url || "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200&auto=format&fit=crop"} className="w-full h-full object-cover" alt="Farm Cover" />
          </div>
          <div className="px-6 md:px-10 pb-8 pt-20 md:pt-24 relative">
            <div className="absolute -top-16 md:-top-20 left-6 md:left-10 w-32 h-32 md:w-40 md:h-40 bg-white rounded-full p-2 elevation-2 border border-outline-variant">
              <img src={profile.profile_pic_url || "https://lh3.googleusercontent.com/aida-public/AB6AXuD6dPgaJjE2DEckCIPPBSoJIhLB-dRYtSE6dSt_KmsP9YM4GranUC7B0cUqnzRWjsThRSsraY8GSxis64EWZdMFbox6yHIwskmIozTB1oZIDK4clkJNPZ99d_ZIthWKkIKY7aKfPNz_7TlAe45qdrzXV0s8i3Kvk67pDNqtPSKOhUH-uRNhHdN6-4x9oHn8P8cpyTDs53F_nNdXv2dTJqqXQB_9JZHxK5Pzwu1CyIsg_hT2fdtPVDMStjtR94-gHrhSMyzf0QGiG2Dz"} className="w-full h-full rounded-full object-cover" alt="Profile" />
            </div>
            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-3xl font-bold text-on-surface tracking-tight">{profile.farm_name}</h1>
                  <span className="material-symbols-outlined text-primary filled-icon text-[24px]">verified</span>
                </div>
                <p className="text-on-surface-variant font-medium flex items-center gap-1">
                  <span className="material-symbols-outlined text-[18px]">location_on</span> {profile.location}
                </p>
              </div>
              <div className="flex gap-3 w-full md:w-auto">
                <button className="flex-1 md:flex-none px-6 py-3 border border-outline-variant text-on-surface font-bold rounded-lg hover:bg-surface-container transition-colors flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">chat</span> Message
                </button>
                
                {/* THE FOLLOW BUTTON */}
                <button 
                  onClick={toggleFollow}
                  className={`flex-1 md:flex-none px-6 py-3 font-bold rounded-lg shadow-sm flex items-center justify-center gap-2 transition-all active:scale-95 ${
                    isFollowed 
                      ? 'bg-surface-container-high text-on-surface border border-outline-variant' 
                      : 'bg-primary text-white hover:brightness-110'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {isFollowed ? 'person_check' : 'person_add'}
                  </span>
                  {isFollowed ? 'Following' : 'Follow Farm'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 md:p-8 elevation-1">
              <div className="flex gap-8 border-b border-outline-variant mb-8 overflow-x-auto hide-scrollbar">
                <button className="text-primary font-bold border-b-2 border-primary pb-3 whitespace-nowrap">Overview</button>
                <button className="text-on-surface-variant font-medium hover:text-primary transition-colors pb-3 whitespace-nowrap">Products ({farmProducts.length})</button>
              </div>

              <div className="space-y-10">
                <section>
                  <h3 className="text-xl font-bold text-on-surface mb-3">About Us</h3>
                  <p className="text-on-surface-variant leading-relaxed text-[15px]">{profile.about}</p>
                </section>

                <section>
                  <h3 className="text-xl font-bold text-on-surface mb-4">Farming Practices</h3>
                  <div className="flex flex-wrap gap-3">
                    {profile.practices.split(',').map((practice: string, i: number) => (
                      <span key={i} className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container border border-outline-variant text-sm font-bold text-on-surface-variant">
                        <span className="material-symbols-outlined text-primary text-[18px]">eco</span>
                        {practice.trim()}
                      </span>
                    ))}
                  </div>
                </section>

                {/* THE NEW: Other Products Section */}
                <section className="pt-8 border-t border-outline-variant">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-on-surface">Currently Harvesting</h3>
                    <button className="text-primary font-bold text-sm hover:underline">View All</button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {farmProducts.map((product) => (
                      <ProductCard 
                        key={product.id}
                        id={product.id}
                        name={product.name}
                        farm={profile.farm_name} 
                        price={`KES ${product.price.toFixed(2)}`}
                        unit={product.unit}
                        image={product.image_url || "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?q=80&w=600&auto=format&fit=crop"} 
                      />
                    ))}
                  </div>
                </section>

              </div>
            </div>
          </div>

          <div className="space-y-6 relative">
            <div className="sticky top-28">
              <ProducerSidebar />
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}