import { supabaseAdmin } from './supabase';
import { getStudentSession } from './auth';
import type { QuizResults } from '../features/careers/data/quizScoringLogic';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface StoredQuizResult {
  student_id: number;
  school_id: number;
  answers: { questionId: string; value: number }[];
  top_codes: string[];
  percentages: Record<string, number>;
  profile_desc: string | null;
  completed_at: string;
  updated_at: string;
}

export interface StoredApsScore {
  student_id: number;
  school_id: number;
  aps: number;
  subjects: { code: string; percent: number }[];
  calculated_at: string;
  updated_at: string;
}

// ── Quiz ──────────────────────────────────────────────────────────────────────

export async function saveQuizResults(
  answers: { questionId: string; value: number }[],
  results: QuizResults,
): Promise<void> {
  const session = getStudentSession();
  if (!session) return;

  await supabaseAdmin
    .from('student_quiz_results')
    .upsert({
      student_id: session.student_id,
      school_id: session.school_id,
      answers,
      top_codes: results.topCodes,
      percentages: results.percentages,
      profile_desc: results.profileDescription ?? null,
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, { onConflict: 'student_id' });
}

export async function fetchQuizResults(
  student_id: number,
  school_id: number,
): Promise<StoredQuizResult | null> {
  const { data } = await supabaseAdmin
    .from('student_quiz_results')
    .select('*')
    .eq('student_id', student_id)
    .eq('school_id', school_id)
    .maybeSingle();

  return data ?? null;
}

// ── APS ───────────────────────────────────────────────────────────────────────

export async function saveApsScore(
  aps: number,
  subjects: { code: string; percent: number }[],
): Promise<void> {
  const session = getStudentSession();
  if (!session) return;

  await supabaseAdmin
    .from('student_aps_scores')
    .upsert({
      student_id: session.student_id,
      school_id: session.school_id,
      aps,
      subjects,
      calculated_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, { onConflict: 'student_id' });
}

export async function fetchApsScore(
  student_id: number,
  school_id: number,
): Promise<StoredApsScore | null> {
  const { data } = await supabaseAdmin
    .from('student_aps_scores')
    .select('*')
    .eq('student_id', student_id)
    .eq('school_id', school_id)
    .maybeSingle();

  return data ?? null;
}

// ── Saved Bursaries ───────────────────────────────────────────────────────────

export async function toggleSavedBursary(bursaryId: string): Promise<boolean> {
  // returns true = now saved, false = now unsaved
  const session = getStudentSession();
  if (!session) return false;

  const { data: existing } = await supabaseAdmin
    .from('student_saved_bursaries')
    .select('id')
    .eq('student_id', session.student_id)
    .eq('bursary_id', bursaryId)
    .maybeSingle();

  if (existing) {
    await supabaseAdmin
      .from('student_saved_bursaries')
      .delete()
      .eq('student_id', session.student_id)
      .eq('bursary_id', bursaryId);
    return false;
  } else {
    await supabaseAdmin
      .from('student_saved_bursaries')
      .insert({
        student_id: session.student_id,
        school_id: session.school_id,
        bursary_id: bursaryId,
        saved_at: new Date().toISOString(),
      });
    return true;
  }
}

export async function fetchSavedBursaryIds(
  student_id: number,
  school_id: number,
): Promise<string[]> {
  const { data } = await supabaseAdmin
    .from('student_saved_bursaries')
    .select('bursary_id')
    .eq('student_id', student_id)
    .eq('school_id', school_id);

  return (data ?? []).map((r: { bursary_id: string }) => r.bursary_id);
}

export async function isBursarySaved(bursaryId: string): Promise<boolean> {
  const session = getStudentSession();
  if (!session) return false;

  const { data } = await supabaseAdmin
    .from('student_saved_bursaries')
    .select('id')
    .eq('student_id', session.student_id)
    .eq('bursary_id', bursaryId)
    .maybeSingle();

  return !!data;
}
