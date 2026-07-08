import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { CalendarRange, CheckCircle2, Inbox, Save, Trash2, AlertTriangle } from 'lucide-react';
import type { AdminSession } from '../../../lib/auth';
import {
  fetchActiveWindow, setWindow, isWindowCurrentlyOpen,
  fetchAdminSelections, markAdminReceived, deleteSelection,
  type SubjectSelectionWindow, type StudentSelectionRow,
} from '../../../lib/subjectSelection';

interface SubjectSelectionAdminPageProps { session: AdminSession; }

function currentIntakeYear(): number {
  return new Date().getFullYear() + 1;
}

function formatChoices(choices: StudentSelectionRow['choices']): string {
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

export default function SubjectSelectionAdminPage({ session }: SubjectSelectionAdminPageProps) {
  const [window_, setWindowState] = useState<SubjectSelectionWindow | null>(null);
  const [rows, setRows] = useState<StudentSelectionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [opensAt, setOpensAt] = useState('');
  const [closesAt, setClosesAt] = useState('');
  const [isOpen, setIsOpen] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState<StudentSelectionRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  const year = currentIntakeYear();

  useEffect(() => { load(); }, []);

  async function load() {
    if (!session.school_id) return;
    setLoading(true);
    const [w, selections] = await Promise.all([
      fetchActiveWindow(session.school_id),
      fetchAdminSelections(session.school_id, year),
    ]);
    setWindowState(w);
    setRows(selections);
    if (w) {
      setOpensAt(w.opens_at);
      setClosesAt(w.closes_at);
      setIsOpen(w.is_open);
    } else {
      const today = new Date().toISOString().slice(0, 10);
      setOpensAt(today);
      setClosesAt(today);
    }
    setLoading(false);
  }

  async function handleSaveWindow(e: React.FormEvent) {
    e.preventDefault();
    if (!session.school_id) return;
    setSaving(true);
    setSaved(false);
    await setWindow(session.school_id, year, opensAt, closesAt, isOpen);
    await load();
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleReceive(selection_id: number) {
    await markAdminReceived(selection_id);
    await load();
  }

  async function handleDelete() {
    if (!confirmDelete) return;
    setDeleting(true);
    await deleteSelection(confirmDelete.id);
    setConfirmDelete(null);
    setDeleting(false);
    await load();
  }

  const currentlyOpen = isWindowCurrentlyOpen(window_);

  return (
    <div className="px-4 py-6 sm:p-6 md:p-8 max-w-6xl w-full mx-auto">
      <div className="mb-8">
        <span className="eyebrow">Admin</span>
        <h1 className="text-2xl font-black text-brand-dark tracking-tight">Subject Selection</h1>
        <p className="text-sm text-stone-500 mt-1">
          Open the Grade 9 subject selection window for {year} intake, and review teacher-approved submissions.
        </p>
      </div>

      {/* Window control */}
      <div className="card-premium bg-white border border-brand-border rounded-[24px] p-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <CalendarRange className="w-4 h-4 text-stone-500" />
          <h2 className="text-sm font-black text-brand-dark">Selection Window — {year} Intake</h2>
          <span className={`ml-auto text-[11px] font-black px-2.5 py-1 rounded-full ${currentlyOpen ? 'bg-green-100 text-green-700' : 'bg-stone-100 text-stone-500'}`}>
            {currentlyOpen ? 'Open now' : 'Closed'}
          </span>
        </div>
        {loading ? (
          <div className="w-5 h-5 border-2 border-brand-border border-t-stone-700 rounded-full animate-spin" />
        ) : (
          <form onSubmit={handleSaveWindow} className="grid sm:grid-cols-3 gap-4 items-end">
            <label className="block">
              <span className="text-[11px] font-black text-stone-500 uppercase tracking-wide">Opens</span>
              <input type="date" value={opensAt} onChange={(e) => setOpensAt(e.target.value)}
                className="mt-1 w-full rounded-xl border border-brand-border px-3 py-2 text-sm" required />
            </label>
            <label className="block">
              <span className="text-[11px] font-black text-stone-500 uppercase tracking-wide">Closes</span>
              <input type="date" value={closesAt} onChange={(e) => setClosesAt(e.target.value)}
                className="mt-1 w-full rounded-xl border border-brand-border px-3 py-2 text-sm" required />
            </label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm font-bold text-brand-dark cursor-pointer">
                <input type="checkbox" checked={isOpen} onChange={(e) => setIsOpen(e.target.checked)} className="w-4 h-4" />
                Enabled
              </label>
              <motion.button type="submit" disabled={saving} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 bg-brand-dark text-white text-sm font-black px-4 py-2 rounded-xl hover:bg-brand-dark/90 transition-colors disabled:opacity-60">
                <Save className="w-4 h-4" /> {saved ? 'Saved' : 'Save'}
              </motion.button>
            </div>
          </form>
        )}
        <p className="text-xs text-stone-400 mt-3">
          When enabled and within the date range, Grade 9 students can access "Subject Selection" from their portal.
        </p>
      </div>

      {/* Approved submissions */}
      <div className="card-premium bg-white border border-brand-border rounded-[24px] overflow-hidden">
        <div className="flex items-center gap-2 px-6 pt-6 pb-4">
          <Inbox className="w-4 h-4 text-stone-500" />
          <h2 className="text-sm font-black text-brand-dark">Teacher-Approved Submissions</h2>
        </div>
        {loading ? null : rows.length === 0 ? (
          <div className="px-6 pb-8 text-sm text-stone-400">No submissions have been approved by homeroom teachers yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-t border-brand-border text-left text-[11px] font-black text-stone-500 uppercase tracking-wide">
                  <th className="px-6 py-3">Student</th>
                  <th className="px-3 py-3">Class</th>
                  <th className="px-3 py-3">Choices</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-t border-brand-border/60">
                    <td className="px-6 py-3 font-bold text-brand-dark">{r.name} {r.surname}</td>
                    <td className="px-3 py-3 text-stone-500">{r.cohort_name ?? '—'}</td>
                    <td className="px-3 py-3 text-stone-600">{formatChoices(r.choices)}</td>
                    <td className="px-3 py-3">
                      <span className={`text-[11px] font-black px-2.5 py-1 rounded-full ${
                        r.status === 'admin_received' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {r.status === 'admin_received' ? 'Stored' : 'Awaiting storage'}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <div className="flex items-center gap-3 justify-end">
                        {r.status !== 'admin_received' ? (
                          <button onClick={() => handleReceive(r.id)}
                            className="flex items-center gap-1.5 text-xs font-black text-brand-dark hover:text-green-700 transition-colors">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Mark Stored
                          </button>
                        ) : (
                          <button onClick={() => setConfirmDelete(r)}
                            className="flex items-center gap-1.5 text-xs font-black text-stone-400 hover:text-red-600 transition-colors">
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {confirmDelete && (
        <>
          <div onClick={() => setConfirmDelete(null)} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center mb-4">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <h2 className="text-base font-black text-brand-dark mb-1">
                Delete {confirmDelete.name} {confirmDelete.surname}'s submission?
              </h2>
              <p className="text-sm text-stone-500 mb-6">
                This permanently removes the stored subject selection. The student will need to fill it out again if the window is reopened. This cannot be undone.
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
                    : 'Delete'
                  }
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
