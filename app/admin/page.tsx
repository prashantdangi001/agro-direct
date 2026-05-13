'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'verify' | 'users'>('overview');
  
  // Data States
  const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0, activeFarmers: 0 });
  const [allFarmers, setAllFarmers] = useState<any[]>([]);

  useEffect(() => {
    const initializeAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || user.user_metadata?.role !== 'admin') {
        router.push('/');
        return;
      }
      fetchPlatformData();
      fetchAllFarmers();
    };
    initializeAdmin();
  }, [router]);

  const fetchPlatformData = async () => {
    const { data: ordersData } = await supabase.from('orders').select('*');
    if (ordersData) {
      setStats({
        totalOrders: ordersData.length,
        totalRevenue: ordersData.reduce((sum: number, order: any) => sum + Number(order.total_amount), 0),
        activeFarmers: new Set(ordersData.map((order: any) => order.farmer_id)).size
      });
    }
  };

  const fetchAllFarmers = async () => {
    const { data } = await supabase.from('farm_profiles').select('*').order('created_at', { ascending: false });
    if (data) setAllFarmers(data);
    setLoading(false);
  };

  // --- ADMIN ACTIONS ---

  const handleApproveFarmer = async (farmerId: string) => {
    if (!window.confirm("Approve this farmer and grant Verified Badge?")) return;
    
    const { error } = await supabase.from('farm_profiles').update({ verification_status: 'verified' }).eq('id', farmerId);
    if (!error) {
      setAllFarmers(prev => prev.map(f => f.id === farmerId ? { ...f, verification_status: 'verified' } : f));
    } else {
      alert("Error approving farmer.");
    }
  };

  const handleDeleteUser = async (farmerId: string) => {
    if (!window.confirm("CRITICAL WARNING: Are you sure you want to permanently delete this user's profile and ban them from the platform?")) return;

    const { error } = await supabase.from('farm_profiles').delete().eq('id', farmerId);
    if (!error) {
      alert("User account successfully deleted.");
      setAllFarmers(prev => prev.filter(f => f.id !== farmerId));
    } else {
      alert("Failed to delete user.");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-t-primary rounded-full animate-spin"></div></div>;

  const pendingFarmers = allFarmers.filter(f => f.verification_status === 'pending');

  return (
    <div className="min-h-screen bg-background flex">
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#111827] text-white flex flex-col fixed h-full z-20">
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-primary text-3xl">admin_panel_settings</span>
            <span className="text-2xl font-bold text-white tracking-tight">Khetify</span>
          </div>
          <span className="text-[10px] uppercase tracking-widest text-primary font-bold bg-primary/10 px-2 py-0.5 rounded ml-10">Admin Portal</span>
        </div>
        
        <nav className="flex-1 py-6 px-3 space-y-2">
          <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg font-bold transition-colors text-left ${activeTab === 'overview' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
            <span className="material-symbols-outlined">dashboard</span> Platform Overview
          </button>
          
          <button onClick={() => setActiveTab('verify')} className={`w-full flex items-center justify-between px-3 py-3 rounded-lg font-bold transition-colors text-left ${activeTab === 'verify' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
            <div className="flex items-center gap-3"><span className="material-symbols-outlined">how_to_reg</span> KYC Approvals</div>
            {pendingFarmers.length > 0 && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{pendingFarmers.length}</span>}
          </button>

          <button onClick={() => setActiveTab('users')} className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg font-bold transition-colors text-left ${activeTab === 'users' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
            <span className="material-symbols-outlined">manage_accounts</span> User Management
          </button>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg font-bold transition-all">
            <span className="material-symbols-outlined text-[18px]">logout</span> Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 ml-64 p-8 lg:p-12">
        
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="animate-in fade-in">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-on-surface">Platform Overview</h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-2xl border border-outline-variant elevation-1">
                <p className="text-sm font-bold text-on-surface-variant uppercase mb-1">Total Escrow Volume</p>
                <h3 className="text-3xl font-bold text-on-surface">INR {stats.totalRevenue.toLocaleString()}</h3>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-outline-variant elevation-1">
                <p className="text-sm font-bold text-on-surface-variant uppercase mb-1">Orders Processed</p>
                <h3 className="text-3xl font-bold text-on-surface">{stats.totalOrders}</h3>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-outline-variant elevation-1">
                <p className="text-sm font-bold text-on-surface-variant uppercase mb-1">Registered Farms</p>
                <h3 className="text-3xl font-bold text-on-surface">{allFarmers.length}</h3>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: VERIFY FARMERS (KYC) */}
        {activeTab === 'verify' && (
          <div className="animate-in fade-in">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-on-surface">KYC Verifications</h1>
              <p className="text-on-surface-variant">Review ID scans, Kissan IDs, and APAAR IDs carefully before granting the Verified Badge.</p>
            </div>

            <div className="bg-white rounded-2xl border border-outline-variant elevation-1 overflow-hidden">
              <table className="w-full text-left min-w-[800px]">
                <thead>
                  <tr className="bg-surface-container-low border-b border-outline-variant">
                    <th className="py-3 px-6 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Farm Profile</th>
                    <th className="py-3 px-6 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">KYC IDs</th>
                    <th className="py-3 px-6 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Identity Document</th>
                    <th className="py-3 px-6 text-right text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Decision</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingFarmers.length === 0 ? (
                    <tr><td colSpan={4} className="py-12 text-center font-bold text-on-surface-variant">No pending verifications. Queue is clear!</td></tr>
                  ) : (
                    pendingFarmers.map((farmer) => (
                      <tr key={farmer.id} className="border-b border-outline-variant hover:bg-surface-bright">
                        <td className="py-4 px-6">
                          <p className="font-bold text-sm text-on-surface">{farmer.farm_name}</p>
                          <p className="text-xs text-on-surface-variant">{farmer.full_name} • {farmer.contact_number}</p>
                        </td>
                        <td className="py-4 px-6 flex flex-col gap-1">
                          <span className="font-mono text-xs font-bold text-[#D97706] bg-[#D97706]/10 px-2 py-1 rounded w-max">
                            Kissan: {farmer.kissan_id}
                          </span>
                          <span className="font-mono text-xs font-bold text-[#059669] bg-[#059669]/10 px-2 py-1 rounded w-max">
                            APAAR: {farmer.apaar_id || 'Not Provided'}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <a href={farmer.kyc_document_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline text-sm font-bold bg-primary/10 px-3 py-1.5 rounded-lg w-max">
                            <span className="material-symbols-outlined text-[18px]">badge</span> View ID Document
                          </a>
                        </td>
                        <td className="py-4 px-6 text-right space-x-2">
                          <button onClick={() => handleDeleteUser(farmer.id)} className="bg-white border border-error text-error px-4 py-2 rounded-lg text-xs font-bold hover:bg-error/10 transition-colors">
                            Reject
                          </button>
                          <button onClick={() => handleApproveFarmer(farmer.id)} className="bg-[#059669] text-white px-4 py-2 rounded-lg text-xs font-bold shadow-sm hover:brightness-110">
                            Approve
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: USER MANAGEMENT */}
        {activeTab === 'users' && (
          <div className="animate-in fade-in">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-on-surface text-error flex items-center gap-2">
                <span className="material-symbols-outlined">warning</span>
                Platform Access Control
              </h1>
              <p className="text-on-surface-variant">Manage all registered accounts. Deleting an account revokes platform access permanently.</p>
            </div>

            <div className="bg-white rounded-2xl border border-error/20 elevation-1 overflow-hidden">
              <table className="w-full text-left min-w-[800px]">
                <thead>
                  <tr className="bg-error/5 border-b border-error/20">
                    <th className="py-3 px-6 text-[11px] font-bold uppercase tracking-wider text-error">User / Farm Name</th>
                    <th className="py-3 px-6 text-[11px] font-bold uppercase tracking-wider text-error">Location & Contact</th>
                    <th className="py-3 px-6 text-[11px] font-bold uppercase tracking-wider text-error">Verification Status</th>
                    <th className="py-3 px-6 text-right text-[11px] font-bold uppercase tracking-wider text-error">Danger Zone</th>
                  </tr>
                </thead>
                <tbody>
                  {allFarmers.map((farmer) => (
                    <tr key={farmer.id} className="border-b border-outline-variant hover:bg-surface-bright">
                      <td className="py-4 px-6">
                        <p className="font-bold text-sm text-on-surface">{farmer.farm_name}</p>
                        <p className="text-xs text-on-surface-variant">Owner: {farmer.full_name}</p>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-sm text-on-surface">{farmer.location}</p>
                        <p className="text-xs text-on-surface-variant">{farmer.contact_number}</p>
                      </td>
                      <td className="py-4 px-6">
                        {farmer.verification_status === 'verified' ? (
                          <span className="bg-[#059669]/10 text-[#059669] text-xs font-bold px-2.5 py-1.5 rounded-full flex items-center gap-1 w-max border border-[#059669]/20">
                            <span className="material-symbols-outlined text-[14px]">verified</span> Verified Badge
                          </span>
                        ) : (
                          <span className="bg-surface-container-high text-on-surface-variant text-xs font-bold px-2.5 py-1.5 rounded-full flex items-center gap-1 w-max border border-outline-variant">
                            <span className="material-symbols-outlined text-[14px]">hourglass_empty</span> Pending
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button 
                          onClick={() => handleDeleteUser(farmer.id)} 
                          className="bg-error text-white px-4 py-2 rounded-lg text-xs font-bold hover:brightness-110 shadow-sm flex items-center gap-1 ml-auto"
                        >
                          <span className="material-symbols-outlined text-[16px]">delete_forever</span> Ban User
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}