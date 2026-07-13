import { useState, useEffect, useRef, useCallback } from 'react'
import { useStudySession } from '../../../../../../../providers/StudySessionContext'
import { loadTopicProgress as _loadProgress, saveTopicProgress as _saveProgress } from '../../../../../../../lib/studyProgress'
import { motion, AnimatePresence } from 'motion/react'
import {
  ChevronLeft, ChevronRight, ArrowRight, Lightbulb, RotateCcw,
  Award, AlertCircle, PenLine, Eraser, Trash2, Undo2, X, NotebookPen
} from 'lucide-react'
import { LearningOutcomes, KnowledgeCheck, ExamTip, SummaryCard } from '../../../../../../../components/LessonEnrichment'

type TopicStatus = 'not-started' | 'mastered' | 'needs-practice'
type ViewState = 'interactive-lesson' | 'guided-practice' | 'practice' | 'remediation' | 'feedback' | 'practice-more'
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
  enrichment: {
    outcomes: [
      'Define the business environment and explain why businesses must monitor it',
      'Distinguish between the micro, market, and macro environments',
      'Identify and give examples of factors in each environment',
      'Explain the difference between controllable and uncontrollable factors',
      'Apply environmental analysis to classify factors affecting a real business',
    ],
    knowledgeChecks: [
      {
        afterStep: 0,
        question: 'Which environment contains factors a business has DIRECT CONTROL over?',
        options: [
          'The macro environment',
          'The market environment',
          'The micro environment',
          'The natural environment',
        ],
        correctIndex: 2,
        explanation: "The micro environment consists of internal factors the business controls directly — its own resources, management, employees, production processes, and organisational culture. Market and macro environments contain factors outside the business's direct control.",
      },
      {
        afterStep: 2,
        question: 'A new law requires all businesses to pay a higher minimum wage. This is a factor in the:',
        options: [
          'Micro environment',
          'Market environment',
          'Macro environment',
          'Competitor environment',
        ],
        correctIndex: 2,
        explanation: 'Government legislation is a political/legal factor in the macro environment. These are uncontrollable — all businesses must comply regardless of their preferences. The macro environment includes Political, Economic, Social, Technological, Environmental, and Legal (PESTEL) factors.',
      },
    ],
    examTip: 'In Business Studies exams, you will often be given a scenario and asked to classify a factor into its environment. Remember: micro = internal, controllable; market = customers, suppliers, competitors (partially controllable); macro = PESTEL factors, uncontrollable. Use these three words as your framework.',
    summaryPoints: [
      'Micro environment: internal to the business — owners, employees, resources, processes (controllable)',
      'Market environment: customers, suppliers, competitors, intermediaries (partially controllable)',
      'Macro environment: PESTEL factors — Political, Economic, Social, Technological, Environmental, Legal (uncontrollable)',
      'Controllable factors can be changed by management decisions; uncontrollable factors cannot',
      'Strengths and weaknesses come from the micro environment',
      'Opportunities and threats come from the market and macro environments',
    ],
  },
}

const SUBJECT = 'Business Studies'
const GRADE = 10
const TOPIC_ID = 'business-environment'

async function loadTopicProgress(studentId: number): Promise<TopicStatus> {{
  const m = await _loadProgress(studentId, SUBJECT, GRADE, TOPIC_ID)
  if (m === 'mastered') return 'mastered'
  if (m === 'needs_practice') return 'needs-practice'
  return 'not-started'
}}

async function saveTopicProgress(studentId: number, schoolId: number, status: TopicStatus, correct: number, total: number, attempts: number) {{
  const ml = status === 'mastered' ? 'mastered' : status === 'needs-practice' ? 'needs_practice' : 'not_started'
  await _saveProgress(studentId, schoolId, SUBJECT, GRADE, TOPIC_ID, ml, correct, total, attempts)
}}
const STORAGE_KEY_PREFIX = 'scratchpad_biz-env_'





// ── SpeechBubble ──────────────────────────────────────────────────────────────
const SpeechBubble = ({ text, pos }: { text: string; pos: 'top' | 'bottom' }) => (
  <motion.div
    initial={{ scale: 0, opacity: 0, y: pos === 'top' ? 10 : -10 }}
    animate={{ scale: 1, opacity: 1, y: 0 }}
    transition={{ type: 'spring', stiffness: 400, damping: 24 }}
    className={`absolute ${pos === 'top' ? '-top-12' : '-bottom-12'} left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#1e293b] text-white text-xs font-bold px-3 py-2 rounded-xl shadow-lg z-20`}
  >
    {text}
    <div className={`absolute left-1/2 -translate-x-1/2 w-2 h-2 bg-[#1e293b] rotate-45 ${pos === 'top' ? '-bottom-1' : '-top-1'}`} />
  </motion.div>
)

// ── InteractiveLesson ─────────────────────────────────────────────────────────
const InteractiveLesson = ({ onComplete }: { onComplete: () => void }) => {
  const [current, setCurrent] = useState(0)
  const [activeBubble, setActiveBubble] = useState<string | null>(null)
  const step = TOPIC.interactiveSteps[current]
  const isLast = current === TOPIC.interactiveSteps.length - 1
  const knowledgeCheck = TOPIC.enrichment.knowledgeChecks.find(kc => kc.afterStep === current)

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Enrichment — outcomes and exam tip shown at top of lesson */}
      <LearningOutcomes outcomes={TOPIC.enrichment.outcomes} />
      <ExamTip tip={TOPIC.enrichment.examTip} />

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
          <div className="px-6 pt-6 pb-5">
            <h3 className="text-lg font-black text-[#1e293b] leading-tight">{step.title}</h3>
            <p className="text-[15px] text-stone-500 leading-relaxed mt-2">{step.content}</p>
          </div>
          <div className="mx-4 mb-4 bg-[#EEF2F7] rounded-xl px-4 pt-4 pb-6">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-stone-400 mb-6">Tap an element to learn more</p>
            <div className="flex items-center justify-center gap-2 flex-wrap" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
              {step.math.map((token, i) => {
                const bubble = step.bubbles.find((b: any) => b.target === token)
                const isActive = activeBubble === `${current}-${token}-${i}`
                return (
                  <div key={i} className="relative">
                    {bubble && isActive && <SpeechBubble text={bubble.text} pos={bubble.pos} />}
                    {bubble ? (
                      <button
                        onClick={() => setActiveBubble(isActive ? null : `${current}-${token}-${i}`)}
                        className={`px-4 py-2.5 rounded-xl font-mono text-lg font-black transition-all ${isActive ? 'bg-[#1e293b] text-white scale-105 shadow-md' : 'bg-white text-stone-800 border border-stone-200 hover:border-stone-400 hover:bg-stone-50'}`}
                      >
                        {token}
                      </button>
                    ) : (
                      <span className="px-1.5 font-mono text-xl font-black text-stone-400 select-none">{token}</span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Inline knowledge check for this step */}
      {knowledgeCheck && (
        <KnowledgeCheck
          key={`kc-${current}`}
          question={knowledgeCheck.question}
          options={knowledgeCheck.options}
          correctIndex={knowledgeCheck.correctIndex}
          explanation={knowledgeCheck.explanation}
        />
      )}

      {/* Summary card on the last step */}
      {isLast && (
        <SummaryCard points={TOPIC.enrichment.summaryPoints} />
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center pt-1">
        <button
          onClick={() => { setCurrent(c => c - 1); setActiveBubble(null) }}
          disabled={current === 0}
          className="flex items-center gap-1.5 text-[13px] font-bold text-stone-400 disabled:opacity-20 hover:text-stone-900 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>
        <button
          onClick={() => { isLast ? onComplete() : setCurrent(c => c + 1); setActiveBubble(null) }}
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

      <div className="flex gap-2 overflow-x-auto pb-1">
        {steps.map((s: any, i: number) => (
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
    ctx.beginPath(); ctx.moveTo(pos.x, pos.y)
    lastPos.current = pos
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
          <canvas
            ref={canvasRef}
            className="w-full h-full touch-none"
            style={{ cursor: tool === 'pen' ? 'crosshair' : 'cell' }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
          />
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
          <span className="text-[11px] font-black uppercase tracking-[0.22em] text-stone-400">
            Question {idx + 1} of {questions.length}
          </span>
          <div className="flex gap-1">
            {questions.map((_, i) => (
              <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i < idx ? 'w-5 bg-[#1e293b]' : i === idx ? 'w-8 bg-[#1e293b]' : 'w-5 bg-stone-200'}`} />
            ))}
          </div>
        </div>
        <button
          onClick={() => setScratchpadKey(`scratchpad_biz-env_q-${idx}`)}
          className="flex items-center gap-1.5 text-[11px] font-bold text-stone-400 hover:text-stone-800 border border-stone-200 bg-white rounded-lg px-3 py-1.5 hover:border-stone-400 hover:shadow-sm transition-all"
        >
          <NotebookPen className="w-3 h-3" /> Scratch
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={q.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
          className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden"
        >
          <div className="px-6 pt-6 pb-4">
            <p className="font-black text-[#1e293b] text-[17px] leading-snug">{q.question}</p>
            {q.math && (
              <div className="mt-3 bg-[#EEF2F7] rounded-xl px-5 py-4 border border-stone-200/50">
                <p className="font-mono text-[15px] text-stone-800 font-bold leading-relaxed wrap-break-word">{q.math}</p>
              </div>
            )}
          </div>

          <div className="h-px bg-stone-100 mx-6" />

          <div className="px-6 py-4 space-y-2.5">
            {q.options.map((opt, i) => {
              const isCorrect = i === q.correctIndex
              const isSelected = i === selected
              let ctr = 'w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all text-left '
              let lbl = 'w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-black shrink-0 transition-all '
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
              <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="mx-6 mb-5">
                <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3.5 flex items-start gap-3">
                  <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-px" />
                  <p className="text-[14px] text-amber-800 leading-relaxed">{q.hint}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {confirmed && (
              <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
                className={`mx-6 mb-5 rounded-xl px-4 py-4 border ${selected === q.correctIndex ? 'bg-emerald-50 border-emerald-200' : 'bg-[#EEF2F7] border-stone-200'}`}>
                <p className={`text-[10px] font-black uppercase tracking-[0.18em] mb-2 ${selected === q.correctIndex ? 'text-emerald-600' : 'text-stone-400'}`}>
                  {selected === q.correctIndex ? 'Correct!' : 'Explanation'}
                </p>
                <p className={`text-[14px] leading-relaxed ${selected === q.correctIndex ? 'text-emerald-800' : 'text-stone-700'}`}>{q.explanation}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="px-6 py-4 border-t border-stone-100 flex justify-between items-center">
            <span className={`flex items-center gap-1.5 text-[11px] font-bold ${confirmed ? (selected === q.correctIndex ? 'text-emerald-600' : 'text-red-400') : 'text-stone-300'}`}>
              {confirmed && <span className={`w-1.5 h-1.5 rounded-full inline-block ${selected === q.correctIndex ? 'bg-emerald-500' : 'bg-red-400'}`} />}
              {confirmed ? (selected === q.correctIndex ? 'Correct' : 'Incorrect') : 'Select an answer'}
            </span>
            {!confirmed
              ? <button onClick={confirm} disabled={selected === null} className="px-5 py-2.5 bg-[#1e293b] text-white rounded-xl disabled:opacity-25 hover:bg-stone-800 font-black text-sm shadow-sm transition-all">
                  Check Answer
                </button>
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
function BusinessEnvironmentPage({ onNavigate }: { onNavigate: (page: any) => void }) {
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
            <p className="text-[13px] text-stone-400 mt-0.5">Business Studies · Grade 10 · Term 1 · Topic 1</p>
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
                <FeedbackModule
                  correct={practiceResult?.correct ?? 0}
                  total={practiceResult?.total ?? (previousView === 'practice-more' ? TOPIC.hardQuestions.length : TOPIC.initialQuestions.length)}
                  onRetry={() => setView('interactive-lesson')}
                  onPracticeMore={() => setView('practice-more')}
                  onContinue={() => onNavigate('library')}
                  hidePracticeMore={previousView === 'practice-more'}
                />
              )}
            </motion.div>
          </AnimatePresence>

        </div>
      </main>
    </div>
  )
}

export default BusinessEnvironmentPage
