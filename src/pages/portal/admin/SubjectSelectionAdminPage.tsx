import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { CalendarRange, CheckCircle2, Inbox, Save, Trash2, AlertTriangle } from 'lucide-react';
import Checkbox from '../../../shared/components/Checkbox';
import Modal from '../../../shared/components/Modal';
import type { AdminSession } from '../../../lib/auth';
import {
  fetchActiveWindow, setWindow, isWindowCurrentlyOpen,
  fetchAdminSelections, markAdminReceived, deleteSelection,
  type SubjectSelectionWindow, type StudentSelectionRow,
} from '../../../lib/subjectSelection';

const ease = [0.23, 1, 0.32, 1] as [number, number, number, number];

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
    <div className="student-home min-h-full pb-16 relative">

      {/* ═══ Header ═══════════════════════════════════════════════ */}
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-5">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }}>
          <p className="text-[12px] text-[rgba(31,36,33,0.5)] font-medium">Admin</p>
          <h1 className="text-brand-dark text-[30px] sm:text-[36px] leading-tight mt-1" style={{ fontWeight: 600 }}>
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-linear-to-r from-sky-500 via-sky-600 to-blue-600">
                Subject selection
              </span>
              <svg aria-hidden="true" viewBox="0 0 320 14" className="absolute left-0 -bottom-1 w-full h-3 text-amber-500/70" preserveAspectRatio="none">
                <path d="M2 9C60 3 180 2 318 8" stroke="currentColor" strokeWidth="3.5" fill="none" strokeLinecap="round" />
              </svg>
            </span>
          </h1>
          <p className="text-[13px] text-[rgba(31,36,33,0.5)] mt-2 font-medium">
            Open the Grade 9 subject selection window for {year} intake, and review teacher-approved submissions.
          </p>
        </motion.div>
      </div>

      {/* ═══ Body ═══════════════════════════════════════════════ */}
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4">

      {/* Window control */}
      <div className="paper-card rounded p-6">
        <div className="flex items-center gap-2 mb-4">
          <CalendarRange className="w-4 h-4" style={{ color: 'var(--color-navy)' }} />
          <p className="text-[15px] text-brand-dark" style={{ fontWeight: 600 }}>Selection window — {year} intake</p>
          <span className={`ml-auto text-[12px] font-semibold px-2.5 py-1 rounded-full ${currentlyOpen ? 'bg-green-100 text-green-700' : 'bg-stone-100 text-stone-500'}`}>
            {currentlyOpen ? 'Open now' : 'Closed'}
          </span>
        </div>
        {loading ? (
          <div className="w-5 h-5 border-2 border-brand-border border-t-stone-700 rounded-full animate-spin" />
        ) : (
          <form onSubmit={handleSaveWindow} className="grid sm:grid-cols-3 gap-4 items-end">
            <label className="block">
              <span className="text-[12px] text-muted-2">Opens</span>
              <input type="date" value={opensAt} onChange={(e) => setOpensAt(e.target.value)}
                className="mt-1 w-full rounded border border-brand-border px-3 py-2 text-sm" required />
            </label>
            <label className="block">
              <span className="text-[12px] text-muted-2">Closes</span>
              <input type="date" value={closesAt} onChange={(e) => setClosesAt(e.target.value)}
                className="mt-1 w-full rounded border border-brand-border px-3 py-2 text-sm" required />
            </label>
            <div className="flex items-center gap-4">
              <Checkbox checked={isOpen} onChange={setIsOpen} label="Enabled" />

              <motion.button type="submit" disabled={saving} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className="flex items-center gap-1 text-[14px] font-semibold transition-colors disabled:opacity-60" style={{ color: 'var(--color-navy)' }}>
                <Save className="w-3.5 h-3.5" /> {saved ? 'Saved' : 'Save'}
              </motion.button>
            </div>
          </form>
        )}
        <p className="text-xs text-stone-400 mt-3">
          When enabled and within the date range, Grade 9 students can access "Subject Selection" from their portal.
        </p>
      </div>

      {/* Approved submissions */}
      <div className="paper-card rounded overflow-hidden">
        <div className="flex items-center gap-2 px-6 pt-6 pb-4">
          <Inbox className="w-4 h-4" style={{ color: 'var(--color-navy)' }} />
          <p className="text-[15px] text-brand-dark" style={{ fontWeight: 600 }}>Teacher-approved submissions</p>
        </div>
        {loading ? null : rows.length === 0 ? (
          <div className="px-6 pb-8 flex flex-col items-center text-center">
            <Inbox className="w-9 h-9 text-stone-200 mb-3" />
            <p className="text-sm font-bold text-stone-500">No submissions yet</p>
            <p className="text-xs text-stone-400 mt-1">Approved subject selections from homeroom teachers will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-t border-brand-border text-left text-[12px] font-semibold text-muted-2">
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
                      <span className={`text-[12px] font-semibold px-2.5 py-1 rounded-full ${
                        r.status === 'admin_received' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {r.status === 'admin_received' ? 'Stored' : 'Awaiting storage'}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <div className="flex items-center gap-3 justify-end">
                        {r.status !== 'admin_received' ? (
                          <button onClick={() => handleReceive(r.id)}
                            className="flex items-center gap-1 text-[13px] font-semibold transition-colors" style={{ color: 'var(--color-navy)' }}>
                            <CheckCircle2 className="w-3.5 h-3.5" /> Mark stored
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
      </div>

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
        <h2 className="text-base font-black text-brand-dark mb-1">
          Delete {confirmDelete?.name} {confirmDelete?.surname}'s submission?
        </h2>
        <p className="text-sm text-stone-500">
          This permanently removes the stored subject selection. The student will need to fill it out again if the window is reopened. This cannot be undone.
        </p>
      </Modal>
    </div>
  );
}
