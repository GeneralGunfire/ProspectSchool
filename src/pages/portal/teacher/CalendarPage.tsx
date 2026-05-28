import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft, ChevronRight, Plus, X, Paperclip, Trash2, Pencil,
  Clock, Users, BookOpen, GraduationCap, User, Calendar,
} from 'lucide-react';
import { supabaseAdmin } from '../../../lib/supabase';
import {
  fetchMonthEvents, createEvent, updateEvent, deleteEvent, getAttachmentDownloadUrl,
  EVENT_COLORS, EVENT_LABELS,
  type SchoolEvent, type EventType, type TargetType,
} from '../../../lib/events';
import { fetchSubjects, type Subject } from '../../../lib/students';
import type { TeacherSession } from '../../../lib/auth';

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

  // Modal state
  const [modal, setModal] = useState<'create' | 'edit' | 'view' | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<SchoolEvent | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

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
    fetchMonthEvents(session.school_id, year, month).then(data => {
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
  // Pad to full weeks
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
    setModal('view');
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
    const updated = await fetchMonthEvents(session.school_id, year, month);
    setEvents(updated);
    setSaving(false);
    closeModal();
  }

  // ── Delete ────────────────────────────────────────────────

  async function handleDelete() {
    if (!selectedEvent) return;
    setSaving(true);
    await deleteEvent(selectedEvent.id, session.school_id, selectedEvent.attachment_url);
    const updated = await fetchMonthEvents(session.school_id, year, month);
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

  // ── Render ────────────────────────────────────────────────

  return (
    <div className="p-6 max-w-5xl">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Calendar</p>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">School Events</h1>
        </div>
        <div className="flex items-center gap-2">
          <motion.button onClick={prevMonth} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
            <ChevronLeft className="w-4 h-4 text-slate-600" />
          </motion.button>
          <div className="relative overflow-hidden min-w-40 text-center">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={monthKey}
                initial={{ y: direction > 0 ? 20 : -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: direction > 0 ? -20 : 20, opacity: 0 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className="block text-base font-black text-slate-900"
              >
                {MONTHS[month - 1]} {year}
              </motion.span>
            </AnimatePresence>
          </div>
          <motion.button onClick={nextMonth} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
            <ChevronRight className="w-4 h-4 text-slate-600" />
          </motion.button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mb-4 flex-wrap">
        {EVENT_TYPES.map(t => {
          const c = EVENT_COLORS[t.value];
          return (
            <div key={t.value} className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${c.dot}`} />
              <span className="text-xs font-bold text-slate-500">{t.label}</span>
            </div>
          );
        })}
      </div>

      {/* Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-slate-100">
          {DAYS.map(d => (
            <div key={d} className="py-2.5 text-center text-[11px] font-black uppercase tracking-widest text-slate-400">
              {d}
            </div>
          ))}
        </div>

        {/* Cells */}
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
              className="w-5 h-5 border-2 border-slate-200 border-t-slate-700 rounded-full"
            />
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
                if (!day) return <div key={`empty-${idx}`} className="border-b border-r border-slate-50 min-h-[90px]" />;
                const dateStr = toDateStr(year, month, day);
                const dayEvents = eventsOnDay(day);
                const isToday = dateStr === todayStr;
                return (
                  <motion.div
                    key={day}
                    whileHover={{ backgroundColor: '#f8fafc' }}
                    whileTap={{ scale: 0.98 }}
                    className="border-b border-r border-slate-100 min-h-[90px] p-1.5 cursor-pointer transition-colors group"
                    onClick={() => openCreate(dateStr)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs font-black w-6 h-6 flex items-center justify-center rounded-full transition-colors ${
                        isToday ? 'bg-slate-900 text-white' : 'text-slate-400 group-hover:text-slate-700'
                      }`}>
                        {day}
                      </span>
                      <Plus className="w-3 h-3 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="space-y-0.5">
                      {dayEvents.slice(0, 3).map(ev => {
                        const c = EVENT_COLORS[ev.event_type];
                        return (
                          <motion.div
                            key={ev.id}
                            whileHover={{ opacity: 0.75 }}
                            onClick={e => { e.stopPropagation(); openView(ev); }}
                            className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold truncate cursor-pointer ${c.badge}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${c.dot}`} />
                            <span className="truncate">{ev.title}</span>
                          </motion.div>
                        );
                      })}
                      {dayEvents.length > 3 && (
                        <div className="text-[10px] font-bold text-slate-400 px-1.5">+{dayEvents.length - 3} more</div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* ── View Modal ─────────────────────────────────────── */}
      <AnimatePresence>
      {modal === 'view' && selectedEvent && (() => {
        const ev = selectedEvent;
        const c = EVENT_COLORS[ev.event_type];
        return (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={closeModal}>
            <motion.div
              initial={{ scale: 0.95, y: 12, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 8, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0 pr-3">
                    <span className={`inline-block text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full mb-2 ${c.badge}`}>
                      {EVENT_LABELS[ev.event_type]}
                    </span>
                    <h2 className="text-lg font-black text-slate-900 tracking-tight">{ev.title}</h2>
                  </div>
                  <button onClick={closeModal} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors shrink-0">
                    <X className="w-4 h-4 text-slate-500" />
                  </button>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="font-bold">{formatDate(ev.event_date)}</span>
                  </div>
                  {(ev.start_time || ev.end_time) && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>{formatTime(ev.start_time)}{ev.end_time ? ` – ${formatTime(ev.end_time)}` : ''}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-slate-600">
                    <Users className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{audienceSummary(ev)}</span>
                  </div>
                  {ev.description && (
                    <p className="text-slate-500 leading-relaxed border-t border-slate-100 pt-3">{ev.description}</p>
                  )}
                  {ev.attachment_url && (
                    <button
                      onClick={() => handleDownload(ev)}
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-bold transition-colors"
                    >
                      <Paperclip className="w-4 h-4" />
                      {ev.attachment_name ?? 'Attachment'}
                    </button>
                  )}
                </div>
              </div>

              <div className="flex gap-2 p-4 pt-0">
                <button
                  onClick={() => { closeModal(); setTimeout(() => openEdit(ev), 50); }}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-black hover:bg-slate-700 transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => setDeleteConfirm(true)}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-red-500 hover:bg-red-50 text-sm font-black transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {deleteConfirm && (
                <div className="mx-4 mb-4 p-4 bg-red-50 rounded-xl border border-red-100">
                  <p className="text-sm font-bold text-red-700 mb-3">Delete this event? This cannot be undone.</p>
                  <div className="flex gap-2">
                    <button onClick={handleDelete} disabled={saving}
                      className="flex-1 py-2 rounded-xl bg-red-600 text-white text-sm font-black hover:bg-red-700 transition-colors disabled:opacity-50">
                      {saving ? 'Deleting…' : 'Yes, Delete'}
                    </button>
                    <button onClick={() => setDeleteConfirm(false)}
                      className="flex-1 py-2 rounded-xl bg-white border border-slate-200 text-sm font-black text-slate-700 hover:bg-slate-50 transition-colors">
                      Cancel
                    </button>
                  </div>
                </div>
              )}
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={closeModal}>
          <motion.div
            initial={{ scale: 0.95, y: 12, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 8, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
              <h2 className="text-base font-black text-slate-900">
                {modal === 'create' ? `New Event — ${formatDate(form.event_date)}` : 'Edit Event'}
              </h2>
              <button onClick={closeModal} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Event Type */}
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Type</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {EVENT_TYPES.map(t => {
                    const c = EVENT_COLORS[t.value];
                    const active = form.event_type === t.value;
                    return (
                      <button
                        key={t.value}
                        onClick={() => setForm(f => ({ ...f, event_type: t.value }))}
                        className={`py-2 rounded-xl text-xs font-black transition-all ${
                          active ? `${c.badge} ring-2 ring-offset-1 ring-current` : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
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
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Title *</label>
                <input
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Chapter 4 homework"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                  {form.event_type === 'homework' ? 'Due Date *' : 'Date *'}
                </label>
                <input
                  type="date"
                  value={form.event_date}
                  onChange={e => setForm(f => ({ ...f, event_date: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              {/* Time — only for assessment/exam/other */}
              {form.event_type !== 'homework' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Start Time</label>
                    <input
                      type="time"
                      value={form.start_time}
                      onChange={e => setForm(f => ({ ...f, start_time: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">End Time</label>
                    <input
                      type="time"
                      value={form.end_time}
                      onChange={e => setForm(f => ({ ...f, end_time: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={3}
                  placeholder="Additional details…"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 resize-none"
                />
              </div>

              {/* Attachment — homework only */}
              {form.event_type === 'homework' && (
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Attachment</label>
                  {/* Existing attachment in edit mode */}
                  {modal === 'edit' && selectedEvent?.attachment_url && !clearAttachment && !attachmentFile && (
                    <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-xl border border-blue-100 mb-2">
                      <Paperclip className="w-4 h-4 text-blue-500 shrink-0" />
                      <span className="text-sm font-bold text-blue-700 flex-1 truncate">{selectedEvent.attachment_name}</span>
                      <button onClick={() => setClearAttachment(true)} className="text-red-400 hover:text-red-600 transition-colors">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                  {attachmentFile ? (
                    <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-xl border border-blue-100">
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
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-slate-200 text-sm font-bold text-slate-400 hover:border-slate-400 hover:text-slate-600 transition-colors"
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
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Who sees this?</label>
                <div className="grid grid-cols-2 gap-1.5 mb-3">
                  {([
                    { value: 'all',      label: 'Everyone',        icon: Users },
                    { value: 'grade',    label: 'By Grade',        icon: GraduationCap },
                    { value: 'class',    label: 'By Class',        icon: BookOpen },
                    { value: 'subject',  label: 'By Subject',      icon: BookOpen },
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
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-black transition-all ${
                          active ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
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
                          className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${active ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
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
                    {cohorts.length === 0 && <p className="text-xs text-slate-400">No classes found.</p>}
                    {cohorts.map(c => {
                      const active = form.target_cohort_ids.includes(c.id);
                      return (
                        <button key={c.id}
                          onClick={() => setForm(f => ({ ...f, target_cohort_ids: toggle(f.target_cohort_ids, c.id) }))}
                          className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${active ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
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
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Subject *</p>
                      <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                        {subjects.map(s => {
                          const active = form.target_subject_ids.includes(s.id);
                          return (
                            <button key={s.id}
                              onClick={() => setForm(f => ({ ...f, target_subject_ids: toggle(f.target_subject_ids, s.id) }))}
                              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${active ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                            >
                              {s.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Grade *</p>
                      <div className="flex flex-wrap gap-1.5">
                        {GRADES.map(g => {
                          const active = form.target_grades.includes(g);
                          return (
                            <button key={g}
                              onClick={() => setForm(f => ({ ...f, target_grades: toggle(f.target_grades, g) }))}
                              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${active ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                            >
                              Grade {g}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-400">Only students in the selected grade(s) who take the selected subject(s) will see this.</p>
                  </div>
                )}

                {/* Specific student picker */}
                {form.target_type === 'specific' && (
                  <div className="space-y-1 max-h-40 overflow-y-auto border border-slate-100 rounded-xl p-2">
                    {allStudents.length === 0 && <p className="text-xs text-slate-400 p-2">No students found.</p>}
                    {allStudents.map(s => {
                      const active = form.target_student_ids.includes(s.id);
                      return (
                        <button key={s.id}
                          onClick={() => setForm(f => ({ ...f, target_student_ids: toggle(f.target_student_ids, s.id) }))}
                          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-left transition-all ${active ? 'bg-slate-900 text-white' : 'hover:bg-slate-100 text-slate-700'}`}
                        >
                          <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 text-[10px] font-black ${active ? 'bg-white border-white text-slate-900' : 'border-slate-300'}`}>
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

            <div className="sticky bottom-0 bg-white border-t border-slate-100 px-6 py-4 rounded-b-2xl flex gap-2">
              <button onClick={closeModal}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-black text-slate-600 hover:bg-slate-50 transition-colors">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving}
                className="flex-1 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-black hover:bg-slate-700 transition-colors disabled:opacity-50">
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
