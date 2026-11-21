'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Compass, Filter, Sparkles, MapPin, Globe } from 'lucide-react';
import { INITIAL_OPPORTUNITIES } from '@/lib/data/initialOpportunities';
import { OpportunityCard } from '@/components/opportunities/OpportunityCard';
import { OpportunityDetailModal } from '@/components/opportunities/OpportunityDetailModal';
import { ApplicationModal } from '@/components/tracker/ApplicationModal';
import { FilterBar } from '@/components/opportunities/FilterBar';
import { EmptyState } from '@/components/common/EmptyState';
import { StorageManager } from '@/lib/storage';
import { useRegion } from '@/lib/context/RegionContext';
import { filterOpportunitiesByRegion } from '@/lib/locationEngine';
import { Opportunity, StudentProfile, OpportunityCategory } from '@/lib/types';

function ExploreContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialStatus = searchParams.get('status') || 'all';

  const { region, regionLabel } = useRegion();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);
  const [trackingOpp, setTrackingOpp] = useState<Opportunity | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [modeFilter, setModeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [streamFilter, setStreamFilter] = useState('all');

  useEffect(() => {
    setProfile(StorageManager.getProfile());
    setSavedIds(StorageManager.getSavedOpportunityIds());
  }, []);

  const handleToggleSave = (id: string) => {
    StorageManager.toggleSaveOpportunity(id);
    setSavedIds(StorageManager.getSavedOpportunityIds());
  };

  // First apply regional filter
  const regionScoped = filterOpportunitiesByRegion(INITIAL_OPPORTUNITIES, region);

  const filteredOpportunities = regionScoped.filter(opp => {
    if (categoryFilter !== 'all' && opp.category !== categoryFilter) return false;
    if (modeFilter !== 'all' && opp.mode !== modeFilter) return false;
    if (statusFilter !== 'all' && opp.registrationStatus !== statusFilter) return false;
    if (streamFilter !== 'all' && opp.eligibility.eligibleStreams.length > 0) {
      if (!opp.eligibility.eligibleStreams.includes(streamFilter as any)) return false;
    }
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 uppercase tracking-wider mb-1">
            <Compass className="w-3.5 h-3.5" />
            Universal Opportunity Explorer
          </div>
          <h1 className="text-2xl font-extrabold text-navy-900">
            Explore All Opportunities
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Search, filter, and discover across hackathons, scholarships, internships, competitions, and bootcamps.
          </p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {[
          { id: 'all', label: 'All Opportunities' },
          { id: 'hackathon', label: 'Hackathons' },
          { id: 'scholarship', label: 'Scholarships' },
          { id: 'internship', label: 'Internships' },
          { id: 'competition', label: 'Competitions' },
          { id: 'workshop', label: 'Workshops' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setCategoryFilter(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
              categoryFilter === tab.id
                ? 'bg-purple-600 text-white shadow-sm shadow-purple-200'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
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
          setCategoryFilter('all');
          setModeFilter('all');
          setStatusFilter('all');
          setStreamFilter('all');
        }}
        totalCount={filteredOpportunities.length}
      />

      {/* Grid */}
      {filteredOpportunities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOpportunities.map(opp => (
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
          type="search_empty"
          onAction={() => {
            setSearchQuery('');
            setCategoryFilter('all');
            setModeFilter('all');
            setStatusFilter('all');
            setStreamFilter('all');
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

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Loading explorer...</div>}>
      <ExploreContent />
    </Suspense>
  );
}
