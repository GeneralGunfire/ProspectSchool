-- Parent contact log
-- Teachers log when they contacted a student's parent/guardian.

CREATE TABLE public.parent_contacts (
  id          BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  student_id  BIGINT NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  teacher_id  BIGINT NOT NULL REFERENCES public.teachers(id) ON DELETE CASCADE,
  school_id   BIGINT NOT NULL REFERENCES public.schools(id)  ON DELETE CASCADE,
  method      TEXT   NOT NULL CHECK (method IN ('call','email','in_person','sms','other')),
  note        TEXT,
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

CREATE INDEX idx_parent_contacts_teacher_student
  ON public.parent_contacts (teacher_id, student_id, created_at DESC);

CREATE INDEX idx_parent_contacts_teacher_school
  ON public.parent_contacts (teacher_id, school_id, student_id, created_at DESC);

-- RLS
ALTER TABLE public.parent_contacts ENABLE ROW LEVEL SECURITY;

-- Teachers can only see/manage their own contact logs
CREATE POLICY "teacher_own_contacts" ON public.parent_contacts
  FOR ALL
  USING (
    teacher_id IN (
      SELECT id FROM public.teachers
      WHERE school_id = parent_contacts.school_id
    )
  );
