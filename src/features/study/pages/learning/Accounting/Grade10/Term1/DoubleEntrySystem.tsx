import { useState, useEffect, useRef, useCallback } from 'react'
import { useStudySession } from '../../../../../../../providers/StudySessionContext'
import { loadTopicProgress as _loadProgress, saveTopicProgress as _saveProgress } from '../../../../../../../lib/studyProgress'
import { motion, AnimatePresence } from 'motion/react'
import {
  ChevronLeft, ChevronRight, ArrowRight, Lightbulb, RotateCcw,
  Award, AlertCircle, Info, PenLine, Eraser, Trash2, Undo2, X, NotebookPen
} from 'lucide-react'

type TopicStatus = 'not-started' | 'mastered' | 'needs-practice'
type ViewState = 'overview' | 'interactive-lesson' | 'guided-practice' | 'practice' | 'remediation' | 'feedback' | 'practice-more'
interface Question { id: string; question: string; math?: string; options: string[]; correctIndex: number; hint: string; explanation: string }

const TOPIC = {
  id: 'double-entry-system',
  title: 'The Double-Entry System',
  description: 'Every transaction has two sides — a debit and a credit of equal value.',
  interactiveSteps: [
    {
      id: 'step-1', title: 'What Is Double-Entry?', content: 'Double-entry bookkeeping records every financial transaction in at least two accounts. For every debit entry there must be an equal and opposite credit entry. This keeps the accounting equation balanced and reduces errors.',
      math: ['Debit', '=', 'Credit'],
      bubbles: [{ target: 'Debit', text: 'Left side of account', pos: 'top' as const }, { target: 'Credit', text: 'Right side of account', pos: 'bottom' as const }]
    },
    {
      id: 'step-2', title: 'The "T" Account', content: 'A T-account is the simplest way to record transactions. The account name is at the top. The left side is the Debit (Dr) side and the right side is the Credit (Cr) side. The balance is the difference between total debits and total credits.',
      math: ['Dr', '|', 'Account', '|', 'Cr'],
      bubbles: [{ target: 'Dr', text: 'Debits on the left', pos: 'top' as const }, { target: 'Cr', text: 'Credits on the right', pos: 'bottom' as const }]
    },
    {
      id: 'step-3', title: 'Normal Balances', content: 'Assets and expenses normally have debit balances — they increase with a debit. Liabilities, equity, and revenue normally have credit balances — they increase with a credit. This is summarised by the acronym DEAD CLIC: Debits increase Expenses, Assets, Drawings; Credits increase Liabilities, Income, Capital.',
      math: ['DEAD', 'vs', 'CLIC'],
      bubbles: [{ target: 'DEAD', text: 'Dr: Expenses, Assets, Drawings', pos: 'top' as const }, { target: 'CLIC', text: 'Cr: Liabilities, Income, Capital', pos: 'bottom' as const }]
    },
    {
      id: 'step-4', title: 'Recording a Transaction', content: 'When a business buys equipment for cash, two accounts are affected: Equipment (asset) increases → debit Equipment. Cash (asset) decreases → credit Cash. Both entries are equal in rand value. The total debits still equal total credits.',
      math: ['Dr Equipment', '|', 'Cr Cash'],
      bubbles: [{ target: 'Dr Equipment', text: 'Asset increases', pos: 'top' as const }, { target: 'Cr Cash', text: 'Asset decreases', pos: 'bottom' as const }]
    },
  ],
  guidedItem: {
    problem: 'Thabo\'s business receives R8 000 cash from a customer as payment for services rendered. Record this transaction using the double-entry system.',
    steps: [
      { id: 1, instruction: 'Identify the two accounts affected', math: '1. Cash (asset)   2. Service Revenue (income)', explanation: 'Cash comes into the business — cash increases. The business earned money by rendering services — service revenue increases. These are the two accounts affected.' },
      { id: 2, instruction: 'Apply DEAD CLIC to determine debit/credit', math: 'Cash = Asset → Dr (increases)   Revenue = Income → Cr (increases)', explanation: 'Using DEAD CLIC: Assets increase with a debit, so Cash is debited. Income increases with a credit, so Service Revenue is credited.' },
      { id: 3, instruction: 'Write the journal entry', math: 'Dr Cash R8 000  |  Cr Service Revenue R8 000', explanation: 'The entry debits Cash R8 000 (asset increases) and credits Service Revenue R8 000 (income increases). Debit total equals credit total — the equation stays balanced.' },
    ]
  },
  initialQuestions: [
    {
      id: 'q1', question: 'Which side of a T-account records debits?', math: '',
      options: ['Right side', 'Left side', 'Top of the account', 'Bottom of the account'],
      correctIndex: 1, hint: 'Think of the letter T — left and right.',
      explanation: 'Debits are always recorded on the left side of a T-account. Credits are always recorded on the right side. This is a fundamental rule that never changes regardless of the account type.'
    },
    {
      id: 'q2', question: 'A business pays R5 000 cash to repay a bank loan. Which journal entry is correct?', math: '',
      options: ['Dr Bank Loan R5 000 | Cr Cash R5 000', 'Dr Cash R5 000 | Cr Bank Loan R5 000', 'Dr Expense R5 000 | Cr Cash R5 000', 'Dr Cash R5 000 | Cr Capital R5 000'],
      correctIndex: 0, hint: 'Paying off a loan reduces a liability and reduces cash (an asset).',
      explanation: 'Paying a loan: the liability (Bank Loan) decreases, so it is debited. Cash (asset) decreases, so it is credited. Dr Bank Loan R5 000 | Cr Cash R5 000 is correct.'
    },
    {
      id: 'q3', question: 'According to DEAD CLIC, which accounts have a normal CREDIT balance?', math: '',
      options: ['Assets, Expenses, Drawings', 'Liabilities, Income, Capital', 'Cash, Debtors, Equipment', 'Expenses, Drawings, Revenue'],
      correctIndex: 1, hint: 'CLIC stands for the accounts that increase on the credit side.',
      explanation: 'CLIC: Liabilities, Income (Revenue), and Capital (Equity) normally have credit balances — they increase with a credit entry. DEAD accounts (Expenses, Assets, Drawings) have normal debit balances.'
    },
    {
      id: 'q4', question: 'The owner invests R15 000 cash into the business. What is the correct entry?', math: '',
      options: ['Dr Drawings R15 000 | Cr Cash R15 000', 'Dr Cash R15 000 | Cr Capital R15 000', 'Dr Capital R15 000 | Cr Cash R15 000', 'Dr Cash R15 000 | Cr Revenue R15 000'],
      correctIndex: 1, hint: 'Cash comes IN (asset increases → debit). The owner\'s capital grows (equity increases → credit).',
      explanation: 'Owner invests cash: Cash (asset) increases → debit Cash. Capital (equity) increases → credit Capital. Entry: Dr Cash R15 000 | Cr Capital R15 000.'
    },
  ],
  remediationQuestions: [
    {
      id: 'r1', question: 'A business buys office supplies for R1 200 cash. Which account is DEBITED?', math: '',
      options: ['Cash', 'Office Supplies (Expense)', 'Capital', 'Revenue'],
      correctIndex: 1, hint: 'An expense increases when debited. Cash decreases when credited.',
      explanation: 'Buying supplies for cash: Office Supplies (expense) increases → debit. Cash (asset) decreases → credit. The expense account is debited.'
    },
    {
      id: 'r2', question: 'In double-entry bookkeeping, when total debits equal total credits, the books are said to be:', math: '',
      options: ['Profitable', 'In balance', 'Overstated', 'Audited'],
      correctIndex: 1, hint: 'The fundamental rule of double-entry ensures this.',
      explanation: 'When total debits equal total credits, the books are in balance. This is the core principle of double-entry bookkeeping — every transaction keeps the accounting equation balanced.'
    },
  ],
  hardQuestions: [
    {
      id: 'h1', question: 'A business sells goods on credit for R12 000 (cost price R7 000). Which entries are needed?', math: '',
      options: [
        'Dr Cash R12 000 | Cr Revenue R12 000',
        'Dr Debtors R12 000 | Cr Revenue R12 000  AND  Dr Cost of Sales R7 000 | Cr Inventory R7 000',
        'Dr Revenue R12 000 | Cr Debtors R12 000',
        'Dr Inventory R7 000 | Cr Cash R7 000'
      ],
      correctIndex: 1, hint: 'Credit sales create a debtor (not cash). Also record the cost of the goods sold.',
      explanation: 'Two journal entries: (1) Dr Debtors R12 000 | Cr Revenue R12 000 — records the credit sale. (2) Dr Cost of Sales R7 000 | Cr Inventory R7 000 — removes the goods from inventory and records the cost. Both are needed for a complete record.'
    },
    {
      id: 'h2', question: 'The business pays R4 500 for a two-year insurance policy. In the current year, R1 500 is the expense and the rest is prepaid. What is the correct treatment?', math: '',
      options: [
        'Dr Insurance Expense R4 500 | Cr Cash R4 500',
        'Dr Insurance Expense R1 500 | Cr Cash R4 500 — this leaves the books unbalanced',
        'Dr Insurance Expense R1 500 + Dr Prepaid Insurance R3 000 | Cr Cash R4 500',
        'Dr Prepaid Insurance R4 500 | Cr Cash R4 500 only'
      ],
      correctIndex: 2, hint: 'Split the payment: the portion used this year is an expense; the rest is an asset (prepaid).',
      explanation: 'Of the R4 500, only R1 500 relates to the current year (expense). The remaining R3 000 is a prepaid asset (future benefit). Entry: Dr Insurance Expense R1 500 + Dr Prepaid Insurance R3 000 | Cr Cash R4 500. Total debits = total credits = R4 500.'
    },
    {
      id: 'h3', question: 'At month-end, the Cash T-account shows: Debits R42 000 and Credits R27 500. What is the closing balance and on which side?', math: '',
      options: ['R14 500 credit balance', 'R69 500 debit balance', 'R14 500 debit balance', 'R27 500 credit balance'],
      correctIndex: 2, hint: 'Balance = larger side minus smaller side; balance sits on the larger side.',
      explanation: 'Cash balance = R42 000 (Dr) − R27 500 (Cr) = R14 500 debit balance. Cash is an asset and normally has a debit balance. The closing balance of R14 500 is carried down on the debit side.'
    },
    {
      id: 'h4', question: 'Which of the following errors would NOT be revealed by a trial balance?', math: '',
      options: [
        'A transaction recorded with the wrong rand amount on both sides',
        'A debit entry with no corresponding credit entry',
        'A transaction posted to the wrong account type on both sides',
        'A credit total exceeding the debit total'
      ],
      correctIndex: 0, hint: 'The trial balance checks that total debits = total credits — not that the CORRECT accounts were used.',
      explanation: 'If the wrong amount is used but the same wrong amount is debited AND credited, total debits still equal total credits — so the trial balance will still balance and the error goes undetected. This is an "error of original entry."'
    },
  ],
}

const SUBJECT = 'Accounting'
const GRADE = 10
const TOPIC_ID = 'double-entry-system'
const NEXT_TOPIC_ID = 'source-documents'
const STORAGE_KEY_PREFIX = 'scratchpad_double-entry_'

function SpeechBubble({ text, position }: { text: string; position: 'top' | 'bottom' }) {
  return (
    <motion.div initial={{ opacity: 0, y: position === 'top' ? 8 : -8 }} animate={{ opacity: 1, y: 0 }} className={`absolute ${position === 'top' ? '-top-12' : '-bottom-12'} left-1/2 -translate-x-1/2 z-10`}>
      <div className="bg-slate-800 text-white text-xs rounded-lg px-3 py-1.5 whitespace-nowrap shadow-lg">
        {text}
        <div className={`absolute left-1/2 -translate-x-1/2 w-0 h-0 ${position === 'top' ? 'top-full border-t-8 border-t-slate-800 border-x-4 border-x-transparent' : 'bottom-full border-b-8 border-b-slate-800 border-x-4 border-x-transparent'}`} />
      </div>
    </motion.div>
  )
}

function InteractiveLesson({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0)
  const [activeBubble, setActiveBubble] = useState<string | null>(null)
  const current = TOPIC.interactiveSteps[step]

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between text-sm text-slate-500">
        <span>Step {step + 1} of {TOPIC.interactiveSteps.length}</span>
        <div className="flex gap-1.5">
          {TOPIC.interactiveSteps.map((_, i) => (
            <div key={i} className={`h-1.5 w-8 rounded-full transition-colors ${i <= step ? 'bg-slate-500' : 'bg-slate-200'}`} />
          ))}
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={current.id} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
          <h3 className="text-xl font-semibold text-slate-900">{current.title}</h3>
          <p className="text-slate-600 leading-relaxed">{current.content}</p>
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-4">Tap an element to learn more</p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              {current.math.map((token, i) => {
                const bubble = current.bubbles.find(b => b.target === token)
                const isActive = activeBubble === token
                  return (
                  <div key={i} className="relative">
                    {bubble && isActive && <SpeechBubble text={bubble.text} position={bubble.pos} />}
                    <button onClick={() => setActiveBubble(isActive ? null : token)}
                      className={`px-4 py-2 rounded-lg font-mono text-base font-semibold transition-all ${bubble ? (isActive ? 'bg-slate-600 text-white shadow-md scale-105' : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100') : 'bg-white text-slate-400 border border-slate-200 cursor-default text-lg'}`}>
                      {token}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      <div className="flex justify-between">
        <button onClick={() => { setStep(s => s - 1); setActiveBubble(null) }} disabled={step === 0} className="flex items-center gap-2 px-4 py-2 text-slate-600 disabled:opacity-30 hover:text-slate-900 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>
        {step < TOPIC.interactiveSteps.length - 1
          ? <button onClick={() => { setStep(s => s + 1); setActiveBubble(null) }} className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-700 transition-colors font-medium">
              Next <ChevronRight className="w-4 h-4" />
            </button>
          : <button onClick={onComplete} className="flex items-center gap-2 px-5 py-2.5 bg-slate-600 text-white rounded-xl hover:bg-slate-700 transition-colors font-medium">
              Try a Worked Example <ArrowRight className="w-4 h-4" />
            </button>
        }
      </div>
    </div>
  )
}

function ScratchpadModal({ stepKey, onClose }: { stepKey: string; onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen')
  const [history, setHistory] = useState<ImageData[]>([])
  const lastPos = useRef<{ x: number; y: number } | null>(null)
  const storageKey = STORAGE_KEY_PREFIX + stepKey

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return
    const ctx = canvas.getContext('2d'); if (!ctx) return
    canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight
    ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, canvas.width, canvas.height)
    const saved = localStorage.getItem(storageKey)
    if (saved) { const img = new Image(); img.onload = () => ctx.drawImage(img, 0, 0); img.src = saved }
  }, [storageKey])

  const getPos = (e: React.PointerEvent) => { const r = canvasRef.current!.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top } }
  const saveHistory = useCallback(() => { const canvas = canvasRef.current; const ctx = canvas?.getContext('2d'); if (!canvas || !ctx) return; setHistory(h => [...h.slice(-29), ctx.getImageData(0, 0, canvas.width, canvas.height)]) }, [])
  const onPointerDown = (e: React.PointerEvent) => { saveHistory(); setIsDrawing(true); lastPos.current = getPos(e); canvasRef.current?.setPointerCapture(e.pointerId) }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDrawing || !lastPos.current) return
    const canvas = canvasRef.current; const ctx = canvas?.getContext('2d'); if (!canvas || !ctx) return
    const pos = getPos(e); ctx.beginPath(); ctx.moveTo(lastPos.current.x, lastPos.current.y); ctx.lineTo(pos.x, pos.y)
    ctx.strokeStyle = tool === 'pen' ? '#1e293b' : '#ffffff'; ctx.lineWidth = tool === 'pen' ? 2 : 18; ctx.lineCap = 'round'; ctx.stroke(); lastPos.current = pos
  }
  const onPointerUp = () => { setIsDrawing(false); lastPos.current = null; const canvas = canvasRef.current; if (canvas) localStorage.setItem(storageKey, canvas.toDataURL()) }
  const undo = () => { if (!history.length) return; const canvas = canvasRef.current; const ctx = canvas?.getContext('2d'); if (!canvas || !ctx) return; ctx.putImageData(history[history.length - 1], 0, 0); setHistory(h => h.slice(0, -1)); localStorage.setItem(storageKey, canvas.toDataURL()) }
  const clear = () => { const canvas = canvasRef.current; const ctx = canvas?.getContext('2d'); if (!canvas || !ctx) return; saveHistory(); ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, canvas.width, canvas.height); localStorage.removeItem(storageKey) }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col" style={{ height: '520px' }}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
          <span className="font-semibold text-slate-800 text-sm">Scratchpad</span>
          <div className="flex items-center gap-2">
            <button onClick={() => setTool('pen')} className={`p-1.5 rounded-lg transition-colors ${tool === 'pen' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'}`}><PenLine className="w-4 h-4" /></button>
            <button onClick={() => setTool('eraser')} className={`p-1.5 rounded-lg transition-colors ${tool === 'eraser' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'}`}><Eraser className="w-4 h-4" /></button>
            <button onClick={undo} disabled={!history.length} className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-30 transition-colors"><Undo2 className="w-4 h-4" /></button>
            <button onClick={clear} className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"><Trash2 className="w-4 h-4" /></button>
            <button onClick={onClose} className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"><X className="w-4 h-4" /></button>
          </div>
        </div>
        <canvas ref={canvasRef} className="flex-1 w-full cursor-crosshair rounded-b-2xl touch-none" onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} />
      </motion.div>
    </div>
  )
}

function GuidedPracticeModule({ onComplete }: { onComplete: () => void }) {
  const [stepIdx, setStepIdx] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [scratchpadStep, setScratchpadStep] = useState<string | null>(null)
  const step = TOPIC.guidedItem.steps[stepIdx]
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {scratchpadStep && <ScratchpadModal stepKey={scratchpadStep} onClose={() => setScratchpadStep(null)} />}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-slate-600 mt-0.5 shrink-0" />
          <div>
            <p className="font-medium text-slate-900 text-sm mb-1">Worked Example</p>
            <p className="text-slate-800 text-xs leading-relaxed">{TOPIC.guidedItem.problem}</p>
          </div>
        </div>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {TOPIC.guidedItem.steps.map((s, i) => (
          <button key={s.id} onClick={() => { setStepIdx(i); setRevealed(false) }}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${i === stepIdx ? 'bg-slate-900 text-white' : i < stepIdx ? 'bg-slate-100 text-slate-700' : 'bg-slate-100 text-slate-500'}`}>
            Step {s.id}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={step.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
          <div className="flex items-start justify-between gap-4">
            <p className="font-medium text-slate-800">{step.instruction}</p>
            <button onClick={() => setScratchpadStep(`step-${step.id}`)} className="shrink-0 flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-700 transition-colors border border-slate-200 rounded-lg px-2 py-1">
              <NotebookPen className="w-3.5 h-3.5" /> Notes
            </button>
          </div>
          <div className="bg-slate-50 rounded-xl px-5 py-4 font-mono text-sm text-slate-700 text-center">{step.math}</div>
          {!revealed
            ? <button onClick={() => setRevealed(true)} className="w-full py-2.5 border-2 border-dashed border-slate-200 rounded-xl text-sm text-slate-400 hover:border-slate-300 hover:text-slate-600 transition-colors">Reveal explanation</button>
            : <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                <p className="text-slate-800 text-xs leading-relaxed">{step.explanation}</p>
              </motion.div>
          }
        </motion.div>
      </AnimatePresence>
      <div className="flex justify-between">
        <button onClick={() => { setStepIdx(s => s - 1); setRevealed(false) }} disabled={stepIdx === 0} className="flex items-center gap-2 px-4 py-2 text-slate-600 disabled:opacity-30 hover:text-slate-900 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>
        {stepIdx < TOPIC.guidedItem.steps.length - 1
          ? <button onClick={() => { setStepIdx(s => s + 1); setRevealed(false) }} className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-700 transition-colors font-medium">
              Next Step <ChevronRight className="w-4 h-4" />
            </button>
          : <button onClick={onComplete} className="flex items-center gap-2 px-5 py-2.5 bg-slate-600 text-white rounded-xl hover:bg-slate-700 transition-colors font-medium">
              Start Practice <ArrowRight className="w-4 h-4" />
            </button>
        }
      </div>
    </div>
  )
}

function PracticeModule({ questions, onComplete, allowScratchpad = true }: { questions: Question[]; onComplete: (score: number) => void; allowScratchpad?: boolean }) {
  const [idx, setIdx] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [confirmed, setConfirmed] = useState(false)
  const [score, setScore] = useState(0)
  const [scratchpadQ, setScratchpadQ] = useState<string | null>(null)
  const q = questions[idx]

  const confirm = () => { if (selected === null) return; setConfirmed(true); if (selected === q.correctIndex) setScore(s => s + 1) }
  const next = () => { if (idx < questions.length - 1) { setIdx(i => i + 1); setSelected(null); setConfirmed(false) } else onComplete(score + (selected === q.correctIndex ? 1 : 0)) }

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {scratchpadQ && <ScratchpadModal stepKey={scratchpadQ} onClose={() => setScratchpadQ(null)} />}
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-500">Question {idx + 1} of {questions.length}</span>
        {allowScratchpad && (
          <button onClick={() => setScratchpadQ(`q-${q.id}`)} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-700 transition-colors border border-slate-200 rounded-lg px-2 py-1">
            <NotebookPen className="w-3.5 h-3.5" /> Scratchpad
          </button>
        )}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={q.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
          <p className="font-medium text-slate-900 leading-relaxed">{q.question}</p>
          {q.math && <div className="bg-slate-50 rounded-xl px-4 py-3 font-mono text-sm text-slate-700 text-center">{q.math}</div>}
          <div className="space-y-2.5">
            {q.options.map((opt, i) => {
              const isCorrect = i === q.correctIndex; const isSelected = i === selected
              let cls = 'w-full text-left px-3 py-2 rounded-xl border-2 text-xs transition-all '
              if (!confirmed) cls += isSelected ? 'border-slate-800 bg-slate-50 font-medium' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              else if (isCorrect) cls += 'border-slate-500 bg-slate-50 text-slate-800 font-medium'
              else if (isSelected) cls += 'border-slate-400 bg-slate-50 text-slate-800'
              else cls += 'border-slate-200 text-slate-400'
            })}
          </div>
          {!confirmed && selected !== null && (
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-start gap-2">
              <Info className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
              <p className="text-slate-700 text-xs">{q.hint}</p>
            </div>
          )}
          {confirmed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`rounded-xl p-3 ${selected === q.correctIndex ? 'bg-slate-50 border border-slate-100' : 'bg-slate-50 border border-slate-100'}`}>
              <p className={`text-xs leading-relaxed ${selected === q.correctIndex ? 'text-slate-800' : 'text-slate-800'}`}>{q.explanation}</p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
      <div className="flex justify-end">
        {!confirmed
          ? <button onClick={confirm} disabled={selected === null} className="px-5 py-2.5 bg-slate-900 text-white rounded-xl disabled:opacity-30 hover:bg-slate-700 transition-colors font-medium">Check Answer</button>
          : <button onClick={next} className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-700 transition-colors font-medium">
              {idx < questions.length - 1 ? 'Next Question' : 'See Results'} <ArrowRight className="w-4 h-4" />
            </button>
        }
      </div>
    </div>
  )
}

function FeedbackModule({ score, total, onRetry, onContinue, nextTopicName }: { score: number; total: number; onRetry: () => void; onContinue: () => void; nextTopicName: string }) {
  const pct = score / total
  const mastered = pct >= 2 / 3
  return (
    <div className="max-w-md mx-auto text-center space-y-6">
      <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto ${mastered ? 'bg-slate-100' : 'bg-slate-100'}`}>
        {mastered ? <Award className="w-10 h-10 text-slate-600" /> : <AlertCircle className="w-10 h-10 text-slate-600" />}
      </div>
      <div>
        <p className="text-3xl font-bold text-slate-900">{score}/{total}</p>
        <p className="text-slate-500 mt-1">{mastered ? 'Mastered!' : 'Keep practising'}</p>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${pct * 100}%` }} className={`h-full rounded-full ${mastered ? 'bg-slate-500' : 'bg-slate-400'}`} />
      </div>
      <div className="flex flex-col gap-3">
        {mastered
          ? <button onClick={onContinue} className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-600 text-white rounded-xl hover:bg-slate-700 transition-colors font-medium">
              Next: {nextTopicName} <ArrowRight className="w-4 h-4" />
            </button>
          : <>
              <button onClick={onRetry} className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-700 transition-colors font-medium">
                <RotateCcw className="w-4 h-4" /> Try Again
              </button>
              <button onClick={onContinue} className="px-6 py-2.5 text-slate-600 hover:text-slate-900 transition-colors text-sm">Continue anyway</button>
            </>
        }
      </div>
    </div>
  )
}

function DoubleEntrySystemPage({ onNavigate }: { onNavigate: (page: any) => void }) {
  const session = useStudySession();
  const [view, setView] = useState<ViewState>('overview')
  const [practiceScore, setPracticeScore] = useState(0)
  const [thisStatus, setThisStatus] = useState<TopicStatus>('not-started')
  const [nextStatus, setNextStatus] = useState<TopicStatus>('not-started')

  useEffect(() => {
    const load = async () => {
      if (!data) return
      for (const row of data) {
        const st: TopicStatus = row.mastery_level === 'mastered' ? 'mastered' : row.mastery_level === 'needs-practice' ? 'needs-practice' : 'not-started'
        if (row.topic === TOPIC_ID) setThisStatus(st)
        if (row.topic === NEXT_TOPIC_ID) setNextStatus(st)
      }
    }
    load()
  }, [session?.student_id ?? 0])

  const saveProgress = async (score: number, total: number) => {
    const mastery = score / total >= 2 / 3 ? 'mastered' : 'needs-practice'
    setThisStatus(mastery)
  }

  const handlePracticeComplete = async (score: number) => {
    setPracticeScore(score)
    await saveProgress(score, TOPIC.initialQuestions.length)
    if (score === 0) setView('remediation')
    else setView('feedback')
  }

  const handleRemediationComplete = async (score: number) => { await saveProgress(score, TOPIC.remediationQuestions.length); setView('feedback') }
  const handleHardComplete = async (score: number) => { await saveProgress(score, TOPIC.hardQuestions.length); setView('feedback') }

  const statusBadge = (s: TopicStatus) => {
    if (s === 'mastered') return <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">Mastered</span>
    if (s === 'needs-practice') return <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">Needs Practice</span>
  }

  return (

    <div className="min-h-screen" style={{ background: 'oklch(98.5% 0.005 80)' }}>
      <main className="max-w-3xl mx-auto px-4 pt-24 pb-16 space-y-6">
        <nav className="flex items-center gap-2 text-sm text-slate-400">
          <button onClick={() => onNavigate('library')} className="hover:text-slate-700 transition-colors">Library</button>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-600 font-medium">{TOPIC.title}</span>
        </nav>
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-slate-900">{TOPIC.title}</h1>
            {statusBadge(thisStatus)}
          </div>
          <p className="text-slate-500">{TOPIC.description}</p>
        </div>

        {view === 'overview' && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl border-2 border-slate-900 p-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Topic 3</p>
                    <h3 className="font-semibold text-slate-900">{TOPIC.title}</h3>
                  </div>
                  {statusBadge(thisStatus)}
                </div>
                <p className="text-sm text-slate-500">{TOPIC.description}</p>
              </div>
              <button onClick={() => onNavigate('learning-accounting-g10-t1-source-documents' as AppPage)} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 text-left hover:border-slate-300 hover:shadow-sm transition-all group">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Next — Topic 4</p>
                    <h3 className="font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">Source Documents</h3>
                  </div>
                  {statusBadge(nextStatus)}
                </div>
                <p className="text-sm text-slate-400">Invoices, receipts, and other documents that trigger journal entries.</p>
              </button>
            </div>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => setView('interactive-lesson')} className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-700 transition-colors font-medium">
                {thisStatus === 'not-started' ? 'Start Learning' : 'Review Lesson'} <ArrowRight className="w-4 h-4" />
              </button>
              {thisStatus !== 'not-started' && (
                <>
                  <button onClick={() => setView('practice')} className="px-5 py-2.5 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-100 transition-colors font-medium">Practise Again</button>
                  <button onClick={() => setView('practice-more')} className="px-5 py-2.5 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-100 transition-colors font-medium">Challenge Questions</button>
                </>
              )}
            </div>
          </motion.div>
        )}

        {view === 'interactive-lesson' && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}><InteractiveLesson onComplete={() => setView('guided-practice')} /></motion.div>}
        {view === 'guided-practice' && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}><GuidedPracticeModule onComplete={() => setView('practice')} /></motion.div>}
        {view === 'practice' && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}><PracticeModule questions={TOPIC.initialQuestions} onComplete={handlePracticeComplete} /></motion.div>}
        {view === 'remediation' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-slate-600 mt-0.5 shrink-0" />
              <p className="text-slate-800 text-sm">Let's revisit the core ideas with simpler questions first.</p>
            </div>
            <PracticeModule questions={TOPIC.remediationQuestions} onComplete={handleRemediationComplete} />
          </motion.div>
        )}
        {view === 'feedback' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <FeedbackModule score={practiceScore} total={TOPIC.initialQuestions.length} onRetry={() => setView('practice')}
              onContinue={() => onNavigate('learning-accounting-g10-t1-source-documents' as AppPage)} nextTopicName="Source Documents" />
          </motion.div>
        )}
        {view === 'practice-more' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="bg-slate-800 text-white rounded-2xl p-4 mb-4">
              <p className="font-medium">Challenge Questions</p>
              <p className="text-slate-300 text-sm mt-0.5">Multi-step problems that go beyond the basics.</p>
            </div>
            <PracticeModule questions={TOPIC.hardQuestions} onComplete={handleHardComplete} />
          </motion.div>
        )}
      </main>
    </div>
  )
}

export default DoubleEntrySystemPage
