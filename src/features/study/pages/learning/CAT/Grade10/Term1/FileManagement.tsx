import { useState, useEffect, useRef, useCallback } from 'react'
import { useStudySession } from '../../../../../../../providers/StudySessionContext'
import { loadTopicProgress as _loadProgress, saveTopicProgress as _saveProgress } from '../../../../../../../lib/studyProgress';
import {
  BookOpen, ChevronRight, ChevronLeft, RotateCcw, CheckCircle,
  XCircle, Lightbulb, Award, PenLine, X, Undo2, Trash2,
  FolderOpen,
} from 'lucide-react';

// ── constants ──────────────────────────────────────────────────────────────
const SUBJECT = 'CAT';
const GRADE = 10;
const TOPIC_ID = 'file-management';
const NEXT_TOPIC_ID = 'word-processing';
const STORAGE_KEY_PREFIX = 'scratchpad_cat-files_';


const TOPIC = {
  title: 'File Management',
  description: 'Organising, naming, and managing files and folders on a computer.',
  interactiveSteps: [
    {
      label: 'Files and Folders',
      tokens: ['File', '=', 'Data', 'stored', 'on', 'disk', '|', 'Folder', '=', 'Container', 'for', 'files'],
      explanation:
        'A file is a collection of data stored on a storage device (document, image, video, program). A folder (directory) is a container used to organise files. Folders can contain other folders — called subfolders — creating a hierarchy.',
    },
    {
      label: 'File Naming and Extensions',
      tokens: ['filename', '.', 'extension', '|', '.docx', '.xlsx', '.jpg', '.mp3', '.exe'],
      explanation:
        'Every file has a name and an extension that identifies its type. .docx = Word document, .xlsx = Excel spreadsheet, .jpg = image, .mp3 = audio, .pdf = PDF document, .exe = program. File names should be descriptive and avoid special characters.',
    },
    {
      label: 'File Paths',
      tokens: ['C:', '\\', 'Users', '\\', 'Thabo', '\\', 'Documents', '\\', 'Essay.docx'],
      explanation:
        'A file path shows the exact location of a file on a computer. It starts from the root (C:\\ on Windows) and lists each folder in order, separated by backslashes. Knowing the path helps you find, move, or reference any file.',
    },
    {
      label: 'File Operations',
      tokens: ['Copy', '|', 'Cut', '|', 'Paste', '|', 'Rename', '|', 'Delete', '|', 'Search'],
      explanation:
        'Key file operations: Copy duplicates a file (original stays). Cut moves a file (original is removed after paste). Rename changes the file name. Delete sends to Recycle Bin. Search (Ctrl+F or Windows search) finds files by name or content.',
    },
  ],
  guidedItem: {
    scenario:
      'Nomsa is a Grade 10 CAT learner. She needs to organise her school files on her laptop. Help her set up a proper folder structure.',
    steps: [
      {
        title: 'Step 1 — Create a root folder',
        description:
          'Nomsa creates a main folder called "School" inside her Documents folder. The full path is: C:\\Users\\Nomsa\\Documents\\School\\. This is her root folder for all school work.',
        insight: 'Always start with a clear root folder. Path: C:\\Users\\Nomsa\\Documents\\School\\',
      },
      {
        title: 'Step 2 — Create subject subfolders',
        description:
          'Inside "School", Nomsa creates subfolders for each subject: CAT, Mathematics, English, Life Sciences. Each subject folder will hold files for that subject only. She uses consistent, descriptive names with no spaces or special characters.',
        insight: 'Subfolders keep subjects separate. Good naming: "CAT" not "my cat stuff 2026!!!"',
      },
      {
        title: 'Step 3 — Name files correctly',
        description:
          'Nomsa saves her CAT assignment as "CAT_Assignment1_2026.docx" in the CAT folder. The name includes the subject, task, and year — making it easy to find later. She avoids names like "Document1.docx" which give no information about the content.',
        insight: 'Good file name: CAT_Assignment1_2026.docx. Bad: Document1.docx or my work.docx',
      },
    ],
  },
  initialQuestions: [
    {
      question: 'What does the file extension ".xlsx" indicate?',
      options: ['A Word processing document', 'An Excel spreadsheet', 'An image file', 'An audio file'],
      answer: 1,
      explanation:
        '.xlsx is the file extension for Microsoft Excel spreadsheets. .docx = Word, .jpg/.png = image, .mp3/.wav = audio, .pdf = PDF document.',
    },
    {
      question: 'What is the difference between "Copy + Paste" and "Cut + Paste"?',
      options: [
        'They are the same — both move the file',
        'Copy + Paste duplicates the file; Cut + Paste moves it',
        'Cut + Paste duplicates the file; Copy + Paste moves it',
        'Copy + Paste deletes the original; Cut + Paste keeps it',
      ],
      answer: 1,
      explanation:
        'Copy + Paste creates a duplicate — the original file stays in its location. Cut + Paste moves the file — the original is removed from its original location after pasting.',
    },
    {
      question: 'A learner saves a file as "C:\\School\\CAT\\Practical1.docx". What does this represent?',
      options: ['The file name only', 'The file extension only', 'The full file path showing the file\'s location', 'The folder name only'],
      answer: 2,
      explanation:
        'This is a full file path. It shows: C:\\ (root drive) → School (folder) → CAT (subfolder) → Practical1.docx (file name with extension). The path tells you exactly where the file is stored.',
    },
    {
      question: 'When you delete a file on Windows, where does it go first?',
      options: ['It is permanently deleted immediately', 'It goes to the Recycle Bin', 'It is moved to the Downloads folder', 'It is compressed and archived'],
      answer: 1,
      explanation:
        'Deleted files on Windows go to the Recycle Bin first. They are not permanently deleted until you empty the Recycle Bin. This allows you to recover accidentally deleted files.',
    },
  ],
  remediationQuestions: [
    {
      question: 'Which of the following is the BEST file name for a CAT assignment?',
      options: ['my work.docx', 'CAT_Assignment2_Term1_2026.docx', 'document(1).docx', 'CATASSIGNMENT!!!.docx'],
      answer: 1,
      explanation:
        'CAT_Assignment2_Term1_2026.docx is descriptive, includes subject, task number, term, and year. It uses underscores instead of spaces and has no special characters — making it easy to find and sort.',
    },
    {
      question: 'A subfolder is:',
      options: [
        'A file stored inside another file',
        'A folder stored inside another folder',
        'A shortcut to a file on the desktop',
        'A compressed archive of multiple files',
      ],
      answer: 1,
      explanation:
        'A subfolder is a folder that exists inside another folder. This creates a hierarchy — for example, School → CAT → Practicals, where "Practicals" is a subfolder of "CAT".',
    },
  ],
  hardQuestions: [
    {
      question: 'A school\'s file server stores learner files at: \\\\Server\\Grade10\\[Surname]\\[Subject]\\. Nomsa Dlamini\'s CAT file would be at:',
      options: [
        '\\\\Server\\CAT\\Grade10\\Dlamini\\',
        '\\\\Server\\Grade10\\Dlamini\\CAT\\',
        '\\\\Server\\Dlamini\\Grade10\\CAT\\',
        '\\\\CAT\\Server\\Grade10\\Dlamini\\',
      ],
      answer: 1,
      explanation:
        'Following the path structure \\\\Server\\Grade10\\[Surname]\\[Subject]\\, Nomsa Dlamini\'s CAT folder would be at \\\\Server\\Grade10\\Dlamini\\CAT\\. Reading file paths requires following the hierarchy from left to right.',
    },
    {
      question: 'A learner accidentally deletes an important file and empties the Recycle Bin. What is the MOST likely way to recover it?',
      options: [
        'Press Ctrl+Z to undo the deletion',
        'Restore from a backup if one exists',
        'The file can always be recovered from the hard drive',
        'Use the Search function to find it',
      ],
      answer: 1,
      explanation:
        'Once the Recycle Bin is emptied, Ctrl+Z no longer works. The best option is to restore from a backup (e.g. external drive, OneDrive, school server backup). This highlights why regular backups are essential — a key file management principle.',
    },
    {
      question: 'A CAT teacher asks learners to submit files named: Surname_Name_Grade_Subject_Task.extension. Which submission is CORRECTLY named?',
      options: [
        'Thabo Mokoena CAT Practical 1.docx',
        'Mokoena_Thabo_10_CAT_Practical1.docx',
        'CAT_Practical1_Thabo.docx',
        'mokoena thabo grade10 cat.docx',
      ],
      answer: 1,
      explanation:
        'Mokoena_Thabo_10_CAT_Practical1.docx follows the required convention: Surname_Name_Grade_Subject_Task, uses underscores (no spaces), and includes all required fields. File naming conventions are important in CAT practicals.',
    },
    {
      question: 'Which statement about file organisation is MOST correct?',
      options: [
        'Saving all files on the Desktop is the most efficient approach',
        'File extensions can be changed to rename a file type safely',
        'A well-structured folder hierarchy makes files easier to find, back up, and share',
        'Files should be stored only in the root C:\\ directory for quick access',
      ],
      answer: 2,
      explanation:
        'A well-structured folder hierarchy is the foundation of good file management. It makes files easier to locate, ensures proper backups, and simplifies sharing. Storing files on the Desktop or root drive creates clutter and makes management difficult.',
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
function InteractiveStep({ step, index, total, onNext, onPrev }: {
  step: (typeof TOPIC.interactiveSteps)[0]; index: number; total: number; onNext: () => void; onPrev: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-slate-600 flex items-center justify-center">
          <FolderOpen className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Step {index + 1} of {total}</p>
          <h3 className="font-semibold text-slate-800">{step.label}</h3>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {step.tokens.map((token, i) => (
          <span key={i} className={
            ['|', '=', '.', '\\'].includes(token)
              ? 'text-slate-400 font-bold text-lg px-1'
              : ['File', 'Folder', 'Copy', 'Cut', 'Paste', 'Rename', 'Delete', 'Search'].includes(token)
                ? 'bg-slate-600 text-white px-2 py-1 rounded-lg font-bold text-sm'
                : ['.docx', '.xlsx', '.jpg', '.mp3', '.exe', '.pdf', 'C:', 'filename', 'extension'].includes(token)
                  ? 'bg-slate-100 text-slate-800 px-2 py-1 rounded-lg font-semibold text-sm border border-slate-200'
                  : 'bg-slate-100 text-slate-700 px-2 py-1 rounded-lg text-xs font-medium'
          }>
            {token}
          </span>
        ))}
      </div>

      <p className="text-slate-600 text-xs leading-relaxed bg-slate-50 rounded-xl p-3 border border-slate-100">
        {step.explanation}
      </p>

      <div className="flex gap-3">
        <button onClick={onPrev} disabled={index === 0}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>
        <button onClick={onNext}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-600 text-white text-sm hover:bg-slate-700 transition-colors ml-auto">
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
        <div className="w-8 h-8 rounded-xl bg-slate-600 flex items-center justify-center">
          <Lightbulb className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Guided Example · Step {step + 1} of {steps.length}</p>
          <h3 className="font-semibold text-slate-800">Nomsa's Folder Structure</h3>
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
        {step > 0 && (
          <button onClick={() => setStep(s => s - 1)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm hover:bg-slate-50 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
        )}
        <button onClick={() => step < steps.length - 1 ? setStep(s => s + 1) : onFinish()}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-600 text-white text-sm hover:bg-slate-700 transition-colors ml-auto">
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

  function handleReveal() {
    if (selected === null) return;
    setRevealed(true);
    if (selected === q.answer) setScore(s => s + 1);
  }

  function handleNext() {
    if (current + 1 >= questions.length) onComplete(score + (selected === q.answer ? 1 : 0));
    else { setCurrent(c => c + 1); setSelected(null); setRevealed(false); }
  }

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
      {revealed && (
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex gap-3">
          <Lightbulb className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-slate-800">{q.explanation}</p>
        </div>
      )}
      <div className="flex gap-3 justify-end">
        {!revealed ? (
          <button onClick={handleReveal} disabled={selected === null}
            className="px-5 py-2 rounded-lg bg-slate-600 text-white text-sm hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
            Check Answer
          </button>
        ) : (
          <button onClick={handleNext}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-slate-600 text-white text-sm hover:bg-slate-700 transition-colors">
            {current + 1 >= questions.length ? 'See Results' : 'Next Question'} <ChevronRight className="w-4 h-4" />
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
      {mastered
        ? <p className="text-sm text-slate-600">Great work! You can organise files, use correct naming conventions, and navigate file paths.</p>
        : <p className="text-sm text-slate-600">Review the interactive steps and guided example, then try again.</p>
      }
  return (
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
    ctx.beginPath(); ctx.strokeStyle = color; ctx.lineWidth = width; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
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
    linesRef.current = []; redraw();
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
            <select value={width} onChange={e => setWidth(Number(e.target.value))} className="text-xs border border-slate-200 rounded px-1 py-0.5 ml-2">
              {[2, 4, 6, 10].map(w => <option key={w} value={w}>{w}px</option>)}
            </select>
            <button onClick={undo} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"><Undo2 className="w-4 h-4" /></button>
            <button onClick={clear} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"><X className="w-4 h-4" /></button>
          </div>
        </div>
        <canvas ref={canvasRef} width={640} height={400} className="w-full flex-1 cursor-crosshair bg-slate-50 rounded-b-2xl"
          style={{ touchAction: 'none' }}
          onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} />
      </div>
    </div>
  );
}

// ── main page ──────────────────────────────────────────────────────────────
function FileManagementPage({ onNavigate }: { onNavigate: (page: any) => void }) {
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
    setQuizScore(score); setMastered(passed); setAttempts(a => a + 1);
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
              <FolderOpen className="w-6 h-6 text-white" />
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
                  'The difference between files and folders',
                  'File extensions and what they mean (.docx, .xlsx, .jpg)',
                  'How to read and write file paths',
                  'File operations: copy, cut, paste, rename, delete',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />{item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 space-y-3">
              <h2 className="font-semibold text-slate-800 text-sm">Term 1 Topics</h2>
              {[
                { label: 'Computer Systems', page: 'learning-cat-g10-t1-computer-systems' as AppPage },
                { label: 'File Management', page: null },
                { label: 'Word Processing', page: 'learning-cat-g10-t1-word-processing' as AppPage },
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

            <button onClick={() => { setStepIndex(0); setView(ViewState.INTERACTIVE); }}
              className="w-full py-3 rounded-xl bg-slate-600 text-white font-semibold hover:bg-slate-700 transition-colors">
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
            onContinue={() => onNavigate('learning-cat-g10-t1-word-processing' as AppPage)} />
        )}

        {view === ViewState.FEEDBACK && mastered && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-slate-600" />
              <h3 className="font-semibold text-slate-800 text-sm">Challenge Questions</h3>
            </div>
            <p className="text-xs text-slate-500">Test deeper understanding with exam-style questions.</p>
            <button onClick={() => { setQuizQuestions(TOPIC.hardQuestions); setView(ViewState.QUIZ); }}
              className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-medium hover:bg-slate-50 transition-colors">
              Try Challenge Questions
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default FileManagementPage;
