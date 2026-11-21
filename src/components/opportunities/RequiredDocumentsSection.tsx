'use client';

import React, { useState, useEffect } from 'react';
import { FileText, CheckCircle2, AlertCircle, HelpCircle, ExternalLink, RotateCcw, Check } from 'lucide-react';
import { DocumentRequirement } from '@/lib/types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface RequiredDocumentsSectionProps {
  opportunityId: string;
  opportunityTitle: string;
  documentRequirements?: DocumentRequirement[];
}

export const RequiredDocumentsSection: React.FC<RequiredDocumentsSectionProps> = ({
  opportunityId,
  opportunityTitle,
  documentRequirements = []
}) => {
  const storageKey = `opendoor_docs_checklist_${opportunityId}`;
  const [checkedIds, setCheckedIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setCheckedIds(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Failed reading document checklist', e);
    }
  }, [storageKey]);

  const toggleCheck = (id: string) => {
    const updated = checkedIds.includes(id) 
      ? checkedIds.filter(i => i !== id) 
      : [...checkedIds, id];
    setCheckedIds(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed saving document checklist', e);
    }
  };

  const handleReset = () => {
    setCheckedIds([]);
    try {
      localStorage.removeItem(storageKey);
    } catch (e) {
      console.warn('Failed clearing checklist', e);
    }
  };

  if (!documentRequirements || documentRequirements.length === 0) {
    return (
      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 text-xs text-slate-500 flex items-center gap-2.5">
        <HelpCircle className="w-4 h-4 text-slate-400 shrink-0" />
        <span>Document requirements not specified by the organizer.</span>
      </div>
    );
  }

  const completedCount = checkedIds.filter(id => documentRequirements.some(d => d.id === id)).length;
  const progressPercent = Math.round((completedCount / documentRequirements.length) * 100);

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'required':
        return <Badge variant="danger">Mandatory Document</Badge>;
      case 'conditional':
        return <Badge variant="warning">Conditional Requirement</Badge>;
      case 'optional':
      default:
        return <Badge variant="outline">Optional / Recommended</Badge>;
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm space-y-4">
      {/* Header & Progress */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div>
          <h4 className="text-sm font-bold text-navy-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-purple-600" />
            Required Document Intelligence
          </h4>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Verified requirements extracted from official circulars. Check off items as you prepare.
          </p>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto text-xs">
          <span className="font-semibold text-purple-700">
            {completedCount} of {documentRequirements.length} Ready ({progressPercent}%)
          </span>
          {completedCount > 0 && (
            <button
              onClick={handleReset}
              className="text-[11px] text-slate-400 hover:text-slate-600 flex items-center gap-1"
              title="Reset document preparation progress"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
        <div 
          className="bg-purple-600 h-1.5 rounded-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Document Items List */}
      <div className="space-y-3">
        {documentRequirements.map((doc) => {
          const isDone = checkedIds.includes(doc.id);

          return (
            <div
              key={doc.id}
              onClick={() => toggleCheck(doc.id)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 text-xs ${
                isDone 
                  ? 'border-emerald-200 bg-emerald-50/40 text-slate-800' 
                  : 'border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div 
                className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                  isDone ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                }`}
              >
                {isDone && <Check className="w-3.5 h-3.5" />}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`font-bold ${isDone ? 'line-through text-slate-400' : 'text-navy-900'}`}>
                    {doc.name}
                  </span>
                  {getTierBadge(doc.requirementTier)}
                  {doc.acceptedFormat && (
                    <span className="text-[10px] text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {doc.acceptedFormat}
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {doc.explanation}
                </p>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-slate-400 pt-1">
                  <span>Who needs it: <strong className="text-slate-600">{doc.whoNeedsIt}</strong></span>
                  <span>When required: <strong className="text-slate-600">{doc.whenRequired}</strong></span>
                  {doc.supportingSourceUrl && (
                    <a
                      href={doc.supportingSourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-purple-600 hover:underline flex items-center gap-0.5 ml-auto"
                    >
                      Official Guideline <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
