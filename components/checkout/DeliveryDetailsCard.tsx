export default function DeliveryDetailsCard() {
  return (
    <section className="bg-surface-container-lowest p-6 rounded-lg border border-outline-variant elevation-1">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">local_shipping</span>
        Delivery Details
      </h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <p className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">Delivery Address</p>
          <div className="p-4 bg-surface-container rounded-lg border border-outline-variant">
            <p className="font-semibold mb-1">Central Logistics Hub</p>
            <p className="text-on-surface-variant text-sm">Industrial Area, Gate 4</p>
            <p className="text-on-surface-variant text-sm">Nairobi, Kenya</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">Estimated Delivery Date</p>
          <div className="p-4 bg-surface-container-low rounded-lg border border-outline-variant flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">calendar_today</span>
            <p className="font-semibold">Thursday, Oct 24th, 2024</p>
          </div>
        </div>
      </div>
    </section>
  );
}