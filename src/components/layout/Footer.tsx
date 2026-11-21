import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Sparkles, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200/90 text-xs text-slate-500 py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Brand statement */}
        <div className="space-y-3 md:col-span-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center text-white font-extrabold text-xs shadow-sm">
              O
            </div>
            <span className="font-bold text-navy-900 text-sm">OpenDoor</span>
          </div>
          <p className="text-slate-600 leading-relaxed text-xs">
            Open-source student opportunity intelligence platform. Discover genuine hackathons, scholarships, internships, and academic grants across India.
          </p>
          <div className="flex items-center gap-2 pt-1 text-[11px] text-purple-700 font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            Built for Google Gemini Hackathon 2026
          </div>
        </div>

        {/* Opportunity Sections */}
        <div>
          <h4 className="font-bold text-navy-900 text-xs uppercase tracking-wider mb-3">
            Opportunities
          </h4>
          <ul className="space-y-2">
            <li><Link href="/hackathons" className="hover:text-purple-600 transition-colors">National Hackathons</Link></li>
            <li><Link href="/hackathons/online" className="hover:text-purple-600 transition-colors">Online & Virtual Hackathons</Link></li>
            <li><Link href="/scholarships" className="hover:text-purple-600 transition-colors">Government & Private Scholarships</Link></li>
            <li><Link href="/internships" className="hover:text-purple-600 transition-colors">Research & Tech Internships</Link></li>
            <li><Link href="/competitions" className="hover:text-purple-600 transition-colors">Student Competitions</Link></li>
            <li><Link href="/workshops" className="hover:text-purple-600 transition-colors">Technical Workshops & Events</Link></li>
          </ul>
        </div>

        {/* Tools & Resources */}
        <div>
          <h4 className="font-bold text-navy-900 text-xs uppercase tracking-wider mb-3">
            Student Tools
          </h4>
          <ul className="space-y-2">
            <li><Link href="/calendar" className="hover:text-purple-600 transition-colors">Opportunity Calendar & ICS Export</Link></li>
            <li><Link href="/applications" className="hover:text-purple-600 transition-colors">Student Application Tracker</Link></li>
            <li><Link href="/colleges" className="hover:text-purple-600 transition-colors">Pan-India College Directory</Link></li>
            <li><Link href="/for-you" className="hover:text-purple-600 transition-colors">AI Eligibility Explainer</Link></li>
            <li><Link href="/suggest" className="hover:text-purple-600 transition-colors">Suggest an Opportunity</Link></li>
            <li><Link href="/organizer" className="hover:text-purple-600 transition-colors">Organizer Submission Portal</Link></li>
          </ul>
        </div>

        {/* Data Provenance & Ethics */}
        <div>
          <h4 className="font-bold text-navy-900 text-xs uppercase tracking-wider mb-3">
            Data Quality & Ethics
          </h4>
          <p className="text-slate-500 leading-relaxed mb-3 text-[11px]">
            OpenDoor strictly enforces source provenance. Organizer contacts are never fabricated or guessed via AI. Only verified official contacts are published.
          </p>
          <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/60 text-[11px] font-medium">
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            Verified Source Protection Policy
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
        <div>
          © 2026 OpenDoor Project. Released under MIT Open-Source License.
        </div>
        <div className="flex items-center gap-4">
          <Link href="/settings" className="hover:text-purple-600">Privacy & Settings</Link>
          <Link href="/admin" className="hover:text-purple-600">Admin Console</Link>
          <span>Free for every Indian college student</span>
        </div>
      </div>
    </footer>
  );
};
