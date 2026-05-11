export default function MarketplaceSidebar({ className }: { className?: string }) {
  return (
    <aside className={`${className} flex-col w-64 p-6 border-r border-outline-variant bg-surface-container-lowest sticky top-[73px] h-[calc(100vh-73px)] overflow-y-auto`}>
      <div className="mb-8">
        <h2 className="text-xl font-bold text-primary mb-1">Marketplace</h2>
        <p className="text-xs text-on-surface-variant font-medium">Direct from source</p>
      </div>

      <nav className="flex flex-col gap-2 mb-8">
        <button className="flex items-center gap-3 bg-primary-container text-on-primary-container rounded-lg px-4 py-3">
          <span className="material-symbols-outlined">agriculture</span>
          <span className="font-semibold text-sm">All Produce</span>
        </button>
        {['Organic', 'Bulk Orders', 'Nearby Farmers', 'Traceability'].map((item, idx) => (
          <button key={idx} className="flex items-center gap-3 text-on-surface-variant hover:bg-surface-variant rounded-lg px-4 py-3 transition-all">
            <span className="material-symbols-outlined">
              {item === 'Organic' ? 'eco' : item === 'Bulk Orders' ? 'local_shipping' : item === 'Nearby Farmers' ? 'distance' : 'qr_code_2'}
            </span>
            <span className="font-semibold text-sm">{item}</span>
          </button>
        ))}
      </nav>

      <div className="pt-6 border-t border-outline-variant">
        <h3 className="text-sm font-bold text-primary mb-4">Filters</h3>
        <div className="space-y-6">
          <div>
            <span className="text-xs font-bold text-on-surface-variant block mb-2">Category</span>
            {['Vegetables', 'Grains', 'Fruits'].map((cat) => (
              <label key={cat} className="flex items-center gap-2 cursor-pointer mb-2">
                <input type="checkbox" className="rounded border-outline text-primary focus:ring-primary" />
                <span className="text-sm">{cat}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <button className="mt-auto bg-primary text-white py-3 px-4 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity">
        Become a Seller
      </button>
    </aside>
  );
}