import { NextRequest, NextResponse } from 'next/server';
import { OpportunitySubmission } from '@/lib/types';

let submissionsQueue: OpportunitySubmission[] = [
  {
    id: "sub-1",
    title: "National Student Autonomous Robotics Challenge 2026",
    category: "competition",
    organizationName: "Robotics Society of India",
    registrationUrl: "https://example.org/robotics-2026",
    officialSourceUrl: "https://example.org/robotics-2026",
    mode: "offline",
    state: "Karnataka",
    city: "Bengaluru",
    eventDates: "2027-02-15 to 2027-02-17",
    registrationDeadline: "2027-01-20T23:59:59Z",
    description: "Annual university autonomous rover and drone obstacle traversal competition.",
    contactEmail: "convener@robotics-society-sample.org",
    contactPhone: "+91-80-22998877",
    submitterType: "organizer",
    status: "pending_review",
    submittedAt: "2026-11-20T14:00:00Z"
  }
];

export async function GET() {
  return NextResponse.json({
    success: true,
    data: submissionsQueue
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      category,
      organizationName,
      registrationUrl,
      officialSourceUrl,
      mode,
      state,
      city,
      eventDates,
      registrationDeadline,
      description,
      contactEmail,
      contactPhone,
      submitterType
    } = body;

    // Strict validation
    if (!title || !category || !organizationName || !registrationUrl || !officialSourceUrl || !contactEmail) {
      return NextResponse.json(
        { success: false, error: 'Please provide all mandatory fields: Title, Category, Organization, URLs, and Contact Email.' },
        { status: 400 }
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactEmail)) {
      return NextResponse.json(
        { success: false, error: 'Invalid contact email address.' },
        { status: 400 }
      );
    }

    const newSubmission: OpportunitySubmission = {
      id: `sub-${Date.now()}`,
      title,
      category,
      organizationName,
      registrationUrl,
      officialSourceUrl,
      mode: mode || 'online',
      state: state || null,
      city: city || null,
      eventDates: eventDates || 'Dates to be announced',
      registrationDeadline: registrationDeadline || new Date().toISOString(),
      description: description || '',
      contactEmail,
      contactPhone: contactPhone || null,
      submitterType: submitterType === 'organizer' ? 'organizer' : 'student',
      status: 'pending_review', // ALWAYS enter pending review
      submittedAt: new Date().toISOString(),
    };

    submissionsQueue.unshift(newSubmission);

    return NextResponse.json({
      success: true,
      message: 'Submission received. It will be reviewed by the ChanceDeck verification desk before publishing.',
      data: newSubmission
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to submit opportunity' },
      { status: 500 }
    );
  }
}

// Admin update (approve/reject)
export async function PATCH(request: NextRequest) {
  try {
    const { submissionId, action, adminNotes } = await request.json();
    const index = submissionsQueue.findIndex(s => s.id === submissionId);
    if (index === -1) {
      return NextResponse.json({ success: false, error: 'Submission not found' }, { status: 404 });
    }

    if (action === 'approve') {
      submissionsQueue[index].status = 'approved';
      submissionsQueue[index].adminNotes = adminNotes || 'Approved by administrator';
    } else if (action === 'reject') {
      submissionsQueue[index].status = 'rejected';
      submissionsQueue[index].adminNotes = adminNotes || 'Rejected by administrator';
    }

    return NextResponse.json({
      success: true,
      message: `Submission marked as ${submissionsQueue[index].status}`,
      data: submissionsQueue[index]
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update submission' },
      { status: 500 }
    );
  }
}
