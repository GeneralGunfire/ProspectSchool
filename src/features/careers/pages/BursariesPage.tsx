import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, SlidersHorizontal, X, CheckCircle2, ExternalLink, Bookmark, ChevronDown, ArrowRight } from 'lucide-react';
import { bursaries, type Bursary } from '../data/bursaries';
import { fetchSavedBursaryIds, toggleSavedBursary } from '../../../lib/myFuture';
import { getStudentSession } from '../../../lib/auth';

const LOAD_INCREMENT = 20;

// ─── Tracker types ──────────────────────────────────────────────────────────
type TrackerStatus = 'interested' | 'applying' | 'submitted' | 'awaiting' | 'successful';

interface TrackerEntry {
  id: string;
  status: TrackerStatus;
  updatedAt: string;
}

const TRACKER_STAGES: { value: TrackerStatus; label: string; color: string }[] = [
  { value: 'interested', label: 'Interested',        color: 'text-stone-600' },
  { value: 'applying',   label: 'Applying',          color: 'text-blue-600' },
  { value: 'submitted',  label: 'Submitted',         color: 'text-violet-600' },
  { value: 'awaiting',   label: 'Awaiting Response', color: 'text-amber-600' },
  { value: 'successful', label: 'Successful',        color: 'text-emerald-600' },
];

const TRACKER_COLORS: Record<TrackerStatus, { bg: string; text: string; dot: string }> = {
  interested: { bg: 'bg-stone-100',  text: 'text-stone-700',  dot: 'bg-stone-400' },
  applying:   { bg: 'bg-blue-50',    text: 'text-blue-700',   dot: 'bg-blue-500' },
  submitted:  { bg: 'bg-violet-50',  text: 'text-violet-700', dot: 'bg-violet-500' },
  awaiting:   { bg: 'bg-amber-50',   text: 'text-amber-700',  dot: 'bg-amber-500' },
  successful: { bg: 'bg-emerald-50', text: 'text-emerald-700',dot: 'bg-emerald-500' },
};

// ─── Match score ─────────────────────────────────────────────────────────────
function getBursaryMatchScore(
  bursary: Bursary,
  selectedField: string | null,
  selectedIncome: string | null,
  selectedCategory: string | null,
): number {
  let score = 0;
  const factors = 100;

  // Field match (worth 40 points)
  if (selectedField) {
    if (bursary.studyOptions.fields.includes(selectedField)) score += 40;
  } else {
    score += 40;
  }

  // Income match (worth 35 points)
  if (selectedIncome) {
    const max = bursary.requirements.maxIncome;
    const noLimit = !max || max.includes('No limit') || max.includes('Merit');
    const matches =
      noLimit ||
      (selectedIncome === 'low'     && (max.includes('200') || max.includes('250'))) ||
      (selectedIncome === 'mid-low' && (max.includes('300') || max.includes('350'))) ||
      (selectedIncome === 'mid'     && (max.includes('380') || max.includes('400'))) ||
      (selectedIncome === 'any'     && noLimit);
    if (matches) score += 35;
  } else {
    score += 35;
  }

  // Category match (worth 25 points)
  if (selectedCategory) {
    if (bursary.category === selectedCategory) score += 25;
  } else {
    score += 25;
  }

  return Math.round((score / factors) * 100);
}

// ─── Component ───────────────────────────────────────────────────────────────
function BursariesPage({ onNavigate }: { onNavigate: (page: any) => void }) {
  const [searchQuery, setSearchQuery]           = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedField, setSelectedField]       = useState<string | null>(null);
  const [selectedIncome, setSelectedIncome]     = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen]         = useState(false);
  const [savedBursaries, setSavedBursaries]     = useState<string[]>([]);
  const [displayCount, setDisplayCount]         = useState(LOAD_INCREMENT);
  const [tracker, setTracker]                   = useState<Record<string, TrackerEntry>>({});
  const [openTrackerId, setOpenTrackerId]       = useState<string | null>(null);

  // Load saved bursaries from Supabase
  useEffect(() => {
    const session = getStudentSession();
    if (!session) return;
    fetchSavedBursaryIds(session.student_id, session.school_id)
      .then(ids => setSavedBursaries(ids))
      .catch(() => {});
  }, []);

  // Load tracker from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem('prospect_bursary_tracker');
      if (raw) setTracker(JSON.parse(raw));
    } catch {}
  }, []);

  // Close tracker dropdown on outside click
  useEffect(() => {
    if (!openTrackerId) return;
    const handler = () => setOpenTrackerId(null);
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [openTrackerId]);

  const categories = useMemo(() => Array.from(new Set(bursaries.map((b) => b.category))).sort(), []);

  const fields = useMemo(() => {
    const all = new Set<string>();
    bursaries.forEach((b) => b.studyOptions.fields.forEach((f) => all.add(f)));
    return Array.from(all).sort();
  }, []);

  const incomeRanges = [
    { value: 'low',     label: 'Under R200k' },
    { value: 'mid-low', label: 'R200k – R350k' },
    { value: 'mid',     label: 'R350k – R450k' },
    { value: 'any',     label: 'No income limit' },
  ];

  const activeFilterCount = [selectedCategory, selectedField, selectedIncome].filter(Boolean).length;

  const filteredBursaries = useMemo(() => {
    let r = bursaries;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      r = r.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.provider.toLowerCase().includes(q) ||
          b.category.toLowerCase().includes(q) ||
          b.description.toLowerCase().includes(q) ||
          b.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }
    if (selectedCategory) r = r.filter((b) => b.category === selectedCategory);
    if (selectedField)    r = r.filter((b) => b.studyOptions.fields.includes(selectedField));
    if (selectedIncome) {
      r = r.filter((b) => {
        const max = b.requirements.maxIncome;
        if (!max || max.includes('No limit') || max.includes('Merit')) return selectedIncome === 'any';
        if (selectedIncome === 'low')     return max.includes('200') || max.includes('250');
        if (selectedIncome === 'mid-low') return max.includes('300') || max.includes('350');
        if (selectedIncome === 'mid')     return max.includes('380') || max.includes('400');
        return true;
      });
    }

    // Sort by match score when filters are active
    if (activeFilterCount > 0) {
      r = [...r].sort((a, b) => {
        const scoreA = getBursaryMatchScore(a, selectedField, selectedIncome, selectedCategory);
        const scoreB = getBursaryMatchScore(b, selectedField, selectedIncome, selectedCategory);
        return scoreB - scoreA;
      });
    }

    return r;
  }, [searchQuery, selectedCategory, selectedField, selectedIncome, activeFilterCount]);

  const displayed = filteredBursaries.slice(0, displayCount);
  const hasMore   = filteredBursaries.length > displayCount;

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setSelectedField(null);
    setSelectedIncome(null);
    setDisplayCount(LOAD_INCREMENT);
  };

  const toggleSave = async (id: string) => {
    const session = getStudentSession();
    if (!session) {
      // Guest: just toggle locally
      setSavedBursaries(prev =>
        prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
      );
      return;
    }
    // Optimistic update
    setSavedBursaries(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
    // Persist in background
    toggleSavedBursary(id).catch(() => {});
  };

  const updateTracker = (id: string, status: TrackerStatus | null) => {
    setTracker(prev => {
      const next = { ...prev };
      if (status === null) {
        delete next[id];
        // Unsave when removing from tracker
        if (savedBursaries.includes(id)) {
          setSavedBursaries(p => p.filter(s => s !== id));
          toggleSavedBursary(id).catch(() => {});
        }
      } else {
        next[id] = { id, status, updatedAt: new Date().toISOString() };
        // Auto-save when adding to tracker
        if (!savedBursaries.includes(id)) {
          setSavedBursaries(p => [...p, id]);
          toggleSavedBursary(id).catch(() => {});
        }
      }
      localStorage.setItem('prospect_bursary_tracker', JSON.stringify(next));
      return next;
    });
  };

  const handleViewDetail = (id: string) => {
    sessionStorage.setItem('selectedBursaryId', id);
    onNavigate('bursary');
  };

  return (
    <div className="min-h-screen" style={{ background: '#F5F0E8' }}>
      <div className="pt-24 pb-16 px-4 md:px-8 max-w-4xl mx-auto">

        {/* Page header */}
        <div className="mb-10 pt-2">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 mb-3">Financial Aid</p>
          <h1 className="text-3xl md:text-4xl font-black text-stone-900 mb-3" style={{ letterSpacing: '-0.025em' }}>
            Bursaries
          </h1>
          <p className="text-[15px] leading-[1.65] text-stone-500">
            {filteredBursaries.length} bursaries, scholarships, and grants for South African students.
          </p>
        </div>

        {/* Sticky search + filters */}
        <div className="mb-10 sticky top-20 z-40 py-4 -mx-4 px-4 bg-white/95 backdrop-blur-sm border-b border-stone-100">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
            <div className="relative grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search bursaries, providers, or fields..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setDisplayCount(LOAD_INCREMENT); }}
                className="w-full bg-white border border-stone-200 rounded-xl pl-11 pr-10 py-3 text-sm text-stone-900 placeholder:text-stone-400 outline-none focus:border-stone-400 transition-colors"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <button
              onClick={() => setIsFilterOpen((v) => !v)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-colors border whitespace-nowrap ${
                isFilterOpen ? 'bg-brand-dark text-white border-brand-dark' : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${isFilterOpen ? 'bg-white text-brand-dark' : 'bg-brand-dark text-white'}`}>
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ ease: 'easeOut', duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="pt-6 mt-4 border-t border-stone-100 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Category */}
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 mb-3">Category</p>
                      <div className="flex flex-wrap gap-2">
                        {categories.map((cat) => (
                          <button
                            key={cat}
                            onClick={() => { setSelectedCategory(selectedCategory === cat ? null : cat); setDisplayCount(LOAD_INCREMENT); }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors border ${
                              selectedCategory === cat ? 'bg-brand-dark text-white border-brand-dark' : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>
                    {/* Field of study */}
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 mb-3">Field of Study</p>
                      <div className="flex flex-wrap gap-2">
                        {fields.slice(0, 8).map((field) => (
                          <button
                            key={field}
                            onClick={() => { setSelectedField(selectedField === field ? null : field); setDisplayCount(LOAD_INCREMENT); }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors border ${
                              selectedField === field ? 'bg-brand-dark text-white border-brand-dark' : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
                            }`}
                          >
                            {field}
                          </button>
                        ))}
                      </div>
                    </div>
                    {/* Income */}
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 mb-3">Household Income</p>
                      <div className="flex flex-wrap gap-2">
                        {incomeRanges.map((r) => (
                          <button
                            key={r.value}
                            onClick={() => { setSelectedIncome(selectedIncome === r.value ? null : r.value); setDisplayCount(LOAD_INCREMENT); }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors border ${
                              selectedIncome === r.value ? 'bg-brand-dark text-white border-brand-dark' : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
                            }`}
                          >
                            {r.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {activeFilterCount > 0 && (
                    <div className="flex justify-end pt-2 border-t border-stone-50">
                      <button onClick={clearFilters} className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-stone-400 hover:text-stone-700 transition-colors">
                        <X className="w-3.5 h-3.5" />
                        Clear {activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''}
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Tracker summary bar */}
        {Object.keys(tracker).length > 0 && (
          <div className="mb-6 bg-white rounded-2xl border border-stone-200 px-5 py-4">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-stone-400 mb-3">
              My Applications
            </p>
            <div className="flex flex-wrap gap-2">
              {TRACKER_STAGES.map(stage => {
                const count = Object.values(tracker).filter(t => t.status === stage.value).length;
                if (count === 0) return null;
                return (
                  <div key={stage.value} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-black ${TRACKER_COLORS[stage.value].bg} ${TRACKER_COLORS[stage.value].text}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${TRACKER_COLORS[stage.value].dot}`} />
                    {stage.label}: {count}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Bursary list */}
        {displayed.length > 0 ? (
          <div className="space-y-4">
            {displayed.map((bursary, index) => {
              const saved        = savedBursaries.includes(bursary.id);
              const trackerEntry = tracker[bursary.id] ?? null;
              const matchScore   = getBursaryMatchScore(bursary, selectedField, selectedIncome, selectedCategory);
              return (
                <motion.div
                  key={bursary.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index, 7) * 0.04, ease: 'easeOut' }}
                  className="group bg-white border border-stone-200 rounded-xl p-5 hover:border-stone-300 transition-all cursor-pointer"
                  onClick={() => handleViewDetail(bursary.id)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      {/* Meta row */}
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="text-[9px] font-black uppercase tracking-[0.18em] text-stone-400">{bursary.category}</span>
                        <span className="text-stone-200">·</span>
                        <span className="text-[9px] font-black uppercase tracking-[0.18em] text-stone-400">Deadline: {bursary.applicationProcess.deadline}</span>
                      </div>

                      {/* Name + provider */}
                      <h3 className="text-[16px] font-black text-stone-900 mb-0.5 leading-snug group-hover:text-stone-700 transition-colors" style={{ letterSpacing: '-0.018em' }}>
                        {bursary.name}
                      </h3>
                      <p className="text-xs font-medium text-stone-400 mb-3">{bursary.provider}</p>

                      {/* Description */}
                      <p className="text-sm leading-[1.6] text-stone-500 line-clamp-2 mb-3">{bursary.description}</p>

                      {/* Footer stats */}
                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-stone-400 font-medium">
                        <span>Min marks: <span className="text-stone-600 font-bold">{bursary.requirements.minMarks}</span></span>
                        {bursary.studyOptions.fields.slice(0, 2).join(', ') && (
                          <>
                            <span className="text-stone-200">·</span>
                            <span>{bursary.studyOptions.fields.slice(0, 2).join(', ')}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      {/* Match score pill — only when filters active */}
                      {activeFilterCount > 0 && (
                        <div className={`text-center px-2.5 py-1 rounded-xl ${
                          matchScore >= 80 ? 'bg-emerald-50 border border-emerald-200' :
                          matchScore >= 50 ? 'bg-amber-50 border border-amber-200' :
                                             'bg-stone-100 border border-stone-200'
                        }`}>
                          <p className={`text-sm font-black leading-none ${
                            matchScore >= 80 ? 'text-emerald-700' :
                            matchScore >= 50 ? 'text-amber-700' :
                                               'text-stone-500'
                          }`}>{matchScore}%</p>
                          <p className={`text-[9px] font-bold uppercase tracking-wider mt-0.5 ${
                            matchScore >= 80 ? 'text-emerald-500' :
                            matchScore >= 50 ? 'text-amber-500' :
                                               'text-stone-400'
                          }`}>match</p>
                        </div>
                      )}

                      {/* Tracker button */}
                      <div className="relative" onClick={e => e.stopPropagation()}>
                        {trackerEntry ? (
                          <button
                            onClick={() => setOpenTrackerId(openTrackerId === bursary.id ? null : bursary.id)}
                            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-black border ${TRACKER_COLORS[trackerEntry.status].bg} ${TRACKER_COLORS[trackerEntry.status].text} border-current/20`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${TRACKER_COLORS[trackerEntry.status].dot}`} />
                            {TRACKER_STAGES.find(s => s.value === trackerEntry.status)?.label}
                          </button>
                        ) : (
                          <button
                            onClick={() => setOpenTrackerId(openTrackerId === bursary.id ? null : bursary.id)}
                            aria-label={saved ? 'Tracked' : 'Track this bursary'}
                            className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all ${
                              saved ? 'bg-brand-dark border-brand-dark text-white' : 'border-stone-200 text-stone-400 hover:border-stone-400'
                            }`}
                          >
                            <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-white' : ''}`} />
                          </button>
                        )}

                        {/* Dropdown */}
                        <AnimatePresence>
                          {openTrackerId === bursary.id && (
                            <motion.div
                              initial={{ opacity: 0, y: 4, scale: 0.97 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 4, scale: 0.97 }}
                              transition={{ duration: 0.15 }}
                              className="absolute right-0 top-full mt-1.5 z-50 bg-white rounded-2xl border border-stone-200 shadow-lg py-2 min-w-45"
                            >
                              {TRACKER_STAGES.map(stage => (
                                <button
                                  key={stage.value}
                                  onClick={() => { updateTracker(bursary.id, stage.value); setOpenTrackerId(null); }}
                                  className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-[13px] font-bold hover:bg-stone-50 transition-colors ${
                                    trackerEntry?.status === stage.value ? stage.color + ' bg-stone-50' : 'text-stone-700'
                                  }`}
                                >
                                  <span className={`w-2 h-2 rounded-full ${TRACKER_COLORS[stage.value].dot}`} />
                                  {stage.label}
                                  {trackerEntry?.status === stage.value && <CheckCircle2 className="w-3.5 h-3.5 ml-auto" />}
                                </button>
                              ))}
                              {trackerEntry && (
                                <>
                                  <div className="border-t border-stone-100 my-1" />
                                  <button
                                    onClick={() => { updateTracker(bursary.id, null); setOpenTrackerId(null); }}
                                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-[13px] font-bold text-red-400 hover:bg-red-50 transition-colors"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                    Remove from tracker
                                  </button>
                                </>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <ArrowRight className="w-4 h-4 text-stone-200 group-hover:text-stone-500 group-hover:translate-x-0.5 transition-all duration-150 mt-1" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          /* Empty state */
          <div className="py-24 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-center mb-6">
              <Search className="w-7 h-7 text-stone-300" />
            </div>
            <h3 className="text-lg font-black text-stone-900 mb-2" style={{ letterSpacing: '-0.02em' }}>
              No bursaries match
            </h3>
            <p className="text-sm text-stone-500 mb-8 max-w-xs leading-relaxed">
              {searchQuery ? `Nothing found for "${searchQuery}". Try different terms or clear your filters.` : 'Try loosening your filters.'}
            </p>
            <button onClick={clearFilters} className="px-6 py-2.5 bg-brand-dark text-white rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-stone-700 transition-colors">
              Clear all filters
            </button>
          </div>
        )}

        {/* Load more */}
        {hasMore && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setDisplayCount((c) => c + LOAD_INCREMENT)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest text-white bg-brand-dark hover:bg-stone-700 transition-colors"
            >
              Show {Math.min(filteredBursaries.length - displayCount, LOAD_INCREMENT)} more
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        )}

        {!hasMore && filteredBursaries.length > 0 && (
          <p className="text-center mt-8 text-sm text-stone-400">
            Showing all {filteredBursaries.length} bursaries
          </p>
        )}

        {/* NSFAS Banner */}
        <div className="mt-20 bg-brand-dark rounded-xl overflow-hidden">
          <div className="p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-500 mb-3">Government Funding</p>
                <h2 className="text-2xl md:text-3xl font-black text-white mb-4" style={{ letterSpacing: '-0.025em' }}>
                  NSFAS Funding
                </h2>
                <p className="text-[15px] leading-[1.7] text-stone-400 mb-8">
                  NSFAS provides full funding for South African students from poor and working-class backgrounds. Household income under R350,000 per year? You likely qualify. Free, government-backed, covers everything.
                </p>
                <a
                  href="https://www.nsfas.org.za"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-stone-900 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-stone-100 transition-colors"
                >
                  Official Website <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
              <div className="border border-stone-800 rounded-xl p-6">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-500 mb-5">What NSFAS covers</p>
                <ul className="space-y-3">
                  {['Full tuition fees', 'Accommodation and meals', 'Personal care allowance', 'Learning materials and laptop', 'Transport allowance'].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm font-medium text-stone-300">
                      <CheckCircle2 className="w-4 h-4 text-stone-600 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default BursariesPage;
