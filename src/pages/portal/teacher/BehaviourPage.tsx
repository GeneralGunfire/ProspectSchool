import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Plus, Minus, X as XIcon, Trash2, AlertCircle } from 'lucide-react';
import type { TeacherSession } from '../../../lib/auth';
import { fetchTeacherStudents } from '../../../lib/students';
import {
  awardBehaviour, fetchBehaviourSummary, fetchStudentBehaviour, deleteBehaviourEntry,
  MERIT_CATEGORIES, DEMERIT_CATEGORIES, MERIT_REASONS, DEMERIT_REASONS, CUSTOM_REASON,
  type BehaviourType, type BehaviourStudentSummary, type BehaviourEntry,
} from '../../../lib/behaviour';
import type { Student } from '../../../lib/students';

interface BehaviourPageProps { session: TeacherSession; }

export default function BehaviourPage({ session }: BehaviourPageProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [summary, setSummary] = useState<Map<number, BehaviourStudentSummary>>(new Map());
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [awardTarget, setAwardTarget] = useState<Student | null>(null);
  const [timelineTarget, setTimelineTarget] = useState<Student | null>(null);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-5 h-5 border-2 border-brand-border border-t-stone-700 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:p-6 md:p-8 max-w-4xl w-full mx-auto">
      <div className="mb-6">
        <span className="eyebrow">Behaviour</span>
        <h1 className="text-2xl font-black text-brand-dark tracking-tight">Merits & Demerits</h1>
        <p className="text-sm text-stone-500 mt-1">Award behaviour points and view each student's timeline.</p>
      </div>

      <div className="relative mb-4">
        <Search className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search students..."
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-brand-border bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-dark/10"
        />
      </div>

      <div className="card-premium bg-white border border-brand-border rounded-[24px] overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <p className="font-bold text-brand-dark mb-1">No students found</p>
            <p className="text-sm text-stone-500">Students you teach will appear here.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-border/60">
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
                  <tr key={s.id} className={`border-b border-stone-50 ${i === filtered.length - 1 ? 'border-0' : ''}`}>
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
                        className="text-xs font-black text-white bg-brand-dark px-4 py-2 rounded-xl hover:bg-brand-dark/90 transition-colors"
                      >
                        Award
                      </motion.button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
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
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-black border transition-colors ${
                type === 'merit' ? 'bg-green-600 text-white border-green-600' : 'bg-stone-50 border-brand-border text-stone-500'
              }`}
            >
              <Plus className="w-4 h-4" /> Merit
            </button>
            <button
              onClick={() => handleTypeChange('demerit')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-black border transition-colors ${
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
                className={`text-xs font-bold py-2.5 px-3 rounded-xl border text-left transition-colors ${
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
              className="w-full px-4 py-3 rounded-xl border border-brand-border bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-dark/10 mb-4"
            />
          )}

          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Optional extra detail..."
            rows={2}
            className="w-full px-4 py-3 rounded-xl border border-brand-border bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-dark/10 mb-4 resize-none"
          />

          {error && (
            <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <p className="text-xs font-bold text-red-700">{error}</p>
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 py-2.5 text-sm font-bold text-stone-600 border border-brand-border rounded-xl hover:bg-stone-50 transition-all">
              Cancel
            </button>
            <button
              onClick={handleSubmit} disabled={saving}
              className="flex-1 py-2.5 text-sm font-black text-white bg-brand-dark rounded-xl hover:bg-brand-dark/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
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

  const load = async () => {
    setLoading(true);
    const data = await fetchStudentBehaviour(student.id);
    setEntries(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, [student.id]);

  const handleDelete = async (id: number) => {
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
              <p className="text-sm text-stone-500 text-center py-8">No behaviour entries yet.</p>
            ) : (
              <div className="space-y-2">
                {entries.map((e) => (
                  <div key={e.id} className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-stone-50 border border-stone-100">
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
                    <button
                      onClick={() => handleDelete(e.id)} disabled={deletingId === e.id}
                      className="p-2 text-stone-400 hover:text-red-600 transition-colors shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
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
