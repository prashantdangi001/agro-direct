export default function AdminSidebar() {
  return (
    <aside className="hidden md:flex flex-col w-64 bg-surface-container-lowest border-r border-outline-variant h-screen sticky top-0 z-20">
      <div className="px-6 py-8">
        <span className="text-2xl font-bold text-primary tracking-tight">Khetify</span>
        <p className="text-sm font-semibold text-outline mt-1">Admin Console</p>
      </div>
      
      <nav className="flex-1 px-4 space-y-2">
        <a className="flex items-center gap-3 px-4 py-3 bg-primary-container text-on-primary-container rounded-xl shadow-sm" href="#">
          <span className="material-symbols-outlined">dashboard</span>
          <span className="text-sm font-bold">Dashboard</span>
        </a>
        <a className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-variant transition-colors rounded-xl" href="#">
          <span className="material-symbols-outlined">verified_user</span>
          <span className="text-sm font-bold">Farmer Verification</span>
        </a>
        <a className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-variant transition-colors rounded-xl" href="#">
          <span className="material-symbols-outlined">receipt_long</span>
          <span className="text-sm font-bold">Transaction Logs</span>
        </a>
        <a className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-variant transition-colors rounded-xl" href="#">
          <span className="material-symbols-outlined">gavel</span>
          <span className="text-sm font-bold">Dispute Center</span>
        </a>
      </nav>

      <div className="p-4 border-t border-outline-variant">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-8 h-8 rounded-full bg-tertiary-fixed flex items-center justify-center border border-outline-variant">
            <span className="material-symbols-outlined text-on-tertiary-fixed text-sm">person</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-on-surface">Alex Moderator</span>
            <span className="text-[12px] text-outline font-medium">Level 2 Admin</span>
          </div>
        </div>
      </div>
    </aside>
  );
}