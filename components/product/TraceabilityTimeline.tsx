export default function TraceabilityTimeline() {
  const steps = [
    { label: "Seed Sowing", date: "120 Days Ago", loc: "Green Valley Farm", icon: "potted_plant" },
    { label: "Harvest", date: "2 Days Ago", loc: "Hand-Picked", icon: "agriculture" },
    { label: "Quality Check", date: "Yesterday", loc: "Certified Grade A", icon: "fact_check" },
    { label: "Logistics", date: "Today, 4:00 AM", loc: "Direct Express", icon: "local_shipping" },
    { label: "Current Status", date: "Active", loc: "Regional Center", icon: "warehouse", current: true },
  ];

  return (
    <section className="bg-primary/5 p-8 md:p-12 rounded-2xl border border-primary/20">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-primary mb-2">From Soil to Storefront</h2>
        <p className="text-on-surface-variant">The transparent journey of your tomatoes</p>
      </div>
      
      <div className="relative max-w-4xl mx-auto">
        <div className="absolute top-6 left-0 w-full h-1 bg-outline-variant hidden md:block"></div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative">
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 z-10 shadow-md ${step.current ? 'bg-secondary text-white ring-4 ring-secondary-container' : 'bg-primary text-white'}`}>
                <span className="material-symbols-outlined">{step.icon}</span>
              </div>
              <h4 className="font-bold text-on-surface text-sm">{step.label}</h4>
              <p className="text-[10px] text-on-surface-variant uppercase">{step.date}</p>
              <p className={`text-[10px] font-bold mt-1 ${step.current ? 'text-secondary' : 'text-primary'}`}>{step.loc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}