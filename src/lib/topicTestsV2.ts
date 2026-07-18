// ── Topic Tests v2 — data access layer ───────────────────────────────────────
// Tables: topics, misconceptions, topic_tests, questions, topic_test_questions,
// distractor_misconceptions, student_attempts, attempt_answers.
// Scoring (Bayesian posterior/decay/mastery/retest scheduling) lives in
// topicTestScoring.ts as pure functions — this file only does I/O + orchestration.

import { supabaseAdmin } from './supabase';
import {
  computePosterior, applyDecay, deriveMasteryLevel, computeConfidenceBand,
  scheduleNextRetest, PRIOR_DEFAULT,
  type Difficulty, type AttemptPurpose, type MasteryLevel, type QuestionResult,
} from './topicTestScoring';
import { createNotification } from './notifications';

// ── Types ─────────────────────────────────────────────────────

export interface Topic {
  id: number;
  school_id: number | null;
  subject_id: number;
  grade: number;
  term: number;
  topic_key: string;
  label: string;
}

export interface Misconception {
  id: number;
  topic_id: number;
  code: string;
  label: string;
  description: string | null;
}

export interface QuestionOption {
  key: string;
  text: string;
}

export interface Question {
  id: number;
  topic_id: number;
  question_type: 'mcq' | 'short_answer';
  prompt: string;
  difficulty: Difficulty;
  options: QuestionOption[] | null;
  correct_answer: string;
  answer_tolerance: number | null;
  created_by: number | null;
}

export interface DistractorMisconception {
  id: number;
  question_id: number;
  option_key: string;
  misconception_id: number;
  cognitive_error_type: string | null;
  prevalence_pct: number | null;
  severity_weight: number;
  explanation_text: string | null;
}

export interface TopicTest {
  id: number;
  school_id: number | null;
  topic_id: number;
  teacher_id: number | null;
  title: string;
  test_purpose: AttemptPurpose;
  time_limit_minutes: number | null;
  is_prescribed: boolean;
}

export interface TopicTestFull extends TopicTest {
  questions: Question[];
}

export interface StudentAttempt {
  id: number;
  school_id: number;
  student_id: number;
  topic_test_id: number;
  topic_id: number;
  attempt_number: number;
  attempt_purpose: AttemptPurpose;
  started_at: string;
  submitted_at: string | null;
  prior_posterior: number;
  posterior_score: number | null;
  mastery_level: MasteryLevel | null;
  confidence_low: number | null;
  confidence_high: number | null;
  score_pct: number | null;
  next_retest_due_at: string | null;
  retest_confirmed_by: number | null;
  retest_confirmed_at: string | null;
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
}

export interface SubmittedAnswer {
  question_id: number;
  selected_option_key?: string;
  student_answer_text?: string;
  time_spent_sec?: number;
}

// ── Row mappers ───────────────────────────────────────────────

function rowToQuestion(r: any): Question {
  return {
    id: r.id, topic_id: r.topic_id, question_type: r.question_type, prompt: r.prompt,
    difficulty: r.difficulty, options: r.options ?? null, correct_answer: r.correct_answer,
    answer_tolerance: r.answer_tolerance ?? null, created_by: r.created_by ?? null,
  };
}

function rowToAttempt(r: any): StudentAttempt {
  return {
    id: r.id, school_id: r.school_id, student_id: r.student_id, topic_test_id: r.topic_test_id,
    topic_id: r.topic_id, attempt_number: r.attempt_number, attempt_purpose: r.attempt_purpose,
    started_at: r.started_at, submitted_at: r.submitted_at, prior_posterior: r.prior_posterior,
    posterior_score: r.posterior_score, mastery_level: r.mastery_level,
    confidence_low: r.confidence_low, confidence_high: r.confidence_high, score_pct: r.score_pct,
    next_retest_due_at: r.next_retest_due_at,
    retest_confirmed_by: r.retest_confirmed_by ?? null, retest_confirmed_at: r.retest_confirmed_at ?? null,
  };
}

function rowToAssignment(r: any): TopicTestAssignment {
  return {
    id: r.id, topic_test_id: r.topic_test_id, teacher_id: r.teacher_id, school_id: r.school_id,
    subject_id: r.subject_id, grade: r.grade, opens_at: r.opens_at, closes_at: r.closes_at ?? null,
    is_active: r.is_active,
  };
}

// ── Catalog reads ─────────────────────────────────────────────

export async function fetchTopicByKey(topicKey: string): Promise<Topic | null> {
  const { data, error } = await supabaseAdmin
    .from('topics').select('*').eq('topic_key', topicKey).maybeSingle();
  if (error || !data) return null;
  return data as Topic;
}

export async function fetchPrescribedTests(topicId: number, purpose?: AttemptPurpose): Promise<TopicTest[]> {
  let q = supabaseAdmin.from('topic_tests').select('*').eq('topic_id', topicId).eq('is_prescribed', true);
  if (purpose) q = q.eq('test_purpose', purpose);
  const { data, error } = await q;
  if (error || !data) return [];
  return data as TopicTest[];
}

export interface VisibleTest {
  test: TopicTest;
  topic: Topic;
  questionCount: number;
  assignmentId: number;
}

// A test is visible to a student only if a teacher has explicitly assigned it
// (topic_test_assignments row) for a subject the student is actually taking
// (via teacher_students) and grade, within the open/close window, is_active.
// No assignment row = invisible, full stop — matches the original v1 design intent.
export async function fetchVisibleTestsForStudent(studentId: number, grade: number, now: Date = new Date()): Promise<VisibleTest[]> {
  const { data: subjectLinks } = await supabaseAdmin
    .from('teacher_students').select('subject_id').eq('student_id', studentId);
  const studentSubjectIds = Array.from(new Set((subjectLinks ?? []).map((l: any) => l.subject_id)));
  if (studentSubjectIds.length === 0) return [];

  const nowIso = now.toISOString();
  const { data: assignments, error: assignErr } = await supabaseAdmin
    .from('topic_test_assignments')
    .select('*')
    .eq('grade', grade)
    .eq('is_active', true)
    .in('subject_id', studentSubjectIds)
    .lte('opens_at', nowIso)
    .or(`closes_at.is.null,closes_at.gte.${nowIso}`);
  if (assignErr || !assignments || assignments.length === 0) return [];

  const testIds = Array.from(new Set(assignments.map((a: any) => a.topic_test_id)));
  const { data: tests, error: testsErr } = await supabaseAdmin
    .from('topic_tests').select('*').in('id', testIds);
  if (testsErr || !tests) return [];

  const topicIds = Array.from(new Set(tests.map((t: any) => t.topic_id)));
  const { data: topics } = await supabaseAdmin.from('topics').select('*').in('id', topicIds);
  const topicById = new Map((topics ?? []).map((t: any) => [t.id, t as Topic]));

  const { data: links } = await supabaseAdmin
    .from('topic_test_questions').select('topic_test_id').in('topic_test_id', testIds);
  const countByTest = new Map<number, number>();
  for (const l of links ?? []) countByTest.set(l.topic_test_id, (countByTest.get(l.topic_test_id) ?? 0) + 1);

  const assignmentByTest = new Map(assignments.map((a: any) => [a.topic_test_id, a]));

  return tests.map((t: any) => ({
    test: t as TopicTest,
    topic: topicById.get(t.topic_id)!,
    questionCount: countByTest.get(t.id) ?? 0,
    assignmentId: assignmentByTest.get(t.id)!.id,
  }));
}

// ── Teacher assignment CRUD ────────────────────────────────────

export async function assignTopicTest(
  topicTestId: number, teacherId: number, schoolId: number, subjectId: number, grade: number,
  opensAt?: Date, closesAt?: Date,
): Promise<TopicTestAssignment | null> {
  const { data, error } = await supabaseAdmin
    .from('topic_test_assignments')
    .insert({
      topic_test_id: topicTestId, teacher_id: teacherId, school_id: schoolId, subject_id: subjectId, grade,
      opens_at: (opensAt ?? new Date()).toISOString(), closes_at: closesAt ? closesAt.toISOString() : null,
    })
    .select('*').single();
  if (error || !data) { console.error('[topicTestsV2] assignTopicTest error:', error?.message); return null; }
  return rowToAssignment(data);
}

export async function fetchTeacherAssignments(teacherId: number): Promise<TopicTestAssignment[]> {
  const { data, error } = await supabaseAdmin
    .from('topic_test_assignments').select('*').eq('teacher_id', teacherId).order('assigned_at', { ascending: false });
  if (error || !data) return [];
  return data.map(rowToAssignment);
}

export async function deactivateAssignment(assignmentId: number): Promise<void> {
  await supabaseAdmin.from('topic_test_assignments').update({ is_active: false }).eq('id', assignmentId);
}

export interface AssignmentStudentRow {
  student_id: number;
  name: string;
  surname: string;
  student_code: string;
  latestAttempt: StudentAttempt | null;
}

// All students in an assignment's subject/grade group (via teacher_students),
// with their latest attempt on that assignment's test, if any — powers the
// per-assignment detail view a teacher opens by clicking the assignment card.
export async function fetchAssignmentStudents(assignment: TopicTestAssignment): Promise<AssignmentStudentRow[]> {
  const { data: links } = await supabaseAdmin
    .from('teacher_students')
    .select('student_id')
    .eq('teacher_id', assignment.teacher_id)
    .eq('subject_id', assignment.subject_id);
  const studentIds = Array.from(new Set((links ?? []).map((l: any) => l.student_id)));
  if (studentIds.length === 0) return [];

  const { data: students } = await supabaseAdmin
    .from('students').select('id, name, surname, student_code, grade').in('id', studentIds).eq('grade', assignment.grade);
  if (!students || students.length === 0) return [];

  // Prefer submitted attempts (most recently submitted) as "latest" — an
  // abandoned/unsubmitted attempt shouldn't hide a real completed one just
  // because it happened to start after it.
  const { data: attempts } = await supabaseAdmin
    .from('student_attempts').select('*').eq('topic_test_id', assignment.topic_test_id)
    .in('student_id', students.map((s: any) => s.id))
    .order('submitted_at', { ascending: false, nullsFirst: false })
    .order('started_at', { ascending: false });

  const latestByStudent = new Map<number, StudentAttempt>();
  for (const a of attempts ?? []) {
    const existing = latestByStudent.get(a.student_id);
    if (!existing) { latestByStudent.set(a.student_id, rowToAttempt(a)); continue; }
    // if we already have a submitted attempt, don't let a later-started but
    // unsubmitted one replace it
    if (existing.submitted_at && !a.submitted_at) continue;
    if (!existing.submitted_at && a.submitted_at) latestByStudent.set(a.student_id, rowToAttempt(a));
  }

  return students
    .map((s: any) => ({
      student_id: s.id, name: s.name, surname: s.surname, student_code: s.student_code,
      latestAttempt: latestByStudent.get(s.id) ?? null,
    }))
    .sort((a, b) => a.surname.localeCompare(b.surname));
}

export interface MisconceptionFrequency {
  misconception_id: number;
  label: string;
  count: number;
  pctOfClass: number; // % of students (with an attempt) who hit this misconception at least once
}

// Aggregates misconceptions across an assignment's students' latest attempts —
// "which wrong-answer patterns show up most in this class" for the class
// dashboard. Counts each misconception once per student (not per question) so
// a student who repeats the same error across multiple questions doesn't
// dominate the ranking.
export async function fetchAssignmentMisconceptionBreakdown(assignment: TopicTestAssignment): Promise<MisconceptionFrequency[]> {
  const students = await fetchAssignmentStudents(assignment);
  const attemptedStudents = students.filter((s) => s.latestAttempt);
  if (attemptedStudents.length === 0) return [];

  const attemptIds = attemptedStudents.map((s) => s.latestAttempt!.id);
  const { data: answers } = await supabaseAdmin
    .from('attempt_answers').select('attempt_id, misconception_id').in('attempt_id', attemptIds)
    .not('misconception_id', 'is', null);
  if (!answers || answers.length === 0) return [];

  // dedupe per (attempt, misconception) so repeats within one attempt count once
  const seenPerAttempt = new Set<string>();
  const countByMisconception = new Map<number, number>();
  for (const a of answers as any[]) {
    const key = `${a.attempt_id}::${a.misconception_id}`;
    if (seenPerAttempt.has(key)) continue;
    seenPerAttempt.add(key);
    countByMisconception.set(a.misconception_id, (countByMisconception.get(a.misconception_id) ?? 0) + 1);
  }

  const misconceptionIds = Array.from(countByMisconception.keys());
  const { data: misconceptions } = await supabaseAdmin.from('misconceptions').select('id, label').in('id', misconceptionIds);
  const labelById = new Map((misconceptions ?? []).map((m: any) => [m.id, m.label]));

  return Array.from(countByMisconception.entries())
    .map(([misconceptionId, count]) => ({
      misconception_id: misconceptionId,
      label: labelById.get(misconceptionId) ?? `Misconception #${misconceptionId}`,
      count,
      pctOfClass: Math.round((count / attemptedStudents.length) * 100),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);
}

export interface TeacherSubjectGrade {
  subject_id: number;
  subject_label: string;
  grade: number;
}

// Distinct (subject, grade) combos this teacher actually teaches, derived from
// teacher_students — used to populate the assign-test subject/grade picker.
export async function fetchTeacherSubjectGrades(teacherId: number): Promise<TeacherSubjectGrade[]> {
  const { data: links } = await supabaseAdmin
    .from('teacher_students').select('subject_id, subjects(id, label), student_id, students(grade)').eq('teacher_id', teacherId);
  if (!links) return [];

  const seen = new Map<string, TeacherSubjectGrade>();
  for (const l of links as any[]) {
    const subjectId = l.subject_id;
    const subjectLabel = l.subjects?.label ?? '';
    const grade = l.students?.grade;
    if (!subjectId || grade == null) continue;
    const key = `${subjectId}-${grade}`;
    if (!seen.has(key)) seen.set(key, { subject_id: subjectId, subject_label: subjectLabel, grade });
  }
  return Array.from(seen.values()).sort((a, b) => a.grade - b.grade || a.subject_label.localeCompare(b.subject_label));
}

// Deletes a test entirely — cascades to topic_test_questions, topic_test_assignments,
// student_attempts, and attempt_answers via ON DELETE CASCADE. Does not touch the
// underlying questions/misconceptions (those stay in the reusable per-topic bank).
export async function deleteTopicTest(topicTestId: number): Promise<boolean> {
  const { error } = await supabaseAdmin.from('topic_tests').delete().eq('id', topicTestId);
  if (error) { console.error('[topicTestsV2] deleteTopicTest error:', error.message); return false; }
  return true;
}

// All prescribed + teacher-authored tests, for the assign picker.
export interface TopicTestWithTopic extends TopicTest {
  topic_label: string;
  grade: number;
  term: number;
  subject_label: string;
}

export async function fetchAllTopicTests(): Promise<TopicTestWithTopic[]> {
  const { data: tests } = await supabaseAdmin.from('topic_tests').select('*');
  if (!tests) return [];
  const topicIds = Array.from(new Set(tests.map((t: any) => t.topic_id)));
  const { data: topics } = await supabaseAdmin.from('topics').select('id, label, grade, term, subject_id').in('id', topicIds);
  const subjectIds = Array.from(new Set((topics ?? []).map((t: any) => t.subject_id)));
  const { data: subjects } = await supabaseAdmin.from('subjects').select('id, label').in('id', subjectIds);
  const subjectLabelById = new Map((subjects ?? []).map((s: any) => [s.id, s.label]));
  const topicById = new Map((topics ?? []).map((t: any) => [t.id, t]));

  return tests.map((t: any) => {
    const topic = topicById.get(t.topic_id);
    return {
      ...(t as TopicTest),
      topic_label: topic?.label ?? '',
      grade: topic?.grade ?? 0,
      term: topic?.term ?? 0,
      subject_label: subjectLabelById.get(topic?.subject_id) ?? '',
    };
  });
}

export async function fetchTopicTestFull(topicTestId: number): Promise<TopicTestFull | null> {
  const { data: test, error: testErr } = await supabaseAdmin
    .from('topic_tests').select('*').eq('id', topicTestId).maybeSingle();
  if (testErr || !test) return null;

  const { data: links, error: linkErr } = await supabaseAdmin
    .from('topic_test_questions').select('question_id, order_index').eq('topic_test_id', topicTestId)
    .order('order_index', { ascending: true });
  if (linkErr || !links) return { ...(test as TopicTest), questions: [] };

  const questionIds = links.map((l: any) => l.question_id);
  if (questionIds.length === 0) return { ...(test as TopicTest), questions: [] };

  const { data: qRows, error: qErr } = await supabaseAdmin
    .from('questions').select('*').in('id', questionIds);
  if (qErr || !qRows) return { ...(test as TopicTest), questions: [] };

  const byId = new Map(qRows.map((r: any) => [r.id, rowToQuestion(r)]));
  const ordered = links.map((l: any) => byId.get(l.question_id)).filter(Boolean) as Question[];

  return { ...(test as TopicTest), questions: ordered };
}

export async function fetchDistractorMisconceptions(questionIds: number[]): Promise<DistractorMisconception[]> {
  if (questionIds.length === 0) return [];
  const { data, error } = await supabaseAdmin
    .from('distractor_misconceptions').select('*').in('question_id', questionIds);
  if (error || !data) return [];
  return data as DistractorMisconception[];
}

// ── Teacher authoring: topics, question bank, misconceptions ───

export async function fetchTopicsForSubjectGrade(subjectId: number, grade: number): Promise<Topic[]> {
  const { data, error } = await supabaseAdmin
    .from('topics').select('*').eq('subject_id', subjectId).eq('grade', grade).order('label');
  if (error || !data) return [];
  return data as Topic[];
}

export async function fetchMisconceptions(topicId: number): Promise<Misconception[]> {
  const { data, error } = await supabaseAdmin
    .from('misconceptions').select('*').eq('topic_id', topicId).order('label');
  if (error || !data) return [];
  return data as Misconception[];
}

export async function createMisconception(topicId: number, code: string, label: string, description?: string): Promise<Misconception | null> {
  const { data, error } = await supabaseAdmin
    .from('misconceptions').insert({ topic_id: topicId, code, label, description: description ?? null }).select('*').single();
  if (error || !data) { console.error('[topicTestsV2] createMisconception error:', error?.message); return null; }
  return data as Misconception;
}

// Full reusable question bank for a topic — every question ever authored for
// it, regardless of which test(s) currently include it. Powers the bank
// picker in the test-builder UI.
export async function fetchQuestionBank(topicId: number): Promise<Question[]> {
  const { data, error } = await supabaseAdmin
    .from('questions').select('*').eq('topic_id', topicId).order('id');
  if (error || !data) return [];
  return data.map(rowToQuestion);
}

export interface CreateQuestionInput {
  topicId: number;
  questionType: 'mcq' | 'short_answer';
  prompt: string;
  difficulty: Difficulty;
  options?: QuestionOption[];
  correctAnswer: string;
  answerTolerance?: number;
  createdBy?: number;
  distractors?: Array<{
    optionKey: string; misconceptionId: number; cognitiveErrorType?: string;
    severityWeight?: number; explanationText?: string;
  }>;
}

// Adds a question to the reusable per-topic bank (not tied to any test yet —
// it's attached to a test separately via addQuestionsToTest). Teacher-authored
// questions get created_by set; distractor misconception tags are optional and
// can be added/edited later via tagDistractor.
export async function createQuestion(input: CreateQuestionInput): Promise<Question | null> {
  const { data, error } = await supabaseAdmin
    .from('questions')
    .insert({
      topic_id: input.topicId, question_type: input.questionType, prompt: input.prompt,
      difficulty: input.difficulty, options: input.options ?? null, correct_answer: input.correctAnswer,
      answer_tolerance: input.answerTolerance ?? null, created_by: input.createdBy ?? null,
    })
    .select('*').single();
  if (error || !data) { console.error('[topicTestsV2] createQuestion error:', error?.message); return null; }

  const question = rowToQuestion(data);
  if (input.distractors && input.distractors.length > 0) {
    const rows = input.distractors.map((d) => ({
      question_id: question.id, option_key: d.optionKey, misconception_id: d.misconceptionId,
      cognitive_error_type: d.cognitiveErrorType ?? null, severity_weight: d.severityWeight ?? 0.2,
      explanation_text: d.explanationText ?? null,
    }));
    const { error: distErr } = await supabaseAdmin.from('distractor_misconceptions').insert(rows);
    if (distErr) console.error('[topicTestsV2] createQuestion distractors error:', distErr.message);
  }

  return question;
}

export async function tagDistractor(
  questionId: number, optionKey: string, misconceptionId: number,
  cognitiveErrorType?: string, severityWeight?: number, explanationText?: string,
): Promise<boolean> {
  const { error } = await supabaseAdmin
    .from('distractor_misconceptions')
    .upsert(
      {
        question_id: questionId, option_key: optionKey, misconception_id: misconceptionId,
        cognitive_error_type: cognitiveErrorType ?? null, severity_weight: severityWeight ?? 0.2,
        explanation_text: explanationText ?? null,
      },
      { onConflict: 'question_id,option_key' },
    );
  if (error) { console.error('[topicTestsV2] tagDistractor error:', error.message); return false; }
  return true;
}

export async function deleteQuestion(questionId: number): Promise<boolean> {
  const { error } = await supabaseAdmin.from('questions').delete().eq('id', questionId);
  if (error) { console.error('[topicTestsV2] deleteQuestion error:', error.message); return false; }
  return true;
}

// ── Teacher authoring: building a test from the bank ────────────

export interface CreateTestInput {
  topicId: number;
  teacherId: number;
  schoolId: number;
  title: string;
  testPurpose: AttemptPurpose;
  timeLimitMinutes?: number;
  questionIds: number[]; // in desired order
}

export async function createTopicTest(input: CreateTestInput): Promise<TopicTest | null> {
  const { data, error } = await supabaseAdmin
    .from('topic_tests')
    .insert({
      topic_id: input.topicId, teacher_id: input.teacherId, school_id: input.schoolId,
      title: input.title, test_purpose: input.testPurpose, time_limit_minutes: input.timeLimitMinutes ?? 20,
      is_prescribed: false,
    })
    .select('*').single();
  if (error || !data) { console.error('[topicTestsV2] createTopicTest error:', error?.message); return null; }

  const test = data as TopicTest;
  if (input.questionIds.length > 0) {
    const links = input.questionIds.map((qid, idx) => ({ topic_test_id: test.id, question_id: qid, order_index: idx + 1 }));
    const { error: linkErr } = await supabaseAdmin.from('topic_test_questions').insert(links);
    if (linkErr) console.error('[topicTestsV2] createTopicTest question links error:', linkErr.message);
  }

  return test;
}

// ── Attempt lifecycle ─────────────────────────────────────────

export async function startAttempt(
  studentId: number,
  schoolId: number,
  topicTestId: number,
  topicId: number,
  attemptPurpose: AttemptPurpose,
): Promise<StudentAttempt | null> {
  // attempt_number must be unique per student+topic regardless of whether prior
  // attempts were ever submitted (an abandoned/unsubmitted attempt still
  // consumes a number) — otherwise two attempts can collide on the same number.
  const { data: allPriorRows } = await supabaseAdmin
    .from('student_attempts')
    .select('attempt_number')
    .eq('student_id', studentId).eq('topic_id', topicId)
    .order('attempt_number', { ascending: false })
    .limit(1);
  const attemptNumber = allPriorRows && allPriorRows.length > 0 ? (allPriorRows[0] as any).attempt_number + 1 : 1;

  // prior posterior = decayed score from the most recent SUBMITTED attempt only
  // (an abandoned attempt has no score to decay from).
  const { data: lastSubmittedRows } = await supabaseAdmin
    .from('student_attempts')
    .select('posterior_score, submitted_at')
    .eq('student_id', studentId).eq('topic_id', topicId)
    .not('submitted_at', 'is', null)
    .order('submitted_at', { ascending: false })
    .limit(1);

  let priorPosterior = PRIOR_DEFAULT;
  if (lastSubmittedRows && lastSubmittedRows.length > 0) {
    const last = lastSubmittedRows[0] as any;
    priorPosterior = applyDecay(last.posterior_score ?? PRIOR_DEFAULT, new Date(last.submitted_at), new Date());
  }

  const { data, error } = await supabaseAdmin
    .from('student_attempts')
    .insert({
      school_id: schoolId, student_id: studentId, topic_test_id: topicTestId, topic_id: topicId,
      attempt_number: attemptNumber, attempt_purpose: attemptPurpose, prior_posterior: priorPosterior,
    })
    .select('*').single();

  if (error || !data) { console.error('[topicTestsV2] startAttempt error:', error?.message); return null; }
  return rowToAttempt(data);
}

export async function submitAttempt(
  attemptId: number,
  questions: Question[],
  answers: SubmittedAnswer[],
  distractorMisconceptions: DistractorMisconception[],
): Promise<StudentAttempt | null> {
  const { data: attemptRow, error: attemptErr } = await supabaseAdmin
    .from('student_attempts').select('*').eq('id', attemptId).maybeSingle();
  if (attemptErr || !attemptRow) return null;
  const attempt = rowToAttempt(attemptRow);

  const answerByQuestion = new Map(answers.map((a) => [a.question_id, a]));
  const distractorLookup = new Map(
    distractorMisconceptions.map((d) => [`${d.question_id}::${d.option_key}`, d]),
  );

  const questionResults: QuestionResult[] = [];
  let correctCount = 0;
  const answerRows: any[] = [];

  for (const q of questions) {
    const submitted = answerByQuestion.get(q.id);
    const isCorrect = gradeAnswer(q, submitted);
    if (isCorrect) correctCount += 1;
    questionResults.push({ correct: isCorrect, difficulty: q.difficulty });

    let misconceptionId: number | null = null;
    if (!isCorrect && q.question_type === 'mcq' && submitted?.selected_option_key) {
      const d = distractorLookup.get(`${q.id}::${submitted.selected_option_key}`);
      misconceptionId = d?.misconception_id ?? null;
    }

    answerRows.push({
      attempt_id: attemptId,
      question_id: q.id,
      selected_option_key: submitted?.selected_option_key ?? null,
      student_answer_text: submitted?.student_answer_text ?? null,
      is_correct: isCorrect,
      misconception_id: misconceptionId,
      time_spent_sec: submitted?.time_spent_sec ?? null,
    });
  }

  await supabaseAdmin.from('attempt_answers').insert(answerRows);

  const rawPosterior = computePosterior(attempt.prior_posterior, questionResults);
  const submittedAt = new Date();
  const decayedNow = applyDecay(rawPosterior, submittedAt, submittedAt); // no elapsed time yet, effectively rawPosterior
  const masteryLevel = deriveMasteryLevel(decayedNow);
  const { low, high } = computeConfidenceBand(decayedNow, questions.length);
  const scorePct = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
  const { nextPurpose, dueAt } = scheduleNextRetest(attempt.attempt_purpose, submittedAt, decayedNow);

  const { data: updated, error: updateErr } = await supabaseAdmin
    .from('student_attempts')
    .update({
      submitted_at: submittedAt.toISOString(),
      posterior_score: decayedNow,
      mastery_level: masteryLevel,
      confidence_low: low,
      confidence_high: high,
      score_pct: scorePct,
      next_retest_due_at: dueAt.toISOString(),
    })
    .eq('id', attemptId)
    .select('*').single();

  if (updateErr || !updated) { console.error('[topicTestsV2] submitAttempt error:', updateErr?.message); return null; }

  // The next retest is computed and stored (next_retest_due_at/nextPurpose) but
  // NOT confirmed or notified yet — a teacher must approve it via confirmRetest()
  // before the student sees it as due or gets notified. This keeps retest
  // scheduling teacher-in-the-loop rather than fully automatic.

  return rowToAttempt(updated);
}

// A teacher reviews the system-suggested next retest and approves it (optionally
// adjusting the due date) before the student is notified or sees it as due.
export async function confirmRetest(attemptId: number, teacherId: number, dueAt?: Date): Promise<StudentAttempt | null> {
  const { data: attemptRow, error: fetchErr } = await supabaseAdmin
    .from('student_attempts').select('*').eq('id', attemptId).maybeSingle();
  if (fetchErr || !attemptRow) return null;
  const attempt = rowToAttempt(attemptRow);
  if (!attempt.next_retest_due_at) return null;

  const finalDueAt = dueAt ?? new Date(attempt.next_retest_due_at);

  const { data: updated, error: updateErr } = await supabaseAdmin
    .from('student_attempts')
    .update({
      next_retest_due_at: finalDueAt.toISOString(),
      retest_confirmed_by: teacherId,
      retest_confirmed_at: new Date().toISOString(),
    })
    .eq('id', attemptId)
    .select('*').single();
  if (updateErr || !updated) { console.error('[topicTestsV2] confirmRetest error:', updateErr?.message); return null; }

  const { data: student } = await supabaseAdmin.from('students').select('school_id').eq('id', attempt.student_id).maybeSingle();
  const { data: topicRow } = await supabaseAdmin.from('topics').select('label').eq('id', attempt.topic_id).maybeSingle();
  if (student && topicRow) {
    createNotification(
      student.school_id, 'student', attempt.student_id,
      `Review due: ${(topicRow as any).label}`,
      `Your teacher has scheduled a review for ${finalDueAt.toLocaleDateString()}.`,
    );
  }

  return rowToAttempt(updated);
}

// Attempts with a system-suggested retest that a teacher hasn't reviewed yet.
export async function fetchPendingRetestConfirmations(teacherId: number, schoolId: number): Promise<StudentAttempt[]> {
  const { data, error } = await supabaseAdmin
    .from('student_attempts').select('*').eq('school_id', schoolId)
    .not('next_retest_due_at', 'is', null)
    .is('retest_confirmed_at', null)
    .order('submitted_at', { ascending: false });
  if (error || !data) return [];
  return data.map(rowToAttempt);
}

// Bulk-confirms every pending retest for students within an assignment's
// subject/grade group (via teacher_students) — one action approves the whole
// class/grade rather than confirming attempt-by-attempt.
export async function confirmRetestsForAssignment(assignment: TopicTestAssignment, teacherId: number): Promise<number> {
  const { data: links } = await supabaseAdmin
    .from('teacher_students').select('student_id')
    .eq('teacher_id', assignment.teacher_id).eq('subject_id', assignment.subject_id);
  const studentIds = Array.from(new Set((links ?? []).map((l: any) => l.student_id)));
  if (studentIds.length === 0) return 0;

  const { data: pending } = await supabaseAdmin
    .from('student_attempts').select('*')
    .eq('topic_test_id', assignment.topic_test_id)
    .in('student_id', studentIds)
    .not('next_retest_due_at', 'is', null)
    .is('retest_confirmed_at', null);
  if (!pending || pending.length === 0) return 0;

  const nowIso = new Date().toISOString();
  const { error } = await supabaseAdmin
    .from('student_attempts')
    .update({ retest_confirmed_by: teacherId, retest_confirmed_at: nowIso })
    .in('id', pending.map((p: any) => p.id));
  if (error) { console.error('[topicTestsV2] confirmRetestsForAssignment error:', error.message); return 0; }

  const { data: topicRow } = await supabaseAdmin.from('topics').select('label').eq('id', (pending[0] as any).topic_id).maybeSingle();
  const topicLabel = (topicRow as any)?.label ?? 'your topic test';
  for (const p of pending as any[]) {
    const { data: student } = await supabaseAdmin.from('students').select('school_id').eq('id', p.student_id).maybeSingle();
    if (student) {
      createNotification(
        student.school_id, 'student', p.student_id,
        `Review due: ${topicLabel}`,
        `Your teacher has scheduled a review for ${new Date(p.next_retest_due_at).toLocaleDateString()}.`,
      );
    }
  }

  return pending.length;
}

// Removes a single attempt record entirely (answers cascade) — used to clean up
// stray/test data rather than as a normal student-facing action.
export async function dismissAttempt(attemptId: number): Promise<boolean> {
  const { error } = await supabaseAdmin.from('student_attempts').delete().eq('id', attemptId);
  if (error) { console.error('[topicTestsV2] dismissAttempt error:', error.message); return false; }
  return true;
}

function gradeAnswer(q: Question, submitted?: SubmittedAnswer): boolean {
  if (!submitted) return false;
  if (q.question_type === 'mcq') {
    return submitted.selected_option_key === q.correct_answer;
  }
  // short_answer: exact match (case-insensitive) unless tolerance is set
  const given = (submitted.student_answer_text ?? '').trim();
  if (q.answer_tolerance != null) {
    const givenNum = Number(given);
    const targetNum = Number(q.correct_answer);
    if (Number.isNaN(givenNum) || Number.isNaN(targetNum)) return false;
    return Math.abs(givenNum - targetNum) <= q.answer_tolerance;
  }
  return given.toLowerCase() === q.correct_answer.trim().toLowerCase();
}

// ── Student-facing reads ─────────────────────────────────────

export async function fetchStudentAttempts(studentId: number, topicId: number): Promise<StudentAttempt[]> {
  const { data, error } = await supabaseAdmin
    .from('student_attempts').select('*').eq('student_id', studentId).eq('topic_id', topicId)
    .order('attempt_number', { ascending: true });
  if (error || !data) return [];
  return data.map(rowToAttempt);
}

// Only counts retests a teacher has actually confirmed — an unconfirmed
// system-suggested date is not "due" from the student's point of view.
export async function fetchDueRetests(studentId: number, now: Date = new Date()): Promise<StudentAttempt[]> {
  const { data, error } = await supabaseAdmin
    .from('student_attempts').select('*').eq('student_id', studentId)
    .not('next_retest_due_at', 'is', null)
    .not('retest_confirmed_at', 'is', null)
    .lte('next_retest_due_at', now.toISOString())
    .order('next_retest_due_at', { ascending: true });
  if (error || !data) return [];
  return data.map(rowToAttempt);
}
