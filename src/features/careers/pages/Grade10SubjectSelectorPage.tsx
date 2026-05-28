import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, ArrowRight, Check, X } from 'lucide-react';
import { getTopMatchingCareers } from '../data/subjectCareerMapping';
import { getSubjectRequirements, apsScoreGuide } from '../data/universityRequirements';
import { getTopTVETCareers } from '../../tvet/data/tvetCareers';
import { careers } from '../data/careers';

const GRADE_10_SUBJECTS = [
  'Mathematics',
  'Physical Sciences',
  'Life Sciences',
  'Accounting',
  'Business Studies',
  'Economics',
  'CAT',
  'EGD',
  'English Home Language',
];

function Grade10SubjectSelectorPage({ onNavigate }: { onNavigate: (page: any) => void }) {
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  const toggleSubject = (subject: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject]
    );
  };

  const matchingCareers = useMemo(() => {
    if (selectedSubjects.length === 0) return [];
    const careerNames = getTopMatchingCareers(selectedSubjects, 10);
    return careers.filter((c) => careerNames.includes(c.title));
  }, [selectedSubjects]);

  const tvetCareers = useMemo(() => {
    if (selectedSubjects.length === 0) return [];
    return getTopTVETCareers(selectedSubjects, 6);
  }, [selectedSubjects]);

  const subjectRequirements = useMemo(() => {
    if (selectedSubjects.length === 0) return [];
    return selectedSubjects.map((subject) => ({
      subject,
      requirements: getSubjectRequirements(subject),
    }));
  }, [selectedSubjects]);

  return (
    <div className="min-h-screen" style={{ background: 'oklch(98.5% 0.005 80)' }}>

      <div className="pt-20 pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10 pt-2">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">Grade 10 Tools</p>
          <h1
            className="text-3xl md:text-4xl font-black text-slate-900 mb-3"
            style={{ letterSpacing: '-0.025em' }}
          >
            Subject Explorer
          </h1>
          <p className="text-[14px] text-slate-500 leading-[1.65]">
            Select your subjects to see matching career paths, university requirements, and TVET options.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* ── Sidebar ── */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 border border-slate-200 rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                  Subjects
                </p>
                {selectedSubjects.length > 0 && (
                  <button
                    onClick={() => setSelectedSubjects([])}
                    className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-slate-700 transition-colors"
                  >
                    <X size={11} />
                    Clear
                  </button>
                )}
              </div>

              <div className="divide-y divide-slate-100">
                {GRADE_10_SUBJECTS.map((subject) => {
                  const active = selectedSubjects.includes(subject);
                  return (
                    <button
                      key={subject}
                      onClick={() => toggleSubject(subject)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                        active ? 'bg-slate-50' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                          active
                            ? 'bg-slate-900 border-slate-900'
                            : 'border-slate-300'
                        }`}
                      >
                        {active && <Check size={10} className="text-white" />}
                      </div>
                      <span
                        className={`text-[13px] font-bold leading-snug transition-colors ${
                          active ? 'text-slate-900' : 'text-slate-600'
                        }`}
                      >
                        {subject}
                      </span>
                    </button>
                  );
                })}
              </div>

              {selectedSubjects.length > 0 && (
                <div className="px-4 py-3 border-t border-slate-100">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    {selectedSubjects.length} selected
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ── Main content ── */}
          <div className="lg:col-span-3 space-y-10">
            <AnimatePresence mode="wait">
              {selectedSubjects.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-slate-200 rounded-xl"
                >
                  <BookOpen className="w-8 h-8 text-slate-200 mb-4" />
                  <p className="text-[14px] font-black text-slate-900 mb-1">No subjects selected</p>
                  <p className="text-[13px] text-slate-400 max-w-xs mb-8">
                    Pick subjects from the panel to discover matching careers and requirements.
                  </p>
                  <div className="flex gap-3 flex-wrap justify-center">
                    <button
                      onClick={() => onNavigate('quiz')}
                      className="px-5 py-2.5 rounded-lg bg-slate-900 text-white text-[11px] font-black uppercase tracking-widest hover:opacity-90 transition-opacity"
                    >
                      Take the Quiz
                    </button>
                    <button
                      onClick={() => onNavigate('careers')}
                      className="px-5 py-2.5 rounded-lg border border-slate-200 text-slate-700 text-[11px] font-black uppercase tracking-widest hover:border-slate-400 transition-colors"
                    >
                      Browse Careers
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-10"
                >
                  {/* ── Matching Careers ── */}
                  <section>
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                        Matching Careers
                      </p>
                      <span className="text-[10px] font-black text-slate-400">
                        {matchingCareers.length} results
                      </span>
                    </div>

                    {matchingCareers.length > 0 ? (
                      <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
                        {matchingCareers.map((career, idx) => (
                          <motion.button
                            key={career.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: Math.min(idx * 0.04, 0.3) }}
                            onClick={() => onNavigate('careers' as any)}
                            className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-50 transition-colors group"
                          >
                            <div>
                              <p className="text-[14px] font-black text-slate-900 group-hover:text-slate-700 transition-colors" style={{ letterSpacing: '-0.012em' }}>
                                {career.title}
                              </p>
                              <p className="text-[11px] text-slate-400 mt-0.5">
                                {career.category} · {career.description?.substring(0, 60)}…
                              </p>
                            </div>
                            <ArrowRight size={14} className="text-slate-300 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-4" />
                          </motion.button>
                        ))}
                      </div>
                    ) : (
                      <div className="py-10 text-center border border-slate-100 rounded-xl">
                        <p className="text-[13px] text-slate-400">No matching careers for your subjects</p>
                      </div>
                    )}
                  </section>

                  {/* ── TVET Pathways ── */}
                  {tvetCareers.length > 0 && (
                    <section>
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                          TVET Pathways
                        </p>
                        <span className="text-[10px] font-black text-slate-400">
                          {tvetCareers.length} options
                        </span>
                      </div>
                      <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
                        {tvetCareers.map((career, idx) => (
                          <motion.button
                            key={career.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: Math.min(idx * 0.04, 0.3) }}
                            onClick={() => onNavigate('tvet-careers' as any)}
                            className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-50 transition-colors group"
                          >
                            <div>
                              <p className="text-[14px] font-black text-slate-900 group-hover:text-slate-700 transition-colors" style={{ letterSpacing: '-0.012em' }}>
                                {career.name}
                              </p>
                              <p className="text-[11px] text-slate-400 mt-0.5">
                                {career.duration} · {career.salaryRange} · {career.jobDemand} demand
                              </p>
                            </div>
                            <ArrowRight size={14} className="text-slate-300 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-4" />
                          </motion.button>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* ── University Requirements ── */}
                  <section>
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400 mb-4">
                      University Requirements
                    </p>
                    <div className="space-y-3">
                      {subjectRequirements.map((item, idx) => (
                        <motion.div
                          key={item.subject}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: Math.min(idx * 0.05, 0.3) }}
                          className="border border-slate-100 rounded-xl overflow-hidden"
                        >
                          <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
                            <p className="text-[12px] font-black text-slate-700">{item.subject}</p>
                          </div>
                          {item.requirements.length > 0 ? (
                            <div className="divide-y divide-slate-100">
                              {item.requirements.map((req) => (
                                <div key={req.degreeType} className="px-5 py-3 flex items-start justify-between gap-4">
                                  <div>
                                    <p className="text-[11px] font-black uppercase tracking-wider text-slate-700">{req.degreeType}</p>
                                    <p className="text-[11px] text-slate-400 mt-0.5">{req.description}</p>
                                  </div>
                                  <span className="text-[11px] font-black text-slate-900 shrink-0">{req.minMark}%+</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="px-5 py-3 text-[12px] text-slate-400">No specific requirements found</p>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </section>

                  {/* ── APS Score Guide ── */}
                  <section>
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400 mb-4">
                      APS Score Guide
                    </p>
                    <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
                      {apsScoreGuide.map((guide, idx) => (
                        <div key={idx} className="flex items-center gap-6 px-5 py-3.5">
                          <span className="text-[13px] font-black text-slate-900 w-16 shrink-0">
                            {guide.apsRange}
                          </span>
                          <div>
                            <p className="text-[13px] font-black text-slate-900">{guide.category}</p>
                            <p className="text-[11px] text-slate-400">{guide.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* ── CTAs ── */}
                  <div className="flex gap-3 flex-wrap">
                    <button
                      onClick={() => onNavigate('quiz')}
                      className="px-5 py-2.5 rounded-lg bg-slate-900 text-white text-[11px] font-black uppercase tracking-widest hover:opacity-90 transition-opacity"
                    >
                      Take the Quiz
                    </button>
                    <button
                      onClick={() => onNavigate('careers')}
                      className="px-5 py-2.5 rounded-lg border border-slate-200 text-slate-700 text-[11px] font-black uppercase tracking-widest hover:border-slate-400 transition-colors"
                    >
                      Browse All Careers
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Grade10SubjectSelectorPage;
