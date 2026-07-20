-- ─────────────────────────────────────────────────────────────────────────────
-- Hand-run in Supabase Studio SQL editor. NOT a tracked migration (per CLAUDE.md
-- convention — schema changes here are executed manually by the project owner,
-- never by an AI assistant, and never via `supabase migration up`).
-- ─────────────────────────────────────────────────────────────────────────────
-- Wellbeing Help Expansion — single genuinely-new schema need surfaced during
-- the build (everything else in this expansion — help content, teacher
-- guidance content, concern-level/trend derivation — needed zero schema
-- changes, see .planning/research/WELLBEING_HELP_EXPANSION_RESEARCH.md build
-- report).
--
-- wellbeing_access_log.accessor_teacher_id (see .planning/sql/
-- 2026-07-19_wellbeing_checkins.sql) is a real FK to public.teachers(id).
-- The new parent-facing wellbeing summary view (research section 5) needs to
-- log access by a parent, per section 7's "extend access logging to
-- parent-summary views" requirement — writing a parent_id into
-- accessor_teacher_id would either violate the FK (if no teacher happens to
-- share that id) or, worse, silently misattribute the log row to an
-- unrelated teacher (if one does). This adds a separate nullable FK column
-- instead of overloading the existing one.
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE public.wellbeing_access_log
  ADD COLUMN IF NOT EXISTS accessor_parent_id BIGINT REFERENCES public.parents(id) ON DELETE SET NULL;

-- Every row should have exactly one accessor (teacher OR parent), never both
-- and never neither — this constraint documents that intent and catches bugs
-- where a future code change forgets to set either column.
ALTER TABLE public.wellbeing_access_log
  DROP CONSTRAINT IF EXISTS wellbeing_access_log_one_accessor_chk;
ALTER TABLE public.wellbeing_access_log
  ADD CONSTRAINT wellbeing_access_log_one_accessor_chk
  CHECK (
    (accessor_teacher_id IS NOT NULL AND accessor_parent_id IS NULL)
    OR (accessor_teacher_id IS NULL AND accessor_parent_id IS NOT NULL)
  );

CREATE INDEX IF NOT EXISTS idx_wellbeing_access_log_parent_student
  ON public.wellbeing_access_log(student_id, accessed_at DESC)
  WHERE accessor_parent_id IS NOT NULL;
