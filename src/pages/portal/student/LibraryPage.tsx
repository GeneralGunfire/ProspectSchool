import { Suspense, lazy } from 'react';
import { StudySessionProvider } from '../../../providers/StudySessionContext';
import type { StudentSession } from '../../../lib/auth';

// Lazy-load the full study library hub
const StudyLibraryPage = lazy(() => import('../../../features/study/pages/StudyLibraryPage'));

// All 32 learning pages — lazy loaded only when navigated to
const pages: Record<string, React.LazyExoticComponent<any>> = {
  'learning-algebra-g10-t1-linear-equations':   lazy(() => import('../../../features/study/pages/learning/Algebra/Grade10/Term1/LinearEquations')),
  'learning-algebra-g10-t1-simultaneous':        lazy(() => import('../../../features/study/pages/learning/Algebra/Grade10/Term1/SimultaneousEquations')),
  'learning-physci-g10-t1-waves':               lazy(() => import('../../../features/study/pages/learning/PhysicalSciences/Grade10/Term1/WavesSoundLight')),
  'learning-physci-g10-t1-atoms':               lazy(() => import('../../../features/study/pages/learning/PhysicalSciences/Grade10/Term1/AtomsSubatomicParticles')),
  'learning-physci-g10-t1-classification':      lazy(() => import('../../../features/study/pages/learning/PhysicalSciences/Grade10/Term1/ClassificationOfMatter')),
  'learning-physci-g10-t1-periodic-table':      lazy(() => import('../../../features/study/pages/learning/PhysicalSciences/Grade10/Term1/PeriodicTableTrends')),
  'learning-physci-g10-t1-bonding':             lazy(() => import('../../../features/study/pages/learning/PhysicalSciences/Grade10/Term1/ChemicalBonding')),
  'learning-lifesci-g10-t1-biodiversity':       lazy(() => import('../../../features/study/pages/learning/LifeSciences/Grade10/Term1/BiodiversityAndClassification')),
  'learning-lifesci-g10-t1-five-kingdoms':      lazy(() => import('../../../features/study/pages/learning/LifeSciences/Grade10/Term1/FiveKingdoms')),
  'learning-lifesci-g10-t1-taxonomy':           lazy(() => import('../../../features/study/pages/learning/LifeSciences/Grade10/Term1/TaxonomyAndBinomialNomenclature')),
  'learning-lifesci-g10-t1-species':            lazy(() => import('../../../features/study/pages/learning/LifeSciences/Grade10/Term1/SpeciesConcept')),
  'learning-accounting-g10-t1-intro':           lazy(() => import('../../../features/study/pages/learning/Accounting/Grade10/Term1/IntroductionToAccounting')),
  'learning-accounting-g10-t1-equation':        lazy(() => import('../../../features/study/pages/learning/Accounting/Grade10/Term1/AccountingEquation')),
  'learning-accounting-g10-t1-double-entry':    lazy(() => import('../../../features/study/pages/learning/Accounting/Grade10/Term1/DoubleEntrySystem')),
  'learning-accounting-g10-t1-source-documents':lazy(() => import('../../../features/study/pages/learning/Accounting/Grade10/Term1/SourceDocuments')),
  'learning-accounting-g10-t1-journals':        lazy(() => import('../../../features/study/pages/learning/Accounting/Grade10/Term1/JournalsInAccounting')),
  'learning-accounting-g10-t1-ledger':          lazy(() => import('../../../features/study/pages/learning/Accounting/Grade10/Term1/GeneralLedger')),
  'learning-bizstudies-g10-t1-environment':     lazy(() => import('../../../features/study/pages/learning/BusinessStudies/Grade10/Term1/BusinessEnvironment')),
  'learning-bizstudies-g10-t1-sectors':         lazy(() => import('../../../features/study/pages/learning/BusinessStudies/Grade10/Term1/BusinessSectors')),
  'learning-bizstudies-g10-t1-stakeholders':    lazy(() => import('../../../features/study/pages/learning/BusinessStudies/Grade10/Term1/BusinessStakeholders')),
  'learning-bizstudies-g10-t1-operations':      lazy(() => import('../../../features/study/pages/learning/BusinessStudies/Grade10/Term1/BusinessOperations')),
  'learning-economics-g10-t1-problem':          lazy(() => import('../../../features/study/pages/learning/Economics/Grade10/Term1/EconomicProblem')),
  'learning-economics-g10-t1-ppc':              lazy(() => import('../../../features/study/pages/learning/Economics/Grade10/Term1/ProductionPossibilityCurve')),
  'learning-economics-g10-t1-systems':          lazy(() => import('../../../features/study/pages/learning/Economics/Grade10/Term1/EconomicSystems')),
  'learning-economics-g10-t1-circular-flow':    lazy(() => import('../../../features/study/pages/learning/Economics/Grade10/Term1/CircularFlowModel')),
  'learning-economics-g10-t1-factors':          lazy(() => import('../../../features/study/pages/learning/Economics/Grade10/Term1/FactorsOfProduction')),
  'learning-cat-g10-t1-computer-systems':       lazy(() => import('../../../features/study/pages/learning/CAT/Grade10/Term1/ComputerSystems')),
  'learning-cat-g10-t1-file-management':        lazy(() => import('../../../features/study/pages/learning/CAT/Grade10/Term1/FileManagement')),
  'learning-cat-g10-t1-word-processing':        lazy(() => import('../../../features/study/pages/learning/CAT/Grade10/Term1/WordProcessing')),
  'learning-cat-g10-t1-spreadsheets':           lazy(() => import('../../../features/study/pages/learning/CAT/Grade10/Term1/Spreadsheets')),
  'learning-egd-g10-t1-drawing-instruments':    lazy(() => import('../../../features/study/pages/learning/EGD/Grade10/Term1/DrawingInstruments')),
};

const Spinner = () => (
  <div className="min-h-screen bg-white flex items-center justify-center">
    <div className="w-6 h-6 border-2 border-slate-200 border-t-slate-700 rounded-full animate-spin" />
  </div>
);

interface LibraryPageProps {
  session: StudentSession;
  innerPage: string;           // 'library' or a learning page key
  onNavigate: (page: string) => void;
}

export default function LibraryPage({ session, innerPage, onNavigate }: LibraryPageProps) {
  const sessionData = {
    student_id: session.student_id,
    school_id: session.school_id,
  };

  const LearningPage = innerPage !== 'library' ? pages[innerPage] : null;

  return (
    <StudySessionProvider value={sessionData}>
      <Suspense fallback={<Spinner />}>
        {LearningPage ? (
          <>
            {/* Override the pt-28/pt-24 top padding the learning pages use for the public nav */}
            <style>{`main.pt-28 { padding-top: 1.5rem !important; } main.pt-24 { padding-top: 1.5rem !important; }`}</style>
            <LearningPage onNavigate={onNavigate} />
          </>
        ) : (
          <StudyLibraryPage
            onNavigate={onNavigate}
            onNavigateHome={() => onNavigate('student-dashboard')}
            guestMode={false}
            user={{ id: String(session.student_id) }}
          />
        )}
      </Suspense>
    </StudySessionProvider>
  );
}
