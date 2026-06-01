import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus, X, ChevronRight, ChevronDown, ClipboardList,
  Pencil, Trash2, CalendarDays, CheckCircle2, Circle,
} from 'lucide-react';
import {
  fetchTeacherMarkSheets, createMarkSheet, deleteMarkSheet,
  fetchSheetMarks, saveStudentMark,
  type MarkSheetGroup, type MarkSheet, type StudentMark,
} from '../../../lib/marks';
import { fetchSubjects, type Subject } from '../../../lib/students';
import { createEvent } from '../../../lib/events';
import type { TeacherSession } from '../../../lib/auth';

const GRADES = [8, 9, 10, 11, 12];

function pct(mark: number | null, total: number): string {
  if (mark === null) return '—';
  return `${Math.round((mark / total) * 100)}%`;
}
function grade(mark: number | null, total: number): { label: string; color: string } {
  if (mark === null) return { label: '—', color: 'text-slate-400' };
  const p = (mark / total) * 100;
  if (p >= 80) return { label: 'Outstanding', color: 'text-emerald-600' };
  if (p >= 70) return { label: 'Merit', color: 'text-blue-600' };
  if (p >= 60) return { label: 'Adequate', color: 'text-sky-600' };
  if (p >= 50) return { label: 'Moderate', color: 'text-amber-600' };
  if (p >= 40) return { label: 'Elementary', color: 'text-orange-600' };
  return { label: 'Not Achieved', color: 'text-red-600' };
}

interface MarksPageProps {
  session: TeacherSession;
}

type View = 'groups' | 'sheet';

export default function MarksPage({ session }: MarksPageProps) {
  const [groups, setGroups] = useState<MarkSheetGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  // View state
  const [view, setView] = useState<View>('groups');
  const [activeSheet, setActiveSheet] = useState<MarkSheet | null>(null);
  const [sheetMarks, setSheetMarks] = useState<StudentMark[]>([]);
  const [sheetLoading, setSheetLoading] = useState(false);

  // Create sheet modal
  const [createModal, setCreateModal] = useState(false);
  const [form, setForm] = useState({ title: '', subject_id: '', grade: '', scope: '', total: '' });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  // Delete confirm
  const [deleteSheet, setDeleteSheet] = useState<MarkSheet | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Mark entry state — { [student_mark_id]: { mark: string, note: string } }
  const [markDraft, setMarkDraft] = useState<Record<number, { mark: string; note: string }>>({});
  const [savingMark, setSavingMark] = useState<number | null>(null);
  const [savedMark, setSavedMark] = useState<number | null>(null);

  // Push to calendar
  const [pushingCalendar, setPushingCalendar] = useState(false);
  const [pushedCalendar, setPushedCalendar] = useState(false);

  useEffect(() => {
    fetchSubjects().then(setSubjects);
    reload();
  }, []);

  async function reload() {
    setLoading(true);
    const g = await fetchTeacherMarkSheets(session.teacher_id, session.school_id);
    setGroups(g);
    setLoading(false);
  }

  function toggleGroup(key: string) {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  async function openSheet(sheet: MarkSheet) {
    setActiveSheet(sheet);
    setView('sheet');
    setSheetLoading(true);
    setPushedCalendar(!!sheet.event_id);
    const marks = await fetchSheetMarks(sheet.id);
    setSheetMarks(marks);
    // Init drafts from existing marks
    const drafts: Record<number, { mark: string; note: string }> = {};
    marks.forEach(m => {
      drafts[m.id] = {
        mark: m.mark !== null ? String(m.mark) : '',
        note: m.note ?? '',
      };
    });
    setMarkDraft(drafts);
    setSheetLoading(false);
  }

  function backToGroups() {
    setView('groups');
    setActiveSheet(null);
    setSheetMarks([]);
    setMarkDraft({});
    setSavedMark(null);
    reload();
  }

  // ── Create sheet ─────────────────────────────────────────────

  async function handleCreate() {
    if (!form.title.trim()) { setFormError('Title is required.'); return; }
    if (!form.subject_id)   { setFormError('Select a subject.'); return; }
    if (!form.grade)        { setFormError('Select a grade.'); return; }
    if (!form.total || isNaN(Number(form.total)) || Number(form.total) <= 0) {
      setFormError('Enter a valid total mark.'); return;
    }

    setSaving(true);
    setFormError('');
    const result = await createMarkSheet({
      school_id: session.school_id,
      teacher_id: session.teacher_id,
      subject_id: Number(form.subject_id),
      grade: Number(form.grade),
      title: form.title,
      scope: form.scope,
      total: Number(form.total),
    });

    if (!result.success) { setFormError(result.error); setSaving(false); return; }

    setCreateModal(false);
    setForm({ title: '', subject_id: '', grade: '', scope: '', total: '' });
    setSaving(false);

    await reload();
    // Auto-expand the new group
    const key = `${form.subject_id}-${form.grade}`;
    setExpandedGroups(prev => new Set([...prev, key]));
    // Open the new sheet immediately
    openSheet(result.sheet);
  }

  // ── Save a mark ──────────────────────────────────────────────

  async function handleSaveMark(sm: StudentMark) {
    const draft = markDraft[sm.id];
    if (!draft) return;
    const markVal = draft.mark === '' ? null : Number(draft.mark);
    if (draft.mark !== '' && (isNaN(markVal!) || markVal! < 0 || markVal! > activeSheet!.total)) return;

    setSavingMark(sm.id);
    await saveStudentMark(sm.sheet_id, sm.student_id, sm.school_id, markVal, draft.note || null);
    setSavingMark(null);
    setSavedMark(sm.id);
    setTimeout(() => setSavedMark(null), 1800);

    // Update local state
    setSheetMarks(prev => prev.map(m =>
      m.id === sm.id ? { ...m, mark: markVal, note: draft.note || null, marked_at: markVal !== null ? new Date().toISOString() : null } : m
    ));
  }

  // ── Push to calendar ─────────────────────────────────────────

  async function handlePushCalendar() {
    if (!activeSheet || pushedCalendar) return;
    setPushingCalendar(true);
    const subLabel = subjects.find(s => s.id === activeSheet.subject_id)?.label ?? 'Assessment';
    const result = await createEvent({
      school_id: session.school_id,
      created_by_teacher_id: session.teacher_id,
      event_type: 'assessment',
      title: `${activeSheet.title}${activeSheet.scope ? ` — ${activeSheet.scope}` : ''}`,
      description: `${subLabel} · Grade ${activeSheet.grade} · Out of ${activeSheet.total}`,
      event_date: new Date().toISOString().split('T')[0],
      target_type: 'grade',
      target_grades: [activeSheet.grade],
    });
    setPushingCalendar(false);
    if (result.success) setPushedCalendar(true);
  }

  // ── Delete sheet ─────────────────────────────────────────────

  async function handleDelete() {
    if (!deleteSheet) return;
    setDeleting(true);
    await deleteMarkSheet(deleteSheet.id, session.school_id);
    setDeleting(false);
    setDeleteSheet(null);
    reload();
  }

  // ── Stats for sheet header ────────────────────────────────────

  const marked    = sheetMarks.filter(m => m.mark !== null).length;
  const unmarked  = sheetMarks.length - marked;
  const avgMark   = marked > 0
    ? sheetMarks.filter(m => m.mark !== null).reduce((s, m) => s + m.mark!, 0) / marked
    : null;

  // ── Render ────────────────────────────────────────────────────

  return (
    <div className="p-5 md:p-8 max-w-6xl w-full">

      {/* ── Groups view ───────────────────────────────────────── */}
      {view === 'groups' && (
        <>
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Marks</p>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Mark Sheets</h1>
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => { setCreateModal(true); setFormError(''); }}
              className="flex items-center gap-2 bg-slate-900 text-white text-sm font-black px-4 py-2.5 rounded-xl hover:bg-slate-700 transition-colors"
            >
              <Plus className="w-4 h-4" /> New Sheet
            </motion.button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                className="w-5 h-5 border-2 border-slate-200 border-t-slate-700 rounded-full" />
            </div>
          ) : groups.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <ClipboardList className="w-10 h-10 text-slate-200 mb-4" />
              <p className="text-sm font-bold text-slate-400">No mark sheets yet.</p>
              <p className="text-xs text-slate-300 mt-1">Create your first sheet to get started.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {groups.map((group, gi) => {
                const isOpen = expandedGroups.has(group.key);
                return (
                  <motion.div
                    key={group.key}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: gi * 0.05 }}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
                  >
                    {/* Group header */}
                    <button
                      onClick={() => toggleGroup(group.key)}
                      className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                          <ClipboardList className="w-4 h-4 text-slate-500" />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-black text-slate-900">{group.subject_label}</p>
                          <p className="text-xs text-slate-400 font-bold">Grade {group.grade} · {group.sheets.length} sheet{group.sheets.length !== 1 ? 's' : ''}</p>
                        </div>
                      </div>
                      <motion.div animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.18 }}>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </motion.div>
                    </button>

                    {/* Sheet list */}
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                          transition={{ duration: 0.2, ease: 'easeOut' }}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-slate-100 divide-y divide-slate-100">
                            {group.sheets.map(sheet => {
                              return (
                                <div key={sheet.id} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors">
                                  <button
                                    onClick={() => openSheet(sheet)}
                                    className="flex-1 text-left"
                                  >
                                    <p className="text-sm font-bold text-slate-900">{sheet.title}</p>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                      {sheet.scope ? `${sheet.scope} · ` : ''}Out of {sheet.total}
                                      {sheet.event_id ? ' · 📅 On calendar' : ''}
                                    </p>
                                  </button>
                                  <button
                                    onClick={() => openSheet(sheet)}
                                    className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-700"
                                  >
                                    <Pencil className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => setDeleteSheet(sheet)}
                                    className="p-1.5 rounded-lg hover:bg-red-50 transition-colors text-slate-300 hover:text-red-500"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ── Sheet view ────────────────────────────────────────── */}
      {view === 'sheet' && activeSheet && (
        <>
          {/* Back + header */}
          <div className="mb-6">
            <button
              onClick={backToGroups}
              className="flex items-center gap-1.5 text-xs font-black text-slate-400 hover:text-slate-700 transition-colors mb-4 uppercase tracking-widest"
            >
              <ChevronRight className="w-3.5 h-3.5 rotate-180" /> Back
            </button>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">
                  {subjects.find(s => s.id === activeSheet.subject_id)?.label ?? ''} · Grade {activeSheet.grade}
                </p>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">{activeSheet.title}</h1>
                {activeSheet.scope && <p className="text-sm text-slate-400 mt-0.5">{activeSheet.scope}</p>}
              </div>
              {/* Push to calendar */}
              <motion.button
                whileHover={!pushedCalendar ? { scale: 1.03 } : {}}
                whileTap={!pushedCalendar ? { scale: 0.97 } : {}}
                onClick={handlePushCalendar}
                disabled={pushedCalendar || pushingCalendar}
                className={`flex items-center gap-2 text-xs font-black px-3 py-2 rounded-xl transition-all shrink-0 ${
                  pushedCalendar
                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-transparent'
                }`}
              >
                <CalendarDays className="w-3.5 h-3.5" />
                {pushedCalendar ? 'On Calendar' : pushingCalendar ? 'Adding…' : 'Add to Calendar'}
              </motion.button>
            </div>

            {/* Stats bar */}
            <div className="mt-4 flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Total</span>
                <span className="text-sm font-black text-slate-900">{activeSheet.total}</span>
              </div>
              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Marked</span>
                <span className="text-sm font-black text-slate-900">{marked}/{sheetMarks.length}</span>
              </div>
              {avgMark !== null && (
                <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Avg</span>
                  <span className="text-sm font-black text-slate-900">
                    {avgMark.toFixed(1)} ({Math.round((avgMark / activeSheet.total) * 100)}%)
                  </span>
                </div>
              )}
              {unmarked > 0 && (
                <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
                  <span className="text-xs font-black text-amber-600">{unmarked} unmarked</span>
                </div>
              )}
            </div>
          </div>

          {sheetLoading ? (
            <div className="flex items-center justify-center py-24">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                className="w-5 h-5 border-2 border-slate-200 border-t-slate-700 rounded-full" />
            </div>
          ) : sheetMarks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-2xl border border-slate-200">
              <ClipboardList className="w-10 h-10 text-slate-200 mb-4" />
              <p className="text-sm font-bold text-slate-400">No students found for this sheet.</p>
              <p className="text-xs text-slate-300 mt-1">Make sure students are linked to this subject and grade.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {sheetMarks.map((sm, i) => {
                const draft = markDraft[sm.id] ?? { mark: sm.mark !== null ? String(sm.mark) : '', note: sm.note ?? '' };
                const markNum = draft.mark === '' ? null : Number(draft.mark);
                const isInvalid = draft.mark !== '' && (isNaN(markNum!) || markNum! < 0 || markNum! > activeSheet.total);
                const isSaving = savingMark === sm.id;
                const isSaved  = savedMark === sm.id;
                const g = grade(sm.mark, activeSheet.total);

                return (
                  <motion.div
                    key={sm.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="bg-white rounded-2xl border border-slate-200 px-5 py-4"
                  >
                    <div className="flex items-start gap-4">
                      {/* Student info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                            <span className="text-[10px] font-black text-slate-600">
                              {sm.student_surname?.[0]}{sm.student_name?.[0]}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-900">{sm.student_surname}, {sm.student_name}</p>
                            <p className="text-[10px] text-slate-400 font-bold">{sm.student_code}</p>
                          </div>
                          {sm.mark !== null && (
                            <span className={`ml-auto text-xs font-black ${g.color}`}>{g.label}</span>
                          )}
                        </div>

                        <div className="flex items-center gap-3 flex-wrap">
                          {/* Mark input */}
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min={0}
                              max={activeSheet.total}
                              placeholder="Mark"
                              value={draft.mark}
                              onChange={e => setMarkDraft(prev => ({
                                ...prev,
                                [sm.id]: { ...draft, mark: e.target.value },
                              }))}
                              className={`w-20 px-3 py-1.5 rounded-xl border text-sm font-bold text-slate-900 text-center focus:outline-none focus:ring-2 focus:ring-slate-900 transition-colors ${
                                isInvalid ? 'border-red-300 bg-red-50' : 'border-slate-200'
                              }`}
                            />
                            <span className="text-sm font-black text-slate-400">/ {activeSheet.total}</span>
                            {draft.mark !== '' && !isInvalid && (
                              <span className="text-xs font-bold text-slate-400">
                                {pct(Number(draft.mark), activeSheet.total)}
                              </span>
                            )}
                          </div>

                          {/* Note input */}
                          <input
                            type="text"
                            placeholder="Note (optional)"
                            value={draft.note}
                            onChange={e => setMarkDraft(prev => ({
                              ...prev,
                              [sm.id]: { ...draft, note: e.target.value },
                            }))}
                            className="flex-1 min-w-[140px] px-3 py-1.5 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
                          />

                          {/* Save button */}
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleSaveMark(sm)}
                            disabled={isSaving || isInvalid}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all disabled:opacity-40 ${
                              isSaved
                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                                : 'bg-slate-900 text-white hover:bg-slate-700'
                            }`}
                          >
                            {isSaved
                              ? <><CheckCircle2 className="w-3.5 h-3.5" /> Saved</>
                              : isSaving
                              ? 'Saving…'
                              : <><Circle className="w-3.5 h-3.5" /> Save</>
                            }
                          </motion.button>
                        </div>
                        {isInvalid && (
                          <p className="text-xs text-red-500 font-bold mt-1">Mark must be between 0 and {activeSheet.total}.</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ── Create sheet modal ────────────────────────────────── */}
      <AnimatePresence>
        {createModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => setCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 12, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 8, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <h2 className="text-base font-black text-slate-900">New Mark Sheet</h2>
                <button onClick={() => setCreateModal(false)} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Title *</label>
                  <input
                    value={form.title}
                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    placeholder="e.g. Chapter 3 Test"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Subject *</label>
                  <select
                    value={form.subject_id}
                    onChange={e => setForm(f => ({ ...f, subject_id: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
                  >
                    <option value="">Select subject…</option>
                    {subjects.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                  </select>
                </div>

                {/* Grade */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Grade *</label>
                  <div className="flex gap-1.5 flex-wrap">
                    {GRADES.map(g => (
                      <button
                        key={g}
                        onClick={() => setForm(f => ({ ...f, grade: String(g) }))}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                          form.grade === String(g) ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                      >
                        Grade {g}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Scope */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Scope <span className="normal-case font-bold text-slate-300">(optional)</span></label>
                  <input
                    value={form.scope}
                    onChange={e => setForm(f => ({ ...f, scope: e.target.value }))}
                    placeholder="e.g. Term 1, Chapters 1–4"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                {/* Total */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Total marks *</label>
                  <input
                    type="number"
                    min={1}
                    value={form.total}
                    onChange={e => setForm(f => ({ ...f, total: e.target.value }))}
                    placeholder="e.g. 100"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                {formError && <p className="text-sm font-bold text-red-500">{formError}</p>}
              </div>

              <div className="flex gap-2 px-6 pb-6">
                <button
                  onClick={() => setCreateModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-black text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={saving}
                  className="flex-1 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-black hover:bg-slate-700 transition-colors disabled:opacity-50"
                >
                  {saving ? 'Creating…' : 'Create & Open'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Delete confirm modal ──────────────────────────────── */}
      <AnimatePresence>
        {deleteSheet && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => setDeleteSheet(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 12, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 8, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6"
              onClick={e => e.stopPropagation()}
            >
              <h2 className="text-base font-black text-slate-900 mb-1">Delete mark sheet?</h2>
              <p className="text-sm text-slate-500 mb-5">
                <strong>{deleteSheet.title}</strong> and all student marks will be permanently deleted.
              </p>
              <div className="flex gap-2">
                <button onClick={() => setDeleteSheet(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-black text-slate-600 hover:bg-slate-50 transition-colors">
                  Cancel
                </button>
                <button onClick={handleDelete} disabled={deleting}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-sm font-black hover:bg-red-700 transition-colors disabled:opacity-50">
                  {deleting ? 'Deleting…' : 'Delete'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
