export default function LogisticsBanner() {
  return (
    <div className="bg-secondary-container/10 border border-secondary-container/30 rounded-lg p-6 flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 elevation-1">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-secondary text-white rounded-full flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined">local_shipping</span>
        </div>
        <div>
          <h4 className="text-lg font-bold text-[#663500] mb-1">Logistics Pickup Scheduled</h4>
          <p className="text-sm text-[#904d00] font-medium">Your 500kg Maize order is scheduled for pickup tomorrow at 08:00 AM.</p>
        </div>
      </div>
      <button className="bg-secondary text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-[#663500] active:scale-95 transition-all shadow-sm whitespace-nowrap">
        View Manifest
      </button>
    </div>
  );
}