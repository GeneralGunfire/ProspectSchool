import { supabaseAdmin } from './supabase';

// ── Types ─────────────────────────────────────────────────────

export interface PastPaper {
  id: number;
  school_id: number;
  teacher_id: number;
  subject_id: number;
  grade: number;
  title: string;
  year: number;
  term: number | null;
  paper_number: number;
  file_url: string;
  file_name: string;
  created_at: string;
  // joined
  subject_label?: string;
  teacher_name?: string;
  teacher_surname?: string;
}

export interface CreatePastPaperInput {
  school_id: number;
  teacher_id: number;
  subject_id: number;
  grade: number;
  title: string;
  year: number;
  term?: number;
  paper_number?: number;
  file: File;
}

export type PastPaperResult =
  | { success: true; paper: PastPaper; error?: string }
  | { success: false; error: string };

export type SimpleResult =
  | { success: true; error?: string }
  | { success: false; error: string };

// ── Upload file ───────────────────────────────────────────────

async function uploadPaperFile(
  file: File,
  school_id: number
): Promise<{ path: string; name: string } | { uploadError: string }> {
  const ext = file.name.split('.').pop();
  const storagePath = `${school_id}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabaseAdmin.storage
    .from('past-papers')
    .upload(storagePath, file, { upsert: false });

  if (error) {
    console.error('[past-papers] upload error:', error.message, error);
    return { uploadError: error.message };
  }
  return { path: storagePath, name: file.name };
}

async function deletePaperFile(storagePath: string): Promise<void> {
  await supabaseAdmin.storage.from('past-papers').remove([storagePath]);
}

// ── Get signed download URL ───────────────────────────────────

export async function getPastPaperDownloadUrl(storagePath: string): Promise<string | null> {
  const { data, error } = await supabaseAdmin.storage
    .from('past-papers')
    .createSignedUrl(storagePath, 60 * 60);
  if (error || !data) {
    console.error('[past-papers] signed URL error:', error?.message);
    return null;
  }
  return data.signedUrl;
}

// ── Fetch all papers for a school (student view — all papers) ─

export async function fetchAllPastPapers(school_id: number): Promise<PastPaper[]> {
  const { data, error } = await supabaseAdmin
    .from('past_papers')
    .select('*, subjects(label), teachers(name, surname)')
    .eq('school_id', school_id)
    .order('year', { ascending: false })
    .order('grade')
    .order('term', { nullsFirst: false });

  if (error || !data) return [];

  return data.map((p: any) => ({
    ...p,
    subject_label:    p.subjects?.label ?? null,
    teacher_name:     p.teachers?.name ?? null,
    teacher_surname:  p.teachers?.surname ?? null,
    subjects:  undefined,
    teachers:  undefined,
  }));
}

// ── Fetch papers uploaded by a teacher ───────────────────────

export async function fetchTeacherPastPapers(
  teacher_id: number,
  school_id: number
): Promise<PastPaper[]> {
  const { data, error } = await supabaseAdmin
    .from('past_papers')
    .select('*, subjects(label)')
    .eq('teacher_id', teacher_id)
    .eq('school_id', school_id)
    .order('year', { ascending: false })
    .order('grade')
    .order('term', { nullsFirst: false });

  if (error || !data) return [];

  return data.map((p: any) => ({
    ...p,
    subject_label: p.subjects?.label ?? null,
    subjects: undefined,
  }));
}

// ── Create past paper ─────────────────────────────────────────

export async function createPastPaper(input: CreatePastPaperInput): Promise<PastPaperResult> {
  const uploaded = await uploadPaperFile(input.file, input.school_id);
  if ('uploadError' in uploaded) {
    return { success: false, error: `Upload failed: ${uploaded.uploadError}` };
  }

  const { data, error } = await supabaseAdmin
    .from('past_papers')
    .insert({
      school_id:    input.school_id,
      teacher_id:   input.teacher_id,
      subject_id:   input.subject_id,
      grade:        input.grade,
      title:        input.title.trim(),
      year:         input.year,
      term:         input.term ?? null,
      paper_number: input.paper_number ?? 1,
      file_url:     uploaded.path,
      file_name:    uploaded.name,
    })
    .select('*')
    .single();

  if (error || !data) {
    console.error('[past-papers] insert error:', error?.message);
    return { success: false, error: error?.message ?? 'Failed to save paper.' };
  }
  return { success: true, paper: data };
}

// ── Delete past paper ─────────────────────────────────────────

export async function deletePastPaper(
  id: number,
  school_id: number,
  file_url: string
): Promise<SimpleResult> {
  await deletePaperFile(file_url);
  const { error } = await supabaseAdmin
    .from('past_papers')
    .delete()
    .eq('id', id)
    .eq('school_id', school_id);
  if (error) return { success: false, error: 'Failed to delete paper.' };
  return { success: true };
}
