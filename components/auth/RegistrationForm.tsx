'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function RegistrationForm() {
  const [role, setRole] = useState<'farmer' | 'buyer'>('farmer');

  return (
    <>
      {/* Role Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Farmer Card */}
        <div
          onClick={() => setRole('farmer')}
          className={`group cursor-pointer p-6 rounded-xl transition-all active:scale-[0.98] flex flex-col items-center text-center ${
            role === 'farmer'
              ? 'bg-surface-container-low border-2 border-primary shadow-sm'
              : 'bg-white border border-outline-variant shadow-sm hover:border-primary/50'
          }`}
        >
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors ${
            role === 'farmer' ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container text-on-surface-variant group-hover:text-primary'
          }`}>
            <span className="material-symbols-outlined text-4xl">agriculture</span>
          </div>
          <h3 className="text-2xl font-bold mb-2 text-on-surface">Farmer</h3>
          <p className="text-base text-on-surface-variant">List your produce, manage inventory, and reach local wholesale buyers directly from your farm.</p>
        </div>

        {/* Buyer Card */}
        <div
          onClick={() => setRole('buyer')}
          className={`group cursor-pointer p-6 rounded-xl transition-all active:scale-[0.98] flex flex-col items-center text-center ${
            role === 'buyer'
              ? 'bg-surface-container-low border-2 border-primary shadow-sm'
              : 'bg-white border border-outline-variant shadow-sm hover:border-primary/50'
          }`}
        >
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors ${
            role === 'buyer' ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container text-on-surface-variant group-hover:text-primary'
          }`}>
            <span className="material-symbols-outlined text-4xl">shopping_basket</span>
          </div>
          <h3 className="text-2xl font-bold mb-2 text-on-surface">Buyer</h3>
          <p className="text-base text-on-surface-variant">Source fresh local produce at scale. Access high-quality regional crops with transparent logistics.</p>
        </div>
      </div>

      {/* Registration Form Container */}
      <div className="bg-white rounded-xl p-8 border border-outline-variant shadow-sm elevation-1">
        <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
          {/* Progress Bar */}
          <div className="flex items-center gap-4 mb-6">
            <div className="h-2 flex-grow bg-primary rounded-full"></div>
            <div className="h-2 flex-grow bg-surface-container rounded-full"></div>
            <span className="text-sm font-bold text-primary tracking-wider">STEP 1 OF 2</span>
          </div>

          <div className="space-y-6">
            <div className="border-b border-outline-variant pb-2">
              <h2 className="text-2xl font-bold text-on-surface">Personal Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-on-surface-variant block">Full Name</label>
                {/* 8px radius and 2px emerald green border on focus per DESIGN.md */}
                <input className="w-full p-3 rounded-lg border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="e.g. John Miller" type="text" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-on-surface-variant block">Email Address</label>
                <input className="w-full p-3 rounded-lg border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="john@example.com" type="email" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-on-surface-variant block">Phone Number</label>
                <input className="w-full p-3 rounded-lg border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="+1 (555) 000-0000" type="tel" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-on-surface-variant block">Password</label>
                <input className="w-full p-3 rounded-lg border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="••••••••" type="password" required />
              </div>
            </div>

            {/* Farmers Specific Section (Only renders if Farmer is selected) */}
            {role === 'farmer' && (
              <div className="space-y-6 pt-4 animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="border-b border-outline-variant pb-2">
                  <h2 className="text-2xl font-bold text-on-surface">
                    Farm Details <span className="text-sm text-on-surface-variant font-medium">(Farmer Only)</span>
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-on-surface-variant block">Farm Name</label>
                    <input className="w-full p-3 rounded-lg border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="Green Valley Estates" type="text" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-on-surface-variant block">Location</label>
                    <div className="relative">
                      <input className="w-full p-3 pr-10 rounded-lg border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="City, State" type="text" required />
                      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant">location_on</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="pt-6 space-y-4">
            <button className="w-full bg-primary text-white py-4 rounded-lg font-bold text-lg hover:brightness-110 active:scale-[0.99] transition-all shadow-sm" type="submit">
              Create Account
            </button>
            <p className="text-center text-base text-on-surface-variant font-medium">
              Already have an account? <Link href="/login" className="text-primary font-bold hover:underline">Log in here</Link>
            </p>
          </div>
        </form>
      </div>
    </>
  );
}