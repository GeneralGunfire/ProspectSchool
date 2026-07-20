import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HeartHandshake, Phone, ShieldCheck, CheckCircle2, Clock, ShieldOff, ChevronDown, Sparkles, ArrowRight } from 'lucide-react';
import { Shimmer } from '../../../shared/components/Shimmer';
import type { StudentSession } from '../../../lib/auth';
import {
  submitCheckin, fetchOwnCheckinHistory, hasCompletedAnyCheckin, hasActiveConsent, scoreCheckin,
  PHQ2_FLAG_MIN, GAD2_FLAG_MIN,
  type CheckinAnswers, type WellbeingCheckin,
} from '../../../lib/wellbeing';
import { CRISIS_RESOURCES } from '../../../lib/wellbeingCrisisResources';
import { NORMALISING_MESSAGE, START_HERE_TOOLS, HELP_TOPICS, type HelpTopicId, type MicroTool } from '../../../lib/wellbeingHelpContent';

const ease = [0.23, 1, 0.32, 1] as [number, number, number, number];

interface StudentWellbeingPageProps { session: StudentSession; onNavigate: (page: string) => void; }

const SCALE_LABELS = ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'];

const QUESTIONS: { key: keyof CheckinAnswers; text: string }[] = [
  { key: 'phqDownInterest', text: 'In the past 7 days, how often have you had little interest or pleasure in doing things?' },
  { key: 'phqHopeless',     text: 'In the past 7 days, how often have you felt down, depressed, or hopeless?' },
  { key: 'gadNervous',      text: 'In the past 7 days, how often have you felt nervous, anxious, or on edge?' },
  { key: 'gadWorry',        text: 'In the past 7 days, how often have you not been able to stop or control worrying?' },
];

const SAFETY_QUESTION = 'In the past month, have you had thoughts that you would be better off dead, or of hurting yourself in some way?';

function CrisisResourceList() {
  return (
    <div className="space-y-2">
      {CRISIS_RESOURCES.map((r) => (
        <a
          key={r.name}
          href={`tel:${r.phone}`}
          className="flex items-center gap-3 p-3 rounded-xl bg-white border border-brand-border hover:border-accent transition-colors"
        >
          <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
            <Phone className="w-4 h-4 text-accent" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13.5px] font-bold text-brand-dark">{r.name}</p>
            <p className="text-[11.5px] text-stone-500">{r.description}</p>
          </div>
          <p className="text-[14px] font-black text-brand-dark shrink-0">{r.phoneDisplay}</p>
        </a>
      ))}
    </div>
  );
}

export default function StudentWellbeingPage({ session, onNavigate }: StudentWellbeingPageProps) {
  const [loading, setLoading] = useState(true);
  const [needsInfoScreen, setNeedsInfoScreen] = useState(false);
  const [infoAcked, setInfoAcked] = useState(false);
  const [history, setHistory] = useState<WellbeingCheckin[]>([]);
  const [step, setStep] = useState<'form' | 'safety-response' | 'done'>('form');
  const [submittedAnswers, setSubmittedAnswers] = useState<CheckinAnswers | null>(null);
  const [answers, setAnswers] = useState<Partial<CheckinAnswers>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [alreadyToday, setAlreadyToday] = useState(false);
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [completed, h, consent] = await Promise.all([
        hasCompletedAnyCheckin(session.student_id),
        fetchOwnCheckinHistory(session.student_id),
        hasActiveConsent(session.student_id),
      ]);
      setNeedsInfoScreen(!completed);
      setHistory(h);
      setConsented(consent);
      const today = new Date().toISOString().split('T')[0];
      setAlreadyToday(h.some(c => c.createdAt.startsWith(today)));
      setLoading(false);
    })();
  }, [session.student_id]);

  const allAnswered = QUESTIONS.every(q => answers[q.key] !== undefined) && answers.safetyResponse !== undefined;

  async function handleSubmit() {
    if (!allAnswered) return;
    setSubmitting(true);
    setError(null);
    const result = await submitCheckin(session.student_id, session.school_id, answers as CheckinAnswers);
    setSubmitting(false);
    if (!result.success) { setError(result.error); return; }
    setSubmittedAnswers(answers as CheckinAnswers);
    if (result.safetyTriggered) {
      setStep('safety-response');
    } else {
      setStep('done');
    }
    const h = await fetchOwnCheckinHistory(session.student_id);
    setHistory(h);
  }

  return (
    <div className="student-wellbeing student-home min-h-full pb-16 relative">
      <div className="relative overflow-hidden">
        <div className="relative max-w-3xl mx-auto px-5 sm:px-8 pt-8 sm:pt-11 pb-6 sm:pb-8 w-full">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }}
            className="flex items-center gap-2 min-w-0">
            <p className="text-[12px] text-[rgba(31,36,33,0.5)] font-medium truncate">Wellbeing</p>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease, delay: 0.06 }}
            className="text-brand-dark text-[32px] sm:text-[42px] leading-[1.12] mt-2 min-w-0"
            style={{ fontFamily: 'var(--font-instrument)', fontWeight: 500, letterSpacing: '-0.02em' }}>
            How are you doing?
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease, delay: 0.08 }}
            className="text-[13px] text-[rgba(31,36,33,0.55)] mt-2.5 font-medium max-w-lg">
            A quick, private check-in. Your homeroom teacher may see this to help notice if things seem tough — it's not a test and there's no wrong answer.
          </motion.p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-8 relative z-10 space-y-5 pt-2 sm:pt-3">
        {loading ? (
          <div className="paper-card rounded p-6 space-y-3">
            <Shimmer className="h-4 w-1/2" />
            <Shimmer className="h-4 w-2/3" />
            <Shimmer className="h-4 w-1/3" />
          </div>
        ) : !consented ? (
          <ConsentRequiredCard />
        ) : needsInfoScreen && !infoAcked ? (
          <InfoConsentScreen onContinue={() => setInfoAcked(true)} />
        ) : step === 'done' ? (
          <PostCheckinScreen answers={submittedAnswers} onNavigate={onNavigate} />
        ) : step === 'safety-response' ? (
          <SafetyResponseCard />
        ) : alreadyToday ? (
          <AlreadyCheckedInCard history={history} />
        ) : (
          <CheckinForm
            answers={answers}
            setAnswers={setAnswers}
            onSubmit={handleSubmit}
            submitting={submitting}
            error={error}
            allAnswered={allAnswered}
          />
        )}
      </div>
    </div>
  );
}

function ConsentRequiredCard() {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease }}
      className="paper-card rounded p-8 flex flex-col items-center text-center">
      <ShieldOff className="w-9 h-9 text-stone-300 mb-3" />
      <h2 className="text-[17px] font-semibold text-brand-dark mb-1">Not available yet</h2>
      <p className="text-[13.5px] text-stone-500 max-w-sm">
        A parent or guardian needs to grant consent before you can use the wellbeing check-in. Ask them to check
        the Wellbeing section of their Prospect parent account.
      </p>
    </motion.div>
  );
}

function InfoConsentScreen({ onContinue }: { onContinue: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease }}
      className="paper-card rounded p-6 sm:p-8 space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0" style={{ background: 'var(--color-accent)' }}>
          <HeartHandshake className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-[18px] font-semibold text-brand-dark">Before your first check-in</h2>
      </div>

      <p className="text-[14px] text-stone-600 leading-relaxed">
        This check-in is a simple way for you to share how you've been feeling lately. It helps your homeroom
        teacher notice if things seem tough over time. It is <strong>not</strong> a medical test or a way to
        diagnose problems, and it is <strong>not</strong> an emergency service.
      </p>
      <p className="text-[14px] text-stone-600 leading-relaxed">
        If you ever feel in immediate danger, please call 10111, 10177, or a crisis line like Childline
        (116) or the SADAG Suicide Crisis Line (0800 567 567) right away.
      </p>

      <div className="rounded-xl bg-stone-50 border border-brand-border p-4 space-y-2">
        <p className="text-[12px] font-bold uppercase tracking-wide text-stone-500">What you should know</p>
        <ul className="text-[13.5px] text-stone-600 space-y-1.5 list-disc list-inside">
          <li>Only your homeroom teacher can see your individual answers — no one else at school, and never other students.</li>
          <li>Your answers are not confidential if you indicate you might not be safe — a caring adult at school will reach out the same day.</li>
          <li>This isn't graded, doesn't affect your marks, and there's no "wrong" answer.</li>
          <li>Every learner checks in — this isn't only for students who are struggling.</li>
        </ul>
      </div>

      <button
        onClick={onContinue}
        className="w-full py-3 rounded-xl bg-brand-dark text-white text-[14px] font-bold hover:opacity-90 transition-opacity"
      >
        I understand — continue
      </button>
    </motion.div>
  );
}

function CheckinForm({
  answers, setAnswers, onSubmit, submitting, error, allAnswered,
}: {
  answers: Partial<CheckinAnswers>;
  setAnswers: (a: Partial<CheckinAnswers>) => void;
  onSubmit: () => void;
  submitting: boolean;
  error: string | null;
  allAnswered: boolean;
}) {
  function setValue(key: keyof CheckinAnswers, value: number) {
    setAnswers({ ...answers, [key]: value as 0 | 1 | 2 | 3 });
  }

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease }}
      className="paper-card rounded overflow-hidden">
      <div className="px-5 sm:px-6 py-4" style={{ borderBottom: '1px solid var(--color-brand-border)' }}>
        <h2 className="text-[16px] font-semibold text-brand-dark">This week</h2>
        <p className="text-[13px] text-stone-500 mt-0.5">Answer honestly — this takes about 30 seconds.</p>
      </div>

      <div className="p-5 sm:p-6 space-y-6">
        {QUESTIONS.map((q) => (
          <QuestionBlock
            key={q.key}
            text={q.text}
            value={answers[q.key]}
            onChange={(v) => setValue(q.key, v)}
          />
        ))}

        <div className="pt-2 border-t border-brand-border">
          <QuestionBlock
            text={SAFETY_QUESTION}
            value={answers.safetyResponse}
            onChange={(v) => setValue('safetyResponse', v)}
            sensitive
          />
        </div>

        {error && <p className="text-[13px] text-red-600 font-medium">{error}</p>}

        <button
          onClick={onSubmit}
          disabled={!allAnswered || submitting}
          className="w-full py-3 rounded-xl bg-brand-dark text-white text-[14px] font-bold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {submitting ? 'Submitting…' : 'Submit check-in'}
        </button>
      </div>
    </motion.div>
  );
}

function QuestionBlock({
  text, value, onChange, sensitive,
}: { text: string; value: number | undefined; onChange: (v: number) => void; sensitive?: boolean }) {
  return (
    <div>
      <p className={`text-[14px] font-semibold mb-3 leading-snug ${sensitive ? 'text-brand-dark' : 'text-brand-dark'}`}>{text}</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {SCALE_LABELS.map((label, i) => (
          <button
            key={label}
            onClick={() => onChange(i)}
            className={`px-3 py-2.5 rounded-lg text-[12px] font-bold border transition-all ${
              value === i
                ? 'bg-brand-dark text-white border-brand-dark'
                : 'bg-white text-stone-500 border-brand-border hover:border-stone-400'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

function SafetyResponseCard() {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease }}
      className="paper-card rounded p-6 sm:p-8 space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 bg-amber-500">
          <HeartHandshake className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-[18px] font-semibold text-brand-dark">Thanks for sharing this.</h2>
      </div>

      <p className="text-[14.5px] text-stone-700 leading-relaxed">
        It sounds like things are really hard right now. You're not alone, and help is available.
      </p>

      <p className="text-[14px] text-stone-600 leading-relaxed">
        Because you indicated you might not be safe, a caring adult at school will reach out to you — usually
        the same day. We can't promise this is confidential: your safety matters more than that right now.
      </p>

      <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
        <p className="text-[13px] text-amber-900 font-semibold mb-1">Please also consider talking to a trusted adult now</p>
        <p className="text-[12.5px] text-amber-800">A parent, family member, or any teacher you trust — you don't have to wait.</p>
      </div>

      <div>
        <p className="text-[12px] font-bold uppercase tracking-wide text-stone-500 mb-2">If you need help right now</p>
        <CrisisResourceList />
      </div>
    </motion.div>
  );
}

// Post-check-in screen, shown for every non-crisis submission regardless of
// score (research: WELLBEING_HELP_EXPANSION_RESEARCH.md section 1). Draws
// from the same content library as StudentWellbeingHelpPage.tsx — same
// tools, two entry points — plus a gentle, specific nudge toward relevant
// topics for elevated-but-non-crisis scores. Nothing here is locked; the
// full library is always one tap away via onNavigate.
function PostCheckinScreen({ answers, onNavigate }: { answers: CheckinAnswers | null; onNavigate: (page: string) => void }) {
  const nudgeTopicIds: HelpTopicId[] = [];
  if (answers) {
    const { phq2, gad2 } = scoreCheckin(answers);
    if (phq2 >= PHQ2_FLAG_MIN) nudgeTopicIds.push('low_mood');
    if (gad2 >= GAD2_FLAG_MIN) nudgeTopicIds.push('worry_anxiety');
  }
  const nudgeTopics = HELP_TOPICS.filter(t => nudgeTopicIds.includes(t.id));

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease }}
      className="space-y-5">
      <div className="paper-card rounded p-8 flex flex-col items-center text-center">
        <CheckCircle2 className="w-10 h-10 text-green-600 mb-3" />
        <h2 className="text-[17px] font-semibold text-brand-dark mb-1">Check-in complete</h2>
        <p className="text-[13.5px] text-stone-500 max-w-sm">{NORMALISING_MESSAGE}</p>
      </div>

      {nudgeTopics.length > 0 && (
        <div className="rounded-xl bg-accent/5 border border-accent/20 p-5 space-y-2">
          <p className="text-[13px] font-semibold text-brand-dark">
            Your answers suggest things have been a bit tough lately, especially around{' '}
            {nudgeTopics.map(t => t.label.split(' /')[0].toLowerCase()).join(' and ')}. You might find these tools
            especially helpful.
          </p>
          <div className="space-y-2 pt-1">
            {nudgeTopics.flatMap(t => t.microTools.slice(0, 2)).map(tool => (
              <MicroToolRow key={tool.id} tool={tool} />
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="text-[13px] font-black uppercase tracking-wide text-stone-500 mb-3">Start here</p>
        <div className="space-y-2">
          {START_HERE_TOOLS.slice(0, 3).map(tool => <MicroToolRow key={tool.id} tool={tool} />)}
        </div>
      </div>

      <button
        onClick={() => onNavigate('wellbeing-help')}
        className="w-full py-3 rounded-xl bg-brand-dark text-white text-[14px] font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
      >
        See all wellbeing tools <ArrowRight className="w-4 h-4" />
      </button>

      <TalkToSomeoneBoxInline />
    </motion.div>
  );
}

function MicroToolRow({ tool }: { tool: MicroTool }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="paper-card rounded overflow-hidden">
      <button onClick={() => setExpanded(e => !e)} className="w-full flex items-center gap-3 p-3.5 text-left">
        <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-accent" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-bold text-brand-dark">{tool.title}</p>
          <p className="text-[11px] text-stone-500">{tool.durationMinutes} min</p>
        </div>
        <ChevronDown className={`w-4 h-4 text-stone-400 shrink-0 transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden">
            <ol className="px-3.5 pb-3.5 pl-[3rem] space-y-1 list-decimal">
              {tool.steps.map((s, i) => <li key={i} className="text-[12.5px] text-stone-600 leading-snug">{s}</li>)}
            </ol>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TalkToSomeoneBoxInline() {
  return (
    <div className="rounded-xl bg-stone-50 border border-brand-border p-4 space-y-2.5">
      <p className="text-[13px] font-semibold text-brand-dark">Talk to someone</p>
      <p className="text-[12.5px] text-stone-600 leading-relaxed">
        These tools can help, but they're not a replacement for talking to someone if things feel heavy — your
        homeroom teacher, a parent/guardian, or a trusted adult are all good places to start.
      </p>
      <div className="grid sm:grid-cols-2 gap-1.5">
        {CRISIS_RESOURCES.slice(0, 4).map(r => (
          <a key={r.name} href={`tel:${r.phone}`} className="flex items-center gap-2 p-2 rounded-lg bg-white border border-brand-border text-[12px] font-semibold text-brand-dark">
            <Phone className="w-3.5 h-3.5 shrink-0 text-stone-400" /> {r.name} — {r.phoneDisplay}
          </a>
        ))}
      </div>
    </div>
  );
}

function AlreadyCheckedInCard({ history }: { history: WellbeingCheckin[] }) {
  const latest = history[history.length - 1];
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease }}
      className="paper-card rounded p-8 flex flex-col items-center text-center">
      <Clock className="w-9 h-9 text-stone-300 mb-3" />
      <h2 className="text-[17px] font-semibold text-brand-dark mb-1">You've already checked in today</h2>
      <p className="text-[13.5px] text-stone-500">Come back tomorrow — or anytime you want to check in again.</p>
      {latest && (
        <div className="mt-4 flex items-center gap-2 text-[12px] text-stone-400">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Only your homeroom teacher can see your answers</span>
        </div>
      )}
    </motion.div>
  );
}
