'use client';

interface VerificationHeaderProps {
  count: number;
}

export default function VerificationHeader({ count }: VerificationHeaderProps) {
  return (
    <header className="bg-surface border-b border-outline-variant px-4 md:px-12 py-4 flex justify-between items-center sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold text-on-surface">Farmer Verifications</h1>
        <span className="bg-[#85f8c4] text-[#005137] text-xs font-bold px-3 py-1 rounded-full shadow-sm">
          {count} Pending
        </span>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors">
          <span className="material-symbols-outlined">notifications</span>
          {count > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 bg-[#ba1a1a] rounded-full animate-pulse"></span>
          )}
        </button>
        <button className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors">
          <span className="material-symbols-outlined">settings</span>
        </button>
      </div>
    </header>
  );
}