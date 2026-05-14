'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import MarketplaceNavbar from '@/components/layout/MarketplaceNavbar';
import Link from 'next/link';

const CANCEL_REASONS = [
  "Ordered by mistake",
  "Found a better price elsewhere",
  "Delivery time is too long",
  "Incorrect delivery address",
  "Changed my mind",
  "Other"
];

export default function BuyerOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // MODAL STATES
  const [disputeModalOpen, setDisputeModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  
  // FORM STATES
  const [reason, setReason] = useState('');
  const [disputeFile, setDisputeFile] = useState<File | null>(null);
  const [disputePreview, setDisputePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // ✨ CANCEL ORDER LOGIC ✨
  const handleCancelOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason || !selectedOrder) return;
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: 'cancelled', dispute_reason: `Cancelled: ${reason}` })
        .eq('id', selectedOrder.id);

      if (error) throw error;

      // Notify Farmer via WhatsApp
      const { data: farm } = await supabase.from('farm_profiles').select('contact_number').eq('id', selectedOrder.farmer_id).single();
      if (farm?.contact_number) {
        let phone = farm.contact_number.replace(/\D/g, '');
        if (phone.length === 10) phone = `91${phone}`;
        const msg = `⚠️ *Order Cancelled*\n\nOrder #ORD-${selectedOrder.id.split('-')[0].toUpperCase()} has been cancelled by the buyer.\nReason: ${reason}`;
        fetch('/api/whatsapp', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ to: phone, message: msg }) });
      }

      setCancelModalOpen(false);
      setReason('');
      fetchMyOrders();
    } catch (err: any) {
      alert("Cancellation failed: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTimelineSteps = (status: string) => {
    if (status === 'cancelled') return <div className="mt-4 p-4 bg-gray-100 border rounded-2xl text-gray-500 font-bold text-xs uppercase tracking-widest text-center">Order Cancelled</div>;
    if (status === 'disputed') return <div className="mt-4 p-4 bg-error/10 border border-error/20 rounded-2xl text-error font-bold text-xs uppercase tracking-widest text-center animate-pulse">Dispute Active: Funds Frozen</div>;

    const displayStatus = status === 'locked' ? 'Processing' : status;
    const steps = ['Processing', 'Shipped', 'Delivered'];
    let idx = steps.findIndex(s => s.toLowerCase() === displayStatus?.toLowerCase());
    if (idx === -1) idx = 0;

    return (
      <div className="relative flex justify-between items-center w-full mt-6 mb-2 px-2">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-outline-variant/30 rounded-full"></div>
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary rounded-full transition-all duration-700" style={{ width: `${(idx / (steps.length - 1)) * 100}%` }}></div>
        {steps.map((step, i) => (
          <div key={step} className="relative z-10 flex flex-col items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border-2 ${i <= idx ? 'bg-primary border-primary text-white' : 'bg-white border-outline-variant text-on-surface-variant'}`}>
              {i <= idx ? <span className="material-symbols-outlined text-[20px]">check</span> : <div className="w-2.5 h-2.5 rounded-full bg-outline-variant"></div>}
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest">{step}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-[#F8FAF9] min-h-screen flex flex-col font-sans">
      <MarketplaceNavbar />
      <main className="flex-1 max-w-[1000px] w-full mx-auto px-6 py-12">
        <header className="mb-12">
          <h1 className="text-4xl font-black text-on-surface tracking-tighter uppercase italic">Order History</h1>
        </header>

        {loading ? (
          <div className="text-center py-20">Syncing Records...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[40px] border">No active orders found.</div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-[40px] border border-outline-variant shadow-sm overflow-hidden p-8">
                <div className="flex justify-between items-start mb-6 flex-wrap gap-4">
                  <div>
                    <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">ORD-{order.id.split('-')[0].toUpperCase()}</p>
                    <h3 className="font-black text-xl">From {order.farm_name}</h3>
                  </div>

                  <div className="flex gap-2">
                    {/* ✨ CANCEL BUTTON: Only if status is 'locked' ✨ */}
                    {order.status === 'locked' && (
                      <button 
                        onClick={() => { setSelectedOrder(order); setCancelModalOpen(true); }}
                        className="px-4 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all"
                      >
                        Cancel Order
                      </button>
                    )}

                    {/* REJECT BUTTON: Only if not cancelled/delivered/disputed */}
                    {!['cancelled', 'disputed', 'delivered'].includes(order.status) && order.status !== 'locked' && (
                      <button 
                        onClick={() => { setSelectedOrder(order); setDisputeModalOpen(true); }}
                        className="px-4 py-2 bg-error/10 text-error hover:bg-error hover:text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all"
                      >
                        Reject Delivery
                      </button>
                    )}
                  </div>
                </div>

                <div className="bg-surface-container-lowest border rounded-3xl p-6 mb-6">
                   {order.items?.map((item: any, i: number) => (
                     <div key={i} className="flex justify-between font-bold text-sm mb-2">
                       <span>{item.qty}x {item.name}</span>
                       <span>₹{(item.price * item.qty).toLocaleString()}</span>
                     </div>
                   ))}
                   <div className="border-t mt-4 pt-4 flex justify-between font-black text-lg">
                     <span>Total Paid</span>
                     <span className="text-primary">₹{Number(order.total_amount).toLocaleString()}</span>
                   </div>
                </div>

                {getTimelineSteps(order.status)}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ✨ CANCELLATION MODAL ✨ */}
      {cancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl">
            <div className="bg-on-surface p-6 text-white flex justify-between items-center">
              <h2 className="font-black text-xl uppercase tracking-tight">Cancel Order</h2>
              <button onClick={() => setCancelModalOpen(false)} className="material-symbols-outlined">close</button>
            </div>
            <form onSubmit={handleCancelOrder} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Reason for Cancellation</label>
                <select 
                  required 
                  value={reason} 
                  onChange={e => setReason(e.target.value)}
                  className="w-full p-4 bg-surface-container-low border-2 border-outline-variant rounded-2xl outline-none font-bold text-sm focus:border-primary"
                >
                  <option value="">Select a reason...</option>
                  {CANCEL_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <button disabled={isSubmitting || !reason} className="w-full bg-on-surface text-white py-4 rounded-2xl font-black shadow-lg hover:brightness-110 disabled:opacity-50 transition-all">
                {isSubmitting ? 'Processing...' : 'Confirm Cancellation'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}