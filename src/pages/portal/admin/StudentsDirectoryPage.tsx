import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, ChevronRight, Plus, AlertCircle, ArrowRight, Trash2 } from 'lucide-react';
import type { AdminSession } from '../../../lib/auth';
import {
  fetchSchoolStudentDirectory, fetchSubjects, adminCreateStudent,
  type DirectoryStudent, type Subject, type SubjectTeacherPair,
} from '../../../lib/students';
import { fetchSchoolTeachers, type Teacher } from '../../../lib/teachers';
import { fetchAttendanceSummary } from '../../../lib/homeroom';
import StudentDetailModal from './StudentDetailModal';
import { Shimmer } from '../../../shared/components/Shimmer';
import Dropdown from '../../../shared/components/Dropdown';
import Modal from '../../../shared/components/Modal';

const ease = [0.23, 1, 0.32, 1] as [number, number, number, number];

interface StudentsDirectoryPageProps { session: AdminSession; }

interface AssignmentRow {
  subject_id: number | null;
  teacher_id: number | null;
}

const EMPTY_ROW: AssignmentRow = { subject_id: null, teacher_id: null };

interface StudentForm {
  name: string;
  surname: string;
  student_code: string;
  pin: string;
  cohort_name: string;
  grade: number;
}

const EMPTY_STUDENT_FORM: StudentForm = {
  name: '', surname: '', student_code: '', pin: '', cohort_name: '', grade: 10,
};

export default function StudentsDirectoryPage({ session }: StudentsDirectoryPageProps) {
  const [students, setStudents] = useState<DirectoryStudent[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [gradeFilter, setGradeFilter] = useState<number | null>(null);
  const [viewingStudentId, setViewingStudentId] = useState<number | null>(null);
  const [attendanceByStudent, setAttendanceByStudent] = useState<Map<number, number>>(new Map());

  // Add Student modal
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [studentForm, setStudentForm] = useState<StudentForm>(EMPTY_STUDENT_FORM);
  const [rows, setRows] = useState<AssignmentRow[]>([{ ...EMPTY_ROW }]);
  const [studentError, setStudentError] = useState<string | null>(null);
  const [studentSubmitting, setStudentSubmitting] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    if (session.school_id) {
      const [studentData, teacherData, subjectData] = await Promise.all([
        fetchSchoolStudentDirectory(session.school_id),
        fetchSchoolTeachers(session.school_id),
        fetchSubjects(),
      ]);
      setStudents(studentData);
      setTeachers(teacherData.filter((t) => t.is_active));
      setSubjects(subjectData);

      if (studentData.length > 0) {
        const to = new Date().toISOString().slice(0, 10);
        const from = new Date(Date.now() - 90 * 86400000).toISOString().slice(0, 10);
        const summary = await fetchAttendanceSummary(studentData.map(s => s.id), from, to);
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

  const grades = Array.from(new Set(students.map(s => s.grade))).sort((a, b) => a - b);

  const filtered = students.filter((s) =>
    (gradeFilter === null || s.grade === gradeFilter) &&
    `${s.name} ${s.surname} ${s.student_code} ${s.cohort_name ?? ''}`.toLowerCase().includes(search.toLowerCase())
  );

  const atRiskCount = students.filter(s => (attendanceByStudent.get(s.id) ?? 100) < 85).length;

  // ── Add Student ──────────────────────────────────────────────

  const openAddStudent = () => {
    setStudentForm(EMPTY_STUDENT_FORM);
    setRows([{ ...EMPTY_ROW }]);
    setStudentError(null);
    setShowAddStudent(true);
  };

  const setField = (field: keyof StudentForm, value: string | number) =>
    setStudentForm((f) => ({ ...f, [field]: value }));

  const setRow = (index: number, field: keyof AssignmentRow, value: number) => {
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, [field]: value } : r)));
  };

  const addRow = () => setRows((prev) => [...prev, { ...EMPTY_ROW }]);
  const removeRow = (index: number) => setRows((prev) => prev.filter((_, i) => i !== index));

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session.school_id) return;

    if (!/^\d{4,10}$/.test(studentForm.pin)) {
      setStudentError('PIN must be 4-10 digits.');
      return;
    }

    const assignments: SubjectTeacherPair[] = rows
      .filter((r): r is { subject_id: number; teacher_id: number } => r.subject_id !== null && r.teacher_id !== null)
      .map((r) => ({ subject_id: r.subject_id, teacher_id: r.teacher_id }));

    setStudentSubmitting(true);
    setStudentError(null);
    const result = await adminCreateStudent({
      ...studentForm,
      school_id: session.school_id,
      assignments,
    });
    setStudentSubmitting(false);

    if (!result.success) { setStudentError(result.error); return; }
    await load();
    setShowAddStudent(false);
  };

  return (
    <div className="student-home min-h-full pb-16 relative">

      {/* ═══ Header ═══════════════════════════════════════════════ */}
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-5 flex items-end justify-between gap-4 flex-wrap">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }}>
          <p className="text-[12px] text-[rgba(31,36,33,0.5)] font-medium">Admin</p>
          <h1 className="text-brand-dark text-[30px] sm:text-[36px] leading-tight mt-1" style={{ fontWeight: 600 }}>
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-linear-to-r from-sky-500 via-sky-600 to-blue-600">
                Students
              </span>
              <svg aria-hidden="true" viewBox="0 0 320 14" className="absolute left-0 -bottom-1 w-full h-3 text-amber-500/70" preserveAspectRatio="none">
                <path d="M2 9C60 3 180 2 318 8" stroke="currentColor" strokeWidth="3.5" fill="none" strokeLinecap="round" />
              </svg>
            </span>
          </h1>
          <p className="text-[13px] text-[rgba(31,36,33,0.5)] mt-2 font-medium">All students across the school.</p>
        </motion.div>
        <motion.button onClick={openAddStudent} whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}
          className="flex items-center gap-1 text-[14px] font-semibold transition-colors shrink-0" style={{ color: 'var(--color-navy)' }}>
          <Plus className="w-3.5 h-3.5" /> Add student
        </motion.button>
      </div>

      {/* ═══ Body ═══════════════════════════════════════════════ */}
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4">

      {!loading && students.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="paper-card rounded p-5">
            <p className="text-[12px] text-muted-2 mb-2">Total students</p>
            <p className="font-black text-brand-dark text-4xl">{students.length}</p>
          </div>
          <div className="paper-card rounded p-5">
            <p className="text-[12px] text-muted-2 mb-2">Below 85% attendance (90 days)</p>
            <p className={`font-black text-4xl ${atRiskCount > 0 ? 'text-amber-600' : 'text-brand-dark'}`}>{atRiskCount}</p>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative max-w-sm flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, code, or class..."
            className="w-full pl-9 pr-3 py-2.5 bg-white border border-brand-border rounded text-sm font-medium text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 transition-all"
          />
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setGradeFilter(null)}
            className={`px-3 py-1.5 rounded text-[13px] font-semibold border transition-colors ${gradeFilter === null ? 'bg-sky-50 border-sky-200' : 'bg-white border-brand-border text-stone-600'}`}
            style={gradeFilter === null ? { color: 'var(--color-navy)' } : undefined}
          >
            All grades
          </button>
          {grades.map(g => (
            <button
              key={g}
              onClick={() => setGradeFilter(g)}
              className={`px-3 py-1.5 rounded text-[13px] font-semibold border transition-colors ${gradeFilter === g ? 'bg-sky-50 border-sky-200' : 'bg-white border-brand-border text-stone-600'}`}
              style={gradeFilter === g ? { color: 'var(--color-navy)' } : undefined}
            >
              Grade {g}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="paper-card rounded p-5 space-y-3">
          {[0, 1, 2].map(i => <Shimmer key={i} className="h-10 w-full" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="paper-card rounded p-12 text-center">
          <p className="font-bold text-brand-dark mb-1">
            {students.length === 0 ? 'No students yet' : 'No matches'}
          </p>
          <p className="text-sm text-stone-500 mb-6">
            {students.length === 0 ? 'Add your first student to get started.' : 'Try a different search.'}
          </p>
          {students.length === 0 && (
            <button onClick={openAddStudent}
              className="inline-flex items-center gap-1 text-[14px] font-semibold transition-colors" style={{ color: 'var(--color-navy)' }}>
              Add student <Plus className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      ) : (
        <div className="paper-card rounded overflow-hidden">
          <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-border/60">
                <th className="text-left px-5 py-3 text-[12px] font-semibold text-muted-2">Student</th>
                <th className="text-left px-5 py-3 text-[12px] font-semibold text-muted-2">Code</th>
                <th className="text-left px-5 py-3 text-[12px] font-semibold text-muted-2">Grade</th>
                <th className="text-left px-5 py-3 text-[12px] font-semibold text-muted-2">Class</th>
                <th className="text-left px-5 py-3 text-[12px] font-semibold text-muted-2">Attendance</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => {
                const rate = attendanceByStudent.get(s.id);
                return (
                <tr key={s.id}
                  onClick={() => setViewingStudentId(s.id)}
                  className={`border-b border-stone-50 hover:bg-stone-50 cursor-pointer transition-colors ${i === filtered.length - 1 ? 'border-0' : ''}`}>
                  <td className="px-5 py-3.5 font-bold text-brand-dark">{s.surname}, {s.name}</td>
                  <td className="px-5 py-3.5 font-mono text-stone-500 text-xs tracking-widest">{s.student_code}</td>
                  <td className="px-5 py-3.5 text-stone-500">Grade {s.grade}</td>
                  <td className="px-5 py-3.5 text-stone-500">{s.cohort_name ?? '—'}</td>
                  <td className={`px-5 py-3.5 ${rate !== undefined && rate < 85 ? 'text-amber-600 font-semibold' : 'text-stone-500'}`}>
                    {rate !== undefined ? `${rate}%` : '—'}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <ChevronRight className="w-4 h-4 text-stone-400 inline-block" />
                  </td>
                </tr>
              );})}
            </tbody>
          </table>
          </div>
        </div>
      )}
      </div>

      {viewingStudentId && session.school_id && (
        <StudentDetailModal student_id={viewingStudentId} school_id={session.school_id} onClose={() => setViewingStudentId(null)} onSaved={load} />
      )}

      {/* Add Student modal */}
      <Modal open={showAddStudent} onClose={() => setShowAddStudent(false)} title="Add student" maxWidth="max-w-lg"
        footer={<>
          <button type="button" onClick={() => setShowAddStudent(false)}
            className="text-[14px] font-semibold text-stone-500 hover:text-stone-700 transition-colors">
            Cancel
          </button>
          <button type="submit" form="admin-student-form" disabled={studentSubmitting}
            className="text-[14px] font-semibold transition-colors disabled:opacity-50 flex items-center gap-2" style={{ color: 'var(--color-navy)' }}>
            {studentSubmitting
              ? <><div className="w-3.5 h-3.5 border-2 border-current/30 border-t-current rounded-full animate-spin" /> Saving...</>
              : <>Add student <ArrowRight className="w-3.5 h-3.5" /></>
            }
          </button>
        </>}
      >
        <form id="admin-student-form" onSubmit={handleCreateStudent} className="space-y-4">
          {studentError && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{studentError}</p>
            </motion.div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] text-muted-2 mb-1.5">Name</label>
              <input required type="text" value={studentForm.name} onChange={(e) => setField('name', e.target.value)}
                className="w-full px-3 py-2.5 bg-stone-50 border border-brand-border rounded text-sm font-medium text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 transition-all"
                placeholder="Rajen" />
            </div>
            <div>
              <label className="block text-[12px] text-muted-2 mb-1.5">Surname</label>
              <input required type="text" value={studentForm.surname} onChange={(e) => setField('surname', e.target.value)}
                className="w-full px-3 py-2.5 bg-stone-50 border border-brand-border rounded text-sm font-medium text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 transition-all"
                placeholder="Naidoo" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] text-muted-2 mb-1.5">Student code</label>
              <input required type="text" value={studentForm.student_code}
                onChange={(e) => setField('student_code', e.target.value.toUpperCase())}
                className="w-full px-3 py-2.5 bg-stone-50 border border-brand-border rounded text-sm font-medium tracking-widest text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 transition-all"
                placeholder="e.g. STU-0012" autoCapitalize="characters" />
            </div>
            <div>
              <label className="block text-[12px] text-muted-2 mb-1.5">PIN</label>
              <input required type="password" inputMode="numeric" maxLength={10}
                value={studentForm.pin} onChange={(e) => setField('pin', e.target.value.replace(/\D/g, ''))}
                className="w-full px-3 py-2.5 bg-stone-50 border border-brand-border rounded text-sm font-medium text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 transition-all tracking-widest"
                placeholder="4-10 digit PIN" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] text-muted-2 mb-1.5">Class</label>
              <input required type="text" value={studentForm.cohort_name} onChange={(e) => setField('cohort_name', e.target.value)}
                className="w-full px-3 py-2.5 bg-stone-50 border border-brand-border rounded text-sm font-medium text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 transition-all"
                placeholder="e.g. 10A" />
            </div>
            <div>
              <label className="block text-[12px] text-muted-2 mb-1.5">Grade</label>
              <Dropdown
                value={String(studentForm.grade)}
                onChange={(v) => setField('grade', Number(v))}
                buttonClassName="w-full flex items-center justify-between gap-2 px-3 py-2.5 bg-stone-50 border border-brand-border rounded text-sm font-medium text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 transition-all"
                options={[8, 9, 10, 11, 12].map((g) => ({ value: String(g), label: `Grade ${g}` }))}
              />
            </div>
          </div>

          <div>
            <label className="block text-[12px] text-muted-2 mb-2">Subjects &amp; teachers</label>
            <div className="space-y-2">
              {rows.map((row, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Dropdown
                    value={row.subject_id ? String(row.subject_id) : null}
                    onChange={(v) => setRow(i, 'subject_id', Number(v))}
                    placeholder="Select subject"
                    className="flex-1 min-w-0"
                    buttonClassName="w-full flex items-center justify-between gap-2 px-3 py-2.5 bg-stone-50 border border-brand-border rounded text-sm font-medium text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 transition-all"
                    options={subjects.map((s) => ({ value: String(s.id), label: s.label }))}
                  />
                  <Dropdown
                    value={row.teacher_id ? String(row.teacher_id) : null}
                    onChange={(v) => setRow(i, 'teacher_id', Number(v))}
                    placeholder="Select teacher"
                    className="flex-1 min-w-0"
                    buttonClassName="w-full flex items-center justify-between gap-2 px-3 py-2.5 bg-stone-50 border border-brand-border rounded text-sm font-medium text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 transition-all"
                    options={teachers.map((t) => ({ value: String(t.id), label: `${t.surname}, ${t.name}` }))}
                  />
                  {rows.length > 1 && (
                    <button type="button" onClick={() => removeRow(i)}
                      className="p-2 rounded-lg hover:bg-red-50 text-stone-400 hover:text-red-600 transition-colors shrink-0">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button type="button" onClick={addRow}
              className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-brand-dark transition-colors">
              <Plus className="w-3.5 h-3.5" /> Add another subject
            </button>
            <p className="text-xs text-stone-500 mt-2">
              Optional — rows with no subject or teacher selected are skipped.
            </p>
          </div>
        </form>
      </Modal>
    </div>
  );
}
