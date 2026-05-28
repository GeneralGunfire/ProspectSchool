// ============================================================
// PROSPECT — Shared Types
// ============================================================

export interface School {
  id: number;
  name: string;
  province: string;
  emis_number: string | null;
  created_at: string;
}

export interface Cohort {
  id: number;
  school_id: number;
  name: string;
  grade: number;
  created_at: string;
}

export interface Student {
  id: number;
  school_id: number;
  cohort_id: number | null;
  name: string;
  surname: string;
  grade: number;
  student_number: string;
  username: string;
  created_at: string;
  // pin_hash is never returned to the frontend
}

// What's stored in the student session (in localStorage)
export interface StudentSession {
  student_id: number;
  school_id: number;
  name: string;
  surname: string;
  grade: number;
  username: string;
  cohort_id: number | null;
}

// Return shape for login
export type LoginResult =
  | { success: true; session: StudentSession }
  | { success: false; error: string };

// Return shape for create student
export type CreateStudentResult =
  | { success: true; student: Student; pin: string }  // pin returned once, plaintext
  | { success: false; error: string };
