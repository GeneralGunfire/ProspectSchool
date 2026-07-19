// Verifies detectRoutineAlert against constructed cases from
// .planning/research/WELLBEING_FEATURE_RESEARCH.md section 3.
// Pure-function test — no DB needed, mirrors verify-risk-engine-synthetic.mjs.
// Logic duplicated (not imported) from src/lib/wellbeing.ts, same reason as
// verify-risk-engine-synthetic.mjs: src/lib/wellbeing.ts transitively imports
// src/lib/supabase.ts, which reads import.meta.env (Vite-only) at module
// load time and throws under plain Node/tsx. Keep this in sync by hand if
// the thresholds or detectRoutineAlert logic change.

const PHQ2_FLAG_MIN = 3;
const GAD2_FLAG_MIN = 3;
const SUSTAINED_ELEVATION_MIN_CHECKINS = 2;
const SUSTAINED_ELEVATION_WINDOW_DAYS = 14;
const MARKED_DECLINE_POINTS = 4;
const MARKED_DECLINE_MIN_CURRENT = 6;
const NEW_HIGH_DISTRESS_MIN = 9;
const BASELINE_CHECKIN_COUNT = 5;

function scoreCheckin(a) {
  const phq2 = a.phqDownInterest + a.phqHopeless;
  const gad2 = a.gadNervous + a.gadWorry;
  return { phq2, gad2, phq4: phq2 + gad2 };
}

function median(nums) {
  if (nums.length === 0) return 0;
  const sorted = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

function detectRoutineAlert(history) {
  if (history.length === 0) return null;
  const sorted = [...history].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  const latest = sorted[sorted.length - 1];

  const baselineSource = sorted.slice(0, Math.max(1, sorted.length - 1)).slice(0, BASELINE_CHECKIN_COUNT);
  const baselinePhq4 = baselineSource.length > 0 ? median(baselineSource.map(c => c.phq4Score)) : latest.phq4Score;

  const priorHadHighDistress = sorted.slice(0, -1).some(c => c.phq4Score >= NEW_HIGH_DISTRESS_MIN);
  if (latest.phq4Score >= NEW_HIGH_DISTRESS_MIN && !priorHadHighDistress) {
    return { alertType: 'new_high_distress', triggeringCheckinIds: [latest.id] };
  }

  const drop = baselinePhq4 - latest.phq4Score;
  if (drop >= MARKED_DECLINE_POINTS && latest.phq4Score >= MARKED_DECLINE_MIN_CURRENT) {
    return { alertType: 'marked_decline', triggeringCheckinIds: [latest.id] };
  }

  const windowStart = new Date(new Date(latest.createdAt).getTime() - SUSTAINED_ELEVATION_WINDOW_DAYS * 86400000).toISOString();
  const recentWindow = sorted.filter(c => c.createdAt >= windowStart);
  const elevatedInWindow = recentWindow.filter(c => c.phq2Score >= PHQ2_FLAG_MIN || c.gad2Score >= GAD2_FLAG_MIN);

  if (elevatedInWindow.length >= SUSTAINED_ELEVATION_MIN_CHECKINS) {
    return { alertType: 'sustained_elevation', triggeringCheckinIds: elevatedInWindow.map(c => c.id) };
  }

  return null;
}

let pass = 0, fail = 0;
function check(name, actual, expected) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  console.log(`${ok ? 'PASS' : 'FAIL'} — ${name}`);
  if (!ok) { console.log('  expected:', expected, '\n  actual:  ', actual); fail++; } else pass++;
}

function mkCheckin(id, daysAgo, phqDown, phqHopeless, gadNervous, gadWorry) {
  const { phq2, gad2, phq4 } = scoreCheckin({ phqDownInterest: phqDown, phqHopeless, gadNervous, gadWorry, safetyResponse: 0 });
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return {
    id, studentId: 1, schoolId: 1,
    phqDownInterest: phqDown, phqHopeless, gadNervous, gadWorry,
    phq2Score: phq2, gad2Score: gad2, phq4Score: phq4,
    safetyResponse: 0,
    createdAt: d.toISOString(),
  };
}

// ── Case 1: 2 elevated check-ins within 14 days -> sustained_elevation ──
{
  const history = [
    mkCheckin(1, 10, 2, 2, 0, 0), // PHQ-2 = 4 (elevated)
    mkCheckin(2, 3,  2, 2, 0, 0), // PHQ-2 = 4 (elevated)
  ];
  const result = detectRoutineAlert(history);
  check('2 elevated check-ins in 14 days -> sustained_elevation', result?.alertType, 'sustained_elevation');
}

// ── Case 2: single elevated check-in that returns to baseline -> no alert ──
{
  const history = [
    mkCheckin(1, 20, 0, 0, 0, 0), // baseline low
    mkCheckin(2, 10, 2, 2, 0, 0), // one elevated check-in (PHQ-2=4)
    mkCheckin(3, 2,  0, 0, 0, 0), // back to baseline
  ];
  const result = detectRoutineAlert(history);
  check('single elevated check-in returning to baseline -> no alert', result, null);
}

// ── Case 3a: decline below MARKED_DECLINE_MIN_CURRENT does not trigger ──
{
  const history = [
    mkCheckin(1, 40, 3, 3, 3, 3), // phq4 = 12 (baseline pool)
    mkCheckin(2, 30, 3, 2, 3, 2), // phq4 = 10
    mkCheckin(3, 20, 2, 3, 2, 3), // phq4 = 10
    mkCheckin(4, 1,  1, 1, 1, 1), // phq4 = 4 -- NOT >= 6, so should NOT trigger marked_decline
  ];
  const result = detectRoutineAlert(history);
  check('decline below MARKED_DECLINE_MIN_CURRENT does not trigger marked_decline', result?.alertType !== 'marked_decline', true);
}
// ── Case 3b: 4pt drop from baseline, still >= 6 -> marked_decline ──
{
  const history = [
    mkCheckin(1, 40, 3, 3, 2, 2), // phq4 = 10 (baseline pool)
    mkCheckin(2, 30, 3, 3, 2, 2), // phq4 = 10
    mkCheckin(3, 20, 3, 3, 2, 2), // phq4 = 10
    mkCheckin(4, 1,  2, 1, 1, 2), // phq4 = 6 -- drop of 4, still >= 6 -> marked_decline
  ];
  const result = detectRoutineAlert(history);
  check('4pt drop from baseline(10) to 6 -> marked_decline', result?.alertType, 'marked_decline');
}

// ── Case 4: new high distress — first time PHQ-4 >= 9 ──
{
  const history = [
    mkCheckin(1, 10, 1, 1, 1, 1), // phq4 = 4
    mkCheckin(2, 1,  3, 3, 2, 1), // phq4 = 9 -- first time >= 9
  ];
  const result = detectRoutineAlert(history);
  check('first PHQ-4 >= 9 -> new_high_distress', result?.alertType, 'new_high_distress');
}

// ── Case 5: PHQ-4 >= 9 again (not first time) -> should NOT re-trigger ──
{
  const history = [
    mkCheckin(1, 20, 3, 3, 2, 1), // phq4 = 9 (first high distress)
    mkCheckin(2, 10, 3, 3, 2, 1), // phq4 = 9 again
    mkCheckin(3, 1,  3, 3, 2, 1), // phq4 = 9 again -- not "new" anymore
  ];
  const result = detectRoutineAlert(history);
  check('repeated high distress does not re-trigger new_high_distress', result?.alertType !== 'new_high_distress', true);
}

// ── Case 6: single check-in ever, PHQ-4 = 9 -> new_high_distress (first-ever) ──
{
  const history = [mkCheckin(1, 0, 3, 3, 2, 1)]; // phq4 = 9
  const result = detectRoutineAlert(history);
  check('single first-ever check-in at PHQ-4=9 -> new_high_distress', result?.alertType, 'new_high_distress');
}

// ── Case 7: elevated check-ins outside the 14-day window don't count ──
{
  const history = [
    mkCheckin(1, 30, 2, 2, 0, 0), // elevated, but 30 days ago (outside window)
    mkCheckin(2, 3,  2, 2, 0, 0), // elevated, recent
  ];
  const result = detectRoutineAlert(history);
  check('only 1 elevated check-in within 14-day window -> no sustained_elevation', result?.alertType !== 'sustained_elevation', true);
}

// ── Case 8: safety-item response is separate from routine scoring (sanity check) ──
{
  const s = scoreCheckin({ phqDownInterest: 3, phqHopeless: 3, gadNervous: 3, gadWorry: 3, safetyResponse: 2 });
  check('PHQ-4 scoring ignores safetyResponse', s.phq4, 12);
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail > 0 ? 1 : 0);
