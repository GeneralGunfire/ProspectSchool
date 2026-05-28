import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutGrid, TrendingUp, Banknote, Wrench, Search } from 'lucide-react';
import { CareerCard } from './CareerCard';
import { getCareersByProvince, getHighDemandCareers } from '../services/mapService';
import type { CareerFull } from '../data/careersTypes';

interface CareersTabProps {
  province: string;
  searchQuery: string;
  onCareerSelect: (career: CareerFull) => void;
}

export default function CareersTab({ province, searchQuery, onCareerSelect }: CareersTabProps) {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'high' | 'salary' | 'tvet'>('all');
  const [displayCount, setDisplayCount] = useState(9);

  // Filter careers based on province, search, and selected filter
  const filteredCareers = useMemo(() => {
    let careers = getCareersByProvince(province);

    // Apply demand filter
    if (selectedFilter === 'high') {
      careers = getHighDemandCareers(province);
    } else if (selectedFilter === 'salary') {
      careers = careers.filter((c) => c.salary.entryLevel >= 15000);
    } else if (selectedFilter === 'tvet') {
      careers = careers.filter((c) => c.category === 'tvet' || c.category === 'trade');
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const lower = searchQuery.toLowerCase();
      careers = careers.filter(
        (c) =>
          c.title.toLowerCase().includes(lower) ||
          c.description.toLowerCase().includes(lower) ||
          c.keywords.some((k) => k.toLowerCase().includes(lower))
      );
    }

    return careers;
  }, [province, selectedFilter, searchQuery]);

  const visibleCareers = filteredCareers.slice(0, displayCount);
  const hasMore = visibleCareers.length < filteredCareers.length;

  const filters = [
    { id: 'all', label: 'All', icon: <LayoutGrid className="w-3.5 h-3.5" /> },
    { id: 'high', label: 'High Demand', icon: <TrendingUp className="w-3.5 h-3.5" /> },
    { id: 'salary', label: 'Good Salary', icon: <Banknote className="w-3.5 h-3.5" /> },
    { id: 'tvet', label: 'TVET Available', icon: <Wrench className="w-3.5 h-3.5" /> },
  ] as const;

  if (filteredCareers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Search className="w-10 h-10 text-slate-300 mb-4" />
        <p className="text-lg font-semibold text-slate-900">No careers found</p>
        <p className="text-sm text-slate-600 mt-2">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-xl font-bold text-slate-900 mb-1">
          {filteredCareers.length} careers in {province}
        </h3>
        <p className="text-sm text-slate-600">Explore opportunities in your area</p>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <motion.button
            key={filter.id}
            onClick={() => {
              setSelectedFilter(filter.id);
              setDisplayCount(9);
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
              selectedFilter === filter.id
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span className="flex items-center gap-1.5">{filter.icon} {filter.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Career Cards Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {visibleCareers.map((career, idx) => (
            <motion.div
              key={career.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: idx * 0.05 }}
            >
              <CareerCard
                career={career}
                onCardClick={() => onCareerSelect(career)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Load More Button */}
      {hasMore && (
        <motion.button
          onClick={() => setDisplayCount((prev) => prev + 9)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 rounded-xl border-2 border-slate-900 text-slate-900 font-semibold text-sm uppercase tracking-widest hover:bg-slate-50 transition"
        >
          Load More Results ↓
        </motion.button>
      )}
    </div>
  );
}
