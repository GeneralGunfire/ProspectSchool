import { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { Users, ShieldAlert, AlertTriangle } from 'lucide-react';
import type { TeacherSession } from '../../../lib/auth';
import {
  fetchRelationshipsForSubjectTeacher,
  fetchSessionsForRelationship, detectSuspiciousPatterns, fetchOutcomeForRelationship,
  fetchConcernsForTeacher, acknowledgeConcern, resolveConcern,
  type TutoringRelationship, type TutoringSession, type SuspiciousPatternFlag, type TutoringOutcome, type TutoringConcern,
} from '../../../lib/peerTutoring';
import { supabaseAdmin } from '../../../lib/supabase';

const ease = [0.23, 1, 0.32, 1] as [number, number, number, number];

interface Props { session: TeacherSession }

interface StudentName { id: number; name: string; surname: string }

export default function PeerTutoringPage({ session }: Props) {
  const [loading, setLoading] = useState(true);
  const [all, setAll] = useState<TutoringRelationship[]>([]);
  const [concerns, setConcerns] = useState<TutoringConcern[]>([]);
  const [names, setNames] = useState<Map<number, StudentName>>(new Map());
  const [sessionsByRel, setSessionsByRel] = useState<Map<number, TutoringSession[]>>(new Map());
  const [outcomesByRel, setOutcomesByRel] = useState<Map<number, TutoringOutcome>>(new Map());
  const [flags, setFlags] = useState<SuspiciousPatternFlag[]>([]);

  const reload = useCallback(async () => {
    setLoading(true);
    const [a, c] = await Promise.all([
      fetchRelationshipsForSubjectTeacher(session.teacher_id),
      fetchConcernsForTeacher(session.teacher_id),
    ]);
    setAll(a);
    setConcerns(c);

    const studentIds = Array.from(new Set(a.flatMap((r) => [r.tutorStudentId, r.tuteeStudentId])
      .concat(c.flatMap((x) => [x.reportedByStudentId, x.aboutStudentId].filter((v): v is number => v != null)))));
    if (studentIds.length > 0) {
      const { data } = await supabaseAdmin.from('students').select('id, name, surname').in('id', studentIds);
      setNames(new Map((data ?? []).map((s: any) => [s.id, s])));
    }

    const sessionsMap = new Map<number, TutoringSession[]>();
    const outcomesMap = new Map<number, TutoringOutcome>();
    await Promise.all(a.map(async (rel) => {
      const [sess, outcome] = await Promise.all([fetchSessionsForRelationship(rel.id), fetchOutcomeForRelationship(rel.id)]);
      sessionsMap.set(rel.id, sess);
      if (outcome) outcomesMap.set(rel.id, outcome);
    }));
    setSessionsByRel(sessionsMap);
    setOutcomesByRel(outcomesMap);

    const tutorIds = Array.from(new Set(a.map((r) => r.tutorStudentId)));
    const patternFlags: SuspiciousPatternFlag[] = [];
    for (const tutorId of tutorIds) {
      const tutorRels = a.filter((r) => r.tutorStudentId === tutorId);
      const tutorSessions = tutorRels.flatMap((r) => sessionsMap.get(r.id) ?? []);
      const flag = detectSuspiciousPatterns(tutorId, tutorSessions, tutorRels);
      if (flag) patternFlags.push(flag);
    }
    setFlags(patternFlags);

    setLoading(false);
  }, [session.teacher_id]);

  useEffect(() => { reload(); }, [reload]);

  const openConcerns = concerns.filter((c) => c.status !== 'resolved');

  return (
    <div className="p-6 sm:p-8 max-w-5xl mx-auto space-y-6">
      <div>
        <p className="text-[12px] text-stone-400 font-medium">Peer Tutoring</p>
        <h1 className="text-[26px] font-semibold text-brand-dark mt-1">Oversight</h1>
        <p className="text-[13px] text-stone-500 mt-1">Relationships and sessions where you're the subject teacher, plus any concerns reported by your homeroom students.</p>
      </div>

      {loading ? (
        <div className="paper-card rounded p-6"><p className="text-[13px] text-stone-400">Loading…</p></div>
      ) : (
        <>
          {openConcerns.length > 0 && (
            <Section title="Reported concerns" icon={ShieldAlert} tone="red">
              {openConcerns.map((c) => (
                <ConcernRow key={c.id} concern={c} names={names} teacherId={session.teacher_id} onChanged={reload} />
              ))}
            </Section>
          )}

          {flags.length > 0 && (
            <Section title="Patterns worth reviewing" icon={AlertTriangle} tone="amber">
              {flags.map((f) => (
                <div key={f.tutorStudentId} className="px-4 py-3 rounded-lg bg-amber-50 border border-amber-200">
                  <p className="text-[13px] font-bold text-brand-dark">{studentLabel(names, f.tutorStudentId)}</p>
                  <ul className="text-[12.5px] text-amber-800 mt-1 list-disc list-inside">
                    {f.reasons.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                </div>
              ))}
            </Section>
          )}

          <Section title="All relationships" icon={Users} tone="default">
            {all.length === 0 ? (
              <p className="text-[13px] text-stone-400 px-1">No tutoring relationships yet.</p>
            ) : (
              all.map((rel) => (
                <RelationshipRow key={rel.id} rel={rel} names={names} sessions={sessionsByRel.get(rel.id) ?? []} outcome={outcomesByRel.get(rel.id)} />
              ))
            )}
          </Section>
        </>
      )}
    </div>
  );
}

function studentLabel(names: Map<number, StudentName>, id: number): string {
  const s = names.get(id);
  return s ? `${s.name} ${s.surname}` : `Student #${id}`;
}

function Section({ title, icon: Icon, tone, children }: { title: string; icon: typeof Users; tone: 'default' | 'red' | 'amber'; children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease }} className="paper-card rounded p-5 space-y-3">
      <p className={`text-[13px] font-bold flex items-center gap-1.5 ${tone === 'red' ? 'text-red-600' : tone === 'amber' ? 'text-amber-700' : 'text-brand-dark'}`}>
        <Icon className="w-4 h-4" /> {title}
      </p>
      <div className="space-y-2">{children}</div>
    </motion.div>
  );
}

function RelationshipRow({ rel, names, sessions, outcome }: { rel: TutoringRelationship; names: Map<number, StudentName>; sessions: TutoringSession[]; outcome?: TutoringOutcome }) {
  const verified = sessions.filter((s) => s.tuteeConfirmedAt && s.tuteeConfirmation !== 'no').length;
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-lg border border-brand-border">
      <div>
        <p className="text-[13px] font-bold text-brand-dark">{studentLabel(names, rel.tutorStudentId)} → {studentLabel(names, rel.tuteeStudentId)}</p>
        <p className="text-[11.5px] text-stone-500 mt-0.5">{sessions.length} session(s), {verified} verified</p>
        {outcome && (
          <p className="text-[11.5px] text-stone-500 mt-0.5">
            Estimated impact: {outcome.gain >= 0 ? '+' : ''}{outcome.gain} pts ({outcome.result.replace(/_/g, ' ')}) — indicative, not causal proof
          </p>
        )}
      </div>
      <span className={`px-2.5 py-1 rounded-full text-[10.5px] font-black uppercase tracking-wide shrink-0 ${
        rel.status === 'active' ? 'bg-green-100 text-green-700' : rel.status === 'pending_approval' ? 'bg-amber-100 text-amber-700' : 'bg-stone-100 text-stone-500'
      }`}>{rel.status.replace(/_/g, ' ')}</span>
    </div>
  );
}

function ConcernRow({ concern, names, teacherId, onChanged }: { concern: TutoringConcern; names: Map<number, StudentName>; teacherId: number; onChanged: () => void }) {
  const [notes, setNotes] = useState('');
  const [resolving, setResolving] = useState(false);

  return (
    <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-bold text-brand-dark">{studentLabel(names, concern.reportedByStudentId)} — {concern.category.replace(/_/g, ' ')}</p>
        <span className="text-[10.5px] font-black uppercase tracking-wide text-red-700">{concern.status.replace(/_/g, ' ')}</span>
      </div>
      <p className="text-[12.5px] text-stone-700">{concern.description}</p>
      {concern.status === 'open' && (
        <button onClick={async () => { await acknowledgeConcern(concern.id, teacherId); onChanged(); }}
          className="px-3 py-1.5 rounded-lg bg-brand-dark text-white text-[12px] font-bold hover:opacity-90 transition-opacity">
          Acknowledge
        </button>
      )}
      {concern.status === 'in_progress' && (
        resolving ? (
          <div className="space-y-2">
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder="Resolution notes…"
              className="w-full px-3 py-2 rounded-lg border border-brand-border text-[12.5px] bg-white resize-none" />
            <button onClick={async () => { await resolveConcern(concern.id, teacherId, notes); onChanged(); }} disabled={!notes.trim()}
              className="px-3 py-1.5 rounded-lg bg-brand-dark text-white text-[12px] font-bold hover:opacity-90 transition-opacity disabled:opacity-40">
              Mark resolved
            </button>
          </div>
        ) : (
          <button onClick={() => setResolving(true)} className="px-3 py-1.5 rounded-lg bg-white border border-brand-border text-[12px] font-bold text-brand-dark">
            Resolve
          </button>
        )
      )}
    </div>
  );
}
