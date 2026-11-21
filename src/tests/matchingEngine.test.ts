import { describe, it, expect } from 'vitest';
import { calculateOpportunityMatch } from '@/lib/matchingEngine';
import { Opportunity, StudentProfile } from '@/lib/types';
import { INITIAL_OPPORTUNITIES } from '@/lib/data/initialOpportunities';

describe('Deterministic Opportunity Matching Engine', () => {
  const dummyProfile: StudentProfile = {
    id: 'test-student-1',
    displayName: 'Aarav Mehta',
    country: 'India',
    state: 'Maharashtra',
    city: 'Pune',
    nearbyCities: ['Mumbai'],
    college: 'COEP Pune',
    course: 'B.Tech Computer Engineering',
    stream: 'Engineering',
    educationLevel: 'undergraduate',
    academicYear: 3,
    skills: ['Python', 'Full Stack Development', 'Problem Solving', 'AI/ML'],
    interests: ['AI Hackathons'],
    preferredCategories: ['hackathon'],
    preferredMode: 'any',
    familyIncomeInr: 300000,
  };

  it('correctly matches Smart India Hackathon as a Strong Match for Engineering student with matching skills', () => {
    const sih = INITIAL_OPPORTUNITIES.find(o => o.id === 'opp-sih-2025')!;
    const match = calculateOpportunityMatch(sih, dummyProfile);

    expect(match.matchStrength).toBe('strong');
    expect(match.matchScore).toBeGreaterThanOrEqual(75);
    expect(match.matchedCriteria.some(c => c.includes('Engineering') || c.includes('Matches your academic year'))).toBe(true);
    expect(match.missingOrUnmetCriteria.length).toBe(0);
  });

  it('marks an opportunity as Not Eligible when streams or education level conflict', () => {
    const medicalOpp: Opportunity = {
      ...INITIAL_OPPORTUNITIES[0],
      id: 'opp-medical-only',
      title: 'AIIMS Clinical Surgery Fellowship',
      eligibility: {
        educationLevels: ['postgraduate'],
        eligibleStreams: ['Medical'],
        minYear: 4,
        maxYear: 5
      }
    };

    const match = calculateOpportunityMatch(medicalOpp, dummyProfile);
    expect(match.matchStrength).toBe('not_eligible');
    expect(match.missingOrUnmetCriteria.length).toBeGreaterThanOrEqual(2);
    expect(match.explanation).toContain('Not Eligible');
  });

  it('returns insufficient_info gracefully when browsing as a guest without a profile', () => {
    const sih = INITIAL_OPPORTUNITIES.find(o => o.id === 'opp-sih-2025')!;
    const match = calculateOpportunityMatch(sih, null);

    expect(match.matchStrength).toBe('insufficient_info');
    expect(match.explanation).toContain('guest');
  });

  it('verifies income criteria for scholarships without falsely rejecting students', () => {
    const nspScholarship = INITIAL_OPPORTUNITIES.find(o => o.id === 'opp-nsp-central-sector')!;
    const match = calculateOpportunityMatch(nspScholarship, dummyProfile);

    expect(match.matchedCriteria.some(c => c.includes('income'))).toBe(true);
  });
});
