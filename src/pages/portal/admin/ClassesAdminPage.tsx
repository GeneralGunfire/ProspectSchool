import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Plus, X, AlertCircle, ChevronRight } from 'lucide-react';
import type { AdminSession } from '../../../lib/auth';
import { fetchSchoolCohorts, createCohort, setHomeroomTeacher, type CohortWithHomeroom } from '../../../lib/homeroom';
import { fetchSchoolTeachers, type Teacher } from '../../../lib/teachers';
import ClassDetailPage from './ClassDetailPage';
import { Shimmer } from '../../../shared/components/Shimmer';

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
  const [imgLoaded, setImgLoaded] = useState(false);

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

  return (
    <div className="student-home min-h-full pb-16">

      {/* ═══ Hero — full-width crested banner ═════════════════════ */}
      <div className="relative overflow-hidden bg-brand-dark border-b border-brand-border grain-surface flex flex-col justify-end min-h-[220px] sm:min-h-[260px] lg:min-h-[280px]">
        <div className="absolute inset-0 pointer-events-none">
          <motion.img src="/images/nizamiye-homeroom.png" alt=""
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
              Classes
            </h1>
            <p className="text-[11px] text-white/60 mt-1.5 font-medium">Manage classes and assign homeroom teachers.</p>
          </div>
          <motion.button onClick={openAdd} whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}
            className="edge-glow flex items-center gap-2 bg-accent text-white text-sm font-black px-5 py-2.5 rounded shrink-0 transition-colors duration-200 hover:bg-[#2a3350]">
            <Plus className="w-4 h-4" /> Add Class
          </motion.button>
        </div>
      </div>

      {/* ═══ Body ═══════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10 space-y-5 sm:space-y-6 pt-6 sm:pt-8">

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
          <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center mx-auto mb-4">
            <Users className="w-5 h-5 text-stone-500" />
          </div>
          <p className="font-bold text-brand-dark mb-1">No classes yet</p>
          <p className="text-sm text-stone-500 mb-6">Create your first class to get started.</p>
          <button onClick={openAdd}
            className="inline-flex items-center gap-2 text-sm font-bold text-stone-700 hover:text-brand-dark border border-brand-border hover:border-stone-300 px-5 py-2.5 rounded-xl transition-all">
            Add Class <Plus className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cohorts.map((c) => (
            <motion.div key={c.id} whileHover={{ y: -2 }}
              className="paper-card rounded p-5 cursor-pointer"
              onClick={() => setSelectedCohortId(c.id)}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-stone-500 mb-1">Grade {c.grade}</p>
                  <p className="text-lg font-black text-brand-dark">{c.name}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400 mt-1" />
              </div>

              <p className="text-sm text-stone-500 mb-4">{c.student_count} student{c.student_count === 1 ? '' : 's'}</p>

              <div onClick={(e) => e.stopPropagation()}>
                <label className="block text-[10px] font-black uppercase tracking-widest text-stone-500 mb-1.5">Homeroom Teacher</label>
                <div className="flex items-center gap-2">
                  <select
                    value={c.homeroom_teacher_id ?? ''}
                    onChange={(e) => handleAssign(c, e.target.value)}
                    disabled={savingId === c.id}
                    className="w-full px-3 py-2 bg-stone-50 border border-brand-border rounded-xl text-sm font-medium text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 transition-all disabled:opacity-50"
                  >
                    <option value="">— None —</option>
                    {teachers.map((t) => (
                      <option key={t.id} value={t.id}>{t.surname}, {t.name}</option>
                    ))}
                  </select>
                  {savingId === c.id && (
                    <div className="w-3.5 h-3.5 border-2 border-brand-border border-t-stone-700 rounded-full animate-spin shrink-0" />
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      </div>

      {/* Add Class modal */}
      <AnimatePresence>
        {showAdd && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowAdd(false)} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm flex flex-col">
                <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-brand-border/60">
                  <h2 className="text-lg font-black text-brand-dark">Add Class</h2>
                  <button onClick={() => setShowAdd(false)} aria-label="Close" className="p-2 rounded-xl hover:bg-stone-100 text-stone-500 hover:text-stone-700 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form id="class-form" onSubmit={handleCreate} className="px-6 py-4 space-y-4">
                  {createError && (
                    <div className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                      <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      <p className="text-red-700 text-sm">{createError}</p>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-1.5">Class Name</label>
                    <input required type="text" value={newName} onChange={(e) => setNewName(e.target.value)}
                      className="w-full px-3 py-2.5 bg-stone-50 border border-brand-border rounded-xl text-sm font-medium text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 transition-all"
                      placeholder="e.g. 10A" />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-1.5">Grade</label>
                    <select value={newGrade} onChange={(e) => setNewGrade(Number(e.target.value))}
                      className="w-full px-3 py-2.5 bg-stone-50 border border-brand-border rounded-xl text-sm font-medium text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 transition-all">
                      {[8, 9, 10, 11, 12].map((g) => <option key={g} value={g}>Grade {g}</option>)}
                    </select>
                  </div>
                </form>

                <div className="flex gap-3 px-6 py-4 border-t border-brand-border/60">
                  <button type="button" onClick={() => setShowAdd(false)}
                    className="flex-1 py-2.5 text-sm font-bold text-stone-600 border border-brand-border rounded-xl hover:bg-stone-50 transition-all">
                    Cancel
                  </button>
                  <button type="submit" form="class-form" disabled={creating}
                    className="flex-1 py-2.5 text-sm font-black text-white bg-brand-dark rounded-xl hover:bg-brand-dark/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                    {creating
                      ? <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      : 'Create Class'
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
