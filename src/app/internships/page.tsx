'use client';

import React, { useState, useEffect } from 'react';
import { Briefcase, DollarSign, Filter, Globe, MapPin, CheckCircle } from 'lucide-react';
import { INITIAL_OPPORTUNITIES } from '@/lib/data/initialOpportunities';
import { OpportunityCard } from '@/components/opportunities/OpportunityCard';
import { OpportunityDetailModal } from '@/components/opportunities/OpportunityDetailModal';
import { ApplicationModal } from '@/components/tracker/ApplicationModal';
import { EmptyState } from '@/components/common/EmptyState';
import { StorageManager } from '@/lib/storage';
import { Opportunity, StudentProfile } from '@/lib/types';

export default function InternshipsPage() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);
  const [trackingOpp, setTrackingOpp] = useState<Opportunity | null>(null);

  // Filters
  const [paidFilter, setPaidFilter] = useState<'all' | 'paid_only' | 'unpaid'>('all');
  const [modeFilter, setModeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setProfile(StorageManager.getProfile());
    setSavedIds(StorageManager.getSavedOpportunityIds());
  }, []);

  const handleToggleSave = (id: string) => {
    StorageManager.toggleSaveOpportunity(id);
    setSavedIds(StorageManager.getSavedOpportunityIds());
  };

  const internships = INITIAL_OPPORTUNITIES.filter(o => o.category === 'internship');

  const filteredInternships = internships.filter(opp => {
    if (paidFilter === 'paid_only' && !opp.isPaidInternship) return false;
    if (paidFilter === 'unpaid' && opp.isPaidInternship) return false;
    if (modeFilter !== 'all' && opp.mode !== modeFilter) return false;

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
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
            <Briefcase className="w-3.5 h-3.5" />
            Research & Industry Fellowships
          </div>
          <h1 className="text-2xl font-extrabold text-navy-900">
            Student Internships & Trainee Tracks
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Opportunities at premier national research labs (ISRO, DRDO) and global open source mentorships (GSoC). Paid vs Unpaid status strictly verified against original notifications.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm space-y-3 text-xs">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex-1 w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by role, skills (Python, IoT, C++), or organization..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={paidFilter}
              onChange={(e) => setPaidFilter(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-800"
            >
              <option value="all">All Compensation Types</option>
              <option value="paid_only">Verified Paid Stipend</option>
              <option value="unpaid">Educational / Research Trainee</option>
            </select>

            <select
              value={modeFilter}
              onChange={(e) => setModeFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-800"
            >
              <option value="all">All Modes</option>
              <option value="online">Online / Remote</option>
              <option value="offline">In-Person (On-Site)</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid */}
      {filteredInternships.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInternships.map(opp => (
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
          title="No internships matching filters"
          description="Try selecting 'All Compensation Types' or reset search filters."
          onAction={() => {
            setPaidFilter('all');
            setModeFilter('all');
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
