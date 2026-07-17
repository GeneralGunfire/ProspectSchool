import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ClipboardCheck, Clock, ChevronRight, ArrowLeft, Check,
  AlertTriangle, CheckCircle2, HourglassIcon,
} from 'lucide-react';
import { Shimmer } from './StudentHomePage';
import type { StudentSession } from '../../../lib/auth';
import {
  fetchVisibleTestsForStudent, fetchTopicTestFull, startTopicTestAttempt,
  submitTopicTestAttempt, type StudentVisibleTest, type TopicTestFull,
  type SubmittedAnswer,
} from '../../../lib/topicTests';

const ease = [0.23, 1, 0.32, 1] as [number, number, number, number];

interface StudentTopicTestsPageProps { session: StudentSession; }

type Stage = 'list' | 'intro' | 'taking' | 'results';

export default function StudentTopicTestsPage({ session }: StudentTopicTestsPageProps) {
  const [stage, setStage] = useState<Stage>('list');
  const [visibleTests, setVisibleTests] = useState<StudentVisibleTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<StudentVisibleTest | null>(null);
  const [full, setFull] = useState<TopicTestFull | null>(null);

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [expired, setExpired] = useState(false);
  const [attemptId, setAttemptId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  async function reload() {
    const tests = await fetchVisibleTestsForStudent(session.student_id, session.school_id, session.grade);
    setVisibleTests(tests);
  }

  useEffect(() => {
    setLoading(true);
    reload().finally(() => setLoading(false));
  }, []);

  const handleSubmit = useCallback(async (isExpired: boolean) => {
    if (!full || !attemptId || submitting) return;
    setSubmitting(true);
    if (timerRef.current) clearInterval(timerRef.current);

    const submitted: SubmittedAnswer[] = full.questions.map((q) => ({
      question_id: q.id,
      subskill_id: q.subskill_id,
      student_answer: answers[q.id] ?? '',
    }));

    await submitTopicTestAttempt(attemptId, full.questions, submitted, isExpired);
    setExpired(isExpired);
    setSubmitting(false);
    setStage('results');
  }, [full, attemptId, answers, submitting]);

  useEffect(() => {
    if (stage !== 'taking') return;
    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(timerRef.current!);
          handleSubmit(true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [stage, handleSubmit]);

  async function openIntro(vt: StudentVisibleTest) {
    setSelected(vt);
    const f = await fetchTopicTestFull(vt.test.id);
    setFull(f);
    setStage('intro');
  }

  async function startTest() {
    if (!selected || !full) return;
    const result = await startTopicTestAttempt(selected.test.id, selected.assignment.id, session.student_id, session.school_id);
    if (!result.success) return;
    setAttemptId(result.attempt.id);
    setCurrent(0);
    setAnswers({});
    setSecondsLeft(full.test.time_limit_seconds);
    setExpired(false);
    setStage('taking');
  }

  function setAnswer(qId: number, value: string) {
    setAnswers((a) => ({ ...a, [qId]: value }));
  }

  function nextQuestion() {
    if (!full) return;
    if (current < full.questions.length - 1) {
      setCurrent((c) => c + 1);
    } else {
      handleSubmit(false);
    }
  }

  function backToList() {
    setStage('list');
    setSelected(null);
    setFull(null);
    setAttemptId(null);
    reload();
  }

  const timeStr = `${Math.floor(secondsLeft / 60)}:${String(secondsLeft % 60).padStart(2, '0')}`;
  const lowTime = secondsLeft <= 60;

  // ── List view ──
  if (stage === 'list') {
    return (
      <div className="student-home min-h-full pb-16">

        {/* ═══ Hero — sits inside the page, not stacked on top of it ═════
            No buttons in this band (house rule). Test count is shown as a
            static pill readout, not an action. */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(180deg, #bcc5cb 0%, #cbd3d5 18%, #dde2e1 42%, #e8eae7 68%, #eaebec 92%, #eaebec 100%)' }} />
          <div className="absolute inset-0 pointer-events-none opacity-[0.6]"
            style={{
              backgroundImage: 'repeating-linear-gradient(120deg, rgba(56,65,79,0.08) 0px, rgba(56,65,79,0.08) 1px, transparent 1px, transparent 28px)',
              maskImage: 'linear-gradient(180deg, black 0%, black 45%, transparent 92%)',
            }} />
          <div className="absolute -top-24 -right-20 w-[28rem] h-[28rem] rounded-full blur-3xl opacity-[0.32] pointer-events-none"
            style={{ background: 'radial-gradient(circle, var(--color-depth-soft), transparent 70%)' }} />
          <div className="absolute -top-12 left-1/4 w-[19rem] h-[19rem] rounded-full blur-3xl opacity-[0.16] pointer-events-none"
            style={{ background: 'radial-gradient(circle, var(--color-depth), transparent 70%)' }} />

          <div className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-8 sm:pt-11 pb-10 sm:pb-14 w-full">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }}
              className="flex items-center gap-2 min-w-0">
              <p className="text-[12px] text-[rgba(31,36,33,0.5)] font-medium truncate">Portal</p>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease, delay: 0.06 }}
              className="text-brand-dark text-[32px] sm:text-[42px] leading-[1.12] mt-2 min-w-0"
              style={{ fontFamily: 'var(--font-instrument)', fontWeight: 500, letterSpacing: '-0.02em' }}>
              Topic Tests
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease, delay: 0.08 }}
              className="text-[13px] text-[rgba(31,36,33,0.5)] mt-2.5 font-medium max-w-md">
              Short, timed tests your teacher has assigned. These only appear once your teacher sets them.
            </motion.p>

            {!loading && visibleTests.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease, delay: 0.1 }}
                className="inline-flex items-center gap-2 mt-4 border border-brand-border bg-white/70 rounded-full pl-3 pr-4 py-1.5">
                <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-[rgba(31,36,33,0.5)]">Assigned</span>
                <span className="font-black text-sm text-brand-dark">{visibleTests.length}</span>
              </motion.div>
            )}
          </div>
        </div>

        {/* ═══ Body ═════════════════════════════════════════════ */}
        <div className="max-w-6xl mx-auto px-4 sm:px-8 relative z-10 pt-6 sm:pt-8">

          {loading ? (
            <div className="space-y-2.5 max-w-2xl">
              {[0, 1, 2].map(i => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.06, ease }}
                  className="paper-card rounded p-4 flex items-center gap-3"
                >
                  <Shimmer className="w-9 h-9 rounded shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Shimmer className="h-4" style={{ width: `${50 - i * 6}%` }} />
                    <Shimmer className="h-3 w-1/3" />
                  </div>
                </motion.div>
              ))}
            </div>
          ) : visibleTests.length === 0 ? (
            <div className="paper-card rounded p-5 sm:p-7 max-w-2xl py-14 text-center">
              <p className="text-[16px] font-semibold text-brand-dark">No tests assigned right now</p>
              <p className="text-[13px] text-[rgba(31,36,33,0.4)] mt-1">Check back once your teacher assigns one.</p>
            </div>
          ) : (
            <div className="space-y-2.5 max-w-2xl">
              {visibleTests.map((vt, i) => (
                <motion.div
                  key={vt.assignment.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease, delay: i * 0.05 }}
                  className="paper-card rounded overflow-hidden"
                >
                  <div className="px-5 py-4 flex items-start gap-3">
                    <div className="w-9 h-9 rounded flex items-center justify-center shrink-0" style={{ background: 'var(--color-paper-raise)' }}>
                      <ClipboardCheck className="w-4 h-4 text-stone-600" strokeWidth={2.25} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[15px] font-semibold text-brand-dark leading-snug">{vt.test.title}</h3>
                      <div className="flex items-center gap-2.5 mt-1 text-[12px] text-[rgba(31,36,33,0.45)]">
                        <span>Grade {vt.test.grade} · Term {vt.test.term}</span>
                        <span className="text-stone-300">·</span>
                        <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" /> {Math.round(vt.test.time_limit_seconds / 60)} min</span>
                      </div>
                    </div>
                    {vt.attempted && (
                      <span className={`shrink-0 inline-flex items-center px-2 py-0.5 text-[11px] font-semibold rounded-full ${
                        vt.attempt?.grading_complete === false
                          ? 'bg-amber-50 text-amber-700'
                          : (vt.attempt?.score_pct ?? 0) >= 70 ? 'bg-emerald-50 text-emerald-700' : 'bg-stone-100 text-stone-500'
                      }`}>
                        {vt.attempt?.grading_complete === false ? 'Awaiting marks' : `${vt.attempt?.score_pct ?? 0}%`}
                      </span>
                    )}
                  </div>
                  {!vt.attempted && (
                    <motion.button whileTap={{ scale: 0.99 }}
                      onClick={() => openIntro(vt)}
                      className="w-full flex items-center justify-between px-5 py-3 text-[14px] font-semibold text-white transition-colors duration-150"
                      style={{ background: 'var(--color-accent)', borderTop: '1px solid var(--color-brand-border)' }}
                    >
                      Start test <ChevronRight className="w-4 h-4" />
                    </motion.button>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Intro / start screen ──
  if (stage === 'intro' && selected && full) {
    return (
      <div className="student-home min-h-full max-w-2xl mx-auto px-4 py-6 sm:p-6 md:p-8">
        <button onClick={backToList} className="flex items-center gap-1.5 text-[13px] font-semibold text-stone-500 hover:text-brand-dark mb-6 transition-colors duration-150">
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </button>

        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease }}
          className="paper-card rounded p-8 text-center"
        >
          <div className="w-12 h-12 rounded flex items-center justify-center mx-auto mb-4" style={{ background: 'var(--color-paper-raise)' }}>
            <ClipboardCheck className="w-5 h-5 text-stone-600" strokeWidth={2.25} />
          </div>
          <h2 className="text-[20px] font-semibold text-brand-dark">{full.test.title}</h2>
          <p className="text-[13px] text-stone-500 mt-1">Grade {full.test.grade} · Term {full.test.term}</p>

          <div className="grid grid-cols-2 gap-2.5 mt-6 max-w-xs mx-auto">
            <div className="rounded px-4 py-3" style={{ background: 'var(--color-paper-raise)' }}>
              <p className="text-lg font-semibold text-brand-dark">{full.questions.length}</p>
              <p className="text-[11px] font-medium uppercase tracking-wide text-stone-500">Questions</p>
            </div>
            <div className="rounded px-4 py-3" style={{ background: 'var(--color-paper-raise)' }}>
              <p className="text-lg font-semibold text-brand-dark">{Math.round(full.test.time_limit_seconds / 60)} min</p>
              <p className="text-[11px] font-medium uppercase tracking-wide text-stone-500">Time limit</p>
            </div>
          </div>

          <div className="flex gap-3 p-4 bg-amber-50 rounded mt-6 text-left">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 leading-relaxed">
              Once you start, the timer can't be paused. If time runs out, your answers so far are submitted automatically.
            </p>
          </div>

          <motion.button whileTap={{ scale: 0.98 }}
            onClick={startTest}
            disabled={full.questions.length === 0}
            className="w-full mt-6 py-3 rounded text-white text-sm font-semibold transition-colors duration-150 disabled:opacity-40"
            style={{ background: 'var(--color-accent)' }}
          >
            {full.questions.length === 0 ? 'No questions yet' : 'Start test'}
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // ── Taking the test ──
  if (stage === 'taking' && full) {
    const q = full.questions[current];
    const answered = (answers[q.id] ?? '').trim() !== '';

    return (
      <div className="student-home min-h-full max-w-2xl mx-auto px-4 py-6 sm:p-6 md:p-8">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-stone-500">{full.test.title}</p>
            <p className="text-xs text-stone-400 mt-0.5">Question {current + 1} of {full.questions.length}</p>
          </div>
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold tabular-nums ${
            lowTime ? 'bg-red-50 text-red-600' : 'text-white'
          }`} style={!lowTime ? { background: 'var(--color-accent)' } : undefined}>
            <Clock className="w-3.5 h-3.5" /> {timeStr}
          </div>
        </div>

        <div className="flex items-center gap-1.5 mb-6">
          {full.questions.map((fq, i) => (
            <div key={fq.id} className="h-1 rounded-full flex-1 transition-colors duration-200"
              style={{ background: i < current ? 'var(--color-accent)' : i === current ? '#a8a29e' : 'var(--color-paper-raise)' }} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={q.id}
            initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.2, ease }}
            className="paper-card rounded p-6"
          >
            <span className="inline-flex items-center px-2 py-0.5 text-stone-500 text-[11px] font-medium rounded-full mb-3" style={{ background: 'var(--color-paper-raise)' }}>
              {full.subskills.find((s) => s.id === q.subskill_id)?.label ?? ''}
            </span>
            <p className="text-lg font-semibold text-brand-dark mb-5 leading-snug">{q.prompt}</p>

            {q.question_type === 'mcq' ? (
              <div className="space-y-2">
                {(q.options ?? []).map((opt) => {
                  const isSelected = answers[q.id] === opt;
                  return (
                    <motion.button whileTap={{ scale: 0.99 }}
                      key={opt}
                      onClick={() => setAnswer(q.id, opt)}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded text-sm font-medium text-left border transition-colors duration-150"
                      style={isSelected
                        ? { background: 'var(--color-accent)', color: '#fff', borderColor: 'var(--color-accent)' }
                        : { background: '#fff', borderColor: 'var(--color-brand-border)', color: '#44403c' }}
                    >
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 border transition-colors duration-150 ${
                        isSelected ? 'bg-white/20 border-white/40' : 'border-stone-300'
                      }`}>
                        {isSelected && <Check className="w-2.5 h-2.5" />}
                      </div>
                      {opt}
                    </motion.button>
                  );
                })}
              </div>
            ) : q.question_type === 'open_text' ? (
              <textarea
                value={answers[q.id] ?? ''}
                onChange={(e) => setAnswer(q.id, e.target.value)}
                rows={5}
                placeholder="Write your answer"
                autoFocus
                className="w-full px-4 py-3 rounded text-sm font-normal text-brand-dark focus:outline-none transition-colors duration-150 resize-none border"
                style={{ background: 'var(--color-paper-raise)', borderColor: 'var(--color-brand-border)' }}
              />
            ) : (
              <input
                type="text"
                inputMode="numeric"
                value={answers[q.id] ?? ''}
                onChange={(e) => setAnswer(q.id, e.target.value)}
                placeholder="Type your answer"
                autoFocus
                className="w-full px-4 py-3 rounded text-base font-medium text-brand-dark focus:outline-none transition-colors duration-150 border"
                style={{ background: 'var(--color-paper-raise)', borderColor: 'var(--color-brand-border)' }}
              />
            )}
          </motion.div>
        </AnimatePresence>

        <motion.button whileTap={{ scale: 0.98 }}
          onClick={nextQuestion}
          disabled={!answered || submitting}
          className="w-full mt-6 py-3 rounded text-white text-sm font-semibold transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          style={{ background: 'var(--color-accent)' }}
        >
          {submitting
            ? <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            : current < full.questions.length - 1 ? <>Next question <ChevronRight className="w-4 h-4" /></> : 'Submit test'}
        </motion.button>
      </div>
    );
  }

  // ── Results ──
  if (!full) return null;
  const hasOpenText = full.questions.some((q) => q.question_type === 'open_text');

  return (
    <div className="student-home min-h-full max-w-2xl mx-auto px-4 py-6 sm:p-6 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease }}
        className="paper-card rounded p-8 text-center"
      >
        {hasOpenText ? (
          <>
            <div className="w-12 h-12 rounded bg-amber-50 flex items-center justify-center mx-auto mb-4">
              <HourglassIcon className="w-5 h-5 text-amber-600" />
            </div>
            <h2 className="text-[20px] font-semibold text-brand-dark">
              {expired ? 'Time’s up!' : 'Test submitted'}
            </h2>
            <p className="text-[13px] text-stone-500 mt-2 leading-relaxed">
              Your teacher will mark your written answers. Your final result will show up here once marking is complete.
            </p>
          </>
        ) : (
          <>
            <div className="w-12 h-12 rounded bg-emerald-50 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-[20px] font-semibold text-brand-dark">
              {expired ? 'Time’s up!' : 'Test submitted'}
            </h2>
            <p className="text-[13px] text-stone-500 mt-2 leading-relaxed">
              Your result is now visible to your teacher, who will see exactly which parts of this topic to help you with next.
            </p>
          </>
        )}

        <motion.button whileTap={{ scale: 0.98 }}
          onClick={backToList}
          className="w-full mt-6 py-3 rounded border text-sm font-semibold text-stone-600 hover:bg-stone-50 transition-colors duration-150"
          style={{ borderColor: 'var(--color-brand-border)' }}
        >
          Back to Topic Tests
        </motion.button>
      </motion.div>
    </div>
  );
}
