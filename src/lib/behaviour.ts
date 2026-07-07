import { supabaseAdmin } from './supabase';

// ── Types ─────────────────────────────────────────────────────

export type BehaviourType = 'merit' | 'demerit';

export const MERIT_CATEGORIES = [
  'Leadership',
  'Respect',
  'Helpful',
  'Academic Improvement',
  'Outstanding Work',
  'Participation',
  'Community Service',
] as const;

export const DEMERIT_CATEGORIES = [
  'Uniform',
  'Homework',
  'Late',
  'Disruptive',
  'Cellphone',
  'Disrespect',
  'Bullying',
] as const;

// Predefined reasons per category — shown as quick-pick chips. Teachers can
// always fall back to "Custom" and type their own free-text reason instead.
export const MERIT_REASONS: Record<(typeof MERIT_CATEGORIES)[number], string[]> = {
  'Leadership': ['Led a group activity', 'Helped organise the class', 'Set a good example'],
  'Respect': ['Polite to staff', 'Respectful to peers', 'Good manners'],
  'Helpful': ['Helped a classmate', 'Assisted the teacher', 'Tidied up without being asked'],
  'Academic Improvement': ['Improved test mark', 'Improved homework quality', 'Extra effort shown'],
  'Outstanding Work': ['Excellent assignment', 'Excellent test result', 'Creative project work'],
  'Participation': ['Active in class discussion', 'Answered questions well', 'Volunteered for a task'],
  'Community Service': ['Helped with a school event', 'Volunteered time', 'Supported a fundraiser'],
};

export const DEMERIT_REASONS: Record<(typeof DEMERIT_CATEGORIES)[number], string[]> = {
  'Uniform': ['Incorrect uniform', 'Untidy appearance', 'Missing blazer/tie'],
  'Homework': ['Homework not done', 'Homework incomplete', 'Homework late'],
  'Late': ['Late for class', 'Late for school', 'Late after break'],
  'Disruptive': ['Talking in class', 'Disturbing other students', 'Not following instructions'],
  'Cellphone': ['Phone out in class', 'Phone not on silent/away', 'Using phone during test'],
  'Disrespect': ['Rude to a teacher', 'Rude to a peer', 'Talking back'],
  'Bullying': ['Verbal bullying', 'Physical altercation', 'Cyberbullying'],
};

export const CUSTOM_REASON = 'Custom' as const;

export interface BehaviourEntry {
  id: number;
  student_id: number;
  teacher_id: number;
  teacher_name: string | null;
  teacher_surname: string | null;
  type: BehaviourType;
  category: string;
  reason: string | null;
  points: number;
  note: string | null;
  created_at: string;
}

export interface BehaviourStudentSummary {
  student_id: number;
  merit_points: number;
  demerit_points: number;
  net_points: number;
}

export type AwardBehaviourResult =
  | { success: true }
  | { success: false; error: string };

// ── Teacher: award a merit/demerit to a student ──

export async function awardBehaviour(
  school_id: number,
  student_id: number,
  teacher_id: number,
  type: BehaviourType,
  category: string,
  reason: string,
  points: number,
  note?: string
): Promise<AwardBehaviourResult> {
  const { error } = await supabaseAdmin
    .from('behaviour_points')
    .insert({
      school_id,
      student_id,
      teacher_id,
      type,
      category,
      reason: reason.trim() || null,
      points,
      note: note?.trim() || null,
    });

  if (error) {
    console.error('awardBehaviour failed:', error.message);
    return { success: false, error: `Failed to award: ${error.message}` };
  }
  return { success: true };
}

// ── Teacher: delete an award (undo a mistake) ──

export async function deleteBehaviourEntry(id: number): Promise<AwardBehaviourResult> {
  const { error } = await supabaseAdmin.from('behaviour_points').delete().eq('id', id);
  if (error) return { success: false, error: 'Failed to remove entry.' };
  return { success: true };
}

// ── Fetch a student's full behaviour timeline (most recent first) ──

export async function fetchStudentBehaviour(student_id: number, limit = 50): Promise<BehaviourEntry[]> {
  const { data, error } = await supabaseAdmin
    .from('behaviour_points')
    .select('id, student_id, teacher_id, type, category, reason, points, note, created_at, teachers(name, surname)')
    .eq('student_id', student_id)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error || !data) return [];

  return data.map((row: any) => ({
    id: row.id,
    student_id: row.student_id,
    teacher_id: row.teacher_id,
    teacher_name: row.teachers?.name ?? null,
    teacher_surname: row.teachers?.surname ?? null,
    type: row.type,
    category: row.category,
    reason: row.reason,
    points: row.points,
    note: row.note,
    created_at: row.created_at,
  }));
}

// ── Fetch net-points summary for a set of students (e.g. a whole roster) ──

export async function fetchBehaviourSummary(student_ids: number[]): Promise<Map<number, BehaviourStudentSummary>> {
  const map = new Map<number, BehaviourStudentSummary>();
  if (student_ids.length === 0) return map;

  const { data, error } = await supabaseAdmin
    .from('behaviour_points')
    .select('student_id, type, points')
    .in('student_id', student_ids);

  for (const id of student_ids) {
    map.set(id, { student_id: id, merit_points: 0, demerit_points: 0, net_points: 0 });
  }
  if (error || !data) return map;

  for (const row of data) {
    const s = map.get(row.student_id);
    if (!s) continue;
    if (row.type === 'merit') s.merit_points += row.points;
    else s.demerit_points += row.points;
    s.net_points = s.merit_points - s.demerit_points;
  }
  return map;
}
