// OpenDoor Location Intelligence & Regional Filtering Engine

import { Opportunity, ParticipationMode } from './types';
import { SelectedRegion } from './storage';
import { POPULAR_STUDENT_CITIES } from './constants';

export interface LocationDisplayInfo {
  display: string;
  shortDisplay: string;
  mode: ParticipationMode;
  venue?: string | null;
  organizerLocation?: string | null;
  isOnline: boolean;
  isVerifiedVenue: boolean;
}

/**
 * Formats the authentic Event Location strictly separating it from Organizer headquarters.
 * Rules:
 * OFFLINE: "Nagpur, Maharashtra, India" (with venue if confirmed)
 * ONLINE: "Online — Open to eligible participants from India"
 * HYBRID: "Hybrid — Online + Physical Venue" (with city/state if available)
 * UNKNOWN: "Event location not confirmed"
 */
export function formatEventLocation(opportunity: Partial<Opportunity>): LocationDisplayInfo {
  const mode = opportunity.mode || 'offline';
  const evCity = opportunity.eventCity || opportunity.city;
  const evState = opportunity.eventState || opportunity.state;
  const evCountry = opportunity.eventCountry || opportunity.country || 'India';
  const venue = opportunity.eventVenue || null;

  const orgCity = opportunity.organizer?.organizerCity;
  const orgState = opportunity.organizer?.organizerState;
  const organizerLocation = (orgCity || orgState) ? `${orgCity ? orgCity + ', ' : ''}${orgState || ''}` : null;

  if (mode === 'online') {
    return {
      display: 'Online — Open to eligible participants from India',
      shortDisplay: '100% Online',
      mode: 'online',
      venue: null,
      organizerLocation,
      isOnline: true,
      isVerifiedVenue: false
    };
  }

  if (mode === 'hybrid') {
    const locSnippet = evCity ? ` (${evCity}, ${evState || evCountry})` : '';
    return {
      display: `Hybrid — Online + Physical Venue${locSnippet}`,
      shortDisplay: evCity ? `Hybrid (${evCity})` : 'Hybrid',
      mode: 'hybrid',
      venue,
      organizerLocation,
      isOnline: false,
      isVerifiedVenue: Boolean(venue)
    };
  }

  // Offline mode
  if (evCity || evState) {
    const parts = [evCity, evState, evCountry].filter(Boolean);
    const formatted = parts.join(', ');
    return {
      display: formatted,
      shortDisplay: evCity ? `${evCity}, ${evState || 'IN'}` : formatted,
      mode: 'offline',
      venue,
      organizerLocation,
      isOnline: false,
      isVerifiedVenue: Boolean(venue)
    };
  }

  return {
    display: 'Event location not confirmed',
    shortDisplay: 'Location TBD',
    mode: 'offline',
    venue: null,
    organizerLocation,
    isOnline: false,
    isVerifiedVenue: false
  };
}

/**
 * Filters opportunities according to student selected region preferences.
 * - All India: Nationwide & online opportunities.
 * - Nagpur: Nagpur-specific offline/hybrid + nearby (Wardha, Amravati) + online hackathons + nationwide scholarships + remote internships.
 *   Does NOT display unrelated distant offline events (e.g. offline hackathon in Bengaluru).
 * - Pune: Pune-specific offline/hybrid + nearby + online/nationwide.
 * - Online: Only 100% online opportunities regardless of organizer location.
 */
export function filterOpportunitiesByRegion(
  opportunities: Opportunity[],
  region?: SelectedRegion | null
): Opportunity[] {
  if (!region || region.scope === 'all_india') {
    return opportunities.filter(opp => 
      opp.isAllIndia || 
      opp.mode === 'online' || 
      opp.eligibilityScope === 'all_india' ||
      !opp.eventCity
    );
  }

  if (region.scope === 'online_only') {
    return opportunities.filter(opp => opp.mode === 'online');
  }

  if (region.scope === 'state' && region.state) {
    const targetState = region.state.trim().toLowerCase();
    return opportunities.filter(opp => {
      // 1. Online is always eligible
      if (opp.mode === 'online') return true;
      // 2. All-India programs
      if (opp.isAllIndia) return true;
      // 3. State-specific offline or hybrid events
      const evState = (opp.eventState || opp.state || '').trim().toLowerCase();
      if (evState && evState === targetState) return true;
      // 4. Explicit eligible states
      if (opp.eligibleStates?.some(s => s.toLowerCase() === targetState)) return true;
      return false;
    });
  }

  // my_region (city-centric)
  const targetCity = (region.city || '').trim().toLowerCase();
  const targetState = (region.state || '').trim().toLowerCase();

  const cityConfig = region.city ? POPULAR_STUDENT_CITIES[region.city] : null;
  const nearbyList = cityConfig?.nearby || [];
  const nearbyLower = nearbyList.map(c => c.toLowerCase());

  return opportunities.filter(opp => {
    // 1. Online opportunities are accessible to all students
    if (opp.mode === 'online') return true;

    // 2. Nationwide scholarships & national competitive fellowships (e.g. NSP, MahaDBT, GSoC)
    if (opp.category === 'scholarship' && opp.isAllIndia) return true;
    if (opp.category === 'scholarship' && targetState && (opp.eventState || opp.state)?.toLowerCase() === targetState) return true;
    if (opp.category === 'internship' && opp.isAllIndia) return true;

    // 3. Exact city match for local offline or hybrid events
    const evCity = (opp.eventCity || opp.city || '').trim().toLowerCase();
    if (evCity && evCity === targetCity) return true;

    // 4. Nearby cities according to preferences
    if (evCity && nearbyLower.includes(evCity)) return true;

    // 5. Flagship pan-India hackathons with nationwide participation (e.g. SIH)
    if (opp.isAllIndia && opp.mode === 'hybrid') return true;

    // Do NOT display unrelated distant offline opportunities by default
    // (e.g. An offline hackathon in Bengaluru is excluded if student chose Nagpur)
    return false;
  });
}
