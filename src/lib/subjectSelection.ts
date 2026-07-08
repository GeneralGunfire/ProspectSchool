import { supabaseAdmin } from './supabase';

// ── Types ─────────────────────────────────────────────────────

export interface SubjectSelectionWindow {
  id: number;
  school_id: number;
  academic_year: number; // the year students will be entering Grade 10
  opens_at: string; // ISO date
  closes_at: string; // ISO date
  is_open: boolean; // manual override — admin can force-close even within date range
}

export type SetWindowResult =
  | { success: true }
  | { success: false; error: string };

export interface SubjectCatalogEntry {
  id: number;
  code: string; // e.g. 'accounting', 'egd', 'tourism', 'history', 'physical_science', 'ap_math'
  label: string;
  category: string; // 'compulsory' | 'elective_a' | 'elective_b' | 'additional' | 'extra'
  description: string;
  what_it_covers: string[];
  career_paths: string[];
  requirements: string | null; // e.g. "Requires 80%+ in Grade 9 Mathematics"
  sort_order: number;
  // Richer info shown in the expanded card — all editable via Supabase (subject_catalog table)
  difficulty: number | null; // 1 (easy) – 5 (very demanding)
  usefulness: number | null; // 1 (niche) – 5 (broadly useful for further study/careers)
  national_avg_pct: number | null; // approximate NSC national average % — illustrative, not a live/official feed
  honest_notes: string | null; // candid pros/cons/realistic advice, not marketing copy
}

export type SelectionStatus = 'draft' | 'submitted' | 'teacher_approved' | 'rejected' | 'admin_received';

export interface SubjectChoices {
  math_stream: 'pure_math' | 'math_lit';
  elective_a: 'accounting' | 'egd' | 'tourism'; // pick 1 of 3
  elective_b: 'history' | 'physical_science'; // pick 1 of 2
  additional: 'history' | 'tourism' | 'arabic' | null; // pick 1, optional
  ap_math: boolean; // requires 80%+ Math — informational only, not DB-enforced
}

export interface SubjectSelection {
  id: number;
  student_id: number;
  school_id: number;
  academic_year: number;
  choices: SubjectChoices;
  status: SelectionStatus;
  teacher_comment: string | null;
  submitted_at: string | null;
  teacher_reviewed_at: string | null;
  teacher_reviewed_by: number | null;
  admin_received_at: string | null;
  updated_at: string;
}

export interface StudentSelectionRow {
  id: number;
  student_id: number;
  name: string;
  surname: string;
  student_code: string;
  cohort_name: string | null;
  status: SelectionStatus;
  choices: SubjectChoices | null;
  submitted_at: string | null;
  teacher_comment: string | null;
}

// ── Window: admin fetch/set ──

export async function fetchActiveWindow(school_id: number): Promise<SubjectSelectionWindow | null> {
  const { data, error } = await supabaseAdmin
    .from('subject_selection_windows')
    .select('*')
    .eq('school_id', school_id)
    .order('academic_year', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;
  return data;
}

export async function setWindow(
  school_id: number,
  academic_year: number,
  opens_at: string,
  closes_at: string,
  is_open: boolean
): Promise<SetWindowResult> {
  const { data: existing } = await supabaseAdmin
    .from('subject_selection_windows')
    .select('id')
    .eq('school_id', school_id)
    .eq('academic_year', academic_year)
    .maybeSingle();

  const { error } = existing
    ? await supabaseAdmin
        .from('subject_selection_windows')
        .update({ opens_at, closes_at, is_open })
        .eq('id', existing.id)
    : await supabaseAdmin
        .from('subject_selection_windows')
        .insert({ school_id, academic_year, opens_at, closes_at, is_open });

  if (error) return { success: false, error: 'Failed to save window.' };
  return { success: true };
}

export function isWindowCurrentlyOpen(w: SubjectSelectionWindow | null): boolean {
  if (!w || !w.is_open) return false;
  const today = new Date().toISOString().slice(0, 10);
  return today >= w.opens_at && today <= w.closes_at;
}

// ── Catalog: fetch (student + admin use the same read) ──

export async function fetchSubjectCatalog(): Promise<SubjectCatalogEntry[]> {
  const { data, error } = await supabaseAdmin
    .from('subject_catalog')
    .select('*')
    .order('sort_order');

  if (error || !data) return [];
  return data;
}

export type SaveCatalogEntryResult =
  | { success: true }
  | { success: false; error: string };

export async function saveCatalogEntry(entry: Partial<SubjectCatalogEntry> & { code: string }): Promise<SaveCatalogEntryResult> {
  const { error } = await supabaseAdmin
    .from('subject_catalog')
    .upsert(entry, { onConflict: 'code' });

  if (error) return { success: false, error: `Failed to save: ${error.message}` };
  return { success: true };
}

// ── Selection: student fetch/save own draft ──

export async function fetchStudentSelection(
  student_id: number,
  academic_year: number
): Promise<SubjectSelection | null> {
  const { data, error } = await supabaseAdmin
    .from('subject_selections')
    .select('*')
    .eq('student_id', student_id)
    .eq('academic_year', academic_year)
    .maybeSingle();

  if (error || !data) return null;
  return data;
}

export type SaveSelectionResult =
  | { success: true }
  | { success: false; error: string };

export async function saveDraftSelection(
  student_id: number,
  school_id: number,
  academic_year: number,
  choices: SubjectChoices
): Promise<SaveSelectionResult> {
  const { data: existing } = await supabaseAdmin
    .from('subject_selections')
    .select('id, status')
    .eq('student_id', student_id)
    .eq('academic_year', academic_year)
    .maybeSingle();

  // Only draft or rejected selections can still be freely edited before teacher approval.
  if (existing && existing.status !== 'draft' && existing.status !== 'submitted' && existing.status !== 'rejected') {
    return { success: false, error: 'This selection has already been approved and can no longer be edited.' };
  }

  const { error } = existing
    ? await supabaseAdmin
        .from('subject_selections')
        .update({ choices, status: 'draft' })
        .eq('id', existing.id)
    : await supabaseAdmin
        .from('subject_selections')
        .insert({ student_id, school_id, academic_year, choices, status: 'draft' });

  if (error) return { success: false, error: `Failed to save: ${error.message}` };
  return { success: true };
}

export async function submitSelection(
  student_id: number,
  academic_year: number
): Promise<SaveSelectionResult> {
  const { error } = await supabaseAdmin
    .from('subject_selections')
    .update({ status: 'submitted', submitted_at: new Date().toISOString(), teacher_comment: null })
    .eq('student_id', student_id)
    .eq('academic_year', academic_year);

  if (error) return { success: false, error: `Failed to submit: ${error.message}` };
  return { success: true };
}

// ── Teacher: fetch pending submissions for their homeroom, approve/reject ──

export async function fetchHomeroomSelections(
  cohort_id: number,
  academic_year: number
): Promise<StudentSelectionRow[]> {
  const { data: students, error } = await supabaseAdmin
    .from('students')
    .select('id, name, surname, student_code, cohorts(name)')
    .eq('cohort_id', cohort_id)
    .order('surname');

  if (error || !students) return [];

  const studentIds = students.map((s) => s.id);
  if (studentIds.length === 0) return [];

  const { data: selections } = await supabaseAdmin
    .from('subject_selections')
    .select('*')
    .in('student_id', studentIds)
    .eq('academic_year', academic_year);

  const byStudent = new Map((selections ?? []).map((s) => [s.student_id, s]));

  return students.map((s: any) => {
    const sel = byStudent.get(s.id);
    return {
      id: sel?.id ?? 0,
      student_id: s.id,
      name: s.name,
      surname: s.surname,
      student_code: s.student_code,
      cohort_name: s.cohorts?.name ?? null,
      status: sel?.status ?? 'draft',
      choices: sel?.choices ?? null,
      submitted_at: sel?.submitted_at ?? null,
      teacher_comment: sel?.teacher_comment ?? null,
    };
  });
}

export async function teacherApproveSelection(
  student_id: number,
  academic_year: number,
  teacher_id: number
): Promise<SaveSelectionResult> {
  const { error } = await supabaseAdmin
    .from('subject_selections')
    .update({
      status: 'teacher_approved',
      teacher_reviewed_at: new Date().toISOString(),
      teacher_reviewed_by: teacher_id,
      teacher_comment: null,
    })
    .eq('student_id', student_id)
    .eq('academic_year', academic_year);

  if (error) return { success: false, error: `Failed to approve: ${error.message}` };
  return { success: true };
}

export async function teacherRejectSelection(
  student_id: number,
  academic_year: number,
  teacher_id: number,
  comment: string
): Promise<SaveSelectionResult> {
  const { error } = await supabaseAdmin
    .from('subject_selections')
    .update({
      status: 'rejected',
      teacher_reviewed_at: new Date().toISOString(),
      teacher_reviewed_by: teacher_id,
      teacher_comment: comment,
    })
    .eq('student_id', student_id)
    .eq('academic_year', academic_year);

  if (error) return { success: false, error: `Failed to reject: ${error.message}` };
  return { success: true };
}

// ── Admin: bulk-collect teacher-approved selections into "received" ──

export async function fetchAdminSelections(
  school_id: number,
  academic_year: number
): Promise<StudentSelectionRow[]> {
  const { data: selections, error } = await supabaseAdmin
    .from('subject_selections')
    .select('*, students(name, surname, student_code, cohorts(name))')
    .eq('school_id', school_id)
    .eq('academic_year', academic_year)
    .in('status', ['teacher_approved', 'admin_received'])
    .order('submitted_at');

  if (error || !selections) return [];

  return selections.map((s: any) => ({
    id: s.id,
    student_id: s.student_id,
    name: s.students?.name ?? '',
    surname: s.students?.surname ?? '',
    student_code: s.students?.student_code ?? '',
    cohort_name: s.students?.cohorts?.name ?? null,
    status: s.status,
    choices: s.choices,
    submitted_at: s.submitted_at,
    teacher_comment: s.teacher_comment,
  }));
}

export async function markAdminReceived(selection_id: number): Promise<SaveSelectionResult> {
  const { error } = await supabaseAdmin
    .from('subject_selections')
    .update({ status: 'admin_received', admin_received_at: new Date().toISOString() })
    .eq('id', selection_id);

  if (error) return { success: false, error: `Failed: ${error.message}` };
  return { success: true };
}

// ── Admin: permanently delete a stored submission ──

export async function deleteSelection(selection_id: number): Promise<SaveSelectionResult> {
  const { error } = await supabaseAdmin
    .from('subject_selections')
    .delete()
    .eq('id', selection_id);

  if (error) return { success: false, error: `Failed to delete: ${error.message}` };
  return { success: true };
}
