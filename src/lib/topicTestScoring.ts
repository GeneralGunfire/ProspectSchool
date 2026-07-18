// ── Topic Tests v2 — Bayesian mastery scoring engine ─────────────────────────
// Pure functions, no Supabase dependency — computed client-side (see project
// decision: fast iteration during pilot, harden server-side later if ever needed).

export type MasteryLevel = 'not_started' | 'attempted' | 'familiar' | 'proficient' | 'mastered';
export type Difficulty = 'foundational' | 'application' | 'extension';

export const MASTERY_LABEL: Record<MasteryLevel, string> = {
  not_started: 'Not Started', attempted: 'Attempted', familiar: 'Familiar',
  proficient: 'Proficient', mastered: 'Mastered',
};

// Ordinal 5-step ramp (single hue, light→dark) — mastery is a progression, not
// a set of identities, so this is a sequential scale, not categorical hues.
// Validated: node scripts/validate_palette.js "<hexes>" --mode light --ordinal
// (dataviz skill, palette.md blue ramp, steps 250/300/400/500/600).
export const MASTERY_COLOR: Record<MasteryLevel, string> = {
  not_started: '#86b6ef', attempted: '#5598e7', familiar: '#256abf',
  proficient: '#184f95', mastered: '#0d366b',
};

const PRIOR_DEFAULT = 0.2;
const MASTERY_THRESHOLD = 0.95;
const DECAY_HALF_LIFE_DAYS = 10; // midpoint of research spec's 7–14 day range
const RETEST_TRIGGER_POSTERIOR = 0.85;

// BKT-style learn/slip/guess params, tuned per difficulty tier (first-pass
// estimate — refine once real attempt data exists, per plan §7.4).
const BKT_PARAMS: Record<Difficulty, { pLearn: number; pSlip: number; pGuess: number }> = {
  foundational: { pLearn: 0.3, pSlip: 0.1, pGuess: 0.25 },
  application:  { pLearn: 0.22, pSlip: 0.15, pGuess: 0.15 },
  extension:    { pLearn: 0.15, pSlip: 0.2, pGuess: 0.1 },
};

export interface QuestionResult {
  correct: boolean;
  difficulty: Difficulty;
}

/**
 * Sequential Bayesian Knowledge Tracing update. Starts from `priorP` and
 * folds in each question result in order, applying the standard BKT
 * posterior-update-then-transition formula per answer.
 */
export function computePosterior(priorP: number, questionResults: QuestionResult[]): number {
  let p = priorP;
  for (const { correct, difficulty } of questionResults) {
    const { pLearn, pSlip, pGuess } = BKT_PARAMS[difficulty];

    // P(known | evidence) via Bayes' rule
    const pEvidenceGivenKnown = correct ? (1 - pSlip) : pSlip;
    const pEvidenceGivenUnknown = correct ? pGuess : (1 - pGuess);
    const numerator = p * pEvidenceGivenKnown;
    const denominator = numerator + (1 - p) * pEvidenceGivenUnknown;
    const pKnownGivenEvidence = denominator > 0 ? numerator / denominator : p;

    // Learning transition: even if not yet known, may transition to known
    p = pKnownGivenEvidence + (1 - pKnownGivenEvidence) * pLearn;
  }
  return clamp01(p);
}

/**
 * Exponential decay of posterior back toward the prior, based on days
 * elapsed since the last attempt. Models forgetting between assessments.
 */
export function applyDecay(
  posterior: number,
  lastAttemptDate: Date,
  now: Date,
  halfLifeDays: number = DECAY_HALF_LIFE_DAYS,
): number {
  const daysElapsed = Math.max(0, (now.getTime() - lastAttemptDate.getTime()) / (1000 * 60 * 60 * 24));
  const decayFactor = Math.pow(0.5, daysElapsed / halfLifeDays);
  const decayed = PRIOR_DEFAULT + (posterior - PRIOR_DEFAULT) * decayFactor;
  return clamp01(decayed);
}

export function deriveMasteryLevel(decayedPosterior: number): MasteryLevel {
  if (decayedPosterior >= MASTERY_THRESHOLD) return 'mastered';
  if (decayedPosterior >= 0.8) return 'proficient';
  if (decayedPosterior >= 0.5) return 'familiar';
  if (decayedPosterior >= 0.2) return 'attempted';
  return 'not_started';
}

/**
 * Simple binomial-style confidence band that narrows as more questions are
 * answered — communicates "how sure are we" alongside the point estimate.
 */
export function computeConfidenceBand(posterior: number, numQuestions: number): { low: number; high: number } {
  const margin = numQuestions > 0 ? 1 / Math.sqrt(numQuestions) * 0.3 : 0.3;
  return {
    low: clamp01(posterior - margin),
    high: clamp01(posterior + margin),
  };
}

export type AttemptPurpose = 'diagnostic' | 'mastery_confirm' | 'spaced_review' | 'maintenance';

const SPACING_SCHEDULE: Record<AttemptPurpose, { nextPurpose: AttemptPurpose; daysAhead: number }> = {
  diagnostic:       { nextPurpose: 'mastery_confirm', daysAhead: 3 },
  mastery_confirm:  { nextPurpose: 'spaced_review',   daysAhead: 8 },
  spaced_review:    { nextPurpose: 'maintenance',     daysAhead: 17 },
  maintenance:      { nextPurpose: 'maintenance',     daysAhead: 17 },
};

/**
 * Decides what the next retest should be and when it's due. If mastery is
 * shaky (posterior below the retest trigger), pulls the schedule forward to
 * 2 days instead of the standard spacing.
 */
export function scheduleNextRetest(
  attemptPurpose: AttemptPurpose,
  submittedAt: Date,
  decayedPosterior: number,
): { nextPurpose: AttemptPurpose; dueAt: Date } {
  const { nextPurpose, daysAhead } = SPACING_SCHEDULE[attemptPurpose];
  const effectiveDays = decayedPosterior < RETEST_TRIGGER_POSTERIOR ? Math.min(2, daysAhead) : daysAhead;
  const dueAt = new Date(submittedAt.getTime() + effectiveDays * 24 * 60 * 60 * 1000);
  return { nextPurpose, dueAt };
}

export function isRetestDue(nextRetestDueAt: string | null, now: Date = new Date()): boolean {
  if (!nextRetestDueAt) return false;
  return new Date(nextRetestDueAt).getTime() <= now.getTime();
}

function clamp01(n: number): number {
  return Math.min(1, Math.max(0, n));
}

export { PRIOR_DEFAULT, MASTERY_THRESHOLD, RETEST_TRIGGER_POSTERIOR };
