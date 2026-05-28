import { useState, useEffect, useRef, useCallback } from 'react'
import { useStudySession } from '../../../../../../../providers/StudySessionContext'
import { loadTopicProgress as _loadProgress, saveTopicProgress as _saveProgress } from '../../../../../../../lib/studyProgress';
import {
  BookOpen, ChevronRight, ChevronLeft, RotateCcw, CheckCircle,
  XCircle, Lightbulb, Award, PenLine, X, Undo2, Trash2,
  Table2,
} from 'lucide-react';

const SUBJECT = 'CAT';
const GRADE = 10;
const TOPIC_ID = 'spreadsheets';
const STORAGE_KEY_PREFIX = 'scratchpad_cat-sheets_';


const TOPIC = {
  title: 'Spreadsheets',
  description: 'Using Microsoft Excel to organise data, perform calculations, and create charts.',
  interactiveSteps: [
    {
      label: 'The Excel Interface',
      tokens: ['Workbook', '|', 'Worksheet', '(Sheet)', '|', 'Cell', '|', 'Row', '|', 'Column', '|', 'Cell', 'Reference'],
      explanation:
        'A Workbook is the Excel file (.xlsx). It contains Worksheets (tabs at the bottom). Each worksheet is a grid of Rows (numbered 1, 2, 3…) and Columns (lettered A, B, C…). A Cell is the intersection — referenced by column then row, e.g. A1, B3, C10.',
    },
    {
      label: 'Entering Formulas',
      tokens: ['=', 'starts', 'every', 'formula', '|', '=A1+B1', '|', '=SUM(A1:A10)', '|', '=AVERAGE(B2:B6)'],
      explanation:
        'Every formula starts with =. Basic operators: + (add), - (subtract), * (multiply), / (divide). Functions: =SUM(A1:A10) adds a range, =AVERAGE(B2:B6) finds the mean, =MAX() finds the largest, =MIN() the smallest, =COUNT() counts numbers.',
    },
    {
      label: 'Cell References',
      tokens: ['Relative', 'A1', '|', 'Absolute', '$A$1', '|', 'Mixed', '$A1', 'or', 'A$1'],
      explanation:
        'Relative references (A1) change when copied to another cell. Absolute references ($A$1) stay fixed — useful for a tax rate or constant. Mixed references fix either the row ($A1) or column (A$1). Press F4 to toggle between reference types.',
    },
    {
      label: 'Formatting and Charts',
      tokens: ['Number', 'format', '|', 'Currency', '|', 'Percentage', '|', 'Bar', 'chart', '|', 'Pie', 'chart', '|', 'Line', 'chart'],
      explanation:
        'Format cells as Currency (R1 234.56), Percentage (85%), or Date. Charts visualise data — Bar/Column charts compare categories, Pie charts show proportions of a whole, Line charts show trends over time. Insert charts via the Insert tab.',
    },
  ],
  guidedItem: {
    scenario: 'Nomsa tracks her monthly pocket money and expenses in Excel. Help her set up the spreadsheet and calculate totals.',
    steps: [
      {
        title: 'Step 1 — Set up the structure',
        description:
          'Nomsa labels column A "Month", column B "Income (R)", column C "Expenses (R)", column D "Savings (R)". She enters January through June in cells A2:A7. Income values go in B2:B7, expenses in C2:C7.',
        insight: 'Column headers in row 1. Data starts in row 2. Cell reference A2 = first data cell.',
      },
      {
        title: 'Step 2 — Enter formulas',
        description:
          'In D2, Nomsa types =B2-C2 (Income minus Expenses = Savings). She copies D2 down to D3:D7 — the relative references update automatically (D3 = B3-C3, etc.). In B8 she types =SUM(B2:B7) for total income. She copies this formula to C8 and D8.',
        insight: '=B2-C2 calculates savings. =SUM(B2:B7) totals the column. Relative refs update on copy.',
      },
      {
        title: 'Step 3 — Format and chart',
        description:
          'Nomsa selects B2:D8 and formats as Currency (Home → Number → Currency). She selects A1:A7 and D1:D7 (holding Ctrl), then inserts a Line chart (Insert → Charts → Line) to show her savings trend over 6 months.',
        insight: 'Currency format: Home → Number group. Line chart: Insert tab → Charts. Hold Ctrl to select non-adjacent columns.',
      },
    ],
  },
  initialQuestions: [
    {
      question: 'In Excel, a cell reference "B4" refers to:',
      options: ['Row B, Column 4', 'Column B, Row 4', 'The 4th workbook, sheet B', 'A named range called B4'],
      answer: 1,
      explanation: 'Cell references are always Column then Row. B4 = Column B, Row 4. This is the standard Excel notation used in all formulas and functions.',
    },
    {
      question: 'Which formula correctly calculates the SUM of cells A1 through A10?',
      options: ['SUM(A1-A10)', '=SUM(A1:A10)', '=ADD(A1,A10)', '=TOTAL(A1 to A10)'],
      answer: 1,
      explanation: '=SUM(A1:A10) is correct. The colon (:) indicates a range from A1 to A10. All formulas start with =. SUM is the function name. The range goes inside brackets.',
    },
    {
      question: 'A learner copies the formula =A1*B1 from cell C1 to cell C2. What does the formula become in C2?',
      options: ['=A1*B1 (unchanged)', '=A2*B2', '=$A$1*$B$1', '=A1*B2'],
      answer: 1,
      explanation: 'Relative cell references update when copied. Moving one row down shifts all row numbers by 1. So =A1*B1 becomes =A2*B2 in C2. This is how relative referencing works.',
    },
    {
      question: 'Which chart type is BEST for showing how a learner\'s test scores changed over 5 terms?',
      options: ['Pie chart', 'Bar chart', 'Line chart', 'Scatter plot'],
      answer: 2,
      explanation: 'A Line chart is best for showing trends over time. Each point represents a term\'s score, and the connecting line shows the upward or downward trend clearly. Pie charts show proportions; bar charts compare categories.',
    },
  ],
  remediationQuestions: [
    {
      question: 'What symbol must every Excel formula start with?',
      options: ['+', '#', '=', '@'],
      answer: 2,
      explanation: 'Every Excel formula must start with = (equals sign). Without it, Excel treats the entry as text, not a formula. Example: =A1+B1 calculates; A1+B1 just shows the text "A1+B1".',
    },
    {
      question: 'A learner wants the formula to always reference cell B1 no matter where it is copied. Which reference should she use?',
      options: ['B1', 'B$1', '$B1', '$B$1'],
      answer: 3,
      explanation: '$B$1 is an absolute reference — both the column (B) and row (1) are locked with $. No matter where you copy the formula, it will always refer to cell B$1. Press F4 to add $ signs automatically.',
    },
  ],
  hardQuestions: [
    {
      question: 'A learner enters =B2*$C$1 in cell D2, where $C$1 contains a VAT rate of 15%. She copies the formula to D3:D10. What happens?',
      options: [
        'All cells in D3:D10 show the same value as D2',
        'B2 becomes B3, B4… etc. but $C$1 stays fixed — each row calculates its own VAT using the same rate',
        'The formula breaks because you cannot mix relative and absolute references',
        '$C$1 updates to $C$2, $C$3… making the formula incorrect',
      ],
      answer: 1,
      explanation: 'Mixed references work correctly here. B2 is relative — it updates to B3, B4… as you copy down (each row\'s own value). $C$1 is absolute — it stays fixed at the VAT rate cell. This is the correct pattern for applying a constant rate to a variable list.',
    },
    {
      question: 'A school uses a spreadsheet to track 200 learners\' marks. The teacher wants to find how many learners scored above 50%. Which function is MOST appropriate?',
      options: ['=COUNT(B2:B201)', '=COUNTIF(B2:B201,">50")', '=SUM(B2:B201)', '=AVERAGE(B2:B201)'],
      answer: 1,
      explanation: '=COUNTIF counts cells that meet a condition. =COUNTIF(B2:B201,">50") counts all cells in the range where the value is greater than 50. COUNT counts all numbers, SUM adds them, AVERAGE finds the mean — none answer "how many above 50?".',
    },
    {
      question: 'Which of the following BEST explains why absolute references are important in a budget spreadsheet?',
      options: [
        'They make formulas run faster',
        'They prevent the formula from being deleted accidentally',
        'They allow a single cell (e.g. tax rate, exchange rate) to be referenced consistently across many formulas without changing when copied',
        'They automatically format the cell as currency',
      ],
      answer: 2,
      explanation: 'Absolute references ($A$1) are essential when one cell (like a tax rate or exchange rate) must be used in many formulas. Without $, copying a formula shifts the reference — causing errors. With $, the reference stays locked to the correct cell throughout the spreadsheet.',
    },
    {
      question: 'A learner\'s spreadsheet has: A1=10, A2=20, A3=30, A4="Total", A5=SUM(A1:A4). What does A5 display?',
      options: ['60', '60Total', 'Error — SUM cannot include text', '0'],
      answer: 0,
      explanation: 'Excel\'s SUM function ignores text values in a range — it only adds numeric cells. So =SUM(A1:A4) adds 10+20+30 and ignores the text "Total", giving 60. This is important to know — SUM does not error on text, it simply skips it.',
    },
  ],
};

enum ViewState { OVERVIEW = 'OVERVIEW', INTERACTIVE = 'INTERACTIVE', GUIDED = 'GUIDED', QUIZ = 'QUIZ', FEEDBACK = 'FEEDBACK' }
interface QuizQuestion { question: string; options: string[]; answer: number; explanation: string; }

function InteractiveStep({ step, index, total, onNext, onPrev }: { step: (typeof TOPIC.interactiveSteps)[0]; index: number; total: number; onNext: () => void; onPrev: () => void; }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-slate-600 flex items-center justify-center"><Table2 className="w-4 h-4 text-white" /></div>
        <div>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Step {index + 1} of {total}</p>
          <h3 className="font-semibold text-slate-800">{step.label}</h3>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {step.tokens.map((token, i) => (
          <span key={i} className={
            token === '|' ? 'text-slate-400 font-bold text-lg px-1'
            : ['Workbook', 'Cell', 'Row', 'Column', 'Relative', 'Absolute', 'Mixed'].includes(token)
              ? 'bg-slate-600 text-white px-2 py-1 rounded-lg font-bold text-sm'
              : ['=A1+B1', '=SUM(A1:A10)', '=AVERAGE(B2:B6)', 'A1', '$A$1', '$A1', 'A$1', 'Currency', 'Percentage'].includes(token)
                ? 'bg-slate-100 text-slate-800 px-2 py-1 rounded-lg font-semibold text-sm border border-slate-200 font-mono'
                : 'bg-slate-100 text-slate-700 px-2 py-1 rounded-lg text-xs font-medium'
          }>{token}</span>
        ))}
      </div>
      <p className="text-slate-600 text-xs leading-relaxed bg-slate-50 rounded-xl p-3 border border-slate-100">{step.explanation}</p>
      <div className="flex gap-3">
        <button onClick={onPrev} disabled={index === 0} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"><ChevronLeft className="w-4 h-4" /> Previous</button>
        <button onClick={onNext} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-600 text-white text-sm hover:bg-slate-700 transition-colors ml-auto">{index === total - 1 ? 'Start Guided Example' : 'Next'} <ChevronRight className="w-4 h-4" /></button>
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
          <h3 className="font-semibold text-slate-800">Nomsa's Budget Spreadsheet</h3>
        </div>
      </div>
      <div className="bg-slate-50 rounded-xl p-3 border border-slate-100"><p className="text-xs text-slate-800 font-medium">{TOPIC.guidedItem.scenario}</p></div>
      <div className="space-y-3">
        {steps.slice(0, step + 1).map((s, i) => (
          <div key={i} className={`rounded-xl p-3 border transition-all ${i === step ? 'border-slate-300 bg-slate-50' : 'border-slate-100 bg-slate-50 opacity-70'}`}>
            <p className="font-semibold text-slate-800 text-sm mb-1">{s.title}</p>
            <p className="text-slate-600 text-xs leading-relaxed">{s.description}</p>
            {i === step && <div className="mt-3 flex items-start gap-2 bg-white rounded-lg p-3 border border-slate-200"><CheckCircle className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" /><p className="text-xs text-slate-700 font-medium">{s.insight}</p></div>}
          </div>
        ))}
      </div>
      <div className="flex gap-3">
        {step > 0 && <button onClick={() => setStep(s => s - 1)} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm hover:bg-slate-50 transition-colors"><ChevronLeft className="w-4 h-4" /> Back</button>}
        <button onClick={() => step < steps.length - 1 ? setStep(s => s + 1) : onFinish()} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-600 text-white text-sm hover:bg-slate-700 transition-colors ml-auto">{step < steps.length - 1 ? 'Next Step' : 'Start Quiz'} <ChevronRight className="w-4 h-4" /></button>
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
      <p className="font-medium text-slate-800 leading-relaxed">{q.question}</p>
      <div className="space-y-2">
        {q.options.map((opt, i) => {
          let cls = 'w-full text-left px-3 py-2 rounded-xl border text-xs transition-all cursor-pointer ';
          if (!revealed) cls += selected === i ? 'border-slate-400 bg-slate-50 text-slate-800' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700';
          else if (i === q.answer) cls += 'border-slate-400 bg-slate-50 text-slate-800';
          else if (i === selected) cls += 'border-slate-400 bg-slate-50 text-slate-800';
          else cls += 'border-slate-200 text-slate-400';
        })}
      </div>
      {revealed && <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex gap-3"><Lightbulb className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" /><p className="text-xs text-slate-800">{q.explanation}</p></div>}
      <div className="flex gap-3 justify-end">
        {!revealed
          ? <button onClick={handleReveal} disabled={selected === null} className="px-5 py-2 rounded-lg bg-slate-600 text-white text-sm hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">Check Answer</button>
          : <button onClick={handleNext} className="flex items-center gap-2 px-5 py-2 rounded-lg bg-slate-600 text-white text-sm hover:bg-slate-700 transition-colors">{current + 1 >= questions.length ? 'See Results' : 'Next Question'} <ChevronRight className="w-4 h-4" /></button>}
      </div>
    </div>
  );
}

function FeedbackModule({ score, total, mastered, onRetry, onContinue }: { score: number; total: number; mastered: boolean; onRetry: () => void; onContinue: () => void; }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 space-y-3 text-center">
      <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center ${mastered ? 'bg-slate-100' : 'bg-slate-100'}`}>
        {mastered ? <CheckCircle className="w-8 h-8 text-slate-600" /> : <XCircle className="w-8 h-8 text-slate-600" />}
      </div>
      <div>
        <h3 className="text-xl font-bold text-slate-800">{mastered ? 'Topic Mastered!' : 'Keep Practising'}</h3>
        <p className="text-slate-500 text-sm mt-1">You scored {score} out of {total}</p>
      </div>
      {mastered ? <p className="text-sm text-slate-600">Excellent! You understand cell references, formulas, functions, and charts in Excel.</p>
        : <p className="text-sm text-slate-600">Review the interactive steps and guided example, then try again.</p>}
      <div className="flex gap-3 justify-center">
        <button onClick={onRetry} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-slate-700 text-sm hover:bg-slate-50 transition-colors"><RotateCcw className="w-4 h-4" /> Try Again</button>
        <button onClick={onContinue} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-600 text-white text-sm hover:bg-slate-700 transition-colors">Back to Library <ChevronRight className="w-4 h-4" /></button>
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
  const colors = ['#1e3a5f', '#ef4444', '#3b82f6', '#22c55e', '#f59e0b', '#ffffff'];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100">
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

function SpreadsheetsPage({ onNavigate }: { onNavigate: (page: any) => void }) {
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
      <main className="max-w-2xl mx-auto px-4 pt-24 pb-16 space-y-6">
        <nav className="flex items-center gap-2 text-sm text-slate-500">
          <button onClick={() => onNavigate('library')} className="hover:text-slate-600 transition-colors">Library</button>
          <ChevronRight className="w-4 h-4" />
          <span className="text-slate-800 font-medium">CAT · Grade 10 · Term 1</span>
        </nav>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-600 flex items-center justify-center flex-shrink-0"><Table2 className="w-6 h-6 text-white" /></div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{TOPIC.title}</h1>
              <p className="text-slate-500 text-sm mt-0.5">{TOPIC.description}</p>
            </div>
          </div>
          <button onClick={() => setShowScratchpad(true)} className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 text-slate-700 text-sm hover:bg-slate-50 transition-colors flex-shrink-0">
            <PenLine className="w-4 h-4" /> Notes
          </button>
        </div>

        {view === ViewState.OVERVIEW && (
          <div className="space-y-3">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 space-y-3">
              <div className="flex items-center gap-2"><BookOpen className="w-4 h-4 text-slate-600" /><h2 className="font-semibold text-slate-800">What You'll Learn</h2></div>
              <ul className="space-y-2 text-sm text-slate-600">
                {['The Excel interface: workbooks, worksheets, cells, rows, columns', 'Writing formulas using =, and functions like SUM and AVERAGE', 'Relative vs absolute cell references ($)', 'Formatting cells and creating charts'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />{item}</li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 space-y-3">
              <h2 className="font-semibold text-slate-800 text-sm">Term 1 Topics</h2>
              {[
                { label: 'Computer Systems', page: 'learning-cat-g10-t1-computer-systems' as AppPage },
                { label: 'File Management', page: 'learning-cat-g10-t1-file-management' as AppPage },
                { label: 'Word Processing', page: 'learning-cat-g10-t1-word-processing' as AppPage },
                { label: 'Spreadsheets', page: null },
              ].map((t, i) => (
                <div key={i} onClick={() => t.page && onNavigate(t.page)}
                  className={`flex items-center gap-3 p-3 rounded-xl text-sm transition-colors ${t.page === null ? 'bg-slate-50 border border-slate-200 cursor-default' : 'hover:bg-slate-50 cursor-pointer border border-transparent'}`}>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${t.page === null ? 'bg-slate-600 text-white' : 'bg-slate-100 text-slate-600'}`}>{i + 1}</span>
                  <span className={t.page === null ? 'text-slate-800 font-medium' : 'text-slate-700'}>{t.label}</span>
                  {t.page !== null && <ChevronRight className="w-4 h-4 text-slate-400 ml-auto" />}
                </div>
              ))}
            </div>
            <button onClick={() => { setStepIndex(0); setView(ViewState.INTERACTIVE); }} className="w-full py-3 rounded-xl bg-slate-600 text-white font-semibold hover:bg-slate-700 transition-colors">Start Learning</button>
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
            onContinue={() => { sessionStorage.setItem('library_return', JSON.stringify({ subjectId: 'cat', grade: 10, term: 1 })); onNavigate('library'); }} />
        )}
        {view === ViewState.FEEDBACK && mastered && (
          <>
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-slate-600 mx-auto flex items-center justify-center">
                <Award className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">All Term 1 Topics Complete!</h3>
              <p className="text-slate-700 text-sm">You've mastered all 4 Grade 10 CAT Term 1 topics. Well done!</p>
              <button onClick={() => onNavigate('library' as AppPage)} className="mt-2 px-6 py-2.5 rounded-xl bg-slate-600 text-white text-xs font-semibold hover:bg-slate-700 transition-colors">Back to Library</button>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 space-y-3">
              <div className="flex items-center gap-2"><Award className="w-4 h-4 text-slate-600" /><h3 className="font-semibold text-slate-800 text-sm">Challenge Questions</h3></div>
              <p className="text-xs text-slate-500">Test deeper understanding with exam-style questions.</p>
              <button onClick={() => { setQuizQuestions(TOPIC.hardQuestions); setView(ViewState.QUIZ); }} className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-medium hover:bg-slate-50 transition-colors">Try Challenge Questions</button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default SpreadsheetsPage;
