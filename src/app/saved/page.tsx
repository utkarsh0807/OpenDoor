'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bookmark, Sparkles, Trash2, ArrowRight } from 'lucide-react';
import { INITIAL_OPPORTUNITIES } from '@/lib/data/initialOpportunities';
import { OpportunityCard } from '@/components/opportunities/OpportunityCard';
import { OpportunityDetailModal } from '@/components/opportunities/OpportunityDetailModal';
import { ApplicationModal } from '@/components/tracker/ApplicationModal';
import { EmptyState } from '@/components/common/EmptyState';
import { StorageManager } from '@/lib/storage';
import { Opportunity, StudentProfile } from '@/lib/types';
import { Button } from '@/components/ui/Button';

export default function SavedPage() {
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

  const savedOpportunities = INITIAL_OPPORTUNITIES.filter(o => savedIds.includes(o.id));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 uppercase tracking-wider mb-1">
            <Bookmark className="w-3.5 h-3.5" />
            Personal Bookmarks
          </div>
          <h1 className="text-2xl font-extrabold text-navy-900">
            Saved Opportunities ({savedOpportunities.length})
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Quickly revisit hackathons, scholarships, and fellowships you've bookmarked across sessions.
          </p>
        </div>

        {savedOpportunities.length > 0 && (
          <Link
            href="/applications"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-semibold hover:bg-purple-700 transition-colors shadow-sm"
          >
            Go to Application Tracker
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {/* Grid or Empty */}
      {savedOpportunities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedOpportunities.map(opp => (
            <OpportunityCard
              key={opp.id}
              opportunity={opp}
              profile={profile}
              isSaved={true}
              onToggleSave={handleToggleSave}
              onOpenDetails={(o) => setSelectedOpp(o)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          type="no_saved"
          onAction={() => {
            window.location.href = '/explore';
          }}
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
