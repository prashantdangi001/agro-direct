'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import MarketplaceNavbar from '@/components/layout/MarketplaceNavbar';

export default function CheckoutPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'idle' | 'verifying' | 'locking' | 'success'>('idle');

  // HACKATHON DEMO DATA: 
  const demoCart = [
    { id: 1, name: "Organic Tomatoes", qty: 50, unit: "kg", price: 40, farmer_id: "demo-farmer-id", farm_name: "Green Valley Farms", farmer_phone: "919876543210" },
    { id: 2, name: "Fresh Green Chilies", qty: 10, unit: "kg", price: 60, farmer_id: "demo-farmer-id", farm_name: "Green Valley Farms", farmer_phone: "919876543210" }
  ];

  const subtotal = demoCart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const platformFee = 0; // ZERO COMMISSION!
  const totalAmount = subtotal + platformFee;

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert("Please log in to proceed to checkout.");
        router.push('/login');
      } else {
        setUser(session.user);
      }
    };
    fetchUser();
  }, [router]);

  const handleEscrowPayment = async () => {
    if (!user) return;
    setIsProcessing(true);
    
    // 1. UI Simulation: Verifying Funds
    setPaymentStep('verifying');
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // 2. UI Simulation: Locking Escrow
    setPaymentStep('locking');
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      // 3. Database: Save the Escrow Order
      const { error: dbError } = await supabase.from('orders').insert({
        buyer_id: user.id,
        farmer_id: demoCart[0].farmer_id, 
        farm_name: demoCart[0].farm_name,
        items: demoCart,
        total_amount: totalAmount,
        escrow_status: 'locked'
      });

      if (dbError) {
        console.error("DB Error:", dbError);
      }

      // ✨ 4. THE TRUE REAL-TIME WHATSAPP TRIGGER ✨
      const farmerPhone = demoCart[0].farmer_phone; 
      
      try {
        // Clean the phone number (UltraMsg wants country code without the '+' sign)
        let cleanPhone = farmerPhone.replace(/\D/g, ''); 
        if (cleanPhone.length === 10) {
          cleanPhone = `91${cleanPhone}`;
        }

        const waMessage = `🟢 *Khetify Escrow Alert*\n\nGreat news! INR ${totalAmount.toLocaleString()} has been securely locked in Escrow by a buyer.\n\n*Order Details:*\n${demoCart.map(i => `- ${i.qty}${i.unit} ${i.name}`).join('\n')}\n\nPlease prepare the produce for dispatch.`;

        // Silent backend fetch
        await fetch('/api/whatsapp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: cleanPhone, 
            message: waMessage
          })
        });
        
        console.log("Real-time automated Escrow WhatsApp alert dispatched!");
      } catch (err) {
        console.error("Failed to trigger WhatsApp route:", err);
      }

      // 5. Success State
      setPaymentStep('success');
      setTimeout(() => {
        router.push('/marketplace'); 
      }, 3500);

    } catch (error: any) {
      alert("Checkout failed: " + error.message);
      setIsProcessing(false);
      setPaymentStep('idle');
    }
  };

  return (
    <div className="bg-background min-h-screen flex flex-col font-sans transition-colors duration-300">
      <MarketplaceNavbar />

      <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 md:px-12 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        <div className="mb-8">
          <Link href="/marketplace" className="inline-flex items-center gap-2 text-sm font-bold text-on-surface-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-[18px]">arrow_back</span> Back to Marketplace
          </Link>
          <h1 className="text-3xl font-bold text-on-surface mt-4 tracking-tight">Secure Escrow Checkout</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* LEFT: ORDER SUMMARY */}
          <div className="w-full lg:w-7/12 space-y-6">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-6 md:p-8 shadow-sm">
              <h2 className="text-xl font-bold text-on-surface mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">shopping_basket</span>
                Order Summary
              </h2>

              <div className="space-y-6">
                {demoCart.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between border-b border-outline-variant/50 pb-6 last:border-0 last:pb-0">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-surface-container-high rounded-xl flex items-center justify-center text-on-surface-variant">
                        <span className="material-symbols-outlined text-3xl">nutrition</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-on-surface">{item.name}</h3>
                        <p className="text-sm text-on-surface-variant">From: <span className="font-medium text-primary">{item.farm_name}</span></p>
                        <p className="text-xs text-on-surface-variant mt-1">₹{item.price} per {item.unit} x {item.qty}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-on-surface">₹{(item.price * item.qty).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* TRUST BADGES */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#059669]/10 border border-[#059669]/20 rounded-2xl p-4 flex items-start gap-3">
                <span className="material-symbols-outlined text-[#059669]">verified_user</span>
                <div>
                  <p className="font-bold text-sm text-[#059669]">100% Quality Guaranteed</p>
                  <p className="text-xs text-[#059669]/80 mt-0.5">Funds are held until delivery.</p>
                </div>
              </div>
              <div className="bg-[#D97706]/10 border border-[#D97706]/20 rounded-2xl p-4 flex items-start gap-3">
                <span className="material-symbols-outlined text-[#D97706]">local_shipping</span>
                <div>
                  <p className="font-bold text-sm text-[#D97706]">Direct Farm Dispatch</p>
                  <p className="text-xs text-[#D97706]/80 mt-0.5">Farmer notified instantly.</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: ESCROW PAYMENT */}
          <div className="w-full lg:w-5/12">
            <div className="bg-[#111827] text-white rounded-3xl p-6 md:p-8 shadow-2xl sticky top-24">
              
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
                <span className="material-symbols-outlined text-primary">lock</span>
                Escrow Payment
              </h2>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Subtotal</span>
                  <span className="text-white">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Middleman Commission</span>
                  <span className="text-[#10b981] font-bold">₹0.00 (0%)</span>
                </div>
                <div className="h-px bg-gray-800 my-2"></div>
                <div className="flex justify-between items-end">
                  <span className="text-sm text-gray-400">Total to Lock in Escrow</span>
                  <span className="text-3xl font-bold text-white">₹{totalAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* PAYMENT SIMULATOR BUTTON */}
              {paymentStep === 'idle' && (
                <button 
                  onClick={handleEscrowPayment}
                  className="w-full py-4 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 text-lg group"
                >
                  <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
                  Secure Funds in Escrow
                </button>
              )}

              {/* ANIMATED PROCESSING STATES */}
              {paymentStep !== 'idle' && (
                <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700 text-center animate-in zoom-in-95 duration-300">
                  
                  {paymentStep === 'verifying' && (
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 border-4 border-gray-600 border-t-primary rounded-full animate-spin mb-4"></div>
                      <p className="font-bold text-white text-lg">Verifying Wallet Funds...</p>
                      <p className="text-xs text-gray-400 mt-1">Establishing secure connection.</p>
                    </div>
                  )}

                  {paymentStep === 'locking' && (
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-primary/20 text-primary rounded-full flex items-center justify-center mb-4 animate-pulse">
                        <span className="material-symbols-outlined text-3xl">lock</span>
                      </div>
                      <p className="font-bold text-white text-lg">Locking Smart Contract...</p>
                      <p className="text-xs text-gray-400 mt-1">Generating zero-knowledge proof.</p>
                    </div>
                  )}

                  {paymentStep === 'success' && (
                    <div className="flex flex-col items-center animate-in slide-in-from-bottom-4">
                      <div className="w-16 h-16 bg-[#10b981] text-white rounded-full flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(16,185,129,0.5)]">
                        <span className="material-symbols-outlined text-4xl">check</span>
                      </div>
                      <p className="font-bold text-white text-xl">Funds Secured!</p>
                      <p className="text-sm text-gray-300 mt-2">Farmer has been notified via WhatsApp.</p>
                      <p className="text-xs text-gray-500 mt-4">Redirecting to marketplace...</p>
                    </div>
                  )}

                </div>
              )}

              <p className="text-center text-[10px] text-gray-500 mt-6 uppercase tracking-widest font-bold">
                Protected by Khetify Escrow Infrastructure
              </p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}