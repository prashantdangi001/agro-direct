'use client';
import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function RegistrationForm() {
  const router = useRouter();
  const [role, setRole] = useState<'farmer' | 'buyer' | 'admin'>('farmer');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', password: '', farmName: '', location: '', kissanId: '', apaarId: ''
  });

  // KYC Document State
  const [idDocument, setIdDocument] = useState<File | null>(null);
  const [idPreview, setIdPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIdDocument(e.target.files[0]);
      setIdPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      // 1. Create Auth User
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            phone: formData.phone,
            role: role,
          }
        }
      });

      if (error) throw error;
      if (!data.user) throw new Error("Authentication failed.");

      // 2. Handle Farmer-Specific Data
      if (role === 'farmer') {
        let docUrl = "";
        
        // Upload Document to Storage
        if (idDocument) {
          const fileExt = idDocument.name.split('.').pop();
          const fileName = `kyc-${data.user.id}-${Date.now()}.${fileExt}`;
          const { error: uploadError } = await supabase.storage.from('kyc-documents').upload(fileName, idDocument);
          
          if (!uploadError) {
            const { data: publicUrlData } = supabase.storage.from('kyc-documents').getPublicUrl(fileName);
            docUrl = publicUrlData.publicUrl;
          }
        }

        // Insert into farm_profiles
        const { error: profileError } = await supabase.from('farm_profiles').upsert({
          id: data.user.id,
          farm_name: formData.farmName,
          location: formData.location,
          full_name: formData.fullName,
          contact_number: formData.phone,
          kissan_id: formData.kissanId,
          apaar_id: formData.apaarId,
          kyc_document_url: docUrl, // Sent to Admin
          verification_status: 'pending'
        });

        if (profileError) throw profileError;
      }

      // 3. Success Routing
      const targetPath = role === 'farmer' ? '/farmer' : role === 'admin' ? '/admin' : '/marketplace';
      router.push(targetPath);

    } catch (err: any) {
      setErrorMsg(err.message || "Registration failed.");
      setLoading(false);
    }
  };

  return (
    <>
      {/* Role Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { id: 'farmer', icon: 'agriculture', label: 'Farmer', desc: 'Manage inventory & reach buyers.' },
          { id: 'buyer', icon: 'shopping_basket', label: 'Buyer', desc: 'Source fresh produce at scale.' },
          { id: 'admin', icon: 'admin_panel_settings', label: 'Admin', desc: 'Manage verifications & ecosystem.' }
        ].map((item) => (
          <div 
            key={item.id} 
            onClick={() => setRole(item.id as any)} 
            className={`group cursor-pointer p-6 rounded-2xl border-2 transition-all active:scale-[0.98] flex flex-col items-center text-center ${
              role === item.id ? 'bg-primary/5 border-primary shadow-md' : 'bg-white border-outline-variant hover:border-primary/40'
            }`}
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-colors ${
              role === item.id ? 'bg-primary text-white' : 'bg-surface-container text-on-surface-variant group-hover:text-primary'
            }`}>
              <span className="material-symbols-outlined text-3xl">{item.icon}</span>
            </div>
            <h3 className="text-lg font-bold text-on-surface">{item.label}</h3>
            <p className="text-[11px] text-on-surface-variant mt-1">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl p-8 md:p-10 border border-outline-variant shadow-xl">
        {errorMsg && (
          <div className="bg-error/10 border border-error/20 text-error p-4 rounded-xl mb-8 text-sm font-bold flex items-center gap-3">
            <span className="material-symbols-outlined">error</span> {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-10">
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-outline-variant pb-3">
              <span className="material-symbols-outlined text-primary">person</span>
              <h2 className="text-xl font-bold text-on-surface">Account Details</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Full Name</label>
                <input required className="w-full p-3.5 rounded-xl bg-surface border-2 border-outline-variant focus:border-primary outline-none transition-all" placeholder="E.g. Prashant Dangi" onChange={e => setFormData({...formData, fullName: e.target.value})} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Email Address</label>
                <input required type="email" className="w-full p-3.5 rounded-xl bg-surface border-2 border-outline-variant focus:border-primary outline-none transition-all" placeholder="name@example.com" onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Phone Number</label>
                <input required className="w-full p-3.5 rounded-xl bg-surface border-2 border-outline-variant focus:border-primary outline-none transition-all" placeholder="91XXXXXXXXXX" onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Password</label>
                <input required type="password" minLength={6} className="w-full p-3.5 rounded-xl bg-surface border-2 border-outline-variant focus:border-primary outline-none transition-all" placeholder="••••••••" onChange={e => setFormData({...formData, password: e.target.value})} />
              </div>
            </div>
          </section>

          {role === 'farmer' && (
            <section className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="flex items-center gap-3 border-b border-outline-variant pb-3">
                <span className="material-symbols-outlined text-primary">badge</span>
                <h2 className="text-xl font-bold text-on-surface">Farmer Verification</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input required placeholder="Farm Name" className="w-full p-3.5 rounded-xl bg-surface border-2 border-outline-variant outline-none focus:border-primary transition-all" onChange={e => setFormData({...formData, farmName: e.target.value})} />
                <input required placeholder="Farm Location" className="w-full p-3.5 rounded-xl bg-surface border-2 border-outline-variant outline-none focus:border-primary transition-all" onChange={e => setFormData({...formData, location: e.target.value})} />
                <input required placeholder="Kissan Credit Card ID" className="w-full p-3.5 rounded-xl bg-surface border-2 border-outline-variant outline-none focus:border-primary transition-all" onChange={e => setFormData({...formData, kissanId: e.target.value})} />
                <input placeholder="APAAR ID (Optional)" className="w-full p-3.5 rounded-xl bg-surface border-2 border-outline-variant outline-none focus:border-primary transition-all" onChange={e => setFormData({...formData, apaarId: e.target.value})} />
              </div>
              
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Upload Identity Document (Aadhar/KCC)</label>
                <div className="relative h-44 w-full md:w-96 border-2 border-dashed border-outline-variant rounded-2xl flex flex-col items-center justify-center bg-surface-container-lowest hover:bg-primary/5 transition-all group overflow-hidden cursor-pointer">
                  {idPreview ? <img src={idPreview} className="w-full h-full object-cover" /> : (
                    <div className="text-center p-6">
                      <span className="material-symbols-outlined text-4xl text-primary/40 mb-2">upload_file</span>
                      <p className="text-xs font-bold text-on-surface-variant">Click to upload scan</p>
                    </div>
                  )}
                  <input type="file" required accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} />
                </div>
              </div>
            </section>
          )}

          <button disabled={loading} className="w-full bg-primary text-white py-4 rounded-2xl font-black text-lg hover:brightness-110 hover:-translate-y-0.5 active:scale-[0.98] transition-all shadow-xl shadow-primary/20 disabled:opacity-50">
            {loading ? 'Setting up your ecosystem...' : 'Complete Registration'}
          </button>
        </form>
      </div>
    </>
  );
}