'use client';

import React from 'react';
import { MapPin, Globe, Building2, HelpCircle } from 'lucide-react';
import { Opportunity } from '@/lib/types';
import { formatEventLocation } from '@/lib/locationEngine';
import { cn } from '@/lib/utils';

interface EventLocationBadgeProps {
  opportunity: Opportunity;
  className?: string;
  showVenue?: boolean;
  detailed?: boolean;
}

export const EventLocationBadge: React.FC<EventLocationBadgeProps> = ({
  opportunity,
  className,
  showVenue = false,
  detailed = false
}) => {
  const locInfo = formatEventLocation(opportunity);

  if (locInfo.mode === 'online') {
    return (
      <div className={cn('inline-flex items-center gap-1.5 text-xs text-blue-700 bg-blue-50/80 px-2.5 py-1 rounded-lg border border-blue-200/60 font-medium', className)}>
        <Globe className="w-3.5 h-3.5 text-blue-600 shrink-0" />
        <span className="truncate" title={locInfo.display}>
          {detailed ? locInfo.display : locInfo.shortDisplay}
        </span>
      </div>
    );
  }

  if (locInfo.mode === 'hybrid') {
    return (
      <div className={cn('inline-flex items-center gap-1.5 text-xs text-purple-700 bg-purple-50/80 px-2.5 py-1 rounded-lg border border-purple-200/60 font-medium', className)}>
        <MapPin className="w-3.5 h-3.5 text-purple-600 shrink-0" />
        <span className="truncate" title={locInfo.display}>
          {detailed ? locInfo.display : locInfo.shortDisplay}
        </span>
        {showVenue && locInfo.venue && (
          <span className="text-[10px] text-purple-500 font-normal">({locInfo.venue})</span>
        )}
      </div>
    );
  }

  // Offline
  if (locInfo.display !== 'Event location not confirmed') {
    return (
      <div className={cn('inline-flex items-center gap-1.5 text-xs text-slate-700 bg-slate-100/90 px-2.5 py-1 rounded-lg border border-slate-200 font-medium', className)}>
        <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
        <span className="truncate" title={locInfo.display}>
          {detailed ? locInfo.display : locInfo.shortDisplay}
        </span>
        {showVenue && locInfo.venue && (
          <span className="text-[10px] text-slate-500 font-normal truncate max-w-[150px]">
            • {locInfo.venue}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={cn('inline-flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/70', className)}>
      <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
      <span>Event location not confirmed</span>
    </div>
  );
};
