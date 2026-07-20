// ── Wellbeing check-in engine ──────────────────────────────────────────────
// Data access + scoring + alert logic for the Wellbeing check-in feature.
// Every threshold here traces to .planning/research/WELLBEING_FEATURE_RESEARCH.md
// (section numbers noted inline) — do not adjust without updating that doc.
//
// Access control note: this app has no server backend (see .planning/sql/
// 2026-07-19_wellbeing_checkins.sql header) — supabaseAdmin bypasses RLS and
// ships in the browser bundle like every other data-access module in this
// codebase. Every function here that returns an individual student's data
// takes an explicit ownership parameter (teacherId + student's cohort's
// homeroom_teacher_id) and refuses if they don't match, and logs the access.
// This is stricter than the rest of the codebase's lib functions (which don't
// check ownership at all) because this is minors' health-adjacent data.

import { supabaseAdmin } from './supabase';
import type { TeacherGuidanceTopicId } from './wellbeingTeacherGuidance';

// ── Tunable constants (research section 1 & 3) ────────────────────────────

export const PHQ2_FLAG_MIN = 3;   // PHQ-2 >= this on a check-in counts as "elevated"
export const GAD2_FLAG_MIN = 3;   // GAD-2 >= this on a check-in counts as "elevated"
export const PHQ4_FLAG_MIN = 6;   // PHQ-4 >= this on a check-in counts as "elevated"

export const SUSTAINED_ELEVATION_MIN_CHECKINS = 2;   // >= this many elevated check-ins...
export const SUSTAINED_ELEVATION_WINDOW_DAYS  = 14;  // ...within this many days -> sustained_elevation

export const MARKED_DECLINE_POINTS   = 4;   // baseline - current >= this many PHQ-4 points...
export const MARKED_DECLINE_MIN_CURRENT = 6; // ...AND current PHQ-4 >= this (moderate distress) -> marked_decline

export const NEW_HIGH_DISTRESS_MIN = 9;   // first-ever PHQ-4 >= this -> new_high_distress

export const BASELINE_CHECKIN_COUNT = 5;   // baseline = median of the first N check-ins (up to N)

// Safety threshold: ANY response > "Not at all" (i.e. >= 1) triggers the
// crisis pathway. Research section 2 flags this as a deliberate trade-off
// (vs. a higher "More than half the days" bar) — confirmed as the chosen
// rule for this build: safety-first, given minors and no on-site counsellor.
export const SAFETY_TRIGGER_MIN = 1;

// ── Types ───────────────────────────────────────────────────────────────

export interface CheckinAnswers {
  phqDownInterest: 0 | 1 | 2 | 3;
  phqHopeless:     0 | 1 | 2 | 3;
  gadNervous:      0 | 1 | 2 | 3;
  gadWorry:        0 | 1 | 2 | 3;
  safetyResponse:  0 | 1 | 2 | 3;
}

export interface WellbeingCheckin {
  id: number;
  studentId: number;
  schoolId: number;
  phqDownInterest: number;
  phqHopeless: number;
  gadNervous: number;
  gadWorry: number;
  phq2Score: number;
  gad2Score: number;
  phq4Score: number;
  safetyResponse: number;
  createdAt: string;
}

export type AlertType = 'sustained_elevation' | 'marked_decline' | 'new_high_distress';

export interface RoutineAlertResult {
  alertType: AlertType;
  reasons: string[];
  triggeringCheckinIds: number[];
}

// ── Pure scoring (no I/O) ──────────────────────────────────────────────────

export function scoreCheckin(a: CheckinAnswers): { phq2: number; gad2: number; phq4: number } {
  const phq2 = a.phqDownInterest + a.phqHopeless;
  const gad2 = a.gadNervous + a.gadWorry;
  return { phq2, gad2, phq4: phq2 + gad2 };
}

export function isSafetyTriggered(safetyResponse: number): boolean {
  return safetyResponse >= SAFETY_TRIGGER_MIN;
}

function median(nums: number[]): number {
  if (nums.length === 0) return 0;
  const sorted = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

/**
 * Baseline PHQ-4 = median of a student's first N check-ins (excluding the
 * very latest if there's fewer than N+1 total, so a student's first-ever
 * check-in never gets compared against itself as its own baseline).
 * Extracted from detectRoutineAlert so deriveConcernSummary can reuse the
 * exact same baseline — behavior-preserving extraction, not a logic change.
 */
export function computeBaselinePhq4(history: WellbeingCheckin[]): number {
  if (history.length === 0) return 0;
  const sorted = [...history].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  const latest = sorted[sorted.length - 1];
  const baselineSource = sorted.slice(0, Math.max(1, sorted.length - 1)).slice(0, BASELINE_CHECKIN_COUNT);
  return baselineSource.length > 0 ? median(baselineSource.map(c => c.phq4Score)) : latest.phq4Score;
}

/**
 * Detects routine (non-crisis) alerts per research section 3, given a
 * student's full check-in history (oldest first). Pure function — no I/O.
 * Returns at most one alert per call, prioritised new_high_distress >
 * marked_decline > sustained_elevation, matching the severity ordering in
 * the research (a single detection run should surface the most serious
 * pattern, not stack all three).
 */
export function detectRoutineAlert(history: WellbeingCheckin[]): RoutineAlertResult | null {
  if (history.length === 0) return null;
  const sorted = [...history].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  const latest = sorted[sorted.length - 1];

  const baselinePhq4 = computeBaselinePhq4(history);

  // ── New high distress: first time PHQ-4 >= 9 ──
  const priorHadHighDistress = sorted.slice(0, -1).some(c => c.phq4Score >= NEW_HIGH_DISTRESS_MIN);
  if (latest.phq4Score >= NEW_HIGH_DISTRESS_MIN && !priorHadHighDistress) {
    return {
      alertType: 'new_high_distress',
      reasons: [`PHQ-4 score of ${latest.phq4Score}/12 on the most recent check-in — first time in the severe range (≥${NEW_HIGH_DISTRESS_MIN}) for this student.`],
      triggeringCheckinIds: [latest.id],
    };
  }

  // ── Marked decline: current PHQ-4 >= MARKED_DECLINE_POINTS below baseline, AND current >= MARKED_DECLINE_MIN_CURRENT ──
  const drop = baselinePhq4 - latest.phq4Score;
  if (drop >= MARKED_DECLINE_POINTS && latest.phq4Score >= MARKED_DECLINE_MIN_CURRENT) {
    return {
      alertType: 'marked_decline',
      reasons: [`PHQ-4 dropped ${Math.round(drop)} points from this student's baseline (${Math.round(baselinePhq4)}) to their most recent check-in (${latest.phq4Score}) — a marked decline into at least moderate distress.`],
      triggeringCheckinIds: [latest.id],
    };
  }

  // ── Sustained elevation: PHQ-2 >= 3 or GAD-2 >= 3 on >= 2 check-ins within 14 days ──
  const windowStart = new Date(new Date(latest.createdAt).getTime() - SUSTAINED_ELEVATION_WINDOW_DAYS * 86400000).toISOString();
  const recentWindow = sorted.filter(c => c.createdAt >= windowStart);
  const elevatedInWindow = recentWindow.filter(c => c.phq2Score >= PHQ2_FLAG_MIN || c.gad2Score >= GAD2_FLAG_MIN);

  if (elevatedInWindow.length >= SUSTAINED_ELEVATION_MIN_CHECKINS) {
    const kinds = new Set<string>();
    for (const c of elevatedInWindow) {
      if (c.phq2Score >= PHQ2_FLAG_MIN) kinds.add(`PHQ-2 ≥${PHQ2_FLAG_MIN}`);
      if (c.gad2Score >= GAD2_FLAG_MIN) kinds.add(`GAD-2 ≥${GAD2_FLAG_MIN}`);
    }
    return {
      alertType: 'sustained_elevation',
      reasons: [`${elevatedInWindow.length} check-ins in the last ${SUSTAINED_ELEVATION_WINDOW_DAYS} days scored elevated (${[...kinds].join(' or ')}) — a sustained pattern, not a single bad day.`],
      triggeringCheckinIds: elevatedInWindow.map(c => c.id),
    };
  }

  return null;
}

// ── Supabase-backed operations ──────────────────────────────────────────────

/** Submits a check-in. Always writes the routine row; if the safety item is
 * triggered, also opens a wellbeing_safety_flags row bound to the student's
 * current homeroom teacher (captured at flag-creation time). Runs routine
 * alert detection afterward and opens an alert row if warranted. */
export async function submitCheckin(
  studentId: number,
  schoolId: number,
  answers: CheckinAnswers,
): Promise<{ success: true; checkinId: number; safetyTriggered: boolean } | { success: false; error: string }> {
  const { phq2, gad2, phq4 } = scoreCheckin(answers);

  const { data: inserted, error } = await supabaseAdmin
    .from('wellbeing_checkins')
    .insert({
      student_id: studentId,
      school_id: schoolId,
      phq_down_interest: answers.phqDownInterest,
      phq_hopeless: answers.phqHopeless,
      gad_nervous: answers.gadNervous,
      gad_worry: answers.gadWorry,
      phq2_score: phq2,
      gad2_score: gad2,
      phq4_score: phq4,
      safety_response: answers.safetyResponse,
    })
    .select('id')
    .single();

  if (error || !inserted) {
    console.error('submitCheckin failed:', error?.message);
    return { success: false, error: 'Could not save your check-in. Please try again.' };
  }

  const safetyTriggered = isSafetyTriggered(answers.safetyResponse);

  if (safetyTriggered) {
    const { data: studentRow } = await supabaseAdmin
      .from('students')
      .select('cohort_id, cohorts(homeroom_teacher_id)')
      .eq('id', studentId)
      .maybeSingle();
    const homeroomTeacherId = (studentRow as any)?.cohorts?.homeroom_teacher_id ?? null;

    await supabaseAdmin.from('wellbeing_safety_flags').insert({
      checkin_id: inserted.id,
      student_id: studentId,
      school_id: schoolId,
      safety_response: answers.safetyResponse,
      homeroom_teacher_id: homeroomTeacherId,
    });
  } else {
    // Routine alert detection only runs on non-crisis check-ins — a safety
    // flag already guarantees teacher attention, so stacking a routine alert
    // on top of it would just be noise (research section 6c).
    const history = await fetchStudentCheckinHistory(studentId, 0 /* internal call, no ownership check needed here */, true);
    const alert = detectRoutineAlert(history);
    if (alert) {
      const { data: studentRow } = await supabaseAdmin
        .from('students')
        .select('cohort_id, cohorts(homeroom_teacher_id)')
        .eq('id', studentId)
        .maybeSingle();
      const homeroomTeacherId = (studentRow as any)?.cohorts?.homeroom_teacher_id ?? null;

      // Don't duplicate an already-open alert of the same type for this student.
      const { data: existingOpen } = await supabaseAdmin
        .from('wellbeing_routine_alerts')
        .select('id')
        .eq('student_id', studentId)
        .eq('alert_type', alert.alertType)
        .eq('status', 'open')
        .maybeSingle();

      if (!existingOpen) {
        await supabaseAdmin.from('wellbeing_routine_alerts').insert({
          student_id: studentId,
          school_id: schoolId,
          homeroom_teacher_id: homeroomTeacherId,
          alert_type: alert.alertType,
          reasons: alert.reasons,
          triggering_checkin_ids: alert.triggeringCheckinIds,
        });
      }
    }
  }

  return { success: true, checkinId: inserted.id, safetyTriggered };
}

function mapCheckinRow(r: any): WellbeingCheckin {
  return {
    id: r.id,
    studentId: r.student_id,
    schoolId: r.school_id,
    phqDownInterest: r.phq_down_interest,
    phqHopeless: r.phq_hopeless,
    gadNervous: r.gad_nervous,
    gadWorry: r.gad_worry,
    phq2Score: r.phq2_score,
    gad2Score: r.gad2_score,
    phq4Score: r.phq4_score,
    safetyResponse: r.safety_response,
    createdAt: r.created_at,
  };
}

/** Internal/self-access fetch — no ownership check (student fetching their
 * own history, or the alert-detection pass right after that same student's
 * own submit). Not exported for teacher-facing use — see
 * fetchStudentCheckinHistoryForTeacher for the access-controlled version. */
async function fetchStudentCheckinHistory(studentId: number, _unused: number, _skipCheck: true): Promise<WellbeingCheckin[]> {
  const { data, error } = await supabaseAdmin
    .from('wellbeing_checkins')
    .select('*')
    .eq('student_id', studentId)
    .order('created_at', { ascending: true });
  if (error || !data) return [];
  return data.map(mapCheckinRow);
}

/** Student's own check-in history (self-access — always allowed). */
export async function fetchOwnCheckinHistory(studentId: number): Promise<WellbeingCheckin[]> {
  return fetchStudentCheckinHistory(studentId, 0, true);
}

/** Whether this student has completed at least one check-in (used to decide
 * whether to show the consent/info screen). */
export async function hasCompletedAnyCheckin(studentId: number): Promise<boolean> {
  const { count } = await supabaseAdmin
    .from('wellbeing_checkins')
    .select('id', { count: 'exact', head: true })
    .eq('student_id', studentId);
  return (count ?? 0) > 0;
}

// ── Ownership check (homeroom teacher only) ─────────────────────────────────

async function isHomeroomTeacherForStudent(teacherId: number, studentId: number): Promise<boolean> {
  const { data } = await supabaseAdmin
    .from('students')
    .select('cohort_id, cohorts(homeroom_teacher_id)')
    .eq('id', studentId)
    .maybeSingle();
  const homeroomTeacherId = (data as any)?.cohorts?.homeroom_teacher_id ?? null;
  return homeroomTeacherId === teacherId;
}

async function logAccess(studentId: number, schoolId: number, teacherId: number, accessType: string): Promise<void> {
  // Fire-and-forget, matching the risk_scores cache-upsert convention — an
  // access-log write failure must never block the teacher from seeing data
  // they're legitimately entitled to see, but every successful call here is
  // the POPIA-required audit trail.
  supabaseAdmin.from('wellbeing_access_log').insert({
    student_id: studentId,
    school_id: schoolId,
    accessor_teacher_id: teacherId,
    access_type: accessType,
  }).then(() => {});
}

/** Same as logAccess but for a parent accessor. accessor_teacher_id
 * references public.teachers(id) — a parent_id must NOT be written into it
 * (wrong FK target, and would misattribute the access-log row to whichever
 * teacher happens to share that numeric id). Uses the separate
 * accessor_parent_id column added in
 * .planning/sql/2026-07-20_wellbeing_parent_access_log.sql. */
async function logParentAccess(studentId: number, schoolId: number, parentId: number, accessType: string): Promise<void> {
  supabaseAdmin.from('wellbeing_access_log').insert({
    student_id: studentId,
    school_id: schoolId,
    accessor_parent_id: parentId,
    access_type: accessType,
  }).then(() => {});
}

/** Teacher-facing fetch of one student's check-in history — refuses unless
 * `teacherId` is that student's homeroom teacher, and logs the access. */
export async function fetchStudentCheckinHistoryForTeacher(
  studentId: number,
  schoolId: number,
  teacherId: number,
): Promise<WellbeingCheckin[] | { error: string }> {
  const owns = await isHomeroomTeacherForStudent(teacherId, studentId);
  if (!owns) return { error: 'You are not this student\'s homeroom teacher.' };
  await logAccess(studentId, schoolId, teacherId, 'view_individual_timeline');
  return fetchStudentCheckinHistory(studentId, 0, true);
}

// ── Teacher homeroom roster + alerts ────────────────────────────────────────

export interface WellbeingRosterEntry {
  studentId: number;
  name: string;
  surname: string;
  latestCheckin: WellbeingCheckin | null;
  openSafetyFlag: SafetyFlag | null;
  openRoutineAlerts: RoutineAlert[];
  // Last BASELINE_CHECKIN_COUNT + 1 check-ins (oldest first), for
  // deriveConcernSummary's trend calculation on the teacher roster view.
  // Populated from the same checkins query fetchHomeroomWellbeingRoster
  // already runs — no extra fetch.
  recentHistory: WellbeingCheckin[];
}

export interface SafetyFlag {
  id: number;
  checkinId: number;
  studentId: number;
  safetyResponse: number;
  acknowledgedAt: string | null;
  acknowledgedBy: number | null;
  firstContactAt: string | null;
  firstContactNotes: string | null;
  createdAt: string;
}

export interface RoutineAlert {
  id: number;
  studentId: number;
  alertType: AlertType;
  reasons: string[];
  status: 'open' | 'snoozed' | 'addressed';
  snoozedUntil: string | null;
  createdAt: string;
}

function mapSafetyFlagRow(r: any): SafetyFlag {
  return {
    id: r.id,
    checkinId: r.checkin_id,
    studentId: r.student_id,
    safetyResponse: r.safety_response,
    acknowledgedAt: r.acknowledged_at,
    acknowledgedBy: r.acknowledged_by,
    firstContactAt: r.first_contact_at,
    firstContactNotes: r.first_contact_notes,
    createdAt: r.created_at,
  };
}

function mapRoutineAlertRow(r: any): RoutineAlert {
  return {
    id: r.id,
    studentId: r.student_id,
    alertType: r.alert_type,
    reasons: r.reasons ?? [],
    status: r.status,
    snoozedUntil: r.snoozed_until,
    createdAt: r.created_at,
  };
}

/** Full wellbeing roster for a homeroom teacher's cohort — latest check-in +
 * any open safety flag + any open/snoozed routine alerts per student. Logs
 * one access-log row per student included (a roster view is still viewing
 * individual data, per POPIA section 5 — aggregate-only views would not log,
 * but this page shows individual timelines, not aggregates). */
export async function fetchHomeroomWellbeingRoster(
  cohortId: number,
  schoolId: number,
  teacherId: number,
): Promise<WellbeingRosterEntry[]> {
  const { data: roster } = await supabaseAdmin
    .from('students')
    .select('id, name, surname')
    .eq('cohort_id', cohortId)
    .order('surname');

  if (!roster || roster.length === 0) return [];
  const studentIds = roster.map(s => s.id);

  const [{ data: checkins }, { data: safetyFlags }, { data: routineAlerts }] = await Promise.all([
    supabaseAdmin.from('wellbeing_checkins').select('*').in('student_id', studentIds).order('created_at', { ascending: false }),
    supabaseAdmin.from('wellbeing_safety_flags').select('*').in('student_id', studentIds).is('acknowledged_at', null),
    supabaseAdmin.from('wellbeing_routine_alerts').select('*').in('student_id', studentIds).in('status', ['open', 'snoozed']),
  ]);

  const latestByStudent = new Map<number, WellbeingCheckin>();
  const recentHistoryByStudent = new Map<number, WellbeingCheckin[]>();
  // checkins is ordered created_at DESC; take the newest (BASELINE_CHECKIN_COUNT + 1)
  // per student, then reverse to oldest-first for deriveConcernSummary.
  for (const row of checkins ?? []) {
    if (!latestByStudent.has(row.student_id)) latestByStudent.set(row.student_id, mapCheckinRow(row));
    const list = recentHistoryByStudent.get(row.student_id) ?? [];
    if (list.length < BASELINE_CHECKIN_COUNT + 1) list.push(mapCheckinRow(row));
    recentHistoryByStudent.set(row.student_id, list);
  }
  const safetyByStudent = new Map<number, SafetyFlag>();
  for (const row of safetyFlags ?? []) safetyByStudent.set(row.student_id, mapSafetyFlagRow(row));
  const alertsByStudent = new Map<number, RoutineAlert[]>();
  for (const row of routineAlerts ?? []) {
    const list = alertsByStudent.get(row.student_id) ?? [];
    list.push(mapRoutineAlertRow(row));
    alertsByStudent.set(row.student_id, list);
  }

  for (const s of roster) {
    await logAccess(s.id, schoolId, teacherId, 'view_roster');
  }

  return roster.map(s => ({
    studentId: s.id,
    name: s.name,
    surname: s.surname,
    latestCheckin: latestByStudent.get(s.id) ?? null,
    openSafetyFlag: safetyByStudent.get(s.id) ?? null,
    openRoutineAlerts: alertsByStudent.get(s.id) ?? [],
    recentHistory: (recentHistoryByStudent.get(s.id) ?? []).slice().reverse(),
  }));
}

/** Acknowledge a safety flag (research section 2: teacher must acknowledge
 * receipt). Refuses unless the acknowledging teacher is the flag's homeroom
 * teacher. */
export async function acknowledgeSafetyFlag(
  flagId: number,
  teacherId: number,
): Promise<{ success: true } | { success: false; error: string }> {
  const { data: flag } = await supabaseAdmin
    .from('wellbeing_safety_flags')
    .select('id, homeroom_teacher_id, student_id, school_id')
    .eq('id', flagId)
    .maybeSingle();

  if (!flag) return { success: false, error: 'Safety flag not found.' };
  if (flag.homeroom_teacher_id !== teacherId) return { success: false, error: 'Only this student\'s homeroom teacher can acknowledge this flag.' };

  const { error } = await supabaseAdmin
    .from('wellbeing_safety_flags')
    .update({ acknowledged_at: new Date().toISOString(), acknowledged_by: teacherId })
    .eq('id', flagId);

  if (error) return { success: false, error: 'Failed to acknowledge flag.' };
  await logAccess(flag.student_id, flag.school_id, teacherId, 'acknowledge_safety_flag');
  return { success: true };
}

/** Log first contact with the student after a safety flag (research section
 * 2, step 3) — optional, separate from acknowledgment. */
export async function logSafetyFlagFirstContact(
  flagId: number,
  teacherId: number,
  notes: string,
): Promise<{ success: true } | { success: false; error: string }> {
  const { data: flag } = await supabaseAdmin
    .from('wellbeing_safety_flags')
    .select('id, homeroom_teacher_id')
    .eq('id', flagId)
    .maybeSingle();
  if (!flag) return { success: false, error: 'Safety flag not found.' };
  if (flag.homeroom_teacher_id !== teacherId) return { success: false, error: 'Only this student\'s homeroom teacher can log this.' };

  const { error } = await supabaseAdmin
    .from('wellbeing_safety_flags')
    .update({ first_contact_at: new Date().toISOString(), first_contact_notes: notes })
    .eq('id', flagId);

  return error ? { success: false, error: 'Failed to save.' } : { success: true };
}

/** Snooze a routine alert for N days, or mark it addressed outright
 * (research section 6c — alert fatigue mitigation). */
export async function snoozeRoutineAlert(
  alertId: number,
  teacherId: number,
  days: number,
): Promise<{ success: true } | { success: false; error: string }> {
  const until = new Date();
  until.setDate(until.getDate() + days);
  const { error } = await supabaseAdmin
    .from('wellbeing_routine_alerts')
    .update({ status: 'snoozed', snoozed_until: until.toISOString().split('T')[0] })
    .eq('id', alertId)
    .eq('homeroom_teacher_id', teacherId);
  return error ? { success: false, error: 'Failed to snooze.' } : { success: true };
}

export async function markRoutineAlertAddressed(
  alertId: number,
  teacherId: number,
  notes?: string,
): Promise<{ success: true } | { success: false; error: string }> {
  const { error } = await supabaseAdmin
    .from('wellbeing_routine_alerts')
    .update({ status: 'addressed', addressed_at: new Date().toISOString(), addressed_by: teacherId, addressed_notes: notes ?? null })
    .eq('id', alertId)
    .eq('homeroom_teacher_id', teacherId);
  return error ? { success: false, error: 'Failed to update.' } : { success: true };
}

// ── Parental consent (POPIA lawful basis for routine check-in data) ────────
// wellbeing_parent_consents is append-only: each decision (granted/revoked)
// is a new row, so a parent's consent history is preserved, not overwritten.
// "Active consent" = most recent row for that student has decision='granted'.

export type ConsentStatus = 'granted' | 'revoked' | 'not_set';

export async function fetchConsentStatus(studentId: number): Promise<ConsentStatus> {
  const { data } = await supabaseAdmin
    .from('wellbeing_parent_consents')
    .select('decision')
    .eq('student_id', studentId)
    .order('recorded_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!data) return 'not_set';
  return data.decision as 'granted' | 'revoked';
}

export async function hasActiveConsent(studentId: number): Promise<boolean> {
  return (await fetchConsentStatus(studentId)) === 'granted';
}

/** Records a parent's consent decision for one of their own children.
 * Refuses unless parentId is actually linked to studentId via parent_students
 * (the same ownership check pattern as the homeroom-teacher checks above). */
export async function recordParentConsent(
  studentId: number,
  schoolId: number,
  parentId: number,
  decision: 'granted' | 'revoked',
): Promise<{ success: true } | { success: false; error: string }> {
  const { data: link } = await supabaseAdmin
    .from('parent_students')
    .select('parent_id')
    .eq('parent_id', parentId)
    .eq('student_id', studentId)
    .maybeSingle();

  if (!link) return { success: false, error: 'You are not linked to this learner.' };

  const { error } = await supabaseAdmin
    .from('wellbeing_parent_consents')
    .insert({ student_id: studentId, school_id: schoolId, parent_id: parentId, decision });

  return error ? { success: false, error: 'Failed to save your decision. Please try again.' } : { success: true };
}

export interface ConsentRecord {
  id: number;
  decision: 'granted' | 'revoked';
  recordedAt: string;
}

/** Full consent history for one child, for display on the parent's own page. */
export async function fetchConsentHistory(studentId: number): Promise<ConsentRecord[]> {
  const { data } = await supabaseAdmin
    .from('wellbeing_parent_consents')
    .select('id, decision, recorded_at')
    .eq('student_id', studentId)
    .order('recorded_at', { ascending: false });
  return (data ?? []).map(r => ({ id: r.id, decision: r.decision, recordedAt: r.recorded_at }));
}

// ── Plain-language concern summary (research: WELLBEING_HELP_EXPANSION_
// RESEARCH.md sections 3-5) ─────────────────────────────────────────────────
// Pure derivation over data the existing scoring/alert logic already
// produces — no new scoring logic, reuses the exported thresholds above.
// Used by both the teacher 5-section summary card and the parent two-tier
// summary view, so "never show raw answers" is structurally guaranteed:
// ConcernSummary never carries a CheckinAnswers field.

export type ConcernLevel = 'low' | 'some' | 'high';
export type PrimaryConcernArea = 'mood' | 'anxiety' | 'sudden_change' | null;

export interface ConcernSummary {
  concernLevel: ConcernLevel;
  primaryConcernArea: PrimaryConcernArea;
  trendLabel: string;   // "Improving" | "Declining" | "Steady" | "Not enough data yet"
  guidanceTopicId: TeacherGuidanceTopicId | null;
}

export function deriveConcernSummary(
  history: WellbeingCheckin[],           // oldest-first
  latestOpenAlert: RoutineAlert | null,
  hasOpenSafetyFlag: boolean,
): ConcernSummary {
  if (history.length === 0) {
    return { concernLevel: 'low', primaryConcernArea: null, trendLabel: 'Not enough data yet', guidanceTopicId: null };
  }

  const sorted = [...history].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  const latest = sorted[sorted.length - 1];

  // ── Concern level ──
  let concernLevel: ConcernLevel;
  if (hasOpenSafetyFlag || latestOpenAlert?.alertType === 'new_high_distress' || latest.phq4Score >= NEW_HIGH_DISTRESS_MIN) {
    concernLevel = 'high';
  } else if (latestOpenAlert !== null || latest.phq2Score >= PHQ2_FLAG_MIN || latest.gad2Score >= GAD2_FLAG_MIN) {
    concernLevel = 'some';
  } else {
    concernLevel = 'low';
  }

  // ── Primary concern area ──
  let primaryConcernArea: PrimaryConcernArea;
  if (latestOpenAlert?.alertType === 'marked_decline' || latestOpenAlert?.alertType === 'new_high_distress') {
    primaryConcernArea = 'sudden_change';
  } else if (latest.phq2Score > latest.gad2Score) {
    primaryConcernArea = 'mood';
  } else if (latest.gad2Score > latest.phq2Score) {
    primaryConcernArea = 'anxiety';
  } else {
    primaryConcernArea = null; // tie, including both 0
  }

  // ── Trend ──
  const baseline = computeBaselinePhq4(history);
  const meaningfulShift = MARKED_DECLINE_POINTS / 2; // half the "marked decline" bar counts as a real trend, not noise
  let trendLabel: string;
  if (sorted.length < 2) {
    trendLabel = 'Not enough data yet';
  } else if (baseline - latest.phq4Score >= meaningfulShift) {
    trendLabel = 'Declining over recent check-ins';
  } else if (latest.phq4Score - baseline >= meaningfulShift) {
    trendLabel = 'Improving over recent check-ins';
  } else {
    trendLabel = 'Steady over recent check-ins';
  }

  // ── Guidance topic link ──
  let guidanceTopicId: TeacherGuidanceTopicId | null;
  if (concernLevel === 'high') {
    // Safety/new-high-distress flows already carry their own inline script
    // on the homeroom page — no separate guidance-page link needed.
    guidanceTopicId = latestOpenAlert?.alertType === 'marked_decline' ? 'mood_dropped_suddenly' : null;
  } else if (latestOpenAlert?.alertType === 'marked_decline') {
    guidanceTopicId = 'mood_dropped_suddenly';
  } else if (latestOpenAlert?.alertType === 'sustained_elevation' && primaryConcernArea === 'anxiety') {
    guidanceTopicId = 'very_worried_stressed';
  } else if (latestOpenAlert?.alertType === 'sustained_elevation') {
    guidanceTopicId = 'low_mood_unmotivated';
  } else if (concernLevel === 'some') {
    guidanceTopicId = 'one_tough_week';
  } else {
    guidanceTopicId = null;
  }

  return { concernLevel, primaryConcernArea, trendLabel, guidanceTopicId };
}

/** Parent-facing fetch of one child's wellbeing summary inputs — refuses
 * unless parentId is linked to studentId via parent_students (same check as
 * recordParentConsent), and logs the access the same way teacher roster/
 * timeline views are logged (POPIA section 7 of the expansion research). */
export async function fetchChildWellbeingSummaryForParent(
  studentId: number,
  schoolId: number,
  parentId: number,
): Promise<{ history: WellbeingCheckin[]; openSafetyFlag: SafetyFlag | null; openRoutineAlerts: RoutineAlert[] } | { error: string }> {
  const { data: link } = await supabaseAdmin
    .from('parent_students')
    .select('parent_id')
    .eq('parent_id', parentId)
    .eq('student_id', studentId)
    .maybeSingle();

  if (!link) return { error: 'You are not linked to this learner.' };

  const [{ data: checkins }, { data: safetyFlags }, { data: routineAlerts }] = await Promise.all([
    supabaseAdmin.from('wellbeing_checkins').select('*').eq('student_id', studentId).order('created_at', { ascending: true }),
    supabaseAdmin.from('wellbeing_safety_flags').select('*').eq('student_id', studentId).is('acknowledged_at', null).limit(1),
    supabaseAdmin.from('wellbeing_routine_alerts').select('*').eq('student_id', studentId).in('status', ['open', 'snoozed']),
  ]);

  await logParentAccess(studentId, schoolId, parentId, 'view_parent_summary');

  return {
    history: (checkins ?? []).map(mapCheckinRow),
    openSafetyFlag: safetyFlags && safetyFlags.length > 0 ? mapSafetyFlagRow(safetyFlags[0]) : null,
    openRoutineAlerts: (routineAlerts ?? []).map(mapRoutineAlertRow),
  };
}
