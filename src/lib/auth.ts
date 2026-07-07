import { supabaseAdmin } from './supabase';

// ── Hashing ───────────────────────────────────────────────────
// SHA-256 via Web Crypto API — no library needed
export async function hashPin(pin: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(pin);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// ── Session storage ───────────────────────────────────────────
const SESSION_KEY = 'prospect_teacher_session';

export interface TeacherSession {
  teacher_id: number;
  school_id: number;
  school_code: string;
  school_name: string;
  name: string;
  surname: string;
  teacher_code: string;
  role: 'teacher' | 'school_admin';
}

export function getTeacherSession(): TeacherSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setTeacherSession(session: TeacherSession): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearTeacherSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

// ── Login ─────────────────────────────────────────────────────
export type TeacherLoginResult =
  | { success: true; session: TeacherSession }
  | { success: false; error: string };

export async function teacherLogin(
  schoolCode: string,
  teacherCode: string,
  pin: string
): Promise<TeacherLoginResult> {
  // Validate PIN is 10 digits
  if (!/^\d{10}$/.test(pin)) {
    return { success: false, error: 'PIN must be exactly 10 digits.' };
  }

  // 1. Look up the school by code
  const { data: school, error: schoolError } = await supabaseAdmin
    .from('schools')
    .select('id, name, school_code')
    .eq('school_code', schoolCode.toUpperCase())
    .single();

  if (schoolError || !school) {
    return { success: false, error: 'School code not found.' };
  }

  // 2. Look up the teacher within that school
  const { data: teacher, error: teacherError } = await supabaseAdmin
    .from('teachers')
    .select('id, school_id, name, surname, teacher_code, pin_hash, role, is_active')
    .eq('school_id', school.id)
    .eq('teacher_code', teacherCode.toUpperCase())
    .single();

  if (teacherError || !teacher) {
    return { success: false, error: 'Teacher code not found.' };
  }

  if (!teacher.is_active) {
    return { success: false, error: 'This account has been deactivated. Contact your administrator.' };
  }

  // 3. Verify PIN
  const pinHash = await hashPin(pin);
  if (pinHash !== teacher.pin_hash) {
    return { success: false, error: 'Incorrect PIN.' };
  }

  // 4. Update last_login_at
  await supabaseAdmin
    .from('teachers')
    .update({ last_login_at: new Date().toISOString() })
    .eq('id', teacher.id);

  // 5. Build and store session
  const session: TeacherSession = {
    teacher_id: teacher.id,
    school_id: school.id,
    school_code: school.school_code,
    school_name: school.name,
    name: teacher.name,
    surname: teacher.surname,
    teacher_code: teacher.teacher_code,
    role: teacher.role,
  };

  setTeacherSession(session);
  return { success: true, session };
}

// ── Logout ────────────────────────────────────────────────────
export function teacherLogout(): void {
  clearTeacherSession();
}

// ═════════════════════════════════════════════════════════════
// STUDENT AUTH
// ═════════════════════════════════════════════════════════════

const STUDENT_SESSION_KEY = 'prospect_student_session';

export interface StudentSession {
  student_id: number;
  school_id: number;
  school_code: string;
  school_name: string;
  name: string;
  surname: string;
  student_code: string;
  grade: number;
  cohort_id: number | null;
  cohort_name: string | null;
}

export function getStudentSession(): StudentSession | null {
  try {
    const raw = localStorage.getItem(STUDENT_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStudentSession(session: StudentSession): void {
  localStorage.setItem(STUDENT_SESSION_KEY, JSON.stringify(session));
}

export function clearStudentSession(): void {
  localStorage.removeItem(STUDENT_SESSION_KEY);
}

export type StudentLoginResult =
  | { success: true; session: StudentSession }
  | { success: false; error: string };

export async function studentLogin(
  schoolCode: string,
  studentCode: string,
  pin: string
): Promise<StudentLoginResult> {
  if (!/^\d{10}$/.test(pin)) {
    return { success: false, error: 'PIN must be exactly 10 digits.' };
  }

  // 1. Look up school
  const { data: school, error: schoolError } = await supabaseAdmin
    .from('schools')
    .select('id, name, school_code')
    .eq('school_code', schoolCode.toUpperCase())
    .single();

  if (schoolError || !school) {
    return { success: false, error: 'School code not found.' };
  }

  // 2. Look up student within that school
  const { data: student, error: studentError } = await supabaseAdmin
    .from('students')
    .select('id, school_id, name, surname, student_code, grade, cohort_id, pin_hash, cohorts(id, name)')
    .eq('school_id', school.id)
    .eq('student_code', studentCode.toUpperCase())
    .single();

  if (studentError || !student) {
    return { success: false, error: 'Student code not found.' };
  }

  // 3. Verify PIN
  const pinHash = await hashPin(pin);
  if (pinHash !== student.pin_hash) {
    return { success: false, error: 'Incorrect PIN.' };
  }

  // 4. Build and store session
  const cohort = student.cohorts as any;
  const session: StudentSession = {
    student_id: student.id,
    school_id: school.id,
    school_code: school.school_code,
    school_name: school.name,
    name: student.name,
    surname: student.surname,
    student_code: student.student_code,
    grade: student.grade,
    cohort_id: student.cohort_id,
    cohort_name: cohort?.name ?? null,
  };

  setStudentSession(session);
  return { success: true, session };
}

export function studentLogout(): void {
  clearStudentSession();
}

// ═════════════════════════════════════════════════════════════
// ADMIN AUTH
// ═════════════════════════════════════════════════════════════

const ADMIN_SESSION_KEY = 'prospect_admin_session';

export interface AdminSession {
  admin_id: number;
  school_id: number | null;
  school_code: string | null;
  school_name: string | null;
  name: string;
  surname: string;
  admin_code: string;
  role: 'school_admin' | 'platform_admin';
}

export function getAdminSession(): AdminSession | null {
  try {
    const raw = localStorage.getItem(ADMIN_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function setAdminSession(session: AdminSession): void {
  localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
}

export function clearAdminSession(): void {
  localStorage.removeItem(ADMIN_SESSION_KEY);
}

export type AdminLoginResult =
  | { success: true; session: AdminSession }
  | { success: false; error: string };

export async function adminLogin(
  schoolCode: string,
  adminCode: string,
  pin: string
): Promise<AdminLoginResult> {
  if (!/^\d{10}$/.test(pin)) {
    return { success: false, error: 'PIN must be exactly 10 digits.' };
  }

  // 1. Look up school
  const { data: school, error: schoolError } = await supabaseAdmin
    .from('schools')
    .select('id, name, school_code')
    .eq('school_code', schoolCode.toUpperCase())
    .single();

  if (schoolError || !school) {
    return { success: false, error: 'School code not found.' };
  }

  // 2. Look up admin within that school
  const { data: admin, error: adminError } = await supabaseAdmin
    .from('admins')
    .select('id, school_id, name, surname, admin_code, pin_hash, role, is_active')
    .eq('school_id', school.id)
    .eq('admin_code', adminCode.toUpperCase())
    .single();

  if (adminError || !admin) {
    return { success: false, error: 'Admin code not found.' };
  }

  if (!admin.is_active) {
    return { success: false, error: 'This account has been deactivated.' };
  }

  // 3. Verify PIN
  const pinHash = await hashPin(pin);
  if (pinHash !== admin.pin_hash) {
    return { success: false, error: 'Incorrect PIN.' };
  }

  // 4. Update last_login_at
  await supabaseAdmin
    .from('admins')
    .update({ last_login_at: new Date().toISOString() })
    .eq('id', admin.id);

  // 5. Build session
  const session: AdminSession = {
    admin_id: admin.id,
    school_id: school.id,
    school_code: school.school_code,
    school_name: school.name,
    name: admin.name,
    surname: admin.surname,
    admin_code: admin.admin_code,
    role: admin.role,
  };

  setAdminSession(session);
  return { success: true, session };
}

export function adminLogout(): void {
  clearAdminSession();
}

// ═════════════════════════════════════════════════════════════
// PLATFORM ADMIN AUTH — hardcoded owner login, not Supabase-backed.
// Session is a client-side flag only. This is a soft gate (the hash
// ships in the JS bundle), not real security — do not use for anything
// that needs to withstand a determined attacker.
// ═════════════════════════════════════════════════════════════

const PLATFORM_SESSION_KEY = 'prospect_platform_session';
const PLATFORM_NAME = 'Rajen';
// SHA-256 of the platform owner's password — avoids the plaintext sitting in the bundle.
const PLATFORM_PASSWORD_HASH = '3ed4033a1d292b39f9a73db9dcfc99824339f5b317725815f684643986680b7d';

export interface PlatformSession {
  name: string;
}

export function getPlatformSession(): PlatformSession | null {
  try {
    const raw = sessionStorage.getItem(PLATFORM_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function setPlatformSession(session: PlatformSession): void {
  sessionStorage.setItem(PLATFORM_SESSION_KEY, JSON.stringify(session));
}

export function platformLogout(): void {
  sessionStorage.removeItem(PLATFORM_SESSION_KEY);
}

export type PlatformLoginResult =
  | { success: true; session: PlatformSession }
  | { success: false; error: string };

export async function platformLogin(name: string, password: string): Promise<PlatformLoginResult> {
  if (name.trim().toLowerCase() !== PLATFORM_NAME.toLowerCase()) {
    return { success: false, error: 'Invalid credentials.' };
  }
  const hash = await hashPin(password);
  if (hash !== PLATFORM_PASSWORD_HASH) {
    return { success: false, error: 'Invalid credentials.' };
  }
  const session: PlatformSession = { name: PLATFORM_NAME };
  setPlatformSession(session);
  return { success: true, session };
}
