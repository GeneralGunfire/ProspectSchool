import { useState, useEffect, useRef, useCallback } from 'react'
import { useStudySession } from '../../../../../../../providers/StudySessionContext'
import { loadTopicProgress as _loadProgress, saveTopicProgress as _saveProgress } from '../../../../../../../lib/studyProgress';
import {
  BookOpen, ChevronRight, ChevronLeft, RotateCcw, CheckCircle,
  XCircle, Lightbulb, Award, PenLine, X, Undo2, Trash2,
  BarChart2, Globe, Building2,
} from 'lucide-react';

// ── constants ──────────────────────────────────────────────────────────────
const SUBJECT = 'Economics';
const GRADE = 10;
const TOPIC_ID = 'economic-systems';
const NEXT_TOPIC_ID = 'circular-flow-model';
const STORAGE_KEY_PREFIX = 'scratchpad_econ-systems_';


const TOPIC = {
  title: 'Economic Systems',
  description: 'How societies decide what to produce, how to produce it, and for whom.',
  interactiveSteps: [
    {
      label: 'The Three Economic Questions',
      tokens: ['WHAT', 'to produce?', '|', 'HOW', 'to produce?', '|', 'FOR WHOM', 'to produce?'],
      explanation:
        'Every society faces three fundamental questions. Different economic systems answer them in different ways.',
    },
    {
      label: 'Market Economy',
      tokens: ['Private', 'ownership', '+', 'Price', 'mechanism', '=', 'Market', 'Economy'],
      explanation:
        'Decisions are made by individuals and firms through supply and demand. Adam Smith called this the "invisible hand" — self-interest guides resources to where they are most valued.',
    },
    {
      label: 'Command Economy',
      tokens: ['Government', 'plans', '+', 'Central', 'control', '=', 'Command', 'Economy'],
      explanation:
        'The state owns the means of production and decides what, how, and for whom to produce. Examples: former USSR, North Korea.',
    },
    {
      label: 'Mixed Economy',
      tokens: ['Market', 'forces', '+', 'Government', 'intervention', '=', 'Mixed', 'Economy'],
      explanation:
        'Most modern economies — including South Africa — combine private enterprise with government regulation and public services (e.g. Eskom, SANRAL, public hospitals).',
    },
  ],
  guidedItem: {
    scenario:
      'Three countries face the same question: "Should the state build a new steel plant?" How does each economic system answer it?',
    steps: [
      {
        title: 'Free-Market Country (e.g. USA approach)',
        description:
          'Private steel companies decide based on profit potential. If demand is high and costs allow profit, a firm will build the plant. Government does not interfere — the market decides.',
        insight: 'Market economy: price signals and profit motive guide resource allocation.',
      },
      {
        title: 'Command Economy (e.g. North Korea)',
        description:
          'The central planning committee decides. If the government believes steel is needed for national development, it orders the plant to be built — regardless of cost or profitability.',
        insight: 'Command economy: government planners make all major production decisions.',
      },
      {
        title: 'South Africa (Mixed Economy)',
        description:
          'ArcelorMittal (private) operates steel plants for profit. Eskom (state-owned) provides electricity. Government sets safety and environmental regulations. Both sectors co-exist.',
        insight: 'Mixed economy: private ownership + public enterprises + government regulation.',
      },
    ],
  },
  initialQuestions: [
    {
      question: 'Which economic system relies on the "price mechanism" to allocate resources?',
      options: ['Command economy', 'Market economy', 'Mixed economy', 'Traditional economy'],
      answer: 1,
      explanation:
        'In a market economy, prices signal where resources are needed — high prices attract producers, low prices indicate oversupply. This is the price mechanism.',
    },
    {
      question: 'South Africa is best described as which type of economic system?',
      options: ['Pure market economy', 'Command economy', 'Mixed economy', 'Traditional economy'],
      answer: 2,
      explanation:
        'South Africa combines private enterprise (JSE-listed firms) with state-owned enterprises (Eskom, Transnet) and government regulation — a classic mixed economy.',
    },
    {
      question: 'In a command economy, who decides how resources are allocated?',
      options: [
        'Individual consumers through spending choices',
        'The central government or state planners',
        'Stock market prices',
        'Multinational corporations',
      ],
      answer: 1,
      explanation:
        'Command economies give the government (central planners) authority over all major production and distribution decisions.',
    },
    {
      question: 'What did Adam Smith mean by the "invisible hand"?',
      options: [
        'Government secretly controls markets',
        'Prices are set by hidden cartels',
        'Self-interest in a free market guides resources to their best use',
        'Technology automates production decisions',
      ],
      answer: 2,
      explanation:
        'Adam Smith argued that when individuals pursue their own self-interest in a competitive market, they are guided as if by an "invisible hand" to promote the overall welfare of society.',
    },
  ],
  remediationQuestions: [
    {
      question: 'A country where the government owns all factories and sets all prices is an example of a:',
      options: ['Market economy', 'Mixed economy', 'Command economy', 'Open economy'],
      answer: 2,
      explanation:
        'Full government ownership of production and price-setting is the defining feature of a command (planned) economy.',
    },
    {
      question: 'Which feature is common to BOTH market and mixed economies?',
      options: [
        'Central government sets all prices',
        'Some degree of private ownership exists',
        'The state owns all means of production',
        'Tradition and custom guide production',
      ],
      answer: 1,
      explanation:
        'Both market and mixed economies allow private ownership. The difference is that mixed economies also include significant government intervention or state-owned enterprises.',
    },
  ],
  hardQuestions: [
    {
      question:
        'A government imposes a minimum wage, regulates pollution, but allows private firms to operate freely otherwise. This policy mix is most consistent with:',
      options: [
        'A pure market economy, because firms still operate freely',
        'A command economy, because the government intervenes',
        'A mixed economy, because private enterprise coexists with government regulation',
        'A traditional economy, because custom dictates wages',
      ],
      answer: 2,
      explanation:
        'Minimum wages and pollution rules are government interventions, but firms still own capital and make most decisions. This combination defines a mixed economy.',
    },
    {
      question:
        'Country X transitions from a command economy to a market economy. Which outcome is MOST likely in the short term?',
      options: [
        'Immediate equal distribution of income',
        'Price increases and income inequality as markets set prices freely',
        'Full employment guaranteed by the state',
        'Zero inflation due to competition',
      ],
      answer: 1,
      explanation:
        'When price controls are removed, prices often rise to market levels, and income inequality typically increases as some benefit from the transition more than others — a common experience in post-Soviet states.',
    },
    {
      question:
        'Eskom is a state-owned enterprise that provides electricity in South Africa. Its existence in a market-driven economy best illustrates:',
      options: [
        'A command economy replacing the market',
        'Market failure leading to government provision of a public good',
        'The invisible hand solving the energy problem',
        'Traditional economic systems at work',
      ],
      answer: 1,
      explanation:
        'Electricity is a natural monopoly — a single provider is most efficient. Left to the market alone, supply may be inadequate or unaffordable. Government provision through Eskom illustrates the mixed economy response to market failure.',
    },
    {
      question: 'Which of the following is the BEST argument for a market economy over a command economy?',
      options: [
        'It guarantees equal income for all citizens',
        'It eliminates business cycles and recessions',
        'Price signals efficiently coordinate millions of individual decisions without central planning',
        'The government can ensure strategic industries are always profitable',
      ],
      answer: 2,
      explanation:
        'Friedrich Hayek argued that no central planner can process all the information needed to allocate resources efficiently. The price mechanism aggregates and transmits this information automatically — the core argument for market economies.',
    },
  ],
};

// ── types ──────────────────────────────────────────────────────────────────
enum ViewState {
  OVERVIEW = 'OVERVIEW',
  INTERACTIVE = 'INTERACTIVE',
  GUIDED = 'GUIDED',
  QUIZ = 'QUIZ',
  FEEDBACK = 'FEEDBACK',
}

interface QuizQuestion {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

type ScratchLine = { points: { x: number; y: number }[]; color: string; width: number };
interface ScratchpadState {
  lines: ScratchLine[];
  undoHistory: ScratchLine[][];
}


// ── sub-components ─────────────────────────────────────────────────────────
function InteractiveStep({
  step,
  index,
  total,
  onNext,
  onPrev,
}: {
  step: (typeof TOPIC.interactiveSteps)[0];
  index: number;
  total: number;
  onNext: () => void;
  onPrev: () => void;
}) {
  const icons = [BarChart2, Globe, Building2, Globe];
  const Icon = icons[index % icons.length];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-slate-600 flex items-center justify-center">
          <Icon className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">
            Step {index + 1} of {total}
          </p>
          <h3 className="font-semibold text-slate-800">{step.label}</h3>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {step.tokens.map((token, i) => (
          <span
            key={i}
            className={
              token === '|' || token === '=' || token === '+'
                ? 'text-slate-400 font-bold text-lg px-1'
                : token === 'WHAT' || token === 'HOW' || token === 'FOR WHOM'
                  ? 'bg-slate-600 text-white px-2 py-1 rounded-lg font-bold text-sm'
                  : [
                        'Market',
                        'Government',
                        'Private',
                        'Command',
                        'Mixed',
                        'Price',
                        'Central',
                      ].includes(token)
                    ? 'bg-slate-100 text-slate-800 px-2 py-1 rounded-lg font-semibold text-sm border border-slate-200'
                    : 'bg-slate-100 text-slate-700 px-2 py-1 rounded-lg text-xs font-medium'
            }
          >
            {token}
          </span>
        ))}
      </div>

      <p className="text-slate-600 text-xs leading-relaxed bg-slate-50 rounded-xl p-3 border border-slate-100">
        {step.explanation}
      </p>

      <div className="flex gap-3">
        <button
          onClick={onPrev}
          disabled={index === 0}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>
        <button
          onClick={onNext}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-600 text-white text-sm hover:bg-slate-700 transition-colors ml-auto"
        >
          {index === total - 1 ? 'Start Guided Example' : 'Next'}
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function GuidedExample({ onFinish }: { onFinish: () => void }) {
  const [step, setStep] = useState(0);
  const steps = TOPIC.guidedItem.steps;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-slate-600 flex items-center justify-center">
          <Lightbulb className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">
            Guided Example · Step {step + 1} of {steps.length}
          </p>
          <h3 className="font-semibold text-slate-800">Comparing Economic Systems</h3>
        </div>
      </div>

      <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
        <p className="text-xs text-slate-800 font-medium">{TOPIC.guidedItem.scenario}</p>
      </div>

      <div className="space-y-3">
        {steps.slice(0, step + 1).map((s, i) => (
          <div
            key={i}
            className={`rounded-xl p-3 border transition-all ${
              i === step
                ? 'border-slate-300 bg-slate-50'
                : 'border-slate-100 bg-slate-50 opacity-70'
            }`}
          >
            <p className="font-semibold text-slate-800 text-sm mb-1">
              {i + 1}. {s.title}
            </p>
            <p className="text-slate-600 text-xs leading-relaxed">{s.description}</p>
            {i === step && (
              <div className="mt-3 flex items-start gap-2 bg-white rounded-lg p-3 border border-slate-200">
                <CheckCircle className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-slate-700 font-medium">{s.insight}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        {step > 0 && (
          <button
            onClick={() => setStep(s => s - 1)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm hover:bg-slate-50 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
        )}
        <button
          onClick={() => (step < steps.length - 1 ? setStep(s => s + 1) : onFinish())}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-600 text-white text-sm hover:bg-slate-700 transition-colors ml-auto"
        >
          {step < steps.length - 1 ? 'Next Step' : 'Start Quiz'}
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function QuizModule({
  questions,
  onComplete,
}: {
  questions: QuizQuestion[];
  onComplete: (score: number) => void;
}) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);

  const q = questions[current];

  function handleSelect(i: number) {
    if (revealed) return;
    setSelected(i);
  }

  function handleReveal() {
    if (selected === null) return;
    setRevealed(true);
    if (selected === q.answer) setScore(s => s + 1);
  }

  function handleNext() {
    if (current + 1 >= questions.length) {
      const finalScore = score + (selected === q.answer ? 1 : 0);
      onComplete(finalScore);
    } else {
      setCurrent(c => c + 1);
      setSelected(null);
      setRevealed(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">
          Question {current + 1} of {questions.length}
        </p>
        <span className="text-xs text-slate-500">Score: {score}</span>
      </div>

      <p className="font-medium text-slate-800 leading-relaxed">{q.question}</p>

      <div className="space-y-2">
        {q.options.map((opt, i) => {
          let cls =
            'w-full text-left px-3 py-2 rounded-xl border text-xs transition-all cursor-pointer ';
          if (!revealed) {
            cls +=
              selected === i
                ? 'border-slate-400 bg-slate-50 text-slate-800'
                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700';
          } else {
            if (i === q.answer) cls += 'border-slate-400 bg-slate-50 text-slate-800';
            else if (i === selected) cls += 'border-slate-400 bg-slate-50 text-slate-800';
            else cls += 'border-slate-200 text-slate-400';
          }
          return (
            <button key={i} className={cls} onClick={() => handleSelect(i)}>
              {opt}
            </button>
          );
        })}
      </div>

      {revealed && (
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex gap-3">
          <Lightbulb className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-slate-800">{q.explanation}</p>
        </div>
      )}

      <div className="flex gap-3 justify-end">
        {!revealed ? (
          <button
            onClick={handleReveal}
            disabled={selected === null}
            className="px-5 py-2 rounded-lg bg-slate-600 text-white text-sm hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Check Answer
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-slate-600 text-white text-sm hover:bg-slate-700 transition-colors"
          >
            {current + 1 >= questions.length ? 'See Results' : 'Next Question'}
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

function FeedbackModule({
  score,
  total,
  mastered,
  onRetry,
  onContinue,
}: {
  score: number;
  total: number;
  mastered: boolean;
  onRetry: () => void;
  onContinue: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 space-y-3 text-center">
      <div
        className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center ${
          mastered ? 'bg-slate-100' : 'bg-slate-100'
        }`}
      >
        {mastered ? (
          <CheckCircle className="w-8 h-8 text-slate-600" />
        ) : (
          <XCircle className="w-8 h-8 text-slate-600" />
        )}
      </div>

      <div>
        <h3 className="text-xl font-bold text-slate-800">
          {mastered ? 'Topic Mastered!' : 'Keep Practising'}
        </h3>
        <p className="text-slate-500 text-sm mt-1">
          You scored {score} out of {total}
        </p>
      </div>

      {mastered ? (
        <p className="text-sm text-slate-600">
          Great work! You understand how market, command, and mixed economic systems work and how
          South Africa fits in.
        </p>
      ) : (
        <p className="text-sm text-slate-600">
          Review the interactive steps and guided example, then try the quiz again.
        </p>
      )}

      <div className="flex gap-3 justify-center">
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-slate-700 text-sm hover:bg-slate-50 transition-colors"
        >
          <RotateCcw className="w-4 h-4" /> Try Again
        </button>
        <button
          onClick={onContinue}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-600 text-white text-sm hover:bg-slate-700 transition-colors"
        >
          {mastered ? 'Next Topic' : 'Continue Anyway'}
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ── scratchpad ─────────────────────────────────────────────────────────────
function ScratchpadModal({
  topicId,
  onClose,
}: {
  topicId: string;
  onClose: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#1e1b4b');
  const [width, setWidth] = useState(3);
  const linesRef = useRef<{ points: { x: number; y: number }[]; color: string; width: number }[]>(
    [],
  );
  const undoRef = useRef<typeof linesRef.current[]>([]);
  const currentLineRef = useRef<{ x: number; y: number }[]>([]);
  const storageKey = STORAGE_KEY_PREFIX + topicId;

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const line of linesRef.current) {
      if (line.points.length < 2) continue;
      ctx.beginPath();
      ctx.strokeStyle = line.color;
      ctx.lineWidth = line.width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.moveTo(line.points[0].x, line.points[0].y);
      for (let i = 1; i < line.points.length; i++) ctx.lineTo(line.points[i].x, line.points[i].y);
      ctx.stroke();
    }
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) linesRef.current = JSON.parse(saved);
    } catch {}
    redraw();
  }, [redraw, storageKey]);

  function getPos(e: React.PointerEvent<HTMLCanvasElement>) {
    const rect = canvasRef.current!.getBoundingClientRect();
  }

  function onPointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    setIsDrawing(true);
    currentLineRef.current = [getPos(e)];
    (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!isDrawing) return;
    const pos = getPos(e);
    currentLineRef.current.push(pos);
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const pts = currentLineRef.current;
    if (pts.length < 2) return;
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.moveTo(pts[pts.length - 2].x, pts[pts.length - 2].y);
    ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
    ctx.stroke();
  }

  function onPointerUp() {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (currentLineRef.current.length > 1) {
      undoRef.current = [...undoRef.current, [...linesRef.current]].slice(-30);
      linesRef.current = [...linesRef.current, { points: currentLineRef.current, color, width }];
      try {
        localStorage.setItem(storageKey, JSON.stringify(linesRef.current));
      } catch {}
    }
    currentLineRef.current = [];
  }

  function undo() {
    if (!undoRef.current.length) return;
    linesRef.current = undoRef.current.pop()!;
    redraw();
    try {
      localStorage.setItem(storageKey, JSON.stringify(linesRef.current));
    } catch {}
  }

  function clear() {
    undoRef.current = [...undoRef.current, [...linesRef.current]].slice(-30);
    linesRef.current = [];
    redraw();
    try {
      localStorage.removeItem(storageKey);
    } catch {}
  }

  const colors = ['#1e1b4b', '#ef4444', '#3b82f6', '#22c55e', '#f59e0b', '#ffffff'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <PenLine className="w-4 h-4 text-slate-600" />
            <span className="font-semibold text-slate-800 text-sm">Scratchpad</span>
          </div>
          <div className="flex items-center gap-2">
            {colors.map(c => (
              <button
                key={c}
                onClick={() => setColor(c)}
                style={{ background: c }}
                className={`w-5 h-5 rounded-full border-2 transition-transform ${
                  color === c ? 'border-slate-500 scale-110' : 'border-slate-300'
                }`}
              />
            ))}
            <select
              value={width}
              onChange={e => setWidth(Number(e.target.value))}
              className="text-xs border border-slate-200 rounded px-1 py-0.5 ml-2"
            >
              {[2, 4, 6, 10].map(w => (
                <option key={w} value={w}>
                  {w}px
                </option>
              ))}
            </select>
            <button
              onClick={undo}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
              title="Undo"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              onClick={clear}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
              title="Clear"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        <canvas
          ref={canvasRef}
          width={640}
          height={400}
          className="w-full flex-1 cursor-crosshair bg-slate-50 rounded-b-2xl"
          style={{ touchAction: 'none' }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
        />
      </div>
    </div>
  );
}

// ── main page ──────────────────────────────────────────────────────────────
function EconomicSystemsPage({ onNavigate }: { onNavigate: (page: any) => void }) {
  const session = useStudySession();
  const [view, setView] = useState<ViewState>(ViewState.OVERVIEW);
  const [stepIndex, setStepIndex] = useState(0);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [quizScore, setQuizScore] = useState(0);
  const [mastered, setMastered] = useState(false);
  const [showScratchpad, setShowScratchpad] = useState(false);
  const [attempts, setAttempts] = useState(0);

  async function saveProgress(score: number, total: number) {
    if (!session) return;
    const masteryLevel: import('../../../../../../../lib/studyProgress').MasteryLevel =
      score >= Math.ceil(total * (2 / 3)) ? 'mastered' : 'needs_practice';
    await _saveProgress(session.student_id, session.school_id, SUBJECT, GRADE, TOPIC_ID, masteryLevel, score, total, attempts + 1);
  }

  function startQuiz(isRemediation: boolean) {
    const questions = isRemediation ? TOPIC.remediationQuestions : TOPIC.initialQuestions;
    setQuizQuestions(questions);
    setView(ViewState.QUIZ);
  }

  function handleQuizComplete(score: number) {
    const total = quizQuestions.length;
    const passed = score >= Math.ceil(total * (2 / 3));
    setQuizScore(score);
    setMastered(passed);
    setAttempts(a => a + 1);
    saveProgress(score, total);
    setView(ViewState.FEEDBACK);
  }

  function handleRetry() {
    const isRemediation = !mastered && attempts > 0;
    startQuiz(isRemediation);
  }

  return (

    <div className="min-h-screen" style={{ background: 'oklch(98.5% 0.005 80)' }}>

      {showScratchpad && (
        <ScratchpadModal topicId={TOPIC_ID} onClose={() => setShowScratchpad(false)} />
      )}

      <main className="max-w-2xl mx-auto px-4 pt-24 pb-16 space-y-6">
        {/* breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500">
          <button onClick={() => onNavigate('library')} className="hover:text-slate-600 transition-colors">
            Library
          </button>
          <ChevronRight className="w-4 h-4" />
          <span className="text-slate-800 font-medium">Economics · Grade 10 · Term 1</span>
        </nav>

        {/* header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-600 flex items-center justify-center flex-shrink-0">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{TOPIC.title}</h1>
              <p className="text-slate-500 text-sm mt-0.5">{TOPIC.description}</p>
            </div>
          </div>
          <button
            onClick={() => setShowScratchpad(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 text-slate-700 text-sm hover:bg-slate-50 transition-colors flex-shrink-0"
          >
            <PenLine className="w-4 h-4" /> Notes
          </button>
        </div>

        {/* overview */}
        {view === ViewState.OVERVIEW && (
          <div className="space-y-3">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 space-y-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-slate-600" />
                <h2 className="font-semibold text-slate-800">What You'll Learn</h2>
              </div>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                  The three fundamental economic questions every society must answer
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                  How market economies use the price mechanism and the "invisible hand"
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                  How command economies use central government planning
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                  South Africa as a mixed economy (private enterprise + SOEs + regulation)
                </li>
              </ul>
            </div>

            {/* topic list */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 space-y-3">
              <h2 className="font-semibold text-slate-800 text-sm">Term 1 Topics</h2>
              {[
                { label: 'The Economic Problem', page: 'learning-economics-g10-t1-problem' as AppPage },
                { label: 'Production Possibility Curve', page: 'learning-economics-g10-t1-ppc' as AppPage },
                { label: 'Economic Systems', page: null },
                { label: 'Circular Flow Model', page: 'learning-economics-g10-t1-circular-flow' as AppPage },
                { label: 'Factors of Production', page: 'learning-economics-g10-t1-factors' as AppPage },
              ].map((t, i) => (
                <div
                  key={i}
                  onClick={() => t.page && onNavigate(t.page)}
                  className={`flex items-center gap-3 p-3 rounded-xl text-sm transition-colors ${
                    t.page === null
                      ? 'bg-slate-50 border border-slate-200 cursor-default'
                      : 'hover:bg-slate-50 cursor-pointer border border-transparent'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      t.page === null
                        ? 'bg-slate-600 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className={t.page === null ? 'text-slate-800 font-medium' : 'text-slate-700'}>
                    {t.label}
                  </span>
                  {t.page !== null && <ChevronRight className="w-4 h-4 text-slate-400 ml-auto" />}
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                setStepIndex(0);
                setView(ViewState.INTERACTIVE);
              }}
              className="w-full py-3 rounded-xl bg-slate-600 text-white font-semibold hover:bg-slate-700 transition-colors"
            >
              Start Learning
            </button>
          </div>
        )}

        {/* interactive */}
        {view === ViewState.INTERACTIVE && (
          <InteractiveStep
            step={TOPIC.interactiveSteps[stepIndex]}
            index={stepIndex}
            total={TOPIC.interactiveSteps.length}
            onNext={() => {
              if (stepIndex + 1 < TOPIC.interactiveSteps.length) {
                setStepIndex(s => s + 1);
              } else {
                setView(ViewState.GUIDED);
              }
            }}
            onPrev={() => {
              if (stepIndex === 0) setView(ViewState.OVERVIEW);
              else setStepIndex(s => s - 1);
            }}
          />
        )}

        {/* guided */}
        {view === ViewState.GUIDED && (
          <GuidedExample onFinish={() => startQuiz(false)} />
        )}

        {/* quiz */}
        {view === ViewState.QUIZ && (
          <QuizModule questions={quizQuestions} onComplete={handleQuizComplete} />
        )}

        {/* feedback */}
        {view === ViewState.FEEDBACK && (
          <FeedbackModule
            score={quizScore}
            total={quizQuestions.length}
            mastered={mastered}
            onRetry={handleRetry}
            onContinue={() => onNavigate('learning-economics-g10-t1-circular-flow' as AppPage)}
          />
        )}

        {/* hard questions */}
        {view === ViewState.FEEDBACK && mastered && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-slate-600" />
              <h3 className="font-semibold text-slate-800 text-sm">Challenge Questions</h3>
            </div>
            <p className="text-xs text-slate-500">
              Test deeper understanding with these exam-style questions.
            </p>
            <button
              onClick={() => {
                setQuizQuestions(TOPIC.hardQuestions);
                setView(ViewState.QUIZ);
              }}
              className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-medium hover:bg-slate-50 transition-colors"
            >
              Try Challenge Questions
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default EconomicSystemsPage;
