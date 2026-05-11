export default function FarmerSnippet() {
  return (
    <div className="mt-auto flex items-center gap-4 p-4 rounded-lg border border-outline-variant bg-white elevation-1">
      {/* 64px circular profile image */}
      <img 
        className="w-16 h-16 rounded-full object-cover border border-outline-variant" 
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuByabOMpb1sGx1FrsaaCrgLNrJM-gWWYzG0xV4s793JdpjyzBDOwMuBdO8tIbu6OiPOaVTNxamE8L5yrZofNJuoANOW0-2VHWsoelK7kPY1xsb9WsIRco9zOt1ObtfgtLDZluIuGQ8NBWQ_rS2JbjU41rdhiKmr9HlYmyv9_aYPVuXBkAkWYUA4w0Na6_LLKbQ0678Y5rLpS9HN_mriyHsNxfHnEQuojTvbFCrDXXuSs-VW81OI_QmUl2lp36GcsNW0CJ4Vw4T37BIN" 
        alt="Farmer portrait"
      />
      <div>
        <h4 className="font-bold text-on-surface">Samuel Mwangi</h4>
        <p className="text-on-surface-variant text-xs italic leading-relaxed">
          "Farming with heart for three generations at Green Valley."
        </p>
      </div>
      {/* Primary Emerald Green Link */}
      <button className="ml-auto text-primary text-sm font-bold hover:underline transition-all">
        About Farm
      </button>
    </div>
  );
}