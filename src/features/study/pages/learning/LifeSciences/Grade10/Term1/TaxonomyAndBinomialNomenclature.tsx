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
  id: 'taxonomy-and-binomial-nomenclature',
  title: 'Taxonomy & Binomial Nomenclature',
  description: 'Scientific naming and the rules of taxonomy.',
  interactiveSteps: [
    {
      id: 'step-1', title: 'What Is Taxonomy?', content: 'Taxonomy is the science of describing, naming, and classifying organisms. Carl Linnaeus (1707–1778) developed the modern system we still use today. He introduced standardised Latin names for all living things.',
      math: ['Describe', '→', 'Name', '→', 'Classify'],
      bubbles: [{ target: 'Name', text: 'Linnaeus — Latin names', pos: 'top' as const }, { target: 'Classify', text: 'Into groups', pos: 'bottom' as const }]
    },
    {
      id: 'step-2', title: 'Binomial Nomenclature Rules', content: 'Every species gets a two-part name: Genus + species epithet. The genus starts with a capital letter; the species epithet is lowercase. The full name is italicised (or underlined in handwriting).',
      math: ['Panthera', 'leo'],
      bubbles: [{ target: 'Panthera', text: 'Genus — capital P', pos: 'top' as const }, { target: 'leo', text: 'Species — lowercase', pos: 'bottom' as const }]
    },
    {
      id: 'step-3', title: 'Why Latin?', content: 'Latin names are universal — scientists worldwide use the same name regardless of their language. This eliminates confusion from multiple common names. For example, a "porcupine" in English is also called "ystervark" in Afrikaans, but both refer to Hystrix africaeaustralis.',
      math: ['1', 'species', '=', '1', 'name'],
      bubbles: [{ target: '1', text: 'Universal', pos: 'top' as const }, { target: 'name', text: 'Latin — globally agreed', pos: 'bottom' as const }]
    },
    {
      id: 'step-4', title: 'Voucher Specimens', content: 'When a new species is described, a voucher specimen (a preserved sample) is deposited in a museum or herbarium. This physical reference confirms the identity and allows other scientists to verify the classification.',
      math: ['New', 'species', '→', 'Voucher', '→', 'Museum'],
      bubbles: [{ target: 'Voucher', text: 'Preserved reference', pos: 'top' as const }, { target: 'Museum', text: 'Permanent record', pos: 'bottom' as const }]
    },
  ],
  guidedItem: {
    problem: 'Write the binomial name for the African elephant correctly. Genus: Loxodonta, species: africana.',
    steps: [
      { id: 1, instruction: 'Format the genus name', math: 'Loxodonta (capital L — genus always capitalised)', explanation: 'The genus is the first word and always begins with a capital letter. It is a Latin or Latinised word.' },
      { id: 2, instruction: 'Format the species epithet', math: 'africana (all lowercase — species epithet)', explanation: 'The species epithet is always written in lowercase. It often describes the organism\'s appearance, habitat, or honours a person.' },
      { id: 3, instruction: 'Combine with correct formatting', math: 'Loxodonta africana (italicised or underlined)', explanation: 'The complete binomial name is italicised in print or underlined in handwriting. This is the official scientific name of the African bush elephant.' },
    ]
  },
  initialQuestions: [
    {
      id: 'q1', question: 'Who developed the modern system of binomial nomenclature?', math: '',
      options: ['Charles Darwin', 'Carl Linnaeus', 'Gregor Mendel', 'Louis Pasteur'],
      correctIndex: 1, hint: 'Think of the 18th-century Swedish scientist nicknamed the "father of taxonomy".',
      explanation: 'Carl Linnaeus (1707–1778) developed binomial nomenclature and the hierarchical classification system. His system is the basis of modern taxonomy.'
    },
    {
      id: 'q2', question: 'Which of the following is the CORRECTLY formatted scientific name for a species?', math: '',
      options: ['panthera Leo', 'Panthera Leo', 'Panthera leo', 'panthera leo'],
      correctIndex: 2, hint: 'Genus = capital first letter; species = all lowercase.',
      explanation: 'The correct format is Panthera leo — genus with a capital P, species epithet in lowercase. Both should be italicised (or underlined in handwriting).'
    },
    {
      id: 'q3', question: 'Why do scientists use Latin (binomial) names instead of common names?', math: '',
      options: ['Latin sounds more scientific', 'Common names are too long', 'Latin names are universal and avoid confusion across languages', 'All organisms have the same common name'],
      correctIndex: 2, hint: 'Think about what happens when a South African and a British scientist discuss the same animal.',
      explanation: 'Common names vary by language, region, and culture. Latin scientific names are internationally standardised — every scientist worldwide uses the same name for the same species, preventing confusion.'
    },
    {
      id: 'q4', question: 'A voucher specimen is important because:', math: '',
      options: ['It is the first individual of a new species found', 'It is a preserved reference sample deposited in a museum for verification', 'It is a DNA sample stored in a freezer', 'It is the written description of a new species'],
      correctIndex: 1, hint: 'A voucher is physical proof — something scientists can examine.',
      explanation: 'A voucher specimen is a preserved physical example of a newly described species deposited in a museum or herbarium. It allows other scientists to examine the actual organism and confirm or challenge its classification.'
    },
  ],
  remediationQuestions: [
    {
      id: 'r1', question: 'In the name Homo sapiens, which word is the genus?', math: '',
      options: ['sapiens', 'Homo', 'Both equally', 'Neither — it has no genus'],
      correctIndex: 1, hint: 'The genus is the first word and starts with a capital letter.',
      explanation: 'Homo is the genus (capital H, first word). sapiens is the species epithet (lowercase, second word). Together, Homo sapiens is the scientific name for modern humans.'
    },
    {
      id: 'r2', question: 'How should the name Canis lupus (wolf) be written in a handwritten document?', math: '',
      options: ['Canis lupus (underlined)', 'CANIS LUPUS (uppercase)', 'canis lupus (all lowercase)', 'Canis Lupus (both capitalised)'],
      correctIndex: 0, hint: 'When you cannot italicise, what is the alternative?',
      explanation: 'In handwriting, scientific names are underlined instead of italicised. The formatting rule remains: Canis (capital) lupus (lowercase), and the name is underlined.'
    },
  ],
  hardQuestions: [
    {
      id: 'h1', question: 'Two organisms share the genus name Equus. What does this tell you about their relationship?', math: '',
      options: ['They are the same species', 'They are closely related and share more classification levels above genus', 'They are in the same family but different orders', 'They have identical DNA'],
      correctIndex: 1, hint: 'Sharing a genus means sharing all higher levels (family, order, class, etc.).',
      explanation: 'If two organisms share the same genus, they share all higher taxonomic levels (family, order, class, phylum, kingdom). Equus includes horses, zebras, and donkeys — closely related but distinct species.'
    },
    {
      id: 'h2', question: 'A scientist abbreviates Panthera leo as P. leo in a scientific paper. This is acceptable because:', math: '',
      options: ['All genus names can be abbreviated to one letter after first use', 'Species epithets are not important', 'The abbreviation follows standard convention when the genus has already been written out in full', 'P is the chemical symbol for phosphorus'],
      correctIndex: 2, hint: 'Once the full name has been stated, how can you shorten it?',
      explanation: 'After the full binomial name has been written once, subsequent references may abbreviate the genus to its first letter: Panthera leo → P. leo. This is standard scientific writing practice.'
    },
    {
      id: 'h3', question: 'Why might taxonomists reclassify an organism into a different genus?', math: '',
      options: ['Because the organism moved to a different habitat', 'Because new evidence (DNA analysis, fossil data) shows it is more closely related to organisms in a different genus', 'Because the Latin name was misspelled', 'Because a common name became more widely used'],
      correctIndex: 1, hint: 'Classification should reflect evolutionary relationships. What changes those relationships?',
      explanation: 'Modern molecular biology (DNA sequencing) sometimes reveals that organisms previously grouped together are not as closely related as thought. Reclassification updates the taxonomy to reflect true evolutionary relationships.'
    },
    {
      id: 'h4', question: 'The species epithet africana in Loxodonta africana most likely refers to:', math: '',
      options: ['The discoverer\'s name', 'The organism\'s colour', 'The region where the organism is found', 'The organism\'s diet'],
      correctIndex: 2, hint: 'Africana is derived from Africa — what does this suggest?',
      explanation: 'Species epithets often describe the organism\'s origin, habitat, or physical feature. Africana refers to Africa — indicating where this elephant species is found. Other examples: canadensis (from Canada), alba (white).'
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
  const [current, setCurrent] = useState(0)
  const step = TOPIC.interactiveSteps[current]; const isLast = current === TOPIC.interactiveSteps.length - 1
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
                  return (
                  <motion.div key={i} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: i * 0.1 }}
                    className="relative text-xl font-mono font-bold text-slate-900">
                    {char}{bubble && <SpeechBubble text={bubble.text} pos={bubble.pos} />}
                  </motion.div>
                )
              })}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      <button onClick={() => isLast ? onComplete() : setCurrent(c => c + 1)}
        className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl transition-all active:scale-[0.98]">
        {isLast ? 'Continue' : 'Next Tip'} <ArrowRight size={18} />
      </button>
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
            <motion.div key={i} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }}
              className={`flex gap-5 p-4 rounded-2xl border ${i === stepIndex ? 'bg-slate-50 border-slate-200' : 'bg-slate-50 border-slate-100'}`}>
              <div className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black ${i === stepIndex ? 'bg-slate-600 text-white' : 'bg-white border border-slate-200 text-slate-400'}`}>{i + 1}</div>
              <div className="min-w-0">
                <p className="text-base font-black text-slate-900">{s.instruction}</p>
                <p className="text-slate-500 text-xs mt-0.5 mb-3 leading-relaxed">{s.explanation}</p>
                <div className="overflow-x-auto -mx-1 px-1"><div className="inline-block whitespace-nowrap px-4 py-2 bg-white border border-slate-200 rounded-xl text-lg font-mono font-black text-slate-600 shadow-sm">{s.math}</div></div>
              </div>
            </motion.div>
          ))}
        </div>
        <button onClick={() => isLast ? onComplete() : setStepIndex(s => s + 1)}
          className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl transition-all active:scale-[0.98]">
          {isLast ? 'Now You Try' : 'Show Next Step'} <ArrowRight size={18} />
        </button>
      </div>
    </div>
  )
}

const STORAGE_KEY_PREFIX = 'scratchpad_taxonomy_'

const ScratchpadModal = ({ question, math, storageKey, onClose }: { question: string; math?: string; storageKey: string; onClose: () => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null); const [tool, setTool] = useState<'pen' | 'eraser'>('pen')
  const [history, setHistory] = useState<ImageData[]>([]); const drawing = useRef(false); const lastPos = useRef<{ x: number; y: number } | null>(null)
  const getCtx = () => canvasRef.current?.getContext('2d') ?? null
  const saveSnapshot = useCallback(() => {
    const ctx = getCtx(); const c = canvasRef.current; if (!ctx || !c) return
    setHistory(h => [...h.slice(-29), ctx.getImageData(0, 0, c.width, c.height)]); localStorage.setItem(storageKey, c.toDataURL())
  }, [storageKey])
  useEffect(() => {
    const c = canvasRef.current; if (!c) return; const dpr = window.devicePixelRatio || 1; const rect = c.getBoundingClientRect()
    c.width = rect.width * dpr; c.height = rect.height * dpr; const ctx = c.getContext('2d')!; ctx.scale(dpr, dpr); ctx.lineCap = 'round'; ctx.lineJoin = 'round'
    const saved = localStorage.getItem(storageKey); if (saved) { const img = new Image(); img.onload = () => ctx.drawImage(img, 0, 0, rect.width, rect.height); img.src = saved }
  }, [storageKey])
  const getPos = (e: React.PointerEvent) => { const c = canvasRef.current!; const rect = c.getBoundingClientRect(); return { x: e.clientX - rect.left, y: e.clientY - rect.top } }
  const onPointerDown = (e: React.PointerEvent) => { e.currentTarget.setPointerCapture(e.pointerId); drawing.current = true; lastPos.current = getPos(e); const ctx = getCtx()!; ctx.beginPath(); ctx.moveTo(lastPos.current.x, lastPos.current.y) }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drawing.current) return; const pos = getPos(e); const ctx = getCtx()!
    ctx.lineWidth = tool === 'pen' ? 3 : 24; ctx.strokeStyle = tool === 'pen' ? '#1e293b' : '#f8fafc'
    ctx.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over'
    ctx.lineTo(pos.x, pos.y); ctx.stroke(); ctx.beginPath(); ctx.moveTo(pos.x, pos.y); lastPos.current = pos
  }
  const onPointerUp = () => { if (!drawing.current) return; drawing.current = false; lastPos.current = null; saveSnapshot() }
  const undo = () => { const c = canvasRef.current; const ctx = getCtx(); if (!ctx || !c) return; setHistory(h => { const next = h.slice(0, -1); ctx.clearRect(0, 0, c.width, c.height); if (next.length > 0) ctx.putImageData(next[next.length - 1], 0, 0); localStorage.setItem(storageKey, c.toDataURL()); return next }) }
  const clearAll = () => { const c = canvasRef.current; const ctx = getCtx(); if (!ctx || !c) return; ctx.clearRect(0, 0, c.width, c.height); setHistory([]); localStorage.removeItem(storageKey) }
  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
        <motion.div initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} className="w-full sm:max-w-lg bg-white rounded-t-2xl sm:rounded-2xl shadow-lg flex flex-col overflow-hidden" style={{ maxHeight: '90dvh' }}>
          <div className="px-5 pt-5 pb-3 border-b border-slate-100 shrink-0">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0"><p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-1">Working Space</p><p className="text-sm font-black text-slate-900 leading-snug">{question}</p>{math && <div className="overflow-x-auto mt-1 -mx-1 px-1"><span className="whitespace-nowrap font-mono text-sm font-black text-slate-700">{math}</span></div>}</div>
              <button onClick={onClose} aria-label="Close" className="shrink-0 w-11 h-11 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 transition-colors"><X size={16} /></button>
            </div>
          </div>
          <div className="flex items-center gap-2 px-5 py-2.5 border-b border-slate-100 shrink-0 bg-slate-50/60">
            <button onClick={() => setTool('pen')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition-all ${tool === 'pen' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'}`}><PenLine size={13} /> Pen</button>
            <button onClick={() => setTool('eraser')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition-all ${tool === 'eraser' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'}`}><Eraser size={13} /> Eraser</button>
            <div className="flex-1" />
            <button onClick={undo} disabled={history.length === 0} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black text-slate-500 hover:bg-slate-100 disabled:opacity-30 transition-all"><Undo2 size={13} /> Undo</button>
            <button onClick={clearAll} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black text-slate-500 hover:bg-slate-50 transition-all"><Trash2 size={13} /> Clear</button>
          </div>
          <div className="relative flex-1 min-h-0 bg-slate-50" style={{ touchAction: 'none' }}>
            <canvas ref={canvasRef} className="w-full h-full block" style={{ cursor: tool === 'eraser' ? 'cell' : 'crosshair', touchAction: 'none' }} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerLeave={onPointerUp} />
            {history.length === 0 && <div className="absolute inset-0 flex items-center justify-center pointer-events-none"><p className="text-xs text-slate-300 font-semibold select-none">Draw your working here…</p></div>}
          </div>
          <div className="px-5 py-3 border-t border-slate-100 shrink-0"><button onClick={onClose} className="w-full py-3.5 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-[0.98]">Done</button></div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

const PracticeModule = ({ questions, onComplete }: { questions: Question[]; onComplete: (res: { correct: number; total: number }) => void }) => {
  const [current, setCurrent] = useState(0); const [selected, setSelected] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false); const [hintVisible, setHintVisible] = useState(false)
  const [correctCount, setCorrectCount] = useState(0); const [scratchpadOpen, setScratchpadOpen] = useState(false)
  const q = questions[current]; const isLast = current === questions.length - 1
  const handleSelect = (i: number) => { if (revealed) return; setSelected(i); setRevealed(true); if (i === q.correctIndex) setCorrectCount(c => c + 1) }
  const handleNext = () => { if (isLast) onComplete({ correct: correctCount, total: questions.length }); else { setCurrent(c => c + 1); setSelected(null); setRevealed(false); setHintVisible(false) } }
  const getOptionStyle = (i: number) => {
    if (!revealed) return selected === i ? 'border-slate-500 bg-slate-50' : 'border-slate-200 bg-white hover:border-slate-200 hover:bg-slate-50 cursor-pointer'
    if (i === q.correctIndex) return 'border-slate-500 bg-slate-50 text-slate-900'
    if (i === selected) return 'border-slate-500 bg-slate-50 text-slate-900'
  }
  return (
    <>
      {scratchpadOpen && <ScratchpadModal question={q.question} math={q.math} storageKey={`${STORAGE_KEY_PREFIX}${current}`} onClose={() => setScratchpadOpen(false)} />}
      <div className="space-y-6">
        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-4 md:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Question {current + 1} of {questions.length}</p>
            <div className="flex gap-1">{questions.map((_, i) => <div key={i} className={`w-8 h-1 rounded-full transition-all ${i <= current ? 'bg-slate-600' : 'bg-slate-100'}`} />)}</div>
          </div>
          <div className="flex items-start justify-between gap-3 mb-4">
            <p className="text-sm font-semibold text-slate-900 leading-snug">{q.question}</p>
            <button onClick={() => setScratchpadOpen(true)} className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-xs font-black text-slate-500 hover:bg-slate-50 hover:border-slate-300 transition-all"><NotebookPen size={13} /> Scratch</button>
          </div>
          {q.math && <div className="overflow-x-auto mb-8 -mx-2 px-2"><div className="whitespace-nowrap inline-block bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 font-mono text-lg font-black text-slate-700 min-w-0">{q.math}</div></div>}
          <div className="space-y-3">
            {q.options.map((opt, i) => (
              <motion.button key={i} whileTap={{ scale: revealed ? 1 : 0.98 }} onClick={() => handleSelect(i)} className={`w-full text-left px-3 py-2 rounded-2xl border-2 text-xs font-semibold transition-all ${getOptionStyle(i)}`}>
                <span className="mr-3 font-black opacity-40">{String.fromCharCode(65 + i)}</span>{opt}
              </motion.button>
            ))}
          </div>
          {revealed && <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`mt-6 p-3 rounded-2xl flex gap-4 text-xs font-semibold ${selected === q.correctIndex ? 'bg-slate-50 text-slate-800' : 'bg-slate-50 text-slate-800'}`}><Info size={20} className="shrink-0 mt-0.5" /> {q.explanation}</motion.div>}
          {hintVisible && !revealed && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-5 p-3 bg-slate-50 border border-slate-200 rounded-2xl flex gap-3 text-slate-900"><Lightbulb size={20} className="shrink-0 text-slate-500 mt-0.5" /><p className="text-xs font-semibold">{q.hint}</p></motion.div>}
          <div className="mt-8 flex justify-between items-center">
            {!revealed ? <button onClick={() => setHintVisible(true)} className="text-xs font-black text-slate-600 uppercase tracking-widest px-3 py-2 hover:bg-slate-50 rounded-xl transition-all">{hintVisible ? 'Hint Visible' : 'Need a Hint?'}</button> : <div />}
            {revealed && <button onClick={handleNext} className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-3 shadow-xl transition-all active:scale-[0.98]">{isLast ? 'See Results' : 'Next Question'} <ArrowRight size={18} /></button>}
          </div>
        </div>
      </div>
    </>
  )
}

const FeedbackModule = ({ correct, total, onRetry, onPracticeMore, onContinue, hidePracticeMore = false }: { correct: number; total: number; onRetry: () => void; onPracticeMore: () => void; onContinue: () => void; hidePracticeMore?: boolean }) => {
  const pct = Math.round((correct / total) * 100); const mastered = correct / total >= 2 / 3
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[2.5rem] border border-slate-200 p-4 text-center space-y-6 shadow-sm">
      <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto text-white shadow-xl ${mastered ? 'bg-slate-500' : 'bg-slate-900'}`}>{mastered ? <Award size={40} /> : <RotateCcw size={40} />}</div>
      <div>
        <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${mastered ? 'text-slate-600' : 'text-slate-400'}`}>{mastered ? '✦ Mastered' : 'Keep Practising'}</p>
        <h2 className="text-xl font-bold text-slate-900 tracking-tighter">Your Results</h2>
        <p className="text-sm text-slate-400 font-semibold mt-1">{TOPIC.title}</p>
      </div>
      <div className="flex flex-col items-center gap-3">
        <p className="text-3xl font-bold text-slate-900">{correct} <span className="text-slate-300 text-xl">/</span> {total}</p>
        <div className="w-full max-w-xs h-2 bg-slate-100 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, delay: 0.3 }} className={`h-full rounded-full ${mastered ? 'bg-slate-500' : 'bg-slate-500'}`} /></div>
      </div>
      <div className="flex flex-col gap-3 pt-2">
        <div className={`grid grid-cols-1 ${hidePracticeMore ? '' : 'sm:grid-cols-2'} gap-3`}>
          <button onClick={onRetry} className="w-full py-5 bg-slate-100 text-slate-700 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-200 transition-all">Try Again</button>
          {!hidePracticeMore && <button onClick={onPracticeMore} className="w-full py-5 bg-slate-50 text-slate-700 border border-slate-200 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center justify-center gap-3">Practice More <NotebookPen size={18} /></button>}
        </div>
        <button onClick={onContinue} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-xl">Continue <ArrowRight size={18} /></button>
      </div>
    </motion.div>
  )
}

const SUBJECT = 'Life Sciences'; const GRADE = 10; const TOPIC_ID = 'taxonomy-and-binomial-nomenclature'; const NEXT_TOPIC_ID = 'species-concept'

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


async function loadNextTopicProgress(studentId: number): Promise<TopicStatus> {
  const m = await _loadProgress(studentId, SUBJECT, GRADE, NEXT_TOPIC_ID)
  if (m === 'mastered') return 'mastered'
  if (m === 'needs_practice') return 'needs-practice'
  return 'not-started'
}



function TaxonomyAndBinomialNomenclaturePage({ onNavigate }: { onNavigate: (page: any) => void }) {
  const session = useStudySession()
  const [view, setView] = useState<ViewState>('overview'); const [previousView, setPreviousView] = useState<ViewState | null>(null)
  const [status, setStatus] = useState<TopicStatus>('not-started'); const [nextStatus, setNextStatus] = useState<TopicStatus>('not-started')
  const [practiceResult, setPracticeResult] = useState<{ correct: number; total: number } | null>(null); const [attempts, setAttempts] = useState(0)
  useEffect(() => { if (!session) return; loadTopicProgress(session?.student_id ?? 0).then(s => setStatus(s)); loadNextTopicProgress(session?.student_id ?? 0).then(s => setNextStatus(s)) }, [session])
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
                    <div className={`shrink-0 w-10 h-10 rounded-[1.25rem] flex items-center justify-center text-sm font-bold ${status === 'mastered' ? 'bg-slate-500 text-white' : 'bg-slate-900 text-white shadow-md shadow-slate-900/10'}`}>{status === 'mastered' ? '✓' : '3'}</div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 tracking-tight">{TOPIC.title}</p>
                      <p className="text-sm text-slate-400 mt-1">{TOPIC.description}</p>
                      <p className={`text-[10px] font-black uppercase tracking-widest mt-2 ${status === 'mastered' ? 'text-slate-600' : status === 'needs-practice' ? 'text-slate-600' : 'text-slate-300'}`}>{status === 'mastered' ? '✦ Mastered' : status === 'needs-practice' ? '◉ Needs Practice' : '○ Not Started'}</p>
                    </div>
                  </div>
                  <ChevronRight size={28} className="text-slate-200 group-hover:text-slate-900 transition-colors shrink-0" />
                </motion.div>
                <motion.div onClick={() => onNavigate('learning-lifesci-g10-t1-species' as AppPage)} className="bg-white rounded-xl border border-slate-200 p-4 flex items-center justify-between gap-6 cursor-pointer hover:border-slate-300 hover:shadow-md transition-all group">
                  <div className="flex items-center gap-6">
                    <div className={`shrink-0 w-10 h-10 rounded-[1.25rem] flex items-center justify-center text-sm font-bold ${nextStatus === 'mastered' ? 'bg-slate-500 text-white' : 'bg-slate-900 text-white shadow-md shadow-slate-900/10'}`}>{nextStatus === 'mastered' ? '✓' : '4'}</div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 tracking-tight">The Species Concept</p>
                      <p className="text-sm text-slate-400 mt-1">What makes a species and how we define it.</p>
                      <p className={`text-[10px] font-black uppercase tracking-widest mt-2 ${nextStatus === 'mastered' ? 'text-slate-600' : nextStatus === 'needs-practice' ? 'text-slate-600' : 'text-slate-300'}`}>{nextStatus === 'mastered' ? '✦ Mastered' : nextStatus === 'needs-practice' ? '◉ Needs Practice' : '○ Not Started'}</p>
                    </div>
                  </div>
                  <ChevronRight size={28} className="text-slate-200 group-hover:text-slate-900 transition-colors shrink-0" />
                </motion.div>
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
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex gap-5 items-start">
                        <AlertCircle className="text-slate-500 shrink-0 mt-0.5" size={24} />
                        <div><p className="text-base font-black text-slate-900 uppercase tracking-tight mb-1">Let's Try Again</p><p className="text-slate-700 text-xs leading-relaxed">It's okay — let's work through two extra questions to build your confidence.</p></div>
                      </div>
                      <PracticeModule questions={TOPIC.remediationQuestions} onComplete={handleRemediationComplete} />
                    </div>
                  )}
                  {view === 'feedback' && (
                    <FeedbackModule correct={practiceResult?.correct ?? 0} total={practiceResult?.total ?? (previousView === 'practice-more' ? TOPIC.hardQuestions.length : TOPIC.initialQuestions.length)}
                      onRetry={() => setView('interactive-lesson')} onPracticeMore={() => setView('practice-more')} onContinue={() => setView('overview')} hidePracticeMore={previousView === 'practice-more'} />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default TaxonomyAndBinomialNomenclaturePage
