'use client';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';

interface ProductCardProps {
  id?: string;
  name: string;
  farm: string;
  price: string;
  unit: string;
  tag?: string;
  image: string;
}

export default function ProductCard({ id = "temp-id", name, farm, price, unit, tag, image }: ProductCardProps) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  // Extract the numeric value from the price string (e.g., "INR 150.00" -> 150)
  const numericPrice = parseFloat(price.replace(/[^\d.]/g, '')) || 0;

  const handleAddToCart = () => {
    addToCart({
      id: name, // Using name as ID for the demo if ID isn't passed
      name,
      price: numericPrice,
      qty: 1,
      image,
      farm
    });
    
    // Show brief feedback animation
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="bg-white rounded-lg border border-outline-variant overflow-hidden elevation-1 group hover:shadow-md transition-all flex flex-col">
      <div className="relative h-52 overflow-hidden">
        <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        {tag && (
          <span className="absolute top-3 left-3 bg-primary/10 text-primary border border-primary/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase">
            {tag}
          </span>
        )}
      </div>

      <div className="p-5 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-bold text-on-surface leading-tight mb-1">{name}</h3>
            <div className="flex items-center gap-1 text-on-surface-variant text-xs">
              <span>{farm}</span>
              <span className="material-symbols-outlined text-primary text-sm filled-icon" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            </div>
          </div>
          <div className="text-right">
            <span className="block font-bold text-primary text-lg">{price}</span>
            <span className="text-[10px] text-on-surface-variant font-bold uppercase">per {unit}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-auto pt-6">
          <div className="flex items-center gap-2 text-on-surface-variant group/trace cursor-pointer">
            <div className="w-8 h-8 bg-surface-container border border-outline-variant flex items-center justify-center rounded group-hover/trace:border-primary transition-colors">
              <span className="material-symbols-outlined text-sm">qr_code_2</span>
            </div>
            <span className="text-[9px] leading-tight font-bold uppercase">Scan to<br/>Trace Origin</span>
          </div>
          
          <button 
            onClick={handleAddToCart}
            className={`px-5 py-2 rounded-lg text-sm font-bold shadow-sm transition-all active:scale-95 flex items-center gap-1 ${
              added ? 'bg-primary text-white' : 'bg-[#D97706] hover:bg-[#904d00] text-white'
            }`}
          >
            {added ? <><span className="material-symbols-outlined text-sm">check</span> Added</> : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}