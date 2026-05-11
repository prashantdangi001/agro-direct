export default function Portals() {
  const portalData = [
    {
      title: "I am a Farmer",
      desc: "List products and track sales directly with comprehensive analytics tools.",
      icon: "potted_plant",
      btnColor: "bg-primary",
      btnHover: "hover:bg-primary-container",
      iconBg: "bg-primary-container/10",
      iconColor: "text-primary"
    },
    {
      title: "I am a Buyer",
      desc: "Shop fresh produce directly from verified local producers and estates.",
      icon: "shopping_cart",
      btnColor: "bg-secondary-container",
      btnHover: "hover:bg-secondary",
      iconBg: "bg-secondary-container/10",
      iconColor: "text-secondary"
    },
    {
      title: "Administrator",
      desc: "Manage platform operations, verify users, and monitor market health.",
      icon: "admin_panel_settings",
      btnColor: "border border-outline",
      btnHover: "hover:bg-surface-variant",
      iconBg: "bg-tertiary-container/10",
      iconColor: "text-tertiary",
      textColor: "text-on-surface-variant"
    }
  ];

  return (
    <section className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop -mt-16 relative z-20 pb-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
        {portalData.map((portal, i) => (
          <div key={i} className="bg-surface-container-lowest border border-outline-variant rounded-lg p-8 flex flex-col items-center text-center elevation-1 transition-all hover:-translate-y-1">
            <div className={`w-16 h-16 ${portal.iconBg} ${portal.iconColor} rounded-full flex items-center justify-center mb-6`}>
              <span className="material-symbols-outlined text-[40px] filled-icon">{portal.icon}</span>
            </div>
            <h3 className="text-2xl font-semibold mb-2">{portal.title}</h3>
            <p className="text-on-surface-variant mb-8">{portal.desc}</p>
            <button className={`mt-auto w-full ${portal.btnColor} ${portal.btnHover} ${portal.textColor || 'text-white'} py-3 rounded-lg font-semibold transition-all active:scale-95`}>
              Login / Register
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}