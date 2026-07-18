import { useState, useEffect } from 'react';
import { ClipboardCheck, Send, CheckCircle2, ChevronRight, ArrowLeft, Trash2, CircleDashed, X, Plus, Check, Sparkles, Eye } from 'lucide-react';
import { Shimmer } from '../../../shared/components/Shimmer';
import type { TeacherSession } from '../../../lib/auth';
import {
  fetchAllTopicTests, fetchTeacherSubjectGrades, assignTopicTest, fetchTeacherAssignments,
  deactivateAssignment, fetchAssignmentStudents, confirmRetestsForAssignment, dismissAttempt,
  fetchTopicsForSubjectGrade, fetchQuestionBank, fetchMisconceptions, createMisconception,
  createQuestion, createTopicTest, fetchAssignmentMisconceptionBreakdown, fetchTopicTestFull,
  fetchDistractorMisconceptions,
  type TopicTest, type TeacherSubjectGrade, type TopicTestAssignment, type TopicTestWithTopic,
  type AssignmentStudentRow, type Topic, type Question, type Misconception, type QuestionOption,
  type MisconceptionFrequency, type TopicTestFull, type DistractorMisconception,
} from '../../../lib/topicTestsV2';
import { MASTERY_LABEL, MASTERY_COLOR, type AttemptPurpose, type Difficulty, type MasteryLevel } from '../../../lib/topicTestScoring';

const FLAG_THRESHOLD = 0.70; // posterior below this = flagged for intervention, per research spec

interface TopicTestsV2PageProps { session: TeacherSession; }

export default function TopicTestsV2Page({ session }: TopicTestsV2PageProps) {
  const [loading, setLoading] = useState(true);
  const [tests, setTests] = useState<TopicTestWithTopic[]>([]);
  const [subjectGrades, setSubjectGrades] = useState<TeacherSubjectGrade[]>([]);
  const [assignments, setAssignments] = useState<TopicTestAssignment[]>([]);
  const [assignModalTest, setAssignModalTest] = useState<TopicTestWithTopic | null>(null);
  const [previewTest, setPreviewTest] = useState<TopicTestWithTopic | null>(null);
  const [openAssignment, setOpenAssignment] = useState<TopicTestAssignment | null>(null);
  const [building, setBuilding] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  async function reload() {
    const [t, sg, a] = await Promise.all([
      fetchAllTopicTests(),
      fetchTeacherSubjectGrades(session.teacher_id),
      fetchTeacherAssignments(session.teacher_id),
    ]);
    setTests(t);
    setSubjectGrades(sg);
    setAssignments(a);
  }

  useEffect(() => {
    setLoading(true);
    reload().finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <Shimmer className="h-24 w-full" />
        <Shimmer className="h-40 w-full" />
      </div>
    );
  }

  if (openAssignment) {
    const test = tests.find((t) => t.id === openAssignment.topic_test_id);
    const sg = subjectGrades.find((s) => s.subject_id === openAssignment.subject_id);
    return (
      <AssignmentDetail
        assignment={openAssignment}
        testTitle={test?.title ?? `Test #${openAssignment.topic_test_id}`}
        subjectLabel={sg?.subject_label ?? 'Subject'}
        onBack={() => setOpenAssignment(null)}
        onRemoved={() => { setOpenAssignment(null); reload(); }}
      />
    );
  }

  if (building) {
    return (
      <BuildTestPage
        session={session}
        subjectGrades={subjectGrades}
        onBack={() => setBuilding(false)}
        onCreated={() => { setBuilding(false); reload(); }}
      />
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ClipboardCheck className="w-5 h-5 text-accent" />
          <h1 className="text-xl font-black text-brand-dark">Topic Tests</h1>
        </div>
        <button
          onClick={() => setBuilding(true)}
          className="px-4 py-2 rounded-lg font-black text-xs text-white flex items-center gap-1.5"
          style={{ background: 'var(--color-accent)' }}
        >
          <Plus className="w-3.5 h-3.5" /> Build custom test
        </button>
      </div>

      <section>
        <h2 className="text-[11px] font-black uppercase tracking-[0.22em] text-stone-500 mb-3">Available tests</h2>
        {tests.length === 0 ? (
          <div className="paper-card rounded p-8 text-center text-sm text-stone-500">No tests in the catalog yet.</div>
        ) : (
          <TestGroupList
            tests={tests}
            expandedGroups={expandedGroups}
            setExpandedGroups={setExpandedGroups}
            onAssign={setAssignModalTest}
            onPreview={setPreviewTest}
          />
        )}
      </section>

      <section>
        <h2 className="text-[11px] font-black uppercase tracking-[0.22em] text-stone-500 mb-3">Prescribed / assigned tests</h2>
        {assignments.filter((a) => a.is_active).length === 0 ? (
          <div className="paper-card rounded p-8 text-center text-sm text-stone-500">Nothing assigned yet — students won't see any tests until you assign one.</div>
        ) : (
          <div className="space-y-2">
            {assignments.filter((a) => a.is_active).map((a) => {
              const test = tests.find((t) => t.id === a.topic_test_id);
              const sg = subjectGrades.find((s) => s.subject_id === a.subject_id);
              return (
                <button
                  key={a.id}
                  onClick={() => setOpenAssignment(a)}
                  className="paper-card rounded w-full text-left p-4 flex items-center justify-between gap-3 hover:shadow-md transition-shadow"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-brand-dark truncate">{test?.title ?? `Test #${a.topic_test_id}`}</p>
                    <p className="text-[11px] text-stone-500 mt-1">{sg?.subject_label ?? 'Subject'} · Grade {a.grade}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-400 shrink-0" />
                </button>
              );
            })}
          </div>
        )}
      </section>

      {assignModalTest && (
        <AssignModal
          test={assignModalTest}
          subjectGrades={subjectGrades}
          teacherId={session.teacher_id}
          schoolId={session.school_id}
          onClose={() => setAssignModalTest(null)}
          onAssigned={() => { setAssignModalTest(null); reload(); }}
        />
      )}

      {previewTest && (
        <PreviewTestModal
          test={previewTest}
          onClose={() => setPreviewTest(null)}
          onAssign={() => { setAssignModalTest(previewTest); setPreviewTest(null); }}
        />
      )}
    </div>
  );
}

// ── Grouped test list — Grade → Term → Subject, collapsible ─────────────────

function TestGroupList({
  tests, expandedGroups, setExpandedGroups, onAssign, onPreview,
}: {
  tests: TopicTestWithTopic[];
  expandedGroups: Set<string>;
  setExpandedGroups: React.Dispatch<React.SetStateAction<Set<string>>>;
  onAssign: (t: TopicTestWithTopic) => void;
  onPreview: (t: TopicTestWithTopic) => void;
}) {
  const groups = new Map<string, { grade: number; term: number; subject_label: string; tests: TopicTestWithTopic[] }>();
  for (const t of tests) {
    const key = `${t.grade}-${t.term}-${t.subject_label}`;
    if (!groups.has(key)) groups.set(key, { grade: t.grade, term: t.term, subject_label: t.subject_label, tests: [] });
    groups.get(key)!.tests.push(t);
  }
  const sortedGroups = Array.from(groups.entries()).sort(([, a], [, b]) =>
    a.grade - b.grade || a.term - b.term || a.subject_label.localeCompare(b.subject_label));

  function toggle(key: string) {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  }

  return (
    <div className="space-y-3">
      {sortedGroups.map(([key, group]) => {
        const isOpen = expandedGroups.has(key);
        return (
          <div key={key} className="paper-card rounded overflow-hidden">
            <button
              onClick={() => toggle(key)}
              className="w-full flex items-center justify-between gap-3 p-4 hover:bg-stone-50/60 transition-colors"
            >
              <div className="flex items-center gap-2 min-w-0">
                <ChevronRight className={`w-4 h-4 text-stone-400 shrink-0 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                <span className="text-sm font-black text-brand-dark">Grade {group.grade} · Term {group.term} · {group.subject_label}</span>
              </div>
              <span className="text-[11px] font-bold text-stone-400 shrink-0">{group.tests.length} test{group.tests.length === 1 ? '' : 's'}</span>
            </button>
            {isOpen && (
              <div className="border-t border-brand-border divide-y divide-stone-100">
                {group.tests.map((t) => (
                  <div key={t.id} className="p-4 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">{t.topic_label}</p>
                      <p className="text-sm font-bold text-brand-dark truncate">{t.title}</p>
                      <p className="text-[11px] text-stone-500 mt-1">{t.test_purpose.replace('_', ' ')} · {t.is_prescribed ? 'Prescribed' : 'Custom'}</p>
                    </div>
                    <div className="shrink-0 flex items-center gap-2">
                      <button
                        onClick={() => onPreview(t)}
                        className="p-2 rounded-lg text-stone-400 hover:text-brand-dark hover:bg-stone-100 transition-colors"
                        title="Preview questions"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onAssign(t)}
                        className="px-4 py-2 rounded-lg font-black text-xs text-white flex items-center gap-1.5"
                        style={{ background: 'var(--color-accent)' }}
                      >
                        <Send className="w-3.5 h-3.5" /> Assign
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Preview a test's questions before assigning ──────────────────────────────

function PreviewTestModal({
  test, onClose, onAssign,
}: {
  test: TopicTestWithTopic; onClose: () => void; onAssign: () => void;
}) {
  const [loading, setLoading] = useState(true);
  const [full, setFull] = useState<TopicTestFull | null>(null);
  const [distractors, setDistractors] = useState<DistractorMisconception[]>([]);
  const [misconceptions, setMisconceptions] = useState<Misconception[]>([]);

  useEffect(() => {
    setLoading(true);
    (async () => {
      const testFull = await fetchTopicTestFull(test.id);
      setFull(testFull);
      if (testFull && testFull.questions.length > 0) {
        const [d, m] = await Promise.all([
          fetchDistractorMisconceptions(testFull.questions.map((q) => q.id)),
          fetchMisconceptions(testFull.topic_id),
        ]);
        setDistractors(d);
        setMisconceptions(m);
      }
    })().finally(() => setLoading(false));
  }, [test.id]);

  const misconceptionLabel = (id: number) => misconceptions.find((m) => m.id === id)?.label ?? `#${id}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto" style={{ background: 'rgba(15,18,15,0.4)' }}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl my-8 max-h-[85vh] flex flex-col">
        <div className="flex items-start justify-between gap-3 mb-1 shrink-0">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">{test.topic_label} · Grade {test.grade} · Term {test.term}</p>
            <h3 className="text-sm font-black text-brand-dark mt-1">{test.title}</h3>
          </div>
          <button onClick={onClose} className="shrink-0 p-1.5 rounded-lg text-stone-400 hover:text-brand-dark hover:bg-stone-100 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto mt-4 -mx-2 px-2 space-y-4">
          {loading ? (
            <>
              <Shimmer className="h-20 w-full" />
              <Shimmer className="h-20 w-full" />
              <Shimmer className="h-20 w-full" />
            </>
          ) : !full || full.questions.length === 0 ? (
            <p className="text-sm text-stone-500 text-center py-8">No questions in this test yet.</p>
          ) : (
            full.questions.map((q, idx) => {
              const questionDistractors = distractors.filter((d) => d.question_id === q.id);
              return (
                <div key={q.id} className="paper-card rounded p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-black text-stone-400">Q{idx + 1}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-stone-100 text-stone-500">{q.difficulty}</span>
                    <span className="text-[10px] font-bold text-stone-400">{q.question_type === 'mcq' ? 'Multiple choice' : 'Short answer'}</span>
                  </div>
                  <p className="text-sm font-bold text-brand-dark mb-2">{q.prompt}</p>

                  {q.question_type === 'mcq' && q.options ? (
                    <div className="space-y-1.5">
                      {q.options.map((opt) => {
                        const isCorrect = opt.key === q.correct_answer;
                        const d = questionDistractors.find((x) => x.option_key === opt.key);
                        return (
                          <div key={opt.key} className={`px-3 py-2 rounded-lg border text-xs ${isCorrect ? 'border-emerald-300 bg-emerald-50/60' : 'border-brand-border'}`}>
                            <div className="flex items-center gap-2">
                              {isCorrect && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                              <span className={`font-bold ${isCorrect ? 'text-emerald-800' : 'text-brand-dark'}`}>{opt.text}</span>
                            </div>
                            {d && (
                              <p className="text-[11px] text-stone-500 mt-1 pl-5">
                                Misconception: <span className="font-bold">{misconceptionLabel(d.misconception_id)}</span> — {d.explanation_text}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-stone-500">Correct answer: <span className="font-bold text-brand-dark">{q.correct_answer}</span></p>
                  )}
                </div>
              );
            })
          )}
        </div>

        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-brand-border shrink-0">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-lg font-black text-xs text-stone-500 border-2 border-brand-border">
            Close
          </button>
          <button
            onClick={onAssign}
            className="flex-1 py-2.5 rounded-lg font-black text-xs text-white flex items-center justify-center gap-1.5"
            style={{ background: 'var(--color-accent)' }}
          >
            <Send className="w-3.5 h-3.5" /> Assign this test
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Assignment detail — students in this prescribed test group ──────────────

function AssignmentDetail({
  assignment, testTitle, subjectLabel, onBack, onRemoved,
}: {
  assignment: TopicTestAssignment; testTitle: string; subjectLabel: string;
  onBack: () => void; onRemoved: () => void;
}) {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<AssignmentStudentRow[]>([]);
  const [misconceptions, setMisconceptions] = useState<MisconceptionFrequency[]>([]);
  const [confirming, setConfirming] = useState(false);

  async function reloadStudents() {
    const [s, m] = await Promise.all([
      fetchAssignmentStudents(assignment),
      fetchAssignmentMisconceptionBreakdown(assignment),
    ]);
    setStudents(s);
    setMisconceptions(m);
  }

  useEffect(() => {
    setLoading(true);
    reloadStudents().finally(() => setLoading(false));
  }, [assignment.id]);

  const pendingCount = students.filter(
    (s) => s.latestAttempt?.next_retest_due_at && !s.latestAttempt?.retest_confirmed_at,
  ).length;

  const attempted = students.filter((s) => s.latestAttempt);
  const classMasteryPct = attempted.length > 0
    ? Math.round((attempted.filter((s) => s.latestAttempt!.mastery_level === 'mastered' || s.latestAttempt!.mastery_level === 'proficient').length / attempted.length) * 100)
    : null;
  const flagged = attempted.filter((s) => (s.latestAttempt!.posterior_score ?? 1) < FLAG_THRESHOLD);
  const masteryDistribution: MasteryLevel[] = ['not_started', 'attempted', 'familiar', 'proficient', 'mastered'];
  const distributionCounts = masteryDistribution.map((level) => ({
    level, count: attempted.filter((s) => s.latestAttempt!.mastery_level === level).length,
  }));

  async function handleRemove() {
    if (!confirm(`Remove this assignment? Students in ${subjectLabel} · Grade ${assignment.grade} will no longer see "${testTitle}". Their existing attempts are kept.`)) return;
    await deactivateAssignment(assignment.id);
    onRemoved();
  }

  async function handleConfirmGroupRetests() {
    setConfirming(true);
    await confirmRetestsForAssignment(assignment, assignment.teacher_id);
    await reloadStudents();
    setConfirming(false);
  }

  async function handleDismissAttempt(attemptId: number, studentName: string) {
    if (!confirm(`Remove this attempt for ${studentName}? This can't be undone.`)) return;
    await dismissAttempt(attemptId);
    reloadStudents();
  }

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <button onClick={onBack} className="flex items-center gap-1 text-xs font-bold text-stone-500 hover:text-brand-dark mb-4">
        <ArrowLeft className="w-3.5 h-3.5" /> Back
      </button>

      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">{subjectLabel} · Grade {assignment.grade}</p>
          <h1 className="text-lg font-black text-brand-dark mt-1">{testTitle}</h1>
        </div>
        <button
          onClick={handleRemove}
          className="shrink-0 px-3 py-2 rounded-lg font-black text-xs text-red-500 border-2 border-red-200 hover:bg-red-50 transition-colors flex items-center gap-1.5"
        >
          <Trash2 className="w-3.5 h-3.5" /> Remove assignment
        </button>
      </div>

      {pendingCount > 0 && (
        <div className="paper-card rounded p-4 mb-6 flex items-center justify-between gap-3 bg-amber-50/60 border-amber-200">
          <p className="text-sm font-bold text-amber-800">{pendingCount} student{pendingCount === 1 ? '' : 's'} have a suggested retest awaiting your approval.</p>
          <button
            onClick={handleConfirmGroupRetests}
            disabled={confirming}
            className="shrink-0 px-4 py-2 rounded-lg font-black text-xs text-white flex items-center gap-1.5 disabled:opacity-50"
            style={{ background: 'var(--color-accent)' }}
          >
            <CheckCircle2 className="w-3.5 h-3.5" /> {confirming ? 'Confirming…' : 'Confirm retests for this group'}
          </button>
        </div>
      )}

      {!loading && attempted.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="paper-card rounded p-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-3">Class mastery</p>
            <p className="text-2xl font-black text-brand-dark mb-1">{classMasteryPct}%</p>
            <p className="text-[11px] text-stone-500 mb-3">at proficient or mastered ({attempted.length}/{students.length} attempted)</p>
            <div className="flex h-2 rounded-full overflow-hidden gap-px">
              {distributionCounts.map(({ level, count }) => (
                count > 0 && (
                  <div
                    key={level}
                    style={{ background: MASTERY_COLOR[level], width: `${(count / attempted.length) * 100}%` }}
                    title={`${MASTERY_LABEL[level]}: ${count}`}
                  />
                )
              ))}
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
              {distributionCounts.filter((d) => d.count > 0).map(({ level, count }) => (
                <span key={level} className="flex items-center gap-1 text-[10px] font-bold text-stone-500">
                  <span className="w-2 h-2 rounded-full" style={{ background: MASTERY_COLOR[level] }} />
                  {MASTERY_LABEL[level]} ({count})
                </span>
              ))}
            </div>
            {flagged.length > 0 && (
              <p className="text-[11px] font-bold text-amber-700 mt-3">{flagged.length} student{flagged.length === 1 ? '' : 's'} flagged for intervention (mastery below {Math.round(FLAG_THRESHOLD * 100)}%)</p>
            )}
          </div>

          <div className="paper-card rounded p-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-3">Top misconceptions</p>
            {misconceptions.length === 0 ? (
              <p className="text-xs text-stone-400">No misconception data yet from this group's attempts.</p>
            ) : (
              <div className="space-y-2.5">
                {misconceptions.map((m) => (
                  <div key={m.misconception_id}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-brand-dark truncate pr-2">{m.label}</span>
                      <span className="text-[11px] font-black text-stone-500 shrink-0">{m.pctOfClass}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-stone-100 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${m.pctOfClass}%`, background: '#d03b3b' }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-2">
          <Shimmer className="h-14 w-full" />
          <Shimmer className="h-14 w-full" />
          <Shimmer className="h-14 w-full" />
        </div>
      ) : students.length === 0 ? (
        <div className="paper-card rounded p-8 text-center text-sm text-stone-500">
          No students found in this subject/grade group.
        </div>
      ) : (
        <div className="space-y-2">
          {students.map((s) => {
            const level = s.latestAttempt?.mastery_level;
            const isFlagged = s.latestAttempt && (s.latestAttempt.posterior_score ?? 1) < FLAG_THRESHOLD;
            return (
              <div key={s.student_id} className={`paper-card rounded p-4 flex items-center justify-between gap-3 ${isFlagged ? 'ring-1 ring-amber-300' : ''}`}>
                <div className="min-w-0 flex items-center gap-2">
                  <div>
                    <p className="text-sm font-bold text-brand-dark">{s.name} {s.surname}</p>
                    <p className="text-[11px] text-stone-500">{s.student_code}</p>
                  </div>
                  {isFlagged && (
                    <span className="shrink-0 text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700">
                      Flagged
                    </span>
                  )}
                </div>
                <div className="shrink-0 flex items-center gap-3">
                  {level ? (
                    <>
                      <span className="w-2 h-2 rounded-full" style={{ background: MASTERY_COLOR[level] }} />
                      <span className="text-xs font-black" style={{ color: MASTERY_COLOR[level] }}>{MASTERY_LABEL[level]}</span>
                      {s.latestAttempt?.score_pct != null && (
                        <span className="text-[11px] text-stone-400">({s.latestAttempt.score_pct}%)</span>
                      )}
                      <button
                        onClick={() => handleDismissAttempt(s.latestAttempt!.id, `${s.name} ${s.surname}`)}
                        className="p-1.5 rounded-lg text-stone-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                        title="Remove this attempt"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </>
                  ) : (
                    <>
                      <CircleDashed className="w-3.5 h-3.5 text-stone-300" />
                      <span className="text-xs font-bold text-stone-400">Not started</span>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Build custom test — topic bank browse/select + author new questions ────

const DIFFICULTY_OPTIONS: Difficulty[] = ['foundational', 'application', 'extension'];
const PURPOSE_OPTIONS: AttemptPurpose[] = ['diagnostic', 'mastery_confirm', 'spaced_review', 'maintenance'];

function BuildTestPage({
  session, subjectGrades, onBack, onCreated,
}: {
  session: TeacherSession; subjectGrades: TeacherSubjectGrade[];
  onBack: () => void; onCreated: () => void;
}) {
  const [selectedSg, setSelectedSg] = useState<TeacherSubjectGrade | null>(subjectGrades[0] ?? null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [bank, setBank] = useState<Question[]>([]);
  const [misconceptions, setMisconceptions] = useState<Misconception[]>([]);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<number[]>([]);
  const [authoring, setAuthoring] = useState(false);
  const [loadingTopics, setLoadingTopics] = useState(false);
  const [loadingBank, setLoadingBank] = useState(false);

  const [title, setTitle] = useState('');
  const [purpose, setPurpose] = useState<AttemptPurpose>('diagnostic');
  const [timeLimit, setTimeLimit] = useState(20);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!selectedSg) { setTopics([]); return; }
    setLoadingTopics(true);
    fetchTopicsForSubjectGrade(selectedSg.subject_id, selectedSg.grade)
      .then(setTopics)
      .finally(() => setLoadingTopics(false));
    setSelectedTopic(null);
  }, [selectedSg?.subject_id, selectedSg?.grade]);

  useEffect(() => {
    if (!selectedTopic) { setBank([]); setMisconceptions([]); return; }
    setLoadingBank(true);
    Promise.all([fetchQuestionBank(selectedTopic.id), fetchMisconceptions(selectedTopic.id)])
      .then(([q, m]) => { setBank(q); setMisconceptions(m); })
      .finally(() => setLoadingBank(false));
    setSelectedQuestionIds([]);
    setTitle(`${selectedTopic.label} — Custom Test`);
  }, [selectedTopic?.id]);

  function toggleSelect(qId: number) {
    setSelectedQuestionIds((ids) => (ids.includes(qId) ? ids.filter((id) => id !== qId) : [...ids, qId]));
  }

  async function handleQuestionAuthored(q: Question) {
    setBank((b) => [...b, q]);
    setSelectedQuestionIds((ids) => [...ids, q.id]);
    setAuthoring(false);
  }

  async function handleSave() {
    if (!selectedTopic || selectedQuestionIds.length === 0 || !title.trim()) return;
    setSaving(true);
    await createTopicTest({
      topicId: selectedTopic.id, teacherId: session.teacher_id, schoolId: session.school_id,
      title: title.trim(), testPurpose: purpose, timeLimitMinutes: timeLimit, questionIds: selectedQuestionIds,
    });
    setSaving(false);
    onCreated();
  }

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <button onClick={onBack} className="flex items-center gap-1 text-xs font-bold text-stone-500 hover:text-brand-dark mb-4">
        <ArrowLeft className="w-3.5 h-3.5" /> Back
      </button>

      <h1 className="text-lg font-black text-brand-dark mb-6">Build custom test</h1>

      <div className="space-y-4 mb-6">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-2">Subject &amp; grade</p>
          {subjectGrades.length === 0 ? (
            <p className="text-xs text-red-500">No linked subject/grade groups.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {subjectGrades.map((sg) => {
                const isSelected = selectedSg?.subject_id === sg.subject_id && selectedSg?.grade === sg.grade;
                return (
                  <button
                    key={`${sg.subject_id}-${sg.grade}`}
                    onClick={() => setSelectedSg(sg)}
                    className={`px-3 py-1.5 rounded-lg border-2 text-xs font-bold transition-colors ${
                      isSelected ? 'border-accent bg-accent/10 text-brand-dark' : 'border-brand-border text-stone-500 hover:border-stone-300'
                    }`}
                  >
                    {sg.subject_label} · Grade {sg.grade}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {selectedSg && (
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-2">Topic</p>
            {loadingTopics ? (
              <Shimmer className="h-10 w-full" />
            ) : topics.length === 0 ? (
              <p className="text-xs text-stone-500">No topics found for this subject/grade yet.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {topics.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTopic(t)}
                    className={`px-3 py-1.5 rounded-lg border-2 text-xs font-bold transition-colors ${
                      selectedTopic?.id === t.id ? 'border-accent bg-accent/10 text-brand-dark' : 'border-brand-border text-stone-500 hover:border-stone-300'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {selectedTopic && (
        <>
          <div className="paper-card rounded p-4 mb-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <label className="block">
              <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">Title</span>
              <input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-lg border-2 border-brand-border text-sm font-bold" />
            </label>
            <label className="block">
              <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">Purpose</span>
              <select value={purpose} onChange={(e) => setPurpose(e.target.value as AttemptPurpose)} className="mt-1 w-full px-3 py-2 rounded-lg border-2 border-brand-border text-sm font-bold bg-white">
                {PURPOSE_OPTIONS.map((p) => <option key={p} value={p}>{p.replace('_', ' ')}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">Time limit (min)</span>
              <input type="number" value={timeLimit} onChange={(e) => setTimeLimit(Number(e.target.value))} className="mt-1 w-full px-3 py-2 rounded-lg border-2 border-brand-border text-sm font-bold" />
            </label>
          </div>

          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[11px] font-black uppercase tracking-[0.22em] text-stone-500">
              Question bank ({selectedQuestionIds.length} selected)
            </h2>
            <button
              onClick={() => setAuthoring(true)}
              className="text-xs font-black text-accent flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> New question
            </button>
          </div>

          {loadingBank ? (
            <div className="space-y-2 mb-6"><Shimmer className="h-16 w-full" /><Shimmer className="h-16 w-full" /></div>
          ) : bank.length === 0 ? (
            <div className="paper-card rounded p-6 text-center text-sm text-stone-500 mb-6">No questions in this topic's bank yet — author one.</div>
          ) : (
            <div className="space-y-2 mb-6">
              {bank.map((q) => {
                const isSelected = selectedQuestionIds.includes(q.id);
                return (
                  <button
                    key={q.id}
                    onClick={() => toggleSelect(q.id)}
                    className={`w-full text-left paper-card rounded p-3 flex items-start gap-3 transition-colors ${isSelected ? 'ring-2 ring-accent' : ''}`}
                  >
                    <span className={`mt-0.5 w-4 h-4 rounded shrink-0 flex items-center justify-center border-2 ${isSelected ? 'bg-accent border-accent' : 'border-brand-border'}`}>
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-brand-dark">{q.prompt}</p>
                      <p className="text-[11px] text-stone-500 mt-0.5">{q.question_type} · {q.difficulty}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={selectedQuestionIds.length === 0 || !title.trim() || saving}
            className="w-full py-3 rounded-lg font-black text-sm text-white disabled:opacity-50"
            style={{ background: 'var(--color-accent)' }}
          >
            {saving ? 'Saving…' : `Save test (${selectedQuestionIds.length} question${selectedQuestionIds.length === 1 ? '' : 's'})`}
          </button>
        </>
      )}

      {authoring && selectedTopic && (
        <AuthorQuestionModal
          topic={selectedTopic}
          misconceptions={misconceptions}
          teacherId={session.teacher_id}
          onClose={() => setAuthoring(false)}
          onCreated={handleQuestionAuthored}
          onMisconceptionCreated={(m) => setMisconceptions((ms) => [...ms, m])}
        />
      )}
    </div>
  );
}

// ── Author a new question with misconception-tagged distractors ────────────

function AuthorQuestionModal({
  topic, misconceptions, teacherId, onClose, onCreated, onMisconceptionCreated,
}: {
  topic: Topic; misconceptions: Misconception[]; teacherId: number;
  onClose: () => void; onCreated: (q: Question) => void;
  onMisconceptionCreated: (m: Misconception) => void;
}) {
  const [questionType, setQuestionType] = useState<'mcq' | 'short_answer'>('mcq');
  const [prompt, setPrompt] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('foundational');
  const [options, setOptions] = useState<QuestionOption[]>([
    { key: 'A', text: '' }, { key: 'B', text: '' }, { key: 'C', text: '' }, { key: 'D', text: '' },
  ]);
  const [correctKey, setCorrectKey] = useState('A');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [distractorMisconceptionByKey, setDistractorMisconceptionByKey] = useState<Record<string, number | ''>>({});
  const [newMisconceptionLabel, setNewMisconceptionLabel] = useState('');
  const [saving, setSaving] = useState(false);

  function updateOptionText(key: string, text: string) {
    setOptions((opts) => opts.map((o) => (o.key === key ? { ...o, text } : o)));
  }

  async function handleAddMisconception() {
    if (!newMisconceptionLabel.trim()) return;
    const code = newMisconceptionLabel.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').slice(0, 40);
    const m = await createMisconception(topic.id, code, newMisconceptionLabel.trim());
    if (m) { onMisconceptionCreated(m); setNewMisconceptionLabel(''); }
  }

  async function handleSave() {
    if (!prompt.trim()) return;
    setSaving(true);

    if (questionType === 'mcq') {
      const distractors = options
        .filter((o) => o.key !== correctKey && o.text.trim())
        .map((o) => {
          const misconceptionId = distractorMisconceptionByKey[o.key];
          return misconceptionId ? { optionKey: o.key, misconceptionId: Number(misconceptionId) } : null;
        })
        .filter((d): d is { optionKey: string; misconceptionId: number } => d !== null);

      const q = await createQuestion({
        topicId: topic.id, questionType: 'mcq', prompt: prompt.trim(), difficulty,
        options: options.filter((o) => o.text.trim()), correctAnswer: correctKey,
        createdBy: teacherId, distractors,
      });
      if (q) onCreated(q);
    } else {
      const q = await createQuestion({
        topicId: topic.id, questionType: 'short_answer', prompt: prompt.trim(), difficulty,
        correctAnswer: correctAnswer.trim(), createdBy: teacherId,
      });
      if (q) onCreated(q);
    }
    setSaving(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto" style={{ background: 'rgba(15,18,15,0.4)' }}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg my-8">
        <h3 className="text-sm font-black text-brand-dark mb-4">New question — {topic.label}</h3>

        <div className="space-y-3">
          <div className="flex gap-2">
            {(['mcq', 'short_answer'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setQuestionType(t)}
                className={`px-3 py-1.5 rounded-lg border-2 text-xs font-bold ${questionType === t ? 'border-accent bg-accent/10 text-brand-dark' : 'border-brand-border text-stone-500'}`}
              >
                {t === 'mcq' ? 'Multiple choice' : 'Short answer'}
              </button>
            ))}
          </div>

          <label className="block">
            <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">Prompt</span>
            <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={2}
              className="mt-1 w-full px-3 py-2 rounded-lg border-2 border-brand-border text-sm font-bold" />
          </label>

          <label className="block">
            <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">Difficulty</span>
            <div className="flex gap-2 mt-1">
              {DIFFICULTY_OPTIONS.map((d) => (
                <button
                  key={d} onClick={() => setDifficulty(d)}
                  className={`px-3 py-1.5 rounded-lg border-2 text-xs font-bold ${difficulty === d ? 'border-accent bg-accent/10 text-brand-dark' : 'border-brand-border text-stone-500'}`}
                >
                  {d}
                </button>
              ))}
            </div>
          </label>

          {questionType === 'mcq' ? (
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">Options — mark the correct one</span>
              {options.map((o) => (
                <div key={o.key} className="flex items-center gap-2">
                  <button
                    onClick={() => setCorrectKey(o.key)}
                    className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-black ${
                      correctKey === o.key ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-brand-border text-stone-400'
                    }`}
                  >
                    {o.key}
                  </button>
                  <input
                    value={o.text} onChange={(e) => updateOptionText(o.key, e.target.value)}
                    placeholder={`Option ${o.key}`}
                    className="flex-1 px-3 py-1.5 rounded-lg border-2 border-brand-border text-sm"
                  />
                  {correctKey !== o.key && o.text.trim() && (
                    <select
                      value={distractorMisconceptionByKey[o.key] ?? ''}
                      onChange={(e) => setDistractorMisconceptionByKey((m) => ({ ...m, [o.key]: e.target.value ? Number(e.target.value) : '' }))}
                      className="shrink-0 w-40 px-2 py-1.5 rounded-lg border-2 border-brand-border text-[11px] bg-white"
                    >
                      <option value="">No misconception tag</option>
                      {misconceptions.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}
                    </select>
                  )}
                </div>
              ))}

              <div className="flex items-center gap-2 pt-1">
                <Sparkles className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <input
                  value={newMisconceptionLabel} onChange={(e) => setNewMisconceptionLabel(e.target.value)}
                  placeholder="Add a new misconception label…"
                  className="flex-1 px-2 py-1.5 rounded-lg border border-brand-border text-[11px]"
                />
                <button onClick={handleAddMisconception} className="shrink-0 text-[11px] font-black text-accent">Add</button>
              </div>
            </div>
          ) : (
            <label className="block">
              <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">Correct answer</span>
              <input value={correctAnswer} onChange={(e) => setCorrectAnswer(e.target.value)}
                className="mt-1 w-full px-3 py-2 rounded-lg border-2 border-brand-border text-sm font-bold" />
            </label>
          )}
        </div>

        <div className="flex items-center gap-2 mt-6">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-lg font-black text-xs text-stone-500 border-2 border-brand-border">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!prompt.trim() || saving}
            className="flex-1 py-2.5 rounded-lg font-black text-xs text-white disabled:opacity-50"
            style={{ background: 'var(--color-accent)' }}
          >
            {saving ? 'Saving…' : 'Save question'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Assign modal ──────────────────────────────────────────────────────────

function AssignModal({
  test, subjectGrades, teacherId, schoolId, onClose, onAssigned,
}: {
  test: TopicTest & { topic_label: string };
  subjectGrades: TeacherSubjectGrade[];
  teacherId: number; schoolId: number;
  onClose: () => void; onAssigned: () => void;
}) {
  const [selected, setSelected] = useState<TeacherSubjectGrade | null>(subjectGrades[0] ?? null);
  const [submitting, setSubmitting] = useState(false);

  async function handleAssign() {
    if (!selected) return;
    setSubmitting(true);
    await assignTopicTest(test.id, teacherId, schoolId, selected.subject_id, selected.grade);
    setSubmitting(false);
    onAssigned();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(15,18,15,0.4)' }}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
        <h3 className="text-sm font-black text-brand-dark mb-1">Assign "{test.title}"</h3>
        <p className="text-xs text-stone-500 mb-4">Students in the selected subject/grade will be able to take this test once assigned.</p>

        {subjectGrades.length === 0 ? (
          <p className="text-xs text-red-500">You have no linked subject/grade groups to assign to.</p>
        ) : (
          <div className="space-y-2 mb-4">
            {subjectGrades.map((sg) => {
              const isSelected = selected?.subject_id === sg.subject_id && selected?.grade === sg.grade;
              return (
                <button
                  key={`${sg.subject_id}-${sg.grade}`}
                  onClick={() => setSelected(sg)}
                  className={`w-full text-left px-3 py-2 rounded-lg border-2 text-sm font-bold transition-colors ${
                    isSelected ? 'border-accent bg-accent/10 text-brand-dark' : 'border-brand-border text-stone-500 hover:border-stone-300'
                  }`}
                >
                  {sg.subject_label} · Grade {sg.grade}
                </button>
              );
            })}
          </div>
        )}

        <div className="flex items-center gap-2">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-lg font-black text-xs text-stone-500 border-2 border-brand-border">
            Cancel
          </button>
          <button
            onClick={handleAssign}
            disabled={!selected || submitting}
            className="flex-1 py-2.5 rounded-lg font-black text-xs text-white disabled:opacity-50"
            style={{ background: 'var(--color-accent)' }}
          >
            {submitting ? 'Assigning…' : 'Assign'}
          </button>
        </div>
      </div>
    </div>
  );
}
