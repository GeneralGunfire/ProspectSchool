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

// ── Platform: full stats breakdown for one school (drill-down page) ─

export interface SchoolStats {
  // Roster
  teacher_count: number;
  student_count: number;
  admin_count: number;
  cohort_count: number;
  created_at: string;

  // Activity / engagement
  mark_sheet_count: number;
  marks_entered_count: number;
  resource_count: number;
  past_paper_count: number;
  announcement_count: number;

  // At-risk / intervention health
  active_interventions: number;
  completed_interventions: number;
  outcomes_recorded: number;
  successful_outcomes: number;
  success_rate: number; // % of outcomes that were 'improved'

  // Topic Tests adoption
  topic_test_count: number;
  topic_test_assignment_count: number;
  topic_test_attempt_count: number;
  topic_test_pending_marking: number;
}

export async function fetchSchoolStats(school_id: number): Promise<SchoolStats> {
  const [
    { count: teacher_count },
    { count: student_count },
    { count: admin_count },
    { count: cohort_count },
    { count: mark_sheet_count },
    { count: marks_entered_count },
    { count: resource_count },
    { count: past_paper_count },
    { count: announcement_count },
    { count: active_interventions },
    { count: completed_interventions },
    { data: outcomes },
    { count: topic_test_count },
    { count: topic_test_assignment_count },
    { count: topic_test_attempt_count },
    { count: topic_test_pending_marking },
  ] = await Promise.all([
    supabaseAdmin.from('teachers').select('id', { count: 'exact', head: true }).eq('school_id', school_id),
    supabaseAdmin.from('students').select('id', { count: 'exact', head: true }).eq('school_id', school_id),
    supabaseAdmin.from('admins').select('id', { count: 'exact', head: true }).eq('school_id', school_id),
    supabaseAdmin.from('cohorts').select('id', { count: 'exact', head: true }).eq('school_id', school_id),
    supabaseAdmin.from('mark_sheets').select('id', { count: 'exact', head: true }).eq('school_id', school_id),
    supabaseAdmin.from('student_marks').select('id', { count: 'exact', head: true }).eq('school_id', school_id).not('mark', 'is', null),
    supabaseAdmin.from('resources').select('id', { count: 'exact', head: true }).eq('school_id', school_id),
    supabaseAdmin.from('past_papers').select('id', { count: 'exact', head: true }).eq('school_id', school_id),
    supabaseAdmin.from('announcements').select('id', { count: 'exact', head: true }).eq('school_id', school_id),
    supabaseAdmin.from('interventions').select('id', { count: 'exact', head: true }).eq('school_id', school_id).in('status', ['recommended', 'started']),
    supabaseAdmin.from('interventions').select('id', { count: 'exact', head: true }).eq('school_id', school_id).eq('status', 'completed'),
    supabaseAdmin.from('outcomes').select('result').eq('school_id', school_id),
    supabaseAdmin.from('topic_tests').select('id', { count: 'exact', head: true }).eq('school_id', school_id),
    supabaseAdmin.from('topic_test_assignments').select('id', { count: 'exact', head: true }).eq('school_id', school_id),
    supabaseAdmin.from('topic_test_attempts').select('id', { count: 'exact', head: true }).eq('school_id', school_id).not('submitted_at', 'is', null),
    supabaseAdmin.from('topic_test_attempts').select('id', { count: 'exact', head: true }).eq('school_id', school_id).eq('grading_complete', false).not('submitted_at', 'is', null),
  ]);

  const { data: school } = await supabaseAdmin.from('schools').select('created_at').eq('id', school_id).single();

  const outcomesRows = outcomes ?? [];
  const successfulOutcomes = outcomesRows.filter((o: any) => o.result === 'improved').length;

  return {
    teacher_count: teacher_count ?? 0,
    student_count: student_count ?? 0,
    admin_count: admin_count ?? 0,
    cohort_count: cohort_count ?? 0,
    created_at: school?.created_at ?? '',

    mark_sheet_count: mark_sheet_count ?? 0,
    marks_entered_count: marks_entered_count ?? 0,
    resource_count: resource_count ?? 0,
    past_paper_count: past_paper_count ?? 0,
    announcement_count: announcement_count ?? 0,

    active_interventions: active_interventions ?? 0,
    completed_interventions: completed_interventions ?? 0,
    outcomes_recorded: outcomesRows.length,
    successful_outcomes: successfulOutcomes,
    success_rate: outcomesRows.length > 0 ? Math.round((successfulOutcomes / outcomesRows.length) * 100) : 0,

    topic_test_count: topic_test_count ?? 0,
    topic_test_assignment_count: topic_test_assignment_count ?? 0,
    topic_test_attempt_count: topic_test_attempt_count ?? 0,
    topic_test_pending_marking: topic_test_pending_marking ?? 0,
  };
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
