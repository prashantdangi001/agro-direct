export default function OrderReviewCard() {
  return (
    <section className="bg-surface-container-lowest p-6 rounded-lg border border-outline-variant elevation-1">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">shopping_basket</span>
        Order Review
      </h2>
      
      <div className="space-y-6">
        <div className="flex items-center gap-4 py-4 border-b border-outline-variant">
          <img 
            alt="Roma Tomatoes" 
            className="w-20 h-20 rounded-lg object-cover border border-outline-variant" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZfpxDTnRtPNM1Ggg5LbkplCVDb9n0jrMZvHpmKxF_WG3S5vZFp3ChKi2Bl9sdWwFRgC2UP_7IKa-LE190Cgi5jITczk90ZpeZdqodLVTVL-Z3pa_rel1lB7hmN1ixyroysKj4zb0jlnrKVNedGhi16VLwGjOI5a77-0-LZNq0dO526gca97_4_JRefxKxNP2LYoLK7SawBy7Rznqv9mTW_UTxhyilVMjBsuRtI7XfCXzlaZDsC1d9gZbAXTZWMOKHD6nmIBsTNnOQ"
          />
          <div className="flex-1">
            <h3 className="font-semibold text-lg">Roma Tomatoes</h3>
            <p className="text-on-surface-variant text-sm font-semibold mt-1">Quantity: 2kg</p>
          </div>
          <div className="text-right">
            <span className="font-bold text-primary text-lg">$4.50</span>
          </div>
        </div>

        <div className="flex items-center gap-4 py-4">
          <img 
            alt="Yellow Grain Maize" 
            className="w-20 h-20 rounded-lg object-cover border border-outline-variant" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDIutTECSmNwqWwFmuq1SdnAUHQHeCZKAFvIPDln8NNBqvp-bbU4iEH6ltIHU0pGfrZSiUFACzuIhQsBByDZBItZ7Gqazi9_8edBjjzjyCExQ_1nSWSVFW01vfwervkX9PD27Y98sVuNzdsHAzfRH2gwzSmEbUjbrJYSTYmrekMcIRZIcZbYwFqY5P9RgWWSoYbsYfwpPV4mBrPL3UeSUGDCYBenEdW0eQvhPgF38V3A-enjypKzOmSNJkYYJL-PvhlkVXZh3UlJKWr"
          />
          <div className="flex-1">
            <h3 className="font-semibold text-lg">Yellow Grain Maize</h3>
            <p className="text-on-surface-variant text-sm font-semibold mt-1">Quantity: 50kg (Bulk)</p>
          </div>
          <div className="text-right">
            <span className="font-bold text-primary text-lg">$120.00</span>
          </div>
        </div>
      </div>
    </section>
  );
}