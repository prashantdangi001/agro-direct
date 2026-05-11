'use client';
import { useState } from 'react';

export default function PaymentMethodCard() {
  const [selected, setSelected] = useState('mpesa');

  const methods = [
    { id: 'card', name: 'Credit/Debit Card', icon: 'credit_card' },
    { id: 'mpesa', name: 'M-Pesa (Mobile Money)', icon: 'smartphone' },
    { id: 'bank', name: 'Bank Transfer', icon: 'account_balance' },
  ];

  return (
    <section className="bg-surface-container-lowest p-6 rounded-lg border border-outline-variant elevation-1">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">payments</span>
        Payment Method
      </h2>
      
      <div className="space-y-3">
        {methods.map((method) => {
          const isActive = selected === method.id;
          return (
            <label 
              key={method.id}
              className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-all ${
                isActive 
                  ? 'border-2 border-primary bg-primary-container/5' 
                  : 'border border-outline-variant hover:bg-surface-container-low'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className={`material-symbols-outlined ${isActive ? 'text-primary' : 'text-on-surface-variant'}`}>
                  {method.icon}
                </span>
                <span className={`font-semibold ${isActive ? 'text-primary' : 'text-on-surface'}`}>
                  {method.name}
                </span>
              </div>
              <input 
                type="radio" 
                name="payment" 
                value={method.id}
                checked={isActive}
                onChange={(e) => setSelected(e.target.value)}
                className={`w-5 h-5 ${isActive ? 'text-primary border-primary focus:ring-primary' : 'text-outline border-outline focus:ring-primary'}`}
              />
            </label>
          );
        })}
      </div>
    </section>
  );
}