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
      <div className="relative overflow-hidden">
        <div className="relative max-w-3xl mx-auto px-5 sm:px-8 pt-8 sm:pt-11 pb-6 sm:pb-8 w-full">
          <p className="text-[12px] text-[rgba(31,36,33,0.5)] font-medium">Homeroom</p>
          <h1 className="text-brand-dark text-[32px] sm:text-[42px] leading-[1.12] mt-2"
            style={{ fontFamily: 'var(--font-instrument)', fontWeight: 500, letterSpacing: '-0.02em' }}>
            Guidance
          </h1>
          <p className="text-[13px] text-[rgba(31,36,33,0.55)] mt-2.5 font-medium max-w-lg">
            Short, practical guidance for common situations — what to notice, what to say, and when to involve others.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-8 relative z-10 space-y-5 pt-2 sm:pt-3">
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
      <button onClick={onBack} className="flex items-center gap-1.5 text-[13px] font-bold text-stone-500 hover:text-brand-dark transition-colors">
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
