import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Pin, Megaphone, Search, X } from 'lucide-react';
import { Shimmer } from '../../../shared/components/Shimmer';
import { CountUp } from '../../../shared/components/CountUp';
import { fetchStudentAnnouncements, trackAnnouncementViews, type Announcement } from '../../../lib/announcements';
import { fetchStudentEvents, type SchoolEvent } from '../../../lib/events';
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

function formatEventDate(d: string): string {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const date = new Date(d + 'T00:00:00');
  const diffDays = Math.round((date.getTime() - today.getTime()) / 86400000);
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  return date.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' });
}

function monthLabel(iso: string): string {
  return new Date(iso).toLocaleDateString('en-ZA', { month: 'long', year: 'numeric' });
}

function detectCategory(a: Announcement): string {
  const text = (a.title + ' ' + (a.body ?? '')).toLowerCase();
  if (text.includes('exam') || text.includes('test') || text.includes('assessment')) return 'Assessment';
  if (text.includes('homework') || text.includes('assignment') || text.includes('due')) return 'Academic';
  if (text.includes('urgent') || text.includes('important') || text.includes('cancel')) return 'Important';
  if (text.includes('sport') || text.includes('event') || text.includes('trip') || text.includes('excursion')) return 'Events';
  return 'General';
}

const CATEGORY_STYLES: Record<string, { badge: string; text: string; dot: string }> = {
  Assessment: { badge: 'bg-red-50',    text: 'text-red-700',    dot: 'bg-red-400' },
  Academic:   { badge: 'bg-blue-50',   text: 'text-blue-700',   dot: 'bg-blue-400' },
  Important:  { badge: 'bg-amber-50',  text: 'text-amber-700',  dot: 'bg-amber-400' },
  Events:     { badge: 'bg-violet-50', text: 'text-violet-700', dot: 'bg-violet-400' },
  General:    { badge: 'bg-stone-100', text: 'text-stone-600',  dot: 'bg-stone-400' },
};

type Tab = 'all' | 'unread' | 'saved';

interface StudentAnnouncementsPageProps {
  session: StudentSession;
  onNavigate: (page: string) => void;
}

export default function StudentAnnouncementsPage({ session, onNavigate }: StudentAnnouncementsPageProps) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [upcoming, setUpcoming] = useState<SchoolEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const [readIds, setReadIds] = useState<Set<number>>(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(`prospect_read_announcements_${session.student_id}`) ?? '[]');
      return new Set(stored);
    } catch { return new Set(); }
  });
  const [savedIds, setSavedIds] = useState<Set<number>>(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(`prospect_saved_announcements_${session.student_id}`) ?? '[]');
      return new Set(stored);
    } catch { return new Set(); }
  });
  const [tab, setTab] = useState<Tab>('all');
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    const today = new Date();
    supabaseAdmin
      .from('teacher_students')
      .select('subject_id')
      .eq('student_id', session.student_id)
      .then(({ data }) => {
        const subjectIds = [...new Set((data ?? []).map((r: any) => r.subject_id as number))];
        return Promise.all([
          fetchStudentAnnouncements(session.school_id, session.student_id, session.grade, session.cohort_id, subjectIds),
          fetchStudentEvents(session.school_id, session.student_id, session.grade, session.cohort_id, subjectIds, today.getFullYear(), today.getMonth() + 1),
        ]);
      })
      .then(([announcementData, eventData]) => {
        setAnnouncements(announcementData);
        const todayStr = today.toISOString().slice(0, 10);
        setUpcoming(eventData.filter(e => e.event_date >= todayStr).slice(0, 4));
        setLoading(false);
        if (announcementData.length > 0) {
          trackAnnouncementViews(announcementData.map((a: Announcement) => a.id), session.student_id, session.school_id);
        }
      });
  }, []);

  function handleExpand(id: number) {
    setExpandedId(prev => prev === id ? null : id);
    if (!readIds.has(id)) {
      setReadIds(prev => {
        const next = new Set(prev);
        next.add(id);
        localStorage.setItem(`prospect_read_announcements_${session.student_id}`, JSON.stringify([...next]));
        return next;
      });
    }
  }

  function toggleSaved(id: number) {
    setSavedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      localStorage.setItem(`prospect_saved_announcements_${session.student_id}`, JSON.stringify([...next]));
      return next;
    });
  }

  function markAllRead() {
    setReadIds(() => {
      const next = new Set(announcements.map(a => a.id));
      localStorage.setItem(`prospect_read_announcements_${session.student_id}`, JSON.stringify([...next]));
      return next;
    });
  }

  // Derived data
  const annotated = useMemo(() => announcements.map(a => ({ ...a, category: detectCategory(a) })), [announcements]);
  const availableCategories = useMemo(() => ['all', ...Array.from(new Set(annotated.map(a => a.category))).sort()], [annotated]);
  const unreadCount = announcements.filter(a => !readIds.has(a.id)).length;

  // Recent = last 60 days; Earlier = grouped by month, older than that
  const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - 60);
  const isRecent = (a: Announcement) => new Date(a.created_at) >= cutoff;

  const filtered = annotated.filter(a => {
    if (filterCategory !== 'all' && a.category !== filterCategory) return false;
    if (tab === 'unread' && readIds.has(a.id)) return false;
    if (tab === 'saved' && !savedIds.has(a.id)) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      if (!a.title.toLowerCase().includes(q) && !(a.body ?? '').toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const recentFiltered = filtered.filter(isRecent);
  const pinned   = recentFiltered.filter(a => a.pinned);
  const unpinned = recentFiltered.filter(a => !a.pinned);

  const earlierByMonth = useMemo(() => {
    const older = annotated.filter(a => !isRecent(a));
    const groups = new Map<string, number>();
    for (const a of older) {
      const key = monthLabel(a.created_at);
      groups.set(key, (groups.get(key) ?? 0) + 1);
    }
    return Array.from(groups.entries());
  }, [annotated]);

  return (
    <div className="student-home min-h-full pb-16 relative">

      {/* ═══ Header — same structure/scale as Home: title, quiet metadata
          line, then a status block below (bold message + subtext + link),
          not a title-row-with-button-floated-right. ═══ */}
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-5">
        <h1 className="text-brand-dark text-[30px] sm:text-[36px] leading-tight" style={{ fontWeight: 600 }}>
          <span className="relative inline-block">
            <span className="text-transparent bg-clip-text bg-linear-to-r from-sky-500 via-sky-600 to-blue-600">
              Announcements
            </span>
            <svg aria-hidden="true" viewBox="0 0 320 14" className="absolute left-0 -bottom-1 w-full h-3 text-amber-500/70" preserveAspectRatio="none">
              <path d="M2 9C60 3 180 2 318 8" stroke="currentColor" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            </svg>
          </span>
        </h1>
        <p className="text-[12px] text-muted-2 mt-1">Updates from your school and teachers.</p>

        <div className="mt-4">
          {!loading && announcements.length > 0 ? (
            <>
              <div className="flex items-center gap-2 mb-1">
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${unreadCount > 0 ? 'bg-accent' : 'bg-stone-400'}`} />
                <span className="text-[12px] font-semibold text-muted">
                  {unreadCount > 0 ? 'Needs a look' : 'All caught up'}
                </span>
              </div>
              <p className="text-brand-dark text-[20px] leading-snug" style={{ fontWeight: 600 }}>
                {unreadCount > 0 ? (
                  <><CountUp value={unreadCount} /> unread</>
                ) : (
                  'Nothing new to read'
                )}
              </p>
              <p className="text-muted text-[14px] mt-0.5">{announcements.length} total announcement{announcements.length !== 1 ? 's' : ''}</p>
              {unreadCount > 0 && (
                <button onClick={markAllRead} className="inline-flex items-center gap-1 text-[14px] font-semibold transition-colors mt-2.5" style={{ color: 'var(--color-accent-soft)' }}>
                  Mark all as read
                </button>
              )}
            </>
          ) : (
            <p className="text-brand-dark text-[20px] leading-snug" style={{ fontWeight: 600 }}>No announcements yet</p>
          )}
        </div>
      </div>

      {/* ═══ Toolbar — tabs + search + category filter ═══
          Single narrow column throughout (not the wide 1300px dashboard
          container) — this page reads as a calm feed/inbox, not a
          multi-panel dashboard, so it shouldn't stretch to fill 1300px
          when there's little content. Everything flows vertically:
          toolbar → feed → Upcoming → Useful links → Earlier, all the
          same card width so nothing looks stranded next to empty space. */}
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
          <div className="flex gap-1.5 shrink-0">
            {([
              { id: 'all' as Tab, label: 'All' },
              { id: 'unread' as Tab, label: 'Unread' },
              { id: 'saved' as Tab, label: 'Saved' },
            ]).map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`px-3.5 py-2 rounded-md text-[13.5px] font-medium transition-colors ${
                  tab === t.id ? 'bg-accent text-white' : 'text-stone-600 hover:bg-stone-100'
                }`}>
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex-1 flex items-center gap-2 min-w-0">
            <div className="relative flex-1 min-w-0 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search announcements"
                className="w-full pl-9 pr-8 py-2 rounded-md border text-[13.5px] text-brand-dark placeholder:text-stone-400 focus:outline-none transition-colors"
                style={{ borderColor: 'var(--color-brand-border)', background: 'var(--color-paper-raise)' }}
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2">
                  <X className="w-3.5 h-3.5 text-stone-500" />
                </button>
              )}
            </div>

            {availableCategories.length > 2 && (
              <select
                value={filterCategory}
                onChange={e => setFilterCategory(e.target.value)}
                className="px-3 py-2 rounded-md border text-[13.5px] text-brand-dark focus:outline-none shrink-0"
                style={{ borderColor: 'var(--color-brand-border)', background: 'var(--color-paper-raise)' }}
              >
                {availableCategories.map(cat => (
                  <option key={cat} value={cat}>{cat === 'all' ? 'All categories' : cat}</option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* ═══ Body — single vertical column: feed, then Upcoming, then
            Useful links, then Earlier. Same card width throughout. ═══ */}
        <div className="space-y-4 pb-4">

          {/* Feed */}
          <div>
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
                <p className="text-[13px] text-muted">Your teachers and school admin will post updates here.</p>
              </div>
            ) : pinned.length === 0 && unpinned.length === 0 ? (
              <div className="paper-card rounded p-5 sm:p-7 flex flex-col items-center justify-center py-16 text-center">
                <p className="text-[16px] font-semibold text-brand-dark mb-2">
                  {tab === 'unread' ? 'No unread announcements.' : tab === 'saved' ? 'No saved announcements.' : `No ${filterCategory} announcements.`}
                </p>
                <button
                  onClick={() => { setTab('all'); setFilterCategory('all'); setSearch(''); }}
                  className="text-[13px] font-semibold transition-colors"
                  style={{ color: 'var(--color-accent)' }}
                >
                  Show all
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {pinned.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Pin className="w-3.5 h-3.5 text-amber-500" />
                      <p className="text-[13px] font-semibold text-muted">Pinned</p>
                    </div>
                    <div className="space-y-2.5">
                      {pinned.map((a, i) => (
                        <AnnouncementCard key={a.id} a={a} i={i}
                          isRead={readIds.has(a.id)} isSaved={savedIds.has(a.id)}
                          isExpanded={expandedId === a.id}
                          onExpand={() => handleExpand(a.id)} onToggleSaved={() => toggleSaved(a.id)} />
                      ))}
                    </div>
                  </div>
                )}
                {unpinned.length > 0 && (
                  <div>
                    {pinned.length > 0 && <p className="text-[13px] font-semibold text-muted mb-3">Recent</p>}
                    <div className="space-y-2.5">
                      {unpinned.map((a, i) => (
                        <AnnouncementCard key={a.id} a={a} i={i}
                          isRead={readIds.has(a.id)} isSaved={savedIds.has(a.id)}
                          isExpanded={expandedId === a.id}
                          onExpand={() => handleExpand(a.id)} onToggleSaved={() => toggleSaved(a.id)} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Earlier / archive */}
            {earlierByMonth.length > 0 && (
              <div className="mt-6">
                <p className="text-[17px] text-brand-dark mb-2" style={{ fontWeight: 600 }}>Earlier announcements</p>
                <div className="paper-card rounded divide-y divide-brand-border">
                  {earlierByMonth.map(([month, count]) => (
                    <div key={month} className="px-4 py-2.5 flex items-center justify-between">
                      <span className="text-[13.5px] text-brand-dark">{month}</span>
                      <span className="text-[13px] text-muted-2">{count} announcement{count !== 1 ? 's' : ''}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Upcoming / Useful links — same hand-drawn underline recipe as
              Home's overview row; no icon badges anywhere. */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="paper-card rounded p-4">
              <span className="relative inline-block mb-2.5">
                <span className="text-[12px] text-muted-2">Upcoming</span>
                <svg aria-hidden="true" viewBox="0 0 140 8" className="absolute left-0 -bottom-1 w-full h-2 text-sky-400/60" preserveAspectRatio="none">
                  <path d="M1 5C30 2 80 1 139 4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
                </svg>
              </span>
              {loading ? (
                <div className="space-y-2">
                  <Shimmer className="h-3 w-2/3" />
                  <Shimmer className="h-3 w-1/2" />
                </div>
              ) : upcoming.length === 0 ? (
                <p className="text-brand-dark text-[15px]" style={{ fontWeight: 600 }}>No upcoming events</p>
              ) : (
                <>
                  <div className="flex items-baseline gap-2 mb-2">
                    <p className="text-[28px] leading-none" style={{ fontWeight: 700, color: 'var(--color-accent)' }}>
                      <CountUp value={upcoming.length} />
                    </p>
                    <p className="text-muted text-[12px]">event{upcoming.length !== 1 ? 's' : ''} scheduled</p>
                  </div>
                  <div className="divide-y divide-brand-border">
                    {upcoming.map(ev => (
                      <div key={ev.id} className="py-2">
                        <p className="text-[12px] font-semibold text-muted-2">{formatEventDate(ev.event_date)}</p>
                        <p className="text-[14px] font-medium text-brand-dark truncate">{ev.title}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="paper-card rounded p-4">
              <span className="relative inline-block mb-2.5">
                <span className="text-[12px] text-muted-2">Useful links</span>
                <svg aria-hidden="true" viewBox="0 0 140 8" className="absolute left-0 -bottom-1 w-full h-2 text-emerald-400/60" preserveAspectRatio="none">
                  <path d="M1 5C30 2 80 1 139 4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
                </svg>
              </span>
              <div className="divide-y divide-brand-border">
                {([
                  { label: 'School calendar', page: 'calendar' },
                  { label: 'Timetable', page: 'timetable' },
                  { label: 'My marks', page: 'marks' },
                ]).map(link => (
                  <button key={link.page} onClick={() => onNavigate(link.page)}
                    className="w-full flex items-center justify-between gap-3 py-2.5 text-left group">
                    <span className="text-[14px] font-medium text-brand-dark group-hover:text-accent-soft transition-colors">{link.label}</span>
                    <span className="text-muted-2 group-hover:text-accent-soft transition-colors">→</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AnnouncementCard({
  a, i, isRead, isSaved, isExpanded, onExpand, onToggleSaved,
}: {
  a: Announcement & { category: string };
  i: number;
  isRead: boolean;
  isSaved: boolean;
  isExpanded: boolean;
  onExpand: () => void;
  onToggleSaved: () => void;
}) {
  const style = CATEGORY_STYLES[a.category] ?? CATEGORY_STYLES.General;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.04, duration: 0.3, ease }}
      className="paper-card rounded overflow-hidden"
      style={a.pinned ? { borderLeft: '3px solid #f59e0b' } : undefined}
    >
      <div className="min-w-0">
        <button
          onClick={onExpand}
          className="w-full text-left px-4 py-4 sm:px-5"
        >
          <div className="flex items-start gap-3.5">
            <div className="flex-1 min-w-0">
              {/* Top row: category pill + date */}
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-full ${style.badge} ${style.text}`}>
                  {!isRead && <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />}
                  {a.category}
                </span>
                <span className="text-[12px] text-muted-2 shrink-0">{timeAgo(a.created_at)}</span>
              </div>

              {/* Title + pin */}
              <div className="flex items-start justify-between gap-2 mb-1">
                <p className={`text-[16px] leading-snug ${isRead ? 'font-medium text-stone-600' : 'font-semibold text-brand-dark'}`}>
                  {a.title}
                </p>
                {a.pinned && <Pin className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />}
              </div>

              {/* Body preview when collapsed */}
              {!isExpanded && a.body && (
                <p className="text-[14px] text-muted line-clamp-1 mb-1.5">{a.body}</p>
              )}

              {/* Author meta */}
              <p className="text-[12px] text-muted-2">
                {a.author_name} {a.author_surname}
                {a.author_role === 'admin' && <span className="ml-1 text-violet-600 font-semibold">Admin</span>}
              </p>
            </div>
          </div>
        </button>

        {/* Expanded body + save action */}
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease }}
              className="overflow-hidden"
            >
              <div className="px-4 sm:px-5 pb-4 pt-0 border-t mt-0" style={{ borderColor: 'var(--color-brand-border)' }}>
                {a.body && <p className="text-[14px] text-muted leading-relaxed pt-4 pl-11.5 whitespace-pre-line">{a.body}</p>}
                <button
                  onClick={(e) => { e.stopPropagation(); onToggleSaved(); }}
                  className={`mt-3 pl-11.5 text-[13px] font-semibold transition-colors ${isSaved ? '' : 'text-muted hover:text-brand-dark'}`}
                  style={isSaved ? { color: 'var(--color-accent)' } : undefined}
                >
                  {isSaved ? 'Saved' : 'Save for later'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
