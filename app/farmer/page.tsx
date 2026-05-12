'use client';
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import FarmerNavbar from "@/components/layout/FarmerNavbar";
import FarmerSidebar from "@/components/layout/FarmerSidebar";
import DashboardStats from "@/components/farmer/DashboardStats";
import MarketTrends from "@/components/farmer/MarketTrends";
import MarketTicker from "@/components/farmer/MarketTicker";
import LogisticsBanner from "@/components/farmer/LogisticsBanner";
import Link from "next/link";

export default function FarmerDashboard() {
  const [farmName, setFarmName] = useState("Loading...");

  useEffect(() => {
    async function fetchGreeting() {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) return;

      const { data } = await supabase
        .from('farm_profiles')
        .select('farm_name')
        .eq('id', authData.user.id)
        .single();
        
      if (data && data.farm_name) {
        setFarmName(data.farm_name);
      } else {
        setFarmName("New Farmer");
      }
    }
    fetchGreeting();

    // THE FIX: Listen to real-time changes so the name updates instantly!
    const channel = supabase.channel('dashboard-greeting-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'farm_profiles' }, () => {
        fetchGreeting();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <FarmerNavbar />
      
      <div className="flex flex-1 max-w-[1280px] mx-auto w-full relative">
        <FarmerSidebar />

        <main className="flex-1 p-6 md:p-10 lg:ml-64 animate-in fade-in duration-300">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-on-surface mb-2 tracking-tight">Dashboard Overview</h1>
              <p className="text-on-surface-variant">Welcome back, <span className="font-bold text-primary">{farmName}</span>. Here is your daily summary.</p>
            </div>
            <Link 
              href="/farmer/add-listing"
              className="bg-primary text-white px-6 py-3 rounded-lg font-bold shadow-sm hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined">add</span>
              New Listing
            </Link>
          </div>

          <DashboardStats />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-full">
              <MarketTrends />
            </div>
            <div className="flex flex-col h-[350px]">
              <MarketTicker />
            </div>
          </div>

          <LogisticsBanner />
        </main>
      </div>
    </div>
  );
}