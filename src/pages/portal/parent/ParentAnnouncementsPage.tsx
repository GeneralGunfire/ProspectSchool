import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Pin, Megaphone } from 'lucide-react';
import { fetchStudentAnnouncements, type Announcement } from '../../../lib/announcements';
import { supabaseAdmin } from '../../../lib/supabase';
import type { ParentSession } from '../../../lib/auth';
import type { ParentChild } from '../../../lib/parents';
import { Shimmer } from '../../../shared/components/Shimmer';

const ease = [0.23, 1, 0.32, 1] as [number, number, number, number];

interface ParentAnnouncementsPageProps {
  session: ParentSession;
  child: ParentChild;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 2)   return 'Just now';
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7)   return `${days}d ago`;
  return new Date(iso).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function ParentAnnouncementsPage({ session, child }: ParentAnnouncementsPageProps) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    supabaseAdmin
      .from('teacher_students')
      .select('subject_id')
      .eq('student_id', child.student_id)
      .then(({ data }) => {
        const subjectIds = [...new Set((data ?? []).map((r: any) => r.subject_id as number))];
        return fetchStudentAnnouncements(session.school_id, child.student_id, child.grade, child.cohort_id, subjectIds);
      })
      .then((data) => {
        setAnnouncements(data);
        setLoading(false);
      });
  }, [child.student_id, session.school_id]);

  const pinned = announcements.filter((a) => a.pinned);
  const unpinned = announcements.filter((a) => !a.pinned);

  const Card = ({ a }: { a: Announcement }) => (
    <div className="paper-card rounded px-5 py-4" style={a.pinned ? { borderLeft: '3px solid #f59e0b' } : undefined}>
      <div className="flex items-start justify-between gap-2 mb-1">
        <p className="text-sm font-black text-brand-dark leading-snug">{a.title}</p>
        {a.pinned && <Pin className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
      </div>
      {a.body && <p className="text-sm text-stone-600 mt-1 whitespace-pre-line">{a.body}</p>}
      <p className="text-[10px] text-stone-400 mt-2">
        {a.author_name} {a.author_surname}
        {a.author_role === 'admin' && <span className="ml-1 text-violet-400 font-bold">(Admin)</span>}
        {' · '}{timeAgo(a.created_at)}
      </p>
    </div>
  );

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
              Announcements
            </h1>
          </motion.div>
        </div>
      </div>

      {/* ═══ Body ═════════════════════════════════════════════════ */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 relative z-10 space-y-5 sm:space-y-6 pt-2 sm:pt-3">

        {loading ? (
          <div className="space-y-2">
            {[0, 1, 2].map(i => (
              <div key={i} className="paper-card rounded p-4">
                <Shimmer className="h-3 w-2/3 mb-3" />
                <Shimmer className="h-3 w-1/3" />
              </div>
            ))}
          </div>
        ) : announcements.length === 0 ? (
          <div className="paper-card rounded flex flex-col items-center justify-center py-24 text-center">
            <Megaphone className="w-10 h-10 text-stone-200 mb-4" />
            <p className="text-sm font-bold text-stone-500">No announcements yet.</p>
            <p className="text-xs text-stone-400 mt-1">The school and teachers will post updates here.</p>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease }}
            className="space-y-6">
            {pinned.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Pin className="w-3.5 h-3.5 text-amber-500" />
                  <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[rgba(31,36,33,0.45)]">Pinned</p>
                </div>
                <div className="space-y-2.5">
                  {pinned.map((a) => <Card key={a.id} a={a} />)}
                </div>
              </div>
            )}
            {unpinned.length > 0 && (
              <div>
                {pinned.length > 0 && (
                  <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[rgba(31,36,33,0.45)] mb-3">Recent</p>
                )}
                <div className="space-y-2.5">
                  {unpinned.map((a) => <Card key={a.id} a={a} />)}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
