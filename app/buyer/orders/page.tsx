'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import MarketplaceNavbar from '@/components/layout/MarketplaceNavbar';
import Link from 'next/link';

export default function BuyerOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ✨ DISPUTE MODAL STATE ✨
  const [disputeModalOpen, setDisputeModalOpen] = useState(false);
  const [disputeOrder, setDisputeOrder] = useState<any>(null);
  const [disputeReason, setDisputeReason] = useState('');
  const [disputeFile, setDisputeFile] = useState<File | null>(null);
  const [disputePreview, setDisputePreview] = useState<string | null>(null);
  const [isSubmittingDispute, setIsSubmittingDispute] = useState(false);

  const fetchMyOrders = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return window.location.href = '/login';

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('buyer_id', user.id)
      .order('created_at', { ascending: false });

    if (!error) setOrders(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDisputeFile(e.target.files[0]);
      setDisputePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  // ✨ SUBMIT DISPUTE LOGIC ✨
  const submitDispute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!disputeFile || !disputeReason || !disputeOrder) return;
    setIsSubmittingDispute(true);

    try {
      // 1. Upload Evidence Photo
      const fileExt = disputeFile.name.split('.').pop();
      const fileName = `dispute-${disputeOrder.id}-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('disputes')
        .upload(fileName, disputeFile);
      
      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage.from('disputes').getPublicUrl(fileName);
      const evidenceUrl = publicUrlData.publicUrl;

      // 2. Freeze the Order in Database
      const { error: dbError } = await supabase.from('orders').update({
        status: 'disputed',
        dispute_reason: disputeReason,
        dispute_image_url: evidenceUrl
      }).eq('id', disputeOrder.id);

      if (dbError) throw dbError;

      // 3. WHATSAPP ALERT TO FARMER (FUNDS FROZEN)
      try {
        const { data: farmProfile } = await supabase.from('farm_profiles').select('contact_number').eq('id', disputeOrder.farmer_id).single();
        if (farmProfile?.contact_number) {
          let cleanPhone = farmProfile.contact_number.replace(/\D/g, ''); 
          if (cleanPhone.length === 10) cleanPhone = `91${cleanPhone}`;

          const orderShortId = disputeOrder.id.split('-')[0].toUpperCase();
          const disputeMsg = `🚨 *KHETIFY DISPUTE ALERT* 🚨\n\nA buyer has rejected delivery for Order #ORD-${orderShortId} due to quality issues.\n\n*Reason:* ${disputeReason}\n\n⚠️ *Action Required:* The Escrow funds for this order are now FROZEN. Please check your Khetify dashboard and contact Admin to resolve this dispute.`;

          await fetch('/api/whatsapp', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ to: cleanPhone, message: disputeMsg }) });
        }
      } catch (waErr) { console.error("WhatsApp Error:", waErr); }

      // 4. Cleanup
      setDisputeModalOpen(false);
      setDisputeFile(null);
      setDisputePreview(null);
      setDisputeReason('');
      fetchMyOrders(); // Refresh list to show 'Disputed' state

    } catch (error: any) {
      alert("Failed to submit dispute: " + error.message);
    } finally {
      setIsSubmittingDispute(false);
    }
  };

  const getTimelineSteps = (status: string) => {
    if (status === 'disputed') {
      return (
        <div className="bg-error/10 border border-error/20 rounded-2xl p-4 mt-4 flex items-center gap-4 animate-pulse">
           <span className="material-symbols-outlined text-error text-3xl">gavel</span>
           <div>
             <p className="font-black text-error uppercase tracking-widest text-[10px]">Dispute Active</p>
             <p className="text-error/80 text-xs font-bold mt-0.5">Funds frozen in Escrow. Admin is reviewing the evidence.</p>
           </div>
        </div>
      );
    }

    const displayStatus = status === 'locked' ? 'Processing' : status;
    const steps = ['Processing', 'Shipped', 'Delivered'];
    let currentIndex = steps.findIndex(s => s.toLowerCase() === displayStatus?.toLowerCase());
    if (currentIndex === -1) currentIndex = 0;

    return (
      <div className="relative flex justify-between items-center w-full mt-6 mb-2 px-2">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-outline-variant/30 rounded-full z-0"></div>
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary rounded-full z-0 transition-all duration-700 ease-out" style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}></div>
        {steps.map((step, index) => {
          const isCompleted = index <= currentIndex;
          const isActive = index === currentIndex;
          return (
            <div key={step} className="relative z-10 flex flex-col items-center gap-3">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 ${isActive ? 'bg-primary border-primary text-white shadow-lg shadow-primary/30 scale-110' : isCompleted ? 'bg-primary border-primary text-white' : 'bg-surface-container-lowest border-outline-variant text-on-surface-variant'}`}>
                {isCompleted ? <span className="material-symbols-outlined text-[20px] font-black">check</span> : <div className="w-2.5 h-2.5 rounded-full bg-outline-variant"></div>}
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-primary' : 'text-on-surface-variant'}`}>{step}</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-[#F8FAF9] min-h-screen flex flex-col font-sans relative">
      <MarketplaceNavbar />

      <main className="flex-1 max-w-[1000px] w-full mx-auto px-6 py-12 animate-in fade-in duration-500">
        
        <header className="mb-12">
          <Link href="/marketplace" className="inline-flex items-center gap-2 text-sm font-black text-on-surface-variant hover:text-primary transition-all group mb-4">
            <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-1 transition-transform">arrow_back</span> Return to Market
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-3xl flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl">inventory_2</span>
            </div>
            <div>
              <h1 className="text-4xl font-black text-on-surface tracking-tighter uppercase italic">Order History</h1>
              <p className="text-[11px] font-black text-primary uppercase tracking-[0.2em] mt-1">Live Traceability Dashboard</p>
            </div>
          </div>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
            <p className="text-[10px] text-on-surface-variant font-black uppercase tracking-[0.2em]">Syncing Blockchain Records...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-[40px] border border-outline-variant p-16 text-center shadow-sm">
            <div className="w-24 h-24 bg-surface-container-low text-on-surface-variant rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-5xl">receipt_long</span>
            </div>
            <h2 className="text-2xl font-black text-on-surface mb-2">No Active Orders</h2>
            <p className="text-on-surface-variant mb-8 max-w-md mx-auto font-medium">You haven't initiated any escrow locks yet. Discover fresh produce directly from local farms.</p>
            <Link href="/marketplace" className="inline-flex bg-primary text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-primary/20 hover:-translate-y-1 transition-all">
              Explore the Marketplace
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-[40px] border border-outline-variant shadow-sm overflow-hidden transition-all hover:shadow-xl hover:border-primary/30 group">
                
                {/* 📝 Order Header */}
                <div className="bg-surface-container-lowest p-8 border-b border-outline-variant flex flex-col md:flex-row justify-between md:items-center gap-6">
                  <div>
                    <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] mb-1">Secure Transaction ID</p>
                    <p className="text-xl font-black text-on-surface font-mono tracking-tighter">#{order.id.split('-')[0].toUpperCase()}</p>
                  </div>
                  <div className="flex flex-wrap gap-8">
                    <div>
                      <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] mb-1">Date Locked</p>
                      <p className="text-sm font-bold text-on-surface">
                        {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] mb-1">Escrow Amount</p>
                      <p className="text-lg font-black text-primary tracking-tighter">₹{Number(order.total_amount).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* 📦 Order Body & Items */}
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary text-[24px]">agriculture</span>
                      <div>
                         <h3 className="font-black text-on-surface text-lg leading-tight">Dispatched from {order.farm_name}</h3>
                         <p className="text-[10px] font-bold text-primary uppercase tracking-widest mt-0.5">{order.payment_method === 'escrow' ? 'Funds in Escrow' : 'Cash on Delivery'}</p>
                      </div>
                    </div>
                    
                    {/* ✨ RAISE DISPUTE BUTTON ✨ */}
                    {order.status !== 'disputed' && order.status !== 'delivered' && (
                      <button 
                        onClick={() => { setDisputeOrder(order); setDisputeModalOpen(true); }}
                        className="px-5 py-2.5 bg-error/10 text-error hover:bg-error hover:text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined text-[16px]">report</span> Reject Delivery
                      </button>
                    )}
                  </div>
                  
                  {/* Items List */}
                  <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-6 mb-8 space-y-4">
                    {order.items?.map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between">
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-xl border border-outline-variant overflow-hidden">
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <p className="font-black text-on-surface">{item.name}</p>
                              <p className="text-xs text-on-surface-variant font-bold">QTY: {item.qty}</p>
                            </div>
                         </div>
                         <p className="font-black text-on-surface">₹{(item.price * item.qty).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>

                  {/* 📍 Visual Timeline Component */}
                  <div className={`rounded-3xl p-8 border ${order.status === 'disputed' ? 'bg-error/5 border-error/20' : 'bg-surface-container-lowest border-outline-variant/50'}`}>
                    <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px]">share_location</span>
                      {order.status === 'disputed' ? 'Escrow Status' : 'Live Blockchain Traceability'}
                    </p>
                    {getTimelineSteps(order.status || 'locked')}
                  </div>
                </div>
                
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ✨ QUALITY REJECTION MODAL ✨ */}
      {disputeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95">
            
            <div className="bg-error p-6 flex justify-between items-center text-white">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-3xl">warning</span>
                <div>
                  <h2 className="font-black text-xl leading-tight">Reject Delivery</h2>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/80 mt-1">Freeze Escrow Funds</p>
                </div>
              </div>
              <button onClick={() => setDisputeModalOpen(false)} disabled={isSubmittingDispute} className="hover:bg-white/20 p-2 rounded-full transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={submitDispute} className="p-8 space-y-6">
              <p className="text-xs font-bold text-on-surface-variant leading-relaxed mb-6">
                If the produce arrived damaged or does not match the listing, please provide proof below. The farmer's payment will be frozen pending an Admin review.
              </p>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-on-surface uppercase tracking-widest">Reason for Rejection</label>
                <textarea 
                  required 
                  value={disputeReason} 
                  onChange={e => setDisputeReason(e.target.value)} 
                  rows={3} 
                  placeholder="e.g. Tomatoes arrived crushed and rotting..." 
                  className="w-full p-4 bg-surface-container-lowest border-2 border-outline-variant focus:border-error rounded-2xl outline-none font-bold text-sm resize-none transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-on-surface uppercase tracking-widest">Upload Photographic Proof</label>
                <div className={`relative h-40 w-full border-2 border-dashed rounded-3xl flex flex-col items-center justify-center bg-surface-container-lowest hover:bg-error/5 transition-all group overflow-hidden cursor-pointer ${!disputeFile ? 'border-outline-variant hover:border-error' : 'border-error'}`}>
                  {disputePreview ? (
                    <img src={disputePreview} className="w-full h-full object-cover opacity-80" />
                  ) : (
                    <div className="text-center p-4">
                      <span className="material-symbols-outlined text-4xl text-error/40 mb-2">add_a_photo</span>
                      <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Tap to Upload Image</p>
                    </div>
                  )}
                  <input type="file" required accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isSubmittingDispute || !disputeFile || !disputeReason}
                className="w-full bg-error text-white py-4 rounded-2xl font-black shadow-lg shadow-error/30 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmittingDispute ? (
                  <><span className="material-symbols-outlined animate-spin">sync</span> Freezing Funds...</>
                ) : (
                  <><span className="material-symbols-outlined">gavel</span> Submit Dispute</>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}