'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function MarketTicker() {
  const [prices, setPrices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPrices = async () => {
    const { data } = await supabase.from('market_prices').select('*').order('id', { ascending: true });
    if (data) setPrices(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPrices();

    // The Magic: Listen for market fluctuations in real-time!
    const channel = supabase.channel('market-ticker-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'market_prices' }, () => {
        fetchPrices();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  if (loading) return <div className="p-6 animate-pulse bg-surface-container-low rounded-lg h-64"></div>;

  return (
    <div className="bg-surface-container-lowest p-6 rounded-lg border border-outline-variant elevation-1 flex-1 flex flex-col h-full">
      <div className="flex justify-between items-center mb-4 border-b border-outline-variant pb-2">
        <h3 className="text-lg font-bold text-on-surface">Market Commodity Prices</h3>
        <span className="flex items-center gap-1 text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/10 px-2 py-1 rounded">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span> Live
        </span>
      </div>
      
      <div className="space-y-3 overflow-y-auto pr-2 flex-1 hide-scrollbar">
        {prices.map((item) => (
          <div key={item.id} className="flex justify-between items-center p-3 bg-surface-container-low hover:bg-surface-container rounded-lg transition-colors cursor-default border border-transparent hover:border-outline-variant">
            <span className="font-bold text-on-surface text-sm">{item.crop}</span>
            <div className="text-right">
              <span className="block text-sm font-bold text-on-surface-variant">{item.price}</span>
              <span className={`text-[11px] font-bold flex items-center justify-end gap-0.5 ${item.is_up ? 'text-primary' : 'text-error'}`}>
                <span className="material-symbols-outlined text-[14px]">{item.is_up ? 'trending_up' : 'trending_down'}</span>
                {item.trend}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}