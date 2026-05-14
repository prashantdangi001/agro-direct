import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function AdminSidebar({ activeTab, setActiveTab, pendingCount }: any) {
  const router = useRouter();
  
  const navItems = [
    { id: 'overview', icon: 'home', label: 'Dashboard' },
    { id: 'verify', icon: 'verified_user', label: 'Verifications', count: pendingCount },
    { id: 'ledger', icon: 'receipt_long', label: 'Transaction Logs' },
    { id: 'users', icon: 'groups', label: 'User Directory' }
  ];

  return (
    <aside className="w-64 bg-white flex flex-col fixed h-full z-20 border-r border-[#bccac0]">
      <div className="px-6 py-8">
        <Link href="/" className="text-2xl font-black tracking-tight text-[#006948] flex items-center gap-2 italic">
          <span className="material-symbols-outlined">agriculture</span> AgroDirect
        </Link>
        <p className="text-[11px] uppercase tracking-widest text-[#3d4a42] font-bold mt-1 opacity-70">Admin Moderator</p>
      </div>
      
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => (
          <button 
            key={item.id}
            onClick={() => setActiveTab(item.id)} 
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm transition-all ${
              activeTab === item.id ? 'bg-[#00855d] text-white shadow-md' : 'text-[#3d4a42] hover:bg-[#f2f4f6]'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span> {item.label}
            </div>
            {item.count > 0 && (
              <span className="bg-[#fe932c] text-white text-[10px] px-2 py-0.5 rounded-full font-black">{item.count}</span>
            )}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-[#bccac0]">
        <div className="flex items-center gap-3 p-3 bg-[#f2f4f6] rounded-2xl border border-[#bccac0]/50 mb-3">
          <div className="w-10 h-10 rounded-full bg-[#006c4a] flex items-center justify-center text-white">
            <span className="material-symbols-outlined text-sm">person</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-black text-[#191c1e]">Admin Root</span>
            <span className="text-[10px] text-[#3d4a42] font-bold">Session Active</span>
          </div>
        </div>
        <button onClick={() => { supabase.auth.signOut(); router.push('/login'); }} className="w-full flex items-center justify-center gap-2 py-2 text-red-600 font-bold text-xs uppercase tracking-widest">
          <span className="material-symbols-outlined text-[18px]">logout</span> Log Out
        </button>
      </div>
    </aside>
  );
}