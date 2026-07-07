import { supabaseAdmin } from './supabase';
import { hashPin } from './auth';

// ── Types ─────────────────────────────────────────────────────

export interface Parent {
  id: number;
  school_id: number;
  name: string;
  surname: string;
  parent_code: string;
  is_active: boolean;
  created_at: string;
  last_login_at: string | null;
}

export interface ParentChild {
  student_id: number;
  name: string;
  surname: string;
  student_code: string;
  grade: number;
  cohort_id: number | null;
  cohort_name: string | null;
}

export interface CreateParentInput {
  school_id: number;
  name: string;
  surname: string;
  parent_code: string;
  pin: string;
  student_ids: number[];
}

export type CreateParentResult =
  | { success: true; parent: Parent }
  | { success: false; error: string };

export type UpdateParentResult =
  | { success: true }
  | { success: false; error: string };

// ── Admin: fetch all parents for a school (with linked child names) ──

export async function fetchSchoolParents(school_id: number): Promise<(Parent & { children: ParentChild[] })[]> {
  const { data: parents, error } = await supabaseAdmin
    .from('parents')
    .select('id, school_id, name, surname, parent_code, is_active, created_at, last_login_at')
    .eq('school_id', school_id)
    .order('surname');

  if (error || !parents) return [];

  const { data: links } = await supabaseAdmin
    .from('parent_students')
    .select('parent_id, students(id, name, surname, student_code, grade, cohort_id, cohorts(id, name))')
    .in('parent_id', parents.map((p) => p.id));

  const childrenByParent = new Map<number, ParentChild[]>();
  for (const link of links ?? []) {
    const s = (link as any).students;
    if (!s) continue;
    const list = childrenByParent.get((link as any).parent_id) ?? [];
    list.push({
      student_id: s.id,
      name: s.name,
      surname: s.surname,
      student_code: s.student_code,
      grade: s.grade,
      cohort_id: s.cohort_id,
      cohort_name: s.cohorts?.name ?? null,
    });
    childrenByParent.set((link as any).parent_id, list);
  }

  return parents.map((p) => ({ ...p, children: childrenByParent.get(p.id) ?? [] }));
}

// ── Admin: create a parent + link children ──

export async function createParent(input: CreateParentInput): Promise<CreateParentResult> {
  const { school_id, name, surname, parent_code, pin, student_ids } = input;

  const { data: existing } = await supabaseAdmin
    .from('parents')
    .select('id')
    .eq('school_id', school_id)
    .eq('parent_code', parent_code.toUpperCase())
    .maybeSingle();

  if (existing) {
    return { success: false, error: `Parent code "${parent_code}" already exists in this school.` };
  }

  const pin_hash = await hashPin(pin);

  const { data, error } = await supabaseAdmin
    .from('parents')
    .insert({
      school_id,
      name: name.trim(),
      surname: surname.trim(),
      parent_code: parent_code.toUpperCase(),
      pin_hash,
    })
    .select('id, school_id, name, surname, parent_code, is_active, created_at, last_login_at')
    .single();

  if (error || !data) {
    return { success: false, error: error?.message ?? 'Failed to create parent.' };
  }

  if (student_ids.length > 0) {
    await supabaseAdmin
      .from('parent_students')
      .insert(student_ids.map((student_id) => ({ parent_id: data.id, student_id })));
  }

  return { success: true, parent: data };
}

// ── Admin: update a parent's children links (replace-all) ──

export async function setParentChildren(parent_id: number, student_ids: number[]): Promise<UpdateParentResult> {
  const { error: delError } = await supabaseAdmin.from('parent_students').delete().eq('parent_id', parent_id);
  if (delError) return { success: false, error: 'Failed to update linked children.' };

  if (student_ids.length > 0) {
    const { error: insError } = await supabaseAdmin
      .from('parent_students')
      .insert(student_ids.map((student_id) => ({ parent_id, student_id })));
    if (insError) return { success: false, error: 'Failed to update linked children.' };
  }
  return { success: true };
}

// ── Admin: update parent profile / PIN / active status ──

export async function updateParent(
  parent_id: number,
  updates: { name?: string; surname?: string; is_active?: boolean; pin?: string }
): Promise<UpdateParentResult> {
  const payload: Record<string, unknown> = {};
  if (updates.name !== undefined) payload.name = updates.name.trim();
  if (updates.surname !== undefined) payload.surname = updates.surname.trim();
  if (updates.is_active !== undefined) payload.is_active = updates.is_active;
  if (updates.pin !== undefined) payload.pin_hash = await hashPin(updates.pin);

  const { error } = await supabaseAdmin.from('parents').update(payload).eq('id', parent_id);
  if (error) return { success: false, error: 'Failed to update parent.' };
  return { success: true };
}

// ── Admin: delete a parent account ──

export async function deleteParent(parent_id: number): Promise<UpdateParentResult> {
  const { error } = await supabaseAdmin.from('parents').delete().eq('id', parent_id);
  if (error) return { success: false, error: 'Failed to delete parent.' };
  return { success: true };
}

// ── Parent: fetch own linked children ──

export async function fetchParentChildren(parent_id: number): Promise<ParentChild[]> {
  const { data, error } = await supabaseAdmin
    .from('parent_students')
    .select('students(id, name, surname, student_code, grade, cohort_id, cohorts(id, name))')
    .eq('parent_id', parent_id);

  if (error || !data) return [];

  return data
    .map((row: any) => row.students)
    .filter(Boolean)
    .map((s: any) => ({
      student_id: s.id,
      name: s.name,
      surname: s.surname,
      student_code: s.student_code,
      grade: s.grade,
      cohort_id: s.cohort_id,
      cohort_name: s.cohorts?.name ?? null,
    }))
    .sort((a: ParentChild, b: ParentChild) => a.name.localeCompare(b.name));
}
