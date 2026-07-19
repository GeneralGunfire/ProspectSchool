// Read-only verification script — NOT part of the app bundle. Run with:
//   node scripts/verify-peer-tutoring-schema.mjs
// Confirms the peer_tutor_*/peer_tutoring_* tables exist with the expected
// columns after the hand-run migration (.planning/sql/2026-07-19_peer_tutoring.sql).
// Only ever SELECTs (a zero-row select against each table) — never reads or
// writes real student/teacher data.

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const envText = readFileSync(new URL('../.env.local', import.meta.url), 'utf8');
const env = Object.fromEntries(
  envText.split('\n')
    .map(l => l.trim())
    .filter(l => l && !l.startsWith('#') && l.includes('='))
    .map(l => { const i = l.indexOf('='); return [l.slice(0, i), l.slice(i + 1)]; })
);

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_SERVICE_ROLE_KEY);

const TABLES = {
  peer_tutor_profiles: ['id', 'student_id', 'school_id', 'orientation_completed_at', 'conduct_acknowledged_at', 'prefers_known_students', 'is_active', 'created_at'],
  peer_tutor_topics: ['id', 'tutor_profile_id', 'subject_id', 'topic_id', 'demonstrated_score_pct', 'created_at'],
  peer_tutoring_requests: ['id', 'student_id', 'school_id', 'subject_id', 'topic_id', 'conduct_acknowledged_at', 'prefers_known_students', 'status', 'created_at'],
  peer_tutoring_relationships: [
    'id', 'school_id', 'tutor_student_id', 'tutee_student_id', 'subject_id', 'topic_id',
    'tutor_score_pct_at_match', 'tutee_score_pct_at_match', 'ability_gap', 'grade_difference', 'gap_category',
    'requires_approval', 'approved_by', 'approved_at', 'subject_teacher_id', 'pre_score_pct', 'pre_score_attempt_id',
    'status', 'started_at', 'ended_at', 'created_at',
  ],
  peer_tutoring_outcomes: ['id', 'relationship_id', 'pre_score_pct', 'post_score_pct', 'post_score_attempt_id', 'gain', 'result', 'verified_session_count', 'recorded_at'],
  peer_tutoring_sessions: [
    'id', 'relationship_id', 'school_id', 'scheduled_for', 'started_at', 'ended_at', 'template_progress',
    'goal_text', 'tutee_confidence_before', 'tutee_confidence_after', 'tutee_confirmed_at', 'tutee_confirmation',
    'tutee_confirmation_comment', 'status', 'created_at',
  ],
  peer_tutor_badges: ['id', 'student_id', 'school_id', 'tier', 'verified_session_count_at_award', 'awarded_at'],
  peer_tutoring_concerns: [
    'id', 'school_id', 'relationship_id', 'session_id', 'reported_by_student_id', 'about_student_id', 'category',
    'description', 'homeroom_teacher_id', 'status', 'acknowledged_at', 'acknowledged_by', 'resolution_notes',
    'resolved_at', 'created_at',
  ],
  peer_tutoring_prior_pairs: ['id', 'student_a_id', 'student_b_id', 'relationship_id', 'was_positive', 'created_at'],
};

let allOk = true;

for (const [table, expectedCols] of Object.entries(TABLES)) {
  const { data, error } = await supabase.from(table).select(expectedCols.join(',')).limit(0);
  if (error) {
    console.log(`FAIL — ${table}: ${error.message}`);
    allOk = false;
  } else {
    console.log(`PASS — ${table} exists with all expected columns`);
  }
}

console.log('\nRow counts (should be 0 — feature not yet used by real accounts):');
for (const table of Object.keys(TABLES)) {
  const { count, error } = await supabase.from(table).select('id', { count: 'exact', head: true });
  console.log(`  ${table}: ${error ? 'ERROR: ' + error.message : count}`);
}

console.log(allOk ? '\nAll peer tutoring tables verified.' : '\nSome tables failed verification — see above.');
process.exit(allOk ? 0 : 1);
