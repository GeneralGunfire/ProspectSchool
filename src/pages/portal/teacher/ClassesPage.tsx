import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, X, ArrowRight, Check, AlertCircle, BookOpen, Pencil, Trash2, Search } from 'lucide-react';
import type { TeacherSession } from '../../../lib/auth';
import {
  fetchSubjects, createStudent, updateStudent,
  removeStudentFromTeacher, fetchTeacherStudents,
  type Subject, type Student,
} from '../../../lib/students';

interface ClassesPageProps { session: TeacherSession; }

interface StudentForm {
  name: string; surname: string; student_code: string;
  pin: string; cohort: string; grade: string; subjects: string[];
}

const GRADES = ['8', '9', '10', '11', '12'];
const EMPTY: StudentForm = { name: '', surname: '', student_code: '', pin: '', cohort: '', grade: '', subjects: [] };

type ModalMode = 'add' | 'edit';

export default function ClassesPage({ session }: ClassesPageProps) {
  const [allSubjects, setAllSubjects] = useState<Subject[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalMode, setModalMode] = useState<ModalMode>('add');
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<StudentForm>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [confirmDelete, setConfirmDelete] = useState<Student | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Search + filter
  const [search, setSearch] = useState('');
  const [filterGrade, setFilterGrade] = useState<string>('');
  const [filterCohort, setFilterCohort] = useState<string>('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [subs, studs] = await Promise.all([
        fetchSubjects(),
        fetchTeacherStudents(session.teacher_id, session.school_id),
      ]);
      setAllSubjects(subs);
      if (studs.success) setStudents(studs.students);
      setLoading(false);
    }
    load();
  }, []);

  const reload = async () => {
    const result = await fetchTeacherStudents(session.teacher_id, session.school_id);
    if (result.success) setStudents(result.students);
  };

  const set = (field: keyof StudentForm, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const toggleSubject = (code: string) =>
    setForm((f) => ({
      ...f,
      subjects: f.subjects.includes(code)
        ? f.subjects.filter((s) => s !== code)
        : [...f.subjects, code],
    }));

  const openAdd = () => {
    setModalMode('add');
    setEditingStudent(null);
    setForm(EMPTY);
    setFormError(null);
    setShowForm(true);
  };

  const openEdit = (student: Student) => {
    setModalMode('edit');
    setEditingStudent(student);
    setForm({
      name: student.name,
      surname: student.surname,
      student_code: student.student_code,
      pin: '',
      cohort: student.cohort?.name ?? '',
      grade: String(student.grade),
      subjects: student.subjects?.map((s) => s.code) ?? [],
    });
    setFormError(null);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setForm(EMPTY);
    setFormError(null);
    setEditingStudent(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.subjects.length === 0) {
      setFormError('Please select at least one subject.');
      return;
    }
    setSubmitting(true);
    setFormError(null);

    if (modalMode === 'add') {
      const result = await createStudent({
        name: form.name, surname: form.surname,
        student_code: form.student_code, pin: form.pin,
        cohort_name: form.cohort, grade: parseInt(form.grade),
        subject_codes: form.subjects,
        teacher_id: session.teacher_id, school_id: session.school_id,
      });
      if (!result.success) { setFormError(result.error); setSubmitting(false); return; }
    } else if (modalMode === 'edit' && editingStudent) {
      const result = await updateStudent({
        student_id: editingStudent.id,
        teacher_id: session.teacher_id,
        school_id: session.school_id,
        name: form.name, surname: form.surname,
        cohort_name: form.cohort, grade: parseInt(form.grade),
        pin: form.pin || undefined,
        subject_codes: form.subjects,
      });
      if (!result.success) { setFormError(result.error); setSubmitting(false); return; }
    }

    await reload();
    closeForm();
    setSubmitting(false);
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    await removeStudentFromTeacher(session.teacher_id, confirmDelete.id, session.school_id);
    await reload();
    setConfirmDelete(null);
    setDeleting(false);
  };

  // Derive unique cohort names for filter dropdown
  const cohortOptions = useMemo(() => {
    const names = [...new Set(students.map(s => s.cohort?.name).filter(Boolean) as string[])].sort();
    return names;
  }, [students]);

  // Filtered list
  const filtered = useMemo(() => {
    return students.filter(s => {
      if (filterGrade && String(s.grade) !== filterGrade) return false;
      if (filterCohort && s.cohort?.name !== filterCohort) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          s.name.toLowerCase().includes(q) ||
          s.surname.toLowerCase().includes(q) ||
          s.student_code.toLowerCase().includes(q) ||
          s.subjects?.some(sub => sub.label.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [students, search, filterGrade, filterCohort]);

  return (
    <div className="p-5 md:p-8 max-w-7xl w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Portal</p>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Classes</h1>
        </div>
        <motion.button onClick={openAdd} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 bg-slate-900 text-white text-sm font-black px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-colors">
          <Plus className="w-4 h-4" /> Add Student
        </motion.button>
      </div>

      {/* Search + filter bar */}
      {!loading && students.length > 0 && (
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <div className="flex-1 min-w-48 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, code or subject…"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
          <select
            value={filterGrade}
            onChange={e => setFilterGrade(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
          >
            <option value="">All grades</option>
            {GRADES.map(g => <option key={g} value={g}>Grade {g}</option>)}
          </select>
          {cohortOptions.length > 0 && (
            <select
              value={filterCohort}
              onChange={e => setFilterCohort(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
            >
              <option value="">All classes</option>
              {cohortOptions.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          )}
          {(search || filterGrade || filterCohort) && (
            <button
              onClick={() => { setSearch(''); setFilterGrade(''); setFilterCohort(''); }}
              className="px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-black text-slate-500 hover:bg-slate-100 transition-colors"
            >
              Clear
            </button>
          )}
          <p className="text-xs font-bold text-slate-400 ml-auto">
            {filtered.length} of {students.length} student{students.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-5 h-5 border-2 border-slate-200 border-t-slate-700 rounded-full animate-spin" />
        </div>
      ) : students.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <Plus className="w-5 h-5 text-slate-400" />
          </div>
          <p className="font-bold text-slate-900 mb-1">No students yet</p>
          <p className="text-sm text-slate-400 mb-6">Add your first student to get started.</p>
          <button onClick={openAdd}
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-slate-900 border border-slate-200 hover:border-slate-300 px-5 py-2.5 rounded-xl transition-all">
            Add Student <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left px-5 py-3 text-xs font-black uppercase tracking-widest text-slate-400">Student</th>
                <th className="text-left px-5 py-3 text-xs font-black uppercase tracking-widest text-slate-400">Code</th>
                <th className="text-left px-5 py-3 text-xs font-black uppercase tracking-widest text-slate-400">Class</th>
                <th className="text-left px-5 py-3 text-xs font-black uppercase tracking-widest text-slate-400">Subjects</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-sm font-bold text-slate-400">
                    No students match your search.
                  </td>
                </tr>
              ) : filtered.map((s, i) => (
                <tr key={s.id} className={`border-b border-slate-50 hover:bg-slate-50 transition-colors ${i === filtered.length - 1 ? 'border-0' : ''}`}>
                  <td className="px-5 py-3.5 font-bold text-slate-900">{s.surname}, {s.name}</td>
                  <td className="px-5 py-3.5 font-mono text-slate-500 text-xs tracking-widest">{s.student_code}</td>
                  <td className="px-5 py-3.5 text-slate-500">{s.cohort ? s.cohort.name : `Gr ${s.grade}`}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex flex-wrap gap-1">
                      {s.subjects?.map((sub) => (
                        <span key={sub.id} className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg">
                          <BookOpen className="w-2.5 h-2.5" />{sub.label}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1 justify-end">
                      <button onClick={() => openEdit(s)}
                        className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setConfirmDelete(s)}
                        className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Modal */}

      <AnimatePresence>
        {showForm && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={closeForm} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100">
                  <h2 className="text-lg font-black text-slate-900">
                    {modalMode === 'add' ? 'Add Student' : 'Edit Student'}
                  </h2>
                  <button onClick={closeForm} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="overflow-y-auto flex-1 px-6 py-4">
                  <form id="student-form" onSubmit={handleSubmit} className="space-y-4">
                    {formError && (
                      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                        className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                        <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                        <p className="text-red-700 text-sm">{formError}</p>
                      </motion.div>
                    )}

                    {/* Name + Surname */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">Name</label>
                        <input required type="text" value={form.name} onChange={(e) => set('name', e.target.value)}
                          className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 transition-all"
                          placeholder="John" />
                      </div>
                      <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">Surname</label>
                        <input required type="text" value={form.surname} onChange={(e) => set('surname', e.target.value)}
                          className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 transition-all"
                          placeholder="Doe" />
                      </div>
                    </div>

                    {/* Student Code — readonly in edit mode */}
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">Student Code</label>
                      <input required type="text" value={form.student_code}
                        onChange={(e) => modalMode === 'add' && set('student_code', e.target.value.toUpperCase())}
                        readOnly={modalMode === 'edit'}
                        className={`w-full px-3 py-2.5 border rounded-xl text-sm font-medium tracking-widest transition-all focus:outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 ${
                          modalMode === 'edit' ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed' : 'bg-slate-50 border-slate-200 text-slate-900'
                        }`}
                        placeholder="e.g. STU-0001" autoCapitalize="characters" />
                    </div>

                    {/* PIN */}
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">
                        PIN {modalMode === 'edit' && <span className="normal-case font-medium text-slate-300">(leave blank to keep current)</span>}
                      </label>
                      <input type="password" inputMode="numeric" maxLength={10}
                        required={modalMode === 'add'}
                        value={form.pin} onChange={(e) => set('pin', e.target.value.replace(/\D/g, ''))}
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 transition-all tracking-widest"
                        placeholder={modalMode === 'edit' ? '••••••••••' : '10-digit PIN'} />
                    </div>

                    {/* Class + Grade */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">Class</label>
                        <input required type="text" value={form.cohort} onChange={(e) => set('cohort', e.target.value)}
                          className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 transition-all"
                          placeholder="e.g. 10A" />
                      </div>
                      <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-1.5">Grade</label>
                        <select required value={form.grade} onChange={(e) => set('grade', e.target.value)}
                          className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 transition-all">
                          <option value="">Select</option>
                          {GRADES.map((g) => <option key={g} value={g}>Grade {g}</option>)}
                        </select>
                      </div>
                    </div>

                    {/* Subjects */}
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                        Subjects you teach this student
                      </label>
                      <div className="grid grid-cols-2 gap-1.5">
                        {allSubjects.map((s) => {
                          const selected = form.subjects.includes(s.code);
                          return (
                            <button key={s.code} type="button" onClick={() => toggleSubject(s.code)}
                              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-left transition-all ${
                                selected ? 'bg-slate-900 text-white' : 'bg-slate-50 border border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900'
                              }`}>
                              <div className={`w-3.5 h-3.5 rounded flex items-center justify-center shrink-0 ${selected ? 'bg-white/20' : 'border border-slate-300'}`}>
                                {selected && <Check className="w-2.5 h-2.5" />}
                              </div>
                              {s.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </form>
                </div>

                <div className="flex gap-3 px-6 py-4 border-t border-slate-100">
                  <button type="button" onClick={closeForm}
                    className="flex-1 py-2.5 text-sm font-bold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all">
                    Cancel
                  </button>
                  <button type="submit" form="student-form" disabled={submitting}
                    className="flex-1 py-2.5 text-sm font-black text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                    {submitting
                      ? <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
                      : <>{modalMode === 'add' ? 'Add Student' : 'Save Changes'} <ArrowRight className="w-4 h-4" /></>
                    }
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete confirm */}
      <AnimatePresence>
        {confirmDelete && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setConfirmDelete(null)} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center mb-4">
                  <Trash2 className="w-5 h-5 text-red-500" />
                </div>
                <h2 className="text-base font-black text-slate-900 mb-1">Remove student?</h2>
                <p className="text-sm text-slate-500 mb-6">
                  This will remove <span className="font-bold text-slate-900">{confirmDelete.name} {confirmDelete.surname}</span> from your classes. If no other teacher teaches them, their account will be deleted.
                </p>
                <div className="flex gap-3">
                  <button onClick={() => setConfirmDelete(null)}
                    className="flex-1 py-2.5 text-sm font-bold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all">
                    Cancel
                  </button>
                  <button onClick={handleDelete} disabled={deleting}
                    className="flex-1 py-2.5 text-sm font-black text-white bg-red-600 rounded-xl hover:bg-red-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                    {deleting
                      ? <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      : 'Remove'
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
