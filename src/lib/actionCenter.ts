// ── Action Center ─────────────────────────────────────────────────────────────
// One inbox for everything needing a teacher's attention. Wraps the existing
// intelligence fetchers (fetchAtRiskStudents, fetchStaleInterventions,
// fetchAssessmentGaps) and persists them as durable, resolvable rows in
// teacher_actions so a teacher can dismiss what they've already handled
// instead of re-triaging the same list every visit.
//
// Table: teacher_actions (id, school_id, teacher_id, type, title, description,
//                          student_id, intervention_id, status, created_at, resolved_at)
//
// Dedup design: teacher_actions has no unique constraint (and CLAUDE.md's
// migration rule means we avoid adding one for this sprint), so dedup is done
// in application code via a namespaced context key stored in the `intervention_id`
// TEXT column (it has no FK constraint, verified against the migration — safe
// to reuse as a generic key):
//   risk              -> `risk:${studentId}:${subject}`
//   intervention_followup -> the real intervention id (also what the outcome
//                             modal resolves against)
//   assessment_gap    -> `gap:${subjectId}:${grade}`

import { supabaseAdmin } from './supabase';
import {
  fetchAtRiskStudents, fetchStaleInterventions, fetchAssessmentGaps,
  type AtRiskStudent, type StaleIntervention, type AssessmentGap,
} from './teacherAnalytics';

export type TeacherActionType =
  | 'risk' | 'intervention_followup' | 'assessment_gap'
  | 'homework_issue' | 'resource_opportunity';

export interface TeacherAction {
  id:             number;
  schoolId:       number;
  teacherId:      number;
  type:           TeacherActionType;
  title:          string;
  description:    string | null;
  studentId:      number | null;
  interventionId: string | null;
  status:         'open' | 'resolved';
  createdAt:      string;
  resolvedAt:     string | null;
}

export interface ActionCenterData {
  actions: TeacherAction[];
  atRisk:  AtRiskStudent[];
  stale:   StaleIntervention[];
  gaps:    AssessmentGap[];
}

function rowToAction(r: any): TeacherAction {
  return {
    id:             r.id,
    schoolId:       r.school_id,
    teacherId:      r.teacher_id,
    type:           r.type as TeacherActionType,
    title:          r.title,
    description:    r.description ?? null,
    studentId:      r.student_id ?? null,
    interventionId: r.intervention_id ?? null,
    status:         r.status,
    createdAt:      r.created_at,
    resolvedAt:     r.resolved_at ?? null,
  };
}

// ── Read / mutate ──────────────────────────────────────────────────────────────

export async function fetchOpenActions(teacherId: number): Promise<TeacherAction[]> {
  const { data, error } = await supabaseAdmin
    .from('teacher_actions')
    .select('*')
    .eq('teacher_id', teacherId)
    .eq('status', 'open')
    .order('created_at', { ascending: false })
    .limit(50);

  if (error || !data) return [];
  return data.map(rowToAction);
}

export async function resolveAction(actionId: number): Promise<void> {
  const { error } = await supabaseAdmin
    .from('teacher_actions')
    .update({ status: 'resolved', resolved_at: new Date().toISOString() })
    .eq('id', actionId);

  if (error) console.error('[actionCenter] resolve error:', error.message);
}

// The schema only has open/resolved — "dismiss" is semantic sugar over the
// same resolve path (a teacher choosing to not act is still a resolution).
export const dismissAction = resolveAction;

// Resolves any open follow-up action tied to a specific intervention — called
// after an outcome is recorded so the Action Center row disappears immediately
// rather than waiting for the next sync's reconcile pass.
export async function resolveActionsForIntervention(interventionId: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from('teacher_actions')
    .update({ status: 'resolved', resolved_at: new Date().toISOString() })
    .eq('intervention_id', interventionId)
    .eq('status', 'open');

  if (error) console.error('[actionCenter] resolveActionsForIntervention error:', error.message);
}

// ── Sync — derive + persist actions from current intelligence ─────────────────

// Exported so UI code building a dismiss lookup uses the exact same key
// format as the sync, instead of duplicating the string shape and risking drift.
export function riskKey(studentId: number, subject: string): string {
  return `risk:${studentId}:${subject}`;
}
export function gapKey(subjectId: number, grade: number): string {
  return `gap:${subjectId}:${grade}`;
}

export async function syncTeacherActions(
  teacherId: number,
  schoolId:  number,
): Promise<ActionCenterData> {
  const [atRisk, stale, gaps, openActions] = await Promise.all([
    fetchAtRiskStudents(teacherId, schoolId),
    fetchStaleInterventions(teacherId, schoolId),
    fetchAssessmentGaps(teacherId, schoolId),
    fetchOpenActions(teacherId),
  ]);

  const openKeys = new Set(openActions.map(a => a.interventionId).filter((k): k is string => !!k));

  type Candidate = {
    key: string;
    type: TeacherActionType;
    title: string;
    description: string;
    studentId: number | null;
  };

  const candidates: Candidate[] = [];

  for (const s of atRisk) {
    candidates.push({
      key:         riskKey(s.studentId, s.subject),
      type:        'risk',
      title:       `${s.surname}, ${s.name}`,
      description: s.detail,
      studentId:   s.studentId,
    });
  }

  for (const s of stale) {
    candidates.push({
      key:         s.interventionId,
      type:        'intervention_followup',
      title:       `${s.studentSurname}, ${s.studentName}`,
      description: s.reason === 'awaiting_outcome'
        ? `${s.subject} · ${s.typeLabel} · completed — record outcome`
        : `${s.subject} · ${s.typeLabel} · active ${s.staleDays}d — check in`,
      studentId:   s.studentId,
    });
  }

  for (const g of gaps) {
    candidates.push({
      key:         gapKey(g.subjectId, g.grade),
      type:        'assessment_gap',
      title:       `${g.subject} · Gr ${g.grade}`,
      description: `Last assessed ${g.daysSinceLast}d ago`,
      studentId:   null,
    });
  }

  const candidateKeys = new Set(candidates.map(c => c.key));
  const toInsert = candidates.filter(c => !openKeys.has(c.key));

  if (toInsert.length > 0) {
    const { error } = await supabaseAdmin.from('teacher_actions').insert(
      toInsert.map(c => ({
        school_id:       schoolId,
        teacher_id:      teacherId,
        type:            c.type,
        title:           c.title,
        description:     c.description,
        student_id:      c.studentId,
        intervention_id: c.key,
        status:          'open',
      })),
    );
    if (error) console.error('[actionCenter] insert error:', error.message);
  }

  // Reconcile: auto-resolve open auto-generated actions whose underlying
  // condition has cleared (e.g. the outcome got recorded, or the student's
  // average recovered). Manual/homework/resource-type rows are left alone —
  // this reconcile only ever touches the three auto types.
  // Note: if the condition is still present next sync, the row is simply
  // re-created — an action that gets resolved but reappears because the
  // problem persists is correct behavior, not a bug.
  const AUTO_TYPES: TeacherActionType[] = ['risk', 'intervention_followup', 'assessment_gap'];
  const staleOpenIds = openActions
    .filter(a =>
      AUTO_TYPES.includes(a.type) &&
      a.interventionId &&
      !candidateKeys.has(a.interventionId),
    )
    .map(a => a.id);

  if (staleOpenIds.length > 0) {
    const { error } = await supabaseAdmin
      .from('teacher_actions')
      .update({ status: 'resolved', resolved_at: new Date().toISOString() })
      .in('id', staleOpenIds);
    if (error) console.error('[actionCenter] reconcile error:', error.message);
  }

  const actions = (toInsert.length > 0 || staleOpenIds.length > 0)
    ? await fetchOpenActions(teacherId)
    : openActions;

  return { actions, atRisk, stale, gaps };
}
