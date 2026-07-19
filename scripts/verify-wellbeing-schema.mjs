// Read-only verification script — NOT part of the app bundle. Run with:
//   node scripts/verify-wellbeing-schema.mjs
// Confirms the wellbeing_* tables exist with the expected columns after the
// hand-run migration (.planning/sql/2026-07-19_wellbeing_checkins.sql).
// Only ever SELECTs (a zero-row select against each table) — never reads or
// writes real student/parent/teacher data.

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
  wellbeing_checkins: ['id', 'student_id', 'school_id', 'phq_down_interest', 'phq_hopeless', 'gad_nervous', 'gad_worry', 'phq2_score', 'gad2_score', 'phq4_score', 'safety_response', 'created_at'],
  wellbeing_safety_flags: ['id', 'checkin_id', 'student_id', 'school_id', 'safety_response', 'homeroom_teacher_id', 'acknowledged_at', 'acknowledged_by', 'first_contact_at', 'first_contact_notes', 'created_at'],
  wellbeing_routine_alerts: ['id', 'student_id', 'school_id', 'homeroom_teacher_id', 'alert_type', 'reasons', 'triggering_checkin_ids', 'status', 'snoozed_until', 'addressed_at', 'addressed_by', 'addressed_notes', 'created_at'],
  wellbeing_access_log: ['id', 'student_id', 'school_id', 'accessor_teacher_id', 'access_type', 'accessed_at'],
  wellbeing_parent_consents: ['id', 'student_id', 'school_id', 'parent_id', 'decision', 'recorded_at'],
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

// Row counts (read-only, aggregate only — no individual data printed).
console.log('\nRow counts (should be 0 — feature not yet used by real accounts):');
for (const table of Object.keys(TABLES)) {
  const { count, error } = await supabase.from(table).select('id', { count: 'exact', head: true });
  console.log(`  ${table}: ${error ? 'ERROR: ' + error.message : count}`);
}

console.log(allOk ? '\nAll wellbeing tables verified.' : '\nSome tables failed verification — see above.');
process.exit(allOk ? 0 : 1);
