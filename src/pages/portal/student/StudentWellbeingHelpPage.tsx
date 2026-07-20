import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HeartHandshake, ChevronDown, ChevronLeft, Phone, Sparkles } from 'lucide-react';
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
    <div className="student-home min-h-full pb-16 relative">
      <div className="relative overflow-hidden">
        <div className="relative max-w-3xl mx-auto px-5 sm:px-8 pt-8 sm:pt-11 pb-6 sm:pb-8 w-full">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }}
            className="flex items-center gap-2 min-w-0">
            <p className="text-[12px] text-[rgba(31,36,33,0.5)] font-medium truncate">Wellbeing Tools for Everyone</p>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease, delay: 0.06 }}
            className="text-brand-dark text-[32px] sm:text-[42px] leading-[1.12] mt-2 min-w-0"
            style={{ fontFamily: 'var(--font-instrument)', fontWeight: 500, letterSpacing: '-0.02em' }}>
            Tools that can help
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease, delay: 0.08 }}
            className="text-[13px] text-[rgba(31,36,33,0.55)] mt-2.5 font-medium max-w-lg">
            {HELP_HUB_INTRO}
          </motion.p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-8 relative z-10 space-y-5 pt-2 sm:pt-3">
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
      <h2 className="text-[13px] font-black uppercase tracking-wide text-stone-500 mb-3">{title}</h2>
      {children}
    </motion.div>
  );
}

function MicroToolCard({ tool }: { tool: MicroTool }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="paper-card rounded overflow-hidden">
      <button onClick={() => setExpanded(e => !e)} className="w-full flex items-center gap-3 p-4 text-left">
        <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-accent" />
        </div>
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

      <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
        <p className="text-[13px] font-semibold text-amber-900 mb-1">If this keeps happening</p>
        <p className="text-[12.5px] text-amber-800 leading-relaxed">{topic.keepHappeningBox}</p>
      </div>

      <div className="rounded-xl bg-stone-50 border border-brand-border p-4">
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
      <div className="flex items-center gap-2.5">
        <HeartHandshake className="w-4.5 h-4.5 text-accent" />
        <h2 className="text-[15px] font-semibold text-brand-dark">Talk to someone</h2>
      </div>
      <p className="text-[13.5px] text-stone-600 leading-relaxed">
        These tools can help, but they're not a replacement for talking to someone if things feel heavy — your
        homeroom teacher, a parent/guardian, or a trusted adult are all good places to start.
      </p>
      <div className="space-y-2">
        {CRISIS_RESOURCES.map(r => (
          <a key={r.name} href={`tel:${r.phone}`}
            className="flex items-center gap-3 p-3 rounded-xl bg-white border border-brand-border hover:border-accent transition-colors">
            <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
              <Phone className="w-4 h-4 text-accent" />
            </div>
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
