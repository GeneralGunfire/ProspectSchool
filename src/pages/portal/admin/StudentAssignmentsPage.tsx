import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight, Check, AlertCircle, Trash2, Search, UserPlus, BookOpen, ChevronDown } from 'lucide-react';
import type { AdminSession } from '../../../lib/auth';
import {
  fetchSchoolAssignments, adminAssignTeacherToStudent, adminRemoveAssignment,
  fetchSubjects, type AssignmentRow, type Subject,
} from '../../../lib/students';
import { fetchSchoolTeachers, type Teacher } from '../../../lib/teachers';
import Dropdown from '../../../shared/components/Dropdown';

const ease = [0.23, 1, 0.32, 1] as [number, number, number, number];

interface StudentAssignmentsPageProps { session: AdminSession; }

function initials(name: string, surname: string) {
  return `${surname[0] ?? ''}${name[0] ?? ''}`.toUpperCase();
}

export default function StudentAssignmentsPage({ session }: StudentAssignmentsPageProps) {
  const [rows, setRows] = useState<AssignmentRow[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [showAssign, setShowAssign] = useState(false);
  const [assignTeacherId, setAssignTeacherId] = useState<number | null>(null);
  const [assignStudentId, setAssignStudentId] = useState<number | null>(null);
  const [assignSubjectId, setAssignSubjectId] = useState<number | null>(null);
  const [assignError, setAssignError] = useState<string | null>(null);
  const [assignSubmitting, setAssignSubmitting] = useState(false);

  const [confirmRemove, setConfirmRemove] = useState<AssignmentRow | null>(null);
  const [removing, setRemoving] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    if (session.school_id) {
      const [assignments, schoolTeachers, allSubjects] = await Promise.all([
        fetchSchoolAssignments(session.school_id),
        fetchSchoolTeachers(session.school_id),
        fetchSubjects(),
      ]);
      setRows(assignments);
      setTeachers(schoolTeachers);
      setSubjects(allSubjects);
    }
    setLoading(false);
  };

  // Group rows by student for a cleaner overview
  const byStudent = useMemo(() => {
    const map = new Map<number, AssignmentRow[]>();
    for (const r of rows) {
      if (!map.has(r.student_id)) map.set(r.student_id, []);
      map.get(r.student_id)!.push(r);
    }
    return map;
  }, [rows]);

  const filteredStudentIds = useMemo(() => {
    const ids = [...byStudent.keys()];
    if (!search.trim()) return ids;
    const q = search.toLowerCase();
    return ids.filter((id) => {
      const group = byStudent.get(id)!;
      return group.some((r) =>
        r.student_name.toLowerCase().includes(q) ||
        r.student_surname.toLowerCase().includes(q) ||
        r.student_code.toLowerCase().includes(q) ||
        r.teacher_name.toLowerCase().includes(q) ||
        r.teacher_surname.toLowerCase().includes(q) ||
        r.subject_label.toLowerCase().includes(q)
      );
    });
  }, [byStudent, search]);

  const openAssign = () => {
    setShowAssign(true);
    setAssignTeacherId(null);
    setAssignStudentId(null);
    setAssignSubjectId(null);
    setAssignError(null);
  };

  const closeAssign = () => setShowAssign(false);

  // Students are derived from existing assignment rows (the school's known roster).
  const knownStudents = useMemo(() => {
    const map = new Map<number, { id: number; name: string; surname: string; code: string }>();
    for (const r of rows) {
      if (!map.has(r.student_id)) {
        map.set(r.student_id, { id: r.student_id, name: r.student_name, surname: r.student_surname, code: r.student_code });
      }
    }
    return [...map.values()].sort((a, b) => a.surname.localeCompare(b.surname));
  }, [rows]);

  const handleAssignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignTeacherId || !assignStudentId || !assignSubjectId) {
      setAssignError('Please select a teacher, student and subject.');
      return;
    }
    setAssignSubmitting(true);
    setAssignError(null);
    const result = await adminAssignTeacherToStudent(assignTeacherId, assignStudentId, assignSubjectId);
    setAssignSubmitting(false);
    if (!result.success) { setAssignError(result.error); return; }
    await load();
    closeAssign();
  };

  const handleRemove = async () => {
    if (!confirmRemove) return;
    setRemoving(true);
    await adminRemoveAssignment(confirmRemove.assignment_id);
    await load();
    setConfirmRemove(null);
    setRemoving(false);
  };

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
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 pt-8 sm:pt-11 pb-8 sm:pb-10 w-full flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/45 leading-none">Admin</p>
            <h1 className="font-display font-extrabold text-white text-[28px] sm:text-[40px] mt-3 leading-[1.1]"
              style={{ letterSpacing: '-0.02em', textShadow: '0 2px 20px rgba(0,0,0,0.35)' }}>
              Student Assignments
            </h1>
            <p className="text-[11px] text-white/60 mt-1.5 font-medium">Manage which teachers teach which students, and for which subjects.</p>
          </div>
          <motion.button onClick={openAssign} whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}
            className="edge-glow flex items-center gap-2 bg-accent text-white text-sm font-black px-5 py-2.5 rounded shrink-0 transition-colors duration-200 hover:bg-[var(--color-accent-soft)]">
            <UserPlus className="w-4 h-4" /> Assign Teacher
          </motion.button>
        </div>
      </div>

      {/* ═══ Body ═══════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10 space-y-5 sm:space-y-6 pt-6 sm:pt-8">

      {/* Search */}
      {!loading && rows.length > 0 && (
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-48 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by student, teacher or subject…"
              className="w-full pl-9 pr-4 py-2.5 rounded border border-brand-border text-sm font-bold text-brand-dark placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-dark"
            />
          </div>
          <p className="text-xs font-bold text-stone-500">
            {filteredStudentIds.length} of {byStudent.size} student{byStudent.size !== 1 ? 's' : ''}
          </p>
        </div>
      )}

      {/* List, grouped by student */}
      {loading ? (
        <div className="paper-card rounded p-5 space-y-3">
          {[0, 1, 2].map(i => <div key={i} className="h-10 w-full bg-stone-100 rounded animate-pulse" />)}
        </div>
      ) : rows.length === 0 ? (
        <div className="paper-card rounded p-12 text-center">
          <div className="w-12 h-12 rounded bg-stone-100 flex items-center justify-center mx-auto mb-4">
            <UserPlus className="w-5 h-5 text-stone-500" />
          </div>
          <p className="font-bold text-brand-dark mb-1">No assignments yet</p>
          <p className="text-sm text-stone-500">Links appear once teachers add or assign students.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredStudentIds.map((studentId, i) => {
            const group = byStudent.get(studentId)!;
            const first = group[0];
            const isExpanded = expandedId === studentId;
            const subjectPreview = group.slice(0, 3).map((r) => r.subject_label);
            const extraCount = group.length - subjectPreview.length;

            return (
              <motion.div
                key={studentId}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.02, 0.15), duration: 0.18 }}
                className={`paper-card rounded overflow-hidden transition-colors ${
                  isExpanded ? 'border-stone-300 shadow-sm' : 'hover:border-stone-300'
                }`}
              >
                {/* Collapsed header — always visible, click to expand/collapse */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : studentId)}
                  className="w-full flex items-center gap-3 px-5 py-3.5 text-left"
                >
                  <div className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center shrink-0">
                    <span className="text-xs font-black text-stone-600">{initials(first.student_name, first.student_surname)}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-brand-dark truncate">{first.student_surname}, {first.student_name}</p>
                    <p className="text-xs text-stone-500 mt-0.5">
                      {first.student_code} · Gr {first.student_grade}
                      {!isExpanded && (
                        <span className="text-stone-400">
                          {' · '}
                          {subjectPreview.join(', ')}
                          {extraCount > 0 && ` +${extraCount} more`}
                        </span>
                      )}
                    </p>
                  </div>

                  <span className="text-[11px] font-black px-2.5 py-1 rounded-full bg-stone-100 text-stone-600 shrink-0">
                    {group.length} link{group.length !== 1 ? 's' : ''}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-stone-400 shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </button>

                {/* Expanded — full teacher/subject link list */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-brand-border/60 divide-y divide-stone-50">
                        {group.map((r) => (
                          <div key={r.assignment_id} className="flex items-center gap-3 px-5 py-3 hover:bg-stone-50 transition-colors">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-sm font-bold text-brand-dark">{r.teacher_surname}, {r.teacher_name}</span>
                                <span className="text-[10px] font-mono text-stone-400 tracking-widest">{r.teacher_code}</span>
                              </div>
                              <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-blue-50 text-blue-700 text-[11px] font-bold rounded-lg">
                                <BookOpen className="w-2.5 h-2.5" />{r.subject_label}
                              </span>
                            </div>
                            <button onClick={(e) => { e.stopPropagation(); setConfirmRemove(r); }}
                              className="p-2 rounded-lg hover:bg-red-50 text-stone-400 hover:text-red-600 transition-colors shrink-0">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}
      </div>

      {/* Assign modal */}
      <AnimatePresence>
        {showAssign && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={closeAssign} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-brand-border/60 shrink-0">
                  <h2 className="text-lg font-black text-brand-dark">Assign Teacher to Student</h2>
                  <button onClick={closeAssign} aria-label="Close" className="p-2 rounded hover:bg-stone-100 text-stone-500 hover:text-stone-700 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="px-6 py-4 overflow-y-auto">
                  <form id="admin-assign-form" onSubmit={handleAssignSubmit} className="space-y-4">
                    {assignError && (
                      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                        className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded">
                        <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                        <p className="text-red-700 text-sm">{assignError}</p>
                      </motion.div>
                    )}

                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-1.5">Student</label>
                      <Dropdown
                        value={assignStudentId ? String(assignStudentId) : null}
                        onChange={(v) => setAssignStudentId(Number(v) || null)}
                        placeholder="Select student"
                        buttonClassName="w-full flex items-center justify-between gap-2 px-3 py-2.5 bg-stone-50 border border-brand-border rounded text-sm font-medium text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 transition-all"
                        options={knownStudents.map((s) => ({ value: String(s.id), label: `${s.surname}, ${s.name} (${s.code})` }))}
                      />
                      <p className="text-xs text-stone-500 mt-1.5">
                        Only students already in the school (added by a teacher) appear here.
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-1.5">Teacher</label>
                      <Dropdown
                        value={assignTeacherId ? String(assignTeacherId) : null}
                        onChange={(v) => setAssignTeacherId(Number(v) || null)}
                        placeholder="Select teacher"
                        buttonClassName="w-full flex items-center justify-between gap-2 px-3 py-2.5 bg-stone-50 border border-brand-border rounded text-sm font-medium text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 transition-all"
                        options={teachers.map((t) => ({ value: String(t.id), label: `${t.surname}, ${t.name} (${t.teacher_code})` }))}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-2">Subject</label>
                      <div className="grid grid-cols-2 gap-1.5">
                        {subjects.map((s) => {
                          const selected = assignSubjectId === s.id;
                          return (
                            <button key={s.id} type="button" onClick={() => setAssignSubjectId(s.id)}
                              className={`flex items-center gap-2 px-3 py-2 rounded text-xs font-bold text-left transition-all ${
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

                <div className="flex gap-3 px-6 py-4 border-t border-brand-border/60 shrink-0">
                  <button type="button" onClick={closeAssign}
                    className="flex-1 py-2.5 text-sm font-bold text-stone-600 border border-brand-border rounded hover:bg-stone-50 transition-all">
                    Cancel
                  </button>
                  <button type="submit" form="admin-assign-form" disabled={assignSubmitting}
                    className="flex-1 py-2.5 text-sm font-black text-white bg-brand-dark rounded hover:bg-brand-dark/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                    {assignSubmitting
                      ? <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
                      : <>Assign <ArrowRight className="w-4 h-4" /></>
                    }
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Remove confirm */}
      <AnimatePresence>
        {confirmRemove && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setConfirmRemove(null)} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
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
                <h2 className="text-base font-black text-brand-dark mb-1">Remove this link?</h2>
                <p className="text-sm text-stone-500 mb-6">
                  <span className="font-bold text-brand-dark">{confirmRemove.teacher_surname}, {confirmRemove.teacher_name}</span> will
                  no longer teach <span className="font-bold text-brand-dark">{confirmRemove.subject_label}</span> to{' '}
                  <span className="font-bold text-brand-dark">{confirmRemove.student_surname}, {confirmRemove.student_name}</span>.
                  The student's account and other links are unaffected.
                </p>
                <div className="flex gap-3">
                  <button onClick={() => setConfirmRemove(null)}
                    className="flex-1 py-2.5 text-sm font-bold text-stone-600 border border-brand-border rounded hover:bg-stone-50 transition-all">
                    Cancel
                  </button>
                  <button onClick={handleRemove} disabled={removing}
                    className="flex-1 py-2.5 text-sm font-black text-white bg-red-600 rounded hover:bg-red-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                    {removing
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
