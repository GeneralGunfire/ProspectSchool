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
  const [imgLoaded, setImgLoaded] = useState(false);

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
    <div className={`paper-card rounded px-5 py-4 ${a.pinned ? 'border-amber-200' : ''}`}>
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
    <div className="student-home min-h-full pb-16">

      {/* ═══ Hero — full-width crested banner ═══════════════════════ */}
      <div className="relative overflow-hidden bg-brand-dark border-b border-brand-border grain-surface flex flex-col justify-end min-h-[220px] sm:min-h-[260px] lg:min-h-[280px]">
        <div className="absolute inset-0 pointer-events-none">
          <motion.img src="/images/nizamiye-announcements-banner.png" alt=""
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
              Announcements
            </h1>
          </motion.div>
        </div>
      </div>

      {/* ═══ Body ═════════════════════════════════════════════════ */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 relative z-10 space-y-5 sm:space-y-6 pt-6 sm:pt-8">

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
            className="space-y-3">
            {pinned.map((a) => <Card key={a.id} a={a} />)}
            {unpinned.map((a) => <Card key={a.id} a={a} />)}
          </motion.div>
        )}
      </div>
    </div>
  );
}
