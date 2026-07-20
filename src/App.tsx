import { useState, useEffect, type ReactNode, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ErrorBoundary } from './shared/components/ErrorBoundary';
import { Spinner } from './shared/components/Spinner';

// ── New landing page (from Stitch/AI Studio export) ──────────────────────────
const NewLandingPage = lazy(() => import('./features/landing/new/LandingPage'));

// Lazy-load all page-level components
const CareersPageNew     = lazy(() => import('./features/careers/pages/CareersPageNew'));
const BursariesPage      = lazy(() => import('./features/careers/pages/BursariesPage'));
const BursaryDetailPage  = lazy(() => import('./features/careers/pages/BursaryDetailPage'));
const QuizPage           = lazy(() => import('./features/careers/pages/QuizPage'));
// Study Library is being rebuilt from scratch — all previous learning-page
// routes were removed along with the deleted content/pages they pointed to.

// Auth & Portal pages
const TeacherLogin = lazy(() => import('./pages/auth/TeacherLogin'));
const StudentLogin = lazy(() => import('./pages/auth/StudentLogin'));
const AdminLogin = lazy(() => import('./pages/auth/AdminLogin'));
const ParentLogin = lazy(() => import('./pages/auth/ParentLogin'));
const TeacherDashboard = lazy(() => import('./pages/portal/TeacherDashboard'));
const StudentDashboard = lazy(() => import('./pages/portal/StudentDashboard'));
const AdminDashboard = lazy(() => import('./pages/portal/AdminDashboard'));
const ParentDashboard = lazy(() => import('./pages/portal/ParentDashboard'));
const PortalEntry = lazy(() => import('./pages/portal/PortalEntry'));
const PlatformLogin = lazy(() => import('./pages/auth/PlatformLogin'));
const PlatformAdminDashboard = lazy(() => import('./pages/portal/PlatformAdminDashboard'));


type Page =
  | 'home' | 'careers' | 'quiz' | 'bursaries' | 'bursary'
  // Study Library topic pages are routed internally by StudentDashboard's
  // innerPage state (a plain string), not through this top-level Page union —
  // see src/pages/portal/student/LibraryPage.tsx.
  | 'library'
  // Portal pages
  | 'portal' | 'teacher-login' | 'student-login' | 'admin-login' | 'parent-login'
  | 'teacher-dashboard' | 'student-dashboard' | 'admin-dashboard' | 'parent-dashboard'
  | 'platform-login' | 'platform-dashboard';

// ── Free Tools Nav — shown on career/tvet pages ───────────────────────────────

const FREE_TOOLS = [
  { label: 'Career Quiz',    page: 'quiz'      as Page },
  { label: 'Career Browser', page: 'careers'   as Page },
  { label: 'Bursaries',      page: 'bursaries' as Page },
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
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.15, ease: 'easeOut' }}
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
  'teacher-dashboard', 'student-dashboard', 'admin-dashboard', 'parent-dashboard',
  'teacher-login', 'student-login', 'admin-login', 'parent-login',
  'platform-login', 'platform-dashboard',
]);

/** Read the hash fragment and return a valid Page, or null. */
function pageFromHash(hash: string): Page | null {
  const key = hash.replace(/^#/, '') as Page;
  // Validate: only accept known page keys (avoids injecting garbage into state)
  const knownPages: Page[] = [
    'home', 'careers', 'quiz', 'bursaries', 'bursary',
    'library',
    'portal',
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
      if (localStorage.getItem('prospect_parent_session')) return 'parent-dashboard';
      if (sessionStorage.getItem('prospect_platform_session')) return 'platform-dashboard';
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

      // Portal
      case 'portal':            return <PageTransition pageKey="portal"><PortalEntry onNavigate={navigate} /></PageTransition>;
      case 'teacher-login':     return <PageTransition pageKey="teacher-login"><TeacherLogin onNavigate={navigate} /></PageTransition>;
      case 'student-login':     return <PageTransition pageKey="student-login"><StudentLogin onNavigate={navigate} /></PageTransition>;
      case 'admin-login':       return <PageTransition pageKey="admin-login"><AdminLogin onNavigate={navigate} /></PageTransition>;
      case 'parent-login':      return <PageTransition pageKey="parent-login"><ParentLogin onNavigate={navigate} /></PageTransition>;
      case 'teacher-dashboard': return <PageTransition pageKey="teacher-dashboard"><TeacherDashboard onNavigate={navigate} /></PageTransition>;
      case 'student-dashboard': return <PageTransition pageKey="student-dashboard"><StudentDashboard onNavigate={navigate} /></PageTransition>;
      case 'admin-dashboard':   return <PageTransition pageKey="admin-dashboard"><AdminDashboard onNavigate={navigate} /></PageTransition>;
      case 'parent-dashboard':  return <PageTransition pageKey="parent-dashboard"><ParentDashboard onNavigate={navigate} /></PageTransition>;
      case 'platform-login':    return <PageTransition pageKey="platform-login"><PlatformLogin onNavigate={navigate} /></PageTransition>;
      case 'platform-dashboard': return <PageTransition pageKey="platform-dashboard"><PlatformAdminDashboard onNavigate={navigate} /></PageTransition>;

      default:
      case 'home':
        return (
          <PageTransition pageKey="home">
            <ErrorBoundary>
              <NewLandingPage onNavigate={navigate} />
            </ErrorBoundary>
          </PageTransition>
        );
    }
  };

  return (
    <>
      {isAssetsLoaded && (
        <div className="relative min-h-screen bg-white">
          {/* mode="wait" was forcing the outgoing page to fully exit-animate
              before the incoming page's lazy chunk even started fetching —
              on portal→login (a fresh lazy import each time) that serial
              wait was the real cause of the sluggish page-switch feel, not
              just the animation itself. Default (overlapping) mode lets the
              new chunk start loading and mounting immediately while the old
              page fades out, so the switch feels roughly 2x as fast. */}
          <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center"><Spinner /></div>}>
            <AnimatePresence initial={false}>
              {renderPage()}
            </AnimatePresence>
          </Suspense>
        </div>
      )}
    </>
  );
}
