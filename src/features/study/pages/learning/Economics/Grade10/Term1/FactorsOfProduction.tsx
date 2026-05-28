import { useState, useEffect, useRef, useCallback } from 'react'
import { useStudySession } from '../../../../../../../providers/StudySessionContext'
import { loadTopicProgress as _loadProgress, saveTopicProgress as _saveProgress } from '../../../../../../../lib/studyProgress';
import {
  BookOpen, ChevronRight, ChevronLeft, RotateCcw, CheckCircle,
  XCircle, Lightbulb, Award, PenLine, X, Undo2, Trash2,
  Layers,
} from 'lucide-react';

// ── constants ──────────────────────────────────────────────────────────────
const SUBJECT = 'Economics';
const GRADE = 10;
const TOPIC_ID = 'factors-of-production';
const STORAGE_KEY_PREFIX = 'scratchpad_econ-factors_';


const TOPIC = {
  title: 'Factors of Production',
  description: 'The four resources used to produce all goods and services: land, labour, capital, and entrepreneurship.',
  interactiveSteps: [
    {
      label: 'Land — Natural Resources',
      tokens: ['Land', '=', 'All', 'natural', 'resources', '|', 'Reward:', 'Rent'],
      explanation:
        'Land includes all natural resources: soil, minerals, water, sunlight, forests, and fish. South Africa is particularly rich in land resources — gold, platinum, coal, and agricultural land. The reward for land is RENT.',
    },
    {
      label: 'Labour — Human Effort',
      tokens: ['Labour', '=', 'Physical', '+', 'Mental', 'effort', '|', 'Reward:', 'Wages'],
      explanation:
        'Labour is the human effort (physical and mental) used in production. The quality of labour depends on education, skills, and health. The reward for labour is WAGES (or salaries). South Africa\'s unemployment rate highlights the importance of this factor.',
    },
    {
      label: 'Capital — Man-made Resources',
      tokens: ['Capital', '=', 'Man-made', 'production', 'tools', '|', 'Reward:', 'Interest'],
      explanation:
        'Capital is man-made resources used in production: machinery, factories, tools, technology, and infrastructure. NOT money — money is used to buy capital. The reward for capital is INTEREST (return on investment).',
    },
    {
      label: 'Entrepreneurship — Organiser & Risk-Taker',
      tokens: ['Entrepreneur', '=', 'Organises', '+', 'Takes', 'risk', '|', 'Reward:', 'Profit'],
      explanation:
        'The entrepreneur combines land, labour, and capital to produce goods and services. They bear the risk of loss. South African examples: Elon Musk, Patrice Motsepe, Koos Bekker. The reward is PROFIT (or loss).',
    },
  ],
  guidedItem: {
    scenario:
      'Nomsa starts a small bakery in Soweto. Identify each factor of production she uses.',
    steps: [
      {
        title: 'Land',
        description:
          'Nomsa uses flour (wheat grown on farmland), water, electricity (from coal-powered Eskom), and rents a small shop space in Soweto. All of these — the raw agricultural materials and the physical space — are forms of land (natural resources and location).',
        insight: 'Land: raw materials (wheat, water) + physical location. Nomsa pays rent for the shop.',
      },
      {
        title: 'Labour',
        description:
          'Nomsa employs two assistants who mix, bake, and serve. She also works herself (her mental effort in managing recipes, customer orders, and accounts is also labour). They all receive wages for their work.',
        insight: 'Labour: Nomsa + 2 employees. Both physical baking and mental management count.',
      },
      {
        title: 'Capital & Entrepreneurship',
        description:
          'Nomsa bought an oven, mixing bowls, a display case, and a till — these are capital goods (man-made production tools). She borrowed from a bank to buy them, paying interest. Nomsa herself is the entrepreneur: she organised all three factors, took the risk of borrowing money, and earns the profit (or absorbs any losses).',
        insight: 'Capital: oven, mixers, display case (rewarded with interest). Entrepreneurship: Nomsa as organiser and risk-taker (rewarded with profit).',
      },
    ],
  },
  initialQuestions: [
    {
      question: 'A farmer owns land, uses a tractor (capital), employs workers (labour), and runs the farm himself. What is the reward for his entrepreneurship?',
      options: ['Rent', 'Wages', 'Interest', 'Profit'],
      answer: 3,
      explanation:
        'The entrepreneur organises the other factors of production and bears the risk. Their reward is PROFIT (which could be a loss if the business fails). Rent = land, Wages = labour, Interest = capital.',
    },
    {
      question: 'Which of the following is an example of CAPITAL as a factor of production?',
      options: ['A coal deposit in Mpumalanga', 'A factory assembly line', 'A software engineer\'s coding skills', 'R1 million in a bank account'],
      answer: 1,
      explanation:
        'Capital is man-made resources used in production. A factory assembly line is a manufactured tool for production. Coal deposits are land (natural resources). Coding skills are labour. Money in a bank is financial capital — NOT a factor of production in economics.',
    },
    {
      question: 'South Africa\'s platinum mines extract platinum ore for global markets. Which factor of production does the platinum ore represent?',
      options: ['Capital', 'Entrepreneurship', 'Land', 'Labour'],
      answer: 2,
      explanation:
        'Platinum ore is a natural resource — it falls under LAND as a factor of production. Land includes all natural resources such as minerals, forests, water bodies, and soil.',
    },
    {
      question: 'The reward paid to the owners of capital is:',
      options: ['Wages', 'Rent', 'Profit', 'Interest'],
      answer: 3,
      explanation:
        'The four factor rewards are: Land → Rent; Labour → Wages; Capital → Interest; Entrepreneurship → Profit. Capital owners (investors, lenders) receive interest as compensation for using their capital in production.',
    },
  ],
  remediationQuestions: [
    {
      question: 'Which factor of production takes the risk of business failure?',
      options: ['Land', 'Labour', 'Capital', 'Entrepreneurship'],
      answer: 3,
      explanation:
        'The entrepreneur is the risk-taker. They organise land, labour, and capital, and bear the risk of loss if the business fails. In return, they receive profit.',
    },
    {
      question: 'A teacher\'s knowledge and classroom skills are best classified as which factor of production?',
      options: ['Capital', 'Land', 'Labour', 'Entrepreneurship'],
      answer: 2,
      explanation:
        'Human effort — both physical and mental — is LABOUR. A teacher\'s skills and knowledge are human capital embedded in labour. The reward is wages or a salary.',
    },
  ],
  hardQuestions: [
    {
      question: 'South Africa has an abundance of natural resources (land) but high unemployment (underutilised labour). What does this suggest about resource allocation?',
      options: [
        'The economy is operating outside the PPC — beyond its production frontier',
        'All four factors are being fully employed at the efficiency frontier',
        'The economy is operating inside the PPC — factors are underutilised',
        'Entrepreneurship is the binding constraint, not labour',
      ],
      answer: 2,
      explanation:
        'High unemployment means labour (a factor of production) is not being fully utilised. This places the economy inside the PPC — producing less than its potential. Connecting factors of production to PPC analysis is a key exam skill.',
    },
    {
      question: 'Technology replaces 10 000 factory workers with automated machines. In factor-of-production terms, this represents:',
      options: [
        'Land substituting for capital',
        'Capital substituting for labour',
        'Entrepreneurship replacing land',
        'Labour becoming more productive',
      ],
      answer: 1,
      explanation:
        'Automation (man-made machines = capital) replaces human workers (labour). This is capital substituting for labour — a key dynamic in the Fourth Industrial Revolution (4IR) affecting South Africa\'s labour market.',
    },
    {
      question: 'Elon Musk was born in South Africa. He used his intellect (labour) and personal savings (capital) to start companies that are now worth hundreds of billions. His role in these companies is BEST described as:',
      options: [
        'Pure labour — he worked hard to build the companies',
        'Pure capital — he invested his savings',
        'Entrepreneurship — he organised factors, innovated, and bore risk',
        'Land — he owned the intellectual property as a natural resource',
      ],
      answer: 2,
      explanation:
        'While Musk contributed labour and capital, his defining role is ENTREPRENEUR — he identified opportunities, organised the factors of production, innovated, and bore significant personal and financial risk. Entrepreneurs transform the other factors into valuable goods and services.',
    },
    {
      question: 'A new government policy subsidises TVET colleges to train artisans. In factor-of-production terms, this policy is designed to improve:',
      options: [
        'The quantity and quality of the land factor',
        'The quality (human capital) of the labour factor',
        'The stock of capital goods in the economy',
        'The entrepreneurship factor by reducing risk',
      ],
      answer: 1,
      explanation:
        'Training artisans improves the skill level (quality) of the labour factor — this is called investment in human capital. Better-trained workers are more productive, shifting the PPC outward over time. This is a key argument for education spending in Economics.',
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
          <Layers className="w-4 h-4 text-white" />
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
                : ['Land', 'Labour', 'Capital', 'Entrepreneur'].includes(token)
                  ? 'bg-slate-600 text-white px-2 py-1 rounded-lg font-bold text-sm'
                  : ['Rent', 'Wages', 'Interest', 'Profit'].includes(token)
                    ? 'bg-slate-100 text-slate-800 px-2 py-1 rounded-lg font-semibold text-sm border border-slate-200'
                    : token === 'Reward:'
                      ? 'text-slate-500 text-sm px-1 font-medium'
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
          <h3 className="font-semibold text-slate-800">Nomsa's Bakery</h3>
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
      onComplete(score + (selected === q.answer ? 1 : 0));
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
          let cls = 'w-full text-left px-3 py-2 rounded-xl border text-xs transition-all cursor-pointer ';
          if (!revealed) {
            cls += selected === i
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
        <p className="text-slate-500 text-sm mt-1">You scored {score} out of {total}</p>
      </div>

      {mastered ? (
        <p className="text-sm text-slate-600">
          Excellent! You can confidently identify and classify land, labour, capital, and entrepreneurship — and match each factor to its reward.
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
          Back to Library <ChevronRight className="w-4 h-4" />
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
function FactorsOfProductionPage({ onNavigate }: { onNavigate: (page: any) => void }) {
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
              <Layers className="w-6 h-6 text-white" />
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
                  The four factors of production: land, labour, capital, entrepreneurship
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                  The reward (factor income) for each factor
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                  Real-world South African examples for each factor
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                  How to classify resources and factor rewards in exam scenarios
                </li>
              </ul>
            </div>

            {/* Topic list */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 space-y-3">
              <h2 className="font-semibold text-slate-800 text-sm">Term 1 Topics</h2>
              {[
                { label: 'The Economic Problem', page: 'learning-economics-g10-t1-problem' as AppPage },
                { label: 'Production Possibility Curve', page: 'learning-economics-g10-t1-ppc' as AppPage },
                { label: 'Economic Systems', page: 'learning-economics-g10-t1-systems' as AppPage },
                { label: 'Circular Flow Model', page: 'learning-economics-g10-t1-circular-flow' as AppPage },
                { label: 'Factors of Production', page: null },
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
            onContinue={() => { sessionStorage.setItem('library_return', JSON.stringify({ subjectId: 'economics', grade: 10, term: 1 })); onNavigate('library'); }}
          />
        )}

        {/* All Term 1 Topics Complete card */}
        {view === ViewState.FEEDBACK && mastered && (
          <>
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-slate-600 mx-auto flex items-center justify-center">
                <Award className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">All Term 1 Topics Complete!</h3>
              <p className="text-slate-700 text-sm">
                You've mastered all 5 Grade 10 Economics Term 1 topics. Well done!
              </p>
              <button
                onClick={() => onNavigate('library' as AppPage)}
                className="mt-2 px-6 py-2.5 rounded-xl bg-slate-600 text-white text-xs font-semibold hover:bg-slate-700 transition-colors"
              >
                Back to Library
              </button>
            </div>

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
          </>
        )}
      </main>
    </div>
  );
}

export default FactorsOfProductionPage;
