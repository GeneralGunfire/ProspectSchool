// Verifies evaluateMatch/categorizeGap/rankCandidates against constructed
// cases from .planning/research/PEER_TUTORING_FEATURE_RESEARCH.md section 2
// and the build's cross-reference checklist. Pure-function test — no DB
// needed, mirrors verify-wellbeing-alerts.mjs / verify-risk-engine-synthetic.mjs.
// Logic duplicated (not imported) from src/lib/peerTutoring.ts, same reason
// as those scripts: src/lib/peerTutoring.ts transitively imports
// src/lib/supabase.ts, which reads import.meta.env (Vite-only) at module
// load time and throws under plain Node/tsx. Keep this in sync by hand if
// the thresholds or matching logic change.
// Run with: node scripts/verify-peer-tutoring-matching.mjs

const GOOD_GAP_MIN = 20;
const GOOD_GAP_MAX = 50;
const FLAGGED_GAP_MIN = 60;
const MAX_CROSS_GRADE_DIFFERENCE = 2;
const DEFAULT_GRADE_BAND = 1;

function categorizeGap(gap) {
  if (gap > FLAGGED_GAP_MIN) return 'flagged_large_gap';
  if (gap >= GOOD_GAP_MIN && gap <= GOOD_GAP_MAX) return 'good_gap';
  return 'small_gap';
}

function evaluateMatch(tuteeGrade, tuteeScorePct, candidate) {
  const gradeDifference = Math.abs(candidate.tutorGrade - tuteeGrade);
  const abilityGap = candidate.tutorScorePct - tuteeScorePct;
  const gapCategory = categorizeGap(abilityGap);

  if (gradeDifference > MAX_CROSS_GRADE_DIFFERENCE) {
    return { candidate, abilityGap, gapCategory, gradeDifference, eligible: false, requiresApproval: false, rejectionReason: 'grade_diff_exceeded' };
  }
  if (abilityGap <= 0) {
    return { candidate, abilityGap, gapCategory, gradeDifference, eligible: false, requiresApproval: false, rejectionReason: 'no_positive_gap' };
  }
  const requiresApproval = gradeDifference > DEFAULT_GRADE_BAND || gapCategory === 'flagged_large_gap';
  return { candidate, abilityGap, gapCategory, gradeDifference, eligible: true, requiresApproval, rejectionReason: null };
}

function rankCandidates(results) {
  return results
    .filter((r) => r.eligible)
    .sort((a, b) => {
      if (a.candidate.sameClassAsTutee !== b.candidate.sameClassAsTutee) return a.candidate.sameClassAsTutee ? -1 : 1;
      if (a.candidate.priorPositiveInteraction !== b.candidate.priorPositiveInteraction) return a.candidate.priorPositiveInteraction ? -1 : 1;
      if (a.candidate.timetableOverlapScore !== b.candidate.timetableOverlapScore) return b.candidate.timetableOverlapScore - a.candidate.timetableOverlapScore;
      const mid = (GOOD_GAP_MIN + GOOD_GAP_MAX) / 2;
      return Math.abs(a.abilityGap - mid) - Math.abs(b.abilityGap - mid);
    });
}

// ── Test harness ─────────────────────────────────────────────────────────

let pass = 0, fail = 0;
function check(name, condition, detail = '') {
  if (condition) { console.log(`PASS — ${name}`); pass++; }
  else { console.log(`FAIL — ${name} ${detail}`); fail++; }
}

function candidate(overrides = {}) {
  return {
    tutorStudentId: 1, tutorGrade: 10, tutorScorePct: 80,
    sameClassAsTutee: false, priorPositiveInteraction: false, timetableOverlapScore: 0,
    ...overrides,
  };
}

// 1. Gap of 35 on the same topic, same grade => good_gap, eligible, no approval.
{
  const r = evaluateMatch(10, 45, candidate({ tutorScorePct: 80, tutorGrade: 10 })); // gap = 35
  check('gap of 35, same grade => eligible good_gap, no approval needed',
    r.eligible && r.gapCategory === 'good_gap' && !r.requiresApproval,
    JSON.stringify(r));
}

// 2. Gap of 70 => flagged_large_gap, requires approval (still eligible, per research: "flag", not hard block).
{
  const r = evaluateMatch(10, 15, candidate({ tutorScorePct: 85, tutorGrade: 10 })); // gap = 70
  check('gap of 70 => flagged_large_gap and requires teacher approval',
    r.eligible && r.gapCategory === 'flagged_large_gap' && r.requiresApproval,
    JSON.stringify(r));
}

// 3. Cross-grade with >2 grade difference => rejected outright.
{
  const r = evaluateMatch(8, 40, candidate({ tutorScorePct: 80, tutorGrade: 12 })); // 4 grades apart
  check('cross-grade difference of 4 => rejected (exceeds max of 2)',
    !r.eligible && r.rejectionReason === 'grade_diff_exceeded',
    JSON.stringify(r));
}

// 4. Cross-grade with exactly 2 grade difference and a good gap => eligible but requires approval (beyond default +-1 band).
{
  const r = evaluateMatch(8, 45, candidate({ tutorScorePct: 80, tutorGrade: 10 })); // gap = 35, 2 grades apart
  check('cross-grade difference of 2 with good gap => eligible, requires approval (beyond default band)',
    r.eligible && r.requiresApproval && r.gradeDifference === 2,
    JSON.stringify(r));
}

// 5. Same-grade, +-1 band, good gap => eligible, no approval (default band, research section 1-2).
{
  const r = evaluateMatch(9, 45, candidate({ tutorScorePct: 75, tutorGrade: 10 })); // gap = 30, 1 grade apart
  check('grade difference of 1 (default band) with good gap => no approval needed',
    r.eligible && !r.requiresApproval,
    JSON.stringify(r));
}

// 6. Tutor not actually stronger than tutee => rejected.
{
  const r = evaluateMatch(10, 60, candidate({ tutorScorePct: 55, tutorGrade: 10 })); // negative gap
  check('tutor weaker than tutee => rejected (no positive gap)',
    !r.eligible && r.rejectionReason === 'no_positive_gap',
    JSON.stringify(r));
}

// 7. Gap below 20 => small_gap, still eligible (not flagged, not "good") — tutor barely stronger.
{
  const r = evaluateMatch(10, 70, candidate({ tutorScorePct: 78, tutorGrade: 10 })); // gap = 8
  check('gap of 8 => eligible small_gap (below the 20-50 good band, but not rejected)',
    r.eligible && r.gapCategory === 'small_gap',
    JSON.stringify(r));
}

// 8. Tie-breaking: same-class candidate ranked above a stranger with an otherwise-better gap.
{
  const results = [
    evaluateMatch(10, 45, candidate({ tutorStudentId: 1, tutorScorePct: 80, tutorGrade: 10, sameClassAsTutee: false })), // gap 35, not same class
    evaluateMatch(10, 45, candidate({ tutorStudentId: 2, tutorScorePct: 70, tutorGrade: 10, sameClassAsTutee: true })),  // gap 25, same class
  ];
  const ranked = rankCandidates(results);
  check('same-class candidate ranked first despite a less-central ability gap',
    ranked[0]?.candidate.tutorStudentId === 2,
    JSON.stringify(ranked.map((r) => r.candidate.tutorStudentId)));
}

// 9. Tie-breaking: prior positive interaction beats higher timetable overlap when class tie is equal.
{
  const results = [
    evaluateMatch(10, 45, candidate({ tutorStudentId: 1, tutorScorePct: 80, tutorGrade: 10, sameClassAsTutee: false, priorPositiveInteraction: false, timetableOverlapScore: 0.9 })),
    evaluateMatch(10, 45, candidate({ tutorStudentId: 2, tutorScorePct: 80, tutorGrade: 10, sameClassAsTutee: false, priorPositiveInteraction: true, timetableOverlapScore: 0.1 })),
  ];
  const ranked = rankCandidates(results);
  check('prior positive interaction outranks a stronger timetable overlap',
    ranked[0]?.candidate.tutorStudentId === 2,
    JSON.stringify(ranked.map((r) => r.candidate.tutorStudentId)));
}

console.log(`\n${pass} passed, ${fail} failed.`);
process.exit(fail === 0 ? 0 : 1);
