'use client';
import { useRouter } from 'next/navigation';

export default function BackButton({ label = "Go Back" }: { label?: string }) {
  const router = useRouter();

  return (
    <button 
      onClick={() => router.back()}
      className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-bold text-sm mb-6 group w-fit"
    >
      <div className="w-8 h-8 rounded-full bg-surface-container-high group-hover:bg-primary-container group-hover:text-on-primary-container flex items-center justify-center transition-colors">
        <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-0.5 transition-transform">arrow_back</span>
      </div>
      {label}
    </button>
  );
}