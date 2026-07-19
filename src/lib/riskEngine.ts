// ── Unified ABC Risk Engine ───────────────────────────────────────────────────
// Single source of truth for "is this student at risk" across the whole app.
// Replaces three previously-competing implementations:
//   - studentInsights.ts: computeStudentInsights's examRiskSubjects reason-count rules
//   - teacherAnalytics.ts: fetchAtRiskStudents (below_pass / missed_homework)
//   - teacherAnalytics.ts: computeLearnerTier (40/55/75 average cut points)
//
// Grounded in the ABC early-warning model (Attendance, Behaviour, Course
// performance) per Balfanz/Herzog/Mac Iver and Chicago's On-Track Indicator.
// Every threshold below is a named constant — expected to be recalibrated once
// this school has enough historical outcome data to validate against.
//
// Every flag carries plain-language `reasons` — a bare score without an
// explanation is not something a teacher can act on or trust.

import { supabaseAdmin } from './supabase';

// ── Tunable constants (SA-context starting points — see design note) ─────────

// Attendance: SA classrooms likely run higher baseline absenteeism and lower
// recording rigor than the US EWS literature this model draws on, so these
// are set stricter than the common 80%/90% US norms.
export const ATTENDANCE_SEVERE_BELOW   = 75;   // rate below this -> sub-score 2
export const ATTENDANCE_MODERATE_BELOW = 85;   // rate below this -> sub-score 1

// Behaviour: behaviour_points has no severity column — only merit/demerit,
// category, and points. We treat any demerit worth >= this many points as
// "serious" (vs. a low-point demerit like being 2 minutes late). Adjust this
// threshold, or promote specific DEMERIT_CATEGORIES to "serious" explicitly,
// once real point-value distributions are visible in production data.
export const BEHAVIOUR_SERIOUS_MIN_POINTS = 3;
export const BEHAVIOUR_SEVERE_INCIDENTS   = 2;  // >= this many serious -> sub-score 2
export const BEHAVIOUR_MODERATE_INCIDENTS = 1;  // >= this many serious, or a
// documented pattern of repeated minor issues (see MINOR_PATTERN_COUNT) -> sub-score 1
export const MINOR_PATTERN_COUNT = 4;           // >= this many *minor* demerits alone
                                                 // counts as "a documented pattern"

// Recency windows — used for both attendance and behaviour "recent" figures.
export const RECENT_WINDOW_DAYS = 42;   // ~6 weeks
export const TERM_WINDOW_DAYS   = 90;   // no explicit school-term register exists
                                          // in the schema (see marks.ts) — 90 days
                                          // approximates a term-to-date window.

// Recency weighting: S_weighted = RECENCY_WEIGHT * S_recent + (1 - RECENCY_WEIGHT) * S_term
export const RECENCY_WEIGHT = 0.6;

// Course performance (per subject, rolled up to worst-subject for the student)
export const COURSE_WINDOW_ASSESSMENTS = 6;      // last N assessments considered
export const COURSE_MIN_ASSESSMENTS    = 4;      // need at least this many to score trend
export const COURSE_DECLINE_SLOPE      = -3;     // pct-points per assessment
export const COURSE_VOLATILITY_RATIO   = 0.4;    // range >= 40% of mean = volatile
export const COURSE_VOLATILITY_FLOOR   = 40;     // AND at least one score below this
export const COURSE_DEFAULT_BASELINE   = 50;      // used when no prior-term average exists

// Combined tiering
export const HIGH_RISK_TOTAL_MIN      = 4;   // R >= this...
export const HIGH_RISK_MIN_DOMAINS    = 2;   // ...AND at least this many domains >= 1
export const MODERATE_RISK_TOTAL_MIN  = 2;   // R >= this -> moderate
export const SEVERE_SINGLE_DOMAIN     = 2;   // any domain hitting this alone -> moderate

// ── Types ─────────────────────────────────────────────────────────────────────

export type RiskTier = 'high' | 'moderate' | 'none';

export interface DomainScore {
  score:   number;      // weighted 0-2 for attendance/behaviour; plain 0-2 for course
  reasons: string[];    // plain-language explanations, empty if score is 0
}

export interface CourseSubjectScore {
  subjectId:   number;
  subject:     string;
  score:       0 | 1 | 2;
  avg:         number;
  slope:       number | null;
  reasons:     string[];
}

export interface StudentRiskProfile {
  studentId:         number;
  attendance:        DomainScore;
  behaviour:         DomainScore;
  course:             DomainScore;
  courseSubjects:     CourseSubjectScore[];   // per-subject detail backing `course`
  worstSubject:       CourseSubjectScore | null;
  riskTotal:          number;
  tier:               RiskTier;
  reasons:            string[];               // combined, ordered: attendance, behaviour, course
  raw: {
    attendanceRateRecent: number | null;
    attendanceRateTerm:   number | null;
    behaviourSeriousRecent: number;
    behaviourSeriousTerm:   number;
  };
}

// ── Pure helpers (no I/O) ──────────────────────────────────────────────────────

function daysAgo(days: number, from = new Date()): string {
  const d = new Date(from);
  d.setDate(d.getDate() - days);
  return d.toISOString().split('T')[0];
}

/** Attendance rate excluding non_school_day rows, or null if no rows in window. */
function attendanceRate(rows: { status: string }[]): number | null {
  const counted = rows.filter(r => r.status !== 'non_school_day');
  if (counted.length === 0) return null;
  const present = counted.filter(r => r.status === 'present' || r.status === 'late' || r.status === 'excused').length;
  return Math.round((present / counted.length) * 1000) / 10;
}

/** Attendance sub-score (0-2) + reason for a single rate figure. */
function attendanceSubScore(rate: number | null): { score: number; reason: string | null } {
  if (rate === null) return { score: 0, reason: null };
  if (rate < ATTENDANCE_SEVERE_BELOW)   return { score: 2, reason: `Attendance ${rate}% — below ${ATTENDANCE_SEVERE_BELOW}% threshold` };
  if (rate < ATTENDANCE_MODERATE_BELOW) return { score: 1, reason: `Attendance ${rate}% — below ${ATTENDANCE_MODERATE_BELOW}% threshold` };
  return { score: 0, reason: null };
}

/** Behaviour sub-score (0-2) + reason from serious-incident + minor-pattern counts. */
function behaviourSubScore(serious: number, minor: number): { score: number; reason: string | null } {
  if (serious >= BEHAVIOUR_SEVERE_INCIDENTS) {
    return { score: 2, reason: `${serious} serious behaviour incident${serious !== 1 ? 's' : ''}` };
  }
  if (serious >= BEHAVIOUR_MODERATE_INCIDENTS) {
    return { score: 1, reason: `${serious} serious behaviour incident${serious !== 1 ? 's' : ''}` };
  }
  if (minor >= MINOR_PATTERN_COUNT) {
    return { score: 1, reason: `Repeated pattern of minor incidents (${minor} this window)` };
  }
  return { score: 0, reason: null };
}

/** Linear-regression slope of (index -> pct) using simple least squares. */
function slopeOf(pcts: number[]): number {
  const n = pcts.length;
  if (n < 2) return 0;
  const xs = pcts.map((_, i) => i);
  const xMean = xs.reduce((s, x) => s + x, 0) / n;
  const yMean = pcts.reduce((s, y) => s + y, 0) / n;
  let num = 0, den = 0;
  for (let i = 0; i < n; i++) {
    num += (xs[i] - xMean) * (pcts[i] - yMean);
    den += (xs[i] - xMean) ** 2;
  }
  return den === 0 ? 0 : num / den;
}

interface SubjectMarkPoint { pct: number; date: string }

/**
 * Per-subject course-performance score (0-2), per the design spec:
 *  - 2 if slope <= COURSE_DECLINE_SLOPE AND >=3 of last 4 assessments below baseline
 *  - 1 if (3-of-4-below-baseline with negative trend) OR high volatility + a low score
 *  - 0 otherwise
 * `priorTermAvg` is the student's own baseline (prior term avg), falling back to
 * COURSE_DEFAULT_BASELINE (50%) when no prior-term data exists.
 */
function scoreSubject(
  subjectId: number,
  subject:   string,
  points:    SubjectMarkPoint[],
  priorTermAvg: number | null,
): CourseSubjectScore {
  const sorted = [...points].sort((a, b) => a.date.localeCompare(b.date));
  const window = sorted.slice(-COURSE_WINDOW_ASSESSMENTS);
  const avg = window.length > 0
    ? Math.round(window.reduce((s, p) => s + p.pct, 0) / window.length)
    : 0;

  if (window.length < COURSE_MIN_ASSESSMENTS) {
    return { subjectId, subject, score: 0, avg, slope: null, reasons: [] };
  }

  const pcts = window.map(p => p.pct);
  const slope = Math.round(slopeOf(pcts) * 10) / 10;

  const baseline = priorTermAvg ?? COURSE_DEFAULT_BASELINE;
  const last4 = pcts.slice(-4);
  const belowBaselineCount = last4.filter(p => p < baseline).length;

  const mean  = last4.reduce((s, p) => s + p, 0) / last4.length;
  const range = Math.max(...last4) - Math.min(...last4);
  const volatile = mean > 0 && (range / mean) >= COURSE_VOLATILITY_RATIO && Math.min(...last4) < COURSE_VOLATILITY_FLOOR;

  const reasons: string[] = [];
  let score: 0 | 1 | 2 = 0;

  const decliningHard = slope <= COURSE_DECLINE_SLOPE && belowBaselineCount >= 3;
  const decliningSoft = belowBaselineCount >= 3 && slope < 0;

  if (decliningHard) {
    score = 2;
    reasons.push(`${subject} trending down ${Math.abs(slope)}pp/assessment over last ${last4.length} assessments`);
  } else if (decliningSoft || volatile) {
    score = 1;
    if (decliningSoft) reasons.push(`${subject}: ${belowBaselineCount} of last ${last4.length} assessments below baseline (${Math.round(baseline)}%), declining`);
    if (volatile) reasons.push(`${subject}: highly inconsistent results (range ${Math.round(range)}pp) with a score below ${COURSE_VOLATILITY_FLOOR}%`);
  }

  return { subjectId, subject, score, avg, slope, reasons };
}

/**
 * Combine three domain sub-scores into a tier per the spec:
 *  - high: R >= HIGH_RISK_TOTAL_MIN AND at least HIGH_RISK_MIN_DOMAINS domains score >= 1
 *  - moderate: R >= MODERATE_RISK_TOTAL_MIN, OR any single domain hits SEVERE_SINGLE_DOMAIN alone
 *  - none: otherwise
 */
function combineTier(a: number, b: number, c: number): { total: number; tier: RiskTier } {
  const total = a + b + c;
  const domainsAtOne = [a, b, c].filter(s => s >= 1).length;
  const anySevere = a >= SEVERE_SINGLE_DOMAIN || b >= SEVERE_SINGLE_DOMAIN || c >= SEVERE_SINGLE_DOMAIN;

  if (total >= HIGH_RISK_TOTAL_MIN && domainsAtOne >= HIGH_RISK_MIN_DOMAINS) {
    return { total, tier: 'high' };
  }
  if (total >= MODERATE_RISK_TOTAL_MIN || anySevere) {
    return { total, tier: 'moderate' };
  }
  return { total, tier: 'none' };
}

// ── Main engine — one student at a time ───────────────────────────────────────

export interface RawStudentInputs {
  studentId: number;
  attendanceRows:      { status: string; date: string }[];   // full history, filtered here
  behaviourRows:       { type: string; points: number; created_at: string }[];
  marksBySubject:      Map<number, { label: string; points: SubjectMarkPoint[]; priorTermAvg: number | null }>;
}

export function computeStudentRisk(input: RawStudentInputs, todayStr: string): StudentRiskProfile {
  const today = new Date(todayStr + 'T00:00:00');
  const recentCutoff = daysAgo(RECENT_WINDOW_DAYS, today);
  const termCutoff   = daysAgo(TERM_WINDOW_DAYS, today);

  // ── Attendance ──
  const attRecentRows = input.attendanceRows.filter(r => r.date >= recentCutoff);
  const attTermRows   = input.attendanceRows.filter(r => r.date >= termCutoff);
  const rateRecent = attendanceRate(attRecentRows);
  const rateTerm   = attendanceRate(attTermRows);

  const attRecentSub = attendanceSubScore(rateRecent);
  const attTermSub   = attendanceSubScore(rateTerm);
  const attendanceScoreWeighted = rateRecent === null && rateTerm === null
    ? 0
    : RECENCY_WEIGHT * attRecentSub.score + (1 - RECENCY_WEIGHT) * attTermSub.score;
  const attendanceReasons = [attRecentSub.reason].filter((r): r is string => !!r);
  // Prefer the recent-window reason; only add the term reason if it differs materially.
  if (attTermSub.reason && attTermSub.score > attRecentSub.score) attendanceReasons.push(attTermSub.reason + ' (term-to-date)');

  // ── Behaviour ──
  const behRecentRows = input.behaviourRows.filter(r => r.created_at >= recentCutoff);
  const behTermRows   = input.behaviourRows.filter(r => r.created_at >= termCutoff);

  const seriousRecent = behRecentRows.filter(r => r.type === 'demerit' && r.points >= BEHAVIOUR_SERIOUS_MIN_POINTS).length;
  const minorRecent   = behRecentRows.filter(r => r.type === 'demerit' && r.points < BEHAVIOUR_SERIOUS_MIN_POINTS).length;
  const seriousTerm   = behTermRows.filter(r => r.type === 'demerit' && r.points >= BEHAVIOUR_SERIOUS_MIN_POINTS).length;
  const minorTerm     = behTermRows.filter(r => r.type === 'demerit' && r.points < BEHAVIOUR_SERIOUS_MIN_POINTS).length;

  const behRecentSub = behaviourSubScore(seriousRecent, minorRecent);
  const behTermSub   = behaviourSubScore(seriousTerm, minorTerm);
  const behaviourScoreWeighted = RECENCY_WEIGHT * behRecentSub.score + (1 - RECENCY_WEIGHT) * behTermSub.score;
  const behaviourReasons = [behRecentSub.reason].filter((r): r is string => !!r);
  if (behTermSub.reason && behTermSub.score > behRecentSub.score) behaviourReasons.push(behTermSub.reason + ' (term-to-date)');

  // ── Course performance — worst subject drives the domain score ──
  // (Worst-subject rollup chosen over averaging: an early-warning system should
  // not let a strong overall average hide one subject in real trouble.)
  const courseSubjects: CourseSubjectScore[] = [];
  for (const [subjectId, { label, points, priorTermAvg }] of input.marksBySubject) {
    courseSubjects.push(scoreSubject(subjectId, label, points, priorTermAvg));
  }
  courseSubjects.sort((a, b) => b.score - a.score || a.avg - b.avg);
  const worstSubject = courseSubjects.length > 0 ? courseSubjects[0] : null;
  const courseScore = worstSubject?.score ?? 0;
  const courseReasons = worstSubject?.reasons ?? [];

  const { total, tier } = combineTier(attendanceScoreWeighted, behaviourScoreWeighted, courseScore);

  return {
    studentId: input.studentId,
    attendance: { score: Math.round(attendanceScoreWeighted * 10) / 10, reasons: attendanceReasons },
    behaviour:  { score: Math.round(behaviourScoreWeighted * 10) / 10, reasons: behaviourReasons },
    course:     { score: courseScore, reasons: courseReasons },
    courseSubjects,
    worstSubject,
    riskTotal: Math.round(total * 10) / 10,
    tier,
    reasons: [...attendanceReasons, ...behaviourReasons, ...courseReasons],
    raw: {
      attendanceRateRecent: rateRecent,
      attendanceRateTerm:   rateTerm,
      behaviourSeriousRecent: seriousRecent,
      behaviourSeriousTerm:   seriousTerm,
    },
  };
}

// ── Supabase-backed fetchers ───────────────────────────────────────────────────

/**
 * Builds RawStudentInputs for one student from real Supabase data, then scores.
 * Used by RiskEnginePage / StudentProgressPage (single-student detail views).
 */
export async function fetchStudentRisk(studentId: number, schoolId: number, todayStr: string): Promise<StudentRiskProfile> {
  const [{ data: attRows }, { data: behRows }, { data: markRows }] = await Promise.all([
    supabaseAdmin.from('attendance').select('status, date').eq('student_id', studentId),
    supabaseAdmin.from('behaviour_points').select('type, points, created_at').eq('student_id', studentId),
    supabaseAdmin.from('student_marks')
      .select('mark, marked_at, created_at, mark_sheets(subject_id, total, term, created_at)')
      .eq('student_id', studentId).eq('school_id', schoolId).not('mark', 'is', null),
  ]);

  const subjectIds = [...new Set((markRows ?? [])
    .map((r: any) => r.mark_sheets?.subject_id as number)
    .filter((id: unknown): id is number => typeof id === 'number'))];

  const { data: subjectsData } = subjectIds.length > 0
    ? await supabaseAdmin.from('subjects').select('id, label').in('id', subjectIds)
    : { data: [] };
  const labelMap = new Map((subjectsData ?? []).map((s: any) => [s.id as number, s.label as string]));

  const marksBySubject = new Map<number, { label: string; points: SubjectMarkPoint[]; priorTermAvg: number | null }>();
  const termsBySubject = new Map<number, Map<number, number[]>>(); // subjectId -> term -> pcts

  for (const r of (markRows ?? [])) {
    const ms = (r as any).mark_sheets;
    if (!ms) continue;
    const subjectId = ms.subject_id as number;
    const pct = (Number((r as any).mark) / Number(ms.total)) * 100;
    const date = ((r as any).marked_at ?? (r as any).created_at) as string;
    const term = ms.term as number;

    if (!marksBySubject.has(subjectId)) {
      marksBySubject.set(subjectId, { label: labelMap.get(subjectId) ?? 'Unknown', points: [], priorTermAvg: null });
    }
    marksBySubject.get(subjectId)!.points.push({ pct, date });

    if (!termsBySubject.has(subjectId)) termsBySubject.set(subjectId, new Map());
    const termMap = termsBySubject.get(subjectId)!;
    if (!termMap.has(term)) termMap.set(term, []);
    termMap.get(term)!.push(pct);
  }

  // Prior-term baseline: the average of the term immediately before the
  // student's most recent term with marks in this subject (falls back to
  // null -> COURSE_DEFAULT_BASELINE if there's no earlier term).
  for (const [subjectId, entry] of marksBySubject) {
    const termMap = termsBySubject.get(subjectId);
    if (!termMap || termMap.size < 2) continue;
    const terms = [...termMap.keys()].sort((a, b) => b - a);
    const priorTerm = terms[1];
    const priorPcts = termMap.get(priorTerm) ?? [];
    if (priorPcts.length > 0) {
      entry.priorTermAvg = Math.round(priorPcts.reduce((s, p) => s + p, 0) / priorPcts.length);
    }
  }

  return computeStudentRisk({
    studentId,
    attendanceRows: attRows ?? [],
    behaviourRows:  behRows ?? [],
    marksBySubject,
  }, todayStr);
}

// ── Adapter for the (unchanged) intervention auto-generation pipeline ─────────
// syncInterventionsFromRisk (interventions.ts) still expects the old
// SubjectRisk[] / RevisionRecommendation[] shapes — intervention-type matching
// is explicitly out of scope for this pass, so rather than touch that
// pipeline, we adapt the new engine's output into the shapes it already reads.
// `examDays` is left null: the old fuzzy title-matched exam lookup is not
// reproduced here (nothing in this pass depends on exam proximity — it fed
// into the *old* risk reasons, not the ABC model), so no intervention created
// from the adapter will ever key off `examDays <= 14/7`.

import type { SubjectRisk, RevisionRecommendation, RiskLevel } from './studentInsights';

export function tierToRiskLevel(score: number): RiskLevel {
  if (score >= 2) return 'high';
  if (score >= 1) return 'medium';
  return 'none';
}

export function profileToSubjectRisks(profile: StudentRiskProfile): SubjectRisk[] {
  return profile.courseSubjects
    .filter(cs => cs.score > 0)
    .map(cs => ({
      subject:   cs.subject,
      subjectId: cs.subjectId,
      avg:       cs.avg,
      risk:      tierToRiskLevel(cs.score),
      reasons:   cs.reasons.length > 0 ? cs.reasons : [`${cs.subject} flagged by risk engine`],
      examDays:  null,
    }));
}

export function profileToRevisionRecs(profile: StudentRiskProfile): RevisionRecommendation[] {
  return profile.courseSubjects
    .filter(cs => cs.score > 0)
    .map(cs => ({
      subject:   cs.subject,
      subjectId: cs.subjectId,
      avg:       cs.avg,
      urgency:   cs.score === 2 ? 'high' as const : 'medium' as const,
      reason:    cs.reasons[0] ?? `${cs.subject} needs attention`,
      examDays:  null,
    }));
}

export interface RiskRosterEntry {
  studentId:   number;
  name:        string;
  surname:     string;
  grade:       number;
  profile:     StudentRiskProfile;
}

/**
 * Computes risk for every student linked to a teacher, and upserts each
 * result into the `risk_scores` cache table (see .planning/sql for the
 * hand-run migration). Callers that just need the list can ignore the cache
 * write's outcome — it's fire-and-forget for read performance elsewhere
 * (Teacher Home, Admin dashboards).
 */
export async function fetchTeacherRiskRoster(teacherId: number, schoolId: number): Promise<RiskRosterEntry[]> {
  const { data: links } = await supabaseAdmin
    .from('teacher_students')
    .select('student_id, students(id, name, surname, grade)')
    .eq('teacher_id', teacherId);

  if (!links || links.length === 0) return [];

  const seen = new Set<number>();
  const students: { id: number; name: string; surname: string; grade: number }[] = [];
  for (const l of links) {
    const s = (l as any).students;
    if (!s || seen.has(s.id)) continue;
    seen.add(s.id);
    students.push(s);
  }

  const todayStr = new Date().toISOString().split('T')[0];
  const roster: RiskRosterEntry[] = [];

  for (const s of students) {
    const profile = await fetchStudentRisk(s.id, schoolId, todayStr);
    roster.push({ studentId: s.id, name: s.name, surname: s.surname, grade: s.grade, profile });
  }

  // Fire-and-forget cache upsert — failures here must never block the UI.
  const upsertRows = roster.map(r => ({
    student_id: r.studentId,
    school_id: schoolId,
    attendance_score: r.profile.attendance.score,
    behaviour_score: r.profile.behaviour.score,
    course_score: r.profile.course.score,
    risk_total: r.profile.riskTotal,
    risk_tier: r.profile.tier,
    reasons: r.profile.reasons,
    attendance_rate_recent: r.profile.raw.attendanceRateRecent,
    attendance_rate_term: r.profile.raw.attendanceRateTerm,
    behaviour_serious_recent: r.profile.raw.behaviourSeriousRecent,
    behaviour_serious_term: r.profile.raw.behaviourSeriousTerm,
    worst_subject_id: r.profile.worstSubject?.subjectId ?? null,
    worst_subject_label: r.profile.worstSubject?.subject ?? null,
    computed_at: new Date().toISOString(),
  }));
  if (upsertRows.length > 0) {
    supabaseAdmin.from('risk_scores').upsert(upsertRows, { onConflict: 'student_id' }).then(() => {});
  }

  return roster.sort((a, b) => b.profile.riskTotal - a.profile.riskTotal);
}
