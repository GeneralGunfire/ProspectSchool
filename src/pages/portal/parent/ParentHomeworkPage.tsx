import { useEffect, useState } from 'react';
import { ClipboardCheck, Check, X as XIcon } from 'lucide-react';
import { fetchStudentEvents, fetchStudentCompletions, type SchoolEvent } from '../../../lib/events';
import { supabaseAdmin } from '../../../lib/supabase';
import type { ParentSession } from '../../../lib/auth';
import type { ParentChild } from '../../../lib/parents';

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

  const Row = ({ e }: { e: SchoolEvent }) => {
    const isDone = completed.has(e.id);
    return (
      <div className="flex items-start gap-3 px-5 py-4 border-b border-stone-50 last:border-0">
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${isDone ? 'bg-green-50 text-green-700' : 'bg-stone-100 text-stone-400'}`}>
          {isDone ? <Check className="w-4 h-4" /> : <XIcon className="w-4 h-4" />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-bold text-brand-dark">{e.title}</p>
            <span className="text-xs text-stone-400 whitespace-nowrap">{formatDate(e.event_date)}</span>
          </div>
          {e.description && <p className="text-xs text-stone-500 mt-1">{e.description}</p>}
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
    <div className="px-4 py-6 sm:p-6 md:p-8 max-w-3xl w-full mx-auto">
      <div className="mb-6">
        <span className="eyebrow">{child.name} {child.surname}</span>
        <h1 className="text-2xl font-black text-brand-dark tracking-tight">Homework</h1>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-5 h-5 border-2 border-brand-border border-t-stone-700 rounded-full animate-spin" />
        </div>
      ) : events.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <ClipboardCheck className="w-10 h-10 text-stone-200 mb-4" />
          <p className="text-sm font-black text-stone-500 mb-1">No homework set.</p>
          <p className="text-xs text-stone-400">Homework from teachers will appear here.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {upcoming.length > 0 && (
            <div className="card-premium bg-white border border-brand-border rounded-[24px] overflow-hidden">
              <div className="px-5 py-3 border-b border-brand-border/60">
                <h2 className="text-sm font-black text-brand-dark">Upcoming & Today</h2>
              </div>
              {upcoming.map((e) => <Row key={e.id} e={e} />)}
            </div>
          )}
          {past.length > 0 && (
            <div className="card-premium bg-white border border-brand-border rounded-[24px] overflow-hidden">
              <div className="px-5 py-3 border-b border-brand-border/60">
                <h2 className="text-sm font-black text-brand-dark">Past</h2>
              </div>
              {past.map((e) => <Row key={e.id} e={e} />)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
