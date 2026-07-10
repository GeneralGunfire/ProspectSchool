import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Pin, Megaphone } from 'lucide-react';
import { Shimmer } from './StudentHomePage';
import { fetchStudentAnnouncements, trackAnnouncementViews, type Announcement } from '../../../lib/announcements';
import { supabaseAdmin } from '../../../lib/supabase';
import type { StudentSession } from '../../../lib/auth';

const ease = [0.23, 1, 0.32, 1] as [number, number, number, number];

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

const CATEGORY_ACCENTS: Record<string, string> = {
  Exam:     'bg-red-400',
  Homework: 'bg-blue-400',
  Urgent:   'bg-amber-400',
  Event:    'bg-violet-400',
  General:  'bg-stone-200',
};

interface StudentAnnouncementsPageProps {
  session: StudentSession;
}

export default function StudentAnnouncementsPage({ session }: StudentAnnouncementsPageProps) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [imgLoaded, setImgLoaded] = useState(false);

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
    <div className="student-home min-h-full pb-16">

      {/* ═══ Hero — full-width crested banner (megaphone crest) ═════ */}
      <div className="relative overflow-hidden bg-brand-dark border-b border-brand-border grain-surface flex flex-col justify-end min-h-[150px] sm:min-h-[190px] lg:min-h-[210px]">
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
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="flex items-end justify-between gap-4"
          >
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-white/45">Announcements</p>
              <h1 className="font-display font-extrabold text-white text-[28px] sm:text-[36px] mt-2 leading-[1.1]" style={{ letterSpacing: '-0.02em', textShadow: '0 2px 20px rgba(0,0,0,0.35)' }}>
                Messages from your school
              </h1>
              <p className="text-[13px] text-white/60 mt-2.5 font-medium">
                Updates from {session.school_name} and your teachers.
              </p>
            </div>

            {unreadCount > 0 && (
              <div className="shrink-0 border border-white/15 bg-white/[0.05] rounded px-4 py-2.5 text-center hidden sm:block">
                <p className="font-black text-2xl leading-none text-white">{unreadCount}</p>
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/50 mt-1">Unread</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* ═══ Body ═════════════════════════════════════════════════ */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 relative z-10 space-y-5 sm:space-y-6 pt-6 sm:pt-8">

        {/* Category filter pills */}
        {!loading && announcements.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, ease }}
            className="flex gap-2 overflow-x-auto pb-1 scrollbar-none"
          >
            {availableCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`shrink-0 px-3.5 py-2 rounded text-[13px] font-bold transition-colors whitespace-nowrap border ${
                  filterCategory === cat
                    ? 'bg-accent text-white border-transparent'
                    : 'text-stone-600 hover:text-stone-800 border-brand-border'
                }`}
                style={filterCategory !== cat ? { background: 'var(--color-paper-raise)' } : undefined}
              >
                {cat === 'all' ? `All (${announcements.length})` : cat}
              </button>
            ))}
          </motion.div>
        )}

        {/* Content */}
        {loading ? (
          <div className="space-y-2.5">
            {[0, 1, 2, 3].map(i => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.06, ease }}
                className="paper-card rounded overflow-hidden flex"
              >
                <span className="w-1 shrink-0" style={{ background: 'var(--color-brand-border)' }} />
                <div className="flex-1 min-w-0 px-4 py-4 sm:px-5">
                  <div className="flex items-start gap-3">
                    <Shimmer className="w-2 h-2 rounded-full mt-1.5 shrink-0" />
                    <div className="flex-1 min-w-0 space-y-2">
                      <Shimmer className="h-4" style={{ width: `${60 - i * 8}%` }} />
                      <Shimmer className="h-3 w-1/3" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : announcements.length === 0 ? (
          <div className="paper-card rounded p-5 sm:p-7 flex flex-col items-center justify-center py-20 text-center">
            <Megaphone className="w-9 h-9 text-stone-200 mb-4" />
            <p className="text-[16px] font-semibold text-brand-dark mb-1">No announcements yet.</p>
            <p className="text-[13px] text-[rgba(31,36,33,0.4)]">Your teachers and school admin will post updates here.</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="paper-card rounded p-5 sm:p-7 flex flex-col items-center justify-center py-16 text-center">
            <p className="text-[16px] font-semibold text-brand-dark mb-2">No {filterCategory} announcements.</p>
            <button
              onClick={() => setFilterCategory('all')}
              className="text-[13px] font-bold transition-colors"
              style={{ color: 'var(--color-accent)' }}
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
                  <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[rgba(31,36,33,0.45)]">Pinned</p>
                </div>
                <div className="space-y-2.5">
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
                  <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[rgba(31,36,33,0.45)] mb-3">Recent</p>
                )}
                <div className="space-y-2.5">
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
  const accentColor = CATEGORY_ACCENTS[a.category] ?? CATEGORY_ACCENTS.General;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.04, duration: 0.3, ease }}
      className="paper-card rounded overflow-hidden flex"
      style={a.pinned ? { borderLeft: '3px solid #f59e0b' } : undefined}
    >
      {/* Quiet category-colored left edge accent — replaces the old type pill */}
      {!a.pinned && <span className={`w-1 shrink-0 ${accentColor}`} />}

      <div className="flex-1 min-w-0">
        <button
          onClick={onExpand}
          className="w-full text-left px-4 py-4 sm:px-5"
        >
          <div className="flex items-start gap-3">
            {/* Unread dot */}
            <div className="shrink-0 mt-1.5">
              {!isRead
                ? <span className="w-2 h-2 rounded-full bg-accent block" />
                : <span className="w-2 h-2 rounded-full bg-transparent block" />
              }
            </div>

            <div className="flex-1 min-w-0">
              {/* Top row: title + pin */}
              <div className="flex items-start justify-between gap-2 mb-1">
                <p className={`text-[16px] leading-snug ${isRead ? 'font-semibold text-stone-600' : 'font-bold text-brand-dark'}`}>
                  {a.title}
                </p>
                {a.pinned && <Pin className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />}
              </div>

              {/* Body preview when collapsed */}
              {!isExpanded && a.body && (
                <p className="text-[13px] text-stone-500 line-clamp-1 mb-1">{a.body}</p>
              )}

              {/* Meta */}
              <p className="text-[12px] text-[rgba(31,36,33,0.4)]">
                {a.author_name} {a.author_surname}
                {a.author_role === 'admin' && <span className="ml-1 text-violet-500 font-bold">(Admin)</span>}
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
              transition={{ duration: 0.25, ease }}
              className="overflow-hidden"
            >
              <div className="px-4 sm:px-5 pb-5 pt-0 border-t mt-0" style={{ borderColor: 'var(--color-brand-border)' }}>
                <p className="text-[14px] text-stone-600 leading-relaxed pt-4 whitespace-pre-line">{a.body}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
