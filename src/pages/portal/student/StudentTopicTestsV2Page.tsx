import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ClipboardCheck, Clock, ChevronRight, ArrowLeft, Check,
  AlertTriangle, CheckCircle2, HourglassIcon, Sparkles,
} from 'lucide-react';
import { Shimmer } from '../../../shared/components/Shimmer';
import type { StudentSession } from '../../../lib/auth';
import {
  fetchVisibleTestsForStudent, fetchTopicTestFull, startAttempt, submitAttempt,
  fetchDistractorMisconceptions, fetchStudentAttempts,
  type VisibleTest, type TopicTestFull, type SubmittedAnswer, type StudentAttempt,
  type DistractorMisconception,
} from '../../../lib/topicTestsV2';
import { MASTERY_LABEL, MASTERY_COLOR } from '../../../lib/topicTestScoring';

const ease = [0.23, 1, 0.32, 1] as [number, number, number, number];

interface StudentTopicTestsV2PageProps { session: StudentSession; }

type Stage = 'list' | 'intro' | 'taking' | 'results';

export default function StudentTopicTestsV2Page({ session }: StudentTopicTestsV2PageProps) {
  const [stage, setStage] = useState<Stage>('list');
  const [visibleTests, setVisibleTests] = useState<VisibleTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<VisibleTest | null>(null);
  const [full, setFull] = useState<TopicTestFull | null>(null);
  const [distractorMisc, setDistractorMisc] = useState<DistractorMisconception[]>([]);

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, { selected_option_key?: string; student_answer_text?: string }>>({});
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [attemptId, setAttemptId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<StudentAttempt | null>(null);
  const [priorAttempts, setPriorAttempts] = useState<StudentAttempt[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  async function reload() {
    const tests = await fetchVisibleTestsForStudent(session.student_id, session.grade);
    setVisibleTests(tests);
  }

  useEffect(() => {
    setLoading(true);
    reload().finally(() => setLoading(false));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!full || !attemptId || submitting) return;
    setSubmitting(true);
    if (timerRef.current) clearInterval(timerRef.current);

    const submitted: SubmittedAnswer[] = full.questions.map((q) => ({
      question_id: q.id,
      selected_option_key: answers[q.id]?.selected_option_key,
      student_answer_text: answers[q.id]?.student_answer_text,
    }));

    const updated = await submitAttempt(attemptId, full.questions, submitted, distractorMisc);
    setResult(updated);
    setSubmitting(false);
    setStage('results');
  }, [full, attemptId, answers, submitting, distractorMisc]);

  useEffect(() => {
    if (stage !== 'taking') return;
    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(timerRef.current!);
          handleSubmit();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [stage, handleSubmit]);

  async function openIntro(vt: VisibleTest) {
    setSelected(vt);
    const [full, priorAttempts] = await Promise.all([
      fetchTopicTestFull(vt.test.id),
      fetchStudentAttempts(session.student_id, vt.topic.id),
    ]);
    setFull(full);
    setPriorAttempts(priorAttempts);
    setStage('intro');
  }

  async function startTest() {
    if (!selected || !full) return;
    const attempt = await startAttempt(session.student_id, session.school_id, selected.test.id, selected.topic.id, selected.test.test_purpose);
    if (!attempt) return;
    setAttemptId(attempt.id);
    setAnswers({});
    setCurrent(0);
    setSecondsLeft((selected.test.time_limit_minutes ?? 20) * 60);
    if (full.questions.some((q) => q.question_type === 'mcq')) {
      const questionIds = full.questions.map((q) => q.id);
      setDistractorMisc(await fetchDistractorMisconceptions(questionIds));
    }
    setStage('taking');
  }

  function backToList() {
    setStage('list');
    setSelected(null);
    setFull(null);
    setResult(null);
    reload();
  }

  if (loading && stage === 'list') {
    return (
      <div className="student-home min-h-full pb-16 relative">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(180deg, #d6dbde 0%, #dee3e5 22%, #e4e8ea 45%, #e9ecec 68%, #eaebec 100%)' }} />
          <div className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-8 sm:pt-11 pb-6 sm:pb-8 w-full">
            <p className="text-[12px] text-[rgba(31,36,33,0.5)] font-medium">Topic Tests</p>
            <h1 className="text-brand-dark text-[32px] sm:text-[42px] leading-[1.12] mt-2"
              style={{ fontFamily: 'var(--font-instrument)', fontWeight: 500, letterSpacing: '-0.02em' }}>
              Practice by topic
            </h1>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-8 relative z-10 space-y-4 pt-2 sm:pt-3">
          <Shimmer className="h-24 w-full" />
          <Shimmer className="h-24 w-full" />
          <Shimmer className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (stage === 'list') {
    return (
      <div className="student-home min-h-full pb-16 relative">

        {/* ═══ Hero — wave-strip system, matches Home dashboard ═══ */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(180deg, #d6dbde 0%, #dee3e5 22%, #e4e8ea 45%, #e9ecec 68%, #eaebec 100%)' }} />
          <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 1200 100">
            <path d="M0,42 C220,32 380,49 600,40 C800,32 970,46 1200,38 L1200,0 L0,0 Z" fill="rgba(200,207,212,0.5)" />
            <path d="M0,50 C210,60 390,45 610,53 C800,60 960,47 1200,55" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1" />
            <path d="M0,58 C220,50 380,66 600,57 C800,50 970,63 1200,55" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" />
            <path d="M0,66 C210,74 400,60 620,68 C810,75 980,62 1200,70" fill="none" stroke="rgba(255,255,255,0.48)" strokeWidth="1" />
            <path d="M0,74 C220,66 400,82 620,73 C820,65 990,79 1200,71" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1" />
            <path d="M0,82 C220,90 380,75 600,84 C800,92 970,78 1200,86" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
            <path d="M0,90 C210,82 390,98 610,89 C800,82 960,95 1200,87" fill="none" stroke="rgba(255,255,255,0.38)" strokeWidth="1" />
            <path d="M0,96 C220,90 400,100 620,94 C820,88 990,98 1200,93" fill="none" stroke="rgba(255,255,255,0.32)" strokeWidth="1" />
            <path d="M0,55 C240,65 400,48 620,58 C820,67 980,50 1200,60 L1200,100 L0,100 Z" fill="rgba(255,255,255,0.5)" />
            <path d="M0,72 C240,62 420,81 640,71 C830,62 1000,79 1200,69 L1200,100 L0,100 Z" fill="rgba(255,255,255,0.55)" />
            <path d="M0,88 C230,98 410,82 630,92 C825,101 995,85 1200,95 L1200,100 L0,100 Z" fill="rgba(255,255,255,0.65)" />
          </svg>
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(180deg, #b9c0c5 0%, #c9d0d4 30%, transparent 42%, transparent 55%, rgba(234,235,236,0.75) 80%, #eaebec 100%)' }} />

          <div className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-8 sm:pt-11 pb-6 sm:pb-8 w-full">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }}
              className="flex items-center gap-2 min-w-0">
              <p className="text-[12px] text-[rgba(31,36,33,0.5)] font-medium truncate">Topic Tests</p>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease, delay: 0.06 }}
              className="text-brand-dark text-[32px] sm:text-[42px] leading-[1.12] mt-2 min-w-0"
              style={{ fontFamily: 'var(--font-instrument)', fontWeight: 500, letterSpacing: '-0.02em' }}>
              Practice by topic
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease, delay: 0.08 }}
              className="text-[13px] text-[rgba(31,36,33,0.5)] mt-2.5 font-medium">
              Short, focused tests assigned by your teachers.
            </motion.p>
          </div>
        </div>

        {/* ═══ Body ═════════════════════════════════════════════════ */}
        <div className="max-w-6xl mx-auto px-4 sm:px-8 relative z-10 space-y-5 sm:space-y-6 pt-2 sm:pt-3">
          <TestList visibleTests={visibleTests} onSelect={openIntro} />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <AnimatePresence mode="wait">
        {stage === 'intro' && selected && full && (
          <motion.div key="intro" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3, ease }}>
            <IntroScreen visibleTest={selected} full={full} priorAttempts={priorAttempts} onBack={backToList} onStart={startTest} />
          </motion.div>
        )}

        {stage === 'taking' && full && (
          <motion.div key="taking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease }}>
            <TakingScreen
              full={full} current={current} setCurrent={setCurrent}
              answers={answers} setAnswers={setAnswers}
              secondsLeft={secondsLeft} submitting={submitting} onSubmit={handleSubmit}
            />
          </motion.div>
        )}

        {stage === 'results' && result && full && (
          <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease }}>
            <ResultsScreen result={result} totalQuestions={full.questions.length} onBack={backToList} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── List ──────────────────────────────────────────────────────

function TestList({ visibleTests, onSelect }: { visibleTests: VisibleTest[]; onSelect: (vt: VisibleTest) => void }) {
  return (
    <div>
      {visibleTests.length === 0 ? (
        <div className="paper-card rounded p-8 text-center text-sm text-stone-500">
          No topic tests assigned yet — your teacher hasn't set any for your subjects.
        </div>
      ) : (
        <div className="space-y-3">
          {visibleTests.map((vt) => (
            <button
              key={vt.test.id}
              onClick={() => onSelect(vt)}
              className="paper-card rounded w-full text-left p-4 flex items-center justify-between gap-3 hover:shadow-md transition-shadow"
            >
              <div className="min-w-0">
                <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">{vt.topic.label}</p>
                <p className="text-sm font-bold text-brand-dark truncate">{vt.test.title}</p>
                <p className="text-[11px] text-stone-500 mt-1">{vt.questionCount} questions · {vt.test.time_limit_minutes ?? 20} min</p>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-400 shrink-0" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Intro ─────────────────────────────────────────────────────

function IntroScreen({
  visibleTest, full, priorAttempts, onBack, onStart,
}: {
  visibleTest: VisibleTest; full: TopicTestFull; priorAttempts: StudentAttempt[];
  onBack: () => void; onStart: () => void;
}) {
  const lastAttempt = priorAttempts[priorAttempts.length - 1];
  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-1 text-xs font-bold text-stone-500 hover:text-brand-dark mb-4">
        <ArrowLeft className="w-3.5 h-3.5" /> Back
      </button>
      <div className="paper-card rounded p-6">
        <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">{visibleTest.topic.label}</p>
        <h2 className="text-lg font-black text-brand-dark mt-1">{full.title}</h2>

        {lastAttempt?.mastery_level && (
          <div className="mt-3 flex items-center gap-2 text-xs font-bold" style={{ color: MASTERY_COLOR[lastAttempt.mastery_level] }}>
            <Sparkles className="w-3.5 h-3.5" /> Current mastery: {MASTERY_LABEL[lastAttempt.mastery_level]}
          </div>
        )}

        <div className="mt-4 flex items-center gap-4 text-xs text-stone-500">
          <span className="flex items-center gap-1"><ClipboardCheck className="w-3.5 h-3.5" /> {full.questions.length} questions</span>
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {full.time_limit_minutes ?? 20} min</span>
        </div>

        <p className="text-xs text-stone-500 mt-4">Starting locks in this attempt — the timer runs continuously once you begin.</p>

        <button
          onClick={onStart}
          className="mt-6 w-full py-3 rounded-lg font-black text-sm text-white transition-colors"
          style={{ background: 'var(--color-accent)' }}
        >
          Start
        </button>
      </div>
    </div>
  );
}

// ── Taking ────────────────────────────────────────────────────

function TakingScreen({
  full, current, setCurrent, answers, setAnswers, secondsLeft, submitting, onSubmit,
}: {
  full: TopicTestFull;
  current: number; setCurrent: (n: number) => void;
  answers: Record<number, { selected_option_key?: string; student_answer_text?: string }>;
  setAnswers: React.Dispatch<React.SetStateAction<Record<number, { selected_option_key?: string; student_answer_text?: string }>>>;
  secondsLeft: number; submitting: boolean; onSubmit: () => void;
}) {
  const q = full.questions[current];
  const isLast = current === full.questions.length - 1;
  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;

  return (
    <div>
      <div className="flex items-center justify-between mb-4 px-4 py-3 rounded-lg" style={{ background: '#1C1917' }}>
        <span className="text-xs font-bold text-white/70">Question {current + 1} / {full.questions.length}</span>
        <span className={`text-sm font-black flex items-center gap-1.5 ${secondsLeft < 60 ? 'text-red-400' : 'text-white'}`}>
          <Clock className="w-3.5 h-3.5" /> {mins}:{secs.toString().padStart(2, '0')}
        </span>
      </div>

      <div
        className="paper-card rounded p-6 select-none"
        style={{ WebkitUserSelect: 'none', userSelect: 'none' }}
        onCopy={(e) => e.preventDefault()}
        onCut={(e) => e.preventDefault()}
        onContextMenu={(e) => e.preventDefault()}
      >
        <p className="text-base font-bold text-brand-dark mb-5">{q.prompt}</p>

        {q.question_type === 'mcq' && q.options && (
          <div className="space-y-2">
            {q.options.map((opt) => {
              const isSelected = answers[q.id]?.selected_option_key === opt.key;
              return (
                <button
                  key={opt.key}
                  onClick={() => setAnswers((a) => ({ ...a, [q.id]: { selected_option_key: opt.key } }))}
                  className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-colors flex items-center gap-3 ${
                    isSelected ? 'border-accent bg-accent/10' : 'border-brand-border hover:border-stone-300'
                  }`}
                >
                  {isSelected && <Check className="w-4 h-4 text-accent shrink-0" />}
                  <span className="text-sm font-bold text-brand-dark">{opt.text}</span>
                </button>
              );
            })}
          </div>
        )}

        {q.question_type === 'short_answer' && (
          <input
            type="text"
            value={answers[q.id]?.student_answer_text ?? ''}
            onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: { student_answer_text: e.target.value } }))}
            placeholder="Your answer"
            className="w-full px-4 py-3 rounded-lg border-2 border-brand-border text-sm font-bold text-brand-dark focus:border-accent outline-none"
          />
        )}

        <div className="flex items-center justify-between mt-6">
          <button
            disabled={current === 0}
            onClick={() => setCurrent(current - 1)}
            className="text-xs font-bold text-stone-500 disabled:opacity-30 hover:text-brand-dark"
          >
            Previous
          </button>
          {isLast ? (
            <button
              disabled={submitting}
              onClick={onSubmit}
              className="px-5 py-2.5 rounded-lg font-black text-xs text-white disabled:opacity-50"
              style={{ background: 'var(--color-accent)' }}
            >
              {submitting ? 'Submitting…' : 'Submit'}
            </button>
          ) : (
            <button
              onClick={() => setCurrent(current + 1)}
              className="px-5 py-2.5 rounded-lg font-black text-xs text-white"
              style={{ background: 'var(--color-accent)' }}
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Results ───────────────────────────────────────────────────

function ResultsScreen({ result, totalQuestions, onBack }: { result: StudentAttempt; totalQuestions: number; onBack: () => void }) {
  const masteryLevel = result.mastery_level ?? 'not_started';
  const isConfirmedRetest = result.next_retest_due_at != null && result.retest_confirmed_at != null;

  return (
    <div>
      <div className="paper-card rounded p-6 text-center">
        {result.score_pct != null && result.score_pct >= 70 ? (
          <CheckCircle2 className="w-10 h-10 mx-auto mb-3 text-emerald-500" />
        ) : (
          <AlertTriangle className="w-10 h-10 mx-auto mb-3 text-amber-500" />
        )}
        <p className="text-2xl font-black text-brand-dark">{result.score_pct}%</p>
        <p className="text-xs text-stone-500 mt-1">
          {result.score_pct != null && result.score_pct >= 70 ? 'Nice work!' : 'Keep practicing — review your feedback below.'}
        </p>
      </div>

      <div className="paper-card rounded p-6 mt-4">
        <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-2">Mastery</p>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full shrink-0" style={{ background: MASTERY_COLOR[masteryLevel] }} />
          <span className="text-lg font-black" style={{ color: MASTERY_COLOR[masteryLevel] }}>{MASTERY_LABEL[masteryLevel]}</span>
        </div>
        {result.posterior_score != null && (
          <p className="text-[11px] text-stone-500 mt-1">
            Estimated mastery: {Math.round(result.posterior_score * 100)}% — this gets more accurate as you retake the test.
          </p>
        )}

        {isConfirmedRetest && (
          <div className="mt-4 flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200">
            <HourglassIcon className="w-4 h-4 text-amber-600 shrink-0" />
            <p className="text-xs font-bold text-amber-700">
              Next review scheduled for {new Date(result.next_retest_due_at!).toLocaleDateString()}.
            </p>
          </div>
        )}
      </div>

      <button
        onClick={onBack}
        className="mt-6 w-full py-3 rounded-lg font-black text-sm text-brand-dark border-2 border-brand-border hover:border-stone-300 transition-colors"
      >
        Back to Topic Tests
      </button>
    </div>
  );
}
