'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function FarmerDetailsModal({ farmer, onClose, onRefresh }: any) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleApprove = async () => {
    setIsProcessing(true);
    const { error } = await supabase.from('farm_profiles').update({ verification_status: 'verified' }).eq('id', farmer.id);
    
    if (!error) {
      // Send WhatsApp Notification
      try {
        let cleanPhone = farmer.contact_number.replace(/\D/g, ''); 
        if (cleanPhone.length === 10) cleanPhone = `91${cleanPhone}`;
        await fetch('/api/whatsapp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            to: cleanPhone, 
            message: `✅ *Khetify Verified*\n\nCongratulations ${farmer.full_name}! Your producer profile for ${farmer.farm_name} has been approved. You can now start listing your harvest.` 
          })
        });
      } catch (e) { console.error("WhatsApp Failed", e); }
      
      onRefresh(); // Instantly update the tables
      onClose();   // Close the modal
    } else {
      alert("Failed to verify. Please check network connection.");
    }
    setIsProcessing(false);
  };

  if (!farmer) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-[#191c1e]/90 backdrop-blur-md p-6 animate-in fade-in duration-200">
      <div className="bg-[#ffffff] w-full max-w-5xl rounded-[32px] overflow-hidden shadow-2xl flex flex-col md:flex-row h-[85vh]">
        
        {/* LEFT SIDE: Document Viewer */}
        <div className="md:w-3/5 bg-[#f2f4f6] p-8 flex flex-col border-r border-[#bccac0]">
          <h3 className="font-black text-[#191c1e] text-lg uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#006948]">badge</span> 
            Identity Document
          </h3>
          <div className="flex-1 bg-[#e0e3e5] rounded-2xl border-2 border-dashed border-[#bccac0] flex items-center justify-center overflow-hidden relative">
             {farmer.kyc_document_url ? (
               <img src={farmer.kyc_document_url} alt="KYC Document" className="absolute inset-0 w-full h-full object-contain p-2" />
             ) : (
               <div className="text-center p-6">
                 <span className="material-symbols-outlined text-4xl text-[#6d7a72] mb-2">description</span>
                 <p className="text-[#3d4a42] font-bold text-sm">No document provided.</p>
               </div>
             )}
          </div>
        </div>

        {/* RIGHT SIDE: Producer Details */}
        <div className="md:w-2/5 p-8 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex justify-between items-start mb-8">
              <div>
                <p className="text-[10px] font-black text-[#6d7a72] uppercase tracking-widest">Producer Application</p>
                <h2 className="font-black text-2xl text-[#191c1e]">{farmer.farm_name}</h2>
              </div>
              <button onClick={onClose} className="p-2 bg-[#f2f4f6] text-[#3d4a42] rounded-full hover:bg-[#e0e3e5] transition-all">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-6 bg-[#f7f9fb] border border-[#bccac0] p-6 rounded-2xl mb-8">
              
              <div>
                <p className="text-[10px] font-black text-[#6d7a72] uppercase tracking-widest">Owner Full Name</p>
                <p className="font-bold text-[#191c1e] text-[16px] mt-1 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#006948] text-[18px]">person</span>
                  {farmer.full_name}
                </p>
              </div>

              <div className="border-t border-[#bccac0]/50 pt-4">
                <p className="text-[10px] font-black text-[#6d7a72] uppercase tracking-widest">Contact Number</p>
                <p className="font-bold text-[#191c1e] text-[16px] mt-1 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#006948] text-[18px]">phone_iphone</span>
                  {farmer.contact_number}
                </p>
              </div>

              <div className="border-t border-[#bccac0]/50 pt-4">
                <p className="text-[10px] font-black text-[#6d7a72] uppercase tracking-widest">Application Date</p>
                <p className="font-bold text-[#191c1e] text-[16px] mt-1 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#006948] text-[18px]">calendar_today</span>
                  {new Date(farmer.created_at).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>

            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 mt-4">
            <button 
              disabled={isProcessing}
              onClick={handleApprove}
              className="w-full py-4 bg-[#006948] text-[#ffffff] shadow-lg shadow-[#006948]/20 rounded-2xl font-black text-[14px] uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isProcessing ? <span className="material-symbols-outlined text-[18px] animate-spin">sync</span> : <span className="material-symbols-outlined text-[18px]">verified</span>}
              {isProcessing ? 'Processing...' : 'Approve & Verify Producer'}
            </button>
            <button 
              disabled={isProcessing}
              onClick={onClose}
              className="w-full py-4 bg-[#ffffff] text-[#ba1a1a] border border-[#ba1a1a]/30 rounded-2xl font-black text-[14px] uppercase tracking-widest hover:bg-[#ba1a1a]/5 transition-all disabled:opacity-50"
            >
              Reject Document
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}