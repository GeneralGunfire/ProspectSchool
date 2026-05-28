import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Calendar, Clock, Paperclip, X } from 'lucide-react';
import { supabaseAdmin } from '../../../lib/supabase';
import { fetchStudentEvents, getAttachmentDownloadUrl, EVENT_COLORS, EVENT_LABELS, type SchoolEvent } from '../../../lib/events';
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

  // Day panel (click a day)
  const [selectedDay, setSelectedDay]     = useState<string | null>(null);
  // Single event detail (click an event inside day panel)
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

  const upcoming = events.filter(e => e.event_date >= todayStr).slice(0, 5);
  const dayEvents = selectedDay ? events.filter(e => e.event_date === selectedDay) : [];

  return (
    <div className="p-6 max-w-5xl">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Calendar</p>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">My Schedule</h1>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            onClick={prevMonth}
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-slate-600" />
          </motion.button>

          <div className="relative overflow-hidden min-w-[10rem] text-center">
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

          <motion.button
            onClick={nextMonth}
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-slate-600" />
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-6">

        {/* Calendar grid */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          {/* Day headers */}
          <div className="grid grid-cols-7 border-b border-slate-100">
            {DAYS.map(d => (
              <div key={d} className="py-2.5 text-center text-[11px] font-black uppercase tracking-widest text-slate-400">
                {d}
              </div>
            ))}
          </div>

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
                  if (!day) return (
                    <div key={`empty-${idx}`} className="border-b border-r border-slate-50 min-h-[80px]" />
                  );
                  const dateStr    = toDateStr(year, month, day);
                  const dayEvs     = eventsOnDay(day);
                  const isToday    = dateStr === todayStr;
                  const isSelected = dateStr === selectedDay;
                  const hasEvents  = dayEvs.length > 0;

                  return (
                    <motion.div
                      key={day}
                      onClick={() => handleDayClick(day)}
                      whileHover={{ backgroundColor: isSelected ? '#f1f5f9' : '#f8fafc' }}
                      whileTap={{ scale: 0.97 }}
                      className={`border-b border-r border-slate-100 min-h-[80px] p-1.5 cursor-pointer transition-colors relative ${
                        isSelected ? 'bg-slate-50 ring-2 ring-inset ring-slate-900' : ''
                      }`}
                    >
                      <div className="mb-1 flex items-center justify-between">
                        <motion.span
                          animate={isToday ? { scale: [1, 1.1, 1] } : {}}
                          transition={{ duration: 0.4 }}
                          className={`text-xs font-black w-6 h-6 flex items-center justify-center rounded-full transition-colors ${
                            isToday
                              ? 'bg-slate-900 text-white'
                              : isSelected
                              ? 'text-slate-900'
                              : 'text-slate-400'
                          }`}
                        >
                          {day}
                        </motion.span>
                        {hasEvents && (
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" />
                        )}
                      </div>
                      <div className="space-y-0.5">
                        {dayEvs.slice(0, 2).map(ev => {
                          const c = EVENT_COLORS[ev.event_type];
                          return (
                            <div
                              key={ev.id}
                              className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold truncate ${c.badge}`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${c.dot}`} />
                              <span className="truncate">{ev.title}</span>
                            </div>
                          );
                        })}
                        {dayEvs.length > 2 && (
                          <div className="text-[10px] font-bold text-slate-400 px-1.5">+{dayEvs.length - 2} more</div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">

          <AnimatePresence mode="wait">
            {selectedDay ? (
              <motion.div
                key={selectedDay}
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
              >
                {/* Day header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                  <div>
                    <p className="text-xs font-black text-slate-900">{formatDayFull(selectedDay)}</p>
                    <p className="text-[10px] text-slate-400 font-bold mt-0.5">
                      {dayEvents.length === 0 ? 'No events' : `${dayEvents.length} event${dayEvents.length > 1 ? 's' : ''}`}
                    </p>
                  </div>
                  <button
                    onClick={() => { setSelectedDay(null); setSelectedEvent(null); }}
                    className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <X className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </div>

                {dayEvents.length === 0 ? (
                  <div className="px-4 py-6 text-center">
                    <p className="text-sm font-bold text-slate-300">Nothing on this day.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {dayEvents.map((ev, i) => {
                      const c = EVENT_COLORS[ev.event_type];
                      const isOpen = selectedEvent?.id === ev.id;
                      return (
                        <div key={ev.id}>
                          <motion.button
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05, duration: 0.18 }}
                            onClick={() => setSelectedEvent(isOpen ? null : ev)}
                            className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors"
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`w-2 h-2 rounded-full shrink-0 ${c.dot}`} />
                              <span className={`text-[10px] font-black uppercase tracking-widest ${c.text}`}>
                                {EVENT_LABELS[ev.event_type]}
                              </span>
                            </div>
                            <p className="text-sm font-bold text-slate-900 truncate">{ev.title}</p>
                            {ev.start_time && (
                              <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatTime(ev.start_time)}{ev.end_time ? ` – ${formatTime(ev.end_time)}` : ''}
                              </p>
                            )}
                          </motion.button>

                          {/* Inline expanded detail */}
                          <AnimatePresence>
                            {isOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2, ease: 'easeOut' }}
                                className="overflow-hidden"
                              >
                                <div className={`mx-3 mb-3 p-3 rounded-xl ${c.bg}`}>
                                  {ev.description && (
                                    <p className="text-xs text-slate-600 leading-relaxed mb-2">{ev.description}</p>
                                  )}
                                  {ev.attachment_url && (
                                    <button
                                      onClick={() => handleDownload(ev)}
                                      disabled={downloading}
                                      className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors disabled:opacity-50"
                                    >
                                      <Paperclip className="w-3.5 h-3.5" />
                                      {downloading ? 'Opening…' : ev.attachment_name ?? 'Download'}
                                    </button>
                                  )}
                                  {!ev.description && !ev.attachment_url && (
                                    <p className="text-xs text-slate-400 italic">No additional details.</p>
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
              /* Coming Up — shown when no day selected */
              <motion.div
                key="upcoming"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-2xl border border-slate-200 p-4"
              >
                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Coming Up</p>
                {upcoming.length === 0 ? (
                  <p className="text-sm text-slate-400 font-bold">Nothing scheduled.</p>
                ) : (
                  <div className="space-y-2">
                    {upcoming.map((ev, i) => {
                      const c = EVENT_COLORS[ev.event_type];
                      return (
                        <motion.button
                          key={ev.id}
                          initial={{ opacity: 0, x: 8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.06, duration: 0.18 }}
                          onClick={() => {
                            const [y, m, d] = ev.event_date.split('-');
                            const evYear  = parseInt(y);
                            const evMonth = parseInt(m);
                            if (evYear === year && evMonth === month) {
                              setSelectedDay(ev.event_date);
                              setSelectedEvent(ev);
                            }
                          }}
                          className="w-full text-left p-3 rounded-xl hover:bg-slate-50 transition-colors border border-slate-100"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`w-2 h-2 rounded-full shrink-0 ${c.dot}`} />
                            <span className={`text-[10px] font-black uppercase tracking-widest ${c.text}`}>{EVENT_LABELS[ev.event_type]}</span>
                          </div>
                          <p className="text-sm font-bold text-slate-900 truncate">{ev.title}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">{formatDate(ev.event_date)}</p>
                        </motion.button>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Legend */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.2 }}
            className="bg-white rounded-2xl border border-slate-200 p-4"
          >
            <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Legend</p>
            <div className="space-y-2">
              {(['homework','assessment','exam','other'] as const).map(type => {
                const c = EVENT_COLORS[type];
                return (
                  <div key={type} className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${c.dot}`} />
                    <span className="text-xs font-bold text-slate-600">{EVENT_LABELS[type]}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
