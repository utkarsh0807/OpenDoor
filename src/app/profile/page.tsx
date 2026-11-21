'use client';

import React, { useState, useEffect } from 'react';
import { User, MapPin, GraduationCap, Sparkles, Trash2, Check, ArrowRight } from 'lucide-react';
import { StorageManager } from '@/lib/storage';
import { StudentProfile, AcademicStream, EducationLevel, OpportunityCategory, ParticipationMode } from '@/lib/types';
import { INDIAN_STATES_AND_UTS, POPULAR_STUDENT_CITIES, ACADEMIC_STREAMS, EDUCATION_LEVELS } from '@/lib/constants';
import { Button } from '@/components/ui/Button';

export default function ProfilePage() {
  const [profile, setProfile] = useState<StudentProfile>({
    id: 'guest-student-1',
    displayName: 'Priya Sharma',
    country: 'India',
    state: 'Maharashtra',
    city: 'Pune',
    nearbyCities: ['Mumbai', 'Nashik'],
    college: 'COEP Technological University',
    course: 'B.Tech Computer Engineering',
    stream: 'Engineering',
    educationLevel: 'undergraduate',
    academicYear: 3,
    skills: ['Python', 'Next.js', 'Machine Learning', 'Data Structures'],
    interests: ['AI Hackathons', 'Open Source Fellowships', 'Research Internships'],
    preferredCategories: ['hackathon', 'scholarship', 'internship'],
    preferredMode: 'any',
    familyIncomeInr: 450000,
  });

  const [skillInput, setSkillInput] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [clearedSuccess, setClearedSuccess] = useState(false);

  useEffect(() => {
    const existing = StorageManager.getProfile();
    if (existing) {
      setProfile(existing);
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    StorageManager.saveProfile(profile);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleClearProfile = () => {
    if (confirm('Are you sure you want to delete your local student profile?')) {
      StorageManager.clearProfile();
      setClearedSuccess(true);
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !profile.skills.includes(skillInput.trim())) {
      setProfile(prev => ({ ...prev, skills: [...prev.skills, skillInput.trim()] }));
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setProfile(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skillToRemove) }));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 uppercase tracking-wider mb-1">
            <User className="w-3.5 h-3.5" />
            Student Identity & Eligibility Settings
          </div>
          <h1 className="text-2xl font-extrabold text-navy-900">
            Student Profile
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure your academic course, skills, and regional preferences to receive tailored opportunity recommendations.
          </p>
        </div>

        <button
          type="button"
          onClick={handleClearProfile}
          className="text-xs text-rose-600 hover:text-rose-800 flex items-center gap-1 self-start sm:self-auto font-medium"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Delete Local Profile
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Profile saved locally! Match scores in "For You" have been updated.</span>
        </div>
      )}

      {clearedSuccess && (
        <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-xl">
          Profile cleared. Resetting to guest defaults...
        </div>
      )}

      {/* Profile Form */}
      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-5 text-xs text-slate-700">
        {/* Basic Details */}
        <div>
          <h3 className="text-xs font-bold text-navy-900 uppercase tracking-wider mb-3 pb-1 border-b border-slate-100 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-purple-600" />
            1. Personal & Institution
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Display Name</label>
              <input
                type="text"
                value={profile.displayName}
                onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:bg-white"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">College / University Name</label>
              <input
                type="text"
                value={profile.college}
                onChange={(e) => setProfile({ ...profile, college: e.target.value })}
                placeholder="e.g. VNIT Nagpur, IIT Bombay, COEP"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Location Preferences */}
        <div>
          <h3 className="text-xs font-bold text-navy-900 uppercase tracking-wider mb-3 pb-1 border-b border-slate-100 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-purple-600" />
            2. Selected Region (No Automatic Defaults)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">State / Union Territory</label>
              <select
                value={profile.state}
                onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:bg-white"
              >
                <option value="">Select State</option>
                {INDIAN_STATES_AND_UTS.map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">City</label>
              <input
                type="text"
                value={profile.city}
                onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                placeholder="e.g. Pune, Nagpur, Bengaluru, Wardha..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Academic Details */}
        <div>
          <h3 className="text-xs font-bold text-navy-900 uppercase tracking-wider mb-3 pb-1 border-b border-slate-100 flex items-center gap-1.5">
            <GraduationCap className="w-3.5 h-3.5 text-purple-600" />
            3. Academic Discipline & Education Level
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Academic Stream</label>
              <select
                value={profile.stream}
                onChange={(e) => setProfile({ ...profile, stream: e.target.value as AcademicStream })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:bg-white"
              >
                {ACADEMIC_STREAMS.map(str => (
                  <option key={str} value={str}>{str}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Education Level</label>
              <select
                value={profile.educationLevel}
                onChange={(e) => setProfile({ ...profile, educationLevel: e.target.value as EducationLevel })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:bg-white"
              >
                {EDUCATION_LEVELS.map(lvl => (
                  <option key={lvl.value} value={lvl.value}>{lvl.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Current Academic Year</label>
              <select
                value={profile.academicYear}
                onChange={(e) => setProfile({ ...profile, academicYear: parseInt(e.target.value, 10) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:bg-white"
              >
                <option value={1}>1st Year</option>
                <option value={2}>2nd Year</option>
                <option value={3}>3rd Year</option>
                <option value={4}>4th Year</option>
                <option value={5}>5th Year</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Course / Degree Program</label>
              <input
                type="text"
                value={profile.course}
                onChange={(e) => setProfile({ ...profile, course: e.target.value })}
                placeholder="e.g. B.Tech Computer Engineering, B.Sc Chemistry, MBBS"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:bg-white"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Annual Family Income (INR) — Optional for Scholarships
              </label>
              <input
                type="number"
                value={profile.familyIncomeInr || ''}
                onChange={(e) => setProfile({ ...profile, familyIncomeInr: e.target.value ? parseInt(e.target.value, 10) : null })}
                placeholder="e.g. 450000"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Skills & Tagging */}
        <div>
          <h3 className="text-xs font-bold text-navy-900 uppercase tracking-wider mb-2 pb-1 border-b border-slate-100 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            4. Skills & Competencies
          </h3>

          <div className="flex flex-wrap gap-1.5 mb-3">
            {profile.skills.map((skill, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-1 rounded-lg text-xs font-medium"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="hover:text-rose-600 ml-1"
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 max-w-sm">
            <input
              type="text"
              placeholder="Add skill (e.g. React, Python, IoT, AutoCAD)..."
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSkill(); }}}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:bg-white"
            />
            <Button type="button" variant="outline" size="sm" onClick={handleAddSkill}>
              Add
            </Button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <span className="text-[11px] text-slate-400">
            Stored privately in browser local storage.
          </span>
          <Button type="submit" variant="primary" size="md">
            Save Profile Preferences
          </Button>
        </div>
      </form>
    </div>
  );
}
