import { useState, useEffect, useRef, useCallback } from 'react'
import { useStudySession } from '../../../../../../../providers/StudySessionContext'
import { loadTopicProgress as _loadProgress, saveTopicProgress as _saveProgress } from '../../../../../../../lib/studyProgress'
import { motion, AnimatePresence } from 'motion/react'
import {
  ChevronLeft, ChevronRight, ArrowRight, Lightbulb, RotateCcw,
  Award, AlertCircle, Info, PenLine, Eraser, Trash2, Undo2, X, NotebookPen
} from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────────────────────

type TopicStatus = 'not-started' | 'mastered' | 'needs-practice'
type ViewState = 'overview' | 'interactive-lesson' | 'guided-practice' | 'practice' | 'remediation' | 'feedback' | 'practice-more'

interface Question {
  id: string; question: string; math?: string; options: string[]; correctIndex: number; hint: string; explanation: string
}

// ── Data ──────────────────────────────────────────────────────────────────────

const TOPIC = {
  id: 'waves-sound-light',
  title: 'Waves, Sound & Light',
  description: 'Wave properties, the wave equation, sound, and how light behaves.',
  interactiveSteps: [
    {
      id: 'step-1',
      title: 'What Is a Wave?',
      content: 'A wave transfers energy from one place to another — but the medium itself does NOT move along with it.',
      math: ['Energy', '→', 'moves'],
      bubbles: [
        { target: 'Energy', text: 'This travels!', pos: 'top' as const },
        { target: 'moves', text: 'Medium stays put', pos: 'bottom' as const },
      ]
    },
    {
      id: 'step-2',
      title: 'Two Types of Waves',
      content: 'Transverse: disturbance is perpendicular to travel (light, water). Longitudinal: disturbance is parallel to travel (sound).',
      math: ['⊥', 'Transverse', '|', '∥', 'Longitudinal'],
      bubbles: [
        { target: '⊥', text: 'Up & down', pos: 'top' as const },
        { target: '∥', text: 'Push & pull', pos: 'bottom' as const },
      ]
    },
    {
      id: 'step-3',
      title: 'The Wave Equation',
      content: 'Every wave obeys v = f × λ. Speed equals frequency times wavelength.',
      math: ['v', '=', 'f', '×', 'λ'],
      bubbles: [
        { target: 'v', text: 'Speed (m/s)', pos: 'top' as const },
        { target: 'f', text: 'Frequency (Hz)', pos: 'bottom' as const },
        { target: 'λ', text: 'Wavelength (m)', pos: 'top' as const },
      ]
    },
    {
      id: 'step-4',
      title: 'Wave Properties',
      content: 'Amplitude is height from rest. Wavelength is crest to crest. Frequency is how many complete waves pass per second.',
      math: ['A', 'λ', 'f'],
      bubbles: [
        { target: 'A', text: 'Amplitude (m)', pos: 'top' as const },
        { target: 'λ', text: 'Wavelength (m)', pos: 'bottom' as const },
        { target: 'f', text: 'Frequency (Hz)', pos: 'top' as const },
      ]
    },
  ],
  guidedItem: {
    problem: 'A wave has frequency 5 Hz and wavelength 3 m. Find its speed.',
    steps: [
      { id: 1, instruction: 'Write down the formula', math: 'v = f × λ', explanation: 'This applies to all waves — memorise it.' },
      { id: 2, instruction: 'Substitute the values', math: 'v = 5 × 3', explanation: 'f = 5 Hz and λ = 3 m from the question.' },
      { id: 3, instruction: 'Calculate the answer', math: 'v = 15 m/s', explanation: 'The wave travels at 15 metres per second.' },
    ]
  },
  initialQuestions: [
    {
      id: 'q1', question: 'What does a wave transfer from place to place?',
      options: ['Matter', 'Energy', 'The medium', 'Air particles'],
      correctIndex: 1, hint: 'Think about what a wave carries, not what moves.',
      explanation: 'Waves transfer energy. The medium (e.g. water, air) stays in place — only energy moves along.'
    },
    {
      id: 'q2', question: 'In a transverse wave, the disturbance is:', math: '',
      options: ['Parallel to wave travel', 'Perpendicular to wave travel', 'In the same direction as energy', 'Along the compression'],
      correctIndex: 1, hint: 'Transverse = across. Think of flicking a rope up and down.',
      explanation: 'Transverse waves vibrate at right angles (perpendicular) to the direction the wave travels. Sound is NOT transverse — it is longitudinal.'
    },
    {
      id: 'q3', question: 'A wave has f = 10 Hz and λ = 2 m. What is its speed?', math: 'v = f × λ',
      options: ['5 m/s', '12 m/s', '20 m/s', '0.2 m/s'],
      correctIndex: 2, hint: 'Multiply frequency by wavelength.',
      explanation: 'v = 10 × 2 = 20 m/s. Always multiply — never add or divide in the basic wave equation.'
    },
    {
      id: 'q4', question: 'Which of these is a longitudinal wave?',
      options: ['Light', 'Water waves', 'Sound', 'Radio waves'],
      correctIndex: 2, hint: 'Sound travels by compressing and stretching air particles back and forth.',
      explanation: 'Sound is longitudinal — the air particles push and pull in the same direction the sound travels. Light, water waves, and radio waves are all transverse.'
    },
  ],
  remediationQuestions: [
    {
      id: 'r1', question: 'The wave equation is:', math: '',
      options: ['v = f + λ', 'v = f × λ', 'v = f ÷ λ', 'v = f − λ'],
      correctIndex: 1, hint: 'Speed = frequency TIMES wavelength.',
      explanation: 'v = f × λ. Speed equals frequency multiplied by wavelength. This is one of the most important equations in Physical Sciences.'
    },
    {
      id: 'r2', question: 'Frequency is measured in:', math: '',
      options: ['Metres (m)', 'Metres per second (m/s)', 'Hertz (Hz)', 'Kilograms (kg)'],
      correctIndex: 2, hint: 'Frequency counts complete waves per second.',
      explanation: 'Frequency is measured in Hertz (Hz). 1 Hz means one complete wave passes a point every second.'
    },
  ],
  hardQuestions: [
    {
      id: 'h1', question: 'A wave travels at 340 m/s with a frequency of 170 Hz. What is its wavelength?', math: 'v = f × λ → λ = v ÷ f',
      options: ['0.5 m', '2 m', '510 m', '57 800 m'],
      correctIndex: 1, hint: 'Rearrange: λ = v ÷ f.',
      explanation: 'λ = 340 ÷ 170 = 2 m. This is approximately the wavelength of a 170 Hz sound in air.'
    },
    {
      id: 'h2', question: 'Doubling the frequency of a wave (at constant speed) does what to the wavelength?', math: '',
      options: ['Doubles it', 'Halves it', 'Has no effect', 'Quadruples it'],
      correctIndex: 1, hint: 'v = f × λ. If v stays fixed and f doubles, what happens to λ?',
      explanation: 'Since v = f × λ is constant, if f doubles then λ must halve to keep the product the same.'
    },
    {
      id: 'h3', question: 'Light refracts when passing from air into glass. Why?', math: '',
      options: ['Its frequency changes', 'Its amplitude increases', 'Its speed changes', 'It becomes longitudinal'],
      correctIndex: 2, hint: 'Refraction is caused by a change in wave speed between media.',
      explanation: 'Light slows down when entering a denser medium like glass. This change in speed causes the light to bend — that is refraction.'
    },
    {
      id: 'h4', question: 'Two waves overlap and their amplitudes cancel completely. This is:', math: '',
      options: ['Reflection', 'Refraction', 'Constructive interference', 'Destructive interference'],
      correctIndex: 3, hint: 'When waves cancel each other out, the interference is destructive.',
      explanation: 'Destructive interference occurs when a crest meets a trough and they cancel. Constructive interference is when crests add together to make a bigger wave.'
    },
  ]
}

// ── Sub-components ─────────────────────────────────────────────────────────────

const SpeechBubble = ({ text, pos }: { text: string; pos: 'top' | 'bottom' }) => (
  <motion.div
    initial={{ scale: 0, opacity: 0, y: pos === 'top' ? 10 : -10 }}
    animate={{ scale: 1, opacity: 1, y: 0 }}
    transition={{ duration: 0.2 }}
    className={`absolute ${pos === 'top' ? '-top-14' : '-bottom-14'} left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-600 text-white text-xs font-black px-3 py-1.5 rounded-xl shadow-lg z-20`}
  >
    {text}
    <div className={`absolute left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-600 rotate-45 ${pos === 'top' ? '-bottom-1' : '-top-1'}`} />
  </motion.div>
)

const InteractiveLesson = ({ onComplete }: { onComplete: () => void }) => {
  const [current, setCurrent] = useState(0)
  const step = TOPIC.interactiveSteps[current]
  const isLast = current === TOPIC.interactiveSteps.length - 1
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">Slide {current + 1} of {TOPIC.interactiveSteps.length}</p>
        <div className="flex gap-1">{TOPIC.interactiveSteps.map((_, i) => <div key={i} className={`h-1 w-8 rounded-full transition-all ${i <= current ? 'bg-slate-600' : 'bg-slate-200'}`} />)}</div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={current} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}
          className="bg-white border border-slate-200 rounded-[2.5rem] p-5 md:p-8 shadow-sm min-h-64 flex flex-col justify-center gap-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">{step.title}</h2>
            <p className="text-slate-500 text-base leading-relaxed max-w-lg mx-auto">{step.content}</p>
          </div>
          <div className="overflow-x-auto py-12 -mx-2 px-2">
            <div className="flex items-center justify-center gap-4 md:gap-6 relative min-w-max mx-auto">
              {step.math.map((char, i) => {
                const bubble = step.bubbles.find(b => b.target === char)
                  return (
                  <motion.div key={i} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: i * 0.1 }}
                    className="relative text-5xl font-mono font-black text-slate-900">
                    {char}
                    {bubble && <SpeechBubble text={bubble.text} pos={bubble.pos} />}
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
  const [stepIndex, setStepIndex] = useState(0)
  const { steps, problem } = TOPIC.guidedItem
  const isLast = stepIndex === steps.length - 1
  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-[2.5rem] p-5 md:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Step-by-Step Guide</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Step {stepIndex + 1} of {steps.length}</p>
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-8 text-center tracking-tight">{problem}</h2>
        <div className="flex gap-1.5 mb-8">
          {steps.map((_, i) => <div key={i} className={`flex-1 h-1 rounded-full transition-all ${i <= stepIndex ? 'bg-slate-600' : 'bg-slate-100'}`} />)}
        </div>
        <div className="space-y-4 mb-8">
          {steps.slice(0, stepIndex + 1).map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }}
              className={`flex gap-4 p-4 rounded-2xl border ${i === stepIndex ? 'bg-slate-50 border-slate-200' : 'bg-slate-50 border-slate-100'}`}>
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

// ── Scratchpad ────────────────────────────────────────────────────────────────

const STORAGE_KEY_PREFIX = 'scratchpad_waves_'

const ScratchpadModal = ({ question, math, storageKey, onClose }: { question: string; math?: string; storageKey: string; onClose: () => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen')
  const [history, setHistory] = useState<ImageData[]>([])
  const drawing = useRef(false)
  const lastPos = useRef<{ x: number; y: number } | null>(null)
  const getCtx = () => canvasRef.current?.getContext('2d') ?? null
  const saveSnapshot = useCallback(() => {
    const ctx = getCtx(); const c = canvasRef.current
    if (!ctx || !c) return
    const snap = ctx.getImageData(0, 0, c.width, c.height)
    setHistory(h => [...h.slice(-29), snap])
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
  const getPos = (e: React.PointerEvent) => { const c = canvasRef.current!; const rect = c.getBoundingClientRect(); return { x: e.clientX - rect.left, y: e.clientY - rect.top } }
  const onPointerDown = (e: React.PointerEvent) => { e.currentTarget.setPointerCapture(e.pointerId); drawing.current = true; lastPos.current = getPos(e); const ctx = getCtx()!; ctx.beginPath(); ctx.moveTo(lastPos.current.x, lastPos.current.y) }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drawing.current) return; const pos = getPos(e); const ctx = getCtx()!
    ctx.lineWidth = tool === 'pen' ? 3 : 24; ctx.strokeStyle = tool === 'pen' ? '#1e293b' : '#f8fafc'
    ctx.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over'
    ctx.lineTo(pos.x, pos.y); ctx.stroke(); ctx.beginPath(); ctx.moveTo(pos.x, pos.y); lastPos.current = pos
  }
  const onPointerUp = () => { if (!drawing.current) return; drawing.current = false; lastPos.current = null; saveSnapshot() }
  const undo = () => {
    const c = canvasRef.current; const ctx = getCtx(); if (!ctx || !c) return
    setHistory(h => { const next = h.slice(0, -1); ctx.clearRect(0, 0, c.width, c.height); if (next.length > 0) ctx.putImageData(next[next.length - 1], 0, 0); localStorage.setItem(storageKey, c.toDataURL()); return next })
  }
  const clearAll = () => { const c = canvasRef.current; const ctx = getCtx(); if (!ctx || !c) return; ctx.clearRect(0, 0, c.width, c.height); setHistory([]); localStorage.removeItem(storageKey) }
  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4"
        onClick={e => { if (e.target === e.currentTarget) onClose() }}>
        <motion.div initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="w-full sm:max-w-lg bg-white rounded-t-2xl sm:rounded-2xl shadow-lg flex flex-col overflow-hidden" style={{ maxHeight: '90dvh' }}>
          <div className="px-5 pt-5 pb-3 border-b border-slate-100 shrink-0">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-1">Working Space</p>
                <p className="text-sm font-black text-slate-900 leading-snug">{question}</p>
                {math && <div className="overflow-x-auto mt-1 -mx-1 px-1"><span className="whitespace-nowrap font-mono text-sm font-black text-slate-700">{math}</span></div>}
              </div>
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
            <canvas ref={canvasRef} className="w-full h-full block" style={{ cursor: tool === 'eraser' ? 'cell' : 'crosshair', touchAction: 'none' }}
              onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerLeave={onPointerUp} />
            {history.length === 0 && <div className="absolute inset-0 flex items-center justify-center pointer-events-none"><p className="text-xs text-slate-300 font-semibold select-none">Draw your working here…</p></div>}
          </div>
          <div className="px-5 py-3 border-t border-slate-100 shrink-0">
            <button onClick={onClose} className="w-full py-3.5 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-[0.98]">Done</button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// ── Practice ──────────────────────────────────────────────────────────────────

const PracticeModule = ({ questions, onComplete }: { questions: Question[]; onComplete: (res: { correct: number; total: number }) => void }) => {
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [hintVisible, setHintVisible] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [scratchpadOpen, setScratchpadOpen] = useState(false)
  const q = questions[current]
  const isLast = current === questions.length - 1
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
        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-5 md:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Question {current + 1} of {questions.length}</p>
            <div className="flex gap-1">{questions.map((_, i) => <div key={i} className={`w-8 h-1 rounded-full transition-all ${i <= current ? 'bg-slate-600' : 'bg-slate-100'}`} />)}</div>
          </div>
          <div className="flex items-start justify-between gap-3 mb-4">
            <p className="text-xl md:text-2xl font-black text-slate-900 leading-snug">{q.question}</p>
            <button onClick={() => setScratchpadOpen(true)} className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-xs font-black text-slate-500 hover:bg-slate-50 hover:border-slate-300 transition-all"><NotebookPen size={13} /> Scratch</button>
          </div>
          {q.math && <div className="overflow-x-auto mb-8 -mx-2 px-2"><div className="whitespace-nowrap inline-block bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 font-mono text-lg font-black text-slate-700 min-w-0">{q.math}</div></div>}
          <div className="space-y-3">
            {q.options.map((opt, i) => (
              <motion.button key={i} whileTap={{ scale: revealed ? 1 : 0.98 }} onClick={() => handleSelect(i)}
                className={`w-full text-left px-3 py-2 rounded-2xl border-2 text-xs font-semibold transition-all ${getOptionStyle(i)}`}>
                <span className="mr-3 font-black opacity-40">{String.fromCharCode(65 + i)}</span>{opt}
              </motion.button>
            ))}
          </div>
          {revealed && <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`mt-6 p-3 rounded-2xl flex gap-4 text-xs font-semibold ${selected === q.correctIndex ? 'bg-slate-50 text-slate-800' : 'bg-slate-50 text-slate-800'}`}><Info size={20} className="shrink-0 mt-0.5" /> {q.explanation}</motion.div>}
          {hintVisible && !revealed && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-5 p-3 bg-slate-50 border border-slate-200 rounded-2xl flex gap-3 text-slate-900"><Lightbulb size={20} className="shrink-0 text-slate-500 mt-0.5" /><p className="text-xs font-semibold">{q.hint}</p></motion.div>}
          <div className="mt-8 flex justify-between items-center">
            {!revealed ? <button onClick={() => setHintVisible(true)} className="text-xs font-black text-slate-600 uppercase tracking-widest px-4 py-3 hover:bg-slate-50 rounded-xl transition-all">{hintVisible ? 'Hint Visible' : 'Need a Hint?'}</button> : <div />}
            {revealed && <button onClick={handleNext} className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-3 shadow-xl transition-all active:scale-[0.98]">{isLast ? 'See Results' : 'Next Question'} <ArrowRight size={18} /></button>}
          </div>
        </div>
      </div>
    </>
  )
}

const FeedbackModule = ({ correct, total, onRetry, onPracticeMore, onContinue, hidePracticeMore = false }: { correct: number; total: number; onRetry: () => void; onPracticeMore: () => void; onContinue: () => void; hidePracticeMore?: boolean }) => {
  const pct = Math.round((correct / total) * 100)
  const mastered = correct / total >= 2 / 3
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[2.5rem] border border-slate-200 p-10 md:p-14 text-center space-y-8 shadow-sm">
      <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto text-white shadow-xl ${mastered ? 'bg-slate-500' : 'bg-slate-900'}`}>
        {mastered ? <Award size={40} /> : <RotateCcw size={40} />}
      </div>
      <div>
        <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${mastered ? 'text-slate-600' : 'text-slate-400'}`}>{mastered ? '✦ Mastered' : 'Keep Practising'}</p>
        <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Your Results</h2>
        <p className="text-sm text-slate-400 font-semibold mt-1">{TOPIC.title}</p>
      </div>
      <div className="flex flex-col items-center gap-3">
        <p className="text-6xl font-black text-slate-900">{correct} <span className="text-slate-300 text-4xl">/</span> {total}</p>
        <div className="w-full max-w-xs h-2 bg-slate-100 rounded-full overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, delay: 0.3 }} className={`h-full rounded-full ${mastered ? 'bg-slate-500' : 'bg-slate-500'}`} />
        </div>
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

// ── Supabase progress helpers ─────────────────────────────────────────────────

const SUBJECT = 'Physical Sciences'
const GRADE = 10
const TOPIC_ID = 'waves-sound-light'
const NEXT_TOPIC_ID = 'atoms-subatomic-particles'

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



// ── Main Page ─────────────────────────────────────────────────────────────────

function WavesSoundLightPage({ onNavigate }: { onNavigate: (page: any) => void }) {
  const session = useStudySession()
  const [view, setView] = useState<ViewState>('overview')
  const [previousView, setPreviousView] = useState<ViewState | null>(null)
  const [status, setStatus] = useState<TopicStatus>('not-started')
  const [nextStatus, setNextStatus] = useState<TopicStatus>('not-started')
  const [practiceResult, setPracticeResult] = useState<{ correct: number; total: number } | null>(null)
  const [attempts, setAttempts] = useState(0)

  useEffect(() => {
    if (!session) return
    loadTopicProgress(session?.student_id ?? 0).then(s => setStatus(s))
    loadNextTopicProgress(session?.student_id ?? 0).then(s => setNextStatus(s))
  }, [session])

  const saveProgress = async (newStatus: TopicStatus, res: { correct: number; total: number }) => {
    const nextAttempts = attempts + 1; setAttempts(nextAttempts)
    if (session) await saveTopicProgress(session.student_id, session.school_id, newStatus, res.correct, res.total, nextAttempts)
  }

  const handlePracticeComplete = async (res: { correct: number; total: number }) => {
    setPracticeResult(res); setPreviousView('practice')
    if (res.correct === 0) { setView('remediation') } else {
      const newStatus: TopicStatus = res.correct / res.total >= 2 / 3 ? 'mastered' : 'needs-practice'
      setStatus(newStatus); await saveProgress(newStatus, res); setView('feedback')
    }
  }

  const handleRemediationComplete = async (res: { correct: number; total: number }) => {
    setPracticeResult(res); setPreviousView('remediation')
    const newStatus: TopicStatus = res.correct / res.total >= 2 / 3 ? 'mastered' : 'needs-practice'
    setStatus(newStatus); await saveProgress(newStatus, res); setView('feedback')
  }

  const handlePracticeMoreComplete = async (res: { correct: number; total: number }) => {
    setPracticeResult(res); setPreviousView('practice-more')
    const newStatus: TopicStatus = res.correct / res.total >= 2 / 3 ? 'mastered' : 'needs-practice'
    setStatus(newStatus); await saveProgress(newStatus, res); setView('feedback')
  }

  return (
    <div className="min-h-screen selection:bg-slate-100" style={{ background: 'oklch(98.5% 0.005 80)' }}>
      <main className="pt-28 pb-24 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          {view === 'overview' ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Physical Sciences · Grade 10 · Term 1</p>
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Topics</h1>
              </div>
              <div className="space-y-4">
                {/* Topic 1: Waves Sound Light — this page */}
                <motion.div onClick={() => setView('interactive-lesson')}
                  className="bg-white rounded-xl border border-slate-200 p-7 md:p-9 flex items-center justify-between gap-6 cursor-pointer hover:border-slate-300 hover:shadow-md transition-all group">
                  <div className="flex items-center gap-6">
                    <div className={`shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-[1.25rem] flex items-center justify-center text-2xl font-black ${status === 'mastered' ? 'bg-slate-500 text-white' : 'bg-slate-900 text-white shadow-md shadow-slate-900/10'}`}>
                      {status === 'mastered' ? '✓' : '1'}
                    </div>
                    <div>
                      <p className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">{TOPIC.title}</p>
                      <p className="text-sm text-slate-400 mt-1">{TOPIC.description}</p>
                      <p className={`text-[10px] font-black uppercase tracking-widest mt-2 ${status === 'mastered' ? 'text-slate-600' : status === 'needs-practice' ? 'text-slate-600' : 'text-slate-300'}`}>
                        {status === 'mastered' ? '✦ Mastered' : status === 'needs-practice' ? '◉ Needs Practice' : '○ Not Started'}
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={28} className="text-slate-200 group-hover:text-slate-900 transition-colors shrink-0" />
                </motion.div>
                {/* Topic 2: Atoms — navigates to next page */}
                <motion.div onClick={() => onNavigate('learning-physci-g10-t1-atoms' as AppPage)}
                  className="bg-white rounded-xl border border-slate-200 p-7 md:p-9 flex items-center justify-between gap-6 cursor-pointer hover:border-slate-300 hover:shadow-md transition-all group">
                  <div className="flex items-center gap-6">
                    <div className={`shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-[1.25rem] flex items-center justify-center text-2xl font-black ${nextStatus === 'mastered' ? 'bg-slate-500 text-white' : 'bg-slate-900 text-white shadow-md shadow-slate-900/10'}`}>
                      {nextStatus === 'mastered' ? '✓' : '2'}
                    </div>
                    <div>
                      <p className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Atoms & Subatomic Particles</p>
                      <p className="text-sm text-slate-400 mt-1">Protons, neutrons, electrons and how atoms are structured.</p>
                      <p className={`text-[10px] font-black uppercase tracking-widest mt-2 ${nextStatus === 'mastered' ? 'text-slate-600' : nextStatus === 'needs-practice' ? 'text-slate-600' : 'text-slate-300'}`}>
                        {nextStatus === 'mastered' ? '✦ Mastered' : nextStatus === 'needs-practice' ? '◉ Needs Practice' : '○ Not Started'}
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={28} className="text-slate-200 group-hover:text-slate-900 transition-colors shrink-0" />
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center justify-between mb-10">
                <button onClick={() => setView('overview')} className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all">
                  <ChevronLeft size={18} /> Back
                </button>
                <div className="px-4 py-2 bg-white border border-slate-200 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  Physical Sciences · Grade 10
                </div>
              </div>
              <AnimatePresence mode="wait">
                <motion.div key={view} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                  {view === 'interactive-lesson' && <InteractiveLesson onComplete={() => setView('guided-practice')} />}
                  {view === 'guided-practice' && <GuidedPracticeModule onComplete={() => setView('practice')} />}
                  {view === 'practice' && <PracticeModule questions={TOPIC.initialQuestions} onComplete={handlePracticeComplete} />}
                  {view === 'practice-more' && <PracticeModule questions={TOPIC.hardQuestions} onComplete={handlePracticeMoreComplete} />}
                  {view === 'remediation' && (
                    <div className="space-y-6">
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex gap-4 items-start">
                        <AlertCircle className="text-slate-500 shrink-0 mt-0.5" size={24} />
                        <div>
                          <p className="text-base font-black text-slate-900 uppercase tracking-tight mb-1">Let's Try Again</p>
                          <p className="text-slate-700 text-xs leading-relaxed">It's okay — let's work through two extra questions to build your confidence.</p>
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
                      onContinue={() => setView('overview')}
                      hidePracticeMore={previousView === 'practice-more'}
                    />
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

export default WavesSoundLightPage
