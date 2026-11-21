import { NextRequest, NextResponse } from 'next/server';
import { compareOpportunitiesWithAI } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const { opportunityA, opportunityB } = await request.json();

    if (!opportunityA || !opportunityB) {
      return NextResponse.json(
        { success: false, error: 'Both opportunities (A and B) must be supplied for comparison.' },
        { status: 400 }
      );
    }

    const comparison = await compareOpportunitiesWithAI(opportunityA, opportunityB);
    return NextResponse.json({
      success: true,
      data: comparison
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Comparison failed' },
      { status: 500 }
    );
  }
}
