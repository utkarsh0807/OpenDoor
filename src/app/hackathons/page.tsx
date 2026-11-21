'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Terminal, Globe, Filter, MapPin, Calendar, Clock, PlusCircle } from 'lucide-react';
import { INITIAL_OPPORTUNITIES } from '@/lib/data/initialOpportunities';
import { OpportunityCard } from '@/components/opportunities/OpportunityCard';
import { OpportunityDetailModal } from '@/components/opportunities/OpportunityDetailModal';
import { ApplicationModal } from '@/components/tracker/ApplicationModal';
import { FilterBar } from '@/components/opportunities/FilterBar';
import { EmptyState } from '@/components/common/EmptyState';
import { StorageManager } from '@/lib/storage';
import { useRegion } from '@/lib/context/RegionContext';
import { filterOpportunitiesByRegion } from '@/lib/locationEngine';
import { Opportunity, StudentProfile } from '@/lib/types';
import { Button } from '@/components/ui/Button';

export default function HackathonsPage() {
  const { region, regionLabel } = useRegion();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);
  const [trackingOpp, setTrackingOpp] = useState<Opportunity | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [modeFilter, setModeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [streamFilter, setStreamFilter] = useState('all');

  useEffect(() => {
    setProfile(StorageManager.getProfile());
    setSavedIds(StorageManager.getSavedOpportunityIds());
  }, []);

  const handleToggleSave = (id: string) => {
    StorageManager.toggleSaveOpportunity(id);
    setSavedIds(StorageManager.getSavedOpportunityIds());
  };

  // Filter logic specifically for hackathons in current region
  const allHackathons = filterOpportunitiesByRegion(
    INITIAL_OPPORTUNITIES.filter(o => o.category === 'hackathon'),
    region
  );

  const filteredHackathons = allHackathons.filter(opp => {
    // Mode filter
    if (modeFilter !== 'all' && opp.mode !== modeFilter) return false;
    // Status filter
    if (statusFilter !== 'all' && opp.registrationStatus !== statusFilter) return false;
    // Stream filter
    if (streamFilter !== 'all' && opp.eligibility.eligibleStreams.length > 0) {
      if (!opp.eligibility.eligibleStreams.includes(streamFilter as any)) return false;
    }
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = opp.title.toLowerCase().includes(q) ||
        opp.description.toLowerCase().includes(q) ||
        opp.organizer.organizationName.toLowerCase().includes(q) ||
        opp.eligibility.requiredSkills?.some(s => s.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 uppercase tracking-wider mb-1">
            <Terminal className="w-3.5 h-3.5" />
            Hackathons & Coding Sprints
          </div>
          <h1 className="text-2xl font-extrabold text-navy-900">
            College & National Hackathons
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Discover online, offline, and hybrid hackathons across India. Registration status and event timelines are strictly verified.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/hackathons/online"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-xs font-semibold transition-colors"
          >
            <Globe className="w-3.5 h-3.5" />
            Online Only Hackathons
          </Link>
          <Link
            href="/organizer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-purple-600 text-white hover:bg-purple-700 rounded-xl text-xs font-semibold transition-colors shadow-sm"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Submit Hackathon
          </Link>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedMode={modeFilter}
        onModeChange={setModeFilter}
        selectedStatus={statusFilter}
        onStatusChange={setStatusFilter}
        selectedStream={streamFilter}
        onStreamChange={setStreamFilter}
        onResetFilters={() => {
          setSearchQuery('');
          setModeFilter('all');
          setStatusFilter('all');
          setStreamFilter('all');
        }}
        totalCount={filteredHackathons.length}
      />

      {/* Hackathons Grid */}
      {filteredHackathons.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHackathons.map(opp => (
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
          type="no_hackathons"
          onAction={() => {
            setModeFilter('online');
            setSearchQuery('');
          }}
          onSecondaryAction={() => {
            setModeFilter('all');
            setStatusFilter('all');
            setStreamFilter('all');
            setSearchQuery('');
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
