'use client';
import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function RegistrationForm() {
  const router = useRouter();
  // 1. ADDED 'admin' to the role state
  const [role, setRole] = useState<'farmer' | 'buyer' | 'admin'>('farmer');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', password: '', farmName: '', location: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    // Call Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.fullName,
          phone: formData.phone,
          role: role,
          farm_name: role === 'farmer' ? formData.farmName : null,
          location: role === 'farmer' ? formData.location : null,
        }
      }
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
    } else {
      
      // 2. THE FIX: Auto-create the Farm Profile so they don't have to do it in Settings!
      if (role === 'farmer' && data.user) {
        const { error: profileError } = await supabase.from('farm_profiles').upsert({
          id: data.user.id,
          farm_name: formData.farmName,
          location: formData.location,
          about: 'Newly registered farm on AgroDirect.' // Default description
        });

        if (profileError) {
          console.error("Failed to auto-create profile:", profileError);
        }
      }

      // 3. THE FIX: Route them to their respective dashboard
      if (role === 'farmer') {
        router.push('/farmer');
      } else if (role === 'admin') {
        router.push('/admin'); // Route to the admin panel
      } else {
        router.push('/marketplace');
      }
    }
  };

  return (
    <>
      {/* 4. THE FIX: Updated grid to 3 columns to fit the Admin card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Farmer Card */}
        <div onClick={() => setRole('farmer')} className={`group cursor-pointer p-6 rounded-xl transition-all active:scale-[0.98] flex flex-col items-center text-center ${role === 'farmer' ? 'bg-surface-container-low border-2 border-primary shadow-sm' : 'bg-white border border-outline-variant shadow-sm hover:border-primary/50'}`}>
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors ${role === 'farmer' ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container text-on-surface-variant group-hover:text-primary'}`}>
            <span className="material-symbols-outlined text-4xl">agriculture</span>
          </div>
          <h3 className="text-xl font-bold mb-2 text-on-surface">Farmer</h3>
          <p className="text-xs text-on-surface-variant">List produce, manage inventory, and reach buyers.</p>
        </div>

        {/* Buyer Card */}
        <div onClick={() => setRole('buyer')} className={`group cursor-pointer p-6 rounded-xl transition-all active:scale-[0.98] flex flex-col items-center text-center ${role === 'buyer' ? 'bg-surface-container-low border-2 border-primary shadow-sm' : 'bg-white border border-outline-variant shadow-sm hover:border-primary/50'}`}>
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors ${role === 'buyer' ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container text-on-surface-variant group-hover:text-primary'}`}>
            <span className="material-symbols-outlined text-4xl">shopping_basket</span>
          </div>
          <h3 className="text-xl font-bold mb-2 text-on-surface">Buyer</h3>
          <p className="text-xs text-on-surface-variant">Source fresh local produce at scale securely.</p>
        </div>

        {/* Admin Card */}
        <div onClick={() => setRole('admin')} className={`group cursor-pointer p-6 rounded-xl transition-all active:scale-[0.98] flex flex-col items-center text-center ${role === 'admin' ? 'bg-surface-container-low border-2 border-primary shadow-sm' : 'bg-white border border-outline-variant shadow-sm hover:border-primary/50'}`}>
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors ${role === 'admin' ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container text-on-surface-variant group-hover:text-primary'}`}>
            <span className="material-symbols-outlined text-4xl">admin_panel_settings</span>
          </div>
          <h3 className="text-xl font-bold mb-2 text-on-surface">Admin</h3>
          <p className="text-xs text-on-surface-variant">Oversee verifications, monitor transactions, and manage the platform.</p>
        </div>

      </div>

      <div className="bg-white rounded-xl p-8 border border-outline-variant shadow-sm elevation-1">
        
        {errorMsg && (
          <div className="bg-error/10 border border-error text-error p-4 rounded-lg mb-6 text-sm font-bold flex items-center gap-2">
            <span className="material-symbols-outlined">error</span>
            {errorMsg}
          </div>
        )}

        <form className="space-y-8" onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div className="border-b border-outline-variant pb-2">
              <h2 className="text-2xl font-bold text-on-surface">Personal Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-on-surface-variant block">Full Name</label>
                <input required value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} className="w-full p-3 rounded-lg border border-outline-variant focus:border-primary outline-none" placeholder="John Miller" type="text" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-on-surface-variant block">Email Address</label>
                <input required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full p-3 rounded-lg border border-outline-variant focus:border-primary outline-none" placeholder="john@example.com" type="email" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-on-surface-variant block">Phone Number</label>
                <input required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full p-3 rounded-lg border border-outline-variant focus:border-primary outline-none" placeholder="+254 700 000000" type="tel" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-on-surface-variant block">Password</label>
                <input required minLength={6} value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full p-3 rounded-lg border border-outline-variant focus:border-primary outline-none" placeholder="••••••••" type="password" />
              </div>
            </div>

            {role === 'farmer' && (
              <div className="space-y-6 pt-4 animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="border-b border-outline-variant pb-2">
                  <h2 className="text-2xl font-bold text-on-surface">Farm Details</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-on-surface-variant block">Farm Name</label>
                    <input required value={formData.farmName} onChange={(e) => setFormData({...formData, farmName: e.target.value})} className="w-full p-3 rounded-lg border border-outline-variant focus:border-primary outline-none" placeholder="Green Valley Estates" type="text" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-on-surface-variant block">Location</label>
                    <input required value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="w-full p-3 rounded-lg border border-outline-variant focus:border-primary outline-none" placeholder="Nakuru, Kenya" type="text" />
                  </div>
                </div>
              </div>
            )}
          </div>

          <button disabled={loading} className="w-full bg-primary text-white py-4 rounded-lg font-bold text-lg hover:brightness-110 active:scale-[0.99] transition-all disabled:opacity-50" type="submit">
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
      </div>
    </>
  );
}