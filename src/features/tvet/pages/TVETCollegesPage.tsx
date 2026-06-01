import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, MapPin, Phone } from 'lucide-react';
import { tvetColleges } from '../data/tvetColleges';

function TVETCollegesPage({ onNavigate }: { onNavigate: (page: any) => void }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [selectedSpec, setSelectedSpec] = useState<string | null>(null);

  const provinces = useMemo(
    () => Array.from(new Set(tvetColleges.map((c) => c.province))).sort(),
    []
  );
  const specializations = useMemo(
    () => Array.from(new Set(tvetColleges.flatMap((c) => c.specializations))).sort(),
    []
  );

  const filteredColleges = useMemo(() => {
    let r = tvetColleges;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      r = r.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.city.toLowerCase().includes(q) ||
          c.specializations.some((s) => s.toLowerCase().includes(q))
      );
    }
    if (selectedProvince) r = r.filter((c) => c.province === selectedProvince);
    if (selectedSpec)     r = r.filter((c) => c.specializations.includes(selectedSpec));
    return r;
  }, [searchQuery, selectedProvince, selectedSpec]);

  const activeCount = (selectedProvince ? 1 : 0) + (selectedSpec ? 1 : 0);

  const clearFilters = () => {
    setSelectedProvince(null);
    setSelectedSpec(null);
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen" style={{ background: '#F5F0E8' }}>

      <div className="pt-24 pb-20">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-8">
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400 mb-3">TVET</p>
          <h1
            className="text-3xl sm:text-4xl font-black text-slate-900 mb-3"
            style={{ letterSpacing: '-0.025em' }}
          >
            Colleges
          </h1>
          <p className="text-[15px] text-slate-500 leading-[1.65]">
            {tvetColleges.length} public TVET colleges across all 9 provinces. Most are NSFAS accredited.
          </p>
        </div>

        {/* Filters */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-8 space-y-5">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by college name, city, or specialization..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-10 py-3 text-[14px] text-slate-900 placeholder:text-slate-400 outline-none focus:border-slate-400 transition-colors"
              style={{ fontSize: '16px' }}
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

          <div className="space-y-4">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2.5">Province</p>
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

            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2.5">Specialization</p>
              <div className="flex flex-wrap gap-2">
                {specializations.map((spec) => (
                  <button
                    key={spec}
                    onClick={() => setSelectedSpec(selectedSpec === spec ? null : spec)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-widest transition-colors border ${
                      selectedSpec === spec
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    {spec}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">
              {filteredColleges.length} college{filteredColleges.length !== 1 ? 's' : ''}
            </p>
            {activeCount > 0 && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 text-[11px] font-black text-slate-400 hover:text-slate-700 transition-colors uppercase tracking-widest"
              >
                <X className="w-3 h-3" />
                Clear {activeCount} filter{activeCount !== 1 ? 's' : ''}
              </button>
            )}
          </div>
        </div>

        {/* Colleges grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <AnimatePresence mode="popLayout">
            {filteredColleges.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
                {filteredColleges.map((college, idx) => (
                  <motion.div
                    key={college.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: Math.min(idx * 0.03, 0.3), ease: 'easeOut' }}
                    className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-slate-400 transition-colors duration-200 flex flex-col"
                  >
                    <div className="p-5 flex-1">
                      <h3
                        className="text-[15px] font-black text-slate-900 mb-2 leading-snug"
                        style={{ letterSpacing: '-0.016em' }}
                      >
                        {college.name}
                      </h3>
                      <div className="flex items-center gap-1.5 text-slate-400 mb-5">
                        <MapPin size={11} className="shrink-0" />
                        <p className="text-[12px]">{college.city}, {college.province}</p>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {college.specializations.slice(0, 4).map((spec) => (
                          <span
                            key={spec}
                            className="px-2 py-0.5 bg-slate-100 text-[11px] font-black uppercase tracking-wider rounded-full text-slate-600"
                          >
                            {spec}
                          </span>
                        ))}
                        {college.specializations.length > 4 && (
                          <span className="px-2 py-0.5 bg-slate-100 text-[11px] font-black uppercase tracking-wider rounded-full text-slate-400">
                            +{college.specializations.length - 4}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className={`px-5 py-3.5 border-t border-slate-100 flex items-center justify-between gap-3 ${
                      college.nsfasAccredited ? 'bg-emerald-50/60' : 'bg-slate-50'
                    }`}>
                      <p className={`text-[11px] font-black uppercase tracking-wider ${
                        college.nsfasAccredited ? 'text-emerald-700' : 'text-slate-400'
                      }`}>
                        {college.nsfasAccredited ? 'NSFAS Accredited' : 'Limited NSFAS'}
                      </p>
                      {college.phone && (
                        <div className="flex items-center gap-1 text-slate-400">
                          <Phone size={10} />
                          <p className="text-[11px]">{college.phone}</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-24 text-center"
              >
                <p className="text-[14px] font-black text-slate-900 mb-2">No colleges found</p>
                <p className="text-[12px] text-slate-400 mb-6">Try adjusting your search or filters.</p>
                <button
                  onClick={clearFilters}
                  className="text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors"
                >
                  Clear filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Facts section */}
          <div className="border border-slate-100 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">About TVET Colleges</p>
            </div>
            <div className="divide-y divide-slate-100">
              {[
                '50 public TVET colleges across all 9 provinces',
                'National Certificates (NC(V)) at NQF Levels 2–4',
                'Most are NSFAS accredited — tuition costs little or nothing',
                'No minimum matric grades required for most programs',
                'Apprenticeships pay R8–15k/month while you study',
              ].map((fact, i) => (
                <div key={i} className="flex gap-5 px-6 py-4">
                  <span className="text-[11px] font-black text-slate-300 shrink-0 w-5 tabular-nums mt-0.5">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="text-[15px] leading-[1.6] text-slate-600">{fact}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TVETCollegesPage;
