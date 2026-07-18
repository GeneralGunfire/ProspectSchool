import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronRight, BookOpen, AlertTriangle,
  CheckCircle2, Users, ClipboardList, CalendarDays,
  Megaphone, Pin, Phone, Trash2, Award, CalendarCheck,
  ClipboardCheck, TrendingUp,
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
  fetchParentContacts, logParentContact, deleteParentContact,
  fetchLastContactDates, lastContactLabel, daysSince,
  CONTACT_METHOD_LABELS,
  type ParentContact, type ContactMethod,
} from '../../../lib/parentContacts';
import { fetchStudentBehaviour, type BehaviourEntry } from '../../../lib/behaviour';
import { fetchStudentAttendanceHistory, type AttendanceRecord, type AttendanceStatus } from '../../../lib/homeroom';
import {
  getInterventions, getOutcomes, computeInterventionImpact,
  type Intervention, type Outcome,
} from '../../../lib/interventions';
import RecordOutcomeModal, { type OutcomeTarget } from './RecordOutcomeModal';

const ease = [0.23, 1, 0.32, 1] as [number, number, number, number];

// ── Types ─────────────────────────────────────────────────────

type View = 'list' | 'profile';
type ProfileTab = 'progress' | 'marks' | 'homework' | 'behaviour' | 'attendance' | 'announcements' | 'interventions' | 'contacts';

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
  onOpenTopicTest?: (topicTestId: number) => void;
}

export default function StudentProgressPage({ session, onOpenTopicTest }: StudentProgressPageProps) {
  // List state
  const [view, setView] = useState<View>('list');
  const [students, setStudents] = useState<StudentProgressSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<StudentProgressSummary | null>(null);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'mastered' | 'struggling' | 'active'>('name');
  const [filterCohort, setFilterCohort] = useState<string>('');
  const [imgLoaded, setImgLoaded] = useState(false);

  // Profile state
  const [activeTab, setActiveTab] = useState<ProfileTab>('progress');
  const [marks, setMarks] = useState<StudentResult[] | null>(null);
  const [events, setEvents] = useState<SchoolEvent[] | null>(null);
  const [completions, setCompletions] = useState<Set<number> | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[] | null>(null);
  const [subjectIds, setSubjectIds] = useState<number[] | null>(null);
  const [interventions, setInterventions] = useState<Intervention[] | null>(null);
  const [outcomes, setOutcomes] = useState<Outcome[] | null>(null);
  const [contacts, setContacts] = useState<ParentContact[] | null>(null);
  const [behaviour, setBehaviour] = useState<BehaviourEntry[] | null>(null);
  const [attendance, setAttendance] = useState<AttendanceRecord[] | null>(null);
  const [chips,        setChips]        = useState<Map<number, StudentInterventionChip>>(new Map());
  const [classHealth,  setClassHealth]  = useState<TeacherSubjectHealth[]>([]);
  const [lastContacts, setLastContacts] = useState<Map<number, string>>(new Map());

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
      if (data.length > 0) {
        fetchLastContactDates(
          session.teacher_id,
          session.school_id,
          data.map(s => s.student_id),
        ).then(setLastContacts);
      }
    });
  }, []);

  // Class switcher — unique cohort names with a per-class headcount
  const cohortOptions = useMemo(() => {
    return [...new Set(students.map(s => s.cohort_name).filter(Boolean) as string[])].sort();
  }, [students]);

  const cohortCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const s of students) {
      if (!s.cohort_name) continue;
      counts.set(s.cohort_name, (counts.get(s.cohort_name) ?? 0) + 1);
    }
    return counts;
  }, [students]);

  // Filtered + sorted list
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    const list = students.filter(s => {
      if (filterCohort && s.cohort_name !== filterCohort) return false;
      return `${s.student_surname} ${s.student_name} ${s.student_code}`.toLowerCase().includes(q);
    });
    if (sortBy === 'name') list.sort((a, b) => a.student_surname.localeCompare(b.student_surname));
    if (sortBy === 'mastered') list.sort((a, b) => b.topics_mastered - a.topics_mastered);
    if (sortBy === 'struggling') list.sort((a, b) => b.topics_struggling - a.topics_struggling);
    if (sortBy === 'active') list.sort((a, b) => {
      if (!a.last_accessed) return 1;
      if (!b.last_accessed) return -1;
      return new Date(b.last_accessed).getTime() - new Date(a.last_accessed).getTime();
    });
    return list;
  }, [students, search, sortBy, filterCohort]);

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
    setContacts(null);
    setBehaviour(null);
    setAttendance(null);
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

    if (tab === 'contacts' && contacts === null) {
      const data = await fetchParentContacts(selected.student_id, session.teacher_id);
      setContacts(data);
    }

    if (tab === 'behaviour' && behaviour === null) {
      const data = await fetchStudentBehaviour(selected.student_id);
      setBehaviour(data);
    }

    if (tab === 'attendance' && attendance === null) {
      const data = await fetchStudentAttendanceHistory(selected.student_id);
      setAttendance(data);
    }
  }

  // ── Render ─────────────────────────────────────────────────

  if (view === 'profile' && selected) {
    return <StudentProfile
      student={selected}
      session={session}
      onOpenTopicTest={onOpenTopicTest}
      activeTab={activeTab}
      marks={marks}
      events={events}
      completions={completions}
      announcements={announcements}
      interventions={interventions}
      outcomes={outcomes}
      classHealth={classHealth}
      contacts={contacts}
      behaviour={behaviour}
      attendance={attendance}
      onBack={backToList}
      onTabChange={loadTab}
      onContactsChange={(updated) => {
        setContacts(updated);
        if (updated.length > 0) {
          setLastContacts(prev => new Map(prev).set(selected.student_id, updated[0].createdAt));
        }
      }}
      onOutcomeRecorded={(outcome) => {
        setOutcomes(prev => {
          const withoutThis = (prev ?? []).filter(o => o.interventionId !== outcome.interventionId);
          return [outcome, ...withoutThis];
        });
      }}
    />;
  }

  return (
    <div className="student-home min-h-full pb-16">

      {/* ═══ Hero — full-width crested banner ═════════════════════ */}
      <div className="relative overflow-hidden bg-brand-dark border-b border-brand-border grain-surface flex flex-col justify-end min-h-[220px] sm:min-h-[260px] lg:min-h-[280px]">
        <div className="absolute inset-0 pointer-events-none">
          <motion.img src="/images/nizamiye-library.png" alt=""
            onLoad={() => setImgLoaded(true)}
            initial={{ opacity: 0 }} animate={{ opacity: imgLoaded ? 0.62 : 0 }}
            transition={{ duration: 0.6, ease }}
            className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(100deg, rgba(21,23,28,0.82) 0%, rgba(21,23,28,0.62) 35%, rgba(21,23,28,0.3) 62%, rgba(21,23,28,0.66) 100%)' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(21,23,28,0.05) 0%, transparent 35%, rgba(21,23,28,0.75) 100%)' }} />
        </div>
        <div className="absolute -bottom-32 -left-24 w-[24rem] h-[24rem] rounded-full blur-3xl opacity-[0.08] pointer-events-none" style={{ background: 'radial-gradient(circle, var(--color-accent), transparent 70%)' }} />
        <div className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-8 sm:pt-11 pb-8 sm:pb-10 w-full">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }}>
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-white/45">Library</p>
            <h1 className="font-display font-extrabold text-white text-[28px] sm:text-[36px] mt-2 leading-[1.1]" style={{ letterSpacing: '-0.02em', textShadow: '0 2px 20px rgba(0,0,0,0.35)' }}>Students</h1>
            <p className="text-[13px] text-white/60 mt-2.5 font-medium">Click any student to view their full profile.</p>
          </motion.div>
        </div>
      </div>

      {/* ═══ Body ═══════════════════════════════════════════════ */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 relative z-10 space-y-5 sm:space-y-6 pt-6 sm:pt-8">

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
            className="w-5 h-5 border-2 border-brand-border border-t-stone-700 rounded-full"
          />
        </div>
      ) : students.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Users className="w-10 h-10 text-stone-200 mb-4" />
          <p className="text-sm font-bold text-stone-500">No students linked to your classes yet.</p>
        </div>
      ) : (
        <>
          {/* Summary stats */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
            <div className="paper-card rounded p-4">
              <p className="text-2xl font-black text-brand-dark leading-none">{students.length}</p>
              <p className="text-[11px] font-bold text-stone-500 mt-1">Total Students</p>
            </div>
            <div className="paper-card rounded p-4">
              <p className="text-2xl font-black text-emerald-600 leading-none">
                {students.reduce((s, st) => s + st.topics_mastered, 0)}
              </p>
              <p className="text-[11px] font-bold text-stone-500 mt-1">Topics Mastered</p>
            </div>
            <div className="paper-card rounded p-4">
              <p className="text-2xl font-black text-amber-600 leading-none">
                {students.filter(st => st.topics_struggling > 0).length}
              </p>
              <p className="text-[11px] font-bold text-stone-500 mt-1">Need Support</p>
            </div>
          </div>

          {/* Class switcher — pill tabs, e.g. 10A / 10B */}
          {cohortOptions.length > 0 && (
            <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
              <button
                onClick={() => setFilterCohort('')}
                className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-bold transition-all duration-150 ${
                  filterCohort === ''
                    ? 'bg-brand-dark text-white shadow-sm'
                    : 'bg-white border border-brand-border text-stone-600 hover:border-stone-400'
                }`}
              >
                All Classes
                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${filterCohort === '' ? 'bg-white/15' : 'bg-brand-bg text-stone-500'}`}>
                  {students.length}
                </span>
              </button>
              {cohortOptions.map(c => {
                const active = filterCohort === c;
                return (
                  <button
                    key={c}
                    onClick={() => setFilterCohort(active ? '' : c)}
                    className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-bold transition-all duration-150 ${
                      active
                        ? 'bg-brand-dark text-white shadow-sm'
                        : 'bg-white border border-brand-border text-stone-600 hover:border-stone-400'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-accent' : 'bg-stone-300'}`} />
                    {c}
                    <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${active ? 'bg-white/15' : 'bg-brand-bg text-stone-500'}`}>
                      {cohortCounts.get(c) ?? 0}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Search + sort */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search students…"
              className="flex-1 px-4 py-2.5 rounded border border-brand-border bg-white text-sm font-medium text-brand-dark placeholder:text-stone-500 focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-accent/30 transition-all"
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
                      ? 'bg-brand-dark text-white font-black'
                      : 'bg-white border border-brand-border text-stone-600 font-bold hover:border-stone-400'
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
              <p className="text-sm text-stone-500 text-center py-10">No students match your search.</p>
            ) : filtered.map((student, i) => (
              <motion.div
                key={student.student_id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.025, ease: [0.23, 1, 0.32, 1] }}
                onClick={() => selectStudent(student)}
                className="group bg-white rounded border border-brand-border px-4 py-3 flex items-center gap-4 hover:border-stone-300 hover:shadow-sm cursor-pointer transition-all"
              >
                {/* Avatar */}
                <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center shrink-0">
                  <span className="text-xs font-black text-stone-600">{initials(student)}</span>
                </div>

                {/* Name */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-brand-dark truncate">
                    {student.student_surname}, {student.student_name}
                  </p>
                  <p className="text-[10px] text-stone-500 mt-0.5">{student.student_code}</p>
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
                    <span className="text-sm text-stone-500">—</span>
                  )}
                </div>

                {/* Last active */}
                <div className="hidden md:block text-[11px] text-stone-500 w-20 shrink-0 text-right">
                  {student.last_accessed ? timeAgo(student.last_accessed) : <span className="text-stone-500">No activity</span>}
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
                            : 'bg-stone-50 text-stone-500 border-brand-border'
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
    </div>
  );
}

// ── Student Profile View ───────────────────────────────────────

interface ProfileProps {
  student: StudentProgressSummary;
  session: TeacherSession;
  onOpenTopicTest?: (topicTestId: number) => void;
  activeTab: ProfileTab;
  marks: StudentResult[] | null;
  events: SchoolEvent[] | null;
  completions: Set<number> | null;
  announcements: Announcement[] | null;
  interventions: Intervention[] | null;
  outcomes: Outcome[] | null;
  classHealth: TeacherSubjectHealth[];
  contacts: ParentContact[] | null;
  behaviour: BehaviourEntry[] | null;
  attendance: AttendanceRecord[] | null;
  onBack: () => void;
  onTabChange: (tab: ProfileTab) => void;
  onContactsChange: (updated: ParentContact[]) => void;
  onOutcomeRecorded: (outcome: Outcome) => void;
}

function StudentProfile({
  student, session, onOpenTopicTest, activeTab, marks, events, completions, announcements,
  interventions, outcomes, classHealth, contacts, behaviour, attendance,
  onBack, onTabChange, onContactsChange, onOutcomeRecorded,
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
    { key: 'behaviour',     label: 'Behaviour',      icon: Award },
    { key: 'attendance',    label: 'Attendance',     icon: CalendarCheck },
    { key: 'announcements', label: 'Announcements',  icon: Megaphone },
    { key: 'interventions', label: 'Coaching',       icon: CheckCircle2 },
    { key: 'contacts',      label: 'Contacts',       icon: Phone },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
      className="max-w-3xl mx-auto px-4 py-6 sm:p-6 md:p-8"
    >
      {/* Back */}
      <button
        onClick={onBack}
        className="text-[11px] font-black uppercase tracking-[0.18em] text-stone-500 hover:text-brand-dark transition-colors mb-5 flex items-center gap-1"
      >
        ← Students
      </button>

      {/* Hero card */}
      <div className="bg-brand-dark rounded-3xl px-7 py-6 mb-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
              <span className="text-lg font-black text-white">{initials(student)}</span>
            </div>
            <div>
              <p className="text-xl font-black text-white">{student.student_surname}, {student.student_name}</p>
              <p className="text-sm text-stone-500 mt-0.5">
                Grade {student.grade}{student.cohort_name ? ` · ${student.cohort_name}` : ''} · {student.student_code}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'Started',        value: student.topics_started,    color: 'text-white' },
              { label: 'Mastered',       value: student.topics_mastered,   color: 'text-emerald-400' },
              { label: 'Needs Practice', value: student.topics_struggling, color: 'text-amber-400' },
              { label: 'Last Active',    value: timeAgo(student.last_accessed), color: 'text-stone-500' },
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
                const deltaColor = deltaPositive ? 'text-emerald-400' : deltaNegative ? 'text-red-400' : 'text-stone-500';
                const avgColor   = row.studentAvg >= 70 ? 'text-emerald-400'
                                 : row.studentAvg >= 50 ? 'text-amber-400'
                                 : 'text-red-400';
                return (
                  <div key={row.subject} className="bg-white/5 rounded px-3 py-2.5">
                    <p className="text-[10px] font-black text-stone-500 truncate mb-1">{row.subject}</p>
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
      <div className="flex gap-1 mb-5 bg-stone-100 rounded-2xl p-1 overflow-x-auto">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => onTabChange(t.key)}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded text-[13px] transition-all shrink-0 ${
              activeTab === t.key
                ? 'bg-brand-dark text-white font-black shadow-sm'
                : 'text-stone-500 font-bold hover:text-brand-dark'
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
          {activeTab === 'progress'      && <ProgressTab student={student} teacherId={session.teacher_id} onOpenTopicTest={onOpenTopicTest} />}
          {activeTab === 'marks'         && <MarksTab marks={marks} />}
          {activeTab === 'homework'      && <HomeworkTab events={events} completions={completions} />}
          {activeTab === 'behaviour'     && <BehaviourTab entries={behaviour} />}
          {activeTab === 'attendance'    && <AttendanceTab records={attendance} />}
          {activeTab === 'announcements' && <AnnouncementsTab announcements={announcements} />}
          {activeTab === 'interventions' && (
            <InterventionsTab
              interventions={interventions}
              outcomes={outcomes}
              session={session}
              studentId={student.student_id}
              studentLabel={`${student.student_surname}, ${student.student_name}`}
              onOutcomeRecorded={onOutcomeRecorded}
            />
          )}
          {activeTab === 'contacts'      && (
            <ContactsTab
              contacts={contacts}
              student={student}
              session={session}
              onContactsChange={onContactsChange}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

// ── Tab: Progress ─────────────────────────────────────────────

function ProgressTab({
  student, teacherId, onOpenTopicTest,
}: {
  student: StudentProgressSummary;
  teacherId: number;
  onOpenTopicTest?: (topicTestId: number) => void;
}) {
  const hasStudyLibrary = student.progress.length > 0;
  const groups = hasStudyLibrary ? groupBySubject(student.progress) : new Map<string, StudyProgress[]>();

  return (
    <div className="space-y-8">

      {!hasStudyLibrary ? (
        <EmptyState icon={BookOpen} text="No study activity yet." />
      ) : (
        <div className="space-y-6">
          {Array.from(groups.entries()).map(([subject, rows]) => (
            <div key={subject}>
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-stone-500 mb-2">{subject}</p>
              <div className="paper-card rounded divide-y divide-stone-100 overflow-hidden">
                {rows.map(row => {
                  const mastery = row.mastery_level;
                  const dotColor = mastery === 'mastered' ? 'bg-emerald-500' : mastery === 'needs_practice' ? 'bg-amber-500' : 'bg-stone-300';
                  return (
                    <div key={row.topic} className="flex items-center gap-3 px-4 py-3">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${dotColor}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-brand-dark capitalize">
                          {row.topic.replace(/-/g, ' ')}
                        </p>
                        {row.last_attempt_score && (
                          <p className="text-[10px] text-stone-500 mt-0.5">Score: {row.last_attempt_score}</p>
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
                        <span className="text-[10px] text-stone-500 shrink-0">Not started</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Tab: Marks ────────────────────────────────────────────────

// Compact inline trend chart — no charting library in this codebase, so a
// small hand-rolled SVG line matches the existing hand-rolled progress-bar
// style used elsewhere on this page rather than pulling in a new dependency.
function MarkTrendChart({ rows }: { rows: StudentResult[] }) {
  const points = rows
    .filter(r => r.mark !== null)
    .map(r => ({ pct: Math.round((r.mark! / r.total) * 100), date: r.marked_at ?? r.created_at, title: r.sheet_title }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (points.length < 2) return null;

  const w = 100, h = 36, pad = 4;
  const stepX = (w - pad * 2) / (points.length - 1);
  const toY = (pct: number) => h - pad - (pct / 100) * (h - pad * 2);
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${pad + i * stepX} ${toY(p.pct)}`).join(' ');
  const last = points[points.length - 1];
  const trendUp = points.length >= 2 && last.pct >= points[0].pct;

  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-stone-100 bg-stone-50/60">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-24 h-9 shrink-0" preserveAspectRatio="none">
        <path d={path} fill="none" stroke={trendUp ? '#059669' : '#dc2626'} strokeWidth="2" vectorEffect="non-scaling-stroke" />
        {points.map((p, i) => (
          <circle key={i} cx={pad + i * stepX} cy={toY(p.pct)} r="1.6" fill={trendUp ? '#059669' : '#dc2626'} />
        ))}
      </svg>
      <div className="min-w-0">
        <p className="text-[11px] font-black text-stone-700">
          Trend: <span className={trendUp ? 'text-emerald-600' : 'text-red-600'}>{last.pct}%</span> most recent
        </p>
        <p className="text-[10px] text-stone-400 truncate">{points.length} marked assessments</p>
      </div>
    </div>
  );
}

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
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-stone-500 mb-2">{subject}</p>
          <div className="paper-card rounded divide-y divide-stone-100 overflow-hidden">
            <MarkTrendChart rows={rows} />
            {rows.map(row => {
              const gl = row.mark !== null ? gradeLabel(row.mark, row.total) : null;
              return (
                <div key={row.sheet_id} className="flex items-center gap-3 px-4 py-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-brand-dark">{row.sheet_title}</p>
                    {row.sheet_scope && (
                      <p className="text-[10px] text-stone-500 mt-0.5">{row.sheet_scope}</p>
                    )}
                  </div>
                  {row.mark !== null ? (
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-sm font-black text-brand-dark">{row.mark} / {row.total}</span>
                      {gl && (
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${gl.bg} ${gl.border} ${gl.color}`}>
                          {gl.label}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-sm text-stone-500">—</span>
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
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-stone-500 mb-2">Pending</p>
          <div className="paper-card rounded divide-y divide-stone-100 overflow-hidden">
            {pending.map(e => (
              <div key={e.id} className="flex items-center gap-3 px-4 py-3">
                <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-brand-dark">{e.title}</p>
                  <p className="text-[11px] text-stone-500 mt-0.5">Due {e.event_date}</p>
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
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-stone-500 mb-2">Completed</p>
          <div className="paper-card rounded divide-y divide-stone-100 overflow-hidden">
            {completed.map(e => (
              <div key={e.id} className="flex items-center gap-3 px-4 py-3">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-stone-500">{e.title}</p>
                  <p className="text-[11px] text-stone-500 mt-0.5">{e.event_date}</p>
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

// ── Tab: Behaviour ────────────────────────────────────────────

function BehaviourTab({ entries }: { entries: BehaviourEntry[] | null }) {
  if (entries === null) return <LoadingSpinner />;
  if (entries.length === 0) return <EmptyState icon={Award} text="No behaviour entries recorded yet." />;

  const meritPoints   = entries.filter(e => e.type === 'merit').reduce((s, e) => s + e.points, 0);
  const demeritPoints = entries.filter(e => e.type === 'demerit').reduce((s, e) => s + e.points, 0);
  const net = meritPoints - demeritPoints;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-3">
        <div className="paper-card rounded p-4 text-center">
          <p className="text-2xl font-black text-emerald-600">{meritPoints}</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-stone-500 mt-1">Merits</p>
        </div>
        <div className="paper-card rounded p-4 text-center">
          <p className={`text-2xl font-black ${demeritPoints > 0 ? 'text-red-600' : 'text-stone-300'}`}>{demeritPoints}</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-stone-500 mt-1">Demerits</p>
        </div>
        <div className="paper-card rounded p-4 text-center">
          <p className={`text-2xl font-black ${net >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{net > 0 ? `+${net}` : net}</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-stone-500 mt-1">Net</p>
        </div>
      </div>

      <div className="paper-card rounded divide-y divide-stone-100 overflow-hidden">
        {entries.map(entry => (
          <div key={entry.id} className="flex items-start gap-3 px-4 py-3">
            <span className={`text-xs font-black px-2 py-0.5 rounded-full shrink-0 ${
              entry.type === 'merit' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {entry.type === 'merit' ? '+' : '-'}{entry.points}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-brand-dark">{entry.category}</p>
              {entry.reason && <p className="text-[12px] text-stone-500 mt-0.5">{entry.reason}</p>}
              {entry.note && <p className="text-[12px] text-stone-400 mt-0.5 italic">{entry.note}</p>}
              <p className="text-[10px] text-stone-400 mt-1">
                {new Date(entry.created_at).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}
                {entry.teacher_name && ` · ${entry.teacher_name} ${entry.teacher_surname ?? ''}`.trimEnd()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Tab: Attendance ───────────────────────────────────────────

const ATTENDANCE_META: Record<AttendanceStatus, { label: string; color: string; bg: string; border: string }> = {
  present:        { label: 'Present',       color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  late:           { label: 'Late',          color: 'text-amber-700',   bg: 'bg-amber-50',   border: 'border-amber-200' },
  absent:         { label: 'Absent',        color: 'text-red-700',     bg: 'bg-red-50',     border: 'border-red-200' },
  excused:        { label: 'Excused',       color: 'text-blue-700',    bg: 'bg-blue-50',    border: 'border-blue-200' },
  non_school_day: { label: 'Non-School Day', color: 'text-stone-500',  bg: 'bg-stone-50',   border: 'border-stone-200' },
};

function AttendanceTab({ records }: { records: AttendanceRecord[] | null }) {
  if (records === null) return <LoadingSpinner />;
  if (records.length === 0) return <EmptyState icon={CalendarCheck} text="No attendance history recorded yet." />;

  const countable = records.filter(r => r.status !== 'non_school_day');
  const presentCount = countable.filter(r => r.status === 'present' || r.status === 'late').length;
  const rate = countable.length > 0 ? Math.round((presentCount / countable.length) * 100) : null;

  return (
    <div className="space-y-5">
      {rate !== null && (
        <div className="paper-card rounded p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[11px] font-black uppercase tracking-widest text-stone-500">Attendance Rate</p>
            <p className={`text-lg font-black ${rate >= 90 ? 'text-emerald-600' : rate >= 75 ? 'text-amber-600' : 'text-red-600'}`}>{rate}%</p>
          </div>
          <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${rate >= 90 ? 'bg-emerald-500' : rate >= 75 ? 'bg-amber-500' : 'bg-red-500'}`}
              style={{ width: `${rate}%` }}
            />
          </div>
          <p className="text-[11px] text-stone-500 mt-2">Based on the last {countable.length} school day{countable.length === 1 ? '' : 's'}.</p>
        </div>
      )}

      <div className="paper-card rounded divide-y divide-stone-100 overflow-hidden">
        {records.map(record => {
          const meta = ATTENDANCE_META[record.status];
          return (
            <div key={`${record.student_id}-${record.date}`} className="flex items-center gap-3 px-4 py-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-brand-dark">
                  {new Date(record.date).toLocaleDateString('en-ZA', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
                {record.note && <p className="text-[12px] text-stone-500 mt-0.5">{record.note}</p>}
              </div>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border shrink-0 ${meta.bg} ${meta.border} ${meta.color}`}>
                {meta.label}
              </span>
            </div>
          );
        })}
      </div>
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
        <div key={a.id} className="paper-card rounded px-5 py-4">
          <div className="flex items-start gap-2">
            {a.pinned && <Pin className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />}
            <p className="text-sm font-black text-brand-dark">{a.title}</p>
          </div>
          {a.body && (
            <p className="text-[13px] text-stone-500 leading-relaxed mt-1 line-clamp-3">{a.body}</p>
          )}
          <p className="text-[10px] text-stone-500 mt-2">{timeAgo(a.created_at)}</p>
        </div>
      ))}
    </div>
  );
}

// ── Tab: Interventions ────────────────────────────────────────

function InterventionsTab({
  interventions, outcomes, session, studentId, studentLabel, onOutcomeRecorded,
}: {
  interventions: Intervention[] | null;
  outcomes: Outcome[] | null;
  session: TeacherSession;
  studentId: number;
  studentLabel: string;
  onOutcomeRecorded: (outcome: Outcome) => void;
}) {
  const [outcomeTarget, setOutcomeTarget] = useState<OutcomeTarget | null>(null);

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
        <div className="paper-card rounded p-5">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-3.5 h-3.5 text-stone-500" />
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-stone-500">Intervention Impact</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { label: 'Completed', value: String(impact.totalCompleted),                          color: 'text-brand-dark', bg: 'bg-stone-50' },
              { label: 'Success',   value: `${impact.successRate}%`,                               color: impact.successRate >= 70 ? 'text-emerald-600' : impact.successRate >= 50 ? 'text-amber-600' : 'text-red-500', bg: impact.successRate >= 70 ? 'bg-emerald-50' : impact.successRate >= 50 ? 'bg-amber-50' : 'bg-stone-50' },
              { label: 'Avg Gain',  value: impact.avgImprovement > 0 ? `+${impact.avgImprovement}%` : '—', color: impact.avgImprovement > 0 ? 'text-blue-600' : 'text-stone-500', bg: impact.avgImprovement > 0 ? 'bg-blue-50' : 'bg-stone-50' },
              { label: 'Active',    value: String(active.length),                                  color: active.length > 0 ? 'text-amber-600' : 'text-stone-500', bg: active.length > 0 ? 'bg-amber-50' : 'bg-stone-50' },
            ].map(s => (
              <div key={s.label} className={`${s.bg} rounded p-2.5 text-center`}>
                <p className={`text-base font-black ${s.color}`}>{s.value}</p>
                <p className="text-[9px] font-bold text-stone-500 uppercase tracking-wider mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
          {impact.bestType && impact.bestTypeGain > 0 && (
            <div className="mt-3 bg-amber-50 border border-amber-100 rounded px-3 py-2">
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
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-stone-500 mb-2">Active</p>
          <div className="space-y-2">
            {active.map(inv => (
              <div key={inv.id} className={`bg-white border rounded-2xl px-4 py-3.5 ${
                inv.reason === 'exam_soon' || inv.reason === 'below_pass'
                  ? 'border-red-200 bg-red-50'
                  : 'border-amber-200 bg-amber-50'
              }`}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-black text-brand-dark">{TYPE_LABEL[inv.type] ?? inv.type}</p>
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
                      inv.status === 'started' ? 'text-blue-500' : 'text-stone-500'
                    }`}>
                      {inv.status === 'started' ? 'In Progress' : 'Recommended'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-2 text-[10px] text-stone-500">
                  <span>Created {formatDate(inv.createdAt)}</span>
                  {inv.startedAt && <span>· Started {formatDate(inv.startedAt)}</span>}
                  <span>· Subject avg {inv.previousAvg}%</span>
                </div>
                {inv.rationale && (
                  <p className="text-[10px] text-stone-500 italic mt-1.5 border-t border-brand-border/60 pt-1.5">
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
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-stone-500 mb-2">Completed</p>
          <div className="space-y-2">
            {completed.map(inv => {
              const outcome = outcomes.find(o => o.interventionId === inv.id);
              return (
                <div key={inv.id} className={`bg-white border rounded-2xl px-4 py-3.5 ${
                  outcome?.result === 'improved' ? 'border-emerald-200' :
                  outcome?.result === 'declined' ? 'border-red-200' :
                  'border-brand-border'
                }`}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm ${
                          outcome?.result === 'improved' ? 'text-emerald-500' :
                          outcome?.result === 'declined' ? 'text-red-400' : 'text-stone-500'
                        }`}>
                          {outcome?.result === 'improved' ? '✓' : outcome?.result === 'declined' ? '↓' : '→'}
                        </span>
                        <p className="text-sm font-black text-brand-dark">{TYPE_LABEL[inv.type] ?? inv.type}</p>
                      </div>
                      <p className="text-[11px] text-stone-500 mt-0.5">{inv.subject}</p>
                    </div>
                    {outcome && (
                      <div className="text-right shrink-0">
                        <p className={`text-sm font-black ${
                          outcome.result === 'improved' ? 'text-emerald-600' :
                          outcome.result === 'declined' ? 'text-red-500' : 'text-stone-500'
                        }`}>
                          {outcome.improvement > 0 ? `+${outcome.improvement}%` : `${outcome.improvement}%`}
                        </p>
                        <p className="text-[10px] text-stone-500">
                          {outcome.previousAvg}% → {outcome.newAvg}%
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Outcome detail */}
                  {outcome && (
                    <div className={`mt-3 rounded px-3 py-2 ${
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
                    <button
                      onClick={() => setOutcomeTarget({
                        interventionId: inv.id,
                        studentId,
                        subject:        inv.subject,
                        subjectId:      inv.subjectId ?? null,
                        type:           inv.type,
                        previousAvg:    inv.previousAvg,
                        studentLabel,
                      })}
                      className="text-[10px] font-black text-blue-500 hover:text-blue-700 mt-2 transition-colors"
                    >
                      Record Outcome →
                    </button>
                  )}

                  <p className="text-[10px] text-stone-500 mt-2">
                    Completed {inv.completedAt ? formatDate(inv.completedAt) : '—'}
                  </p>
                  {inv.rationale && (
                    <p className="text-[10px] text-stone-500 italic mt-1.5 border-t border-brand-border/60 pt-1.5">
                      {inv.rationale}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {outcomeTarget && (
        <RecordOutcomeModal
          session={session}
          target={outcomeTarget}
          onClose={() => setOutcomeTarget(null)}
          onRecorded={onOutcomeRecorded}
        />
      )}

    </div>
  );
}

// ── Tab: Contacts ─────────────────────────────────────────────

function ContactsTab({
  contacts, student, session, onContactsChange,
}: {
  contacts: ParentContact[] | null;
  student: StudentProgressSummary;
  session: TeacherSession;
  onContactsChange: (updated: ParentContact[]) => void;
}) {
  const [method, setMethod] = useState<ContactMethod>('call');
  const [note, setNote]     = useState('');
  const [saving, setSaving] = useState(false);

  if (contacts === null) return <LoadingSpinner />;

  async function handleLog() {
    setSaving(true);
    const contact = await logParentContact(
      student.student_id,
      session.teacher_id,
      session.school_id,
      method,
      note,
    );
    setSaving(false);
    if (contact) {
      setNote('');
      onContactsChange([contact, ...(contacts ?? [])]);
    }
  }

  async function handleDelete(id: number) {
    await deleteParentContact(id, session.teacher_id);
    const updated = (contacts ?? []).filter(c => c.id !== id);
    onContactsChange(updated);
  }

  return (
    <div className="space-y-5">
      {/* Log new contact */}
      <div className="paper-card rounded p-5">
        <div className="flex items-center gap-2 mb-3">
          <Phone className="w-3.5 h-3.5 text-stone-500" />
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-stone-500">Log Parent Contact</p>
        </div>

        <div className="flex gap-1.5 flex-wrap mb-3">
          {(Object.keys(CONTACT_METHOD_LABELS) as ContactMethod[]).map(m => (
            <button
              key={m}
              onClick={() => setMethod(m)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-black transition-all ${
                method === m
                  ? 'bg-brand-dark text-white'
                  : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
              }`}
            >
              {CONTACT_METHOD_LABELS[m]}
            </button>
          ))}
        </div>

        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="Note (optional)"
          rows={2}
          className="w-full px-3 py-2 rounded border border-brand-border text-sm text-stone-700 placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-brand-dark resize-none mb-3"
        />

        <button
          onClick={handleLog}
          disabled={saving}
          className="w-full py-2 rounded bg-brand-dark text-white text-sm font-black hover:bg-stone-700 transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Log Contact'}
        </button>
      </div>

      {/* History */}
      {contacts.length === 0 ? (
        <EmptyState icon={Phone} text="No parent contacts logged yet." />
      ) : (
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-stone-500 mb-2">History</p>
          <div className="space-y-2">
            {contacts.map(c => (
              <div key={c.id} className="paper-card rounded px-4 py-3 flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-brand-dark">{CONTACT_METHOD_LABELS[c.method]}</span>
                    <span className="text-[10px] text-stone-500">
                      {new Date(c.createdAt).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    <span className="text-[10px] text-stone-500">{daysSince(c.createdAt) === 0 ? 'Today' : `${daysSince(c.createdAt)}d ago`}</span>
                  </div>
                  {c.note && <p className="text-[12px] text-stone-500 mt-0.5">{c.note}</p>}
                </div>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="shrink-0 p-1.5 rounded-lg hover:bg-red-50 text-stone-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
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
        className="w-5 h-5 border-2 border-brand-border border-t-stone-700 rounded-full"
      />
    </div>
  );
}

function EmptyState({ icon: Icon, text }: { icon: React.ElementType; text: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Icon className="w-8 h-8 text-stone-200 mb-3" />
      <p className="text-sm font-bold text-stone-500">{text}</p>
    </div>
  );
}
