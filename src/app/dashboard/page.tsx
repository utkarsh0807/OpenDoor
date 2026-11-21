'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Sparkles, Terminal, Award, Briefcase, Calendar, 
  MapPin, Globe, Clock, ArrowRight, ShieldCheck, 
  Bookmark, CheckSquare, Compass, Search, AlertCircle 
} from 'lucide-react';
import { INITIAL_OPPORTUNITIES } from '@/lib/data/initialOpportunities';
import { Opportunity, StudentProfile, ApplicationRecord } from '@/lib/types';
import { OpportunityCard } from '@/components/opportunities/OpportunityCard';
import { OpportunityDetailModal } from '@/components/opportunities/OpportunityDetailModal';
import { ApplicationModal } from '@/components/tracker/ApplicationModal';
import { StorageManager } from '@/lib/storage';
import { useRegion } from '@/lib/context/RegionContext';
import { filterOpportunitiesByRegion } from '@/lib/locationEngine';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export default function DashboardPage() {
  const { region, regionLabel } = useRegion();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);
  const [trackingOpp, setTrackingOpp] = useState<Opportunity | null>(null);

  useEffect(() => {
    setProfile(StorageManager.getProfile());
    setSavedIds(StorageManager.getSavedOpportunityIds());
    setApplications(StorageManager.getApplications());
  }, []);

  const handleToggleSave = (id: string) => {
    StorageManager.toggleSaveOpportunity(id);
    setSavedIds(StorageManager.getSavedOpportunityIds());
  };

  // Dynamically filter opportunities according to selected region
  const regionalOpportunities = filterOpportunitiesByRegion(INITIAL_OPPORTUNITIES, region);

  // Filtered Category Slices
  const regionalHackathons = regionalOpportunities.filter(o => o.category === 'hackathon');
  const onlineHackathons = regionalOpportunities.filter(o => o.category === 'hackathon' && o.mode === 'online');
  const scholarships = regionalOpportunities.filter(o => o.category === 'scholarship');
  const internships = regionalOpportunities.filter(o => o.category === 'internship');
  const closingSoonOpps = regionalOpportunities.filter(o => o.registrationStatus === 'closing_soon');

  // Specific local / nearby offline & hybrid events
  const isCitySpecific = region.scope === 'my_region' && Boolean(region.city);
  const localOrNearbyEvents = isCitySpecific 
    ? regionalOpportunities.filter(o => o.mode !== 'online' && (
        (o.eventCity && o.eventCity.toLowerCase() === region.city?.toLowerCase()) ||
        (o.city && o.city.toLowerCase() === region.city?.toLowerCase())
      ))
    : [];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-medium mb-3">
            <Sparkles className="w-3.5 h-3.5 text-purple-300" />
            <span>Personalized Student Discovery Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            Welcome back, {profile?.displayName || 'Student Scholar'}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-purple-100 leading-relaxed mb-6">
            Discover verified opportunities tailored to your academic background, region, and deadlines.
            Currently exploring opportunities with scope: <span className="bg-white/20 px-2 py-0.5 rounded font-bold">{regionLabel}</span>.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/for-you"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-purple-800 rounded-xl text-xs font-bold hover:bg-purple-50 transition-colors shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              Tailored Matches ("For You")
            </Link>
            <Link
              href="/hackathons/online"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-medium backdrop-blur-md transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-blue-300" />
              Online Hackathons ({INITIAL_OPPORTUNITIES.filter(o => o.category === 'hackathon' && o.mode === 'online').length})
            </Link>
            <Link
              href="/calendar"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-medium backdrop-blur-md transition-colors"
            >
              <Calendar className="w-3.5 h-3.5 text-amber-300" />
              Deadlines Calendar
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Metrics Bar (Reactive to Selected Region) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-black text-navy-900 block leading-none">
              {regionalHackathons.length}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              Hackathons in {region.scope === 'all_india' ? 'India' : region.city || region.state || 'Region'}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-black text-navy-900 block leading-none">
              {scholarships.length}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">Eligible Scholarships</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Bookmark className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-black text-navy-900 block leading-none">
              {savedIds.length}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">Saved Items</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <CheckSquare className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-black text-navy-900 block leading-none">
              {applications.length}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">Applications Tracked</span>
          </div>
        </div>
      </div>

      {/* Local & Nearby Events Section (Highlights City Events when City Selected) */}
      {isCitySpecific && (
        <section className="space-y-4 bg-purple-50/40 p-5 rounded-3xl border border-purple-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-purple-600" />
              <div>
                <h2 className="text-base font-bold text-navy-900">
                  Local In-Person Events in {region.city}
                </h2>
                <p className="text-xs text-slate-500">
                  Physical and hybrid events verified on campus in your selected city.
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-purple-700 bg-purple-100 px-2.5 py-1 rounded-full">
              {localOrNearbyEvents.length} Local Event{localOrNearbyEvents.length === 1 ? '' : 's'}
            </span>
          </div>

          {localOrNearbyEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {localOrNearbyEvents.map(opp => (
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
            <div className="p-4 bg-white rounded-2xl border border-purple-100 text-xs text-slate-600 flex items-center justify-between">
              <span>No offline events currently registered in {region.city}. Showing online hackathons and national open opportunities below!</span>
              <Link href="/hackathons/online" className="text-purple-600 font-semibold hover:underline">
                Explore Online Hackathons →
              </Link>
            </div>
          )}
        </section>
      )}

      {/* Urgent Registrations Closing Soon */}
      {closingSoonOpps.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-rose-600" />
              <h2 className="text-base font-bold text-navy-900">
                Registration Deadlines Closing Soon ({regionLabel})
              </h2>
            </div>
            <Link href="/explore?status=closing_soon" className="text-xs font-semibold text-purple-600 hover:text-purple-800">
              View All Urgent Deadlines →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {closingSoonOpps.map(opp => (
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
        </section>
      )}

      {/* Online Hackathons (Virtual, Accessible to all regardless of region) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-600" />
            <h2 className="text-base font-bold text-navy-900">
              Online Hackathons (100% Remote Participation)
            </h2>
          </div>
          <Link href="/hackathons/online" className="text-xs font-semibold text-purple-600 hover:text-purple-800">
            View All Online Hackathons →
          </Link>
        </div>

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
      </section>

      {/* Eligible Hackathons for Current Region */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-purple-600" />
            <h2 className="text-base font-bold text-navy-900">
              Hackathons Matching {regionLabel}
            </h2>
          </div>
          <Link href="/hackathons" className="text-xs font-semibold text-purple-600 hover:text-purple-800">
            Explore All Hackathons →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regionalHackathons.map(opp => (
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
      </section>

      {/* Scholarships Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-600" />
            <h2 className="text-base font-bold text-navy-900">
              Government & Private Scholarships ({regionLabel})
            </h2>
          </div>
          <Link href="/scholarships" className="text-xs font-semibold text-purple-600 hover:text-purple-800">
            View All Scholarships →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scholarships.slice(0, 3).map(opp => (
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
      </section>

      {/* Internships Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-indigo-600" />
            <h2 className="text-base font-bold text-navy-900">
              Research & Software Internships
            </h2>
          </div>
          <Link href="/internships" className="text-xs font-semibold text-purple-600 hover:text-purple-800">
            View All Internships →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {internships.map(opp => (
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
      </section>

      {/* Detail Modal */}
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

      {/* Application Tracker Modal */}
      <ApplicationModal
        opportunity={trackingOpp}
        isOpen={Boolean(trackingOpp)}
        onClose={() => setTrackingOpp(null)}
        onSaved={() => setApplications(StorageManager.getApplications())}
      />
    </div>
  );
}
