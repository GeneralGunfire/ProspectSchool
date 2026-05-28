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
  id: 'business-sectors',
  title: 'Business Sectors',
  description: 'Primary, secondary, and tertiary sectors — how the economy is organised.',
  interactiveSteps: [
    {
      id: 'step-1',
      title: 'The Three Sectors of the Economy',
      content: 'All economic activity is grouped into three sectors based on the type of work being done. The PRIMARY sector extracts raw materials from nature. The SECONDARY sector processes those materials into finished goods. The TERTIARY sector provides services. Together they form a chain from raw resource to consumer.',
      math: ['Primary', '→', 'Secondary', '→', 'Tertiary'],
      bubbles: [
        { target: 'Primary', text: 'Raw materials from nature', pos: 'top' as const },
        { target: 'Tertiary', text: 'Services to consumers', pos: 'bottom' as const }
      ]
    },
    {
      id: 'step-2',
      title: 'The Primary Sector',
      content: 'The primary sector involves the extraction or harvesting of natural resources. Examples: Mining (gold, coal, diamonds), Agriculture (farming, livestock), Fishing, Forestry, and Quarrying. South Africa has one of the world\'s largest primary sectors — especially mining. Raw materials from this sector feed the secondary sector.',
      math: ['Mining', '|', 'Farming', '|', 'Fishing'],
      bubbles: [
        { target: 'Mining', text: 'SA: gold, platinum, coal', pos: 'top' as const },
        { target: 'Fishing', text: 'Natural resource extraction', pos: 'bottom' as const }
      ]
    },
    {
      id: 'step-3',
      title: 'The Secondary Sector',
      content: 'The secondary sector involves manufacturing and construction — turning raw materials into products. Examples: Car manufacturing, food processing (turning wheat into bread), clothing factories, construction (building houses and roads), and electricity generation. Value is ADDED to raw materials at every step.',
      math: ['Raw', '+', 'Labour', '=', 'Product'],
      bubbles: [
        { target: 'Raw', text: 'Steel, cotton, timber…', pos: 'top' as const },
        { target: 'Product', text: 'Car, shirt, house…', pos: 'bottom' as const }
      ]
    },
    {
      id: 'step-4',
      title: 'The Tertiary Sector',
      content: 'The tertiary sector provides services — intangible activities that help people and businesses. Examples: Retail (selling goods), Transport, Banking and Finance, Insurance, Healthcare, Education, Tourism, and ICT. The tertiary sector is the LARGEST sector in most developed economies including South Africa.',
      math: ['Services', '=', 'Intangible', '+', 'Value'],
      bubbles: [
        { target: 'Services', text: 'Banking, teaching, transport…', pos: 'top' as const },
        { target: 'Intangible', text: 'You can\'t touch a service', pos: 'bottom' as const }
      ]
    },
  ],
  guidedItem: {
    problem: 'Classify each of the following South African businesses into the correct economic sector, and explain your reasoning.',
    steps: [
      { id: 1, instruction: 'Anglo American — a platinum mining company', math: 'PRIMARY Sector', explanation: 'Anglo American extracts platinum ore from the earth. Mining is the classic example of primary sector activity — raw materials are extracted directly from nature without significant processing.' },
      { id: 2, instruction: 'Toyota South Africa — assembles cars in Durban', math: 'SECONDARY Sector', explanation: 'Toyota takes raw materials (steel, rubber, glass) and manufactures finished vehicles. Manufacturing and assembly are secondary sector activities — raw materials are transformed into products.' },
      { id: 3, instruction: 'FNB (First National Bank) — provides banking services', math: 'TERTIARY Sector', explanation: 'FNB provides financial services (loans, savings accounts, payments). Banking is a service — intangible. The tertiary sector includes all service industries: banking, insurance, retail, transport, education, and healthcare.' },
      { id: 4, instruction: 'Checkers — a supermarket chain', math: 'TERTIARY Sector (Retail)', explanation: 'Although Checkers sells physical goods, it is classified as tertiary because its primary activity is RETAIL — a service of connecting products to consumers. It does not extract or manufacture; it distributes and sells.' },
    ]
  },
  initialQuestions: [
    {
      id: 'q1', question: 'A coal mining company digs coal out of the ground and sells it. Which sector does this belong to?', math: '',
      options: ['Primary sector', 'Secondary sector', 'Tertiary sector', 'Quaternary sector'],
      correctIndex: 0, hint: 'Extracting resources from the earth is the defining feature of the primary sector.',
      explanation: 'Mining is a primary sector activity — it involves extracting a natural resource (coal) directly from the earth. No manufacturing or processing happens; the raw material is simply extracted and sold.'
    },
    {
      id: 'q2', question: 'A factory buys raw cotton and turns it into shirts for sale. Which sector does this belong to?', math: '',
      options: ['Primary sector — cotton comes from nature', 'Secondary sector — raw materials are processed into a finished product', 'Tertiary sector — the shirts are sold in stores', 'It belongs to both primary and secondary'],
      correctIndex: 1, hint: 'The key action here is manufacturing — transforming raw cotton into a finished product.',
      explanation: 'Manufacturing (turning raw cotton into shirts) is a secondary sector activity. Value is added to the raw material through labour and machinery. The primary sector grew the cotton; the secondary sector turned it into shirts.'
    },
    {
      id: 'q3', question: 'Which of the following is a TERTIARY sector business?', math: '',
      options: ['A gold mine in the Free State', 'A car assembly plant in Port Elizabeth', 'A medical aid insurance company', 'A wheat farm in the Western Cape'],
      correctIndex: 2, hint: 'The tertiary sector provides services — intangible activities like insurance, banking, or transport.',
      explanation: 'A medical aid insurance company provides a financial service (healthcare coverage). Services are intangible — you cannot touch them. The gold mine (primary), car assembly plant (secondary), and wheat farm (primary) all involve physical goods.'
    },
    {
      id: 'q4', question: 'South Africa\'s economy has been shifting away from primary sector dependence. Which statement best explains this trend?', math: '',
      options: ['Mining is becoming less profitable because all resources are depleted', 'Economic development tends to grow the secondary and tertiary sectors as industrialisation occurs', 'The government has banned all primary sector activity', 'Primary sector workers earn more than tertiary sector workers'],
      correctIndex: 1, hint: 'Think about what happens to an economy as it industrialises and becomes more developed.',
      explanation: 'As economies develop, they typically move from primary (raw materials) to secondary (manufacturing) and then to tertiary (services). This is the process of industrialisation. South Africa\'s mining sector remains significant, but services and manufacturing are growing as a share of GDP.'
    },
  ],
  remediationQuestions: [
    {
      id: 'r1', question: 'Which sector involves growing food and farming?', math: '',
      options: ['Secondary sector', 'Tertiary sector', 'Primary sector', 'Manufacturing sector'],
      correctIndex: 2, hint: 'Farming involves harvesting natural resources — which sector does that?',
      explanation: 'Agriculture (farming) belongs to the primary sector. Farmers extract natural resources — crops, livestock — directly from the land. The primary sector is all about extracting raw materials from nature.'
    },
    {
      id: 'r2', question: 'A construction company builds houses. Which sector does it belong to?', math: '',
      options: ['Primary sector', 'Secondary sector', 'Tertiary sector', 'Natural resources sector'],
      correctIndex: 1, hint: 'Construction transforms raw materials (bricks, steel, timber) into finished structures.',
      explanation: 'Construction is a secondary sector activity. It takes raw materials and transforms them into a finished product (a house or building). Manufacturing, construction, and processing all belong to the secondary sector.'
    },
  ],
  hardQuestions: [
    {
      id: 'h1', question: 'A business mines iron ore (primary), melts and shapes it into steel beams (secondary), and then sells the beams to construction companies (tertiary). What concept does this illustrate?', math: '',
      options: ['PESTLE analysis', 'The value chain — value is added at each stage of production', 'The business entity concept', 'Forward vertical integration only'],
      correctIndex: 1, hint: 'Think about what happens at each stage — what is being added to the raw material?',
      explanation: 'This illustrates the VALUE CHAIN. At each stage (primary → secondary → tertiary), value is added: iron ore becomes steel beams (more valuable), which are then distributed to buyers. This chain shows how raw materials gain value through transformation and service.'
    },
    {
      id: 'h2', question: 'South Africa\'s unemployment rate is around 32%. A policy that would MOST directly create jobs in the secondary sector would be:', math: '',
      options: ['Subsidising gold mines to extract more ore', 'Incentivising local manufacturing to process raw materials into goods', 'Expanding internet access across townships', 'Reducing VAT on food items'],
      correctIndex: 1, hint: 'The secondary sector is manufacturing — which policy directly grows manufacturing?',
      explanation: 'Incentivising local manufacturing directly grows the secondary sector by encouraging factories to process South Africa\'s abundant raw materials locally (instead of exporting them unprocessed). This creates skilled and semi-skilled jobs in manufacturing. Subsidising mines grows primary; internet access and VAT reduction are tertiary/consumer measures.'
    },
    {
      id: 'h3', question: 'A business that grows sugarcane AND processes it into refined sugar AND sells it to retailers is active in:', math: '',
      options: ['Primary sector only', 'Secondary sector only', 'All three sectors — primary, secondary, and tertiary', 'Tertiary sector only — it sells to customers'],
      correctIndex: 2, hint: 'Map each activity to a sector: growing → primary; processing → secondary; selling → tertiary.',
      explanation: 'Growing sugarcane is primary (extracting a natural resource). Processing it into refined sugar is secondary (manufacturing/transformation). Selling to retailers is tertiary (distribution/service). A vertically integrated business can span all three sectors.'
    },
    {
      id: 'h4', question: 'Which statement about the tertiary sector in South Africa is MOST accurate?', math: '',
      options: ['It is the smallest sector by employment', 'It is declining as people prefer goods to services', 'It is the largest sector and includes banking, retail, and education', 'It only includes government services'],
      correctIndex: 2, hint: 'Think about where most South Africans actually work — in mines, factories, or services?',
      explanation: 'The tertiary sector is South Africa\'s largest sector by contribution to GDP and employment. It includes banking, retail, transport, education, healthcare, tourism, and ICT. Most urban workers are employed in services. Primary and secondary sectors are also significant but smaller in employment terms.'
    },
  ],
}

const SUBJECT = 'Business Studies'
const GRADE = 10
const TOPIC_ID = 'business-sectors'
const NEXT_TOPIC_ID = 'business-stakeholders'
const STORAGE_KEY_PREFIX = 'scratchpad_biz-sectors_'

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
                    <button onClick={() => setActiveBubble(isActive ? null : token)}
                      className={`px-4 py-2 rounded-lg font-mono text-xs font-semibold transition-all ${bubble
                        ? (isActive ? 'bg-slate-600 text-white shadow-md scale-105' : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100')
                        : 'bg-white text-slate-400 border border-slate-200 cursor-default'}`}>
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
    setHistory(h => h.slice(0, -1)); localStorage.setItem(storageKey, canvas.toDataURL())
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
          <div className="bg-slate-50 border border-slate-100 rounded-xl px-5 py-4 text-xs font-semibold text-slate-900 text-center">{step.math}</div>
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
              className="px-5 py-2.5 bg-slate-900 text-white rounded-xl disabled:opacity-30 hover:bg-slate-700 transition-colors font-medium">Check Answer</button>
          : <button onClick={next}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-700 transition-colors font-medium">
              {idx < questions.length - 1 ? 'Next Question' : 'See Results'} <ArrowRight className="w-4 h-4" />
            </button>
        }
      </div>
    </div>
  )
}

function FeedbackModule({ score, total, onRetry, onContinue, nextTopicName }: {
  score: number; total: number; onRetry: () => void; onContinue: () => void; nextTopicName: string
}) {
  const pct = score / total; const mastered = pct >= 2 / 3
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

function BusinessSectorsPage({ onNavigate }: { onNavigate: (page: any) => void }) {
  const session = useStudySession()
  const [view, setView] = useState<ViewState>('overview')
  const [practiceScore, setPracticeScore] = useState(0)
  const [thisStatus, setThisStatus] = useState<TopicStatus>('not-started')
  const [nextStatus, setNextStatus] = useState<TopicStatus>('not-started')

  useEffect(() => {
    if (!session) return
    loadTopicStatus(session.student_id, TOPIC_ID).then(setThisStatus)
    loadTopicStatus(session.student_id, NEXT_TOPIC_ID).then(setNextStatus)
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
              <button onClick={() => setView('interactive-lesson')} className="w-full bg-white rounded-2xl border border-slate-200 p-4 flex items-center justify-between hover:border-slate-300 hover:shadow-md transition-all group text-left">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold shrink-0 ${thisStatus === 'mastered' ? 'bg-slate-500 text-white' : 'bg-slate-900 text-white'}`}>
                    {thisStatus === 'mastered' ? '✓' : '2'}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{TOPIC.title}</p>
                    <p className="text-sm text-slate-500 mt-0.5">{TOPIC.description}</p>
                    <div className="mt-2">{statusLabel(thisStatus)}</div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-600 transition-colors shrink-0" />
              </button>
              <button onClick={() => onNavigate('learning-bizstudies-g10-t1-stakeholders' as AppPage)} className="w-full bg-white rounded-2xl border border-slate-200 p-4 flex items-center justify-between hover:border-slate-300 hover:shadow-md transition-all group text-left">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold shrink-0 ${nextStatus === 'mastered' ? 'bg-slate-500 text-white' : 'bg-slate-900 text-white'}`}>
                    {nextStatus === 'mastered' ? '✓' : '3'}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Business Stakeholders</p>
                    <p className="text-sm text-slate-500 mt-0.5">Internal and external stakeholders and their interests.</p>
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
              {view === 'interactive-lesson' && <motion.div key="lesson" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><InteractiveLesson onComplete={() => setView('guided-practice')} /></motion.div>}
              {view === 'guided-practice' && <motion.div key="guided" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><GuidedPracticeModule onComplete={() => setView('practice')} /></motion.div>}
              {view === 'practice' && <motion.div key="practice" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><PracticeModule questions={TOPIC.initialQuestions} onComplete={handlePracticeComplete} /></motion.div>}
              {view === 'remediation' && (
                <motion.div key="remediation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-slate-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-slate-900 text-sm">Let's try again</p>
                      <p className="text-slate-700 text-sm mt-0.5">Here are two more questions to build your understanding.</p>
                    </div>
                  </div>
                  <PracticeModule questions={TOPIC.remediationQuestions} onComplete={handleRemediationComplete} />
                </motion.div>
              )}
              {view === 'practice-more' && <motion.div key="hard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><PracticeModule questions={TOPIC.hardQuestions} onComplete={handleHardComplete} /></motion.div>}
              {view === 'feedback' && (
                <motion.div key="feedback" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <FeedbackModule score={practiceScore} total={TOPIC.initialQuestions.length} onRetry={() => setView('practice')} onContinue={() => onNavigate('learning-bizstudies-g10-t1-stakeholders' as AppPage)} nextTopicName="Business Stakeholders" />
                  <div className="mt-6 text-center">
                    <button onClick={() => setView('practice-more')} className="text-sm text-slate-600 hover:text-slate-800 transition-colors underline underline-offset-2">Want harder questions? Try Practice More</button>
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

export default BusinessSectorsPage
