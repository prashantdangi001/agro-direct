'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import MarketplaceNavbar from '@/components/layout/MarketplaceNavbar';
import Link from 'next/link';

export default function BuyerOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyOrders = async () => {
      // 1. Get the securely logged-in user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        window.location.href = '/login';
        return;
      }

      // 2. Fetch ONLY the orders belonging to this buyer's email
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('buyer_email', user.email)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching orders:", error);
      } else {
        setOrders(data || []);
      }
      
      setLoading(false);
    };

    fetchMyOrders();
  }, []);

  // Helper function to build the Traceability Timeline
  const getTimelineSteps = (status: string) => {
    const steps = ['Processing', 'Harvested', 'Shipped', 'Delivered'];
    const currentIndex = steps.indexOf(status) !== -1 ? steps.indexOf(status) : 0;

    return (
      <div className="relative flex justify-between items-center w-full mt-6 mb-2">
        {/* Background Line */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-surface-container-high rounded-full z-0"></div>
        {/* Active Line */}
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#059669] rounded-full z-0 transition-all duration-500"
          style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
        ></div>

        {/* Steps */}
        {steps.map((step, index) => {
          const isCompleted = index <= currentIndex;
          const isActive = index === currentIndex;

          return (
            <div key={step} className="relative z-10 flex flex-col items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                isActive ? 'bg-[#059669] border-[#059669] text-white shadow-md scale-110' : 
                isCompleted ? 'bg-[#059669] border-[#059669] text-white' : 
                'bg-white border-outline-variant text-outline-variant'
              }`}>
                {isCompleted ? (
                  <span className="material-symbols-outlined text-[16px] font-bold">check</span>
                ) : (
                  <div className="w-2 h-2 rounded-full bg-outline-variant"></div>
                )}
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? 'text-[#059669]' : 'text-on-surface-variant'}`}>
                {step}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <MarketplaceNavbar />

      <main className="flex-1 max-w-[1000px] w-full mx-auto px-4 py-8 md:py-12 animate-in fade-in duration-300">
        <div className="flex items-center gap-3 mb-8">
          <span className="material-symbols-outlined text-4xl text-primary">inventory_2</span>
          <div>
            <h1 className="text-3xl font-bold text-on-surface tracking-tight">My Orders</h1>
            <p className="text-on-surface-variant text-sm">Track your purchases and view farm-to-door traceability.</p>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-surface-container-high border-t-primary rounded-full animate-spin mb-4"></div>
            <p className="text-on-surface-variant font-bold">Loading your harvest...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-outline-variant p-16 text-center elevation-1">
            <span className="material-symbols-outlined text-6xl text-outline mb-4">receipt_long</span>
            <h2 className="text-2xl font-bold text-on-surface mb-2">No Orders Yet</h2>
            <p className="text-on-surface-variant mb-8 max-w-md mx-auto">You haven't placed any orders. Head over to the marketplace to support local farmers!</p>
            <Link href="/marketplace" className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-bold shadow-sm hover:brightness-110 transition-all">
              Explore Marketplace
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl border border-outline-variant elevation-1 overflow-hidden transition-all hover:shadow-md">
                
                {/* Order Header */}
                <div className="bg-surface-container-lowest p-5 border-b border-outline-variant flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                    <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Order Reference</p>
                    <p className="text-lg font-bold text-primary">ORD-{order.id.split('-')[0].toUpperCase()}</p>
                  </div>
                  <div className="flex gap-6">
                    <div>
                      <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Date Placed</p>
                      <p className="text-sm font-bold text-on-surface">
                        {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Total Amount</p>
                      <p className="text-sm font-bold text-on-surface">INR {Number(order.total_amount).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* Order Body & Traceability */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">agriculture</span>
                    <h3 className="font-bold text-on-surface">Direct Farm Dispatch</h3>
                  </div>
                  <p className="text-sm text-on-surface-variant mb-6">
                    Your produce is being handled securely via {order.payment_method}. Delivering to: <span className="font-medium text-on-surface">{order.delivery_address}</span>
                  </p>

                  {/* Visual Timeline Component */}
                  <div className="bg-surface-container-low rounded-lg p-6 border border-outline-variant">
                    <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-4 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px]">share_location</span>
                      Live Traceability
                    </p>
                    {getTimelineSteps(order.status || 'Processing')}
                  </div>
                </div>
                
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}