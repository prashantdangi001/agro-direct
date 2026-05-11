'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function FarmerSidebar() {
  const pathname = usePathname();

  // Helper function to check if the link is active
  const isActive = (path: string) => pathname === path;

  return (
    <aside className="hidden md:flex flex-col py-6 gap-2 bg-surface-container-low h-[calc(100vh-64px)] w-64 fixed left-0 top-16 border-r border-outline-variant z-40">
      
      <div className="px-6 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-fixed overflow-hidden border border-outline-variant">
            <img alt="Farmer Profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6dPgaJjE2DEckCIPPBSoJIhLB-dRYtSE6dSt_KmsP9YM4GranUC7B0cUqnzRWjsThRSsraY8GSxis64EWZdMFbox6yHIwskmIozTB1oZIDK4clkJNPZ99d_ZIthWKkIKY7aKfPNz_7TlAe45qdrzXV0s8i3Kvk67pDNqtPSKOhUH-uRNhHdN6-4x9oHn8P8cpyTDs53F_nNdXv2dTJqqXQB_9JZHxK5Pzwu1CyIsg_hT2fdtPVDMStjtR94-gHrhSMyzf0QGiG2Dz" />
          </div>
          <div>
            <p className="text-sm text-on-surface font-bold">Green Valley Farm</p>
            <p className="text-xs text-on-surface-variant font-medium">Verified Seller</p>
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

        {/* THE FIX: Pointed to Orders and added active state checking */}
        <Link href="/farmer/orders" className={`flex items-center gap-3 px-4 py-3 mx-2 transition-all active:scale-95 rounded-lg ${isActive('/farmer/orders') ? 'bg-primary-container text-on-primary-container shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'}`}>
          <span className="material-symbols-outlined">receipt_long</span>
          <span className="text-sm font-bold">Order History</span>
        </Link>

        <Link href="#" className="flex items-center gap-3 text-on-surface-variant px-4 py-3 mx-2 hover:bg-surface-container-high transition-all active:scale-95 rounded-lg">
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