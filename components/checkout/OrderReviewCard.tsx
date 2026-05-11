'use client';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

export default function OrderReviewCard() {
  const { cart, removeFromCart, updateQuantity } = useCart();

  if (cart.length === 0) {
    return (
      <section className="bg-surface-container-lowest p-8 rounded-lg border border-outline-variant elevation-1 text-center">
        <span className="material-symbols-outlined text-6xl text-outline mb-4">shopping_cart</span>
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-on-surface-variant mb-6">Looks like you haven't added any fresh produce yet.</p>
        <Link href="/marketplace" className="bg-primary text-white px-6 py-3 rounded-lg font-bold">
          Explore Marketplace
        </Link>
      </section>
    );
  }

  return (
    <section className="bg-surface-container-lowest p-6 rounded-lg border border-outline-variant elevation-1">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">shopping_basket</span>
        Order Review
      </h2>
      
      <div className="space-y-6">
        {cart.map((item) => (
          <div key={item.id} className="flex flex-col sm:flex-row sm:items-center gap-4 py-4 border-b border-outline-variant last:border-0 group">
            <img 
              alt={item.name} 
              className="w-20 h-20 rounded-lg object-cover border border-outline-variant shrink-0" 
              src={item.image}
            />
            
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{item.name}</h3>
              
              {/* Dynamic Quantity Stepper */}
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center border border-outline-variant rounded-lg overflow-hidden bg-surface-container-low h-9 w-28">
                  <button 
                    onClick={() => updateQuantity(item.id, item.qty - 1)}
                    className="flex-1 h-full flex items-center justify-center hover:bg-surface-variant text-on-surface-variant transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">remove</span>
                  </button>
                  <span className="w-10 text-center font-bold text-sm bg-white h-full flex items-center justify-center border-x border-outline-variant">
                    {item.qty}
                  </span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.qty + 1)}
                    className="flex-1 h-full flex items-center justify-center hover:bg-surface-variant text-on-surface-variant transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">add</span>
                  </button>
                </div>

                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="text-xs font-bold text-[#ba1a1a] uppercase opacity-0 group-hover:opacity-100 transition-opacity hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>

            <div className="text-left sm:text-right mt-2 sm:mt-0">
              <span className="font-bold text-primary text-lg block">KES {(item.price * item.qty).toFixed(2)}</span>
              <span className="text-xs text-on-surface-variant font-medium">KES {item.price.toFixed(2)} each</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}