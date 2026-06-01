import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, BookOpen, GraduationCap, ArrowRight, TrendingUp, type LucideIcon } from 'lucide-react';
import { fetchStudentProgress, type StudyProgress } from '../../../lib/studyProgress';
import { fetchQuizResults, fetchApsScore, fetchSavedBursaryIds } from '../../../lib/myFuture';
import { computeQuizResults, type QuizResults } from '../../../features/careers/data/quizScoringLogic';
import { bursaries, type Bursary } from '../../../features/careers/data/bursaries';
import { DEGREE_DATA } from '../../../data/apsData';
import type { StudentSession } from '../../../lib/auth';

interface MyFuturePageProps {
  session: StudentSession;
  onNavigate: (page: string) => void;
}

// ── Small shared components ───────────────────────────────────────────────────

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-stone-400 mb-3">
      {children}
    </p>
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
    <button
      onClick={onClick}
      className="w-full text-left bg-stone-900 rounded-2xl px-6 py-5 flex items-center gap-4 hover:bg-stone-800 transition-colors group"
    >
      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white font-black text-sm">{title}</p>
        <p className="text-white/50 text-xs mt-0.5">{subtitle}</p>
      </div>
      <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-white/60 transition-colors shrink-0" />
    </button>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function MyFuturePage({ session, onNavigate }: MyFuturePageProps) {
  const [progress,        setProgress]        = useState<StudyProgress[]>([]);
  const [quizResults,     setQuizResults]     = useState<QuizResults | null>(null);
  const [apsData,         setApsData]         = useState<{ aps: number; subjects: { code: string; percent: number }[] } | null>(null);
  const [savedBursaries,  setSavedBursaries]  = useState<Bursary[]>([]);
  const [loading,         setLoading]         = useState(true);

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

  // ── Loading skeleton ──────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-6 h-6 border-2 border-slate-200 border-t-slate-700 rounded-full animate-spin" />
      </div>
    );
  }

  // ── Page ──────────────────────────────────────────────────────────────────

  return (
    <div className="px-6 py-8 sm:px-8 lg:px-10 max-w-5xl mx-auto space-y-8">

      {/* ── Section 1: Profile Hero ─────────────────────────────────────────── */}
      <Section delay={0}>
        <div className="rounded-3xl px-7 py-6 flex flex-col sm:flex-row sm:items-center gap-5" style={{ background: '#1C1917' }}>
          <div className="flex-1 min-w-0">
            <p className="text-white/40 text-xs font-bold uppercase tracking-[0.18em] mb-1">
              {session.school_name}
            </p>
            <h1 className="text-white font-black text-2xl leading-tight">
              {session.name} {session.surname}
            </h1>
            <p className="text-white/50 text-sm mt-0.5">
              Grade {session.grade}{session.cohort_name ? ` · ${session.cohort_name}` : ''}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 sm:shrink-0">
            {[
              { value: apsData ? String(apsData.aps) : '—', label: 'APS' },
              { value: String(topicsMastered),              label: 'Mastered' },
              { value: topCareerScore !== null ? `${topCareerScore}%` : '—', label: 'Career Fit' },
            ].map(stat => (
              <div key={stat.label} className="flex flex-col items-center bg-white/10 rounded-2xl px-4 py-3 min-w-18">
                <span className="text-white font-black text-xl leading-none">{stat.value}</span>
                <span className="text-white/40 text-[10px] font-bold uppercase tracking-wider mt-1">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── Section 2: Career Matches ────────────────────────────────────────── */}
      <Section delay={0.06}>
        <Eyebrow>Your Career Matches</Eyebrow>

        {quizResults ? (
          <>
            <h2 className="font-black text-slate-900 mb-1" style={{ fontSize: 'clamp(1.15rem, 2vw, 1.5rem)' }}>
              Based on your {quizResults.topCodes[0]} + {quizResults.topCodes[1]} profile
            </h2>
            <p className="text-slate-500 text-sm mb-5 max-w-2xl leading-relaxed">
              {quizResults.profileDescription}
            </p>

            <div className="space-y-3">
              {quizResults.topCareerMatches.slice(0, 5).map((career, i) => (
                <motion.div
                  key={career.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.05, ease: [0.23, 1, 0.32, 1] }}
                  className="bg-white rounded-2xl border border-slate-200 px-5 py-4 flex items-center gap-4"
                >
                  <div className="shrink-0 bg-stone-900 text-white rounded-xl px-3 py-1.5 text-center min-w-16">
                    <p className="font-black text-sm leading-none">{career.compatibilityScore}%</p>
                    <p className="text-white/50 text-[9px] uppercase tracking-wider mt-0.5">match</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-slate-900 text-sm leading-tight truncate">{career.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5 truncate">{career.category}</p>
                    <span className="inline-block mt-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {career.educationPath}
                    </span>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-stone-600">{career.salaryRange}</p>
                    <p className="text-xs text-stone-400 mt-0.5">
                      {career.apsRequired ? `APS ${career.apsRequired}` : 'No APS required'}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        ) : (
          <CtaCard
            icon={Sparkles}
            title="Take the Career Quiz"
            subtitle="Discover which careers match your personality →"
            onClick={() => onNavigate('quiz')}
          />
        )}
      </Section>

      {/* ── Section 3: APS & University Readiness ───────────────────────────── */}
      <Section delay={0.12}>
        <Eyebrow>APS &amp; University Readiness</Eyebrow>

        {apsData ? (
          <div className="bg-white rounded-2xl border border-slate-200 px-6 py-5">
            <div className="flex items-end gap-3 mb-5">
              <span className="font-black text-slate-900 leading-none" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}>
                {apsData.aps}
              </span>
              <span className="text-slate-400 text-sm font-bold mb-1.5">APS Score</span>
            </div>

            {qualifyingDegrees.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-bold text-slate-500 mb-2">You qualify for:</p>
                <div className="flex flex-wrap gap-2">
                  {qualifyingDegrees.map(d => (
                    <span key={d.id} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                      <span>✓</span>
                      <span>{d.degree} — {d.shortName}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {closeDegrees.length > 0 && (
              <div>
                <p className="text-xs font-bold text-slate-500 mb-2">Almost there:</p>
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
              <p className="text-slate-400 text-sm">Keep improving your marks to unlock university programmes.</p>
            )}
          </div>
        ) : (
          <CtaCard
            icon={GraduationCap}
            title="Calculate Your APS"
            subtitle="See which universities and programmes you qualify for"
            onClick={() => onNavigate('aps')}
          />
        )}
      </Section>

      {/* ── Section 4: Study Progress ────────────────────────────────────────── */}
      <Section delay={0.18}>
        <Eyebrow>Study Progress</Eyebrow>

        {progress.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 px-6 py-6 text-center">
            <p className="text-slate-500 text-sm mb-4">
              You haven't started any lessons yet. Open the Library to begin.
            </p>
            <button
              onClick={() => onNavigate('library')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-stone-900 text-white text-sm font-bold rounded-xl hover:bg-stone-800 transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              Open Library
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { label: 'Started',        value: topicsStarted,      color: 'text-slate-900' },
                { label: 'Mastered',       value: topicsMastered,     color: 'text-emerald-600' },
                { label: 'Needs Practice', value: topicsNeedPractice, color: 'text-amber-600' },
              ].map(stat => (
                <div key={stat.label} className="bg-white rounded-2xl border border-slate-200 px-4 py-4 text-center">
                  <p className={`font-black text-2xl ${stat.color}`}>{stat.value}</p>
                  <p className="text-xs text-slate-400 font-bold mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100">
              {Object.entries(bySubject).map(([subject, topics]) => {
                const total   = topics.length;
                const mastered = topics.filter(t => t.mastery_level === 'mastered').length;
                const pct     = total > 0 ? (mastered / total) * 100 : 0;
                return (
                  <div key={subject} className="flex items-center gap-4 px-5 py-3">
                    <div className="w-32 shrink-0">
                      <p className="text-xs font-bold text-slate-700 truncate">{subject}</p>
                    </div>
                    <div className="flex-1 bg-stone-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full bg-stone-900 rounded-full transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="w-20 text-right shrink-0">
                      <p className="text-xs text-slate-500 font-bold">{mastered} / {total} mastered</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </Section>

      {/* ── Section 5: Saved Bursaries ───────────────────────────────────────── */}
      <Section delay={0.24}>
        <Eyebrow>Saved Bursaries</Eyebrow>

        {savedBursaries.length > 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200">
            <div className="divide-y divide-slate-100">
              {savedBursaries.slice(0, 3).map(b => (
                <div key={b.id} className="flex items-center gap-4 px-5 py-3.5">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-slate-900 truncate">{b.name}</p>
                    <p className="text-xs text-slate-400 truncate">{b.provider}</p>
                  </div>
                  <span className="shrink-0 text-[10px] font-bold px-2 py-1 rounded-full bg-slate-100 text-slate-600 uppercase tracking-wide">
                    {b.category}
                  </span>
                </div>
              ))}
            </div>
            <div className="px-5 py-3 border-t border-slate-100">
              <button
                onClick={() => onNavigate('bursaries')}
                className="flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-stone-900 transition-colors"
              >
                <TrendingUp className="w-3.5 h-3.5" />
                View all bursaries →
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 px-6 py-5">
            <p className="text-slate-400 text-sm">
              No bursaries saved yet.{' '}
              <button
                onClick={() => onNavigate('bursaries')}
                className="text-stone-700 font-bold hover:text-stone-900 underline underline-offset-2 transition-colors"
              >
                Browse bursaries
              </button>{' '}
              to find funding for your studies.
            </p>
          </div>
        )}
      </Section>

    </div>
  );
}
