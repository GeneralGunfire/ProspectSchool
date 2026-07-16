import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, X, ArrowRight, AlertCircle, Pencil, ToggleLeft, ToggleRight, Trash2, Search } from 'lucide-react';
import type { AdminSession } from '../../../lib/auth';
import {
  fetchSchoolParents, createParent, updateParent, deleteParent, setParentChildren,
  type Parent, type ParentChild,
} from '../../../lib/parents';
import { fetchSchoolStudentDirectory, type DirectoryStudent } from '../../../lib/students';
import { Shimmer } from '../../../shared/components/Shimmer';

const ease = [0.23, 1, 0.32, 1] as [number, number, number, number];

interface ParentsAdminPageProps { session: AdminSession; }

interface ParentForm {
  name: string; surname: string;
  parent_code: string; pin: string;
}

const EMPTY: ParentForm = { name: '', surname: '', parent_code: '', pin: '' };
type ModalMode = 'add' | 'edit';
type ParentWithChildren = Parent & { children: ParentChild[] };

export default function ParentsAdminPage({ session }: ParentsAdminPageProps) {
  const [parents, setParents] = useState<ParentWithChildren[]>([]);
  const [students, setStudents] = useState<DirectoryStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalMode, setModalMode] = useState<ModalMode>('add');
  const [editingParent, setEditingParent] = useState<ParentWithChildren | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<ParentForm>(EMPTY);
  const [selectedStudentIds, setSelectedStudentIds] = useState<Set<number>>(new Set());
  const [studentSearch, setStudentSearch] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<ParentWithChildren | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    if (session.school_id) {
      const [parentData, studentData] = await Promise.all([
        fetchSchoolParents(session.school_id),
        fetchSchoolStudentDirectory(session.school_id),
      ]);
      setParents(parentData);
      setStudents(studentData);
    }
    setLoading(false);
  };

  const set = (field: keyof ParentForm, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const openAdd = () => {
    setModalMode('add');
    setEditingParent(null);
    setForm(EMPTY);
    setSelectedStudentIds(new Set());
    setStudentSearch('');
    setFormError(null);
    setShowForm(true);
  };

  const openEdit = (p: ParentWithChildren) => {
    setModalMode('edit');
    setEditingParent(p);
    setForm({ name: p.name, surname: p.surname, parent_code: p.parent_code, pin: '' });
    setSelectedStudentIds(new Set(p.children.map((c) => c.student_id)));
    setStudentSearch('');
    setFormError(null);
    setShowForm(true);
  };

  const closeForm = () => { setShowForm(false); setForm(EMPTY); setSelectedStudentIds(new Set()); setFormError(null); };

  const toggleStudent = (id: number) => {
    setSelectedStudentIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const filteredStudents = useMemo(() => {
    const q = studentSearch.trim().toLowerCase();
    if (!q) return students;
    return students.filter((s) =>
      `${s.name} ${s.surname}`.toLowerCase().includes(q) || s.student_code.toLowerCase().includes(q)
    );
  }, [students, studentSearch]);

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
      const result = await createParent({
        school_id: session.school_id!,
        name: form.name, surname: form.surname,
        parent_code: form.parent_code, pin: form.pin,
        student_ids: [...selectedStudentIds],
      });
      if (!result.success) { setFormError(result.error); setSubmitting(false); return; }
    } else if (editingParent) {
      if (form.pin && !/^\d{10}$/.test(form.pin)) {
        setFormError('PIN must be exactly 10 digits.');
        setSubmitting(false);
        return;
      }
      const result = await updateParent(editingParent.id, {
        name: form.name, surname: form.surname,
        pin: form.pin || undefined,
      });
      if (!result.success) { setFormError(result.error); setSubmitting(false); return; }
      await setParentChildren(editingParent.id, [...selectedStudentIds]);
    }

    await load();
    closeForm();
    setSubmitting(false);
  };

  const handleToggle = async (p: ParentWithChildren) => {
    setTogglingId(p.id);
    await updateParent(p.id, { is_active: !p.is_active });
    await load();
    setTogglingId(null);
  };

  const openDelete = (p: ParentWithChildren) => { setConfirmDelete(p); setDeleteError(null); };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    setDeleteError(null);
    const result = await deleteParent(confirmDelete.id);
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
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 pt-8 sm:pt-11 pb-8 sm:pb-10 w-full flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/45 leading-none">Admin</p>
            <h1 className="font-display font-extrabold text-white text-[28px] sm:text-[40px] mt-3 leading-[1.1]"
              style={{ letterSpacing: '-0.02em', textShadow: '0 2px 20px rgba(0,0,0,0.35)' }}>
              Parents
            </h1>
          </div>
          <motion.button onClick={openAdd} whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}
            className="edge-glow flex items-center gap-2 bg-accent text-white text-sm font-black px-5 py-2.5 rounded shrink-0 transition-colors duration-200 hover:bg-[#2a3350]">
            <Plus className="w-4 h-4" /> Add Parent
          </motion.button>
        </div>
      </div>

      {/* ═══ Body ═══════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10 space-y-5 sm:space-y-6 pt-6 sm:pt-8">

      {loading ? (
        <div className="paper-card rounded p-5 space-y-3">
          {[0, 1, 2].map(i => <Shimmer key={i} className="h-10 w-full" />)}
        </div>
      ) : parents.length === 0 ? (
        <div className="paper-card rounded p-12 text-center">
          <div className="w-12 h-12 rounded bg-stone-100 flex items-center justify-center mx-auto mb-4">
            <Plus className="w-5 h-5 text-stone-500" />
          </div>
          <p className="font-bold text-brand-dark mb-1">No parents yet</p>
          <p className="text-sm text-stone-500 mb-6">Add a parent account and link it to their child.</p>
          <button onClick={openAdd}
            className="inline-flex items-center gap-2 text-sm font-bold text-stone-700 hover:text-brand-dark border border-brand-border hover:border-stone-300 px-5 py-2.5 rounded transition-all">
            Add Parent <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="paper-card rounded overflow-hidden">
          <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-border/60">
                <th className="text-left px-5 py-3 text-xs font-black uppercase tracking-widest text-stone-500">Parent</th>
                <th className="text-left px-5 py-3 text-xs font-black uppercase tracking-widest text-stone-500">Code</th>
                <th className="text-left px-5 py-3 text-xs font-black uppercase tracking-widest text-stone-500">Children</th>
                <th className="text-left px-5 py-3 text-xs font-black uppercase tracking-widest text-stone-500">Last Login</th>
                <th className="text-left px-5 py-3 text-xs font-black uppercase tracking-widest text-stone-500">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {parents.map((p, i) => (
                <tr key={p.id} className={`border-b border-stone-50 transition-colors ${!p.is_active ? 'opacity-50' : 'hover:bg-stone-50'} ${i === parents.length - 1 ? 'border-0' : ''}`}>
                  <td className="px-5 py-3.5">
                    <p className="font-bold text-brand-dark">{p.surname}, {p.name}</p>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-stone-500 text-xs tracking-widest">{p.parent_code}</td>
                  <td className="px-5 py-3.5">
                    {p.children.length === 0 ? (
                      <span className="text-xs text-stone-400">No children linked</span>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {p.children.map((c) => (
                          <span key={c.student_id} className="text-xs font-bold text-stone-600 bg-stone-100 px-2 py-0.5 rounded-lg">
                            {c.name} {c.surname}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-stone-500 text-xs">{formatDate(p.last_login_at)}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-block px-2 py-0.5 text-xs font-black rounded-lg ${p.is_active ? 'bg-green-50 text-green-700' : 'bg-stone-100 text-stone-500'}`}>
                      {p.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1 justify-end">
                      <button onClick={() => openEdit(p)}
                        className="p-2 rounded-lg hover:bg-stone-100 text-stone-500 hover:text-stone-700 transition-colors">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleToggle(p)} disabled={togglingId === p.id}
                        className="p-2 rounded-lg hover:bg-stone-100 text-stone-500 hover:text-stone-700 transition-colors disabled:opacity-40">
                        {p.is_active
                          ? <ToggleRight className="w-4 h-4 text-green-600" />
                          : <ToggleLeft className="w-4 h-4" />
                        }
                      </button>
                      <button onClick={() => openDelete(p)}
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
                <div className="w-10 h-10 rounded bg-red-50 flex items-center justify-center mb-4">
                  <Trash2 className="w-5 h-5 text-red-500" />
                </div>
                <h2 className="text-base font-black text-brand-dark mb-1">Delete parent?</h2>
                <p className="text-sm text-stone-500 mb-4">
                  This will permanently delete <span className="font-bold text-brand-dark">{confirmDelete.name} {confirmDelete.surname}</span>'s account. This cannot be undone.
                </p>
                {deleteError && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3 p-3 bg-red-50 border border-red-200 rounded mb-4">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-red-700 text-sm">{deleteError}</p>
                  </motion.div>
                )}
                <div className="flex gap-3">
                  <button onClick={() => setConfirmDelete(null)}
                    className="flex-1 py-2.5 text-sm font-bold text-stone-600 border border-brand-border rounded hover:bg-stone-50 transition-all">
                    Cancel
                  </button>
                  <button onClick={handleDelete} disabled={deleting}
                    className="flex-1 py-2.5 text-sm font-black text-white bg-red-600 rounded hover:bg-red-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
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
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col max-h-[85vh]">
                <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-brand-border/60 shrink-0">
                  <h2 className="text-lg font-black text-brand-dark">
                    {modalMode === 'add' ? 'Add Parent' : 'Edit Parent'}
                  </h2>
                  <button onClick={closeForm} aria-label="Close" className="p-2 rounded hover:bg-stone-100 text-stone-500 hover:text-stone-700 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="px-6 py-4 overflow-y-auto">
                  <form id="parent-form" onSubmit={handleSubmit} className="space-y-4">
                    {formError && (
                      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                        className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded">
                        <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                        <p className="text-red-700 text-sm">{formError}</p>
                      </motion.div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-1.5">Name</label>
                        <input required type="text" value={form.name} onChange={(e) => set('name', e.target.value)}
                          className="w-full px-3 py-2.5 bg-stone-50 border border-brand-border rounded text-sm font-medium text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 transition-all"
                          placeholder="Jane" />
                      </div>
                      <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-1.5">Surname</label>
                        <input required type="text" value={form.surname} onChange={(e) => set('surname', e.target.value)}
                          className="w-full px-3 py-2.5 bg-stone-50 border border-brand-border rounded text-sm font-medium text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 transition-all"
                          placeholder="Smith" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-1.5">Parent Code</label>
                      <input required type="text" value={form.parent_code}
                        onChange={(e) => modalMode === 'add' && set('parent_code', e.target.value.toUpperCase())}
                        readOnly={modalMode === 'edit'}
                        className={`w-full px-3 py-2.5 border rounded text-sm font-medium tracking-widest transition-all focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 ${
                          modalMode === 'edit' ? 'bg-stone-100 border-brand-border text-stone-500 cursor-not-allowed' : 'bg-stone-50 border-brand-border text-brand-dark'
                        }`}
                        placeholder="e.g. PAR-0001" autoCapitalize="characters" />
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-1.5">
                        PIN {modalMode === 'edit' && <span className="normal-case font-medium text-stone-400">(leave blank to keep current)</span>}
                      </label>
                      <input type="password" inputMode="numeric" maxLength={10}
                        required={modalMode === 'add'}
                        value={form.pin} onChange={(e) => set('pin', e.target.value.replace(/\D/g, ''))}
                        className="w-full px-3 py-2.5 bg-stone-50 border border-brand-border rounded text-sm font-medium text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 transition-all tracking-widest"
                        placeholder={modalMode === 'edit' ? '••••••••••' : '10-digit PIN'} />
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-2">
                        Children ({selectedStudentIds.size} selected)
                      </label>
                      <div className="relative mb-2">
                        <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          value={studentSearch}
                          onChange={(e) => setStudentSearch(e.target.value)}
                          placeholder="Search students..."
                          className="w-full pl-9 pr-3 py-2 rounded border border-brand-border bg-stone-50 text-xs font-medium focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10"
                        />
                      </div>
                      <div className="max-h-44 overflow-y-auto border border-brand-border rounded divide-y divide-stone-50">
                        {filteredStudents.length === 0 ? (
                          <p className="text-xs text-stone-400 px-3 py-3 text-center">No students found.</p>
                        ) : (
                          filteredStudents.map((s) => (
                            <label key={s.id} className="flex items-center gap-2.5 px-3 py-2 cursor-pointer hover:bg-stone-50 transition-colors">
                              <input
                                type="checkbox"
                                checked={selectedStudentIds.has(s.id)}
                                onChange={() => toggleStudent(s.id)}
                                className="w-3.5 h-3.5 rounded border-brand-border accent-accent"
                              />
                              <span className="text-xs font-bold text-brand-dark">{s.surname}, {s.name}</span>
                              <span className="text-[10px] text-stone-400 ml-auto font-mono">{s.student_code}</span>
                            </label>
                          ))
                        )}
                      </div>
                    </div>
                  </form>
                </div>

                <div className="flex gap-3 px-6 py-4 border-t border-brand-border/60 shrink-0">
                  <button type="button" onClick={closeForm}
                    className="flex-1 py-2.5 text-sm font-bold text-stone-600 border border-brand-border rounded hover:bg-stone-50 transition-all">
                    Cancel
                  </button>
                  <button type="submit" form="parent-form" disabled={submitting}
                    className="flex-1 py-2.5 text-sm font-black text-white bg-brand-dark rounded hover:bg-brand-dark/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                    {submitting
                      ? <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
                      : <>{modalMode === 'add' ? 'Add Parent' : 'Save Changes'} <ArrowRight className="w-4 h-4" /></>
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
