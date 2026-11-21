'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  CheckSquare, Calendar, Download, Trash2, Edit3, 
  ExternalLink, Sparkles, Check, Clock, Plus, ArrowRight 
} from 'lucide-react';
import { StorageManager } from '@/lib/storage';
import { ApplicationRecord, ApplicationStatus, Opportunity } from '@/lib/types';
import { INITIAL_OPPORTUNITIES } from '@/lib/data/initialOpportunities';
import { ApplicationModal } from '@/components/tracker/ApplicationModal';
import { EmptyState } from '@/components/common/EmptyState';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatDate, downloadFile } from '@/lib/utils';

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [selectedOppForEdit, setSelectedOppForEdit] = useState<Opportunity | null>(null);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = () => {
    const list = StorageManager.getApplications();
    // Hydrate opportunity details
    const hydrated = list.map(app => {
      const opp = INITIAL_OPPORTUNITIES.find(o => o.id === app.opportunityId) || app.opportunity;
      return { ...app, opportunity: opp };
    });
    setApplications(hydrated);
  };

  const handleDelete = (appId: string) => {
    StorageManager.deleteApplication(appId);
    loadApplications();
  };

  const handleExportData = () => {
    const jsonStr = StorageManager.exportPersonalData();
    downloadFile('opendoor-my-applications.json', jsonStr, 'application/json');
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'interested': return <Badge variant="default">Interested</Badge>;
      case 'preparing': return <Badge variant="warning">Preparing Documents</Badge>;
      case 'applied': return <Badge variant="primary">Applied / Form Submitted</Badge>;
      case 'selected': return <Badge variant="success">Selected / Winner</Badge>;
      case 'not_selected': return <Badge variant="danger">Not Selected</Badge>;
      case 'withdrawn': return <Badge variant="outline">Withdrawn</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 uppercase tracking-wider mb-1">
            <CheckSquare className="w-3.5 h-3.5" />
            Application Lifecycle Tracker
          </div>
          <h1 className="text-2xl font-extrabold text-navy-900">
            My Applications ({applications.length})
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track stages from initial interest to document preparation, final submission, and selection.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {applications.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportData}
              className="text-xs"
            >
              <Download className="w-3.5 h-3.5 mr-1" />
              Export Data (JSON)
            </Button>
          )}

          <Link
            href="/explore"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-purple-600 text-white rounded-xl text-xs font-semibold hover:bg-purple-700 transition-colors shadow-sm"
          >
            Find Opportunities to Track
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Applications List */}
      {applications.length > 0 ? (
        <div className="space-y-4">
          {applications.map((app) => {
            const opp = app.opportunity;
            const completedChecklist = app.checklist?.filter(c => c.done).length || 0;
            const totalChecklist = app.checklist?.length || 0;

            return (
              <div
                key={app.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:border-purple-200 transition-all text-xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    {getStatusBadge(app.status)}
                    {opp && (
                      <span className="text-[11px] font-bold text-slate-500 uppercase bg-slate-100 px-2 py-0.5 rounded">
                        {opp.category}
                      </span>
                    )}
                    {app.appliedDate && (
                      <span className="text-[11px] text-slate-500">
                        Submitted on: <strong>{app.appliedDate}</strong>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {opp && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedOppForEdit(opp)}
                      >
                        <Edit3 className="w-3 h-3 mr-1" />
                        Update Progress
                      </Button>
                    )}
                    <button
                      onClick={() => handleDelete(app.id)}
                      className="p-1.5 text-slate-300 hover:text-rose-600 rounded-lg transition-colors"
                      title="Delete tracking record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Title & Organization */}
                <div>
                  <h3 className="text-base font-bold text-navy-900">
                    {opp ? opp.title : `Opportunity #${app.opportunityId}`}
                  </h3>
                  {opp && (
                    <p className="text-xs text-slate-500">
                      Organized by {opp.organizer.organizationName} • Deadline: {formatDate(opp.registrationDeadline)}
                    </p>
                  )}
                </div>

                {/* Checklist Progress */}
                {totalChecklist > 0 && (
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700">
                      <span>Document & Task Checklist</span>
                      <span className="text-purple-700">{completedChecklist} of {totalChecklist} completed</span>
                    </div>

                    <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-purple-600 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${(completedChecklist / totalChecklist) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Notes */}
                {app.notes && (
                  <p className="text-slate-600 bg-purple-50/40 p-2.5 rounded-xl border border-purple-100/70 text-[11px] italic">
                    "{app.notes}"
                  </p>
                )}

                {/* Official Link */}
                {opp && (
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <a
                      href={opp.registrationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:underline flex items-center gap-1 font-semibold text-xs"
                    >
                      Open Official Application Page
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <span className="text-[10px] text-slate-400">
                      Updated {formatDate(app.updatedAt)}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          type="no_applications"
          onAction={() => {
            window.location.href = '/explore';
          }}
        />
      )}

      {/* Edit Modal */}
      <ApplicationModal
        opportunity={selectedOppForEdit}
        isOpen={Boolean(selectedOppForEdit)}
        onClose={() => setSelectedOppForEdit(null)}
        onSaved={loadApplications}
      />
    </div>
  );
}
