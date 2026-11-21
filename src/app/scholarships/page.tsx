'use client';

import React, { useState, useEffect } from 'react';
import { Award, Sparkles, Filter, ShieldCheck, DollarSign, ExternalLink, HelpCircle } from 'lucide-react';
import { INITIAL_OPPORTUNITIES } from '@/lib/data/initialOpportunities';
import { OpportunityCard } from '@/components/opportunities/OpportunityCard';
import { OpportunityDetailModal } from '@/components/opportunities/OpportunityDetailModal';
import { ApplicationModal } from '@/components/tracker/ApplicationModal';
import { EmptyState } from '@/components/common/EmptyState';
import { StorageManager } from '@/lib/storage';
import { Opportunity, StudentProfile } from '@/lib/types';

export default function ScholarshipsPage() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);
  const [trackingOpp, setTrackingOpp] = useState<Opportunity | null>(null);

  // Filters
  const [subType, setSubType] = useState<'all' | 'central' | 'state' | 'private'>('all');
  const [incomeLimit, setIncomeLimit] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setProfile(StorageManager.getProfile());
    setSavedIds(StorageManager.getSavedOpportunityIds());
  }, []);

  const handleToggleSave = (id: string) => {
    StorageManager.toggleSaveOpportunity(id);
    setSavedIds(StorageManager.getSavedOpportunityIds());
  };

  const scholarships = INITIAL_OPPORTUNITIES.filter(o => o.category === 'scholarship');

  const filteredScholarships = scholarships.filter(opp => {
    if (subType === 'central' && !opp.organizer.organizationName.includes('Government of India')) return false;
    if (subType === 'state' && !opp.state) return false;
    if (subType === 'private' && (opp.organizer.organizationName.includes('Gov') || opp.organizer.organizationName.includes('Ministry'))) return false;

    if (incomeLimit !== 'all') {
      const limit = parseInt(incomeLimit, 10);
      if (opp.eligibility.maxFamilyIncomeInr && opp.eligibility.maxFamilyIncomeInr < limit) return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = opp.title.toLowerCase().includes(q) ||
        opp.description.toLowerCase().includes(q) ||
        opp.organizer.organizationName.toLowerCase().includes(q) ||
        opp.eligibility.eligibleStreams.some(s => s.toLowerCase().includes(q));
      if (!match) return false;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
            <Award className="w-3.5 h-3.5" />
            Financial Aid & Merit Grants
          </div>
          <h1 className="text-2xl font-extrabold text-navy-900">
            Government & Private Scholarships
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Central Sector schemes (NSP), State DTE/DHE fee waivers (MahaDBT), and verified corporate merit fellowships.
          </p>
        </div>

        <div className="bg-emerald-50 text-emerald-800 text-xs px-3.5 py-2 rounded-xl border border-emerald-200 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Gemini AI Eligibility Explainer Available</span>
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
              placeholder="Search by scholarship title, scheme name, or ministry..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={subType}
              onChange={(e) => setSubType(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-800"
            >
              <option value="all">All Authorities</option>
              <option value="central">Central Govt (NSP)</option>
              <option value="state">State Government</option>
              <option value="private">Private / Trust Foundations</option>
            </select>

            <select
              value={incomeLimit}
              onChange={(e) => setIncomeLimit(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-800"
            >
              <option value="all">Any Family Income</option>
              <option value="250000">≤ ₹2.5 Lakhs / yr</option>
              <option value="450000">≤ ₹4.5 Lakhs / yr</option>
              <option value="800000">≤ ₹8.0 Lakhs / yr</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid */}
      {filteredScholarships.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredScholarships.map(opp => (
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
          type="no_scholarships"
          onAction={() => {
            setSubType('all');
            setIncomeLimit('all');
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
