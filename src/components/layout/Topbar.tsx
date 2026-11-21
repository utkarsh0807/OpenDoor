'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Menu, Search, MapPin, Bookmark, Bell, Sparkles, 
  User, Check, Globe, HelpCircle 
} from 'lucide-react';
import { StorageManager } from '@/lib/storage';
import { useRegion } from '@/lib/context/RegionContext';
import { RegionSelectorModal } from './RegionSelectorModal';
import Link from 'next/link';

interface TopbarProps {
  onOpenSidebar: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onOpenSidebar }) => {
  const router = useRouter();
  const { region, setRegion, regionLabel } = useRegion();
  const [isRegionModalOpen, setIsRegionModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [savedCount, setSavedCount] = useState(0);
  const [showNotificationToast, setShowNotificationToast] = useState(false);

  useEffect(() => {
    setSavedCount(StorageManager.getSavedOpportunityIds().length);

    const handleStorageChange = () => {
      setSavedCount(StorageManager.getSavedOpportunityIds().length);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const getRegionLabel = () => regionLabel;

  return (
    <>
      <header className="sticky top-0 z-30 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between gap-3">
        {/* Mobile Sidebar toggle + Brand */}
        <div className="flex items-center gap-3 lg:hidden">
          <button
            onClick={onOpenSidebar}
            className="p-2 -ml-2 rounded-xl text-slate-600 hover:text-navy-900 hover:bg-slate-100"
            aria-label="Open Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center text-white font-extrabold text-xs shadow-sm">
              O
            </div>
            <span className="font-bold text-navy-900 text-sm">OpenDoor</span>
          </Link>
        </div>

        {/* Global Search Bar */}
        <form 
          onSubmit={handleSearchSubmit} 
          className="hidden md:flex items-center flex-1 max-w-md relative"
        >
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search hackathons, scholarships, internships, or skills..."
            className="w-full bg-slate-50 border border-slate-200/90 rounded-xl pl-9 pr-4 py-2 text-xs text-navy-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
          />
        </form>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3 ml-auto">
          {/* Region Selector Pill */}
          <button
            onClick={() => setIsRegionModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-purple-700 text-xs font-medium transition-colors shadow-sm"
            title="Change discovery region"
          >
            {region.scope === 'online_only' ? (
              <Globe className="w-3.5 h-3.5 text-blue-600" />
            ) : (
              <MapPin className="w-3.5 h-3.5 text-purple-600" />
            )}
            <span className="max-w-[120px] truncate">{getRegionLabel()}</span>
          </button>

          {/* Saved Opportunities Quick Link */}
          <Link
            href="/saved"
            className="relative p-2 rounded-xl text-slate-600 hover:text-purple-700 hover:bg-purple-50 transition-colors"
            title="Saved Opportunities"
          >
            <Bookmark className="w-4 h-4" />
            {savedCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-purple-600 text-white text-[10px] font-bold flex items-center justify-center">
                {savedCount}
              </span>
            )}
          </Link>

          {/* Notifications Notification */}
          <button
            onClick={() => setShowNotificationToast(!showNotificationToast)}
            className="relative p-2 rounded-xl text-slate-600 hover:text-purple-700 hover:bg-purple-50 transition-colors"
            title="Opportunity Alerts"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-purple-500" />
          </button>

          {/* Profile Shortcut */}
          <Link
            href="/profile"
            className="flex items-center gap-2 p-1 pl-2 pr-2.5 rounded-xl border border-slate-200 hover:border-purple-300 hover:bg-slate-50 transition-colors"
          >
            <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold">
              <User className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-medium text-navy-900 hidden sm:inline">Profile</span>
          </Link>
        </div>
      </header>

      {/* Regional Selector Dialog */}
      <RegionSelectorModal
        isOpen={isRegionModalOpen}
        onClose={() => setIsRegionModalOpen(false)}
        currentRegion={region}
        onSaveRegion={(newReg) => setRegion(newReg)}
      />

      {/* Notification Toast Modal */}
      {showNotificationToast && (
        <div className="fixed top-18 right-6 z-50 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
            <span className="text-xs font-bold text-navy-900 flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5 text-purple-600" />
              Recent Deadlines & Alerts
            </span>
            <button
              onClick={() => setShowNotificationToast(false)}
              className="text-slate-400 hover:text-slate-600 text-xs"
            >
              Close
            </button>
          </div>
          <div className="space-y-2 text-xs">
            <div className="p-2 bg-purple-50/70 rounded-xl text-slate-700">
              <span className="font-semibold block text-purple-900">SIH 2026 Senior Edition</span>
              <p className="text-[11px] text-slate-500">Registration deadline closing soon (Dec 15). Team bonafides required.</p>
            </div>
            <div className="p-2 bg-blue-50/70 rounded-xl text-slate-700">
              <span className="font-semibold block text-blue-900">National Scholarship Portal</span>
              <p className="text-[11px] text-slate-500">Central Sector Scheme open for university verification.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
