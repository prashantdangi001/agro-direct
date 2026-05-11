'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function PriceSummaryCard() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePlaceOrder = async () => {
    setLoading(true);

    // 1. Send the order to Supabase
    const { error } = await supabase
      .from('orders')
      .insert([
        {
          total_amount: 145.22,
          status: 'Processing',
          payment_method: 'M-Pesa / Escrow',
          delivery_address: 'Central Logistics Hub, Nairobi, Kenya'
        }
      ]);

    if (error) {
      console.error('Order failed:', error);
      alert('Failed to process order. Please try again.');
      setLoading(false);
    } else {
      // 2. Trigger the Success UI
      setSuccess(true);
      
      // 3. Send them back to the marketplace after 3 seconds
      setTimeout(() => {
        router.push('/marketplace');
      }, 4000);
    }
  };

  // SUCCESS STATE UI (Renders when the order goes through)
  if (success) {
    return (
      <div className="bg-primary-container text-on-primary-container p-8 rounded-xl border border-primary/20 elevation-1 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-500 h-full min-h-[400px]">
        <span className="material-symbols-outlined text-7xl mb-4">check_circle</span>
        <h2 className="text-3xl font-bold mb-3 tracking-tight">Order Confirmed!</h2>
        <p className="text-sm font-medium opacity-90 leading-relaxed mb-8">
          Your payment is securely held in escrow. The farmer has been notified to prepare your harvest.
        </p>
        <div className="w-8 h-8 border-4 border-on-primary-container/30 border-t-on-primary-container rounded-full animate-spin"></div>
        <p className="text-xs font-bold mt-4 uppercase tracking-widest opacity-80">Redirecting to Market</p>
      </div>
    );
  }

  // DEFAULT CHECKOUT UI
  return (
    <div className="space-y-6">
      <section className="bg-surface-container-high p-6 rounded-lg border border-outline-variant elevation-1">
        <h2 className="text-2xl font-bold mb-6 text-on-surface">Price Summary</h2>
        
        <div className="space-y-4">
          <div className="flex justify-between text-on-surface-variant font-medium">
            <span>Subtotal</span>
            <span>$124.50</span>
          </div>
          <div className="flex justify-between text-on-surface-variant font-medium">
            <span>Delivery Fee</span>
            <span>$12.00</span>
          </div>
          <div className="flex justify-between text-on-surface-variant font-medium">
            <span>Taxes (VAT)</span>
            <span>$8.72</span>
          </div>
          
          <div className="pt-4 border-t border-outline-variant">
            <div className="flex justify-between items-baseline">
              <span className="font-bold text-lg text-on-surface">Total</span>
              <span className="text-3xl font-bold text-primary">$145.22</span>
            </div>
          </div>
        </div>

        <button 
          onClick={handlePlaceOrder}
          disabled={loading}
          className="w-full mt-8 py-4 bg-[#fe932c] text-white font-bold text-lg rounded-lg shadow-sm hover:bg-[#d97706] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Processing...
            </>
          ) : (
            <>
              Place Order
              <span className="material-symbols-outlined">arrow_forward</span>
            </>
          )}
        </button>
        
        <p className="text-center text-xs font-medium text-on-surface-variant mt-4 leading-relaxed">
          By placing an order, you agree to AgroDirect's terms of service and harvest policies.
        </p>
      </section>

      {/* Trust Badge */}
      <div className="flex items-center gap-3 p-4 bg-primary-container/10 border border-primary/20 rounded-lg">
        <span className="material-symbols-outlined text-primary filled-icon text-[32px]">verified_user</span>
        <div>
          <p className="font-bold text-primary text-sm">AgroDirect Verified</p>
          <p className="text-on-surface-variant text-xs font-medium mt-0.5">Secure escrow payment enabled.</p>
        </div>
      </div>
    </div>
  );
}