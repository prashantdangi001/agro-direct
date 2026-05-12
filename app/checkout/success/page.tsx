'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import MarketplaceNavbar from '@/components/layout/MarketplaceNavbar';

export default function CheckoutSuccessPage() {
  // 1. Start with a loading state that matches the server exactly
  const [orderNumber, setOrderNumber] = useState('Generating...');

  // 2. Generate the random number ONLY on the client after it loads
  useEffect(() => {
    setOrderNumber(`ORD-${Math.floor(100000 + Math.random() * 900000)}`);
  }, []);

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <MarketplaceNavbar />
      
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl border border-outline-variant elevation-2 p-8 text-center animate-in zoom-in-95 duration-500">
          
          <div className="w-20 h-20 bg-[#E0F2E9] rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-5xl text-[#059669]">check_circle</span>
          </div>
          
          <h1 className="text-2xl font-bold text-on-surface mb-2 tracking-tight">Order Placed Successfully!</h1>
          <p className="text-on-surface-variant mb-6">
            Your multi-vendor order has been split and securely routed to the respective farms. 
          </p>
          
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-4 mb-8">
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Order Reference Number</p>
            {/* 3. Display the client-generated number */}
            <p className="text-xl font-bold text-primary">{orderNumber}</p>
          </div>

          <div className="space-y-3">
            <Link 
              href="/marketplace"
              className="block w-full py-3 bg-primary text-white rounded-lg font-bold shadow-sm hover:brightness-110 transition-all active:scale-95"
            >
              Continue Shopping
            </Link>
          </div>

        </div>
      </main>
    </div>
  );
}