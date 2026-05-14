'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function UsersTab({ farmers = [], buyers = [], onRefresh }: { farmers: any[], buyers: any[], onRefresh: () => void }) {
  const [filter, setFilter] = useState<'all' | 'farmer' | 'buyer'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Normalize and merge the data streams so they share the same table structure
  const allUsers = [
    ...farmers.map(f => ({ 
      id: f.id, 
      name: f.full_name || f.farm_name, 
      subtext: f.farm_name,
      phone: f.contact_number, 
      role: 'farmer', 
      status: f.verification_status === 'verified' ? 'Verified' : 'Pending KYC',
      date: f.created_at 
    })),
    ...buyers.map(b => ({ 
      id: b.id, 
      name: b.full_name || 'Registered Buyer', 
      subtext: 'Consumer Account',
      phone: b.phone || 'N/A', 
      role: 'buyer', 
      status: 'Active',
      date: b.created_at 
    }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Apply Search & Filter logic
  const filteredUsers = allUsers.filter(user => {
    const matchesFilter = filter === 'all' || user.role === filter;
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.phone?.includes(searchTerm);
    return matchesFilter && matchesSearch;
  });

  // ✨ THE BAN HAMMER LOGIC ✨
  const handleDeleteUser = async (userId: string, role: string, userName: string) => {
    const isConfirmed = confirm(`🛑 WARNING: Are you sure you want to permanently delete ${userName}? This will wipe their profile from the AgroDirect database.`);
    if (!isConfirmed) return;

    setIsDeleting(userId);

    try {
      // Determine which table to delete from based on the user's role
      const tableName = role === 'farmer' ? 'farm_profiles' : 'buyer_profiles';

      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', userId);

      if (error) throw error;

      alert(`${userName} has been successfully deleted from the platform.`);
      onRefresh(); // Refresh the table manually just in case real-time lags
    } catch (err: any) {
      alert("Failed to delete user: " + err.message);
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* 🛠️ SEARCH & FILTER BAR */}
      <div className="bg-[#ffffff] p-6 rounded-xl border border-[#bccac0] shadow-sm flex flex-wrap items-center gap-4">
        
        <div className="flex-1 min-w-[250px]">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#3d4a42]">search</span>
            <input 
              type="text" 
              placeholder="Search users by name or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[#bccac0] rounded-lg bg-[#f7f9fb] focus:ring-2 focus:ring-[#006948] outline-none text-[#191c1e] transition-all"
            />
          </div>
        </div>
        
        <div className="w-[200px]">
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="w-full px-4 py-2 border border-[#bccac0] rounded-lg bg-[#f7f9fb] focus:ring-2 focus:ring-[#006948] outline-none text-[#191c1e] transition-all font-bold"
          >
            <option value="all">All Users</option>
            <option value="farmer">Producers (Farmers)</option>
            <option value="buyer">Consumers (Buyers)</option>
          </select>
        </div>
        
        <button className="px-6 py-2 bg-[#191c1e] text-[#ffffff] rounded-lg text-[14px] font-bold hover:bg-[#3d4a42] transition-all flex items-center gap-2 shadow-sm ml-auto">
          <span className="material-symbols-outlined text-[18px]">person_add</span>
          Invite User
        </button>

      </div>

      {/* 👥 USERS DIRECTORY TABLE */}
      <div className="bg-[#ffffff] rounded-xl border border-[#bccac0] overflow-hidden shadow-sm">
        
        <div className="p-6 border-b border-[#bccac0] flex justify-between items-center bg-[#f2f4f6]">
          <h2 className="font-bold text-[#191c1e] text-lg flex items-center gap-2">
            <span className="material-symbols-outlined text-[#006948]">contacts</span>
            Platform Directory
          </h2>
          <span className="text-[10px] font-bold text-[#6d7a72] uppercase tracking-widest bg-white px-3 py-1 rounded-full border border-[#bccac0]/50 shadow-sm">
            Total Users: {filteredUsers.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[900px] border-collapse">
            <thead className="bg-[#ffffff] border-b border-[#bccac0]">
              <tr>
                <th className="py-4 px-6 text-[14px] font-bold text-[#3d4a42] uppercase tracking-wider">User Identity</th>
                <th className="py-4 px-6 text-[14px] font-bold text-[#3d4a42] uppercase tracking-wider">Account Type</th>
                <th className="py-4 px-6 text-[14px] font-bold text-[#3d4a42] uppercase tracking-wider">Contact</th>
                <th className="py-4 px-6 text-[14px] font-bold text-[#3d4a42] uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-[14px] font-bold text-[#3d4a42] uppercase tracking-wider">Joined Date</th>
                <th className="py-4 px-6 text-right text-[14px] font-bold text-[#3d4a42] uppercase tracking-wider">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#bccac0]">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-24 text-center">
                    <div className="flex flex-col items-center gap-3 opacity-40">
                       <span className="material-symbols-outlined text-5xl">group_off</span>
                       <p className="font-bold text-[16px] italic text-[#6d7a72]">No users match your filters.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-[#f7f9fb] transition-colors">
                    
                    {/* User Identity */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm uppercase shadow-inner border ${
                          user.role === 'farmer' ? 'bg-[#f5fff7] text-[#006948] border-[#006948]/30' : 'bg-[#f2f4f6] text-[#515c71] border-[#bccac0]'
                        }`}>
                          {user.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                           <span className="block font-semibold text-[16px] text-[#191c1e]">{user.name}</span>
                           <span className="block text-[12px] text-[#6d7a72] font-bold mt-0.5">{user.subtext}</span>
                        </div>
                      </div>
                    </td>

                    {/* Account Type Badge (Visually Separates Farmers vs Buyers) */}
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider border inline-flex items-center gap-1.5 shadow-sm ${
                        user.role === 'farmer' 
                          ? 'bg-[#006948] text-[#ffffff] border-[#006948]' 
                          : 'bg-[#ffffff] text-[#515c71] border-[#515c71]/50'
                      }`}>
                        <span className="material-symbols-outlined text-[14px]">{user.role === 'farmer' ? 'agriculture' : 'shopping_cart'}</span>
                        {user.role === 'farmer' ? 'Producer' : 'Consumer'}
                      </span>
                    </td>

                    {/* Contact */}
                    <td className="py-4 px-6 font-semibold text-[14px] text-[#3d4a42]">
                      {user.phone}
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-[12px] font-bold uppercase tracking-wider border inline-block ${
                        user.status === 'Verified' || user.status === 'Active'
                          ? 'bg-[#006948]/10 text-[#006948] border-[#006948]/20' 
                          : 'bg-[#904d00]/10 text-[#904d00] border-[#904d00]/20'
                      }`}>
                        {user.status}
                      </span>
                    </td>

                    {/* Joined Date */}
                    <td className="py-4 px-6 text-[14px] text-[#3d4a42] font-medium">
                      {new Date(user.date).toLocaleDateString('en-IN', { month: 'short', day: '2-digit', year: 'numeric' })}
                    </td>

                    {/* Actions (Delete/Ban Hammer) */}
                    <td className="py-4 px-6 text-right space-x-2">
                       <button 
                         disabled={isDeleting === user.id}
                         onClick={() => handleDeleteUser(user.id, user.role, user.name)}
                         className="px-4 py-2 text-[#ba1a1a] bg-[#ba1a1a]/10 hover:bg-[#ba1a1a] hover:text-[#ffffff] rounded-lg transition-all border border-[#ba1a1a]/20 font-bold text-[12px] flex items-center gap-1 ml-auto disabled:opacity-50 uppercase tracking-widest"
                         title="Permanently Delete User"
                       >
                         {isDeleting === user.id ? (
                           <span className="material-symbols-outlined text-[16px] animate-spin">sync</span>
                         ) : (
                           <span className="material-symbols-outlined text-[16px]">person_remove</span>
                         )}
                         {isDeleting === user.id ? 'Deleting...' : 'Delete'}
                       </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}