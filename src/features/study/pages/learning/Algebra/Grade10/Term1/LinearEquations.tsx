import { useState, useEffect, useRef, useCallback } from 'react'
import { useStudySession } from '../../../../../../../providers/StudySessionContext'
import { loadTopicProgress as _loadProgress, saveTopicProgress as _saveProgress } from '../../../../../../../lib/studyProgress'
import { motion, AnimatePresence } from 'motion/react'
import {
  ChevronLeft, ChevronRight, ArrowRight, Lightbulb, RotateCcw,
  Award, AlertCircle, PenLine, Eraser, Trash2, Undo2, X, NotebookPen
} from 'lucide-react'
import QuizBlock, { type QuizQuestion } from '../../../../../../../components/QuizBlock'
import { LearningOutcomes, KnowledgeCheck, ExamTip, SummaryCard } from '../../../../../../../components/LessonEnrichment'

// ── Quiz data (7 questions for the "Test Yourself" block) ─────────────────────
const QUIZ_DATA: QuizQuestion[] = [
  {
    q: 'What is a variable in an equation?',
    options: ['A fixed number', 'A letter representing an unknown value', 'The equals sign', 'The answer'],
    answer: 1,
    explanation: 'A variable (like x or y) is a letter that stands for an unknown number we want to find.',
  },
  {
    q: 'Solve for x: 3x + 7 = 22',
    options: ['x = 3', 'x = 5', 'x = 7', 'x = 9'],
    answer: 1,
    explanation: 'Subtract 7 from both sides: 3x = 15. Divide by 3: x = 5. Check: 3(5) + 7 = 22 ✓',
  },
  {
    q: 'What is the first step to solve 2x − 4 = 10?',
    options: ['Divide both sides by 2', 'Add 4 to both sides', 'Subtract 10 from the right', 'Multiply both sides by 2'],
    answer: 1,
    explanation: 'Add 4 to both sides to isolate the term with x: 2x = 14. Then divide by 2: x = 7.',
  },
  {
    q: 'Solve for x: x/4 = 9',
    options: ['x = 36', 'x = 2.25', 'x = 13', 'x = 5'],
    answer: 0,
    explanation: 'Multiply both sides by 4: x = 9 × 4 = 36.',
  },
  {
    q: 'A linear equation in one variable has:',
    options: ['No solution', 'Exactly two solutions', 'Exactly one solution', 'Infinitely many solutions'],
    answer: 2,
    explanation: 'A linear equation in one variable (like 2x + 3 = 7) has exactly one solution.',
  },
  {
    q: 'Solve: 5(x − 2) = 15',
    options: ['x = 1', 'x = 5', 'x = 3', 'x = 7'],
    answer: 1,
    explanation: 'Expand: 5x − 10 = 15. Add 10: 5x = 25. Divide by 5: x = 5.',
  },
  {
    q: 'Which inverse operation undoes multiplication?',
    options: ['Addition', 'Subtraction', 'Division', 'Squaring'],
    answer: 2,
    explanation: 'Division undoes multiplication. To remove a coefficient from a variable, divide both sides by that coefficient.',
  },
]

type AppPage = string
type TopicStatus = 'not-started' | 'mastered' | 'needs-practice'
type ViewState = 'interactive-lesson' | 'guided-practice' | 'practice' | 'remediation' | 'feedback' | 'practice-more'
interface Question { id: string; question: string; math?: string; options: string[]; correctIndex: number; hint: string; explanation: string }

// ── Topic data ─────────────────────────────────────────────────────────────────
const TOPIC = {
  id: 'intro-to-equations',
  title: 'Linear Equations',
  description: 'Solve equations with one unknown using inverse operations — the foundation of all algebra.',
  interactiveSteps: [
    {
      id: 'step-1',
      title: 'What Is a Variable?',
      content: 'A variable is a letter (like x) that represents an unknown number. Algebra is about finding the value of that unknown.',
      math: ['x', '=', '?'],
      bubbles: [{ target: 'x', text: 'The mystery number', pos: 'top' as const }],
    },
    {
      id: 'step-2',
      title: 'The Equation',
      content: 'An equation says two expressions are equal. The = sign is a balance — whatever you do to one side, you must do to the other.',
      math: ['x', '+', '5', '=', '12'],
      bubbles: [
        { target: 'x', text: 'Unknown', pos: 'top' as const },
        { target: '=', text: 'Balance point', pos: 'bottom' as const },
        { target: '12', text: 'Right-hand side', pos: 'top' as const },
      ],
    },
    {
      id: 'step-3',
      title: 'Inverse Operations',
      content: 'To isolate x, undo whatever is being done to it. Addition is undone by subtraction. Multiplication is undone by division.',
      math: ['x', '+', '5', '−', '5', '=', '12', '−', '5'],
      bubbles: [
        { target: '−', text: 'Subtract from both sides', pos: 'top' as const },
        { target: '5', text: 'Same on both sides', pos: 'bottom' as const },
      ],
    },
    {
      id: 'step-4',
      title: 'Verify Your Answer',
      content: 'Always check: substitute your answer back into the original equation. If both sides are equal, you are correct.',
      math: ['x', '=', '7', '→', 'Check:', '7', '+', '5', '=', '12', '✓'],
      bubbles: [{ target: '✓', text: 'Both sides equal!', pos: 'top' as const }],
    },
  ],
  guidedItem: {
    problem: 'Solve step by step: 3x + 7 = 22',
    steps: [
      {
        id: 1,
        instruction: 'Write the equation and identify what is being done to x',
        math: '3x + 7 = 22',
        explanation: 'x is being multiplied by 3, then 7 is added. We need to undo both operations — in reverse order.',
      },
      {
        id: 2,
        instruction: 'Subtract 7 from both sides to remove the +7',
        math: '3x + 7 − 7 = 22 − 7  →  3x = 15',
        explanation: 'Subtracting 7 from both sides keeps the equation balanced and isolates the 3x term.',
      },
      {
        id: 3,
        instruction: 'Divide both sides by 3 to find x',
        math: '3x ÷ 3 = 15 ÷ 3  →  x = 5',
        explanation: 'Dividing by 3 undoes the multiplication. x = 5 is the solution.',
      },
      {
        id: 4,
        instruction: 'Verify: substitute x = 5 into the original equation',
        math: '3(5) + 7 = 15 + 7 = 22 ✓',
        explanation: 'Both sides equal 22 — the answer is confirmed correct.',
      },
    ],
  },
  initialQuestions: [
    { id: 'q1', question: 'What is the first step to solve this equation?', math: 'x + 4 = 10', options: ['Add 4 to both sides', 'Subtract 4 from both sides', 'Multiply both sides by 4', 'Divide both sides by 4'], correctIndex: 1, hint: 'Think: what is the opposite of adding 4?', explanation: 'Subtract 4 from both sides: x + 4 − 4 = 10 − 4 → x = 6. Check: 6 + 4 = 10 ✓' },
    { id: 'q2', question: 'Solve for x:', math: 'x − 2 = 8', options: ['x = 6', 'x = 8', 'x = 10', 'x = 16'], correctIndex: 2, hint: 'Add 2 to both sides to undo the subtraction.', explanation: 'x − 2 + 2 = 8 + 2 → x = 10. Check: 10 − 2 = 8 ✓' },
    { id: 'q3', question: 'Solve for x:', math: '2x = 14', options: ['x = 7', 'x = 12', 'x = 28', 'x = 16'], correctIndex: 0, hint: 'Divide both sides by 2.', explanation: '2x ÷ 2 = 14 ÷ 2 → x = 7. Check: 2(7) = 14 ✓' },
    { id: 'q4', question: 'Solve for x:', math: '4x + 3 = 19', options: ['x = 4', 'x = 5', 'x = 7', 'x = 16'], correctIndex: 0, hint: 'First subtract 3, then divide by 4.', explanation: '4x + 3 − 3 = 19 − 3 → 4x = 16 → x = 4. Check: 4(4) + 3 = 19 ✓' },
  ],
  remediationQuestions: [
    { id: 'r1', question: 'Solve for x:', math: 'x + 3 = 11', options: ['x = 8', 'x = 14', 'x = 3', 'x = 11'], correctIndex: 0, hint: 'Subtract 3 from both sides.', explanation: '11 − 3 = 8, so x = 8. Check: 8 + 3 = 11 ✓' },
    { id: 'r2', question: 'Solve for x:', math: 'x − 4 = 4', options: ['x = 0', 'x = 8', 'x = 4', 'x = 16'], correctIndex: 1, hint: 'Add 4 to both sides.', explanation: '4 + 4 = 8, so x = 8. Check: 8 − 4 = 4 ✓' },
  ],
  hardQuestions: [
    { id: 'h1', question: 'Solve for x:', math: '5x − 12 = 3x + 8', options: ['x = 4', 'x = 10', 'x = 2', 'x = 20'], correctIndex: 1, hint: 'Bring x terms to one side and numbers to the other.', explanation: '5x − 3x = 8 + 12 → 2x = 20 → x = 10. Check: 5(10) − 12 = 38 = 3(10) + 8 ✓' },
    { id: 'h2', question: 'Solve for x:', math: '2(x + 5) = 16', options: ['x = 3', 'x = 8', 'x = 11', 'x = 6'], correctIndex: 0, hint: 'Expand the brackets first: 2x + 10 = 16.', explanation: '2x + 10 = 16 → 2x = 6 → x = 3. Check: 2(3 + 5) = 2(8) = 16 ✓' },
    { id: 'h3', question: 'Solve for x:', math: 'x/3 + 4 = 10', options: ['x = 2', 'x = 6', 'x = 18', 'x = 42'], correctIndex: 2, hint: 'Subtract 4 first, then multiply both sides by 3.', explanation: 'x/3 = 6 → x = 18. Check: 18/3 + 4 = 6 + 4 = 10 ✓' },
    { id: 'h4', question: 'Solve for x:', math: '3(2x − 1) = 2x + 13', options: ['x = 4', 'x = 2', 'x = 8', 'x = 1'], correctIndex: 0, hint: 'Expand first: 6x − 3 = 2x + 13.', explanation: '6x − 3 = 2x + 13 → 4x = 16 → x = 4. Check: 3(8−1) = 21 = 2(4)+13 ✓' },
  ],
  enrichment: {
    outcomes: [
      'Define a variable and explain its role in an equation',
      'Distinguish between an expression and an equation',
      'Solve a linear equation in one variable using inverse operations',
      'Verify a solution by substituting back into the original equation',
      'Solve equations involving fractions and brackets',
    ],
    knowledgeChecks: [
      {
        afterStep: 0,
        question: 'What is a variable in an equation?',
        options: ['A fixed number', 'A symbol (usually a letter) representing an unknown value', 'The answer to the equation', 'A mathematical operation'],
        correctIndex: 1,
        explanation: 'A variable is a letter (like x or y) that represents an unknown quantity. The goal of solving an equation is to find the value of the variable that makes the equation true.',
      },
      {
        afterStep: 2,
        question: 'Solve for x: 3x + 7 = 22',
        options: ['x = 3', 'x = 5', 'x = 7', 'x = 9'],
        correctIndex: 1,
        explanation: '3x + 7 = 22 → 3x = 22 − 7 → 3x = 15 → x = 5. Always check: 3(5) + 7 = 15 + 7 = 22 ✓',
      },
    ],
    examTip: 'Always verify your answer by substituting it back into the original equation. If both sides are equal, your answer is correct. In exams, showing the check step can earn you a method mark even if you made an arithmetic error earlier.',
    summaryPoints: [
      'A linear equation has one variable raised to the power of 1 only',
      'To solve: isolate the variable by performing the same operation on both sides',
      'Additive inverse: add/subtract the same value from both sides',
      'Multiplicative inverse: multiply/divide both sides by the same non-zero value',
      'Always verify your solution by substituting back into the original equation',
      'Equations with fractions: multiply every term by the LCD to clear denominators',
    ],
  },
}

const SUBJECT = 'Algebra'
const GRADE = 10
const TOPIC_ID = 'intro-to-equations'
const STORAGE_KEY_PREFIX = 'scratchpad_linear_'
async function loadTopicProgress(studentId: number): Promise<TopicStatus> {
  const m = await _loadProgress(studentId, SUBJECT, GRADE, TOPIC_ID)
  if (m === 'mastered') return 'mastered'
  if (m === 'needs_practice') return 'needs-practice'
  return 'not-started'
}
async function saveTopicProgress(studentId: number, schoolId: number, status: TopicStatus, correct: number, total: number, attempts: number) {
  const ml = status === 'mastered' ? 'mastered' : status === 'needs-practice' ? 'needs_practice' : 'not_started'
  await _saveProgress(studentId, schoolId, SUBJECT, GRADE, TOPIC_ID, ml, correct, total, attempts)
}

// ── SpeechBubble ──────────────────────────────────────────────────────────────
const SpeechBubble = ({ text, pos }: { text: string; pos: 'top' | 'bottom' }) => (
  <motion.div
    initial={{ scale: 0, opacity: 0, y: pos === 'top' ? 10 : -10 }}
    animate={{ scale: 1, opacity: 1, y: 0 }}
    transition={{ type: 'spring', stiffness: 400, damping: 24 }}
    className={`absolute ${pos === 'top' ? '-top-12' : '-bottom-12'} left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#1C1917] text-white text-xs font-bold px-3 py-2 rounded-xl shadow-lg z-20`}
  >
    {text}
    <div className={`absolute left-1/2 -translate-x-1/2 w-2 h-2 bg-[#1C1917] rotate-45 ${pos === 'top' ? '-bottom-1' : '-top-1'}`} />
  </motion.div>
)

// ── InteractiveLesson ─────────────────────────────────────────────────────────
const InteractiveLesson = ({ onComplete }: { onComplete: () => void }) => {
  const [current, setCurrent] = useState(0)
  const [activeBubble, setActiveBubble] = useState<string | null>(null)
  const step = TOPIC.interactiveSteps[current]
  const isLast = current === TOPIC.interactiveSteps.length - 1
  const kc = TOPIC.enrichment.knowledgeChecks.find(k => k.afterStep === current)

  return (
    <div className="max-w-2xl mx-auto space-y-4">

      {/* Progress row */}
      <div className="flex items-center justify-between py-1">
        <span className="text-[11px] font-black uppercase tracking-[0.18em] text-stone-400">
          Step {current + 1} of {TOPIC.interactiveSteps.length}
        </span>
        <div className="flex gap-1.5 items-center">
          {TOPIC.interactiveSteps.map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? 'bg-[#1C1917] w-10' : i < current ? 'bg-[#1C1917] w-8' : 'bg-stone-200 w-6'}`} />
          ))}
        </div>
      </div>

      {/* Step card — no overflow-hidden so speech bubbles aren't clipped */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
          className="bg-white rounded-2xl border border-stone-200 shadow-sm"
        >
          {/* Title + content */}
          <div className="px-6 pt-6 pb-5">
            <h3 className="text-lg font-black text-[#1C1917] leading-tight">{step.title}</h3>
            <p className="text-[15px] text-stone-500 leading-relaxed mt-2">{step.content}</p>
          </div>

          {/* Math token area */}
          <div className="mx-4 mb-4 bg-[#F5F0E8] rounded-xl px-4 pt-4 pb-6">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-stone-400 mb-6">Tap an element to learn more</p>
            {/* Extra vertical padding so speech bubbles (±48px) have room above/below */}
            <div className="flex items-center justify-center gap-2 flex-wrap" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
              {step.math.map((token, i) => {
                const bubble = step.bubbles.find(b => b.target === token)
                const isActive = activeBubble === `${current}-${token}-${i}`
                return (
                  <div key={i} className="relative">
                    {bubble && isActive && <SpeechBubble text={bubble.text} pos={bubble.pos} />}
                    {bubble ? (
                      <button
                        onClick={() => setActiveBubble(isActive ? null : `${current}-${token}-${i}`)}
                        className={`px-4 py-2.5 rounded-xl font-mono text-lg font-black transition-all ${isActive ? 'bg-[#1C1917] text-white scale-105 shadow-md' : 'bg-white text-stone-800 border border-stone-200 hover:border-stone-400 hover:bg-stone-50'}`}
                      >
                        {token}
                      </button>
                    ) : (
                      <span className="px-1.5 font-mono text-xl font-black text-stone-400 select-none">{token}</span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Inline knowledge check */}
      {kc && (
        <KnowledgeCheck
          key={`kc-${current}`}
          question={kc.question}
          options={kc.options}
          correctIndex={kc.correctIndex}
          explanation={kc.explanation}
        />
      )}

      {/* Learning outcomes + exam tip — only on first step so they don't re-appear */}
      {current === 0 && (
        <div className="space-y-3">
          <LearningOutcomes outcomes={TOPIC.enrichment.outcomes} />
          <ExamTip tip={TOPIC.enrichment.examTip} />
        </div>
      )}

      {/* Summary on last step */}
      {isLast && <SummaryCard points={TOPIC.enrichment.summaryPoints} />}

      {/* Navigation */}
      <div className="flex justify-between items-center pt-1">
        <button
          onClick={() => { setCurrent(c => c - 1); setActiveBubble(null) }}
          disabled={current === 0}
          className="flex items-center gap-1.5 text-[13px] font-bold text-stone-400 disabled:opacity-20 hover:text-stone-900 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>
        <button
          onClick={() => { isLast ? onComplete() : setCurrent(c => c + 1); setActiveBubble(null) }}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#1C1917] text-white rounded-xl hover:bg-stone-800 transition-colors font-black text-sm"
        >
          {isLast ? 'Try a Worked Example' : 'Next'} <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

// ── GuidedPracticeModule ──────────────────────────────────────────────────────
const GuidedPracticeModule = ({ onComplete }: { onComplete: () => void }) => {
  const [stepIdx, setStepIdx] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const { steps, problem } = TOPIC.guidedItem
  const isLast = stepIdx === steps.length - 1
  const step = steps[stepIdx]

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Problem card */}
      <div className="bg-[#1C1917] rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-stone-400 mb-1">Worked Example</p>
            <p className="text-sm text-stone-300 leading-relaxed">{problem}</p>
          </div>
        </div>
      </div>

      {/* Step pills */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {steps.map((s, i) => (
          <button
            key={s.id}
            onClick={() => { setStepIdx(i); setRevealed(false) }}
            className={`shrink-0 px-4 py-1.5 rounded-full text-[11px] font-black transition-colors ${i === stepIdx ? 'bg-[#1C1917] text-white' : i < stepIdx ? 'bg-stone-200 text-stone-600 font-bold' : 'bg-stone-100 text-stone-400 font-bold'}`}
          >
            Step {s.id}
          </button>
        ))}
      </div>

      {/* Step card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4"
        >
          <p className="font-black text-stone-900 text-base leading-snug">{step.instruction}</p>

          {/* Math display — left-aligned, wraps naturally, no overflow scroll */}
          <div className="bg-[#F5F0E8] rounded-xl px-5 py-4 border border-stone-200/60">
            <p className="font-mono text-[15px] text-stone-800 font-bold leading-relaxed wrap-break-word">
              {step.math}
            </p>
          </div>

          {!revealed ? (
            <button
              onClick={() => setRevealed(true)}
              className="w-full py-3 border-2 border-dashed border-stone-200 rounded-xl text-sm font-bold text-stone-400 hover:border-stone-400 hover:text-stone-600 transition-colors"
            >
              Reveal explanation
            </button>
          ) : (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="overflow-hidden"
            >
              <div className="bg-[#F5F0E8] border border-stone-200/60 rounded-xl p-4">
                <p className="text-[13px] text-stone-700 leading-relaxed">{step.explanation}</p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => { setStepIdx(i => i - 1); setRevealed(false) }}
          disabled={stepIdx === 0}
          className="flex items-center gap-1.5 text-[13px] font-bold text-stone-400 disabled:opacity-20 hover:text-stone-900 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>
        <button
          onClick={() => { isLast ? onComplete() : (setStepIdx(i => i + 1), setRevealed(false)) }}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#1C1917] text-white rounded-xl hover:bg-stone-800 transition-colors font-black text-sm"
        >
          {isLast ? 'Start Practice' : 'Next Step'} <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

// ── ScratchpadModal ───────────────────────────────────────────────────────────
const ScratchpadModal = ({ storageKey, onClose }: { storageKey: string; onClose: () => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen')
  const [history, setHistory] = useState<ImageData[]>([])
  const drawing = useRef(false)
  const lastPos = useRef<{ x: number; y: number } | null>(null)

  const getCtx = () => canvasRef.current?.getContext('2d') ?? null

  const saveSnapshot = useCallback(() => {
    const ctx = getCtx(); const c = canvasRef.current
    if (!ctx || !c) return
    setHistory(h => [...h.slice(-29), ctx.getImageData(0, 0, c.width, c.height)])
    localStorage.setItem(storageKey, c.toDataURL())
  }, [storageKey])

  useEffect(() => {
    const c = canvasRef.current; if (!c) return
    const dpr = window.devicePixelRatio || 1
    const rect = c.getBoundingClientRect()
    c.width = rect.width * dpr; c.height = rect.height * dpr
    const ctx = c.getContext('2d')!
    ctx.scale(dpr, dpr); ctx.lineCap = 'round'; ctx.lineJoin = 'round'
    const saved = localStorage.getItem(storageKey)
    if (saved) { const img = new Image(); img.onload = () => ctx.drawImage(img, 0, 0, rect.width, rect.height); img.src = saved }
  }, [storageKey])

  const getPos = (e: React.PointerEvent) => {
    const c = canvasRef.current!; const rect = c.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const onPointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    drawing.current = true; lastPos.current = getPos(e)
    const ctx = getCtx()!; ctx.beginPath(); ctx.moveTo(lastPos.current.x, lastPos.current.y)
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (!drawing.current) return
    const pos = getPos(e); const ctx = getCtx()!
    ctx.lineWidth = tool === 'pen' ? 2.5 : 22
    ctx.strokeStyle = tool === 'pen' ? '#1C1917' : '#FAFAF9'
    ctx.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over'
    ctx.lineTo(pos.x, pos.y); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(pos.x, pos.y)
    lastPos.current = pos
  }

  const onPointerUp = () => { if (!drawing.current) return; drawing.current = false; lastPos.current = null; saveSnapshot() }

  const undo = () => {
    const c = canvasRef.current; const ctx = getCtx()
    if (!ctx || !c) return
    setHistory(h => {
      const next = h.slice(0, -1)
      ctx.clearRect(0, 0, c.width, c.height)
      if (next.length > 0) ctx.putImageData(next[next.length - 1], 0, 0)
      localStorage.setItem(storageKey, c.toDataURL())
      return next
    })
  }

  const clearAll = () => {
    const c = canvasRef.current; const ctx = getCtx()
    if (!ctx || !c) return
    ctx.clearRect(0, 0, c.width, c.height); setHistory([]); localStorage.removeItem(storageKey)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16 }}
        transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden border border-stone-200"
        style={{ height: '480px' }}
      >
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#1C1917]">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-stone-500 mr-2">Scratchpad</span>
            <button onClick={() => setTool('pen')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${tool === 'pen' ? 'bg-white text-[#1C1917] shadow-sm' : 'text-stone-400 hover:text-white hover:bg-white/10'}`}>
              <PenLine className="w-3.5 h-3.5" /> Pen
            </button>
            <button onClick={() => setTool('eraser')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${tool === 'eraser' ? 'bg-white text-[#1C1917] shadow-sm' : 'text-stone-400 hover:text-white hover:bg-white/10'}`}>
              <Eraser className="w-3.5 h-3.5" /> Eraser
            </button>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={undo} disabled={!history.length} className="p-2 rounded-lg text-stone-500 hover:text-white hover:bg-white/10 disabled:opacity-20 transition-all"><Undo2 className="w-4 h-4" /></button>
            <button onClick={clearAll} className="p-2 rounded-lg text-stone-500 hover:text-red-400 hover:bg-white/10 transition-all"><Trash2 className="w-4 h-4" /></button>
            <div className="w-px h-4 bg-stone-700 mx-1" />
            <button onClick={onClose} className="p-2 rounded-lg text-stone-500 hover:text-white hover:bg-white/10 transition-all"><X className="w-4 h-4" /></button>
          </div>
        </div>
        {/* Canvas */}
        <div className="relative flex-1 bg-[#FAFAF9]">
          <canvas
            ref={canvasRef}
            className="w-full h-full touch-none"
            style={{ cursor: tool === 'pen' ? 'crosshair' : 'cell' }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
          />
          <div className="absolute inset-0 pointer-events-none opacity-[0.035]"
            style={{ backgroundImage: 'radial-gradient(circle, #1C1917 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          {history.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <p className="text-xs text-stone-300 font-medium select-none">Draw your working here…</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

// ── PracticeModule ────────────────────────────────────────────────────────────
const LABELS = ['A', 'B', 'C', 'D']

const PracticeModule = ({ questions, onComplete }: { questions: Question[]; onComplete: (res: { correct: number; total: number }) => void }) => {
  const [idx, setIdx] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [confirmed, setConfirmed] = useState(false)
  const [score, setScore] = useState(0)
  const [scratchpadKey, setScratchpadKey] = useState<string | null>(null)
  const q = questions[idx]
  const isLast = idx === questions.length - 1

  const confirm = () => {
    if (selected === null) return
    setConfirmed(true)
    if (selected === q.correctIndex) setScore(s => s + 1)
  }

  const next = () => {
    const finalScore = score + (selected === q.correctIndex && !confirmed ? 1 : confirmed && selected === q.correctIndex ? 0 : 0)
    if (isLast) onComplete({ correct: confirmed && selected === q.correctIndex ? score + 1 : score + (selected === q.correctIndex ? 1 : 0), total: questions.length })
    else { setIdx(i => i + 1); setSelected(null); setConfirmed(false) }
  }

  // Fix: track score properly
  const handleNext = () => {
    if (isLast) {
      const finalScore = score + (confirmed ? 0 : selected === q.correctIndex ? 1 : 0)
      onComplete({ correct: finalScore, total: questions.length })
    } else {
      setIdx(i => i + 1); setSelected(null); setConfirmed(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {scratchpadKey && <ScratchpadModal storageKey={scratchpadKey} onClose={() => setScratchpadKey(null)} />}

      {/* Progress header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-black uppercase tracking-[0.22em] text-stone-400">
            Question {idx + 1} of {questions.length}
          </span>
          <div className="flex gap-1">
            {questions.map((_, i) => (
              <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i < idx ? 'w-5 bg-[#1C1917]' : i === idx ? 'w-8 bg-[#1C1917]' : 'w-5 bg-stone-200'}`} />
            ))}
          </div>
        </div>
        <button
          onClick={() => setScratchpadKey(`${STORAGE_KEY_PREFIX}q-${idx}`)}
          className="flex items-center gap-1.5 text-[11px] font-bold text-stone-400 hover:text-stone-800 border border-stone-200 bg-white rounded-lg px-3 py-1.5 hover:border-stone-400 hover:shadow-sm transition-all"
        >
          <NotebookPen className="w-3 h-3" /> Scratch
        </button>
      </div>

      {/* Question card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={q.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
          className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden"
        >
          {/* Question */}
          <div className="px-6 pt-6 pb-4">
            <p className="font-black text-[#1C1917] text-[17px] leading-snug">{q.question}</p>
            {q.math && (
              <div className="mt-3 bg-[#F5F0E8] rounded-xl px-5 py-4 border border-stone-200/50">
                <p className="font-mono text-[15px] text-stone-800 font-bold leading-relaxed wrap-break-word">
                  {q.math}
                </p>
              </div>
            )}
          </div>

          <div className="h-px bg-stone-100 mx-6" />

          {/* Options */}
          <div className="px-6 py-4 space-y-2.5">
            {q.options.map((opt, i) => {
              const isCorrect = i === q.correctIndex
              const isSelected = i === selected
              let ctr = 'w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all text-left '
              let lbl = 'w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-black shrink-0 transition-all '
              let txt = 'text-[14px] font-medium leading-snug flex-1 '
              if (!confirmed) {
                if (isSelected) { ctr += 'border-[#1C1917] bg-[#1C1917]'; lbl += 'bg-white text-[#1C1917]'; txt += 'text-white font-bold' }
                else { ctr += 'border-stone-200 bg-stone-50/30 hover:border-stone-300 hover:bg-white cursor-pointer'; lbl += 'bg-stone-200 text-stone-500'; txt += 'text-stone-700' }
              } else if (isCorrect) { ctr += 'border-emerald-300 bg-emerald-50'; lbl += 'bg-emerald-500 text-white'; txt += 'text-emerald-900 font-semibold' }
              else if (isSelected) { ctr += 'border-red-200 bg-red-50'; lbl += 'bg-red-400 text-white'; txt += 'text-red-800' }
              else { ctr += 'border-stone-100 bg-white opacity-40'; lbl += 'bg-stone-100 text-stone-300'; txt += 'text-stone-400' }
              return (
                <button key={i} type="button" className={ctr} onClick={() => !confirmed && setSelected(i)}>
                  <span className={lbl}>{confirmed && isCorrect ? '✓' : confirmed && isSelected && !isCorrect ? '✗' : LABELS[i]}</span>
                  <span className={txt}>{opt}</span>
                </button>
              )
            })}
          </div>

          {/* Hint — amber, slides in after selection before confirm */}
          <AnimatePresence>
            {!confirmed && selected !== null && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="mx-6 mb-5"
              >
                <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3.5 flex items-start gap-3">
                  <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-px" />
                  <p className="text-[14px] text-amber-800 leading-relaxed">{q.hint}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Explanation — after confirm */}
          <AnimatePresence>
            {confirmed && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={`mx-6 mb-5 rounded-xl px-4 py-4 border ${selected === q.correctIndex ? 'bg-emerald-50 border-emerald-200' : 'bg-[#F5F0E8] border-stone-200'}`}
              >
                <p className={`text-[10px] font-black uppercase tracking-[0.18em] mb-2 ${selected === q.correctIndex ? 'text-emerald-600' : 'text-stone-400'}`}>
                  {selected === q.correctIndex ? 'Correct!' : 'Explanation'}
                </p>
                <p className={`text-[14px] leading-relaxed ${selected === q.correctIndex ? 'text-emerald-800' : 'text-stone-700'}`}>
                  {q.explanation}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-stone-100 flex justify-between items-center">
            <span className="text-[11px] text-stone-300 font-medium">
              <span className={`flex items-center gap-1.5 text-[11px] font-bold ${confirmed ? (selected === q.correctIndex ? 'text-emerald-600' : 'text-red-400') : 'text-stone-300'}`}>
              {confirmed && <span className={`w-1.5 h-1.5 rounded-full inline-block ${selected === q.correctIndex ? 'bg-emerald-500' : 'bg-red-400'}`} />}
              {confirmed ? (selected === q.correctIndex ? 'Correct' : 'Incorrect') : 'Select an answer'}
            </span>
            </span>
            {!confirmed
              ? <button onClick={confirm} disabled={selected === null} className="px-5 py-2.5 bg-[#1C1917] text-white rounded-xl disabled:opacity-25 hover:bg-stone-800 font-black text-sm shadow-sm transition-all">
                  Check Answer
                </button>
              : <button onClick={handleNext} className="flex items-center gap-2 px-5 py-2.5 bg-[#1C1917] text-white rounded-xl hover:bg-stone-800 font-black text-sm shadow-sm transition-all">
                  {isLast ? 'See Results' : 'Next Question'} <ArrowRight className="w-3.5 h-3.5" />
                </button>
            }
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

// ── FeedbackModule ────────────────────────────────────────────────────────────
const FeedbackModule = ({ correct, total, onRetry, onPracticeMore, onContinue, hidePracticeMore = false }: {
  correct: number; total: number; onRetry: () => void; onPracticeMore: () => void; onContinue: () => void; hidePracticeMore?: boolean
}) => {
  const pct = Math.round((correct / total) * 100)
  const mastered = correct / total >= 2 / 3
  return (
    <div className="max-w-sm mx-auto text-center space-y-8 pt-4">
      <div className="bg-[#1C1917] rounded-3xl p-8 flex flex-col items-center">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${mastered ? 'bg-emerald-500' : 'bg-amber-400'}`}>
          {mastered ? <Award className="w-8 h-8 text-white" /> : <RotateCcw className="w-8 h-8 text-white" />}
        </div>
        <p className="text-5xl font-black text-white tracking-tight">{correct}/{total}</p>
        <p className={`text-sm font-bold mt-2 ${mastered ? 'text-emerald-400' : 'text-amber-400'}`}>
          {pct}% · {mastered ? 'Excellent — Topic Mastered' : "Keep going — you're getting there"}
        </p>
        <div className="w-full mt-4 bg-stone-800 h-1.5 rounded-full overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className={`h-full rounded-full ${mastered ? 'bg-emerald-500' : 'bg-amber-400'}`} />
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <button onClick={onRetry} className="w-full flex items-center justify-center gap-2 px-8 py-3.5 bg-white border border-stone-200 text-stone-700 rounded-xl hover:bg-stone-50 font-bold text-sm transition-all">
          <RotateCcw className="w-4 h-4" /> Try Again
        </button>
        {!hidePracticeMore && (
          <button onClick={onPracticeMore} className="w-full flex items-center justify-center gap-2 px-8 py-3.5 bg-white border border-stone-200 text-stone-700 rounded-xl hover:bg-stone-50 font-bold text-sm transition-all">
            <NotebookPen className="w-4 h-4" /> Challenge Questions
          </button>
        )}
        <button onClick={onContinue} className="w-full flex items-center justify-center gap-2 px-8 py-3.5 bg-[#1C1917] text-white rounded-xl hover:bg-stone-800 font-black text-sm transition-all">
          Continue <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
function LinearEquationsPage({ onNavigate }: { onNavigate: (page: any) => void }) {
  const session = useStudySession()
  const [view, setView] = useState<ViewState>('interactive-lesson')
  const [previousView, setPreviousView] = useState<ViewState | null>(null)
  const [status, setStatus] = useState<TopicStatus>('not-started')
  const [practiceResult, setPracticeResult] = useState<{ correct: number; total: number } | null>(null)
  const [attempts, setAttempts] = useState(0)

  useEffect(() => {
    if (!session) return
    loadTopicProgress(session.student_id).then(s => setStatus(s))
  }, [session])

  const saveProgress = async (newStatus: TopicStatus, res: { correct: number; total: number }) => {
    const next = attempts + 1; setAttempts(next)
    if (session) await saveTopicProgress(session.student_id, session.school_id, newStatus, res.correct, res.total, next)
  }

  const handlePracticeComplete = async (res: { correct: number; total: number }) => {
    setPracticeResult(res); setPreviousView('practice')
    if (res.correct === 0) { setView('remediation'); return }
    const s: TopicStatus = res.correct / res.total >= 2 / 3 ? 'mastered' : 'needs-practice'
    setStatus(s); await saveProgress(s, res); setView('feedback')
  }

  const handleRemediationComplete = async (res: { correct: number; total: number }) => {
    setPracticeResult(res); setPreviousView('remediation')
    const s: TopicStatus = res.correct / res.total >= 2 / 3 ? 'mastered' : 'needs-practice'
    setStatus(s); await saveProgress(s, res); setView('feedback')
  }

  const handlePracticeMoreComplete = async (res: { correct: number; total: number }) => {
    setPracticeResult(res); setPreviousView('practice-more')
    const s: TopicStatus = res.correct / res.total >= 2 / 3 ? 'mastered' : 'needs-practice'
    setStatus(s); await saveProgress(s, res); setView('feedback')
  }

  return (
    <div className="min-h-screen" style={{ background: '#F5F0E8' }}>
      <main className="max-w-3xl mx-auto px-4 pt-24 pb-16">
        <div className="max-w-2xl mx-auto">

          {/* Header — breadcrumb + topic title */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <button
                onClick={() => onNavigate('library')}
                className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-stone-400 hover:text-stone-900 transition-colors mb-3"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Library
              </button>
              <div className="flex items-center gap-2.5">
                <h1 className="font-black text-[#1C1917] text-xl" style={{ letterSpacing: '-0.02em' }}>{TOPIC.title}</h1>
                {status === 'mastered' && <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700">Mastered</span>}
                {status === 'needs-practice' && <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700">Needs Practice</span>}
              </div>
              <p className="text-[13px] text-stone-400 mt-0.5">Algebra · Grade 10 · Term 1 · Topic 1</p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={view} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }}>
              {view === 'interactive-lesson' && <InteractiveLesson onComplete={() => setView('guided-practice')} />}
              {view === 'guided-practice' && <GuidedPracticeModule onComplete={() => setView('practice')} />}
              {view === 'practice' && <PracticeModule questions={TOPIC.initialQuestions} onComplete={handlePracticeComplete} />}
              {view === 'practice-more' && <PracticeModule questions={TOPIC.hardQuestions} onComplete={handlePracticeMoreComplete} />}
              {view === 'remediation' && (
                <div className="space-y-4">
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-black text-stone-900 mb-0.5">Let's build confidence first</p>
                      <p className="text-[13px] text-amber-800 leading-relaxed">Work through these simpler questions before trying again.</p>
                    </div>
                  </div>
                  <PracticeModule questions={TOPIC.remediationQuestions} onComplete={handleRemediationComplete} />
                </div>
              )}
              {view === 'feedback' && (
                <>
                  <FeedbackModule
                    correct={practiceResult?.correct ?? 0}
                    total={practiceResult?.total ?? (previousView === 'practice-more' ? TOPIC.hardQuestions.length : TOPIC.initialQuestions.length)}
                    onRetry={() => setView('interactive-lesson')}
                    onPracticeMore={() => setView('practice-more')}
                    onContinue={() => onNavigate('learning-algebra-g10-t1-simultaneous')}
                    hidePracticeMore={previousView === 'practice-more'}
                  />
                  <QuizBlock storageKey="algebra-g10-t1-linear" questions={QUIZ_DATA} />
                </>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Quiz always accessible from lesson view */}
          {view === 'interactive-lesson' && (
            <QuizBlock storageKey="algebra-g10-t1-linear" questions={QUIZ_DATA} />
          )}

        </div>
      </main>
    </div>
  )
}

export default LinearEquationsPage
