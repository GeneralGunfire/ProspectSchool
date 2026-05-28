import { useState, useEffect, useRef, useCallback } from 'react'
import { useStudySession } from '../../../../../../../providers/StudySessionContext'
import { loadTopicProgress as _loadProgress, saveTopicProgress as _saveProgress } from '../../../../../../../lib/studyProgress';
import {
  BookOpen, ChevronRight, ChevronLeft, RotateCcw, CheckCircle,
  XCircle, Lightbulb, Award, PenLine, X, Undo2, Trash2,
  FileText,
} from 'lucide-react';

const SUBJECT = 'CAT';
const GRADE = 10;
const TOPIC_ID = 'word-processing';
const NEXT_TOPIC_ID = 'spreadsheets';
const STORAGE_KEY_PREFIX = 'scratchpad_cat-word_';


const TOPIC = {
  title: 'Word Processing',
  description: 'Creating, formatting, and editing documents using Microsoft Word.',
  interactiveSteps: [
    {
      label: 'The Word Interface',
      tokens: ['Ribbon', '|', 'Tabs', '|', 'Groups', '|', 'Quick', 'Access', 'Toolbar', '|', 'Status', 'Bar'],
      explanation:
        'Microsoft Word\'s interface has a Ribbon at the top containing Tabs (Home, Insert, Layout, etc.). Each tab has Groups of related commands. The Quick Access Toolbar (top-left) holds frequently used commands. The Status Bar (bottom) shows page count, word count, and zoom.',
    },
    {
      label: 'Text Formatting',
      tokens: ['Bold', '(Ctrl+B)', '|', 'Italic', '(Ctrl+I)', '|', 'Underline', '(Ctrl+U)', '|', 'Font', '|', 'Size', '|', 'Colour'],
      explanation:
        'Text formatting changes how text looks. Bold makes text heavier, Italic slants it, Underline adds a line beneath. Font changes the typeface (e.g. Arial, Times New Roman). Size is measured in points (pt). All formatting is in the Home tab.',
    },
    {
      label: 'Paragraph Formatting',
      tokens: ['Alignment', '|', 'Left', 'Centre', 'Right', 'Justify', '|', 'Line', 'Spacing', '|', 'Indents'],
      explanation:
        'Paragraph formatting affects whole paragraphs. Alignment: Left (default), Centre (headings), Right (dates), Justify (newspaper style — even edges). Line spacing controls space between lines (1.0, 1.5, 2.0). Indents move the paragraph edge inward.',
    },
    {
      label: 'Key Shortcuts',
      tokens: ['Ctrl+S', 'Save', '|', 'Ctrl+Z', 'Undo', '|', 'Ctrl+C', 'Copy', '|', 'Ctrl+V', 'Paste', '|', 'Ctrl+P', 'Print'],
      explanation:
        'Keyboard shortcuts save time in exams and practicals. Must-know: Ctrl+S (Save), Ctrl+Z (Undo), Ctrl+Y (Redo), Ctrl+C (Copy), Ctrl+X (Cut), Ctrl+V (Paste), Ctrl+A (Select All), Ctrl+P (Print), Ctrl+F (Find).',
    },
  ],
  guidedItem: {
    scenario: 'Thabo must format his Life Sciences report in Word according to his teacher\'s instructions. Follow the steps to format it correctly.',
    steps: [
      {
        title: 'Step 1 — Set up the document',
        description:
          'Thabo opens Word and sets the page to A4 (Layout tab → Size → A4). He sets margins to Normal (2.54cm all sides). He types the title "Biodiversity Report" and presses Enter to start the body text.',
        insight: 'Page setup: Layout tab. A4 size, Normal margins. Always set up before typing.',
      },
      {
        title: 'Step 2 — Format the heading',
        description:
          'Thabo selects "Biodiversity Report", changes the font to Arial, size 16pt, Bold. He centres the heading using Ctrl+E. He adds one blank line below the heading before the body text begins.',
        insight: 'Heading: Arial, 16pt, Bold, Centred (Ctrl+E). Body text usually: Times New Roman or Calibri, 12pt, Left-aligned.',
      },
      {
        title: 'Step 3 — Format the body and save',
        description:
          'Thabo selects all body text (Ctrl+A, then deselects the heading). He sets font to Calibri 12pt, line spacing to 1.5, and alignment to Justify. He saves with Ctrl+S as "Biodiversity_Report_Thabo.docx" in his School\\LifeSciences folder.',
        insight: 'Body: Calibri 12pt, 1.5 line spacing, Justified. Save with Ctrl+S using a descriptive file name.',
      },
    ],
  },
  initialQuestions: [
    {
      question: 'Which keyboard shortcut is used to SAVE a document in Microsoft Word?',
      options: ['Ctrl+P', 'Ctrl+S', 'Ctrl+Z', 'Ctrl+A'],
      answer: 1,
      explanation: 'Ctrl+S saves the current document. Ctrl+P prints, Ctrl+Z undoes the last action, Ctrl+A selects all text.',
    },
    {
      question: 'A learner wants text to have even edges on both the left and right sides of the page. Which alignment should she choose?',
      options: ['Left', 'Centre', 'Right', 'Justify'],
      answer: 3,
      explanation: 'Justify alignment spaces words so both the left and right edges are even — like in a newspaper. Left alignment only aligns the left edge; Right only the right; Centre centres each line.',
    },
    {
      question: 'In Microsoft Word, where would you find the Bold, Italic, and Underline buttons?',
      options: ['Insert tab', 'Layout tab', 'Home tab', 'View tab'],
      answer: 2,
      explanation: 'Bold, Italic, and Underline are in the Home tab under the Font group. The Home tab contains the most commonly used formatting tools.',
    },
    {
      question: 'What does "line spacing of 2.0" mean in a Word document?',
      options: [
        'Two characters fit on each line',
        'There is double the normal space between each line of text',
        'The font size is doubled',
        'The document has two columns',
      ],
      answer: 1,
      explanation: 'Line spacing of 2.0 (double spacing) means there is twice the normal amount of space between lines. This makes documents easier to read and allows space for handwritten feedback.',
    },
  ],
  remediationQuestions: [
    {
      question: 'Which keyboard shortcut UNDOES the last action in Word?',
      options: ['Ctrl+Y', 'Ctrl+U', 'Ctrl+Z', 'Ctrl+X'],
      answer: 2,
      explanation: 'Ctrl+Z undoes the last action. Ctrl+Y redoes (reverses an undo). Ctrl+U underlines selected text. Ctrl+X cuts selected text.',
    },
    {
      question: 'A learner changes her essay\'s font to "Comic Sans MS, 8pt". Her teacher asks her to fix it. What should the correct body text formatting be?',
      options: [
        'Comic Sans MS, 8pt — the learner is correct',
        'A readable font like Calibri or Arial, 11–12pt',
        'Times New Roman, 20pt for easy reading',
        'Any font at 6pt to fit more on the page',
      ],
      answer: 1,
      explanation: 'Standard body text is a readable font (Calibri, Arial, or Times New Roman) at 11–12pt. Comic Sans and very small fonts are unprofessional and difficult to read.',
    },
  ],
  hardQuestions: [
    {
      question: 'A learner uses "Format Painter" in Word. What does this tool do?',
      options: [
        'It changes the background colour of the entire page',
        'It copies formatting from one piece of text and applies it to another',
        'It inserts a pre-designed image into the document',
        'It automatically corrects spelling and grammar',
      ],
      answer: 1,
      explanation: 'Format Painter (paintbrush icon in Home tab) copies all formatting (font, size, colour, bold, etc.) from selected text and applies it to other text you click or drag over. It\'s a time-saver for consistent formatting.',
    },
    {
      question: 'A teacher requires a report with: A4 page, 2.54cm margins, Calibri 12pt, 1.5 line spacing, page numbers at the bottom. Where would a learner insert page numbers?',
      options: [
        'Home tab → Paragraph group',
        'Insert tab → Header & Footer group → Page Number',
        'Layout tab → Page Setup group',
        'View tab → Show group',
      ],
      answer: 1,
      explanation: 'Page numbers are inserted via Insert tab → Header & Footer group → Page Number. You can choose position (top/bottom) and alignment. This is a common CAT practical requirement.',
    },
    {
      question: 'A learner accidentally selects all text and presses Delete. What is the quickest way to recover the text?',
      options: [
        'Close the document without saving and reopen the last saved version',
        'Press Ctrl+Z to undo the deletion',
        'Use File → Recent Documents to find the original',
        'Retype the entire document from memory',
      ],
      answer: 1,
      explanation: 'Ctrl+Z immediately undoes the last action — in this case, the deletion. Word keeps an undo history so multiple Ctrl+Z presses can undo several steps back. Always try Ctrl+Z first before any other recovery method.',
    },
    {
      question: 'Which of the following BEST describes the difference between a Word template (.dotx) and a regular Word document (.docx)?',
      options: [
        'A template cannot be edited; a document can',
        'A template provides a pre-formatted starting point for new documents without overwriting itself',
        'A .docx file is read-only; a .dotx file can be edited freely',
        'Templates are only used for spreadsheets, not word processing',
      ],
      answer: 1,
      explanation: 'A Word template (.dotx) is a reusable starting point — it contains pre-set formatting, styles, and sometimes placeholder text. When you open a template, Word creates a new untitled document based on it, leaving the template unchanged. This is useful for letterheads, reports, and forms.',
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
          <FileText className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Step {index + 1} of {total}</p>
          <h3 className="font-semibold text-slate-800">{step.label}</h3>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {step.tokens.map((token, i) => (
          <span key={i} className={
            token === '|' ? 'text-slate-400 font-bold text-lg px-1'
            : ['Ribbon', 'Bold', 'Italic', 'Underline', 'Alignment', 'Ctrl+S', 'Ctrl+Z', 'Ctrl+C', 'Ctrl+V', 'Ctrl+P'].includes(token)
              ? 'bg-slate-600 text-white px-2 py-1 rounded-lg font-bold text-sm'
              : ['Left', 'Centre', 'Right', 'Justify', 'Save', 'Undo', 'Copy', 'Paste', 'Print', 'Tabs', 'Groups', 'Font', 'Size'].includes(token)
                ? 'bg-slate-100 text-slate-800 px-2 py-1 rounded-lg font-semibold text-sm border border-slate-200'
                : 'bg-slate-100 text-slate-700 px-2 py-1 rounded-lg text-xs font-medium'
          }>{token}</span>
        ))}
      </div>
      <p className="text-slate-600 text-xs leading-relaxed bg-slate-50 rounded-xl p-3 border border-slate-100">{step.explanation}</p>
      <div className="flex gap-3">
        <button onClick={onPrev} disabled={index === 0} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>
        <button onClick={onNext} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-600 text-white text-sm hover:bg-slate-700 transition-colors ml-auto">
          {index === total - 1 ? 'Start Guided Example' : 'Next'} <ChevronRight className="w-4 h-4" />
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
          <h3 className="font-semibold text-slate-800">Formatting Thabo's Report</h3>
        </div>
      </div>
      <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
        <p className="text-xs text-slate-800 font-medium">{TOPIC.guidedItem.scenario}</p>
      </div>
      <div className="space-y-3">
        {steps.slice(0, step + 1).map((s, i) => (
          <div key={i} className={`rounded-xl p-3 border transition-all ${i === step ? 'border-slate-300 bg-slate-50' : 'border-slate-100 bg-slate-50 opacity-70'}`}>
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
        {step > 0 && <button onClick={() => setStep(s => s - 1)} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm hover:bg-slate-50 transition-colors"><ChevronLeft className="w-4 h-4" /> Back</button>}
        <button onClick={() => step < steps.length - 1 ? setStep(s => s + 1) : onFinish()} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-600 text-white text-sm hover:bg-slate-700 transition-colors ml-auto">
          {step < steps.length - 1 ? 'Next Step' : 'Start Quiz'} <ChevronRight className="w-4 h-4" />
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
          : <button onClick={handleNext} className="flex items-center gap-2 px-5 py-2 rounded-lg bg-slate-600 text-white text-sm hover:bg-slate-700 transition-colors">{current + 1 >= questions.length ? 'See Results' : 'Next Question'} <ChevronRight className="w-4 h-4" /></button>
        }
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
      {mastered ? <p className="text-sm text-slate-600">Excellent! You can format Word documents professionally and use key shortcuts confidently.</p>
        : <p className="text-sm text-slate-600">Review the interactive steps and guided example, then try again.</p>}
      <div className="flex gap-3 justify-center">
        <button onClick={onRetry} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-slate-700 text-sm hover:bg-slate-50 transition-colors"><RotateCcw className="w-4 h-4" /> Try Again</button>
        <button onClick={onContinue} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-600 text-white text-sm hover:bg-slate-700 transition-colors">Next Topic <ChevronRight className="w-4 h-4" /></button>
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
    if (!isDrawing) return;
    const pos = getPos(e); currentLineRef.current.push(pos);
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

function WordProcessingPage({ onNavigate }: { onNavigate: (page: any) => void }) {
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
            <div className="w-12 h-12 rounded-2xl bg-slate-600 flex items-center justify-center flex-shrink-0"><FileText className="w-6 h-6 text-white" /></div>
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
                {['The Word interface: Ribbon, Tabs, and Groups', 'Text formatting: Bold, Italic, Underline, Font, Size', 'Paragraph formatting: alignment, line spacing, indents', 'Essential keyboard shortcuts for the CAT exam'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />{item}</li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 space-y-3">
              <h2 className="font-semibold text-slate-800 text-sm">Term 1 Topics</h2>
              {[
                { label: 'Computer Systems', page: 'learning-cat-g10-t1-computer-systems' as AppPage },
                { label: 'File Management', page: 'learning-cat-g10-t1-file-management' as AppPage },
                { label: 'Word Processing', page: null },
                { label: 'Spreadsheets', page: 'learning-cat-g10-t1-spreadsheets' as AppPage },
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
            onContinue={() => onNavigate('learning-cat-g10-t1-spreadsheets' as AppPage)} />
        )}
        {view === ViewState.FEEDBACK && mastered && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 space-y-3">
            <div className="flex items-center gap-2"><Award className="w-4 h-4 text-slate-600" /><h3 className="font-semibold text-slate-800 text-sm">Challenge Questions</h3></div>
            <p className="text-xs text-slate-500">Test deeper understanding with exam-style questions.</p>
            <button onClick={() => { setQuizQuestions(TOPIC.hardQuestions); setView(ViewState.QUIZ); }} className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-medium hover:bg-slate-50 transition-colors">Try Challenge Questions</button>
          </div>
        )}
      </main>
    </div>
  );
}

export default WordProcessingPage;
