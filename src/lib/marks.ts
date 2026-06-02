import { supabaseAdmin } from './supabase';

// ── Types ─────────────────────────────────────────────────────

export interface MarkSheet {
  id: number;
  school_id: number;
  teacher_id: number;
  subject_id: number;
  grade: number;
  title: string;
  scope: string | null;
  total: number;
  event_id: number | null;
  created_at: string;
  // joined
  subject_label?: string;
}

export interface StudentMark {
  id: number;
  sheet_id: number;
  student_id: number;
  school_id: number;
  mark: number | null;
  note: string | null;
  marked_at: string | null;
  // joined
  student_name?: string;
  student_surname?: string;
  student_code?: string;
}

export interface CreateMarkSheetInput {
  school_id: number;
  teacher_id: number;
  subject_id: number;
  grade: number;
  title: string;
  scope?: string;
  total: number;
}

export type MarkSheetResult =
  | { success: true; sheet: MarkSheet }
  | { success: false; error: string };

export type SimpleResult =
  | { success: true }
  | { success: false; error: string };

// ── Grouped view type ─────────────────────────────────────────
// Groups mark sheets by subject_id + grade

export interface MarkSheetGroup {
  key: string; // `${subject_id}-${grade}`
  subject_id: number;
  subject_label: string;
  grade: number;
  sheets: MarkSheet[];
}

// ── Fetch all mark sheets for a teacher, grouped ──────────────

export async function fetchTeacherMarkSheets(
  teacher_id: number,
  school_id: number
): Promise<MarkSheetGroup[]> {
  const { data, error } = await supabaseAdmin
    .from('mark_sheets')
    .select('*')
    .eq('teacher_id', teacher_id)
    .eq('school_id', school_id)
    .order('grade')
    .order('created_at', { ascending: false });

  if (error || !data) return [];

  // Fetch subject labels separately
  const subjectIds = [...new Set(data.map((r: any) => r.subject_id as number))];
  const { data: subjectsData } = await supabaseAdmin
    .from('subjects')
    .select('id, label')
    .in('id', subjectIds);
  const subjectMap = new Map((subjectsData ?? []).map((s: any) => [s.id, s.label]));

  const sheets: MarkSheet[] = data.map((r: any) => ({
    ...r,
    subject_label: subjectMap.get(r.subject_id) ?? 'Unknown',
  }));

  // Group by subject_id + grade
  const map = new Map<string, MarkSheetGroup>();
  for (const sheet of sheets) {
    const key = `${sheet.subject_id}-${sheet.grade}`;
    if (!map.has(key)) {
      map.set(key, {
        key,
        subject_id: sheet.subject_id,
        subject_label: sheet.subject_label ?? '',
        grade: sheet.grade,
        sheets: [],
      });
    }
    map.get(key)!.sheets.push(sheet);
  }

  return Array.from(map.values()).sort((a, b) =>
    a.grade !== b.grade ? a.grade - b.grade : a.subject_label.localeCompare(b.subject_label)
  );
}

// ── Create mark sheet + auto-populate student_marks rows ──────

export async function createMarkSheet(input: CreateMarkSheetInput): Promise<MarkSheetResult> {
  const { school_id, teacher_id, subject_id, grade, title, scope, total } = input;

  // Insert sheet
  const { data: sheet, error } = await supabaseAdmin
    .from('mark_sheets')
    .insert({ school_id, teacher_id, subject_id, grade, title: title.trim(), scope: scope?.trim() || null, total })
    .select('*')
    .single();

  if (error || !sheet) return { success: false, error: error?.message ?? 'Failed to create mark sheet.' };

  // Fetch subject label
  const { data: subjectRow } = await supabaseAdmin
    .from('subjects')
    .select('label')
    .eq('id', subject_id)
    .single();
  const subject_label = subjectRow?.label ?? 'Unknown';

  // Find all students this teacher teaches for this subject + grade
  const { data: links } = await supabaseAdmin
    .from('teacher_students')
    .select('student_id, students(id, grade, school_id)')
    .eq('teacher_id', teacher_id)
    .eq('subject_id', subject_id);

  if (links && links.length > 0) {
    const studentIds = links
      .filter((l: any) => l.students?.grade === grade && l.students?.school_id === school_id)
      .map((l: any) => l.student_id as number);

    const unique = [...new Set(studentIds)];

    if (unique.length > 0) {
      await supabaseAdmin
        .from('student_marks')
        .insert(unique.map(sid => ({
          sheet_id: sheet.id,
          student_id: sid,
          school_id,
        })));
    }
  }

  return {
    success: true,
    sheet: { ...sheet, subject_label },
  };
}

// ── Delete mark sheet ─────────────────────────────────────────

export async function deleteMarkSheet(sheet_id: number, school_id: number): Promise<SimpleResult> {
  const { error } = await supabaseAdmin
    .from('mark_sheets')
    .delete()
    .eq('id', sheet_id)
    .eq('school_id', school_id);

  if (error) return { success: false, error: 'Failed to delete mark sheet.' };
  return { success: true };
}

// ── Fetch student marks for a sheet ──────────────────────────

export async function fetchSheetMarks(sheet_id: number): Promise<StudentMark[]> {
  const { data, error } = await supabaseAdmin
    .from('student_marks')
    .select('*')
    .eq('sheet_id', sheet_id);

  if (error || !data) return [];

  // Fetch student details separately
  const studentIds = [...new Set(data.map((r: any) => r.student_id as number))];
  const { data: studentsData } = await supabaseAdmin
    .from('students')
    .select('id, name, surname, student_code')
    .in('id', studentIds);
  const studentMap = new Map((studentsData ?? []).map((s: any) => [s.id, s]));

  return data
    .map((r: any) => {
      const s = studentMap.get(r.student_id);
      return {
        ...r,
        student_name: s?.name ?? '',
        student_surname: s?.surname ?? '',
        student_code: s?.student_code ?? '',
      };
    })
    .sort((a: any, b: any) => a.student_surname.localeCompare(b.student_surname));
}

// ── Save a single student's mark + note ──────────────────────

export async function saveStudentMark(
  sheet_id: number,
  student_id: number,
  school_id: number,
  mark: number | null,
  note: string | null
): Promise<SimpleResult> {
  const { error } = await supabaseAdmin
    .from('student_marks')
    .upsert({
      sheet_id,
      student_id,
      school_id,
      mark,
      note: note?.trim() || null,
      marked_at: mark !== null ? new Date().toISOString() : null,
    }, { onConflict: 'sheet_id,student_id' });

  if (error) return { success: false, error: 'Failed to save mark.' };
  return { success: true };
}

// ── Link a mark sheet to a calendar event ────────────────────

export async function linkSheetToEvent(sheet_id: number, event_id: number): Promise<SimpleResult> {
  const { error } = await supabaseAdmin
    .from('mark_sheets')
    .update({ event_id })
    .eq('id', sheet_id);

  if (error) return { success: false, error: 'Failed to link event.' };
  return { success: true };
}

// ── Fetch all marks for a student (their own results) ─────────

export interface StudentResult {
  sheet_id: number;
  sheet_title: string;
  sheet_scope: string | null;
  subject_id: number;
  subject_label: string;
  grade: number;
  total: number;
  mark: number | null;
  note: string | null;
  marked_at: string | null;
  created_at: string;
}

export async function fetchStudentResults(
  student_id: number,
  school_id: number
): Promise<StudentResult[]> {
  const { data, error } = await supabaseAdmin
    .from('student_marks')
    .select('mark, note, marked_at, mark_sheets(id, title, scope, total, grade, subject_id, created_at)')
    .eq('student_id', student_id)
    .eq('school_id', school_id);

  if (error || !data) return [];

  // Fetch subject labels separately
  const subjectIds = [...new Set(data.map((r: any) => r.mark_sheets?.subject_id as number).filter(Boolean))];
  const { data: subjectsData } = await supabaseAdmin
    .from('subjects')
    .select('id, label')
    .in('id', subjectIds);
  const subjectMap = new Map((subjectsData ?? []).map((s: any) => [s.id, s.label]));

  return data
    .filter((r: any) => r.mark_sheets)
    .sort((a: any, b: any) => new Date(b.mark_sheets.created_at).getTime() - new Date(a.mark_sheets.created_at).getTime())
    .map((r: any) => ({
      sheet_id: r.mark_sheets.id,
      sheet_title: r.mark_sheets.title ?? '',
      sheet_scope: r.mark_sheets.scope ?? null,
      subject_id: r.mark_sheets.subject_id ?? 0,
      subject_label: subjectMap.get(r.mark_sheets.subject_id) ?? '',
      grade: r.mark_sheets.grade ?? 0,
      total: r.mark_sheets.total ?? 0,
      mark: r.mark,
      note: r.note,
      marked_at: r.marked_at,
      created_at: r.mark_sheets.created_at ?? '',
    }));
}
