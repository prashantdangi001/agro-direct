import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative h-[600px] flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBmMX3sWHuDXL61NbqxdJkUGgSznEq-zhSFTIS-lxJxM0kDeVpFps2EYyL2_Zg2zRH-tPt_lXLQHEbHz9PlRyWizbBt7B3eU7hYjDHMqGBtIbjwCy3F5hnfhJthvqcgEMyjWSLMYG4kO90PhqtRW5e4yo8Nd4qlg4jG4IL99LqaXZtbzNpYwjDDTnvBJ2xRAXdJMiehc_urCtnaibnZP1rCDBOI_PFGPY-jGSecvbVyW_R5LoNIaFZ8joVKaJgWltCiN-qiO5D6DG7U" 
          alt="Lush agricultural field" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
      </div>
      <div className="relative z-10 max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop w-full">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Connecting Soil to <br/><span className="text-primary-fixed">Storefront</span>
          </h1>
          <p className="text-lg text-white/90 mb-8 max-w-lg">
            The modern marketplace for tech-forward farmers and regional buyers. Streamline your supply chain with direct agricultural commerce.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="bg-primary hover:bg-primary-container text-white px-8 py-3 rounded-lg font-semibold transition-all elevation-1 active:scale-95">
              Get Started
            </button>
            <button className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/30 px-8 py-3 rounded-lg font-semibold transition-all">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}