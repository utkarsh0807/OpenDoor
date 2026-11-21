'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, CheckCircle, Clock, AlertTriangle, 
  RefreshCw, PlusCircle, Trash2, Eye, ShieldCheck, 
  Layers, ExternalLink, Check, X, ArrowUpRight,
  Database, Radio, Globe, Search
} from 'lucide-react';
import { INITIAL_OPPORTUNITIES } from '@/lib/data/initialOpportunities';
import { Opportunity, OpportunitySubmission, IngestJobLog, SourcePlatformInfo } from '@/lib/types';
import { PLATFORM_REGISTRY } from '@/lib/connectors/registry';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'connectors' | 'submissions' | 'opportunities' | 'ingest' | 'security'>('connectors');
  const [submissions, setSubmissions] = useState<OpportunitySubmission[]>([]);
  const [ingestLogs, setIngestLogs] = useState<IngestJobLog[]>([]);
  const [platforms, setPlatforms] = useState<SourcePlatformInfo[]>(PLATFORM_REGISTRY);
  const [platformCategoryFilter, setPlatformCategoryFilter] = useState<string>('all');
  const [platformSearch, setPlatformSearch] = useState<string>('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanningPlatformId, setScanningPlatformId] = useState<string | null>(null);
  const [scanMessage, setScanMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchSubmissions();
    fetchIngestLogs();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const res = await fetch('/api/submissions');
      const json = await res.json();
      if (json.success) setSubmissions(json.data);
    } catch (e) {
      console.warn('Failed to fetch submissions', e);
    }
  };

  const fetchIngestLogs = async () => {
    try {
      const res = await fetch('/api/ingest');
      const json = await res.json();
      if (json.success) {
        setIngestLogs(json.data);
        if (json.platforms) setPlatforms(json.platforms);
      }
    } catch (e) {
      console.warn('Failed to fetch ingest logs', e);
    }
  };

  const handleUpdateSubmission = async (id: string, action: 'approve' | 'reject') => {
    try {
      const res = await fetch('/api/submissions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submissionId: id, action })
      });
      const json = await res.json();
      if (json.success) {
        fetchSubmissions();
      }
    } catch {
      alert('Error updating submission state');
    }
  };

  const handleTriggerIngest = async (platformId?: string) => {
    if (platformId) {
      setScanningPlatformId(platformId);
    } else {
      setIsScanning(true);
    }
    setScanMessage(null);

    try {
      const res = await fetch('/api/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(platformId ? { platformId } : { source: 'All 32 Automated Connectors' })
      });
      const json = await res.json();
      if (json.success) {
        setScanMessage(json.message);
        if (json.platforms) setPlatforms(json.platforms);
        fetchIngestLogs();
      }
    } catch {
      setScanMessage('Failed to trigger scan');
    } finally {
      setIsScanning(false);
      setScanningPlatformId(null);
    }
  };

  // Metrics
  const totalOpps = INITIAL_OPPORTUNITIES.length;
  const verifiedCount = INITIAL_OPPORTUNITIES.filter(o => o.verificationStatus === 'verified').length;
  const pendingSubmissions = submissions.filter(s => s.status === 'pending_review').length;
  const activeConnectorsCount = platforms.filter(p => p.status === 'active').length;

  const filteredPlatforms = platforms.filter(p => {
    const matchesCategory = platformCategoryFilter === 'all' || p.category === platformCategoryFilter;
    const matchesSearch = !platformSearch || 
      p.name.toLowerCase().includes(platformSearch.toLowerCase()) || 
      p.description.toLowerCase().includes(platformSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 uppercase tracking-wider mb-1">
            <ShieldAlert className="w-3.5 h-3.5" />
            Verification & Platform Intelligence Desk
          </div>
          <h1 className="text-2xl font-extrabold text-navy-900">
            OpenDoor Administrator Console
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage 32 automated multi-source connectors, review organizer submissions, audit dates and venues, and monitor discrepancies.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          isLoading={isScanning}
          onClick={() => handleTriggerIngest()}
          className="self-start sm:self-auto text-xs bg-purple-600 hover:bg-purple-700"
        >
          <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
          Scan All 32 Connectors
        </Button>
      </div>

      {scanMessage && (
        <div className="p-3 bg-purple-50 border border-purple-200 text-purple-900 text-xs rounded-xl flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            {scanMessage}
          </span>
          <button onClick={() => setScanMessage(null)} className="text-purple-400 hover:text-purple-600">×</button>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 block mb-1">Platform Connectors</span>
          <span className="text-xl font-black text-indigo-600">{platforms.length}</span>
          <span className="text-[11px] text-slate-400 block mt-1">{activeConnectorsCount} active crawlers</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 block mb-1">Catalog Opportunities</span>
          <span className="text-xl font-black text-navy-900">{totalOpps}</span>
          <span className="text-[11px] text-slate-400 block mt-1">Live directory</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 block mb-1">Verified Sources</span>
          <span className="text-xl font-black text-emerald-600">{verifiedCount}</span>
          <span className="text-[11px] text-slate-400 block mt-1">100% official check</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 block mb-1">Pending Submissions</span>
          <span className="text-xl font-black text-amber-600">{pendingSubmissions}</span>
          <span className="text-[11px] text-slate-400 block mt-1">Queued for review</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs overflow-x-auto">
        <button
          onClick={() => setActiveTab('connectors')}
          className={`px-3.5 py-1.5 rounded-xl font-bold transition-all shrink-0 ${
            activeTab === 'connectors' ? 'bg-purple-600 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Connectors ({platforms.length})
        </button>
        <button
          onClick={() => setActiveTab('submissions')}
          className={`px-3.5 py-1.5 rounded-xl font-bold transition-all shrink-0 ${
            activeTab === 'submissions' ? 'bg-purple-600 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Review Submissions ({submissions.length})
        </button>
        <button
          onClick={() => setActiveTab('opportunities')}
          className={`px-3.5 py-1.5 rounded-xl font-bold transition-all shrink-0 ${
            activeTab === 'opportunities' ? 'bg-purple-600 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Catalog Audit & Provenance
        </button>
        <button
          onClick={() => setActiveTab('ingest')}
          className={`px-3.5 py-1.5 rounded-xl font-bold transition-all shrink-0 ${
            activeTab === 'ingest' ? 'bg-purple-600 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Scan Logs ({ingestLogs.length})
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`px-3.5 py-1.5 rounded-xl font-bold transition-all shrink-0 ${
            activeTab === 'security' ? 'bg-purple-600 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Role & RLS Security
        </button>
      </div>

      {/* Tab 0: 32 Automated Connectors Grid */}
      {activeTab === 'connectors' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-4 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-navy-900 text-sm flex items-center gap-2">
                <Radio className="w-4 h-4 text-purple-600 animate-pulse" />
                32 Automated Platform Discovery Connectors
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Aggregating Hackathons, Scholarships, Internships, Academic Programs, and Vetted Student Gigs.
              </p>
            </div>

            {/* Filter and Search */}
            <div className="flex items-center gap-2">
              <select
                value={platformCategoryFilter}
                onChange={(e) => setPlatformCategoryFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 text-xs focus:bg-white"
              >
                <option value="all">All Categories</option>
                <option value="hackathons">Hackathons & Coding</option>
                <option value="scholarships">Scholarships</option>
                <option value="internships">Internships & Open Source</option>
                <option value="academic">Academic & Leadership</option>
                <option value="freelance">Freelance Gigs</option>
              </select>

              <input
                type="text"
                placeholder="Search connector..."
                value={platformSearch}
                onChange={(e) => setPlatformSearch(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 text-xs w-36 focus:w-48 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredPlatforms.map((p) => (
              <div 
                key={p.id}
                className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-all flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-navy-900 text-xs leading-snug">{p.name}</span>
                    <Badge variant={p.status === 'active' ? 'success' : p.status === 'partial' ? 'warning' : 'default'}>
                      {p.status}
                    </Badge>
                  </div>
                  <p className="text-slate-500 text-[11px] line-clamp-2 leading-relaxed">
                    {p.description}
                  </p>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Method: {p.discoveryMethod}
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-medium">
                    {p.itemsDiscoveredCount} items indexed
                  </span>

                  <div className="flex items-center gap-1.5">
                    <a
                      href={p.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 text-slate-400 hover:text-purple-600 transition-colors"
                      title="Visit official portal"
                    >
                      <Globe className="w-3.5 h-3.5" />
                    </a>
                    <button
                      onClick={() => handleTriggerIngest(p.id)}
                      disabled={scanningPlatformId === p.id}
                      className="px-2 py-1 bg-white hover:bg-purple-50 text-purple-700 border border-purple-200 rounded font-semibold text-[10px] inline-flex items-center gap-1 transition-colors"
                    >
                      {scanningPlatformId === p.id ? (
                        <RefreshCw className="w-3 h-3 animate-spin" />
                      ) : (
                        <RefreshCw className="w-3 h-3" />
                      )}
                      Scan
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 1: Submissions Queue */}
      {activeTab === 'submissions' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-4 text-xs">
          <h3 className="font-bold text-navy-900 text-sm">Opportunity Submissions Awaiting Approval</h3>

          {submissions.length === 0 ? (
            <p className="text-slate-400 py-6 text-center">No submissions currently pending review.</p>
          ) : (
            <div className="space-y-3">
              {submissions.map((sub) => (
                <div
                  key={sub.id}
                  className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-navy-900 text-sm">{sub.title}</span>
                      <Badge variant={sub.status === 'approved' ? 'success' : sub.status === 'rejected' ? 'danger' : 'warning'}>
                        {sub.status.toUpperCase()}
                      </Badge>
                      <span className="text-[11px] text-slate-400">By {sub.submitterType}</span>
                    </div>

                    <p className="text-slate-600">
                      Organization: <strong>{sub.organizationName}</strong> • Category: {sub.category}
                    </p>
                    <p className="text-slate-500 text-[11px]">
                      Contact: {sub.contactEmail} {sub.contactPhone ? `(${sub.contactPhone})` : ''}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    {sub.status === 'pending_review' && (
                      <>
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => handleUpdateSubmission(sub.id, 'approve')}
                          className="bg-emerald-600 hover:bg-emerald-700"
                        >
                          <Check className="w-3.5 h-3.5 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleUpdateSubmission(sub.id, 'reject')}
                        >
                          <X className="w-3.5 h-3.5 mr-1" />
                          Reject
                        </Button>
                      </>
                    )}
                    <a
                      href={sub.registrationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-slate-400 hover:text-purple-600"
                      title="Inspect registration URL"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Catalog Audit */}
      {activeTab === 'opportunities' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-4 text-xs">
          <h3 className="font-bold text-navy-900 text-sm">Production Catalog Provenance Audit</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 text-[11px] uppercase tracking-wider">
                  <th className="pb-2">Title</th>
                  <th className="pb-2">Category</th>
                  <th className="pb-2">Platform</th>
                  <th className="pb-2">Event City / State</th>
                  <th className="pb-2">Verification</th>
                  <th className="pb-2">Last Checked</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {INITIAL_OPPORTUNITIES.map(opp => (
                  <tr key={opp.id} className="hover:bg-slate-50/80">
                    <td className="py-2.5 font-semibold text-navy-900 pr-2 max-w-[200px] truncate" title={opp.title}>
                      {opp.title}
                    </td>
                    <td className="py-2.5 capitalize">{opp.category}</td>
                    <td className="py-2.5 font-medium text-purple-700">{opp.sourcePlatform || 'Direct Host'}</td>
                    <td className="py-2.5">
                      {opp.mode === 'online' ? (
                        <span className="text-emerald-700 font-medium">Online (All India)</span>
                      ) : (
                        <span>{opp.eventCity || 'Not confirmed'}, {opp.eventState || ''}</span>
                      )}
                    </td>
                    <td className="py-2.5">
                      <Badge variant={opp.verificationStatus === 'verified' ? 'success' : 'default'}>
                        {opp.verificationStatus}
                      </Badge>
                    </td>
                    <td className="py-2.5 text-slate-400 text-[11px]">
                      {formatDate(opp.lastCheckedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Discovery Scan Logs */}
      {activeTab === 'ingest' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-4 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-bold text-navy-900 text-sm">Automated Feed Synchronization History</h3>
            <span className="text-slate-400 text-[11px]">{ingestLogs.length} Scans Executed</span>
          </div>

          <div className="space-y-3">
            {ingestLogs.map(log => (
              <div key={log.id} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-navy-900">{log.sourceName}</span>
                  <Badge variant="success">{log.status.toUpperCase()}</Badge>
                </div>
                <p className="text-slate-600">{log.details}</p>
                <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                  <span>Found: {log.recordsFound}</span>
                  <span>Ingested: {log.recordsIngested}</span>
                  <span>Conflicts: {log.conflictsDetected}</span>
                  <span>Run at: {formatDate(log.runAt)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Security & RLS */}
      {activeTab === 'security' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-4 text-xs text-slate-700">
          <h3 className="font-bold text-navy-900 text-sm">Administrator Role & Row Level Security (RLS)</h3>
          <p className="text-slate-600 leading-relaxed">
            OpenDoor strictly prevents unauthorized administrative modifications through Supabase PostgreSQL Row Level Security (RLS) policies. Public visitors and students can only view published opportunities and manage their own private profiles.
          </p>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 font-mono text-[11px]">
            <span className="font-bold text-slate-800 block">How to assign an Administrator Role locally in Supabase:</span>
            <p className="text-purple-700">
              INSERT INTO public.administrator_roles (user_id, role_level) <br />
              VALUES ('YOUR_SUPABASE_AUTH_USER_UUID', 'superadmin');
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
