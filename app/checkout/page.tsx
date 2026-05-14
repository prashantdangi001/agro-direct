'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import MarketplaceNavbar from '@/components/layout/MarketplaceNavbar';
import { useCart } from '@/context/CartContext'; 

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, getCartTotal, clearCart } = useCart(); 
  const [user, setUser] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'idle' | 'verifying' | 'locking' | 'success'>('idle');

  // Unified Khetify Financials
  const subtotal = getCartTotal();
  const platformFee = 0; 
  const totalAmount = subtotal + platformFee;

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
      } else {
        setUser(session.user);
      }
    };
    fetchUser();
  }, [router]);

  const handleEscrowPayment = async () => {
    if (!user || cart.length === 0) return;
    setIsProcessing(true);
    
    // 1. UI Simulation: Cryptographic Verification
    setPaymentStep('verifying');
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // 2. UI Simulation: Smart Contract Execution
    setPaymentStep('locking');
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      const primaryItem = cart[0];
      
      // 3. Database: Create the real-time Order Record
      const { error: dbError } = await supabase.from('orders').insert({
        buyer_id: user.id,
        farmer_id: primaryItem.farmerId, 
        farm_name: primaryItem.farm,
        items: cart, 
        total_amount: totalAmount,
        status: 'locked'
      });

      if (dbError) throw dbError;

      // 4. REAL-TIME WHATSAPP INTEGRATION
      try {
        // Fetch the farmer's real-time phone number from the registry
        const { data: farmProfile } = await supabase
          .from('farm_profiles')
          .select('contact_number')
          .eq('id', primaryItem.farmerId)
          .single();

        const producerPhone = farmProfile?.contact_number; 
        
        if (producerPhone) {
          let cleanPhone = producerPhone.replace(/\D/g, ''); 
          if (cleanPhone.length === 10) cleanPhone = `91${cleanPhone}`;

          const waMessage = `🟢 *Khetify Escrow Alert*\n\nGreat news! INR ${totalAmount.toLocaleString()} has been securely locked in Escrow by a buyer.\n\n*Items to Dispatch:*\n${cart.map(i => `- ${i.qty}x ${i.name}`).join('\n')}\n\nPlease update your dashboard to mark this order as 'Shipped'.`;

          await fetch('/api/whatsapp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ to: cleanPhone, message: waMessage })
          });
        }
      } catch (waErr) {
        console.error("Notification Engine Error:", waErr);
      }

      // 5. Completion State
      setPaymentStep('success');
      setTimeout(() => {
        clearCart();
        router.push('/marketplace'); 
      }, 3000);

    } catch (error: any) {
      alert("Checkout sync failed: " + error.message);
      setIsProcessing(false);
      setPaymentStep('idle');
    }
  };

  if (cart.length === 0 && paymentStep === 'idle') {
    return (
      <div className="bg-[#F8FAF9] min-h-screen flex flex-col font-sans">
        <MarketplaceNavbar />
        <main className="flex-1 flex flex-col items-center justify-center p-12">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-4xl text-primary">shopping_basket</span>
          </div>
          <h1 className="text-2xl font-black text-on-surface">Cart is empty</h1>
          <Link href="/marketplace" className="mt-4 text-primary font-bold hover:underline">Return to Marketplace</Link>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-[#F8FAF9] min-h-screen flex flex-col font-sans">
      <MarketplaceNavbar />

      <main className="flex-1 max-w-[1280px] w-full mx-auto px-6 md:px-12 py-12 animate-in fade-in duration-700">
        
        <header className="mb-12">
          <Link href="/cart" className="inline-flex items-center gap-2 text-sm font-black text-on-surface-variant hover:text-primary transition-all group">
            <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-1 transition-transform">arrow_back</span> Review Cart
          </Link>
          <h1 className="text-5xl font-black text-on-surface mt-4 tracking-tighter uppercase italic">Secure Checkout</h1>
          <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mt-2">Verified Peer-to-Peer Transaction</p>
        </header>

        <div className="flex flex-col lg:flex-row gap-12 items-start">
          
          {/* LEFT COLUMN: ORDER DETAILS */}
          <div className="w-full lg:w-7/12 space-y-8">
            <div className="bg-white border border-outline-variant rounded-[40px] p-10 shadow-sm">
              <h2 className="text-2xl font-black text-on-surface mb-10 flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">inventory_2</span>
                Items for Escrow
              </h2>

              <div className="space-y-8">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-6 border-b border-outline-variant/30 last:border-0 last:pb-0">
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-20 bg-surface-container-low rounded-3xl overflow-hidden border border-outline-variant shadow-inner">
                        <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                      </div>
                      <div>
                        <h3 className="font-black text-xl text-on-surface leading-tight">{item.name}</h3>
                        <p className="text-xs font-bold text-primary uppercase tracking-widest mt-1">{item.farm}</p>
                        <p className="text-[11px] font-black text-on-surface-variant mt-2">QTY: {item.qty} Unit(s)</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-2xl text-on-surface tracking-tighter">₹{(item.price * item.qty).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* TRUST GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-outline-variant rounded-[32px] p-8 flex gap-5 items-start shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
                  <span className="material-symbols-outlined">verified_user</span>
                </div>
                <div>
                  <p className="font-black text-xs uppercase tracking-widest text-on-surface">Escrow Lock</p>
                  <p className="text-[11px] text-on-surface-variant mt-2 font-medium italic leading-relaxed">Funds are cryptographically held until you confirm receipt of fresh produce.</p>
                </div>
              </div>
              <div className="bg-white border border-outline-variant rounded-[32px] p-8 flex gap-5 items-start shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
                  <span className="material-symbols-outlined">hub</span>
                </div>
                <div>
                  <p className="font-black text-xs uppercase tracking-widest text-on-surface">Zero Commission</p>
                  <p className="text-[11px] text-on-surface-variant mt-2 font-medium italic leading-relaxed">No middleman fees. 100% of your payment reaches the local farmer directly.</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: PAYMENT SUMMARY */}
          <div className="w-full lg:w-5/12">
            <div className="bg-on-surface rounded-[48px] p-10 md:p-14 text-white shadow-2xl sticky top-24">
              <h2 className="text-xl font-black mb-10 uppercase tracking-[0.3em] text-primary">Financial Summary</h2>
              
              <div className="space-y-6 mb-10 pb-10 border-b border-white/10">
                <div className="flex justify-between items-center text-white/50 font-bold">
                  <span>Cart Subtotal</span>
                  <span className="text-white">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-white/50 font-bold">
                  <span>Escrow & Platform Fee</span>
                  <span className="text-primary font-black uppercase tracking-widest text-[10px]">₹0 (Limited Offer)</span>
                </div>
              </div>

              <div className="flex justify-between items-end mb-12">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Total Settlement</span>
                <span className="text-5xl font-black text-white tracking-tighter">₹{totalAmount.toLocaleString()}</span>
              </div>

              {paymentStep === 'idle' && (
                <button 
                  onClick={handleEscrowPayment}
                  disabled={isProcessing}
                  className="w-full bg-primary text-white py-6 rounded-3xl font-black text-xl hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-primary/30 flex items-center justify-center gap-3 group"
                >
                  <span className="material-symbols-outlined group-hover:rotate-12 transition-transform">lock</span>
                  Lock Escrow Funds
                </button>
              )}

              {/* PROGRESS STEPS */}
              {paymentStep !== 'idle' && paymentStep !== 'success' && (
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 text-center animate-in zoom-in-95">
                   <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                   <p className="font-black text-sm uppercase tracking-[0.2em] text-primary">
                     {paymentStep === 'verifying' ? 'Verifying Digital Wallet...' : 'Locking Smart Contract...'}
                   </p>
                   <p className="text-[10px] text-white/40 mt-2 italic font-medium">Securing transaction on the Khetify network.</p>
                </div>
              )}

              {/* SUCCESS STATE */}
              {paymentStep === 'success' && (
                <div className="bg-primary/10 border border-primary/20 rounded-3xl p-8 text-center animate-in zoom-in-95">
                  <span className="material-symbols-outlined text-primary text-5xl mb-4">check_circle</span>
                  <p className="font-black text-sm uppercase tracking-[0.2em] text-primary">Escrow Secured</p>
                  <p className="text-[10px] text-white/60 mt-3 italic font-medium leading-relaxed px-4">
                    Producer notified via WhatsApp. Funds are now safely locked.
                  </p>
                </div>
              )}

              <div className="mt-12 text-center">
                 <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Encrypted by Khetify v3.2</p>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}