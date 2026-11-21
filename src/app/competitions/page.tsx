'use client';

import React, { useState, useEffect } from 'react';
import { Trophy, Filter, Globe, MapPin, Sparkles } from 'lucide-react';
import { INITIAL_OPPORTUNITIES } from '@/lib/data/initialOpportunities';
import { OpportunityCard } from '@/components/opportunities/OpportunityCard';
import { OpportunityDetailModal } from '@/components/opportunities/OpportunityDetailModal';
import { ApplicationModal } from '@/components/tracker/ApplicationModal';
import { EmptyState } from '@/components/common/EmptyState';
import { StorageManager } from '@/lib/storage';
import { Opportunity, StudentProfile } from '@/lib/types';

export default function CompetitionsPage() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);
  const [trackingOpp, setTrackingOpp] = useState<Opportunity | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setProfile(StorageManager.getProfile());
    setSavedIds(StorageManager.getSavedOpportunityIds());
  }, []);

  const handleToggleSave = (id: string) => {
    StorageManager.toggleSaveOpportunity(id);
    setSavedIds(StorageManager.getSavedOpportunityIds());
  };

  const competitions = INITIAL_OPPORTUNITIES.filter(o => o.category === 'competition');

  const filtered = competitions.filter(opp => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return opp.title.toLowerCase().includes(q) ||
        opp.description.toLowerCase().includes(q) ||
        opp.organizer.organizationName.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">
            <Trophy className="w-3.5 h-3.5" />
            Competitive Excellence
          </div>
          <h1 className="text-2xl font-extrabold text-navy-900">
            Student Competitions, Quizzes & Challenges
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            National business quizzes, innovation challenges, and algorithmic contests with verified cash awards and industry PPIs.
          </p>
        </div>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(opp => (
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
          title="No competitions found"
          description="Try broadening your search or submit a competition announcement."
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
