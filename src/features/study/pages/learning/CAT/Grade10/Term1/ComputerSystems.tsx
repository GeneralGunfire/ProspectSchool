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
  title: 'Computer Systems',
  description: 'Hardware, software, and how the components of a computer work together.',
  interactiveSteps: [
    {
      label: 'Hardware vs Software',
      tokens: ['Hardware', '=', 'Physical', 'components', '|', 'Software', '=', 'Programs', '&', 'data'],
      explanation:
        'Hardware is anything you can physically touch: the monitor, keyboard, CPU, RAM, hard drive. Software is the instructions that tell hardware what to do — the operating system, applications, and data files.',
    },
    {
      label: 'The CPU — Brain of the Computer',
      tokens: ['CPU', '=', 'Fetch', '+', 'Decode', '+', 'Execute', '|', 'Speed:', 'GHz'],
      explanation:
        'The Central Processing Unit (CPU) processes all instructions. It fetches an instruction from memory, decodes it, then executes it — called the fetch-decode-execute cycle. Speed is measured in GHz (gigahertz). More cores = more tasks handled simultaneously.',
    },
    {
      label: 'Memory: RAM vs ROM vs Storage',
      tokens: ['RAM', '(volatile)', '|', 'ROM', '(permanent)', '|', 'Storage', '(HDD/SSD)'],
      explanation:
        'RAM (Random Access Memory) is temporary — it loses data when power is off. ROM (Read-Only Memory) stores permanent firmware. Storage (HDD or SSD) keeps data permanently. RAM is fast but small; storage is large but slower.',
    },
    {
      label: 'Input, Processing, Output, Storage',
      tokens: ['Input', '→', 'Processing', '→', 'Output', '→', 'Storage'],
      explanation:
        'The IPO model: Input devices (keyboard, mouse, scanner) send data to the CPU for Processing, which produces Output (monitor, printer, speaker). Results can be saved to Storage for later use.',
    },
  ],
  guidedItem: {
    scenario:
      'Thabo types an essay in Microsoft Word on his school laptop. Identify each computer system component involved.',
    steps: [
      {
        title: 'Input',
        description:
          'Thabo uses the keyboard (input device) to type his essay. Each keystroke sends an electrical signal to the CPU for processing. The mouse is also an input device he uses to click menus.',
        insight: 'Keyboard and mouse are input devices — they send data into the system.',
      },
      {
        title: 'Processing & Memory',
        description:
          'The CPU processes each character typed. Microsoft Word (software) runs in RAM — the essay is held in RAM while Thabo works. The CPU\'s speed (e.g. 2.4GHz dual-core) determines how fast Word responds.',
        insight: 'CPU processes instructions; RAM temporarily stores the open document.',
      },
      {
        title: 'Output & Storage',
        description:
          'The monitor (output device) displays the essay as Thabo types. When he presses Ctrl+S, the file is saved from RAM to the SSD (permanent storage). If he prints, the printer is another output device.',
        insight: 'Monitor = output. SSD = permanent storage. Saving moves data from RAM to storage.',
      },
    ],
  },
  initialQuestions: [
    {
      id: 'cs-i1',
      question: 'Which component is known as the "brain" of the computer?',
      options: ['RAM', 'Hard Drive', 'CPU', 'Monitor'],
      correctIndex: 2,
      hint: 'This component performs the fetch-decode-execute cycle.',
      explanation:
        'The CPU (Central Processing Unit) processes all instructions and controls the other components. It performs the fetch-decode-execute cycle for every operation the computer carries out.',
    },
    {
      id: 'cs-i2',
      question: 'What happens to data stored in RAM when the computer is switched off?',
      options: [
        'It is saved automatically to the hard drive',
        'It is lost because RAM is volatile',
        'It moves to ROM for safekeeping',
        'It stays in RAM until manually deleted',
      ],
      correctIndex: 1,
      hint: 'RAM needs constant power to hold data.',
      explanation:
        'RAM is volatile memory — it requires constant power to hold data. When the computer is switched off, all unsaved data in RAM is lost. This is why saving your work to storage is important.',
    },
    {
      id: 'cs-i3',
      question: 'A student scans a printed photo into a computer. The scanner is an example of:',
      options: ['Output device', 'Storage device', 'Processing unit', 'Input device'],
      correctIndex: 3,
      hint: 'A scanner sends data INTO the system.',
      explanation:
        'A scanner converts a physical image into digital data and sends it into the computer — making it an input device. Input devices bring data INTO the system.',
    },
    {
      id: 'cs-i4',
      question: 'Which storage device has no moving parts and is faster than a traditional hard drive?',
      options: ['HDD (Hard Disk Drive)', 'DVD-ROM', 'SSD (Solid State Drive)', 'USB flash drive'],
      correctIndex: 2,
      hint: 'This device uses flash memory chips instead of a spinning disk.',
      explanation:
        'An SSD (Solid State Drive) uses flash memory chips with no moving parts, making it significantly faster and more durable than an HDD. Most modern laptops use SSDs.',
    },
  ],
  remediationQuestions: [
    {
      id: 'cs-r1',
      question: 'Which of the following is hardware?',
      options: ['Microsoft Word', 'Windows 11', 'The keyboard', 'An MP3 file'],
      correctIndex: 2,
      hint: 'Hardware is anything you can physically touch.',
      explanation:
        'Hardware is any physical component you can touch. The keyboard is a physical input device. Microsoft Word, Windows 11, and MP3 files are all software (programs or data).',
    },
    {
      id: 'cs-r2',
      question: 'In the IPO model, what does "O" stand for?',
      options: ['Operation', 'Output', 'Online', 'Organisation'],
      correctIndex: 1,
      hint: 'IPO stands for Input → Processing → ?',
      explanation:
        'IPO stands for Input → Processing → Output. Output is the result produced by the computer after processing — displayed on a monitor, printed, or played through speakers.',
    },
  ],
  hardQuestions: [
    {
      id: 'cs-h1',
      question: 'A computer has a 2.4GHz quad-core CPU and 8GB RAM. Which upgrade would most improve performance when running many applications simultaneously?',
      options: [
        'Upgrade to a faster SSD',
        'Increase RAM to 16GB',
        'Add a second monitor',
        'Install a better graphics card',
      ],
      correctIndex: 1,
      hint: 'Each open application uses RAM — think about what runs out first when multitasking.',
      explanation:
        'When running many applications simultaneously, RAM is the bottleneck — each open application uses RAM. Doubling RAM from 8GB to 16GB allows more applications to run without the system slowing down. The SSD helps with load times, not simultaneous multitasking.',
    },
    {
      id: 'cs-h2',
      question: 'ROM stores the BIOS firmware on a computer. This means the BIOS:',
      options: [
        'Is deleted when the computer shuts down',
        'Can be easily modified by any user',
        'Persists even without power and runs before the OS loads',
        'Is stored on the hard drive alongside the operating system',
      ],
      correctIndex: 2,
      hint: 'ROM is non-volatile memory.',
      explanation:
        'ROM is non-volatile — it retains data without power. The BIOS (Basic Input/Output System) is stored in ROM so it can run immediately when the computer is powered on, before the operating system loads from storage.',
    },
    {
      id: 'cs-h3',
      question: 'A school has 30 computers all connected to one printer. When one learner prints, others must wait. This is an example of:',
      options: [
        'A hardware fault in the CPU',
        'A shared output device on a network causing a print queue',
        'Insufficient RAM on the learner\'s computer',
        'A software virus blocking the printer',
      ],
      correctIndex: 1,
      hint: 'This is normal behaviour for a shared network device, not a fault.',
      explanation:
        'A shared network printer creates a print queue — jobs are processed one at a time in order received. This is normal network printing behaviour, not a fault. It illustrates how output devices can be shared across a network.',
    },
    {
      id: 'cs-h4',
      question: 'Which statement best explains why SSDs are preferred over HDDs in modern laptops?',
      options: [
        'SSDs store more data than HDDs',
        'SSDs are cheaper than HDDs',
        'SSDs are faster, more durable, and use less power due to no moving parts',
        'SSDs work without electricity unlike HDDs',
      ],
      correctIndex: 2,
      hint: 'Think about what having no moving parts does for speed, durability, and power use.',
      explanation:
        'SSDs use flash memory (no moving parts), making them faster at reading/writing data, more resistant to physical shock, and more power-efficient — important for battery life in laptops. HDDs are still used where large, cheap storage is needed.',
    },
  ],
  enrichment: {
    outcomes: [
      'Distinguish between hardware and software with examples of each',
      'Describe the function of the CPU, RAM, ROM, and storage devices',
      'Explain the difference between primary and secondary storage',
      'Describe the role of the operating system',
      'Compare input and output devices and give examples of each',
    ],
    knowledgeChecks: [
      {
        afterStep: 0,
        question: 'Which of the following is an example of SOFTWARE?',
        options: [
          'The keyboard',
          'The monitor',
          'Microsoft Word',
          'The hard drive',
        ],
        correctIndex: 2,
        explanation: 'Software consists of programs and instructions that tell hardware what to do. Microsoft Word is an application (software). The keyboard, monitor, and hard drive are all physical hardware components.',
      },
      {
        afterStep: 2,
        question: 'RAM (Random Access Memory) is best described as:',
        options: [
          'Permanent storage that keeps data when the computer is off',
          'Temporary, fast memory used by the CPU to store data currently in use',
          'The chip that processes all instructions in a computer',
          'A type of output device for displaying information',
        ],
        correctIndex: 1,
        explanation: 'RAM is volatile (temporary) primary storage — it holds data and programs currently being used by the CPU. When the computer is switched off, RAM is cleared. More RAM allows more programs to run simultaneously without slowdown.',
      },
    ],
    examTip: 'In CAT exams, always distinguish: Input (data goes IN — keyboard, mouse, scanner) vs Output (result comes OUT — monitor, printer, speakers) vs Storage (data is kept — HDD, SSD, USB). RAM is primary storage (fast, temporary); HDD/SSD is secondary storage (slower, permanent).',
    summaryPoints: [
      'Hardware: physical components you can touch (CPU, RAM, keyboard, monitor, hard drive)',
      'Software: programs and data (operating system, applications, files)',
      'CPU: the processor — executes instructions; speed measured in GHz',
      'RAM: fast temporary memory for currently running programs — lost when power off',
      'ROM: permanent memory containing firmware — not lost when power off',
      'Storage: HDD (magnetic, cheap, slow) vs SSD (flash, expensive, fast, no moving parts)',
    ],
  },
}

const SUBJECT = 'CAT'
const GRADE = 10
const TOPIC_ID = 'computer-systems'

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
const STORAGE_KEY_PREFIX = 'scratchpad_cat-systems_'





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
            <h3 className="text-lg font-black text-[#1e293b] leading-tight">{step.label}</h3>
            <p className="text-[15px] text-stone-500 leading-relaxed mt-2">{step.explanation}</p>
          </div>
          <div className="mx-4 mb-4 bg-[#EEF2F7] rounded-xl px-4 pt-4 pb-6">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-stone-400 mb-6">Tap an element to learn more</p>
            <div className="flex items-center justify-center gap-2 flex-wrap" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
              {step.tokens.map((token, i) => {
                const bubble = (step as any).bubbles?.find((b: any) => b.target === token)
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
  const { steps, scenario } = TOPIC.guidedItem
  const isLast = stepIdx === steps.length - 1
  const step = steps[stepIdx]

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="bg-[#1e293b] rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-stone-400 mb-1">Worked Example</p>
            <p className="text-sm text-stone-300 leading-relaxed">{scenario}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {steps.map((s: any, i: number) => (
          <button
            key={i}
            onClick={() => { setStepIdx(i); setRevealed(false) }}
            className={`shrink-0 px-4 py-1.5 rounded-full text-[11px] font-black transition-colors ${i === stepIdx ? 'bg-[#1e293b] text-white' : i < stepIdx ? 'bg-stone-200 text-stone-600 font-bold' : 'bg-stone-100 text-stone-400 font-bold'}`}
          >
            Step {i + 1}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={stepIdx}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4"
        >
          <p className="font-black text-stone-900 text-base leading-snug">{step.title}</p>
          <div className="bg-[#EEF2F7] rounded-xl px-5 py-4 border border-stone-200/60">
            <p className="font-mono text-[15px] text-stone-800 font-bold leading-relaxed wrap-break-word">{step.description}</p>
          </div>
          {!revealed ? (
            <button onClick={() => setRevealed(true)} className="w-full py-3 border-2 border-dashed border-stone-200 rounded-xl text-sm font-bold text-stone-400 hover:border-stone-400 hover:text-stone-600 transition-colors">
              Reveal explanation
            </button>
          ) : (
            <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="bg-[#EEF2F7] border border-stone-200/60 rounded-xl p-4">
              <p className="text-[13px] text-stone-700 leading-relaxed">{step.insight}</p>
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
          onClick={() => setScratchpadKey(`scratchpad_cat-systems_q-${idx}`)}
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
function ComputerSystemsPage({ onNavigate }: { onNavigate: (page: any) => void }) {
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
            <p className="text-[13px] text-stone-400 mt-0.5">CAT · Grade 10 · Term 1 · Topic 1</p>
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

export default ComputerSystemsPage
