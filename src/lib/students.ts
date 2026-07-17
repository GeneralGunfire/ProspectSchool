import { supabaseAdmin } from './supabase';
import { hashPin } from './auth';

// ── Types ─────────────────────────────────────────────────────

export interface Subject {
  id: number;
  code: string;
  label: string;
  grades: string;
  school_id?: number | null;
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

export type LookupStudentResult =
  | { success: true; student: Student }
  | { success: false; error: string };

export type AssignStudentResult =
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

// ── Admin: create a new subject ───────────────────────────────

export type CreateSubjectResult =
  | { success: true; subject: Subject }
  | { success: false; error: string };

export async function createSubject(
  code: string,
  label: string,
  grades: string
): Promise<CreateSubjectResult> {
  const trimmedCode = code.trim().toLowerCase();
  const trimmedLabel = label.trim();
  if (!trimmedCode || !trimmedLabel) {
    return { success: false, error: 'Code and label are required.' };
  }

  const { data: existing } = await supabaseAdmin
    .from('subjects')
    .select('id')
    .eq('code', trimmedCode)
    .maybeSingle();

  if (existing) {
    return { success: false, error: `Subject code "${trimmedCode}" already exists.` };
  }

  const { data, error } = await supabaseAdmin
    .from('subjects')
    .insert({ code: trimmedCode, label: trimmedLabel, grades: grades.trim() })
    .select('id, code, label, grades')
    .single();

  if (error || !data) return { success: false, error: 'Failed to create subject.' };
  return { success: true, subject: data };
}

// ── Admin: create a student with per-subject teacher assignments ──
// Unlike createStudent() (teacher-side, single teacher for all subjects),
// this lets admin pair each subject with a different teacher in one form.

export interface SubjectTeacherPair {
  subject_id: number;
  teacher_id: number;
}

export interface AdminCreateStudentInput {
  name: string;
  surname: string;
  student_code: string;
  pin: string;
  cohort_name: string;
  grade: number;
  school_id: number;
  assignments: SubjectTeacherPair[]; // one row per subject+teacher pair
}

export async function adminCreateStudent(input: AdminCreateStudentInput): Promise<CreateStudentResult> {
  const { name, surname, student_code, pin, cohort_name, grade, school_id, assignments } = input;

  const { data: existing } = await supabaseAdmin
    .from('students')
    .select('id')
    .eq('school_id', school_id)
    .eq('student_code', student_code.toUpperCase())
    .maybeSingle();

  if (existing) {
    return { success: false, error: `Student code "${student_code}" already exists in this school.` };
  }

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

  const pin_hash = await hashPin(pin);

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
    })
    .select('id, school_id, cohort_id, name, surname, grade, student_code, created_at')
    .single();

  if (studentError || !student) {
    return { success: false, error: 'Failed to create student. Please try again.' };
  }

  if (assignments.length > 0) {
    const junctionRows = assignments.map((a) => ({
      teacher_id: a.teacher_id,
      student_id: student.id,
      subject_id: a.subject_id,
    }));

    const { error: junctionError } = await supabaseAdmin
      .from('teacher_students')
      .insert(junctionRows);

    if (junctionError) {
      console.error('Subject/teacher linking failed:', junctionError.message);
    }
  }

  return { success: true, student };
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

// ── Look up an existing student by code (for Assign Student) ──
// Used when a teacher wants to link themselves to a student who was already
// added to the school by another teacher, instead of re-creating the student.

export async function lookupStudentByCode(
  student_code: string,
  school_id: number
): Promise<LookupStudentResult> {
  const { data: student, error } = await supabaseAdmin
    .from('students')
    .select('id, school_id, cohort_id, name, surname, grade, student_code, created_at, cohorts(id, name)')
    .eq('school_id', school_id)
    .eq('student_code', student_code.trim().toUpperCase())
    .maybeSingle();

  if (error || !student) {
    return { success: false, error: `No student found with code "${student_code}" in this school.` };
  }

  return {
    success: true,
    student: { ...student, cohort: (student as any).cohorts ?? undefined },
  };
}

// ── Assign an existing student to a teacher for given subjects ─
// Adds teacher_students rows only — never touches the student's own record
// (name, surname, grade, PIN, cohort). Safe to call even if some of the
// requested subjects are already linked (those are simply skipped).

export async function assignStudentToTeacher(
  teacher_id: number,
  student_id: number,
  school_id: number,
  subject_codes: string[]
): Promise<AssignStudentResult> {
  if (subject_codes.length === 0) {
    return { success: false, error: 'Please select at least one subject.' };
  }

  // Confirm the student actually belongs to this school before linking.
  const { data: student } = await supabaseAdmin
    .from('students')
    .select('id')
    .eq('id', student_id)
    .eq('school_id', school_id)
    .maybeSingle();

  if (!student) {
    return { success: false, error: 'Student not found in this school.' };
  }

  const { data: subjects } = await supabaseAdmin
    .from('subjects')
    .select('id, code')
    .in('code', subject_codes);

  if (!subjects || subjects.length === 0) {
    return { success: false, error: 'No matching subjects found.' };
  }

  // Skip subjects already linked to this teacher for this student.
  const { data: existingLinks } = await supabaseAdmin
    .from('teacher_students')
    .select('subject_id')
    .eq('teacher_id', teacher_id)
    .eq('student_id', student_id);

  const existingSubjectIds = new Set((existingLinks ?? []).map((l) => l.subject_id));
  const newRows = subjects
    .filter((s) => !existingSubjectIds.has(s.id))
    .map((s) => ({ teacher_id, student_id, subject_id: s.id }));

  if (newRows.length === 0) {
    return { success: false, error: 'You already teach this student all selected subjects.' };
  }

  const { error } = await supabaseAdmin.from('teacher_students').insert(newRows);

  if (error) {
    return { success: false, error: 'Failed to assign student. Please try again.' };
  }

  return { success: true };
}

// ── Admin: view/manage all teacher-student-subject links in a school ──

export interface AssignmentRow {
  assignment_id: number;
  teacher_id: number;
  teacher_name: string;
  teacher_surname: string;
  teacher_code: string;
  student_id: number;
  student_name: string;
  student_surname: string;
  student_code: string;
  student_grade: number;
  subject_id: number;
  subject_code: string;
  subject_label: string;
}

export async function fetchSchoolAssignments(school_id: number): Promise<AssignmentRow[]> {
  const { data, error } = await supabaseAdmin
    .from('teacher_student_assignments')
    .select('*')
    .eq('school_id', school_id)
    .order('student_surname');

  if (error || !data) return [];
  return data;
}

export type AdminAssignResult =
  | { success: true }
  | { success: false; error: string };

// Admin links a teacher to a student for one subject. Idempotent — a repeat
// call for an already-linked (teacher, student, subject) is a no-op success.
export async function adminAssignTeacherToStudent(
  teacher_id: number,
  student_id: number,
  subject_id: number
): Promise<AdminAssignResult> {
  const { error } = await supabaseAdmin
    .from('teacher_students')
    .upsert(
      { teacher_id, student_id, subject_id },
      { onConflict: 'teacher_id,student_id,subject_id', ignoreDuplicates: true }
    );

  if (error) return { success: false, error: 'Failed to link teacher to student.' };
  return { success: true };
}

// Admin removes a single teacher-student-subject link. Does not delete the
// student even if this was their last link — admin can do that from the
// student's row explicitly if intended.
export async function adminRemoveAssignment(assignment_id: number): Promise<AdminAssignResult> {
  const { error } = await supabaseAdmin
    .from('teacher_students')
    .delete()
    .eq('id', assignment_id);

  if (error) return { success: false, error: 'Failed to remove link.' };
  return { success: true };
}

// ── Admin: school-wide student directory ──────────────────────

export interface DirectoryStudent {
  id: number;
  school_id: number;
  cohort_id: number | null;
  name: string;
  surname: string;
  grade: number;
  student_code: string;
  created_at: string;
  cohort_name: string | null;
}

export async function fetchSchoolStudentDirectory(school_id: number): Promise<DirectoryStudent[]> {
  const { data, error } = await supabaseAdmin
    .from('students')
    .select('id, school_id, cohort_id, name, surname, grade, student_code, created_at, cohorts(name)')
    .eq('school_id', school_id)
    .order('surname');

  if (error || !data) return [];
  return data.map((s: any) => ({
    ...s,
    cohort_name: s.cohorts?.name ?? null,
  }));
}

// ── Admin: full detail for one student (profile + subjects/teachers) ──

export interface StudentDetail {
  id: number;
  school_id: number;
  cohort_id: number | null;
  cohort_name: string | null;
  name: string;
  surname: string;
  grade: number;
  student_code: string;
  created_at: string;
  teacherLinks: { teacher_id: number; teacher_name: string; teacher_surname: string; subject_id: number; subject_label: string }[];
}

export type StudentDetailResult =
  | { success: true; detail: StudentDetail }
  | { success: false; error: string };

export async function fetchStudentDetail(
  student_id: number,
  school_id: number
): Promise<StudentDetailResult> {
  const { data: student, error } = await supabaseAdmin
    .from('students')
    .select('id, school_id, cohort_id, name, surname, grade, student_code, created_at, cohorts(name)')
    .eq('id', student_id)
    .eq('school_id', school_id)
    .maybeSingle();

  if (error || !student) return { success: false, error: 'Student not found.' };

  const { data: links } = await supabaseAdmin
    .from('teacher_students')
    .select('teacher_id, subject_id, teachers(name, surname), subjects(label)')
    .eq('student_id', student_id);

  const teacherLinks = (links ?? []).map((l: any) => ({
    teacher_id: l.teacher_id,
    teacher_name: l.teachers?.name ?? '',
    teacher_surname: l.teachers?.surname ?? '',
    subject_id: l.subject_id,
    subject_label: l.subjects?.label ?? '',
  }));

  return {
    success: true,
    detail: {
      id: student.id,
      school_id: student.school_id,
      cohort_id: student.cohort_id,
      cohort_name: (student as any).cohorts?.name ?? null,
      name: student.name,
      surname: student.surname,
      grade: student.grade,
      student_code: student.student_code,
      created_at: student.created_at,
      teacherLinks,
    },
  };
}

// ── Admin: update a student's profile fields ──────────────────
// Separate from teacher-side updateStudent() — admin can rename the cohort
// (get-or-create by name, same as elsewhere), change grade, reset the PIN,
// and edit the student_code (checked for uniqueness within the school).

export interface AdminUpdateStudentInput {
  student_id: number;
  school_id: number;
  name: string;
  surname: string;
  student_code: string;
  cohort_name: string;
  grade: number;
  pin?: string; // only re-hash if provided
}

export async function adminUpdateStudent(input: AdminUpdateStudentInput): Promise<UpdateStudentResult> {
  const { student_id, school_id, name, surname, student_code, cohort_name, grade, pin } = input;

  const { data: codeClash } = await supabaseAdmin
    .from('students')
    .select('id')
    .eq('school_id', school_id)
    .eq('student_code', student_code.toUpperCase())
    .neq('id', student_id)
    .maybeSingle();

  if (codeClash) {
    return { success: false, error: `Student code "${student_code}" is already used by another student.` };
  }

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
      if (cohortError || !newCohort) return { success: false, error: 'Failed to update class.' };
      cohortId = newCohort.id;
    }
  }

  const payload: Record<string, any> = {
    name: name.trim(),
    surname: surname.trim(),
    student_code: student_code.toUpperCase(),
    cohort_id: cohortId,
    grade,
  };
  if (pin) payload.pin_hash = await hashPin(pin);

  const { error } = await supabaseAdmin
    .from('students')
    .update(payload)
    .eq('id', student_id)
    .eq('school_id', school_id);

  if (error) return { success: false, error: 'Failed to update student.' };
  return { success: true };
}

// ── Admin: replace all of a student's subject+teacher links ───
// Full replace-all, same pattern as adminCreateStudent's assignments.

export async function replaceStudentAssignments(
  student_id: number,
  assignments: SubjectTeacherPair[]
): Promise<UpdateStudentResult> {
  const { error: deleteError } = await supabaseAdmin
    .from('teacher_students')
    .delete()
    .eq('student_id', student_id);

  if (deleteError) return { success: false, error: 'Failed to update subject assignments.' };

  if (assignments.length === 0) return { success: true };

  const { error: insertError } = await supabaseAdmin
    .from('teacher_students')
    .insert(assignments.map((a) => ({ teacher_id: a.teacher_id, student_id, subject_id: a.subject_id })));

  if (insertError) return { success: false, error: 'Failed to save subject assignments.' };
  return { success: true };
}

// ── Admin: students in the school not currently in a given cohort ──
// Used by the "add student to class" flow on the class detail page.

export async function fetchStudentsOutsideCohort(
  school_id: number,
  cohort_id: number
): Promise<DirectoryStudent[]> {
  const { data, error } = await supabaseAdmin
    .from('students')
    .select('id, school_id, cohort_id, name, surname, grade, student_code, created_at, cohorts(name)')
    .eq('school_id', school_id)
    .neq('cohort_id', cohort_id)
    .order('surname');

  // neq excludes NULL cohort_id rows in Postgres, so fetch those separately.
  const { data: unassigned } = await supabaseAdmin
    .from('students')
    .select('id, school_id, cohort_id, name, surname, grade, student_code, created_at, cohorts(name)')
    .eq('school_id', school_id)
    .is('cohort_id', null)
    .order('surname');

  if (error) return [];
  const combined = [...(data ?? []), ...(unassigned ?? [])];
  return combined.map((s: any) => ({ ...s, cohort_name: s.cohorts?.name ?? null }));
}

// ── Admin: move an existing student into a different cohort ──

export type MoveStudentResult =
  | { success: true }
  | { success: false; error: string };

export async function moveStudentToCohort(
  student_id: number,
  cohort_id: number,
  school_id: number
): Promise<MoveStudentResult> {
  const { error } = await supabaseAdmin
    .from('students')
    .update({ cohort_id })
    .eq('id', student_id)
    .eq('school_id', school_id);

  if (error) return { success: false, error: 'Failed to add student to class.' };
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
