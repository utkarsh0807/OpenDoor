import { NextRequest, NextResponse } from 'next/server';
import { explainEligibilityWithAI, isGeminiConfigured } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const { opportunityTitle, eligibility, studentProfile } = await request.json();

    if (!opportunityTitle) {
      return NextResponse.json(
        { success: false, error: 'Opportunity title is required.' },
        { status: 400 }
      );
    }

    const explanation = await explainEligibilityWithAI(
      opportunityTitle,
      eligibility || {},
      studentProfile || {}
    );

    return NextResponse.json({
      success: true,
      isAiPowered: isGeminiConfigured(),
      data: explanation
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to explain eligibility' },
      { status: 500 }
    );
  }
}
