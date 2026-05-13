'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [adminName, setAdminName] = useState('Admin');
  
  // Platform Stats State
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    activeFarmers: 0
  });
  
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    const initializeAdmin = async () => {
      // 1. STRICT ROLE-BASED AUTH GUARD
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/login');
        return;
      }

      // Check if they actually selected "Admin" during registration!
      if (user.user_metadata?.role !== 'admin') {
        alert("SECURITY ALERT: Unauthorized access. Admin privileges required.");
        router.push('/');
        return;
      }

      setAdminName(user.user_metadata?.full_name || 'System Admin');

      // 2. Fetch Platform-Wide Data
      await fetchPlatformData();
    };

    initializeAdmin();
  }, [router]);

  const fetchPlatformData = async () => {
    // Note: In a production app, the Admin needs bypass-RLS policies. 
    // For this demo, we fetch the global orders table.
    const { data: ordersData, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && ordersData) {
      setRecentOrders(ordersData.slice(0, 10)); // Show latest 10 transactions

      // Calculate Stats
      const revenue = ordersData.reduce((sum, order) => sum + Number(order.total_amount), 0);
      const uniqueFarmers = new Set(ordersData.map(order => order.farmer_id)).size;

      setStats({
        totalOrders: ordersData.length,
        totalRevenue: revenue,
        activeFarmers: uniqueFarmers
      });
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center flex-col gap-4">
        <div className="w-12 h-12 border-4 border-surface-container-high border-t-primary rounded-full animate-spin"></div>
        <p className="font-bold text-on-surface-variant">Loading Admin Command Center...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      
      {/* ADMIN SIDEBAR */}
      <aside className="w-64 bg-[#111827] text-white flex flex-col fixed h-full z-20">
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-primary text-3xl">admin_panel_settings</span>
            <span className="text-2xl font-bold text-white tracking-tight">Khetify</span>
          </div>
          <span className="text-[10px] uppercase tracking-widest text-primary font-bold bg-primary/10 px-2 py-0.5 rounded ml-10">Admin Portal</span>
        </div>
        
        <nav className="flex-1 py-6 px-3 space-y-1">
          <Link href="/admin" className="flex items-center gap-3 px-3 py-3 bg-primary text-white rounded-lg font-bold">
            <span className="material-symbols-outlined">dashboard</span> Platform Overview
          </Link>
          <button className="w-full flex items-center gap-3 px-3 py-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg font-bold transition-colors text-left">
            <span className="material-symbols-outlined">verified_user</span> Verify Farmers
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg font-bold transition-colors text-left">
            <span className="material-symbols-outlined">account_balance</span> Escrow Management
          </button>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-gray-300">shield_person</span>
            </div>
            <div>
              <p className="text-sm font-bold text-white line-clamp-1">{adminName}</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">Superadmin</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg font-bold transition-all">
            <span className="material-symbols-outlined text-[18px]">logout</span> Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 ml-64 p-8 lg:p-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-on-surface">Platform Overview</h1>
          <p className="text-on-surface-variant">Monitor global Khetify metrics, transactions, and user activity.</p>
        </div>

        {/* TOP STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-outline-variant elevation-1">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined">account_balance_wallet</span>
              </div>
              <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-md">+12.5%</span>
            </div>
            <p className="text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-1">Total Escrow Volume</p>
            <h3 className="text-3xl font-bold text-on-surface">INR {stats.totalRevenue.toLocaleString()}</h3>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-outline-variant elevation-1">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined">receipt_long</span>
              </div>
            </div>
            <p className="text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-1">Total Orders Processed</p>
            <h3 className="text-3xl font-bold text-on-surface">{stats.totalOrders}</h3>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-outline-variant elevation-1">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined">agriculture</span>
              </div>
            </div>
            <p className="text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-1">Active Farmers</p>
            <h3 className="text-3xl font-bold text-on-surface">{stats.activeFarmers}</h3>
          </div>
        </div>

        {/* GLOBAL TRANSACTION MONITOR */}
        <div className="bg-white rounded-2xl border border-outline-variant elevation-1 overflow-hidden">
          <div className="p-6 border-b border-outline-variant flex justify-between items-center bg-surface-container-lowest">
            <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-[#D97706]">monitoring</span>
              Live Platform Transactions
            </h2>
            <button onClick={fetchPlatformData} className="text-sm font-bold text-primary hover:bg-primary/5 px-3 py-1.5 rounded-lg transition-colors">
              Refresh Data
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[800px]">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant">
                  <th className="py-3 px-6 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Order Ref</th>
                  <th className="py-3 px-6 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Buyer Email</th>
                  <th className="py-3 px-6 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Escrow Status</th>
                  <th className="py-3 px-6 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Logistics Status</th>
                  <th className="py-3 px-6 text-right text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-on-surface-variant">No transactions recorded yet.</td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-outline-variant hover:bg-surface-bright transition-colors">
                      <td className="py-4 px-6 font-medium text-sm text-on-surface">ORD-{order.id.substring(0, 6).toUpperCase()}</td>
                      <td className="py-4 px-6 text-sm text-on-surface-variant">{order.buyer_email}</td>
                      <td className="py-4 px-6">
                        <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full flex items-center w-max gap-1">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                          Secured
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                          order.status === 'Delivered' ? 'bg-gray-100 text-gray-700' : 'bg-orange-100 text-orange-700'
                        }`}>
                          {order.status || 'Processing'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right font-bold text-primary">INR {Number(order.total_amount).toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}