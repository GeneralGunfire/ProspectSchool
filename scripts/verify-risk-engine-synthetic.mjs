// Synthetic sanity check — no DB access. Exercises the same scoring logic as
// verify-risk-engine.mjs (mirrors src/lib/riskEngine.ts) against hand-built
// inputs, since the live dev database currently has no present/absent,
// behaviour, or mark data to exercise the non-trivial branches.

const ATTENDANCE_SEVERE_BELOW = 75;
const ATTENDANCE_MODERATE_BELOW = 85;
const BEHAVIOUR_SERIOUS_MIN_POINTS = 3;
const BEHAVIOUR_SEVERE_INCIDENTS = 2;
const BEHAVIOUR_MODERATE_INCIDENTS = 1;
const MINOR_PATTERN_COUNT = 4;
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
function scoreSubject(subject, points, priorTermAvg) {
  const sorted = [...points].sort((a, b) => a.date.localeCompare(b.date));
  const window = sorted.slice(-COURSE_WINDOW_ASSESSMENTS);
  const avg = window.length > 0 ? Math.round(window.reduce((s, p) => s + p.pct, 0) / window.length) : 0;
  if (window.length < COURSE_MIN_ASSESSMENTS) return { subject, score: 0, avg, slope: null, reasons: [] };
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
  return { subject, score, avg, slope, reasons };
}
function combineTier(a, b, c) {
  const total = a + b + c;
  const domainsAtOne = [a, b, c].filter(s => s >= 1).length;
  const anySevere = a >= SEVERE_SINGLE_DOMAIN || b >= SEVERE_SINGLE_DOMAIN || c >= SEVERE_SINGLE_DOMAIN;
  if (total >= HIGH_RISK_TOTAL_MIN && domainsAtOne >= HIGH_RISK_MIN_DOMAINS) return { total, tier: 'high' };
  if (total >= MODERATE_RISK_TOTAL_MIN || anySevere) return { total, tier: 'moderate' };
  return { total, tier: 'none' };
}

function runCase(name, { attRecentRows, attTermRows, behRecent, behMinorRecent, behTerm, behMinorTerm, subjects }) {
  const attR = attendanceSubScore(attendanceRate(attRecentRows));
  const attT = attendanceSubScore(attendanceRate(attTermRows));
  const attScore = Math.round((RECENCY_WEIGHT * attR.score + (1 - RECENCY_WEIGHT) * attT.score) * 10) / 10;

  const behR = behaviourSubScore(behRecent, behMinorRecent);
  const behT = behaviourSubScore(behTerm, behMinorTerm);
  const behScore = Math.round((RECENCY_WEIGHT * behR.score + (1 - RECENCY_WEIGHT) * behT.score) * 10) / 10;

  const scored = subjects.map(s => scoreSubject(s.name, s.points, s.priorTermAvg));
  scored.sort((a, b) => b.score - a.score || a.avg - b.avg);
  const worst = scored[0];
  const courseScore = worst?.score ?? 0;

  const { total, tier } = combineTier(attScore, behScore, courseScore);

  console.log(`--- ${name} ---`);
  console.log(`  Attendance: ${attScore}/2 (recent rate=${attendanceRate(attRecentRows)}%, term rate=${attendanceRate(attTermRows)}%) ${attR.reason ?? ''}`);
  console.log(`  Behaviour:  ${behScore}/2 (serious recent=${behRecent}, term=${behTerm}) ${behR.reason ?? ''}`);
  console.log(`  Course:     ${courseScore}/2 worst=${worst ? `${worst.subject} avg=${worst.avg}% slope=${worst.slope}` : 'n/a'} ${worst?.reasons.join('; ') ?? ''}`);
  console.log(`  => R=${Math.round(total*10)/10}  TIER=${tier.toUpperCase()}`);
  console.log('');
}

const mkRows = (n, status, daysBack) => Array.from({ length: n }, (_, i) => ({ status, date: `day-${daysBack - i}` }));

// Case 1: chronic absenteeism only (single domain severe) -> Moderate, not High
runCase('Case 1: Attendance 68% only, nothing else', {
  attRecentRows: [...mkRows(20, 'present', 42), ...mkRows(20, 'absent', 22)],
  attTermRows:   [...mkRows(50, 'present', 90), ...mkRows(35, 'absent', 40)],
  behRecent: 0, behMinorRecent: 0, behTerm: 0, behMinorTerm: 0,
  subjects: [],
});

// Case 2: attendance moderate (80%) + 1 serious behaviour + declining Maths -> High
runCase('Case 2: Attendance 80%, 1 serious incident, Maths declining', {
  attRecentRows: [...mkRows(34, 'present', 42), ...mkRows(8, 'absent', 42)],
  attTermRows:   [...mkRows(72, 'present', 90), ...mkRows(18, 'absent', 90)],
  behRecent: 1, behMinorRecent: 0, behTerm: 1, behMinorTerm: 0,
  subjects: [{
    name: 'Mathematics', priorTermAvg: 65,
    points: [
      { date: 'a1', pct: 68 }, { date: 'a2', pct: 60 },
      { date: 'a3', pct: 52 }, { date: 'a4', pct: 44 },
    ],
  }],
});

// Case 3: everything fine
runCase('Case 3: On track', {
  attRecentRows: mkRows(40, 'present', 42),
  attTermRows: mkRows(85, 'present', 90),
  behRecent: 0, behMinorRecent: 0, behTerm: 0, behMinorTerm: 0,
  subjects: [{
    name: 'English', priorTermAvg: 70,
    points: [{ date: 'a1', pct: 72 }, { date: 'a2', pct: 75 }, { date: 'a3', pct: 78 }, { date: 'a4', pct: 80 }],
  }],
});

// Case 4: only course performance severely declining, nothing else -> Moderate (severe single domain), not High
runCase('Case 4: Only Physics collapsing, attendance/behaviour fine', {
  attRecentRows: mkRows(40, 'present', 42),
  attTermRows: mkRows(85, 'present', 90),
  behRecent: 0, behMinorRecent: 0, behTerm: 0, behMinorTerm: 0,
  subjects: [{
    name: 'Physical Science', priorTermAvg: 60,
    points: [{ date: 'a1', pct: 58 }, { date: 'a2', pct: 45 }, { date: 'a3', pct: 38 }, { date: 'a4', pct: 30 }],
  }],
});
