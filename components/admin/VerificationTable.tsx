export default function VerificationTable() {
  const applications = [
    { name: "Samuel Okoro", id: "FRM-8291", date: "Oct 24, 2023", time: "14:32 PM", status: "Pending", loc: "Lagos, NG", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBHIGnPpQq1uHvPja192kf4J51uFUfRfwOpkwN5SwiVQoCreXQYz4Kkfb6AwCuTYQ8S31CGW4cvBDglYVbSwZtfYXm0SDfjeDJhzCOOsBQpWpj5ALcgx8x62_iT81CMZ4IX9SHvPLr8NljvihWmjOz9IzrCkNfWA4QnFw-Xyai5szLKLv1MplJlbglUOyaNv_DVN-AuGHDQCcS8GebFP6eY_0Nfh31qDeCAoCJRJEg6t62TwTLfJkePJx5WkbBptiiJnt_51lDsGHhz" },
    { name: "Elena Rodriguez", id: "FRM-3342", date: "Oct 23, 2023", time: "09:15 AM", status: "In Review", loc: "Mendoza, AR", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBcA6cw61QY6lHd1ZKB-Rfh2-yNV9RfEMD3nj9oxg5do23m5-qYS_THrCSj0ljQUXVQFCVGVRgUwwHM-UzP85yTuXLoMv-OvQCRc7UZ608tGC8ZOKcCQAC0wCvc77c2I3b7bGyTqo4gTpGbK3lSBQxUEkAX6oypFi_RopnmZ5yTyNTwu_0n3SaH2xDIpe1cFQB1ZUk5r5ozROS3d2UPlZZFw2115Gr2DzcnCDSRHc4Kd2B5Yz0yyYDn45w08E97wBhgdAyLlGnxiR_g" },
    { name: "Marcus Kwane", id: "FRM-1102", date: "Oct 23, 2023", time: "16:45 PM", status: "Pending", loc: "Nairobi, KE", img: null, initials: "MK" },
    { name: "Thomas Müller", id: "FRM-7721", date: "Oct 22, 2023", time: "11:20 AM", status: "In Review", loc: "Bavaria, DE", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDthIbTUJcOZaMrSP2vOjLGCvFjPHViBdVOqIJg8iJxwUoL8UPAbcoRVZ-FXIJq52NgsYbTEcpE6mTaZrupWxoQZGdDr3X6WQxxEry6wOCHg7Y8eo6CO7phYk3ABkVxTRZDhA3MnXtjnq4Zy8UMjrL18Tyxx3sJlQk4fTtIomNTOMdo1SP3wiTeizsPUEDoU_CjxSeS0k5Vi4N72qRiwsmVSzhiREAeEYGI8wz60gNtAutXSHipojPBlLgWVzDYopHvuTxdjlgFQ1_G" }
  ];

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-96">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
          <input 
            className="w-full pl-10 pr-4 py-2 bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" 
            placeholder="Search farmers by name or ID..." 
            type="text"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-outline-variant rounded-lg font-bold text-sm text-on-surface-variant hover:bg-surface-container-high transition-all active:scale-95 shadow-sm">
            <span className="material-symbols-outlined text-sm">filter_list</span>
            Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-bold text-sm hover:brightness-110 transition-all active:scale-95 shadow-sm">
            <span className="material-symbols-outlined text-sm">download</span>
            Export CSV
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-lg border border-outline-variant elevation-1 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="px-6 py-4 font-bold text-on-surface-variant uppercase text-xs tracking-wider">Farmer Name</th>
                <th className="px-6 py-4 font-bold text-on-surface-variant uppercase text-xs tracking-wider">Application Date</th>
                <th className="px-6 py-4 font-bold text-on-surface-variant uppercase text-xs tracking-wider">Status</th>
                <th className="px-6 py-4 font-bold text-on-surface-variant uppercase text-xs tracking-wider">Location</th>
                <th className="px-6 py-4 font-bold text-on-surface-variant uppercase text-xs tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {applications.map((app, idx) => (
                <tr key={idx} className="hover:bg-surface-container-low transition-colors cursor-pointer group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {app.img ? (
                        <img alt={app.name} className="w-10 h-10 rounded-full border border-outline-variant object-cover" src={app.img} />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-[#68dba9] flex items-center justify-center text-[#005137] font-bold border border-outline-variant">
                          {app.initials}
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-sm text-on-surface">{app.name}</p>
                        <p className="text-xs text-on-surface-variant">ID: {app.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-on-surface">{app.date}</p>
                    <p className="text-xs text-on-surface-variant">{app.time}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      app.status === 'Pending' ? 'bg-[#fe932c]/10 text-[#904d00] border border-[#fe932c]/20' : 'bg-[#6a758a]/10 text-[#3c475a] border border-[#6a758a]/20'
                    }`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-on-surface-variant">{app.loc}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="bg-primary text-white px-4 py-2 rounded-lg font-bold text-xs hover:brightness-110 active:scale-95 transition-all shadow-sm">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 bg-surface-container-low flex flex-col sm:flex-row justify-between items-center border-t border-outline-variant gap-4">
          <p className="text-sm font-medium text-on-surface-variant">Showing 1 to 4 of 124 applications</p>
          <div className="flex items-center gap-2">
            <button className="p-1 hover:bg-surface-variant rounded disabled:opacity-30 transition-colors" disabled>
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>
            <button className="w-8 h-8 flex items-center justify-center bg-primary text-white rounded font-bold text-xs shadow-sm">1</button>
            <button className="w-8 h-8 flex items-center justify-center hover:bg-surface-variant text-on-surface-variant rounded font-bold text-xs transition-colors">2</button>
            <button className="w-8 h-8 flex items-center justify-center hover:bg-surface-variant text-on-surface-variant rounded font-bold text-xs transition-colors">3</button>
            <button className="p-1 hover:bg-surface-variant rounded transition-colors">
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}