export default function MarketTrends() {
  const dataPoints = [40, 65, 45, 80, 55, 90, 75];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="bg-white p-6 rounded-lg border border-outline-variant elevation-1 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6 border-b border-outline-variant pb-4">
        <div>
          <h3 className="text-xl font-bold text-on-surface">Market Demand Trends</h3>
          <p className="text-sm text-on-surface-variant">Your profile visibility vs. regional averages</p>
        </div>
        <select className="bg-surface-container-low border border-outline-variant text-sm font-bold rounded-lg px-3 py-2 outline-none">
          <option>This Week</option>
          <option>This Month</option>
        </select>
      </div>

      {/* CSS-based Chart */}
      <div className="flex-1 flex items-end justify-between gap-2 pt-4 mt-auto min-h-[200px]">
        {dataPoints.map((val, i) => (
          <div key={i} className="w-full flex flex-col items-center gap-3 group">
            <div className="w-full bg-surface-container-high rounded-t-md relative h-48 flex items-end overflow-hidden">
              <div 
                className="w-full bg-primary rounded-t-md transition-all duration-1000 ease-out group-hover:bg-primary-container relative"
                style={{ height: `${val}%` }}
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface text-xs font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {val}
                </div>
              </div>
            </div>
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">{days[i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}