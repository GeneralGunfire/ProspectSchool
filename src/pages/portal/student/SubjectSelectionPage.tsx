import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Info, Lock, Send, CheckCircle2, AlertTriangle, Clock, ChevronDown, Gauge, TrendingUp, BarChart3, MessageSquareQuote } from 'lucide-react';
import type { StudentSession } from '../../../lib/auth';
import { Spinner } from '../../../shared/components/Spinner';
import {
  fetchActiveWindow, isWindowCurrentlyOpen, fetchSubjectCatalog,
  fetchStudentSelection, saveDraftSelection, submitSelection,
  type SubjectCatalogEntry, type SubjectSelection, type SubjectChoices,
} from '../../../lib/subjectSelection';

interface SubjectSelectionPageProps { session: StudentSession; }

function currentIntakeYear(): number {
  return new Date().getFullYear() + 1;
}

const DEFAULT_CHOICES: SubjectChoices = {
  math_stream: 'pure_math',
  elective_a: 'accounting',
  elective_b: 'physical_science',
  additional: null,
  ap_math: false,
};

function RatingBar({ label, value, icon: Icon, selected }: { label: string; value: number; icon: typeof Gauge; selected: boolean }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className={`w-3 h-3 ${selected ? 'text-white/70' : 'text-stone-400'}`} />
        <span className={`text-[10px] font-black uppercase tracking-wide ${selected ? 'text-white/70' : 'text-stone-400'}`}>{label}</span>
      </div>
      <div className={`flex gap-1`}>
        {[1, 2, 3, 4, 5].map((i) => (
          <span key={i} className={`h-1.5 flex-1 rounded-full ${
            i <= value
              ? (selected ? 'bg-white' : 'bg-brand-dark')
              : (selected ? 'bg-white/20' : 'bg-stone-200')
          }`} />
        ))}
      </div>
    </div>
  );
}

function SubjectCard({ entry, selected, onClick }: { entry: SubjectCatalogEntry; selected: boolean; onClick?: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const hasRichInfo = entry.difficulty != null || entry.usefulness != null || entry.national_avg_pct != null || entry.honest_notes;

  return (
    <div
      className={`text-left w-full rounded border transition-all ${
        selected ? 'border-brand-dark bg-brand-dark text-white' : 'border-brand-border bg-white hover:border-stone-300'
      }`}
    >
      <button
        type="button"
        onClick={onClick}
        disabled={!onClick}
        className={`text-left w-full p-4 ${!onClick ? 'cursor-default' : 'cursor-pointer'}`}
      >
        <div className="flex items-start justify-between gap-2">
          <h3 className={`text-sm font-black ${selected ? 'text-white' : 'text-brand-dark'}`}>{entry.label}</h3>
          {selected && <CheckCircle2 className="w-4 h-4 shrink-0 text-white" />}
        </div>
        <p className={`text-xs mt-1.5 ${selected ? 'text-white/80' : 'text-stone-500'}`}>{entry.description}</p>
        {entry.what_it_covers.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {entry.what_it_covers.map((c) => (
              <span key={c} className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${selected ? 'bg-white/15 text-white' : 'bg-stone-100 text-stone-600'}`}>{c}</span>
            ))}
          </div>
        )}
        {entry.career_paths.length > 0 && (
          <p className={`text-[11px] mt-2 ${selected ? 'text-white/70' : 'text-stone-400'}`}>
            Careers: {entry.career_paths.join(', ')}
          </p>
        )}
        {entry.requirements && (
          <p className={`text-[11px] mt-1.5 font-bold ${selected ? 'text-amber-200' : 'text-amber-600'}`}>{entry.requirements}</p>
        )}
      </button>

      {hasRichInfo && (
        <>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setExpanded((v) => !v); }}
            className={`w-full flex items-center justify-center gap-1.5 text-[11px] font-black py-2 border-t transition-colors ${
              selected ? 'border-white/15 text-white/70 hover:text-white' : 'border-brand-border/60 text-stone-400 hover:text-brand-dark'
            }`}
          >
            {expanded ? 'Show less' : 'More detail'}
            <ChevronDown className={`w-3 h-3 transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence initial={false}>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className={`px-4 pb-4 pt-1 space-y-3 border-t ${selected ? 'border-white/15' : 'border-brand-border/60'}`}>
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    {entry.difficulty != null && (
                      <RatingBar label="Difficulty" value={entry.difficulty} icon={Gauge} selected={selected} />
                    )}
                    {entry.usefulness != null && (
                      <RatingBar label="Usefulness" value={entry.usefulness} icon={TrendingUp} selected={selected} />
                    )}
                  </div>
                  {entry.national_avg_pct != null && (
                    <div className="flex items-center gap-1.5">
                      <BarChart3 className={`w-3.5 h-3.5 shrink-0 ${selected ? 'text-white/70' : 'text-stone-400'}`} />
                      <p className={`text-[11px] ${selected ? 'text-white/80' : 'text-stone-500'}`}>
                        Approx. national average: <span className="font-black">{entry.national_avg_pct}%</span>
                        <span className={selected ? 'text-white/50' : 'text-stone-400'}> (illustrative estimate, not an official figure)</span>
                      </p>
                    </div>
                  )}
                  {entry.honest_notes && (
                    <div className="flex items-start gap-1.5">
                      <MessageSquareQuote className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${selected ? 'text-white/70' : 'text-stone-400'}`} />
                      <p className={`text-[11px] leading-relaxed ${selected ? 'text-white/80' : 'text-stone-600'}`}>{entry.honest_notes}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}

export default function SubjectSelectionPage({ session }: SubjectSelectionPageProps) {
  const [loading, setLoading] = useState(true);
  const [windowOpen, setWindowOpen] = useState(false);
  const [catalog, setCatalog] = useState<SubjectCatalogEntry[]>([]);
  const [selection, setSelection] = useState<SubjectSelection | null>(null);
  const [choices, setChoices] = useState<SubjectChoices>(DEFAULT_CHOICES);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const year = currentIntakeYear();
  const eligible = session.grade === 9;

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const [w, cat, sel] = await Promise.all([
      fetchActiveWindow(session.school_id),
      fetchSubjectCatalog(),
      fetchStudentSelection(session.student_id, year),
    ]);
    setWindowOpen(isWindowCurrentlyOpen(w));
    setCatalog(cat);
    setSelection(sel);
    if (sel) setChoices(sel.choices);
    setLoading(false);
  }

  const byCode = (code: string) => catalog.find((c) => c.code === code);

  const isApproved = selection?.status === 'teacher_approved' || selection?.status === 'admin_received';
  const isLocked = isApproved || !windowOpen;
  const isSubmitted = selection?.status === 'submitted';

  function update<K extends keyof SubjectChoices>(key: K, value: SubjectChoices[K]) {
    if (isLocked) return;
    setChoices((prev) => {
      const next = { ...prev, [key]: value };
      // Additional subject rules: History only offerable as "additional" if Physical Science was chosen as elective_b;
      // Tourism only offerable as "additional" if it wasn't already taken as elective_a.
      if (key === 'elective_b' && next.additional === 'history' && value !== 'physical_science') next.additional = null;
      if (key === 'elective_a' && next.additional === 'tourism' && value === 'tourism') next.additional = null;
      return next;
    });
    setSaved(false);
  }

  async function handleSaveDraft() {
    setSaving(true);
    setError(null);
    const result = await saveDraftSelection(session.student_id, session.school_id, year, choices);
    if (!result.success) { setError(result.error); setSaving(false); return; }
    setSaving(false);
    setSaved(true);
    await load();
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    const saveResult = await saveDraftSelection(session.student_id, session.school_id, year, choices);
    if (!saveResult.success) { setError(saveResult.error); setSubmitting(false); return; }
    const result = await submitSelection(session.student_id, year);
    if (!result.success) { setError(result.error); setSubmitting(false); return; }
    setSubmitting(false);
    await load();
  }

  const additionalOptions: { value: 'history' | 'tourism' | 'arabic'; disabled: boolean; reason?: string }[] = [
    { value: 'history', disabled: choices.elective_b !== 'physical_science', reason: 'Only available if you chose Physical Science above' },
    { value: 'tourism', disabled: choices.elective_a === 'tourism', reason: 'Already selected as your elective' },
    { value: 'arabic', disabled: false },
  ];

  if (loading) {
    return (
      <div className="subject-selection student-home min-h-full pb-16 relative flex items-center justify-center py-24">
        <Spinner />
      </div>
    );
  }

  if (!eligible) {
    return (
      <div className="subject-selection student-home min-h-full pb-16 relative px-4 py-6 sm:p-6 md:p-8 max-w-3xl w-full mx-auto">
        <div className="paper-card rounded p-12 text-center">
          <Lock className="w-8 h-8 text-stone-300 mx-auto mb-3" />
          <h2 className="text-lg font-black text-brand-dark">Not available</h2>
          <p className="text-sm text-stone-500 mt-1">Subject selection is only available to Grade 9 students.</p>
        </div>
      </div>
    );
  }

  if (!windowOpen && !selection) {
    return (
      <div className="subject-selection student-home min-h-full pb-16 relative px-4 py-6 sm:p-6 md:p-8 max-w-3xl w-full mx-auto">
        <div className="paper-card rounded p-12 text-center">
          <Clock className="w-8 h-8 text-stone-300 mx-auto mb-3" />
          <h2 className="text-lg font-black text-brand-dark">Not open yet</h2>
          <p className="text-sm text-stone-500 mt-1">Your school hasn't opened Grade 10 subject selection yet. Check back soon.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="subject-selection student-home min-h-full pb-16 relative">

      {/* ═══ Hero — wave-strip system, matches Home dashboard ═══ */}
      <div className="relative overflow-hidden">

        <div className="relative max-w-4xl mx-auto px-5 sm:px-8 pt-8 sm:pt-11 pb-6 sm:pb-8 w-full">
          <p className="text-[12px] text-[rgba(31,36,33,0.5)] font-medium">Grade 10 · {year}</p>
          <h1 className="text-brand-dark text-[32px] sm:text-[42px] leading-[1.12] mt-2"
            style={{ fontFamily: 'var(--font-instrument)', fontWeight: 500, letterSpacing: '-0.02em' }}>
            Subject Selection
          </h1>
          <p className="text-[13px] text-[rgba(31,36,33,0.5)] mt-2.5 font-medium">
            Choose your Grade 10 subjects for next year. Your homeroom teacher will review before it's sent to admin.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-8 relative z-10 pt-2 sm:pt-3 pb-6">

      {/* Status banner */}
      {selection && (
        <div className={`rounded p-4 mb-6 flex items-start gap-3 ${
          selection.status === 'rejected' ? 'bg-red-50 border border-red-200' :
          isApproved ? 'bg-green-50 border border-green-200' :
          isSubmitted ? 'bg-amber-50 border border-amber-200' : 'bg-stone-50 border border-brand-border'
        }`}>
          {selection.status === 'rejected' ? <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" /> :
           isApproved ? <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" /> :
           <Info className="w-4 h-4 text-stone-500 mt-0.5 shrink-0" />}
          <div>
            <p className="text-sm font-black text-brand-dark">
              {selection.status === 'rejected' && 'Sent back by your homeroom teacher'}
              {selection.status === 'submitted' && 'Submitted — awaiting homeroom teacher approval'}
              {selection.status === 'teacher_approved' && 'Approved by your homeroom teacher'}
              {selection.status === 'admin_received' && 'Approved and stored by admin'}
              {selection.status === 'draft' && 'Draft — not yet submitted'}
            </p>
            {selection.teacher_comment && (
              <p className="text-xs text-stone-600 mt-1">"{selection.teacher_comment}"</p>
            )}
          </div>
        </div>
      )}

      {isLocked && (
        <div className="flex items-center gap-2 text-xs text-stone-400 mb-4">
          <Lock className="w-3.5 h-3.5" />
          {isApproved
            ? 'Your selection has been approved and can no longer be edited.'
            : 'Subject selection is currently closed — you can view your choices but not change them.'}
        </div>
      )}

      <div className="space-y-8">
        {/* Compulsory subjects */}
        <section>
          <h2 className="text-sm font-black text-brand-dark mb-3">Compulsory Subjects</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {['deeniyat', 'religious_studies', 'english', 'afrikaans', 'life_orientation'].map((code) => {
              const entry = byCode(code);
              return entry ? <SubjectCard key={code} entry={entry} selected /> : null;
            })}
          </div>
        </section>

        {/* Math stream */}
        <section>
          <h2 className="text-sm font-black text-brand-dark mb-1">Mathematics</h2>
          <p className="text-xs text-stone-500 mb-3">Choose Pure Mathematics or Mathematical Literacy.</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {(['pure_math', 'math_lit'] as const).map((code) => {
              const entry = byCode(code);
              return entry ? (
                <SubjectCard key={code} entry={entry} selected={choices.math_stream === code}
                  onClick={isLocked ? undefined : () => update('math_stream', code)} />
              ) : null;
            })}
          </div>
        </section>

        {/* Elective A */}
        <section>
          <h2 className="text-sm font-black text-brand-dark mb-1">Elective — Choose 1</h2>
          <p className="text-xs text-stone-500 mb-3">Accounting, EGD, or Tourism.</p>
          <div className="grid sm:grid-cols-3 gap-3">
            {(['accounting', 'egd', 'tourism'] as const).map((code) => {
              const entry = byCode(code);
              return entry ? (
                <SubjectCard key={code} entry={entry} selected={choices.elective_a === code}
                  onClick={isLocked ? undefined : () => update('elective_a', code)} />
              ) : null;
            })}
          </div>
        </section>

        {/* Elective B */}
        <section>
          <h2 className="text-sm font-black text-brand-dark mb-1">Choose 1</h2>
          <p className="text-xs text-stone-500 mb-3">History or Physical Science (Physics + Chemistry).</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {(['history', 'physical_science'] as const).map((code) => {
              const entry = byCode(code);
              return entry ? (
                <SubjectCard key={code} entry={entry} selected={choices.elective_b === code}
                  onClick={isLocked ? undefined : () => update('elective_b', code)} />
              ) : null;
            })}
          </div>
        </section>

        {/* Additional subject */}
        <section>
          <h2 className="text-sm font-black text-brand-dark mb-1">Additional Subject — Optional</h2>
          <p className="text-xs text-stone-500 mb-3">Pick at most one: History (if you chose Physical Science), Tourism, or Arabic.</p>
          <div className="grid sm:grid-cols-3 gap-3">
            {additionalOptions.map(({ value, disabled, reason }) => {
              const entry = byCode(value);
              if (!entry) return null;
              const cardDisabled = disabled || isLocked;
              return (
                <div key={value} className={cardDisabled ? 'opacity-40 pointer-events-none' : ''}>
                  <SubjectCard entry={entry} selected={choices.additional === value}
                    onClick={cardDisabled ? undefined : () => update('additional', choices.additional === value ? null : value)} />
                  {disabled && reason && <p className="text-[10px] text-stone-400 mt-1 px-1">{reason}</p>}
                </div>
              );
            })}
          </div>
        </section>

        {/* AP Math */}
        <section>
          <h2 className="text-sm font-black text-brand-dark mb-1">Additional Pure Mathematics — Optional</h2>
          <p className="text-xs text-stone-500 mb-3">Requires 80%+ in Grade 9 Mathematics. Speak to your Math teacher if unsure.</p>
          {byCode('ap_math') && (
            <div className="max-w-md">
              <SubjectCard entry={byCode('ap_math')!} selected={choices.ap_math}
                onClick={isLocked ? undefined : () => update('ap_math', !choices.ap_math)} />
            </div>
          )}
        </section>
      </div>

      {error && <p className="text-sm text-red-600 mt-6">{error}</p>}

      {!isLocked && (
        <div className="flex items-center gap-3 mt-8 pt-6 border-t border-brand-border">
          <motion.button onClick={handleSaveDraft} disabled={saving || submitting} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="text-sm font-black text-brand-dark px-5 py-2.5 rounded border border-brand-border hover:bg-brand-border transition-colors disabled:opacity-60"
            style={{ background: 'var(--color-paper-raise)' }}>
            {saved ? 'Saved' : 'Save Draft'}
          </motion.button>
          <motion.button onClick={handleSubmit} disabled={saving || submitting} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="edge-glow flex items-center gap-2 bg-accent text-white text-sm font-black px-5 py-2.5 rounded hover:bg-[var(--color-accent-soft)] transition-colors disabled:opacity-60">
            <Send className="w-4 h-4" /> {isSubmitted ? 'Resubmit' : 'Submit for Approval'}
          </motion.button>
        </div>
      )}
      </div>
    </div>
  );
}
