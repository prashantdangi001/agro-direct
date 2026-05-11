import Link from 'next/link';

export default function MarketplaceNavbar() {
  return (
    <header className="sticky top-0 w-full z-50 flex justify-between items-center px-4 md:px-12 py-4 max-w-[1280px] mx-auto bg-surface border-b border-outline-variant shadow-sm">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold text-primary">AgroDirect</h1>
      </div>
      
      {/* Search Bar */}
      <div className="flex-1 max-w-2xl mx-8 hidden md:flex items-center relative">
        <div className="relative w-full">
          <input 
            className="w-full bg-surface-container-low border border-outline-variant rounded-lg py-2 pl-4 pr-12 focus:border-primary focus:ring-1 focus:ring-primary outline-none" 
            placeholder="Search fresh produce..." 
            type="text"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <button className="p-2 text-on-surface-variant hover:bg-surface-variant rounded-full">
              <span className="material-symbols-outlined">mic</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-primary hover:bg-surface-container-high rounded-full">
          <span className="material-symbols-outlined">shopping_cart</span>
        </button>
        <div className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant">
          <img alt="Profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDklWqgV0_wRugQRIbzdRLMBggroVzyU335gBPbo-7oqZh-I2qsBLcPRUn7Mwb5FRTdL8Wx85wl9d2Vm0e4qIFYU2Kd509owTG9bGJhfhRe0dr0_eXAu3gyQpdr6C-Y_lxTrFhGnCEEzN9uUNoiklBjVjGDVqDRt3JVtRZr2MGQUCsNyIQK76YXwuq86HOhf-gXpE5WNsWHs8P6b1Bqf-SB4t_YFho3D3VR_trLG-2Ru1_v9YDDNYd2p3kFRTHkKQ1iqHw5cVUTAKcx" />
        </div>
      </div>
    </header>
  );
}