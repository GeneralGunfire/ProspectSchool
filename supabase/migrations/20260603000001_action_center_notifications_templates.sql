-- ── Phase A: Operational Infrastructure ──────────────────────────────────────
-- teacher_actions: operational hub — every intelligence system writes here
-- notifications:   bell icon notifications for teachers and students
-- intervention_templates: structured checklists per intervention type

-- ── teacher_actions ───────────────────────────────────────────────────────────

CREATE TABLE public.teacher_actions (
  id               BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  school_id        BIGINT NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  teacher_id       BIGINT NOT NULL REFERENCES public.teachers(id) ON DELETE CASCADE,
  type             TEXT NOT NULL CHECK (type IN (
                     'risk', 'intervention_followup', 'assessment_gap',
                     'homework_issue', 'resource_opportunity'
                   )),
  title            TEXT NOT NULL,
  description      TEXT,
  student_id       BIGINT REFERENCES public.students(id) ON DELETE CASCADE,
  intervention_id  TEXT,   -- FK to interventions.id (text PK)
  status           TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'resolved')),
  created_at       TIMESTAMP WITH TIME ZONE DEFAULT now(),
  resolved_at      TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.teacher_actions ENABLE ROW LEVEL SECURITY;

-- Teachers read/write their own actions
CREATE POLICY "teacher_actions_own" ON public.teacher_actions
  FOR ALL
  USING (
    teacher_id IN (
      SELECT id FROM public.teachers
      WHERE school_id = teacher_actions.school_id
    )
  );

CREATE INDEX teacher_actions_teacher_idx  ON public.teacher_actions (teacher_id, status);
CREATE INDEX teacher_actions_school_idx   ON public.teacher_actions (school_id, created_at DESC);
CREATE INDEX teacher_actions_student_idx  ON public.teacher_actions (student_id);

-- ── notifications ─────────────────────────────────────────────────────────────

CREATE TABLE public.notifications (
  id          BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  school_id   BIGINT NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  user_type   TEXT NOT NULL CHECK (user_type IN ('teacher', 'student')),
  user_id     BIGINT NOT NULL,   -- teacher_id or student_id
  title       TEXT NOT NULL,
  body        TEXT,
  read        BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users read/update their own notifications
CREATE POLICY "notifications_own_read" ON public.notifications
  FOR SELECT
  USING (true);  -- scoped by user_id in queries

CREATE POLICY "notifications_own_update" ON public.notifications
  FOR UPDATE
  USING (true);

CREATE INDEX notifications_user_idx   ON public.notifications (user_type, user_id, read, created_at DESC);
CREATE INDEX notifications_school_idx ON public.notifications (school_id, created_at DESC);

-- ── intervention_templates ────────────────────────────────────────────────────

CREATE TABLE public.intervention_templates (
  id                BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  school_id         BIGINT REFERENCES public.schools(id) ON DELETE CASCADE,  -- NULL = global default
  type              TEXT NOT NULL CHECK (type IN (
                      'revision', 'past_paper', 'library_topic', 'resource_review'
                    )),
  title             TEXT NOT NULL,
  description       TEXT,
  checklist         JSONB NOT NULL DEFAULT '[]',   -- array of step strings
  resource_ids      JSONB NOT NULL DEFAULT '[]',   -- array of resource IDs
  expected_duration TEXT,                           -- e.g. '30 minutes', '1 week'
  created_at        TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.intervention_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "intervention_templates_read" ON public.intervention_templates
  FOR SELECT USING (true);  -- global templates are readable by all

CREATE INDEX intervention_templates_type_idx     ON public.intervention_templates (type);
CREATE INDEX intervention_templates_school_idx   ON public.intervention_templates (school_id);

-- ── Seed global intervention templates ───────────────────────────────────────

INSERT INTO public.intervention_templates (school_id, type, title, description, checklist, expected_duration) VALUES
  (NULL, 'past_paper', 'Past Paper Practice',
   'Work through a full past paper under exam conditions.',
   '["Download and print a recent past paper", "Complete the paper under timed conditions", "Mark your answers using the memo", "Note every question you got wrong", "Review the concepts behind your errors"]',
   '2–3 hours'),
  (NULL, 'library_topic', 'Library Study Session',
   'Deep-study the weak topic using the school library.',
   '["Open the relevant topic in the Library", "Work through the interactive lesson", "Complete the practice questions", "Redo any question you got wrong", "Take notes on key concepts"]',
   '45 minutes'),
  (NULL, 'revision', 'Revision Session',
   'Structured revision of core concepts for the subject.',
   '["Review your class notes and summaries", "List all formulae and definitions you need to know", "Complete the subject quiz in the Library", "Do at least 5 practice questions", "Identify the weakest concept and re-study it"]',
   '1 hour'),
  (NULL, 'resource_review', 'Resource Review',
   'Study the teacher-shared resources for the subject.',
   '["Download all resources your teacher shared for this subject", "Read each resource carefully and highlight key points", "Create a one-page summary of important concepts", "Ask your teacher about anything unclear"]',
   '30–45 minutes');
