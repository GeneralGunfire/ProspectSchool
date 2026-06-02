// ── Student Goals — localStorage-backed, no backend needed ────────────────────

export interface StudentGoals {
  targetAps: number | null;
  targetCareer: string | null;
  updatedAt: string;
}

const KEY = (studentId: number) => `prospect_goals_${studentId}`;

export function getStudentGoals(studentId: number): StudentGoals {
  try {
    const raw = localStorage.getItem(KEY(studentId));
    if (!raw) return { targetAps: null, targetCareer: null, updatedAt: '' };
    return JSON.parse(raw);
  } catch {
    return { targetAps: null, targetCareer: null, updatedAt: '' };
  }
}

export function saveStudentGoals(studentId: number, goals: Partial<StudentGoals>): StudentGoals {
  const existing = getStudentGoals(studentId);
  const updated: StudentGoals = {
    ...existing,
    ...goals,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(KEY(studentId), JSON.stringify(updated));
  return updated;
}

export function clearStudentGoals(studentId: number): void {
  localStorage.removeItem(KEY(studentId));
}
