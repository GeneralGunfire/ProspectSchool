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
}

const SUBJECT = 'Economics'
const GRADE = 10
const TOPIC_ID = 'production-possibility-curve'
const NEXT_TOPIC_ID = 'economic-systems'
const STORAGE_KEY_PREFIX = 'scratchpad_econ-ppc_'

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
  const [step, setStep] = useState(0); const [activeBubble, setActiveBubble] = useState<string | null>(null); const current = TOPIC.interactiveSteps[step]
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
          : <button onClick={onComplete} className="flex items-center gap-2 px-5 py-2.5 bg-slate-600 text-white rounded-xl hover:bg-slate-700 transition-colors font-medium">Try a Worked Example <ArrowRight className="w-4 h-4" /></button>}
      </div>
    </div>
  )
}

function ScratchpadModal({ stepKey, onClose }: { stepKey: string; onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null); const [isDrawing, setIsDrawing] = useState(false); const [tool, setTool] = useState<'pen' | 'eraser'>('pen'); const [history, setHistory] = useState<ImageData[]>([]); const lastPos = useRef<{ x: number; y: number } | null>(null); const storageKey = STORAGE_KEY_PREFIX + stepKey
  useEffect(() => { const canvas = canvasRef.current; if (!canvas) return; const ctx = canvas.getContext('2d'); if (!ctx) return; canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, canvas.width, canvas.height); const saved = localStorage.getItem(storageKey); if (saved) { const img = new Image(); img.onload = () => ctx.drawImage(img, 0, 0); img.src = saved } }, [storageKey])
  const getPos = (e: React.PointerEvent) => { const r = canvasRef.current!.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top } }
  const saveHistory = useCallback(() => { const canvas = canvasRef.current; const ctx = canvas?.getContext('2d'); if (!canvas || !ctx) return; setHistory(h => [...h.slice(-29), ctx.getImageData(0, 0, canvas.width, canvas.height)]) }, [])
  const onPointerDown = (e: React.PointerEvent) => { saveHistory(); setIsDrawing(true); lastPos.current = getPos(e); canvasRef.current?.setPointerCapture(e.pointerId) }
  const onPointerMove = (e: React.PointerEvent) => { if (!isDrawing || !lastPos.current) return; const canvas = canvasRef.current; const ctx = canvas?.getContext('2d'); if (!canvas || !ctx) return; const pos = getPos(e); ctx.beginPath(); ctx.moveTo(lastPos.current.x, lastPos.current.y); ctx.lineTo(pos.x, pos.y); ctx.strokeStyle = tool === 'pen' ? '#1e293b' : '#ffffff'; ctx.lineWidth = tool === 'pen' ? 2 : 18; ctx.lineCap = 'round'; ctx.stroke(); lastPos.current = pos }
  const onPointerUp = () => { setIsDrawing(false); lastPos.current = null; const canvas = canvasRef.current; if (canvas) localStorage.setItem(storageKey, canvas.toDataURL()) }
  const undo = () => { if (!history.length) return; const canvas = canvasRef.current; const ctx = canvas?.getContext('2d'); if (!canvas || !ctx) return; ctx.putImageData(history[history.length - 1], 0, 0); setHistory(h => h.slice(0, -1)); localStorage.setItem(storageKey, canvas.toDataURL()) }
  const clear = () => { const canvas = canvasRef.current; const ctx = canvas?.getContext('2d'); if (!canvas || !ctx) return; saveHistory(); ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, canvas.width, canvas.height); localStorage.removeItem(storageKey) }
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
  const [stepIdx, setStepIdx] = useState(0); const [revealed, setRevealed] = useState(false); const [scratchpadStep, setScratchpadStep] = useState<string | null>(null); const step = TOPIC.guidedItem.steps[stepIdx]
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {scratchpadStep && <ScratchpadModal stepKey={scratchpadStep} onClose={() => setScratchpadStep(null)} />}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4"><div className="flex items-start gap-3"><Lightbulb className="w-5 h-5 text-slate-600 mt-0.5 shrink-0" /><div><p className="font-medium text-slate-900 text-sm mb-1">Worked Example</p><p className="text-slate-800 text-xs leading-relaxed">{TOPIC.guidedItem.problem}</p></div></div></div>
      <div className="flex gap-2 overflow-x-auto pb-1">{TOPIC.guidedItem.steps.map((s, i) => <button key={s.id} onClick={() => { setStepIdx(i); setRevealed(false) }} className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${i === stepIdx ? 'bg-slate-900 text-white' : i < stepIdx ? 'bg-slate-100 text-slate-700' : 'bg-slate-100 text-slate-500'}`}>Step {s.id}</button>)}</div>
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
  const [idx, setIdx] = useState(0); const [selected, setSelected] = useState<number | null>(null); const [confirmed, setConfirmed] = useState(false); const [score, setScore] = useState(0); const [scratchpadQ, setScratchpadQ] = useState<string | null>(null); const q = questions[idx]
  const confirm = () => { if (selected === null) return; setConfirmed(true); if (selected === q.correctIndex) setScore(s => s + 1) }
  const next = () => { if (idx < questions.length - 1) { setIdx(i => i + 1); setSelected(null); setConfirmed(false) } else onComplete(score + (selected === q.correctIndex ? 1 : 0)) }
  return (
    <div className="max-w-2xl mx-auto space-y-3">
      {scratchpadQ && <ScratchpadModal stepKey={scratchpadQ} onClose={() => setScratchpadQ(null)} />}
      <div className="flex items-center justify-between"><span className="text-sm text-slate-500">Question {idx + 1} of {questions.length}</span><button onClick={() => setScratchpadQ(`q-${q.id}`)} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-700 transition-colors border border-slate-200 rounded-lg px-2 py-1"><NotebookPen className="w-3.5 h-3.5" /> Scratchpad</button></div>
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

function ProductionPossibilityCurvePage({ onNavigate }: { onNavigate: (page: any) => void }) {
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
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold shrink-0 ${thisStatus === 'mastered' ? 'bg-slate-500 text-white' : 'bg-slate-900 text-white'}`}>{thisStatus === 'mastered' ? '✓' : '2'}</div>
                  <div><p className="font-semibold text-slate-900">{TOPIC.title}</p><p className="text-sm text-slate-500 mt-0.5">{TOPIC.description}</p><div className="mt-2">{statusLabel(thisStatus)}</div></div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-600 transition-colors shrink-0" />
              </button>
              <button onClick={() => onNavigate('learning-economics-g10-t1-systems' as AppPage)} className="w-full bg-white rounded-2xl border border-slate-200 p-4 flex items-center justify-between hover:border-slate-300 hover:shadow-md transition-all group text-left">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold shrink-0 ${nextStatus === 'mastered' ? 'bg-slate-500 text-white' : 'bg-slate-900 text-white'}`}>{nextStatus === 'mastered' ? '✓' : '3'}</div>
                  <div><p className="font-semibold text-slate-900">Economic Systems</p><p className="text-sm text-slate-500 mt-0.5">Market, command, and mixed economic systems compared.</p><div className="mt-2">{statusLabel(nextStatus)}</div></div>
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
              {view === 'feedback' && <motion.div key="feedback" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><FeedbackModule score={practiceScore} total={TOPIC.initialQuestions.length} onRetry={() => setView('practice')} onContinue={() => onNavigate('learning-economics-g10-t1-systems' as AppPage)} nextTopicName="Economic Systems" /><div className="mt-6 text-center"><button onClick={() => setView('practice-more')} className="text-sm text-slate-600 hover:text-slate-800 transition-colors underline underline-offset-2">Want harder questions? Try Practice More</button></div></motion.div>}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  )
}

export default ProductionPossibilityCurvePage
