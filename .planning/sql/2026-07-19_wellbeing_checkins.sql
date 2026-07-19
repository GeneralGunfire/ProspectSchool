-- ─────────────────────────────────────────────────────────────────────────────
-- Hand-run in Supabase Studio SQL editor. NOT a tracked migration (per CLAUDE.md
-- convention — schema changes here are executed manually by the project owner,
-- never by an AI assistant, and never via `supabase migration up`).
-- ─────────────────────────────────────────────────────────────────────────────
-- Wellbeing check-in feature. See .planning/research/WELLBEING_FEATURE_RESEARCH.md
-- for the full evidence base — every threshold/wording choice below traces back
-- to a numbered section there.
--
-- Four tables, deliberately kept separate:
--   1. wellbeing_checkins        — routine PHQ-4-style responses + computed scores
--   2. wellbeing_safety_flags    — crisis-path only, never folded into checkins
--   3. wellbeing_routine_alerts  — sustained-elevation / marked-decline / new-high-
--                                  distress alerts, with snooze support
--   4. wellbeing_access_log      — POPIA-aligned audit trail of who viewed whose
--                                  individual wellbeing data, when
--
-- RLS: enabled with NO policies on every table below, matching the de facto
-- convention already used for risk_scores / interventions / outcomes /
-- teacher_actions / marketplace_* — this app has no server backend, so
-- Supabase Auth-bound RLS policies would be theater (no auth.uid() session
-- exists to bind to; the service-role key already ships in the browser bundle
-- for all 42 existing data-access files). Real access control is enforced in
-- application code (src/lib/wellbeing.ts) — every read/write there takes an
-- explicit school_id/teacher_id/student_id and checks homeroom ownership
-- before touching an individual student's row. This is a pre-existing
-- architectural gap in the whole app (no server-side enforcement boundary at
-- all), not something this feature can fix in isolation — flagged here and in
-- the build report so it isn't silently accepted as fine.
-- ─────────────────────────────────────────────────────────────────────────────

-- ═══ 1. Routine check-ins ═══════════════════════════════════════════════════
-- One row per check-in. Raw answers + derived scores stored together so no
-- downstream code ever needs to re-derive PHQ-2/GAD-2/PHQ-4 from raw ints.

CREATE TABLE IF NOT EXISTS public.wellbeing_checkins (
  id                BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  student_id        BIGINT NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  school_id         BIGINT NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,

  -- Raw answers, 0-3 each (0 = Not at all, 1 = Several days, 2 = More than
  -- half the days, 3 = Nearly every day) — see research section 1.
  phq_down_interest INT2 NOT NULL CHECK (phq_down_interest BETWEEN 0 AND 3),   -- "little interest/pleasure"
  phq_hopeless      INT2 NOT NULL CHECK (phq_hopeless BETWEEN 0 AND 3),        -- "down, depressed, hopeless"
  gad_nervous       INT2 NOT NULL CHECK (gad_nervous BETWEEN 0 AND 3),         -- "nervous, anxious, on edge"
  gad_worry         INT2 NOT NULL CHECK (gad_worry BETWEEN 0 AND 3),           -- "not able to stop/control worrying"

  -- Derived scores, stored not just computed — nothing downstream should
  -- re-derive these from raw answers.
  phq2_score        INT2 NOT NULL,   -- phq_down_interest + phq_hopeless (0-6)
  gad2_score        INT2 NOT NULL,   -- gad_nervous + gad_worry (0-6)
  phq4_score        INT2 NOT NULL,   -- phq2_score + gad2_score (0-12)

  -- Safety item is answered as part of the same check-in (section 2), but the
  -- *positive* case is what spawns a wellbeing_safety_flags row — the raw
  -- 0-3 answer is still kept here for the student's own score history/trend
  -- continuity, since PHQ-9 item 9 is part of the same instrument family.
  safety_response   INT2 NOT NULL CHECK (safety_response BETWEEN 0 AND 3),

  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_wellbeing_checkins_student_created
  ON public.wellbeing_checkins(student_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_wellbeing_checkins_school
  ON public.wellbeing_checkins(school_id);

ALTER TABLE public.wellbeing_checkins ENABLE ROW LEVEL SECURITY;
-- No policies — see file header.

-- ═══ 2. Safety flags — crisis pathway, explicit and separate ═══════════════
-- Never folded into the routine alert table. Every row here represents a
-- student who answered > "Not at all" on the safety item (research section 2:
-- "any response > Not at all triggers the high-risk pathway" — confirmed as
-- the operational rule for this build, not the higher-bar alternative).

CREATE TABLE IF NOT EXISTS public.wellbeing_safety_flags (
  id                BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  checkin_id        BIGINT NOT NULL REFERENCES public.wellbeing_checkins(id) ON DELETE CASCADE,
  student_id        BIGINT NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  school_id         BIGINT NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,

  safety_response   INT2 NOT NULL CHECK (safety_response BETWEEN 1 AND 3),  -- copy of the triggering answer, for audit clarity independent of the checkin row

  -- Same-day acknowledgment requirement (research section 2, step 2: "Require
  -- the teacher to acknowledge receipt in the system"). NULL = unacknowledged.
  -- homeroom_teacher_id captured at flag-creation time (not re-derived later)
  -- so a mid-year homeroom reassignment can't silently orphan an open flag.
  homeroom_teacher_id BIGINT REFERENCES public.teachers(id) ON DELETE SET NULL,
  acknowledged_at     TIMESTAMPTZ,
  acknowledged_by     BIGINT REFERENCES public.teachers(id) ON DELETE SET NULL,

  -- Optional close-out once the teacher has made first contact (research
  -- section 2, step 3) — kept separate from acknowledgment since "I've seen
  -- this" and "I've spoken to the student" are different facts worth an
  -- honest audit trail.
  first_contact_at    TIMESTAMPTZ,
  first_contact_notes TEXT,

  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_wellbeing_safety_flags_teacher_unack
  ON public.wellbeing_safety_flags(homeroom_teacher_id) WHERE acknowledged_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_wellbeing_safety_flags_student
  ON public.wellbeing_safety_flags(student_id, created_at DESC);

ALTER TABLE public.wellbeing_safety_flags ENABLE ROW LEVEL SECURITY;
-- No policies — see file header.

-- ═══ 3. Routine pattern alerts — sustained elevation / marked decline / new  ═
-- ═══    high distress (research section 3), with snooze support (6c)       ═

CREATE TABLE IF NOT EXISTS public.wellbeing_routine_alerts (
  id                BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  student_id        BIGINT NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  school_id         BIGINT NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  homeroom_teacher_id BIGINT REFERENCES public.teachers(id) ON DELETE SET NULL,

  alert_type        TEXT NOT NULL CHECK (alert_type IN ('sustained_elevation', 'marked_decline', 'new_high_distress')),
  reasons           JSONB NOT NULL DEFAULT '[]'::jsonb,   -- plain-language explanation strings, shown verbatim (same convention as risk_scores.reasons)

  -- The check-in(s) that triggered this alert, for traceability/debugging.
  triggering_checkin_ids BIGINT[] NOT NULL,

  status            TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'snoozed', 'addressed')),
  snoozed_until      DATE,
  addressed_at       TIMESTAMPTZ,
  addressed_by       BIGINT REFERENCES public.teachers(id) ON DELETE SET NULL,
  addressed_notes    TEXT,

  created_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_wellbeing_routine_alerts_teacher_status
  ON public.wellbeing_routine_alerts(homeroom_teacher_id, status);
CREATE INDEX IF NOT EXISTS idx_wellbeing_routine_alerts_student
  ON public.wellbeing_routine_alerts(student_id, created_at DESC);

ALTER TABLE public.wellbeing_routine_alerts ENABLE ROW LEVEL SECURITY;
-- No policies — see file header.

-- ═══ 4. Access log — POPIA-aligned audit trail (research section 5) ════════
-- Every read of an individual student's wellbeing data (check-in history,
-- safety flags, routine alerts) by a teacher must log a row here. Aggregate/
-- anonymous views (none exist yet in this pass — see build report) would not
-- need to log. This table is intentionally generic (accessor + student +
-- what) rather than one log table per wellbeing table, since the POPIA
-- requirement is "who accessed which learner's data, when" — not per-table
-- granularity.

CREATE TABLE IF NOT EXISTS public.wellbeing_access_log (
  id             BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  student_id     BIGINT NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  school_id      BIGINT NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  accessor_teacher_id BIGINT REFERENCES public.teachers(id) ON DELETE SET NULL,
  access_type    TEXT NOT NULL,   -- e.g. 'view_individual_timeline', 'acknowledge_safety_flag'
  accessed_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_wellbeing_access_log_student
  ON public.wellbeing_access_log(student_id, accessed_at DESC);

ALTER TABLE public.wellbeing_access_log ENABLE ROW LEVEL SECURITY;
-- No policies — see file header.

-- ─────────────────────────────────────────────────────────────────────────────
-- POPIA lawful-basis note (dual-basis model, confirmed via follow-up legal
-- research 2026-07-19 — see conversation record, not yet a written school
-- policy document):
--   - Routine check-in data (wellbeing_checkins, wellbeing_routine_alerts):
--     lawful basis = parental/competent-person consent (POPIA s11), obtained
--     administratively by the school outside this app for v1 (see build
--     report — no in-app parental consent capture exists yet).
--   - Crisis-pathway data (wellbeing_safety_flags): lawful basis = protection
--     of vital interests (POPIA s27(b)) — processing/alerting a homeroom
--     teacher when a student discloses possible self-harm risk does not wait
--     on standing parental consent, since the purpose is immediate safety,
--     not ongoing monitoring. This basis should stay scoped narrowly to
--     crisis response only — do not use it to justify collecting/retaining
--     more than what's needed to assess and respond to that specific flag.
--   Both bases require a written parent/learner-facing privacy notice before
--   go-live (research section 5) — that notice does not exist yet, is a
--   prerequisite for real student data, and is explicitly deferred to the
--   school's administrative rollout process for this pass.
-- ─────────────────────────────────────────────────────────────────────────────

-- ═══ 5. Parental consent (POPIA lawful basis for routine check-in data) ════
-- One row per student — a parent (via their real Parent portal login,
-- parent_students table already links parent_id <-> student_id) records
-- their consent decision here. The student's check-in nav item / access is
-- gated on an active 'granted' row existing for them (see src/lib/wellbeing.ts
-- fetchConsentStatus / hasActiveConsent). A parent can revoke at any time,
-- which creates a new row rather than mutating the old one — the consent
-- history itself is worth keeping (POPIA record-keeping), not just the
-- current state.

CREATE TABLE IF NOT EXISTS public.wellbeing_parent_consents (
  id             BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  student_id     BIGINT NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  school_id      BIGINT NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  parent_id      BIGINT NOT NULL REFERENCES public.parents(id) ON DELETE CASCADE,

  decision       TEXT NOT NULL CHECK (decision IN ('granted', 'revoked')),
  recorded_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_wellbeing_parent_consents_student
  ON public.wellbeing_parent_consents(student_id, recorded_at DESC);

ALTER TABLE public.wellbeing_parent_consents ENABLE ROW LEVEL SECURITY;
-- No policies — see file header.

-- ─────────────────────────────────────────────────────────────────────────────
-- Retention-policy hook (research section 5): no automated deletion/
-- anonymization in this pass (deferred — see build report), but the schema
-- doesn't block it later. `school_id` FKs use ON DELETE CASCADE from
-- `students`, so a future retention job can safely delete/anonymise rows by
-- student_id without needing schema changes. Deliberately NOT hard-deleting
-- anything automatically here — a future job must be able to check for an
-- "active safeguarding case" exception (e.g. an unresolved
-- wellbeing_safety_flags row, or a flag linking to this feature's future
-- "Wellbeing support" intervention type once that's built) before deleting a
-- school-leaver's records. No such exception table exists yet; this comment
-- is the hook for whoever builds the retention job.
-- ─────────────────────────────────────────────────────────────────────────────
