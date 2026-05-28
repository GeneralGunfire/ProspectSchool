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
  id: 'economic-problem',
  title: 'The Economic Problem',
  description: 'Scarcity, choice, and opportunity cost — the foundations of economics.',
  interactiveSteps: [
    {
      id: 'step-1',
      title: 'What Is the Economic Problem?',
      content: 'The fundamental economic problem is SCARCITY — human wants are unlimited, but the resources available to satisfy those wants are limited. Because we cannot have everything we want, we must CHOOSE. Every choice involves a trade-off. Economics is the study of how individuals, businesses, and governments make these choices.',
      math: ['Unlimited', 'Wants', '>', 'Limited', 'Resources'],
      bubbles: [
        { target: 'Unlimited', text: 'We always want more', pos: 'top' as const },
        { target: 'Limited', text: 'Land, labour, capital, entrepreneurship', pos: 'bottom' as const }
      ]
    },
    {
      id: 'step-2',
      title: 'Needs vs. Wants',
      content: 'A NEED is something essential for survival: food, water, shelter, clothing, healthcare. A WANT is something we desire but could survive without: a smartphone, holidays, designer shoes. Economics deals with both — scarcity forces us to prioritise needs over wants, though the boundary can be subjective and changes over time.',
      math: ['Needs', '(essential)', '|', 'Wants', '(desired)'],
      bubbles: [
        { target: 'Needs', text: 'Food, water, shelter', pos: 'top' as const },
        { target: 'Wants', text: 'TV, car, holidays', pos: 'bottom' as const }
      ]
    },
    {
      id: 'step-3',
      title: 'Opportunity Cost',
      content: 'When you choose one thing, you give up something else. The OPPORTUNITY COST is the value of the next best alternative you gave up when making a choice. It is not the money cost — it is the foregone benefit. Example: If you spend Saturday studying instead of working a part-time job, the opportunity cost is the income you would have earned.',
      math: ['Choice', '=', 'Gain', '+', 'Foregone', 'Alternative'],
      bubbles: [
        { target: 'Gain', text: 'What you chose', pos: 'top' as const },
        { target: 'Foregone', text: 'The opportunity cost', pos: 'bottom' as const }
      ]
    },
    {
      id: 'step-4',
      title: 'The Three Economic Questions',
      content: 'Because of scarcity, every society must answer three fundamental questions: (1) WHAT to produce — which goods and services? (2) HOW to produce — which production methods? (3) FOR WHOM to produce — who gets the goods and services? Different economic systems (market, command, mixed) answer these questions in different ways.',
      math: ['WHAT', '?', 'HOW', '?', 'FOR WHOM', '?'],
      bubbles: [
        { target: 'WHAT', text: 'Which goods to make', pos: 'top' as const },
        { target: 'FOR WHOM', text: 'Who receives the output', pos: 'bottom' as const }
      ]
    },
  ],
  guidedItem: {
    problem: 'Apply the concept of opportunity cost to three real South African decision scenarios.',
    steps: [
      { id: 1, instruction: 'Scenario: The South African government spends R10 billion building new roads', math: 'Opportunity cost = the next best use of R10 billion', explanation: 'If the government spends R10 billion on roads, it cannot spend that same money on hospitals, schools, or housing. The opportunity cost is whichever of those alternatives would have provided the greatest benefit. Choosing roads means forgoing that alternative — scarcity forces the trade-off.' },
      { id: 2, instruction: 'Scenario: A Grade 10 student spends 3 hours on social media instead of studying', math: 'Opportunity cost = the exam marks not earned (foregone study time)', explanation: 'The 3 hours on social media have an opportunity cost: the improvement in exam marks and understanding that studying for 3 hours would have produced. The cost is not money — it is the foregone academic achievement.' },
      { id: 3, instruction: 'Scenario: A farmer plants maize instead of sunflowers on his land', math: 'Opportunity cost = the profit from sunflowers foregone', explanation: 'The farmer\'s land is a scarce resource — it can only be used for one crop at a time. By choosing maize, the farmer foregoes whatever profit sunflowers would have generated. That foregone profit is the opportunity cost of the maize decision.' },
    ]
  },
  initialQuestions: [
    {
      id: 'q1', question: 'What is the root cause of the economic problem?', math: '',
      options: ['Governments spending too much money', 'Scarcity — unlimited wants but limited resources', 'Businesses making too much profit', 'Unemployment reducing consumer spending'],
      correctIndex: 1, hint: 'The economic problem exists because we cannot have everything we want.',
      explanation: 'The economic problem is caused by SCARCITY — human wants are unlimited but the resources (land, labour, capital, entrepreneurship) available to satisfy those wants are finite. This forces individuals, businesses, and governments to make choices about how to allocate scarce resources.'
    },
    {
      id: 'q2', question: 'Zanele chooses to go to university instead of taking a job that pays R8 000 per month. What is the opportunity cost of going to university?', math: '',
      options: ['The cost of university tuition fees', 'The R8 000 per month salary she gave up', 'Nothing — university is always the right choice', 'The cost of textbooks and accommodation'],
      correctIndex: 1, hint: 'Opportunity cost is the value of the next best alternative that was NOT chosen.',
      explanation: 'The opportunity cost is the R8 000 per month she would have earned in the job — the benefit she gave up by choosing university. Tuition fees and textbooks are monetary costs, not opportunity costs. Opportunity cost specifically refers to the VALUE of the FOREGONE ALTERNATIVE.'
    },
    {
      id: 'q3', question: 'Which of the following is the BEST example of a NEED?', math: '',
      options: ['A new gaming console', 'A meal to prevent starvation', 'A holiday to Durban', 'A second car for convenience'],
      correctIndex: 1, hint: 'A need is essential for survival — you cannot live without it.',
      explanation: 'Food (a meal to prevent starvation) is a basic need — it is essential for survival. A gaming console, holiday, and second car are wants — desirable but not essential. The distinction matters in economics because scarcity forces prioritisation of needs over wants.'
    },
    {
      id: 'q4', question: 'South Africa must choose whether to invest in renewable energy or expand coal mining. This decision directly addresses which of the three economic questions?', math: '',
      options: ['FOR WHOM to produce', 'HOW to produce energy', 'WHAT to produce — which energy sources to develop', 'None of the three — this is a political question only'],
      correctIndex: 2, hint: 'The decision is about WHICH type of energy production to develop — what the economy will produce.',
      explanation: 'Choosing between renewable energy and coal mining is a "WHAT to produce" question — which goods and services the economy will prioritise. It also involves "HOW to produce" (production methods), but the primary question is WHAT energy infrastructure to develop. All three economic questions often overlap in real decisions.'
    },
  ],
  remediationQuestions: [
    {
      id: 'r1', question: 'Why does scarcity force people to make choices?', math: '',
      options: ['Because money is always limited', 'Because resources are limited but wants are unlimited — you cannot have everything', 'Because the government controls spending', 'Because prices are too high'],
      correctIndex: 1, hint: 'Scarcity means there is not enough of everything — so you must choose.',
      explanation: 'Scarcity means limited resources relative to unlimited wants. Since you cannot satisfy all wants simultaneously, you must choose which wants to satisfy. Every choice means giving something up — which is what makes economics necessary as a discipline.'
    },
    {
      id: 'r2', question: 'A business has R50 000 and must choose between buying a new delivery van OR upgrading its computer system. It chooses the van. What is the opportunity cost?', math: '',
      options: ['The R50 000 spent on the van', 'The upgraded computer system that was not purchased', 'The petrol costs for the van', 'The cost of both options combined'],
      correctIndex: 1, hint: 'Opportunity cost is what you gave up — the alternative you did NOT choose.',
      explanation: 'The opportunity cost is the upgraded computer system — the benefit the business would have gained from that alternative but gave up. The R50 000 is just the monetary cost; opportunity cost is specifically the VALUE of the foregone alternative (the computer upgrade benefits).'
    },
  ],
  hardQuestions: [
    {
      id: 'h1', question: 'South Africa has an unemployment rate of about 32%. From an economic perspective, what does this represent?', math: '',
      options: ['An abundance of labour resources — good for the economy', 'A misallocation of scarce labour resources — idle labour is an economic problem', 'Proof that scarcity does not apply to human labour', 'A purely social problem with no economic implications'],
      correctIndex: 1, hint: 'Labour is a scarce resource — idle labour means scarce resources are being wasted.',
      explanation: 'High unemployment is an economic problem because labour is a scarce resource. When workers are unemployed, their productive capacity is idle — the economy produces less than it could. This represents a misallocation (or non-use) of scarce human resources, resulting in lower output, lower incomes, and reduced living standards. It is both an economic and social problem.'
    },
    {
      id: 'h2', question: 'The concept of opportunity cost applies to governments as well. If South Africa\'s government increases spending on social grants, what is the likely opportunity cost?', math: '',
      options: ['There is no opportunity cost — the government can print more money', 'Reduced spending on infrastructure, education, or healthcare (the next best alternative)', 'Higher taxes are the opportunity cost', 'The opportunity cost is zero because social grants benefit everyone'],
      correctIndex: 1, hint: 'Government budgets are limited — spending more here means spending less somewhere else.',
      explanation: 'Government revenue (taxes) is scarce. Increasing social grant spending means the SAME money cannot be spent on infrastructure, schools, or hospitals. The opportunity cost is the value of those foregone alternatives — whatever would have provided the next greatest benefit. This is why government budgeting is fundamentally an exercise in applying opportunity cost reasoning.'
    },
    {
      id: 'h3', question: 'How does opportunity cost relate to the concept of "there is no such thing as a free lunch"?', math: '',
      options: ['It means businesses should never offer free promotions', 'Even "free" things have a cost — someone always pays or something is always given up', 'It is a statement about restaurant economics, not economics theory', 'Free trade agreements eliminate opportunity cost'],
      correctIndex: 1, hint: 'If something appears free to you, think about what it cost someone else — or what you gave up to get it.',
      explanation: '"There is no such thing as a free lunch" captures the essence of opportunity cost. Even when something is "free" (subsidised, donated, or gifted), resources were used to produce it — those resources had alternative uses. The opportunity cost was borne by someone (the taxpayer, the donor, or the producer). Nothing is truly free in economics because all resources are scarce.'
    },
    {
      id: 'h4', question: 'A country can produce either 100 units of food OR 50 units of clothing (or combinations). If it chooses to produce 100 units of food and 0 clothing, what is the opportunity cost of the LAST unit of food?', math: '',
      options: ['Zero — the country chose food, so clothing has no value', 'The clothing production that was sacrificed to produce that last unit of food', 'R100 — the market price of a unit of food', 'The opportunity cost is the same for all units of food'],
      correctIndex: 1, hint: 'This is the production possibility concept — what must be given up to produce one more unit of a good?',
      explanation: 'The opportunity cost of each additional unit of food is the clothing production that must be given up to produce it. If all resources are used for food (100 units), then ZERO clothing is produced — all potential clothing output has been sacrificed. The opportunity cost of the last unit of food is the clothing that could have been made with those same resources. This introduces the concept of the Production Possibility Curve (PPC).'
    },
  ],
}

const SUBJECT = 'Economics'
const GRADE = 10
const TOPIC_ID = 'economic-problem'
const NEXT_TOPIC_ID = 'production-possibility-curve'
const STORAGE_KEY_PREFIX = 'scratchpad_econ-problem_'

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
                      className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${bubble ? (isActive ? 'bg-slate-600 text-white shadow-md scale-105' : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100') : 'bg-white text-slate-400 border border-slate-200 cursor-default'}`}>
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
          : <><button onClick={onRetry} className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-700 transition-colors font-medium"><RotateCcw className="w-4 h-4" /> Try Again</button><button onClick={onContinue} className="px-6 py-2.5 text-slate-600 hover:text-slate-900 transition-colors text-sm">Continue anyway</button></>}
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

function EconomicProblemPage({ onNavigate }: { onNavigate: (page: any) => void }) {
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
            <div><p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Economics · Grade 10 · Term 1</p><h1 className="text-3xl font-bold text-slate-900">Topics</h1></div>
            <div className="space-y-3">
              <button onClick={() => setView('interactive-lesson')} className="w-full bg-white rounded-2xl border border-slate-200 p-4 flex items-center justify-between hover:border-slate-300 hover:shadow-md transition-all group text-left">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold shrink-0 ${thisStatus === 'mastered' ? 'bg-slate-500 text-white' : 'bg-slate-900 text-white'}`}>{thisStatus === 'mastered' ? '✓' : '1'}</div>
                  <div><p className="font-semibold text-slate-900">{TOPIC.title}</p><p className="text-sm text-slate-500 mt-0.5">{TOPIC.description}</p><div className="mt-2">{statusLabel(thisStatus)}</div></div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-600 transition-colors shrink-0" />
              </button>
              <button onClick={() => onNavigate('learning-economics-g10-t1-ppc' as AppPage)} className="w-full bg-white rounded-2xl border border-slate-200 p-4 flex items-center justify-between hover:border-slate-300 hover:shadow-md transition-all group text-left">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold shrink-0 ${nextStatus === 'mastered' ? 'bg-slate-500 text-white' : 'bg-slate-900 text-white'}`}>{nextStatus === 'mastered' ? '✓' : '2'}</div>
                  <div><p className="font-semibold text-slate-900">Production Possibility Curve</p><p className="text-sm text-slate-500 mt-0.5">The PPC and what shifts it — opportunity cost visualised.</p><div className="mt-2">{statusLabel(nextStatus)}</div></div>
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
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Economics · Grade 10</span>
            </div>
            <AnimatePresence mode="wait">
              {view === 'interactive-lesson' && <motion.div key="lesson" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><InteractiveLesson onComplete={() => setView('guided-practice')} /></motion.div>}
              {view === 'guided-practice' && <motion.div key="guided" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><GuidedPracticeModule onComplete={() => setView('practice')} /></motion.div>}
              {view === 'practice' && <motion.div key="practice" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><PracticeModule questions={TOPIC.initialQuestions} onComplete={handlePracticeComplete} /></motion.div>}
              {view === 'remediation' && <motion.div key="remediation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6"><div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-start gap-3"><AlertCircle className="w-5 h-5 text-slate-500 mt-0.5 shrink-0" /><div><p className="font-medium text-slate-900 text-sm">Let's try again</p><p className="text-slate-700 text-sm mt-0.5">Two more questions to build your understanding.</p></div></div><PracticeModule questions={TOPIC.remediationQuestions} onComplete={handleRemediationComplete} /></motion.div>}
              {view === 'practice-more' && <motion.div key="hard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><PracticeModule questions={TOPIC.hardQuestions} onComplete={handleHardComplete} /></motion.div>}
              {view === 'feedback' && <motion.div key="feedback" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><FeedbackModule score={practiceScore} total={TOPIC.initialQuestions.length} onRetry={() => setView('practice')} onContinue={() => onNavigate('learning-economics-g10-t1-ppc' as AppPage)} nextTopicName="Production Possibility Curve" /><div className="mt-6 text-center"><button onClick={() => setView('practice-more')} className="text-sm text-slate-600 hover:text-slate-800 transition-colors underline underline-offset-2">Want harder questions? Try Practice More</button></div></motion.div>}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  )
}

export default EconomicProblemPage
