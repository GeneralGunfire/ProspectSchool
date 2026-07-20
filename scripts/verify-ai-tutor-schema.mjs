// Read-only verification script — NOT part of the app bundle. Run with:
//   node scripts/verify-ai-tutor-schema.mjs
// Confirms the ai_tutor_* tables + question_meta exist with the expected
// columns after the hand-run migration (.planning/sql/2026-07-20_ai_tutor.sql).
// Only ever SELECTs (a zero-row select against each table) — never reads or
// writes real student data.

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
  ai_tutor_conversations: ['id', 'student_id', 'school_id', 'subject', 'grade', 'term', 'topic_key', 'topic_label', 'entry_point', 'source_attempt_id', 'source_question_id', 'created_at', 'last_message_at'],
  ai_tutor_messages: ['id', 'conversation_id', 'role', 'content', 'metadata', 'created_at'],
  ai_tutor_interaction_logs: ['id', 'conversation_id', 'message_id', 'student_id', 'school_id', 'subject', 'topic_key', 'grounding_mode', 'misconception_codes', 'refusal_triggered', 'moderation_blocked', 'created_at'],
  ai_tutor_flagged_content: ['id', 'conversation_id', 'student_id', 'school_id', 'raw_input', 'category', 'reviewed', 'created_at'],
  question_meta: ['question_id', 'is_graded_assignment', 'is_past_paper', 'assessment_weight', 'created_at'],
};

let allOk = true;

for (const [table, expectedCols] of Object.entries(TABLES)) {
  const { error } = await supabase.from(table).select(expectedCols.join(',')).limit(0);
  if (error) {
    console.log(`FAIL — ${table}: ${error.message}`);
    allOk = false;
  } else {
    console.log(`PASS — ${table} exists with all expected columns`);
  }
}

console.log('\nRow counts (should be 0 — feature not yet used by real accounts):');
for (const table of Object.keys(TABLES)) {
  const idCol = table === 'question_meta' ? 'question_id' : 'id';
  const { count, error } = await supabase.from(table).select(idCol, { count: 'exact', head: true });
  console.log(`  ${table}: ${error ? 'ERROR: ' + error.message : count}`);
}

console.log(allOk ? '\nAll AI Tutor tables verified.' : '\nSome tables failed verification — see above.');
process.exit(allOk ? 0 : 1);
