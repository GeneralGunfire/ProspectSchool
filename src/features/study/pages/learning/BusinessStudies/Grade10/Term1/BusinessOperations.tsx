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
  id: 'business-operations',
  title: 'Business Operations',
  description: 'The four core business functions: production, HR, marketing, and finance.',
  interactiveSteps: [
    {
      id: 'step-1',
      title: 'The Four Business Functions',
      content: 'Every business, regardless of size, performs four core functions to operate successfully. These are: Production (creating the product/service), Human Resources (managing people), Marketing (reaching customers), and Finance (managing money). Each function supports the others — they are interdependent.',
      math: ['Production', '|', 'HR', '|', 'Marketing', '|', 'Finance'],
      bubbles: [
        { target: 'Production', text: 'Creating goods or services', pos: 'top' as const },
        { target: 'Finance', text: 'Managing money flows', pos: 'bottom' as const }
      ]
    },
    {
      id: 'step-2',
      title: 'Production Function',
      content: 'The production function is responsible for transforming inputs (raw materials, labour, machinery) into outputs (products or services). It manages quality control, capacity planning, and efficiency. Key decisions: What to produce? How much? With what processes? Production affects cost, quality, and delivery speed.',
      math: ['Inputs', '→', 'Process', '→', 'Output'],
      bubbles: [
        { target: 'Inputs', text: 'Materials, labour, machines', pos: 'top' as const },
        { target: 'Output', text: 'Goods or services', pos: 'bottom' as const }
      ]
    },
    {
      id: 'step-3',
      title: 'Human Resources & Marketing',
      content: 'Human Resources (HR) recruits, trains, motivates, and retains employees. It handles salaries, benefits, performance management, and labour law compliance. Marketing identifies customer needs and creates awareness: the 4 Ps — Product (what), Price (how much), Place (where), Promotion (how communicated).',
      math: ['4Ps', '=', 'Product', '+', 'Price', '+', 'Place', '+', 'Promotion'],
      bubbles: [
        { target: 'Product', text: 'What the business sells', pos: 'top' as const },
        { target: 'Promotion', text: 'Advertising and communication', pos: 'bottom' as const }
      ]
    },
    {
      id: 'step-4',
      title: 'The Finance Function',
      content: 'The finance function manages money: budgeting, recording transactions, producing financial statements, securing funding, and managing cash flow. Without finance, no other function can operate. Key documents: Income Statement (profit/loss), Balance Sheet (assets and liabilities), and Cash Flow Statement.',
      math: ['Revenue', '−', 'Expenses', '=', 'Profit'],
      bubbles: [
        { target: 'Revenue', text: 'Money earned from sales', pos: 'top' as const },
        { target: 'Profit', text: 'What remains for the owner', pos: 'bottom' as const }
      ]
    },
  ],
  guidedItem: {
    problem: 'Thabo runs a bakery that makes and sells bread. Identify which business function is responsible for each activity below.',
    steps: [
      { id: 1, instruction: 'Baking 200 loaves of bread per day using flour, ovens, and bakers', math: 'PRODUCTION Function', explanation: 'Baking is the core production activity — inputs (flour, yeast, water, baker\'s labour) are transformed into an output (bread). The production function manages this transformation process, including quality control (consistent taste and texture) and capacity (how many loaves per day).' },
      { id: 2, instruction: 'Advertising the bakery on a community Facebook group with photos', math: 'MARKETING Function — Promotion (one of the 4 Ps)', explanation: 'Advertising on social media is a promotional activity under the marketing function. The marketing function uses the 4 Ps: the Product is bread, the Price is set, the Place is the bakery location, and Promotion includes social media advertising to attract customers.' },
      { id: 3, instruction: 'Hiring a new cashier and training them on the till system', math: 'HUMAN RESOURCES Function', explanation: 'Recruiting and training staff is the core responsibility of Human Resources. HR ensures the business has the right people with the right skills. It handles job advertisements, interviews, onboarding, training, and ongoing performance management.' },
      { id: 4, instruction: 'Calculating whether the bakery made a profit this month', math: 'FINANCE Function — Income Statement', explanation: 'Calculating profit (Revenue − Expenses) is a finance function activity. The Finance department records all sales (revenue) and costs (flour, utilities, wages, rent), then produces an Income Statement showing whether the business made a profit or a loss for the period.' },
    ]
  },
  initialQuestions: [
    {
      id: 'q1', question: 'A clothing factory installs new sewing machines to make 500 shirts per day instead of 200. Which business function is most responsible for this decision?', math: '',
      options: ['Human Resources — hiring more workers', 'Production — improving capacity and efficiency', 'Marketing — increasing the product range', 'Finance — reducing the budget'],
      correctIndex: 1, hint: 'Adding machinery to increase output is about the process of making the product.',
      explanation: 'Expanding production capacity (from 200 to 500 shirts per day) by installing new machines is a Production function decision. Production manages how goods are made, with what equipment, and at what volume. HR, Marketing, and Finance are also affected but the primary function is Production.'
    },
    {
      id: 'q2', question: 'A business runs a "buy one get one free" promotion. Which of the 4 Ps of marketing does this represent?', math: '',
      options: ['Product', 'Price', 'Place', 'Promotion'],
      correctIndex: 1, hint: 'A discount or special deal affects the amount the customer pays.',
      explanation: '"Buy one get one free" is a PRICE strategy — it changes the effective price the customer pays (half price per item). Price includes all pricing tactics: discounts, promotions, payment terms, and value perception. It could also be seen as Promotion (attracting attention), but in the 4 Ps framework, changing value offered per rand spent falls under Price.'
    },
    {
      id: 'q3', question: 'A company\'s HR department discovers that employee turnover is very high. What is the MOST likely cause, and how should HR respond?', math: '',
      options: ['Poor production quality — HR should retrain the production team', 'Low wages or poor working conditions — HR should review compensation and working environment', 'Ineffective marketing — HR should improve the company\'s social media presence', 'High debt — HR should reduce staff numbers immediately'],
      correctIndex: 1, hint: 'High turnover means employees are leaving. What makes people leave a job?',
      explanation: 'High employee turnover is typically caused by low wages, poor working conditions, lack of career growth, or management issues — all areas HR manages. The appropriate response is a review of the compensation structure, working conditions, and employee satisfaction (exit interviews). Reducing staff would worsen the problem.'
    },
    {
      id: 'q4', question: 'A business has R500 000 in revenue and R420 000 in expenses for the year. What is the profit, and which function would report this?', math: 'Revenue − Expenses = Profit',
      options: ['R80 000 profit — reported by the Marketing function', 'R920 000 profit — reported by the Production function', 'R80 000 profit — reported by the Finance function', 'R420 000 profit — reported by the HR function'],
      correctIndex: 2, hint: 'Subtract expenses from revenue, then identify which function manages financial reporting.',
      explanation: 'Profit = R500 000 − R420 000 = R80 000. The Finance function is responsible for calculating and reporting profit through the Income Statement. Finance records all revenue (money in) and expenses (money out) and produces financial statements that the owner and management use to assess business performance.'
    },
  ],
  remediationQuestions: [
    {
      id: 'r1', question: 'Which business function is responsible for finding and keeping good employees?', math: '',
      options: ['Production', 'Marketing', 'Human Resources', 'Finance'],
      correctIndex: 2, hint: 'Think about which function deals specifically with people inside the organisation.',
      explanation: 'Human Resources (HR) is responsible for recruiting, training, motivating, and retaining employees. HR ensures the business has qualified, motivated staff, handles payroll and benefits, manages performance appraisals, and ensures compliance with labour laws like the Basic Conditions of Employment Act.'
    },
    {
      id: 'r2', question: 'Place, as one of the 4 Ps of marketing, refers to:', math: '',
      options: ['Where the business\'s offices are located', 'How the product is distributed and made available to customers', 'The physical appearance of the product', 'The price at which the product is sold'],
      correctIndex: 1, hint: 'Place is about getting the product from the business to the customer.',
      explanation: 'Place in the 4 Ps refers to distribution — how and where the product is made available to customers. It includes the physical store location, online sales channels, delivery methods, and distribution networks. The goal is to make the product accessible to customers where and when they want it.'
    },
  ],
  hardQuestions: [
    {
      id: 'h1', question: 'How do the four business functions depend on each other? Give an example.', math: '',
      options: ['They are completely independent — each function can work without the others', 'They are fully interdependent — a problem in one function always affects the others', 'Only Finance and Production are linked — HR and Marketing work independently', 'Only HR and Marketing are linked — the rest are independent'],
      correctIndex: 1, hint: 'Think: if the finance function runs out of money, what happens to production, HR, and marketing?',
      explanation: 'All four functions are interdependent. If Finance runs out of money: Production cannot buy raw materials, HR cannot pay wages (staff leave), and Marketing cannot fund advertising (sales fall). Equally, if Production quality fails, Marketing cannot sell the product, Finance loses revenue, and HR faces pressure from performance failures. Problems cascade across all functions.'
    },
    {
      id: 'h2', question: 'A business sells its products online across South Africa instead of through physical stores. Which of the 4 Ps has changed, and what is the likely benefit?', math: '',
      options: ['Product has changed — the business now makes digital goods', 'Price has changed — online products are always cheaper', 'Place has changed — distribution is now national via e-commerce', 'Promotion has changed — the business now advertises online'],
      correctIndex: 2, hint: 'How the product reaches the customer is the definition of Place.',
      explanation: 'Moving from physical stores to online sales is a Place (distribution) change in the 4 Ps. The benefit is wider reach — instead of serving a local area, the business can sell nationally (or globally). This can increase revenue without proportional cost increases, assuming the logistics (courier services, returns) are well managed.'
    },
    {
      id: 'h3', question: 'A business is growing rapidly but its cashflow is consistently negative (more money going out than coming in). Which function must address this, and what are TWO possible solutions?', math: '',
      options: ['HR function — hire fewer people and reduce the wage bill', 'Finance function — improve debtor collection and negotiate better supplier payment terms', 'Production function — produce more goods to increase revenue faster', 'Marketing function — increase advertising spend to attract more customers'],
      correctIndex: 1, hint: 'Cashflow is a finance problem — what two things control when money comes in and goes out?',
      explanation: 'Negative cashflow is a Finance function problem. Two key solutions: (1) Improve debtor collection — chase customers who owe money faster so cash comes in sooner; (2) Negotiate extended payment terms with suppliers — delay when cash goes out. Together, these narrow the cashflow gap. Increasing production or advertising could worsen cashflow before improving it.'
    },
    {
      id: 'h4', question: 'Why is quality control in the Production function important for the Marketing function?', math: '',
      options: ['It is not important — Marketing and Production operate independently', 'Poor quality products lead to negative word-of-mouth, returns, and damaged brand reputation — harming marketing efforts', 'Quality control only matters for the Finance function\'s cost calculations', 'Better quality always means lower production costs'],
      correctIndex: 1, hint: 'Think about what happens to a brand when customers receive defective products.',
      explanation: 'Quality control in Production directly impacts Marketing. If products are defective, customers return them, leave negative reviews, and spread negative word-of-mouth. This damages brand reputation — the core asset that Marketing builds. Marketing\'s job becomes far harder (and more expensive) when it must overcome a reputation for poor quality. This is a clear example of interdependence between Production and Marketing.'
    },
  ],
}

const SUBJECT = 'Business Studies'
const GRADE = 10
const TOPIC_ID = 'business-operations'
const STORAGE_KEY_PREFIX = 'scratchpad_biz-operations_'

function SpeechBubble({ text, position }: { text: string; position: 'top' | 'bottom' }) {
  return (
    <motion.div initial={{ opacity: 0, y: position === 'top' ? 8 : -8 }} animate={{ opacity: 1, y: 0 }}
      className={`absolute ${position === 'top' ? '-top-12' : '-bottom-12'} left-1/2 -translate-x-1/2 z-10`}>
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
        <div className="flex gap-1.5">{TOPIC.interactiveSteps.map((_, i) => <div key={i} className={`h-1.5 w-8 rounded-full transition-colors ${i <= step ? 'bg-slate-600' : 'bg-slate-200'}`} />)}</div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={current.id} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6">
          <h3 className="text-xl font-semibold text-slate-900">{current.title}</h3>
          <p className="text-slate-600 leading-relaxed">{current.content}</p>
          <div className="bg-slate-50 rounded-xl p-6">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-4">Tap an element to learn more</p>
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {current.math.map((token, i) => {
                const bubble = current.bubbles.find(b => b.target === token)
                const isActive = activeBubble === token
                  return (
                  <div key={i} className="relative">
                    {bubble && isActive && <SpeechBubble text={bubble.text} position={bubble.pos} />}
                    <button onClick={() => setActiveBubble(isActive ? null : token)}
                      className={`px-3 py-2 rounded-lg font-mono text-xs font-semibold transition-all ${bubble ? (isActive ? 'bg-slate-600 text-white shadow-md scale-105' : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100') : 'bg-white text-slate-400 border border-slate-200 cursor-default'}`}>
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
        <button onClick={() => { setStep(s => s - 1); setActiveBubble(null) }} disabled={step === 0} className="flex items-center gap-2 px-4 py-2 text-slate-600 disabled:opacity-30 hover:text-slate-900 transition-colors"><ChevronLeft className="w-4 h-4" /> Previous</button>
        {step < TOPIC.interactiveSteps.length - 1
          ? <button onClick={() => { setStep(s => s + 1); setActiveBubble(null) }} className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-700 transition-colors font-medium">Next <ChevronRight className="w-4 h-4" /></button>
          : <button onClick={onComplete} className="flex items-center gap-2 px-5 py-2.5 bg-slate-600 text-white rounded-xl hover:bg-slate-700 transition-colors font-medium">Try a Worked Example <ArrowRight className="w-4 h-4" /></button>
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
  const saveHistory = useCallback(() => {
    const canvas = canvasRef.current; const ctx = canvas?.getContext('2d'); if (!canvas || !ctx) return
    setHistory(h => [...h.slice(-29), ctx.getImageData(0, 0, canvas.width, canvas.height)])
  }, [])
  const onPointerDown = (e: React.PointerEvent) => { saveHistory(); setIsDrawing(true); lastPos.current = getPos(e); canvasRef.current?.setPointerCapture(e.pointerId) }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDrawing || !lastPos.current) return
    const canvas = canvasRef.current; const ctx = canvas?.getContext('2d'); if (!canvas || !ctx) return
    const pos = getPos(e)
    ctx.beginPath(); ctx.moveTo(lastPos.current.x, lastPos.current.y); ctx.lineTo(pos.x, pos.y)
    ctx.strokeStyle = tool === 'pen' ? '#1e293b' : '#ffffff'; ctx.lineWidth = tool === 'pen' ? 2 : 18; ctx.lineCap = 'round'; ctx.stroke()
    lastPos.current = pos
  }
  const onPointerUp = () => { setIsDrawing(false); lastPos.current = null; const canvas = canvasRef.current; if (canvas) localStorage.setItem(storageKey, canvas.toDataURL()) }
  const undo = () => {
    if (!history.length) return
    const canvas = canvasRef.current; const ctx = canvas?.getContext('2d'); if (!canvas || !ctx) return
    ctx.putImageData(history[history.length - 1], 0, 0); setHistory(h => h.slice(0, -1)); localStorage.setItem(storageKey, canvas.toDataURL())
  }
  const clear = () => {
    const canvas = canvasRef.current; const ctx = canvas?.getContext('2d'); if (!canvas || !ctx) return
    saveHistory(); ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, canvas.width, canvas.height); localStorage.removeItem(storageKey)
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col" style={{ height: '520px' }}>
        <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100">
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
  const [stepIdx, setStepIdx] = useState(0); const [revealed, setRevealed] = useState(false); const [scratchpadStep, setScratchpadStep] = useState<string | null>(null)
  const step = TOPIC.guidedItem.steps[stepIdx]
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {scratchpadStep && <ScratchpadModal stepKey={scratchpadStep} onClose={() => setScratchpadStep(null)} />}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4"><div className="flex items-start gap-3"><Lightbulb className="w-5 h-5 text-slate-600 mt-0.5 shrink-0" /><div><p className="font-medium text-slate-900 text-sm mb-1">Worked Example</p><p className="text-slate-800 text-xs leading-relaxed">{TOPIC.guidedItem.problem}</p></div></div></div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {TOPIC.guidedItem.steps.map((s, i) => <button key={s.id} onClick={() => { setStepIdx(i); setRevealed(false) }} className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${i === stepIdx ? 'bg-slate-900 text-white' : i < stepIdx ? 'bg-slate-100 text-slate-700' : 'bg-slate-100 text-slate-500'}`}>Step {s.id}</button>)}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={step.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
          <div className="flex items-start justify-between gap-4">
            <p className="font-medium text-slate-800">{step.instruction}</p>
            <button onClick={() => setScratchpadStep(`step-${step.id}`)} className="shrink-0 flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-700 transition-colors border border-slate-200 rounded-lg px-2 py-1"><NotebookPen className="w-3.5 h-3.5" /> Notes</button>
          </div>
          <div className="bg-slate-50 border border-slate-100 rounded-xl px-5 py-4 text-xs font-semibold text-slate-900 text-center">{step.math}</div>
          {!revealed ? <button onClick={() => setRevealed(true)} className="w-full py-2.5 border-2 border-dashed border-slate-200 rounded-xl text-sm text-slate-400 hover:border-slate-300 hover:text-slate-600 transition-colors">Reveal explanation</button>
            : <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-slate-50 border border-slate-100 rounded-xl p-3"><p className="text-slate-800 text-xs leading-relaxed">{step.explanation}</p></motion.div>}
        </motion.div>
      </AnimatePresence>
      <div className="flex justify-between">
        <button onClick={() => { setStepIdx(s => s - 1); setRevealed(false) }} disabled={stepIdx === 0} className="flex items-center gap-2 px-4 py-2 text-slate-600 disabled:opacity-30 hover:text-slate-900 transition-colors"><ChevronLeft className="w-4 h-4" /> Previous</button>
        {stepIdx < TOPIC.guidedItem.steps.length - 1
          ? <button onClick={() => { setStepIdx(s => s + 1); setRevealed(false) }} className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-700 transition-colors font-medium">Next Step <ChevronRight className="w-4 h-4" /></button>
          : <button onClick={onComplete} className="flex items-center gap-2 px-5 py-2.5 bg-slate-600 text-white rounded-xl hover:bg-slate-700 transition-colors font-medium">Start Practice <ArrowRight className="w-4 h-4" /></button>}
      </div>
    </div>
  )
}

function PracticeModule({ questions, onComplete }: { questions: Question[]; onComplete: (score: number) => void }) {
  const [idx, setIdx] = useState(0); const [selected, setSelected] = useState<number | null>(null); const [confirmed, setConfirmed] = useState(false); const [score, setScore] = useState(0); const [scratchpadQ, setScratchpadQ] = useState<string | null>(null)
  const q = questions[idx]
  const confirm = () => { if (selected === null) return; setConfirmed(true); if (selected === q.correctIndex) setScore(s => s + 1) }
  const next = () => { if (idx < questions.length - 1) { setIdx(i => i + 1); setSelected(null); setConfirmed(false) } else onComplete(score + (selected === q.correctIndex ? 1 : 0)) }
  return (
    <div className="max-w-2xl mx-auto space-y-3">
      {scratchpadQ && <ScratchpadModal stepKey={scratchpadQ} onClose={() => setScratchpadQ(null)} />}
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-500">Question {idx + 1} of {questions.length}</span>
        <button onClick={() => setScratchpadQ(`q-${q.id}`)} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-700 transition-colors border border-slate-200 rounded-lg px-2 py-1"><NotebookPen className="w-3.5 h-3.5" /> Scratchpad</button>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={q.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
          <p className="font-medium text-slate-900 leading-relaxed">{q.question}</p>
          {q.math && <div className="bg-slate-50 rounded-xl px-3 py-2 text-sm text-slate-700 text-center font-mono">{q.math}</div>}
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
          {!confirmed && selected !== null && <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-start gap-2"><Info className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" /><p className="text-slate-700 text-xs">{q.hint}</p></div>}
          {confirmed && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`rounded-xl p-3 ${selected === q.correctIndex ? 'bg-slate-50 border border-slate-100' : 'bg-slate-50 border border-slate-100'}`}><p className={`text-xs leading-relaxed ${selected === q.correctIndex ? 'text-slate-800' : 'text-slate-800'}`}>{q.explanation}</p></motion.div>}
        </motion.div>
      </AnimatePresence>
      <div className="flex justify-end">
        {!confirmed ? <button onClick={confirm} disabled={selected === null} className="px-5 py-2.5 bg-slate-900 text-white rounded-xl disabled:opacity-30 hover:bg-slate-700 transition-colors font-medium">Check Answer</button>
          : <button onClick={next} className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-700 transition-colors font-medium">{idx < questions.length - 1 ? 'Next Question' : 'See Results'} <ArrowRight className="w-4 h-4" /></button>}
      </div>
    </div>
  )
}

function FeedbackModule({ score, total, onRetry, onContinue }: { score: number; total: number; onRetry: () => void; onContinue: () => void }) {
  const pct = score / total; const mastered = pct >= 2 / 3
  return (
    <div className="max-w-md mx-auto text-center space-y-6">
      <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto ${mastered ? 'bg-slate-100' : 'bg-slate-100'}`}>{mastered ? <Award className="w-8 h-8 text-slate-600" /> : <AlertCircle className="w-8 h-8 text-slate-600" />}</div>
      <div><p className="text-3xl font-bold text-slate-900">{score}/{total}</p><p className="text-slate-500 mt-1">{mastered ? 'Mastered!' : 'Keep practising'}</p></div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${pct * 100}%` }} className={`h-full rounded-full ${mastered ? 'bg-slate-500' : 'bg-slate-400'}`} /></div>
      <div className="flex flex-col gap-3">
        <button onClick={onContinue} className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-600 text-white rounded-xl hover:bg-slate-700 transition-colors font-medium">Back to Library <ArrowRight className="w-4 h-4" /></button>
        {!mastered && <button onClick={onRetry} className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors font-medium"><RotateCcw className="w-4 h-4" /> Try Again</button>}
      </div>
    </div>
  )
}

async function loadTopicStatus(userId: string, topicId: string): Promise<TopicStatus> {
  if (!data) return 'not-started'
  if (data.mastery_level === 'mastered') return 'mastered'
  if (data.mastery_level === 'needs-practice' || data.mastery_level === 'needs_practice') return 'needs-practice'
}
async function saveTopicStatus(userId: string, score: number, total: number) {
  const mastery = score / total >= 2 / 3 ? 'mastered' : 'needs-practice'
}

function BusinessOperationsPage({ onNavigate }: { onNavigate: (page: any) => void }) {
  const session = useStudySession();
  const [view, setView] = useState<ViewState>('overview')
  const [practiceScore, setPracticeScore] = useState(0)
  const [thisStatus, setThisStatus] = useState<TopicStatus>('not-started')
  useEffect(() => { loadTopicStatus(session?.student_id ?? 0, TOPIC_ID).then(setThisStatus) }, [session?.student_id ?? 0])
  const handlePracticeComplete = async (score: number) => { setPracticeScore(score); const st = await saveTopicStatus(session?.student_id ?? 0, score, TOPIC.initialQuestions.length); setThisStatus(st); if (score === 0) setView('remediation'); else setView('feedback') }
  const handleRemediationComplete = async (score: number) => { await saveTopicStatus(session?.student_id ?? 0, score, TOPIC.remediationQuestions.length); setView('feedback') }
  const handleHardComplete = async (score: number) => { await saveTopicStatus(session?.student_id ?? 0, score, TOPIC.hardQuestions.length); setView('feedback') }
  const statusLabel = (s: TopicStatus) => {
    if (s === 'mastered') return <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">✓ Mastered</span>
    if (s === 'needs-practice') return <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">Needs Practice</span>
  }
  return (
    <div className="min-h-screen" style={{ background: 'oklch(98.5% 0.005 80)' }}>
      <main className="max-w-4xl mx-auto px-4 pt-24 pb-16">
        {view === 'overview' && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div><p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Business Studies · Grade 10 · Term 1</p><h1 className="text-3xl font-bold text-slate-900">Topics</h1></div>
            <div className="space-y-3">
              <button onClick={() => setView('interactive-lesson')} className="w-full bg-white rounded-2xl border border-slate-200 p-4 flex items-center justify-between hover:border-slate-300 hover:shadow-md transition-all group text-left">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold shrink-0 ${thisStatus === 'mastered' ? 'bg-slate-500 text-white' : 'bg-slate-900 text-white'}`}>{thisStatus === 'mastered' ? '✓' : '4'}</div>
                  <div><p className="font-semibold text-slate-900">{TOPIC.title}</p><p className="text-sm text-slate-500 mt-0.5">{TOPIC.description}</p><div className="mt-2">{statusLabel(thisStatus)}</div></div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-600 transition-colors shrink-0" />
              </button>
              {/* All Term 1 topics complete card */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-500 flex items-center justify-center text-white shrink-0"><Award className="w-6 h-6" /></div>
                  <div><p className="font-semibold text-slate-900">All Term 1 Topics Complete</p><p className="text-sm text-slate-700 mt-0.5">You have covered all Business Studies Grade 10 Term 1 topics.</p></div>
                </div>
                <button onClick={() => { sessionStorage.setItem('library_return', JSON.stringify({ subjectId: 'business-studies', grade: 10, term: 1 })); onNavigate('library'); }} className="shrink-0 px-4 py-2 bg-slate-600 text-white rounded-xl text-sm font-medium hover:bg-slate-700 transition-colors">Back to Library</button>
              </div>
            </div>
          </motion.div>
        )}
        {view !== 'overview' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <button onClick={() => setView('overview')} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors"><ChevronLeft className="w-4 h-4" /> Back to Topics</button>
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Business Studies · Grade 10</span>
            </div>
            <AnimatePresence mode="wait">
              {view === 'interactive-lesson' && <motion.div key="lesson" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><InteractiveLesson onComplete={() => setView('guided-practice')} /></motion.div>}
              {view === 'guided-practice' && <motion.div key="guided" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><GuidedPracticeModule onComplete={() => setView('practice')} /></motion.div>}
              {view === 'practice' && <motion.div key="practice" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><PracticeModule questions={TOPIC.initialQuestions} onComplete={handlePracticeComplete} /></motion.div>}
              {view === 'remediation' && <motion.div key="remediation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6"><div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-start gap-3"><AlertCircle className="w-5 h-5 text-slate-500 mt-0.5 shrink-0" /><div><p className="font-medium text-slate-900 text-sm">Let's try again</p><p className="text-slate-700 text-sm mt-0.5">Two more questions to build your understanding.</p></div></div><PracticeModule questions={TOPIC.remediationQuestions} onComplete={handleRemediationComplete} /></motion.div>}
              {view === 'practice-more' && <motion.div key="hard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><PracticeModule questions={TOPIC.hardQuestions} onComplete={handleHardComplete} /></motion.div>}
              {view === 'feedback' && <motion.div key="feedback" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><FeedbackModule score={practiceScore} total={TOPIC.initialQuestions.length} onRetry={() => setView('practice')} onContinue={() => { sessionStorage.setItem('library_return', JSON.stringify({ subjectId: 'business-studies', grade: 10, term: 1 })); onNavigate('library'); }} /><div className="mt-6 text-center"><button onClick={() => setView('practice-more')} className="text-sm text-slate-600 hover:text-slate-800 transition-colors underline underline-offset-2">Want harder questions? Try Practice More</button></div></motion.div>}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  )
}

export default BusinessOperationsPage
