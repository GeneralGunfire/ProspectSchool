import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Paperclip, Link2, FileText, ExternalLink, FolderOpen, Search, X, BookOpen, ChevronDown } from 'lucide-react';
import { Shimmer } from './StudentHomePage';
import {
  fetchStudentResources, getResourceDownloadUrl, trackResourceDownload,
  RESOURCE_TYPE_META, RESOURCE_CATEGORY_META,
  type Resource, type ResourceType, type ResourceCategory,
} from '../../../lib/resources';
import { supabaseAdmin } from '../../../lib/supabase';
import type { StudentSession } from '../../../lib/auth';

const ease = [0.23, 1, 0.32, 1] as [number, number, number, number];

function formatDate(s: string) {
  return new Date(s).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });
}

const TypeIcon = { file: Paperclip, link: Link2, note: FileText };

interface StudentResourcesPageProps {
  session: StudentSession;
  onNavigate: (page: string) => void;
}

export default function StudentResourcesPage({ session, onNavigate }: StudentResourcesPageProps) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<ResourceType | 'all'>('all');
  const [filterCategory, setFilterCategory] = useState<ResourceCategory | 'all'>('all');
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [downloading, setDownloading] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [recentlyViewed, setRecentlyViewed] = useState<number[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(`prospect_recent_resources_${session.student_id}`) ?? '[]');
    } catch { return []; }
  });

  useEffect(() => {
    supabaseAdmin
      .from('teacher_students')
      .select('subject_id')
      .eq('student_id', session.student_id)
      .then(({ data }) => {
        const ids = [...new Set((data ?? []).map((r: any) => r.subject_id as number))];
        return fetchStudentResources(
          session.school_id,
          session.student_id,
          session.grade,
          session.cohort_id,
          ids,
        );
      })
      .then(r => {
        setResources(r);
        setLoading(false);
      });
  }, []);

  async function handleOpen(r: Resource) {
    // Record in recently viewed (keep last 5, most recent first)
    setRecentlyViewed(prev => {
      const updated = [r.id, ...prev.filter(id => id !== r.id)].slice(0, 5);
      localStorage.setItem(`prospect_recent_resources_${session.student_id}`, JSON.stringify(updated));
      return updated;
    });

    // Track download — fire-and-forget, unique per student+resource
    trackResourceDownload(r.id, session.student_id, session.school_id);

    if (r.resource_type === 'link' && r.link_url) {
      window.open(r.link_url.startsWith('http') ? r.link_url : `https://${r.link_url}`, '_blank');
    } else if (r.resource_type === 'file' && r.file_url) {
      setDownloading(r.id);
      const url = await getResourceDownloadUrl(r.file_url);
      setDownloading(null);
      if (url) window.open(url, '_blank');
    }
  }

  // Derived data
  const subjectOptions = Array.from(
    new Set(resources.map(r => r.subject_label).filter(Boolean) as string[])
  ).sort();

  const recentResources = recentlyViewed
    .map(id => resources.find(r => r.id === id))
    .filter(Boolean) as Resource[];

  const filtered = resources.filter(r => {
    if (filterSubject !== 'all' && r.subject_label !== filterSubject) return false;
    if (filterType !== 'all' && r.resource_type !== filterType) return false;
    if (filterCategory !== 'all' && r.category !== filterCategory) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        r.title.toLowerCase().includes(q) ||
        r.description?.toLowerCase().includes(q) ||
        r.subject_label?.toLowerCase().includes(q) ||
        r.note_content?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="student-resources student-home min-h-full pb-16 relative">

      {/* ═══ Hero — wave-strip system, matches Home dashboard ═══
          No buttons in this band (house rule). Resource count is shown as
          a static readout pill, matching the reference page's APS chip. */}
      <div className="relative overflow-hidden">

        <div className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-8 sm:pt-11 pb-6 sm:pb-8 w-full">

          {/* Eyebrow row — quiet single line above the title */}
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="flex items-center gap-2 min-w-0"
          >
            <p className="text-[12px] text-[rgba(31,36,33,0.5)] font-medium truncate">
              {session.school_name} · Grade {session.grade}{session.cohort_name ? ` · ${session.cohort_name}` : ''}
            </p>
          </motion.div>

          {/* Title — Fraunces serif, regular weight */}
          <motion.h1
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease, delay: 0.06 }}
            className="text-brand-dark text-[32px] sm:text-[42px] leading-[1.12] mt-2 min-w-0"
            style={{ fontFamily: 'var(--font-instrument)', fontWeight: 500, letterSpacing: '-0.02em' }}
          >
            Study resources
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease, delay: 0.08 }}
            className="text-[13px] text-[rgba(31,36,33,0.55)] mt-2.5 font-medium"
          >
            Materials, links and notes shared by your teachers.
          </motion.p>

          {!loading && resources.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease, delay: 0.1 }}
              className="inline-flex items-center gap-2 mt-4 border border-brand-border bg-white/70 rounded-full pl-3 pr-4 py-1.5"
            >
              <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-[rgba(31,36,33,0.5)]">Available</span>
              <span className="font-black text-sm text-brand-dark">{resources.length} resource{resources.length !== 1 ? 's' : ''}</span>
            </motion.div>
          )}
        </div>
      </div>

      {/* ═══ Body ═════════════════════════════════════════════════ */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 relative z-10 space-y-5 sm:space-y-6 pt-2 sm:pt-3">

        {loading ? (
          <div className="space-y-5">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.06 }}
              className="flex gap-2 overflow-x-auto pb-1">
              {[0, 1, 2].map(i => (
                <Shimmer key={i} className="h-14 w-44 shrink-0" />
              ))}
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.1 }}
              className="space-y-3">
              <Shimmer className="h-11 w-full" />
              <div className="flex gap-2">
                <Shimmer className="h-8 w-24" />
                <Shimmer className="h-8 w-24" />
                <Shimmer className="h-8 w-20" />
              </div>
            </motion.div>
            <div className="space-y-2.5">
              {[0, 1, 2, 3].map(i => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.14 + i * 0.05, ease }}
                  className="paper-card rounded p-4 flex items-center gap-3"
                >
                  <Shimmer className="w-9 h-9 rounded shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Shimmer className="h-4" style={{ width: `${55 - i * 6}%` }} />
                    <Shimmer className="h-3 w-1/3" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : resources.length === 0 ? (
          <div className="paper-card rounded p-5 sm:p-7 flex flex-col items-center justify-center py-20 text-center">
            <FolderOpen className="w-9 h-9 text-stone-200 mb-4" />
            <p className="text-[16px] font-semibold text-brand-dark mb-1">No resources yet.</p>
            <p className="text-[13px] text-[rgba(31,36,33,0.4)]">Your teachers haven't uploaded any materials yet.</p>
            <button
              onClick={() => onNavigate('library')}
              className="edge-glow mt-5 flex items-center gap-2 px-4 py-2.5 bg-accent text-white text-[13px] font-bold rounded transition-colors hover:bg-[var(--color-accent-soft)]"
            >
              <BookOpen className="w-3.5 h-3.5" />
              Open Library Instead
            </button>
          </div>
        ) : (
          <>
            {/* Recently Viewed section */}
            {recentResources.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.06, ease }}
              >
                <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[rgba(31,36,33,0.45)] mb-3">
                  Recently Viewed
                </p>
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {recentResources.map(r => {
                    const meta = RESOURCE_TYPE_META[r.resource_type];
                    const Icon = TypeIcon[r.resource_type];
                    return (
                      <motion.button
                        key={r.id}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleOpen(r)}
                        disabled={downloading === r.id}
                        className="paper-card rounded px-3 py-2.5 text-left flex items-center gap-2.5 min-w-[180px] max-w-[220px] shrink-0 disabled:opacity-40"
                      >
                        <div className={`w-6 h-6 rounded flex items-center justify-center shrink-0 ${meta.badge}`}>
                          <Icon className="w-3 h-3" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[13px] font-semibold text-brand-dark truncate">{r.title}</p>
                          <p className="text-[11px] text-[rgba(31,36,33,0.4)] truncate">{r.subject_label ?? meta.label}</p>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Search + Filters */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, ease }}
              className="paper-card rounded p-4 sm:p-5 space-y-3"
            >
              {/* Search bar */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search resources…"
                  className="w-full pl-10 pr-10 py-2.5 rounded border text-[14px] font-medium text-brand-dark placeholder:text-stone-400 focus:outline-none transition-colors"
                  style={{ borderColor: 'var(--color-brand-border)', background: 'var(--color-paper-raise)' }}
                />
                {search && (
                  <button onClick={() => setSearch('')} className="absolute right-3.5 top-1/2 -translate-y-1/2">
                    <X className="w-3.5 h-3.5 text-stone-500" />
                  </button>
                )}
              </div>

              {/* Subject filter pills */}
              {subjectOptions.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {(['all', ...subjectOptions] as string[]).map(s => (
                    <button
                      key={s}
                      onClick={() => setFilterSubject(s)}
                      className={`shrink-0 px-3.5 py-1.5 rounded text-[12px] font-bold transition-colors whitespace-nowrap ${
                        filterSubject === s
                          ? 'text-white'
                          : 'text-stone-600 hover:text-stone-800'
                      }`}
                      style={filterSubject === s ? { background: 'var(--color-accent)' } : { background: 'var(--color-paper-raise)' }}
                    >
                      {s === 'all' ? 'All Subjects' : s}
                    </button>
                  ))}
                </div>
              )}

              {/* Type filter pills */}
              <div className="flex gap-2 flex-wrap">
                {(['all', 'file', 'link', 'note'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setFilterType(t)}
                    className={`px-3.5 py-1.5 rounded text-[12px] font-bold transition-colors ${
                      filterType === t ? 'text-white' : 'text-stone-600 hover:text-stone-800'
                    }`}
                    style={filterType === t ? { background: 'var(--color-accent)' } : { background: 'var(--color-paper-raise)' }}
                  >
                    {t === 'all' ? 'All Types' : RESOURCE_TYPE_META[t].label + 's'}
                  </button>
                ))}
              </div>

              {/* Category filter pills */}
              <div className="flex gap-2 flex-wrap">
                {(['all', 'homework', 'notes', 'general'] as (ResourceCategory | 'all')[]).map(c => (
                  <button
                    key={c}
                    onClick={() => setFilterCategory(c)}
                    className={`px-3.5 py-1.5 rounded text-[12px] font-bold transition-colors ${
                      filterCategory === c ? 'text-white' : 'text-stone-600 hover:text-stone-800'
                    }`}
                    style={filterCategory === c ? { background: 'var(--color-accent)' } : { background: 'var(--color-paper-raise)' }}
                  >
                    {c === 'all' ? 'All Tags' : RESOURCE_CATEGORY_META[c].label}
                  </button>
                ))}
              </div>

              {/* Result count */}
              <p className="text-[12px] font-semibold text-[rgba(31,36,33,0.5)] pt-1">
                {filtered.length} resource{filtered.length !== 1 ? 's' : ''}
                {filterSubject !== 'all' && ` · ${filterSubject}`}
              </p>
            </motion.div>

            {/* Content list */}
            {filtered.length === 0 ? (
              <div className="paper-card rounded p-5 sm:p-7 flex flex-col items-center justify-center py-16 text-center">
                <Search className="w-8 h-8 text-stone-200 mb-3" />
                <p className="text-[16px] font-semibold text-brand-dark mb-2">No results.</p>
                <button
                  onClick={() => { setSearch(''); setFilterSubject('all'); setFilterType('all'); }}
                  className="text-[13px] font-bold transition-colors"
                  style={{ color: 'var(--color-accent)' }}
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {filtered.map((r, i) => {
                  const meta = RESOURCE_TYPE_META[r.resource_type];
                  const Icon = TypeIcon[r.resource_type];
                  const isNote = r.resource_type === 'note';
                  const isExpanded = expandedId === r.id;
                  const wasViewed = recentlyViewed.includes(r.id);

                  return (
                    <motion.div
                      key={r.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(i * 0.03, 0.15) + 0.16, duration: 0.3, ease }}
                      className="paper-card rounded overflow-hidden"
                    >
                      {/* Collapsed row — icon, title, one meta line */}
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : r.id)}
                        className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
                      >
                        <div className={`w-9 h-9 rounded flex items-center justify-center shrink-0 ${meta.badge}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[15px] font-semibold text-brand-dark truncate">{r.title}</p>
                          <p className="text-[12px] text-[rgba(31,36,33,0.4)] truncate">
                            {r.subject_label ? `${r.subject_label} · ` : ''}{meta.label}
                            {wasViewed && ' · Viewed'}
                          </p>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-stone-400 shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>

                      {/* Expanded — description, tags, link/file/note, date, action */}
                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 pb-4 pt-0 border-t" style={{ borderColor: 'var(--color-brand-border)' }}>
                              <div className="flex items-center gap-1.5 flex-wrap mt-3 mb-2">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${RESOURCE_CATEGORY_META[r.category].badge}`}>
                                  {RESOURCE_CATEGORY_META[r.category].label}
                                </span>
                                {r.subject_label && (
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-stone-500" style={{ background: 'var(--color-paper-raise)' }}>
                                    {r.subject_label}
                                  </span>
                                )}
                              </div>

                              {r.description && (
                                <p className="text-[13px] text-stone-500 mb-1.5 leading-relaxed">{r.description}</p>
                              )}
                              {r.resource_type === 'link' && r.link_url && (
                                <p className="text-[13px] text-violet-500 break-all mb-1.5">{r.link_url}</p>
                              )}
                              {r.resource_type === 'file' && r.file_name && (
                                <p className="text-[13px] text-stone-500 mb-1.5 break-all">{r.file_name}</p>
                              )}
                              {isNote && r.note_content && (
                                <p className="text-[13px] text-stone-600 rounded px-3 py-2.5 mb-1.5 leading-relaxed border border-amber-100 bg-amber-50 whitespace-pre-line">
                                  {r.note_content}
                                </p>
                              )}
                              <p className="text-[12px] text-[rgba(31,36,33,0.35)] mb-3">{formatDate(r.created_at)}</p>

                              {!isNote && (
                                <motion.button whileTap={{ scale: 0.97 }}
                                  onClick={() => handleOpen(r)}
                                  disabled={downloading === r.id}
                                  className="flex items-center gap-1.5 px-3.5 py-2 rounded text-white text-[13px] font-bold transition-colors disabled:opacity-40"
                                  style={{ background: 'var(--color-accent)' }}
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                  {downloading === r.id ? 'Opening…' : r.resource_type === 'file' ? 'Open' : 'Visit'}
                                </motion.button>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
