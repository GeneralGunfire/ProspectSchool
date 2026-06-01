import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { allCareersComplete } from '../data/careers400Final';
import { CareerCard } from '../components/CareerCard';
import { CareerDetailModal } from '../components/CareerDetailModal';
import type { CareerFull } from '../data/careersTypes';

// ── Constants ─────────────────────────────────────────────────────────────────

const categoryLabels: Record<string, string> = {
  university: 'University',
  tvet: 'TVET College',
  trade: 'Trade',
  digital: 'Digital & Tech',
  creative: 'Creative',
  business: 'Business',
};

const riasecTypes = [
  { code: 'R', label: 'Realistic', description: 'Hands-on, practical' },
  { code: 'I', label: 'Investigative', description: 'Analytical, curious' },
  { code: 'A', label: 'Artistic', description: 'Creative, expressive' },
  { code: 'S', label: 'Social', description: 'People-focused' },
  { code: 'E', label: 'Enterprising', description: 'Leadership, business' },
  { code: 'C', label: 'Conventional', description: 'Organised, detail-oriented' },
];

// Demand filter colours — emerald/amber/red, consistent with quiz results
const demandConfig: Record<string, { label: string; activeCls: string }> = {
  high:   { label: 'High demand',   activeCls: 'bg-emerald-600 text-white border-emerald-600' },
  medium: { label: 'Medium demand', activeCls: 'bg-amber-500 text-white border-amber-500' },
  low:    { label: 'Low demand',    activeCls: 'bg-red-500 text-white border-red-500' },
};

const SALARY_MAX = 100000;
const SALARY_STEP = 5000;
const LOAD_MORE_INCREMENT = 25;

// ── Component ─────────────────────────────────────────────────────────────────

function CareersPageNew({ onNavigate }: { onNavigate: (page: any) => void }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedRIASEC, setSelectedRIASEC] = useState<string | null>(null);
  const [selectedDemand, setSelectedDemand] = useState<string | null>(null);
  // Both bounds adjustable
  const [salaryMin, setSalaryMin] = useState(0);
  const [salaryMax, setSalaryMax] = useState(SALARY_MAX);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCareer, setSelectedCareer] = useState<CareerFull | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [relatedCareers, setRelatedCareers] = useState<CareerFull[]>([]);
  const [savedCareers, setSavedCareers] = useState<string[]>([]);
  const [displayCount, setDisplayCount] = useState(25);
  const [isLoadingSaves, setIsLoadingSaves] = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoadingSaves(true);
      setSavedCareers(bookmarks.careers);
      setIsLoadingSaves(false);
    };
    load();
  }, [user.id]);

  const categories = useMemo(
    () => Array.from(new Set(allCareersComplete.map((c) => c.category))).sort(),
    [],
  );

  const activeFilterCount =
    (selectedCategory ? 1 : 0) +
    (selectedRIASEC ? 1 : 0) +
    (selectedDemand ? 1 : 0) +
    (salaryMin > 0 || salaryMax < SALARY_MAX ? 1 : 0);

  const allFilteredCareers = useMemo(() => {
    let results = allCareersComplete;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      results = results.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.keywords.some((k) => k.toLowerCase().includes(q)),
      );
    }

    if (selectedCategory) results = results.filter((c) => c.category === selectedCategory);

    if (selectedRIASEC) {
      results = results.filter((c) => {
        const key = selectedRIASEC.toLowerCase() as keyof typeof c.riasecMatch;
        return c.riasecMatch[key] > 50;
      });
    }

    if (selectedDemand) results = results.filter((c) => c.jobDemand.level === selectedDemand);

    results = results.filter(
      (c) => c.salary.entryLevel >= salaryMin && c.salary.entryLevel <= salaryMax,
    );

    return results;
  }, [searchQuery, selectedCategory, selectedRIASEC, selectedDemand, salaryMin, salaryMax]);

  const displayedCareers = useMemo(
    () => allFilteredCareers.slice(0, displayCount),
    [allFilteredCareers, displayCount],
  );

  const hasMore = allFilteredCareers.length > displayCount;
  const remaining = allFilteredCareers.length - displayCount;

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setSelectedRIASEC(null);
    setSelectedDemand(null);
    setSalaryMin(0);
    setSalaryMax(SALARY_MAX);
    setDisplayCount(25);
  };

  const handleCareerClick = async (career: CareerFull) => {
    setSelectedCareer(career);
    setRelatedCareers(related);
    setShowDetailModal(true);
  };

  const toggleSaveCareer = async (careerId: string) => {
    if (savedCareers.includes(careerId)) {
      if (ok) setSavedCareers((prev) => prev.filter((s) => s !== careerId));
    } else {
      if (ok) setSavedCareers((prev) => [...prev, careerId]);
    }
  };

  const handleModalNavigate = (page: string) => {
    setShowDetailModal(false);
    if (page === 'library' || page === 'bursaries') onNavigate(page as any);
  };

  const handleSelectRelatedCareer = async (career: CareerFull) => {
    setSelectedCareer(career);
    setRelatedCareers(related);
  };

  return (
    <div className="min-h-screen" style={{ background: '#F5F0E8' }}>

      <div className="pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto">

        {/* Page header */}
        <div className="mb-10 pt-2">
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400 mb-3">
            Career Explorer
          </p>
          <h1
            className="text-3xl md:text-4xl font-black text-slate-900 mb-3"
            style={{ letterSpacing: '-0.025em' }}
          >
            Careers
          </h1>
          <p className="text-[15px] leading-[1.65] text-slate-500">
            {allFilteredCareers.length} careers — filter by interest, category, or personality type.
          </p>
        </div>

        {/* Sticky search + filter bar */}
        <div className="mb-10 sticky top-20 z-40 py-4 -mx-4 px-4 bg-white/95 backdrop-blur-sm border-b border-slate-100">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
            {/* Search */}
            <div className="relative grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search careers, skills, industries..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setDisplayCount(25);
                }}
                className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-slate-400 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter toggle */}
            <button
              onClick={() => setIsFilterOpen((v) => !v)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-colors border whitespace-nowrap ${
                isFilterOpen
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {activeFilterCount > 0 && (
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                    isFilterOpen ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'
                  }`}
                >
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Expanded filter panel */}
          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ ease: 'easeOut', duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="pt-6 mt-4 border-t border-slate-100 space-y-8">

                  {/* Row 1: Categories + RIASEC */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Categories */}
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">
                        Career Category
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {categories.map((cat) => {
                          const isActive = selectedCategory === cat;
                          return (
                            <button
                              key={cat}
                              onClick={() => {
                                setSelectedCategory(isActive ? null : cat);
                                setDisplayCount(25);
                              }}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors border ${
                                isActive
                                  ? 'bg-slate-900 text-white border-slate-900'
                                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                              }`}
                            >
                              {categoryLabels[cat] ?? cat}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* RIASEC — full names with description */}
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">
                        Personality Type
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {riasecTypes.map(({ code, label }) => {
                          const isActive = selectedRIASEC === code;
                          return (
                            <button
                              key={code}
                              onClick={() => {
                                setSelectedRIASEC(isActive ? null : code);
                                setDisplayCount(25);
                              }}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border ${
                                isActive
                                  ? 'bg-slate-900 text-white border-slate-900'
                                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                              }`}
                            >
                              <span className="font-black">{code}</span>
                              <span className="ml-1 tracking-normal normal-case font-medium text-[11px]">
                                {label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Row 2: Demand + Salary */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Job demand */}
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">
                        Job Demand
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(demandConfig).map(([level, { label, activeCls }]) => {
                          const isActive = selectedDemand === level;
                          return (
                            <button
                              key={level}
                              onClick={() => {
                                setSelectedDemand(isActive ? null : level);
                                setDisplayCount(25);
                              }}
                              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all border ${
                                isActive
                                  ? activeCls
                                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                              }`}
                            >
                              {label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Salary range — dual sliders */}
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">
                        Entry Salary Range
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                          <span>R{salaryMin.toLocaleString()}</span>
                          <span>R{salaryMax.toLocaleString()}</span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                            <span className="w-8 shrink-0">Min</span>
                            <input
                              type="range"
                              min={0}
                              max={SALARY_MAX}
                              step={SALARY_STEP}
                              value={salaryMin}
                              onChange={(e) => {
                                const v = parseInt(e.target.value);
                                setSalaryMin(Math.min(v, salaryMax - SALARY_STEP));
                                setDisplayCount(25);
                              }}
                              className="w-full accent-slate-900"
                            />
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                            <span className="w-8 shrink-0">Max</span>
                            <input
                              type="range"
                              min={0}
                              max={SALARY_MAX}
                              step={SALARY_STEP}
                              value={salaryMax}
                              onChange={(e) => {
                                const v = parseInt(e.target.value);
                                setSalaryMax(Math.max(v, salaryMin + SALARY_STEP));
                                setDisplayCount(25);
                              }}
                              className="w-full accent-slate-900"
                            />
                          </div>
                        </div>
                        {(salaryMin > 0 || salaryMax < SALARY_MAX) && (
                          <p className="text-[10px] text-slate-400">
                            Showing careers with R{salaryMin.toLocaleString()}–R{salaryMax.toLocaleString()} entry salary
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Clear filters */}
                  {activeFilterCount > 0 && (
                    <div className="flex justify-end pt-2 border-t border-slate-50">
                      <button
                        onClick={clearFilters}
                        className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-700 transition-colors"
                      >
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

        {/* Career cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
          {displayedCareers.length > 0 ? (
            displayedCareers.map((career, index) => (
              <motion.div
                key={career.id}
                data-career-card
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index, 7) * 0.04, ease: 'easeOut' }}
              >
                <CareerCard career={career} onCardClick={() => handleCareerClick(career)} />
              </motion.div>
            ))
          ) : (
            /* Empty state */
            <div className="col-span-full py-24 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-6">
                <Search className="w-7 h-7 text-slate-300" />
              </div>
              <h3
                className="text-lg font-black text-slate-900 mb-2"
                style={{ letterSpacing: '-0.02em' }}
              >
                No careers match
              </h3>
              <p className="text-sm text-slate-500 mb-8 max-w-xs leading-relaxed">
                {searchQuery
                  ? `Nothing found for "${searchQuery}". Try a different word or clear your filters.`
                  : 'Try loosening your filters to see more options.'}
              </p>
              <button
                onClick={clearFilters}
                className="px-6 py-2.5 bg-slate-900 text-white rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-slate-700 transition-colors"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Load more */}
        {hasMore && (
          <div className="flex justify-center mb-8">
            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => setDisplayCount((prev) => prev + LOAD_MORE_INCREMENT)}
              data-load-more-btn
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest text-white bg-slate-900 hover:bg-slate-700 transition-colors"
            >
              Show {Math.min(remaining, LOAD_MORE_INCREMENT)} more
              <ChevronDown className="w-4 h-4" />
            </motion.button>
          </div>
        )}

        {!hasMore && allFilteredCareers.length > 0 && (
          <p className="text-center mb-8 text-sm text-slate-400">
            Showing all {allFilteredCareers.length} careers
          </p>
        )}
      </div>

      {/* Career detail modal */}
      <CareerDetailModal
        career={selectedCareer}
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        onNavigate={handleModalNavigate}
        onSelectCareer={handleSelectRelatedCareer}
        relatedCareers={relatedCareers}
        isSaved={selectedCareer ? savedCareers.includes(selectedCareer.id) : false}
        onToggleSave={toggleSaveCareer}
      />
    </div>
  );
}

export default CareersPageNew;
