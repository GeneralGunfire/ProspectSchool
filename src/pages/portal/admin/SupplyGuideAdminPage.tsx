import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, X, Trash2, BookOpen, CheckCircle2, Link2 } from 'lucide-react';
import {
  fetchSupplyGuideItems, createSupplyGuideItem, deleteSupplyGuideItem,
  type SupplyGuideItem, type Retailer,
} from '../../../lib/marketplace';
import { fetchSubjects, type Subject } from '../../../lib/students';
import type { AdminSession } from '../../../lib/auth';
import Dropdown from '../../../shared/components/Dropdown';
import Modal from '../../../shared/components/Modal';

const ease = [0.23, 1, 0.32, 1] as [number, number, number, number];

const GRADES = [8, 9, 10, 11, 12];

interface SupplyGuideAdminPageProps {
  session: AdminSession;
}

const emptyForm = {
  grade: '10',
  subject: '',
  item_name: '',
  product_code: '',
  isbn: '',
  edition: '',
  publisher: '',
  brand: '',
  avg_price: '',
};

const emptyRetailer = { name: '', url: '' };

export default function SupplyGuideAdminPage({ session }: SupplyGuideAdminPageProps) {
  const [items, setItems]         = useState<SupplyGuideItem[]>([]);
  const [subjects, setSubjects]   = useState<Subject[]>([]);
  const [loading, setLoading]     = useState(true);
  const [gradeFilter, setGradeFilter] = useState<number | null>(null);
  const [modal, setModal]         = useState(false);
  const [form, setForm]           = useState(emptyForm);
  const [retailers, setRetailers] = useState<Retailer[]>([]);
  const [saving, setSaving]       = useState(false);
  const [formError, setFormError] = useState('');
  const [toast, setToast]         = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SupplyGuideItem | null>(null);
  const [deleting, setDeleting]   = useState(false);

  useEffect(() => { fetchSubjects().then(setSubjects); }, []);
  useEffect(() => { reload(); }, [gradeFilter]);

  async function reload() {
    if (!session.school_id) return;
    setLoading(true);
    setItems(await fetchSupplyGuideItems(session.school_id, gradeFilter ?? undefined));
    setLoading(false);
  }

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  function closeModal() {
    setModal(false);
    setForm(emptyForm);
    setRetailers([]);
    setFormError('');
  }

  async function handleCreate() {
    if (!session.school_id) return;
    if (!form.item_name.trim()) { setFormError('Item name is required.'); return; }
    if (!form.grade) { setFormError('Select a grade.'); return; }

    setSaving(true); setFormError('');
    const result = await createSupplyGuideItem({
      school_id:    session.school_id,
      grade:        Number(form.grade),
      subject:      form.subject,
      item_name:    form.item_name,
      product_code: form.product_code,
      isbn:         form.isbn,
      edition:      form.edition,
      publisher:    form.publisher,
      brand:        form.brand,
      avg_price:    form.avg_price ? Number(form.avg_price) : undefined,
      retailers:    retailers.filter(r => r.name.trim()),
    });
    setSaving(false);
    if (!result.success) { setFormError(result.error); return; }
    closeModal();
    reload();
    showToast('Item added to supply guide.');
  }

  async function handleDelete() {
    if (!deleteTarget || !session.school_id) return;
    setDeleting(true);
    await deleteSupplyGuideItem(deleteTarget.id, session.school_id);
    setDeleting(false);
    setDeleteTarget(null);
    reload();
    showToast('Item removed.');
  }

  // Group by subject
  const grouped = new Map<string, SupplyGuideItem[]>();
  for (const item of items) {
    const key = item.subject ?? 'General';
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(item);
  }

  if (!session.school_id) {
    return <div className="max-w-3xl mx-auto px-4 py-6 text-sm text-stone-500">Supply Guide is not available for platform-level admins.</div>;
  }

  return (
    <div className="student-home min-h-full pb-16 relative">

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.22 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-100 paper-card flex items-center gap-2.5 text-sm font-semibold text-brand-dark px-5 py-3 rounded-2xl"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />{toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ Header ═══════════════════════════════════════════════ */}
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-5 flex flex-wrap items-end justify-between gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }}>
          <p className="text-[12px] text-[rgba(31,36,33,0.5)] font-medium">School supplies</p>
          <h1 className="text-brand-dark text-[30px] sm:text-[36px] leading-tight mt-1" style={{ fontWeight: 600 }}>
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-linear-to-r from-sky-500 via-sky-600 to-blue-600">
                Supply guide
              </span>
              <svg aria-hidden="true" viewBox="0 0 320 14" className="absolute left-0 -bottom-1 w-full h-3 text-amber-500/70" preserveAspectRatio="none">
                <path d="M2 9C60 3 180 2 318 8" stroke="currentColor" strokeWidth="3.5" fill="none" strokeLinecap="round" />
              </svg>
            </span>
          </h1>
        </motion.div>
        <motion.button
          whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}
          onClick={() => { closeModal(); setModal(true); }}
          className="flex items-center gap-1 text-[14px] font-semibold transition-colors shrink-0" style={{ color: 'var(--color-navy)' }}
        >
          <Plus className="w-3.5 h-3.5" /> Add item
        </motion.button>
      </div>

      {/* ═══ Body ═══════════════════════════════════════════════ */}
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4">

      {/* Grade filter */}
      <div className="flex items-center gap-1 bg-stone-100 rounded p-1 w-fit flex-wrap">
        <button
          onClick={() => setGradeFilter(null)}
          className={`px-3 py-2 rounded-lg text-sm font-black transition-colors ${gradeFilter === null ? 'bg-white text-brand-dark shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
        >
          All
        </button>
        {GRADES.map(g => (
          <button
            key={g}
            onClick={() => setGradeFilter(g)}
            className={`px-3 py-2 rounded-lg text-sm font-black transition-colors ${gradeFilter === g ? 'bg-white text-brand-dark shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
          >
            Gr {g}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
            className="w-5 h-5 border-2 border-brand-border border-t-stone-700 rounded-full"
          />
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <BookOpen className="w-10 h-10 text-stone-200 mb-4" />
          <p className="text-sm font-bold text-stone-500">No supply guide items yet.</p>
          <p className="text-xs text-stone-400 mt-1">Add textbooks and stationery students need per grade.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Array.from(grouped.entries()).map(([subject, list]) => (
            <div key={subject}>
              <div className="flex items-center gap-2 mb-3">
                <p className="text-[15px] text-brand-dark" style={{ fontWeight: 600 }}>{subject}</p>
                <span className="flex-1 h-px bg-brand-border" />
              </div>
              <div className="space-y-2">
                {list.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="paper-card rounded px-5 py-4 flex items-center gap-4"
                  >
                    <BookOpen className="w-4 h-4 shrink-0" style={{ color: 'var(--color-navy)' }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-brand-dark">{item.item_name}</p>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-500">Grade {item.grade}</span>
                        {item.product_code && (
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center gap-1">
                            <Link2 className="w-2.5 h-2.5" />{item.product_code}
                          </span>
                        )}
                        {item.avg_price != null && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-500">
                            ~R{item.avg_price.toLocaleString('en-ZA')}
                          </span>
                        )}
                        {(item.listing_count ?? 0) > 0 && (
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700">
                            {item.listing_count} listed
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => setDeleteTarget(item)}
                      className="p-2 rounded hover:bg-red-50 transition-colors text-stone-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      </div>

      {/* ── Add Item Modal ─────────────────────────────────────── */}
      <Modal open={modal} onClose={closeModal} title="Add supply item" maxWidth="max-w-lg"
        footer={<>
          <button onClick={closeModal} className="text-[14px] font-semibold text-stone-500 hover:text-stone-700 transition-colors">
            Cancel
          </button>
          <button onClick={handleCreate} disabled={saving}
            className="text-[14px] font-semibold transition-colors disabled:opacity-50" style={{ color: 'var(--color-navy)' }}>
            {saving ? 'Saving…' : 'Add item'}
          </button>
        </>}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-[12px] text-muted-2 mb-2">Item name *</label>
            <input
              value={form.item_name}
              onChange={e => setForm(f => ({ ...f, item_name: e.target.value }))}
              placeholder="e.g. Casio fx-82ZA Calculator"
              className="w-full px-3 py-2.5 rounded border border-brand-border text-sm font-bold text-brand-dark placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-dark/10 focus:border-brand-dark"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] text-muted-2 mb-2">Grade *</label>
              <Dropdown
                value={form.grade}
                onChange={v => setForm(f => ({ ...f, grade: v }))}
                buttonClassName="w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded border border-brand-border text-sm font-bold text-stone-700 focus:outline-none focus:ring-2 focus:ring-brand-dark/10 focus:border-brand-dark bg-white"
                options={GRADES.map(g => ({ value: String(g), label: `Grade ${g}` }))}
              />
            </div>
            <div>
              <label className="block text-[12px] text-muted-2 mb-2">Subject</label>
              <Dropdown
                value={form.subject || 'general'}
                onChange={v => setForm(f => ({ ...f, subject: v === 'general' ? '' : v }))}
                buttonClassName="w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded border border-brand-border text-sm font-bold text-stone-700 focus:outline-none focus:ring-2 focus:ring-brand-dark/10 focus:border-brand-dark bg-white"
                options={[{ value: 'general', label: 'General' }, ...subjects.map(s => ({ value: s.label, label: s.label }))]}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] text-muted-2 mb-2">
                Product code <span className="font-medium text-stone-400">(optional)</span>
              </label>
              <input
                value={form.product_code}
                onChange={e => setForm(f => ({ ...f, product_code: e.target.value.toUpperCase() }))}
                placeholder="e.g. ENG10-GRAM"
                className="w-full px-3 py-2.5 rounded border border-brand-border text-sm font-bold text-brand-dark placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-dark/10 focus:border-brand-dark uppercase"
              />
            </div>
            <div>
              <label className="block text-[12px] text-muted-2 mb-2">Avg price (R)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.avg_price}
                onChange={e => setForm(f => ({ ...f, avg_price: e.target.value }))}
                placeholder="Optional"
                className="w-full px-3 py-2.5 rounded border border-brand-border text-sm font-bold text-brand-dark placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-dark/10 focus:border-brand-dark"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[12px] text-muted-2 mb-2">ISBN</label>
              <input
                value={form.isbn}
                onChange={e => setForm(f => ({ ...f, isbn: e.target.value }))}
                placeholder="Optional"
                className="w-full px-3 py-2.5 rounded border border-brand-border text-sm font-bold text-brand-dark placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-dark/10 focus:border-brand-dark"
              />
            </div>
            <div>
              <label className="block text-[12px] text-muted-2 mb-2">Edition</label>
              <input
                value={form.edition}
                onChange={e => setForm(f => ({ ...f, edition: e.target.value }))}
                placeholder="Optional"
                className="w-full px-3 py-2.5 rounded border border-brand-border text-sm font-bold text-brand-dark placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-dark/10 focus:border-brand-dark"
              />
            </div>
            <div>
              <label className="block text-[12px] text-muted-2 mb-2">Brand</label>
              <input
                value={form.brand}
                onChange={e => setForm(f => ({ ...f, brand: e.target.value }))}
                placeholder="Optional"
                className="w-full px-3 py-2.5 rounded border border-brand-border text-sm font-bold text-brand-dark placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-dark/10 focus:border-brand-dark"
              />
            </div>
          </div>

          <div>
            <label className="block text-[12px] text-muted-2 mb-2">Publisher</label>
            <input
              value={form.publisher}
              onChange={e => setForm(f => ({ ...f, publisher: e.target.value }))}
              placeholder="Optional"
              className="w-full px-3 py-2.5 rounded border border-brand-border text-sm font-bold text-brand-dark placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-dark/10 focus:border-brand-dark"
            />
          </div>

          <div>
            <label className="block text-[12px] text-muted-2 mb-2">
              Where to buy <span className="font-medium text-stone-400">(retailers)</span>
            </label>
            <div className="space-y-2">
              {retailers.map((r, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    value={r.name}
                    onChange={e => setRetailers(prev => prev.map((x, idx) => idx === i ? { ...x, name: e.target.value } : x))}
                    placeholder="Retailer name (e.g. Takealot)"
                    className="flex-1 px-3 py-2 rounded border border-brand-border text-sm font-bold text-brand-dark placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-dark/10 focus:border-brand-dark"
                  />
                  <input
                    value={r.url ?? ''}
                    onChange={e => setRetailers(prev => prev.map((x, idx) => idx === i ? { ...x, url: e.target.value } : x))}
                    placeholder="URL (optional)"
                    className="flex-1 px-3 py-2 rounded border border-brand-border text-sm font-bold text-brand-dark placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-dark/10 focus:border-brand-dark"
                  />
                  <button
                    onClick={() => setRetailers(prev => prev.filter((_, idx) => idx !== i))}
                    className="p-2 rounded hover:bg-red-50 text-stone-400 hover:text-red-500 transition-colors shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => setRetailers(prev => [...prev, { ...emptyRetailer }])}
                className="w-full py-2 rounded border-2 border-dashed border-brand-border text-xs font-bold text-stone-500 hover:border-stone-400 hover:text-stone-600 transition-colors"
              >
                + Add retailer
              </button>
            </div>
          </div>

          {formError && <p className="text-sm font-bold text-red-500">{formError}</p>}
        </div>
      </Modal>

      {/* ── Delete Confirm ─────────────────────────────────────── */}
      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} maxWidth="max-w-sm"
        footer={<>
          <button onClick={() => setDeleteTarget(null)} className="text-[14px] font-semibold text-stone-500 hover:text-stone-700 transition-colors">
            Cancel
          </button>
          <button onClick={handleDelete} disabled={deleting}
            className="text-[14px] font-semibold text-red-600 hover:text-red-700 transition-colors disabled:opacity-50">
            {deleting ? 'Removing…' : 'Remove'}
          </button>
        </>}
      >
        <h2 className="text-base font-black text-brand-dark mb-1">Remove item?</h2>
        <p className="text-sm text-stone-500"><strong>{deleteTarget?.item_name}</strong> will be removed from the supply guide.</p>
      </Modal>
    </div>
  );
}
