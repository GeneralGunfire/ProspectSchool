import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Plus, Search, ChevronRight, UserMinus } from 'lucide-react';
import type { AdminSession } from '../../../lib/auth';
import { fetchSchoolCohorts, fetchAttendanceSummary, type CohortWithHomeroom } from '../../../lib/homeroom';
import {
  fetchStudentsOutsideCohort, moveStudentToCohort, removeStudentFromCohort, fetchSchoolStudentDirectory,
  type DirectoryStudent,
} from '../../../lib/students';
import StudentDetailModal from './StudentDetailModal';
import Modal from '../../../shared/components/Modal';

interface ClassDetailPageProps {
  session: AdminSession;
  cohort_id: number;
  onBack: () => void;
}

const ease = [0.23, 1, 0.32, 1] as [number, number, number, number];

export default function ClassDetailPage({ session, cohort_id, onBack }: ClassDetailPageProps) {
  const [cohort, setCohort] = useState<CohortWithHomeroom | null>(null);
  const [roster, setRoster] = useState<DirectoryStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [candidates, setCandidates] = useState<DirectoryStudent[]>([]);
  const [search, setSearch] = useState('');
  const [addingId, setAddingId] = useState<number | null>(null);
  const [viewingStudentId, setViewingStudentId] = useState<number | null>(null);
  const [removeTarget, setRemoveTarget] = useState<DirectoryStudent | null>(null);
  const [removing, setRemoving] = useState(false);
  const [attendanceByStudent, setAttendanceByStudent] = useState<Map<number, number>>(new Map());

  const load = async () => {
    setLoading(true);
    if (session.school_id) {
      const cohorts = await fetchSchoolCohorts(session.school_id);
      setCohort(cohorts.find((c) => c.id === cohort_id) ?? null);

      const all = await fetchSchoolStudentDirectory(session.school_id);
      const rosterStudents = all.filter((s) => s.cohort_id === cohort_id);
      setRoster(rosterStudents);

      if (rosterStudents.length > 0) {
        const to = new Date().toISOString().slice(0, 10);
        const from = new Date(Date.now() - 90 * 86400000).toISOString().slice(0, 10);
        const summary = await fetchAttendanceSummary(rosterStudents.map(s => s.id), from, to);
        const rates = new Map<number, number>();
        for (const s of summary) {
          const total = s.present + s.late + s.absent + s.excused;
          rates.set(s.student_id, total > 0 ? Math.round((s.present / total) * 100) : 100);
        }
        setAttendanceByStudent(rates);
      }
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, [cohort_id]);

  const openAdd = async () => {
    setSearch('');
    if (session.school_id) {
      const outside = await fetchStudentsOutsideCohort(session.school_id, cohort_id);
      setCandidates(outside);
    }
    setShowAdd(true);
  };

  const handleAdd = async (student: DirectoryStudent) => {
    if (!session.school_id) return;
    setAddingId(student.id);
    await moveStudentToCohort(student.id, cohort_id, session.school_id);
    setCandidates((prev) => prev.filter((s) => s.id !== student.id));
    await load();
    setAddingId(null);
  };

  const filteredCandidates = candidates.filter((s) =>
    `${s.name} ${s.surname} ${s.student_code}`.toLowerCase().includes(search.toLowerCase())
  );

  const handleRemove = async () => {
    if (!removeTarget || !session.school_id) return;
    setRemoving(true);
    await removeStudentFromCohort(removeTarget.id, session.school_id);
    setRemoveTarget(null);
    await load();
    setRemoving(false);
  };

  const avgAttendance = roster.length > 0
    ? Math.round(roster.reduce((sum, s) => sum + (attendanceByStudent.get(s.id) ?? 100), 0) / roster.length)
    : null;

  return (
    <div className="student-home min-h-full pb-16 relative">

      {/* ═══ Header ═══════════════════════════════════════════════ */}
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-5">
        <button onClick={onBack} className="flex items-center gap-1 text-[13px] font-semibold transition-colors mb-3" style={{ color: 'var(--color-navy)' }}>
          <ArrowLeft className="w-3.5 h-3.5" /> Back to classes
        </button>
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          className="flex flex-wrap items-end justify-between gap-4"
        >
          <div>
            <p className="text-[12px] text-[rgba(31,36,33,0.5)] font-medium">Grade {cohort?.grade}</p>
            <h1 className="text-brand-dark text-[30px] sm:text-[36px] leading-tight mt-1" style={{ fontWeight: 600 }}>
              <span className="relative inline-block">
                <span className="text-transparent bg-clip-text bg-linear-to-r from-sky-500 via-sky-600 to-blue-600">
                  {cohort?.name ?? 'Class'}
                </span>
                <svg aria-hidden="true" viewBox="0 0 320 14" className="absolute left-0 -bottom-1 w-full h-3 text-amber-500/70" preserveAspectRatio="none">
                  <path d="M2 9C60 3 180 2 318 8" stroke="currentColor" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
            <p className="text-[13px] text-[rgba(31,36,33,0.5)] mt-2 font-medium">
              {roster.length} student{roster.length === 1 ? '' : 's'}
              {cohort?.homeroom_teacher_name && ` · Homeroom: ${cohort.homeroom_teacher_name} ${cohort.homeroom_teacher_surname}`}
            </p>
          </div>
          <motion.button onClick={openAdd} whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}
            className="flex items-center gap-1 text-[14px] font-semibold transition-colors shrink-0" style={{ color: 'var(--color-navy)' }}>
            <Plus className="w-3.5 h-3.5" /> Add student
          </motion.button>
        </motion.div>
      </div>

      {/* ═══ Body ═══════════════════════════════════════════════ */}
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4">

      {!loading && roster.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="paper-card rounded p-5">
            <p className="text-[12px] text-muted-2 mb-2">Class attendance rate</p>
            <p className={`font-black text-4xl ${avgAttendance !== null && avgAttendance < 85 ? 'text-amber-600' : 'text-brand-dark'}`}>
              {avgAttendance !== null ? `${avgAttendance}%` : '—'}
            </p>
            <p className="text-sm text-stone-500 mt-1">last 90 days</p>
          </div>
          <div className="paper-card rounded p-5">
            <p className="text-[12px] text-muted-2 mb-2">Students below 85% attendance</p>
            <p className="font-black text-brand-dark text-4xl">
              {roster.filter(s => (attendanceByStudent.get(s.id) ?? 100) < 85).length}
            </p>
            <p className="text-sm text-stone-500 mt-1">of {roster.length} in this class</p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="paper-card rounded p-5 space-y-3">
          {[0, 1, 2].map(i => <div key={i} className="h-10 w-full bg-stone-100 rounded animate-pulse" />)}
        </div>
      ) : roster.length === 0 ? (
        <div className="paper-card rounded p-12 text-center">
          <p className="font-bold text-brand-dark mb-1">No students in this class yet</p>
          <p className="text-sm text-stone-500 mb-6">Add students from the school's directory.</p>
          <button onClick={openAdd}
            className="inline-flex items-center gap-1 text-[14px] font-semibold transition-colors" style={{ color: 'var(--color-navy)' }}>
            Add student <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="paper-card rounded overflow-hidden">
          <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-border/60">
                <th className="text-left px-5 py-3 text-[12px] font-semibold text-muted-2">Student</th>
                <th className="text-left px-5 py-3 text-[12px] font-semibold text-muted-2">Code</th>
                <th className="text-left px-5 py-3 text-[12px] font-semibold text-muted-2">Attendance</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {roster.map((s, i) => {
                const rate = attendanceByStudent.get(s.id);
                return (
                <tr key={s.id}
                  className={`border-b border-stone-50 hover:bg-stone-50 transition-colors ${i === roster.length - 1 ? 'border-0' : ''}`}>
                  <td className="px-5 py-3.5 font-bold text-brand-dark cursor-pointer" onClick={() => setViewingStudentId(s.id)}>{s.surname}, {s.name}</td>
                  <td className="px-5 py-3.5 font-mono text-stone-500 text-xs tracking-widest cursor-pointer" onClick={() => setViewingStudentId(s.id)}>{s.student_code}</td>
                  <td className={`px-5 py-3.5 cursor-pointer ${rate !== undefined && rate < 85 ? 'text-amber-600 font-semibold' : 'text-stone-600'}`} onClick={() => setViewingStudentId(s.id)}>
                    {rate !== undefined ? `${rate}%` : '—'}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button onClick={() => setRemoveTarget(s)} className="text-red-500 hover:text-red-600 transition-colors" title="Remove from class">
                        <UserMinus className="w-4 h-4" />
                      </button>
                      <ChevronRight className="w-4 h-4 text-stone-400 cursor-pointer" onClick={() => setViewingStudentId(s.id)} />
                    </div>
                  </td>
                </tr>
              );})}
            </tbody>
          </table>
          </div>
        </div>
      )}
      </div>

      {/* Add student modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title={`Add student to ${cohort?.name}`}
        footer={
          <button onClick={() => setShowAdd(false)}
            className="w-full py-2.5 text-sm font-bold text-stone-600 border border-brand-border rounded hover:bg-stone-50 transition-all">
            Done
          </button>
        }
      >
        <div className="relative mb-3">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or code..."
            className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-brand-border rounded text-sm font-medium text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 transition-all"
          />
        </div>

        <div className="space-y-1.5">
          {filteredCandidates.length === 0 ? (
            <p className="text-sm text-stone-500 text-center py-8">No matching students found.</p>
          ) : (
            filteredCandidates.map((s) => (
              <div key={s.id} className="flex items-center justify-between px-3 py-2.5 bg-stone-50 rounded border border-brand-border">
                <div>
                  <p className="text-sm font-bold text-brand-dark">{s.surname}, {s.name}</p>
                  <p className="text-xs text-stone-500">{s.cohort_name ? `Currently in ${s.cohort_name}` : 'Unassigned'} · Gr {s.grade}</p>
                </div>
                <button onClick={() => handleAdd(s)} disabled={addingId === s.id}
                  className="text-[13px] font-semibold transition-colors disabled:opacity-50" style={{ color: 'var(--color-navy)' }}>
                  {addingId === s.id ? '...' : 'Add'}
                </button>
              </div>
            ))
          )}
        </div>
      </Modal>

      {viewingStudentId && session.school_id && (
        <StudentDetailModal student_id={viewingStudentId} school_id={session.school_id} onClose={() => setViewingStudentId(null)} onSaved={load} />
      )}

      {/* Remove-from-class confirm */}
      <Modal open={!!removeTarget} onClose={() => setRemoveTarget(null)} maxWidth="max-w-sm"
        footer={<>
          <button onClick={() => setRemoveTarget(null)} className="text-[14px] font-semibold text-stone-500 hover:text-stone-700 transition-colors">
            Cancel
          </button>
          <button onClick={handleRemove} disabled={removing} className="text-[14px] font-semibold text-red-600 hover:text-red-700 transition-colors disabled:opacity-50">
            {removing ? 'Removing...' : 'Remove'}
          </button>
        </>}
      >
        <p className="font-black text-brand-dark mb-1">Remove from class?</p>
        <p className="text-sm text-stone-500">
          {removeTarget?.surname}, {removeTarget?.name} will be unassigned from {cohort?.name} and become available to add to another class.
        </p>
      </Modal>
    </div>
  );
}
