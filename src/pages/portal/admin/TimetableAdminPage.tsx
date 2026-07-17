import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus, X, AlertCircle, Trash2, Coffee, Copy, GripVertical, Pencil,
  ChevronLeft, ChevronRight, PencilLine, Check, RotateCcw, Sparkles, CalendarDays,
} from 'lucide-react';
import type { AdminSession } from '../../../lib/auth';
import { fetchSchoolCohorts, type CohortWithHomeroom } from '../../../lib/homeroom';
import { fetchSchoolTeachers, type Teacher } from '../../../lib/teachers';
import { fetchSubjects, type Subject } from '../../../lib/students';
import Dropdown from '../../../shared/components/Dropdown';
import {
  DAYS, fetchSchoolPeriods, setSchoolPeriods, fetchCohortTimetable,
  addTimetableEntry, addBreakEntry, deleteTimetableEntry, fetchTeacherClash,
  moveTimetableEntry, copyTimetableEntry, updateTimetableEntry,
  addSchoolPeriod, updateSchoolPeriod, deleteSchoolPeriod,
  type TimetablePeriod, type TimetableEntryDetailed,
} from '../../../lib/timetable';

const ease = [0.23, 1, 0.32, 1] as [number, number, number, number];

interface TimetableAdminPageProps { session: AdminSession; }

const DEFAULT_PERIODS: { period_number: number; label: string; start_time: string | null; end_time: string | null }[] =
  Array.from({ length: 7 }, (_, i) => ({
    period_number: i + 1,
    label: `Period ${i + 1}`,
    start_time: null,
    end_time: null,
  }));

type DragPayload = { entryId: number; fromDay: number; fromPeriod: number; isBreak: boolean };

// A locally-staged entry — real rows carry their DB id; brand-new rows get a
// negative temp id so they can be tracked/edited/removed before ever hitting
// the database. `_dirty` marks rows changed since the last save (for the
// "Unsaved changes" indicator and to compute the save diff).
interface DraftEntry extends TimetableEntryDetailed {
  _new?: boolean;
}

let tempIdCounter = -1;
function nextTempId() { return tempIdCounter--; }

export default function TimetableAdminPage({ session }: TimetableAdminPageProps) {
  const [cohorts, setCohorts] = useState<CohortWithHomeroom[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [periods, setPeriods] = useState<TimetablePeriod[]>([]);
  const [selectedCohortId, setSelectedCohortId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingEntries, setLoadingEntries] = useState(false);

  // Last-saved baseline vs. the local working draft. Outside edit mode the
  // grid is read-only and always shows `savedEntries`. Entering edit mode
  // seeds `draftEntries` from it; every add/edit/delete/move/duplicate then
  // mutates the draft only. Save diffs draft against baseline and commits;
  // Cancel just discards the draft and reverts to baseline.
  const [savedEntries, setSavedEntries] = useState<DraftEntry[]>([]);
  const [draftEntries, setDraftEntries] = useState<DraftEntry[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const entries = editMode ? draftEntries : savedEntries;

  const [slotModal, setSlotModal] = useState<{ day: number; period: number; existing: DraftEntry[]; editEntryId?: number } | null>(null);
  const [addingRow, setAddingRow] = useState(false);
  const [editingRowId, setEditingRowId] = useState<number | null>(null);

  // Drag-and-drop: entry being dragged.
  const dragData = useRef<DragPayload | null>(null);
  const [dragOverKey, setDragOverKey] = useState<string | null>(null);
  // Duplicate popover: a small inline day/period picker anchored to a single
  // card's Copy button — replaces the old global "copy-mode" that hijacked
  // every click in the grid until a target was picked.
  const [duplicatePopover, setDuplicatePopover] = useState<{ entry: DraftEntry } | null>(null);
  const [moveError, setMoveError] = useState<string | null>(null);

  // Mobile: one day shown at a time, switched via arrows/tabs — the grid
  // itself is desktop-only (hidden below md).
  const [mobileDay, setMobileDay] = useState<number>(1);
  const [imgLoaded, setImgLoaded] = useState(false);

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
    setSavedEntries(data);
    setDraftEntries(data);
    setEditMode(false);
    setDirty(false);
    setLoadingEntries(false);
  };

  useEffect(() => {
    if (selectedCohortId) loadEntries(selectedCohortId);
    setDuplicatePopover(null);
  }, [selectedCohortId]);

  const selectedCohort = cohorts.find((c) => c.id === selectedCohortId) ?? null;

  const grid = useMemo(() => {
    const map = new Map<string, DraftEntry[]>();
    for (const e of entries) {
      const key = `${e.day_of_week}-${e.period_number}`;
      const list = map.get(key) ?? [];
      list.push(e);
      map.set(key, list);
    }
    return map;
  }, [entries]);

  // ── Edit mode lifecycle ──

  const startEditing = () => {
    setDraftEntries(savedEntries);
    setDirty(false);
    setSaveError(null);
    setEditMode(true);
  };

  const cancelEditing = () => {
    setDraftEntries(savedEntries);
    setDirty(false);
    setSaveError(null);
    setEditMode(false);
    setSlotModal(null);
    setDuplicatePopover(null);
  };

  const saveChanges = async () => {
    if (!selectedCohortId || !session.school_id) return;
    setSaving(true);
    setSaveError(null);

    const savedIds = new Set(savedEntries.map((e) => e.id));
    const draftIds = new Set(draftEntries.map((e) => e.id));

    const toDelete = savedEntries.filter((e) => !draftIds.has(e.id));
    const toInsert = draftEntries.filter((e) => e._new);
    const toUpdate = draftEntries.filter((e) => {
      if (e._new || !savedIds.has(e.id)) return false;
      const prev = savedEntries.find((s) => s.id === e.id);
      if (!prev) return false;
      return (
        prev.subject_id !== e.subject_id || prev.teacher_id !== e.teacher_id ||
        prev.room !== e.room || prev.day_of_week !== e.day_of_week ||
        prev.period_number !== e.period_number || prev.break_label !== e.break_label
      );
    });

    try {
      const results = await Promise.all([
        ...toDelete.map((e) => deleteTimetableEntry(e.id)),
        ...toUpdate.map(async (e) => {
          const prev = savedEntries.find((s) => s.id === e.id)!;
          // Moved to a different slot — use the move endpoint; field edits
          // (subject/teacher/room) use the update endpoint. A row can need
          // both, so fire both when relevant.
          const ops: Promise<{ success: boolean }>[] = [];
          if (prev.day_of_week !== e.day_of_week || prev.period_number !== e.period_number) {
            ops.push(moveTimetableEntry(e.id, e.day_of_week, e.period_number));
          }
          if (prev.subject_id !== e.subject_id || prev.teacher_id !== e.teacher_id || prev.room !== e.room) {
            ops.push(updateTimetableEntry(e.id, {
              subject_id: e.subject_id ?? undefined,
              teacher_id: e.teacher_id ?? undefined,
              room: e.room,
            }));
          }
          const opResults = await Promise.all(ops);
          return { success: opResults.every((r) => r.success) };
        }),
        ...toInsert.map((e) => e.is_break
          ? addBreakEntry({
              school_id: session.school_id!, cohort_id: selectedCohortId,
              day_of_week: e.day_of_week, period_number: e.period_number, label: e.break_label ?? undefined,
            })
          : addTimetableEntry({
              school_id: session.school_id!, cohort_id: selectedCohortId,
              subject_id: e.subject_id!, teacher_id: e.teacher_id!,
              day_of_week: e.day_of_week, period_number: e.period_number, room: e.room ?? undefined,
            })
        ),
      ]);

      const fresh = await fetchCohortTimetable(selectedCohortId);
      setSavedEntries(fresh);
      setDraftEntries(fresh);

      if (results.some((r) => !r.success)) {
        setSaveError('Some changes failed to save — please review the timetable and try again.');
        // Stay in edit mode so nothing staged is silently lost from view.
      } else {
        setDirty(false);
        setEditMode(false);
      }
    } catch {
      const fresh = await fetchCohortTimetable(selectedCohortId).catch(() => savedEntries);
      setSavedEntries(fresh);
      setDraftEntries(fresh);
      setSaveError('Some changes failed to save — please try again.');
    } finally {
      setSaving(false);
    }
  };

  const markDirty = () => setDirty(true);

  const openSlot = (day: number, period: number, editEntryId?: number) => {
    const existing = grid.get(`${day}-${period}`) ?? [];
    setSlotModal({ day, period, existing, editEntryId });
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
  // Staged locally only — becomes a real row on Save.

  const handleAddBreak = (day: number, period: number) => {
    if (!selectedCohortId || !session.school_id) return;
    const entry: DraftEntry = {
      id: nextTempId(), school_id: session.school_id, cohort_id: selectedCohortId,
      subject_id: null, teacher_id: null, day_of_week: day, period_number: period,
      room: null, is_break: true, break_label: 'Break',
      subject_label: '', teacher_name: '', teacher_surname: '', cohort_name: selectedCohort?.name ?? '',
      _new: true,
    };
    setDraftEntries((prev) => [...prev, entry]);
    markDirty();
  };

  // ── Drag-and-drop move (local only) ──

  const handleDragStart = (e: React.DragEvent, entry: DraftEntry) => {
    dragData.current = { entryId: entry.id, fromDay: entry.day_of_week, fromPeriod: entry.period_number, isBreak: entry.is_break };
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, day: number, period: number) => {
    e.preventDefault();
    setDragOverKey(`${day}-${period}`);
  };

  const handleDrop = (e: React.DragEvent, day: number, period: number) => {
    e.preventDefault();
    setDragOverKey(null);
    const drag = dragData.current;
    dragData.current = null;
    if (!drag) return;
    if (drag.fromDay === day && drag.fromPeriod === period) return;

    const targetEntries = grid.get(`${day}-${period}`) ?? [];

    if (drag.isBreak && targetEntries.length > 0) {
      setMoveError('Breaks can\'t share a slot with something else — drop on an empty cell.');
      return;
    }
    if (targetEntries.some((t) => t.is_break)) {
      setMoveError('That cell is a break — remove it first, or drop on an empty cell.');
      return;
    }

    // Move the card there, stacking alongside whatever's already in the slot
    // (same model as a class splitting into simultaneous subject groups).
    setDraftEntries((prev) => prev.map((e) =>
      e.id === drag.entryId ? { ...e, day_of_week: day, period_number: period } : e
    ));
    markDirty();
  };

  // ── Duplicate: pick a card's Copy button, then a day/period from the popover (local only) ──

  const handleDuplicateTo = (entry: DraftEntry, day: number, period: number) => {
    const copy: DraftEntry = { ...entry, id: nextTempId(), day_of_week: day, period_number: period, _new: true };
    setDraftEntries((prev) => [...prev, copy]);
    setDuplicatePopover(null);
    markDirty();
  };

  const entryCardProps = { duplicatePopover, periods,
    onOpenSlot: openSlot, onAddBreak: handleAddBreak, onDragStart: handleDragStart,
    onToggleDuplicate: (entry: DraftEntry | null) => setDuplicatePopover(entry ? { entry } : null),
    onDuplicateTo: handleDuplicateTo, editMode };

  return (
    <div className="student-home min-h-full pb-16">

      {/* ═══ Hero — full-width crested banner ═════════════════════ */}
      <div className="relative overflow-hidden bg-brand-dark border-b border-brand-border grain-surface flex flex-col justify-end min-h-[220px] sm:min-h-[260px] lg:min-h-[280px]">
        <div className="absolute inset-0 pointer-events-none">
          <motion.img src="/images/nizamiye-timetable.png" alt=""
            onLoad={() => setImgLoaded(true)}
            initial={{ opacity: 0 }} animate={{ opacity: imgLoaded ? 0.62 : 0 }}
            transition={{ duration: 0.6, ease }}
            className="w-full h-full object-cover" />
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(100deg, rgba(21,23,28,0.82) 0%, rgba(21,23,28,0.62) 35%, rgba(21,23,28,0.3) 62%, rgba(21,23,28,0.66) 100%)' }} />
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(180deg, rgba(21,23,28,0) 0%, transparent 45%, rgba(21,23,28,0.75) 100%)' }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 pt-8 sm:pt-11 pb-8 sm:pb-10 w-full flex items-end justify-between gap-4 flex-wrap">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/45 leading-none">Admin</p>
            <h1 className="font-display font-extrabold text-white text-[28px] sm:text-[40px] mt-3 leading-[1.1]"
              style={{ letterSpacing: '-0.02em', textShadow: '0 2px 20px rgba(0,0,0,0.35)' }}>
              Timetable
            </h1>
            <p className="text-[10px] sm:text-[11px] text-white/60 mt-1.5 font-medium max-w-md">
              {editMode
                ? <><span className="sm:hidden">Tap a card to edit it. Nothing is saved until you tap Save.</span><span className="hidden sm:inline">Click a card to edit it. Drag the <GripVertical className="inline w-3 h-3 -mt-0.5" /> handle to move it, or use <Copy className="inline w-3 h-3 -mt-0.5" /> to duplicate it elsewhere. Nothing is saved until you click Save.</span></>
                : 'Tap Edit Timetable to make changes.'}
            </p>
          </div>

          {selectedCohort && !loading && (
            <div className="flex items-center gap-2 shrink-0">
              {editMode && (
                <SaveStatusPill dirty={dirty} saving={saving} />
              )}
              {!editMode ? (
                <motion.button
                  onClick={startEditing} whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}
                  className="edge-glow flex items-center gap-2 bg-accent text-white text-sm font-black px-5 py-2.5 rounded shrink-0 transition-colors duration-200 hover:bg-[var(--color-accent-soft)]"
                >
                  <PencilLine className="w-4 h-4" /> Edit Timetable
                </motion.button>
              ) : (
                <>
                  <button
                    onClick={cancelEditing}
                    disabled={saving}
                    className="flex items-center gap-2 bg-white border border-brand-border text-stone-600 text-sm font-black px-4 py-2.5 rounded hover:bg-stone-50 transition-colors disabled:opacity-50"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Cancel
                  </button>
                  <button
                    onClick={saveChanges}
                    disabled={saving || !dirty}
                    className="flex items-center gap-2 bg-emerald-600 text-white text-sm font-black px-4 py-2.5 rounded hover:bg-emerald-700 transition-colors disabled:opacity-50 shadow-sm"
                  >
                    {saving ? <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Check className="w-4 h-4" />}
                    {saving ? 'Saving…' : 'Save Changes'}
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ═══ Body ═══════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10 space-y-5 sm:space-y-6 pt-6 sm:pt-8">

      {saveError && (
        <div className="flex items-center gap-2.5 mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          <p className="text-sm font-bold text-red-700 flex-1">{saveError}</p>
          <button onClick={() => setSaveError(null)} className="text-red-400 hover:text-red-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {moveError && (
        <div className="flex items-center gap-2.5 mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded">
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
        <div className="paper-card rounded p-12 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded bg-stone-100 flex items-center justify-center mb-4">
            <CalendarDays className="w-5 h-5 text-stone-500" />
          </div>
          <p className="font-bold text-brand-dark mb-1">No classes yet</p>
          <p className="text-sm text-stone-500">Create classes on the Classes page first.</p>
        </div>
      ) : (
        <>
          {/* Class selector — pill toolbar */}
          <div className="paper-card rounded-2xl p-1.5 flex gap-1.5 overflow-x-auto mb-5">
            {cohorts.map((c) => (
              <button
                key={c.id}
                onClick={() => { if (!editMode) setSelectedCohortId(c.id); }}
                disabled={editMode}
                className={`shrink-0 px-4 py-2 rounded text-sm font-black transition-colors whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed ${
                  selectedCohortId === c.id ? 'bg-brand-dark text-white shadow-sm' : 'text-stone-600 hover:bg-white/70'
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
            ) : entries.length === 0 && !editMode ? (
              <EmptyTimetableState onStartEditing={startEditing} />
            ) : (
              <>
                {/* ── Desktop grid (md and up) — macOS-Calendar-style hairlines, no heavy borders ── */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                  className="hidden md:block glass-panel rounded-[24px] overflow-x-auto"
                >
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr>
                        <th className="text-left px-4 py-3.5 text-xs font-black uppercase tracking-widest text-stone-600 border-b-2 border-r border-stone-300/60 sticky left-0 z-20 min-w-[110px] bg-white/85 backdrop-blur-md shadow-[2px_0_8px_-2px_rgba(0,0,0,0.06)]">
                          Period
                        </th>
                        {DAYS.map((d) => (
                          <th key={d.value} className="text-left px-4 py-3.5 text-xs font-black uppercase tracking-widest text-stone-600 border-b-2 border-stone-300/60 bg-white/50 backdrop-blur-md min-w-[170px]">
                            {d.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {periods.map((p, pIdx) => {
                        const isEditing = editingRowId === p.id;
                        return (
                          <motion.tr
                            key={p.id}
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            transition={{ duration: 0.25, delay: Math.min(pIdx * 0.02, 0.2) }}
                            className="border-b border-stone-100/80 last:border-0"
                          >
                            <td className="p-0 font-bold text-brand-dark sticky left-0 z-10 bg-gradient-to-r from-stone-100/90 to-stone-50/70 backdrop-blur-md border-r border-stone-300/50 shadow-[2px_0_8px_-2px_rgba(0,0,0,0.05)]">
                              <div className="px-4 py-3 border-l-[3px] border-brand-dark/15">
                                {isEditing && editMode ? (
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
                                  <button
                                    onClick={() => editMode && setEditingRowId(p.id)}
                                    disabled={!editMode}
                                    className="text-left w-full disabled:cursor-default"
                                  >
                                    <p className="text-[13px] font-black text-brand-dark tracking-tight">{p.label}</p>
                                    {p.start_time && p.end_time ? (
                                      <p className="text-[10px] font-bold text-stone-400 mt-0.5">{p.start_time.slice(0, 5)}–{p.end_time.slice(0, 5)}</p>
                                    ) : (
                                      <p className="text-[10px] text-stone-300 mt-0.5">{editMode ? 'Set time' : ''}</p>
                                    )}
                                  </button>
                                )}
                              </div>
                            </td>
                            {DAYS.map((d) => {
                              const key = `${d.value}-${p.period_number}`;
                              const slotEntries = grid.get(key) ?? [];
                              const isDragOver = dragOverKey === key;
                              return (
                                <td
                                  key={d.value}
                                  className={`px-2 py-2 align-top border-l border-stone-100/80 transition-colors ${isDragOver ? 'bg-blue-50/70' : ''}`}
                                  onDragOver={editMode ? (e) => handleDragOver(e, d.value, p.period_number) : undefined}
                                  onDragLeave={editMode ? () => setDragOverKey((k) => (k === key ? null : k)) : undefined}
                                  onDrop={editMode ? (e) => handleDrop(e, d.value, p.period_number) : undefined}
                                >
                                  <SlotCell day={d.value} period={p.period_number} slotEntries={slotEntries} {...entryCardProps} />
                                </td>
                              );
                            })}
                          </motion.tr>
                        );
                      })}
                    </tbody>
                  </table>
                </motion.div>

                {/* ── Mobile day view (below md) — one day at a time, switched with arrows/tabs ── */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                  className="md:hidden"
                >
                  <div className="glass-panel rounded-2xl p-1.5 flex items-center gap-1 mb-3">
                    <button onClick={() => setMobileDay((d) => (d === 1 ? 5 : d - 1))} className="p-2 text-stone-500 hover:text-brand-dark shrink-0">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <div className="flex-1 grid grid-cols-5 gap-1">
                      {DAYS.map((d) => (
                        <button
                          key={d.value}
                          onClick={() => setMobileDay(d.value)}
                          className={`py-2 rounded text-[11px] font-black transition-colors ${
                            mobileDay === d.value ? 'bg-brand-dark text-white shadow-sm' : 'text-stone-500 hover:bg-white/70'
                          }`}
                        >
                          {d.label.slice(0, 3)}
                        </button>
                      ))}
                    </div>
                    <button onClick={() => setMobileDay((d) => (d === 5 ? 1 : d + 1))} className="p-2 text-stone-500 hover:text-brand-dark shrink-0">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="glass-panel rounded-[24px] divide-y divide-stone-100/80 overflow-hidden">
                    {periods.map((p) => {
                      const key = `${mobileDay}-${p.period_number}`;
                      const slotEntries = grid.get(key) ?? [];
                      return (
                        <div key={p.id} className="flex">
                          <div className="w-20 shrink-0 pl-3.5 pr-3 py-3 bg-gradient-to-r from-stone-100/90 to-stone-50/70 backdrop-blur-md border-r border-stone-300/50 border-l-[3px] border-l-brand-dark/15">
                            <p className="text-[13px] font-black text-brand-dark tracking-tight leading-tight">{p.label}</p>
                            {p.start_time && p.end_time ? (
                              <p className="text-[10px] font-bold text-stone-400 mt-0.5">{p.start_time.slice(0, 5)}–{p.end_time.slice(0, 5)}</p>
                            ) : null}
                          </div>
                          <div className="flex-1 min-w-0 px-3 py-3">
                            <SlotCell day={mobileDay} period={p.period_number} slotEntries={slotEntries} {...entryCardProps} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              </>
            )
          )}

          {selectedCohort && !loadingEntries && editMode && (
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleAddRow} disabled={addingRow}
                className="flex items-center gap-2 text-xs font-black text-stone-600 bg-white hover:bg-stone-50 border border-brand-border px-4 py-2.5 rounded transition-colors disabled:opacity-50"
              >
                <Plus className="w-3.5 h-3.5" /> Add Row
              </button>
            </div>
          )}
        </>
      )}
      </div>

      {/* Slot editor modal */}
      <AnimatePresence>
        {slotModal && selectedCohort && editMode && (
          <SlotModal
            day={slotModal.day}
            period={slotModal.period}
            existing={slotModal.existing}
            initialEditId={slotModal.editEntryId}
            teachers={teachers}
            subjects={subjects}
            allDraftEntries={draftEntries}
            onClose={() => setSlotModal(null)}
            onChange={(updater) => { setDraftEntries(updater); markDirty(); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Save status pill ──

function SaveStatusPill({ dirty, saving }: { dirty: boolean; saving: boolean }) {
  const label = saving ? 'Saving…' : dirty ? 'Unsaved changes' : 'All changes saved';
  const dot = saving ? 'bg-blue-400 animate-pulse' : dirty ? 'bg-amber-400' : 'bg-emerald-400';
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white/70 border border-stone-200/70 backdrop-blur-sm">
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dot}`} />
      <span className="text-[10px] sm:text-[11px] font-bold text-stone-500 whitespace-nowrap">{label}</span>
    </div>
  );
}

// ── Empty state ──

function EmptyTimetableState({ onStartEditing }: { onStartEditing: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
      className="paper-card rounded p-12 text-center"
    >
      <div className="w-12 h-12 rounded-2xl bg-brand-bg flex items-center justify-center mx-auto mb-4">
        <CalendarDays className="w-5 h-5 text-stone-400" />
      </div>
      <p className="font-black text-brand-dark mb-1">No timetable yet for this class</p>
      <p className="text-sm text-stone-500 mb-5">Enter edit mode to start adding subjects and breaks.</p>
      <button
        onClick={onStartEditing}
        className="inline-flex items-center gap-2 bg-brand-dark text-white text-sm font-black px-5 py-2.5 rounded hover:bg-brand-dark/90 transition-colors"
      >
        <Sparkles className="w-4 h-4" /> Start Building
      </button>
    </motion.div>
  );
}

// ── Slot cell: renders either the empty-cell add buttons or the stacked entry
// cards for a single (day, period) slot — shared between the desktop grid and
// the mobile day view so both stay visually and behaviourally identical. ──

interface SlotCellProps {
  day: number;
  period: number;
  slotEntries: DraftEntry[];
  duplicatePopover: { entry: DraftEntry } | null;
  periods: TimetablePeriod[];
  editMode: boolean;
  onOpenSlot: (day: number, period: number, editEntryId?: number) => void;
  onAddBreak: (day: number, period: number) => void;
  onDragStart: (e: React.DragEvent, entry: DraftEntry) => void;
  onToggleDuplicate: (entry: DraftEntry | null) => void;
  onDuplicateTo: (entry: DraftEntry, day: number, period: number) => void;
}

function SlotCell({
  day, period, slotEntries, duplicatePopover, periods, editMode,
  onOpenSlot, onAddBreak, onDragStart, onToggleDuplicate, onDuplicateTo,
}: SlotCellProps) {
  if (slotEntries.length === 0) {
    if (!editMode) return <div className="min-h-[40px]" />;
    return (
      <div className="min-h-[48px] flex items-center gap-1">
        <button
          onClick={() => onOpenSlot(day, period)}
          className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-300 hover:text-stone-500 transition-colors"
          title="Add subject"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onAddBreak(day, period)}
          className="p-1.5 rounded-lg hover:bg-amber-50 text-stone-300 hover:text-amber-500 transition-colors"
          title="Add break to this cell only"
        >
          <Coffee className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {slotEntries.map((e) => (
        e.is_break ? (
          <BreakChip key={e.id} entry={e} editMode={editMode} onDragStart={onDragStart} onOpenSlot={() => onOpenSlot(day, period, e.id)} />
        ) : (
          <div
            key={e.id}
            draggable={editMode}
            onDragStart={editMode ? (ev) => onDragStart(ev, e) : undefined}
            onClick={!editMode ? undefined : () => onOpenSlot(day, period, e.id)}
            className={`group flex items-center gap-1.5 rounded border px-2.5 py-1.5 transition-colors ${
              editMode ? 'cursor-grab active:cursor-grabbing hover:border-stone-300 hover:bg-white' : ''
            } bg-white/70 border-stone-200/70`}
          >
            {editMode && <GripVertical className="w-3 h-3 text-stone-300 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />}
            <div className="min-w-0 flex-1" title={editMode ? 'Click to edit' : undefined}>
              <p className="text-[11px] font-black text-brand-dark leading-tight truncate">{e.subject_label}</p>
              <p className="text-[10px] text-stone-500 leading-tight truncate">
                {e.teacher_name} {e.teacher_surname}{e.room ? ` · ${e.room}` : ''}
              </p>
            </div>
            {editMode && (
              <div className="relative shrink-0">
                <button
                  onClick={(ev) => { ev.stopPropagation(); onToggleDuplicate(duplicatePopover?.entry.id === e.id ? null : e); }}
                  className="p-0.5 text-stone-300 opacity-0 group-hover:opacity-100 hover:text-brand-dark! transition-all"
                  title="Duplicate this card to another slot"
                >
                  <Copy className="w-3 h-3" />
                </button>
                {duplicatePopover?.entry.id === e.id && (
                  <DuplicatePopover
                    periods={periods}
                    onPick={(pickDay, pickPeriod) => onDuplicateTo(e, pickDay, pickPeriod)}
                    onClose={() => onToggleDuplicate(null)}
                  />
                )}
              </div>
            )}
          </div>
        )
      ))}
    </div>
  );
}

// ── Break chip — visually distinct from subject cards: a solid amber pill
// with an icon badge, clearly color-coded without a busy pattern. ──

function BreakChip({
  entry, editMode, onDragStart, onOpenSlot,
}: {
  entry: DraftEntry;
  editMode: boolean;
  onDragStart: (e: React.DragEvent, entry: DraftEntry) => void;
  onOpenSlot: () => void;
}) {
  return (
    <div
      draggable={editMode}
      onDragStart={editMode ? (ev) => onDragStart(ev, entry) : undefined}
      onClick={editMode ? onOpenSlot : undefined}
      className={`flex items-center gap-2 rounded-full pl-1 pr-3 py-1 bg-amber-50 border border-amber-200 ${
        editMode ? 'cursor-grab active:cursor-grabbing hover:bg-amber-100 hover:border-amber-300 transition-colors' : ''
      }`}
    >
      <span className="w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center shrink-0">
        <Coffee className="w-2.5 h-2.5 text-white" />
      </span>
      <p className="text-[11px] font-black text-amber-800 leading-tight truncate">{entry.break_label ?? 'Break'}</p>
    </div>
  );
}

// ── Slot modal: shows existing subject-groups for this day/period, lets admin add/edit/remove ──
// Operates entirely on the in-memory draft — passed the full draft array and
// a setter, rather than talking to Supabase directly (that only happens on
// the page-level Save).

function SlotModal({
  day, period, existing, initialEditId, teachers, subjects, allDraftEntries, onClose, onChange,
}: {
  day: number;
  period: number;
  existing: DraftEntry[];
  initialEditId?: number;
  teachers: Teacher[];
  subjects: Subject[];
  allDraftEntries: DraftEntry[];
  onClose: () => void;
  onChange: (updater: (prev: DraftEntry[]) => DraftEntry[]) => void;
}) {
  const [rows, setRows] = useState<DraftEntry[]>(existing);
  // `editingId === null` means the form is adding a new row; a number means
  // the form is editing that existing row (pre-filled) instead.
  const [editingId, setEditingId] = useState<number | null | undefined>(
    initialEditId !== undefined ? initialEditId : (existing.length === 0 ? null : undefined)
  );
  const [subjectId, setSubjectId] = useState<number | ''>('');
  const [teacherId, setTeacherId] = useState<number | ''>('');
  const [room, setRoom] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [clashWarning, setClashWarning] = useState<string | null>(null);

  const formOpen = editingId !== undefined;
  const dayLabel = DAYS.find((d) => d.value === day)?.label ?? '';
  const hasBreak = rows.some((r) => r.is_break);

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

  // Clash-check against the local draft — no network call, since the whole
  // point of edit mode is that nothing's saved yet to check against remotely.
  const checkClash = (tId: number) => {
    const clash = allDraftEntries.find((e) =>
      e.teacher_id === tId && e.day_of_week === day && e.period_number === period &&
      e.id !== editingId && !e.is_break
    );
    setClashWarning(clash ? `This teacher is already teaching ${clash.subject_label} to ${clash.cohort_name} at this time.` : null);
  };

  const handleTeacherChange = (val: string) => {
    const id = val === '' ? '' : Number(val);
    setTeacherId(id);
    if (id !== '') checkClash(id); else setClashWarning(null);
  };

  const handleAdd = () => {
    if (subjectId === '' || teacherId === '') {
      setError('Select a subject and teacher.');
      return;
    }
    const subj = subjects.find((s) => s.id === subjectId);
    const t = teachers.find((tt) => tt.id === teacherId);
    const entry: DraftEntry = {
      id: nextTempId(), school_id: 0, cohort_id: 0, subject_id: subjectId, teacher_id: teacherId,
      day_of_week: day, period_number: period, room: room || null, is_break: false, break_label: null,
      subject_label: subj?.label ?? '', teacher_name: t?.name ?? '', teacher_surname: t?.surname ?? '', cohort_name: '',
      _new: true,
    };
    onChange((prev) => [...prev, entry]);
    setRows((prev) => [...prev, entry]);
    setSubjectId(''); setTeacherId(''); setRoom(''); setClashWarning(null); setError(null);
    setEditingId(undefined);
  };

  const handleSaveEdit = () => {
    if (typeof editingId !== 'number' || subjectId === '' || teacherId === '') {
      setError('Select a subject and teacher.');
      return;
    }
    const subj = subjects.find((s) => s.id === subjectId);
    const t = teachers.find((tt) => tt.id === teacherId);
    const targetId = editingId;
    const applyEdit = (r: DraftEntry) => r.id === targetId ? {
      ...r, subject_id: subjectId, teacher_id: teacherId, room: room || null,
      subject_label: subj?.label ?? r.subject_label, teacher_name: t?.name ?? r.teacher_name, teacher_surname: t?.surname ?? r.teacher_surname,
    } : r;
    onChange((prev) => prev.map(applyEdit));
    setRows((prev) => prev.map(applyEdit));
    setSubjectId(''); setTeacherId(''); setRoom(''); setClashWarning(null); setError(null);
    setEditingId(undefined);
  };

  const handleDelete = (id: number) => {
    onChange((prev) => prev.filter((r) => r.id !== id));
    setRows((prev) => prev.filter((r) => r.id !== id));
    if (editingId === id) setEditingId(undefined);
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
        <div className="glass-panel rounded-2xl shadow-2xl w-full max-w-md max-h-[85vh] flex flex-col">
          <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-stone-200/70 shrink-0">
            <div>
              <h2 className="text-base font-black text-brand-dark">{dayLabel}, Period {period}</h2>
              <p className="text-xs text-stone-500 mt-0.5">
                {typeof editingId === 'number' ? 'Editing a subject group in this slot.' : 'Add each subject group running in this slot.'}
              </p>
            </div>
            <button onClick={onClose} aria-label="Close" className="p-1 text-stone-400 hover:text-stone-600 shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="px-6 py-4 overflow-y-auto space-y-3">
            {rows.map((r) => (
              typeof editingId === 'number' && editingId === r.id ? null : (
                <div key={r.id} className={`flex items-center justify-between gap-3 px-4 py-3 rounded border ${
                  r.is_break ? 'bg-amber-50/70 border-amber-100' : 'bg-white/60 border-stone-200/70'
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
                    <button onClick={() => handleDelete(r.id)}
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
                  <div className="flex gap-2 p-3 bg-red-50 border border-red-200 rounded">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-xs font-bold text-red-700">{error}</p>
                  </div>
                )}
                {clashWarning && (
                  <div className="flex gap-2 p-3 bg-amber-50 border border-amber-200 rounded">
                    <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-xs font-bold text-amber-700">{clashWarning}</p>
                  </div>
                )}
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-stone-500 mb-1.5">Subject</label>
                  <Dropdown
                    value={subjectId === '' ? null : String(subjectId)}
                    onChange={(v) => setSubjectId(v === '' ? '' : Number(v))}
                    placeholder="Select subject"
                    buttonClassName="w-full flex items-center justify-between gap-2 px-3 py-2.5 bg-stone-50 border border-brand-border rounded text-sm font-medium text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10"
                    options={subjects.map((s) => ({ value: String(s.id), label: s.label }))}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-stone-500 mb-1.5">Teacher</label>
                  <Dropdown
                    value={teacherId === '' ? null : String(teacherId)}
                    onChange={(v) => handleTeacherChange(v)}
                    placeholder="Select teacher"
                    buttonClassName="w-full flex items-center justify-between gap-2 px-3 py-2.5 bg-stone-50 border border-brand-border rounded text-sm font-medium text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10"
                    options={teachers.map((t) => ({ value: String(t.id), label: `${t.name} ${t.surname}` }))}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-stone-500 mb-1.5">Room <span className="normal-case font-medium text-stone-400">(optional)</span></label>
                  <input value={room} onChange={(e) => setRoom(e.target.value)} placeholder="e.g. Room 14"
                    className="w-full px-3 py-2.5 bg-stone-50 border border-brand-border rounded text-sm font-medium text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10" />
                </div>
                <div className="flex gap-2">
                  {rows.length > 0 && (
                    <button onClick={() => { setEditingId(undefined); setError(null); setClashWarning(null); }}
                      className="flex-1 py-2.5 text-sm font-bold text-stone-600 border border-brand-border rounded hover:bg-stone-50 transition-all">
                      Cancel
                    </button>
                  )}
                  <button onClick={typeof editingId === 'number' ? handleSaveEdit : handleAdd}
                    className="flex-1 py-2.5 text-sm font-black text-white bg-brand-dark rounded hover:bg-brand-dark/90 transition-all">
                    {typeof editingId === 'number' ? 'Update' : 'Add Subject Group'}
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={() => setEditingId(null)}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-black text-stone-600 border border-dashed border-brand-border rounded hover:bg-stone-50 transition-all">
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
  periods, onPick, onClose,
}: {
  periods: TimetablePeriod[];
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
      className="absolute right-0 top-full mt-1 z-30 glass-panel rounded shadow-xl p-2 w-56 max-h-64 overflow-y-auto"
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
                onClick={() => onPick(d.value, p.period_number)}
                className="px-2 py-1 rounded-lg text-[10px] font-bold bg-stone-100 text-stone-600 hover:bg-brand-dark hover:text-white transition-colors"
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
