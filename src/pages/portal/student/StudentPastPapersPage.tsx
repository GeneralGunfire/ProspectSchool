import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, Search, X, ExternalLink, FolderOpen, SlidersHorizontal, CheckCircle2 } from 'lucide-react';
import {
  fetchAllPastPapers, getPastPaperDownloadUrl, type PastPaper,
} from '../../../lib/pastPapers';
import { fetchSubjects, type Subject } from '../../../lib/students';
import type { StudentSession } from '../../../lib/auth';

const GRADES = [8, 9, 10, 11, 12];
const TERMS  = [1, 2, 3, 4];

interface StudentPastPapersPageProps {
  session: StudentSession;
  onNavigate?: (page: string) => void;
}

export default function StudentPastPapersPage({ session }: StudentPastPapersPageProps) {
  const [papers, setPapers]       = useState<PastPaper[]>([]);
  const [subjects, setSubjects]   = useState<Subject[]>([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [filterGrade, setFilterGrade]     = useState('');
  const [filterYear, setFilterYear]       = useState('');
  const [filterTerm, setFilterTerm]       = useState('');
  const [downloading, setDownloading]     = useState<number | null>(null);
  const [isFilterOpen, setIsFilterOpen]   = useState(false);
  const [memoLoading, setMemoLoading]     = useState<number | null>(null);
  const [recentlyOpened, setRecentlyOpened] = useState<number[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(`prospect_recent_papers_${session.student_id}`) ?? '[]');
    } catch { return []; }
  });

  useEffect(() => {
    Promise.all([
      fetchAllPastPapers(session.school_id),
      fetchSubjects(),
    ]).then(([p, s]) => {
      setPapers(p);
      setSubjects(s);
      setLoading(false);
    });
  }, []);

  // Derive unique years from papers
  const yearOptions = useMemo(() => {
    return [...new Set(papers.map(p => p.year))].sort((a, b) => b - a);
  }, [papers]);

  // Filter
  const filtered = useMemo(() => {
    return papers.filter(p => {
      if (filterSubject && String(p.subject_id) !== filterSubject) return false;
      if (filterGrade   && String(p.grade) !== filterGrade)         return false;
      if (filterYear    && String(p.year) !== filterYear)            return false;
      if (filterTerm    && String(p.term) !== filterTerm)            return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          p.subject_label?.toLowerCase().includes(q) ||
          String(p.year).includes(q)
        );
      }
      return true;
    });
  }, [papers, search, filterSubject, filterGrade, filterYear, filterTerm]);

  const activeFilterCount = [filterSubject, filterGrade, filterYear, filterTerm].filter(Boolean).length;
  const hasFilters = search || activeFilterCount > 0;

  function clearFilters() {
    setSearch('');
    setFilterSubject('');
    setFilterGrade('');
    setFilterYear('');
    setFilterTerm('');
  }

  async function handleOpen(p: PastPaper) {
    setRecentlyOpened(prev => {
      const updated = [p.id, ...prev.filter(id => id !== p.id)].slice(0, 5);
      localStorage.setItem(`prospect_recent_papers_${session.student_id}`, JSON.stringify(updated));
      return updated;
    });
    setDownloading(p.id);
    const url = await getPastPaperDownloadUrl(p.file_url);
    setDownloading(null);
    if (url) window.open(url, '_blank');
  }

  async function handleShowMemo(p: PastPaper) {
    if (!p.memo_url) return;
    setMemoLoading(p.id);
    const url = await getPastPaperDownloadUrl(p.memo_url);
    setMemoLoading(null);
    if (url) window.open(url, '_blank');
  }

  // Recently opened papers (in order)
  const recentPapers = recentlyOpened
    .map(id => papers.find(p => p.id === id))
    .filter(Boolean) as PastPaper[];

  // Recommended papers — grade match, not yet opened, most recent year first
  const unopenedIds = new Set(
    papers.filter(p => !recentlyOpened.includes(p.id)).map(p => p.id)
  );
  const recommended = papers
    .filter(p => p.grade === session.grade && unopenedIds.has(p.id))
    .sort((a, b) => b.year - a.year || (b.term ?? 0) - (a.term ?? 0))
    .slice(0, 3);

  // Difficulty label — derived from title keywords
  function difficultyLabel(p: PastPaper): { label: string; color: string } {
    const t = p.title.toLowerCase();
    if (t.includes('exam') || t.includes('final')) return { label: 'Exam', color: 'bg-red-50 text-red-600 border-red-100' };
    if (t.includes('test') || t.includes('assessment')) return { label: 'Test', color: 'bg-amber-50 text-amber-600 border-amber-100' };
    if (t.includes('trial') || t.includes('prelim')) return { label: 'Trial', color: 'bg-violet-50 text-violet-600 border-violet-100' };
    return { label: 'Paper', color: 'bg-stone-100 text-stone-500 border-stone-200' };
  }

  return (
    <div className="p-5 md:p-8 max-w-5xl w-full mx-auto">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        className="mb-6"
      >
        <p className="text-[11px] font-black uppercase tracking-[0.22em] text-stone-400 mb-1">Past Papers</p>
        <h1 className="font-black text-brand-dark text-2xl md:text-3xl" style={{ letterSpacing: '-0.03em' }}>
          Past Papers
        </h1>
        <p className="text-sm text-stone-400 mt-1">Exam papers uploaded by your school.</p>
      </motion.div>

      {!loading && papers.length > 0 && (
        <>
          {/* ── Recommended section ── */}
          {recommended.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05, ease: [0.23, 1, 0.32, 1] }}
              className="mb-6"
            >
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-stone-400 mb-3">
                Recommended For You
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {recommended.map(p => {
                  const diff = difficultyLabel(p);
                  return (
                    <div key={p.id} className="bg-white border border-stone-200 rounded-2xl p-4 hover:border-stone-400 hover:shadow-sm transition-all">
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-8 h-8 rounded-xl bg-stone-100 flex items-center justify-center">
                          <FileText className="w-4 h-4 text-stone-600" />
                        </div>
                        {p.memo_url && (
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                            Memo
                          </span>
                        )}
                      </div>
                      <p className="font-black text-stone-900 text-sm leading-snug mb-1">{p.title}</p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {p.subject_label && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-500">{p.subject_label}</span>
                        )}
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-500">{p.year}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${diff.color}`}>{diff.label}</span>
                      </div>
                      <button
                        onClick={() => handleOpen(p)}
                        disabled={downloading === p.id}
                        className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-stone-900 text-white text-xs font-black hover:bg-stone-700 transition-colors disabled:opacity-40"
                      >
                        <ExternalLink className="w-3 h-3" />
                        {downloading === p.id ? 'Opening…' : 'Open Paper'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ── Recently Opened ── */}
          {recentPapers.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, ease: [0.23, 1, 0.32, 1] }}
              className="mb-6"
            >
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-stone-400 mb-3">
                Recently Opened
              </p>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {recentPapers.map(p => (
                  <button
                    key={p.id}
                    onClick={() => handleOpen(p)}
                    disabled={downloading === p.id}
                    className="shrink-0 bg-white border border-stone-200 rounded-xl px-3 py-2.5 text-left hover:border-stone-400 transition-colors min-w-40 max-w-50 disabled:opacity-40"
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <FileText className="w-3 h-3 text-stone-400 shrink-0" />
                      {p.memo_url && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />}
                    </div>
                    <p className="text-xs font-bold text-stone-900 truncate">{p.title}</p>
                    <p className="text-[10px] text-stone-400 truncate">{p.subject_label ?? `Grade ${p.grade}`} · {p.year}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── Search + Filters ── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
            className="space-y-3 mb-5"
          >
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300 pointer-events-none" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search by title or subject…"
                  className="w-full pl-10 pr-9 py-3 rounded-xl border border-stone-200 text-sm font-bold text-stone-900 placeholder:text-stone-300 focus:outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-900/10 bg-white"
                />
                {search && (
                  <button onClick={() => setSearch('')} className="absolute right-3.5 top-1/2 -translate-y-1/2">
                    <X className="w-3.5 h-3.5 text-stone-400" />
                  </button>
                )}
              </div>
              <button
                onClick={() => setIsFilterOpen(v => !v)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-colors border whitespace-nowrap ${
                  isFilterOpen
                    ? 'bg-brand-dark text-white border-brand-dark'
                    : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Filters
                {activeFilterCount > 0 && (
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black ${
                    isFilterOpen ? 'bg-white text-brand-dark' : 'bg-brand-dark text-white'
                  }`}>
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>

            {/* Collapsible filter panel */}
            <AnimatePresence>
              {isFilterOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ ease: 'easeOut', duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-5">

                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-stone-400 mb-2">Subject</p>
                      <div className="flex flex-wrap gap-2">
                        {subjects.filter(s => papers.some(p => p.subject_id === s.id)).map(s => (
                          <button key={s.id}
                            onClick={() => setFilterSubject(filterSubject === String(s.id) ? '' : String(s.id))}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border ${
                              filterSubject === String(s.id)
                                ? 'bg-brand-dark text-white border-brand-dark'
                                : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
                            }`}
                          >{s.label}</button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-stone-400 mb-2">Grade</p>
                      <div className="flex flex-wrap gap-2">
                        {GRADES.filter(g => papers.some(p => p.grade === g)).map(g => (
                          <button key={g}
                            onClick={() => setFilterGrade(filterGrade === String(g) ? '' : String(g))}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border ${
                              filterGrade === String(g)
                                ? 'bg-brand-dark text-white border-brand-dark'
                                : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
                            }`}
                          >Grade {g}</button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-stone-400 mb-2">Year</p>
                      <div className="flex flex-wrap gap-2">
                        {yearOptions.map(y => (
                          <button key={y}
                            onClick={() => setFilterYear(filterYear === String(y) ? '' : String(y))}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border ${
                              filterYear === String(y)
                                ? 'bg-brand-dark text-white border-brand-dark'
                                : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
                            }`}
                          >{y}</button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-stone-400 mb-2">Term</p>
                      <div className="flex flex-wrap gap-2">
                        {TERMS.filter(t => papers.some(p => p.term === t)).map(t => (
                          <button key={t}
                            onClick={() => setFilterTerm(filterTerm === String(t) ? '' : String(t))}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border ${
                              filterTerm === String(t)
                                ? 'bg-brand-dark text-white border-brand-dark'
                                : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
                            }`}
                          >Term {t}</button>
                        ))}
                      </div>
                    </div>

                    {activeFilterCount > 0 && (
                      <div className="flex justify-end pt-1 border-t border-stone-100">
                        <button onClick={clearFilters}
                          className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-stone-400 hover:text-stone-700 transition-colors">
                          <X className="w-3.5 h-3.5" />
                          Clear {activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''}
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-stone-400">
                {filtered.length} paper{filtered.length !== 1 ? 's' : ''}
              </p>
              {hasFilters && (
                <button onClick={clearFilters}
                  className="text-xs font-black text-stone-400 hover:text-stone-700 transition-colors">
                  Clear all
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}

      {/* ── Paper list ── */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-5 h-5 border-2 border-stone-200 border-t-stone-700 rounded-full animate-spin" />
        </div>
      ) : papers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <FolderOpen className="w-10 h-10 text-stone-200 mb-4" />
          <p className="text-sm font-black text-stone-400 mb-1">No past papers yet.</p>
          <p className="text-xs text-stone-300">Papers uploaded by your teachers will appear here.</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Search className="w-8 h-8 text-stone-200 mb-3" />
          <p className="text-sm font-black text-stone-400 mb-1">No papers match your filters.</p>
          <button onClick={clearFilters}
            className="mt-2 text-xs font-black text-stone-500 hover:text-stone-800 transition-colors">
            Clear filters
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((p, i) => {
            const diff = difficultyLabel(p);
            const wasOpened = recentlyOpened.includes(p.id);
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.02, 0.12), duration: 0.18 }}
                className="bg-white rounded-2xl border border-stone-200 px-5 py-4 flex items-center gap-4 hover:border-stone-300 transition-colors"
              >
                {/* Icon with memo dot */}
                <div className="relative w-9 h-9 shrink-0">
                  <div className="w-9 h-9 rounded-xl bg-stone-100 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-stone-600" />
                  </div>
                  {p.memo_url && (
                    <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-bold text-stone-900 truncate">{p.title}</p>
                    {wasOpened && (
                      <span className="shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-stone-50 text-stone-400 border border-stone-100">
                        Opened
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {p.subject_label && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-500">{p.subject_label}</span>
                    )}
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-500">Grade {p.grade}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-500">{p.year}</span>
                    {p.term && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-500">Term {p.term}</span>
                    )}
                    {p.paper_number > 1 && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-500">Paper {p.paper_number}</span>
                    )}
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${diff.color}`}>{diff.label}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleOpen(p)}
                    disabled={downloading === p.id}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-brand-dark text-white text-xs font-black hover:bg-stone-800 transition-colors disabled:opacity-40"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    {downloading === p.id ? 'Opening…' : 'Open'}
                  </button>
                  {p.memo_url && (
                    <button
                      onClick={() => handleShowMemo(p)}
                      disabled={memoLoading === p.id}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black transition-colors disabled:opacity-40 bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {memoLoading === p.id ? 'Opening…' : 'Memo'}
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
