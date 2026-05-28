import { useState, useEffect, useRef, useCallback } from 'react'
import { useStudySession } from '../../../../../../../providers/StudySessionContext'
import { loadTopicProgress as _loadProgress, saveTopicProgress as _saveProgress } from '../../../../../../../lib/studyProgress';
import {
  BookOpen, ChevronRight, ChevronLeft, RotateCcw, CheckCircle,
  XCircle, Lightbulb, Award, PenLine, X, Undo2, Trash2,
  Monitor,
} from 'lucide-react';

// ── constants ──────────────────────────────────────────────────────────────
const SUBJECT = 'CAT';
const GRADE = 10;
const TOPIC_ID = 'computer-systems';
const NEXT_TOPIC_ID = 'file-management';
const STORAGE_KEY_PREFIX = 'scratchpad_cat-systems_';


const TOPIC = {
  title: 'Computer Systems',
  description: 'Hardware, software, and how the components of a computer work together.',
  interactiveSteps: [
    {
      label: 'Hardware vs Software',
      tokens: ['Hardware', '=', 'Physical', 'components', '|', 'Software', '=', 'Programs', '&', 'data'],
      explanation:
        'Hardware is anything you can physically touch: the monitor, keyboard, CPU, RAM, hard drive. Software is the instructions that tell hardware what to do — the operating system, applications, and data files.',
    },
    {
      label: 'The CPU — Brain of the Computer',
      tokens: ['CPU', '=', 'Fetch', '+', 'Decode', '+', 'Execute', '|', 'Speed:', 'GHz'],
      explanation:
        'The Central Processing Unit (CPU) processes all instructions. It fetches an instruction from memory, decodes it, then executes it — called the fetch-decode-execute cycle. Speed is measured in GHz (gigahertz). More cores = more tasks handled simultaneously.',
    },
    {
      label: 'Memory: RAM vs ROM vs Storage',
      tokens: ['RAM', '(volatile)', '|', 'ROM', '(permanent)', '|', 'Storage', '(HDD/SSD)'],
      explanation:
        'RAM (Random Access Memory) is temporary — it loses data when power is off. ROM (Read-Only Memory) stores permanent firmware. Storage (HDD or SSD) keeps data permanently. RAM is fast but small; storage is large but slower.',
    },
    {
      label: 'Input, Processing, Output, Storage',
      tokens: ['Input', '→', 'Processing', '→', 'Output', '→', 'Storage'],
      explanation:
        'The IPO model: Input devices (keyboard, mouse, scanner) send data to the CPU for Processing, which produces Output (monitor, printer, speaker). Results can be saved to Storage for later use.',
    },
  ],
  guidedItem: {
    scenario:
      'Thabo types an essay in Microsoft Word on his school laptop. Identify each computer system component involved.',
    steps: [
      {
        title: 'Input',
        description:
          'Thabo uses the keyboard (input device) to type his essay. Each keystroke sends an electrical signal to the CPU for processing. The mouse is also an input device he uses to click menus.',
        insight: 'Keyboard and mouse are input devices — they send data into the system.',
      },
      {
        title: 'Processing & Memory',
        description:
          'The CPU processes each character typed. Microsoft Word (software) runs in RAM — the essay is held in RAM while Thabo works. The CPU\'s speed (e.g. 2.4GHz dual-core) determines how fast Word responds.',
        insight: 'CPU processes instructions; RAM temporarily stores the open document.',
      },
      {
        title: 'Output & Storage',
        description:
          'The monitor (output device) displays the essay as Thabo types. When he presses Ctrl+S, the file is saved from RAM to the SSD (permanent storage). If he prints, the printer is another output device.',
        insight: 'Monitor = output. SSD = permanent storage. Saving moves data from RAM to storage.',
      },
    ],
  },
  initialQuestions: [
    {
      question: 'Which component is known as the "brain" of the computer?',
      options: ['RAM', 'Hard Drive', 'CPU', 'Monitor'],
      answer: 2,
      explanation:
        'The CPU (Central Processing Unit) processes all instructions and controls the other components. It performs the fetch-decode-execute cycle for every operation the computer carries out.',
    },
    {
      question: 'What happens to data stored in RAM when the computer is switched off?',
      options: [
        'It is saved automatically to the hard drive',
        'It is lost because RAM is volatile',
        'It moves to ROM for safekeeping',
        'It stays in RAM until manually deleted',
      ],
      answer: 1,
      explanation:
        'RAM is volatile memory — it requires constant power to hold data. When the computer is switched off, all unsaved data in RAM is lost. This is why saving your work to storage is important.',
    },
    {
      question: 'A student scans a printed photo into a computer. The scanner is an example of:',
      options: ['Output device', 'Storage device', 'Processing unit', 'Input device'],
      answer: 3,
      explanation:
        'A scanner converts a physical image into digital data and sends it into the computer — making it an input device. Input devices bring data INTO the system.',
    },
    {
      question: 'Which storage device has no moving parts and is faster than a traditional hard drive?',
      options: ['HDD (Hard Disk Drive)', 'DVD-ROM', 'SSD (Solid State Drive)', 'USB flash drive'],
      answer: 2,
      explanation:
        'An SSD (Solid State Drive) uses flash memory chips with no moving parts, making it significantly faster and more durable than an HDD. Most modern laptops use SSDs.',
    },
  ],
  remediationQuestions: [
    {
      question: 'Which of the following is hardware?',
      options: ['Microsoft Word', 'Windows 11', 'The keyboard', 'An MP3 file'],
      answer: 2,
      explanation:
        'Hardware is any physical component you can touch. The keyboard is a physical input device. Microsoft Word, Windows 11, and MP3 files are all software (programs or data).',
    },
    {
      question: 'In the IPO model, what does "O" stand for?',
      options: ['Operation', 'Output', 'Online', 'Organisation'],
      answer: 1,
      explanation:
        'IPO stands for Input → Processing → Output. Output is the result produced by the computer after processing — displayed on a monitor, printed, or played through speakers.',
    },
  ],
  hardQuestions: [
    {
      question: 'A computer has a 2.4GHz quad-core CPU and 8GB RAM. Which upgrade would most improve performance when running many applications simultaneously?',
      options: [
        'Upgrade to a faster SSD',
        'Increase RAM to 16GB',
        'Add a second monitor',
        'Install a better graphics card',
      ],
      answer: 1,
      explanation:
        'When running many applications simultaneously, RAM is the bottleneck — each open application uses RAM. Doubling RAM from 8GB to 16GB allows more applications to run without the system slowing down. The SSD helps with load times, not simultaneous multitasking.',
    },
    {
      question: 'ROM stores the BIOS firmware on a computer. This means the BIOS:',
      options: [
        'Is deleted when the computer shuts down',
        'Can be easily modified by any user',
        'Persists even without power and runs before the OS loads',
        'Is stored on the hard drive alongside the operating system',
      ],
      answer: 2,
      explanation:
        'ROM is non-volatile — it retains data without power. The BIOS (Basic Input/Output System) is stored in ROM so it can run immediately when the computer is powered on, before the operating system loads from storage.',
    },
    {
      question: 'A school has 30 computers all connected to one printer. When one learner prints, others must wait. This is an example of:',
      options: [
        'A hardware fault in the CPU',
        'A shared output device on a network causing a print queue',
        'Insufficient RAM on the learner\'s computer',
        'A software virus blocking the printer',
      ],
      answer: 1,
      explanation:
        'A shared network printer creates a print queue — jobs are processed one at a time in order received. This is normal network printing behaviour, not a fault. It illustrates how output devices can be shared across a network.',
    },
    {
      question: 'Which statement best explains why SSDs are preferred over HDDs in modern laptops?',
      options: [
        'SSDs store more data than HDDs',
        'SSDs are cheaper than HDDs',
        'SSDs are faster, more durable, and use less power due to no moving parts',
        'SSDs work without electricity unlike HDDs',
      ],
      answer: 2,
      explanation:
        'SSDs use flash memory (no moving parts), making them faster at reading/writing data, more resistant to physical shock, and more power-efficient — important for battery life in laptops. HDDs are still used where large, cheap storage is needed.',
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
  step, index, total, onNext, onPrev,
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
          <Monitor className="w-4 h-4 text-white" />
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
              ['|', '=', '+', '→', '&', ':'].includes(token)
                ? 'text-slate-400 font-bold text-lg px-1'
                : ['CPU', 'RAM', 'ROM', 'Hardware', 'Software', 'Input', 'Output', 'Processing', 'Storage'].includes(token)
                  ? 'bg-slate-600 text-white px-2 py-1 rounded-lg font-bold text-sm'
                  : ['Fetch', 'Decode', 'Execute', 'GHz', 'HDD/SSD', 'Programs'].includes(token)
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
          <h3 className="font-semibold text-slate-800">Thabo's Essay</h3>
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
              i === step ? 'border-slate-300 bg-slate-50' : 'border-slate-100 bg-slate-50 opacity-70'
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
          onClick={() => step < steps.length - 1 ? setStep(s => s + 1) : onFinish()}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-600 text-white text-sm hover:bg-slate-700 transition-colors ml-auto"
        >
          {step < steps.length - 1 ? 'Next Step' : 'Start Quiz'}
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function QuizModule({ questions, onComplete }: { questions: QuizQuestion[]; onComplete: (score: number) => void }) {
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

function FeedbackModule({ score, total, mastered, onRetry, onContinue }: {
  score: number; total: number; mastered: boolean; onRetry: () => void; onContinue: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 space-y-3 text-center">
      <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center ${mastered ? 'bg-slate-100' : 'bg-slate-100'}`}>
        {mastered ? <CheckCircle className="w-8 h-8 text-slate-600" /> : <XCircle className="w-8 h-8 text-slate-600" />}
      </div>
      <div>
        <h3 className="text-xl font-bold text-slate-800">{mastered ? 'Topic Mastered!' : 'Keep Practising'}</h3>
        <p className="text-slate-500 text-sm mt-1">You scored {score} out of {total}</p>
      </div>
      {mastered ? (
        <p className="text-sm text-slate-600">Great work! You understand hardware, software, and how computer components work together.</p>
      ) : (
        <p className="text-sm text-slate-600">Review the interactive steps and guided example, then try again.</p>
      )}
      <div className="flex gap-3 justify-center">
        <button onClick={onRetry} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-slate-700 text-sm hover:bg-slate-50 transition-colors">
          <RotateCcw className="w-4 h-4" /> Try Again
        </button>
        <button onClick={onContinue} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-600 text-white text-sm hover:bg-slate-700 transition-colors">
          Next Topic <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function ScratchpadModal({ topicId, onClose }: { topicId: string; onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#1e3a5f');
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
    try { const saved = localStorage.getItem(storageKey); if (saved) linesRef.current = JSON.parse(saved); } catch {}
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
    const ctx = canvasRef.current!.getContext('2d')!;
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

  const colors = ['#1e3a5f', '#ef4444', '#3b82f6', '#22c55e', '#f59e0b', '#ffffff'];

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
              <button key={c} onClick={() => setColor(c)} style={{ background: c }}
                className={`w-5 h-5 rounded-full border-2 transition-transform ${color === c ? 'border-slate-500 scale-110' : 'border-slate-300'}`} />
            ))}
            <select value={width} onChange={e => setWidth(Number(e.target.value))}
              className="text-xs border border-slate-200 rounded px-1 py-0.5 ml-2">
              {[2, 4, 6, 10].map(w => <option key={w} value={w}>{w}px</option>)}
            </select>
            <button onClick={undo} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"><Undo2 className="w-4 h-4" /></button>
            <button onClick={clear} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"><X className="w-4 h-4" /></button>
          </div>
        </div>
        <canvas ref={canvasRef} width={640} height={400}
          className="w-full flex-1 cursor-crosshair bg-slate-50 rounded-b-2xl"
          style={{ touchAction: 'none' }}
          onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} />
      </div>
    </div>
  );
}

// ── main page ──────────────────────────────────────────────────────────────
function ComputerSystemsPage({ onNavigate }: { onNavigate: (page: any) => void }) {
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
      {showScratchpad && <ScratchpadModal topicId={TOPIC_ID} onClose={() => setShowScratchpad(false)} />}

      <main className="max-w-2xl mx-auto px-4 pt-24 pb-16 space-y-6">
        <nav className="flex items-center gap-2 text-sm text-slate-500">
          <button onClick={() => onNavigate('library')} className="hover:text-slate-600 transition-colors">Library</button>
          <ChevronRight className="w-4 h-4" />
          <span className="text-slate-800 font-medium">CAT · Grade 10 · Term 1</span>
        </nav>

        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-600 flex items-center justify-center flex-shrink-0">
              <Monitor className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{TOPIC.title}</h1>
              <p className="text-slate-500 text-sm mt-0.5">{TOPIC.description}</p>
            </div>
          </div>
          <button onClick={() => setShowScratchpad(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 text-slate-700 text-sm hover:bg-slate-50 transition-colors flex-shrink-0">
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
                {[
                  'The difference between hardware and software',
                  'How the CPU processes instructions (fetch-decode-execute)',
                  'RAM vs ROM vs storage and when each is used',
                  'The Input → Processing → Output → Storage model',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 space-y-3">
              <h2 className="font-semibold text-slate-800 text-sm">Term 1 Topics</h2>
              {[
                { label: 'Computer Systems', page: null },
                { label: 'File Management', page: 'learning-cat-g10-t1-file-management' as AppPage },
                { label: 'Word Processing', page: 'learning-cat-g10-t1-word-processing' as AppPage },
                { label: 'Spreadsheets', page: 'learning-cat-g10-t1-spreadsheets' as AppPage },
              ].map((t, i) => (
                <div
                  key={i}
                  onClick={() => t.page && onNavigate(t.page)}
                  className={`flex items-center gap-3 p-3 rounded-xl text-sm transition-colors ${
                    t.page === null ? 'bg-slate-50 border border-slate-200 cursor-default' : 'hover:bg-slate-50 cursor-pointer border border-transparent'
                  }`}
                >
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${t.page === null ? 'bg-slate-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    {i + 1}
                  </span>
                  <span className={t.page === null ? 'text-slate-800 font-medium' : 'text-slate-700'}>{t.label}</span>
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
            onNext={() => stepIndex + 1 < TOPIC.interactiveSteps.length ? setStepIndex(s => s + 1) : setView(ViewState.GUIDED)}
            onPrev={() => stepIndex === 0 ? setView(ViewState.OVERVIEW) : setStepIndex(s => s - 1)}
          />
        )}

        {view === ViewState.GUIDED && <GuidedExample onFinish={() => startQuiz(false)} />}
        {view === ViewState.QUIZ && <QuizModule questions={quizQuestions} onComplete={handleQuizComplete} />}

        {view === ViewState.FEEDBACK && (
          <FeedbackModule
            score={quizScore}
            total={quizQuestions.length}
            mastered={mastered}
            onRetry={() => startQuiz(!mastered && attempts > 0)}
            onContinue={() => onNavigate(`learning-cat-g10-t1-${NEXT_TOPIC_ID}` as AppPage)}
          />
        )}

        {view === ViewState.FEEDBACK && mastered && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-slate-600" />
              <h3 className="font-semibold text-slate-800 text-sm">Challenge Questions</h3>
            </div>
            <p className="text-xs text-slate-500">Test deeper understanding with exam-style questions.</p>
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

export default ComputerSystemsPage;
