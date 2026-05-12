import Link from 'next/link';

export default function MarketplaceHeader() {
  return (
    <header className="bg-surface border-b border-outline-variant shadow-sm sticky top-0 z-50">
      <nav className="flex justify-between items-center w-full px-4 md:px-12 py-2 max-w-[1280px] mx-auto">
        {/* Brand Logo */}
        <Link href="/" className="text-2xl font-bold text-primary tracking-tight">
          Khetify
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link 
            href="/marketplace" 
            className="text-primary border-b-2 border-primary pb-1 font-semibold text-sm"
          >
            Marketplace
          </Link>
          <Link 
            href="#" 
            className="text-on-surface-variant hover:text-primary transition-colors text-sm font-medium"
          >
            Producers
          </Link>
          <Link 
            href="#" 
            className="text-on-surface-variant hover:text-primary transition-colors text-sm font-medium"
          >
            Logistics
          </Link>
          <Link 
            href="#" 
            className="text-on-surface-variant hover:text-primary transition-colors text-sm font-medium"
          >
            Analytics
          </Link>
        </div>

        {/* Action Icons & Profile */}
        <div className="flex items-center gap-4">
          <button className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-all">
            notifications
          </button>
          <button className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-all">
            settings
          </button>
          
          {/* Profile Image - Placeholder for now */}
          <div className="w-10 h-10 rounded-full border border-outline-variant overflow-hidden bg-surface-container">
            <img 
              alt="User profile" 
              className="w-full h-full object-cover"
              src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y" 
            />
          </div>
        </div>
      </nav>
    </header>
  );
}