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
  previousAvg:    number,
  newAvg:         number,
): Outcome {
  const improvement = Math.round((newAvg - previousAvg) * 10) / 10;
  const result: OutcomeResult =
    improvement > 2  ? 'improved'  :
    improvement < -2 ? 'declined'  :
                       'unchanged';

  const outcome: Outcome = {
    interventionId,
    subject,
    previousAvg:  Math.round(previousAvg),
    newAvg:       Math.round(newAvg),
    improvement,
    result,
    recordedAt:   new Date().toISOString(),
  };

  const existing = getOutcomes(studentId);
  // Prevent duplicate outcomes for same intervention
  const deduped = existing.filter(o => o.interventionId !== interventionId);
  saveOutcomes(studentId, [...deduped, outcome]);
  return outcome;
}

// ── Compute impact summary ────────────────────────────────────────────────────

export function computeInterventionImpact(studentId: number): InterventionImpact {
  const outcomes     = getOutcomes(studentId);
  const completed    = getInterventions(studentId).filter(i => i.status === 'completed');
  const successful   = outcomes.filter(o => o.result === 'improved');
  const improvements = successful.map(o => o.improvement);
  const avgImprovement = improvements.length
    ? Math.round(improvements.reduce((s, v) => s + v, 0) / improvements.length * 10) / 10
    : 0;

  return {
    totalCompleted:  completed.length,
    successful:      successful.length,
    avgImprovement,
    successRate:     completed.length > 0
      ? Math.round((successful.length / completed.length) * 100)
      : 0,
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
