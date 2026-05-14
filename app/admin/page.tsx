'use client';
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import OverviewTab from '@/components/admin/tabs/OverviewTab';
import VerificationsTab from '@/components/admin/tabs/VerificationsTab';
import LedgerTab from '@/components/admin/tabs/LedgerTab';
import UsersTab from '@/components/admin/tabs/UsersTab';
// ✨ 1. Import the new FarmerDetailsModal ✨
import FarmerDetailsModal from '@/components/admin/modals/FarmerDetailsModal';

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'verify' | 'ledger' | 'users'>('overview');
  
  const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0, activeFarmers: 0, pendingKYC: 0 });
  const [allFarmers, setAllFarmers] = useState<any[]>([]);
  const [allOrders, setAllOrders] = useState<any[]>([]);
  const [allBuyers, setAllBuyers] = useState<any[]>([]);
  
  // ✨ 2. Change state to hold the entire object instead of a string ✨
  const [selectedFarmerForReview, setSelectedFarmerForReview] = useState<any | null>(null);

  const syncPlatformData = useCallback(async () => {
    const { data: orders } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    const { data: profiles } = await supabase.from('farm_profiles').select('*').order('created_at', { ascending: false });
    const { data: buyers } = await supabase.from('buyer_profiles').select('*').order('created_at', { ascending: false });

    if (orders && profiles) {
      setAllOrders(orders);
      setAllFarmers(profiles);
      setAllBuyers(buyers || []);
      
      setStats({
        totalOrders: orders.length,
        totalRevenue: orders.reduce((sum, order) => sum + (Number(order.total_amount) || 0), 0),
        activeFarmers: new Set(orders.map(o => o.farmer_id)).size,
        pendingKYC: profiles.filter(p => p.verification_status === 'pending').length
      });
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || user.user_metadata?.role !== 'admin') return router.push('/');
      await syncPlatformData();
      setLoading(false);
    };
    init();

    const channel = supabase.channel('admin-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'farm_profiles' }, syncPlatformData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'buyer_profiles' }, syncPlatformData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, syncPlatformData)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [router, syncPlatformData]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f9fb]">
      <div className="w-12 h-12 border-4 border-t-[#006c4a] border-[#006c4a]/20 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f7f9fb] flex font-sans text-[#191c1e]">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} pendingCount={stats.pendingKYC} />
      
      <main className="flex-1 ml-64 flex flex-col">
        <AdminHeader title={activeTab} />
        
        <div className="p-8">
          {activeTab === 'overview' && <OverviewTab stats={stats} orders={allOrders} />}
          {activeTab === 'verify' && (
            <VerificationsTab 
              farmers={allFarmers} 
              onPreview={setSelectedFarmerForReview} // ✨ 3. Pass the new state setter ✨
              onApprove={syncPlatformData} 
            />
          )}
          {activeTab === 'ledger' && <LedgerTab orders={allOrders} onRefresh={syncPlatformData} />}
{activeTab === 'users' && <UsersTab farmers={allFarmers} buyers={allBuyers} onRefresh={syncPlatformData} />}        </div>
      </main>

      {/* ✨ 4. Render the new Farmer Details Modal ✨ */}
      {selectedFarmerForReview && (
        <FarmerDetailsModal 
          farmer={selectedFarmerForReview} 
          onClose={() => setSelectedFarmerForReview(null)} 
          onRefresh={syncPlatformData}
        />
      )}
    </div>
  );
}