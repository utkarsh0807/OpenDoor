// OpenDoor TypeScript Data Models & Types — Upgraded Multi-Source Architecture

export type OpportunityCategory = 
  | 'hackathon' 
  | 'scholarship' 
  | 'internship' 
  | 'competition' 
  | 'workshop';

export type ParticipationMode = 'online' | 'offline' | 'hybrid';

export type RegistrationStatus = 'open' | 'closing_soon' | 'closed';

export type EventStatus = 'upcoming' | 'happening_now' | 'completed';

export type VerificationStatus = 
  | 'discovered' 
  | 'pending_review' 
  | 'verified' 
  | 'needs_review' 
  | 'unverified' 
  | 'expired' 
  | 'rejected';

export type SourceType = 
  | 'official_website' 
  | 'government_portal' 
  | 'university_portal' 
  | 'organizer_submission' 
  | 'discovery_platform' 
  | 'public_lead';

export type EducationLevel = 
  | 'high_school' 
  | 'diploma_polytechnic' 
  | 'undergraduate' 
  | 'postgraduate' 
  | 'phd' 
  | 'all';

export type AcademicStream = 
  | 'Engineering' 
  | 'Science' 
  | 'Commerce' 
  | 'Arts' 
  | 'Medical' 
  | 'Pharmacy' 
  | 'Management' 
  | 'Polytechnic' 
  | 'Agriculture' 
  | 'Law' 
  | 'Other';

export interface OrganizerContact {
  organizerName: string;
  organizationName: string;
  officialEmail?: string | null;
  officialPhone?: string | null;
  officialWebsite?: string | null;
  contactPerson?: string | null;
  socialProfile?: string | null;
  provenanceUrl: string;
  isPubliclyAvailable: boolean;
  // Separate organizer office location
  organizerCity?: string | null;
  organizerState?: string | null;
  organizerCountry?: string | null;
}

export interface FieldProvenance {
  value: any;
  sourceUrl: string;
  sourceType: SourceType;
  lastCheckedAt: string;
  verificationStatus: VerificationStatus;
}

export type RequirementTier = 'required' | 'optional' | 'conditional';

export interface DocumentRequirement {
  id: string;
  name: string;
  requirementTier: RequirementTier;
  explanation: string;
  whoNeedsIt: string; // e.g. "All applicants" or "OBC/EWS candidates only"
  whenRequired: string; // e.g. "At initial registration" or "Upon round 2 selection"
  acceptedFormat?: string; // e.g. "PDF (max 2MB)" or "JPEG/PNG"
  supportingSourceUrl?: string;
  lastVerifiedDate?: string;
}

export interface MediaAssets {
  posterUrl?: string | null;
  bannerUrl?: string | null;
  videoUrl?: string | null; // YouTube or Vimeo URL
  eventPhotos?: string[];
  galleryImages?: string[];
  sponsorLogos?: { name: string; logoUrl: string }[];
  mentors?: { name: string; role: string; avatarUrl?: string }[];
}

export interface OpportunityChangeLog {
  id: string;
  opportunityId: string;
  changedField: string;
  oldValue: string;
  newValue: string;
  detectedAt: string;
  sourceUrl: string;
}

export interface Opportunity {
  id: string;
  title: string;
  slug: string;
  category: OpportunityCategory;
  subCategory?: string;
  organizer: OrganizerContact;
  description: string;
  shortDescription: string;
  mode: ParticipationMode; // online | offline | hybrid
  
  // Strict Event Location vs Organizer Location Separation
  eventCity?: string | null;
  eventState?: string | null;
  eventCountry?: string | null;
  eventVenue?: string | null; // e.g. "VNIT Auditorium, South Ambazari Road"
  isAllIndia: boolean;
  isInternational: boolean;
  eligibilityScope?: 'all_india' | 'state_only' | 'city_only' | 'international';
  eligibleCities?: string[];
  eligibleStates?: string[];
  eligibleCountries?: string[];

  // Legacy location fallback fields for compatibility
  country: string;
  state?: string | null;
  city?: string | null;

  // Source Platform Attribution
  sourcePlatform?: string; // e.g. 'Devfolio', 'Unstop', 'SIH', 'NSP', 'MahaDBT', 'ISRO', 'GSoC'

  // Dates (Registration vs Event Timeline strictly separated)
  registrationStartDate?: string | null;
  registrationDeadline: string; // ISO string
  eventStartDate: string; // ISO string
  eventEndDate: string; // ISO string

  // Statuses
  registrationStatus: RegistrationStatus; // open | closing_soon | closed
  eventStatus: EventStatus; // upcoming | happening_now | completed
  verificationStatus: VerificationStatus;
  isDemoData: boolean;

  // Eligibility
  eligibility: {
    educationLevels: EducationLevel[];
    eligibleStreams: AcademicStream[];
    minCgpaOrPercentage?: number | null;
    maxFamilyIncomeInr?: number | null; // For scholarships
    minYear?: number | null;
    maxYear?: number | null;
    genderPreference?: 'any' | 'women_only' | 'other';
    categoryPreference?: string[];
    requiredSkills?: string[];
    requiredDocuments?: string[]; // strings for simple matching
    teamSizeMin?: number;
    teamSizeMax?: number;
    notes?: string;
  };

  // Dedicated Document Intelligence
  documentRequirements?: DocumentRequirement[];

  // Rich Media Discovery & Display
  media?: MediaAssets;

  // Benefits & Fees
  registrationFee: number; // 0 for free
  prizesOrBenefits: string;
  stipendAmount?: string | null;
  isPaidInternship?: boolean | null;

  // URLs & Links
  officialSourceUrl: string;
  registrationUrl: string;
  posterImageUrl?: string | null;

  // Provenance & Audit
  lastCheckedAt: string;
  lastVerifiedAt?: string | null;
  verifiedBy?: string | null;
  conflictFlags?: string[];
  changeLogs?: OpportunityChangeLog[];
}

export interface StudentProfile {
  id: string;
  displayName: string;
  country: string;
  state: string;
  city: string;
  nearbyCities: string[];
  college: string;
  course: string;
  stream: AcademicStream;
  educationLevel: EducationLevel;
  academicYear: number;
  skills: string[];
  interests: string[];
  preferredCategories: OpportunityCategory[];
  preferredMode: ParticipationMode | 'any';
  familyIncomeInr?: number | null;
  cgpaOrPercentage?: number | null;
  reservationCategory?: string | null;
}

export type MatchStrength = 'strong' | 'potential' | 'not_eligible' | 'insufficient_info';

export interface MatchResult {
  opportunityId: string;
  matchStrength: MatchStrength;
  matchScore: number; // 0 - 100
  matchedCriteria: string[];
  missingOrUnmetCriteria: string[];
  unknownCriteria: string[];
  explanation: string;
}

export type ApplicationStatus = 
  | 'interested' 
  | 'preparing' 
  | 'applied' 
  | 'selected' 
  | 'not_selected' 
  | 'withdrawn';

export interface ApplicationRecord {
  id: string;
  opportunityId: string;
  opportunity?: Opportunity;
  status: ApplicationStatus;
  notes: string;
  appliedDate?: string | null;
  checklist: { id: string; text: string; done: boolean }[];
  updatedAt: string;
  createdAt: string;
}

export interface College {
  id: string;
  name: string;
  shortName?: string;
  city: string;
  district?: string;
  state: string;
  category: AcademicStream;
  officialWebsite?: string | null;
  affiliation?: string | null;
  verificationStatus: VerificationStatus;
}

export interface OpportunitySubmission {
  id: string;
  title: string;
  category: OpportunityCategory;
  organizationName: string;
  registrationUrl: string;
  officialSourceUrl: string;
  mode: ParticipationMode;
  state?: string;
  city?: string;
  eventVenue?: string;
  eventDates: string;
  registrationDeadline: string;
  description: string;
  contactEmail: string;
  contactPhone?: string;
  submitterType: 'student' | 'organizer';
  status: 'pending_review' | 'approved' | 'rejected';
  submittedAt: string;
  adminNotes?: string;
  media?: MediaAssets;
  documentRequirements?: DocumentRequirement[];
}

export interface IngestJobLog {
  id: string;
  sourceName: string;
  runAt: string;
  status: 'completed' | 'failed' | 'in_progress';
  recordsFound: number;
  recordsIngested: number;
  conflictsDetected: number;
  details: string;
}

// Connector & Source Management Types
export type ConnectorStatus = 'active' | 'partial' | 'manual_only';

export interface SourcePlatformInfo {
  id: string;
  name: string;
  category: 'hackathons' | 'scholarships' | 'internships' | 'freelance' | 'academic';
  status: ConnectorStatus;
  website: string;
  description: string;
  discoveryMethod: string;
  requiresAuth: boolean;
  lastChecked?: string;
  itemsDiscoveredCount: number;
}

// AI Assistant & Research Types
export interface ChatCitation {
  sourceName: string;
  publisherDomain: string;
  url: string;
  supportingSnippet: string;
  lastChecked?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  citations?: ChatCitation[];
  groundingSuggestions?: string[];
  isResearchQuery?: boolean;
  suggestedFollowUps?: string[];
}
