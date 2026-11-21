'use client';

import React, { useState } from 'react';
import { 
  Bookmark, ExternalLink, Sparkles, Download, Layers, 
  CheckCircle2, AlertCircle, FileText, SearchCheck, ShieldCheck, AlertTriangle
} from 'lucide-react';
import { Opportunity, StudentProfile } from '@/lib/types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { VerificationBadge } from './VerificationBadge';
import { OrganizerContactCard } from './OrganizerContactCard';
import { EventLocationBadge } from './EventLocationBadge';
import { RequiredDocumentsSection } from './RequiredDocumentsSection';
import { MediaGallery } from '../media/MediaGallery';
import { calculateOpportunityMatch } from '@/lib/matchingEngine';
import { formatDate, getDaysRemaining, generateICS, downloadFile } from '@/lib/utils';
import { StorageManager } from '@/lib/storage';

interface OpportunityDetailModalProps {
  opportunity: Opportunity | null;
  profile?: StudentProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onTrackApplication?: (opp: Opportunity) => void;
}

export const OpportunityDetailModal: React.FC<OpportunityDetailModalProps> = ({
  opportunity,
  profile,
  isOpen,
  onClose,
  onTrackApplication
}) => {
  const [isSaved, setIsSaved] = useState(false);
  const [aiExplanation, setAiExplanation] = useState<any | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const [researchResult, setResearchResult] = useState<any | null>(null);
  const [isResearchLoading, setIsResearchLoading] = useState(false);
  const [researchError, setResearchError] = useState<string | null>(null);

  if (!opportunity) return null;

  const matchResult = calculateOpportunityMatch(opportunity, profile);
  const deadlineInfo = getDaysRemaining(opportunity.registrationDeadline);

  const handleDownloadICS = () => {
    const icsData = generateICS(opportunity);
    downloadFile(`${opportunity.slug}-calendar.ics`, icsData, 'text/calendar;charset=utf-8');
  };

  const handleToggleSave = () => {
    const saved = StorageManager.toggleSaveOpportunity(opportunity.id);
    setIsSaved(saved);
  };

  const handleFetchAiExplanation = async () => {
    setIsAiLoading(true);
    setAiError(null);
    try {
      const res = await fetch('/api/gemini/eligibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          opportunityTitle: opportunity.title,
          eligibility: opportunity.eligibility,
          studentProfile: profile || { note: "Guest student profile" }
        })
      });
      const json = await res.json();
      if (json.success) {
        setAiExplanation(json.data);
      } else {
        setAiError(json.error || 'Could not generate explanation');
      }
    } catch (e: any) {
      setAiError(e.message || 'AI guidance service temporarily unavailable');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleFetchResearch = async () => {
    setIsResearchLoading(true);
    setResearchError(null);
    try {
      const res = await fetch('/api/gemini/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: opportunity.title,
          officialUrl: opportunity.officialSourceUrl,
          details: {
            deadline: opportunity.registrationDeadline,
            mode: opportunity.mode,
            eventCity: opportunity.eventCity,
            eventState: opportunity.eventState,
            eventVenue: opportunity.eventVenue,
            fee: opportunity.registrationFee,
            sourcePlatform: opportunity.sourcePlatform
          }
        })
      });
      const data = await res.json();
      if (res.ok) {
        setResearchResult(data);
      } else {
        setResearchError(data.error || 'Could not fetch research');
      }
    } catch (e: any) {
      setResearchError(e.message || 'Multi-source research service temporarily unavailable');
    } finally {
      setIsResearchLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="2xl"
      title={opportunity.title}
      description={`Organized by ${opportunity.organizer.organizationName}`}
    >
      <div className="space-y-6 text-sm text-slate-700">
        {/* Badges Bar */}
        <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-slate-100">
          <Badge variant="purple" className="capitalize">{opportunity.category}</Badge>
          {opportunity.sourcePlatform && (
            <Badge variant="outline" className="font-bold text-slate-600">
              Source: {opportunity.sourcePlatform}
            </Badge>
          )}
          <VerificationBadge 
            status={opportunity.verificationStatus} 
            isDemoData={opportunity.isDemoData} 
          />
          {opportunity.isAllIndia && <Badge variant="outline">Pan-India</Badge>}
          {opportunity.registrationFee === 0 ? (
            <Badge variant="success">Free Entry</Badge>
          ) : (
            <Badge variant="default">Fee: ₹{opportunity.registrationFee}</Badge>
          )}

          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadICS}
              title="Add event to your calendar (.ics)"
            >
              <Download className="w-3.5 h-3.5 mr-1" />
              Calendar (.ics)
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleSave}
            >
              <Bookmark className="w-3.5 h-3.5 mr-1" />
              {isSaved ? 'Saved' : 'Save'}
            </Button>
          </div>
        </div>

        {/* Dedicated Event Location vs Organizer Headquarters */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Authentic Event Location
            </span>
            {opportunity.organizer.organizerCity && (
              <span className="text-[11px] text-slate-400">
                Organizer HQ: {opportunity.organizer.organizerCity}, {opportunity.organizer.organizerState || 'India'}
              </span>
            )}
          </div>
          <EventLocationBadge opportunity={opportunity} showVenue={true} detailed={true} />
        </div>

        {/* Media Discovery (Poster, Banner, YouTube Video, Photos) */}
        {opportunity.media && (
          <MediaGallery 
            media={opportunity.media} 
            title={opportunity.title} 
            sourceUrl={opportunity.officialSourceUrl} 
          />
        )}

        {/* Key Dates Grid (Strictly separating Registration vs Event) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-purple-50/50 rounded-xl border border-purple-100 text-xs">
          <div>
            <span className="font-semibold text-purple-900 block mb-0.5">Registration Timeline</span>
            <p className="text-slate-600">
              Deadline: <strong>{formatDate(opportunity.registrationDeadline)}</strong>
            </p>
            <p className={`font-semibold mt-1 ${deadlineInfo.passed ? 'text-slate-400' : deadlineInfo.urgent ? 'text-rose-600' : 'text-purple-700'}`}>
              Registration: {opportunity.registrationStatus.toUpperCase()} ({deadlineInfo.text})
            </p>
          </div>

          <div>
            <span className="font-semibold text-blue-900 block mb-0.5">Event Execution Timeline</span>
            <p className="text-slate-600">
              Starts: <strong>{formatDate(opportunity.eventStartDate)}</strong>
            </p>
            <p className="text-slate-600">
              Ends: <strong>{formatDate(opportunity.eventEndDate)}</strong>
            </p>
            <p className="text-blue-700 font-semibold mt-1">
              Event Status: {opportunity.eventStatus.toUpperCase()}
            </p>
          </div>
        </div>

        {/* Full Description */}
        <div>
          <h4 className="font-bold text-navy-900 mb-1.5 text-xs uppercase tracking-wider">
            About this Opportunity
          </h4>
          <p className="text-slate-600 leading-relaxed text-xs sm:text-sm">
            {opportunity.description}
          </p>
        </div>

        {/* Document Requirements Intelligence (Part 4) */}
        <RequiredDocumentsSection
          opportunityId={opportunity.id}
          opportunityTitle={opportunity.title}
          documentRequirements={opportunity.documentRequirements}
        />

        {/* Eligibility Breakdown */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-3">
          <h4 className="font-bold text-navy-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-purple-600" />
            Eligibility & Criteria
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-slate-400 block">Eligible Streams:</span>
              <span className="font-medium text-slate-800">
                {opportunity.eligibility.eligibleStreams.join(', ') || 'All Streams'}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block">Education Levels:</span>
              <span className="font-medium text-slate-800">
                {opportunity.eligibility.educationLevels.map(e => e.replace('_', ' ')).join(', ') || 'All Tiers'}
              </span>
            </div>

            {opportunity.eligibility.teamSizeMin && (
              <div>
                <span className="text-slate-400 block">Team Size:</span>
                <span className="font-medium text-slate-800">
                  {opportunity.eligibility.teamSizeMin} to {opportunity.eligibility.teamSizeMax} Members
                </span>
              </div>
            )}

            {opportunity.eligibility.maxFamilyIncomeInr && (
              <div>
                <span className="text-slate-400 block">Income Threshold:</span>
                <span className="font-medium text-emerald-700">
                  ≤ ₹{opportunity.eligibility.maxFamilyIncomeInr.toLocaleString('en-IN')} / year
                </span>
              </div>
            )}
          </div>

          {opportunity.eligibility.requiredSkills && opportunity.eligibility.requiredSkills.length > 0 && (
            <div className="pt-2 border-t border-slate-200/60 text-xs">
              <span className="text-slate-400 block mb-1">Required / Relevant Skills:</span>
              <div className="flex flex-wrap gap-1">
                {opportunity.eligibility.requiredSkills.map((skill, idx) => (
                  <span key={idx} className="bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded text-[11px]">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {opportunity.eligibility.notes && (
            <p className="text-xs text-amber-800 bg-amber-50 p-2.5 rounded-lg border border-amber-200/60">
              <strong>Notice:</strong> {opportunity.eligibility.notes}
            </p>
          )}
        </div>

        {/* Deterministic "Why am I seeing this opportunity?" */}
        <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
              Why am I seeing this?
            </span>
            <span className="font-semibold text-blue-700">
              Match Score: {matchResult.matchScore}%
            </span>
          </div>

          <p className="text-slate-700">{matchResult.explanation}</p>

          <div className="space-y-1 pt-1 text-[11px]">
            {matchResult.matchedCriteria.map((m, i) => (
              <div key={i} className="flex items-center gap-1 text-emerald-700">
                <CheckCircle2 className="w-3 h-3 shrink-0" />
                <span>{m}</span>
              </div>
            ))}
            {matchResult.missingOrUnmetCriteria.map((m, i) => (
              <div key={i} className="flex items-center gap-1 text-rose-600">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{m}</span>
              </div>
            ))}
          </div>

          {/* Gemini AI Explainer Action */}
          <div className="pt-2">
            {!aiExplanation ? (
              <Button
                variant="outline"
                size="sm"
                isLoading={isAiLoading}
                onClick={handleFetchAiExplanation}
                className="bg-white text-purple-700 border-purple-200 hover:bg-purple-50 text-xs w-full"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-600 mr-1.5" />
                Explain My Eligibility with Google Gemini AI
              </Button>
            ) : (
              <div className="bg-white rounded-lg p-3 border border-purple-200 text-xs space-y-2 mt-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-purple-900 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                    Gemini AI Advisory Analysis: {aiExplanation.verdict}
                  </span>
                </div>
                <p className="text-slate-700">{aiExplanation.summary}</p>
                {aiExplanation.applicationTips && (
                  <ul className="list-disc list-inside text-slate-600 text-[11px] space-y-0.5">
                    {aiExplanation.applicationTips.map((tip: string, idx: number) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                )}
                <p className="text-[10px] text-slate-400 italic pt-1 border-t border-slate-100">
                  {aiExplanation.disclaimer || 'Advisory guidance only. Final eligibility determined exclusively by organizing body.'}
                </p>
              </div>
            )}
            {aiError && (
              <p className="text-[11px] text-rose-600 mt-1">{aiError}</p>
            )}
          </div>
        </div>

        {/* Gemini Multi-Source AI Research & Discrepancy Audit (Part 3) */}
        <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/40 text-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-purple-900 uppercase tracking-wider flex items-center gap-1.5">
              <SearchCheck className="w-4 h-4 text-purple-600" />
              Multi-Source AI Research & Discrepancy Audit
            </span>
            {researchResult && (
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                {researchResult.confidenceScore}% Confidence Verified
              </span>
            )}
          </div>

          {!researchResult ? (
            <div className="flex items-center justify-between gap-3">
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Audit this opportunity against official circulars, event platforms, and college notices to detect deadline extensions or fee changes.
              </p>
              <Button
                variant="outline"
                size="sm"
                isLoading={isResearchLoading}
                onClick={handleFetchResearch}
                className="bg-white text-purple-700 border-purple-300 hover:bg-purple-100/70 text-xs shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1" />
                Run AI Audit
              </Button>
            </div>
          ) : (
            <div className="space-y-3 pt-1">
              <p className="text-slate-700 leading-relaxed bg-white p-2.5 rounded-lg border border-purple-100">
                {researchResult.summary}
              </p>

              {/* Confirmed Facts */}
              {researchResult.confirmedFacts && researchResult.confirmedFacts.length > 0 && (
                <div className="space-y-1">
                  <span className="font-semibold text-slate-800 block text-[11px]">
                    Confirmed Cross-Source Facts:
                  </span>
                  <ul className="space-y-1 text-slate-600 text-[11px]">
                    {researchResult.confirmedFacts.map((fact: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{fact}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Discrepancies if any */}
              {researchResult.discrepanciesOrRumors && researchResult.discrepanciesOrRumors.length > 0 && (
                <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200 space-y-1 text-[11px]">
                  <span className="font-semibold text-amber-900 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    Detected Discrepancies Between Sources:
                  </span>
                  {researchResult.discrepanciesOrRumors.map((disc: any, idx: number) => (
                    <div key={idx} className="text-amber-800">
                      <strong>{disc.field}:</strong> Official: {disc.officialClaim} vs Secondary: {disc.secondaryClaim}
                    </div>
                  ))}
                </div>
              )}

              {/* Source Comparison */}
              {researchResult.sourceComparison && researchResult.sourceComparison.length > 0 && (
                <div className="pt-1 border-t border-purple-100">
                  <span className="font-semibold text-slate-800 block text-[11px] mb-1.5">
                    Source Reliability Comparison:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    {researchResult.sourceComparison.map((source: any, idx: number) => (
                      <div key={idx} className="p-2 bg-white rounded border border-slate-200 flex items-center justify-between">
                        <span className="font-medium text-slate-800 truncate mr-2">{source.sourceName}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                          source.reliability === 'verified_primary' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {source.reliability.replace('_', ' ')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {researchError && (
            <p className="text-[11px] text-rose-600">{researchError}</p>
          )}
        </div>

        {/* Organizer Official Contact System */}
        <OrganizerContactCard opportunity={opportunity} />

        {/* Provenance and Bottom Bar */}
        <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="text-[11px] text-slate-400">
            <span>Verified Source: </span>
            <a 
              href={opportunity.officialSourceUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-purple-600 hover:underline font-medium"
            >
              {opportunity.officialSourceUrl}
            </a>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="md"
              onClick={() => onTrackApplication && onTrackApplication(opportunity)}
            >
              Track in Application Tracker
            </Button>

            <a
              href={opportunity.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 transition-colors shadow-sm"
            >
              Apply on Official Website
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </Modal>
  );
};
