// React hooks we need: useState for state, useEffect for side effects,
// useRef for direct DOM/canvas access, useCallback for stable function references.
import { useState, useEffect, useRef, useCallback } from 'react'
import { useStudySession } from '../../../../../../../providers/StudySessionContext'
import { loadTopicProgress as _loadProgress, saveTopicProgress as _saveProgress } from '../../../../../../../lib/studyProgress'

// motion and AnimatePresence give us smooth enter/exit animations.
// We wrap elements in <motion.div> to animate them, and <AnimatePresence>
// to detect when a child is removed so it can play an exit animation.
import { motion, AnimatePresence } from 'motion/react'

// Icon components from lucide-react — each is a small SVG image.
import {
  ChevronLeft, ChevronRight, ArrowRight, Lightbulb, RotateCcw,
  Award, AlertCircle, Info, PenLine, Eraser, Trash2, Undo2, X, NotebookPen
} from 'lucide-react'

// Shared site header used across all pages.

// withAuth is a higher-order component that wraps a page and makes sure
// a user is logged in before rendering it. AuthedProps is the shape of
// the props that every authenticated page receives (user object + onNavigate).
// AppPage is a union type of all valid page names used for navigation.

// The Supabase client — used to read and write data to the database.

// ── Types ─────────────────────────────────────────────────────────────────────

// The three possible states of progress on a topic.
type TopicStatus = 'not-started' | 'mastered' | 'needs-practice'

// All the screens the user can be on. The page renders different content
// depending on which ViewState is currently active.
type ViewState = 'overview' | 'interactive-lesson' | 'guided-practice' | 'practice' | 'remediation' | 'feedback' | 'practice-more'

// The shape of a single multiple-choice question used throughout the app.
interface Question {
  id: string; question: string; math?: string; options: string[]; correctIndex: number; hint: string; explanation: string
}

// ── Data ──────────────────────────────────────────────────────────────────────

// All the static content for this topic — slides, guided steps, and questions.
// Keeping it in one constant makes it easy to find and edit without touching component logic.
const TOPIC = {
  id: 'intro',
  title: 'Intro to Equations',
  description: 'Learn what variables and equations are, and how to solve for one unknown.',
  // interactiveSteps are the slides shown in the animated lesson at the start.
  // Each step has a title, explanation text, math symbols to display, and
  // speech bubbles that point at specific symbols.
  interactiveSteps: [
    {
      id: 'step-1',
      title: 'Meet the Variable',
      content: 'In algebra, letters like "x" are just mystery boxes for numbers.',
      math: ['x'],
      bubbles: [{ target: 'x', text: "I'm the mystery number!", pos: 'top' as const }]
    },
    {
      id: 'step-2',
      title: 'The Equation',
      content: 'An equation is a statement that two sides are exactly equal.',
      math: ['x', '+', '5', '=', '12'],
      bubbles: [
        { target: 'x', text: 'Mystery number...', pos: 'top' as const },
        { target: '5', text: '...plus five...', pos: 'bottom' as const },
        { target: '12', text: '...is twelve!', pos: 'top' as const }
      ]
    }
  ],
  // guidedItem is the worked example shown step-by-step before the student
  // attempts questions on their own.
  guidedItem: {
    problem: 'Solve: x + 8 = 20',
    steps: [
      { id: 1, instruction: 'Identify the +8', math: 'x + 8 = 20', explanation: 'The 8 is being added to x.' },
      { id: 2, instruction: 'Subtract 8 from both sides', math: 'x + 8 − 8 = 20 − 8', explanation: 'Whatever we do to the left, we must do to the right.' },
      { id: 3, instruction: 'Simplify to find x', math: 'x = 12', explanation: '12 is the final answer because 12 + 8 = 20.' }
    ]
  },
  // The first set of questions the student sees after the guided example.
  initialQuestions: [
    { id: 'q1', question: 'What is the first step to solve this?', math: 'x + 4 = 10', options: ['Add 4 to both sides', 'Subtract 4 from both sides', 'Multiply both sides by 4', 'Divide both sides by 4'], correctIndex: 1, hint: 'Think about the opposite operation of +4.', explanation: 'Subtract 4 from both sides: x + 4 − 4 = 10 − 4 → x = 6.' },
    { id: 'q2', question: 'What does x equal?', math: 'x − 2 = 8', options: ['6', '8', '10', '16'], correctIndex: 2, hint: 'Add 2 to both sides.', explanation: '8 + 2 = 10, so x = 10.' }
  ],
  // Extra questions shown only if the student scores 0 on the initial set.
  // These are simpler and designed to rebuild confidence.
  remediationQuestions: [
    { id: 'r1', question: 'Solve for x:', math: 'x + 3 = 11', options: ['x = 8', 'x = 14', 'x = 3', 'x = 11'], correctIndex: 0, hint: 'Subtract 3 from both sides.', explanation: '11 − 3 = 8, so x = 8.' },
    { id: 'r2', question: 'Solve for x:', math: 'x − 4 = 4', options: ['x = 0', 'x = 8', 'x = 4', 'x = 16'], correctIndex: 1, hint: 'Add 4 to both sides.', explanation: '4 + 4 = 8, so x = 8.' }
  ],
  // Harder questions offered as optional extra practice from the feedback screen.
  hardQuestions: [
    { id: 'h1', question: 'Solve for x:', math: '3x + 7 = 22', options: ['x = 5', 'x = 7', 'x = 15', 'x = 29'], correctIndex: 0, hint: 'First subtract 7, then divide by 3.', explanation: '22 − 7 = 15, then 15 ÷ 3 = 5.' },
    { id: 'h2', question: 'Solve for x:', math: '5x − 12 = 3x + 8', options: ['x = 4', 'x = 10', 'x = 2', 'x = 20'], correctIndex: 1, hint: 'Bring x terms to one side and numbers to the other.', explanation: '5x − 3x = 8 + 12 → 2x = 20 → x = 10.' },
    { id: 'h3', question: 'Solve for x:', math: '2(x + 5) = 16', options: ['x = 3', 'x = 8', 'x = 11', 'x = 6'], correctIndex: 0, hint: 'Divide by 2 first, or expand the brackets.', explanation: 'x + 5 = 8 → x = 3.' },
    { id: 'h4', question: 'Solve for x:', math: 'x/3 + 4 = 10', options: ['x = 2', 'x = 6', 'x = 18', 'x = 42'], correctIndex: 2, hint: 'Subtract 4, then multiply by 3.', explanation: 'x/3 = 6 → x = 18.' }
  ]
}

// ── Sub-components ─────────────────────────────────────────────────────────────

// SpeechBubble renders a small labelled callout that pops up above or below
// a math symbol to explain what it represents. The triangle at the bottom/top
// is a rotated square that creates the "tail" of the bubble.
const SpeechBubble = ({ text, pos }: { text: string; pos: 'top' | 'bottom' }) => (
  <motion.div
    // Starts scaled down and slightly offset, then springs into its final position.
    initial={{ scale: 0, opacity: 0, y: pos === 'top' ? 10 : -10 }}
    animate={{ scale: 1, opacity: 1, y: 0 }}
    transition={{ duration: 0.2 }}
    // Positioned absolutely relative to its parent math character.
    // -translate-x-1/2 centres it horizontally over the character.
    className={`absolute ${pos === 'top' ? '-top-14' : '-bottom-14'} left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-600 text-white text-xs font-black px-3 py-1.5 rounded-xl shadow-lg z-20`}
  >
    {text}
    {/* The bubble "tail" — a rotated square peeking out from the bubble edge */}
    <div className={`absolute left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-600 rotate-45 ${pos === 'top' ? '-bottom-1' : '-top-1'}`} />
  </motion.div>
)

// InteractiveLesson walks the student through a sequence of animated slides.
// Each slide shows one concept with math symbols and speech bubbles.
// When the last slide is done, it calls onComplete to move to the next screen.
const InteractiveLesson = ({ onComplete }: { onComplete: () => void }) => {
  // current tracks which slide index (0-based) is being shown right now.
  const [current, setCurrent] = useState(0)

  // Grab the data for whichever slide is currently active.
  const step = TOPIC.interactiveSteps[current]

  // True when we are on the final slide — changes the button label from "Next Tip" to "Continue".
  const isLast = current === TOPIC.interactiveSteps.length - 1
  return (
    <div className="space-y-6">
      {/* Progress bar row: slide counter on the left, filled dots on the right */}
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">Slide {current + 1} of {TOPIC.interactiveSteps.length}</p>
        <div className="flex gap-1">{TOPIC.interactiveSteps.map((_, i) => <div key={i} className={`h-1 w-8 rounded-full transition-all ${i <= current ? 'bg-slate-600' : 'bg-slate-200'}`} />)}</div>
      </div>

      {/* AnimatePresence + key={current} means every time current changes,
          the old slide fades/slides out and the new one fades/slides in. */}
      <AnimatePresence mode="wait">
        <motion.div key={current} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}
          className="bg-white border border-slate-200 rounded-[2.5rem] p-4 md:p-6 shadow-sm flex flex-col justify-center gap-6">

          {/* Slide title and explanation text */}
          <div className="text-center space-y-2">
            <h2 className="text-base font-bold text-slate-900 tracking-tight">{step.title}</h2>
            <p className="text-slate-500 text-base leading-relaxed max-w-lg mx-auto">{step.content}</p>
          </div>

          {/* Math symbol row — each character in step.math is rendered as a big
              number/letter. If a speech bubble is configured to point at that
              character, it is rendered on top of it using absolute positioning. */}
          <div className="py-8 -mx-2 px-2">
            <div className="flex flex-wrap items-center justify-center gap-2 relative mx-auto">
              {step.math.map((char, i) => {
                // Check if this character has a matching bubble definition.
                const bubble = step.bubbles.find(b => b.target === char)
                return (
                  <motion.div key={i} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: i * 0.1 }}
                    className="relative text-xl font-mono font-black text-slate-900">
                    {char}
                    {bubble && <SpeechBubble text={bubble.text} pos={bubble.pos} />}
                  </motion.div>
                )
              })}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation button: moves to the next slide, or calls onComplete on the last one */}
      <button onClick={() => isLast ? onComplete() : setCurrent(c => c + 1)}
        className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl transition-all active:scale-[0.98]">
        {isLast ? 'Continue' : 'Next Tip'} <ArrowRight size={18} />
      </button>
    </div>
  )
}

// GuidedPracticeModule shows one step of a solved worked example at a time.
// The student taps "Show Next Step" to reveal each step in sequence, building
// understanding before they try questions on their own.
const GuidedPracticeModule = ({ onComplete }: { onComplete: () => void }) => {
  // stepIndex tracks how many steps have been revealed so far (0-based).
  const [stepIndex, setStepIndex] = useState(0)

  const { steps, problem } = TOPIC.guidedItem

  // True when all steps have been shown — changes the button to "Now You Try".
  const isLast = stepIndex === steps.length - 1
  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-[2.5rem] p-4 md:p-6 shadow-sm">

        {/* Header row: label on the left, current step counter on the right */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Step-by-Step Guide</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Step {stepIndex + 1} of {steps.length}</p>
        </div>

        {/* The problem statement at the top of the card */}
        <h2 className="text-base font-bold text-slate-900 mb-8 text-center tracking-tight">{problem}</h2>

        {/* Step progress bar: each segment fills blue as steps are revealed */}
        <div className="flex gap-1.5 mb-8">
          {steps.map((_, i) => <div key={i} className={`flex-1 h-1 rounded-full transition-all ${i <= stepIndex ? 'bg-slate-600' : 'bg-slate-100'}`} />)}
        </div>

        {/* Only render steps up to and including the current one.
            slice(0, stepIndex + 1) means "show everything revealed so far". */}
        <div className="space-y-2 mb-8">
          {steps.slice(0, stepIndex + 1).map((s, i) => (
            // Each step slides in from the left when it first appears.
            <motion.div key={i} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }}
              // The active (newest) step gets a blue highlight; earlier steps are grey.
              className={`flex gap-4 p-4 rounded-2xl border ${i === stepIndex ? 'bg-slate-50 border-slate-200' : 'bg-slate-50 border-slate-100'}`}>
              {/* Step number badge — blue when active, grey when already passed */}
              <div className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black ${i === stepIndex ? 'bg-slate-600 text-white' : 'bg-white border border-slate-200 text-slate-400'}`}>{i + 1}</div>
              <div className="min-w-0">
                <p className="text-base font-black text-slate-900">{s.instruction}</p>
                <p className="text-slate-500 text-xs mt-0.5 mb-3 leading-relaxed">{s.explanation}</p>
                {/* The actual math expression shown in a monospace font */}
                <div className="overflow-x-auto -mx-1 px-1"><div className="inline-block whitespace-nowrap px-4 py-2 bg-white border border-slate-200 rounded-xl text-lg font-mono font-black text-slate-600 shadow-sm">{s.math}</div></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Button reveals the next step, or ends the guided section on the last step */}
        <button onClick={() => isLast ? onComplete() : setStepIndex(s => s + 1)}
          className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl transition-all active:scale-[0.98]">
          {isLast ? 'Now You Try' : 'Show Next Step'} <ArrowRight size={18} />
        </button>
      </div>
    </div>
  )
}

// ── Scratchpad ────────────────────────────────────────────────────────────────

// Each question's scratchpad drawing is saved to localStorage under a unique key.
// The prefix ensures different topics don't overwrite each other's saved drawings.
const STORAGE_KEY_PREFIX = 'scratchpad_linear_'

// ScratchpadModal is a freehand drawing canvas that pops up over the question.
// The student can draw working-out notes, then close it and return to the question.
// Drawings are automatically saved to localStorage so they persist if the page reloads.
const ScratchpadModal = ({ question, math, storageKey, onClose }: { question: string; math?: string; storageKey: string; onClose: () => void }) => {
  // canvasRef gives us direct access to the <canvas> DOM element so we can
  // call the Canvas 2D drawing API on it.
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // tool controls whether the pointer draws (pen) or erases (eraser).
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen')

  // history stores snapshots of the canvas so "Undo" can restore the previous state.
  // We keep at most 30 snapshots (the slice(-29) in saveSnapshot enforces this).
  const [history, setHistory] = useState<ImageData[]>([])

  // drawing is a ref (not state) because we don't want to re-render every time
  // the mouse moves — we just need to track whether the pointer is pressed down.
  const drawing = useRef(false)

  // lastPos is also a ref for the same reason — updated every mouse move
  // but doesn't need to cause a re-render.
  const lastPos = useRef<{ x: number; y: number } | null>(null)

  // Helper that returns the 2D drawing context, or null if the canvas isn't ready.
  const getCtx = () => canvasRef.current?.getContext('2d') ?? null

  // saveSnapshot takes a pixel-level copy of the current canvas and pushes it
  // onto the history stack, then saves the canvas as a base64 image in localStorage.
  // useCallback prevents this function from being recreated on every render —
  // it only changes if storageKey changes.
  const saveSnapshot = useCallback(() => {
    const ctx = getCtx()
    const c = canvasRef.current
    if (!ctx || !c) return
    // getImageData captures every pixel on the canvas as raw data.
    const snap = ctx.getImageData(0, 0, c.width, c.height)
    // Keep only the last 30 snapshots to limit memory usage.
    setHistory(h => [...h.slice(-29), snap])
    // toDataURL converts the canvas to a PNG string that localStorage can store.
    localStorage.setItem(storageKey, c.toDataURL())
  }, [storageKey])

  // Runs once when the modal opens (storageKey won't change while it's open).
  // Sets up the canvas size, configures drawing defaults, and reloads any saved drawing.
  useEffect(() => {
    const c = canvasRef.current
    if (!c) return

    // devicePixelRatio is > 1 on high-DPI (retina) screens.
    // Multiplying the canvas buffer size by this ratio makes lines look sharp
    // instead of blurry on those screens.
    const dpr = window.devicePixelRatio || 1
    const rect = c.getBoundingClientRect()
    c.width = rect.width * dpr
    c.height = rect.height * dpr
    const ctx = c.getContext('2d')!
    // Scale the drawing context so coordinates still match the CSS pixel size.
    ctx.scale(dpr, dpr)
    // Round line ends and joins so strokes look smooth.
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    // If there is a previously saved drawing for this question, paint it onto
    // the canvas immediately so the student sees their previous work.
    const saved = localStorage.getItem(storageKey)
    if (saved) {
      const img = new Image()
      img.onload = () => ctx.drawImage(img, 0, 0, rect.width, rect.height)
      img.src = saved
    }
  }, [storageKey])

  // Converts a pointer event's screen coordinates into canvas-local coordinates
  // by subtracting the canvas element's position on the page.
  const getPos = (e: React.PointerEvent) => {
    const c = canvasRef.current!
    const rect = c.getBoundingClientRect()
  }

  // Called when the user first touches or clicks on the canvas.
  // setPointerCapture ensures the pointer events keep firing on this element
  // even if the pointer moves outside the canvas boundary.
  const onPointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    drawing.current = true
    lastPos.current = getPos(e)
    const ctx = getCtx()!
    // Begin a new path at the starting position so the first dot appears.
    ctx.beginPath()
    ctx.moveTo(lastPos.current.x, lastPos.current.y)
  }

  // Called continuously as the pointer moves. Only draws if the pointer is held down.
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drawing.current) return
    const pos = getPos(e)
    const ctx = getCtx()!
    // Pen draws thin dark lines; eraser uses a wide "clear" stroke.
    ctx.lineWidth = tool === 'pen' ? 3 : 24
    ctx.strokeStyle = tool === 'pen' ? '#1e293b' : '#f8fafc'
    // destination-out compositing makes the eraser punch holes in the canvas
    // rather than painting a colour on top.
    ctx.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over'
    ctx.lineTo(pos.x, pos.y)
    ctx.stroke()
    // beginPath + moveTo resets the path so each tiny segment is independent —
    // without this, strokes would eventually join back to the origin point.
    ctx.beginPath()
    ctx.moveTo(pos.x, pos.y)
    lastPos.current = pos
  }

  // Called when the pointer is released or leaves the canvas.
  // Ends the stroke and saves a snapshot for undo.
  const onPointerUp = () => {
    if (!drawing.current) return
    drawing.current = false
    lastPos.current = null
    saveSnapshot()
  }

  // Removes the most recent snapshot from history and paints the one before it.
  // If there are no more snapshots, the canvas is left blank.
  const undo = () => {
    const c = canvasRef.current
    const ctx = getCtx()
    if (!ctx || !c) return
    setHistory(h => {
      // Drop the last entry to go back one step.
      const next = h.slice(0, -1)
      ctx.clearRect(0, 0, c.width, c.height)
      // If something remains in history, restore that state.
      if (next.length > 0) ctx.putImageData(next[next.length - 1], 0, 0)
      localStorage.setItem(storageKey, c.toDataURL())
    })
  }

  // Wipes the entire canvas and removes the saved drawing from localStorage.
  const clearAll = () => {
    const c = canvasRef.current
    const ctx = getCtx()
    if (!ctx || !c) return
    ctx.clearRect(0, 0, c.width, c.height)
    setHistory([])
    localStorage.removeItem(storageKey)
  }

  return (
    // AnimatePresence lets this modal fade in when mounted and fade out when unmounted.
    <AnimatePresence>
      {/* Semi-transparent backdrop covers the whole screen */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4"
        // Clicking directly on the backdrop (not the modal panel) closes the modal.
        onClick={e => { if (e.target === e.currentTarget) onClose() }}
      >
        {/* The modal panel slides up from the bottom on mobile, fades in centred on desktop */}
        <motion.div
          initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="w-full sm:max-w-lg bg-white rounded-t-2xl sm:rounded-2xl shadow-lg flex flex-col overflow-hidden"
          // dvh (dynamic viewport height) accounts for mobile browser chrome correctly.
          style={{ maxHeight: '90dvh' }}
        >
          {/* Modal header: shows the question text and the math expression */}
          <div className="px-5 pt-5 pb-3 border-b border-slate-100 shrink-0">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-1">Working Space</p>
                <p className="text-sm font-black text-slate-900 leading-snug">{question}</p>
                {/* Only render the math line if the question has a math prop */}
                {math && (
                  <div className="overflow-x-auto mt-1 -mx-1 px-1">
                    <span className="whitespace-nowrap font-mono text-sm font-black text-slate-700">{math}</span>
                  </div>
                )}
              </div>
              {/* Close button in the top-right corner */}
              <button onClick={onClose} aria-label="Close" className="shrink-0 w-11 h-11 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 transition-colors">
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Toolbar: pen, eraser, undo, and clear buttons */}
          <div className="flex items-center gap-2 px-5 py-2.5 border-b border-slate-100 shrink-0 bg-slate-50/60">
            {/* Pen tool button — dark background when active */}
            <button onClick={() => setTool('pen')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition-all ${tool === 'pen' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>
              <PenLine size={13} /> Pen
            </button>
            {/* Eraser tool button — dark background when active */}
            <button onClick={() => setTool('eraser')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition-all ${tool === 'eraser' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>
              <Eraser size={13} /> Eraser
            </button>
            {/* Spacer pushes undo/clear to the right */}
            <div className="flex-1" />
            {/* Undo is disabled when there is nothing in the history stack */}
            <button onClick={undo} disabled={history.length === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black text-slate-500 hover:bg-slate-100 disabled:opacity-30 transition-all">
              <Undo2 size={13} /> Undo
            </button>
            {/* Clear wipes everything — styled red to signal it is destructive */}
            <button onClick={clearAll}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black text-slate-500 hover:bg-slate-50 transition-all">
              <Trash2 size={13} /> Clear
            </button>
          </div>

          {/* Canvas drawing area — takes all remaining height in the modal */}
          {/* touchAction: none prevents the browser from scrolling while drawing */}
          <div className="relative flex-1 min-h-0 bg-slate-50" style={{ touchAction: 'none' }}>
            <canvas
              ref={canvasRef}
              className="w-full h-full block"
              style={{ cursor: tool === 'eraser' ? 'cell' : 'crosshair', touchAction: 'none' }}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              // Treat leaving the canvas the same as releasing the pointer,
              // so strokes don't "hang" if the mouse drifts off the edge.
              onPointerLeave={onPointerUp}
            />
            {/* Placeholder text shown only when the canvas is blank */}
            {history.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <p className="text-xs text-slate-300 font-semibold select-none">Draw your working here…</p>
              </div>
            )}
          </div>

          {/* Footer with a Done button that closes the modal */}
          <div className="px-5 py-3 border-t border-slate-100 shrink-0">
            <button onClick={onClose}
              className="w-full py-3.5 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-[0.98]">
              Done
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// PracticeModule renders one question at a time from a given list.
// The student picks an answer, sees instant colour-coded feedback, and moves on.
// When the last question is answered it calls onComplete with the final score.
const PracticeModule = ({ questions, onComplete }: { questions: Question[]; onComplete: (res: { correct: number; total: number }) => void }) => {
  // current is the index of the question being shown right now.
  const [current, setCurrent] = useState(0)

  // selected is the index of the option the student most recently tapped.
  // null means no answer has been chosen yet for this question.
  const [selected, setSelected] = useState<number | null>(null)

  // revealed switches to true the moment an answer is chosen, which locks in
  // the selection and shows the correct/incorrect colour-coding.
  const [revealed, setRevealed] = useState(false)

  // hintVisible controls whether the yellow hint box is shown below the options.
  const [hintVisible, setHintVisible] = useState(false)

  // correctCount accumulates the number of correctly answered questions.
  const [correctCount, setCorrectCount] = useState(0)

  // scratchpadOpen controls whether the drawing modal is currently visible.
  const [scratchpadOpen, setScratchpadOpen] = useState(false)

  // Shorthand for the current question object and whether it is the last one.
  const q = questions[current]
  const isLast = current === questions.length - 1

  // Called when the student taps an answer option.
  // Locks the UI (revealed = true) and increments correctCount if right.
  const handleSelect = (i: number) => {
    // If the answer is already revealed, do nothing — prevent changing answer.
    if (revealed) return
    setSelected(i)
    setRevealed(true)
    if (i === q.correctIndex) setCorrectCount(c => c + 1)
  }

  // Called when the student taps the "Next Question" or "See Results" button.
  // On the last question it passes the final score up to the parent component.
  // Otherwise it resets all per-question state and advances to the next question.
  const handleNext = () => {
    if (isLast) onComplete({ correct: correctCount, total: questions.length })
    else { setCurrent(c => c + 1); setSelected(null); setRevealed(false); setHintVisible(false) }
  }

  // Returns a Tailwind class string for each answer button based on its state.
  // Before answering: selected option is blue; others are plain.
  // After answering: correct is green, wrong selected is red, others are faded.
  const getOptionStyle = (i: number) => {
    if (!revealed) return selected === i ? 'border-slate-500 bg-slate-50' : 'border-slate-200 bg-white hover:border-slate-200 hover:bg-slate-50 cursor-pointer'
    if (i === q.correctIndex) return 'border-slate-500 bg-slate-50 text-slate-900'
    if (i === selected) return 'border-slate-500 bg-slate-50 text-slate-900'
  }

  return (
    <>
      {/* ScratchpadModal is mounted on top of everything only when open.
          storageKey is unique per question index so each question's drawing is stored separately. */}
    {scratchpadOpen && <ScratchpadModal question={q.question} math={q.math} storageKey={`${STORAGE_KEY_PREFIX}${current}`} onClose={() => setScratchpadOpen(false)} />}
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-[2.5rem] p-4 md:p-6 shadow-sm">

        {/* Question counter and dot progress bar */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Question {current + 1} of {questions.length}</p>
          <div className="flex gap-1">{questions.map((_, i) => <div key={i} className={`w-8 h-1 rounded-full transition-all ${i <= current ? 'bg-slate-600' : 'bg-slate-100'}`} />)}</div>
        </div>

        {/* Question text and scratchpad toggle button */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <p className="text-xl md:text-2xl font-black text-slate-900 leading-snug">{q.question}</p>
          <button onClick={() => setScratchpadOpen(true)}
            className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-xs font-black text-slate-500 hover:bg-slate-50 hover:border-slate-300 transition-all">
            <NotebookPen size={13} /> Scratch
          </button>
        </div>

        {/* Math expression block — only rendered when the question has a math prop */}
        {q.math && (
          <div className="overflow-x-auto mb-8 -mx-2 px-2">
            <div className="whitespace-nowrap inline-block bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 font-mono text-lg font-black text-slate-700 min-w-0">
              {q.math}
            </div>
          </div>
        )}

        {/* Answer option buttons — each letter (A, B, C, D) is generated from
            the character code of 65 (which is 'A') plus the index. */}
        <div className="space-y-3">
          {q.options.map((opt, i) => (
            <motion.button key={i} whileTap={{ scale: revealed ? 1 : 0.98 }} onClick={() => handleSelect(i)}
              className={`w-full text-left px-3 py-2 rounded-2xl border-2 text-xs font-semibold transition-all ${getOptionStyle(i)}`}>
              <span className="mr-3 font-black opacity-40">{String.fromCharCode(65 + i)}</span>{opt}
            </motion.button>
          ))}
        </div>

        {/* Explanation box — slides in after an answer is selected.
            Green background for correct, red for incorrect. */}
        {revealed && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className={`mt-6 p-3 rounded-2xl flex gap-3 text-xs font-semibold ${selected === q.correctIndex ? 'bg-slate-50 text-slate-800' : 'bg-slate-50 text-slate-800'}`}>
            <Info size={20} className="shrink-0 mt-0.5" /> {q.explanation}
          </motion.div>
        )}

        {/* Hint box — only shown before an answer is locked in, and only after
            the student taps "Need a Hint?". Animates in with a height transition. */}
        {hintVisible && !revealed && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            className="mt-5 p-3 bg-slate-50 border border-slate-200 rounded-2xl flex gap-3 text-slate-900">
            <Lightbulb size={20} className="shrink-0 text-slate-500 mt-0.5" />
            <p className="text-xs font-semibold">{q.hint}</p>
          </motion.div>
        )}

        {/* Bottom action row: hint button on the left, next button on the right */}
        <div className="mt-8 flex justify-between items-center">
          {/* Show the hint button only before an answer is revealed */}
          {!revealed
            ? <button onClick={() => setHintVisible(true)} className="text-xs font-black text-slate-600 uppercase tracking-widest px-3 py-2 hover:bg-slate-50 rounded-xl transition-all">{hintVisible ? 'Hint Visible' : 'Need a Hint?'}</button>
            : <div />}
          {/* Show the next/results button only after an answer is revealed */}
          {revealed && (
            <button onClick={handleNext}
              className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-3 shadow-xl transition-all active:scale-[0.98]">
              {isLast ? 'See Results' : 'Next Question'} <ArrowRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
    </>
  )
}

// FeedbackModule shows the student their score after a practice round.
// It offers three paths: try again, do harder practice, or move on.
// hidePracticeMore removes the "Practice More" button when the student
// has already completed the harder question set.
const FeedbackModule = ({ correct, total, onRetry, onPracticeMore, onContinue, hidePracticeMore = false }: { correct: number; total: number; onRetry: () => void; onPracticeMore: () => void; onContinue: () => void; hidePracticeMore?: boolean }) => {
  // pct is used to animate the progress bar to the correct width.
  const pct = Math.round((correct / total) * 100)

  // The student is considered to have mastered the topic if they scored 2/3 or more.
  const mastered = correct / total >= 2 / 3

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[2.5rem] border border-slate-200 p-4 text-center space-y-8 shadow-sm">

      {/* Icon badge: trophy for mastered, retry arrow for needs more practice */}
      <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto text-white shadow-xl ${mastered ? 'bg-slate-500' : 'bg-slate-900'}`}>
        {mastered ? <Award size={40} /> : <RotateCcw size={40} />}
      </div>

      {/* Result label and heading */}
      <div>
        <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${mastered ? 'text-slate-600' : 'text-slate-400'}`}>{mastered ? '✦ Mastered' : 'Keep Practising'}</p>
        <h2 className="text-base font-bold text-slate-900 tracking-tighter">Your Results</h2>
        <p className="text-sm text-slate-400 font-semibold mt-1">{TOPIC.title}</p>
      </div>

      {/* Numeric score and animated progress bar */}
      <div className="flex flex-col items-center gap-3">
        <p className="text-xl font-black text-slate-900">{correct} <span className="text-slate-300 text-base">/</span> {total}</p>
        <div className="w-full max-w-xs h-2 bg-slate-100 rounded-full overflow-hidden">
          {/* The bar width animates from 0% to the actual percentage */}
          <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, delay: 0.3 }}
            className={`h-full rounded-full ${mastered ? 'bg-slate-500' : 'bg-slate-500'}`} />
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col gap-3 pt-2">
        {/* Top row: Try Again and (optionally) Practice More side by side */}
        <div className={`grid grid-cols-1 ${hidePracticeMore ? '' : 'sm:grid-cols-2'} gap-3`}>
          <button onClick={onRetry} className="w-full py-5 bg-slate-100 text-slate-700 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-200 transition-all">Try Again</button>
          {/* "Practice More" sends the student to the harder question set */}
          {!hidePracticeMore && (
            <button onClick={onPracticeMore} className="w-full py-5 bg-slate-50 text-slate-700 border border-slate-200 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center justify-center gap-3">
              Practice More <NotebookPen size={18} />
            </button>
          )}
        </div>
        {/* Continue moves the student on to the next topic or overview */}
        <button onClick={onContinue} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-xl">
          Continue <ArrowRight size={18} />
        </button>
      </div>
    </motion.div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

// ── Supabase progress helpers (copy-paste to every topic file, change TOPIC_ID only) ──

// These three constants identify exactly which row in the database belongs to this topic.
// If you copy this file for a new topic, only these values need to change.
const SUBJECT = 'Algebra'
const GRADE = 10
const TOPIC_ID = 'intro-to-equations'

// Reads the student's saved mastery level for this topic from the database.
// Returns 'not-started' when no row exists yet (first visit).
async function loadTopicProgress(studentId: number): Promise<TopicStatus> {
  const m = await _loadProgress(studentId, SUBJECT, GRADE, TOPIC_ID)
  if (m === 'mastered') return 'mastered'
  if (m === 'needs_practice') return 'needs-practice'
  return 'not-started'
}



// Writes (or updates) the student's progress row in the database.
// upsert means "insert if the row doesn't exist, otherwise update it".
// onConflict tells Supabase which columns form the unique key so it knows
// whether to insert or update.
async function saveTopicProgress(studentId: number, schoolId: number, status: TopicStatus, correct: number, total: number, attempts: number) {
  const ml = status === 'mastered' ? 'mastered' : status === 'needs-practice' ? 'needs_practice' : 'not_started'
  await _saveProgress(studentId, schoolId, SUBJECT, GRADE, TOPIC_ID, ml, correct, total, attempts)
}



// The ID for the next topic so we can load its progress status and display it
// in the overview list on this page.
const SIMULTANEOUS_TOPIC_ID = 'simultaneous-equations'

// Same pattern as loadTopicProgress but for the Simultaneous Equations topic.
// Kept separate because this page needs to show the status of both topics.
async function loadSimultaneousProgress(studentId: number): Promise<TopicStatus> {
  const m = await _loadProgress(studentId, SUBJECT, GRADE, SIMULTANEOUS_TOPIC_ID)
  if (m === 'mastered') return 'mastered'
  if (m === 'needs_practice') return 'needs-practice'
  return 'not-started'
}



// LinearEquationsPage is the top-level component for this route.
// It owns all the view-switching logic and progress tracking for the whole lesson flow.
// user and onNavigate come from withAuth — the wrapper that ensures the student is logged in.
function LinearEquationsPage({ onNavigate }: { onNavigate: (page: any) => void }) {
  // view controls which screen is currently rendered (overview, lesson, practice, etc.).
  // The student starts on the overview so they can see all available topics.
  const [view, setView] = useState<ViewState>('overview')

  // previousView remembers which practice screen the student just came from
  // (regular practice vs. harder practice) so the feedback screen can decide
  // whether to show the "Practice More" button.
  const [previousView, setPreviousView] = useState<ViewState | null>(null)

  // status is the mastery level of this (intro) topic, loaded from the database.
  const [status, setStatus] = useState<TopicStatus>('not-started')

  // simultaneousStatus is the mastery level of the next topic, shown in the overview list.
  const [simultaneousStatus, setSimultaneousStatus] = useState<TopicStatus>('not-started')

  // practiceResult stores the score from the most recent practice round so the
  // feedback screen can display it. null before any round is completed.
  const [practiceResult, setPracticeResult] = useState<{ correct: number; total: number } | null>(null)

  // attempts counts how many times the student has completed a practice round.
  // This is stored in the database so we can track engagement over time.
  const [attempts, setAttempts] = useState(0)

  // When the component first mounts (or when user changes), load both topics'
  // progress from the database so the overview cards show the correct status badges.
  useEffect(() => {
    if (!session) return
    loadTopicProgress(session?.student_id ?? 0).then(s => setStatus(s))
    loadSimultaneousProgress(session?.student_id ?? 0).then(s => setSimultaneousStatus(s))
  }, [session])

  // Helper called after every completed practice round to persist the new status.
  // Increments attempts locally first so we don't wait for a re-render.
  const saveProgress = async (newStatus: TopicStatus, res: { correct: number; total: number }) => {
    const nextAttempts = attempts + 1
    setAttempts(nextAttempts)
    if (session) await saveTopicProgress(session.student_id, session.school_id, newStatus, res.correct, res.total, nextAttempts)
  }

  // Called by PracticeModule when the student finishes the initial question set.
  // If they scored 0, send them to remediation instead of feedback.
  // Otherwise, calculate mastery and go straight to the feedback screen.
  const handlePracticeComplete = async (res: { correct: number; total: number }) => {
    setPracticeResult(res)
    setPreviousView('practice')
    if (res.correct === 0) {
      setView('remediation')
    } else {
      const newStatus: TopicStatus = res.correct / res.total >= 2 / 3 ? 'mastered' : 'needs-practice'
      setStatus(newStatus)
      await saveProgress(newStatus, res)
      setView('feedback')
    }
  }

  // Called by PracticeModule when the student finishes the remediation questions.
  // Always goes to feedback (no second remediation loop).
  const handleRemediationComplete = async (res: { correct: number; total: number }) => {
    setPracticeResult(res)
    setPreviousView('remediation')
    const newStatus: TopicStatus = res.correct / res.total >= 2 / 3 ? 'mastered' : 'needs-practice'
    setStatus(newStatus)
    await saveProgress(newStatus, res)
    setView('feedback')
  }

  // Called by PracticeModule when the student finishes the harder "practice more" questions.
  // Sets previousView to 'practice-more' so the feedback screen hides the "Practice More" button
  // (no point offering it again after they've already done it).
  const handlePracticeMoreComplete = async (res: { correct: number; total: number }) => {
    setPracticeResult(res)
    setPreviousView('practice-more')
    const newStatus: TopicStatus = res.correct / res.total >= 2 / 3 ? 'mastered' : 'needs-practice'
    setStatus(newStatus)
    await saveProgress(newStatus, res)
    setView('feedback')
  }

  return (
    <div className="min-h-screen selection:bg-slate-100" style={{ background: 'oklch(98.5% 0.005 80)' }}>
      {/* Shared site header — passing currentPage tells it which nav item to highlight */}

      <main className="pt-28 pb-24 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">

          {/* The overview screen is wider (max-w-4xl) than the lesson screens (max-w-2xl),
              so we switch layout based on which view is active. */}
          {view === 'overview' ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">

              {/* Page heading */}
              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Linear Equations · Grade 10 · Term 1</p>
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Topics</h1>
              </div>

              {/* Topic list — each card navigates to a different topic */}
              <div className="space-y-3">
                {/* Topic 1 card: Intro to Equations — starts the lesson flow on this page */}
                <motion.div
                  onClick={() => setView('interactive-lesson')}
                  className="bg-white rounded-xl border border-slate-200 p-7 md:p-9 flex items-center justify-between gap-6 cursor-pointer hover:border-slate-300 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-6">
                    {/* Number badge turns green with a tick when the topic is mastered */}
                    <div className={`shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-[1.25rem] flex items-center justify-center text-2xl font-black ${status === 'mastered' ? 'bg-slate-500 text-white' : 'bg-slate-900 text-white shadow-md shadow-slate-900/10'}`}>
                      {status === 'mastered' ? '✓' : '1'}
                    </div>
                    <div>
                      <p className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">{TOPIC.title}</p>
                      <p className="text-sm text-slate-400 mt-1">{TOPIC.description}</p>
                      {/* Status label colour changes based on current mastery level */}
                      <p className={`text-[10px] font-black uppercase tracking-widest mt-2 ${status === 'mastered' ? 'text-slate-600' : status === 'needs-practice' ? 'text-slate-600' : 'text-slate-300'}`}>
                        {status === 'mastered' ? '✦ Mastered' : status === 'needs-practice' ? '◉ Needs Practice' : '○ Not Started'}
                      </p>
                    </div>
                  </div>
                  {/* Arrow icon gets darker on hover to hint the card is clickable */}
                  <ChevronRight size={28} className="text-slate-200 group-hover:text-slate-900 transition-colors shrink-0" />
                </motion.div>

                {/* Topic 2 card: Simultaneous Equations — navigates to a different page entirely */}
                <motion.div
                  onClick={() => onNavigate('learning-algebra-g10-t1-simultaneous' as AppPage)}
                  className="bg-white rounded-xl border border-slate-200 p-7 md:p-9 flex items-center justify-between gap-6 cursor-pointer hover:border-slate-300 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-6">
                    <div className={`shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-[1.25rem] flex items-center justify-center text-2xl font-black ${simultaneousStatus === 'mastered' ? 'bg-slate-500 text-white' : 'bg-slate-900 text-white shadow-md shadow-slate-900/10'}`}>
                      {simultaneousStatus === 'mastered' ? '✓' : '2'}
                    </div>
                    <div>
                      <p className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Simultaneous Equations</p>
                      <p className="text-sm text-slate-400 mt-1">Solve two equations with two unknowns using substitution.</p>
                      <p className={`text-[10px] font-black uppercase tracking-widest mt-2 ${simultaneousStatus === 'mastered' ? 'text-slate-600' : simultaneousStatus === 'needs-practice' ? 'text-slate-600' : 'text-slate-300'}`}>
                        {simultaneousStatus === 'mastered' ? '✦ Mastered' : simultaneousStatus === 'needs-practice' ? '◉ Needs Practice' : '○ Not Started'}
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={28} className="text-slate-200 group-hover:text-slate-900 transition-colors shrink-0" />
                </motion.div>
              </div>
            </motion.div>

          ) : (
            // All non-overview screens share this narrower layout with a back button.
            <div className="max-w-2xl mx-auto">
              {/* Top navigation row: back button and subject badge */}
              <div className="flex items-center justify-between mb-10">
                <button onClick={() => setView('overview')} className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all">
                  <ChevronLeft size={18} /> Back
                </button>
                <div className="px-4 py-2 bg-white border border-slate-200 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  Algebra · Grade 10
                </div>
              </div>

              {/* AnimatePresence + key={view} animates the transition between screens.
                  When view changes, the old screen exits left and the new one enters from the right. */}
              <AnimatePresence mode="wait">
                <motion.div key={view} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                  {/* Render the correct sub-component based on the current view */}
                  {view === 'interactive-lesson' && <InteractiveLesson onComplete={() => setView('guided-practice')} />}
                  {view === 'guided-practice' && <GuidedPracticeModule onComplete={() => setView('practice')} />}
                  {view === 'practice' && <PracticeModule questions={TOPIC.initialQuestions} onComplete={handlePracticeComplete} />}
                  {view === 'practice-more' && <PracticeModule questions={TOPIC.hardQuestions} onComplete={handlePracticeMoreComplete} />}
                  {view === 'remediation' && (
                    <div className="space-y-6">
                      {/* Encouragement banner shown above the remediation questions */}
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex gap-4 items-start">
                        <AlertCircle className="text-slate-500 shrink-0 mt-0.5" size={24} />
                        <div>
                          <p className="text-base font-black text-slate-900 uppercase tracking-tight mb-1">Let's Try Again</p>
                          <p className="text-slate-700 text-xs leading-relaxed">It's okay! Let's work through two extra questions to build your confidence.</p>
                        </div>
                      </div>
                      {/* Simpler questions to rebuild understanding before another attempt */}
                      <PracticeModule questions={TOPIC.remediationQuestions} onComplete={handleRemediationComplete} />
                    </div>
                  )}
                  {view === 'feedback' && (
                    // practiceResult could technically be null if feedback is shown before
                    // any practice, so we fall back to 0 / question count safely.
                    <FeedbackModule
                      correct={practiceResult?.correct ?? 0}
                      total={practiceResult?.total ?? (previousView === 'practice-more' ? TOPIC.hardQuestions.length : TOPIC.initialQuestions.length)}
                      // Retry restarts from the very beginning of the lesson.
                      onRetry={() => setView('interactive-lesson')}
                      // Practice More sends the student to the harder question set.
                      onPracticeMore={() => setView('practice-more')}
                      // Continue returns to the topic overview.
                      onContinue={() => setView('overview')}
                      // Hide the Practice More button if they already completed the harder set.
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

// withAuth wraps the page so unauthenticated users are redirected before
// LinearEquationsPage ever renders. The wrapped component is the default export.
export default LinearEquationsPage
