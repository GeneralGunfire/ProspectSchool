import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, ArrowRight, ChevronLeft, ChevronRight,
  Calculator, Atom, FlaskConical, Briefcase, TrendingUp,
  Monitor, Pencil, Languages, BookOpen, type LucideIcon,
  Lock,
} from 'lucide-react';
import { subjects } from '../data/subjects';

type Step = 'subject' | 'grade' | 'term' | 'content';

interface SubjectMeta {
  Icon: LucideIcon;
  color: string;
  bg: string;
  border: string;
  pill: string;
}

const SUBJECT_META: Record<string, SubjectMeta> = {
  'algebra':           { Icon: Calculator,  color: 'text-slate-700', bg: 'bg-slate-100', border: 'border-slate-200', pill: 'bg-slate-100 text-slate-700' },
  'geometry':          { Icon: Calculator,  color: 'text-slate-700', bg: 'bg-slate-100', border: 'border-slate-200', pill: 'bg-slate-100 text-slate-700' },
  'phys-sci':          { Icon: Atom,        color: 'text-slate-700', bg: 'bg-slate-100', border: 'border-slate-200', pill: 'bg-slate-100 text-slate-700' },
  'life-sci':          { Icon: FlaskConical,color: 'text-slate-700', bg: 'bg-slate-100', border: 'border-slate-200', pill: 'bg-slate-100 text-slate-700' },
  'accounting':        { Icon: Calculator,  color: 'text-slate-700', bg: 'bg-slate-100', border: 'border-slate-200', pill: 'bg-slate-100 text-slate-700' },
  'business-studies':  { Icon: Briefcase,   color: 'text-slate-700', bg: 'bg-slate-100', border: 'border-slate-200', pill: 'bg-slate-100 text-slate-700' },
  'economics':         { Icon: TrendingUp,  color: 'text-slate-700', bg: 'bg-slate-100', border: 'border-slate-200', pill: 'bg-slate-100 text-slate-700' },
  'cat':               { Icon: Monitor,     color: 'text-slate-700', bg: 'bg-slate-100', border: 'border-slate-200', pill: 'bg-slate-100 text-slate-700' },
  'egd':               { Icon: Pencil,      color: 'text-slate-700', bg: 'bg-slate-100', border: 'border-slate-200', pill: 'bg-slate-100 text-slate-700' },
  'english-hl':        { Icon: Languages,   color: 'text-slate-700', bg: 'bg-slate-100', border: 'border-slate-200', pill: 'bg-slate-100 text-slate-700' },
  'default':           { Icon: BookOpen,    color: 'text-slate-400', bg: 'bg-slate-100', border: 'border-slate-100', pill: 'bg-slate-100 text-slate-500' },
};

const subjectsWithContent = new Set(['algebra', 'phys-sci', 'life-sci', 'accounting', 'business-studies', 'economics', 'cat', 'egd']);

const ALGEBRA_G10_TOPICS: Record<number, string[]> = {
  1: ['Linear Equations', 'Simultaneous Equations'],
};
const PHYSCI_G10_TOPICS: Record<number, string[]> = {
  1: ['Waves, Sound & Light', 'Atoms & Subatomic Particles', 'Classification of Matter', 'Periodic Table Trends', 'Chemical Bonding'],
};
const LIFESCI_G10_TOPICS: Record<number, string[]> = {
  1: ['Biodiversity & Classification', 'Five Kingdoms', 'Taxonomy & Binomial Nomenclature', 'The Species Concept'],
};
const ACCOUNTING_G10_TOPICS: Record<number, string[]> = {
  1: ['Introduction to Accounting', 'The Accounting Equation', 'Double-Entry System', 'Source Documents', 'Journals in Accounting', 'The General Ledger'],
};
const BIZSTUDIES_G10_TOPICS: Record<number, string[]> = {
  1: ['Business Environment', 'Business Sectors', 'Business Stakeholders', 'Business Operations'],
};
const ECONOMICS_G10_TOPICS: Record<number, string[]> = {
  1: ['The Economic Problem', 'Production Possibility Curve', 'Economic Systems', 'Circular Flow Model', 'Factors of Production'],
};
const CAT_G10_TOPICS: Record<number, string[]> = {
  1: ['Computer Systems', 'File Management', 'Word Processing', 'Spreadsheets'],
};
const EGD_G10_TOPICS: Record<number, string[]> = {
  1: ['Drawing Instruments & Equipment'],
};

const PHYSCI_G10_T1_PAGES: AppPage[] = ['learning-physci-g10-t1-waves','learning-physci-g10-t1-atoms','learning-physci-g10-t1-classification','learning-physci-g10-t1-periodic-table','learning-physci-g10-t1-bonding'];
const LIFESCI_G10_T1_PAGES: AppPage[] = ['learning-lifesci-g10-t1-biodiversity','learning-lifesci-g10-t1-five-kingdoms','learning-lifesci-g10-t1-taxonomy','learning-lifesci-g10-t1-species'];
const ACCOUNTING_G10_T1_PAGES: AppPage[] = ['learning-accounting-g10-t1-intro','learning-accounting-g10-t1-equation','learning-accounting-g10-t1-double-entry','learning-accounting-g10-t1-source-documents','learning-accounting-g10-t1-journals','learning-accounting-g10-t1-ledger'];
const BIZSTUDIES_G10_T1_PAGES: AppPage[] = ['learning-bizstudies-g10-t1-environment','learning-bizstudies-g10-t1-sectors','learning-bizstudies-g10-t1-stakeholders','learning-bizstudies-g10-t1-operations'];
const ECONOMICS_G10_T1_PAGES: AppPage[] = ['learning-economics-g10-t1-problem','learning-economics-g10-t1-ppc','learning-economics-g10-t1-systems','learning-economics-g10-t1-circular-flow','learning-economics-g10-t1-factors'];
const CAT_G10_T1_PAGES: AppPage[] = ['learning-cat-g10-t1-computer-systems','learning-cat-g10-t1-file-management','learning-cat-g10-t1-word-processing','learning-cat-g10-t1-spreadsheets'];
const EGD_G10_T1_PAGES: AppPage[] = ['learning-egd-g10-t1-drawing-instruments'];

function getTopicsAndPages(subjectId: string | null, grade: number | null, term: number | null): { names: string[]; pages: AppPage[] } {
  if (subjectId === 'algebra'          && grade === 10 && term === 1) return { names: ALGEBRA_G10_TOPICS[1],      pages: ['learning-algebra-g10-t1-linear-equations', 'learning-algebra-g10-t1-simultaneous'] };
  if (subjectId === 'phys-sci'         && grade === 10 && term === 1) return { names: PHYSCI_G10_TOPICS[1],       pages: PHYSCI_G10_T1_PAGES };
  if (subjectId === 'life-sci'         && grade === 10 && term === 1) return { names: LIFESCI_G10_TOPICS[1],      pages: LIFESCI_G10_T1_PAGES };
  if (subjectId === 'accounting'       && grade === 10 && term === 1) return { names: ACCOUNTING_G10_TOPICS[1],   pages: ACCOUNTING_G10_T1_PAGES };
  if (subjectId === 'business-studies' && grade === 10 && term === 1) return { names: BIZSTUDIES_G10_TOPICS[1],   pages: BIZSTUDIES_G10_T1_PAGES };
  if (subjectId === 'economics'        && grade === 10 && term === 1) return { names: ECONOMICS_G10_TOPICS[1],    pages: ECONOMICS_G10_T1_PAGES };
  if (subjectId === 'cat'              && grade === 10 && term === 1) return { names: CAT_G10_TOPICS[1],          pages: CAT_G10_T1_PAGES };
  if (subjectId === 'egd'              && grade === 10 && term === 1) return { names: EGD_G10_TOPICS[1],          pages: EGD_G10_T1_PAGES };
  return { names: [], pages: [] };
}

function getTermTopics(subjectId: string | null, grade: number | null, term: number): string[] {
  if (subjectId === 'algebra'          && grade === 10) return ALGEBRA_G10_TOPICS[term] ?? [];
  if (subjectId === 'phys-sci'         && grade === 10) return PHYSCI_G10_TOPICS[term] ?? [];
  if (subjectId === 'life-sci'         && grade === 10) return LIFESCI_G10_TOPICS[term] ?? [];
  if (subjectId === 'accounting'       && grade === 10) return ACCOUNTING_G10_TOPICS[term] ?? [];
  if (subjectId === 'business-studies' && grade === 10) return BIZSTUDIES_G10_TOPICS[term] ?? [];
  if (subjectId === 'economics'        && grade === 10) return ECONOMICS_G10_TOPICS[term] ?? [];
  if (subjectId === 'cat'              && grade === 10) return CAT_G10_TOPICS[term] ?? [];
  if (subjectId === 'egd'              && grade === 10) return EGD_G10_TOPICS[term] ?? [];
  return [];
}

function StudyLibraryPage({ onNavigate }: { onNavigate: (page: any) => void }) {
  const [searchQuery, setSearchQuery] = useState('');

  // Allow learning pages to deep-link back to the topic list
  const returnCtx = (() => {
    try { return JSON.parse(sessionStorage.getItem('library_return') ?? 'null'); } catch { return null; }
  })();
  if (returnCtx) sessionStorage.removeItem('library_return');

  const [step, setStep] = useState<Step>(returnCtx ? 'content' : 'subject');
  const [selectedSubject, setSelectedSubject] = useState<string | null>(returnCtx?.subjectId ?? null);
  const [selectedGrade, setSelectedGrade] = useState<number | null>(returnCtx?.grade ?? null);
  const [selectedTerm, setSelectedTerm] = useState<number | null>(returnCtx?.term ?? null);

  const filteredSubjects = subjects.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const currentSubjectName = subjects.find(s => s.id === selectedSubject)?.name ?? '';
  const currentMeta = SUBJECT_META[selectedSubject ?? ''] ?? SUBJECT_META['default'];
  const coreSubjects = filteredSubjects.filter(s => s.category === 'Core');
  const electiveSubjects = filteredSubjects.filter(s => s.category === 'Elective');

  const goBack = () => {
    if (step === 'grade') setStep('subject');
    else if (step === 'term') setStep('grade');
    else if (step === 'content') setStep('term');
  };


  return (
    <div className="min-h-screen" style={{ background: 'oklch(98.5% 0.005 80)' }}>

      <div className="pt-20 pb-24 max-w-5xl mx-auto px-4 sm:px-6">

        <AnimatePresence mode="wait">

          {/* ── Subject selection ── */}
          {step === 'subject' && (
            <motion.div
              key="subject"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              {/* Hero header */}
              <div className="pt-6 mb-10">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">Study Library</span>
                </div>
                <h1 className="text-4xl sm:text-5xl font-black text-slate-900" style={{ letterSpacing: '-0.03em' }}>
                  What are you<br className="sm:hidden" /> studying?
                </h1>
              </div>

              {/* Search */}
              <div className="relative mb-8 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search subjects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-[15px] text-slate-900 placeholder:text-slate-400 outline-none focus:border-slate-400 transition-colors bg-white shadow-sm"
                  style={{ fontSize: '16px' }}
                />
              </div>

              {filteredSubjects.length === 0 ? (
                <div className="py-20 text-center">
                  <p className="text-[15px] font-black text-slate-900 mb-1">No subjects found</p>
                  <p className="text-[13px] text-slate-400">Try a different search term.</p>
                </div>
              ) : (() => {
                const available = filteredSubjects.filter(s => subjectsWithContent.has(s.id));
                const comingSoon = filteredSubjects.filter(s => !subjectsWithContent.has(s.id));

                const SubjectCard = ({ subject }: { subject: typeof filteredSubjects[0] }) => {
                  const hasContent = subjectsWithContent.has(subject.id);
                  const meta = SUBJECT_META[subject.id] ?? SUBJECT_META['default'];
                  const Icon = meta.Icon;
                  return (
                    <motion.button
                      key={subject.id}
                      onClick={() => { if (!hasContent) return; setSelectedSubject(subject.id); setStep('grade'); }}
                      disabled={!hasContent}
                      whileHover={hasContent ? { y: -2, scale: 1.01 } : {}}
                      whileTap={hasContent ? { scale: 0.98 } : {}}
                      transition={{ duration: 0.15 }}
                      className={`relative flex flex-col items-start gap-3 p-5 rounded-2xl border text-left transition-all ${
                        hasContent
                          ? 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-md cursor-pointer group'
                          : 'bg-white/40 border-slate-100 cursor-default'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        hasContent ? `${meta.bg} ${meta.color}` : 'bg-slate-100 text-slate-300'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0 w-full">
                        <p className={`text-[14px] font-black leading-snug ${hasContent ? 'text-slate-900' : 'text-slate-300'}`} style={{ letterSpacing: '-0.01em' }}>
                          {subject.name}
                        </p>
                      </div>
                      <div className="flex items-center justify-between w-full">
                        {hasContent ? (
                          <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${meta.pill}`}>
                            Lessons live
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-slate-300">
                            <Lock className="w-2.5 h-2.5" /> Coming soon
                          </span>
                        )}
                        {hasContent && (
                          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-colors" />
                        )}
                      </div>
                    </motion.button>
                  );
                };

                return (
                  <div className="space-y-10">
                    {available.length > 0 && (
                      <section>
                        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400 mb-4">Available Now</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {available.map(s => <SubjectCard key={s.id} subject={s} />)}
                        </div>
                      </section>
                    )}
                    {comingSoon.length > 0 && (
                      <section>
                        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-300 mb-4">Coming Soon</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {comingSoon.map(s => <SubjectCard key={s.id} subject={s} />)}
                        </div>
                      </section>
                    )}
                  </div>
                );
              })()}
            </motion.div>
          )}

          {/* ── Grade selection ── */}
          {step === 'grade' && (
            <motion.div
              key="grade"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="max-w-xl"
            >
              <button
                onClick={goBack}
                className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-700 transition-colors mb-8"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> All Subjects
              </button>

              {/* Subject banner */}
              <div className={`flex items-center gap-4 p-5 rounded-2xl border mb-8 ${currentMeta.bg} ${currentMeta.border}`}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-white/70 ${currentMeta.color}`}>
                  <currentMeta.Icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Selected subject</p>
                  <p className={`text-[18px] font-black ${currentMeta.color}`} style={{ letterSpacing: '-0.02em' }}>{currentSubjectName}</p>
                </div>
              </div>

              <h2 className="text-2xl font-black text-slate-900 mb-6" style={{ letterSpacing: '-0.025em' }}>
                Select your grade
              </h2>

              <div className="grid grid-cols-3 gap-3">
                {[10, 11, 12].map((grade) => (
                  <motion.button
                    key={grade}
                    onClick={() => { setSelectedGrade(grade); setStep('term'); }}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="flex flex-col items-center justify-center gap-1 p-6 bg-white border border-slate-200 rounded-2xl hover:border-slate-900 hover:shadow-md transition-all group cursor-pointer"
                  >
                    <p className="text-[28px] font-black text-slate-900 group-hover:text-slate-900" style={{ letterSpacing: '-0.03em' }}>
                      {grade}
                    </p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Grade</p>
                  </motion.button>
                ))}
              </div>

              <p className="text-[12px] text-slate-400 mt-4 text-center">
                Grades 11 & 12 content coming soon — Grade 10 fully available
              </p>
            </motion.div>
          )}

          {/* ── Term selection ── */}
          {step === 'term' && (
            <motion.div
              key="term"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="max-w-xl"
            >
              <button
                onClick={goBack}
                className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-700 transition-colors mb-8"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Grade {selectedGrade}
              </button>

              <div className="mb-8">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400 mb-1">
                  {currentSubjectName} · Grade {selectedGrade}
                </p>
                <h2 className="text-2xl font-black text-slate-900" style={{ letterSpacing: '-0.025em' }}>
                  Select a term
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[1, 2, 3, 4].map((term) => {
                  const topics = getTermTopics(selectedSubject, selectedGrade, term);
                  const isLive = topics.length > 0;

                  return (
                    <motion.button
                      key={term}
                      onClick={() => { setSelectedTerm(term); setStep('content'); }}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className={`flex flex-col items-start gap-3 p-5 rounded-2xl border text-left transition-all ${
                        isLive
                          ? 'bg-white border-slate-200 hover:border-slate-900 hover:shadow-md cursor-pointer group'
                          : 'bg-white/60 border-slate-100 cursor-pointer'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <p className="text-[22px] font-black text-slate-900" style={{ letterSpacing: '-0.025em' }}>
                          Term {term}
                        </p>
                        {isLive ? (
                          <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                            Live
                          </span>
                        ) : (
                          <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-slate-100 text-slate-400">
                            Soon
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug">
                        {isLive ? `${topics.length} topic${topics.length !== 1 ? 's' : ''}` : 'Content in development'}
                      </p>
                      {isLive && topics.length > 0 && (
                        <p className="text-[11px] text-slate-500 leading-snug line-clamp-2">
                          {topics.slice(0, 2).join(' · ')}{topics.length > 2 ? ` +${topics.length - 2} more` : ''}
                        </p>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ── Content / topic list ── */}
          {step === 'content' && (
            <motion.div
              key="content"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="max-w-xl"
            >
              <button
                onClick={goBack}
                className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-700 transition-colors mb-8"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Term {selectedTerm}
              </button>

              {(() => {
                const { names: topicNames, pages: topicPages } = getTopicsAndPages(selectedSubject, selectedGrade, selectedTerm);

                if (topicNames.length > 0) {
                  return (
                    <>
                      <div className="mb-8">
                        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400 mb-1">
                          {currentSubjectName} · Grade {selectedGrade} · Term {selectedTerm}
                        </p>
                        <h2 className="text-2xl font-black text-slate-900" style={{ letterSpacing: '-0.025em' }}>
                          {topicNames.length} {topicNames.length === 1 ? 'topic' : 'topics'} available
                        </h2>
                      </div>

                      <div className="space-y-2">
                        {topicNames.map((name, i) => (
                          <motion.button
                            key={i}
                            onClick={() => onNavigate(topicPages[i])}
                            whileHover={{ x: 3 }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ duration: 0.15 }}
                            className="w-full flex items-center gap-4 px-5 py-4 bg-white border border-slate-200 rounded-2xl hover:border-slate-900 hover:shadow-md transition-all text-left group"
                          >
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-[12px] font-black ${currentMeta.bg} ${currentMeta.color}`}>
                              {i + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[15px] font-bold text-slate-900 leading-snug">{name}</p>
                              <p className="text-[11px] text-slate-400 mt-0.5">Interactive lesson · Practice quiz</p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-700 transition-colors shrink-0" />
                          </motion.button>
                        ))}
                      </div>
                    </>
                  );
                }

                return (
                  <>
                    <div className="mb-8">
                      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400 mb-1">
                        {currentSubjectName} · Grade {selectedGrade} · Term {selectedTerm}
                      </p>
                      <h2 className="text-2xl font-black text-slate-900" style={{ letterSpacing: '-0.025em' }}>
                        Coming soon
                      </h2>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-4">
                      <p className="text-[14px] text-slate-600 leading-relaxed">
                        Study materials for <strong>{currentSubjectName}</strong> Grade {selectedGrade} Term {selectedTerm} are being developed. Check back soon.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <button
                        onClick={() => setStep('subject')}
                        className="w-full flex items-center justify-between px-5 py-4 bg-white border border-slate-200 rounded-2xl hover:border-slate-900 hover:shadow-md transition-all group text-left"
                      >
                        <div>
                          <p className="text-[14px] font-bold text-slate-900">Browse other subjects</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">See what's already available</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-700 transition-colors" />
                      </button>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}

export default StudyLibraryPage;
