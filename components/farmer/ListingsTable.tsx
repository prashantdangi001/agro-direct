export default function ListingsTable() {
  const listings = [
    { name: "Organic Wheat", price: "$1.20", stock: "1,200 kg", status: "In Stock", icon: "grass", color: "bg-primary-container/20 text-primary" },
    { name: "Red Onions", price: "$0.85", stock: "850 kg", status: "In Stock", icon: "nutrition", color: "bg-secondary-container/20 text-secondary" },
    { name: "Roma Tomatoes", price: "$2.10", stock: "120 kg (Low)", status: "Low Stock", icon: "yard", color: "bg-error-container/20 text-error" },
  ];

  return (
    <div className="bg-white rounded-lg border border-outline-variant overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
        <h2 className="font-bold text-lg text-on-surface">Active Listings</h2>
        <button className="text-sm font-bold text-primary hover:underline">View All</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-outline-variant bg-surface">
              <th className="py-3 px-6 text-[11px] font-bold uppercase text-on-surface-variant">Crop Name</th>
              <th className="py-3 px-6 text-[11px] font-bold uppercase text-on-surface-variant">Price / kg</th>
              <th className="py-3 px-6 text-[11px] font-bold uppercase text-on-surface-variant">Stock</th>
              <th className="py-3 px-6 text-right text-[11px] font-bold uppercase text-on-surface-variant">Action</th>
            </tr>
          </thead>
          <tbody>
            {listings.map((item, i) => (
              <tr key={i} className="border-b border-outline-variant hover:bg-surface-container-low transition-colors">
                <td className="py-4 px-6 flex items-center gap-3">
                  <div className={`w-10 h-10 rounded flex items-center justify-center ${item.color}`}><span className="material-symbols-outlined">{item.icon}</span></div>
                  <span className="font-bold text-on-surface">{item.name}</span>
                </td>
                <td className="py-4 px-6 text-on-surface">{item.price}</td>
                <td className="py-4 px-6">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold ${item.status === 'Low Stock' ? 'bg-error-container text-error' : 'bg-primary-container text-primary'}`}>{item.stock}</span>
                </td>
                <td className="py-4 px-6 text-right">
                  <button className="text-xs font-bold text-primary border border-primary px-3 py-1 rounded hover:bg-primary hover:text-white transition-all">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}