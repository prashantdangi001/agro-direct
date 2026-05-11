interface StatProps {
  title: string;
  value: string;
  trend?: string;
  subtitle?: string;
  icon: string;
}

export default function StatCard({ title, value, trend, subtitle, icon }: StatProps) {
  return (
    <div className="bg-white rounded-lg border border-outline-variant p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">{title}</span>
        <span className="material-symbols-outlined text-primary">{icon}</span>
      </div>
      <div className="text-3xl font-bold text-on-surface">{value}</div>
      {trend && <div className="text-xs font-bold text-primary mt-2 flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">trending_up</span> {trend}</div>}
      {subtitle && <div className="text-xs text-on-surface-variant mt-2">{subtitle}</div>}
    </div>
  );
}