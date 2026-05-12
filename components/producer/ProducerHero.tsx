export default function ProducerHero() {
  return (
    <div className="relative rounded-2xl overflow-hidden bg-white border border-outline-variant elevation-1">
      {/* Cover Image */}
      <div className="h-48 md:h-64 w-full bg-surface-container-high relative">
        <img 
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200&auto=format&fit=crop" 
          className="w-full h-full object-cover" 
          alt="Farm Cover" 
        />
      </div>
      
      {/* Profile Details Container */}
      <div className="px-6 md:px-10 pb-8 pt-20 md:pt-24 relative">
        {/* Floating Profile Picture */}
        <div className="absolute -top-16 md:-top-20 left-6 md:left-10 w-32 h-32 md:w-40 md:h-40 bg-white rounded-full p-2 elevation-2 border border-outline-variant">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6dPgaJjE2DEckCIPPBSoJIhLB-dRYtSE6dSt_KmsP9YM4GranUC7B0cUqnzRWjsThRSsraY8GSxis64EWZdMFbox6yHIwskmIozTB1oZIDK4clkJNPZ99d_ZIthWKkIKY7aKfPNz_7TlAe45qdrzXV0s8i3Kvk67pDNqtPSKOhUH-uRNhHdN6-4x9oHn8P8cpyTDs53F_nNdXv2dTJqqXQB_9JZHxK5Pzwu1CyIsg_hT2fdtPVDMStjtR94-gHrhSMyzf0QGiG2Dz" 
            className="w-full h-full rounded-full object-cover" 
            alt="Profile" 
          />
        </div>

        {/* Action Buttons & Title */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-3xl font-bold text-on-surface tracking-tight">Green Valley Farm</h1>
              <span className="material-symbols-outlined text-primary filled-icon text-[24px]" title="Verified Producer">verified</span>
            </div>
            <p className="text-on-surface-variant font-medium flex items-center gap-1">
              <span className="material-symbols-outlined text-[18px]">location_on</span> Nakuru County, Kenya
            </p>
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
            <button className="flex-1 md:flex-none px-6 py-3 border border-outline-variant text-on-surface font-bold rounded-lg hover:bg-surface-container transition-colors flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[20px]">chat</span>
              Message
            </button>
            <button className="flex-1 md:flex-none px-6 py-3 bg-primary text-white font-bold rounded-lg hover:brightness-110 active:scale-95 transition-all shadow-sm flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[20px]">person_add</span>
              Follow Farm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}