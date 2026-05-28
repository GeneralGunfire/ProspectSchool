import { supabaseAdmin } from './supabase';

// ── Types ─────────────────────────────────────────────────────

export type MasteryLevel = 'not_started' | 'needs_practice' | 'mastered';

export interface StudyProgress {
  id: number;
  student_id: number;
  school_id: number;
  subject: string;
  grade: number;
  topic: string;
  mastery_level: MasteryLevel;
  last_attempt_score: string | null;
  total_attempts: number;
  last_accessed: string;
  updated_at: string;
}

// ── Load progress for a single topic ─────────────────────────

export async function loadTopicProgress(
  student_id: number,
  subject: string,
  grade: number,
  topic: string
): Promise<MasteryLevel> {
  const { data } = await supabaseAdmin
    .from('study_progress')
    .select('mastery_level')
    .eq('student_id', student_id)
    .eq('subject', subject)
    .eq('grade', grade)
    .eq('topic', topic)
    .maybeSingle();

  if (!data) return 'not_started';
  return data.mastery_level as MasteryLevel;
}

// ── Save / update progress for a single topic ─────────────────

export async function saveTopicProgress(
  student_id: number,
  school_id: number,
  subject: string,
  grade: number,
  topic: string,
  mastery_level: MasteryLevel,
  correct: number,
  total: number,
  attempts: number
): Promise<void> {
  await supabaseAdmin
    .from('study_progress')
    .upsert({
      student_id,
      school_id,
      subject,
      grade,
      topic,
      mastery_level,
      last_attempt_score: `${correct}/${total}`,
      total_attempts: attempts,
      last_accessed: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, { onConflict: 'student_id,subject,grade,topic' });
}

// ── Load all progress for a student (for their dashboard) ─────

export async function fetchStudentProgress(
  student_id: number,
  school_id: number
): Promise<StudyProgress[]> {
  const { data } = await supabaseAdmin
    .from('study_progress')
    .select('*')
    .eq('student_id', student_id)
    .eq('school_id', school_id)
    .order('last_accessed', { ascending: false });

  return data ?? [];
}

// ── Load all progress for all students a teacher teaches ──────

export interface StudentProgressSummary {
  student_id: number;
  student_name: string;
  student_surname: string;
  student_code: string;
  grade: number;
  cohort_name: string | null;
  topics_started: number;
  topics_mastered: number;
  topics_struggling: number; // needs_practice
  last_accessed: string | null;
  progress: StudyProgress[];
}

export async function fetchTeacherStudentProgress(
  teacher_id: number,
  school_id: number
): Promise<StudentProgressSummary[]> {
  // Get all students this teacher teaches
  const { data: links } = await supabaseAdmin
    .from('teacher_students')
    .select('student_id, students(id, name, surname, student_code, grade, cohort_id, cohorts(name))')
    .eq('teacher_id', teacher_id);

  if (!links || links.length === 0) return [];

  // Unique students
  const studentMap = new Map<number, any>();
  for (const l of links) {
    const s = (l as any).students;
    if (s && !studentMap.has(s.id)) studentMap.set(s.id, s);
  }

  const studentIds = [...studentMap.keys()];

  // Fetch all progress for these students
  const { data: progressRows } = await supabaseAdmin
    .from('study_progress')
    .select('*')
    .in('student_id', studentIds)
    .eq('school_id', school_id);

  const progressByStudent = new Map<number, StudyProgress[]>();
  for (const p of (progressRows ?? [])) {
    if (!progressByStudent.has(p.student_id)) progressByStudent.set(p.student_id, []);
    progressByStudent.get(p.student_id)!.push(p);
  }

  return [...studentMap.values()]
    .map(s => {
      const progress = progressByStudent.get(s.id) ?? [];
      const started   = progress.filter(p => p.mastery_level !== 'not_started').length;
      const mastered  = progress.filter(p => p.mastery_level === 'mastered').length;
      const struggling = progress.filter(p => p.mastery_level === 'needs_practice').length;
      const lastAccessed = progress.length > 0
        ? progress.sort((a, b) => new Date(b.last_accessed).getTime() - new Date(a.last_accessed).getTime())[0].last_accessed
        : null;

      return {
        student_id: s.id,
        student_name: s.name,
        student_surname: s.surname,
        student_code: s.student_code,
        grade: s.grade,
        cohort_name: s.cohorts?.name ?? null,
        topics_started: started,
        topics_mastered: mastered,
        topics_struggling: struggling,
        last_accessed: lastAccessed,
        progress,
      };
    })
    .sort((a, b) => a.student_surname.localeCompare(b.student_surname));
}
