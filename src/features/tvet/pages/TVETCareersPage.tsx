import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { allCareersFullData } from '../../careers/data/careersFullData';
import { TVETCareerCard } from '../../careers/components/TVETCareerCard';
import type { CareerFull } from '../../careers/data/careersTypes';
import { usePillVisible } from '../../../shared/hooks/usePillVisible';
import { CareerDetailModal } from '../../careers/components/CareerDetailModal';

const tradeTypes = [
  'Electrical & Energy',
  'Plumbing',
  'Construction',
  'Automotive',
  'Welding & Metal',
  'Engineering',
  'Hospitality',
  'Beauty',
  'IT & Digital',
  'Services',
];

const demandConfig: Record<string, { label: string; activeCls: string }> = {
  high:   { label: 'High demand',   activeCls: 'bg-emerald-600 text-white border-emerald-600' },
  medium: { label: 'Medium demand', activeCls: 'bg-amber-500 text-white border-amber-500' },
  low:    { label: 'Low demand',    activeCls: 'bg-red-500 text-white border-red-500' },
};

const LOAD_MORE_INCREMENT = 30;

function TVETCareersPage({ onNavigate }: { onNavigate: (page: any) => void }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTradeType, setSelectedTradeType] = useState<string | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [selectedDemand, setSelectedDemand] = useState<string | null>(null);
  const [salaryRange, setSalaryRange] = useState<[number, number]>([0, 70000]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCareer, setSelectedCareer] = useState<CareerFull | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [savedCareers, setSavedCareers] = useState<string[]>([]);
  const [displayCount, setDisplayCount] = useState(30);
  const [isLoadingSaves, setIsLoadingSaves] = useState(true);

  const tvetCareers = useMemo(() => allCareersFullData.filter((c) => c.category === 'tvet'), []);

  useEffect(() => {
    const loadSavedCareers = async () => {
      setIsLoadingSaves(true);
      setSavedCareers(bookmarks.careers);
      setIsLoadingSaves(false);
    };
    loadSavedCareers();
  }, [user.id]);

  const provinces = useMemo(
    () => Array.from(new Set(tvetCareers.flatMap((c) => c.jobLocations.provinces))).sort(),
    [tvetCareers]
  );

  const allFilteredCareers = useMemo(() => {
    let results = tvetCareers;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      results = results.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.keywords.some((k) => k.toLowerCase().includes(q))
      );
    }
    if (selectedTradeType) results = results.filter((c) => c.industryType.includes(selectedTradeType));
    if (selectedProvince) results = results.filter((c) => c.jobLocations.provinces.includes(selectedProvince));
    if (selectedDemand) results = results.filter((c) => c.jobDemand.level === selectedDemand);
    results = results.filter(
      (c) => c.salary.entryLevel >= salaryRange[0] && c.salary.entryLevel <= salaryRange[1]
    );

    return results;
  }, [searchQuery, selectedTradeType, selectedProvince, selectedDemand, salaryRange, tvetCareers]);

  const displayedCareers = useMemo(
    () => allFilteredCareers.slice(0, displayCount),
    [allFilteredCareers, displayCount]
  );

  const hasMoreCareers = allFilteredCareers.length > displayCount;
  const remainingCareers = allFilteredCareers.length - displayCount;

  const activeFilterCount = [selectedTradeType, selectedProvince, selectedDemand].filter(Boolean).length;
  const pillVisible = usePillVisible();
  // pill (72px) + subnav (~48px) when pill visible; subnav only (48px) when pill hidden
  const filterBarTop = pillVisible ? 72 : 0;

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTradeType(null);
    setSelectedProvince(null);
    setSelectedDemand(null);
    setSalaryRange([0, 70000]);
    setDisplayCount(30);
  };

  const handleCareerClick = (career: CareerFull) => {
    setSelectedCareer(career);
    setShowDetailModal(true);
  };

  const toggleSaveCareer = async (careerId: string) => {
    if (savedCareers.includes(careerId)) {
      setSavedCareers(savedCareers.filter((s) => s !== careerId));
    } else {
      setSavedCareers([...savedCareers, careerId]);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: '#F5F0E8' }}>

      <div className="pt-24 pb-16">
        {/* Page header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-8">
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400 mb-3">TVET</p>
          <h1
            className="text-3xl sm:text-4xl font-black text-slate-900 mb-3"
            style={{ letterSpacing: '-0.025em' }}
          >
            Careers
          </h1>
          <p className="text-[15px] text-slate-500 leading-[1.65]">
            {tvetCareers.length} trade careers — filter by trade type, province, or salary.
          </p>
        </div>

        {/* Sticky search + filter bar */}
        <div className="sticky z-20 bg-white/95 backdrop-blur-sm border-b border-slate-100 px-4 sm:px-6 py-4 transition-[top] duration-300" style={{ top: filterBarTop }}>
          <div className="max-w-7xl mx-auto">
            <div className="flex gap-3 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search careers, trades, skills..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setDisplayCount(30); }}
                  className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-10 py-3 text-sm outline-none focus:border-slate-400 transition-colors text-slate-900 placeholder:text-slate-400"
                  style={{ fontSize: '16px' }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest transition-colors border whitespace-nowrap ${
                  isFilterOpen || activeFilterCount > 0
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
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
                  <div className="pt-5 mt-5 border-t border-slate-100 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">Trade Type</p>
                        <div className="flex flex-wrap gap-2">
                          {tradeTypes.map((type) => (
                            <button
                              key={type}
                              onClick={() => setSelectedTradeType(selectedTradeType === type ? null : type)}
                              className={`px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-widest transition-colors border ${
                                selectedTradeType === type
                                  ? 'bg-slate-900 text-white border-slate-900'
                                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                              }`}
                            >
                              {type}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">Province</p>
                        <div className="flex flex-wrap gap-2">
                          {provinces.map((prov) => (
                            <button
                              key={prov}
                              onClick={() => setSelectedProvince(selectedProvince === prov ? null : prov)}
                              className={`px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-widest transition-colors border ${
                                selectedProvince === prov
                                  ? 'bg-slate-900 text-white border-slate-900'
                                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                              }`}
                            >
                              {prov}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">Demand Level</p>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(demandConfig).map(([level, { label, activeCls }]) => (
                            <button
                              key={level}
                              onClick={() => setSelectedDemand(selectedDemand === level ? null : level)}
                              className={`px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-widest transition-colors border ${
                                selectedDemand === level
                                  ? activeCls
                                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                              }`}
                            >
                              {label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">
                          Max Entry Salary — R{salaryRange[1].toLocaleString()}
                        </p>
                        <input
                          type="range"
                          min="0"
                          max="70000"
                          step="5000"
                          value={salaryRange[1]}
                          onChange={(e) => setSalaryRange([salaryRange[0], parseInt(e.target.value)])}
                          className="w-full"
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                      <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                        {allFilteredCareers.length} result{allFilteredCareers.length !== 1 ? 's' : ''}
                      </p>
                      <button
                        onClick={clearFilters}
                        className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-700 transition-colors"
                      >
                        <X className="w-3 h-3" />
                        Clear all
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Results count when filters closed */}
        {!isFilterOpen && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-2">
            <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">
              {allFilteredCareers.length} career{allFilteredCareers.length !== 1 ? 's' : ''}
              {activeFilterCount > 0 && (
                <button onClick={clearFilters} className="ml-3 text-slate-400 hover:text-slate-700 transition-colors">
                  Clear filters
                </button>
              )}
            </p>
          </div>
        )}

        {/* Career Cards */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-4">
          {displayedCareers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
              {displayedCareers.map((career, index) => (
                <motion.div
                  key={career.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index, 7) * 0.04 }}
                >
                  <TVETCareerCard career={career} onCardClick={() => handleCareerClick(career)} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="py-24 text-center">
              <p className="text-[14px] font-black text-slate-900 mb-2">No careers found</p>
              <p className="text-[12px] text-slate-400 mb-6">Try adjusting your search or filters.</p>
              <button
                onClick={clearFilters}
                className="text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors"
              >
                Clear filters
              </button>
            </div>
          )}

          {hasMoreCareers && (
            <div className="flex justify-center pb-8">
              <button
                onClick={() => setDisplayCount(displayCount + LOAD_MORE_INCREMENT)}
                className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-lg font-black text-[11px] uppercase tracking-widest hover:bg-slate-800 transition-colors"
              >
                Load {Math.min(remainingCareers, LOAD_MORE_INCREMENT)} more
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      <CareerDetailModal
        career={selectedCareer}
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        onNavigate={(page: string) => {
          setShowDetailModal(false);
          onNavigate(page as any);
        }}
        isSaved={selectedCareer ? savedCareers.includes(selectedCareer.id) : false}
        onToggleSave={toggleSaveCareer}
      />
    </div>
  );
}

export default TVETCareersPage;
