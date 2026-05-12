'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function MarketTrends() {
  const [dataPoints, setDataPoints] = useState([0, 0, 0, 0, 0, 0, 0]);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const fetchOrderTrends = async () => {
    const { data } = await supabase.from('orders').select('created_at');
    
    if (data) {
      // Create an array to hold the count of orders for each day of the week (0 = Sunday, 6 = Saturday)
      const weeklyData = [0, 0, 0, 0, 0, 0, 0];
      let maxOrders = 0;

      // Count the orders per day
      data.forEach(order => {
        const date = new Date(order.created_at);
        const dayOfWeek = date.getDay();
        weeklyData[dayOfWeek] += 1;
      });

      // Find the highest day so we can scale the chart percentages
      weeklyData.forEach(count => { if (count > maxOrders) maxOrders = count; });

      // Convert counts to percentages (heights for the CSS chart)
      // If there are no orders, default to an empty chart, otherwise scale them
      const scaledData = weeklyData.map(count => maxOrders === 0 ? 0 : Math.max(10, (count / maxOrders) * 100));
      
      setDataPoints(scaledData);
    }
  };

  useEffect(() => {
    fetchOrderTrends();

    // Listen for new orders to update the chart in real time!
    const channel = supabase.channel('chart-trend-sync')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, () => {
        fetchOrderTrends();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg border border-outline-variant elevation-1 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6 border-b border-outline-variant pb-4">
        <div>
          <h3 className="text-xl font-bold text-on-surface">Platform Demand Trends</h3>
          <p className="text-sm text-on-surface-variant">Daily order volume across AgroDirect</p>
        </div>
        <div className="bg-surface-container-low border border-outline-variant text-sm font-bold rounded-lg px-3 py-2 text-on-surface-variant">
          Live Data
        </div>
      </div>

      {/* Dynamic CSS-based Chart */}
      <div className="flex-1 flex items-end justify-between gap-2 pt-4 mt-auto min-h-[200px]">
        {dataPoints.map((val, i) => (
          <div key={i} className="w-full flex flex-col items-center gap-3 group">
            <div className="w-full bg-surface-container-high rounded-t-md relative h-48 flex items-end overflow-hidden border-b-2 border-outline-variant">
              <div 
                className="w-full bg-primary rounded-t-md transition-all duration-1000 ease-out group-hover:bg-primary-container relative"
                style={{ height: `${val}%` }}
              >
                {/* Tooltip that shows the raw percentage/relative height */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface text-xs font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  {val === 0 ? 'No Data' : 'High'}
                </div>
              </div>
            </div>
            <span className={`text-xs font-bold uppercase tracking-wider ${new Date().getDay() === i ? 'text-primary' : 'text-on-surface-variant'}`}>
              {days[i]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}