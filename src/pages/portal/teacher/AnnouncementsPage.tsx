import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus, X, Trash2, Pin, PinOff, Megaphone, CheckCircle2,
  Users, GraduationCap, BookOpen, User,
} from 'lucide-react';
import {
  fetchAnnouncements, createAnnouncement, deleteAnnouncement, toggleAnnouncementPinned,
  type Announcement, type AnnouncementTargetType,
} from '../../../lib/announcements';
import { fetchSubjects, type Subject } from '../../../lib/students';
import { supabaseAdmin } from '../../../lib/supabase';
import type { TeacherSession } from '../../../lib/auth';
import {
  fetchAnnouncementEngagement, fetchAnnouncementImpact,
  type AnnouncementEngagement, type AnnouncementImpact,
} from '../../../lib/teacherAnalytics';
import { Shimmer } from '../../../shared/components/Shimmer';

const ease = [0.23, 1, 0.32, 1] as [number, number, number, number];

const GRADES = [8, 9, 10, 11, 12];

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 2)   return 'Just now';
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7)   return `${days}d ago`;
  return new Date(iso).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });
}

function audienceSummary(a: Announcement, subjects: Subject[]): string {
  if (a.target_type === 'all') return 'Everyone';
  if (a.target_type === 'grade') return `Grade ${a.target_grades?.join(', ')}`;
  if (a.target_type === 'class') return `${a.target_cohort_ids?.length} class(es)`;
  if (a.target_type === 'subject') {
    const names = a.target_subject_ids?.map(id => subjects.find(s => s.id === id)?.label ?? id).join(', ');
    const grades = a.target_grades?.map(g => `Gr ${g}`).join(', ');
    return `${names} — ${grades}`;
  }
  if (a.target_type === 'specific') return `${a.target_student_ids?.length} student(s)`;
  return '';
}

interface Cohort { id: number; name: string; grade: number; }

interface AnnouncementsPageProps { session: TeacherSession; }

const emptyForm = {
  title: '', body: '', pinned: false,
  target_type: 'all' as AnnouncementTargetType,
  target_grades: [] as number[],
  target_cohort_ids: [] as number[],
  target_subject_ids: [] as number[],
  target_student_ids: [] as number[],
};

export default function AnnouncementsPage({ session }: AnnouncementsPageProps) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading]     = useState(true);
  const [subjects, setSubjects]   = useState<Subject[]>([]);
  const [cohorts, setCohorts]     = useState<Cohort[]>([]);
  const [allStudents, setAllStudents] = useState<{ id: number; name: string; surname: string }[]>([]);
  const [modal, setModal]         = useState(false);
  const [saving, setSaving]       = useState(false);
  const [formError, setFormError] = useState('');
  const [toast, setToast]         = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Announcement | null>(null);
  const [deleting, setDeleting]   = useState(false);
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [form, setForm]           = useState(emptyForm);
  const [engagement, setEngagement] = useState<Map<number, AnnouncementEngagement>>(new Map());
  const [impact,     setImpact]     = useState<Map<number, AnnouncementImpact>>(new Map());

  useEffect(() => {
    reload();
    fetchSubjects().then(setSubjects);
    supabaseAdmin.from('cohorts').select('id, name, grade')
      .eq('school_id', session.school_id).order('grade').order('name')
      .then(({ data }) => setCohorts(data ?? []));
    supabaseAdmin.from('students').select('id, name, surname')
      .eq('school_id', session.school_id).order('surname')
      .then(({ data }) => setAllStudents(data ?? []));
  }, []);

  async function reload() {
    setLoading(true);
    const data = await fetchAnnouncements(session.school_id);
    setAnnouncements(data);
    setLoading(false);
    // Non-blocking engagement + impact fetch
    if (data.length > 0) {
      const ids   = data.map(a => a.id);
      const dates = Object.fromEntries(data.map(a => [a.id, a.created_at]));
      fetchAnnouncementEngagement(session.school_id, ids, data).then(setEngagement);
      fetchAnnouncementImpact(session.school_id, ids, dates).then(setImpact);
    }
  }

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  function toggle<T>(arr: T[], val: T): T[] {
    return arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val];
  }

  async function handleCreate() {
    if (!form.title.trim()) { setFormError('Title is required.'); return; }
    if (form.target_type === 'grade'    && form.target_grades.length === 0)     { setFormError('Select at least one grade.'); return; }
    if (form.target_type === 'class'    && form.target_cohort_ids.length === 0) { setFormError('Select at least one class.'); return; }
    if (form.target_type === 'subject'  && form.target_subject_ids.length === 0){ setFormError('Select at least one subject.'); return; }
    if (form.target_type === 'subject'  && form.target_grades.length === 0)     { setFormError('Select at least one grade for subject.'); return; }
    if (form.target_type === 'specific' && form.target_student_ids.length === 0){ setFormError('Select at least one student.'); return; }

    setSaving(true); setFormError('');
    const result = await createAnnouncement({
      school_id:          session.school_id,
      teacher_id:         session.teacher_id,
      title:              form.title,
      body:               form.body,
      pinned:             form.pinned,
      target_type:        form.target_type,
      target_grades:      form.target_grades,
      target_cohort_ids:  form.target_cohort_ids,
      target_subject_ids: form.target_subject_ids,
      target_student_ids: form.target_student_ids,
    });
    setSaving(false);
    if (!result.success) { setFormError(result.error); return; }
    setModal(false); setForm(emptyForm);
    reload(); showToast('Announcement posted.');
  }

  async function handleTogglePin(a: Announcement) {
    setTogglingId(a.id);
    await toggleAnnouncementPinned(a.id, session.school_id, !a.pinned);
    await reload(); setTogglingId(null);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    await deleteAnnouncement(deleteTarget.id, session.school_id);
    setDeleting(false); setDeleteTarget(null);
    reload(); showToast('Announcement deleted.');
  }

  const pinned   = announcements.filter(a => a.pinned);
  const unpinned = announcements.filter(a => !a.pinned);

  return (
    <div className="student-home min-h-full pb-16 relative">

      {/* ═══ Hero ═══════════════════════════════════════════════ */}
      <div className="relative overflow-hidden">
        <div className="relative max-w-5xl mx-auto px-5 sm:px-8 pt-8 sm:pt-11 pb-6 sm:pb-8 w-full flex flex-wrap items-end justify-between gap-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
          >
            <p className="text-[12px] text-[rgba(31,36,33,0.5)] font-medium">Teacher</p>
            <h1
              className="text-brand-dark text-[32px] sm:text-[40px] leading-[1.12] mt-2"
              style={{ fontFamily: 'var(--font-instrument)', fontWeight: 500, letterSpacing: '-0.02em' }}
            >
              Announcements
            </h1>
          </motion.div>
          <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}
            onClick={() => { setModal(true); setFormError(''); setForm(emptyForm); }}
            className="flex items-center gap-2 bg-accent text-white text-sm font-black px-4 py-2.5 rounded shrink-0 transition-colors duration-200 hover:bg-[var(--color-accent-soft)]">
            <Plus className="w-4 h-4" /> Post Announcement
          </motion.button>
        </div>
      </div>

      {/* ═══ Body ═══════════════════════════════════════════════ */}
      <div className="max-w-5xl mx-auto px-4 sm:px-8 relative z-10 space-y-5 sm:space-y-6 pt-2 sm:pt-3">

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.22 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2.5 bg-accent text-white text-sm font-bold px-5 py-3 rounded-2xl shadow-xl">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />{toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* List */}
      {loading ? (
        <div className="space-y-2">
          {[0, 1, 2].map(i => (
            <div key={i} className="paper-card rounded p-4">
              <Shimmer className="h-3 w-2/3 mb-3" />
              <Shimmer className="h-3 w-1/3" />
            </div>
          ))}
        </div>
      ) : announcements.length === 0 ? (
        <div className="paper-card rounded flex flex-col items-center justify-center py-24 text-center">
          <Megaphone className="w-10 h-10 text-stone-200 mb-4" />
          <p className="text-sm font-bold text-stone-500">No announcements yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {pinned.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Pin className="w-3.5 h-3.5 text-amber-500" />
                <p className="text-xs font-black uppercase tracking-widest text-stone-500">Pinned</p>
              </div>
              <div className="space-y-2">
                {pinned.map((a, i) => (
                  <AnnouncementCard key={a.id} a={a} i={i} subjects={subjects}
                    toggling={togglingId === a.id}
                    onPin={() => handleTogglePin(a)} onDelete={() => setDeleteTarget(a)}
                    eng={engagement.get(a.id)} imp={impact.get(a.id)} />
                ))}
              </div>
            </div>
          )}
          {unpinned.length > 0 && (
            <div>
              {pinned.length > 0 && <p className="text-xs font-black uppercase tracking-widest text-stone-500 mb-3">Recent</p>}
              <div className="space-y-2">
                {unpinned.map((a, i) => (
                  <AnnouncementCard key={a.id} a={a} i={i} subjects={subjects}
                    toggling={togglingId === a.id}
                    onPin={() => handleTogglePin(a)} onDelete={() => setDeleteTarget(a)}
                    eng={engagement.get(a.id)} imp={impact.get(a.id)} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      </div>

      {/* ── Create Modal ──────────────────────────────────────── */}
      <AnimatePresence>
        {modal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => setModal(false)}>
            <motion.div initial={{ scale: 0.95, y: 12, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 8, opacity: 0 }} transition={{ duration: 0.2, ease: 'easeOut' }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}>

              <div className="sticky top-0 bg-white border-b border-brand-border/60 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
                <h2 className="text-base font-black text-brand-dark">Post Announcement</h2>
                <button onClick={() => setModal(false)} aria-label="Close" className="p-1.5 rounded-lg hover:bg-stone-100 transition-colors">
                  <X className="w-4 h-4 text-stone-500" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-2">Title *</label>
                  <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    placeholder="e.g. School closes early on Friday"
                    className="w-full px-3 py-2.5 rounded border border-brand-border text-sm font-bold text-brand-dark placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-dark" />
                </div>

                {/* Body */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-2">
                    Message <span className="normal-case font-bold text-stone-400">(optional)</span>
                  </label>
                  <textarea value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
                    rows={3} placeholder="Additional details…"
                    className="w-full px-3 py-2.5 rounded border border-brand-border text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-dark resize-none" />
                </div>

                {/* Audience */}
                <AudienceSelector
                  form={form} setForm={setForm}
                  subjects={subjects} cohorts={cohorts} allStudents={allStudents}
                  toggle={toggle}
                />

                {/* Pin */}
                <button onClick={() => setForm(f => ({ ...f, pinned: !f.pinned }))}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded border text-sm font-black transition-all ${
                    form.pinned ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-stone-50 border-brand-border text-stone-500 hover:bg-stone-100'
                  }`}>
                  <Pin className="w-4 h-4" />
                  {form.pinned ? 'Pinned — stays at top' : 'Pin this announcement'}
                </button>

                {formError && <p className="text-sm font-bold text-red-500">{formError}</p>}
              </div>

              <div className="sticky bottom-0 bg-white border-t border-brand-border/60 px-6 py-4 rounded-b-2xl flex gap-2">
                <button onClick={() => setModal(false)}
                  className="flex-1 py-2.5 rounded border border-brand-border text-sm font-black text-stone-600 hover:bg-stone-50 transition-colors">Cancel</button>
                <button onClick={handleCreate} disabled={saving}
                  className="flex-1 py-2.5 rounded bg-accent text-white text-sm font-black hover:bg-stone-700 transition-colors disabled:opacity-50">
                  {saving ? 'Posting…' : 'Post'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Delete Confirm ────────────────────────────────────── */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => setDeleteTarget(null)}>
            <motion.div initial={{ scale: 0.95, y: 12, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 8, opacity: 0 }} transition={{ duration: 0.2, ease: 'easeOut' }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6"
              onClick={e => e.stopPropagation()}>
              <h2 className="text-base font-black text-brand-dark mb-1">Delete announcement?</h2>
              <p className="text-sm text-stone-500 mb-5"><strong>"{deleteTarget.title}"</strong> will be permanently removed.</p>
              <div className="flex gap-2">
                <button onClick={() => setDeleteTarget(null)}
                  className="flex-1 py-2.5 rounded border border-brand-border text-sm font-black text-stone-600 hover:bg-stone-50 transition-colors">Cancel</button>
                <button onClick={handleDelete} disabled={deleting}
                  className="flex-1 py-2.5 rounded bg-red-600 text-white text-sm font-black hover:bg-red-700 transition-colors disabled:opacity-50">
                  {deleting ? 'Deleting…' : 'Delete'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Audience selector (shared between teacher + admin pages) ──

interface AudienceSelectorProps {
  form: typeof emptyForm;
  setForm: React.Dispatch<React.SetStateAction<typeof emptyForm>>;
  subjects: Subject[];
  cohorts: { id: number; name: string; grade: number }[];
  allStudents: { id: number; name: string; surname: string }[];
  toggle: <T>(arr: T[], val: T) => T[];
}

export function AudienceSelector({ form, setForm, subjects, cohorts, allStudents, toggle }: AudienceSelectorProps) {
  const TARGET_OPTIONS: { value: AnnouncementTargetType; label: string; icon: any }[] = [
    { value: 'all',      label: 'Everyone',          icon: Users },
    { value: 'grade',    label: 'By Grade',           icon: GraduationCap },
    { value: 'class',    label: 'By Class',           icon: BookOpen },
    { value: 'subject',  label: 'By Subject + Grade', icon: BookOpen },
    { value: 'specific', label: 'Specific Students',  icon: User },
  ];

  return (
    <div>
      <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-2">Who sees this?</label>
      <div className="grid grid-cols-2 gap-1.5 mb-3">
        {TARGET_OPTIONS.map(opt => {
          const Icon = opt.icon;
          const active = form.target_type === opt.value;
          return (
            <button key={opt.value}
              onClick={() => setForm(f => ({ ...f, target_type: opt.value, target_grades: [], target_cohort_ids: [], target_subject_ids: [], target_student_ids: [] }))}
              className={`flex items-center gap-2 px-3 py-2 rounded text-xs font-black transition-all ${active ? 'bg-accent text-white' : 'bg-stone-100 text-stone-500 hover:bg-stone-200'}`}>
              <Icon className="w-3.5 h-3.5 shrink-0" />{opt.label}
            </button>
          );
        })}
      </div>

      {form.target_type === 'grade' && (
        <div className="flex flex-wrap gap-1.5">
          {GRADES.map(g => (
            <button key={g} onClick={() => setForm(f => ({ ...f, target_grades: toggle(f.target_grades, g) }))}
              className={`px-3 py-1.5 rounded text-xs font-black transition-all ${form.target_grades.includes(g) ? 'bg-accent text-white' : 'bg-stone-100 text-stone-500 hover:bg-stone-200'}`}>
              Grade {g}
            </button>
          ))}
        </div>
      )}

      {form.target_type === 'class' && (
        <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto">
          {cohorts.map(c => (
            <button key={c.id} onClick={() => setForm(f => ({ ...f, target_cohort_ids: toggle(f.target_cohort_ids, c.id) }))}
              className={`px-3 py-1.5 rounded text-xs font-black transition-all ${form.target_cohort_ids.includes(c.id) ? 'bg-accent text-white' : 'bg-stone-100 text-stone-500 hover:bg-stone-200'}`}>
              {c.name} <span className="opacity-60">(Gr {c.grade})</span>
            </button>
          ))}
        </div>
      )}

      {form.target_type === 'subject' && (
        <div className="space-y-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-stone-500 mb-1.5">Subject *</p>
            <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto">
              {subjects.map(s => (
                <button key={s.id} onClick={() => setForm(f => ({ ...f, target_subject_ids: toggle(f.target_subject_ids, s.id) }))}
                  className={`px-3 py-1.5 rounded text-xs font-black transition-all ${form.target_subject_ids.includes(s.id) ? 'bg-accent text-white' : 'bg-stone-100 text-stone-500 hover:bg-stone-200'}`}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-stone-500 mb-1.5">Grade *</p>
            <div className="flex flex-wrap gap-1.5">
              {GRADES.map(g => (
                <button key={g} onClick={() => setForm(f => ({ ...f, target_grades: toggle(f.target_grades, g) }))}
                  className={`px-3 py-1.5 rounded text-xs font-black transition-all ${form.target_grades.includes(g) ? 'bg-accent text-white' : 'bg-stone-100 text-stone-500 hover:bg-stone-200'}`}>
                  Grade {g}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {form.target_type === 'specific' && (
        <div className="space-y-1 max-h-36 overflow-y-auto border border-brand-border/60 rounded p-2">
          {allStudents.map(s => {
            const active = form.target_student_ids.includes(s.id);
            return (
              <button key={s.id} onClick={() => setForm(f => ({ ...f, target_student_ids: toggle(f.target_student_ids, s.id) }))}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-left transition-all ${active ? 'bg-accent text-white' : 'hover:bg-stone-100 text-stone-700'}`}>
                <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 text-[10px] font-black ${active ? 'bg-white border-white text-brand-dark' : 'border-stone-300'}`}>{active ? '✓' : ''}</span>
                {s.surname}, {s.name}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Announcement card ─────────────────────────────────────────

interface CardProps {
  a: Announcement; i: number; subjects: Subject[];
  toggling: boolean; onPin: () => void; onDelete: () => void;
  eng?: AnnouncementEngagement;
  imp?: AnnouncementImpact;
}

function AnnouncementCard({ a, i, subjects, toggling, onPin, onDelete, eng, imp }: CardProps) {
  const [expanded, setExpanded] = useState(false);
  const audience = audienceSummary(a, subjects);

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.04, duration: 0.18 }}
      className={`paper-card flex rounded overflow-hidden ${a.pinned ? 'border-amber-200' : ''}`}>
      {/* Quiet accent — amber if pinned, otherwise neutral */}
      <span className={`w-1 shrink-0 ${a.pinned ? 'bg-amber-400' : 'bg-stone-200'}`} />

      <div className="flex-1 min-w-0 px-4 py-4">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-black text-brand-dark leading-snug">{a.title}</p>
          {a.pinned && <Pin className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />}
        </div>
        {a.body && (
          <>
            <p className={`text-xs text-stone-500 mt-1 leading-relaxed ${!expanded ? 'line-clamp-2' : ''}`}>{a.body}</p>
            {a.body.length > 120 && (
              <button onClick={() => setExpanded(e => !e)}
                className="text-[11px] font-black text-stone-500 hover:text-stone-600 mt-0.5 transition-colors">
                {expanded ? 'Show less' : 'Show more'}
              </button>
            )}
          </>
        )}
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <p className="text-[10px] text-stone-400">
            {a.author_name} {a.author_surname}
            {a.author_role === 'admin' && <span className="ml-1 text-violet-400 font-bold">(Admin)</span>}
            {' · '}{timeAgo(a.created_at)}
          </p>
          {a.target_type !== 'all' && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-500">{audience}</span>
          )}
          {eng && eng.targetSize > 0 && (
            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
              eng.readRate >= 80 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
              eng.readRate >= 60 ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                   'bg-red-50 text-red-500 border-red-100'
            }`}>
              {eng.readRate}% read · n={eng.targetSize}
              {eng.unread > 0 && ` · ${eng.unread} unread`}
            </span>
          )}
          {imp && imp.delta > 5 && (
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full border bg-blue-50 text-blue-600 border-blue-100">
              +{imp.delta}% hw lift · n={imp.viewedCount}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-start gap-1 shrink-0 p-3">
        <button onClick={onPin} disabled={toggling}
          className={`p-2 rounded transition-colors disabled:opacity-40 ${a.pinned ? 'text-amber-500 hover:bg-amber-50' : 'text-stone-400 hover:text-amber-500 hover:bg-amber-50'}`}
          title={a.pinned ? 'Unpin' : 'Pin'}
          aria-label={a.pinned ? 'Unpin announcement' : 'Pin announcement'}>
          {a.pinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
        </button>
        <button onClick={onDelete}
          aria-label="Delete announcement"
          className="p-2 rounded text-stone-400 hover:text-red-500 hover:bg-red-50 transition-colors">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
