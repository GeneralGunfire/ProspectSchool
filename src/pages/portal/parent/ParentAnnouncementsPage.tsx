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

      {/* ═══ Header ═══════════════════════════════════════════════ */}
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-5">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }}>
          <p className="text-[12px] text-[rgba(31,36,33,0.5)] font-medium">{child.name} {child.surname}</p>
          <h1 className="text-brand-dark text-[30px] sm:text-[36px] leading-tight mt-1" style={{ fontWeight: 600 }}>
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-linear-to-r from-sky-500 via-sky-600 to-blue-600">
                Announcements
              </span>
              <svg aria-hidden="true" viewBox="0 0 320 14" className="absolute left-0 -bottom-1 w-full h-3 text-amber-500/70" preserveAspectRatio="none">
                <path d="M2 9C60 3 180 2 318 8" stroke="currentColor" strokeWidth="3.5" fill="none" strokeLinecap="round" />
              </svg>
            </span>
          </h1>
        </motion.div>
      </div>

      {/* ═══ Body ═════════════════════════════════════════════════ */}
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4">

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
                  <p className="text-[15px] text-brand-dark" style={{ fontWeight: 600 }}>Pinned</p>
                  <span className="flex-1 h-px bg-brand-border" />
                </div>
                <div className="space-y-2.5">
                  {pinned.map((a) => <Card key={a.id} a={a} />)}
                </div>
              </div>
            )}
            {unpinned.length > 0 && (
              <div>
                {pinned.length > 0 && (
                  <div className="flex items-center gap-2 mb-3">
                    <p className="text-[15px] text-brand-dark" style={{ fontWeight: 600 }}>Recent</p>
                    <span className="flex-1 h-px bg-brand-border" />
                  </div>
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
