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

// ── 7. Student intervention chips — one query for all students ────────────────
// Returns a map of studentId → chip data. Call once for the whole list.

export interface StudentInterventionChip {
  studentId:    number;
  active:       number;
  completed:    number;
  successful:   number;
  successRate:  number;   // 0 if no completed interventions
  avgGain:      number;   // 0 if no outcomes
}

export async function fetchStudentInterventionChips(
  schoolId: number,
  studentIds: number[],
): Promise<Map<number, StudentInterventionChip>> {
  if (studentIds.length === 0) return new Map();

  const [{ data: invRows }, { data: outcomeRows }] = await Promise.all([
    supabaseAdmin
      .from('interventions')
      .select('student_id, status')
      .eq('school_id', schoolId)
      .in('student_id', studentIds),
    supabaseAdmin
      .from('outcomes')
      .select('student_id, result, improvement')
      .eq('school_id', schoolId)
      .in('student_id', studentIds),
  ]);

  const result = new Map<number, StudentInterventionChip>();

  // Initialise all students
  for (const sid of studentIds) {
    result.set(sid, { studentId: sid, active: 0, completed: 0, successful: 0, successRate: 0, avgGain: 0 });
  }

  // Tally interventions
  for (const row of (invRows ?? [])) {
    const sid = (row as any).student_id as number;
    const chip = result.get(sid);
    if (!chip) continue;
    const status = (row as any).status as string;
    if (status === 'recommended' || status === 'started') chip.active++;
    else if (status === 'completed') chip.completed++;
  }

  // Tally outcomes
  const gainsByStudent = new Map<number, number[]>();
  for (const row of (outcomeRows ?? [])) {
    const sid = (row as any).student_id as number;
    const chip = result.get(sid);
    if (!chip) continue;
    if ((row as any).result === 'improved') chip.successful++;
    if (!gainsByStudent.has(sid)) gainsByStudent.set(sid, []);
    gainsByStudent.get(sid)!.push(Number((row as any).improvement));
  }

  // Compute derived fields
  for (const [sid, chip] of result) {
    chip.successRate = chip.completed > 0
      ? Math.round((chip.successful / chip.completed) * 100)
      : 0;
    const gains = gainsByStudent.get(sid) ?? [];
    chip.avgGain = gains.length > 0
      ? Math.round(gains.reduce((s, v) => s + v, 0) / gains.length * 10) / 10
      : 0;
  }

  // Only return students who have at least one intervention
  for (const [sid, chip] of result) {
    if (chip.active === 0 && chip.completed === 0) result.delete(sid);
  }

  return result;
}

// ── 8. Resource engagement — viewers per resource ────────────────────────────

export interface ResourceEngagement {
  resourceId: number;
  viewers:    number;
}

export async function fetchResourceEngagement(
  resourceIds: number[],
): Promise<Map<number, ResourceEngagement>> {
  if (resourceIds.length === 0) return new Map();

  const { data } = await supabaseAdmin
    .from('resource_downloads')
    .select('resource_id')
    .in('resource_id', resourceIds);

  const counts = new Map<number, number>();
  for (const row of (data ?? [])) {
    const id = (row as any).resource_id as number;
    counts.set(id, (counts.get(id) ?? 0) + 1);
  }

  const result = new Map<number, ResourceEngagement>();
  for (const id of resourceIds) {
    result.set(id, { resourceId: id, viewers: counts.get(id) ?? 0 });
  }
  return result;
}

// ── 9. Announcement engagement — read rate per announcement ──────────────────

export interface AnnouncementEngagement {
  announcementId: number;
  viewed:         number;
  targetSize:     number;
  readRate:       number;   // 0–100
  unread:         number;
}

export async function fetchAnnouncementEngagement(
  schoolId:       number,
  announcementIds: number[],
  // Targeting info for each announcement — needed to compute target audience size
  announcements: {
    id: number;
    target_type: string;
    target_grades: number[] | null;
    target_cohort_ids: number[] | null;
    target_subject_ids: number[] | null;
    target_student_ids: number[] | null;
  }[],
): Promise<Map<number, AnnouncementEngagement>> {
  if (announcementIds.length === 0) return new Map();

  // Fetch view counts
  const { data: viewRows } = await supabaseAdmin
    .from('announcement_views')
    .select('announcement_id')
    .in('announcement_id', announcementIds);

  const viewCounts = new Map<number, number>();
  for (const row of (viewRows ?? [])) {
    const id = (row as any).announcement_id as number;
    viewCounts.set(id, (viewCounts.get(id) ?? 0) + 1);
  }

  // Fetch all students for this school to compute target sizes
  const { data: allStudents } = await supabaseAdmin
    .from('students')
    .select('id, grade, cohort_id')
    .eq('school_id', schoolId);

  const students = allStudents ?? [];
  const totalStudents = students.length;

  const result = new Map<number, AnnouncementEngagement>();

  for (const ann of announcements) {
    let targetSize = totalStudents;

    if (ann.target_type === 'grade' && ann.target_grades?.length) {
      targetSize = students.filter((s: any) => ann.target_grades!.includes(s.grade)).length;
    } else if (ann.target_type === 'class' && ann.target_cohort_ids?.length) {
      targetSize = students.filter((s: any) => ann.target_cohort_ids!.includes(s.cohort_id)).length;
    } else if (ann.target_type === 'specific' && ann.target_student_ids?.length) {
      targetSize = ann.target_student_ids.length;
    } else if (ann.target_type === 'subject' && ann.target_grades?.length) {
      targetSize = students.filter((s: any) => ann.target_grades!.includes(s.grade)).length;
    }

    const viewed = viewCounts.get(ann.id) ?? 0;
    const readRate = targetSize > 0 ? Math.round((viewed / targetSize) * 100) : 0;

    result.set(ann.id, {
      announcementId: ann.id,
      viewed,
      targetSize,
      readRate,
      unread: Math.max(0, targetSize - viewed),
    });
  }

  return result;
}

// ── 10. Intervention ROI by type ─────────────────────────────────────────────
// Aggregates outcomes by intervention type for a teacher.
// Sorted by avg gain descending.

export interface InterventionROIRow {
  type:        string;
  label:       string;
  total:       number;
  successful:  number;
  successRate: number;
  avgGain:     number;
}

const INTERVENTION_TYPE_LABELS: Record<string, string> = {
  past_paper:      'Past Paper Practice',
  library_topic:   'Library Study',
  revision:        'Revision Session',
  resource_review: 'Resource Review',
};

export async function fetchTeacherInterventionROI(
  teacherId: number,
): Promise<InterventionROIRow[]> {
  const { data } = await supabaseAdmin
    .from('outcomes')
    .select('type, result, improvement')
    .eq('teacher_id', teacherId);

  if (!data || data.length === 0) return [];

  const groups = new Map<string, { results: string[]; gains: number[] }>();

  for (const row of data) {
    const type = (row as any).type as string;
    if (!groups.has(type)) groups.set(type, { results: [], gains: [] });
    const g = groups.get(type)!;
    g.results.push((row as any).result as string);
    g.gains.push(Number((row as any).improvement));
  }

  return Array.from(groups.entries())
    .map(([type, { results, gains }]) => {
      const successful = results.filter(r => r === 'improved').length;
      const avgGain    = gains.length
        ? Math.round(gains.reduce((s, v) => s + v, 0) / gains.length * 10) / 10
        : 0;
      return {
        type,
        label:       INTERVENTION_TYPE_LABELS[type] ?? type,
        total:       results.length,
        successful,
        successRate: Math.round((successful / results.length) * 100),
        avgGain,
      };
    })
    .sort((a, b) => b.avgGain - a.avgGain);
}

// ── 11. Resource effectiveness ────────────────────────────────────────────────
// For each resource: students who downloaded, avg mark change after download.
// Requires >= 3 data points for a meaningful correlation (returns null otherwise).

export interface ResourceEffectiveness {
  resourceId:     number;
  downloaders:    number;
  avgImprovement: number | null;
}

export async function fetchResourceEffectiveness(
  schoolId:    number,
  resourceIds: number[],
): Promise<Map<number, ResourceEffectiveness>> {
  if (resourceIds.length === 0) return new Map();

  const { data: downloads } = await supabaseAdmin
    .from('resource_downloads')
    .select('resource_id, student_id, downloaded_at')
    .in('resource_id', resourceIds);

  if (!downloads || downloads.length === 0) {
    return new Map(resourceIds.map(id => [id, { resourceId: id, downloaders: 0, avgImprovement: null }]));
  }

  const studentIds = [...new Set(downloads.map((d: any) => d.student_id as number))];

  const { data: marks } = await supabaseAdmin
    .from('student_marks')
    .select('student_id, mark, mark_sheets(total, created_at)')
    .in('student_id', studentIds)
    .eq('school_id', schoolId)
    .not('mark', 'is', null);

  const marksByStudent = new Map<number, { pct: number; date: string }[]>();
  for (const m of (marks ?? [])) {
    const ms = (m as any).mark_sheets;
    if (!ms) continue;
    const sid = (m as any).student_id as number;
    if (!marksByStudent.has(sid)) marksByStudent.set(sid, []);
    marksByStudent.get(sid)!.push({
      pct:  (Number((m as any).mark) / Number(ms.total)) * 100,
      date: ms.created_at as string,
    });
  }

  const result = new Map<number, ResourceEffectiveness>();

  for (const resourceId of resourceIds) {
    const resourceDownloads = (downloads as any[]).filter(d => d.resource_id === resourceId);
    const downloaders = resourceDownloads.length;

    if (downloaders === 0) {
      result.set(resourceId, { resourceId, downloaders: 0, avgImprovement: null });
      continue;
    }

    const improvements: number[] = [];

    for (const dl of resourceDownloads) {
      const sid          = dl.student_id as number;
      const dlDate       = dl.downloaded_at as string;
      const studentMarks = marksByStudent.get(sid) ?? [];

      const before = studentMarks.filter(m => m.date < dlDate);
      const after  = studentMarks.filter(m => m.date >= dlDate);

      if (before.length === 0 || after.length === 0) continue;

      const beforeAvg = before.reduce((s, m) => s + m.pct, 0) / before.length;
      const afterAvg  = after.reduce((s, m) => s + m.pct, 0) / after.length;
      improvements.push(afterAvg - beforeAvg);
    }

    result.set(resourceId, {
      resourceId,
      downloaders,
      avgImprovement: improvements.length >= 3
        ? Math.round(improvements.reduce((s, v) => s + v, 0) / improvements.length * 10) / 10
        : null,
    });
  }

  return result;
}

// ── 12. Announcement impact on homework completion ────────────────────────────
// Compares homework completion rate of students who viewed an announcement
// vs those who did not — for the next homework event after the announcement.

export interface AnnouncementImpact {
  announcementId:          number;
  viewedCount:             number;
  notViewedCount:          number;
  viewedAndCompleted:      number;
  notViewedCompleted:      number;
  completionRateViewed:    number;
  completionRateNotViewed: number;
  delta:                   number;   // viewed rate - not-viewed rate
}

export async function fetchAnnouncementImpact(
  schoolId:          number,
  announcementIds:   number[],
  announcementDates: Record<number, string>,   // id → created_at ISO string
): Promise<Map<number, AnnouncementImpact>> {
  if (announcementIds.length === 0) return new Map();

  const [{ data: views }, { data: allStudents }, { data: hwEvents }, { data: completions }] =
    await Promise.all([
      supabaseAdmin.from('announcement_views').select('announcement_id, student_id').in('announcement_id', announcementIds),
      supabaseAdmin.from('students').select('id').eq('school_id', schoolId),
      supabaseAdmin.from('school_events').select('id, event_date').eq('school_id', schoolId).eq('event_type', 'homework').order('event_date'),
      supabaseAdmin.from('homework_completions').select('student_id, event_id').eq('school_id', schoolId),
    ]);

  const allStudentIds  = (allStudents ?? []).map((s: any) => s.id as number);
  const completionSet  = new Set((completions ?? []).map((c: any) => `${c.student_id}_${c.event_id}`));

  const result = new Map<number, AnnouncementImpact>();

  for (const annId of announcementIds) {
    const annDate = announcementDates[annId];
    if (!annDate) continue;

    const nextHw = (hwEvents ?? []).find((e: any) => (e.event_date as string) >= annDate.slice(0, 10));
    if (!nextHw) continue;

    const hwId      = (nextHw as any).id as number;
    const viewerIds = new Set((views ?? []).filter((v: any) => v.announcement_id === annId).map((v: any) => v.student_id as number));
    const nonViewerIds = allStudentIds.filter(id => !viewerIds.has(id));

    const viewedCompleted    = [...viewerIds].filter(id => completionSet.has(`${id}_${hwId}`)).length;
    const notViewedCompleted = nonViewerIds.filter(id => completionSet.has(`${id}_${hwId}`)).length;

    const viewedRate    = viewerIds.size > 0 ? Math.round((viewedCompleted / viewerIds.size) * 100) : 0;
    const notViewedRate = nonViewerIds.length > 0 ? Math.round((notViewedCompleted / nonViewerIds.length) * 100) : 0;

    result.set(annId, {
      announcementId:          annId,
      viewedCount:             viewerIds.size,
      notViewedCount:          nonViewerIds.length,
      viewedAndCompleted:      viewedCompleted,
      notViewedCompleted,
      completionRateViewed:    viewedRate,
      completionRateNotViewed: notViewedRate,
      delta:                   viewedRate - notViewedRate,
    });
  }

  return result;
}

// ── 13. Evidence-based intervention type selection ────────────────────────────
// Eligible types are passed in by the caller (rule-based gatekeeping).
// Returns the type with the best confidence-weighted score from historical outcomes.
// Score = avgGain * min(n/10, 1) -- dampens small samples: n=3->30%, n>=10->100%.
// Returns null when no historical data exists -- caller falls back to rule-based default.
// Scoped to school_id to prevent cross-school data bleed.

export interface BestInterventionResult {
  type:      InterventionType;
  rationale: string;   // human-readable explanation for why this type was chosen
}

const INTERVENTION_TYPE_LABEL: Record<string, string> = {
  past_paper:      'Past Paper Practice',
  library_topic:   'Library Study',
  revision:        'Revision Session',
  resource_review: 'Resource Review',
};

export async function fetchBestInterventionType(
  schoolId:      number,
  subject:       string,
  eligibleTypes: InterventionType[],
): Promise<BestInterventionResult | null> {
  if (eligibleTypes.length === 0) return null;

  const { data } = await supabaseAdmin
    .from('outcomes')
    .select('type, improvement')
    .eq('school_id', schoolId)
    .in('type', eligibleTypes)
    .ilike('subject', subject.split(' ')[0] + '%');

  if (!data || data.length === 0) return null;

  const groups = new Map<string, number[]>();
  for (const row of data) {
    const t = (row as any).type as string;
    if (!groups.has(t)) groups.set(t, []);
    groups.get(t)!.push(Number((row as any).improvement));
  }

  let bestType:   InterventionType | null = null;
  let bestScore   = -Infinity;
  let bestN       = 0;
  let bestAvgGain = 0;

  for (const type of eligibleTypes) {
    const gains = groups.get(type);
    if (!gains || gains.length === 0) continue;
    const n          = gains.length;
    const avgGain    = gains.reduce((s, v) => s + v, 0) / n;
    const confidence = Math.min(n / 10, 1);
    const score      = avgGain * confidence;
    if (score > bestScore) {
      bestScore   = score;
      bestType    = type as InterventionType;
      bestN       = n;
      bestAvgGain = Math.round(avgGain * 10) / 10;
    }
  }

  if (!bestType) return null;

  const label     = INTERVENTION_TYPE_LABEL[bestType] ?? bestType;
  const gainStr   = bestAvgGain > 0 ? `+${bestAvgGain}%` : `${bestAvgGain}%`;
  const rationale = `Recommended based on school outcomes: ${label} has produced an average ${gainStr} improvement in ${subject} (n=${bestN})`;

  return { type: bestType, rationale };
}

// ── 14. Stale intervention queue ─────────────────────────────────────────────
// Returns active interventions that are stale (started > 7 days ago, no outcome)
// or completed but awaiting outcome recording.

export interface StaleIntervention {
  interventionId: string;
  studentId:      number;
  studentName:    string;
  studentSurname: string;
  subject:        string;
  type:           string;
  typeLabel:      string;
  status:         string;
  startedAt:      string | null;
  completedAt:    string | null;
  staleDays:      number;
  reason:         'stale_active' | 'awaiting_outcome';
}

const INTERVENTION_TYPE_LABELS_MAP: Record<string, string> = {
  past_paper:      'Past Paper',
  library_topic:   'Library Study',
  revision:        'Revision',
  resource_review: 'Resource Review',
};

export async function fetchStaleInterventions(
  teacherId: number,
  schoolId:  number,
): Promise<StaleIntervention[]> {
  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(now.getDate() - 7);

  // Get active/completed interventions for this teacher
  const { data: invRows } = await supabaseAdmin
    .from('interventions')
    .select('id, student_id, subject, type, status, started_at, completed_at, created_at')
    .eq('teacher_id', teacherId)
    .eq('school_id', schoolId)
    .in('status', ['started', 'completed'])
    .order('created_at', { ascending: false })
    .limit(100);

  if (!invRows || invRows.length === 0) return [];

  // Get existing outcomes so we can exclude completed-with-outcome
  const completedIds = invRows
    .filter((r: any) => r.status === 'completed')
    .map((r: any) => r.id as string);

  const outcomeMap = new Set<string>();
  if (completedIds.length > 0) {
    const { data: outRows } = await supabaseAdmin
      .from('outcomes')
      .select('intervention_id')
      .in('intervention_id', completedIds);
    for (const o of (outRows ?? [])) outcomeMap.add((o as any).intervention_id as string);
  }

  // Get student names
  const studentIds = [...new Set(invRows.map((r: any) => r.student_id as number))];
  const { data: studentRows } = await supabaseAdmin
    .from('students')
    .select('id, name, surname')
    .in('id', studentIds);
  const studentMap = new Map<number, { name: string; surname: string }>(
    (studentRows ?? []).map((s: any) => [s.id as number, { name: s.name as string, surname: s.surname as string }])
  );

  const stale: StaleIntervention[] = [];

  for (const inv of invRows) {
    const student = studentMap.get((inv as any).student_id as number);
    if (!student) continue;

    const status = (inv as any).status as string;

    if (status === 'started') {
      const startedAt = (inv as any).started_at as string | null;
      if (!startedAt) continue;
      const startedDate = new Date(startedAt);
      if (startedDate <= sevenDaysAgo) {
        const staleDays = Math.floor((now.getTime() - startedDate.getTime()) / 86400000);
        stale.push({
          interventionId: (inv as any).id as string,
          studentId:      (inv as any).student_id as number,
          studentName:    student.name,
          studentSurname: student.surname,
          subject:        (inv as any).subject as string,
          type:           (inv as any).type as string,
          typeLabel:      INTERVENTION_TYPE_LABELS_MAP[(inv as any).type] ?? (inv as any).type,
          status,
          startedAt,
          completedAt:    null,
          staleDays,
          reason:         'stale_active',
        });
      }
    } else if (status === 'completed') {
      // Completed but no outcome yet
      if (!outcomeMap.has((inv as any).id as string)) {
        const completedAt = (inv as any).completed_at as string | null;
        const completedDate = completedAt ? new Date(completedAt) : now;
        const staleDays = Math.floor((now.getTime() - completedDate.getTime()) / 86400000);
        stale.push({
          interventionId: (inv as any).id as string,
          studentId:      (inv as any).student_id as number,
          studentName:    student.name,
          studentSurname: student.surname,
          subject:        (inv as any).subject as string,
          type:           (inv as any).type as string,
          typeLabel:      INTERVENTION_TYPE_LABELS_MAP[(inv as any).type] ?? (inv as any).type,
          status,
          startedAt:      (inv as any).started_at ?? null,
          completedAt:    completedAt,
          staleDays,
          reason:         'awaiting_outcome',
        });
      }
    }
  }

  return stale
    .sort((a, b) => b.staleDays - a.staleDays)
    .slice(0, 10);
}

// ── 15. Assessment gap detector ──────────────────────────────────────────────
// Finds subject+grade groups where the last mark sheet was created > 30 days ago.

export interface AssessmentGap {
  subject:        string;
  subjectId:      number;
  grade:          number;
  daysSinceLast:  number;
  lastSheetDate:  string;
  sheetCount:     number;
}

export async function fetchAssessmentGaps(
  teacherId: number,
  schoolId:  number,
  thresholdDays = 30,
): Promise<AssessmentGap[]> {
  const { data: sheets } = await supabaseAdmin
    .from('mark_sheets')
    .select('id, subject_id, grade, created_at')
    .eq('teacher_id', teacherId)
    .eq('school_id', schoolId);

  if (!sheets || sheets.length === 0) return [];

  const subjectIds = [...new Set(sheets.map((s: any) => s.subject_id as number))];
  const { data: subjectsData } = await supabaseAdmin
    .from('subjects').select('id, label').in('id', subjectIds);
  const subjectMap = new Map((subjectsData ?? []).map((s: any) => [s.id as number, s.label as string]));

  // Group by subject_id + grade, find max created_at per group
  const groups = new Map<string, { subjectId: number; grade: number; dates: string[] }>();
  for (const s of sheets) {
    const key = `${(s as any).subject_id}-${(s as any).grade}`;
    if (!groups.has(key)) {
      groups.set(key, { subjectId: (s as any).subject_id as number, grade: (s as any).grade as number, dates: [] });
    }
    groups.get(key)!.dates.push((s as any).created_at as string);
  }

  const now = new Date();
  const gaps: AssessmentGap[] = [];

  for (const [, group] of groups) {
    const sorted     = [...group.dates].sort();
    const lastDate   = sorted[sorted.length - 1];
    const lastMs     = new Date(lastDate).getTime();
    const daysSince  = Math.floor((now.getTime() - lastMs) / 86400000);

    if (daysSince > thresholdDays) {
      gaps.push({
        subject:       subjectMap.get(group.subjectId) ?? 'Unknown',
        subjectId:     group.subjectId,
        grade:         group.grade,
        daysSinceLast: daysSince,
        lastSheetDate: lastDate.split('T')[0],
        sheetCount:    group.dates.length,
      });
    }
  }

  return gaps.sort((a, b) => b.daysSinceLast - a.daysSinceLast);
}

// ── 16. Class performance by learner status ───────────────────────────────────
// For each student in teacher's classes, compute a learner status tier
// based on their average mark across all subjects.
// Returns students grouped into risk tiers for smart class grouping.

export type LearnerTier = 'high_risk' | 'medium_risk' | 'on_track' | 'flourishing';

export interface StudentTierSummary {
  studentId:    number;
  name:         string;
  surname:      string;
  grade:        number;
  cohort:       string | null;
  avg:          number;   // overall average %
  tier:         LearnerTier;
  subjectCount: number;
}

export function computeLearnerTier(avg: number): LearnerTier {
  if (avg < 40) return 'high_risk';
  if (avg < 55) return 'medium_risk';
  if (avg < 75) return 'on_track';
  return 'flourishing';
}

export async function fetchStudentTiers(
  teacherId: number,
  schoolId:  number,
): Promise<StudentTierSummary[]> {
  // Get teacher's students
  const { data: links } = await supabaseAdmin
    .from('teacher_students')
    .select('student_id, subject_id, students(id, name, surname, grade, cohort_id)')
    .eq('teacher_id', teacherId);

  if (!links || links.length === 0) return [];

  const studentIds = [...new Set(links.map((l: any) => l.student_id as number))];

  // Get all marks for teacher's sheets
  const { data: sheets } = await supabaseAdmin
    .from('mark_sheets')
    .select('id, subject_id')
    .eq('teacher_id', teacherId)
    .eq('school_id', schoolId);

  const sheetIds = (sheets ?? []).map((s: any) => s.id as number);

  const { data: marks } = sheetIds.length > 0
    ? await supabaseAdmin
        .from('student_marks')
        .select('student_id, mark, mark_sheets(total)')
        .in('sheet_id', sheetIds)
        .in('student_id', studentIds)
        .not('mark', 'is', null)
    : { data: [] };

  // Build per-student average
  const marksByStudent = new Map<number, number[]>();
  for (const m of (marks ?? [])) {
    const ms = (m as any).mark_sheets;
    if (!ms) continue;
    const sid = (m as any).student_id as number;
    const pct = (Number((m as any).mark) / Number(ms.total)) * 100;
    if (!marksByStudent.has(sid)) marksByStudent.set(sid, []);
    marksByStudent.get(sid)!.push(pct);
  }

  // Unique students
  const seen = new Set<number>();
  const result: StudentTierSummary[] = [];

  for (const link of links) {
    const student = (link as any).students;
    if (!student) continue;
    const sid = link.student_id as number;
    if (seen.has(sid)) continue;
    seen.add(sid);

    const pcts = marksByStudent.get(sid) ?? [];
    const avg  = pcts.length > 0
      ? Math.round(pcts.reduce((s, v) => s + v, 0) / pcts.length)
      : 0;

    const subjectCount = links.filter((l: any) => l.student_id === sid).length;

    result.push({
      studentId:    sid,
      name:         student.name as string,
      surname:      student.surname as string,
      grade:        student.grade as number,
      cohort:       null,   // cohort_id not carried in this join — omit for now
      avg,
      tier:         computeLearnerTier(avg),
      subjectCount,
    });
  }

  return result.sort((a, b) => a.avg - b.avg);
}
