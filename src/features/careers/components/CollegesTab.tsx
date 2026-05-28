import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, ExternalLink, Building2 } from 'lucide-react';
import { getUniversitiesByProvince, getTVETCollegesByProvince } from '../services/mapService';

interface CollegesTabProps {
  province: string;
  searchQuery: string;
}

export default function CollegesTab({ province, searchQuery }: CollegesTabProps) {
  const [activeSubtab, setActiveSubtab] = useState<'universities' | 'tvet'>('universities');

  const universities = getUniversitiesByProvince(province);
  const tvetColleges = getTVETCollegesByProvince(province);

  const filteredUniversities = useMemo(() => {
    if (!searchQuery.trim()) return universities;
    const lower = searchQuery.toLowerCase();
    return universities.filter(
      (u) => u.name.toLowerCase().includes(lower) || u.city.toLowerCase().includes(lower)
    );
  }, [universities, searchQuery]);

  const filteredTVET = useMemo(() => {
    if (!searchQuery.trim()) return tvetColleges;
    const lower = searchQuery.toLowerCase();
    return tvetColleges.filter(
      (c) => c.name.toLowerCase().includes(lower) || c.city.toLowerCase().includes(lower)
    );
  }, [tvetColleges, searchQuery]);

  const activeList = activeSubtab === 'universities' ? filteredUniversities : filteredTVET;

  if (universities.length === 0 && tvetColleges.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Building2 className="w-8 h-8 text-slate-200 mb-3" />
        <p className="text-[14px] font-black text-slate-900">No colleges found</p>
        <p className="text-[12px] text-slate-400 mt-1">This province has limited data</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h3
          className="text-[16px] font-black text-slate-900"
          style={{ letterSpacing: '-0.016em' }}
        >
          Institutions in {province}
        </h3>
        <p className="text-[12px] text-slate-400 mt-0.5">
          {universities.length} universities · {tvetColleges.length} TVET colleges
        </p>
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-1 border-b border-slate-200">
        {([
          { id: 'universities' as const, label: `Universities (${universities.length})` },
          { id: 'tvet' as const,         label: `TVET (${tvetColleges.length})` },
        ]).map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveSubtab(t.id)}
            className={`px-3 py-2 text-[11px] font-black uppercase tracking-widest border-b-2 transition-colors -mb-px ${
              activeSubtab === t.id
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="divide-y divide-slate-100">
        <AnimatePresence mode="popLayout">
          {activeList.length === 0 ? (
            <p className="py-8 text-center text-[13px] text-slate-400">No results match your search</p>
          ) : (
            activeList.map((college, idx) => (
              <motion.div
                key={`${college.name}-${idx}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: Math.min(idx * 0.04, 0.3) }}
                className="flex items-center justify-between gap-4 py-3.5 group"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-black text-slate-900 leading-snug group-hover:text-slate-700 transition-colors" style={{ letterSpacing: '-0.012em' }}>
                    {college.name}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <MapPin size={11} className="text-slate-400 shrink-0" />
                    <span className="text-[11px] text-slate-400">{college.city}</span>
                  </div>
                </div>

                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(college.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors shrink-0"
                  title="Open in Google Maps"
                >
                  <ExternalLink size={14} />
                </a>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
