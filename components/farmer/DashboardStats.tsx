'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function DashboardStats() {
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0 });

  useEffect(() => {
    async function fetchDashboardData() {
      // Fetch total products
      const { count: productCount } = await supabase.from('products').select('*', { count: 'exact', head: true });
      
      // Fetch total orders & revenue
      const { data: orderData } = await supabase.from('orders').select('total_amount');
      
      const totalRevenue = orderData?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;
      
      setStats({
        products: productCount || 0,
        orders: orderData?.length || 0,
        revenue: totalRevenue
      });
    }
    fetchDashboardData();
  }, []);

  const statCards = [
    { title: "Total Revenue", value: `INR ${stats.revenue.toFixed(2)}`, trend: "+12.5%", isUp: true, icon: "payments" },
    { title: "Active Listings", value: stats.products.toString(), trend: "+2", isUp: true, icon: "inventory_2" },
    { title: "Pending Orders", value: stats.orders.toString(), trend: "Needs Action", isUp: false, icon: "local_shipping", isAlert: true },
    { title: "Profile Views", value: "1,204", trend: "+18%", isUp: true, icon: "visibility" }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat, i) => (
        <div key={i} className="bg-white p-6 rounded-lg border border-outline-variant elevation-1 transition-all hover:shadow-md">
          <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-lg ${stat.isAlert ? 'bg-[#fe932c]/10 text-[#904d00]' : 'bg-primary-container/10 text-primary'}`}>
              <span className="material-symbols-outlined">{stat.icon}</span>
            </div>
            <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.isUp ? 'bg-primary/10 text-primary' : 'bg-error/10 text-error'}`}>
              {stat.trend}
            </span>
          </div>
          <p className="text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-1">{stat.title}</p>
          <h3 className="text-3xl font-bold text-on-surface tracking-tight">{stat.value}</h3>
        </div>
      ))}
    </div>
  );
}