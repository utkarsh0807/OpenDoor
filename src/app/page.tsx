'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, Search, ArrowRight, ShieldCheck, Globe, 
  MapPin, Terminal, Award, Briefcase, Trophy, 
  BookOpen, CheckCircle2, Building, Users, ExternalLink, Bookmark 
} from 'lucide-react';
import { INITIAL_OPPORTUNITIES } from '@/lib/data/initialOpportunities';
import { OpportunityCard } from '@/components/opportunities/OpportunityCard';
import { OpportunityDetailModal } from '@/components/opportunities/OpportunityDetailModal';
import { ApplicationModal } from '@/components/tracker/ApplicationModal';
import { Opportunity } from '@/lib/types';
import { Button } from '@/components/ui/Button';

export default function LandingPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);
  const [trackingOpp, setTrackingOpp] = useState<Opportunity | null>(null);

  const featuredOpps = INITIAL_OPPORTUNITIES.slice(0, 3);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/explore');
    }
  };

  return (
    <div className="bg-white">
      {/* Top Public Header */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center text-white font-black shadow-md shadow-purple-200">
              O
            </div>
            <div>
              <span className="font-extrabold text-navy-900 tracking-tight text-base block leading-none">
                ChanceDeck
              </span>
              <span className="text-[10px] font-semibold text-purple-600 tracking-wider uppercase">
                Student Opportunity Intel
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
            <Link href="/hackathons" className="hover:text-purple-600 transition-colors">Hackathons</Link>
            <Link href="/scholarships" className="hover:text-purple-600 transition-colors">Scholarships</Link>
            <Link href="/internships" className="hover:text-purple-600 transition-colors">Internships</Link>
            <Link href="/colleges" className="hover:text-purple-600 transition-colors">Colleges</Link>
            <Link href="/organizer" className="hover:text-purple-600 transition-colors">Organizer Portal</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-semibold hover:bg-purple-700 transition-all shadow-sm shadow-purple-200"
            >
              Open Dashboard
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-purple-50/40 via-white to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          {/* Hackathon Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100/70 border border-purple-200/60 text-purple-800 text-xs font-semibold mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>Google Gemini Hackathon 2026 Student Project</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-navy-950 tracking-tight max-w-4xl mx-auto leading-tight mb-6">
            Discover Opportunities. <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600">
              Build Your Future.
            </span>
          </h1>

          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed mb-8">
            An open-source student opportunity intelligence platform for college students across India. 
            Discover genuine hackathons, government scholarships, research internships, and competitions in one unified, source-verified platform.
          </p>

          {/* Opportunity Search Box */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
            <div className="flex flex-col sm:flex-row items-center gap-2 p-1.5 bg-white rounded-2xl shadow-xl shadow-purple-900/5 border border-slate-200">
              <div className="flex items-center gap-2 px-3 flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Try 'AI Hackathon', 'Central Scholarship', 'ISRO Internship', or 'Pune'..."
                  className="w-full py-2.5 text-xs sm:text-sm text-navy-900 placeholder:text-slate-400 focus:outline-none"
                />
              </div>
              <Button type="submit" variant="primary" size="md" className="w-full sm:w-auto px-6">
                Explore Opportunities
              </Button>
            </div>
          </form>

          {/* Quick Category Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-400">Popular:</span>
            <Link href="/hackathons/online" className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-purple-50 hover:text-purple-700 transition-colors">
              Online Hackathons
            </Link>
            <Link href="/scholarships" className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-purple-50 hover:text-purple-700 transition-colors">
              National Scholarships (NSP / MahaDBT)
            </Link>
            <Link href="/internships" className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-purple-50 hover:text-purple-700 transition-colors">
              GSoC & ISRO Internships
            </Link>
            <Link href="/competitions" className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-purple-50 hover:text-purple-700 transition-colors">
              Tata Crucible
            </Link>
          </div>
        </div>
      </section>

      {/* Opportunity Category Cards */}
      <section className="py-16 bg-slate-50/60 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-purple-600 mb-2">
              Structured Discovery
            </h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-navy-900">
              Every Opportunity Type, Categorized & Verified
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              No more digging through cluttered PDFs, college notice boards, or WhatsApp groups.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Hackathons & Sprints",
                desc: "Discover virtual, in-person, and hybrid hackathons including SIH and Devfolio events.",
                icon: Terminal,
                href: "/hackathons",
                color: "text-purple-600 bg-purple-50",
                stats: "National & Regional"
              },
              {
                title: "Online Hackathons",
                desc: "100% remote hackathons you can join from any college or hostel room in India.",
                icon: Globe,
                href: "/hackathons/online",
                color: "text-blue-600 bg-blue-50",
                stats: "Zero Travel Required"
              },
              {
                title: "Scholarships & Grants",
                desc: "Central, State (NSP/MahaDBT), and private merit-cum-means grants with AI eligibility checker.",
                icon: Award,
                href: "/scholarships",
                color: "text-emerald-600 bg-emerald-50",
                stats: "Fee Concessions & DBT"
              },
              {
                title: "Internships & Fellowships",
                desc: "Research trainee roles at ISRO/DRDO, Google Summer of Code, and verified technical internships.",
                icon: Briefcase,
                href: "/internships",
                color: "text-indigo-600 bg-indigo-50",
                stats: "Verified Stipends Only"
              },
              {
                title: "Competitions & Quizzes",
                desc: "National coding challenges, business case competitions, and design sprints.",
                icon: Trophy,
                href: "/competitions",
                color: "text-amber-600 bg-amber-50",
                stats: "Cash Prizes & PPIs"
              },
              {
                title: "Workshops & Bootcamps",
                desc: "Hands-on technical workshops, AI masterclasses, and certified academic events.",
                icon: BookOpen,
                href: "/workshops",
                color: "text-rose-600 bg-rose-50",
                stats: "Skill Building & CME"
              }
            ].map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={idx}
                  href={cat.href}
                  className="bg-white rounded-2xl p-6 border border-slate-200/90 hover:border-purple-300 hover:shadow-lg transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${cat.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-semibold text-slate-400 bg-slate-50 px-2 py-0.5 rounded">
                        {cat.stats}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-navy-900 group-hover:text-purple-600 transition-colors mb-2">
                      {cat.title}
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed mb-4">
                      {cat.desc}
                    </p>
                  </div>
                  <div className="flex items-center text-xs font-semibold text-purple-600 group-hover:translate-x-1 transition-transform">
                    <span>Browse Listings</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Verified Opportunities */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-purple-600 mb-1">
                Verified Directory
              </h2>
              <h3 className="text-2xl font-extrabold text-navy-900">
                Featured National Opportunities
              </h3>
            </div>
            <Link
              href="/dashboard"
              className="text-xs font-bold text-purple-600 hover:text-purple-800 flex items-center gap-1"
            >
              View Full Dashboard <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredOpps.map((opp) => (
              <OpportunityCard
                key={opp.id}
                opportunity={opp}
                onOpenDetails={(o) => setSelectedOpp(o)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* How ChanceDeck Solves the Core Problem */}
      <section className="py-16 bg-navy-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
              The Architecture
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold mt-2 tracking-tight">
              Built Specifically for Indian College Students
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-3 leading-relaxed">
              We solve the 4 fundamental reasons students miss deadlines: scattered information, confusing eligibility, fake contacts, and lack of regional discovery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Student-Selected Region",
                desc: "No automatic geolocation or hardcoded cities. Pick 'All India', 'Online Only', or your specific city to tailor results."
              },
              {
                step: "02",
                title: "Zero Hallucinated Contacts",
                desc: "Strict anti-hallucination contact policies. If an organizer hasn't published an official public email, we state it honestly."
              },
              {
                step: "03",
                title: "Gemini AI Explanations",
                desc: "Our server-side Gemini integration analyzes complex government circulars and explains your exact eligibility in simple language."
              },
              {
                step: "04",
                title: "Deadline & App Tracker",
                desc: "Track status (Preparing, Applied, Selected), checklist items, and export event dates directly to Google or Apple Calendar (.ics)."
              }
            ].map((item, idx) => (
              <div key={idx} className="border border-slate-800 bg-slate-900/60 p-6 rounded-2xl relative">
                <span className="text-3xl font-black text-purple-500/30 mb-3 block">
                  {item.step}
                </span>
                <h4 className="text-sm font-bold text-white mb-2">{item.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Organizer & Community Call to Action */}
      <section className="py-16 bg-gradient-to-r from-purple-50 via-blue-50 to-indigo-50 border-t border-purple-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="w-12 h-12 bg-purple-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-200">
            <Building className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 mb-3">
            Are you organizing a College Hackathon or Event?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto mb-6 leading-relaxed">
            Reach thousands of college students across India for free. Submit your event or suggest opportunities to be verified by our review desk.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/organizer"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-purple-200 transition-all"
            >
              Organizer Submission Portal
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/suggest"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold text-xs rounded-xl shadow-sm transition-all"
            >
              Suggest an Opportunity as a Student
            </Link>
          </div>
        </div>
      </section>

      {/* Detail Modal */}
      <OpportunityDetailModal
        opportunity={selectedOpp}
        isOpen={Boolean(selectedOpp)}
        onClose={() => setSelectedOpp(null)}
        onTrackApplication={(opp) => {
          setSelectedOpp(null);
          setTrackingOpp(opp);
        }}
      />

      {/* Application Tracker Modal */}
      <ApplicationModal
        opportunity={trackingOpp}
        isOpen={Boolean(trackingOpp)}
        onClose={() => setTrackingOpp(null)}
      />
    </div>
  );
}
