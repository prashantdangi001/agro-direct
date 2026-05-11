export default function AdminPendingVerifications() {
  const users = [
    { name: "Silas Mbugua", time: "Registered: 2h ago", loc: "Nakuru, Kenya", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCwUU1z30UNLwpkNB42dGcmlqH3K5Y9JDtyYpGZpbUyHrMIKTME92HtDPmcR34-Cva4BYW8oiYYBP8-iCTb3RKyNvcNfEIWwHMcaX93cyX7s4YUUwh1S31KBuXpnjTLg9fLfr7fHqcIoDEacwnBcQoJhgU5K2dCF31yDKB2L0a8s4Mxp1r37ifGAtV-xUtFUDyxUC0DUFxgZ7tZ0vHf7EU8DzkknOIM1VfiF8Duiaqy_qXR5CoFvEcmooNk2jKbXmEUteUYDPGJlWkZ" },
    { name: "Anita Chen", time: "Registered: 5h ago", loc: "Sichuan, China", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDlZrzq_CH0xuHEC2UUNaEV3oLyWb5Xa-gCjKq0MeoFJXuzOKyFtVWh-aSBepSuiydiyLfCiMwK_BKjPxxbJVSFNJWLY3yXWi2ZEulmzgF2T010e-bCA3le2Ud6FagvmYX-z8bP9KRzN9tEDxgb-wf60hsQmzqsxb1LJFLk41o86nL-RGy2Z9S3_OY5GWmYjWQGmIFXHFMvCMcaxRMYOpUKkYDJsRbCS3nA4xP6oQLrohiC2m6dMpxABYOZOvo8z_n1PwXXiam7y6Ob" }
  ];

  return (
    <section className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden elevation-1">
      <div className="p-6 border-b border-outline-variant">
        <h2 className="text-xl font-bold text-on-surface">Pending Farmer Verifications</h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-surface-container-low border-b border-outline-variant">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-outline uppercase tracking-wider">Farmer</th>
              <th className="px-6 py-4 text-xs font-bold text-outline uppercase tracking-wider">ID Photo</th>
              <th className="px-6 py-4 text-xs font-bold text-outline uppercase tracking-wider">Location</th>
              <th className="px-6 py-4 text-xs font-bold text-outline uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-outline uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {users.map((user, i) => (
              <tr key={i} className="hover:bg-surface-container-low transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img className="w-10 h-10 rounded-full object-cover border border-outline-variant" src={user.img} alt={user.name} />
                    <div>
                      <p className="font-bold text-sm text-on-surface">{user.name}</p>
                      <p className="text-[12px] text-outline font-medium">{user.time}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="w-16 h-10 bg-surface-container-high rounded border border-outline-variant flex items-center justify-center cursor-pointer hover:bg-surface-variant transition-colors">
                    <span className="material-symbols-outlined text-outline">image</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-on-surface-variant">{user.loc}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-secondary-container/10 text-on-secondary-container border border-secondary-container/20 text-[10px] font-bold uppercase tracking-wider rounded">
                    Pending Review
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold hover:brightness-110 active:scale-95 transition-all shadow-sm">
                      Approve
                    </button>
                    <button className="border border-error text-error hover:bg-error-container/10 px-4 py-2 rounded-lg text-sm font-bold active:scale-95 transition-all">
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="p-4 bg-surface-container-low flex justify-center border-t border-outline-variant">
        <button className="text-primary text-sm font-bold hover:underline">View all 12 pending requests</button>
      </div>
    </section>
  );
}