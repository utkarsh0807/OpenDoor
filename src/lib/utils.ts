// Helper Utilities for ChanceDeck

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Opportunity } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(isoString?: string | null): string {
  if (!isoString) return 'Dates not confirmed';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return 'Dates not confirmed';
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return 'Dates not confirmed';
  }
}

export function getDaysRemaining(isoDeadline?: string | null): { text: string; urgent: boolean; passed: boolean } {
  if (!isoDeadline) return { text: 'Date TBD', urgent: false, passed: false };
  try {
    const deadline = new Date(isoDeadline).getTime();
    const now = new Date().getTime();
    const diffMs = deadline - now;
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: 'Registration Closed', urgent: false, passed: true };
    }
    if (diffDays === 0) {
      return { text: 'Closing Today', urgent: true, passed: false };
    }
    if (diffDays === 1) {
      return { text: '1 day left', urgent: true, passed: false };
    }
    if (diffDays <= 5) {
      return { text: `${diffDays} days left`, urgent: true, passed: false };
    }
    return { text: `${diffDays} days left`, urgent: false, passed: false };
  } catch {
    return { text: 'Date TBD', urgent: false, passed: false };
  }
}

// Generate standard .ics calendar string
export function generateICS(opportunity: Opportunity): string {
  const start = new Date(opportunity.eventStartDate).toISOString().replace(/-|:|\.\d+/g, '');
  const end = new Date(opportunity.eventEndDate).toISOString().replace(/-|:|\.\d+/g, '');
  const now = new Date().toISOString().replace(/-|:|\.\d+/g, '');

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//ChanceDeck//Opportunity Calendar//EN',
    'BEGIN:VEVENT',
    `UID:ChanceDeck-${opportunity.id}@ChanceDeck.in`,
    `DTSTAMP:${now}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${opportunity.title}`,
    `DESCRIPTION:${opportunity.shortDescription.replace(/\n/g, ' ')} \\nOfficial Link: ${opportunity.officialSourceUrl}`,
    `LOCATION:${opportunity.mode === 'online' ? 'Online' : `${opportunity.city || ''}, ${opportunity.state || ''}`}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
}

export function downloadFile(filename: string, content: string, contentType: string) {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Generates polite organizer inquiry email draft
export function generateOrganizerEnquiry(opportunity: Opportunity, studentName = 'A College Student'): { subject: string; body: string } {
  const subject = `Enquiry regarding ${opportunity.title} — Application / Eligibility Query`;
  const body = `Dear ${opportunity.organizer.organizerName || 'Organizing Team'},\n\nI hope this email finds you well.\n\nI am reaching out regarding "${opportunity.title}" listed for college students.\n\nI would be grateful if you could clarify:\n1. Detailed eligibility requirements and documentation criteria.\n2. Team registration / participation guidelines.\n\nThank you for organizing this opportunity for the student community.\n\nSincerely,\n${studentName}\n(Enquiry drafted via ChanceDeck Opportunity Intelligence)`;

  return { subject, body };
}
