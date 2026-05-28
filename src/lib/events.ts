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
  other:      { bg: 'bg-slate-50',  text: 'text-slate-700',  dot: 'bg-slate-400',  badge: 'bg-slate-100 text-slate-600' },
};

export const EVENT_LABELS: Record<EventType, string> = {
  homework: 'Homework',
  assessment: 'Assessment',
  exam: 'Exam',
  other: 'Other',
};

// ── Upload attachment ─────────────────────────────────────────

async function uploadAttachment(file: File, school_id: number): Promise<{ url: string; name: string } | null> {
  const ext = file.name.split('.').pop();
  const path = `${school_id}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabaseAdmin.storage
    .from('homework-attachments')
    .upload(path, file, { upsert: false });

  if (error) return null;

  const { data } = supabaseAdmin.storage
    .from('homework-attachments')
    .getPublicUrl(path);

  return { url: data.publicUrl, name: file.name };
}

// ── Delete attachment from storage ───────────────────────────

async function deleteAttachment(url: string): Promise<void> {
  // Extract path from URL: everything after /homework-attachments/
  const marker = '/homework-attachments/';
  const idx = url.indexOf(marker);
  if (idx === -1) return;
  const path = url.slice(idx + marker.length);
  await supabaseAdmin.storage.from('homework-attachments').remove([path]);
}

// ── Fetch events for a school (teacher view — all events) ────

export async function fetchSchoolEvents(school_id: number): Promise<SchoolEvent[]> {
  const { data, error } = await supabaseAdmin
    .from('events')
    .select('*')
    .eq('school_id', school_id)
    .order('event_date')
    .order('start_time', { nullsFirst: true });

  if (error || !data) return [];
  return data;
}

// ── Fetch events for a specific month (teacher view) ─────────

export async function fetchMonthEvents(school_id: number, year: number, month: number): Promise<SchoolEvent[]> {
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
        ev.target_subject_ids?.some(id => subject_ids.includes(id)) &&
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
    if (!uploaded) return { success: false, error: 'Failed to upload attachment.' };
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
    if (!uploaded) return { success: false, error: 'Failed to upload attachment.' };
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

export async function getAttachmentDownloadUrl(attachmentUrl: string): Promise<string | null> {
  const marker = '/homework-attachments/';
  const idx = attachmentUrl.indexOf(marker);
  if (idx === -1) return attachmentUrl; // fallback to public url
  const path = attachmentUrl.slice(idx + marker.length);

  const { data, error } = await supabaseAdmin.storage
    .from('homework-attachments')
    .createSignedUrl(path, 60 * 60); // 1 hour

  if (error || !data) return null;
  return data.signedUrl;
}
