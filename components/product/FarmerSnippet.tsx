'use client';
import Link from 'next/link';

export default function FarmerSnippet() {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 elevation-1">
      <div className="flex items-center gap-4 mb-4">
        <img 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6dPgaJjE2DEckCIPPBSoJIhLB-dRYtSE6dSt_KmsP9YM4GranUC7B0cUqnzRWjsThRSsraY8GSxis64EWZdMFbox6yHIwskmIozTB1oZIDK4clkJNPZ99d_ZIthWKkIKY7aKfPNz_7TlAe45qdrzXV0s8i3Kvk67pDNqtPSKOhUH-uRNhHdN6-4x9oHn8P8cpyTDs53F_nNdXv2dTJqqXQB_9JZHxK5Pzwu1CyIsg_hT2fdtPVDMStjtR94-gHrhSMyzf0QGiG2Dz" 
          alt="Green Valley Farm" 
          className="w-16 h-16 rounded-full object-cover border border-outline-variant" 
        />
        <div>
          <h3 className="font-bold text-lg text-on-surface flex items-center gap-1">
            Green Valley Farm
            <span className="material-symbols-outlined text-primary text-[18px] filled-icon">verified</span>
          </h3>
          <div className="flex items-center gap-1 text-sm text-on-surface-variant font-medium">
            <span className="material-symbols-outlined text-[16px] text-primary">location_on</span>
            Nakuru, Kenya
          </div>
        </div>
      </div>
      
      <p className="text-sm text-on-surface-variant mb-6 leading-relaxed">
        Sustainable, organic farming cooperative specializing in high-yield vegetables and grains. Verified partner since 2021.
      </p>
      
      {/* THE FIX: Point this directly to the producer's profile page */}
      <Link 
        href="/producers/green-valley"
        className="w-full py-3 border-2 border-primary text-primary font-bold rounded-lg hover:bg-primary/5 transition-colors flex items-center justify-center gap-2 block text-center active:scale-95"
      >
        View Full Profile
      </Link>
    </div>
  );
}