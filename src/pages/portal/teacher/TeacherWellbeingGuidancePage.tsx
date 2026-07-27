import { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Info, ShieldAlert } from 'lucide-react';
import type { TeacherSession } from '../../../lib/auth';
import {
  TEACHER_GUIDANCE_TOPICS, type TeacherGuidanceTopic, type TeacherGuidanceTopicId,
} from '../../../lib/wellbeingTeacherGuidance';

const ease = [0.23, 1, 0.32, 1] as [number, number, number, number];

// Static reference content — research: WELLBEING_HELP_EXPANSION_RESEARCH.md
// section 4. Reached via drill-in from WellbeingHomeroomPage.tsx's "See
// tips" link (initialTopic), or a cold picker if opened without one.

interface TeacherWellbeingGuidancePageProps {
  session: TeacherSession;
  initialTopic?: TeacherGuidanceTopicId | null;
}

export default function TeacherWellbeingGuidancePage({ initialTopic }: TeacherWellbeingGuidancePageProps) {
  const [selected, setSelected] = useState<TeacherGuidanceTopic | null>(
    initialTopic ? TEACHER_GUIDANCE_TOPICS.find(t => t.id === initialTopic) ?? null : null,
  );

  return (
    <div className="student-home min-h-full pb-16 relative">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-5">
        <h1 className="text-brand-dark text-[30px] sm:text-[36px] leading-tight" style={{ fontWeight: 600 }}>
          <span className="relative inline-block">
            <span className="text-transparent bg-clip-text bg-linear-to-r from-sky-500 via-sky-600 to-blue-600">
              Guidance
            </span>
            <svg aria-hidden="true" viewBox="0 0 320 14" className="absolute left-0 -bottom-1 w-full h-3 text-amber-500/70" preserveAspectRatio="none">
              <path d="M2 9C60 3 180 2 318 8" stroke="currentColor" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            </svg>
          </span>
        </h1>
        <p className="text-[14px] text-muted mt-1 max-w-lg">
          Short, practical guidance for common situations — what to notice, what to say, and when to involve others.
        </p>
      </div>

      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4">
        {selected ? (
          <TopicDetail topic={selected} onBack={() => setSelected(null)} />
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {TEACHER_GUIDANCE_TOPICS.map(topic => (
              <button
                key={topic.id}
                onClick={() => setSelected(topic)}
                className="paper-card rounded p-4 text-left hover:border-accent transition-colors"
              >
                <p className="text-[14px] font-bold text-brand-dark">{topic.label}</p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TopicDetail({ topic, onBack }: { topic: TeacherGuidanceTopic; onBack: () => void }) {
  const s = topic.section;
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease }}
      className="space-y-5">
      <button onClick={onBack} className="flex items-center gap-1.5 text-[13px] font-semibold transition-colors" style={{ color: 'var(--color-navy)' }}>
        <ChevronLeft className="w-4 h-4" /> Back to all topics
      </button>

      <div className="paper-card rounded p-5 sm:p-6 space-y-4">
        <h2 className="text-[18px] font-semibold text-brand-dark">{topic.label}</h2>

        <div>
          <p className="text-[12px] font-bold uppercase tracking-wide text-stone-500 mb-1.5">What you might notice</p>
          <ul className="text-[13.5px] text-stone-600 space-y-1 list-disc list-inside">
            {s.whatYouMightNotice.map((line, i) => <li key={i}>{line}</li>)}
          </ul>
        </div>

        <div>
          <p className="text-[12px] font-bold uppercase tracking-wide text-stone-500 mb-1.5">What's likely going on</p>
          <p className="text-[13.5px] text-stone-600 leading-relaxed">{s.why}</p>
        </div>

        <div className="rounded-lg bg-stone-50 border border-brand-border p-3.5 space-y-2">
          <p className="text-[11px] font-black uppercase tracking-wide text-stone-500 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5" /> Conversation script
          </p>
          {s.script.map((line, i) => (
            <p key={i} className="text-[12.5px] text-stone-700 italic leading-snug">{line}</p>
          ))}
        </div>

        <div>
          <p className="text-[12px] font-bold uppercase tracking-wide text-stone-500 mb-1.5">Classroom supports</p>
          <ul className="text-[13.5px] text-stone-600 space-y-1 list-disc list-inside">
            {s.classroomSupports.map((line, i) => <li key={i}>{line}</li>)}
          </ul>
        </div>

        <div>
          <p className="text-[12px] font-bold uppercase tracking-wide text-stone-500 mb-1.5">When to involve others</p>
          <p className="text-[13.5px] text-stone-600 leading-relaxed">{s.whenToInvolveOthers}</p>
        </div>
      </div>

      <div className="rounded-xl bg-red-50 border border-red-200 p-4 flex gap-3">
        <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-[13px] font-semibold text-red-900 mb-1">If you're worried about safety</p>
          <p className="text-[12.5px] text-red-800 leading-relaxed">{s.safetyFlagBox}</p>
        </div>
      </div>

      <div className="rounded-xl bg-stone-50 border border-brand-border p-4">
        <p className="text-[12px] font-bold uppercase tracking-wide text-stone-500 mb-1.5">Remember</p>
        <ul className="text-[13px] text-stone-600 space-y-1 list-disc list-inside">
          {s.remember.map((line, i) => <li key={i}>{line}</li>)}
        </ul>
      </div>
    </motion.div>
  );
}
