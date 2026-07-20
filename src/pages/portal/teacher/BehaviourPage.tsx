import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Plus, Minus, X as XIcon, Trash2, AlertCircle, ListTree, Pencil, Check, Award } from 'lucide-react';
import type { TeacherSession } from '../../../lib/auth';
import { fetchTeacherStudents } from '../../../lib/students';
import { Shimmer } from '../../../shared/components/Shimmer';
import Dropdown from '../../../shared/components/Dropdown';
import {
  awardBehaviour, fetchBehaviourSummary, fetchStudentBehaviour, deleteBehaviourEntry,
  fetchAllBehaviourEntries, updateBehaviourEntry,
  MERIT_CATEGORIES, DEMERIT_CATEGORIES, MERIT_REASONS, DEMERIT_REASONS, CUSTOM_REASON,
  type BehaviourType, type BehaviourStudentSummary, type BehaviourEntry, type BehaviourEntryFull,
} from '../../../lib/behaviour';
import type { Student } from '../../../lib/students';

const ease = [0.23, 1, 0.32, 1] as [number, number, number, number];

interface BehaviourPageProps { session: TeacherSession; }

export default function BehaviourPage({ session }: BehaviourPageProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [summary, setSummary] = useState<Map<number, BehaviourStudentSummary>>(new Map());
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [awardTarget, setAwardTarget] = useState<Student | null>(null);
  const [timelineTarget, setTimelineTarget] = useState<Student | null>(null);
  const [showAllEntries, setShowAllEntries] = useState(false);

  const load = async () => {
    setLoading(true);
    const result = await fetchTeacherStudents(session.teacher_id, session.school_id);
    const list = result.success ? result.students : [];
    setStudents(list);
    const s = await fetchBehaviourSummary(list.map((st) => st.id));
    setSummary(s);
    setLoading(false);
  };

  useEffect(() => { load(); }, [session.teacher_id]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return students;
    return students.filter((s) =>
      `${s.name} ${s.surname}`.toLowerCase().includes(q) || s.student_code.toLowerCase().includes(q)
    );
  }, [students, search]);

  const refreshSummary = async () => {
    const s = await fetchBehaviourSummary(students.map((st) => st.id));
    setSummary(s);
  };

  return (
    <div className="student-home min-h-full pb-16 relative">

      {/* ═══ Hero ═══════════════════════════════════════════════ */}
      <div className="relative overflow-hidden">
        <div className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-8 sm:pt-11 pb-6 sm:pb-8 w-full flex flex-wrap items-end justify-between gap-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="min-w-0"
          >
            <p className="text-[12px] text-[rgba(31,36,33,0.5)] font-medium">Behaviour</p>
            <h1
              className="text-brand-dark text-[32px] sm:text-[40px] leading-[1.12] mt-2"
              style={{ fontFamily: 'var(--font-instrument)', fontWeight: 500, letterSpacing: '-0.02em' }}
            >
              Merits & Demerits
            </h1>
            <p className="text-[13px] text-[rgba(31,36,33,0.5)] mt-2 font-medium">
              Award behaviour points and view each student's timeline.
            </p>
          </motion.div>
          <button
            onClick={() => setShowAllEntries(true)}
            className="shrink-0 flex items-center gap-2 text-xs font-black text-white border border-white/15 bg-white/[0.05] px-4 py-2.5 rounded hover:bg-white/[0.1] transition-colors"
          >
            <ListTree className="w-3.5 h-3.5" /> View All Entries
          </button>
        </div>
      </div>

      {/* ═══ Body ═════════════════════════════════════════════════ */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 relative z-10 space-y-5 sm:space-y-6 pt-6 sm:pt-8">

        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search students..."
            className="w-full pl-11 pr-4 py-3 rounded border text-sm font-medium focus:outline-none transition-colors"
            style={{ borderColor: 'var(--color-brand-border)', background: 'var(--color-paper-raise)' }}
          />
        </div>

        {loading ? (
          <div className="paper-card rounded overflow-hidden">
            <div className="px-5 py-4 space-y-3" style={{ borderBottom: '1px solid var(--color-brand-border)' }}>
              <Shimmer className="h-4 w-24" />
            </div>
            <div className="p-5 space-y-4">
              {[0, 1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex-1 space-y-2">
                    <Shimmer className="h-3.5" style={{ width: `${50 - i * 5}%` }} />
                    <Shimmer className="h-3 w-1/4" />
                  </div>
                  <Shimmer className="h-8 w-16 rounded" />
                </div>
              ))}
            </div>
          </div>
        ) : (
        <div className="paper-card rounded overflow-hidden">
          {filtered.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-[16px] font-semibold text-brand-dark mb-1">No students found</p>
              <p className="text-[13px] text-stone-500">Students you teach will appear here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-brand-border)' }}>
                  <th className="text-left px-5 py-3 text-xs font-black uppercase tracking-widest text-stone-500">Student</th>
                  <th className="text-left px-5 py-3 text-xs font-black uppercase tracking-widest text-stone-500">Class</th>
                  <th className="text-left px-5 py-3 text-xs font-black uppercase tracking-widest text-stone-500">Net Points</th>
                  <th className="text-right px-5 py-3 text-xs font-black uppercase tracking-widest text-stone-500">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, i) => {
                  const sum = summary.get(s.id);
                  return (
                    <tr key={s.id} style={i === filtered.length - 1 ? undefined : { borderBottom: '1px solid var(--color-paper-raise)' }}>
                      <td className="px-5 py-3.5">
                        <button onClick={() => setTimelineTarget(s)} className="font-bold text-brand-dark hover:underline text-left">
                          {s.surname}, {s.name}
                        </button>
                      </td>
                      <td className="px-5 py-3.5 text-stone-500">{s.cohort?.name ?? '—'}</td>
                      <td className="px-5 py-3.5">
                        {sum ? (
                          <span className={`text-xs font-black px-2 py-0.5 rounded-lg ${
                            sum.net_points > 0 ? 'bg-green-50 text-green-700' : sum.net_points < 0 ? 'bg-red-50 text-red-700' : 'bg-stone-100 text-stone-500'
                          }`}>
                            {sum.net_points > 0 ? '+' : ''}{sum.net_points}
                          </span>
                        ) : '—'}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <motion.button
                          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                          onClick={() => setAwardTarget(s)}
                          className="text-xs font-black text-white bg-accent px-4 py-2 rounded hover:bg-[var(--color-accent-soft)] transition-colors"
                        >
                          Award
                        </motion.button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            </div>
          )}
        </div>
        )}
      </div>

      <AnimatePresence>
        {awardTarget && (
          <AwardModal
            student={awardTarget}
            teacherId={session.teacher_id}
            schoolId={session.school_id}
            onClose={() => setAwardTarget(null)}
            onAwarded={async () => { setAwardTarget(null); await refreshSummary(); }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {timelineTarget && (
          <TimelineModal
            student={timelineTarget}
            onClose={() => setTimelineTarget(null)}
            onChanged={refreshSummary}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAllEntries && (
          <AllEntriesModal
            studentIds={students.map((s) => s.id)}
            onClose={() => setShowAllEntries(false)}
            onChanged={refreshSummary}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Award modal ──

function AwardModal({
  student, teacherId, schoolId, onClose, onAwarded,
}: {
  student: Student; teacherId: number; schoolId: number;
  onClose: () => void; onAwarded: () => void;
}) {
  const [type, setType] = useState<BehaviourType>('merit');
  const [category, setCategory] = useState<string>(MERIT_CATEGORIES[0]);
  const [reason, setReason] = useState<string>('');
  const [customReason, setCustomReason] = useState('');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categories = type === 'merit' ? MERIT_CATEGORIES : DEMERIT_CATEGORIES;
  const reasonMap = type === 'merit' ? MERIT_REASONS : DEMERIT_REASONS;
  const reasonOptions = [...(reasonMap[category as keyof typeof reasonMap] ?? []), CUSTOM_REASON];

  const handleTypeChange = (t: BehaviourType) => {
    setType(t);
    const firstCategory = t === 'merit' ? MERIT_CATEGORIES[0] : DEMERIT_CATEGORIES[0];
    setCategory(firstCategory);
    setReason('');
    setCustomReason('');
  };

  const handleCategoryChange = (c: string) => {
    setCategory(c);
    setReason('');
    setCustomReason('');
  };

  const finalReason = reason === CUSTOM_REASON ? customReason : reason;

  const handleSubmit = async () => {
    if (!finalReason.trim()) {
      setError('Please choose or enter a reason.');
      return;
    }
    setSaving(true);
    setError(null);
    const result = await awardBehaviour(schoolId, student.id, teacherId, type, category, finalReason, 1, note);
    setSaving(false);
    if (!result.success) {
      setError(result.error);
      return;
    }
    onAwarded();
  };

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
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-black text-brand-dark">Award {student.name} {student.surname}</h2>
            <button onClick={onClose} className="p-1 text-stone-400 hover:text-stone-600">
              <XIcon className="w-4 h-4" />
            </button>
          </div>

          <div className="flex gap-2 mb-4">
            <button
              onClick={() => handleTypeChange('merit')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded text-sm font-black border transition-colors ${
                type === 'merit' ? 'bg-green-600 text-white border-green-600' : 'bg-stone-50 border-brand-border text-stone-500'
              }`}
            >
              <Plus className="w-4 h-4" /> Merit
            </button>
            <button
              onClick={() => handleTypeChange('demerit')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded text-sm font-black border transition-colors ${
                type === 'demerit' ? 'bg-red-600 text-white border-red-600' : 'bg-stone-50 border-brand-border text-stone-500'
              }`}
            >
              <Minus className="w-4 h-4" /> Demerit
            </button>
          </div>

          <p className="text-xs font-black uppercase tracking-widest text-stone-500 mb-2">Category</p>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => handleCategoryChange(c)}
                className={`text-xs font-bold py-2.5 px-3 rounded border text-left transition-colors ${
                  category === c
                    ? type === 'merit' ? 'bg-green-50 border-green-300 text-green-800' : 'bg-red-50 border-red-300 text-red-800'
                    : 'bg-stone-50 border-brand-border text-stone-600 hover:border-stone-300'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <p className="text-xs font-black uppercase tracking-widest text-stone-500 mb-2">Reason</p>
          <div className="flex flex-wrap gap-2 mb-3">
            {reasonOptions.map((r) => (
              <button
                key={r}
                onClick={() => setReason(r)}
                className={`text-xs font-bold py-2 px-3 rounded-lg border transition-colors ${
                  reason === r
                    ? type === 'merit' ? 'bg-green-50 border-green-300 text-green-800' : 'bg-red-50 border-red-300 text-red-800'
                    : 'bg-stone-50 border-brand-border text-stone-600 hover:border-stone-300'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          {reason === CUSTOM_REASON && (
            <input
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              placeholder="Enter a custom reason..."
              className="w-full px-4 py-3 rounded border border-brand-border bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-dark/10 mb-4"
            />
          )}

          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Optional extra detail..."
            rows={2}
            className="w-full px-4 py-3 rounded border border-brand-border bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-dark/10 mb-4 resize-none"
          />

          {error && (
            <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <p className="text-xs font-bold text-red-700">{error}</p>
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 py-2.5 text-sm font-bold text-stone-600 border border-brand-border rounded hover:bg-stone-50 transition-all">
              Cancel
            </button>
            <button
              onClick={handleSubmit} disabled={saving}
              className="flex-1 py-2.5 text-sm font-black text-white bg-accent rounded hover:bg-[var(--color-accent-soft)] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Award'}
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}

// ── Timeline modal ──

function TimelineModal({
  student, onClose, onChanged,
}: {
  student: Student; onClose: () => void; onChanged: () => void;
}) {
  const [entries, setEntries] = useState<BehaviourEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmId, setConfirmId] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    const data = await fetchStudentBehaviour(student.id);
    setEntries(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, [student.id]);

  const handleDelete = async (id: number) => {
    setConfirmId(null);
    setDeletingId(id);
    const result = await deleteBehaviourEntry(id);
    if (result.success) {
      setEntries((prev) => prev.filter((e) => e.id !== id));
      onChanged();
    }
    setDeletingId(null);
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });

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
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col">
          <div className="flex items-center justify-between p-6 pb-4 border-b border-brand-border/60">
            <h2 className="text-base font-black text-brand-dark">{student.name} {student.surname} — Timeline</h2>
            <button onClick={onClose} className="p-1 text-stone-400 hover:text-stone-600">
              <XIcon className="w-4 h-4" />
            </button>
          </div>

          <div className="overflow-y-auto p-6 pt-4">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-5 h-5 border-2 border-brand-border border-t-stone-700 rounded-full animate-spin" />
              </div>
            ) : entries.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Award className="w-9 h-9 text-stone-200 mb-3" />
                <p className="text-sm font-bold text-stone-500">No behaviour entries yet.</p>
                <p className="text-xs text-stone-400 mt-1">Merits and demerits you award will appear here.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {entries.map((e) => (
                  <div key={e.id} className="flex items-center justify-between gap-3 px-4 py-3 rounded bg-stone-50 border border-stone-100">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${
                          e.type === 'merit' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {e.type === 'merit' ? '+' : '-'}{e.points}
                        </span>
                        <span className="text-sm font-bold text-brand-dark truncate">{e.category}</span>
                      </div>
                      {e.reason && <p className="text-xs text-stone-600 font-medium">{e.reason}</p>}
                      <p className="text-xs text-stone-500 mt-0.5">
                        {formatDate(e.created_at)} · {e.teacher_name ?? 'Teacher'} {e.teacher_surname ?? ''}
                      </p>
                      {e.note && <p className="text-xs text-stone-600 mt-1">{e.note}</p>}
                    </div>
                    {confirmId === e.id ? (
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-xs font-bold text-stone-500">Delete?</span>
                        <button
                          onClick={() => handleDelete(e.id)} disabled={deletingId === e.id}
                          className="text-xs font-black text-white bg-red-600 px-2.5 py-1.5 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                        >
                          {deletingId === e.id ? '...' : 'Yes'}
                        </button>
                        <button
                          onClick={() => setConfirmId(null)}
                          className="text-xs font-bold text-stone-500 px-2.5 py-1.5 rounded-lg hover:bg-stone-100 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmId(e.id)}
                        className="p-2 text-stone-400 hover:text-red-600 transition-colors shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
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

// ── All entries modal — every merit/demerit given to this teacher's students,
// by any teacher, with search + inline edit (category/reason/note) + delete ──

function AllEntriesModal({
  studentIds, onClose, onChanged,
}: {
  studentIds: number[]; onClose: () => void; onChanged: () => void;
}) {
  const [entries, setEntries] = useState<BehaviourEntryFull[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [confirmId, setConfirmId] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    const data = await fetchAllBehaviourEntries(studentIds);
    setEntries(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, [studentIds.join(',')]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter((e) =>
      `${e.student_name} ${e.student_surname}`.toLowerCase().includes(q) ||
      e.category.toLowerCase().includes(q) ||
      (e.reason ?? '').toLowerCase().includes(q) ||
      `${e.teacher_name} ${e.teacher_surname}`.toLowerCase().includes(q)
    );
  }, [entries, search]);

  const handleDelete = async (id: number) => {
    setConfirmId(null);
    setDeletingId(id);
    const result = await deleteBehaviourEntry(id);
    if (result.success) {
      setEntries((prev) => prev.filter((e) => e.id !== id));
      onChanged();
    }
    setDeletingId(null);
  };

  const handleSaved = (id: number, updates: { category: string; reason: string; note?: string }) => {
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates, reason: updates.reason || null, note: updates.note || null } : e)));
    setEditingId(null);
    onChanged();
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });

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
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col">
          <div className="flex items-center justify-between p-6 pb-4 border-b border-brand-border/60">
            <div>
              <h2 className="text-base font-black text-brand-dark">All Behaviour Entries</h2>
              <p className="text-xs text-stone-500 mt-0.5">Every merit/demerit given to your students, by any teacher.</p>
            </div>
            <button onClick={onClose} className="p-1 text-stone-400 hover:text-stone-600">
              <XIcon className="w-4 h-4" />
            </button>
          </div>

          <div className="px-6 pt-4">
            <div className="relative mb-3">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by student, category, reason, or teacher..."
                className="w-full pl-10 pr-4 py-2.5 rounded border border-brand-border bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-dark/10"
              />
            </div>
          </div>

          <div className="overflow-y-auto px-6 pb-6 flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-5 h-5 border-2 border-brand-border border-t-stone-700 rounded-full animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <p className="text-sm text-stone-500 text-center py-8">No entries found.</p>
            ) : (
              <div className="space-y-2">
                {filtered.map((e) => (
                  editingId === e.id ? (
                    <EditEntryRow
                      key={e.id} entry={e}
                      onCancel={() => setEditingId(null)}
                      onSaved={(updates) => handleSaved(e.id, updates)}
                    />
                  ) : (
                    <div key={e.id} className="flex items-center justify-between gap-3 px-4 py-3 rounded bg-stone-50 border border-stone-100">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={`text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${
                            e.type === 'merit' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {e.type === 'merit' ? '+' : '-'}{e.points}
                          </span>
                          <span className="text-sm font-bold text-brand-dark truncate">{e.student_surname}, {e.student_name}</span>
                          <span className="text-xs text-stone-400">·</span>
                          <span className="text-xs font-bold text-stone-600 truncate">{e.category}</span>
                        </div>
                        {e.reason && <p className="text-xs text-stone-600 font-medium">{e.reason}</p>}
                        <p className="text-xs text-stone-500 mt-0.5">
                          {formatDate(e.created_at)} · {e.teacher_name ?? 'Teacher'} {e.teacher_surname ?? ''}
                        </p>
                        {e.note && <p className="text-xs text-stone-600 mt-1">{e.note}</p>}
                      </div>
                      {confirmId === e.id ? (
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-xs font-bold text-stone-500">Delete?</span>
                          <button
                            onClick={() => handleDelete(e.id)} disabled={deletingId === e.id}
                            className="text-xs font-black text-white bg-red-600 px-2.5 py-1.5 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                          >
                            {deletingId === e.id ? '...' : 'Yes'}
                          </button>
                          <button
                            onClick={() => setConfirmId(null)}
                            className="text-xs font-bold text-stone-500 px-2.5 py-1.5 rounded-lg hover:bg-stone-100 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => setEditingId(e.id)}
                            className="p-2 text-stone-400 hover:text-brand-dark transition-colors"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setConfirmId(e.id)}
                            className="p-2 text-stone-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  )
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
}

function EditEntryRow({
  entry, onCancel, onSaved,
}: {
  entry: BehaviourEntryFull;
  onCancel: () => void;
  onSaved: (updates: { category: string; reason: string; note?: string }) => void;
}) {
  const categories = entry.type === 'merit' ? MERIT_CATEGORIES : DEMERIT_CATEGORIES;
  const [category, setCategory] = useState(entry.category);
  const [reason, setReason] = useState(entry.reason ?? '');
  const [note, setNote] = useState(entry.note ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    const result = await updateBehaviourEntry(entry.id, { category, reason, note });
    setSaving(false);
    if (!result.success) { setError(result.error); return; }
    onSaved({ category, reason, note });
  };

  return (
    <div className="px-4 py-3 rounded bg-white border border-brand-dark/20 space-y-2.5">
      <div className="flex items-center gap-2">
        <span className={`text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0 ${
          entry.type === 'merit' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {entry.type === 'merit' ? '+' : '-'}{entry.points}
        </span>
        <span className="text-sm font-bold text-brand-dark truncate">{entry.student_surname}, {entry.student_name}</span>
      </div>

      <Dropdown
        value={category}
        onChange={(v) => setCategory(v)}
        buttonClassName="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg border border-brand-border bg-stone-50 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-brand-dark/10"
        options={categories.map((c) => ({ value: c, label: c }))}
      />

      <input
        value={reason} onChange={(e) => setReason(e.target.value)}
        placeholder="Reason"
        className="w-full px-3 py-2 rounded-lg border border-brand-border bg-stone-50 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-dark/10"
      />

      <textarea
        value={note} onChange={(e) => setNote(e.target.value)}
        placeholder="Optional extra detail..."
        rows={2}
        className="w-full px-3 py-2 rounded-lg border border-brand-border bg-stone-50 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-dark/10 resize-none"
      />

      {error && (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
          <p className="text-xs font-bold text-red-700">{error}</p>
        </div>
      )}

      <div className="flex gap-2">
        <button onClick={onCancel} className="flex-1 py-2 text-xs font-bold text-stone-600 border border-brand-border rounded-lg hover:bg-stone-50 transition-all">
          Cancel
        </button>
        <button
          onClick={handleSave} disabled={saving}
          className="flex-1 py-2 text-xs font-black text-white bg-accent rounded-lg hover:bg-[var(--color-accent-soft)] transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
        >
          {saving ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Check className="w-3.5 h-3.5" /> Save</>}
        </button>
      </div>
    </div>
  );
}
