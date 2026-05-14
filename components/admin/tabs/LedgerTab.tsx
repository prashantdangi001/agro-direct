'use client';
import { useState } from 'react';
import DisputeResolutionModal from '../modals/DisputeResolutionModal';

export default function LedgerTab({ orders, onRefresh }: { orders: any[], onRefresh: () => void }) {
  const [activeDispute, setActiveDispute] = useState<any>(null);

  // ✨ LOGIC 1: EXPORT TO CSV ✨
  const handleExportCSV = () => {
    if (!orders || orders.length === 0) return alert("No data to export.");
    
    const headers = ['Transaction ID', 'Date', 'Farmer', 'Payment Method', 'Amount (INR)', 'Status'];
    const rows = orders.map(order => [
      `TRN-${order.id.slice(0, 8).toUpperCase()}`,
      new Date(order.created_at).toLocaleDateString('en-IN'),
      `"${order.farm_name}"`, // Quotes to handle commas in names
      order.payment_method === 'escrow' ? 'Escrow Wallet' : 'Cash on Delivery',
      order.total_amount,
      order.status
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `AgroDirect_Ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ✨ LOGIC 2: GENERATE & DOWNLOAD INVOICE ✨
  const handleDownloadInvoice = (order: any) => {
    const invoiceDate = new Date(order.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
    const orderId = `TRN-${order.id.split('-')[0].toUpperCase()}`;
    
    // Create a beautifully styled HTML template injected with Tailwind
    const invoiceHTML = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <title>Invoice ${orderId}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          </style>
      </head>
      <body class="bg-white text-gray-900 font-sans p-12 max-w-4xl mx-auto border border-gray-200 shadow-sm mt-10">
          <div class="flex justify-between items-start border-b-2 border-green-800 pb-8 mb-8">
              <div>
                  <h1 class="text-4xl font-black text-green-800 tracking-tighter italic">AGRODIRECT</h1>
                  <p class="text-sm font-bold text-gray-500 uppercase tracking-widest mt-1">Settlement Invoice</p>
              </div>
              <div class="text-right">
                  <p class="font-bold text-gray-800">Invoice No: <span class="font-mono">${orderId}</span></p>
                  <p class="text-sm text-gray-500">Date: ${invoiceDate}</p>
                  <p class="text-sm text-gray-500 mt-2">Status: <span class="uppercase font-bold text-green-700">${order.status === 'locked' ? 'PENDING' : order.status}</span></p>
              </div>
          </div>

          <div class="flex justify-between mb-12 bg-gray-50 p-6 rounded-xl border border-gray-200">
              <div>
                  <p class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Pay To (Producer)</p>
                  <p class="font-black text-xl text-gray-800">${order.farm_name}</p>
                  <p class="text-sm text-gray-600 mt-1">AgroDirect Verified Partner</p>
              </div>
              <div class="text-right">
                  <p class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Payment Method</p>
                  <p class="font-bold text-gray-800">${order.payment_method === 'escrow' ? 'Escrow Wallet (Secured)' : 'Cash on Delivery'}</p>
              </div>
          </div>

          <table class="w-full text-left mb-12">
              <thead class="bg-green-800 text-white">
                  <tr>
                      <th class="py-3 px-4 font-bold uppercase text-xs tracking-widest">Description</th>
                      <th class="py-3 px-4 font-bold uppercase text-xs tracking-widest text-right">Amount</th>
                  </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 border-b-2 border-gray-200">
                  <tr>
                      <td class="py-4 px-4 font-semibold text-gray-800">Agricultural Produce Settlement - ${order.farm_name}</td>
                      <td class="py-4 px-4 text-right font-mono font-bold text-gray-800">₹${order.total_amount?.toLocaleString('en-IN')}</td>
                  </tr>
                  <tr>
                      <td class="py-4 px-4 font-semibold text-gray-500 text-sm">Platform Commission (0% Zero Fee Promo)</td>
                      <td class="py-4 px-4 text-right font-mono font-bold text-green-600">- ₹0.00</td>
                  </tr>
              </tbody>
          </table>

          <div class="flex justify-end mb-12">
              <div class="w-1/2 bg-gray-50 p-6 rounded-xl border border-gray-200">
                  <div class="flex justify-between font-black text-2xl text-green-800">
                      <span>Total Payout</span>
                      <span>₹${order.total_amount?.toLocaleString('en-IN')}</span>
                  </div>
              </div>
          </div>

          <div class="text-center text-xs font-bold text-gray-400 uppercase tracking-widest border-t border-gray-200 pt-8">
              <p>This is a computer generated document. No signature is required.</p>
              <p class="mt-1">AgroDirect Ecosystem • Empowering Producers</p>
          </div>
      </body>
      </html>
    `;

    // Open hidden window, write HTML, and trigger print dialog
    const printWindow = window.open('', '_blank', 'width=800,height=900');
    if (printWindow) {
      printWindow.document.write(invoiceHTML);
      printWindow.document.close();
      // Wait for Tailwind to load before printing
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
        // Optional: printWindow.close(); after printing
      }, 500);
    } else {
      alert("Please allow pop-ups to generate invoices.");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* 🛠️ FILTER BAR */}
      <div className="bg-[#ffffff] p-6 rounded-xl border border-[#bccac0] shadow-sm flex flex-wrap items-end gap-4">
        {/* ... (Search and Dropdowns remain visually identical) ... */}
        <div className="flex-1 min-w-[200px] space-y-2">
          <label className="text-[14px] font-bold text-[#3d4a42] tracking-[0.05em]">Date Range</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#3d4a42]">calendar_today</span>
            <input type="text" defaultValue="Oct 01 - Oct 31, 2026" className="w-full pl-10 pr-4 py-2 border border-[#bccac0] rounded-lg bg-[#f7f9fb] focus:ring-2 focus:ring-[#006948] outline-none text-[#191c1e] transition-all" />
          </div>
        </div>
        <div className="flex-1 min-w-[200px] space-y-2">
          <label className="text-[14px] font-bold text-[#3d4a42] tracking-[0.05em]">Farmer</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#3d4a42]">person_search</span>
            <input type="text" placeholder="Search name..." className="w-full pl-10 pr-4 py-2 border border-[#bccac0] rounded-lg bg-[#f7f9fb] focus:ring-2 focus:ring-[#006948] outline-none text-[#191c1e] transition-all" />
          </div>
        </div>
        <div className="flex-1 min-w-[150px] space-y-2">
          <label className="text-[14px] font-bold text-[#3d4a42] tracking-[0.05em]">Type</label>
          <select className="w-full px-4 py-2 border border-[#bccac0] rounded-lg bg-[#f7f9fb] focus:ring-2 focus:ring-[#006948] outline-none appearance-none text-[#191c1e] transition-all"><option>All Types</option></select>
        </div>
        <div className="flex-1 min-w-[150px] space-y-2">
          <label className="text-[14px] font-bold text-[#3d4a42] tracking-[0.05em]">Status</label>
          <select className="w-full px-4 py-2 border border-[#bccac0] rounded-lg bg-[#f7f9fb] focus:ring-2 focus:ring-[#006948] outline-none appearance-none text-[#191c1e] transition-all"><option>All Status</option></select>
        </div>
        
        <div className="flex gap-2">
          <button className="px-6 py-2 text-[#006948] border border-[#006948] rounded-lg text-[14px] font-bold hover:bg-[#85f8c4]/20 transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">filter_list_off</span>
            Clear
          </button>
          
          {/* ✨ ATTACHED EXPORT CSV LOGIC ✨ */}
          <button 
            onClick={handleExportCSV}
            className="px-6 py-2 bg-[#904d00] text-[#ffffff] rounded-lg text-[14px] font-bold hover:opacity-90 transition-all flex items-center gap-2 shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            Export CSV
          </button>
        </div>
      </div>

      {/* 💸 FINANCIAL LEDGER TABLE */}
      <div className="bg-[#ffffff] rounded-xl border border-[#bccac0] overflow-hidden shadow-sm">
        
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[900px] border-collapse">
            <thead className="bg-[#f2f4f6] border-b border-[#bccac0]">
              <tr>
                <th className="py-4 px-6 text-[14px] font-bold text-[#3d4a42] uppercase tracking-wider">ID</th>
                <th className="py-4 px-6 text-[14px] font-bold text-[#3d4a42] uppercase tracking-wider">Date/Time</th>
                <th className="py-4 px-6 text-[14px] font-bold text-[#3d4a42] uppercase tracking-wider">Farmer</th>
                <th className="py-4 px-6 text-[14px] font-bold text-[#3d4a42] uppercase tracking-wider">Type</th>
                <th className="py-4 px-6 text-[14px] font-bold text-[#3d4a42] uppercase tracking-wider">Amount</th>
                <th className="py-4 px-6 text-[14px] font-bold text-[#3d4a42] uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-right text-[14px] font-bold text-[#3d4a42] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#bccac0]">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-24 text-center">
                    <div className="flex flex-col items-center gap-3 opacity-40">
                       <span className="material-symbols-outlined text-5xl">receipt_long</span>
                       <p className="font-bold text-[16px] italic text-[#6d7a72]">No transactions recorded yet.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                orders.map(order => (
                  <tr key={order.id} className="hover:bg-[#f7f9fb] transition-colors">
                    
                    <td className="py-4 px-6 font-semibold text-[16px] text-[#006948]">TRN-{order.id.slice(0, 4).toUpperCase()}</td>
                    <td className="py-4 px-6 text-[16px] text-[#3d4a42]">{new Date(order.created_at).toLocaleDateString('en-IN', { month: 'short', day: '2-digit', year: 'numeric' })} • {new Date(order.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false })}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#ffdcc3] flex items-center justify-center text-[#904d00] font-bold text-xs uppercase shadow-inner">{order.farm_name.charAt(0)}</div>
                        <span className="font-semibold text-[16px] text-[#191c1e]">{order.farm_name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-[#191c1e]">
                        <span className={`material-symbols-outlined text-[18px] ${order.status === 'disputed' || order.status === 'cancelled' ? 'text-[#ba1a1a]' : 'text-[#006948]'}`}>
                           {order.status === 'disputed' || order.status === 'cancelled' ? 'undo' : 'shopping_bag'}
                        </span>
                        <span className="font-semibold text-[16px]">{order.status === 'disputed' || order.status === 'cancelled' ? 'Refund' : 'Sale'}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-bold text-[16px] text-[#191c1e]">₹{order.total_amount?.toLocaleString()}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-[12px] font-bold uppercase tracking-wider border inline-block ${
                        order.status === 'delivered' ? 'bg-[#006948]/10 text-[#006948] border-[#006948]/20' : order.status === 'disputed' ? 'bg-[#ba1a1a]/10 text-[#ba1a1a] border-[#ba1a1a]/20 animate-pulse' : order.status === 'cancelled' ? 'bg-[#3d4a42]/10 text-[#3d4a42] border-[#3d4a42]/20' : 'bg-[#904d00]/10 text-[#904d00] border-[#904d00]/20'
                      }`}>
                        {order.status === 'locked' ? 'Pending' : order.status === 'delivered' ? 'Completed' : order.status}
                      </span>
                    </td>

                    {/* ✨ ATTACHED DISPUTE & INVOICE LOGIC ✨ */}
                    <td className="py-4 px-6 text-right">
                      {order.status === 'disputed' ? (
                        <button onClick={() => setActiveDispute(order)} className="px-4 py-2 bg-[#ba1a1a] text-[#ffffff] rounded-lg text-[12px] font-bold shadow-md hover:bg-[#93000a] transition-colors animate-pulse uppercase tracking-widest ml-auto flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px]">gavel</span> Resolve
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleDownloadInvoice(order)}
                          className="text-[#006948] hover:bg-[#006948]/10 px-3 py-2 rounded-lg text-[14px] font-bold flex items-center gap-1 ml-auto transition-all"
                        >
                          <span className="material-symbols-outlined text-[18px]">receipt</span>
                          View Receipt
                        </button>
                      )}
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 🔢 PAGINATION FOOTER */}
        <div className="p-6 bg-[#ffffff] flex justify-between items-center border-t border-[#bccac0]">
          <p className="text-[16px] text-[#3d4a42]">Showing 1 to {orders.length || 0} of {orders.length || 0} entries</p>
          {/* Pagination buttons omitted for brevity, remains same as before */}
        </div>

      </div>

      {/* ⚖️ ESCROW DISPUTE MODAL */}
      {activeDispute && (
        <DisputeResolutionModal 
          order={activeDispute} 
          onClose={() => setActiveDispute(null)} 
          onRefresh={onRefresh} 
        />
      )}
    </div>
  );
}