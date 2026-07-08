import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, X, Trash2, BookOpen, CheckCircle2, Link2 } from 'lucide-react';
import {
  fetchSupplyGuideItems, createSupplyGuideItem, deleteSupplyGuideItem,
  type SupplyGuideItem, type Retailer,
} from '../../../lib/marketplace';
import { fetchSubjects, type Subject } from '../../../lib/students';
import type { AdminSession } from '../../../lib/auth';

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
          <span className="eyebrow">School Supplies</span>
          <h1 className="text-2xl font-black text-brand-dark tracking-tight">Supply Guide</h1>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={() => { closeModal(); setModal(true); }}
          className="flex items-center gap-2 bg-brand-dark text-white text-sm font-black px-4 py-2.5 rounded-xl hover:bg-stone-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Item
        </motion.button>
      </div>

      {/* Grade filter */}
      <div className="flex items-center gap-1 mb-6 bg-stone-100 rounded-xl p-1 w-fit flex-wrap">
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
              <p className="text-xs font-black uppercase tracking-widest text-stone-500 mb-3">{subject}</p>
              <div className="space-y-2">
                {list.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="card-premium bg-white rounded-[24px] border border-brand-border px-5 py-4 flex items-center gap-4"
                  >
                    <div className="w-9 h-9 rounded-xl bg-stone-100 flex items-center justify-center shrink-0">
                      <BookOpen className="w-4 h-4 text-stone-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-stone-900">{item.item_name}</p>
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
                      className="p-2 rounded-xl hover:bg-red-50 transition-colors text-stone-400 hover:text-red-500"
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

      {/* ── Add Item Modal ─────────────────────────────────────── */}
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
                <h2 className="text-base font-black text-stone-900">Add Supply Item</h2>
                <button onClick={closeModal} className="p-1.5 rounded-lg hover:bg-stone-100 transition-colors">
                  <X className="w-4 h-4 text-stone-500" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-2">Item Name *</label>
                  <input
                    value={form.item_name}
                    onChange={e => setForm(f => ({ ...f, item_name: e.target.value }))}
                    placeholder="e.g. Casio fx-82ZA Calculator"
                    className="w-full px-3 py-2.5 rounded-xl border border-brand-border text-sm font-bold text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-dark/10 focus:border-brand-dark"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-2">Grade *</label>
                    <select
                      value={form.grade}
                      onChange={e => setForm(f => ({ ...f, grade: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-xl border border-brand-border text-sm font-bold text-stone-700 focus:outline-none focus:ring-2 focus:ring-brand-dark/10 focus:border-brand-dark bg-white"
                    >
                      {GRADES.map(g => <option key={g} value={g}>Grade {g}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-2">Subject</label>
                    <select
                      value={form.subject}
                      onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-xl border border-brand-border text-sm font-bold text-stone-700 focus:outline-none focus:ring-2 focus:ring-brand-dark/10 focus:border-brand-dark bg-white"
                    >
                      <option value="">General</option>
                      {subjects.map(s => <option key={s.id} value={s.label}>{s.label}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-2">
                      Product Code <span className="normal-case font-medium text-stone-400 tracking-normal">(optional)</span>
                    </label>
                    <input
                      value={form.product_code}
                      onChange={e => setForm(f => ({ ...f, product_code: e.target.value.toUpperCase() }))}
                      placeholder="e.g. ENG10-GRAM"
                      className="w-full px-3 py-2.5 rounded-xl border border-brand-border text-sm font-bold text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-dark/10 focus:border-brand-dark uppercase"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-2">Avg Price (R)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.avg_price}
                      onChange={e => setForm(f => ({ ...f, avg_price: e.target.value }))}
                      placeholder="Optional"
                      className="w-full px-3 py-2.5 rounded-xl border border-brand-border text-sm font-bold text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-dark/10 focus:border-brand-dark"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-2">ISBN</label>
                    <input
                      value={form.isbn}
                      onChange={e => setForm(f => ({ ...f, isbn: e.target.value }))}
                      placeholder="Optional"
                      className="w-full px-3 py-2.5 rounded-xl border border-brand-border text-sm font-bold text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-dark/10 focus:border-brand-dark"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-2">Edition</label>
                    <input
                      value={form.edition}
                      onChange={e => setForm(f => ({ ...f, edition: e.target.value }))}
                      placeholder="Optional"
                      className="w-full px-3 py-2.5 rounded-xl border border-brand-border text-sm font-bold text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-dark/10 focus:border-brand-dark"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-2">Brand</label>
                    <input
                      value={form.brand}
                      onChange={e => setForm(f => ({ ...f, brand: e.target.value }))}
                      placeholder="Optional"
                      className="w-full px-3 py-2.5 rounded-xl border border-brand-border text-sm font-bold text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-dark/10 focus:border-brand-dark"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-2">Publisher</label>
                  <input
                    value={form.publisher}
                    onChange={e => setForm(f => ({ ...f, publisher: e.target.value }))}
                    placeholder="Optional"
                    className="w-full px-3 py-2.5 rounded-xl border border-brand-border text-sm font-bold text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-dark/10 focus:border-brand-dark"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-2">
                    Where to Buy <span className="normal-case font-medium text-stone-400 tracking-normal">(retailers)</span>
                  </label>
                  <div className="space-y-2">
                    {retailers.map((r, i) => (
                      <div key={i} className="flex gap-2">
                        <input
                          value={r.name}
                          onChange={e => setRetailers(prev => prev.map((x, idx) => idx === i ? { ...x, name: e.target.value } : x))}
                          placeholder="Retailer name (e.g. Takealot)"
                          className="flex-1 px-3 py-2 rounded-xl border border-brand-border text-sm font-bold text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-dark/10 focus:border-brand-dark"
                        />
                        <input
                          value={r.url ?? ''}
                          onChange={e => setRetailers(prev => prev.map((x, idx) => idx === i ? { ...x, url: e.target.value } : x))}
                          placeholder="URL (optional)"
                          className="flex-1 px-3 py-2 rounded-xl border border-brand-border text-sm font-bold text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-dark/10 focus:border-brand-dark"
                        />
                        <button
                          onClick={() => setRetailers(prev => prev.filter((_, idx) => idx !== i))}
                          className="p-2 rounded-xl hover:bg-red-50 text-stone-400 hover:text-red-500 transition-colors shrink-0"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => setRetailers(prev => [...prev, { ...emptyRetailer }])}
                      className="w-full py-2 rounded-xl border-2 border-dashed border-brand-border text-xs font-bold text-stone-500 hover:border-stone-400 hover:text-stone-600 transition-colors"
                    >
                      + Add Retailer
                    </button>
                  </div>
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
                  {saving ? 'Saving…' : 'Add Item'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Delete Confirm ─────────────────────────────────────── */}
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
              <h2 className="text-base font-black text-stone-900 mb-1">Remove item?</h2>
              <p className="text-sm text-stone-500 mb-5"><strong>{deleteTarget.item_name}</strong> will be removed from the supply guide.</p>
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
                  {deleting ? 'Removing…' : 'Remove'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
