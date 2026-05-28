import { useState, useEffect, useRef, useCallback } from 'react'
import { useStudySession } from '../../../../../../../providers/StudySessionContext'
import { loadTopicProgress as _loadProgress, saveTopicProgress as _saveProgress } from '../../../../../../../lib/studyProgress';
import {
  BookOpen, ChevronRight, ChevronLeft, RotateCcw, CheckCircle,
  XCircle, Lightbulb, Award, PenLine, X, Undo2, Trash2,
  Ruler,
} from 'lucide-react';

const SUBJECT = 'EGD';
const GRADE = 10;
const TOPIC_ID = 'drawing-instruments';
const NEXT_TOPIC_ID = 'lines-and-lettering';
const STORAGE_KEY_PREFIX = 'scratchpad_egd-instruments_';


const TOPIC = {
  title: 'Drawing Instruments',
  description: 'The tools used in technical drawing and how to use them correctly.',
  interactiveSteps: [
    {
      label: 'Basic Instruments',
      tokens: ['Drawing', 'board', '|', 'T-square', '|', 'Set', 'squares', '(45°/60°)', '|', 'Compass', '|', 'Protractor'],
      explanation:
        'Core EGD instruments: The drawing board provides a flat surface. The T-square draws horizontal lines and guides set squares. Set squares draw angles (45°, 30°, 60°, 90°). The compass draws circles and arcs. The protractor measures angles.',
    },
    {
      label: 'Pencils and Line Quality',
      tokens: ['H', '(hard)', '|', '2H', '(construction)', '|', 'HB', '(general)', '|', 'B', '(soft/dark)'],
      explanation:
        'Pencil grades matter in EGD. H and 2H pencils are hard — used for light construction lines. HB is medium — used for general work. B pencils are soft — used for dark, visible outlines. Lines must be consistent in width and darkness.',
    },
    {
      label: 'Scales and Measurement',
      tokens: ['Scale', '1:1', '(full)', '|', '1:2', '(half)', '|', '2:1', '(double)', '|', 'Scale', 'rule'],
      explanation:
        'Drawings are made to scale when the object is too large or small to draw full size. 1:1 = actual size. 1:2 = half size (object is twice as big as drawing). 2:1 = double size (drawing is twice as big as object). Always state the scale on your drawing.',
    },
    {
      label: 'Care of Instruments',
      tokens: ['Clean', 'after', 'use', '|', 'Store', 'flat', '|', 'Sharpen', 'pencils', 'correctly', '|', 'Never', 'drop', 'compass'],
      explanation:
        'Instrument care is examinable. Always clean instruments after use. Store the drawing board flat. Sharpen pencils to a fine point (not rounded). Never drop the compass — the needle point bends easily. Keep the T-square edge straight and unscratched.',
    },
  ],
  guidedItem: {
    scenario: 'Thabo must draw a horizontal line, a 45° line, and a circle with radius 30mm. Which instruments does he use for each?',
    steps: [
      {
        title: 'Drawing the horizontal line',
        description:
          'Thabo places the T-square head flush against the left edge of the drawing board. He slides it to the correct position and draws along the top edge of the T-square blade using a 2H pencil for a light, accurate line.',
        insight: 'T-square + drawing board edge = accurate horizontal lines. Use 2H for construction lines.',
      },
      {
        title: 'Drawing the 45° line',
        description:
          'Thabo places the 45° set square on top of the T-square (which keeps it stable). He draws along the hypotenuse of the set square to create a precise 45° angle. The T-square acts as the base guide.',
        insight: '45° set square resting on T-square = accurate 45° lines. Never freehand angles in EGD.',
      },
      {
        title: 'Drawing the circle',
        description:
          'Thabo sets his compass to exactly 30mm using the scale rule. He places the needle point at the centre mark and rotates the compass smoothly to draw the circle. He uses a sharp H pencil in the compass for a clean arc.',
        insight: 'Compass set to 30mm radius. Needle at centre. Rotate in one smooth motion. H pencil insert.',
      },
    ],
  },
  initialQuestions: [
    {
      question: 'Which instrument is used to draw horizontal lines on a drawing board?',
      options: ['Compass', 'Protractor', 'T-square', '45° set square'],
      answer: 2,
      explanation: 'The T-square is used to draw horizontal lines. Its head slides along the edge of the drawing board, keeping the blade perfectly horizontal. Set squares are placed on top of the T-square for angled lines.',
    },
    {
      question: 'A drawing is made at scale 1:2. What does this mean?',
      options: [
        'The drawing is twice as big as the real object',
        'The drawing is half the size of the real object',
        'The drawing is the same size as the real object',
        'The object is half the size of the drawing',
      ],
      answer: 1,
      explanation: '1:2 means 1 unit on the drawing equals 2 units on the real object — so the drawing is half size. Remember: drawing measurement : real object measurement.',
    },
    {
      question: 'Which pencil grade is BEST for drawing light construction lines in EGD?',
      options: ['B', 'HB', '2H', '4B'],
      answer: 2,
      explanation: '2H is a hard pencil that produces light, thin lines — ideal for construction lines that may need to be erased or are not part of the final outline. Softer pencils (B, HB) produce darker lines used for final outlines.',
    },
    {
      question: 'Which instrument would you use to draw a 60° angle accurately?',
      options: ['T-square alone', 'Compass', '30°/60° set square on a T-square', 'Scale rule'],
      answer: 2,
      explanation: 'The 30°/60° set square placed on a T-square draws accurate 60° angles. The T-square provides the horizontal base, and the set square\'s 60° edge gives the exact angle. Never estimate angles freehand in technical drawing.',
    },
  ],
  remediationQuestions: [
    {
      question: 'What is the purpose of the T-square in technical drawing?',
      options: [
        'To measure and draw circles',
        'To provide a guide for drawing horizontal lines and supporting set squares',
        'To measure angles up to 360°',
        'To draw vertical lines only',
      ],
      answer: 1,
      explanation: 'The T-square draws horizontal lines by sliding its head along the drawing board edge. It also acts as a stable base for set squares, allowing accurate angled lines to be drawn.',
    },
    {
      question: 'A learner draws a circle with a compass. The pencil insert should be:',
      options: ['A soft B pencil for dark lines', 'A sharp H pencil for clean arcs', 'A felt-tip pen for visibility', 'A 4B pencil for emphasis'],
      answer: 1,
      explanation: 'A sharp H pencil in the compass produces clean, accurate arcs. Soft pencils smudge and make arcs too thick. The compass pencil must be sharpened to match the needle point length.',
    },
  ],
  hardQuestions: [
    {
      question: 'A machine part measures 450mm in real life. A drawing is made at scale 1:5. What length should be drawn on paper?',
      options: ['2250mm', '90mm', '45mm', '455mm'],
      answer: 1,
      explanation: 'Scale 1:5 means the drawing is 1/5 of the real size. 450mm ÷ 5 = 90mm. Always divide the real measurement by the scale factor for a reduction scale (1:n).',
    },
    {
      question: 'Which combination of set squares can produce a 75° angle?',
      options: [
        '45° set square alone',
        '30°/60° set square alone',
        '45° set square + 30°/60° set square combined (45° + 30°)',
        'T-square + protractor',
      ],
      answer: 2,
      explanation: '75° = 45° + 30°. By combining the 45° set square and the 30° angle of the 30°/60° set square, you can construct a 75° angle. This is a standard EGD technique for angles not directly on a single set square.',
    },
    {
      question: 'Why must the needle point and pencil lead of a compass be at the same length?',
      options: [
        'So the compass looks symmetrical',
        'So the circle radius is accurate — unequal lengths tilt the compass and distort the arc',
        'So the compass stores more easily',
        'It does not matter as long as the pencil is sharp',
      ],
      answer: 1,
      explanation: 'If the needle and pencil are unequal lengths, the compass tilts when rotating, making the arc elliptical instead of circular. Equal lengths keep the compass vertical, producing an accurate circle at the set radius.',
    },
    {
      question: 'A drawing at scale 2:1 shows a component 80mm long. What is the actual size of the component?',
      options: ['160mm', '40mm', '80mm', '20mm'],
      answer: 1,
      explanation: 'Scale 2:1 means the drawing is twice the real size. Real size = drawing measurement ÷ 2 = 80mm ÷ 2 = 40mm. For enlargement scales (n:1), divide the drawing measurement by n to get the real size.',
    },
  ],
};

enum ViewState { OVERVIEW = 'OVERVIEW', INTERACTIVE = 'INTERACTIVE', GUIDED = 'GUIDED', QUIZ = 'QUIZ', FEEDBACK = 'FEEDBACK' }
interface QuizQuestion { question: string; options: string[]; answer: number; explanation: string; }

function InteractiveStep({ step, index, total, onNext, onPrev }: { step: (typeof TOPIC.interactiveSteps)[0]; index: number; total: number; onNext: () => void; onPrev: () => void; }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-slate-600 flex items-center justify-center">
          <Ruler className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Step {index + 1} of {total}</p>
          <h3 className="font-semibold text-slate-800 text-sm">{step.label}</h3>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {step.tokens.map((token, i) => (
          <span key={i} className={
            token === '|' ? 'text-slate-400 font-bold text-base px-0.5'
            : ['Drawing', 'T-square', 'Compass', 'Protractor', 'Scale', 'H', 'HB', 'B', '2H', 'Clean', 'Store', 'Never'].includes(token)
              ? 'bg-slate-600 text-white px-2 py-1 rounded-lg font-bold text-xs'
              : ['board', 'squares', '(45°/60°)', '1:1', '1:2', '2:1', '(full)', '(half)', '(double)', 'rule', '(hard)', '(soft/dark)', '(general)', '(construction)'].includes(token)
                ? 'bg-slate-100 text-slate-800 px-2 py-1 rounded-lg font-semibold text-xs border border-slate-200'
                : 'bg-slate-100 text-slate-700 px-2 py-1 rounded-lg text-xs font-medium'
          }>{token}</span>
        ))}
      </div>
      <p className="text-xs leading-relaxed text-slate-600 bg-slate-50 rounded-xl p-3 border border-slate-100">{step.explanation}</p>
      <div className="flex gap-2">
        <button onClick={onPrev} disabled={index === 0} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-xs hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
          <ChevronLeft className="w-3 h-3" /> Previous
        </button>
        <button onClick={onNext} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-600 text-white text-xs hover:bg-slate-700 transition-colors ml-auto">
          {index === total - 1 ? 'Start Guided Example' : 'Next'} <ChevronRight className="w-3 h-3" />
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
        <div className="w-8 h-8 rounded-xl bg-slate-600 flex items-center justify-center"><Lightbulb className="w-4 h-4 text-white" /></div>
        <div>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Guided Example · Step {step + 1} of {steps.length}</p>
          <h3 className="font-semibold text-slate-800 text-sm">Thabo's Drawing Task</h3>
        </div>
      </div>
      <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
        <p className="text-xs text-slate-800 font-medium">{TOPIC.guidedItem.scenario}</p>
      </div>
      <div className="space-y-2">
        {steps.slice(0, step + 1).map((s, i) => (
          <div key={i} className={`rounded-xl p-3 border transition-all ${i === step ? 'border-slate-300 bg-slate-50' : 'border-slate-100 bg-slate-50 opacity-70'}`}>
            <p className="font-semibold text-slate-800 text-xs mb-1">{s.title}</p>
            <p className="text-slate-600 text-xs leading-relaxed">{s.description}</p>
            {i === step && (
              <div className="mt-2 flex items-start gap-2 bg-white rounded-lg p-2 border border-slate-200">
                <CheckCircle className="w-3 h-3 text-slate-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-slate-700 font-medium">{s.insight}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        {step > 0 && <button onClick={() => setStep(s => s - 1)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-xs hover:bg-slate-50 transition-colors"><ChevronLeft className="w-3 h-3" /> Back</button>}
        <button onClick={() => step < steps.length - 1 ? setStep(s => s + 1) : onFinish()} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-600 text-white text-xs hover:bg-slate-700 transition-colors ml-auto">
          {step < steps.length - 1 ? 'Next Step' : 'Start Quiz'} <ChevronRight className="w-3 h-3" />
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
  function handleReveal() { if (selected === null) return; setRevealed(true); if (selected === q.answer) setScore(s => s + 1); }
  function handleNext() { if (current + 1 >= questions.length) onComplete(score + (selected === q.answer ? 1 : 0)); else { setCurrent(c => c + 1); setSelected(null); setRevealed(false); } }
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Question {current + 1} of {questions.length}</p>
        <span className="text-xs text-slate-500">Score: {score}</span>
      </div>
      <p className="font-medium text-slate-800 text-sm leading-relaxed">{q.question}</p>
      <div className="space-y-1.5">
        {q.options.map((opt, i) => {
          let cls = 'w-full text-left px-3 py-2 rounded-xl border text-xs transition-all cursor-pointer ';
          if (!revealed) cls += selected === i ? 'border-slate-400 bg-slate-50 text-slate-800' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700';
          else if (i === q.answer) cls += 'border-slate-400 bg-slate-50 text-slate-800';
          else if (i === selected) cls += 'border-slate-400 bg-slate-50 text-slate-800';
          else cls += 'border-slate-200 text-slate-400';
        })}
      </div>
      {revealed && <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex gap-2"><Lightbulb className="w-3 h-3 text-slate-500 flex-shrink-0 mt-0.5" /><p className="text-xs text-slate-800">{q.explanation}</p></div>}
      <div className="flex gap-2 justify-end">
        {!revealed
          ? <button onClick={handleReveal} disabled={selected === null} className="px-4 py-1.5 rounded-lg bg-slate-600 text-white text-xs hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">Check Answer</button>
          : <button onClick={handleNext} className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-slate-600 text-white text-xs hover:bg-slate-700 transition-colors">{current + 1 >= questions.length ? 'See Results' : 'Next Question'} <ChevronRight className="w-3 h-3" /></button>}
      </div>
    </div>
  );
}

function FeedbackModule({ score, total, mastered, onRetry, onContinue }: { score: number; total: number; mastered: boolean; onRetry: () => void; onContinue: () => void; }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 space-y-3 text-center">
      <div className={`w-14 h-14 rounded-full mx-auto flex items-center justify-center ${mastered ? 'bg-slate-100' : 'bg-slate-100'}`}>
        {mastered ? <CheckCircle className="w-7 h-7 text-slate-600" /> : <XCircle className="w-7 h-7 text-slate-600" />}
      </div>
      <div>
        <h3 className="text-lg font-bold text-slate-800">{mastered ? 'Topic Mastered!' : 'Keep Practising'}</h3>
        <p className="text-slate-500 text-xs mt-1">You scored {score} out of {total}</p>
      </div>
      {mastered ? <p className="text-xs text-slate-600">Great work! You know your drawing instruments, pencil grades, and scales.</p>
        : <p className="text-xs text-slate-600">Review the interactive steps and guided example, then try again.</p>}
      <div className="flex gap-2 justify-center">
        <button onClick={onRetry} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 text-xs hover:bg-slate-50 transition-colors"><RotateCcw className="w-3 h-3" /> Try Again</button>
        <button onClick={onContinue} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-600 text-white text-xs hover:bg-slate-700 transition-colors">Next Topic <ChevronRight className="w-3 h-3" /></button>
      </div>
    </div>
  );
}

function ScratchpadModal({ topicId, onClose }: { topicId: string; onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#7c2d12');
  const [width, setWidth] = useState(3);
  const linesRef = useRef<{ points: { x: number; y: number }[]; color: string; width: number }[]>([]);
  const undoRef = useRef<typeof linesRef.current[]>([]);
  const currentLineRef = useRef<{ x: number; y: number }[]>([]);
  const storageKey = STORAGE_KEY_PREFIX + topicId;
  const redraw = useCallback(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const line of linesRef.current) {
      if (line.points.length < 2) continue;
      ctx.beginPath(); ctx.strokeStyle = line.color; ctx.lineWidth = line.width; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.moveTo(line.points[0].x, line.points[0].y);
      for (let i = 1; i < line.points.length; i++) ctx.lineTo(line.points[i].x, line.points[i].y);
      ctx.stroke();
    }
  }, []);
  useEffect(() => { try { const s = localStorage.getItem(storageKey); if (s) linesRef.current = JSON.parse(s); } catch {} redraw(); }, [redraw, storageKey]);
  function getPos(e: React.PointerEvent<HTMLCanvasElement>) { const r = canvasRef.current!.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
  function onPointerDown(e: React.PointerEvent<HTMLCanvasElement>) { setIsDrawing(true); currentLineRef.current = [getPos(e)]; (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId); }
  function onPointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!isDrawing) return; const pos = getPos(e); currentLineRef.current.push(pos);
    const ctx = canvasRef.current!.getContext('2d')!; const pts = currentLineRef.current; if (pts.length < 2) return;
    ctx.beginPath(); ctx.strokeStyle = color; ctx.lineWidth = width; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.moveTo(pts[pts.length - 2].x, pts[pts.length - 2].y); ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y); ctx.stroke();
  }
  function onPointerUp() {
    if (!isDrawing) return; setIsDrawing(false);
    if (currentLineRef.current.length > 1) { undoRef.current = [...undoRef.current, [...linesRef.current]].slice(-30); linesRef.current = [...linesRef.current, { points: currentLineRef.current, color, width }]; try { localStorage.setItem(storageKey, JSON.stringify(linesRef.current)); } catch {} }
    currentLineRef.current = [];
  }
  function undo() { if (!undoRef.current.length) return; linesRef.current = undoRef.current.pop()!; redraw(); try { localStorage.setItem(storageKey, JSON.stringify(linesRef.current)); } catch {} }
  function clear() { undoRef.current = [...undoRef.current, [...linesRef.current]].slice(-30); linesRef.current = []; redraw(); try { localStorage.removeItem(storageKey); } catch {} }
  const colors = ['#7c2d12', '#ef4444', '#3b82f6', '#22c55e', '#f59e0b', '#ffffff'];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
          <div className="flex items-center gap-2"><PenLine className="w-4 h-4 text-slate-600" /><span className="font-semibold text-slate-800 text-sm">Scratchpad</span></div>
          <div className="flex items-center gap-2">
            {colors.map(c => <button key={c} onClick={() => setColor(c)} style={{ background: c }} className={`w-5 h-5 rounded-full border-2 transition-transform ${color === c ? 'border-slate-500 scale-110' : 'border-slate-300'}`} />)}
            <select value={width} onChange={e => setWidth(Number(e.target.value))} className="text-xs border border-slate-200 rounded px-1 py-0.5 ml-2">{[2, 4, 6, 10].map(w => <option key={w} value={w}>{w}px</option>)}</select>
            <button onClick={undo} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"><Undo2 className="w-4 h-4" /></button>
            <button onClick={clear} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"><X className="w-4 h-4" /></button>
          </div>
        </div>
        <canvas ref={canvasRef} width={640} height={400} className="w-full flex-1 cursor-crosshair bg-slate-50 rounded-b-2xl" style={{ touchAction: 'none' }} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} />
      </div>
    </div>
  );
}

function DrawingInstrumentsPage({ onNavigate }: { onNavigate: (page: any) => void }) {
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

  function startQuiz(isRemediation: boolean) { setQuizQuestions(isRemediation ? TOPIC.remediationQuestions : TOPIC.initialQuestions); setView(ViewState.QUIZ); }
  function handleQuizComplete(score: number) {
    const total = quizQuestions.length; const passed = score >= Math.ceil(total * (2 / 3));
    setQuizScore(score); setMastered(passed); setAttempts(a => a + 1); saveProgress(score, total); setView(ViewState.FEEDBACK);
  }

  return (

    <div className="min-h-screen" style={{ background: 'oklch(98.5% 0.005 80)' }}>
      {showScratchpad && <ScratchpadModal topicId={TOPIC_ID} onClose={() => setShowScratchpad(false)} />}
      <main className="max-w-2xl mx-auto px-4 pt-24 pb-16 space-y-4">
        <nav className="flex items-center gap-2 text-xs text-slate-500">
          <button onClick={() => onNavigate('library')} className="hover:text-slate-600 transition-colors">Library</button>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-800 font-medium">EGD · Grade 10 · Term 1</span>
        </nav>

        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-600 flex items-center justify-center flex-shrink-0">
              <Ruler className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">{TOPIC.title}</h1>
              <p className="text-slate-500 text-xs mt-0.5">{TOPIC.description}</p>
            </div>
          </div>
          <button onClick={() => setShowScratchpad(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 text-xs hover:bg-slate-50 transition-colors flex-shrink-0">
            <PenLine className="w-3 h-3" /> Notes
          </button>
        </div>

        {view === ViewState.OVERVIEW && (
          <div className="space-y-3">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 space-y-3">
              <div className="flex items-center gap-2"><BookOpen className="w-4 h-4 text-slate-600" /><h2 className="font-semibold text-slate-800 text-sm">What You'll Learn</h2></div>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {['Core drawing instruments and their uses', 'Pencil grades: H, 2H, HB, B and when to use each', 'Reading and applying drawing scales (1:1, 1:2, 2:1)', 'Correct care and storage of instruments'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2"><CheckCircle className="w-3.5 h-3.5 text-slate-500 mt-0.5 flex-shrink-0" />{item}</li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 space-y-2">
              <h2 className="font-semibold text-slate-800 text-xs">Term 1 Topics</h2>
              {[
                { label: 'Drawing Instruments', page: null },
                { label: 'Lines and Lettering', page: 'learning-egd-g10-t1-lines-lettering' as AppPage },
                { label: 'Geometric Constructions', page: 'learning-egd-g10-t1-geometric-constructions' as AppPage },
                { label: 'Orthographic Projection', page: 'learning-egd-g10-t1-orthographic' as AppPage },
              ].map((t, i) => (
                <div key={i} onClick={() => t.page && onNavigate(t.page)}
                  className={`flex items-center gap-3 p-2.5 rounded-xl text-xs transition-colors ${t.page === null ? 'bg-slate-50 border border-slate-200 cursor-default' : 'hover:bg-slate-50 cursor-pointer border border-transparent'}`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${t.page === null ? 'bg-slate-600 text-white' : 'bg-slate-100 text-slate-600'}`}>{i + 1}</span>
                  <span className={t.page === null ? 'text-slate-800 font-medium' : 'text-slate-700'}>{t.label}</span>
                  {t.page !== null && <ChevronRight className="w-3 h-3 text-slate-400 ml-auto" />}
                </div>
              ))}
            </div>

            <button onClick={() => { setStepIndex(0); setView(ViewState.INTERACTIVE); }} className="w-full py-2.5 rounded-xl bg-slate-600 text-white font-semibold text-sm hover:bg-slate-700 transition-colors">
              Start Learning
            </button>
          </div>
        )}

        {view === ViewState.INTERACTIVE && (
          <InteractiveStep step={TOPIC.interactiveSteps[stepIndex]} index={stepIndex} total={TOPIC.interactiveSteps.length}
            onNext={() => stepIndex + 1 < TOPIC.interactiveSteps.length ? setStepIndex(s => s + 1) : setView(ViewState.GUIDED)}
            onPrev={() => stepIndex === 0 ? setView(ViewState.OVERVIEW) : setStepIndex(s => s - 1)} />
        )}
        {view === ViewState.GUIDED && <GuidedExample onFinish={() => startQuiz(false)} />}
        {view === ViewState.QUIZ && <QuizModule questions={quizQuestions} onComplete={handleQuizComplete} />}
        {view === ViewState.FEEDBACK && (
          <FeedbackModule score={quizScore} total={quizQuestions.length} mastered={mastered}
            onRetry={() => startQuiz(!mastered && attempts > 0)}
            onContinue={() => { sessionStorage.setItem('library_return', JSON.stringify({ subjectId: 'egd', grade: 10, term: 1 })); onNavigate('library'); }} />
        )}
        {view === ViewState.FEEDBACK && mastered && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 space-y-2">
            <div className="flex items-center gap-2"><Award className="w-4 h-4 text-slate-600" /><h3 className="font-semibold text-slate-800 text-sm">Challenge Questions</h3></div>
            <p className="text-xs text-slate-500">Test deeper understanding with exam-style questions.</p>
            <button onClick={() => { setQuizQuestions(TOPIC.hardQuestions); setView(ViewState.QUIZ); }} className="w-full py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-medium hover:bg-slate-50 transition-colors">Try Challenge Questions</button>
          </div>
        )}
      </main>
    </div>
  );
}

export default DrawingInstrumentsPage;
