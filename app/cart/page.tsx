'use client';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import MarketplaceNavbar from '@/components/layout/MarketplaceNavbar';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, getCartTotal, getCartCount } = useCart();
  const router = useRouter();

  if (cart.length === 0) {
    return (
      <div className="bg-[#F8FAF9] min-h-screen flex flex-col font-sans">
        <MarketplaceNavbar />
        <main className="flex-1 flex flex-col items-center justify-center p-12 animate-in fade-in duration-500">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-5xl text-primary">shopping_cart_off</span>
          </div>
          <h1 className="text-3xl font-black text-on-surface mb-2 tracking-tight">Your cart is empty</h1>
          <p className="text-on-surface-variant mb-8 font-medium italic">Discover fresh produce from local farmers.</p>
          <Link href="/marketplace" className="bg-primary text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-primary/30 transition-transform hover:scale-105">
            Back to Marketplace
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-[#F8FAF9] min-h-screen flex flex-col font-sans">
      <MarketplaceNavbar />

      <main className="flex-1 max-w-[1280px] w-full mx-auto px-6 md:px-12 py-12 animate-in fade-in duration-700">
        
        <header className="mb-12">
          <Link href="/marketplace" className="inline-flex items-center gap-2 text-sm font-black text-on-surface-variant hover:text-primary transition-all group">
            <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-1 transition-transform">arrow_back</span> Continue Shopping
          </Link>
          <div className="flex items-center justify-between mt-4">
            <h1 className="text-5xl font-black text-on-surface tracking-tighter uppercase italic">Shopping Cart</h1>
            <span className="bg-primary/10 text-primary px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest border border-primary/20">
              {getCartCount()} {getCartCount() === 1 ? 'Item' : 'Items'}
            </span>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* LEFT: CART ITEMS LIST */}
          <div className="w-full lg:w-7/12 space-y-6">
            <div className="bg-white border border-outline-variant rounded-[40px] overflow-hidden shadow-sm">
              <div className="divide-y divide-outline-variant/50">
                {cart.map((item) => (
                  <div key={item.id} className="p-8 flex flex-col md:flex-row items-center gap-6 group hover:bg-surface-container-lowest transition-colors">
                    
                    {/* Item Image */}
                    <div className="w-28 h-28 bg-surface-container-low rounded-[28px] overflow-hidden border border-outline-variant shadow-inner shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 text-center md:text-left w-full">
                      <h3 className="font-black text-xl text-on-surface leading-tight">{item.name}</h3>
                      <p className="text-xs font-bold text-primary uppercase tracking-widest mt-1">{item.farm}</p>
                      
                      <div className="mt-4 flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
                        <div className="flex items-center gap-2">
                          <p className="text-xl font-black text-on-surface tracking-tight">₹{item.price.toLocaleString()}</p>
                          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">/ unit</span>
                        </div>

                        {/* ✨ INTERACTIVE QUANTITY CONTROLS ✨ */}
                        <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto">
                          <div className="flex items-center gap-1 bg-surface-container-lowest p-1.5 rounded-2xl border border-outline-variant shadow-sm">
                            <button 
                              onClick={() => updateQuantity(item.id, item.qty - 1)}
                              className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-on-surface-variant hover:text-primary hover:shadow-md transition-all active:scale-95"
                            >
                              <span className="material-symbols-outlined text-[20px]">remove</span>
                            </button>
                            <span className="w-10 text-center font-black text-on-surface text-lg">{item.qty}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.qty + 1)}
                              className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-on-surface-variant hover:text-primary hover:shadow-md transition-all active:scale-95"
                            >
                              <span className="material-symbols-outlined text-[20px]">add</span>
                            </button>
                          </div>

                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="p-3 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-xl transition-all"
                            title="Remove Item"
                          >
                            <span className="material-symbols-outlined">delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: CART SUMMARY */}
          <div className="w-full lg:w-5/12">
            <div className="bg-white border border-outline-variant rounded-[48px] p-10 md:p-12 shadow-xl sticky top-24">
              <h2 className="text-xl font-black mb-8 uppercase tracking-widest text-on-surface border-b border-outline-variant/50 pb-6 flex items-center justify-between">
                Order Summary
                <span className="material-symbols-outlined text-on-surface-variant">shopping_bag</span>
              </h2>
              
              <div className="space-y-5 mb-8">
                <div className="flex justify-between items-center text-on-surface-variant font-bold">
                  <span>Subtotal</span>
                  <span className="text-on-surface font-black">₹{getCartTotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-on-surface-variant font-bold">
                  <span>Logistics & Escrow Fee</span>
                  <span className="text-primary font-black uppercase tracking-widest text-[10px] bg-primary/10 px-2 py-1 rounded-md border border-primary/20">FREE (0%)</span>
                </div>
              </div>

              <div className="bg-surface-container-lowest border-2 border-outline-variant rounded-[32px] p-8 mb-8">
                <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant block mb-1">Estimated Total</span>
                <span className="text-5xl font-black text-on-surface tracking-tighter">₹{getCartTotal().toLocaleString()}</span>
              </div>

              <button 
                onClick={() => router.push('/checkout')}
                className="w-full bg-primary text-white py-6 rounded-3xl font-black text-xl hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-primary/30 flex items-center justify-center gap-3 group"
              >
                Proceed to Checkout
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>

              <div className="mt-8 pt-8 border-t border-outline-variant/50 flex items-start gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                  <span className="material-symbols-outlined text-[20px]">verified_user</span>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-on-surface mb-1">Guaranteed Safety</p>
                  <p className="text-[11px] text-on-surface-variant font-medium italic leading-relaxed">Your payment is held safely in escrow and only released to the farmer after you verify the quality.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}