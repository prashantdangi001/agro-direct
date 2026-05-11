'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl md:text-4xl font-bold text-on-surface tracking-tight">Welcome back</h2>
        <p className="text-base text-on-surface-variant">Access your dashboard and manage your marketplace listings.</p>
      </div>

      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        {/* Email Field */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-on-surface-variant uppercase tracking-wider" htmlFor="email">
            Email Address
          </label>
          <input 
            id="email"
            type="email" 
            placeholder="farmer@agrodirect.com" 
            className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all duration-200"
            required
          />
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-on-surface-variant uppercase tracking-wider" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <input 
              id="password"
              type={showPassword ? "text" : "password"} 
              placeholder="••••••••" 
              className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all duration-200"
              required
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">
                {showPassword ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          </div>
        </div>

        {/* Helper Actions */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input 
              type="checkbox" 
              className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary cursor-pointer transition-colors"
            />
            <span className="text-sm font-bold text-on-surface-variant group-hover:text-on-surface transition-colors">Remember Me</span>
          </label>
          <a href="#" className="text-sm font-bold text-primary hover:underline transition-all">
            Forgot Password?
          </a>
        </div>

        {/* Primary Action */}
        <button 
          type="submit" 
          className="w-full bg-primary text-white py-4 rounded-lg text-lg font-bold shadow-sm hover:brightness-110 active:scale-[0.98] transition-all duration-200"
        >
          Sign In
        </button>
      </form>

      {/* Divider */}
      <div className="relative flex items-center py-4">
        <div className="flex-grow border-t border-outline-variant"></div>
        <span className="flex-shrink mx-4 text-xs font-bold text-outline uppercase tracking-widest">Or continue with</span>
        <div className="flex-grow border-t border-outline-variant"></div>
      </div>

      {/* Social Logins */}
      <div className="grid grid-cols-2 gap-4">
        <button className="flex items-center justify-center gap-3 py-3 px-4 rounded-lg border border-outline-variant bg-white hover:bg-surface-container-low active:scale-95 transition-all duration-200 shadow-sm elevation-1">
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
          <span className="text-sm font-bold text-on-surface">Google</span>
        </button>
        <button className="flex items-center justify-center gap-3 py-3 px-4 rounded-lg border border-outline-variant bg-white hover:bg-surface-container-low active:scale-95 transition-all duration-200 shadow-sm elevation-1">
          <span className="material-symbols-outlined text-on-surface" style={{ fontVariationSettings: "'FILL' 1" }}>apple</span>
          <span className="text-sm font-bold text-on-surface">Apple</span>
        </button>
      </div>

      {/* Registration Link */}
      <p className="text-center text-base text-on-surface-variant pt-4 font-medium">
        New to AgroDirect?{' '}
        <Link href="/register" className="text-primary font-bold hover:underline transition-all">
          Join the marketplace
        </Link>
      </p>
    </div>
  );
}