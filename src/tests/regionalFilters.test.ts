import { describe, it, expect } from 'vitest';
import { INITIAL_OPPORTUNITIES } from '@/lib/data/initialOpportunities';
import { StudentProfile } from '@/lib/types';
import { calculateOpportunityMatch } from '@/lib/matchingEngine';

describe('Multi-Region & Online Discovery Engine', () => {
  it('allows a student in Nagpur to discover online hackathons without geographic restriction', () => {
    const nagpurProfile: StudentProfile = {
      id: 'student-nagpur-1',
      displayName: 'Kavita Deshmukh',
      country: 'India',
      state: 'Maharashtra',
      city: 'Nagpur',
      nearbyCities: ['Wardha', 'Amravati'],
      college: 'VNIT Nagpur',
      course: 'B.Tech',
      stream: 'Engineering',
      educationLevel: 'undergraduate',
      academicYear: 2,
      skills: ['Python', 'APIs'],
      interests: ['AI Hackathons'],
      preferredCategories: ['hackathon'],
      preferredMode: 'any'
    };

    // Find Unstop virtual hackathon (online, no physical state required)
    const onlineHackathon = INITIAL_OPPORTUNITIES.find(o => o.id === 'opp-unstop-ai-challenge')!;
    expect(onlineHackathon.mode).toBe('online');

    const match = calculateOpportunityMatch(onlineHackathon, nagpurProfile);
    expect(match.matchedCriteria.some(c => c.includes('Online'))).toBe(true);
    expect(match.missingOrUnmetCriteria.length).toBe(0);
  });

  it('guarantees online and Pan-India opportunities are discoverable without selecting any city', () => {
    const allIndiaOpps = INITIAL_OPPORTUNITIES.filter(o => o.isAllIndia || o.mode === 'online');
    expect(allIndiaOpps.length).toBeGreaterThanOrEqual(6);

    // Verify SIH (smart india hackathon) is All-India
    const sih = INITIAL_OPPORTUNITIES.find(o => o.id === 'opp-sih-2025')!;
    expect(sih.isAllIndia).toBe(true);

    // Verify GSoC is 100% online
    const gsoc = INITIAL_OPPORTUNITIES.find(o => o.id === 'opp-gsoc-2026')!;
    expect(gsoc.mode).toBe('online');
  });

  it('correctly matches localized offline events in Pune when student selects Pune as city', () => {
    const puneProfile: StudentProfile = {
      id: 'student-pune-1',
      displayName: 'Rahul Joshi',
      country: 'India',
      state: 'Maharashtra',
      city: 'Pune',
      nearbyCities: ['Mumbai'],
      college: 'COEP Pune',
      course: 'B.Tech Mechanical',
      stream: 'Engineering',
      educationLevel: 'undergraduate',
      academicYear: 3,
      skills: ['IoT / Arduino / Raspberry Pi', 'Sensors'],
      interests: ['CleanTech'],
      preferredCategories: ['hackathon'],
      preferredMode: 'offline'
    };

    const puneCleantech = INITIAL_OPPORTUNITIES.find(o => o.id === 'opp-coep-pune-hackathon')!;
    const match = calculateOpportunityMatch(puneCleantech, puneProfile);

    expect(match.matchedCriteria.some(c => c.includes('in your city (Pune)'))).toBe(true);
  });
});
