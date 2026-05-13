'use client'; // <-- STEP 4: Required for Context
import Link from 'next/link';
import MarketplaceNavbar from '@/components/layout/MarketplaceNavbar';
import { useLanguage } from '@/context/LanguageContext'; // <-- STEP 4: Import Context

export default function LandingPage() {
  const { t } = useLanguage(); // <-- STEP 4: Initialize translation function

  return (
    <div className="bg-background min-h-screen flex flex-col font-sans transition-colors duration-300">
      <MarketplaceNavbar />

      <main className="flex-1">
        {/* 1. HERO SECTION */}
        <section className="relative w-full bg-surface-container-lowest pt-20 pb-32 overflow-hidden border-b border-outline-variant">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[400px] h-[400px] bg-[#D97706]/5 rounded-full blur-3xl"></div>

          <div className="max-w-[1280px] mx-auto px-4 md:px-12 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="inline-block bg-[#D97706]/10 border border-[#D97706]/20 text-[#904d00] font-bold px-4 py-1.5 rounded-full text-sm uppercase tracking-wider">
                {t('hero_badge')}
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-on-surface leading-[1.1] tracking-tight transition-all">
                {t('hero_title')}
              </h1>
              <p className="text-lg md:text-xl text-on-surface-variant max-w-lg leading-relaxed transition-all">
                {t('hero_subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/marketplace" className="bg-primary text-white px-8 py-4 rounded-xl font-bold text-lg shadow-md hover:brightness-110 hover:-translate-y-1 transition-all text-center flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined">shopping_basket</span>
                  {t('btn_shop')}
                </Link>
                <Link href="/login" className="bg-white text-on-surface border-2 border-outline-variant px-8 py-4 rounded-xl font-bold text-lg shadow-sm hover:border-primary hover:text-primary hover:-translate-y-1 transition-all text-center flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined">agriculture</span>
                  {t('btn_farmer')}
                </Link>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative animate-in fade-in slide-in-from-right-8 duration-700 delay-200">
              <div className="w-full aspect-[4/3] bg-surface-container rounded-2xl border-4 border-white shadow-2xl overflow-hidden relative">
                <img 
                  src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=1200&auto=format&fit=crop" 
                  alt="Farmer" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md rounded-xl p-4 shadow-xl border border-white/50 flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#059669] rounded-full flex items-center justify-center text-white shrink-0">
                    <span className="material-symbols-outlined">check_circle</span>
                  </div>
                  <div>
                    <p className="font-bold text-sm text-on-surface">Payment Secured in Escrow</p>
                    <p className="text-xs text-on-surface-variant">INR 4,500 routed directly to Green Valley Farms.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. PLATFORM STATS */}
        <section className="w-full bg-primary py-12 text-white transition-colors">
          <div className="max-w-[1280px] mx-auto px-4 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/20">
            <div>
              <h3 className="text-4xl font-bold mb-1">0%</h3>
              <p className="text-sm font-medium text-primary-container">{t('stat_commission')}</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold mb-1">100%</h3>
              <p className="text-sm font-medium text-primary-container">{t('stat_isolation')}</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold mb-1">24/7</h3>
              <p className="text-sm font-medium text-primary-container">{t('stat_sync')}</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold mb-1">50+</h3>
              <p className="text-sm font-medium text-primary-container">{t('stat_farms')}</p>
            </div>
          </div>
        </section>

        {/* 3. HOW IT WORKS */}
        <section className="w-full py-24 bg-surface transition-colors">
          <div className="max-w-[1280px] mx-auto px-4 md:px-12">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-on-surface mb-4 transition-all">{t('feat_title')}</h2>
              <p className="text-on-surface-variant text-lg transition-all">{t('feat_subtitle')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant hover:border-primary/50 transition-colors group">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-3xl">hub</span>
                </div>
                <h3 className="text-xl font-bold text-on-surface mb-3">Multi-Tenant Architecture</h3>
                <p className="text-on-surface-variant leading-relaxed">
                  Postgres Row-Level Security guarantees that farmers only see their own data. Competing farms have zero access to each other's customers.
                </p>
              </div>

              <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant hover:border-[#D97706]/50 transition-colors group">
                <div className="w-16 h-16 bg-[#D97706]/10 text-[#D97706] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-3xl">route</span>
                </div>
                <h3 className="text-xl font-bold text-on-surface mb-3">Smart Order Routing</h3>
                <p className="text-on-surface-variant leading-relaxed">
                  Buyers can add crops from multiple farms into a single cart. Our algorithm splits the checkout and routes invoices directly to the correct producers.
                </p>
              </div>

              <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant hover:border-[#059669]/50 transition-colors group">
                <div className="w-16 h-16 bg-[#059669]/10 text-[#059669] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-3xl">notifications_active</span>
                </div>
                <h3 className="text-xl font-bold text-on-surface mb-3">Real-Time WebSockets</h3>
                <p className="text-on-surface-variant leading-relaxed">
                  The moment a buyer secures funds in Escrow, Supabase Realtime pushes an instantaneous WebSocket payload to the farmer's dashboard.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}