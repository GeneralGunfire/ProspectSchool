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
  id: 'journals-in-accounting',
  title: 'Journals in Accounting',
  description: 'The specialised journals used to first record different types of transactions before posting to the ledger.',
  interactiveSteps: [
    {
      id: 'step-1', title: 'What Is a Journal?', content: 'A journal (also called a book of first entry or book of prime entry) is where transactions are first recorded in the accounting system. Each journal is specialised for a particular type of transaction. Entries are later posted (transferred) to the General Ledger.',
      math: ['Source Doc', '→', 'Journal', '→', 'Ledger'],
      bubbles: [{ target: 'Journal', text: 'Book of first entry', pos: 'top' as const }, { target: 'Ledger', text: 'Entries are posted here', pos: 'bottom' as const }]
    },
    {
      id: 'step-2', title: 'The Six Specialised Journals', content: 'South African Grade 10 Accounting uses six journals: Cash Receipts Journal (CRJ) — all cash received. Cash Payments Journal (CPJ) — all cash paid. Debtors Journal (DJ) — credit sales. Creditors Journal (CJ) — credit purchases. Debtors Allowances Journal (DAJ) — returns by debtors. Creditors Allowances Journal (CAJ) — returns to creditors.',
      math: ['CRJ', '|', 'CPJ', '|', 'DJ', '|', 'CJ'],
      bubbles: [{ target: 'CRJ', text: 'All cash in', pos: 'top' as const }, { target: 'CPJ', text: 'All cash out', pos: 'bottom' as const }]
    },
    {
      id: 'step-3', title: 'Cash Receipts Journal (CRJ)', content: 'The CRJ records ALL cash received by the business — from cash sales, debtor payments, owner capital, and loans received. Source documents: receipts, EFT confirmations, deposit slips. The CRJ always debits Bank and credits the appropriate income or liability account.',
      math: ['Dr Bank', '=', 'Cash', 'IN'],
      bubbles: [{ target: 'Dr Bank', text: 'Bank account increases', pos: 'top' as const }, { target: 'IN', text: 'CRJ records this', pos: 'bottom' as const }]
    },
    {
      id: 'step-4', title: 'Cash Payments Journal (CPJ) and Credit Journals', content: 'The CPJ records all cash paid out (creditors, expenses, drawings, equipment). The Debtors Journal (DJ) records credit sales — no cash changes hands yet. The Creditors Journal (CJ) records credit purchases. Allowances journals record returns and corrections for debtors and creditors.',
      math: ['Cr Bank', '=', 'Cash', 'OUT'],
      bubbles: [{ target: 'Cr Bank', text: 'Bank account decreases', pos: 'top' as const }, { target: 'OUT', text: 'CPJ records this', pos: 'bottom' as const }]
    },
  ],
  guidedItem: {
    problem: 'During March, Zanele\'s business made the following transactions: (1) Cash sales R6 000. (2) Bought stationery on credit R800. (3) Paid R2 500 to a creditor. (4) A debtor paid R1 200 owed. Identify the correct journal for each transaction.',
    steps: [
      { id: 1, instruction: 'Classify cash sales R6 000', math: 'Cash received → Cash Receipts Journal (CRJ)', explanation: 'Cash sales bring money into the business. All cash received is recorded in the CRJ. Entry: Dr Bank R6 000 | Cr Sales R6 000. Source document: cash register roll / receipt.' },
      { id: 2, instruction: 'Classify credit purchase of stationery R800', math: 'Credit purchase → Creditors Journal (CJ)', explanation: 'Buying on credit means no cash changes hands yet — a creditor is created. This goes in the CJ. Entry: Dr Stationery R800 | Cr Creditor R800. Source document: tax invoice received from supplier.' },
      { id: 3, instruction: 'Classify payment to creditor R2 500', math: 'Cash paid → Cash Payments Journal (CPJ)', explanation: 'Any cash leaving the business is recorded in the CPJ. Entry: Dr Creditor R2 500 | Cr Bank R2 500. Source document: EFT confirmation or cheque counterfoil.' },
      { id: 4, instruction: 'Classify debtor payment R1 200', math: 'Cash received from debtor → Cash Receipts Journal (CRJ)', explanation: 'When a debtor pays, cash comes in — this goes in the CRJ. Entry: Dr Bank R1 200 | Cr Debtors R1 200. Source document: receipt issued or EFT confirmation received.' },
    ]
  },
  initialQuestions: [
    {
      id: 'q1', question: 'Which journal records ALL cash received by the business?', math: '',
      options: ['Creditors Journal (CJ)', 'Cash Payments Journal (CPJ)', 'Debtors Journal (DJ)', 'Cash Receipts Journal (CRJ)'],
      correctIndex: 3, hint: 'Think about what "Receipts" means — money coming IN.',
      explanation: 'The Cash Receipts Journal (CRJ) records every transaction where the business receives cash — cash sales, debtor payments, capital invested, and loans received. It always debits the Bank account.'
    },
    {
      id: 'q2', question: 'Sipho\'s business sells goods to a customer on credit for R4 500. No cash changes hands. Which journal is used?', math: '',
      options: ['Cash Receipts Journal (CRJ)', 'Cash Payments Journal (CPJ)', 'Debtors Journal (DJ)', 'Creditors Journal (CJ)'],
      correctIndex: 2, hint: 'The customer owes money — they are a debtor. A credit sale creates a debtor.',
      explanation: 'Credit sales (selling on credit without receiving immediate payment) are recorded in the Debtors Journal (DJ). Entry: Dr Debtors R4 500 | Cr Sales R4 500. Source document: tax invoice sent to the customer.'
    },
    {
      id: 'q3', question: 'The business pays the monthly rent of R3 800 by EFT. Which journal records this?', math: '',
      options: ['Cash Receipts Journal (CRJ)', 'Cash Payments Journal (CPJ)', 'General Journal (GJ)', 'Creditors Journal (CJ)'],
      correctIndex: 1, hint: 'Cash is going OUT of the business.',
      explanation: 'Any cash payment is recorded in the Cash Payments Journal (CPJ). The EFT confirmation is the source document. Entry: Dr Rent Expense R3 800 | Cr Bank R3 800.'
    },
    {
      id: 'q4', question: 'A debtor returns R600 worth of goods. The business issues a credit note. Which journal records this?', math: '',
      options: ['Debtors Journal (DJ)', 'Creditors Allowances Journal (CAJ)', 'Debtors Allowances Journal (DAJ)', 'Cash Receipts Journal (CRJ)'],
      correctIndex: 2, hint: 'The debtor is returning goods — this is an allowance granted to a debtor.',
      explanation: 'Returns by debtors (customers returning goods) are recorded in the Debtors Allowances Journal (DAJ). The credit note issued is the source document. Entry: Dr Sales Returns R600 | Cr Debtors R600 — the debtor\'s balance decreases.'
    },
  ],
  remediationQuestions: [
    {
      id: 'r1', question: 'What is the purpose of a journal in accounting?', math: '',
      options: ['To prepare financial statements directly', 'To record transactions in chronological order as the book of first entry', 'To calculate the profit or loss', 'To balance the accounting equation'],
      correctIndex: 1, hint: 'Journals are where transactions are FIRST written down.',
      explanation: 'Journals are books of first entry — transactions are recorded here in date order before being posted to the ledger. They provide a chronological record of all business transactions, organised by type.'
    },
    {
      id: 'r2', question: 'The business buys inventory on credit for R12 000. Which journal records this?', math: '',
      options: ['Cash Payments Journal (CPJ)', 'Creditors Journal (CJ)', 'Debtors Journal (DJ)', 'Cash Receipts Journal (CRJ)'],
      correctIndex: 1, hint: 'Buying on credit creates a creditor — the Creditors Journal records this.',
      explanation: 'Credit purchases (buying without immediately paying cash) are recorded in the Creditors Journal (CJ). A creditor (liability) is created. Entry: Dr Purchases/Inventory R12 000 | Cr Creditor R12 000.'
    },
  ],
  hardQuestions: [
    {
      id: 'h1', question: 'During April, the CRJ shows total debits of R54 000 and the CPJ shows total credits of R37 500. What is the NET change in the Bank account for April?', math: '',
      options: ['R91 500 increase', 'R16 500 increase', 'R37 500 decrease', 'R16 500 decrease'],
      correctIndex: 1, hint: 'CRJ increases Bank (Dr); CPJ decreases Bank (Cr). Net = CRJ − CPJ.',
      explanation: 'CRJ debits Bank by R54 000 (cash in). CPJ credits Bank by R37 500 (cash out). Net change = R54 000 − R37 500 = R16 500 INCREASE in the Bank account balance.'
    },
    {
      id: 'h2', question: 'Which of the following transactions would be recorded in the General Journal (GJ)?', math: '',
      options: [
        'Cash sale of goods R5 000',
        'Credit purchase of inventory R8 000',
        'Depreciation of equipment at year end',
        'Debtor pays outstanding balance R2 300'
      ],
      correctIndex: 2, hint: 'The General Journal handles transactions that don\'t fit any specialised journal.',
      explanation: 'Depreciation is a non-cash entry that doesn\'t involve cash, debtors, or creditors — it is recorded in the General Journal. Other GJ entries include year-end adjustments, bad debts written off, and owner drawings of assets (not cash). Cash transactions go to CRJ/CPJ; credit transactions to DJ/CJ.'
    },
    {
      id: 'h3', question: 'The Debtors Journal for May shows total credit sales of R28 400. What does posting this to the General Ledger mean?', math: '',
      options: [
        'The bank account is debited R28 400',
        'The debtors control account is debited R28 400 and sales is credited R28 400',
        'The creditors account is credited R28 400',
        'The journal total is split into individual invoices only'
      ],
      correctIndex: 1, hint: 'Posting means transferring the journal total to the correct ledger accounts.',
      explanation: 'When the DJ total of R28 400 is posted to the General Ledger: Debtors Control (asset) is debited R28 400 (amounts owed to us increase) and Sales (revenue) is credited R28 400 (income earned). Individual debtor accounts are also updated in the Debtors Subsidiary Ledger.'
    },
    {
      id: 'h4', question: 'Why are specialised journals used instead of recording every transaction in one general journal?', math: '',
      options: [
        'To ensure the accounting equation balances',
        'To save time through batch posting and division of work among bookkeepers',
        'Because GAAP requires at least six journals',
        'To avoid the need for a general ledger'
      ],
      correctIndex: 1, hint: 'Think about efficiency — posting totals is faster than posting every single entry.',
      explanation: 'Specialised journals save time because only the column totals are posted to the General Ledger (not every individual entry). They also allow division of labour — different bookkeepers can handle different journals simultaneously. This reduces errors and improves internal control.'
    },
  ],
}

const SUBJECT = 'Accounting'
const GRADE = 10
const TOPIC_ID = 'journals-in-accounting'
const NEXT_TOPIC_ID = 'general-ledger'
const STORAGE_KEY_PREFIX = 'scratchpad_journals_'

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
  const pct = score / total; const mastered = pct >= 2 / 3
  return (
    <div className="max-w-md mx-auto text-center space-y-6">
      <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto ${mastered ? 'bg-slate-100' : 'bg-slate-100'}`}>
        {mastered ? <Award className="w-10 h-10 text-slate-600" /> : <AlertCircle className="w-10 h-10 text-slate-600" />}
      </div>
      <div><p className="text-3xl font-bold text-slate-900">{score}/{total}</p><p className="text-slate-500 mt-1">{mastered ? 'Mastered!' : 'Keep practising'}</p></div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${pct * 100}%` }} className={`h-full rounded-full ${mastered ? 'bg-slate-500' : 'bg-slate-400'}`} />
      </div>
      <div className="flex flex-col gap-3">
        {mastered
          ? <button onClick={onContinue} className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-600 text-white rounded-xl hover:bg-slate-700 transition-colors font-medium">Next: {nextTopicName} <ArrowRight className="w-4 h-4" /></button>
          : <>
              <button onClick={onRetry} className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-700 transition-colors font-medium"><RotateCcw className="w-4 h-4" /> Try Again</button>
              <button onClick={onContinue} className="px-6 py-2.5 text-slate-600 hover:text-slate-900 transition-colors text-sm">Continue anyway</button>
            </>
        }
      </div>
    </div>
  )
}

function JournalsInAccountingPage({ onNavigate }: { onNavigate: (page: any) => void }) {
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

  const handlePracticeComplete = async (score: number) => { setPracticeScore(score); await saveProgress(score, TOPIC.initialQuestions.length); if (score === 0) setView('remediation'); else setView('feedback') }
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
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Topic 5</p>
                    <h3 className="font-semibold text-slate-900">{TOPIC.title}</h3>
                  </div>
                  {statusBadge(thisStatus)}
                </div>
                <p className="text-sm text-slate-500">{TOPIC.description}</p>
              </div>
              <button onClick={() => onNavigate('learning-accounting-g10-t1-ledger' as AppPage)} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 text-left hover:border-slate-300 hover:shadow-sm transition-all group">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Next — Topic 6</p>
                    <h3 className="font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">The General Ledger</h3>
                  </div>
                  {statusBadge(nextStatus)}
                </div>
                <p className="text-sm text-slate-400">Posting journal entries to T-accounts and balancing the ledger.</p>
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
              onContinue={() => onNavigate('learning-accounting-g10-t1-ledger' as AppPage)} nextTopicName="The General Ledger" />
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

export default JournalsInAccountingPage
