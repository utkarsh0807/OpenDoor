'use client';

import React, { useState } from 'react';
import { Mail, Phone, Globe, ExternalLink, AlertOctagon, Send, Copy, Check, User } from 'lucide-react';
import { OrganizerContact, Opportunity } from '@/lib/types';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { generateOrganizerEnquiry } from '@/lib/utils';

interface OrganizerContactCardProps {
  opportunity: Opportunity;
  onReportIssue?: (type: string) => void;
}

export const OrganizerContactCard: React.FC<OrganizerContactCardProps> = ({
  opportunity,
  onReportIssue
}) => {
  const contact = opportunity.organizer;
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [reportSent, setReportSent] = useState(false);

  const enquiry = generateOrganizerEnquiry(opportunity);

  const handleCopyDraft = () => {
    navigator.clipboard.writeText(`Subject: ${enquiry.subject}\n\n${enquiry.body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReport = () => {
    setReportSent(true);
    if (onReportIssue) onReportIssue('incorrect_contact');
    setTimeout(() => setReportSent(false), 3000);
  };

  return (
    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="text-sm font-semibold text-navy-900">
            {contact.organizationName}
          </h4>
          <p className="text-xs text-slate-500">
            Organizer: {contact.organizerName}
          </p>
        </div>
        {contact.isPubliclyAvailable ? (
          <span className="text-[11px] font-medium text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">
            Public Official Contact
          </span>
        ) : (
          <span className="text-[11px] font-medium text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded">
            Unlisted Contact
          </span>
        )}
      </div>

      {/* Details List */}
      <div className="space-y-2 text-xs text-slate-600 mb-4">
        {contact.contactPerson && (
          <div className="flex items-center gap-2">
            <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Contact Person: <strong className="text-slate-700">{contact.contactPerson}</strong></span>
          </div>
        )}

        {contact.officialEmail ? (
          <div className="flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <a 
              href={`mailto:${contact.officialEmail}`} 
              className="text-purple-600 hover:text-purple-700 font-medium hover:underline"
            >
              {contact.officialEmail}
            </a>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-slate-400 italic">
            <Mail className="w-3.5 h-3.5 shrink-0" />
            <span>Organizer contact email not publicly available</span>
          </div>
        )}

        {contact.officialPhone ? (
          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <a 
              href={`tel:${contact.officialPhone}`} 
              className="text-slate-700 hover:text-purple-600 font-medium"
            >
              {contact.officialPhone}
            </a>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-slate-400 italic">
            <Phone className="w-3.5 h-3.5 shrink-0" />
            <span>Public contact phone not available</span>
          </div>
        )}

        {contact.officialWebsite && (
          <div className="flex items-center gap-2">
            <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <a 
              href={contact.officialWebsite} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-purple-600 hover:underline flex items-center gap-1 font-medium"
            >
              Visit Official Website
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}
      </div>

      {/* Provenance note */}
      <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-400 mb-3">
        <span>Source: Verified Public Directory</span>
        <a 
          href={contact.provenanceUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:text-purple-600 underline"
        >
          View Source URL
        </a>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        {contact.officialEmail && (
          <a
            href={`mailto:${contact.officialEmail}?subject=${encodeURIComponent(enquiry.subject)}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg text-xs font-medium transition-colors"
          >
            <Mail className="w-3.5 h-3.5" />
            Email Organizer
          </a>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowEnquiryModal(true)}
          className="text-xs"
        >
          <Send className="w-3 h-3 mr-1" />
          Draft Enquiry
        </Button>

        <button
          onClick={handleReport}
          disabled={reportSent}
          className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-rose-600 ml-auto transition-colors"
          title="Report outdated or broken contact details"
        >
          <AlertOctagon className="w-3 h-3" />
          {reportSent ? 'Reported to Admin' : 'Report Contact'}
        </button>
      </div>

      {/* Enquiry Draft Modal */}
      <Modal
        isOpen={showEnquiryModal}
        onClose={() => setShowEnquiryModal(false)}
        title="Draft Organizer Enquiry"
        description="A polite enquiry template has been prepared. Personal details are protected."
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Subject</label>
            <input
              type="text"
              readOnly
              value={enquiry.subject}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Message Body</label>
            <textarea
              readOnly
              rows={8}
              value={enquiry.body}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 font-mono text-xs leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-slate-500">
              Copy this draft into your email client or webmail.
            </span>
            <Button size="sm" variant="primary" onClick={handleCopyDraft}>
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied to Clipboard' : 'Copy Draft'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
