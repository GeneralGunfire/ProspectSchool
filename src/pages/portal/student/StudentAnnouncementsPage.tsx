import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Pin, Megaphone } from 'lucide-react';
import { fetchStudentAnnouncements, trackAnnouncementViews, type Announcement } from '../../../lib/announcements';
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

function detectCategory(a: Announcement): string {
  const text = (a.title + ' ' + (a.body ?? '')).toLowerCase();
  if (text.includes('exam') || text.includes('test') || text.includes('assessment')) return 'Exam';
  if (text.includes('homework') || text.includes('assignment') || text.includes('due')) return 'Homework';
  if (text.includes('urgent') || text.includes('important') || text.includes('cancel')) return 'Urgent';
  if (text.includes('sport') || text.includes('event') || text.includes('trip') || text.includes('excursion')) return 'Event';
  return 'General';
}

const CATEGORY_COLORS: Record<string, string> = {
  Exam:     'bg-red-50 text-red-600 border-red-100',
  Homework: 'bg-blue-50 text-blue-600 border-blue-100',
  Urgent:   'bg-amber-50 text-amber-600 border-amber-100',
  Event:    'bg-violet-50 text-violet-600 border-violet-100',
  General:  'bg-stone-100 text-stone-500 border-brand-border',
};

interface StudentAnnouncementsPageProps {
  session: StudentSession;
}

export default function StudentAnnouncementsPage({ session }: StudentAnnouncementsPageProps) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  const [readIds, setReadIds] = useState<Set<number>>(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(`prospect_read_announcements_${session.student_id}`) ?? '[]');
      return new Set(stored);
    } catch { return new Set(); }
  });
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
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
        // Track views for all visible announcements — batch, fire-and-forget
        if (data.length > 0) {
          trackAnnouncementViews(
            data.map((a: Announcement) => a.id),
            session.student_id,
            session.school_id,
          );
        }
      });
  }, []);

  function handleExpand(id: number) {
    setExpandedId(prev => prev === id ? null : id);
    if (!readIds.has(id)) {
      setReadIds(prev => {
        const next = new Set(prev);
        next.add(id);
        localStorage.setItem(
          `prospect_read_announcements_${session.student_id}`,
          JSON.stringify([...next])
        );
        return next;
      });
    }
  }

  // Derived data
  const annotated = announcements.map(a => ({ ...a, category: detectCategory(a) }));
  const availableCategories = ['all', ...Array.from(new Set(annotated.map(a => a.category))).sort()];
  const filtered = annotated.filter(a => filterCategory === 'all' || a.category === filterCategory);
  const pinned   = filtered.filter(a => a.pinned);
  const unpinned = filtered.filter(a => !a.pinned);
  const unreadCount = announcements.filter(a => !readIds.has(a.id)).length;

  return (
    <div className="px-4 py-6 sm:p-6 md:p-8 max-w-5xl w-full mx-auto">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        className="mb-6 flex items-start justify-between"
      >
        <div>
          <span className="eyebrow">Announcements</span>
          <h1 className="font-display font-black text-brand-dark text-2xl md:text-3xl mt-1" style={{ letterSpacing: '-0.03em' }}>
            Announcements
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            Messages from your school and teachers.
          </p>
        </div>
        {unreadCount > 0 && (
          <div className="shrink-0 bg-brand-dark text-white rounded-2xl px-4 py-3 text-center hidden sm:block">
            <p className="font-black text-2xl leading-none">{unreadCount}</p>
            <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest mt-0.5">Unread</p>
          </div>
        )}
      </motion.div>

      {/* Category filter pills */}
      {!loading && announcements.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, ease: [0.23, 1, 0.32, 1] }}
          className="flex gap-2 overflow-x-auto pb-1 mb-5"
        >
          {availableCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-black transition-colors whitespace-nowrap ${
                filterCategory === cat
                  ? 'bg-brand-dark text-white'
                  : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
              }`}
            >
              {cat === 'all' ? `All (${announcements.length})` : cat}
            </button>
          ))}
        </motion.div>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-5 h-5 border-2 border-brand-border border-t-stone-700 rounded-full animate-spin" />
        </div>
      ) : announcements.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Megaphone className="w-10 h-10 text-stone-200 mb-4" />
          <p className="text-sm font-black text-stone-500 mb-1">No announcements yet.</p>
          <p className="text-xs text-stone-400">Your teachers and school admin will post updates here.</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-sm font-black text-stone-500 mb-2">No {filterCategory} announcements.</p>
          <button
            onClick={() => setFilterCategory('all')}
            className="text-xs font-black text-stone-500 hover:text-stone-800 transition-colors"
          >
            Show all
          </button>
        </div>
      ) : (
        <div className="space-y-6">

          {/* Pinned */}
          {pinned.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Pin className="w-3.5 h-3.5 text-amber-500" />
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-stone-500">Pinned</p>
              </div>
              <div className="space-y-2">
                {pinned.map((a, i) => (
                  <AnnouncementCard
                    key={a.id}
                    a={a}
                    i={i}
                    isRead={readIds.has(a.id)}
                    isExpanded={expandedId === a.id}
                    onExpand={() => handleExpand(a.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Recent */}
          {unpinned.length > 0 && (
            <div>
              {pinned.length > 0 && (
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-stone-500 mb-3">Recent</p>
              )}
              <div className="space-y-2">
                {unpinned.map((a, i) => (
                  <AnnouncementCard
                    key={a.id}
                    a={a}
                    i={i}
                    isRead={readIds.has(a.id)}
                    isExpanded={expandedId === a.id}
                    onExpand={() => handleExpand(a.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function AnnouncementCard({
  a,
  i,
  isRead,
  isExpanded,
  onExpand,
}: {
  a: Announcement & { category: string };
  i: number;
  isRead: boolean;
  isExpanded: boolean;
  onExpand: () => void;
}) {
  const categoryColor = CATEGORY_COLORS[a.category] ?? CATEGORY_COLORS.General;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.04, duration: 0.18 }}
      className={`bg-white rounded-2xl border transition-colors ${
        a.pinned ? 'border-amber-200' : isRead ? 'border-brand-border' : 'border-stone-300'
      }`}
    >
      <button
        onClick={onExpand}
        className="w-full text-left px-5 py-4"
      >
        <div className="flex items-start gap-3">
          {/* Unread dot */}
          <div className="shrink-0 mt-1.5">
            {!isRead
              ? <span className="w-2 h-2 rounded-full bg-brand-dark block" />
              : <span className="w-2 h-2 rounded-full bg-transparent block" />
            }
          </div>

          <div className="flex-1 min-w-0">
            {/* Top row: title + badges */}
            <div className="flex items-start justify-between gap-2 mb-1">
              <p className={`text-sm leading-snug ${isRead ? 'font-bold text-stone-600' : 'font-black text-stone-900'}`}>
                {a.title}
              </p>
              <div className="flex items-center gap-1.5 shrink-0">
                {a.pinned && <Pin className="w-3 h-3 text-amber-500" />}
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${categoryColor}`}>
                  {a.category}
                </span>
              </div>
            </div>

            {/* Body preview when collapsed */}
            {!isExpanded && a.body && (
              <p className="text-xs text-stone-500 line-clamp-1 mb-1">{a.body}</p>
            )}

            {/* Meta */}
            <p className="text-[10px] text-stone-400">
              {a.author_name} {a.author_surname}
              {a.author_role === 'admin' && <span className="ml-1 text-violet-400 font-bold">(Admin)</span>}
              {' · '}{timeAgo(a.created_at)}
            </p>
          </div>
        </div>
      </button>

      {/* Expanded body */}
      <AnimatePresence initial={false}>
        {isExpanded && a.body && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-0 border-t border-brand-border/60 mt-0">
              <p className="text-sm text-stone-600 leading-relaxed pt-4 whitespace-pre-line">{a.body}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
