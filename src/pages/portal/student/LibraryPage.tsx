import { Suspense, lazy } from 'react';
import { ChevronLeft, BookOpen } from 'lucide-react';
import { StudySessionProvider } from '../../../providers/StudySessionContext';
import type { StudentSession } from '../../../lib/auth';

const StudyLibraryPage = lazy(() => import('../../../features/study/pages/StudyLibraryPage'));

const pages: Record<string, React.LazyExoticComponent<any>> = {
  'learning-algebra-g10-t1-linear-equations':    lazy(() => import('../../../features/study/pages/learning/Algebra/Grade10/Term1/LinearEquations')),
  'learning-algebra-g10-t1-simultaneous':         lazy(() => import('../../../features/study/pages/learning/Algebra/Grade10/Term1/SimultaneousEquations')),
  'learning-physci-g10-t1-waves':                lazy(() => import('../../../features/study/pages/learning/PhysicalSciences/Grade10/Term1/WavesSoundLight')),
  'learning-physci-g10-t1-atoms':                lazy(() => import('../../../features/study/pages/learning/PhysicalSciences/Grade10/Term1/AtomsSubatomicParticles')),
  'learning-physci-g10-t1-classification':       lazy(() => import('../../../features/study/pages/learning/PhysicalSciences/Grade10/Term1/ClassificationOfMatter')),
  'learning-physci-g10-t1-periodic-table':       lazy(() => import('../../../features/study/pages/learning/PhysicalSciences/Grade10/Term1/PeriodicTableTrends')),
  'learning-physci-g10-t1-bonding':              lazy(() => import('../../../features/study/pages/learning/PhysicalSciences/Grade10/Term1/ChemicalBonding')),
  'learning-lifesci-g10-t1-biodiversity':        lazy(() => import('../../../features/study/pages/learning/LifeSciences/Grade10/Term1/BiodiversityAndClassification')),
  'learning-lifesci-g10-t1-five-kingdoms':       lazy(() => import('../../../features/study/pages/learning/LifeSciences/Grade10/Term1/FiveKingdoms')),
  'learning-lifesci-g10-t1-taxonomy':            lazy(() => import('../../../features/study/pages/learning/LifeSciences/Grade10/Term1/TaxonomyAndBinomialNomenclature')),
  'learning-lifesci-g10-t1-species':             lazy(() => import('../../../features/study/pages/learning/LifeSciences/Grade10/Term1/SpeciesConcept')),
  'learning-accounting-g10-t1-intro':            lazy(() => import('../../../features/study/pages/learning/Accounting/Grade10/Term1/IntroductionToAccounting')),
  'learning-accounting-g10-t1-equation':         lazy(() => import('../../../features/study/pages/learning/Accounting/Grade10/Term1/AccountingEquation')),
  'learning-accounting-g10-t1-double-entry':     lazy(() => import('../../../features/study/pages/learning/Accounting/Grade10/Term1/DoubleEntrySystem')),
  'learning-accounting-g10-t1-source-documents': lazy(() => import('../../../features/study/pages/learning/Accounting/Grade10/Term1/SourceDocuments')),
  'learning-accounting-g10-t1-journals':         lazy(() => import('../../../features/study/pages/learning/Accounting/Grade10/Term1/JournalsInAccounting')),
  'learning-accounting-g10-t1-ledger':           lazy(() => import('../../../features/study/pages/learning/Accounting/Grade10/Term1/GeneralLedger')),
  'learning-bizstudies-g10-t1-environment':      lazy(() => import('../../../features/study/pages/learning/BusinessStudies/Grade10/Term1/BusinessEnvironment')),
  'learning-bizstudies-g10-t1-sectors':          lazy(() => import('../../../features/study/pages/learning/BusinessStudies/Grade10/Term1/BusinessSectors')),
  'learning-bizstudies-g10-t1-stakeholders':     lazy(() => import('../../../features/study/pages/learning/BusinessStudies/Grade10/Term1/BusinessStakeholders')),
  'learning-bizstudies-g10-t1-operations':       lazy(() => import('../../../features/study/pages/learning/BusinessStudies/Grade10/Term1/BusinessOperations')),
  'learning-economics-g10-t1-problem':           lazy(() => import('../../../features/study/pages/learning/Economics/Grade10/Term1/EconomicProblem')),
  'learning-economics-g10-t1-ppc':               lazy(() => import('../../../features/study/pages/learning/Economics/Grade10/Term1/ProductionPossibilityCurve')),
  'learning-economics-g10-t1-systems':           lazy(() => import('../../../features/study/pages/learning/Economics/Grade10/Term1/EconomicSystems')),
  'learning-economics-g10-t1-circular-flow':     lazy(() => import('../../../features/study/pages/learning/Economics/Grade10/Term1/CircularFlowModel')),
  'learning-economics-g10-t1-factors':           lazy(() => import('../../../features/study/pages/learning/Economics/Grade10/Term1/FactorsOfProduction')),
  'learning-cat-g10-t1-computer-systems':        lazy(() => import('../../../features/study/pages/learning/CAT/Grade10/Term1/ComputerSystems')),
  'learning-cat-g10-t1-file-management':         lazy(() => import('../../../features/study/pages/learning/CAT/Grade10/Term1/FileManagement')),
  'learning-cat-g10-t1-word-processing':         lazy(() => import('../../../features/study/pages/learning/CAT/Grade10/Term1/WordProcessing')),
  'learning-cat-g10-t1-spreadsheets':            lazy(() => import('../../../features/study/pages/learning/CAT/Grade10/Term1/Spreadsheets')),
  'learning-egd-g10-t1-drawing-instruments':     lazy(() => import('../../../features/study/pages/learning/EGD/Grade10/Term1/DrawingInstruments')),
};

// CSS that overrides the large top-padding the learning pages use for the public site nav
// We apply it via a scoped class so it doesn't bleed into the rest of the portal.
const PORTAL_STYLE = `
  .portal-content main        { padding-top: 1.5rem !important; }
  .portal-content [class*="pt-20"] { padding-top: 1.5rem !important; }
  .portal-content [class*="pt-24"] { padding-top: 1.5rem !important; }
  .portal-content [class*="pt-28"] { padding-top: 1.5rem !important; }
`;

const Spinner = () => (
  <div className="flex-1 flex items-center justify-center py-24">
    <div className="w-5 h-5 border-2 border-slate-200 border-t-slate-700 rounded-full animate-spin" />
  </div>
);

// ── Topic label from page key ─────────────────────────────────────────────────
function topicLabel(key: string): string {
  // 'learning-algebra-g10-t1-linear-equations' → 'Linear Equations'
  const slug = key.replace(/^learning-[^-]+-g\d+-t\d+-/, '');
  return slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

// ── Portal top-bar shared between hub and topic pages ─────────────────────────
function PortalBar({
  onBack,
  backLabel,
  title,
}: {
  onBack: () => void;
  backLabel: string;
  title?: string;
}) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-14 bg-white border-b border-slate-100 flex items-center px-5 gap-3 shrink-0">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm font-black text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        {backLabel}
      </button>
      {title && (
        <>
          <div className="w-px h-4 bg-slate-200" />
          <BookOpen className="w-4 h-4 text-slate-300 shrink-0" />
          <span className="text-xs font-bold text-slate-400 truncate">{title}</span>
        </>
      )}
    </div>
  );
}

interface LibraryPageProps {
  session: StudentSession;
  innerPage: string;
  onNavigate: (page: string) => void;
}

export default function LibraryPage({ session, innerPage, onNavigate }: LibraryPageProps) {
  const sessionData = { student_id: session.student_id, school_id: session.school_id };
  const LearningPage = innerPage !== 'library' ? pages[innerPage] : null;

  return (
    <StudySessionProvider value={sessionData}>
      <style>{PORTAL_STYLE}</style>

      {/* ── Learning topic page ─────────────────────────────────────────── */}
      {LearningPage ? (
        <div className="min-h-screen" style={{ background: '#F5F0E8' }}>
          {/* Fixed nav bar with back-to-library button */}
          <PortalBar
            onBack={() => onNavigate('library')}
            backLabel="Library"
            title={topicLabel(innerPage)}
          />
          {/* Offset the content below the fixed bar, override page's own pt */}
          <div className="portal-content" style={{ paddingTop: '56px' }}>
            <Suspense fallback={<Spinner />}>
              <LearningPage onNavigate={onNavigate} />
            </Suspense>
          </div>
        </div>
      ) : (
        /* ── Library hub ───────────────────────────────────────────────── */
        <div className="min-h-screen">
          <div className="portal-content" style={{ paddingTop: '0' }}>
            <Suspense fallback={<Spinner />}>
              <StudyLibraryPage onNavigate={onNavigate} />
            </Suspense>
          </div>
        </div>
      )}
    </StudySessionProvider>
  );
}
