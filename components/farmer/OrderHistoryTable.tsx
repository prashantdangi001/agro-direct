'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function OrderHistoryTable() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    const { data: authData } = await supabase.auth.getUser();
    if (!authData.user) return;

    // FETCH ISOLATED ORDERS: Only get orders that belong to this farmer!
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('farmer_id', authData.user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setOrders(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();

    // Listen for new orders or status updates in real-time
    const channel = supabase.channel('order-history-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        fetchOrders();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  // Allow the farmer to update the order status
  const handleUpdateStatus = async (orderId: string, currentStatus: string) => {
    let newStatus = 'Processing';
    if (currentStatus === 'Processing') newStatus = 'Shipped';
    else if (currentStatus === 'Shipped') newStatus = 'Delivered';
    else return; // If delivered, do nothing

    await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
  };

  if (loading) {
    return <div className="p-12 flex justify-center"><div className="w-10 h-10 border-4 border-surface-container-high border-t-primary rounded-full animate-spin"></div></div>;
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-outline-variant p-12 text-center elevation-1">
        <span className="material-symbols-outlined text-6xl text-outline mb-4">receipt_long</span>
        <h3 className="text-xl font-bold text-on-surface mb-2">No Orders Yet</h3>
        <p className="text-on-surface-variant">When buyers purchase your produce, their orders will appear here.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-outline-variant elevation-1 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-lowest border-b border-outline-variant">
              <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Order ID</th>
              <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Date</th>
              <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Buyer</th>
              <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Total Value</th>
              <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Status</th>
              <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-right text-on-surface-variant">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-surface-bright transition-colors">
                <td className="py-4 px-6 font-medium text-sm text-on-surface">#{order.id.split('-')[0]}</td>
                <td className="py-4 px-6 text-sm text-on-surface-variant">{new Date(order.created_at).toLocaleDateString()}</td>
                <td className="py-4 px-6">
                  <p className="text-sm font-bold text-on-surface">{order.buyer_name}</p>
                  <p className="text-xs text-on-surface-variant truncate max-w-[150px]">{order.delivery_address}</p>
                </td>
                <td className="py-4 px-6 text-sm font-bold text-primary">INR {Number(order.total_amount).toFixed(2)}</td>
                <td className="py-4 px-6">
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                    order.status === 'Delivered' ? 'bg-[#006c4a]/10 text-[#006c4a] border-[#006c4a]/20' :
                    order.status === 'Shipped' ? 'bg-[#005fb8]/10 text-[#005fb8] border-[#005fb8]/20' :
                    'bg-[#fe932c]/10 text-[#904d00] border-[#fe932c]/20'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  {order.status !== 'Delivered' ? (
                    <button 
                      onClick={() => handleUpdateStatus(order.id, order.status)}
                      className="bg-primary/10 text-primary hover:bg-primary hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                    >
                      Mark {order.status === 'Processing' ? 'Shipped' : 'Delivered'}
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-outline">Completed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}