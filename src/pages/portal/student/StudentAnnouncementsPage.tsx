import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Pin, Megaphone } from 'lucide-react';
import { fetchStudentAnnouncements, type Announcement } from '../../../lib/announcements';
import { supabaseAdmin } from '../../../lib/supabase';
import type { StudentSession } from '../../../lib/auth';

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

interface StudentAnnouncementsPageProps {
  session: StudentSession;
}

export default function StudentAnnouncementsPage({ session }: StudentAnnouncementsPageProps) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get student's subject IDs first, then fetch filtered announcements
    supabaseAdmin
      .from('teacher_students')
      .select('subject_id')
      .eq('student_id', session.student_id)
      .then(({ data }) => {
        const subjectIds = [...new Set((data ?? []).map((r: any) => r.subject_id as number))];
        return fetchStudentAnnouncements(
          session.school_id,
          session.student_id,
          session.grade,
          session.cohort_id,
          subjectIds
        );
      })
      .then(data => {
        setAnnouncements(data);
        setLoading(false);
      });
  }, []);

  const pinned   = announcements.filter(a => a.pinned);
  const unpinned = announcements.filter(a => !a.pinned);

  return (
    <div className="p-5 md:p-8 max-w-5xl w-full mx-auto">
      <div className="mb-6">
        <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Announcements</p>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Announcements</h1>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
            className="w-5 h-5 border-2 border-slate-200 border-t-slate-700 rounded-full" />
        </div>
      ) : announcements.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Megaphone className="w-10 h-10 text-slate-200 mb-4" />
          <p className="text-sm font-bold text-slate-400">No announcements yet.</p>
        </div>
      ) : (
        <div className="space-y-6">

          {pinned.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Pin className="w-3.5 h-3.5 text-amber-500" />
                <p className="text-xs font-black uppercase tracking-widest text-slate-400">Pinned</p>
              </div>
              <div className="space-y-2">
                {pinned.map((a, i) => <StudentAnnouncementCard key={a.id} a={a} i={i} />)}
              </div>
            </div>
          )}

          {unpinned.length > 0 && (
            <div>
              {pinned.length > 0 && (
                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Recent</p>
              )}
              <div className="space-y-2">
                {unpinned.map((a, i) => <StudentAnnouncementCard key={a.id} a={a} i={i} />)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StudentAnnouncementCard({ a, i }: { a: Announcement; i: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.04, duration: 0.18 }}
      className={`bg-white rounded-2xl border px-5 py-4 ${a.pinned ? 'border-amber-200' : 'border-slate-200'}`}
    >
      <div className="flex items-start gap-3">
        {a.pinned && <Pin className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-black text-slate-900">{a.title}</p>
          {a.body && (
            <>
              <p className={`text-xs text-slate-500 mt-1 leading-relaxed ${!expanded ? 'line-clamp-2' : ''}`}>
                {a.body}
              </p>
              {a.body.length > 120 && (
                <button
                  onClick={() => setExpanded(e => !e)}
                  className="text-[11px] font-black text-slate-400 hover:text-slate-600 mt-0.5 transition-colors"
                >
                  {expanded ? 'Show less' : 'Read more'}
                </button>
              )}
            </>
          )}
          <p className="text-[10px] text-slate-300 mt-1.5">
            {a.author_name} {a.author_surname}
            {a.author_role === 'admin' && <span className="ml-1 text-violet-400 font-bold">(Admin)</span>}
            {' · '}{timeAgo(a.created_at)}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
