'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function OrderHistoryTable() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    // 1. Security Check: Get the logged-in farmer
    const { data: authData } = await supabase.auth.getUser();
    
    if (authData.user) {
      // 2. Fetch ONLY orders belonging to this farmer
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('farmer_id', authData.user.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setOrders(data);
      }
    }
    setLoading(false);
  };

  // 3. THE MAGIC FIX: Update the database when the farmer changes the status
  const handleStatusChange = async (orderId: string, newStatus: string) => {
    // Optimistic UI Update (Makes it feel instant for the farmer)
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));

    // Actually update the database securely
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (error) {
      console.error("Status update failed:", error);
      alert("Failed to update order status.");
      fetchOrders(); // Revert back if it fails
    }
  };

  // Helper to color-code the dropdown based on current status
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Harvested': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Shipped': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Delivered': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-outline-variant overflow-hidden shadow-sm elevation-1">
      <div className="px-6 py-5 border-b border-outline-variant bg-surface-container-lowest flex justify-between items-center">
        <h2 className="font-bold text-lg text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">receipt_long</span>
          Live Order Management
        </h2>
        <button onClick={fetchOrders} className="text-sm font-bold text-primary hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
          <span className="material-symbols-outlined text-[16px]">refresh</span> Refresh
        </button>
      </div>

      <div className="overflow-x-auto hide-scrollbar">
        <table className="w-full text-left min-w-[800px]">
          <thead>
            <tr className="border-b border-outline-variant bg-surface-container-low">
              <th className="py-3 px-6 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Order ID</th>
              <th className="py-3 px-6 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Buyer Details</th>
              <th className="py-3 px-6 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Delivery Address</th>
              <th className="py-3 px-6 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Total Value</th>
              <th className="py-3 px-6 text-right text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Traceability Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="py-12 text-center">
                  <div className="w-8 h-8 border-4 border-surface-container-high border-t-primary rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-on-surface-variant font-medium text-sm">Syncing orders...</p>
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-on-surface-variant">
                  <span className="material-symbols-outlined text-4xl mb-2 opacity-50">inbox</span>
                  <p className="font-bold">No orders received yet.</p>
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="border-b border-outline-variant hover:bg-surface-bright transition-colors group">
                  <td className="py-4 px-6">
                    <p className="font-bold text-on-surface">ORD-{order.id.substring(0, 6).toUpperCase()}</p>
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-bold text-on-surface text-sm">{order.buyer_name}</p>
                    <p className="text-xs text-on-surface-variant">{order.buyer_email}</p>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-sm text-on-surface-variant max-w-[200px] truncate" title={order.delivery_address}>
                      {order.delivery_address}
                    </p>
                    <p className="text-[10px] font-bold text-primary uppercase mt-1">{order.payment_method}</p>
                  </td>
                  <td className="py-4 px-6 font-bold text-primary">
                    INR {Number(order.total_amount).toLocaleString()}
                  </td>
                  <td className="py-4 px-6 text-right">
                    {/* THE INTERACTIVE STATUS DROPDOWN */}
                    <select 
                      value={order.status || 'Processing'}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className={`text-xs font-bold border rounded-lg px-3 py-1.5 outline-none cursor-pointer appearance-none text-center ${getStatusColor(order.status || 'Processing')}`}
                    >
                      <option value="Processing">Processing</option>
                      <option value="Harvested">Harvested</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </select>
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