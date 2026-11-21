'use client';

import React, { useState, useEffect } from 'react';
import { CheckSquare, Calendar, Trash2, Plus, Check } from 'lucide-react';
import { Opportunity, ApplicationRecord, ApplicationStatus } from '@/lib/types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { StorageManager } from '@/lib/storage';

interface ApplicationModalProps {
  opportunity: Opportunity | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

const DEFAULT_CHECKLIST = [
  { id: '1', text: 'Read official eligibility & circular', done: true },
  { id: '2', text: 'Obtain college bonafide / NOC letter', done: false },
  { id: '3', text: 'Prepare required documents / certificates', done: false },
  { id: '4', text: 'Finalize team members / application form', done: false },
  { id: '5', text: 'Submit application before deadline', done: false },
];

export const ApplicationModal: React.FC<ApplicationModalProps> = ({
  opportunity,
  isOpen,
  onClose,
  onSaved
}) => {
  const [status, setStatus] = useState<ApplicationStatus>('interested');
  const [notes, setNotes] = useState('');
  const [appliedDate, setAppliedDate] = useState('');
  const [checklist, setChecklist] = useState(DEFAULT_CHECKLIST);
  const [newChecklistItem, setNewChecklistItem] = useState('');

  useEffect(() => {
    if (opportunity) {
      const existing = StorageManager.getApplications().find(a => a.opportunityId === opportunity.id);
      if (existing) {
        setStatus(existing.status);
        setNotes(existing.notes || '');
        setAppliedDate(existing.appliedDate || '');
        setChecklist(existing.checklist?.length ? existing.checklist : DEFAULT_CHECKLIST);
      } else {
        setStatus('interested');
        setNotes('');
        setAppliedDate(new Date().toISOString().split('T')[0]);
        setChecklist(DEFAULT_CHECKLIST);
      }
    }
  }, [opportunity]);

  if (!opportunity) return null;

  const handleToggleCheck = (id: string) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, done: !item.done } : item));
  };

  const handleAddChecklistItem = () => {
    if (newChecklistItem.trim()) {
      setChecklist(prev => [...prev, { id: Date.now().toString(), text: newChecklistItem.trim(), done: false }]);
      setNewChecklistItem('');
    }
  };

  const handleRemoveChecklistItem = (id: string) => {
    setChecklist(prev => prev.filter(item => item.id !== id));
  };

  const handleSave = () => {
    const record: ApplicationRecord = {
      id: `app-${opportunity.id}`,
      opportunityId: opportunity.id,
      opportunity,
      status,
      notes,
      appliedDate: appliedDate || null,
      checklist,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    StorageManager.saveApplication(record);
    if (onSaved) onSaved();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Track Application: ${opportunity.title}`}
      description="Manage your application progress, checklist, and deadlines locally."
      maxWidth="lg"
    >
      <div className="space-y-4 text-xs text-slate-700">
        {/* Status Selector */}
        <div>
          <label className="font-semibold text-slate-800 block mb-1.5 text-xs uppercase tracking-wider">
            Application Status
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { val: 'interested', label: 'Interested' },
              { val: 'preparing', label: 'Preparing Docs' },
              { val: 'applied', label: 'Applied' },
              { val: 'selected', label: 'Selected / Won' },
              { val: 'not_selected', label: 'Not Selected' },
              { val: 'withdrawn', label: 'Withdrawn' },
            ].map(({ val, label }) => (
              <button
                key={val}
                type="button"
                onClick={() => setStatus(val as ApplicationStatus)}
                className={`p-2 rounded-lg border text-center font-medium transition-all ${
                  status === val
                    ? 'border-purple-600 bg-purple-50 text-purple-700 ring-1 ring-purple-300'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Applied Date */}
        <div>
          <label className="font-semibold text-slate-800 block mb-1 text-xs">
            Application Submission Date
          </label>
          <input
            type="date"
            value={appliedDate}
            onChange={(e) => setAppliedDate(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
          />
        </div>

        {/* Preparation Checklist */}
        <div>
          <label className="font-semibold text-slate-800 block mb-1.5 text-xs uppercase tracking-wider">
            Preparation Checklist
          </label>
          <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
            {checklist.map(item => (
              <div key={item.id} className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => handleToggleCheck(item.id)}
                  className="flex items-center gap-2 flex-1 text-left"
                >
                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                    item.done ? 'bg-purple-600 border-purple-600 text-white' : 'border-slate-300 bg-white'
                  }`}>
                    {item.done && <Check className="w-3 h-3" />}
                  </div>
                  <span className={`text-xs ${item.done ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                    {item.text}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => handleRemoveChecklistItem(item.id)}
                  className="text-slate-300 hover:text-rose-500 p-1"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}

            <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60">
              <input
                type="text"
                placeholder="Add custom task or document..."
                value={newChecklistItem}
                onChange={(e) => setNewChecklistItem(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddChecklistItem(); }}}
                className="flex-1 bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs"
              />
              <Button size="sm" variant="outline" onClick={handleAddChecklistItem}>
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>

        {/* Personal Notes */}
        <div>
          <label className="font-semibold text-slate-800 block mb-1 text-xs">
            Personal Notes & Credentials
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Registered with team 'CodeCraft', team leader: Rohan, application ID #98213..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:bg-white"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSave}>
            Save Application State
          </Button>
        </div>
      </div>
    </Modal>
  );
};
