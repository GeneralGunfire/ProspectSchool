import { lazy, Suspense, type ComponentType } from 'react';
import type { StudentSession } from '../../../lib/auth';
import { StudySessionProvider } from '../../../providers/StudySessionContext';
import LibraryHubPage from '../../../features/study/pages/LibraryHubPage';

// ── routeId -> lazy page component ────────────────────────────────────────────
// Keyed by TopicRegistryEntry.routeId (see data/library/registry.ts). Adding a
// new topic means adding one entry to the registry AND one entry here — no
// other routing code changes.
const TOPIC_PAGES: Record<string, ComponentType<{ onExit?: () => void }>> = {
  'learning-algebra-g10-t1-real-number-system': lazy(() => import('../../../features/study/pages/learning/algebra/grade10/term1/RealNumberSystem')),
  'learning-algebra-g10-t1-rounding-estimating-surds': lazy(() => import('../../../features/study/pages/learning/algebra/grade10/term1/RoundingEstimatingSurds')),
  'learning-algebra-g10-t1-algebraic-products': lazy(() => import('../../../features/study/pages/learning/algebra/grade10/term1/AlgebraicProducts')),
  'learning-algebra-g10-t1-factorisation': lazy(() => import('../../../features/study/pages/learning/algebra/grade10/term1/Factorisation')),
  'learning-algebra-g10-t1-algebraic-fractions': lazy(() => import('../../../features/study/pages/learning/algebra/grade10/term1/AlgebraicFractions')),
  'learning-algebra-g10-t1-solving-linear-equations': lazy(() => import('../../../features/study/pages/learning/algebra/grade10/term1/SolvingLinearEquations')),
  'learning-algebra-g10-t1-literal-equations': lazy(() => import('../../../features/study/pages/learning/algebra/grade10/term1/LiteralEquations')),
  'learning-algebra-g10-t1-solving-linear-inequalities': lazy(() => import('../../../features/study/pages/learning/algebra/grade10/term1/SolvingLinearInequalities')),
  'learning-algebra-g10-t1-solving-quadratic-equations': lazy(() => import('../../../features/study/pages/learning/algebra/grade10/term1/SolvingQuadraticEquations')),
  'learning-algebra-g10-t1-solving-simultaneous-equations': lazy(() => import('../../../features/study/pages/learning/algebra/grade10/term1/SolvingSimultaneousEquations')),
  'learning-algebra-g10-t1-word-problems': lazy(() => import('../../../features/study/pages/learning/algebra/grade10/term1/WordProblems')),
  'learning-algebra-g10-t2-trigonometric-ratios': lazy(() => import('../../../features/study/pages/learning/algebra/grade10/term2/TrigonometricRatios')),
  'learning-algebra-g10-t2-solving-right-angled-triangles': lazy(() => import('../../../features/study/pages/learning/algebra/grade10/term2/SolvingRightAngledTriangles')),
  'learning-algebra-g10-t2-linear-functions': lazy(() => import('../../../features/study/pages/learning/algebra/grade10/term2/LinearFunctions')),
  'learning-algebra-g10-t2-quadratic-functions': lazy(() => import('../../../features/study/pages/learning/algebra/grade10/term2/QuadraticFunctions')),
  'learning-algebra-g10-t2-hyperbolic-functions': lazy(() => import('../../../features/study/pages/learning/algebra/grade10/term2/HyperbolicFunctions')),
  'learning-algebra-g10-t2-exponential-functions': lazy(() => import('../../../features/study/pages/learning/algebra/grade10/term2/ExponentialFunctions')),
  'learning-algebra-g10-t2-trigonometric-graphs': lazy(() => import('../../../features/study/pages/learning/algebra/grade10/term2/TrigonometricGraphs')),
  'learning-algebra-g10-t2-interpreting-graphs': lazy(() => import('../../../features/study/pages/learning/algebra/grade10/term2/InterpretingGraphs')),
  'learning-algebra-g10-t3-central-tendency-spread': lazy(() => import('../../../features/study/pages/learning/algebra/grade10/term3/CentralTendencySpread')),
  'learning-algebra-g10-t3-box-and-whisker-plots': lazy(() => import('../../../features/study/pages/learning/algebra/grade10/term3/BoxAndWhiskerPlots')),
  'learning-algebra-g10-t3-probability-venn-diagrams': lazy(() => import('../../../features/study/pages/learning/algebra/grade10/term3/ProbabilityVennDiagrams')),
  'learning-algebra-g10-t3-tree-diagrams-combined-events': lazy(() => import('../../../features/study/pages/learning/algebra/grade10/term3/TreeDiagramsCombinedEvents')),
  'learning-algebra-g10-t3-simple-compound-interest': lazy(() => import('../../../features/study/pages/learning/algebra/grade10/term3/SimpleCompoundInterest')),
  'learning-algebra-g10-t3-hire-purchase-finance': lazy(() => import('../../../features/study/pages/learning/algebra/grade10/term3/HirePurchaseFinance')),
  'learning-algebra-g10-t4-arithmetic-sequences': lazy(() => import('../../../features/study/pages/learning/algebra/grade10/term4/ArithmeticSequences')),
  'learning-algebra-g10-t4-geometric-sequences': lazy(() => import('../../../features/study/pages/learning/algebra/grade10/term4/GeometricSequences')),
  'learning-algebra-g10-t4-function-transformations-inverses': lazy(() => import('../../../features/study/pages/learning/algebra/grade10/term4/FunctionTransformationsInverses')),
  'learning-geometry-g10-t2-distance-and-midpoint': lazy(() => import('../../../features/study/pages/learning/geometry/grade10/term2/DistanceAndMidpoint')),
  'learning-geometry-g10-t2-gradient-and-equations-of-lines': lazy(() => import('../../../features/study/pages/learning/geometry/grade10/term2/GradientAndEquationsOfLines')),
  'learning-geometry-g10-t4-surface-area-and-volume': lazy(() => import('../../../features/study/pages/learning/geometry/grade10/term4/SurfaceAreaAndVolume')),
  'learning-geometry-g10-t4-lines-and-angles': lazy(() => import('../../../features/study/pages/learning/geometry/grade10/term4/LinesAndAngles')),
  'learning-geometry-g10-t4-triangle-properties': lazy(() => import('../../../features/study/pages/learning/geometry/grade10/term4/TriangleProperties')),
  'learning-geometry-g10-t4-quadrilateral-properties': lazy(() => import('../../../features/study/pages/learning/geometry/grade10/term4/QuadrilateralProperties')),
  'learning-geometry-g10-t4-midpoint-theorem': lazy(() => import('../../../features/study/pages/learning/geometry/grade10/term4/MidpointTheorem')),
  'learning-english-hl-g10-t1-word-classes-and-sentence-structures': lazy(() => import('../../../features/study/pages/learning/english-hl/grade10/term1/WordClassesAndSentenceStructures')),
  'learning-english-hl-g10-t1-tenses-and-punctuation': lazy(() => import('../../../features/study/pages/learning/english-hl/grade10/term1/TensesAndPunctuation')),
  'learning-english-hl-g10-t1-comprehension-strategies': lazy(() => import('../../../features/study/pages/learning/english-hl/grade10/term1/ComprehensionStrategies')),
  'learning-english-hl-g10-t1-poetic-devices-and-theme': lazy(() => import('../../../features/study/pages/learning/english-hl/grade10/term1/PoeticDevicesAndTheme')),
  'learning-english-hl-g10-t2-direct-indirect-speech-and-voice': lazy(() => import('../../../features/study/pages/learning/english-hl/grade10/term2/DirectIndirectSpeechAndVoice')),
  'learning-english-hl-g10-t2-advanced-punctuation-and-figurative-language': lazy(() => import('../../../features/study/pages/learning/english-hl/grade10/term2/AdvancedPunctuationAndFigurativeLanguage')),
  'learning-english-hl-g10-t2-comprehension-evaluation-appreciation': lazy(() => import('../../../features/study/pages/learning/english-hl/grade10/term2/ComprehensionEvaluationAppreciation')),
  'learning-english-hl-g10-t2-analysing-short-stories': lazy(() => import('../../../features/study/pages/learning/english-hl/grade10/term2/AnalysingShortStories')),
  'learning-english-hl-g10-t3-complex-sentences-register-idiom': lazy(() => import('../../../features/study/pages/learning/english-hl/grade10/term3/ComplexSentencesRegisterIdiom')),
  'learning-english-hl-g10-t3-reading-formal-and-critical-texts': lazy(() => import('../../../features/study/pages/learning/english-hl/grade10/term3/ReadingFormalAndCriticalTexts')),
  'learning-english-hl-g10-t3-structuring-literary-response': lazy(() => import('../../../features/study/pages/learning/english-hl/grade10/term3/StructuringLiteraryResponse')),
  'learning-english-hl-g10-t4-visual-literacy-and-persuasive-techniques': lazy(() => import('../../../features/study/pages/learning/english-hl/grade10/term4/VisualLiteracyAndPersuasiveTechniques')),
  'learning-phys-sci-g10-t1-waves-sound-and-light': lazy(() => import('../../../features/study/pages/learning/phys-sci/grade10/term1/WavesSoundAndLight')),
  'learning-phys-sci-g10-t1-electrostatics': lazy(() => import('../../../features/study/pages/learning/phys-sci/grade10/term1/Electrostatics')),
  'learning-phys-sci-g10-t2-matter-classification-and-states': lazy(() => import('../../../features/study/pages/learning/phys-sci/grade10/term2/MatterClassificationAndStates')),
  'learning-phys-sci-g10-t2-atomic-structure-and-periodic-table': lazy(() => import('../../../features/study/pages/learning/phys-sci/grade10/term2/AtomicStructureAndPeriodicTable')),
  'learning-phys-sci-g10-t2-chemical-bonding': lazy(() => import('../../../features/study/pages/learning/phys-sci/grade10/term2/ChemicalBonding')),
  'learning-phys-sci-g10-t2-physical-chemical-change-and-equations': lazy(() => import('../../../features/study/pages/learning/phys-sci/grade10/term2/PhysicalChemicalChangeAndEquations')),
  'learning-phys-sci-g10-t3-quantitative-aspects-of-chemical-change': lazy(() => import('../../../features/study/pages/learning/phys-sci/grade10/term3/QuantitativeAspectsOfChemicalChange')),
  'learning-phys-sci-g10-t3-vectors-and-scalars': lazy(() => import('../../../features/study/pages/learning/phys-sci/grade10/term3/VectorsAndScalars')),
  'learning-phys-sci-g10-t3-motion-in-one-dimension': lazy(() => import('../../../features/study/pages/learning/phys-sci/grade10/term3/MotionInOneDimension')),
  'learning-phys-sci-g10-t3-equations-of-motion': lazy(() => import('../../../features/study/pages/learning/phys-sci/grade10/term3/EquationsOfMotion')),
  'learning-phys-sci-g10-t3-energy': lazy(() => import('../../../features/study/pages/learning/phys-sci/grade10/term3/Energy')),
  'learning-phys-sci-g10-t4-paper-1-revision': lazy(() => import('../../../features/study/pages/learning/phys-sci/grade10/term4/Paper1Revision')),
  'learning-phys-sci-g10-t4-paper-2-revision': lazy(() => import('../../../features/study/pages/learning/phys-sci/grade10/term4/Paper2Revision')),
  'learning-life-sci-g10-t1-chemistry-of-life': lazy(() => import('../../../features/study/pages/learning/life-sci/grade10/term1/ChemistryOfLife')),
  'learning-life-sci-g10-t1-cells-basic-units-of-life': lazy(() => import('../../../features/study/pages/learning/life-sci/grade10/term1/CellsBasicUnitsOfLife')),
  'learning-life-sci-g10-t1-cell-division-mitosis': lazy(() => import('../../../features/study/pages/learning/life-sci/grade10/term1/CellDivisionMitosis')),
  'learning-life-sci-g10-t2-plant-and-animal-tissues': lazy(() => import('../../../features/study/pages/learning/life-sci/grade10/term2/PlantAndAnimalTissues')),
  'learning-life-sci-g10-t2-support-and-transport-systems-in-plants': lazy(() => import('../../../features/study/pages/learning/life-sci/grade10/term2/SupportAndTransportSystemsInPlants')),
  'learning-life-sci-g10-t2-support-and-transport-systems-in-animals': lazy(() => import('../../../features/study/pages/learning/life-sci/grade10/term2/SupportAndTransportSystemsInAnimals')),
  'learning-life-sci-g10-t3-biosphere-and-biomes': lazy(() => import('../../../features/study/pages/learning/life-sci/grade10/term3/BiosphereAndBiomes')),
  'learning-life-sci-g10-t3-ecosystems-and-ecological-relationships': lazy(() => import('../../../features/study/pages/learning/life-sci/grade10/term3/EcosystemsAndEcologicalRelationships')),
  'learning-life-sci-g10-t3-human-impact-on-the-environment': lazy(() => import('../../../features/study/pages/learning/life-sci/grade10/term3/HumanImpactOnTheEnvironment')),
  'learning-life-sci-g10-t4-biodiversity-and-classification': lazy(() => import('../../../features/study/pages/learning/life-sci/grade10/term4/BiodiversityAndClassification')),
  'learning-life-sci-g10-t4-history-of-life-on-earth': lazy(() => import('../../../features/study/pages/learning/life-sci/grade10/term4/HistoryOfLifeOnEarth')),
};

interface LibraryPageProps {
  session: StudentSession;
  innerPage: string;
  onNavigate: (page: string) => void;
}

const Spinner = () => (
  <div className="flex items-center justify-center py-24">
    <div className="w-5 h-5 border-2 border-brand-border border-t-accent rounded-full animate-spin" />
  </div>
);

export default function LibraryPage({ session, innerPage, onNavigate }: LibraryPageProps) {
  const TopicPage = TOPIC_PAGES[innerPage];

  return (
    <StudySessionProvider value={{ student_id: session.student_id, school_id: session.school_id }}>
      {TopicPage ? (
        <Suspense fallback={<Spinner />}>
          <TopicPage onExit={() => onNavigate('library')} />
        </Suspense>
      ) : (
        <LibraryHubPage session={session} onNavigate={onNavigate} />
      )}
    </StudySessionProvider>
  );
}
