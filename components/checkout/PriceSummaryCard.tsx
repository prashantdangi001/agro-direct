export default function PriceSummaryCard() {
  return (
    <div className="space-y-6">
      <section className="bg-surface-container-high p-6 rounded-lg border border-outline-variant elevation-1">
        <h2 className="text-2xl font-bold mb-6">Price Summary</h2>
        
        <div className="space-y-4">
          <div className="flex justify-between text-on-surface-variant font-medium">
            <span>Subtotal</span>
            <span>$124.50</span>
          </div>
          <div className="flex justify-between text-on-surface-variant font-medium">
            <span>Delivery Fee</span>
            <span>$12.00</span>
          </div>
          <div className="flex justify-between text-on-surface-variant font-medium">
            <span>Taxes (VAT)</span>
            <span>$8.72</span>
          </div>
          
          <div className="pt-4 border-t border-outline-variant">
            <div className="flex justify-between items-baseline">
              <span className="font-bold text-lg text-on-surface">Total</span>
              <span className="text-3xl font-bold text-primary">$145.22</span>
            </div>
          </div>
        </div>

        <button className="w-full mt-8 py-4 bg-[#fe932c] text-white font-bold text-lg rounded-lg shadow-sm hover:bg-[#d97706] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
          Place Order
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
        
        <p className="text-center text-xs font-medium text-on-surface-variant mt-4 leading-relaxed">
          By placing an order, you agree to AgroDirect's terms of service and harvest policies.
        </p>
      </section>

      {/* Trust Badge */}
      <div className="flex items-center gap-3 p-4 bg-primary-container/10 border border-primary/20 rounded-lg">
        <span className="material-symbols-outlined text-primary filled-icon text-[32px]">verified_user</span>
        <div>
          <p className="font-bold text-primary text-sm">AgroDirect Verified</p>
          <p className="text-on-surface-variant text-xs font-medium mt-0.5">Secure escrow payment enabled.</p>
        </div>
      </div>
    </div>
  );
}