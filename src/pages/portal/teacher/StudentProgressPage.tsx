import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronRight, BookOpen, TrendingUp, AlertTriangle,
  CheckCircle2, Clock, X, Users,
} from 'lucide-react';
import {
  fetchTeacherStudentProgress,
  type StudentProgressSummary,
  type StudyProgress,
} from '../../../lib/studyProgress';
import type { TeacherSession } from '../../../lib/auth';

// ── Helpers ───────────────────────────────────────────────────

function masteryColor(level: string) {
  if (level === 'mastered')       return { dot: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50', label: 'Mastered' };
  if (level === 'needs_practice') return { dot: 'bg-amber-500',   text: 'text-amber-700',   bg: 'bg-amber-50',   label: 'Needs Practice' };
  return                                 { dot: 'bg-slate-300',   text: 'text-slate-400',   bg: 'bg-slate-50',   label: 'Not Started' };
}

function timeAgo(iso: string | null): string {
  if (!iso) return 'Never';
  const diff = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 2)   return 'Just now';
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7)   return `${days}d ago`;
  return new Date(iso).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' });
}

// Group progress rows by subject
function groupBySubject(progress: StudyProgress[]): Map<string, StudyProgress[]> {
  const map = new Map<string, StudyProgress[]>();
  for (const p of progress) {
    if (!map.has(p.subject)) map.set(p.subject, []);
    map.get(p.subject)!.push(p);
  }
  return map;
}

interface StudentProgressPageProps {
  session: TeacherSession;
}

export default function StudentProgressPage({ session }: StudentProgressPageProps) {
  const [students, setStudents] = useState<StudentProgressSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<StudentProgressSummary | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchTeacherStudentProgress(session.teacher_id, session.school_id).then(data => {
      setStudents(data);
      setLoading(false);
    });
  }, []);

  const filtered = students.filter(s =>
    `${s.student_surname} ${s.student_name} ${s.student_code}`.toLowerCase().includes(search.toLowerCase())
  );

  const subjectGroups = selected ? groupBySubject(selected.progress) : new Map();

  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-6">
        <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Library</p>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Student Progress</h1>
        <p className="text-sm text-slate-400 mt-1">See what your students are studying and where they're struggling.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
            className="w-5 h-5 border-2 border-slate-200 border-t-slate-700 rounded-full" />
        </div>
      ) : students.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Users className="w-10 h-10 text-slate-200 mb-4" />
          <p className="text-sm font-bold text-slate-400">No students found.</p>
          <p className="text-xs text-slate-300 mt-1">Students linked to your classes will appear here.</p>
        </div>
      ) : (
        <>
          {/* Search */}
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search students…"
            className="w-full mb-4 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
          />

          {/* Summary stats */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { label: 'Total Students', value: students.length, icon: Users, color: 'text-slate-900' },
              { label: 'Topics Mastered', value: students.reduce((s, st) => s + st.topics_mastered, 0), icon: CheckCircle2, color: 'text-emerald-600' },
              { label: 'Need Support', value: students.filter(st => st.topics_struggling > 0).length, icon: AlertTriangle, color: 'text-amber-600' },
            ].map(stat => (
              <div key={stat.label} className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-3">
                <stat.icon className={`w-5 h-5 shrink-0 ${stat.color}`} />
                <div>
                  <p className="text-lg font-black text-slate-900 leading-none">{stat.value}</p>
                  <p className="text-[10px] font-bold text-slate-400 mt-0.5">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Student cards */}
          <div className="space-y-2">
            {filtered.map((student, i) => (
              <motion.button
                key={student.student_id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => setSelected(student)}
                className="w-full bg-white rounded-2xl border border-slate-200 px-5 py-4 text-left hover:border-slate-300 hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                    <span className="text-xs font-black text-slate-600">
                      {student.student_surname[0]}{student.student_name[0]}
                    </span>
                  </div>

                  {/* Name + meta */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-black text-slate-900">{student.student_surname}, {student.student_name}</p>
                      <span className="text-[10px] font-bold text-slate-400">{student.student_code}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Grade {student.grade}{student.cohort_name ? ` · ${student.cohort_name}` : ''}
                    </p>
                  </div>

                  {/* Progress dots */}
                  <div className="flex items-center gap-3 shrink-0">
                    {student.topics_mastered > 0 && (
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-xs font-bold text-emerald-700">{student.topics_mastered}</span>
                      </div>
                    )}
                    {student.topics_struggling > 0 && (
                      <div className="flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                        <span className="text-xs font-bold text-amber-700">{student.topics_struggling}</span>
                      </div>
                    )}
                    {student.last_accessed && (
                      <div className="flex items-center gap-1 text-slate-400">
                        <Clock className="w-3 h-3" />
                        <span className="text-[10px] font-bold">{timeAgo(student.last_accessed)}</span>
                      </div>
                    )}
                    {student.topics_started === 0 && (
                      <span className="text-[10px] font-bold text-slate-300">No activity</span>
                    )}
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                  </div>
                </div>

                {/* Struggling topics preview */}
                {student.topics_struggling > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {student.progress
                      .filter(p => p.mastery_level === 'needs_practice')
                      .slice(0, 4)
                      .map(p => (
                        <span key={p.topic} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100">
                          {p.topic.replace(/-/g, ' ')}
                        </span>
                      ))}
                    {student.topics_struggling > 4 && (
                      <span className="text-[10px] font-bold text-slate-400">+{student.topics_struggling - 4} more</span>
                    )}
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        </>
      )}

      {/* ── Student detail modal ──────────────────────────────── */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="bg-white w-full sm:max-w-xl max-h-[90vh] overflow-hidden flex flex-col rounded-t-3xl sm:rounded-2xl shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                    <span className="text-sm font-black text-slate-600">
                      {selected.student_surname[0]}{selected.student_name[0]}
                    </span>
                  </div>
                  <div>
                    <p className="text-base font-black text-slate-900">{selected.student_surname}, {selected.student_name}</p>
                    <p className="text-xs text-slate-400">Grade {selected.grade}{selected.cohort_name ? ` · ${selected.cohort_name}` : ''} · {selected.student_code}</p>
                  </div>
                </div>
                <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>

              {/* Stats bar */}
              <div className="flex gap-3 px-6 py-3 border-b border-slate-100 shrink-0">
                {[
                  { label: 'Started',   value: selected.topics_started,   color: 'text-slate-900' },
                  { label: 'Mastered',  value: selected.topics_mastered,  color: 'text-emerald-600' },
                  { label: 'Struggling', value: selected.topics_struggling, color: 'text-amber-600' },
                ].map(s => (
                  <div key={s.label} className="flex-1 text-center">
                    <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
                    <p className="text-[10px] font-bold text-slate-400">{s.label}</p>
                  </div>
                ))}
                <div className="flex-1 text-center">
                  <p className="text-xs font-bold text-slate-400 mt-1">Last active</p>
                  <p className="text-xs font-black text-slate-700">{timeAgo(selected.last_accessed)}</p>
                </div>
              </div>

              {/* Progress by subject */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                {selected.progress.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <BookOpen className="w-8 h-8 text-slate-200 mb-3" />
                    <p className="text-sm font-bold text-slate-300">No study activity yet.</p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {Array.from(subjectGroups.entries()).map(([subject, rows]) => {
                      const mastered   = rows.filter(r => r.mastery_level === 'mastered').length;
                      const struggling = rows.filter(r => r.mastery_level === 'needs_practice').length;
                      return (
                        <div key={subject}>
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-xs font-black uppercase tracking-widest text-slate-500">{subject}</p>
                            <div className="flex gap-2 text-[10px] font-bold">
                              {mastered > 0 && <span className="text-emerald-600">{mastered} mastered</span>}
                              {struggling > 0 && <span className="text-amber-600">{struggling} struggling</span>}
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            {rows
                              .sort((a, b) => {
                                const order = { needs_practice: 0, not_started: 1, mastered: 2 };
                                return order[a.mastery_level] - order[b.mastery_level];
                              })
                              .map(row => {
                                const m = masteryColor(row.mastery_level);
                                return (
                                  <div key={row.topic} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl ${m.bg}`}>
                                    <span className={`w-2 h-2 rounded-full shrink-0 ${m.dot}`} />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-bold text-slate-900 truncate capitalize">
                                        {row.topic.replace(/-/g, ' ')}
                                      </p>
                                      {row.last_attempt_score && (
                                        <p className="text-[10px] text-slate-400 mt-0.5">
                                          Score: {row.last_attempt_score} · {row.total_attempts} attempt{row.total_attempts !== 1 ? 's' : ''}
                                        </p>
                                      )}
                                    </div>
                                    <span className={`text-[10px] font-black uppercase tracking-widest shrink-0 ${m.text}`}>
                                      {m.label}
                                    </span>
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
