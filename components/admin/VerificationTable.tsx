'use client';

// Define the exact shape of your Supabase table
export interface FarmProfile {
  id: string;
  farm_name: string;
  location: string;
  practices: string;
  verification_status: string;
  profile_pic_url?: string;
}

interface VerificationTableProps {
  farmers: FarmProfile[];
  onVerify: (id: string, farmName: string) => Promise<void>;
  onReject: (id: string) => Promise<void>;
}

export default function VerificationTable({ farmers, onVerify, onReject }: VerificationTableProps) {
  
  if (farmers.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-outline-variant p-12 text-center elevation-1">
        <span className="material-symbols-outlined text-6xl text-primary/40 mb-4">task_alt</span>
        <h3 className="text-xl font-bold text-on-surface mb-2">Inbox Zero</h3>
        <p className="text-on-surface-variant">All producer profiles have been reviewed. No pending verifications.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-outline-variant elevation-1 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-lowest border-b border-outline-variant">
              <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Producer Info</th>
              <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Location</th>
              <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Practices</th>
              <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Status</th>
              <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-on-surface-variant text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {farmers.map((farm) => (
              <tr key={farm.id} className="hover:bg-surface-bright transition-colors group">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <img 
                      src={farm.profile_pic_url || "https://lh3.googleusercontent.com/aida-public/AB6AXuD6dPgaJjE2DEckCIPPBSoJIhLB-dRYtSE6dSt_KmsP9YM4GranUC7B0cUqnzRWjsThRSsraY8GSxis64EWZdMFbox6yHIwskmIozTB1oZIDK4clkJNPZ99d_ZIthWKkIKY7aKfPNz_7TlAe45qdrzXV0s8i3Kvk67pDNqtPSKOhUH-uRNhHdN6-4x9oHn8P8cpyTDs53F_nNdXv2dTJqqXQB_9JZHxK5Pzwu1CyIsg_hT2fdtPVDMStjtR94-gHrhSMyzf0QGiG2Dz"} 
                      alt={farm.farm_name} 
                      className="w-10 h-10 rounded-full object-cover border border-outline-variant"
                    />
                    <div>
                      <p className="font-bold text-on-surface">{farm.farm_name}</p>
                      <p className="text-xs text-on-surface-variant font-medium">ID: {farm.id.substring(0, 8)}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6 text-sm text-on-surface-variant font-medium">
                  {farm.location}
                </td>
                <td className="py-4 px-6">
                  <p className="text-sm text-on-surface truncate max-w-[200px]">{farm.practices}</p>
                </td>
                <td className="py-4 px-6">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border bg-[#fe932c]/10 text-[#904d00] border-[#fe932c]/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#fe932c] mr-2 animate-pulse"></span>
                    {farm.verification_status}
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => onReject(farm.id)}
                      className="px-3 py-2 text-error font-bold text-xs hover:bg-error/10 rounded-lg transition-colors border border-transparent hover:border-error/20"
                    >
                      Reject
                    </button>
                    <button 
                      onClick={() => onVerify(farm.id, farm.farm_name)}
                      className="bg-[#006948] hover:bg-[#00855d] text-white px-4 py-2 rounded-lg text-xs font-bold shadow-sm transition-all active:scale-95 flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-sm">verified</span>
                      Verify Farm
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}