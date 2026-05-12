export default function MarketTicker() {
  const rates = [
    { name: "Maize", price: "INR 4,200/bag", up: true, change: "2%" },
    { name: "Onions", price: "INR 95/kg", up: false, change: "1%" },
    { name: "Potatoes", price: "INR 3,800/bag", up: true, change: "5%" },
  ];

  return (
    <section className="bg-white border border-outline-variant rounded-lg p-4 flex flex-col md:flex-row items-center justify-between gap-4 elevation-1">
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-secondary">trending_up</span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Live Market Rates:</span>
      </div>
      <div className="flex gap-8 overflow-x-auto w-full md:w-auto scrollbar-hide px-2">
        {rates.map((rate, i) => (
          <div key={i} className="flex items-center gap-2 whitespace-nowrap">
            <span className="text-on-surface font-bold text-sm">{rate.name}:</span>
            <span className={`${rate.up ? 'text-primary' : 'text-secondary'} font-bold text-sm`}>{rate.price}</span>
            <span className={`text-[10px] font-bold ${rate.up ? 'text-primary' : 'text-secondary'}`}>
              {rate.up ? '▲' : '▼'} {rate.change}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}