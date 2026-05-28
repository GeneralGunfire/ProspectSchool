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
  id: 'source-documents',
  title: 'Source Documents',
  description: 'The original documents that provide evidence for every business transaction.',
  interactiveSteps: [
    {
      id: 'step-1', title: 'What Are Source Documents?', content: 'A source document is an original written record that provides evidence that a transaction took place. It is the starting point of the accounting process — no journal entry may be made without a source document. They ensure that financial records are reliable and verifiable.',
      math: ['Transaction', '→', 'Source Doc', '→', 'Journal'],
      bubbles: [{ target: 'Source Doc', text: 'The proof it happened', pos: 'top' as const }, { target: 'Journal', text: 'Where it is recorded', pos: 'bottom' as const }]
    },
    {
      id: 'step-2', title: 'Invoices and Credit Notes', content: 'A tax invoice is issued by the seller when goods or services are sold on credit. It shows what was sold, the quantity, price, VAT, and payment terms. A credit note is issued by the seller to correct an overcharge or acknowledge returned goods — it cancels part or all of an invoice.',
      math: ['Invoice', '→', 'Dr Debtor', '|', 'Credit Note', '→', 'Cr Debtor'],
      bubbles: [{ target: 'Invoice', text: 'Seller issues this on credit sale', pos: 'top' as const }, { target: 'Credit Note', text: 'Reduces the debtor\'s balance', pos: 'bottom' as const }]
    },
    {
      id: 'step-3', title: 'Receipts and EFT Confirmations', content: 'A receipt is issued by the seller when payment is received — it proves cash came in. An EFT (Electronic Funds Transfer) confirmation or bank statement entry serves the same purpose for electronic payments. These documents trigger entries in the cash receipts journal.',
      math: ['Receipt', '=', 'Proof of', 'Cash', 'Received'],
      bubbles: [{ target: 'Receipt', text: 'Issued when cash is paid', pos: 'top' as const }, { target: 'Cash', text: 'Asset — recorded in CRJ', pos: 'bottom' as const }]
    },
    {
      id: 'step-4', title: 'Cheques, Petty Cash Vouchers and Debit Notes', content: 'A cheque (or EFT) is proof the business made a payment — recorded in the Cash Payments Journal (CPJ). A petty cash voucher authorises small cash payments from petty cash. A debit note is issued by the BUYER to notify the seller of returned goods — it is the buyer\'s version of a credit note.',
      math: ['Cheque/EFT', '→', 'CPJ', '|', 'Debit Note', '→', 'Buyer'],
      bubbles: [{ target: 'Cheque/EFT', text: 'Proof of payment made', pos: 'top' as const }, { target: 'Debit Note', text: 'Buyer returns goods', pos: 'bottom' as const }]
    },
  ],
  guidedItem: {
    problem: 'Lerato\'s business buys R3 600 of stationery on credit from Pens & More (Pty) Ltd. The supplier issues an invoice. Later Lerato returns R400 of damaged goods and the supplier issues a credit note. Identify the source documents and state the effect on Lerato\'s books.',
    steps: [
      { id: 1, instruction: 'Identify the source document for the purchase', math: 'Tax Invoice issued by Pens & More (Pty) Ltd — R3 600', explanation: 'When buying on credit the seller issues a tax invoice. This is Lerato\'s source document. It triggers an entry in the Creditors Journal (purchases journal): Dr Stationery R3 600 | Cr Creditor (Pens & More) R3 600.' },
      { id: 2, instruction: 'Identify the source document for the return', math: 'Credit Note issued by Pens & More — R400 (OR Lerato issues a Debit Note)', explanation: 'When goods are returned the seller issues a credit note to reduce what the buyer owes. Alternatively the buyer may send the seller a debit note first. The effect: Dr Creditor (Pens & More) R400 | Cr Stationery R400 — the liability decreases.' },
      { id: 3, instruction: 'State Lerato\'s net liability after the return', math: 'Net owed = R3 600 − R400 = R3 200', explanation: 'After the credit note the balance on the Pens & More creditor account is R3 200. Lerato still owes this amount and must pay it by the due date. Source documents are kept as evidence for both the original purchase and the return.' },
    ]
  },
  initialQuestions: [
    {
      id: 'q1', question: 'Which source document is issued by the SELLER when goods are sold on credit?', math: '',
      options: ['Receipt', 'Debit note', 'Tax invoice', 'Petty cash voucher'],
      correctIndex: 2, hint: 'The seller provides proof of what was sold and the amount owed.',
      explanation: 'A tax invoice is issued by the seller for credit sales. It shows the goods/services provided, quantities, prices, VAT, and payment terms. The buyer records this as a creditor (liability); the seller records the buyer as a debtor (asset).'
    },
    {
      id: 'q2', question: 'A credit note is issued when:', math: '',
      options: ['A cash sale is made', 'Goods are returned or an overcharge must be corrected', 'A cheque payment is made', 'Petty cash is replenished'],
      correctIndex: 1, hint: 'A credit note reduces what the buyer owes the seller.',
      explanation: 'A credit note is issued by the seller to reduce the debtor\'s balance. It is used when goods are returned (incorrect, damaged, or not ordered) or when an overcharge occurred on the original invoice. It cancels part or all of the original invoice.'
    },
    {
      id: 'q3', question: 'Lerato pays the full R3 200 balance she owes to Pens & More by EFT. What is the source document?', math: '',
      options: ['Tax invoice', 'Credit note', 'EFT confirmation / bank statement', 'Petty cash voucher'],
      correctIndex: 2, hint: 'Electronic payments are evidenced by a bank record or EFT confirmation.',
      explanation: 'An EFT (Electronic Funds Transfer) confirmation or a bank statement entry serves as the source document for an electronic payment. It proves that the payment was made. This triggers an entry in Lerato\'s Cash Payments Journal: Dr Creditor R3 200 | Cr Bank R3 200.'
    },
    {
      id: 'q4', question: 'Which document authorises a small cash payment made from the petty cash box?', math: '',
      options: ['Tax invoice', 'Cheque', 'Petty cash voucher', 'Debit note'],
      correctIndex: 2, hint: 'Small everyday expenses are paid from petty cash — a special document authorises each payment.',
      explanation: 'A petty cash voucher is completed and signed before any payment is made from the petty cash fund. It records the date, amount, reason, and signatures. It is the source document for the Petty Cash Journal.'
    },
  ],
  remediationQuestions: [
    {
      id: 'r1', question: 'What is the purpose of a source document?', math: '',
      options: ['To calculate profit at year end', 'To provide written evidence that a transaction took place', 'To record the journal entry', 'To prepare the trial balance'],
      correctIndex: 1, hint: 'Think about WHY we need proof before recording anything.',
      explanation: 'A source document provides written evidence that a business transaction actually occurred. Without it, a transaction cannot be recorded. It is the starting point of the entire accounting cycle and ensures that records are reliable and verifiable.'
    },
    {
      id: 'r2', question: 'Which source document does the BUYER issue to notify the seller of returned goods?', math: '',
      options: ['Credit note', 'Receipt', 'Debit note', 'Tax invoice'],
      correctIndex: 2, hint: 'The buyer — not the seller — issues this one.',
      explanation: 'A debit note is issued by the buyer to the seller to notify them that goods are being returned and that the buyer expects a reduction in what they owe. The seller then issues a credit note in response. In the buyer\'s books, the debit note is the source document for the return.'
    },
  ],
  hardQuestions: [
    {
      id: 'h1', question: 'Siya\'s business has a petty cash float of R500. He pays R80 for printer paper, R45 for cleaning supplies, and R120 for postage. What is the balance remaining in the petty cash box?', math: 'Petty cash float R500',
      options: ['R255', 'R245', 'R300', 'R175'],
      correctIndex: 0, hint: 'Subtract all payments from the float.',
      explanation: 'Payments: R80 + R45 + R120 = R245. Remaining balance: R500 − R245 = R255. Each of these payments required a signed petty cash voucher as a source document. The petty cash box should now contain R255 in cash plus R245 in vouchers = R500 (the float).'
    },
    {
      id: 'h2', question: 'A business buys goods worth R9 200 on credit. The supplier then issues a credit note for R1 150 for returned goods. What is the correct journal entry for the credit note in the BUYER\'s books?', math: '',
      options: [
        'Dr Creditor R1 150 | Cr Purchases R1 150',
        'Dr Purchases R1 150 | Cr Creditor R1 150',
        'Dr Creditor R1 150 | Cr Bank R1 150',
        'Dr Sales Returns R1 150 | Cr Creditor R1 150'
      ],
      correctIndex: 0, hint: 'The return reduces the liability (creditor) and reduces the purchases/inventory.',
      explanation: 'When the buyer returns goods: the creditor account (liability) decreases — debit the creditor. Purchases/inventory also decrease — credit Purchases/Returns. Entry: Dr Creditor R1 150 | Cr Purchases Returns R1 150. Note: option A says "Purchases" which in context means the Purchases Returns account — the liability is reduced and so is the asset/expense.'
    },
    {
      id: 'h3', question: 'Which combination of source documents would you expect to find in a Cash Receipts Journal (CRJ)?', math: '',
      options: [
        'Tax invoices and debit notes',
        'Receipts, EFT confirmations, and bank deposit slips',
        'Cheques and EFT payment confirmations',
        'Petty cash vouchers and credit notes'
      ],
      correctIndex: 1, hint: 'The CRJ records all cash coming IN to the business.',
      explanation: 'The Cash Receipts Journal records all cash received by the business. Source documents for cash receipts include receipts issued to customers, EFT confirmation from the bank, and bank deposit slips. Cheques/EFT payments go in the CPJ (cash payments); invoices go in the Creditors Journal.'
    },
    {
      id: 'h4', question: 'Why must every journal entry be supported by a source document?', math: '',
      options: [
        'To comply with the matching principle',
        'To satisfy the GAAP principles of reliability and verifiability — records must be based on objective evidence',
        'To calculate the correct tax amount',
        'To ensure the trial balance agrees'
      ],
      correctIndex: 1, hint: 'Think about GAAP and what makes financial information trustworthy.',
      explanation: 'GAAP requires that financial information is reliable (free from bias) and verifiable (based on objective evidence). Source documents provide that evidence — they are external or signed records of what actually occurred. Without them, financial statements could be manipulated or contain errors that cannot be investigated.'
    },
  ],
}

const SUBJECT = 'Accounting'
const GRADE = 10
const TOPIC_ID = 'source-documents'
const NEXT_TOPIC_ID = 'journals-in-accounting'
const STORAGE_KEY_PREFIX = 'scratchpad_source-documents_'

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

function SourceDocumentsPage({ onNavigate }: { onNavigate: (page: any) => void }) {
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
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Topic 4</p>
                    <h3 className="font-semibold text-slate-900">{TOPIC.title}</h3>
                  </div>
                  {statusBadge(thisStatus)}
                </div>
                <p className="text-sm text-slate-500">{TOPIC.description}</p>
              </div>
              <button onClick={() => onNavigate('learning-accounting-g10-t1-journals' as AppPage)} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 text-left hover:border-slate-300 hover:shadow-sm transition-all group">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Next — Topic 5</p>
                    <h3 className="font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">Journals in Accounting</h3>
                  </div>
                  {statusBadge(nextStatus)}
                </div>
                <p className="text-sm text-slate-400">The specialised journals used to record different types of transactions.</p>
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
              onContinue={() => onNavigate('learning-accounting-g10-t1-journals' as AppPage)} nextTopicName="Journals in Accounting" />
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

export default SourceDocumentsPage
