-- ═══════════════════════════════════════════════════════════════════════════
-- RUN THIS ONE FILE in the Supabase Studio SQL editor for the Prospect project.
-- Safe to run no matter what you've already tried before (including never
-- having run anything) — every statement below is written to not error or
-- duplicate data if some or all of this already exists.
-- ═══════════════════════════════════════════════════════════════════════════

-- ── STEP 1: create every peer tutoring table if it doesn't already exist ────

CREATE TABLE IF NOT EXISTS public.peer_tutor_profiles (
  id                  BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  student_id          BIGINT NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  school_id           BIGINT NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  orientation_completed_at TIMESTAMPTZ,
  conduct_acknowledged_at  TIMESTAMPTZ,
  prefers_known_students    BOOLEAN,
  is_active           BOOLEAN NOT NULL DEFAULT true,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(student_id)
);
CREATE INDEX IF NOT EXISTS idx_peer_tutor_profiles_school
  ON public.peer_tutor_profiles(school_id) WHERE is_active;
ALTER TABLE public.peer_tutor_profiles ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.peer_tutor_topics (
  id                  BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  tutor_profile_id    BIGINT NOT NULL REFERENCES public.peer_tutor_profiles(id) ON DELETE CASCADE,
  subject_id          BIGINT NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  topic_id            BIGINT NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
  demonstrated_score_pct INT2 NOT NULL CHECK (demonstrated_score_pct BETWEEN 0 AND 100),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(tutor_profile_id, topic_id)
);
CREATE INDEX IF NOT EXISTS idx_peer_tutor_topics_lookup
  ON public.peer_tutor_topics(subject_id, topic_id);
ALTER TABLE public.peer_tutor_topics ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.peer_tutoring_requests (
  id                  BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  student_id          BIGINT NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  school_id           BIGINT NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  subject_id          BIGINT NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  topic_id            BIGINT NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
  grade               INT2,
  conduct_acknowledged_at TIMESTAMPTZ,
  prefers_known_students  BOOLEAN,
  status              TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'matched', 'cancelled')),
  fulfilled_by_relationship_id BIGINT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_peer_tutoring_requests_open
  ON public.peer_tutoring_requests(subject_id, topic_id) WHERE status = 'open';
CREATE INDEX IF NOT EXISTS idx_peer_tutoring_requests_student
  ON public.peer_tutoring_requests(student_id);
ALTER TABLE public.peer_tutoring_requests ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.peer_tutoring_relationships (
  id                  BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  school_id           BIGINT NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  tutor_student_id    BIGINT NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  tutee_student_id    BIGINT NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  subject_id          BIGINT NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  topic_id            BIGINT NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
  tutor_score_pct_at_match INT2 NOT NULL CHECK (tutor_score_pct_at_match BETWEEN 0 AND 100),
  tutee_score_pct_at_match INT2 NOT NULL CHECK (tutee_score_pct_at_match BETWEEN 0 AND 100),
  ability_gap         INT2 NOT NULL,
  grade_difference    INT2 NOT NULL DEFAULT 0,
  gap_category        TEXT NOT NULL CHECK (gap_category IN ('good_gap', 'small_gap', 'flagged_large_gap')),
  requires_approval   BOOLEAN NOT NULL DEFAULT false,
  approved_by         BIGINT REFERENCES public.teachers(id) ON DELETE SET NULL,
  approved_at         TIMESTAMPTZ,
  subject_teacher_id  BIGINT REFERENCES public.teachers(id) ON DELETE SET NULL,
  pre_score_pct       INT2 NOT NULL CHECK (pre_score_pct BETWEEN 0 AND 100),
  pre_score_attempt_id BIGINT REFERENCES public.student_attempts(id) ON DELETE SET NULL,
  status              TEXT NOT NULL DEFAULT 'active',
  started_at          TIMESTAMPTZ,
  ended_at            TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_peer_tutoring_rel_tutor
  ON public.peer_tutoring_relationships(tutor_student_id, status);
CREATE INDEX IF NOT EXISTS idx_peer_tutoring_rel_tutee
  ON public.peer_tutoring_relationships(tutee_student_id, status);
CREATE INDEX IF NOT EXISTS idx_peer_tutoring_rel_subject_teacher
  ON public.peer_tutoring_relationships(subject_teacher_id, status);
ALTER TABLE public.peer_tutoring_relationships ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.peer_tutoring_outcomes (
  id                  BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  relationship_id     BIGINT NOT NULL REFERENCES public.peer_tutoring_relationships(id) ON DELETE CASCADE,
  pre_score_pct       INT2 NOT NULL,
  post_score_pct      INT2 NOT NULL,
  post_score_attempt_id BIGINT REFERENCES public.student_attempts(id) ON DELETE SET NULL,
  gain                INT2 NOT NULL,
  result              TEXT NOT NULL CHECK (result IN ('clear_improvement', 'some_improvement', 'little_or_no_improvement')),
  verified_session_count INT2 NOT NULL DEFAULT 0,
  recorded_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(relationship_id)
);
ALTER TABLE public.peer_tutoring_outcomes ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.peer_tutoring_sessions (
  id                  BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  relationship_id     BIGINT NOT NULL REFERENCES public.peer_tutoring_relationships(id) ON DELETE CASCADE,
  school_id           BIGINT NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  scheduled_for        TIMESTAMPTZ,
  started_at           TIMESTAMPTZ,
  ended_at              TIMESTAMPTZ,
  template_progress    JSONB NOT NULL DEFAULT '[]'::jsonb,
  goal_text             TEXT,
  tutee_confidence_before INT2 CHECK (tutee_confidence_before BETWEEN 1 AND 5),
  tutee_confidence_after  INT2 CHECK (tutee_confidence_after BETWEEN 1 AND 5),
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

CREATE TABLE IF NOT EXISTS public.peer_tutoring_concerns (
  id                  BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  school_id           BIGINT NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  relationship_id     BIGINT REFERENCES public.peer_tutoring_relationships(id) ON DELETE SET NULL,
  session_id          BIGINT REFERENCES public.peer_tutoring_sessions(id) ON DELETE SET NULL,
  reported_by_student_id BIGINT NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  about_student_id       BIGINT REFERENCES public.students(id) ON DELETE SET NULL,
  category            TEXT NOT NULL CHECK (category IN ('uncomfortable_behaviour', 'pressured_or_harassed', 'inappropriate_content', 'not_following_rules', 'other')),
  description          TEXT NOT NULL,
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

CREATE TABLE IF NOT EXISTS public.peer_tutoring_prior_pairs (
  id                  BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  student_a_id        BIGINT NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  student_b_id        BIGINT NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  relationship_id     BIGINT NOT NULL REFERENCES public.peer_tutoring_relationships(id) ON DELETE CASCADE,
  was_positive         BOOLEAN NOT NULL,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_peer_tutoring_prior_pairs_lookup
  ON public.peer_tutoring_prior_pairs(student_a_id, student_b_id);
ALTER TABLE public.peer_tutoring_prior_pairs ENABLE ROW LEVEL SECURITY;

-- ── STEP 2: fix any leftover data/columns from an earlier partial run ───────
-- (No-ops if you never ran anything before — every clause below only acts
-- on things that might exist from an earlier attempt.)

-- Add the "which relationship fulfilled this request" link if missing.
ALTER TABLE public.peer_tutoring_requests
  ADD COLUMN IF NOT EXISTS fulfilled_by_relationship_id BIGINT;

DO $$ BEGIN
  ALTER TABLE public.peer_tutoring_requests
    ADD CONSTRAINT fk_peer_tutoring_requests_fulfilled_rel
    FOREIGN KEY (fulfilled_by_relationship_id) REFERENCES public.peer_tutoring_relationships(id) ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE INDEX IF NOT EXISTS idx_peer_tutoring_requests_fulfilled_rel
  ON public.peer_tutoring_requests(fulfilled_by_relationship_id) WHERE fulfilled_by_relationship_id IS NOT NULL;

-- Clear out any relationship stuck at the old 'pending_approval' status
-- (teacher approval has been removed from this feature entirely).
UPDATE public.peer_tutoring_relationships SET status = 'declined' WHERE status = 'pending_approval';

-- Release any request still pointing at a since-cleared pending relationship.
UPDATE public.peer_tutoring_requests r
SET status = 'cancelled'
FROM public.peer_tutoring_relationships rel
WHERE r.fulfilled_by_relationship_id = rel.id AND rel.status = 'declined' AND r.status = 'matched';

-- Make sure the status column only allows the current, final set of values.
ALTER TABLE public.peer_tutoring_relationships DROP CONSTRAINT IF EXISTS peer_tutoring_relationships_status_check;
ALTER TABLE public.peer_tutoring_relationships
  ADD CONSTRAINT peer_tutoring_relationships_status_check
  CHECK (status IN ('active', 'completed', 'ended_early', 'declined'));

-- Resolve any duplicate open relationships for the same (tutor, tutee, topic)
-- pairing — keep the oldest, decline the rest — so the uniqueness rule below
-- can be created without erroring.
WITH ranked AS (
  SELECT id, ROW_NUMBER() OVER (
    PARTITION BY tutor_student_id, tutee_student_id, topic_id ORDER BY created_at ASC
  ) AS rn
  FROM public.peer_tutoring_relationships
  WHERE status = 'active'
)
UPDATE public.peer_tutoring_relationships
SET status = 'declined'
WHERE id IN (SELECT id FROM ranked WHERE rn > 1);

DROP INDEX IF EXISTS idx_peer_tutoring_rel_pending_approval;
CREATE UNIQUE INDEX IF NOT EXISTS uq_peer_tutoring_relationships_open_pairing
  ON public.peer_tutoring_relationships (tutor_student_id, tutee_student_id, topic_id)
  WHERE status = 'active';

-- Done. After this runs with no errors, the Peer Tutoring feature is fully
-- set up and any previously-stuck relationships have been cleared.
