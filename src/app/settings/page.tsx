'use client';

import React, { useState } from 'react';
import { Settings, Shield, Key, Database, Sparkles, Download, Trash2, Check, RefreshCw } from 'lucide-react';
import { StorageManager } from '@/lib/storage';
import { Button } from '@/components/ui/Button';
import { downloadFile } from '@/lib/utils';

export default function SettingsPage() {
  const [cleared, setCleared] = useState(false);

  const handleExport = () => {
    const data = StorageManager.exportPersonalData();
    downloadFile('opendoor-export-all.json', data, 'application/json');
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to erase all local bookmarks, preferences, and applications? This cannot be undone.')) {
      StorageManager.clearAllData();
      setCleared(true);
      setTimeout(() => window.location.reload(), 1200);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200/80">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
          <Settings className="w-3.5 h-3.5" />
          Environment & Privacy
        </div>
        <h1 className="text-2xl font-extrabold text-navy-900">
          Settings & Local Demo Configuration
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage local demo mode, check external service connectivity, export your application data, or reset preferences.
        </p>
      </div>

      {cleared && (
        <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-xl">
          All local storage data cleared successfully. Reloading...
        </div>
      )}

      {/* Integration Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Gemini Integration Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-navy-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-600" />
              Google Gemini AI Engine
            </span>
            <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
              Server API Ready
            </span>
          </div>
          <p className="text-slate-500 leading-relaxed text-[11px]">
            Powers notice extraction, scholarship eligibility explanations, and opportunity comparison.
          </p>
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 font-mono text-[11px] text-slate-600">
            GEMINI_API_KEY=configured_in_env
          </div>
        </div>

        {/* Supabase PostgreSQL Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-navy-900 flex items-center gap-1.5">
              <Database className="w-4 h-4 text-emerald-600" />
              Supabase PostgreSQL
            </span>
            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              Demo Fallback Active
            </span>
          </div>
          <p className="text-slate-500 leading-relaxed text-[11px]">
            14 migration tables with Row Level Security. Currently running in zero-setup Local Demo Mode.
          </p>
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 font-mono text-[11px] text-slate-600">
            NEXT_PUBLIC_SUPABASE_URL=...
          </div>
        </div>
      </div>

      {/* Data Management & Privacy */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-4 text-xs text-slate-700">
        <h3 className="text-xs font-bold text-navy-900 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-purple-600" />
          Personal Data Ownership & Privacy
        </h3>

        <p className="text-slate-600 leading-relaxed">
          OpenDoor prioritizes student privacy. In Guest Mode, all bookmarked opportunities, application checklists, and profile preferences remain exclusively in your local browser storage.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Export My Data (JSON)
          </Button>

          <Button variant="danger" size="sm" onClick={handleClearAll}>
            <Trash2 className="w-3.5 h-3.5 mr-1.5" />
            Clear All Local Data
          </Button>
        </div>
      </div>
    </div>
  );
}
