// OpenDoor Deterministic Student Matching Engine
// Compares student profile parameters against opportunity eligibility without hallucinations

import { Opportunity, StudentProfile, MatchResult, MatchStrength } from './types';

export function calculateOpportunityMatch(
  opportunity: Opportunity,
  profile?: StudentProfile | null
): MatchResult {
  // If guest or no profile set, return neutral discovery status
  if (!profile) {
    return {
      opportunityId: opportunity.id,
      matchStrength: 'insufficient_info',
      matchScore: 50,
      matchedCriteria: ['Open for general student discovery'],
      missingOrUnmetCriteria: [],
      unknownCriteria: ['Complete your profile to see tailored eligibility match'],
      explanation: 'You are browsing as a guest. Set up your student profile in Settings or Onboarding to check tailored match scores.'
    };
  }

  const matched: string[] = [];
  const unmet: string[] = [];
  const unknown: string[] = [];
  let score = 0;
  let maxPossibleScore = 0;

  // 1. Education Level Check (Weight: 25)
  maxPossibleScore += 25;
  const oppEduLevels = opportunity.eligibility?.educationLevels || [];
  if (oppEduLevels.includes('all') || oppEduLevels.length === 0) {
    matched.push('Open to all educational tiers');
    score += 25;
  } else if (profile.educationLevel && oppEduLevels.includes(profile.educationLevel)) {
    matched.push(`Matches your education level (${profile.educationLevel.replace('_', ' ')})`);
    score += 25;
  } else if (!profile.educationLevel) {
    unknown.push('Your education level is not specified');
    score += 12; // Neutral partial score
  } else {
    unmet.push(`Requires ${oppEduLevels.map(e => e.replace('_', ' ')).join(' or ')}`);
  }

  // 2. Academic Stream Check (Weight: 20)
  maxPossibleScore += 20;
  const oppStreams = opportunity.eligibility?.eligibleStreams || [];
  if (oppStreams.length === 0) {
    matched.push('Open to students from all academic streams');
    score += 20;
  } else if (profile.stream && oppStreams.includes(profile.stream)) {
    matched.push(`Open to your stream: ${profile.stream}`);
    score += 20;
  } else if (!profile.stream) {
    unknown.push('Your academic stream is not specified in profile');
    score += 10;
  } else {
    unmet.push(`Requires: ${oppStreams.join(', ')}`);
  }

  // 3. Location & Mode Alignment (Weight: 20)
  maxPossibleScore += 20;
  if (opportunity.mode === 'online') {
    matched.push('100% Online — Participable from anywhere in India');
    score += 20;
  } else if (opportunity.isAllIndia) {
    matched.push('Pan-India Opportunity open to all states');
    score += 18;
  } else {
    const isStateMatch = profile.state && opportunity.state && 
      profile.state.toLowerCase() === opportunity.state.toLowerCase();
    const isCityMatch = profile.city && opportunity.city && 
      profile.city.toLowerCase() === opportunity.city.toLowerCase();
    const isNearbyMatch = profile.nearbyCities?.some(
      nc => opportunity.city && nc.toLowerCase() === opportunity.city.toLowerCase()
    );

    if (isCityMatch) {
      matched.push(`Hosted in your city (${opportunity.city})`);
      score += 20;
    } else if (isNearbyMatch) {
      matched.push(`Hosted in your nearby city (${opportunity.city})`);
      score += 15;
    } else if (isStateMatch) {
      matched.push(`Within your state (${opportunity.state})`);
      score += 12;
    } else {
      unmet.push(`Location is in ${opportunity.city || opportunity.state || 'specific region'}`);
    }
  }

  // 4. Academic Year Check (Weight: 10)
  maxPossibleScore += 10;
  const { minYear, maxYear } = opportunity.eligibility;
  if (minYear || maxYear) {
    const pYear = profile.academicYear;
    if (pYear) {
      const minValid = minYear ? pYear >= minYear : true;
      const maxValid = maxYear ? pYear <= maxYear : true;
      if (minValid && maxValid) {
        matched.push(`Matches your academic year (Year ${pYear})`);
        score += 10;
      } else {
        unmet.push(`Requires academic year ${minYear || 1} to ${maxYear || 'final'}`);
      }
    } else {
      unknown.push('Academic year not specified in your profile');
      score += 5;
    }
  } else {
    matched.push('No academic year restriction');
    score += 10;
  }

  // 5. Skills & Interests Synergy (Weight: 15)
  maxPossibleScore += 15;
  const reqSkills = opportunity.eligibility?.requiredSkills || [];
  if (reqSkills.length > 0) {
    const userSkills = profile.skills || [];
    const commonSkills = reqSkills.filter(req => 
      userSkills.some(us => us.toLowerCase().includes(req.toLowerCase()) || req.toLowerCase().includes(us.toLowerCase()))
    );

    if (commonSkills.length > 0) {
      matched.push(`Matched skills: ${commonSkills.join(', ')}`);
      score += Math.min(15, commonSkills.length * 5);
    } else {
      unknown.push(`Desirable skills: ${reqSkills.slice(0, 3).join(', ')}`);
      score += 5;
    }
  } else {
    matched.push('No prerequisite specialized skills strictly mandated');
    score += 15;
  }

  // 6. Category / Scholarship Economic/Merit Criteria (Weight: 10)
  maxPossibleScore += 10;
  if (opportunity.category === 'scholarship') {
    const maxIncome = opportunity.eligibility?.maxFamilyIncomeInr;
    if (maxIncome) {
      if (profile.familyIncomeInr != null) {
        if (profile.familyIncomeInr <= maxIncome) {
          matched.push(`Meets family income limit (≤ ₹${maxIncome.toLocaleString('en-IN')})`);
          score += 10;
        } else {
          unmet.push(`Exceeds maximum family income threshold of ₹${maxIncome.toLocaleString('en-IN')}`);
        }
      } else {
        unknown.push(`Requires family income ≤ ₹${maxIncome.toLocaleString('en-IN')} (income not specified in profile)`);
        score += 5;
      }
    } else {
      score += 10;
    }
  } else {
    score += 10;
  }

  // Calculate percentage
  const percentage = Math.round((score / maxPossibleScore) * 100);

  // Determine strength
  let matchStrength: MatchStrength = 'potential';
  if (unmet.length >= 2) {
    matchStrength = 'not_eligible';
  } else if (percentage >= 75 && unmet.length === 0) {
    matchStrength = 'strong';
  } else if (unknown.length >= 3 && percentage < 70) {
    matchStrength = 'insufficient_info';
  } else {
    matchStrength = 'potential';
  }

  // Build transparent explanation
  let explanation = '';
  if (matchStrength === 'strong') {
    explanation = `Strong Match: You satisfy key criteria for ${matched.slice(0, 2).join(' and ')}.`;
  } else if (matchStrength === 'potential') {
    explanation = `Potential Match: You match ${matched.length} key aspects, with ${unknown.length} unverified conditions.`;
  } else if (matchStrength === 'not_eligible') {
    explanation = `Not Eligible: Opportunity requires criteria that conflict with your current profile (${unmet.join('; ')}).`;
  } else {
    explanation = `Insufficient Information: Additional details about your profile (such as skills or income) will clarify your eligibility.`;
  }

  return {
    opportunityId: opportunity.id,
    matchStrength,
    matchScore: percentage,
    matchedCriteria: matched,
    missingOrUnmetCriteria: unmet,
    unknownCriteria: unknown,
    explanation
  };
}
