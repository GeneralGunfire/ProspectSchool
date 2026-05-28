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
  id: 'general-ledger',
  title: 'The General Ledger',
  description: 'Posting journal entries to T-accounts and balancing the ledger at period end.',
  interactiveSteps: [
    {
      id: 'step-1', title: 'What Is the General Ledger?', content: 'The General Ledger (GL) is the central accounting record that contains all accounts of a business. Each account appears as a T-account. Entries are transferred (posted) from the journals to the ledger. The GL is used to prepare the Trial Balance and ultimately the financial statements.',
      math: ['Journal', '→', 'Post', '→', 'Ledger', '→', 'Trial Balance'],
      bubbles: [{ target: 'Post', text: 'Transfer journal totals', pos: 'top' as const }, { target: 'Trial Balance', text: 'Checks Dr = Cr', pos: 'bottom' as const }]
    },
    {
      id: 'step-2', title: 'Posting to the Ledger', content: 'Posting means copying the debit and credit entries from a journal into the correct T-accounts in the ledger. Each journal entry has two sides: the debit entry goes to the left side of one account and the credit entry goes to the right side of another. After posting, a reference (folio) is recorded.',
      math: ['Dr side', '←', 'T-Account', '→', 'Cr side'],
      bubbles: [{ target: 'Dr side', text: 'Left — debits posted here', pos: 'top' as const }, { target: 'Cr side', text: 'Right — credits posted here', pos: 'bottom' as const }]
    },
    {
      id: 'step-3', title: 'Balancing a T-Account', content: 'To balance a T-account: add up both sides. Write the totals in pencil. The difference is the balance — it is written on the SMALLER side as "Balance c/d" (carried down). The same amount is written on the LARGER side as "Balance b/d" (brought down) — this is the opening balance for the next period.',
      math: ['Totals equal', '→', 'Balance c/d', '→', 'Balance b/d'],
      bubbles: [{ target: 'Balance c/d', text: 'Carried down to close', pos: 'top' as const }, { target: 'Balance b/d', text: 'Brought down as opening', pos: 'bottom' as const }]
    },
    {
      id: 'step-4', title: 'The Trial Balance', content: 'After all journals are posted, a Trial Balance is extracted. It lists all ledger accounts with their debit or credit balances. If total debits = total credits, the books are arithmetically correct. However a Trial Balance does NOT detect all errors — it only checks that Dr = Cr.',
      math: ['Total Dr', '=', 'Total Cr', '→', 'Balanced'],
      bubbles: [{ target: 'Total Dr', text: 'Sum of all debit balances', pos: 'top' as const }, { target: 'Total Cr', text: 'Sum of all credit balances', pos: 'bottom' as const }]
    },
  ],
  guidedItem: {
    problem: 'The Bank T-account has the following entries for June: Debit side — Capital R20 000, Sales R8 500. Credit side — Rent R3 800, Creditor payment R5 200. Balance and close the Bank account for June.',
    steps: [
      { id: 1, instruction: 'Total the debit side', math: 'Dr side: R20 000 + R8 500 = R28 500', explanation: 'Add all debit entries: Capital R20 000 + Sales R8 500 = R28 500. This represents all cash received (cash in) during June.' },
      { id: 2, instruction: 'Total the credit side', math: 'Cr side: R3 800 + R5 200 = R9 000', explanation: 'Add all credit entries: Rent R3 800 + Creditor payment R5 200 = R9 000. This represents all cash paid out (cash out) during June.' },
      { id: 3, instruction: 'Calculate and record the balance', math: 'Balance = R28 500 − R9 000 = R19 500 (Dr balance)', explanation: 'The debit side is larger, so the balance is a DEBIT balance of R19 500. Write "Balance c/d R19 500" on the credit side to make both sides equal R28 500. Then write "Balance b/d R19 500" on the debit side — this is the opening bank balance for July.' },
    ]
  },
  initialQuestions: [
    {
      id: 'q1', question: 'What does "posting" mean in accounting?', math: '',
      options: ['Writing source documents', 'Transferring journal entries to the correct accounts in the ledger', 'Balancing the trial balance', 'Preparing financial statements'],
      correctIndex: 1, hint: 'Think about moving information from one book to another.',
      explanation: 'Posting means transferring (copying) debit and credit entries from the journals to the appropriate T-accounts in the General Ledger. Each journal entry is posted to two accounts — one debit and one credit.'
    },
    {
      id: 'q2', question: 'A T-account has debit entries totalling R15 000 and credit entries totalling R9 500. What is the balance and on which side?', math: '',
      options: ['R24 500 credit balance', 'R5 500 debit balance', 'R5 500 credit balance', 'R15 000 debit balance'],
      correctIndex: 1, hint: 'Balance = larger side minus smaller side; sits on the larger side.',
      explanation: 'Balance = R15 000 − R9 500 = R5 500. The debit side is larger, so the account has a DEBIT balance of R5 500. Write Balance c/d R5 500 on the credit side, then Balance b/d R5 500 on the debit side to open the next period.'
    },
    {
      id: 'q3', question: 'Which of the following would show a CREDIT balance in the General Ledger?', math: '',
      options: ['Bank account', 'Equipment account', 'Creditors control account', 'Debtors control account'],
      correctIndex: 2, hint: 'Use DEAD CLIC — liabilities have normal credit balances.',
      explanation: 'Creditors control is a liability — liabilities normally have credit balances (CLIC). Bank, equipment, and debtors are assets, which normally have debit balances (DEAD).'
    },
    {
      id: 'q4', question: 'The Trial Balance totals are: Debits R187 400 and Credits R181 900. What does this tell you?', math: '',
      options: ['The business made a profit of R5 500', 'The books are in balance and correct', 'There is an error — the Trial Balance does not balance', 'Liabilities exceed assets'],
      correctIndex: 2, hint: 'For the Trial Balance to be correct, total debits MUST equal total credits.',
      explanation: 'The Trial Balance does NOT balance (R187 400 ≠ R181 900). The difference of R5 500 indicates an error in posting or calculation. Common causes: a posting made to the wrong side, an amount posted incorrectly, or a journal entry omitted entirely.'
    },
  ],
  remediationQuestions: [
    {
      id: 'r1', question: 'Where is "Balance b/d" written when closing a T-account?', math: '',
      options: ['On the same side as Balance c/d', 'On the OPPOSITE side from Balance c/d — it becomes the opening balance', 'At the top of the account', 'It is not required'],
      correctIndex: 1, hint: 'c/d closes the account; b/d opens the next period.',
      explanation: 'Balance c/d (carried down) is written on the SMALLER side to make both sides equal. Balance b/d (brought down) is then written on the LARGER side — it is the opening balance for the next period and sits on the same side as the normal balance of the account.'
    },
    {
      id: 'r2', question: 'Why might a Trial Balance agree (balance) but still contain errors?', math: '',
      options: ['This cannot happen — a balanced trial balance is always correct', 'Errors that affect both sides equally (e.g. posting to wrong account, omitting a whole entry) are not revealed', 'The trial balance only checks income and expenses', 'The trial balance only applies to large companies'],
      correctIndex: 1, hint: 'The Trial Balance only checks that Dr total = Cr total — not that the RIGHT accounts were used.',
      explanation: 'A Trial Balance only detects errors that cause Dr ≠ Cr. It will NOT detect: posting to the wrong account (but correct side), omitting an entire entry, or entering the wrong amount on BOTH sides. These errors leave the trial balance balanced but incorrect.'
    },
  ],
  hardQuestions: [
    {
      id: 'h1', question: 'The Debtors Control account shows: Opening balance R12 000, Credit sales R34 500, Cash received from debtors R28 700, Returns by debtors R1 800. What is the closing balance?', math: 'Debtors Control is an asset (Dr balance)',
      options: ['R16 000', 'R15 200', 'R18 000', 'R16 800'],
      correctIndex: 0, hint: 'Opening + credit sales − cash received − returns = closing balance.',
      explanation: 'Debtors Control: Opening R12 000 + Credit sales R34 500 = R46 500 (Dr). Less cash received R28 700 + returns R1 800 = R30 500 (Cr). Closing balance = R46 500 − R30 500 = R16 000 (Dr). This is the amount still owed to the business.'
    },
    {
      id: 'h2', question: 'After posting all journals, the Capital account shows a credit balance of R85 000. Which financial statement does this figure appear on and under which section?', math: '',
      options: [
        'Income Statement — under Expenses',
        'Balance Sheet — under Assets',
        'Balance Sheet — under Owner\'s Equity',
        'Trial Balance only — not on financial statements'
      ],
      correctIndex: 2, hint: 'Capital is the owner\'s equity — where does equity appear on the Balance Sheet?',
      explanation: 'Capital (Owner\'s Equity) appears on the Balance Sheet under the Owner\'s Equity section. The Balance Sheet shows Assets = Equity + Liabilities. Capital is part of Equity alongside retained profit and minus drawings.'
    },
    {
      id: 'h3', question: 'A bookkeeper posted a payment of R4 200 to the debit side of the Bank account instead of the credit side. By how much will the Trial Balance be out of balance?', math: '',
      options: ['R4 200', 'R8 400', 'R2 100', 'The Trial Balance will still balance'],
      correctIndex: 1, hint: 'One side has too much, the other has too little — the difference doubles.',
      explanation: 'The Bank account was debited R4 200 instead of credited — so debits are R4 200 too high AND credits are R4 200 too low. Total discrepancy = R4 200 + R4 200 = R8 400. The Trial Balance will be out by R8 400 (Dr > Cr by R8 400).'
    },
    {
      id: 'h4', question: 'Which sequence correctly describes the accounting cycle from transaction to financial statements?', math: '',
      options: [
        'Trial Balance → Journal → Ledger → Source Document → Financial Statements',
        'Source Document → Journal → Ledger → Trial Balance → Financial Statements',
        'Journal → Source Document → Trial Balance → Ledger → Financial Statements',
        'Ledger → Journal → Source Document → Trial Balance → Financial Statements'
      ],
      correctIndex: 1, hint: 'Think about the logical flow: evidence first, then record, then summarise.',
      explanation: 'The correct accounting cycle: Source Document (evidence of transaction) → Journal (book of first entry) → Ledger (posting to T-accounts) → Trial Balance (check Dr = Cr) → Financial Statements (Income Statement + Balance Sheet). This sequence ensures accuracy at each stage.'
    },
  ],
}

const SUBJECT = 'Accounting'
const GRADE = 10
const TOPIC_ID = 'general-ledger'
const STORAGE_KEY_PREFIX = 'scratchpad_general-ledger_'

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

function GeneralLedgerPage({ onNavigate }: { onNavigate: (page: any) => void }) {
  const session = useStudySession()
  const [view, setView] = useState<ViewState>('overview')
  const [practiceScore, setPracticeScore] = useState(0)
  const [thisStatus, setThisStatus] = useState<TopicStatus>('not-started')

  useEffect(() => {
    if (!session) return
    _loadProgress(session.student_id, SUBJECT, GRADE, TOPIC_ID).then(m => {
      setThisStatus(m === 'mastered' ? 'mastered' : m === 'needs_practice' ? 'needs-practice' : 'not-started')
    })
  }, [session])

  const saveProgress = async (score: number, total: number) => {
    const mastery = score / total >= 2 / 3 ? 'mastered' : 'needs-practice'
    setThisStatus(mastery)
    if (session) {
      const ml: import('../../../../../../../lib/studyProgress').MasteryLevel = score / total >= 2 / 3 ? 'mastered' : 'needs_practice'
      await _saveProgress(session.student_id, session.school_id, SUBJECT, GRADE, TOPIC_ID, ml, score, total, 1)
    }
  }

  const handlePracticeComplete = async (score: number) => { setPracticeScore(score); await saveProgress(score, TOPIC.initialQuestions.length); if (score === 0) setView('remediation'); else setView('feedback') }
  const handleRemediationComplete = async (score: number) => { await saveProgress(score, TOPIC.remediationQuestions.length); setView('feedback') }
  const handleHardComplete = async (score: number) => { await saveProgress(score, TOPIC.hardQuestions.length); setView('feedback') }

  const statusBadge = (s: TopicStatus) => {
    if (s === 'mastered') return <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">Mastered</span>
    if (s === 'needs-practice') return <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">Needs Practice</span>
  }

  const pct = practiceScore / TOPIC.initialQuestions.length

  return (
    <div className="min-h-screen" style={{ background: 'oklch(98.5% 0.005 80)' }}>
      <main className="max-w-3xl mx-auto px-4 pt-24 pb-16 space-y-6">
        <nav className="flex items-center gap-2 text-sm text-slate-400">
          <button onClick={() => { sessionStorage.setItem('library_return', JSON.stringify({ subjectId: 'accounting', grade: 10, term: 1 })); onNavigate('library'); }} className="hover:text-slate-700 transition-colors">Library</button>
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
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Topic 6</p>
                    <h3 className="font-semibold text-slate-900">{TOPIC.title}</h3>
                  </div>
                  {statusBadge(thisStatus)}
                </div>
                <p className="text-sm text-slate-500">{TOPIC.description}</p>
              </div>
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-3">
                <p className="text-xs text-slate-600 font-medium uppercase tracking-wider">All Term 1 Topics Complete</p>
                <p className="font-semibold text-slate-900">Accounting — Grade 10 Term 1</p>
                <p className="text-sm text-slate-700">You have covered all six Accounting topics for Term 1. Return to the library to explore other subjects.</p>
                <button onClick={() => { sessionStorage.setItem('library_return', JSON.stringify({ subjectId: 'accounting', grade: 10, term: 1 })); onNavigate('library'); }} className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors">
                  Back to Library <ArrowRight className="w-4 h-4" />
                </button>
              </div>
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
            <div className="max-w-md mx-auto text-center space-y-6">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto ${pct >= 2 / 3 ? 'bg-slate-100' : 'bg-slate-100'}`}>
                {pct >= 2 / 3 ? <Award className="w-10 h-10 text-slate-600" /> : <AlertCircle className="w-10 h-10 text-slate-600" />}
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900">{practiceScore}/{TOPIC.initialQuestions.length}</p>
                <p className="text-slate-500 mt-1">{pct >= 2 / 3 ? 'Mastered!' : 'Keep practising'}</p>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${pct * 100}%` }} className={`h-full rounded-full ${pct >= 2 / 3 ? 'bg-slate-500' : 'bg-slate-400'}`} />
              </div>
              <div className="flex flex-col gap-3">
                {pct >= 2 / 3
                  ? <button onClick={() => { sessionStorage.setItem('library_return', JSON.stringify({ subjectId: 'accounting', grade: 10, term: 1 })); onNavigate('library'); }} className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-600 text-white rounded-xl hover:bg-slate-700 transition-colors font-medium">
                      Back to Library <ArrowRight className="w-4 h-4" />
                    </button>
                  : <>
                      <button onClick={() => setView('practice')} className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-700 transition-colors font-medium">
                        <RotateCcw className="w-4 h-4" /> Try Again
                      </button>
                      <button onClick={() => { sessionStorage.setItem('library_return', JSON.stringify({ subjectId: 'accounting', grade: 10, term: 1 })); onNavigate('library'); }} className="px-6 py-2.5 text-slate-600 hover:text-slate-900 transition-colors text-sm">Back to Library</button>
                    </>
                }
              </div>
            </div>
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

export default GeneralLedgerPage
