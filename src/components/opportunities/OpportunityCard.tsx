'use client';

import React from 'react';
import { Bookmark, Clock, ExternalLink, FileText, Globe, Layers } from 'lucide-react';
import { Opportunity, StudentProfile } from '@/lib/types';
import { VerificationBadge } from './VerificationBadge';
import { MatchingScoreBadge } from './MatchingScoreBadge';
import { EventLocationBadge } from './EventLocationBadge';
import { calculateOpportunityMatch } from '@/lib/matchingEngine';
import { formatDate, getDaysRemaining } from '@/lib/utils';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface OpportunityCardProps {
  opportunity: Opportunity;
  profile?: StudentProfile | null;
  isSaved?: boolean;
  onToggleSave?: (id: string) => void;
  onOpenDetails?: (opp: Opportunity) => void;
  onCheckAiEligibility?: (opp: Opportunity) => void;
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({
  opportunity,
  profile,
  isSaved = false,
  onToggleSave,
  onOpenDetails,
}) => {
  const matchResult = calculateOpportunityMatch(opportunity, profile);
  const deadlineInfo = getDaysRemaining(opportunity.registrationDeadline);
  const hasDocs = Boolean(opportunity.documentRequirements && opportunity.documentRequirements.length > 0);

  const getCategoryColor = () => {
    switch (opportunity.category) {
      case 'hackathon': return 'bg-purple-100/80 text-purple-800';
      case 'scholarship': return 'bg-emerald-100/80 text-emerald-800';
      case 'internship': return 'bg-blue-100/80 text-blue-800';
      case 'competition': return 'bg-amber-100/80 text-amber-800';
      case 'workshop': return 'bg-rose-100/80 text-rose-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 hover:border-purple-300 hover:shadow-xl transition-all duration-200 flex flex-col justify-between overflow-hidden relative">
      {/* Top badges bar */}
      <div className="p-5 pb-3">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${getCategoryColor()}`}>
              {opportunity.category}
            </span>
            {opportunity.sourcePlatform && (
              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                {opportunity.sourcePlatform}
              </span>
            )}
            <VerificationBadge 
              status={opportunity.verificationStatus} 
              isDemoData={opportunity.isDemoData} 
            />
          </div>

          <button
            onClick={() => onToggleSave && onToggleSave(opportunity.id)}
            className={`p-2 rounded-xl transition-colors ${
              isSaved 
                ? 'text-purple-600 bg-purple-50 hover:bg-purple-100' 
                : 'text-slate-400 hover:text-purple-600 hover:bg-slate-100'
            }`}
            title={isSaved ? 'Remove from saved' : 'Save opportunity'}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-purple-600' : ''}`} />
          </button>
        </div>

        {/* Title & Organizer */}
        <h3 
          onClick={() => onOpenDetails && onOpenDetails(opportunity)}
          className="text-base font-bold text-navy-900 group-hover:text-purple-700 transition-colors cursor-pointer line-clamp-2 mb-1"
        >
          {opportunity.title}
        </h3>
        <p className="text-xs text-slate-500 mb-2.5 font-medium">
          by {opportunity.organizer.organizationName}
        </p>

        {/* Clear Event Location vs Participation Mode */}
        <div className="mb-3">
          <EventLocationBadge opportunity={opportunity} showVenue={true} />
        </div>

        {/* Short description */}
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
          {opportunity.shortDescription}
        </p>

        {/* Eligibility Snapshot */}
        <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100 mb-3 space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Eligibility:</span>
            <span className="font-medium text-navy-900 truncate max-w-[170px]" title={opportunity.eligibility.eligibleStreams.join(', ')}>
              {opportunity.eligibility.eligibleStreams.length > 0 
                ? opportunity.eligibility.eligibleStreams.slice(0, 2).join(', ') + (opportunity.eligibility.eligibleStreams.length > 2 ? '...' : '') 
                : 'All Streams'}
            </span>
          </div>

          {opportunity.category === 'scholarship' && opportunity.eligibility.maxFamilyIncomeInr && (
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Max Income:</span>
              <span className="font-medium text-emerald-700">
                ≤ ₹{opportunity.eligibility.maxFamilyIncomeInr.toLocaleString('en-IN')}/yr
              </span>
            </div>
          )}

          {opportunity.prizesOrBenefits && (
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Benefit/Prize:</span>
              <span className="font-medium text-purple-700 truncate max-w-[170px]" title={opportunity.prizesOrBenefits}>
                {opportunity.prizesOrBenefits}
              </span>
            </div>
          )}
        </div>

        {/* Documents Indicator & Match Badge */}
        <div className="flex items-center justify-between gap-2 mb-1">
          <MatchingScoreBadge 
            matchResult={matchResult} 
            onClickExplanation={() => onOpenDetails && onOpenDetails(opportunity)} 
          />

          {hasDocs && (
            <span className="inline-flex items-center gap-1 text-[11px] text-purple-700 font-semibold bg-purple-50 px-2 py-0.5 rounded-lg border border-purple-100">
              <FileText className="w-3 h-3 text-purple-600" />
              {opportunity.documentRequirements?.length} Docs
            </span>
          )}
        </div>
      </div>

      {/* Footer bar with Dates & Action */}
      <div className="px-5 py-3.5 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-xs">
        <div>
          <div className="flex items-center gap-1.5 text-slate-500">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Apply by: <strong>{formatDate(opportunity.registrationDeadline)}</strong></span>
          </div>
          <span className={`text-[11px] font-semibold ${
            deadlineInfo.passed 
              ? 'text-slate-400' 
              : deadlineInfo.urgent 
                ? 'text-rose-600 animate-pulse' 
                : 'text-purple-600'
          }`}>
            {deadlineInfo.text}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenDetails && onOpenDetails(opportunity)}
          >
            Details
          </Button>

          <a
            href={opportunity.registrationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center p-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors shadow-sm"
            title="Open official registration portal"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
