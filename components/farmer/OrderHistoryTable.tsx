'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function OrderHistoryTable() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setOrders(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();

    const channel = supabase
      .channel('order-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        fetchOrders();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const advanceStatus = async (id: string, currentStatus: string) => {
    let newStatus = 'Processing';
    if (currentStatus === 'Processing') newStatus = 'Shipped';
    if (currentStatus === 'Shipped') newStatus = 'Delivered';

    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', id);

    if (!error) fetchOrders();
  };

  // HACKATHON PRO-TIP: A button to instantly clear all old orders for a clean demo
  const clearDemoOrders = async () => {
    if (confirm("Are you sure you want to delete all orders? This is great for resetting your demo!")) {
      const { error } = await supabase
        .from('orders')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // A trick to delete ALL rows safely
      
      if (!error) fetchOrders();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20 bg-white rounded-lg border border-outline-variant">
        <div className="w-8 h-8 border-4 border-surface-container-high border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Demo Reset Button - Keep this for your hackathon presentation! */}
      <div className="flex justify-end">
        <button 
          onClick={clearDemoOrders}
          className="text-xs font-bold text-error hover:bg-error-container/20 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">delete_sweep</span>
          Clear Test Orders
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-lg border border-outline-variant p-12 text-center elevation-1">
          <span className="material-symbols-outlined text-6xl text-outline mb-4">inbox</span>
          <h3 className="text-xl font-bold text-on-surface mb-2">No Orders Yet</h3>
          <p className="text-on-surface-variant">When buyers check out from the marketplace, their orders will appear here.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-outline-variant elevation-1 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant">
                  <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Order ID</th>
                  <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Date</th>
                  <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Delivery Info</th>
                  <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Total Amount</th>
                  <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Status</th>
                  <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-on-surface-variant text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-surface-bright transition-colors group">
                    <td className="py-4 px-6">
                      <p className="font-bold text-sm text-on-surface">ORD-{order.id.substring(0, 6).toUpperCase()}</p>
                    </td>
                    <td className="py-4 px-6 text-sm text-on-surface-variant">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm font-bold text-on-surface truncate max-w-[200px]">{order.delivery_address}</p>
                      <p className="text-xs text-on-surface-variant">{order.payment_method}</p>
                    </td>
                    <td className="py-4 px-6 text-sm font-bold text-primary">
                      KES {order.total_amount.toFixed(2)}
                    </td>
                    
                    {/* UPDATED STATUS BADGES */}
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        order.status === 'Processing' ? 'bg-[#fe932c]/10 text-[#904d00] border-[#fe932c]/20' : 
                        order.status === 'Shipped' ? 'bg-[#0052cc]/10 text-[#0052cc] border-[#0052cc]/20' : 
                        'bg-primary/10 text-primary border-primary/20'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    
                    {/* UPDATED ACTION BUTTONS */}
                    <td className="py-4 px-6 text-right">
                      {order.status === 'Processing' && (
                        <button 
                          onClick={() => advanceStatus(order.id, order.status)}
                          className="bg-primary hover:bg-primary-container text-white px-4 py-2 rounded-lg text-xs font-bold shadow-sm transition-all active:scale-95 flex items-center gap-1 ml-auto"
                        >
                          <span className="material-symbols-outlined text-sm">local_shipping</span>
                          Mark as Shipped
                        </button>
                      )}
                      
                      {order.status === 'Shipped' && (
                        <div className="flex items-center justify-end gap-2">
                          <button className="border border-outline-variant text-on-surface-variant hover:bg-surface-container-high px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">location_on</span>
                            Trace Progress
                          </button>
                          <button 
                            onClick={() => advanceStatus(order.id, order.status)}
                            className="bg-primary hover:bg-primary-container text-white px-3 py-2 rounded-lg text-xs font-bold shadow-sm transition-all active:scale-95 flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-sm">check_circle</span>
                            Deliver
                          </button>
                        </div>
                      )}

                      {order.status === 'Delivered' && (
                        <span className="text-xs font-bold text-outline uppercase tracking-widest flex items-center justify-end gap-1">
                          <span className="material-symbols-outlined text-sm">done_all</span>
                          Completed
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}