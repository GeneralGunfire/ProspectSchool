import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Users, ChevronRight, Plus, X, AlertCircle, ArrowRight, Trash2 } from 'lucide-react';
import type { AdminSession } from '../../../lib/auth';
import {
  fetchSchoolStudentDirectory, fetchSubjects, adminCreateStudent,
  type DirectoryStudent, type Subject, type SubjectTeacherPair,
} from '../../../lib/students';
import { fetchSchoolTeachers, type Teacher } from '../../../lib/teachers';
import StudentDetailModal from './StudentDetailModal';
import { Shimmer } from '../../../shared/components/Shimmer';
import Dropdown from '../../../shared/components/Dropdown';

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
  const [viewingStudentId, setViewingStudentId] = useState<number | null>(null);

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
    }
    setLoading(false);
  };

  const filtered = students.filter((s) =>
    `${s.name} ${s.surname} ${s.student_code} ${s.cohort_name ?? ''}`.toLowerCase().includes(search.toLowerCase())
  );

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

      {/* ═══ Hero ═══════════════════════════════════════════════ */}
      <div className="relative overflow-hidden">
        <div className="relative max-w-5xl mx-auto px-5 sm:px-8 pt-8 sm:pt-11 pb-6 sm:pb-8 w-full flex items-end justify-between gap-4 flex-wrap">
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
          >
            <p className="text-[12px] text-[rgba(31,36,33,0.5)] font-medium">Admin</p>
            <h1
              className="text-brand-dark text-[32px] sm:text-[40px] leading-[1.12] mt-2"
              style={{ fontFamily: 'var(--font-instrument)', fontWeight: 500, letterSpacing: '-0.02em' }}
            >
              Students
            </h1>
            <p className="text-[13px] text-[rgba(31,36,33,0.5)] mt-2 font-medium">All students across the school.</p>
          </motion.div>
          <motion.button onClick={openAddStudent} whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 bg-accent text-white text-sm font-black px-5 py-2.5 rounded shrink-0 transition-colors duration-200 hover:bg-accent-soft">
            <Plus className="w-4 h-4" /> Add Student
          </motion.button>
        </div>
      </div>

      {/* ═══ Body ═══════════════════════════════════════════════ */}
      <div className="max-w-5xl mx-auto px-4 sm:px-8 relative z-10 space-y-5 sm:space-y-6 pt-2 sm:pt-3">

      <div className="relative max-w-sm">
        <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, code, or class..."
          className="w-full pl-9 pr-3 py-2.5 bg-white border border-brand-border rounded text-sm font-medium text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 transition-all"
        />
      </div>

      {loading ? (
        <div className="paper-card rounded p-5 space-y-3">
          {[0, 1, 2].map(i => <Shimmer key={i} className="h-10 w-full" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="paper-card rounded p-12 text-center">
          <div className="w-12 h-12 rounded bg-stone-100 flex items-center justify-center mx-auto mb-4">
            <Users className="w-5 h-5 text-stone-500" />
          </div>
          <p className="font-bold text-brand-dark mb-1">
            {students.length === 0 ? 'No students yet' : 'No matches'}
          </p>
          <p className="text-sm text-stone-500 mb-6">
            {students.length === 0 ? 'Add your first student to get started.' : 'Try a different search.'}
          </p>
          {students.length === 0 && (
            <button onClick={openAddStudent}
              className="inline-flex items-center gap-2 text-sm font-bold text-stone-700 hover:text-brand-dark border border-brand-border hover:border-stone-300 px-5 py-2.5 rounded transition-all">
              Add Student <Plus className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        <div className="paper-card rounded overflow-hidden">
          <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-border/60">
                <th className="text-left px-5 py-3 text-xs font-black uppercase tracking-widest text-stone-500">Student</th>
                <th className="text-left px-5 py-3 text-xs font-black uppercase tracking-widest text-stone-500">Code</th>
                <th className="text-left px-5 py-3 text-xs font-black uppercase tracking-widest text-stone-500">Grade</th>
                <th className="text-left px-5 py-3 text-xs font-black uppercase tracking-widest text-stone-500">Class</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => (
                <tr key={s.id}
                  onClick={() => setViewingStudentId(s.id)}
                  className={`border-b border-stone-50 hover:bg-stone-50 cursor-pointer transition-colors ${i === filtered.length - 1 ? 'border-0' : ''}`}>
                  <td className="px-5 py-3.5 font-bold text-brand-dark">{s.surname}, {s.name}</td>
                  <td className="px-5 py-3.5 font-mono text-stone-500 text-xs tracking-widest">{s.student_code}</td>
                  <td className="px-5 py-3.5 text-stone-500">Grade {s.grade}</td>
                  <td className="px-5 py-3.5 text-stone-500">{s.cohort_name ?? '—'}</td>
                  <td className="px-5 py-3.5 text-right">
                    <ChevronRight className="w-4 h-4 text-stone-400 inline-block" />
                  </td>
                </tr>
              ))}
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
      <AnimatePresence>
        {showAddStudent && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowAddStudent(false)} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[88vh]">
                <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-brand-border/60 shrink-0">
                  <h2 className="text-lg font-black text-brand-dark">Add Student</h2>
                  <button onClick={() => setShowAddStudent(false)} aria-label="Close" className="p-2 rounded hover:bg-stone-100 text-stone-500 hover:text-stone-700 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="px-6 py-4 overflow-y-auto">
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
                        <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-1.5">Name</label>
                        <input required type="text" value={studentForm.name} onChange={(e) => setField('name', e.target.value)}
                          className="w-full px-3 py-2.5 bg-stone-50 border border-brand-border rounded text-sm font-medium text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 transition-all"
                          placeholder="Rajen" />
                      </div>
                      <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-1.5">Surname</label>
                        <input required type="text" value={studentForm.surname} onChange={(e) => setField('surname', e.target.value)}
                          className="w-full px-3 py-2.5 bg-stone-50 border border-brand-border rounded text-sm font-medium text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 transition-all"
                          placeholder="Naidoo" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-1.5">Student Code</label>
                        <input required type="text" value={studentForm.student_code}
                          onChange={(e) => setField('student_code', e.target.value.toUpperCase())}
                          className="w-full px-3 py-2.5 bg-stone-50 border border-brand-border rounded text-sm font-medium tracking-widest text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 transition-all"
                          placeholder="e.g. STU-0012" autoCapitalize="characters" />
                      </div>
                      <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-1.5">PIN</label>
                        <input required type="password" inputMode="numeric" maxLength={10}
                          value={studentForm.pin} onChange={(e) => setField('pin', e.target.value.replace(/\D/g, ''))}
                          className="w-full px-3 py-2.5 bg-stone-50 border border-brand-border rounded text-sm font-medium text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 transition-all tracking-widest"
                          placeholder="4-10 digit PIN" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-1.5">Class</label>
                        <input required type="text" value={studentForm.cohort_name} onChange={(e) => setField('cohort_name', e.target.value)}
                          className="w-full px-3 py-2.5 bg-stone-50 border border-brand-border rounded text-sm font-medium text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 transition-all"
                          placeholder="e.g. 10A" />
                      </div>
                      <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-1.5">Grade</label>
                        <Dropdown
                          value={String(studentForm.grade)}
                          onChange={(v) => setField('grade', Number(v))}
                          buttonClassName="w-full flex items-center justify-between gap-2 px-3 py-2.5 bg-stone-50 border border-brand-border rounded text-sm font-medium text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 transition-all"
                          options={[8, 9, 10, 11, 12].map((g) => ({ value: String(g), label: `Grade ${g}` }))}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-2">Subjects & Teachers</label>
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
                </div>

                <div className="flex gap-3 px-6 py-4 border-t border-brand-border/60 shrink-0">
                  <button type="button" onClick={() => setShowAddStudent(false)}
                    className="flex-1 py-2.5 text-sm font-bold text-stone-600 border border-brand-border rounded hover:bg-stone-50 transition-all">
                    Cancel
                  </button>
                  <button type="submit" form="admin-student-form" disabled={studentSubmitting}
                    className="flex-1 py-2.5 text-sm font-black text-white bg-accent rounded hover:bg-accent-soft transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                    {studentSubmitting
                      ? <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
                      : <>Add Student <ArrowRight className="w-4 h-4" /></>
                    }
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
