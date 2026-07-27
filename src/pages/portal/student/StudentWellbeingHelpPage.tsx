import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronLeft } from 'lucide-react';
import type { StudentSession } from '../../../lib/auth';
import {
  NORMALISING_MESSAGE, HELP_HUB_INTRO, START_HERE_TOOLS, HELP_TOPICS,
  type HelpTopic, type MicroTool,
} from '../../../lib/wellbeingHelpContent';
import { CRISIS_RESOURCES } from '../../../lib/wellbeingCrisisResources';

const ease = [0.23, 1, 0.32, 1] as [number, number, number, number];

// Always-accessible — reachable from student nav regardless of homeroom,
// consent, or check-in state. Research: WELLBEING_HELP_EXPANSION_RESEARCH.md
// sections 1, 2, 6. Same content source (wellbeingHelpContent.ts) as the
// post-check-in screen, so "not gated" is structurally true, not just a UI
// claim.

interface StudentWellbeingHelpPageProps {
  session: StudentSession;
}

export default function StudentWellbeingHelpPage({}: StudentWellbeingHelpPageProps) {
  const [selectedTopic, setSelectedTopic] = useState<HelpTopic | null>(null);

  return (
    <div className="student-wellbeing-help student-home min-h-full pb-16 relative">

      {/* ═══ Header — same compact scale as Home/Announcements ═══ */}
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-5">
        <h1 className="text-brand-dark text-[30px] sm:text-[36px] leading-tight" style={{ fontWeight: 600 }}>
          <span className="relative inline-block">
            <span className="text-transparent bg-clip-text bg-linear-to-r from-sky-500 via-sky-600 to-blue-600">
              Tools that can help
            </span>
            <svg aria-hidden="true" viewBox="0 0 320 14" className="absolute left-0 -bottom-1 w-full h-3 text-amber-500/70" preserveAspectRatio="none">
              <path d="M2 9C60 3 180 2 318 8" stroke="currentColor" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            </svg>
          </span>
        </h1>
        <p className="text-[14px] text-muted mt-1">{HELP_HUB_INTRO}</p>
      </div>

      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4">
        {selectedTopic ? (
          <TopicDetail topic={selectedTopic} onBack={() => setSelectedTopic(null)} />
        ) : (
          <>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease }}
              className="paper-card rounded p-5 sm:p-6">
              <p className="text-[14px] text-stone-600 leading-relaxed">{NORMALISING_MESSAGE}</p>
            </motion.div>

            <Section title="Start here if you're not sure">
              <div className="space-y-2.5">
                {START_HERE_TOOLS.map(tool => <MicroToolCard key={tool.id} tool={tool} />)}
              </div>
            </Section>

            <Section title="Pick what fits">
              <div className="grid sm:grid-cols-2 gap-2.5">
                {HELP_TOPICS.map(topic => (
                  <button
                    key={topic.id}
                    onClick={() => setSelectedTopic(topic)}
                    className="paper-card rounded p-4 text-left hover:border-accent transition-colors"
                  >
                    <p className="text-[14px] font-bold text-brand-dark">{topic.label}</p>
                    <p className="text-[12px] text-stone-500 mt-1 line-clamp-2">{topic.intro}</p>
                  </button>
                ))}
              </div>
            </Section>

            <TalkToSomeoneBox />
          </>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease }}>
      <h2 className="text-[15px] text-brand-dark mb-3" style={{ fontWeight: 600 }}>{title}</h2>
      {children}
    </motion.div>
  );
}

function MicroToolCard({ tool }: { tool: MicroTool }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="paper-card rounded overflow-hidden">
      <button onClick={() => setExpanded(e => !e)} className="w-full flex items-center gap-3 p-4 text-left">
        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: 'var(--color-accent)' }} />
        <div className="flex-1 min-w-0">
          <p className="text-[13.5px] font-bold text-brand-dark">{tool.title}</p>
          <p className="text-[11.5px] text-stone-500">{tool.durationMinutes} min</p>
        </div>
        <ChevronDown className={`w-4 h-4 text-stone-400 shrink-0 transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden">
            <ol className="px-4 pb-4 pl-[3.25rem] space-y-1.5 list-decimal">
              {tool.steps.map((s, i) => (
                <li key={i} className="text-[13px] text-stone-600 leading-snug">{s}</li>
              ))}
            </ol>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TopicDetail({ topic, onBack }: { topic: HelpTopic; onBack: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease }}
      className="space-y-5">
      <button onClick={onBack} className="flex items-center gap-1.5 text-[13px] font-bold text-stone-500 hover:text-brand-dark transition-colors">
        <ChevronLeft className="w-4 h-4" /> Back to all topics
      </button>

      <div className="paper-card rounded p-5 sm:p-6 space-y-3">
        <h2 className="text-[18px] font-semibold text-brand-dark">{topic.label}</h2>
        <p className="text-[14px] text-stone-600 leading-relaxed">{topic.intro}</p>
        <p className="text-[13.5px] text-stone-600 leading-relaxed">{topic.psychoeducation}</p>
      </div>

      <Section title="Try one of these">
        <div className="space-y-2.5">
          {topic.microTools.map(tool => <MicroToolCard key={tool.id} tool={tool} />)}
        </div>
      </Section>

      <div className="rounded bg-amber-50 border border-amber-200 p-4">
        <p className="text-[13px] font-semibold text-amber-900 mb-1">If this keeps happening</p>
        <p className="text-[12.5px] text-amber-800 leading-relaxed">{topic.keepHappeningBox}</p>
      </div>

      <div className="rounded p-4" style={{ background: 'var(--color-paper-raise)', border: '1px solid var(--color-brand-border)' }}>
        <p className="text-[12px] font-bold uppercase tracking-wide text-stone-500 mb-1">A way to start the conversation</p>
        <p className="text-[13px] text-stone-600 italic leading-relaxed">{topic.talkToSomeoneBox}</p>
      </div>
    </motion.div>
  );
}

function TalkToSomeoneBox() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease }}
      className="paper-card rounded p-5 sm:p-6 space-y-3">
      <h2 className="text-[15px] font-semibold text-brand-dark">Talk to someone</h2>
      <p className="text-[13.5px] text-stone-600 leading-relaxed">
        These tools can help, but they're not a replacement for talking to someone if things feel heavy — your
        homeroom teacher, a parent/guardian, or a trusted adult are all good places to start.
      </p>
      <div className="space-y-2">
        {CRISIS_RESOURCES.map(r => (
          <a key={r.name} href={`tel:${r.phone}`}
            className="paper-card rounded flex items-center gap-3 p-3 hover:border-accent transition-colors">
            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: 'var(--color-accent)' }} />
            <div className="flex-1 min-w-0">
              <p className="text-[13.5px] font-bold text-brand-dark">{r.name}</p>
              <p className="text-[11.5px] text-stone-500">{r.description}</p>
            </div>
            <p className="text-[14px] font-black text-brand-dark shrink-0">{r.phoneDisplay}</p>
          </a>
        ))}
      </div>
    </motion.div>
  );
}
