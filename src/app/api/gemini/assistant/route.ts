import { NextRequest, NextResponse } from 'next/server';
import { askGeminiAssistant, AssistantPreferences } from '@/lib/gemini';
import { INITIAL_OPPORTUNITIES } from '@/lib/data/initialOpportunities';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, history = [], preferences, currentOpportunityId } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message query is required and must be a string.' },
        { status: 400 }
      );
    }

    // Context opportunities for grounding
    const contextOpps = INITIAL_OPPORTUNITIES;

    const result = await askGeminiAssistant(
      message,
      history,
      preferences as AssistantPreferences,
      contextOpps
    );

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error in /api/gemini/assistant:', error);
    return NextResponse.json(
      {
        content: "I encountered a momentary hiccup connecting to the intelligence server. You can ask me another question or check our verified opportunities directly.",
        citations: [],
        suggestedFollowUps: ['Show upcoming hackathons', 'Which scholarships are currently open?']
      },
      { status: 200 } // Graceful recovery with 200 so UI doesn't crash
    );
  }
}
