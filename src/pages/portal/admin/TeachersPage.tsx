import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus, X, ArrowRight, Check, AlertCircle,
  Pencil, ToggleLeft, ToggleRight, ShieldCheck, Trash2
} from 'lucide-react';
import type { AdminSession } from '../../../lib/auth';
import {
  fetchSchoolTeachers, createTeacher, updateTeacher, setTeacherActive, deleteTeacher,
  fetchTeacherSubjects, setTeacherSubjects,
  type Teacher,
} from '../../../lib/teachers';
import { fetchSubjects, type Subject } from '../../../lib/students';
import { Shimmer } from '../../../shared/components/Shimmer';

const ease = [0.23, 1, 0.32, 1] as [number, number, number, number];

interface TeachersPageProps { session: AdminSession; }

interface TeacherForm {
  name: string; surname: string;
  teacher_code: string; pin: string;
  role: 'teacher' | 'school_admin';
}

interface SubjectGradeRow {
  subject_id: number | null;
  grade: number;
}

const EMPTY: TeacherForm = { name: '', surname: '', teacher_code: '', pin: '', role: 'teacher' };
const EMPTY_SUBJECT_ROW: SubjectGradeRow = { subject_id: null, grade: 10 };
type ModalMode = 'add' | 'edit';

export default function TeachersPage({ session }: TeachersPageProps) {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalMode, setModalMode] = useState<ModalMode>('add');
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<TeacherForm>(EMPTY);
  const [subjectRows, setSubjectRows] = useState<SubjectGradeRow[]>([{ ...EMPTY_SUBJECT_ROW }]);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Teacher | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    if (session.school_id) {
      const [data, subjectData] = await Promise.all([
        fetchSchoolTeachers(session.school_id),
        fetchSubjects(),
      ]);
      setTeachers(data);
      setSubjects(subjectData);
    }
    setLoading(false);
  };

  const setSubjectRow = (index: number, field: keyof SubjectGradeRow, value: number) => {
    setSubjectRows((prev) => prev.map((r, i) => (i === index ? { ...r, [field]: value } : r)));
  };
  const addSubjectRow = () => setSubjectRows((prev) => [...prev, { ...EMPTY_SUBJECT_ROW }]);
  const removeSubjectRow = (index: number) => setSubjectRows((prev) => prev.filter((_, i) => i !== index));

  const set = (field: keyof TeacherForm, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const openAdd = () => {
    setModalMode('add');
    setEditingTeacher(null);
    setForm(EMPTY);
    setSubjectRows([{ ...EMPTY_SUBJECT_ROW }]);
    setFormError(null);
    setShowForm(true);
  };

  const openEdit = async (t: Teacher) => {
    setModalMode('edit');
    setEditingTeacher(t);
    setForm({ name: t.name, surname: t.surname, teacher_code: t.teacher_code, pin: '', role: t.role });
    setFormError(null);
    setShowForm(true);
    const existing = await fetchTeacherSubjects(t.id);
    setSubjectRows(existing.length > 0
      ? existing.map((e) => ({ subject_id: e.subject_id, grade: e.grade }))
      : [{ ...EMPTY_SUBJECT_ROW }]);
  };

  const closeForm = () => { setShowForm(false); setForm(EMPTY); setSubjectRows([{ ...EMPTY_SUBJECT_ROW }]); setFormError(null); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);

    if (modalMode === 'add') {
      if (!/^\d{10}$/.test(form.pin)) {
        setFormError('PIN must be exactly 10 digits.');
        setSubmitting(false);
        return;
      }
      const result = await createTeacher({
        school_id: session.school_id!,
        name: form.name, surname: form.surname,
        teacher_code: form.teacher_code, pin: form.pin, role: form.role,
      });
      if (!result.success) { setFormError(result.error); setSubmitting(false); return; }

      if (form.role === 'teacher') {
        const pairs = subjectRows
          .filter((r): r is { subject_id: number; grade: number } => r.subject_id !== null)
          .map((r) => ({ subject_id: r.subject_id, grade: r.grade }));
        if (pairs.length > 0) await setTeacherSubjects(result.teacher.id, pairs);
      }
    } else if (editingTeacher) {
      if (form.pin && !/^\d{10}$/.test(form.pin)) {
        setFormError('PIN must be exactly 10 digits.');
        setSubmitting(false);
        return;
      }
      const result = await updateTeacher({
        teacher_id: editingTeacher.id,
        school_id: session.school_id!,
        name: form.name, surname: form.surname,
        role: form.role,
        pin: form.pin || undefined,
      });
      if (!result.success) { setFormError(result.error); setSubmitting(false); return; }

      const pairs = form.role === 'teacher'
        ? subjectRows
            .filter((r): r is { subject_id: number; grade: number } => r.subject_id !== null)
            .map((r) => ({ subject_id: r.subject_id, grade: r.grade }))
        : []; // school admins don't teach subjects — clear any existing rows
      await setTeacherSubjects(editingTeacher.id, pairs);
    }

    await load();
    closeForm();
    setSubmitting(false);
  };

  const handleToggle = async (t: Teacher) => {
    setTogglingId(t.id);
    await setTeacherActive(t.id, session.school_id!, !t.is_active);
    await load();
    setTogglingId(null);
  };

  const openDelete = (t: Teacher) => { setConfirmDelete(t); setDeleteError(null); };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    setDeleteError(null);
    const result = await deleteTeacher(confirmDelete.id, session.school_id!);
    if (!result.success) {
      setDeleteError(result.error);
      setDeleting(false);
      return;
    }
    await load();
    setConfirmDelete(null);
    setDeleting(false);
  };

  const formatDate = (d: string | null) => {
    if (!d) return 'Never';
    return new Date(d).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="student-home min-h-full pb-16">

      {/* ═══ Hero — full-width crested banner ═════════════════════ */}
      <div className="relative overflow-hidden bg-brand-dark border-b border-brand-border grain-surface flex flex-col justify-end min-h-[220px] sm:min-h-[260px] lg:min-h-[280px]">
        <div className="absolute inset-0 pointer-events-none">
          <motion.img src="/images/nizamiye-emblem.png" alt=""
            onLoad={() => setImgLoaded(true)}
            initial={{ opacity: 0 }} animate={{ opacity: imgLoaded ? 0.62 : 0 }}
            transition={{ duration: 0.6, ease }}
            className="w-full h-full object-cover" />
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(100deg, rgba(21,23,28,0.82) 0%, rgba(21,23,28,0.62) 35%, rgba(21,23,28,0.3) 62%, rgba(21,23,28,0.66) 100%)' }} />
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(180deg, rgba(21,23,28,0) 0%, transparent 45%, rgba(21,23,28,0.75) 100%)' }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 pt-8 sm:pt-11 pb-8 sm:pb-10 w-full flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/45 leading-none">Admin</p>
            <h1 className="font-display font-extrabold text-white text-[28px] sm:text-[40px] mt-3 leading-[1.1]"
              style={{ letterSpacing: '-0.02em', textShadow: '0 2px 20px rgba(0,0,0,0.35)' }}>
              Teachers
            </h1>
          </div>
          <motion.button onClick={openAdd} whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}
            className="edge-glow flex items-center gap-2 bg-accent text-white text-sm font-black px-5 py-2.5 rounded shrink-0 transition-colors duration-200 hover:bg-[#2a3350]">
            <Plus className="w-4 h-4" /> Add Teacher
          </motion.button>
        </div>
      </div>

      {/* ═══ Body ═══════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10 space-y-5 sm:space-y-6 pt-6 sm:pt-8">

      {/* List */}
      {loading ? (
        <div className="paper-card rounded p-5 space-y-3">
          {[0, 1, 2].map(i => <Shimmer key={i} className="h-10 w-full" />)}
        </div>
      ) : teachers.length === 0 ? (
        <div className="paper-card rounded p-12 text-center">
          <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center mx-auto mb-4">
            <Plus className="w-5 h-5 text-stone-500" />
          </div>
          <p className="font-bold text-brand-dark mb-1">No teachers yet</p>
          <p className="text-sm text-stone-500 mb-6">Add your first teacher to get started.</p>
          <button onClick={openAdd}
            className="inline-flex items-center gap-2 text-sm font-bold text-stone-700 hover:text-brand-dark border border-brand-border hover:border-stone-300 px-5 py-2.5 rounded-xl transition-all">
            Add Teacher <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="paper-card rounded overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-border/60">
                <th className="text-left px-5 py-3 text-xs font-black uppercase tracking-widest text-stone-500">Teacher</th>
                <th className="text-left px-5 py-3 text-xs font-black uppercase tracking-widest text-stone-500">Code</th>
                <th className="text-left px-5 py-3 text-xs font-black uppercase tracking-widest text-stone-500">Role</th>
                <th className="text-left px-5 py-3 text-xs font-black uppercase tracking-widest text-stone-500">Last Login</th>
                <th className="text-left px-5 py-3 text-xs font-black uppercase tracking-widest text-stone-500">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {teachers.map((t, i) => (
                <tr key={t.id} className={`border-b border-stone-50 transition-colors ${!t.is_active ? 'opacity-50' : 'hover:bg-stone-50'} ${i === teachers.length - 1 ? 'border-0' : ''}`}>
                  <td className="px-5 py-3.5">
                    <p className="font-bold text-brand-dark">{t.surname}, {t.name}</p>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-stone-500 text-xs tracking-widest">{t.teacher_code}</td>
                  <td className="px-5 py-3.5">
                    {t.role === 'school_admin' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-brand-dark text-white text-xs font-bold rounded-lg">
                        <ShieldCheck className="w-2.5 h-2.5" /> Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-stone-100 text-stone-600 text-xs font-bold rounded-lg">
                        Teacher
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-stone-500 text-xs">{formatDate(t.last_login_at)}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-block px-2 py-0.5 text-xs font-black rounded-lg ${t.is_active ? 'bg-green-50 text-green-700' : 'bg-stone-100 text-stone-500'}`}>
                      {t.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1 justify-end">
                      <button onClick={() => openEdit(t)}
                        className="p-2 rounded-lg hover:bg-stone-100 text-stone-500 hover:text-stone-700 transition-colors">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleToggle(t)} disabled={togglingId === t.id}
                        className="p-2 rounded-lg hover:bg-stone-100 text-stone-500 hover:text-stone-700 transition-colors disabled:opacity-40">
                        {t.is_active
                          ? <ToggleRight className="w-4 h-4 text-green-600" />
                          : <ToggleLeft className="w-4 h-4" />
                        }
                      </button>
                      <button onClick={() => openDelete(t)}
                        className="p-2 rounded-lg hover:bg-red-50 text-stone-500 hover:text-red-600 transition-colors">
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
      </div>

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
                <h2 className="text-base font-black text-brand-dark mb-1">Delete teacher?</h2>
                <p className="text-sm text-stone-500 mb-4">
                  This will permanently delete <span className="font-bold text-brand-dark">{confirmDelete.name} {confirmDelete.surname}</span>'s account. This cannot be undone.
                </p>
                {deleteError && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3 p-3 bg-red-50 border border-red-200 rounded-xl mb-4">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-red-700 text-sm">{deleteError}</p>
                  </motion.div>
                )}
                <div className="flex gap-3">
                  <button onClick={() => setConfirmDelete(null)}
                    className="flex-1 py-2.5 text-sm font-bold text-stone-600 border border-brand-border rounded-xl hover:bg-stone-50 transition-all">
                    Cancel
                  </button>
                  <button onClick={handleDelete} disabled={deleting}
                    className="flex-1 py-2.5 text-sm font-black text-white bg-red-600 rounded-xl hover:bg-red-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                    {deleting
                      ? <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      : 'Delete'
                    }
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

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
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-brand-border/60 shrink-0">
                  <h2 className="text-lg font-black text-brand-dark">
                    {modalMode === 'add' ? 'Add Teacher' : 'Edit Teacher'}
                  </h2>
                  <button onClick={closeForm} aria-label="Close" className="p-2 rounded-xl hover:bg-stone-100 text-stone-500 hover:text-stone-700 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="px-6 py-4 overflow-y-auto">
                  <form id="teacher-form" onSubmit={handleSubmit} className="space-y-4">
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
                        <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-1.5">Name</label>
                        <input required type="text" value={form.name} onChange={(e) => set('name', e.target.value)}
                          className="w-full px-3 py-2.5 bg-stone-50 border border-brand-border rounded-xl text-sm font-medium text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 transition-all"
                          placeholder="Jane" />
                      </div>
                      <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-1.5">Surname</label>
                        <input required type="text" value={form.surname} onChange={(e) => set('surname', e.target.value)}
                          className="w-full px-3 py-2.5 bg-stone-50 border border-brand-border rounded-xl text-sm font-medium text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 transition-all"
                          placeholder="Smith" />
                      </div>
                    </div>

                    {/* Teacher Code — locked in edit */}
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-1.5">Teacher Code</label>
                      <input required type="text" value={form.teacher_code}
                        onChange={(e) => modalMode === 'add' && set('teacher_code', e.target.value.toUpperCase())}
                        readOnly={modalMode === 'edit'}
                        className={`w-full px-3 py-2.5 border rounded-xl text-sm font-medium tracking-widest transition-all focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 ${
                          modalMode === 'edit' ? 'bg-stone-100 border-brand-border text-stone-500 cursor-not-allowed' : 'bg-stone-50 border-brand-border text-brand-dark'
                        }`}
                        placeholder="e.g. TCH-0002" autoCapitalize="characters" />
                    </div>

                    {/* PIN */}
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-1.5">
                        PIN {modalMode === 'edit' && <span className="normal-case font-medium text-stone-400">(leave blank to keep current)</span>}
                      </label>
                      <input type="password" inputMode="numeric" maxLength={10}
                        required={modalMode === 'add'}
                        value={form.pin} onChange={(e) => set('pin', e.target.value.replace(/\D/g, ''))}
                        className="w-full px-3 py-2.5 bg-stone-50 border border-brand-border rounded-xl text-sm font-medium text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 transition-all tracking-widest"
                        placeholder={modalMode === 'edit' ? '••••••••••' : '10-digit PIN'} />
                    </div>

                    {/* Role */}
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-2">Role</label>
                      <div className="grid grid-cols-2 gap-2">
                        {(['teacher', 'school_admin'] as const).map((r) => (
                          <button key={r} type="button" onClick={() => set('role', r)}
                            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                              form.role === r ? 'bg-brand-dark text-white border-brand-dark' : 'bg-stone-50 border-brand-border text-stone-600 hover:border-stone-300'
                            }`}>
                            <div className={`w-3.5 h-3.5 rounded flex items-center justify-center shrink-0 ${form.role === r ? 'bg-white/20' : 'border border-stone-300'}`}>
                              {form.role === r && <Check className="w-2.5 h-2.5" />}
                            </div>
                            {r === 'teacher' ? 'Teacher' : 'School Admin'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Subjects & Grades — teachers only, not school admins */}
                    {form.role === 'teacher' && (
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-2">Subjects Taught</label>
                      <div className="space-y-2">
                        {subjectRows.map((row, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <select value={row.subject_id ?? ''} onChange={(e) => setSubjectRow(i, 'subject_id', Number(e.target.value))}
                              className="flex-1 min-w-0 px-3 py-2.5 bg-stone-50 border border-brand-border rounded-xl text-sm font-medium text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 transition-all">
                              <option value="">Select subject</option>
                              {subjects.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                            </select>
                            <select value={row.grade} onChange={(e) => setSubjectRow(i, 'grade', Number(e.target.value))}
                              className="w-32 shrink-0 px-3 py-2.5 bg-stone-50 border border-brand-border rounded-xl text-sm font-medium text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 transition-all">
                              {[8, 9, 10, 11, 12].map((g) => <option key={g} value={g}>Grade {g}</option>)}
                            </select>
                            {subjectRows.length > 1 && (
                              <button type="button" onClick={() => removeSubjectRow(i)}
                                className="p-2 rounded-lg hover:bg-red-50 text-stone-400 hover:text-red-600 transition-colors shrink-0">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                      <button type="button" onClick={addSubjectRow}
                        className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-brand-dark transition-colors">
                        <Plus className="w-3.5 h-3.5" /> Add another subject
                      </button>
                    </div>
                    )}
                  </form>
                </div>

                <div className="flex gap-3 px-6 py-4 border-t border-brand-border/60 shrink-0">
                  <button type="button" onClick={closeForm}
                    className="flex-1 py-2.5 text-sm font-bold text-stone-600 border border-brand-border rounded-xl hover:bg-stone-50 transition-all">
                    Cancel
                  </button>
                  <button type="submit" form="teacher-form" disabled={submitting}
                    className="flex-1 py-2.5 text-sm font-black text-white bg-brand-dark rounded-xl hover:bg-brand-dark/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                    {submitting
                      ? <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
                      : <>{modalMode === 'add' ? 'Add Teacher' : 'Save Changes'} <ArrowRight className="w-4 h-4" /></>
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
