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
  const [memoFile, setMemoFile]   = useState<File | null>(null);
  const [saving, setSaving]       = useState(false);
  const [formError, setFormError] = useState('');
  const [toast, setToast]         = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PastPaper | null>(null);
  const [deleting, setDeleting]   = useState(false);
  const [downloading, setDownloading] = useState<number | null>(null);
  const fileRef     = useRef<HTMLInputElement>(null);
  const memoFileRef = useRef<HTMLInputElement>(null);

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

  function closeModal() {
    setModal(false);
    setForm(emptyForm);
    setFile(null);
    setMemoFile(null);
    setFormError('');
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
      memo:         memoFile ?? null,
    });
    setSaving(false);
    if (!result.success) { setFormError(result.error); return; }
    closeModal();
    reload();
    showToast('Past paper uploaded.');
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    await deletePastPaper(
      deleteTarget.id,
      session.school_id,
      deleteTarget.file_url,
      deleteTarget.memo_url,
    );
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
    <div className="max-w-3xl mx-auto px-4 py-6 sm:p-6 md:p-8">

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.22 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-100 flex items-center gap-2.5 bg-brand-dark text-white text-sm font-bold px-5 py-3 rounded-2xl shadow-xl"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />{toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="eyebrow">Past Papers</span>
          <h1 className="text-2xl font-black text-brand-dark tracking-tight">Past Papers</h1>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={() => { setModal(true); setFormError(''); setForm(emptyForm); setFile(null); setMemoFile(null); }}
          className="flex items-center gap-2 bg-brand-dark text-white text-sm font-black px-4 py-2.5 rounded-xl hover:bg-stone-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Upload Paper
        </motion.button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
            className="w-5 h-5 border-2 border-brand-border border-t-stone-700 rounded-full"
          />
        </div>
      ) : papers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <FolderOpen className="w-10 h-10 text-stone-200 mb-4" />
          <p className="text-sm font-bold text-stone-500">No past papers yet.</p>
          <p className="text-xs text-stone-400 mt-1">Upload papers — students can browse and download them.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Array.from(grouped.entries()).map(([subject, list]) => (
            <div key={subject}>
              <p className="text-xs font-black uppercase tracking-widest text-stone-500 mb-3">{subject}</p>
              <div className="space-y-2">
                {list.map((p, i) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="card-premium bg-white rounded-[24px] border border-brand-border px-5 py-4 flex items-center gap-4"
                  >
                    {/* Icon with memo dot */}
                    <div className="relative w-9 h-9 shrink-0">
                      <div className="w-9 h-9 rounded-xl bg-stone-100 flex items-center justify-center">
                        <FileText className="w-4 h-4 text-stone-600" />
                      </div>
                      {p.memo_url && (
                        <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-stone-900">{p.title}</p>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-500">
                          Grade {p.grade}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-500">
                          {p.year}
                        </span>
                        {p.term && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-500">
                            Term {p.term}
                          </span>
                        )}
                        {p.paper_number > 1 && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-500">
                            Paper {p.paper_number}
                          </span>
                        )}
                        {p.memo_url && (
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700">
                            Memo
                          </span>
                        )}
                        <span className="text-[10px] text-stone-400">{p.file_name}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleOpen(p)}
                        disabled={downloading === p.id}
                        className="p-2 rounded-xl hover:bg-stone-100 transition-colors text-stone-500 hover:text-stone-700 disabled:opacity-40"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(p)}
                        className="p-2 rounded-xl hover:bg-red-50 transition-colors text-stone-400 hover:text-red-500"
                      >
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
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.95, y: 12, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 8, opacity: 0 }} transition={{ duration: 0.2, ease: 'easeOut' }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b border-brand-border/60 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
                <h2 className="text-base font-black text-stone-900">Upload Past Paper</h2>
                <button onClick={closeModal} className="p-1.5 rounded-lg hover:bg-stone-100 transition-colors">
                  <X className="w-4 h-4 text-stone-500" />
                </button>
              </div>

              <div className="p-6 space-y-4">

                {/* Title */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-2">Title *</label>
                  <input
                    value={form.title}
                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    placeholder="e.g. Mathematics P1 Final Exam"
                    className="w-full px-3 py-2.5 rounded-xl border border-brand-border text-sm font-bold text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-dark/10 focus:border-brand-dark"
                  />
                </div>

                {/* Subject + Grade row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-2">Subject *</label>
                    <select
                      value={form.subject_id}
                      onChange={e => setForm(f => ({ ...f, subject_id: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-xl border border-brand-border text-sm font-bold text-stone-700 focus:outline-none focus:ring-2 focus:ring-brand-dark/10 focus:border-brand-dark bg-white"
                    >
                      <option value="">Select…</option>
                      {subjects.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-2">Grade *</label>
                    <select
                      value={form.grade}
                      onChange={e => setForm(f => ({ ...f, grade: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-xl border border-brand-border text-sm font-bold text-stone-700 focus:outline-none focus:ring-2 focus:ring-brand-dark/10 focus:border-brand-dark bg-white"
                    >
                      <option value="">Select…</option>
                      {GRADES.map(g => <option key={g} value={g}>Grade {g}</option>)}
                    </select>
                  </div>
                </div>

                {/* Year + Term + Paper number row */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-2">Year *</label>
                    <select
                      value={form.year}
                      onChange={e => setForm(f => ({ ...f, year: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-xl border border-brand-border text-sm font-bold text-stone-700 focus:outline-none focus:ring-2 focus:ring-brand-dark/10 focus:border-brand-dark bg-white"
                    >
                      {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-2">Term</label>
                    <select
                      value={form.term}
                      onChange={e => setForm(f => ({ ...f, term: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-xl border border-brand-border text-sm font-bold text-stone-700 focus:outline-none focus:ring-2 focus:ring-brand-dark/10 focus:border-brand-dark bg-white"
                    >
                      <option value="">Any</option>
                      {TERMS.map(t => <option key={t} value={t}>Term {t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-2">Paper #</label>
                    <select
                      value={form.paper_number}
                      onChange={e => setForm(f => ({ ...f, paper_number: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-xl border border-brand-border text-sm font-bold text-stone-700 focus:outline-none focus:ring-2 focus:ring-brand-dark/10 focus:border-brand-dark bg-white"
                    >
                      {[1, 2, 3].map(n => <option key={n} value={n}>Paper {n}</option>)}
                    </select>
                  </div>
                </div>

                {/* Question paper file */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-2">File *</label>
                  {file ? (
                    <div className="flex items-center gap-2 p-3 bg-stone-50 rounded-xl border border-brand-border">
                      <Paperclip className="w-4 h-4 text-stone-500 shrink-0" />
                      <span className="text-sm font-bold text-stone-700 flex-1 truncate">{file.name}</span>
                      <button
                        onClick={() => { setFile(null); if (fileRef.current) fileRef.current.value = ''; }}
                        className="text-red-400 hover:text-red-600 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => fileRef.current?.click()}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-brand-border text-sm font-bold text-stone-500 hover:border-stone-400 hover:text-stone-600 transition-colors"
                    >
                      <Paperclip className="w-4 h-4" /> Attach PDF or image
                    </button>
                  )}
                  <input
                    ref={fileRef}
                    type="file"
                    className="hidden"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={e => { const f = e.target.files?.[0]; if (f) setFile(f); }}
                  />
                </div>

                {/* Memo / Marking guide file (optional) */}
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-500 mb-2">
                    Memorandum / Marking Guide
                    <span className="ml-2 text-stone-400 normal-case font-medium tracking-normal">(optional)</span>
                  </p>
                  {memoFile ? (
                    <div className="flex items-center gap-3 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span className="text-sm font-bold text-emerald-700 flex-1 min-w-0 truncate">{memoFile.name}</span>
                      <button
                        type="button"
                        onClick={() => setMemoFile(null)}
                        className="text-emerald-400 hover:text-emerald-700 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => memoFileRef.current?.click()}
                      className="w-full flex items-center gap-3 px-4 py-3 border-2 border-dashed border-brand-border rounded-xl text-sm font-bold text-stone-500 hover:border-stone-400 hover:text-stone-600 transition-colors"
                    >
                      <Paperclip className="w-4 h-4" />
                      Attach memo (PDF or Word)
                    </button>
                  )}
                  <input
                    type="file"
                    ref={memoFileRef}
                    accept=".pdf,.doc,.docx"
                    onChange={e => setMemoFile(e.target.files?.[0] ?? null)}
                    className="hidden"
                  />
                </div>

                {formError && <p className="text-sm font-bold text-red-500">{formError}</p>}
              </div>

              <div className="sticky bottom-0 bg-white border-t border-brand-border/60 px-6 py-4 rounded-b-2xl flex gap-2">
                <button
                  onClick={closeModal}
                  className="flex-1 py-2.5 rounded-xl border border-brand-border text-sm font-black text-stone-600 hover:bg-stone-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={saving}
                  className="flex-1 py-2.5 rounded-xl bg-brand-dark text-white text-sm font-black hover:bg-stone-700 transition-colors disabled:opacity-50"
                >
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
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => setDeleteTarget(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 12, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 8, opacity: 0 }} transition={{ duration: 0.2, ease: 'easeOut' }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6"
              onClick={e => e.stopPropagation()}
            >
              <h2 className="text-base font-black text-stone-900 mb-1">Delete paper?</h2>
              <p className="text-sm text-stone-500 mb-5">
                <strong>{deleteTarget.title}</strong> will be permanently removed.
                {deleteTarget.memo_url && (
                  <span className="block mt-1 text-stone-500">The attached memo will also be deleted.</span>
                )}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="flex-1 py-2.5 rounded-xl border border-brand-border text-sm font-black text-stone-600 hover:bg-stone-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-sm font-black hover:bg-red-700 transition-colors disabled:opacity-50"
                >
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
