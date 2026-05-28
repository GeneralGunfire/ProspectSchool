import { useState, useEffect, useRef, useCallback } from 'react'
import { useStudySession } from '../../../../../../../providers/StudySessionContext'
import { loadTopicProgress as _loadProgress, saveTopicProgress as _saveProgress } from '../../../../../../../lib/studyProgress';
import {
  BookOpen, ChevronRight, ChevronLeft, RotateCcw, CheckCircle,
  XCircle, Lightbulb, Award, PenLine, X, Undo2, Trash2,
  ArrowRightLeft,
} from 'lucide-react';

// ── constants ──────────────────────────────────────────────────────────────
const SUBJECT = 'Economics';
const GRADE = 10;
const TOPIC_ID = 'circular-flow-model';
const NEXT_TOPIC_ID = 'factors-of-production';
const STORAGE_KEY_PREFIX = 'scratchpad_econ-circular_';


const TOPIC = {
  title: 'Circular Flow Model',
  description: 'How money, goods, and services flow between households and firms in an economy.',
  interactiveSteps: [
    {
      label: 'Two Sectors: Households & Firms',
      tokens: ['Households', '⇄', 'Firms', '|', 'Two-sector', 'model'],
      explanation:
        'The simplest circular flow has two main actors. Households own the factors of production (land, labour, capital, entrepreneurship). Firms produce goods and services. They interact in two markets.',
    },
    {
      label: 'Factor Market (Resource Market)',
      tokens: ['Households', 'supply', 'factors', '→', 'Firms', 'pay', 'income'],
      explanation:
        'In the factor market, households supply labour, land, and capital to firms. In return, firms pay wages, rent, interest, and profit — together called factor income (or national income).',
    },
    {
      label: 'Product Market (Goods & Services Market)',
      tokens: ['Firms', 'supply', 'goods', '→', 'Households', 'pay', 'expenditure'],
      explanation:
        'In the product market, firms sell goods and services to households. Households use their income to buy these products. This spending is called household expenditure (or consumption).',
    },
    {
      label: 'Leakages and Injections',
      tokens: ['Savings', '+', 'Tax', '+', 'Imports', '=', 'Leakages', '|', 'Investment', '+', 'Government', '+', 'Exports', '=', 'Injections'],
      explanation:
        'Money leaves the circular flow as leakages (savings, tax, imports) and enters as injections (investment, government spending, exports). Equilibrium occurs when total leakages = total injections.',
    },
  ],
  guidedItem: {
    scenario:
      'Follow R100 spent by Thabo (a South African household) as it moves through the circular flow.',
    steps: [
      {
        title: 'Step 1 — Household earns income',
        description:
          'Thabo works at a Johannesburg manufacturing firm. He supplies his labour in the factor market. The firm pays him a wage of R20 000 per month. This is factor income flowing from firms → households.',
        insight: 'Factor market: households supply labour → receive wages (income).',
      },
      {
        title: 'Step 2 — Household spends in the product market',
        description:
          'Thabo spends R100 at Pick n Pay (a firm) buying bread and milk. This R100 flows from households → firms as household expenditure in the product market.',
        insight: 'Product market: households spend income → firms receive revenue.',
      },
      {
        title: 'Step 3 — Leakage and injection',
        description:
          'Pick n Pay saves some profit (leakage: savings) and pays VAT to the government (leakage: tax). The government uses tax revenue to build a school (injection: government spending), putting money back into the circular flow.',
        insight: 'Leakages reduce flow; injections restore it. Economy is in equilibrium when they balance.',
      },
    ],
  },
  initialQuestions: [
    {
      question: 'In the circular flow model, the factor market is where:',
      options: [
        'Firms sell goods and services to households',
        'Households supply labour and other factors to firms',
        'The government collects taxes from households',
        'Banks provide loans to firms',
      ],
      answer: 1,
      explanation:
        'The factor (resource) market is where households supply the factors of production (labour, land, capital) to firms, and receive income (wages, rent, interest, profit) in return.',
    },
    {
      question: 'Which of the following is a LEAKAGE from the circular flow?',
      options: ['Government spending on roads', 'Export earnings from mining', 'Household savings in a bank', 'Business investment in new machinery'],
      answer: 2,
      explanation:
        'Savings are a leakage — money that leaves the circular flow. Government spending, exports, and investment are injections that put money back into the flow.',
    },
    {
      question: 'The circular flow is in equilibrium when:',
      options: [
        'Household income equals household expenditure exactly',
        'Total leakages equal total injections',
        'The government budget is balanced',
        'Imports equal exports',
      ],
      answer: 1,
      explanation:
        'Equilibrium in the circular flow requires that total leakages (savings + tax + imports) equal total injections (investment + government spending + exports). Individual components need not balance.',
    },
    {
      question: 'A South African company exports R500 million worth of platinum to Japan. In the circular flow, this represents:',
      options: ['A leakage, because money leaves South Africa', 'An injection, because foreign money enters the circular flow', 'A transfer payment with no effect on the flow', 'A factor payment to households'],
      answer: 1,
      explanation:
        'Exports bring foreign spending into the domestic circular flow — this is an injection. Conversely, imports are a leakage as South Africans spend money outside the domestic economy.',
    },
  ],
  remediationQuestions: [
    {
      question: 'Households receive wages, rent, and interest from firms. In the circular flow, this flow belongs to the:',
      options: ['Product market', 'Factor market', 'Money market', 'Capital market'],
      answer: 1,
      explanation:
        'Wages, rent, and interest are payments for factors of production (labour, land, capital). These flows occur in the factor (resource) market, not the product market.',
    },
    {
      question: 'If total injections into the circular flow are greater than total leakages, the economy will:',
      options: ['Contract — national income will fall', 'Stay the same — the model is always in equilibrium', 'Expand — national income will rise', 'Experience hyperinflation immediately'],
      answer: 2,
      explanation:
        'When injections > leakages, more money is being added to the circular flow than is being withdrawn. This causes the economy to expand — national income and output increase.',
    },
  ],
  hardQuestions: [
    {
      question: 'During a recession, the South African government increases its spending on infrastructure. Using the circular flow model, this policy:',
      options: [
        'Is a leakage that will shrink the circular flow further',
        'Is an injection that will stimulate national income and output',
        'Has no effect because government is not part of the two-sector model',
        'Will reduce household income by increasing taxes',
      ],
      answer: 1,
      explanation:
        'Government spending is an injection in the three-sector circular flow. During a recession, injections < leakages. Increasing government spending raises injections, stimulating the economy — this is Keynesian fiscal policy.',
    },
    {
      question: 'South Africa\'s household savings rate is very low. What is the most likely consequence for the circular flow?',
      options: [
        'Higher leakages, leading to economic contraction',
        'Lower leakages, meaning more money circulates — but less is available for business investment',
        'No effect, because savings do not enter the circular flow',
        'Higher injections, because savings fund government projects directly',
      ],
      answer: 1,
      explanation:
        'Low savings means fewer leakages from the product market, so more money circulates immediately. However, banks have less to lend to firms for investment — reducing a key injection. The net effect depends on whether the reduced investment injection outweighs the reduced savings leakage.',
    },
    {
      question: 'In the full five-sector circular flow (adding financial sector and foreign sector), which combination correctly pairs leakages with their corresponding injections?',
      options: [
        'Savings ↔ Taxation; Imports ↔ Government Spending; Tax ↔ Exports',
        'Savings ↔ Investment; Tax ↔ Government Spending; Imports ↔ Exports',
        'Savings ↔ Exports; Tax ↔ Investment; Imports ↔ Government Spending',
        'Savings ↔ Government Spending; Imports ↔ Investment; Tax ↔ Exports',
      ],
      answer: 1,
      explanation:
        'Savings are channelled back as investment (via financial institutions), tax is returned as government spending, and import payments are offset by export earnings. These three pairs form the leakage-injection framework of the complete circular flow.',
    },
    {
      question: 'A sudden depreciation of the rand makes South African exports cheaper and imports more expensive. What is the MOST LIKELY effect on the circular flow?',
      options: [
        'Leakages increase and injections decrease — economy contracts',
        'Leakages decrease (fewer imports) and injections increase (more exports) — economy expands',
        'No effect because exchange rates only affect the financial sector',
        'Households earn higher wages because firms export more',
      ],
      answer: 1,
      explanation:
        'A weaker rand raises the cost of imports (reducing import leakage) and makes exports more competitive (increasing the export injection). Both effects push toward expansion — though the timing depends on the Marshall-Lerner condition and supply capacity.',
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
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-slate-600 flex items-center justify-center">
          <ArrowRightLeft className="w-4 h-4 text-white" />
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
              token === '|' || token === '=' || token === '+' || token === '⇄' || token === '→'
                ? 'text-slate-400 font-bold text-lg px-1'
                : ['Households', 'Firms'].includes(token)
                  ? 'bg-slate-600 text-white px-2 py-1 rounded-lg font-bold text-sm'
                  : ['Savings', 'Tax', 'Imports', 'Investment', 'Government', 'Exports'].includes(token)
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
          <h3 className="font-semibold text-slate-800">Following R100 Through the Economy</h3>
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
            <p className="font-semibold text-slate-800 text-sm mb-1">{s.title}</p>
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
            <button key={i} className={cls} onClick={() => !revealed && setSelected(i)}>
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
          Excellent! You understand how households and firms interact, and how leakages and injections affect national income.
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
          Next Topic <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ── scratchpad ─────────────────────────────────────────────────────────────
function ScratchpadModal({ topicId, onClose }: { topicId: string; onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#1e1b4b');
  const [width, setWidth] = useState(3);
  const linesRef = useRef<{ points: { x: number; y: number }[]; color: string; width: number }[]>([]);
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
      try { localStorage.setItem(storageKey, JSON.stringify(linesRef.current)); } catch {}
    }
    currentLineRef.current = [];
  }

  function undo() {
    if (!undoRef.current.length) return;
    linesRef.current = undoRef.current.pop()!;
    redraw();
    try { localStorage.setItem(storageKey, JSON.stringify(linesRef.current)); } catch {}
  }

  function clear() {
    undoRef.current = [...undoRef.current, [...linesRef.current]].slice(-30);
    linesRef.current = [];
    redraw();
    try { localStorage.removeItem(storageKey); } catch {}
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
                <option key={w} value={w}>{w}px</option>
              ))}
            </select>
            <button onClick={undo} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors" title="Undo">
              <Undo2 className="w-4 h-4" />
            </button>
            <button onClick={clear} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors" title="Clear">
              <Trash2 className="w-4 h-4" />
            </button>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors">
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
function CircularFlowModelPage({ onNavigate }: { onNavigate: (page: any) => void }) {
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
    const ml: import('../../../../../../../lib/studyProgress').MasteryLevel =
      score >= Math.ceil(total * (2 / 3)) ? 'mastered' : 'needs_practice';
    await _saveProgress(session.student_id, session.school_id, SUBJECT, GRADE, TOPIC_ID, ml, score, total, attempts + 1);
  }

  function startQuiz(isRemediation: boolean) {
    setQuizQuestions(isRemediation ? TOPIC.remediationQuestions : TOPIC.initialQuestions);
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

  return (

    <div className="min-h-screen" style={{ background: 'oklch(98.5% 0.005 80)' }}>

      {showScratchpad && (
        <ScratchpadModal topicId={TOPIC_ID} onClose={() => setShowScratchpad(false)} />
      )}

      <main className="max-w-2xl mx-auto px-4 pt-24 pb-16 space-y-6">
        <nav className="flex items-center gap-2 text-sm text-slate-500">
          <button onClick={() => onNavigate('library')} className="hover:text-slate-600 transition-colors">
            Library
          </button>
          <ChevronRight className="w-4 h-4" />
          <span className="text-slate-800 font-medium">Economics · Grade 10 · Term 1</span>
        </nav>

        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-600 flex items-center justify-center flex-shrink-0">
              <ArrowRightLeft className="w-6 h-6 text-white" />
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
                  The two main actors in the economy: households and firms
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                  How the factor market and product market work
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                  Leakages (savings, tax, imports) and injections (investment, government, exports)
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                  What happens when leakages ≠ injections
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 space-y-3">
              <h2 className="font-semibold text-slate-800 text-sm">Term 1 Topics</h2>
              {[
                { label: 'The Economic Problem', page: 'learning-economics-g10-t1-problem' as AppPage },
                { label: 'Production Possibility Curve', page: 'learning-economics-g10-t1-ppc' as AppPage },
                { label: 'Economic Systems', page: 'learning-economics-g10-t1-systems' as AppPage },
                { label: 'Circular Flow Model', page: null },
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
                      t.page === null ? 'bg-slate-600 text-white' : 'bg-slate-100 text-slate-600'
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
              onClick={() => { setStepIndex(0); setView(ViewState.INTERACTIVE); }}
              className="w-full py-3 rounded-xl bg-slate-600 text-white font-semibold hover:bg-slate-700 transition-colors"
            >
              Start Learning
            </button>
          </div>
        )}

        {view === ViewState.INTERACTIVE && (
          <InteractiveStep
            step={TOPIC.interactiveSteps[stepIndex]}
            index={stepIndex}
            total={TOPIC.interactiveSteps.length}
            onNext={() => {
              if (stepIndex + 1 < TOPIC.interactiveSteps.length) setStepIndex(s => s + 1);
              else setView(ViewState.GUIDED);
            }}
            onPrev={() => {
              if (stepIndex === 0) setView(ViewState.OVERVIEW);
              else setStepIndex(s => s - 1);
            }}
          />
        )}

        {view === ViewState.GUIDED && (
          <GuidedExample onFinish={() => startQuiz(false)} />
        )}

        {view === ViewState.QUIZ && (
          <QuizModule questions={quizQuestions} onComplete={handleQuizComplete} />
        )}

        {view === ViewState.FEEDBACK && (
          <FeedbackModule
            score={quizScore}
            total={quizQuestions.length}
            mastered={mastered}
            onRetry={() => startQuiz(!mastered && attempts > 0)}
            onContinue={() => onNavigate('learning-economics-g10-t1-factors' as AppPage)}
          />
        )}

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
              onClick={() => { setQuizQuestions(TOPIC.hardQuestions); setView(ViewState.QUIZ); }}
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

export default CircularFlowModelPage;
