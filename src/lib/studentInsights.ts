// ── Student Intelligence Engine ───────────────────────────────────────────────
// Computes a unified intelligence profile from marks, events, progress, and goals.
// Called once per portal load. Every page consumes the same object.

import type { StudentResult } from './marks';
import type { SchoolEvent }   from './events';
import type { StudyProgress } from './studyProgress';
import type { StudentGoals }  from './studentGoals';
import { computeInterventionImpact, type InterventionImpact, type Intervention, type Outcome } from './interventions';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface SubjectProfile {
  subject:      string;
  subjectId:    number;          // numeric FK — used for exact matching
  avg:          number;          // overall average %
  recentAvg:    number | null;   // last 3 assessments avg
  prevAvg:      number | null;   // prev 3 assessments avg
  trend:        number | null;   // recentAvg - prevAvg
  count:        number;          // total marked assessments
  best:         number;          // highest single result %
  worst:        number;          // lowest single result %
  stdDev:       number;          // consistency indicator
  lastMarkedAt: string | null;
}

export type RiskLevel = 'high' | 'medium' | 'low' | 'none';

export interface SubjectRisk {
  subject:    string;
  subjectId:  number;
  avg:        number;
  risk:       RiskLevel;
  reasons:    string[];
  examDays:   number | null;
}

export interface RevisionRecommendation {
  subject:    string;
  subjectId:  number;
  avg:        number;
  urgency:    'critical' | 'high' | 'medium' | 'low';
  reason:     string;
  examDays:   number | null;
}

export interface ApsImprovementStep {
  subject:        string;
  currentPct:     number;
  targetPct:      number;
  currentLevel:   number;
  targetLevel:    number;
  apsGain:        number;
}

export interface AcademicStory {
  overallAvg:        number | null;
  previousAvg:       number | null;  // first half of all results
  change:            number | null;  // overallAvg - previousAvg
  strongestGrowth:   string | null;  // subject with biggest positive delta
  mostConsistent:    string | null;  // subject with lowest std deviation (min 3)
  needsAttention:    string | null;  // subject with biggest negative delta or lowest avg
  totalAssessments:  number;
}

export interface Milestone {
  id:        string;
  label:     string;
  achieved:  boolean;
  detail:    string;
}

export type LearnerStatusLabel = 'Flourishing' | 'On Track' | 'Needs Focus' | 'At Risk';

export interface LearnerStatus {
  score:        number;              // 0–100
  label:        LearnerStatusLabel;
  color:        string;              // Tailwind text class
  bg:           string;              // Tailwind bg class
  border:       string;              // Tailwind border class
  contributors: string[];            // short phrases explaining the score
}

export interface StudentInsights {
  // Subject profiles (all subjects with marks)
  subjectProfiles:   SubjectProfile[];

  // Ranked lists
  strongestSubject:  SubjectProfile | null;
  weakestSubject:    SubjectProfile | null;
  improvingSubjects: SubjectProfile[];   // trend > 3
  decliningSubjects: SubjectProfile[];   // trend < -3

  // Risk
  examRiskSubjects:  SubjectRisk[];

  // Recommendations
  revisionRecs:      RevisionRecommendation[];

  // Academic story (for Home card)
  academicStory:     AcademicStory;

  // APS roadmap (if goal set)
  apsRoadmap:        ApsImprovementStep[];
  apsGap:            number | null;

  // Library
  topicsMastered:    number;
  topicsInProgress:  number;
  topicsNotStarted:  number;

  // Milestones
  milestones:        Milestone[];

  // Overall learner status
  learnerStatus:     LearnerStatus;

  // Intervention impact (requires studentId passed to engine)
  interventionImpact: InterventionImpact;

  // Computed at
  computedAt:        string;
}

// ── Re-export intervention types for convenience ──────────────────────────────
export type { Intervention, Outcome, InterventionImpact } from './interventions';

// ── NQF helpers (mirrors apsData.ts logic without importing the whole module) ──

function pctToNQF(pct: number): number {
  if (pct >= 80) return 7;
  if (pct >= 70) return 6;
  if (pct >= 60) return 5;
  if (pct >= 50) return 4;
  if (pct >= 40) return 3;
  if (pct >= 30) return 2;
  return 1;
}

// ── Core engine ───────────────────────────────────────────────────────────────

export function computeStudentInsights(
  allMarks:           StudentResult[],
  events:             SchoolEvent[],
  studyProgress:      StudyProgress[],
  goals:              StudentGoals,
  todayStr:           string,
  completedInvIn:     Intervention[] = [],
  outcomesIn:         Outcome[]      = [],
): StudentInsights {

  // ── 1. Build subject profiles ─────────────────────────────────────────────

  // Key by subject_id (numeric) for exact matching; fall back to label for legacy data
  const subjectMap = new Map<string, StudentResult[]>();
  const subjectIdMap = new Map<string, number>(); // label → subject_id
  for (const m of allMarks) {
    if (m.mark === null) continue;
    const key = m.subject_label || 'Other';
    if (!subjectMap.has(key)) subjectMap.set(key, []);
    subjectMap.get(key)!.push(m);
    if (m.subject_id && !subjectIdMap.has(key)) subjectIdMap.set(key, m.subject_id);
  }

  const subjectProfiles: SubjectProfile[] = [];

  for (const [subject, items] of subjectMap.entries()) {
    const sorted = [...items].sort((a, b) =>
      new Date(a.marked_at ?? a.created_at).getTime() -
      new Date(b.marked_at ?? b.created_at).getTime()
    );

    const pcts = sorted.map(r => (r.mark! / r.total) * 100);
    const avg  = pcts.reduce((s, p) => s + p, 0) / pcts.length;

    const recent3 = pcts.slice(-3);
    const prev3   = pcts.slice(-6, -3);
    const recentAvg = recent3.length ? recent3.reduce((s, p) => s + p, 0) / recent3.length : null;
    const prevAvg   = prev3.length   ? prev3.reduce((s, p) => s + p, 0)   / prev3.length   : null;
    const trend     = recentAvg !== null && prevAvg !== null ? recentAvg - prevAvg : null;

    const mean   = avg;
    const stdDev = pcts.length >= 2
      ? Math.sqrt(pcts.reduce((s, p) => s + Math.pow(p - mean, 2), 0) / pcts.length)
      : 0;

    subjectProfiles.push({
      subject,
      subjectId:    subjectIdMap.get(subject) ?? 0,
      avg:          Math.round(avg),
      recentAvg:    recentAvg !== null ? Math.round(recentAvg) : null,
      prevAvg:      prevAvg   !== null ? Math.round(prevAvg)   : null,
      trend:        trend     !== null ? Math.round(trend * 10) / 10 : null,
      count:        items.length,
      best:         Math.round(Math.max(...pcts)),
      worst:        Math.round(Math.min(...pcts)),
      stdDev:       Math.round(stdDev * 10) / 10,
      lastMarkedAt: sorted[sorted.length - 1]?.marked_at ?? null,
    });
  }

  subjectProfiles.sort((a, b) => b.avg - a.avg);

  const strongestSubject = subjectProfiles.length > 0 ? subjectProfiles[0] : null;
  const weakestSubject   = subjectProfiles.length > 0 ? subjectProfiles[subjectProfiles.length - 1] : null;

  const improvingSubjects = subjectProfiles.filter(s => s.trend !== null && s.trend > 3);
  const decliningSubjects = subjectProfiles.filter(s => s.trend !== null && s.trend < -3);

  // ── 2. Days until helper ──────────────────────────────────────────────────

  function daysUntil(dateStr: string): number {
    return Math.round(
      (new Date(dateStr + 'T00:00:00').getTime() - new Date(todayStr + 'T00:00:00').getTime())
      / 86400000
    );
  }

  const futureExams = events.filter(e =>
    (e.event_type === 'exam' || e.event_type === 'assessment') &&
    e.event_date >= todayStr
  ).sort((a, b) => a.event_date.localeCompare(b.event_date));

  // ── 3. Subject risk assessment ────────────────────────────────────────────

  const examRiskSubjects: SubjectRisk[] = [];

  for (const sp of subjectProfiles) {
    const reasons: string[] = [];
    let risk: RiskLevel = 'none';

    // Find nearest exam for this subject
    const keyword = sp.subject.split(' ')[0].toLowerCase();
    const nearestExam = futureExams.find(e =>
      e.title.toLowerCase().includes(keyword) ||
      sp.subject.toLowerCase().split(' ').some(w => e.title.toLowerCase().includes(w))
    );
    const examDays = nearestExam ? daysUntil(nearestExam.event_date) : null;

    if (sp.avg < 50)             reasons.push(`Average is ${sp.avg}% — below pass mark`);
    if (sp.avg < 65 && sp.avg >= 50) reasons.push(`Average is ${sp.avg}% — needs improvement`);
    if (sp.trend !== null && sp.trend < -5) reasons.push(`Declining — down ${Math.abs(sp.trend)}% recently`);
    if (examDays !== null && examDays <= 14 && sp.avg < 70) reasons.push(`Exam in ${examDays} day${examDays !== 1 ? 's' : ''}`);
    if (sp.stdDev > 20) reasons.push('Inconsistent results');

    if (reasons.length >= 3 || (sp.avg < 50 && examDays !== null && examDays <= 14)) risk = 'high';
    else if (reasons.length === 2 || (sp.avg < 60 && examDays !== null && examDays <= 21)) risk = 'medium';
    else if (reasons.length === 1) risk = 'low';

    if (risk !== 'none') {
      examRiskSubjects.push({ subject: sp.subject, subjectId: sp.subjectId, avg: sp.avg, risk, reasons, examDays });
    }
  }

  examRiskSubjects.sort((a, b) => {
    const riskOrder = { high: 0, medium: 1, low: 2, none: 3 };
    return riskOrder[a.risk] - riskOrder[b.risk];
  });

  // ── 4. Revision recommendations ──────────────────────────────────────────

  const revisionRecs: RevisionRecommendation[] = [];

  for (const sp of subjectProfiles) {
    const keyword    = sp.subject.split(' ')[0].toLowerCase();
    const nearestExam = futureExams.find(e =>
      e.title.toLowerCase().includes(keyword) ||
      sp.subject.toLowerCase().split(' ').some(w => e.title.toLowerCase().includes(w))
    );
    const examDays = nearestExam ? daysUntil(nearestExam.event_date) : null;

    let urgency: RevisionRecommendation['urgency'] = 'low';
    let reason = '';

    if (examDays !== null && examDays <= 7 && sp.avg < 75) {
      urgency = 'critical';
      reason  = `Exam in ${examDays} day${examDays !== 1 ? 's' : ''} — average is ${sp.avg}%`;
    } else if (examDays !== null && examDays <= 14 && sp.avg < 70) {
      urgency = 'high';
      reason  = `Exam in ${examDays} days — needs revision`;
    } else if (sp.avg < 55) {
      urgency = 'high';
      reason  = `Average is ${sp.avg}% — consistently struggling`;
    } else if (sp.trend !== null && sp.trend < -5) {
      urgency = 'medium';
      reason  = `Declining trend — down ${Math.abs(sp.trend)}% recently`;
    } else if (sp.avg < 65) {
      urgency = 'medium';
      reason  = `Below 65% — room for improvement`;
    }

    if (urgency !== 'low' || (examDays !== null && examDays <= 21)) {
      revisionRecs.push({ subject: sp.subject, subjectId: sp.subjectId, avg: sp.avg, urgency, reason, examDays });
    }
  }

  revisionRecs.sort((a, b) => {
    const order = { critical: 0, high: 1, medium: 2, low: 3 };
    return order[a.urgency] - order[b.urgency];
  });

  // ── 5. Academic story ─────────────────────────────────────────────────────

  const allSortedMarks = [...allMarks]
    .filter(m => m.mark !== null)
    .sort((a, b) =>
      new Date(a.marked_at ?? a.created_at).getTime() -
      new Date(b.marked_at ?? b.created_at).getTime()
    );

  let overallAvg:  number | null = null;
  let previousAvg: number | null = null;
  let change:      number | null = null;

  if (allSortedMarks.length >= 2) {
    const half    = Math.floor(allSortedMarks.length / 2);
    const first   = allSortedMarks.slice(0, half);
    const second  = allSortedMarks.slice(half);
    previousAvg = Math.round(first.reduce((s, m) => s + (m.mark! / m.total) * 100, 0) / first.length);
    overallAvg  = Math.round(second.reduce((s, m) => s + (m.mark! / m.total) * 100, 0) / second.length);
    change      = overallAvg - previousAvg;
  } else if (allSortedMarks.length === 1) {
    overallAvg = Math.round((allSortedMarks[0].mark! / allSortedMarks[0].total) * 100);
  }

  // strongest growth = subject with highest positive trend (min 2 assessments)
  const growthCandidates = subjectProfiles.filter(s => s.trend !== null && s.count >= 2);
  const strongestGrowth = growthCandidates.length > 0
    ? growthCandidates.reduce((a, b) => (b.trend ?? -Infinity) > (a.trend ?? -Infinity) ? b : a).subject
    : null;

  // most consistent = lowest std deviation with at least 3 assessments
  const consistentCandidates = subjectProfiles.filter(s => s.count >= 3);
  const mostConsistent = consistentCandidates.length > 0
    ? consistentCandidates.reduce((a, b) => b.stdDev < a.stdDev ? b : a).subject
    : null;

  // needs attention = biggest negative trend, or lowest avg
  const attentionCandidates = subjectProfiles.filter(s => s.count >= 1);
  let needsAttention: string | null = null;
  if (attentionCandidates.length > 0) {
    const byDecline = attentionCandidates.filter(s => s.trend !== null && s.trend < -3);
    if (byDecline.length > 0) {
      needsAttention = byDecline.reduce((a, b) => (b.trend ?? 0) < (a.trend ?? 0) ? b : a).subject;
    } else {
      needsAttention = attentionCandidates[attentionCandidates.length - 1].subject;
    }
  }

  const academicStory: AcademicStory = {
    overallAvg,
    previousAvg,
    change,
    strongestGrowth,
    mostConsistent,
    needsAttention,
    totalAssessments: allMarks.filter(m => m.mark !== null).length,
  };

  // ── 6. APS roadmap ────────────────────────────────────────────────────────

  const apsRoadmap: ApsImprovementStep[] = [];
  const apsGap = goals.targetAps
    ? Math.max(0, goals.targetAps - (allMarks.length > 0
        ? subjectProfiles.reduce((sum, s) => sum + pctToNQF(s.avg), 0)
        : 0))
    : null;

  if (goals.targetAps && subjectProfiles.length > 0) {
    const NQF_THRESHOLDS = [30, 40, 50, 60, 70, 80, 90];

    for (const sp of subjectProfiles) {
      const currentLevel = pctToNQF(sp.avg);
      if (currentLevel >= 7) continue;
      const nextThresh = NQF_THRESHOLDS.find(t => t > sp.avg);
      if (!nextThresh) continue;
      const nextLevel = pctToNQF(nextThresh);
      const gain = sp.subject.toLowerCase().includes('life orient')
        ? Math.min(nextLevel, 1) - Math.min(currentLevel, 1)
        : nextLevel - currentLevel;
      if (gain > 0) {
        apsRoadmap.push({
          subject:      sp.subject,
          currentPct:   sp.avg,
          targetPct:    nextThresh,
          currentLevel,
          targetLevel:  nextLevel,
          apsGain:      gain,
        });
      }
    }

    apsRoadmap.sort((a, b) => b.apsGain - a.apsGain || a.currentPct - b.currentPct);
  }

  // ── 7. Library stats ──────────────────────────────────────────────────────

  const topicsMastered   = studyProgress.filter(p => p.mastery_level === 'mastered').length;
  const topicsInProgress = studyProgress.filter(p => p.mastery_level === 'needs_practice').length;
  const topicsNotStarted = Math.max(0, 35 - studyProgress.filter(p => p.mastery_level !== 'not_started').length);

  // ── 8. Milestones ─────────────────────────────────────────────────────────

  const milestones: Milestone[] = [
    {
      id:       'first-mark',
      label:    'First Assessment',
      achieved: allMarks.filter(m => m.mark !== null).length > 0,
      detail:   'Your first mark has been recorded',
    },
    {
      id:       'first-topic',
      label:    'First Library Topic',
      achieved: studyProgress.length > 0,
      detail:   'Started your first library topic',
    },
    {
      id:       'first-mastery',
      label:    'First Mastery',
      achieved: topicsMastered > 0,
      detail:   `Mastered ${topicsMastered} topic${topicsMastered !== 1 ? 's' : ''}`,
    },
    {
      id:       'goal-set',
      label:    'Goal Set',
      achieved: !!(goals.targetAps || goals.targetCareer),
      detail:   goals.targetAps
        ? `Target APS: ${goals.targetAps}`
        : goals.targetCareer
        ? `Career goal: ${goals.targetCareer}`
        : 'Set a target in My Future',
    },
    {
      id:       'five-topics',
      label:    '5 Topics Studied',
      achieved: studyProgress.filter(p => p.mastery_level !== 'not_started').length >= 5,
      detail:   'Studied 5 or more library topics',
    },
    {
      id:       'strong-subject',
      label:    'Strong Subject',
      achieved: subjectProfiles.some(s => s.avg >= 75),
      detail:   strongestSubject ? `${strongestSubject.subject} at ${strongestSubject.avg}%` : '',
    },
    {
      id:       'improvement',
      label:    'Improvement',
      achieved: improvingSubjects.length > 0,
      detail:   improvingSubjects.length > 0 ? `${improvingSubjects[0].subject} is trending up` : '',
    },
  ];

  // ── 8b. Intervention milestones (from caller-supplied data — engine stays pure) ─
  if (completedInvIn.length > 0 || outcomesIn.length > 0) {
    const improved      = outcomesIn.filter(o => o.result === 'improved');
    const firstImproved = improved[0] as { subject: string; improvement: number } | undefined;

    milestones.push(
      {
        id:       'first-intervention',
        label:    'First Recommendation Completed',
        achieved: completedInvIn.length > 0,
        detail:   completedInvIn.length > 0
          ? `Completed ${completedInvIn[0].subject} recommendation`
          : 'Complete a coaching recommendation',
      },
      {
        id:       'first-improvement',
        label:    'First Improvement Recorded',
        achieved: improved.length > 0,
        detail:   firstImproved
          ? `${firstImproved.subject} improved +${firstImproved.improvement}%`
          : 'Improve after completing a recommendation',
      },
      {
        id:       'five-interventions',
        label:    '5 Recommendations Completed',
        achieved: completedInvIn.length >= 5,
        detail:   `${completedInvIn.length} recommendation${completedInvIn.length !== 1 ? 's' : ''} completed`,
      },
      {
        id:       'risk-reduced',
        label:    'Reduced High Risk Subjects',
        achieved: improved.length >= 2,
        detail:   `${improved.length} subject${improved.length !== 1 ? 's' : ''} improved after coaching`,
      },
    );
  }

  // ── 9. Learner Status — overall health score 0–100 ───────────────────────

  const learnerStatus = ((): LearnerStatus => {
    const contributors: string[] = [];
    let score = 50; // neutral baseline

    // Average mark component (0–35 pts)
    if (overallAvg !== null) {
      const avgScore = Math.round((overallAvg / 100) * 35);
      score += avgScore - 17; // centre around 17 (50% avg = neutral)
      if (overallAvg >= 70) contributors.push(`Strong average (${overallAvg}%)`);
      else if (overallAvg < 50) contributors.push(`Average below pass (${overallAvg}%)`);
    }

    // Trend component (0–20 pts)
    if (academicStory.change !== null) {
      if (academicStory.change >= 5) { score += 15; contributors.push('Improving trend'); }
      else if (academicStory.change >= 0) { score += 8; }
      else if (academicStory.change < -5) { score -= 15; contributors.push('Declining trend'); }
      else { score -= 5; }
    }

    // High risk subjects (-10 per high risk, -5 per medium)
    const highRisk   = examRiskSubjects.filter(s => s.risk === 'high').length;
    const mediumRisk = examRiskSubjects.filter(s => s.risk === 'medium').length;
    if (highRisk > 0) {
      score -= highRisk * 10;
      contributors.push(`${highRisk} high-risk subject${highRisk !== 1 ? 's' : ''}`);
    }
    if (mediumRisk > 0) score -= mediumRisk * 5;

    // Library progress (+5 if any mastery)
    if (topicsMastered >= 5) { score += 5; contributors.push(`${topicsMastered} topics mastered`); }
    else if (topicsMastered > 0) { score += 2; }

    // Goal set bonus (+5)
    if (goals.targetAps || goals.targetCareer) score += 5;

    // Clamp
    score = Math.max(0, Math.min(100, Math.round(score)));

    const label: LearnerStatusLabel =
      score >= 90 ? 'Flourishing' :
      score >= 75 ? 'On Track'    :
      score >= 60 ? 'Needs Focus' :
                    'At Risk';

    const color  = score >= 90 ? 'text-emerald-600' : score >= 75 ? 'text-blue-600'  : score >= 60 ? 'text-amber-600'  : 'text-red-500';
    const bg     = score >= 90 ? 'bg-emerald-50'    : score >= 75 ? 'bg-blue-50'     : score >= 60 ? 'bg-amber-50'     : 'bg-red-50';
    const border = score >= 90 ? 'border-emerald-200' : score >= 75 ? 'border-blue-200' : score >= 60 ? 'border-amber-200' : 'border-red-200';

    return { score, label, color, bg, border, contributors };
  })();

  const interventionImpact: InterventionImpact = computeInterventionImpact(completedInvIn, outcomesIn);

  return {
    subjectProfiles,
    strongestSubject,
    weakestSubject,
    improvingSubjects,
    decliningSubjects,
    examRiskSubjects,
    revisionRecs,
    academicStory,
    apsRoadmap,
    apsGap,
    topicsMastered,
    topicsInProgress,
    topicsNotStarted,
    milestones,
    learnerStatus,
    interventionImpact,
    computedAt: new Date().toISOString(),
  };
}
