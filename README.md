# ChanceDeck — Discover Opportunities. Build Your Future.

> An open-source student opportunity intelligence platform built for the Google Gemini Student Hackathon. ChanceDeck unifies national hackathons, government scholarships, research internships, and competitions across India into a single source-verified catalog with deterministic eligibility matching and Gemini AI guidance.

---

## 🌟 Key Features

1. **Student-Selected Regional Discovery**
   - No hardcoded regions or forced geolocation. Students can switch between **All India (Nationwide)**, **100% Online Only**, **My City / Region**, **Nearby Cities**, or **My State**.
   - Online hackathons in Bengaluru or Delhi are immediately discoverable by students in Nagpur, Pune, or anywhere across India.

2. **Deterministic Opportunity Matching Engine**
   - High-precision matching that compares course, stream, year of study, skills, and family income limits.
   - Clear classification into **Strong Match**, **Potential Match**, **Not Eligible**, and **Insufficient Information**.
   - Includes transparent "Why am I seeing this opportunity?" explanations without hallucinating requirements.

3. **Google Gemini Multimodal AI Integration (Server-Side Only)**
   - Notice & circular information extraction into clean JSON.
   - Conversational scholarship & hackathon eligibility breakdowns.
   - Side-by-side opportunity comparison.
   - Graceful offline fallback when API keys are not supplied.

4. **Strict Anti-Hallucination Organizer Contact Standards**
   - Only publicly listed official organizer emails and phone numbers are displayed with explicit source URLs.
   - If contact information is unavailable, it is clearly stated as *"Organizer contact information not publicly available"*.
   - Built-in *"Draft an Enquiry"* tool generates polite inquiry templates without exposing student private information.

5. **Student Application Tracker & Opportunity Calendar**
   - Complete 6-stage status tracker (*Interested*, *Preparing*, *Applied*, *Selected*, *Not Selected*, *Withdrawn*).
   - Document checklist, application date tracker, and personal notes.
   - One-click `.ics` calendar export for Google Calendar, Apple Calendar, and Outlook.
   - Full personal data export in JSON format.

6. **100% Functional Local Demo Mode**
   - Works immediately out of the box using client-side storage and preloaded genuine opportunities (Smart India Hackathon, Devfolio ETHIndia, National Scholarship Portal, MahaDBT, ISRO, GSoC).
   - Seamlessly upgrades to Supabase PostgreSQL and live Google Gemini AI when credentials are configured.

---

## 🚀 Quick Start & Local Execution

### 1. Requirements
- Node.js (v18.x or v20.x+)
- npm

### 2. Installation
```bash
# Navigate to the project directory
cd C:\Users\utkar\.gemini\antigravity\scratch\ChanceDeck

# Install dependencies
npm install
```

### 3. Environment Setup
A default `.env.local` is already created with demo settings. To connect live Google Gemini and Supabase:
```bash
cp .env.example .env.local
```
Edit `.env.local`:
```env
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-1.5-flash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Run the Automated Test Suite
```bash
npm run test
```
All 14 unit and integration tests will execute and verify matching, regional scoping, contact anti-hallucination rules, and storage.

### 6. Create a Local Production Build
```bash
npm run build
```

---

## 📁 Project Structure

```
ChanceDeck/
├── src/
│   ├── app/                    # Next.js 14 App Router routes & API endpoints
│   │   ├── page.tsx            # SaaS Landing Page
│   │   ├── dashboard/          # Personalized Home Dashboard
│   │   ├── for-you/            # Tailored Opportunity Matching Hub
│   │   ├── hackathons/         # Hackathon Discovery (Pan-India & Online)
│   │   ├── scholarships/       # Scholarships (NSP, MahaDBT, Private)
│   │   ├── internships/        # Research & Industry Internships
│   │   ├── competitions/       # Quizzes & Challenges
│   │   ├── workshops/          # Technical Bootcamps & Masterclasses
│   │   ├── explore/            # Unified Multi-Facet Explorer
│   │   ├── calendar/           # Deadlines & Event Schedule with ICS Export
│   │   ├── saved/              # Bookmarked Opportunities
│   │   ├── applications/       # Application Lifecycle Tracker
│   │   ├── colleges/           # Pan-India College Directory
│   │   ├── suggest/            # Student Opportunity Submission
│   │   ├── organizer/          # Organizer Portal & Listing Corrections
│   │   ├── profile/            # Student Profile Preferences
│   │   ├── settings/           # Demo Configuration & Data Management
│   │   ├── admin/              # Administrator Moderation Console
│   │   └── api/                # Server-Side APIs (Gemini, Ingest, Submissions)
│   ├── components/             # Reusable UI & Opportunity Components
│   ├── lib/                    # Business logic, Gemini client, Matching Engine, Storage
│   └── tests/                  # Automated Vitest test suites
├── database/
│   └── migrations/             # 14 Supabase PostgreSQL tables & RLS policies
├── PROJECT_SPEC.md             # Project requirements and specification
├── ARCHITECTURE.md             # Architecture diagrams and system flow
└── BUILD_STATUS.md             # Milestone completion matrix
```

---

## 📄 License
This project is open-source software licensed under the MIT License. See [LICENSE](LICENSE) for details.
