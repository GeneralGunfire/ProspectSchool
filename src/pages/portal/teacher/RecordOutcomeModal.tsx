import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { TeacherSession } from '../../../lib/auth';
import { fetchStudentResults, type StudentResult } from '../../../lib/marks';
import { recordOutcome, type InterventionType, type Outcome, type OutcomeResult } from '../../../lib/interventions';
import { resolveActionsForIntervention } from '../../../lib/actionCenter';

export interface OutcomeTarget {
  interventionId: string;
  studentId:      number;
  subject:        string;
  subjectId:      number | null;
  type:           InterventionType;
  previousAvg:    number;
  studentLabel:   string;   // "Surname, Name" — shown in the header
}

interface RecordOutcomeModalProps {
  session:    TeacherSession;
  target:     OutcomeTarget;
  onClose:    () => void;
  onRecorded: (outcome: Outcome) => void;
}

// Mirrors the exact matching logic in interventions.ts's syncOutcomesFromMarks
// so a manually recorded outcome is computed the same way an automatic one
// would be — the whole point of prefilling is consistency with the auto path.
function matchesSubject(mark: StudentResult, subjectId: number | null, subject: string): boolean {
  if (mark.mark === null) return false;
  if (subjectId && mark.subject_id) return mark.subject_id === subjectId;
  const markFirstWord = (mark.subject_label ?? '').split(' ')[0].toLowerCase();
  const targetFirstWord = subject.split(' ')[0].toLowerCase();
  return mark.subject_label?.toLowerCase().includes(targetFirstWord) || subject.toLowerCase().includes(markFirstWord);
}

// Same thresholds as interventions.ts's recordOutcome — kept in sync manually
// since the preview must render before the write actually happens.
function computeResult(previousAvg: number, newAvg: number, latestMark: number): { improvement: number; result: OutcomeResult } {
  const improvement = Math.round((newAvg - previousAvg) * 10) / 10;
  const result: OutcomeResult =
    improvement >= 3 || latestMark >= 70 ? 'improved' :
    improvement > 0                      ? 'unchanged' :
                                            'declined';
  return { improvement, result };
}

const RESULT_STYLE: Record<OutcomeResult, { icon: typeof TrendingUp; color: string; bg: string; label: string }> = {
  improved:  { icon: TrendingUp,   color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200', label: 'Improved' },
  unchanged: { icon: Minus,        color: 'text-stone-500',   bg: 'bg-stone-50 border-brand-border',     label: 'Unchanged' },
  declined:  { icon: TrendingDown, color: 'text-red-500',     bg: 'bg-red-50 border-red-200',         label: 'Declined' },
};

export default function RecordOutcomeModal({ session, target, onClose, onRecorded }: RecordOutcomeModalProps) {
  const [loading, setLoading]   = useState(true);
  const [noMarks, setNoMarks]   = useState(false);
  const [newAvg, setNewAvg]     = useState('');
  const [latestMark, setLatestMark] = useState('');
  const [saving, setSaving]     = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchStudentResults(target.studentId, session.school_id).then(results => {
      if (cancelled) return;
      const subjectMarks = results.filter(m => matchesSubject(m, target.subjectId, target.subject));

      if (subjectMarks.length === 0) {
        setNoMarks(true);
        setLoading(false);
        return;
      }

      const avg = subjectMarks.reduce((s, m) => s + (m.mark! / m.total) * 100, 0) / subjectMarks.length;
      const latest = [...subjectMarks].sort((a, b) =>
        (b.marked_at ?? b.created_at).localeCompare(a.marked_at ?? a.created_at)
      )[0];
      const latestPct = (latest.mark! / latest.total) * 100;

      setNewAvg(String(Math.round(avg)));
      setLatestMark(String(Math.round(latestPct)));
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [target.studentId, target.subjectId, target.subject, session.school_id]);

  const preview = useMemo(() => {
    const newAvgNum = Number(newAvg);
    const latestNum = Number(latestMark);
    if (newAvg === '' || latestMark === '' || Number.isNaN(newAvgNum) || Number.isNaN(latestNum)) return null;
    return computeResult(target.previousAvg, newAvgNum, latestNum);
  }, [newAvg, latestMark, target.previousAvg]);

  async function handleSubmit() {
    if (!preview) return;
    setSaving(true);
    const outcome = await recordOutcome(
      target.studentId,
      session.school_id,
      target.interventionId,
      target.subject,
      target.type,
      target.previousAvg,
      Number(newAvg),
      Number(latestMark),
    );
    resolveActionsForIntervention(target.interventionId); // fire-and-forget
    setSaving(false);
    onRecorded(outcome);
    onClose();
  }

  const canSubmit = preview !== null && !saving;

  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
      />
      <motion.div
        key="panel"
        initial={{ opacity: 0, scale: 0.96, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-brand-border/60 shrink-0">
            <div>
              <h2 className="text-base font-black text-brand-dark">Record Outcome</h2>
              <p className="text-xs text-stone-500 mt-0.5">{target.studentLabel} · {target.subject}</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-stone-100 text-stone-500 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="px-6 py-4 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="w-4 h-4 border-2 border-brand-border border-t-stone-600 rounded-full animate-spin" />
              </div>
            ) : (
              <>
                {noMarks && (
                  <p className="text-xs text-stone-500 bg-stone-50 rounded-xl px-3 py-2.5 mb-4">
                    No recent marks for {target.subject} — enter values manually.
                  </p>
                )}

                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-stone-500 mb-3">Subject Averages</p>

                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1">
                    <label className="block text-[10px] font-bold text-stone-500 mb-1">Previous Avg</label>
                    <div className="px-3 py-2 rounded-xl bg-stone-100 text-sm font-black text-stone-500">
                      {Math.round(target.previousAvg)}%
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="block text-[10px] font-bold text-stone-500 mb-1">New Avg</label>
                    <input
                      type="number" min={0} max={100}
                      value={newAvg}
                      onChange={e => setNewAvg(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-brand-border text-sm font-black text-stone-800 focus:outline-none focus:ring-2 focus:ring-brand-dark"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-[10px] font-bold text-stone-500 mb-1">Latest Assessment Mark</label>
                  <input
                    type="number" min={0} max={100}
                    value={latestMark}
                    onChange={e => setLatestMark(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-brand-border text-sm font-black text-stone-800 focus:outline-none focus:ring-2 focus:ring-brand-dark"
                  />
                </div>

                {preview && (() => {
                  const style = RESULT_STYLE[preview.result];
                  const Icon = style.icon;
                  return (
                    <div className={`rounded-xl border px-3 py-2.5 flex items-center gap-2.5 ${style.bg}`}>
                      <Icon className={`w-4 h-4 shrink-0 ${style.color}`} />
                      <p className={`text-xs font-black ${style.color}`}>
                        {style.label} — {preview.improvement >= 0 ? '+' : ''}{preview.improvement}%
                      </p>
                    </div>
                  );
                })()}
              </>
            )}
          </div>

          <div className="px-6 pb-6 pt-2 shrink-0">
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="w-full py-2.5 rounded-xl bg-brand-dark text-white text-sm font-black hover:bg-stone-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving…' : 'Record Outcome'}
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
