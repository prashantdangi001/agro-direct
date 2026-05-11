export default function ProducerDetails() {
  return (
    <>
      {/* Bio Section */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-outline-variant elevation-1">
        <h2 className="text-3xl font-bold text-primary mb-4 tracking-tight">About the Farm</h2>
        <p className="text-lg text-on-surface-variant leading-relaxed">
          Located in the fertile highlands of Nakuru, Samuel's farm has been a beacon of sustainable agriculture for over 15 years. Specializing in cool-climate vegetables and grain commodities, the farm employs a holistic approach that respects the local ecosystem while producing premium-grade harvests for wholesale markets across East Africa.
        </p>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-4">Farming Practices</h3>
            <ul className="space-y-3">
              {['Regenerative Agriculture', 'Organic-certified Methods', 'Drip Irrigation Systems'].map((practice, i) => (
                <li key={i} className="flex items-center gap-3 text-on-surface font-medium">
                  <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                  {practice}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-4">Certifications</h3>
            <div className="flex flex-wrap gap-2">
              {['GlobalG.A.P.', 'KEPHIS Certified', 'Fair Trade Africa'].map((cert, i) => (
                <span key={i} className="bg-surface-container px-4 py-2 rounded-lg text-sm font-bold text-on-surface-variant border border-outline-variant">
                  {cert}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: 'compost', title: 'Soil Health', desc: 'Zero synthetic pesticides used to maintain biome diversity.' },
          { icon: 'water_drop', title: 'Water Conservation', desc: 'Advanced rainwater harvesting and precision drip tech.' },
          { icon: 'groups', title: 'Fair Labor', desc: 'Committed to living wages and community education programs.' }
        ].map((item, i) => (
          <div key={i} className="bg-surface-bright p-6 rounded-xl border border-outline-variant text-center group hover:bg-primary-container hover:text-white transition-colors cursor-default elevation-1">
            <span className="material-symbols-outlined text-primary group-hover:text-white text-[48px] mb-4 transition-colors">{item.icon}</span>
            <h4 className="text-xl font-bold mb-2">{item.title}</h4>
            <p className="text-sm font-medium opacity-80">{item.desc}</p>
          </div>
        ))}
      </div>
    </>
  );
}