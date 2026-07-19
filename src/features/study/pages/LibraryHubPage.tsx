// ── LibraryHubPage — minimal browsing hub: subjects -> topics ─────────────────
// Only "The Real Number System" (Algebra, Grade 10, Term 1) is a real, clickable
// lesson right now. Everything else shows as "Coming soon" rather than a dead
// link, since the library will grow topic-by-topic from here.

import { useEffect, useState } from 'react';
import { BookOpen, Lock, CheckCircle2, RotateCcw } from 'lucide-react';
import { subjects } from '../data/subjects';
import { loadTopicProgress, type MasteryLevel } from '../../../lib/studyProgress';
import { useStudySession } from '../../../providers/StudySessionContext';

const TOPIC1 = {
  subject: 'algebra',
  grade: 10,
  term: 1,
  topicId: 'real-number-system',
  topicName: 'The Real Number System',
  routeId: 'learning-algebra-g10-t1-real-number-system',
};

const MASTERY_BADGE: Record<MasteryLevel, { label: string; cls: string; icon: typeof CheckCircle2 }> = {
  mastered: { label: 'Mastered', cls: 'text-emerald-600 bg-emerald-50 border-emerald-200', icon: CheckCircle2 },
  needs_practice: { label: 'Needs practice', cls: 'text-amber-600 bg-amber-50 border-amber-200', icon: RotateCcw },
  not_started: { label: 'Not started', cls: 'text-stone-400 bg-stone-50 border-stone-200', icon: BookOpen },
};

export default function LibraryHubPage({
  onNavigate,
}: {
  session: { student_id: number; school_id: number };
  onNavigate: (page: string) => void;
}) {
  const session = useStudySession();
  const [mastery, setMastery] = useState<MasteryLevel>('not_started');

  useEffect(() => {
    if (!session) return;
    loadTopicProgress(session.student_id, TOPIC1.subject, TOPIC1.grade, TOPIC1.topicId).then(setMastery);
  }, [session]);

  const badge = MASTERY_BADGE[mastery];
  const BadgeIcon = badge.icon;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-stone-400 mb-1.5">Study Library</p>
        <h1 className="text-2xl font-black text-[#1e293b] tracking-tight">Choose a topic to study</h1>
        <p className="text-[13px] text-stone-500 mt-1.5">Grade 10, Term 1. More subjects and topics are added regularly.</p>
      </div>

      <div className="space-y-6">
        {subjects.map(subject => {
          const isAlgebra = subject.id === 'algebra';
          return (
            <div key={subject.id} className="rounded-2xl border border-stone-200 bg-white overflow-hidden">
              <div className="px-5 py-3.5 border-b border-stone-100 bg-stone-50/60">
                <p className="text-[13px] font-black text-stone-800">{subject.name}</p>
              </div>
              <div className="px-5 py-4">
                {isAlgebra ? (
                  <button
                    onClick={() => onNavigate(TOPIC1.routeId)}
                    className="w-full flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl border border-stone-200 hover:border-stone-300 hover:bg-stone-50/60 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-[#1e293b] flex items-center justify-center shrink-0">
                        <BookOpen className="w-3.5 h-3.5 text-white" />
                      </span>
                      <div>
                        <p className="text-[13.5px] font-bold text-stone-800">{TOPIC1.topicName}</p>
                        <p className="text-[11px] text-stone-400">Term 1 · ~20-30 min</p>
                      </div>
                    </div>
                    <span className={`flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg border shrink-0 ${badge.cls}`}>
                      <BadgeIcon className="w-3 h-3" /> {badge.label}
                    </span>
                  </button>
                ) : (
                  <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl border border-dashed border-stone-200 text-stone-400">
                    <Lock className="w-3.5 h-3.5 shrink-0" />
                    <p className="text-[13px] font-medium">Topics coming soon</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
