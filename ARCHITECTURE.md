# ChanceDeck — Technical Architecture & Data Flow

## 1. System Architecture Diagram

```
[ Browser / Guest Client ]
       │
       ├─► Local Browser Storage (Profile Preferences, Saved IDs, Application Checklists)
       │
       └─► Next.js App Router (Server-Rendered Pages & API Routes)
              │
              ├── GET /api/opportunities ────► Ingested Database / Fallback Seed Catalog
              ├── POST /api/submissions ─────► Verification Review Queue (Pending Review)
              ├── GET /api/colleges ─────────► Pan-India Institutional Directory
              │
              ├── POST /api/gemini/extract ──► Google Gemini API (Structured Notice JSON)
              ├── POST /api/gemini/eligibility ─► Google Gemini API (Advisory Eligibility Explainer)
              └── POST /api/gemini/compare ──► Google Gemini API (Side-by-side Comparative Analysis)
                     │
              [ External Services (Optional in Demo Mode) ]
                     ├── Supabase PostgreSQL (14 Schema Tables with RLS)
                     └── Google AI Studio (Gemini 1.5 / 2.0 Flash)
```

## 2. Database Schema (14 Tables in `src/database/migrations/001_initial_schema.sql`)
1. `regions` — Regional boundaries, states, cities, nearby clusters.
2. `institutions` — Pan-India college directory across 11 academic streams.
3. `organizer_contacts` — Publicly verifiable contacts with strict source URLs.
4. `opportunities` — Core catalog with separated registration vs event status.
5. `opportunity_sources` — Field-level provenance and audit history.
6. `profiles` — Student course, stream, education level, and skills.
7. `saved_opportunities` — Private student opportunity bookmarks.
8. `application_tracking` — 6-stage application lifecycle tracker with checklists.
9. `opportunity_submissions` — Student and organizer submitted leads.
10. `correction_reports` — Community reported date or contact corrections.
11. `verification_logs` — Audit log of administrative state transitions.
12. `discovery_jobs` — Automated feed ingestion job records.
13. `notification_preferences` — Email and deadline alert settings.
14. `administrator_roles` — Backend verified administrator access levels.

## 3. Security & Safety Principles
- **No Client API Keys**: Gemini API keys and Supabase service keys are strictly called within server endpoints.
- **Untrusted Input Sanitation**: Notice circular text submitted by users is treated as untrusted data with strict JSON schema parsing and system prompt boundaries.
- **Privacy By Default**: Guest mode never sends private student notes or checklists over the network.
- **Zero Fabrication**: When organizer contact details are missing from public sources, they are transparently marked as unlisted.
