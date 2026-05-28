import { useState, useEffect, type ReactNode, lazy, Suspense, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'motion/react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import {
  GraduationCap,
  Briefcase,
  BookOpen,
  MapPin,
  Award,
  Compass,
  Rocket,
  ArrowRight,
  Menu,
  X,
  Facebook,
  Instagram,
  Twitter,
  HelpCircle,
} from 'lucide-react';

// Lazy-load all page-level components
const CareersPageNew     = lazy(() => import('./features/careers/pages/CareersPageNew'));
const BursariesPage      = lazy(() => import('./features/careers/pages/BursariesPage'));
const BursaryDetailPage  = lazy(() => import('./features/careers/pages/BursaryDetailPage'));
const QuizPage           = lazy(() => import('./features/careers/pages/QuizPage'));
const MapPage            = lazy(() => import('./features/careers/pages/MapPage'));
const TVETPage           = lazy(() => import('./features/tvet/pages/TVETPage'));
const TVETCareersPage    = lazy(() => import('./features/tvet/pages/TVETCareersPage'));
const TVETCollegesPage   = lazy(() => import('./features/tvet/pages/TVETCollegesPage'));
const TVETFundingPage    = lazy(() => import('./features/tvet/pages/TVETFundingPage'));
const TVETRequirementsPage = lazy(() => import('./features/tvet/pages/TVETRequirementsPage'));
const LinearEquationsPage = lazy(() => import('./features/study/pages/learning/Algebra/Grade10/Term1/LinearEquations'));
const SimultaneousEquationsPage = lazy(() => import('./features/study/pages/learning/Algebra/Grade10/Term1/SimultaneousEquations'));
const WavesSoundLightPage = lazy(() => import('./features/study/pages/learning/PhysicalSciences/Grade10/Term1/WavesSoundLight'));
const AtomsSubatomicParticlesPage = lazy(() => import('./features/study/pages/learning/PhysicalSciences/Grade10/Term1/AtomsSubatomicParticles'));
const ClassificationOfMatterPage = lazy(() => import('./features/study/pages/learning/PhysicalSciences/Grade10/Term1/ClassificationOfMatter'));
const PeriodicTableTrendsPage = lazy(() => import('./features/study/pages/learning/PhysicalSciences/Grade10/Term1/PeriodicTableTrends'));
const ChemicalBondingPage = lazy(() => import('./features/study/pages/learning/PhysicalSciences/Grade10/Term1/ChemicalBonding'));
const BiodiversityAndClassificationPage = lazy(() => import('./features/study/pages/learning/LifeSciences/Grade10/Term1/BiodiversityAndClassification'));
const FiveKingdomsPage = lazy(() => import('./features/study/pages/learning/LifeSciences/Grade10/Term1/FiveKingdoms'));
const TaxonomyAndBinomialNomenclaturePage = lazy(() => import('./features/study/pages/learning/LifeSciences/Grade10/Term1/TaxonomyAndBinomialNomenclature'));
const SpeciesConceptPage = lazy(() => import('./features/study/pages/learning/LifeSciences/Grade10/Term1/SpeciesConcept'));
const IntroductionToAccountingPage = lazy(() => import('./features/study/pages/learning/Accounting/Grade10/Term1/IntroductionToAccounting'));
const AccountingEquationPage = lazy(() => import('./features/study/pages/learning/Accounting/Grade10/Term1/AccountingEquation'));
const DoubleEntrySystemPage = lazy(() => import('./features/study/pages/learning/Accounting/Grade10/Term1/DoubleEntrySystem'));
const SourceDocumentsPage = lazy(() => import('./features/study/pages/learning/Accounting/Grade10/Term1/SourceDocuments'));
const JournalsInAccountingPage = lazy(() => import('./features/study/pages/learning/Accounting/Grade10/Term1/JournalsInAccounting'));
const GeneralLedgerPage = lazy(() => import('./features/study/pages/learning/Accounting/Grade10/Term1/GeneralLedger'));
const BusinessEnvironmentPage = lazy(() => import('./features/study/pages/learning/BusinessStudies/Grade10/Term1/BusinessEnvironment'));
const BusinessSectorsPage = lazy(() => import('./features/study/pages/learning/BusinessStudies/Grade10/Term1/BusinessSectors'));
const BusinessStakeholdersPage = lazy(() => import('./features/study/pages/learning/BusinessStudies/Grade10/Term1/BusinessStakeholders'));
const BusinessOperationsPage = lazy(() => import('./features/study/pages/learning/BusinessStudies/Grade10/Term1/BusinessOperations'));
const EconomicProblemPage = lazy(() => import('./features/study/pages/learning/Economics/Grade10/Term1/EconomicProblem'));
const ProductionPossibilityCurvePage = lazy(() => import('./features/study/pages/learning/Economics/Grade10/Term1/ProductionPossibilityCurve'));
const EconomicSystemsPage = lazy(() => import('./features/study/pages/learning/Economics/Grade10/Term1/EconomicSystems'));
const CircularFlowModelPage = lazy(() => import('./features/study/pages/learning/Economics/Grade10/Term1/CircularFlowModel'));
const FactorsOfProductionPage = lazy(() => import('./features/study/pages/learning/Economics/Grade10/Term1/FactorsOfProduction'));
const ComputerSystemsPage = lazy(() => import('./features/study/pages/learning/CAT/Grade10/Term1/ComputerSystems'));
const FileManagementPage = lazy(() => import('./features/study/pages/learning/CAT/Grade10/Term1/FileManagement'));
const WordProcessingPage = lazy(() => import('./features/study/pages/learning/CAT/Grade10/Term1/WordProcessing'));
const SpreadsheetsPage = lazy(() => import('./features/study/pages/learning/CAT/Grade10/Term1/Spreadsheets'));
const DrawingInstrumentsPage = lazy(() => import('./features/study/pages/learning/EGD/Grade10/Term1/DrawingInstruments'));
import ProblemSection from './features/landing/ProblemSection';
import Perspectives from './features/landing/Perspectives';
import CareerSection from './features/landing/CareerSection';
import CTASection from './features/landing/CTASection';
import LandingFooter from './features/landing/LandingFooter';

// Auth & Portal pages
const TeacherLogin = lazy(() => import('./pages/auth/TeacherLogin'));
const StudentLogin = lazy(() => import('./pages/auth/StudentLogin'));
const AdminLogin = lazy(() => import('./pages/auth/AdminLogin'));
const TeacherDashboard = lazy(() => import('./pages/portal/TeacherDashboard'));
const StudentDashboard = lazy(() => import('./pages/portal/StudentDashboard'));
const AdminDashboard = lazy(() => import('./pages/portal/AdminDashboard'));
const PortalEntry = lazy(() => import('./pages/portal/PortalEntry'));


type Page =
  | 'home' | 'careers' | 'quiz' | 'bursaries' | 'bursary' | 'map'
  | 'tvet' | 'tvet-careers' | 'tvet-colleges' | 'tvet-funding' | 'tvet-requirements'
  | 'learning-algebra-g10-t1-linear-equations' | 'learning-algebra-g10-t1-simultaneous'
  | 'learning-physci-g10-t1-waves' | 'learning-physci-g10-t1-atoms'
  | 'learning-physci-g10-t1-classification' | 'learning-physci-g10-t1-periodic-table'
  | 'learning-physci-g10-t1-bonding'
  | 'learning-lifesci-g10-t1-biodiversity' | 'learning-lifesci-g10-t1-five-kingdoms'
  | 'learning-lifesci-g10-t1-taxonomy' | 'learning-lifesci-g10-t1-species'
  | 'learning-accounting-g10-t1-intro' | 'learning-accounting-g10-t1-equation'
  | 'learning-accounting-g10-t1-double-entry' | 'learning-accounting-g10-t1-source-documents'
  | 'learning-accounting-g10-t1-journals' | 'learning-accounting-g10-t1-ledger'
  | 'learning-bizstudies-g10-t1-environment' | 'learning-bizstudies-g10-t1-sectors'
  | 'learning-bizstudies-g10-t1-stakeholders' | 'learning-bizstudies-g10-t1-operations'
  | 'learning-economics-g10-t1-problem' | 'learning-economics-g10-t1-ppc'
  | 'learning-economics-g10-t1-systems' | 'learning-economics-g10-t1-circular-flow'
  | 'learning-economics-g10-t1-factors'
  | 'learning-cat-g10-t1-computer-systems' | 'learning-cat-g10-t1-file-management'
  | 'learning-cat-g10-t1-word-processing' | 'learning-cat-g10-t1-spreadsheets'
  | 'learning-egd-g10-t1-drawing-instruments'
  // Portal pages
  | 'portal' | 'teacher-login' | 'student-login' | 'admin-login'
  | 'teacher-dashboard' | 'student-dashboard' | 'admin-dashboard';

// ── Animated Nav ──────────────────────────────────────────────────────────────

const EXPAND_SCROLL_THRESHOLD = 80;

const AnimatedNav = ({ onNavigate }: { onNavigate: (page: Page) => void }) => {
  const [isExpanded, setExpanded] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();
  const lastScrollY = useRef(0);
  const scrollPositionOnCollapse = useRef(0);

  const navItems = [
    { name: 'Career Guide', page: 'quiz' as Page },
    { name: 'School Assist', page: 'library' as Page },
    { name: 'Portal', page: 'portal' as Page },
  ];

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = lastScrollY.current;
    if (isExpanded && latest > previous && latest > 150) {
      setExpanded(false);
      scrollPositionOnCollapse.current = latest;
    } else if (!isExpanded && latest < previous && (scrollPositionOnCollapse.current - latest > EXPAND_SCROLL_THRESHOLD)) {
      setExpanded(true);
    }
    lastScrollY.current = latest;
  });

  const handleNavClick = (e: React.MouseEvent) => {
    if (!isExpanded) { e.preventDefault(); setExpanded(true); }
  };

  return (
    <>
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[120]">
        <motion.nav
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1, width: isExpanded ? 'auto' : '3rem' }}
          transition={{ y: { duration: 0.4, ease: 'easeOut' }, opacity: { duration: 0.3 }, width: { type: 'spring', damping: 28, stiffness: 260 } }}
          whileHover={!isExpanded ? { scale: 1.08 } : {}}
          whileTap={!isExpanded ? { scale: 0.95 } : {}}
          onClick={handleNavClick}
          className={`flex items-center overflow-hidden rounded-full border border-slate-200 bg-white/80 shadow-lg backdrop-blur-sm h-12 ${!isExpanded ? 'cursor-pointer justify-center' : ''}`}
        >
          <motion.div
            animate={{ opacity: isExpanded ? 1 : 0 }}
            transition={{ duration: 0.18 }}
            className="shrink-0 flex items-center font-black pl-4 pr-2 gap-2"
          >
            <div className="w-6 h-6 rounded bg-slate-900 flex items-center justify-center text-white font-black text-xs">P</div>
            <span className="text-xs font-black uppercase tracking-widest text-slate-900 hidden sm:block">Prospect</span>
          </motion.div>

          <motion.div
            animate={{ opacity: isExpanded ? 1 : 0 }}
            transition={{ duration: 0.18 }}
            className={`flex items-center gap-1 sm:gap-3 pr-4 ${!isExpanded ? 'pointer-events-none' : ''}`}
          >
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={(e) => { e.stopPropagation(); onNavigate(item.page); }}
                className="text-[13px] font-bold text-slate-600 hover:text-slate-900 transition-colors px-2 py-1 rounded-lg hover:bg-slate-100 whitespace-nowrap"
              >
                {item.name}
              </button>
            ))}
          </motion.div>

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div
              animate={{ opacity: isExpanded ? 0 : 1 }}
              transition={{ duration: 0.18 }}
            >
              <Menu className="h-5 w-5 text-slate-700" />
            </motion.div>
          </div>
        </motion.nav>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/40 z-110 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="fixed top-0 right-0 h-full w-72 bg-white z-120 flex flex-col"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <span className="font-black text-sm uppercase text-slate-900" style={{ letterSpacing: '0.18em' }}>Prospect</span>
                <button onClick={() => setMobileOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-100">
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>
              <div className="flex flex-col gap-1 p-4">
                {navItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => { setMobileOpen(false); onNavigate(item.page); }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 text-left text-[14px] font-bold text-slate-700 transition-colors"
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

// ── Tutorial Dialog ───────────────────────────────────────────────────────────

const TUTORIAL_STEPS = [
  {
    title: "Welcome to Prospect SA",
    description: "Your free, all-in-one platform for career discovery and academic support — built for South African students. Everything you need to plan, study, and succeed is right here.",
    icon: <div className="w-20 h-20 rounded-xl bg-slate-900 flex items-center justify-center text-white font-black text-4xl mx-auto mb-6">P</div>,
  },
  {
    title: "Discover Your Career",
    description: "Take our free RIASEC career quiz to find careers that match your personality and interests. Browse 400+ SA careers with salary data, APS requirements, university pathways, bursaries, and a job demand map by province.",
    icon: <div className="w-20 h-20 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-6"><Compass className="w-10 h-10 text-slate-700" /></div>,
  },
  {
    title: "School Assist",
    description: "Your personal study hub. Access curriculum-aligned content for Grades 10–12, use the AI guidance chat, and browse the full study library — all free, no account needed.",
    icon: <div className="w-20 h-20 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-6"><BookOpen className="w-10 h-10 text-slate-700" /></div>,
  },
];

const TutorialDialog = () => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  const handleClose = () => { setOpen(false); setStep(0); };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Trigger asChild>
        <button
          className="fixed bottom-6 right-6 z-[115] flex items-center gap-2 bg-slate-900 text-white text-[11px] font-black uppercase tracking-widest px-4 py-2.5 rounded-xl hover:bg-slate-800 transition-colors"
          aria-label="How it works"
        >
          <HelpCircle className="w-4 h-4" />
          How it works
        </button>
      </DialogPrimitive.Trigger>

      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[201] bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-[201] w-full -translate-x-1/2 -translate-y-1/2 gap-4 border border-slate-200 bg-white p-10 duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:max-w-[640px] rounded-xl">

          <DialogPrimitive.Close className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors outline-none">
            <Cross2Icon width={16} height={16} />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.22 }}
              className="text-center"
            >
              {TUTORIAL_STEPS[step].icon}
              <h2 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">
                {TUTORIAL_STEPS[step].title}
              </h2>
              <p className="text-[15px] text-slate-500 leading-[1.65] max-w-md mx-auto">
                {TUTORIAL_STEPS[step].description}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center gap-1.5 mt-8">
            {TUTORIAL_STEPS.map((_, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-6 bg-slate-900' : 'w-1.5 bg-slate-200'}`}
              />
            ))}
          </div>

          <div className="flex items-center justify-between mt-8">
            <button
              onClick={handleClose}
              className="text-[13px] text-slate-400 hover:text-slate-600 font-bold transition-colors"
            >
              Skip
            </button>
            <button
              onClick={() => {
                if (step < TUTORIAL_STEPS.length - 1) setStep(step + 1);
                else handleClose();
              }}
              className="flex items-center gap-1.5 bg-slate-900 text-white text-[11px] font-black uppercase tracking-widest px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-colors"
            >
              {step < TUTORIAL_STEPS.length - 1 ? 'Next' : 'Get Started'}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};

// ── Header + Hero (zip file style) ───────────────────────────────────────────

const HeroNav = ({ onNavigate }: { onNavigate: (page: Page) => void }) => {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      setScrollY(current);
      if (current > 150) {
        setIsVisible(current < lastScrollY.current);
      } else {
        setIsVisible(true);
      }
      lastScrollY.current = current;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: 0, opacity: 1 }}
        animate={{ y: isVisible ? 0 : -100, opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="fixed top-0 left-0 right-0 z-[120] flex items-center justify-between px-5 sm:px-8 py-4 sm:py-5 bg-gradient-to-b from-[#FAF9F6] via-[#FAF9F6] to-[#FAF9F6]/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm pointer-events-auto"
      >
        {/* Animated background gradient on scroll */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: scrollY > 50 ? 0.3 : 0 }}
          className="absolute inset-0 bg-gradient-to-r from-slate-50/40 via-transparent to-slate-50/40 pointer-events-none"
        />

        <div className="relative flex items-center gap-12 sm:gap-16">
          <motion.button
            onClick={() => onNavigate('home')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3 group"
          >
            <motion.div
              whileHover={{ rotate: 12, scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center text-white font-black text-base shadow-lg shadow-slate-900/20 group-hover:shadow-xl group-hover:shadow-slate-900/30 transition-shadow"
            >
              P
            </motion.div>
            <span className="hidden sm:block text-lg font-black tracking-tight text-slate-900 group-hover:text-slate-700 transition-colors">Prospect</span>
          </motion.button>

        </div>

        <div className="relative flex items-center gap-2">
          <motion.button
            onClick={() => onNavigate('portal')}
            whileHover={{ scale: 1.05, boxShadow: '0 12px 24px rgba(15, 23, 42, 0.2)' }}
            whileTap={{ scale: 0.95 }}
            className="bg-slate-900 text-white text-sm font-black px-6 py-3 rounded-xl hover:bg-slate-800 transition-all duration-200 shadow-lg shadow-slate-900/25"
          >
            Login
          </motion.button>
        </div>
      </motion.header>

    </>
  );
};

const HeroSection = ({ onNavigate }: { onNavigate: (page: Page) => void }) => (
  <section
    className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-16 overflow-hidden"
    style={{
      backgroundImage: 'url(/images/hero_topography_1779608850775.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundColor: '#FAF9F6',
    }}
  >
    {/* Gradient fade */}
    <div className="absolute inset-0 bg-gradient-to-b from-[#FAF9F6]/20 via-[#FAF9F6]/30 to-[#FAF9F6] pointer-events-none" />

    <div className="relative z-10 w-full max-w-4xl mx-auto px-5 sm:px-8 text-center">
      {/* Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.7 }}
        className="text-[2.75rem] sm:text-6xl md:text-7xl font-extrabold leading-[1.05] tracking-[-0.03em] text-slate-900 mb-8"
      >
        The Future of Education
        <br />
        <span className="text-slate-400">Arriving Quietly.</span>
      </motion.h1>


      {/* Social proof strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.8 }}
        className="mt-16 pt-8 border-t border-slate-200/60 flex flex-wrap items-center justify-center gap-x-10 gap-y-4"
      >
        {[
          { value: '400+', label: 'Careers' },
          { value: '245+', label: 'Bursaries' },
          { value: '9', label: 'Provinces' },
          { value: '100%', label: 'Free' },
        ].map(stat => (
          <div key={stat.label} className="text-center">
            <p className="text-2xl font-bold text-slate-900 tracking-[-0.04em] leading-none mb-1">{stat.value}</p>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.14em]">{stat.label}</p>
          </div>
        ))}
      </motion.div>
    </div>

    {/* Scroll cue */}
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      transition={{ delay: 1.2 }}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-300 animate-bounce text-lg"
    >↓</motion.div>
  </section>
);

// ── Features Section ──────────────────────────────────────────────────────────

const FeaturesSection = ({ onNavigate }: { onNavigate: (page: Page) => void }) => {
  const features = [
    { icon: <Compass className="w-5 h-5" />, title: "Career Guide", sub: "Quiz, careers, bursaries, job map", page: 'quiz' as Page },
    { icon: <BookOpen className="w-5 h-5" />, title: "School Assist", sub: "Study library, AI tutor", page: 'library' as Page },
    { icon: <GraduationCap className="w-5 h-5" />, title: "TVET", sub: "Trade careers, 26 colleges, funding", page: 'tvet' as Page },
  ];

  return (
    <section className="py-24 lg:py-36 px-4 sm:px-6 bg-white border-b border-slate-100">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 lg:mb-20"
        >
          <p className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-400 mb-5">Three pillars</p>
          <h2
            className="font-black text-slate-900 max-w-2xl"
            style={{ fontSize: "clamp(2rem, 5.5vw, 3.5rem)", lineHeight: 1.05, letterSpacing: '-0.03em' }}
          >
            Everything a South African student needs.
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-slate-100 border border-slate-100 rounded-xl overflow-hidden">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: i * 0.06 }}
              onClick={() => onNavigate(f.page)}
              className="group flex flex-col bg-white p-6 sm:p-8 lg:p-10 cursor-pointer hover:bg-slate-900 transition-colors duration-300"
            >
              <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center mb-8 group-hover:bg-white/10 transition-colors duration-300 shrink-0 text-slate-500 group-hover:text-white">
                {f.icon}
              </div>
              <p className="font-black text-slate-900 group-hover:text-white text-[1rem] leading-tight mb-2 transition-colors duration-300" style={{ letterSpacing: '-0.015em' }}>
                {f.title}
              </p>
              <p className="text-[13px] text-slate-400 group-hover:text-white/50 leading-snug transition-colors duration-300">
                {f.sub}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ── Lamp Section ──────────────────────────────────────────────────────────────

const LampSection = () => {
  return (
    <section className="relative flex min-h-[60vh] sm:min-h-[75vh] flex-col items-center justify-center overflow-hidden bg-[#0f172a] w-full py-20 sm:py-28">
      <div className="absolute top-0 left-0 right-0 h-64 sm:h-80 flex items-start justify-center isolate pointer-events-none">
        <motion.div
          initial={{ opacity: 0.5, width: '10rem' }}
          whileInView={{ opacity: 1, width: '20rem' }}
          transition={{ delay: 0.3, duration: 0.8, ease: 'easeInOut' }}
          style={{ backgroundImage: 'conic-gradient(var(--conic-position), var(--tw-gradient-stops))' }}
          className="absolute inset-auto right-1/2 h-48 overflow-visible w-[20rem] bg-gradient-conic from-slate-400 via-transparent to-transparent text-white [--conic-position:from_70deg_at_center_top]"
        >
          <div className="absolute w-full left-0 bg-[#0f172a] h-32 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
          <div className="absolute w-32 h-full left-0 bg-[#0f172a] bottom-0 z-20 [mask-image:linear-gradient(to_right,white,transparent)]" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0.5, width: '10rem' }}
          whileInView={{ opacity: 1, width: '20rem' }}
          transition={{ delay: 0.3, duration: 0.8, ease: 'easeInOut' }}
          style={{ backgroundImage: 'conic-gradient(var(--conic-position), var(--tw-gradient-stops))' }}
          className="absolute inset-auto left-1/2 h-48 w-[20rem] bg-gradient-conic from-transparent via-transparent to-slate-400 text-white [--conic-position:from_290deg_at_center_top]"
        >
          <div className="absolute w-32 h-full right-0 bg-[#0f172a] bottom-0 z-20 [mask-image:linear-gradient(to_left,white,transparent)]" />
          <div className="absolute w-full right-0 bg-[#0f172a] h-32 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
        </motion.div>
        <div className="absolute inset-auto z-50 h-36 w-64 sm:w-md rounded-full bg-slate-300 opacity-10 blur-3xl top-0" />
        <motion.div
          initial={{ width: '6rem' }}
          whileInView={{ width: '12rem' }}
          transition={{ delay: 0.3, duration: 0.8, ease: 'easeInOut' }}
          className="absolute inset-auto z-30 h-24 rounded-full bg-slate-200 blur-2xl opacity-25 top-0"
        />
        <motion.div
          initial={{ width: '10rem' }}
          whileInView={{ width: '20rem' }}
          transition={{ delay: 0.3, duration: 0.8, ease: 'easeInOut' }}
          className="absolute inset-auto z-50 h-0.5 bg-slate-300 opacity-50 top-0"
        />
      </div>

      <div className="relative z-10 flex flex-col items-center px-5 text-center max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ delay: 0.2, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        >
          <blockquote
            className="font-black text-white leading-tight mb-6 sm:mb-8"
            style={{ fontSize: "clamp(1.25rem, 4vw, 2.5rem)", letterSpacing: '-0.025em', lineHeight: 1.15 }}
          >
            "Education is the most powerful weapon which you can use to change the world."
          </blockquote>
          <footer className="flex flex-col items-center gap-1 mb-6 sm:mb-8">
            <div className="w-8 h-px bg-slate-600 mb-3" />
            <cite className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 not-italic">
              Nelson Mandela
            </cite>
          </footer>
          <p className="text-[15px] text-slate-400 leading-[1.65] max-w-md mx-auto">
            Arm yourself with the knowledge to shape your own future.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

// ── What's Inside Section ─────────────────────────────────────────────────────

const CareerGuideSection = ({ onNavigate }: { onNavigate: (page: Page) => void }) => {
  const sections = [
    {
      eyebrow: 'No sign-in required',
      heading: 'Career Guide',
      desc: 'Discover the right path and find the funding to make it happen.',
      cta: { label: 'Start Career Quiz', page: 'quiz' as Page },
      tools: [
        { icon: <Compass className="w-4 h-4" />, title: 'RIASEC Career Quiz', page: 'quiz' as Page },
        { icon: <Briefcase className="w-4 h-4" />, title: 'Career Browser', page: 'careers' as Page },
        { icon: <Award className="w-4 h-4" />, title: 'Bursary Finder', page: 'bursaries' as Page },
        { icon: <MapPin className="w-4 h-4" />, title: 'Job Demand Map', page: 'map' as Page },
        { icon: <GraduationCap className="w-4 h-4" />, title: 'TVET Pathways', page: 'tvet' as Page },
      ],
    },
    {
      eyebrow: 'Free, no account needed',
      heading: 'School Assist',
      desc: 'Your personal study hub for the South African matric curriculum.',
      cta: { label: 'Open School Assist', page: 'library' as Page },
      tools: [
        { icon: <BookOpen className="w-4 h-4" />, title: 'Study Library', page: 'library' as Page },
        { icon: <Rocket className="w-4 h-4" />, title: 'School Assist AI', page: 'school-assist-chat' as Page },
      ],
    },
  ];

  return (
    <section className="py-24 lg:py-36 px-4 sm:px-6 bg-slate-50 border-y border-slate-100">
      <div className="max-w-6xl mx-auto space-y-24 lg:space-y-32">
        {sections.map((sec, si) => (
          <motion.div
            key={sec.heading}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: si * 0.05 }}
            className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-12 lg:gap-20 items-start"
          >
            <div className="lg:sticky lg:top-28">
              <p className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-400 mb-4">{sec.eyebrow}</p>
              <h2
                className="font-black text-slate-900 mb-5"
                style={{ fontSize: "clamp(1.75rem, 4.5vw, 3rem)", lineHeight: 1.05, letterSpacing: '-0.03em' }}
              >
                {sec.heading}
              </h2>
              <p className="text-[15px] text-slate-500 leading-[1.65] mb-8 max-w-[38ch]">
                {sec.desc}
              </p>
              <button
                onClick={() => onNavigate(sec.cta.page)}
                className="inline-flex items-center gap-2 bg-slate-900 text-white text-[11px] font-black uppercase tracking-widest px-6 py-3.5 rounded-xl hover:bg-slate-800 transition-colors"
              >
                {sec.cta.label} <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-200">
              {sec.tools.map((tool, i) => (
                <motion.button
                  key={tool.title}
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: i * 0.05 }}
                  onClick={() => onNavigate(tool.page)}
                  className="group w-full flex items-center gap-4 py-4 text-left hover:pl-2 transition-all duration-300"
                >
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 text-slate-400 group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900 transition-all duration-300">
                    {tool.icon}
                  </div>
                  <span className="font-bold text-slate-700 text-[15px] group-hover:text-slate-900 transition-colors duration-200" style={{ letterSpacing: '-0.01em' }}>
                    {tool.title}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-900 ml-auto shrink-0 transition-colors duration-200" />
                </motion.button>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

// ── How It Works ──────────────────────────────────────────────────────────────

const HowItWorks = () => {
  const steps = [
    {
      number: 1,
      title: 'Find your direction',
      desc: 'Take the free RIASEC quiz. In 10 minutes you get a list of careers matched to your personality and interests — no account needed.',
    },
    {
      number: 2,
      title: 'Understand your options',
      desc: 'Dig into any career: what it pays, which provinces are hiring, what APS score you need, which university or TVET college to target, and how to fund it.',
    },
    {
      number: 3,
      title: 'Build toward it',
      desc: 'Use the study library and AI tutor to strengthen your subjects, and browse bursaries to fund your future — all free, no sign-in required.',
    },
  ];

  return (
    <section className="py-24 lg:py-36 px-4 sm:px-6 bg-white border-b border-slate-100">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 lg:mb-20"
        >
          <p className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-400 mb-4">How it works</p>
          <h2
            className="font-black text-slate-900"
            style={{ fontSize: "clamp(1.75rem, 5vw, 3rem)", lineHeight: 1.05, letterSpacing: '-0.03em' }}
          >
            Three steps, one free app.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 lg:gap-16">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-start"
            >
              <span
                className="font-black text-slate-100 mb-6 select-none"
                style={{ fontSize: "clamp(3rem, 7vw, 5rem)", lineHeight: 1, letterSpacing: "-0.04em" }}
              >
                {String(step.number).padStart(2, "0")}
              </span>
              <h3 className="font-black text-slate-900 mb-3 text-[1.0625rem]" style={{ letterSpacing: '-0.01em' }}>
                {step.title}
              </h3>
              <p className="text-[15px] text-slate-500 leading-[1.65]">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ── Discovery Grid ────────────────────────────────────────────────────────────

const DiscoveryGrid = () => {
  const items = [
    { webp: '/images/engineer.webp', jpg: '/images/engineer.jpg', title: 'Engineering', description: 'Build the future of SA infrastructure' },
    { webp: '/images/nurse.webp', jpg: '/images/nurse.jpg', title: 'Healthcare', description: 'Care for communities across the country' },
    { webp: '/images/teacher.webp', jpg: '/images/teacher.jpg', title: 'Education', description: 'Shape the next generation of leaders' },
    { webp: '/images/electrician.webp', jpg: '/images/electrician.jpg', title: 'Trades & Technical', description: 'High-demand skills SA needs now' },
    { webp: '/images/students.webp', jpg: '/images/students.jpg', title: 'Keep Learning', description: 'Your journey starts with the right knowledge' },
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-28 px-4 sm:px-6 bg-slate-50 border-b border-slate-100">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 sm:mb-12"
        >
          <p className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-400 mb-4">Career paths</p>
          <h2
            className="font-black text-slate-900"
            style={{ fontSize: "clamp(1.75rem, 5vw, 3rem)", lineHeight: 1.05, letterSpacing: '-0.03em' }}
          >
            Every path has a place to start.
          </h2>
          <p className="text-[15px] text-slate-500 mt-4 leading-[1.65]" style={{ maxWidth: "42ch" }}>
            Engineering, healthcare, education, trades — explore the careers South Africa needs, with real salary and demand data.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          {items.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: index * 0.07 }}
              whileHover={{ y: -5 }}
              className="relative rounded-xl overflow-hidden cursor-pointer group aspect-4/3 sm:aspect-3/4 will-change-transform"
            >
              <picture>
                <source srcSet={item.webp} type="image/webp" />
                <img
                  src={item.jpg} alt={item.title}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  fetchPriority={index === 0 ? 'high' : 'low'}
                  decoding="async" width={400} height={533}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 will-change-transform"
                />
              </picture>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="font-black text-[14px] leading-tight" style={{ letterSpacing: '-0.01em' }}>{item.title}</h3>
                <p className="text-white/60 text-[12px] mt-1 leading-snug hidden sm:block">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ── Footer ────────────────────────────────────────────────────────────────────

const Footer = ({ onNavigate }: { onNavigate: (page: Page) => void }) => {
  const sections = [
    {
      title: 'Career Guide',
      links: [
        { label: 'Career Quiz', page: 'quiz' },
        { label: 'Explore Careers', page: 'careers' },
        { label: 'Bursary Finder', page: 'bursaries' },
        { label: 'Job Demand Map', page: 'map' },
        { label: 'TVET Pathways', page: 'tvet' },
      ],
    },
    {
      title: 'School Assist',
      links: [
        { label: 'Study Library', page: 'library' },
        { label: 'School Assist AI', page: 'school-assist-chat' },
      ],
    },
  ];

  return (
    <footer className="bg-white text-slate-500 py-20 lg:py-24 px-4 sm:px-6 border-t border-slate-100">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          <div className="sm:col-span-2 lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center text-white font-black text-lg">P</div>
              <span className="text-xl font-black text-slate-900" style={{ letterSpacing: '-0.02em' }}>Prospect SA</span>
            </div>
            <p className="text-[15px] text-slate-500 leading-[1.65] max-w-[30ch] mb-8">
              Free career discovery and matric study support — built for South African students.
            </p>
            <div className="flex gap-3">
              {[{ icon: <Facebook size={16} />, label: 'Facebook' }, { icon: <Instagram size={16} />, label: 'Instagram' }, { icon: <Twitter size={16} />, label: 'Twitter' }].map((social, i) => (
                <button key={i} className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all" aria-label={social.label}>
                  {social.icon}
                </button>
              ))}
            </div>
          </div>
          {sections.map((section) => (
            <div key={section.title}>
              <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-5">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <button onClick={() => onNavigate(link.page as Page)} className="text-[14px] text-slate-500 hover:text-slate-900 transition-colors text-left">
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[13px] text-slate-400">© 2026 Prospect South Africa. Free, always.</p>
          <p className="text-[13px] text-slate-400">Built for Grade 10–12 students across all 9 provinces.</p>
        </div>
      </div>
    </footer>
  );
};

// ── Main App ──────────────────────────────────────────────────────────────────

const PageTransition = ({ children, pageKey }: { children: ReactNode; pageKey: string }) => (
  <motion.div
    key={pageKey}
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.25, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
);

const pageProps = (navigate: (p: Page) => void) => ({
  onNavigate: navigate,
  onNavigateHome: () => navigate('home'),
  onSignOut: () => {},
  onNavigateAuth: () => navigate('school-assist'),
  guestMode: true,
  user: null,
});

export default function App() {
  const [page, setPage] = useState<Page>(() => {
    try {
      if (localStorage.getItem('prospect_teacher_session')) return 'teacher-dashboard';
      if (localStorage.getItem('prospect_student_session')) return 'student-dashboard';
      if (localStorage.getItem('prospect_admin_session')) return 'admin-dashboard';
    } catch {}
    return 'home';
  });
  // TEMP: Skip loading screen for development
  const [isAssetsLoaded, setIsAssetsLoaded] = useState(true);

  useEffect(() => {
    const images = ['/images/engineer.webp', '/images/nurse.webp', '/images/teacher.webp', '/images/electrician.webp', '/images/students.webp'];
    images.forEach(src => { const img = new Image(); img.src = src; });
  }, []);

  const navigate = (p: Page) => setPage(p);
  const pp = pageProps(navigate);

  return (
    <>
      {/* TEMP: Loading screen disabled for development */}
      {/* <AnimatePresence>
        {!isAssetsLoaded && <LoadingScreen onComplete={() => setIsAssetsLoaded(true)} />}
      </AnimatePresence> */}

      {isAssetsLoaded && (
        <div className="relative min-h-screen bg-white">
          <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center"><div className="w-6 h-6 border-2 border-slate-200 border-t-slate-700 rounded-full animate-spin" /></div>}>
            <AnimatePresence mode="wait">

              {page === 'careers' && <PageTransition pageKey="careers"><CareersPageNew {...pp} /></PageTransition>}
              {page === 'quiz' && <PageTransition pageKey="quiz"><QuizPage {...pp} /></PageTransition>}
              {page === 'bursaries' && <PageTransition pageKey="bursaries"><BursariesPage {...pp} /></PageTransition>}
              {page === 'bursary' && <PageTransition pageKey="bursary"><BursaryDetailPage {...pp} /></PageTransition>}
              {page === 'map' && <PageTransition pageKey="map"><MapPage {...pp} /></PageTransition>}
              {page === 'tvet' && <PageTransition pageKey="tvet"><TVETPage {...pp} /></PageTransition>}
              {page === 'tvet-careers' && <PageTransition pageKey="tvet-careers"><TVETCareersPage {...pp} /></PageTransition>}
              {page === 'tvet-colleges' && <PageTransition pageKey="tvet-colleges"><TVETCollegesPage {...pp} /></PageTransition>}
              {page === 'tvet-funding' && <PageTransition pageKey="tvet-funding"><TVETFundingPage {...pp} /></PageTransition>}
              {page === 'tvet-requirements' && <PageTransition pageKey="tvet-requirements"><TVETRequirementsPage {...pp} /></PageTransition>}
              {page === 'library' && <PageTransition pageKey="library"><StudyLibraryPage {...pp} /></PageTransition>}
              {page === 'school-assist' && <PageTransition pageKey="school-assist"><SchoolAssistPage onNavigate={navigate} onNavigateHome={() => navigate('home')} /></PageTransition>}

              {/* Portal Pages */}
              {page === 'portal' && <PageTransition pageKey="portal"><PortalEntry onNavigate={navigate} /></PageTransition>}
              {page === 'teacher-login' && <PageTransition pageKey="teacher-login"><TeacherLogin onNavigate={navigate} /></PageTransition>}
              {page === 'student-login' && <PageTransition pageKey="student-login"><StudentLogin onNavigate={navigate} /></PageTransition>}
              {page === 'admin-login' && <PageTransition pageKey="admin-login"><AdminLogin onNavigate={navigate} /></PageTransition>}
              {page === 'teacher-dashboard' && <PageTransition pageKey="teacher-dashboard"><TeacherDashboard onNavigate={navigate} /></PageTransition>}
              {page === 'student-dashboard' && <PageTransition pageKey="student-dashboard"><StudentDashboard onNavigate={navigate} /></PageTransition>}
              {page === 'admin-dashboard' && <PageTransition pageKey="admin-dashboard"><AdminDashboard onNavigate={navigate} /></PageTransition>}

              {page === 'learning-algebra-g10-t1-linear-equations' && <PageTransition pageKey="learning-algebra-g10-t1-linear-equations"><LinearEquationsPage {...pp} /></PageTransition>}
              {page === 'learning-algebra-g10-t1-simultaneous' && <PageTransition pageKey="learning-algebra-g10-t1-simultaneous"><SimultaneousEquationsPage {...pp} /></PageTransition>}
              {page === 'learning-physci-g10-t1-waves' && <PageTransition pageKey="learning-physci-g10-t1-waves"><WavesSoundLightPage {...pp} /></PageTransition>}
              {page === 'learning-physci-g10-t1-atoms' && <PageTransition pageKey="learning-physci-g10-t1-atoms"><AtomsSubatomicParticlesPage {...pp} /></PageTransition>}
              {page === 'learning-physci-g10-t1-classification' && <PageTransition pageKey="learning-physci-g10-t1-classification"><ClassificationOfMatterPage {...pp} /></PageTransition>}
              {page === 'learning-physci-g10-t1-periodic-table' && <PageTransition pageKey="learning-physci-g10-t1-periodic-table"><PeriodicTableTrendsPage {...pp} /></PageTransition>}
              {page === 'learning-physci-g10-t1-bonding' && <PageTransition pageKey="learning-physci-g10-t1-bonding"><ChemicalBondingPage {...pp} /></PageTransition>}
              {page === 'learning-lifesci-g10-t1-biodiversity' && <PageTransition pageKey="learning-lifesci-g10-t1-biodiversity"><BiodiversityAndClassificationPage {...pp} /></PageTransition>}
              {page === 'learning-lifesci-g10-t1-five-kingdoms' && <PageTransition pageKey="learning-lifesci-g10-t1-five-kingdoms"><FiveKingdomsPage {...pp} /></PageTransition>}
              {page === 'learning-lifesci-g10-t1-taxonomy' && <PageTransition pageKey="learning-lifesci-g10-t1-taxonomy"><TaxonomyAndBinomialNomenclaturePage {...pp} /></PageTransition>}
              {page === 'learning-lifesci-g10-t1-species' && <PageTransition pageKey="learning-lifesci-g10-t1-species"><SpeciesConceptPage {...pp} /></PageTransition>}
              {page === 'learning-accounting-g10-t1-intro' && <PageTransition pageKey="learning-accounting-g10-t1-intro"><IntroductionToAccountingPage {...pp} /></PageTransition>}
              {page === 'learning-accounting-g10-t1-equation' && <PageTransition pageKey="learning-accounting-g10-t1-equation"><AccountingEquationPage {...pp} /></PageTransition>}
              {page === 'learning-accounting-g10-t1-double-entry' && <PageTransition pageKey="learning-accounting-g10-t1-double-entry"><DoubleEntrySystemPage {...pp} /></PageTransition>}
              {page === 'learning-accounting-g10-t1-source-documents' && <PageTransition pageKey="learning-accounting-g10-t1-source-documents"><SourceDocumentsPage {...pp} /></PageTransition>}
              {page === 'learning-accounting-g10-t1-journals' && <PageTransition pageKey="learning-accounting-g10-t1-journals"><JournalsInAccountingPage {...pp} /></PageTransition>}
              {page === 'learning-accounting-g10-t1-ledger' && <PageTransition pageKey="learning-accounting-g10-t1-ledger"><GeneralLedgerPage {...pp} /></PageTransition>}
              {page === 'learning-bizstudies-g10-t1-environment' && <PageTransition pageKey="learning-bizstudies-g10-t1-environment"><BusinessEnvironmentPage {...pp} /></PageTransition>}
              {page === 'learning-bizstudies-g10-t1-sectors' && <PageTransition pageKey="learning-bizstudies-g10-t1-sectors"><BusinessSectorsPage {...pp} /></PageTransition>}
              {page === 'learning-bizstudies-g10-t1-stakeholders' && <PageTransition pageKey="learning-bizstudies-g10-t1-stakeholders"><BusinessStakeholdersPage {...pp} /></PageTransition>}
              {page === 'learning-bizstudies-g10-t1-operations' && <PageTransition pageKey="learning-bizstudies-g10-t1-operations"><BusinessOperationsPage {...pp} /></PageTransition>}
              {page === 'learning-economics-g10-t1-problem' && <PageTransition pageKey="learning-economics-g10-t1-problem"><EconomicProblemPage {...pp} /></PageTransition>}
              {page === 'learning-economics-g10-t1-ppc' && <PageTransition pageKey="learning-economics-g10-t1-ppc"><ProductionPossibilityCurvePage {...pp} /></PageTransition>}
              {page === 'learning-economics-g10-t1-systems' && <PageTransition pageKey="learning-economics-g10-t1-systems"><EconomicSystemsPage {...pp} /></PageTransition>}
              {page === 'learning-economics-g10-t1-circular-flow' && <PageTransition pageKey="learning-economics-g10-t1-circular-flow"><CircularFlowModelPage {...pp} /></PageTransition>}
              {page === 'learning-economics-g10-t1-factors' && <PageTransition pageKey="learning-economics-g10-t1-factors"><FactorsOfProductionPage {...pp} /></PageTransition>}
              {page === 'learning-cat-g10-t1-computer-systems' && <PageTransition pageKey="learning-cat-g10-t1-computer-systems"><ComputerSystemsPage {...pp} /></PageTransition>}
              {page === 'learning-cat-g10-t1-file-management' && <PageTransition pageKey="learning-cat-g10-t1-file-management"><FileManagementPage {...pp} /></PageTransition>}
              {page === 'learning-cat-g10-t1-word-processing' && <PageTransition pageKey="learning-cat-g10-t1-word-processing"><WordProcessingPage {...pp} /></PageTransition>}
              {page === 'learning-cat-g10-t1-spreadsheets' && <PageTransition pageKey="learning-cat-g10-t1-spreadsheets"><SpreadsheetsPage {...pp} /></PageTransition>}
              {page === 'learning-egd-g10-t1-drawing-instruments' && <PageTransition pageKey="learning-egd-g10-t1-drawing-instruments"><DrawingInstrumentsPage {...pp} /></PageTransition>}


              {page === 'home' && (
                <PageTransition pageKey="home">
                  <div className="relative bg-[#FAF9F6]">
                    <TutorialDialog />
                    <HeroNav onNavigate={setPage} />
                    <main id="main-content">
                      <HeroSection onNavigate={setPage} />
                      <ProblemSection />
                      <Perspectives onNavigate={setPage} />
                      <CareerSection onNavigate={setPage} />
                      <CTASection onNavigate={setPage} />
                    </main>
                    <LandingFooter onNavigate={setPage} />
                  </div>
                </PageTransition>
              )}

            </AnimatePresence>
          </Suspense>
        </div>
      )}
    </>
  );
}
