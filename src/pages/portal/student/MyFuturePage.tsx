import { useEffect, useState, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, BookOpen, GraduationCap, ArrowRight, TrendingUp, Briefcase, Award, ChevronLeft, type LucideIcon } from 'lucide-react';
import { Shimmer } from './StudentHomePage';
import { fetchStudentProgress, type StudyProgress } from '../../../lib/studyProgress';
import { fetchQuizResults, fetchApsScore, fetchSavedBursaryIds } from '../../../lib/myFuture';
import { computeQuizResults, type QuizResults } from '../../../features/careers/data/quizScoringLogic';
import { bursaries, type Bursary } from '../../../features/careers/data/bursaries';
import { DEGREE_DATA } from '../../../data/apsData';
import type { StudentSession } from '../../../lib/auth';
import { getStudentGoals, saveStudentGoals, type StudentGoals } from '../../../lib/studentGoals';
import { computeStudentInsights } from '../../../lib/studentInsights';
import { buildGrowthTimeline, getCompletedInterventions, getOutcomes } from '../../../lib/interventions';
import ApsCalculatorPage from './ApsCalculatorPage';

const BursariesPage   = lazy(() => import('../../../features/careers/pages/BursariesPage'));
const CareersPage     = lazy(() => import('../../../features/careers/pages/CareersPageNew'));
const QuizPage        = lazy(() => import('../../../features/careers/pages/QuizPage'));
type SubView = null | 'quiz' | 'careers' | 'bursaries' | 'aps';

interface MyFuturePageProps {
  session: StudentSession;
  onNavigate: (page: string) => void;
  initialSubView?: SubView;
}

// ── Small shared components ───────────────────────────────────────────────────

const ease = [0.23, 1, 0.32, 1] as [number, number, number, number];

function Eyebrow({ children, icon: Icon }: { children: React.ReactNode; icon?: LucideIcon }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      {Icon && <Icon className="w-3.5 h-3.5 text-stone-500" />}
      <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-stone-500">
        {children}
      </p>
    </div>
  );
}

function Section({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

function CtaCard({
  icon: Icon,
  title,
  subtitle,
  onClick,
}: {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  onClick: () => void;
}) {
  return (
    <motion.button whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className="w-full text-left rounded px-6 py-5 flex items-center gap-4 transition-colors group relative overflow-hidden"
      style={{
        background: 'linear-gradient(155deg, #4b5568 0%, #3c4657 100%)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05), 0 1px 2px rgba(0,0,0,0.12), 0 6px 14px -6px rgba(0,0,0,0.18)',
      }}
    >
      <div className="w-10 h-10 rounded bg-white/10 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white font-semibold text-[14px]">{title}</p>
        <p className="text-white/50 text-[12px] mt-0.5">{subtitle}</p>
      </div>
      <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-white/60 transition-colors shrink-0" />
    </motion.button>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function MyFuturePage({ session, onNavigate, initialSubView = null }: MyFuturePageProps) {
  const [progress,        setProgress]        = useState<StudyProgress[]>([]);
  const [quizResults,     setQuizResults]     = useState<QuizResults | null>(null);
  const [apsData,         setApsData]         = useState<{ aps: number; subjects: { code: string; percent: number }[] } | null>(null);
  const [savedBursaries,  setSavedBursaries]  = useState<Bursary[]>([]);
  const [loading,         setLoading]         = useState(true);
  const [subView,         setSubView]         = useState<SubView>(initialSubView);
  const [completedInv,    setCompletedInv]    = useState<import('../../../lib/interventions').Intervention[]>([]);
  const [interventionOutcomes, setInterventionOutcomes] = useState<import('../../../lib/interventions').Outcome[]>([]);

  const [goals,        setGoals]        = useState<StudentGoals>(() => getStudentGoals(session.student_id));
  const [editingGoals, setEditingGoals] = useState(false);
  const [draftAps,     setDraftAps]     = useState<string>('');
  const [draftCareer,  setDraftCareer]  = useState<string>('');

  function handleSaveGoals() {
    const targetAps = draftAps ? Math.min(56, Math.max(1, Number(draftAps))) : null;
    const targetCareer = draftCareer.trim() || null;
    const updated = saveStudentGoals(session.student_id, { targetAps, targetCareer });
    setGoals(updated);
    setEditingGoals(false);
  }

  function handleEditGoals() {
    setDraftAps(goals.targetAps ? String(goals.targetAps) : '');
    setDraftCareer(goals.targetCareer ?? '');
    setEditingGoals(true);
  }

  // Sub-view navigate handler — keeps everything inside MyFuturePage
  function handleSubNavigate(page: string) {
    const internalPages: SubView[] = ['quiz', 'careers', 'bursaries', 'aps'];
    if (internalPages.includes(page as SubView)) {
      setSubView(page as SubView);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (page === 'student-dashboard') {
      setSubView(null);
    } else {
      onNavigate(page);
    }
  }

  // Re-sync when the parent asks us to open a specific sub-view (e.g. a quick
  // action elsewhere in the portal linking straight into "APS & Unis").
  useEffect(() => {
    if (initialSubView) setSubView(initialSubView);
  }, [initialSubView]);

  useEffect(() => {
    const { student_id, school_id } = session;

    Promise.all([
      fetchStudentProgress(student_id, school_id),
      fetchQuizResults(student_id, school_id),
      fetchApsScore(student_id, school_id),
      fetchSavedBursaryIds(student_id, school_id),
    ])
      .then(([prog, quiz, aps, bursaryIds]) => {
        setProgress(prog);

        if (quiz) {
          // Re-compute from stored answers so we get the full QuizResults shape
          try {
            const results = computeQuizResults(quiz.answers);
            setQuizResults(results);
          } catch {
            // fall through — quiz stays null
          }
        }

        if (aps) {
          setApsData({ aps: aps.aps, subjects: aps.subjects });
        }

        const matched = bursaries.filter(b => bursaryIds.includes(b.id));
        setSavedBursaries(matched);
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    // Non-blocking intervention fetch
    Promise.all([
      getCompletedInterventions(student_id),
      getOutcomes(student_id),
    ]).then(([completed, outcomes]) => {
      setCompletedInv(completed);
      setInterventionOutcomes(outcomes);
    });
  }, [session.student_id, session.school_id]);

  // ── Derived values ────────────────────────────────────────────────────────

  const topCareerScore   = quizResults?.topCareerMatches?.[0]?.compatibilityScore ?? null;
  const topicsMastered   = progress.filter(p => p.mastery_level === 'mastered').length;
  const topicsStarted    = progress.filter(p => p.mastery_level !== 'not_started').length;
  const topicsNeedPractice = progress.filter(p => p.mastery_level === 'needs_practice').length;

  const qualifyingDegrees = apsData
    ? DEGREE_DATA.filter(d => apsData.aps >= d.minAPS).slice(0, 3)
    : [];
  const closeDegrees = apsData
    ? DEGREE_DATA.filter(d => apsData.aps < d.minAPS && d.minAPS - apsData.aps <= 5).slice(0, 3)
    : [];

  const bySubject: Record<string, StudyProgress[]> = {};
  for (const p of progress) {
    if (!bySubject[p.subject]) bySubject[p.subject] = [];
    bySubject[p.subject].push(p);
  }

  // ── Intelligence engine ───────────────────────────────────────────────────
  // completedInv + interventionOutcomes loaded async into state above
  const todayStr = new Date().toISOString().slice(0, 10);
  const futureInsights = computeStudentInsights([], [], progress, goals, todayStr, completedInv, interventionOutcomes);
  const { milestones, learnerStatus } = futureInsights;

  // ── Growth timeline (pure — receives pre-fetched arrays) ─────────────────
  const growthTimeline = buildGrowthTimeline(
    completedInv,
    interventionOutcomes,
    [],   // no marks on this page
    { targetAps: goals.targetAps, targetCareer: goals.targetCareer, updatedAt: goals.updatedAt },
  );

  // ── Loading skeleton ──────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="student-home min-h-full pb-16 relative">
        <div className="relative overflow-hidden">
          <div className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-8 sm:pt-11 pb-6 sm:pb-8 w-full">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }}
              className="flex items-center gap-2 min-w-0">
              <p className="text-[12px] text-[rgba(31,36,33,0.5)] font-medium truncate">
                {session.school_name} · Grade {session.grade}{session.cohort_name ? ` · ${session.cohort_name}` : ''}
              </p>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease, delay: 0.06 }}
              className="text-brand-dark text-[32px] sm:text-[42px] leading-[1.12] mt-2 min-w-0"
              style={{ fontFamily: 'var(--font-instrument)', fontWeight: 500, letterSpacing: '-0.02em' }}>
              My Future
            </motion.h1>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-8 pt-2 sm:pt-3 space-y-5">
          {[0, 1, 2].map(i => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.06, ease }}
              className="paper-card rounded p-5"
            >
              <Shimmer className="h-3 w-24 mb-3" />
              <Shimmer className="h-5 w-2/3" />
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  // ── Sub-view rendering — inline, no app-level navigation ─────────────────
  if (subView) {
    const SubSpinner = () => (
      <div className="flex items-center justify-center py-24">
        <div className="w-5 h-5 border-2 border-brand-border border-t-stone-700 rounded-full animate-spin" />
      </div>
    );
    return (
      <div className="student-home min-h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={subView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease }}
          >
            {/* Back to My Future */}
            <div className="px-5 pt-5 pb-2">
              <button
                onClick={() => { setSubView(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-stone-500 hover:text-brand-dark transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> My Future
              </button>
            </div>

            <Suspense fallback={<SubSpinner />}>
              {subView === 'quiz'      && <QuizPage     onNavigate={handleSubNavigate} />}
              {subView === 'careers'   && <CareersPage  onNavigate={handleSubNavigate} />}
              {subView === 'bursaries' && <BursariesPage onNavigate={handleSubNavigate} />}
              {subView === 'aps'       && <ApsCalculatorPage session={session} />}
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  // ── Page ──────────────────────────────────────────────────────────────────

  return (
    <div className="student-home min-h-full pb-16 relative">

      {/* ═══ Hero — wave-strip system, matches Home dashboard ═══
          No buttons in this band (house rule). Stat readouts below the
          title are static pills, not actions. */}
      <div className="relative overflow-hidden">

        <div className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-8 sm:pt-11 pb-6 sm:pb-8 w-full">

          {/* Eyebrow row */}
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="flex items-center gap-2 min-w-0"
          >
            <p className="text-[12px] text-[rgba(31,36,33,0.5)] font-medium truncate">
              {session.school_name} · Grade {session.grade}{session.cohort_name ? ` · ${session.cohort_name}` : ''}
            </p>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease, delay: 0.06 }}
            className="text-brand-dark text-[32px] sm:text-[42px] leading-[1.12] mt-2 min-w-0"
            style={{ fontFamily: 'var(--font-instrument)', fontWeight: 500, letterSpacing: '-0.02em' }}
          >
            My Future
          </motion.h1>

          {/* Stat pills — static readouts, not actions */}
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease, delay: 0.1 }}
            className="flex flex-wrap gap-2 mt-4"
          >
            {[
              { value: apsData ? String(apsData.aps) : '—', label: 'APS' },
              { value: String(topicsMastered),              label: 'Mastered' },
              { value: topCareerScore !== null ? `${topCareerScore}%` : '—', label: 'Career Fit' },
            ].map(stat => (
              <div key={stat.label}
                className="inline-flex items-center gap-2 border border-brand-border bg-white/70 rounded-full pl-3 pr-4 py-1.5">
                <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-[rgba(31,36,33,0.5)]">{stat.label}</span>
                <span className="font-black text-sm text-brand-dark">{stat.value}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ═══ Body ═════════════════════════════════════════════ */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 relative z-10 pt-2 sm:pt-3 space-y-6">

      {/* ── Goals section ── */}
      <Section delay={0.02}>
        {!editingGoals ? (
          <div className="paper-card rounded p-5">
            <div className="flex items-center justify-between mb-1">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-stone-500">My Goals</p>
              <button
                onClick={handleEditGoals}
                className="text-[11px] font-black text-stone-500 hover:text-brand-dark transition-colors uppercase tracking-widest"
              >
                {goals.targetAps || goals.targetCareer ? 'Edit' : 'Set Goals'}
              </button>
            </div>

            {!goals.targetAps && !goals.targetCareer ? (
              <p className="text-sm text-stone-500 mt-2">
                Set a target APS or career to get personalised recommendations across the portal.
              </p>
            ) : (
              <div className="flex flex-wrap gap-3 mt-3">
                {goals.targetAps && (
                  <div className="flex items-center gap-2 bg-violet-50 border border-violet-100 rounded px-4 py-2.5">
                    <GraduationCap className="w-4 h-4 text-violet-500 shrink-0" />
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-violet-400">Target APS</p>
                      <p className="font-black text-violet-700 text-lg leading-none">{goals.targetAps}</p>
                    </div>
                    {apsData && (
                      <div className="ml-2 pl-2 border-l border-violet-200">
                        <p className="text-[10px] font-bold text-violet-400">Current</p>
                        <p className={`font-black text-sm ${apsData.aps >= goals.targetAps ? 'text-emerald-600' : 'text-violet-600'}`}>
                          {apsData.aps}
                        </p>
                      </div>
                    )}
                  </div>
                )}
                {goals.targetCareer && (
                  <div className="flex items-center gap-2 bg-stone-50 border border-brand-border rounded px-4 py-2.5">
                    <Briefcase className="w-4 h-4 text-stone-500 shrink-0" />
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-stone-500">Target Career</p>
                      <p className="font-black text-stone-800 text-sm leading-tight">{goals.targetCareer}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* Edit mode */
          <div className="paper-card rounded p-5">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-stone-500 mb-4">Set Your Goals</p>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-black text-stone-700 block mb-1.5">
                  Target APS Score
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={1}
                    max={56}
                    value={draftAps}
                    onChange={e => setDraftAps(e.target.value)}
                    placeholder="e.g. 35"
                    className="w-24 text-center font-black text-lg rounded border border-brand-border py-2.5 focus:outline-none focus:border-stone-400 focus:ring-2 focus:ring-brand-dark/10 bg-stone-50"
                  />
                  <div className="flex gap-2">
                    {[28, 32, 36, 40].map(n => (
                      <button
                        key={n}
                        onClick={() => setDraftAps(String(n))}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-black transition-colors border ${
                          draftAps === String(n)
                            ? 'bg-brand-dark text-white border-brand-dark'
                            : 'bg-stone-50 text-stone-500 border-brand-border hover:border-stone-400'
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-black text-stone-700 block mb-1.5">
                  Target Career
                </label>
                <input
                  type="text"
                  value={draftCareer}
                  onChange={e => setDraftCareer(e.target.value)}
                  placeholder="e.g. Civil Engineer, Teacher, Nurse"
                  className="w-full rounded border border-brand-border px-4 py-2.5 text-sm font-bold text-brand-dark placeholder:text-stone-400 focus:outline-none focus:border-stone-400 focus:ring-2 focus:ring-brand-dark/10 bg-stone-50"
                />
                {/* Quick picks from quiz results if available */}
                {quizResults && quizResults.topCareerMatches.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {quizResults.topCareerMatches.slice(0, 4).map(c => (
                      <button
                        key={c.id}
                        onClick={() => setDraftCareer(c.title)}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-stone-50 text-stone-500 border border-brand-border hover:border-stone-400 transition-colors"
                      >
                        {c.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2 mt-5">
              <button
                onClick={handleSaveGoals}
                className="flex-1 py-2.5 rounded bg-brand-dark text-white font-black text-sm hover:bg-stone-700 transition-colors"
              >
                Save Goals
              </button>
              <button
                onClick={() => setEditingGoals(false)}
                className="px-4 py-2.5 rounded border border-brand-border text-stone-500 font-black text-sm hover:border-stone-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </Section>

      {/* ── Section 2: Explore — free features with backend ─────────────────── */}
      <Section delay={0.04}>
        <Eyebrow icon={Sparkles}>Explore</Eyebrow>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

          {/* Career Quiz */}
          <button
            onClick={() => handleSubNavigate('quiz')}
            className="paper-card rounded p-5 text-left hover:border-stone-400 transition-colors group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-9 h-9 rounded bg-stone-100 flex items-center justify-center">
                <Sparkles className="w-4.5 h-4.5 text-stone-700" />
              </div>
              <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-stone-600 transition-colors mt-1" />
            </div>
            <p className="font-black text-brand-dark text-sm mb-0.5">Career Quiz</p>
            <p className="text-xs text-stone-500 leading-snug">
              {quizResults
                ? `${quizResults.topCodes[0]}+${quizResults.topCodes[1]} profile · ${quizResults.topCareerMatches[0]?.title ?? 'View matches'}`
                : 'Discover careers that match your personality'}
            </p>
          </button>

          {/* Career Browser */}
          <button
            onClick={() => handleSubNavigate('careers')}
            className="paper-card rounded p-5 text-left hover:border-stone-400 transition-colors group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-9 h-9 rounded bg-stone-100 flex items-center justify-center">
                <Briefcase className="w-4.5 h-4.5 text-stone-700" />
              </div>
              <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-stone-600 transition-colors mt-1" />
            </div>
            <p className="font-black text-brand-dark text-sm mb-0.5">Career Browser</p>
            <p className="text-xs text-stone-500 leading-snug">
              {quizResults
                ? `${quizResults.topCareerMatches.length} career matches found`
                : 'Browse 400+ SA careers with salary data'}
            </p>
          </button>

          {/* Bursary Finder */}
          <button
            onClick={() => handleSubNavigate('bursaries')}
            className="paper-card rounded p-5 text-left hover:border-stone-400 transition-colors group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-9 h-9 rounded bg-stone-100 flex items-center justify-center">
                <Award className="w-4.5 h-4.5 text-stone-700" />
              </div>
              <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-stone-600 transition-colors mt-1" />
            </div>
            <p className="font-black text-brand-dark text-sm mb-0.5">Bursary Finder</p>
            <p className="text-xs text-stone-500 leading-snug">
              {savedBursaries.length > 0
                ? `${savedBursaries.length} saved · Browse 245+ bursaries`
                : 'Browse 245+ bursaries and save your favourites'}
            </p>
          </button>

          {/* APS Calculator */}
          <button
            onClick={() => handleSubNavigate('aps')}
            className="paper-card rounded p-5 text-left hover:border-stone-400 transition-colors group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-9 h-9 rounded bg-stone-100 flex items-center justify-center">
                <GraduationCap className="w-4.5 h-4.5 text-stone-700" />
              </div>
              <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-stone-600 transition-colors mt-1" />
            </div>
            <p className="font-black text-brand-dark text-sm mb-0.5">APS Calculator</p>
            <p className="text-xs text-stone-500 leading-snug">
              {apsData
                ? `Your APS: ${apsData.aps} · ${qualifyingDegrees.length} programmes unlocked`
                : 'Calculate your APS and see qualifying programmes'}
            </p>
          </button>

        </div>
      </Section>

      {/* ── Section 3: Career Matches ────────────────────────────────────────── */}
      <Section delay={0.1}>
        <Eyebrow icon={Briefcase}>Your Career Matches</Eyebrow>

        {quizResults ? (
          <>
            <h2 className="font-black text-brand-dark mb-1" style={{ fontSize: 'clamp(1.15rem, 2vw, 1.5rem)' }}>
              Based on your {quizResults.topCodes[0]} + {quizResults.topCodes[1]} profile
            </h2>
            <p className="text-stone-500 text-sm mb-5 max-w-2xl leading-relaxed">
              {quizResults.profileDescription}
            </p>
            <div className="space-y-3">
              {quizResults.topCareerMatches.slice(0, 5).map((career, i) => (
                <motion.div
                  key={career.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.05, ease: [0.23, 1, 0.32, 1] }}
                  className="paper-card rounded px-5 py-4 flex items-center gap-4"
                >
                  <div className="shrink-0 bg-brand-dark text-white rounded px-3 py-1.5 text-center min-w-16">
                    <p className="font-black text-sm leading-none">{career.compatibilityScore}%</p>
                    <p className="text-white/50 text-[9px] uppercase tracking-wider mt-0.5">match</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-brand-dark text-sm leading-tight truncate">{career.title}</p>
                    <p className="text-xs text-stone-500 mt-0.5 truncate">{career.category}</p>
                    <span className="inline-block mt-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600">
                      {career.educationPath}
                    </span>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-stone-600">{career.salaryRange}</p>
                    <p className="text-xs text-stone-500 mt-0.5">
                      {career.apsRequired ? `APS ${career.apsRequired}` : 'No APS required'}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
            <button
              onClick={() => handleSubNavigate('careers')}
              className="mt-4 flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-brand-dark transition-colors"
            >
              Browse all careers <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </>
        ) : (
          <CtaCard
            icon={Sparkles}
            title="Take the Career Quiz"
            subtitle="Discover which careers match your personality"
            onClick={() => handleSubNavigate('quiz')}
          />
        )}
      </Section>

      {/* ── Section 4: APS & University Readiness ───────────────────────────── */}
      <Section delay={0.16}>
        <Eyebrow icon={GraduationCap}>APS &amp; University Readiness</Eyebrow>

        {apsData ? (
          <div className="paper-card rounded px-6 py-5">
            <div className="flex items-end gap-3 mb-5">
              <span className="font-black text-brand-dark leading-none" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}>
                {apsData.aps}
              </span>
              <span className="text-stone-500 text-sm font-bold mb-1.5">APS Score</span>
            </div>
            {qualifyingDegrees.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-bold text-stone-500 mb-2">You qualify for:</p>
                <div className="flex flex-wrap gap-2">
                  {qualifyingDegrees.map(d => (
                    <span key={d.id} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                      ✓ {d.degree} — {d.shortName}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {closeDegrees.length > 0 && (
              <div>
                <p className="text-xs font-bold text-stone-500 mb-2">Almost there:</p>
                <div className="flex flex-wrap gap-2">
                  {closeDegrees.map(d => (
                    <span key={d.id} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold">
                      Almost — {d.degree} (need {d.minAPS - apsData.aps} more)
                    </span>
                  ))}
                </div>
              </div>
            )}
            {qualifyingDegrees.length === 0 && closeDegrees.length === 0 && (
              <p className="text-stone-500 text-sm">Keep improving your marks to unlock university programmes.</p>
            )}
            <button
              onClick={() => handleSubNavigate('aps')}
              className="mt-4 flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-brand-dark transition-colors"
            >
              Open APS Calculator <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <CtaCard
            icon={GraduationCap}
            title="Calculate Your APS"
            subtitle="See which universities and programmes you qualify for"
            onClick={() => handleSubNavigate('aps')}
          />
        )}
      </Section>

      {/* ── Section 5: Study Progress ────────────────────────────────────────── */}
      <Section delay={0.22}>
        <Eyebrow icon={BookOpen}>Study Progress</Eyebrow>

        {progress.length === 0 ? (
          <div className="paper-card rounded px-6 py-6 text-center">
            <p className="text-stone-500 text-sm mb-4">
              You haven't started any lessons yet. Open the Library to begin.
            </p>
            <button
              onClick={() => onNavigate('library')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-dark text-white text-sm font-bold rounded hover:bg-brand-dark/90 transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              Open Library
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { label: 'Started',        value: topicsStarted,      color: 'text-brand-dark' },
                { label: 'Mastered',       value: topicsMastered,     color: 'text-emerald-600' },
                { label: 'Needs Practice', value: topicsNeedPractice, color: 'text-amber-600' },
              ].map(stat => (
                <div key={stat.label} className="paper-card rounded px-4 py-4 text-center">
                  <p className={`font-black text-2xl ${stat.color}`}>{stat.value}</p>
                  <p className="text-xs text-stone-500 font-bold mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
            <div className="paper-card rounded divide-y divide-stone-100">
              {Object.entries(bySubject).map(([subject, topics]) => {
                const total    = topics.length;
                const mastered = topics.filter(t => t.mastery_level === 'mastered').length;
                const pct      = total > 0 ? (mastered / total) * 100 : 0;
                return (
                  <div key={subject} className="flex items-center gap-4 px-5 py-3">
                    <div className="w-32 shrink-0">
                      <p className="text-xs font-bold text-stone-700 truncate">{subject}</p>
                    </div>
                    <div className="flex-1 bg-stone-200 rounded-full h-1.5 overflow-hidden">
                      <div className="h-full bg-brand-dark rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="w-20 text-right shrink-0">
                      <p className="text-xs text-stone-500 font-bold">{mastered} / {total} mastered</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </Section>

      {/* ── Section 6: Saved Bursaries ───────────────────────────────────────── */}
      <Section delay={0.28}>
        <Eyebrow icon={Award}>Saved Bursaries</Eyebrow>

        {savedBursaries.length > 0 ? (
          <div className="paper-card rounded">
            <div className="divide-y divide-stone-100">
              {savedBursaries.slice(0, 3).map(b => (
                <div key={b.id} className="flex items-center gap-4 px-5 py-3.5">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-brand-dark truncate">{b.name}</p>
                    <p className="text-xs text-stone-500 truncate">{b.provider}</p>
                  </div>
                  <span className="shrink-0 text-[10px] font-bold px-2 py-1 rounded-full bg-stone-100 text-stone-600 uppercase tracking-wide">
                    {b.category}
                  </span>
                </div>
              ))}
            </div>
            <div className="px-5 py-3 border-t border-brand-border/60">
              <button
                onClick={() => handleSubNavigate('bursaries')}
                className="flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-brand-dark transition-colors"
              >
                <TrendingUp className="w-3.5 h-3.5" />
                View all bursaries →
              </button>
            </div>
          </div>
        ) : (
          <div className="paper-card rounded px-6 py-5">
            <p className="text-stone-500 text-sm">
              No bursaries saved yet.{' '}
              <button
                onClick={() => handleSubNavigate('bursaries')}
                className="text-stone-700 font-bold hover:text-brand-dark underline underline-offset-2 transition-colors"
              >
                Browse bursaries
              </button>{' '}
              to find funding for your studies.
            </p>
          </div>
        )}
      </Section>

      {/* ── Section 7: Academic Journey Milestones ───────────────────────────── */}
      <Section delay={0.34}>
        <Eyebrow icon={TrendingUp}>Academic Journey</Eyebrow>
        <div className="paper-card rounded overflow-hidden">

          {/* Learner status header */}
          <div className={`px-5 py-4 border-b border-brand-border/60 flex items-center justify-between ${learnerStatus.bg}`}>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-stone-500 mb-0.5">Overall Status</p>
              <p className={`font-black text-xl leading-none ${learnerStatus.color}`}>{learnerStatus.label}</p>
            </div>
            <div className={`rounded px-4 py-2 text-center border ${learnerStatus.border} bg-white`}>
              <p className={`font-black text-2xl leading-none ${learnerStatus.color}`}>{learnerStatus.score}</p>
              <p className="text-[10px] font-bold text-stone-500 mt-0.5">/ 100</p>
            </div>
          </div>

          {/* Milestones list */}
          <div className="divide-y divide-stone-100">
            {milestones.map(m => (
              <div key={m.id} className="flex items-center gap-3 px-5 py-3.5">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                  m.achieved ? 'bg-emerald-500' : 'bg-stone-100'
                }`}>
                  {m.achieved ? (
                    <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-stone-300" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-bold truncate ${m.achieved ? 'text-brand-dark' : 'text-stone-500'}`}>
                    {m.label}
                  </p>
                  {m.achieved && m.detail && (
                    <p className="text-[11px] text-stone-500 truncate">{m.detail}</p>
                  )}
                </div>
                {!m.achieved && (
                  <span className="text-[10px] font-bold text-stone-400 shrink-0 uppercase tracking-widest">
                    Not yet
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Progress footer */}
          <div className="px-5 py-3 bg-stone-50 border-t border-brand-border/60">
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-[11px] font-bold text-stone-500">
                {milestones.filter(m => m.achieved).length} of {milestones.length} milestones reached
              </p>
              <p className="text-[11px] font-black text-stone-600">
                {Math.round((milestones.filter(m => m.achieved).length / milestones.length) * 100)}%
              </p>
            </div>
            <div className="h-1.5 bg-stone-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.round((milestones.filter(m => m.achieved).length / milestones.length) * 100)}%` }}
                transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1] }}
                className="h-full bg-emerald-500 rounded-full"
              />
            </div>
          </div>
        </div>
      </Section>

      {/* ── Section 8: Growth Timeline ───────────────────────────────────────── */}
      {growthTimeline.length > 0 && (
        <Section delay={0.35}>
          <Eyebrow icon={TrendingUp}>Academic Journey</Eyebrow>
          <div className="paper-card rounded overflow-hidden">
            <div className="px-5 pt-4 pb-2">
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-stone-500 mb-4">Your Story So Far</p>
              <div className="relative">
                {/* vertical spine */}
                <div className="absolute left-1.75 top-2 bottom-2 w-px bg-stone-100" />
                <div className="space-y-4">
                  {growthTimeline.map((evt, i) => {
                    const date = new Date(evt.date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });
                    const dotColor =
                      evt.type === 'goal_set'               ? 'bg-blue-400'    :
                      evt.type === 'intervention_completed' && evt.positive ? 'bg-emerald-500' :
                      evt.type === 'outcome_recorded'       && evt.positive ? 'bg-emerald-500' :
                      evt.type === 'outcome_recorded'       && evt.positive === false ? 'bg-red-400' :
                      evt.type === 'intervention_started'   ? 'bg-amber-400'   :
                      'bg-stone-300';
                    return (
                      <div key={i} className="flex items-start gap-3 pl-1">
                        <div className={`w-3.5 h-3.5 rounded-full shrink-0 mt-0.5 z-10 border-2 border-white ${dotColor}`} />
                        <div className="flex-1 min-w-0 pb-1">
                          <div className="flex items-baseline justify-between gap-2">
                            <p className="text-xs font-black text-brand-dark">{evt.label}</p>
                            <p className="text-[10px] font-bold text-stone-400 shrink-0">{date}</p>
                          </div>
                          <p className="text-[11px] text-stone-500 mt-0.5">{evt.detail}</p>
                          {evt.delta !== undefined && (
                            <span className={`inline-block mt-1 text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                              evt.positive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'
                            }`}>
                              {evt.delta > 0 ? `+${evt.delta}%` : `${evt.delta}%`}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </Section>
      )}

      </div>
    </div>
  );
}
