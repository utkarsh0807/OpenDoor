-- ====================================================================
-- OPENDOOR — PostgreSQL Schema & Supabase RLS Migration
-- Migration: 001_initial_schema.sql
-- Description: Complete 14-table schema with RLS, indexes & constraints
-- ====================================================================

-- 1. REGIONS & JURISDICTIONS
CREATE TABLE IF NOT EXISTS public.regions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    country TEXT NOT NULL DEFAULT 'India',
    state TEXT NOT NULL,
    city TEXT NOT NULL,
    nearby_cities TEXT[] DEFAULT '{}',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_regions_state_city UNIQUE (state, city)
);

-- 2. INSTITUTIONS / COLLEGES DIRECTORY
CREATE TABLE IF NOT EXISTS public.institutions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    short_name TEXT,
    city TEXT NOT NULL,
    district TEXT,
    state TEXT NOT NULL,
    category TEXT NOT NULL, -- Engineering, Medical, Commerce, etc.
    official_website TEXT,
    affiliation TEXT,
    verification_status TEXT NOT NULL DEFAULT 'unverified' 
        CHECK (verification_status IN ('discovered', 'pending_review', 'verified', 'needs_review', 'unverified', 'expired', 'rejected')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. ORGANIZER CONTACTS (Strict anti-hallucination provenance)
CREATE TABLE IF NOT EXISTS public.organizer_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organizer_name TEXT NOT NULL,
    organization_name TEXT NOT NULL,
    official_email TEXT,
    official_phone TEXT,
    official_website TEXT,
    contact_person TEXT,
    social_profile TEXT,
    provenance_url TEXT NOT NULL,
    is_publicly_available BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. OPPORTUNITIES
CREATE TABLE IF NOT EXISTS public.opportunities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL 
        CHECK (category IN ('hackathon', 'scholarship', 'internship', 'competition', 'workshop')),
    sub_category TEXT,
    organizer_contact_id UUID REFERENCES public.organizer_contacts(id) ON DELETE SET NULL,
    description TEXT NOT NULL,
    short_description TEXT NOT NULL,
    mode TEXT NOT NULL CHECK (mode IN ('online', 'offline', 'hybrid')),
    
    -- Regional attributes
    country TEXT NOT NULL DEFAULT 'India',
    state TEXT,
    city TEXT,
    is_all_india BOOLEAN NOT NULL DEFAULT false,
    is_international BOOLEAN NOT NULL DEFAULT false,
    
    -- Dates (registration status vs event status strictly separated)
    registration_start_date TIMESTAMPTZ,
    registration_deadline TIMESTAMPTZ NOT NULL,
    event_start_date TIMESTAMPTZ NOT NULL,
    event_end_date TIMESTAMPTZ NOT NULL,
    
    registration_status TEXT NOT NULL DEFAULT 'open' 
        CHECK (registration_status IN ('open', 'closing_soon', 'closed')),
    event_status TEXT NOT NULL DEFAULT 'upcoming' 
        CHECK (event_status IN ('upcoming', 'happening_now', 'completed')),
    verification_status TEXT NOT NULL DEFAULT 'unverified' 
        CHECK (verification_status IN ('discovered', 'pending_review', 'verified', 'needs_review', 'unverified', 'expired', 'rejected')),
    is_demo_data BOOLEAN NOT NULL DEFAULT false,
    
    -- Eligibility schema (JSONB)
    eligibility JSONB NOT NULL DEFAULT '{}'::jsonb,
    
    -- Benefits & Fees
    registration_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    prizes_or_benefits TEXT NOT NULL DEFAULT 'Certificate and recognition',
    stipend_amount TEXT,
    is_paid_internship BOOLEAN,
    
    -- URLs & Provenance
    official_source_url TEXT NOT NULL,
    registration_url TEXT NOT NULL,
    poster_image_url TEXT,
    
    last_checked_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    last_verified_at TIMESTAMPTZ,
    verified_by UUID,
    conflict_flags TEXT[] DEFAULT '{}',
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. OPPORTUNITY SOURCES & PROVENANCE
CREATE TABLE IF NOT EXISTS public.opportunity_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
    field_name TEXT NOT NULL,
    field_value TEXT,
    source_url TEXT NOT NULL,
    source_type TEXT NOT NULL 
        CHECK (source_type IN ('official_website', 'government_portal', 'university_portal', 'organizer_submission', 'discovery_platform', 'public_lead')),
    last_checked_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    verification_status TEXT NOT NULL DEFAULT 'unverified',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. STUDENT PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY, -- Maps to Supabase auth.users id
    display_name TEXT NOT NULL,
    country TEXT NOT NULL DEFAULT 'India',
    state TEXT,
    city TEXT,
    nearby_cities TEXT[] DEFAULT '{}',
    college TEXT,
    course TEXT,
    stream TEXT NOT NULL DEFAULT 'Engineering',
    education_level TEXT NOT NULL DEFAULT 'undergraduate',
    academic_year INT NOT NULL DEFAULT 1 CHECK (academic_year BETWEEN 1 AND 7),
    skills TEXT[] DEFAULT '{}',
    interests TEXT[] DEFAULT '{}',
    preferred_categories TEXT[] DEFAULT '{}',
    preferred_mode TEXT DEFAULT 'any',
    family_income_inr NUMERIC(12, 2),
    cgpa_or_percentage NUMERIC(5, 2),
    reservation_category TEXT,
    is_guest BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. SAVED OPPORTUNITIES
CREATE TABLE IF NOT EXISTS public.saved_opportunities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_user_opportunity_save UNIQUE (user_id, opportunity_id)
);

-- 8. APPLICATION TRACKING
CREATE TABLE IF NOT EXISTS public.application_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'interested' 
        CHECK (status IN ('interested', 'preparing', 'applied', 'selected', 'not_selected', 'withdrawn')),
    notes TEXT DEFAULT '',
    applied_date DATE,
    checklist JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_user_opportunity_application UNIQUE (user_id, opportunity_id)
);

-- 9. COMMUNITY & ORGANIZER SUBMISSIONS
CREATE TABLE IF NOT EXISTS public.opportunity_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('hackathon', 'scholarship', 'internship', 'competition', 'workshop')),
    organization_name TEXT NOT NULL,
    registration_url TEXT NOT NULL,
    official_source_url TEXT NOT NULL,
    mode TEXT NOT NULL CHECK (mode IN ('online', 'offline', 'hybrid')),
    state TEXT,
    city TEXT,
    event_dates TEXT NOT NULL,
    registration_deadline TIMESTAMPTZ NOT NULL,
    description TEXT NOT NULL,
    contact_email TEXT NOT NULL,
    contact_phone TEXT,
    submitter_type TEXT NOT NULL CHECK (submitter_type IN ('student', 'organizer')),
    status TEXT NOT NULL DEFAULT 'pending_review' 
        CHECK (status IN ('pending_review', 'approved', 'rejected')),
    admin_notes TEXT,
    submitted_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 10. CORRECTION & BROKEN LINK REPORTS
CREATE TABLE IF NOT EXISTS public.correction_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
    reporter_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    issue_type TEXT NOT NULL 
        CHECK (issue_type IN ('incorrect_contact', 'broken_link', 'outdated_deadline', 'wrong_eligibility', 'duplicate', 'other')),
    details TEXT NOT NULL,
    suggested_correction TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'dismissed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 11. VERIFICATION & AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.verification_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
    performed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    previous_status TEXT NOT NULL,
    new_status TEXT NOT NULL,
    reason TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 12. DISCOVERY JOBS / SCRAPING RUNS
CREATE TABLE IF NOT EXISTS public.discovery_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_name TEXT NOT NULL,
    run_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    status TEXT NOT NULL CHECK (status IN ('completed', 'failed', 'in_progress')),
    records_found INT NOT NULL DEFAULT 0,
    records_ingested INT NOT NULL DEFAULT 0,
    conflicts_detected INT NOT NULL DEFAULT 0,
    details TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 13. NOTIFICATION PREFERENCES
CREATE TABLE IF NOT EXISTS public.notification_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
    deadline_reminders BOOLEAN NOT NULL DEFAULT true,
    matching_opportunity_alerts BOOLEAN NOT NULL DEFAULT true,
    email_digest BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 14. ADMINISTRATOR ROLES
CREATE TABLE IF NOT EXISTS public.administrator_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
    role_level TEXT NOT NULL DEFAULT 'moderator' CHECK (role_level IN ('moderator', 'lead_verifier', 'superadmin')),
    granted_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ====================================================================
-- INDEXES FOR HIGH-PERFORMANCE SEARCH & FILTERING
-- ====================================================================

CREATE INDEX IF NOT EXISTS idx_opp_category ON public.opportunities(category);
CREATE INDEX IF NOT EXISTS idx_opp_mode ON public.opportunities(mode);
CREATE INDEX IF NOT EXISTS idx_opp_state_city ON public.opportunities(state, city);
CREATE INDEX IF NOT EXISTS idx_opp_all_india ON public.opportunities(is_all_india);
CREATE INDEX IF NOT EXISTS idx_opp_deadline ON public.opportunities(registration_deadline);
CREATE INDEX IF NOT EXISTS idx_opp_reg_status ON public.opportunities(registration_status);
CREATE INDEX IF NOT EXISTS idx_opp_event_status ON public.opportunities(event_status);
CREATE INDEX IF NOT EXISTS idx_opp_verification ON public.opportunities(verification_status);
CREATE INDEX IF NOT EXISTS idx_opp_slug ON public.opportunities(slug);

CREATE INDEX IF NOT EXISTS idx_institutions_state_city ON public.institutions(state, city);
CREATE INDEX IF NOT EXISTS idx_saved_user ON public.saved_opportunities(user_id);
CREATE INDEX IF NOT EXISTS idx_app_tracking_user ON public.application_tracking(user_id);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE public.regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizer_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunity_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunity_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.correction_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discovery_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.administrator_roles ENABLE ROW LEVEL SECURITY;

-- Public read access for published opportunities, regions & colleges
CREATE POLICY "Public opportunities are viewable by all" 
ON public.opportunities FOR SELECT 
USING (verification_status IN ('verified', 'discovered', 'unverified') OR is_demo_data = true);

CREATE POLICY "Regions viewable by all" 
ON public.regions FOR SELECT USING (true);

CREATE POLICY "Institutions viewable by all" 
ON public.institutions FOR SELECT USING (true);

CREATE POLICY "Organizer contacts viewable with opportunities" 
ON public.organizer_contacts FOR SELECT USING (true);

-- Student Profiles: Users can only read/edit their own profile
CREATE POLICY "Users can manage own profile" 
ON public.profiles FOR ALL 
USING (auth.uid() = id);

-- Saved & Application tracking: private to user
CREATE POLICY "Users can view own saved opportunities" 
ON public.saved_opportunities FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY "Users can view and manage own applications" 
ON public.application_tracking FOR ALL 
USING (auth.uid() = user_id);

-- Submissions: Anyone can insert, only author or admin can view/manage
CREATE POLICY "Anyone can submit opportunity" 
ON public.opportunity_submissions FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can view own submissions" 
ON public.opportunity_submissions FOR SELECT 
USING (auth.uid() = submitted_by);

-- Admin Dashboard access helper:
CREATE POLICY "Admins full access on opportunities" 
ON public.opportunities FOR ALL 
USING (EXISTS (SELECT 1 FROM public.administrator_roles WHERE user_id = auth.uid()));

CREATE POLICY "Admins full access on submissions" 
ON public.opportunity_submissions FOR ALL 
USING (EXISTS (SELECT 1 FROM public.administrator_roles WHERE user_id = auth.uid()));
