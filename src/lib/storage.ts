// Client-Side Storage & Local Demo State Manager
// Supports guest browsing, offline persistence, and personal data export

import { StudentProfile, ApplicationRecord, Opportunity } from './types';

const PROFILE_KEY = 'ChanceDeck_student_profile';
const SAVED_KEY = 'ChanceDeck_saved_opportunities';
const APPS_KEY = 'ChanceDeck_applications';
const REGION_KEY = 'ChanceDeck_selected_region';

export interface SelectedRegion {
  country: string;
  state?: string | null;
  city?: string | null;
  scope: 'all_india' | 'my_region' | 'nearby' | 'state' | 'online_only';
}

export const StorageManager = {
  // Region Selection
  getRegion(): SelectedRegion {
    if (typeof window === 'undefined') return { country: 'India', scope: 'all_india' };
    try {
      const stored = localStorage.getItem(REGION_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Error reading region from localStorage', e);
    }
    return { country: 'India', scope: 'all_india' };
  },

  setRegion(region: SelectedRegion): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(REGION_KEY, JSON.stringify(region));
    // Dispatch local event so same-tab components instantly re-render
    window.dispatchEvent(new CustomEvent('ChanceDeck:region-change', { detail: region }));
    window.dispatchEvent(new Event('storage'));
  },

  onRegionChange(callback: (region: SelectedRegion) => void): () => void {
    if (typeof window === 'undefined') return () => {};
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<SelectedRegion>;
      if (customEvent.detail) {
        callback(customEvent.detail);
      } else {
        callback(StorageManager.getRegion());
      }
    };
    window.addEventListener('ChanceDeck:region-change', handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener('ChanceDeck:region-change', handler);
      window.removeEventListener('storage', handler);
    };
  },

  // Student Profile
  getProfile(): StudentProfile | null {
    if (typeof window === 'undefined') return null;
    try {
      const stored = localStorage.getItem(PROFILE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Error reading profile from localStorage', e);
    }
    return null;
  },

  saveProfile(profile: StudentProfile): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  },

  clearProfile(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(PROFILE_KEY);
  },

  // Saved Opportunities
  getSavedOpportunityIds(): string[] {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(SAVED_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Error reading saved opportunities', e);
    }
    return [];
  },

  toggleSaveOpportunity(oppId: string): boolean {
    if (typeof window === 'undefined') return false;
    const current = this.getSavedOpportunityIds();
    const exists = current.includes(oppId);
    let updated: string[];
    if (exists) {
      updated = current.filter(id => id !== oppId);
    } else {
      updated = [...current, oppId];
    }
    localStorage.setItem(SAVED_KEY, JSON.stringify(updated));
    return !exists;
  },

  isOpportunitySaved(oppId: string): boolean {
    return this.getSavedOpportunityIds().includes(oppId);
  },

  // Application Tracking
  getApplications(): ApplicationRecord[] {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(APPS_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Error reading applications', e);
    }
    return [];
  },

  saveApplication(record: ApplicationRecord): void {
    if (typeof window === 'undefined') return;
    const apps = this.getApplications();
    const existingIndex = apps.findIndex(a => a.id === record.id || a.opportunityId === record.opportunityId);
    if (existingIndex >= 0) {
      apps[existingIndex] = { ...record, updatedAt: new Date().toISOString() };
    } else {
      apps.push({ ...record, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    localStorage.setItem(APPS_KEY, JSON.stringify(apps));
  },

  deleteApplication(applicationId: string): void {
    if (typeof window === 'undefined') return;
    const apps = this.getApplications().filter(a => a.id !== applicationId);
    localStorage.setItem(APPS_KEY, JSON.stringify(apps));
  },

  // Export User Data
  exportPersonalData(): string {
    const data = {
      profile: this.getProfile(),
      selectedRegion: this.getRegion(),
      savedOpportunities: this.getSavedOpportunityIds(),
      applications: this.getApplications(),
      exportedAt: new Date().toISOString(),
      platform: "ChanceDeck Opportunity Intelligence"
    };
    return JSON.stringify(data, null, 2);
  },

  // Clear all local data
  clearAllData(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(PROFILE_KEY);
    localStorage.removeItem(SAVED_KEY);
    localStorage.removeItem(APPS_KEY);
    localStorage.removeItem(REGION_KEY);
  }
};
