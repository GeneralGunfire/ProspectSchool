import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft, ChevronRight, Calendar, List, Clock, Paperclip, X, CheckCircle2, Circle,
} from 'lucide-react';
import { supabaseAdmin } from '../../../lib/supabase';
import {
  fetchStudentEvents, getAttachmentDownloadUrl,
  markHomeworkDone, unmarkHomeworkDone, fetchStudentCompletions,
  EVENT_COLORS, EVENT_LABELS, type SchoolEvent,
} from '../../../lib/events';
import type { StudentSession } from '../../../lib/auth';

// ── Helpers ───────────────────────────────────────────────────

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

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
function formatDayFull(d: string) {
  const date = new Date(d + 'T00:00:00');
  return date.toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long' });
}

const TYPE_PILL: Record<string, string> = {
  homework:   'bg-blue-50 text-blue-700',
  assessment: 'bg-emerald-50 text-emerald-700',
  exam:       'bg-red-50 text-red-700',
  other:      'bg-stone-100 text-stone-600',
};
const TYPE_CELL_BG: Record<string, string> = {
  homework:   'bg-blue-50 text-blue-700',
  assessment: 'bg-emerald-50 text-emerald-700',
  exam:       'bg-red-50 text-red-700',
  other:      'bg-stone-100 text-stone-600',
};

const ease = [0.23, 1, 0.32, 1] as [number, number, number, number];

interface StudentCalendarPageProps {
  session: StudentSession;
}

export default function StudentCalendarPage({ session }: StudentCalendarPageProps) {
  const today = new Date();
  const [year, setYear]     = useState(today.getFullYear());
  const [month, setMonth]   = useState(today.getMonth() + 1);
  const [events, setEvents] = useState<SchoolEvent[]>([]);
  const [loading, setLoading]   = useState(true);
  const [monthKey, setMonthKey] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [subjectIds, setSubjectIds] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Homework completions
  const [completions, setCompletions] = useState<Set<number>>(new Set());
  const [togglingId, setTogglingId] = useState<number | null>(null);

  // Day panel (click a day)
  const [selectedDay, setSelectedDay]     = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<SchoolEvent | null>(null);
  const [downloading, setDownloading]     = useState(false);

  const todayStr = toDateStr(today.getFullYear(), today.getMonth() + 1, today.getDate());

  // Load student's subject IDs once
  useEffect(() => {
    supabaseAdmin
      .from('teacher_students')
      .select('subject_id')
      .eq('student_id', session.student_id)
      .then(({ data }) => {
        const ids = [...new Set((data ?? []).map((r: any) => r.subject_id as number))];
        setSubjectIds(ids);
      });
    // Load completions once
    fetchStudentCompletions(session.student_id, session.school_id)
      .then(setCompletions);
  }, []);

  // Load events whenever month/year or subjectIds change
  useEffect(() => {
    setLoading(true);
    fetchStudentEvents(
      session.school_id,
      session.student_id,
      session.grade,
      session.cohort_id,
      subjectIds,
      year,
      month
    ).then(data => {
      setEvents(data);
      setLoading(false);
    });
  }, [year, month, subjectIds]);

  // Calendar grid
  const firstDayOfMonth = new Date(year, month - 1, 1).getDay();
  const daysInMonth     = new Date(year, month, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstDayOfMonth).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  function eventsOnDay(day: number) {
    return events.filter(e => e.event_date === toDateStr(year, month, day));
  }

  function prevMonth() {
    setDirection(-1);
    setMonthKey(k => k - 1);
    if (month === 1) { setYear(y => y - 1); setMonth(12); }
    else setMonth(m => m - 1);
    setSelectedDay(null);
  }
  function nextMonth() {
    setDirection(1);
    setMonthKey(k => k + 1);
    if (month === 12) { setYear(y => y + 1); setMonth(1); }
    else setMonth(m => m + 1);
    setSelectedDay(null);
  }

  function handleDayClick(day: number) {
    const str = toDateStr(year, month, day);
    setSelectedDay(prev => prev === str ? null : str);
    setSelectedEvent(null);
  }

  async function handleDownload(ev: SchoolEvent) {
    if (!ev.attachment_url) return;
    setDownloading(true);
    const url = await getAttachmentDownloadUrl(ev.attachment_url);
    setDownloading(false);
    if (url) window.open(url, '_blank');
  }

  async function handleToggleDone(ev: SchoolEvent, e: React.MouseEvent) {
    e.stopPropagation();
    if (ev.event_type !== 'homework') return;
    setTogglingId(ev.id);
    const done = completions.has(ev.id);
    if (done) {
      await unmarkHomeworkDone(ev.id, session.student_id);
      setCompletions(prev => { const s = new Set(prev); s.delete(ev.id); return s; });
    } else {
      await markHomeworkDone(ev.id, session.student_id, session.school_id);
      setCompletions(prev => new Set(prev).add(ev.id));
    }
    setTogglingId(null);
  }

  const upcoming = events.filter(e => e.event_date >= todayStr).slice(0, 5);
  const dayEvents = selectedDay ? events.filter(e => e.event_date === selectedDay) : [];

  // List view: all events sorted by date
  const allSorted = [...events].sort((a, b) => a.event_date.localeCompare(b.event_date));

  // Group list events by date
  const grouped = allSorted.reduce<Record<string, SchoolEvent[]>>((acc, ev) => {
    (acc[ev.event_date] = acc[ev.event_date] ?? []).push(ev);
    return acc;
  }, {});

  return (
    <div className="p-5 md:p-8 max-w-6xl w-full mx-auto pb-20 md:pb-8">

      {/* ── Header ──────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease }}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6"
      >
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-stone-400 mb-1">Calendar</p>
          <h1 className="font-display font-black text-[#1C1917] text-2xl md:text-3xl" style={{ letterSpacing: '-0.03em' }}>
            My Schedule
          </h1>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Today button */}
          <button
            onClick={() => { setYear(today.getFullYear()); setMonth(today.getMonth() + 1); setSelectedDay(todayStr); }}
            className="px-3 py-1.5 text-xs font-black text-stone-600 bg-white border border-stone-200 rounded-xl hover:border-stone-400 transition-colors"
          >
            Today
          </button>

          {/* Month nav — paired button group */}
          <div className="flex items-center bg-white border border-stone-200 rounded-xl overflow-hidden">
            <button onClick={prevMonth} className="p-2 hover:bg-stone-50 transition-colors border-r border-stone-200">
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
                  className="block text-sm font-black text-[#1C1917] py-1.5"
                >
                  {MONTHS[month - 1]} {year}
                </motion.span>
              </AnimatePresence>
            </div>
            <button onClick={nextMonth} className="p-2 hover:bg-stone-50 transition-colors border-l border-stone-200">
              <ChevronRight className="w-4 h-4 text-stone-600" />
            </button>
          </div>

          {/* Grid/List toggle */}
          <div className="flex items-center bg-white border border-stone-200 rounded-xl p-0.5 gap-0.5">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                viewMode === 'grid' ? 'bg-[#1C1917] text-white' : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" /> Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                viewMode === 'list' ? 'bg-[#1C1917] text-white' : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              <List className="w-3.5 h-3.5" /> List
            </button>
          </div>
        </div>
      </motion.div>

      <div className="flex flex-col xl:flex-row gap-5">
        <div className="flex-1 min-w-0">

          {/* ── LIST VIEW ───────────────────────────────────────── */}
          <AnimatePresence mode="wait" initial={false}>
            {viewMode === 'list' ? (
              <motion.div
                key="list"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                {loading ? (
                  <div className="flex items-center justify-center py-24">
                    <div className="w-5 h-5 border-2 border-stone-200 border-t-[#1C1917] rounded-full animate-spin" />
                  </div>
                ) : allSorted.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-24">
                    <Calendar className="w-8 h-8 text-stone-200 mb-3" />
                    <p className="text-sm font-bold text-stone-300">No events this month.</p>
                  </div>
                ) : (
                  <div>
                    {Object.entries(grouped).map(([dateStr, dayEvs]) => (
                      <div key={dateStr}>
                        <p className="text-[11px] font-black uppercase tracking-[0.22em] text-stone-400 mb-2 mt-4 first:mt-0">
                          {formatDate(dateStr)}
                        </p>
                        {dayEvs.map((ev, i) => {
                          const c = EVENT_COLORS[ev.event_type];
                          const isHomework = ev.event_type === 'homework';
                          const done = completions.has(ev.id);
                          const toggling = togglingId === ev.id;
                          return (
                            <motion.div
                              key={ev.id}
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.03, duration: 0.2 }}
                              className={`bg-white rounded-xl border border-stone-200 px-4 py-3 flex items-center gap-3 mb-2 hover:border-stone-300 transition-colors ${done ? 'opacity-60' : ''}`}
                            >
                              <span className={`w-2 h-2 rounded-full shrink-0 ${c.dot}`} />
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm font-bold truncate ${done ? 'line-through text-stone-400' : 'text-stone-900'}`}>
                                  {ev.title}
                                </p>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className={`text-[10px] font-black uppercase tracking-widest ${c.text}`}>
                                    {EVENT_LABELS[ev.event_type]}
                                  </span>
                                  {ev.start_time && (
                                    <span className="text-[11px] text-stone-400 flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      {formatTime(ev.start_time)}{ev.end_time ? ` – ${formatTime(ev.end_time)}` : ''}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${TYPE_PILL[ev.event_type]}`}>
                                {EVENT_LABELS[ev.event_type]}
                              </span>
                              {isHomework && (
                                <button
                                  onClick={(e) => handleToggleDone(ev, e)}
                                  disabled={toggling}
                                  className="p-1 rounded-lg hover:bg-stone-100 transition-colors disabled:opacity-40"
                                >
                                  {done
                                    ? <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                    : <Circle className="w-5 h-5 text-stone-300" />
                                  }
                                </button>
                              )}
                            </motion.div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>

            ) : (
              /* ── GRID VIEW ──────────────────────────────────────── */
              <motion.div
                key="grid"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
                  {/* Day headers */}
                  <div className="grid grid-cols-7 border-b border-stone-100">
                    {DAYS.map(d => (
                      <div key={d} className="py-2.5 text-center text-[11px] font-black uppercase tracking-[0.15em] text-stone-400 border-b border-stone-100">
                        {d}
                      </div>
                    ))}
                  </div>

                  {loading ? (
                    <div className="h-64 flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-stone-200 border-t-[#1C1917] rounded-full animate-spin" />
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
                          if (!day) return (
                            <div key={`empty-${idx}`} className="border-r border-b border-stone-100 min-h-[90px]" />
                          );
                          const dateStr    = toDateStr(year, month, day);
                          const dayEvs     = eventsOnDay(day);
                          const isToday    = dateStr === todayStr;
                          const isSelected = dateStr === selectedDay;

                          return (
                            <div
                              key={day}
                              onClick={() => handleDayClick(day)}
                              className={`border-r border-b border-stone-100 last:border-r-0 min-h-[90px] p-2 cursor-pointer relative transition-colors hover:bg-stone-50 ${
                                isSelected ? 'bg-stone-50 ring-2 ring-inset ring-[#1C1917]' : ''
                              }`}
                            >
                              <div className="mb-1 flex items-center justify-between">
                                <span className={`text-xs font-black w-7 h-7 flex items-center justify-center rounded-full transition-colors ${
                                  isToday
                                    ? 'bg-[#1C1917] text-white'
                                    : isSelected
                                    ? 'text-[#1C1917]'
                                    : 'text-stone-400'
                                }`}>
                                  {day}
                                </span>
                              </div>
                              <div className="space-y-0.5">
                                {dayEvs.slice(0, 2).map(ev => {
                                  const done = completions.has(ev.id);
                                  return (
                                    <div key={ev.id}
                                      className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold truncate ${TYPE_CELL_BG[ev.event_type]} ${done ? 'opacity-50' : ''}`}>
                                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${EVENT_COLORS[ev.event_type].dot}`} />
                                      <span className={`truncate ${done ? 'line-through' : ''}`}>{ev.title}</span>
                                    </div>
                                  );
                                })}
                                {dayEvs.length > 2 && (
                                  <div className="text-[10px] font-bold text-stone-400 px-1.5">+{dayEvs.length - 2} more</div>
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

        {/* ── Right sidebar ─────────────────────────────────────── */}
        <div className="hidden xl:block w-72 shrink-0 space-y-4">

          {/* Day detail or upcoming events */}
          <AnimatePresence mode="wait">
            {selectedDay ? (
              <motion.div
                key={selectedDay}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease }}
                className="bg-white rounded-2xl border border-stone-200 overflow-hidden"
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-stone-100">
                  <div>
                    <p className="text-xs font-black text-[#1C1917]">{formatDayFull(selectedDay)}</p>
                    <p className="text-[10px] text-stone-400 font-bold mt-0.5">
                      {dayEvents.length === 0 ? 'No events' : `${dayEvents.length} event${dayEvents.length > 1 ? 's' : ''}`}
                    </p>
                  </div>
                  <button onClick={() => { setSelectedDay(null); setSelectedEvent(null); }}
                    className="p-1.5 rounded-lg hover:bg-stone-100 transition-colors">
                    <X className="w-3.5 h-3.5 text-stone-400" />
                  </button>
                </div>

                {dayEvents.length === 0 ? (
                  <div className="px-4 py-6 text-center">
                    <p className="text-sm font-bold text-stone-300">Nothing on this day.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-stone-100">
                    {dayEvents.map((ev, i) => {
                      const c = EVENT_COLORS[ev.event_type];
                      const isOpen = selectedEvent?.id === ev.id;
                      const isHomework = ev.event_type === 'homework';
                      const done = completions.has(ev.id);
                      const toggling = togglingId === ev.id;
                      return (
                        <div key={ev.id}>
                          <div className="flex items-center">
                            <motion.button
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.05, duration: 0.18 }}
                              onClick={() => setSelectedEvent(isOpen ? null : ev)}
                              className="flex-1 text-left px-4 py-3 hover:bg-stone-50 transition-colors"
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`w-2 h-2 rounded-full shrink-0 ${c.dot}`} />
                                <span className={`text-[10px] font-black uppercase tracking-widest ${c.text}`}>
                                  {EVENT_LABELS[ev.event_type]}
                                </span>
                              </div>
                              <p className={`text-sm font-bold truncate ${done ? 'line-through text-stone-400' : 'text-stone-900'}`}>
                                {ev.title}
                              </p>
                              {ev.start_time && (
                                <p className="text-[11px] text-stone-400 mt-0.5 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {formatTime(ev.start_time)}{ev.end_time ? ` – ${formatTime(ev.end_time)}` : ''}
                                </p>
                              )}
                            </motion.button>

                            {isHomework && (
                              <button
                                onClick={(e) => handleToggleDone(ev, e)}
                                disabled={toggling}
                                className="px-3 py-3 hover:bg-stone-50 transition-colors disabled:opacity-40"
                              >
                                {done
                                  ? <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                  : <Circle className="w-5 h-5 text-stone-300" />
                                }
                              </button>
                            )}
                          </div>

                          <AnimatePresence>
                            {isOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2, ease: 'easeOut' }}
                                className="overflow-hidden"
                              >
                                <div className={`mx-3 mb-3 p-3 rounded-xl ${TYPE_PILL[ev.event_type]?.split(' ')[0] ?? 'bg-stone-50'}`}>
                                  {ev.description && (
                                    <p className="text-xs text-stone-600 leading-relaxed mb-2">{ev.description}</p>
                                  )}
                                  {ev.attachment_url && (
                                    <button onClick={() => handleDownload(ev)} disabled={downloading}
                                      className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors disabled:opacity-50">
                                      <Paperclip className="w-3.5 h-3.5" />
                                      {downloading ? 'Opening…' : ev.attachment_name ?? 'Download'}
                                    </button>
                                  )}
                                  {!ev.description && !ev.attachment_url && (
                                    <p className="text-xs text-stone-400 italic">No additional details.</p>
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="upcoming"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease }}
                className="bg-white rounded-2xl border border-stone-200 p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[11px] font-black uppercase tracking-[0.22em] text-stone-400">Upcoming Events</p>
                  <button onClick={() => setViewMode('list')}
                    className="text-[11px] font-black text-stone-400 hover:text-stone-600 transition-colors">
                    View all
                  </button>
                </div>
                {upcoming.length === 0 ? (
                  <p className="text-sm text-stone-300 font-bold">Nothing scheduled.</p>
                ) : (
                  <div className="space-y-2">
                    {upcoming.map((ev, i) => {
                      const c = EVENT_COLORS[ev.event_type];
                      const isHomework = ev.event_type === 'homework';
                      const done = completions.has(ev.id);
                      return (
                        <motion.div key={ev.id}
                          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, ease, delay: i * 0.04 }}
                          className="flex items-center gap-2"
                        >
                          <div className={`flex-1 flex items-center gap-3 px-3 py-2.5 rounded-xl border border-stone-100 hover:border-stone-200 transition-colors cursor-pointer ${done ? 'opacity-50' : ''}`}
                            onClick={() => {
                              const evYear  = parseInt(ev.event_date.split('-')[0]);
                              const evMonth = parseInt(ev.event_date.split('-')[1]);
                              if (evYear === year && evMonth === month) {
                                setSelectedDay(ev.event_date);
                                setSelectedEvent(ev);
                              }
                            }}>
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${TYPE_PILL[ev.event_type]?.split(' ')[0] ?? 'bg-stone-100'}`}>
                              <span className={`w-2 h-2 rounded-full ${c.dot}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-bold text-stone-900 truncate ${done ? 'line-through text-stone-400' : ''}`}>{ev.title}</p>
                              <p className="text-[11px] text-stone-400">{formatDate(ev.event_date)}</p>
                            </div>
                            <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full shrink-0 ${TYPE_PILL[ev.event_type]}`}>
                              {EVENT_LABELS[ev.event_type]}
                            </span>
                          </div>

                          {isHomework && (
                            <button
                              onClick={(e) => handleToggleDone(ev, e)}
                              disabled={togglingId === ev.id}
                              className="p-1.5 rounded-xl hover:bg-stone-100 transition-colors disabled:opacity-40 shrink-0"
                            >
                              {done
                                ? <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                : <Circle className="w-4 h-4 text-stone-300" />
                              }
                            </button>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Legend */}
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease, delay: 0.15 }}
            className="bg-white rounded-2xl border border-stone-200 p-4"
          >
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-stone-400 mb-3">Legend</p>
            <div className="space-y-2">
              {(['homework','assessment','exam','other'] as const).map(type => {
                const c = EVENT_COLORS[type];
                return (
                  <div key={type} className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${c.dot}`} />
                    <span className="text-xs font-bold text-stone-600">{EVENT_LABELS[type]}</span>
                    {type === 'homework' && (
                      <span className="text-[10px] text-stone-300 font-bold ml-auto">tap to mark done</span>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Sync Calendar */}
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease, delay: 0.2 }}
            className="bg-white rounded-2xl border border-stone-200 p-4"
          >
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-stone-400 mb-1">Sync Calendar</p>
            <p className="text-xs text-stone-400 mb-3">Connect your school calendar to Google Calendar or Apple Calendar.</p>
            <button className="w-full text-sm font-bold text-stone-700 border border-stone-200 rounded-lg py-2 hover:border-stone-400 transition-colors">
              Connect Google Calendar
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
