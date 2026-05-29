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
  id: 'species-concept',
  title: 'The Species Concept',
  description: 'What makes a species and how we define it.',
  interactiveSteps: [
    {
      id: 'step-1', title: 'The Biological Species Concept', content: 'The most widely used definition: a species is a group of organisms that can interbreed and produce fertile offspring under natural conditions. They are reproductively isolated from other species.',
      math: ['Breed', '+', 'Fertile', '=', 'Species'],
      bubbles: [{ target: 'Fertile', text: 'Offspring can reproduce', pos: 'top' as const }, { target: 'Species', text: 'Reproductively isolated', pos: 'bottom' as const }]
    },
    {
      id: 'step-2', title: 'Reproductive Isolation', content: 'Species are kept separate by reproductive isolating mechanisms. These can be pre-zygotic (before fertilisation: different habitats, mating seasons, behaviours) or post-zygotic (after fertilisation: hybrid sterility — like the mule).',
      math: ['Pre-', 'zygotic', '|', 'Post-', 'zygotic'],
      bubbles: [{ target: 'Pre-', text: 'Before fertilisation', pos: 'top' as const }, { target: 'Post-', text: 'After fertilisation', pos: 'bottom' as const }]
    },
    {
      id: 'step-3', title: 'Morphological Species Concept', content: 'An older approach: species are defined by physical appearance (morphology). Useful for fossils and asexual organisms, but two organisms can look identical and yet be different species (cryptic species) — so morphology alone is insufficient.',
      math: ['Look', 'alike', '≠', 'Same', 'species'],
      bubbles: [{ target: '≠', text: 'Not always the same', pos: 'top' as const }, { target: 'species', text: 'Cryptic species exist', pos: 'bottom' as const }]
    },
    {
      id: 'step-4', title: 'Why Defining Species Is Hard', content: 'Ring species, asexual organisms, and hybridisation challenge any single definition. Modern taxonomy combines multiple lines of evidence: morphology, behaviour, DNA, and reproductive compatibility.',
      math: ['DNA', '+', 'Morph', '+', 'Behav'],
      bubbles: [{ target: 'DNA', text: 'Molecular evidence', pos: 'top' as const }, { target: 'Behav', text: 'Behavioural evidence', pos: 'bottom' as const }]
    },
  ],
  guidedItem: {
    problem: 'A horse (Equus caballus) and a donkey (Equus asinus) can mate and produce a mule. Are horses and donkeys the same species? Explain.',
    steps: [
      { id: 1, instruction: 'Apply the biological species concept', math: 'Species = can interbreed AND produce fertile offspring', explanation: 'The key criterion is not just whether they can mate, but whether their offspring are fertile.' },
      { id: 2, instruction: 'Assess the mule', math: 'Mule = sterile (cannot reproduce)', explanation: 'Mules are almost always sterile — they cannot produce offspring. This is a post-zygotic isolating mechanism called hybrid sterility.' },
      { id: 3, instruction: 'Reach a conclusion', math: 'Horses and donkeys are DIFFERENT species — their hybrid offspring are infertile', explanation: 'Despite being able to mate, the sterility of mules means horses and donkeys do not satisfy the biological species concept. They remain Equus caballus and Equus asinus.' },
    ]
  },
  initialQuestions: [
    {
      id: 'q1', question: 'According to the biological species concept, two organisms belong to the same species if they:', math: '',
      options: ['Look identical', 'Live in the same habitat', 'Can interbreed and produce fertile offspring', 'Have the same number of chromosomes'],
      correctIndex: 2, hint: 'The key word in the biological species concept is "fertile".',
      explanation: 'The biological species concept defines a species as organisms that can interbreed naturally and produce fertile offspring. Appearance, habitat, and chromosome number can overlap between different species.'
    },
    {
      id: 'q2', question: 'A mule (horse × donkey hybrid) is sterile. This means:', math: '',
      options: ['Horses and donkeys are the same species', 'Horses and donkeys are different species', 'The mule is a new species', 'Mules cannot be born'],
      correctIndex: 1, hint: 'Fertile offspring = same species. Sterile offspring = different species.',
      explanation: 'Because mules are sterile (infertile), horses and donkeys fail the biological species concept. They are different species: Equus caballus (horse) and Equus asinus (donkey).'
    },
    {
      id: 'q3', question: 'Pre-zygotic isolating mechanisms prevent:', math: '',
      options: ['Hybrid offspring from surviving', 'Fertilisation from occurring in the first place', 'Organisms from living in the same habitat', 'DNA from mutating'],
      correctIndex: 1, hint: 'Pre = before. Zygotic = relating to the zygote (fertilised egg).',
      explanation: 'Pre-zygotic mechanisms prevent fertilisation before it happens. Examples: different mating seasons, different habitats, different mating calls. Post-zygotic mechanisms act after fertilisation (e.g. hybrid sterility).'
    },
    {
      id: 'q4', question: 'Why is the morphological species concept alone insufficient?', math: '',
      options: ['Not all organisms have a visible morphology', 'Two different species can look identical (cryptic species)', 'Morphology changes too quickly', 'Scientists disagree about what morphology means'],
      correctIndex: 1, hint: 'Some species look exactly alike but cannot interbreed.',
      explanation: 'Cryptic species are organisms that look identical but are reproductively isolated from each other. Using appearance alone would incorrectly classify them as one species. DNA and reproductive tests reveal the true relationship.'
    },
  ],
  remediationQuestions: [
    {
      id: 'r1', question: 'Two populations of birds live on different islands and have different mating calls. When brought together, they do not mate. This is an example of:', math: '',
      options: ['Post-zygotic isolation', 'Pre-zygotic isolation', 'Convergent evolution', 'Hybridisation'],
      correctIndex: 1, hint: 'The isolation happens before mating even occurs.',
      explanation: 'Different mating calls prevent fertilisation from occurring — this is a pre-zygotic (behavioural) isolating mechanism. Post-zygotic isolation would only apply if they did mate and their offspring were infertile or unhealthy.'
    },
    {
      id: 'r2', question: 'The biological species concept is difficult to apply to bacteria because:', math: '',
      options: ['Bacteria are too small to classify', 'Bacteria reproduce asexually — they do not interbreed', 'Bacteria all look the same', 'Bacteria have no DNA'],
      correctIndex: 1, hint: 'The biological species concept depends on interbreeding. What do bacteria not do?',
      explanation: 'The biological species concept requires interbreeding. Bacteria reproduce asexually — they do not mate and exchange genes in the same way. Other species concepts (morphological, phylogenetic) must be used for them.'
    },
  ],
  hardQuestions: [
    {
      id: 'h1', question: 'Ring species are a challenge to the biological species concept because:', math: '',
      options: ['They form perfect circles in nature', 'Adjacent populations can interbreed, but the two end populations of the ring cannot', 'They reproduce only asexually', 'They have no DNA'],
      correctIndex: 1, hint: 'Imagine a chain of populations — each can mate with its neighbour, but the two ends cannot mate with each other.',
      explanation: 'In a ring species, gene flow exists between adjacent populations, but when the "ring" closes, the two end populations cannot interbreed. This challenges the species concept because it is impossible to say exactly where one species ends and another begins.'
    },
    {
      id: 'h2', question: 'Modern taxonomy combines multiple lines of evidence. Which combination is MOST reliable for defining a species?', math: '',
      options: ['Morphology alone', 'Behaviour alone', 'Morphology + DNA + reproductive compatibility', 'Habitat + colour + size'],
      correctIndex: 2, hint: 'No single line of evidence is always sufficient.',
      explanation: 'Using morphology, molecular (DNA) analysis, and reproductive compatibility together provides the strongest evidence for species delimitation. Each method can fail alone — combined, they provide convergent support for the classification.'
    },
    {
      id: 'h3', question: 'Two populations of the same species become separated by a mountain range for thousands of years. Which outcome is most likely over time?', math: '',
      options: ['They will become genetically identical', 'They may diverge enough to become separate species due to independent evolution', 'They will merge back into one population', 'They will both go extinct'],
      correctIndex: 1, hint: 'Geographic separation = different selection pressures = different evolution.',
      explanation: 'Geographic isolation is a key driver of speciation. With no gene flow, the two populations evolve independently under different selective pressures. Over time, genetic differences may accumulate until they can no longer interbreed — making them separate species. This is called allopatric speciation.'
    },
    {
      id: 'h4', question: 'Lions (Panthera leo) and tigers (Panthera tigris) can produce ligers in captivity. These are usually sterile. Does this make lions and tigers the same species?', math: '',
      options: ['Yes, because they can mate', 'No, because the hybrid is sterile and they do not mate in nature', 'Yes, because they share the genus Panthera', 'No, because they live on different continents'],
      correctIndex: 1, hint: 'Two conditions are required: natural interbreeding AND fertile offspring.',
      explanation: 'Lions and tigers do not naturally overlap in habitat and would not interbreed under natural conditions. Even in captivity, their hybrid (liger) is sterile. Both pre-zygotic (geographic) and post-zygotic (hybrid sterility) barriers exist. They are definitively different species.'
    },
  ]
}

const SpeechBubble = ({ text, pos }: { text: string; pos: 'top' | 'bottom' }) => (
  <motion.div initial={{ scale: 0, opacity: 0, y: pos === 'top' ? 10 : -10 }} animate={{ scale: 1, opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
    className={`absolute ${pos === 'top' ? '-top-14' : '-bottom-14'} left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-600 text-white text-xs font-black px-3 py-1.5 rounded-xl shadow-lg z-20`}>
    {text}<div className={`absolute left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-600 rotate-45 ${pos === 'top' ? '-bottom-1' : '-top-1'}`} />
  </motion.div>
)
const InteractiveLesson = ({ onComplete }: { onComplete: () => void }) => {
  const [current, setCurrent] = useState(0); const step = TOPIC.interactiveSteps[current]; const isLast = current === TOPIC.interactiveSteps.length - 1
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">Slide {current + 1} of {TOPIC.interactiveSteps.length}</p>
        <div className="flex gap-1">{TOPIC.interactiveSteps.map((_, i) => <div key={i} className={`h-1 w-8 rounded-full transition-all ${i <= current ? 'bg-slate-600' : 'bg-slate-200'}`} />)}</div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={current} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}
          className="bg-white border border-slate-200 rounded-[2.5rem] p-4 md:p-6 shadow-sm min-h-0 flex flex-col justify-center gap-4">
          <div className="text-center space-y-2">
            <h2 className="text-base font-bold text-slate-900 tracking-tight">{step.title}</h2>
            <p className="text-slate-500 text-base leading-relaxed max-w-lg mx-auto">{step.content}</p>
          </div>
          <div className="py-8 -mx-2 px-2">
            <div className="flex flex-wrap items-center justify-center gap-2 relative mx-auto">
              {step.math.map((char, i) => {
                const bubble = step.bubbles.find(b => b.target === char)
              })}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      <button onClick={() => isLast ? onComplete() : setCurrent(c => c + 1)} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl transition-all active:scale-[0.98]">{isLast ? 'Continue' : 'Next Tip'} <ArrowRight size={18} /></button>
    </div>
  )
}
const GuidedPracticeModule = ({ onComplete }: { onComplete: () => void }) => {
  const [stepIndex, setStepIndex] = useState(0); const { steps, problem } = TOPIC.guidedItem; const isLast = stepIndex === steps.length - 1
  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-[2.5rem] p-4 md:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Step-by-Step Guide</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Step {stepIndex + 1} of {steps.length}</p>
        </div>
        <h2 className="text-base font-bold text-slate-900 mb-8 text-center tracking-tight">{problem}</h2>
        <div className="flex gap-1.5 mb-8">{steps.map((_, i) => <div key={i} className={`flex-1 h-1 rounded-full transition-all ${i <= stepIndex ? 'bg-slate-600' : 'bg-slate-100'}`} />)}</div>
        <div className="space-y-3 mb-8">
          {steps.slice(0, stepIndex + 1).map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }} className={`flex gap-5 p-4 rounded-2xl border ${i === stepIndex ? 'bg-slate-50 border-slate-200' : 'bg-slate-50 border-slate-100'}`}>
              <div className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black ${i === stepIndex ? 'bg-slate-600 text-white' : 'bg-white border border-slate-200 text-slate-400'}`}>{i + 1}</div>
              <div className="min-w-0">
                <p className="text-base font-black text-slate-900">{s.instruction}</p>
                <p className="text-slate-500 text-xs mt-0.5 mb-3 leading-relaxed">{s.explanation}</p>
                <div className="overflow-x-auto -mx-1 px-1"><div className="inline-block whitespace-nowrap px-4 py-2 bg-white border border-slate-200 rounded-xl text-lg font-mono font-black text-slate-600 shadow-sm">{s.math}</div></div>
              </div>
            </motion.div>
          ))}
        </div>
        <button onClick={() => isLast ? onComplete() : setStepIndex(s => s + 1)} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl transition-all active:scale-[0.98]">{isLast ? 'Now You Try' : 'Show Next Step'} <ArrowRight size={18} /></button>
      </div>
    </div>
  )
}
const STORAGE_KEY_PREFIX = 'scratchpad_species_'
const ScratchpadModal = ({ question, math, storageKey, onClose }: { question: string; math?: string; storageKey: string; onClose: () => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null); const [tool, setTool] = useState<'pen' | 'eraser'>('pen')
  const [history, setHistory] = useState<ImageData[]>([]); const drawing = useRef(false); const lastPos = useRef<{ x: number; y: number } | null>(null)
  const getCtx = () => canvasRef.current?.getContext('2d') ?? null
  const saveSnapshot = useCallback(() => { const ctx = getCtx(); const c = canvasRef.current; if (!ctx || !c) return; setHistory(h => [...h.slice(-29), ctx.getImageData(0, 0, c.width, c.height)]); localStorage.setItem(storageKey, c.toDataURL()) }, [storageKey])
  useEffect(() => { const c = canvasRef.current; if (!c) return; const dpr = window.devicePixelRatio || 1; const rect = c.getBoundingClientRect(); c.width = rect.width * dpr; c.height = rect.height * dpr; const ctx = c.getContext('2d')!; ctx.scale(dpr, dpr); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; const saved = localStorage.getItem(storageKey); if (saved) { const img = new Image(); img.onload = () => ctx.drawImage(img, 0, 0, rect.width, rect.height); img.src = saved } }, [storageKey])
  const getPos = (e: React.PointerEvent) => { const c = canvasRef.current!; const rect = c.getBoundingClientRect(); return { x: e.clientX - rect.left, y: e.clientY - rect.top } }
  const onPointerDown = (e: React.PointerEvent) => { e.currentTarget.setPointerCapture(e.pointerId); drawing.current = true; lastPos.current = getPos(e); const ctx = getCtx()!; ctx.beginPath(); ctx.moveTo(lastPos.current.x, lastPos.current.y) }
  const onPointerMove = (e: React.PointerEvent) => { if (!drawing.current) return; const pos = getPos(e); const ctx = getCtx()!; ctx.lineWidth = tool === 'pen' ? 3 : 24; ctx.strokeStyle = tool === 'pen' ? '#1e293b' : '#f8fafc'; ctx.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over'; ctx.lineTo(pos.x, pos.y); ctx.stroke(); ctx.beginPath(); ctx.moveTo(pos.x, pos.y); lastPos.current = pos }
  const onPointerUp = () => { if (!drawing.current) return; drawing.current = false; lastPos.current = null; saveSnapshot() }
  const undo = () => { const c = canvasRef.current; const ctx = getCtx(); if (!ctx || !c) return; setHistory(h => { const next = h.slice(0, -1); ctx.clearRect(0, 0, c.width, c.height); if (next.length > 0) ctx.putImageData(next[next.length - 1], 0, 0); localStorage.setItem(storageKey, c.toDataURL()); return next }) }
  const clearAll = () => { const c = canvasRef.current; const ctx = getCtx(); if (!ctx || !c) return; ctx.clearRect(0, 0, c.width, c.height); setHistory([]); localStorage.removeItem(storageKey) }
  return (
    <AnimatePresence><motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <motion.div initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} className="w-full sm:max-w-lg bg-white rounded-t-2xl sm:rounded-2xl shadow-lg flex flex-col overflow-hidden" style={{ maxHeight: '90dvh' }}>
        <div className="px-5 pt-5 pb-3 border-b border-slate-100 shrink-0"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-1">Working Space</p><p className="text-sm font-black text-slate-900 leading-snug">{question}</p>{math && <div className="overflow-x-auto mt-1 -mx-1 px-1"><span className="whitespace-nowrap font-mono text-sm font-black text-slate-700">{math}</span></div>}</div><button onClick={onClose} aria-label="Close" className="shrink-0 w-11 h-11 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 transition-colors"><X size={16} /></button></div></div>
        <div className="flex items-center gap-2 px-5 py-2.5 border-b border-slate-100 shrink-0 bg-slate-50/60">
          <button onClick={() => setTool('pen')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition-all ${tool === 'pen' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'}`}><PenLine size={13} /> Pen</button>
          <button onClick={() => setTool('eraser')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition-all ${tool === 'eraser' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'}`}><Eraser size={13} /> Eraser</button>
          <div className="flex-1" /><button onClick={undo} disabled={history.length === 0} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black text-slate-500 hover:bg-slate-100 disabled:opacity-30 transition-all"><Undo2 size={13} /> Undo</button>
          <button onClick={clearAll} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black text-slate-500 hover:bg-slate-50 transition-all"><Trash2 size={13} /> Clear</button>
        </div>
        <div className="relative flex-1 min-h-0 bg-slate-50" style={{ touchAction: 'none' }}><canvas ref={canvasRef} className="w-full h-full block" style={{ cursor: tool === 'eraser' ? 'cell' : 'crosshair', touchAction: 'none' }} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerLeave={onPointerUp} />{history.length === 0 && <div className="absolute inset-0 flex items-center justify-center pointer-events-none"><p className="text-xs text-slate-300 font-semibold select-none">Draw your working here…</p></div>}</div>
        <div className="px-5 py-3 border-t border-slate-100 shrink-0"><button onClick={onClose} className="w-full py-3.5 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-[0.98]">Done</button></div>
      </motion.div>
    </motion.div></AnimatePresence>
  )
}
const PracticeModule = ({ questions, onComplete }: { questions: Question[]; onComplete: (res: { correct: number; total: number }) => void }) => {
  const [current, setCurrent] = useState(0); const [selected, setSelected] = useState<number | null>(null); const [revealed, setRevealed] = useState(false)
  const [hintVisible, setHintVisible] = useState(false); const [correctCount, setCorrectCount] = useState(0); const [scratchpadOpen, setScratchpadOpen] = useState(false)
  const q = questions[current]; const isLast = current === questions.length - 1
  const handleSelect = (i: number) => { if (revealed) return; setSelected(i); setRevealed(true); if (i === q.correctIndex) setCorrectCount(c => c + 1) }
  const handleNext = () => { if (isLast) onComplete({ correct: correctCount, total: questions.length }); else { setCurrent(c => c + 1); setSelected(null); setRevealed(false); setHintVisible(false) } }
  const getOptionStyle = (i: number) => { if (!revealed) return selected === i ? 'border-slate-500 bg-slate-50' : 'border-slate-200 bg-white hover:border-slate-200 hover:bg-slate-50 cursor-pointer'; if (i === q.correctIndex) return 'border-slate-500 bg-slate-50 text-slate-900'; if (i === selected) return 'border-slate-500 bg-slate-50 text-slate-900'; return 'border-slate-100 bg-white text-slate-300' }
  return (
    <>{scratchpadOpen && <ScratchpadModal question={q.question} math={q.math} storageKey={`${STORAGE_KEY_PREFIX}${current}`} onClose={() => setScratchpadOpen(false)} />}
      <div className="space-y-3"><div className="bg-white border border-slate-200 rounded-[2.5rem] p-4 md:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6"><p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Question {current + 1} of {questions.length}</p><div className="flex gap-1">{questions.map((_, i) => <div key={i} className={`w-8 h-1 rounded-full transition-all ${i <= current ? 'bg-slate-600' : 'bg-slate-100'}`} />)}</div></div>
        <div className="flex items-start justify-between gap-3 mb-4"><p className="text-sm font-semibold text-slate-900 leading-snug">{q.question}</p><button onClick={() => setScratchpadOpen(true)} className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-xs font-black text-slate-500 hover:bg-slate-50 hover:border-slate-300 transition-all"><NotebookPen size={13} /> Scratch</button></div>
        {q.math && <div className="overflow-x-auto mb-8 -mx-2 px-2"><div className="whitespace-nowrap inline-block bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 font-mono text-lg font-black text-slate-700 min-w-0">{q.math}</div></div>}
        <div className="space-y-3">{q.options.map((opt, i) => (<motion.button key={i} whileTap={{ scale: revealed ? 1 : 0.98 }} onClick={() => handleSelect(i)} className={`w-full text-left px-3 py-2 rounded-2xl border-2 text-xs font-semibold transition-all ${getOptionStyle(i)}`}><span className="mr-3 font-black opacity-40">{String.fromCharCode(65 + i)}</span>{opt}</motion.button>))}</div>
        {revealed && <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`mt-6 p-3 rounded-2xl flex gap-4 text-xs font-semibold ${selected === q.correctIndex ? 'bg-slate-50 text-slate-800' : 'bg-slate-50 text-slate-800'}`}><Info size={20} className="shrink-0 mt-0.5" /> {q.explanation}</motion.div>}
        {hintVisible && !revealed && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-5 p-3 bg-slate-50 border border-slate-200 rounded-2xl flex gap-3 text-slate-900"><Lightbulb size={20} className="shrink-0 text-slate-500 mt-0.5" /><p className="text-xs font-semibold">{q.hint}</p></motion.div>}
        <div className="mt-8 flex justify-between items-center">
          {!revealed ? <button onClick={() => setHintVisible(true)} className="text-xs font-black text-slate-600 uppercase tracking-widest px-3 py-2 hover:bg-slate-50 rounded-xl transition-all">{hintVisible ? 'Hint Visible' : 'Need a Hint?'}</button> : <div />}
          {revealed && <button onClick={handleNext} className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-3 shadow-xl transition-all active:scale-[0.98]">{isLast ? 'See Results' : 'Next Question'} <ArrowRight size={18} /></button>}
        </div>
      </div></div>
    </>
  )
}
const FeedbackModule = ({ correct, total, onRetry, onPracticeMore, onContinue, hidePracticeMore = false }: { correct: number; total: number; onRetry: () => void; onPracticeMore: () => void; onContinue: () => void; hidePracticeMore?: boolean }) => {
  const pct = Math.round((correct / total) * 100); const mastered = correct / total >= 2 / 3
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[2.5rem] border border-slate-200 p-4 text-center space-y-6 shadow-sm">
      <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto text-white shadow-xl ${mastered ? 'bg-slate-500' : 'bg-slate-900'}`}>{mastered ? <Award size={40} /> : <RotateCcw size={40} />}</div>
      <div><p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${mastered ? 'text-slate-600' : 'text-slate-400'}`}>{mastered ? '✦ Mastered' : 'Keep Practising'}</p><h2 className="text-xl font-bold text-slate-900 tracking-tighter">Your Results</h2><p className="text-sm text-slate-400 font-semibold mt-1">{TOPIC.title}</p></div>
      <div className="flex flex-col items-center gap-3"><p className="text-3xl font-bold text-slate-900">{correct} <span className="text-slate-300 text-xl">/</span> {total}</p><div className="w-full max-w-xs h-2 bg-slate-100 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, delay: 0.3 }} className={`h-full rounded-full ${mastered ? 'bg-slate-500' : 'bg-slate-500'}`} /></div></div>
      <div className="flex flex-col gap-3 pt-2">
        <div className={`grid grid-cols-1 ${hidePracticeMore ? '' : 'sm:grid-cols-2'} gap-3`}><button onClick={onRetry} className="w-full py-5 bg-slate-100 text-slate-700 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-200 transition-all">Try Again</button>{!hidePracticeMore && <button onClick={onPracticeMore} className="w-full py-5 bg-slate-50 text-slate-700 border border-slate-200 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center justify-center gap-3">Practice More <NotebookPen size={18} /></button>}</div>
        <button onClick={onContinue} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-xl">Continue <ArrowRight size={18} /></button>
      </div>
    </motion.div>
  )
}

const SUBJECT = 'Life Sciences'; const GRADE = 10; const TOPIC_ID = 'species-concept'
async function loadTopicProgress(studentId: number): Promise<TopicStatus> {
  const m = await _loadProgress(studentId, SUBJECT, GRADE, TOPIC_ID)
  if (m === 'mastered') return 'mastered'
  if (m === 'needs_practice') return 'needs-practice'
  return 'not-started'
}


async function saveTopicProgress(studentId: number, schoolId: number, status: TopicStatus, correct: number, total: number, attempts: number) {
  const ml = status === 'mastered' ? 'mastered' : status === 'needs-practice' ? 'needs_practice' : 'not_started'
  await _saveProgress(studentId, schoolId, SUBJECT, GRADE, TOPIC_ID, ml, correct, total, attempts)
}



function SpeciesConceptPage({ onNavigate }: { onNavigate: (page: any) => void }) {
  const session = useStudySession()
  const [view, setView] = useState<ViewState>('overview'); const [previousView, setPreviousView] = useState<ViewState | null>(null)
  const [status, setStatus] = useState<TopicStatus>('not-started'); const [practiceResult, setPracticeResult] = useState<{ correct: number; total: number } | null>(null); const [attempts, setAttempts] = useState(0)
  useEffect(() => { if (!session) return; loadTopicProgress(session?.student_id ?? 0).then(s => setStatus(s)) }, [session])
  const saveProgress = async (newStatus: TopicStatus, res: { correct: number; total: number }) => { const n = attempts + 1; setAttempts(n); if (session) await saveTopicProgress(session.student_id, session.school_id, newStatus, res.correct, res.total, n) }
  const handlePracticeComplete = async (res: { correct: number; total: number }) => {
    setPracticeResult(res); setPreviousView('practice')
    if (res.correct === 0) { setView('remediation') } else { const s: TopicStatus = res.correct / res.total >= 2 / 3 ? 'mastered' : 'needs-practice'; setStatus(s); await saveProgress(s, res); setView('feedback') }
  }
  const handleRemediationComplete = async (res: { correct: number; total: number }) => { setPracticeResult(res); setPreviousView('remediation'); const s: TopicStatus = res.correct / res.total >= 2 / 3 ? 'mastered' : 'needs-practice'; setStatus(s); await saveProgress(s, res); setView('feedback') }
  const handlePracticeMoreComplete = async (res: { correct: number; total: number }) => { setPracticeResult(res); setPreviousView('practice-more'); const s: TopicStatus = res.correct / res.total >= 2 / 3 ? 'mastered' : 'needs-practice'; setStatus(s); await saveProgress(s, res); setView('feedback') }

  return (
    <div className="min-h-screen selection:bg-slate-100" style={{ background: 'oklch(98.5% 0.005 80)' }}>
      <main className="pt-28 pb-24 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          {view === 'overview' ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Life Sciences · Grade 10 · Term 1</p>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">Topics</h1>
              </div>
              <div className="space-y-4">
                <motion.div onClick={() => setView('interactive-lesson')} className="bg-white rounded-xl border border-slate-200 p-4 flex items-center justify-between gap-6 cursor-pointer hover:border-slate-300 hover:shadow-md transition-all group">
                  <div className="flex items-center gap-6">
                    <div className={`shrink-0 w-10 h-10 rounded-[1.25rem] flex items-center justify-center text-sm font-bold ${status === 'mastered' ? 'bg-slate-500 text-white' : 'bg-slate-900 text-white shadow-md shadow-slate-900/10'}`}>{status === 'mastered' ? '✓' : '4'}</div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 tracking-tight">{TOPIC.title}</p>
                      <p className="text-sm text-slate-400 mt-1">{TOPIC.description}</p>
                      <p className={`text-[10px] font-black uppercase tracking-widest mt-2 ${status === 'mastered' ? 'text-slate-600' : status === 'needs-practice' ? 'text-slate-600' : 'text-slate-300'}`}>{status === 'mastered' ? '✦ Mastered' : status === 'needs-practice' ? '◉ Needs Practice' : '○ Not Started'}</p>
                    </div>
                  </div>
                  <ChevronRight size={28} className="text-slate-200 group-hover:text-slate-900 transition-colors shrink-0" />
                </motion.div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <div className="shrink-0 w-10 h-10 rounded-[1.25rem] flex items-center justify-center text-sm font-bold bg-slate-200 text-slate-400">✓</div>
                    <div>
                      <p className="text-sm font-semibold text-slate-400 tracking-tight">All Term 1 Topics Complete</p>
                      <p className="text-sm text-slate-300 mt-1">You have reached the end of Life Sciences Term 1.</p>
                    </div>
                  </div>
                  <button onClick={() => { sessionStorage.setItem('library_return', JSON.stringify({ subjectId: 'life-sci', grade: 10, term: 1 })); onNavigate('library'); }} className="shrink-0 px-5 py-3 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest">Back to Library</button>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center justify-between mb-10">
                <button onClick={() => setView('overview')} className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all"><ChevronLeft size={18} /> Back</button>
                <div className="px-4 py-2 bg-white border border-slate-200 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest">Life Sciences · Grade 10</div>
              </div>
              <AnimatePresence mode="wait">
                <motion.div key={view} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                  {view === 'interactive-lesson' && <InteractiveLesson onComplete={() => setView('guided-practice')} />}
                  {view === 'guided-practice' && <GuidedPracticeModule onComplete={() => setView('practice')} />}
                  {view === 'practice' && <PracticeModule questions={TOPIC.initialQuestions} onComplete={handlePracticeComplete} />}
                  {view === 'practice-more' && <PracticeModule questions={TOPIC.hardQuestions} onComplete={handlePracticeMoreComplete} />}
                  {view === 'remediation' && (
                    <div className="space-y-6">
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex gap-5 items-start"><AlertCircle className="text-slate-500 shrink-0 mt-0.5" size={24} /><div><p className="text-base font-black text-slate-900 uppercase tracking-tight mb-1">Let's Try Again</p><p className="text-slate-700 text-xs leading-relaxed">It's okay — let's work through two extra questions to build your confidence.</p></div></div>
                      <PracticeModule questions={TOPIC.remediationQuestions} onComplete={handleRemediationComplete} />
                    </div>
                  )}
                  {view === 'feedback' && <FeedbackModule correct={practiceResult?.correct ?? 0} total={practiceResult?.total ?? (previousView === 'practice-more' ? TOPIC.hardQuestions.length : TOPIC.initialQuestions.length)} onRetry={() => setView('interactive-lesson')} onPracticeMore={() => setView('practice-more')} onContinue={() => setView('overview')} hidePracticeMore={previousView === 'practice-more'} />}
                </motion.div>
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default SpeciesConceptPage
