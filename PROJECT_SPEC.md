# OpenDoor — Project Specification

## 1. Executive Summary
- **Project Name**: OpenDoor
- **Tagline**: Discover Opportunities. Build Your Future.
- **Mission**: Provide an open-source student opportunity intelligence platform for Indian college students across all disciplines (Engineering, Science, Medical, Commerce, Arts, Polytechnic, Agriculture, Management).
- **Core Problem Solved**: Eliminates scattered, inaccessible, and fake notices by establishing a source-verified catalog of hackathons, government scholarships, research internships, and competitions with deterministic eligibility matching and Google Gemini AI assistance.

## 2. Core Pillars & Architecture Standards
1. **Dynamic Regional Location Choice**:
   - Zero hardcoded defaults (no mandatory cities or assumptions).
   - Allows choosing: All India (Nationwide), Online Only, My City, Nearby Cities, or My State.
   - Decouples organizer headquarters from event participation mode (e.g., an online hackathon in Bengaluru is open to students in Nagpur, Pune, Delhi, etc.).
2. **Anti-Hallucination Contact Policy**:
   - Official organizer contacts are published only when verified from public authoritative records.
   - If unlisted, clearly indicated as "Organizer contact information not publicly available".
   - Ready-to-send polite enquiry email drafting without exposing student private details.
3. **Strict Status Separation**:
   - Registration Timeline (Open, Closing Soon, Closed) is strictly decoupled from Event Execution Timeline (Upcoming, Happening Now, Completed).
4. **Deterministic Student Matching Engine**:
   - Objective comparison of Education Level, Stream, Year, Skills, Income limits, and Location.
   - Classifications: Strong Match, Potential Match, Not Eligible, Insufficient Information.
   - Includes transparent "Why am I seeing this opportunity?" reasoning.
5. **Google Gemini Multimodal AI Integration**:
   - Server-only API calls protecting credentials.
   - Notice circular extraction from raw text.
   - Advisory scholarship & hackathon eligibility breakdowns.
   - Side-by-side opportunity comparison.
6. **Student Application Tracker & Calendar**:
   - 6-stage lifecycle tracking (Interested -> Preparing -> Applied -> Selected -> Not Selected -> Withdrawn).
   - Interactive document preparation checklists and private notes.
   - Full `.ics` calendar export for Google, Apple, and Outlook calendars.
   - Complete local JSON personal data export.
7. **Local Demo Mode**:
   - Zero setup barrier: works 100% out of the box locally via guest storage and preloaded genuine data.
   - Seamlessly upgrades to Supabase PostgreSQL and Google Gemini when API keys are added.

## 3. Technology Stack
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **AI**: Google Gemini API (`@google/generative-ai`)
- **Database**: Supabase PostgreSQL with 14 migration tables & Row Level Security
- **Testing**: Vitest & React Testing Library (14 automated test cases)
