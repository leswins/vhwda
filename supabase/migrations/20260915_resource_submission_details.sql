-- Type-specific fields from the public submit form.
alter table public.resource_submissions
  add column if not exists details jsonb not null default '{}'::jsonb;

alter table public.scholarship_submissions
  add column if not exists details jsonb;
