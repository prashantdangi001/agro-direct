'use client';

interface VerificationStatsProps {
  pending: number;
  verifiedToday: number;
}

export default function VerificationStats({ pending, verifiedToday }: VerificationStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
      <div className="bg-white p-6 rounded-xl border border-outline-variant elevation-1">
        <div className="flex justify-between items-start mb-4">
          <div className="w-10 h-10 flex items-center justify-center bg-[#ffdcc3] text-[#2f1500] rounded-lg">
            <span className="material-symbols-outlined">pending_actions</span>
          </div>
          <span className="text-[#ba1a1a] text-xs font-bold bg-[#ba1a1a]/10 px-2 py-1 rounded">Live Updates</span>
        </div>
        <p className="text-xs text-on-surface-variant uppercase font-bold tracking-widest mb-1">Total Pending</p>
        <h3 className="text-3xl font-bold text-on-surface">{pending}</h3>
      </div>

      <div className="bg-white p-6 rounded-xl border border-outline-variant elevation-1">
        <div className="flex justify-between items-start mb-4">
          <div className="w-10 h-10 flex items-center justify-center bg-[#85f8c4] text-[#002114] rounded-lg">
            <span className="material-symbols-outlined">verified</span>
          </div>
          <span className="text-primary text-xs font-bold bg-primary/10 px-2 py-1 rounded">Session</span>
        </div>
        <p className="text-xs text-on-surface-variant uppercase font-bold tracking-widest mb-1">Verified Today</p>
        <h3 className="text-3xl font-bold text-on-surface">{verifiedToday}</h3>
      </div>

      <div className="bg-white p-6 rounded-xl border border-outline-variant elevation-1">
        <div className="flex justify-between items-start mb-4">
          <div className="w-10 h-10 flex items-center justify-center bg-[#d8e3fb] text-[#111c2d] rounded-lg">
            <span className="material-symbols-outlined">timer</span>
          </div>
          <span className="text-on-surface-variant text-xs font-bold bg-surface-container px-2 py-1 rounded">Target: &lt; 24h</span>
        </div>
        <p className="text-xs text-on-surface-variant uppercase font-bold tracking-widest mb-1">Avg. Review Time</p>
        <h3 className="text-3xl font-bold text-on-surface">2.4h</h3>
      </div>
    </div>
  );
}