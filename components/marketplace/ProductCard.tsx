interface ProductCardProps {
  name: string;
  farm: string;
  price: string;
  unit: string;
  tag?: string;
  image: string;
}

export default function ProductCard({ name, farm, price, unit, tag, image }: ProductCardProps) {
  return (
    <div className="bg-surface-container-lowest rounded-lg border border-outline-variant elevation-1 overflow-hidden group transition-all hover:shadow-md">
      <div className="relative h-56 overflow-hidden">
        <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        {tag && (
          <div className="absolute top-4 left-4 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm">
            {tag}
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold mb-1">{name}</h3>
            <div className="flex items-center gap-1 text-on-surface-variant text-sm">
              <span>{farm}</span>
              <span className="material-symbols-outlined text-primary text-base filled-icon">check_circle</span>
            </div>
          </div>
          <div className="text-right">
            <span className="block text-xl font-bold text-primary">{price}</span>
            <span className="text-xs text-on-surface-variant font-medium">per {unit}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center gap-2 text-on-surface-variant">
            <div className="w-8 h-8 bg-surface-container border border-outline-variant flex items-center justify-center rounded">
              <span className="material-symbols-outlined text-sm">qr_code_2</span>
            </div>
            <span className="text-[10px] leading-tight font-bold uppercase">Scan to<br/>Trace Origin</span>
          </div>
          
          {/* Action Button: Warm Amber (#fe932c) per DESIGN.md */}
          <button className="bg-secondary-container hover:bg-secondary text-on-secondary-container hover:text-white px-6 py-2 rounded-lg font-bold transition-all active:scale-95">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}