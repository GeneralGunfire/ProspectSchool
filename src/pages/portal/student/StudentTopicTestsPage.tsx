import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ClipboardCheck, Clock, ChevronRight, ArrowLeft, Check,
  AlertTriangle, CheckCircle2, HourglassIcon,
} from 'lucide-react';
import type { StudentSession } from '../../../lib/auth';
import {
  fetchVisibleTestsForStudent, fetchTopicTestFull, startTopicTestAttempt,
  submitTopicTestAttempt, type StudentVisibleTest, type TopicTestFull,
  type SubmittedAnswer,
} from '../../../lib/topicTests';

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
      <div className="max-w-2xl mx-auto px-4 py-6 sm:p-6 md:p-8">
        <div className="mb-7">
          <span className="eyebrow">Portal</span>
          <h1 className="text-2xl font-bold text-brand-dark tracking-tight">Topic Tests</h1>
          <p className="text-sm text-stone-500 mt-1 leading-relaxed">
            Short, timed tests your teacher has assigned. These only appear once your teacher sets them.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-5 h-5 border-2 border-stone-200 border-t-brand-dark rounded-full animate-spin" />
          </div>
        ) : visibleTests.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-stone-200 px-6 py-14 text-center">
            <p className="text-sm font-semibold text-stone-600">No tests assigned right now</p>
            <p className="text-xs text-stone-400 mt-1">Check back once your teacher assigns one.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {visibleTests.map((vt, i) => (
              <motion.div
                key={vt.assignment.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1], delay: i * 0.04 }}
                className="rounded-2xl border border-stone-200 bg-white overflow-hidden"
              >
                <div className="px-5 py-4 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-stone-100 flex items-center justify-center shrink-0">
                    <ClipboardCheck className="w-4 h-4 text-stone-600" strokeWidth={2.25} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[15px] font-semibold text-brand-dark leading-snug">{vt.test.title}</h3>
                    <div className="flex items-center gap-2.5 mt-1 text-xs text-stone-500">
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
                  <button
                    onClick={() => openIntro(vt)}
                    className="w-full flex items-center justify-between px-5 py-3 border-t border-stone-100 text-sm font-semibold text-white bg-brand-dark hover:bg-stone-800 transition-colors duration-150"
                  >
                    Start test <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ── Intro / start screen ──
  if (stage === 'intro' && selected && full) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6 sm:p-6 md:p-8">
        <button onClick={backToList} className="flex items-center gap-1.5 text-sm font-medium text-stone-500 hover:text-brand-dark mb-6 transition-colors duration-150">
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </button>

        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
          className="rounded-2xl border border-stone-200 bg-white p-8 text-center"
        >
          <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center mx-auto mb-4">
            <ClipboardCheck className="w-5 h-5 text-stone-600" strokeWidth={2.25} />
          </div>
          <h2 className="text-lg font-semibold text-brand-dark">{full.test.title}</h2>
          <p className="text-sm text-stone-500 mt-1">Grade {full.test.grade} · Term {full.test.term}</p>

          <div className="grid grid-cols-2 gap-2.5 mt-6 max-w-xs mx-auto">
            <div className="bg-stone-50 rounded-xl px-4 py-3">
              <p className="text-lg font-semibold text-brand-dark">{full.questions.length}</p>
              <p className="text-[11px] font-medium uppercase tracking-wide text-stone-500">Questions</p>
            </div>
            <div className="bg-stone-50 rounded-xl px-4 py-3">
              <p className="text-lg font-semibold text-brand-dark">{Math.round(full.test.time_limit_seconds / 60)} min</p>
              <p className="text-[11px] font-medium uppercase tracking-wide text-stone-500">Time limit</p>
            </div>
          </div>

          <div className="flex gap-3 p-4 bg-amber-50 rounded-xl mt-6 text-left">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 leading-relaxed">
              Once you start, the timer can't be paused. If time runs out, your answers so far are submitted automatically.
            </p>
          </div>

          <button
            onClick={startTest}
            disabled={full.questions.length === 0}
            className="w-full mt-6 py-3 rounded-xl bg-brand-dark text-white text-sm font-semibold hover:bg-stone-800 transition-colors duration-150 disabled:opacity-40"
          >
            {full.questions.length === 0 ? 'No questions yet' : 'Start test'}
          </button>
        </motion.div>
      </div>
    );
  }

  // ── Taking the test ──
  if (stage === 'taking' && full) {
    const q = full.questions[current];
    const answered = (answers[q.id] ?? '').trim() !== '';

    return (
      <div className="max-w-2xl mx-auto px-4 py-6 sm:p-6 md:p-8">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-stone-500">{full.test.title}</p>
            <p className="text-xs text-stone-400 mt-0.5">Question {current + 1} of {full.questions.length}</p>
          </div>
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold tabular-nums ${
            lowTime ? 'bg-red-50 text-red-600' : 'bg-brand-dark text-white'
          }`}>
            <Clock className="w-3.5 h-3.5" /> {timeStr}
          </div>
        </div>

        <div className="flex items-center gap-1.5 mb-6">
          {full.questions.map((fq, i) => (
            <div key={fq.id} className={`h-1 rounded-full flex-1 transition-colors duration-200 ${
              i < current ? 'bg-brand-dark' : i === current ? 'bg-stone-400' : 'bg-stone-100'
            }`} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={q.id}
            initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="rounded-2xl border border-stone-200 bg-white p-6"
          >
            <span className="inline-flex items-center px-2 py-0.5 bg-stone-100 text-stone-500 text-[11px] font-medium rounded-full mb-3">
              {full.subskills.find((s) => s.id === q.subskill_id)?.label ?? ''}
            </span>
            <p className="text-lg font-semibold text-brand-dark mb-5 leading-snug">{q.prompt}</p>

            {q.question_type === 'mcq' ? (
              <div className="space-y-2">
                {(q.options ?? []).map((opt) => {
                  const isSelected = answers[q.id] === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() => setAnswer(q.id, opt)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-left border transition-colors duration-150 active:scale-[0.99] ${
                        isSelected ? 'bg-brand-dark text-white border-brand-dark' : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 border transition-colors duration-150 ${
                        isSelected ? 'bg-white/20 border-white/40' : 'border-stone-300'
                      }`}>
                        {isSelected && <Check className="w-2.5 h-2.5" />}
                      </div>
                      {opt}
                    </button>
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
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm font-normal text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 transition-colors duration-150 resize-none"
              />
            ) : (
              <input
                type="text"
                inputMode="numeric"
                value={answers[q.id] ?? ''}
                onChange={(e) => setAnswer(q.id, e.target.value)}
                placeholder="Type your answer"
                autoFocus
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-base font-medium text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 transition-colors duration-150"
              />
            )}
          </motion.div>
        </AnimatePresence>

        <button
          onClick={nextQuestion}
          disabled={!answered || submitting}
          className="w-full mt-6 py-3 rounded-xl bg-brand-dark text-white text-sm font-semibold hover:bg-stone-800 transition-colors duration-150 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center gap-2"
        >
          {submitting
            ? <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            : current < full.questions.length - 1 ? <>Next question <ChevronRight className="w-4 h-4" /></> : 'Submit test'}
        </button>
      </div>
    );
  }

  // ── Results ──
  if (!full) return null;
  const hasOpenText = full.questions.some((q) => q.question_type === 'open_text');

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 sm:p-6 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
        className="rounded-2xl border border-stone-200 bg-white p-8 text-center"
      >
        {hasOpenText ? (
          <>
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center mx-auto mb-4">
              <HourglassIcon className="w-5 h-5 text-amber-600" />
            </div>
            <h2 className="text-lg font-semibold text-brand-dark">
              {expired ? 'Time’s up!' : 'Test submitted'}
            </h2>
            <p className="text-sm text-stone-500 mt-2 leading-relaxed">
              Your teacher will mark your written answers. Your final result will show up here once marking is complete.
            </p>
          </>
        ) : (
          <>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-lg font-semibold text-brand-dark">
              {expired ? 'Time’s up!' : 'Test submitted'}
            </h2>
            <p className="text-sm text-stone-500 mt-2 leading-relaxed">
              Your result is now visible to your teacher, who will see exactly which parts of this topic to help you with next.
            </p>
          </>
        )}

        <button
          onClick={backToList}
          className="w-full mt-6 py-3 rounded-xl border border-stone-200 text-sm font-semibold text-stone-600 hover:bg-stone-50 transition-colors duration-150"
        >
          Back to Topic Tests
        </button>
      </motion.div>
    </div>
  );
}
