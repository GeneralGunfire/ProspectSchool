// ── Shared content-shape types for the Study Library lesson template ─────────
// Every topic's content file (e.g. data/library/algebra/grade10/term1/realNumberSystem.ts)
// authors a LessonContent object satisfying these types. Rendering logic lives
// entirely in components/lesson/* — content files are pure data, no JSX.

export type MasteryLevel = 'not_started' | 'needs_practice' | 'mastered';

// ── Objectives & metadata ─────────────────────────────────────────────────────

export interface LessonObjective {
  id: string; // topic-local id, e.g. 'classify-numbers'. Used as the key in study_progress.sub_skills.
  text: string; // "By the end of this lesson, you will be able to..."
}

export interface LessonMeta {
  subject: string; // matches subjects.ts id, e.g. 'algebra'
  grade: number;
  term: number;
  topicId: string; // used in the innerPage route string, e.g. 'real-number-system'
  topicName: string;
  prerequisites: string[];
  objectives: LessonObjective[];
  estimatedMinutes: [number, number]; // [min, max]
}

// ── Worked examples (fading sequence) ─────────────────────────────────────────

export interface WorkedStep {
  step: string; // the math/action at this step
  justification: string; // 1-sentence rule/principle used
}

export interface WorkedExampleContent {
  id: string;
  prompt: string;
  steps: WorkedStep[];
  answer: string;
}

/** A fading-practice problem: same shape as a worked example, but `revealSteps`
 *  controls how many of `steps` are shown before the learner must complete the rest.
 *  0 = independent (no steps shown), steps.length = fully worked. */
export interface FadingProblem extends WorkedExampleContent {
  revealSteps: number;
  objectiveId: string;
}

// ── Misconceptions & feedback ─────────────────────────────────────────────────

export interface Misconception {
  id: string;
  label: string; // short internal name
  errorType: string; // "Name the error" — 1 sentence
  principle: string; // "Explain the principle" — 1-2 sentences
  correctStep: string; // "Show the correct step" — 1 line of math/text
}

// ── Hints ──────────────────────────────────────────────────────────────────────

export interface HintTiers {
  strategic: string;
  procedural: string;
  workedStep: string;
}

// ── Knowledge checks (embedded, low-stakes) ────────────────────────────────────

export interface KnowledgeCheckItem {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  misconceptionId?: string; // if the wrong-answer distractor maps to a known misconception
}

// ── Independent practice (with hints + misconception-aware feedback) ──────────

export interface PracticeItem {
  id: string;
  objectiveId: string;
  question: string;
  options: string[];
  correctIndex: number;
  hints: HintTiers;
  /** Maps each wrong option index to the misconception it represents, for feedback branching. */
  distractorMisconceptions: Record<number, string>; // option index -> Misconception.id
}

// ── End-of-lesson quiz ──────────────────────────────────────────────────────────

export type QuizItemType = 'multi-select' | 'true-false' | 'decimal-discrimination' | 'subset-numberline';

export interface QuizItem {
  id: string;
  type: QuizItemType;
  objectiveId: string;
  question: string;
  options: string[];
  /** Indices of correct options. Single-answer items (true/false, single-select) have length 1. */
  correctIndices: number[];
  multiSelect: boolean;
  explanation: string;
  distractorMisconceptions?: Record<number, string>;
}

// ── Remediation micro-lesson ────────────────────────────────────────────────────

export interface RemediationContent {
  objectiveId: string; // which sub-skill this remediation targets
  analogy: string; // the different representation/analogy used (per Part B section 7)
  explanation: string;
  workedExamples: WorkedExampleContent[];
  practice: PracticeItem[]; // heavily scaffolded, hints always available
  passThreshold: { correct: number; total: number }; // e.g. 4/5
}

// ── Reflection / SRL scaffolding ────────────────────────────────────────────────

export interface ReflectionPrompt {
  id: string;
  prompt: string;
  type: 'confidence-scale' | 'free-text' | 'multiple-choice';
  options?: string[];
}

// ── Top-level lesson content ────────────────────────────────────────────────────

export interface LessonContent {
  meta: LessonMeta;
  colorScheme: Record<string, string>; // number-set -> color token, defined once in colorScheme.ts and referenced here
  openingHook: string;
  goalSettingPrompt: string;
  activate: {
    diagnosticQuestions: KnowledgeCheckItem[];
    connectPrompt: string; // "where have you seen this before?"
  };
  demonstrateChunk1: {
    explanation: string; // <=200 words
    workedExamples: WorkedExampleContent[];
    knowledgeChecks: KnowledgeCheckItem[];
    confidenceCheckPrompt: string;
  };
  demonstrateChunk2: {
    explanation: string;
    workedExamples: WorkedExampleContent[];
    knowledgeChecks: KnowledgeCheckItem[];
    confidenceCheckPrompt: string;
  };
  apply: {
    fadingProblems: FadingProblem[]; // partially worked, ordered full->partial->independent
    independentPractice: PracticeItem[];
  };
  misconceptions: Misconception[]; // all 9 for Topic 1, referenced by id from practice/quiz distractors
  quiz: QuizItem[];
  masteryThresholdPct: number; // 80
  remediation: RemediationContent[]; // one per objective that can fail independently
  reflection: ReflectionPrompt[];
}
