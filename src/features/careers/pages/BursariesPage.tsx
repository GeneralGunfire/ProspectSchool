import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, SlidersHorizontal, X, CheckCircle2, ExternalLink, Bookmark, ChevronDown, ArrowRight } from 'lucide-react';
import { bursaries } from '../data/bursaries';

const LOAD_INCREMENT = 20;

function BursariesPage({ onNavigate }: { onNavigate: (page: any) => void }) {
  const [searchQuery, setSearchQuery]         = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedField, setSelectedField]     = useState<string | null>(null);
  const [selectedIncome, setSelectedIncome]   = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen]       = useState(false);
  const [savedBursaries, setSavedBursaries]   = useState<string[]>([]);
  const [displayCount, setDisplayCount]       = useState(LOAD_INCREMENT);

  useEffect(() => {
    const load = async () => {
      setSavedBursaries(bookmarks.bursaries);
    };
    load();
  }, [user.id]);

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
    return r;
  }, [searchQuery, selectedCategory, selectedField, selectedIncome]);

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
    if (savedBursaries.includes(id)) {
      if (ok) setSavedBursaries((prev) => prev.filter((s) => s !== id));
    } else {
      if (ok) setSavedBursaries((prev) => [...prev, id]);
    }
  };

  const handleViewDetail = (id: string) => {
    sessionStorage.setItem('selectedBursaryId', id);
    onNavigate('bursary');
  };

  return (
    <div className="min-h-screen" style={{ background: 'oklch(98.5% 0.005 80)' }}>

      <div className="pt-24 pb-16 px-4 md:px-8 max-w-4xl mx-auto">

        {/* Page header */}
        <div className="mb-10 pt-2">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">Financial Aid</p>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-3" style={{ letterSpacing: '-0.025em' }}>
            Bursaries
          </h1>
          <p className="text-[15px] leading-[1.65] text-slate-500">
            {filteredBursaries.length} bursaries, scholarships, and grants for South African students.
          </p>
        </div>

        {/* Sticky search + filters */}
        <div className="mb-10 sticky top-20 z-40 py-4 -mx-4 px-4 bg-white/95 backdrop-blur-sm border-b border-slate-100">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
            <div className="relative grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search bursaries, providers, or fields..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setDisplayCount(LOAD_INCREMENT); }}
                className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-10 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-slate-400 transition-colors"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <button
              onClick={() => setIsFilterOpen((v) => !v)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-colors border whitespace-nowrap ${
                isFilterOpen ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${isFilterOpen ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'}`}>
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
                <div className="pt-6 mt-4 border-t border-slate-100 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Category */}
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">Category</p>
                      <div className="flex flex-wrap gap-2">
                        {categories.map((cat) => (
                          <button
                            key={cat}
                            onClick={() => { setSelectedCategory(selectedCategory === cat ? null : cat); setDisplayCount(LOAD_INCREMENT); }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors border ${
                              selectedCategory === cat ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>
                    {/* Field of study */}
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">Field of Study</p>
                      <div className="flex flex-wrap gap-2">
                        {fields.slice(0, 8).map((field) => (
                          <button
                            key={field}
                            onClick={() => { setSelectedField(selectedField === field ? null : field); setDisplayCount(LOAD_INCREMENT); }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors border ${
                              selectedField === field ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                            }`}
                          >
                            {field}
                          </button>
                        ))}
                      </div>
                    </div>
                    {/* Income */}
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">Household Income</p>
                      <div className="flex flex-wrap gap-2">
                        {incomeRanges.map((r) => (
                          <button
                            key={r.value}
                            onClick={() => { setSelectedIncome(selectedIncome === r.value ? null : r.value); setDisplayCount(LOAD_INCREMENT); }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors border ${
                              selectedIncome === r.value ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                            }`}
                          >
                            {r.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {activeFilterCount > 0 && (
                    <div className="flex justify-end pt-2 border-t border-slate-50">
                      <button onClick={clearFilters} className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-700 transition-colors">
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

        {/* Bursary list */}
        {displayed.length > 0 ? (
          <div className="space-y-4">
            {displayed.map((bursary, index) => {
              const saved = savedBursaries.includes(bursary.id);
              return (
                <motion.div
                  key={bursary.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index, 7) * 0.04, ease: 'easeOut' }}
                  className="group border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-all cursor-pointer"
                  onClick={() => handleViewDetail(bursary.id)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      {/* Meta row */}
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-400">{bursary.category}</span>
                        <span className="text-slate-200">·</span>
                        <span className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-400">Deadline: {bursary.applicationProcess.deadline}</span>
                      </div>

                      {/* Name + provider */}
                      <h3 className="text-[16px] font-black text-slate-900 mb-0.5 leading-snug group-hover:text-slate-700 transition-colors" style={{ letterSpacing: '-0.018em' }}>
                        {bursary.name}
                      </h3>
                      <p className="text-xs font-medium text-slate-400 mb-3">{bursary.provider}</p>

                      {/* Description */}
                      <p className="text-sm leading-[1.6] text-slate-500 line-clamp-2 mb-3">{bursary.description}</p>

                      {/* Footer stats */}
                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 font-medium">
                        <span>Min marks: <span className="text-slate-600 font-bold">{bursary.requirements.minMarks}</span></span>
                        {bursary.studyOptions.fields.slice(0, 2).join(', ') && (
                          <>
                            <span className="text-slate-200">·</span>
                            <span>{bursary.studyOptions.fields.slice(0, 2).join(', ')}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleSave(bursary.id); }}
                        aria-label={saved ? 'Unsave' : 'Save'}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all ${
                          saved ? 'bg-slate-900 border-slate-900 text-white' : 'border-slate-200 text-slate-400 hover:border-slate-400'
                        }`}
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-white' : ''}`} />
                      </button>
                      <ArrowRight className="w-4 h-4 text-slate-200 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all duration-150 mt-1" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          /* Empty state */
          <div className="py-24 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-6">
              <Search className="w-7 h-7 text-slate-300" />
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-2" style={{ letterSpacing: '-0.02em' }}>
              No bursaries match
            </h3>
            <p className="text-sm text-slate-500 mb-8 max-w-xs leading-relaxed">
              {searchQuery ? `Nothing found for "${searchQuery}". Try different terms or clear your filters.` : 'Try loosening your filters.'}
            </p>
            <button onClick={clearFilters} className="px-6 py-2.5 bg-slate-900 text-white rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-slate-700 transition-colors">
              Clear all filters
            </button>
          </div>
        )}

        {/* Load more */}
        {hasMore && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setDisplayCount((c) => c + LOAD_INCREMENT)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest text-white bg-slate-900 hover:bg-slate-700 transition-colors"
            >
              Show {Math.min(filteredBursaries.length - displayCount, LOAD_INCREMENT)} more
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        )}

        {!hasMore && filteredBursaries.length > 0 && (
          <p className="text-center mt-8 text-sm text-slate-400">
            Showing all {filteredBursaries.length} bursaries
          </p>
        )}

        {/* NSFAS Banner */}
        <div className="mt-20 bg-slate-900 rounded-xl overflow-hidden">
          <div className="p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3">Government Funding</p>
                <h2 className="text-2xl md:text-3xl font-black text-white mb-4" style={{ letterSpacing: '-0.025em' }}>
                  NSFAS Funding
                </h2>
                <p className="text-[15px] leading-[1.7] text-slate-400 mb-8">
                  NSFAS provides full funding for South African students from poor and working-class backgrounds. Household income under R350,000 per year? You likely qualify. Free, government-backed, covers everything.
                </p>
                <a
                  href="https://www.nsfas.org.za"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-900 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-slate-100 transition-colors"
                >
                  Official Website <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
              <div className="border border-slate-800 rounded-xl p-6">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-5">What NSFAS covers</p>
                <ul className="space-y-3">
                  {['Full tuition fees', 'Accommodation and meals', 'Personal care allowance', 'Learning materials and laptop', 'Transport allowance'].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm font-medium text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-slate-600 shrink-0" />
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
