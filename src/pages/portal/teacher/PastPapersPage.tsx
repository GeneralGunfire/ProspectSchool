import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus, X, Trash2, FileText, ExternalLink, FolderOpen, CheckCircle2, Paperclip,
} from 'lucide-react';
import {
  fetchTeacherPastPapers, createPastPaper, deletePastPaper, getPastPaperDownloadUrl,
  type PastPaper,
} from '../../../lib/pastPapers';
import { fetchSubjects, type Subject } from '../../../lib/students';
import type { TeacherSession } from '../../../lib/auth';

const GRADES = [8, 9, 10, 11, 12];
const TERMS  = [1, 2, 3, 4];
const CURRENT_YEAR = new Date().getFullYear();
const YEARS  = Array.from({ length: 10 }, (_, i) => CURRENT_YEAR - i);

function formatDate(s: string) {
  return new Date(s).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });
}

interface PastPapersPageProps { session: TeacherSession; }

const emptyForm = {
  title: '',
  subject_id: '',
  grade: '',
  year: String(CURRENT_YEAR),
  term: '',
  paper_number: '1',
};

export default function PastPapersPage({ session }: PastPapersPageProps) {
  const [papers, setPapers]       = useState<PastPaper[]>([]);
  const [loading, setLoading]     = useState(true);
  const [subjects, setSubjects]   = useState<Subject[]>([]);
  const [modal, setModal]         = useState(false);
  const [form, setForm]           = useState(emptyForm);
  const [file, setFile]           = useState<File | null>(null);
  const [saving, setSaving]       = useState(false);
  const [formError, setFormError] = useState('');
  const [toast, setToast]         = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PastPaper | null>(null);
  const [deleting, setDeleting]   = useState(false);
  const [downloading, setDownloading] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchSubjects().then(setSubjects);
    reload();
  }, []);

  async function reload() {
    setLoading(true);
    setPapers(await fetchTeacherPastPapers(session.teacher_id, session.school_id));
    setLoading(false);
  }

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  async function handleCreate() {
    if (!form.title.trim())   { setFormError('Title is required.'); return; }
    if (!form.subject_id)     { setFormError('Select a subject.'); return; }
    if (!form.grade)          { setFormError('Select a grade.'); return; }
    if (!form.year)           { setFormError('Select a year.'); return; }
    if (!file)                { setFormError('Please attach a file.'); return; }

    setSaving(true); setFormError('');
    const result = await createPastPaper({
      school_id:    session.school_id,
      teacher_id:   session.teacher_id,
      subject_id:   Number(form.subject_id),
      grade:        Number(form.grade),
      title:        form.title,
      year:         Number(form.year),
      term:         form.term ? Number(form.term) : undefined,
      paper_number: Number(form.paper_number) || 1,
      file,
    });
    setSaving(false);
    if (!result.success) { setFormError(result.error); return; }
    setModal(false);
    setForm(emptyForm);
    setFile(null);
    reload();
    showToast('Past paper uploaded.');
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    await deletePastPaper(deleteTarget.id, session.school_id, deleteTarget.file_url);
    setDeleting(false);
    setDeleteTarget(null);
    reload();
    showToast('Paper deleted.');
  }

  async function handleOpen(p: PastPaper) {
    setDownloading(p.id);
    const url = await getPastPaperDownloadUrl(p.file_url);
    setDownloading(null);
    if (url) window.open(url, '_blank');
  }

  // Group by subject
  const grouped = new Map<string, PastPaper[]>();
  for (const p of papers) {
    const key = p.subject_label ?? 'Unknown';
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(p);
  }

  return (
    <div className="px-6 py-8 sm:px-8 max-w-4xl">

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
          <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Past Papers</p>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Past Papers</h1>
        </div>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={() => { setModal(true); setFormError(''); setForm(emptyForm); setFile(null); }}
          className="flex items-center gap-2 bg-slate-900 text-white text-sm font-black px-4 py-2.5 rounded-xl hover:bg-slate-700 transition-colors">
          <Plus className="w-4 h-4" /> Upload Paper
        </motion.button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
            className="w-5 h-5 border-2 border-slate-200 border-t-slate-700 rounded-full" />
        </div>
      ) : papers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <FolderOpen className="w-10 h-10 text-slate-200 mb-4" />
          <p className="text-sm font-bold text-slate-400">No past papers yet.</p>
          <p className="text-xs text-slate-300 mt-1">Upload papers — students can browse and download them.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Array.from(grouped.entries()).map(([subject, list]) => (
            <div key={subject}>
              <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">{subject}</p>
              <div className="space-y-2">
                {list.map((p, i) => (
                  <motion.div key={p.id}
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="bg-white rounded-2xl border border-slate-200 px-5 py-4 flex items-center gap-4">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900">{p.title}</p>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                          Grade {p.grade}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                          {p.year}
                        </span>
                        {p.term && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                            Term {p.term}
                          </span>
                        )}
                        {p.paper_number > 1 && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                            Paper {p.paper_number}
                          </span>
                        )}
                        <span className="text-[10px] text-slate-300">{p.file_name}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => handleOpen(p)} disabled={downloading === p.id}
                        className="p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-700 disabled:opacity-40">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                      <button onClick={() => setDeleteTarget(p)}
                        className="p-2 rounded-xl hover:bg-red-50 transition-colors text-slate-300 hover:text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Upload Modal ──────────────────────────────────────── */}
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
                <h2 className="text-base font-black text-slate-900">Upload Past Paper</h2>
                <button onClick={() => setModal(false)} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>

              <div className="p-6 space-y-4">

                {/* Title */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Title *</label>
                  <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    placeholder="e.g. Mathematics P1 Final Exam"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900" />
                </div>

                {/* Subject + Grade row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Subject *</label>
                    <select value={form.subject_id} onChange={e => setForm(f => ({ ...f, subject_id: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white">
                      <option value="">Select…</option>
                      {subjects.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Grade *</label>
                    <select value={form.grade} onChange={e => setForm(f => ({ ...f, grade: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white">
                      <option value="">Select…</option>
                      {GRADES.map(g => <option key={g} value={g}>Grade {g}</option>)}
                    </select>
                  </div>
                </div>

                {/* Year + Term + Paper number row */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Year *</label>
                    <select value={form.year} onChange={e => setForm(f => ({ ...f, year: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white">
                      {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Term</label>
                    <select value={form.term} onChange={e => setForm(f => ({ ...f, term: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white">
                      <option value="">Any</option>
                      {TERMS.map(t => <option key={t} value={t}>Term {t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Paper #</label>
                    <select value={form.paper_number} onChange={e => setForm(f => ({ ...f, paper_number: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white">
                      {[1,2,3].map(n => <option key={n} value={n}>Paper {n}</option>)}
                    </select>
                  </div>
                </div>

                {/* File */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">File *</label>
                  {file ? (
                    <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-xl border border-blue-100">
                      <Paperclip className="w-4 h-4 text-blue-500 shrink-0" />
                      <span className="text-sm font-bold text-blue-700 flex-1 truncate">{file.name}</span>
                      <button onClick={() => { setFile(null); if (fileRef.current) fileRef.current.value = ''; }}
                        className="text-red-400 hover:text-red-600 transition-colors">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => fileRef.current?.click()}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-slate-200 text-sm font-bold text-slate-400 hover:border-slate-400 hover:text-slate-600 transition-colors">
                      <Paperclip className="w-4 h-4" /> Attach PDF or image
                    </button>
                  )}
                  <input ref={fileRef} type="file" className="hidden"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={e => { const f = e.target.files?.[0]; if (f) setFile(f); }} />
                </div>

                {formError && <p className="text-sm font-bold text-red-500">{formError}</p>}
              </div>

              <div className="sticky bottom-0 bg-white border-t border-slate-100 px-6 py-4 rounded-b-2xl flex gap-2">
                <button onClick={() => setModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-black text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
                <button onClick={handleCreate} disabled={saving}
                  className="flex-1 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-black hover:bg-slate-700 transition-colors disabled:opacity-50">
                  {saving ? 'Uploading…' : 'Upload'}
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
              <h2 className="text-base font-black text-slate-900 mb-1">Delete paper?</h2>
              <p className="text-sm text-slate-500 mb-5">
                <strong>{deleteTarget.title}</strong> will be permanently removed.
              </p>
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
