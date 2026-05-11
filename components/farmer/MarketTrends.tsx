export default function MarketTrends() {
  const trends = [
    { name: "Wheat", price: "$1.25/kg", change: "+2.4%", up: true, icon: "grass" },
    { name: "Onion", price: "$0.90/kg", change: "-1.1%", up: false, icon: "nutrition" },
    { name: "Tomato", price: "$2.05/kg", change: "+5.8%", up: true, icon: "yard" },
  ];

  return (
    <div className="bg-white rounded-lg border border-outline-variant p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-lg">Market Trends</h3>
        <span className="material-symbols-outlined text-on-surface-variant">monitoring</span>
      </div>
      <div className="flex flex-col gap-4">
        {trends.map((trend, i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-outline-variant hover:bg-surface-container-low transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center text-on-surface-variant"><span className="material-symbols-outlined text-sm">{trend.icon}</span></div>
              <div><div className="text-xs font-bold">{trend.name}</div><div className="text-[10px] text-on-surface-variant">Regional Avg.</div></div>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold">{trend.price}</div>
              <div className={`text-[10px] font-bold flex items-center justify-end gap-1 ${trend.up ? 'text-primary' : 'text-error'}`}>
                <span className="material-symbols-outlined text-[14px]">{trend.up ? 'arrow_upward' : 'arrow_downward'}</span> {trend.change}
              </div>
            </div>
          </div>
        ))}
      </div>
      <button className="w-full mt-4 text-xs font-bold border border-outline-variant py-2 rounded-lg hover:bg-surface-variant transition-colors">View Detailed Analytics</button>
    </div>
  );
}