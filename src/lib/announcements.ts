import { supabaseAdmin } from './supabase';

// ── Types ─────────────────────────────────────────────────────

export type AnnouncementTargetType = 'all' | 'grade' | 'class' | 'subject' | 'specific';

export interface Announcement {
  id: number;
  school_id: number;
  teacher_id: number | null;
  admin_id: number | null;
  title: string;
  body: string | null;
  pinned: boolean;
  target_type: AnnouncementTargetType;
  target_grades: number[] | null;
  target_cohort_ids: number[] | null;
  target_subject_ids: number[] | null;
  target_student_ids: number[] | null;
  created_at: string;
  // joined
  author_name?: string;
  author_surname?: string;
  author_role?: 'teacher' | 'admin';
}

export interface CreateAnnouncementInput {
  school_id: number;
  teacher_id?: number;
  admin_id?: number;
  title: string;
  body?: string;
  pinned?: boolean;
  target_type: AnnouncementTargetType;
  target_grades?: number[];
  target_cohort_ids?: number[];
  target_subject_ids?: number[];
  target_student_ids?: number[];
}

export type AnnouncementResult =
  | { success: true; announcement: Announcement }
  | { success: false; error: string };

export type SimpleResult =
  | { success: true }
  | { success: false; error: string };

// ── Map raw row to Announcement ───────────────────────────────

function mapRow(a: any): Announcement {
  const isAdmin = !!a.admin_id;
  return {
    ...a,
    author_name:    isAdmin ? a.admins?.name    : a.teachers?.name,
    author_surname: isAdmin ? a.admins?.surname : a.teachers?.surname,
    author_role:    isAdmin ? 'admin' : 'teacher',
    teachers: undefined,
    admins:   undefined,
  };
}

// ── Fetch ALL announcements for a school (teacher / admin view) ─

export async function fetchAnnouncements(school_id: number): Promise<Announcement[]> {
  const { data, error } = await supabaseAdmin
    .from('announcements')
    .select('*, teachers(name, surname), admins(name, surname)')
    .eq('school_id', school_id)
    .order('pinned', { ascending: false })
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return data.map(mapRow);
}

// ── Fetch announcements visible to a specific student ─────────

export async function fetchStudentAnnouncements(
  school_id: number,
  student_id: number,
  grade: number,
  cohort_id: number | null,
  subject_ids: number[]
): Promise<Announcement[]> {
  const { data, error } = await supabaseAdmin
    .from('announcements')
    .select('*, teachers(name, surname), admins(name, surname)')
    .eq('school_id', school_id)
    .order('pinned', { ascending: false })
    .order('created_at', { ascending: false });

  if (error || !data) return [];

  const filtered = data.filter((a: any) => {
    if (a.target_type === 'all') return true;
    if (a.target_type === 'grade') return a.target_grades?.includes(grade);
    if (a.target_type === 'class') return cohort_id && a.target_cohort_ids?.includes(cohort_id);
    if (a.target_type === 'subject') return (
      a.target_subject_ids?.some((id: number) => subject_ids.includes(id)) &&
      (!a.target_grades?.length || a.target_grades.includes(grade))
    );
    if (a.target_type === 'specific') return a.target_student_ids?.includes(student_id);
    return false;
  });

  return filtered.map(mapRow);
}

// ── Create announcement ───────────────────────────────────────

export async function createAnnouncement(
  input: CreateAnnouncementInput
): Promise<AnnouncementResult> {
  const { data, error } = await supabaseAdmin
    .from('announcements')
    .insert({
      school_id:          input.school_id,
      teacher_id:         input.teacher_id ?? null,
      admin_id:           input.admin_id ?? null,
      title:              input.title.trim(),
      body:               input.body?.trim() || null,
      pinned:             input.pinned ?? false,
      target_type:        input.target_type,
      target_grades:      input.target_grades?.length      ? input.target_grades      : null,
      target_cohort_ids:  input.target_cohort_ids?.length  ? input.target_cohort_ids  : null,
      target_subject_ids: input.target_subject_ids?.length ? input.target_subject_ids : null,
      target_student_ids: input.target_student_ids?.length ? input.target_student_ids : null,
    })
    .select('*')
    .single();

  if (error || !data) {
    console.error('[announcements] create error:', error?.message);
    return { success: false, error: error?.message ?? 'Failed to create announcement.' };
  }
  return { success: true, announcement: data };
}

// ── Toggle pinned ─────────────────────────────────────────────

export async function toggleAnnouncementPinned(
  id: number,
  school_id: number,
  pinned: boolean
): Promise<SimpleResult> {
  const { error } = await supabaseAdmin
    .from('announcements')
    .update({ pinned })
    .eq('id', id)
    .eq('school_id', school_id);

  if (error) return { success: false, error: 'Failed to update announcement.' };
  return { success: true };
}

// ── Delete announcement ───────────────────────────────────────

export async function deleteAnnouncement(
  id: number,
  school_id: number
): Promise<SimpleResult> {
  const { error } = await supabaseAdmin
    .from('announcements')
    .delete()
    .eq('id', id)
    .eq('school_id', school_id);

  if (error) return { success: false, error: 'Failed to delete announcement.' };
  return { success: true };
}
