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
  const [imgLoaded, setImgLoaded] = useState(false);

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
    <div className="student-home min-h-full pb-16">

      {/* ═══ Hero — full-width crested banner ═══════════════════════ */}
      <div className="relative overflow-hidden bg-brand-dark border-b border-brand-border grain-surface flex flex-col justify-end min-h-[220px] sm:min-h-[260px] lg:min-h-[280px]">
        <div className="absolute inset-0 pointer-events-none">
          <motion.img src="/images/nizamiye-library.png" alt=""
            onLoad={() => setImgLoaded(true)}
            initial={{ opacity: 0 }} animate={{ opacity: imgLoaded ? 0.62 : 0 }}
            transition={{ duration: 0.6, ease }}
            className="w-full h-full object-cover" />
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(100deg, rgba(21,23,28,0.82) 0%, rgba(21,23,28,0.62) 35%, rgba(21,23,28,0.3) 62%, rgba(21,23,28,0.66) 100%)' }} />
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(180deg, rgba(21,23,28,0.05) 0%, transparent 35%, rgba(21,23,28,0.75) 100%)' }} />
        </div>
        <div className="absolute -bottom-32 -left-24 w-[24rem] h-[24rem] rounded-full blur-3xl opacity-[0.08] pointer-events-none"
          style={{ background: 'radial-gradient(circle, var(--color-accent), transparent 70%)' }} />

        <div className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-8 sm:pt-11 pb-8 sm:pb-10 w-full">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }}>
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-white/45">{child.name} {child.surname}</p>
            <h1 className="font-display font-extrabold text-white text-[28px] sm:text-[36px] mt-2 leading-[1.1]" style={{ letterSpacing: '-0.02em', textShadow: '0 2px 20px rgba(0,0,0,0.35)' }}>
              Homework
            </h1>
          </motion.div>
        </div>
      </div>

      {/* ═══ Body ═════════════════════════════════════════════════ */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 relative z-10 space-y-5 sm:space-y-6 pt-6 sm:pt-8">

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
            {upcoming.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease }}
                className="paper-card rounded overflow-hidden">
                <div className="px-5 py-3" style={{ borderBottom: '1px solid var(--color-brand-border)' }}>
                  <h2 className="text-[15px] font-semibold text-brand-dark">Upcoming & Today</h2>
                </div>
                {upcoming.map((e) => <Row key={e.id} e={e} />)}
              </motion.div>
            )}
            {past.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease, delay: 0.1 }}
                className="paper-card rounded overflow-hidden">
                <div className="px-5 py-3" style={{ borderBottom: '1px solid var(--color-brand-border)' }}>
                  <h2 className="text-[15px] font-semibold text-brand-dark">Past</h2>
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
