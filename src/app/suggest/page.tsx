'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PlusCircle, Sparkles, Send, Check, ShieldCheck, ArrowRight, FileText } from 'lucide-react';
import { OpportunityCategory, ParticipationMode } from '@/lib/types';
import { Button } from '@/components/ui/Button';

export default function SuggestOpportunityPage() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<OpportunityCategory>('hackathon');
  const [organizationName, setOrganizationName] = useState('');
  const [registrationUrl, setRegistrationUrl] = useState('');
  const [officialSourceUrl, setOfficialSourceUrl] = useState('');
  const [mode, setMode] = useState<ParticipationMode>('online');
  const [contactEmail, setContactEmail] = useState('');
  const [description, setDescription] = useState('');
  const [rawNoticeText, setRawNoticeText] = useState('');

  // AI Extraction state
  const [isExtracting, setIsExtracting] = useState(false);
  const [aiMessage, setAiMessage] = useState<string | null>(null);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAiExtract = async () => {
    if (!rawNoticeText.trim() || rawNoticeText.length < 10) {
      alert('Please paste at least a few lines of circular or notice text.');
      return;
    }
    setIsExtracting(true);
    setAiMessage(null);
    try {
      const res = await fetch('/api/gemini/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: rawNoticeText })
      });
      const json = await res.json();
      if (json.success && json.data) {
        const d = json.data;
        if (d.title) setTitle(d.title);
        if (d.category) setCategory(d.category);
        if (d.organizationName) setOrganizationName(d.organizationName);
        if (d.mode) setMode(d.mode);
        if (d.summary) setDescription(d.summary);
        if (d.officialEmail) setContactEmail(d.officialEmail);
        setAiMessage(json.message || 'Notice structured successfully with Gemini intelligence!');
      } else {
        setAiMessage(json.error || 'Extraction completed with partial fields.');
      }
    } catch (e: any) {
      setAiMessage('Notice parsed in local demo mode.');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category,
          organizationName,
          registrationUrl,
          officialSourceUrl: officialSourceUrl || registrationUrl,
          mode,
          contactEmail,
          description,
          submitterType: 'student',
          eventDates: 'To be announced',
          registrationDeadline: new Date(Date.now() + 30 * 86400000).toISOString()
        })
      });

      const json = await res.json();
      if (json.success) {
        setSubmitted(true);
      } else {
        setErrorMessage(json.error || 'Failed to submit opportunity.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Connection error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200/80">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 uppercase tracking-wider mb-1">
          <PlusCircle className="w-3.5 h-3.5" />
          Community Sourced Opportunities
        </div>
        <h1 className="text-2xl font-extrabold text-navy-900">
          Suggest an Opportunity as a Student
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Spotted a great hackathon, scholarship, or contest on your college notice board or social media? Submit it here. All submissions enter a Pending Review queue before verification.
        </p>
      </div>

      {submitted ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <Check className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-navy-900">
            Thank you for contributing to OpenDoor!
          </h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            Your submission for <strong>"{title}"</strong> has been queued for verification by the OpenDoor verification desk. Once verified with official sources, it will appear publicly.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSubmitted(false);
                setTitle('');
                setDescription('');
                setRawNoticeText('');
              }}
            >
              Suggest Another Opportunity
            </Button>
            <Link href="/dashboard" className="inline-flex items-center gap-1 text-xs font-bold text-purple-600 hover:text-purple-800">
              Return to Dashboard <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-6">
          {/* AI Notice Auto-Fill Assistant */}
          <div className="bg-purple-50/70 border border-purple-200 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-purple-900 text-xs flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-600" />
                Gemini AI Quick-Fill from Circular / Notice Text
              </span>
            </div>
            <p className="text-[11px] text-purple-700 leading-relaxed">
              Have a WhatsApp text, PDF excerpt, or college circular? Paste it below and let Google Gemini automatically extract the structured details!
            </p>
            <textarea
              rows={3}
              value={rawNoticeText}
              onChange={(e) => setRawNoticeText(e.target.value)}
              placeholder="Paste notice text here..."
              className="w-full bg-white border border-purple-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <div className="flex items-center justify-between pt-1">
              {aiMessage ? (
                <span className="text-[11px] text-purple-800 font-medium">{aiMessage}</span>
              ) : <span />}
              <Button
                type="button"
                variant="primary"
                size="sm"
                isLoading={isExtracting}
                onClick={handleAiExtract}
                className="text-xs"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1" />
                Auto-Extract with Gemini
              </Button>
            </div>
          </div>

          {/* Manual Entry Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs text-slate-700">
            <div>
              <label className="font-semibold text-slate-800 block mb-1">Opportunity Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. AICTE National Coding Challenge 2026"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-slate-800 block mb-1">Opportunity Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as OpportunityCategory)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:bg-white"
                >
                  <option value="hackathon">Hackathon</option>
                  <option value="scholarship">Scholarship</option>
                  <option value="internship">Internship</option>
                  <option value="competition">Competition</option>
                  <option value="workshop">Workshop & Event</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-800 block mb-1">Participation Mode *</label>
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value as ParticipationMode)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:bg-white"
                >
                  <option value="online">100% Online (Virtual)</option>
                  <option value="offline">In-Person (Offline)</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-slate-800 block mb-1">Host / Organization Name *</label>
                <input
                  type="text"
                  required
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  placeholder="e.g. IIT Madras, Devfolio, AICTE"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:bg-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-800 block mb-1">Official Organizer Email *</label>
                <input
                  type="email"
                  required
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="Official public contact email"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-slate-800 block mb-1">Official Registration Link *</label>
                <input
                  type="url"
                  required
                  value={registrationUrl}
                  onChange={(e) => setRegistrationUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:bg-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-800 block mb-1">Official Source / Circular URL</label>
                <input
                  type="url"
                  value={officialSourceUrl}
                  onChange={(e) => setOfficialSourceUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-800 block mb-1">Brief Description / Eligibility Summary</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mention eligible courses, requirements, prizes, and key instructions..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:bg-white"
              />
            </div>

            {errorMessage && (
              <p className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-200">
                {errorMessage}
              </p>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <span className="text-[11px] text-slate-400">
                All submissions enter 'Pending Review' before being published.
              </span>
              <Button type="submit" variant="primary" size="md" isLoading={isSubmitting}>
                <Send className="w-3.5 h-3.5 mr-1.5" />
                Submit for Verification
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
