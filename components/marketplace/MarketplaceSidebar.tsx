'use client';
import { useRouter, useSearchParams } from 'next/navigation';

export default function MarketplaceSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read current state from the URL (Defaults to 'All Produce')
  const currentTab = searchParams.get('tab') || 'All Produce';
  const selectedCategories = searchParams.getAll('category');

  // Handle Tab Clicks
  const handleTabChange = (tabName: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', tabName);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  // Handle Checkbox Toggles
  const handleCategoryToggle = (cat: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Next.js URLSearchParams requires deleting and re-appending array values
    if (selectedCategories.includes(cat)) {
      params.delete('category');
      selectedCategories.filter(c => c !== cat).forEach(c => params.append('category', c));
    } else {
      params.append('category', cat);
    }
    
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const tabs = [
    { name: 'All Produce', icon: 'agriculture' },
    { name: 'Organic', icon: 'eco' },
    { name: 'Bulk Orders', icon: 'local_shipping' },
    { name: 'Nearby Farmers', icon: 'distance' },
    { name: 'Traceability', icon: 'qr_code_2' }
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 p-6 border-r border-outline-variant bg-surface-container-low fixed h-[calc(100vh-64px)] overflow-y-auto z-10">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-primary mb-1">Marketplace</h2>
        <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Direct from source</p>
      </div>

      <nav className="space-y-1 mb-8">
        {tabs.map((item) => (
          <button 
            key={item.name}
            onClick={() => handleTabChange(item.name)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold text-sm transition-all ${
              currentTab === item.name ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            {item.name}
          </button>
        ))}
      </nav>

      <div className="space-y-6 pt-6 border-t border-outline-variant">
        <div>
          <p className="text-[10px] font-bold text-primary uppercase mb-4 tracking-widest">Filters</p>
          <div className="space-y-3">
            <p className="text-sm font-bold text-on-surface">Category</p>
            {['Vegetables', 'Grains', 'Fruits'].map(cat => (
              <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={selectedCategories.includes(cat)}
                  onChange={() => handleCategoryToggle(cat)}
                  className="w-4 h-4 rounded border-outline text-primary focus:ring-primary" 
                />
                <span className="text-sm text-on-surface-variant group-hover:text-on-surface transition-colors">{cat}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm font-bold text-on-surface">Distance from Me</p>
            <span className="text-xs font-bold text-primary">25 km</span>
          </div>
          <input type="range" className="w-full h-1.5 bg-outline-variant rounded-lg appearance-none cursor-pointer accent-primary" />
        </div>
      </div>

      <button className="mt-auto bg-primary text-white py-3 rounded-lg font-bold text-sm hover:brightness-110 active:scale-95 transition-all shadow-sm">
        Become a Seller
      </button>
    </aside>
  );
}