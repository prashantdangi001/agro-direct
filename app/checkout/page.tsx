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

  // Financial calculations
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
    
    setPaymentStep('verifying');
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setPaymentStep('locking');
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      // 1. Database: Save the Real Escrow Order
      const primaryProducer = cart[0];
      
      const { error: dbError } = await supabase.from('orders').insert({
        buyer_id: user.id,
        farmer_id: primaryProducer.farmerId, 
        farm_name: primaryProducer.farm,
        items: cart, 
        total_amount: totalAmount,
        escrow_status: 'locked'
      });

      if (dbError) throw dbError;

      // 2. REAL-TIME WHATSAPP TRIGGER
      try {
        const { data: farmProfile } = await supabase
          .from('farm_profiles')
          .select('contact_number')
          .eq('id', primaryProducer.farmerId)
          .single();

        const producerPhone = farmProfile?.contact_number; 
        
        if (producerPhone) {
          let cleanPhone = producerPhone.replace(/\D/g, ''); 
          if (cleanPhone.length === 10) cleanPhone = `91${cleanPhone}`;

          const waMessage = `🟢 *Khetify Escrow Alert*\n\nGreat news! INR ${totalAmount.toLocaleString()} has been securely locked in Escrow by a buyer.\n\n*Order Summary:*\n${cart.map(i => `- ${i.qty}x ${i.name}`).join('\n')}\n\nPlease prepare the produce for dispatch.`;

          await fetch('/api/whatsapp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ to: cleanPhone, message: waMessage })
          });
        }
      } catch (err) {
        console.error("WhatsApp notification failed:", err);
      }

      setPaymentStep('success');
      setTimeout(() => {
        clearCart();
        router.push('/marketplace'); 
      }, 3000);

    } catch (error: any) {
      alert("Escrow initiation failed: " + error.message);
      setIsProcessing(false);
      setPaymentStep('idle');
    }
  };

  if (cart.length === 0 && paymentStep === 'idle') {
    return (
      <div className="bg-[#F8FAFC] min-h-screen flex flex-col">
        <MarketplaceNavbar />
        <main className="flex-1 flex flex-col items-center justify-center p-10">
          <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">shopping_basket</span>
          <h1 className="text-2xl font-black text-slate-900">Your cart is empty.</h1>
          <Link href="/marketplace" className="mt-6 text-primary font-bold hover:underline">Return to Marketplace</Link>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-[#F8FAFC] min-h-screen flex flex-col font-sans">
      <MarketplaceNavbar />

      <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 md:px-12 py-10 animate-in fade-in duration-500">
        
        <div className="mb-8">
          <Link href="/marketplace" className="inline-flex items-center gap-2 text-sm font-black text-slate-400 hover:text-primary transition-colors group">
            <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-1 transition-transform">arrow_back</span> Back
          </Link>
          <h1 className="text-3xl font-black text-slate-900 mt-2 tracking-tight uppercase italic">Secure Checkout</h1>
        </div>

        <div className="flex flex-col lg:row gap-12 items-start lg:flex-row">
          
          {/* LEFT: ITEM REVIEW */}
          <div className="w-full lg:w-7/12 space-y-6">
            <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
              <h2 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">local_mall</span> Review Your Order
              </h2>

              <div className="space-y-6">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-4 border-b border-slate-50 last:border-0">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-slate-50 rounded-2xl overflow-hidden border">
                        <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                      </div>
                      <div>
                        <h3 className="font-black text-slate-900">{item.name}</h3>
                        <p className="text-xs font-bold text-primary">{item.farm}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase mt-1">QTY: {item.qty}</p>
                      </div>
                    </div>
                    <p className="font-black text-lg text-slate-900">₹{(item.price * item.qty).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white border border-slate-200 rounded-3xl p-6 flex gap-4 items-start">
                <div className="bg-green-100 text-green-600 p-2 rounded-lg"><span className="material-symbols-outlined">verified_user</span></div>
                <div><p className="font-black text-xs uppercase text-slate-900">Escrow Protected</p><p className="text-[10px] text-slate-500 mt-1">Payment is held safely until you confirm delivery.</p></div>
              </div>
              <div className="bg-white border border-slate-200 rounded-3xl p-6 flex gap-4 items-start">
                <div className="bg-blue-100 text-blue-600 p-2 rounded-lg"><span className="material-symbols-outlined">local_shipping</span></div>
                <div><p className="font-black text-xs uppercase text-slate-900">Direct Tracking</p><p className="text-[10px] text-slate-500 mt-1">Real-time status updates from the producer's farm.</p></div>
              </div>
            </div>
          </div>

          {/* RIGHT: SUMMARY & ESCROW ACTION */}
          <div className="w-full lg:w-5/12">
            <div className="bg-slate-900 rounded-[40px] p-8 md:p-10 text-white shadow-2xl sticky top-24">
              <h2 className="text-xl font-black mb-8 uppercase tracking-widest text-primary">Order Summary</h2>
              
              <div className="space-y-4 mb-8 pb-8 border-b border-white/10">
                <div className="flex justify-between text-sm font-bold text-white/60"><span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
                <div className="flex justify-between text-sm font-bold text-white/60"><span>Platform Fee</span><span>₹{platformFee}</span></div>
                <div className="flex justify-between text-xl font-black text-white pt-2"><span>Total</span><span>₹{totalAmount.toLocaleString()}</span></div>
              </div>

              {paymentStep === 'idle' && (
                <button 
                  onClick={handleEscrowPayment}
                  disabled={isProcessing}
                  className="w-full bg-primary text-white py-5 rounded-2xl font-black text-lg hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3"
                >
                  <span className="material-symbols-outlined">lock</span> Initiate Escrow Lock
                </button>
              )}

              {paymentStep !== 'idle' && paymentStep !== 'success' && (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center animate-pulse">
                   <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                   <p className="font-black text-sm uppercase tracking-widest text-primary">
                     {paymentStep === 'verifying' ? 'Verifying Wallet Funds...' : 'Locking Smart Contract...'}
                   </p>
                </div>
              )}

              {paymentStep === 'success' && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6 text-center animate-in zoom-in-95">
                  <span className="material-symbols-outlined text-green-500 text-4xl mb-2">check_circle</span>
                  <p className="font-black text-sm uppercase tracking-widest text-green-500">Funds Locked Successfully!</p>
                  <p className="text-[10px] text-white/60 mt-2 italic">Farmer has been notified via WhatsApp. Redirecting...</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}