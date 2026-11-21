'use client';

import React, { useState } from 'react';
import { MapPin, Globe, Compass, Check, X } from 'lucide-react';
import { INDIAN_STATES_AND_UTS, POPULAR_STUDENT_CITIES } from '@/lib/constants';
import { SelectedRegion, StorageManager } from '@/lib/storage';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface RegionSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRegion: SelectedRegion;
  onSaveRegion: (region: SelectedRegion) => void;
}

export const RegionSelectorModal: React.FC<RegionSelectorModalProps> = ({
  isOpen,
  onClose,
  currentRegion,
  onSaveRegion
}) => {
  const [scope, setScope] = useState<SelectedRegion['scope']>(currentRegion.scope || 'all_india');
  const [selectedState, setSelectedState] = useState<string>(currentRegion.state || '');
  const [selectedCity, setSelectedCity] = useState<string>(currentRegion.city || '');
  const [customCity, setCustomCity] = useState<string>('');

  const cityList = Object.keys(POPULAR_STUDENT_CITIES);

  const handleApply = () => {
    const finalCity = selectedCity === 'Other' ? customCity : selectedCity;
    const regionObj: SelectedRegion = {
      country: 'India',
      state: selectedState || null,
      city: finalCity || null,
      scope
    };
    StorageManager.setRegion(regionObj);
    onSaveRegion(regionObj);
    onClose();
  };

  const handleQuickScope = (newScope: SelectedRegion['scope']) => {
    setScope(newScope);
    if (newScope === 'all_india' || newScope === 'online_only') {
      const regionObj: SelectedRegion = {
        country: 'India',
        state: selectedState || null,
        city: selectedCity || null,
        scope: newScope
      };
      StorageManager.setRegion(regionObj);
      onSaveRegion(regionObj);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Student Regional Location Preferences"
      description="Select how you wish to discover local and national opportunities. No location is ever assigned automatically."
      maxWidth="lg"
    >
      <div className="space-y-5 text-xs sm:text-sm text-slate-700">
        {/* Scope Options */}
        <div>
          <label className="font-semibold text-navy-900 block mb-2 text-xs uppercase tracking-wider">
            1. Select Opportunity Scope
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => handleQuickScope('all_india')}
              className={`p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 ${
                scope === 'all_india'
                  ? 'border-purple-600 bg-purple-50/70 text-purple-900 ring-2 ring-purple-200'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <Compass className="w-4 h-4 text-purple-600 mt-0.5 shrink-0" />
              <div>
                <span className="font-bold block text-xs">All India (Nationwide)</span>
                <span className="text-[11px] text-slate-500">
                  Discover opportunities hosted across all states and cities.
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickScope('online_only')}
              className={`p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 ${
                scope === 'online_only'
                  ? 'border-blue-600 bg-blue-50/70 text-blue-900 ring-2 ring-blue-200'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <Globe className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
              <div>
                <span className="font-bold block text-xs">Online Opportunities</span>
                <span className="text-[11px] text-slate-500">
                  Virtual hackathons, webinars & remote programs from anywhere.
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setScope('my_region')}
              className={`p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 ${
                scope === 'my_region'
                  ? 'border-purple-600 bg-purple-50/70 text-purple-900 ring-2 ring-purple-200'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <MapPin className="w-4 h-4 text-purple-600 mt-0.5 shrink-0" />
              <div>
                <span className="font-bold block text-xs">My City / Region</span>
                <span className="text-[11px] text-slate-500">
                  Prioritize in-person events in your designated city.
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setScope('state')}
              className={`p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 ${
                scope === 'state'
                  ? 'border-purple-600 bg-purple-50/70 text-purple-900 ring-2 ring-purple-200'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <MapPin className="w-4 h-4 text-purple-600 mt-0.5 shrink-0" />
              <div>
                <span className="font-bold block text-xs">My State</span>
                <span className="text-[11px] text-slate-500">
                  State-wide scholarships, colleges, and university events.
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* State & City Picker (Visible when localized scope chosen) */}
        {(scope === 'my_region' || scope === 'state' || scope === 'nearby') && (
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-3">
            <h4 className="font-bold text-navy-900 text-xs uppercase tracking-wider">
              2. Choose Your State & City
            </h4>

            <div>
              <label className="text-xs text-slate-600 block mb-1">State / Union Territory</label>
              <select
                value={selectedState}
                onChange={(e) => {
                  setSelectedState(e.target.value);
                  setSelectedCity('');
                }}
                className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
              >
                <option value="">Select your State</option>
                {INDIAN_STATES_AND_UTS.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-600 block mb-1">City / District</label>
              <select
                value={selectedCity}
                onChange={(e) => {
                  setSelectedCity(e.target.value);
                  if (POPULAR_STUDENT_CITIES[e.target.value]) {
                    setSelectedState(POPULAR_STUDENT_CITIES[e.target.value].state);
                  }
                }}
                className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
              >
                <option value="">Select your City</option>
                {cityList.map((c) => (
                  <option key={c} value={c}>{c} ({POPULAR_STUDENT_CITIES[c].state})</option>
                ))}
                <option value="Other">Other City / Town</option>
              </select>
            </div>

            {selectedCity === 'Other' && (
              <div>
                <label className="text-xs text-slate-600 block mb-1">Enter your City Name</label>
                <input
                  type="text"
                  placeholder="e.g. Wardha, Amravati, Chandrapur, Kota, etc."
                  value={customCity}
                  onChange={(e) => setCustomCity(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                />
              </div>
            )}
          </div>
        )}

        {/* Note on Online Opportunities */}
        <p className="text-[11px] text-slate-500 bg-blue-50/50 p-2.5 rounded-lg border border-blue-100/80">
          <strong>Note:</strong> Online hackathons and national scholarships are never restricted by your physical location. A student in Nagpur, Pune, or anywhere in India can freely participate in virtual hackathons organized anywhere.
        </p>

        {/* Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => handleQuickScope('all_india')}
            className="text-xs text-slate-500 hover:text-slate-800 underline"
          >
            Skip / Reset to All India
          </button>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleApply}>
              Save Preferences
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
