import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ClipboardCheck, Clock, ChevronRight, X, Send, Plus, Trash2,
  CheckCircle2, AlertCircle, BarChart3, ArrowLeft, ArrowRight, PenLine, Pencil, BookOpenCheck,
} from 'lucide-react';
import type { TeacherSession } from '../../../lib/auth';
import { Shimmer } from '../../../shared/components/Shimmer';
import { fetchSubjects, type Subject } from '../../../lib/students';
import {
  fetchTeacherTopicTests, seedCatalogTest, createTopicTest, deleteTopicTest,
  fetchTopicTestFull, addTopicTestQuestion, deleteTopicTestQuestion,
  assignTopicTest, fetchTestAssignments, fetchTopicOverview,
  fetchPendingMarking, markAnswer, finalizeAttemptGrading, getCatalogTopics,
  fetchAttemptDetail,
  type TopicTestGroup, type TopicTest, type TopicTestFull,
  type TopicTestAssignment, type TopicOverviewData, type QuestionType,
  type GradingMode, type PendingMarkingAttempt, type AttemptDetail,
} from '../../../lib/topicTests';

const ease = [0.23, 1, 0.32, 1] as [number, number, number, number];

interface TopicTestsPageProps {
  session: TeacherSession;
  initialTestId?: number | null;
  onConsumeInitialTestId?: () => void;
}

const GRADES = [8, 9, 10, 11, 12];

// ── Shared modal chrome classes ──
// One recipe so every dialog in this file reads as the same system: plain
// border (no shadow+border ghost-card stack), 16px radius, explicit
// <300ms transitions, no `transition-all`.
const FIELD_LABEL = 'block text-[11px] font-semibold uppercase tracking-wide text-stone-500 mb-1.5';
const FIELD_INPUT = 'w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-medium text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 transition-colors duration-150';
const MODAL_BACKDROP = 'fixed inset-0 bg-black/30 z-40';
const MODAL_PANEL = 'bg-white rounded-2xl border border-stone-200 w-full max-w-lg max-h-[90vh] flex flex-col';
const MODAL_HEADER = 'flex items-center justify-between px-6 pt-6 pb-4 border-b border-stone-100';
const MODAL_FOOTER = 'flex gap-2.5 px-6 py-4 border-t border-stone-100';
const BTN_SECONDARY = 'flex-1 py-2.5 text-sm font-medium text-stone-600 border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors duration-150';
const BTN_PRIMARY = 'flex-1 py-2.5 text-sm font-semibold text-white bg-brand-dark rounded-xl hover:bg-stone-800 transition-colors duration-150 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2';

function subjectsForGrade(subjects: Subject[], grade: string): Subject[] {
  return subjects.filter((s) => s.grades.split(',').map((g) => g.trim()).includes(grade));
}

type View = 'list' | 'overview' | 'marking';

export default function TopicTestsPage({ session, initialTestId, onConsumeInitialTestId }: TopicTestsPageProps) {
  const [view, setView] = useState<View>(initialTestId ? 'overview' : 'list');
  const [groups, setGroups] = useState<TopicTestGroup[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTestId, setSelectedTestId] = useState<number | null>(initialTestId ?? null);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    if (initialTestId) {
      setSelectedTestId(initialTestId);
      setView('overview');
      onConsumeInitialTestId?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialTestId]);

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
    <div className="student-home min-h-full pb-16">

      {/* ═══ Hero — full-width crested banner ═════════════════════ */}
      <div className="relative overflow-hidden bg-brand-dark border-b border-brand-border grain-surface flex flex-col justify-end min-h-[220px] sm:min-h-[260px] lg:min-h-[280px]">
        <div className="absolute inset-0 pointer-events-none">
          <motion.img src="/images/nizamiye-topictests.png" alt=""
            onLoad={() => setImgLoaded(true)}
            initial={{ opacity: 0 }} animate={{ opacity: imgLoaded ? 0.62 : 0 }}
            transition={{ duration: 0.6, ease }}
            className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(100deg, rgba(21,23,28,0.82) 0%, rgba(21,23,28,0.62) 35%, rgba(21,23,28,0.3) 62%, rgba(21,23,28,0.66) 100%)' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(21,23,28,0.05) 0%, transparent 35%, rgba(21,23,28,0.75) 100%)' }} />
        </div>
        <div className="absolute -bottom-32 -left-24 w-[24rem] h-[24rem] rounded-full blur-3xl opacity-[0.08] pointer-events-none" style={{ background: 'radial-gradient(circle, var(--color-accent), transparent 70%)' }} />
        <div className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-8 sm:pt-11 pb-8 sm:pb-10 w-full flex items-end justify-between gap-4 flex-wrap">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }}>
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-white/45">Portal</p>
            <h1 className="font-display font-extrabold text-white text-[28px] sm:text-[36px] mt-2 leading-[1.1]" style={{ letterSpacing: '-0.02em', textShadow: '0 2px 20px rgba(0,0,0,0.35)' }}>Topic Tests</h1>
            <p className="text-[13px] text-white/60 mt-2.5 font-medium max-w-md">
              Short, timed tests that pinpoint exactly what a student is struggling with — invisible to students until you assign them.
            </p>
          </motion.div>
          <div className="flex items-center gap-2 shrink-0">
            <motion.button onClick={() => setShowCustomCreate(true)} whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 bg-white/10 border border-white/20 text-white text-sm font-black px-5 py-2.5 rounded backdrop-blur-sm hover:bg-white/15 transition-colors">
              <Pencil className="w-4 h-4" /> Build Custom Test
            </motion.button>
            <motion.button onClick={() => setShowCreate(true)} whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}
              className="edge-glow flex items-center gap-2 bg-accent text-white text-sm font-black px-5 py-2.5 rounded transition-colors duration-200 hover:bg-[#2a3350]">
              <Plus className="w-4 h-4" /> Assign Test
            </motion.button>
          </div>
        </div>
      </div>

      {/* ═══ Body ═══════════════════════════════════════════════ */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 relative z-10 space-y-5 sm:space-y-6 pt-6 sm:pt-8">

      {loading ? (
        <div className="space-y-2.5 max-w-2xl">
          {[0, 1, 2].map(i => (
            <div key={i} className="paper-card rounded p-4 flex items-center gap-3">
              <Shimmer className="w-9 h-9 rounded shrink-0" />
              <div className="flex-1 space-y-2">
                <Shimmer className="h-4" style={{ width: `${50 - i * 6}%` }} />
                <Shimmer className="h-3 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : allTests.length === 0 ? (
        <div className="paper-card rounded p-12 text-center">
          <div className="w-11 h-11 rounded-xl bg-stone-100 flex items-center justify-center mx-auto mb-4">
            <ClipboardCheck className="w-5 h-5 text-stone-500" />
          </div>
          <p className="font-semibold text-brand-dark mb-1">No topic tests yet</p>
          <p className="text-sm text-stone-500 mb-6">Create your first test to start diagnosing exactly where students struggle.</p>
          <button onClick={() => setShowCreate(true)}
            className="inline-flex items-center gap-2 text-sm font-medium text-stone-700 hover:text-brand-dark border border-stone-200 hover:border-stone-300 px-5 py-2.5 rounded-xl transition-colors duration-150">
            Assign Test <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {groups.map((group) => (
            <div key={group.key}>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-stone-500 mb-2">
                {group.subject_label} · Grade {group.grade}
              </p>
              <div className="space-y-2.5">
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
      </div>

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
              transition={{ duration: 0.15 }}
              onClick={() => setConfirmDelete(null)} className="fixed inset-0 bg-black/30 z-40" />
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 8 }}
              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-2xl border border-stone-200 w-full max-w-sm p-6">
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center mb-4">
                  <Trash2 className="w-5 h-5 text-red-500" />
                </div>
                <h2 className="text-base font-semibold text-brand-dark mb-1">Delete test?</h2>
                <p className="text-sm text-stone-500 mb-6 leading-relaxed">
                  This will permanently delete <span className="font-medium text-brand-dark">{confirmDelete.title}</span>, its questions, assignments, and all student results.
                </p>
                <div className="flex gap-2.5">
                  <button onClick={() => setConfirmDelete(null)}
                    className="flex-1 py-2.5 text-sm font-medium text-stone-600 border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors duration-150">
                    Cancel
                  </button>
                  <button onClick={handleDelete} disabled={deleting}
                    className="flex-1 py-2.5 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors duration-150 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2">
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
    <div className="paper-card rounded overflow-hidden">
      <div className="px-5 py-4 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-stone-100 flex items-center justify-center shrink-0">
            <ClipboardCheck className="w-4 h-4 text-stone-600" strokeWidth={2.25} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-[15px] font-semibold text-brand-dark">{test.title}</h3>
              {test.grading_mode === 'manual' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 text-[11px] font-medium rounded-full">
                  <PenLine className="w-2.5 h-2.5" /> Teacher-marked
                </span>
              )}
            </div>
            <p className="text-xs text-stone-500 mt-1">Term {test.term} · Topic: {test.topic_key}</p>
            <div className="flex items-center gap-3 mt-1.5 text-xs text-stone-500">
              <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" /> {Math.round(test.time_limit_seconds / 60)} min timer</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button onClick={onDelete} className="p-2 rounded-lg hover:bg-red-50 text-stone-400 hover:text-red-500 transition-colors duration-150">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button onClick={onAssign}
            className="flex items-center gap-1.5 bg-brand-dark text-white text-xs font-medium px-3.5 py-2 rounded-lg hover:bg-stone-800 transition-colors duration-150 active:scale-[0.97]">
            <Send className="w-3.5 h-3.5" /> Assign
          </button>
        </div>
      </div>
      <button onClick={onOverview}
        className="w-full flex items-center justify-between px-5 py-3 border-t border-stone-100 text-sm font-medium text-stone-600 hover:bg-stone-50 transition-colors duration-150">
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

  const gradeSubjects = subjectsForGrade(subjects, grade);
  const selectedSubject = gradeSubjects.find((s) => String(s.id) === subjectId);
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
        transition={{ duration: 0.15 }}
        onClick={onClose} className={MODAL_BACKDROP} />
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 8 }}
        transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className={MODAL_PANEL}>
          <div className={MODAL_HEADER}>
            <div>
              <h2 className="text-lg font-semibold text-brand-dark">Assign Test</h2>
              <p className="text-xs text-stone-500 mt-0.5">Pick a ready-made CAPS topic test — questions are already set and auto-graded.</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-stone-100 text-stone-500 hover:text-stone-700 transition-colors duration-150 shrink-0">
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
                  <label className={FIELD_LABEL}>Grade</label>
                  <select value={grade} onChange={(e) => { setGrade(e.target.value); setSubjectId(''); setTopicKey(''); }}
                    className={FIELD_INPUT}>
                    {GRADES.map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label className={FIELD_LABEL}>Term</label>
                  <select value={term} onChange={(e) => { setTerm(e.target.value); setTopicKey(''); }}
                    className={FIELD_INPUT}>
                    {[1, 2, 3, 4].map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className={FIELD_LABEL}>Subject</label>
                  <select required value={subjectId} onChange={(e) => { setSubjectId(e.target.value); setTopicKey(''); }}
                    className={FIELD_INPUT}>
                    <option value="">Select</option>
                    {gradeSubjects.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className={FIELD_LABEL}>
                  Topic <span className="normal-case font-normal text-stone-400">(CAPS order)</span>
                </label>
                {!selectedSubject ? (
                  <p className="text-sm text-stone-400 py-2">Select a subject first.</p>
                ) : availableTopics.length === 0 ? (
                  <p className="text-sm text-stone-400 py-2">No predefined tests available yet for this subject/grade/term.</p>
                ) : (
                  <select required value={topicKey} onChange={(e) => setTopicKey(e.target.value)}
                    className={FIELD_INPUT}>
                    <option value="">Select a topic</option>
                    {availableTopics.map((t, i) => (
                      <option key={t.topicKey} value={t.topicKey}>{i + 1}. {t.label} ({t.questions.length} questions)</option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className={FIELD_LABEL}>Time Limit (minutes)</label>
                <input type="number" min={1} max={60} value={timeLimitMin} onChange={(e) => setTimeLimitMin(e.target.value)}
                  className={FIELD_INPUT} />
              </div>
            </form>
          </div>

          <div className={MODAL_FOOTER}>
            <button type="button" onClick={onClose} className={BTN_SECONDARY}>
              Cancel
            </button>
            <button type="submit" form="create-test-form" disabled={submitting || !selectedTopic} className={BTN_PRIMARY}>
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
        transition={{ duration: 0.15 }}
        onClick={onClose} className={MODAL_BACKDROP} />
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 8 }}
        transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className={MODAL_PANEL}>
          <div className={MODAL_HEADER}>
            <div>
              <h2 className="text-lg font-semibold text-brand-dark">Build Custom Test</h2>
              <p className="text-xs text-stone-500 mt-0.5">Full control — set your own title, sub-skills, and question types.</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-stone-100 text-stone-500 hover:text-stone-700 transition-colors duration-150 shrink-0">
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
                <label className={FIELD_LABEL}>Test Title</label>
                <input required value={title} onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Linear Equations"
                  className={FIELD_INPUT} />
              </div>

              <div>
                <label className={FIELD_LABEL}>
                  Topic Key <span className="normal-case font-normal text-stone-400">(optional identifier)</span>
                </label>
                <input value={topicKey} onChange={(e) => setTopicKey(e.target.value)}
                  placeholder="e.g. LinearEquations"
                  className={FIELD_INPUT} />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className={FIELD_LABEL}>Grade</label>
                  <select value={grade} onChange={(e) => { setGrade(e.target.value); setSubjectId(''); }}
                    className={FIELD_INPUT}>
                    {GRADES.map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label className={FIELD_LABEL}>Term</label>
                  <select value={term} onChange={(e) => setTerm(e.target.value)}
                    className={FIELD_INPUT}>
                    {[1, 2, 3, 4].map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className={FIELD_LABEL}>Subject</label>
                  <select required value={subjectId} onChange={(e) => setSubjectId(e.target.value)}
                    className={FIELD_INPUT}>
                    <option value="">Select</option>
                    {subjectsForGrade(subjects, grade).map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className={FIELD_LABEL.replace('mb-1.5', 'mb-2')}>Grading</label>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setGradingMode('auto')}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-colors duration-150 ${gradingMode === 'auto' ? 'bg-brand-dark text-white' : 'bg-stone-50 border border-stone-200 text-stone-600'}`}>
                    Auto-graded (MCQ / short answer)
                  </button>
                  <button type="button" onClick={() => setGradingMode('manual')}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-colors duration-150 ${gradingMode === 'manual' ? 'bg-brand-dark text-white' : 'bg-stone-50 border border-stone-200 text-stone-600'}`}>
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
                <label className={FIELD_LABEL}>Time Limit (minutes)</label>
                <input type="number" min={1} max={60} value={timeLimitMin} onChange={(e) => setTimeLimitMin(e.target.value)}
                  className={FIELD_INPUT} />
              </div>

              <div>
                <label className={FIELD_LABEL.replace('mb-1.5', 'mb-2')}>
                  Sub-skills <span className="normal-case font-normal text-stone-400">(fixed diagnostic tags — each question maps to one)</span>
                </label>
                <div className="space-y-2">
                  {subskills.map((s, i) => (
                    <div key={i} className="flex gap-2">
                      <input value={s} onChange={(e) => updateSubskill(i, e.target.value)}
                        placeholder="e.g. Isolating the variable"
                        className={`flex-1 ${FIELD_INPUT}`} />
                      {subskills.length > 1 && (
                        <button type="button" onClick={() => removeSubskillField(i)}
                          className="p-2.5 rounded-xl hover:bg-red-50 text-stone-400 hover:text-red-500 transition-colors duration-150">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button type="button" onClick={addSubskillField}
                  className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-brand-dark transition-colors duration-150">
                  <Plus className="w-3.5 h-3.5" /> Add sub-skill
                </button>
              </div>
            </form>
          </div>

          <div className={MODAL_FOOTER}>
            <button type="button" onClick={onClose} className={BTN_SECONDARY}>
              Cancel
            </button>
            <button type="submit" form="custom-test-form" disabled={submitting} className={BTN_PRIMARY}>
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
        transition={{ duration: 0.15 }}
        onClick={onClose} className={MODAL_BACKDROP} />
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 8 }}
        transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="bg-white rounded-2xl border border-stone-200 w-full max-w-md">
          <div className={MODAL_HEADER}>
            <div>
              <h2 className="text-lg font-semibold text-brand-dark">Assign Test</h2>
              <p className="text-xs text-stone-500 mt-0.5">{test.title}</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-stone-100 text-stone-500 hover:text-stone-700 transition-colors duration-150">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="px-6 py-5">
            {done ? (
              <div className="text-center py-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                </div>
                <p className="font-semibold text-brand-dark">Assigned</p>
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
                  <p className="text-xs text-amber-800 leading-relaxed">
                    This test stays invisible to students until you assign it. Once assigned, all students you teach for this subject/grade see it immediately.
                  </p>
                </div>
                <label className={FIELD_LABEL}>Closes in</label>
                <select
                  value={closesInDays}
                  onChange={(e) => setClosesInDays(e.target.value)}
                  className={FIELD_INPUT}
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

          <div className={MODAL_FOOTER}>
            {done ? (
              <button onClick={onAssigned} className={BTN_PRIMARY}>
                Done
              </button>
            ) : (
              <>
                <button onClick={onClose} className={BTN_SECONDARY}>
                  Cancel
                </button>
                <button onClick={handleAssign} disabled={submitting} className={BTN_PRIMARY}>
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
  const [viewAttemptId, setViewAttemptId] = useState<number | null>(null);

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
          <div className="w-5 h-5 border-2 border-stone-200 border-t-brand-dark rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  const activeAssignment = assignments.find((a) => a.is_active);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:p-6 md:p-8">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm font-medium text-stone-500 hover:text-brand-dark mb-4 transition-colors duration-150">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Topic Tests
      </button>

      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-brand-dark">{full.test.title} — Topic Overview</h2>
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
            className="shrink-0 flex items-center gap-2 bg-blue-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-blue-700 transition-colors duration-150 active:scale-[0.98]">
            <PenLine className="w-3.5 h-3.5" /> Mark {pendingCount} response{pendingCount !== 1 ? 's' : ''}
          </button>
        )}
      </div>

      {/* Sub-skill breakdown */}
      <div className="paper-card rounded p-6 mb-5">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-stone-500 mb-4">Class-wide sub-skill breakdown</p>
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
                      <p className="text-sm font-medium text-brand-dark">{sk.label}</p>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${c.bg} ${c.text}`}>
                        {sk.totalCount > 0 ? `${sk.correctPct}% correct` : 'No data'}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
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

      {/* Misconception patterns */}
      {overview.misconceptions.length > 0 && (
        <div className="paper-card rounded p-6 mb-5">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-stone-500 mb-1">Misconception patterns</p>
          <p className="text-xs text-stone-400 mb-4">Wrong answers that reveal a specific, recognisable error — not just "incorrect."</p>
          <div className="space-y-2.5">
            {overview.misconceptions.map((m) => (
              <div key={`${m.question_id}-${m.option}`} className="flex items-start gap-3 px-4 py-3 rounded-xl bg-amber-50 border border-amber-100">
                <span className="shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                  {m.count} student{m.count !== 1 ? 's' : ''}
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-stone-500">{m.subskill_label}</p>
                  <p className="text-sm text-brand-dark mt-0.5">{m.misconception}</p>
                  <p className="text-xs text-stone-400 mt-1 truncate">Chose "{m.option}" on: {m.prompt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Per-student results */}
      <div className="paper-card rounded overflow-hidden mb-5">
        <div className="px-6 py-4 border-b border-stone-100">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-stone-500">Individual results</p>
        </div>
        {overview.students.length === 0 ? (
          <p className="px-6 py-8 text-sm text-stone-500 text-center">No students have completed this test yet.</p>
        ) : (
          <div className="divide-y divide-stone-100">
            {overview.students.map((row) => (
              <button
                key={row.student_id}
                onClick={() => setViewAttemptId(row.attempt_id)}
                className="w-full flex items-center justify-between px-6 py-3.5 hover:bg-stone-50 transition-colors duration-150 text-left"
              >
                <div>
                  <p className="text-sm font-medium text-brand-dark">{row.student_surname}, {row.student_name}</p>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {row.weakestSubskills.length === 0 ? 'None — strong across the board' : `Struggling: ${row.weakestSubskills.join(', ')}`}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    (row.score_pct ?? 0) >= 70 ? 'bg-emerald-50 text-emerald-700' : (row.score_pct ?? 0) >= 50 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-600'
                  }`}>
                    {row.score_pct ?? 0}%
                  </span>
                  <ChevronRight className="w-4 h-4 text-stone-400" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {viewAttemptId && (
          <AttemptDetailModal attemptId={viewAttemptId} onClose={() => setViewAttemptId(null)} />
        )}
      </AnimatePresence>

      {/* Questions */}
      <div className="paper-card rounded p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-stone-500">Questions in this test</p>
          <button onClick={() => setShowAddQuestion(true)}
            className="flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-brand-dark transition-colors duration-150">
            <Plus className="w-3.5 h-3.5" /> Add question
          </button>
        </div>
        {full.questions.length === 0 ? (
          <p className="text-sm text-stone-500">No questions yet — add at least one before assigning this test.</p>
        ) : (
          <div className="space-y-2.5">
            {full.questions.map((q, i) => {
              const sk = full.subskills.find((s) => s.id === q.subskill_id);
              return (
                <div key={q.id} className="flex items-start gap-3 bg-stone-50 rounded-xl px-4 py-3">
                  <span className="w-5 h-5 rounded-full bg-brand-dark text-white text-[10px] font-semibold flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-brand-dark">{q.prompt}</p>
                    <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 bg-white border border-stone-200 text-[11px] font-medium text-stone-500 rounded-full">
                      {sk?.label ?? 'Unknown sub-skill'}
                    </span>
                  </div>
                  <button
                    onClick={async () => { await deleteTopicTestQuestion(q.id); await reload(); }}
                    className="shrink-0 p-1.5 rounded-lg hover:bg-red-50 text-stone-400 hover:text-red-500 transition-colors duration-150"
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
        transition={{ duration: 0.15 }}
        onClick={onClose} className={MODAL_BACKDROP} />
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 8 }}
        transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className={MODAL_PANEL}>
          <div className={MODAL_HEADER}>
            <h2 className="text-lg font-semibold text-brand-dark">Add Question</h2>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-stone-100 text-stone-500 hover:text-stone-700 transition-colors duration-150">
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
                <label className={FIELD_LABEL}>Sub-skill</label>
                <select value={subskillId} onChange={(e) => setSubskillId(e.target.value)}
                  className={FIELD_INPUT}>
                  {full.subskills.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
              </div>

              {!isManual && (
                <div>
                  <label className={FIELD_LABEL}>Question Type</label>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setQuestionType('mcq')}
                      className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-colors duration-150 ${questionType === 'mcq' ? 'bg-brand-dark text-white' : 'bg-stone-50 border border-stone-200 text-stone-600'}`}>
                      Multiple Choice
                    </button>
                    <button type="button" onClick={() => setQuestionType('short_answer')}
                      className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-colors duration-150 ${questionType === 'short_answer' ? 'bg-brand-dark text-white' : 'bg-stone-50 border border-stone-200 text-stone-600'}`}>
                      Short Answer
                    </button>
                  </div>
                </div>
              )}

              <div>
                <label className={FIELD_LABEL}>Prompt</label>
                <textarea required value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={isManual ? 3 : 2}
                  placeholder={isManual ? 'e.g. Explain why the accounting equation must always balance.' : 'e.g. Solve for x: 3x + 5 = 20'}
                  className={`${FIELD_INPUT} resize-none`} />
              </div>

              {questionType === 'open_text' ? (
                <div className="flex gap-3 p-3 bg-blue-50 border border-blue-200 rounded-xl">
                  <PenLine className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-800 leading-relaxed">
                    Students answer in free text. There's no auto-grading — you'll mark each response correct or incorrect after they submit.
                  </p>
                </div>
              ) : questionType === 'mcq' ? (
                <div>
                  <label className={FIELD_LABEL}>Options</label>
                  <div className="space-y-2">
                    {options.map((opt, i) => (
                      <input key={i} value={opt} onChange={(e) => setOptions((o) => o.map((v, idx) => idx === i ? e.target.value : v))}
                        placeholder={`Option ${i + 1}`}
                        className={FIELD_INPUT} />
                    ))}
                  </div>
                  <label className={`${FIELD_LABEL} mt-3`}>Correct Option</label>
                  <select value={correctAnswer} onChange={(e) => setCorrectAnswer(e.target.value)}
                    className={FIELD_INPUT}>
                    <option value="">Select correct option</option>
                    {options.filter((o) => o.trim()).map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              ) : (
                <>
                  <div>
                    <label className={FIELD_LABEL}>Correct Answer</label>
                    <input required value={correctAnswer} onChange={(e) => setCorrectAnswer(e.target.value)}
                      placeholder="e.g. 5"
                      className={FIELD_INPUT} />
                  </div>
                  <div>
                    <label className={FIELD_LABEL}>
                      Tolerance <span className="normal-case font-normal text-stone-400">(optional, for numeric answers)</span>
                    </label>
                    <input type="number" step="any" value={tolerance} onChange={(e) => setTolerance(e.target.value)}
                      placeholder="e.g. 0.5"
                      className={FIELD_INPUT} />
                  </div>
                </>
              )}
            </form>
          </div>

          <div className={MODAL_FOOTER}>
            <button type="button" onClick={onClose} className={BTN_SECONDARY}>
              Cancel
            </button>
            <button type="submit" form="add-question-form" disabled={submitting} className={BTN_PRIMARY}>
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

// ── Attempt detail modal — full question-by-question review of one student's
// submitted test, so a teacher can see everything, not just open_text answers ──

function AttemptDetailModal({ attemptId, onClose }: { attemptId: number; onClose: () => void }) {
  const [detail, setDetail] = useState<AttemptDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showMemoFor, setShowMemoFor] = useState<number | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchAttemptDetail(attemptId).then((d) => { setDetail(d); setLoading(false); });
  }, [attemptId]);

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        onClick={onClose} className={MODAL_BACKDROP} />
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 8 }}
        transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="bg-white rounded-2xl border border-stone-200 w-full max-w-2xl max-h-[85vh] flex flex-col">
          <div className="flex items-center justify-between p-6 pb-4 border-b border-stone-100">
            <div>
              <h2 className="text-base font-semibold text-brand-dark">
                {loading ? 'Loading...' : `${detail?.student_surname}, ${detail?.student_name}`}
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                {loading ? '' : detail?.test_title}
                {!loading && detail && ` · ${detail.attempt.score_pct ?? 0}%${detail.attempt.grading_complete ? '' : ' (provisional — marking in progress)'}`}
              </p>
            </div>
            <button onClick={onClose} className="p-1 text-stone-400 hover:text-stone-600 transition-colors duration-150 shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="overflow-y-auto px-6 py-4 flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-5 h-5 border-2 border-stone-200 border-t-brand-dark rounded-full animate-spin" />
              </div>
            ) : !detail || detail.questions.length === 0 ? (
              <p className="text-sm text-stone-500 text-center py-8">No answers found for this attempt.</p>
            ) : (
              <div className="space-y-2.5">
                {detail.questions.map((q, i) => (
                  <div key={q.question_id} className="px-4 py-3.5 rounded-xl bg-stone-50 border border-stone-100">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-stone-100 text-stone-500 text-[11px] font-medium rounded-full">
                        {i + 1}. {q.subskill_label}
                      </span>
                      {q.graded_at ? (
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium shrink-0 ${
                          q.is_correct ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {q.is_correct ? <CheckCircle2 className="w-3 h-3" /> : <X className="w-3 h-3" />}
                          {q.is_correct ? 'Correct' : 'Incorrect'}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-100 text-amber-700 shrink-0">
                          Awaiting marking
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-medium text-brand-dark mb-2 leading-snug">{q.prompt}</p>

                    {q.question_type === 'mcq' && q.options && (
                      <div className="space-y-1 mb-2">
                        {q.options.map((opt) => {
                          const isStudentChoice = opt === q.student_answer;
                          const isCorrectOption = opt === q.correct_answer;
                          return (
                            <div key={opt} className={`text-xs px-3 py-1.5 rounded-lg border ${
                              isCorrectOption ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-medium'
                                : isStudentChoice ? 'bg-red-50 border-red-200 text-red-700 font-medium'
                                : 'bg-white border-stone-200 text-stone-500'
                            }`}>
                              {opt}
                              {isStudentChoice && !isCorrectOption && <span className="ml-1.5">(student's answer)</span>}
                              {isCorrectOption && <span className="ml-1.5">(correct answer)</span>}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {q.question_type !== 'mcq' && (
                      <div className="bg-white rounded-lg px-3 py-2 mb-2 border border-stone-200">
                        <p className="text-xs text-stone-700 whitespace-pre-wrap">
                          {q.student_answer || <span className="text-stone-400 italic">No answer given</span>}
                        </p>
                      </div>
                    )}

                    {q.question_type === 'short_answer' && q.correct_answer && (
                      <p className="text-[11px] text-stone-500">Correct answer: <span className="font-medium text-stone-700">{q.correct_answer}</span></p>
                    )}

                    {q.question_type === 'open_text' && q.memo_answer && (
                      <div>
                        <button
                          onClick={() => setShowMemoFor(showMemoFor === q.question_id ? null : q.question_id)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors duration-150 ${
                            showMemoFor === q.question_id ? 'bg-blue-100 text-blue-700' : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                          }`}
                        >
                          <BookOpenCheck className="w-3 h-3" /> {showMemoFor === q.question_id ? 'Hide memo' : 'Show memo'}
                        </button>
                        <AnimatePresence>
                          {showMemoFor === q.question_id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
                              className="overflow-hidden"
                            >
                              <div className="bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 mt-2">
                                <p className="text-[11px] font-semibold uppercase tracking-wide text-blue-600 mb-1">Memo / model answer</p>
                                <p className="text-xs text-blue-900 whitespace-pre-wrap leading-relaxed">{q.memo_answer}</p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
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
          <div className="w-5 h-5 border-2 border-stone-200 border-t-brand-dark rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:p-6 md:p-8">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm font-medium text-stone-500 hover:text-brand-dark mb-4 transition-colors duration-150">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Topic Overview
      </button>

      <div className="mb-6">
        <h2 className="text-lg font-semibold text-brand-dark">Mark Responses</h2>
        <p className="text-sm text-stone-500 mt-1">
          {pending.length === 0 ? 'Nothing left to mark.' : `${pending.length} student${pending.length !== 1 ? 's' : ''} awaiting marks`}
        </p>
      </div>

      {pending.length === 0 ? (
        <div className="paper-card rounded p-12 text-center">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="font-semibold text-brand-dark mb-1">All caught up</p>
          <p className="text-sm text-stone-500">Every submitted response has been marked.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {pending.map((row) => (
            <div key={row.attempt.id} className="paper-card rounded overflow-hidden">
              <div className="px-6 py-4 border-b border-stone-100">
                <p className="text-sm font-semibold text-brand-dark">{row.student_surname}, {row.student_name}</p>
                <p className="text-xs text-stone-500 mt-0.5">
                  {row.answers.length} response{row.answers.length !== 1 ? 's' : ''} to mark
                </p>
              </div>
              <div className="divide-y divide-stone-100">
                {row.answers.map((ans) => (
                  <MarkingAnswerRow
                    key={ans.id}
                    answer={ans}
                    attemptId={row.attempt.id}
                    saving={savingId === ans.id}
                    onMark={(isCorrect) => handleMark(ans.id, row.attempt.id, isCorrect)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MarkingAnswerRow({
  answer, saving, onMark,
}: {
  answer: PendingMarkingAttempt['answers'][number];
  attemptId: number;
  saving: boolean;
  onMark: (isCorrect: boolean) => void;
}) {
  const [showMemo, setShowMemo] = useState(false);
  const hasMemo = !!answer.question.memo_answer;

  return (
    <div className="px-6 py-4">
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-stone-100 text-stone-500 text-[11px] font-medium rounded-full">
          {answer.subskill_label}
        </span>
        {hasMemo && (
          <button
            onClick={() => setShowMemo((v) => !v)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors duration-150 ${
              showMemo ? 'bg-blue-100 text-blue-700' : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
            }`}
          >
            <BookOpenCheck className="w-3 h-3" /> {showMemo ? 'Hide memo' : 'Show memo'}
          </button>
        )}
      </div>
      <p className="text-sm font-medium text-brand-dark mb-2 leading-snug">{answer.question.prompt}</p>

      <AnimatePresence>
        {showMemo && hasMemo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
            className="overflow-hidden"
          >
            <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-blue-600 mb-1">Memo / model answer</p>
              <p className="text-sm text-blue-900 whitespace-pre-wrap leading-relaxed">{answer.question.memo_answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-stone-50 rounded-xl px-4 py-3 mb-3">
        <p className="text-sm text-stone-700 whitespace-pre-wrap">{answer.student_answer || <span className="text-stone-400 italic">No answer given</span>}</p>
      </div>
      {answer.graded_at ? (
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
          answer.is_correct ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
        }`}>
          {answer.is_correct ? <CheckCircle2 className="w-3 h-3" /> : <X className="w-3 h-3" />}
          Marked {answer.is_correct ? 'correct' : 'incorrect'}
        </span>
      ) : (
        <div className="flex gap-2">
          <button
            onClick={() => onMark(true)}
            disabled={saving}
            className="flex-1 py-2 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-semibold hover:bg-emerald-100 transition-colors duration-150 active:scale-[0.98] disabled:opacity-50"
          >
            Correct
          </button>
          <button
            onClick={() => onMark(false)}
            disabled={saving}
            className="flex-1 py-2 rounded-xl bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100 transition-colors duration-150 active:scale-[0.98] disabled:opacity-50"
          >
            Incorrect
          </button>
        </div>
      )}
    </div>
  );
}
