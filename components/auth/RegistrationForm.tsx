'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegistrationForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<'buyer' | 'farmer' | 'admin'>('buyer');
  const [errorMsg, setErrorMsg] = useState('');
  
  // UNIFIED STATE
  const [formData, setFormData] = useState({
    fullName: '', 
    email: '', 
    phone: '', // WhatsApp Mobile
    password: '', 
    kissanId: '', 
    aadharId: '', 
    farmName: '', 
    location: '', 
    deliveryAddress: '', 
    adminSecret: ''
  });
  
  const [aadhaarFile, setAadhaarFile] = useState<File | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    
    // Security check for Admin
    if (role === 'admin' && formData.adminSecret !== 'BGI2026') {
      return setErrorMsg("SECURITY ERROR: Invalid Admin Access Code.");
    }

    // THE FIX: Manual validation for invisible file input
    if (role === 'farmer' && !aadhaarFile) {
      return setErrorMsg("Please upload your Identity Document (Aadhar or KCC).");
    }

    setLoading(true);

    try {
      // 1. Create Auth User
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email, 
        password: formData.password,
        options: { 
          data: { 
            role: role, 
            full_name: formData.fullName, 
            phone: formData.phone 
          } 
        }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Registration failed.");

      // 2a. Save FARMER Profile
      if (role === 'farmer') {
        let kycUrl = '';
        if (aadhaarFile) {
          const fileName = `kyc-${authData.user.id}-${Date.now()}.${aadhaarFile.name.split('.').pop()}`;
          const { error: uploadError } = await supabase.storage.from('kyc-documents').upload(fileName, aadhaarFile);
          if (!uploadError) {
            kycUrl = supabase.storage.from('kyc-documents').getPublicUrl(fileName).data.publicUrl;
          }
        }

        const { error: dbError } = await supabase.from('farm_profiles').upsert({
          id: authData.user.id, 
          full_name: formData.fullName, 
          farm_name: formData.farmName, 
          contact_number: formData.phone, 
          location: formData.location, 
          kissan_id: formData.kissanId, 
          apaar_id: formData.aadharId, 
          kyc_document_url: kycUrl, 
          verification_status: 'pending'
        });
        if (dbError) throw dbError;
      }

      // 2b. Save BUYER Profile
      if (role === 'buyer') {
        const { error: buyerError } = await supabase.from('buyer_profiles').upsert({
          id: authData.user.id,
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          delivery_address: formData.deliveryAddress
        });
        if (buyerError) throw buyerError;
      }

      // 3. Routing
      if (role === 'farmer') router.push('/farmer');
      else if (role === 'admin') router.push('/admin');
      else router.push('/marketplace');

    } catch (error: any) { 
      setErrorMsg(`Error: ${error.message}`); 
      setLoading(false); 
    } 
  };

  return (
    <div className="flex min-h-screen bg-white font-sans">
      
      {/* LEFT COLUMN: THE FORM */}
      <div className="w-full lg:w-1/2 flex flex-col relative min-h-screen py-12 px-8 md:px-16 lg:px-24 justify-center">
        
        {/* BACK TRACK OPTION */}
        <div className="absolute top-8 left-8 md:left-12">
          <Link href="/" className="flex items-center gap-2 text-sm font-bold text-on-surface-variant hover:text-primary transition-colors group px-4 py-2 bg-surface-container-low rounded-full border border-outline-variant shadow-sm hover:shadow-md">
            <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-1 transition-transform">arrow_back</span>
            Back to Home
          </Link>
        </div>

        <div className="w-full max-w-[480px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 mt-12">
          
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-on-surface mb-3 tracking-tight">Join Khetify.</h1>
            <p className="text-on-surface-variant text-base">Create your account to enter the zero-commission ecosystem.</p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-xl flex items-center gap-3 text-error font-bold text-sm">
              <span className="material-symbols-outlined">error</span> {errorMsg}
            </div>
          )}

          {/* 3-Way Role Selector */}
          <div className="flex gap-2 p-1.5 bg-surface-container-low rounded-xl mb-8 border border-outline-variant shadow-inner">
            <button onClick={() => setRole('buyer')} type="button" className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${role === 'buyer' ? 'bg-primary shadow-md text-white scale-[1.02]' : 'text-on-surface-variant hover:text-on-surface hover:bg-black/5'}`}>
              <span className="material-symbols-outlined text-[18px]">shopping_basket</span> Buyer
            </button>
            <button onClick={() => setRole('farmer')} type="button" className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${role === 'farmer' ? 'bg-[#D97706] shadow-md text-white scale-[1.02]' : 'text-on-surface-variant hover:text-on-surface hover:bg-black/5'}`}>
              <span className="material-symbols-outlined text-[18px]">agriculture</span> Farmer
            </button>
            <button onClick={() => setRole('admin')} type="button" className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${role === 'admin' ? 'bg-[#111827] shadow-md text-white scale-[1.02]' : 'text-on-surface-variant hover:text-on-surface hover:bg-black/5'}`}>
               <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span> Admin
            </button>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            
            {/* CORE DETAILS */}
            <div className="space-y-1.5">
              <label className="block text-sm font-bold text-on-surface">Full Name</label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant material-symbols-outlined text-[20px] group-focus-within:text-primary transition-colors">person</span>
                <input required type="text" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} className="w-full py-3.5 pl-12 pr-4 rounded-xl bg-surface border-2 border-outline-variant outline-none focus:border-primary focus:bg-white transition-all text-on-surface shadow-sm" placeholder="John Doe" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-bold text-on-surface">Email Address</label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant material-symbols-outlined text-[20px] group-focus-within:text-primary transition-colors">mail</span>
                <input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full py-3.5 pl-12 pr-4 rounded-xl bg-surface border-2 border-outline-variant outline-none focus:border-primary focus:bg-white transition-all text-on-surface shadow-sm" placeholder="you@example.com" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-bold text-on-surface text-primary">Mobile Number (WhatsApp)</label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant material-symbols-outlined text-[20px] group-focus-within:text-primary transition-colors">phone_iphone</span>
                <input required type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full py-3.5 pl-12 pr-4 rounded-xl bg-surface border-2 border-primary/50 outline-none focus:border-primary focus:bg-white transition-all text-on-surface shadow-sm" placeholder="91XXXXXXXXXX" />
              </div>
            </div>
            
            <div className="space-y-1.5">
              <label className="block text-sm font-bold text-on-surface">Password</label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant material-symbols-outlined text-[20px] group-focus-within:text-primary transition-colors">lock</span>
                <input required type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full py-3.5 pl-12 pr-4 rounded-xl bg-surface border-2 border-outline-variant outline-none focus:border-primary focus:bg-white transition-all text-on-surface shadow-sm" placeholder="••••••••" />
              </div>
            </div>

            {/* BUYER DETAILS */}
            {role === 'buyer' && (
              <div className="border-t-2 border-outline-variant/50 pt-6 mt-8 space-y-5 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-on-surface">Delivery Address</label>
                  <div className="relative group">
                    <span className="absolute left-4 top-4 text-on-surface-variant material-symbols-outlined text-[20px] group-focus-within:text-primary transition-colors">local_shipping</span>
                    <textarea required rows={3} value={formData.deliveryAddress} onChange={(e) => setFormData({...formData, deliveryAddress: e.target.value})} className="w-full py-3.5 pl-12 pr-4 rounded-xl bg-surface border-2 border-outline-variant outline-none focus:border-primary focus:bg-white transition-all text-on-surface shadow-sm resize-none" placeholder="Enter your full home or business address..." />
                  </div>
                </div>
              </div>
            )}

            {/* FARMER DETAILS */}
            {role === 'farmer' && (
              <div className="border-t-2 border-outline-variant/50 pt-6 mt-8 space-y-5 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#D97706]/10 rounded-xl flex items-center justify-center text-[#D97706]"><span className="material-symbols-outlined text-[20px]">storefront</span></div>
                  <div>
                    <h3 className="font-bold text-on-surface text-lg leading-tight">Farm & KYC Details</h3>
                    <p className="text-xs text-on-surface-variant">Required for verified seller status.</p>
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-on-surface-variant">Farm Name</label>
                  <div className="relative group">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant material-symbols-outlined text-[16px] group-focus-within:text-[#D97706] transition-colors">agriculture</span>
                    <input required type="text" value={formData.farmName} onChange={(e) => setFormData({...formData, farmName: e.target.value})} className="w-full py-3 pl-9 pr-3 rounded-xl bg-surface border-2 border-outline-variant outline-none focus:border-[#D97706] focus:bg-white transition-all shadow-sm text-sm" placeholder="Green Valley" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-on-surface-variant">Village / District Location</label>
                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant material-symbols-outlined text-[18px] group-focus-within:text-[#D97706] transition-colors">location_on</span>
                    <input required type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="w-full py-3 pl-11 pr-4 rounded-xl bg-surface border-2 border-outline-variant outline-none focus:border-[#D97706] focus:bg-white transition-all shadow-sm text-sm" placeholder="Sehore, Madhya Pradesh" />
                  </div>
                </div>

                <div className="bg-[#fe932c]/5 border-2 border-[#fe932c]/20 rounded-2xl p-6 space-y-5 mt-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#904d00]">Kissan ID Number</label>
                    <div className="relative group">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#904d00]/60 material-symbols-outlined text-[16px]">badge</span>
                      <input required type="text" value={formData.kissanId} onChange={(e) => setFormData({...formData, kissanId: e.target.value})} className="w-full py-3 pl-9 pr-3 rounded-xl border-2 border-[#fe932c]/30 outline-none focus:border-[#904d00] bg-white text-sm shadow-sm" placeholder="MP-12345" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#904d00]">AADHAR NO.</label>
                    <div className="relative group">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#904d00]/60 material-symbols-outlined text-[16px]">pin</span>
                      <input required type="text" value={formData.aadharId} onChange={(e) => setFormData({...formData, aadharId: e.target.value})} className="w-full py-3 pl-9 pr-3 rounded-xl border-2 border-[#fe932c]/30 outline-none focus:border-[#904d00] bg-white text-sm shadow-sm" placeholder="12-digit AADHAR" />
                    </div>
                  </div>
                  <div className="space-y-1.5 pt-2">
                    <label className="block text-xs font-bold text-[#904d00] mb-2">Upload Identity Scan</label>
                    {/* NO REQUIRED TAG HERE to fix silent fail */}
                    <input type="file" accept="image/*" onChange={(e) => setAadhaarFile(e.target.files?.[0] || null)} className="w-full text-sm file:mr-4 file:py-2 file:px-6 file:rounded-full file:border-0 file:font-bold file:bg-[#904d00] file:text-white hover:file:brightness-110 hover:file:-translate-y-0.5 file:transition-all file:shadow-md cursor-pointer text-[#904d00]" />
                  </div>
                </div>
              </div>
            )}

            {/* ADMIN SECRET KEY */}
            {role === 'admin' && (
              <div className="border-t-2 border-outline-variant/50 pt-6 mt-8 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-xl flex items-center justify-center text-gray-700"><span className="material-symbols-outlined text-[20px]">admin_panel_settings</span></div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-sm leading-tight">Admin Authorization</h3>
                      <p className="text-xs text-gray-500">System clearance required.</p>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-700">Access Passkey</label>
                    <div className="relative group">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined text-[16px] group-focus-within:text-gray-800 transition-colors">key</span>
                      <input required type="password" value={formData.adminSecret} onChange={(e) => setFormData({...formData, adminSecret: e.target.value})} className="w-full py-3 pl-9 pr-3 rounded-xl border-2 border-gray-300 outline-none focus:border-gray-800 bg-white text-sm shadow-sm transition-all" placeholder="Enter secure code..." />
                    </div>
                    <p className="text-[10px] text-gray-500 font-medium mt-1 ml-1">Hint: BGI2026</p>
                  </div>
                </div>
              </div>
            )}

            <button disabled={loading} type="submit" className={`w-full py-4 text-white rounded-xl font-bold shadow-lg hover:-translate-y-1 transition-all mt-8 disabled:opacity-70 disabled:hover:translate-y-0 flex items-center justify-center gap-2 text-lg group ${role === 'admin' ? 'bg-[#111827] shadow-[#111827]/30 hover:shadow-[#111827]/50' : role === 'farmer' ? 'bg-[#D97706] shadow-[#D97706]/30 hover:shadow-[#D97706]/50' : 'bg-primary shadow-primary/30 hover:shadow-primary/50'}`}>
              {loading ? (
                <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Processing...</>
              ) : (
                <>Create Account <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">arrow_forward</span></>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-on-surface-variant mt-10 font-medium">
            Already have an account? <Link href="/login" className="text-primary font-bold hover:underline ml-1">Sign in here</Link>
          </p>
        </div>
      </div>

      {/* RIGHT COLUMN: THE VISUAL BANNER */}
      <div className="hidden lg:block lg:w-1/2 fixed right-0 top-0 bottom-0 bg-surface-container-high">
        <img 
          src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=1600&auto=format&fit=crop" 
          alt="Golden wheat field at sunset" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>

        <div className="absolute bottom-12 left-12 right-12 text-white animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#D97706]/80 backdrop-blur-md rounded-full border border-white/20 mb-4 shadow-xl">
            <span className="material-symbols-outlined text-white text-[18px]">workspace_premium</span>
            <span className="text-xs font-bold tracking-wider uppercase text-white">Zero Commission Guarantee</span>
          </div>
          <h2 className="text-4xl font-bold mb-4 leading-tight">Scale your farm.<br/>Direct to consumer.</h2>
          <p className="text-lg text-white/80 max-w-md">
            Join thousands of modern agriculturists utilizing Khetify's isolated storefronts and real-time escrow infrastructure.
          </p>

          <div className="grid grid-cols-2 gap-6 mt-8 pt-8 border-t border-white/20">
            <div>
              <p className="text-3xl font-bold text-white mb-1">100%</p>
              <p className="text-xs font-medium text-white/70 uppercase tracking-wider">Payment Isolation</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white mb-1">Real-time</p>
              <p className="text-xs font-medium text-white/70 uppercase tracking-wider">Market Analytics</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}