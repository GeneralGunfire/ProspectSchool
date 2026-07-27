import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus, X, Trash2, ExternalLink, FolderOpen, CheckCircle2, Paperclip,
} from 'lucide-react';
import { Shimmer } from '../../../shared/components/Shimmer';
import Dropdown from '../../../shared/components/Dropdown';
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

const ease = [0.23, 1, 0.32, 1] as [number, number, number, number];

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
  const [memoLoading, setMemoLoading] = useState<number | null>(null);
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

  async function handleOpenMemo(p: PastPaper) {
    if (!p.memo_url) return;
    setMemoLoading(p.id);
    const url = await getPastPaperDownloadUrl(p.memo_url);
    setMemoLoading(null);
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
    <div className="student-home min-h-full pb-16 relative">

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.22 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-100 flex items-center gap-2.5 paper-card text-sm font-bold px-5 py-3 rounded-2xl shadow-xl"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />{toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ Header — same compact scale as the student Home page ═══ */}
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-5 flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-brand-dark text-[30px] sm:text-[36px] leading-tight" style={{ fontWeight: 600 }}>
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-linear-to-r from-sky-500 via-sky-600 to-blue-600">
                Past Papers
              </span>
              <svg aria-hidden="true" viewBox="0 0 320 14" className="absolute left-0 -bottom-1 w-full h-3 text-amber-500/70" preserveAspectRatio="none">
                <path d="M2 9C60 3 180 2 318 8" stroke="currentColor" strokeWidth="3.5" fill="none" strokeLinecap="round" />
              </svg>
            </span>
          </h1>
          <p className="text-[14px] text-muted mt-1">Upload papers for students to browse and practise with.</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => { setModal(true); setFormError(''); setForm(emptyForm); setFile(null); setMemoFile(null); }}
          className="shrink-0 flex items-center gap-1 text-[14px] font-semibold transition-colors"
          style={{ color: 'var(--color-navy)' }}
        >
          <Plus className="w-4 h-4" /> Upload paper
        </motion.button>
      </div>

      {/* ═══ Body ═════════════════════════════════════════════════ */}
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4">

      {/* Content */}
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
      ) : papers.length === 0 ? (
        <div className="paper-card rounded p-5 sm:p-7 flex flex-col items-center justify-center py-20 text-center">
          <FolderOpen className="w-9 h-9 text-stone-200 mb-4" />
          <p className="text-[16px] font-semibold text-brand-dark">No past papers yet.</p>
          <p className="text-[13px] text-[rgba(31,36,33,0.4)] mt-1">Upload papers — students can browse and download them.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Array.from(grouped.entries()).map(([subject, list]) => (
            <div key={subject}>
              <p className="text-[15px] text-brand-dark mb-3" style={{ fontWeight: 600 }}>{subject}</p>
              <div className="space-y-2.5">
                {list.map((p, i) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="paper-card rounded px-5 py-4 flex items-center gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-brand-dark">{p.title}</p>
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
                        className="p-2 rounded hover:bg-stone-100 transition-colors text-stone-500 hover:text-stone-700 disabled:opacity-40"
                        title="Open question paper"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                      {p.memo_url && (
                        <button
                          onClick={() => handleOpenMemo(p)}
                          disabled={memoLoading === p.id}
                          className="flex items-center gap-1.5 px-3 py-2 rounded text-xs font-black transition-colors disabled:opacity-40 bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {memoLoading === p.id ? 'Opening…' : 'Memo'}
                        </button>
                      )}
                      <button
                        onClick={() => setDeleteTarget(p)}
                        className="p-2 rounded hover:bg-red-50 transition-colors text-stone-400 hover:text-red-500"
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
      </div>

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
                <h2 className="text-base font-black text-brand-dark">Upload Past Paper</h2>
                <button onClick={closeModal} aria-label="Close" className="p-1.5 rounded-lg hover:bg-stone-100 transition-colors">
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
                    className="w-full px-3 py-2.5 rounded border border-brand-border text-sm font-bold text-brand-dark placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-dark/10 focus:border-brand-dark"
                  />
                </div>

                {/* Subject + Grade row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-2">Subject *</label>
                    <Dropdown
                      value={form.subject_id || null}
                      onChange={v => setForm(f => ({ ...f, subject_id: v }))}
                      placeholder="Select…"
                      options={subjects.map(s => ({ value: String(s.id), label: s.label }))}
                      buttonClassName="w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded border border-brand-border text-sm font-bold text-stone-700 focus:outline-none focus:ring-2 focus:ring-brand-dark/10 focus:border-brand-dark bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-2">Grade *</label>
                    <Dropdown
                      value={form.grade || null}
                      onChange={v => setForm(f => ({ ...f, grade: v }))}
                      placeholder="Select…"
                      options={GRADES.map(g => ({ value: String(g), label: `Grade ${g}` }))}
                      buttonClassName="w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded border border-brand-border text-sm font-bold text-stone-700 focus:outline-none focus:ring-2 focus:ring-brand-dark/10 focus:border-brand-dark bg-white"
                    />
                  </div>
                </div>

                {/* Year + Term + Paper number row */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-2">Year *</label>
                    <Dropdown
                      value={form.year}
                      onChange={v => setForm(f => ({ ...f, year: v }))}
                      options={YEARS.map(y => ({ value: String(y), label: String(y) }))}
                      buttonClassName="w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded border border-brand-border text-sm font-bold text-stone-700 focus:outline-none focus:ring-2 focus:ring-brand-dark/10 focus:border-brand-dark bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-2">Term</label>
                    <Dropdown
                      value={form.term || 'any'}
                      onChange={v => setForm(f => ({ ...f, term: v === 'any' ? '' : v }))}
                      options={[{ value: 'any', label: 'Any' }, ...TERMS.map(t => ({ value: String(t), label: `Term ${t}` }))]}
                      buttonClassName="w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded border border-brand-border text-sm font-bold text-stone-700 focus:outline-none focus:ring-2 focus:ring-brand-dark/10 focus:border-brand-dark bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-2">Paper #</label>
                    <Dropdown
                      value={form.paper_number}
                      onChange={v => setForm(f => ({ ...f, paper_number: v }))}
                      options={[1, 2, 3].map(n => ({ value: String(n), label: `Paper ${n}` }))}
                      buttonClassName="w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded border border-brand-border text-sm font-bold text-stone-700 focus:outline-none focus:ring-2 focus:ring-brand-dark/10 focus:border-brand-dark bg-white"
                    />
                  </div>
                </div>

                {/* Question paper file */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-2">File *</label>
                  {file ? (
                    <div className="flex items-center gap-2 p-3 bg-stone-50 rounded border border-brand-border">
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
                      className="w-full flex items-center justify-center gap-2 py-3 rounded border-2 border-dashed border-brand-border text-sm font-bold text-stone-500 hover:border-stone-400 hover:text-stone-600 transition-colors"
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
                    <div className="flex items-center gap-3 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded">
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
                      className="w-full flex items-center gap-3 px-4 py-3 border-2 border-dashed border-brand-border rounded text-sm font-bold text-stone-500 hover:border-stone-400 hover:text-stone-600 transition-colors"
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

              <div className="sticky bottom-0 bg-white border-t border-brand-border/60 px-6 py-4 rounded-b-2xl flex items-center gap-6">
                <button
                  onClick={closeModal}
                  className="text-[14px] font-semibold text-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={saving}
                  className="flex items-center gap-1 text-[14px] font-semibold transition-colors disabled:opacity-50"
                  style={{ color: 'var(--color-navy)' }}
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
              <h2 className="text-base font-black text-brand-dark mb-1">Delete paper?</h2>
              <p className="text-sm text-stone-500 mb-5">
                <strong>{deleteTarget.title}</strong> will be permanently removed.
                {deleteTarget.memo_url && (
                  <span className="block mt-1 text-stone-500">The attached memo will also be deleted.</span>
                )}
              </p>
              <div className="flex items-center gap-6">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="text-[14px] font-semibold text-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="text-[14px] font-semibold text-red-600 transition-colors disabled:opacity-50"
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
