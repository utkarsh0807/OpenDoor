'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  ShieldCheck, 
  Send, 
  Check, 
  AlertCircle, 
  FileText, 
  ArrowRight,
  Image as ImageIcon,
  Video,
  FileCheck2,
  MapPin
} from 'lucide-react';
import { OpportunityCategory, ParticipationMode, DocumentRequirement, MediaAssets } from '@/lib/types';
import { Button } from '@/components/ui/Button';

export default function OrganizerPortalPage() {
  const [tab, setTab] = useState<'submit' | 'correction'>('submit');

  // Submit form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<OpportunityCategory>('hackathon');
  const [orgName, setOrgName] = useState('');
  const [mode, setMode] = useState<ParticipationMode>('hybrid');
  const [regUrl, setRegUrl] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  
  // Strict Event Location Separation
  const [eventCity, setEventCity] = useState('');
  const [eventState, setEventState] = useState('');
  const [eventVenue, setEventVenue] = useState('');
  const [organizerCity, setOrganizerCity] = useState('');

  const [eventDates, setEventDates] = useState('');
  const [deadline, setDeadline] = useState('');
  const [fee, setFee] = useState('0');
  const [prizes, setPrizes] = useState('');
  const [desc, setDesc] = useState('');

  // Rich Media Assets (Part 5)
  const [posterUrl, setPosterUrl] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [galleryImages, setGalleryImages] = useState('');

  // Required Documents (Part 4)
  const [requiresBonafide, setRequiresBonafide] = useState(true);
  const [requiresIdCard, setRequiresIdCard] = useState(true);
  const [requiresIncomeCert, setRequiresIncomeCert] = useState(false);
  const [requiresDomicile, setRequiresDomicile] = useState(false);
  const [requiresProposal, setRequiresProposal] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Correction state
  const [oppTitle, setOppTitle] = useState('');
  const [correctionDetails, setCorrectionDetails] = useState('');
  const [correctionSuccess, setCorrectionSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const docRequirements: DocumentRequirement[] = [];
    if (requiresIdCard) {
      docRequirements.push({
        id: 'doc-college-id',
        name: 'College ID Card',
        requirementTier: 'required',
        whoNeedsIt: 'All registered team members',
        whenRequired: 'At check-in / preliminary screening',
        explanation: 'Proof of active student status'
      });
    }
    if (requiresBonafide) {
      docRequirements.push({
        id: 'doc-bonafide',
        name: 'College Bonafide / NOC',
        requirementTier: 'required',
        whoNeedsIt: 'College participants representing their institution',
        whenRequired: 'Before final shortlisted round',
        explanation: 'Official institutional authorization'
      });
    }
    if (requiresProposal) {
      docRequirements.push({
        id: 'doc-proposal',
        name: 'Project Abstract / PPT',
        requirementTier: 'required',
        whoNeedsIt: 'Team Leader',
        whenRequired: 'During Round 1 Idea Submission',
        explanation: 'Technical evaluation by mentor panel'
      });
    }
    if (requiresIncomeCert) {
      docRequirements.push({
        id: 'doc-income',
        name: 'Family Income Certificate (Tahsildar)',
        requirementTier: 'conditional',
        whoNeedsIt: 'Applicants seeking financial need grants / travel support',
        whenRequired: 'During application review',
        explanation: 'Verification of family income cap'
      });
    }
    if (requiresDomicile) {
      docRequirements.push({
        id: 'doc-domicile',
        name: 'State Domicile Certificate',
        requirementTier: 'conditional',
        whoNeedsIt: 'Students claiming state-specific quota',
        whenRequired: 'During application review',
        explanation: 'Proof of state residency'
      });
    }

    const media: MediaAssets = {
      posterUrl: posterUrl.trim() || undefined,
      bannerUrl: bannerUrl.trim() || undefined,
      videoUrl: videoUrl.trim() || undefined,
      galleryImages: galleryImages ? galleryImages.split(',').map(s => s.trim()).filter(Boolean) : []
    };

    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category,
          organizationName: orgName,
          registrationUrl: regUrl,
          officialSourceUrl: sourceUrl || regUrl,
          mode,
          city: mode !== 'online' ? eventCity || null : null,
          state: mode !== 'online' ? eventState || null : null,
          eventVenue: mode !== 'online' ? eventVenue || null : null,
          eventDates: eventDates || 'Dates confirmed upon registration',
          registrationDeadline: deadline ? new Date(deadline).toISOString() : new Date(Date.now() + 30 * 86400000).toISOString(),
          description: `${desc}\n\nBenefits/Prizes: ${prizes || 'None specified'}\nRegistration Fee: ₹${fee}`,
          contactEmail,
          contactPhone: contactPhone || null,
          submitterType: 'organizer',
          media,
          documentRequirements: docRequirements
        })
      });
      const json = await res.json();
      if (json.success) {
        setSuccess(true);
      } else {
        alert(json.error || 'Submission failed');
      }
    } catch {
      alert('Error connecting to submission service');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCorrectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCorrectionSuccess(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200/80">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 uppercase tracking-wider mb-1">
          <Building2 className="w-3.5 h-3.5" />
          Official Organizer Services
        </div>
        <h1 className="text-2xl font-extrabold text-navy-900">
          Organizer Portal & Event Submission
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Host college hackathons, competitions, or scholarships? Submit official circulars, media trailers, poster graphics, or request updates to existing directory listings.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs">
        <button
          onClick={() => setTab('submit')}
          className={`px-4 py-2 rounded-xl font-bold transition-all ${
            tab === 'submit' ? 'bg-purple-600 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Publish an Opportunity (Official)
        </button>
        <button
          onClick={() => setTab('correction')}
          className={`px-4 py-2 rounded-xl font-bold transition-all ${
            tab === 'correction' ? 'bg-purple-600 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Request Listing Correction / Update
        </button>
      </div>

      {tab === 'submit' ? (
        success ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-navy-900">
              Organizer Submission Registered!
            </h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              Your official listing for <strong>"{title}"</strong> has been queued for verification with rich media assets and document criteria. Our review team verifies official circular URLs and contact credentials before public verification badges are assigned.
            </p>
            <div className="pt-2">
              <Button size="sm" variant="outline" onClick={() => setSuccess(false)}>
                Submit Another Event
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-5 text-xs text-slate-700">
            {/* Core Details */}
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-navy-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                <Building2 className="w-4 h-4 text-purple-600" />
                1. Core Event & Organization Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-800 block mb-1">Official Event Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Apex National Hackathon 2026"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-800 block mb-1">Organization / College Name *</label>
                  <input
                    type="text"
                    required
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    placeholder="e.g. VNIT Nagpur / ACM Student Chapter"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-semibold text-slate-800 block mb-1">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as OpportunityCategory)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:bg-white"
                  >
                    <option value="hackathon">Hackathon</option>
                    <option value="scholarship">Scholarship</option>
                    <option value="internship">Internship</option>
                    <option value="competition">Competition</option>
                    <option value="workshop">Workshop</option>
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
                    <option value="offline">In-Person (Physical Offline)</option>
                    <option value="hybrid">Hybrid (Online + Physical Venue)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-800 block mb-1">Registration Fee (INR) *</label>
                  <input
                    type="number"
                    min="0"
                    value={fee}
                    onChange={(e) => setFee(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Strict Event Location Section */}
            {mode !== 'online' && (
              <div className="space-y-4 pt-3 border-t border-slate-100">
                <h3 className="font-bold text-sm text-navy-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                  <MapPin className="w-4 h-4 text-rose-500" />
                  2. Physical Event Location (Distinguished from Organizer HQ)
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="font-semibold text-slate-800 block mb-1">Event City *</label>
                    <input
                      type="text"
                      required
                      value={eventCity}
                      onChange={(e) => setEventCity(e.target.value)}
                      placeholder="e.g. Nagpur"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-800 block mb-1">Event State *</label>
                    <input
                      type="text"
                      required
                      value={eventState}
                      onChange={(e) => setEventState(e.target.value)}
                      placeholder="e.g. Maharashtra"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-800 block mb-1">Specific Venue / Auditorium *</label>
                    <input
                      type="text"
                      required
                      value={eventVenue}
                      onChange={(e) => setEventVenue(e.target.value)}
                      placeholder="e.g. Department of CSE Auditorium, Campus"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:bg-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Media Assets (Part 5) */}
            <div className="space-y-4 pt-3 border-t border-slate-100">
              <h3 className="font-bold text-sm text-navy-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                <ImageIcon className="w-4 h-4 text-indigo-600" />
                3. Photos, Posters & Video Discovery (Media Assets)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-800 block mb-1">Official Poster Graphic URL</label>
                  <input
                    type="url"
                    value={posterUrl}
                    onChange={(e) => setPosterUrl(e.target.value)}
                    placeholder="https://.../poster.jpg"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:bg-white"
                  />
                  <span className="text-[10px] text-slate-400">High-res vertical flyer or promotional poster</span>
                </div>

                <div>
                  <label className="font-semibold text-slate-800 block mb-1">YouTube / Vimeo Video URL</label>
                  <input
                    type="url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:bg-white"
                  />
                  <span className="text-[10px] text-slate-400">Teaser trailer, rules walkthrough, or past edition recap</span>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-800 block mb-1">Event Photo Gallery URLs (Comma separated)</label>
                <input
                  type="text"
                  value={galleryImages}
                  onChange={(e) => setGalleryImages(e.target.value)}
                  placeholder="https://.../img1.jpg, https://.../img2.jpg"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:bg-white"
                />
              </div>
            </div>

            {/* Document Requirements (Part 4) */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <h3 className="font-bold text-sm text-navy-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                <FileCheck2 className="w-4 h-4 text-emerald-600" />
                4. Required Document Intelligence
              </h3>
              <p className="text-[11px] text-slate-500">
                Select documents that applicants will be asked to present or upload:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                <label className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-100">
                  <input
                    type="checkbox"
                    checked={requiresIdCard}
                    onChange={(e) => setRequiresIdCard(e.target.checked)}
                    className="rounded text-purple-600 focus:ring-purple-500"
                  />
                  <span>College ID Card</span>
                </label>

                <label className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-100">
                  <input
                    type="checkbox"
                    checked={requiresBonafide}
                    onChange={(e) => setRequiresBonafide(e.target.checked)}
                    className="rounded text-purple-600 focus:ring-purple-500"
                  />
                  <span>College Bonafide / NOC</span>
                </label>

                <label className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-100">
                  <input
                    type="checkbox"
                    checked={requiresProposal}
                    onChange={(e) => setRequiresProposal(e.target.checked)}
                    className="rounded text-purple-600 focus:ring-purple-500"
                  />
                  <span>Project Proposal / PPT</span>
                </label>

                <label className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-100">
                  <input
                    type="checkbox"
                    checked={requiresIncomeCert}
                    onChange={(e) => setRequiresIncomeCert(e.target.checked)}
                    className="rounded text-purple-600 focus:ring-purple-500"
                  />
                  <span>Income Certificate (Tahsildar)</span>
                </label>

                <label className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-100">
                  <input
                    type="checkbox"
                    checked={requiresDomicile}
                    onChange={(e) => setRequiresDomicile(e.target.checked)}
                    className="rounded text-purple-600 focus:ring-purple-500"
                  />
                  <span>State Domicile Certificate</span>
                </label>
              </div>
            </div>

            {/* Dates & Contacts */}
            <div className="space-y-4 pt-3 border-t border-slate-100">
              <h3 className="font-bold text-sm text-navy-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                <FileText className="w-4 h-4 text-purple-600" />
                5. Deadlines, Portal Links & Verified Contacts
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-800 block mb-1">Registration Cutoff Deadline *</label>
                  <input
                    type="date"
                    required
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-800 block mb-1">Event Execution Dates *</label>
                  <input
                    type="text"
                    required
                    value={eventDates}
                    onChange={(e) => setEventDates(e.target.value)}
                    placeholder="e.g. 15 Jan 2027 to 17 Jan 2027"
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
                    value={regUrl}
                    onChange={(e) => setRegUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-800 block mb-1">Official Circular / Host Website URL *</label>
                  <input
                    type="url"
                    required
                    value={sourceUrl}
                    onChange={(e) => setSourceUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-800 block mb-1">Public Organizer Support Email *</label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="e.g. hackathon@college.edu.in"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-800 block mb-1">Public Support Phone (Optional)</label>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+91..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-800 block mb-1">Full Description, Problem Statements & Eligibility *</label>
                <textarea
                  rows={4}
                  required
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Include eligibility criteria, team size requirements, problem statements, and cash prizes..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:bg-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <Button type="submit" variant="primary" size="md" isLoading={isSubmitting}>
                <Send className="w-3.5 h-3.5 mr-1.5" />
                Submit Opportunity for Verification
              </Button>
            </div>
          </form>
        )
      ) : (
        /* Correction form */
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-4 text-xs text-slate-700">
          {correctionSuccess ? (
            <div className="p-6 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <Check className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-navy-900 text-sm">Correction Ticket Logged</h3>
              <p className="text-slate-500">Our administrative desk will cross-check with original sources and update the listing.</p>
              <Button size="sm" variant="outline" onClick={() => setCorrectionSuccess(false)}>
                Submit Another Request
              </Button>
            </div>
          ) : (
            <form onSubmit={handleCorrectionSubmit} className="space-y-4">
              <div>
                <label className="font-semibold text-slate-800 block mb-1">Opportunity Title or URL *</label>
                <input
                  type="text"
                  required
                  value={oppTitle}
                  onChange={(e) => setOppTitle(e.target.value)}
                  placeholder="e.g. Smart India Hackathon or exact link"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:bg-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-800 block mb-1">Correction Details *</label>
                <textarea
                  rows={4}
                  required
                  value={correctionDetails}
                  onChange={(e) => setCorrectionDetails(e.target.value)}
                  placeholder="Describe the discrepancy (e.g. deadline extended to Jan 15th, new circular link: https://...)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end pt-2">
                <Button type="submit" variant="primary" size="sm">
                  Submit Correction Request
                </Button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
