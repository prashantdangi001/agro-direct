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
    farmerId: string; // <-- ADDED FOR ISOLATION
  };
}

export default function ProductPurchaseCard({ product }: ProductPurchaseProps) {
  const { addToCart } = useCart();
  const router = useRouter();
  
  // Local state for the quantity stepper
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  // Handlers for the Stepper
  const handleIncrease = () => {
    if (quantity < product.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  // Add to Cart Logic
  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
      qty: quantity,
      image: product.image,
      farm: product.farm,
      farmerId: product.farmerId // <-- PASSING IT TO THE CART
    });

    // Show a quick success animation
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  // Buy Now Logic (Add to cart + Redirect to checkout)
  const handleBuyNow = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
      qty: quantity,
      image: product.image,
      farm: product.farm,
      farmerId: product.farmerId // <-- PASSING IT TO THE CART
    });
    router.push('/checkout');
  };

  // Ensure price is safely formatted
  const numericPrice = typeof product.price === 'string' ? parseFloat(product.price) : (product.price || 0);

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 md:p-8 elevation-1 shadow-sm">
      
      {/* Price Header */}
      <div className="mb-6">
        <div className="flex items-end gap-2 mb-1">
          <span className="text-4xl font-bold text-primary tracking-tight">INR {numericPrice.toFixed(2)}</span>
          <span className="text-on-surface-variant font-medium mb-1">/ {product.unit}</span>
        </div>
        <p className={`text-sm font-bold mt-2 ${product.stock > 10 ? 'text-[#006c4a]' : 'text-[#904d00]'}`}>
          {product.stock > 0 ? `${product.stock} ${product.unit} available in stock` : 'Out of Stock'}
        </p>
      </div>

      {/* Quantity Stepper */}
      <div className="mb-8">
        <label className="block text-sm font-bold text-on-surface mb-3">Select Quantity</label>
        <div className="flex items-center border border-outline-variant rounded-lg overflow-hidden bg-surface-container-low h-12 w-full max-w-[200px]">
          <button 
            onClick={handleDecrease}
            disabled={quantity <= 1}
            className="flex-1 h-full flex items-center justify-center hover:bg-surface-variant text-on-surface-variant transition-colors disabled:opacity-50"
          >
            <span className="material-symbols-outlined">remove</span>
          </button>
          <span className="w-16 text-center font-bold text-lg bg-white h-full flex items-center justify-center border-x border-outline-variant">
            {quantity}
          </span>
          <button 
            onClick={handleIncrease}
            disabled={quantity >= product.stock}
            className="flex-1 h-full flex items-center justify-center hover:bg-surface-variant text-on-surface-variant transition-colors disabled:opacity-50"
          >
            <span className="material-symbols-outlined">add</span>
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button 
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={`w-full py-4 rounded-lg font-bold text-lg shadow-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
            added ? 'bg-primary-container text-on-primary-container border border-primary/20' : 'bg-surface-container-high hover:bg-surface-container-highest text-on-surface border border-outline-variant'
          }`}
        >
          {added ? (
            <><span className="material-symbols-outlined text-primary">check_circle</span> Added to Cart</>
          ) : (
            <><span className="material-symbols-outlined">add_shopping_cart</span> Add to Cart</>
          )}
        </button>

        <button 
          onClick={handleBuyNow}
          disabled={product.stock === 0}
          className="w-full py-4 rounded-lg font-bold text-lg text-white bg-[#D97706] hover:bg-[#b05f02] shadow-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined">bolt</span>
          Buy it Now
        </button>
      </div>

      {/* Trust Badges */}
      <div className="mt-8 pt-6 border-t border-outline-variant space-y-4">
        <div className="flex items-center gap-3 text-on-surface-variant">
          <span className="material-symbols-outlined text-primary">verified_user</span>
          <span className="text-sm font-medium">Secure Escrow Payment</span>
        </div>
        <div className="flex items-center gap-3 text-on-surface-variant">
          <span className="material-symbols-outlined text-primary">local_shipping</span>
          <span className="text-sm font-medium">Direct Farm-to-Door Logistics</span>
        </div>
      </div>
    </div>
  );
}