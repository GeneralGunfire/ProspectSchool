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

// ── Quiz data ─────────────────────────────────────────────────────────────────
const QUIZ_DATA: QuizQuestion[] = [
  {
    q: 'What does "simultaneous" mean in the context of equations?',
    options: ['Equations with the same variable', 'Two equations that must both be true at the same time', 'Equations that are added together', 'Equations with no solution'],
    answer: 1,
    explanation: 'Simultaneous equations must both be satisfied by the same values of x and y. The solution is the point that makes BOTH equations true simultaneously.',
  },
  {
    q: 'Using substitution: if y = 2x and x + y = 9, what is x?',
    options: ['x = 2', 'x = 3', 'x = 4', 'x = 6'],
    answer: 1,
    explanation: 'Substitute y = 2x into x + y = 9: x + 2x = 9 → 3x = 9 → x = 3. Then y = 2(3) = 6. Check: 3 + 6 = 9 ✓',
  },
  {
    q: 'Solve: x + y = 7  and  x − y = 1. What is x?',
    options: ['x = 2', 'x = 3', 'x = 4', 'x = 5'],
    answer: 2,
    explanation: 'Adding both equations eliminates y: 2x = 8 → x = 4. Then y = 7 − 4 = 3. Check: 4 + 3 = 7 ✓ and 4 − 3 = 1 ✓',
  },
  {
    q: 'You have 2x + y = 8 and x + y = 5. What is x?',
    options: ['x = 1', 'x = 2', 'x = 3', 'x = 4'],
    answer: 2,
    explanation: 'From eq 2: y = 5 − x. Substitute: 2x + (5 − x) = 8 → x + 5 = 8 → x = 3. Then y = 2.',
  },
  {
    q: 'Why must you verify your solution by substituting into BOTH equations?',
    options: ['It is optional — just one equation is enough', 'To check the solution satisfies both equations, not just one', 'To find the value of a third unknown', 'Verification is only needed for harder problems'],
    answer: 1,
    explanation: 'The solution to simultaneous equations must satisfy BOTH equations. Checking only one equation can give a false positive — always verify in both.',
  },
  {
    q: 'Solve: 3x + y = 11  and  2x − y = 4. What is x?',
    options: ['x = 2', 'x = 3', 'x = 4', 'x = 5'],
    answer: 1,
    explanation: 'Adding equations eliminates y: 5x = 15 → x = 3. Then y = 11 − 9 = 2. Check: 3(3)+2=11 ✓ and 2(3)−2=4 ✓',
  },
  {
    q: 'In the substitution method, after isolating one variable you:',
    options: ['Solve the isolated equation immediately', 'Substitute the expression into the OTHER equation', 'Guess values for the remaining variable', 'Add both equations together'],
    answer: 1,
    explanation: 'In substitution: isolate one variable in one equation, then substitute that expression into the OTHER equation to get a single equation in one unknown.',
  },
]

type AppPage = string
type TopicStatus = 'not-started' | 'mastered' | 'needs-practice'
type ViewState = 'interactive-lesson' | 'guided-practice' | 'practice' | 'remediation' | 'feedback' | 'practice-more'
interface Question { id: string; question: string; math?: string; options: string[]; correctIndex: number; hint: string; explanation: string }

// ── Topic data ─────────────────────────────────────────────────────────────────
const TOPIC = {
  id: 'simultaneous-equations',
  title: 'Simultaneous Equations',
  description: 'Solve two equations with two unknowns — find the values that satisfy both at the same time.',
  interactiveSteps: [
    {
      id: 'sim-1',
      title: 'Two Unknowns, Two Equations',
      content: 'When a problem has two unknown values, one equation is not enough. You need two equations — one for each unknown.',
      equations: ['x + y = 7', 'x − y = 1'],
      bubbleTexts: ['Two mystery numbers (x and y), two clues. Both must be true at the same time.'],
      colors: ['blue' as const],
    },
    {
      id: 'sim-2',
      title: 'The Substitution Method',
      content: 'Isolate one variable from one equation, then substitute that expression into the other equation.',
      equations: ['Step 1:  y = 7 − x  (from eq. 1)', 'Step 2:  x − (7 − x) = 1  (into eq. 2)', 'Step 3:  2x − 7 = 1  →  x = 4'],
      bubbleTexts: [
        'Isolate y from equation 1',
        'Replace y in equation 2 with (7 − x)',
        'Solve for x, then substitute back to find y',
      ],
      colors: ['blue' as const, 'green' as const, 'yellow' as const],
    },
    {
      id: 'sim-3',
      title: 'The Elimination Method',
      content: 'Add or subtract the equations to eliminate one variable. This works best when coefficients already match.',
      equations: ['  x + y = 7', '+  x − y = 1', '─────────────', '2x     = 8  →  x = 4'],
      bubbleTexts: ['Adding the equations makes y disappear — then solve for x directly.'],
      colors: ['green' as const],
    },
    {
      id: 'sim-4',
      title: 'Always Verify Both Equations',
      content: 'Once you have x and y, substitute both values into BOTH original equations to confirm the solution is correct.',
      equations: ['x = 4, y = 3', 'Check eq.1:  4 + 3 = 7  ✓', 'Check eq.2:  4 − 3 = 1  ✓'],
      bubbleTexts: ['Both equations are satisfied — the solution is confirmed correct.'],
      colors: ['green' as const],
    },
  ],
  guidedItem: {
    problem: 'Solve using substitution: x + y = 10  and  x − y = 2',
    steps: [
      { id: 1, instruction: 'Isolate y in equation 1', math: 'y = 10 − x', explanation: 'Rearrange equation 1 to express y on its own — this is what we will substitute.' },
      { id: 2, instruction: 'Substitute into equation 2', math: 'x − (10 − x) = 2', explanation: 'Replace every y in equation 2 with the expression (10 − x) from step 1.' },
      { id: 3, instruction: 'Expand the brackets', math: 'x − 10 + x = 2', explanation: 'Distribute the negative sign: −(10 − x) = −10 + x.' },
      { id: 4, instruction: 'Combine like terms and solve for x', math: '2x − 10 = 2  →  2x = 12  →  x = 6', explanation: 'Add 10 to both sides, then divide by 2 to find x = 6.' },
      { id: 5, instruction: 'Find y by substituting x = 6', math: 'y = 10 − 6  →  y = 4', explanation: 'Use y = 10 − x from step 1 with x = 6.' },
      { id: 6, instruction: 'Verify in both original equations', math: '6 + 4 = 10 ✓   and   6 − 4 = 2 ✓', explanation: 'Both equations are satisfied — the solution x = 6, y = 4 is correct.' },
    ],
  },
  initialQuestions: [
    { id: 'sq1', question: 'What is x?', math: '2x + y = 8  and  x + y = 5', options: ['x = 1', 'x = 2', 'x = 3', 'x = 4'], correctIndex: 2, hint: 'From equation 2: y = 5 − x. Substitute into equation 1.', explanation: 'y = 5 − x → 2x + (5 − x) = 8 → x + 5 = 8 → x = 3. Check: 2(3) + 2 = 8 ✓ and 3 + 2 = 5 ✓' },
    { id: 'sq2', question: 'What is y?', math: 'x + 2y = 7  and  x − y = 1', options: ['y = 1', 'y = 2', 'y = 3', 'y = 4'], correctIndex: 1, hint: 'From equation 2: x = 1 + y. Substitute into equation 1.', explanation: 'x = 1 + y → (1 + y) + 2y = 7 → 1 + 3y = 7 → y = 2. Then x = 3. Check both equations ✓' },
    { id: 'sq3', question: 'What is x?', math: '3x + y = 11  and  2x − y = 4', options: ['x = 2', 'x = 3', 'x = 4', 'x = 5'], correctIndex: 1, hint: 'Try adding both equations to eliminate y.', explanation: 'Adding: 5x = 15 → x = 3. Then y = 11 − 9 = 2. Check: 3(3)+2=11 ✓ and 2(3)−2=4 ✓' },
  ],
  remediationQuestions: [
    { id: 'sr1', question: 'What is x?', math: 'x + y = 6  and  x − y = 2', options: ['x = 4', 'x = 3', 'x = 2', 'x = 5'], correctIndex: 0, hint: 'Add both equations together to eliminate y.', explanation: 'Adding: 2x = 8 → x = 4. Then y = 6 − 4 = 2. Check: 4+2=6 ✓ and 4−2=2 ✓' },
    { id: 'sr2', question: 'What is x?', math: '2x + y = 9  and  x + y = 6', options: ['x = 1', 'x = 2', 'x = 3', 'x = 4'], correctIndex: 2, hint: 'Subtract equation 2 from equation 1.', explanation: 'Subtracting: x = 3. Then y = 6 − 3 = 3. Check: 2(3)+3=9 ✓ and 3+3=6 ✓' },
  ],
  hardQuestions: [
    { id: 'sh1', question: 'Solve for x:', math: '3x + 2y = 12  and  x − y = 4', options: ['x = 2', 'x = 4', 'x = 3', 'x = 5'], correctIndex: 1, hint: 'Isolate y in eq 2 (y = x − 4) then substitute into eq 1.', explanation: '3x + 2(x − 4) = 12 → 5x − 8 = 12 → 5x = 20 → x = 4. Check: 3(4)+2(0)=12 ✓' },
    { id: 'sh2', question: 'Solve for y:', math: '2x + 3y = 13  and  3x − y = 3', options: ['y = 1', 'y = 2', 'y = 3', 'y = 4'], correctIndex: 2, hint: 'Isolate y in eq 2 (y = 3x − 3) and substitute.', explanation: '2x + 3(3x − 3) = 13 → 11x = 22 → x = 2. Then y = 3(2)−3 = 3. Check both ✓' },
    { id: 'sh3', question: 'Solve for x:', math: '4x + y = 14  and  3x + 2y = 13', options: ['x = 2', 'x = 3', 'x = 4', 'x = 1'], correctIndex: 1, hint: 'Isolate y in eq 1 (y = 14 − 4x) and substitute into eq 2.', explanation: '3x + 2(14 − 4x) = 13 → 3x + 28 − 8x = 13 → −5x = −15 → x = 3. Check both ✓' },
  ],
  enrichment: {
    outcomes: [
      'Explain what simultaneous equations are and when they are used',
      'Solve simultaneous equations using the substitution method',
      'Solve simultaneous equations using the elimination method',
      'Verify a solution by substituting into both original equations',
      'Set up simultaneous equations from a word problem',
    ],
    knowledgeChecks: [
      {
        afterStep: 0,
        question: 'Simultaneous equations are used when:',
        options: ['You have one equation and one unknown', 'You have two equations and two unknowns that must both be satisfied', 'You need to find the square root of a number', 'You are working with percentages'],
        correctIndex: 1,
        explanation: 'Simultaneous equations involve two equations that share the same unknowns. The solution is the set of values that satisfies ALL the equations at the same time.',
      },
      {
        afterStep: 2,
        question: 'What is the key advantage of the elimination method?',
        options: ['It works for any pair of equations without rearranging', 'It removes one variable by adding or subtracting equations, leaving a single equation in one unknown', 'It is faster than substitution for all cases', 'It does not require verification'],
        correctIndex: 1,
        explanation: 'The elimination method adds or subtracts the equations to cancel out one variable entirely. This is especially efficient when coefficients already match or can be made to match by multiplying.',
      },
    ],
    examTip: 'For substitution: choose the equation where a variable is already isolated (e.g. y = ...) and substitute into the other. For elimination: multiply equations to make coefficients match, then add or subtract. Always verify your answer in BOTH original equations for full marks.',
    summaryPoints: [
      'Simultaneous equations have two unknowns — you need two equations to solve them',
      'Substitution: express one variable in terms of the other, then substitute into the second equation',
      'Elimination: multiply equations to match coefficients, then add or subtract to eliminate one variable',
      'The solution (x, y) is the point that satisfies both equations simultaneously',
      'Always verify by substituting both values into BOTH original equations',
      'Word problems: identify the two unknowns, name them x and y, write two equations, then solve',
    ],
  },
}

const SUBJECT = 'Algebra'
const GRADE = 10
const TOPIC_ID = 'simultaneous-equations'
const STORAGE_KEY_PREFIX = 'scratchpad_simultaneous_'

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

// ── EquationBubble ────────────────────────────────────────────────────────────
const colorMap = {
  blue:   'bg-stone-50 border-stone-200 text-stone-700',
  green:  'bg-emerald-50 border-emerald-200 text-emerald-800',
  yellow: 'bg-amber-50 border-amber-200 text-amber-800',
}

const EquationBubble = ({ text, color, delay }: { text: string; color: 'blue' | 'green' | 'yellow'; delay: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 6 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.25, delay }}
    className={`rounded-xl border px-4 py-3 text-[13px] font-medium leading-relaxed ${colorMap[color]}`}
  >
    {text}
  </motion.div>
)

// ── InteractiveLesson ─────────────────────────────────────────────────────────
const InteractiveLesson = ({ onComplete }: { onComplete: () => void }) => {
  const [current, setCurrent] = useState(0)
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
            <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? 'bg-[#1e293b] w-10' : i < current ? 'bg-[#1e293b] w-8' : 'bg-stone-200 w-6'}`} />
          ))}
        </div>
      </div>

      {/* Step card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
          className="bg-white rounded-2xl border border-stone-200 shadow-sm"
        >
          <div className="px-6 pt-6 pb-4">
            <h3 className="text-lg font-black text-[#1e293b] leading-tight">{step.title}</h3>
            <p className="text-[15px] text-stone-500 leading-relaxed mt-2">{step.content}</p>
          </div>

          {/* Equation display — left-aligned, natural wrapping, no scrollbar */}
          <div className="mx-4 mb-4">
            <div className="bg-[#EEF2F7] rounded-xl px-5 py-5 border border-stone-200/50 space-y-2">
              {step.equations.map((eq, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.2 }}
                  className="font-mono text-[15px] text-stone-800 font-bold leading-relaxed wrap-break-word"
                >
                  {eq}
                </motion.div>
              ))}
            </div>
            <div className="mt-3 space-y-2">
              {step.bubbleTexts.map((bt, i) => (
                <EquationBubble key={i} text={bt} color={step.colors[i] ?? 'blue'} delay={i * 0.12} />
              ))}
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

      {/* Learning outcomes + exam tip — only on step 0 so they don't repeat */}
      {current === 0 && (
        <div className="space-y-3">
          <LearningOutcomes outcomes={TOPIC.enrichment.outcomes} />
          <ExamTip tip={TOPIC.enrichment.examTip} />
        </div>
      )}

      {isLast && <SummaryCard points={TOPIC.enrichment.summaryPoints} />}

      {/* Navigation */}
      <div className="flex justify-between items-center pt-1">
        <button
          onClick={() => setCurrent(c => c - 1)}
          disabled={current === 0}
          className="flex items-center gap-1.5 text-[13px] font-bold text-stone-400 disabled:opacity-20 hover:text-stone-900 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>
        <button
          onClick={() => isLast ? onComplete() : setCurrent(c => c + 1)}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#1e293b] text-white rounded-xl hover:bg-stone-800 transition-colors font-black text-sm"
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
      <div className="bg-[#1e293b] rounded-2xl p-5">
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
            className={`shrink-0 px-4 py-1.5 rounded-full text-[11px] font-black transition-colors ${i === stepIdx ? 'bg-[#1e293b] text-white' : i < stepIdx ? 'bg-stone-200 text-stone-600 font-bold' : 'bg-stone-100 text-stone-400 font-bold'}`}
          >
            Step {s.id}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4"
        >
          <p className="font-black text-stone-900 text-base leading-snug">{step.instruction}</p>
          <div className="bg-[#EEF2F7] rounded-xl px-5 py-4 border border-stone-200/60">
            <p className="font-mono text-[15px] text-stone-800 font-bold leading-relaxed wrap-break-word">{step.math}</p>
          </div>
          {!revealed ? (
            <button onClick={() => setRevealed(true)} className="w-full py-3 border-2 border-dashed border-stone-200 rounded-xl text-sm font-bold text-stone-400 hover:border-stone-400 hover:text-stone-600 transition-colors">
              Reveal explanation
            </button>
          ) : (
            <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="bg-[#EEF2F7] border border-stone-200/60 rounded-xl p-4">
              <p className="text-[13px] text-stone-700 leading-relaxed">{step.explanation}</p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between items-center">
        <button onClick={() => { setStepIdx(i => i - 1); setRevealed(false) }} disabled={stepIdx === 0} className="flex items-center gap-1.5 text-[13px] font-bold text-stone-400 disabled:opacity-20 hover:text-stone-900 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>
        <button onClick={() => { isLast ? onComplete() : setStepIdx(i => i + 1); setRevealed(false) }} className="flex items-center gap-2 px-6 py-2.5 bg-[#1e293b] text-white rounded-xl hover:bg-stone-800 transition-colors font-black text-sm">
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
    ctx.strokeStyle = tool === 'pen' ? '#1e293b' : '#FAFAF9'
    ctx.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over'
    ctx.lineTo(pos.x, pos.y); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(pos.x, pos.y); lastPos.current = pos
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
        <div className="flex items-center justify-between px-4 py-3 bg-[#1e293b]">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-stone-500 mr-2">Scratchpad</span>
            <button onClick={() => setTool('pen')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${tool === 'pen' ? 'bg-white text-[#1e293b] shadow-sm' : 'text-stone-400 hover:text-white hover:bg-white/10'}`}>
              <PenLine className="w-3.5 h-3.5" /> Pen
            </button>
            <button onClick={() => setTool('eraser')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${tool === 'eraser' ? 'bg-white text-[#1e293b] shadow-sm' : 'text-stone-400 hover:text-white hover:bg-white/10'}`}>
              <Eraser className="w-3.5 h-3.5" /> Eraser
            </button>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={undo} disabled={!history.length} className="p-2 rounded-lg text-stone-500 hover:text-white hover:bg-white/10 disabled:opacity-20 transition-all"><Undo2 className="w-4 h-4" /></button>
            <button onClick={clearAll} aria-label="Clear all answers" className="p-2 rounded-lg text-stone-500 hover:text-red-400 hover:bg-white/10 transition-all"><Trash2 className="w-4 h-4" /></button>
            <div className="w-px h-4 bg-stone-700 mx-1" />
            <button onClick={onClose} aria-label="Close" className="p-2 rounded-lg text-stone-500 hover:text-white hover:bg-white/10 transition-all"><X className="w-4 h-4" /></button>
          </div>
        </div>
        <div className="relative flex-1 bg-[#FAFAF9]">
          <canvas ref={canvasRef} className="w-full h-full touch-none" style={{ cursor: tool === 'pen' ? 'crosshair' : 'cell' }}
            onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerLeave={onPointerUp} />
          <div className="absolute inset-0 pointer-events-none opacity-[0.035]"
            style={{ backgroundImage: 'radial-gradient(circle, #1e293b 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
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

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-black uppercase tracking-[0.22em] text-stone-400">Question {idx + 1} of {questions.length}</span>
          <div className="flex gap-1">
            {questions.map((_, i) => (
              <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i < idx ? 'w-5 bg-[#1e293b]' : i === idx ? 'w-8 bg-[#1e293b]' : 'w-5 bg-stone-200'}`} />
            ))}
          </div>
        </div>
        <button onClick={() => setScratchpadKey(`${STORAGE_KEY_PREFIX}q-${idx}`)} className="flex items-center gap-1.5 text-[11px] font-bold text-stone-400 hover:text-stone-800 border border-stone-200 bg-white rounded-lg px-3 py-1.5 hover:border-stone-400 hover:shadow-sm transition-all">
          <NotebookPen className="w-3 h-3" /> Scratch
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={q.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }} className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="px-6 pt-6 pb-4">
            <p className="font-black text-[#1e293b] text-[17px] leading-snug">{q.question}</p>
            {q.math && (
              <div className="mt-3 bg-[#EEF2F7] rounded-xl px-5 py-4 border border-stone-200/50">
                {q.math.split('  and  ').map((line, i) => (
                  <p key={i} className="font-mono text-[15px] text-stone-800 font-bold leading-relaxed wrap-break-word">
                    {i > 0 ? 'and  ' : ''}{line}
                  </p>
                ))}
              </div>
            )}
          </div>

          <div className="h-px bg-stone-100 mx-6" />

          <div className="px-6 py-4 space-y-2.5">
            {q.options.map((opt, i) => {
              const isCorrect = i === q.correctIndex
              const isSelected = i === selected
              let ctr = 'w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all text-left '
              let lbl = 'w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-black shrink-0 '
              let txt = 'text-[14px] font-medium leading-snug flex-1 '
              if (!confirmed) {
                if (isSelected) { ctr += 'border-[#1e293b] bg-[#1e293b]'; lbl += 'bg-white text-[#1e293b]'; txt += 'text-white font-bold' }
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

          <AnimatePresence>
            {confirmed && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={`mx-6 mb-5 rounded-xl px-4 py-4 border ${selected === q.correctIndex ? 'bg-emerald-50 border-emerald-200' : 'bg-[#EEF2F7] border-stone-200'}`}
              >
                <p className={`text-[10px] font-black uppercase tracking-[0.18em] mb-2 ${selected === q.correctIndex ? 'text-emerald-600' : 'text-stone-400'}`}>
                  {selected === q.correctIndex ? 'Correct!' : 'Explanation'}
                </p>
                <p className={`text-[14px] leading-relaxed ${selected === q.correctIndex ? 'text-emerald-800' : 'text-stone-700'}`}>{q.explanation}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="px-6 py-4 border-t border-stone-100 flex justify-between items-center">
            <span className="text-[11px] text-stone-300 font-medium">
              <span className={`flex items-center gap-1.5 text-[11px] font-bold ${confirmed ? (selected === q.correctIndex ? 'text-emerald-600' : 'text-red-400') : 'text-stone-300'}`}>
              {confirmed && <span className={`w-1.5 h-1.5 rounded-full inline-block ${selected === q.correctIndex ? 'bg-emerald-500' : 'bg-red-400'}`} />}
              {confirmed ? (selected === q.correctIndex ? 'Correct' : 'Incorrect') : 'Select an answer'}
            </span>
            </span>
            {!confirmed
              ? <button onClick={confirm} disabled={selected === null} className="px-5 py-2.5 bg-[#1e293b] text-white rounded-xl disabled:opacity-25 hover:bg-stone-800 font-black text-sm shadow-sm transition-all">Check Answer</button>
              : <button onClick={handleNext} className="flex items-center gap-2 px-5 py-2.5 bg-[#1e293b] text-white rounded-xl hover:bg-stone-800 font-black text-sm shadow-sm transition-all">
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
      <div className="bg-[#1e293b] rounded-3xl p-8 flex flex-col items-center">
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
        <button onClick={onContinue} className="w-full flex items-center justify-center gap-2 px-8 py-3.5 bg-[#1e293b] text-white rounded-xl hover:bg-stone-800 font-black text-sm transition-all">
          Continue <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
function SimultaneousEquationsPage({ onNavigate }: { onNavigate: (page: any) => void }) {
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
    <div className="min-h-screen bg-dash-bg">
      <main className="max-w-3xl mx-auto px-4 pt-24 pb-16">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => onNavigate('library')}
              className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-stone-400 hover:text-stone-900 transition-colors mb-3"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Library
            </button>
            <div className="flex items-center gap-2.5">
              <h1 className="font-black text-[#1e293b] text-xl" style={{ letterSpacing: '-0.02em' }}>{TOPIC.title}</h1>
              {status === 'mastered' && <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700">Mastered</span>}
              {status === 'needs-practice' && <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700">Needs Practice</span>}
            </div>
            <p className="text-[13px] text-stone-400 mt-0.5">Algebra · Grade 10 · Term 1 · Topic 2</p>
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
                    onContinue={() => onNavigate('library')}
                    hidePracticeMore={previousView === 'practice-more'}
                  />
                  <div className="mt-8">
                    <QuizBlock storageKey="algebra-g10-t1-simultaneous" questions={QUIZ_DATA} />
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Quiz always visible at bottom of lesson */}
          {view === 'interactive-lesson' && (
            <QuizBlock storageKey="algebra-g10-t1-simultaneous" questions={QUIZ_DATA} />
          )}
        </div>
      </main>
    </div>
  )
}

export default SimultaneousEquationsPage
