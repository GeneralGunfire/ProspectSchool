import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ClipboardCheck, Clock, ChevronRight, X, Send, Plus, Trash2,
  CheckCircle2, AlertCircle, BarChart3, ArrowLeft, ArrowRight, PenLine, Pencil,
} from 'lucide-react';
import type { TeacherSession } from '../../../lib/auth';
import { fetchSubjects, type Subject } from '../../../lib/students';
import {
  fetchTeacherTopicTests, seedCatalogTest, createTopicTest, deleteTopicTest,
  fetchTopicTestFull, addTopicTestQuestion, deleteTopicTestQuestion,
  assignTopicTest, fetchTestAssignments, fetchTopicOverview,
  fetchPendingMarking, markAnswer, finalizeAttemptGrading, getCatalogTopics,
  type TopicTestGroup, type TopicTest, type TopicTestFull,
  type TopicTestAssignment, type TopicOverviewData, type QuestionType,
  type GradingMode, type PendingMarkingAttempt,
} from '../../../lib/topicTests';

interface TopicTestsPageProps { session: TeacherSession; }

const GRADES = [8, 9, 10, 11, 12];

type View = 'list' | 'overview' | 'marking';

export default function TopicTestsPage({ session }: TopicTestsPageProps) {
  const [view, setView] = useState<View>('list');
  const [groups, setGroups] = useState<TopicTestGroup[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTestId, setSelectedTestId] = useState<number | null>(null);

  const [showCreate, setShowCreate] = useState(false);
  const [showCustomCreate, setShowCustomCreate] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<TopicTest | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [showAssign, setShowAssign] = useState<TopicTest | null>(null);

  async function reload() {
    const [g, s] = await Promise.all([
      fetchTeacherTopicTests(session.teacher_id, session.school_id),
      fetchSubjects(),
    ]);
    setGroups(g);
    setSubjects(s);
  }

  useEffect(() => {
    setLoading(true);
    reload().finally(() => setLoading(false));
  }, []);

  const allTests = useMemo(() => groups.flatMap((g) => g.tests), [groups]);

  async function handleDelete() {
    if (!confirmDelete) return;
    setDeleting(true);
    await deleteTopicTest(confirmDelete.id, session.school_id);
    await reload();
    setConfirmDelete(null);
    setDeleting(false);
  }

  if (view === 'overview' && selectedTestId) {
    return (
      <TopicOverview
        topicTestId={selectedTestId}
        onBack={() => { setView('list'); setSelectedTestId(null); }}
        onMark={() => setView('marking')}
      />
    );
  }

  if (view === 'marking' && selectedTestId) {
    return (
      <MarkingScreen
        topicTestId={selectedTestId}
        onBack={() => setView('overview')}
      />
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:p-6 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="eyebrow">Portal</span>
          <h1 className="text-2xl font-black text-brand-dark tracking-tight">Topic Tests</h1>
          <p className="text-sm text-stone-500 mt-1">
            Short, timed tests that pinpoint exactly what a student is struggling with — invisible to students until you assign them.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <motion.button onClick={() => setShowCustomCreate(true)} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 bg-white border border-brand-border text-brand-dark text-sm font-black px-5 py-2.5 rounded-xl hover:border-stone-300 transition-colors">
            <Pencil className="w-4 h-4" /> Build Custom Test
          </motion.button>
          <motion.button onClick={() => setShowCreate(true)} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 bg-brand-dark text-white text-sm font-black px-5 py-2.5 rounded-xl hover:bg-brand-dark/90 transition-colors">
            <Plus className="w-4 h-4" /> Assign Test
          </motion.button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-5 h-5 border-2 border-brand-border border-t-stone-700 rounded-full animate-spin" />
        </div>
      ) : allTests.length === 0 ? (
        <div className="card-premium bg-white border border-brand-border rounded-[24px] p-12 text-center">
          <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center mx-auto mb-4">
            <ClipboardCheck className="w-5 h-5 text-stone-500" />
          </div>
          <p className="font-bold text-brand-dark mb-1">No topic tests yet</p>
          <p className="text-sm text-stone-500 mb-6">Create your first test to start diagnosing exactly where students struggle.</p>
          <button onClick={() => setShowCreate(true)}
            className="inline-flex items-center gap-2 text-sm font-bold text-stone-700 hover:text-brand-dark border border-brand-border hover:border-stone-300 px-5 py-2.5 rounded-xl transition-all">
            Assign Test <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {groups.map((group) => (
            <div key={group.key}>
              <p className="text-[11px] font-black uppercase tracking-widest text-stone-500 mb-2">
                {group.subject_label} · Grade {group.grade}
              </p>
              <div className="space-y-3">
                {group.tests.map((test) => (
                  <TestCard
                    key={test.id}
                    test={test}
                    onAssign={() => setShowAssign(test)}
                    onOverview={() => { setSelectedTestId(test.id); setView('overview'); }}
                    onDelete={() => setConfirmDelete(test)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create test modal (predefined/CAPS catalog) */}
      <AnimatePresence>
        {showCreate && (
          <CreateTestModal
            session={session}
            subjects={subjects}
            onClose={() => setShowCreate(false)}
            onCreated={async (testId) => {
              setShowCreate(false);
              await reload();
              const created = (await fetchTeacherTopicTests(session.teacher_id, session.school_id))
                .flatMap((g) => g.tests)
                .find((t) => t.id === testId);
              if (created) setShowAssign(created);
            }}
          />
        )}
      </AnimatePresence>

      {/* Custom test modal (teacher-authored, full control) */}
      <AnimatePresence>
        {showCustomCreate && (
          <CustomTestModal
            session={session}
            subjects={subjects}
            onClose={() => setShowCustomCreate(false)}
            onCreated={async (testId) => {
              setShowCustomCreate(false);
              await reload();
              setSelectedTestId(testId);
              setView('overview');
            }}
          />
        )}
      </AnimatePresence>

      {/* Assign modal */}
      <AnimatePresence>
        {showAssign && (
          <AssignModal
            session={session}
            test={showAssign}
            onClose={() => setShowAssign(null)}
            onAssigned={async () => { setShowAssign(null); await reload(); }}
          />
        )}
      </AnimatePresence>

      {/* Delete confirm */}
      <AnimatePresence>
        {confirmDelete && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setConfirmDelete(null)} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center mb-4">
                  <Trash2 className="w-5 h-5 text-red-500" />
                </div>
                <h2 className="text-base font-black text-brand-dark mb-1">Delete test?</h2>
                <p className="text-sm text-stone-500 mb-6">
                  This will permanently delete <span className="font-bold text-brand-dark">{confirmDelete.title}</span>, its questions, assignments, and all student results.
                </p>
                <div className="flex gap-3">
                  <button onClick={() => setConfirmDelete(null)}
                    className="flex-1 py-2.5 text-sm font-bold text-stone-600 border border-brand-border rounded-xl hover:bg-stone-50 transition-all">
                    Cancel
                  </button>
                  <button onClick={handleDelete} disabled={deleting}
                    className="flex-1 py-2.5 text-sm font-black text-white bg-red-600 rounded-xl hover:bg-red-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                    {deleting ? <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Delete'}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Test card ─────────────────────────────────────────────────

function TestCard({ test, onAssign, onOverview, onDelete }: {
  test: TopicTest; onAssign: () => void; onOverview: () => void; onDelete: () => void;
}) {
  return (
    <div className="card-premium bg-white border border-brand-border rounded-[24px] overflow-hidden">
      <div className="px-6 py-5 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-xl bg-brand-dark flex items-center justify-center shrink-0">
            <ClipboardCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-black text-brand-dark">{test.title}</h3>
              {test.grading_mode === 'manual' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-black rounded-full">
                  <PenLine className="w-2.5 h-2.5" /> Teacher-marked
                </span>
              )}
            </div>
            <p className="text-xs text-stone-500 mt-1">Term {test.term} · Topic: {test.topic_key}</p>
            <div className="flex items-center gap-3 mt-2 text-xs font-bold text-stone-500">
              <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" /> {Math.round(test.time_limit_seconds / 60)} min timer</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={onDelete} className="p-2 rounded-lg hover:bg-red-50 text-stone-400 hover:text-red-500 transition-colors">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button onClick={onAssign}
            className="flex items-center gap-2 bg-brand-dark text-white text-xs font-black px-4 py-2.5 rounded-xl hover:bg-brand-dark/90 transition-colors">
            <Send className="w-3.5 h-3.5" /> Assign
          </button>
        </div>
      </div>
      <button onClick={onOverview}
        className="w-full flex items-center justify-between px-6 py-3.5 border-t border-brand-border/60 text-sm font-bold text-stone-600 hover:bg-stone-50 transition-colors">
        <span className="flex items-center gap-2"><BarChart3 className="w-4 h-4" /> View topic overview & results</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

// ── Assign test modal — pick a predefined, ready-made CAPS topic test ──
// No authoring: the system seeds sub-skills + questions from the catalog and
// grades automatically. Only topics with a real question set show up here.

function CreateTestModal({ session, subjects, onClose, onCreated }: {
  session: TeacherSession; subjects: Subject[]; onClose: () => void; onCreated: (testId: number) => void;
}) {
  const [subjectId, setSubjectId] = useState<string>('');
  const [grade, setGrade] = useState('10');
  const [term, setTerm] = useState('1');
  const [topicKey, setTopicKey] = useState('');
  const [timeLimitMin, setTimeLimitMin] = useState('10');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedSubject = subjects.find((s) => String(s.id) === subjectId);
  const availableTopics = selectedSubject
    ? getCatalogTopics(selectedSubject.code, parseInt(grade), parseInt(term)).filter((t) => t.questions.length > 0)
    : [];
  const selectedTopic = availableTopics.find((t) => t.topicKey === topicKey);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!subjectId) { setError('Select a subject.'); return; }
    if (!selectedTopic) { setError('Select a topic.'); return; }

    setSubmitting(true);
    const result = await seedCatalogTest({
      school_id: session.school_id,
      teacher_id: session.teacher_id,
      subject_id: parseInt(subjectId),
      grade: parseInt(grade),
      term: parseInt(term),
      topic: selectedTopic,
      time_limit_seconds: parseInt(timeLimitMin) * 60,
    });
    setSubmitting(false);

    if (!result.success) { setError(result.error); return; }
    onCreated(result.test.id);
  }

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
          <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-brand-border/60">
            <div>
              <h2 className="text-lg font-black text-brand-dark">Assign Test</h2>
              <p className="text-xs text-stone-500 mt-0.5">Pick a ready-made CAPS topic test — questions are already set and auto-graded.</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-stone-100 text-stone-500 hover:text-stone-700 transition-colors shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="overflow-y-auto flex-1 px-6 py-4">
            <form id="create-test-form" onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-1.5">Subject</label>
                  <select required value={subjectId} onChange={(e) => { setSubjectId(e.target.value); setTopicKey(''); }}
                    className="w-full px-3 py-2.5 bg-stone-50 border border-brand-border rounded-xl text-sm font-medium text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 transition-all">
                    <option value="">Select</option>
                    {subjects.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-1.5">Grade</label>
                  <select value={grade} onChange={(e) => { setGrade(e.target.value); setTopicKey(''); }}
                    className="w-full px-3 py-2.5 bg-stone-50 border border-brand-border rounded-xl text-sm font-medium text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 transition-all">
                    {GRADES.map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-1.5">Term</label>
                  <select value={term} onChange={(e) => { setTerm(e.target.value); setTopicKey(''); }}
                    className="w-full px-3 py-2.5 bg-stone-50 border border-brand-border rounded-xl text-sm font-medium text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 transition-all">
                    {[1, 2, 3, 4].map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-1.5">
                  Topic <span className="normal-case font-medium text-stone-400">(CAPS order)</span>
                </label>
                {!selectedSubject ? (
                  <p className="text-sm text-stone-400 py-2">Select a subject first.</p>
                ) : availableTopics.length === 0 ? (
                  <p className="text-sm text-stone-400 py-2">No predefined tests available yet for this subject/grade/term.</p>
                ) : (
                  <select required value={topicKey} onChange={(e) => setTopicKey(e.target.value)}
                    className="w-full px-3 py-2.5 bg-stone-50 border border-brand-border rounded-xl text-sm font-medium text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 transition-all">
                    <option value="">Select a topic</option>
                    {availableTopics.map((t, i) => (
                      <option key={t.topicKey} value={t.topicKey}>{i + 1}. {t.label} ({t.questions.length} questions)</option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-1.5">Time Limit (minutes)</label>
                <input type="number" min={1} max={60} value={timeLimitMin} onChange={(e) => setTimeLimitMin(e.target.value)}
                  className="w-full px-3 py-2.5 bg-stone-50 border border-brand-border rounded-xl text-sm font-medium text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 transition-all" />
              </div>
            </form>
          </div>

          <div className="flex gap-3 px-6 py-4 border-t border-brand-border/60">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 text-sm font-bold text-stone-600 border border-brand-border rounded-xl hover:bg-stone-50 transition-all">
              Cancel
            </button>
            <button type="submit" form="create-test-form" disabled={submitting || !selectedTopic}
              className="flex-1 py-2.5 text-sm font-black text-white bg-brand-dark rounded-xl hover:bg-brand-dark/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              {submitting
                ? <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Setting up...</>
                : <>Create & Assign <ArrowRight className="w-4 h-4" /></>}
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}

// ── Custom test modal — full teacher-authored test from scratch ──
// Title, topic key, grading mode (auto or teacher-marked), and sub-skills are
// all set by the teacher. Questions are added afterward on the Topic Overview
// page via AddQuestionModal, which already supports MCQ / short-answer / open-text.

function CustomTestModal({ session, subjects, onClose, onCreated }: {
  session: TeacherSession; subjects: Subject[]; onClose: () => void; onCreated: (testId: number) => void;
}) {
  const [title, setTitle] = useState('');
  const [topicKey, setTopicKey] = useState('');
  const [subjectId, setSubjectId] = useState<string>('');
  const [grade, setGrade] = useState('10');
  const [term, setTerm] = useState('1');
  const [timeLimitMin, setTimeLimitMin] = useState('10');
  const [gradingMode, setGradingMode] = useState<GradingMode>('auto');
  const [subskills, setSubskills] = useState<string[]>(['']);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateSubskill(i: number, value: string) {
    setSubskills((s) => s.map((v, idx) => (idx === i ? value : v)));
  }
  function addSubskillField() { setSubskills((s) => [...s, '']); }
  function removeSubskillField(i: number) { setSubskills((s) => s.filter((_, idx) => idx !== i)); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const cleanSubskills = subskills.map((s) => s.trim()).filter(Boolean);
    if (!subjectId) { setError('Select a subject.'); return; }
    if (cleanSubskills.length === 0) { setError('Add at least one sub-skill.'); return; }

    setSubmitting(true);
    const result = await createTopicTest({
      school_id: session.school_id,
      teacher_id: session.teacher_id,
      subject_id: parseInt(subjectId),
      grade: parseInt(grade),
      term: parseInt(term),
      topic_key: topicKey.trim() || title.trim(),
      title: title.trim(),
      time_limit_seconds: parseInt(timeLimitMin) * 60,
      grading_mode: gradingMode,
      subskills: cleanSubskills,
    });
    setSubmitting(false);

    if (!result.success) { setError(result.error); return; }
    onCreated(result.test.id);
  }

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
          <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-brand-border/60">
            <div>
              <h2 className="text-lg font-black text-brand-dark">Build Custom Test</h2>
              <p className="text-xs text-stone-500 mt-0.5">Full control — set your own title, sub-skills, and question types.</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-stone-100 text-stone-500 hover:text-stone-700 transition-colors shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="overflow-y-auto flex-1 px-6 py-4">
            <form id="custom-test-form" onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-1.5">Test Title</label>
                <input required value={title} onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Linear Equations"
                  className="w-full px-3 py-2.5 bg-stone-50 border border-brand-border rounded-xl text-sm font-medium text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 transition-all" />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-1.5">
                  Topic Key <span className="normal-case font-medium text-stone-400">(optional identifier)</span>
                </label>
                <input value={topicKey} onChange={(e) => setTopicKey(e.target.value)}
                  placeholder="e.g. LinearEquations"
                  className="w-full px-3 py-2.5 bg-stone-50 border border-brand-border rounded-xl text-sm font-medium text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 transition-all" />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-1.5">Subject</label>
                  <select required value={subjectId} onChange={(e) => setSubjectId(e.target.value)}
                    className="w-full px-3 py-2.5 bg-stone-50 border border-brand-border rounded-xl text-sm font-medium text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 transition-all">
                    <option value="">Select</option>
                    {subjects.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-1.5">Grade</label>
                  <select value={grade} onChange={(e) => setGrade(e.target.value)}
                    className="w-full px-3 py-2.5 bg-stone-50 border border-brand-border rounded-xl text-sm font-medium text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 transition-all">
                    {GRADES.map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-1.5">Term</label>
                  <select value={term} onChange={(e) => setTerm(e.target.value)}
                    className="w-full px-3 py-2.5 bg-stone-50 border border-brand-border rounded-xl text-sm font-medium text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 transition-all">
                    {[1, 2, 3, 4].map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-2">Grading</label>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setGradingMode('auto')}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all ${gradingMode === 'auto' ? 'bg-brand-dark text-white' : 'bg-stone-50 border border-brand-border text-stone-600'}`}>
                    Auto-graded (MCQ / short answer)
                  </button>
                  <button type="button" onClick={() => setGradingMode('manual')}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all ${gradingMode === 'manual' ? 'bg-brand-dark text-white' : 'bg-stone-50 border border-brand-border text-stone-600'}`}>
                    Teacher-marked (open text)
                  </button>
                </div>
                <p className="text-xs text-stone-400 mt-1.5">
                  {gradingMode === 'auto'
                    ? 'Questions are graded instantly against a correct answer you set.'
                    : 'Students write free-text answers you mark yourself after they submit.'}
                </p>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-1.5">Time Limit (minutes)</label>
                <input type="number" min={1} max={60} value={timeLimitMin} onChange={(e) => setTimeLimitMin(e.target.value)}
                  className="w-full px-3 py-2.5 bg-stone-50 border border-brand-border rounded-xl text-sm font-medium text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 transition-all" />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-2">
                  Sub-skills <span className="normal-case font-medium text-stone-400">(fixed diagnostic tags — each question maps to one)</span>
                </label>
                <div className="space-y-2">
                  {subskills.map((s, i) => (
                    <div key={i} className="flex gap-2">
                      <input value={s} onChange={(e) => updateSubskill(i, e.target.value)}
                        placeholder="e.g. Isolating the variable"
                        className="flex-1 px-3 py-2.5 bg-stone-50 border border-brand-border rounded-xl text-sm font-medium text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 transition-all" />
                      {subskills.length > 1 && (
                        <button type="button" onClick={() => removeSubskillField(i)}
                          className="p-2.5 rounded-xl hover:bg-red-50 text-stone-400 hover:text-red-500 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button type="button" onClick={addSubskillField}
                  className="mt-2 flex items-center gap-1.5 text-xs font-black text-stone-500 hover:text-brand-dark transition-colors">
                  <Plus className="w-3.5 h-3.5" /> Add sub-skill
                </button>
              </div>
            </form>
          </div>

          <div className="flex gap-3 px-6 py-4 border-t border-brand-border/60">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 text-sm font-bold text-stone-600 border border-brand-border rounded-xl hover:bg-stone-50 transition-all">
              Cancel
            </button>
            <button type="submit" form="custom-test-form" disabled={submitting}
              className="flex-1 py-2.5 text-sm font-black text-white bg-brand-dark rounded-xl hover:bg-brand-dark/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              {submitting
                ? <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating...</>
                : <>Create & Add Questions <ArrowRight className="w-4 h-4" /></>}
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}

// ── Assign modal ────────────────────────────────────────────────

function AssignModal({ session, test, onClose, onAssigned }: {
  session: TeacherSession; test: TopicTest; onClose: () => void; onAssigned: () => void;
}) {
  const [closesInDays, setClosesInDays] = useState('7');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAssign() {
    setSubmitting(true);
    setError(null);
    const closes_at = closesInDays
      ? new Date(Date.now() + parseInt(closesInDays) * 24 * 60 * 60 * 1000).toISOString()
      : undefined;
    const result = await assignTopicTest({
      topic_test_id: test.id,
      teacher_id: session.teacher_id,
      school_id: session.school_id,
      subject_id: test.subject_id,
      grade: test.grade,
      closes_at,
    });
    setSubmitting(false);
    if (!result.success) { setError(result.error); return; }
    setDone(true);
  }

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
          <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-brand-border/60">
            <div>
              <h2 className="text-lg font-black text-brand-dark">Assign Test</h2>
              <p className="text-xs text-stone-500 mt-0.5">{test.title}</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-stone-100 text-stone-500 hover:text-stone-700 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="px-6 py-5">
            {done ? (
              <div className="text-center py-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                </div>
                <p className="font-bold text-brand-dark">Assigned</p>
                <p className="text-xs text-stone-500 mt-1">Students in this subject/grade will now see the test in their portal.</p>
              </div>
            ) : (
              <>
                {error && (
                  <div className="flex gap-3 p-3 bg-red-50 border border-red-200 rounded-xl mb-4">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-red-700">{error}</p>
                  </div>
                )}
                <div className="flex gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl mb-4">
                  <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-800">
                    This test stays invisible to students until you assign it. Once assigned, all students you teach for this subject/grade see it immediately.
                  </p>
                </div>
                <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-1.5">Closes in</label>
                <select
                  value={closesInDays}
                  onChange={(e) => setClosesInDays(e.target.value)}
                  className="w-full px-3 py-2.5 bg-stone-50 border border-brand-border rounded-xl text-sm font-medium text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 transition-all"
                >
                  <option value="1">1 day</option>
                  <option value="3">3 days</option>
                  <option value="7">7 days</option>
                  <option value="14">14 days</option>
                  <option value="">No end date</option>
                </select>
              </>
            )}
          </div>

          <div className="flex gap-3 px-6 py-4 border-t border-brand-border/60">
            {done ? (
              <button onClick={onAssigned}
                className="flex-1 py-2.5 text-sm font-black text-white bg-brand-dark rounded-xl hover:bg-brand-dark/90 transition-all">
                Done
              </button>
            ) : (
              <>
                <button onClick={onClose}
                  className="flex-1 py-2.5 text-sm font-bold text-stone-600 border border-brand-border rounded-xl hover:bg-stone-50 transition-all">
                  Cancel
                </button>
                <button onClick={handleAssign} disabled={submitting}
                  className="flex-1 py-2.5 text-sm font-black text-white bg-brand-dark rounded-xl hover:bg-brand-dark/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                  {submitting
                    ? <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Assigning...</>
                    : <><Send className="w-4 h-4" /> Assign</>}
                </button>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
}

// ── Topic overview — real sub-skill breakdown + question management ──

function TopicOverview({ topicTestId, onBack, onMark }: { topicTestId: number; onBack: () => void; onMark: () => void }) {
  const [full, setFull] = useState<TopicTestFull | null>(null);
  const [overview, setOverviewData] = useState<TopicOverviewData | null>(null);
  const [assignments, setAssignments] = useState<TopicTestAssignment[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showAddQuestion, setShowAddQuestion] = useState(false);

  async function reload() {
    const [f, o, a, pending] = await Promise.all([
      fetchTopicTestFull(topicTestId),
      fetchTopicOverview(topicTestId),
      fetchTestAssignments(topicTestId),
      fetchPendingMarking(topicTestId),
    ]);
    setFull(f);
    setOverviewData(o);
    setAssignments(a);
    setPendingCount(pending.length);
  }

  useEffect(() => {
    setLoading(true);
    reload().finally(() => setLoading(false));
  }, [topicTestId]);

  if (loading || !full || !overview) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-6 sm:p-6 md:p-8">
        <div className="flex items-center justify-center py-24">
          <div className="w-5 h-5 border-2 border-brand-border border-t-stone-700 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  const activeAssignment = assignments.find((a) => a.is_active);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:p-6 md:p-8">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm font-bold text-stone-500 hover:text-brand-dark mb-4 transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Topic Tests
      </button>

      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-brand-dark">{full.test.title} — Topic Overview</h2>
          <p className="text-sm text-stone-500 mt-1">
            {activeAssignment ? (
              <>{overview.attemptedCount} of {overview.totalAssigned} students completed{overview.avgScore !== null ? ` · avg ${overview.avgScore}%` : ''}</>
            ) : (
              'Not yet assigned to a class'
            )}
          </p>
        </div>
        {pendingCount > 0 && (
          <button onClick={onMark}
            className="shrink-0 flex items-center gap-2 bg-blue-600 text-white text-xs font-black px-4 py-2.5 rounded-xl hover:bg-blue-700 transition-colors">
            <PenLine className="w-3.5 h-3.5" /> Mark {pendingCount} response{pendingCount !== 1 ? 's' : ''}
          </button>
        )}
      </div>

      {/* Sub-skill breakdown */}
      <div className="card-premium bg-white border border-brand-border rounded-[24px] p-6 mb-6">
        <p className="text-[11px] font-black uppercase tracking-widest text-stone-500 mb-4">Class-wide sub-skill breakdown</p>
        {overview.subskills.every((s) => s.totalCount === 0) ? (
          <p className="text-sm text-stone-500">No attempts submitted yet.</p>
        ) : (
          <div className="space-y-4">
            {overview.subskills
              .slice()
              .sort((a, b) => a.correctPct - b.correctPct)
              .map((sk) => {
                const c = subskillColor(sk.correctPct);
                return (
                  <div key={sk.subskill_id}>
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-sm font-bold text-brand-dark">{sk.label}</p>
                      <span className={`text-xs font-black px-2 py-0.5 rounded-full ${c.bg} ${c.text}`}>
                        {sk.totalCount > 0 ? `${sk.correctPct}% correct` : 'No data'}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${c.bar}`} style={{ width: `${sk.correctPct}%` }} />
                    </div>
                  </div>
                );
              })}
          </div>
        )}
        <p className="text-xs text-stone-400 mt-4">
          Sorted lowest-first — the sub-skills most students are struggling with float to the top.
        </p>
      </div>

      {/* Per-student results */}
      <div className="card-premium bg-white border border-brand-border rounded-[24px] overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-brand-border/60">
          <p className="text-[11px] font-black uppercase tracking-widest text-stone-500">Individual results</p>
        </div>
        {overview.students.length === 0 ? (
          <p className="px-6 py-8 text-sm text-stone-500 text-center">No students have completed this test yet.</p>
        ) : (
          <div className="divide-y divide-stone-50">
            {overview.students.map((row) => (
              <div key={row.student_id} className="flex items-center justify-between px-6 py-3.5">
                <div>
                  <p className="text-sm font-bold text-brand-dark">{row.student_surname}, {row.student_name}</p>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {row.weakestSubskills.length === 0 ? 'None — strong across the board' : `Struggling: ${row.weakestSubskills.join(', ')}`}
                  </p>
                </div>
                <span className={`text-xs font-black px-2.5 py-1 rounded-full ${
                  (row.score_pct ?? 0) >= 70 ? 'bg-emerald-50 text-emerald-700' : (row.score_pct ?? 0) >= 50 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-600'
                }`}>
                  {row.score_pct ?? 0}%
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Questions */}
      <div className="card-premium bg-white border border-brand-border rounded-[24px] p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[11px] font-black uppercase tracking-widest text-stone-500">Questions in this test</p>
          <button onClick={() => setShowAddQuestion(true)}
            className="flex items-center gap-1.5 text-xs font-black text-stone-500 hover:text-brand-dark transition-colors">
            <Plus className="w-3.5 h-3.5" /> Add question
          </button>
        </div>
        {full.questions.length === 0 ? (
          <p className="text-sm text-stone-500">No questions yet — add at least one before assigning this test.</p>
        ) : (
          <div className="space-y-3">
            {full.questions.map((q, i) => {
              const sk = full.subskills.find((s) => s.id === q.subskill_id);
              return (
                <div key={q.id} className="flex items-start gap-3 bg-stone-50 rounded-xl px-4 py-3">
                  <span className="w-5 h-5 rounded-full bg-brand-dark text-white text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-brand-dark">{q.prompt}</p>
                    <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 bg-white border border-brand-border text-[10px] font-black text-stone-500 rounded-full">
                      {sk?.label ?? 'Unknown sub-skill'}
                    </span>
                  </div>
                  <button
                    onClick={async () => { await deleteTopicTestQuestion(q.id); await reload(); }}
                    className="shrink-0 p-1.5 rounded-lg hover:bg-red-50 text-stone-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <AnimatePresence>
        {showAddQuestion && (
          <AddQuestionModal
            full={full}
            onClose={() => setShowAddQuestion(false)}
            onAdded={async () => { setShowAddQuestion(false); await reload(); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function subskillColor(pct: number) {
  if (pct >= 70) return { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', bar: 'bg-emerald-500' };
  if (pct >= 50) return { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', bar: 'bg-amber-500' };
  return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', bar: 'bg-red-500' };
}

// ── Add question modal ──────────────────────────────────────────

function AddQuestionModal({ full, onClose, onAdded }: {
  full: TopicTestFull; onClose: () => void; onAdded: () => void;
}) {
  const isManual = full.test.grading_mode === 'manual';
  const [subskillId, setSubskillId] = useState<string>(full.subskills[0]?.id.toString() ?? '');
  const [questionType, setQuestionType] = useState<QuestionType>(isManual ? 'open_text' : 'short_answer');
  const [prompt, setPrompt] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [tolerance, setTolerance] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!subskillId) { setError('Select a sub-skill.'); return; }
    if (!prompt.trim()) { setError('Enter a question prompt.'); return; }
    if (questionType !== 'open_text' && !correctAnswer.trim()) { setError('Enter the correct answer.'); return; }
    if (questionType === 'mcq' && options.filter((o) => o.trim()).length < 2) {
      setError('Add at least 2 options.'); return;
    }

    setSubmitting(true);
    const result = await addTopicTestQuestion({
      topic_test_id: full.test.id,
      subskill_id: parseInt(subskillId),
      question_type: questionType,
      prompt,
      options: questionType === 'mcq' ? options.filter((o) => o.trim()) : undefined,
      correct_answer: questionType === 'open_text' ? undefined : correctAnswer,
      answer_tolerance: questionType === 'short_answer' && tolerance ? parseFloat(tolerance) : undefined,
    });
    setSubmitting(false);
    if (!result.success) { setError(result.error); return; }
    onAdded();
  }

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
          <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-brand-border/60">
            <h2 className="text-lg font-black text-brand-dark">Add Question</h2>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-stone-100 text-stone-500 hover:text-stone-700 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="overflow-y-auto flex-1 px-6 py-4">
            <form id="add-question-form" onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-1.5">Sub-skill</label>
                <select value={subskillId} onChange={(e) => setSubskillId(e.target.value)}
                  className="w-full px-3 py-2.5 bg-stone-50 border border-brand-border rounded-xl text-sm font-medium text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 transition-all">
                  {full.subskills.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
              </div>

              {!isManual && (
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-1.5">Question Type</label>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setQuestionType('mcq')}
                      className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${questionType === 'mcq' ? 'bg-brand-dark text-white' : 'bg-stone-50 border border-brand-border text-stone-600'}`}>
                      Multiple Choice
                    </button>
                    <button type="button" onClick={() => setQuestionType('short_answer')}
                      className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${questionType === 'short_answer' ? 'bg-brand-dark text-white' : 'bg-stone-50 border border-brand-border text-stone-600'}`}>
                      Short Answer
                    </button>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-1.5">Prompt</label>
                <textarea required value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={isManual ? 3 : 2}
                  placeholder={isManual ? 'e.g. Explain why the accounting equation must always balance.' : 'e.g. Solve for x: 3x + 5 = 20'}
                  className="w-full px-3 py-2.5 bg-stone-50 border border-brand-border rounded-xl text-sm font-medium text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 transition-all resize-none" />
              </div>

              {questionType === 'open_text' ? (
                <div className="flex gap-3 p-3 bg-blue-50 border border-blue-200 rounded-xl">
                  <PenLine className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-800">
                    Students answer in free text. There's no auto-grading — you'll mark each response correct or incorrect after they submit.
                  </p>
                </div>
              ) : questionType === 'mcq' ? (
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-1.5">Options</label>
                  <div className="space-y-2">
                    {options.map((opt, i) => (
                      <input key={i} value={opt} onChange={(e) => setOptions((o) => o.map((v, idx) => idx === i ? e.target.value : v))}
                        placeholder={`Option ${i + 1}`}
                        className="w-full px-3 py-2 bg-stone-50 border border-brand-border rounded-xl text-sm font-medium text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 transition-all" />
                    ))}
                  </div>
                  <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-1.5 mt-3">Correct Option</label>
                  <select value={correctAnswer} onChange={(e) => setCorrectAnswer(e.target.value)}
                    className="w-full px-3 py-2.5 bg-stone-50 border border-brand-border rounded-xl text-sm font-medium text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 transition-all">
                    <option value="">Select correct option</option>
                    {options.filter((o) => o.trim()).map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-1.5">Correct Answer</label>
                    <input required value={correctAnswer} onChange={(e) => setCorrectAnswer(e.target.value)}
                      placeholder="e.g. 5"
                      className="w-full px-3 py-2.5 bg-stone-50 border border-brand-border rounded-xl text-sm font-medium text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-1.5">
                      Tolerance <span className="normal-case font-medium text-stone-400">(optional, for numeric answers)</span>
                    </label>
                    <input type="number" step="any" value={tolerance} onChange={(e) => setTolerance(e.target.value)}
                      placeholder="e.g. 0.5"
                      className="w-full px-3 py-2.5 bg-stone-50 border border-brand-border rounded-xl text-sm font-medium text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 transition-all" />
                  </div>
                </>
              )}
            </form>
          </div>

          <div className="flex gap-3 px-6 py-4 border-t border-brand-border/60">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 text-sm font-bold text-stone-600 border border-brand-border rounded-xl hover:bg-stone-50 transition-all">
              Cancel
            </button>
            <button type="submit" form="add-question-form" disabled={submitting}
              className="flex-1 py-2.5 text-sm font-black text-white bg-brand-dark rounded-xl hover:bg-brand-dark/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              {submitting
                ? <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Adding...</>
                : 'Add Question'}
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}

// ── Marking screen — teacher marks open_text answers correct/incorrect ──

function MarkingScreen({ topicTestId, onBack }: { topicTestId: number; onBack: () => void }) {
  const [pending, setPending] = useState<PendingMarkingAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);

  async function reload() {
    const data = await fetchPendingMarking(topicTestId);
    setPending(data);
  }

  useEffect(() => {
    setLoading(true);
    reload().finally(() => setLoading(false));
  }, [topicTestId]);

  async function handleMark(answerId: number, attemptId: number, isCorrect: boolean) {
    setSavingId(answerId);
    await markAnswer(answerId, isCorrect);
    await finalizeAttemptGrading(attemptId);
    await reload();
    setSavingId(null);
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-6 sm:p-6 md:p-8">
        <div className="flex items-center justify-center py-24">
          <div className="w-5 h-5 border-2 border-brand-border border-t-stone-700 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:p-6 md:p-8">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm font-bold text-stone-500 hover:text-brand-dark mb-4 transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Topic Overview
      </button>

      <div className="mb-6">
        <h2 className="text-lg font-black text-brand-dark">Mark Responses</h2>
        <p className="text-sm text-stone-500 mt-1">
          {pending.length === 0 ? 'Nothing left to mark.' : `${pending.length} student${pending.length !== 1 ? 's' : ''} awaiting marks`}
        </p>
      </div>

      {pending.length === 0 ? (
        <div className="card-premium bg-white border border-brand-border rounded-[24px] p-12 text-center">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="font-bold text-brand-dark mb-1">All caught up</p>
          <p className="text-sm text-stone-500">Every submitted response has been marked.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {pending.map((row) => (
            <div key={row.attempt.id} className="card-premium bg-white border border-brand-border rounded-[24px] overflow-hidden">
              <div className="px-6 py-4 border-b border-brand-border/60">
                <p className="text-sm font-black text-brand-dark">{row.student_surname}, {row.student_name}</p>
                <p className="text-xs text-stone-500 mt-0.5">
                  {row.answers.length} response{row.answers.length !== 1 ? 's' : ''} to mark
                </p>
              </div>
              <div className="divide-y divide-stone-50">
                {row.answers.map((ans) => (
                  <div key={ans.id} className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-stone-100 text-stone-500 text-[10px] font-black rounded-full mb-2">
                      {ans.subskill_label}
                    </span>
                    <p className="text-sm font-bold text-brand-dark mb-2">{ans.question.prompt}</p>
                    <div className="bg-stone-50 rounded-xl px-4 py-3 mb-3">
                      <p className="text-sm text-stone-700 whitespace-pre-wrap">{ans.student_answer || <span className="text-stone-400 italic">No answer given</span>}</p>
                    </div>
                    {ans.graded_at ? (
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black ${
                        ans.is_correct ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
                      }`}>
                        {ans.is_correct ? <CheckCircle2 className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        Marked {ans.is_correct ? 'correct' : 'incorrect'}
                      </span>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleMark(ans.id, row.attempt.id, true)}
                          disabled={savingId === ans.id}
                          className="flex-1 py-2 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-black hover:bg-emerald-100 transition-colors disabled:opacity-50"
                        >
                          Correct
                        </button>
                        <button
                          onClick={() => handleMark(ans.id, row.attempt.id, false)}
                          disabled={savingId === ans.id}
                          className="flex-1 py-2 rounded-xl bg-red-50 text-red-600 text-xs font-black hover:bg-red-100 transition-colors disabled:opacity-50"
                        >
                          Incorrect
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
