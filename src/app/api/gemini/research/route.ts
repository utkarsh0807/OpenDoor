import { NextRequest, NextResponse } from 'next/server';
import { researchOpportunityWithGemini } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, officialUrl, details } = body;

    if (!title || !officialUrl) {
      return NextResponse.json(
        { error: 'Title and officialUrl are required for multi-source research.' },
        { status: 400 }
      );
    }

    const research = await researchOpportunityWithGemini(title, officialUrl, details);

    return NextResponse.json(research);
  } catch (error: any) {
    console.error('Error in /api/gemini/research:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to complete multi-source AI research.' },
      { status: 500 }
    );
  }
}
