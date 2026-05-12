'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function DashboardStats() {
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0, views: 0 });

  useEffect(() => {
    async function fetchDashboardData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [profileRes, productRes, orderRes] = await Promise.all([
        supabase.from('farm_profiles').select('profile_views').eq('id', user.id).single(),
        supabase.from('products').select('*', { count: 'exact', head: true }).eq('farmer_id', user.id),
        supabase.from('orders').select('total_amount, status').eq('farmer_id', user.id)
      ]);

      const totalRevenue = orderRes.data?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;
      const pendingOrdersCount = orderRes.data?.filter(order => order.status !== 'Delivered').length || 0;
      
      setStats({
        products: productRes.count || 0,
        orders: pendingOrdersCount,
        revenue: totalRevenue,
        views: profileRes.data?.profile_views || 0 
      });
    }

    fetchDashboardData();

    const channel = supabase.channel('stats-isolation')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => fetchDashboardData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'farm_profiles' }, () => fetchDashboardData())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const statCards = [
    { title: "Total Revenue", value: `KES ${stats.revenue.toFixed(2)}`, trend: "+12.5%", isUp: true, icon: "payments", isAlert: false },
    { title: "Active Listings", value: stats.products.toString(), trend: "+2", isUp: true, icon: "inventory_2", isAlert: false },
    { title: "Pending Orders", value: stats.orders.toString(), trend: stats.orders > 0 ? "Action Required" : "Cleared", isUp: stats.orders === 0, icon: "local_shipping", isAlert: stats.orders > 0 },
    { title: "Profile Views", value: stats.views.toLocaleString(), trend: "Live", isUp: true, icon: "visibility", isAlert: false }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat, i) => (
        <div key={i} className="bg-white p-6 rounded-lg border border-outline-variant elevation-1">
          <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-lg ${stat.isAlert ? 'bg-[#fe932c]/10 text-[#904d00]' : 'bg-primary-container/10 text-primary'}`}>
              <span className="material-symbols-outlined">{stat.icon}</span>
            </div>
            <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.isUp ? 'bg-primary/10 text-primary' : 'bg-error/10 text-error'}`}>
              {stat.trend}
            </span>
          </div>
          <p className="text-sm font-bold text-on-surface-variant uppercase mb-1">{stat.title}</p>
          <h3 className="text-3xl font-bold text-on-surface tracking-tight">{stat.value}</h3>
        </div>
      ))}
    </div>
  );
}