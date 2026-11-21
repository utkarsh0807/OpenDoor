'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Globe, Terminal, ArrowLeft, PlusCircle } from 'lucide-react';
import { INITIAL_OPPORTUNITIES } from '@/lib/data/initialOpportunities';
import { OpportunityCard } from '@/components/opportunities/OpportunityCard';
import { OpportunityDetailModal } from '@/components/opportunities/OpportunityDetailModal';
import { ApplicationModal } from '@/components/tracker/ApplicationModal';
import { EmptyState } from '@/components/common/EmptyState';
import { StorageManager } from '@/lib/storage';
import { Opportunity, StudentProfile } from '@/lib/types';

export default function OnlineHackathonsPage() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);
  const [trackingOpp, setTrackingOpp] = useState<Opportunity | null>(null);

  useEffect(() => {
    setProfile(StorageManager.getProfile());
    setSavedIds(StorageManager.getSavedOpportunityIds());
  }, []);

  const handleToggleSave = (id: string) => {
    StorageManager.toggleSaveOpportunity(id);
    setSavedIds(StorageManager.getSavedOpportunityIds());
  };

  const onlineHackathons = INITIAL_OPPORTUNITIES.filter(
    o => o.category === 'hackathon' && o.mode === 'online'
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/hackathons" className="text-xs text-purple-600 hover:text-purple-800 flex items-center gap-1 font-semibold">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to All Hackathons
            </Link>
          </div>
          <h1 className="text-2xl font-extrabold text-navy-900 flex items-center gap-2">
            <Globe className="w-6 h-6 text-blue-600" />
            100% Online Hackathons
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Virtual hackathons accessible to every college student in India. Zero travel, zero ticket booking, 100% remote evaluation.
          </p>
        </div>

        <Link
          href="/organizer"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-purple-600 text-white hover:bg-purple-700 rounded-xl text-xs font-semibold transition-colors shadow-sm self-start sm:self-auto"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          Submit Virtual Event
        </Link>
      </div>

      {/* Grid */}
      {onlineHackathons.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {onlineHackathons.map(opp => (
            <OpportunityCard
              key={opp.id}
              opportunity={opp}
              profile={profile}
              isSaved={savedIds.includes(opp.id)}
              onToggleSave={handleToggleSave}
              onOpenDetails={(o) => setSelectedOpp(o)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          type="custom"
          title="No online hackathons at this moment"
          description="Check out in-person hackathons or subscribe to new event notifications."
        />
      )}

      {/* Modals */}
      <OpportunityDetailModal
        opportunity={selectedOpp}
        profile={profile}
        isOpen={Boolean(selectedOpp)}
        onClose={() => setSelectedOpp(null)}
        onTrackApplication={(opp) => {
          setSelectedOpp(null);
          setTrackingOpp(opp);
        }}
      />

      <ApplicationModal
        opportunity={trackingOpp}
        isOpen={Boolean(trackingOpp)}
        onClose={() => setTrackingOpp(null)}
      />
    </div>
  );
}
