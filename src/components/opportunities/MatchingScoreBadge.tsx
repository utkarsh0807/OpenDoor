import React from 'react';
import { Sparkles, CheckCircle2, AlertTriangle, HelpCircle, XCircle } from 'lucide-react';
import { MatchResult } from '@/lib/types';
import { Badge } from '../ui/Badge';

interface MatchingScoreBadgeProps {
  matchResult: MatchResult;
  onClickExplanation?: () => void;
}

export const MatchingScoreBadge: React.FC<MatchingScoreBadgeProps> = ({
  matchResult,
  onClickExplanation
}) => {
  const { matchStrength, matchScore } = matchResult;

  const content = () => {
    switch (matchStrength) {
      case 'strong':
        return {
          variant: 'success' as const,
          icon: CheckCircle2,
          label: `Strong Match (${matchScore}%)`,
          color: 'text-emerald-600'
        };
      case 'potential':
        return {
          variant: 'primary' as const,
          icon: Sparkles,
          label: `Potential Match (${matchScore}%)`,
          color: 'text-blue-600'
        };
      case 'not_eligible':
        return {
          variant: 'danger' as const,
          icon: XCircle,
          label: 'Not Eligible',
          color: 'text-rose-600'
        };
      case 'insufficient_info':
      default:
        return {
          variant: 'outline' as const,
          icon: HelpCircle,
          label: 'Eligibility TBD',
          color: 'text-slate-500'
        };
    }
  };

  const cfg = content();
  const Icon = cfg.icon;

  return (
    <button
      type="button"
      onClick={onClickExplanation}
      className="inline-flex items-center group cursor-pointer focus:outline-none"
      title="Click to see deterministic match breakdown"
    >
      <Badge variant={cfg.variant} className="group-hover:border-purple-300 transition-colors">
        <Icon className={`w-3 h-3 ${cfg.color}`} />
        <span>{cfg.label}</span>
      </Badge>
    </button>
  );
};
