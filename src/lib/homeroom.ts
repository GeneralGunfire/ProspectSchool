import { supabaseAdmin } from './supabase';

// ── Types ─────────────────────────────────────────────────────

export interface CohortWithHomeroom {
  id: number;
  school_id: number;
  name: string;
  grade: number;
  homeroom_teacher_id: number | null;
  homeroom_teacher_name: string | null;
  homeroom_teacher_surname: string | null;
  student_count: number;
}

export interface HomeroomStudent {
  id: number;
  name: string;
  surname: string;
  student_code: string;
}

// 'excused' is displayed to users as "Sick" — kept as the DB/internal value
// to avoid a data migration; only the label changed.
export type AttendanceStatus = 'present' | 'late' | 'absent' | 'excused' | 'non_school_day';

export interface AttendanceRecord {
  student_id: number;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  note: string | null;
}

export type SetHomeroomResult =
  | { success: true }
  | { success: false; error: string };

// ── Admin: fetch all cohorts for a school with homeroom + counts ──

export async function fetchSchoolCohorts(school_id: number): Promise<CohortWithHomeroom[]> {
  const { data: cohorts, error } = await supabaseAdmin
    .from('cohorts')
    .select('id, school_id, name, grade, homeroom_teacher_id, teachers(id, name, surname)')
    .eq('school_id', school_id)
    .order('grade')
    .order('name');

  if (error || !cohorts) return [];

  const { data: counts } = await supabaseAdmin
    .from('students')
    .select('cohort_id')
    .eq('school_id', school_id);

  const countByCohort = new Map<number, number>();
  for (const row of counts ?? []) {
    if (row.cohort_id == null) continue;
    countByCohort.set(row.cohort_id, (countByCohort.get(row.cohort_id) ?? 0) + 1);
  }

  return cohorts.map((c: any) => ({
    id: c.id,
    school_id: c.school_id,
    name: c.name,
    grade: c.grade,
    homeroom_teacher_id: c.homeroom_teacher_id,
    homeroom_teacher_name: c.teachers?.name ?? null,
    homeroom_teacher_surname: c.teachers?.surname ?? null,
    student_count: countByCohort.get(c.id) ?? 0,
  }));
}

// ── Admin: create a new class (cohort) ──

export type CreateCohortResult =
  | { success: true; cohort_id: number }
  | { success: false; error: string };

export async function createCohort(
  school_id: number,
  name: string,
  grade: number
): Promise<CreateCohortResult> {
  const trimmed = name.trim();
  if (!trimmed) return { success: false, error: 'Class name is required.' };

  const { data: existing } = await supabaseAdmin
    .from('cohorts')
    .select('id')
    .eq('school_id', school_id)
    .eq('name', trimmed)
    .maybeSingle();

  if (existing) {
    return { success: false, error: `A class named "${trimmed}" already exists.` };
  }

  const { data, error } = await supabaseAdmin
    .from('cohorts')
    .insert({ school_id, name: trimmed, grade })
    .select('id')
    .single();

  if (error || !data) return { success: false, error: 'Failed to create class.' };
  return { success: true, cohort_id: data.id };
}

// ── Admin: set (or clear) the homeroom teacher for a cohort ──

export async function setHomeroomTeacher(
  cohort_id: number,
  school_id: number,
  teacher_id: number | null
): Promise<SetHomeroomResult> {
  const { error } = await supabaseAdmin
    .from('cohorts')
    .update({ homeroom_teacher_id: teacher_id })
    .eq('id', cohort_id)
    .eq('school_id', school_id);

  if (error) return { success: false, error: 'Failed to update homeroom teacher.' };
  return { success: true };
}

// ── Teacher: find the cohort(s) this teacher is homeroom for ──

export async function fetchTeacherHomerooms(teacher_id: number): Promise<CohortWithHomeroom[]> {
  const { data, error } = await supabaseAdmin
    .from('cohorts')
    .select('id, school_id, name, grade, homeroom_teacher_id')
    .eq('homeroom_teacher_id', teacher_id);

  if (error || !data) return [];

  return data.map((c) => ({
    ...c,
    homeroom_teacher_name: null,
    homeroom_teacher_surname: null,
    student_count: 0,
  }));
}

// ── Teacher: roster for a homeroom cohort ──

export async function fetchCohortRoster(cohort_id: number): Promise<HomeroomStudent[]> {
  const { data, error } = await supabaseAdmin
    .from('students')
    .select('id, name, surname, student_code')
    .eq('cohort_id', cohort_id)
    .order('surname');

  if (error || !data) return [];
  return data;
}

// ── Student: fetch homeroom teacher info for their own cohort ──

export interface HomeroomTeacherInfo {
  teacher_id: number;
  name: string;
  surname: string;
}

export async function fetchCohortHomeroomTeacher(cohort_id: number): Promise<HomeroomTeacherInfo | null> {
  const { data, error } = await supabaseAdmin
    .from('cohorts')
    .select('homeroom_teacher_id, teachers(id, name, surname)')
    .eq('id', cohort_id)
    .maybeSingle();

  if (error || !data || !data.homeroom_teacher_id) return null;
  const t = (data as any).teachers;
  if (!t) return null;
  return { teacher_id: t.id, name: t.name, surname: t.surname };
}

// ── Student: fetch own attendance history (most recent first) ──

export async function fetchStudentAttendanceHistory(
  student_id: number,
  limit = 30
): Promise<AttendanceRecord[]> {
  const { data, error } = await supabaseAdmin
    .from('attendance')
    .select('student_id, date, status, note')
    .eq('student_id', student_id)
    .order('date', { ascending: false })
    .limit(limit);

  if (error || !data) return [];
  return data;
}

// ── Attendance: fetch existing records for a cohort on a given date ──

export async function fetchAttendanceForDate(
  student_ids: number[],
  date: string
): Promise<Map<number, AttendanceRecord>> {
  if (student_ids.length === 0) return new Map();

  const { data, error } = await supabaseAdmin
    .from('attendance')
    .select('student_id, date, status, note')
    .in('student_id', student_ids)
    .eq('date', date);

  const map = new Map<number, AttendanceRecord>();
  if (error || !data) return map;
  for (const row of data) map.set(row.student_id, row);
  return map;
}

// ── Attendance: mark one student for one day (upsert) ──

export async function markAttendance(
  student_id: number,
  date: string,
  status: AttendanceStatus,
  marked_by: number,
  note?: string
): Promise<SetHomeroomResult> {
  const { error } = await supabaseAdmin
    .from('attendance')
    .upsert(
      { student_id, date, status, note: note ?? null, marked_by },
      { onConflict: 'student_id,date' }
    );

  if (error) {
    console.error('markAttendance failed:', error.message);
    return { success: false, error: `Failed to save attendance: ${error.message}` };
  }
  return { success: true };
}

// ── Attendance: mark a whole roster for one day in a single upsert ──

export async function markAttendanceBulk(
  student_ids: number[],
  date: string,
  status: AttendanceStatus,
  marked_by: number
): Promise<SetHomeroomResult> {
  if (student_ids.length === 0) return { success: true };

  const rows = student_ids.map((student_id) => ({
    student_id, date, status, note: null, marked_by,
  }));

  const { error } = await supabaseAdmin
    .from('attendance')
    .upsert(rows, { onConflict: 'student_id,date' });

  if (error) {
    console.error('markAttendanceBulk failed:', error.message);
    return { success: false, error: `Failed to save attendance: ${error.message}` };
  }
  return { success: true };
}

// ── Attendance: mark the whole roster as a non-school day (public holiday,
// closure, etc). Excluded from attendance % — see fetchAttendanceSummary. ──

export async function markNonSchoolDay(
  student_ids: number[],
  date: string,
  marked_by: number
): Promise<SetHomeroomResult> {
  return markAttendanceBulk(student_ids, date, 'non_school_day', marked_by);
}

// ── Attendance: monthly summary per student for a cohort (for a stats view) ──

export interface AttendanceSummary {
  student_id: number;
  present: number;
  late: number;
  absent: number;
  excused: number;
}

export async function fetchAttendanceSummary(
  student_ids: number[],
  from_date: string,
  to_date: string
): Promise<AttendanceSummary[]> {
  if (student_ids.length === 0) return [];

  const { data, error } = await supabaseAdmin
    .from('attendance')
    .select('student_id, status')
    .in('student_id', student_ids)
    .gte('date', from_date)
    .lte('date', to_date);

  if (error || !data) return [];

  const byStudent = new Map<number, AttendanceSummary>();
  for (const id of student_ids) {
    byStudent.set(id, { student_id: id, present: 0, late: 0, absent: 0, excused: 0 });
  }
  for (const row of data) {
    // non_school_day is intentionally excluded from the summary — it
    // shouldn't count for or against any student's attendance rate.
    if (row.status === 'non_school_day') continue;
    const s = byStudent.get(row.student_id);
    if (s) s[row.status as Exclude<AttendanceStatus, 'non_school_day'>] += 1;
  }
  return [...byStudent.values()];
}
