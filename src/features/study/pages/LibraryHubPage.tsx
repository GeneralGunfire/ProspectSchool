// ── LibraryHubPage — Subject -> Term -> Topic drill-down, scoped to grade ─────
// Every list here is filtered by the logged-in student's grade via the topic
// registry (data/library/registry.ts), so a Grade 10 student never sees
// Grade 11/12 subjects, terms, or topics, and vice versa. Subjects/terms with
// no registered content for this grade render as "Coming soon" rather than a
// dead link — the library grows one topic at a time.
//
// Visually this page IS a page inside StudentDashboard's shell, so it adopts
// the same "premium paper" system StudentHomePage.tsx defines (`.student-home`
// root class + `.paper-card` tiles + the shared hero-strip band), rather than
// approximating it with ad-hoc Tailwind — that's what caused the visible
// seam/mismatch between this page and the dashboard.

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Lock, CheckCircle2, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { subjects } from '../data/subjects';
import { subjectsForGrade, termsForSubjectGrade, topicsForSubjectGradeTerm } from '../data/library/registry';
import { loadTopicProgress, type MasteryLevel } from '../../../lib/studyProgress';
import { useStudySession } from '../../../providers/StudySessionContext';

const EASE = [0.23, 1, 0.32, 1] as const;
const ALL_TERMS = [1, 2, 3, 4];

const MASTERY_BADGE: Record<MasteryLevel, { label: string; cls: string; icon: typeof CheckCircle2 }> = {
  mastered: { label: 'Mastered', cls: 'text-emerald-600 bg-emerald-50 border-emerald-200', icon: CheckCircle2 },
  needs_practice: { label: 'Needs practice', cls: 'text-amber-600 bg-amber-50 border-amber-200', icon: RotateCcw },
  not_started: { label: 'Not started', cls: 'text-stone-400 bg-stone-50 border-stone-200', icon: BookOpen },
};

type View =
  | { level: 'subjects' }
  | { level: 'terms'; subjectId: string }
  | { level: 'topics'; subjectId: string; term: number };

// ── Hero strip — copied verbatim from StudentAnnouncementsPage.tsx's hero
// (same wave-strip system as every other portal page), text parameterized,
// with an optional back button added for the drill-down levels. Do not
// adjust the gradient's bottom/opacity values independently of the other
// portal pages — they must all match exactly. ──────────────────────────────
function HeroStrip({
  eyebrow, title, subtitle, onBack, size = 'default',
}: {
  eyebrow: string; title: string; subtitle?: string; onBack?: () => void; size?: 'default' | 'large';
}) {
  const large = size === 'large';
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 pointer-events-none" style={{ bottom: '-220px',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.45) 40%, rgba(255,255,255,0.22) 75%, transparent 100%)' }} />

      <div className={`relative max-w-6xl mx-auto px-5 sm:px-8 w-full ${large ? 'pt-9 sm:pt-14 pb-7 sm:pb-10' : 'pt-8 sm:pt-11 pb-6 sm:pb-8'}`}>
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 -ml-1 mb-3 px-2 py-1.5 rounded text-[13px] font-bold text-[rgba(31,36,33,0.55)] hover:text-brand-dark hover:bg-white/60 active:scale-[0.97] transition-all"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
        )}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="flex items-center gap-2 min-w-0"
        >
          <p className={`text-[rgba(31,36,33,0.5)] font-medium truncate ${large ? 'text-[13px]' : 'text-[12px]'}`}>
            {eyebrow}
          </p>
        </motion.div>

        <div className="min-w-0 mt-2">
          <motion.h1
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.06 }}
            className={`text-brand-dark leading-[1.12] min-w-0 ${large ? 'text-[38px] sm:text-[52px]' : 'text-[32px] sm:text-[42px]'}`}
            style={{ fontFamily: 'var(--font-instrument)', fontWeight: 500, letterSpacing: '-0.02em' }}
          >
            {title}
          </motion.h1>
          {subtitle && (
            <p className={`text-[rgba(31,36,33,0.5)] mt-2.5 font-medium ${large ? 'text-[14px] sm:text-[15px]' : 'text-[13px]'}`}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function ChoiceCard({
  title, subtitle, onClick, disabled, trailing,
}: {
  title: string; subtitle: string; onClick?: () => void; disabled?: boolean; trailing?: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`paper-card rounded flex items-center justify-between gap-3 px-5 py-5 min-h-16 text-left w-full ${
        disabled ? 'opacity-60 cursor-default' : ''
      }`}
    >
      <div className="min-w-0">
        <p className={`text-[15px] font-bold truncate ${disabled ? 'text-[rgba(31,36,33,0.4)]' : 'text-brand-dark'}`}>{title}</p>
        <p className="text-[12px] text-[rgba(31,36,33,0.4)] mt-0.5">{subtitle}</p>
      </div>
      {trailing ?? (disabled
        ? <Lock className="w-4 h-4 text-[rgba(31,36,33,0.25)] shrink-0" />
        : <ChevronRight className="w-4.5 h-4.5 text-[rgba(31,36,33,0.25)] shrink-0" />)}
    </button>
  );
}

export default function LibraryHubPage({
  session,
  onNavigate,
}: {
  session: { student_id: number; school_id: number; grade: number };
  onNavigate: (page: string) => void;
}) {
  const studySession = useStudySession();
  const [progress, setProgress] = useState<Record<string, MasteryLevel>>({});
  const [view, setView] = useState<View>({ level: 'subjects' });

  const grade = session.grade;
  const availableSubjectIds = subjectsForGrade(grade);

  // This drill-down (subjects -> terms -> topics) is local state, not a
  // StudentDashboard `innerPage` change, so it needs its own scroll-to-top —
  // otherwise clicking into a subject/term can leave the page mid-scroll.
  useEffect(() => {
    document.querySelector('.student-dashboard-bg')?.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [view]);

  useEffect(() => {
    if (!studySession || view.level !== 'topics') return;
    const topics = topicsForSubjectGradeTerm(view.subjectId, grade, view.term);
    Promise.all(
      topics.map(t =>
        loadTopicProgress(studySession.student_id, t.subject, t.grade, t.topicId).then(m => [t.topicId, m] as const)
      )
    ).then(entries => setProgress(Object.fromEntries(entries)));
  }, [studySession, view, grade]);

  return (
    <div className="student-home min-h-full pb-16 relative">
      {view.level === 'subjects' && (
        <HeroStrip eyebrow={`Study Library · Grade ${grade}`} title="Choose a subject" subtitle="More subjects and topics are added regularly." />
      )}
      {view.level === 'terms' && (
        <HeroStrip
          eyebrow={`Study Library · Grade ${grade}`}
          title={subjects.find(s => s.id === view.subjectId)?.name ?? ''}
          subtitle="Choose a term to see its topics."
          onBack={() => setView({ level: 'subjects' })}
          size="large"
        />
      )}
      {view.level === 'topics' && (
        <HeroStrip
          eyebrow={subjects.find(s => s.id === view.subjectId)?.name ?? ''}
          title={`Term ${view.term}`}
          subtitle="Choose a topic to start studying."
          onBack={() => setView({ level: 'terms', subjectId: view.subjectId })}
          size="large"
        />
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-8 relative z-10 pt-6 sm:pt-8">
        <AnimatePresence mode="wait">
          {view.level === 'subjects' && (
            <motion.div
              key="subjects"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3"
            >
              {subjects.map(subject => {
                const hasContent = availableSubjectIds.includes(subject.id);
                return (
                  <ChoiceCard
                    key={subject.id}
                    title={subject.name}
                    subtitle={hasContent ? subject.category : 'Coming soon'}
                    disabled={!hasContent}
                    onClick={() => setView({ level: 'terms', subjectId: subject.id })}
                  />
                );
              })}
            </motion.div>
          )}

          {view.level === 'terms' && (
            <motion.div
              key="terms"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3"
            >
              {ALL_TERMS.map(term => {
                const hasContent = termsForSubjectGrade(view.subjectId, grade).includes(term);
                return (
                  <ChoiceCard
                    key={term}
                    title={`Term ${term}`}
                    subtitle={hasContent ? 'Ready to study' : 'Coming soon'}
                    disabled={!hasContent}
                    onClick={() => setView({ level: 'topics', subjectId: view.subjectId, term })}
                  />
                );
              })}
            </motion.div>
          )}

          {view.level === 'topics' && (
            <motion.div
              key="topics"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="space-y-3"
            >
              {(() => {
                const topics = topicsForSubjectGradeTerm(view.subjectId, grade, view.term);
                if (topics.length === 0) {
                  return (
                    <div className="paper-card rounded flex items-center gap-3 px-5 py-5 min-h-16 opacity-60">
                      <Lock className="w-4 h-4 text-[rgba(31,36,33,0.4)] shrink-0" />
                      <p className="text-[14px] font-medium text-[rgba(31,36,33,0.5)]">Topics coming soon</p>
                    </div>
                  );
                }
                return topics.map(topic => {
                  const mastery = progress[topic.topicId] ?? 'not_started';
                  const badge = MASTERY_BADGE[mastery];
                  const BadgeIcon = badge.icon;
                  return (
                    <button
                      key={topic.topicId}
                      onClick={() => onNavigate(topic.routeId)}
                      className="paper-card rounded w-full flex flex-col sm:flex-row sm:items-center items-stretch justify-between gap-3 px-5 py-5 min-h-18 text-left"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <span className="w-10 h-10 rounded-xl bg-brand-dark flex items-center justify-center shrink-0">
                          <BookOpen className="w-4 h-4 text-white" />
                        </span>
                        <div className="min-w-0">
                          <p className="text-[15px] font-bold text-brand-dark">{topic.topicName}</p>
                          <p className="text-[12px] text-[rgba(31,36,33,0.4)]">~{topic.estimatedMinutes[0]}-{topic.estimatedMinutes[1]} min</p>
                        </div>
                      </div>
                      <span className={`self-start sm:self-auto flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1.5 rounded-lg border shrink-0 ${badge.cls}`}>
                        <BadgeIcon className="w-3.5 h-3.5" /> {badge.label}
                      </span>
                    </button>
                  );
                });
              })()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
