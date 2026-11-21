'use client';

import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, Download, ChevronLeft, ChevronRight, AlertCircle, Bookmark, ExternalLink } from 'lucide-react';
import { INITIAL_OPPORTUNITIES } from '@/lib/data/initialOpportunities';
import { Opportunity } from '@/lib/types';
import { formatDate, generateICS, downloadFile } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { OpportunityDetailModal } from '@/components/opportunities/OpportunityDetailModal';

export default function CalendarPage() {
  const [viewMode, setViewMode] = useState<'timeline' | 'upcoming'>('timeline');
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);

  // Group events by deadline
  const events = INITIAL_OPPORTUNITIES.map(opp => ({
    id: opp.id,
    title: opp.title,
    category: opp.category,
    registrationDeadline: opp.registrationDeadline,
    eventStartDate: opp.eventStartDate,
    eventEndDate: opp.eventEndDate,
    mode: opp.mode,
    opportunity: opp
  })).sort((a, b) => new Date(a.registrationDeadline).getTime() - new Date(b.registrationDeadline).getTime());

  const handleExportAllICS = () => {
    // Generate combined ICS calendar
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//OpenDoor//Complete Student Calendar//EN',
      ...events.map(e => [
        'BEGIN:VEVENT',
        `UID:opendoor-${e.id}@opendoor.in`,
        `DTSTAMP:${new Date().toISOString().replace(/-|:|\.\d+/g, '')}`,
        `DTSTART:${new Date(e.eventStartDate).toISOString().replace(/-|:|\.\d+/g, '')}`,
        `DTEND:${new Date(e.eventEndDate).toISOString().replace(/-|:|\.\d+/g, '')}`,
        `SUMMARY:${e.title}`,
        `DESCRIPTION:Deadline: ${formatDate(e.registrationDeadline)} | Link: ${e.opportunity.officialSourceUrl}`,
        'STATUS:CONFIRMED',
        'END:VEVENT'
      ].join('\r\n')),
      'END:VCALENDAR'
    ].join('\r\n');

    downloadFile('opendoor-student-calendar.ics', icsContent, 'text/calendar;charset=utf-8');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">
            <CalendarIcon className="w-3.5 h-3.5" />
            Deadlines & Schedule Hub
          </div>
          <h1 className="text-2xl font-extrabold text-navy-900">
            Opportunity & Deadline Calendar
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track registration closing dates alongside event execution days. Export to Google Calendar, Apple Calendar, or Outlook.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportAllICS}
            className="text-xs"
          >
            <Download className="w-3.5 h-3.5 mr-1" />
            Export All to .ICS
          </Button>
        </div>
      </div>

      {/* Calendar Notice on Deadlines vs Events */}
      <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200/80 text-xs text-amber-900 flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <strong className="block mb-0.5">Strict Distinction: Registration Deadline vs Event Date</strong>
          <p className="text-slate-600 leading-relaxed text-[11px]">
            In OpenDoor, a registration deadline is when applications close. Hackathons and competitions may have closed registrations while the physical or online event happens weeks later. Never miss the application cutoff!
          </p>
        </div>
      </div>

      {/* Timeline List */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-navy-900 pb-2 border-b border-slate-100 flex items-center justify-between">
          <span>Upcoming Chronological Timeline</span>
          <span className="text-xs text-slate-400 font-normal">{events.length} Events Synced</span>
        </h3>

        <div className="space-y-3">
          {events.map((item) => {
            const d = new Date(item.registrationDeadline);
            const isPassed = d.getTime() < Date.now();

            return (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-slate-100 hover:border-purple-200 hover:bg-slate-50/70 transition-all text-xs"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center font-bold shrink-0 ${
                    isPassed ? 'bg-slate-100 text-slate-400' : 'bg-purple-100 text-purple-700'
                  }`}>
                    <span className="text-[10px] uppercase leading-none">
                      {d.toLocaleDateString('en-IN', { month: 'short' })}
                    </span>
                    <span className="text-base leading-tight">
                      {d.getDate()}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                      <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                        {item.category}
                      </span>
                      <Badge variant={item.mode === 'online' ? 'primary' : 'default'}>
                        {item.mode.toUpperCase()}
                      </Badge>
                      {isPassed ? (
                        <span className="text-[10px] text-slate-400 font-semibold">Closed</span>
                      ) : (
                        <span className="text-[10px] text-purple-700 font-semibold bg-purple-50 px-1.5 py-0.2 rounded">
                          Registration Open
                        </span>
                      )}
                    </div>
                    <h4 
                      onClick={() => setSelectedOpp(item.opportunity)}
                      className="font-bold text-navy-900 text-xs sm:text-sm hover:text-purple-600 transition-colors cursor-pointer"
                    >
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Event Dates: <strong>{formatDate(item.eventStartDate)}</strong> to <strong>{formatDate(item.eventEndDate)}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const ics = generateICS(item.opportunity);
                      downloadFile(`${item.opportunity.slug}.ics`, ics, 'text/calendar;charset=utf-8');
                    }}
                    title="Export single event"
                  >
                    <Download className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setSelectedOpp(item.opportunity)}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <OpportunityDetailModal
        opportunity={selectedOpp}
        isOpen={Boolean(selectedOpp)}
        onClose={() => setSelectedOpp(null)}
      />
    </div>
  );
}
