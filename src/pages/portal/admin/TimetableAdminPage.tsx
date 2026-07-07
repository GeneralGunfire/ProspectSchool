import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, X, AlertCircle, Trash2, Coffee, Copy, GripVertical } from 'lucide-react';
import type { AdminSession } from '../../../lib/auth';
import { fetchSchoolCohorts, type CohortWithHomeroom } from '../../../lib/homeroom';
import { fetchSchoolTeachers, type Teacher } from '../../../lib/teachers';
import { fetchSubjects, type Subject } from '../../../lib/students';
import {
  DAYS, fetchSchoolPeriods, setSchoolPeriods, fetchCohortTimetable,
  addTimetableEntry, addBreakEntry, deleteTimetableEntry, fetchTeacherClash,
  moveTimetableEntry, copyTimetableEntry,
  addSchoolPeriod, updateSchoolPeriod, deleteSchoolPeriod,
  type TimetablePeriod, type TimetableEntryDetailed,
} from '../../../lib/timetable';

interface TimetableAdminPageProps { session: AdminSession; }

const DEFAULT_PERIODS: { period_number: number; label: string; start_time: string | null; end_time: string | null }[] =
  Array.from({ length: 7 }, (_, i) => ({
    period_number: i + 1,
    label: `Period ${i + 1}`,
    start_time: null,
    end_time: null,
  }));

type DragPayload = { entryId: number; fromDay: number; fromPeriod: number; isBreak: boolean; isSoleOccupant: boolean };

export default function TimetableAdminPage({ session }: TimetableAdminPageProps) {
  const [cohorts, setCohorts] = useState<CohortWithHomeroom[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [periods, setPeriods] = useState<TimetablePeriod[]>([]);
  const [selectedCohortId, setSelectedCohortId] = useState<number | null>(null);
  const [entries, setEntries] = useState<TimetableEntryDetailed[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingEntries, setLoadingEntries] = useState(false);

  const [slotModal, setSlotModal] = useState<{ day: number; period: number; existing: TimetableEntryDetailed[] } | null>(null);
  const [addingRow, setAddingRow] = useState(false);
  const [editingRowId, setEditingRowId] = useState<number | null>(null);

  // Drag-and-drop: entry being dragged, and copy-mode toggle (holds a source
  // cell "picked up" for copying to other cells without a full drag gesture —
  // useful on touch devices where drag can be fiddly).
  const dragData = useRef<DragPayload | null>(null);
  const [dragOverKey, setDragOverKey] = useState<string | null>(null);
  const [copySource, setCopySource] = useState<{ entry: TimetableEntryDetailed; day: number; period: number } | null>(null);
  const [moveError, setMoveError] = useState<string | null>(null);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    if (session.school_id) {
      const [cohortData, teacherData, subjectData, periodData] = await Promise.all([
        fetchSchoolCohorts(session.school_id),
        fetchSchoolTeachers(session.school_id),
        fetchSubjects(),
        fetchSchoolPeriods(session.school_id),
      ]);
      setCohorts(cohortData);
      setTeachers(teacherData.filter((t) => t.is_active));
      setSubjects(subjectData);
      setPeriods(periodData);
      if (cohortData.length > 0) setSelectedCohortId(cohortData[0].id);
      if (periodData.length === 0) {
        // Seed default bell schedule so the grid isn't empty on first use.
        await setSchoolPeriods(session.school_id, DEFAULT_PERIODS);
        const seeded = await fetchSchoolPeriods(session.school_id);
        setPeriods(seeded);
      }
    }
    setLoading(false);
  };

  const loadEntries = async (cohort_id: number) => {
    setLoadingEntries(true);
    const data = await fetchCohortTimetable(cohort_id);
    setEntries(data);
    setLoadingEntries(false);
  };

  useEffect(() => {
    if (selectedCohortId) loadEntries(selectedCohortId);
    setCopySource(null);
  }, [selectedCohortId]);

  const selectedCohort = cohorts.find((c) => c.id === selectedCohortId) ?? null;

  const grid = useMemo(() => {
    const map = new Map<string, TimetableEntryDetailed[]>();
    for (const e of entries) {
      const key = `${e.day_of_week}-${e.period_number}`;
      const list = map.get(key) ?? [];
      list.push(e);
      map.set(key, list);
    }
    return map;
  }, [entries]);

  const openSlot = (day: number, period: number) => {
    const existing = grid.get(`${day}-${period}`) ?? [];
    setSlotModal({ day, period, existing });
  };

  const handleEntrySaved = async () => {
    if (selectedCohortId) await loadEntries(selectedCohortId);
  };

  const handleAddRow = async () => {
    if (!session.school_id) return;
    setAddingRow(true);
    const nextNum = periods.length > 0 ? Math.max(...periods.map((p) => p.period_number)) + 1 : 1;
    const result = await addSchoolPeriod(session.school_id, {
      label: `Period ${nextNum}`,
      start_time: null,
      end_time: null,
    });
    if (result.success) {
      setPeriods((prev) => [...prev, result.period]);
      setEditingRowId(result.period.id);
    }
    setAddingRow(false);
  };

  const handleRowTimeChange = async (period: TimetablePeriod, field: 'start_time' | 'end_time', value: string) => {
    setPeriods((prev) => prev.map((p) => (p.id === period.id ? { ...p, [field]: value || null } : p)));
    await updateSchoolPeriod(period.id, { [field]: value || null });
  };

  const handleRowLabelChange = async (period: TimetablePeriod, value: string) => {
    setPeriods((prev) => prev.map((p) => (p.id === period.id ? { ...p, label: value } : p)));
    await updateSchoolPeriod(period.id, { label: value });
  };

  const handleDeleteRow = async (period_id: number) => {
    const result = await deleteSchoolPeriod(period_id);
    if (result.success) {
      setPeriods((prev) => prev.filter((p) => p.id !== period_id));
      setEditingRowId(null);
    }
  };

  // ── Single-cell break add (click empty cell + Break button, or via the slot modal) ──

  const handleAddBreak = async (day: number, period: number) => {
    if (!session.school_id || !selectedCohortId) return;
    const result = await addBreakEntry({ school_id: session.school_id, cohort_id: selectedCohortId, day_of_week: day, period_number: period });
    if (result.success) await loadEntries(selectedCohortId);
  };

  // ── Drag-and-drop move ──

  const handleDragStart = (e: React.DragEvent, entry: TimetableEntryDetailed, slotCount: number) => {
    dragData.current = { entryId: entry.id, fromDay: entry.day_of_week, fromPeriod: entry.period_number, isBreak: entry.is_break, isSoleOccupant: slotCount === 1 };
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, day: number, period: number) => {
    e.preventDefault();
    setDragOverKey(`${day}-${period}`);
  };

  const handleDrop = async (e: React.DragEvent, day: number, period: number) => {
    e.preventDefault();
    setDragOverKey(null);
    const drag = dragData.current;
    dragData.current = null;
    if (!drag) return;
    if (drag.fromDay === day && drag.fromPeriod === period) return;

    const targetEntries = grid.get(`${day}-${period}`) ?? [];
    if (targetEntries.length > 0) {
      setMoveError('That cell already has something in it — remove it first, or drop on an empty cell.');
      return;
    }

    const result = await moveTimetableEntry(drag.entryId, day, period);
    if (!result.success) { setMoveError(result.error); return; }
    if (selectedCohortId) await loadEntries(selectedCohortId);
  };

  // ── Copy mode: pick a cell, then click a target cell to duplicate it there ──

  const handlePickCopySource = (entry: TimetableEntryDetailed, day: number, period: number) => {
    setCopySource({ entry, day, period });
  };

  const handleCopyTarget = async (day: number, period: number) => {
    if (!copySource) return;
    if (copySource.day === day && copySource.period === period) { setCopySource(null); return; }
    const result = await copyTimetableEntry(copySource.entry.id, day, period);
    setCopySource(null);
    if (!result.success) { setMoveError(result.error); return; }
    if (selectedCohortId) await loadEntries(selectedCohortId);
  };

  return (
    <div className="px-4 py-6 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
      <div className="mb-6">
        <span className="eyebrow">Admin</span>
        <h1 className="text-2xl font-black text-brand-dark tracking-tight">Timetable</h1>
        <p className="text-sm text-stone-500 mt-1">
          Click a cell to add a subject or break. Drag the <GripVertical className="inline w-3 h-3 -mt-0.5" /> handle to move a cell, or use the copy icon to duplicate it elsewhere.
        </p>
      </div>

      {copySource && (
        <div className="flex items-center gap-2.5 mb-4 px-4 py-3 bg-brand-dark text-white rounded-xl">
          <Copy className="w-4 h-4 shrink-0" />
          <p className="text-sm font-bold flex-1">
            Copying {copySource.entry.is_break ? (copySource.entry.break_label ?? 'Break') : copySource.entry.subject_label} — click any cell to paste it there.
          </p>
          <button onClick={() => setCopySource(null)} className="text-xs font-black uppercase tracking-wider text-white/70 hover:text-white">
            Cancel
          </button>
        </div>
      )}

      {moveError && (
        <div className="flex items-center gap-2.5 mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          <p className="text-sm font-bold text-red-700 flex-1">{moveError}</p>
          <button onClick={() => setMoveError(null)} className="text-red-400 hover:text-red-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-5 h-5 border-2 border-brand-border border-t-stone-700 rounded-full animate-spin" />
        </div>
      ) : cohorts.length === 0 ? (
        <div className="card-premium bg-white border border-brand-border rounded-[24px] p-12 text-center">
          <p className="font-bold text-brand-dark mb-1">No classes yet</p>
          <p className="text-sm text-stone-500">Create classes on the Classes page first.</p>
        </div>
      ) : (
        <>
          {/* Class selector */}
          <div className="flex gap-2 overflow-x-auto pb-1 mb-5">
            {cohorts.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCohortId(c.id)}
                className={`shrink-0 px-4 py-2 rounded-xl text-sm font-black transition-colors whitespace-nowrap ${
                  selectedCohortId === c.id ? 'bg-brand-dark text-white' : 'bg-white border border-brand-border text-stone-600 hover:border-stone-300'
                }`}
              >
                {c.name} <span className="opacity-60 font-bold">Gr {c.grade}</span>
              </button>
            ))}
          </div>

          {selectedCohort && (
            loadingEntries ? (
              <div className="flex items-center justify-center py-24">
                <div className="w-5 h-5 border-2 border-brand-border border-t-stone-700 rounded-full animate-spin" />
              </div>
            ) : (
              <div className="card-premium bg-white border border-brand-border rounded-[24px] overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr>
                      <th className="text-left px-4 py-3 text-xs font-black uppercase tracking-widest text-stone-500 border-b border-r border-brand-border/60 bg-stone-50 sticky left-0 z-10 min-w-[110px]">
                        Period
                      </th>
                      {DAYS.map((d) => (
                        <th key={d.value} className="text-left px-4 py-3 text-xs font-black uppercase tracking-widest text-stone-500 border-b border-brand-border/60 min-w-[180px]">
                          {d.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {periods.map((p) => {
                      const isEditing = editingRowId === p.id;
                      return (
                        <tr key={p.id} className="border-b border-stone-50 last:border-0">
                          <td className="px-4 py-3 font-bold text-brand-dark border-r border-brand-border/60 bg-stone-50 sticky left-0">
                            {isEditing ? (
                              <div className="space-y-1.5">
                                <input value={p.label} onChange={(e) => handleRowLabelChange(p, e.target.value)}
                                  className="w-full px-2 py-1 bg-white border border-brand-border rounded-lg text-xs font-black"
                                  placeholder="Period label" />
                                <div className="flex items-center gap-1">
                                  <input type="time" value={p.start_time ?? ''} onChange={(e) => handleRowTimeChange(p, 'start_time', e.target.value)}
                                    className="w-full px-1.5 py-1 bg-white border border-brand-border rounded-lg text-[10px] font-medium" />
                                  <input type="time" value={p.end_time ?? ''} onChange={(e) => handleRowTimeChange(p, 'end_time', e.target.value)}
                                    className="w-full px-1.5 py-1 bg-white border border-brand-border rounded-lg text-[10px] font-medium" />
                                </div>
                                <div className="flex items-center justify-between">
                                  <button onClick={() => setEditingRowId(null)} className="text-[10px] font-black text-stone-500 hover:text-brand-dark">Done</button>
                                  <button onClick={() => handleDeleteRow(p.id)} className="p-1 text-stone-400 hover:text-red-600 transition-colors">
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <button onClick={() => setEditingRowId(p.id)} className="text-left w-full">
                                <p className="text-xs font-black">{p.label}</p>
                                {p.start_time && p.end_time ? (
                                  <p className="text-[10px] text-stone-400 mt-0.5">{p.start_time.slice(0, 5)}–{p.end_time.slice(0, 5)}</p>
                                ) : (
                                  <p className="text-[10px] text-stone-300 mt-0.5">Set time</p>
                                )}
                              </button>
                            )}
                          </td>
                          {DAYS.map((d) => {
                            const key = `${d.value}-${p.period_number}`;
                            const slotEntries = grid.get(key) ?? [];
                            const isDragOver = dragOverKey === key;
                            return (
                              <td
                                key={d.value}
                                className={`px-2 py-2 align-top border-l border-stone-50 transition-colors ${isDragOver ? 'bg-blue-50' : ''}`}
                                onDragOver={(e) => handleDragOver(e, d.value, p.period_number)}
                                onDragLeave={() => setDragOverKey((k) => (k === key ? null : k))}
                                onDrop={(e) => handleDrop(e, d.value, p.period_number)}
                              >
                                {slotEntries.length === 0 ? (
                                  <div className="min-h-[52px] flex items-center justify-center gap-1">
                                    <button
                                      onClick={() => (copySource ? handleCopyTarget(d.value, p.period_number) : openSlot(d.value, p.period_number))}
                                      className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-300 hover:text-stone-500 transition-colors"
                                      title="Add subject"
                                    >
                                      <Plus className="w-3.5 h-3.5" />
                                    </button>
                                    {!copySource && (
                                      <button
                                        onClick={() => handleAddBreak(d.value, p.period_number)}
                                        className="p-1.5 rounded-lg hover:bg-amber-50 text-stone-300 hover:text-amber-500 transition-colors"
                                        title="Add break to this cell only"
                                      >
                                        <Coffee className="w-3.5 h-3.5" />
                                      </button>
                                    )}
                                  </div>
                                ) : (
                                  <div className="space-y-1">
                                    {slotEntries.map((e) => (
                                      <div
                                        key={e.id}
                                        draggable
                                        onDragStart={(ev) => handleDragStart(ev, e, slotEntries.length)}
                                        onClick={() => (copySource ? handleCopyTarget(d.value, p.period_number) : undefined)}
                                        className={`group flex items-start gap-1 rounded-lg px-2 py-1.5 border cursor-grab active:cursor-grabbing ${
                                          e.is_break ? 'bg-amber-50 border-amber-200' : 'bg-brand-bg border-brand-border'
                                        }`}
                                      >
                                        <GripVertical className="w-3 h-3 text-stone-300 shrink-0 mt-0.5 group-hover:text-stone-400" />
                                        <button
                                          onClick={(ev) => { ev.stopPropagation(); openSlot(d.value, p.period_number); }}
                                          className="min-w-0 flex-1 text-left"
                                        >
                                          {e.is_break ? (
                                            <p className="text-[11px] font-black text-amber-700 leading-tight truncate">{e.break_label ?? 'Break'}</p>
                                          ) : (
                                            <>
                                              <p className="text-[11px] font-black text-brand-dark leading-tight truncate">{e.subject_label}</p>
                                              <p className="text-[10px] text-stone-500 leading-tight truncate">
                                                {e.teacher_name} {e.teacher_surname}{e.room ? ` · ${e.room}` : ''}
                                              </p>
                                            </>
                                          )}
                                        </button>
                                        <button
                                          onClick={(ev) => { ev.stopPropagation(); handlePickCopySource(e, d.value, p.period_number); }}
                                          className="p-0.5 text-stone-300 hover:text-brand-dark transition-colors shrink-0"
                                          title="Copy this cell"
                                        >
                                          <Copy className="w-3 h-3" />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )
          )}

          {selectedCohort && !loadingEntries && (
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleAddRow} disabled={addingRow}
                className="flex items-center gap-2 text-xs font-black text-stone-600 bg-white hover:bg-stone-50 border border-brand-border px-4 py-2.5 rounded-xl transition-colors disabled:opacity-50"
              >
                <Plus className="w-3.5 h-3.5" /> Add Row
              </button>
            </div>
          )}
        </>
      )}

      {/* Slot editor modal */}
      <AnimatePresence>
        {slotModal && selectedCohort && (
          <SlotModal
            schoolId={session.school_id!}
            cohort={selectedCohort}
            day={slotModal.day}
            period={slotModal.period}
            existing={slotModal.existing}
            teachers={teachers}
            subjects={subjects}
            onClose={() => setSlotModal(null)}
            onSaved={handleEntrySaved}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Slot modal: shows existing subject-groups for this day/period, lets admin add/edit/remove ──

function SlotModal({
  schoolId, cohort, day, period, existing, teachers, subjects, onClose, onSaved,
}: {
  schoolId: number;
  cohort: CohortWithHomeroom;
  day: number;
  period: number;
  existing: TimetableEntryDetailed[];
  teachers: Teacher[];
  subjects: Subject[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [rows, setRows] = useState<TimetableEntryDetailed[]>(existing);
  const [adding, setAdding] = useState(existing.length === 0);
  const [subjectId, setSubjectId] = useState<number | ''>('');
  const [teacherId, setTeacherId] = useState<number | ''>('');
  const [room, setRoom] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clashWarning, setClashWarning] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const dayLabel = DAYS.find((d) => d.value === day)?.label ?? '';
  const hasBreak = rows.some((r) => r.is_break);

  const checkClash = async (tId: number) => {
    const clashes = await fetchTeacherClash(tId, day, period);
    if (clashes.length > 0) {
      const c = clashes[0];
      setClashWarning(`This teacher is already teaching ${c.subject_label} to ${c.cohort_name} at this time.`);
    } else {
      setClashWarning(null);
    }
  };

  const handleTeacherChange = (val: string) => {
    const id = val === '' ? '' : Number(val);
    setTeacherId(id);
    if (id !== '') checkClash(id);
    else setClashWarning(null);
  };

  const handleAdd = async () => {
    if (subjectId === '' || teacherId === '') {
      setError('Select a subject and teacher.');
      return;
    }
    setSaving(true);
    setError(null);
    const result = await addTimetableEntry({
      school_id: schoolId,
      cohort_id: cohort.id,
      subject_id: subjectId,
      teacher_id: teacherId,
      day_of_week: day,
      period_number: period,
      room: room || undefined,
    });
    setSaving(false);
    if (!result.success) { setError(result.error); return; }
    onSaved();
    setSubjectId(''); setTeacherId(''); setRoom(''); setClashWarning(null);
    setAdding(false);
    const subj = subjects.find((s) => s.id === subjectId);
    const t = teachers.find((tt) => tt.id === teacherId);
    setRows((prev) => [...prev, {
      id: result.entry_id, school_id: schoolId, cohort_id: cohort.id, subject_id: subjectId,
      teacher_id: teacherId, day_of_week: day, period_number: period, room: room || null,
      is_break: false, break_label: null,
      subject_label: subj?.label ?? '', teacher_name: t?.name ?? '', teacher_surname: t?.surname ?? '', cohort_name: cohort.name,
    }]);
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    const result = await deleteTimetableEntry(id);
    if (result.success) {
      setRows((prev) => prev.filter((r) => r.id !== id));
      onSaved();
    }
    setDeletingId(null);
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
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[85vh] flex flex-col">
          <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-brand-border/60 shrink-0">
            <div>
              <h2 className="text-base font-black text-brand-dark">{cohort.name} — {dayLabel}, Period {period}</h2>
              <p className="text-xs text-stone-500 mt-0.5">Add each subject group running in this slot.</p>
            </div>
            <button onClick={onClose} className="p-1 text-stone-400 hover:text-stone-600 shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="px-6 py-4 overflow-y-auto space-y-3">
            {rows.map((r) => (
              <div key={r.id} className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl border ${
                r.is_break ? 'bg-amber-50 border-amber-100' : 'bg-stone-50 border-stone-100'
              }`}>
                <div className="min-w-0">
                  {r.is_break ? (
                    <p className="text-sm font-bold text-amber-700 truncate">{r.break_label ?? 'Break'}</p>
                  ) : (
                    <>
                      <p className="text-sm font-bold text-brand-dark truncate">{r.subject_label}</p>
                      <p className="text-xs text-stone-500 truncate">{r.teacher_name} {r.teacher_surname}{r.room ? ` · ${r.room}` : ''}</p>
                    </>
                  )}
                </div>
                <button onClick={() => handleDelete(r.id)} disabled={deletingId === r.id}
                  className="p-2 text-stone-400 hover:text-red-600 transition-colors shrink-0">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            {!hasBreak && (adding ? (
              <div className="space-y-3 pt-1">
                {error && (
                  <div className="flex gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-xs font-bold text-red-700">{error}</p>
                  </div>
                )}
                {clashWarning && (
                  <div className="flex gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                    <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-xs font-bold text-amber-700">{clashWarning}</p>
                  </div>
                )}
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-stone-500 mb-1.5">Subject</label>
                  <select value={subjectId} onChange={(e) => setSubjectId(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-2.5 bg-stone-50 border border-brand-border rounded-xl text-sm font-medium text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10">
                    <option value="">Select subject</option>
                    {subjects.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-stone-500 mb-1.5">Teacher</label>
                  <select value={teacherId} onChange={(e) => handleTeacherChange(e.target.value)}
                    className="w-full px-3 py-2.5 bg-stone-50 border border-brand-border rounded-xl text-sm font-medium text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10">
                    <option value="">Select teacher</option>
                    {teachers.map((t) => <option key={t.id} value={t.id}>{t.name} {t.surname}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-stone-500 mb-1.5">Room <span className="normal-case font-medium text-stone-400">(optional)</span></label>
                  <input value={room} onChange={(e) => setRoom(e.target.value)} placeholder="e.g. Room 14"
                    className="w-full px-3 py-2.5 bg-stone-50 border border-brand-border rounded-xl text-sm font-medium text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10" />
                </div>
                <div className="flex gap-2">
                  {rows.length > 0 && (
                    <button onClick={() => { setAdding(false); setError(null); setClashWarning(null); }}
                      className="flex-1 py-2.5 text-sm font-bold text-stone-600 border border-brand-border rounded-xl hover:bg-stone-50 transition-all">
                      Cancel
                    </button>
                  )}
                  <button onClick={handleAdd} disabled={saving}
                    className="flex-1 py-2.5 text-sm font-black text-white bg-brand-dark rounded-xl hover:bg-brand-dark/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                    {saving ? <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Add Subject Group'}
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={() => setAdding(true)}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-black text-stone-600 border border-dashed border-brand-border rounded-xl hover:bg-stone-50 transition-all">
                <Plus className="w-4 h-4" /> Add Another Subject Group
              </button>
            ))}

            {hasBreak && (
              <p className="text-xs text-stone-400 text-center pt-1">This cell is a break — remove it to add subject groups here.</p>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
}
