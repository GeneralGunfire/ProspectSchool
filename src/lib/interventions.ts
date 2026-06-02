// ── Intervention & Outcome Tracking System ───────────────────────────────────
// Tracks the full loop: Risk detected → Recommendation → Action → Outcome
// Stored in Supabase — visible to teachers and queryable school-wide.

import { supabaseAdmin } from './supabase';

// ── Types ─────────────────────────────────────────────────────────────────────

export type InterventionType   = 'revision' | 'past_paper' | 'library_topic' | 'resource_review';
export type InterventionReason = 'high_risk' | 'declining_trend' | 'exam_soon' | 'aps_gap' | 'below_pass';
export type InterventionStatus = 'recommended' | 'started' | 'completed' | 'expired';
export type OutcomeResult      = 'improved' | 'unchanged' | 'declined';

export interface Intervention {
  id:            string;
  studentId:     number;
  teacherId?:    number;       // teacher who teaches this subject to the student
  subjectId?:    number;       // FK to subjects — enables exact joins
  subject:       string;
  type:          InterventionType;
  reason:        InterventionReason;
  description:   string;
  page:          string;
  createdAt:     string;
  startedAt?:    string;
  completedAt?:  string;
  expiresAt:     string;
  status:        InterventionStatus;
  previousAvg:   number;
}

export interface Outcome {
  interventionId: string;
  subject:        string;
  type:           InterventionType;
  previousAvg:    number;
  newAvg:         number;
  improvement:    number;
  latestMark:     number;
  result:         OutcomeResult;
  recordedAt:     string;
}

export interface InterventionImpact {
  totalCompleted:    number;
  successful:        number;
  partialSuccess:    number;
  avgImprovement:    number;
  successRate:       number;
  bestType:          InterventionType | null;
  bestTypeGain:      number;
  typeEffectiveness: { type: InterventionType; successRate: number; avgGain: number; count: number }[];
}

export interface GrowthTimelineEvent {
  date:      string;
  type:      'goal_set' | 'intervention_started' | 'intervention_completed' | 'outcome_recorded' | 'mark_recorded';
  label:     string;
  detail:    string;
  delta?:    number;
  positive?: boolean;
}

// ── Row → domain mappers ──────────────────────────────────────────────────────

function rowToIntervention(r: any): Intervention {
  return {
    id:           r.id,
    studentId:    r.student_id,
    teacherId:    r.teacher_id   ?? undefined,
    subjectId:    r.subject_id   ?? undefined,
    subject:      r.subject,
    type:         r.type         as InterventionType,
    reason:       r.reason       as InterventionReason,
    description:  r.description,
    page:         r.page,
    createdAt:    r.created_at,
    startedAt:    r.started_at   ?? undefined,
    completedAt:  r.completed_at ?? undefined,
    expiresAt:    r.expires_at,
    status:       r.status       as InterventionStatus,
    previousAvg:  Number(r.previous_avg),
  };
}

function rowToOutcome(r: any): Outcome {
  return {
    interventionId: r.intervention_id,
    subject:        r.subject,
    type:           r.type         as InterventionType,
    previousAvg:    Number(r.previous_avg),
    newAvg:         Number(r.new_avg),
    improvement:    Number(r.improvement),
    latestMark:     Number(r.latest_mark),
    result:         r.result       as OutcomeResult,
    recordedAt:     r.recorded_at,
  };
}

// ── Read helpers ──────────────────────────────────────────────────────────────

export async function getInterventions(studentId: number): Promise<Intervention[]> {
  const now = new Date().toISOString();

  // Auto-expire overdue rows first (fire-and-forget, don't await error)
  supabaseAdmin
    .from('interventions')
    .update({ status: 'expired' })
    .eq('student_id', studentId)
    .in('status', ['recommended', 'started'])
    .lt('expires_at', now)
    .then(() => {});

  const { data, error } = await supabaseAdmin
    .from('interventions')
    .select('*')
    .eq('student_id', studentId)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error || !data) return [];
  return data.map(rowToIntervention);
}

export async function getOutcomes(studentId: number): Promise<Outcome[]> {
  const { data, error } = await supabaseAdmin
    .from('outcomes')
    .select('*')
    .eq('student_id', studentId)
    .order('recorded_at', { ascending: false })
    .limit(100);

  if (error || !data) return [];
  return data.map(rowToOutcome);
}

export async function getActiveInterventions(studentId: number): Promise<Intervention[]> {
  const { data, error } = await supabaseAdmin
    .from('interventions')
    .select('*')
    .eq('student_id', studentId)
    .in('status', ['recommended', 'started'])
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return data.map(rowToIntervention);
}

export async function getCompletedInterventions(studentId: number): Promise<Intervention[]> {
  const { data, error } = await supabaseAdmin
    .from('interventions')
    .select('*')
    .eq('student_id', studentId)
    .eq('status', 'completed')
    .order('completed_at', { ascending: false });

  if (error || !data) return [];
  return data.map(rowToIntervention);
}

// ── Create intervention ───────────────────────────────────────────────────────

export async function createIntervention(
  studentId:   number,
  schoolId:    number,
  subject:     string,
  subjectId:   number,             // exact FK — no fuzzy matching
  type:        InterventionType,
  reason:      InterventionReason,
  description: string,
  page:        string,
  previousAvg: number,
): Promise<Intervention> {
  // Deduplicate: check for active intervention for same student+subject+type
  // Use subject_id for exact match when available, fall back to label
  const dupQuery = subjectId
    ? supabaseAdmin.from('interventions').select('*')
        .eq('student_id', studentId).eq('subject_id', subjectId).eq('type', type)
        .in('status', ['recommended', 'started']).limit(1).single()
    : supabaseAdmin.from('interventions').select('*')
        .eq('student_id', studentId).eq('subject', subject).eq('type', type)
        .in('status', ['recommended', 'started']).limit(1).single();

  const { data: existing } = await dupQuery;
  if (existing) return rowToIntervention(existing);

  const now     = new Date();
  const expires = new Date(now);
  expires.setDate(expires.getDate() + 30);

  const id = `${studentId}_${subjectId || subject}_${type}_${Date.now()}`;

  // Look up teacher via exact subject_id match on teacher_students
  let teacherId: number | undefined;
  if (subjectId) {
    const { data: link } = await supabaseAdmin
      .from('teacher_students')
      .select('teacher_id')
      .eq('student_id', studentId)
      .eq('subject_id', subjectId)
      .limit(1)
      .single();
    teacherId = (link as any)?.teacher_id ?? undefined;
  }

  const { data, error } = await supabaseAdmin
    .from('interventions')
    .insert({
      id,
      student_id:   studentId,
      school_id:    schoolId,
      teacher_id:   teacherId ?? null,
      subject_id:   subjectId || null,
      subject,
      type,
      reason,
      description,
      page,
      status:       'recommended',
      previous_avg: previousAvg,
      expires_at:   expires.toISOString(),
    })
    .select('*')
    .single();

  if (error || !data) {
    return {
      id, studentId, teacherId, subjectId, subject, type, reason, description, page,
      createdAt:  now.toISOString(),
      expiresAt:  expires.toISOString(),
      status:     'recommended',
      previousAvg,
    };
  }

  return rowToIntervention(data);
}

// ── Update intervention status ────────────────────────────────────────────────

export async function startIntervention(studentId: number, interventionId: string): Promise<void> {
  await supabaseAdmin
    .from('interventions')
    .update({ status: 'started', started_at: new Date().toISOString() })
    .eq('id', interventionId)
    .eq('student_id', studentId)
    .eq('status', 'recommended');
}

export async function completeIntervention(studentId: number, interventionId: string): Promise<void> {
  await supabaseAdmin
    .from('interventions')
    .update({ status: 'completed', completed_at: new Date().toISOString() })
    .eq('id', interventionId)
    .eq('student_id', studentId)
    .in('status', ['recommended', 'started']);
}

// ── Record outcome ────────────────────────────────────────────────────────────

export async function recordOutcome(
  studentId:      number,
  schoolId:       number,
  interventionId: string,
  subject:        string,
  type:           InterventionType,
  previousAvg:    number,
  newAvg:         number,
  latestMark:     number,
): Promise<Outcome> {
  const improvement = Math.round((newAvg - previousAvg) * 10) / 10;
  const result: OutcomeResult =
    improvement >= 3 || latestMark >= 70 ? 'improved'  :
    improvement > 0                      ? 'unchanged' :
                                           'declined';

  // Fetch teacher_id from the parent intervention so outcomes are directly queryable by teacher
  const { data: inv } = await supabaseAdmin
    .from('interventions')
    .select('teacher_id')
    .eq('id', interventionId)
    .single();
  const teacherId = (inv as any)?.teacher_id ?? null;

  const row = {
    intervention_id: interventionId,
    student_id:      studentId,
    school_id:       schoolId,
    teacher_id:      teacherId,
    subject,
    type,
    previous_avg:    Math.round(previousAvg),
    new_avg:         Math.round(newAvg),
    improvement,
    latest_mark:     Math.round(latestMark),
    result,
  };

  // Upsert — one outcome per intervention (intervention_id is PK)
  await supabaseAdmin
    .from('outcomes')
    .upsert(row, { onConflict: 'intervention_id' });

  return {
    interventionId,
    subject,
    type,
    previousAvg:  Math.round(previousAvg),
    newAvg:       Math.round(newAvg),
    improvement,
    latestMark:   Math.round(latestMark),
    result,
    recordedAt:   new Date().toISOString(),
  };
}

// ── Auto-record outcomes from fresh marks ────────────────────────────────────

import type { StudentResult } from './marks';

export async function syncOutcomesFromMarks(
  studentId: number,
  schoolId:  number,
  allMarks:  StudentResult[],
): Promise<void> {
  const [interventions, outcomes] = await Promise.all([
    getInterventions(studentId),
    getOutcomes(studentId),
  ]);

  const completedWithoutOutcome = interventions.filter(i =>
    i.status === 'completed' &&
    i.completedAt !== undefined &&
    !outcomes.find(o => o.interventionId === i.id)
  );

  for (const inv of completedWithoutOutcome) {
    const subjectMarks = allMarks.filter(m =>
      m.mark !== null &&
      // Prefer exact subject_id match; fall back to label for legacy data
      (inv.subjectId && m.subject_id
        ? m.subject_id === inv.subjectId
        : m.subject_label?.toLowerCase().includes(inv.subject.split(' ')[0].toLowerCase()) ||
          inv.subject.toLowerCase().includes((m.subject_label ?? '').split(' ')[0].toLowerCase()))
    );

    if (subjectMarks.length === 0) continue;

    const newMarks = subjectMarks.filter(m =>
      (m.marked_at ?? m.created_at) > (inv.completedAt ?? inv.createdAt)
    );

    if (newMarks.length === 0) continue;

    const beforeMarks = subjectMarks.filter(m =>
      (m.marked_at ?? m.created_at) <= (inv.completedAt ?? inv.createdAt)
    );
    const beforeAvg = beforeMarks.length > 0
      ? beforeMarks.reduce((s, m) => s + (m.mark! / m.total) * 100, 0) / beforeMarks.length
      : inv.previousAvg;

    const afterAvg = subjectMarks.reduce((s, m) => s + (m.mark! / m.total) * 100, 0) / subjectMarks.length;

    const latest = [...newMarks].sort((a, b) =>
      (b.marked_at ?? b.created_at).localeCompare(a.marked_at ?? a.created_at)
    )[0];
    const latestMark = (latest.mark! / latest.total) * 100;

    await recordOutcome(studentId, schoolId, inv.id, inv.subject, inv.type, beforeAvg, afterAvg, latestMark);
  }
}

// ── Compute impact summary (pure — no I/O) ────────────────────────────────────

export function computeInterventionImpact(completed: Intervention[], outcomes: Outcome[]): InterventionImpact {
  const successful      = outcomes.filter(o => o.result === 'improved');
  const partial         = outcomes.filter(o => o.result === 'unchanged' && o.improvement > 0);
  const allImprovements = outcomes.map(o => o.improvement);
  const avgImprovement  = allImprovements.length
    ? Math.round(allImprovements.reduce((s, v) => s + v, 0) / allImprovements.length * 10) / 10
    : 0;

  const TYPES: InterventionType[] = ['past_paper', 'library_topic', 'revision', 'resource_review'];
  const typeEffectiveness = TYPES.map(type => {
    const typeOutcomes  = outcomes.filter(o => o.type === type);
    const typeSuccessful = typeOutcomes.filter(o => o.result === 'improved');
    const typeGains     = typeOutcomes.map(o => o.improvement);
    return {
      type,
      successRate: typeOutcomes.length > 0
        ? Math.round((typeSuccessful.length / typeOutcomes.length) * 100) : 0,
      avgGain: typeGains.length > 0
        ? Math.round(typeGains.reduce((s, v) => s + v, 0) / typeGains.length * 10) / 10 : 0,
      count: typeOutcomes.length,
    };
  }).filter(t => t.count > 0).sort((a, b) => b.avgGain - a.avgGain);

  const bestType     = typeEffectiveness.length > 0 ? typeEffectiveness[0].type : null;
  const bestTypeGain = typeEffectiveness.length > 0 ? typeEffectiveness[0].avgGain : 0;

  return {
    totalCompleted:  completed.length,
    successful:      successful.length,
    partialSuccess:  partial.length,
    avgImprovement,
    successRate:     completed.length > 0
      ? Math.round((successful.length / completed.length) * 100) : 0,
    bestType,
    bestTypeGain,
    typeEffectiveness,
  };
}

// ── Auto-generate interventions from engine risk ──────────────────────────────

import type { SubjectRisk, RevisionRecommendation } from './studentInsights';
import { fetchBestInterventionType } from './teacherAnalytics';

export async function syncInterventionsFromRisk(
  studentId:        number,
  schoolId:         number,
  examRiskSubjects: SubjectRisk[],
  revisionRecs:     RevisionRecommendation[],
): Promise<Intervention[]> {
  const created: Intervention[] = [];

  for (const risk of examRiskSubjects) {
    if (risk.risk !== 'high' && risk.risk !== 'medium') continue;

    if (risk.examDays !== null && risk.examDays <= 14) {
      // Eligible for exam prep: past_paper or revision — ROI picks the winner
      const bestType = await fetchBestInterventionType(
        schoolId, risk.subject, ['past_paper', 'revision'],
      ) ?? 'past_paper';  // default if no history

      const DESCRIPTION: Record<string, string> = {
        past_paper: `Complete a ${risk.subject} past paper`,
        revision:   `Revise ${risk.subject} before the exam`,
      };
      const PAGE: Record<string, string> = { past_paper: 'pastpapers', revision: 'library' };

      const i = await createIntervention(
        studentId, schoolId, risk.subject, risk.subjectId, bestType as InterventionType,
        risk.examDays <= 7 ? 'exam_soon' : 'high_risk',
        DESCRIPTION[bestType] ?? DESCRIPTION.past_paper,
        PAGE[bestType] ?? 'pastpapers',
        risk.avg,
      );
      created.push(i);
    }

    if (risk.avg < 60) {
      // Eligible for low-average support: library, revision, resource_review
      const bestType = await fetchBestInterventionType(
        schoolId, risk.subject, ['library_topic', 'revision', 'resource_review'],
      ) ?? 'library_topic';

      const DESCRIPTION: Record<string, string> = {
        library_topic:   `Study ${risk.subject} in the library`,
        revision:        `Revise ${risk.subject} core concepts`,
        resource_review: `Review ${risk.subject} resources`,
      };
      const PAGE: Record<string, string> = {
        library_topic: 'library', revision: 'library', resource_review: 'resources',
      };

      const i = await createIntervention(
        studentId, schoolId, risk.subject, risk.subjectId, bestType as InterventionType,
        risk.avg < 50 ? 'below_pass' : 'high_risk',
        DESCRIPTION[bestType] ?? DESCRIPTION.library_topic,
        PAGE[bestType] ?? 'library',
        risk.avg,
      );
      created.push(i);
    }
  }

  for (const rec of revisionRecs.slice(0, 2)) {
    if (rec.urgency === 'critical' || rec.urgency === 'high') {
      // Eligible for revision/critical: revision, past_paper, or library
      const bestType = await fetchBestInterventionType(
        schoolId, rec.subject, ['revision', 'past_paper', 'library_topic'],
      ) ?? 'revision';

      const DESCRIPTION: Record<string, string> = {
        revision:      `Revise ${rec.subject} — ${rec.reason}`,
        past_paper:    `Complete a ${rec.subject} past paper — ${rec.reason}`,
        library_topic: `Study ${rec.subject} in the library — ${rec.reason}`,
      };
      const PAGE: Record<string, string> = {
        revision: 'library', past_paper: 'pastpapers', library_topic: 'library',
      };

      const i = await createIntervention(
        studentId, schoolId, rec.subject, rec.subjectId, bestType as InterventionType,
        rec.examDays !== null ? 'exam_soon' : 'declining_trend',
        DESCRIPTION[bestType] ?? DESCRIPTION.revision,
        PAGE[bestType] ?? 'library',
        rec.avg,
      );
      created.push(i);
    }
  }

  return created;
}

// ── Build Growth Timeline (pure — receives pre-fetched data) ──────────────────

export function buildGrowthTimeline(
  interventions: Intervention[],
  outcomes:      Outcome[],
  allMarks:      StudentResult[],
  goals:         { targetAps: number | null; targetCareer: string | null; updatedAt: string },
): GrowthTimelineEvent[] {
  const events: GrowthTimelineEvent[] = [];

  if (goals.updatedAt && (goals.targetAps || goals.targetCareer)) {
    events.push({
      date:   goals.updatedAt,
      type:   'goal_set',
      label:  'Goal Set',
      detail: goals.targetAps
        ? `Target APS: ${goals.targetAps}`
        : `Career goal: ${goals.targetCareer}`,
    });
  }

  const sortedMarks = [...allMarks]
    .filter(m => m.mark !== null)
    .sort((a, b) => (a.marked_at ?? a.created_at).localeCompare(b.marked_at ?? b.created_at));

  if (sortedMarks.length > 0) {
    const first = sortedMarks[0];
    events.push({
      date:   first.marked_at ?? first.created_at,
      type:   'mark_recorded',
      label:  'First Assessment',
      detail: `${first.subject_label}: ${Math.round((first.mark! / first.total) * 100)}%`,
    });
  }

  for (const inv of interventions) {
    if (inv.startedAt) {
      events.push({
        date:   inv.startedAt,
        type:   'intervention_started',
        label:  `${inv.subject} — Started`,
        detail: inv.description,
      });
    }
    if (inv.completedAt) {
      const outcome = outcomes.find(o => o.interventionId === inv.id);
      events.push({
        date:     inv.completedAt,
        type:     'intervention_completed',
        label:    `${inv.subject} — Completed`,
        detail:   outcome ? `${outcome.previousAvg}% → ${outcome.newAvg}%` : inv.description,
        delta:    outcome?.improvement,
        positive: outcome ? outcome.result === 'improved' : undefined,
      });
    }
  }

  for (const o of outcomes) {
    events.push({
      date:     o.recordedAt,
      type:     'outcome_recorded',
      label:    `${o.subject} ${o.result === 'improved' ? 'Improved' : o.result === 'declined' ? 'Declined' : 'Unchanged'}`,
      detail:   `${o.previousAvg}% → ${o.newAvg}% (${o.improvement >= 0 ? '+' : ''}${o.improvement}%)`,
      delta:    o.improvement,
      positive: o.result === 'improved',
    });
  }

  const seen = new Set<string>();
  return events
    .filter(e => {
      const key = `${e.date}_${e.label}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => a.date.localeCompare(b.date));
}
