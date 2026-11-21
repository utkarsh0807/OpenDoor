'use client';

import React, { useState } from 'react';
import { AlertTriangle, Info, X, ShieldCheck, Key } from 'lucide-react';
import Link from 'next/link';

export const DemoModeBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-gradient-to-r from-purple-50 via-blue-50 to-indigo-50 border-b border-purple-100 text-xs text-slate-700 px-4 py-2.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-600"></span>
          </span>
          <span className="font-semibold text-purple-900 bg-purple-200/60 px-2 py-0.5 rounded text-[11px] uppercase tracking-wider">
            Local Demo Mode
          </span>
          <p className="text-slate-600 text-xs hidden sm:inline">
            Genuine source-verified records (SIH, Devfolio, NSP, MahaDBT, ISRO) mixed with tagged sample listings. 100% functional locally with guest storage.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/settings"
            className="inline-flex items-center gap-1 font-medium text-purple-700 hover:text-purple-900 underline underline-offset-2"
          >
            <Key className="w-3.5 h-3.5" />
            Config Setup
          </Link>
          <button
            onClick={() => setDismissed(true)}
            className="text-slate-400 hover:text-slate-600 p-0.5 rounded"
            title="Dismiss notice"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
