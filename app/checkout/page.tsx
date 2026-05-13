'use client';
import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import MarketplaceNavbar from '@/components/layout/MarketplaceNavbar';
import BackButton from '@/components/ui/BackButton';
import Link from 'next/link';

export default function CheckoutPage() {
  const { cart, clearCart, getCartTotal, getCartCount } = useCart();
  const router = useRouter();
  
  // Auth & UI States
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  
  // THE FIX 1: New Payment State to track the gateway simulation
  const [paymentStep, setPaymentStep] = useState<'idle' | 'authorizing' | 'success'>('idle');

  const [formData, setFormData] = useState({
    name: 'John Doe',
    email: '', 
    phone: '+254 712 345 678',
    address: 'Nairobi Central Business District, Warehouse 4',
    paymentMethod: 'M-Pesa Escrow'
  });

  const deliveryFee = 2500; 
  const finalTotal = getCartTotal() + deliveryFee;

  useEffect(() => {
    const requireLogin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert("Please log in or register to complete your order.");
        router.push('/login'); 
      } else {
        setFormData(prev => ({ ...prev, email: user.email || '' }));
        setIsAuthChecking(false); 
      }
    };
    requireLogin();
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Double Lock Auth Check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert("Your session has expired. Please log in again.");
      router.push('/login');
      return;
    }

    const uniqueFarmers = [...new Set(cart.map(item => item.farmerId))];
    for (const farmerId of uniqueFarmers) {
      if (!farmerId) {
        alert("Error: Missing Farmer ID! Please clear your cart and try again.");
        return;
      }
    }

    // THE FIX 2: Intercept the DB call and start the Payment Simulation instead!
    setPaymentStep('authorizing');

    // Simulate a 3-second network request to M-Pesa / Bank
    setTimeout(async () => {
      setPaymentStep('success');

      // Wait 1 second to let the user read "Payment Successful", THEN save the order
      setTimeout(async () => {
        try {
          for (const farmerId of uniqueFarmers) {
            const farmerItems = cart.filter(item => item.farmerId === farmerId);
            const farmerSubtotal = farmerItems.reduce((sum, item) => sum + (item.price * item.qty), 0);

            const { error } = await supabase.from('orders').insert({
              farmer_id: farmerId,
              total_amount: farmerSubtotal,
              buyer_name: formData.name,
              buyer_email: formData.email,
              delivery_address: formData.address,
              payment_method: formData.paymentMethod,
              status: 'Processing'
            });

            if (error) {
              console.error("Supabase Error:", error);
              alert(`Database Error: ${error.message}`);
              setPaymentStep('idle');
              return;
            }
          }

          clearCart();
          router.push('/checkout/success'); 
          
        } catch (err) {
          alert("Error placing order. Please try again.");
          console.error(err);
          setPaymentStep('idle');
        }
      }, 1000);

    }, 3000);
  };

  if (isAuthChecking) {
    return (
      <div className="bg-background min-h-screen flex flex-col">
        <MarketplaceNavbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-surface-container-high border-t-primary rounded-full animate-spin"></div>
            <p className="font-bold text-on-surface-variant">Verifying secure session...</p>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="bg-background min-h-screen flex flex-col">
        <MarketplaceNavbar />
        <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 md:px-12 py-12">
          <BackButton label="Back to Marketplace" />
          <div className="bg-white rounded-2xl border border-outline-variant p-16 text-center elevation-1 mt-8">
            <span className="material-symbols-outlined text-6xl text-outline mb-4">shopping_cart</span>
            <h2 className="text-2xl font-bold text-on-surface mb-2">Your Cart is Empty</h2>
            <p className="text-on-surface-variant mb-8">Looks like you haven't added any produce to your cart yet.</p>
            <Link href="/marketplace" className="bg-primary text-white px-8 py-3 rounded-lg font-bold shadow-sm hover:brightness-110 transition-all">
              Browse Marketplace
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <>
      <div className="bg-background min-h-screen flex flex-col">
        <MarketplaceNavbar />
        
        <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 md:px-12 py-8 animate-in fade-in duration-300">
          <BackButton label="Back to Marketplace" />

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-on-surface mb-2 tracking-tight">Secure Checkout</h1>
            <p className="text-on-surface-variant">Review your order, confirm delivery details, and complete your purchase.</p>
          </div>

          <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            
            {/* LEFT COLUMN: Delivery & Payment Details */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Delivery Details */}
              <div className="bg-white rounded-xl border border-outline-variant p-6 md:p-8 elevation-1">
                <h2 className="text-xl font-bold text-on-surface mb-6 border-b border-outline-variant pb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">local_shipping</span>
                  Delivery Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-on-surface-variant">Full Name / Company</label>
                    <input required name="name" value={formData.name} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-outline-variant focus:border-primary outline-none bg-surface" type="text" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-on-surface-variant">Email Address</label>
                    <input required name="email" value={formData.email} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-outline-variant focus:border-primary outline-none bg-surface" type="email" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-on-surface-variant">Phone Number</label>
                    <input required name="phone" value={formData.phone} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-outline-variant focus:border-primary outline-none bg-surface" type="tel" />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-bold text-on-surface-variant">Full Delivery Address</label>
                    <textarea required name="address" value={formData.address} onChange={handleInputChange} rows={3} className="w-full p-3 rounded-lg border border-outline-variant focus:border-primary outline-none bg-surface resize-none" />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-xl border border-outline-variant p-6 md:p-8 elevation-1">
                <h2 className="text-xl font-bold text-on-surface mb-6 border-b border-outline-variant pb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">payments</span>
                  Payment Method
                </h2>
                
                <div className="space-y-4">
                  <label className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all ${formData.paymentMethod === 'M-Pesa Escrow' ? 'border-primary bg-primary/5' : 'border-outline-variant hover:border-primary/50'}`}>
                    <div className="flex items-center gap-4">
                      <input type="radio" name="paymentMethod" value="M-Pesa Escrow" checked={formData.paymentMethod === 'M-Pesa Escrow'} onChange={handleInputChange} className="w-5 h-5 text-primary focus:ring-primary" />
                      <div>
                        <p className="font-bold text-on-surface">Khetify Escrow (M-Pesa)</p>
                        <p className="text-sm text-on-surface-variant">Funds held safely until delivery is confirmed.</p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-3xl text-[#059669]">send_to_mobile</span>
                  </label>

                  <label className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all ${formData.paymentMethod === 'Bank Transfer' ? 'border-primary bg-primary/5' : 'border-outline-variant hover:border-primary/50'}`}>
                    <div className="flex items-center gap-4">
                      <input type="radio" name="paymentMethod" value="Bank Transfer" checked={formData.paymentMethod === 'Bank Transfer'} onChange={handleInputChange} className="w-5 h-5 text-primary focus:ring-primary" />
                      <div>
                        <p className="font-bold text-on-surface">Direct Bank Transfer</p>
                        <p className="text-sm text-on-surface-variant">Takes 1-2 business days to clear.</p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-3xl text-outline">account_balance</span>
                  </label>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Order Summary */}
            <div className="space-y-6 relative">
              <div className="sticky top-28 bg-white rounded-xl border border-outline-variant p-6 md:p-8 elevation-1">
                <h2 className="text-xl font-bold text-on-surface mb-6 border-b border-outline-variant pb-4">Order Summary</h2>
                
                <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 hide-scrollbar">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-16 h-16 rounded-lg bg-surface-container overflow-hidden shrink-0 border border-outline-variant">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-sm text-on-surface line-clamp-1">{item.name}</p>
                        <p className="text-xs text-on-surface-variant mb-1">{item.farm}</p>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs font-bold text-on-surface-variant bg-surface-container px-2 py-0.5 rounded">Qty: {item.qty}</span>
                          <span className="text-sm font-bold text-primary">INR {(item.price * item.qty).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-[#fe932c]/10 border border-[#fe932c]/20 rounded-lg p-3 mb-6 flex items-start gap-2">
                  <span className="material-symbols-outlined text-[#904d00] text-[18px]">info</span>
                  <p className="text-xs font-medium text-[#904d00] leading-tight">
                    Your cart contains items from {new Set(cart.map(c => c.farmerId)).size} different farms. Khetify will split and route your orders securely.
                  </p>
                </div>

                <div className="border-t border-outline-variant pt-4 space-y-3 mb-6">
                  <div className="flex justify-between text-sm text-on-surface-variant">
                    <span>Subtotal ({getCartCount()} items)</span>
                    <span className="font-bold text-on-surface">INR {getCartTotal().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-on-surface-variant">
                    <span>Logistics & Delivery</span>
                    <span className="font-bold text-on-surface">INR {deliveryFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-lg border-t border-outline-variant pt-3 mt-3">
                    <span className="font-bold text-on-surface">Total Payable</span>
                    <span className="font-bold text-primary">INR {finalTotal.toLocaleString()}</span>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={paymentStep !== 'idle'}
                  className="w-full py-4 bg-[#D97706] text-white font-bold rounded-lg shadow-sm hover:bg-[#b05f02] transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span className="material-symbols-outlined">lock</span>
                  Confirm & Pay
                </button>
              </div>
            </div>
          </form>
        </main>
      </div>

      {/* THE FIX 3: THE PAYMENT GATEWAY MODAL */}
      {paymentStep !== 'idle' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl shadow-2xl border border-outline-variant p-8 max-w-sm w-full mx-4 flex flex-col items-center text-center animate-in zoom-in-95">
            
            {paymentStep === 'authorizing' ? (
              <>
                {/* Processing State */}
                <div className="relative w-24 h-24 mb-6">
                  <div className="absolute inset-0 border-4 border-surface-container-high rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-4xl">lock</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-on-surface mb-2">Processing Payment</h3>
                <p className="text-on-surface-variant text-sm mb-4">
                  {formData.paymentMethod === 'M-Pesa Escrow' 
                    ? `Sending STK Push to ${formData.phone}. Please check your phone to authorize INR ${finalTotal.toLocaleString()}.` 
                    : `Contacting your bank to authorize INR ${finalTotal.toLocaleString()} securely.`}
                </p>
                <p className="text-[10px] font-bold text-primary uppercase tracking-wider animate-pulse">Do not close this window</p>
              </>
            ) : (
              <>
                {/* Success State */}
                <div className="w-24 h-24 bg-[#E0F2E9] rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-300">
                  <span className="material-symbols-outlined text-5xl text-[#059669]">check_circle</span>
                </div>
                <h3 className="text-2xl font-bold text-on-surface mb-2">Payment Successful!</h3>
                <p className="text-on-surface-variant text-sm">Funds have been secured in Escrow. Securing your order now...</p>
              </>
            )}

          </div>
        </div>
      )}
    </>
  );
}