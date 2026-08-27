-- Resource Hub + Teacher Portal
-- Apply in the Supabase SQL editor (service-role APIs bypass RLS).

create extension if not exists "pgcrypto";

create table if not exists public.resource_submissions (
  id uuid primary key default gen_random_uuid(),
  resource_type_slug text not null default 'scholarships',
  resource_type_id text,
  destination text not null default 'public_hub',
  name text not null,
  summary text,
  description text,
  institution text,
  eligibility text,
  region text,
  deadline date,
  link text,
  file_url text,
  current_stage text[] not null default '{}',
  funding_type text,
  location_scope text,
  badges text[] not null default '{}',
  career_areas_text text,
  submitter_name text not null,
  submitter_email text not null,
  submitter_organization text,
  notes text,
  status text not null default 'pending',
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz,
  sanity_document_id text
);

alter table public.scholarship_submissions
  add column if not exists resource_type_slug text default 'scholarships',
  add column if not exists resource_type_id text,
  add column if not exists destination text default 'public_hub',
  add column if not exists file_url text;

create table if not exists public.teacher_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  school_name text,
  school_district text,
  role text,
  purpose text,
  grade_levels text,
  onboarding_completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.teacher_downloads (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid,
  teacher_email text,
  teacher_name text,
  school_name text,
  resource_id text not null,
  resource_title text,
  resource_type_slug text,
  downloaded_at timestamptz not null default now()
);

alter table public.resource_submissions enable row level security;
alter table public.teacher_profiles enable row level security;
alter table public.teacher_downloads enable row level security;

create index if not exists resource_submissions_status_idx
  on public.resource_submissions (status, submitted_at desc);

create index if not exists teacher_downloads_downloaded_at_idx
  on public.teacher_downloads (downloaded_at desc);

create index if not exists teacher_downloads_resource_idx
  on public.teacher_downloads (resource_id);
