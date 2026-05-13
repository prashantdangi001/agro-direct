'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import VerificationTable, { FarmProfile } from './VerificationTable';
import VerificationStats from './VerificationStats';
import VerificationHeader from './VerificationHeader';

export default function AdminPendingVerifications() {
  const [farmers, setFarmers] = useState<FarmProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [verifiedSessionCount, setVerifiedSessionCount] = useState(0);

  const fetchPendingFarms = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('farm_profiles')
      .select('*')
      .eq('verification_status', 'Pending Review')
      .order('farm_name', { ascending: true });

    if (!error && data) {
      setFarmers(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPendingFarms();

    // Listen for new farmers signing up in real-time (Awesome for the Hackathon!)
    const channel = supabase.channel('admin-verifications')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'farm_profiles' }, () => {
        fetchPendingFarms();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const handleVerify = async (id: string, farmName: string) => {
    if (confirm(`Are you sure you want to officially verify ${farmName}? This will grant them the trusted badge on the marketplace.`)) {
      const { error } = await supabase
        .from('farm_profiles')
        .update({ verification_status: 'Verified' })
        .eq('id', id);

      if (!error) {
        // Optimistic UI update
        setFarmers(farmers.filter(farm => farm.id !== id));
        setVerifiedSessionCount(prev => prev + 1); // Update the stats counter instantly!
      } else {
        alert("Verification failed. Please try again.");
      }
    }
  };

  const handleReject = async (id: string) => {
    const reason = prompt("Enter rejection reason (this will be sent to the farmer):");
    if (reason) {
      const { error } = await supabase
        .from('farm_profiles')
        .update({ verification_status: 'Rejected' })
        .eq('id', id);

      if (!error) {
        setFarmers(farmers.filter(farm => farm.id !== id));
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <VerificationHeader count={farmers.length} />

      <VerificationStats 
        pending={farmers.length} 
        verifiedToday={verifiedSessionCount} 
      />

      <div className="pt-2">
        <VerificationTable 
          farmers={farmers} 
          onVerify={handleVerify} 
          onReject={handleReject} 
        />
      </div>
    </div>
  );
}