import Hero from "@/components/home/Hero";
import Portals from "@/components/home/Portals";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Navigation would go here */}
      <Hero />
      <Portals />
      
      {/* Market Ticker logic would follow here */}
      <footer className="bg-surface-container-low border-t border-outline-variant py-8 text-center text-sm text-on-surface-variant">
        © 2024 AgroDirect Marketplace. Direct from Soil to Storefront.
      </footer>
    </main>
  );
}