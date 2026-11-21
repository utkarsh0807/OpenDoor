import React from 'react';
import { ShieldCheck, ShieldAlert, Clock, HelpCircle, AlertCircle, FileText } from 'lucide-react';
import { VerificationStatus } from '@/lib/types';
import { Badge } from '../ui/Badge';

interface VerificationBadgeProps {
  status: VerificationStatus;
  isDemoData?: boolean;
  verifiedBy?: string | null;
  lastVerifiedAt?: string | null;
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({
  status,
  isDemoData,
  verifiedBy,
}) => {
  if (isDemoData) {
    return (
      <Badge variant="warning" title="Sample evaluation listing for demonstration">
        <HelpCircle className="w-3 h-3 text-amber-600" />
        Demo Record
      </Badge>
    );
  }

  switch (status) {
    case 'verified':
      return (
        <Badge variant="success" title={`Verified by ${verifiedBy || 'ChanceDeck Verification Desk'}`}>
          <ShieldCheck className="w-3 h-3 text-emerald-600" />
          Verified Source
        </Badge>
      );
    case 'pending_review':
      return (
        <Badge variant="warning" title="Queued for admin authenticity review">
          <Clock className="w-3 h-3 text-amber-600" />
          Pending Review
        </Badge>
      );
    case 'discovered':
      return (
        <Badge variant="primary" title="Discovered via public automated feed">
          <FileText className="w-3 h-3 text-blue-600" />
          Discovered
        </Badge>
      );
    case 'needs_review':
      return (
        <Badge variant="warning" title="Discrepancy reported in dates or eligibility">
          <AlertCircle className="w-3 h-3 text-amber-600" />
          Needs Review
        </Badge>
      );
    case 'expired':
      return (
        <Badge variant="default" title="Opportunity deadline has concluded">
          <Clock className="w-3 h-3 text-slate-500" />
          Concluded
        </Badge>
      );
    case 'rejected':
      return (
        <Badge variant="danger" title="Rejected due to unverifiable criteria">
          <ShieldAlert className="w-3 h-3 text-rose-600" />
          Unverified
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" title="Public lead awaiting source confirmation">
          <HelpCircle className="w-3 h-3 text-slate-500" />
          Unverified Lead
        </Badge>
      );
  }
};
