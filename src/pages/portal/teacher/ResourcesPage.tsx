import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus, X, Paperclip, Link2, FileText, Trash2,
  Users, GraduationCap, BookOpen, User, ExternalLink,
  FolderOpen, CheckCircle2,
} from 'lucide-react';
import { Shimmer } from '../../../shared/components/Shimmer';
import {
  fetchTeacherResources, createResource, deleteResource, getResourceDownloadUrl,
  RESOURCE_TYPE_META, RESOURCE_CATEGORY_META,
  type Resource, type ResourceType, type TargetType, type ResourceCategory,
} from '../../../lib/resources';
import { fetchSubjects, type Subject } from '../../../lib/students';
import { supabaseAdmin } from '../../../lib/supabase';
import type { TeacherSession } from '../../../lib/auth';
import {
  fetchResourceEngagement, fetchResourceEffectiveness,
  type ResourceEngagement, type ResourceEffectiveness,
} from '../../../lib/teacherAnalytics';

const GRADES = [8, 9, 10, 11, 12];

function formatDate(s: string) {
  return new Date(s).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });
}

const ease = [0.23, 1, 0.32, 1] as [number, number, number, number];

interface Cohort { id: number; name: string; grade: number; }

interface ResourcesPageProps {
  session: TeacherSession;
}

export default function ResourcesPage({ session }: ResourcesPageProps) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [allStudents, setAllStudents] = useState<{ id: number; name: string; surname: string }[]>([]);
  const [createModal, setCreateModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Resource | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [downloading, setDownloading] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<ResourceCategory | 'all'>('all');
  const [engagement,    setEngagement]    = useState<Map<number, ResourceEngagement>>(new Map());
  const [effectiveness, setEffectiveness] = useState<Map<number, ResourceEffectiveness>>(new Map());
  const fileRef = useRef<HTMLInputElement>(null);

  const emptyForm = {
    resource_type: 'file' as ResourceType,
    category: 'general' as ResourceCategory,
    title: '',
    description: '',
    subject_id: '',
    link_url: '',
    note_content: '',
    target_type: 'all' as TargetType,
    target_grades: [] as number[],
    target_cohort_ids: [] as number[],
    target_subject_ids: [] as number[],
    target_student_ids: [] as number[],
  };
  const [form, setForm] = useState(emptyForm);
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);

  useEffect(() => {
    fetchSubjects().then(setSubjects);
    supabaseAdmin.from('cohorts').select('id, name, grade')
      .eq('school_id', session.school_id).order('grade').order('name')
      .then(({ data }) => setCohorts(data ?? []));
    supabaseAdmin.from('students').select('id, name, surname')
      .eq('school_id', session.school_id).order('surname')
      .then(({ data }) => setAllStudents(data ?? []));
    reload();
  }, []);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  async function reload() {
    setLoading(true);
    const r = await fetchTeacherResources(session.teacher_id, session.school_id);
    setResources(r);
    setLoading(false);
    // Non-blocking engagement + effectiveness fetch
    if (r.length > 0) {
      const ids = r.map(res => res.id);
      fetchResourceEngagement(ids).then(setEngagement);
      fetchResourceEffectiveness(session.school_id, ids).then(setEffectiveness);
    }
  }

  function toggle<T>(arr: T[], val: T): T[] {
    return arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val];
  }

  async function handleCreate() {
    if (!form.title.trim()) { setFormError('Title is required.'); return; }
    if (form.resource_type === 'file' && !attachmentFile) { setFormError('Please attach a file.'); return; }
    if (form.resource_type === 'link' && !form.link_url.trim()) { setFormError('Please enter a URL.'); return; }
    if (form.resource_type === 'note' && !form.note_content.trim()) { setFormError('Please write a note.'); return; }
    if (form.target_type === 'grade' && form.target_grades.length === 0) { setFormError('Select at least one grade.'); return; }
    if (form.target_type === 'class' && form.target_cohort_ids.length === 0) { setFormError('Select at least one class.'); return; }
    if (form.target_type === 'subject' && form.target_subject_ids.length === 0) { setFormError('Select at least one subject.'); return; }
    if (form.target_type === 'subject' && form.target_grades.length === 0) { setFormError('Select at least one grade for the subject.'); return; }
    if (form.target_type === 'specific' && form.target_student_ids.length === 0) { setFormError('Select at least one student.'); return; }

    setSaving(true);
    setFormError('');
    const result = await createResource({
      school_id: session.school_id,
      teacher_id: session.teacher_id,
      subject_id: form.subject_id ? Number(form.subject_id) : undefined,
      title: form.title,
      description: form.description,
      resource_type: form.resource_type,
      category: form.category,
      file: attachmentFile ?? undefined,
      link_url: form.link_url,
      note_content: form.note_content,
      target_type: form.target_type,
      target_grades: form.target_grades,
      target_cohort_ids: form.target_cohort_ids,
      target_subject_ids: form.target_subject_ids,
      target_student_ids: form.target_student_ids,
    });

    setSaving(false);
    if (!result.success) { setFormError(result.error); return; }
    setCreateModal(false);
    setForm(emptyForm);
    setAttachmentFile(null);
    reload();
    showToast('Resource added successfully.');
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    await deleteResource(deleteTarget.id, session.school_id, deleteTarget.file_url);
    setDeleting(false);
    setDeleteTarget(null);
    reload();
    showToast('Resource deleted.');
  }

  async function handleOpen(r: Resource) {
    if (r.resource_type === 'link' && r.link_url) {
      window.open(r.link_url.startsWith('http') ? r.link_url : `https://${r.link_url}`, '_blank');
    } else if (r.resource_type === 'file' && r.file_url) {
      setDownloading(r.id);
      const url = await getResourceDownloadUrl(r.file_url);
      setDownloading(null);
      if (url) window.open(url, '_blank');
    }
  }

  // Filter by category, then group by type
  const categoryFiltered = filterCategory === 'all'
    ? resources
    : resources.filter(r => r.category === filterCategory);

  const byType = {
    file: categoryFiltered.filter(r => r.resource_type === 'file'),
    link: categoryFiltered.filter(r => r.resource_type === 'link'),
    note: categoryFiltered.filter(r => r.resource_type === 'note'),
  };

  const TypeIcon = { file: Paperclip, link: Link2, note: FileText };

  return (
    <div className="student-home min-h-full pb-16">

      {/* ── Toast ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.22 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-100 flex items-center gap-2.5 bg-brand-dark text-white text-sm font-bold px-5 py-3 rounded-2xl shadow-xl"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ Hero — full-width crested banner ═══════════════════════ */}
      <div className="relative overflow-hidden bg-brand-dark border-b border-brand-border grain-surface flex flex-col justify-end min-h-[220px] sm:min-h-[260px] lg:min-h-[280px]">
        <div className="absolute inset-0 pointer-events-none">
          <motion.img src="/images/nizamiye-resources.png" alt=""
            onLoad={() => setImgLoaded(true)}
            initial={{ opacity: 0 }} animate={{ opacity: imgLoaded ? 0.62 : 0 }}
            transition={{ duration: 0.6, ease }}
            className="w-full h-full object-cover" />
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(100deg, rgba(21,23,28,0.82) 0%, rgba(21,23,28,0.62) 35%, rgba(21,23,28,0.3) 62%, rgba(21,23,28,0.66) 100%)' }} />
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(180deg, rgba(21,23,28,0.05) 0%, transparent 35%, rgba(21,23,28,0.75) 100%)' }} />
        </div>
        <div className="absolute -bottom-32 -left-24 w-[24rem] h-[24rem] rounded-full blur-3xl opacity-[0.08] pointer-events-none"
          style={{ background: 'radial-gradient(circle, var(--color-accent), transparent 70%)' }} />

        <div className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-8 sm:pt-11 pb-8 sm:pb-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="flex flex-wrap items-end justify-between gap-4"
          >
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-white/45">Resources</p>
              <h1 className="font-display font-extrabold text-white text-[28px] sm:text-[36px] mt-2 leading-[1.1]" style={{ letterSpacing: '-0.02em', textShadow: '0 2px 20px rgba(0,0,0,0.35)' }}>
                Class Resources
              </h1>
              <p className="text-[13px] text-white/60 mt-2.5 font-medium">
                Files, links and notes shared with your students.
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => { setCreateModal(true); setFormError(''); setForm(emptyForm); setAttachmentFile(null); }}
              className="shrink-0 flex items-center gap-2 text-white text-sm font-black px-4 py-2.5 rounded border border-white/15 bg-white/[0.05] hover:bg-white/[0.1] transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Resource
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* ═══ Body ═════════════════════════════════════════════════ */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 relative z-10 space-y-5 sm:space-y-6 pt-6 sm:pt-8">

      {!loading && resources.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {(['all', 'homework', 'notes', 'general'] as (ResourceCategory | 'all')[]).map(c => (
            <button key={c} onClick={() => setFilterCategory(c)}
              className={`px-3.5 py-1.5 rounded text-[12px] font-bold transition-colors ${filterCategory === c ? 'text-white' : 'text-stone-600 hover:text-stone-800'}`}
              style={filterCategory === c ? { background: 'var(--color-accent)' } : { background: 'var(--color-paper-raise)' }}>
              {c === 'all' ? 'All Tags' : RESOURCE_CATEGORY_META[c].label}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="space-y-2.5">
          {[0, 1, 2, 3].map(i => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.05, ease }}
              className="paper-card rounded p-4 flex items-center gap-3"
            >
              <Shimmer className="w-9 h-9 rounded shrink-0" />
              <div className="flex-1 space-y-2">
                <Shimmer className="h-4" style={{ width: `${55 - i * 6}%` }} />
                <Shimmer className="h-3 w-1/3" />
              </div>
            </motion.div>
          ))}
        </div>
      ) : resources.length === 0 ? (
        <div className="paper-card rounded p-5 sm:p-7 flex flex-col items-center justify-center py-20 text-center">
          <FolderOpen className="w-9 h-9 text-stone-200 mb-4" />
          <p className="text-[16px] font-semibold text-brand-dark">No resources yet.</p>
          <p className="text-[13px] text-[rgba(31,36,33,0.4)] mt-1">Add files, links or notes for your students.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {(['file', 'link', 'note'] as ResourceType[]).map(type => {
            const list = byType[type];
            if (list.length === 0) return null;
            const meta = RESOURCE_TYPE_META[type];
            const Icon = TypeIcon[type];
            return (
              <div key={type}>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-stone-500 mb-3">{meta.label}s</p>
                <div className="space-y-2.5">
                  {list.map((r, i) => (
                    <motion.div
                      key={r.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="paper-card rounded px-5 py-4 flex items-start gap-4"
                    >
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${meta.badge}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <p className="text-sm font-bold text-brand-dark">{r.title}</p>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${RESOURCE_CATEGORY_META[r.category].badge}`}>
                            {RESOURCE_CATEGORY_META[r.category].label}
                          </span>
                          {r.subject_label && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-500">{r.subject_label}</span>
                          )}
                        </div>
                        {r.description && <p className="text-xs text-stone-500 mb-1">{r.description}</p>}
                        {r.resource_type === 'note' && r.note_content && (
                          <p className="text-xs text-stone-600 bg-amber-50 rounded-xl px-3 py-2 mt-1 leading-relaxed border border-amber-100">{r.note_content}</p>
                        )}
                        {r.resource_type === 'link' && r.link_url && (
                          <p className="text-xs text-violet-500 truncate mt-0.5">{r.link_url}</p>
                        )}
                        {r.resource_type === 'file' && r.file_name && (
                          <p className="text-xs text-stone-500 mt-0.5">{r.file_name}</p>
                        )}
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <p className="text-[10px] text-stone-400">{formatDate(r.created_at)}</p>
                          {(() => {
                            const eng = engagement.get(r.id);
                            if (!eng || eng.viewers === 0) return null;
                            return (
                              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                                eng.viewers >= 20 ? 'bg-emerald-50 text-emerald-600' :
                                eng.viewers >= 5  ? 'bg-blue-50 text-blue-600' :
                                                    'bg-stone-100 text-stone-500'
                              }`}>
                                {eng.viewers} viewer{eng.viewers !== 1 ? 's' : ''}
                              </span>
                            );
                          })()}
                          {(() => {
                            const eff = effectiveness.get(r.id);
                            if (!eff || eff.avgImprovement === null) return null;
                            const positive = eff.avgImprovement > 0;
                            return (
                              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                                positive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'
                              }`}>
                                {positive ? '+' : ''}{eff.avgImprovement}% avg gain · n={eff.downloaders}
                              </span>
                            );
                          })()}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {(r.resource_type === 'file' || r.resource_type === 'link') && (
                          <button onClick={() => handleOpen(r)} disabled={downloading === r.id}
                            className="p-2 rounded-xl hover:bg-stone-100 transition-colors text-stone-500 hover:text-stone-700 disabled:opacity-40">
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        )}
                        <button onClick={() => setDeleteTarget(r)}
                          className="p-2 rounded-xl hover:bg-red-50 transition-colors text-stone-400 hover:text-red-500">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
      </div>

      {/* ── Create Modal ──────────────────────────────────────── */}
      <AnimatePresence>
        {createModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => setCreateModal(false)}>
            <motion.div initial={{ scale: 0.95, y: 12, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.95, y: 8, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}>

              <div className="sticky top-0 bg-white border-b border-brand-border/60 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
                <h2 className="text-base font-black text-brand-dark">Add Resource</h2>
                <button onClick={() => setCreateModal(false)} aria-label="Close" className="p-1.5 rounded-lg hover:bg-stone-100 transition-colors">
                  <X className="w-4 h-4 text-stone-500" />
                </button>
              </div>

              <div className="p-6 space-y-5">
                {/* Type */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-2">Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['file', 'link', 'note'] as ResourceType[]).map(t => {
                      const m = RESOURCE_TYPE_META[t];
                      const Icon = TypeIcon[t];
                      const active = form.resource_type === t;
                      return (
                        <button key={t} onClick={() => setForm(f => ({ ...f, resource_type: t }))}
                          className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-black transition-all ${active ? 'bg-brand-dark text-white' : 'bg-stone-100 text-stone-500 hover:bg-stone-200'}`}>
                          <Icon className="w-4 h-4 shrink-0" />
                          {m.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Category tag */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-2">Tag</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['homework', 'notes', 'general'] as ResourceCategory[]).map(c => {
                      const m = RESOURCE_CATEGORY_META[c];
                      const active = form.category === c;
                      return (
                        <button key={c} onClick={() => setForm(f => ({ ...f, category: c }))}
                          className={`px-3 py-2.5 rounded-xl text-sm font-black transition-all ${active ? 'bg-brand-dark text-white' : 'bg-stone-100 text-stone-500 hover:bg-stone-200'}`}>
                          {m.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-2">Title *</label>
                  <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    placeholder="e.g. Chapter 3 Notes"
                    className="w-full px-3 py-2.5 rounded-xl border border-brand-border text-sm font-bold text-brand-dark placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-dark" />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-2">Description <span className="normal-case font-bold text-stone-400">(optional)</span></label>
                  <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="Brief description…"
                    className="w-full px-3 py-2.5 rounded-xl border border-brand-border text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-dark" />
                </div>

                {/* Subject tag */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-2">Subject <span className="normal-case font-bold text-stone-400">(optional)</span></label>
                  <select value={form.subject_id} onChange={e => setForm(f => ({ ...f, subject_id: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-brand-border text-sm font-bold text-stone-700 focus:outline-none focus:ring-2 focus:ring-brand-dark bg-white">
                    <option value="">No subject tag</option>
                    {subjects.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                  </select>
                </div>

                {/* Type-specific input */}
                {form.resource_type === 'file' && (
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-2">File *</label>
                    {attachmentFile ? (
                      <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-xl border border-blue-100">
                        <Paperclip className="w-4 h-4 text-blue-500 shrink-0" />
                        <span className="text-sm font-bold text-blue-700 flex-1 truncate">{attachmentFile.name}</span>
                        <button onClick={() => { setAttachmentFile(null); if (fileRef.current) fileRef.current.value = ''; }}
                          className="text-red-400 hover:text-red-600 transition-colors"><X className="w-3.5 h-3.5" /></button>
                      </div>
                    ) : (
                      <button onClick={() => fileRef.current?.click()}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-brand-border text-sm font-bold text-stone-500 hover:border-stone-400 hover:text-stone-600 transition-colors">
                        <Paperclip className="w-4 h-4" /> Attach file
                      </button>
                    )}
                    <input ref={fileRef} type="file" className="hidden"
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.png,.jpg,.jpeg,.mp4"
                      onChange={e => { const f = e.target.files?.[0]; if (f) setAttachmentFile(f); }} />
                  </div>
                )}

                {form.resource_type === 'link' && (
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-2">URL *</label>
                    <input value={form.link_url} onChange={e => setForm(f => ({ ...f, link_url: e.target.value }))}
                      placeholder="https://youtube.com/..."
                      className="w-full px-3 py-2.5 rounded-xl border border-brand-border text-sm font-bold text-brand-dark placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-dark" />
                  </div>
                )}

                {form.resource_type === 'note' && (
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-2">Note *</label>
                    <textarea value={form.note_content} onChange={e => setForm(f => ({ ...f, note_content: e.target.value }))}
                      rows={4} placeholder="Write your note here…"
                      className="w-full px-3 py-2.5 rounded-xl border border-brand-border text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-dark resize-none" />
                  </div>
                )}

                {/* Audience */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-2">Who sees this?</label>
                  <div className="grid grid-cols-2 gap-1.5 mb-3">
                    {([
                      { value: 'all', label: 'Everyone', icon: Users },
                      { value: 'grade', label: 'By Grade', icon: GraduationCap },
                      { value: 'class', label: 'By Class', icon: BookOpen },
                      { value: 'subject', label: 'By Subject', icon: BookOpen },
                      { value: 'specific', label: 'Specific Students', icon: User },
                    ] as { value: TargetType; label: string; icon: any }[]).map(opt => {
                      const Icon = opt.icon;
                      const active = form.target_type === opt.value;
                      return (
                        <button key={opt.value}
                          onClick={() => setForm(f => ({ ...f, target_type: opt.value, target_grades: [], target_cohort_ids: [], target_subject_ids: [], target_student_ids: [] }))}
                          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-black transition-all ${active ? 'bg-brand-dark text-white' : 'bg-stone-100 text-stone-500 hover:bg-stone-200'}`}>
                          <Icon className="w-3.5 h-3.5 shrink-0" />{opt.label}
                        </button>
                      );
                    })}
                  </div>

                  {form.target_type === 'grade' && (
                    <div className="flex flex-wrap gap-1.5">
                      {GRADES.map(g => (
                        <button key={g} onClick={() => setForm(f => ({ ...f, target_grades: toggle(f.target_grades, g) }))}
                          className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${form.target_grades.includes(g) ? 'bg-brand-dark text-white' : 'bg-stone-100 text-stone-500 hover:bg-stone-200'}`}>
                          Grade {g}
                        </button>
                      ))}
                    </div>
                  )}
                  {form.target_type === 'class' && (
                    <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto">
                      {cohorts.map(c => (
                        <button key={c.id} onClick={() => setForm(f => ({ ...f, target_cohort_ids: toggle(f.target_cohort_ids, c.id) }))}
                          className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${form.target_cohort_ids.includes(c.id) ? 'bg-brand-dark text-white' : 'bg-stone-100 text-stone-500 hover:bg-stone-200'}`}>
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
                              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${form.target_subject_ids.includes(s.id) ? 'bg-brand-dark text-white' : 'bg-stone-100 text-stone-500 hover:bg-stone-200'}`}>
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
                              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${form.target_grades.includes(g) ? 'bg-brand-dark text-white' : 'bg-stone-100 text-stone-500 hover:bg-stone-200'}`}>
                              Grade {g}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  {form.target_type === 'specific' && (
                    <div className="space-y-1 max-h-36 overflow-y-auto border border-brand-border/60 rounded-xl p-2">
                      {allStudents.map(s => {
                        const active = form.target_student_ids.includes(s.id);
                        return (
                          <button key={s.id} onClick={() => setForm(f => ({ ...f, target_student_ids: toggle(f.target_student_ids, s.id) }))}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-left transition-all ${active ? 'bg-brand-dark text-white' : 'hover:bg-stone-100 text-stone-700'}`}>
                            <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 text-[10px] font-black ${active ? 'bg-white border-white text-brand-dark' : 'border-stone-300'}`}>{active ? '✓' : ''}</span>
                            {s.surname}, {s.name}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {formError && <p className="text-sm font-bold text-red-500">{formError}</p>}
              </div>

              <div className="sticky bottom-0 bg-white border-t border-brand-border/60 px-6 py-4 rounded-b-2xl flex gap-2">
                <button onClick={() => setCreateModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-brand-border text-sm font-black text-stone-600 hover:bg-stone-50 transition-colors">Cancel</button>
                <button onClick={handleCreate} disabled={saving}
                  className="flex-1 py-2.5 rounded-xl bg-brand-dark text-white text-sm font-black hover:bg-stone-700 transition-colors disabled:opacity-50">
                  {saving ? 'Saving…' : 'Add Resource'}
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
            <motion.div initial={{ scale: 0.95, y: 12, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.95, y: 8, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6"
              onClick={e => e.stopPropagation()}>
              <h2 className="text-base font-black text-brand-dark mb-1">Delete resource?</h2>
              <p className="text-sm text-stone-500 mb-5"><strong>{deleteTarget.title}</strong> will be permanently removed.</p>
              <div className="flex gap-2">
                <button onClick={() => setDeleteTarget(null)}
                  className="flex-1 py-2.5 rounded-xl border border-brand-border text-sm font-black text-stone-600 hover:bg-stone-50 transition-colors">Cancel</button>
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
