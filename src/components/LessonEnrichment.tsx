// ── LessonEnrichment — Four enrichment components for learning pages ──────────
// Design system: warm beige (#EEF2F7), stone palette, Emil Kowalski easing.

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { CheckCircle2, Lightbulb } from 'lucide-react'

const EASE = [0.23, 1, 0.32, 1] as const
const LABELS = ['A', 'B', 'C', 'D']

// ─── LearningOutcomes ─────────────────────────────────────────────────────────
export interface LearningOutcomesProps { outcomes: string[] }

export function LearningOutcomes({ outcomes }: LearningOutcomesProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE }}
      className="rounded-2xl border border-stone-200 bg-white overflow-hidden"
    >
      <div className="px-5 py-4 border-b border-stone-100">
        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-stone-400">
          By the end of this lesson
        </p>
      </div>
      <ul className="divide-y divide-stone-50">
        {outcomes.map((outcome, i) => (
          <li key={i} className="flex items-start gap-3 px-5 py-3.5">
            <span className="w-5 h-5 rounded-md bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            </span>
            <span className="text-[13px] font-medium text-stone-700 leading-snug">{outcome}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  )
}

// ─── KnowledgeCheck ───────────────────────────────────────────────────────────
export interface KnowledgeCheckProps {
  question: string
  options: string[]
  correctIndex: number
  explanation: string
  onAnswered?: () => void
}

export function KnowledgeCheck({ question, options, correctIndex, explanation, onAnswered }: KnowledgeCheckProps) {
  const [selected, setSelected] = useState<number | null>(null)
  const answered = selected !== null

  return (
    <div className="rounded-2xl border border-stone-200 bg-white overflow-hidden my-6">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-stone-100 bg-blue-50/60">
        <span className="w-5 h-5 rounded-md bg-blue-600 flex items-center justify-center shrink-0">
          <span className="text-[9px] font-black text-white">?</span>
        </span>
        <span className="text-[10px] font-black uppercase tracking-[0.22em] text-blue-700">Quick Check</span>
      </div>

      {/* Question */}
      <div className="px-5 py-4">
        <p className="text-[15px] font-black text-[#1e293b] leading-snug">{question}</p>
      </div>

      {/* Options — full-width rows */}
      <div className="px-5 pb-4 space-y-2">
        {options.map((opt, i) => {
          const isSelected = selected === i
          const isCorrect = i === correctIndex
          const label = LABELS[i]

          let containerCls = 'w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-left '
          let labelCls = 'w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-black shrink-0 transition-all '
          let textCls = 'text-[13px] font-medium leading-snug flex-1 '

          if (!answered) {
            containerCls += isSelected
              ? 'border-[#1e293b] bg-[#1e293b]'
              : 'border-stone-200 bg-stone-50/40 hover:border-stone-300 hover:bg-white'
            labelCls += isSelected ? 'bg-white text-[#1e293b]' : 'bg-stone-200 text-stone-500'
            textCls += isSelected ? 'text-white font-bold' : 'text-stone-700'
          } else if (isCorrect) {
            containerCls += 'border-emerald-300 bg-emerald-50'
            labelCls += 'bg-emerald-500 text-white'
            textCls += 'text-emerald-900 font-semibold'
          } else if (isSelected) {
            containerCls += 'border-red-200 bg-red-50'
            labelCls += 'bg-red-400 text-white'
            textCls += 'text-red-800'
          } else {
            containerCls += 'border-stone-100 bg-white'
            labelCls += 'bg-stone-100 text-stone-300'
            textCls += 'text-stone-300'
          }

          return (
            <button
              key={i}
              type="button"
              className={containerCls}
              onClick={() => { if (!answered) { setSelected(i); onAnswered?.() } }}
              disabled={answered}
            >
              <span className={labelCls}>{
                answered && isCorrect ? '✓' :
                answered && isSelected && !isCorrect ? '✗' :
                label
              }</span>
              <span className={textCls}>{opt}</span>
            </button>
          )
        })}
      </div>

      {/* Explanation */}
      <AnimatePresence>
        {answered && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="overflow-hidden"
          >
            <div className={`mx-5 mb-5 rounded-xl px-4 py-3.5 border ${
              selected === correctIndex
                ? 'bg-emerald-50 border-emerald-200/80'
                : 'bg-[#EEF2F7] border-stone-200/80'
            }`}>
              <p className={`text-[10px] font-black uppercase tracking-[0.18em] mb-1.5 ${
                selected === correctIndex ? 'text-emerald-600' : 'text-stone-400'
              }`}>
                {selected === correctIndex ? 'Correct!' : 'Explanation'}
              </p>
              <p className={`text-[13px] leading-relaxed ${
                selected === correctIndex ? 'text-emerald-800' : 'text-stone-700'
              }`}>
                {explanation}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── ExamTip ──────────────────────────────────────────────────────────────────
export interface ExamTipProps { tip: string }

export function ExamTip({ tip }: ExamTipProps) {
  return (
    <div className="rounded-2xl border border-blue-100 bg-blue-50/60 px-5 py-4 my-2">
      <div className="flex items-start gap-3">
        <div className="w-7 h-7 rounded-xl bg-blue-600 flex items-center justify-center shrink-0 mt-0.5">
          <Lightbulb className="w-3.5 h-3.5 text-white" />
        </div>
        <div>
          <span className="block text-[10px] font-black uppercase tracking-[0.22em] text-blue-700 mb-1">
            Exam Tip
          </span>
          <p className="text-[13px] text-stone-700 leading-relaxed">{tip}</p>
        </div>
      </div>
    </div>
  )
}

// ─── SummaryCard ─────────────────────────────────────────────────────────────
export interface SummaryCardProps { points: string[] }

export function SummaryCard({ points }: SummaryCardProps) {
  return (
    <div className="bg-[#1e293b] rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-stone-800">
        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-stone-500">
          Key Concepts to Remember
        </p>
      </div>
      <ul className="divide-y divide-stone-800/60">
        {points.map((point, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: i * 0.04, ease: EASE }}
            className="flex items-start gap-3 px-5 py-3"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-stone-600 shrink-0 mt-2" />
            <span className="text-[13px] text-stone-300 leading-relaxed">{point}</span>
          </motion.li>
        ))}
      </ul>
    </div>
  )
}
