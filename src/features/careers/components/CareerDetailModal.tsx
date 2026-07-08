import { motion, AnimatePresence } from 'motion/react';
import { X, Bookmark, GraduationCap, MapPin, TrendingUp, AlertCircle, CheckCircle2, Info, ArrowRight } from 'lucide-react';
import type { CareerFull } from '../data/careersTypes';

interface CareerDetailModalProps {
  career: CareerFull | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (page: string) => void;
  onSelectCareer?: (career: CareerFull) => void;
  relatedCareers?: CareerFull[];
  isSaved?: boolean;
  onToggleSave?: (careerId: string) => void;
}

// ── Design tokens (consistent with card + quiz) ───────────────────────────────

const categoryLabels: Record<string, string> = {
  university: 'University',
  tvet:       'TVET College',
  trade:      'Trade',
  digital:    'Digital & Tech',
  creative:   'Creative',
  business:   'Business',
};

const demandBadge: Record<string, { label: string; cls: string }> = {
  high:   { label: 'High demand',   cls: 'bg-emerald-50 text-emerald-700 border border-emerald-100' },
  medium: { label: 'Medium demand', cls: 'bg-amber-50 text-amber-700 border border-amber-100' },
  low:    { label: 'Low demand',    cls: 'bg-red-50 text-red-600 border border-red-100' },
};

// Bar colour per RIASEC type — same system as quiz results
const riasecBar: Record<string, string> = {
  R: 'bg-red-500',
  I: 'bg-blue-500',
  A: 'bg-violet-500',
  S: 'bg-green-500',
  E: 'bg-amber-500',
  C: 'bg-slate-500',
};

const riasecNames: Record<string, string> = {
  realistic:     'Realistic',
  investigative: 'Investigative',
  artistic:      'Artistic',
  social:        'Social',
  enterprising:  'Enterprising',
  conventional:  'Conventional',
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">
      {children}
    </p>
  );
}

function SubjectTag({ label, type }: { label: string; type: 'required' | 'recommended' }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border ${
        type === 'required'
          ? 'bg-slate-900 text-white border-slate-900'
          : 'bg-slate-50 text-slate-600 border-slate-200'
      }`}
    >
      {label}
    </span>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export function CareerDetailModal({
  career,
  isOpen,
  onClose,
  onNavigate,
  onSelectCareer,
  relatedCareers = [],
  isSaved = false,
  onToggleSave,
}: CareerDetailModalProps) {
  if (!career) return null;

  const badge       = demandBadge[career.jobDemand.level];
  const catLabel    = categoryLabels[career.category] ?? career.category;
  const riasecSorted = Object.entries(career.riasecMatch).sort(([, a], [, b]) => b - a);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
          />

          {/* Modal panel */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ ease: 'easeOut', duration: 0.22 }}
            data-testid="career-modal"
            className="fixed inset-0 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[92vw] md:h-[90vh] md:max-w-4xl bg-white md:rounded-2xl z-50 overflow-y-auto"
          >

            {/* ── Sticky header ── */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-slate-100 px-5 py-4 md:px-8 md:py-5 flex justify-between items-start gap-4 z-20">
              <div className="flex-1 min-w-0">
                {/* Category + demand row */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                    {catLabel}
                  </span>
                  {badge && (
                    <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${badge.cls}`}>
                      {badge.label}
                    </span>
                  )}
                </div>
                <h2
                  className="text-xl md:text-3xl font-black text-slate-900 leading-tight"
                  style={{ letterSpacing: '-0.025em' }}
                >
                  {career.title}
                </h2>
              </div>

              {/* Actions */}
              <div className="flex gap-2 shrink-0 mt-1">
                <button
                  onClick={() => onToggleSave?.(career.id)}
                  data-testid="bookmark-btn"
                  aria-label={isSaved ? 'Unsave career' : 'Save career'}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                    isSaved ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />
                </button>
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* ── Content ── */}
            <div className="px-5 py-6 md:px-8 md:py-8 space-y-10">

              {/* Overview */}
              <section>
                <p className="text-[15px] leading-[1.7] text-slate-600 mb-6">
                  {career.description}
                </p>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                  <SectionLabel>A Day in the Life</SectionLabel>
                  <p className="text-[14px] leading-[1.7] text-slate-500">
                    {career.dayInTheLife}
                  </p>
                </div>
              </section>

              {/* Subjects Required */}
              <section>
                <SectionLabel>Matric Subjects</SectionLabel>
                <div className="space-y-5">
                  {/* Required subjects */}
                  <div>
                    <p className="text-xs font-black uppercase tracking-wider text-slate-700 mb-2.5">
                      Required
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {career.matricRequirements.requiredSubjects.map((s) => (
                        <SubjectTag key={s} label={s} type="required" />
                      ))}
                    </div>
                  </div>

                  {/* Recommended subjects */}
                  {career.matricRequirements.recommendedSubjects.length > 0 && (
                    <div>
                      <p className="text-xs font-black uppercase tracking-wider text-slate-500 mb-2.5">
                        Recommended
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {career.matricRequirements.recommendedSubjects.map((s) => (
                          <SubjectTag key={s} label={s} type="recommended" />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* APS */}
                  <div className="flex items-center gap-3 pt-1">
                    <div className="px-4 py-2.5 bg-slate-900 text-white rounded-xl">
                      <span className="text-lg font-black" style={{ letterSpacing: '-0.02em' }}>
                        {career.matricRequirements.minimumAps}+
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-2">
                        APS
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Minimum APS score required
                      {career.apsNote && ` — ${career.apsNote}`}
                    </p>
                  </div>
                </div>
              </section>

              {/* RIASEC match — bars, not boxes */}
              <section>
                <SectionLabel>Personality Match</SectionLabel>
                <div className="space-y-3">
                  {riasecSorted.map(([code, score]) => {
                    const key   = code[0].toUpperCase();
                    const name  = riasecNames[code] ?? code;
                    const bar   = riasecBar[key] ?? 'bg-slate-400';
                    const isTop = score >= 60;
                    return (
                      <div key={code}>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-black text-white ${bar}`}
                            >
                              {key}
                            </span>
                            <span className={`text-sm font-bold ${isTop ? 'text-slate-900' : 'text-slate-400'}`}>
                              {name}
                            </span>
                          </div>
                          <span className={`text-xs font-bold tabular-nums ${isTop ? 'text-slate-600' : 'text-slate-300'}`}>
                            {score}%
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${score}%` }}
                            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
                            className={`h-full rounded-full ${isTop ? bar : 'bg-slate-200'}`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Study path */}
              <section>
                <SectionLabel>How to Get There</SectionLabel>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">
                      Primary path
                    </p>
                    <p className="text-sm font-bold text-slate-900 mb-1">{career.studyPath.primaryOption}</p>
                    <p className="text-xs text-slate-500">{career.studyPath.timeToQualify} to qualify</p>
                  </div>
                  {career.studyPath.secondaryOption && (
                    <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                      <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">
                        Alternative path
                      </p>
                      <p className="text-sm font-bold text-slate-900">{career.studyPath.secondaryOption}</p>
                    </div>
                  )}
                </div>

                {/* Where to study — tag list, not a box */}
                {(career.providers.universities || career.providers.tvetColleges) && (
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-3">
                      Where to study
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {career.providers.universities?.map((u) => (
                        <span key={u} className="px-2.5 py-1 bg-slate-50 border border-slate-200 text-slate-600 text-xs font-medium rounded-lg">
                          {u}
                        </span>
                      ))}
                      {career.providers.tvetColleges?.map((t) => (
                        <span key={t} className="px-2.5 py-1 bg-slate-50 border border-slate-200 text-slate-600 text-xs font-medium rounded-lg">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </section>

              {/* Salary progression — large numbers, step connector */}
              <section>
                <SectionLabel>Salary Progression</SectionLabel>
                <div className="grid grid-cols-3 gap-px bg-slate-100 rounded-xl overflow-hidden border border-slate-100">
                  {[
                    { label: 'Entry',      sub: '0–2 yrs', value: career.salary.entryLevel },
                    { label: 'Mid-career', sub: '3–6 yrs', value: career.salary.midLevel },
                    { label: 'Senior',     sub: '7+ yrs',  value: career.salary.senior },
                  ].map((item, i) => (
                    <div key={i} className="bg-white px-4 py-5 text-center">
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">
                        {item.label}
                      </p>
                      <p className="text-[11px] text-slate-400 mb-3">{item.sub}</p>
                      <p
                        className="font-black text-slate-900 tabular-nums"
                        style={{ fontSize: i === 2 ? '1.5rem' : i === 1 ? '1.25rem' : '1.1rem', letterSpacing: '-0.02em' }}
                      >
                        R{(item.value / 1000).toFixed(0)}k
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">/month</p>
                    </div>
                  ))}
                </div>
                {career.salaryNote && (
                  <div className="flex gap-2 mt-3">
                    <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-slate-400" />
                    <p className="text-xs leading-relaxed text-slate-500">{career.salaryNote}</p>
                  </div>
                )}
              </section>

              {/* Job market */}
              <section>
                <SectionLabel>Job Market</SectionLabel>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <TrendingUp className="w-4 h-4 mt-0.5 text-slate-400 shrink-0" />
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Growth</p>
                      <p className="text-sm font-bold text-slate-900 mb-0.5">{career.jobDemand.growthOutlook}</p>
                      <p className="text-xs text-slate-500">+{career.jobDemand.growthPercentage}% projected</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <MapPin className="w-4 h-4 mt-0.5 text-slate-400 shrink-0" />
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Location</p>
                      <p className="text-sm font-bold text-slate-900 mb-0.5">
                        {career.jobLocations.hotspots.slice(0, 3).join(', ')}
                      </p>
                      <p className="text-xs text-slate-500">
                        {career.jobLocations.remoteViable ? 'Remote-friendly' : 'Onsite required'}
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2.5">
                    Top employers
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {career.topEmployers.map((e) => (
                      <span key={e} className="px-2.5 py-1 bg-slate-50 border border-slate-200 text-slate-600 text-xs font-medium rounded-lg">
                        {e}
                      </span>
                    ))}
                  </div>
                </div>
              </section>

              {/* Skills */}
              <section>
                <SectionLabel>Key Skills</SectionLabel>
                <div className="flex flex-wrap gap-2">
                  {career.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium rounded-lg"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>

              {/* Career progression — horizontal steps */}
              <section>
                <SectionLabel>Career Growth Path</SectionLabel>

                {/* Mobile — vertical timeline */}
                <div className="sm:hidden relative space-y-6 pl-2">
                  <div className="absolute top-5 bottom-5 left-[19px] w-px bg-slate-200" />
                  {[
                    { stage: 'Entry',      role: career.careerProgression.entryRole },
                    { stage: 'Mid-career', role: career.careerProgression.midRole },
                    { stage: 'Senior',     role: career.careerProgression.seniorRole },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4 relative">
                      <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-sm shrink-0 relative z-10">
                        {i + 1}
                      </div>
                      <div className="pt-1.5">
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">
                          {item.stage}
                        </p>
                        <p className="text-xs font-bold text-slate-900 leading-snug">{item.role}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop / tablet — horizontal steps */}
                <div className="hidden sm:grid grid-cols-3 gap-4 relative">
                  {/* Connector line */}
                  <div className="absolute top-5 left-[calc(16.67%+8px)] right-[calc(16.67%+8px)] h-px bg-slate-200" />
                  {[
                    { stage: 'Entry',      role: career.careerProgression.entryRole },
                    { stage: 'Mid-career', role: career.careerProgression.midRole },
                    { stage: 'Senior',     role: career.careerProgression.seniorRole },
                  ].map((item, i) => (
                    <div key={i} className="text-center relative">
                      <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-sm mx-auto mb-3 relative z-10">
                        {i + 1}
                      </div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">
                        {item.stage}
                      </p>
                      <p className="text-xs font-bold text-slate-900 leading-snug">{item.role}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Misconceptions */}
              {career.commonMisconceptions.length > 0 && (
                <section>
                  <SectionLabel>Common Misconceptions</SectionLabel>
                  <div className="space-y-3">
                    {career.commonMisconceptions.map((m, i) => (
                      <div key={i} className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                        <p className="text-sm leading-relaxed text-slate-700">{m}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Action plan */}
              {career.actionPlan && career.actionPlan.length > 0 && (
                <section>
                  <SectionLabel>What to Do This Year</SectionLabel>
                  <p className="text-xs text-slate-400 -mt-2 mb-5">Grade-by-grade steps to get here</p>
                  <div className="space-y-3">
                    {career.actionPlan.map((step, i) => (
                      <div key={i} className="border border-slate-100 rounded-xl overflow-hidden">
                        <div className="px-4 py-2 bg-slate-900 text-white text-xs font-black uppercase tracking-widest">
                          {step.grade}
                        </div>
                        <ul className="p-4 space-y-2">
                          {step.actions.map((action, j) => (
                            <li key={j} className="flex gap-2.5 text-sm leading-relaxed text-slate-600">
                              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-slate-400" />
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Related careers — flat list, no nested cards */}
              {relatedCareers.length > 0 && (
                <section className="border-t border-slate-100 pt-8">
                  <SectionLabel>Similar Careers</SectionLabel>
                  <div className="divide-y divide-slate-100">
                    {relatedCareers.slice(0, 3).map((rc) => (
                      <button
                        key={rc.id}
                        onClick={() => onSelectCareer?.(rc)}
                        className="w-full flex items-center justify-between gap-4 py-4 text-left group hover:bg-slate-50 -mx-1 px-1 rounded-lg transition-colors"
                      >
                        <div className="min-w-0">
                          <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 mb-0.5">
                            {categoryLabels[rc.category] ?? rc.category}
                          </p>
                          <p className="text-sm font-bold text-slate-900 leading-snug truncate">{rc.title}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                      </button>
                    ))}
                  </div>
                </section>
              )}

              {/* CTAs */}
              <section className="border-t border-slate-100 pt-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => onNavigate?.('library')}
                    className="w-full py-3.5 px-5 rounded-xl font-bold text-xs uppercase tracking-widest text-white bg-slate-900 hover:bg-slate-700 flex items-center justify-center gap-2 transition-colors"
                  >
                    <GraduationCap className="w-4 h-4" />
                    Start Studying
                  </button>
                  <button
                    onClick={() => onNavigate?.('bursaries')}
                    className="w-full py-3.5 px-5 rounded-xl font-bold text-xs uppercase tracking-widest bg-amber-400 text-slate-900 hover:bg-amber-300 flex items-center justify-center gap-2 transition-colors"
                  >
                    Find Bursaries
                  </button>
                </div>
              </section>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
