export default function LogisticsBanner() {
  return (
    <div className="bg-primary text-white rounded-lg p-6 relative overflow-hidden shadow-sm">
      <div className="absolute -right-6 -top-6 opacity-20 pointer-events-none">
        <span className="material-symbols-outlined text-[120px]">local_shipping</span>
      </div>
      <h3 className="text-xl font-bold mb-2 relative z-10">Need Transport?</h3>
      <p className="text-sm text-primary-fixed mb-5 relative z-10 opacity-90 leading-relaxed">Connect with vetted logistics partners for your next big shipment.</p>
      <button className="bg-white text-primary font-bold text-xs px-4 py-2 rounded shadow-sm hover:bg-surface-variant transition-colors relative z-10">Find a Carrier</button>
    </div>
  );
}