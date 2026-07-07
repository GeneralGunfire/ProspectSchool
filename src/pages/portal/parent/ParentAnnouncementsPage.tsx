import { useEffect, useState } from 'react';
import { Pin, Megaphone } from 'lucide-react';
import { fetchStudentAnnouncements, type Announcement } from '../../../lib/announcements';
import { supabaseAdmin } from '../../../lib/supabase';
import type { ParentSession } from '../../../lib/auth';
import type { ParentChild } from '../../../lib/parents';

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
    <div className={`bg-white rounded-2xl border px-5 py-4 ${a.pinned ? 'border-amber-200' : 'border-brand-border'}`}>
      <div className="flex items-start justify-between gap-2 mb-1">
        <p className="text-sm font-black text-stone-900 leading-snug">{a.title}</p>
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
    <div className="px-4 py-6 sm:p-6 md:p-8 max-w-3xl w-full mx-auto">
      <div className="mb-6">
        <span className="eyebrow">{child.name} {child.surname}</span>
        <h1 className="text-2xl font-black text-brand-dark tracking-tight">Announcements</h1>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-5 h-5 border-2 border-brand-border border-t-stone-700 rounded-full animate-spin" />
        </div>
      ) : announcements.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Megaphone className="w-10 h-10 text-stone-200 mb-4" />
          <p className="text-sm font-black text-stone-500 mb-1">No announcements yet.</p>
          <p className="text-xs text-stone-400">The school and teachers will post updates here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {pinned.map((a) => <Card key={a.id} a={a} />)}
          {unpinned.map((a) => <Card key={a.id} a={a} />)}
        </div>
      )}
    </div>
  );
}
