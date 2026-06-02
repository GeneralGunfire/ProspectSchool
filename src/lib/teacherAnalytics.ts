// ── Teacher Analytics ─────────────────────────────────────────────────────────
// All queries scoped by teacher_id or school_id.
// No joins needed — interventions and outcomes carry teacher_id directly.

import { supabaseAdmin } from './supabase';
import type { InterventionType, OutcomeResult } from './interventions';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface TeacherImpactSummary {
  activeInterventions:    number;
  completedInterventions: number;
  successfulOutcomes:     number;
  successRate:            number;   // % of completed with result = 'improved'
  avgImprovement:         number;   // avg improvement across all outcomes
  bestType:               InterventionType | null;
  bestTypeSuccessRate:    number;
}

export interface TeacherSubjectHealth {
  subject:       string;
  subjectId:     number;
  grade:         number;
  studentCount:  number;
  classAvg:      number;       // avg % across all marks in this subject+grade
  passRate:      number;       // % of students with avg >= 50
  atRiskCount:   number;       // students with avg < 50
  highestMark:   number;
  lowestMark:    number;
  recentChange:  number | null; // avg of last-30-days marks vs prior-30-days
}

export interface AtRiskStudent {
  studentId:    number;
  name:         string;
  surname:      string;
  grade:        number;
  subject:      string;
  avg:          number;
  reason:       'below_pass' | 'declining' | 'missed_homework';
  detail:       string;
}

export interface TeacherInterventionBreakdown {
  status:   string;
  count:    number;
}

export interface SubjectOutcomeRow {
  subject:      string;
  type:         InterventionType;
  total:        number;
  successful:   number;
  successRate:  number;
  avgGain:      number;
}

// ── 1. Impact summary for a teacher ───────────────────────────────────────────

export async function fetchTeacherImpactSummary(
  teacherId: number,
): Promise<TeacherImpactSummary> {

  const [{ data: invRows }, { data: outcomeRows }] = await Promise.all([
    supabaseAdmin
      .from('interventions')
      .select('status')
      .eq('teacher_id', teacherId),
    supabaseAdmin
      .from('outcomes')
      .select('result, improvement, type')
      .eq('teacher_id', teacherId),
  ]);

  const invs     = invRows     ?? [];
  const outcomes = outcomeRows ?? [];

  const active    = invs.filter((i: any) => i.status === 'recommended' || i.status === 'started').length;
  const completed = invs.filter((i: any) => i.status === 'completed').length;
  const successful = outcomes.filter((o: any) => o.result === 'improved').length;
  const successRate = completed > 0 ? Math.round((successful / completed) * 100) : 0;

  const improvements = outcomes.map((o: any) => Number(o.improvement));
  const avgImprovement = improvements.length
    ? Math.round(improvements.reduce((s: number, v: number) => s + v, 0) / improvements.length * 10) / 10
    : 0;

  // Best intervention type by success rate
  const TYPES: InterventionType[] = ['past_paper', 'library_topic', 'revision', 'resource_review'];
  let bestType: InterventionType | null = null;
  let bestTypeSuccessRate = 0;
  for (const type of TYPES) {
    const typeOutcomes = outcomes.filter((o: any) => o.type === type);
    if (typeOutcomes.length === 0) continue;
    const rate = Math.round(
      (typeOutcomes.filter((o: any) => o.result === 'improved').length / typeOutcomes.length) * 100
    );
    if (rate > bestTypeSuccessRate) { bestTypeSuccessRate = rate; bestType = type; }
  }

  return { activeInterventions: active, completedInterventions: completed, successfulOutcomes: successful, successRate, avgImprovement, bestType, bestTypeSuccessRate };
}

// ── 2. Class health per subject+grade ─────────────────────────────────────────

export async function fetchTeacherClassHealth(
  teacherId: number,
  schoolId:  number,
): Promise<TeacherSubjectHealth[]> {

  // Get all mark sheets this teacher owns
  const { data: sheets } = await supabaseAdmin
    .from('mark_sheets')
    .select('id, subject_id, grade, title')
    .eq('teacher_id', teacherId)
    .eq('school_id', schoolId);

  if (!sheets || sheets.length === 0) return [];

  const sheetIds    = sheets.map((s: any) => s.id as number);
  const subjectIds  = [...new Set(sheets.map((s: any) => s.subject_id as number))];

  // Fetch subject labels
  const { data: subjectsData } = await supabaseAdmin
    .from('subjects').select('id, label').in('id', subjectIds);
  const subjectMap = new Map((subjectsData ?? []).map((s: any) => [s.id, s.label as string]));

  // Fetch all marks for these sheets
  const { data: marks } = await supabaseAdmin
    .from('student_marks')
    .select('student_id, sheet_id, mark, mark_sheets(total, subject_id, grade, created_at)')
    .in('sheet_id', sheetIds)
    .not('mark', 'is', null);

  if (!marks || marks.length === 0) return [];

  const now = new Date();
  const thirtyDaysAgo = new Date(now); thirtyDaysAgo.setDate(now.getDate() - 30);
  const sixtyDaysAgo  = new Date(now); sixtyDaysAgo.setDate(now.getDate() - 60);

  // Group by subject_id + grade
  type GroupKey = string;
  const groups = new Map<GroupKey, { subjectId: number; grade: number; rows: any[] }>();

  for (const m of marks) {
    const ms = (m as any).mark_sheets;
    if (!ms) continue;
    const key: GroupKey = `${ms.subject_id}-${ms.grade}`;
    if (!groups.has(key)) groups.set(key, { subjectId: ms.subject_id, grade: ms.grade, rows: [] });
    groups.get(key)!.rows.push({ ...m, total: ms.total, createdAt: ms.created_at });
  }

  const result: TeacherSubjectHealth[] = [];

  for (const [, group] of groups) {
    const rows = group.rows;
    const studentIds = [...new Set(rows.map((r: any) => r.student_id as number))];

    // Per-student averages
    const studentAvgs = studentIds.map(sid => {
      const studentRows = rows.filter((r: any) => r.student_id === sid);
      const pcts = studentRows.map((r: any) => (Number(r.mark) / Number(r.total)) * 100);
      return pcts.reduce((s, p) => s + p, 0) / pcts.length;
    });

    const classAvg  = Math.round(studentAvgs.reduce((s, a) => s + a, 0) / studentAvgs.length);
    const passRate  = Math.round((studentAvgs.filter(a => a >= 50).length / studentAvgs.length) * 100);
    const atRisk    = studentAvgs.filter(a => a < 50).length;
    const allPcts   = rows.map((r: any) => (Number(r.mark) / Number(r.total)) * 100);
    const highest   = Math.round(Math.max(...allPcts));
    const lowest    = Math.round(Math.min(...allPcts));

    // Recent change: last-30-days avg vs prior-30-days avg
    const recentRows = rows.filter((r: any) => new Date(r.createdAt) >= thirtyDaysAgo);
    const priorRows  = rows.filter((r: any) => new Date(r.createdAt) >= sixtyDaysAgo && new Date(r.createdAt) < thirtyDaysAgo);
    let recentChange: number | null = null;
    if (recentRows.length > 0 && priorRows.length > 0) {
      const recentAvg = recentRows.reduce((s: number, r: any) => s + (Number(r.mark) / Number(r.total)) * 100, 0) / recentRows.length;
      const priorAvg  = priorRows.reduce((s: number, r: any) => s + (Number(r.mark) / Number(r.total)) * 100, 0) / priorRows.length;
      recentChange = Math.round((recentAvg - priorAvg) * 10) / 10;
    }

    result.push({
      subject:      subjectMap.get(group.subjectId) ?? 'Unknown',
      subjectId:    group.subjectId,
      grade:        group.grade,
      studentCount: studentIds.length,
      classAvg,
      passRate,
      atRiskCount:  atRisk,
      highestMark:  highest,
      lowestMark:   lowest,
      recentChange,
    });
  }

  return result.sort((a, b) => a.grade !== b.grade ? a.grade - b.grade : a.subject.localeCompare(b.subject));
}

// ── 3. Students requiring attention ──────────────────────────────────────────

export async function fetchAtRiskStudents(
  teacherId: number,
  schoolId:  number,
): Promise<AtRiskStudent[]> {

  // Get teacher's students + their subjects
  const { data: links } = await supabaseAdmin
    .from('teacher_students')
    .select('student_id, subject_id, students(id, name, surname, grade), subjects(label)')
    .eq('teacher_id', teacherId);

  if (!links || links.length === 0) return [];

  const studentIds = [...new Set(links.map((l: any) => l.student_id as number))];

  // Get all marks for teacher's sheets
  const { data: sheets } = await supabaseAdmin
    .from('mark_sheets')
    .select('id, subject_id, grade')
    .eq('teacher_id', teacherId)
    .eq('school_id', schoolId);

  const sheetIds = (sheets ?? []).map((s: any) => s.id as number);
  const sheetSubjectMap = new Map((sheets ?? []).map((s: any) => [s.id, s.subject_id as number]));

  const { data: marks } = sheetIds.length > 0
    ? await supabaseAdmin.from('student_marks').select('student_id, sheet_id, mark, mark_sheets(total, subject_id, created_at)')
        .in('sheet_id', sheetIds).not('mark', 'is', null)
    : { data: [] };

  // Get missed homework counts (not_done or no completion record)
  const { data: homeworkEvents } = await supabaseAdmin
    .from('school_events')
    .select('id')
    .eq('school_id', schoolId)
    .eq('event_type', 'homework');

  const homeworkIds = (homeworkEvents ?? []).map((e: any) => e.id as number);
  const { data: notDone } = homeworkIds.length > 0
    ? await supabaseAdmin.from('homework_completions').select('student_id, event_id')
        .in('event_id', homeworkIds).in('student_id', studentIds).eq('verification_status', 'not_done')
    : { data: [] };

  // Build per-student per-subject averages
  type SubAvg = { subject: string; avg: number; subjectId: number };
  const studentSubjectAvgs = new Map<number, SubAvg[]>();

  for (const m of (marks ?? [])) {
    const ms = (m as any).mark_sheets;
    if (!ms) continue;
    const sid = m.student_id as number;
    const pct = (Number((m as any).mark) / Number(ms.total)) * 100;
    if (!studentSubjectAvgs.has(sid)) studentSubjectAvgs.set(sid, []);

    const link = links.find((l: any) => l.student_id === sid && l.subject_id === ms.subject_id);
    const subjectLabel = (link as any)?.subjects?.label ?? 'Unknown';

    const existing = studentSubjectAvgs.get(sid)!.find(s => s.subjectId === ms.subject_id);
    if (existing) {
      existing.avg = (existing.avg + pct) / 2; // running avg (simplified)
    } else {
      studentSubjectAvgs.get(sid)!.push({ subject: subjectLabel, subjectId: ms.subject_id, avg: pct });
    }
  }

  const missedByStudent = new Map<number, number>();
  for (const nd of (notDone ?? [])) {
    const sid = (nd as any).student_id as number;
    missedByStudent.set(sid, (missedByStudent.get(sid) ?? 0) + 1);
  }

  const atRisk: AtRiskStudent[] = [];

  for (const link of links) {
    const student = (link as any).students;
    if (!student) continue;
    const sid = link.student_id as number;

    const subjectAvgs = studentSubjectAvgs.get(sid) ?? [];

    // Below pass
    for (const sa of subjectAvgs) {
      if (sa.avg < 50) {
        atRisk.push({
          studentId: sid,
          name:      student.name,
          surname:   student.surname,
          grade:     student.grade,
          subject:   sa.subject,
          avg:       Math.round(sa.avg),
          reason:    'below_pass',
          detail:    `${sa.subject} average ${Math.round(sa.avg)}%`,
        });
      }
    }

    // Missed homework
    const missed = missedByStudent.get(sid) ?? 0;
    if (missed >= 2) {
      atRisk.push({
        studentId: sid,
        name:      student.name,
        surname:   student.surname,
        grade:     student.grade,
        subject:   'General',
        avg:       0,
        reason:    'missed_homework',
        detail:    `${missed} homework task${missed !== 1 ? 's' : ''} not submitted`,
      });
    }
  }

  // Deduplicate by studentId+reason+subject, sort by avg ascending (worst first)
  const seen = new Set<string>();
  return atRisk
    .filter(r => {
      const key = `${r.studentId}_${r.reason}_${r.subject}`;
      if (seen.has(key)) return false;
      seen.add(key); return true;
    })
    .sort((a, b) => a.avg - b.avg)
    .slice(0, 10);
}

// ── 4. Intervention status breakdown ─────────────────────────────────────────

export async function fetchTeacherInterventionBreakdown(
  teacherId: number,
): Promise<TeacherInterventionBreakdown[]> {
  const { data } = await supabaseAdmin
    .from('interventions')
    .select('status')
    .eq('teacher_id', teacherId);

  if (!data) return [];

  const counts: Record<string, number> = {};
  for (const row of data) {
    const s = (row as any).status as string;
    counts[s] = (counts[s] ?? 0) + 1;
  }

  return Object.entries(counts).map(([status, count]) => ({ status, count }));
}

// ── 5. Outcome effectiveness by subject + type ────────────────────────────────

export async function fetchSubjectOutcomeEffectiveness(
  teacherId: number,
): Promise<SubjectOutcomeRow[]> {
  const { data } = await supabaseAdmin
    .from('outcomes')
    .select('subject, type, result, improvement')
    .eq('teacher_id', teacherId);

  if (!data || data.length === 0) return [];

  // Group by subject + type
  const groups = new Map<string, { subject: string; type: InterventionType; rows: any[] }>();
  for (const row of data) {
    const key = `${(row as any).subject}_${(row as any).type}`;
    if (!groups.has(key)) groups.set(key, { subject: (row as any).subject, type: (row as any).type as InterventionType, rows: [] });
    groups.get(key)!.rows.push(row);
  }

  return Array.from(groups.values()).map(({ subject, type, rows }) => {
    const successful = rows.filter((r: any) => r.result === 'improved').length;
    const gains      = rows.map((r: any) => Number(r.improvement));
    return {
      subject,
      type,
      total:       rows.length,
      successful,
      successRate: Math.round((successful / rows.length) * 100),
      avgGain:     gains.length ? Math.round(gains.reduce((s, v) => s + v, 0) / gains.length * 10) / 10 : 0,
    };
  }).sort((a, b) => b.successRate - a.successRate);
}

// ── 6. Assessment analytics for a single sheet ───────────────────────────────

export interface SheetAnalytics {
  classAvg:    number;
  highest:     number;
  lowest:      number;
  passRate:    number;   // % with mark >= 50% of total
  improving:   number;  // students whose mark > their previous sheet avg for this subject
  declining:   number;
  markedCount: number;
  totalCount:  number;
}

export function computeSheetAnalytics(
  marks: { mark: number | null; total: number }[],
): SheetAnalytics {
  const marked = marks.filter(m => m.mark !== null);
  if (marked.length === 0) {
    return { classAvg: 0, highest: 0, lowest: 0, passRate: 0, improving: 0, declining: 0, markedCount: 0, totalCount: marks.length };
  }

  const pcts    = marked.map(m => (m.mark! / m.total) * 100);
  const classAvg = Math.round(pcts.reduce((s, p) => s + p, 0) / pcts.length);
  const highest  = Math.round(Math.max(...pcts));
  const lowest   = Math.round(Math.min(...pcts));
  const passRate = Math.round((pcts.filter(p => p >= 50).length / pcts.length) * 100);

  return {
    classAvg, highest, lowest, passRate,
    improving:   0,  // requires historical comparison — computed in MarksPage
    declining:   0,
    markedCount: marked.length,
    totalCount:  marks.length,
  };
}
