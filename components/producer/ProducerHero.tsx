export default function ProducerHero() {
  return (
    <section className="relative h-[320px] md:h-[480px] w-full overflow-hidden">
      <img 
        className="w-full h-full object-cover" 
        alt="Samuel Mwangi Farm" 
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBl_VXC4fMiPQDTm-Nrh9qAc7rQfv47wn0vlxxy7S5ZwPNF_6L-zWOwxmfVTgAWxuebYILPN1Pk20RgqiaDytNae8mgaG_w_lbhXyMDXifKymatlXzkB23vEZRXEEBLbLlm8bxulgLNzGVCgMIhpjRjqmU0xvhw1pf12h2pVhWAD2nyXScYPN2k5pO2NDx4vgBHZZNvFCuhBJ3cA88FJZr92OiG8Mpj-M1qa5XdNK-x-mMMjaNht5MRW8CJZSQPae2shy3XCrLRwxm_"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
      
      <div className="absolute bottom-0 left-0 w-full p-4 md:p-12 max-w-[1280px] mx-auto right-0 flex flex-col md:flex-row md:items-end justify-between">
        <div className="text-white">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-primary-container text-on-primary-container px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] filled-icon">verified</span>
              Verified Farmer
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-2 tracking-tight">Samuel Mwangi</h1>
          <div className="flex items-center gap-1 text-white/90">
            <span className="material-symbols-outlined text-[20px]">location_on</span>
            <span className="font-medium">Nakuru, Kenya</span>
          </div>
        </div>
        
        <div className="mt-6 md:mt-0">
          <button className="bg-primary hover:bg-primary-container text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-transform active:scale-95 shadow-sm">
            <span className="material-symbols-outlined">mail</span>
            Contact Samuel
          </button>
        </div>
      </div>
    </section>
  );
}