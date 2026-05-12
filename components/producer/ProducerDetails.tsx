export default function ProducerDetails() {
  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 md:p-8 elevation-1">
      
      {/* Navigation Tabs */}
      <div className="flex gap-8 border-b border-outline-variant mb-8 overflow-x-auto hide-scrollbar">
        <button className="text-primary font-bold border-b-2 border-primary pb-3 whitespace-nowrap">Overview</button>
        <button className="text-on-surface-variant font-medium hover:text-primary transition-colors pb-3 whitespace-nowrap">Products (24)</button>
        <button className="text-on-surface-variant font-medium hover:text-primary transition-colors pb-3 whitespace-nowrap">Farming Practices</button>
        <button className="text-on-surface-variant font-medium hover:text-primary transition-colors pb-3 whitespace-nowrap">Reviews (128)</button>
      </div>

      <div className="space-y-10">
        {/* About Section */}
        <section>
          <h3 className="text-xl font-bold text-on-surface mb-3">About Us</h3>
          <p className="text-on-surface-variant leading-relaxed text-[15px]">
            Founded in 2011, Green Valley Farm is a family-owned cooperative dedicated to sustainable and organic farming practices. Spanning over 500 acres in the fertile Nakuru region, we specialize in high-yield vegetables, grains, and specialty crops. Our mission is to provide fresh, traceable, and top-tier produce directly to wholesale buyers while nurturing the land for future generations.
          </p>
        </section>

        {/* Highlights Grid */}
        <section>
          <h3 className="text-xl font-bold text-on-surface mb-4">Farm Highlights</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="flex items-start gap-3 p-4 rounded-lg bg-surface-container-low border border-outline-variant">
              <span className="material-symbols-outlined text-primary text-2xl">eco</span>
              <div>
                <p className="font-bold text-on-surface">100% Organic</p>
                <p className="text-sm text-on-surface-variant mt-0.5">Certified by Agriculture Network</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-4 rounded-lg bg-surface-container-low border border-outline-variant">
              <span className="material-symbols-outlined text-primary text-2xl">water_drop</span>
              <div>
                <p className="font-bold text-on-surface">Smart Irrigation</p>
                <p className="text-sm text-on-surface-variant mt-0.5">Using 40% less water via drip systems</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-4 rounded-lg bg-surface-container-low border border-outline-variant">
              <span className="material-symbols-outlined text-primary text-2xl">solar_power</span>
              <div>
                <p className="font-bold text-on-surface">Solar Powered</p>
                <p className="text-sm text-on-surface-variant mt-0.5">Facility runs on 100% renewables</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-4 rounded-lg bg-surface-container-low border border-outline-variant">
              <span className="material-symbols-outlined text-primary text-2xl">workspace_premium</span>
              <div>
                <p className="font-bold text-on-surface">Global GAP Certified</p>
                <p className="text-sm text-on-surface-variant mt-0.5">Meeting international safety standards</p>
              </div>
            </div>
            
          </div>
        </section>
      </div>
    </div>
  );
}