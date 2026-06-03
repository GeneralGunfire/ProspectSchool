import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronRight, BookOpen, AlertTriangle,
  CheckCircle2, Users, ClipboardList, CalendarDays,
  Megaphone, Pin,
} from 'lucide-react';
import {
  fetchTeacherStudentProgress,
  type StudentProgressSummary,
  type StudyProgress,
} from '../../../lib/studyProgress';
import { fetchStudentResults, type StudentResult } from '../../../lib/marks';
import {
  fetchStudentEvents, fetchStudentCompletions,
  type SchoolEvent,
} from '../../../lib/events';
import { fetchStudentAnnouncements, type Announcement } from '../../../lib/announcements';
import { supabaseAdmin } from '../../../lib/supabase';
import type { TeacherSession } from '../../../lib/auth';
import {
  fetchStudentInterventionChips, fetchTeacherClassHealth,
  type StudentInterventionChip, type TeacherSubjectHealth,
} from '../../../lib/teacherAnalytics';
import {
  getInterventions, getOutcomes, computeInterventionImpact,
  type Intervention, type Outcome,
} from '../../../lib/interventions';

// ── Types ─────────────────────────────────────────────────────

type View = 'list' | 'profile';
type ProfileTab = 'progress' | 'marks' | 'homework' | 'announcements' | 'interventions';

// ── Helpers ───────────────────────────────────────────────────

function timeAgo(iso: string | null): string {
  if (!iso) return 'Never';
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 2) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' });
}

function gradeLabel(mark: number, total: number) {
  const p = (mark / total) * 100;
  if (p >= 80) return { label: 'Outstanding', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' };
  if (p >= 70) return { label: 'Merit',        color: 'text-blue-700',    bg: 'bg-blue-50',    border: 'border-blue-200' };
  if (p >= 60) return { label: 'Adequate',     color: 'text-sky-700',     bg: 'bg-sky-50',     border: 'border-sky-200' };
  if (p >= 50) return { label: 'Moderate',     color: 'text-amber-700',   bg: 'bg-amber-50',   border: 'border-amber-200' };
  if (p >= 40) return { label: 'Elementary',   color: 'text-orange-700',  bg: 'bg-orange-50',  border: 'border-orange-200' };
  return              { label: 'Not Achieved', color: 'text-red-700',     bg: 'bg-red-50',     border: 'border-red-200' };
}

function groupBySubject(progress: StudyProgress[]): Map<string, StudyProgress[]> {
  const map = new Map<string, StudyProgress[]>();
  for (const p of progress) {
    if (!map.has(p.subject)) map.set(p.subject, []);
    map.get(p.subject)!.push(p);
  }
  return map;
}

function groupMarksBySubject(marks: StudentResult[]): Map<string, StudentResult[]> {
  const map = new Map<string, StudentResult[]>();
  for (const m of marks) {
    if (!map.has(m.subject_label)) map.set(m.subject_label, []);
    map.get(m.subject_label)!.push(m);
  }
  return map;
}

function initials(student: StudentProgressSummary) {
  return `${student.student_surname[0] ?? ''}${student.student_name[0] ?? ''}`;
}

// ── Component ─────────────────────────────────────────────────

interface StudentProgressPageProps {
  session: TeacherSession;
}

export default function StudentProgressPage({ session }: StudentProgressPageProps) {
  // List state
  const [view, setView] = useState<View>('list');
  const [students, setStudents] = useState<StudentProgressSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<StudentProgressSummary | null>(null);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'mastered' | 'struggling' | 'active'>('name');

  // Profile state
  const [activeTab, setActiveTab] = useState<ProfileTab>('progress');
  const [marks, setMarks] = useState<StudentResult[] | null>(null);
  const [events, setEvents] = useState<SchoolEvent[] | null>(null);
  const [completions, setCompletions] = useState<Set<number> | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[] | null>(null);
  const [subjectIds, setSubjectIds] = useState<number[] | null>(null);
  const [interventions, setInterventions] = useState<Intervention[] | null>(null);
  const [outcomes, setOutcomes] = useState<Outcome[] | null>(null);
  const [chips,       setChips]       = useState<Map<number, StudentInterventionChip>>(new Map());
  const [classHealth, setClassHealth] = useState<TeacherSubjectHealth[]>([]);

  useEffect(() => {
    fetchTeacherStudentProgress(session.teacher_id, session.school_id).then(data => {
      setStudents(data);
      setLoading(false);
      // Non-blocking — fetch chips + class health after list is visible
      if (data.length > 0) {
        fetchStudentInterventionChips(
          session.school_id,
          data.map(s => s.student_id),
        ).then(setChips);
      }
      fetchTeacherClassHealth(session.teacher_id, session.school_id).then(setClassHealth);
    });
  }, []);

  // Filtered + sorted list
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    const list = students.filter(s =>
      `${s.student_surname} ${s.student_name} ${s.student_code}`.toLowerCase().includes(q)
    );
    if (sortBy === 'name') list.sort((a, b) => a.student_surname.localeCompare(b.student_surname));
    if (sortBy === 'mastered') list.sort((a, b) => b.topics_mastered - a.topics_mastered);
    if (sortBy === 'struggling') list.sort((a, b) => b.topics_struggling - a.topics_struggling);
    if (sortBy === 'active') list.sort((a, b) => {
      if (!a.last_accessed) return 1;
      if (!b.last_accessed) return -1;
      return new Date(b.last_accessed).getTime() - new Date(a.last_accessed).getTime();
    });
    return list;
  }, [students, search, sortBy]);

  function selectStudent(student: StudentProgressSummary) {
    setSelected(student);
    setView('profile');
    setActiveTab('progress');
    setMarks(null);
    setEvents(null);
    setCompletions(null);
    setAnnouncements(null);
    setSubjectIds(null);
    setInterventions(null);
    setOutcomes(null);
  }

  function backToList() {
    setView('list');
    setSelected(null);
  }

  async function getSubjectIds(studentId: number): Promise<number[]> {
    if (subjectIds !== null) return subjectIds;
    const { data: links } = await supabaseAdmin
      .from('teacher_students')
      .select('subject_id')
      .eq('student_id', studentId);
    const ids = [...new Set((links ?? []).map((r: any) => r.subject_id as number))];
    setSubjectIds(ids);
    return ids;
  }

  async function loadTab(tab: ProfileTab) {
    setActiveTab(tab);
    if (!selected) return;

    if (tab === 'marks' && marks === null) {
      const data = await fetchStudentResults(selected.student_id, session.school_id);
      setMarks(data);
    }

    if (tab === 'homework') {
      const ids = await getSubjectIds(selected.student_id);
      if (events === null) {
        const today = new Date();
        const [evData, compData] = await Promise.all([
          fetchStudentEvents(
            session.school_id,
            selected.student_id,
            selected.grade,
            null, // cohort_id not available in StudentProgressSummary
            ids,
            today.getFullYear(),
            today.getMonth() + 1
          ),
          fetchStudentCompletions(selected.student_id, session.school_id),
        ]);
        setEvents(evData);
        setCompletions(compData);
      }
    }

    if (tab === 'announcements') {
      const ids = await getSubjectIds(selected.student_id);
      if (announcements === null) {
        const data = await fetchStudentAnnouncements(
          session.school_id,
          selected.student_id,
          selected.grade,
          null,
          ids
        );
        setAnnouncements(data);
      }
    }

    if (tab === 'interventions' && interventions === null) {
      const [invs, outs] = await Promise.all([
        getInterventions(selected.student_id),
        getOutcomes(selected.student_id),
      ]);
      setInterventions(invs);
      setOutcomes(outs);
    }
  }

  // ── Render ─────────────────────────────────────────────────

  if (view === 'profile' && selected) {
    return <StudentProfile
      student={selected}
      session={session}
      activeTab={activeTab}
      marks={marks}
      events={events}
      completions={completions}
      announcements={announcements}
      interventions={interventions}
      outcomes={outcomes}
      classHealth={classHealth}
      onBack={backToList}
      onTabChange={loadTab}
    />;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 pb-24 md:pb-8">
      {/* Header */}
      <div className="mb-6">
        <p className="text-[11px] font-black uppercase tracking-[0.22em] text-stone-400 mb-1">LIBRARY</p>
        <h1 className="text-2xl font-black text-[#1C1917]">Students</h1>
        <p className="text-sm text-stone-400 mt-1">Click any student to view their full profile.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
            className="w-5 h-5 border-2 border-stone-200 border-t-stone-700 rounded-full"
          />
        </div>
      ) : students.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Users className="w-10 h-10 text-stone-200 mb-4" />
          <p className="text-sm font-bold text-stone-400">No students linked to your classes yet.</p>
        </div>
      ) : (
        <>
          {/* Summary stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-white rounded-2xl border border-stone-200 p-4">
              <p className="text-2xl font-black text-[#1C1917] leading-none">{students.length}</p>
              <p className="text-[11px] font-bold text-stone-400 mt-1">Total Students</p>
            </div>
            <div className="bg-white rounded-2xl border border-stone-200 p-4">
              <p className="text-2xl font-black text-emerald-600 leading-none">
                {students.reduce((s, st) => s + st.topics_mastered, 0)}
              </p>
              <p className="text-[11px] font-bold text-stone-400 mt-1">Topics Mastered</p>
            </div>
            <div className="bg-white rounded-2xl border border-stone-200 p-4">
              <p className="text-2xl font-black text-amber-600 leading-none">
                {students.filter(st => st.topics_struggling > 0).length}
              </p>
              <p className="text-[11px] font-bold text-stone-400 mt-1">Need Support</p>
            </div>
          </div>

          {/* Search + sort */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search students…"
              className="flex-1 px-4 py-2.5 rounded-xl border border-stone-200 text-sm text-stone-900 placeholder:text-stone-300 focus:outline-none focus:border-[#1C1917] transition-colors"
            />
            <div className="flex gap-1.5 flex-wrap">
              {([
                { key: 'name', label: 'Name' },
                { key: 'mastered', label: 'Mastered ↓' },
                { key: 'struggling', label: 'Struggling ↓' },
                { key: 'active', label: 'Last Active' },
              ] as const).map(s => (
                <button
                  key={s.key}
                  onClick={() => setSortBy(s.key)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] transition-all ${
                    sortBy === s.key
                      ? 'bg-[#1C1917] text-white font-black'
                      : 'bg-white border border-stone-200 text-stone-500 font-bold hover:border-stone-400'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Student rows */}
          <div className="space-y-1.5">
            {filtered.length === 0 ? (
              <p className="text-sm text-stone-300 text-center py-10">No students match your search.</p>
            ) : filtered.map((student, i) => (
              <motion.div
                key={student.student_id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.025, ease: [0.23, 1, 0.32, 1] }}
                onClick={() => selectStudent(student)}
                className="group bg-white rounded-xl border border-stone-200 px-4 py-3 flex items-center gap-4 hover:border-stone-300 hover:shadow-sm cursor-pointer transition-all"
              >
                {/* Avatar */}
                <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center shrink-0">
                  <span className="text-xs font-black text-stone-600">{initials(student)}</span>
                </div>

                {/* Name */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-stone-900 truncate">
                    {student.student_surname}, {student.student_name}
                  </p>
                  <p className="text-[10px] text-stone-400 mt-0.5">{student.student_code}</p>
                </div>

                {/* Grade */}
                <div className="hidden sm:block text-sm text-stone-500 w-20 shrink-0">
                  Gr {student.grade}{student.cohort_name ? ` · ${student.cohort_name}` : ''}
                </div>

                {/* Mastered */}
                <div className="hidden sm:flex items-center gap-1 w-16 shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span className="text-sm font-black text-emerald-600">{student.topics_mastered}</span>
                </div>

                {/* Struggling */}
                <div className="hidden sm:flex items-center gap-1 w-16 shrink-0">
                  {student.topics_struggling > 0 ? (
                    <>
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span className="text-sm font-black text-amber-600">{student.topics_struggling}</span>
                    </>
                  ) : (
                    <span className="text-sm text-stone-300">—</span>
                  )}
                </div>

                {/* Last active */}
                <div className="hidden md:block text-[11px] text-stone-400 w-20 shrink-0 text-right">
                  {student.last_accessed ? timeAgo(student.last_accessed) : <span className="text-stone-300">No activity</span>}
                </div>

                {/* Intervention chips */}
                {(() => {
                  const chip = chips.get(student.student_id);
                  if (!chip) return null;
                  return (
                    <div className="hidden lg:flex items-center gap-1.5 shrink-0">
                      {chip.active > 0 && (
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-100">
                          {chip.active} active
                        </span>
                      )}
                      {chip.completed > 0 && chip.successRate > 0 && (
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                          chip.successRate >= 70
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                            : chip.successRate >= 50
                            ? 'bg-blue-50 text-blue-600 border-blue-100'
                            : 'bg-stone-50 text-stone-500 border-stone-200'
                        }`}>
                          {chip.successRate}%
                        </span>
                      )}
                      {chip.avgGain > 0 && (
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                          +{chip.avgGain}%
                        </span>
                      )}
                    </div>
                  );
                })()}

                <ChevronRight className="w-4 h-4 text-stone-200 group-hover:text-stone-600 transition-colors shrink-0" />
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ── Student Profile View ───────────────────────────────────────

interface ProfileProps {
  student: StudentProgressSummary;
  session: TeacherSession;
  activeTab: ProfileTab;
  marks: StudentResult[] | null;
  events: SchoolEvent[] | null;
  completions: Set<number> | null;
  announcements: Announcement[] | null;
  interventions: Intervention[] | null;
  outcomes: Outcome[] | null;
  classHealth: TeacherSubjectHealth[];
  onBack: () => void;
  onTabChange: (tab: ProfileTab) => void;
}

function StudentProfile({
  student, session, activeTab, marks, events, completions, announcements,
  interventions, outcomes, classHealth,
  onBack, onTabChange,
}: ProfileProps) {
  // ── Comparison strip data ──────────────────────────────────────
  // Build per-subject avg for this student from marks data (available after Marks tab visited)
  // Compare against class avg from classHealth for same subject + grade

  interface ComparisonRow {
    subject:    string;
    studentAvg: number;
    classAvg:   number | null;
    delta:      number | null;   // studentAvg - classAvg
  }

  const comparisonRows: ComparisonRow[] = (() => {
    if (!marks || marks.length === 0) return [];

    // Group marks by subject
    const subjectMap = new Map<string, number[]>();
    for (const m of marks) {
      if (m.mark === null) continue;
      if (!subjectMap.has(m.subject_label)) subjectMap.set(m.subject_label, []);
      subjectMap.get(m.subject_label)!.push((m.mark / m.total) * 100);
    }

    const rows: ComparisonRow[] = [];
    for (const [subject, pcts] of subjectMap) {
      const studentAvg = Math.round(pcts.reduce((s, v) => s + v, 0) / pcts.length);
      const health     = classHealth.find(
        h => h.subject.toLowerCase() === subject.toLowerCase() && h.grade === student.grade
      );
      const classAvg   = health ? health.classAvg : null;
      const delta      = classAvg !== null ? studentAvg - classAvg : null;
      rows.push({ subject, studentAvg, classAvg, delta });
    }

    return rows.sort((a, b) => a.subject.localeCompare(b.subject));
  })();
  const tabs: { key: ProfileTab; label: string; icon: React.ElementType }[] = [
    { key: 'progress',      label: 'Progress',      icon: BookOpen },
    { key: 'marks',         label: 'Marks',          icon: ClipboardList },
    { key: 'homework',      label: 'Homework',       icon: CalendarDays },
    { key: 'announcements', label: 'Announcements',  icon: Megaphone },
    { key: 'interventions', label: 'Coaching',       icon: CheckCircle2 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
      className="max-w-3xl mx-auto px-4 py-6 pb-24 md:pb-8"
    >
      {/* Back */}
      <button
        onClick={onBack}
        className="text-[11px] font-black uppercase tracking-[0.18em] text-stone-400 hover:text-stone-900 transition-colors mb-5 flex items-center gap-1"
      >
        ← Students
      </button>

      {/* Hero card */}
      <div className="bg-[#1C1917] rounded-3xl px-7 py-6 mb-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
              <span className="text-lg font-black text-white">{initials(student)}</span>
            </div>
            <div>
              <p className="text-xl font-black text-white">{student.student_surname}, {student.student_name}</p>
              <p className="text-sm text-stone-400 mt-0.5">
                Grade {student.grade}{student.cohort_name ? ` · ${student.cohort_name}` : ''} · {student.student_code}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'Started',        value: student.topics_started,    color: 'text-white' },
              { label: 'Mastered',       value: student.topics_mastered,   color: 'text-emerald-400' },
              { label: 'Needs Practice', value: student.topics_struggling, color: 'text-amber-400' },
              { label: 'Last Active',    value: timeAgo(student.last_accessed), color: 'text-stone-300' },
            ].map(stat => (
              <div key={stat.label} className="bg-white/10 rounded-2xl px-4 py-3 text-center min-w-20">
                <p className={`text-sm font-black ${stat.color} leading-none`}>{stat.value}</p>
                <p className="text-[10px] text-stone-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Comparison strip — shown once marks data is loaded ── */}
        {comparisonRows.length > 0 && (
          <div className="mt-5 pt-4 border-t border-white/10">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-500 mb-3">vs Class Average</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {comparisonRows.map(row => {
                const deltaPositive = row.delta !== null && row.delta > 0;
                const deltaNegative = row.delta !== null && row.delta < 0;
                const deltaColor = deltaPositive ? 'text-emerald-400' : deltaNegative ? 'text-red-400' : 'text-stone-400';
                const avgColor   = row.studentAvg >= 70 ? 'text-emerald-400'
                                 : row.studentAvg >= 50 ? 'text-amber-400'
                                 : 'text-red-400';
                return (
                  <div key={row.subject} className="bg-white/5 rounded-xl px-3 py-2.5">
                    <p className="text-[10px] font-black text-stone-400 truncate mb-1">{row.subject}</p>
                    <div className="flex items-baseline gap-1.5">
                      <span className={`text-base font-black ${avgColor}`}>{row.studentAvg}%</span>
                      {row.classAvg !== null && (
                        <span className="text-[10px] text-stone-500">vs {row.classAvg}%</span>
                      )}
                    </div>
                    {row.delta !== null && (
                      <p className={`text-[10px] font-black mt-0.5 ${deltaColor}`}>
                        {deltaPositive ? `+${row.delta}` : row.delta} vs class
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 mb-5 bg-stone-100 rounded-2xl p-1">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => onTabChange(t.key)}
            className={`flex-1 flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-[13px] transition-all ${
              activeTab === t.key
                ? 'bg-[#1C1917] text-white font-black shadow-sm'
                : 'text-stone-500 font-bold hover:text-stone-900'
            }`}
          >
            <t.icon className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">{t.label}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18 }}
        >
          {activeTab === 'progress'      && <ProgressTab student={student} />}
          {activeTab === 'marks'         && <MarksTab marks={marks} />}
          {activeTab === 'homework'      && <HomeworkTab events={events} completions={completions} />}
          {activeTab === 'announcements' && <AnnouncementsTab announcements={announcements} />}
          {activeTab === 'interventions' && <InterventionsTab interventions={interventions} outcomes={outcomes} />}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

// ── Tab: Progress ─────────────────────────────────────────────

function ProgressTab({ student }: { student: StudentProgressSummary }) {
  if (student.progress.length === 0) {
    return (
      <EmptyState icon={BookOpen} text="No study activity yet." />
    );
  }

  const groups = groupBySubject(student.progress);

  return (
    <div className="space-y-6">
      {Array.from(groups.entries()).map(([subject, rows]) => (
        <div key={subject}>
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-stone-400 mb-2">{subject}</p>
          <div className="bg-white rounded-2xl border border-stone-200 divide-y divide-stone-100 overflow-hidden">
            {rows.map(row => {
              const mastery = row.mastery_level;
              const dotColor = mastery === 'mastered' ? 'bg-emerald-500' : mastery === 'needs_practice' ? 'bg-amber-500' : 'bg-stone-300';
              return (
                <div key={row.topic} className="flex items-center gap-3 px-4 py-3">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${dotColor}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-stone-900 capitalize">
                      {row.topic.replace(/-/g, ' ')}
                    </p>
                    {row.last_attempt_score && (
                      <p className="text-[10px] text-stone-400 mt-0.5">Score: {row.last_attempt_score}</p>
                    )}
                  </div>
                  {mastery === 'mastered' && (
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 shrink-0">
                      Mastered
                    </span>
                  )}
                  {mastery === 'needs_practice' && (
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 shrink-0">
                      Needs Practice
                    </span>
                  )}
                  {mastery === 'not_started' && (
                    <span className="text-[10px] text-stone-300 shrink-0">Not started</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Tab: Marks ────────────────────────────────────────────────

function MarksTab({ marks }: { marks: StudentResult[] | null }) {
  if (marks === null) {
    return <LoadingSpinner />;
  }
  if (marks.length === 0) {
    return <EmptyState icon={ClipboardList} text="No marks recorded yet." />;
  }

  const groups = groupMarksBySubject(marks);

  return (
    <div className="space-y-6">
      {Array.from(groups.entries()).map(([subject, rows]) => (
        <div key={subject}>
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-stone-400 mb-2">{subject}</p>
          <div className="bg-white rounded-2xl border border-stone-200 divide-y divide-stone-100 overflow-hidden">
            {rows.map(row => {
              const gl = row.mark !== null ? gradeLabel(row.mark, row.total) : null;
              return (
                <div key={row.sheet_id} className="flex items-center gap-3 px-4 py-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-stone-900">{row.sheet_title}</p>
                    {row.sheet_scope && (
                      <p className="text-[10px] text-stone-400 mt-0.5">{row.sheet_scope}</p>
                    )}
                  </div>
                  {row.mark !== null ? (
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-sm font-black text-stone-900">{row.mark} / {row.total}</span>
                      {gl && (
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${gl.bg} ${gl.border} ${gl.color}`}>
                          {gl.label}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-sm text-stone-300">—</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Tab: Homework ─────────────────────────────────────────────

function HomeworkTab({
  events,
  completions,
}: {
  events: SchoolEvent[] | null;
  completions: Set<number> | null;
}) {
  if (events === null || completions === null) {
    return <LoadingSpinner />;
  }

  const homework = events.filter(e => e.event_type === 'homework');

  if (homework.length === 0) {
    return <EmptyState icon={CheckCircle2} text="No homework assigned this month." />;
  }

  const today = new Date().toISOString().split('T')[0];
  const pending = homework.filter(e => e.event_date >= today && !completions.has(e.id));
  const completed = homework.filter(e => completions.has(e.id));

  return (
    <div className="space-y-5">
      {pending.length > 0 && (
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-stone-400 mb-2">Pending</p>
          <div className="bg-white rounded-2xl border border-stone-200 divide-y divide-stone-100 overflow-hidden">
            {pending.map(e => (
              <div key={e.id} className="flex items-center gap-3 px-4 py-3">
                <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-stone-900">{e.title}</p>
                  <p className="text-[11px] text-stone-400 mt-0.5">Due {e.event_date}</p>
                </div>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 shrink-0">
                  Pending
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      {completed.length > 0 && (
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-stone-400 mb-2">Completed</p>
          <div className="bg-white rounded-2xl border border-stone-200 divide-y divide-stone-100 overflow-hidden">
            {completed.map(e => (
              <div key={e.id} className="flex items-center gap-3 px-4 py-3">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-stone-400">{e.title}</p>
                  <p className="text-[11px] text-stone-300 mt-0.5">{e.event_date}</p>
                </div>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 shrink-0">
                  Done
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Tab: Announcements ────────────────────────────────────────

function AnnouncementsTab({ announcements }: { announcements: Announcement[] | null }) {
  if (announcements === null) {
    return <LoadingSpinner />;
  }
  if (announcements.length === 0) {
    return <EmptyState icon={Megaphone} text="No announcements for this student." />;
  }

  return (
    <div className="space-y-3">
      {announcements.map(a => (
        <div key={a.id} className="bg-white rounded-2xl border border-stone-200 px-5 py-4">
          <div className="flex items-start gap-2">
            {a.pinned && <Pin className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />}
            <p className="text-sm font-black text-stone-900">{a.title}</p>
          </div>
          {a.body && (
            <p className="text-[13px] text-stone-500 leading-relaxed mt-1 line-clamp-3">{a.body}</p>
          )}
          <p className="text-[10px] text-stone-300 mt-2">{timeAgo(a.created_at)}</p>
        </div>
      ))}
    </div>
  );
}

// ── Tab: Interventions ────────────────────────────────────────

function InterventionsTab({
  interventions, outcomes,
}: {
  interventions: Intervention[] | null;
  outcomes: Outcome[] | null;
}) {
  if (interventions === null || outcomes === null) return <LoadingSpinner />;

  const completed = interventions.filter(i => i.status === 'completed');
  const active    = interventions.filter(i => i.status === 'recommended' || i.status === 'started');
  const impact    = computeInterventionImpact(completed, outcomes);

  const TYPE_LABEL: Record<string, string> = {
    past_paper:      'Past Paper Practice',
    library_topic:   'Library Study',
    revision:        'Revision Session',
    resource_review: 'Resource Review',
  };
  const REASON_LABEL: Record<string, string> = {
    high_risk:        'High Risk',
    declining_trend:  'Declining Trend',
    exam_soon:        'Exam Soon',
    aps_gap:          'APS Gap',
    below_pass:       'Below Pass',
  };

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  if (interventions.length === 0) {
    return (
      <EmptyState
        icon={CheckCircle2}
        text="No interventions have been created for this learner yet."
      />
    );
  }

  return (
    <div className="space-y-4">

      {/* ── Impact summary card ─────────────────────────── */}
      {completed.length > 0 && (
        <div className="bg-white border border-stone-200 rounded-2xl p-5">
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-stone-400 mb-3">Intervention Impact</p>
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: 'Completed', value: String(impact.totalCompleted),                          color: 'text-brand-dark', bg: 'bg-stone-50' },
              { label: 'Success',   value: `${impact.successRate}%`,                               color: impact.successRate >= 70 ? 'text-emerald-600' : impact.successRate >= 50 ? 'text-amber-600' : 'text-red-500', bg: impact.successRate >= 70 ? 'bg-emerald-50' : impact.successRate >= 50 ? 'bg-amber-50' : 'bg-stone-50' },
              { label: 'Avg Gain',  value: impact.avgImprovement > 0 ? `+${impact.avgImprovement}%` : '—', color: impact.avgImprovement > 0 ? 'text-blue-600' : 'text-stone-400', bg: impact.avgImprovement > 0 ? 'bg-blue-50' : 'bg-stone-50' },
              { label: 'Active',    value: String(active.length),                                  color: active.length > 0 ? 'text-amber-600' : 'text-stone-400', bg: active.length > 0 ? 'bg-amber-50' : 'bg-stone-50' },
            ].map(s => (
              <div key={s.label} className={`${s.bg} rounded-xl p-2.5 text-center`}>
                <p className={`text-base font-black ${s.color}`}>{s.value}</p>
                <p className="text-[9px] font-bold text-stone-400 uppercase tracking-wider mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
          {impact.bestType && impact.bestTypeGain > 0 && (
            <div className="mt-3 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">
              <p className="text-[11px] text-amber-800">
                <span className="font-black">Most effective:</span>{' '}
                {TYPE_LABEL[impact.bestType] ?? impact.bestType} — avg +{impact.bestTypeGain}%
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── Active interventions ─────────────────────────── */}
      {active.length > 0 && (
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-stone-400 mb-2">Active</p>
          <div className="space-y-2">
            {active.map(inv => (
              <div key={inv.id} className={`bg-white border rounded-2xl px-4 py-3.5 ${
                inv.reason === 'exam_soon' || inv.reason === 'below_pass'
                  ? 'border-red-200 bg-red-50'
                  : 'border-amber-200 bg-amber-50'
              }`}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-black text-stone-900">{TYPE_LABEL[inv.type] ?? inv.type}</p>
                    <p className="text-[11px] text-stone-500 mt-0.5">{inv.subject}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      inv.reason === 'exam_soon' || inv.reason === 'below_pass'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {REASON_LABEL[inv.reason] ?? inv.reason}
                    </span>
                    <p className={`text-[10px] font-bold mt-1 ${
                      inv.status === 'started' ? 'text-blue-500' : 'text-stone-400'
                    }`}>
                      {inv.status === 'started' ? 'In Progress' : 'Recommended'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-2 text-[10px] text-stone-400">
                  <span>Created {formatDate(inv.createdAt)}</span>
                  {inv.startedAt && <span>· Started {formatDate(inv.startedAt)}</span>}
                  <span>· Subject avg {inv.previousAvg}%</span>
                </div>
                {inv.rationale && (
                  <p className="text-[10px] text-stone-400 italic mt-1.5 border-t border-stone-100 pt-1.5">
                    {inv.rationale}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Completed interventions ──────────────────────── */}
      {completed.length > 0 && (
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-stone-400 mb-2">Completed</p>
          <div className="space-y-2">
            {completed.map(inv => {
              const outcome = outcomes.find(o => o.interventionId === inv.id);
              return (
                <div key={inv.id} className={`bg-white border rounded-2xl px-4 py-3.5 ${
                  outcome?.result === 'improved' ? 'border-emerald-200' :
                  outcome?.result === 'declined' ? 'border-red-200' :
                  'border-stone-200'
                }`}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm ${
                          outcome?.result === 'improved' ? 'text-emerald-500' :
                          outcome?.result === 'declined' ? 'text-red-400' : 'text-stone-300'
                        }`}>
                          {outcome?.result === 'improved' ? '✓' : outcome?.result === 'declined' ? '↓' : '→'}
                        </span>
                        <p className="text-sm font-black text-stone-900">{TYPE_LABEL[inv.type] ?? inv.type}</p>
                      </div>
                      <p className="text-[11px] text-stone-500 mt-0.5">{inv.subject}</p>
                    </div>
                    {outcome && (
                      <div className="text-right shrink-0">
                        <p className={`text-sm font-black ${
                          outcome.result === 'improved' ? 'text-emerald-600' :
                          outcome.result === 'declined' ? 'text-red-500' : 'text-stone-400'
                        }`}>
                          {outcome.improvement > 0 ? `+${outcome.improvement}%` : `${outcome.improvement}%`}
                        </p>
                        <p className="text-[10px] text-stone-400">
                          {outcome.previousAvg}% → {outcome.newAvg}%
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Outcome detail */}
                  {outcome && (
                    <div className={`mt-3 rounded-xl px-3 py-2 ${
                      outcome.result === 'improved' ? 'bg-emerald-50' :
                      outcome.result === 'declined' ? 'bg-red-50' : 'bg-stone-50'
                    }`}>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-stone-500">Latest assessment</span>
                        <span className={`font-black ${
                          outcome.latestMark >= 70 ? 'text-emerald-600' :
                          outcome.latestMark >= 50 ? 'text-amber-600' : 'text-red-500'
                        }`}>{outcome.latestMark}%</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] mt-1">
                        <span className="text-stone-500">Subject average</span>
                        <span className="font-black text-stone-700">{outcome.previousAvg}% → {outcome.newAvg}%</span>
                      </div>
                    </div>
                  )}

                  {!outcome && (
                    <p className="text-[10px] text-stone-300 mt-2">No outcome data yet — awaiting new assessment</p>
                  )}

                  <p className="text-[10px] text-stone-300 mt-2">
                    Completed {inv.completedAt ? formatDate(inv.completedAt) : '—'}
                  </p>
                  {inv.rationale && (
                    <p className="text-[10px] text-stone-400 italic mt-1.5 border-t border-stone-100 pt-1.5">
                      {inv.rationale}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}

// ── Shared UI ─────────────────────────────────────────────────

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
        className="w-5 h-5 border-2 border-stone-200 border-t-stone-700 rounded-full"
      />
    </div>
  );
}

function EmptyState({ icon: Icon, text }: { icon: React.ElementType; text: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Icon className="w-8 h-8 text-stone-200 mb-3" />
      <p className="text-sm font-bold text-stone-300">{text}</p>
    </div>
  );
}
