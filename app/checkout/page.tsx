'use client';
import { useCart } from '@/context/CartContext';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import MarketplaceNavbar from '@/components/layout/MarketplaceNavbar';
import BackButton from '@/components/ui/BackButton';

export default function CheckoutPage() {
  const { cart, clearCart, getCartTotal } = useCart();
  const router = useRouter();

  const handlePlaceOrder = async () => {
    // 1. Identify all unique farmers in the cart
    const uniqueFarmers = [...new Set(cart.map(item => item.farmerId))];

    try {
      // 2. Create a separate order for each farmer
      for (const farmerId of uniqueFarmers) {
        const farmerItems = cart.filter(item => item.farmerId === farmerId);
        const farmerSubtotal = farmerItems.reduce((sum, item) => sum + (item.price * item.qty), 0);

        await supabase.from('orders').insert({
          farmer_id: farmerId, // Routes the order to the correct dashboard
          total_amount: farmerSubtotal,
          buyer_name: "Guest Buyer",
          delivery_address: "Demo Address, 123",
          status: 'Processing'
        });
      }

      clearCart();
      router.push('/farmer'); // Redirecting to dashboard for demo purposes
    } catch (err) {
      alert("Error placing order");
    }
  };

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <MarketplaceNavbar />
      <main className="flex-1 max-w-[1280px] w-full mx-auto px-12 py-8">
        <BackButton label="Back to Marketplace" />
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-on-surface">Confirm Order</h1>
          <div className="text-right">
            <p className="text-sm font-bold text-on-surface-variant uppercase">Total Payable</p>
            <p className="text-2xl font-bold text-primary">KES {getCartTotal().toFixed(2)}</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl border border-outline-variant shadow-sm text-center">
          <p className="mb-8 text-on-surface-variant font-medium">Your cart contains items from {new Set(cart.map(c => c.farmerId)).size} different farms. Each farmer will receive their specific order details instantly.</p>
          <button onClick={handlePlaceOrder} className="bg-primary text-white px-12 py-4 rounded-xl font-bold text-lg shadow-md hover:brightness-110 active:scale-95 transition-all">
            Confirm & Place Order
          </button>
        </div>
      </main>
    </div>
  );
}