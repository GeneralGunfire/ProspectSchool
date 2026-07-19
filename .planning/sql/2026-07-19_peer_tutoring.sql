-- ─────────────────────────────────────────────────────────────────────────────
-- Hand-run in Supabase Studio SQL editor. NOT a tracked migration (per CLAUDE.md
-- convention — schema changes here are executed manually by the project owner,
-- never by an AI assistant, and never via `supabase migration up`).
-- ─────────────────────────────────────────────────────────────────────────────
-- Peer Tutoring feature. See .planning/research/PEER_TUTORING_FEATURE_RESEARCH.md
-- for the full evidence base — every threshold/wording choice below traces back
-- to a numbered section there. Cross-reference checklist at the end of that doc
-- must be satisfied by this schema + the application code built on top of it.
--
-- RLS: enabled with NO policies on every table below, matching the de facto
-- convention already used for risk_scores / interventions / outcomes /
-- wellbeing_* — this app has no server backend, so Supabase Auth-bound RLS
-- policies would be theater. Real access control is enforced in application
-- code (src/lib/peerTutoring.ts) — every read/write there takes an explicit
-- school_id/teacher_id/student_id and checks ownership before touching an
-- individual student's row, same pattern as wellbeing.ts.
--
-- Staff scoping decision (confirmed with project owner 2026-07-19): session/
-- academic oversight (badge-farming patterns, pre/post score dashboard) is
-- scoped to the SUBJECT TEACHER for the tutoring relationship's subject (via
-- teacher_students), not the homeroom teacher — they have direct pedagogical
-- context on the topic/misconceptions involved. "Report a concern" (safety/
-- conduct issues) routes to the HOMEROOM TEACHER instead, consistent with
-- Wellbeing's escalation path, since a concern here is a pastoral/conduct
-- matter, not an academic one. Both scoping paths are captured at row-creation
-- time (not re-derived later) so a mid-year reassignment can't silently orphan
-- an open record — same convention as wellbeing_safety_flags.homeroom_teacher_id.
-- ─────────────────────────────────────────────────────────────────────────────

-- ═══ 1. Tutor profiles — who has opted in to tutor, which subject/topics ════
-- A student can be a tutor for multiple (subject, topic) pairs. Gated by
-- orientation completion + code-of-conduct acknowledgment (section 3, 5)
-- before they can be matched as a tutor.

CREATE TABLE IF NOT EXISTS public.peer_tutor_profiles (
  id                  BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  student_id          BIGINT NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  school_id           BIGINT NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,

  -- Minimal tutor orientation gate (research section 3: 10-15 min in-app
  -- orientation + quiz, not external training). NULL = not yet completed —
  -- student cannot be matched as a tutor until this is set.
  orientation_completed_at TIMESTAMPTZ,

  -- Code-of-conduct acknowledgment gate (research section 5), separate from
  -- orientation since a returning tutor might re-acknowledge conduct terms
  -- (e.g. annual refresh) without repeating the orientation quiz.
  conduct_acknowledged_at  TIMESTAMPTZ,

  -- Lightweight rapport proxy (research section 2) — optional, not required.
  prefers_known_students    BOOLEAN,

  is_active           BOOLEAN NOT NULL DEFAULT true,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE(student_id)
);

CREATE INDEX IF NOT EXISTS idx_peer_tutor_profiles_school
  ON public.peer_tutor_profiles(school_id) WHERE is_active;

ALTER TABLE public.peer_tutor_profiles ENABLE ROW LEVEL SECURITY;
-- No policies — see file header.

-- One row per (subject, grade, topic) a tutor is willing/able to tutor.
-- Matching primary key per research section 2 is (subject, grade, topic_id),
-- not just (subject, grade) — this table is what makes that queryable.
CREATE TABLE IF NOT EXISTS public.peer_tutor_topics (
  id                  BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  tutor_profile_id    BIGINT NOT NULL REFERENCES public.peer_tutor_profiles(id) ON DELETE CASCADE,
  subject_id          BIGINT NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  topic_id            BIGINT NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,

  -- Snapshot of the tutor's own topic-test score_pct at the time they offered
  -- to tutor this topic — used to (a) gate eligibility (must demonstrate
  -- mastery, research section 2 cross-grade rule) and (b) as the "tutor side"
  -- of the ability-gap heuristic before a live re-check at match time.
  demonstrated_score_pct INT2 NOT NULL CHECK (demonstrated_score_pct BETWEEN 0 AND 100),

  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE(tutor_profile_id, topic_id)
);

CREATE INDEX IF NOT EXISTS idx_peer_tutor_topics_lookup
  ON public.peer_tutor_topics(subject_id, topic_id);

ALTER TABLE public.peer_tutor_topics ENABLE ROW LEVEL SECURITY;
-- No policies — see file header.

-- ═══ 2. Tutee requests — who needs help, which subject/topic ═══════════════

CREATE TABLE IF NOT EXISTS public.peer_tutoring_requests (
  id                  BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  student_id          BIGINT NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  school_id           BIGINT NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  subject_id          BIGINT NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  topic_id            BIGINT NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,

  conduct_acknowledged_at TIMESTAMPTZ,   -- code-of-conduct gate applies to tutees too (section 5)
  prefers_known_students  BOOLEAN,       -- same lightweight rapport proxy as tutor side

  status              TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'matched', 'cancelled')),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_peer_tutoring_requests_open
  ON public.peer_tutoring_requests(subject_id, topic_id) WHERE status = 'open';
CREATE INDEX IF NOT EXISTS idx_peer_tutoring_requests_student
  ON public.peer_tutoring_requests(student_id);

ALTER TABLE public.peer_tutoring_requests ENABLE ROW LEVEL SECURITY;
-- No policies — see file header.

-- ═══ 3. Tutoring relationships — the matched pair + pre/post tracking ══════
-- Mirrors the interventions/outcomes shape (src/lib/riskEngine.ts,
-- src/lib/interventions.ts syncOutcomesFromMarks) per research section 6:
-- one row per relationship carries start context; pre/post scores are
-- computed by application code from real student_attempts rows, not stored
-- as a running mutation, matching the existing before/after convention.

CREATE TABLE IF NOT EXISTS public.peer_tutoring_relationships (
  id                  BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  school_id           BIGINT NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,

  tutor_student_id    BIGINT NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  tutee_student_id    BIGINT NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  subject_id          BIGINT NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  topic_id            BIGINT NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,

  -- Captured at match time — the ability gap that justified this match
  -- (research section 2: 20-50 = good, >60 = flagged/needs approval).
  tutor_score_pct_at_match INT2 NOT NULL CHECK (tutor_score_pct_at_match BETWEEN 0 AND 100),
  tutee_score_pct_at_match INT2 NOT NULL CHECK (tutee_score_pct_at_match BETWEEN 0 AND 100),
  ability_gap         INT2 NOT NULL,   -- tutor - tutee, signed, can be recomputed but stored for audit clarity

  grade_difference    INT2 NOT NULL DEFAULT 0,  -- tutor grade - tutee grade; 0 = same-grade (default), up to 2 cross-grade

  -- Matches heuristic: 'good_gap' (20-50, auto), 'small_gap' (<20, auto but
  -- weak), 'flagged_large_gap' (>60, needs teacher approval before starting).
  gap_category        TEXT NOT NULL CHECK (gap_category IN ('good_gap', 'small_gap', 'flagged_large_gap')),

  -- Teacher approval required when gap_category = 'flagged_large_gap' or
  -- grade_difference > 1 (cross-grade beyond the simple ±1 default).
  requires_approval   BOOLEAN NOT NULL DEFAULT false,
  approved_by         BIGINT REFERENCES public.teachers(id) ON DELETE SET NULL,
  approved_at         TIMESTAMPTZ,

  -- subject_teacher_id captured at match time (not re-derived later) — the
  -- teacher_students row for (tutee, subject) at match time. This is who sees
  -- session/academic oversight for this relationship (see file header note).
  subject_teacher_id  BIGINT REFERENCES public.teachers(id) ON DELETE SET NULL,

  -- Pre-score baseline for section 6 impact tracking: the tutee's topic-test
  -- score_pct immediately before the first session — captured once, at
  -- match/start time, never overwritten (mirrors outcomes.previousAvg).
  pre_score_pct       INT2 NOT NULL CHECK (pre_score_pct BETWEEN 0 AND 100),
  pre_score_attempt_id BIGINT REFERENCES public.student_attempts(id) ON DELETE SET NULL,

  status              TEXT NOT NULL DEFAULT 'pending_approval' CHECK (status IN ('pending_approval', 'active', 'completed', 'ended_early', 'declined')),

  started_at          TIMESTAMPTZ,   -- set when first session begins
  ended_at            TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_peer_tutoring_rel_tutor
  ON public.peer_tutoring_relationships(tutor_student_id, status);
CREATE INDEX IF NOT EXISTS idx_peer_tutoring_rel_tutee
  ON public.peer_tutoring_relationships(tutee_student_id, status);
CREATE INDEX IF NOT EXISTS idx_peer_tutoring_rel_subject_teacher
  ON public.peer_tutoring_relationships(subject_teacher_id, status);
CREATE INDEX IF NOT EXISTS idx_peer_tutoring_rel_pending_approval
  ON public.peer_tutoring_relationships(school_id) WHERE requires_approval AND approved_at IS NULL;

ALTER TABLE public.peer_tutoring_relationships ENABLE ROW LEVEL SECURITY;
-- No policies — see file header.

-- Pre/post outcome, computed and recorded once a relationship completes or
-- ends — the exact shape of src/lib/interventions.ts outcomes table
-- (previousAvg/newAvg/improvement/result), applied to topic score_pct instead
-- of mark averages. One row per relationship (onConflict: relationship_id),
-- same upsert pattern as recordOutcome().
CREATE TABLE IF NOT EXISTS public.peer_tutoring_outcomes (
  id                  BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  relationship_id     BIGINT NOT NULL REFERENCES public.peer_tutoring_relationships(id) ON DELETE CASCADE,

  pre_score_pct       INT2 NOT NULL,
  post_score_pct      INT2 NOT NULL,
  post_score_attempt_id BIGINT REFERENCES public.student_attempts(id) ON DELETE SET NULL,
  gain                INT2 NOT NULL,   -- post - pre

  -- Bucketed per research section 6: "Clear improvement" (+15+), "Some
  -- improvement" (+5-14), "Little/no improvement" (<=+4 or decline).
  result              TEXT NOT NULL CHECK (result IN ('clear_improvement', 'some_improvement', 'little_or_no_improvement')),

  verified_session_count INT2 NOT NULL DEFAULT 0,  -- how many verified sessions this estimate is based on
  recorded_at         TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE(relationship_id)
);

ALTER TABLE public.peer_tutoring_outcomes ENABLE ROW LEVEL SECURITY;
-- No policies — see file header.

-- ═══ 4. Sessions — structured session log + template completion ═══════════
-- One row per scheduled/held session. The 5-step template (research section
-- 3) is stored as a JSONB checklist of {step, completed, completedAt} so the
-- UI can render/resume a session's progress; not normalized into a separate
-- table since the template is fixed (5 steps) and never queried per-step.

CREATE TABLE IF NOT EXISTS public.peer_tutoring_sessions (
  id                  BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  relationship_id     BIGINT NOT NULL REFERENCES public.peer_tutoring_relationships(id) ON DELETE CASCADE,
  school_id           BIGINT NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,

  scheduled_for        TIMESTAMPTZ,
  started_at           TIMESTAMPTZ,
  ended_at              TIMESTAMPTZ,

  -- Session template completion (research section 3's 5-step script):
  -- [{ step: 'set_goal'|'tutee_attempts'|'tutor_explains'|'guided_practice'|'recap', completedAt: iso|null }]
  template_progress    JSONB NOT NULL DEFAULT '[]'::jsonb,

  goal_text             TEXT,           -- step 1: the specific goal the pair agreed on
  tutee_confidence_before INT2 CHECK (tutee_confidence_before BETWEEN 1 AND 5),
  tutee_confidence_after  INT2 CHECK (tutee_confidence_after BETWEEN 1 AND 5),  -- step 5 self-rating

  -- Tutee confirmation — this is what makes a session "verified" (research
  -- section 4), not just self-reported/logged. Must happen within 24h of
  -- ended_at for the session to count toward badges (checked in application
  -- code against created_at, not enforced here).
  tutee_confirmed_at     TIMESTAMPTZ,
  tutee_confirmation     TEXT CHECK (tutee_confirmation IN ('yes', 'partly', 'no')),
  tutee_confirmation_comment TEXT,

  status                TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled', 'no_show')),
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_peer_tutoring_sessions_relationship
  ON public.peer_tutoring_sessions(relationship_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_peer_tutoring_sessions_unconfirmed
  ON public.peer_tutoring_sessions(ended_at) WHERE status = 'completed' AND tutee_confirmed_at IS NULL;

ALTER TABLE public.peer_tutoring_sessions ENABLE ROW LEVEL SECURITY;
-- No policies — see file header.

-- ═══ 5. Recognition / badges — tied to verified sessions only ═════════════
-- Tiered, not raw hours (research section 4). Recomputed by application code
-- whenever a session becomes verified; this table stores the current tier
-- per tutor, not a running ledger (a student earns each tier once).

CREATE TABLE IF NOT EXISTS public.peer_tutor_badges (
  id                  BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  student_id          BIGINT NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  school_id           BIGINT NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,

  tier                TEXT NOT NULL CHECK (tier IN ('bronze', 'silver', 'gold')),
  verified_session_count_at_award INT2 NOT NULL,
  awarded_at          TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE(student_id, tier)
);

CREATE INDEX IF NOT EXISTS idx_peer_tutor_badges_student
  ON public.peer_tutor_badges(student_id);

ALTER TABLE public.peer_tutor_badges ENABLE ROW LEVEL SECURITY;
-- No policies — see file header.

-- ═══ 6. Safety / moderation — report a concern, named staff recipient ═════
-- Mirrors wellbeing_safety_flags shape (homeroom_teacher_id captured at
-- creation time, acknowledged_at/by, status tracking) but lower risk tier per
-- research section 5 — no separate crisis-vs-routine split needed here, one
-- table covers all "report a concern" submissions.

CREATE TABLE IF NOT EXISTS public.peer_tutoring_concerns (
  id                  BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  school_id           BIGINT NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  relationship_id     BIGINT REFERENCES public.peer_tutoring_relationships(id) ON DELETE SET NULL,
  session_id          BIGINT REFERENCES public.peer_tutoring_sessions(id) ON DELETE SET NULL,

  reported_by_student_id BIGINT NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  about_student_id       BIGINT REFERENCES public.students(id) ON DELETE SET NULL,  -- optional — a concern may be about the other party or general

  category            TEXT NOT NULL CHECK (category IN ('uncomfortable_behaviour', 'pressured_or_harassed', 'inappropriate_content', 'not_following_rules', 'other')),
  description          TEXT NOT NULL,

  -- Named staff recipient — the reporting student's homeroom teacher,
  -- captured at report time (see file header for the scoping decision).
  homeroom_teacher_id   BIGINT REFERENCES public.teachers(id) ON DELETE SET NULL,

  status                TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved')),
  acknowledged_at        TIMESTAMPTZ,
  acknowledged_by        BIGINT REFERENCES public.teachers(id) ON DELETE SET NULL,
  resolution_notes        TEXT,
  resolved_at             TIMESTAMPTZ,

  created_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_peer_tutoring_concerns_teacher_open
  ON public.peer_tutoring_concerns(homeroom_teacher_id) WHERE status != 'resolved';
CREATE INDEX IF NOT EXISTS idx_peer_tutoring_concerns_student
  ON public.peer_tutoring_concerns(reported_by_student_id, created_at DESC);

ALTER TABLE public.peer_tutoring_concerns ENABLE ROW LEVEL SECURITY;
-- No policies — see file header.

-- ═══ 7. Prior interaction history — tie-break input for matching ══════════
-- Denormalized append-only log of completed relationships, used purely to
-- compute "prior positive interactions" as a matching tie-breaker (research
-- section 2). Derivable from peer_tutoring_relationships + outcomes, but kept
-- as an explicit small table so the matcher doesn't need a heavy join at
-- match time for what's a cheap lookup ("has this pair worked well before").

CREATE TABLE IF NOT EXISTS public.peer_tutoring_prior_pairs (
  id                  BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  student_a_id        BIGINT NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  student_b_id        BIGINT NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  relationship_id     BIGINT NOT NULL REFERENCES public.peer_tutoring_relationships(id) ON DELETE CASCADE,
  was_positive         BOOLEAN NOT NULL,  -- derived from tutee_confirmation majority ('yes'/'partly' = true) across the relationship's sessions
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_peer_tutoring_prior_pairs_lookup
  ON public.peer_tutoring_prior_pairs(student_a_id, student_b_id);

ALTER TABLE public.peer_tutoring_prior_pairs ENABLE ROW LEVEL SECURITY;
-- No policies — see file header.

-- ─────────────────────────────────────────────────────────────────────────────
-- Deferred / out of scope for this build (confirmed with project owner
-- 2026-07-19, see research doc "probably overkill for now" list):
--   - Complex personality-matching (Big Five etc.) — only the two optional
--     rapport-proxy booleans above.
--   - Formal multi-hour tutor training / external certification — orientation
--     is a single timestamp gate, no course-progress tracking table.
--   - Dedicated video-calling infrastructure — no call/room table; sessions
--     coordinate scheduling only, actual video (if needed) happens via the
--     school's existing tools, referenced by plain text/URL in application
--     code if at all, not modeled here.
--   - Points-market / redeemable-reward economies — badges are a fixed
--     3-tier ladder, no points ledger or redemption table.
--   - RCT-style per-pair evaluation — peer_tutoring_outcomes is a simple
--     pre/post estimate, explicitly not causal proof (surfaced as such in UI).
-- ─────────────────────────────────────────────────────────────────────────────
