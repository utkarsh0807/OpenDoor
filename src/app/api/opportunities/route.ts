import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_OPPORTUNITIES } from '@/lib/data/initialOpportunities';
import { Opportunity } from '@/lib/types';
import { filterOpportunitiesByRegion } from '@/lib/locationEngine';
import { SelectedRegion } from '@/lib/storage';

// In-memory store for demo session submissions
let dynamicOpportunities: Opportunity[] = [...INITIAL_OPPORTUNITIES];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const mode = searchParams.get('mode');
    const regionScope = searchParams.get('region') as SelectedRegion['scope'] || 'all_india';
    const state = searchParams.get('state');
    const city = searchParams.get('city');
    const query = searchParams.get('q')?.toLowerCase();
    const status = searchParams.get('status');

    let filtered = [...dynamicOpportunities];

    // Apply strict regional filter
    const activeRegion: SelectedRegion = {
      country: 'India',
      state: state || null,
      city: city || null,
      scope: regionScope
    };
    filtered = filterOpportunitiesByRegion(filtered, activeRegion);

    // Category filter
    if (category && category !== 'all') {
      filtered = filtered.filter(opp => opp.category === category);
    }

    // Mode filter
    if (mode && mode !== 'all') {
      filtered = filtered.filter(opp => opp.mode === mode);
    }

    // Registration Status filter
    if (status && status !== 'all') {
      filtered = filtered.filter(opp => opp.registrationStatus === status);
    }

    // Search query filter
    if (query) {
      filtered = filtered.filter(opp => 
        opp.title.toLowerCase().includes(query) ||
        opp.description.toLowerCase().includes(query) ||
        opp.organizer.organizationName.toLowerCase().includes(query) ||
        opp.organizer.organizerName.toLowerCase().includes(query) ||
        opp.eligibility.requiredSkills?.some(s => s.toLowerCase().includes(query))
      );
    }

    return NextResponse.json({
      success: true,
      count: filtered.length,
      data: filtered
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch opportunities' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.title || !body.category || !body.officialSourceUrl) {
      return NextResponse.json(
        { success: false, error: 'Missing required opportunity parameters (title, category, officialSourceUrl)' },
        { status: 400 }
      );
    }

    const newOpp: Opportunity = {
      ...body,
      id: `opp-${Date.now()}`,
      slug: body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      verificationStatus: 'discovered',
      isDemoData: true,
      lastCheckedAt: new Date().toISOString(),
    };

    dynamicOpportunities.unshift(newOpp);

    return NextResponse.json({
      success: true,
      message: 'Opportunity successfully registered',
      data: newOpp
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create opportunity' },
      { status: 500 }
    );
  }
}
