import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, X, ArrowRight, Check, AlertCircle, BookOpen, Pencil, Trash2, Search, TrendingUp, Phone, Clock } from 'lucide-react';
import type { TeacherSession } from '../../../lib/auth';
import {
  fetchSubjects, createStudent, updateStudent,
  removeStudentFromTeacher, fetchTeacherStudents,
  type Subject, type Student,
} from '../../../lib/students';
import {
  fetchStudentTiers,
  type StudentTierSummary, type LearnerTier,
} from '../../../lib/teacherAnalytics';
import {
  fetchLastContactDates, logParentContact, fetchParentContacts, deleteParentContact,
  lastContactLabel, daysSince,
  CONTACT_METHOD_LABELS,
  type ContactMethod, type ParentContact,
} from '../../../lib/parentContacts';

interface ClassesPageProps { session: TeacherSession; onNavigate?: (page: string) => void; }

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

  // Smart grouping by performance tier
  const [groupByTier, setGroupByTier] = useState(false);
  const [tiers, setTiers] = useState<StudentTierSummary[]>([]);
  const [tiersLoading, setTiersLoading] = useState(false);

  // Parent contact log
  const [lastContacts, setLastContacts]       = useState<Map<number, string>>(new Map());
  const [contactModal, setContactModal]       = useState<Student | null>(null);
  const [contactHistory, setContactHistory]   = useState<ParentContact[]>([]);
  const [contactHistoryLoading, setContactHistoryLoading] = useState(false);
  const [contactMethod, setContactMethod]     = useState<ContactMethod>('call');
  const [contactNote, setContactNote]         = useState('');
  const [contactSaving, setContactSaving]     = useState(false);

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

      // Non-blocking: load tier data for grouping
      setTiersLoading(true);
      fetchStudentTiers(session.teacher_id, session.school_id)
        .then(setTiers)
        .finally(() => setTiersLoading(false));

      // Non-blocking: load last contact dates for all students
      if (studs.success && studs.students.length > 0) {
        fetchLastContactDates(
          session.teacher_id,
          session.school_id,
          studs.students.map(s => s.id),
        ).then(setLastContacts);
      }
    }
    load();
  }, []);

  const reload = async () => {
    const result = await fetchTeacherStudents(session.teacher_id, session.school_id);
    if (result.success) setStudents(result.students);
  };

  // ── Parent contact handlers ───────────────────────────────────────────────

  async function openContactModal(student: Student) {
    setContactModal(student);
    setContactMethod('call');
    setContactNote('');
    setContactHistoryLoading(true);
    setContactHistory([]);
    const history = await fetchParentContacts(student.id, session.teacher_id);
    setContactHistory(history);
    setContactHistoryLoading(false);
  }

  function closeContactModal() {
    setContactModal(null);
    setContactHistory([]);
    setContactNote('');
  }

  async function handleLogContact() {
    if (!contactModal) return;
    setContactSaving(true);
    const contact = await logParentContact(
      contactModal.id,
      session.teacher_id,
      session.school_id,
      contactMethod,
      contactNote,
    );
    setContactSaving(false);
    if (contact) {
      // Update chip map immediately
      setLastContacts(prev => new Map(prev).set(contactModal.id, contact.createdAt));
      // Prepend to history
      setContactHistory(prev => [contact, ...prev]);
      setContactNote('');
    }
  }

  async function handleDeleteContact(id: number) {
    await deleteParentContact(id, session.teacher_id);
    setContactHistory(prev => prev.filter(c => c.id !== id));
    // If we deleted the latest, refresh dates
    const updated = await fetchParentContacts(contactModal!.id, session.teacher_id);
    setContactHistory(updated);
    if (updated.length > 0) {
      setLastContacts(prev => new Map(prev).set(contactModal!.id, updated[0].createdAt));
    } else {
      setLastContacts(prev => { const m = new Map(prev); m.delete(contactModal!.id); return m; });
    }
  }

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

  // Derive unique cohort names for filter dropdown, with a per-class headcount
  const cohortOptions = useMemo(() => {
    const names = [...new Set(students.map(s => s.cohort?.name).filter(Boolean) as string[])].sort();
    return names;
  }, [students]);

  const cohortCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const s of students) {
      if (!s.cohort?.name) continue;
      counts.set(s.cohort.name, (counts.get(s.cohort.name) ?? 0) + 1);
    }
    return counts;
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
    <div className="max-w-3xl mx-auto px-4 py-6 sm:p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="eyebrow">Portal</span>
          <h1 className="text-2xl font-black text-brand-dark tracking-tight">Classes</h1>
        </div>
        <motion.button onClick={openAdd} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 bg-brand-dark text-white text-sm font-black px-5 py-2.5 rounded-xl hover:bg-brand-dark/90 transition-colors">
          <Plus className="w-4 h-4" /> Add Student
        </motion.button>
      </div>

      {/* Class switcher — pill tabs, e.g. 10A / 10B, like the reference the student portal uses */}
      {!loading && cohortOptions.length > 0 && (
        <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
          <button
            onClick={() => setFilterCohort('')}
            className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-bold transition-all duration-150 ${
              filterCohort === ''
                ? 'bg-brand-dark text-white shadow-sm'
                : 'bg-white border border-brand-border text-stone-500 hover:border-stone-400'
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
                    : 'bg-white border border-brand-border text-stone-500 hover:border-stone-400'
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

      {/* Search + filter bar */}
      {!loading && students.length > 0 && (
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <div className="flex-1 min-w-48 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, code or subject…"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-brand-border text-sm font-bold text-brand-dark placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-dark"
            />
          </div>
          <select
            value={filterGrade}
            onChange={e => setFilterGrade(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-brand-border text-sm font-bold text-stone-700 focus:outline-none focus:ring-2 focus:ring-brand-dark bg-white"
          >
            <option value="">All grades</option>
            {GRADES.map(g => <option key={g} value={g}>Grade {g}</option>)}
          </select>
          {(search || filterGrade || filterCohort) && (
            <button
              onClick={() => { setSearch(''); setFilterGrade(''); setFilterCohort(''); }}
              className="px-3 py-2.5 rounded-xl border border-brand-border text-sm font-black text-stone-500 hover:bg-stone-100 transition-colors"
            >
              Clear
            </button>
          )}
          <p className="text-xs font-bold text-stone-500 ml-auto">
            {filtered.length} of {students.length} student{students.length !== 1 ? 's' : ''}
          </p>
          {/* Group by performance toggle */}
          <button
            onClick={() => setGroupByTier(g => !g)}
            disabled={tiersLoading}
            className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs font-black transition-all ${
              groupByTier
                ? 'bg-brand-dark text-white border-brand-dark'
                : 'bg-white text-stone-500 border-brand-border hover:border-stone-400'
            } disabled:opacity-40`}
            title="Group students by performance tier"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Group
          </button>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-5 h-5 border-2 border-brand-border border-t-stone-700 rounded-full animate-spin" />
        </div>
      ) : students.length === 0 ? (
        <div className="card-premium bg-white border border-brand-border rounded-[24px] p-12 text-center">
          <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center mx-auto mb-4">
            <Plus className="w-5 h-5 text-stone-500" />
          </div>
          <p className="font-bold text-brand-dark mb-1">No students yet</p>
          <p className="text-sm text-stone-500 mb-6">Add your first student to get started.</p>
          <button onClick={openAdd}
            className="inline-flex items-center gap-2 text-sm font-bold text-stone-700 hover:text-brand-dark border border-brand-border hover:border-stone-300 px-5 py-2.5 rounded-xl transition-all">
            Add Student <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : groupByTier ? (
        // ── Grouped by performance tier ────────────────────────────
        <TierGroupView
          students={students}
          tiers={tiers}
          filtered={filtered}
          onEdit={openEdit}
          onDelete={setConfirmDelete}
        />
      ) : (
        // ── Flat table ─────────────────────────────────────────────
        <div className="card-premium bg-white border border-brand-border rounded-[24px] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-border/60">
                <th className="text-left px-5 py-3 text-xs font-black uppercase tracking-widest text-stone-500">Student</th>
                <th className="text-left px-5 py-3 text-xs font-black uppercase tracking-widest text-stone-500">Code</th>
                <th className="text-left px-5 py-3 text-xs font-black uppercase tracking-widest text-stone-500">Class</th>
                <th className="text-left px-5 py-3 text-xs font-black uppercase tracking-widest text-stone-500 hidden md:table-cell">Subjects</th>
                <th className="text-left px-5 py-3 text-xs font-black uppercase tracking-widest text-stone-500 hidden lg:table-cell">Last Contact</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-sm font-bold text-stone-500">
                    No students match your search.
                  </td>
                </tr>
              ) : filtered.map((s, i) => {
                const lastContact = lastContacts.get(s.id);
                const contactDays = lastContact ? daysSince(lastContact) : null;
                const contactChipColor = contactDays === null ? 'bg-stone-100 text-stone-500'
                  : contactDays <= 7  ? 'bg-emerald-50 text-emerald-700'
                  : contactDays <= 30 ? 'bg-amber-50 text-amber-700'
                  : 'bg-red-50 text-red-600';
                return (
                <tr key={s.id} className={`border-b border-stone-50 hover:bg-stone-50 transition-colors ${i === filtered.length - 1 ? 'border-0' : ''}`}>
                  <td className="px-5 py-3.5 font-bold text-brand-dark">{s.surname}, {s.name}</td>
                  <td className="px-5 py-3.5 font-mono text-stone-500 text-xs tracking-widest">{s.student_code}</td>
                  <td className="px-5 py-3.5 text-stone-500">{s.cohort ? s.cohort.name : `Gr ${s.grade}`}</td>
                  <td className="px-5 py-3.5 hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {s.subjects?.map((sub) => (
                        <span key={sub.id} className="inline-flex items-center gap-1 px-2 py-0.5 bg-stone-100 text-stone-600 text-xs font-bold rounded-lg">
                          <BookOpen className="w-2.5 h-2.5" />{sub.label}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 hidden lg:table-cell">
                    <button
                      onClick={() => openContactModal(s)}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black transition-colors hover:opacity-80 ${contactChipColor}`}
                    >
                      <Phone className="w-2.5 h-2.5" />
                      {lastContact ? lastContactLabel(lastContact) : 'No contact'}
                    </button>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1 justify-end">
                      <button onClick={() => openContactModal(s)}
                        className="p-2 rounded-lg hover:bg-blue-50 text-stone-400 hover:text-blue-500 transition-colors lg:hidden"
                        title="Log parent contact">
                        <Phone className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => openEdit(s)}
                        className="p-2 rounded-lg hover:bg-stone-100 text-stone-500 hover:text-stone-700 transition-colors">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setConfirmDelete(s)}
                        className="p-2 rounded-lg hover:bg-red-50 text-stone-500 hover:text-red-600 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
                );
              })}
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
                <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-brand-border/60">
                  <h2 className="text-lg font-black text-brand-dark">
                    {modalMode === 'add' ? 'Add Student' : 'Edit Student'}
                  </h2>
                  <button onClick={closeForm} className="p-2 rounded-xl hover:bg-stone-100 text-stone-500 hover:text-stone-700 transition-colors">
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
                        <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-1.5">Name</label>
                        <input required type="text" value={form.name} onChange={(e) => set('name', e.target.value)}
                          className="w-full px-3 py-2.5 bg-stone-50 border border-brand-border rounded-xl text-sm font-medium text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 transition-all"
                          placeholder="John" />
                      </div>
                      <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-1.5">Surname</label>
                        <input required type="text" value={form.surname} onChange={(e) => set('surname', e.target.value)}
                          className="w-full px-3 py-2.5 bg-stone-50 border border-brand-border rounded-xl text-sm font-medium text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 transition-all"
                          placeholder="Doe" />
                      </div>
                    </div>

                    {/* Student Code — readonly in edit mode */}
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-1.5">Student Code</label>
                      <input required type="text" value={form.student_code}
                        onChange={(e) => modalMode === 'add' && set('student_code', e.target.value.toUpperCase())}
                        readOnly={modalMode === 'edit'}
                        className={`w-full px-3 py-2.5 border rounded-xl text-sm font-medium tracking-widest transition-all focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 ${
                          modalMode === 'edit' ? 'bg-stone-100 border-brand-border text-stone-500 cursor-not-allowed' : 'bg-stone-50 border-brand-border text-brand-dark'
                        }`}
                        placeholder="e.g. STU-0001" autoCapitalize="characters" />
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

                    {/* Class + Grade */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-1.5">Class</label>
                        <input required type="text" value={form.cohort} onChange={(e) => set('cohort', e.target.value)}
                          className="w-full px-3 py-2.5 bg-stone-50 border border-brand-border rounded-xl text-sm font-medium text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 transition-all"
                          placeholder="e.g. 10A" />
                      </div>
                      <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-1.5">Grade</label>
                        <select required value={form.grade} onChange={(e) => set('grade', e.target.value)}
                          className="w-full px-3 py-2.5 bg-stone-50 border border-brand-border rounded-xl text-sm font-medium text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 transition-all">
                          <option value="">Select</option>
                          {GRADES.map((g) => <option key={g} value={g}>Grade {g}</option>)}
                        </select>
                      </div>
                    </div>

                    {/* Subjects */}
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-2">
                        Subjects you teach this student
                      </label>
                      <div className="grid grid-cols-2 gap-1.5">
                        {allSubjects.map((s) => {
                          const selected = form.subjects.includes(s.code);
                          return (
                            <button key={s.code} type="button" onClick={() => toggleSubject(s.code)}
                              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-left transition-all ${
                                selected ? 'bg-brand-dark text-white' : 'bg-stone-50 border border-brand-border text-stone-600 hover:border-stone-300 hover:text-brand-dark'
                              }`}>
                              <div className={`w-3.5 h-3.5 rounded flex items-center justify-center shrink-0 ${selected ? 'bg-white/20' : 'border border-stone-300'}`}>
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

                <div className="flex gap-3 px-6 py-4 border-t border-brand-border/60">
                  <button type="button" onClick={closeForm}
                    className="flex-1 py-2.5 text-sm font-bold text-stone-600 border border-brand-border rounded-xl hover:bg-stone-50 transition-all">
                    Cancel
                  </button>
                  <button type="submit" form="student-form" disabled={submitting}
                    className="flex-1 py-2.5 text-sm font-black text-white bg-brand-dark rounded-xl hover:bg-brand-dark/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
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

      {/* ── Parent Contact Log Modal ──────────────────────────── */}
      <AnimatePresence>
        {contactModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={closeContactModal} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-brand-border/60 shrink-0">
                  <div>
                    <h2 className="text-base font-black text-brand-dark">Parent Contact Log</h2>
                    <p className="text-xs text-stone-500 mt-0.5">{contactModal.surname}, {contactModal.name}</p>
                  </div>
                  <button onClick={closeContactModal} className="p-2 rounded-xl hover:bg-stone-100 text-stone-500 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Log new contact form */}
                <div className="px-6 py-4 border-b border-brand-border/60 shrink-0">
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-stone-500 mb-3">Log New Contact</p>

                  {/* Method selector */}
                  <div className="flex gap-1.5 flex-wrap mb-3">
                    {(Object.keys(CONTACT_METHOD_LABELS) as ContactMethod[]).map(m => (
                      <button
                        key={m}
                        onClick={() => setContactMethod(m)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-black transition-all ${
                          contactMethod === m
                            ? 'bg-brand-dark text-white'
                            : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                        }`}
                      >
                        {CONTACT_METHOD_LABELS[m]}
                      </button>
                    ))}
                  </div>

                  {/* Note */}
                  <textarea
                    value={contactNote}
                    onChange={e => setContactNote(e.target.value)}
                    placeholder="Note (optional) — e.g. discussed term progress, parent satisfied"
                    rows={2}
                    className="w-full px-3 py-2 rounded-xl border border-brand-border text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-dark resize-none mb-3"
                  />

                  <button
                    onClick={handleLogContact}
                    disabled={contactSaving}
                    className="w-full py-2 rounded-xl bg-brand-dark text-white text-sm font-black hover:bg-stone-700 transition-colors disabled:opacity-50"
                  >
                    {contactSaving ? 'Saving…' : 'Log Contact'}
                  </button>
                </div>

                {/* History */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-stone-500 mb-3">History</p>
                  {contactHistoryLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="w-4 h-4 border-2 border-brand-border border-t-stone-600 rounded-full animate-spin" />
                    </div>
                  ) : contactHistory.length === 0 ? (
                    <div className="text-center py-8">
                      <Clock className="w-8 h-8 text-stone-200 mx-auto mb-2" />
                      <p className="text-sm text-stone-500 font-bold">No contacts logged yet</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {contactHistory.map(c => (
                        <div key={c.id} className="flex items-start gap-3 bg-stone-50 rounded-xl px-3 py-2.5">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-black text-stone-700">{CONTACT_METHOD_LABELS[c.method]}</span>
                              <span className="text-[10px] text-stone-500">
                                {new Date(c.createdAt).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </span>
                            </div>
                            {c.note && <p className="text-xs text-stone-500 mt-0.5">{c.note}</p>}
                          </div>
                          <button
                            onClick={() => handleDeleteContact(c.id)}
                            className="shrink-0 p-1 rounded hover:bg-red-50 text-stone-400 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
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
                <h2 className="text-base font-black text-brand-dark mb-1">Remove student?</h2>
                <p className="text-sm text-stone-500 mb-6">
                  This will remove <span className="font-bold text-brand-dark">{confirmDelete.name} {confirmDelete.surname}</span> from your classes. If no other teacher teaches them, their account will be deleted.
                </p>
                <div className="flex gap-3">
                  <button onClick={() => setConfirmDelete(null)}
                    className="flex-1 py-2.5 text-sm font-bold text-stone-600 border border-brand-border rounded-xl hover:bg-stone-50 transition-all">
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

// ── TierGroupView ─────────────────────────────────────────────────────────────
// Groups students into 4 performance tiers.
// Falls back to student list ordering when tier data is unavailable for a student.

const TIER_CONFIG: Record<LearnerTier, {
  label: string; description: string;
  bg: string; border: string; badge: string; dot: string;
}> = {
  high_risk:   { label: 'High Risk',   description: 'Below 40% — urgent intervention needed', bg: 'bg-red-50',     border: 'border-red-200',    badge: 'bg-red-500 text-white',          dot: 'bg-red-500' },
  medium_risk: { label: 'Medium Risk', description: '40–55% — monitor and support',            bg: 'bg-amber-50',  border: 'border-amber-200',  badge: 'bg-amber-500 text-white',        dot: 'bg-amber-500' },
  on_track:    { label: 'On Track',    description: '55–75% — performing adequately',           bg: 'bg-blue-50',   border: 'border-blue-200',   badge: 'bg-blue-500 text-white',         dot: 'bg-blue-500' },
  flourishing: { label: 'Flourishing', description: 'Above 75% — excelling',                   bg: 'bg-emerald-50',border: 'border-emerald-200', badge: 'bg-emerald-600 text-white',      dot: 'bg-emerald-500' },
};

const TIER_ORDER: LearnerTier[] = ['high_risk', 'medium_risk', 'on_track', 'flourishing'];

interface TierGroupViewProps {
  students:  Student[];
  tiers:     StudentTierSummary[];
  filtered:  Student[];
  onEdit:    (s: Student) => void;
  onDelete:  (s: Student) => void;
}

function TierGroupView({ students, tiers, filtered, onEdit, onDelete }: TierGroupViewProps) {
  // Build lookup: studentId → tier
  const tierMap = new Map<number, LearnerTier>(tiers.map(t => [t.studentId, t.tier]));
  const avgMap  = new Map<number, number>(tiers.map(t => [t.studentId, t.avg]));

  // Group filtered students by tier
  const groups = new Map<LearnerTier, Student[]>();
  for (const tier of TIER_ORDER) groups.set(tier, []);

  for (const s of filtered) {
    const tier = tierMap.get(s.id) ?? 'on_track';   // default on_track if no marks yet
    groups.get(tier)!.push(s);
  }

  const populated = TIER_ORDER.filter(t => groups.get(t)!.length > 0);

  if (populated.length === 0) {
    return (
      <div className="card-premium bg-white border border-brand-border rounded-[24px] px-5 py-12 text-center">
        <p className="text-sm font-bold text-stone-500">No students match your search.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {populated.map(tier => {
        const cfg      = TIER_CONFIG[tier];
        const group    = groups.get(tier)!;
        return (
          <div key={tier} className={`rounded-2xl border ${cfg.border} overflow-hidden`}>
            {/* Tier header */}
            <div className={`${cfg.bg} px-5 py-3 flex items-center justify-between`}>
              <div className="flex items-center gap-2.5">
                <span className={`w-2 h-2 rounded-full shrink-0 ${cfg.dot}`} />
                <p className="text-sm font-black text-stone-900">{cfg.label}</p>
                <p className="text-[11px] text-stone-500">{cfg.description}</p>
              </div>
              <span className={`text-[11px] font-black px-2.5 py-1 rounded-full ${cfg.badge}`}>
                {group.length}
              </span>
            </div>
            {/* Student rows */}
            <div className="bg-white divide-y divide-stone-50">
              {group.map(s => {
                const avg = avgMap.get(s.id);
                return (
                  <div key={s.id} className="flex items-center gap-3 px-5 py-3 hover:bg-stone-50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-brand-dark">{s.surname}, {s.name}</p>
                        <span className="text-[10px] font-mono text-stone-500 tracking-widest">{s.student_code}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-[10px] text-stone-500">{s.cohort ? s.cohort.name : `Gr ${s.grade}`}</p>
                        {avg !== undefined && (
                          <span className={`text-[10px] font-black ${
                            avg >= 75 ? 'text-emerald-600' : avg >= 55 ? 'text-blue-600' : avg >= 40 ? 'text-amber-600' : 'text-red-600'
                          }`}>
                            {avg}% avg
                          </span>
                        )}
                        <div className="flex flex-wrap gap-0.5">
                          {s.subjects?.slice(0, 3).map(sub => (
                            <span key={sub.id} className="text-[10px] text-stone-500">{sub.label}{s.subjects && s.subjects.indexOf(sub) < Math.min(s.subjects.length - 1, 2) ? ' ·' : ''}</span>
                          ))}
                          {s.subjects && s.subjects.length > 3 && (
                            <span className="text-[10px] text-stone-400"> +{s.subjects.length - 3}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => onEdit(s)}
                        className="p-2 rounded-lg hover:bg-stone-100 text-stone-500 hover:text-stone-700 transition-colors">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => onDelete(s)}
                        className="p-2 rounded-lg hover:bg-red-50 text-stone-500 hover:text-red-600 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
      <p className="text-[11px] text-stone-500 text-center pb-2">
        Tiers based on overall mark average across all subjects
      </p>
    </div>
  );
}
