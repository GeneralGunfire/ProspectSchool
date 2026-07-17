import { supabaseAdmin } from './supabase';
import type { Subject } from './students';

// ── School Grade Subjects: which subjects a school offers per grade ──
// Config only — does not gate teacher_subjects, mark_sheets, or the
// Grade 9 subject selection flow. Those keep working off the global
// subjects catalog / their own hardcoded rules for now.

// Global catalog (subjects.school_id IS NULL) + this school's own custom
// subjects (subjects.school_id = school_id). Scoped to this page only —
// fetchSubjects() elsewhere in the app stays unscoped/global on purpose.
export async function fetchAvailableSubjects(school_id: number): Promise<Subject[]> {
  const { data, error } = await supabaseAdmin
    .from('subjects')
    .select('id, code, label, grades, school_id')
    .or(`school_id.is.null,school_id.eq.${school_id}`)
    .order('label');

  if (error || !data) return [];
  return data;
}

export type CreateCustomSubjectResult =
  | { success: true; subject: Subject }
  | { success: false; error: string };

// Creates a subject visible only to this school (subjects.school_id set).
export async function createCustomSubject(
  school_id: number,
  label: string
): Promise<CreateCustomSubjectResult> {
  const trimmed = label.trim();
  if (!trimmed) return { success: false, error: 'Subject name is required.' };

  const code = trimmed.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
  if (!code) return { success: false, error: 'Subject name must contain letters or numbers.' };

  const { data: existing } = await supabaseAdmin
    .from('subjects')
    .select('id')
    .eq('code', code)
    .maybeSingle();

  if (existing) {
    return { success: false, error: `A subject named "${trimmed}" already exists.` };
  }

  const { data, error } = await supabaseAdmin
    .from('subjects')
    .insert({ code, label: trimmed, grades: '8,9,10,11,12', school_id })
    .select('id, code, label, grades, school_id')
    .single();

  if (error || !data) {
    return { success: false, error: error?.message ?? 'Failed to create subject.' };
  }

  return { success: true, subject: data };
}

export interface SchoolGradeSubject {
  id: number;
  school_id: number;
  grade: number;
  subject_id: number;
  is_compulsory: boolean;
  subject_label: string;
  subject_code: string;
}

export async function fetchSchoolGradeSubjects(school_id: number): Promise<SchoolGradeSubject[]> {
  const { data, error } = await supabaseAdmin
    .from('school_grade_subjects')
    .select('id, school_id, grade, subject_id, is_compulsory, subjects(code, label)')
    .eq('school_id', school_id)
    .order('grade');

  if (error || !data) return [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.map((r: any) => ({
    id: r.id,
    school_id: r.school_id,
    grade: r.grade,
    subject_id: r.subject_id,
    is_compulsory: r.is_compulsory,
    subject_label: r.subjects?.label ?? '',
    subject_code: r.subjects?.code ?? '',
  }));
}

export type SetSchoolGradeSubjectsResult =
  | { success: true }
  | { success: false; error: string };

// Replaces all offered subjects for one school+grade with the given set.
export async function setSchoolGradeSubjects(
  school_id: number,
  grade: number,
  subjects: { subject_id: number; is_compulsory: boolean }[]
): Promise<SetSchoolGradeSubjectsResult> {
  const { error: deleteError } = await supabaseAdmin
    .from('school_grade_subjects')
    .delete()
    .eq('school_id', school_id)
    .eq('grade', grade);

  if (deleteError) return { success: false, error: 'Failed to update subjects.' };

  if (subjects.length === 0) return { success: true };

  const { error: insertError } = await supabaseAdmin
    .from('school_grade_subjects')
    .insert(subjects.map((s) => ({
      school_id,
      grade,
      subject_id: s.subject_id,
      is_compulsory: s.is_compulsory,
    })));

  if (insertError) return { success: false, error: 'Failed to save subjects.' };
  return { success: true };
}

export async function toggleSchoolGradeSubjectCompulsory(
  id: number,
  is_compulsory: boolean
): Promise<SetSchoolGradeSubjectsResult> {
  const { error } = await supabaseAdmin
    .from('school_grade_subjects')
    .update({ is_compulsory })
    .eq('id', id);

  if (error) return { success: false, error: 'Failed to update.' };
  return { success: true };
}
