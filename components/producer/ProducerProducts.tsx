export default function ProducerProducts() {
  const products = [
    { name: "Premium Red Onions", desc: "Grade A, hand-sorted bulk onions from Nakuru highlands.", price: "INR 85.00", unit: "per kg", tag: "In Stock", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDgQ3W1QSTYmKrkFu88Pt5XUMFvQNxExoecUGLlnoiVRgjmUkBdJE4seOVP0R7VK36BU_kUMeJ7ENIQKq1LXLEKJb5iOlY7RSqwquxb9wn0Qe0Za2Akue7m31ZucBIm-40gb1W96KbCPVwVyHugJskEXEB7QIlNJ6brKiWNls02Sc4kgEcSubHYpIevmwkJD_arR-tREfZpJWKASKQxD9RcYswgak80UmWuNbr5pND0owyOgMGcDpOnn-iLHky3LOUspJ7rvFhxjb87" },
    { name: "Yellow Grain Maize", desc: "Dry-shell maize, moisture tested < 13.5%.", price: "INR 3,200", unit: "per 90kg", tag: "Bulk Discount", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCJoanfCkQYw8y_PWofaJcWTi_eTtMuNu5nMWPO6Wz-98mmRydLOCiSI-2W4pDGevE1Ivp6PeO_U4UQlh4P8tiw2uPg7XBFuXRgKXjdhrvaph4FuU9eqeSD0k0kRe6Y5GD4d1gZVNNwgn6fxLscrDv2ZyPLTHakRT5B7h7G96j-W0ZMP_5IatSQ4U2bPOT79f_a5C9ohHix0JtoUPrivE35OQCMwiVu22v99QnvH5ZsXtvs9BJj_-PB71eXkC1cR5oE3PJHnl0D-xFd" },
    { name: "Fine Green Beans", desc: "Export quality, snap-fresh beans, pesticide-free.", price: "INR 110.00", unit: "per kg", tag: "Organic", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAIKEFsyrmBcR7GwebS6s9rGfuUXJ2XSZxVSn9CJcvfpBgq6qR3FR2rt7YzHnoqZ3kSDpH_QfBI0Jfv_22LyatoKaT5AWsPmgz7RZuF1KSWon8HrYRPVjuaNzHgXC7nn2iZwPcPDSeeh2UDmb5BEIbcU67PS8k5YSojbKO1sKZEh6Q0V8sXQfYNat2B_nqT0WpbLeKBudPlQIJzcKzty98VGpZCMEJtXugCRqLxOiaNczBTZ_PvtDKif_UdpdNfg7gFgJ3AzK1dVs2w" }
  ];

  return (
    <section>
      <div className="flex justify-between items-end mb-8 border-b border-outline-variant pb-4">
        <h2 className="text-3xl font-bold text-on-surface tracking-tight">More from Samuel</h2>
        <a className="text-primary font-bold text-sm flex items-center gap-1 hover:underline cursor-pointer">
          View All Listings <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </a>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {products.map((p, i) => (
          <div key={i} className="bg-white rounded-xl border border-outline-variant shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-all">
            <div className="h-52 overflow-hidden relative">
              <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={p.img} alt={p.name} />
              <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${p.tag === 'Organic' ? 'bg-secondary text-white' : 'bg-primary-container/90 text-on-primary-container backdrop-blur-sm'}`}>
                {p.tag}
              </span>
            </div>
            <div className="p-6 flex-grow flex flex-col">
              <h3 className="text-xl font-bold mb-2">{p.name}</h3>
              <p className="text-sm font-medium text-on-surface-variant mb-6 flex-grow">{p.desc}</p>
              <div className="flex justify-between items-end mt-auto">
                <div>
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">{p.unit}</span>
                  <p className="text-xl text-primary font-bold">{p.price}</p>
                </div>
                <button className="bg-primary text-white w-12 h-12 rounded-lg hover:bg-primary-container active:scale-95 flex items-center justify-center transition-all shadow-sm">
                  <span className="material-symbols-outlined">add_shopping_cart</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}