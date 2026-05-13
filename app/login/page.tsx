'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  
  // Login States
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // ✨ FORGOT PASSWORD STATES ✨
  const [isResetMode, setIsResetMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

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

  // LOGIN HANDLER
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

  // ✨ PASSWORD RESET HANDLER ✨
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg("Please enter your email address first.");
      return;
    }
    
    setResetLoading(true);
    setErrorMsg('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`, // Where they go after clicking the email link
      });
      
      if (error) throw error;
      
      // Show success UI
      setResetSent(true);
    } catch (error: any) {
      setErrorMsg(error.message || "Failed to send reset link.");
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans overflow-hidden">
      
      {/* LEFT COLUMN: THE FORM */}
      <div className="w-full lg:w-1/2 flex flex-col relative">
        
        {/* BACK TRACK OPTION */}
        <div className="absolute top-8 left-8 md:left-12 z-10">
          <Link href="/" className="flex items-center gap-2 text-sm font-bold text-on-surface-variant hover:text-primary transition-colors group px-4 py-2 bg-surface-container-low rounded-full border border-outline-variant shadow-sm hover:shadow-md">
            <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-1 transition-transform">arrow_back</span>
            Back to Home
          </Link>
        </div>

        {/* FORM CONTAINER */}
        <div className="flex-1 flex items-center justify-center p-8 md:p-12">
          <div className="w-full max-w-[420px]">
            
            {errorMsg && (
              <div className="bg-error/10 border border-error/20 text-error text-sm font-bold p-4 rounded-xl mb-6 flex items-start gap-3 animate-in shake">
                <span className="material-symbols-outlined text-[20px] mt-0.5">error</span>
                <p>{errorMsg}</p>
              </div>
            )}

            {/* ========================================= */}
            {/* STATE 1: STANDARD LOGIN FORM              */}
            {/* ========================================= */}
            {!isResetMode && (
              <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                <div className="mb-10">
                  <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6 border border-primary/20 shadow-sm">
                    <span className="material-symbols-outlined text-4xl">eco</span>
                  </div>
                  <h1 className="text-4xl font-bold text-on-surface mb-3 tracking-tight">Welcome Back.</h1>
                  <p className="text-on-surface-variant text-base">Sign in to manage your Khetify ecosystem.</p>
                </div>

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
                      {/* THE TOGGLE BUTTON */}
                      <button 
                        type="button" 
                        onClick={() => { setIsResetMode(true); setErrorMsg(''); }} 
                        className="text-xs text-primary font-bold hover:underline cursor-pointer"
                      >
                        Forgot password?
                      </button>
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
            )}

            {/* ========================================= */}
            {/* STATE 2: RECOVERY FORM                    */}
            {/* ========================================= */}
            {isResetMode && !resetSent && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="mb-10">
                  <div className="w-16 h-16 bg-[#D97706]/10 text-[#D97706] rounded-2xl flex items-center justify-center mb-6 border border-[#D97706]/20 shadow-sm">
                    <span className="material-symbols-outlined text-4xl">key</span>
                  </div>
                  <h1 className="text-4xl font-bold text-on-surface mb-3 tracking-tight">Recover Account.</h1>
                  <p className="text-on-surface-variant text-base">Enter your email and we'll send you a secure link to reset your password.</p>
                </div>

                <form onSubmit={handleResetPassword} className="space-y-6">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-bold text-on-surface">Registered Email Address</label>
                    <div className="relative group">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant material-symbols-outlined text-[20px] group-focus-within:text-[#D97706] transition-colors">mail</span>
                      <input 
                        required type="email" value={email} onChange={(e) => setEmail(e.target.value)} 
                        className="w-full py-3.5 pl-12 pr-4 rounded-xl bg-surface border-2 border-outline-variant outline-none focus:border-[#D97706] focus:bg-white transition-all text-on-surface shadow-sm" 
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 pt-2">
                    <button disabled={resetLoading} type="submit" className="w-full py-4 bg-[#D97706] text-white rounded-xl font-bold shadow-lg shadow-[#D97706]/30 hover:shadow-[#D97706]/50 hover:-translate-y-1 transition-all disabled:opacity-70 disabled:hover:translate-y-0 flex items-center justify-center gap-2 text-lg group">
                      {resetLoading ? (
                        <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Sending...</>
                      ) : (
                        <>Send Recovery Link <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">send</span></>
                      )}
                    </button>
                    
                    <button 
                      type="button" 
                      onClick={() => { setIsResetMode(false); setErrorMsg(''); }} 
                      className="w-full py-3 text-on-surface-variant font-bold hover:bg-surface-container-low rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                      <span className="material-symbols-outlined text-[16px]">arrow_back</span> Cancel & Return to Login
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ========================================= */}
            {/* STATE 3: SUCCESS CONFIRMATION             */}
            {/* ========================================= */}
            {isResetMode && resetSent && (
              <div className="animate-in fade-in zoom-in-95 duration-500 text-center py-8">
                <div className="w-24 h-24 bg-[#059669]/10 text-[#059669] rounded-full flex items-center justify-center mb-6 mx-auto border-4 border-[#059669]/20 shadow-[0_0_40px_rgba(5,150,105,0.2)]">
                  <span className="material-symbols-outlined text-5xl">mark_email_read</span>
                </div>
                <h1 className="text-3xl font-bold text-on-surface mb-4 tracking-tight">Check Your Inbox!</h1>
                <p className="text-on-surface-variant text-base mb-8 px-4">
                  We've sent a secure recovery link to <span className="font-bold text-on-surface">{email}</span>. Click the link in the email to set a new password.
                </p>
                
                <button 
                  onClick={() => { setIsResetMode(false); setResetSent(false); setPassword(''); }} 
                  className="px-8 py-3 bg-surface-container-low border border-outline-variant text-on-surface font-bold rounded-xl hover:bg-surface hover:border-primary hover:text-primary transition-all shadow-sm"
                >
                  Return to Login
                </button>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: THE VISUAL BANNER (Hidden on Mobile) */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden bg-surface-container-high">
        <img 
          src="https://images.unsplash.com/photo-1592982537447-6f2a6a0a0c64?q=80&w=1600&auto=format&fit=crop" 
          alt="Lush green farm" 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10"></div>

        <div className="absolute bottom-12 left-12 right-12 text-white animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-4 shadow-xl">
            <span className="material-symbols-outlined text-[#10b981] text-[18px]">verified</span>
            <span className="text-xs font-bold tracking-wider uppercase text-white/90">Viksit Bharat 2047 Initiative</span>
          </div>
          <h2 className="text-4xl font-bold mb-4 leading-tight">Empowering Rural India,<br/>One Harvest at a Time.</h2>
          <p className="text-lg text-white/80 max-w-md">
            Join the decentralized network connecting local farmers directly to households with zero middleman commissions.
          </p>
        </div>
      </div>

    </div>
  );
}