export default function AdminHeader() {
  return (
    <header className="bg-surface border-b border-outline-variant px-4 md:px-12 py-4 flex justify-between items-center sticky top-0 z-10">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold text-on-surface">Dashboard</h1>
        <p className="text-sm font-semibold text-outline">Real-time platform overview</p>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
          <input 
            className="pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded-lg focus:border-primary focus:ring-1 outline-none text-sm w-64 transition-all" 
            placeholder="Search data..." 
            type="text"
          />
        </div>
        <button className="p-2 text-on-surface-variant hover:bg-surface-variant rounded-full transition-colors">
          <span className="material-symbols-outlined">notifications</span>
        </button>
      </div>
    </header>
  );
}