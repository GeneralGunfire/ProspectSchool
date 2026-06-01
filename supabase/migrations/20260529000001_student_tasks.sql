-- ── student_tasks: personal study tasks created by students ──────────────────
-- Students can add their own tasks/reminders (separate from teacher events).
-- These appear on the calendar as purple dots alongside school events.

CREATE TABLE public.student_tasks (
  id          BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  student_id  BIGINT NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  school_id   BIGINT NOT NULL,
  title       TEXT NOT NULL,
  notes       TEXT,
  due_date    DATE NOT NULL,
  subject     TEXT,
  done        BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for fast per-student lookups
CREATE INDEX idx_student_tasks_student_id ON public.student_tasks (student_id);
CREATE INDEX idx_student_tasks_due_date   ON public.student_tasks (student_id, due_date);

-- RLS: each student can only see and modify their own tasks
ALTER TABLE public.student_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "student_own_tasks_select" ON public.student_tasks
  FOR SELECT USING (
    student_id = (
      SELECT id FROM public.students
      WHERE id = student_id
    )
  );

-- NOTE: The app uses supabaseAdmin (service role) which bypasses RLS for all writes.
-- RLS select policy provides an extra safety layer for direct API access.
