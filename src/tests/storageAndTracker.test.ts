import { describe, it, expect, beforeEach } from 'vitest';
import { StorageManager } from '@/lib/storage';
import { ApplicationRecord } from '@/lib/types';

describe('StorageManager & Application Lifecycle Tracker', () => {
  beforeEach(() => {
    StorageManager.clearAllData();
  });

  it('allows saving and unsaving opportunities locally for guest students', () => {
    expect(StorageManager.getSavedOpportunityIds()).toEqual([]);
    
    // Save
    const added = StorageManager.toggleSaveOpportunity('opp-sih-2025');
    expect(added).toBe(true);
    expect(StorageManager.isOpportunitySaved('opp-sih-2025')).toBe(true);

    // Unsave
    const removed = StorageManager.toggleSaveOpportunity('opp-sih-2025');
    expect(removed).toBe(false);
    expect(StorageManager.isOpportunitySaved('opp-sih-2025')).toBe(false);
  });

  it('records application lifecycle states, checklists, and notes', () => {
    const testApp: ApplicationRecord = {
      id: 'app-sih-2025',
      opportunityId: 'opp-sih-2025',
      status: 'preparing',
      notes: 'Formed 6-member team. Team Leader: Rohit',
      appliedDate: '2026-11-21',
      checklist: [
        { id: '1', text: 'College NOC', done: true },
        { id: '2', text: 'Submit PPT', done: false }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    StorageManager.saveApplication(testApp);
    const stored = StorageManager.getApplications();
    expect(stored.length).toBe(1);
    expect(stored[0].status).toBe('preparing');
    expect(stored[0].notes).toContain('Rohit');
    expect(stored[0].checklist.length).toBe(2);
  });

  it('exports valid personal data JSON with user bookmarks and tracker records', () => {
    StorageManager.toggleSaveOpportunity('opp-ethindia-devfolio');
    const jsonString = StorageManager.exportPersonalData();
    const parsed = JSON.parse(jsonString);

    expect(parsed.platform).toBe('OpenDoor Opportunity Intelligence');
    expect(parsed.savedOpportunities).toContain('opp-ethindia-devfolio');
  });
});
