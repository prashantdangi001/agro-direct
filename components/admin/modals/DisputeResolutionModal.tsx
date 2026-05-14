'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function DisputeResolutionModal({ order, onClose, onRefresh }: any) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleResolution = async (decision: 'favor_buyer' | 'favor_farmer') => {
    if (!confirm(`Are you sure you want to ${decision === 'favor_buyer' ? 'REFUND THE BUYER' : 'PAY THE FARMER'}? This escrow action is irreversible.`)) return;
    
    setIsProcessing(true);
    const newStatus = decision === 'favor_buyer' ? 'cancelled' : 'delivered';
    const resolutionNote = decision === 'favor_buyer' ? 'Admin ruled in favor of Buyer. Funds refunded.' : 'Admin ruled in favor of Farmer. Funds released.';

    try {
      // 1. Update Database
      const { error } = await supabase
        .from('orders')
        .update({ 
          status: newStatus,
          escrow_status: 'resolved',
          dispute_reason: `${order.dispute_reason || 'Dispute'} | Resolution: ${resolutionNote}`
        })
        .eq('id', order.id);

      if (error) throw error;

      // 2. Fetch Contact Info for WhatsApp Alerts
      const { data: farm } = await supabase.from('farm_profiles').select('contact_number').eq('id', order.farmer_id).single();
      
      // 3. Send WhatsApp Blast to Farmer
      if (farm?.contact_number) {
        let phone = farm.contact_number.replace(/\D/g, '');
        if (phone.length === 10) phone = `91${phone}`;
        
        const message = decision === 'favor_buyer' 
          ? `⚠️ *Dispute Lost*\n\nAdmin has reviewed Order #ORD-${order.id.split('-')[0].toUpperCase()} and ruled in favor of the buyer. The escrow funds have been refunded.`
          : `✅ *Dispute Won*\n\nAdmin has reviewed Order #ORD-${order.id.split('-')[0].toUpperCase()} and ruled in your favor! The escrow funds (₹${order.total_amount}) are being released to your account.`;

        await fetch('/api/whatsapp', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ to: phone, message }) });
      }

      alert("Escrow dispute resolved successfully!");
      onRefresh();
      onClose();
    } catch (err: any) {
      alert("Resolution failed: " + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-[#191c1e]/90 backdrop-blur-md p-6 animate-in fade-in duration-200">
      <div className="bg-[#ffffff] w-full max-w-4xl rounded-[32px] overflow-hidden shadow-2xl flex flex-col md:flex-row">
        
        {/* Left Side: Evidence Viewer */}
        <div className="md:w-1/2 bg-[#f2f4f6] p-8 flex flex-col border-r border-[#bccac0]">
          <h3 className="font-black text-[#191c1e] text-lg uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ba1a1a]">gavel</span> 
            Evidence Review
          </h3>
          <div className="flex-1 bg-[#e0e3e5] rounded-2xl border-2 border-dashed border-[#bccac0] flex items-center justify-center overflow-hidden relative">
             {order.dispute_image_url ? (
               <img src={order.dispute_image_url} alt="Dispute Evidence" className="absolute inset-0 w-full h-full object-cover" />
             ) : (
               <div className="text-center p-6">
                 <span className="material-symbols-outlined text-4xl text-[#6d7a72] mb-2">image_not_supported</span>
                 <p className="text-[#3d4a42] font-bold text-sm">No image evidence provided by buyer.</p>
               </div>
             )}
          </div>
        </div>

        {/* Right Side: Case Details & Controls */}
        <div className="md:w-1/2 p-8 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-[10px] font-black text-[#6d7a72] uppercase tracking-widest">Case File</p>
                <h2 className="font-black text-2xl text-[#191c1e]">#ORD-{order.id.split('-')[0].toUpperCase()}</h2>
              </div>
              <button onClick={onClose} className="p-2 bg-[#f2f4f6] text-[#3d4a42] rounded-full hover:bg-[#e0e3e5] transition-all"><span className="material-symbols-outlined">close</span></button>
            </div>

            <div className="space-y-4 bg-[#fefcff] border border-[#ba1a1a]/20 p-5 rounded-2xl mb-8">
              <div>
                <p className="text-[10px] font-black text-[#6d7a72] uppercase tracking-widest">Buyer's Claim</p>
                <p className="font-bold text-[#ba1a1a] text-sm mt-1">{order.dispute_reason || "Item damaged or incorrect."}</p>
              </div>
              <div className="flex justify-between border-t border-[#bccac0]/30 pt-4">
                <div>
                  <p className="text-[10px] font-black text-[#6d7a72] uppercase tracking-widest">Farmer</p>
                  <p className="font-bold text-[#191c1e] text-sm">{order.farm_name}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-[#6d7a72] uppercase tracking-widest">Escrow Amount</p>
                  <p className="font-black text-[#006948] text-lg">₹{order.total_amount?.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button 
              disabled={isProcessing}
              onClick={() => handleResolution('favor_buyer')}
              className="w-full py-4 bg-[#f2f4f6] text-[#ba1a1a] border border-[#ba1a1a]/30 rounded-2xl font-black text-[12px] uppercase tracking-widest hover:bg-[#ba1a1a] hover:text-white transition-all disabled:opacity-50"
            >
              Favor Buyer (Refund ₹{order.total_amount})
            </button>
            <button 
              disabled={isProcessing}
              onClick={() => handleResolution('favor_farmer')}
              className="w-full py-4 bg-[#006948] text-[#ffffff] shadow-lg shadow-[#006948]/20 rounded-2xl font-black text-[12px] uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">verified</span>
              Favor Farmer (Release Funds)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}