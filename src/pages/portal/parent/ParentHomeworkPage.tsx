import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ClipboardCheck, Check, X as XIcon } from 'lucide-react';
import { fetchStudentEvents, fetchStudentCompletions, type SchoolEvent } from '../../../lib/events';
import { supabaseAdmin } from '../../../lib/supabase';
import type { ParentSession } from '../../../lib/auth';
import type { ParentChild } from '../../../lib/parents';
import { Shimmer } from '../../../shared/components/Shimmer';

const ease = [0.23, 1, 0.32, 1] as [number, number, number, number];

interface ParentHomeworkPageProps {
  session: ParentSession;
  child: ParentChild;
}

function formatDate(d: string) {
  return new Date(d + 'T00:00:00').toLocaleDateString('en-ZA', { weekday: 'short', day: 'numeric', month: 'short' });
}

export default function ParentHomeworkPage({ session, child }: ParentHomeworkPageProps) {
  const [events, setEvents] = useState<SchoolEvent[]>([]);
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data: links } = await supabaseAdmin
        .from('teacher_students')
        .select('subject_id')
        .eq('student_id', child.student_id);
      const subjectIds = [...new Set((links ?? []).map((l: any) => l.subject_id as number))];

      const now = new Date();
      const thisMonth = await fetchStudentEvents(
        session.school_id, child.student_id, child.grade, child.cohort_id, subjectIds,
        now.getFullYear(), now.getMonth() + 1
      );
      const nextMonthDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      const nextMonth = await fetchStudentEvents(
        session.school_id, child.student_id, child.grade, child.cohort_id, subjectIds,
        nextMonthDate.getFullYear(), nextMonthDate.getMonth() + 1
      );

      const homework = [...thisMonth, ...nextMonth]
        .filter((e) => e.event_type === 'homework')
        .sort((a, b) => a.event_date.localeCompare(b.event_date));

      const done = await fetchStudentCompletions(child.student_id, session.school_id);

      setEvents(homework);
      setCompleted(done);
      setLoading(false);
    };
    load();
  }, [child.student_id, session.school_id]);

  const today = new Date().toISOString().slice(0, 10);
  const upcoming = events.filter((e) => e.event_date >= today);
  const past = events.filter((e) => e.event_date < today);
  const pastDone = past.filter((e) => completed.has(e.id)).length;
  const pastCompletionPct = past.length > 0 ? Math.round((pastDone / past.length) * 100) : null;

  const Row = ({ e }: { e: SchoolEvent }) => {
    const isDone = completed.has(e.id);
    return (
      <div className="flex items-start gap-3 px-5 py-4" style={{ borderBottom: '1px solid var(--color-paper-raise)' }}>
        <div className={`w-8 h-8 rounded flex items-center justify-center shrink-0 ${isDone ? 'bg-green-50 text-green-700' : 'bg-stone-100 text-stone-400'}`}>
          {isDone ? <Check className="w-4 h-4" /> : <XIcon className="w-4 h-4" />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[14px] font-semibold text-brand-dark">{e.title}</p>
            <span className="text-[12px] text-[rgba(31,36,33,0.35)] whitespace-nowrap">{formatDate(e.event_date)}</span>
          </div>
          {e.description && <p className="text-[13px] text-stone-600 mt-1">{e.description}</p>}
          <span className={`inline-block mt-1.5 text-[10px] font-black px-2 py-0.5 rounded-full ${
            isDone ? 'bg-green-50 text-green-700' : 'bg-stone-100 text-stone-500'
          }`}>
            {isDone ? 'Marked Done' : 'Not Marked Done'}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="student-home min-h-full pb-16 relative">

      {/* ═══ Hero ═══════════════════════════════════════════════ */}
      <div className="relative overflow-hidden">
        <div className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-8 sm:pt-11 pb-6 sm:pb-8 w-full">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }}>
            <p className="text-[12px] text-[rgba(31,36,33,0.5)] font-medium">{child.name} {child.surname}</p>
            <h1
              className="text-brand-dark text-[32px] sm:text-[42px] leading-[1.12] mt-2"
              style={{ fontFamily: 'var(--font-instrument)', fontWeight: 500, letterSpacing: '-0.02em' }}
            >
              Homework
            </h1>
          </motion.div>
        </div>
      </div>

      {/* ═══ Body ═════════════════════════════════════════════════ */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 relative z-10 space-y-5 sm:space-y-6 pt-2 sm:pt-3">

        {loading ? (
          <div className="space-y-2.5">
            {[0, 1, 2].map(i => (
              <div key={i} className="paper-card rounded p-5 flex items-center gap-4">
                <Shimmer className="w-8 h-8 rounded shrink-0" />
                <div className="flex-1 space-y-2">
                  <Shimmer className="h-3.5" style={{ width: `${50 - i * 6}%` }} />
                  <Shimmer className="h-3 w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="paper-card rounded flex flex-col items-center justify-center py-24 text-center">
            <ClipboardCheck className="w-10 h-10 text-stone-200 mb-4" />
            <p className="text-sm font-bold text-stone-500">No homework set.</p>
            <p className="text-xs text-stone-400 mt-1">Homework from teachers will appear here.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {pastCompletionPct !== null && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease }}
                className="paper-card rounded p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[rgba(31,36,33,0.45)] mb-1">Completion Rate</p>
                    <p className={`text-2xl font-black ${pastCompletionPct >= 80 ? 'text-emerald-600' : pastCompletionPct >= 50 ? 'text-amber-600' : 'text-red-500'}`}>
                      {pastCompletionPct}%
                    </p>
                  </div>
                  <p className="text-xs text-stone-500">{pastDone} of {past.length} past homework marked done</p>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden mt-3" style={{ background: 'var(--color-paper-raise)' }}>
                  <motion.div
                    initial={{ width: 0 }} animate={{ width: `${pastCompletionPct}%` }} transition={{ duration: 0.9, ease }}
                    className={`h-full rounded-full ${pastCompletionPct >= 80 ? 'bg-emerald-500' : pastCompletionPct >= 50 ? 'bg-amber-500' : 'bg-red-400'}`}
                  />
                </div>
              </motion.div>
            )}
            {upcoming.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease, delay: 0.06 }}
                className="paper-card rounded overflow-hidden">
                <div className="px-5 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid var(--color-brand-border)' }}>
                  <h2 className="text-[15px] font-semibold text-brand-dark">Upcoming & Today</h2>
                  <span className="text-[11px] font-bold text-stone-400">{upcoming.length}</span>
                </div>
                {upcoming.map((e) => <Row key={e.id} e={e} />)}
              </motion.div>
            )}
            {past.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease, delay: 0.12 }}
                className="paper-card rounded overflow-hidden">
                <div className="px-5 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid var(--color-brand-border)' }}>
                  <h2 className="text-[15px] font-semibold text-brand-dark">Past</h2>
                  <span className="text-[11px] font-bold text-stone-400">{past.length}</span>
                </div>
                {past.map((e) => <Row key={e.id} e={e} />)}
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
