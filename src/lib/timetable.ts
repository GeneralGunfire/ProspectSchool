import { supabaseAdmin } from './supabase';

// ── Types ─────────────────────────────────────────────────────

export const DAYS = [
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
] as const;

export interface TimetablePeriod {
  id: number;
  school_id: number;
  period_number: number;
  label: string;
  start_time: string | null;
  end_time: string | null;
}

// A cell is either a subject-group (subject_id/teacher_id set, is_break false)
// or a break/interval (is_break true, subject_id/teacher_id null). One cell =
// one (cohort, day, period) slot; multiple non-break cells can share a slot
// when a class splits into simultaneous subject groups.
export interface TimetableEntry {
  id: number;
  school_id: number;
  cohort_id: number;
  subject_id: number | null;
  teacher_id: number | null;
  day_of_week: number;
  period_number: number;
  room: string | null;
  is_break: boolean;
  break_label: string | null;
}

export interface TimetableEntryDetailed extends TimetableEntry {
  subject_label: string;
  teacher_name: string;
  teacher_surname: string;
  cohort_name: string;
}

export type TimetableResult =
  | { success: true }
  | { success: false; error: string };

// ── Periods (bell schedule) — pure row labels/times, no break concept here anymore ──

export async function fetchSchoolPeriods(school_id: number): Promise<TimetablePeriod[]> {
  const { data, error } = await supabaseAdmin
    .from('timetable_periods')
    .select('id, school_id, period_number, label, start_time, end_time')
    .eq('school_id', school_id)
    .order('period_number');

  if (error || !data) return [];
  return data;
}

export async function setSchoolPeriods(
  school_id: number,
  periods: { period_number: number; label: string; start_time: string | null; end_time: string | null }[]
): Promise<TimetableResult> {
  const { error: delError } = await supabaseAdmin.from('timetable_periods').delete().eq('school_id', school_id);
  if (delError) return { success: false, error: 'Failed to update periods.' };

  if (periods.length > 0) {
    const { error: insError } = await supabaseAdmin
      .from('timetable_periods')
      .insert(periods.map((p) => ({ school_id, ...p })));
    if (insError) return { success: false, error: 'Failed to save periods.' };
  }
  return { success: true };
}

// ── Add a single row without touching existing rows ──

export type AddPeriodResult =
  | { success: true; period: TimetablePeriod }
  | { success: false; error: string };

export async function addSchoolPeriod(
  school_id: number,
  input: { label: string; start_time: string | null; end_time: string | null }
): Promise<AddPeriodResult> {
  const existing = await fetchSchoolPeriods(school_id);
  const nextNumber = existing.length > 0 ? Math.max(...existing.map((p) => p.period_number)) + 1 : 1;

  const { data, error } = await supabaseAdmin
    .from('timetable_periods')
    .insert({ school_id, period_number: nextNumber, ...input })
    .select('id, school_id, period_number, label, start_time, end_time')
    .single();

  if (error || !data) return { success: false, error: error?.message ?? 'Failed to add row.' };
  return { success: true, period: data };
}

export async function updateSchoolPeriod(
  period_id: number,
  updates: { label?: string; start_time?: string | null; end_time?: string | null }
): Promise<TimetableResult> {
  const { error } = await supabaseAdmin.from('timetable_periods').update(updates).eq('id', period_id);
  if (error) return { success: false, error: 'Failed to update row.' };
  return { success: true };
}

export async function deleteSchoolPeriod(period_id: number): Promise<TimetableResult> {
  const { error } = await supabaseAdmin.from('timetable_periods').delete().eq('id', period_id);
  if (error) return { success: false, error: 'Failed to delete row.' };
  return { success: true };
}

// ── Shared select + row mapper for timetable_entries ──

const ENTRY_SELECT =
  'id, school_id, cohort_id, subject_id, teacher_id, day_of_week, period_number, room, is_break, break_label, subjects(label), teachers(name, surname), cohorts(name)';

function mapEntryRow(r: any): TimetableEntryDetailed {
  return {
    id: r.id,
    school_id: r.school_id,
    cohort_id: r.cohort_id,
    subject_id: r.subject_id,
    teacher_id: r.teacher_id,
    day_of_week: r.day_of_week,
    period_number: r.period_number,
    room: r.room,
    is_break: r.is_break,
    break_label: r.break_label,
    subject_label: r.subjects?.label ?? '',
    teacher_name: r.teachers?.name ?? '',
    teacher_surname: r.teachers?.surname ?? '',
    cohort_name: r.cohorts?.name ?? '',
  };
}

// ── Admin: fetch full timetable for a cohort, with joined labels ──

export async function fetchCohortTimetable(cohort_id: number): Promise<TimetableEntryDetailed[]> {
  const { data, error } = await supabaseAdmin
    .from('timetable_entries')
    .select(ENTRY_SELECT)
    .eq('cohort_id', cohort_id)
    .order('day_of_week')
    .order('period_number');

  if (error || !data) return [];
  return data.map(mapEntryRow);
}

// ── Admin: add a subject-group entry (one slot) ──

export interface AddEntryInput {
  school_id: number;
  cohort_id: number;
  subject_id: number;
  teacher_id: number;
  day_of_week: number;
  period_number: number;
  room?: string;
}

export type AddEntryResult =
  | { success: true; entry_id: number }
  | { success: false; error: string };

export async function addTimetableEntry(input: AddEntryInput): Promise<AddEntryResult> {
  const { data, error } = await supabaseAdmin
    .from('timetable_entries')
    .insert({
      school_id: input.school_id,
      cohort_id: input.cohort_id,
      subject_id: input.subject_id,
      teacher_id: input.teacher_id,
      day_of_week: input.day_of_week,
      period_number: input.period_number,
      room: input.room?.trim() || null,
      is_break: false,
    })
    .select('id')
    .single();

  if (error || !data) return { success: false, error: error?.message ?? 'Failed to add entry.' };
  return { success: true, entry_id: data.id };
}

// ── Admin: add a break/interval to a single cell (one day + period only) ──

export interface AddBreakInput {
  school_id: number;
  cohort_id: number;
  day_of_week: number;
  period_number: number;
  label?: string;
}

export async function addBreakEntry(input: AddBreakInput): Promise<AddEntryResult> {
  const { data, error } = await supabaseAdmin
    .from('timetable_entries')
    .insert({
      school_id: input.school_id,
      cohort_id: input.cohort_id,
      day_of_week: input.day_of_week,
      period_number: input.period_number,
      is_break: true,
      break_label: input.label?.trim() || 'Break',
      subject_id: null,
      teacher_id: null,
      room: null,
    })
    .select('id')
    .single();

  if (error || !data) return { success: false, error: error?.message ?? 'Failed to add break.' };
  return { success: true, entry_id: data.id };
}

export async function updateTimetableEntry(
  entry_id: number,
  updates: { subject_id?: number; teacher_id?: number; room?: string | null; break_label?: string }
): Promise<TimetableResult> {
  const payload: Record<string, unknown> = {};
  if (updates.subject_id !== undefined) payload.subject_id = updates.subject_id;
  if (updates.teacher_id !== undefined) payload.teacher_id = updates.teacher_id;
  if (updates.room !== undefined) payload.room = updates.room?.trim() || null;
  if (updates.break_label !== undefined) payload.break_label = updates.break_label.trim() || 'Break';

  const { error } = await supabaseAdmin.from('timetable_entries').update(payload).eq('id', entry_id);
  if (error) return { success: false, error: 'Failed to update entry.' };
  return { success: true };
}

export async function deleteTimetableEntry(entry_id: number): Promise<TimetableResult> {
  const { error } = await supabaseAdmin.from('timetable_entries').delete().eq('id', entry_id);
  if (error) return { success: false, error: 'Failed to delete entry.' };
  return { success: true };
}

// ── Admin: move an entry to a different day/period (drag-and-drop) ──
// Only meaningful for single-occupant cells — if the target slot already has
// something, the caller should confirm the overwrite with the user first
// (this just performs the move; it does not itself check for a clash).

export async function moveTimetableEntry(
  entry_id: number,
  day_of_week: number,
  period_number: number
): Promise<TimetableResult> {
  const { error } = await supabaseAdmin
    .from('timetable_entries')
    .update({ day_of_week, period_number })
    .eq('id', entry_id);
  if (error) return { success: false, error: 'Failed to move entry.' };
  return { success: true };
}

// ── Admin: copy an entry to another day/period (duplicate, keep the original) ──

export async function copyTimetableEntry(
  entry_id: number,
  day_of_week: number,
  period_number: number
): Promise<AddEntryResult> {
  const { data: source, error: fetchError } = await supabaseAdmin
    .from('timetable_entries')
    .select('school_id, cohort_id, subject_id, teacher_id, room, is_break, break_label')
    .eq('id', entry_id)
    .single();

  if (fetchError || !source) return { success: false, error: 'Failed to copy entry.' };

  const { data, error } = await supabaseAdmin
    .from('timetable_entries')
    .insert({
      school_id: source.school_id,
      cohort_id: source.cohort_id,
      subject_id: source.subject_id,
      teacher_id: source.teacher_id,
      room: source.room,
      is_break: source.is_break,
      break_label: source.break_label,
      day_of_week,
      period_number,
    })
    .select('id')
    .single();

  if (error || !data) return { success: false, error: error?.message ?? 'Failed to copy entry.' };
  return { success: true, entry_id: data.id };
}

// ── Teacher: check if this teacher is already booked in this slot ──
// Used by the admin builder to warn about teacher double-booking across
// different cohorts (the one clash that matters — a teacher can't be in
// two classes' periods at once, unlike a room which we don't track).

export async function fetchTeacherClash(
  teacher_id: number,
  day_of_week: number,
  period_number: number,
  exclude_entry_id?: number
): Promise<TimetableEntryDetailed[]> {
  let query = supabaseAdmin
    .from('timetable_entries')
    .select(ENTRY_SELECT)
    .eq('teacher_id', teacher_id)
    .eq('day_of_week', day_of_week)
    .eq('period_number', period_number);

  if (exclude_entry_id) query = query.neq('id', exclude_entry_id);

  const { data, error } = await query;
  if (error || !data) return [];
  return data.map(mapEntryRow);
}

// ── Teacher: fetch this teacher's full personal timetable ──

export async function fetchTeacherTimetable(teacher_id: number): Promise<TimetableEntryDetailed[]> {
  const { data, error } = await supabaseAdmin
    .from('timetable_entries')
    .select(ENTRY_SELECT)
    .eq('teacher_id', teacher_id)
    .order('day_of_week')
    .order('period_number');

  if (error || !data) return [];
  return data.map(mapEntryRow);
}

// ── Student: fetch this student's personal timetable ──
// Derived from their cohort's full timetable, filtered down to only the
// subjects they're actually enrolled in via teacher_students (plus every
// break cell, which applies to the whole class regardless of subject).

export async function fetchStudentTimetable(student_id: number, cohort_id: number | null): Promise<TimetableEntryDetailed[]> {
  if (!cohort_id) return [];

  const { data: links } = await supabaseAdmin
    .from('teacher_students')
    .select('subject_id')
    .eq('student_id', student_id);

  const enrolledSubjectIds = new Set((links ?? []).map((l: any) => l.subject_id as number));

  const full = await fetchCohortTimetable(cohort_id);
  return full.filter((e) => e.is_break || (e.subject_id !== null && enrolledSubjectIds.has(e.subject_id)));
}
