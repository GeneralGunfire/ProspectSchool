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
  id: 'business-environment',
  title: 'The Business Environment',
  description: 'Understand the micro, market, and macro environments that affect every business.',
  interactiveSteps: [
    {
      id: 'step-1',
      title: 'What Is the Business Environment?',
      content: 'Every business operates within an environment made up of forces that influence its decisions and performance. These forces are grouped into three environments: the micro environment (inside the business), the market environment (direct outside forces), and the macro environment (broad societal forces the business cannot control).',
      math: ['Micro', '→', 'Market', '→', 'Macro'],
      bubbles: [
        { target: 'Micro', text: 'Inside the business', pos: 'top' as const },
        { target: 'Macro', text: 'Broad uncontrollable forces', pos: 'bottom' as const }
      ]
    },
    {
      id: 'step-2',
      title: 'The Micro Environment',
      content: 'The micro environment is the internal environment — everything inside the business that management can directly control. It includes: Vision & Mission, Organisational structure, Resources (human, financial, physical), Business functions (production, HR, marketing, finance).',
      math: ['Vision', '+', 'Resources', '+', 'Functions'],
      bubbles: [
        { target: 'Vision', text: 'Direction the business aims for', pos: 'top' as const },
        { target: 'Functions', text: 'HR, Finance, Marketing, Production', pos: 'bottom' as const }
      ]
    },
    {
      id: 'step-3',
      title: 'The Market Environment',
      content: 'The market environment contains forces outside the business that directly interact with it. These can be influenced but not fully controlled. Key forces: Customers, Competitors, Suppliers, Intermediaries (distributors/agents), and Regulators specific to the industry.',
      math: ['Customers', '|', 'Competitors', '|', 'Suppliers'],
      bubbles: [
        { target: 'Customers', text: 'Who the business serves', pos: 'top' as const },
        { target: 'Suppliers', text: 'Who provides inputs', pos: 'bottom' as const }
      ]
    },
    {
      id: 'step-4',
      title: 'The Macro Environment (PESTLE)',
      content: 'The macro environment consists of broad forces that affect ALL businesses and cannot be controlled. Analysed using PESTLE: Political, Economic, Social, Technological, Legal, Environmental. Businesses must adapt to macro forces — they cannot change them.',
      math: ['P', '·', 'E', '·', 'S', '·', 'T', '·', 'L', '·', 'E'],
      bubbles: [
        { target: 'P', text: 'Political — government policy', pos: 'top' as const },
        { target: 'E', text: 'Economic — interest rates, GDP', pos: 'bottom' as const }
      ]
    },
  ],
  guidedItem: {
    problem: "Pick 'n Pay (a South African supermarket chain) is planning to open a new store. Classify each factor below as micro, market, or macro environment.",
    steps: [
      { id: 1, instruction: 'Factor: Pick \'n Pay\'s store manager and staff', math: 'Micro Environment', explanation: 'The store manager and staff are internal to the business. Management directly controls hiring, training, and performance of employees — this is a micro environment factor.' },
      { id: 2, instruction: 'Factor: Competitor Checkers opening nearby', math: 'Market Environment', explanation: 'Checkers is a direct competitor that Pick \'n Pay interacts with and must respond to (e.g., by matching prices or improving service). Competitors belong to the market environment.' },
      { id: 3, instruction: 'Factor: Rising inflation increasing food prices', math: 'Macro Environment — Economic', explanation: 'Inflation is a broad economic force that affects the entire economy. Pick \'n Pay cannot control inflation; it can only adapt by adjusting its pricing strategy. This is a macro environment (Economic in PESTLE) factor.' },
      { id: 4, instruction: 'Factor: A new government law on plastic bag fees', math: 'Macro Environment — Legal / Political', explanation: 'Government legislation is both a Political and Legal macro factor. The business must comply with the law — it cannot ignore or change it. This affects operations and costs but is completely outside the business\'s control.' },
    ]
  },
  initialQuestions: [
    {
      id: 'q1', question: 'A business discovers that its main competitor has launched a new product. Which environment does this belong to?', math: '',
      options: ['Micro environment', 'Market environment', 'Macro environment', 'Internal environment'],
      correctIndex: 1, hint: 'Competitors are forces outside the business that directly interact with it.',
      explanation: 'Competitors belong to the market environment. They are outside the business but directly interact with it. The business can respond to competitors but cannot fully control what they do.'
    },
    {
      id: 'q2', question: 'The South African government increases the corporate tax rate. Which PESTLE factor is this?', math: '',
      options: ['Social', 'Technological', 'Political / Legal', 'Environmental'],
      correctIndex: 2, hint: 'Tax rates are set by government — think government policy and legislation.',
      explanation: 'Tax rates are set by government legislation, making this both a Political and Legal macro factor under PESTLE. Businesses cannot control tax rates; they must adapt their financial planning to comply.'
    },
    {
      id: 'q3', question: 'Which of the following is a MICRO environment factor?', math: '',
      options: ['The rate of unemployment in the country', 'The business\'s organisational structure', 'The supplier\'s delivery times', 'Consumer spending trends'],
      correctIndex: 1, hint: 'The micro environment is everything inside the business that management controls.',
      explanation: 'The organisational structure is an internal factor — management decides how the business is structured. The others (unemployment, supplier behaviour, consumer trends) are all external forces in the macro or market environment.'
    },
    {
      id: 'q4', question: 'A new social media platform becomes popular among teenagers. A clothing company targets teenagers with ads on this platform. Which environment prompted this strategic response?', math: '',
      options: ['Micro — internal marketing decision', 'Market — customer behaviour', 'Macro — technological and social factors', 'Macro — political factor'],
      correctIndex: 2, hint: 'New technology and shifts in what people do socially are macro forces.',
      explanation: 'The rise of a new platform involves both Technological and Social macro forces (PESTLE). The clothing company cannot control these trends — it must adapt its marketing strategy in response. The decision to advertise there is micro, but the trigger is macro.'
    },
  ],
  remediationQuestions: [
    {
      id: 'r1', question: 'Which environment includes forces that management CANNOT control?', math: '',
      options: ['Micro environment', 'Macro environment', 'Internal environment', 'Organisational environment'],
      correctIndex: 1, hint: 'Think about which environment is the broadest and most distant from the business.',
      explanation: 'The macro environment contains broad societal forces (PESTLE) that no single business can control. Businesses can only monitor and adapt to them. The micro environment is the one businesses CAN control.'
    },
    {
      id: 'r2', question: 'A business\'s suppliers are part of which environment?', math: '',
      options: ['Micro environment', 'Macro environment', 'Market environment', 'Legal environment'],
      correctIndex: 2, hint: 'Suppliers are outside the business but interact directly with it.',
      explanation: 'Suppliers belong to the market environment. They are external to the business but have a direct and specific relationship with it — providing raw materials or goods. The business can influence but not fully control supplier behaviour.'
    },
  ],
  hardQuestions: [
    {
      id: 'h1', question: 'A business notes that the unemployment rate has risen to 35%. How should it respond from a market environment perspective?', math: '',
      options: ['Reduce prices to attract price-sensitive consumers', 'Increase salaries to attract top talent', 'Expand to new markets abroad immediately', 'Cut all marketing spending'],
      correctIndex: 0, hint: 'High unemployment means consumers have less disposable income — what do price-sensitive shoppers want?',
      explanation: 'Rising unemployment is a macro-economic factor that reduces consumer spending power. A smart market-environment response is to make products more affordable to attract price-sensitive customers. Increasing salaries or expanding abroad would increase costs at the wrong time.'
    },
    {
      id: 'h2', question: 'Explain why the PESTLE analysis is important for a business entering a new country.', math: '',
      options: ['It tells the business exactly what profit it will make', 'It identifies macro factors that could threaten or create opportunity in the new market', 'It replaces the need for a business plan', 'It only applies to companies listed on the stock exchange'],
      correctIndex: 1, hint: 'PESTLE covers all broad external forces a business must understand before entering a market.',
      explanation: 'Before entering a new country, PESTLE helps the business understand political stability, economic conditions, social norms, available technology, local laws, and environmental regulations — all macro factors that differ by country and can make or break a market entry.'
    },
    {
      id: 'h3', question: 'A new environmental law requires all manufacturers to reduce carbon emissions by 30% within 2 years. In which two PESTLE categories does this fall?', math: '',
      options: ['Economic and Social', 'Legal and Environmental', 'Political and Technological', 'Social and Technological'],
      correctIndex: 1, hint: 'The law is legislation; the subject matter is about the natural environment.',
      explanation: 'This falls under Legal (it is a law that must be complied with) and Environmental (it addresses carbon emissions and the natural environment). Both L and E in PESTLE apply. Businesses must invest in cleaner technology to comply, which also makes it indirectly Technological.'
    },
    {
      id: 'h4', question: 'A business decides to reorganise its departments to improve communication. Which environment is being changed, and is this a strength or a response to a threat?', math: '',
      options: ['Macro environment — response to a legal threat', 'Market environment — response to a competitor', 'Micro environment — internal improvement (potential strength)', 'Market environment — improving customer relations'],
      correctIndex: 2, hint: 'Reorganising internal departments is an action inside the business.',
      explanation: 'Reorganising departments is a micro environment action — it is fully within management\'s control. Done well, it becomes a strength (better communication, faster decisions). It is an internal improvement, not a direct response to an external threat.'
    },
  ],
}

const SUBJECT = 'Business Studies'
const GRADE = 10
const TOPIC_ID = 'business-environment'
const NEXT_TOPIC_ID = 'business-sectors'
const STORAGE_KEY_PREFIX = 'scratchpad_biz-env_'

// ─── SpeechBubble ─────────────────────────────────────────────────────────────
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

// ─── InteractiveLesson ────────────────────────────────────────────────────────
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
            <div key={i} className={`h-1.5 w-8 rounded-full transition-colors ${i <= step ? 'bg-slate-600' : 'bg-slate-200'}`} />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={current.id} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}
          className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
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
                    <button
                      onClick={() => setActiveBubble(isActive ? null : token)}
                      className={`px-4 py-2 rounded-lg font-mono text-xs font-semibold transition-all ${bubble
                        ? (isActive ? 'bg-slate-600 text-white shadow-md scale-105' : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100')
                        : 'bg-white text-slate-400 border border-slate-200 cursor-default'}`}
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
        <button onClick={() => { setStep(s => s - 1); setActiveBubble(null) }} disabled={step === 0}
          className="flex items-center gap-2 px-4 py-2 text-slate-600 disabled:opacity-30 hover:text-slate-900 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>
        {step < TOPIC.interactiveSteps.length - 1
          ? <button onClick={() => { setStep(s => s + 1); setActiveBubble(null) }}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-700 transition-colors font-medium">
              Next <ChevronRight className="w-4 h-4" />
            </button>
          : <button onClick={onComplete}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-600 text-white rounded-xl hover:bg-slate-700 transition-colors font-medium">
              Try a Worked Example <ArrowRight className="w-4 h-4" />
            </button>
        }
      </div>
    </div>
  )
}

// ─── ScratchpadModal ──────────────────────────────────────────────────────────
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
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col" style={{ height: '520px' }}>
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
        <canvas ref={canvasRef} className="flex-1 w-full cursor-crosshair rounded-b-2xl touch-none"
          onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} />
      </motion.div>
    </div>
  )
}

// ─── GuidedPracticeModule ─────────────────────────────────────────────────────
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
        <motion.div key={step.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
          <div className="flex items-start justify-between gap-4">
            <p className="font-medium text-slate-800">{step.instruction}</p>
            <button onClick={() => setScratchpadStep(`step-${step.id}`)}
              className="shrink-0 flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-700 transition-colors border border-slate-200 rounded-lg px-2 py-1">
              <NotebookPen className="w-3.5 h-3.5" /> Notes
            </button>
          </div>
          <div className="bg-slate-50 border border-slate-100 rounded-xl px-5 py-4 text-xs font-semibold text-slate-900 text-center">
            {step.math}
          </div>
          {!revealed
            ? <button onClick={() => setRevealed(true)}
                className="w-full py-2.5 border-2 border-dashed border-slate-200 rounded-xl text-sm text-slate-400 hover:border-slate-300 hover:text-slate-600 transition-colors">
                Reveal explanation
              </button>
            : <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                <p className="text-slate-800 text-xs leading-relaxed">{step.explanation}</p>
              </motion.div>
          }
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between">
        <button onClick={() => { setStepIdx(s => s - 1); setRevealed(false) }} disabled={stepIdx === 0}
          className="flex items-center gap-2 px-4 py-2 text-slate-600 disabled:opacity-30 hover:text-slate-900 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>
        {stepIdx < TOPIC.guidedItem.steps.length - 1
          ? <button onClick={() => { setStepIdx(s => s + 1); setRevealed(false) }}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-700 transition-colors font-medium">
              Next Step <ChevronRight className="w-4 h-4" />
            </button>
          : <button onClick={onComplete}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-600 text-white rounded-xl hover:bg-slate-700 transition-colors font-medium">
              Start Practice <ArrowRight className="w-4 h-4" />
            </button>
        }
      </div>
    </div>
  )
}

// ─── PracticeModule ───────────────────────────────────────────────────────────
function PracticeModule({ questions, onComplete }: { questions: Question[]; onComplete: (score: number) => void }) {
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

    <div className="max-w-2xl mx-auto space-y-3">
      {scratchpadQ && <ScratchpadModal stepKey={scratchpadQ} onClose={() => setScratchpadQ(null)} />}
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-500">Question {idx + 1} of {questions.length}</span>
        <button onClick={() => setScratchpadQ(`q-${q.id}`)}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-700 transition-colors border border-slate-200 rounded-lg px-2 py-1">
          <NotebookPen className="w-3.5 h-3.5" /> Scratchpad
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={q.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
          className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
          <p className="font-medium text-slate-900 leading-relaxed">{q.question}</p>
          {q.math && <div className="bg-slate-50 rounded-xl px-3 py-2 text-sm text-slate-700 text-center">{q.math}</div>}

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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className={`rounded-xl p-3 ${selected === q.correctIndex ? 'bg-slate-50 border border-slate-100' : 'bg-slate-50 border border-slate-100'}`}>
              <p className={`text-xs leading-relaxed ${selected === q.correctIndex ? 'text-slate-800' : 'text-slate-800'}`}>{q.explanation}</p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-end">
        {!confirmed
          ? <button onClick={confirm} disabled={selected === null}
              className="px-5 py-2.5 bg-slate-900 text-white rounded-xl disabled:opacity-30 hover:bg-slate-700 transition-colors font-medium">
              Check Answer
            </button>
          : <button onClick={next}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-700 transition-colors font-medium">
              {idx < questions.length - 1 ? 'Next Question' : 'See Results'} <ArrowRight className="w-4 h-4" />
            </button>
        }
      </div>
    </div>
  )
}

// ─── FeedbackModule ───────────────────────────────────────────────────────────
function FeedbackModule({ score, total, onRetry, onContinue, nextTopicName }: {
  score: number; total: number; onRetry: () => void; onContinue: () => void; nextTopicName: string
}) {
  const pct = score / total
  const mastered = pct >= 2 / 3

  return (
    <div className="max-w-md mx-auto text-center space-y-6">
      <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto ${mastered ? 'bg-slate-100' : 'bg-slate-100'}`}>
        {mastered ? <Award className="w-8 h-8 text-slate-600" /> : <AlertCircle className="w-8 h-8 text-slate-600" />}
      </div>
      <div>
        <p className="text-3xl font-bold text-slate-900">{score}/{total}</p>
        <p className="text-slate-500 mt-1">{mastered ? 'Mastered!' : 'Keep practising'}</p>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${pct * 100}%` }}
          className={`h-full rounded-full ${mastered ? 'bg-slate-500' : 'bg-slate-400'}`} />
      </div>
      <div className="flex flex-col gap-3">
        {mastered
          ? <button onClick={onContinue}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-600 text-white rounded-xl hover:bg-slate-700 transition-colors font-medium">
              Next: {nextTopicName} <ArrowRight className="w-4 h-4" />
            </button>
          : <>
              <button onClick={onRetry}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-700 transition-colors font-medium">
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

// ─── Supabase helpers ─────────────────────────────────────────────────────────
async function loadTopicStatus(studentId: number, topicId: string): Promise<TopicStatus> {
  const m = await _loadProgress(studentId, SUBJECT, GRADE, topicId)
  if (m === 'mastered') return 'mastered'
  if (m === 'needs_practice') return 'needs-practice'
  return 'not-started'
}

async function saveTopicStatus(studentId: number, schoolId: number, score: number, total: number) {
  const mastery: import('../../../../../../../lib/studyProgress').MasteryLevel = score / total >= 2 / 3 ? 'mastered' : 'needs_practice'
  await _saveProgress(studentId, schoolId, SUBJECT, GRADE, TOPIC_ID, mastery, score, total, 1)
}

// ─── Main Page ────────────────────────────────────────────────────────────────
function BusinessEnvironmentPage({ onNavigate }: { onNavigate: (page: any) => void }) {
  const session = useStudySession()
  const [view, setView] = useState<ViewState>('overview')
  const [practiceScore, setPracticeScore] = useState(0)
  const [thisStatus, setThisStatus] = useState<TopicStatus>('not-started')
  const [nextStatus, setNextStatus] = useState<TopicStatus>('not-started')

  useEffect(() => {
    loadTopicStatus(session?.student_id ?? 0, TOPIC_ID).then(setThisStatus)
    loadTopicStatus(session?.student_id ?? 0, NEXT_TOPIC_ID).then(setNextStatus)
  }, [session])

  const handlePracticeComplete = async (score: number) => {
    setPracticeScore(score)
    if (session) await saveTopicStatus(session.student_id, session.school_id, score, TOPIC.initialQuestions.length)
    setThisStatus(score / TOPIC.initialQuestions.length >= 2 / 3 ? 'mastered' : 'needs-practice')
    if (score === 0) setView('remediation')
    else setView('feedback')
  }

  const handleRemediationComplete = async (score: number) => {
    if (session) await saveTopicStatus(session.student_id, session.school_id, score, TOPIC.remediationQuestions.length)
    setView('feedback')
  }

  const handleHardComplete = async (score: number) => {
    if (session) await saveTopicStatus(session.student_id, session.school_id, score, TOPIC.hardQuestions.length)
    setView('feedback')
  }

  const statusLabel = (s: TopicStatus) => {
    if (s === 'mastered') return <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">✓ Mastered</span>
    if (s === 'needs-practice') return <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">Needs Practice</span>
  }

  return (

    <div className="min-h-screen" style={{ background: 'oklch(98.5% 0.005 80)' }}>

      <main className="max-w-4xl mx-auto px-4 pt-24 pb-16">
        {view === 'overview' && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Business Studies · Grade 10 · Term 1</p>
              <h1 className="text-3xl font-bold text-slate-900">Topics</h1>
            </div>

            <div className="space-y-3">
              {/* Topic 1 — this topic */}
              <button onClick={() => setView('interactive-lesson')} className="w-full bg-white rounded-2xl border border-slate-200 p-4 flex items-center justify-between hover:border-slate-300 hover:shadow-md transition-all group text-left">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold shrink-0 ${thisStatus === 'mastered' ? 'bg-slate-500 text-white' : 'bg-slate-900 text-white'}`}>
                    {thisStatus === 'mastered' ? '✓' : '1'}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{TOPIC.title}</p>
                    <p className="text-sm text-slate-500 mt-0.5">{TOPIC.description}</p>
                    <div className="mt-2">{statusLabel(thisStatus)}</div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-600 transition-colors shrink-0" />
              </button>

              {/* Topic 2 — next topic */}
              <button onClick={() => onNavigate('learning-bizstudies-g10-t1-sectors' as AppPage)} className="w-full bg-white rounded-2xl border border-slate-200 p-4 flex items-center justify-between hover:border-slate-300 hover:shadow-md transition-all group text-left">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold shrink-0 ${nextStatus === 'mastered' ? 'bg-slate-500 text-white' : 'bg-slate-900 text-white'}`}>
                    {nextStatus === 'mastered' ? '✓' : '2'}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Business Sectors</p>
                    <p className="text-sm text-slate-500 mt-0.5">Primary, secondary, and tertiary sectors of the economy.</p>
                    <div className="mt-2">{statusLabel(nextStatus)}</div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-600 transition-colors shrink-0" />
              </button>
            </div>
          </motion.div>
        )}

        {view !== 'overview' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <button onClick={() => setView('overview')} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors">
                <ChevronLeft className="w-4 h-4" /> Back to Topics
              </button>
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Business Studies · Grade 10</span>
            </div>

            <AnimatePresence mode="wait">
              {view === 'interactive-lesson' && (
                <motion.div key="lesson" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <InteractiveLesson onComplete={() => setView('guided-practice')} />
                </motion.div>
              )}
              {view === 'guided-practice' && (
                <motion.div key="guided" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <GuidedPracticeModule onComplete={() => setView('practice')} />
                </motion.div>
              )}
              {view === 'practice' && (
                <motion.div key="practice" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <PracticeModule questions={TOPIC.initialQuestions} onComplete={handlePracticeComplete} />
                </motion.div>
              )}
              {view === 'remediation' && (
                <motion.div key="remediation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-slate-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-slate-900 text-sm">Let's try again</p>
                      <p className="text-slate-700 text-sm mt-0.5">Here are two more questions to help build your understanding.</p>
                    </div>
                  </div>
                  <PracticeModule questions={TOPIC.remediationQuestions} onComplete={handleRemediationComplete} />
                </motion.div>
              )}
              {view === 'practice-more' && (
                <motion.div key="hard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <PracticeModule questions={TOPIC.hardQuestions} onComplete={handleHardComplete} />
                </motion.div>
              )}
              {view === 'feedback' && (
                <motion.div key="feedback" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <FeedbackModule
                    score={practiceScore}
                    total={TOPIC.initialQuestions.length}
                    onRetry={() => setView('practice')}
                    onContinue={() => onNavigate('learning-bizstudies-g10-t1-sectors' as AppPage)}
                    nextTopicName="Business Sectors"
                  />
                  <div className="mt-6 text-center">
                    <button onClick={() => setView('practice-more')} className="text-sm text-slate-600 hover:text-slate-800 transition-colors underline underline-offset-2">
                      Want harder questions? Try Practice More
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  )
}

export default BusinessEnvironmentPage
