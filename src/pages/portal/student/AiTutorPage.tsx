// ── AiTutorPage — standalone AI Tutor hub ─────────────────────────────────────
// Top-level nav destination (sidebar "AI Tutor" item). Unlike the contextual
// entry points on Library lesson pages and Topic Test results (which already
// know the subject/topic from the page the student was on), this page has no
// page-context to inherit — the student picks a subject and topic here first,
// then the exact same AiTutorChat/aiTutor.ts engine takes over. A "General"
// option skips topic selection entirely for open-ended questions.

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, ChevronRight, ChevronLeft, MessageCircleQuestion } from 'lucide-react';
import type { StudentSession } from '../../../lib/auth';
import { subjects } from '../../../features/study/data/subjects';
import { fallbackTopicsFor } from '../../../lib/aiTutor/fallbackTopics';
import { AiTutorChat } from '../../../features/aiTutor/AiTutorChat';

const EASE = [0.23, 1, 0.32, 1] as const;

interface AiTutorPageProps {
  session: StudentSession;
}

type View = { level: 'subjects' } | { level: 'topics'; subjectId: string; subjectName: string };

export default function AiTutorPage({ session }: AiTutorPageProps) {
  const [view, setView] = useState<View>({ level: 'subjects' });
  const [chat, setChat] = useState<{
    subject: string | null; topicKey: string | null; topicLabel: string | null;
  } | null>(null);

  const subjectsWithTopics = useMemo(
    () => subjects.filter((s) => fallbackTopicsFor(s.id, session.grade).length > 0),
    [session.grade],
  );

  function openChat(subject: string | null, topicKey: string | null, topicLabel: string | null) {
    setChat({ subject, topicKey, topicLabel });
  }

  return (
    <div className="student-home min-h-full">
    <div className="max-w-[1300px] mx-auto px-4 sm:px-6 pt-6 pb-16">
      <div className="flex items-center gap-2.5 mb-1">
        <Bot className="w-5 h-5 text-brand-dark" />
        <h1
          className="text-brand-dark text-[28px] sm:text-[34px] leading-[1.15]"
          style={{ fontFamily: 'var(--font-instrument)', fontWeight: 500, letterSpacing: '-0.02em' }}
        >
          AI Study Helper
        </h1>
      </div>
      <p className="text-[13px] text-stone-500 mb-6">
        Pick a subject and topic to start, or ask a general question. I'm bounded to our CAPS-aligned course
        content and I won't just hand you direct answers to graded work or past papers.
      </p>

      <AnimatePresence mode="wait">
        {view.level === 'subjects' && (
          <motion.div
            key="subjects"
            initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.22, ease: EASE }}
            className="space-y-2"
          >
            <button
              onClick={() => openChat(null, null, 'General question')}
              className="paper-card rounded w-full text-left p-4 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <MessageCircleQuestion className="w-4.5 h-4.5 text-brand-dark shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-bold text-brand-dark">Just ask a general question</p>
                  <p className="text-[11px] text-stone-500">No specific subject — start chatting right away</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-400 shrink-0" />
            </button>

            {subjectsWithTopics.map((s) => (
              <button
                key={s.id}
                onClick={() => setView({ level: 'topics', subjectId: s.id, subjectName: s.name })}
                className="paper-card rounded w-full text-left p-4 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-bold text-brand-dark truncate">{s.name}</p>
                  <p className="text-[11px] text-stone-500 mt-0.5">{s.category}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400 shrink-0" />
              </button>
            ))}

            <p className="text-[11px] text-stone-400 text-center pt-2">
              Don't see your subject listed yet? Choose "Just ask a general question" instead — I can still
              help, just without our verified course materials for that subject.
            </p>
          </motion.div>
        )}

        {view.level === 'topics' && (
          <motion.div
            key="topics"
            initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.22, ease: EASE }}
          >
            <button
              onClick={() => setView({ level: 'subjects' })}
              className="flex items-center gap-1 text-xs font-bold text-stone-500 hover:text-brand-dark mb-4"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Back
            </button>
            <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-2">{view.subjectName}</p>
            <div className="space-y-2">
              <button
                onClick={() => openChat(view.subjectId, null, `${view.subjectName} — general question`)}
                className="paper-card rounded w-full text-left p-4 flex items-center justify-between gap-3"
              >
                <p className="text-sm font-bold text-brand-dark">Ask about {view.subjectName} generally</p>
                <ChevronRight className="w-4 h-4 text-stone-400 shrink-0" />
              </button>
              {fallbackTopicsFor(view.subjectId, session.grade).map((t) => (
                <button
                  key={t.topicKey}
                  onClick={() => openChat(view.subjectId, t.topicKey, t.topicName)}
                  className="paper-card rounded w-full text-left p-4 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">Term {t.term}</p>
                    <p className="text-sm font-bold text-brand-dark truncate">{t.topicName}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-400 shrink-0" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AiTutorChat
        open={chat !== null}
        onClose={() => setChat(null)}
        studentId={session.student_id}
        schoolId={session.school_id}
        grade={session.grade}
        subject={chat?.subject ?? null}
        topicKey={chat?.topicKey ?? null}
        topicLabel={chat?.topicLabel ?? null}
        entryPoint="general"
      />
    </div>
    </div>
  );
}
