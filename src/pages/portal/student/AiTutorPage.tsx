// ── AiTutorPage — standalone AI Tutor hub ─────────────────────────────────────
// Top-level nav destination (sidebar "AI Tutor" item). Unlike the contextual
// entry points on Library lesson pages and Topic Test results (which already
// know the subject/topic from the page the student was on), this page has no
// page-context to inherit — the student picks a subject and topic here first,
// then the exact same AiTutorChat/aiTutor.ts engine takes over. A "General"
// option skips topic selection entirely for open-ended questions.

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
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
    <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-16">
      <h1 className="text-brand-dark text-[30px] sm:text-[36px] leading-tight" style={{ fontWeight: 600 }}>
        <span className="relative inline-block">
          <span className="text-transparent bg-clip-text bg-linear-to-r from-sky-500 via-sky-600 to-blue-600">
            AI Study Helper
          </span>
          <svg aria-hidden="true" viewBox="0 0 320 14" className="absolute left-0 -bottom-1 w-full h-3 text-amber-500/70" preserveAspectRatio="none">
            <path d="M2 9C60 3 180 2 318 8" stroke="currentColor" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          </svg>
        </span>
      </h1>
      <p className="text-[14px] text-muted mt-1 mb-6">
        Pick a subject and topic to start, or ask a general question. I'm bounded to our CAPS-aligned course
        content and I won't just hand you direct answers to graded work or past papers.
      </p>

      {/* Ask anything — always-visible hero action, not just another row in the list */}
      <button
        onClick={() => openChat(null, null, 'General question')}
        className="w-full paper-card rounded p-5 sm:p-6 flex items-center justify-between gap-4 mb-6 text-left transition-colors"
      >
        <div className="min-w-0">
          <p className="text-[17px] font-semibold" style={{ color: 'var(--color-navy)' }}>Just ask a general question</p>
          <p className="text-muted text-[13px] mt-0.5">No specific subject — start chatting right away</p>
        </div>
        <ChevronRight className="w-5 h-5 shrink-0" style={{ color: 'var(--color-navy)' }} />
      </button>

      <AnimatePresence mode="wait">
        {view.level === 'subjects' && (
          <motion.div
            key="subjects"
            initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.22, ease: EASE }}
          >
            <span className="relative inline-block mb-3">
              <span className="text-[12px] text-muted-2">Pick a subject</span>
              <svg aria-hidden="true" viewBox="0 0 140 8" className="absolute left-0 -bottom-1 w-full h-2 text-sky-400/60" preserveAspectRatio="none">
                <path d="M1 5C30 2 80 1 139 4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
              </svg>
            </span>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {subjectsWithTopics.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setView({ level: 'topics', subjectId: s.id, subjectName: s.name })}
                  className="paper-card rounded p-4 text-left hover:border-accent transition-colors"
                >
                  <p className="text-sm font-bold text-brand-dark truncate">{s.name}</p>
                  <p className="text-[11px] text-stone-500 mt-0.5">{s.category}</p>
                </button>
              ))}
            </div>

            <p className="text-[11px] text-stone-400 text-center pt-4">
              Don't see your subject listed yet? Use "Just ask a general question" above instead — I can still
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
              className="flex items-center gap-1 text-xs font-semibold mb-4"
              style={{ color: 'var(--color-accent-soft)' }}
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Back
            </button>
            <span className="relative inline-block mb-3">
              <span className="text-[12px] text-muted-2">{view.subjectName}</span>
              <svg aria-hidden="true" viewBox="0 0 140 8" className="absolute left-0 -bottom-1 w-full h-2 text-sky-400/60" preserveAspectRatio="none">
                <path d="M1 5C30 2 80 1 139 4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
              </svg>
            </span>
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
                    <p className="text-[11px] text-muted-2">Term {t.term}</p>
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
