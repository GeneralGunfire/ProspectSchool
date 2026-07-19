import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { HeartHandshake, ShieldCheck, ShieldOff, Clock } from 'lucide-react';
import type { ParentSession } from '../../../lib/auth';
import type { ParentChild } from '../../../lib/parents';
import {
  fetchConsentStatus, fetchConsentHistory, recordParentConsent,
  type ConsentStatus, type ConsentRecord,
} from '../../../lib/wellbeing';

const ease = [0.23, 1, 0.32, 1] as [number, number, number, number];

interface ParentWellbeingConsentPageProps {
  session: ParentSession;
  child: ParentChild;
}

export default function ParentWellbeingConsentPage({ session, child }: ParentWellbeingConsentPageProps) {
  const [status, setStatus] = useState<ConsentStatus>('not_set');
  const [history, setHistory] = useState<ConsentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [s, h] = await Promise.all([
        fetchConsentStatus(child.student_id),
        fetchConsentHistory(child.student_id),
      ]);
      setStatus(s);
      setHistory(h);
      setLoading(false);
    })();
  }, [child.student_id]);

  async function handleDecision(decision: 'granted' | 'revoked') {
    setBusy(true);
    setError(null);
    const result = await recordParentConsent(child.student_id, session.school_id, session.parent_id, decision);
    setBusy(false);
    if (!result.success) { setError(result.error); return; }
    setStatus(decision);
    const h = await fetchConsentHistory(child.student_id);
    setHistory(h);
  }

  return (
    <div className="student-home min-h-full pb-16 relative">
      <div className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 pointer-events-none" style={{ bottom: '-220px',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.45) 40%, rgba(255,255,255,0.22) 75%, transparent 100%)' }} />
        <div className="relative max-w-3xl mx-auto px-5 sm:px-8 pt-8 sm:pt-11 pb-6 sm:pb-8 w-full">
          <p className="text-[12px] text-[rgba(31,36,33,0.5)] font-medium">{child.name} {child.surname}</p>
          <h1 className="text-brand-dark text-[32px] sm:text-[42px] leading-[1.12] mt-2"
            style={{ fontFamily: 'var(--font-instrument)', fontWeight: 500, letterSpacing: '-0.02em' }}>
            Wellbeing check-ins
          </h1>
          <p className="text-[13px] text-[rgba(31,36,33,0.55)] mt-2.5 font-medium max-w-lg">
            Your consent for {child.name} to take part in the school's wellbeing check-in.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-8 relative z-10 space-y-5 pt-2 sm:pt-3">
        {loading ? (
          <div className="paper-card rounded p-6 space-y-3">
            <div className="h-4 w-1/2 bg-stone-100 rounded animate-pulse" />
            <div className="h-4 w-2/3 bg-stone-100 rounded animate-pulse" />
          </div>
        ) : (
          <>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease }}
              className="paper-card rounded p-6 sm:p-8 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0" style={{ background: 'var(--color-accent)' }}>
                  <HeartHandshake className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-[18px] font-semibold text-brand-dark">What this is</h2>
              </div>

              <p className="text-[14px] text-stone-600 leading-relaxed">
                Prospect offers a short, regular wellbeing check-in for students — a few simple questions about mood
                and anxiety, based on validated screening tools used in adolescent mental health (PHQ-2/GAD-2).
                It helps {child.name}'s homeroom teacher notice if things seem tough over time.
              </p>
              <p className="text-[14px] text-stone-600 leading-relaxed">
                This is <strong>not</strong> a medical test, does not diagnose any condition, and is <strong>not</strong> an
                emergency service. Only {child.name}'s homeroom teacher can see individual answers.
              </p>

              <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
                <p className="text-[13px] font-semibold text-amber-900 mb-1">One exception: safety</p>
                <p className="text-[12.5px] text-amber-800 leading-relaxed">
                  If {child.name} ever indicates they may not be safe, the school will act immediately to protect
                  their safety — alerting their homeroom teacher and contacting you — even before or without this
                  consent being granted. This is a legal safety exception (POPIA "vital interests"), separate from
                  routine check-in participation.
                </p>
              </div>

              <div className="rounded-xl bg-stone-50 border border-brand-border p-4 space-y-2">
                <p className="text-[12px] font-bold uppercase tracking-wide text-stone-500">Your rights</p>
                <ul className="text-[13.5px] text-stone-600 space-y-1.5 list-disc list-inside">
                  <li>You can grant or withdraw consent at any time — withdrawing stops new check-ins, existing records are kept per the school's retention policy.</li>
                  <li>You can request access to or correction of {child.name}'s data by contacting the school.</li>
                  <li>Every decision you make here is recorded with a timestamp, kept as a history.</li>
                </ul>
              </div>

              {error && <p className="text-[13px] text-red-600 font-medium">{error}</p>}

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => handleDecision('granted')}
                  disabled={busy || status === 'granted'}
                  className="flex-1 py-3 rounded-xl bg-brand-dark text-white text-[14px] font-bold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  {status === 'granted' ? 'Consent granted' : 'Grant consent'}
                </button>
                <button
                  onClick={() => handleDecision('revoked')}
                  disabled={busy || status === 'revoked' || status === 'not_set'}
                  className="flex-1 py-3 rounded-xl bg-white border border-brand-border text-stone-600 text-[14px] font-bold hover:bg-stone-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <ShieldOff className="w-4 h-4" />
                  Withdraw consent
                </button>
              </div>
            </motion.div>

            {history.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease, delay: 0.08 }}
                className="paper-card rounded overflow-hidden">
                <div className="px-5 sm:px-6 py-4" style={{ borderBottom: '1px solid var(--color-brand-border)' }}>
                  <h2 className="text-[15px] font-semibold text-brand-dark">Consent history</h2>
                </div>
                <div className="divide-y" style={{ borderColor: 'var(--color-brand-border)' }}>
                  {history.map((r) => (
                    <div key={r.id} className="px-5 sm:px-6 py-3 flex items-center gap-3">
                      <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span className={`text-[13px] font-bold ${r.decision === 'granted' ? 'text-emerald-700' : 'text-stone-500'}`}>
                        {r.decision === 'granted' ? 'Consent granted' : 'Consent withdrawn'}
                      </span>
                      <span className="text-[12px] text-stone-400 ml-auto">
                        {new Date(r.recordedAt).toLocaleString('en-ZA')}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
