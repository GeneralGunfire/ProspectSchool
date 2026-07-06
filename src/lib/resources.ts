import { supabaseAdmin } from './supabase';

// ── Types ─────────────────────────────────────────────────────

export type ResourceType = 'file' | 'link' | 'note';
export type TargetType = 'all' | 'grade' | 'class' | 'subject' | 'specific';
export type ResourceCategory = 'homework' | 'notes' | 'general';

export interface Resource {
  id: number;
  school_id: number;
  teacher_id: number;
  subject_id: number | null;
  title: string;
  description: string | null;
  resource_type: ResourceType;
  category: ResourceCategory;
  file_url: string | null;
  file_name: string | null;
  link_url: string | null;
  note_content: string | null;
  target_type: TargetType;
  target_grades: number[] | null;
  target_cohort_ids: number[] | null;
  target_subject_ids: number[] | null;
  target_student_ids: number[] | null;
  created_at: string;
  // joined
  subject_label?: string;
}

export interface CreateResourceInput {
  school_id: number;
  teacher_id: number;
  subject_id?: number;
  title: string;
  description?: string;
  resource_type: ResourceType;
  category: ResourceCategory;
  file?: File;
  link_url?: string;
  note_content?: string;
  target_type: TargetType;
  target_grades?: number[];
  target_cohort_ids?: number[];
  target_subject_ids?: number[];
  target_student_ids?: number[];
}

export type ResourceResult =
  | { success: true; resource: Resource }
  | { success: false; error: string };

export type SimpleResult =
  | { success: true }
  | { success: false; error: string };

// ── Colours & icons per type ──────────────────────────────────

export const RESOURCE_TYPE_META: Record<ResourceType, { label: string; badge: string; dot: string }> = {
  file: { label: 'File',  badge: 'bg-blue-100 text-blue-700',   dot: 'bg-blue-500' },
  link: { label: 'Link',  badge: 'bg-violet-100 text-violet-700', dot: 'bg-violet-500' },
  note: { label: 'Note',  badge: 'bg-amber-100 text-amber-700',  dot: 'bg-amber-500' },
};

export const RESOURCE_CATEGORY_META: Record<ResourceCategory, { label: string; badge: string }> = {
  homework: { label: 'Homework', badge: 'bg-rose-100 text-rose-700' },
  notes:    { label: 'Notes',    badge: 'bg-emerald-100 text-emerald-700' },
  general:  { label: 'General',  badge: 'bg-stone-100 text-stone-600' },
};

// ── Upload file ───────────────────────────────────────────────

async function uploadResourceFile(
  file: File,
  school_id: number
): Promise<{ url: string; name: string } | { uploadError: string }> {
  const ext = file.name.split('.').pop();
  const storagePath = `${school_id}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabaseAdmin.storage
    .from('resources')
    .upload(storagePath, file, { upsert: false });

  if (error) {
    console.error('[resources] upload error:', error.message, error);
    return { uploadError: error.message };
  }

  // Store the path — not a public URL (bucket is private; signed URLs used at download time)
  return { url: storagePath, name: file.name };
}

async function deleteResourceFile(storagePath: string): Promise<void> {
  await supabaseAdmin.storage.from('resources').remove([storagePath]);
}

// ── Fetch signed download URL ─────────────────────────────────

export async function getResourceDownloadUrl(storagePath: string): Promise<string | null> {
  const { data, error } = await supabaseAdmin.storage
    .from('resources')
    .createSignedUrl(storagePath, 60 * 60); // 1 hour
  if (error || !data) {
    console.error('[resources] signed URL error:', error?.message, error);
    return null;
  }
  return data.signedUrl;
}

// ── Fetch resources for a teacher (all) ──────────────────────

export async function fetchTeacherResources(
  teacher_id: number,
  school_id: number
): Promise<Resource[]> {
  const { data, error } = await supabaseAdmin
    .from('resources')
    .select('*')
    .eq('teacher_id', teacher_id)
    .eq('school_id', school_id)
    .order('created_at', { ascending: false });

  if (error || !data) return [];

  // Fetch subject labels
  const subjectIds = [...new Set(data.map((r: any) => r.subject_id).filter(Boolean))];
  const subjectMap = new Map<number, string>();
  if (subjectIds.length > 0) {
    const { data: subs } = await supabaseAdmin
      .from('subjects').select('id, label').in('id', subjectIds);
    (subs ?? []).forEach((s: any) => subjectMap.set(s.id, s.label));
  }

  return data.map((r: any) => ({ ...r, subject_label: subjectMap.get(r.subject_id) ?? null }));
}

// ── Fetch resources visible to a student ─────────────────────

export async function fetchStudentResources(
  school_id: number,
  student_id: number,
  grade: number,
  cohort_id: number | null,
  subject_ids: number[]
): Promise<Resource[]> {
  const { data, error } = await supabaseAdmin
    .from('resources')
    .select('*')
    .eq('school_id', school_id)
    .order('created_at', { ascending: false });

  if (error || !data) return [];

  // Filter by audience
  const filtered = data.filter((r: any) => {
    if (r.target_type === 'all') return true;
    if (r.target_type === 'grade' && r.target_grades?.includes(grade)) return true;
    if (r.target_type === 'class' && cohort_id && r.target_cohort_ids?.includes(cohort_id)) return true;
    if (r.target_type === 'subject' &&
        r.target_subject_ids?.some((id: number) => subject_ids.includes(Number(id))) &&
        (!r.target_grades?.length || r.target_grades.includes(grade))) return true;
    if (r.target_type === 'specific' && r.target_student_ids?.includes(student_id)) return true;
    return false;
  });

  // Fetch subject labels
  const subjectIds = [...new Set(filtered.map((r: any) => r.subject_id).filter(Boolean))];
  const subjectMap = new Map<number, string>();
  if (subjectIds.length > 0) {
    const { data: subs } = await supabaseAdmin
      .from('subjects').select('id, label').in('id', subjectIds);
    (subs ?? []).forEach((s: any) => subjectMap.set(s.id, s.label));
  }

  return filtered.map((r: any) => ({ ...r, subject_label: subjectMap.get(r.subject_id) ?? null }));
}

// ── Create resource ───────────────────────────────────────────

export async function createResource(input: CreateResourceInput): Promise<ResourceResult> {
  let file_url: string | null = null;
  let file_name: string | null = null;

  if (input.resource_type === 'file' && input.file) {
    const uploaded = await uploadResourceFile(input.file, input.school_id);
    if ('uploadError' in uploaded) {
      return { success: false, error: `Upload failed: ${uploaded.uploadError}` };
    }
    file_url = uploaded.url;
    file_name = uploaded.name;
  }

  const { data, error } = await supabaseAdmin
    .from('resources')
    .insert({
      school_id: input.school_id,
      teacher_id: input.teacher_id,
      subject_id: input.subject_id ?? null,
      title: input.title.trim(),
      description: input.description?.trim() || null,
      resource_type: input.resource_type,
      category: input.category,
      file_url,
      file_name,
      link_url: input.link_url?.trim() || null,
      note_content: input.note_content?.trim() || null,
      target_type: input.target_type,
      target_grades: input.target_grades?.length ? input.target_grades : null,
      target_cohort_ids: input.target_cohort_ids?.length ? input.target_cohort_ids : null,
      target_subject_ids: input.target_subject_ids?.length ? input.target_subject_ids : null,
      target_student_ids: input.target_student_ids?.length ? input.target_student_ids : null,
    })
    .select('*')
    .single();

  if (error || !data) return { success: false, error: error?.message ?? 'Failed to create resource.' };
  return { success: true, resource: data };
}

// ── Delete resource ───────────────────────────────────────────

export async function deleteResource(resource_id: number, school_id: number, file_url?: string | null): Promise<SimpleResult> {
  if (file_url) await deleteResourceFile(file_url);
  const { error } = await supabaseAdmin
    .from('resources')
    .delete()
    .eq('id', resource_id)
    .eq('school_id', school_id);
  if (error) return { success: false, error: 'Failed to delete resource.' };
  return { success: true };
}

// ── Track resource download (unique per student+resource) ─────────────────────
// Fire-and-forget — never blocks UI. ON CONFLICT DO NOTHING via upsert.

export async function trackResourceDownload(
  resourceId: number,
  studentId:  number,
  schoolId:   number,
): Promise<void> {
  await supabaseAdmin
    .from('resource_downloads')
    .upsert(
      { resource_id: resourceId, student_id: studentId, school_id: schoolId },
      { onConflict: 'resource_id,student_id', ignoreDuplicates: true }
    );
}
