import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Plus, X, Search, ChevronRight, Users } from 'lucide-react';
import type { AdminSession } from '../../../lib/auth';
import { fetchSchoolCohorts, type CohortWithHomeroom } from '../../../lib/homeroom';
import {
  fetchStudentsOutsideCohort, moveStudentToCohort, fetchSchoolStudentDirectory,
  type DirectoryStudent,
} from '../../../lib/students';
import StudentDetailModal from './StudentDetailModal';

interface ClassDetailPageProps {
  session: AdminSession;
  cohort_id: number;
  onBack: () => void;
}

const ease = [0.23, 1, 0.32, 1] as [number, number, number, number];

export default function ClassDetailPage({ session, cohort_id, onBack }: ClassDetailPageProps) {
  const [cohort, setCohort] = useState<CohortWithHomeroom | null>(null);
  const [roster, setRoster] = useState<DirectoryStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [candidates, setCandidates] = useState<DirectoryStudent[]>([]);
  const [search, setSearch] = useState('');
  const [addingId, setAddingId] = useState<number | null>(null);
  const [viewingStudentId, setViewingStudentId] = useState<number | null>(null);
  const [imgLoaded, setImgLoaded] = useState(false);

  const load = async () => {
    setLoading(true);
    if (session.school_id) {
      const cohorts = await fetchSchoolCohorts(session.school_id);
      setCohort(cohorts.find((c) => c.id === cohort_id) ?? null);

      const all = await fetchSchoolStudentDirectory(session.school_id);
      setRoster(all.filter((s) => s.cohort_id === cohort_id));
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, [cohort_id]);

  const openAdd = async () => {
    setSearch('');
    if (session.school_id) {
      const outside = await fetchStudentsOutsideCohort(session.school_id, cohort_id);
      setCandidates(outside);
    }
    setShowAdd(true);
  };

  const handleAdd = async (student: DirectoryStudent) => {
    if (!session.school_id) return;
    setAddingId(student.id);
    await moveStudentToCohort(student.id, cohort_id, session.school_id);
    setCandidates((prev) => prev.filter((s) => s.id !== student.id));
    await load();
    setAddingId(null);
  };

  const filteredCandidates = candidates.filter((s) =>
    `${s.name} ${s.surname} ${s.student_code}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="student-home min-h-full pb-16">

      {/* ═══ Hero — full-width crested banner ═════════════════════ */}
      <div className="relative overflow-hidden bg-brand-dark border-b border-brand-border grain-surface flex flex-col justify-end min-h-[220px] sm:min-h-[260px] lg:min-h-[280px]">
        <div className="absolute inset-0 pointer-events-none">
          <motion.img src="/images/nizamiye-library.png" alt=""
            onLoad={() => setImgLoaded(true)}
            initial={{ opacity: 0 }} animate={{ opacity: imgLoaded ? 0.62 : 0 }}
            transition={{ duration: 0.6, ease }}
            className="w-full h-full object-cover" />
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(100deg, rgba(21,23,28,0.82) 0%, rgba(21,23,28,0.62) 35%, rgba(21,23,28,0.3) 62%, rgba(21,23,28,0.66) 100%)' }} />
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(180deg, rgba(21,23,28,0) 0%, transparent 45%, rgba(21,23,28,0.75) 100%)' }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 pt-8 sm:pt-11 pb-8 sm:pb-10 w-full">
          <button onClick={onBack} className="flex items-center gap-1.5 text-xs font-bold text-white/60 hover:text-white transition-colors mb-4">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Classes
          </button>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/45 leading-none">Grade {cohort?.grade}</p>
              <h1 className="font-display font-extrabold text-white text-[28px] sm:text-[40px] mt-3 leading-[1.1]"
                style={{ letterSpacing: '-0.02em', textShadow: '0 2px 20px rgba(0,0,0,0.35)' }}>
                {cohort?.name ?? 'Class'}
              </h1>
              <p className="text-[11px] text-white/60 mt-1.5 font-medium">
                {roster.length} student{roster.length === 1 ? '' : 's'}
                {cohort?.homeroom_teacher_name && ` · Homeroom: ${cohort.homeroom_teacher_name} ${cohort.homeroom_teacher_surname}`}
              </p>
            </div>
            <motion.button onClick={openAdd} whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}
              className="edge-glow flex items-center gap-2 bg-accent text-white text-sm font-black px-5 py-2.5 rounded shrink-0 transition-colors duration-200 hover:bg-[#2a3350]">
              <Plus className="w-4 h-4" /> Add Student
            </motion.button>
          </div>
        </div>
      </div>

      {/* ═══ Body ═══════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10 space-y-5 sm:space-y-6 pt-6 sm:pt-8">

      {loading ? (
        <div className="paper-card rounded p-5 space-y-3">
          {[0, 1, 2].map(i => <div key={i} className="h-10 w-full bg-stone-100 rounded animate-pulse" />)}
        </div>
      ) : roster.length === 0 ? (
        <div className="paper-card rounded p-12 text-center">
          <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center mx-auto mb-4">
            <Users className="w-5 h-5 text-stone-500" />
          </div>
          <p className="font-bold text-brand-dark mb-1">No students in this class yet</p>
          <p className="text-sm text-stone-500 mb-6">Add students from the school's directory.</p>
          <button onClick={openAdd}
            className="inline-flex items-center gap-2 text-sm font-bold text-stone-700 hover:text-brand-dark border border-brand-border hover:border-stone-300 px-5 py-2.5 rounded-xl transition-all">
            Add Student <Plus className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="paper-card rounded overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-border/60">
                <th className="text-left px-5 py-3 text-xs font-black uppercase tracking-widest text-stone-500">Student</th>
                <th className="text-left px-5 py-3 text-xs font-black uppercase tracking-widest text-stone-500">Code</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {roster.map((s, i) => (
                <tr key={s.id}
                  onClick={() => setViewingStudentId(s.id)}
                  className={`border-b border-stone-50 hover:bg-stone-50 cursor-pointer transition-colors ${i === roster.length - 1 ? 'border-0' : ''}`}>
                  <td className="px-5 py-3.5 font-bold text-brand-dark">{s.surname}, {s.name}</td>
                  <td className="px-5 py-3.5 font-mono text-stone-500 text-xs tracking-widest">{s.student_code}</td>
                  <td className="px-5 py-3.5 text-right">
                    <ChevronRight className="w-4 h-4 text-stone-400 inline-block" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      </div>

      {/* Add student modal */}
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
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col max-h-[80vh]">
                <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-brand-border/60 shrink-0">
                  <h2 className="text-lg font-black text-brand-dark">Add Student to {cohort?.name}</h2>
                  <button onClick={() => setShowAdd(false)} aria-label="Close" className="p-2 rounded-xl hover:bg-stone-100 text-stone-500 hover:text-stone-700 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="px-6 pt-4 pb-2 shrink-0">
                  <div className="relative">
                    <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search by name or code..."
                      className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-brand-border rounded-xl text-sm font-medium text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 transition-all"
                    />
                  </div>
                </div>

                <div className="px-6 py-3 overflow-y-auto space-y-1.5">
                  {filteredCandidates.length === 0 ? (
                    <p className="text-sm text-stone-500 text-center py-8">No matching students found.</p>
                  ) : (
                    filteredCandidates.map((s) => (
                      <div key={s.id} className="flex items-center justify-between px-3 py-2.5 bg-stone-50 rounded-xl border border-brand-border">
                        <div>
                          <p className="text-sm font-bold text-brand-dark">{s.surname}, {s.name}</p>
                          <p className="text-xs text-stone-500">{s.cohort_name ? `Currently in ${s.cohort_name}` : 'Unassigned'} · Gr {s.grade}</p>
                        </div>
                        <button onClick={() => handleAdd(s)} disabled={addingId === s.id}
                          className="px-3 py-1.5 text-xs font-black text-white bg-brand-dark rounded-lg hover:bg-brand-dark/90 transition-all disabled:opacity-50">
                          {addingId === s.id ? '...' : 'Add'}
                        </button>
                      </div>
                    ))
                  )}
                </div>

                <div className="px-6 py-4 border-t border-brand-border/60 shrink-0">
                  <button onClick={() => setShowAdd(false)}
                    className="w-full py-2.5 text-sm font-bold text-stone-600 border border-brand-border rounded-xl hover:bg-stone-50 transition-all">
                    Done
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {viewingStudentId && session.school_id && (
        <StudentDetailModal student_id={viewingStudentId} school_id={session.school_id} onClose={() => setViewingStudentId(null)} onSaved={load} />
      )}
    </div>
  );
}
