export default function ProducerSidebar() {
  return (
    <>
      {/* Farm Stats */}
      <div className="bg-surface-container-high p-6 rounded-xl border border-outline-variant elevation-1">
        <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-6">Farm Stats</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b border-outline-variant">
            <span className="text-on-surface-variant font-medium">Established</span>
            <span className="text-on-surface font-bold text-lg">2009</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-outline-variant">
            <span className="text-on-surface-variant font-medium">Total Harvests</span>
            <span className="text-on-surface font-bold text-lg">142</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-outline-variant">
            <span className="text-on-surface-variant font-medium">On-time Delivery</span>
            <span className="text-primary font-bold text-lg">99.2%</span>
          </div>
          <div className="flex justify-between items-center pt-3">
            <span className="text-on-surface-variant font-medium">Wholesale Capacity</span>
            <span className="text-on-surface font-bold text-lg">15 Tons/Mo</span>
          </div>
        </div>
      </div>

      {/* Direct Quote CTA */}
      <div className="bg-secondary text-white p-8 rounded-xl shadow-md">
        <h3 className="text-2xl font-bold mb-3">Direct Bulk Quote</h3>
        <p className="text-sm font-medium text-white/90 mb-6 leading-relaxed">
          Request special wholesale pricing for orders over 500kg directly from Samuel.
        </p>
        <button className="w-full bg-white text-secondary font-bold py-4 rounded-lg hover:bg-surface-bright active:scale-95 transition-all shadow-sm">
          Request Price Sheet
        </button>
      </div>
    </>
  );
}