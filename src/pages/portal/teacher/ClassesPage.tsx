import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, X, ArrowRight, Check, AlertCircle, BookOpen, Pencil, Trash2, Search, TrendingUp, Phone, Clock, UserPlus } from 'lucide-react';
import type { TeacherSession } from '../../../lib/auth';
import { Shimmer } from '../../../shared/components/Shimmer';
import Dropdown from '../../../shared/components/Dropdown';
import Modal from '../../../shared/components/Modal';
import {
  fetchSubjects, createStudent, updateStudent,
  removeStudentFromTeacher, fetchTeacherStudents,
  lookupStudentByCode, assignStudentToTeacher,
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
const ease = [0.23, 1, 0.32, 1] as [number, number, number, number];

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

  // Assign Student (link an existing student from another teacher's roster)
  const [showAssign, setShowAssign] = useState(false);
  const [assignStep, setAssignStep] = useState<'code' | 'confirm'>('code');
  const [assignCode, setAssignCode] = useState('');
  const [assignLookingUp, setAssignLookingUp] = useState(false);
  const [assignError, setAssignError] = useState<string | null>(null);
  const [assignFoundStudent, setAssignFoundStudent] = useState<Student | null>(null);
  const [assignSubjects, setAssignSubjects] = useState<string[]>([]);
  const [assignSubmitting, setAssignSubmitting] = useState(false);

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

  // ── Assign Student handlers ────────────────────────────────────

  const openAssign = () => {
    setShowAssign(true);
    setAssignStep('code');
    setAssignCode('');
    setAssignError(null);
    setAssignFoundStudent(null);
    setAssignSubjects([]);
  };

  const closeAssign = () => {
    setShowAssign(false);
    setAssignStep('code');
    setAssignCode('');
    setAssignError(null);
    setAssignFoundStudent(null);
    setAssignSubjects([]);
  };

  const handleAssignLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setAssignLookingUp(true);
    setAssignError(null);
    const result = await lookupStudentByCode(assignCode, session.school_id);
    setAssignLookingUp(false);
    if (!result.success) { setAssignError(result.error); return; }
    setAssignFoundStudent(result.student);
    setAssignStep('confirm');
  };

  const toggleAssignSubject = (code: string) =>
    setAssignSubjects((s) => (s.includes(code) ? s.filter((c) => c !== code) : [...s, code]));

  const handleAssignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignFoundStudent) return;
    if (assignSubjects.length === 0) {
      setAssignError('Please select at least one subject.');
      return;
    }
    setAssignSubmitting(true);
    setAssignError(null);
    const result = await assignStudentToTeacher(
      session.teacher_id, assignFoundStudent.id, session.school_id, assignSubjects,
    );
    setAssignSubmitting(false);
    if (!result.success) { setAssignError(result.error); return; }
    await reload();
    closeAssign();
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
    <div className="student-home min-h-full pb-16 relative">

      {/* ═══ Header — same compact scale as the student Home page ═══ */}
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-5 flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-brand-dark text-[30px] sm:text-[36px] leading-tight" style={{ fontWeight: 600 }}>
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-linear-to-r from-sky-500 via-sky-600 to-blue-600">
                Classes
              </span>
              <svg aria-hidden="true" viewBox="0 0 320 14" className="absolute left-0 -bottom-1 w-full h-3 text-amber-500/70" preserveAspectRatio="none">
                <path d="M2 9C60 3 180 2 318 8" stroke="currentColor" strokeWidth="3.5" fill="none" strokeLinecap="round" />
              </svg>
            </span>
          </h1>
          <p className="text-[14px] text-muted mt-1">Manage your students and track their progress.</p>
        </div>
        <div className="flex items-center gap-6">
          <motion.button onClick={openAssign} whileTap={{ scale: 0.97 }}
            className="flex items-center gap-1 text-[14px] font-semibold transition-colors"
            style={{ color: 'var(--color-navy)' }}>
            <UserPlus className="w-4 h-4" /> Assign student
          </motion.button>
          <motion.button onClick={openAdd} whileTap={{ scale: 0.97 }}
            className="flex items-center gap-1 text-[14px] font-semibold transition-colors"
            style={{ color: 'var(--color-navy)' }}>
            <Plus className="w-4 h-4" /> Add student
          </motion.button>
        </div>
      </div>

      {/* ═══ Body ═══════════════════════════════════════════════ */}
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4">

      {/* Class switcher — pill tabs, e.g. 10A / 10B, like the reference the student portal uses */}
      {!loading && cohortOptions.length > 0 && (
        <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
          <button
            onClick={() => setFilterCohort('')}
            className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-bold transition-all duration-150 ${
              filterCohort === ''
                ? 'bg-sky-50 text-sky-700 shadow-sm'
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
                    ? 'bg-sky-50 text-sky-700 shadow-sm'
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
        <div className="paper-card rounded p-3 flex items-center gap-3 flex-wrap">
          <div className="flex-1 min-w-48 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, code or subject…"
              className="w-full pl-9 pr-4 py-2.5 rounded border border-brand-border text-sm font-bold text-brand-dark placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-dark"
            />
          </div>
          <Dropdown
            value={filterGrade || 'all'}
            onChange={v => setFilterGrade(v === 'all' ? '' : v)}
            buttonClassName="flex items-center justify-between gap-2 px-3 py-2.5 rounded border border-brand-border text-sm font-bold text-stone-700 focus:outline-none focus:ring-2 focus:ring-brand-dark bg-white"
            options={[{ value: 'all', label: 'All grades' }, ...GRADES.map(g => ({ value: String(g), label: `Grade ${g}` }))]}
          />
          {(search || filterGrade || filterCohort) && (
            <button
              onClick={() => { setSearch(''); setFilterGrade(''); setFilterCohort(''); }}
              className="px-3 py-2.5 rounded border border-brand-border text-sm font-black text-stone-500 hover:bg-stone-100 transition-colors"
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
            className={`flex items-center gap-1.5 px-3 py-2.5 rounded border text-xs font-black transition-all ${
              groupByTier
                ? 'bg-sky-50 text-sky-700 border-accent'
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
        <div className="space-y-2.5">
          {[0, 1, 2].map(i => (
            <div key={i} className="paper-card rounded p-4 flex items-center gap-3">
              <Shimmer className="w-9 h-9 rounded-full shrink-0" />
              <div className="flex-1 space-y-2">
                <Shimmer className="h-4" style={{ width: `${45 - i * 5}%` }} />
                <Shimmer className="h-3 w-1/4" />
              </div>
            </div>
          ))}
        </div>
      ) : students.length === 0 ? (
        <div className="paper-card rounded p-12 text-center">
          <p className="font-bold text-brand-dark mb-1">No students yet</p>
          <p className="text-sm text-stone-500 mb-6">Add your first student to get started.</p>
          <button onClick={openAdd}
            className="inline-flex items-center gap-1 text-[14px] font-semibold transition-colors"
            style={{ color: 'var(--color-navy)' }}>
            Add student <ArrowRight className="w-4 h-4" />
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
        <div className="paper-card rounded overflow-hidden">
          <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-border/60">
                <th className="text-left px-5 py-3 text-[12px] text-muted-2" style={{ fontWeight: 600 }}>Student</th>
                <th className="text-left px-5 py-3 text-[12px] text-muted-2" style={{ fontWeight: 600 }}>Code</th>
                <th className="text-left px-5 py-3 text-[12px] text-muted-2" style={{ fontWeight: 600 }}>Class</th>
                <th className="text-left px-5 py-3 text-[12px] text-muted-2 hidden md:table-cell" style={{ fontWeight: 600 }}>Subjects</th>
                <th className="text-left px-5 py-3 text-[12px] text-muted-2 hidden lg:table-cell" style={{ fontWeight: 600 }}>Last contact</th>
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
        </div>
      )}
      </div>

      {/* Add / Edit Modal */}
      <Modal open={showForm} onClose={closeForm} title={modalMode === 'add' ? 'Add student' : 'Edit student'} maxWidth="max-w-lg"
        footer={<>
          <button type="button" onClick={closeForm}
            className="text-[14px] font-semibold text-muted transition-colors">
            Cancel
          </button>
          <button type="submit" form="student-form" disabled={submitting}
            className="flex items-center gap-1 text-[14px] font-semibold transition-colors disabled:opacity-50"
            style={{ color: 'var(--color-navy)' }}>
            {submitting
              ? <><div className="w-3.5 h-3.5 border-2 border-current/30 border-t-current rounded-full animate-spin" /> Saving...</>
              : <>{modalMode === 'add' ? 'Add student' : 'Save changes'} <ArrowRight className="w-4 h-4" /></>
            }
          </button>
        </>}
      >
                  <form id="student-form" onSubmit={handleSubmit} className="space-y-4">
                    {formError && (
                      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                        className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded">
                        <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                        <p className="text-red-700 text-sm">{formError}</p>
                      </motion.div>
                    )}

                    {/* Name + Surname */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-1.5">Name</label>
                        <input required type="text" value={form.name} onChange={(e) => set('name', e.target.value)}
                          className="w-full px-3 py-2.5 bg-stone-50 border border-brand-border rounded text-sm font-medium text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 transition-all"
                          placeholder="John" />
                      </div>
                      <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-1.5">Surname</label>
                        <input required type="text" value={form.surname} onChange={(e) => set('surname', e.target.value)}
                          className="w-full px-3 py-2.5 bg-stone-50 border border-brand-border rounded text-sm font-medium text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 transition-all"
                          placeholder="Doe" />
                      </div>
                    </div>

                    {/* Student Code — readonly in edit mode */}
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-1.5">Student Code</label>
                      <input required type="text" value={form.student_code}
                        onChange={(e) => modalMode === 'add' && set('student_code', e.target.value.toUpperCase())}
                        readOnly={modalMode === 'edit'}
                        className={`w-full px-3 py-2.5 border rounded text-sm font-medium tracking-widest transition-all focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 ${
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
                        className="w-full px-3 py-2.5 bg-stone-50 border border-brand-border rounded text-sm font-medium text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 transition-all tracking-widest"
                        placeholder={modalMode === 'edit' ? '••••••••••' : '10-digit PIN'} />
                    </div>

                    {/* Class + Grade */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-1.5">Class</label>
                        <input required type="text" value={form.cohort} onChange={(e) => set('cohort', e.target.value)}
                          className="w-full px-3 py-2.5 bg-stone-50 border border-brand-border rounded text-sm font-medium text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 transition-all"
                          placeholder="e.g. 10A" />
                      </div>
                      <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-1.5">Grade</label>
                        <Dropdown
                          value={form.grade || null}
                          onChange={(v) => set('grade', v)}
                          placeholder="Select"
                          buttonClassName="w-full flex items-center justify-between gap-2 px-3 py-2.5 bg-stone-50 border border-brand-border rounded text-sm font-medium text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 transition-all"
                          options={GRADES.map((g) => ({ value: String(g), label: `Grade ${g}` }))}
                        />
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
                              className={`flex items-center gap-2 px-3 py-2 rounded text-xs font-bold text-left transition-all ${
                                selected ? 'bg-sky-50 text-sky-700' : 'bg-stone-50 border border-brand-border text-stone-600 hover:border-stone-300 hover:text-brand-dark'
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
      </Modal>

      {/* ── Assign Student Modal ──────────────────────────────── */}
      <Modal open={showAssign} onClose={closeAssign} maxWidth="max-w-lg"
        title={
          <span>
            Assign student
            <span className="block text-xs font-medium text-stone-500 mt-0.5">Link a student already in this school to your subjects</span>
          </span>
        }
        footer={<>
          <button type="button" onClick={assignStep === 'confirm' ? () => setAssignStep('code') : closeAssign}
            className="text-[14px] font-semibold text-muted transition-colors">
            {assignStep === 'confirm' ? 'Back' : 'Cancel'}
          </button>
          {assignStep === 'code' ? (
            <button type="submit" form="assign-code-form" disabled={assignLookingUp}
              className="flex items-center gap-1 text-[14px] font-semibold transition-colors disabled:opacity-50"
              style={{ color: 'var(--color-navy)' }}>
              {assignLookingUp
                ? <><div className="w-3.5 h-3.5 border-2 border-current/30 border-t-current rounded-full animate-spin" /> Looking up...</>
                : <>Find student <ArrowRight className="w-4 h-4" /></>
              }
            </button>
          ) : (
            <button type="submit" form="assign-subjects-form" disabled={assignSubmitting}
              className="flex items-center gap-1 text-[14px] font-semibold transition-colors disabled:opacity-50"
              style={{ color: 'var(--color-navy)' }}>
              {assignSubmitting
                ? <><div className="w-3.5 h-3.5 border-2 border-current/30 border-t-current rounded-full animate-spin" /> Assigning...</>
                : <>Assign student <ArrowRight className="w-4 h-4" /></>
              }
            </button>
          )}
        </>}
      >
                  {assignError && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                      className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded mb-4">
                      <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      <p className="text-red-700 text-sm">{assignError}</p>
                    </motion.div>
                  )}

                  {assignStep === 'code' ? (
                    <form id="assign-code-form" onSubmit={handleAssignLookup} className="space-y-4">
                      <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-1.5">Student Code</label>
                        <input required type="text" value={assignCode}
                          onChange={(e) => setAssignCode(e.target.value.toUpperCase())}
                          className="w-full px-3 py-2.5 bg-stone-50 border border-brand-border rounded text-sm font-medium tracking-widest text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 transition-all"
                          placeholder="e.g. STU-0001" autoCapitalize="characters" autoFocus />
                        <p className="text-xs text-stone-500 mt-2">
                          Enter the student's existing code. You won't be able to edit their name, grade or PIN — only pick which subjects you teach them.
                        </p>
                      </div>
                    </form>
                  ) : (
                    <form id="assign-subjects-form" onSubmit={handleAssignSubmit} className="space-y-4">
                      {assignFoundStudent && (
                        <div className="bg-stone-50 border border-brand-border rounded px-4 py-3">
                          <p className="font-bold text-brand-dark">{assignFoundStudent.surname}, {assignFoundStudent.name}</p>
                          <p className="text-xs text-stone-500 mt-0.5">
                            {assignFoundStudent.cohort ? assignFoundStudent.cohort.name : `Grade ${assignFoundStudent.grade}`}
                            {' · '}
                            <span className="font-mono tracking-widest">{assignFoundStudent.student_code}</span>
                          </p>
                        </div>
                      )}

                      <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-2">
                          Subjects you teach this student
                        </label>
                        <div className="grid grid-cols-2 gap-1.5">
                          {allSubjects.map((s) => {
                            const selected = assignSubjects.includes(s.code);
                            return (
                              <button key={s.code} type="button" onClick={() => toggleAssignSubject(s.code)}
                                className={`flex items-center gap-2 px-3 py-2 rounded text-xs font-bold text-left transition-all ${
                                  selected ? 'bg-sky-50 text-sky-700' : 'bg-stone-50 border border-brand-border text-stone-600 hover:border-stone-300 hover:text-brand-dark'
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
                  )}
      </Modal>

      {/* ── Parent Contact Log Modal ──────────────────────────── */}
      <Modal open={!!contactModal} onClose={closeContactModal} maxWidth="max-w-md"
        title={
          <span>
            Parent contact log
            {contactModal && <span className="block text-xs font-medium text-stone-500 mt-0.5">{contactModal.surname}, {contactModal.name}</span>}
          </span>
        }
      >
                {/* Log new contact form */}
                <div className="pb-4 border-b border-brand-border/60">
                  <p className="text-[15px] text-brand-dark mb-3" style={{ fontWeight: 600 }}>Log new contact</p>

                  {/* Method selector */}
                  <div className="flex gap-1.5 flex-wrap mb-3">
                    {(Object.keys(CONTACT_METHOD_LABELS) as ContactMethod[]).map(m => (
                      <button
                        key={m}
                        onClick={() => setContactMethod(m)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-black transition-all ${
                          contactMethod === m
                            ? 'bg-sky-50 text-sky-700'
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
                    className="w-full px-3 py-2 rounded border border-brand-border text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-dark resize-none mb-3"
                  />

                  <button
                    onClick={handleLogContact}
                    disabled={contactSaving}
                    className="flex items-center gap-1 text-[14px] font-semibold transition-colors disabled:opacity-50"
                    style={{ color: 'var(--color-navy)' }}
                  >
                    {contactSaving ? 'Saving…' : 'Log contact'} <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* History */}
                <div className="pt-4">
                  <p className="text-[15px] text-brand-dark mb-3" style={{ fontWeight: 600 }}>History</p>
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
                        <div key={c.id} className="flex items-start gap-3 bg-stone-50 rounded px-3 py-2.5">
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
      </Modal>

      {/* Delete confirm */}
      <Modal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} maxWidth="max-w-sm"
        footer={<>
          <button onClick={() => setConfirmDelete(null)}
            className="text-[14px] font-semibold text-muted transition-colors">
            Cancel
          </button>
          <button onClick={handleDelete} disabled={deleting}
            className="text-[14px] font-semibold text-red-600 transition-colors disabled:opacity-50">
            {deleting ? 'Removing…' : 'Remove'}
          </button>
        </>}
      >
        <h2 className="text-base font-black text-brand-dark mb-1">Remove student?</h2>
        <p className="text-sm text-stone-500">
          This will remove <span className="font-bold text-brand-dark">{confirmDelete?.name} {confirmDelete?.surname}</span> from your classes. If no other teacher teaches them, their account will be deleted.
        </p>
      </Modal>
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
  high:     { label: 'High Risk',     description: 'Attendance, behaviour, and/or course performance — urgent',   bg: 'bg-red-50',     border: 'border-red-200',    badge: 'bg-red-500 text-white',     dot: 'bg-red-500' },
  moderate: { label: 'Moderate Risk', description: 'One or more early-warning signals — monitor and support',      bg: 'bg-amber-50',  border: 'border-amber-200',  badge: 'bg-amber-500 text-white',   dot: 'bg-amber-500' },
  none:     { label: 'On Track',      description: 'No attendance, behaviour, or course-performance concerns',      bg: 'bg-emerald-50',border: 'border-emerald-200', badge: 'bg-emerald-600 text-white', dot: 'bg-emerald-500' },
};

const TIER_ORDER: LearnerTier[] = ['high', 'moderate', 'none'];

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
    const tier = tierMap.get(s.id) ?? 'none';   // default to on-track if no data yet
    groups.get(tier)!.push(s);
  }

  const populated = TIER_ORDER.filter(t => groups.get(t)!.length > 0);

  if (populated.length === 0) {
    return (
      <div className="paper-card rounded px-5 py-12 text-center">
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
                <p className="text-sm font-black text-brand-dark">{cfg.label}</p>
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
