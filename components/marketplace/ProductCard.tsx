'use client';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';
import Link from 'next/link'; // ADD THIS

interface ProductCardProps {
  id: string;
  name: string;
  farm: string;
  price: string;
  unit: string;
  tag?: string;
  image: string;
}

export default function ProductCard({ id, name, farm, price, unit, tag, image }: ProductCardProps) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const numericPrice = parseFloat(price.replace(/[^\d.]/g, '')) || 0;

  const handleAddToCart = () => {
    addToCart({ id, name, price: numericPrice, qty: 1, image, farm });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="bg-white rounded-lg border border-outline-variant overflow-hidden elevation-1 group hover:shadow-md transition-all flex flex-col">
      {/* WRAP IMAGE IN LINK */}
      <Link href={`/marketplace/${id}`} className="relative h-52 overflow-hidden block">
        <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        {tag && (
          <span className="absolute top-3 left-3 bg-primary/10 text-primary border border-primary/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase">
            {tag}
          </span>
        )}
      </Link>

      <div className="p-5 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div>
            {/* WRAP TITLE IN LINK */}
            <Link href={`/marketplace/${id}`}>
              <h3 className="text-lg font-bold text-on-surface leading-tight mb-1 hover:text-primary transition-colors">{name}</h3>
            </Link>
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
          <Link href={`/marketplace/${id}`} className="flex items-center gap-2 text-on-surface-variant group/trace cursor-pointer">
            <div className="w-8 h-8 bg-surface-container border border-outline-variant flex items-center justify-center rounded group-hover/trace:border-primary transition-colors">
              <span className="material-symbols-outlined text-sm">qr_code_2</span>
            </div>
            <span className="text-[9px] leading-tight font-bold uppercase group-hover/trace:text-primary transition-colors">Scan to<br/>Trace Origin</span>
          </Link>
          
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