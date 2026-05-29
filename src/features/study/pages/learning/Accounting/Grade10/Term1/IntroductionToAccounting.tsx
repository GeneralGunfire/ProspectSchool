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
  id: 'introduction-to-accounting',
  title: 'Introduction to Accounting',
  description: 'What accounting is, who uses it, and core accounting principles.',
  interactiveSteps: [
    {
      id: 'step-1', title: 'What Is Accounting?', content: 'Accounting is the systematic process of recording, classifying, summarising, and interpreting financial transactions of a business. It produces information used by owners, managers, investors, and government.',
      math: ['Record', '→', 'Classify', '→', 'Report'],
      bubbles: [{ target: 'Record', text: 'Every transaction', pos: 'top' as const }, { target: 'Report', text: 'Financial statements', pos: 'bottom' as const }]
    },
    {
      id: 'step-2', title: 'Forms of Ownership', content: 'Businesses can be a Sole Trader (one owner, unlimited liability), Partnership (2–20 partners, shared liability), Close Corporation (CC — members), or Company (shareholders, limited liability).',
      math: ['Sole', '|', 'Partner', '|', 'Co.'],
      bubbles: [{ target: 'Sole', text: 'One owner', pos: 'top' as const }, { target: 'Co.', text: 'Shareholders — limited', pos: 'bottom' as const }]
    },
    {
      id: 'step-3', title: 'GAAP Principles', content: 'Generally Accepted Accounting Practice (GAAP) ensures financial statements are comparable and reliable. Key principles: Going Concern, Consistency, Materiality, Prudence (conservatism), Historical Cost.',
      math: ['GAAP', '=', 'Reliable', '+', 'Comparable'],
      bubbles: [{ target: 'Reliable', text: 'Trustworthy information', pos: 'top' as const }, { target: 'Comparable', text: 'Same rules every year', pos: 'bottom' as const }]
    },
    {
      id: 'step-4', title: 'The Business Entity Concept', content: 'The business is treated as a separate entity from its owner. Personal transactions of the owner are NEVER recorded in the business books — even in a sole trader where there is no legal separation.',
      math: ['Business', '≠', 'Owner'],
      bubbles: [{ target: 'Business', text: 'Separate records', pos: 'top' as const }, { target: 'Owner', text: 'Personal affairs separate', pos: 'bottom' as const }]
    },
  ],
  guidedItem: {
    problem: 'Naledi runs a hair salon as a sole trader. She uses R500 of salon cash to pay her personal phone bill. How should this be recorded?',
    steps: [
      { id: 1, instruction: 'Apply the business entity concept', math: 'Business ≠ Owner → personal expenses must be separated', explanation: 'Even though Naledi owns the business, her personal expenses are not business expenses. The business entity concept requires strict separation.' },
      { id: 2, instruction: 'Identify what happened from the business perspective', math: 'R500 cash left the business → recorded as Drawings', explanation: 'When an owner takes money from the business for personal use, it is recorded as "Drawings" — a reduction in the owner\'s equity, not a business expense.' },
      { id: 3, instruction: 'State the correct treatment', math: 'Dr Drawings R500 | Cr Cash R500', explanation: 'Drawings increases (debit) and Cash decreases (credit). This keeps the business records accurate without mixing personal and business finances.' },
    ]
  },
  initialQuestions: [
    {
      id: 'q1', question: 'Which of the following BEST describes accounting?', math: '',
      options: ['The process of producing goods and services', 'Systematic recording, classifying, summarising, and interpreting financial transactions', 'The legal process of registering a business', 'Marketing products to customers'],
      correctIndex: 1, hint: 'Accounting is about financial information — recording and reporting it.',
      explanation: 'Accounting is the systematic process of recording, classifying, summarising, and interpreting financial transactions. Its output — financial statements — is used by various stakeholders to make decisions.'
    },
    {
      id: 'q2', question: 'What is the key feature that distinguishes a company from a sole trader?', math: '',
      options: ['Companies must have more than 10 employees', 'Companies pay no taxes', 'Companies have limited liability — shareholders only lose their investment', 'Companies can only operate locally'],
      correctIndex: 2, hint: 'Think about what happens to shareholders if the company goes bankrupt.',
      explanation: 'In a company, shareholders have limited liability — they can only lose what they invested. In a sole trader, the owner has unlimited liability and personal assets can be used to pay business debts.'
    },
    {
      id: 'q3', question: 'The business entity concept means:', math: '',
      options: ['The business and its owner share the same bank account', 'The business is treated as a separate entity from its owner for accounting purposes', 'Only companies must keep financial records', 'The government owns a share of every business'],
      correctIndex: 1, hint: 'Even a sole trader\'s personal spending must be kept separate from business spending.',
      explanation: 'The business entity concept requires that the business\'s financial records are kept completely separate from the owner\'s personal finances — regardless of the legal form of the business.'
    },
    {
      id: 'q4', question: 'Which GAAP principle requires that the same accounting methods are applied from one year to the next?', math: '',
      options: ['Going Concern', 'Historical Cost', 'Consistency', 'Materiality'],
      correctIndex: 2, hint: 'If you change methods every year, comparisons become meaningless.',
      explanation: 'The Consistency principle requires that accounting methods be applied consistently from period to period. This allows financial statements to be comparable across different years and ensures trends can be identified reliably.'
    },
  ],
  remediationQuestions: [
    {
      id: 'r1', question: 'A sole trader uses business money to pay her personal electricity bill. In accounting, this is recorded as:', math: '',
      options: ['A business electricity expense', 'Drawings', 'Income', 'Capital'],
      correctIndex: 1, hint: 'When the owner takes money from the business for personal use, what is it called?',
      explanation: 'Taking business money for personal use is recorded as Drawings. It reduces the owner\'s equity in the business but is not an operating expense of the business.'
    },
    {
      id: 'r2', question: 'GAAP stands for:', math: '',
      options: ['General Annual Accounting Principles', 'Generally Accepted Accounting Practice', 'Government Accounting and Auditing Procedures', 'Gross Annual Accounting Profit'],
      correctIndex: 1, hint: 'These are the rules that make financial statements comparable and reliable.',
      explanation: 'GAAP stands for Generally Accepted Accounting Practice. These are the standard rules and conventions that accountants follow to ensure financial statements are consistent, reliable, and comparable.'
    },
  ],
  hardQuestions: [
    {
      id: 'h1', question: 'The Going Concern principle assumes:', math: '',
      options: ['The business will close at the end of the financial year', 'The business will continue operating into the foreseeable future', 'All assets must be valued at liquidation price', 'The business has made a profit'],
      correctIndex: 1, hint: 'Going concern = continuing business. What does this assume about the future?',
      explanation: 'The Going Concern principle assumes the business will continue to operate indefinitely. This justifies recording assets at cost (not liquidation value) and spreading expenses over their useful life.'
    },
    {
      id: 'h2', question: 'Under the Historical Cost principle, a building bought for R800 000 is now worth R1.5 million. How is it recorded?', math: '',
      options: ['At R1.5 million (market value)', 'At the average of R800 000 and R1.5 million', 'At R800 000 (original cost)', 'It is not recorded until sold'],
      correctIndex: 2, hint: 'Historical cost = the original purchase price, not current market value.',
      explanation: 'Under the Historical Cost principle, assets are recorded at their original purchase price (R800 000). Current market value is not used unless the asset is sold. This ensures objectivity and verifiability.'
    },
    {
      id: 'h3', question: 'The Materiality principle means that:', math: '',
      options: ['All transactions, no matter how small, must be separately disclosed', 'Only significant items that could influence decisions need to be disclosed separately', 'The business must use expensive accounting software', 'All assets must be physically counted monthly'],
      correctIndex: 1, hint: 'Materiality = importance. Does a R10 pen purchase need its own line in a report?',
      explanation: 'Materiality means that only items significant enough to influence the decisions of users need to be separately disclosed. Trivial items can be grouped or simplified. What is "material" depends on the size of the business.'
    },
    {
      id: 'h4', question: 'A sole trader and a company both operate in South Africa. Which statement about their accounting obligations is correct?', math: '',
      options: ['Only companies need to keep accounting records', 'Both must keep accounting records, but companies face stricter auditing requirements', 'Sole traders do not pay tax and therefore need no records', 'Companies use GAAP but sole traders do not'],
      correctIndex: 1, hint: 'All businesses must keep records, but the extent of reporting differs.',
      explanation: 'Both sole traders and companies must keep accounting records for tax purposes. However, public companies listed on a stock exchange face much stricter requirements — including mandatory independent audits and detailed financial disclosures.'
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
  const step = TOPIC.interactiveSteps[current]
  const isLast = current === TOPIC.interactiveSteps.length - 1
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">Slide {current + 1} of {TOPIC.interactiveSteps.length}</p>
        <div className="flex gap-1">{TOPIC.interactiveSteps.map((_, i) => <div key={i} className={`h-1 w-8 rounded-full transition-all ${i <= current ? 'bg-slate-600' : 'bg-slate-200'}`} />)}</div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={current} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}
          className="bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-12 shadow-sm min-h-80 flex flex-col justify-center gap-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">{step.title}</h2>
            <p className="text-slate-500 text-base leading-relaxed max-w-lg mx-auto">{step.content}</p>
          </div>
          <div className="overflow-x-auto py-12 -mx-2 px-2">
            <div className="flex items-center justify-center gap-4 md:gap-6 relative min-w-max mx-auto">
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
  const [stepIndex, setStepIndex] = useState(0)
  const { steps, problem } = TOPIC.guidedItem
  const isLast = stepIndex === steps.length - 1
  return (
    <div className="space-y-3"><div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-12 shadow-sm">
      <div className="flex items-center justify-between mb-6"><p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Step-by-Step Guide</p><p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Step {stepIndex + 1} of {steps.length}</p></div>
      <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-8 text-center tracking-tight">{problem}</h2>
      <div className="flex gap-1.5 mb-8">{steps.map((_, i) => <div key={i} className={`flex-1 h-1 rounded-full transition-all ${i <= stepIndex ? 'bg-slate-600' : 'bg-slate-100'}`} />)}</div>
      <div className="space-y-3 mb-8">{steps.slice(0, stepIndex + 1).map((s, i) => (
        <motion.div key={i} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }} className={`flex gap-5 p-4 rounded-2xl border ${i === stepIndex ? 'bg-slate-50 border-slate-200' : 'bg-slate-50 border-slate-100'}`}>
          <div className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black ${i === stepIndex ? 'bg-slate-600 text-white' : 'bg-white border border-slate-200 text-slate-400'}`}>{i + 1}</div>
          <div className="min-w-0"><p className="text-base font-black text-slate-900">{s.instruction}</p><p className="text-slate-500 text-xs mt-0.5 mb-3 leading-relaxed">{s.explanation}</p><div className="overflow-x-auto -mx-1 px-1"><div className="inline-block whitespace-nowrap px-4 py-2 bg-white border border-slate-200 rounded-xl text-lg font-mono font-black text-slate-600 shadow-sm">{s.math}</div></div></div>
        </motion.div>
      ))}</div>
      <button onClick={() => isLast ? onComplete() : setStepIndex(s => s + 1)} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl transition-all active:scale-[0.98]">{isLast ? 'Now You Try' : 'Show Next Step'} <ArrowRight size={18} /></button>
    </div></div>
  )
}
const STORAGE_KEY_PREFIX = 'scratchpad_intro-accounting_'
const ScratchpadModal = ({ question, math, storageKey, onClose }: { question: string; math?: string; storageKey: string; onClose: () => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen')
  const [history, setHistory] = useState<ImageData[]>([])
  const drawing = useRef(false)
  const lastPos = useRef<{ x: number; y: number } | null>(null)
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
  const getOptionStyle = (i: number) => { if (!revealed) return selected === i ? 'border-slate-500 bg-slate-50' : 'border-slate-200 bg-white hover:border-slate-200 hover:bg-slate-50 cursor-pointer'; if (i === q.correctIndex) return 'border-slate-500 bg-slate-50 text-slate-900'; if (i === selected) return 'border-slate-500 bg-slate-50 text-slate-900'; return 'border-slate-100 bg-white text-slate-300' }
  return (
    <>{scratchpadOpen && <ScratchpadModal question={q.question} math={q.math} storageKey={`${STORAGE_KEY_PREFIX}${current}`} onClose={() => setScratchpadOpen(false)} />}
      <div className="space-y-6"><div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-12 shadow-sm">
        <div className="flex items-center justify-between mb-6"><p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Question {current + 1} of {questions.length}</p><div className="flex gap-1">{questions.map((_, i) => <div key={i} className={`w-8 h-1 rounded-full transition-all ${i <= current ? 'bg-slate-600' : 'bg-slate-100'}`} />)}</div></div>
        <div className="flex items-start justify-between gap-3 mb-4"><p className="text-xl md:text-2xl font-black text-slate-900 leading-snug">{q.question}</p><button onClick={() => setScratchpadOpen(true)} className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-xs font-black text-slate-500 hover:bg-slate-50 hover:border-slate-300 transition-all"><NotebookPen size={13} /> Scratch</button></div>
        {q.math && <div className="overflow-x-auto mb-8 -mx-2 px-2"><div className="whitespace-nowrap inline-block bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 font-mono text-lg font-black text-slate-700 min-w-0">{q.math}</div></div>}
        <div className="space-y-3">{q.options.map((opt, i) => (<motion.button key={i} whileTap={{ scale: revealed ? 1 : 0.98 }} onClick={() => handleSelect(i)} className={`w-full text-left px-3 py-2 rounded-2xl border-2 text-xs font-semibold transition-all ${getOptionStyle(i)}`}><span className="mr-3 font-black opacity-40">{String.fromCharCode(65 + i)}</span>{opt}</motion.button>))}</div>
        {revealed && <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`mt-6 p-3 rounded-2xl flex gap-4 text-xs font-semibold ${selected === q.correctIndex ? 'bg-slate-50 text-slate-800' : 'bg-slate-50 text-slate-800'}`}><Info size={20} className="shrink-0 mt-0.5" /> {q.explanation}</motion.div>}
        {hintVisible && !revealed && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-5 p-3 bg-slate-50 border border-slate-200 rounded-2xl flex gap-3 text-slate-900"><Lightbulb size={20} className="shrink-0 text-slate-500 mt-0.5" /><p className="text-xs font-semibold">{q.hint}</p></motion.div>}
        <div className="mt-8 flex justify-between items-center">
          {!revealed ? <button onClick={() => setHintVisible(true)} className="text-xs font-black text-slate-600 uppercase tracking-widest px-4 py-3 hover:bg-slate-50 rounded-xl transition-all">{hintVisible ? 'Hint Visible' : 'Need a Hint?'}</button> : <div />}
          {revealed && <button onClick={handleNext} className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-3 shadow-xl transition-all active:scale-[0.98]">{isLast ? 'See Results' : 'Next Question'} <ArrowRight size={18} /></button>}
        </div>
      </div></div>
    </>
  )
}
const FeedbackModule = ({ correct, total, onRetry, onPracticeMore, onContinue, hidePracticeMore = false }: { correct: number; total: number; onRetry: () => void; onPracticeMore: () => void; onContinue: () => void; hidePracticeMore?: boolean }) => {
  const pct = Math.round((correct / total) * 100); const mastered = correct / total >= 2 / 3
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[2.5rem] border border-slate-200 p-10 md:p-14 text-center space-y-8 shadow-sm">
      <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto text-white shadow-xl ${mastered ? 'bg-slate-500' : 'bg-slate-900'}`}>{mastered ? <Award size={40} /> : <RotateCcw size={40} />}</div>
      <div><p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${mastered ? 'text-slate-600' : 'text-slate-400'}`}>{mastered ? '✦ Mastered' : 'Keep Practising'}</p><h2 className="text-4xl font-black text-slate-900 tracking-tighter">Your Results</h2><p className="text-sm text-slate-400 font-semibold mt-1">{TOPIC.title}</p></div>
      <div className="flex flex-col items-center gap-3"><p className="text-6xl font-black text-slate-900">{correct} <span className="text-slate-300 text-4xl">/</span> {total}</p><div className="w-full max-w-xs h-2 bg-slate-100 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, delay: 0.3 }} className={`h-full rounded-full ${mastered ? 'bg-slate-500' : 'bg-slate-500'}`} /></div></div>
      <div className="flex flex-col gap-3 pt-2">
        <div className={`grid grid-cols-1 ${hidePracticeMore ? '' : 'sm:grid-cols-2'} gap-3`}><button onClick={onRetry} className="w-full py-5 bg-slate-100 text-slate-700 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-200 transition-all">Try Again</button>{!hidePracticeMore && <button onClick={onPracticeMore} className="w-full py-5 bg-slate-50 text-slate-700 border border-slate-200 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center justify-center gap-3">Practice More <NotebookPen size={18} /></button>}</div>
        <button onClick={onContinue} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-xl">Continue <ArrowRight size={18} /></button>
      </div>
    </motion.div>
  )
}

const SUBJECT = 'Accounting'; const GRADE = 10; const TOPIC_ID = 'introduction-to-accounting'; const NEXT_TOPIC_ID = 'accounting-equation'
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



function IntroductionToAccountingPage({ onNavigate }: { onNavigate: (page: any) => void }) {
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
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Accounting · Grade 10 · Term 1</p>
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Topics</h1>
              </div>
              <div className="space-y-4">
                <motion.div onClick={() => setView('interactive-lesson')} className="bg-white rounded-xl border border-slate-200 p-7 md:p-9 flex items-center justify-between gap-6 cursor-pointer hover:border-slate-300 hover:shadow-md transition-all group">
                  <div className="flex items-center gap-6">
                    <div className={`shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-[1.25rem] flex items-center justify-center text-2xl font-black ${status === 'mastered' ? 'bg-slate-500 text-white' : 'bg-slate-900 text-white shadow-md shadow-slate-900/10'}`}>{status === 'mastered' ? '✓' : '1'}</div>
                    <div>
                      <p className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">{TOPIC.title}</p>
                      <p className="text-sm text-slate-400 mt-1">{TOPIC.description}</p>
                      <p className={`text-[10px] font-black uppercase tracking-widest mt-2 ${status === 'mastered' ? 'text-slate-600' : status === 'needs-practice' ? 'text-slate-600' : 'text-slate-300'}`}>{status === 'mastered' ? '✦ Mastered' : status === 'needs-practice' ? '◉ Needs Practice' : '○ Not Started'}</p>
                    </div>
                  </div>
                  <ChevronRight size={28} className="text-slate-200 group-hover:text-slate-900 transition-colors shrink-0" />
                </motion.div>
                <motion.div onClick={() => onNavigate('learning-accounting-g10-t1-equation' as AppPage)} className="bg-white rounded-xl border border-slate-200 p-7 md:p-9 flex items-center justify-between gap-6 cursor-pointer hover:border-slate-300 hover:shadow-md transition-all group">
                  <div className="flex items-center gap-6">
                    <div className={`shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-[1.25rem] flex items-center justify-center text-2xl font-black ${nextStatus === 'mastered' ? 'bg-slate-500 text-white' : 'bg-slate-900 text-white shadow-md shadow-slate-900/10'}`}>{nextStatus === 'mastered' ? '✓' : '2'}</div>
                    <div>
                      <p className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">The Accounting Equation</p>
                      <p className="text-sm text-slate-400 mt-1">Assets = Equity + Liabilities and why it always balances.</p>
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
                <div className="px-4 py-2 bg-white border border-slate-200 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest">Accounting · Grade 10</div>
              </div>
              <AnimatePresence mode="wait">
                <motion.div key={view} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                  {view === 'interactive-lesson' && <InteractiveLesson onComplete={() => setView('guided-practice')} />}
                  {view === 'guided-practice' && <GuidedPracticeModule onComplete={() => setView('practice')} />}
                  {view === 'practice' && <PracticeModule questions={TOPIC.initialQuestions} onComplete={handlePracticeComplete} />}
                  {view === 'practice-more' && <PracticeModule questions={TOPIC.hardQuestions} onComplete={handlePracticeMoreComplete} />}
                  {view === 'remediation' && (
                    <div className="space-y-6"><div className="bg-slate-50 border border-slate-200 rounded-xl p-8 flex gap-5 items-start"><AlertCircle className="text-slate-500 shrink-0 mt-0.5" size={24} /><div><p className="text-base font-black text-slate-900 uppercase tracking-tight mb-1">Let's Try Again</p><p className="text-slate-700 text-sm leading-relaxed">It's okay — let's work through two extra questions to build your confidence.</p></div></div>
                      <PracticeModule questions={TOPIC.remediationQuestions} onComplete={handleRemediationComplete} /></div>
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

export default IntroductionToAccountingPage
