'use client';

export default function OverviewTab({ stats, orders }: { stats: any; orders: any[] }) {
  // Grab only the 6 most recent transactions for the "Live Activity" feed
  const recentActivity = orders.slice(0, 6);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* 📊 REAL-TIME METRICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Metric 1: Platform Revenue */}
        <div className="bg-[#ffffff] p-6 rounded-xl border border-[#bccac0] shadow-sm flex flex-col justify-between h-36 hover:shadow-md transition-shadow group">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-lg bg-[#006948]/10 text-[#006948] flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">payments</span>
            </div>
            <span className="material-symbols-outlined text-[#bccac0] text-[18px] group-hover:text-[#006948] transition-colors cursor-pointer">more_vert</span>
          </div>
          <div>
            <p className="text-[12px] font-bold text-[#6d7a72] uppercase tracking-wider">Platform Revenue</p>
            <h3 className="text-3xl font-black text-[#191c1e] mt-1 tracking-tight">
              ₹{stats.totalRevenue?.toLocaleString('en-IN') || 0}
            </h3>
          </div>
        </div>

        {/* Metric 2: Verified Farmers */}
        <div className="bg-[#ffffff] p-6 rounded-xl border border-[#bccac0] shadow-sm flex flex-col justify-between h-36 hover:shadow-md transition-shadow group">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-lg bg-[#00855d]/10 text-[#00855d] flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">agriculture</span>
            </div>
            <span className="material-symbols-outlined text-[#bccac0] text-[18px] group-hover:text-[#00855d] transition-colors cursor-pointer">more_vert</span>
          </div>
          <div>
            <p className="text-[12px] font-bold text-[#6d7a72] uppercase tracking-wider">Verified Farmers</p>
            <h3 className="text-3xl font-black text-[#191c1e] mt-1 tracking-tight">
              {stats.activeFarmers || 0}
            </h3>
          </div>
        </div>

        {/* Metric 3: Total Orders */}
        <div className="bg-[#ffffff] p-6 rounded-xl border border-[#bccac0] shadow-sm flex flex-col justify-between h-36 hover:shadow-md transition-shadow group">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-lg bg-[#6a758a]/10 text-[#515c71] flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">trending_up</span>
            </div>
            <span className="material-symbols-outlined text-[#bccac0] text-[18px] group-hover:text-[#515c71] transition-colors cursor-pointer">more_vert</span>
          </div>
          <div>
            <p className="text-[12px] font-bold text-[#6d7a72] uppercase tracking-wider">Total Orders</p>
            <h3 className="text-3xl font-black text-[#191c1e] mt-1 tracking-tight">
              {stats.totalOrders || 0}
            </h3>
          </div>
        </div>

        {/* Metric 4: Pending KYC (Action Required) */}
        <div className="bg-[#ffffff] p-6 rounded-xl border border-[#bccac0] shadow-sm flex flex-col justify-between h-36 hover:shadow-md transition-shadow group">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-lg bg-[#fe932c]/10 text-[#904d00] flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">pending_actions</span>
            </div>
            <span className="material-symbols-outlined text-[#bccac0] text-[18px] group-hover:text-[#904d00] transition-colors cursor-pointer">more_vert</span>
          </div>
          <div>
            <p className="text-[12px] font-bold text-[#6d7a72] uppercase tracking-wider">KYC Pending</p>
            <h3 className="text-3xl font-black text-[#191c1e] mt-1 tracking-tight flex items-center gap-2">
              {stats.pendingKYC || 0}
              {stats.pendingKYC > 0 && (
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#fe932c] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#fe932c]"></span>
                </span>
              )}
            </h3>
          </div>
        </div>

      </div>

      {/* 🚜 RECENT ACTIVITY LOG */}
      <div className="bg-[#ffffff] rounded-xl border border-[#bccac0] overflow-hidden shadow-sm">
        
        {/* Section Header */}
        <div className="p-6 border-b border-[#bccac0] flex justify-between items-center bg-white">
           <h2 className="font-bold text-[#191c1e] text-[18px] flex items-center gap-2">
             <span className="material-symbols-outlined text-[#006948]">history</span>
             Live Platform Activity
           </h2>
           <button className="text-[12px] font-bold text-[#006948] uppercase tracking-wider hover:underline transition-all">
             View Full Ledger
           </button>
        </div>
        
        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px] border-collapse">
            <thead className="bg-[#f2f4f6] border-b border-[#bccac0]">
              <tr>
                <th className="py-4 px-6 text-[14px] font-bold text-[#3d4a42] uppercase tracking-wider">Transaction</th>
                <th className="py-4 px-6 text-[14px] font-bold text-[#3d4a42] uppercase tracking-wider">Source Farm</th>
                <th className="py-4 px-6 text-[14px] font-bold text-[#3d4a42] uppercase tracking-wider">Amount</th>
                <th className="py-4 px-6 text-right text-[14px] font-bold text-[#3d4a42] uppercase tracking-wider">Network Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#bccac0]">
              {recentActivity.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-20 text-center font-bold text-[#6d7a72] italic opacity-50 uppercase text-[12px] tracking-widest">
                    Waiting for network activity...
                  </td>
                </tr>
              ) : (
                recentActivity.map((order: any) => (
                  <tr key={order.id} className="hover:bg-[#f7f9fb] transition-colors group">
                    
                    {/* Ref ID */}
                    <td className="py-4 px-6">
                      <p className="font-semibold text-[14px] text-[#006948]">
                        TRN-{order.id.slice(0, 4).toUpperCase()}
                      </p>
                    </td>
                    
                    {/* Farm Details */}
                    <td className="py-4 px-6">
                      <p className="font-semibold text-[16px] text-[#191c1e]">{order.farm_name}</p>
                      <p className="text-[12px] text-[#6d7a72] font-medium mt-0.5">
                        {new Date(order.created_at).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </td>
                    
                    {/* Amount */}
                    <td className="py-4 px-6">
                      <p className="font-bold text-[#191c1e] text-[16px]">
                        ₹{order.total_amount?.toLocaleString('en-IN')}
                      </p>
                    </td>
                    
                    {/* Status */}
                    <td className="py-4 px-6 text-right">
                      <span className={`px-3 py-1 rounded-full text-[12px] font-bold uppercase tracking-wider border inline-block ${
                        order.status === 'delivered' 
                          ? 'bg-[#006948]/10 text-[#006948] border-[#006948]/20' 
                          : order.status === 'disputed' 
                          ? 'bg-[#ba1a1a]/10 text-[#ba1a1a] border-[#ba1a1a]/20 animate-pulse' 
                          : order.status === 'cancelled'
                          ? 'bg-[#3d4a42]/10 text-[#3d4a42] border-[#3d4a42]/20'
                          : 'bg-[#904d00]/10 text-[#904d00] border-[#904d00]/20'
                      }`}>
                        {order.status === 'locked' ? 'Pending' : order.status === 'delivered' ? 'Completed' : order.status}
                      </span>
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