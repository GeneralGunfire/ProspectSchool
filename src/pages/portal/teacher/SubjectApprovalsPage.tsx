import { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { Check, X as XIcon, Send, AlertCircle } from 'lucide-react';
import type { TeacherSession } from '../../../lib/auth';
import { fetchTeacherHomerooms, type CohortWithHomeroom } from '../../../lib/homeroom';
import {
  fetchHomeroomSelections, teacherApproveSelection, teacherRejectSelection,
  type StudentSelectionRow, type SubjectChoices,
} from '../../../lib/subjectSelection';

interface SubjectApprovalsPageProps { session: TeacherSession; }

function currentIntakeYear(): number {
  return new Date().getFullYear() + 1;
}

function formatChoices(choices: SubjectChoices | null): string {
  if (!choices) return '—';
  const parts = [
    choices.math_stream === 'pure_math' ? 'Pure Math' : 'Math Lit',
    choices.elective_a === 'egd' ? 'EGD' : choices.elective_a.charAt(0).toUpperCase() + choices.elective_a.slice(1),
    choices.elective_b === 'physical_science' ? 'Physical Science' : 'History',
    choices.additional ? `+ ${choices.additional.charAt(0).toUpperCase() + choices.additional.slice(1)}` : null,
    choices.ap_math ? '+ AP Math' : null,
  ].filter(Boolean);
  return parts.join(', ');
}

const STATUS_LABEL: Record<StudentSelectionRow['status'], { label: string; className: string }> = {
  draft:            { label: 'Not submitted', className: 'bg-stone-100 text-stone-500' },
  submitted:        { label: 'Awaiting your review', className: 'bg-amber-100 text-amber-700' },
  teacher_approved:  { label: 'Approved', className: 'bg-green-100 text-green-700' },
  rejected:          { label: 'Sent back', className: 'bg-red-100 text-red-700' },
  admin_received:    { label: 'Stored by admin', className: 'bg-green-100 text-green-700' },
};

export default function SubjectApprovalsPage({ session }: SubjectApprovalsPageProps) {
  const [cohort, setCohort] = useState<CohortWithHomeroom | null>(null);
  const [rows, setRows] = useState<StudentSelectionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<number | null>(null);
  const [rejectComment, setRejectComment] = useState('');

  const year = currentIntakeYear();

  const load = useCallback(async () => {
    setLoading(true);
    const homerooms = await fetchTeacherHomerooms(session.teacher_id);
    const first = homerooms[0] ?? null;
    setCohort(first);
    if (first) {
      const selections = await fetchHomeroomSelections(first.id, year);
      setRows(selections);
    }
    setLoading(false);
  }, [session.teacher_id, year]);

  useEffect(() => { load(); }, [load]);

  async function handleApprove(student_id: number) {
    setBusyId(student_id);
    setError(null);
    const result = await teacherApproveSelection(student_id, year, session.teacher_id);
    if (!result.success) setError(result.error);
    await load();
    setBusyId(null);
  }

  function openReject(student_id: number) {
    setRejectingId(student_id);
    setRejectComment('');
  }

  async function handleReject() {
    if (rejectingId === null) return;
    setBusyId(rejectingId);
    setError(null);
    const result = await teacherRejectSelection(rejectingId, year, session.teacher_id, rejectComment.trim());
    if (!result.success) setError(result.error);
    setRejectingId(null);
    await load();
    setBusyId(null);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-5 h-5 border-2 border-brand-border border-t-stone-700 rounded-full animate-spin" />
      </div>
    );
  }

  if (!cohort) {
    return (
      <div className="px-4 py-6 sm:p-6 md:p-8 max-w-4xl w-full mx-auto">
        <span className="eyebrow">Homeroom</span>
        <h1 className="text-2xl font-black text-brand-dark tracking-tight mb-4">Subject Selection</h1>
        <div className="card-premium bg-white border border-brand-border rounded-[24px] p-12 text-center">
          <p className="font-bold text-brand-dark mb-1">You're not a homeroom teacher yet</p>
          <p className="text-sm text-stone-500">Ask your school admin to assign you to a class.</p>
        </div>
      </div>
    );
  }

  const submittedCount = rows.filter((r) => r.status === 'submitted').length;

  return (
    <div className="px-4 py-6 sm:p-6 md:p-8 max-w-5xl w-full mx-auto">
      <div className="mb-6">
        <span className="eyebrow">Homeroom · {cohort.name}</span>
        <h1 className="text-2xl font-black text-brand-dark tracking-tight">Subject Selection Approvals</h1>
        <p className="text-sm text-stone-500 mt-1">
          {submittedCount > 0 ? `${submittedCount} awaiting your review` : 'Review Grade 10 subject choices before they go to admin.'}
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2.5 mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          <p className="text-sm font-bold text-red-700">{error}</p>
        </div>
      )}

      <div className="card-premium bg-white border border-brand-border rounded-[24px] overflow-hidden">
        {rows.length === 0 ? (
          <div className="p-12 text-center">
            <p className="font-bold text-brand-dark mb-1">No students in this class</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-border/60">
                <th className="text-left px-5 py-3 text-xs font-black uppercase tracking-widest text-stone-500">Student</th>
                <th className="text-left px-5 py-3 text-xs font-black uppercase tracking-widest text-stone-500">Choices</th>
                <th className="text-left px-5 py-3 text-xs font-black uppercase tracking-widest text-stone-500">Status</th>
                <th className="text-left px-5 py-3 text-xs font-black uppercase tracking-widest text-stone-500"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => {
                const { label, className } = STATUS_LABEL[r.status];
                const canAct = r.status === 'submitted';
                return (
                  <tr key={r.student_id} className={`border-b border-stone-50 ${i === rows.length - 1 ? 'border-0' : ''}`}>
                    <td className="px-5 py-3.5 font-bold text-brand-dark">{r.surname}, {r.name}</td>
                    <td className="px-5 py-3.5 text-stone-600">{formatChoices(r.choices)}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-[11px] font-black px-2.5 py-1 rounded-full ${className}`}>{label}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      {canAct && (
                        <div className="flex items-center gap-2 justify-end">
                          <motion.button whileTap={{ scale: 0.95 }} disabled={busyId === r.student_id}
                            onClick={() => handleApprove(r.student_id)}
                            className="flex items-center gap-1.5 text-xs font-black text-green-700 bg-green-50 hover:bg-green-100 border border-green-200 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50">
                            <Check className="w-3.5 h-3.5" /> Approve
                          </motion.button>
                          <motion.button whileTap={{ scale: 0.95 }} disabled={busyId === r.student_id}
                            onClick={() => openReject(r.student_id)}
                            className="flex items-center gap-1.5 text-xs font-black text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50">
                            <XIcon className="w-3.5 h-3.5" /> Reject
                          </motion.button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {rejectingId !== null && (
        <>
          <div onClick={() => setRejectingId(null)} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
              <h2 className="text-base font-black text-brand-dark mb-1">Send back for changes</h2>
              <p className="text-sm text-stone-500 mb-4">Add a short note explaining what needs to change.</p>
              <textarea value={rejectComment} onChange={(e) => setRejectComment(e.target.value)}
                rows={3} placeholder="e.g. Please reconsider your elective combination"
                className="w-full rounded-xl border border-brand-border px-3 py-2 text-sm mb-4" />
              <div className="flex gap-3">
                <button onClick={() => setRejectingId(null)}
                  className="flex-1 py-2.5 text-sm font-bold text-stone-600 border border-brand-border rounded-xl hover:bg-stone-50 transition-all">
                  Cancel
                </button>
                <button onClick={handleReject}
                  className="flex-1 py-2.5 text-sm font-black text-white bg-red-600 rounded-xl hover:bg-red-700 transition-all flex items-center justify-center gap-2">
                  <Send className="w-3.5 h-3.5" /> Send Back
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
