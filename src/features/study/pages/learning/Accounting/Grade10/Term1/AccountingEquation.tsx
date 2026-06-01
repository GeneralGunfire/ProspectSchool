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
  id: 'accounting-equation',
  title: 'The Accounting Equation',
  description: 'Assets = Equity + Liabilities — the foundation of double-entry bookkeeping.',
  interactiveSteps: [
    {
      id: 'step-1', title: 'The Fundamental Equation', content: 'The accounting equation states that everything a business owns (Assets) is funded either by the owner (Equity) or by creditors (Liabilities). This equation ALWAYS balances — it is the cornerstone of all accounting.',
      math: ['Assets', '=', 'Equity', '+', 'Liabilities'],
      bubbles: [{ target: 'Assets', text: 'What the business owns', pos: 'top' as const }, { target: 'Liabilities', text: 'What the business owes', pos: 'bottom' as const }]
    },
    {
      id: 'step-2', title: 'Elements of the Equation', content: 'Assets are resources controlled by the business (cash, inventory, equipment, land). Liabilities are obligations to outsiders (loans, creditors). Equity (also called Owner\'s Equity or Capital) is the owner\'s claim after all liabilities are settled.',
      math: ['Assets', '−', 'Liabilities', '=', 'Equity'],
      bubbles: [{ target: 'Assets', text: 'Resources with value', pos: 'top' as const }, { target: 'Equity', text: 'Owner\'s residual claim', pos: 'bottom' as const }]
    },
    {
      id: 'step-3', title: 'Effect of Transactions', content: 'Every business transaction affects at least two elements of the equation — but the equation always remains balanced. Buying an asset for cash: one asset increases, another decreases. Taking a loan: asset increases AND liability increases.',
      math: ['ΔAssets', '=', 'ΔEquity', '+', 'ΔLiabilities'],
      bubbles: [{ target: 'ΔAssets', text: 'Change in assets', pos: 'top' as const }, { target: 'ΔLiabilities', text: 'Change in liabilities', pos: 'bottom' as const }]
    },
    {
      id: 'step-4', title: 'Equity Components', content: 'Owner\'s Equity = Capital + Profit − Drawings. Capital is money the owner invests. Profit (Revenue − Expenses) increases equity. Drawings (owner taking money out) decrease equity. The equation expands to: Assets = Capital + Revenue − Expenses − Drawings + Liabilities.',
      math: ['Equity', '=', 'Capital', '+', 'Profit', '−', 'Drawings'],
      bubbles: [{ target: 'Capital', text: 'Owner investment', pos: 'top' as const }, { target: 'Drawings', text: 'Owner withdrawals', pos: 'bottom' as const }]
    },
  ],
  guidedItem: {
    problem: 'Sipho starts a business with R20 000 cash (capital). He then takes a bank loan of R10 000 and buys equipment for R15 000 cash. Show the accounting equation after each step.',
    steps: [
      { id: 1, instruction: 'After investing capital: R20 000 cash', math: 'Assets R20 000 = Equity R20 000 + Liabilities R0', explanation: 'When Sipho invests R20 000, the business gains a cash asset of R20 000 and equity (capital) increases by R20 000. Liabilities remain zero.' },
      { id: 2, instruction: 'After bank loan of R10 000', math: 'Assets R30 000 = Equity R20 000 + Liabilities R10 000', explanation: 'The loan adds R10 000 to cash (assets now R30 000) and R10 000 to liabilities. Equity stays the same. Both sides increase by R10 000 — the equation still balances.' },
      { id: 3, instruction: 'After buying equipment for R15 000 cash', math: 'Assets R30 000 = Equity R20 000 + Liabilities R10 000', explanation: 'Cash decreases by R15 000 but equipment (a new asset) increases by R15 000. Total assets stay at R30 000. The equation balances because one asset is swapped for another.' },
    ]
  },
  initialQuestions: [
    {
      id: 'q1', question: 'A business has assets of R80 000 and liabilities of R30 000. What is the owner\'s equity?', math: 'Assets = Equity + Liabilities',
      options: ['R110 000', 'R50 000', 'R30 000', 'R80 000'],
      correctIndex: 1, hint: 'Equity = Assets − Liabilities',
      explanation: 'Equity = Assets − Liabilities = R80 000 − R30 000 = R50 000. The owner\'s equity represents the residual interest in the assets after all liabilities are settled.'
    },
    {
      id: 'q2', question: 'A business takes out a bank loan of R25 000. What is the effect on the accounting equation?', math: '',
      options: ['Assets increase R25 000; Equity increases R25 000', 'Assets increase R25 000; Liabilities increase R25 000', 'Liabilities increase R25 000; Equity decreases R25 000', 'Assets decrease R25 000; Liabilities increase R25 000'],
      correctIndex: 1, hint: 'A loan brings in cash (asset) but also creates an obligation to repay (liability).',
      explanation: 'Taking a loan increases cash (an asset) by R25 000 and also increases liabilities (the loan obligation) by R25 000. Equity is unchanged. The equation remains balanced: both sides increase by R25 000.'
    },
    {
      id: 'q3', question: 'The owner withdraws R3 000 cash from the business for personal use. What happens to equity?', math: '',
      options: ['Equity increases by R3 000', 'Equity decreases by R3 000', 'Equity is unchanged — it only affects assets', 'Liabilities decrease by R3 000'],
      correctIndex: 1, hint: 'Drawings reduce the owner\'s stake in the business.',
      explanation: 'Drawings reduce equity. When the owner withdraws cash, assets (cash) decrease and equity (via Drawings account) also decreases by the same amount. Liabilities are unaffected.'
    },
    {
      id: 'q4', question: 'Which of the following is NOT an asset?', math: '',
      options: ['Inventory on hand', 'Bank loan payable', 'Equipment owned by the business', 'Cash in the till'],
      correctIndex: 1, hint: 'An asset is something the business OWNS, not something it OWES.',
      explanation: 'A bank loan payable is a liability — an obligation to repay money to the bank. Assets are resources the business controls (cash, inventory, equipment). Liabilities are what the business owes to outsiders.'
    },
  ],
  remediationQuestions: [
    {
      id: 'r1', question: 'If Assets = R50 000 and Equity = R20 000, what are the Liabilities?', math: 'Assets = Equity + Liabilities',
      options: ['R70 000', 'R30 000', 'R20 000', 'R50 000'],
      correctIndex: 1, hint: 'Rearrange: Liabilities = Assets − Equity',
      explanation: 'Liabilities = Assets − Equity = R50 000 − R20 000 = R30 000. The accounting equation always balances: R50 000 = R20 000 + R30 000.'
    },
    {
      id: 'r2', question: 'A business buys a computer for R8 000 cash. What is the effect on the accounting equation?', math: '',
      options: ['Assets increase R8 000; Liabilities increase R8 000', 'Total assets stay the same; one asset increases, another decreases', 'Equity increases by R8 000', 'Assets decrease and equity decreases by R8 000'],
      correctIndex: 1, hint: 'Cash (asset) goes out, computer (asset) comes in — both are assets.',
      explanation: 'Buying equipment for cash is an asset swap: cash decreases by R8 000 and equipment increases by R8 000. Total assets remain unchanged. Equity and liabilities are also unchanged.'
    },
  ],
  hardQuestions: [
    {
      id: 'h1', question: 'A business has Capital R40 000, Revenue R15 000, Expenses R6 000, Drawings R2 000, and Liabilities R18 000. What are the total Assets?', math: 'Equity = Capital + Revenue − Expenses − Drawings',
      options: ['R65 000', 'R73 000', 'R65 000', 'R47 000'],
      correctIndex: 0, hint: 'First calculate Equity, then use Assets = Equity + Liabilities.',
      explanation: 'Equity = R40 000 + R15 000 − R6 000 − R2 000 = R47 000. Assets = Equity + Liabilities = R47 000 + R18 000 = R65 000.'
    },
    {
      id: 'h2', question: 'The owner invests an additional R10 000 cash into the business. Which statement correctly describes the effect?', math: '',
      options: ['Assets +R10 000; Liabilities +R10 000', 'Assets +R10 000; Equity +R10 000', 'Only equity changes — no asset is created', 'Assets −R10 000; Equity +R10 000'],
      correctIndex: 1, hint: 'Additional capital investment brings in cash (asset) and increases the owner\'s equity.',
      explanation: 'When the owner invests more capital, cash (an asset) increases by R10 000 and equity (capital account) also increases by R10 000. The equation remains balanced.'
    },
    {
      id: 'h3', question: 'A debtor pays R5 000 owed to the business. What is the effect on the accounting equation?', math: '',
      options: ['Assets increase; Equity increases', 'No effect — total assets stay the same', 'Assets decrease; Liabilities decrease', 'Equity increases; Liabilities decrease'],
      correctIndex: 1, hint: 'Think: debtors (accounts receivable) is an asset, and so is cash.',
      explanation: 'When a debtor pays, cash (asset) increases by R5 000 but the debtors account (also an asset) decreases by R5 000. Total assets are unchanged. Equity and liabilities are unaffected — this is just one asset converting to another.'
    },
    {
      id: 'h4', question: 'The business pays R3 000 to a creditor (someone it owes money to). What is the effect?', math: '',
      options: ['Assets −R3 000; Equity −R3 000', 'Assets −R3 000; Liabilities −R3 000', 'Liabilities −R3 000; Equity +R3 000', 'No effect on the equation'],
      correctIndex: 1, hint: 'Cash goes out (asset decreases) and the debt is cleared (liability decreases).',
      explanation: 'Paying a creditor reduces cash (asset) by R3 000 and reduces the creditor liability by R3 000. Both sides of the equation decrease equally, so it remains balanced. Equity is unaffected.'
    },
  ],
}

const SUBJECT = 'Accounting'
const GRADE = 10
const TOPIC_ID = 'accounting-equation'
const NEXT_TOPIC_ID = 'double-entry-system'
const STORAGE_KEY_PREFIX = 'scratchpad_accounting-equation_'

// ─── SpeechBubble ────────────────────────────────────────────────────────────
function SpeechBubble({ text, position }: { text: string; position: 'top' | 'bottom' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: position === 'top' ? 8 : -8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`absolute ${position === 'top' ? '-top-12' : '-bottom-12'} left-1/2 -translate-x-1/2 z-10`}
    >
      <div className="bg-slate-800 text-white text-xs rounded-lg px-3 py-1.5 whitespace-nowrap shadow-lg">
        {text}
        <div className={`absolute left-1/2 -translate-x-1/2 w-0 h-0 ${position === 'top' ? 'top-full border-t-8 border-t-slate-800 border-x-4 border-x-transparent' : 'bottom-full border-b-8 border-b-slate-800 border-x-4 border-x-transparent'}`} />
      </div>
    </motion.div>
  )
}

// ─── InteractiveLesson ───────────────────────────────────────────────────────
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
                    <button
                      onClick={() => setActiveBubble(isActive ? null : token)}
                      className={`px-4 py-2 rounded-lg font-mono text-base font-semibold transition-all ${bubble ? (isActive ? 'bg-slate-600 text-white shadow-md scale-105' : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100') : 'bg-white text-slate-400 border border-slate-200 cursor-default text-lg'}`}
                    >
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

// ─── ScratchpadModal ─────────────────────────────────────────────────────────
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

  const getPos = (e: React.PointerEvent) => {
    const r = canvasRef.current!.getBoundingClientRect()
  }

  const saveHistory = useCallback(() => {
    const canvas = canvasRef.current; const ctx = canvas?.getContext('2d'); if (!canvas || !ctx) return
    setHistory(h => [...h.slice(-29), ctx.getImageData(0, 0, canvas.width, canvas.height)])
  }, [])

  const onPointerDown = (e: React.PointerEvent) => {
    saveHistory(); setIsDrawing(true); lastPos.current = getPos(e)
    canvasRef.current?.setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDrawing || !lastPos.current) return
    const canvas = canvasRef.current; const ctx = canvas?.getContext('2d'); if (!canvas || !ctx) return
    const pos = getPos(e)
    ctx.beginPath(); ctx.moveTo(lastPos.current.x, lastPos.current.y); ctx.lineTo(pos.x, pos.y)
    ctx.strokeStyle = tool === 'pen' ? '#1e293b' : '#ffffff'
    ctx.lineWidth = tool === 'pen' ? 2 : 18; ctx.lineCap = 'round'; ctx.stroke()
    lastPos.current = pos
  }

  const onPointerUp = () => {
    setIsDrawing(false); lastPos.current = null
    const canvas = canvasRef.current; if (canvas) localStorage.setItem(storageKey, canvas.toDataURL())
  }

  const undo = () => {
    if (!history.length) return
    const canvas = canvasRef.current; const ctx = canvas?.getContext('2d'); if (!canvas || !ctx) return
    ctx.putImageData(history[history.length - 1], 0, 0)
    setHistory(h => h.slice(0, -1))
    localStorage.setItem(storageKey, canvas.toDataURL())
  }

  const clear = () => {
    const canvas = canvasRef.current; const ctx = canvas?.getContext('2d'); if (!canvas || !ctx) return
    saveHistory(); ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, canvas.width, canvas.height)
    localStorage.removeItem(storageKey)
  }

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
        <canvas ref={canvasRef} className="flex-1 w-full cursor-crosshair rounded-b-2xl touch-none"
          onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} />
      </motion.div>
    </div>
  )
}

// ─── GuidedPracticeModule ────────────────────────────────────────────────────
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

          <div className="bg-slate-50 rounded-xl px-5 py-4 font-mono text-sm text-slate-700 text-center">
            {step.math}
          </div>

          {!revealed
            ? <button onClick={() => setRevealed(true)} className="w-full py-2.5 border-2 border-dashed border-slate-200 rounded-xl text-sm text-slate-400 hover:border-slate-300 hover:text-slate-600 transition-colors">
                Reveal explanation
              </button>
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

// ─── PracticeModule ──────────────────────────────────────────────────────────
function PracticeModule({ questions, onComplete, allowScratchpad = true }: { questions: Question[]; onComplete: (score: number) => void; allowScratchpad?: boolean }) {
  const [idx, setIdx] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [confirmed, setConfirmed] = useState(false)
  const [score, setScore] = useState(0)
  const [scratchpadQ, setScratchpadQ] = useState<string | null>(null)
  const q = questions[idx]

  const confirm = () => {
    if (selected === null) return
    setConfirmed(true)
    if (selected === q.correctIndex) setScore(s => s + 1)
  }

  const next = () => {
    if (idx < questions.length - 1) { setIdx(i => i + 1); setSelected(null); setConfirmed(false) }
    else onComplete(score + (selected === q.correctIndex ? 1 : 0))
  }

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
              const isCorrect = i === q.correctIndex
              const isSelected = i === selected
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

// ─── FeedbackModule ───────────────────────────────────────────────────────────
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
              <button onClick={onContinue} className="px-6 py-2.5 text-slate-600 hover:text-slate-900 transition-colors text-sm">
                Continue anyway
              </button>
            </>
        }
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
function AccountingEquationPage({ onNavigate }: { onNavigate: (page: any) => void }) {
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

  const handleRemediationComplete = async (score: number) => {
    await saveProgress(score, TOPIC.remediationQuestions.length)
    setView('feedback')
  }

  const handleHardComplete = async (score: number) => {
    await saveProgress(score, TOPIC.hardQuestions.length)
    setView('feedback')
  }

  const statusBadge = (s: TopicStatus) => {
    if (s === 'mastered') return <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">Mastered</span>
    if (s === 'needs-practice') return <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">Needs Practice</span>
  }

  return (

    <div className="min-h-screen" style={{ background: '#F5F0E8' }}>

      <main className="max-w-3xl mx-auto px-4 pt-24 pb-16 space-y-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-400">
          <button onClick={() => onNavigate('library')} className="hover:text-slate-700 transition-colors">Library</button>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-600 font-medium">{TOPIC.title}</span>
        </nav>

        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-slate-900">{TOPIC.title}</h1>
            {statusBadge(thisStatus)}
          </div>
          <p className="text-slate-500">{TOPIC.description}</p>
        </div>

        {/* Overview */}
        {view === 'overview' && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* This topic card */}
              <div className="bg-white rounded-2xl border-2 border-slate-900 p-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Topic 2</p>
                    <h3 className="font-semibold text-slate-900">{TOPIC.title}</h3>
                  </div>
                  {statusBadge(thisStatus)}
                </div>
                <p className="text-sm text-slate-500">{TOPIC.description}</p>
              </div>

              {/* Next topic card */}
              <button onClick={() => onNavigate('learning-accounting-g10-t1-double-entry' as AppPage)} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 text-left hover:border-slate-300 hover:shadow-sm transition-all group">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Next — Topic 3</p>
                    <h3 className="font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">Double-Entry System</h3>
                  </div>
                  {statusBadge(nextStatus)}
                </div>
                <p className="text-sm text-slate-400">Debits and credits — how every transaction affects two accounts.</p>
              </button>
            </div>

            <div className="flex flex-wrap gap-3">
              <button onClick={() => setView('interactive-lesson')} className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-700 transition-colors font-medium">
                {thisStatus === 'not-started' ? 'Start Learning' : 'Review Lesson'} <ArrowRight className="w-4 h-4" />
              </button>
              {thisStatus !== 'not-started' && (
                <>
                  <button onClick={() => setView('practice')} className="px-5 py-2.5 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-100 transition-colors font-medium">
                    Practise Again
                  </button>
                  <button onClick={() => setView('practice-more')} className="px-5 py-2.5 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-100 transition-colors font-medium">
                    Challenge Questions
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}

        {/* Interactive Lesson */}
        {view === 'interactive-lesson' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <InteractiveLesson onComplete={() => setView('guided-practice')} />
          </motion.div>
        )}

        {/* Guided Practice */}
        {view === 'guided-practice' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <GuidedPracticeModule onComplete={() => setView('practice')} />
          </motion.div>
        )}

        {/* Practice */}
        {view === 'practice' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <PracticeModule questions={TOPIC.initialQuestions} onComplete={handlePracticeComplete} />
          </motion.div>
        )}

        {/* Remediation */}
        {view === 'remediation' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-slate-600 mt-0.5 shrink-0" />
              <p className="text-slate-800 text-sm">Let's revisit the core ideas with simpler questions first.</p>
            </div>
            <PracticeModule questions={TOPIC.remediationQuestions} onComplete={handleRemediationComplete} />
          </motion.div>
        )}

        {/* Feedback */}
        {view === 'feedback' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <FeedbackModule
              score={practiceScore}
              total={TOPIC.initialQuestions.length}
              onRetry={() => setView('practice')}
              onContinue={() => onNavigate('learning-accounting-g10-t1-double-entry' as AppPage)}
              nextTopicName="Double-Entry System"
            />
          </motion.div>
        )}

        {/* Challenge / Hard questions */}
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

export default AccountingEquationPage
