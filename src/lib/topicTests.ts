import { supabaseAdmin } from './supabase';

// ── Curated topic catalog ────────────────────────────────────────
// Ordered, predefined topics per subject+grade+term, matching the official
// CAPS (Curriculum and Assessment Policy Statement) Annual Teaching Plan —
// NOT the Library's current page list, which only covers a subset of topics.
// Each catalog topic carries its own ready-made, auto-graded question set —
// a teacher picks a topic and assigns it, no authoring required.
// Extend this map as more subjects/terms/topics get pre-built content.

export interface CatalogQuestion {
  subskillLabel: string;   // must match one entry in `subskills` below
  question_type: 'mcq' | 'short_answer';
  prompt: string;
  options?: string[];       // mcq only
  correct_answer: string;
  answer_tolerance?: number; // short_answer only
}

export interface CatalogTopic {
  topicKey: string;         // stable slug used as topic_key, e.g. "AlgebraicExpressions"
  label: string;            // display name, e.g. "Algebraic Expressions"
  subskills: string[];      // fixed diagnostic taxonomy, in order
  questions: CatalogQuestion[];
}

// Keyed by `${subject_code}-${grade}-${term}`.
// CAPS Grade 10 Mathematics Term 1 algebra strand, in taught order:
// Algebraic Expressions -> Exponents -> Number Patterns -> Equations & Inequalities.
const TOPIC_CATALOG: Record<string, CatalogTopic[]> = {
  'math-10-1': [
    {
      topicKey: 'AlgebraicExpressions',
      label: 'Algebraic Expressions',
      subskills: [
        'Classifying real numbers',
        'Rounding off',
        'Products (expanding expressions)',
        'Factorisation',
        'Simplifying algebraic fractions',
      ],
      questions: [
        { subskillLabel: 'Classifying real numbers', question_type: 'mcq',
          prompt: 'Which of the following is an irrational number?',
          options: ['√9', '0.25', '√7', '-3'], correct_answer: '√7' },
        { subskillLabel: 'Classifying real numbers', question_type: 'mcq',
          prompt: 'Which set of numbers does -5 belong to?',
          options: ['Natural numbers only', 'Whole numbers only', 'Integers', 'Irrational numbers'], correct_answer: 'Integers' },
        { subskillLabel: 'Rounding off', question_type: 'short_answer',
          prompt: 'Round 3.14159 to 2 decimal places.', correct_answer: '3.14' },
        { subskillLabel: 'Rounding off', question_type: 'short_answer',
          prompt: 'Round 128.756 to 1 decimal place.', correct_answer: '128.8' },
        { subskillLabel: 'Products (expanding expressions)', question_type: 'short_answer',
          prompt: 'Expand: 3x(x + 4). Give the answer in the form ax² + bx (no spaces, e.g. 3x^2+12x)', correct_answer: '3x^2+12x' },
        { subskillLabel: 'Products (expanding expressions)', question_type: 'mcq',
          prompt: 'Expand: (x + 2)(x + 3)', options: ['x² + 5x + 6', 'x² + 6x + 5', 'x² + 5x + 5', 'x² + 6'], correct_answer: 'x² + 5x + 6' },
        { subskillLabel: 'Factorisation', question_type: 'short_answer',
          prompt: 'Factorise fully: x² - 9. Give your answer in the form (x+a)(x-a), no spaces, e.g. (x+3)(x-3)', correct_answer: '(x+3)(x-3)' },
        { subskillLabel: 'Factorisation', question_type: 'mcq',
          prompt: 'Factorise: x² + 7x + 10', options: ['(x+2)(x+5)', '(x+1)(x+10)', '(x+2)(x+3)', '(x-2)(x-5)'], correct_answer: '(x+2)(x+5)' },
        { subskillLabel: 'Simplifying algebraic fractions', question_type: 'short_answer',
          prompt: 'Simplify: (x² - 4)/(x + 2). Give your answer as x-2 (no spaces)', correct_answer: 'x-2' },
        { subskillLabel: 'Simplifying algebraic fractions', question_type: 'mcq',
          prompt: 'Simplify: (6x²)/(3x)', options: ['2x', '3x', '2x²', '6x'], correct_answer: '2x' },
      ],
    },
    { topicKey: 'Exponents', label: 'Exponents', subskills: [], questions: [] },
    { topicKey: 'NumberPatterns', label: 'Number Patterns', subskills: [], questions: [] },
    { topicKey: 'EquationsAndInequalities', label: 'Equations and Inequalities', subskills: [], questions: [] },
  ],
};

export function getCatalogTopics(subjectCode: string, grade: number, term: number): CatalogTopic[] {
  return TOPIC_CATALOG[`${subjectCode}-${grade}-${term}`] ?? [];
}

// ── Types ─────────────────────────────────────────────────────

export type GradingMode = 'auto' | 'manual';

export interface TopicTest {
  id: number;
  school_id: number;
  teacher_id: number;
  subject_id: number;
  grade: number;
  term: number;
  topic_key: string;
  title: string;
  time_limit_seconds: number;
  grading_mode: GradingMode;
  is_active: boolean;
  created_at: string;
  // joined
  subject_label?: string;
}

export interface TopicTestSubskill {
  id: number;
  topic_test_id: number;
  label: string;
  sort_order: number;
}

export type QuestionType = 'mcq' | 'short_answer' | 'open_text';

export interface TopicTestQuestion {
  id: number;
  topic_test_id: number;
  subskill_id: number;
  question_type: QuestionType;
  prompt: string;
  options: string[] | null;
  correct_answer: string | null; // null for open_text — teacher marks manually
  answer_tolerance: number | null;
  sort_order: number;
}

export interface TopicTestAssignment {
  id: number;
  topic_test_id: number;
  teacher_id: number;
  school_id: number;
  subject_id: number;
  grade: number;
  opens_at: string;
  closes_at: string | null;
  is_active: boolean;
  created_at: string;
}

export interface TopicTestAttempt {
  id: number;
  topic_test_id: number;
  assignment_id: number;
  student_id: number;
  school_id: number;
  started_at: string;
  submitted_at: string | null;
  time_expired: boolean;
  score_pct: number | null;
  grading_complete: boolean;
}

export interface TopicTestAnswer {
  id: number;
  attempt_id: number;
  question_id: number;
  subskill_id: number;
  student_answer: string | null;
  is_correct: boolean;
  graded_at: string | null;
}

// Full test definition bundle used by builder + student test-taking screen
export interface TopicTestFull {
  test: TopicTest;
  subskills: TopicTestSubskill[];
  questions: TopicTestQuestion[];
}

export interface CreateTopicTestInput {
  school_id: number;
  teacher_id: number;
  subject_id: number;
  grade: number;
  term?: number;
  topic_key: string;
  title: string;
  time_limit_seconds?: number;
  grading_mode?: GradingMode; // defaults to 'auto'
  subskills: string[]; // labels, in order
}

export type TopicTestResult =
  | { success: true; test: TopicTest }
  | { success: false; error: string };

export type SimpleResult =
  | { success: true }
  | { success: false; error: string };

// ── Teacher: fetch all tests (grouped by subject+grade) ────────

export interface TopicTestGroup {
  key: string; // `${subject_id}-${grade}`
  subject_id: number;
  subject_label: string;
  grade: number;
  tests: TopicTest[];
}

export async function fetchTeacherTopicTests(
  teacher_id: number,
  school_id: number
): Promise<TopicTestGroup[]> {
  const { data, error } = await supabaseAdmin
    .from('topic_tests')
    .select('*')
    .eq('teacher_id', teacher_id)
    .eq('school_id', school_id)
    .order('grade')
    .order('created_at', { ascending: false });

  if (error || !data) return [];

  const subjectIds = [...new Set(data.map((r: any) => r.subject_id as number))];
  const { data: subjectsData } = await supabaseAdmin
    .from('subjects')
    .select('id, label')
    .in('id', subjectIds);
  const subjectMap = new Map((subjectsData ?? []).map((s: any) => [s.id, s.label]));

  const tests: TopicTest[] = data.map((r: any) => ({
    ...r,
    subject_label: subjectMap.get(r.subject_id) ?? 'Unknown',
  }));

  const map = new Map<string, TopicTestGroup>();
  for (const t of tests) {
    const key = `${t.subject_id}-${t.grade}`;
    if (!map.has(key)) {
      map.set(key, { key, subject_id: t.subject_id, subject_label: t.subject_label ?? '', grade: t.grade, tests: [] });
    }
    map.get(key)!.tests.push(t);
  }

  return Array.from(map.values()).sort((a, b) =>
    a.grade !== b.grade ? a.grade - b.grade : a.subject_label.localeCompare(b.subject_label)
  );
}

// ── Fetch one test's full definition (subskills + questions) ──

export async function fetchTopicTestFull(topic_test_id: number): Promise<TopicTestFull | null> {
  const { data: test } = await supabaseAdmin
    .from('topic_tests')
    .select('*')
    .eq('id', topic_test_id)
    .single();

  if (!test) return null;

  const { data: subskills } = await supabaseAdmin
    .from('topic_test_subskills')
    .select('*')
    .eq('topic_test_id', topic_test_id)
    .order('sort_order');

  const { data: questions } = await supabaseAdmin
    .from('topic_test_questions')
    .select('*')
    .eq('topic_test_id', topic_test_id)
    .order('sort_order');

  return {
    test,
    subskills: subskills ?? [],
    questions: questions ?? [],
  };
}

// ── Create a test + its sub-skill taxonomy ─────────────────────

export async function createTopicTest(input: CreateTopicTestInput): Promise<TopicTestResult> {
  const { school_id, teacher_id, subject_id, grade, term = 1, topic_key, title, time_limit_seconds = 600, grading_mode = 'auto', subskills } = input;

  if (subskills.length === 0) {
    return { success: false, error: 'Add at least one sub-skill before creating the test.' };
  }

  const { data: test, error } = await supabaseAdmin
    .from('topic_tests')
    .insert({
      school_id, teacher_id, subject_id, grade, term,
      topic_key, title: title.trim(), time_limit_seconds, grading_mode,
    })
    .select('*')
    .single();

  if (error || !test) return { success: false, error: error?.message ?? 'Failed to create test.' };

  const { error: subskillError } = await supabaseAdmin
    .from('topic_test_subskills')
    .insert(subskills.map((label, i) => ({ topic_test_id: test.id, label: label.trim(), sort_order: i })));

  if (subskillError) {
    await supabaseAdmin.from('topic_tests').delete().eq('id', test.id);
    return { success: false, error: 'Failed to create sub-skills.' };
  }

  return { success: true, test };
}

// ── Seed a fully predefined test from the catalog ────────────────
// Creates the test, its sub-skills, and every catalog question in one call.
// Predefined/catalog tests are always auto-graded — no manual marking step.

export interface SeedCatalogTestInput {
  school_id: number;
  teacher_id: number;
  subject_id: number;
  grade: number;
  term: number;
  topic: CatalogTopic;
  time_limit_seconds?: number;
}

export async function seedCatalogTest(input: SeedCatalogTestInput): Promise<TopicTestResult> {
  const { school_id, teacher_id, subject_id, grade, term, topic, time_limit_seconds = 600 } = input;

  if (topic.questions.length === 0) {
    return { success: false, error: `${topic.label} doesn't have a predefined question set yet.` };
  }

  const created = await createTopicTest({
    school_id, teacher_id, subject_id, grade, term,
    topic_key: topic.topicKey,
    title: topic.label,
    time_limit_seconds,
    grading_mode: 'auto',
    subskills: topic.subskills,
  });

  if (!created.success) return created;

  const { data: subskillRows } = await supabaseAdmin
    .from('topic_test_subskills')
    .select('id, label')
    .eq('topic_test_id', created.test.id);

  const subskillIdByLabel = new Map((subskillRows ?? []).map((s: any) => [s.label, s.id as number]));

  for (const q of topic.questions) {
    const subskill_id = subskillIdByLabel.get(q.subskillLabel);
    if (!subskill_id) continue;
    await addTopicTestQuestion({
      topic_test_id: created.test.id,
      subskill_id,
      question_type: q.question_type,
      prompt: q.prompt,
      options: q.options,
      correct_answer: q.correct_answer,
      answer_tolerance: q.answer_tolerance,
    });
  }

  return created;
}

export async function deleteTopicTest(topic_test_id: number, school_id: number): Promise<SimpleResult> {
  const { error } = await supabaseAdmin
    .from('topic_tests')
    .delete()
    .eq('id', topic_test_id)
    .eq('school_id', school_id);

  if (error) return { success: false, error: 'Failed to delete test.' };
  return { success: true };
}

// ── Questions ───────────────────────────────────────────────────

export interface AddQuestionInput {
  topic_test_id: number;
  subskill_id: number;
  question_type: QuestionType;
  prompt: string;
  options?: string[];
  correct_answer?: string; // required for mcq/short_answer, omitted for open_text
  answer_tolerance?: number;
}

export async function addTopicTestQuestion(input: AddQuestionInput): Promise<SimpleResult> {
  const { data: existing } = await supabaseAdmin
    .from('topic_test_questions')
    .select('id')
    .eq('topic_test_id', input.topic_test_id);

  const sort_order = existing?.length ?? 0;

  const { error } = await supabaseAdmin
    .from('topic_test_questions')
    .insert({
      topic_test_id: input.topic_test_id,
      subskill_id: input.subskill_id,
      question_type: input.question_type,
      prompt: input.prompt.trim(),
      options: input.question_type === 'mcq' ? (input.options ?? []) : null,
      correct_answer: input.question_type === 'open_text' ? null : (input.correct_answer ?? '').trim(),
      answer_tolerance: input.question_type === 'short_answer' ? (input.answer_tolerance ?? null) : null,
      sort_order,
    });

  if (error) return { success: false, error: 'Failed to add question.' };
  return { success: true };
}

export async function deleteTopicTestQuestion(question_id: number): Promise<SimpleResult> {
  const { error } = await supabaseAdmin.from('topic_test_questions').delete().eq('id', question_id);
  if (error) return { success: false, error: 'Failed to delete question.' };
  return { success: true };
}

// ── Assign a test to a class/subject/grade ─────────────────────

export interface AssignTopicTestInput {
  topic_test_id: number;
  teacher_id: number;
  school_id: number;
  subject_id: number;
  grade: number;
  closes_at?: string; // ISO timestamp, optional
}

export async function assignTopicTest(input: AssignTopicTestInput): Promise<SimpleResult> {
  const { error } = await supabaseAdmin
    .from('topic_test_assignments')
    .insert({
      topic_test_id: input.topic_test_id,
      teacher_id: input.teacher_id,
      school_id: input.school_id,
      subject_id: input.subject_id,
      grade: input.grade,
      closes_at: input.closes_at ?? null,
    });

  if (error) return { success: false, error: 'Failed to assign test.' };
  return { success: true };
}

export async function fetchTestAssignments(topic_test_id: number): Promise<TopicTestAssignment[]> {
  const { data } = await supabaseAdmin
    .from('topic_test_assignments')
    .select('*')
    .eq('topic_test_id', topic_test_id)
    .order('created_at', { ascending: false });
  return data ?? [];
}

export async function deactivateAssignment(assignment_id: number): Promise<SimpleResult> {
  const { error } = await supabaseAdmin
    .from('topic_test_assignments')
    .update({ is_active: false })
    .eq('id', assignment_id);
  if (error) return { success: false, error: 'Failed to update assignment.' };
  return { success: true };
}

// ── Student: fetch tests currently visible to them ──────────────
// A test is visible only if there's an active assignment matching the
// student's subject+grade, and now() is within opens_at/closes_at.

export interface StudentVisibleTest {
  assignment: TopicTestAssignment;
  test: TopicTest;
  attempted: boolean;
  attempt?: TopicTestAttempt;
}

// Convenience wrapper: derives the student's enrolled subject_ids from
// teacher_students, then fetches visible tests. Used by the student portal.
export async function fetchVisibleTestsForStudent(
  student_id: number,
  school_id: number,
  grade: number
): Promise<StudentVisibleTest[]> {
  const { data: links } = await supabaseAdmin
    .from('teacher_students')
    .select('subject_id')
    .eq('student_id', student_id);

  const subject_ids = [...new Set((links ?? []).map((l: any) => l.subject_id as number))];
  return fetchStudentVisibleTests(student_id, school_id, grade, subject_ids);
}

export async function fetchStudentVisibleTests(
  student_id: number,
  school_id: number,
  grade: number,
  subject_ids: number[]
): Promise<StudentVisibleTest[]> {
  if (subject_ids.length === 0) return [];

  const nowIso = new Date().toISOString();

  const { data: assignments } = await supabaseAdmin
    .from('topic_test_assignments')
    .select('*')
    .eq('school_id', school_id)
    .eq('grade', grade)
    .in('subject_id', subject_ids)
    .eq('is_active', true)
    .lte('opens_at', nowIso);

  if (!assignments || assignments.length === 0) return [];

  const openAssignments = assignments.filter((a: any) => !a.closes_at || a.closes_at > nowIso);
  if (openAssignments.length === 0) return [];

  const testIds = [...new Set(openAssignments.map((a: any) => a.topic_test_id as number))];
  const { data: tests } = await supabaseAdmin
    .from('topic_tests')
    .select('*')
    .in('id', testIds)
    .eq('is_active', true);
  const testMap = new Map((tests ?? []).map((t: any) => [t.id, t]));

  const assignmentIds = openAssignments.map((a: any) => a.id as number);
  const { data: attempts } = await supabaseAdmin
    .from('topic_test_attempts')
    .select('*')
    .eq('student_id', student_id)
    .in('assignment_id', assignmentIds);
  const attemptMap = new Map((attempts ?? []).map((a: any) => [a.assignment_id, a]));

  return openAssignments
    .filter((a: any) => testMap.has(a.topic_test_id))
    .map((a: any) => ({
      assignment: a,
      test: testMap.get(a.topic_test_id),
      attempted: attemptMap.has(a.id),
      attempt: attemptMap.get(a.id),
    }));
}

// ── Student: start an attempt ────────────────────────────────────

export type StartAttemptResult =
  | { success: true; attempt: TopicTestAttempt }
  | { success: false; error: string };

export async function startTopicTestAttempt(
  topic_test_id: number,
  assignment_id: number,
  student_id: number,
  school_id: number
): Promise<StartAttemptResult> {
  // One attempt per (assignment, student) — unique constraint backstops this.
  const { data: existing } = await supabaseAdmin
    .from('topic_test_attempts')
    .select('*')
    .eq('assignment_id', assignment_id)
    .eq('student_id', student_id)
    .maybeSingle();

  if (existing) return { success: true, attempt: existing };

  const { data: attempt, error } = await supabaseAdmin
    .from('topic_test_attempts')
    .insert({ topic_test_id, assignment_id, student_id, school_id })
    .select('*')
    .single();

  if (error || !attempt) return { success: false, error: error?.message ?? 'Failed to start test.' };
  return { success: true, attempt };
}

// ── Student: submit answers ───────────────────────────────────────
// Grades MCQ by exact match, short_answer by exact or numeric-tolerance match.
// Writes one topic_test_answers row per question and updates the attempt's score.

export interface SubmittedAnswer {
  question_id: number;
  subskill_id: number;
  student_answer: string;
}

// Returns null for open_text questions — those are never auto-graded,
// a teacher must mark them manually after submission.
export function gradeAnswer(question: TopicTestQuestion, studentAnswer: string): boolean | null {
  if (question.question_type === 'open_text') return null;

  const answer = studentAnswer.trim();
  if (answer === '') return false;

  if (question.question_type === 'mcq') {
    return answer === question.correct_answer;
  }

  // short_answer
  const correctAnswer = question.correct_answer ?? '';
  if (question.answer_tolerance != null) {
    const given = Number(answer);
    const correct = Number(correctAnswer);
    if (Number.isNaN(given) || Number.isNaN(correct)) return answer === correctAnswer;
    return Math.abs(given - correct) <= question.answer_tolerance;
  }
  return answer.toLowerCase() === correctAnswer.trim().toLowerCase();
}

export async function submitTopicTestAttempt(
  attempt_id: number,
  questions: TopicTestQuestion[],
  answers: SubmittedAnswer[],
  time_expired: boolean
): Promise<SimpleResult> {
  const questionMap = new Map(questions.map((q) => [q.id, q]));
  const nowIso = new Date().toISOString();

  const rows = answers.map((a) => {
    const q = questionMap.get(a.question_id);
    const graded = q ? gradeAnswer(q, a.student_answer) : false;
    return {
      attempt_id,
      question_id: a.question_id,
      subskill_id: a.subskill_id,
      student_answer: a.student_answer,
      is_correct: graded ?? false, // placeholder until manually marked
      graded_at: graded === null ? null : nowIso, // null = open_text, awaiting manual marking
    };
  });

  if (rows.length > 0) {
    const { error: answersError } = await supabaseAdmin.from('topic_test_answers').insert(rows);
    if (answersError) return { success: false, error: 'Failed to save answers.' };
  }

  const hasUngraded = rows.some((r) => r.graded_at === null);
  const gradedRows = rows.filter((r) => r.graded_at !== null);
  const correctCount = gradedRows.filter((r) => r.is_correct).length;
  // Score is provisional (auto-graded questions only) until manual marking completes.
  const score_pct = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;

  const { error } = await supabaseAdmin
    .from('topic_test_attempts')
    .update({
      submitted_at: nowIso,
      time_expired,
      score_pct,
      grading_complete: !hasUngraded,
    })
    .eq('id', attempt_id);

  if (error) return { success: false, error: 'Failed to submit test.' };
  return { success: true };
}

// ── Teacher: mark open_text answers, finalize score ──────────────

export async function markAnswer(answer_id: number, is_correct: boolean): Promise<SimpleResult> {
  const { error } = await supabaseAdmin
    .from('topic_test_answers')
    .update({ is_correct, graded_at: new Date().toISOString() })
    .eq('id', answer_id);

  if (error) return { success: false, error: 'Failed to save mark.' };
  return { success: true };
}

// Recomputes an attempt's score from all its answers and marks grading complete
// once every answer has a graded_at timestamp. Call after marking each answer.
export async function finalizeAttemptGrading(attempt_id: number): Promise<SimpleResult> {
  const { data: answers } = await supabaseAdmin
    .from('topic_test_answers')
    .select('is_correct, graded_at')
    .eq('attempt_id', attempt_id);

  if (!answers) return { success: false, error: 'Attempt not found.' };

  const allGraded = answers.every((a: any) => a.graded_at !== null);
  const correctCount = answers.filter((a: any) => a.is_correct).length;
  const score_pct = answers.length > 0 ? Math.round((correctCount / answers.length) * 100) : 0;

  const { error } = await supabaseAdmin
    .from('topic_test_attempts')
    .update({ score_pct, grading_complete: allGraded })
    .eq('id', attempt_id);

  if (error) return { success: false, error: 'Failed to update score.' };
  return { success: true };
}

// Fetches attempts still awaiting manual marking for a given test
// (grading_complete = false), with the student name and open_text answers joined.

export interface PendingMarkingAttempt {
  attempt: TopicTestAttempt;
  student_name: string;
  student_surname: string;
  answers: (TopicTestAnswer & { question: TopicTestQuestion; subskill_label: string })[];
}

export async function fetchPendingMarking(topic_test_id: number): Promise<PendingMarkingAttempt[]> {
  const { data: attempts } = await supabaseAdmin
    .from('topic_test_attempts')
    .select('*')
    .eq('topic_test_id', topic_test_id)
    .eq('grading_complete', false)
    .not('submitted_at', 'is', null);

  if (!attempts || attempts.length === 0) return [];

  const attemptIds = attempts.map((a: any) => a.id as number);
  const studentIds = [...new Set(attempts.map((a: any) => a.student_id as number))];

  const [{ data: students }, { data: answers }, { data: questions }, { data: subskills }] = await Promise.all([
    supabaseAdmin.from('students').select('id, name, surname').in('id', studentIds),
    supabaseAdmin.from('topic_test_answers').select('*').in('attempt_id', attemptIds),
    supabaseAdmin.from('topic_test_questions').select('*').eq('topic_test_id', topic_test_id),
    supabaseAdmin.from('topic_test_subskills').select('*').eq('topic_test_id', topic_test_id),
  ]);

  const studentMap = new Map((students ?? []).map((s: any) => [s.id, s]));
  const questionMap = new Map((questions ?? []).map((q: any) => [q.id, q]));
  const subskillMap = new Map((subskills ?? []).map((s: any) => [s.id, s.label]));
  const answersByAttempt = new Map<number, any[]>();
  for (const a of (answers ?? []) as any[]) {
    const list = answersByAttempt.get(a.attempt_id) ?? [];
    list.push(a);
    answersByAttempt.set(a.attempt_id, list);
  }

  return attempts
    .map((a: any) => {
      const student = studentMap.get(a.student_id);
      const myAnswers = (answersByAttempt.get(a.id) ?? [])
        .filter((ans) => questionMap.get(ans.question_id)?.question_type === 'open_text')
        .map((ans) => ({
          ...ans,
          question: questionMap.get(ans.question_id),
          subskill_label: subskillMap.get(ans.subskill_id) ?? 'Unknown',
        }));
      return {
        attempt: a,
        student_name: student?.name ?? 'Unknown',
        student_surname: student?.surname ?? '',
        answers: myAnswers,
      };
    })
    .filter((row) => row.answers.length > 0);
}

// ── Teacher: topic overview — sub-skill breakdown across a test ──

export interface SubskillBreakdown {
  subskill_id: number;
  label: string;
  correctCount: number;
  totalCount: number;
  correctPct: number;
}

export interface StudentResultRow {
  student_id: number;
  student_name: string;
  student_surname: string;
  score_pct: number | null;
  weakestSubskills: string[]; // labels of sub-skills this student got wrong
}

export interface TopicOverviewData {
  attemptedCount: number;
  totalAssigned: number;
  avgScore: number | null;
  subskills: SubskillBreakdown[];
  students: StudentResultRow[];
}

export async function fetchTopicOverview(topic_test_id: number): Promise<TopicOverviewData> {
  const { data: subskills } = await supabaseAdmin
    .from('topic_test_subskills')
    .select('*')
    .eq('topic_test_id', topic_test_id)
    .order('sort_order');

  const { data: attempts } = await supabaseAdmin
    .from('topic_test_attempts')
    .select('*')
    .eq('topic_test_id', topic_test_id)
    .not('submitted_at', 'is', null);

  const attemptList = attempts ?? [];
  const attemptIds = attemptList.map((a: any) => a.id as number);

  const { data: answers } = attemptIds.length > 0
    ? await supabaseAdmin.from('topic_test_answers').select('*').in('attempt_id', attemptIds)
    : { data: [] as any[] };

  const answerList = answers ?? [];

  // Sub-skill aggregation
  const subskillStats = new Map<number, { correct: number; total: number }>();
  for (const a of answerList as any[]) {
    const s = subskillStats.get(a.subskill_id) ?? { correct: 0, total: 0 };
    s.total += 1;
    if (a.is_correct) s.correct += 1;
    subskillStats.set(a.subskill_id, s);
  }

  const subskillBreakdown: SubskillBreakdown[] = (subskills ?? []).map((sk: any) => {
    const stat = subskillStats.get(sk.id) ?? { correct: 0, total: 0 };
    return {
      subskill_id: sk.id,
      label: sk.label,
      correctCount: stat.correct,
      totalCount: stat.total,
      correctPct: stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0,
    };
  });

  // Per-student rows
  const studentIds = [...new Set(attemptList.map((a: any) => a.student_id as number))];
  const { data: studentsData } = studentIds.length > 0
    ? await supabaseAdmin.from('students').select('id, name, surname').in('id', studentIds)
    : { data: [] as any[] };
  const studentMap = new Map((studentsData ?? []).map((s: any) => [s.id, s]));

  const subskillLabelMap = new Map((subskills ?? []).map((s: any) => [s.id, s.label]));
  const answersByAttempt = new Map<number, any[]>();
  for (const a of answerList as any[]) {
    const list = answersByAttempt.get(a.attempt_id) ?? [];
    list.push(a);
    answersByAttempt.set(a.attempt_id, list);
  }

  const students: StudentResultRow[] = attemptList.map((a: any) => {
    const student = studentMap.get(a.student_id);
    const myAnswers = answersByAttempt.get(a.id) ?? [];
    const weakestSubskills = [...new Set(
      myAnswers.filter((ans) => !ans.is_correct).map((ans) => subskillLabelMap.get(ans.subskill_id) ?? 'Unknown')
    )];
    return {
      student_id: a.student_id,
      student_name: student?.name ?? 'Unknown',
      student_surname: student?.surname ?? '',
      score_pct: a.score_pct,
      weakestSubskills,
    };
  });

  const scores = attemptList.map((a: any) => a.score_pct).filter((s: any) => s != null) as number[];
  const avgScore = scores.length > 0 ? Math.round(scores.reduce((s, v) => s + v, 0) / scores.length) : null;

  // Total assigned = distinct students in teacher_students matching the test's subject/grade
  const { data: test } = await supabaseAdmin.from('topic_tests').select('*').eq('id', topic_test_id).single();
  let totalAssigned = 0;
  if (test) {
    const { data: links } = await supabaseAdmin
      .from('teacher_students')
      .select('student_id, students(grade)')
      .eq('teacher_id', test.teacher_id)
      .eq('subject_id', test.subject_id);
    const matching = (links ?? []).filter((l: any) => l.students?.grade === test.grade);
    totalAssigned = new Set(matching.map((l: any) => l.student_id)).size;
  }

  return {
    attemptedCount: attemptList.length,
    totalAssigned,
    avgScore,
    subskills: subskillBreakdown,
    students,
  };
}
