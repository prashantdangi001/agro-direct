'use client';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';

interface ProductCardProps {
  id: string;
  name: string;
  farm: string;
  price: string | number;
  unit: string;
  tag?: string;
  image: string;
  farmerId: string; // <-- THE CRITICAL MISSING LINK
}

export default function ProductCard({ id, name, farm, price, unit, tag, image, farmerId }: ProductCardProps) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  // Extract numeric price safely whether it comes in as "INR 150" or just 150
  const numericPrice = typeof price === 'string' ? parseFloat(price.replace(/[^0-9.]/g, '')) : price;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevents the click from redirecting to the product page
    
    addToCart({
      id,
      name,
      price: numericPrice,
      qty: 1,
      image,
      farm,
      farmerId // <-- This ensures the Checkout knows who to pay!
    });
    
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <Link href={`/marketplace/${id}`} className="group bg-white border border-outline-variant rounded-xl overflow-hidden elevation-1 hover:shadow-md transition-all flex flex-col h-full">
      <div className="relative h-48 w-full bg-surface-container-high overflow-hidden">
        <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        {tag && (
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-xs font-bold px-2.5 py-1 rounded-md text-on-surface shadow-sm">
            {tag}
          </div>
        )}
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2 gap-2">
          <h3 className="font-bold text-lg text-on-surface line-clamp-1">{name}</h3>
        </div>
        <p className="text-sm text-on-surface-variant mb-4 flex items-center gap-1">
          <span className="material-symbols-outlined text-[16px]">storefront</span>
          {farm}
        </p>
        <div className="mt-auto flex items-center justify-between">
          <div>
            <p className="font-bold text-primary text-lg">INR {numericPrice.toFixed(2)}</p>
            <p className="text-xs text-on-surface-variant font-medium">per {unit}</p>
          </div>
          <button 
            onClick={handleAddToCart}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm ${
              added ? 'bg-[#059669] text-white' : 'bg-primary-container text-on-primary-container hover:bg-primary hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">
              {added ? 'check' : 'add_shopping_cart'}
            </span>
          </button>
        </div>
      </div>
    </Link>
  );
}