import { algebraicExpressions } from './algebraicExpressions';
import { equationsAndInequalities } from './equationsAndInequalities';
import { numberPatterns } from './numberPatterns';
import { functions } from './functions';
import { mathematicalModelling } from './mathematicalModelling';
import { wavesSoundLight } from './wavesSoundLight';
import { atomsSubatomicParticles } from './atomsSubatomicParticles';
import { classificationOfMatter } from './classificationOfMatter';
import { periodicTableTrends } from './periodicTableTrends';
import { chemicalBonding } from './chemicalBonding';

// Life Sciences
import { biodiversityAndClassification } from './biodiversityAndClassification';
import { fiveKingdoms } from './fiveKingdoms';
import { taxonomyAndBinomialNomenclature } from './taxonomyAndBinomialNomenclature';
import { speciesConcept } from './speciesConcept';

// Accounting
import { introductionToAccounting } from './introductionToAccounting';
import { accountingEquation } from './accountingEquation';
import { doubleEntrySystem } from './doubleEntrySystem';
import { sourceDocuments, journalsInAccounting, generalLedgerTopics } from './remainingTopics';

// Business Studies
import { businessEnvironment, businessSectors, businessStakeholders, businessOperations } from './businessStudiesTopics';

// Economics
import { economicProblem, productionPossibilityCurve, economicSystems, circularFlowModel, factorsOfProduction } from './economicsTopics';

// CAT
import { computerSystems, fileManagement, wordProcessing, spreadsheet } from './catAndEgdTopics';

// EGD
import { drawingInstruments, lineTypesAndLettering, geometricalConstructions, orthographicProjection } from './catAndEgdTopics';
import { measuringLinesAngles, circumscribedInscribedTriangles, regulerPolygons } from './egdTopics';

// English
import { languageStructures, readingComprehension, writingEssays, literaryAnalysis, communicationSkills } from './englishTopics';

export const grade10Term1MathTopics = [
  algebraicExpressions,
  equationsAndInequalities,
  numberPatterns,
  functions,
  mathematicalModelling
];

export const grade10Term1PhysicsTopics = [
  wavesSoundLight,
  atomsSubatomicParticles
];

export const grade10Term1ChemistryTopics = [
  classificationOfMatter,
  periodicTableTrends,
  chemicalBonding
];

export const grade10Term1PhysicalScienceTopics = [
  ...grade10Term1PhysicsTopics,
  ...grade10Term1ChemistryTopics
];

export const grade10Term1LifeSciencesTopics = [
  biodiversityAndClassification,
  fiveKingdoms,
  taxonomyAndBinomialNomenclature,
  speciesConcept
];

export const grade10Term1AccountingTopics = [
  introductionToAccounting,
  accountingEquation,
  doubleEntrySystem,
  sourceDocuments,
  journalsInAccounting,
  generalLedgerTopics
];

export const grade10Term1BusinessStudiesTopics = [
  businessEnvironment,
  businessSectors,
  businessStakeholders,
  businessOperations
];

export const grade10Term1EconomicsTopics = [
  economicProblem,
  productionPossibilityCurve,
  economicSystems,
  circularFlowModel,
  factorsOfProduction
];

export const grade10Term1CATTopics = [
  computerSystems,
  fileManagement,
  wordProcessing,
  spreadsheet
];

export const grade10Term1EGDTopics = [
  drawingInstruments,
  lineTypesAndLettering,
  geometricalConstructions,
  orthographicProjection,
  measuringLinesAngles,
  circumscribedInscribedTriangles,
  regulerPolygons
];

export const grade10Term1EnglishTopics = [
  languageStructures,
  readingComprehension,
  writingEssays,
  literaryAnalysis,
  communicationSkills
];

// All Grade 10 Term 1 Topics Combined
export const grade10Term1AllTopics = [
  ...grade10Term1MathTopics,
  ...grade10Term1PhysicsTopics,
  ...grade10Term1ChemistryTopics,
  ...grade10Term1LifeSciencesTopics,
  ...grade10Term1AccountingTopics,
  ...grade10Term1BusinessStudiesTopics,
  ...grade10Term1EconomicsTopics,
  ...grade10Term1CATTopics,
  ...grade10Term1EGDTopics,
  ...grade10Term1EnglishTopics
];

export {
  algebraicExpressions,
  equationsAndInequalities,
  numberPatterns,
  functions,
  mathematicalModelling,
  wavesSoundLight,
  atomsSubatomicParticles,
  classificationOfMatter,
  periodicTableTrends,
  chemicalBonding,
  biodiversityAndClassification,
  fiveKingdoms,
  taxonomyAndBinomialNomenclature,
  speciesConcept,
  introductionToAccounting,
  accountingEquation,
  doubleEntrySystem,
  sourceDocuments,
  journalsInAccounting,
  generalLedgerTopics,
  businessEnvironment,
  businessSectors,
  businessStakeholders,
  businessOperations,
  economicProblem,
  productionPossibilityCurve,
  economicSystems,
  circularFlowModel,
  factorsOfProduction,
  computerSystems,
  fileManagement,
  wordProcessing,
  spreadsheet,
  drawingInstruments,
  lineTypesAndLettering,
  geometricalConstructions,
  orthographicProjection,
  languageStructures,
  readingComprehension,
  writingEssays,
  literaryAnalysis,
  communicationSkills
};

export type Topic = typeof algebraicExpressions;
export type WorkedExample = Topic['workedExamples'][0];
export type PracticeQuestion = Topic['practiceQuestions'][0];
export type Quiz = Topic['topicQuiz'];
export type Exam = Topic['practiceExam'];
