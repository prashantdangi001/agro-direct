'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // THE SESSION GUARD
  useEffect(() => {
    const checkExistingSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const userRole = session.user.user_metadata?.role;
        if (userRole === 'admin') router.push('/admin');
        else if (userRole === 'farmer') router.push('/farmer');
        else router.push('/marketplace');
      }
    };
    checkExistingSession();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (!data.user) throw new Error("No user data returned.");

      const userRole = data.user.user_metadata?.role;

      setTimeout(() => {
        if (userRole === 'admin') router.push('/admin');
        else if (userRole === 'farmer') router.push('/farmer');
        else router.push('/marketplace');
      }, 500);

    } catch (error: any) {
      setErrorMsg(error.message || "Invalid login credentials.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      
      {/* LEFT COLUMN: THE FORM */}
      <div className="w-full lg:w-1/2 flex flex-col relative">
        
        {/* BACK TRACK OPTION */}
        <div className="absolute top-8 left-8 md:left-12">
          <Link href="/" className="flex items-center gap-2 text-sm font-bold text-on-surface-variant hover:text-primary transition-colors group px-4 py-2 bg-surface-container-low rounded-full border border-outline-variant shadow-sm hover:shadow-md">
            <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-1 transition-transform">arrow_back</span>
            Back to Home
          </Link>
        </div>

        {/* FORM CONTAINER */}
        <div className="flex-1 flex items-center justify-center p-8 md:p-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="w-full max-w-[420px]">
            
            <div className="mb-10">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6 border border-primary/20 shadow-sm">
                <span className="material-symbols-outlined text-4xl">eco</span>
              </div>
              <h1 className="text-4xl font-bold text-on-surface mb-3 tracking-tight">Welcome Back.</h1>
              <p className="text-on-surface-variant text-base">Sign in to manage your Khetify ecosystem.</p>
            </div>

            {errorMsg && (
              <div className="bg-error/10 border border-error/20 text-error text-sm font-bold p-4 rounded-xl mb-6 flex items-start gap-3 animate-in shake">
                <span className="material-symbols-outlined text-[20px] mt-0.5">error</span>
                <p>{errorMsg}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-1.5">
                <label className="block text-sm font-bold text-on-surface">Email Address</label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant material-symbols-outlined text-[20px] group-focus-within:text-primary transition-colors">mail</span>
                  <input 
                    required type="email" value={email} onChange={(e) => setEmail(e.target.value)} 
                    className="w-full py-3.5 pl-12 pr-4 rounded-xl bg-surface border-2 border-outline-variant outline-none focus:border-primary focus:bg-white transition-all text-on-surface shadow-sm" 
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-bold text-on-surface">Password</label>
                  <Link href="#" className="text-xs text-primary font-bold hover:underline">Forgot password?</Link>
                </div>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant material-symbols-outlined text-[20px] group-focus-within:text-primary transition-colors">lock</span>
                  <input 
                    required type="password" value={password} onChange={(e) => setPassword(e.target.value)} 
                    className="w-full py-3.5 pl-12 pr-4 rounded-xl bg-surface border-2 border-outline-variant outline-none focus:border-primary focus:bg-white transition-all text-on-surface shadow-sm" 
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button disabled={loading} type="submit" className="w-full py-4 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1 transition-all mt-4 disabled:opacity-70 disabled:hover:translate-y-0 flex items-center justify-center gap-2 text-lg group">
                {loading ? (
                  <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Authenticating...</>
                ) : (
                  <>Sign In <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">arrow_forward</span></>
                )}
              </button>
            </form>

            <p className="text-center text-sm text-on-surface-variant mt-10">
              Don't have an account? <Link href="/register" className="text-primary font-bold hover:underline ml-1">Create one now</Link>
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: THE VISUAL BANNER (Hidden on Mobile) */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden bg-surface-container-high">
        {/* The Image */}
        <img 
          src="https://images.unsplash.com/photo-1592982537447-6f2a6a0a0c64?q=80&w=1600&auto=format&fit=crop" 
          alt="Lush green farm" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        {/* Gradient Overlay to make text readable */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

        {/* Floating Trust Badge & Text */}
        <div className="absolute bottom-12 left-12 right-12 text-white animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-full border border-white/30 mb-4 shadow-xl">
            <span className="material-symbols-outlined text-[#10b981] text-[18px]">verified</span>
            <span className="text-xs font-bold tracking-wider uppercase">Viksit Bharat 2047 Initiative</span>
          </div>
          <h2 className="text-4xl font-bold mb-4 leading-tight">Empowering Rural India,<br/>One Harvest at a Time.</h2>
          <p className="text-lg text-white/80 max-w-md">
            Join the decentralized network connecting local farmers directly to households with zero middleman commissions.
          </p>

          {/* Testimonial Avatar cluster */}
          <div className="flex items-center gap-4 mt-8 pt-8 border-t border-white/20">
            <div className="flex -space-x-3">
              <img className="w-10 h-10 rounded-full border-2 border-[#111827] object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop" alt="User" />
              <img className="w-10 h-10 rounded-full border-2 border-[#111827] object-cover" src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop" alt="User" />
              <img className="w-10 h-10 rounded-full border-2 border-[#111827] object-cover" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop" alt="User" />
            </div>
            <p className="text-sm font-medium text-white/90">Trusted by <span className="font-bold text-white">50+</span> local cooperatives.</p>
          </div>
        </div>
      </div>

    </div>
  );
}