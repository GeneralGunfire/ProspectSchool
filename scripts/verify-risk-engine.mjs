// Read-only verification script — NOT part of the app bundle. Run with:
//   node scripts/verify-risk-engine.mjs
// Loads a handful of real students and prints their ABC risk profile using the
// exact same constants/logic as src/lib/riskEngine.ts (re-implemented inline
// since that module imports the Vite-env-based supabase client). Only ever
// SELECTs — no writes.

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

// ── constants mirrored from src/lib/riskEngine.ts ──
const ATTENDANCE_SEVERE_BELOW = 75;
const ATTENDANCE_MODERATE_BELOW = 85;
const BEHAVIOUR_SERIOUS_MIN_POINTS = 3;
const BEHAVIOUR_SEVERE_INCIDENTS = 2;
const BEHAVIOUR_MODERATE_INCIDENTS = 1;
const MINOR_PATTERN_COUNT = 4;
const RECENT_WINDOW_DAYS = 42;
const TERM_WINDOW_DAYS = 90;
const RECENCY_WEIGHT = 0.6;
const COURSE_WINDOW_ASSESSMENTS = 6;
const COURSE_MIN_ASSESSMENTS = 4;
const COURSE_DECLINE_SLOPE = -3;
const COURSE_VOLATILITY_RATIO = 0.4;
const COURSE_VOLATILITY_FLOOR = 40;
const COURSE_DEFAULT_BASELINE = 50;
const HIGH_RISK_TOTAL_MIN = 4;
const HIGH_RISK_MIN_DOMAINS = 2;
const MODERATE_RISK_TOTAL_MIN = 2;
const SEVERE_SINGLE_DOMAIN = 2;

function daysAgo(days, from) {
  const d = new Date(from);
  d.setDate(d.getDate() - days);
  return d.toISOString().split('T')[0];
}

function attendanceRate(rows) {
  const counted = rows.filter(r => r.status !== 'non_school_day');
  if (counted.length === 0) return null;
  const present = counted.filter(r => r.status === 'present' || r.status === 'late' || r.status === 'excused').length;
  return Math.round((present / counted.length) * 1000) / 10;
}

function attendanceSubScore(rate) {
  if (rate === null) return { score: 0, reason: null };
  if (rate < ATTENDANCE_SEVERE_BELOW) return { score: 2, reason: `Attendance ${rate}% — below ${ATTENDANCE_SEVERE_BELOW}%` };
  if (rate < ATTENDANCE_MODERATE_BELOW) return { score: 1, reason: `Attendance ${rate}% — below ${ATTENDANCE_MODERATE_BELOW}%` };
  return { score: 0, reason: null };
}

function behaviourSubScore(serious, minor) {
  if (serious >= BEHAVIOUR_SEVERE_INCIDENTS) return { score: 2, reason: `${serious} serious incidents` };
  if (serious >= BEHAVIOUR_MODERATE_INCIDENTS) return { score: 1, reason: `${serious} serious incidents` };
  if (minor >= MINOR_PATTERN_COUNT) return { score: 1, reason: `Repeated minor pattern (${minor})` };
  return { score: 0, reason: null };
}

function slopeOf(pcts) {
  const n = pcts.length;
  if (n < 2) return 0;
  const xs = pcts.map((_, i) => i);
  const xMean = xs.reduce((s, x) => s + x, 0) / n;
  const yMean = pcts.reduce((s, y) => s + y, 0) / n;
  let num = 0, den = 0;
  for (let i = 0; i < n; i++) { num += (xs[i] - xMean) * (pcts[i] - yMean); den += (xs[i] - xMean) ** 2; }
  return den === 0 ? 0 : num / den;
}

function scoreSubject(subjectId, subject, points, priorTermAvg) {
  const sorted = [...points].sort((a, b) => a.date.localeCompare(b.date));
  const window = sorted.slice(-COURSE_WINDOW_ASSESSMENTS);
  const avg = window.length > 0 ? Math.round(window.reduce((s, p) => s + p.pct, 0) / window.length) : 0;
  if (window.length < COURSE_MIN_ASSESSMENTS) return { subjectId, subject, score: 0, avg, slope: null, reasons: [] };

  const pcts = window.map(p => p.pct);
  const slope = Math.round(slopeOf(pcts) * 10) / 10;
  const baseline = priorTermAvg ?? COURSE_DEFAULT_BASELINE;
  const last4 = pcts.slice(-4);
  const belowBaselineCount = last4.filter(p => p < baseline).length;
  const mean = last4.reduce((s, p) => s + p, 0) / last4.length;
  const range = Math.max(...last4) - Math.min(...last4);
  const volatile = mean > 0 && (range / mean) >= COURSE_VOLATILITY_RATIO && Math.min(...last4) < COURSE_VOLATILITY_FLOOR;

  const reasons = [];
  let score = 0;
  const decliningHard = slope <= COURSE_DECLINE_SLOPE && belowBaselineCount >= 3;
  const decliningSoft = belowBaselineCount >= 3 && slope < 0;

  if (decliningHard) { score = 2; reasons.push(`${subject} trending down ${Math.abs(slope)}pp/assessment`); }
  else if (decliningSoft || volatile) {
    score = 1;
    if (decliningSoft) reasons.push(`${subject}: ${belowBaselineCount}/${last4.length} below baseline (${Math.round(baseline)}%), declining`);
    if (volatile) reasons.push(`${subject}: volatile (range ${Math.round(range)}pp) with a score below ${COURSE_VOLATILITY_FLOOR}%`);
  }
  return { subjectId, subject, score, avg, slope, reasons };
}

function combineTier(a, b, c) {
  const total = a + b + c;
  const domainsAtOne = [a, b, c].filter(s => s >= 1).length;
  const anySevere = a >= SEVERE_SINGLE_DOMAIN || b >= SEVERE_SINGLE_DOMAIN || c >= SEVERE_SINGLE_DOMAIN;
  if (total >= HIGH_RISK_TOTAL_MIN && domainsAtOne >= HIGH_RISK_MIN_DOMAINS) return { total, tier: 'high' };
  if (total >= MODERATE_RISK_TOTAL_MIN || anySevere) return { total, tier: 'moderate' };
  return { total, tier: 'none' };
}

async function computeStudentRisk(studentId, schoolId, todayStr) {
  const today = new Date(todayStr + 'T00:00:00');
  const recentCutoff = daysAgo(RECENT_WINDOW_DAYS, today);
  const termCutoff = daysAgo(TERM_WINDOW_DAYS, today);

  const [{ data: attRows }, { data: behRows }, { data: markRows }] = await Promise.all([
    supabase.from('attendance').select('status, date').eq('student_id', studentId),
    supabase.from('behaviour_points').select('type, points, created_at').eq('student_id', studentId),
    supabase.from('student_marks').select('mark, marked_at, created_at, mark_sheets(subject_id, total, term, created_at)').eq('student_id', studentId).eq('school_id', schoolId).not('mark', 'is', null),
  ]);

  const attendanceRows = attRows ?? [];
  const behaviourRows = behRows ?? [];

  const attRecentRows = attendanceRows.filter(r => r.date >= recentCutoff);
  const attTermRows = attendanceRows.filter(r => r.date >= termCutoff);
  const rateRecent = attendanceRate(attRecentRows);
  const rateTerm = attendanceRate(attTermRows);
  const attRecentSub = attendanceSubScore(rateRecent);
  const attTermSub = attendanceSubScore(rateTerm);
  const attendanceScoreWeighted = (rateRecent === null && rateTerm === null) ? 0 : RECENCY_WEIGHT * attRecentSub.score + (1 - RECENCY_WEIGHT) * attTermSub.score;
  const attendanceReasons = [attRecentSub.reason].filter(Boolean);
  if (attTermSub.reason && attTermSub.score > attRecentSub.score) attendanceReasons.push(attTermSub.reason + ' (term)');

  const behRecentRows = behaviourRows.filter(r => r.created_at >= recentCutoff);
  const behTermRows = behaviourRows.filter(r => r.created_at >= termCutoff);
  const seriousRecent = behRecentRows.filter(r => r.type === 'demerit' && r.points >= BEHAVIOUR_SERIOUS_MIN_POINTS).length;
  const minorRecent = behRecentRows.filter(r => r.type === 'demerit' && r.points < BEHAVIOUR_SERIOUS_MIN_POINTS).length;
  const seriousTerm = behTermRows.filter(r => r.type === 'demerit' && r.points >= BEHAVIOUR_SERIOUS_MIN_POINTS).length;
  const minorTerm = behTermRows.filter(r => r.type === 'demerit' && r.points < BEHAVIOUR_SERIOUS_MIN_POINTS).length;
  const behRecentSub = behaviourSubScore(seriousRecent, minorRecent);
  const behTermSub = behaviourSubScore(seriousTerm, minorTerm);
  const behaviourScoreWeighted = RECENCY_WEIGHT * behRecentSub.score + (1 - RECENCY_WEIGHT) * behTermSub.score;
  const behaviourReasons = [behRecentSub.reason].filter(Boolean);
  if (behTermSub.reason && behTermSub.score > behRecentSub.score) behaviourReasons.push(behTermSub.reason + ' (term)');

  const subjectIds = [...new Set((markRows ?? []).map(r => r.mark_sheets?.subject_id).filter(id => typeof id === 'number'))];
  const { data: subjectsData } = subjectIds.length > 0 ? await supabase.from('subjects').select('id, label').in('id', subjectIds) : { data: [] };
  const labelMap = new Map((subjectsData ?? []).map(s => [s.id, s.label]));

  const marksBySubject = new Map();
  const termsBySubject = new Map();
  for (const r of (markRows ?? [])) {
    const ms = r.mark_sheets;
    if (!ms) continue;
    const subjectId = ms.subject_id;
    const pct = (Number(r.mark) / Number(ms.total)) * 100;
    const date = r.marked_at ?? r.created_at;
    const term = ms.term;
    if (!marksBySubject.has(subjectId)) marksBySubject.set(subjectId, { label: labelMap.get(subjectId) ?? 'Unknown', points: [], priorTermAvg: null });
    marksBySubject.get(subjectId).points.push({ pct, date });
    if (!termsBySubject.has(subjectId)) termsBySubject.set(subjectId, new Map());
    const termMap = termsBySubject.get(subjectId);
    if (!termMap.has(term)) termMap.set(term, []);
    termMap.get(term).push(pct);
  }
  for (const [subjectId, entry] of marksBySubject) {
    const termMap = termsBySubject.get(subjectId);
    if (!termMap || termMap.size < 2) continue;
    const terms = [...termMap.keys()].sort((a, b) => b - a);
    const priorPcts = termMap.get(terms[1]) ?? [];
    if (priorPcts.length > 0) entry.priorTermAvg = Math.round(priorPcts.reduce((s, p) => s + p, 0) / priorPcts.length);
  }

  const courseSubjects = [];
  for (const [subjectId, { label, points, priorTermAvg }] of marksBySubject) {
    courseSubjects.push(scoreSubject(subjectId, label, points, priorTermAvg));
  }
  courseSubjects.sort((a, b) => b.score - a.score || a.avg - b.avg);
  const worstSubject = courseSubjects.length > 0 ? courseSubjects[0] : null;
  const courseScore = worstSubject?.score ?? 0;

  const { total, tier } = combineTier(attendanceScoreWeighted, behaviourScoreWeighted, courseScore);

  return {
    studentId,
    attendance: { score: Math.round(attendanceScoreWeighted * 10) / 10, reasons: attendanceReasons, rateRecent, rateTerm },
    behaviour: { score: Math.round(behaviourScoreWeighted * 10) / 10, reasons: behaviourReasons, seriousRecent, seriousTerm },
    course: { score: courseScore, worstSubject },
    courseSubjects,
    riskTotal: Math.round(total * 10) / 10,
    tier,
  };
}

async function main() {
  const { data: students } = await supabase.from('students').select('id, name, surname, grade, school_id').limit(500);
  if (!students || students.length === 0) { console.log('No students found.'); return; }

  const sample = students.slice(0, 15);
  const todayStr = new Date().toISOString().split('T')[0];

  console.log(`Scoring ${sample.length} students (of ${students.length} total)...\n`);

  const results = [];
  for (const s of sample) {
    const profile = await computeStudentRisk(s.id, s.school_id, todayStr);
    results.push({ student: s, profile });
  }

  results.sort((a, b) => b.profile.riskTotal - a.profile.riskTotal);

  for (const { student, profile } of results) {
    console.log(`--- ${student.surname}, ${student.name} (Gr ${student.grade}, id=${student.id}) ---`);
    console.log(`  Attendance: score=${profile.attendance.score}/2  recent=${profile.attendance.rateRecent}%  term=${profile.attendance.rateTerm}%  ${profile.attendance.reasons.join('; ') || '(no concern)'}`);
    console.log(`  Behaviour:  score=${profile.behaviour.score}/2  serious(recent/term)=${profile.behaviour.seriousRecent}/${profile.behaviour.seriousTerm}  ${profile.behaviour.reasons.join('; ') || '(no concern)'}`);
    console.log(`  Course:     score=${profile.course.score}/2  worst=${profile.course.worstSubject ? `${profile.course.worstSubject.subject} avg=${profile.course.worstSubject.avg}% slope=${profile.course.worstSubject.slope}` : 'n/a'}`);
    console.log(`  => R=${profile.riskTotal}  TIER=${profile.tier.toUpperCase()}`);
    console.log('');
  }

  const tierCounts = results.reduce((acc, r) => { acc[r.profile.tier] = (acc[r.profile.tier] ?? 0) + 1; return acc; }, {});
  console.log('Tier distribution (sample):', tierCounts);
}

main().catch(e => { console.error(e); process.exit(1); });
