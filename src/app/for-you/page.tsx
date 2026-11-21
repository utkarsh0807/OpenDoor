'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, User, Settings, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';
import { INITIAL_OPPORTUNITIES } from '@/lib/data/initialOpportunities';
import { OpportunityCard } from '@/components/opportunities/OpportunityCard';
import { OpportunityDetailModal } from '@/components/opportunities/OpportunityDetailModal';
import { ApplicationModal } from '@/components/tracker/ApplicationModal';
import { calculateOpportunityMatch } from '@/lib/matchingEngine';
import { StorageManager } from '@/lib/storage';
import { Opportunity, StudentProfile } from '@/lib/types';
import { Button } from '@/components/ui/Button';

export default function ForYouPage() {
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

  // Run deterministic matching engine across all opportunities
  const matchedOpportunities = INITIAL_OPPORTUNITIES.map(opp => ({
    opportunity: opp,
    match: calculateOpportunityMatch(opp, profile)
  })).sort((a, b) => b.match.matchScore - a.match.matchScore);

  const strongMatches = matchedOpportunities.filter(m => m.match.matchStrength === 'strong');
  const potentialMatches = matchedOpportunities.filter(m => m.match.matchStrength === 'potential');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            Deterministic Student Match Intelligence
          </div>
          <h1 className="text-2xl font-extrabold text-navy-900">
            For You — Tailored Recommendations
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Scored objectively based on your course, academic stream, skills, location, and eligibility criteria.
          </p>
        </div>

        <Link
          href="/profile"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:border-purple-300 hover:text-purple-700 transition-colors shadow-sm"
        >
          <Settings className="w-3.5 h-3.5" />
          Update Student Profile
        </Link>
      </div>

      {/* Guest or Incomplete Profile Prompt */}
      {!profile && (
        <div className="bg-purple-50/70 border border-purple-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-purple-900">
                You are currently browsing with a Guest Student profile
              </h4>
              <p className="text-xs text-purple-700 mt-0.5">
                Set your stream, course, graduation year, and skills in your Profile to unlock high-accuracy match percentages!
              </p>
            </div>
          </div>
          <Link
            href="/profile"
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-semibold hover:bg-purple-700 transition-colors shrink-0 shadow-sm"
          >
            Set Up Profile
          </Link>
        </div>
      )}

      {/* Strong Matches */}
      {strongMatches.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <h2 className="text-base font-bold text-navy-900">
              High Eligibility Matches ({strongMatches.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {strongMatches.map(({ opportunity, match }) => (
              <OpportunityCard
                key={opportunity.id}
                opportunity={opportunity}
                profile={profile}
                isSaved={savedIds.includes(opportunity.id)}
                onToggleSave={handleToggleSave}
                onOpenDetails={(o) => setSelectedOpp(o)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Potential Matches */}
      <section className="space-y-4 pt-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <h2 className="text-base font-bold text-navy-900">
            Potential Opportunities to Explore ({potentialMatches.length})
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {potentialMatches.map(({ opportunity, match }) => (
            <OpportunityCard
              key={opportunity.id}
              opportunity={opportunity}
              profile={profile}
              isSaved={savedIds.includes(opportunity.id)}
              onToggleSave={handleToggleSave}
              onOpenDetails={(o) => setSelectedOpp(o)}
            />
          ))}
        </div>
      </section>

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
