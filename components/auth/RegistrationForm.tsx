'use client';
import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function RegistrationForm() {
  const router = useRouter();
  // Default to Buyer
  const [role, setRole] = useState<'farmer' | 'buyer' | 'admin'>('buyer');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // 🚀 UNIFIED FORM STATE (Includes Mobile and Address)
  const [formData, setFormData] = useState({
    fullName: '', 
    email: '', 
    phone: '', // This is the Mobile Number!
    password: '', 
    farmName: '', 
    location: '', 
    kissanId: '', 
    apaarId: '',
    deliveryAddress: ''
  });

  const [idDocument, setIdDocument] = useState<File | null>(null);
  const [idPreview, setIdPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIdDocument(e.target.files[0]);
      setIdPreview(URL.createObjectURL(e.target.files[0]));
      setErrorMsg(''); // Clear the error if they upload successfully
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    // 🚀 THE FIX: Manual validation so the browser doesn't freeze silently
    if (role === 'farmer' && !idDocument) {
      setErrorMsg("Please upload your Identity Document (Aadhar or KCC).");
      setLoading(false);
      return;
    }

    try {
      // 1. Create Auth User in Supabase (Saves the mobile number in Auth)
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            phone: formData.phone, // Mobile number saved here!
            role: role,
          }
        }
      });

      if (error) throw error;
      if (!data.user) throw new Error("Authentication failed.");

      // 2a. Save FARMER Contact Profile & Document
      if (role === 'farmer') {
        let docUrl = "";
        if (idDocument) {
          const fileExt = idDocument.name.split('.').pop();
          const fileName = `kyc-${data.user.id}-${Date.now()}.${fileExt}`;
          const { error: uploadError } = await supabase.storage.from('kyc-documents').upload(fileName, idDocument);
          if (!uploadError) {
            const { data: publicUrlData } = supabase.storage.from('kyc-documents').getPublicUrl(fileName);
            docUrl = publicUrlData.publicUrl;
          }
        }

        const { error: profileError } = await supabase.from('farm_profiles').upsert({
          id: data.user.id,
          farm_name: formData.farmName,
          location: formData.location,
          full_name: formData.fullName,
          contact_number: formData.phone, // Saved for WhatsApp Escrow Alerts!
          kissan_id: formData.kissanId,
          apaar_id: formData.apaarId,
          kyc_document_url: docUrl,
          verification_status: 'pending'
        });
        if (profileError) throw profileError;
      }

      // 2b. 🚀 Save BUYER Contact Profile
      if (role === 'buyer') {
        const { error: buyerError } = await supabase.from('buyer_profiles').upsert({
          id: data.user.id,
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone, // Buyer mobile number saved here!
          delivery_address: formData.deliveryAddress
        });
        if (buyerError) throw buyerError;
      }

      // 3. Routing
      if (role === 'farmer') router.push('/farmer');
      else if (role === 'admin') router.push('/admin');
      else router.push('/marketplace');

    } catch (err: any) {
      setErrorMsg(err.message || "Registration failed. Ensure your email isn't already used.");
      setLoading(false);
    }
  };

  return (
    <>
      {/* ROLE SELECTOR */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { id: 'buyer', icon: 'shopping_basket', label: 'Buyer', desc: 'Purchase fresh produce directly.' },
          { id: 'farmer', icon: 'agriculture', label: 'Farmer', desc: 'List harvest & reach buyers.' },
          { id: 'admin', icon: 'admin_panel_settings', label: 'Admin', desc: 'Manage the ecosystem.' }
        ].map((item) => (
          <div 
            key={item.id} 
            onClick={() => setRole(item.id as any)} 
            className={`group cursor-pointer p-6 rounded-3xl border-2 transition-all active:scale-[0.98] flex flex-col items-center text-center ${
              role === item.id ? 'bg-primary/5 border-primary shadow-lg shadow-primary/10' : 'bg-white border-outline-variant hover:border-primary/40'
            }`}
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-colors ${
              role === item.id ? 'bg-primary text-white' : 'bg-surface-container text-on-surface-variant group-hover:text-primary'
            }`}>
              <span className="material-symbols-outlined text-3xl">{item.icon}</span>
            </div>
            <h3 className="text-lg font-black text-on-surface">{item.label}</h3>
            <p className="text-[11px] font-bold text-on-surface-variant mt-1">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[40px] p-8 md:p-12 border border-outline-variant shadow-xl">
        {/* ERROR DISPLAY */}
        {errorMsg && (
          <div className="bg-error/10 border border-error/20 text-error p-4 rounded-2xl mb-8 text-sm font-bold flex items-center gap-3 animate-in fade-in">
            <span className="material-symbols-outlined">error</span> {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-10">
          
          {/* CORE CONTACT DETAILS (Always shown) */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-outline-variant/50 pb-3">
              <span className="material-symbols-outlined text-primary">person</span>
              <h2 className="text-xl font-black text-on-surface tracking-tight">Contact Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Full Name</label>
                <input required className="w-full p-4 rounded-2xl bg-surface-container-lowest border-2 border-outline-variant focus:border-primary outline-none transition-all font-bold" placeholder="E.g. Prashant Dangi" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Email Address</label>
                <input required type="email" className="w-full p-4 rounded-2xl bg-surface-container-lowest border-2 border-outline-variant focus:border-primary outline-none transition-all font-bold" placeholder="name@example.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              
              {/* 🚀 EXPLICIT MOBILE NUMBER FIELD 🚀 */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest text-primary">Mobile Number (WhatsApp)</label>
                <input required className="w-full p-4 rounded-2xl bg-surface-container-lowest border-2 border-primary/50 focus:border-primary outline-none transition-all font-bold" placeholder="91XXXXXXXXXX" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Create Password</label>
                <input required type="password" minLength={6} className="w-full p-4 rounded-2xl bg-surface-container-lowest border-2 border-outline-variant focus:border-primary outline-none transition-all font-bold" placeholder="••••••••" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
              </div>
            </div>
          </section>

          {/* BUYER SPECIFIC DETAILS */}
          {role === 'buyer' && (
            <section className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="flex items-center gap-3 border-b border-outline-variant/50 pb-3">
                <span className="material-symbols-outlined text-primary">local_shipping</span>
                <h2 className="text-xl font-black text-on-surface tracking-tight">Delivery Details</h2>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Full Shipping Address</label>
                <textarea required rows={3} className="w-full p-4 rounded-2xl bg-surface-container-lowest border-2 border-outline-variant focus:border-primary outline-none transition-all font-bold resize-none" placeholder="Enter your full home or business address..." value={formData.deliveryAddress} onChange={e => setFormData({...formData, deliveryAddress: e.target.value})} />
              </div>
            </section>
          )}

          {/* FARMER SPECIFIC DETAILS */}
          {role === 'farmer' && (
            <section className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="flex items-center gap-3 border-b border-outline-variant/50 pb-3">
                <span className="material-symbols-outlined text-primary">badge</span>
                <h2 className="text-xl font-black text-on-surface tracking-tight">Producer Verification</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input required placeholder="Farm Name" className="w-full p-4 rounded-2xl bg-surface-container-lowest border-2 border-outline-variant outline-none focus:border-primary transition-all font-bold" value={formData.farmName} onChange={e => setFormData({...formData, farmName: e.target.value})} />
                <input required placeholder="Farm Location (City/District)" className="w-full p-4 rounded-2xl bg-surface-container-lowest border-2 border-outline-variant outline-none focus:border-primary transition-all font-bold" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                <input required placeholder="Kissan Credit Card ID" className="w-full p-4 rounded-2xl bg-surface-container-lowest border-2 border-outline-variant outline-none focus:border-primary transition-all font-bold" value={formData.kissanId} onChange={e => setFormData({...formData, kissanId: e.target.value})} />
                <input placeholder="APAAR ID (Optional)" className="w-full p-4 rounded-2xl bg-surface-container-lowest border-2 border-outline-variant outline-none focus:border-primary transition-all font-bold" value={formData.apaarId} onChange={e => setFormData({...formData, apaarId: e.target.value})} />
              </div>
              
              <div className="space-y-3">
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Upload Identity Document</label>
                <div className={`relative h-48 w-full border-2 border-dashed rounded-[32px] flex flex-col items-center justify-center bg-surface-container-lowest hover:border-primary hover:bg-primary/5 transition-all group overflow-hidden cursor-pointer ${!idDocument && errorMsg ? 'border-error bg-error/5' : 'border-outline-variant'}`}>
                  {idPreview ? <img src={idPreview} className="w-full h-full object-cover" /> : (
                    <div className="text-center p-6">
                      <span className="material-symbols-outlined text-5xl text-primary/40 mb-3">cloud_upload</span>
                      <p className="text-sm font-black text-on-surface">Click to upload document</p>
                      <p className="text-[10px] font-bold text-on-surface-variant mt-1 uppercase tracking-widest">Aadhar or KCC Image</p>
                    </div>
                  )}
                  {/* NO 'required' attribute here to prevent silent crashing */}
                  <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} />
                </div>
              </div>
            </section>
          )}

          <button type="submit" disabled={loading} className="w-full bg-primary text-white py-5 rounded-3xl font-black text-lg hover:brightness-110 hover:-translate-y-1 active:scale-[0.98] transition-all shadow-2xl shadow-primary/30 disabled:opacity-50 flex items-center justify-center gap-3">
            {loading ? <span className="material-symbols-outlined animate-spin">sync</span> : <span className="material-symbols-outlined">how_to_reg</span>}
            {loading ? 'Processing...' : 'Create Account'}
          </button>
        </form>
      </div>
    </>
  );
}