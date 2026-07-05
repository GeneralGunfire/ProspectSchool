import { useState, useEffect, type ReactNode, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';

// ── New landing page (from Stitch/AI Studio export) ──────────────────────────
const NewLandingPage = lazy(() => import('./features/landing/new/LandingPage'));

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
const StudyLibraryPage = lazy(() => import('./features/study/pages/StudyLibraryPage'));

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
  // Study
  | 'library'
  // Portal pages
  | 'portal' | 'teacher-login' | 'student-login' | 'admin-login'
  | 'teacher-dashboard' | 'student-dashboard' | 'admin-dashboard';

// ── Free Tools Nav — shown on career/tvet pages ───────────────────────────────

const FREE_TOOLS = [
  { label: 'Career Quiz',    page: 'quiz'      as Page },
  { label: 'Career Browser', page: 'careers'   as Page },
  { label: 'Bursaries',      page: 'bursaries' as Page },
  { label: 'TVET',           page: 'tvet'      as Page },
  { label: 'Job Map',        page: 'map'       as Page },
];

const FreeToolsNav = ({ onNavigate, activePage }: { onNavigate: (page: Page) => void; activePage: Page }) => (
  <div className="fixed top-0 left-0 right-0 z-120 bg-white/90 backdrop-blur-sm border-b border-stone-200">
    <div className="max-w-6xl mx-auto px-4 h-12 flex items-center justify-between gap-4">
      <button onClick={() => onNavigate('home')} className="flex items-center gap-2 shrink-0">
        <div className="w-6 h-6 rounded-md bg-stone-900 flex items-center justify-center">
          <span className="text-white font-black text-[10px]">P</span>
        </div>
        <span className="text-sm font-black text-stone-900 tracking-tight hidden sm:block">Prospect</span>
      </button>
      <div className="flex items-center gap-0.5 overflow-x-auto">
        {FREE_TOOLS.map(tool => (
          <button
            key={tool.page}
            onClick={() => onNavigate(tool.page)}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-bold whitespace-nowrap transition-colors ${
              activePage === tool.page ? 'bg-stone-900 text-white' : 'text-stone-500 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            {tool.label}
          </button>
        ))}
      </div>
      <button onClick={() => onNavigate('portal')} className="shrink-0 text-[12px] font-black text-stone-500 hover:text-stone-900 transition-colors whitespace-nowrap">
        Sign In →
      </button>
    </div>
  </div>
);

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
  onNavigateAuth: () => navigate('library'),
  guestMode: true,
  user: null,
});

// Pages that should NOT be pushed to browser history (auth/session transitions).
// Going "back" into a login screen after you're already logged in is confusing.
const NO_HISTORY_PAGES = new Set<Page>([
  'teacher-dashboard', 'student-dashboard', 'admin-dashboard',
  'teacher-login', 'student-login', 'admin-login',
]);

/** Read the hash fragment and return a valid Page, or null. */
function pageFromHash(hash: string): Page | null {
  const key = hash.replace(/^#/, '') as Page;
  // Validate: only accept known page keys (avoids injecting garbage into state)
  const knownPages: Page[] = [
    'home', 'careers', 'quiz', 'bursaries', 'bursary', 'map',
    'tvet', 'tvet-careers', 'tvet-colleges', 'tvet-funding', 'tvet-requirements',
    'library',
    'portal',
    'learning-algebra-g10-t1-linear-equations', 'learning-algebra-g10-t1-simultaneous',
    'learning-physci-g10-t1-waves', 'learning-physci-g10-t1-atoms',
    'learning-physci-g10-t1-classification', 'learning-physci-g10-t1-periodic-table',
    'learning-physci-g10-t1-bonding',
    'learning-lifesci-g10-t1-biodiversity', 'learning-lifesci-g10-t1-five-kingdoms',
    'learning-lifesci-g10-t1-taxonomy', 'learning-lifesci-g10-t1-species',
    'learning-accounting-g10-t1-intro', 'learning-accounting-g10-t1-equation',
    'learning-accounting-g10-t1-double-entry', 'learning-accounting-g10-t1-source-documents',
    'learning-accounting-g10-t1-journals', 'learning-accounting-g10-t1-ledger',
    'learning-bizstudies-g10-t1-environment', 'learning-bizstudies-g10-t1-sectors',
    'learning-bizstudies-g10-t1-stakeholders', 'learning-bizstudies-g10-t1-operations',
    'learning-economics-g10-t1-problem', 'learning-economics-g10-t1-ppc',
    'learning-economics-g10-t1-systems', 'learning-economics-g10-t1-circular-flow',
    'learning-economics-g10-t1-factors',
    'learning-cat-g10-t1-computer-systems', 'learning-cat-g10-t1-file-management',
    'learning-cat-g10-t1-word-processing', 'learning-cat-g10-t1-spreadsheets',
    'learning-egd-g10-t1-drawing-instruments',
  ];
  return knownPages.includes(key) ? key : null;
}

export default function App() {
  const [page, setPage] = useState<Page>(() => {
    // 1. Active session → go straight to dashboard (hash ignored)
    try {
      if (localStorage.getItem('prospect_teacher_session')) return 'teacher-dashboard';
      if (localStorage.getItem('prospect_student_session')) return 'student-dashboard';
      if (localStorage.getItem('prospect_admin_session')) return 'admin-dashboard';
    } catch {}
    // 2. Hash in URL (e.g. user refreshed or followed a shared link)
    const fromHash = pageFromHash(window.location.hash);
    if (fromHash) return fromHash;
    // 3. Default
    return 'home';
  });
  // TEMP: Skip loading screen for development
  const [isAssetsLoaded, setIsAssetsLoaded] = useState(true);

  useEffect(() => {
    const images = ['/images/engineer.webp', '/images/nurse.webp', '/images/teacher.webp', '/images/electrician.webp', '/images/students.webp'];
    images.forEach(src => { const img = new Image(); img.src = src; });
  }, []);

  // ── Browser back/forward support ──────────────────────────────────────────
  useEffect(() => {
    const onPopState = (e: PopStateEvent) => {
      const target: Page = (e.state as { page?: Page })?.page ?? pageFromHash(window.location.hash) ?? 'home';
      setPage(target);
      window.scrollTo(0, 0);
    };
    window.addEventListener('popstate', onPopState);
    // Stamp the initial entry so going "back" to it works correctly
    if (!window.history.state?.page) {
      window.history.replaceState({ page }, '', page === 'home' ? '/' : '#' + page);
    }
    return () => window.removeEventListener('popstate', onPopState);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const navigate = (p: Page) => {
    if (NO_HISTORY_PAGES.has(p)) {
      // Auth/session transitions: replace so back doesn't re-show login
      window.history.replaceState({ page: p }, '', p === 'home' ? '/' : '#' + p);
    } else {
      window.history.pushState({ page: p }, '', p === 'home' ? '/' : '#' + p);
    }
    setPage(p);
    window.scrollTo(0, 0);
  };
  const pp = pageProps(navigate);

  // Single render function so AnimatePresence always receives exactly one child
  const renderPage = () => {
    switch (page) {
      case 'careers':    return <PageTransition pageKey="careers"><FreeToolsNav onNavigate={navigate} activePage={page} /><CareersPageNew {...pp} /></PageTransition>;
      case 'quiz':       return <PageTransition pageKey="quiz"><FreeToolsNav onNavigate={navigate} activePage={page} /><QuizPage {...pp} /></PageTransition>;
      case 'bursaries':  return <PageTransition pageKey="bursaries"><FreeToolsNav onNavigate={navigate} activePage={page} /><BursariesPage {...pp} /></PageTransition>;
      case 'bursary':    return <PageTransition pageKey="bursary"><FreeToolsNav onNavigate={navigate} activePage={page} /><BursaryDetailPage {...pp} /></PageTransition>;
      case 'map':        return <PageTransition pageKey="map"><FreeToolsNav onNavigate={navigate} activePage={page} /><MapPage {...pp} /></PageTransition>;
      case 'tvet':       return <PageTransition pageKey="tvet"><FreeToolsNav onNavigate={navigate} activePage={page} /><TVETPage {...pp} /></PageTransition>;
      case 'tvet-careers':      return <PageTransition pageKey="tvet-careers"><FreeToolsNav onNavigate={navigate} activePage={page} /><TVETCareersPage {...pp} /></PageTransition>;
      case 'tvet-colleges':     return <PageTransition pageKey="tvet-colleges"><FreeToolsNav onNavigate={navigate} activePage={page} /><TVETCollegesPage {...pp} /></PageTransition>;
      case 'tvet-funding':      return <PageTransition pageKey="tvet-funding"><FreeToolsNav onNavigate={navigate} activePage={page} /><TVETFundingPage {...pp} /></PageTransition>;
      case 'tvet-requirements': return <PageTransition pageKey="tvet-requirements"><FreeToolsNav onNavigate={navigate} activePage={page} /><TVETRequirementsPage {...pp} /></PageTransition>;
      case 'library':           return <PageTransition pageKey="library"><StudyLibraryPage {...pp} /></PageTransition>;

      // Portal
      case 'portal':            return <PageTransition pageKey="portal"><PortalEntry onNavigate={navigate} /></PageTransition>;
      case 'teacher-login':     return <PageTransition pageKey="teacher-login"><TeacherLogin onNavigate={navigate} /></PageTransition>;
      case 'student-login':     return <PageTransition pageKey="student-login"><StudentLogin onNavigate={navigate} /></PageTransition>;
      case 'admin-login':       return <PageTransition pageKey="admin-login"><AdminLogin onNavigate={navigate} /></PageTransition>;
      case 'teacher-dashboard': return <PageTransition pageKey="teacher-dashboard"><TeacherDashboard onNavigate={navigate} /></PageTransition>;
      case 'student-dashboard': return <PageTransition pageKey="student-dashboard"><StudentDashboard onNavigate={navigate} /></PageTransition>;
      case 'admin-dashboard':   return <PageTransition pageKey="admin-dashboard"><AdminDashboard onNavigate={navigate} /></PageTransition>;

      // Learning pages
      case 'learning-algebra-g10-t1-linear-equations':    return <PageTransition pageKey={page}><LinearEquationsPage {...pp} /></PageTransition>;
      case 'learning-algebra-g10-t1-simultaneous':        return <PageTransition pageKey={page}><SimultaneousEquationsPage {...pp} /></PageTransition>;
      case 'learning-physci-g10-t1-waves':                return <PageTransition pageKey={page}><WavesSoundLightPage {...pp} /></PageTransition>;
      case 'learning-physci-g10-t1-atoms':                return <PageTransition pageKey={page}><AtomsSubatomicParticlesPage {...pp} /></PageTransition>;
      case 'learning-physci-g10-t1-classification':       return <PageTransition pageKey={page}><ClassificationOfMatterPage {...pp} /></PageTransition>;
      case 'learning-physci-g10-t1-periodic-table':       return <PageTransition pageKey={page}><PeriodicTableTrendsPage {...pp} /></PageTransition>;
      case 'learning-physci-g10-t1-bonding':              return <PageTransition pageKey={page}><ChemicalBondingPage {...pp} /></PageTransition>;
      case 'learning-lifesci-g10-t1-biodiversity':        return <PageTransition pageKey={page}><BiodiversityAndClassificationPage {...pp} /></PageTransition>;
      case 'learning-lifesci-g10-t1-five-kingdoms':       return <PageTransition pageKey={page}><FiveKingdomsPage {...pp} /></PageTransition>;
      case 'learning-lifesci-g10-t1-taxonomy':            return <PageTransition pageKey={page}><TaxonomyAndBinomialNomenclaturePage {...pp} /></PageTransition>;
      case 'learning-lifesci-g10-t1-species':             return <PageTransition pageKey={page}><SpeciesConceptPage {...pp} /></PageTransition>;
      case 'learning-accounting-g10-t1-intro':            return <PageTransition pageKey={page}><IntroductionToAccountingPage {...pp} /></PageTransition>;
      case 'learning-accounting-g10-t1-equation':         return <PageTransition pageKey={page}><AccountingEquationPage {...pp} /></PageTransition>;
      case 'learning-accounting-g10-t1-double-entry':     return <PageTransition pageKey={page}><DoubleEntrySystemPage {...pp} /></PageTransition>;
      case 'learning-accounting-g10-t1-source-documents': return <PageTransition pageKey={page}><SourceDocumentsPage {...pp} /></PageTransition>;
      case 'learning-accounting-g10-t1-journals':         return <PageTransition pageKey={page}><JournalsInAccountingPage {...pp} /></PageTransition>;
      case 'learning-accounting-g10-t1-ledger':           return <PageTransition pageKey={page}><GeneralLedgerPage {...pp} /></PageTransition>;
      case 'learning-bizstudies-g10-t1-environment':      return <PageTransition pageKey={page}><BusinessEnvironmentPage {...pp} /></PageTransition>;
      case 'learning-bizstudies-g10-t1-sectors':          return <PageTransition pageKey={page}><BusinessSectorsPage {...pp} /></PageTransition>;
      case 'learning-bizstudies-g10-t1-stakeholders':     return <PageTransition pageKey={page}><BusinessStakeholdersPage {...pp} /></PageTransition>;
      case 'learning-bizstudies-g10-t1-operations':       return <PageTransition pageKey={page}><BusinessOperationsPage {...pp} /></PageTransition>;
      case 'learning-economics-g10-t1-problem':           return <PageTransition pageKey={page}><EconomicProblemPage {...pp} /></PageTransition>;
      case 'learning-economics-g10-t1-ppc':               return <PageTransition pageKey={page}><ProductionPossibilityCurvePage {...pp} /></PageTransition>;
      case 'learning-economics-g10-t1-systems':           return <PageTransition pageKey={page}><EconomicSystemsPage {...pp} /></PageTransition>;
      case 'learning-economics-g10-t1-circular-flow':     return <PageTransition pageKey={page}><CircularFlowModelPage {...pp} /></PageTransition>;
      case 'learning-economics-g10-t1-factors':           return <PageTransition pageKey={page}><FactorsOfProductionPage {...pp} /></PageTransition>;
      case 'learning-cat-g10-t1-computer-systems':        return <PageTransition pageKey={page}><ComputerSystemsPage {...pp} /></PageTransition>;
      case 'learning-cat-g10-t1-file-management':         return <PageTransition pageKey={page}><FileManagementPage {...pp} /></PageTransition>;
      case 'learning-cat-g10-t1-word-processing':         return <PageTransition pageKey={page}><WordProcessingPage {...pp} /></PageTransition>;
      case 'learning-cat-g10-t1-spreadsheets':            return <PageTransition pageKey={page}><SpreadsheetsPage {...pp} /></PageTransition>;
      case 'learning-egd-g10-t1-drawing-instruments':     return <PageTransition pageKey={page}><DrawingInstrumentsPage {...pp} /></PageTransition>;

      default:
      case 'home':
        return (
          <PageTransition pageKey="home">
            <NewLandingPage onNavigate={setPage} />
          </PageTransition>
        );
    }
  };

  return (
    <>
      {isAssetsLoaded && (
        <div className="relative min-h-screen bg-white">
          <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center"><div className="w-6 h-6 border-2 border-slate-200 border-t-slate-700 rounded-full animate-spin" /></div>}>
            <AnimatePresence mode="wait">
              {renderPage()}
            </AnimatePresence>
          </Suspense>
        </div>
      )}
    </>
  );
}
