import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Paperclip, Link2, FileText, ExternalLink, FolderOpen, Search, X, BookOpen } from 'lucide-react';
import {
  fetchStudentResources, getResourceDownloadUrl, trackResourceDownload,
  RESOURCE_TYPE_META, RESOURCE_CATEGORY_META,
  type Resource, type ResourceType, type ResourceCategory,
} from '../../../lib/resources';
import { supabaseAdmin } from '../../../lib/supabase';
import type { StudentSession } from '../../../lib/auth';

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
  const [expandedNote, setExpandedNote] = useState<number | null>(null);
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

  const unviewedIds = new Set(
    resources.filter(r => !recentlyViewed.includes(r.id)).map(r => r.id)
  );

  const recommended = resources
    .filter(r => unviewedIds.has(r.id))
    .slice(0, 3);

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
    <div className="px-4 py-6 sm:p-6 md:p-8 max-w-6xl w-full mx-auto">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        className="mb-6"
      >
        <span className="eyebrow">Resources</span>
        <h1 className="font-display font-black text-brand-dark text-2xl md:text-3xl" style={{ letterSpacing: '-0.03em' }}>
          Class Resources
        </h1>
        <p className="text-sm text-stone-500 mt-1">Study materials from your teachers.</p>
      </motion.div>

      {!loading && resources.length > 0 && (
        <>
          {/* Recommended section */}
          {recommended.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05, ease: [0.23, 1, 0.32, 1] }}
              className="mb-6"
            >
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-stone-500 mb-3">
                Suggested For You
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {recommended.map(r => {
                  const meta = RESOURCE_TYPE_META[r.resource_type];
                  const Icon = TypeIcon[r.resource_type];
                  return (
                    <button
                      key={r.id}
                      onClick={() => handleOpen(r)}
                      disabled={downloading === r.id}
                      className="card-premium bg-white border border-brand-border rounded-[24px] p-4 text-left hover:border-stone-400 hover:shadow-sm transition-all group disabled:opacity-40"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${meta.badge}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-stone-400 group-hover:text-stone-600 transition-colors mt-0.5" />
                      </div>
                      <p className="font-black text-stone-900 text-sm leading-snug mb-1">{r.title}</p>
                      {r.subject_label && (
                        <p className="text-[11px] text-stone-500">{r.subject_label}</p>
                      )}
                      {r.description && (
                        <p className="text-[11px] text-stone-500 mt-0.5 line-clamp-1">{r.description}</p>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Recently Viewed section */}
          {recentResources.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, ease: [0.23, 1, 0.32, 1] }}
              className="mb-6"
            >
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-stone-500 mb-3">
                Recently Viewed
              </p>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {recentResources.map(r => {
                  const meta = RESOURCE_TYPE_META[r.resource_type];
                  const Icon = TypeIcon[r.resource_type];
                  return (
                    <button
                      key={r.id}
                      onClick={() => handleOpen(r)}
                      disabled={downloading === r.id}
                      className="shrink-0 bg-white border border-brand-border rounded-xl px-3 py-2.5 text-left hover:border-stone-400 transition-colors flex items-center gap-2.5 min-w-[180px] max-w-[220px] disabled:opacity-40"
                    >
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${meta.badge}`}>
                        <Icon className="w-3 h-3" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-stone-900 truncate">{r.title}</p>
                        <p className="text-[10px] text-stone-500 truncate">{r.subject_label ?? meta.label}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Search + Filters */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
            className="space-y-3 mb-5"
          >
            {/* Search bar */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search resources…"
                className="w-full pl-10 pr-10 py-3 rounded-xl border border-brand-border text-sm font-bold text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-400 focus:ring-2 focus:ring-brand-dark/10 bg-white"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3.5 top-1/2 -translate-y-1/2">
                  <X className="w-3.5 h-3.5 text-stone-500" />
                </button>
              )}
            </div>

            {/* Subject filter pills */}
            {subjectOptions.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {(['all', ...subjectOptions] as string[]).map(s => (
                  <button
                    key={s}
                    onClick={() => setFilterSubject(s)}
                    className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-black transition-colors whitespace-nowrap ${
                      filterSubject === s
                        ? 'bg-brand-dark text-white'
                        : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                    }`}
                  >
                    {s === 'all' ? 'All Subjects' : s}
                  </button>
                ))}
              </div>
            )}

            {/* Type filter pills */}
            <div className="flex gap-2">
              {(['all', 'file', 'link', 'note'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-colors ${
                    filterType === t
                      ? 'bg-brand-dark text-white'
                      : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                  }`}
                >
                  {t === 'all' ? 'All Types' : RESOURCE_TYPE_META[t].label + 's'}
                </button>
              ))}
            </div>

            {/* Category filter pills */}
            <div className="flex gap-2">
              {(['all', 'homework', 'notes', 'general'] as (ResourceCategory | 'all')[]).map(c => (
                <button
                  key={c}
                  onClick={() => setFilterCategory(c)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-colors ${
                    filterCategory === c
                      ? 'bg-brand-dark text-white'
                      : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                  }`}
                >
                  {c === 'all' ? 'All Tags' : RESOURCE_CATEGORY_META[c].label}
                </button>
              ))}
            </div>

            {/* Result count */}
            <p className="text-xs font-bold text-stone-500">
              {filtered.length} resource{filtered.length !== 1 ? 's' : ''}
              {filterSubject !== 'all' && ` · ${filterSubject}`}
            </p>
          </motion.div>
        </>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-5 h-5 border-2 border-brand-border border-t-stone-700 rounded-full animate-spin" />
        </div>
      ) : resources.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <FolderOpen className="w-10 h-10 text-stone-200 mb-4" />
          <p className="text-sm font-black text-stone-500 mb-1">No resources yet.</p>
          <p className="text-xs text-stone-400">Your teachers haven't uploaded any materials yet.</p>
          <button
            onClick={() => onNavigate('library')}
            className="mt-5 flex items-center gap-2 px-4 py-2.5 bg-brand-dark text-white text-xs font-black rounded-xl hover:bg-stone-700 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" />
            Open Library Instead
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Search className="w-8 h-8 text-stone-200 mb-3" />
          <p className="text-sm font-black text-stone-500 mb-1">No results.</p>
          <button
            onClick={() => { setSearch(''); setFilterSubject('all'); setFilterType('all'); }}
            className="mt-2 text-xs font-black text-stone-500 hover:text-stone-800 transition-colors"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((r, i) => {
            const meta = RESOURCE_TYPE_META[r.resource_type];
            const Icon = TypeIcon[r.resource_type];
            const isNote = r.resource_type === 'note';
            const noteExpanded = expandedNote === r.id;
            const wasViewed = recentlyViewed.includes(r.id);

            return (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.03, 0.15), duration: 0.18 }}
                className="card-premium bg-white rounded-[24px] border border-brand-border px-5 py-4 hover:border-stone-300 transition-colors"
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${meta.badge}`}>
                    <Icon className="w-4 h-4" />
                  </div>

                  {/* Body */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <p className="text-sm font-black text-stone-900">{r.title}</p>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${RESOURCE_CATEGORY_META[r.category].badge}`}>
                        {RESOURCE_CATEGORY_META[r.category].label}
                      </span>
                      {r.subject_label && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-500">
                          {r.subject_label}
                        </span>
                      )}
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${meta.badge}`}>
                        {meta.label}
                      </span>
                      {wasViewed && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-50 text-stone-500 border border-brand-border/60">
                          Viewed
                        </span>
                      )}
                    </div>
                    {r.description && (
                      <p className="text-xs text-stone-500 mb-1 leading-relaxed">{r.description}</p>
                    )}
                    {r.resource_type === 'link' && r.link_url && (
                      <p className="text-xs text-violet-500 truncate">{r.link_url}</p>
                    )}
                    {r.resource_type === 'file' && r.file_name && (
                      <p className="text-xs text-stone-500">{r.file_name}</p>
                    )}
                    {isNote && r.note_content && (
                      <AnimatePresence initial={false}>
                        {noteExpanded ? (
                          <motion.p
                            key="expanded"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="text-xs text-stone-600 bg-amber-50 rounded-xl px-3 py-2.5 mt-2 leading-relaxed border border-amber-100 overflow-hidden"
                          >
                            {r.note_content}
                          </motion.p>
                        ) : (
                          <p key="collapsed" className="text-xs text-stone-500 mt-0.5 truncate">{r.note_content}</p>
                        )}
                      </AnimatePresence>
                    )}
                    <p className="text-[10px] text-stone-400 mt-1.5">{formatDate(r.created_at)}</p>
                  </div>

                  {/* Action */}
                  <div className="shrink-0">
                    {isNote ? (
                      <button
                        onClick={() => setExpandedNote(noteExpanded ? null : r.id)}
                        className="px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 text-xs font-black transition-colors"
                      >
                        {noteExpanded ? 'Collapse' : 'Read'}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleOpen(r)}
                        disabled={downloading === r.id}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-brand-dark text-white text-xs font-black hover:bg-stone-700 transition-colors disabled:opacity-40"
                      >
                        <ExternalLink className="w-3 h-3" />
                        {downloading === r.id ? 'Opening…' : r.resource_type === 'file' ? 'Open' : 'Visit'}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
