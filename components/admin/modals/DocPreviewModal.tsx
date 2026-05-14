export default function DocPreviewModal({ url, onClose }: { url: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#191c1e]/90 backdrop-blur-md p-10">
      <button onClick={onClose} className="absolute top-8 right-8 text-white font-black text-[11px] tracking-widest bg-white/10 px-6 py-3 rounded-full hover:bg-white/20 border border-white/20 transition-all">EXIT PREVIEW</button>
      <div className="bg-white p-2 rounded-[48px] shadow-2xl max-w-4xl max-h-full overflow-hidden">
        <img src={url} className="max-h-[80vh] w-auto rounded-[40px] object-contain" alt="KYC Document" />
      </div>
    </div>
  );
}