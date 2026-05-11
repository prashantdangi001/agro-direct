import ProductCard from "./ProductCard";

const MOCK_PRODUCTS = [
  { name: "Roma Tomatoes", farm: "Green Valley Farm", price: "$4.50", unit: "kg", tag: "Organic", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC1OQg9d0uNLD-XCvBKxMa_JPzYO2Zdmy0hI-xkg9hRpyHsZZ5qFzgKuzQK2cDzqaKZlGGiZmnMgsWhqnn8yga5Rs9COEyVkdG2RJoGdL9dHy-1tC89gOU1X7n3huJBsZ29HvneF_420uyvcrkDK6tB-bHEkFnWRTcZmESJV31xIwsWi86fQ7DKTyZUUVGDlDDqBuh9GGK3B722pco76bcwjK2sKGAIuPTKTx6Gs5Rkbs73Ql_XCQDdydKtoVdmoP70-VS1WmSHyi4g" },
  { name: "Heirloom Carrots", farm: "Miller Orchards", price: "$2.80", unit: "bunch", tag: "New Harvest", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuClwxBPEsgExEuxiN5CP6xAd8d2HE7MhHUs3yqppIXljYyff7eC9leQ3p7s74EEmDEs5inRcTyZ3evKgQH1tA866UYw6vX4yXC1iqlZpEZGXWSzlgWZ1jKHLXTe731C-HHyH1Bf-TKnCAF8Zf9WYShWeKMldxvBtZyqcq9CfSuOA4eIRzzUesMpe-5zdAxWCs08ytgemIAqfOh_992KS_d8De431cPiBVHW4SwAY3R7GhYcXl_c6W4RVfAhzjEIMjc5H3DPNjzpe3p7" },
  { name: "Baby Spinach", farm: "Sunny Acres", price: "$5.20", unit: "500g", tag: "Certified", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAcMuzEmTPEZTM7oRCnEDGYwqwvuipfymCnlenUgG_8faOtd6DII4mkWK_bV_QxYUSKcQg-0PxyEHdPiuxB26kSRsz4mEcUjxVxi0yWaOb4T_EvzIaHZQ3YIEGqKPK3lBxkWC9xfPb1eZBbEUrfvNqDHjQicnoR78neAvO26DAM1oEJr9h6DJTmwAjKdpPARpxl1J4UlRkWOHghkHQbJBtFUNri-vF05GFa7EC6vgE5_7mb2v0roACgkafhvhQrMVmlFvN1AnzV02Dp" },
  { name: "Mixed Bell Peppers", farm: "Pioneer Farms", price: "$3.90", unit: "kg", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD3UQdLvnyifjljxdTH80l6kzqKKg0CmyjmpbCVXlFcyoODZuSYP7UnO0K1p79-qWFrs7q34u5bKAUwti4lcErKuztw46NyvEJov3zJvg6acZOkFgZwz8j92gvIkvyx8x7WrF8T1ktMOBvkoYcpXBbwVakt1Uc3zpQxhMYwE0Zwpwf1WA7LXmuKGaiISf2UKKjW-4wToMnavAif1q3eMO76BHBfAALsTxPScy19_BzDv7-qBOyJ7zSk1UBnWf-c1QUum7TSyGt7hV5c" },
  { name: "Green Asparagus", farm: "Riverside Co-op", price: "$6.40", unit: "bunch", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCVkZTTraXKBb5A8i4KH6xIKt38Xo8C_JHIthVNabK6P3eyMsSRtNHawciASvdLjkO1kcaGnHj3O4DbeJFCUr8rCYMynxOa502sqMMg1U4mVAe8GYedWvD1kUBZbLsHzmlz4VDLxtDDAUADqMqjac0aLlTeTmgffsCDfSa71E1pS91NXZ5PaLMzSSrLsmZtPaHkbn7EfIUBdAqdYId4g43Vzi7BIFbXX6h9t7-6CZ7_X5NLKChw0WH_EFT-Bz4jG__I3z_nXtl1tBNA" },
  { name: "Red Cabbage", farm: "Heritage Hills", price: "$1.75", unit: "kg", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB7-z3Tee9niE2MdBwuMU6PD6nhjUMkCfum7Uk8WpGmV1HHeW6nPfu5Mw5msUdom8E9lxNAiRidbBfl37RzL_ouuSphnfSolmXrDkd4212OuF_1FSa0Ehs4wBJC08IE-EVB9zcbMol4PykM4Dpn9vcht1qLouIEdZv1ptVsT0W3M66foGoMr9nKZw2Km-cshhri3ToQ4Lusou2h30HhiHFTD9sLMsPMiDckMQB9azp_xIOFW8EQdjw_kNpnjCuKvjvpjfUxiEK9nLbI" },
];

export default function ProductGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {MOCK_PRODUCTS.map((product, index) => (
        <ProductCard key={index} {...product} />
      ))}
    </div>
  );
}