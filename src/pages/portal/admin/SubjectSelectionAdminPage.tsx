import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { CalendarRange, CheckCircle2, Inbox, Save, Trash2, AlertTriangle } from 'lucide-react';
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
  const [imgLoaded, setImgLoaded] = useState(false);

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
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/45 leading-none">Admin</p>
          <h1 className="font-display font-extrabold text-white text-[28px] sm:text-[40px] mt-3 leading-[1.1]"
            style={{ letterSpacing: '-0.02em', textShadow: '0 2px 20px rgba(0,0,0,0.35)' }}>
            Subject Selection
          </h1>
          <p className="text-[11px] text-white/60 mt-1.5 font-medium">
            Open the Grade 9 subject selection window for {year} intake, and review teacher-approved submissions.
          </p>
        </div>
      </div>

      {/* ═══ Body ═══════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10 space-y-5 sm:space-y-6 pt-6 sm:pt-8">

      {/* Window control */}
      <div className="paper-card rounded p-6">
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
      <div className="paper-card rounded overflow-hidden">
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
