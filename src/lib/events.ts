import { supabaseAdmin } from './supabase';

// ── Types ─────────────────────────────────────────────────────

export type EventType = 'homework' | 'assessment' | 'exam' | 'other';
export type TargetType = 'all' | 'grade' | 'class' | 'subject' | 'specific';

export interface SchoolEvent {
  id: number;
  school_id: number;
  created_by_teacher_id: number;
  event_type: EventType;
  title: string;
  description: string | null;
  event_date: string; // ISO date string YYYY-MM-DD
  start_time: string | null;
  end_time: string | null;
  attachment_url: string | null;
  attachment_name: string | null;
  target_type: TargetType;
  target_grades: number[] | null;
  target_cohort_ids: number[] | null;
  target_subject_ids: number[] | null;
  target_student_ids: number[] | null;
  created_at: string;
}

export interface CreateEventInput {
  school_id: number;
  created_by_teacher_id: number;
  event_type: EventType;
  title: string;
  description?: string;
  event_date: string;
  start_time?: string;
  end_time?: string;
  attachment_file?: File;
  target_type: TargetType;
  target_grades?: number[];
  target_cohort_ids?: number[];
  target_subject_ids?: number[];
  target_student_ids?: number[];
}

export interface UpdateEventInput {
  event_id: number;
  school_id: number;
  event_type: EventType;
  title: string;
  description?: string;
  event_date: string;
  start_time?: string;
  end_time?: string;
  attachment_file?: File;
  clear_attachment?: boolean;
  target_type: TargetType;
  target_grades?: number[];
  target_cohort_ids?: number[];
  target_subject_ids?: number[];
  target_student_ids?: number[];
}

export type EventResult =
  | { success: true; event: SchoolEvent }
  | { success: false; error: string };

export type SimpleResult =
  | { success: true }
  | { success: false; error: string };

// ── Colours per event type ────────────────────────────────────

export const EVENT_COLORS: Record<EventType, { bg: string; text: string; dot: string; badge: string }> = {
  homework:   { bg: 'bg-blue-50',   text: 'text-blue-700',   dot: 'bg-blue-500',   badge: 'bg-blue-100 text-blue-700' },
  assessment: { bg: 'bg-amber-50',  text: 'text-amber-700',  dot: 'bg-amber-500',  badge: 'bg-amber-100 text-amber-700' },
  exam:       { bg: 'bg-red-50',    text: 'text-red-700',    dot: 'bg-red-500',    badge: 'bg-red-100 text-red-700' },
  other:      { bg: 'bg-stone-50',  text: 'text-stone-700',  dot: 'bg-stone-400',  badge: 'bg-stone-100 text-stone-600' },
};

export const EVENT_LABELS: Record<EventType, string> = {
  homework: 'Homework',
  assessment: 'Assessment',
  exam: 'Exam',
  other: 'Other',
};

// ── Upload attachment ─────────────────────────────────────────

async function uploadAttachment(
  file: File,
  school_id: number
): Promise<{ url: string; name: string } | { uploadError: string }> {
  const ext = file.name.split('.').pop();
  const storagePath = `${school_id}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabaseAdmin.storage
    .from('homework-attachments')
    .upload(storagePath, file, { upsert: false });

  if (error) {
    console.error('[events] upload error:', error.message, error);
    return { uploadError: error.message };
  }

  // Store the path — not a public URL (bucket is private; signed URLs used at download time)
  return { url: storagePath, name: file.name };
}

// ── Delete attachment from storage ───────────────────────────

async function deleteAttachment(storagePath: string): Promise<void> {
  await supabaseAdmin.storage.from('homework-attachments').remove([storagePath]);
}

// ── Fetch events for a school (teacher view) ──────────────────
// Scoped to events the teacher created themselves, plus schoolwide
// "everyone" events — a teacher never sees another teacher's
// class/subject/grade-targeted events.

export async function fetchSchoolEvents(school_id: number, teacher_id: number): Promise<SchoolEvent[]> {
  const { data, error } = await supabaseAdmin
    .from('events')
    .select('*')
    .eq('school_id', school_id)
    .or(`created_by_teacher_id.eq.${teacher_id},target_type.eq.all`)
    .order('event_date')
    .order('start_time', { nullsFirst: true });

  if (error || !data) return [];
  return data;
}

// ── Fetch events for a specific month (teacher view) ─────────
// Same own-events + schoolwide-"all" scoping as fetchSchoolEvents.

export async function fetchMonthEvents(school_id: number, teacher_id: number, year: number, month: number): Promise<SchoolEvent[]> {
  const from = `${year}-${String(month).padStart(2, '0')}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const to = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

  const { data, error } = await supabaseAdmin
    .from('events')
    .select('*')
    .eq('school_id', school_id)
    .gte('event_date', from)
    .lte('event_date', to)
    .or(`created_by_teacher_id.eq.${teacher_id},target_type.eq.all`)
    .order('event_date')
    .order('start_time', { nullsFirst: true });

  if (error || !data) return [];
  return data;
}

// ── Fetch events visible to a specific student ───────────────

export async function fetchStudentEvents(
  school_id: number,
  student_id: number,
  grade: number,
  cohort_id: number | null,
  subject_ids: number[],
  year: number,
  month: number
): Promise<SchoolEvent[]> {
  const from = `${year}-${String(month).padStart(2, '0')}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const to = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

  const { data, error } = await supabaseAdmin
    .from('events')
    .select('*')
    .eq('school_id', school_id)
    .gte('event_date', from)
    .lte('event_date', to)
    .order('event_date')
    .order('start_time', { nullsFirst: true });

  if (error || !data) return [];

  // Filter client-side: student sees event if any condition matches
  return data.filter((ev: SchoolEvent) => {
    if (ev.target_type === 'all') return true;
    if (ev.target_type === 'grade' && ev.target_grades?.includes(grade)) return true;
    if (ev.target_type === 'class' && cohort_id && ev.target_cohort_ids?.includes(cohort_id)) return true;
    if (ev.target_type === 'subject' &&
        ev.target_subject_ids?.some(id => subject_ids.includes(Number(id))) &&
        (!ev.target_grades?.length || ev.target_grades.includes(grade))) return true;
    if (ev.target_type === 'specific' && ev.target_student_ids?.includes(student_id)) return true;
    return false;
  });
}

// ── Create event ──────────────────────────────────────────────

export async function createEvent(input: CreateEventInput): Promise<EventResult> {
  let attachment_url: string | null = null;
  let attachment_name: string | null = null;

  if (input.attachment_file) {
    const uploaded = await uploadAttachment(input.attachment_file, input.school_id);
    if ('uploadError' in uploaded) return { success: false, error: `Upload failed: ${uploaded.uploadError}` };
    attachment_url = uploaded.url;
    attachment_name = uploaded.name;
  }

  const { data, error } = await supabaseAdmin
    .from('events')
    .insert({
      school_id: input.school_id,
      created_by_teacher_id: input.created_by_teacher_id,
      event_type: input.event_type,
      title: input.title.trim(),
      description: input.description?.trim() || null,
      event_date: input.event_date,
      start_time: input.start_time || null,
      end_time: input.end_time || null,
      attachment_url,
      attachment_name,
      target_type: input.target_type,
      target_grades: input.target_grades?.length ? input.target_grades : null,
      target_cohort_ids: input.target_cohort_ids?.length ? input.target_cohort_ids : null,
      target_subject_ids: input.target_subject_ids?.length ? input.target_subject_ids : null,
      target_student_ids: input.target_student_ids?.length ? input.target_student_ids : null,
    })
    .select('*')
    .single();

  if (error || !data) return { success: false, error: error?.message ?? 'Failed to create event.' };
  return { success: true, event: data };
}

// ── Update event ──────────────────────────────────────────────

export async function updateEvent(input: UpdateEventInput, existingAttachmentUrl?: string | null): Promise<SimpleResult> {
  let attachment_url: string | null | undefined = undefined; // undefined = don't change
  let attachment_name: string | null | undefined = undefined;

  if (input.clear_attachment && existingAttachmentUrl) {
    await deleteAttachment(existingAttachmentUrl);
    attachment_url = null;
    attachment_name = null;
  } else if (input.attachment_file) {
    if (existingAttachmentUrl) await deleteAttachment(existingAttachmentUrl);
    const uploaded = await uploadAttachment(input.attachment_file, input.school_id);
    if ('uploadError' in uploaded) return { success: false, error: `Upload failed: ${uploaded.uploadError}` };
    attachment_url = uploaded.url;
    attachment_name = uploaded.name;
  }

  const payload: Record<string, any> = {
    event_type: input.event_type,
    title: input.title.trim(),
    description: input.description?.trim() || null,
    event_date: input.event_date,
    start_time: input.start_time || null,
    end_time: input.end_time || null,
    target_type: input.target_type,
    target_grades: input.target_grades?.length ? input.target_grades : null,
    target_cohort_ids: input.target_cohort_ids?.length ? input.target_cohort_ids : null,
    target_subject_ids: input.target_subject_ids?.length ? input.target_subject_ids : null,
    target_student_ids: input.target_student_ids?.length ? input.target_student_ids : null,
  };

  if (attachment_url !== undefined) payload.attachment_url = attachment_url;
  if (attachment_name !== undefined) payload.attachment_name = attachment_name;

  const { error } = await supabaseAdmin
    .from('events')
    .update(payload)
    .eq('id', input.event_id)
    .eq('school_id', input.school_id);

  if (error) return { success: false, error: 'Failed to update event.' };
  return { success: true };
}

// ── Delete event ──────────────────────────────────────────────

export async function deleteEvent(event_id: number, school_id: number, attachment_url?: string | null): Promise<SimpleResult> {
  if (attachment_url) await deleteAttachment(attachment_url);

  const { error } = await supabaseAdmin
    .from('events')
    .delete()
    .eq('id', event_id)
    .eq('school_id', school_id);

  if (error) return { success: false, error: 'Failed to delete event.' };
  return { success: true };
}

// ── Get signed download URL for attachment ────────────────────

export async function getAttachmentDownloadUrl(storagePath: string): Promise<string | null> {
  const { data, error } = await supabaseAdmin.storage
    .from('homework-attachments')
    .createSignedUrl(storagePath, 60 * 60); // 1 hour

  if (error || !data) {
    console.error('[events] signed URL error:', error?.message, error);
    return null;
  }
  return data.signedUrl;
}

// ── Homework completion + verification types ──────────────────

export type VerificationStatus = 'verified' | 'not_done' | 'excused';

export interface HomeworkStudentRow {
  student_id: number;
  name: string;
  surname: string;
  self_reported: boolean;              // student tapped "done"
  completed_at: string | null;
  verified_by_teacher: boolean | null; // null = not reviewed, true = done, false = not done
  absent: boolean;                     // teacher marked absent (excused incomplete)
  teacher_note: string | null;
}

// ── Homework completion tracking ──────────────────────────────

export async function markHomeworkDone(
  event_id: number,
  student_id: number,
  school_id: number
): Promise<{ success: boolean }> {
  const { error } = await supabaseAdmin
    .from('homework_completions')
    .upsert({ event_id, student_id, school_id, completed_at: new Date().toISOString() },
      { onConflict: 'event_id,student_id' });
  return { success: !error };
}

export async function unmarkHomeworkDone(
  event_id: number,
  student_id: number
): Promise<{ success: boolean }> {
  const { error } = await supabaseAdmin
    .from('homework_completions')
    .delete()
    .eq('event_id', event_id)
    .eq('student_id', student_id);
  return { success: !error };
}

// Returns set of event_ids the student has completed
export async function fetchStudentCompletions(
  student_id: number,
  school_id: number
): Promise<Set<number>> {
  const { data } = await supabaseAdmin
    .from('homework_completions')
    .select('event_id')
    .eq('student_id', student_id)
    .eq('school_id', school_id);
  return new Set((data ?? []).map((r: any) => r.event_id as number));
}

// Teacher: how many students completed a homework event
export async function fetchHomeworkCompletionCount(
  event_id: number
): Promise<number> {
  const { count } = await supabaseAdmin
    .from('homework_completions')
    .select('id', { count: 'exact', head: true })
    .eq('event_id', event_id);
  return count ?? 0;
}

// ── Teacher: fetch all targeted students + completion status ──
// Returns every student the event targets, with their self-report
// and teacher verification status merged in.

export async function fetchHomeworkStudentRows(
  event: SchoolEvent,
  school_id: number
): Promise<HomeworkStudentRow[]> {
  // 1. Fetch all students in this school
  const { data: allStudents } = await supabaseAdmin
    .from('students')
    .select('id, name, surname, grade, cohort_id')
    .eq('school_id', school_id)
    .order('surname');

  if (!allStudents) return [];

  // 2. Filter to those targeted by this event (same logic as student-side)
  let targeted = allStudents.filter((s: any) => {
    if (event.target_type === 'all') return true;
    if (event.target_type === 'grade') return event.target_grades?.includes(s.grade);
    if (event.target_type === 'class') return event.target_cohort_ids?.includes(s.cohort_id);
    if (event.target_type === 'specific') return event.target_student_ids?.includes(s.id);
    if (event.target_type === 'subject') return event.target_grades?.includes(s.grade); // subject events: grade is the student filter
    return false;
  });

  if (targeted.length === 0) return [];

  // 3. Fetch completion rows for this event
  const { data: completions } = await supabaseAdmin
    .from('homework_completions')
    .select('student_id, completed_at, verified_by_teacher, absent, teacher_note')
    .eq('event_id', event.id);

  const compMap = new Map<number, any>();
  (completions ?? []).forEach((c: any) => compMap.set(c.student_id, c));

  // 4. Merge
  return targeted.map((s: any) => {
    const comp = compMap.get(s.id);
    return {
      student_id: s.id,
      name: s.name,
      surname: s.surname,
      self_reported: !!comp,
      completed_at: comp?.completed_at ?? null,
      verified_by_teacher: comp?.verified_by_teacher ?? null,
      absent: comp?.absent ?? false,
      teacher_note: comp?.teacher_note ?? null,
    };
  });
}

// ── Teacher: save verification for a student ─────────────────

export async function saveHomeworkVerification(
  event_id: number,
  student_id: number,
  school_id: number,
  verified: boolean,
  note: string
): Promise<{ success: boolean }> {
  const { error } = await supabaseAdmin
    .from('homework_completions')
    .upsert(
      {
        event_id,
        student_id,
        school_id,
        verified_by_teacher: verified,
        absent: false, // explicit verify/not-done clears absent
        teacher_note: note.trim() || null,
      },
      { onConflict: 'event_id,student_id' }
    );
  if (error) {
    console.error('[events] saveHomeworkVerification error:', error.message);
    return { success: false };
  }
  return { success: true };
}

// ── Teacher: mark student absent for this homework ────────────
// Absent = excused incomplete. Clears any verify/not-done status.

export async function saveHomeworkAbsent(
  event_id: number,
  student_id: number,
  school_id: number,
  note: string
): Promise<{ success: boolean }> {
  const { error } = await supabaseAdmin
    .from('homework_completions')
    .upsert(
      {
        event_id,
        student_id,
        school_id,
        absent: true,
        verified_by_teacher: null, // absent overrides verify state
        teacher_note: note.trim() || null,
      },
      { onConflict: 'event_id,student_id' }
    );
  if (error) {
    console.error('[events] saveHomeworkAbsent error:', error.message);
    return { success: false };
  }
  return { success: true };
}
