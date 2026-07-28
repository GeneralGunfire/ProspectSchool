import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, AlertCircle, ChevronRight } from 'lucide-react';
import type { AdminSession } from '../../../lib/auth';
import { fetchSchoolCohorts, createCohort, setHomeroomTeacher, type CohortWithHomeroom } from '../../../lib/homeroom';
import { fetchSchoolTeachers, type Teacher } from '../../../lib/teachers';
import ClassDetailPage from './ClassDetailPage';
import { Shimmer } from '../../../shared/components/Shimmer';
import Dropdown from '../../../shared/components/Dropdown';
import Modal from '../../../shared/components/Modal';

const ease = [0.23, 1, 0.32, 1] as [number, number, number, number];

interface ClassesAdminPageProps { session: AdminSession; }

export default function ClassesAdminPage({ session }: ClassesAdminPageProps) {
  const [cohorts, setCohorts] = useState<CohortWithHomeroom[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [selectedCohortId, setSelectedCohortId] = useState<number | null>(null);

  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newGrade, setNewGrade] = useState(10);
  const [createError, setCreateError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    if (session.school_id) {
      const [cohortData, teacherData] = await Promise.all([
        fetchSchoolCohorts(session.school_id),
        fetchSchoolTeachers(session.school_id),
      ]);
      setCohorts(cohortData);
      setTeachers(teacherData.filter((t) => t.is_active));
    }
    setLoading(false);
  };

  const handleAssign = async (cohort: CohortWithHomeroom, teacherIdRaw: string) => {
    const teacher_id = teacherIdRaw === '' ? null : Number(teacherIdRaw);
    setSavingId(cohort.id);
    await setHomeroomTeacher(cohort.id, session.school_id!, teacher_id);
    await load();
    setSavingId(null);
  };

  const openAdd = () => {
    setNewName('');
    setNewGrade(10);
    setCreateError(null);
    setShowAdd(true);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session.school_id) return;
    setCreating(true);
    setCreateError(null);
    const result = await createCohort(session.school_id, newName, newGrade);
    if (!result.success) {
      setCreateError(result.error);
      setCreating(false);
      return;
    }
    await load();
    setShowAdd(false);
    setCreating(false);
  };

  if (selectedCohortId !== null) {
    return (
      <ClassDetailPage
        session={session}
        cohort_id={selectedCohortId}
        onBack={() => { setSelectedCohortId(null); load(); }}
      />
    );
  }

  const totalStudents = cohorts.reduce((sum, c) => sum + c.student_count, 0);
  const withoutHomeroom = cohorts.filter(c => !c.homeroom_teacher_id).length;
  const gradeGroups = Array.from(new Set(cohorts.map(c => c.grade))).sort((a, b) => a - b);

  return (
    <div className="student-home min-h-full pb-16 relative">

      {/* ═══ Header ═══════════════════════════════════════════════ */}
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-5 flex flex-wrap items-end justify-between gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }}>
          <p className="text-[12px] text-[rgba(31,36,33,0.5)] font-medium">Admin</p>
          <h1 className="text-brand-dark text-[30px] sm:text-[36px] leading-tight mt-1" style={{ fontWeight: 600 }}>
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-linear-to-r from-sky-500 via-sky-600 to-blue-600">
                Classes
              </span>
              <svg aria-hidden="true" viewBox="0 0 320 14" className="absolute left-0 -bottom-1 w-full h-3 text-amber-500/70" preserveAspectRatio="none">
                <path d="M2 9C60 3 180 2 318 8" stroke="currentColor" strokeWidth="3.5" fill="none" strokeLinecap="round" />
              </svg>
            </span>
          </h1>
          <p className="text-[13px] text-[rgba(31,36,33,0.5)] mt-2 font-medium">Manage classes and assign homeroom teachers.</p>
        </motion.div>
        <motion.button onClick={openAdd} whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}
          className="flex items-center gap-1 text-[14px] font-semibold transition-colors shrink-0" style={{ color: 'var(--color-navy)' }}>
          <Plus className="w-3.5 h-3.5" /> Add class
        </motion.button>
      </div>

      {/* ═══ Body ═══════════════════════════════════════════════ */}
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4">

      {!loading && cohorts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="paper-card rounded p-5">
            <p className="text-[12px] text-muted-2 mb-2">Total classes</p>
            <p className="font-black text-brand-dark text-4xl">{cohorts.length}</p>
          </div>
          <div className="paper-card rounded p-5">
            <p className="text-[12px] text-muted-2 mb-2">Total students</p>
            <p className="font-black text-brand-dark text-4xl">{totalStudents}</p>
          </div>
          <div className="paper-card rounded p-5">
            <p className="text-[12px] text-muted-2 mb-2">Without a homeroom teacher</p>
            <p className={`font-black text-4xl ${withoutHomeroom > 0 ? 'text-amber-600' : 'text-brand-dark'}`}>{withoutHomeroom}</p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[0, 1, 2].map(i => (
            <div key={i} className="paper-card rounded p-5">
              <Shimmer className="h-3 w-1/3 mb-3" />
              <Shimmer className="h-5 w-2/3" />
            </div>
          ))}
        </div>
      ) : cohorts.length === 0 ? (
        <div className="paper-card rounded p-12 text-center">
          <p className="font-bold text-brand-dark mb-1">No classes yet</p>
          <p className="text-sm text-stone-500 mb-6">Create your first class to get started.</p>
          <button onClick={openAdd}
            className="inline-flex items-center gap-1 text-[14px] font-semibold transition-colors" style={{ color: 'var(--color-navy)' }}>
            Add class <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {gradeGroups.map(grade => {
            const gradeClasses = cohorts.filter(c => c.grade === grade);
            const gradeStudents = gradeClasses.reduce((sum, c) => sum + c.student_count, 0);
            return (
              <div key={grade}>
                <div className="flex items-center gap-2 mb-2.5">
                  <p className="text-[15px] text-brand-dark" style={{ fontWeight: 600 }}>Grade {grade}</p>
                  <span className="flex-1 h-px bg-brand-border" />
                  <p className="text-[12px] text-muted-2">{gradeClasses.length} class{gradeClasses.length === 1 ? '' : 'es'} · {gradeStudents} student{gradeStudents === 1 ? '' : 's'}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {gradeClasses.map((c) => (
                    <motion.div key={c.id} whileHover={{ y: -2 }}
                      className="paper-card rounded p-5 cursor-pointer"
                      onClick={() => setSelectedCohortId(c.id)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <p className="text-lg font-black text-brand-dark">{c.name}</p>
                        <ChevronRight className="w-4 h-4 text-stone-400 mt-1" />
                      </div>

                      <p className="text-sm text-stone-500 mb-4">{c.student_count} student{c.student_count === 1 ? '' : 's'}</p>

                      <div onClick={(e) => e.stopPropagation()}>
                        <label className="block text-[12px] text-muted-2 mb-1.5">Homeroom teacher</label>
                        <div className="flex items-center gap-2">
                          <Dropdown
                            value={c.homeroom_teacher_id ? String(c.homeroom_teacher_id) : 'none'}
                            onChange={(v) => handleAssign(c, v === 'none' ? '' : v)}
                            disabled={savingId === c.id}
                            className="flex-1"
                            buttonClassName="w-full flex items-center justify-between gap-2 px-3 py-2 bg-stone-50 border border-brand-border rounded text-sm font-medium text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 transition-all disabled:opacity-50"
                            options={[
                              { value: 'none', label: '— None —' },
                              ...teachers.map((t) => ({ value: String(t.id), label: `${t.surname}, ${t.name}` })),
                            ]}
                          />
                          {savingId === c.id && (
                            <div className="w-3.5 h-3.5 border-2 border-brand-border border-t-stone-700 rounded-full animate-spin shrink-0" />
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
      </div>

      {/* Add Class modal */}
      <Modal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        title="Add class"
        footer={<>
          <button type="button" onClick={() => setShowAdd(false)}
            className="text-[14px] font-semibold text-stone-500 hover:text-stone-700 transition-colors">
            Cancel
          </button>
          <button type="submit" form="class-form" disabled={creating}
            className="text-[14px] font-semibold transition-colors disabled:opacity-50 flex items-center gap-2" style={{ color: 'var(--color-navy)' }}>
            {creating
              ? <div className="w-3.5 h-3.5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
              : 'Create class'
            }
          </button>
        </>}
      >
        <form id="class-form" onSubmit={handleCreate} className="space-y-4">
          {createError && (
            <div className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{createError}</p>
            </div>
          )}

          <div>
            <label className="block text-[12px] text-muted-2 mb-1.5">Class name</label>
            <input required type="text" value={newName} onChange={(e) => setNewName(e.target.value)}
              className="w-full px-3 py-2.5 bg-stone-50 border border-brand-border rounded text-sm font-medium text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 transition-all"
              placeholder="e.g. 10A" />
          </div>

          <div>
            <label className="block text-[12px] text-muted-2 mb-1.5">Grade</label>
            <Dropdown
              value={String(newGrade)}
              onChange={(v) => setNewGrade(Number(v))}
              buttonClassName="w-full flex items-center justify-between gap-2 px-3 py-2.5 bg-stone-50 border border-brand-border rounded text-sm font-medium text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 transition-all"
              options={[8, 9, 10, 11, 12].map((g) => ({ value: String(g), label: `Grade ${g}` }))}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
