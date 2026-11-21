import { describe, it, expect } from 'vitest';
import { INITIAL_OPPORTUNITIES } from '@/lib/data/initialOpportunities';
import { filterOpportunitiesByRegion, formatEventLocation } from '@/lib/locationEngine';
import { PLATFORM_REGISTRY } from '@/lib/connectors/registry';
import { askGeminiAssistant } from '@/lib/gemini';

describe('Part 1 & Part 3: Location Filtering Engine & Location Separation', () => {
  it('correctly filters for Nagpur: displays Nagpur offline events, online hackathons, and excludes distant offline events', () => {
    const nagpurResults = filterOpportunitiesByRegion(INITIAL_OPPORTUNITIES, {
      country: 'India',
      state: 'Maharashtra',
      city: 'Nagpur',
      scope: 'my_region'
    });

    // Must include VNIT Nagpur offline hackathon
    const hasVnitNagpur = nagpurResults.some(o => o.id === 'opp-vnit-nagpur-hackathon');
    expect(hasVnitNagpur).toBe(true);

    // Must include online hackathons (e.g. Unstop AI Challenge or GSoC)
    const hasOnline = nagpurResults.some(o => o.mode === 'online');
    expect(hasOnline).toBe(true);

    // Must NOT include Pune-only offline event
    const hasPuneOffline = nagpurResults.some(o => o.id === 'opp-coep-pune-hackathon');
    expect(hasPuneOffline).toBe(false);
  });

  it('correctly filters for Pune: displays Pune offline events, online hackathons, and excludes Nagpur offline events', () => {
    const puneResults = filterOpportunitiesByRegion(INITIAL_OPPORTUNITIES, {
      country: 'India',
      state: 'Maharashtra',
      city: 'Pune',
      scope: 'my_region'
    });

    // Must include COEP Pune hackathon
    const hasCoepPune = puneResults.some(o => o.id === 'opp-coep-pune-hackathon');
    expect(hasCoepPune).toBe(true);

    // Must NOT include Nagpur offline event
    const hasNagpurOffline = puneResults.some(o => o.id === 'opp-vnit-nagpur-hackathon');
    expect(hasNagpurOffline).toBe(false);
  });

  it('correctly filters for Online Only: strictly displays only 100% virtual opportunities', () => {
    const onlineOnlyResults = filterOpportunitiesByRegion(INITIAL_OPPORTUNITIES, {
      country: 'India',
      scope: 'online_only'
    });

    expect(onlineOnlyResults.length).toBeGreaterThan(0);
    const nonOnline = onlineOnlyResults.filter(o => o.mode !== 'online');
    expect(nonOnline.length).toBe(0);
  });

  it('correctly filters for All India: displays nationwide opportunities and online events', () => {
    const allIndiaResults = filterOpportunitiesByRegion(INITIAL_OPPORTUNITIES, {
      country: 'India',
      scope: 'all_india'
    });

    expect(allIndiaResults.length).toBeGreaterThanOrEqual(INITIAL_OPPORTUNITIES.length - 2);
  });

  it('formatEventLocation strictly adheres to display standards for OFFLINE, ONLINE, HYBRID, and UNKNOWN', () => {
    // Offline
    const offlineFormatted = formatEventLocation({
      mode: 'offline',
      eventCity: 'Nagpur',
      eventState: 'Maharashtra',
      eventCountry: 'India'
    });
    expect(offlineFormatted.display).toBe('Nagpur, Maharashtra, India');

    // Online
    const onlineFormatted = formatEventLocation({
      mode: 'online'
    });
    expect(onlineFormatted.display).toBe('Online — Open to eligible participants from India');

    // Hybrid
    const hybridFormatted = formatEventLocation({
      mode: 'hybrid',
      eventCity: 'Pune',
      eventState: 'Maharashtra'
    });
    expect(hybridFormatted.display).toContain('Hybrid — Online + Physical Venue');

    // Unknown
    const unknownFormatted = formatEventLocation({
      mode: 'offline'
    });
    expect(unknownFormatted.display).toBe('Event location not confirmed');
  });
});

describe('Part 2: 32 Automated Multi-Source Connectors Registry', () => {
  it('contains exactly 32 verified student opportunity platforms across 5 categories', () => {
    expect(PLATFORM_REGISTRY.length).toBe(32);

    const categories = new Set(PLATFORM_REGISTRY.map(p => p.category));
    expect(categories.has('hackathons')).toBe(true);
    expect(categories.has('scholarships')).toBe(true);
    expect(categories.has('internships')).toBe(true);
    expect(categories.has('academic')).toBe(true);
    expect(categories.has('freelance')).toBe(true);
  });

  it('includes key platforms: Devfolio, Unstop, SIH, Devpost, MLH, NSP, MahaDBT, GSoC, AICTE, Internshala', () => {
    const ids = PLATFORM_REGISTRY.map(p => p.id);
    expect(ids).toContain('devfolio');
    expect(ids).toContain('unstop');
    expect(ids).toContain('sih');
    expect(ids).toContain('devpost');
    expect(ids).toContain('mlh');
    expect(ids).toContain('nsp');
    expect(ids).toContain('mahadbt');
    expect(ids).toContain('gsoc');
    expect(ids).toContain('aicte-internship');
    expect(ids).toContain('internshala');
  });
});

describe('Part 2: Gemini Personal Assistant Engine', () => {
  it('responds with contextual guidance and citations for Nagpur hackathons', async () => {
    const res = await askGeminiAssistant(
      'What hackathons are in Nagpur?',
      [],
      { region: { country: 'India', state: 'Maharashtra', city: 'Nagpur', scope: 'my_region' } },
      INITIAL_OPPORTUNITIES
    );

    expect(res.content).toContain('VNIT Nagpur');
    expect(res.citations.length).toBeGreaterThan(0);
    expect(res.suggestedFollowUps.length).toBeGreaterThan(0);
  });

  it('responds with detailed scholarship advice for MahaDBT', async () => {
    const res = await askGeminiAssistant(
      'How to apply for MahaDBT scholarships?',
      [],
      { region: { country: 'India', state: 'Maharashtra', city: 'Nagpur', scope: 'my_region' } },
      INITIAL_OPPORTUNITIES
    );

    expect(res.content).toContain('MahaDBT');
    expect(res.content).toContain('Domicile');
    expect(res.citations.some(c => c.publisherDomain.includes('mahadbt'))).toBe(true);
  });
});
