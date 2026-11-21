import { describe, it, expect } from 'vitest';
import { INITIAL_OPPORTUNITIES } from '@/lib/data/initialOpportunities';

describe('Organizer Contact Integrity & Status Separation', () => {
  it('never fabricates contact details for opportunities without public contacts', () => {
    const unlistedRecord = INITIAL_OPPORTUNITIES.find(o => o.id === 'opp-demo-unlisted-contact')!;
    
    expect(unlistedRecord.organizer.isPubliclyAvailable).toBe(false);
    expect(unlistedRecord.organizer.officialEmail).toBeNull();
    expect(unlistedRecord.organizer.officialPhone).toBeNull();
    expect(unlistedRecord.organizer.provenanceUrl).toBeDefined();
  });

  it('guarantees verified opportunities retain authoritative source URLs for every organizer contact', () => {
    const sih = INITIAL_OPPORTUNITIES.find(o => o.id === 'opp-sih-2025')!;
    expect(sih.organizer.isPubliclyAvailable).toBe(true);
    expect(sih.organizer.officialEmail).toBe('sih@aicte-india.org');
    expect(sih.organizer.provenanceUrl).toContain('sih.gov.in');

    const devfolio = INITIAL_OPPORTUNITIES.find(o => o.id === 'opp-ethindia-devfolio')!;
    expect(devfolio.organizer.officialEmail).toBe('mail@devfolio.co');
  });

  it('strictly separates registration status from event timeline status', () => {
    const expiredRecord = INITIAL_OPPORTUNITIES.find(o => o.id === 'opp-demo-expired-hackathon')!;
    
    // Registration must be closed because deadline has passed
    expect(expiredRecord.registrationStatus).toBe('closed');
    // Event status is separate
    expect(expiredRecord.eventStatus).toBe('completed');
  });

  it('verifies paid vs unpaid internship transparency', () => {
    const isro = INITIAL_OPPORTUNITIES.find(o => o.id === 'opp-isro-internship')!;
    expect(isro.isPaidInternship).toBe(false);
    expect(isro.stipendAmount).toContain('Unpaid');

    const gsoc = INITIAL_OPPORTUNITIES.find(o => o.id === 'opp-gsoc-2026')!;
    expect(gsoc.isPaidInternship).toBe(true);
    expect(gsoc.stipendAmount).toBeDefined();
  });
});
