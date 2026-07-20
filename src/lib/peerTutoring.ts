// ── Peer Tutoring engine ────────────────────────────────────────────────────
// Data access + matching + session/badge/safety logic for the Peer Tutoring
// feature. Every threshold here traces to
// .planning/research/PEER_TUTORING_FEATURE_RESEARCH.md (section numbers noted
// inline) — do not adjust without updating that doc.
//
// Access control note: this app has no server backend (see .planning/sql/
// 2026-07-19_peer_tutoring.sql header) — supabaseAdmin bypasses RLS and ships
// in the browser bundle like every other data-access module in this codebase.
// Staff-facing reads take an explicit teacherId and check ownership (subject
// teacher for session/academic oversight, homeroom teacher for concern
// reports) before touching an individual student's row — same convention as
// src/lib/wellbeing.ts.

import { supabaseAdmin } from './supabase';
import { createNotification } from './notifications';

// ── Tunable constants (research section 2) ─────────────────────────────────

export const GOOD_GAP_MIN = 20;          // tutor - tutee topic score_pct >= this...
export const GOOD_GAP_MAX = 50;          // ...and <= this = "good gap"
export const FLAGGED_GAP_MIN = 60;       // gap > this = flag for teacher approval / suggest group study instead

export const MAX_CROSS_GRADE_DIFFERENCE = 2;   // cross-grade capped at <=2 grade difference
export const DEFAULT_GRADE_BAND = 1;            // same-grade or +-1 grade is the default, unapproved band

// ── Badge tiers (research section 4) ────────────────────────────────────────

export const BADGE_THRESHOLDS: Record<'bronze' | 'silver' | 'gold', number> = {
  bronze: 5,
  silver: 10,
  gold: 15,
};

// Tutee confirmation must happen within this many hours of session end for
// the session to count toward verified-session totals (research section 4).
export const CONFIRMATION_WINDOW_HOURS = 24;

// ── Session template (research section 3 — 5-step "25-minute session") ─────

export type SessionStep = 'set_goal' | 'tutee_attempts' | 'tutor_explains' | 'guided_practice' | 'recap';

export const SESSION_TEMPLATE_STEPS: { step: SessionStep; label: string; minutes: number; prompt: string }[] = [
  { step: 'set_goal', label: 'Set the goal', minutes: 2,
    prompt: 'Tutee: pick one specific topic or misconception. Both agree a concrete goal, e.g. "By the end, I can solve 3 exam-style questions without help."' },
  { step: 'tutee_attempts', label: 'Tutee attempts first', minutes: 5,
    prompt: 'Tutee tries 1–2 questions while the tutor watches. Tutor: do not give answers — note where they get stuck.' },
  { step: 'tutor_explains', label: 'Tutor explains the strategy', minutes: 6,
    prompt: 'Tutor explains the method using a fresh example (different numbers). Talk through the steps as if teaching a younger student — why does each step make sense?' },
  { step: 'guided_practice', label: 'Guided practice', minutes: 7,
    prompt: 'Tutee solves 2–3 new questions. Tutor uses question frames, not answers: "What\'s the first thing you need to do?" / "Which rule applies?" / "Can you check your answer makes sense?"' },
  { step: 'recap', label: 'Recap and self-rating', minutes: 3,
    prompt: 'Tutee summarises the key idea. Both rate confidence 1–5. Agree on one small practice task before next time.' },
];

export interface TemplateProgressEntry { step: SessionStep; completedAt: string | null }

export function emptyTemplateProgress(): TemplateProgressEntry[] {
  return SESSION_TEMPLATE_STEPS.map((s) => ({ step: s.step, completedAt: null }));
}

// ── Types ────────────────────────────────────────────────────────────────

export interface TutorProfile {
  id: number;
  studentId: number;
  schoolId: number;
  orientationCompletedAt: string | null;
  conductAcknowledgedAt: string | null;
  prefersKnownStudents: boolean | null;
  isActive: boolean;
}

export interface TutorTopic {
  id: number;
  tutorProfileId: number;
  subjectId: number;
  topicId: number;
  demonstratedScorePct: number;
}

export interface TutoringRequest {
  id: number;
  studentId: number;
  schoolId: number;
  subjectId: number;
  topicId: number;
  grade: number | null;
  conductAcknowledgedAt: string | null;
  preferKnownStudents: boolean | null;
  status: 'open' | 'matched' | 'cancelled';
  fulfilledByRelationshipId: number | null;
  createdAt: string;
}

function rowToRequest(r: any): TutoringRequest {
  return {
    id: r.id, studentId: r.student_id, schoolId: r.school_id, subjectId: r.subject_id, topicId: r.topic_id,
    grade: r.grade ?? null, conductAcknowledgedAt: r.conduct_acknowledged_at ?? null,
    preferKnownStudents: r.prefers_known_students ?? null, status: r.status,
    fulfilledByRelationshipId: r.fulfilled_by_relationship_id ?? null, createdAt: r.created_at,
  };
}

export type GapCategory = 'good_gap' | 'small_gap' | 'flagged_large_gap';

export interface TutoringRelationship {
  id: number;
  schoolId: number;
  tutorStudentId: number;
  tuteeStudentId: number;
  subjectId: number;
  topicId: number;
  tutorScorePctAtMatch: number;
  tuteeScorePctAtMatch: number;
  abilityGap: number;
  gradeDifference: number;
  gapCategory: GapCategory;
  requiresApproval: boolean;
  approvedBy: number | null;
  approvedAt: string | null;
  subjectTeacherId: number | null;
  preScorePct: number;
  preScoreAttemptId: number | null;
  // 'pending_approval' remains in the type only to represent legacy rows
  // created before teacher approval was removed from this feature — new
  // relationships never use it (see createRelationshipFromMatch below).
  status: 'pending_approval' | 'active' | 'completed' | 'ended_early' | 'declined';
  startedAt: string | null;
  endedAt: string | null;
  createdAt: string;
}

export interface TutoringSession {
  id: number;
  relationshipId: number;
  schoolId: number;
  scheduledFor: string | null;
  startedAt: string | null;
  endedAt: string | null;
  templateProgress: TemplateProgressEntry[];
  goalText: string | null;
  tuteeConfidenceBefore: number | null;
  tuteeConfidenceAfter: number | null;
  tuteeConfirmedAt: string | null;
  tuteeConfirmation: 'yes' | 'partly' | 'no' | null;
  tuteeConfirmationComment: string | null;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  createdAt: string;
}

function rowToRelationship(r: any): TutoringRelationship {
  return {
    id: r.id, schoolId: r.school_id, tutorStudentId: r.tutor_student_id, tuteeStudentId: r.tutee_student_id,
    subjectId: r.subject_id, topicId: r.topic_id, tutorScorePctAtMatch: r.tutor_score_pct_at_match,
    tuteeScorePctAtMatch: r.tutee_score_pct_at_match, abilityGap: r.ability_gap, gradeDifference: r.grade_difference,
    gapCategory: r.gap_category, requiresApproval: r.requires_approval, approvedBy: r.approved_by ?? null,
    approvedAt: r.approved_at ?? null, subjectTeacherId: r.subject_teacher_id ?? null,
    preScorePct: r.pre_score_pct, preScoreAttemptId: r.pre_score_attempt_id ?? null, status: r.status,
    startedAt: r.started_at ?? null, endedAt: r.ended_at ?? null, createdAt: r.created_at,
  };
}

function rowToSession(r: any): TutoringSession {
  return {
    id: r.id, relationshipId: r.relationship_id, schoolId: r.school_id, scheduledFor: r.scheduled_for ?? null,
    startedAt: r.started_at ?? null, endedAt: r.ended_at ?? null,
    templateProgress: r.template_progress ?? emptyTemplateProgress(),
    goalText: r.goal_text ?? null, tuteeConfidenceBefore: r.tutee_confidence_before ?? null,
    tuteeConfidenceAfter: r.tutee_confidence_after ?? null, tuteeConfirmedAt: r.tutee_confirmed_at ?? null,
    tuteeConfirmation: r.tutee_confirmation ?? null, tuteeConfirmationComment: r.tutee_confirmation_comment ?? null,
    status: r.status, createdAt: r.created_at,
  };
}

// ── Pure matching logic (no I/O) ────────────────────────────────────────────

export function categorizeGap(gap: number): GapCategory {
  if (gap > FLAGGED_GAP_MIN) return 'flagged_large_gap';
  if (gap >= GOOD_GAP_MIN && gap <= GOOD_GAP_MAX) return 'good_gap';
  return 'small_gap';
}

export interface MatchCandidate {
  tutorStudentId: number;
  tutorGrade: number;
  tutorScorePct: number;
  sameClassAsTutee: boolean;      // shares a class/teacher with the tutee (via teacher_students)
  priorPositiveInteraction: boolean;
  timetableOverlapScore: number;  // 0..1, higher = more shared free/break slots
}

export interface MatchResult {
  candidate: MatchCandidate;
  abilityGap: number;
  gapCategory: GapCategory;
  gradeDifference: number;
  eligible: boolean;
  requiresApproval: boolean;
  rejectionReason: string | null;
}

/**
 * Evaluates one candidate tutor against a tutee's request. Pure function — no
 * I/O. Encodes research section 1–2's rules:
 *   - same-grade or +-1 grade is the default, no-approval-needed band.
 *   - cross-grade beyond that is capped at <=2 grade difference AND requires
 *     the tutor to have demonstrated topic mastery (candidate.tutorScorePct
 *     is exactly that demonstrated score, passed in by the caller).
 *   - ability gap 20-50 = good; >60 = flagged (still eligible, but
 *     requiresApproval = true, "consider group study instead" is a UI-level
 *     suggestion, not a hard block).
 */
export function evaluateMatch(
  tuteeGrade: number,
  tuteeScorePct: number,
  candidate: MatchCandidate,
): MatchResult {
  const gradeDifference = Math.abs(candidate.tutorGrade - tuteeGrade);
  const abilityGap = candidate.tutorScorePct - tuteeScorePct;
  const gapCategory = categorizeGap(abilityGap);

  if (gradeDifference > MAX_CROSS_GRADE_DIFFERENCE) {
    return {
      candidate, abilityGap, gapCategory, gradeDifference, eligible: false, requiresApproval: false,
      rejectionReason: `Grade difference of ${gradeDifference} exceeds the maximum of ${MAX_CROSS_GRADE_DIFFERENCE}.`,
    };
  }

  if (abilityGap <= 0) {
    return {
      candidate, abilityGap, gapCategory, gradeDifference, eligible: false, requiresApproval: false,
      rejectionReason: 'Tutor is not stronger than the tutee on this topic.',
    };
  }

  // Cross-grade beyond the default +-1 band, or a large ability gap, both
  // require teacher approval before the relationship can start (section 1-2).
  const requiresApproval = gradeDifference > DEFAULT_GRADE_BAND || gapCategory === 'flagged_large_gap';

  return { candidate, abilityGap, gapCategory, gradeDifference, eligible: true, requiresApproval, rejectionReason: null };
}

/**
 * Ranks eligible candidates by the tie-breaking priority from research
 * section 2: same class/teacher > prior positive interaction > timetable
 * overlap. Pure function — no I/O.
 */
export function rankCandidates(results: MatchResult[]): MatchResult[] {
  return results
    .filter((r) => r.eligible)
    .sort((a, b) => {
      if (a.candidate.sameClassAsTutee !== b.candidate.sameClassAsTutee) {
        return a.candidate.sameClassAsTutee ? -1 : 1;
      }
      if (a.candidate.priorPositiveInteraction !== b.candidate.priorPositiveInteraction) {
        return a.candidate.priorPositiveInteraction ? -1 : 1;
      }
      if (a.candidate.timetableOverlapScore !== b.candidate.timetableOverlapScore) {
        return b.candidate.timetableOverlapScore - a.candidate.timetableOverlapScore;
      }
      // Final tie-break: prefer a gap closer to the middle of the "good" band.
      const mid = (GOOD_GAP_MIN + GOOD_GAP_MAX) / 2;
      return Math.abs(a.abilityGap - mid) - Math.abs(b.abilityGap - mid);
    });
}

// ── Supabase-backed: tutor/tutee onboarding ─────────────────────────────────

export async function fetchTutorProfile(studentId: number): Promise<TutorProfile | null> {
  const { data } = await supabaseAdmin.from('peer_tutor_profiles').select('*').eq('student_id', studentId).maybeSingle();
  if (!data) return null;
  return {
    id: data.id, studentId: data.student_id, schoolId: data.school_id,
    orientationCompletedAt: data.orientation_completed_at ?? null, conductAcknowledgedAt: data.conduct_acknowledged_at ?? null,
    prefersKnownStudents: data.prefers_known_students ?? null, isActive: data.is_active,
  };
}

export async function ensureTutorProfile(studentId: number, schoolId: number): Promise<TutorProfile> {
  const existing = await fetchTutorProfile(studentId);
  if (existing) return existing;
  const { data } = await supabaseAdmin
    .from('peer_tutor_profiles').insert({ student_id: studentId, school_id: schoolId }).select('*').single();
  return {
    id: data.id, studentId: data.student_id, schoolId: data.school_id,
    orientationCompletedAt: null, conductAcknowledgedAt: null, prefersKnownStudents: null, isActive: true,
  };
}

/** One-time gate (research section 3): a short in-app orientation + quiz. */
export async function completeTutorOrientation(studentId: number, schoolId: number): Promise<void> {
  const profile = await ensureTutorProfile(studentId, schoolId);
  await supabaseAdmin.from('peer_tutor_profiles').update({ orientation_completed_at: new Date().toISOString() }).eq('id', profile.id);
}

/** Code-of-conduct gate (research section 5) — applies to tutors and tutees separately. */
export async function acknowledgeTutorConduct(studentId: number, schoolId: number): Promise<void> {
  const profile = await ensureTutorProfile(studentId, schoolId);
  await supabaseAdmin.from('peer_tutor_profiles').update({ conduct_acknowledged_at: new Date().toISOString() }).eq('id', profile.id);
}

export async function offerTutorTopic(
  tutorProfileId: number, subjectId: number, topicId: number, demonstratedScorePct: number,
): Promise<{ success: true } | { success: false; error: string }> {
  const { error } = await supabaseAdmin
    .from('peer_tutor_topics')
    .upsert({ tutor_profile_id: tutorProfileId, subject_id: subjectId, topic_id: topicId, demonstrated_score_pct: demonstratedScorePct },
      { onConflict: 'tutor_profile_id,topic_id' });
  return error ? { success: false, error: 'Failed to save.' } : { success: true };
}

export async function fetchTutorTopics(tutorProfileId: number): Promise<TutorTopic[]> {
  const { data } = await supabaseAdmin.from('peer_tutor_topics').select('*').eq('tutor_profile_id', tutorProfileId);
  return (data ?? []).map((r: any) => ({
    id: r.id, tutorProfileId: r.tutor_profile_id, subjectId: r.subject_id, topicId: r.topic_id,
    demonstratedScorePct: r.demonstrated_score_pct,
  }));
}

export async function createTutoringRequest(
  studentId: number, schoolId: number, subjectId: number, topicId: number,
  conductAcknowledged: boolean, preferKnownStudents: boolean | null, grade: number,
): Promise<TutoringRequest | null> {
  const { data, error } = await supabaseAdmin
    .from('peer_tutoring_requests')
    .insert({
      student_id: studentId, school_id: schoolId, subject_id: subjectId, topic_id: topicId, grade,
      conduct_acknowledged_at: conductAcknowledged ? new Date().toISOString() : null,
      prefers_known_students: preferKnownStudents,
    })
    .select('*').single();
  if (error || !data) return null;
  return rowToRequest(data);
}

// ── Supabase-backed: matching ───────────────────────────────────────────────

/**
 * Finds and ranks eligible tutor candidates for a tutee's request. Pulls
 * live topic-test score_pct for the tutee (most recent submitted
 * student_attempts row on this topic) and each candidate tutor's
 * demonstrated score (peer_tutor_topics.demonstrated_score_pct), then applies
 * evaluateMatch + rankCandidates.
 */
export async function findTutorMatches(request: TutoringRequest): Promise<MatchResult[]> {
  const { data: tuteeStudent } = await supabaseAdmin.from('students').select('id, grade, cohort_id').eq('id', request.studentId).maybeSingle();
  if (!tuteeStudent) return [];

  const { data: tuteeAttempts } = await supabaseAdmin
    .from('student_attempts').select('score_pct, submitted_at').eq('student_id', request.studentId).eq('topic_id', request.topicId)
    .not('submitted_at', 'is', null).order('submitted_at', { ascending: false }).limit(1);
  const tuteeScorePct = tuteeAttempts?.[0]?.score_pct ?? 0;

  const { data: candidateTopics } = await supabaseAdmin
    .from('peer_tutor_topics').select('tutor_profile_id, demonstrated_score_pct, peer_tutor_profiles(student_id, orientation_completed_at, conduct_acknowledged_at, is_active)')
    .eq('topic_id', request.topicId).eq('subject_id', request.subjectId);
  if (!candidateTopics || candidateTopics.length === 0) return [];

  const eligibleTutors = (candidateTopics as any[]).filter((c) =>
    c.peer_tutor_profiles?.is_active &&
    c.peer_tutor_profiles?.orientation_completed_at &&
    c.peer_tutor_profiles?.conduct_acknowledged_at &&
    c.peer_tutor_profiles.student_id !== request.studentId,
  );
  if (eligibleTutors.length === 0) return [];

  const tutorStudentIds = eligibleTutors.map((c) => c.peer_tutor_profiles.student_id);
  const { data: tutorStudents } = await supabaseAdmin.from('students').select('id, grade, cohort_id').in('id', tutorStudentIds);
  const gradeByStudent = new Map((tutorStudents ?? []).map((s: any) => [s.id, s.grade]));
  const cohortByStudent = new Map((tutorStudents ?? []).map((s: any) => [s.id, s.cohort_id]));

  const [sameClassMap, priorMap, timetableMap] = await Promise.all([
    computeSameClassMap(request.studentId, request.subjectId, tutorStudentIds),
    computePriorPositiveMap(request.studentId, tutorStudentIds),
    computeTimetableOverlapMap(tuteeStudent.cohort_id, tutorStudentIds, cohortByStudent),
  ]);

  const results = eligibleTutors.map((c) => {
    const tutorStudentId = c.peer_tutor_profiles.student_id;
    const candidate: MatchCandidate = {
      tutorStudentId,
      tutorGrade: gradeByStudent.get(tutorStudentId) ?? 0,
      tutorScorePct: c.demonstrated_score_pct,
      sameClassAsTutee: sameClassMap.get(tutorStudentId) ?? false,
      priorPositiveInteraction: priorMap.get(tutorStudentId) ?? false,
      timetableOverlapScore: timetableMap.get(tutorStudentId) ?? 0,
    };
    return evaluateMatch(tuteeStudent.grade, tuteeScorePct, candidate);
  });

  return rankCandidates(results);
}

async function computeSameClassMap(tuteeStudentId: number, subjectId: number, tutorStudentIds: number[]): Promise<Map<number, boolean>> {
  const { data: tuteeLinks } = await supabaseAdmin.from('teacher_students').select('teacher_id').eq('student_id', tuteeStudentId).eq('subject_id', subjectId);
  const tuteeTeacherIds = new Set((tuteeLinks ?? []).map((l: any) => l.teacher_id));
  if (tuteeTeacherIds.size === 0) return new Map();

  const { data: tutorLinks } = await supabaseAdmin.from('teacher_students').select('teacher_id, student_id').in('student_id', tutorStudentIds).eq('subject_id', subjectId);
  const map = new Map<number, boolean>();
  for (const l of (tutorLinks ?? []) as any[]) {
    if (tuteeTeacherIds.has(l.teacher_id)) map.set(l.student_id, true);
  }
  return map;
}

async function computePriorPositiveMap(tuteeStudentId: number, tutorStudentIds: number[]): Promise<Map<number, boolean>> {
  const { data: rows } = await supabaseAdmin
    .from('peer_tutoring_prior_pairs').select('student_a_id, student_b_id, was_positive')
    .or(`student_a_id.eq.${tuteeStudentId},student_b_id.eq.${tuteeStudentId}`);
  const map = new Map<number, boolean>();
  for (const r of (rows ?? []) as any[]) {
    const other = r.student_a_id === tuteeStudentId ? r.student_b_id : r.student_a_id;
    if (tutorStudentIds.includes(other) && r.was_positive) map.set(other, true);
  }
  return map;
}

// Approximates "similar timetable blocks" (research section 2) using cohort-
// level timetable_entries — students don't have individually tracked
// schedules in this codebase, only their cohort's. Overlap score = fraction
// of the tutee's cohort's break/free periods that coincide with a period the
// tutor's cohort also has free (rough scheduling-feasibility signal, not a
// precise calendar match).
async function computeTimetableOverlapMap(
  tuteeCohortId: number | null, tutorStudentIds: number[], cohortByStudent: Map<number, number | null>,
): Promise<Map<number, number>> {
  const map = new Map<number, number>();
  if (!tuteeCohortId) return map;

  const relevantCohortIds = Array.from(new Set([tuteeCohortId, ...Array.from(cohortByStudent.values()).filter((c): c is number => c != null)]));
  const { data: entries } = await supabaseAdmin.from('timetable_entries').select('cohort_id, day_of_week, period_number, is_break').in('cohort_id', relevantCohortIds);
  if (!entries || entries.length === 0) return map;

  const freeSlotsByCohort = new Map<number, Set<string>>();
  for (const e of entries as any[]) {
    if (!e.is_break) continue;
    const key = `${e.day_of_week}-${e.period_number}`;
    const set = freeSlotsByCohort.get(e.cohort_id) ?? new Set<string>();
    set.add(key);
    freeSlotsByCohort.set(e.cohort_id, set);
  }
  const tuteeSlots = freeSlotsByCohort.get(tuteeCohortId) ?? new Set<string>();
  if (tuteeSlots.size === 0) return map;

  for (const tutorStudentId of tutorStudentIds) {
    const cohortId = cohortByStudent.get(tutorStudentId);
    if (!cohortId) { map.set(tutorStudentId, 0); continue; }
    const tutorSlots = freeSlotsByCohort.get(cohortId) ?? new Set<string>();
    const overlap = [...tuteeSlots].filter((s) => tutorSlots.has(s)).length;
    map.set(tutorStudentId, tuteeSlots.size > 0 ? overlap / tuteeSlots.size : 0);
  }
  return map;
}

/** Bug 1 dedup guard: true if this exact (tutor, tutee, topic) pairing
 * already has an open relationship (active, or a legacy pending_approval
 * row). Checked before every insert as defense-in-depth alongside the DB's
 * partial unique index (uq_peer_tutoring_relationships_open_pairing,
 * .planning/sql/2026-07-20_peer_tutoring_fixes.sql) — the DB constraint is
 * the real guarantee (app-code-only checks are exactly how this bug
 * happened originally), this is just a clean pre-check so callers get a
 * clear message instead of a raw constraint-violation error. */
export async function hasOpenRelationship(tutorStudentId: number, tuteeStudentId: number, topicId: number): Promise<boolean> {
  const { data } = await supabaseAdmin
    .from('peer_tutoring_relationships')
    .select('id')
    .eq('tutor_student_id', tutorStudentId).eq('tutee_student_id', tuteeStudentId).eq('topic_id', topicId)
    .in('status', ['active', 'pending_approval'])
    .maybeSingle();
  return !!data;
}

/**
 * Creates a relationship from a chosen match (either a live search match, or
 * a tutor fulfilling a logged open request — see fulfillRequest below).
 * Teacher approval was removed from this feature entirely (2026-07-20
 * redesign) — every relationship reaching this function has already passed
 * evaluateMatch()'s ability-gap and grade-difference eligibility checks (an
 * ineligible candidate never becomes a MatchResult with eligible: true), so
 * every relationship created here starts 'active' immediately. Captures the
 * subject teacher (via teacher_students for the tutee) and the tutee's
 * current topic-test score as the pre_score baseline (research section 6).
 */
export async function createRelationshipFromMatch(
  request: TutoringRequest, match: MatchResult,
): Promise<{ success: true; relationship: TutoringRelationship } | { success: false; error: string }> {
  if (await hasOpenRelationship(match.candidate.tutorStudentId, request.studentId, request.topicId)) {
    return { success: false, error: 'You already have an active tutoring match for this topic with this tutor.' };
  }

  const { data: teacherLink } = await supabaseAdmin
    .from('teacher_students').select('teacher_id').eq('student_id', request.studentId).eq('subject_id', request.subjectId).limit(1).maybeSingle();

  const { data: preAttempt } = await supabaseAdmin
    .from('student_attempts').select('id, score_pct').eq('student_id', request.studentId).eq('topic_id', request.topicId)
    .not('submitted_at', 'is', null).order('submitted_at', { ascending: false }).limit(1).maybeSingle();

  const preScorePct = preAttempt?.score_pct ?? 0;

  const { data, error } = await supabaseAdmin
    .from('peer_tutoring_relationships')
    .insert({
      school_id: request.schoolId,
      tutor_student_id: match.candidate.tutorStudentId,
      tutee_student_id: request.studentId,
      subject_id: request.subjectId,
      topic_id: request.topicId,
      tutor_score_pct_at_match: match.candidate.tutorScorePct,
      tutee_score_pct_at_match: preScorePct,
      ability_gap: match.abilityGap,
      grade_difference: match.gradeDifference,
      gap_category: match.gapCategory,
      requires_approval: false,
      subject_teacher_id: teacherLink?.teacher_id ?? null,
      pre_score_pct: preScorePct,
      pre_score_attempt_id: preAttempt?.id ?? null,
      status: 'active',
      started_at: new Date().toISOString(),
    })
    .select('*').single();

  if (error) {
    // 23505 = unique_violation — the DB constraint caught a race the
    // hasOpenRelationship pre-check missed (two near-simultaneous submits).
    // Same clear message either way; the guarantee is the constraint, not
    // which layer happens to report it.
    if ((error as any).code === '23505') {
      return { success: false, error: 'You already have an active tutoring match for this topic with this tutor.' };
    }
    console.error('[peerTutoring] createRelationshipFromMatch error:', error.message);
    return { success: false, error: 'Could not create the match. Please try again.' };
  }

  await supabaseAdmin.from('peer_tutoring_requests').update({ status: 'matched', fulfilled_by_relationship_id: data.id }).eq('id', request.id);

  const rel = rowToRelationship(data);
  createNotification(rel.schoolId, 'student', rel.tutorStudentId, 'New tutoring match', 'You\'ve been matched with a student who needs help — check "My relationships" to get started.');
  return { success: true, relationship: rel };
}

export async function fetchRelationshipsForStudent(studentId: number): Promise<TutoringRelationship[]> {
  const { data } = await supabaseAdmin
    .from('peer_tutoring_relationships').select('*')
    .or(`tutor_student_id.eq.${studentId},tutee_student_id.eq.${studentId}`)
    .order('created_at', { ascending: false });
  return (data ?? []).map(rowToRelationship);
}

// ── Supabase-backed: sessions ───────────────────────────────────────────────

export async function scheduleSession(relationshipId: number, schoolId: number, scheduledFor: Date | null): Promise<TutoringSession | null> {
  const { data, error } = await supabaseAdmin
    .from('peer_tutoring_sessions')
    .insert({ relationship_id: relationshipId, school_id: schoolId, scheduled_for: scheduledFor?.toISOString() ?? null, template_progress: emptyTemplateProgress() })
    .select('*').single();
  if (error || !data) return null;
  return rowToSession(data);
}

export async function startSession(sessionId: number): Promise<void> {
  await supabaseAdmin.from('peer_tutoring_sessions').update({ started_at: new Date().toISOString(), status: 'in_progress' }).eq('id', sessionId);
}

export async function completeSessionStep(sessionId: number, step: SessionStep, extra?: { goalText?: string; tuteeConfidenceBefore?: number }): Promise<void> {
  const { data: session } = await supabaseAdmin.from('peer_tutoring_sessions').select('template_progress').eq('id', sessionId).maybeSingle();
  const progress: TemplateProgressEntry[] = session?.template_progress ?? emptyTemplateProgress();
  const updated = progress.map((p) => (p.step === step ? { ...p, completedAt: new Date().toISOString() } : p));

  const patch: Record<string, unknown> = { template_progress: updated };
  if (extra?.goalText !== undefined) patch.goal_text = extra.goalText;
  if (extra?.tuteeConfidenceBefore !== undefined) patch.tutee_confidence_before = extra.tuteeConfidenceBefore;

  await supabaseAdmin.from('peer_tutoring_sessions').update(patch).eq('id', sessionId);
}

export async function endSession(sessionId: number, tuteeConfidenceAfter?: number): Promise<void> {
  await supabaseAdmin
    .from('peer_tutoring_sessions')
    .update({ ended_at: new Date().toISOString(), status: 'completed', tutee_confidence_after: tuteeConfidenceAfter ?? null })
    .eq('id', sessionId);
}

/**
 * Tutee confirmation — this is what makes a session "verified" (research
 * section 4), not just self-reported hours. Rejects confirmations submitted
 * outside the 24h window (still recorded on the session for transparency,
 * but excluded from verified-session counts by countVerifiedSessions below).
 */
export async function confirmSession(
  sessionId: number, tuteeStudentId: number, confirmation: 'yes' | 'partly' | 'no', comment?: string,
): Promise<{ success: true } | { success: false; error: string }> {
  const { data: session } = await supabaseAdmin
    .from('peer_tutoring_sessions').select('id, relationship_id, ended_at, status, peer_tutoring_relationships(tutee_student_id)')
    .eq('id', sessionId).maybeSingle();
  if (!session) return { success: false, error: 'Session not found.' };
  if ((session as any).peer_tutoring_relationships?.tutee_student_id !== tuteeStudentId) return { success: false, error: 'Only the tutee can confirm this session.' };
  if (session.status !== 'completed') return { success: false, error: 'Session has not ended yet.' };

  await supabaseAdmin
    .from('peer_tutoring_sessions')
    .update({ tutee_confirmed_at: new Date().toISOString(), tutee_confirmation: confirmation, tutee_confirmation_comment: comment ?? null })
    .eq('id', sessionId);

  await recomputeBadges(session.relationship_id);
  return { success: true };
}

export function isWithinConfirmationWindow(endedAt: string, confirmedAt: string): boolean {
  const hours = (new Date(confirmedAt).getTime() - new Date(endedAt).getTime()) / 3_600_000;
  return hours >= 0 && hours <= CONFIRMATION_WINDOW_HOURS;
}

/** A session counts toward recognition only if logged in-platform AND
 * tutee-confirmed within 24h with a 'yes' or 'partly' rating (research
 * section 4). A 'no' rating never counts, regardless of timing. */
export function isVerifiedSession(session: TutoringSession): boolean {
  if (session.status !== 'completed' || !session.endedAt || !session.tuteeConfirmedAt || !session.tuteeConfirmation) return false;
  if (session.tuteeConfirmation === 'no') return false;
  return isWithinConfirmationWindow(session.endedAt, session.tuteeConfirmedAt);
}

export async function fetchSessionsForRelationship(relationshipId: number): Promise<TutoringSession[]> {
  const { data } = await supabaseAdmin.from('peer_tutoring_sessions').select('*').eq('relationship_id', relationshipId).order('created_at', { ascending: true });
  return (data ?? []).map(rowToSession);
}

// ── Supabase-backed: badges (research section 4) ────────────────────────────

export async function countVerifiedSessionsForTutor(tutorStudentId: number): Promise<number> {
  const { data: relationships } = await supabaseAdmin.from('peer_tutoring_relationships').select('id').eq('tutor_student_id', tutorStudentId);
  const relationshipIds = (relationships ?? []).map((r: any) => r.id);
  if (relationshipIds.length === 0) return 0;

  const { data: sessions } = await supabaseAdmin.from('peer_tutoring_sessions').select('*').in('relationship_id', relationshipIds);
  return (sessions ?? []).map(rowToSession).filter(isVerifiedSession).length;
}

/** Recomputes and awards any newly-earned badge tiers for the tutor in this
 * relationship. Tiers are earned once and never revoked (a later low rating
 * doesn't strip an already-awarded badge — teacher oversight, not automatic
 * clawback, is the mitigation for that per research section 4). */
export async function recomputeBadges(relationshipId: number): Promise<void> {
  const { data: rel } = await supabaseAdmin.from('peer_tutoring_relationships').select('tutor_student_id, school_id').eq('id', relationshipId).maybeSingle();
  if (!rel) return;

  const verifiedCount = await countVerifiedSessionsForTutor(rel.tutor_student_id);
  const { data: existingBadges } = await supabaseAdmin.from('peer_tutor_badges').select('tier').eq('student_id', rel.tutor_student_id);
  const earnedTiers = new Set((existingBadges ?? []).map((b: any) => b.tier));

  for (const tier of ['bronze', 'silver', 'gold'] as const) {
    if (earnedTiers.has(tier)) continue;
    if (verifiedCount >= BADGE_THRESHOLDS[tier]) {
      await supabaseAdmin.from('peer_tutor_badges').insert({ student_id: rel.tutor_student_id, school_id: rel.school_id, tier, verified_session_count_at_award: verifiedCount });
      createNotification(rel.school_id, 'student', rel.tutor_student_id, `${tier[0].toUpperCase()}${tier.slice(1)} tutor badge earned!`, `You've completed ${verifiedCount} verified tutoring sessions.`);
    }
  }
}

export interface TutorBadge { tier: 'bronze' | 'silver' | 'gold'; verifiedSessionCountAtAward: number; awardedAt: string }

export async function fetchBadgesForStudent(studentId: number): Promise<TutorBadge[]> {
  const { data } = await supabaseAdmin.from('peer_tutor_badges').select('*').eq('student_id', studentId).order('awarded_at', { ascending: true });
  return (data ?? []).map((r: any) => ({ tier: r.tier, verifiedSessionCountAtAward: r.verified_session_count_at_award, awardedAt: r.awarded_at }));
}

// ── Teacher oversight: badge-farming pattern flags (research section 4) ────

export interface SuspiciousPatternFlag {
  tutorStudentId: number;
  reasons: string[];
}

/** Pure function — flags patterns research section 4 calls out as
 * "badge farming": many very short sessions, same tutee repeatedly, low
 * ratings. Operates on a tutor's own session history (already fetched by
 * caller), so it's cheap to re-run per teacher-dashboard render. */
export function detectSuspiciousPatterns(tutorStudentId: number, sessions: TutoringSession[], relationships: TutoringRelationship[]): SuspiciousPatternFlag | null {
  const reasons: string[] = [];
  const completed = sessions.filter((s) => s.status === 'completed' && s.startedAt && s.endedAt);

  const veryShort = completed.filter((s) => (new Date(s.endedAt!).getTime() - new Date(s.startedAt!).getTime()) < 10 * 60_000);
  if (completed.length >= 3 && veryShort.length / completed.length > 0.5) {
    reasons.push(`${veryShort.length} of ${completed.length} sessions were under 10 minutes.`);
  }

  const byRelationship = new Map<number, number>();
  for (const s of completed) byRelationship.set(s.relationshipId, (byRelationship.get(s.relationshipId) ?? 0) + 1);
  const relationshipIdToTuteeCount = new Map<number, number>();
  for (const r of relationships) relationshipIdToTuteeCount.set(r.id, r.tuteeStudentId);
  const sessionsPerTutee = new Map<number, number>();
  for (const [relId, count] of byRelationship) {
    const tuteeId = relationshipIdToTuteeCount.get(relId);
    if (tuteeId != null) sessionsPerTutee.set(tuteeId, (sessionsPerTutee.get(tuteeId) ?? 0) + count);
  }
  const totalSessions = completed.length;
  for (const [, count] of sessionsPerTutee) {
    if (totalSessions >= 5 && count / totalSessions > 0.8) {
      reasons.push('Over 80% of sessions are with a single tutee — verify this reflects genuine ongoing need.');
      break;
    }
  }

  const confirmed = completed.filter((s) => s.tuteeConfirmation);
  const lowRatings = confirmed.filter((s) => s.tuteeConfirmation === 'no');
  if (confirmed.length >= 3 && lowRatings.length / confirmed.length > 0.3) {
    reasons.push(`${lowRatings.length} of ${confirmed.length} confirmed sessions were rated "No, didn't help".`);
  }

  return reasons.length > 0 ? { tutorStudentId, reasons } : null;
}

// ── Supabase-backed: pre/post outcome tracking (research section 6) ────────
// Mirrors src/lib/interventions.ts syncOutcomesFromMarks — one outcome row
// per relationship, upserted, computed from real student_attempts rows.

export type TutoringOutcomeResult = 'clear_improvement' | 'some_improvement' | 'little_or_no_improvement';

export function categorizeGain(gain: number): TutoringOutcomeResult {
  if (gain >= 15) return 'clear_improvement';
  if (gain >= 5) return 'some_improvement';
  return 'little_or_no_improvement';
}

/**
 * Called whenever a tutee submits a new topic-test attempt. Finds active/
 * completed relationships for this student+topic with >=1 verified session
 * and no outcome recorded yet where a *new* attempt (after the relationship's
 * pre_score baseline) exists, then records the pre/post gain. Caller-driven,
 * not a DB trigger — same convention as syncOutcomesFromMarks.
 */
export async function syncTutoringOutcomes(studentId: number, topicId: number): Promise<void> {
  const { data: relationships } = await supabaseAdmin
    .from('peer_tutoring_relationships').select('*')
    .eq('tutee_student_id', studentId).eq('topic_id', topicId).in('status', ['active', 'completed']);
  if (!relationships || relationships.length === 0) return;

  for (const relRow of relationships) {
    const rel = rowToRelationship(relRow);

    const { data: existingOutcome } = await supabaseAdmin.from('peer_tutoring_outcomes').select('id').eq('relationship_id', rel.id).maybeSingle();
    if (existingOutcome) continue;

    const sessions = await fetchSessionsForRelationship(rel.id);
    const verifiedCount = sessions.filter(isVerifiedSession).length;
    if (verifiedCount === 0) continue;

    const { data: newAttempts } = await supabaseAdmin
      .from('student_attempts').select('id, score_pct, submitted_at').eq('student_id', studentId).eq('topic_id', topicId)
      .not('submitted_at', 'is', null).order('submitted_at', { ascending: false }).limit(1);
    const latest = newAttempts?.[0];
    if (!latest || latest.id === rel.preScoreAttemptId) continue;

    const gain = (latest.score_pct ?? 0) - rel.preScorePct;
    const result = categorizeGain(gain);

    await supabaseAdmin.from('peer_tutoring_outcomes').upsert({
      relationship_id: rel.id, pre_score_pct: rel.preScorePct, post_score_pct: latest.score_pct,
      post_score_attempt_id: latest.id, gain, result, verified_session_count: verifiedCount,
    }, { onConflict: 'relationship_id' });

    if (rel.subjectTeacherId) {
      const sign = gain >= 0 ? '+' : '';
      createNotification(rel.schoolId, 'teacher', rel.subjectTeacherId, `Tutoring outcome: ${sign}${gain}%`, `Estimated impact for a tutoring pair you oversee: ${result.replace(/_/g, ' ')}.`);
    }
  }
}

export interface TutoringOutcome {
  relationshipId: number; preScorePct: number; postScorePct: number; gain: number;
  result: TutoringOutcomeResult; verifiedSessionCount: number; recordedAt: string;
}

export async function fetchOutcomeForRelationship(relationshipId: number): Promise<TutoringOutcome | null> {
  const { data } = await supabaseAdmin.from('peer_tutoring_outcomes').select('*').eq('relationship_id', relationshipId).maybeSingle();
  if (!data) return null;
  return {
    relationshipId: data.relationship_id, preScorePct: data.pre_score_pct, postScorePct: data.post_score_pct,
    gain: data.gain, result: data.result, verifiedSessionCount: data.verified_session_count, recordedAt: data.recorded_at,
  };
}

// ── Supabase-backed: safety / "report a concern" (research section 5) ──────

export type ConcernCategory = 'uncomfortable_behaviour' | 'pressured_or_harassed' | 'inappropriate_content' | 'not_following_rules' | 'other';

export async function reportConcern(
  schoolId: number, reportedByStudentId: number, category: ConcernCategory, description: string,
  opts?: { relationshipId?: number; sessionId?: number; aboutStudentId?: number },
): Promise<{ success: true } | { success: false; error: string }> {
  const { data: student } = await supabaseAdmin.from('students').select('cohort_id, cohorts(homeroom_teacher_id)').eq('id', reportedByStudentId).maybeSingle();
  const homeroomTeacherId = (student as any)?.cohorts?.homeroom_teacher_id ?? null;

  const { error } = await supabaseAdmin.from('peer_tutoring_concerns').insert({
    school_id: schoolId, relationship_id: opts?.relationshipId ?? null, session_id: opts?.sessionId ?? null,
    reported_by_student_id: reportedByStudentId, about_student_id: opts?.aboutStudentId ?? null,
    category, description, homeroom_teacher_id: homeroomTeacherId,
  });
  if (error) return { success: false, error: 'Could not submit your report. Please try again, or speak to a teacher directly.' };

  if (homeroomTeacherId) {
    createNotification(schoolId, 'teacher', homeroomTeacherId, 'Peer tutoring concern reported', 'A student has reported a concern about a peer tutoring interaction — please review.');
  }
  return { success: true };
}

export interface TutoringConcern {
  id: number; schoolId: number; relationshipId: number | null; sessionId: number | null;
  reportedByStudentId: number; aboutStudentId: number | null; category: ConcernCategory; description: string;
  homeroomTeacherId: number | null; status: 'open' | 'in_progress' | 'resolved';
  acknowledgedAt: string | null; acknowledgedBy: number | null; resolutionNotes: string | null; resolvedAt: string | null;
  createdAt: string;
}

function rowToConcern(r: any): TutoringConcern {
  return {
    id: r.id, schoolId: r.school_id, relationshipId: r.relationship_id ?? null, sessionId: r.session_id ?? null,
    reportedByStudentId: r.reported_by_student_id, aboutStudentId: r.about_student_id ?? null, category: r.category,
    description: r.description, homeroomTeacherId: r.homeroom_teacher_id ?? null, status: r.status,
    acknowledgedAt: r.acknowledged_at ?? null, acknowledgedBy: r.acknowledged_by ?? null,
    resolutionNotes: r.resolution_notes ?? null, resolvedAt: r.resolved_at ?? null, createdAt: r.created_at,
  };
}

/** Teacher-facing fetch — refuses unless teacherId is the concern's assigned
 * homeroom teacher, matching the wellbeing.ts ownership-check pattern. */
export async function fetchConcernsForTeacher(teacherId: number): Promise<TutoringConcern[]> {
  const { data } = await supabaseAdmin.from('peer_tutoring_concerns').select('*').eq('homeroom_teacher_id', teacherId).order('created_at', { ascending: false });
  return (data ?? []).map(rowToConcern);
}

export async function acknowledgeConcern(concernId: number, teacherId: number): Promise<{ success: true } | { success: false; error: string }> {
  const { data: concern } = await supabaseAdmin.from('peer_tutoring_concerns').select('homeroom_teacher_id').eq('id', concernId).maybeSingle();
  if (!concern) return { success: false, error: 'Concern not found.' };
  if (concern.homeroom_teacher_id !== teacherId) return { success: false, error: 'Only the assigned homeroom teacher can acknowledge this.' };
  const { error } = await supabaseAdmin.from('peer_tutoring_concerns').update({ acknowledged_at: new Date().toISOString(), acknowledged_by: teacherId, status: 'in_progress' }).eq('id', concernId);
  return error ? { success: false, error: 'Failed to acknowledge.' } : { success: true };
}

export async function resolveConcern(concernId: number, teacherId: number, notes: string): Promise<{ success: true } | { success: false; error: string }> {
  const { data: concern } = await supabaseAdmin.from('peer_tutoring_concerns').select('homeroom_teacher_id').eq('id', concernId).maybeSingle();
  if (!concern) return { success: false, error: 'Concern not found.' };
  if (concern.homeroom_teacher_id !== teacherId) return { success: false, error: 'Only the assigned homeroom teacher can resolve this.' };
  const { error } = await supabaseAdmin.from('peer_tutoring_concerns').update({ status: 'resolved', resolution_notes: notes, resolved_at: new Date().toISOString() }).eq('id', concernId);
  return error ? { success: false, error: 'Failed to resolve.' } : { success: true };
}

// ── Teacher oversight: subject-teacher dashboard ────────────────────────────

export async function fetchRelationshipsForSubjectTeacher(teacherId: number): Promise<TutoringRelationship[]> {
  const { data } = await supabaseAdmin.from('peer_tutoring_relationships').select('*').eq('subject_teacher_id', teacherId).order('created_at', { ascending: false });
  return (data ?? []).map(rowToRelationship);
}

// ── Unmet requests: log + browse/fulfil ─────────────────────────────────────
// New feature (2026-07-20): a failed tutor search (findTutorMatches returns
// no eligible candidates) leaves the request row in 'open' status rather
// than losing it — it was already inserted by createTutoringRequest before
// matching runs, so "logging" an unmet request is simply *not* immediately
// matching it, not a separate insert. A tutor can later browse open requests
// for subjects/topics they're registered for and fulfil one directly.

/** Open requests for topics a given tutor is registered to tutor — the
 * browse view's data source. Requires the tutor to have completed
 * onboarding (orientation + conduct ack), same gate findTutorMatches()
 * already applies to search-based matching — reused here, not bypassed. */
export async function fetchOpenRequestsForTutor(tutorStudentId: number): Promise<TutoringRequest[]> {
  const profile = await fetchTutorProfile(tutorStudentId);
  if (!profile || !profile.isActive || !profile.orientationCompletedAt || !profile.conductAcknowledgedAt) return [];

  const topics = await fetchTutorTopics(profile.id);
  if (topics.length === 0) return [];

  const topicIds = topics.map((t) => t.topicId);
  const { data } = await supabaseAdmin
    .from('peer_tutoring_requests')
    .select('*')
    .in('topic_id', topicIds)
    .eq('status', 'open')
    .neq('student_id', tutorStudentId)
    .order('created_at', { ascending: true });
  return (data ?? []).map(rowToRequest);
}

/**
 * A tutor fulfils an open request directly from the browse view, creating a
 * relationship the same way a live search match does. Re-validates
 * eligibility via evaluateMatch (a request being old doesn't exempt it from
 * the same ability-gap/grade-difference rules a fresh search would apply)
 * and re-checks the request is still open (another tutor may have just
 * taken it) before creating the relationship.
 */
export async function fulfillRequest(
  requestId: number, tutorStudentId: number,
): Promise<{ success: true; relationship: TutoringRelationship } | { success: false; error: string }> {
  const { data: requestRow } = await supabaseAdmin.from('peer_tutoring_requests').select('*').eq('id', requestId).maybeSingle();
  if (!requestRow) return { success: false, error: 'Request not found.' };
  const request = rowToRequest(requestRow);
  if (request.status !== 'open') return { success: false, error: 'This request has already been taken by another tutor.' };

  const profile = await fetchTutorProfile(tutorStudentId);
  if (!profile || !profile.isActive || !profile.orientationCompletedAt || !profile.conductAcknowledgedAt) {
    return { success: false, error: 'Complete tutor orientation and the code of conduct before fulfilling requests.' };
  }

  const { data: tutorTopicRow } = await supabaseAdmin
    .from('peer_tutor_topics').select('demonstrated_score_pct')
    .eq('tutor_profile_id', profile.id).eq('topic_id', request.topicId).maybeSingle();
  if (!tutorTopicRow) return { success: false, error: 'You are not registered to tutor this topic.' };

  const { data: tuteeStudent } = await supabaseAdmin.from('students').select('id, grade, cohort_id').eq('id', request.studentId).maybeSingle();
  if (!tuteeStudent) return { success: false, error: 'Student not found.' };

  const { data: tutorStudent } = await supabaseAdmin.from('students').select('id, grade').eq('id', tutorStudentId).maybeSingle();
  if (!tutorStudent) return { success: false, error: 'Tutor not found.' };

  const { data: tuteeAttempts } = await supabaseAdmin
    .from('student_attempts').select('score_pct').eq('student_id', request.studentId).eq('topic_id', request.topicId)
    .not('submitted_at', 'is', null).order('submitted_at', { ascending: false }).limit(1);
  const tuteeScorePct = tuteeAttempts?.[0]?.score_pct ?? 0;

  const candidate: MatchCandidate = {
    tutorStudentId,
    tutorGrade: tutorStudent.grade,
    tutorScorePct: tutorTopicRow.demonstrated_score_pct,
    sameClassAsTutee: false,
    priorPositiveInteraction: false,
    timetableOverlapScore: 0,
  };
  const match = evaluateMatch(tuteeStudent.grade, tuteeScorePct, candidate);
  if (!match.eligible) {
    return { success: false, error: match.rejectionReason ?? 'You are not eligible to tutor this student on this topic.' };
  }

  return createRelationshipFromMatch(request, match);
}
