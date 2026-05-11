export default function InventoryTable() {
  // Mock data representing the farmer's database records
  const inventory = [
    { id: "PRD-001", name: "Organic Roma Tomatoes", category: "Vegetables", price: "$4.50/kg", stock: 120, status: "In Stock" },
    { id: "PRD-002", name: "Yellow Grain Maize", category: "Grains", price: "$1.20/kg", stock: 850, status: "In Stock" },
    { id: "PRD-003", name: "Red Sweet Onions", category: "Vegetables", price: "$0.90/kg", stock: 15, status: "Low Stock" },
    { id: "PRD-004", name: "Hass Avocados", category: "Fruits", price: "$3.00/kg", stock: 0, status: "Out of Stock" },
  ];

  return (
    <div className="bg-white rounded-lg border border-outline-variant elevation-1 overflow-hidden">
      {/* Table Header Controls */}
      <div className="p-4 border-b border-outline-variant bg-surface-container-lowest flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-72">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
          <input 
            type="text" 
            placeholder="Search inventory..." 
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm transition-all"
          />
        </div>
        <button className="flex items-center gap-2 text-sm font-bold text-on-surface-variant hover:text-primary transition-colors">
          <span className="material-symbols-outlined text-sm">filter_list</span>
          Filter
        </button>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low border-b border-outline-variant">
              <th className="py-3 px-6 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Produce</th>
              <th className="py-3 px-6 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Category</th>
              <th className="py-3 px-6 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Price</th>
              <th className="py-3 px-6 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Stock</th>
              <th className="py-3 px-6 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Status</th>
              <th className="py-3 px-6 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {inventory.map((item) => (
              <tr key={item.id} className="hover:bg-surface-bright transition-colors group">
                <td className="py-4 px-6">
                  <p className="font-bold text-on-surface">{item.name}</p>
                  <p className="text-xs text-on-surface-variant font-medium">{item.id}</p>
                </td>
                <td className="py-4 px-6 text-sm text-on-surface-variant">{item.category}</td>
                <td className="py-4 px-6 text-sm font-bold text-on-surface">{item.price}</td>
                <td className="py-4 px-6 text-sm text-on-surface-variant font-medium">{item.stock} kg</td>
                <td className="py-4 px-6">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                    item.status === 'In Stock' ? 'bg-primary/10 text-primary border-primary/20' : 
                    item.status === 'Low Stock' ? 'bg-[#fe932c]/10 text-[#904d00] border-[#fe932c]/20' : 
                    'bg-error/10 text-error border-error/20'
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-lg transition-all" title="Edit">
                      <span className="material-symbols-outlined text-sm">edit</span>
                    </button>
                    <button className="p-2 text-on-surface-variant hover:text-error hover:bg-error-container/50 rounded-lg transition-all" title="Delete">
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination Footer */}
      <div className="p-4 border-t border-outline-variant bg-surface-container-lowest flex justify-between items-center text-sm text-on-surface-variant">
        <span>Showing 1 to 4 of 4 entries</span>
        <div className="flex gap-1">
          <button className="px-3 py-1 border border-outline-variant rounded hover:bg-surface-container transition-colors disabled:opacity-50" disabled>Prev</button>
          <button className="px-3 py-1 border border-outline-variant rounded bg-primary text-white font-bold">1</button>
          <button className="px-3 py-1 border border-outline-variant rounded hover:bg-surface-container transition-colors disabled:opacity-50" disabled>Next</button>
        </div>
      </div>
    </div>
  );
}