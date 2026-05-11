export default function NutritionalInfo() {
  const nutrients = [
    { label: "Calories", value: "18 kcal" },
    { label: "Vitamin C", value: "23% DV" },
    { label: "Vitamin A", value: "17% DV" },
    { label: "Potassium", value: "237 mg" }
  ];

  return (
    <div className="bg-white p-8 rounded-lg border border-outline-variant elevation-1">
      <h3 className="text-2xl font-bold mb-6 text-on-surface">Nutritional Info</h3>
      <p className="text-on-surface-variant text-xs font-bold mb-4 uppercase tracking-wider">Per 100g serving</p>
      
      <div className="space-y-4">
        {nutrients.map((item, i) => (
          <div 
            key={i} 
            className="flex justify-between items-center pb-2 border-b border-outline-variant hover:bg-surface-container-low transition-colors"
          >
            <span className="text-on-surface-variant font-medium">{item.label}</span>
            <span className="font-bold text-on-surface">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}