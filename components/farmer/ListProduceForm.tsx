'use client';

import { useState } from 'react';

export default function ListProduceForm() {
  return (
    <div className="bg-white border border-outline-variant rounded-lg p-6 elevation-1 max-w-2xl mx-auto">
      <h2 className="font-headline-md text-2xl mb-6 text-primary">List New Produce</h2>
      
      <form className="space-y-6">
        {/* Crop Name */}
        <div>
          <label className="block font-label-md text-sm mb-2 text-on-surface">Crop Name</label>
          <input 
            type="text" 
            placeholder="e.g. Organic Sharbati Wheat"
            className="w-full p-3 rounded-lg border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Price */}
          <div>
            <label className="block font-label-md text-sm mb-2 text-on-surface">Price (₹)</label>
            <input 
              type="number" 
              placeholder="0.00"
              className="w-full p-3 rounded-lg border border-outline-variant focus:border-primary outline-none"
            />
          </div>
          {/* Unit */}
          <div>
            <label className="block font-label-md text-sm mb-2 text-on-surface">Unit</label>
            <select className="w-full p-3 rounded-lg border border-outline-variant focus:border-primary outline-none bg-white">
              <option>per kg</option>
              <option>per Quintal</option>
              <option>per Bunch</option>
            </select>
          </div>
        </div>

        {/* Quantity Available */}
        <div>
          <label className="block font-label-md text-sm mb-2 text-on-surface">Total Quantity Available</label>
          <input 
            type="number" 
            placeholder="e.g. 500"
            className="w-full p-3 rounded-lg border border-outline-variant focus:border-primary outline-none"
          />
        </div>

        {/* Action Button: Warm Amber (#fe932c) */}
        <button 
          type="submit"
          className="w-full bg-[#fe932c] hover:bg-[#6e3900] text-[#663500] hover:text-white py-4 rounded-lg font-bold text-lg transition-all shadow-md active:scale-[0.98]"
        >
          List Product for Sale
        </button>
      </form>
    </div>
  );
}