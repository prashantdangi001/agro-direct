export default function AdminHeader({ title }: { title: string }) {
  return (
    <header className="h-16 bg-white border-b border-[#bccac0] flex items-center justify-between px-8 sticky top-0 z-10">
      <span className="text-[#3d4a42] font-black text-xs uppercase tracking-[0.2em]">{title} workspace</span>
      <div className="flex items-center gap-6">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#6d7a72] text-[18px]">search</span>
          <input className="pl-10 pr-4 py-2 bg-[#f2f4f6] border-none rounded-full text-xs w-64 focus:ring-2 focus:ring-[#006c4a] outline-none" placeholder="Search resources..." />
        </div>
        <div className="flex gap-2">
          <button className="p-2 text-[#3d4a42] hover:bg-[#f2f4f6] rounded-full transition-colors"><span className="material-symbols-outlined text-[20px]">notifications</span></button>
          <button className="p-2 text-[#3d4a42] hover:bg-[#f2f4f6] rounded-full transition-colors"><span className="material-symbols-outlined text-[20px]">help</span></button>
        </div>
      </div>
    </header>
  );
}