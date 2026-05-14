'use client';
import { supabase } from '@/lib/supabase';
import { useState } from 'react';

export default function VerificationsTab({ farmers, onPreview, onApprove }: any) {
  // Filter only farmers who need verification
  const pendingFarmers = farmers.filter((f: any) => f.verification_status === 'pending');
  
  // Local state to show a loading spinner on the button when clicked
  const [isVerifying, setIsVerifying] = useState<string | null>(null);

  const handleApprove = async (id: string, phone: string) => {
    setIsVerifying(id);
    const { error } = await supabase.from('farm_profiles').update({ verification_status: 'verified' }).eq('id', id);
    
    if (!error) {
      // Send WhatsApp Notification to the Farmer
      try {
        let cleanPhone = phone.replace(/\D/g, ''); 
        if (cleanPhone.length === 10) cleanPhone = `91${cleanPhone}`;
        await fetch('/api/whatsapp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            to: cleanPhone, 
            message: "✅ *Khetify Verified*\n\nYour producer profile has been approved! You can now start listing your harvest." 
          })
        });
      } catch (e) { console.error("WhatsApp Failed", e); }
      
      // Trigger the parent component to refresh the data
      onApprove(); 
    } else {
      alert("Failed to verify. Please check network connection.");
    }
    setIsVerifying(null);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-6">
      
      {/* 📊 VERIFICATION METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metric 1 */}
        <div className="bg-white p-6 rounded-[28px] border border-[#bccac0] shadow-sm flex flex-col justify-between h-36">
          <div className="flex justify-between items-start">
            <span className="material-symbols-outlined p-2 bg-[#fe932c]/10 text-[#904d00] rounded-xl">pending_actions</span>
            <span className="text-[#904d00] text-[10px] font-black uppercase tracking-widest bg-[#fe932c]/10 px-2 py-0.5 rounded-lg border border-[#fe932c]/20">High Priority</span>
          </div>
          <div>
            <p className="text-[10px] font-black text-[#6d7a72] uppercase tracking-widest">Awaiting Review</p>
            <h3 className="text-3xl font-black text-[#191c1e] mt-1">{pendingFarmers.length}</h3>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-6 rounded-[28px] border border-[#bccac0] shadow-sm flex flex-col justify-between h-36">
          <div className="flex justify-between items-start">
            <span className="material-symbols-outlined p-2 bg-[#006c4a]/10 text-[#006c4a] rounded-xl">verified</span>
            <span className="text-[#006c4a] text-[10px] font-black uppercase tracking-widest bg-[#006c4a]/10 px-2 py-0.5 rounded-lg border border-[#006c4a]/20">+14 Today</span>
          </div>
          <div>
            <p className="text-[10px] font-black text-[#6d7a72] uppercase tracking-widest">Verified Today</p>
            <h3 className="text-3xl font-black text-[#191c1e] mt-1">14</h3>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-6 rounded-[28px] border border-[#bccac0] shadow-sm flex flex-col justify-between h-36">
          <div className="flex justify-between items-start">
            <span className="material-symbols-outlined p-2 bg-[#6a758a]/10 text-[#515c71] rounded-xl">timer</span>
            <span className="text-[#515c71] text-[10px] font-black uppercase tracking-widest bg-[#6a758a]/10 px-2 py-0.5 rounded-lg border border-[#6a758a]/20">Target: &lt;24h</span>
          </div>
          <div>
            <p className="text-[10px] font-black text-[#6d7a72] uppercase tracking-widest">Avg. Review Time</p>
            <h3 className="text-3xl font-black text-[#191c1e] mt-1">18.5h</h3>
          </div>
        </div>
      </div>

      {/* 📋 KYC QUEUE TABLE */}
      <div className="bg-white rounded-[32px] border border-[#bccac0] overflow-hidden shadow-sm">
        
        {/* Table Header Controls */}
        <div className="p-6 border-b border-[#bccac0] flex justify-between items-center bg-white">
           <div className="flex items-center gap-3">
             <h2 className="font-black text-[#191c1e] text-lg">Identity Verification Queue</h2>
             <span className="bg-[#fe932c] text-white text-[10px] px-2.5 py-0.5 rounded-full font-black shadow-sm">{pendingFarmers.length}</span>
           </div>
           <div className="flex gap-2">
              <button className="p-2 hover:bg-[#f2f4f6] rounded-xl border border-[#bccac0]/50 transition-colors">
                <span className="material-symbols-outlined text-[18px] text-[#3d4a42]">filter_list</span>
              </button>
           </div>
        </div>
        
        {/* Table Data */}
        <table className="w-full text-left">
          <thead className="bg-[#f2f4f6]">
            <tr>
              <th className="py-4 px-8 text-[10px] font-black text-[#3d4a42] uppercase tracking-widest">Producer & Farm</th>
              <th className="py-4 px-8 text-[10px] font-black text-[#3d4a42] uppercase tracking-widest">Submitted On</th>
              <th className="py-4 px-8 text-[10px] font-black text-[#3d4a42] uppercase tracking-widest">Status</th>
              <th className="py-4 px-8 text-right text-[10px] font-black text-[#3d4a42] uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#bccac0]/30">
            {pendingFarmers.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-24 text-center">
                  <div className="flex flex-col items-center gap-3 opacity-40">
                     <span className="material-symbols-outlined text-5xl">task_alt</span>
                     <p className="font-black text-sm uppercase tracking-widest italic">All producers are currently verified.</p>
                  </div>
                </td>
              </tr>
            ) : (
              pendingFarmers.map((f: any) => (
                <tr key={f.id} className="hover:bg-[#f7f9fb] transition-colors group">
                  
                  {/* Column 1: Identity */}
                  <td className="py-6 px-8">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#006c4a]/10 text-[#006c4a] flex items-center justify-center font-black text-sm border border-[#006c4a]/20 uppercase">
                        {f.farm_name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-black text-[#191c1e] text-sm leading-tight">{f.farm_name}</p>
                        <p className="text-[11px] text-[#6d7a72] font-bold mt-0.5">{f.full_name} • {f.contact_number}</p>
                      </div>
                    </div>
                  </td>

                  {/* Column 2: Date */}
                  <td className="py-6 px-8">
                     <p className="text-xs font-bold text-[#191c1e]">
                       {new Date(f.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                     </p>
                     <p className="text-[10px] text-[#6d7a72] font-medium mt-0.5">at {new Date(f.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
                  </td>

                  {/* Column 3: Status Badge */}
                  <td className="py-6 px-8">
                     <span className="bg-[#fe932c]/10 text-[#904d00] px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-[#fe932c]/20 flex items-center gap-1.5 w-fit">
                       <span className="w-1.5 h-1.5 bg-[#fe932c] rounded-full animate-pulse"></span>
                       Pending Review
                     </span>
                  </td>

                  {/* Column 4: Actions */}
                  <td className="py-6 px-8 text-right flex justify-end items-center gap-2">
                     <button 
                       onClick={() => onPreview(f)}
                       className="p-2.5 bg-[#f2f4f6] text-[#3d4a42] hover:bg-[#00855d] hover:text-white rounded-xl transition-all shadow-sm border border-[#bccac0]/50"
                       title="Review Identity Document"
                     >
                       <span className="material-symbols-outlined text-[18px]">visibility</span>
                     </button>
                     
                     <button 
                       disabled={isVerifying === f.id}
                       onClick={() => handleApprove(f.id, f.contact_number)} 
                       className="bg-[#006c4a] text-white font-black text-[10px] px-6 py-2.5 rounded-xl shadow-lg shadow-[#006c4a]/20 hover:brightness-110 active:scale-95 transition-all uppercase tracking-widest disabled:opacity-50 flex items-center gap-2"
                     >
                       {isVerifying === f.id ? <span className="material-symbols-outlined text-[14px] animate-spin">sync</span> : null}
                       {isVerifying === f.id ? 'Approving...' : 'Approve'}
                     </button>
                  </td>
                  
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}