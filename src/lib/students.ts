import { supabaseAdmin } from './supabase';
import { hashPin } from './auth';

// ── Types ─────────────────────────────────────────────────────

export interface Subject {
  id: number;
  code: string;
  label: string;
  grades: string;
}

export interface Student {
  id: number;
  school_id: number;
  cohort_id: number | null;
  name: string;
  surname: string;
  grade: number;
  student_code: string;
  created_at: string;
  cohort?: { id: number; name: string };
  subjects?: Subject[];
}

export interface CreateStudentInput {
  name: string;
  surname: string;
  student_code: string;
  pin: string;
  cohort_name: string;   // e.g. "10A"
  grade: number;
  subject_codes: string[]; // e.g. ['math', 'english']
  teacher_id: number;
  school_id: number;
}

export type CreateStudentResult =
  | { success: true; student: Student }
  | { success: false; error: string };

export type FetchStudentsResult =
  | { success: true; students: Student[] }
  | { success: false; error: string };

export type UpdateStudentResult =
  | { success: true }
  | { success: false; error: string };

export type DeleteStudentResult =
  | { success: true }
  | { success: false; error: string };

// ── Fetch all subjects ────────────────────────────────────────

export async function fetchSubjects(): Promise<Subject[]> {
  const { data, error } = await supabaseAdmin
    .from('subjects')
    .select('id, code, label, grades')
    .order('label');

  if (error || !data) return [];
  return data;
}

// ── Create student ────────────────────────────────────────────
// Steps:
//  1. Validate student_code unique within school
//  2. Get or create cohort
//  3. Hash PIN
//  4. Insert student
//  5. Insert teacher_students rows (one per subject)

export async function createStudent(input: CreateStudentInput): Promise<CreateStudentResult> {
  const {
    name, surname, student_code, pin,
    cohort_name, grade, subject_codes,
    teacher_id, school_id,
  } = input;

  // 1. Check student_code uniqueness within school
  const { data: existing } = await supabaseAdmin
    .from('students')
    .select('id')
    .eq('school_id', school_id)
    .eq('student_code', student_code.toUpperCase())
    .maybeSingle();

  if (existing) {
    return { success: false, error: `Student code "${student_code}" already exists in this school.` };
  }

  // 2. Get or create cohort
  let cohortId: number | null = null;

  if (cohort_name.trim()) {
    const { data: existingCohort } = await supabaseAdmin
      .from('cohorts')
      .select('id')
      .eq('school_id', school_id)
      .eq('name', cohort_name.trim())
      .maybeSingle();

    if (existingCohort) {
      cohortId = existingCohort.id;
    } else {
      const { data: newCohort, error: cohortError } = await supabaseAdmin
        .from('cohorts')
        .insert({ school_id, name: cohort_name.trim(), grade })
        .select('id')
        .single();

      if (cohortError || !newCohort) {
        return { success: false, error: 'Failed to create class. Please try again.' };
      }
      cohortId = newCohort.id;
    }
  }

  // 3. Hash PIN
  const pin_hash = await hashPin(pin);

  // 4. Insert student
  const { data: student, error: studentError } = await supabaseAdmin
    .from('students')
    .insert({
      school_id,
      cohort_id: cohortId,
      name: name.trim(),
      surname: surname.trim(),
      grade,
      student_code: student_code.toUpperCase(),
      pin_hash,
      created_by: teacher_id,
    })
    .select('id, school_id, cohort_id, name, surname, grade, student_code, created_at')
    .single();

  if (studentError || !student) {
    return { success: false, error: 'Failed to create student. Please try again.' };
  }

  // 5. Resolve subject IDs from codes
  if (subject_codes.length > 0) {
    const { data: subjects } = await supabaseAdmin
      .from('subjects')
      .select('id, code')
      .in('code', subject_codes);

    if (subjects && subjects.length > 0) {
      const junctionRows = subjects.map((s) => ({
        teacher_id,
        student_id: student.id,
        subject_id: s.id,
      }));

      const { error: junctionError } = await supabaseAdmin
        .from('teacher_students')
        .insert(junctionRows);

      if (junctionError) {
        // Student was created but subject linking failed — still return success
        // but log for debugging
        console.error('Subject linking failed:', junctionError.message);
      }
    }
  }

  return { success: true, student };
}

// ── Update student ────────────────────────────────────────────
// Updates name, surname, grade, cohort, PIN (if provided), and subject links for this teacher

export interface UpdateStudentInput {
  student_id: number;
  teacher_id: number;
  school_id: number;
  name: string;
  surname: string;
  cohort_name: string;
  grade: number;
  pin?: string;           // only re-hash if provided
  subject_codes: string[];
}

export async function updateStudent(input: UpdateStudentInput): Promise<UpdateStudentResult> {
  const { student_id, teacher_id, school_id, name, surname, cohort_name, grade, pin, subject_codes } = input;

  // 1. Get or create cohort
  let cohortId: number | null = null;
  if (cohort_name.trim()) {
    const { data: existingCohort } = await supabaseAdmin
      .from('cohorts')
      .select('id')
      .eq('school_id', school_id)
      .eq('name', cohort_name.trim())
      .maybeSingle();

    if (existingCohort) {
      cohortId = existingCohort.id;
    } else {
      const { data: newCohort, error: cohortError } = await supabaseAdmin
        .from('cohorts')
        .insert({ school_id, name: cohort_name.trim(), grade })
        .select('id')
        .single();
      if (cohortError || !newCohort) {
        return { success: false, error: 'Failed to update class.' };
      }
      cohortId = newCohort.id;
    }
  }

  // 2. Build update payload
  const updatePayload: Record<string, any> = {
    name: name.trim(),
    surname: surname.trim(),
    grade,
    cohort_id: cohortId,
  };
  if (pin) {
    updatePayload.pin_hash = await hashPin(pin);
  }

  // 3. Update student row
  const { error: updateError } = await supabaseAdmin
    .from('students')
    .update(updatePayload)
    .eq('id', student_id)
    .eq('school_id', school_id);

  if (updateError) {
    return { success: false, error: 'Failed to update student.' };
  }

  // 4. Replace this teacher's subject links for this student
  await supabaseAdmin
    .from('teacher_students')
    .delete()
    .eq('teacher_id', teacher_id)
    .eq('student_id', student_id);

  if (subject_codes.length > 0) {
    const { data: subjects } = await supabaseAdmin
      .from('subjects')
      .select('id, code')
      .in('code', subject_codes);

    if (subjects && subjects.length > 0) {
      await supabaseAdmin
        .from('teacher_students')
        .insert(subjects.map((s) => ({ teacher_id, student_id, subject_id: s.id })));
    }
  }

  return { success: true };
}

// ── Remove student ────────────────────────────────────────────
// Removes teacher_students links for this teacher.
// Only fully deletes the student if no other teacher has a link to them.

export async function removeStudentFromTeacher(
  teacher_id: number,
  student_id: number,
  school_id: number
): Promise<DeleteStudentResult> {
  // 1. Remove this teacher's links
  await supabaseAdmin
    .from('teacher_students')
    .delete()
    .eq('teacher_id', teacher_id)
    .eq('student_id', student_id);

  // 2. Check if any other teacher still has this student
  const { data: remaining } = await supabaseAdmin
    .from('teacher_students')
    .select('id')
    .eq('student_id', student_id)
    .limit(1);

  // 3. If no other teacher has this student, delete the student record
  if (!remaining || remaining.length === 0) {
    const { error } = await supabaseAdmin
      .from('students')
      .delete()
      .eq('id', student_id)
      .eq('school_id', school_id);

    if (error) {
      return { success: false, error: 'Failed to delete student.' };
    }
  }

  return { success: true };
}

// ── Fetch students for a teacher ──────────────────────────────
// Returns all students this teacher has at least one subject relationship with

export async function fetchTeacherStudents(
  teacher_id: number,
  school_id: number
): Promise<FetchStudentsResult> {
  // Get all student_ids this teacher is linked to
  const { data: links, error: linkError } = await supabaseAdmin
    .from('teacher_students')
    .select('student_id, subject_id, subjects(id, code, label, grades)')
    .eq('teacher_id', teacher_id);

  if (linkError) {
    return { success: false, error: 'Failed to fetch students.' };
  }

  if (!links || links.length === 0) {
    return { success: true, students: [] };
  }

  // Get unique student IDs
  const studentIds = [...new Set(links.map((l) => l.student_id))];

  // Fetch student records
  const { data: studentsRaw, error: studentError } = await supabaseAdmin
    .from('students')
    .select('id, school_id, cohort_id, name, surname, grade, student_code, created_at, cohorts(id, name)')
    .in('id', studentIds)
    .eq('school_id', school_id)
    .order('surname');

  if (studentError || !studentsRaw) {
    return { success: false, error: 'Failed to fetch student details.' };
  }

  // Attach subjects to each student
  const students: Student[] = studentsRaw.map((s: any) => {
    const studentSubjects = links
      .filter((l) => l.student_id === s.id)
      .map((l) => l.subjects as unknown as Subject)
      .filter(Boolean);

    return {
      ...s,
      cohort: s.cohorts ?? undefined,
      subjects: studentSubjects,
    };
  });

  return { success: true, students };
}
