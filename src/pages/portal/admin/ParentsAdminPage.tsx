import { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { Plus, ArrowRight, AlertCircle, Pencil, ToggleLeft, ToggleRight, Trash2, Search } from 'lucide-react';
import type { AdminSession } from '../../../lib/auth';
import {
  fetchSchoolParents, createParent, updateParent, deleteParent, setParentChildren,
  type Parent, type ParentChild,
} from '../../../lib/parents';
import { fetchSchoolStudentDirectory, type DirectoryStudent } from '../../../lib/students';
import { Shimmer } from '../../../shared/components/Shimmer';
import Checkbox from '../../../shared/components/Checkbox';
import Modal from '../../../shared/components/Modal';

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
    <div className="student-home min-h-full pb-16 relative">

      {/* ═══ Header ═══════════════════════════════════════════════ */}
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-5 flex flex-wrap items-end justify-between gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }}>
          <p className="text-[12px] text-[rgba(31,36,33,0.5)] font-medium">Admin</p>
          <h1 className="text-brand-dark text-[30px] sm:text-[36px] leading-tight mt-1" style={{ fontWeight: 600 }}>
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-linear-to-r from-sky-500 via-sky-600 to-blue-600">
                Parents
              </span>
              <svg aria-hidden="true" viewBox="0 0 320 14" className="absolute left-0 -bottom-1 w-full h-3 text-amber-500/70" preserveAspectRatio="none">
                <path d="M2 9C60 3 180 2 318 8" stroke="currentColor" strokeWidth="3.5" fill="none" strokeLinecap="round" />
              </svg>
            </span>
          </h1>
        </motion.div>
        <motion.button onClick={openAdd} whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}
          className="flex items-center gap-1 text-[14px] font-semibold transition-colors shrink-0" style={{ color: 'var(--color-navy)' }}>
          <Plus className="w-3.5 h-3.5" /> Add parent
        </motion.button>
      </div>

      {/* ═══ Body ═══════════════════════════════════════════════ */}
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4">

      {loading ? (
        <div className="paper-card rounded p-5 space-y-3">
          {[0, 1, 2].map(i => <Shimmer key={i} className="h-10 w-full" />)}
        </div>
      ) : parents.length === 0 ? (
        <div className="paper-card rounded p-12 text-center">
          <p className="font-bold text-brand-dark mb-1">No parents yet</p>
          <p className="text-sm text-stone-500 mb-6">Add a parent account and link it to their child.</p>
          <button onClick={openAdd}
            className="inline-flex items-center gap-1 text-[14px] font-semibold transition-colors" style={{ color: 'var(--color-navy)' }}>
            Add parent <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="paper-card rounded overflow-hidden">
          <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-border/60">
                <th className="text-left px-5 py-3 text-[12px] font-semibold text-muted-2">Parent</th>
                <th className="text-left px-5 py-3 text-[12px] font-semibold text-muted-2">Code</th>
                <th className="text-left px-5 py-3 text-[12px] font-semibold text-muted-2">Children</th>
                <th className="text-left px-5 py-3 text-[12px] font-semibold text-muted-2">Last login</th>
                <th className="text-left px-5 py-3 text-[12px] font-semibold text-muted-2">Status</th>
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
      <Modal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} maxWidth="max-w-sm"
        footer={<>
          <button onClick={() => setConfirmDelete(null)}
            className="text-[14px] font-semibold text-stone-500 hover:text-stone-700 transition-colors">
            Cancel
          </button>
          <button onClick={handleDelete} disabled={deleting}
            className="text-[14px] font-semibold text-red-600 hover:text-red-700 transition-colors disabled:opacity-50">
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </>}
      >
        <h2 className="text-base font-black text-brand-dark mb-1">Delete parent?</h2>
        <p className="text-sm text-stone-500">
          This will permanently delete <span className="font-bold text-brand-dark">{confirmDelete?.name} {confirmDelete?.surname}</span>'s account. This cannot be undone.
        </p>
        {deleteError && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            className="flex gap-3 p-3 bg-red-50 border border-red-200 rounded mt-4">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <p className="text-red-700 text-sm">{deleteError}</p>
          </motion.div>
        )}
      </Modal>

      {/* Add / Edit Modal */}
      <Modal open={showForm} onClose={closeForm} title={modalMode === 'add' ? 'Add parent' : 'Edit parent'}
        footer={<>
          <button type="button" onClick={closeForm}
            className="text-[14px] font-semibold text-stone-500 hover:text-stone-700 transition-colors">
            Cancel
          </button>
          <button type="submit" form="parent-form" disabled={submitting}
            className="text-[14px] font-semibold transition-colors disabled:opacity-50 flex items-center gap-2" style={{ color: 'var(--color-navy)' }}>
            {submitting
              ? <><div className="w-3.5 h-3.5 border-2 border-current/30 border-t-current rounded-full animate-spin" /> Saving...</>
              : <>{modalMode === 'add' ? 'Add parent' : 'Save changes'} <ArrowRight className="w-3.5 h-3.5" /></>
            }
          </button>
        </>}
      >
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
              <label className="block text-[12px] text-muted-2 mb-1.5">Name</label>
              <input required type="text" value={form.name} onChange={(e) => set('name', e.target.value)}
                className="w-full px-3 py-2.5 bg-stone-50 border border-brand-border rounded text-sm font-medium text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 transition-all"
                placeholder="Jane" />
            </div>
            <div>
              <label className="block text-[12px] text-muted-2 mb-1.5">Surname</label>
              <input required type="text" value={form.surname} onChange={(e) => set('surname', e.target.value)}
                className="w-full px-3 py-2.5 bg-stone-50 border border-brand-border rounded text-sm font-medium text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 transition-all"
                placeholder="Smith" />
            </div>
          </div>

          <div>
            <label className="block text-[12px] text-muted-2 mb-1.5">Parent code</label>
            <input required type="text" value={form.parent_code}
              onChange={(e) => modalMode === 'add' && set('parent_code', e.target.value.toUpperCase())}
              readOnly={modalMode === 'edit'}
              className={`w-full px-3 py-2.5 border rounded text-sm font-medium tracking-widest transition-all focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 ${
                modalMode === 'edit' ? 'bg-stone-100 border-brand-border text-stone-500 cursor-not-allowed' : 'bg-stone-50 border-brand-border text-brand-dark'
              }`}
              placeholder="e.g. PAR-0001" autoCapitalize="characters" />
          </div>

          <div>
            <label className="block text-[12px] text-muted-2 mb-1.5">
              PIN {modalMode === 'edit' && <span className="font-medium text-stone-400">(leave blank to keep current)</span>}
            </label>
            <input type="password" inputMode="numeric" maxLength={10}
              required={modalMode === 'add'}
              value={form.pin} onChange={(e) => set('pin', e.target.value.replace(/\D/g, ''))}
              className="w-full px-3 py-2.5 bg-stone-50 border border-brand-border rounded text-sm font-medium text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 transition-all tracking-widest"
              placeholder={modalMode === 'edit' ? '••••••••••' : '10-digit PIN'} />
          </div>

          <div>
            <label className="block text-[12px] text-muted-2 mb-2">
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
                  <div key={s.id} className="flex items-center gap-2.5 px-3 py-2.5 hover:bg-stone-50 transition-colors">
                    <Checkbox
                      checked={selectedStudentIds.has(s.id)}
                      onChange={() => toggleStudent(s.id)}
                    />
                    <span className="text-xs font-bold text-brand-dark">{s.surname}, {s.name}</span>
                    <span className="text-[10px] text-stone-400 ml-auto font-mono">{s.student_code}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}
