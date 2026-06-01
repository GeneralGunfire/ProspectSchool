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
  id: 'production-possibility-curve',
  title: 'Production Possibility Curve',
  description: 'The PPC shows all possible production combinations — and what shifts it.',
  interactiveSteps: [
    {
      id: 'step-1',
      title: 'What Is the PPC?',
      content: 'The Production Possibility Curve (PPC) shows all the possible combinations of two goods that an economy can produce when ALL its resources are fully and efficiently used. Points ON the PPC are efficient. Points INSIDE the PPC mean resources are idle (inefficient). Points OUTSIDE the PPC are currently unattainable.',
      math: ['Inside', '(waste)', '|', 'ON', '(efficient)', '|', 'Outside', '(unattainable)'],
      bubbles: [
        { target: 'ON', text: 'Full resource use — efficient', pos: 'top' as const },
        { target: 'Outside', text: 'Beyond current capacity', pos: 'bottom' as const }
      ]
    },
    {
      id: 'step-2',
      title: 'The Shape of the PPC',
      content: 'The PPC is typically CONCAVE (bowed outward) — not a straight line. This is because of the Law of Increasing Opportunity Cost: as you produce more of one good, you must give up increasingly more of the other good. Resources are not perfectly substitutable — some are better suited to producing one good than the other.',
      math: ['More', 'Food', '→', 'Increasing', 'Cost', 'in', 'Clothing'],
      bubbles: [
        { target: 'More', text: 'Shifting production to food', pos: 'top' as const },
        { target: 'Increasing', text: 'Opportunity cost rises', pos: 'bottom' as const }
      ]
    },
    {
      id: 'step-3',
      title: 'Movement Along the PPC',
      content: 'Moving ALONG the PPC means the economy is shifting resources from one good to another. No resources are gained or lost — just reallocated. For example, moving from producing more food to more clothing: food output falls, clothing output rises. The opportunity cost of more clothing is the food given up.',
      math: ['A', '→', 'B', '=', 'Trade-off', '(same', 'resources)'],
      bubbles: [
        { target: 'Trade-off', text: 'Gain clothing, lose food', pos: 'top' as const },
        { target: 'same', text: 'Total resources unchanged', pos: 'bottom' as const }
      ]
    },
    {
      id: 'step-4',
      title: 'Shifts of the PPC',
      content: 'The entire PPC SHIFTS when the economy\'s productive capacity changes. OUTWARD shift (economic growth): more resources, better technology, improved education/skills, discovery of natural resources. INWARD shift (decline): natural disasters, war, disease epidemic, emigration of skilled workers. A shift changes what is possible — not just the trade-off.',
      math: ['Outward', '=', 'Growth', '|', 'Inward', '=', 'Decline'],
      bubbles: [
        { target: 'Outward', text: 'Better tech, more resources', pos: 'top' as const },
        { target: 'Inward', text: 'War, disaster, disease', pos: 'bottom' as const }
      ]
    },
  ],
  guidedItem: {
    problem: 'An economy produces only two goods: guns (defence) and butter (food). Use PPC concepts to answer each scenario.',
    steps: [
      { id: 1, instruction: 'The economy is at a point inside the PPC — what does this mean?', math: 'Inside PPC = Inefficient production (idle resources)', explanation: 'A point inside the PPC means resources are not being fully or efficiently used. Some workers may be unemployed, factories may be idle, or land is unused. The economy could produce MORE of both goods without giving anything up — it is operating below potential. High unemployment is a classic reason for being inside the PPC.' },
      { id: 2, instruction: 'The economy moves from producing 100 guns & 200 butter units to 150 guns & 150 butter', math: 'Movement along the PPC: +50 guns, −50 butter (opportunity cost)', explanation: 'This is movement ALONG the PPC — the economy shifted resources from butter to gun production. No new resources were created; they were reallocated. The opportunity cost of the 50 extra guns is the 50 units of butter that were sacrificed. This illustrates the trade-off on an efficient PPC.' },
      { id: 3, instruction: 'Agricultural technology improves, allowing farmers to produce much more butter with the same resources', math: 'PPC shifts OUTWARD (asymmetric — only in the butter direction initially)', explanation: 'Better agricultural technology increases productive capacity in the butter sector. The PPC shifts outward — but more so on the butter axis than the guns axis. The economy can now produce more butter without reducing gun production, or can produce the same butter and redirect freed resources to guns. This is economic growth in one sector.' },
    ]
  },
  initialQuestions: [
    {
      id: 'q1', question: 'A point INSIDE the PPC represents:', math: '',
      options: ['Economic growth — the economy is performing well', 'Inefficiency — resources are idle or poorly allocated', 'An unattainable production combination', 'The maximum possible production of both goods'],
      correctIndex: 1, hint: 'Inside the PPC means you could produce more of BOTH goods with better resource use.',
      explanation: 'A point inside the PPC is inefficient — resources are not being fully used (e.g., unemployment, idle factories). The economy could move to the PPC itself and produce more of both goods simultaneously, without any trade-off. High unemployment is the classic cause of production inside the PPC.'
    },
    {
      id: 'q2', question: 'Why is the PPC concave (bowed outward) rather than a straight line?', math: '',
      options: ['Because both goods always have the same opportunity cost', 'Because of the Law of Increasing Opportunity Cost — resources are not perfectly substitutable', 'Because the economy always wastes some resources', 'Because producers prefer one good over the other'],
      correctIndex: 1, hint: 'Think about what happens to opportunity cost as you produce more and more of one good.',
      explanation: 'The PPC is concave because of the Law of Increasing Opportunity Cost. As you shift more resources toward one good, the opportunity cost per unit of that good increases — because you start using resources that are increasingly poorly suited to producing it. Resources are specialized; a tractor is better for farming than for manufacturing. This rising cost produces the concave shape.'
    },
    {
      id: 'q3', question: 'Which of the following would cause an OUTWARD shift of South Africa\'s PPC?', math: '',
      options: ['A drought that destroys 30% of agricultural output', 'Mass emigration of skilled engineers to other countries', 'Discovery of a large new platinum deposit in Limpopo', 'A civil war that destroys infrastructure'],
      correctIndex: 2, hint: 'An outward shift means the economy can produce MORE than before — what increases productive capacity?',
      explanation: 'Discovering new natural resources (platinum) increases the economy\'s productive capacity — the PPC shifts outward. Drought, emigration of skilled workers, and civil war all reduce productive capacity (inward shift). Economic growth comes from gaining more or better resources, technology improvements, or improved skills.'
    },
    {
      id: 'q4', question: 'An economy produces 200 units of food and 100 units of clothing (Point A on the PPC). It shifts to 150 food and 160 clothing (Point B). What is the opportunity cost of the extra 60 units of clothing?', math: 'Point A: 200 food, 100 clothing → Point B: 150 food, 160 clothing',
      options: ['60 units of clothing', '50 units of food', '200 units of food', 'Zero — no cost if on the PPC'],
      correctIndex: 1, hint: 'The opportunity cost is what was GIVEN UP to get the extra clothing.',
      explanation: 'Moving from A to B: clothing increased by 60 units (100→160), but food decreased by 50 units (200→150). The opportunity cost of the 60 extra clothing units is the 50 units of food that were sacrificed. Resources were shifted from food production to clothing production along the PPC.'
    },
  ],
  remediationQuestions: [
    {
      id: 'r1', question: 'A country experiences a severe drought. What happens to its PPC?', math: '',
      options: ['It shifts outward — more food can now be produced', 'It shifts inward — productive capacity decreases', 'It stays the same — the PPC only shifts with technology changes', 'The PPC becomes a straight line'],
      correctIndex: 1, hint: 'A drought destroys resources — does that increase or decrease what the economy can produce?',
      explanation: 'A severe drought reduces agricultural output and damages land quality — a key productive resource. This reduces the economy\'s productive capacity, causing the PPC to shift INWARD. The economy can now produce less than before. Any event that reduces resources, technology, or skills causes an inward PPC shift.'
    },
    {
      id: 'r2', question: 'If an economy is producing at a point OUTSIDE its PPC, what does this mean?', math: '',
      options: ['The economy is very efficient', 'The combination is currently unattainable with existing resources', 'The economy needs to use fewer resources', 'The point outside the PPC represents a trade-off'],
      correctIndex: 1, hint: 'The PPC boundary shows what is POSSIBLE — outside it is beyond current capacity.',
      explanation: 'A point outside the PPC is UNATTAINABLE with the current level of resources and technology. The economy would need an outward shift of the PPC (through economic growth) to reach that combination. Currently, there are not enough resources to produce that much of both goods simultaneously.'
    },
  ],
  hardQuestions: [
    {
      id: 'h1', question: 'South Africa invests heavily in education and technical training for 10 years. What is the most likely effect on the PPC, and why?', math: '',
      options: ['The PPC shifts inward — education costs money', 'The PPC shifts outward — improved human capital increases productive capacity', 'There is no effect — education does not affect the PPC', 'The PPC becomes a straight line due to better resource substitutability'],
      correctIndex: 1, hint: 'Better educated workers are more productive — what does that do to the economy\'s total output potential?',
      explanation: 'Investment in education and technical training improves HUMAN CAPITAL — the skills, knowledge, and productivity of the workforce. More skilled workers can produce more output with the same physical resources. This increases productive capacity, shifting the PPC OUTWARD. This is why long-term economic growth policy focuses on education and skills development.'
    },
    {
      id: 'h2', question: 'An economy is at Point A (inside the PPC) due to 30% unemployment. If it achieves full employment and moves to the PPC, was there an opportunity cost?', math: '',
      options: ['Yes — to employ more workers, the government must sacrifice other spending', 'No — moving from inside the PPC to the boundary costs nothing; more of both goods becomes possible', 'Yes — more employment always means less production of one good', 'No — points inside the PPC are always preferable to points on it'],
      correctIndex: 1, hint: 'When you are inside the PPC, can you produce more of BOTH goods by using idle resources?',
      explanation: 'Moving from inside the PPC to the boundary itself involves NO OPPORTUNITY COST (in terms of production trade-offs) — because idle resources are being put to work. You gain more production of both goods simultaneously. Opportunity costs only arise when you are ON the PPC and must choose between goods. Getting to the PPC from inside it is an efficiency gain, not a trade-off.'
    },
    {
      id: 'h3', question: 'Country X and Country Y both produce food and technology goods. Country X invests all extra resources in technology R&D; Country Y splits extra resources equally. After 20 years, which country is likely to have a PPC that is more shifted outward in the technology direction?', math: '',
      options: ['Country Y — balanced investment always outperforms specialisation', 'Country X — concentrated investment in technology produces greater technology-sector growth', 'Both countries will have identical PPC shifts', 'Neither — R&D investment never shifts the PPC'],
      correctIndex: 1, hint: 'Think about what concentrated investment does to one sector vs. balanced investment.',
      explanation: 'Country X concentrated all extra resources in technology R&D. This produces a larger asymmetric outward shift in the technology direction — Country X can produce significantly more technology goods. Country Y\'s balanced approach produces a more symmetric (but smaller per sector) shift. Specialisation and concentration of investment typically produce faster growth in the targeted sector, at the cost of relative balance.'
    },
    {
      id: 'h4', question: 'If the government builds new hospitals, how does this affect the PPC in the SHORT TERM vs. the LONG TERM?', math: '',
      options: ['Both short and long term: the PPC shifts outward immediately', 'Short term: the PPC may shift inward (resources diverted from production); Long term: PPC shifts outward (healthier, more productive workforce)', 'Short term: PPC shifts outward; Long term: PPC shifts inward', 'No effect in either time period'],
      correctIndex: 1, hint: 'Building hospitals uses resources NOW — what is the trade-off? But what happens to worker productivity over time?',
      explanation: 'In the SHORT TERM, building hospitals diverts resources (labour, materials) from other production — this may cause an inward shift or movement along the PPC. In the LONG TERM, healthier workers are more productive (better human capital), fewer work days are lost to illness, and child mortality falls. These improvements INCREASE productive capacity, shifting the PPC outward. This is the classic trade-off between current consumption/production and long-term investment in human capital.'
    },
  ],
  enrichment: {
    outcomes: [
      'Define the Production Possibility Curve (PPC) and explain what it shows',
      'Distinguish between a movement along the PPC and a shift of the PPC',
      'Explain what points inside, on, and outside the PPC represent',
      'Identify the factors that cause the PPC to shift outward (economic growth)',
      'Apply the concept of opportunity cost to movements along the PPC',
    ],
    knowledgeChecks: [
      {
        afterStep: 0,
        question: 'A point INSIDE the PPC represents:',
        options: [
          'Maximum productive efficiency — all resources are used',
          'An impossible production combination — beyond current capacity',
          'Productive inefficiency — resources are underused or unemployed',
          'A situation where the country imports what it cannot produce',
        ],
        correctIndex: 2,
        explanation: 'A point inside (below) the PPC shows that the economy is not using all its resources efficiently — some labour is unemployed, some capital is idle. The economy is producing less than it could. Points ON the curve represent full, efficient use of all resources.',
      },
      {
        afterStep: 2,
        question: 'Which of the following would cause the PPC to shift OUTWARD?',
        options: [
          'A severe drought destroying agricultural land',
          'A large number of workers emigrating to other countries',
          'Discovery of new mineral deposits and improved technology',
          'Government reducing the education budget',
        ],
        correctIndex: 2,
        explanation: 'The PPC shifts outward when the economy\'s productive capacity increases. New mineral deposits increase the quantity of land resources; improved technology increases productivity. Both expand what the economy can produce — shifting the entire PPC outward.',
      },
    ],
    examTip: 'Three key PPC points to master: (1) On the curve = efficient, all resources used. (2) Inside the curve = inefficient, unemployed resources. (3) Outside the curve = currently unattainable (only possible after economic growth shifts the curve outward). Opportunity cost = the slope of the PPC.',
    summaryPoints: [
      'The PPC shows all maximum combinations of two goods an economy can produce with available resources',
      'Points ON the curve: productively efficient — all resources fully and optimally used',
      'Points INSIDE the curve: productively inefficient — unemployment or wasted resources',
      'Points OUTSIDE the curve: currently unattainable — beyond the economy\'s capacity',
      'Movement along the PPC: producing more of one good means less of another (opportunity cost)',
      'Outward shift: economic growth from more resources, better technology, or improved human capital',
    ],
  },
}

const SUBJECT = 'Economics'
const GRADE = 10
const TOPIC_ID = 'production-possibility-curve'
const STORAGE_KEY_PREFIX = 'scratchpad_econ-ppc_'





// ── SpeechBubble ──────────────────────────────────────────────────────────────
const SpeechBubble = ({ text, pos }: { text: string; pos: 'top' | 'bottom' }) => (
  <motion.div
    initial={{ scale: 0, opacity: 0, y: pos === 'top' ? 10 : -10 }}
    animate={{ scale: 1, opacity: 1, y: 0 }}
    transition={{ type: 'spring', stiffness: 400, damping: 24 }}
    className={`absolute ${pos === 'top' ? '-top-12' : '-bottom-12'} left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#1C1917] text-white text-xs font-bold px-3 py-2 rounded-xl shadow-lg z-20`}
  >
    {text}
    <div className={`absolute left-1/2 -translate-x-1/2 w-2 h-2 bg-[#1C1917] rotate-45 ${pos === 'top' ? '-bottom-1' : '-top-1'}`} />
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
            <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? 'bg-[#1C1917] w-10' : i < current ? 'bg-[#1C1917] w-8' : 'bg-stone-200 w-6'}`} />
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
            <h3 className="text-lg font-black text-[#1C1917] leading-tight">{step.title}</h3>
            <p className="text-[15px] text-stone-500 leading-relaxed mt-2">{step.content}</p>
          </div>
          <div className="mx-4 mb-4 bg-[#F5F0E8] rounded-xl px-4 pt-4 pb-6">
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
                        className={`px-4 py-2.5 rounded-xl font-mono text-lg font-black transition-all ${isActive ? 'bg-[#1C1917] text-white scale-105 shadow-md' : 'bg-white text-stone-800 border border-stone-200 hover:border-stone-400 hover:bg-stone-50'}`}
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
          className="flex items-center gap-2 px-6 py-2.5 bg-[#1C1917] text-white rounded-xl hover:bg-stone-800 transition-colors font-black text-sm"
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
      <div className="bg-[#1C1917] rounded-2xl p-5">
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
            className={`shrink-0 px-4 py-1.5 rounded-full text-[11px] font-black transition-colors ${i === stepIdx ? 'bg-[#1C1917] text-white' : i < stepIdx ? 'bg-stone-200 text-stone-600 font-bold' : 'bg-stone-100 text-stone-400 font-bold'}`}
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
          <div className="bg-[#F5F0E8] rounded-xl px-5 py-4 border border-stone-200/60">
            <p className="font-mono text-[15px] text-stone-800 font-bold leading-relaxed wrap-break-word">{step.math}</p>
          </div>
          {!revealed ? (
            <button onClick={() => setRevealed(true)} className="w-full py-3 border-2 border-dashed border-stone-200 rounded-xl text-sm font-bold text-stone-400 hover:border-stone-400 hover:text-stone-600 transition-colors">
              Reveal explanation
            </button>
          ) : (
            <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="bg-[#F5F0E8] border border-stone-200/60 rounded-xl p-4">
              <p className="text-[13px] text-stone-700 leading-relaxed">{step.explanation}</p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between items-center">
        <button onClick={() => { setStepIdx(i => i - 1); setRevealed(false) }} disabled={stepIdx === 0} className="flex items-center gap-1.5 text-[13px] font-bold text-stone-400 disabled:opacity-20 hover:text-stone-900 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>
        <button onClick={() => { isLast ? onComplete() : setStepIdx(i => i + 1); setRevealed(false) }} className="flex items-center gap-2 px-6 py-2.5 bg-[#1C1917] text-white rounded-xl hover:bg-stone-800 transition-colors font-black text-sm">
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
    ctx.strokeStyle = tool === 'pen' ? '#1C1917' : '#FAFAF9'
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
        <div className="flex items-center justify-between px-4 py-3 bg-[#1C1917]">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-stone-500 mr-2">Scratchpad</span>
            <button onClick={() => setTool('pen')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${tool === 'pen' ? 'bg-white text-[#1C1917] shadow-sm' : 'text-stone-400 hover:text-white hover:bg-white/10'}`}>
              <PenLine className="w-3.5 h-3.5" /> Pen
            </button>
            <button onClick={() => setTool('eraser')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${tool === 'eraser' ? 'bg-white text-[#1C1917] shadow-sm' : 'text-stone-400 hover:text-white hover:bg-white/10'}`}>
              <Eraser className="w-3.5 h-3.5" /> Eraser
            </button>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={undo} disabled={!history.length} className="p-2 rounded-lg text-stone-500 hover:text-white hover:bg-white/10 disabled:opacity-20 transition-all"><Undo2 className="w-4 h-4" /></button>
            <button onClick={clearAll} className="p-2 rounded-lg text-stone-500 hover:text-red-400 hover:bg-white/10 transition-all"><Trash2 className="w-4 h-4" /></button>
            <div className="w-px h-4 bg-stone-700 mx-1" />
            <button onClick={onClose} className="p-2 rounded-lg text-stone-500 hover:text-white hover:bg-white/10 transition-all"><X className="w-4 h-4" /></button>
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
            style={{ backgroundImage: 'radial-gradient(circle, #1C1917 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
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
              <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i < idx ? 'w-5 bg-[#1C1917]' : i === idx ? 'w-8 bg-[#1C1917]' : 'w-5 bg-stone-200'}`} />
            ))}
          </div>
        </div>
        <button
          onClick={() => setScratchpadKey(`scratchpad_econ-ppc_q-${idx}`)}
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
            <p className="font-black text-[#1C1917] text-[17px] leading-snug">{q.question}</p>
            {q.math && (
              <div className="mt-3 bg-[#F5F0E8] rounded-xl px-5 py-4 border border-stone-200/50">
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
                if (isSelected) { ctr += 'border-[#1C1917] bg-[#1C1917]'; lbl += 'bg-white text-[#1C1917]'; txt += 'text-white font-bold' }
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
                className={`mx-6 mb-5 rounded-xl px-4 py-4 border ${selected === q.correctIndex ? 'bg-emerald-50 border-emerald-200' : 'bg-[#F5F0E8] border-stone-200'}`}>
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
              ? <button onClick={confirm} disabled={selected === null} className="px-5 py-2.5 bg-[#1C1917] text-white rounded-xl disabled:opacity-25 hover:bg-stone-800 font-black text-sm shadow-sm transition-all">
                  Check Answer
                </button>
              : <button onClick={handleNext} className="flex items-center gap-2 px-5 py-2.5 bg-[#1C1917] text-white rounded-xl hover:bg-stone-800 font-black text-sm shadow-sm transition-all">
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
      <div className="bg-[#1C1917] rounded-3xl p-8 flex flex-col items-center">
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
        <button onClick={onContinue} className="w-full flex items-center justify-center gap-2 px-8 py-3.5 bg-[#1C1917] text-white rounded-xl hover:bg-stone-800 font-black text-sm transition-all">
          Continue <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
function ProductionPossibilityCurvePage({ onNavigate }: { onNavigate: (page: any) => void }) {
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
    <div className="min-h-screen" style={{ background: '#F5F0E8' }}>
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
              <h1 className="font-black text-[#1C1917] text-xl" style={{ letterSpacing: '-0.02em' }}>{TOPIC.title}</h1>
              {status === 'mastered' && <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700">Mastered</span>}
              {status === 'needs-practice' && <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700">Needs Practice</span>}
            </div>
            <p className="text-[13px] text-stone-400 mt-0.5">Economics · Grade 10 · Term 1 · Topic 2</p>
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

export default ProductionPossibilityCurvePage
