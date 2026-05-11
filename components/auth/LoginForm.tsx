'use client';
import Link from 'next/link';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
    } else {
      // Check the user's role from metadata to route them correctly
      const role = data.user.user_metadata?.role;
      if (role === 'farmer') {
        router.push('/farmer');
      } else {
        router.push('/marketplace');
      }
    }
  };

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl md:text-4xl font-bold text-on-surface tracking-tight">Welcome back</h2>
        <p className="text-base text-on-surface-variant">Access your dashboard and manage your marketplace listings.</p>
      </div>

      {errorMsg && (
        <div className="bg-error/10 border border-error text-error p-4 rounded-lg text-sm font-bold flex items-center gap-2">
          <span className="material-symbols-outlined">error</span>
          {errorMsg}
        </div>
      )}

      <form className="space-y-6" onSubmit={handleLogin}>
        <div className="space-y-2">
          <label className="block text-sm font-bold text-on-surface-variant uppercase tracking-wider">Email Address</label>
          <input 
            type="email" 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="farmer@agrodirect.com" 
            className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest focus:ring-2 focus:ring-primary focus:border-primary outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-on-surface-variant uppercase tracking-wider">Password</label>
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"} 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary">
              <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
            </button>
          </div>
        </div>

        <button disabled={loading} type="submit" className="w-full bg-primary text-white py-4 rounded-lg text-lg font-bold shadow-sm hover:brightness-110 active:scale-[0.98] disabled:opacity-50">
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      <p className="text-center text-base text-on-surface-variant pt-4 font-medium">
        New to AgroDirect?{' '}
        <Link href="/register" className="text-primary font-bold hover:underline">Join the marketplace</Link>
      </p>
    </div>
  );
}