-- ─────────────────────────────────────────────────────────────────────────────
-- Hand-run in Supabase Studio SQL editor. NOT a tracked migration (per CLAUDE.md
-- convention — schema changes here are executed manually, not via `supabase
-- migration up`). Do not run this yourself if you are an AI assistant; hand it
-- to the user to run.
-- ─────────────────────────────────────────────────────────────────────────────
-- Adds a cache table for the unified ABC (Attendance / Behaviour / Course
-- performance) risk-scoring engine. One row per student, upserted whenever the
-- engine recomputes a score (RiskEnginePage load, Teacher Home load, etc).
-- Nothing reads this table as a source of truth for attendance/behaviour/marks
-- — it is purely a cache of the *derived* score + explanation, safe to drop and
-- recompute at any time.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.risk_scores (
  student_id            BIGINT PRIMARY KEY REFERENCES public.students(id) ON DELETE CASCADE,
  school_id             BIGINT NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,

  -- Domain sub-scores (0-2 each, see src/lib/riskEngine.ts for exact rules)
  attendance_score      NUMERIC NOT NULL,   -- weighted 0-2 (recency-blended)
  behaviour_score       NUMERIC NOT NULL,   -- weighted 0-2 (recency-blended)
  course_score          INT NOT NULL,       -- 0-2, worst-subject rollup

  -- Combined
  risk_total            NUMERIC NOT NULL,   -- R = attendance_score + behaviour_score + course_score
  risk_tier             TEXT NOT NULL CHECK (risk_tier IN ('high', 'moderate', 'none')),

  -- Explainability — plain-language reasons shown to the teacher verbatim
  reasons               JSONB NOT NULL DEFAULT '[]'::jsonb,

  -- Raw inputs the score was derived from, for debugging/audit/display
  attendance_rate_recent  NUMERIC,          -- % over last N weeks
  attendance_rate_term    NUMERIC,          -- % term-to-date
  behaviour_serious_recent INT,
  behaviour_serious_term   INT,
  worst_subject_id         BIGINT REFERENCES public.subjects(id),
  worst_subject_label      TEXT,

  computed_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_risk_scores_school_tier ON public.risk_scores(school_id, risk_tier);

-- No RLS: matches interventions/outcomes/teacher_actions, which are all
-- accessed exclusively via supabaseAdmin (service-role key) from server-side
-- lib code, never directly from the browser with the anon key.
