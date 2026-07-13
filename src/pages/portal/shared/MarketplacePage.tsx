import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus, X, Trash2, ShoppingBag, CheckCircle2, ImagePlus, Heart, Tag, Users, ChevronLeft, ChevronRight, HandHeart, BookOpen,
} from 'lucide-react';
import { Shimmer } from '../student/StudentHomePage';
import {
  fetchActiveListings, fetchMyListings, createListing, markListingSold, deleteListing,
  toggleInterest, isInterested, fetchInterestedUsers, getListingImageUrl,
  fetchOpenWanted, fetchMyWanted, createWanted, closeWanted, deleteWanted,
  fetchSupplyGuideItems, fetchSupplyGuideItemByCode, fetchStudentRemovals, toggleStudentRemoval,
  type MarketplaceListing, type SellerType, type ListingCategory, type ListingCondition, type Interest,
  type WantedRequest, type SupplyGuideItem,
} from '../../../lib/marketplace';
import { fetchSubjects, type Subject } from '../../../lib/students';

const GRADES = [8, 9, 10, 11, 12];
const CATEGORIES: { id: ListingCategory; label: string }[] = [
  { id: 'textbook',   label: 'Textbook' },
  { id: 'stationery', label: 'Stationery' },
  { id: 'uniform',    label: 'Uniform' },
  { id: 'equipment',  label: 'Equipment' },
  { id: 'misc',       label: 'Miscellaneous' },
];
const CONDITIONS: { id: ListingCondition; label: string }[] = [
  { id: 'new',      label: 'New' },
  { id: 'like_new', label: 'Like New' },
  { id: 'good',     label: 'Good' },
  { id: 'fair',     label: 'Fair' },
];

function formatPrice(n: number) {
  return `R${n.toLocaleString('en-ZA', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

const ease = [0.23, 1, 0.32, 1] as [number, number, number, number];

interface MarketplacePageProps {
  sellerType: SellerType;
  sellerId: number;
  schoolId: number;
  studentGrade?: number;
}

const emptyForm = {
  title: '',
  description: '',
  category: 'textbook' as ListingCategory,
  subject: '',
  grade: '',
  condition: 'good' as ListingCondition,
  price: '',
};

const emptyWantedForm = {
  title: '',
  subject: '',
  grade: '',
  budget: '',
};

export default function MarketplacePage({ sellerType, sellerId, schoolId, studentGrade }: MarketplacePageProps) {
  const [tab, setTab] = useState<'browse' | 'sell' | 'mine' | 'wanted' | 'post-wanted' | 'my-wanted' | 'guide'>('browse');
  const [browseListings, setBrowseListings] = useState<MarketplaceListing[]>([]);
  const [myListings, setMyListings]         = useState<MarketplaceListing[]>([]);
  const [openWanted, setOpenWanted]         = useState<WantedRequest[]>([]);
  const [myWanted, setMyWanted]             = useState<WantedRequest[]>([]);
  const [guideItems, setGuideItems]         = useState<SupplyGuideItem[]>([]);
  const [removedIds, setRemovedIds]         = useState<Set<number>>(new Set());
  const [loading, setLoading]               = useState(true);
  const [imgLoaded, setImgLoaded]           = useState(false);
  const [imageUrls, setImageUrls]           = useState<Map<string, string>>(new Map());
  const [interestedMap, setInterestedMap]   = useState<Map<number, boolean>>(new Map());
  const [toast, setToast]                   = useState<string | null>(null);
  const [subjects, setSubjects]             = useState<Subject[]>([]);

  // Sell form
  const [form, setForm]                 = useState(emptyForm);
  const [images, setImages]             = useState<File[]>([]);
  const [saving, setSaving]             = useState(false);
  const [formError, setFormError]       = useState('');
  const [productCode, setProductCode]   = useState('');
  const [matchedGuideItem, setMatchedGuideItem] = useState<SupplyGuideItem | null>(null);
  const [codeChecking, setCodeChecking] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Wanted form
  const [wantedForm, setWantedForm]         = useState(emptyWantedForm);
  const [wantedSaving, setWantedSaving]     = useState(false);
  const [wantedFormError, setWantedFormError] = useState('');
  const [deleteWantedTarget, setDeleteWantedTarget] = useState<WantedRequest | null>(null);

  // Interested list modal
  const [interestModal, setInterestModal]   = useState<MarketplaceListing | null>(null);
  const [interestUsers, setInterestUsers]   = useState<Interest[]>([]);
  const [interestLoading, setInterestLoading] = useState(false);

  // Listing detail modal
  const [detailListing, setDetailListing] = useState<MarketplaceListing | null>(null);
  const [detailImageIndex, setDetailImageIndex] = useState(0);

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState<MarketplaceListing | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => { fetchSubjects().then(setSubjects); }, []);
  useEffect(() => { reload(); }, [tab]);

  async function reload() {
    setLoading(true);
    if (tab === 'browse') {
      const listings = await fetchActiveListings(schoolId);
      setBrowseListings(listings);
      await loadImages(listings);
      await loadInterestFlags(listings);
    } else if (tab === 'mine') {
      const listings = await fetchMyListings(sellerType, sellerId, schoolId);
      setMyListings(listings);
      await loadImages(listings);
    } else if (tab === 'wanted') {
      setOpenWanted(await fetchOpenWanted(schoolId));
    } else if (tab === 'my-wanted') {
      setMyWanted(await fetchMyWanted(sellerType, sellerId, schoolId));
    } else if (tab === 'guide') {
      const [items, removals] = await Promise.all([
        fetchSupplyGuideItems(schoolId, studentGrade),
        sellerType === 'student' ? fetchStudentRemovals(sellerId) : Promise.resolve(new Set<number>()),
      ]);
      setGuideItems(items);
      setRemovedIds(removals);
    }
    setLoading(false);
  }

  async function handleToggleRemoval(item: SupplyGuideItem) {
    const { removed } = await toggleStudentRemoval(sellerId, item.id);
    setRemovedIds(prev => {
      const next = new Set(prev);
      if (removed) next.add(item.id); else next.delete(item.id);
      return next;
    });
  }

  async function handleProductCodeBlur() {
    if (!productCode.trim()) { setMatchedGuideItem(null); return; }
    setCodeChecking(true);
    const item = await fetchSupplyGuideItemByCode(schoolId, productCode);
    setCodeChecking(false);
    setMatchedGuideItem(item);
    if (item) {
      setForm(f => ({
        ...f,
        title: f.title || item.item_name,
        subject: item.subject || f.subject,
        grade: item.grade ? String(item.grade) : f.grade,
      }));
    }
  }

  async function loadImages(listings: MarketplaceListing[]) {
    const paths = [...new Set(listings.flatMap(l => l.images))];
    if (!paths.length) return;
    const entries = await Promise.all(paths.map(async p => [p, await getListingImageUrl(p)] as const));
    setImageUrls(prev => {
      const next = new Map(prev);
      entries.forEach(([p, url]) => { if (url) next.set(p, url); else console.error('[marketplace] failed to sign URL for', p); });
      return next;
    });
  }

  async function loadInterestFlags(listings: MarketplaceListing[]) {
    const entries = await Promise.all(
      listings.map(async l => [l.id, await isInterested(l.id, sellerType, sellerId)] as const)
    );
    setInterestedMap(new Map(entries));
  }

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  function closeSellForm() {
    setForm(emptyForm);
    setImages([]);
    setFormError('');
    setProductCode('');
    setMatchedGuideItem(null);
    if (fileRef.current) fileRef.current.value = '';
  }

  async function handleCreate() {
    if (!form.title.trim()) { setFormError('Title is required.'); return; }
    if (!form.price || Number(form.price) <= 0) { setFormError('Enter a valid price.'); return; }

    setSaving(true); setFormError('');
    const result = await createListing({
      school_id:   schoolId,
      seller_type: sellerType,
      seller_id:   sellerId,
      title:       form.title,
      description: form.description,
      category:    form.category,
      subject:     form.subject,
      grade:       form.grade ? Number(form.grade) : undefined,
      condition:   form.condition,
      price:       Number(form.price),
      images,
      supply_guide_item_id: matchedGuideItem?.id ?? null,
    });
    setSaving(false);
    if (!result.success) { setFormError(result.error); return; }
    closeSellForm();
    showToast('Listing created.');
    setTab('mine');
  }

  async function handleToggleInterest(listing: MarketplaceListing) {
    const { interested } = await toggleInterest(listing.id, sellerType, sellerId);
    setInterestedMap(prev => new Map(prev).set(listing.id, interested));
    setBrowseListings(prev => prev.map(l =>
      l.id === listing.id ? { ...l, interest_count: l.interest_count + (interested ? 1 : -1) } : l
    ));
    setDetailListing(prev => prev && prev.id === listing.id
      ? { ...prev, interest_count: prev.interest_count + (interested ? 1 : -1) }
      : prev
    );
    showToast(interested ? 'Marked as interested.' : 'Removed interest.');
  }

  async function openInterestModal(listing: MarketplaceListing) {
    setInterestModal(listing);
    setInterestLoading(true);
    setInterestUsers(await fetchInterestedUsers(listing.id));
    setInterestLoading(false);
  }

  async function handleMarkSold(listing: MarketplaceListing) {
    await markListingSold(listing.id, schoolId);
    setMyListings(prev => prev.map(l => l.id === listing.id ? { ...l, status: 'sold' } : l));
    showToast('Marked as sold.');
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    await deleteListing(deleteTarget.id, schoolId, deleteTarget.images);
    setDeleting(false);
    setDeleteTarget(null);
    setMyListings(prev => prev.filter(l => l.id !== deleteTarget.id));
    showToast('Listing deleted.');
  }

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []).slice(0, 3 - images.length);
    setImages(prev => [...prev, ...files].slice(0, 3));
  }

  function closeWantedForm() {
    setWantedForm(emptyWantedForm);
    setWantedFormError('');
  }

  async function handleCreateWanted() {
    if (!wantedForm.title.trim()) { setWantedFormError('Title is required.'); return; }

    setWantedSaving(true); setWantedFormError('');
    const result = await createWanted({
      school_id:      schoolId,
      requester_type: sellerType,
      requester_id:   sellerId,
      title:          wantedForm.title,
      subject:        wantedForm.subject,
      grade:          wantedForm.grade ? Number(wantedForm.grade) : undefined,
      budget:         wantedForm.budget ? Number(wantedForm.budget) : undefined,
    });
    setWantedSaving(false);
    if (!result.success) { setWantedFormError(result.error); return; }
    closeWantedForm();
    showToast('Request posted.');
    setTab('my-wanted');
  }

  async function handleCloseWanted(w: WantedRequest) {
    await closeWanted(w.id, schoolId);
    setMyWanted(prev => prev.map(x => x.id === w.id ? { ...x, status: 'closed' } : x));
    showToast('Request closed.');
  }

  async function handleDeleteWanted() {
    if (!deleteWantedTarget) return;
    await deleteWanted(deleteWantedTarget.id, schoolId);
    setMyWanted(prev => prev.filter(x => x.id !== deleteWantedTarget.id));
    setDeleteWantedTarget(null);
    showToast('Request deleted.');
  }

  function handleImSellingThis(w: WantedRequest) {
    setForm({
      ...emptyForm,
      title:   w.title,
      subject: w.subject ?? '',
      grade:   w.grade ? String(w.grade) : '',
    });
    setImages([]);
    setFormError('');
    setTab('sell');
  }

  const listings = tab === 'browse' ? browseListings : myListings;
  const wantedList = tab === 'wanted' ? openWanted : myWanted;

  return (
    <div className="student-home min-h-full pb-16">

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.22 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-100 flex items-center gap-2.5 text-white text-sm font-bold px-5 py-3 rounded shadow-xl"
            style={{ background: 'var(--color-brand-dark)' }}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />{toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ Hero — full-width crested banner ═══════════════════ */}
      <div className="relative overflow-hidden bg-brand-dark border-b border-brand-border grain-surface flex flex-col justify-end min-h-[220px] sm:min-h-[260px] lg:min-h-[280px]">
        <div className="absolute inset-0 pointer-events-none">
          <motion.img src="/images/nizamiye-marketplace.png" alt=""
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
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-white/45">School Supplies</p>
              <h1 className="font-display font-extrabold text-white text-[28px] sm:text-[36px] mt-2 leading-[1.1]" style={{ letterSpacing: '-0.02em', textShadow: '0 2px 20px rgba(0,0,0,0.35)' }}>
                Marketplace
              </h1>
              <p className="text-[13px] text-white/60 mt-2.5 font-medium">
                Buy, sell and request textbooks and supplies with your school community.
              </p>
            </div>
            {(tab === 'browse' || tab === 'mine') && (
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => { closeSellForm(); setTab('sell'); }}
                className="shrink-0 flex items-center gap-2 text-white text-[13px] font-bold px-4 py-2.5 rounded transition-colors"
                style={{ background: 'var(--color-accent)' }}
              >
                <Plus className="w-4 h-4" /> Sell an Item
              </motion.button>
            )}
            {(tab === 'wanted' || tab === 'my-wanted') && (
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => { closeWantedForm(); setTab('post-wanted'); }}
                className="shrink-0 flex items-center gap-2 text-white text-[13px] font-bold px-4 py-2.5 rounded transition-colors"
                style={{ background: 'var(--color-accent)' }}
              >
                <Plus className="w-4 h-4" /> Post a Request
              </motion.button>
            )}
          </motion.div>
        </div>
      </div>

      {/* ═══ Body ═════════════════════════════════════════════════ */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 relative z-10 pt-6 sm:pt-8">

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6 rounded p-1 w-fit flex-wrap" style={{ background: 'var(--color-paper-raise)' }}>
        {(['browse', 'mine', 'wanted', 'my-wanted', 'guide'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded text-[13px] font-bold transition-colors ${
              tab === t || (tab === 'sell' && (t === 'browse')) || (tab === 'post-wanted' && t === 'wanted')
                ? 'bg-white text-brand-dark' : 'text-stone-500 hover:text-stone-700'
            }`}
            style={(tab === t || (tab === 'sell' && (t === 'browse')) || (tab === 'post-wanted' && t === 'wanted'))
              ? { boxShadow: '0 1px 3px rgba(0,0,0,0.08)' } : undefined}
          >
            {t === 'browse' ? 'Browse' : t === 'mine' ? 'My Listings' : t === 'wanted' ? 'Wanted' : t === 'my-wanted' ? 'My Requests' : 'Supply Guide'}
          </button>
        ))}
      </div>

      {tab === 'sell' ? (
        <div className="paper-card rounded p-6 space-y-4">
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-2">Title *</label>
            <input
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="e.g. Grade 10 Maths Textbook"
              className="w-full px-3 py-2.5 rounded-xl border border-brand-border text-sm font-bold text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-dark/10 focus:border-brand-dark"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-2">Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Condition details, edition, etc."
              rows={3}
              className="w-full px-3 py-2.5 rounded-xl border border-brand-border text-sm font-bold text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-dark/10 focus:border-brand-dark resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-2">Category *</label>
              <select
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value as ListingCategory }))}
                className="w-full px-3 py-2.5 rounded-xl border border-brand-border text-sm font-bold text-stone-700 focus:outline-none focus:ring-2 focus:ring-brand-dark/10 focus:border-brand-dark bg-white"
              >
                {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-2">Condition *</label>
              <select
                value={form.condition}
                onChange={e => setForm(f => ({ ...f, condition: e.target.value as ListingCondition }))}
                className="w-full px-3 py-2.5 rounded-xl border border-brand-border text-sm font-bold text-stone-700 focus:outline-none focus:ring-2 focus:ring-brand-dark/10 focus:border-brand-dark bg-white"
              >
                {CONDITIONS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-2">Subject</label>
              <select
                value={form.subject}
                onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl border border-brand-border text-sm font-bold text-stone-700 focus:outline-none focus:ring-2 focus:ring-brand-dark/10 focus:border-brand-dark bg-white"
              >
                <option value="">None</option>
                {subjects.map(s => <option key={s.id} value={s.label}>{s.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-2">Grade</label>
              <select
                value={form.grade}
                onChange={e => setForm(f => ({ ...f, grade: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl border border-brand-border text-sm font-bold text-stone-700 focus:outline-none focus:ring-2 focus:ring-brand-dark/10 focus:border-brand-dark bg-white"
              >
                <option value="">Any</option>
                {GRADES.map(g => <option key={g} value={g}>Grade {g}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-2">Price (R) *</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                placeholder="0"
                className="w-full px-3 py-2.5 rounded-xl border border-brand-border text-sm font-bold text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-dark/10 focus:border-brand-dark"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-2">
              Supply Guide Product Code <span className="normal-case font-medium text-stone-400 tracking-normal">(optional)</span>
            </label>
            <input
              value={productCode}
              onChange={e => { setProductCode(e.target.value.toUpperCase()); setMatchedGuideItem(null); }}
              onBlur={handleProductCodeBlur}
              placeholder="e.g. ENG10-GRAM — if the school listed this exact item"
              className="w-full px-3 py-2.5 rounded-xl border border-brand-border text-sm font-bold text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-dark/10 focus:border-brand-dark uppercase"
            />
            {codeChecking && <p className="text-xs text-stone-400 mt-1.5">Checking code…</p>}
            {!codeChecking && productCode.trim() && matchedGuideItem && (
              <p className="text-xs font-bold text-emerald-600 mt-1.5 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Matches supply guide: {matchedGuideItem.item_name}
              </p>
            )}
            {!codeChecking && productCode.trim() && !matchedGuideItem && (
              <p className="text-xs font-bold text-stone-400 mt-1.5">No matching item found for this code.</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-2">
              Photos <span className="normal-case font-medium text-stone-400 tracking-normal">(up to 3)</span>
            </label>
            <div className="flex gap-2 flex-wrap">
              {images.map((img, i) => (
                <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-brand-border">
                  <img src={URL.createObjectURL(img)} alt="" className="w-full h-full object-cover" />
                  <button
                    onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))}
                    aria-label="Remove image"
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {images.length < 3 && (
                <button
                  onClick={() => fileRef.current?.click()}
                  className="w-20 h-20 rounded-xl border-2 border-dashed border-brand-border flex items-center justify-center text-stone-400 hover:border-stone-400 hover:text-stone-600 transition-colors"
                >
                  <ImagePlus className="w-5 h-5" />
                </button>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImageSelect} />
          </div>

          {formError && <p className="text-sm font-bold text-red-500">{formError}</p>}

          <div className="flex gap-2 pt-2">
            <button
              onClick={() => { closeSellForm(); setTab('browse'); }}
              className="flex-1 py-2.5 rounded-xl border border-brand-border text-sm font-black text-stone-600 hover:bg-stone-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={saving}
              className="flex-1 py-2.5 rounded-xl bg-brand-dark text-white text-sm font-black hover:bg-stone-700 transition-colors disabled:opacity-50"
            >
              {saving ? 'Posting…' : 'Post Listing'}
            </button>
          </div>
        </div>
      ) : tab === 'post-wanted' ? (
        <div className="paper-card rounded p-6 space-y-4">
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-2">What are you looking for? *</label>
            <input
              value={wantedForm.title}
              onChange={e => setWantedForm(f => ({ ...f, title: e.target.value }))}
              placeholder="e.g. Grade 11 Physical Sciences Textbook"
              className="w-full px-3 py-2.5 rounded-xl border border-brand-border text-sm font-bold text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-dark/10 focus:border-brand-dark"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-2">Subject</label>
              <select
                value={wantedForm.subject}
                onChange={e => setWantedForm(f => ({ ...f, subject: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl border border-brand-border text-sm font-bold text-stone-700 focus:outline-none focus:ring-2 focus:ring-brand-dark/10 focus:border-brand-dark bg-white"
              >
                <option value="">None</option>
                {subjects.map(s => <option key={s.id} value={s.label}>{s.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-2">Grade</label>
              <select
                value={wantedForm.grade}
                onChange={e => setWantedForm(f => ({ ...f, grade: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl border border-brand-border text-sm font-bold text-stone-700 focus:outline-none focus:ring-2 focus:ring-brand-dark/10 focus:border-brand-dark bg-white"
              >
                <option value="">Any</option>
                {GRADES.map(g => <option key={g} value={g}>Grade {g}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-2">Budget (R)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={wantedForm.budget}
                onChange={e => setWantedForm(f => ({ ...f, budget: e.target.value }))}
                placeholder="Optional"
                className="w-full px-3 py-2.5 rounded-xl border border-brand-border text-sm font-bold text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-dark/10 focus:border-brand-dark"
              />
            </div>
          </div>

          {wantedFormError && <p className="text-sm font-bold text-red-500">{wantedFormError}</p>}

          <div className="flex gap-2 pt-2">
            <button
              onClick={() => { closeWantedForm(); setTab('wanted'); }}
              className="flex-1 py-2.5 rounded-xl border border-brand-border text-sm font-black text-stone-600 hover:bg-stone-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateWanted}
              disabled={wantedSaving}
              className="flex-1 py-2.5 rounded-xl bg-brand-dark text-white text-sm font-black hover:bg-stone-700 transition-colors disabled:opacity-50"
            >
              {wantedSaving ? 'Posting…' : 'Post Request'}
            </button>
          </div>
        </div>
      ) : loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[0, 1, 2, 3].map(i => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.05, ease }}
              className="paper-card rounded overflow-hidden"
            >
              <Shimmer className="h-36 w-full rounded-none" />
              <div className="p-4 space-y-2">
                <Shimmer className="h-3 w-1/3" />
                <Shimmer className="h-4 w-2/3" />
                <Shimmer className="h-5 w-1/4" />
              </div>
            </motion.div>
          ))}
        </div>
      ) : (tab === 'wanted' || tab === 'my-wanted') ? (
        wantedList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <HandHeart className="w-10 h-10 text-stone-200 mb-4" />
            <p className="text-sm font-bold text-stone-500">
              {tab === 'wanted' ? 'No requests yet.' : "You haven't posted any requests."}
            </p>
            <p className="text-xs text-stone-400 mt-1">
              {tab === 'wanted' ? 'Post one if you\'re looking for something.' : 'Looking for a textbook or item? Post a request.'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {wantedList.map((w, i) => {
              const isOwnRequest = w.requester_type === sellerType && w.requester_id === sellerId;
              return (
                <motion.div
                  key={w.id}
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className={`paper-card rounded px-5 py-4 flex items-center gap-4 ${w.status === 'closed' ? 'opacity-60' : ''}`}
                >
                  <div className="w-9 h-9 rounded-xl bg-stone-100 flex items-center justify-center shrink-0">
                    <HandHeart className="w-4 h-4 text-stone-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-stone-900">{w.title}</p>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      {w.subject && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-500">{w.subject}</span>}
                      {w.grade && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-500">Grade {w.grade}</span>}
                      {w.budget != null && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-500">Budget {formatPrice(w.budget)}</span>}
                      {tab === 'wanted' && <span className="text-[10px] text-stone-400">{w.requester_label}</span>}
                      {w.status === 'closed' && <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-stone-200 text-stone-500">Closed</span>}
                    </div>
                  </div>
                  {tab === 'wanted' && !isOwnRequest && w.status === 'open' && (
                    <button
                      onClick={() => handleImSellingThis(w)}
                      className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black bg-brand-dark text-white hover:bg-stone-700 transition-colors"
                    >
                      <Tag className="w-3.5 h-3.5" /> I'm Selling This
                    </button>
                  )}
                  {tab === 'my-wanted' && (
                    <div className="flex items-center gap-1 shrink-0">
                      {w.status === 'open' && (
                        <button
                          onClick={() => handleCloseWanted(w)}
                          className="px-3 py-2 rounded-xl text-xs font-black bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 transition-colors"
                        >
                          Mark Found
                        </button>
                      )}
                      <button
                        onClick={() => setDeleteWantedTarget(w)}
                        className="p-2 rounded-xl hover:bg-red-50 transition-colors text-stone-400 hover:text-red-500"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )
      ) : tab === 'guide' ? (
        guideItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <BookOpen className="w-10 h-10 text-stone-200 mb-4" />
            <p className="text-sm font-bold text-stone-500">No supply guide yet.</p>
            <p className="text-xs text-stone-400 mt-1">Your school hasn't published a supply list.</p>
          </div>
        ) : (() => {
          const visibleItems = sellerType === 'student' ? guideItems.filter(item => !removedIds.has(item.id)) : guideItems;
          const total = visibleItems.reduce((sum, item) => sum + (item.avg_price ?? 0), 0);
          const grouped = new Map<string, SupplyGuideItem[]>();
          for (const item of guideItems) {
            const key = item.subject ?? 'General';
            if (!grouped.has(key)) grouped.set(key, []);
            grouped.get(key)!.push(item);
          }
          return (
            <div className="space-y-6">
              {sellerType === 'student' && (
                <div className="rounded px-6 py-5 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/50">Shopping List</p>
                    <p className="text-2xl font-black text-white mt-0.5">{formatPrice(total)}</p>
                  </div>
                  <p className="text-xs text-white/60">{visibleItems.length} item{visibleItems.length === 1 ? '' : 's'}</p>
                </div>
              )}
              {Array.from(grouped.entries()).map(([subject, list]) => (
                <div key={subject}>
                  <p className="text-xs font-black uppercase tracking-widest text-stone-500 mb-3">{subject}</p>
                  <div className="space-y-2">
                    {list.map((item, i) => {
                      const removed = removedIds.has(item.id);
                      return (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.03 }}
                          className={`paper-card rounded px-5 py-4 flex items-center gap-4 ${removed ? 'opacity-50' : ''}`}
                        >
                          {sellerType === 'student' && (
                            <button
                              onClick={() => handleToggleRemoval(item)}
                              className={`w-6 h-6 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
                                removed ? 'border-stone-300' : 'border-emerald-500 bg-emerald-500'
                              }`}
                              title={removed ? 'Add back to my list' : "I already have this"}
                            >
                              {!removed && <CheckCircle2 className="w-4 h-4 text-white" />}
                            </button>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-stone-900">{item.item_name}</p>
                            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-500">Grade {item.grade}</span>
                              {item.avg_price != null && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-500">
                                  ~{formatPrice(item.avg_price)}
                                </span>
                              )}
                              {item.isbn && <span className="text-[10px] text-stone-400">ISBN {item.isbn}</span>}
                              {(item.listing_count ?? 0) > 0 && (
                                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700">
                                  {item.listing_count} on Marketplace
                                </span>
                              )}
                            </div>
                            {item.retailers.length > 0 && (
                              <p className="text-[10px] text-stone-400 mt-1">
                                {item.retailers.map(r => r.name).join(' · ')}
                              </p>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          );
        })()
      ) : listings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <ShoppingBag className="w-10 h-10 text-stone-200 mb-4" />
          <p className="text-sm font-bold text-stone-500">
            {tab === 'browse' ? 'No listings yet.' : "You haven't listed anything yet."}
          </p>
          <p className="text-xs text-stone-400 mt-1">
            {tab === 'browse' ? 'Check back soon, or list something yourself.' : 'Sell a textbook, calculator, or uniform item.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {listings.map((l, i) => {
            const coverUrl = l.images[0] ? imageUrls.get(l.images[0]) : null;
            const interested = interestedMap.get(l.id) ?? false;
            const isOwn = l.seller_type === sellerType && l.seller_id === sellerId;
            return (
              <motion.div
                key={l.id}
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`paper-card rounded overflow-hidden ${l.status === 'sold' ? 'opacity-60' : ''}`}
              >
                <div
                  onClick={() => { setDetailListing(l); setDetailImageIndex(0); }}
                  className="w-full text-left cursor-pointer"
                >
                <div className="h-36 bg-stone-100 flex items-center justify-center relative">
                  {coverUrl ? (
                    <img src={coverUrl} alt={l.title} className="w-full h-full object-cover" />
                  ) : (
                    <ShoppingBag className="w-8 h-8 text-stone-300" />
                  )}
                  {l.status === 'sold' && (
                    <div className="absolute top-2 right-2 bg-stone-900 text-white text-[10px] font-black px-2 py-1 rounded-full">
                      SOLD
                    </div>
                  )}
                </div>
                <div className="px-4 pt-4">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-500 flex items-center gap-1">
                      <Tag className="w-2.5 h-2.5" />
                      {CATEGORIES.find(c => c.id === l.category)?.label}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-500">
                      {CONDITIONS.find(c => c.id === l.condition)?.label}
                    </span>
                    {l.supply_guide_item_id != null && (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700">
                        Matches Supply Guide
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-bold text-stone-900 truncate">{l.title}</p>
                  <p className="text-lg font-black text-brand-dark mt-0.5">{formatPrice(l.price)}</p>
                </div>
                </div>
                <div className="px-4 pb-4">
                  {tab === 'browse' ? (
                    <>
                      <p className="text-xs text-stone-400 mt-1">{l.seller_label}</p>
                      {isOwn ? (
                        <div className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-black bg-stone-100 text-stone-500">
                          Your Listing
                        </div>
                      ) : (
                        <button
                          onClick={() => handleToggleInterest(l)}
                          disabled={l.status === 'sold'}
                          className={`mt-3 w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-black transition-colors disabled:opacity-40 ${
                            interested
                              ? 'bg-red-50 border border-red-200 text-red-600'
                              : 'bg-brand-dark text-white hover:bg-stone-700'
                          }`}
                        >
                          <Heart className={`w-3.5 h-3.5 ${interested ? 'fill-red-500' : ''}`} />
                          {interested ? 'Interested' : "I'm Interested"}
                        </button>
                      )}
                    </>
                  ) : (
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        onClick={() => openInterestModal(l)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-black bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors"
                      >
                        <Users className="w-3.5 h-3.5" /> {l.interest_count} Interested
                      </button>
                      {l.status === 'active' && (
                        <button
                          onClick={() => handleMarkSold(l)}
                          className="px-3 py-2 rounded-xl text-xs font-black bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 transition-colors"
                        >
                          Mark Sold
                        </button>
                      )}
                      <button
                        onClick={() => setDeleteTarget(l)}
                        className="p-2 rounded-xl hover:bg-red-50 transition-colors text-stone-400 hover:text-red-500"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
      </div>

      {/* ── Listing Detail Modal ──────────────────────────────── */}
      <AnimatePresence>
        {detailListing && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => setDetailListing(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 12, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 8, opacity: 0 }} transition={{ duration: 0.2, ease: 'easeOut' }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b border-brand-border/60 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
                <h2 className="text-base font-black text-stone-900 truncate pr-4">{detailListing.title}</h2>
                <button onClick={() => setDetailListing(null)} className="p-1.5 rounded-lg hover:bg-stone-100 transition-colors shrink-0">
                  <X className="w-4 h-4 text-stone-500" />
                </button>
              </div>

              <div className="h-64 bg-stone-100 relative flex items-center justify-center">
                {detailListing.images.length > 0 ? (
                  <>
                    <img
                      src={imageUrls.get(detailListing.images[detailImageIndex])}
                      alt={detailListing.title}
                      className="w-full h-full object-cover"
                    />
                    {detailListing.images.length > 1 && (
                      <>
                        <button
                          onClick={() => setDetailImageIndex(i => (i - 1 + detailListing.images.length) % detailListing.images.length)}
                          className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDetailImageIndex(i => (i + 1) % detailListing.images.length)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                          {detailListing.images.map((_, i) => (
                            <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === detailImageIndex ? 'bg-white' : 'bg-white/40'}`} />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <ShoppingBag className="w-10 h-10 text-stone-300" />
                )}
                {detailListing.status === 'sold' && (
                  <div className="absolute top-2 right-2 bg-stone-900 text-white text-[10px] font-black px-2 py-1 rounded-full">
                    SOLD
                  </div>
                )}
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-500 flex items-center gap-1">
                    <Tag className="w-2.5 h-2.5" />
                    {CATEGORIES.find(c => c.id === detailListing.category)?.label}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-500">
                    {CONDITIONS.find(c => c.id === detailListing.condition)?.label}
                  </span>
                  {detailListing.subject && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-500">
                      {detailListing.subject}
                    </span>
                  )}
                  {detailListing.grade && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-500">
                      Grade {detailListing.grade}
                    </span>
                  )}
                  {detailListing.supply_guide_item_id != null && (
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700">
                      Matches Supply Guide
                    </span>
                  )}
                </div>

                <p className="text-2xl font-black text-brand-dark">{formatPrice(detailListing.price)}</p>

                {detailListing.description && (
                  <p className="text-sm text-stone-600 leading-relaxed">{detailListing.description}</p>
                )}

                <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl">
                  <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center text-xs font-black text-stone-600 shrink-0">
                    {detailListing.seller_label[0]}
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">Sold by</p>
                    <p className="text-sm font-bold text-stone-800">{detailListing.seller_label}</p>
                  </div>
                </div>

                {tab === 'browse' && (
                  detailListing.seller_type === sellerType && detailListing.seller_id === sellerId ? (
                    <div className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-black bg-stone-100 text-stone-500">
                      This is your listing
                    </div>
                  ) : (
                    <button
                      onClick={() => handleToggleInterest(detailListing)}
                      disabled={detailListing.status === 'sold'}
                      className={`w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-black transition-colors disabled:opacity-40 ${
                        (interestedMap.get(detailListing.id) ?? false)
                          ? 'bg-red-50 border border-red-200 text-red-600'
                          : 'bg-brand-dark text-white hover:bg-stone-700'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${(interestedMap.get(detailListing.id) ?? false) ? 'fill-red-500' : ''}`} />
                      {(interestedMap.get(detailListing.id) ?? false) ? 'Interested' : "I'm Interested"}
                    </button>
                  )
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Interested Users Modal ────────────────────────────── */}
      <AnimatePresence>
        {interestModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => setInterestModal(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 12, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 8, opacity: 0 }} transition={{ duration: 0.2, ease: 'easeOut' }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-sm max-h-[80vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b border-brand-border/60 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
                <h2 className="text-base font-black text-stone-900">Interested Buyers</h2>
                <button onClick={() => setInterestModal(null)} className="p-1.5 rounded-lg hover:bg-stone-100 transition-colors">
                  <X className="w-4 h-4 text-stone-500" />
                </button>
              </div>
              <div className="p-6">
                {interestLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-5 h-5 border-2 border-brand-border border-t-stone-700 rounded-full animate-spin" />
                  </div>
                ) : interestUsers.length === 0 ? (
                  <p className="text-sm text-stone-400 text-center py-4">No one has expressed interest yet.</p>
                ) : (
                  <div className="space-y-2">
                    {interestUsers.map((u, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl">
                        <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center text-xs font-black text-stone-600 shrink-0">
                          {u.label[0]}
                        </div>
                        <p className="text-sm font-bold text-stone-800">{u.label}</p>
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-xs text-stone-400 mt-4 text-center">Contact them at school to arrange the sale.</p>
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
              <h2 className="text-base font-black text-stone-900 mb-1">Delete listing?</h2>
              <p className="text-sm text-stone-500 mb-5"><strong>{deleteTarget.title}</strong> will be permanently removed.</p>
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

      {/* ── Delete Wanted Confirm ──────────────────────────────── */}
      <AnimatePresence>
        {deleteWantedTarget && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => setDeleteWantedTarget(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 12, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 8, opacity: 0 }} transition={{ duration: 0.2, ease: 'easeOut' }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6"
              onClick={e => e.stopPropagation()}
            >
              <h2 className="text-base font-black text-stone-900 mb-1">Delete request?</h2>
              <p className="text-sm text-stone-500 mb-5"><strong>{deleteWantedTarget.title}</strong> will be permanently removed.</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setDeleteWantedTarget(null)}
                  className="flex-1 py-2.5 rounded-xl border border-brand-border text-sm font-black text-stone-600 hover:bg-stone-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteWanted}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-sm font-black hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
