import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  HeartHandshake, AlertOctagon, TrendingDown, Clock, ChevronDown, Phone,
  CheckCircle2, Moon, Info, ShieldCheck, ArrowRight,
} from 'lucide-react';
import type { TeacherSession } from '../../../lib/auth';
import { fetchTeacherHomerooms } from '../../../lib/homeroom';
import {
  fetchHomeroomWellbeingRoster, acknowledgeSafetyFlag, logSafetyFlagFirstContact,
  snoozeRoutineAlert, markRoutineAlertAddressed, deriveConcernSummary,
  type WellbeingRosterEntry, type AlertType, type ConcernLevel,
} from '../../../lib/wellbeing';
import { CRISIS_RESOURCES } from '../../../lib/wellbeingCrisisResources';
import type { TeacherGuidanceTopicId } from '../../../lib/wellbeingTeacherGuidance';

const ease = [0.23, 1, 0.32, 1] as [number, number, number, number];

interface WellbeingHomeroomPageProps {
  session: TeacherSession;
  onOpenGuidance: (topicId: TeacherGuidanceTopicId) => void;
}

const CONCERN_LABEL: Record<ConcernLevel, string> = {
  low: 'Low concern',
  some: 'Some concern',
  high: 'High concern',
};
const CONCERN_TEXT: Record<ConcernLevel, string> = {
  low: 'Recent check-ins suggest things are generally okay.',
  some: 'Recent check-ins suggest things have been a bit tough.',
  high: 'Recent check-ins suggest things are quite difficult right now. This student may need extra support.',
};
const CONCERN_STYLE: Record<ConcernLevel, string> = {
  low: 'bg-emerald-100 text-emerald-700',
  some: 'bg-amber-100 text-amber-700',
  high: 'bg-red-100 text-red-700',
};
const CONCERN_AREA_LABEL: Record<string, string> = {
  mood: 'Main pattern: low mood/low energy',
  anxiety: 'Main pattern: high worry/stress',
  sudden_change: 'Main pattern: sudden change from usual level',
};
const NEXT_ACTION: Record<ConcernLevel, string> = {
  low: 'No specific action needed now. Continue to notice any changes.',
  some: 'Consider a brief, low-key check-in using the suggested script. If patterns continue, consider looping in the SBST/LSA and/or contacting parents.',
  high: 'Prioritise a private conversation this week using the suggested script. Involve SBST/LSA and contact parents/guardians; consider external support if needed.',
};

const ALERT_LABEL: Record<AlertType, string> = {
  sustained_elevation: 'Sustained elevation',
  marked_decline: 'Marked decline',
  new_high_distress: 'New high distress',
};

const ALERT_ICON: Record<AlertType, typeof TrendingDown> = {
  sustained_elevation: TrendingDown,
  marked_decline: TrendingDown,
  new_high_distress: AlertOctagon,
};

// Teacher script — research section 4. Surfaced directly in the UI on any
// flagged student, not buried in a help doc.
const OPEN_SCRIPT = `"I noticed your recent check-ins suggested things have been really tough. I'm glad you shared that. I'm not here to judge or fix everything, but I do care and want to make sure you're okay."`;
const SAFETY_ASK_SCRIPT = `"Sometimes when people feel this low, they think about hurting themselves or wish they wouldn't wake up. Has that been happening for you?" If yes: "Are you thinking about doing that now?" "Do you have a plan or a way to do it?"`;
const VALIDATE_SCRIPT = `"It makes sense you'd feel this way given what you're going through. Lots of learners feel like this at some point, and it can get better with support."`;
const LIMITS_SCRIPT = `"Because I'm worried about your safety, I can't keep this just between us. I need to involve [parent/guardian/another adult] so you can get proper support."`;
const NEXT_STEP_SCRIPT = `"Let's together decide who else should know and what help might make sense. There are also people outside school we can contact who specialise in this."`;

export default function WellbeingHomeroomPage({ session, onOpenGuidance }: WellbeingHomeroomPageProps) {
  const [cohortId, setCohortId] = useState<number | null>(null);
  const [roster, setRoster] = useState<WellbeingRosterEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedStudent, setExpandedStudent] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const homerooms = await fetchTeacherHomerooms(session.teacher_id);
    const first = homerooms[0] ?? null;
    setCohortId(first?.id ?? null);
    if (first) {
      const r = await fetchHomeroomWellbeingRoster(first.id, session.school_id, session.teacher_id);
      setRoster(r);
    }
    setLoading(false);
  }, [session.teacher_id, session.school_id]);

  useEffect(() => { load(); }, [load]);

  const safetyFlagged = roster.filter(r => r.openSafetyFlag);
  const routineFlagged = roster.filter(r => !r.openSafetyFlag && r.openRoutineAlerts.some(a => a.status === 'open'));
  const snoozed = roster.filter(r => !r.openSafetyFlag && r.openRoutineAlerts.some(a => a.status === 'snoozed') && !r.openRoutineAlerts.some(a => a.status === 'open'));
  const clear = roster.filter(r => !r.openSafetyFlag && r.openRoutineAlerts.length === 0);

  return (
    <div className="student-home min-h-full pb-16 relative">
      <div className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 pointer-events-none" style={{ bottom: '-220px',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.45) 40%, rgba(255,255,255,0.22) 75%, transparent 100%)' }} />
        <div className="relative max-w-5xl mx-auto px-5 sm:px-8 pt-8 sm:pt-11 pb-6 sm:pb-8 w-full">
          <p className="text-[12px] text-[rgba(31,36,33,0.5)] font-medium">Homeroom</p>
          <h1 className="text-brand-dark text-[32px] sm:text-[42px] leading-[1.12] mt-2"
            style={{ fontFamily: 'var(--font-instrument)', fontWeight: 500, letterSpacing: '-0.02em' }}>
            Wellbeing
          </h1>
          <p className="text-[13px] text-[rgba(31,36,33,0.55)] mt-2.5 font-medium max-w-xl">
            An early signal, not a diagnosis. This helps you notice patterns you might otherwise miss — it does not
            replace a caring conversation or professional support.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-8 relative z-10 space-y-6 pt-2 sm:pt-3">
        {loading ? (
          <div className="paper-card rounded p-6 space-y-3">
            <div className="h-4 w-1/2 bg-stone-100 rounded animate-pulse" />
            <div className="h-4 w-2/3 bg-stone-100 rounded animate-pulse" />
          </div>
        ) : !cohortId ? (
          <div className="paper-card rounded p-8 text-center text-[14px] text-stone-500">
            You are not currently assigned as a homeroom teacher.
          </div>
        ) : (
          <>
            {safetyFlagged.length > 0 && (
              <Section title="Needs acknowledgment now" tone="danger" count={safetyFlagged.length}>
                {safetyFlagged.map(entry => (
                  <SafetyFlagCard
                    key={entry.studentId}
                    entry={entry}
                    teacherId={session.teacher_id}
                    onChanged={load}
                    expanded={expandedStudent === entry.studentId}
                    onToggle={() => setExpandedStudent(expandedStudent === entry.studentId ? null : entry.studentId)}
                    onOpenGuidance={onOpenGuidance}
                  />
                ))}
              </Section>
            )}

            {routineFlagged.length > 0 && (
              <Section title="Pattern alerts — review when convenient" tone="warning" count={routineFlagged.length}>
                {routineFlagged.map(entry => (
                  <RoutineAlertCard
                    key={entry.studentId}
                    entry={entry}
                    teacherId={session.teacher_id}
                    onChanged={load}
                    expanded={expandedStudent === entry.studentId}
                    onToggle={() => setExpandedStudent(expandedStudent === entry.studentId ? null : entry.studentId)}
                    onOpenGuidance={onOpenGuidance}
                  />
                ))}
              </Section>
            )}

            {snoozed.length > 0 && (
              <Section title="Snoozed" tone="neutral" count={snoozed.length}>
                {snoozed.map(entry => (
                  <div key={entry.studentId} className="paper-card rounded p-4 flex items-center gap-3">
                    <Moon className="w-4 h-4 text-stone-400 shrink-0" />
                    <p className="text-[13.5px] font-semibold text-brand-dark">{entry.name} {entry.surname}</p>
                    <p className="text-[12px] text-stone-400 ml-auto">
                      Snoozed until {entry.openRoutineAlerts.find(a => a.status === 'snoozed')?.snoozedUntil}
                    </p>
                  </div>
                ))}
              </Section>
            )}

            <Section title="No current flags" tone="ok" count={clear.length}>
              <div className="paper-card rounded overflow-hidden">
                {clear.length === 0 ? (
                  <p className="p-5 text-[13px] text-stone-400">No students in this state.</p>
                ) : (
                  clear.map((entry, i) => (
                    <div key={entry.studentId}
                      className={`flex items-center gap-3 px-5 py-3 ${i > 0 ? 'border-t border-brand-border' : ''}`}>
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <p className="text-[13.5px] font-semibold text-brand-dark">{entry.name} {entry.surname}</p>
                      <p className="text-[12px] text-stone-400 ml-auto">
                        {entry.latestCheckin ? `Last check-in: ${new Date(entry.latestCheckin.createdAt).toLocaleDateString('en-ZA')}` : 'No check-ins yet'}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </Section>
          </>
        )}
      </div>
    </div>
  );
}

function Section({ title, tone, count, children }: { title: string; tone: 'danger' | 'warning' | 'neutral' | 'ok'; count: number; children: React.ReactNode }) {
  const toneStyle = {
    danger:  'text-red-700',
    warning: 'text-amber-700',
    neutral: 'text-stone-500',
    ok:      'text-emerald-700',
  }[tone];
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease }}>
      <div className="flex items-center gap-2 mb-3">
        <h2 className={`text-[13px] font-black uppercase tracking-wide ${toneStyle}`}>{title}</h2>
        <span className="text-[11px] font-bold text-stone-400">({count})</span>
      </div>
      <div className="space-y-3">{children}</div>
    </motion.div>
  );
}

function SafetyFlagCard({
  entry, teacherId, onChanged, expanded, onToggle, onOpenGuidance,
}: {
  entry: WellbeingRosterEntry; teacherId: number; onChanged: () => void; expanded: boolean; onToggle: () => void;
  onOpenGuidance: (topicId: TeacherGuidanceTopicId) => void;
}) {
  const flag = entry.openSafetyFlag!;
  const summary = deriveConcernSummary(entry.recentHistory, entry.openRoutineAlerts.find(a => a.status === 'open') ?? null, true);
  const [ackBusy, setAckBusy] = useState(false);
  const [contactNotes, setContactNotes] = useState('');
  const [contactBusy, setContactBusy] = useState(false);

  async function handleAck() {
    setAckBusy(true);
    await acknowledgeSafetyFlag(flag.id, teacherId);
    setAckBusy(false);
    onChanged();
  }

  async function handleLogContact() {
    if (!contactNotes.trim()) return;
    setContactBusy(true);
    await logSafetyFlagFirstContact(flag.id, teacherId, contactNotes.trim());
    setContactBusy(false);
    onChanged();
  }

  return (
    <div className="rounded-xl border-2 border-red-300 bg-red-50/60 overflow-hidden">
      <div className="p-4 sm:p-5 flex items-start gap-3">
        <div className="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center shrink-0">
          <AlertOctagon className="w-4.5 h-4.5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[15px] font-bold text-red-900">{entry.name} {entry.surname}</p>
          <p className="text-[12.5px] text-red-700 mt-0.5">
            Safety item flagged {new Date(flag.createdAt).toLocaleString('en-ZA')} — requires same-day acknowledgment.
          </p>
        </div>
        <button onClick={onToggle} className="shrink-0 p-1.5 rounded-lg text-red-600 hover:bg-red-100">
          <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </button>
      </div>

      <div className="px-4 sm:px-5 pb-3 space-y-1">
        {summary.primaryConcernArea && (
          <p className="text-[12.5px] text-red-800">{CONCERN_AREA_LABEL[summary.primaryConcernArea]}</p>
        )}
        <p className="text-[12.5px] text-red-800">{summary.trendLabel}</p>
      </div>

      {!flag.acknowledgedAt && (
        <div className="px-4 sm:px-5 pb-4">
          <button
            onClick={handleAck}
            disabled={ackBusy}
            className="px-4 py-2 rounded-lg bg-red-600 text-white text-[13px] font-bold hover:bg-red-700 disabled:opacity-50"
          >
            {ackBusy ? 'Acknowledging…' : 'Acknowledge receipt'}
          </button>
        </div>
      )}

      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden">
            <div className="px-4 sm:px-5 pb-5 space-y-4 border-t border-red-200 pt-4">
              <ScriptBlock />

              {summary.guidanceTopicId && (
                <button
                  onClick={() => onOpenGuidance(summary.guidanceTopicId!)}
                  className="flex items-center gap-1.5 text-[12.5px] font-bold text-red-700 hover:text-red-900"
                >
                  See tips for talking about this <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}

              <div>
                <p className="text-[12px] font-bold uppercase tracking-wide text-red-700 mb-2">If risk appears imminent</p>
                <p className="text-[13px] text-red-800 mb-2">Contact parent/guardian immediately and an external crisis line or emergency services. Do not leave the student alone until a responsible adult has taken over.</p>
                <div className="grid sm:grid-cols-2 gap-2">
                  {CRISIS_RESOURCES.map(r => (
                    <a key={r.name} href={`tel:${r.phone}`} className="flex items-center gap-2 p-2.5 rounded-lg bg-white border border-red-200 text-[12.5px] font-semibold text-red-900">
                      <Phone className="w-3.5 h-3.5 shrink-0" /> {r.name} — {r.phoneDisplay}
                    </a>
                  ))}
                </div>
              </div>

              {!flag.firstContactAt ? (
                <div>
                  <p className="text-[12px] font-bold uppercase tracking-wide text-red-700 mb-2">Log first contact with the student</p>
                  <textarea
                    value={contactNotes}
                    onChange={e => setContactNotes(e.target.value)}
                    placeholder="Brief note on the conversation and next steps…"
                    className="w-full rounded-lg border border-red-200 p-2.5 text-[13px] resize-none"
                    rows={2}
                  />
                  <button
                    onClick={handleLogContact}
                    disabled={contactBusy || !contactNotes.trim()}
                    className="mt-2 px-3 py-1.5 rounded-lg bg-white border border-red-300 text-red-700 text-[12.5px] font-bold disabled:opacity-40"
                  >
                    {contactBusy ? 'Saving…' : 'Log first contact'}
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-[12.5px] text-emerald-700 font-semibold">
                  <CheckCircle2 className="w-4 h-4" /> First contact logged {new Date(flag.firstContactAt).toLocaleString('en-ZA')}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ScriptBlock() {
  return (
    <div className="rounded-lg bg-white border border-red-200 p-3.5 space-y-2.5">
      <p className="text-[11px] font-black uppercase tracking-wide text-red-700 flex items-center gap-1.5"><Info className="w-3.5 h-3.5" /> Conversation script</p>
      <ScriptLine label="Open" text={OPEN_SCRIPT} />
      <ScriptLine label="Ask directly about safety" text={SAFETY_ASK_SCRIPT} />
      <ScriptLine label="Validate and normalise" text={VALIDATE_SCRIPT} />
      <ScriptLine label="Explain limits of confidentiality" text={LIMITS_SCRIPT} />
      <ScriptLine label="Plan next step" text={NEXT_STEP_SCRIPT} />
    </div>
  );
}

function ScriptLine({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <p className="text-[11px] font-bold text-red-600">{label}</p>
      <p className="text-[12.5px] text-stone-700 italic leading-snug">{text}</p>
    </div>
  );
}

function RoutineAlertCard({
  entry, teacherId, onChanged, expanded, onToggle, onOpenGuidance,
}: {
  entry: WellbeingRosterEntry; teacherId: number; onChanged: () => void; expanded: boolean; onToggle: () => void;
  onOpenGuidance: (topicId: TeacherGuidanceTopicId) => void;
}) {
  const alert = entry.openRoutineAlerts.find(a => a.status === 'open')!;
  const Icon = ALERT_ICON[alert.alertType];
  const summary = deriveConcernSummary(entry.recentHistory, alert, false);
  const [busy, setBusy] = useState(false);

  async function handleSnooze(days: number) {
    setBusy(true);
    await snoozeRoutineAlert(alert.id, teacherId, days);
    setBusy(false);
    onChanged();
  }

  async function handleAddressed() {
    setBusy(true);
    await markRoutineAlertAddressed(alert.id, teacherId);
    setBusy(false);
    onChanged();
  }

  return (
    <div className="rounded-xl border border-amber-300 bg-amber-50/60 overflow-hidden">
      <div className="p-4 sm:p-5 flex items-start gap-3">
        <div className="w-9 h-9 rounded-full bg-amber-500 flex items-center justify-center shrink-0">
          <Icon className="w-4.5 h-4.5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[15px] font-bold text-brand-dark">{entry.name} {entry.surname}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-[10.5px] font-black uppercase tracking-wide px-2 py-0.5 rounded-full ${CONCERN_STYLE[summary.concernLevel]}`}>
              {CONCERN_LABEL[summary.concernLevel]}
            </span>
          </div>
          <p className="text-[12.5px] text-stone-600 mt-1.5">{CONCERN_TEXT[summary.concernLevel]}</p>
          {summary.primaryConcernArea && (
            <p className="text-[12.5px] text-stone-600 mt-1">{CONCERN_AREA_LABEL[summary.primaryConcernArea]}</p>
          )}
          <p className="text-[12px] text-stone-400 mt-1">{summary.trendLabel}</p>
        </div>
        <button onClick={onToggle} className="shrink-0 p-1.5 rounded-lg text-amber-600 hover:bg-amber-100">
          <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </button>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="px-4 sm:px-5 pb-5 space-y-4 border-t border-amber-200 pt-4">
              <div>
                <p className="text-[12px] font-bold uppercase tracking-wide text-amber-700 mb-1">Suggested next action</p>
                <p className="text-[13px] text-stone-700 leading-relaxed">{NEXT_ACTION[summary.concernLevel]}</p>
              </div>

              {summary.guidanceTopicId && (
                <button
                  onClick={() => onOpenGuidance(summary.guidanceTopicId!)}
                  className="flex items-center gap-1.5 text-[12.5px] font-bold text-amber-700 hover:text-amber-900"
                >
                  See tips for talking about this <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}

              <ScriptBlock />

              <details className="text-[11.5px] text-stone-400">
                <summary className="cursor-pointer select-none">Detection detail ({ALERT_LABEL[alert.alertType]})</summary>
                <ul className="mt-1.5 space-y-0.5 pl-3">
                  {alert.reasons.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </details>

              <div className="flex flex-wrap gap-2">
                <button onClick={handleAddressed} disabled={busy}
                  className="px-3 py-1.5 rounded-lg bg-brand-dark text-white text-[12.5px] font-bold disabled:opacity-40">
                  Mark addressed
                </button>
                <button onClick={() => handleSnooze(7)} disabled={busy}
                  className="px-3 py-1.5 rounded-lg bg-white border border-amber-300 text-amber-700 text-[12.5px] font-bold disabled:opacity-40">
                  Snooze 7 days
                </button>
                <button onClick={() => handleSnooze(14)} disabled={busy}
                  className="px-3 py-1.5 rounded-lg bg-white border border-amber-300 text-amber-700 text-[12.5px] font-bold disabled:opacity-40">
                  Snooze 14 days
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
