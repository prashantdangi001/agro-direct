import Link from 'next/link';

export default function FarmerNavbar() {
  return (
    <header className="bg-white border-b border-outline-variant shadow-sm sticky top-0 z-40">
      <div className="flex justify-between items-center w-full px-4 md:px-12 py-3 max-w-[1280px] mx-auto">
        
        {/* THE FIX: Wrap the logo in a Link to home */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <span className="material-symbols-outlined text-primary font-fill">eco</span>
          <span className="font-bold text-xl text-primary tracking-tight">AgroDirect</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/marketplace" className="text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors">Marketplace</Link>
          <Link href="/farmer" className="text-sm font-bold text-primary border-b-2 border-primary pb-1">Dashboard</Link>
          <Link href="#" className="text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors">Logistics</Link>
          <Link href="#" className="text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors">Analytics</Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-5">
          <button className="text-on-surface-variant hover:text-primary"><span className="material-symbols-outlined">notifications</span></button>
          <button className="text-on-surface-variant hover:text-primary"><span className="material-symbols-outlined">settings</span></button>
          <div className="w-9 h-9 rounded-full bg-surface-container-high border border-outline-variant flex items-center justify-center">
            <span className="material-symbols-outlined text-on-surface-variant">person</span>
          </div>
        </div>
      </div>
    </header>
  );
}