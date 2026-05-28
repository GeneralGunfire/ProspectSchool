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
  id: 'business-stakeholders',
  title: 'Business Stakeholders',
  description: 'Internal and external stakeholders, their interests, and how conflicts are managed.',
  interactiveSteps: [
    {
      id: 'step-1',
      title: 'What Is a Stakeholder?',
      content: 'A stakeholder is any person, group, or organisation that has an interest in (or is affected by) the activities and decisions of a business. Stakeholders can gain or lose from what the business does. They are divided into INTERNAL stakeholders (inside the business) and EXTERNAL stakeholders (outside the business).',
      math: ['Internal', '|', 'External'],
      bubbles: [
        { target: 'Internal', text: 'Inside the business', pos: 'top' as const },
        { target: 'External', text: 'Outside — still affected', pos: 'bottom' as const }
      ]
    },
    {
      id: 'step-2',
      title: 'Internal Stakeholders',
      content: 'Internal stakeholders are people who are part of the business organisation itself. They include: Owners/Shareholders (want profit and growth), Managers (want job security and power), Employees (want fair wages, safe conditions, and job security), and in some cases Trade Unions (representing workers). They have a direct stake in daily operations.',
      math: ['Owners', '|', 'Managers', '|', 'Employees'],
      bubbles: [
        { target: 'Owners', text: 'Want dividends and growth', pos: 'top' as const },
        { target: 'Employees', text: 'Want fair pay and security', pos: 'bottom' as const }
      ]
    },
    {
      id: 'step-3',
      title: 'External Stakeholders',
      content: 'External stakeholders are people and groups outside the business who are still significantly affected by its decisions. Examples: Customers (want quality and value), Suppliers (want prompt payment), Government (wants tax revenue and compliance), Local Community (wants jobs and environmental care), and Creditors/Banks (want repayment of loans).',
      math: ['Customers', '|', 'Suppliers', '|', 'Government'],
      bubbles: [
        { target: 'Customers', text: 'Want quality goods/services', pos: 'top' as const },
        { target: 'Government', text: 'Wants tax and compliance', pos: 'bottom' as const }
      ]
    },
    {
      id: 'step-4',
      title: 'Stakeholder Conflict',
      content: 'Stakeholders often have CONFLICTING interests. Owners want maximum profit → may want lower wages (conflict with employees). Employees want higher wages → increases costs (conflict with owners). Businesses want cheap production → may pollute (conflict with community). Managing these conflicts is a key challenge for every business.',
      math: ['Profit', '↔', 'Wages', '↔', 'Environment'],
      bubbles: [
        { target: 'Profit', text: 'Owner priority', pos: 'top' as const },
        { target: 'Environment', text: 'Community priority', pos: 'bottom' as const }
      ]
    },
  ],
  guidedItem: {
    problem: 'A mining company in Limpopo wants to expand its operation. Identify the stakeholder interests and potential conflicts for each group below.',
    steps: [
      { id: 1, instruction: 'Shareholders of the mining company', math: 'Internal stakeholder — want maximum profit and dividends', explanation: 'Shareholders are internal stakeholders who have invested capital in the business. Their primary interest is profit: they want the mine to expand because it should increase production and revenue, leading to higher dividends. They may be willing to accept environmental and labour risks for financial gain.' },
      { id: 2, instruction: 'Mine workers living in the local town', math: 'Internal stakeholder — want job security and safe conditions', explanation: 'Mine workers are internal stakeholders. Expansion is positive for job creation. However, workers want safe working conditions (mining is dangerous) and fair wages. Their interests may conflict with shareholders if the company cuts safety costs to increase profit.' },
      { id: 3, instruction: 'The local community whose water source is nearby', math: 'External stakeholder — want environmental protection', explanation: 'The local community is an external stakeholder. They benefit from local employment but are at risk from water contamination due to mining chemicals. Their interest (environmental protection) directly conflicts with the company\'s interest (cheap, fast expansion).' },
      { id: 4, instruction: 'The South African government', math: 'External stakeholder — wants tax revenue and legal compliance', explanation: 'The government is an external stakeholder with regulatory and fiscal interests. It wants the expansion because it generates corporate tax revenue and employment (reducing unemployment). However, it also requires the company to comply with environmental laws (NEMA), creating a balance between growth and regulation.' },
    ]
  },
  initialQuestions: [
    {
      id: 'q1', question: 'Which of the following is an INTERNAL stakeholder of a retail clothing company?', math: '',
      options: ['A customer returning a defective jacket', 'The local municipality collecting business tax', 'A store manager overseeing daily operations', 'A supplier delivering fabric to the factory'],
      correctIndex: 2, hint: 'Internal stakeholders are PART OF the business organisation itself.',
      explanation: 'The store manager is an internal stakeholder — they work within the business and are directly involved in its operations. Customers, the municipality, and suppliers are all external stakeholders who interact with the business from outside.'
    },
    {
      id: 'q2', question: 'A factory owner wants to reduce costs by cutting employee wages. Which stakeholder conflict does this create?', math: '',
      options: ['Owner vs. Government', 'Owner vs. Employees', 'Employees vs. Customers', 'Suppliers vs. Customers'],
      correctIndex: 1, hint: 'Think about who benefits from lower wages and who loses.',
      explanation: 'Cutting wages benefits the owner (lower costs, higher profit) but harms employees (lower income, reduced quality of life). This is a classic internal stakeholder conflict between owners who prioritise profit and employees who prioritise fair compensation.'
    },
    {
      id: 'q3', question: 'The government is classified as which type of stakeholder, and what is its primary interest?', math: '',
      options: ['Internal stakeholder — wants higher wages for all workers', 'External stakeholder — wants tax revenue and legal compliance', 'Internal stakeholder — wants profit and dividends', 'External stakeholder — wants the business to close down'],
      correctIndex: 1, hint: 'Government is outside the business — and governments collect taxes.',
      explanation: 'Government is an external stakeholder. It has no ownership or employment relationship with the business, but it is significantly affected by business activity through tax revenue, employment statistics, and environmental impact. It requires legal compliance with all applicable laws.'
    },
    {
      id: 'q4', question: 'A business wants to maximise profit by dumping chemical waste illegally. Which stakeholder group would MOST directly oppose this?', math: '',
      options: ['Shareholders', 'Managers', 'The local community and environmentalists', 'Banks and creditors'],
      correctIndex: 2, hint: 'Who is most directly harmed by pollution in the surrounding area?',
      explanation: 'The local community (and environmental organisations) would most directly oppose illegal dumping — they live in the area and are directly harmed by pollution (contaminated water, soil, and air). This is a conflict between profit-seeking owners/shareholders and the community\'s interest in a safe environment.'
    },
  ],
  remediationQuestions: [
    {
      id: 'r1', question: 'Which of the following is an EXTERNAL stakeholder?', math: '',
      options: ['The CEO of the company', 'A factory worker', 'A bank that gave the business a loan', 'The board of directors'],
      correctIndex: 2, hint: 'External stakeholders are outside the business but still affected by it.',
      explanation: 'A bank that provided a loan is an external stakeholder — it has a financial interest (repayment + interest) in the business but is not part of the organisation. The CEO, factory worker, and board of directors are all internal stakeholders.'
    },
    {
      id: 'r2', question: 'What does "stakeholder conflict" mean?', math: '',
      options: ['When stakeholders physically fight each other', 'When different stakeholders have opposing interests that cannot all be satisfied simultaneously', 'When a business goes bankrupt', 'When employees go on strike for no reason'],
      correctIndex: 1, hint: 'Conflict arises when what one group wants is the opposite of what another group wants.',
      explanation: 'Stakeholder conflict occurs when different stakeholders have opposing interests. For example, owners want lower costs (which might mean lower wages), while employees want higher wages. Both interests cannot be fully satisfied at the same time — this creates conflict that management must navigate.'
    },
  ],
  hardQuestions: [
    {
      id: 'h1', question: 'A company decides to relocate its factory to a rural area to save on land costs. Which TWO stakeholder groups are most likely to have conflicting reactions?', math: '',
      options: ['Urban employees (job loss) vs. rural community (job gain)', 'Shareholders vs. the government only', 'Customers vs. suppliers only', 'Creditors vs. debtors'],
      correctIndex: 0, hint: 'Think about who loses their job and who gains new employment from this decision.',
      explanation: 'Urban employees face job losses (negative impact) — a major concern for internal stakeholders in the original location. Conversely, the rural community gains jobs and economic activity (positive impact). This is a clear stakeholder conflict caused by the relocation decision — one group benefits while another loses.'
    },
    {
      id: 'h2', question: 'A business introduces automation (robots replacing workers) to increase production efficiency. Evaluate this from the perspective of TWO different stakeholders.', math: '',
      options: ['Owners benefit (lower labour costs); employees lose (job losses) — a classic stakeholder conflict', 'Everyone benefits equally from automation', 'Only the government is affected — through reduced tax', 'Suppliers benefit most because they sell the robots'],
      correctIndex: 0, hint: 'Map the impact of automation separately for owners vs. workers.',
      explanation: 'Automation creates a direct stakeholder conflict: Owners/shareholders benefit from reduced labour costs and increased production efficiency (higher profit). Employees are harmed by job losses and reduced income security. This is a textbook example of why stakeholder management is complex — a decision that maximises shareholder value can simultaneously harm workers.'
    },
    {
      id: 'h3', question: 'How should a business BEST manage conflict between its shareholders (wanting higher dividends) and its employees (wanting higher wages)?', math: '',
      options: ['Always prioritise shareholders — they own the business', 'Always prioritise employees — they do the work', 'Negotiate a balanced solution: link wages to performance while maintaining competitive returns for shareholders', 'Ignore both groups and do what the CEO decides'],
      correctIndex: 2, hint: 'Good stakeholder management finds sustainable win-win solutions rather than always favouring one group.',
      explanation: 'The best approach is negotiated balance. Businesses can link wage increases to productivity gains (employees benefit when the business grows) while ensuring shareholders still receive competitive returns. Strategies include profit-sharing schemes, performance bonuses, and transparent communication. Permanently favouring one group creates long-term risk.'
    },
    {
      id: 'h4', question: 'A business ignores its community stakeholders and receives negative media coverage, leading to a consumer boycott. What does this demonstrate?', math: '',
      options: ['That community stakeholders have no real power', 'That external stakeholders can have significant power to impact a business even without legal authority', 'That the business should only focus on internal stakeholders', 'That government regulation is the only real threat to businesses'],
      correctIndex: 1, hint: 'Think about how a boycott affects sales and reputation — can external groups harm a business even without government involvement?',
      explanation: 'This demonstrates that external stakeholders (even those without legal authority over the business) can wield significant power. Negative media coverage harms brand reputation; consumer boycotts reduce revenue. Community groups, social media, and consumer organisations can all exert substantial pressure — businesses that ignore them face reputational and financial consequences.'
    },
  ],
}

const SUBJECT = 'Business Studies'
const GRADE = 10
const TOPIC_ID = 'business-stakeholders'
const NEXT_TOPIC_ID = 'business-operations'
const STORAGE_KEY_PREFIX = 'scratchpad_biz-stakeholders_'

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
            <div className="flex items-center justify-center gap-3 flex-wrap">
              {current.math.map((token, i) => {
                const bubble = current.bubbles.find(b => b.target === token)
                const isActive = activeBubble === token
                  return (
                  <div key={i} className="relative">
                    {bubble && isActive && <SpeechBubble text={bubble.text} position={bubble.pos} />}
                    <button onClick={() => setActiveBubble(isActive ? null : token)}
                      className={`px-4 py-2 rounded-lg font-mono text-xs font-semibold transition-all ${bubble ? (isActive ? 'bg-slate-600 text-white shadow-md scale-105' : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100') : 'bg-white text-slate-400 border border-slate-200 cursor-default'}`}>
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
          <div><p className="font-medium text-slate-900 text-sm mb-1">Worked Example</p><p className="text-slate-800 text-xs leading-relaxed">{TOPIC.guidedItem.problem}</p></div>
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
            <button onClick={() => setScratchpadStep(`step-${step.id}`)} className="shrink-0 flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-700 transition-colors border border-slate-200 rounded-lg px-2 py-1"><NotebookPen className="w-3.5 h-3.5" /> Notes</button>
          </div>
          <div className="bg-slate-50 border border-slate-100 rounded-xl px-5 py-4 text-xs font-semibold text-slate-900 text-center">{step.math}</div>
          {!revealed
            ? <button onClick={() => setRevealed(true)} className="w-full py-2.5 border-2 border-dashed border-slate-200 rounded-xl text-sm text-slate-400 hover:border-slate-300 hover:text-slate-600 transition-colors">Reveal explanation</button>
            : <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-slate-50 border border-slate-100 rounded-xl p-3"><p className="text-slate-800 text-xs leading-relaxed">{step.explanation}</p></motion.div>
          }
        </motion.div>
      </AnimatePresence>
      <div className="flex justify-between">
        <button onClick={() => { setStepIdx(s => s - 1); setRevealed(false) }} disabled={stepIdx === 0} className="flex items-center gap-2 px-4 py-2 text-slate-600 disabled:opacity-30 hover:text-slate-900 transition-colors"><ChevronLeft className="w-4 h-4" /> Previous</button>
        {stepIdx < TOPIC.guidedItem.steps.length - 1
          ? <button onClick={() => { setStepIdx(s => s + 1); setRevealed(false) }} className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-700 transition-colors font-medium">Next Step <ChevronRight className="w-4 h-4" /></button>
          : <button onClick={onComplete} className="flex items-center gap-2 px-5 py-2.5 bg-slate-600 text-white rounded-xl hover:bg-slate-700 transition-colors font-medium">Start Practice <ArrowRight className="w-4 h-4" /></button>
        }
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
          {q.math && <div className="bg-slate-50 rounded-xl px-3 py-2 text-sm text-slate-700 text-center">{q.math}</div>}
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

function FeedbackModule({ score, total, onRetry, onContinue, nextTopicName }: { score: number; total: number; onRetry: () => void; onContinue: () => void; nextTopicName: string }) {
  const pct = score / total; const mastered = pct >= 2 / 3
  return (
    <div className="max-w-md mx-auto text-center space-y-6">
      <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto ${mastered ? 'bg-slate-100' : 'bg-slate-100'}`}>{mastered ? <Award className="w-8 h-8 text-slate-600" /> : <AlertCircle className="w-8 h-8 text-slate-600" />}</div>
      <div><p className="text-3xl font-bold text-slate-900">{score}/{total}</p><p className="text-slate-500 mt-1">{mastered ? 'Mastered!' : 'Keep practising'}</p></div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${pct * 100}%` }} className={`h-full rounded-full ${mastered ? 'bg-slate-500' : 'bg-slate-400'}`} /></div>
      <div className="flex flex-col gap-3">
        {mastered ? <button onClick={onContinue} className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-600 text-white rounded-xl hover:bg-slate-700 transition-colors font-medium">Next: {nextTopicName} <ArrowRight className="w-4 h-4" /></button>
          : <><button onClick={onRetry} className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-700 transition-colors font-medium"><RotateCcw className="w-4 h-4" /> Try Again</button><button onClick={onContinue} className="px-6 py-2.5 text-slate-600 hover:text-slate-900 transition-colors text-sm">Continue anyway</button></>
        }
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

function BusinessStakeholdersPage({ onNavigate }: { onNavigate: (page: any) => void }) {
  const session = useStudySession();
  const [view, setView] = useState<ViewState>('overview')
  const [practiceScore, setPracticeScore] = useState(0)
  const [thisStatus, setThisStatus] = useState<TopicStatus>('not-started')
  const [nextStatus, setNextStatus] = useState<TopicStatus>('not-started')
  useEffect(() => { loadTopicStatus(session?.student_id ?? 0, TOPIC_ID).then(setThisStatus); loadTopicStatus(session?.student_id ?? 0, NEXT_TOPIC_ID).then(setNextStatus) }, [session?.student_id ?? 0])
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
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold shrink-0 ${thisStatus === 'mastered' ? 'bg-slate-500 text-white' : 'bg-slate-900 text-white'}`}>{thisStatus === 'mastered' ? '✓' : '3'}</div>
                  <div><p className="font-semibold text-slate-900">{TOPIC.title}</p><p className="text-sm text-slate-500 mt-0.5">{TOPIC.description}</p><div className="mt-2">{statusLabel(thisStatus)}</div></div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-600 transition-colors shrink-0" />
              </button>
              <button onClick={() => onNavigate('learning-bizstudies-g10-t1-operations' as AppPage)} className="w-full bg-white rounded-2xl border border-slate-200 p-4 flex items-center justify-between hover:border-slate-300 hover:shadow-md transition-all group text-left">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold shrink-0 ${nextStatus === 'mastered' ? 'bg-slate-500 text-white' : 'bg-slate-900 text-white'}`}>{nextStatus === 'mastered' ? '✓' : '4'}</div>
                  <div><p className="font-semibold text-slate-900">Business Operations</p><p className="text-sm text-slate-500 mt-0.5">Core business functions: production, HR, marketing, and finance.</p><div className="mt-2">{statusLabel(nextStatus)}</div></div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-600 transition-colors shrink-0" />
              </button>
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
              {view === 'remediation' && <motion.div key="remediation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6"><div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-start gap-3"><AlertCircle className="w-5 h-5 text-slate-500 mt-0.5 shrink-0" /><div><p className="font-medium text-slate-900 text-sm">Let's try again</p><p className="text-slate-700 text-sm mt-0.5">Here are two more questions to build your understanding.</p></div></div><PracticeModule questions={TOPIC.remediationQuestions} onComplete={handleRemediationComplete} /></motion.div>}
              {view === 'practice-more' && <motion.div key="hard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><PracticeModule questions={TOPIC.hardQuestions} onComplete={handleHardComplete} /></motion.div>}
              {view === 'feedback' && <motion.div key="feedback" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><FeedbackModule score={practiceScore} total={TOPIC.initialQuestions.length} onRetry={() => setView('practice')} onContinue={() => onNavigate('learning-bizstudies-g10-t1-operations' as AppPage)} nextTopicName="Business Operations" /><div className="mt-6 text-center"><button onClick={() => setView('practice-more')} className="text-sm text-slate-600 hover:text-slate-800 transition-colors underline underline-offset-2">Want harder questions? Try Practice More</button></div></motion.div>}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  )
}

export default BusinessStakeholdersPage
