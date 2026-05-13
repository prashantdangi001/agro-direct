'use client';
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'verify' | 'ledger' | 'users'>('overview');
  
  // Platform States
  const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0, activeFarmers: 0, pendingKYC: 0 });
  const [allFarmers, setAllFarmers] = useState<any[]>([]);
  const [allOrders, setAllOrders] = useState<any[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);

  // 1. Data Fetching Logic (Real-time Synced)
  const syncPlatformData = useCallback(async () => {
    const { data: orders } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    const { data: profiles } = await supabase.from('farm_profiles').select('*').order('created_at', { ascending: false });

    if (orders && profiles) {
      setAllOrders(orders);
      setAllFarmers(profiles);
      setStats({
        totalOrders: orders.length,
        totalRevenue: orders.reduce((sum, order) => sum + (Number(order.total_amount) || 0), 0),
        activeFarmers: new Set(orders.map(o => o.farmer_id)).size,
        pendingKYC: profiles.filter(p => p.verification_status === 'pending').length
      });
    }
  }, []);

  useEffect(() => {
    const initializeAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || user.user_metadata?.role !== 'admin') {
        router.push('/');
        return;
      }
      await syncPlatformData();
      setLoading(false);
    };

    initializeAdmin();

    const channel = supabase.channel('khetify-admin-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'farm_profiles' }, () => syncPlatformData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => syncPlatformData())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [router, syncPlatformData]);

  const handleApproveFarmer = async (farmerId: string, phone: string) => {
    const { error } = await supabase.from('farm_profiles').update({ verification_status: 'verified' }).eq('id', farmerId);
    if (!error) {
      try {
        let cleanPhone = phone.replace(/\D/g, ''); 
        if (cleanPhone.length === 10) cleanPhone = `91${cleanPhone}`;
        await fetch('/api/whatsapp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            to: cleanPhone, 
            message: "✅ *Khetify Verified*\n\nYour producer profile has been approved! You can now start listing your harvest." 
          })
        });
        alert("Farmer Verified & Notified!");
      } catch (e) { console.error(e); }
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAF9]">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
    </div>
  );

  const pendingFarmers = allFarmers.filter(f => f.verification_status === 'pending');

  return (
    <div className="min-h-screen bg-[#F8FAF9] flex font-sans">
      
      {/* 🌿 BRANDED SIDEBAR */}
      <aside className="w-72 bg-white flex flex-col fixed h-full z-20 border-r border-outline-variant">
        <div className="p-10 border-b border-outline-variant">
          <Link href="/" className="text-3xl font-black tracking-tighter text-primary italic">
            KHETIFY
          </Link>
          <p className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-black mt-1">Management Hub</p>
        </div>
        
        <nav className="flex-1 py-10 px-4 space-y-2">
          {[
            { id: 'overview', icon: 'monitoring', label: 'Ecosystem Stats' },
            { id: 'verify', icon: 'verified_user', label: 'KYC Queue', count: stats.pendingKYC },
            { id: 'ledger', icon: 'account_balance', label: 'Escrow Ledger' },
            { id: 'users', icon: 'groups', label: 'Producers' }
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)} 
              className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl font-black text-sm transition-all ${
                activeTab === tab.id 
                ? 'bg-primary text-white shadow-xl shadow-primary/20' 
                : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined">{tab.icon}</span> {tab.label}
              </div>
              {tab.count !== undefined && tab.count > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${activeTab === tab.id ? 'bg-white text-primary' : 'bg-red-500 text-white'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-8 border-t border-outline-variant bg-surface-container-lowest">
          <button onClick={() => { supabase.auth.signOut(); router.push('/login'); }} className="w-full flex items-center justify-center gap-3 py-3 text-on-surface-variant font-bold hover:text-red-500 transition-colors">
            <span className="material-symbols-outlined">logout</span> Exit Admin
          </button>
        </div>
      </aside>

      {/* 🚜 MAIN WORKSPACE */}
      <main className="flex-1 ml-72 p-12">
        <header className="mb-12">
            <h1 className="text-4xl font-black text-on-surface tracking-tight uppercase italic">{activeTab}</h1>
            <p className="text-on-surface-variant font-medium mt-1 uppercase tracking-widest text-[10px]">Real-time Network Monitoring</p>
        </header>
        
        {/* TAB: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { label: 'Platform Volume', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: 'payments', bg: 'bg-primary/5', text: 'text-primary' },
                { label: 'Settled Orders', value: stats.totalOrders, icon: 'receipt_long', bg: 'bg-surface-container', text: 'text-on-surface' },
                { label: 'Active Producers', value: stats.activeFarmers, icon: 'agriculture', bg: 'bg-surface-container', text: 'text-on-surface' }
              ].map((card, i) => (
                <div key={i} className="bg-white p-10 rounded-[32px] border border-outline-variant shadow-sm hover:shadow-xl transition-all">
                  <div className={`w-14 h-14 ${card.bg} rounded-2xl flex items-center justify-center ${card.text} mb-8`}>
                    <span className="material-symbols-outlined text-3xl">{card.icon}</span>
                  </div>
                  <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] mb-2">{card.label}</p>
                  <h3 className={`text-4xl font-black ${card.text}`}>{card.value}</h3>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: KYC QUEUE */}
        {activeTab === 'verify' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="bg-white rounded-[40px] border border-outline-variant overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-surface-container-low border-b border-outline-variant">
                  <tr>
                    <th className="py-6 px-10 text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Farmer Identity</th>
                    <th className="py-6 px-10 text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Documents</th>
                    <th className="py-6 px-10 text-right text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Decision</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30">
                  {pendingFarmers.length === 0 ? (
                    <tr><td colSpan={3} className="py-32 text-center font-bold text-on-surface-variant italic">System Secure. No pending KYC.</td></tr>
                  ) : (
                    pendingFarmers.map(f => (
                      <tr key={f.id} className="hover:bg-primary/5 transition-colors group">
                        <td className="py-8 px-10">
                          <p className="font-black text-xl text-on-surface leading-tight group-hover:text-primary transition-colors">{f.farm_name}</p>
                          <p className="text-xs text-on-surface-variant font-bold mt-1">{f.full_name} • {f.contact_number}</p>
                        </td>
                        <td className="py-8 px-10">
                          <button onClick={() => setSelectedDoc(f.kyc_document_url)} className="flex items-center gap-2 px-5 py-2.5 bg-surface-container-low text-on-surface font-black text-[10px] uppercase rounded-xl hover:bg-primary hover:text-white transition-all">
                            <span className="material-symbols-outlined text-[18px]">visibility</span> Review Document
                          </button>
                        </td>
                        <td className="py-8 px-10 text-right">
                          <button onClick={() => handleApproveFarmer(f.id, f.contact_number)} className="bg-primary text-white font-black text-xs px-8 py-3 rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">APPROVE</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: LEDGER */}
        {activeTab === 'ledger' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="bg-white rounded-[40px] border border-outline-variant overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-on-surface text-white/50">
                  <tr>
                    <th className="py-6 px-10 text-[10px] font-black uppercase tracking-widest">Transaction</th>
                    <th className="py-6 px-10 text-[10px] font-black uppercase tracking-widest text-center">Amount</th>
                    <th className="py-6 px-10 text-right text-[10px] font-black uppercase tracking-widest">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30">
                  {allOrders.map(order => (
                    <tr key={order.id} className="hover:bg-surface-container-lowest transition-colors">
                      <td className="py-8 px-10">
                        <p className="font-black text-on-surface">{order.farm_name}</p>
                        <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter mt-1">ID: #{order.id.slice(0, 8)}</p>
                      </td>
                      <td className="py-8 px-10 text-center">
                        <p className="font-black text-2xl text-primary tracking-tighter">₹{order.total_amount?.toLocaleString()}</p>
                        <p className="text-[9px] font-black text-primary/60 uppercase tracking-widest">No Commission</p>
                      </td>
                      <td className="py-8 px-10 text-right">
                        <span className="bg-amber-50 text-amber-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-amber-100">
                          {order.escrow_status || 'locked'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

      {/* 🖼️ DOCUMENT MODAL (GLASSMORPHIC) */}
      {selectedDoc && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-on-surface/90 backdrop-blur-sm p-10 animate-in fade-in duration-300">
          <button onClick={() => setSelectedDoc(null)} className="absolute top-10 right-10 text-white font-black text-[10px] tracking-widest bg-white/10 px-6 py-3 rounded-full hover:bg-white/20 transition-all">EXIT PREVIEW</button>
          <img src={selectedDoc} className="max-w-full max-h-full rounded-[40px] object-contain shadow-2xl border-8 border-white/5" alt="KYC Document" />
        </div>
      )}
    </div>
  );
}