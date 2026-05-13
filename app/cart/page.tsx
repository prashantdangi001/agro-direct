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
      <div className="bg-[#F8FAFC] min-h-screen flex flex-col font-sans">
        <MarketplaceNavbar />
        <main className="flex-1 flex flex-col items-center justify-center p-12 animate-in fade-in duration-500">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-5xl text-slate-300">shopping_cart_off</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Your cart is empty</h1>
          <p className="text-slate-500 mb-8 font-medium italic">Discover fresh produce from local farmers.</p>
          <Link href="/marketplace" className="bg-primary text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-primary/30 transition-transform hover:scale-105">
            Back to Marketplace
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-[#F8FAFC] min-h-screen flex flex-col font-sans">
      <MarketplaceNavbar />

      <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 md:px-12 py-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        <div className="mb-10">
          <Link href="/marketplace" className="inline-flex items-center gap-2 text-sm font-black text-slate-400 hover:text-primary transition-colors group">
            <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-1 transition-transform">arrow_back</span> Continue Shopping
          </Link>
          <div className="flex items-center justify-between mt-4">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">My Shopping Cart</h1>
            <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-primary/20">
              {getCartCount()} {getCartCount() === 1 ? 'Item' : 'Items'}
            </span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
          
          {/* LEFT: CART ITEMS LIST */}
          <div className="w-full lg:w-7/12 space-y-6">
            <div className="bg-white border border-slate-200 rounded-[40px] overflow-hidden shadow-sm">
              <div className="divide-y divide-slate-100">
                {cart.map((item) => (
                  <div key={item.id} className="p-8 flex flex-col md:flex-row items-center gap-6 group hover:bg-slate-50/50 transition-colors">
                    
                    {/* Item Image */}
                    <div className="w-28 h-28 bg-slate-50 rounded-[28px] overflow-hidden border border-slate-100 shadow-inner shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="font-black text-xl text-slate-900 leading-tight">{item.name}</h3>
                      <p className="text-sm font-bold text-primary mt-1">{item.farm}</p>
                      <div className="mt-4 flex items-center justify-center md:justify-start gap-4">
                        <p className="text-lg font-black text-slate-900 tracking-tight">₹{item.price.toLocaleString()}</p>
                        <span className="text-xs font-bold text-slate-400">per unit</span>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
                      <button 
                        onClick={() => updateQuantity(item.id, item.qty - 1)}
                        className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-600 hover:text-primary hover:shadow-md transition-all active:scale-90"
                      >
                        <span className="material-symbols-outlined text-[20px]">remove</span>
                      </button>
                      <span className="w-12 text-center font-black text-slate-900 text-lg">{item.qty}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.qty + 1)}
                        className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-600 hover:text-primary hover:shadow-md transition-all active:scale-90"
                      >
                        <span className="material-symbols-outlined text-[20px]">add</span>
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="p-3 text-slate-300 hover:text-red-500 transition-colors"
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: CART SUMMARY */}
          <div className="w-full lg:w-5/12">
            <div className="bg-slate-900 rounded-[40px] p-8 md:p-12 text-white shadow-2xl sticky top-24">
              <h2 className="text-2xl font-black mb-10 uppercase tracking-[0.2em] text-primary">Summary</h2>
              
              <div className="space-y-6 mb-10 pb-10 border-b border-white/10">
                <div className="flex justify-between items-center text-white/60 font-bold">
                  <span>Subtotal</span>
                  <span className="text-white text-xl font-black">₹{getCartTotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-white/60 font-bold">
                  <span>Logistics & Escrow Fee</span>
                  <span className="text-[#10b981] font-black uppercase tracking-widest text-xs">FREE (0%)</span>
                </div>
              </div>

              <div className="flex justify-between items-end mb-12">
                <span className="text-sm font-black uppercase tracking-[0.2em] text-white/40">Estimated Total</span>
                <span className="text-5xl font-black text-white tracking-tighter">₹{getCartTotal().toLocaleString()}</span>
              </div>

              <button 
                onClick={() => router.push('/checkout')}
                className="w-full bg-primary text-white py-5 rounded-2xl font-black text-xl hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-primary/30 flex items-center justify-center gap-3 group"
              >
                Secure Checkout
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>

              <div className="mt-10 pt-10 border-t border-white/5 flex items-center gap-4">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">verified_user</span>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Guaranteed Safety</p>
                  <p className="text-xs text-white/80 font-bold italic leading-relaxed">Your payment is only released to the farmer after you verify the quality at delivery.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}