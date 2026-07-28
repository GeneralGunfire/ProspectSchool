import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { HeartHandshake, ShieldCheck, ShieldOff, TrendingUp, Info } from 'lucide-react';
import type { ParentSession } from '../../../lib/auth';
import type { ParentChild } from '../../../lib/parents';
import {
  fetchChildWellbeingSummaryForParent, deriveConcernSummary, hasActiveConsent,
} from '../../../lib/wellbeing';
import ParentWellbeingConsentPage from './ParentWellbeingConsentPage';

const ease = [0.23, 1, 0.32, 1] as [number, number, number, number];

// Two-tier parent wellbeing summary — research: WELLBEING_HELP_EXPANSION_
// RESEARCH.md section 5. Tier 1 (concernLevel 'low') shows only a routine,
// low-detail framing. Tier 2 ('some'/'high', or an open safety flag) shows
// concern level + primary concern area + trend + what the school is doing +
// suggested parent actions — still never raw answers at any tier (structurally
// guaranteed: ConcernSummary never carries CheckinAnswers). The safety-flag
// case explicitly states whether direct human contact has happened — this
// portal message is NOT the crisis notification itself; the existing
// staff-alert/same-day-contact pipeline in wellbeing.ts remains that.
// Consent management is nested here as a sub-view rather than a second nav
// item, per the confirmed decision.

const CONCERN_AREA_LABEL: Record<string, string> = {
  mood: 'mood/energy',
  anxiety: 'worry/stress',
  sudden_change: 'a sudden change from their usual level',
};

interface ParentWellbeingSummaryPageProps {
  session: ParentSession;
  child: ParentChild;
}

export default function ParentWellbeingSummaryPage({ session, child }: ParentWellbeingSummaryPageProps) {
  const [loading, setLoading] = useState(true);
  const [consented, setConsented] = useState(false);
  const [showConsent, setShowConsent] = useState(false);
  const [data, setData] = useState<Awaited<ReturnType<typeof fetchChildWellbeingSummaryForParent>> | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [consent, summary] = await Promise.all([
        hasActiveConsent(child.student_id),
        fetchChildWellbeingSummaryForParent(child.student_id, session.school_id, session.parent_id),
      ]);
      setConsented(consent);
      setData(summary);
      setLoading(false);
    })();
  }, [child.student_id, session.school_id, session.parent_id]);

  return (
    <div className="student-home min-h-full pb-16 relative">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-5">
        <p className="text-[12px] text-[rgba(31,36,33,0.5)] font-medium">{child.name} {child.surname}</p>
        <h1 className="text-brand-dark text-[30px] sm:text-[36px] leading-tight mt-1" style={{ fontWeight: 600 }}>
          <span className="relative inline-block">
            <span className="text-transparent bg-clip-text bg-linear-to-r from-sky-500 via-sky-600 to-blue-600">
              Wellbeing
            </span>
            <svg aria-hidden="true" viewBox="0 0 320 14" className="absolute left-0 -bottom-1 w-full h-3 text-amber-500/70" preserveAspectRatio="none">
              <path d="M2 9C60 3 180 2 318 8" stroke="currentColor" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            </svg>
          </span>
        </h1>
      </div>

      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4">
        {showConsent ? (
          <>
            <button onClick={() => setShowConsent(false)} className="text-[13px] font-bold text-stone-500 hover:text-brand-dark">
              ← Back to summary
            </button>
            <ParentWellbeingConsentPage session={session} child={child} />
          </>
        ) : loading ? (
          <div className="paper-card rounded p-6 space-y-3">
            <div className="h-4 w-1/2 bg-stone-100 rounded animate-pulse" />
            <div className="h-4 w-2/3 bg-stone-100 rounded animate-pulse" />
          </div>
        ) : !consented ? (
          <ConsentNeededCard onManageConsent={() => setShowConsent(true)} />
        ) : data && 'error' in data ? (
          <div className="paper-card rounded p-8 text-center text-[14px] text-stone-500">{data.error}</div>
        ) : data ? (
          <SummaryContent data={data} childName={child.name} onManageConsent={() => setShowConsent(true)} />
        ) : null}
      </div>
    </div>
  );
}

function ConsentNeededCard({ onManageConsent }: { onManageConsent: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease }}
      className="paper-card rounded p-8 flex flex-col items-center text-center">
      <ShieldOff className="w-9 h-9 text-stone-300 mb-3" />
      <h2 className="text-[17px] font-semibold text-brand-dark mb-1">Consent needed</h2>
      <p className="text-[13.5px] text-stone-500 max-w-sm mb-4">
        Grant consent for the wellbeing check-in to see a summary here.
      </p>
      <button onClick={onManageConsent} className="px-4 py-2 rounded-xl text-white text-[13px] font-bold hover:opacity-90 transition-opacity" style={{ background: 'linear-gradient(90deg, #0ea5e9, #2563eb)' }}>
        Manage consent
      </button>
    </motion.div>
  );
}

function SummaryContent({
  data, childName, onManageConsent,
}: {
  data: { history: import('../../../lib/wellbeing').WellbeingCheckin[]; openSafetyFlag: import('../../../lib/wellbeing').SafetyFlag | null; openRoutineAlerts: import('../../../lib/wellbeing').RoutineAlert[] };
  childName: string;
  onManageConsent: () => void;
}) {
  const openAlert = data.openRoutineAlerts.find(a => a.status === 'open') ?? null;
  const summary = deriveConcernSummary(data.history, openAlert, !!data.openSafetyFlag);

  if (data.history.length === 0) {
    return (
      <>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease }}
          className="paper-card rounded p-6 sm:p-8 text-center">
          <p className="text-[14px] text-stone-600">No check-ins yet for {childName}.</p>
        </motion.div>
        <ManageConsentLink onClick={onManageConsent} />
      </>
    );
  }

  // ── Safety-flag tier: states human contact has happened/will happen —
  // this portal message is explicitly not the crisis notification itself. ──
  if (data.openSafetyFlag) {
    const contacted = !!data.openSafetyFlag.firstContactAt;
    return (
      <>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease }}
          className="rounded-xl border-2 border-red-300 bg-red-50/60 p-6 sm:p-8 space-y-3">
          <h2 className="text-[17px] font-semibold text-red-900">We're very concerned about {childName}'s safety</h2>
          <p className="text-[14px] text-red-800 leading-relaxed">
            Based on {childName}'s recent check-in, the school has taken this seriously.{' '}
            {contacted
              ? 'A staff member has already made contact.'
              : 'A staff member will contact you directly, usually the same day — this page is not a substitute for that contact.'}
          </p>
          <p className="text-[13px] text-red-700">
            If you are ever worried about {childName}'s immediate safety, please contact them directly or call
            emergency services (10111 / 10177) or a crisis line — Childline 116, SADAG 0800 567 567.
          </p>
        </motion.div>
        <ManageConsentLink onClick={onManageConsent} />
      </>
    );
  }

  // ── Tier 1: low detail, always-on ──
  if (summary.concernLevel === 'low') {
    return (
      <>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease }}
          className="paper-card rounded p-6 sm:p-8 space-y-3">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <h2 className="text-[16px] font-semibold text-brand-dark">Things look generally okay</h2>
          </div>
          <p className="text-[13.5px] text-stone-600">Recent check-ins suggest things are generally okay for {childName}.</p>
          <p className="text-[12.5px] text-stone-400">{summary.trendLabel}</p>
        </motion.div>
        <ParentResourcesBox />
        <ManageConsentLink onClick={onManageConsent} />
      </>
    );
  }

  // ── Tier 2: escalated detail ──
  return (
    <>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease }}
        className="rounded-xl border border-amber-300 bg-amber-50/60 p-6 sm:p-8 space-y-3">
        <h2 className="text-[16px] font-semibold text-brand-dark">We're a bit concerned</h2>
        <p className="text-[13.5px] text-stone-700 leading-relaxed">
          Recent check-ins suggest {childName} has been finding things quite tough
          {summary.primaryConcernArea ? `, especially around ${CONCERN_AREA_LABEL[summary.primaryConcernArea]}` : ''}.
        </p>
        <p className="text-[12.5px] text-stone-500 flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5" /> {summary.trendLabel}</p>

        <div className="rounded-lg bg-white border border-amber-200 p-3.5">
          <p className="text-[12px] font-bold uppercase tracking-wide text-amber-700 mb-1">What the school is doing</p>
          <p className="text-[13px] text-stone-600">
            {childName}'s homeroom teacher has been notified and will follow up with them. Our school support team
            (SBST/LSA) is available if needed.
          </p>
        </div>

        <div className="rounded-lg bg-white border border-amber-200 p-3.5">
          <p className="text-[12px] font-bold uppercase tracking-wide text-amber-700 mb-1">Suggested next step</p>
          <p className="text-[13px] text-stone-600">
            A calm, non-judgemental conversation can help — try something like "I've noticed things seem a bit hard
            lately, want to talk about it?" If this continues, it may be worth speaking to a doctor, counsellor, or
            a helpline.
          </p>
        </div>

        <p className="text-[12.5px] text-amber-800">
          You're welcome to contact the homeroom teacher or the school directly to talk this through.
        </p>
      </motion.div>
      <ParentResourcesBox />
      <ManageConsentLink onClick={onManageConsent} />
    </>
  );
}

function ParentResourcesBox() {
  return (
    <div className="rounded-xl bg-stone-50 border border-brand-border p-4 space-y-1.5">
      <p className="text-[12px] font-semibold text-muted-2 flex items-center gap-1.5">
        <Info className="w-3.5 h-3.5" /> Resources for parents
      </p>
      <p className="text-[13px] text-stone-600">How to talk to your teen about stress and mood, and when to consider extra support.</p>
      <p className="text-[12.5px] text-stone-500">Childline 116 · SADAG 0800 567 567 · Lifeline 0861 322 322</p>
    </div>
  );
}

function ManageConsentLink({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center gap-2 text-[13px] font-bold text-stone-500 hover:text-brand-dark">
      <HeartHandshake className="w-4 h-4" /> Manage consent
    </button>
  );
}
