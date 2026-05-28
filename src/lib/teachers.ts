import { supabaseAdmin } from './supabase';
import { hashPin } from './auth';

// ── Types ─────────────────────────────────────────────────────

export interface Teacher {
  id: number;
  school_id: number;
  name: string;
  surname: string;
  teacher_code: string;
  role: 'teacher' | 'school_admin';
  is_active: boolean;
  created_at: string;
  last_login_at: string | null;
}

export interface CreateTeacherInput {
  school_id: number;
  name: string;
  surname: string;
  teacher_code: string;
  pin: string;
  role: 'teacher' | 'school_admin';
}

export type CreateTeacherResult =
  | { success: true; teacher: Teacher }
  | { success: false; error: string };

export type UpdateTeacherResult =
  | { success: true }
  | { success: false; error: string };

// ── Fetch all teachers for a school ──────────────────────────

export async function fetchSchoolTeachers(school_id: number): Promise<Teacher[]> {
  const { data, error } = await supabaseAdmin
    .from('teachers')
    .select('id, school_id, name, surname, teacher_code, role, is_active, created_at, last_login_at')
    .eq('school_id', school_id)
    .order('surname');

  if (error || !data) return [];
  return data;
}

// ── Create teacher ────────────────────────────────────────────

export async function createTeacher(input: CreateTeacherInput): Promise<CreateTeacherResult> {
  const { school_id, name, surname, teacher_code, pin, role } = input;

  // Check code uniqueness within school
  const { data: existing } = await supabaseAdmin
    .from('teachers')
    .select('id')
    .eq('school_id', school_id)
    .eq('teacher_code', teacher_code.toUpperCase())
    .maybeSingle();

  if (existing) {
    return { success: false, error: `Teacher code "${teacher_code}" already exists in this school.` };
  }

  const pin_hash = await hashPin(pin);

  const { data, error } = await supabaseAdmin
    .from('teachers')
    .insert({
      school_id,
      name: name.trim(),
      surname: surname.trim(),
      teacher_code: teacher_code.toUpperCase(),
      pin_hash,
      role,
    })
    .select('id, school_id, name, surname, teacher_code, role, is_active, created_at, last_login_at')
    .single();

  if (error || !data) {
    return { success: false, error: error?.message ?? 'Failed to create teacher.' };
  }

  return { success: true, teacher: data };
}

// ── Update teacher (name, surname, role, optional PIN reset) ──

export interface UpdateTeacherInput {
  teacher_id: number;
  school_id: number;
  name: string;
  surname: string;
  role: 'teacher' | 'school_admin';
  pin?: string;
}

export async function updateTeacher(input: UpdateTeacherInput): Promise<UpdateTeacherResult> {
  const { teacher_id, school_id, name, surname, role, pin } = input;

  const payload: Record<string, any> = {
    name: name.trim(),
    surname: surname.trim(),
    role,
  };

  if (pin) {
    payload.pin_hash = await hashPin(pin);
  }

  const { error } = await supabaseAdmin
    .from('teachers')
    .update(payload)
    .eq('id', teacher_id)
    .eq('school_id', school_id);

  if (error) return { success: false, error: 'Failed to update teacher.' };
  return { success: true };
}

// ── Toggle active/inactive ────────────────────────────────────

export async function setTeacherActive(
  teacher_id: number,
  school_id: number,
  is_active: boolean
): Promise<UpdateTeacherResult> {
  const { error } = await supabaseAdmin
    .from('teachers')
    .update({ is_active })
    .eq('id', teacher_id)
    .eq('school_id', school_id);

  if (error) return { success: false, error: 'Failed to update teacher status.' };
  return { success: true };
}
