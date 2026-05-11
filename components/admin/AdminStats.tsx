export default function AdminStats() {
  const stats = [
    { label: "Total Sales", value: "$142.8k", trend: "+12%", color: "text-primary" },
    { label: "Active Farmers", value: "2,491", trend: "+4%", color: "text-primary" },
    { label: "Open Disputes", value: "14", trend: "-2", color: "text-error" },
    { label: "System Load", value: "24%", trend: "Stable", color: "text-primary" }
  ];

  return (
    <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {stats.map((stat, i) => (
        <div key={i} className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm elevation-1">
          <p className="text-sm font-bold text-outline">{stat.label}</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-bold">{stat.value}</span>
            <span className={`${stat.color} text-sm font-bold`}>{stat.trend}</span>
          </div>
        </div>
      ))}
    </section>
  );
}