'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import MarketplaceNavbar from '@/components/layout/MarketplaceNavbar';
import { useCart } from '@/context/CartContext'; 

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, getCartTotal, updateQuantity, removeFromCart, clearCart } = useCart(); 
  const [user, setUser] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [paymentMethod, setPaymentMethod] = useState<'escrow' | 'cod'>('escrow');
  const [paymentStep, setPaymentStep] = useState<'idle' | 'verifying' | 'locking' | 'success'>('idle');

  // ✨ NEW: Strict Delivery State ✨
  const [delivery, setDelivery] = useState({
    receiverName: '',
    mobileNo: '',
    altMobileNo: '',
    fullAddress: '',
    city: '',
    pincode: ''
  });

  const subtotal = getCartTotal();
  const platformFee = 0; 
  const totalAmount = subtotal + platformFee;

  // Validation Check: Are all required fields filled?
  const isDeliveryValid = delivery.receiverName.trim() !== '' && 
                          delivery.mobileNo.trim() !== '' && 
                          delivery.fullAddress.trim() !== '' && 
                          delivery.city.trim() !== '' && 
                          delivery.pincode.trim() !== '';

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
      } else {
        setUser(session.user);
        // Pre-fill what we know from their registration
        setDelivery(prev => ({
          ...prev,
          receiverName: session.user.user_metadata?.full_name || '',
          mobileNo: session.user.user_metadata?.phone || ''
        }));
      }
    };
    fetchUser();
  }, [router]);

  const handleCheckout = async () => {
    if (!user || cart.length === 0 || !isDeliveryValid) return;
    setIsProcessing(true);
    
    if (paymentMethod === 'escrow') {
      setPaymentStep('verifying');
      await new Promise(resolve => setTimeout(resolve, 1500));
      setPaymentStep('locking');
      await new Promise(resolve => setTimeout(resolve, 1500));
    } else {
      setPaymentStep('verifying'); 
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    try {
      const primaryItem = cart[0];
      
      // ✨ Format the complete delivery address string
      const completeAddress = `${delivery.receiverName} | Ph: ${delivery.mobileNo} ${delivery.altMobileNo ? `(Alt: ${delivery.altMobileNo})` : ''} | ${delivery.fullAddress}, ${delivery.city} - ${delivery.pincode}`;
      
      const { error: dbError } = await supabase.from('orders').insert({
        buyer_id: user.id,
        farmer_id: primaryItem.farmerId, 
        farm_name: primaryItem.farm,
        items: cart, 
        total_amount: totalAmount,
        status: 'locked',
        payment_method: paymentMethod,
        delivery_address: completeAddress // Save the strict address!
      });

      if (dbError) throw dbError;

      const methodText = paymentMethod === 'escrow' ? 'Escrow Wallet (Pre-Paid)' : 'Cash on Delivery (COD)';

      // 🚀 ALERT THE FARMER (NOW WITH DELIVERY DETAILS) 🚀
      try {
        const { data: farmProfile } = await supabase.from('farm_profiles').select('contact_number').eq('id', primaryItem.farmerId).single();
        const producerPhone = farmProfile?.contact_number; 
        
        if (producerPhone) {
          let cleanPhone = producerPhone.replace(/\D/g, ''); 
          if (cleanPhone.length === 10) cleanPhone = `91${cleanPhone}`;

          const farmerMessage = `🟢 *Khetify Order Alert*\n\nNew order received for INR ${totalAmount.toLocaleString()}!\n\n*Payment Mode:* ${methodText}\n\n*🚚 Deliver To:*\n${delivery.receiverName}\n${delivery.fullAddress}, ${delivery.city} - ${delivery.pincode}\n📞 ${delivery.mobileNo}\n${delivery.altMobileNo ? `📞 Alt: ${delivery.altMobileNo}` : ''}\n\n*Items to Dispatch:*\n${cart.map((i: any) => `- ${i.qty}x ${i.name}`).join('\n')}\n\nPlease update your dashboard to mark this order as 'Shipped'.`;

          fetch('/api/whatsapp', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ to: cleanPhone, message: farmerMessage }) });
        }
      } catch (waErr) { console.error(waErr); }

      // ALERT THE BUYER
      try {
        const buyerPhone = delivery.mobileNo || user.user_metadata?.phone; 
        const buyerName = delivery.receiverName || user.user_metadata?.full_name || 'Buyer';
        
        if (buyerPhone) {
          let cleanPhone = buyerPhone.replace(/\D/g, ''); 
          if (cleanPhone.length === 10) cleanPhone = `91${cleanPhone}`;

          const buyerMessage = `🛒 *Khetify Order Confirmed*\n\nThank you, ${buyerName}!\nYour order for INR ${totalAmount.toLocaleString()} has been placed.\n\n*Payment Mode:* ${methodText}\n\n*Order Summary:*\n${cart.map((i: any) => `- ${i.qty}x ${i.name}`).join('\n')}\n\nIt will be delivered to:\n${delivery.fullAddress}, ${delivery.city}\n\nYou will be notified when ${primaryItem.farm} dispatches the produce.`;

          fetch('/api/whatsapp', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ to: cleanPhone, message: buyerMessage }) });
        }
      } catch (buyerWaErr) { console.error(buyerWaErr); }

      setPaymentStep('success');
      setTimeout(() => { clearCart(); router.push('/buyer/orders'); }, 3000); 

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
            <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-1 transition-transform">arrow_back</span> Return to Cart
          </Link>
          <h1 className="text-5xl font-black text-on-surface mt-4 tracking-tighter uppercase italic">Secure Checkout</h1>
          <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mt-2">Verified Peer-to-Peer Transaction</p>
        </header>

        <div className="flex flex-col lg:flex-row gap-12 items-start">
          
          {/* LEFT COLUMN */}
          <div className="w-full lg:w-7/12 space-y-8">
            
            {/* 1. ORDER DETAILS */}
            <div className="bg-white border border-outline-variant rounded-[40px] p-10 shadow-sm">
              <h2 className="text-2xl font-black text-on-surface mb-8 flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">inventory_2</span>
                Order Items
              </h2>

              <div className="space-y-6">
                {cart.map((item: any, idx: number) => (
                  <div key={idx} className="flex flex-col md:flex-row md:items-center justify-between py-6 border-b border-outline-variant/30 last:border-0 last:pb-0 gap-6">
                    <div className="flex items-center gap-6 w-full md:w-auto">
                      <div className="w-20 h-20 bg-surface-container-low rounded-3xl overflow-hidden border border-outline-variant shadow-inner shrink-0">
                        <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                      </div>
                      <div>
                        <h3 className="font-black text-xl text-on-surface leading-tight">{item.name}</h3>
                        <p className="text-xs font-bold text-primary uppercase tracking-widest mt-1">{item.farm}</p>
                        
                        <div className="flex items-center gap-2 mt-3 bg-surface-container-lowest p-1 rounded-xl border border-outline-variant w-fit shadow-sm">
                          <button onClick={() => updateQuantity(item.id, item.qty - 1)} className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-on-surface-variant hover:text-primary hover:shadow-md transition-all active:scale-95">
                            <span className="material-symbols-outlined text-[16px]">remove</span>
                          </button>
                          <span className="w-8 text-center font-black text-on-surface text-sm">{item.qty}</span>
                          <button onClick={() => updateQuantity(item.id, item.qty + 1)} className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-on-surface-variant hover:text-primary hover:shadow-md transition-all active:scale-95">
                            <span className="material-symbols-outlined text-[16px]">add</span>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex items-center justify-between md:block w-full md:w-auto">
                      <p className="font-black text-2xl text-on-surface tracking-tighter">₹{(item.price * item.qty).toLocaleString()}</p>
                      <button onClick={() => removeFromCart(item.id)} className="md:hidden text-error bg-error/10 p-2 rounded-xl">
                         <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ✨ 2. STRICT DELIVERY DETAILS FORM ✨ */}
            <div className="bg-white border border-outline-variant rounded-[40px] p-10 shadow-sm">
              <h2 className="text-2xl font-black text-on-surface mb-8 flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">local_shipping</span>
                Delivery Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Receiver's Full Name *</label>
                  <input required value={delivery.receiverName} onChange={e => setDelivery({...delivery, receiverName: e.target.value})} className="w-full p-4 rounded-2xl bg-surface-container-lowest border-2 border-outline-variant focus:border-primary outline-none transition-all font-bold" placeholder="E.g. Prashant Dangi" />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Mobile No. (WhatsApp) *</label>
                  <input required type="tel" value={delivery.mobileNo} onChange={e => setDelivery({...delivery, mobileNo: e.target.value})} className="w-full p-4 rounded-2xl bg-surface-container-lowest border-2 border-outline-variant focus:border-primary outline-none transition-all font-bold" placeholder="91XXXXXXXXXX" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Alternative Mobile No.</label>
                  <input type="tel" value={delivery.altMobileNo} onChange={e => setDelivery({...delivery, altMobileNo: e.target.value})} className="w-full p-4 rounded-2xl bg-surface-container-lowest border-2 border-outline-variant focus:border-primary outline-none transition-all font-bold" placeholder="Optional" />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Complete Address *</label>
                  <textarea required rows={3} value={delivery.fullAddress} onChange={e => setDelivery({...delivery, fullAddress: e.target.value})} className="w-full p-4 rounded-2xl bg-surface-container-lowest border-2 border-outline-variant focus:border-primary outline-none transition-all font-bold resize-none" placeholder="House No, Street, Landmark, Village..." />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">City / District *</label>
                  <input required value={delivery.city} onChange={e => setDelivery({...delivery, city: e.target.value})} className="w-full p-4 rounded-2xl bg-surface-container-lowest border-2 border-outline-variant focus:border-primary outline-none transition-all font-bold" placeholder="E.g. Indore" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">PIN Code *</label>
                  <input required value={delivery.pincode} onChange={e => setDelivery({...delivery, pincode: e.target.value})} className="w-full p-4 rounded-2xl bg-surface-container-lowest border-2 border-outline-variant focus:border-primary outline-none transition-all font-bold" placeholder="452001" />
                </div>
              </div>
            </div>

            {/* 3. PAYMENT METHOD SELECTOR */}
            <div className="bg-white border border-outline-variant rounded-[40px] p-10 shadow-sm">
               <h2 className="text-2xl font-black text-on-surface mb-8 flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">account_balance_wallet</span>
                Payment Method
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div onClick={() => setPaymentMethod('escrow')} className={`cursor-pointer p-6 rounded-[24px] border-2 transition-all ${paymentMethod === 'escrow' ? 'border-primary bg-primary/5 shadow-md' : 'border-outline-variant hover:border-primary/50 bg-surface-container-lowest'}`}>
                  <div className="flex justify-between items-start mb-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${paymentMethod === 'escrow' ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-surface-container-low text-on-surface-variant'}`}>
                      <span className="material-symbols-outlined">lock</span>
                    </div>
                    {paymentMethod === 'escrow' && <span className="material-symbols-outlined text-primary">check_circle</span>}
                  </div>
                  <h3 className="font-black text-on-surface text-lg">Escrow Wallet</h3>
                  <p className="text-[11px] font-bold text-on-surface-variant mt-2 leading-relaxed">Recommended. Funds are securely locked and only released upon successful delivery.</p>
                </div>

                <div onClick={() => setPaymentMethod('cod')} className={`cursor-pointer p-6 rounded-[24px] border-2 transition-all ${paymentMethod === 'cod' ? 'border-primary bg-primary/5 shadow-md' : 'border-outline-variant hover:border-primary/50 bg-surface-container-lowest'}`}>
                  <div className="flex justify-between items-start mb-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${paymentMethod === 'cod' ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-surface-container-low text-on-surface-variant'}`}>
                      <span className="material-symbols-outlined">payments</span>
                    </div>
                    {paymentMethod === 'cod' && <span className="material-symbols-outlined text-primary">check_circle</span>}
                  </div>
                  <h3 className="font-black text-on-surface text-lg">Cash on Delivery</h3>
                  <p className="text-[11px] font-bold text-on-surface-variant mt-2 leading-relaxed">Pay with cash or UPI directly to the farmer when your produce arrives.</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: FINANCIAL SUMMARY */}
          <div className="w-full lg:w-5/12">
            <div className="bg-white border border-outline-variant rounded-[48px] p-10 md:p-12 shadow-xl sticky top-24">
              <h2 className="text-xl font-black mb-8 uppercase tracking-widest text-on-surface border-b border-outline-variant/50 pb-6 flex items-center justify-between">
                Financial Summary
                <span className="material-symbols-outlined text-on-surface-variant">receipt_long</span>
              </h2>
              
              <div className="space-y-5 mb-8">
                <div className="flex justify-between items-center text-on-surface-variant font-bold">
                  <span>Cart Subtotal</span>
                  <span className="text-on-surface font-black">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-on-surface-variant font-bold">
                  <span>Logistics & Escrow Fee</span>
                  <span className="text-primary font-black uppercase tracking-widest text-[10px] bg-primary/10 px-2 py-1 rounded-md border border-primary/20">₹0 (Limited Offer)</span>
                </div>
              </div>

              <div className="bg-surface-container-lowest border-2 border-outline-variant rounded-[32px] p-8 mb-8 transition-all duration-300">
                <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant block mb-1">
                  {paymentMethod === 'escrow' ? 'Total to Lock' : 'Total Payable on Delivery'}
                </span>
                <span className="text-5xl font-black text-on-surface tracking-tighter transition-all duration-300">₹{totalAmount.toLocaleString()}</span>
              </div>

              {/* ✨ DYNAMIC SUBMIT BUTTON WITH VALIDATION LOCK ✨ */}
              {paymentStep === 'idle' && (
                <button 
                  onClick={handleCheckout}
                  disabled={isProcessing || !isDeliveryValid}
                  className={`w-full py-6 rounded-3xl font-black text-xl text-white transition-all shadow-xl flex items-center justify-center gap-3 group hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 ${
                    !isDeliveryValid ? 'bg-surface-container-highest text-on-surface-variant shadow-none' : 
                    paymentMethod === 'escrow' ? 'bg-primary shadow-primary/30 hover:brightness-110' : 'bg-[#D97706] shadow-[#D97706]/30 hover:brightness-110'
                  }`}
                >
                  {!isDeliveryValid ? (
                    <><span className="material-symbols-outlined">edit_location</span> Fill Delivery Details</>
                  ) : paymentMethod === 'escrow' ? (
                    <><span className="material-symbols-outlined group-hover:rotate-12 transition-transform">lock</span> Lock Escrow Funds</>
                  ) : (
                    <><span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">local_shipping</span> Confirm COD Order</>
                  )}
                </button>
              )}

              {/* DYNAMIC PROGRESS STEPS */}
              {paymentStep !== 'idle' && paymentStep !== 'success' && (
                <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-8 text-center animate-in zoom-in-95">
                   <div className={`w-10 h-10 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-6 ${paymentMethod === 'escrow' ? 'border-primary' : 'border-[#D97706]'}`}></div>
                   <p className={`font-black text-sm uppercase tracking-[0.2em] ${paymentMethod === 'escrow' ? 'text-primary' : 'text-[#D97706]'}`}>
                     {paymentMethod === 'escrow' && paymentStep === 'verifying' ? 'Verifying Digital Wallet...' : 
                      paymentMethod === 'escrow' && paymentStep === 'locking' ? 'Locking Smart Contract...' : 
                      'Processing Order...'}
                   </p>
                   <p className="text-[10px] text-on-surface-variant mt-2 italic font-medium">Securing transaction on the Khetify network.</p>
                </div>
              )}

              {/* SUCCESS STATE */}
              {paymentStep === 'success' && (
                <div className="bg-[#10b981]/10 border border-[#10b981]/20 rounded-3xl p-8 text-center animate-in zoom-in-95">
                  <span className="material-symbols-outlined text-[#10b981] text-5xl mb-4">check_circle</span>
                  <p className="font-black text-sm uppercase tracking-[0.2em] text-[#10b981]">
                    {paymentMethod === 'escrow' ? 'Escrow Secured' : 'Order Confirmed'}
                  </p>
                  <p className="text-[10px] text-on-surface-variant mt-3 italic font-bold leading-relaxed px-4">
                    Both parties have been notified via WhatsApp.
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}