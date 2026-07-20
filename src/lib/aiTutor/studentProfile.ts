// ── AI Tutor student_profile builder (research section 4) ────────────────────
// Pulls the student's most recent 1-2 misconceptions for the CURRENT topic
// only, from the existing Topic Tests v2 tables — deliberately narrow, not
// full history (research section 4: "Most recent 1-2 misconceptions for the
// current topic is the right trade-off for a demo... full history across all
// topics is likely noise and wastes tokens").
//
// This only works for topics that exist in the Topic Tests v2 `topics` table
// (topic_key matches). For subjects/topics with no Topic Test coverage yet,
// there is no misconception history to pull — student_profile is built with
// an empty list, which systemPrompt.ts already renders as "None recorded yet".

import { supabaseAdmin } from '../supabase';
import type { StudentProfileContext } from './systemPrompt';

const RECENT_MISCONCEPTIONS_LIMIT = 2;

export async function buildStudentProfile(params: {
  studentId: number;
  grade: number;
  subject: string;
  topicKey: string | null;
  topicLabel: string;
}): Promise<StudentProfileContext> {
  const { studentId, grade, subject, topicKey, topicLabel } = params;

  const base: StudentProfileContext = { grade, subject, topicLabel, recentMisconceptions: [] };
  if (!topicKey) return base;

  // Resolve topic_key -> topics.id (may not exist if this subject/topic has no
  // Topic Tests v2 coverage yet).
  const { data: topicRow } = await supabaseAdmin
    .from('topics')
    .select('id')
    .eq('topic_key', topicKey)
    .eq('grade', grade)
    .maybeSingle();
  if (!topicRow) return base;

  // Find this student's most recent attempts for this topic.
  const { data: attempts } = await supabaseAdmin
    .from('student_attempts')
    .select('id')
    .eq('student_id', studentId)
    .eq('topic_id', topicRow.id)
    .order('submitted_at', { ascending: false, nullsFirst: false })
    .limit(5);
  if (!attempts || attempts.length === 0) return base;

  const attemptIds = attempts.map((a: { id: number }) => a.id);
  const { data: answers } = await supabaseAdmin
    .from('attempt_answers')
    .select('misconception_id')
    .in('attempt_id', attemptIds)
    .not('misconception_id', 'is', null)
    .order('id', { ascending: false })
    .limit(20);
  if (!answers || answers.length === 0) return base;

  const misconceptionIds = [...new Set(answers.map((a: { misconception_id: number }) => a.misconception_id))].slice(
    0,
    RECENT_MISCONCEPTIONS_LIMIT,
  );
  if (misconceptionIds.length === 0) return base;

  const { data: misconceptions } = await supabaseAdmin
    .from('misconceptions')
    .select('code, label, description')
    .in('id', misconceptionIds);

  return {
    ...base,
    recentMisconceptions: (misconceptions ?? []).map((m: { code: string; label: string; description: string | null }) => ({
      code: m.code,
      label: m.label,
      description: m.description ?? '',
    })),
  };
}
