'use client';

import React, { useState, useEffect } from 'react';
import { Building2, Search, PlusCircle, ExternalLink, ShieldCheck, MapPin, Check } from 'lucide-react';
import { INITIAL_COLLEGES } from '@/lib/data/initialColleges';
import { College, AcademicStream } from '@/lib/types';
import { INDIAN_STATES_AND_UTS, ACADEMIC_STREAMS } from '@/lib/constants';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/common/EmptyState';

export default function CollegesPage() {
  const [colleges, setColleges] = useState<College[]>(INITIAL_COLLEGES);
  const [searchQuery, setSearchQuery] = useState('');
  const [stateFilter, setStateFilter] = useState('all');
  const [streamFilter, setStreamFilter] = useState('all');

  // Suggest College Modal
  const [showSuggestModal, setShowSuggestModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('');
  const [newCategory, setNewCategory] = useState<AcademicStream>('Engineering');
  const [newWebsite, setNewWebsite] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const filteredColleges = colleges.filter(c => {
    if (stateFilter !== 'all' && c.state.toLowerCase() !== stateFilter.toLowerCase()) return false;
    if (streamFilter !== 'all' && c.category.toLowerCase() !== streamFilter.toLowerCase()) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = c.name.toLowerCase().includes(q) ||
        (c.shortName && c.shortName.toLowerCase().includes(q)) ||
        c.city.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleSuggestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newCity || !newState) return;

    const newCol: College = {
      id: `col-${Date.now()}`,
      name: newName,
      city: newCity,
      state: newState,
      category: newCategory,
      officialWebsite: newWebsite || null,
      verificationStatus: 'pending_review'
    };

    setColleges(prev => [newCol, ...prev]);
    setSubmitSuccess(true);
    setTimeout(() => {
      setSubmitSuccess(false);
      setShowSuggestModal(false);
      setNewName('');
      setNewCity('');
      setNewWebsite('');
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 uppercase tracking-wider mb-1">
            <Building2 className="w-3.5 h-3.5" />
            Pan-India Academic Institutions
          </div>
          <h1 className="text-2xl font-extrabold text-navy-900">
            College & University Directory
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Verified higher education institutions across Engineering, Science, Medical, Commerce, Polytechnic, Arts & Agriculture.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setShowSuggestModal(true)}
          className="self-start sm:self-auto"
        >
          <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
          Suggest a College
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm space-y-3 text-xs">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search college by name, short name (e.g. VNIT, IIT, COEP), or city..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-800"
            >
              <option value="all">All States</option>
              {INDIAN_STATES_AND_UTS.map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>

            <select
              value={streamFilter}
              onChange={(e) => setStreamFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-800"
            >
              <option value="all">All Disciplines</option>
              {ACADEMIC_STREAMS.map(str => (
                <option key={str} value={str}>{str}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* College Cards Grid */}
      {filteredColleges.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredColleges.map((col) => (
            <div
              key={col.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:border-purple-200 hover:shadow-md transition-all flex flex-col justify-between text-xs"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <Badge variant="purple">{col.category}</Badge>
                  {col.verificationStatus === 'verified' ? (
                    <Badge variant="success">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      Verified
                    </Badge>
                  ) : (
                    <Badge variant="warning">Pending Review</Badge>
                  )}
                </div>

                <h3 className="text-sm font-bold text-navy-900 mb-1 leading-snug">
                  {col.name}
                </h3>
                {col.shortName && (
                  <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded inline-block mb-3">
                    {col.shortName}
                  </span>
                )}

                <div className="space-y-1.5 text-slate-600 mb-4">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{col.city}, {col.state}</span>
                  </div>
                  {col.affiliation && (
                    <p className="text-[11px] text-slate-400">
                      Affiliation: {col.affiliation}
                    </p>
                  )}
                </div>
              </div>

              {col.officialWebsite && (
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <a
                    href={col.officialWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 hover:underline flex items-center gap-1 font-semibold text-[11px]"
                  >
                    Visit Official Portal
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          type="no_colleges"
          onAction={() => setShowSuggestModal(true)}
        />
      )}

      {/* Suggest College Modal */}
      <Modal
        isOpen={showSuggestModal}
        onClose={() => setShowSuggestModal(false)}
        title="Suggest an Institution for ChanceDeck Directory"
        description="Help us index colleges across all Indian states and districts."
      >
        {submitSuccess ? (
          <div className="p-6 text-center text-xs space-y-2">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <Check className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-navy-900 text-sm">Thank you for submitting!</h4>
            <p className="text-slate-500">Your suggestion has been placed in the admin review queue.</p>
          </div>
        ) : (
          <form onSubmit={handleSuggestSubmit} className="space-y-3 text-xs text-slate-700">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">College / University Full Name *</label>
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Government College of Engineering, Amravati"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">City *</label>
                <input
                  type="text"
                  required
                  value={newCity}
                  onChange={(e) => setNewCity(e.target.value)}
                  placeholder="e.g. Amravati"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">State *</label>
                <select
                  required
                  value={newState}
                  onChange={(e) => setNewState(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800"
                >
                  <option value="">Select State</option>
                  {INDIAN_STATES_AND_UTS.map(st => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Primary Academic Stream</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as AcademicStream)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800"
              >
                {ACADEMIC_STREAMS.map(str => (
                  <option key={str} value={str}>{str}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Official Website URL (Optional)</label>
              <input
                type="url"
                value={newWebsite}
                onChange={(e) => setNewWebsite(e.target.value)}
                placeholder="https://..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <Button type="button" variant="outline" size="sm" onClick={() => setShowSuggestModal(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Submit College Suggestion
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
