import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, X, AlertCircle, Trash2, Coffee, Copy, GripVertical, Pencil } from 'lucide-react';
import type { AdminSession } from '../../../lib/auth';
import { fetchSchoolCohorts, type CohortWithHomeroom } from '../../../lib/homeroom';
import { fetchSchoolTeachers, type Teacher } from '../../../lib/teachers';
import { fetchSubjects, type Subject } from '../../../lib/students';
import {
  DAYS, fetchSchoolPeriods, setSchoolPeriods, fetchCohortTimetable,
  addTimetableEntry, addBreakEntry, deleteTimetableEntry, fetchTeacherClash,
  moveTimetableEntry, copyTimetableEntry, updateTimetableEntry,
  addSchoolPeriod, updateSchoolPeriod, deleteSchoolPeriod,
  type TimetablePeriod, type TimetableEntryDetailed,
} from '../../../lib/timetable';

// Period colour bands — cycled by period_number so every card's top strip
// reflects which period it belongs to, at a glance, across the whole grid.
const PERIOD_COLORS = [
  { strip: 'bg-blue-400',    ring: 'border-blue-100' },
  { strip: 'bg-violet-400',  ring: 'border-violet-100' },
  { strip: 'bg-emerald-400', ring: 'border-emerald-100' },
  { strip: 'bg-amber-400',   ring: 'border-amber-100' },
  { strip: 'bg-rose-400',    ring: 'border-rose-100' },
  { strip: 'bg-cyan-400',    ring: 'border-cyan-100' },
  { strip: 'bg-fuchsia-400', ring: 'border-fuchsia-100' },
  { strip: 'bg-lime-500',    ring: 'border-lime-100' },
];
function periodColor(period_number: number) {
  return PERIOD_COLORS[(period_number - 1) % PERIOD_COLORS.length];
}

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

  const [slotModal, setSlotModal] = useState<{ day: number; period: number; existing: TimetableEntryDetailed[]; editEntryId?: number } | null>(null);
  const [addingRow, setAddingRow] = useState(false);
  const [editingRowId, setEditingRowId] = useState<number | null>(null);

  // Drag-and-drop: entry being dragged.
  const dragData = useRef<DragPayload | null>(null);
  const [dragOverKey, setDragOverKey] = useState<string | null>(null);
  // Duplicate popover: a small inline day/period picker anchored to a single
  // card's Copy button — replaces the old global "copy-mode" that hijacked
  // every click in the grid until a target was picked.
  const [duplicatePopover, setDuplicatePopover] = useState<{ entry: TimetableEntryDetailed } | null>(null);
  const [duplicating, setDuplicating] = useState(false);
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
    setDuplicatePopover(null);
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

  const openSlot = (day: number, period: number, editEntryId?: number) => {
    const existing = grid.get(`${day}-${period}`) ?? [];
    setSlotModal({ day, period, existing, editEntryId });
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

    // Empty cell — plain move.
    if (targetEntries.length === 0) {
      const result = await moveTimetableEntry(drag.entryId, day, period);
      if (!result.success) { setMoveError(result.error); return; }
      if (selectedCohortId) await loadEntries(selectedCohortId);
      return;
    }

    // Exactly one entry already there — swap the two cells' slots.
    if (targetEntries.length === 1 && !drag.isBreak && !targetEntries[0].is_break) {
      const target = targetEntries[0];
      const [moveA, moveB] = await Promise.all([
        moveTimetableEntry(drag.entryId, day, period),
        moveTimetableEntry(target.id, drag.fromDay, drag.fromPeriod),
      ]);
      if (!moveA.success) { setMoveError(moveA.error); return; }
      if (!moveB.success) { setMoveError(moveB.error); return; }
      if (selectedCohortId) await loadEntries(selectedCohortId);
      return;
    }

    // Multiple entries in target, or a break involved — ambiguous to auto-swap.
    setMoveError('That cell already has multiple things in it — open it and remove one first, or drop on an empty cell.');
  };

  // ── Duplicate: pick a card's Copy button, then a day/period from the popover ──

  const handleDuplicateTo = async (entry: TimetableEntryDetailed, day: number, period: number) => {
    setDuplicating(true);
    const result = await copyTimetableEntry(entry.id, day, period);
    setDuplicating(false);
    setDuplicatePopover(null);
    if (!result.success) { setMoveError(result.error); return; }
    if (selectedCohortId) await loadEntries(selectedCohortId);
  };

  return (
    <div className="px-4 py-6 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
      <div className="mb-6">
        <span className="eyebrow">Admin</span>
        <h1 className="text-2xl font-black text-brand-dark tracking-tight">Timetable</h1>
        <p className="text-sm text-stone-500 mt-1">
          Click a card to edit it. Drag the <GripVertical className="inline w-3 h-3 -mt-0.5" /> handle to move or swap a cell, or use <Copy className="inline w-3 h-3 -mt-0.5" /> to duplicate it to another slot.
        </p>
      </div>

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
                    {periods.map((p, pIdx) => {
                      const isEditing = editingRowId === p.id;
                      const color = periodColor(p.period_number);
                      return (
                        <tr key={p.id} className={`${pIdx > 0 ? 'border-t-2 border-stone-200' : ''}`}>
                          <td className={`px-4 py-3 font-bold text-brand-dark border-r border-brand-border/60 bg-stone-50 sticky left-0`}>
                            <div className="flex items-center gap-2">
                              <span className={`w-1.5 h-8 rounded-full shrink-0 ${color.strip}`} />
                              <div className="min-w-0 flex-1">
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
                              </div>
                            </div>
                          </td>
                          {DAYS.map((d) => {
                            const key = `${d.value}-${p.period_number}`;
                            const slotEntries = grid.get(key) ?? [];
                            const isDragOver = dragOverKey === key;
                            return (
                              <td
                                key={d.value}
                                className={`px-2 py-2.5 align-top border-l border-stone-100 transition-colors ${isDragOver ? 'bg-blue-50' : ''}`}
                                onDragOver={(e) => handleDragOver(e, d.value, p.period_number)}
                                onDragLeave={() => setDragOverKey((k) => (k === key ? null : k))}
                                onDrop={(e) => handleDrop(e, d.value, p.period_number)}
                              >
                                {slotEntries.length === 0 ? (
                                  <div className="min-h-[52px] flex items-center justify-center gap-1">
                                    <button
                                      onClick={() => openSlot(d.value, p.period_number)}
                                      className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-300 hover:text-stone-500 transition-colors"
                                      title="Add subject"
                                    >
                                      <Plus className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => handleAddBreak(d.value, p.period_number)}
                                      className="p-1.5 rounded-lg hover:bg-amber-50 text-stone-300 hover:text-amber-500 transition-colors"
                                      title="Add break to this cell only"
                                    >
                                      <Coffee className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                ) : (
                                  <div className="space-y-1.5">
                                    {slotEntries.map((e) => (
                                      <div
                                        key={e.id}
                                        draggable
                                        onDragStart={(ev) => handleDragStart(ev, e, slotEntries.length)}
                                        className={`group relative rounded-lg border overflow-hidden cursor-grab active:cursor-grabbing ${
                                          e.is_break ? 'bg-amber-50 border-amber-200' : `bg-white ${color.ring}`
                                        }`}
                                      >
                                        {/* Top strip — colored per-period so a glance across the grid shows which period each card belongs to */}
                                        {!e.is_break && <div className={`h-1 w-full ${color.strip}`} />}
                                        <div className="flex items-start gap-1 px-2 py-1.5">
                                          <GripVertical className="w-3 h-3 text-stone-300 shrink-0 mt-0.5 group-hover:text-stone-400" />
                                          <button
                                            onClick={() => openSlot(d.value, p.period_number, e.id)}
                                            className="min-w-0 flex-1 text-left"
                                            title="Click to edit"
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
                                          {!e.is_break && (
                                            <div className="relative shrink-0">
                                              <button
                                                onClick={(ev) => { ev.stopPropagation(); setDuplicatePopover(duplicatePopover?.entry.id === e.id ? null : { entry: e }); }}
                                                className="p-0.5 text-stone-300 hover:text-brand-dark transition-colors"
                                                title="Duplicate this card to another slot"
                                              >
                                                <Copy className="w-3 h-3" />
                                              </button>
                                              {duplicatePopover?.entry.id === e.id && (
                                                <DuplicatePopover
                                                  periods={periods}
                                                  duplicating={duplicating}
                                                  onPick={(day, period) => handleDuplicateTo(e, day, period)}
                                                  onClose={() => setDuplicatePopover(null)}
                                                />
                                              )}
                                            </div>
                                          )}
                                        </div>
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
            initialEditId={slotModal.editEntryId}
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
  schoolId, cohort, day, period, existing, initialEditId, teachers, subjects, onClose, onSaved,
}: {
  schoolId: number;
  cohort: CohortWithHomeroom;
  day: number;
  period: number;
  existing: TimetableEntryDetailed[];
  initialEditId?: number;
  teachers: Teacher[];
  subjects: Subject[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [rows, setRows] = useState<TimetableEntryDetailed[]>(existing);
  // `editingId === null` means the form is adding a new row; a number means
  // the form is editing that existing row (pre-filled) instead.
  const [editingId, setEditingId] = useState<number | null | undefined>(
    initialEditId !== undefined ? initialEditId : (existing.length === 0 ? null : undefined)
  );
  const [subjectId, setSubjectId] = useState<number | ''>('');
  const [teacherId, setTeacherId] = useState<number | ''>('');
  const [room, setRoom] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clashWarning, setClashWarning] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const formOpen = editingId !== undefined;
  const dayLabel = DAYS.find((d) => d.value === day)?.label ?? '';
  const hasBreak = rows.some((r) => r.is_break);

  // Pre-fill the form when opening in edit mode (including on initial mount,
  // when a card's own edit button opened this modal directly).
  useEffect(() => {
    if (typeof editingId === 'number') {
      const row = rows.find((r) => r.id === editingId);
      if (row) {
        setSubjectId(row.subject_id ?? '');
        setTeacherId(row.teacher_id ?? '');
        setRoom(row.room ?? '');
      }
    } else if (editingId === null) {
      setSubjectId(''); setTeacherId(''); setRoom('');
    }
    setError(null); setClashWarning(null);
  }, [editingId]); // eslint-disable-line react-hooks/exhaustive-deps

  const checkClash = async (tId: number) => {
    const clashes = await fetchTeacherClash(tId, day, period, typeof editingId === 'number' ? editingId : undefined);
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
    const subj = subjects.find((s) => s.id === subjectId);
    const t = teachers.find((tt) => tt.id === teacherId);
    setRows((prev) => [...prev, {
      id: result.entry_id, school_id: schoolId, cohort_id: cohort.id, subject_id: subjectId,
      teacher_id: teacherId, day_of_week: day, period_number: period, room: room || null,
      is_break: false, break_label: null,
      subject_label: subj?.label ?? '', teacher_name: t?.name ?? '', teacher_surname: t?.surname ?? '', cohort_name: cohort.name,
    }]);
    setSubjectId(''); setTeacherId(''); setRoom(''); setClashWarning(null);
    setEditingId(undefined);
  };

  const handleSaveEdit = async () => {
    if (typeof editingId !== 'number' || subjectId === '' || teacherId === '') {
      setError('Select a subject and teacher.');
      return;
    }
    setSaving(true);
    setError(null);
    const result = await updateTimetableEntry(editingId, {
      subject_id: subjectId,
      teacher_id: teacherId,
      room: room || null,
    });
    setSaving(false);
    if (!result.success) { setError(result.error); return; }
    onSaved();
    const subj = subjects.find((s) => s.id === subjectId);
    const t = teachers.find((tt) => tt.id === teacherId);
    setRows((prev) => prev.map((r) => r.id === editingId ? {
      ...r, subject_id: subjectId, teacher_id: teacherId, room: room || null,
      subject_label: subj?.label ?? r.subject_label, teacher_name: t?.name ?? r.teacher_name, teacher_surname: t?.surname ?? r.teacher_surname,
    } : r));
    setSubjectId(''); setTeacherId(''); setRoom(''); setClashWarning(null);
    setEditingId(undefined);
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    const result = await deleteTimetableEntry(id);
    if (result.success) {
      setRows((prev) => prev.filter((r) => r.id !== id));
      if (editingId === id) setEditingId(undefined);
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
              <p className="text-xs text-stone-500 mt-0.5">
                {typeof editingId === 'number' ? 'Editing a subject group in this slot.' : 'Add each subject group running in this slot.'}
              </p>
            </div>
            <button onClick={onClose} className="p-1 text-stone-400 hover:text-stone-600 shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="px-6 py-4 overflow-y-auto space-y-3">
            {rows.map((r) => (
              typeof editingId === 'number' && editingId === r.id ? null : (
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
                  <div className="flex items-center gap-1 shrink-0">
                    {!r.is_break && (
                      <button onClick={() => setEditingId(r.id)}
                        className="p-2 text-stone-400 hover:text-brand-dark transition-colors">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button onClick={() => handleDelete(r.id)} disabled={deletingId === r.id}
                      className="p-2 text-stone-400 hover:text-red-600 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )
            ))}

            {!hasBreak && (formOpen ? (
              <div className="space-y-3 pt-1">
                {typeof editingId === 'number' && (
                  <p className="text-[10px] font-black uppercase tracking-widest text-stone-500">Editing subject group</p>
                )}
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
                    <button onClick={() => { setEditingId(undefined); setError(null); setClashWarning(null); }}
                      className="flex-1 py-2.5 text-sm font-bold text-stone-600 border border-brand-border rounded-xl hover:bg-stone-50 transition-all">
                      Cancel
                    </button>
                  )}
                  <button onClick={typeof editingId === 'number' ? handleSaveEdit : handleAdd} disabled={saving}
                    className="flex-1 py-2.5 text-sm font-black text-white bg-brand-dark rounded-xl hover:bg-brand-dark/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                    {saving
                      ? <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      : typeof editingId === 'number' ? 'Save Changes' : 'Add Subject Group'}
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={() => setEditingId(null)}
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

// ── Duplicate popover: small day/period picker anchored to a card's Copy button ──

function DuplicatePopover({
  periods, duplicating, onPick, onClose,
}: {
  periods: TimetablePeriod[];
  duplicating: boolean;
  onPick: (day: number, period: number) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(ev: MouseEvent) {
      if (ref.current && !ref.current.contains(ev.target as Node)) onClose();
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full mt-1 z-30 bg-white border border-brand-border rounded-xl shadow-xl p-2 w-56 max-h-64 overflow-y-auto"
      onClick={(ev) => ev.stopPropagation()}
    >
      <p className="text-[10px] font-black uppercase tracking-widest text-stone-500 px-2 pt-1 pb-2">Duplicate to…</p>
      {DAYS.map((d) => (
        <div key={d.value} className="mb-1.5 last:mb-0">
          <p className="text-[10px] font-bold text-stone-400 px-2 mb-0.5">{d.label}</p>
          <div className="flex flex-wrap gap-1 px-1">
            {periods.map((p) => (
              <button
                key={p.id}
                disabled={duplicating}
                onClick={() => onPick(d.value, p.period_number)}
                className="px-2 py-1 rounded-lg text-[10px] font-bold bg-stone-100 text-stone-600 hover:bg-brand-dark hover:text-white transition-colors disabled:opacity-40"
              >
                {p.period_number}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
