import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus, X, ArrowRight, Check, AlertCircle,
  Pencil, ToggleLeft, ToggleRight, ShieldCheck
} from 'lucide-react';
import type { AdminSession } from '../../../lib/auth';
import {
  fetchSchoolTeachers, createTeacher, updateTeacher, setTeacherActive,
  type Teacher,
} from '../../../lib/teachers';

interface TeachersPageProps { session: AdminSession; }

interface TeacherForm {
  name: string; surname: string;
  teacher_code: string; pin: string;
  role: 'teacher' | 'school_admin';
}

const EMPTY: TeacherForm = { name: '', surname: '', teacher_code: '', pin: '', role: 'teacher' };
type ModalMode = 'add' | 'edit';

export default function TeachersPage({ session }: TeachersPageProps) {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalMode, setModalMode] = useState<ModalMode>('add');
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<TeacherForm>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    if (session.school_id) {
      const data = await fetchSchoolTeachers(session.school_id);
      setTeachers(data);
    }
    setLoading(false);
  };

  const set = (field: keyof TeacherForm, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const openAdd = () => {
    setModalMode('add');
    setEditingTeacher(null);
    setForm(EMPTY);
    setFormError(null);
    setShowForm(true);
  };

  const openEdit = (t: Teacher) => {
    setModalMode('edit');
    setEditingTeacher(t);
    setForm({ name: t.name, surname: t.surname, teacher_code: t.teacher_code, pin: '', role: t.role });
    setFormError(null);
    setShowForm(true);
  };

  const closeForm = () => { setShowForm(false); setForm(EMPTY); setFormError(null); };

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

  const formatDate = (d: string | null) => {
    if (!d) return 'Never';
    return new Date(d).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="px-4 py-6 sm:p-6 md:p-8 max-w-7xl w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="eyebrow">Admin</span>
          <h1 className="text-2xl font-black text-brand-dark tracking-tight">Teachers</h1>
        </div>
        <motion.button onClick={openAdd} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 bg-brand-dark text-white text-sm font-black px-5 py-2.5 rounded-xl hover:bg-brand-dark/90 transition-colors">
          <Plus className="w-4 h-4" /> Add Teacher
        </motion.button>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-5 h-5 border-2 border-brand-border border-t-stone-700 rounded-full animate-spin" />
        </div>
      ) : teachers.length === 0 ? (
        <div className="card-premium bg-white border border-brand-border rounded-[24px] p-12 text-center">
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
        <div className="card-premium bg-white border border-brand-border rounded-[24px] overflow-hidden">
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
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col">
                <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-brand-border/60">
                  <h2 className="text-lg font-black text-brand-dark">
                    {modalMode === 'add' ? 'Add Teacher' : 'Edit Teacher'}
                  </h2>
                  <button onClick={closeForm} className="p-2 rounded-xl hover:bg-stone-100 text-stone-500 hover:text-stone-700 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="px-6 py-4">
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
                  </form>
                </div>

                <div className="flex gap-3 px-6 py-4 border-t border-brand-border/60">
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
