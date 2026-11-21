import { NextRequest, NextResponse } from 'next/server';
import { extractOpportunityFromNotice, isGeminiConfigured } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();
    if (!text || typeof text !== 'string' || text.trim().length < 10) {
      return NextResponse.json(
        { success: false, error: 'Please provide valid notice or circular text (minimum 10 characters).' },
        { status: 400 }
      );
    }

    if (!isGeminiConfigured()) {
      // Deterministic Mock Extraction for Local Demo Mode
      return NextResponse.json({
        success: true,
        isDemoFallback: true,
        message: 'Gemini API not configured. Showing sample structured extraction.',
        data: {
          title: "Extracted Opportunity from Notice",
          category: "hackathon",
          subCategory: "Innovation Challenge",
          organizerName: "Event Organizing Committee",
          organizationName: "College Academic Council",
          officialEmail: null,
          officialPhone: null,
          officialWebsite: null,
          mode: "hybrid",
          city: null,
          state: null,
          isAllIndia: true,
          registrationDeadline: new Date(Date.now() + 15 * 86400000).toISOString(),
          eventStartDate: new Date(Date.now() + 25 * 86400000).toISOString(),
          eventEndDate: new Date(Date.now() + 27 * 86400000).toISOString(),
          registrationFee: 0,
          prizesOrBenefits: "Certificates, Cash prizes and Mentorship",
          eligibilitySummary: "Open to full-time undergraduate students from verified institutions.",
          requiredSkills: ["Problem Solving", "Teamwork"],
          requiredDocuments: ["College ID Card"],
          summary: "Automated extraction completed in Demo Mode. To enable live LLM multimodal extraction, configure GEMINI_API_KEY in .env.local"
        }
      });
    }

    const structuredData = await extractOpportunityFromNotice(text);
    return NextResponse.json({
      success: true,
      isDemoFallback: false,
      data: structuredData
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Gemini extraction failed' },
      { status: 500 }
    );
  }
}
