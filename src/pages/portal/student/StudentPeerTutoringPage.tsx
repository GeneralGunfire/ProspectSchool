import { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { Users, GraduationCap, HandHeart, ListChecks, Award, ShieldAlert, CheckCircle2, Clock, ChevronRight, X, Search } from 'lucide-react';
import { Shimmer } from '../../../shared/components/Shimmer';
import Dropdown from '../../../shared/components/Dropdown';
import Checkbox from '../../../shared/components/Checkbox';
import type { StudentSession } from '../../../lib/auth';
import { supabaseAdmin } from '../../../lib/supabase';
import {
  fetchTutorProfile, ensureTutorProfile, completeTutorOrientation, acknowledgeTutorConduct,
  offerTutorTopic, fetchTutorTopics, createTutoringRequest, findTutorMatches, createRelationshipFromMatch,
  fetchRelationshipsForStudent, fetchSessionsForRelationship, scheduleSession, startSession,
  completeSessionStep, endSession, confirmSession, fetchBadgesForStudent, reportConcern,
  fetchOpenRequestsForTutor, fulfillRequest, fetchRelationshipById, endRelationshipEarly,
  SESSION_TEMPLATE_STEPS, BADGE_THRESHOLDS, countVerifiedSessionsForTutor,
  type TutorProfile, type TutorTopic, type MatchResult, type TutoringRelationship, type TutoringSession,
  type TutorBadge, type ConcernCategory, type TutoringRequest,
} from '../../../lib/peerTutoring';

const ease = [0.23, 1, 0.32, 1] as [number, number, number, number];

// Primary CTA recipe shared across this page's many single-action screens —
// replaces the old ad hoc `rounded-xl bg-brand-dark ... hover:opacity-90`
// buttons with the accent-color + motion feedback treatment used elsewhere
// in the student portal (StudentWellbeingPage, StudentHomePage).
function PrimaryButton({ onClick, disabled, className = '', children }: {
  onClick?: () => void; disabled?: boolean; className?: string; children: ReactNode;
}) {
  return (
    <motion.button
      whileHover={disabled ? undefined : { y: -1 }} whileTap={disabled ? undefined : { scale: 0.97 }}
      onClick={onClick} disabled={disabled}
      className={`flex items-center justify-center gap-1 font-semibold transition-colors disabled:opacity-40 ${className}`}
      style={{ color: 'var(--color-navy)' }}
    >
      {children}
      <ChevronRight className="w-3.5 h-3.5" />
    </motion.button>
  );
}

interface Props { session: StudentSession }

type Tab = 'overview' | 'find' | 'tutor' | 'mine' | 'requests';

interface SubjectOption { id: number; label: string }
interface TopicOption { id: number; label: string; subject_id: number; grade: number }

export default function StudentPeerTutoringPage({ session }: Props) {
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('overview');
  const [tutorProfile, setTutorProfile] = useState<TutorProfile | null>(null);
  const [tutorTopics, setTutorTopics] = useState<TutorTopic[]>([]);
  const [relationships, setRelationships] = useState<TutoringRelationship[]>([]);
  const [badges, setBadges] = useState<TutorBadge[]>([]);
  const [subjects, setSubjects] = useState<SubjectOption[]>([]);
  const [topics, setTopics] = useState<TopicOption[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<{ relationshipId: number; sessionId: number } | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    const [profile, rels, b] = await Promise.all([
      fetchTutorProfile(session.student_id),
      fetchRelationshipsForStudent(session.student_id),
      fetchBadgesForStudent(session.student_id),
    ]);
    setTutorProfile(profile);
    setRelationships(rels);
    setBadges(b);
    if (profile) setTutorTopics(await fetchTutorTopics(profile.id));
    const [{ data: subjRows }, { data: topicRows }] = await Promise.all([
      supabaseAdmin.from('subjects').select('id, label').order('label'),
      supabaseAdmin.from('topics').select('id, label, subject_id, grade').eq('grade', session.grade).order('label'),
    ]);
    setSubjects(subjRows ?? []);
    setTopics((topicRows ?? []) as TopicOption[]);
    setLoading(false);
  }, [session.student_id, session.grade]);

  useEffect(() => { reload(); }, [reload]);

  if (activeSessionId) {
    return (
      <SessionFlow
        session={session}
        relationshipId={activeSessionId.relationshipId}
        sessionId={activeSessionId.sessionId}
        onExit={() => { setActiveSessionId(null); reload(); }}
      />
    );
  }

  return (
    <div className="student-peer-tutoring student-home min-h-full pb-16 relative">

      {/* ═══ Header — same compact scale as Home/Announcements ═══ */}
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-5">
        <h1 className="text-brand-dark text-[30px] sm:text-[36px] leading-tight" style={{ fontWeight: 600 }}>
          <span className="relative inline-block">
            <span className="text-transparent bg-clip-text bg-linear-to-r from-sky-500 via-sky-600 to-blue-600">
              Peer Tutoring
            </span>
            <svg aria-hidden="true" viewBox="0 0 320 14" className="absolute left-0 -bottom-1 w-full h-3 text-amber-500/70" preserveAspectRatio="none">
              <path d="M2 9C60 3 180 2 318 8" stroke="currentColor" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            </svg>
          </span>
        </h1>
        <p className="text-[14px] text-muted mt-1">Get help from a classmate who's mastered a topic, or teach one yourself.</p>
      </div>

      {/* ═══ Body ═════════════════════════════════════════════════ */}
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4">
        <div className="flex gap-1.5 flex-wrap">
          {([
            { id: 'overview', label: 'Overview' },
            { id: 'find', label: 'Find a tutor' },
            { id: 'tutor', label: 'Become a tutor' },
            ...(tutorProfile?.orientationCompletedAt && tutorProfile?.conductAcknowledgedAt
              ? [{ id: 'requests' as Tab, label: 'Students who need help' }] : []),
            { id: 'mine', label: 'My relationships' },
          ] as { id: Tab; label: string }[]).map(({ id, label }) => (
            <button key={id} onClick={() => setTab(id)}
              className="px-3.5 py-2 rounded-lg text-[12.5px] font-bold border transition-all"
              style={tab === id
                ? { background: 'linear-gradient(90deg, #0ea5e9, #2563eb)', color: '#fff', borderColor: 'transparent' }
                : { background: '#fff', color: 'var(--color-muted)', borderColor: 'var(--color-brand-border)' }}>
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="paper-card rounded p-6 space-y-3">
            <Shimmer className="h-4 w-1/2" /><Shimmer className="h-4 w-2/3" /><Shimmer className="h-4 w-1/3" />
          </div>
        ) : tab === 'overview' ? (
          <OverviewTab session={session} tutorProfile={tutorProfile} badges={badges} relationships={relationships} onGoTo={setTab} />
        ) : tab === 'find' ? (
          <FindTutorTab session={session} subjects={subjects} topics={topics} onMatched={reload} />
        ) : tab === 'tutor' ? (
          <BecomeTutorTab session={session} tutorProfile={tutorProfile} tutorTopics={tutorTopics}
            subjects={subjects} topics={topics} onChanged={reload} />
        ) : tab === 'requests' ? (
          <RequestsToFulfillTab session={session} topics={topics} onFulfilled={reload} />
        ) : (
          <MyRelationshipsTab session={session} relationships={relationships} onStartSession={setActiveSessionId} onChanged={reload} />
        )}
      </div>
    </div>
  );
}

// ── Overview ─────────────────────────────────────────────────────────────

function OverviewTab({ tutorProfile, badges, relationships, onGoTo }: {
  session: StudentSession; tutorProfile: TutorProfile | null; badges: TutorBadge[];
  relationships: TutoringRelationship[]; onGoTo: (t: Tab) => void;
}) {
  const activeCount = relationships.filter((r) => r.status === 'active').length;

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease }} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <button onClick={() => onGoTo('find')} className="paper-card rounded p-5 text-left hover:border-accent transition-colors">
          <span className="relative inline-block mb-2">
            <span className="text-[12px] text-muted-2">Need help</span>
            <svg aria-hidden="true" viewBox="0 0 100 8" className="absolute left-0 -bottom-1 w-full h-2 text-sky-400/60" preserveAspectRatio="none">
              <path d="M1 5C22 2 60 1 99 4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
            </svg>
          </span>
          <p className="text-[14px] font-bold text-brand-dark">Need help with a topic?</p>
          <p className="text-[12px] text-stone-500 mt-1">Find a tutor who's already mastered it</p>
        </button>
        <button onClick={() => onGoTo('tutor')} className="paper-card rounded p-5 text-left hover:border-accent transition-colors">
          <span className="relative inline-block mb-2">
            <span className="text-[12px] text-muted-2">Know a topic</span>
            <svg aria-hidden="true" viewBox="0 0 100 8" className="absolute left-0 -bottom-1 w-full h-2 text-sky-400/60" preserveAspectRatio="none">
              <path d="M1 5C22 2 60 1 99 4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
            </svg>
          </span>
          <p className="text-[14px] font-bold text-brand-dark">Know a topic well?</p>
          <p className="text-[12px] text-stone-500 mt-1">Become a tutor and help a classmate</p>
        </button>
      </div>

      {activeCount > 0 && (
        <div className="paper-card rounded p-5">
          <p className="text-[13px] font-bold text-brand-dark mb-1">Your tutoring relationships</p>
          <p className="text-[12.5px] text-stone-500">{activeCount} active</p>
          <button onClick={() => onGoTo('mine')} className="mt-3 text-[12.5px] font-semibold flex items-center gap-1" style={{ color: 'var(--color-accent-soft)' }}>
            View all <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {tutorProfile && badges.length > 0 && (
        <div className="paper-card rounded p-5">
          <span className="relative inline-block mb-2.5">
            <span className="text-[12px] text-muted-2">Your badges</span>
            <svg aria-hidden="true" viewBox="0 0 100 8" className="absolute left-0 -bottom-1 w-full h-2 text-sky-400/60" preserveAspectRatio="none">
              <path d="M1 5C22 2 60 1 99 4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
            </svg>
          </span>
          <div className="flex gap-2">
            {badges.map((b) => (
              <div key={b.tier} className={`px-3 py-1.5 rounded-lg text-[11.5px] font-black uppercase tracking-wide ${
                b.tier === 'gold' ? 'bg-amber-100 text-amber-800' : b.tier === 'silver' ? 'bg-stone-200 text-stone-700' : 'bg-orange-100 text-orange-800'
              }`}>{b.tier}</div>
            ))}
          </div>
        </div>
      )}

      <div className="paper-card rounded p-5 bg-stone-50">
        <p className="text-[12px] font-bold uppercase tracking-wide text-stone-500 mb-2">How it works</p>
        <ul className="text-[13px] text-stone-600 space-y-1.5 list-disc list-inside">
          <li>Every session follows a structured 25-minute script — no just "doing your homework for you."</li>
          <li>Tutors complete a short orientation before their first match.</li>
          <li>Sessions only count toward recognition once you confirm they helped, within 24 hours.</li>
          <li>All communication stays on Prospect — never share personal contact details.</li>
        </ul>
      </div>
    </motion.div>
  );
}

// ── Find a tutor ─────────────────────────────────────────────────────────

function FindTutorTab({ session, subjects, topics, onMatched }: {
  session: StudentSession; subjects: SubjectOption[]; topics: TopicOption[]; onMatched: () => void;
}) {
  const [subjectId, setSubjectId] = useState<number | null>(null);
  const [topicId, setTopicId] = useState<number | null>(null);
  const [conductAcked, setConductAcked] = useState(false);
  const [preferKnown, setPreferKnown] = useState<boolean | null>(null);
  const [matches, setMatches] = useState<MatchResult[] | null>(null);
  const [searching, setSearching] = useState(false);
  const [matchedMessage, setMatchedMessage] = useState<string | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  const filteredTopics = topics.filter((t) => subjectId == null || t.subject_id === subjectId);

  async function handleSearch() {
    if (!subjectId || !topicId || !conductAcked || searching) return;
    setSearching(true);
    setSearchError(null);
    const request = await createTutoringRequest(session.student_id, session.school_id, subjectId, topicId, conductAcked, preferKnown, session.grade);
    if (!request) {
      setSearching(false);
      setSearchError('Could not submit your request. Please try again.');
      return;
    }
    const results = await findTutorMatches(request);
    setMatches(results);
    if (results.length > 0) {
      const outcome = await createRelationshipFromMatch(request, results[0]);
      if (outcome.success) {
        setMatchedMessage('Match found! You can schedule your first session from "My relationships."');
        onMatched();
      } else {
        // Dedup guard (Bug 1 fix) tripped, or another transient failure —
        // either way this is real, visible feedback, not a silent no-op.
        setSearchError(outcome.error);
      }
    }
    setSearching(false);
  }

  if (matchedMessage) {
    return (
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="paper-card rounded p-8 flex flex-col items-center text-center">
        <CheckCircle2 className="w-10 h-10 text-green-600 mb-3" />
        <h2 className="text-[17px] font-semibold text-brand-dark mb-1">Request sent</h2>
        <p className="text-[13.5px] text-stone-500 max-w-sm">{matchedMessage}</p>
      </motion.div>
    );
  }

  if (matches && matches.length === 0) {
    return (
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="paper-card rounded p-8 flex flex-col items-center text-center">
        <Clock className="w-9 h-9 text-stone-300 mb-3" />
        <h2 className="text-[17px] font-semibold text-brand-dark mb-1">No tutors available right now</h2>
        <p className="text-[13.5px] text-stone-500 max-w-sm">
          No one has offered to tutor this topic yet. We've saved your request — a tutor who signs up for this
          topic can see it and reach out. You'll be matched automatically if one becomes available.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease }} className="paper-card rounded p-5 sm:p-6 space-y-4">
      <p className="text-[14px] font-bold text-brand-dark">What do you need help with?</p>

      <div>
        <label className="text-[12px] font-bold text-stone-500 mb-1.5 block">Subject</label>
        <Dropdown
          value={subjectId ? String(subjectId) : null}
          onChange={(v) => { setSubjectId(Number(v) || null); setTopicId(null); }}
          placeholder="Select a subject…"
          buttonClassName="w-full px-3 py-2.5 rounded-lg border border-brand-border text-[13.5px] bg-white flex items-center justify-between gap-2"
          options={subjects.map((s) => ({ value: String(s.id), label: s.label }))}
        />
      </div>

      <div>
        <label className="text-[12px] font-bold text-stone-500 mb-1.5 block">Topic</label>
        <Dropdown
          value={topicId ? String(topicId) : null}
          onChange={(v) => setTopicId(Number(v) || null)}
          disabled={!subjectId}
          placeholder="Select a topic…"
          buttonClassName="w-full px-3 py-2.5 rounded-lg border border-brand-border text-[13.5px] bg-white flex items-center justify-between gap-2 disabled:opacity-50"
          options={filteredTopics.map((t) => ({ value: String(t.id), label: t.label }))}
        />
      </div>

      <div>
        <label className="text-[12px] font-bold text-stone-500 mb-1.5 block">Any preference?</label>
        <div className="flex gap-2">
          {[{ v: true, l: 'Someone I know' }, { v: false, l: 'No preference' }].map((o) => (
            <button key={String(o.v)} onClick={() => setPreferKnown(o.v)}
              className={`px-3 py-2 rounded-lg text-[12.5px] font-bold border ${preferKnown === o.v ? 'bg-brand-dark text-white border-brand-dark' : 'bg-white text-stone-500 border-brand-border'}`}>
              {o.l}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-2 border-t border-brand-border">
        <Checkbox
          checked={conductAcked}
          onChange={setConductAcked}
          label="I agree to be respectful, stay on topic, and never share personal contact details with my tutor."
        />
      </div>

      {searchError && <p className="text-[13px] text-red-600 font-medium">{searchError}</p>}

      <PrimaryButton onClick={handleSearch} disabled={!subjectId || !topicId || !conductAcked || searching}
        className="w-full py-3 text-[14px]">
        {searching ? 'Searching…' : 'Find a tutor'}
      </PrimaryButton>
    </motion.div>
  );
}

// ── Students who need help (browse + fulfil open requests) ────────────────
// A tutor who has completed onboarding can browse open requests for topics
// they're registered to tutor and pick one up directly — this is the
// "log unmet requests, let tutors browse them" feature. Reuses the same
// createRelationshipFromMatch path (via fulfillRequest) as a live search
// match, so it gets the same dedup guard and eligibility re-check.

function RequestsToFulfillTab({ session, topics, onFulfilled }: {
  session: StudentSession; topics: TopicOption[]; onFulfilled: () => void;
}) {
  const [requests, setRequests] = useState<TutoringRequest[] | null>(null);
  const [fulfillingId, setFulfillingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fulfilledMessage, setFulfilledMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchOpenRequestsForTutor(session.student_id).then(setRequests);
  }, [session.student_id]);

  async function handleFulfill(requestId: number) {
    setFulfillingId(requestId);
    setError(null);
    const outcome = await fulfillRequest(requestId, session.student_id);
    setFulfillingId(null);
    if (!outcome.success) { setError(outcome.error); return; }
    setFulfilledMessage('You\'re matched! Find this student under "My relationships" to schedule your first session.');
    onFulfilled();
    fetchOpenRequestsForTutor(session.student_id).then(setRequests);
  }

  if (fulfilledMessage) {
    return (
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="paper-card rounded p-8 flex flex-col items-center text-center">
        <CheckCircle2 className="w-10 h-10 text-green-600 mb-3" />
        <h2 className="text-[17px] font-semibold text-brand-dark mb-1">Match created</h2>
        <p className="text-[13.5px] text-stone-500 max-w-sm">{fulfilledMessage}</p>
        <button onClick={() => setFulfilledMessage(null)} className="mt-4 text-[12.5px] font-semibold" style={{ color: 'var(--color-accent-soft)' }}>
          Back to requests
        </button>
      </motion.div>
    );
  }

  if (requests === null) {
    return (
      <div className="paper-card rounded p-6 space-y-3">
        <Shimmer className="h-4 w-1/2" /><Shimmer className="h-4 w-2/3" />
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="paper-card rounded p-8 flex flex-col items-center text-center">
        <Search className="w-9 h-9 text-stone-300 mb-3" />
        <h2 className="text-[17px] font-semibold text-brand-dark mb-1">No open requests right now</h2>
        <p className="text-[13.5px] text-stone-500 max-w-sm">No one currently needs help on the topics you tutor. Check back later.</p>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease }} className="space-y-3">
      {error && <p className="text-[13px] text-red-600 font-medium">{error}</p>}
      {requests.map((r) => {
        const topic = topics.find((t) => t.id === r.topicId);
        return (
          <div key={r.id} className="paper-card rounded p-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-[14px] font-bold text-brand-dark">{topic?.label ?? `Topic #${r.topicId}`}</p>
              <p className="text-[12px] text-stone-500 mt-0.5">
                {r.grade ? `Grade ${r.grade} · ` : ''}Requested {new Date(r.createdAt).toLocaleDateString('en-ZA')}
              </p>
            </div>
            <PrimaryButton onClick={() => handleFulfill(r.id)} disabled={fulfillingId === r.id}
              className="px-4 py-2 text-[12.5px] shrink-0">
              {fulfillingId === r.id ? 'Matching…' : 'Help this student'}
            </PrimaryButton>
          </div>
        );
      })}
    </motion.div>
  );
}

// ── Become a tutor ───────────────────────────────────────────────────────

function BecomeTutorTab({ session, tutorProfile, tutorTopics, subjects, topics, onChanged }: {
  session: StudentSession; tutorProfile: TutorProfile | null; tutorTopics: TutorTopic[];
  subjects: SubjectOption[]; topics: TopicOption[]; onChanged: () => void;
}) {
  const [showOrientation, setShowOrientation] = useState(false);

  const needsOrientation = !tutorProfile?.orientationCompletedAt;
  const needsConduct = !tutorProfile?.conductAcknowledgedAt;

  if (needsOrientation || showOrientation) {
    return <TutorOrientation onComplete={async () => {
      await ensureTutorProfile(session.student_id, session.school_id);
      await completeTutorOrientation(session.student_id, session.school_id);
      setShowOrientation(false);
      onChanged();
    }} />;
  }

  if (needsConduct) {
    return (
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="paper-card rounded p-6 sm:p-8 space-y-4">
        <h2 className="text-[17px] font-semibold text-brand-dark">Code of conduct</h2>
        <ul className="text-[13.5px] text-stone-600 space-y-1.5 list-disc list-inside">
          <li>Be respectful — no insults, bullying, or personal questions.</li>
          <li>Stay on topic — no sharing of private contact info.</li>
          <li>Don't just give answers — ask questions and guide, per your orientation.</li>
          <li>If something feels wrong, report it.</li>
        </ul>
        <PrimaryButton onClick={async () => { await acknowledgeTutorConduct(session.student_id, session.school_id); onChanged(); }}
          className="w-full py-3 text-[14px]">
          I agree to follow these rules
        </PrimaryButton>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      <OfferTopicForm tutorProfile={tutorProfile!} subjects={subjects} topics={topics} onOffered={onChanged} />
      {tutorTopics.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="paper-card rounded p-5">
          <p className="text-[13px] font-bold text-brand-dark mb-3">Topics you're offering to tutor</p>
          <div className="space-y-2">
            {tutorTopics.map((t) => {
              const topic = topics.find((x) => x.id === t.topicId);
              return (
                <div key={t.id} className="flex items-center justify-between px-3 py-2 rounded" style={{ background: 'var(--color-paper-raise)', border: '1px solid var(--color-brand-border)' }}>
                  <span className="text-[13px] text-brand-dark font-medium">{topic?.label ?? `Topic #${t.topicId}`}</span>
                  <span className="text-[11.5px] text-stone-500">Your score: {t.demonstratedScorePct}%</span>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}

function TutorOrientation({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const slides = [
    { title: '"Ask, don\'t tell"', body: 'Your job is to guide, not to give answers. Use questions like "What\'s the first step here?" instead of solving it for them.' },
    { title: 'Praise effort, not just correctness', body: 'Notice and encourage the attempt, even when the answer is wrong. That\'s what keeps a tutee trying.' },
    { title: 'Use the session script', body: 'Every session follows 5 steps: set a goal, tutee attempts first, you explain the strategy, guided practice, then recap. Don\'t skip ahead.' },
  ];
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="paper-card rounded p-6 sm:p-8 space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0" style={{ background: 'var(--color-accent)' }}>
          <GraduationCap className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-[18px] font-semibold text-brand-dark">Tutor orientation ({step + 1} of {slides.length})</h2>
      </div>
      <div>
        <p className="text-[15px] font-bold text-brand-dark mb-2">{slides[step].title}</p>
        <p className="text-[14px] text-stone-600 leading-relaxed">{slides[step].body}</p>
      </div>
      <div className="rounded p-4 space-y-1.5" style={{ background: 'var(--color-paper-raise)', border: '1px solid var(--color-brand-border)' }}>
        <p className="text-[12px] font-bold uppercase tracking-wide text-stone-500">Cheat sheet</p>
        <p className="text-[12.5px] text-stone-600">Do: ask "why" and "how" questions · give the tutee time to think · praise effort.</p>
        <p className="text-[12.5px] text-stone-600">Don't: solve their homework for them · rush to the answer · make them feel judged.</p>
      </div>
      <PrimaryButton onClick={() => step < slides.length - 1 ? setStep(step + 1) : onComplete()}
        className="w-full py-3 text-[14px]">
        {step < slides.length - 1 ? 'Next' : 'Finish orientation'}
      </PrimaryButton>
    </motion.div>
  );
}

function OfferTopicForm({ tutorProfile, subjects, topics, onOffered }: {
  tutorProfile: TutorProfile; subjects: SubjectOption[]; topics: TopicOption[]; onOffered: () => void;
}) {
  const [subjectId, setSubjectId] = useState<number | null>(null);
  const [topicId, setTopicId] = useState<number | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const filteredTopics = topics.filter((t) => subjectId == null || t.subject_id === subjectId);

  async function handleOffer() {
    if (!subjectId || !topicId || score == null) return;
    setSaving(true);
    await offerTutorTopic(tutorProfile.id, subjectId, topicId, score);
    setSaving(false);
    setSubjectId(null); setTopicId(null); setScore(null);
    onOffered();
  }

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease }} className="paper-card rounded p-5 sm:p-6 space-y-4">
      <p className="text-[14px] font-bold text-brand-dark">Offer to tutor a topic</p>
      <p className="text-[12.5px] text-stone-500">Enter your most recent topic-test score to show you've mastered it — this is checked against the ability-gap rule when you're matched.</p>
      <div>
        <label className="text-[12px] font-bold text-stone-500 mb-1.5 block">Subject</label>
        <Dropdown
          value={subjectId ? String(subjectId) : null}
          onChange={(v) => { setSubjectId(Number(v) || null); setTopicId(null); }}
          placeholder="Select a subject…"
          buttonClassName="w-full px-3 py-2.5 rounded-lg border border-brand-border text-[13.5px] bg-white flex items-center justify-between gap-2"
          options={subjects.map((s) => ({ value: String(s.id), label: s.label }))}
        />
      </div>
      <div>
        <label className="text-[12px] font-bold text-stone-500 mb-1.5 block">Topic</label>
        <Dropdown
          value={topicId ? String(topicId) : null}
          onChange={(v) => setTopicId(Number(v) || null)}
          disabled={!subjectId}
          placeholder="Select a topic…"
          buttonClassName="w-full px-3 py-2.5 rounded-lg border border-brand-border text-[13.5px] bg-white flex items-center justify-between gap-2 disabled:opacity-50"
          options={filteredTopics.map((t) => ({ value: String(t.id), label: t.label }))}
        />
      </div>
      <div>
        <label className="text-[12px] font-bold text-stone-500 mb-1.5 block">Your most recent score on this topic (%)</label>
        <input type="number" min={0} max={100} value={score ?? ''} onChange={(e) => setScore(e.target.value ? Number(e.target.value) : null)}
          className="w-full px-3 py-2.5 rounded-lg border border-brand-border text-[13.5px] bg-white" />
      </div>
      <PrimaryButton onClick={handleOffer} disabled={!subjectId || !topicId || score == null || saving}
        className="w-full py-3 text-[14px]">
        {saving ? 'Saving…' : 'Offer to tutor'}
      </PrimaryButton>
    </motion.div>
  );
}

// ── My relationships ─────────────────────────────────────────────────────

function MyRelationshipsTab({ session, relationships, onStartSession, onChanged }: {
  session: StudentSession; relationships: TutoringRelationship[];
  onStartSession: (v: { relationshipId: number; sessionId: number }) => void; onChanged: () => void;
}) {
  if (relationships.length === 0) {
    return (
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="paper-card rounded p-8 flex flex-col items-center text-center">
        <ListChecks className="w-9 h-9 text-stone-300 mb-3" />
        <h2 className="text-[17px] font-semibold text-brand-dark mb-1">No tutoring relationships yet</h2>
        <p className="text-[13.5px] text-stone-500">Find a tutor or offer to become one to get started.</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-3">
      {relationships.map((rel) => (
        <RelationshipCard key={rel.id} session={session} rel={rel} onStartSession={onStartSession} onChanged={onChanged} />
      ))}
    </div>
  );
}

function RelationshipCard({ session, rel, onStartSession, onChanged }: {
  session: StudentSession; rel: TutoringRelationship;
  onStartSession: (v: { relationshipId: number; sessionId: number }) => void; onChanged: () => void;
}) {
  const [sessions, setSessions] = useState<TutoringSession[]>([]);
  const [showReport, setShowReport] = useState(false);
  const [confirmLeave, setConfirmLeave] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const isTutor = rel.tutorStudentId === session.student_id;
  const role = isTutor ? 'You are tutoring' : 'You are being tutored by';

  useEffect(() => { fetchSessionsForRelationship(rel.id).then(setSessions); }, [rel.id]);

  const unconfirmed = sessions.find((s) => s.status === 'completed' && !s.tuteeConfirmedAt);
  const scheduled = sessions.find((s) => s.status === 'scheduled' || s.status === 'in_progress');

  async function handleScheduleAndStart() {
    let s = scheduled;
    if (!s) {
      const created = await scheduleSession(rel.id, rel.schoolId, new Date());
      if (!created) return;
      s = created;
    }
    if (s.status === 'scheduled') await startSession(s.id);
    onStartSession({ relationshipId: rel.id, sessionId: s.id });
  }

  async function handleLeave() {
    setLeaving(true);
    await endRelationshipEarly(rel.id, session.student_id);
    setLeaving(false);
    setConfirmLeave(false);
    onChanged();
  }

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="paper-card rounded p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[12px] text-stone-500">{role}</p>
          <p className="text-[14px] font-bold text-brand-dark mt-0.5">
            {rel.status === 'active' && 'Active tutoring relationship'}
            {rel.status === 'completed' && 'Completed'}
            {(rel.status === 'ended_early' || rel.status === 'declined') && 'Ended'}
          </p>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-[10.5px] font-black uppercase tracking-wide shrink-0 ${
          rel.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-stone-100 text-stone-500'
        }`}>{rel.status.replace(/_/g, ' ')}</span>
      </div>

      {rel.status === 'active' && (
        <div className="mt-4 flex flex-wrap gap-2">
          {unconfirmed && !isTutor ? (
            <ConfirmSessionButton session={session} tutoringSession={unconfirmed} onConfirmed={onChanged} />
          ) : (
            <PrimaryButton onClick={handleScheduleAndStart} className="px-4 py-2 text-[12.5px]">
              {scheduled ? 'Resume session' : 'Start a session'}
            </PrimaryButton>
          )}
          <button onClick={() => setShowReport(true)} className="px-4 py-2 rounded border border-brand-border text-[12.5px] font-bold text-red-500 hover:bg-red-50 transition-colors flex items-center gap-1.5" style={{ background: 'var(--color-paper-raise)' }}>
            <ShieldAlert className="w-3.5 h-3.5" /> Report a concern
          </button>
          {confirmLeave ? (
            <div className="flex items-center gap-2 px-3.5 py-2 rounded border border-brand-border" style={{ background: 'var(--color-paper-raise)' }}>
              <span className="text-[12px] text-stone-600">End this match?</span>
              <button onClick={handleLeave} disabled={leaving} className="text-[12.5px] font-bold text-red-500 hover:text-red-600 transition-colors disabled:opacity-50">
                {leaving ? 'Ending...' : 'Yes, end it'}
              </button>
              <button onClick={() => setConfirmLeave(false)} className="text-[12.5px] font-bold text-stone-500 hover:text-stone-700 transition-colors">
                Cancel
              </button>
            </div>
          ) : (
            <button onClick={() => setConfirmLeave(true)} className="px-4 py-2 rounded text-[12.5px] font-bold text-stone-500 hover:text-stone-700 transition-colors">
              Leave this match
            </button>
          )}
        </div>
      )}

      {sessions.length > 0 && (
        <p className="text-[11.5px] text-stone-400 mt-3">{sessions.filter((s) => s.status === 'completed').length} session(s) logged</p>
      )}

      {showReport && (
        <ReportConcernModal session={session} relationshipId={rel.id} onClose={() => setShowReport(false)} />
      )}
    </motion.div>
  );
}

function ConfirmSessionButton({ session, tutoringSession, onConfirmed }: { session: StudentSession; tutoringSession: TutoringSession; onConfirmed: () => void }) {
  const [open, setOpen] = useState(false);
  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="px-4 py-2 rounded bg-amber-500 text-white text-[12.5px] font-bold hover:bg-amber-600 transition-colors">
        Confirm your last session
      </button>
    );
  }
  return (
    <div className="w-full space-y-2 mt-1">
      <p className="text-[12.5px] font-bold text-brand-dark">Did this session help you understand the topic?</p>
      <div className="flex gap-2">
        {(['yes', 'partly', 'no'] as const).map((v) => (
          <button key={v} onClick={async () => { await confirmSession(tutoringSession.id, session.student_id, v); setOpen(false); onConfirmed(); }}
            className="paper-card rounded px-3.5 py-2 text-[12.5px] font-bold text-brand-dark hover:border-accent transition-colors capitalize">
            {v}
          </button>
        ))}
      </div>
    </div>
  );
}

function ReportConcernModal({ session, relationshipId, onClose }: { session: StudentSession; relationshipId: number; onClose: () => void }) {
  const [category, setCategory] = useState<ConcernCategory>('uncomfortable_behaviour');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit() {
    if (!description.trim()) return;
    setSubmitting(true);
    await reportConcern(session.school_id, session.student_id, category, description, { relationshipId });
    setSubmitting(false);
    setDone(true);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-dark/40 backdrop-blur-sm p-4" onClick={onClose}>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} onClick={(e) => e.stopPropagation()}
        className="paper-card rounded p-6 max-w-md w-full space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-[15px] font-bold text-brand-dark">Report a concern</p>
          <button onClick={onClose}><X className="w-4.5 h-4.5 text-stone-400" /></button>
        </div>
        {done ? (
          <div className="text-center py-4">
            <CheckCircle2 className="w-9 h-9 text-green-600 mx-auto mb-2" />
            <p className="text-[13.5px] text-stone-600">Sent to your homeroom teacher. They'll follow up with you.</p>
          </div>
        ) : (
          <>
            <p className="text-[12.5px] text-stone-500">This goes directly to your homeroom teacher, not the other student.</p>
            <Dropdown
              value={category}
              onChange={(v) => setCategory(v as ConcernCategory)}
              buttonClassName="w-full px-3 py-2.5 rounded-lg border border-brand-border text-[13.5px] bg-white flex items-center justify-between gap-2"
              options={[
                { value: 'uncomfortable_behaviour', label: 'Made me feel uncomfortable' },
                { value: 'pressured_or_harassed', label: 'Felt pressured or harassed' },
                { value: 'inappropriate_content', label: 'Inappropriate content or messages' },
                { value: 'not_following_rules', label: 'Not following the session rules' },
                { value: 'other', label: 'Something else' },
              ]}
            />
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4}
              placeholder="Tell us what happened…" className="w-full px-3 py-2.5 rounded-lg border border-brand-border text-[13.5px] bg-white resize-none" />
            <PrimaryButton onClick={handleSubmit} disabled={!description.trim() || submitting}
              className="w-full py-3 text-[14px]">
              {submitting ? 'Sending…' : 'Send report'}
            </PrimaryButton>
          </>
        )}
      </motion.div>
    </div>
  );
}

// ── Session flow (research section 3's 5-step structured script) ──────────

function SessionFlow({ session, relationshipId, sessionId, onExit }: {
  session: StudentSession; relationshipId: number; sessionId: number; onExit: () => void;
}) {
  const [stepIndex, setStepIndex] = useState(0);
  const [goalText, setGoalText] = useState('');
  const [confidenceBefore, setConfidenceBefore] = useState<number | null>(null);
  const [confidenceAfter, setConfidenceAfter] = useState<number | null>(null);
  const [ending, setEnding] = useState(false);
  const [ended, setEnded] = useState(false);
  const [verifiedCount, setVerifiedCount] = useState<number | null>(null);

  const current = SESSION_TEMPLATE_STEPS[stepIndex];

  async function advance() {
    const extra: { goalText?: string; tuteeConfidenceBefore?: number } = {};
    if (current.step === 'set_goal') extra.goalText = goalText;
    if (current.step === 'tutee_attempts' && confidenceBefore != null) extra.tuteeConfidenceBefore = confidenceBefore;
    await completeSessionStep(sessionId, current.step, extra);

    if (stepIndex < SESSION_TEMPLATE_STEPS.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      setEnding(true);
    }
  }

  async function finish() {
    await endSession(sessionId, confidenceAfter ?? undefined);
    setEnded(true);
    const rel = await fetchRelationshipById(relationshipId);
    if (rel) setVerifiedCount(await countVerifiedSessionsForTutor(rel.tutorStudentId));
  }

  if (ended) {
    return (
      <div className="student-home min-h-full flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="paper-card rounded p-8 max-w-md text-center space-y-3">
          <CheckCircle2 className="w-10 h-10 text-green-600 mx-auto" />
          <h2 className="text-[17px] font-semibold text-brand-dark">Session logged</h2>
          <p className="text-[13.5px] text-stone-500">
            If you're the tutee, remember to confirm this session within 24 hours from "My relationships" — that's what makes it count.
          </p>
          {verifiedCount != null && (
            <p className="text-[11.5px] text-stone-400">
              Next badge at {Object.entries(BADGE_THRESHOLDS).find(([, n]) => n > verifiedCount)?.[1] ?? '—'} verified sessions.
            </p>
          )}
          <PrimaryButton onClick={onExit} className="w-full py-3 text-[14px]">Done</PrimaryButton>
        </motion.div>
      </div>
    );
  }

  if (ending) {
    return (
      <div className="student-home min-h-full flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="paper-card rounded p-8 max-w-md w-full space-y-4">
          <h2 className="text-[17px] font-semibold text-brand-dark">Quick recap</h2>
          <p className="text-[13.5px] text-stone-600">How confident do you feel about the topic now? (1 = not at all, 5 = very confident)</p>
          <div className="flex gap-2 justify-center">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} onClick={() => setConfidenceAfter(n)}
                className={`w-10 h-10 rounded-full text-[13px] font-bold border ${confidenceAfter === n ? 'bg-brand-dark text-white border-brand-dark' : 'bg-white text-stone-500 border-brand-border'}`}>
                {n}
              </button>
            ))}
          </div>
          <PrimaryButton onClick={finish} disabled={confidenceAfter == null}
            className="w-full py-3 text-[14px]">
            Finish session
          </PrimaryButton>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="student-home min-h-full flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="paper-card rounded p-8 max-w-lg w-full space-y-5">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-black uppercase tracking-wide text-stone-400">Step {stepIndex + 1} of {SESSION_TEMPLATE_STEPS.length} · ~{current.minutes} min</p>
          <button onClick={onExit} className="text-stone-400 hover:text-stone-600"><X className="w-4.5 h-4.5" /></button>
        </div>
        <h2 className="text-[19px] font-semibold text-brand-dark">{current.label}</h2>
        <p className="text-[14px] text-stone-600 leading-relaxed">{current.prompt}</p>

        {current.step === 'set_goal' && (
          <textarea value={goalText} onChange={(e) => setGoalText(e.target.value)} rows={2}
            placeholder="e.g. By the end, I can solve 3 exam-style linear equations without help"
            className="w-full px-3 py-2.5 rounded-lg border border-brand-border text-[13.5px] bg-white resize-none" />
        )}
        {current.step === 'tutee_attempts' && (
          <div>
            <p className="text-[12.5px] font-bold text-stone-500 mb-2">How confident do you feel right now? (1-5)</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} onClick={() => setConfidenceBefore(n)}
                  className={`w-9 h-9 rounded-full text-[12.5px] font-bold border ${confidenceBefore === n ? 'bg-brand-dark text-white border-brand-dark' : 'bg-white text-stone-500 border-brand-border'}`}>
                  {n}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-1.5">
          {SESSION_TEMPLATE_STEPS.map((s, i) => (
            <div key={s.step} className={`h-1.5 flex-1 rounded-full ${i <= stepIndex ? 'bg-accent' : 'bg-stone-200'}`} />
          ))}
        </div>

        <PrimaryButton onClick={advance} className="w-full py-3 text-[14px]">
          {stepIndex < SESSION_TEMPLATE_STEPS.length - 1 ? 'Next step' : 'Continue to recap'}
        </PrimaryButton>
      </motion.div>
    </div>
  );
}
