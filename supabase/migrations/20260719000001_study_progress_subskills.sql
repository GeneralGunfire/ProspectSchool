-- Adds per-sub-skill (per learning-objective) diagnostic tracking to study_progress,
-- without changing the existing topic-level mastery_level shape or any current callers.
--
-- Shape of sub_skills: { [objective_id: string]: { correct: number, total: number, mastery_level: 'not_started' | 'needs_practice' | 'mastered' } }
-- objective_id values are authored per-topic in each topic's content file (e.g. src/features/study/data/library/algebra/grade10/term1/realNumberSystem.ts)
-- and are only meaningful in combination with (subject, grade, topic) — they are not globally unique.
ALTER TABLE public.study_progress
  ADD COLUMN IF NOT EXISTS sub_skills JSONB NOT NULL DEFAULT '{}'::jsonb;

COMMENT ON COLUMN public.study_progress.sub_skills IS
  'Per-learning-objective diagnostic breakdown for topics with multiple sub-skills. Keyed by topic-local objective_id.';
