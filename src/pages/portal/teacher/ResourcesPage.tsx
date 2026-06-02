import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus, X, Paperclip, Link2, FileText, Trash2,
  Users, GraduationCap, BookOpen, User, ExternalLink,
  FolderOpen, CheckCircle2,
} from 'lucide-react';
import {
  fetchTeacherResources, createResource, deleteResource, getResourceDownloadUrl,
  RESOURCE_TYPE_META,
  type Resource, type ResourceType, type TargetType,
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

interface Cohort { id: number; name: string; grade: number; }

interface ResourcesPageProps {
  session: TeacherSession;
}

export default function ResourcesPage({ session }: ResourcesPageProps) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
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
  const [engagement,    setEngagement]    = useState<Map<number, ResourceEngagement>>(new Map());
  const [effectiveness, setEffectiveness] = useState<Map<number, ResourceEffectiveness>>(new Map());
  const fileRef = useRef<HTMLInputElement>(null);

  const emptyForm = {
    resource_type: 'file' as ResourceType,
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

  // Group resources by type
  const byType = {
    file: resources.filter(r => r.resource_type === 'file'),
    link: resources.filter(r => r.resource_type === 'link'),
    note: resources.filter(r => r.resource_type === 'note'),
  };

  const TypeIcon = { file: Paperclip, link: Link2, note: FileText };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 pb-24 md:pb-8">

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

      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-stone-400 mb-1">Resources</p>
          <h1 className="text-2xl font-black text-brand-dark tracking-tight">Class Resources</h1>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={() => { setCreateModal(true); setFormError(''); setForm(emptyForm); setAttachmentFile(null); }}
          className="flex items-center gap-2 bg-brand-dark text-white text-sm font-black px-4 py-2.5 rounded-xl hover:bg-stone-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Resource
        </motion.button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
            className="w-5 h-5 border-2 border-stone-200 border-t-stone-700 rounded-full" />
        </div>
      ) : resources.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <FolderOpen className="w-10 h-10 text-stone-200 mb-4" />
          <p className="text-sm font-bold text-stone-400">No resources yet.</p>
          <p className="text-xs text-stone-300 mt-1">Add files, links or notes for your students.</p>
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
                <div className="flex items-center gap-2 mb-3">
                  <span className={`w-2 h-2 rounded-full ${meta.dot}`} />
                  <p className="text-xs font-black uppercase tracking-widest text-stone-400">{meta.label}s</p>
                </div>
                <div className="space-y-2">
                  {list.map((r, i) => (
                    <motion.div
                      key={r.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="bg-white rounded-2xl border border-stone-200 px-5 py-4 flex items-start gap-4"
                    >
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${meta.badge}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <p className="text-sm font-bold text-brand-dark">{r.title}</p>
                          {r.subject_label && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-500">{r.subject_label}</span>
                          )}
                        </div>
                        {r.description && <p className="text-xs text-stone-400 mb-1">{r.description}</p>}
                        {r.resource_type === 'note' && r.note_content && (
                          <p className="text-xs text-stone-600 bg-amber-50 rounded-xl px-3 py-2 mt-1 leading-relaxed border border-amber-100">{r.note_content}</p>
                        )}
                        {r.resource_type === 'link' && r.link_url && (
                          <p className="text-xs text-violet-500 truncate mt-0.5">{r.link_url}</p>
                        )}
                        {r.resource_type === 'file' && r.file_name && (
                          <p className="text-xs text-stone-400 mt-0.5">{r.file_name}</p>
                        )}
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <p className="text-[10px] text-stone-300">{formatDate(r.created_at)}</p>
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
                                {positive ? '+' : ''}{eff.avgImprovement}% avg gain
                              </span>
                            );
                          })()}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {(r.resource_type === 'file' || r.resource_type === 'link') && (
                          <button onClick={() => handleOpen(r)} disabled={downloading === r.id}
                            className="p-2 rounded-xl hover:bg-stone-100 transition-colors text-stone-400 hover:text-stone-700 disabled:opacity-40">
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        )}
                        <button onClick={() => setDeleteTarget(r)}
                          className="p-2 rounded-xl hover:bg-red-50 transition-colors text-stone-300 hover:text-red-500">
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

              <div className="sticky top-0 bg-white border-b border-stone-100 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
                <h2 className="text-base font-black text-brand-dark">Add Resource</h2>
                <button onClick={() => setCreateModal(false)} className="p-1.5 rounded-lg hover:bg-stone-100 transition-colors">
                  <X className="w-4 h-4 text-stone-500" />
                </button>
              </div>

              <div className="p-6 space-y-5">
                {/* Type */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-stone-400 mb-2">Type</label>
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

                {/* Title */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-stone-400 mb-2">Title *</label>
                  <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    placeholder="e.g. Chapter 3 Notes"
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm font-bold text-brand-dark placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-brand-dark" />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-stone-400 mb-2">Description <span className="normal-case font-bold text-stone-300">(optional)</span></label>
                  <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="Brief description…"
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm text-stone-700 placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-brand-dark" />
                </div>

                {/* Subject tag */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-stone-400 mb-2">Subject <span className="normal-case font-bold text-stone-300">(optional)</span></label>
                  <select value={form.subject_id} onChange={e => setForm(f => ({ ...f, subject_id: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm font-bold text-stone-700 focus:outline-none focus:ring-2 focus:ring-brand-dark bg-white">
                    <option value="">No subject tag</option>
                    {subjects.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                  </select>
                </div>

                {/* Type-specific input */}
                {form.resource_type === 'file' && (
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-stone-400 mb-2">File *</label>
                    {attachmentFile ? (
                      <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-xl border border-blue-100">
                        <Paperclip className="w-4 h-4 text-blue-500 shrink-0" />
                        <span className="text-sm font-bold text-blue-700 flex-1 truncate">{attachmentFile.name}</span>
                        <button onClick={() => { setAttachmentFile(null); if (fileRef.current) fileRef.current.value = ''; }}
                          className="text-red-400 hover:text-red-600 transition-colors"><X className="w-3.5 h-3.5" /></button>
                      </div>
                    ) : (
                      <button onClick={() => fileRef.current?.click()}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-stone-200 text-sm font-bold text-stone-400 hover:border-stone-400 hover:text-stone-600 transition-colors">
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
                    <label className="block text-xs font-black uppercase tracking-widest text-stone-400 mb-2">URL *</label>
                    <input value={form.link_url} onChange={e => setForm(f => ({ ...f, link_url: e.target.value }))}
                      placeholder="https://youtube.com/..."
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm font-bold text-brand-dark placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-brand-dark" />
                  </div>
                )}

                {form.resource_type === 'note' && (
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-stone-400 mb-2">Note *</label>
                    <textarea value={form.note_content} onChange={e => setForm(f => ({ ...f, note_content: e.target.value }))}
                      rows={4} placeholder="Write your note here…"
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm text-stone-700 placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-brand-dark resize-none" />
                  </div>
                )}

                {/* Audience */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-stone-400 mb-2">Who sees this?</label>
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
                        <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-1.5">Subject *</p>
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
                        <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-1.5">Grade *</p>
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
                    <div className="space-y-1 max-h-36 overflow-y-auto border border-stone-100 rounded-xl p-2">
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

              <div className="sticky bottom-0 bg-white border-t border-stone-100 px-6 py-4 rounded-b-2xl flex gap-2">
                <button onClick={() => setCreateModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-stone-200 text-sm font-black text-stone-600 hover:bg-stone-50 transition-colors">Cancel</button>
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
                  className="flex-1 py-2.5 rounded-xl border border-stone-200 text-sm font-black text-stone-600 hover:bg-stone-50 transition-colors">Cancel</button>
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
