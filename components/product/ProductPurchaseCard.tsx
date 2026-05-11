'use client';
import { useState } from 'react';

export default function ProductPurchaseCard() {
  const [qty, setQty] = useState(1);

  return (
    <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant mb-8">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <span className="font-bold text-sm text-on-surface">Quantity (kg)</span>
          <div className="flex items-center border border-outline rounded-lg bg-white overflow-hidden">
            <button 
              onClick={() => setQty(Math.max(1, qty - 1))}
              className="p-3 hover:bg-surface-variant transition-colors"
            >
              <span className="material-symbols-outlined">remove</span>
            </button>
            <input 
              type="number" 
              className="w-16 text-center border-none bg-transparent focus:ring-0 font-bold" 
              value={qty}
              readOnly 
            />
            <button 
              onClick={() => setQty(qty + 1)}
              className="p-3 hover:bg-surface-variant transition-colors"
            >
              <span className="material-symbols-outlined">add</span>
            </button>
          </div>
        </div>
        
        {/* Action Button: Warm Amber (#fe932c) */}
        <button className="w-full bg-[#fe932c] hover:bg-[#6e3900] text-[#663500] hover:text-white py-4 rounded-lg font-bold text-lg shadow-sm transition-all active:scale-[0.98] flex justify-center items-center gap-3">
          <span className="material-symbols-outlined">shopping_basket</span>
          Add to Cart
        </button>
      </div>
    </div>
  );
}