import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, X, Trash2, Pin, PinOff, Megaphone, CheckCircle2 } from 'lucide-react';
import {
  fetchAnnouncements, createAnnouncement, deleteAnnouncement, toggleAnnouncementPinned,
  type Announcement, type AnnouncementTargetType,
} from '../../../lib/announcements';
import { AudienceSelector } from '../teacher/AnnouncementsPage';
import { fetchSubjects, type Subject } from '../../../lib/students';
import { supabaseAdmin } from '../../../lib/supabase';
import type { AdminSession } from '../../../lib/auth';

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

interface AdminAnnouncementsPageProps { session: AdminSession; }

const emptyForm = {
  title: '', body: '', pinned: false,
  target_type: 'all' as AnnouncementTargetType,
  target_grades: [] as number[],
  target_cohort_ids: [] as number[],
  target_subject_ids: [] as number[],
  target_student_ids: [] as number[],
};

export default function AdminAnnouncementsPage({ session }: AdminAnnouncementsPageProps) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading]     = useState(true);
  const [subjects, setSubjects]   = useState<Subject[]>([]);
  const [cohorts, setCohorts]     = useState<{ id: number; name: string; grade: number }[]>([]);
  const [allStudents, setAllStudents] = useState<{ id: number; name: string; surname: string }[]>([]);
  const [modal, setModal]         = useState(false);
  const [saving, setSaving]       = useState(false);
  const [formError, setFormError] = useState('');
  const [toast, setToast]         = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Announcement | null>(null);
  const [deleting, setDeleting]   = useState(false);
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [form, setForm]           = useState(emptyForm);

  useEffect(() => {
    if (!session.school_id) return;
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
    if (!session.school_id) return;
    setLoading(true);
    setAnnouncements(await fetchAnnouncements(session.school_id));
    setLoading(false);
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
      school_id:          session.school_id!,
      admin_id:           session.admin_id,
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
    await toggleAnnouncementPinned(a.id, session.school_id!, !a.pinned);
    await reload(); setTogglingId(null);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    await deleteAnnouncement(deleteTarget.id, session.school_id!);
    setDeleting(false); setDeleteTarget(null);
    reload(); showToast('Announcement deleted.');
  }

  const pinned   = announcements.filter(a => a.pinned);
  const unpinned = announcements.filter(a => !a.pinned);

  return (
    <div className="p-5 md:p-8 max-w-5xl w-full">

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.22 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2.5 bg-slate-900 text-white text-sm font-bold px-5 py-3 rounded-2xl shadow-xl">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />{toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Announcements</p>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Announcements</h1>
        </div>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={() => { setModal(true); setFormError(''); setForm(emptyForm); }}
          className="flex items-center gap-2 bg-slate-900 text-white text-sm font-black px-4 py-2.5 rounded-xl hover:bg-slate-700 transition-colors">
          <Plus className="w-4 h-4" /> Post Announcement
        </motion.button>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
            className="w-5 h-5 border-2 border-slate-200 border-t-slate-700 rounded-full" />
        </div>
      ) : announcements.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Megaphone className="w-10 h-10 text-slate-200 mb-4" />
          <p className="text-sm font-bold text-slate-400">No announcements yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {pinned.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Pin className="w-3.5 h-3.5 text-amber-500" />
                <p className="text-xs font-black uppercase tracking-widest text-slate-400">Pinned</p>
              </div>
              <div className="space-y-2">
                {pinned.map((a, i) => (
                  <AdminAnnouncementCard key={a.id} a={a} i={i} subjects={subjects}
                    toggling={togglingId === a.id}
                    onPin={() => handleTogglePin(a)} onDelete={() => setDeleteTarget(a)} />
                ))}
              </div>
            </div>
          )}
          {unpinned.length > 0 && (
            <div>
              {pinned.length > 0 && <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Recent</p>}
              <div className="space-y-2">
                {unpinned.map((a, i) => (
                  <AdminAnnouncementCard key={a.id} a={a} i={i} subjects={subjects}
                    toggling={togglingId === a.id}
                    onPin={() => handleTogglePin(a)} onDelete={() => setDeleteTarget(a)} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

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

              <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
                <h2 className="text-base font-black text-slate-900">Post Announcement</h2>
                <button onClick={() => setModal(false)} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Title *</label>
                  <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    placeholder="e.g. Term 2 starts Monday"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900" />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                    Message <span className="normal-case font-bold text-slate-300">(optional)</span>
                  </label>
                  <textarea value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
                    rows={3} placeholder="Additional details…"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 resize-none" />
                </div>

                <AudienceSelector
                  form={form} setForm={setForm}
                  subjects={subjects} cohorts={cohorts} allStudents={allStudents}
                  toggle={toggle}
                />

                <button onClick={() => setForm(f => ({ ...f, pinned: !f.pinned }))}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-sm font-black transition-all ${
                    form.pinned ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                  }`}>
                  <Pin className="w-4 h-4" />
                  {form.pinned ? 'Pinned — stays at top' : 'Pin this announcement'}
                </button>

                {formError && <p className="text-sm font-bold text-red-500">{formError}</p>}
              </div>

              <div className="sticky bottom-0 bg-white border-t border-slate-100 px-6 py-4 rounded-b-2xl flex gap-2">
                <button onClick={() => setModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-black text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
                <button onClick={handleCreate} disabled={saving}
                  className="flex-1 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-black hover:bg-slate-700 transition-colors disabled:opacity-50">
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
              <h2 className="text-base font-black text-slate-900 mb-1">Delete announcement?</h2>
              <p className="text-sm text-slate-500 mb-5"><strong>"{deleteTarget.title}"</strong> will be permanently removed.</p>
              <div className="flex gap-2">
                <button onClick={() => setDeleteTarget(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-black text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
                <button onClick={handleDelete} disabled={deleting}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-sm font-black hover:bg-red-700 transition-colors disabled:opacity-50">
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

function AdminAnnouncementCard({ a, i, subjects, toggling, onPin, onDelete }: {
  a: Announcement; i: number; subjects: Subject[];
  toggling: boolean; onPin: () => void; onDelete: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const audience = audienceSummary(a, subjects);

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.04, duration: 0.18 }}
      className={`bg-white rounded-2xl border px-5 py-4 ${a.pinned ? 'border-amber-200' : 'border-slate-200'}`}>
      <div className="flex items-start gap-3">
        {a.pinned && <Pin className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-black text-slate-900">{a.title}</p>
          {a.body && (
            <>
              <p className={`text-xs text-slate-500 mt-1 leading-relaxed ${!expanded ? 'line-clamp-2' : ''}`}>{a.body}</p>
              {a.body.length > 120 && (
                <button onClick={() => setExpanded(e => !e)}
                  className="text-[11px] font-black text-slate-400 hover:text-slate-600 mt-0.5 transition-colors">
                  {expanded ? 'Show less' : 'Show more'}
                </button>
              )}
            </>
          )}
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <p className="text-[10px] text-slate-300">
              {a.author_name} {a.author_surname}
              {a.author_role === 'teacher' && <span className="ml-1 text-slate-400 font-bold">(Teacher)</span>}
              {' · '}{timeAgo(a.created_at)}
            </p>
            {a.target_type !== 'all' && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">{audience}</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button onClick={onPin} disabled={toggling}
            className={`p-2 rounded-xl transition-colors disabled:opacity-40 ${a.pinned ? 'text-amber-500 hover:bg-amber-50' : 'text-slate-300 hover:text-amber-500 hover:bg-amber-50'}`}
            title={a.pinned ? 'Unpin' : 'Pin'}>
            {a.pinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
          </button>
          <button onClick={onDelete}
            className="p-2 rounded-xl text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
