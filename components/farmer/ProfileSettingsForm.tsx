'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function ProfileSettingsForm() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Form & Image State
  const [profilePicPreview, setProfilePicPreview] = useState('https://lh3.googleusercontent.com/aida-public/AB6AXuD6dPgaJjE2DEckCIPPBSoJIhLB-dRYtSE6dSt_KmsP9YM4GranUC7B0cUqnzRWjsThRSsraY8GSxis64EWZdMFbox6yHIwskmIozTB1oZIDK4clkJNPZ99d_ZIthWKkIKY7aKfPNz_7TlAe45qdrzXV0s8i3Kvk67pDNqtPSKOhUH-uRNhHdN6-4x9oHn8P8cpyTDs53F_nNdXv2dTJqqXQB_9JZHxK5Pzwu1CyIsg_hT2fdtPVDMStjtR94-gHrhSMyzf0QGiG2Dz');
  const [coverPhotoPreview, setCoverPhotoPreview] = useState('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200&auto=format&fit=crop');
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [farmName, setFarmName] = useState('');
  const [location, setLocation] = useState('');
  const [about, setAbout] = useState('');
  const [practices, setPractices] = useState('');

  // 1. Fetch data on load
  useEffect(() => {
    async function loadProfile() {
      const { data, error } = await supabase.from('farm_profiles').select('*').eq('id', 'demo-farm').single();
      if (data) {
        setFarmName(data.farm_name || '');
        setLocation(data.location || '');
        setAbout(data.about || '');
        setPractices(data.practices || '');
        if (data.profile_pic_url) setProfilePicPreview(data.profile_pic_url);
        if (data.cover_photo_url) setCoverPhotoPreview(data.cover_photo_url);
      }
      setFetching(false);
    }
    loadProfile();
  }, []);

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileFile(e.target.files[0]);
      setProfilePicPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleCoverPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCoverFile(e.target.files[0]);
      setCoverPhotoPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  // 2. Save everything back to Supabase
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    let finalProfileUrl = profilePicPreview;
    let finalCoverUrl = coverPhotoPreview;

    // Helper function to upload images
    const uploadImage = async (file: File, prefix: string) => {
      const fileName = `${prefix}-${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
      const { error } = await supabase.storage.from('product-images').upload(fileName, file);
      if (!error) {
        return supabase.storage.from('product-images').getPublicUrl(fileName).data.publicUrl;
      }
      return null;
    };

    if (profileFile) {
      const url = await uploadImage(profileFile, 'profile');
      if (url) finalProfileUrl = url;
    }
    if (coverFile) {
      const url = await uploadImage(coverFile, 'cover');
      if (url) finalCoverUrl = url;
    }

    const { error } = await supabase
      .from('farm_profiles')
      .update({
        farm_name: farmName,
        location: location,
        about: about,
        practices: practices,
        profile_pic_url: finalProfileUrl,
        cover_photo_url: finalCoverUrl
      })
      .eq('id', 'demo-farm');

    if (!error) {
      setMessage({ text: 'Settings updated successfully!', type: 'success' });
    } else {
      setMessage({ text: 'Failed to update settings.', type: 'error' });
    }
    
    setLoading(false);
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  if (fetching) return <div className="p-10 text-center text-on-surface-variant font-bold">Loading your farm profile...</div>;

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
      {message.text && (
        <div className={`p-4 rounded-lg font-bold text-sm flex items-center gap-2 animate-in slide-in-from-top-2 ${message.type === 'success' ? 'bg-primary/10 text-primary' : 'bg-error/10 text-error'}`}>
          <span className="material-symbols-outlined">{message.type === 'success' ? 'check_circle' : 'error'}</span>
          {message.text}
        </div>
      )}

      {/* Farm Branding Section */}
      <section className="bg-white p-6 rounded-xl border border-outline-variant elevation-1">
        <h2 className="text-xl font-bold text-on-surface mb-6 border-b border-outline-variant pb-4">Farm Branding</h2>
        <div className="relative mb-10">
          <div className="h-48 rounded-xl bg-surface-container-high border border-outline-variant overflow-hidden relative group">
            <img src={coverPhotoPreview} alt="Cover" className="w-full h-full object-cover" />
            <div className="absolute top-4 right-4">
              <label className="cursor-pointer bg-white/90 backdrop-blur text-on-surface border border-outline-variant px-4 py-2 rounded-lg font-bold text-sm shadow-sm flex items-center gap-2 hover:bg-white transition-colors">
                <span className="material-symbols-outlined text-[18px]">image</span> Replace Cover
                <input type="file" className="hidden" onChange={handleCoverPhotoChange} accept="image/*" />
              </label>
            </div>
          </div>
          <div className="absolute -bottom-8 left-6 flex items-end gap-4">
            <div className="w-24 h-24 rounded-full border-4 border-white bg-surface-container overflow-hidden relative group elevation-1">
              <img src={profilePicPreview} alt="Profile" className="w-full h-full object-cover" />
              <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <span className="material-symbols-outlined text-white">edit</span>
                <input type="file" className="hidden" onChange={handleProfilePicChange} accept="image/*" />
              </label>
            </div>
            <label className="cursor-pointer bg-white text-on-surface border border-outline-variant px-4 py-2 rounded-lg font-bold text-sm shadow-sm flex items-center gap-2 hover:bg-surface-container-lowest transition-colors mb-2">
              <span className="material-symbols-outlined text-[18px]">photo_camera</span> Upload Logo
              <input type="file" className="hidden" onChange={handleProfilePicChange} accept="image/*" />
            </label>
          </div>
        </div>
      </section>

      {/* Public Profile Section */}
      <section className="bg-white p-6 rounded-xl border border-outline-variant elevation-1 mt-12">
        <h2 className="text-xl font-bold text-on-surface mb-6 border-b border-outline-variant pb-4">Public Farm Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-on-surface-variant">Farm Name</label>
            <input value={farmName} onChange={(e) => setFarmName(e.target.value)} className="w-full p-3 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-surface-container-lowest" type="text" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-on-surface-variant">Location</label>
            <input value={location} onChange={(e) => setLocation(e.target.value)} className="w-full p-3 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-surface-container-lowest" type="text" />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-bold text-on-surface-variant">About Farm</label>
            <textarea value={about} onChange={(e) => setAbout(e.target.value)} rows={4} className="w-full p-3 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-surface-container-lowest resize-none" />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-bold text-on-surface-variant">Farming Practices (Tags)</label>
            <input value={practices} onChange={(e) => setPractices(e.target.value)} placeholder="e.g. Organic, Non-GMO" className="w-full p-3 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-surface-container-lowest" type="text" />
          </div>
        </div>
      </section>

      <div className="flex justify-end pt-4 mb-10">
        <button disabled={loading} type="submit" className="bg-primary text-white px-10 py-3 rounded-lg font-bold shadow-sm hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2">
          {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : 'Save All Settings'}
        </button>
      </div>
    </form>
  );
}