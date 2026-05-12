export default function ProducerSidebar() {
  return (
    <div className="space-y-6">
      
      {/* Quick Stats Card */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 elevation-1">
        <h3 className="font-bold text-lg text-on-surface mb-6 border-b border-outline-variant pb-2">Verified Statistics</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-on-surface-variant font-medium">Experience</span>
            <span className="font-bold text-on-surface">15 Years</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-on-surface-variant font-medium">Total Sales</span>
            <span className="font-bold text-on-surface">1,240+</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-on-surface-variant font-medium">Avg. Rating</span>
            <span className="font-bold text-primary flex items-center gap-1">
              4.9 <span className="material-symbols-outlined text-[16px] filled-icon">star</span>
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-on-surface-variant font-medium">Response Time</span>
            <span className="font-bold text-on-surface">&lt; 2 Hours</span>
          </div>
        </div>
      </div>

      {/* Trust & Safety Badge */}
      <div className="bg-primary-container/10 border border-primary/20 rounded-xl p-6 relative overflow-hidden">
        <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-[100px] text-primary opacity-5 transform rotate-12">verified_user</span>
        
        <div className="flex items-center gap-3 mb-3 relative z-10">
          <span className="material-symbols-outlined text-primary filled-icon text-2xl">verified_user</span>
          <h4 className="font-bold text-primary text-lg">Khetify Verified</h4>
        </div>
        
        <p className="text-sm text-on-surface-variant mb-5 relative z-10 leading-relaxed font-medium">
          Identity, geographic location, and farming practices have been physically audited and verified by our field operations team.
        </p>
        
        <p className="text-xs font-bold text-primary uppercase tracking-widest relative z-10 flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">event_available</span>
          Last Audit: March 12, 2026
        </p>
      </div>
      
    </div>
  );
}