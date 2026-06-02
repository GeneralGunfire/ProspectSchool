// ── Intervention & Outcome Tracking System ───────────────────────────────────
// Tracks the full loop: Risk detected → Recommendation → Action → Outcome
// Stored in localStorage per student. No backend needed.

// ── Types ─────────────────────────────────────────────────────────────────────

export type InterventionType   = 'revision' | 'past_paper' | 'library_topic' | 'resource_review';
export type InterventionReason = 'high_risk' | 'declining_trend' | 'exam_soon' | 'aps_gap' | 'below_pass';
export type InterventionStatus = 'recommended' | 'started' | 'completed' | 'expired';
export type OutcomeResult      = 'improved' | 'unchanged' | 'declined';

export interface Intervention {
  id:            string;
  studentId:     number;
  subject:       string;
  type:          InterventionType;
  reason:        InterventionReason;
  description:   string;          // human-readable action e.g. "Complete a Physics past paper"
  page:          string;          // navigation target: 'pastpapers' | 'library' | 'resources'
  createdAt:     string;
  startedAt?:    string;
  completedAt?:  string;
  expiresAt:     string;          // 30 days after creation
  status:        InterventionStatus;
  previousAvg:   number;          // subject avg when intervention was created
}

export interface Outcome {
  interventionId: string;
  subject:        string;
  type:           InterventionType;
  previousAvg:    number;
  newAvg:         number;
  improvement:    number;         // newAvg - previousAvg
  latestMark:     number;         // the specific mark that triggered the outcome
  result:         OutcomeResult;
  recordedAt:     string;
}

export interface InterventionImpact {
  totalCompleted:    number;
  successful:        number;      // improvement >= 3% OR latestMark >= 70
  partialSuccess:    number;      // improvement > 0 but below threshold
  avgImprovement:    number;      // avg improvement across all completed
  successRate:       number;      // successful / totalCompleted * 100
  bestType:          InterventionType | null;
  bestTypeGain:      number;
  typeEffectiveness: { type: InterventionType; successRate: number; avgGain: number; count: number }[];
}

export interface GrowthTimelineEvent {
  date:    string;        // ISO date string
  type:    'goal_set' | 'intervention_started' | 'intervention_completed' | 'outcome_recorded' | 'mark_recorded';
  label:   string;
  detail:  string;
  delta?:  number;        // improvement if outcome
  positive?: boolean;
}

// ── Storage keys ──────────────────────────────────────────────────────────────

const INTERVENTIONS_KEY = (id: number) => `prospect_interventions_${id}`;
const OUTCOMES_KEY      = (id: number) => `prospect_outcomes_${id}`;

// ── Read/write helpers ────────────────────────────────────────────────────────

export function getInterventions(studentId: number): Intervention[] {
  try {
    const raw = localStorage.getItem(INTERVENTIONS_KEY(studentId));
    if (!raw) return [];
    const all: Intervention[] = JSON.parse(raw);
    // Auto-expire anything older than 30 days that's still recommended/started
    const now = new Date().toISOString();
    return all.map(i =>
      (i.status === 'recommended' || i.status === 'started') && i.expiresAt < now
        ? { ...i, status: 'expired' as InterventionStatus }
        : i
    );
  } catch { return []; }
}

function saveInterventions(studentId: number, interventions: Intervention[]): void {
  // Keep last 50 interventions to avoid localStorage bloat
  const trimmed = interventions.slice(-50);
  localStorage.setItem(INTERVENTIONS_KEY(studentId), JSON.stringify(trimmed));
}

export function getOutcomes(studentId: number): Outcome[] {
  try {
    const raw = localStorage.getItem(OUTCOMES_KEY(studentId));
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveOutcomes(studentId: number, outcomes: Outcome[]): void {
  localStorage.setItem(OUTCOMES_KEY(studentId), JSON.stringify(outcomes.slice(-100)));
}

// ── Create intervention ───────────────────────────────────────────────────────

export function createIntervention(
  studentId:   number,
  subject:     string,
  type:        InterventionType,
  reason:      InterventionReason,
  description: string,
  page:        string,
  previousAvg: number,
): Intervention {
  const existing = getInterventions(studentId);

  // Deduplicate: don't create if an active intervention for same subject+type exists
  const duplicate = existing.find(i =>
    i.subject === subject &&
    i.type === type &&
    (i.status === 'recommended' || i.status === 'started')
  );
  if (duplicate) return duplicate;

  const now     = new Date();
  const expires = new Date(now);
  expires.setDate(expires.getDate() + 30);

  const intervention: Intervention = {
    id:          `${studentId}_${subject}_${type}_${Date.now()}`,
    studentId,
    subject,
    type,
    reason,
    description,
    page,
    createdAt:   now.toISOString(),
    expiresAt:   expires.toISOString(),
    status:      'recommended',
    previousAvg,
  };

  saveInterventions(studentId, [...existing, intervention]);
  return intervention;
}

// ── Update intervention status ────────────────────────────────────────────────

export function startIntervention(studentId: number, interventionId: string): void {
  const all = getInterventions(studentId);
  const updated = all.map(i =>
    i.id === interventionId && i.status === 'recommended'
      ? { ...i, status: 'started' as InterventionStatus, startedAt: new Date().toISOString() }
      : i
  );
  saveInterventions(studentId, updated);
}

export function completeIntervention(studentId: number, interventionId: string): void {
  const all = getInterventions(studentId);
  const updated = all.map(i =>
    i.id === interventionId && (i.status === 'recommended' || i.status === 'started')
      ? { ...i, status: 'completed' as InterventionStatus, completedAt: new Date().toISOString() }
      : i
  );
  saveInterventions(studentId, updated);
}

// ── Record outcome ────────────────────────────────────────────────────────────
// Called when a new mark arrives for a subject that had a completed intervention

export function recordOutcome(
  studentId:      number,
  interventionId: string,
  subject:        string,
  type:           InterventionType,
  previousAvg:    number,
  newAvg:         number,
  latestMark:     number,
): Outcome {
  const improvement = Math.round((newAvg - previousAvg) * 10) / 10;
  // Successful: improvement >= 3% OR the latest mark itself >= 70
  const result: OutcomeResult =
    improvement >= 3 || latestMark >= 70 ? 'improved'  :
    improvement > 0                      ? 'unchanged' :  // partial — counts as unchanged
                                           'declined';

  const outcome: Outcome = {
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

  const existing = getOutcomes(studentId);
  const deduped  = existing.filter(o => o.interventionId !== interventionId);
  saveOutcomes(studentId, [...deduped, outcome]);
  return outcome;
}

// ── Auto-record outcomes from fresh marks ────────────────────────────────────
// Call this on Marks page load with all marked results.
// Finds completed interventions with no outcome yet, checks for newer marks.

import type { StudentResult } from './marks';

export function syncOutcomesFromMarks(
  studentId: number,
  allMarks:  StudentResult[],
): void {
  const interventions = getInterventions(studentId);
  const outcomes      = getOutcomes(studentId);
  const completedWithoutOutcome = interventions.filter(i =>
    i.status === 'completed' &&
    i.completedAt !== undefined &&
    !outcomes.find(o => o.interventionId === i.id)
  );

  for (const inv of completedWithoutOutcome) {
    const subjectMarks = allMarks.filter(m =>
      m.mark !== null &&
      (m.subject_label?.toLowerCase().includes(inv.subject.split(' ')[0].toLowerCase()) ||
       inv.subject.toLowerCase().includes((m.subject_label ?? '').split(' ')[0].toLowerCase()))
    );

    if (subjectMarks.length === 0) continue;

    // Find marks that arrived after the intervention was completed
    const newMarks = subjectMarks.filter(m =>
      (m.marked_at ?? m.created_at) > (inv.completedAt ?? inv.createdAt)
    );

    if (newMarks.length === 0) continue;

    // Compute before avg (all marks up to completedAt)
    const beforeMarks = subjectMarks.filter(m =>
      (m.marked_at ?? m.created_at) <= (inv.completedAt ?? inv.createdAt)
    );
    const beforeAvg = beforeMarks.length > 0
      ? beforeMarks.reduce((s, m) => s + (m.mark! / m.total) * 100, 0) / beforeMarks.length
      : inv.previousAvg;

    // After avg = all subject marks including new ones
    const afterAvg = subjectMarks.reduce((s, m) => s + (m.mark! / m.total) * 100, 0) / subjectMarks.length;

    // Latest mark percentage
    const latest = newMarks.sort((a, b) =>
      (b.marked_at ?? b.created_at).localeCompare(a.marked_at ?? a.created_at)
    )[0];
    const latestMark = (latest.mark! / latest.total) * 100;

    recordOutcome(studentId, inv.id, inv.subject, inv.type, beforeAvg, afterAvg, latestMark);
  }
}

// ── Compute impact summary ────────────────────────────────────────────────────
// Pure function — accepts pre-fetched arrays so the engine remains side-effect free.
// Pages call getCompletedInterventions/getOutcomes once and pass the results here.

export function computeInterventionImpact(completed: Intervention[], outcomes: Outcome[]): InterventionImpact {
  const successful   = outcomes.filter(o => o.result === 'improved');
  const partial      = outcomes.filter(o => o.result === 'unchanged' && o.improvement > 0);
  const allImprovements = outcomes.map(o => o.improvement);
  const avgImprovement = allImprovements.length
    ? Math.round(allImprovements.reduce((s, v) => s + v, 0) / allImprovements.length * 10) / 10
    : 0;

  // Effectiveness by type
  const TYPES: InterventionType[] = ['past_paper', 'library_topic', 'revision', 'resource_review'];
  const typeEffectiveness = TYPES.map(type => {
    const typeOutcomes = outcomes.filter(o => o.type === type);
    const typeSuccessful = typeOutcomes.filter(o => o.result === 'improved');
    const typeGains = typeOutcomes.map(o => o.improvement);
    return {
      type,
      successRate: typeOutcomes.length > 0 ? Math.round((typeSuccessful.length / typeOutcomes.length) * 100) : 0,
      avgGain:     typeGains.length > 0 ? Math.round(typeGains.reduce((s, v) => s + v, 0) / typeGains.length * 10) / 10 : 0,
      count:       typeOutcomes.length,
    };
  }).filter(t => t.count > 0).sort((a, b) => b.avgGain - a.avgGain);

  const bestType     = typeEffectiveness.length > 0 ? typeEffectiveness[0].type : null;
  const bestTypeGain = typeEffectiveness.length > 0 ? typeEffectiveness[0].avgGain : 0;

  return {
    totalCompleted:   completed.length,
    successful:       successful.length,
    partialSuccess:   partial.length,
    avgImprovement,
    successRate:      completed.length > 0 ? Math.round((successful.length / completed.length) * 100) : 0,
    bestType,
    bestTypeGain,
    typeEffectiveness,
  };
}

// ── Auto-generate interventions from engine risk ──────────────────────────────
// Called by pages after computing studentInsights — creates interventions for
// high/medium risk subjects that don't already have one

import type { SubjectRisk, RevisionRecommendation } from './studentInsights';

export function syncInterventionsFromRisk(
  studentId: number,
  examRiskSubjects: SubjectRisk[],
  revisionRecs: RevisionRecommendation[],
): Intervention[] {
  const created: Intervention[] = [];

  for (const risk of examRiskSubjects) {
    if (risk.risk !== 'high' && risk.risk !== 'medium') continue;

    // Past paper intervention for exam-soon risks
    if (risk.examDays !== null && risk.examDays <= 14) {
      const i = createIntervention(
        studentId,
        risk.subject,
        'past_paper',
        risk.examDays <= 7 ? 'exam_soon' : 'high_risk',
        `Complete a ${risk.subject} past paper`,
        'pastpapers',
        risk.avg,
      );
      created.push(i);
    }

    // Library intervention for low averages
    if (risk.avg < 60) {
      const i = createIntervention(
        studentId,
        risk.subject,
        'library_topic',
        risk.avg < 50 ? 'below_pass' : 'high_risk',
        `Study ${risk.subject} in the library`,
        'library',
        risk.avg,
      );
      created.push(i);
    }
  }

  // Revision interventions from recommendations
  for (const rec of revisionRecs.slice(0, 2)) {
    if (rec.urgency === 'critical' || rec.urgency === 'high') {
      const i = createIntervention(
        studentId,
        rec.subject,
        'revision',
        rec.examDays !== null ? 'exam_soon' : 'declining_trend',
        `Revise ${rec.subject} — ${rec.reason}`,
        'library',
        rec.avg,
      );
      created.push(i);
    }
  }

  return created;
}

// ── Get active interventions for a student (recommended + started) ────────────

export function getActiveInterventions(studentId: number): Intervention[] {
  return getInterventions(studentId).filter(
    i => i.status === 'recommended' || i.status === 'started'
  );
}

export function getCompletedInterventions(studentId: number): Intervention[] {
  return getInterventions(studentId).filter(i => i.status === 'completed');
}

// ── Build Growth Timeline ─────────────────────────────────────────────────────
// Chronological story of the student's academic journey for My Future page

export function buildGrowthTimeline(
  studentId:   number,
  allMarks:    StudentResult[],
  goals:       { targetAps: number | null; targetCareer: string | null; updatedAt: string },
): GrowthTimelineEvent[] {
  const events: GrowthTimelineEvent[] = [];
  const interventions = getInterventions(studentId);
  const outcomes      = getOutcomes(studentId);

  // Goal set event
  if (goals.updatedAt && (goals.targetAps || goals.targetCareer)) {
    events.push({
      date:  goals.updatedAt,
      type:  'goal_set',
      label: 'Goal Set',
      detail: goals.targetAps
        ? `Target APS: ${goals.targetAps}`
        : `Career goal: ${goals.targetCareer}`,
    });
  }

  // First mark
  const sortedMarks = [...allMarks]
    .filter(m => m.mark !== null)
    .sort((a, b) => (a.marked_at ?? a.created_at).localeCompare(b.marked_at ?? b.created_at));

  if (sortedMarks.length > 0) {
    const first = sortedMarks[0];
    events.push({
      date:  first.marked_at ?? first.created_at,
      type:  'mark_recorded',
      label: 'First Assessment',
      detail: `${first.subject_label}: ${Math.round((first.mark! / first.total) * 100)}%`,
    });
  }

  // Intervention started events
  for (const inv of interventions) {
    if (inv.startedAt) {
      events.push({
        date:  inv.startedAt,
        type:  'intervention_started',
        label: `${inv.subject} — Started`,
        detail: inv.description,
      });
    }
    if (inv.completedAt) {
      const outcome = outcomes.find(o => o.interventionId === inv.id);
      events.push({
        date:    inv.completedAt,
        type:    'intervention_completed',
        label:   `${inv.subject} — Completed`,
        detail:  outcome
          ? `${outcome.previousAvg}% → ${outcome.newAvg}%`
          : inv.description,
        delta:    outcome?.improvement,
        positive: outcome ? outcome.result === 'improved' : undefined,
      });
    }
  }

  // Outcome events
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

  // Sort chronologically, deduplicate by date+label
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
