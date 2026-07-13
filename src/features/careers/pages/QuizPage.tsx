import { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, CheckCircle2, RefreshCw, ArrowRight, SkipForward } from 'lucide-react';
import { quizQuestions } from '../data/quizQuestions';
import { computeQuizResults, type QuizResults } from '../data/quizScoringLogic';
import { SkippedQuestionsPanel } from '../components/SkippedQuestionsPanel';
import { getStudentSession } from '../../../lib/auth';
import { saveQuizResults } from '../../../lib/myFuture';
import { ToastContext } from '../../../shared/components/toast';

// ── Types ─────────────────────────────────────────────────────────────────────

interface QuizAnswer {
  questionId: string;
  value: number;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const likertOptions = [
  {
    label: 'Strongly Dislike',
    short: 'Strongly\nDislike',
    value: 1,
    // oklch: low-lightness red, chroma pulled back so it reads cleanly on white
    selectedBg: 'bg-red-600',
    selectedRing: 'ring-red-200',
    dot: 'bg-red-300',
  },
  {
    label: 'Dislike',
    short: 'Dislike',
    value: 2,
    selectedBg: 'bg-orange-400',
    selectedRing: 'ring-orange-200',
    dot: 'bg-orange-300',
  },
  {
    label: 'Neutral',
    short: 'Neutral',
    value: 3,
    selectedBg: 'bg-slate-400',
    selectedRing: 'ring-slate-200',
    dot: 'bg-slate-300',
  },
  {
    label: 'Like',
    short: 'Like',
    value: 4,
    selectedBg: 'bg-green-500',
    selectedRing: 'ring-green-200',
    dot: 'bg-green-300',
  },
  {
    label: 'Strongly Like',
    short: 'Strongly\nLike',
    value: 5,
    selectedBg: 'bg-emerald-600',
    selectedRing: 'ring-emerald-200',
    dot: 'bg-emerald-300',
  },
];

// Per-RIASEC-type color for results bars
const riasecColors: Record<string, string> = {
  R: 'bg-red-500',
  I: 'bg-blue-500',
  A: 'bg-violet-500',
  S: 'bg-green-500',
  E: 'bg-amber-500',
  C: 'bg-slate-500',
};

const riasecLabels: Record<string, string> = {
  R: 'Realistic',
  I: 'Investigative',
  A: 'Artistic',
  S: 'Social',
  E: 'Enterprising',
  C: 'Conventional',
};

// ── Quiz Phase ────────────────────────────────────────────────────────────────

function QuizPhase({
  onComplete,
  onNavigate,
}: {
  onComplete: (answers: QuizAnswer[], skipped: number) => void;
  onNavigate: (page: string) => void;
}) {
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [skippedQuestions, setSkippedQuestions] = useState<string[]>([]);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [showSkipReminder, setShowSkipReminder] = useState(false);

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const currentAnswer = answers.find((a) => a.questionId === currentQuestion.id)?.value;
  const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;
  const isLast = currentQuestionIndex === quizQuestions.length - 1;
  const hasSkipped = skippedQuestions.length > 0;

  const skippedQuestionDetails = skippedQuestions
    .map((id) => {
      const q = quizQuestions.find((q) => q.id === id);
      const idx = quizQuestions.findIndex((q) => q.id === id);
      return q ? { id, question: q.question, index: idx } : null;
    })
    .filter(Boolean) as { id: string; question: string; index: number }[];

  const handleAnswer = (value: number) => {
    setAnswers((prev) => {
      const existing = prev.find((a) => a.questionId === currentQuestion.id);
      if (existing) {
        return prev.map((a) => (a.questionId === currentQuestion.id ? { ...a, value } : a));
      }
      return [...prev, { questionId: currentQuestion.id, value }];
    });
    setSkippedQuestions((prev) => prev.filter((id) => id !== currentQuestion.id));
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setTimeout(() => setCurrentQuestionIndex((prev) => prev + 1), 300);
    }
  };

  const handleSkip = () => {
    if (!skippedQuestions.includes(currentQuestion.id)) {
      setSkippedQuestions((prev) => [...prev, currentQuestion.id]);
    }
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setTimeout(() => setCurrentQuestionIndex((prev) => prev + 1), 300);
    }
  };

  const handleJumpToQuestion = (questionIndex: number) => {
    setCurrentQuestionIndex(questionIndex);
    setIsPanelOpen(false);
  };

  const handleFinish = () => {
    if (answers.length === 0) return;
    if (hasSkipped) {
      setShowSkipReminder(true);
    } else {
      onComplete(answers, skippedQuestions.length);
    }
  };

  const handleConfirmFinish = () => {
    setShowSkipReminder(false);
    onComplete(answers, skippedQuestions.length);
  };

  return (
    <div className="min-h-screen">

      <div className="pt-4 pb-20 px-4 flex flex-col items-center">
        <div className="max-w-2xl w-full">

          {/* Back to dashboard for logged-in students */}
          {getStudentSession() && (
            <button
              onClick={() => onNavigate('student-dashboard')}
              className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-stone-400 hover:text-stone-900 transition-colors mb-6"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Back to Dashboard
            </button>
          )}

          {/* Header & Progress */}
          <div className="mb-10">
            <div className="flex justify-between items-start mb-5">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1.5">
                  RIASEC Assessment
                </p>
                <h1
                  className="text-2xl md:text-3xl font-black text-slate-900"
                  style={{ letterSpacing: '-0.03em' }}
                >
                  Career Quiz
                </h1>
              </div>

              <div className="flex items-center gap-3 mt-1">
                {hasSkipped && (
                  <motion.button
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => setIsPanelOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-700 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-amber-100 transition-colors whitespace-nowrap"
                  >
                    <SkipForward className="w-3 h-3" />
                    {skippedQuestions.length} skipped
                  </motion.button>
                )}

                {/* Question counter pill */}
                <div className="flex items-baseline gap-0.5 bg-slate-50 border border-slate-100 rounded-lg px-3 py-1.5">
                  <span
                    className="text-slate-900 font-black text-lg"
                    style={{ letterSpacing: '-0.03em' }}
                  >
                    {currentQuestionIndex + 1}
                  </span>
                  <span className="text-slate-400 text-xs font-medium">
                    /{quizQuestions.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Amber progress bar */}
            <div className="h-0.75 w-full bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: 'easeOut' }}
                className="h-full bg-amber-400 rounded-full"
              />
            </div>
          </div>

          {/* Question — no card border, whitespace carries weight */}
          <div className="mb-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="min-h-28 flex flex-col justify-center mb-10"
              >
                <h2
                  className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug text-center"
                  style={{ letterSpacing: '-0.015em' }}
                >
                  {currentQuestion.question}
                </h2>
              </motion.div>
            </AnimatePresence>

            {/* Likert Scale — labels always visible */}
            <div className="grid grid-cols-5 gap-2 sm:gap-3">
              {likertOptions.map((option) => {
                const isSelected = currentAnswer === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => handleAnswer(option.value)}
                    className={`group flex flex-col items-center gap-2 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-700 rounded-xl p-1 sm:p-2 ${
                      isSelected ? '' : 'opacity-50 hover:opacity-80'
                    }`}
                  >
                    <div
                      className={`w-full aspect-square rounded-xl flex items-center justify-center transition-all duration-150 ${
                        isSelected
                          ? `${option.selectedBg} ring-2 ${option.selectedRing}`
                          : 'bg-slate-100 border border-slate-200 group-hover:border-slate-300'
                      }`}
                    >
                      {isSelected ? (
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      ) : (
                        <span
                          className={`w-2 h-2 rounded-full ${option.dot} opacity-60 group-hover:opacity-100 transition-opacity`}
                        />
                      )}
                    </div>
                    {/* Labels always visible — whitespace-pre-wrap to split "Strongly\nDislike" */}
                    <span
                      className={`text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-center leading-tight whitespace-pre-line transition-colors ${
                        isSelected ? 'text-slate-900' : 'text-slate-400'
                      }`}
                    >
                      {option.short}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Inline hint — no box */}
            <p className="mt-6 text-center text-[11px] text-slate-400 italic leading-relaxed">
              No right or wrong answers — be honest for the best matches.
            </p>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center gap-3">
            <button
              onClick={() => setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0))}
              disabled={currentQuestionIndex === 0}
              className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-widest text-slate-900 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              Prev
            </button>

            <button
              onClick={handleSkip}
              className="flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-widest text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-all"
            >
              <SkipForward className="w-3.5 h-3.5" />
              Skip
            </button>

            {isLast ? (
              <button
                onClick={handleFinish}
                disabled={answers.length === 0}
                className="bg-slate-900 text-white px-6 py-3 sm:px-10 sm:py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-700 active:scale-95 disabled:opacity-50 transition-all"
              >
                Finish Quiz
              </button>
            ) : (
              <button
                onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                disabled={!currentAnswer}
                className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-widest text-slate-900 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Skipped Questions Panel */}
      <SkippedQuestionsPanel
        isOpen={isPanelOpen}
        skippedQuestions={skippedQuestionDetails}
        onClose={() => setIsPanelOpen(false)}
        onSelectQuestion={handleJumpToQuestion}
      />

      {/* Skip Reminder Modal */}
      <AnimatePresence>
        {showSkipReminder && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSkipReminder(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ ease: 'easeOut', duration: 0.2 }}
              className="fixed inset-4 md:inset-auto md:left-1/2 md:-translate-x-1/2 md:top-1/2 md:-translate-y-1/2 bg-white rounded-2xl p-8 z-50 max-w-lg border border-slate-200"
            >
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-amber-50 border border-amber-100 rounded-full mb-5">
                  <SkipForward className="w-6 h-6 text-amber-500" />
                </div>
                <h2
                  className="text-xl font-black text-slate-900 mb-2"
                  style={{ letterSpacing: '-0.02em' }}
                >
                  {skippedQuestions.length} question{skippedQuestions.length !== 1 ? 's' : ''} skipped
                </h2>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Going back gives you more accurate results. Skipped questions are treated as Neutral.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => setShowSkipReminder(false)}
                  className="w-full bg-slate-900 text-white px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-700 transition-all"
                >
                  Go Back & Answer
                </button>
                <button
                  onClick={handleConfirmFinish}
                  className="w-full bg-slate-50 text-slate-600 px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-100 transition-all"
                >
                  View Results Anyway
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Results Phase ─────────────────────────────────────────────────────────────

function ResultsPhase({
  results,
  onRetake,
  onNavigate,
}: {
  results: QuizResults;
  onRetake: () => void;
  onNavigate: (page: string) => void;
}) {
  const toast = useContext(ToastContext);
  const topCareers = results.topCareerMatches.slice(0, 15);

  const subjectsByImportance = {
    Essential: results.subjectRecommendations.filter((s) => s.importance === 'Essential'),
    Recommended: results.subjectRecommendations.filter((s) => s.importance === 'Recommended'),
    Useful: results.subjectRecommendations.filter((s) => s.importance === 'Useful'),
  };

  const allSubjects = [
    ...subjectsByImportance.Essential.map((s) => ({ ...s, importance: 'Essential' as const })),
    ...subjectsByImportance.Recommended.map((s) => ({ ...s, importance: 'Recommended' as const })),
    ...subjectsByImportance.Useful.map((s) => ({ ...s, importance: 'Useful' as const })),
  ];

  const importanceBadge: Record<string, string> = {
    Essential: 'bg-red-50 text-red-600 border border-red-100',
    Recommended: 'bg-amber-50 text-amber-700 border border-amber-100',
    Useful: 'bg-stone-50 text-stone-500 border border-stone-200',
  };

  const compatibilityStyle = (score: number) => {
    if (score >= 80) return 'bg-emerald-50 text-emerald-700 border border-emerald-100';
    if (score >= 60) return 'bg-amber-50 text-amber-700 border border-amber-100';
    return 'bg-stone-50 text-stone-500 border border-stone-200';
  };

  const handleShare = async () => {
    const encoded = btoa(
      JSON.stringify({ topCodes: results.topCodes, percentages: results.percentages }),
    );
    const url = `${window.location.origin}?quiz-results=${encoded}`;
    try {
      await navigator.clipboard.writeText(url);
      toast?.success('Share link copied to clipboard.');
    } catch {
      toast?.error('Could not copy link — try again.');
    }
  };

  return (
    <div className="min-h-screen">

      <div className="pt-4 pb-20 px-4">
        <div className="max-w-5xl mx-auto">

          {/* Back button */}
          {getStudentSession() ? (
            <button
              onClick={() => onNavigate('student-dashboard')}
              className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-stone-400 hover:text-stone-900 transition-colors mb-6"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Back to Dashboard
            </button>
          ) : (
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-stone-400 hover:text-stone-900 transition-colors mb-6"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Back to Home
            </button>
          )}

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 mb-2">
              Assessment Complete
            </p>
            <h1
              className="text-3xl md:text-4xl font-black text-brand-dark mb-4"
              style={{ letterSpacing: '-0.025em' }}
            >
              Your RIASEC Profile
            </h1>
            <p className="text-[15px] leading-[1.65] text-stone-500 max-w-2xl mb-6">
              {results.profileDescription}
            </p>

            {/* Top-code banner */}
            <div className="flex flex-wrap gap-2 mb-6">
              {results.topCodes.map((code, i) => (
                <span
                  key={code}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${
                    i === 0
                      ? 'bg-brand-dark text-white'
                      : 'border border-stone-200 text-stone-600'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      i === 0 ? 'bg-amber-400' : 'bg-stone-300'
                    }`}
                  />
                  {riasecLabels[code] || code}
                  {i === 0 && (
                    <span className="text-amber-400 text-[9px] ml-0.5">Primary</span>
                  )}
                </span>
              ))}
            </div>

            {/* Retake button — prominent, right below the profile */}
            <button
              onClick={onRetake}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-stone-200 text-stone-700 rounded-xl font-black text-xs uppercase tracking-widest hover:border-stone-400 hover:bg-stone-50 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retake Quiz
            </button>
          </motion.div>

          {/* RIASEC Bars */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 mb-14"
          >
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 mb-8">
              Scores
            </p>
            <div className="space-y-6">
              {Object.entries(results.percentages)
                .sort(([, a], [, b]) => b - a)
                .map(([code, score], index) => {
                  const isTop3 = results.topCodes.includes(code);
                  const barColor = riasecColors[code] || 'bg-stone-500';
                  return (
                    <motion.div
                      key={code}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.12 + index * 0.04, ease: 'easeOut' }}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs text-white ${barColor}`}
                          >
                            {code}
                          </span>
                          <span
                            className={`text-sm font-bold ${
                              isTop3 ? 'text-brand-dark' : 'text-stone-400'
                            }`}
                          >
                            {riasecLabels[code] || code}
                          </span>
                        </div>
                        <span
                          className={`text-sm font-bold tabular-nums ${
                            isTop3 ? 'text-stone-700' : 'text-stone-300'
                          }`}
                        >
                          {score}%
                        </span>
                      </div>
                      <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${score}%` }}
                          transition={{
                            delay: 0.2 + index * 0.06,
                            duration: 0.9,
                            ease: 'easeOut',
                          }}
                          className={`h-full rounded-full ${isTop3 ? barColor : 'bg-stone-200'}`}
                        />
                      </div>
                    </motion.div>
                  );
                })}
            </div>
          </motion.div>

          {/* Top Career Matches */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-14"
          >
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 mb-2">
              Career Matches
            </p>
            <h2
              className="text-2xl font-black text-brand-dark mb-8"
              style={{ letterSpacing: '-0.02em' }}
            >
              Your Best Matches
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topCareers.map((career, index) => {
                const isTopMatch = index < 3;
                return (
                  <motion.div
                    key={career.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 + Math.min(index, 8) * 0.04, ease: 'easeOut' }}
                    className={`relative border rounded-2xl p-5 cursor-pointer transition-all ${
                      isTopMatch
                        ? 'border-amber-200 bg-amber-50/40 hover:bg-amber-50/70'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                    onClick={() => onNavigate('careers')}
                  >
                    {isTopMatch && (
                      <span className="absolute top-3 right-3 text-[9px] font-black uppercase tracking-wider text-amber-600">
                        Top Match
                      </span>
                    )}
                    <div className="mb-3 pr-16">
                      <p className="text-[9px] font-black uppercase tracking-[0.15em] text-stone-400 mb-1">
                        {career.category}
                      </p>
                      <h3
                        className="text-sm font-bold text-brand-dark leading-snug"
                        style={{ letterSpacing: '-0.01em' }}
                      >
                        {career.title}
                      </h3>
                    </div>

                    <p className="text-sm leading-relaxed text-stone-500 line-clamp-2 mb-3">
                      {career.whyItFits}
                    </p>

                    <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                      <div className="flex items-center gap-2 text-xs text-stone-400">
                        <span>{career.salaryRange}</span>
                        <span>·</span>
                        <span>{career.jobDemand} demand</span>
                      </div>
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-full ${compatibilityStyle(
                          career.compatibilityScore ?? 0,
                        )}`}
                      >
                        {career.compatibilityScore ?? 0}%
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Subject Recommendations */}
          {allSubjects.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-14"
            >
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 mb-2">
                Recommended Subjects
              </p>
              <h2
                className="text-2xl font-black text-brand-dark mb-8"
                style={{ letterSpacing: '-0.02em' }}
              >
                Subjects to Focus On
              </h2>

              <div className="bg-white border border-stone-200 rounded-2xl divide-y divide-stone-100 overflow-hidden">
                {allSubjects.map((sub) => (
                  <div key={sub.subject} className="flex items-start gap-4 px-5 py-4">
                    <span
                      className={`shrink-0 mt-0.5 text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-md ${
                        importanceBadge[sub.importance]
                      }`}
                    >
                      {sub.importance}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-brand-dark mb-0.5">{sub.subject}</p>
                      <p className="text-sm text-stone-500 leading-relaxed">{sub.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Next Steps */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-10"
          >
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 mb-6">
              Next Steps
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => onNavigate('careers')}
                className="flex items-center gap-2 px-5 py-2.5 bg-brand-dark text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-stone-800 transition-colors"
              >
                Explore Careers
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onNavigate('bursaries')}
                className="px-5 py-2.5 border border-stone-200 text-stone-700 rounded-xl font-bold text-xs uppercase tracking-widest hover:border-stone-400 transition-colors"
              >
                Find Bursaries
              </button>
              <button
                onClick={() => onNavigate('library')}
                className="px-5 py-2.5 border border-stone-200 text-stone-700 rounded-xl font-bold text-xs uppercase tracking-widest hover:border-stone-400 transition-colors"
              >
                Study Resources
              </button>
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-5 py-2.5 border border-stone-200 text-stone-500 rounded-xl font-bold text-xs uppercase tracking-widest hover:border-stone-400 transition-colors"
              >
                Share Results
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// ── Root Component ────────────────────────────────────────────────────────────

function QuizPage({ onNavigate }: { onNavigate: (page: any) => void }) {
  const [quizResults, setQuizResults] = useState<QuizResults | null>(null);

  const handleComplete = (answers: QuizAnswer[]) => {
    const results = computeQuizResults(answers);
    setQuizResults(results);
    // Save to Supabase if student is logged in (silent no-op for guests)
    saveQuizResults(answers, results);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRetake = () => {
    setQuizResults(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence mode="wait">
      {!quizResults ? (
        <motion.div
          key="quiz"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <QuizPhase onComplete={handleComplete} onNavigate={onNavigate} />
        </motion.div>
      ) : (
        <motion.div
          key="results"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <ResultsPhase
            results={quizResults}
            onRetake={handleRetake}
            onNavigate={onNavigate}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default QuizPage;
