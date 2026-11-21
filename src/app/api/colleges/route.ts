import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_COLLEGES } from '@/lib/data/initialColleges';
import { College } from '@/lib/types';

let collegeList: College[] = [...INITIAL_COLLEGES];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.toLowerCase();
  const state = searchParams.get('state');
  const category = searchParams.get('category');

  let filtered = [...collegeList];

  if (state && state !== 'all') {
    filtered = filtered.filter(c => c.state.toLowerCase() === state.toLowerCase());
  }

  if (category && category !== 'all') {
    filtered = filtered.filter(c => c.category.toLowerCase() === category.toLowerCase());
  }

  if (q) {
    filtered = filtered.filter(c => 
      c.name.toLowerCase().includes(q) || 
      (c.shortName && c.shortName.toLowerCase().includes(q)) ||
      c.city.toLowerCase().includes(q)
    );
  }

  return NextResponse.json({
    success: true,
    count: filtered.length,
    data: filtered
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, city, state, category, officialWebsite } = body;

    if (!name || !city || !state || !category) {
      return NextResponse.json(
        { success: false, error: 'Name, City, State, and Academic Category are required.' },
        { status: 400 }
      );
    }

    const newCollege: College = {
      id: `col-${Date.now()}`,
      name,
      city,
      state,
      category,
      officialWebsite: officialWebsite || null,
      verificationStatus: 'pending_review'
    };

    collegeList.push(newCollege);

    return NextResponse.json({
      success: true,
      message: 'College suggestion received and queued for administrative review.',
      data: newCollege
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to submit college' },
      { status: 500 }
    );
  }
}
