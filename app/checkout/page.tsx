import MarketplaceNavbar from "@/components/layout/MarketplaceNavbar";
import OrderReviewCard from "@/components/checkout/OrderReviewCard";
import DeliveryDetailsCard from "@/components/checkout/DeliveryDetailsCard";
import PaymentMethodCard from "@/components/checkout/PaymentMethodCard";
import PriceSummaryCard from "@/components/checkout/PriceSummaryCard";

export default function CheckoutPage() {
  return (
    <div className="bg-background min-h-screen flex flex-col">
      <MarketplaceNavbar />
      
      <main className="w-full max-w-[1280px] mx-auto px-4 md:px-12 py-8 flex-grow">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-on-surface">Checkout Review</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Order, Delivery, Payment (8 Columns) */}
          <div className="lg:col-span-8 space-y-6">
            <OrderReviewCard />
            <DeliveryDetailsCard />
            <PaymentMethodCard />
          </div>
          
          {/* Right Column: Sticky Summary (4 Columns) */}
          <div className="lg:col-span-4 sticky top-24">
            <PriceSummaryCard />
          </div>

        </div>
      </main>
    </div>
  );
}