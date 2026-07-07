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

export default function ClassDetailPage({ session, cohort_id, onBack }: ClassDetailPageProps) {
  const [cohort, setCohort] = useState<CohortWithHomeroom | null>(null);
  const [roster, setRoster] = useState<DirectoryStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [candidates, setCandidates] = useState<DirectoryStudent[]>([]);
  const [search, setSearch] = useState('');
  const [addingId, setAddingId] = useState<number | null>(null);
  const [viewingStudentId, setViewingStudentId] = useState<number | null>(null);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-5 h-5 border-2 border-brand-border border-t-stone-700 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:p-6 md:p-8 max-w-4xl w-full mx-auto">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm font-bold text-stone-500 hover:text-brand-dark transition-colors mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to Classes
      </button>

      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="eyebrow">Grade {cohort?.grade}</span>
          <h1 className="text-2xl font-black text-brand-dark tracking-tight">{cohort?.name ?? 'Class'}</h1>
          <p className="text-sm text-stone-500 mt-1">
            {roster.length} student{roster.length === 1 ? '' : 's'}
            {cohort?.homeroom_teacher_name && ` · Homeroom: ${cohort.homeroom_teacher_name} ${cohort.homeroom_teacher_surname}`}
          </p>
        </div>
        <motion.button onClick={openAdd} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 bg-brand-dark text-white text-sm font-black px-5 py-2.5 rounded-xl hover:bg-brand-dark/90 transition-colors">
          <Plus className="w-4 h-4" /> Add Student
        </motion.button>
      </div>

      {roster.length === 0 ? (
        <div className="card-premium bg-white border border-brand-border rounded-[24px] p-12 text-center">
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
        <div className="card-premium bg-white border border-brand-border rounded-[24px] overflow-hidden">
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
                  <button onClick={() => setShowAdd(false)} className="p-2 rounded-xl hover:bg-stone-100 text-stone-500 hover:text-stone-700 transition-colors">
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
