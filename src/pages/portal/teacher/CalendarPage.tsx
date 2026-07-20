import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft, ChevronRight, Plus, X, Paperclip, Trash2, Pencil,
  Clock, Users, BookOpen, GraduationCap, User, Calendar,
  CheckCircle2, XCircle, AlertCircle, ClipboardList, UserX, List,
} from 'lucide-react';
import { supabaseAdmin } from '../../../lib/supabase';
import {
  fetchMonthEvents, createEvent, updateEvent, deleteEvent, getAttachmentDownloadUrl,
  fetchHomeworkStudentRows, saveHomeworkVerification, saveHomeworkAbsent,
  EVENT_COLORS, EVENT_LABELS,
  type SchoolEvent, type EventType, type TargetType, type HomeworkStudentRow,
} from '../../../lib/events';
import { fetchSubjects, type Subject } from '../../../lib/students';
import type { TeacherSession } from '../../../lib/auth';
import { Shimmer } from '../../../shared/components/Shimmer';

// ── Helpers ───────────────────────────────────────────────────

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const GRADES = [8, 9, 10, 11, 12];
const EVENT_TYPES: { value: EventType; label: string }[] = [
  { value: 'homework',   label: 'Homework' },
  { value: 'assessment', label: 'Assessment' },
  { value: 'exam',       label: 'Exam' },
  { value: 'other',      label: 'Other' },
];

const TYPE_PILL: Record<string, string> = {
  homework:   'bg-blue-50 text-blue-700',
  assessment: 'bg-emerald-50 text-emerald-700',
  exam:       'bg-red-50 text-red-700',
  other:      'bg-stone-100 text-stone-600',
};

function toDateStr(year: number, month: number, day: number) {
  return `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
}
function formatTime(t: string | null) {
  if (!t) return '';
  const [h, m] = t.split(':');
  const hour = parseInt(h);
  return `${hour % 12 || 12}:${m} ${hour >= 12 ? 'PM' : 'AM'}`;
}
function formatDate(d: string) {
  const [y, m, day] = d.split('-');
  return `${parseInt(day)} ${MONTHS[parseInt(m)-1]} ${y}`;
}

const ease = [0.23, 1, 0.32, 1] as [number, number, number, number];

interface Cohort { id: number; name: string; grade: number; }

// ── Main Component ────────────────────────────────────────────

interface CalendarPageProps {
  session: TeacherSession;
}

export default function CalendarPage({ session }: CalendarPageProps) {
  const today = new Date();
  const [year, setYear]   = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [events, setEvents] = useState<SchoolEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [monthKey, setMonthKey] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [cohorts, setCohorts]   = useState<Cohort[]>([]);
  const [allStudents, setAllStudents] = useState<{ id: number; name: string; surname: string }[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Modal state
  const [modal, setModal] = useState<'create' | 'edit' | 'view' | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<SchoolEvent | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Homework tracker panel (inside view modal)
  const [viewTab, setViewTab] = useState<'details' | 'tracker'>('details');
  const [trackerRows, setTrackerRows] = useState<HomeworkStudentRow[]>([]);
  const [trackerLoading, setTrackerLoading] = useState(false);
  const [verifyingId, setVerifyingId] = useState<number | null>(null);
  // per-student note being edited: key = student_id
  const [noteInputs, setNoteInputs] = useState<Record<number, string>>({});

  // Form state
  const emptyForm = {
    event_type: 'homework' as EventType,
    title: '',
    description: '',
    event_date: '',
    start_time: '',
    end_time: '',
    target_type: 'all' as TargetType,
    target_grades: [] as number[],
    target_cohort_ids: [] as number[],
    target_subject_ids: [] as number[],
    target_student_ids: [] as number[],
  };
  const [form, setForm] = useState(emptyForm);
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [clearAttachment, setClearAttachment] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Load reference data once
  useEffect(() => {
    fetchSubjects().then(setSubjects);
    supabaseAdmin
      .from('cohorts')
      .select('id, name, grade')
      .eq('school_id', session.school_id)
      .order('grade').order('name')
      .then(({ data }) => setCohorts(data ?? []));
    supabaseAdmin
      .from('students')
      .select('id, name, surname')
      .eq('school_id', session.school_id)
      .order('surname')
      .then(({ data }) => setAllStudents(data ?? []));
  }, []);

  // Load events whenever month/year changes
  useEffect(() => {
    setLoading(true);
    fetchMonthEvents(session.school_id, session.teacher_id, year, month).then(data => {
      setEvents(data);
      setLoading(false);
    });
  }, [year, month]);

  // ── Calendar grid ─────────────────────────────────────────

  const firstDayOfMonth = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const todayStr = toDateStr(today.getFullYear(), today.getMonth() + 1, today.getDate());

  const cells: (number | null)[] = [
    ...Array(firstDayOfMonth).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  function eventsOnDay(day: number) {
    const str = toDateStr(year, month, day);
    return events.filter(e => e.event_date === str);
  }

  function prevMonth() {
    setDirection(-1);
    setMonthKey(k => k - 1);
    if (month === 1) { setYear(y => y - 1); setMonth(12); }
    else setMonth(m => m - 1);
  }
  function nextMonth() {
    setDirection(1);
    setMonthKey(k => k + 1);
    if (month === 12) { setYear(y => y + 1); setMonth(1); }
    else setMonth(m => m + 1);
  }

  // ── Open modals ───────────────────────────────────────────

  function openCreate(dateStr: string) {
    setForm({ ...emptyForm, event_date: dateStr });
    setAttachmentFile(null);
    setClearAttachment(false);
    setError('');
    setSelectedDate(dateStr);
    setModal('create');
  }

  function openView(ev: SchoolEvent) {
    setSelectedEvent(ev);
    setViewTab('details');
    setTrackerRows([]);
    setNoteInputs({});
    setModal('view');
  }

  async function loadTracker(ev: SchoolEvent) {
    setTrackerLoading(true);
    const rows = await fetchHomeworkStudentRows(ev, session.school_id);
    setTrackerRows(rows);
    // Pre-fill note inputs from existing data
    const notes: Record<number, string> = {};
    rows.forEach(r => { if (r.teacher_note) notes[r.student_id] = r.teacher_note; });
    setNoteInputs(notes);
    setTrackerLoading(false);
  }

  async function handleVerify(ev: SchoolEvent, studentId: number, verified: boolean) {
    setVerifyingId(studentId);
    const note = noteInputs[studentId] ?? '';
    await saveHomeworkVerification(ev.id, studentId, session.school_id, verified, note);
    // Refresh rows
    const rows = await fetchHomeworkStudentRows(ev, session.school_id);
    setTrackerRows(rows);
    setVerifyingId(null);
  }

  async function handleClearVerification(ev: SchoolEvent, studentId: number) {
    setVerifyingId(studentId);
    await supabaseAdmin
      .from('homework_completions')
      .update({ verified_by_teacher: null, absent: false, teacher_note: null })
      .eq('event_id', ev.id)
      .eq('student_id', studentId);
    const rows = await fetchHomeworkStudentRows(ev, session.school_id);
    setTrackerRows(rows);
    setNoteInputs(prev => { const n = { ...prev }; delete n[studentId]; return n; });
    setVerifyingId(null);
  }

  async function handleAbsent(ev: SchoolEvent, studentId: number) {
    setVerifyingId(studentId);
    const note = noteInputs[studentId] ?? '';
    await saveHomeworkAbsent(ev.id, studentId, session.school_id, note);
    const rows = await fetchHomeworkStudentRows(ev, session.school_id);
    setTrackerRows(rows);
    setVerifyingId(null);
  }

  function openEdit(ev: SchoolEvent) {
    setForm({
      event_type: ev.event_type,
      title: ev.title,
      description: ev.description ?? '',
      event_date: ev.event_date,
      start_time: ev.start_time ?? '',
      end_time: ev.end_time ?? '',
      target_type: ev.target_type,
      target_grades: ev.target_grades ?? [],
      target_cohort_ids: ev.target_cohort_ids ?? [],
      target_subject_ids: ev.target_subject_ids ?? [],
      target_student_ids: ev.target_student_ids ?? [],
    });
    setAttachmentFile(null);
    setClearAttachment(false);
    setError('');
    setSelectedEvent(ev);
    setModal('edit');
  }

  function closeModal() {
    setModal(null);
    setSelectedEvent(null);
    setDeleteConfirm(false);
    setError('');
    setViewTab('details');
    setTrackerRows([]);
    setNoteInputs({});
  }

  // ── Save ──────────────────────────────────────────────────

  async function handleSave() {
    if (!form.title.trim()) { setError('Title is required.'); return; }
    if (!form.event_date)   { setError('Date is required.'); return; }
    if (form.target_type === 'grade'    && form.target_grades.length === 0)     { setError('Select at least one grade.'); return; }
    if (form.target_type === 'class'    && form.target_cohort_ids.length === 0) { setError('Select at least one class.'); return; }
    if (form.target_type === 'subject'  && form.target_subject_ids.length === 0){ setError('Select at least one subject.'); return; }
    if (form.target_type === 'subject'  && form.target_grades.length === 0)    { setError('Select at least one grade for the subject.'); return; }
    if (form.target_type === 'specific' && form.target_student_ids.length === 0){ setError('Select at least one student.'); return; }

    setSaving(true);
    setError('');

    if (modal === 'create') {
      const result = await createEvent({
        school_id: session.school_id,
        created_by_teacher_id: session.teacher_id,
        event_type: form.event_type,
        title: form.title,
        description: form.description,
        event_date: form.event_date,
        start_time: form.start_time || undefined,
        end_time: form.end_time || undefined,
        attachment_file: attachmentFile ?? undefined,
        target_type: form.target_type,
        target_grades: form.target_grades,
        target_cohort_ids: form.target_cohort_ids,
        target_subject_ids: form.target_subject_ids,
        target_student_ids: form.target_student_ids,
      });
      if (!result.success) { setError(result.error); setSaving(false); return; }
    } else if (modal === 'edit' && selectedEvent) {
      const result = await updateEvent({
        event_id: selectedEvent.id,
        school_id: session.school_id,
        event_type: form.event_type,
        title: form.title,
        description: form.description,
        event_date: form.event_date,
        start_time: form.start_time || undefined,
        end_time: form.end_time || undefined,
        attachment_file: attachmentFile ?? undefined,
        clear_attachment: clearAttachment,
        target_type: form.target_type,
        target_grades: form.target_grades,
        target_cohort_ids: form.target_cohort_ids,
        target_subject_ids: form.target_subject_ids,
        target_student_ids: form.target_student_ids,
      }, selectedEvent.attachment_url);
      if (!result.success) { setError(result.error); setSaving(false); return; }
    }

    // Reload events for current month
    const updated = await fetchMonthEvents(session.school_id, session.teacher_id, year, month);
    setEvents(updated);
    setSaving(false);
    closeModal();
  }

  // ── Delete ────────────────────────────────────────────────

  async function handleDelete() {
    if (!selectedEvent) return;
    setSaving(true);
    await deleteEvent(selectedEvent.id, session.school_id, selectedEvent.attachment_url);
    const updated = await fetchMonthEvents(session.school_id, session.teacher_id, year, month);
    setEvents(updated);
    setSaving(false);
    closeModal();
  }

  // ── Download attachment ───────────────────────────────────

  async function handleDownload(ev: SchoolEvent) {
    if (!ev.attachment_url) return;
    const url = await getAttachmentDownloadUrl(ev.attachment_url);
    if (url) window.open(url, '_blank');
  }

  // ── Toggle helpers ────────────────────────────────────────

  function toggle<T>(arr: T[], val: T): T[] {
    return arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val];
  }

  // ── Target audience summary ───────────────────────────────

  function audienceSummary(ev: SchoolEvent): string {
    if (ev.target_type === 'all') return 'Everyone';
    if (ev.target_type === 'grade') return `Grade ${ev.target_grades?.join(', ')}`;
    if (ev.target_type === 'class') {
      const names = ev.target_cohort_ids?.map(id => cohorts.find(c => c.id === id)?.name ?? id).join(', ');
      return `Class: ${names}`;
    }
    if (ev.target_type === 'subject') {
      const subNames = ev.target_subject_ids?.map(id => subjects.find(s => s.id === id)?.label ?? id).join(', ');
      const gradeNames = ev.target_grades?.map(g => `Gr ${g}`).join(', ');
      return `${subNames} — ${gradeNames}`;
    }
    if (ev.target_type === 'specific') return `${ev.target_student_ids?.length} specific student(s)`;
    return '';
  }

  const allSorted = [...events].sort((a, b) => a.event_date.localeCompare(b.event_date));
  const upcoming = events.filter(e => e.event_date >= todayStr).slice(0, 5);

  // ── Render ────────────────────────────────────────────────

  return (
    <div className="student-home min-h-full pb-16 relative">

      {/* ═══ Hero ═══════════════════════════════════════════════ */}
      <div className="relative overflow-hidden">
        <div className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-8 sm:pt-11 pb-6 sm:pb-8 w-full">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }}>
            <p className="text-[12px] text-[rgba(31,36,33,0.5)] font-medium">Calendar</p>
            <h1
              className="text-brand-dark text-[32px] sm:text-[40px] leading-[1.12] mt-2"
              style={{ fontFamily: 'var(--font-instrument)', fontWeight: 500, letterSpacing: '-0.02em' }}
            >
              School Events
            </h1>
            <p className="text-[13px] text-[rgba(31,36,33,0.5)] mt-2 font-medium">Track homework, assessments, and important dates.</p>
          </motion.div>
        </div>
      </div>

      {/* ═══ Body ═══════════════════════════════════════════════ */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 relative z-10 space-y-5 sm:space-y-6 pt-2 sm:pt-3">

      {/* ── Toolbar ─────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease }}
        className="flex items-center gap-2 flex-wrap justify-end"
      >
          {/* Create event button */}
          <button
            onClick={() => openCreate(todayStr)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-accent text-white text-xs font-black rounded hover:bg-accent-soft transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Create Event
          </button>

          {/* Month nav */}
          <div className="flex items-center bg-white border border-brand-border rounded overflow-hidden">
            <button onClick={prevMonth} aria-label="Previous month" className="p-2 hover:bg-stone-50 transition-colors border-r border-brand-border">
              <ChevronLeft className="w-4 h-4 text-stone-600" />
            </button>
            <div className="relative overflow-hidden min-w-36 text-center px-1">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={monthKey}
                  initial={{ y: direction > 0 ? 16 : -16, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: direction > 0 ? -16 : 16, opacity: 0 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                  className="block text-sm font-black text-brand-dark py-1.5"
                >
                  {MONTHS[month - 1]} {year}
                </motion.span>
              </AnimatePresence>
            </div>
            <button onClick={nextMonth} aria-label="Next month" className="p-2 hover:bg-stone-50 transition-colors border-l border-brand-border">
              <ChevronRight className="w-4 h-4 text-stone-600" />
            </button>
          </div>

          {/* Grid/List toggle */}
          <div className="flex items-center bg-white border border-brand-border rounded p-0.5 gap-0.5">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                viewMode === 'grid' ? 'bg-accent text-white' : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" /> Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                viewMode === 'list' ? 'bg-accent text-white' : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              <List className="w-3.5 h-3.5" /> List
            </button>
          </div>
      </motion.div>

      <div className="flex flex-col xl:flex-row gap-5">
        <div className="flex-1 min-w-0">

          <AnimatePresence mode="wait" initial={false}>
            {viewMode === 'list' ? (
              /* ── LIST VIEW ───────────────────────────── */
              <motion.div key="list"
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}
              >
                {loading ? (
                  <div className="flex items-center justify-center py-24">
                    <div className="w-5 h-5 border-2 border-brand-border border-t-brand-dark rounded-full animate-spin" />
                  </div>
                ) : allSorted.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-24">
                    <Calendar className="w-8 h-8 text-stone-200 mb-3" />
                    <p className="text-sm font-bold text-stone-400">No events this month.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {allSorted.map((ev, i) => {
                      const c = EVENT_COLORS[ev.event_type];
                      return (
                        <motion.div key={ev.id}
                          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.03, duration: 0.2 }}
                          onClick={() => openView(ev)}
                          className="paper-card rounded px-4 py-3 flex items-center gap-3 cursor-pointer hover:border-stone-300 transition-colors"
                        >
                          <span className={`w-2 h-2 rounded-full shrink-0 ${c.dot}`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-brand-dark truncate">{ev.title}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${TYPE_PILL[ev.event_type]}`}>
                                {EVENT_LABELS[ev.event_type]}
                              </span>
                              <span className="text-xs text-stone-500">{formatDate(ev.event_date)}</span>
                              <span className="text-[11px] text-stone-500">{audienceSummary(ev)}</span>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-stone-400 shrink-0" />
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            ) : (
              /* ── GRID VIEW ──────────────────────────────────────── */
              <motion.div key="grid"
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}
              >
                <div className="paper-card rounded overflow-hidden">
                  {/* Day headers */}
                  <div className="grid grid-cols-7 border-b border-brand-border/60">
                    {DAYS.map(d => (
                      <div key={d} className="py-2.5 text-center text-[11px] font-black uppercase tracking-[0.15em] text-stone-500">
                        {d}
                      </div>
                    ))}
                  </div>

                  {loading ? (
                    <div className="h-64 flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-brand-border border-t-brand-dark rounded-full animate-spin" />
                    </div>
                  ) : (
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.div
                        key={monthKey}
                        initial={{ x: direction > 0 ? 40 : -40, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: direction > 0 ? -40 : 40, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        className="grid grid-cols-7"
                      >
                        {cells.map((day, idx) => {
                          if (!day) return <div key={`empty-${idx}`} className="border-b border-r border-stone-50 min-h-[90px]" />;
                          const dateStr = toDateStr(year, month, day);
                          const dayEvs = eventsOnDay(day);
                          const isToday = dateStr === todayStr;
                          return (
                            <div
                              key={day}
                              className="border-b border-r border-brand-border/60 min-h-[90px] p-1.5 cursor-pointer transition-colors hover:bg-stone-50 group"
                              onClick={() => openCreate(dateStr)}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className={`text-xs font-black w-6 h-6 flex items-center justify-center rounded-full transition-colors ${
                                  isToday ? 'bg-accent text-white' : 'text-stone-500 group-hover:text-stone-700'
                                }`}>
                                  {day}
                                </span>
                                <Plus className="w-3 h-3 text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                              <div className="space-y-0.5">
                                {dayEvs.slice(0, 3).map(ev => {
                                  const c = EVENT_COLORS[ev.event_type];
                                  return (
                                    <div
                                      key={ev.id}
                                      onClick={e => { e.stopPropagation(); openView(ev); }}
                                      className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold truncate cursor-pointer hover:opacity-75 ${TYPE_PILL[ev.event_type]}`}
                                    >
                                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${c.dot}`} />
                                      <span className="truncate">{ev.title}</span>
                                    </div>
                                  );
                                })}
                                {dayEvs.length > 3 && (
                                  <div className="text-[10px] font-bold text-stone-500 px-1.5">+{dayEvs.length - 3} more</div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </motion.div>
                    </AnimatePresence>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Right sidebar ─────────────────────────────────── */}
        <div className="hidden xl:block w-72 shrink-0 space-y-4">

          {/* Upcoming events */}
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease, delay: 0.1 }}
            className="paper-card rounded p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-stone-500">Upcoming</p>
              <button
                onClick={() => openCreate(todayStr)}
                className="flex items-center gap-1 text-[11px] font-black bg-accent text-white px-2.5 py-1 rounded-lg hover:bg-accent-soft transition-colors"
              >
                <Plus className="w-3 h-3" /> Create
              </button>
            </div>
            {upcoming.length === 0 ? (
              <p className="text-sm font-bold text-stone-400">Nothing scheduled.</p>
            ) : (
              <div className="space-y-2">
                {upcoming.map((ev, i) => {
                  const c = EVENT_COLORS[ev.event_type];
                  return (
                    <motion.button key={ev.id}
                      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, ease, delay: i * 0.04 }}
                      onClick={() => openView(ev)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded border border-brand-border/60 hover:border-brand-border transition-colors text-left"
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${TYPE_PILL[ev.event_type]?.split(' ')[0] ?? 'bg-stone-100'}`}>
                        <span className={`w-2 h-2 rounded-full ${c.dot}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-brand-dark truncate">{ev.title}</p>
                        <p className="text-[11px] text-stone-500">{formatDate(ev.event_date)}</p>
                        <p className="text-[10px] text-stone-400">{audienceSummary(ev)}</p>
                      </div>
                      <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full shrink-0 ${TYPE_PILL[ev.event_type]}`}>
                        {EVENT_LABELS[ev.event_type]}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            )}
          </motion.div>

          {/* Legend */}
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease, delay: 0.15 }}
            className="paper-card rounded p-4"
          >
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-stone-500 mb-3">Legend</p>
            <div className="space-y-2">
              {EVENT_TYPES.map(t => {
                const c = EVENT_COLORS[t.value];
                return (
                  <div key={t.value} className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${c.dot}`} />
                    <span className="text-xs font-bold text-stone-600">{t.label}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
      </div>

      {/* ── View Modal ─────────────────────────────────────── */}
      <AnimatePresence>
      {modal === 'view' && selectedEvent && (() => {
        const ev = selectedEvent;
        const c = EVENT_COLORS[ev.event_type];
        const isHomework = ev.event_type === 'homework';

        // Tracker summary counts
        const total    = trackerRows.length;
        const selfDone = trackerRows.filter(r => r.self_reported).length;
        const verified = trackerRows.filter(r => r.verified_by_teacher === true).length;
        const notDone  = trackerRows.filter(r => r.verified_by_teacher === false).length;
        const absent   = trackerRows.filter(r => r.absent).length;
        const pending  = trackerRows.filter(r => r.verified_by_teacher === null && !r.absent).length;

        return (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.95, y: 12, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 8, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className={`bg-white rounded-2xl shadow-2xl w-full ${isHomework ? 'max-w-lg' : 'max-w-md'} max-h-[90vh] flex flex-col`}
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 pb-4 shrink-0">
                <div className="flex items-start justify-between mb-1">
                  <div className="flex-1 min-w-0 pr-3">
                    <span className={`inline-block text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full mb-2 ${TYPE_PILL[ev.event_type]}`}>
                      {EVENT_LABELS[ev.event_type]}
                    </span>
                    <h2 className="text-lg font-black text-brand-dark tracking-tight">{ev.title}</h2>
                  </div>
                  <button onClick={closeModal} aria-label="Close" className="p-1.5 rounded-lg hover:bg-stone-100 transition-colors shrink-0">
                    <X className="w-4 h-4 text-stone-500" />
                  </button>
                </div>

                {/* Tabs — only for homework */}
                {isHomework && (
                  <div className="flex items-center gap-1 mt-4 bg-stone-100 rounded p-1">
                    <button
                      onClick={() => setViewTab('details')}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-black transition-all ${viewTab === 'details' ? 'bg-white text-brand-dark shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
                    >
                      Details
                    </button>
                    <button
                      onClick={() => {
                        setViewTab('tracker');
                        if (trackerRows.length === 0) loadTracker(ev);
                      }}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-black transition-all ${viewTab === 'tracker' ? 'bg-white text-brand-dark shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
                    >
                      <ClipboardList className="w-3.5 h-3.5" /> Homework Tracker
                    </button>
                  </div>
                )}
              </div>

              {/* Tab content */}
              <div className="flex-1 overflow-y-auto px-6 pb-2 min-h-0">
                {(!isHomework || viewTab === 'details') && (
                  <div className="space-y-3 text-sm pb-2">
                    <div className="flex items-center gap-2 text-stone-600">
                      <Calendar className="w-4 h-4 text-stone-500 shrink-0" />
                      <span className="font-bold">{formatDate(ev.event_date)}</span>
                    </div>
                    {(ev.start_time || ev.end_time) && (
                      <div className="flex items-center gap-2 text-stone-600">
                        <Clock className="w-4 h-4 text-stone-500 shrink-0" />
                        <span>{formatTime(ev.start_time)}{ev.end_time ? ` – ${formatTime(ev.end_time)}` : ''}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-stone-600">
                      <Users className="w-4 h-4 text-stone-500 shrink-0" />
                      <span>{audienceSummary(ev)}</span>
                    </div>
                    {ev.description && (
                      <p className="text-stone-500 leading-relaxed border-t border-brand-border/60 pt-3">{ev.description}</p>
                    )}
                    {ev.attachment_url && (
                      <button onClick={() => handleDownload(ev)}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-bold transition-colors">
                        <Paperclip className="w-4 h-4" />
                        {ev.attachment_name ?? 'Attachment'}
                      </button>
                    )}
                  </div>
                )}

                {isHomework && viewTab === 'tracker' && (
                  <div className="pb-2">
                    {trackerLoading ? (
                      <div className="flex items-center justify-center py-12">
                        <div className="w-5 h-5 border-2 border-brand-border border-t-brand-dark rounded-full animate-spin" />
                      </div>
                    ) : trackerRows.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <AlertCircle className="w-8 h-8 text-stone-200 mb-3" />
                        <p className="text-sm font-bold text-stone-500">No students targeted by this event.</p>
                      </div>
                    ) : (
                      <>
                        {/* Summary pills */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-stone-100 text-stone-600">{total} students</span>
                          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-600">{selfDone} self-reported</span>
                          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600">{verified} verified</span>
                          {notDone > 0 && <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-red-50 text-red-600">{notDone} not done</span>}
                          {absent > 0  && <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700">{absent} absent</span>}
                          {pending > 0 && <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-stone-200 text-stone-500">{pending} unreviewed</span>}
                        </div>

                        {/* Student rows */}
                        <div className="space-y-2">
                          {trackerRows.map(row => {
                            const isVerifying = verifyingId === row.student_id;
                            const vStatus = row.verified_by_teacher;
                            const isAbsent = row.absent;
                            const isReviewed = vStatus !== null || isAbsent;

                            const cardBg =
                              isAbsent      ? 'bg-amber-50 border-amber-200' :
                              vStatus === true  ? 'bg-emerald-50 border-emerald-200' :
                              vStatus === false ? 'bg-red-50 border-red-200' :
                                                 'bg-stone-50 border-brand-border';

                            const avatarBg =
                              isAbsent          ? 'bg-amber-200' :
                              vStatus === true  ? 'bg-emerald-200' :
                              vStatus === false ? 'bg-red-200' :
                                                 'bg-stone-200';

                            const statusText =
                              isAbsent          ? 'Absent — excused' :
                              vStatus === true  ? 'Verified done' :
                              vStatus === false ? 'Marked not done' :
                                                 'Not reviewed yet';

                            const statusColor =
                              isAbsent          ? 'text-amber-700' :
                              vStatus === true  ? 'text-emerald-700' :
                              vStatus === false ? 'text-red-600' :
                                                 'text-stone-500';

                            return (
                              <div key={row.student_id} className={`rounded-2xl p-3 border transition-colors ${cardBg}`}>
                                <div className="flex items-center gap-2 mb-2">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${avatarBg}`}>
                                    {isVerifying ? (
                                      <div className="w-3.5 h-3.5 border-2 border-stone-300 border-t-stone-600 rounded-full animate-spin" />
                                    ) : isAbsent ? (
                                      <UserX className="w-4 h-4 text-amber-700" />
                                    ) : vStatus === true ? (
                                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                                    ) : vStatus === false ? (
                                      <XCircle className="w-4 h-4 text-red-600" />
                                    ) : (
                                      <span className="text-[10px] font-black text-stone-600">{row.name[0]}{row.surname[0]}</span>
                                    )}
                                  </div>

                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-brand-dark truncate">{row.surname}, {row.name}</p>
                                    <p className={`text-[11px] font-black ${statusColor}`}>{statusText}</p>
                                  </div>

                                  {row.self_reported
                                    ? <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-100 text-blue-600 shrink-0">Self</span>
                                    : <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-stone-200 text-stone-500 shrink-0">No self-report</span>
                                  }
                                </div>

                                {isReviewed && row.teacher_note && (
                                  <p className="text-[11px] text-stone-500 italic mb-2 px-1">"{row.teacher_note}"</p>
                                )}

                                {!isReviewed && (
                                  <input
                                    value={noteInputs[row.student_id] ?? ''}
                                    onChange={e => setNoteInputs(prev => ({ ...prev, [row.student_id]: e.target.value }))}
                                    placeholder="Note / reason (optional)"
                                    className="w-full px-3 py-1.5 rounded border border-brand-border text-xs text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-dark bg-white mb-2"
                                  />
                                )}

                                <div className="flex gap-1.5">
                                  {!isAbsent && vStatus !== true && (
                                    <button
                                      onClick={() => handleVerify(ev, row.student_id, true)}
                                      disabled={isVerifying}
                                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded bg-emerald-600 text-white text-xs font-black hover:bg-emerald-700 transition-colors disabled:opacity-40"
                                    >
                                      <CheckCircle2 className="w-3.5 h-3.5" /> Verify Done
                                    </button>
                                  )}
                                  {!isAbsent && vStatus !== false && (
                                    <button
                                      onClick={() => handleVerify(ev, row.student_id, false)}
                                      disabled={isVerifying}
                                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded bg-white text-red-600 border border-red-200 text-xs font-black hover:bg-red-50 transition-colors disabled:opacity-40"
                                    >
                                      <XCircle className="w-3.5 h-3.5" /> Not Done
                                    </button>
                                  )}
                                  {!isAbsent && (
                                    <button
                                      onClick={() => handleAbsent(ev, row.student_id)}
                                      disabled={isVerifying}
                                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded bg-white text-amber-600 border border-amber-200 text-xs font-black hover:bg-amber-50 transition-colors disabled:opacity-40"
                                    >
                                      <UserX className="w-3.5 h-3.5" /> Absent
                                    </button>
                                  )}
                                  {isReviewed && (
                                    <button
                                      onClick={() => handleClearVerification(ev, row.student_id)}
                                      disabled={isVerifying}
                                      className="px-3 py-1.5 rounded bg-white border border-brand-border text-stone-500 text-xs font-black hover:bg-stone-100 transition-colors disabled:opacity-40"
                                    >
                                      Undo
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Footer — edit/delete */}
              <div className="shrink-0 px-6 pb-4 pt-2 border-t border-brand-border/60 mt-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => { closeModal(); setTimeout(() => openEdit(ev), 50); }}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded bg-accent text-white text-sm font-black hover:bg-accent-soft transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(true)}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded text-red-500 hover:bg-red-50 text-sm font-black transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <AnimatePresence>
                  {deleteConfirm && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.18 }}
                      className="overflow-hidden mt-2"
                    >
                      <div className="p-4 bg-red-50 rounded border border-red-100">
                        <p className="text-sm font-bold text-red-700 mb-3">Delete this event? This cannot be undone.</p>
                        <div className="flex gap-2">
                          <button onClick={handleDelete} disabled={saving}
                            className="flex-1 py-2 rounded bg-red-600 text-white text-sm font-black hover:bg-red-700 transition-colors disabled:opacity-50">
                            {saving ? 'Deleting…' : 'Yes, Delete'}
                          </button>
                          <button onClick={() => setDeleteConfirm(false)}
                            className="flex-1 py-2 rounded bg-white border border-brand-border text-sm font-black text-stone-700 hover:bg-stone-50 transition-colors">
                            Cancel
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        );
      })()}
      </AnimatePresence>

      {/* ── Create / Edit Modal ───────────────────────────── */}
      <AnimatePresence>
      {(modal === 'create' || modal === 'edit') && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={closeModal}
        >
          <motion.div
            initial={{ scale: 0.95, y: 12, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 8, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-brand-border/60 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
              <h2 className="text-base font-black text-brand-dark">
                {modal === 'create' ? `New Event — ${formatDate(form.event_date)}` : 'Edit Event'}
              </h2>
              <button onClick={closeModal} aria-label="Close" className="p-1.5 rounded-lg hover:bg-stone-100 transition-colors">
                <X className="w-4 h-4 text-stone-500" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Event Type */}
              <div>
                <label className="block text-xs font-black uppercase tracking-[0.22em] text-stone-500 mb-2">Type</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {EVENT_TYPES.map(t => {
                    const active = form.event_type === t.value;
                    return (
                      <button
                        key={t.value}
                        onClick={() => setForm(f => ({ ...f, event_type: t.value }))}
                        className={`py-2 rounded text-xs font-black transition-all ${
                          active ? `${TYPE_PILL[t.value]} ring-2 ring-offset-1 ring-current` : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                        }`}
                      >
                        {t.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-black uppercase tracking-[0.22em] text-stone-500 mb-2">Title *</label>
                <input
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Chapter 4 homework"
                  className="w-full px-3 py-2.5 rounded border border-brand-border focus:border-brand-dark focus:ring-0 text-sm font-bold text-brand-dark placeholder:text-stone-400 focus:outline-none transition-colors"
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-xs font-black uppercase tracking-[0.22em] text-stone-500 mb-2">
                  {form.event_type === 'homework' ? 'Due Date *' : 'Date *'}
                </label>
                <input
                  type="date"
                  value={form.event_date}
                  onChange={e => setForm(f => ({ ...f, event_date: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded border border-brand-border focus:border-brand-dark focus:ring-0 text-sm font-bold text-brand-dark focus:outline-none transition-colors"
                />
              </div>

              {/* Time — only for assessment/exam/other */}
              {form.event_type !== 'homework' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-[0.22em] text-stone-500 mb-2">Start Time</label>
                    <input
                      type="time"
                      value={form.start_time}
                      onChange={e => setForm(f => ({ ...f, start_time: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded border border-brand-border focus:border-brand-dark focus:ring-0 text-sm font-bold text-brand-dark focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-[0.22em] text-stone-500 mb-2">End Time</label>
                    <input
                      type="time"
                      value={form.end_time}
                      onChange={e => setForm(f => ({ ...f, end_time: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded border border-brand-border focus:border-brand-dark focus:ring-0 text-sm font-bold text-brand-dark focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <label className="block text-xs font-black uppercase tracking-[0.22em] text-stone-500 mb-2">Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={3}
                  placeholder="Additional details…"
                  className="w-full px-3 py-2.5 rounded border border-brand-border focus:border-brand-dark focus:ring-0 text-sm font-bold text-brand-dark placeholder:text-stone-400 focus:outline-none resize-none transition-colors"
                />
              </div>

              {/* Attachment — homework only */}
              {form.event_type === 'homework' && (
                <div>
                  <label className="block text-xs font-black uppercase tracking-[0.22em] text-stone-500 mb-2">Attachment</label>
                  {modal === 'edit' && selectedEvent?.attachment_url && !clearAttachment && !attachmentFile && (
                    <div className="flex items-center gap-2 p-3 bg-blue-50 rounded border border-blue-100 mb-2">
                      <Paperclip className="w-4 h-4 text-blue-500 shrink-0" />
                      <span className="text-sm font-bold text-blue-700 flex-1 truncate">{selectedEvent.attachment_name}</span>
                      <button onClick={() => setClearAttachment(true)} className="text-red-400 hover:text-red-600 transition-colors">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                  {attachmentFile ? (
                    <div className="flex items-center gap-2 p-3 bg-blue-50 rounded border border-blue-100">
                      <Paperclip className="w-4 h-4 text-blue-500 shrink-0" />
                      <span className="text-sm font-bold text-blue-700 flex-1 truncate">{attachmentFile.name}</span>
                      <button onClick={() => { setAttachmentFile(null); if (fileRef.current) fileRef.current.value = ''; }}
                        className="text-red-400 hover:text-red-600 transition-colors">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => fileRef.current?.click()}
                      className="w-full flex items-center justify-center gap-2 py-4 rounded border-2 border-dashed border-brand-border hover:border-stone-400 text-sm font-bold text-stone-500 hover:text-stone-600 transition-colors"
                    >
                      <Paperclip className="w-4 h-4" />
                      {(modal === 'edit' && selectedEvent?.attachment_url && !clearAttachment) ? 'Replace file' : 'Attach file (PDF, Word, Image)'}
                    </button>
                  )}
                  <input
                    ref={fileRef} type="file"
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                    className="hidden"
                    onChange={e => {
                      const f = e.target.files?.[0];
                      if (f) { setAttachmentFile(f); setClearAttachment(false); }
                    }}
                  />
                </div>
              )}

              {/* Audience */}
              <div>
                <label className="block text-xs font-black uppercase tracking-[0.22em] text-stone-500 mb-2">Who sees this?</label>
                <div className="grid grid-cols-2 gap-1.5 mb-3">
                  {([
                    { value: 'all',      label: 'Everyone',          icon: Users },
                    { value: 'grade',    label: 'By Grade',          icon: GraduationCap },
                    { value: 'class',    label: 'By Class',          icon: BookOpen },
                    { value: 'subject',  label: 'By Subject',        icon: BookOpen },
                    { value: 'specific', label: 'Specific Students', icon: User },
                  ] as { value: TargetType; label: string; icon: any }[]).map(opt => {
                    const Icon = opt.icon;
                    const active = form.target_type === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => setForm(f => ({
                          ...f,
                          target_type: opt.value,
                          target_grades: [],
                          target_cohort_ids: [],
                          target_subject_ids: [],
                          target_student_ids: [],
                        }))}
                        className={`flex items-center gap-2 px-3 py-2 rounded text-xs font-black transition-all ${
                          active ? 'bg-accent text-white' : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5 shrink-0" />
                        {opt.label}
                      </button>
                    );
                  })}
                </div>

                {/* Grade picker */}
                {form.target_type === 'grade' && (
                  <div className="flex flex-wrap gap-1.5">
                    {GRADES.map(g => {
                      const active = form.target_grades.includes(g);
                      return (
                        <button key={g}
                          onClick={() => setForm(f => ({ ...f, target_grades: toggle(f.target_grades, g) }))}
                          className={`px-3 py-1.5 rounded text-xs font-black transition-all ${active ? 'bg-accent text-white' : 'bg-stone-100 text-stone-500 hover:bg-stone-200'}`}
                        >
                          Grade {g}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Class picker */}
                {form.target_type === 'class' && (
                  <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                    {cohorts.length === 0 && <p className="text-xs text-stone-500">No classes found.</p>}
                    {cohorts.map(c => {
                      const active = form.target_cohort_ids.includes(c.id);
                      return (
                        <button key={c.id}
                          onClick={() => setForm(f => ({ ...f, target_cohort_ids: toggle(f.target_cohort_ids, c.id) }))}
                          className={`px-3 py-1.5 rounded text-xs font-black transition-all ${active ? 'bg-accent text-white' : 'bg-stone-100 text-stone-500 hover:bg-stone-200'}`}
                        >
                          {c.name} <span className="opacity-60">(Gr {c.grade})</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Subject + Grade picker */}
                {form.target_type === 'subject' && (
                  <div className="space-y-3">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-stone-500 mb-1.5">Subject *</p>
                      <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                        {subjects.map(s => {
                          const active = form.target_subject_ids.includes(s.id);
                          return (
                            <button key={s.id}
                              onClick={() => setForm(f => ({ ...f, target_subject_ids: toggle(f.target_subject_ids, s.id) }))}
                              className={`px-3 py-1.5 rounded text-xs font-black transition-all ${active ? 'bg-accent text-white' : 'bg-stone-100 text-stone-500 hover:bg-stone-200'}`}
                            >
                              {s.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-stone-500 mb-1.5">Grade *</p>
                      <div className="flex flex-wrap gap-1.5">
                        {GRADES.map(g => {
                          const active = form.target_grades.includes(g);
                          return (
                            <button key={g}
                              onClick={() => setForm(f => ({ ...f, target_grades: toggle(f.target_grades, g) }))}
                              className={`px-3 py-1.5 rounded text-xs font-black transition-all ${active ? 'bg-accent text-white' : 'bg-stone-100 text-stone-500 hover:bg-stone-200'}`}
                            >
                              Grade {g}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <p className="text-[10px] text-stone-500">Only students in the selected grade(s) who take the selected subject(s) will see this.</p>
                  </div>
                )}

                {/* Specific student picker */}
                {form.target_type === 'specific' && (
                  <div className="space-y-1 max-h-40 overflow-y-auto border border-brand-border/60 rounded p-2">
                    {allStudents.length === 0 && <p className="text-xs text-stone-500 p-2">No students found.</p>}
                    {allStudents.map(s => {
                      const active = form.target_student_ids.includes(s.id);
                      return (
                        <button key={s.id}
                          onClick={() => setForm(f => ({ ...f, target_student_ids: toggle(f.target_student_ids, s.id) }))}
                          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-left transition-all ${active ? 'bg-accent text-white' : 'hover:bg-stone-100 text-stone-700'}`}
                        >
                          <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 text-[10px] font-black ${active ? 'bg-white border-white text-brand-dark' : 'border-stone-300'}`}>
                            {active ? '✓' : ''}
                          </span>
                          {s.surname}, {s.name}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {error && <p className="text-sm font-bold text-red-500">{error}</p>}
            </div>

            <div className="sticky bottom-0 bg-white border-t border-brand-border/60 px-6 py-4 rounded-b-2xl flex gap-2">
              <button onClick={closeModal}
                className="flex-1 py-2.5 rounded border border-brand-border text-sm font-black text-stone-600 hover:bg-stone-50 transition-colors">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving}
                className="flex-1 py-2.5 rounded bg-accent text-white text-sm font-black hover:bg-accent-soft transition-colors disabled:opacity-50">
                {saving ? 'Saving…' : modal === 'create' ? 'Create Event' : 'Save Changes'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}
