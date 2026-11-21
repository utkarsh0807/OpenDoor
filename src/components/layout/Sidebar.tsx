'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, Sparkles, Terminal, Globe, Award, Briefcase, 
  Trophy, BookOpen, Compass, Calendar, Bookmark, 
  CheckSquare, Building2, PlusCircle, ShieldAlert, 
  User, Settings, X, ChevronRight, HelpCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NAV_ITEMS = [
  { group: 'Overview', items: [
    { name: 'Home Dashboard', href: '/dashboard', icon: Home },
    { name: 'For You', href: '/for-you', icon: Sparkles, badge: 'AI Match' },
    { name: 'Explore All', href: '/explore', icon: Compass },
  ]},
  { group: 'Categories', items: [
    { name: 'Hackathons', href: '/hackathons', icon: Terminal },
    { name: 'Online Hackathons', href: '/hackathons/online', icon: Globe },
    { name: 'Scholarships', href: '/scholarships', icon: Award },
    { name: 'Internships', href: '/internships', icon: Briefcase },
    { name: 'Competitions', href: '/competitions', icon: Trophy },
    { name: 'Workshops & Events', href: '/workshops', icon: BookOpen },
  ]},
  { group: 'Tracker & Tools', items: [
    { name: 'Opportunity Calendar', href: '/calendar', icon: Calendar },
    { name: 'Saved Opportunities', href: '/saved', icon: Bookmark },
    { name: 'My Applications', href: '/applications', icon: CheckSquare },
    { name: 'College Directory', href: '/colleges', icon: Building2 },
  ]},
  { group: 'Community & Admin', items: [
    { name: 'Suggest an Opportunity', href: '/suggest', icon: PlusCircle },
    { name: 'Organizer Portal', href: '/organizer', icon: Building2 },
    { name: 'Admin Dashboard', href: '/admin', icon: ShieldAlert, badge: 'Staff' },
  ]},
  { group: 'Account', items: [
    { name: 'My Profile', href: '/profile', icon: User },
    { name: 'Settings', href: '/settings', icon: Settings },
  ]}
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-navy-950/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={cn(
          'fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200/90 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-100">
          <Link href="/" className="flex items-center gap-2.5" onClick={onClose}>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center text-white font-black shadow-md shadow-purple-200">
              O
            </div>
            <div>
              <span className="font-extrabold text-navy-900 tracking-tight text-base block leading-none">
                ChanceDeck
              </span>
              <span className="text-[10px] font-medium text-purple-600 tracking-wider uppercase">
                Student Intel
              </span>
            </div>
          </Link>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {NAV_ITEMS.map((section, idx) => (
            <div key={idx}>
              <h5 className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                {section.group}
              </h5>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        'flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group',
                        isActive
                          ? 'bg-purple-50 text-purple-700 font-semibold shadow-sm shadow-purple-50'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-navy-900'
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={cn(
                          'w-4 h-4 transition-colors',
                          isActive ? 'text-purple-600' : 'text-slate-400 group-hover:text-slate-600'
                        )} />
                        <span>{item.name}</span>
                      </div>

                      {item.badge && (
                        <span className={cn(
                          'text-[10px] px-1.5 py-0.2 rounded font-medium',
                          item.badge === 'AI Match' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'
                        )}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom guest status widget */}
        <div className="p-3 border-t border-slate-100">
          <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-xs">
                G
              </div>
              <div className="overflow-hidden">
                <span className="text-xs font-semibold text-navy-900 block truncate">
                  Guest Student
                </span>
                <span className="text-[10px] text-slate-400 block truncate">
                  Local Storage Active
                </span>
              </div>
            </div>
            <Link
              href="/profile"
              className="text-[11px] font-medium text-purple-600 hover:text-purple-800"
            >
              Edit
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
};
