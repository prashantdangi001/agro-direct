export default function AdminVolumeChart() {
  const bars = [
    { day: "Mon", height: "60%", bgHeight: "40%" },
    { day: "Tue", height: "70%", bgHeight: "55%" },
    { day: "Wed", height: "85%", bgHeight: "75%" },
    { day: "Thu", height: "75%", bgHeight: "60%" },
    { day: "Fri", height: "95%", bgHeight: "90%" },
    { day: "Sat", height: "50%", bgHeight: "45%" },
    { day: "Sun", height: "40%", bgHeight: "35%" }
  ];

  return (
    <section className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden elevation-1">
      <div className="p-6 border-b border-outline-variant flex justify-between items-center">
        <h2 className="text-xl font-bold text-on-surface">Platform Volume Over Time</h2>
        <div className="flex gap-2">
          <button className="px-3 py-1 text-sm font-bold bg-primary-container text-on-primary-container rounded-lg">7 Days</button>
          <button className="px-3 py-1 text-sm font-bold hover:bg-surface-variant rounded-lg transition-colors">30 Days</button>
        </div>
      </div>
      
      <div className="p-6 h-[300px] flex items-end justify-between gap-4">
        {bars.map((bar, i) => (
          <div key={i} className="flex-1 flex flex-col gap-2 items-center h-full justify-end">
            <div className="w-full bg-primary-container/20 rounded-t-lg relative" style={{ height: bar.bgHeight }}>
              <div className="absolute bottom-0 w-full bg-primary rounded-t-lg transition-all" style={{ height: bar.height }}></div>
            </div>
            <span className="text-sm font-bold text-outline">{bar.day}</span>
          </div>
        ))}
      </div>
    </section>
  );
}