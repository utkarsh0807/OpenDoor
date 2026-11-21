'use client';

import React from 'react';
import { Search, Filter, RotateCcw, Globe, MapPin, CheckCircle, Clock } from 'lucide-react';
import { ACADEMIC_STREAMS } from '@/lib/constants';
import { ParticipationMode, RegistrationStatus } from '@/lib/types';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedMode: string;
  onModeChange: (m: string) => void;
  selectedStatus: string;
  onStatusChange: (s: string) => void;
  selectedStream: string;
  onStreamChange: (st: string) => void;
  onResetFilters: () => void;
  totalCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedMode,
  onModeChange,
  selectedStatus,
  onStatusChange,
  selectedStream,
  onStreamChange,
  onResetFilters,
  totalCount
}) => {
  const isFiltered = searchQuery !== '' || selectedMode !== 'all' || selectedStatus !== 'all' || selectedStream !== 'all';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm mb-6 space-y-3">
      {/* Top search & quick counts */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by keywords, organization, technologies, eligibility..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-navy-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
          />
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-slate-500">
          <span>Showing <strong>{totalCount}</strong> opportunities</span>
          {isFiltered && (
            <button
              onClick={onResetFilters}
              className="inline-flex items-center gap-1 text-purple-600 hover:text-purple-800 font-medium"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Dropdown Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-slate-100 text-xs">
        {/* Participation Mode */}
        <div>
          <label className="text-[11px] font-semibold text-slate-500 block mb-1">Participation Mode</label>
          <select
            value={selectedMode}
            onChange={(e) => onModeChange(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:bg-white"
          >
            <option value="all">All Modes (Online, Offline & Hybrid)</option>
            <option value="online">100% Online Only</option>
            <option value="offline">In-Person (Offline)</option>
            <option value="hybrid">Hybrid Mode</option>
          </select>
        </div>

        {/* Registration Deadline Status */}
        <div>
          <label className="text-[11px] font-semibold text-slate-500 block mb-1">Registration Status</label>
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:bg-white"
          >
            <option value="all">All Timelines</option>
            <option value="open">Registration Open</option>
            <option value="closing_soon">Closing Soon (Urgent)</option>
            <option value="closed">Registration Closed</option>
          </select>
        </div>

        {/* Academic Stream */}
        <div>
          <label className="text-[11px] font-semibold text-slate-500 block mb-1">Academic Stream</label>
          <select
            value={selectedStream}
            onChange={(e) => onStreamChange(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:bg-white"
          >
            <option value="all">All Academic Streams</option>
            {ACADEMIC_STREAMS.map((st) => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
