-- public.jobs schema inspected on 2026-09-23 from Supabase project uqmjvvghhhtjqbzzvtop.
-- Restore data with make-restore-sql.py after creating this table.
CREATE TABLE public.jobs (
  url text NOT NULL,
  title text NOT NULL,
  company text NOT NULL,
  location text,
  first_seen timestamptz DEFAULT now(),
  last_seen timestamptz DEFAULT now(),
  is_active boolean DEFAULT true,
  description text,
  description_updated_at timestamptz,
  source_job_id text,
  normalized_locations jsonb NOT NULL DEFAULT '[]'::jsonb,
  workplace_types text[] NOT NULL DEFAULT '{unknown}'::text[],
  remote_scope text NOT NULL DEFAULT 'not_remote',
  remote_eligibility jsonb NOT NULL DEFAULT '[]'::jsonb,
  location_parse_status text NOT NULL DEFAULT 'pending',
  location_normalization_version integer NOT NULL DEFAULT 0,
  CONSTRAINT jobs_pkey PRIMARY KEY (url),
  CONSTRAINT jobs_location_parse_status_check CHECK (
    location_parse_status = ANY (ARRAY['pending'::text, 'parsed'::text, 'ambiguous'::text, 'unresolved'::text])
  ),
  CONSTRAINT jobs_remote_scope_check CHECK (
    remote_scope = ANY (ARRAY['not_remote'::text, 'unrestricted'::text, 'restricted'::text, 'unknown'::text])
  )
);
CREATE UNIQUE INDEX jobs_company_source_job_id_idx ON public.jobs (company, source_job_id)
  WHERE source_job_id IS NOT NULL;
CREATE INDEX idx_jobs_company ON public.jobs (company);
CREATE INDEX idx_jobs_is_active ON public.jobs (is_active);
CREATE INDEX idx_jobs_first_seen ON public.jobs (first_seen DESC);
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY jobs_select_public ON public.jobs FOR SELECT TO public USING (true);
GRANT ALL PRIVILEGES ON TABLE public.jobs TO anon, authenticated, service_role;
