import { supabaseAdmin } from './supabase';
import { hashPin } from './auth';

// ── Types ─────────────────────────────────────────────────────

export interface SchoolWithStats {
  id: number;
  name: string;
  school_code: string;
  province: string | null;
  created_at: string;
  teacher_count: number;
  student_count: number;
}

// ── Platform: list all schools with basic stats ────────────────

export async function fetchAllSchools(): Promise<SchoolWithStats[]> {
  const { data: schools, error } = await supabaseAdmin
    .from('schools')
    .select('id, name, school_code, province, created_at')
    .order('name');

  if (error || !schools) return [];

  const [{ data: teachers }, { data: students }] = await Promise.all([
    supabaseAdmin.from('teachers').select('school_id'),
    supabaseAdmin.from('students').select('school_id'),
  ]);

  const teacherCounts = new Map<number, number>();
  for (const t of teachers ?? []) teacherCounts.set(t.school_id, (teacherCounts.get(t.school_id) ?? 0) + 1);

  const studentCounts = new Map<number, number>();
  for (const s of students ?? []) studentCounts.set(s.school_id, (studentCounts.get(s.school_id) ?? 0) + 1);

  return schools.map((s) => ({
    ...s,
    teacher_count: teacherCounts.get(s.id) ?? 0,
    student_count: studentCounts.get(s.id) ?? 0,
  }));
}

// ── Platform: rename a school ───────────────────────────────────

export type UpdateSchoolResult =
  | { success: true }
  | { success: false; error: string };

export async function updateSchoolName(school_id: number, name: string): Promise<UpdateSchoolResult> {
  const trimmed = name.trim();
  if (!trimmed) return { success: false, error: 'School name is required.' };

  const { error } = await supabaseAdmin
    .from('schools')
    .update({ name: trimmed })
    .eq('id', school_id);

  if (error) return { success: false, error: 'Failed to rename school.' };
  return { success: true };
}

// ── Platform: create a new school + its first school_admin ─────

export interface CreateSchoolInput {
  school_name: string;
  school_code: string;
  province?: string;
  admin_name: string;
  admin_surname: string;
  admin_code: string;
  admin_pin: string; // 10 digits, same convention as teacher/student PINs
}

export type CreateSchoolResult =
  | { success: true; school_id: number }
  | { success: false; error: string };

export async function createSchoolWithAdmin(input: CreateSchoolInput): Promise<CreateSchoolResult> {
  const {
    school_name, school_code, province,
    admin_name, admin_surname, admin_code, admin_pin,
  } = input;

  if (!/^\d{10}$/.test(admin_pin)) {
    return { success: false, error: 'Admin PIN must be exactly 10 digits.' };
  }

  const trimmedCode = school_code.trim().toUpperCase();
  const { data: existingSchool } = await supabaseAdmin
    .from('schools')
    .select('id')
    .eq('school_code', trimmedCode)
    .maybeSingle();

  if (existingSchool) {
    return { success: false, error: `School code "${trimmedCode}" is already in use.` };
  }

  const { data: school, error: schoolError } = await supabaseAdmin
    .from('schools')
    .insert({ name: school_name.trim(), school_code: trimmedCode, province: province?.trim() || null })
    .select('id')
    .single();

  if (schoolError || !school) {
    return { success: false, error: 'Failed to create school.' };
  }

  const pin_hash = await hashPin(admin_pin);
  const { error: adminError } = await supabaseAdmin
    .from('admins')
    .insert({
      school_id: school.id,
      name: admin_name.trim(),
      surname: admin_surname.trim(),
      admin_code: admin_code.trim().toUpperCase(),
      pin_hash,
      role: 'school_admin',
      is_active: true,
    });

  if (adminError) {
    // School row exists but admin creation failed — surface this clearly
    // rather than leaving a silent orphan school with no way to log in.
    return { success: false, error: 'School created, but failed to create the admin account. Check the admin code is unique and try again.' };
  }

  return { success: true, school_id: school.id };
}
