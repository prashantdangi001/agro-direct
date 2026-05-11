'use client';

export default function AddListingForm() {
  return (
    <section className="bg-white rounded-lg border border-outline-variant elevation-1 p-6 md:p-10">
      <form className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Left Column: Text Inputs */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-on-surface mb-2">Produce Name</label>
              <input 
                type="text" 
                placeholder="e.g. Red Sweet Onions" 
                className="w-full h-12 px-4 rounded-lg border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
            </div>

           <div>
  <label className="block text-sm font-bold text-on-surface mb-2">Category</label>
  <select 
    defaultValue="" 
    className="w-full h-12 px-4 rounded-lg border border-outline-variant focus:border-primary outline-none bg-surface-bright"
  >
    <option value="" disabled>Select a Category</option>
    <option value="vegetables">Vegetables</option>
    <option value="grains">Grains</option>
    <option value="fruits">Fruits</option>
  </select>
</div>

            <div>
              <label className="block text-sm font-bold text-on-surface mb-2">Price per kg</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-bold text-sm">KES</span>
                <input 
                  type="number" 
                  placeholder="0.00" 
                  className="w-full h-12 pl-16 pr-4 rounded-lg border border-outline-variant focus:border-primary outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-on-surface mb-2">Stock Quantity</label>
              <div className="flex gap-2">
                <input 
                  type="number" 
                  placeholder="Enter quantity" 
                  className="flex-1 h-12 px-4 rounded-lg border border-outline-variant focus:border-primary outline-none"
                />
                <select className="w-24 h-12 px-2 rounded-lg border border-outline-variant bg-surface-container-low font-bold text-sm">
                  <option>kg</option>
                  <option>tons</option>
                  <option>sacks</option>
                </select>
              </div>
            </div>
          </div>

          {/* Right Column: Visuals & Status */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-on-surface mb-2">Produce Photo</label>
              <div className="w-full aspect-[4/3] rounded-lg border-2 border-dashed border-outline-variant bg-surface-container-low flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-surface-container-high transition-colors group">
                <div className="w-14 h-14 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-3xl">cloud_upload</span>
                </div>
                <div className="text-center">
                  <p className="font-bold text-primary">Upload Produce Photo</p>
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-tighter">JPG, PNG up to 10MB</p>
                </div>
              </div>
            </div>

            {/* DESIGN.md Chips Logic: Background tint with 10% opacity */}
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-[10px] font-bold uppercase">Organic</span>
              <span className="px-3 py-1 bg-secondary/10 text-secondary border border-secondary/20 rounded-full text-[10px] font-bold uppercase">In Stock</span>
              <span className="px-3 py-1 bg-tertiary/10 text-tertiary border border-tertiary/20 rounded-full text-[10px] font-bold uppercase">Verified</span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-on-surface mb-2">Description/Notes</label>
          <textarea 
            rows={4} 
            placeholder="Detailed description of harvest date, variety, and storage conditions..." 
            className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:border-primary outline-none resize-none"
          />
        </div>

        <div className="flex flex-col md:flex-row justify-end items-center gap-4 pt-6 border-t border-outline-variant">
          <button type="button" className="w-full md:w-auto px-8 py-3 rounded-lg border border-primary text-primary font-bold hover:bg-primary/5 transition-all">
            Cancel
          </button>
          {/* DESIGN.md Action Button: Warm Amber (#fe932c) for "List" actions */}
          <button type="submit" className="w-full md:w-auto px-12 py-3 rounded-lg bg-[#D97706] text-white font-bold elevation-1 hover:brightness-110 active:scale-95 transition-all">
            Save Listing
          </button>
        </div>
      </form>
    </section>
  );
}