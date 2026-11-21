import React from 'react';

export const OpportunityCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm animate-pulse flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="h-5 bg-slate-200 rounded-full w-24"></div>
          <div className="h-5 bg-slate-200 rounded-full w-16"></div>
        </div>
        <div className="h-6 bg-slate-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-slate-100 rounded w-1/2 mb-4"></div>
        <div className="space-y-2 mb-4">
          <div className="h-3 bg-slate-100 rounded w-full"></div>
          <div className="h-3 bg-slate-100 rounded w-5/6"></div>
        </div>
      </div>
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <div className="h-4 bg-slate-200 rounded w-20"></div>
        <div className="h-8 bg-slate-200 rounded-lg w-24"></div>
      </div>
    </div>
  );
};

export const GridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <OpportunityCardSkeleton key={i} />
      ))}
    </div>
  );
};
