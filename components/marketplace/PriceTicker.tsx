import React from 'react';

interface PriceTickerProps {
  label: string;
  change: string;
}

export default function PriceTicker({ label, change }: PriceTickerProps) {
  return (
    <div className="flex items-center gap-2 bg-surface-container-high px-4 py-2 rounded-full border border-outline-variant transition-all hover:bg-surface-container-highest cursor-default elevation-1">
      {/* Label using on-surface-variant per DESIGN.md */}
      <span className="text-sm font-semibold text-on-surface-variant">
        Market Price:
      </span>
      
      {/* Success state using Primary Emerald Green */}
      <div className="flex items-center gap-1">
        <span className="text-sm font-bold text-primary">
          {label} {change}
        </span>
        <span className="material-symbols-outlined text-primary text-[18px] font-bold">
          trending_up
        </span>
      </div>
    </div>
  );
}