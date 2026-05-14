'use client';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

interface ProductPurchaseProps {
  product: {
    id: string;
    name: string;
    price: number;
    unit: string;
    stock: number;
    image: string;
    farm: string;
    farmerId: string;
  };
}

export default function ProductPurchaseCard({ product }: ProductPurchaseProps) {
  const { addToCart } = useCart();
  const router = useRouter();
  
  // Local state for the quantity stepper
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleIncrease = () => {
    if (quantity < product.stock) setQuantity(prev => prev + 1);
  };

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(prev => prev - 1);
  };

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
      qty: quantity,
      image: product.image,
      farm: product.farm,
      farmerId: product.farmerId
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
      qty: quantity,
      image: product.image,
      farm: product.farm,
      farmerId: product.farmerId 
    });
    router.push('/checkout');
  };

  // Ensure price is safely formatted
  const numericPrice = typeof product.price === 'string' ? parseFloat(product.price) : (product.price || 0);
  
  // ✨ REAL-TIME TOTAL CALCULATION ✨
  const currentTotal = numericPrice * quantity;

  return (
    <div className="bg-white border border-outline-variant rounded-[40px] p-8 md:p-10 shadow-xl relative overflow-hidden group">
      
      {/* Base Price Header */}
      <div className="mb-8 border-b border-outline-variant/50 pb-8">
        <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-2">Base Price</p>
        <div className="flex items-end gap-2 mb-1">
          <span className="text-4xl font-black text-primary tracking-tighter">₹{numericPrice.toLocaleString()}</span>
          <span className="text-on-surface-variant font-bold text-sm mb-1 uppercase tracking-widest">/ {product.unit}</span>
        </div>
        <p className={`text-xs font-black uppercase tracking-widest mt-3 ${product.stock > 10 ? 'text-[#10b981]' : 'text-amber-500'}`}>
          {product.stock > 0 ? `● ${product.stock} ${product.unit} Available` : '● Out of Stock'}
        </p>
      </div>

      {/* Quantity Stepper */}
      <div className="mb-8">
        <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-4">Select Harvest Quantity</label>
        <div className="flex items-center border-2 border-outline-variant rounded-2xl overflow-hidden bg-surface-container-lowest h-16 w-full shadow-sm transition-all hover:border-primary/50 focus-within:border-primary">
          <button 
            onClick={handleDecrease}
            disabled={quantity <= 1}
            className="flex-1 h-full flex items-center justify-center hover:bg-surface-variant text-on-surface-variant hover:text-primary transition-all disabled:opacity-50 disabled:hover:bg-transparent active:scale-95"
          >
            <span className="material-symbols-outlined text-[24px]">remove</span>
          </button>
          
          <div className="w-20 h-full flex flex-col items-center justify-center bg-white border-x border-outline-variant">
            <span className="font-black text-2xl text-on-surface leading-none">{quantity}</span>
          </div>

          <button 
            onClick={handleIncrease}
            disabled={quantity >= product.stock}
            className="flex-1 h-full flex items-center justify-center hover:bg-surface-variant text-on-surface-variant hover:text-primary transition-all disabled:opacity-50 disabled:hover:bg-transparent active:scale-95"
          >
            <span className="material-symbols-outlined text-[24px]">add</span>
          </button>
        </div>
      </div>

      {/* ✨ REAL-TIME TOTAL SUMMARY ✨ */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-[24px] p-6 mb-8 flex justify-between items-center transition-all duration-300">
         <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant block mb-1">Estimated Total</span>
            <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded uppercase tracking-wider">No Fees</span>
         </div>
         <span className="text-3xl font-black text-on-surface tracking-tighter transition-all duration-300">
           ₹{currentTotal.toLocaleString()}
         </span>
      </div>

      {/* Action Buttons */}
      <div className="space-y-4">
        <button 
          onClick={handleBuyNow}
          disabled={product.stock === 0}
          className="w-full py-5 rounded-2xl font-black text-lg text-white bg-primary shadow-xl shadow-primary/30 transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          Proceed to Checkout
          <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </button>

        <button 
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={`w-full py-4 rounded-2xl font-black text-sm shadow-sm transition-all hover:-translate-y-0.5 active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest ${
            added 
              ? 'bg-green-500/10 text-green-600 border-2 border-green-500/20' 
              : 'bg-white hover:bg-surface-container-low text-on-surface border-2 border-outline-variant hover:border-primary'
          }`}
        >
          {added ? (
            <><span className="material-symbols-outlined text-green-600">check_circle</span> Added to Cart</>
          ) : (
            <><span className="material-symbols-outlined">add_shopping_cart</span> Add to Cart</>
          )}
        </button>
      </div>

      {/* Trust Badges */}
      <div className="mt-8 pt-8 border-t border-outline-variant/50 space-y-4">
        <div className="flex items-center gap-4 text-on-surface-variant">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
             <span className="material-symbols-outlined text-[20px]">verified_user</span>
          </div>
          <p className="text-xs font-bold leading-relaxed">Payment secured by Khetify Escrow.</p>
        </div>
        <div className="flex items-center gap-4 text-on-surface-variant">
          <div className="w-10 h-10 rounded-xl bg-[#D97706]/10 text-[#D97706] flex items-center justify-center shrink-0">
             <span className="material-symbols-outlined text-[20px]">local_shipping</span>
          </div>
          <p className="text-xs font-bold leading-relaxed">Direct Farm-to-Door Dispatch.</p>
        </div>
      </div>
    </div>
  );
}