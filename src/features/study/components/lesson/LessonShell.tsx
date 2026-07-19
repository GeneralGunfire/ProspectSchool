// ── LessonShell — generic 6-phase lesson orchestrator ─────────────────────────
// Phases through Activate -> Demonstrate 1 -> Demonstrate 2 -> Apply -> Assess -> Reflect
// per Part B of the execution plan. Content-agnostic: consumes a LessonContent
// object (see data/library/types.ts) and the topic's remediation lessons.
// Topic page components (e.g. RealNumberSystem.tsx) are thin wrappers around this.

import { useState, useEffect, useRef, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ArrowLeft, X, PenLine } from 'lucide-react';
import { KnowledgeCheck, LearningOutcomes, SummaryCard } from '../../../../components/LessonEnrichment';
import QuizBlock, { type QuizQuestion } from '../../../../components/QuizBlock';
import type { LessonContent, PracticeItem, FadingProblem } from '../../data/library/types';
import { WorkedExample } from './WorkedExample';
import { HintTiers } from './HintTiers';
import { MisconceptionFeedback } from './MisconceptionFeedback';
import { Scratchpad, ScratchpadModal } from './Scratchpad';
import { GoalSetting, ConfidenceCheck, Reflection } from './SelfRegulation';
import { saveTopicProgress } from '../../../../lib/studyProgress';
import { useStudySession } from '../../../../providers/StudySessionContext';

const EASE = [0.23, 1, 0.32, 1] as const;

type Phase = 'goal' | 'activate' | 'demo1' | 'demo2' | 'apply' | 'assess' | 'reflect' | 'remediation' | 'done';

const PHASE_ORDER: Phase[] = ['goal', 'activate', 'demo1', 'demo2', 'apply', 'assess', 'reflect'];
const PHASE_LABELS: Record<Phase, string> = {
  goal: 'Goals', activate: 'Activate', demo1: 'Learn', demo2: 'Learn more',
  apply: 'Practice', assess: 'Quiz', reflect: 'Reflect', remediation: 'Review', done: 'Done',
};

function PhaseProgress({ phase }: { phase: Phase }) {
  const idx = PHASE_ORDER.indexOf(phase);
  if (idx < 0) return null;
  return (
    <div className="flex items-center gap-1 mb-6">
      {PHASE_ORDER.map((p, i) => (
        <div
          key={p}
          className="h-1.5 rounded-full flex-1 transition-all duration-300"
          style={{ background: i <= idx ? '#1e293b' : '#e7e0d5' }}
        />
      ))}
    </div>
  );
}

function FadingProblemBlock({ problem, onDone }: { problem: FadingProblem; onDone?: () => void }) {
  return <WorkedExample example={problem} revealSteps={problem.revealSteps} onFullyRevealed={onDone} />;
}

function IndependentPracticeBlock({
  item,
  onResolved,
}: {
  item: PracticeItem;
  content: LessonContent;
  onResolved: (correct: boolean) => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [scratchpadOpen, setScratchpadOpen] = useState(false);

  const isCorrect = selected === item.correctIndex;
  const activeMisconceptionId = selected !== null && !isCorrect ? item.distractorMisconceptions[selected] : null;

  return (
    <div className="paper-card rounded overflow-hidden my-5">
      <div className="px-4 sm:px-5 py-3.5 border-b border-stone-100 space-y-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 mb-1.5">Your turn</p>
          <p className="text-[14px] font-bold text-[#1e293b] leading-snug">{item.question}</p>
        </div>
        <button
          onClick={() => setScratchpadOpen(true)}
          className="flex items-center justify-center gap-1.5 w-full sm:w-auto px-3 py-2.5 sm:py-2 rounded-xl border border-stone-200 text-[12.5px] font-bold text-stone-500 hover:border-stone-300 hover:text-stone-700 active:scale-[0.97] transition-all"
        >
          <PenLine className="w-3.5 h-3.5" /> Work it out
        </button>
      </div>
      <ScratchpadModal
        storageKey={`ip-${item.id}`}
        question={item.question}
        open={scratchpadOpen}
        onClose={() => setScratchpadOpen(false)}
      />
      <div className="px-5 py-4 space-y-2">
        {item.options.map((opt, i) => {
          const active = selected === i;
          return (
            <button
              key={i}
              disabled={isCorrect}
              onClick={() => { setSelected(i); setAttempts(a => a + 1); if (i === item.correctIndex) onResolved(true); }}
              className={`w-full text-left px-4 py-3 rounded-xl border text-[13px] font-medium transition-all ${
                active && isCorrect ? 'border-emerald-300 bg-emerald-50 text-emerald-900 font-bold' :
                active && !isCorrect ? 'border-red-200 bg-red-50 text-red-800' :
                'border-stone-200 bg-stone-50/40 hover:border-stone-300 text-stone-700'
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
      <AnimatePresence>
        {activeMisconceptionId && (
          <motion.div className="px-5 pb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <MisconceptionMount misconceptionId={activeMisconceptionId} onRetry={() => setSelected(null)} />
          </motion.div>
        )}
      </AnimatePresence>
      {attempts > 0 && !isCorrect && (
        <div className="px-5 pb-5">
          <HintTiers hints={item.hints} />
        </div>
      )}
      {isCorrect && (
        <div className="px-5 pb-4 text-[12px] font-bold text-emerald-600">Correct — nice work.</div>
      )}
    </div>
  );
}

const MisconceptionsContext = createContext<LessonContent['misconceptions']>([]);

function MisconceptionMount({ misconceptionId, onRetry }: { misconceptionId: string; onRetry: () => void }) {
  const misconceptions = useContext(MisconceptionsContext);
  const m = misconceptions.find(x => x.id === misconceptionId);
  if (!m) return null;
  return <MisconceptionFeedback misconception={m} onRetry={onRetry} />;
}

export function LessonShell({ content, onExit }: { content: LessonContent; onExit?: () => void }) {
  const session = useStudySession();
  const [phase, setPhase] = useState<Phase>('goal');
  const [quizScorePct, setQuizScorePct] = useState<number | null>(null);
  const [weakObjectives, setWeakObjectives] = useState<string[]>([]);
  const [remediationTarget, setRemediationTarget] = useState<string | null>(null);

  // Tracks which interactive items (by id) have been resolved in the CURRENT
  // phase, so "Continue" stays disabled until every embedded question/example
  // in that phase has been answered — no skipping ahead. Cleared on phase change.
  const [answeredIds, setAnsweredIds] = useState<Set<string>>(new Set());
  const markAnswered = (id: string) => setAnsweredIds(prev => (prev.has(id) ? prev : new Set(prev).add(id)));
  useEffect(() => { setAnsweredIds(new Set()); }, [phase]);

  const activateRequired = content.activate.diagnosticQuestions.map((_, i) => `activate-${i}`);
  const demo1Required = [
    ...content.demonstrateChunk1.workedExamples.map(ex => `wx-${ex.id}`),
    ...content.demonstrateChunk1.knowledgeChecks.map((_, i) => `demo1-${i}`),
  ];
  const demo2Required = [
    ...content.demonstrateChunk2.workedExamples.map(ex => `wx-${ex.id}`),
    ...content.demonstrateChunk2.knowledgeChecks.map((_, i) => `demo2-${i}`),
  ];
  const applyRequired = [
    ...content.apply.fadingProblems.map(p => `wx-${p.id}`),
    ...content.apply.independentPractice.map(item => `ip-${item.id}`),
  ];

  const isPhaseComplete = (required: string[]) => required.every(id => answeredIds.has(id));

  const storageKey = `${content.meta.subject}-g${content.meta.grade}-t${content.meta.term}-${content.meta.topicId}`;

  const goNext = () => {
    const idx = PHASE_ORDER.indexOf(phase);
    if (idx >= 0 && idx < PHASE_ORDER.length - 1) setPhase(PHASE_ORDER[idx + 1]);
    else setPhase('done');
  };
  const goBack = () => {
    const idx = PHASE_ORDER.indexOf(phase);
    if (idx > 0) setPhase(PHASE_ORDER[idx - 1]);
  };

  const quizQuestions: QuizQuestion[] = content.quiz.map(q => ({
    q: q.question,
    options: q.options,
    answer: q.correctIndices[0],
    explanation: q.explanation,
  }));

  async function handleQuizComplete(score: number, total: number) {
    const pct = Math.round((score / total) * 100);
    setQuizScorePct(pct);
    const mastery = pct >= content.masteryThresholdPct ? 'mastered' : 'needs_practice';

    // Diagnose weak objectives from the quiz's own item->objective tagging.
    // (Item-level correctness isn't returned by QuizBlock, so we approximate
    // at topic level for now; per-objective breakdown improves once QuizBlock
    // exposes per-item results — tracked as a known follow-up, not blocking.)
    const weak = mastery === 'needs_practice' ? [...new Set(content.quiz.map(q => q.objectiveId))] : [];
    setWeakObjectives(weak);

    if (session) {
      await saveTopicProgress(
        session.student_id, session.school_id,
        content.meta.subject, content.meta.grade, content.meta.topicId,
        mastery, score, total, 1
      );
    }

    if (mastery === 'needs_practice' && weak.length > 0) {
      setRemediationTarget(weak[0]);
    }
  }

  return (
    <MisconceptionsContext.Provider value={content.misconceptions}>
    <div className="student-home min-h-full pb-16 relative">
      {/* Sticky, always-visible exit/back affordance — consistent position
          across every phase, not just the first one, per the mobile-nav
          requirement that back buttons stay visible and non-intrusive. */}
      {onExit && (
        <div className="sticky top-0 z-20 bg-brand-bg/90 backdrop-blur-sm border-b border-brand-border/60">
          <div className="max-w-2xl mx-auto px-4 sm:px-6">
            <button
              onClick={onExit}
              className="flex items-center gap-1.5 py-3 text-[13px] font-bold text-[rgba(31,36,33,0.55)] hover:text-brand-dark active:scale-[0.97] transition-all"
            >
              <X className="w-4 h-4" /> Exit lesson
            </button>
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-5">
        <PhaseProgress phase={phase} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={phase}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.25, ease: EASE }}
          className="max-w-2xl mx-auto px-4 sm:px-6"
        >
          {phase === 'goal' && (
            <div>
              <div className="relative overflow-hidden -mx-4 sm:-mx-6 mb-2">
                <div className="absolute inset-x-0 top-0 pointer-events-none" style={{ bottom: '-220px',
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.45) 40%, rgba(255,255,255,0.22) 75%, transparent 100%)' }} />
                <div className="relative px-4 sm:px-6 pt-6 sm:pt-8 pb-6 sm:pb-8">
                  <p className="text-[12px] text-[rgba(31,36,33,0.5)] font-medium">{content.meta.topicName}</p>
                  <h1
                    className="text-brand-dark text-[32px] sm:text-[42px] leading-[1.12] mt-2"
                    style={{ fontFamily: 'var(--font-instrument)', fontWeight: 500, letterSpacing: '-0.02em' }}
                  >
                    {content.openingHook}
                  </h1>
                </div>
              </div>
              <GoalSetting
                prompt={content.goalSettingPrompt}
                objectives={content.meta.objectives.map(o => o.text)}
                onContinue={() => goNext()}
              />
            </div>
          )}

          {phase === 'activate' && (
            <div className="space-y-5">
              <h2 className="text-lg font-black text-[#1e293b]">Before we begin</h2>
              <p className="text-[13.5px] text-stone-600">{content.activate.connectPrompt}</p>
              {content.activate.diagnosticQuestions.map((q, i) => (
                <KnowledgeCheck key={i} question={q.question} options={q.options} correctIndex={q.correctIndex} explanation={q.explanation} onAnswered={() => markAnswered(`activate-${i}`)} />
              ))}
              <NavRow
                onNext={goNext} onBack={goBack}
                disabled={!isPhaseComplete(activateRequired)}
                disabledHint="Answer every question above to continue."
              />
            </div>
          )}

          {phase === 'demo1' && (
            <div className="space-y-5">
              <h2 className="text-lg font-black text-[#1e293b]">{content.meta.objectives[0]?.text ?? 'Core idea'}</h2>
              <p className="text-[13.5px] text-stone-600 leading-relaxed">{content.demonstrateChunk1.explanation}</p>
              {content.demonstrateChunk1.workedExamples.map(ex => (
                <WorkedExample key={ex.id} example={ex} onFullyRevealed={() => markAnswered(`wx-${ex.id}`)} />
              ))}
              {content.demonstrateChunk1.knowledgeChecks.map((q, i) => (
                <KnowledgeCheck key={i} question={q.question} options={q.options} correctIndex={q.correctIndex} explanation={q.explanation} onAnswered={() => markAnswered(`demo1-${i}`)} />
              ))}
              <ConfidenceCheck prompt={content.demonstrateChunk1.confidenceCheckPrompt} onRate={() => {}} />
              <NavRow
                onNext={goNext} onBack={goBack}
                disabled={!isPhaseComplete(demo1Required)}
                disabledHint="Work through every example and question above to continue."
              />
            </div>
          )}

          {phase === 'demo2' && (
            <div className="space-y-5">
              <h2 className="text-lg font-black text-[#1e293b]">Going further</h2>
              <p className="text-[13.5px] text-stone-600 leading-relaxed">{content.demonstrateChunk2.explanation}</p>
              {content.demonstrateChunk2.workedExamples.map(ex => (
                <WorkedExample key={ex.id} example={ex} onFullyRevealed={() => markAnswered(`wx-${ex.id}`)} />
              ))}
              {content.demonstrateChunk2.knowledgeChecks.map((q, i) => (
                <KnowledgeCheck key={i} question={q.question} options={q.options} correctIndex={q.correctIndex} explanation={q.explanation} onAnswered={() => markAnswered(`demo2-${i}`)} />
              ))}
              <ConfidenceCheck prompt={content.demonstrateChunk2.confidenceCheckPrompt} onRate={() => {}} />
              <NavRow
                onNext={goNext} onBack={goBack}
                disabled={!isPhaseComplete(demo2Required)}
                disabledHint="Work through every example and question above to continue."
              />
            </div>
          )}

          {phase === 'apply' && (
            <div className="space-y-5">
              <h2 className="text-lg font-black text-[#1e293b]">Practice</h2>
              <Scratchpad storageKey={`${storageKey}-apply`} />
              {content.apply.fadingProblems.map(p => (
                <FadingProblemBlock key={p.id} problem={p} onDone={() => markAnswered(`wx-${p.id}`)} />
              ))}
              {content.apply.independentPractice.map(item => (
                <IndependentPracticeBlock
                  key={item.id} item={item} content={content}
                  onResolved={(correct) => { if (correct) markAnswered(`ip-${item.id}`); }}
                />
              ))}
              <NavRow
                onNext={goNext} onBack={goBack} nextLabel="I'm ready for the quiz"
                disabled={!isPhaseComplete(applyRequired)}
                disabledHint="Get every practice question correct (use the hints if you're stuck) to continue."
              />
            </div>
          )}

          {phase === 'assess' && (
            <div className="space-y-5">
              <h2 className="text-lg font-black text-[#1e293b]">Test Yourself</h2>
              <p className="text-[13px] text-stone-500">
                Score {content.masteryThresholdPct}% or higher to master this topic. You can retry any time.
              </p>
              <QuizBlockWithCompletion questions={quizQuestions} storageKey={storageKey} onComplete={handleQuizComplete} key={phase} />
              {quizScorePct !== null && (
                <NavRow onNext={() => setPhase(quizScorePct >= content.masteryThresholdPct ? 'reflect' : 'remediation')} onBack={goBack} />
              )}
            </div>
          )}

          {phase === 'remediation' && remediationTarget && (
            <RemediationBlock
              content={content}
              objectiveId={remediationTarget}
              onPass={() => setPhase('assess')}
            />
          )}

          {phase === 'reflect' && (
            <div className="space-y-5">
              <h2 className="text-lg font-black text-[#1e293b]">Nice work — you've mastered this topic</h2>
              <SummaryCard points={content.meta.objectives.map(o => o.text)} />
              <Reflection prompts={content.reflection} onComplete={() => setPhase('done')} />
            </div>
          )}

          {phase === 'done' && (
            <div className="text-center py-12">
              <LearningOutcomes outcomes={content.meta.objectives.map(o => o.text)} />
              <p className="text-[13px] text-stone-500 mt-6">Lesson complete. Nice work.</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
    </MisconceptionsContext.Provider>
  );
}

function NavRow({
  onNext, onBack, nextLabel = 'Continue', disabled = false, disabledHint,
}: {
  onNext: () => void; onBack: () => void; nextLabel?: string; disabled?: boolean; disabledHint?: string;
}) {
  return (
    <div className="pt-2">
      <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        <button
          onClick={onBack}
          className="flex items-center justify-center gap-1.5 py-2.5 sm:py-1.5 text-[13px] font-bold text-stone-400 hover:text-stone-700 active:scale-[0.97] transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </button>
        <button
          onClick={onNext}
          disabled={disabled}
          className="flex items-center justify-center gap-1.5 px-5 py-3 sm:py-2.5 rounded-xl text-[13px] font-black text-white bg-[#1e293b] disabled:opacity-30 active:scale-[0.97] transition-all"
        >
          {nextLabel} <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
      {disabled && disabledHint && (
        <p className="text-[11.5px] text-stone-400 text-center sm:text-right mt-2">{disabledHint}</p>
      )}
    </div>
  );
}

// QuizBlock persists its result to localStorage but has no completion callback
// prop, so we poll the stored record while this phase is mounted and fire once
// when it changes. Polling is scoped to this component's lifetime (unmounted
// when the phase changes), so the interval never runs longer than needed.
function QuizBlockWithCompletion({
  questions, storageKey, onComplete,
}: {
  questions: QuizQuestion[]; storageKey: string; onComplete: (score: number, total: number) => void;
}) {
  const lastSeen = useRef<string>('');

  useEffect(() => {
    const id = setInterval(() => {
      try {
        const raw = localStorage.getItem('prospect_quiz_' + storageKey);
        if (raw && raw !== lastSeen.current) {
          lastSeen.current = raw;
          const parsed = JSON.parse(raw);
          onComplete(parsed.score, parsed.total);
        }
      } catch { /* ignore malformed localStorage entries */ }
    }, 800);
    return () => clearInterval(id);
  }, [storageKey, onComplete]);

  return <QuizBlock storageKey={storageKey} questions={questions} shuffle={false} preventSkip />;
}

function RemediationBlock({
  content, objectiveId, onPass,
}: {
  content: LessonContent; objectiveId: string; onPass: () => void;
}) {
  const remediation = content.remediation.find(r => r.objectiveId === objectiveId) ?? content.remediation[0];
  const [correct, setCorrect] = useState(0);
  const [attempted, setAttempted] = useState(0);

  if (!remediation) return null;

  const passed = attempted >= remediation.passThreshold.total && correct >= remediation.passThreshold.correct;

  return (
    <div className="space-y-5">
      <div className="rounded-xl bg-amber-50 border border-amber-200/80 px-4 py-3.5">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-amber-700 mb-1">Let's try a different approach</p>
        <p className="text-[13px] text-stone-700 leading-relaxed">{remediation.analogy}</p>
      </div>
      <p className="text-[13.5px] text-stone-600 leading-relaxed">{remediation.explanation}</p>
      {remediation.workedExamples.map(ex => <WorkedExample key={ex.id} example={ex} />)}
      {remediation.practice.map(item => (
        <IndependentPracticeBlock
          key={item.id}
          item={item}
          content={content}
          onResolved={(isCorrect) => {
            setAttempted(a => a + 1);
            if (isCorrect) setCorrect(c => c + 1);
          }}
        />
      ))}
      <p className="text-[12px] text-stone-500">
        {correct}/{remediation.passThreshold.total} needed to unlock the quiz again ({remediation.passThreshold.correct} required).
      </p>
      <button
        disabled={!passed}
        onClick={onPass}
        className="w-full py-3 rounded-xl text-sm font-black text-white bg-[#1e293b] disabled:opacity-30 transition-opacity"
      >
        Retry the quiz
      </button>
    </div>
  );
}
