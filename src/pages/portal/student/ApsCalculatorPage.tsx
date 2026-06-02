import { useState, useMemo, useEffect, useRef } from 'react';
import { GraduationCap, Plus, Trash2, ChevronDown, CheckCircle2, XCircle, Info, BookOpen, Filter, Target, TrendingUp } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import {
  NSC_SUBJECTS,
  DEGREE_DATA,
  FIELDS_OF_STUDY,
  UNIVERSITIES,
  percentToNQF,
  calculateAPS,
  type StudentSubject,
  type SubjectCode,
  type FieldOfStudy,
  type DegreeEntry,
} from '../../../data/apsData';
import { saveApsScore } from '../../../lib/myFuture';
import { fetchStudentResults, type StudentResult } from '../../../lib/marks';
import { getStudentGoals } from '../../../lib/studentGoals';
import { computeStudentInsights } from '../../../lib/studentInsights';

// ── NQF level badge colour ────────────────────────────────────────────────────
function nqfColor(level: number) {
  if (level >= 7) return 'bg-emerald-100 text-emerald-800';
  if (level >= 6) return 'bg-blue-100 text-blue-800';
  if (level >= 5) return 'bg-indigo-100 text-indigo-800';
  if (level >= 4) return 'bg-amber-100 text-amber-800';
  if (level >= 3) return 'bg-orange-100 text-orange-800';
  return 'bg-red-100 text-red-800';
}

function apsColor(aps: number) {
  if (aps >= 40) return 'text-emerald-600';
  if (aps >= 30) return 'text-blue-600';
  if (aps >= 24) return 'text-amber-600';
  return 'text-red-500';
}

// ── Check if student meets a degree's requirements ────────────────────────────
function checkDegreeMatch(
  degree: DegreeEntry,
  subjects: StudentSubject[],
  aps: number
): { qualifies: boolean; metRequirements: boolean[]; apsOk: boolean } {
  const apsOk = aps >= degree.minAPS;
  const metRequirements = degree.subjectRequirements.map(req => {
    const studentSubject = subjects.find(s => s.code === req.subject);
    if (!studentSubject) return false;
    return percentToNQF(studentSubject.percent) >= req.minLevel;
  });
  const allSubjectsMet = metRequirements.every(Boolean);
  return { qualifies: apsOk && allSubjectsMet, metRequirements, apsOk };
}

// ── Subject row ───────────────────────────────────────────────────────────────
function SubjectRow({
  subject,
  index,
  onChange,
  onRemove,
}: {
  subject: StudentSubject;
  index: number;
  onChange: (i: number, updated: StudentSubject) => void;
  onRemove: (i: number) => void;
}) {
  const level = percentToNQF(subject.percent);
  const grouped = NSC_SUBJECTS.reduce<Record<string, typeof NSC_SUBJECTS>>((acc, s) => {
    (acc[s.group] ??= []).push(s);
    return acc;
  }, {});

  return (
    <div className="flex items-center gap-2 py-2 border-b border-stone-100 last:border-0">
      {/* Subject select */}
      <div className="relative flex-1 min-w-0">
        <select
          value={subject.code}
          onChange={e => onChange(index, { ...subject, code: e.target.value as SubjectCode })}
          className="w-full appearance-none bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 pr-7 text-sm font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-900/20 focus:border-stone-400 transition"
        >
          {Object.entries(grouped).map(([group, items]) => (
            <optgroup key={group} label={group}>
              {items.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </optgroup>
          ))}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400 pointer-events-none" />
      </div>

      {/* Percentage input */}
      <div className="flex items-center gap-1 shrink-0">
        <input
          type="number"
          min={0}
          max={100}
          value={subject.percent || ''}
          onChange={e => {
            const val = Math.min(100, Math.max(0, Number(e.target.value)));
            onChange(index, { ...subject, percent: val });
          }}
          placeholder="0"
          className="w-16 bg-stone-50 border border-stone-200 rounded-lg px-2 py-2 text-sm font-semibold text-stone-800 text-center focus:outline-none focus:ring-2 focus:ring-stone-900/20 focus:border-stone-400 transition"
        />
        <span className="text-stone-400 text-xs">%</span>
      </div>

      {/* NQF level badge */}
      <span className={`shrink-0 text-[11px] font-bold px-2 py-1 rounded-md ${nqfColor(level)}`}>
        L{level}
      </span>

      {/* Remove */}
      <button
        onClick={() => onRemove(index)}
        className="shrink-0 p-1.5 rounded-lg text-stone-400 hover:text-red-500 hover:bg-red-50 transition"
        aria-label="Remove subject"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// ── Degree card ───────────────────────────────────────────────────────────────
function DegreeCard({
  degree,
  subjects,
  aps,
}: {
  degree: DegreeEntry;
  subjects: StudentSubject[];
  aps: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const { qualifies, metRequirements, apsOk } = checkDegreeMatch(degree, subjects, aps);

  return (
    <div
      className={`rounded-xl border transition-all duration-200 ${
        qualifies
          ? 'border-emerald-200 bg-emerald-50/40'
          : 'border-stone-200 bg-white'
      }`}
    >
      {/* Card header */}
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full text-left px-4 py-3.5 flex items-start gap-3"
      >
        {/* Qualify indicator */}
        <div className="mt-0.5 shrink-0">
          {qualifies
            ? <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            : <XCircle className="w-5 h-5 text-stone-300" />
          }
        </div>

        {/* Main info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-[11px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-md ${
              qualifies ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-100 text-stone-500'
            }`}>
              {degree.shortName}
            </span>
            <span className="text-[11px] text-stone-400">{degree.duration}</span>
          </div>
          <p className="mt-1 text-sm font-bold text-stone-900 leading-tight">{degree.degree}</p>
          <p className="text-xs text-stone-500 mt-0.5">{degree.faculty}</p>
        </div>

        {/* APS requirement */}
        <div className="shrink-0 text-right ml-2">
          <div className={`text-lg font-black ${apsOk ? 'text-emerald-600' : 'text-stone-400'}`}>
            {degree.minAPS}
          </div>
          <div className="text-[10px] text-stone-400 font-medium">min APS</div>
        </div>

        <ChevronDown className={`shrink-0 w-4 h-4 text-stone-400 transition-transform duration-200 mt-1 ${expanded ? 'rotate-180' : ''}`} />
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-stone-100 pt-3 space-y-3">
          {/* APS check */}
          <div className="flex items-center gap-2">
            {apsOk
              ? <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              : <XCircle className="w-4 h-4 text-red-400 shrink-0" />
            }
            <span className="text-xs text-stone-700">
              APS required: <strong>{degree.minAPS}</strong>
              {!apsOk && <span className="text-red-500 ml-1">(you need {degree.minAPS - aps} more points)</span>}
              {apsOk && <span className="text-emerald-600 ml-1">✓ met</span>}
            </span>
          </div>

          {/* Subject requirements */}
          {degree.subjectRequirements.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-[11px] font-bold uppercase tracking-wide text-stone-400">Subject Requirements</p>
              {degree.subjectRequirements.map((req, i) => (
                <div key={i} className="flex items-center gap-2">
                  {metRequirements[i]
                    ? <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    : <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                  }
                  <span className="text-xs text-stone-700">{req.label}</span>
                </div>
              ))}
            </div>
          )}

          {/* Notes */}
          {degree.notes && (
            <div className="flex items-start gap-2 bg-blue-50 rounded-lg px-3 py-2">
              <Info className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700">{degree.notes}</p>
            </div>
          )}

          <p className="text-[11px] text-stone-400">{degree.university} · {degree.faculty}</p>
        </div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function ApsCalculatorPage({ session }: { session?: { student_id: number; school_id: number; grade: number } }) {
  const [subjects, setSubjects] = useState<StudentSubject[]>([
    { code: 'english', percent: 0 },
    { code: 'mathematics', percent: 0 },
    { code: 'physical-sciences', percent: 0 },
    { code: 'life-orientation', percent: 0 },
  ]);

  const [fieldFilter, setFieldFilter] = useState<FieldOfStudy | 'All'>('All');
  const [uniFilter, setUniFilter] = useState<string>('All');
  const [showOnlyQualifying, setShowOnlyQualifying] = useState(false);
  const [showGoalPlanner, setShowGoalPlanner] = useState(false);
  const [targetAps, setTargetAps] = useState(0);

  const [loadingMarks, setLoadingMarks] = useState(false);
  const [marksLoaded, setMarksLoaded]   = useState(false);
  const [storedMarks, setStoredMarks]   = useState<StudentResult[]>([]);

  // Persistent APS goal — saved to localStorage per student
  const [apsGoal, setApsGoal] = useState<number>(() => {
    if (!session) return 0;
    return Number(localStorage.getItem(`prospect_aps_goal_${session.student_id}`) ?? 0);
  });

  const aps = useMemo(() => calculateAPS(subjects.filter(s => s.percent > 0)), [subjects]);

  // Sync apsGoal to localStorage whenever it changes
  useEffect(() => {
    if (!session || apsGoal === 0) return;
    localStorage.setItem(`prospect_aps_goal_${session.student_id}`, String(apsGoal));
  }, [apsGoal, session?.student_id]);

  // On mount: if apsGoal was loaded from localStorage and targetAps is 0, sync them
  useEffect(() => {
    if (apsGoal > 0 && targetAps === 0) {
      setTargetAps(apsGoal);
      setShowGoalPlanner(true);
    }
  }, []); // run once on mount

  // Debounce-save to Supabase whenever aps or subjects change (no-op for guests)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (aps === 0) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      saveApsScore(aps, subjects.filter(s => s.percent > 0).map(s => ({ code: s.code, percent: s.percent }))).catch(() => {});
    }, 1500);
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
  }, [aps, subjects]);

  const addSubject = () => {
    // Pick a subject not already in the list
    const used = new Set(subjects.map(s => s.code));
    const next = NSC_SUBJECTS.find(s => !used.has(s.value));
    if (next) setSubjects(prev => [...prev, { code: next.value, percent: 0 }]);
  };

  const updateSubject = (i: number, updated: StudentSubject) => {
    setSubjects(prev => prev.map((s, idx) => idx === i ? updated : s));
  };

  const removeSubject = (i: number) => {
    setSubjects(prev => prev.filter((_, idx) => idx !== i));
  };

  // Use My Marks — fetch real results and populate subject rows
  async function handleUseMyMarks() {
    if (!session) return;
    setLoadingMarks(true);

    const results = await fetchStudentResults(session.student_id, session.school_id);
    const marked  = results.filter(r => r.mark !== null);

    if (marked.length === 0) {
      setLoadingMarks(false);
      return;
    }

    // Group by subject_label, compute average percentage per subject
    const subjectAvgMap = new Map<string, { sum: number; total: number }>();
    for (const r of marked) {
      const key = r.subject_label || 'Other';
      const e = subjectAvgMap.get(key) ?? { sum: 0, total: 0 };
      subjectAvgMap.set(key, { sum: e.sum + r.mark!, total: e.total + r.total });
    }

    // Map subject labels to NSC_SUBJECTS codes by keyword matching
    const labelToCode = (label: string): SubjectCode | null => {
      const l = label.toLowerCase();
      const match = NSC_SUBJECTS.find(s =>
        l.includes(s.label.toLowerCase().split(' ')[0]) ||
        s.label.toLowerCase().includes(l.split(' ')[0])
      );
      return match ? match.value : null;
    };

    const populated: StudentSubject[] = [];
    for (const [label, data] of subjectAvgMap.entries()) {
      const code = labelToCode(label);
      if (!code) continue;
      const percent = Math.round((data.sum / data.total) * 100);
      populated.push({ code, percent });
    }

    if (populated.length > 0) {
      setSubjects(populated);
      setStoredMarks(marked);
      setMarksLoaded(true);
    }

    setLoadingMarks(false);
  }

  // ── Engine-powered APS Roadmap (only when marks loaded + goal set) ────────
  const apsRoadmap = useMemo(() => {
    if (storedMarks.length === 0 || !apsGoal) return [];
    const goals = session
      ? { targetAps: apsGoal, targetCareer: null, updatedAt: '' }
      : { targetAps: null, targetCareer: null, updatedAt: '' };
    const todayStr = new Date().toISOString().slice(0, 10);
    const ins = computeStudentInsights(storedMarks, [], [], goals, todayStr, [], []);
    return ins.apsRoadmap.slice(0, 6);
  }, [storedMarks, apsGoal]);

  // Filtered + sorted degrees
  const filteredDegrees = useMemo(() => {
    let list = DEGREE_DATA;
    if (fieldFilter !== 'All') list = list.filter(d => d.field === fieldFilter);
    if (uniFilter !== 'All') list = list.filter(d => d.shortName === uniFilter);

    // Check qualification for each
    const withMatch = list.map(d => ({
      degree: d,
      match: checkDegreeMatch(d, subjects.filter(s => s.percent > 0), aps),
    }));

    if (showOnlyQualifying) {
      return withMatch.filter(m => m.match.qualifies);
    }

    // Sort: qualifying first, then by APS desc
    return withMatch.sort((a, b) => {
      if (a.match.qualifies && !b.match.qualifies) return -1;
      if (!a.match.qualifies && b.match.qualifies) return 1;
      return b.degree.minAPS - a.degree.minAPS;
    });
  }, [subjects, aps, fieldFilter, uniFilter, showOnlyQualifying]);

  const qualifyingCount = filteredDegrees.filter(m => m.match.qualifies).length;

  return (
    <div className="p-5 md:p-8 max-w-6xl w-full mx-auto">
      <div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          className="mb-6 flex items-start justify-between gap-4"
        >
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-stone-400 mb-1">
              APS & Universities
            </p>
            <h1 className="font-display font-black text-brand-dark text-2xl md:text-3xl" style={{ letterSpacing: '-0.03em' }}>
              APS Calculator
            </h1>
            <p className="text-sm text-stone-400 mt-1">
              Enter your Grade 12 marks to see which programmes you qualify for.
            </p>
          </div>
          {aps > 0 && apsGoal > 0 && (
            <div className="shrink-0 hidden sm:block">
              <div className={`rounded-2xl px-4 py-3 text-center border-2 ${
                aps >= apsGoal
                  ? 'bg-emerald-50 border-emerald-200'
                  : 'bg-amber-50 border-amber-200'
              }`}>
                <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-0.5">
                  {aps >= apsGoal ? 'Goal Reached' : 'Goal'}
                </p>
                <p className={`font-black text-2xl leading-none ${aps >= apsGoal ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {aps} / {apsGoal}
                </p>
                {aps < apsGoal && (
                  <p className="text-[10px] text-stone-400 mt-0.5">{apsGoal - aps} to go</p>
                )}
              </div>
            </div>
          )}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">

          {/* ── Left: Subject Input ── */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-stone-900">Your Subjects & Marks</h2>
                  <p className="text-[11px] text-stone-400 mt-0.5">{subjects.length} subject{subjects.length !== 1 ? 's' : ''}</p>
                </div>
                {session && (
                  <button
                    onClick={handleUseMyMarks}
                    disabled={loadingMarks}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black transition-colors ${
                      marksLoaded
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-brand-dark text-white hover:bg-stone-700 disabled:opacity-50'
                    }`}
                  >
                    {loadingMarks ? (
                      <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <TrendingUp className="w-3 h-3" />
                    )}
                    {marksLoaded ? 'Marks Loaded' : 'Use My Marks'}
                  </button>
                )}
              </div>

              <div className="px-5 py-2">
                {subjects.map((s, i) => (
                  <SubjectRow
                    key={i}
                    subject={s}
                    index={i}
                    onChange={updateSubject}
                    onRemove={removeSubject}
                  />
                ))}
              </div>

              <div className="px-5 pb-4">
                <button
                  onClick={addSubject}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed border-stone-200 text-sm font-semibold text-stone-400 hover:border-stone-400 hover:text-stone-700 hover:bg-stone-50 transition"
                >
                  <Plus className="w-4 h-4" />
                  Add Subject
                </button>
              </div>
            </div>

            {/* APS Score card */}
            <div className={`rounded-2xl border-2 p-6 text-center transition-all ${
              aps >= 40 ? 'border-emerald-300 bg-emerald-50' :
              aps >= 30 ? 'border-blue-300 bg-blue-50' :
              aps >= 24 ? 'border-amber-300 bg-amber-50' :
              'border-stone-200 bg-white'
            }`}>
              <p className="text-xs font-bold uppercase tracking-widest text-stone-500 mb-1">Your APS Score</p>
              <div className={`text-6xl font-black tracking-tight ${apsColor(aps)}`}>{aps}</div>
              <p className="text-xs text-stone-400 mt-2">
                {aps === 0 && 'Enter your marks above'}
                {aps > 0 && aps < 24 && 'Diploma & Certificate programmes'}
                {aps >= 24 && aps < 30 && 'Most university degrees accessible'}
                {aps >= 30 && aps < 38 && 'Wide range of degrees accessible'}
                {aps >= 38 && 'Competitive for top university programmes'}
              </p>
            </div>

            {/* APS Goal progress bar */}
            {apsGoal > 0 && aps > 0 && (
              <div className="bg-white rounded-2xl border border-stone-200 p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-stone-400">APS Goal Progress</p>
                  <span className={`text-xs font-black ${aps >= apsGoal ? 'text-emerald-600' : 'text-stone-600'}`}>
                    {aps} / {apsGoal}
                  </span>
                </div>
                <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, Math.round((aps / apsGoal) * 100))}%` }}
                    transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                    className={`h-full rounded-full ${aps >= apsGoal ? 'bg-emerald-500' : 'bg-amber-500'}`}
                  />
                </div>
                {aps < apsGoal && (
                  <p className="text-[11px] text-stone-400 mt-1.5">
                    {apsGoal - aps} more point{apsGoal - aps !== 1 ? 's' : ''} to reach your goal
                  </p>
                )}
                {aps >= apsGoal && (
                  <p className="text-[11px] text-emerald-600 font-bold mt-1.5">Goal reached.</p>
                )}
              </div>
            )}

            {/* APS Roadmap — engine-powered, shown when marks loaded + goal set */}
            {apsRoadmap.length > 0 && apsGoal > aps && (
              <div className="bg-white rounded-2xl border border-stone-200 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-stone-400 mb-1">APS Roadmap</p>
                <p className="text-xs text-stone-400 mb-3">
                  +{apsGoal - aps} needed · Prioritised by biggest gain
                </p>
                <div className="space-y-2">
                  {apsRoadmap.map((step, i) => (
                    <div key={i} className="flex items-center gap-3 py-2 border-b border-stone-100 last:border-0">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-stone-900 truncate">{step.subject}</p>
                        <p className="text-[11px] text-stone-400">
                          {step.currentPct}% → {step.targetPct}%
                          <span className="ml-1 text-stone-300">
                            (L{step.currentLevel} → L{step.targetLevel})
                          </span>
                        </p>
                      </div>
                      <span className="shrink-0 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-black px-2.5 py-1 rounded-full">
                        +{step.apsGain} pt{step.apsGain !== 1 ? 's' : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* NQF conversion guide */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-stone-400 mb-3 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                NQF Conversion Guide
              </p>
              <div className="space-y-1">
                {[
                  [7, '80–100%', 'Outstanding'],
                  [6, '70–79%', 'Meritorious'],
                  [5, '60–69%', 'Substantial'],
                  [4, '50–59%', 'Adequate'],
                  [3, '40–49%', 'Moderate'],
                  [2, '30–39%', 'Elementary'],
                  [1, '0–29%', 'Not achieved'],
                ].map(([level, range, label]) => (
                  <div key={level} className="flex items-center gap-2 text-xs">
                    <span className={`w-6 h-6 rounded-md flex items-center justify-center text-[11px] font-bold shrink-0 ${nqfColor(Number(level))}`}>
                      {level}
                    </span>
                    <span className="font-semibold text-stone-700 w-16 shrink-0">{range}</span>
                    <span className="text-stone-400">{label}</span>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-[10px] text-stone-400 border-t border-stone-100 pt-2">
                Life Orientation is capped at level 1 (max 1 APS point) at most universities.
              </p>
            </div>
          </div>

          {/* ── Right: Degree Results ── */}
          <div className="space-y-4">

            {/* ── Goal Planner toggle ── */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowGoalPlanner(s => !s)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-black transition-all ${
                  showGoalPlanner
                    ? 'bg-brand-dark text-white'
                    : 'bg-white border border-stone-200 text-stone-600 hover:border-stone-400'
                }`}
              >
                <Target className="w-4 h-4" />
                {showGoalPlanner ? 'Hide Goal Planner' : 'Set a Target APS'}
              </button>
              {showGoalPlanner && targetAps > 0 && (
                <span className="text-[11px] font-black uppercase tracking-[0.18em] text-stone-400">
                  Target: {targetAps} APS
                </span>
              )}
            </div>

            {/* ── Goal Planner panel ── */}
            <AnimatePresence>
              {showGoalPlanner && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                  className="bg-white rounded-2xl border border-stone-200 p-6"
                >
                  {/* Part 1 — Target APS input */}
                  <p className="text-[11px] font-black uppercase tracking-[0.22em] text-stone-400 mb-3">
                    Target APS
                  </p>
                  <div className="flex items-center gap-3 flex-wrap mb-4">
                    <input
                      type="number"
                      min={aps + 1}
                      max={56}
                      value={targetAps || ''}
                      onChange={e => {
                        const val = Math.min(56, Math.max(0, Number(e.target.value)));
                        setTargetAps(val);
                        setApsGoal(val);
                      }}
                      placeholder="—"
                      className="rounded-xl border border-stone-200 w-24 text-center font-black text-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stone-900/20 focus:border-stone-400 transition"
                    />
                    <div className="flex items-center gap-2">
                      {[30, 35, 40].map(t => (
                        <button
                          key={t}
                          onClick={() => { setTargetAps(t); setApsGoal(t); }}
                          className={`bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                            targetAps === t ? 'bg-stone-200 ring-1 ring-stone-400' : ''
                          }`}
                        >
                          APS {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Part 2 — Gap analysis */}
                  {targetAps > aps && (() => {
                    const gap = targetAps - aps;
                    const activeSubjects = subjects.filter(s => s.percent > 0);

                    // Compute gain per subject
                    const NQF_THRESHOLDS = [30, 40, 50, 60, 70, 80];
                    type SubjectGain = { subject: StudentSubject; label: string; threshold: number; gain: number };
                    const rows: SubjectGain[] = activeSubjects.map(s => {
                      const currentLevel = percentToNQF(s.percent);
                      const nextThresh = NQF_THRESHOLDS.find(t => t > s.percent);
                      if (!nextThresh || currentLevel >= 7) {
                        return { subject: s, label: NSC_SUBJECTS.find(n => n.value === s.code)?.label ?? s.code, threshold: 100, gain: 0 };
                      }
                      const nextLevel = percentToNQF(nextThresh);
                      const rawGain = nextLevel - currentLevel;
                      const gain = s.code === 'life-orientation'
                        ? Math.min(nextLevel, 1) - Math.min(currentLevel, 1)
                        : rawGain;
                      return {
                        subject: s,
                        label: NSC_SUBJECTS.find(n => n.value === s.code)?.label ?? s.code,
                        threshold: nextThresh,
                        gain,
                      };
                    });

                    const improvable = rows
                      .filter(r => r.gain > 0)
                      .sort((a, b) => b.gain - a.gain || a.label.localeCompare(b.label));
                    const allMaxed = improvable.length === 0;

                    return (
                      <div className="mb-6">
                        <p className="text-[11px] font-black uppercase tracking-[0.22em] text-stone-400 mb-2 flex items-center gap-1.5">
                          <TrendingUp className="w-3.5 h-3.5" />
                          How to Get There
                        </p>
                        <p className="text-sm text-stone-600 mb-4">
                          You need <strong>{gap}</strong> more APS point{gap !== 1 ? 's' : ''}.
                        </p>
                        {allMaxed ? (
                          <p className="text-sm text-emerald-600 font-semibold">
                            All subjects are at maximum NQF level. Well done!
                          </p>
                        ) : (
                          <div className="rounded-xl border border-stone-100 divide-y divide-stone-100 overflow-hidden">
                            {improvable.map(row => (
                              <div key={row.subject.code} className="flex items-center gap-3 px-4 py-3">
                                <span className="text-sm font-bold text-stone-900 flex-1 min-w-0 truncate">
                                  {row.label}
                                </span>
                                <span className="text-xs text-stone-400 shrink-0">
                                  {row.subject.percent}% → {row.threshold}%
                                </span>
                                <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-black px-2.5 py-0.5 rounded-full shrink-0">
                                  +{row.gain} pt{row.gain !== 1 ? 's' : ''}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* Part 3 — Degrees unlocked at target */}
                  {targetAps > 0 && (() => {
                    const unlocked = DEGREE_DATA.filter(d => d.minAPS <= targetAps && d.minAPS > aps);
                    const shown = unlocked.slice(0, 8);
                    const extra = unlocked.length - shown.length;

                    return (
                      <div>
                        <p className="text-[11px] font-black uppercase tracking-[0.22em] text-stone-400 mb-3">
                          Degrees You'll Unlock at APS {targetAps}
                        </p>
                        {unlocked.length === 0 ? (
                          <p className="text-sm text-stone-400">No additional degrees unlock at this target.</p>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {shown.map(d => (
                              <span
                                key={d.id}
                                className="bg-stone-100 text-stone-700 text-xs font-bold px-3 py-1.5 rounded-full"
                              >
                                {d.degree} — {d.shortName}
                              </span>
                            ))}
                            {extra > 0 && (
                              <span className="bg-stone-100 text-stone-500 text-xs font-bold px-3 py-1.5 rounded-full">
                                +{extra} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Filters bar */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm px-4 py-3">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-stone-500">
                  <Filter className="w-3.5 h-3.5" />
                  Filter
                </div>

                {/* Field filter */}
                <div className="relative">
                  <select
                    value={fieldFilter}
                    onChange={e => setFieldFilter(e.target.value as FieldOfStudy | 'All')}
                    className="appearance-none bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 pr-7 text-xs font-semibold text-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-900/20 focus:border-stone-400 transition"
                  >
                    <option value="All">All Fields</option>
                    {FIELDS_OF_STUDY.map(f => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-stone-400 pointer-events-none" />
                </div>

                {/* University filter */}
                <div className="relative">
                  <select
                    value={uniFilter}
                    onChange={e => setUniFilter(e.target.value)}
                    className="appearance-none bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 pr-7 text-xs font-semibold text-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-900/20 focus:border-stone-400 transition"
                  >
                    <option value="All">All Universities</option>
                    {UNIVERSITIES.map(u => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-stone-400 pointer-events-none" />
                </div>

                {/* Qualifying only toggle */}
                <button
                  onClick={() => setShowOnlyQualifying(v => !v)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                    showOnlyQualifying
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-stone-50 text-stone-600 border-stone-200 hover:border-stone-400'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Qualifying only
                </button>

                {/* Count */}
                <div className="ml-auto text-xs text-stone-400 shrink-0">
                  <span className="font-bold text-emerald-600">{qualifyingCount}</span> qualifying
                  {' · '}
                  <span className="font-bold text-stone-700">{filteredDegrees.length}</span> shown
                </div>
              </div>
            </div>

            {/* Degree cards */}
            {filteredDegrees.length === 0 ? (
              <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center">
                <GraduationCap className="w-10 h-10 text-stone-200 mx-auto mb-3" />
                <p className="text-sm font-semibold text-stone-500">No degrees match your filters</p>
                <p className="text-xs text-stone-400 mt-1">Try adjusting the field or university filter</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredDegrees.map(({ degree }) => (
                  <DegreeCard
                    key={degree.id}
                    degree={degree}
                    subjects={subjects.filter(s => s.percent > 0)}
                    aps={aps}
                  />
                ))}
              </div>
            )}

            {/* Disclaimer */}
            <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
              <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700 leading-relaxed">
                <strong>Disclaimer:</strong> APS scores and subject requirements are indicative and may change each year.
                Always verify directly with the university before applying. Some programmes have additional entry requirements
                (portfolio, interview, NBT tests).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
