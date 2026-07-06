import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus, X, ChevronRight, ClipboardList,
  Pencil, Trash2, CalendarDays, CheckCircle2, Circle,
  AlertTriangle, Zap,
} from 'lucide-react';
import { computeSheetAnalytics } from '../../../lib/teacherAnalytics';
import { fetchBestInterventionType } from '../../../lib/teacherAnalytics';
import {
  fetchTeacherMarkSheets, createMarkSheet, deleteMarkSheet,
  fetchSheetMarks, saveStudentMark, fetchTeacherTermWeightStatus,
  type MarkSheetGroup, type MarkSheet, type StudentMark, type TermWeightStatus,
} from '../../../lib/marks';
import { fetchSubjects, fetchTeacherStudents, type Subject } from '../../../lib/students';
import { createEvent } from '../../../lib/events';
import { createIntervention } from '../../../lib/interventions';
import { supabaseAdmin } from '../../../lib/supabase';
import type { TeacherSession } from '../../../lib/auth';

const GRADES = [8, 9, 10, 11, 12];

function pct(mark: number | null, total: number): string {
  if (mark === null) return '—';
  return `${Math.round((mark / total) * 100)}%`;
}
function grade(mark: number | null, total: number): { label: string; color: string } {
  if (mark === null) return { label: '—', color: 'text-stone-500' };
  const p = (mark / total) * 100;
  if (p >= 80) return { label: 'Outstanding', color: 'text-emerald-600' };
  if (p >= 70) return { label: 'Merit', color: 'text-blue-600' };
  if (p >= 60) return { label: 'Adequate', color: 'text-sky-600' };
  if (p >= 50) return { label: 'Moderate', color: 'text-amber-600' };
  if (p >= 40) return { label: 'Elementary', color: 'text-orange-600' };
  return { label: 'Not Achieved', color: 'text-red-600' };
}

interface MarksPageProps {
  session: TeacherSession;
}

type View = 'groups' | 'sheet';

export default function MarksPage({ session }: MarksPageProps) {
  const [groups, setGroups] = useState<MarkSheetGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [termStatus, setTermStatus] = useState<TermWeightStatus[]>([]);

  // View state
  const [view, setView] = useState<View>('groups');
  const [activeSheet, setActiveSheet] = useState<MarkSheet | null>(null);
  const [sheetMarks, setSheetMarks] = useState<StudentMark[]>([]);
  const [sheetLoading, setSheetLoading] = useState(false);

  // Create sheet modal
  const [createModal, setCreateModal] = useState(false);
  const [form, setForm] = useState({ title: '', subject_id: '', grade: '', scope: '', total: '', term: '1', weight: '' });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  // Delete confirm
  const [deleteSheet, setDeleteSheet] = useState<MarkSheet | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Mark entry state — { [student_mark_id]: { mark: string, note: string } }
  const [markDraft, setMarkDraft] = useState<Record<number, { mark: string; note: string }>>({});
  const [savingMark, setSavingMark] = useState<number | null>(null);
  const [savedMark, setSavedMark] = useState<number | null>(null);

  // Push to calendar
  const [pushingCalendar, setPushingCalendar] = useState(false);
  const [pushedCalendar, setPushedCalendar] = useState(false);

  // Campaign: bulk-assign interventions to all at-risk students on this sheet
  const [campaignState, setCampaignState] = useState<'idle' | 'running' | 'done'>('idle');
  const [campaignCount, setCampaignCount] = useState(0);

  useEffect(() => {
    fetchSubjects().then(setSubjects);
    reload();
  }, []);

  async function reload() {
    setLoading(true);
    const [g, ts] = await Promise.all([
      fetchTeacherMarkSheets(session.teacher_id, session.school_id),
      fetchTeacherTermWeightStatus(session.teacher_id, session.school_id),
    ]);
    setGroups(g);
    setTermStatus(ts);
    setLoading(false);
  }

  function toggleGroup(key: string) {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  async function openSheet(sheet: MarkSheet) {
    setActiveSheet(sheet);
    setView('sheet');
    setSheetLoading(true);
    setPushedCalendar(!!sheet.event_id);
    setRiskBannerDismissed(false);
    setCampaignState('idle');
    setCampaignCount(0);
    const marks = await fetchSheetMarks(sheet.id);
    setSheetMarks(marks);
    // Init drafts from existing marks
    const drafts: Record<number, { mark: string; note: string }> = {};
    marks.forEach(m => {
      drafts[m.id] = {
        mark: m.mark !== null ? String(m.mark) : '',
        note: m.note ?? '',
      };
    });
    setMarkDraft(drafts);
    setSheetLoading(false);
  }

  function backToGroups() {
    setView('groups');
    setActiveSheet(null);
    setSheetMarks([]);
    setMarkDraft({});
    setSavedMark(null);
    reload();
  }

  // ── Create sheet ─────────────────────────────────────────────

  async function handleCreate() {
    if (!form.title.trim()) { setFormError('Title is required.'); return; }
    if (!form.subject_id)   { setFormError('Select a subject.'); return; }
    if (!form.grade)        { setFormError('Select a grade.'); return; }
    if (!form.total || isNaN(Number(form.total)) || Number(form.total) <= 0) {
      setFormError('Enter a valid total mark.'); return;
    }
    const weightNum = form.weight === '' ? 0 : Number(form.weight);
    if (isNaN(weightNum) || weightNum < 0 || weightNum > 100) {
      setFormError('Weight must be between 0 and 100.'); return;
    }

    setSaving(true);
    setFormError('');
    const result = await createMarkSheet({
      school_id: session.school_id,
      teacher_id: session.teacher_id,
      subject_id: Number(form.subject_id),
      grade: Number(form.grade),
      title: form.title,
      scope: form.scope,
      total: Number(form.total),
      weight: weightNum,
      term: Number(form.term),
    });

    if (!result.success) { setFormError(result.error); setSaving(false); return; }

    setCreateModal(false);
    setForm({ title: '', subject_id: '', grade: '', scope: '', total: '', term: '1', weight: '' });
    setSaving(false);

    await reload();
    // Auto-expand the new group
    const key = `${form.subject_id}-${form.grade}`;
    setExpandedGroups(prev => new Set([...prev, key]));
    // Open the new sheet immediately
    openSheet(result.sheet);
  }

  // ── Save a mark ──────────────────────────────────────────────

  async function handleSaveMark(sm: StudentMark) {
    const draft = markDraft[sm.id];
    if (!draft) return;
    const markVal = draft.mark === '' ? null : Number(draft.mark);
    if (draft.mark !== '' && (isNaN(markVal!) || markVal! < 0 || markVal! > activeSheet!.total)) return;

    setSavingMark(sm.id);
    await saveStudentMark(sm.sheet_id, sm.student_id, sm.school_id, markVal, draft.note || null);
    setSavingMark(null);
    setSavedMark(sm.id);
    setTimeout(() => setSavedMark(null), 1800);

    // Update local state
    setSheetMarks(prev => prev.map(m =>
      m.id === sm.id ? { ...m, mark: markVal, note: draft.note || null, marked_at: markVal !== null ? new Date().toISOString() : null } : m
    ));
  }

  // ── Push to calendar ─────────────────────────────────────────

  async function handlePushCalendar() {
    if (!activeSheet || pushedCalendar) return;
    setPushingCalendar(true);
    const subLabel = subjects.find(s => s.id === activeSheet.subject_id)?.label ?? 'Assessment';
    const result = await createEvent({
      school_id: session.school_id,
      created_by_teacher_id: session.teacher_id,
      event_type: 'assessment',
      title: `${activeSheet.title}${activeSheet.scope ? ` — ${activeSheet.scope}` : ''}`,
      description: `${subLabel} · Grade ${activeSheet.grade} · Out of ${activeSheet.total}`,
      event_date: new Date().toISOString().split('T')[0],
      target_type: 'grade',
      target_grades: [activeSheet.grade],
    });
    setPushingCalendar(false);
    if (result.success) setPushedCalendar(true);
  }

  // ── Delete sheet ─────────────────────────────────────────────

  async function handleDelete() {
    if (!deleteSheet) return;
    setDeleting(true);
    await deleteMarkSheet(deleteSheet.id, session.school_id);
    setDeleting(false);
    setDeleteSheet(null);
    reload();
  }

  // ── Campaign: bulk-assign interventions to at-risk students ──
  // Finds every student below 50% on the current sheet and creates
  // an evidence-based intervention for each via createIntervention().

  async function handleCampaign() {
    if (!activeSheet || campaignState !== 'idle') return;
    setCampaignState('running');

    const subjectLabel = subjects.find(s => s.id === activeSheet.subject_id)?.label ?? 'Unknown';
    const below = sheetMarks.filter(m => m.mark !== null && (m.mark / activeSheet.total) * 100 < 50);

    // Get best intervention type once for this subject (shared for all students)
    const best = await fetchBestInterventionType(
      session.school_id,
      subjectLabel,
      ['library_topic', 'revision', 'resource_review'],
    );
    const type = best?.type ?? 'library_topic';
    const rationale = best?.rationale ?? `Recommended: ${type} for ${subjectLabel}`;

    const descMap: Record<string, string> = {
      library_topic:   `Study ${subjectLabel} in the library`,
      revision:        `Revise ${subjectLabel} core concepts`,
      resource_review: `Review ${subjectLabel} resources`,
      past_paper:      `Complete a ${subjectLabel} past paper`,
    };
    const pageMap: Record<string, string> = {
      library_topic: 'library', revision: 'library',
      resource_review: 'resources', past_paper: 'pastpapers',
    };

    let created = 0;
    for (const sm of below) {
      // Look up subjectId for this student
      const { data: link } = await supabaseAdmin
        .from('teacher_students')
        .select('subject_id')
        .eq('student_id', sm.student_id)
        .eq('teacher_id', session.teacher_id)
        .limit(1)
        .single();
      const subjectId = (link as any)?.subject_id as number ?? activeSheet.subject_id;

      const avg = Math.round((sm.mark! / activeSheet.total) * 100);

      try {
        await createIntervention(
          sm.student_id,
          session.school_id,
          subjectLabel,
          subjectId,
          type as any,
          avg < 40 ? 'below_pass' : 'high_risk',
          descMap[type] ?? `Intervention for ${subjectLabel}`,
          pageMap[type] ?? 'library',
          avg,
          rationale,
        );
        created++;
      } catch {
        // createIntervention is idempotent — dedup handles existing ones
      }
    }

    setCampaignCount(created);
    setCampaignState('done');
  }

  // ── Analytics for sheet header ───────────────────────────────
  const marked   = sheetMarks.filter(m => m.mark !== null).length;
  const unmarked = sheetMarks.length - marked;
  const avgMark  = marked > 0
    ? sheetMarks.filter(m => m.mark !== null).reduce((s, m) => s + m.mark!, 0) / marked
    : null;

  // Full analytics from pure function — recomputed whenever sheetMarks changes
  const analytics = activeSheet
    ? computeSheetAnalytics(sheetMarks.map(m => ({ mark: m.mark, total: activeSheet.total })))
    : null;

  // Students at risk (below 50%) — for the risk banner
  const atRiskMarks = activeSheet
    ? sheetMarks.filter(m => m.mark !== null && (m.mark / activeSheet.total) * 100 < 50)
    : [];
  const [riskBannerDismissed, setRiskBannerDismissed] = useState(false);

  // ── Render ────────────────────────────────────────────────────

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:p-6 md:p-8">

      {/* ── Groups view ───────────────────────────────────────── */}
      {view === 'groups' && (
        <>
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="eyebrow">Marks</span>
              <h1 className="text-2xl font-black text-brand-dark tracking-tight">Mark Sheets</h1>
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => { setCreateModal(true); setFormError(''); }}
              className="flex items-center gap-2 bg-brand-dark text-white text-sm font-black px-4 py-2.5 rounded-xl hover:bg-stone-700 transition-colors"
            >
              <Plus className="w-4 h-4" /> New Sheet
            </motion.button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                className="w-5 h-5 border-2 border-brand-border border-t-stone-700 rounded-full" />
            </div>
          ) : groups.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <ClipboardList className="w-10 h-10 text-stone-200 mb-4" />
              <p className="text-sm font-bold text-stone-500">No mark sheets yet.</p>
              <p className="text-xs text-stone-400 mt-1">Create your first sheet to get started.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {groups.map((group, gi) => {
                const isOpen = expandedGroups.has(group.key);
                return (
                  <motion.div
                    key={group.key}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: gi * 0.05 }}
                    className="card-premium bg-white rounded-[24px] border border-brand-border overflow-hidden"
                  >
                    {/* Group header */}
                    <button
                      onClick={() => toggleGroup(group.key)}
                      className="w-full flex items-center justify-between px-5 py-4 hover:bg-stone-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-stone-100 flex items-center justify-center shrink-0">
                          <ClipboardList className="w-4 h-4 text-stone-500" />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-black text-brand-dark">{group.subject_label}</p>
                          <p className="text-xs text-stone-500 font-bold">Grade {group.grade} · {group.sheets.length} sheet{group.sheets.length !== 1 ? 's' : ''}</p>
                        </div>
                      </div>
                      <motion.div animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.18 }}>
                        <ChevronRight className="w-4 h-4 text-stone-500" />
                      </motion.div>
                    </button>

                    {/* Sheet list */}
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                          transition={{ duration: 0.2, ease: 'easeOut' }}
                          className="overflow-hidden"
                        >
                          {/* Per-term weight status */}
                          {(() => {
                            const groupTermStatus = termStatus
                              .filter(t => t.subject_id === group.subject_id && t.grade === group.grade)
                              .sort((a, b) => a.term - b.term);
                            if (groupTermStatus.length === 0) return null;
                            return (
                              <div className="border-t border-brand-border/60 px-5 py-3 flex flex-wrap gap-2 bg-stone-50/60">
                                {groupTermStatus.map(t => (
                                  <span key={t.key} className={`text-[11px] font-black px-2.5 py-1 rounded-full ${
                                    t.isComplete
                                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                      : 'bg-stone-100 text-stone-500 border border-transparent'
                                  }`}>
                                    Term {t.term}: {t.isComplete ? 'Final mark ready' : `${t.weightTotal}% weight used`}
                                  </span>
                                ))}
                              </div>
                            );
                          })()}

                          <div className="border-t border-brand-border/60 divide-y divide-stone-100">
                            {group.sheets.map(sheet => {
                              return (
                                <div key={sheet.id} className="flex items-center gap-3 px-5 py-3 hover:bg-stone-50 transition-colors">
                                  <button
                                    onClick={() => openSheet(sheet)}
                                    className="flex-1 text-left"
                                  >
                                    <p className="text-sm font-bold text-brand-dark">{sheet.title}</p>
                                    <p className="text-xs text-stone-500 mt-0.5">
                                      Term {sheet.term} · {sheet.scope ? `${sheet.scope} · ` : ''}Out of {sheet.total}
                                      {sheet.weight > 0 ? ` · ${sheet.weight}% weight` : ' · record only'}
                                      {sheet.event_id ? ' · 📅 On calendar' : ''}
                                    </p>
                                  </button>
                                  <button
                                    onClick={() => openSheet(sheet)}
                                    className="p-1.5 rounded-lg hover:bg-stone-100 transition-colors text-stone-500 hover:text-stone-700"
                                  >
                                    <Pencil className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => setDeleteSheet(sheet)}
                                    className="p-1.5 rounded-lg hover:bg-red-50 transition-colors text-stone-400 hover:text-red-500"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ── Sheet view ────────────────────────────────────────── */}
      {view === 'sheet' && activeSheet && (
        <>
          {/* Back + header */}
          <div className="mb-6">
            <button
              onClick={backToGroups}
              className="flex items-center gap-1.5 text-xs font-black text-stone-500 hover:text-stone-700 transition-colors mb-4 uppercase tracking-widest"
            >
              <ChevronRight className="w-3.5 h-3.5 rotate-180" /> Back
            </button>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-stone-500 mb-1">
                  {subjects.find(s => s.id === activeSheet.subject_id)?.label ?? ''} · Grade {activeSheet.grade}
                </p>
                <h1 className="text-2xl font-black text-brand-dark tracking-tight">{activeSheet.title}</h1>
                {activeSheet.scope && <p className="text-sm text-stone-500 mt-0.5">{activeSheet.scope}</p>}
              </div>
              {/* Push to calendar */}
              <motion.button
                whileHover={!pushedCalendar ? { scale: 1.03 } : {}}
                whileTap={!pushedCalendar ? { scale: 0.97 } : {}}
                onClick={handlePushCalendar}
                disabled={pushedCalendar || pushingCalendar}
                className={`flex items-center gap-2 text-xs font-black px-3 py-2 rounded-xl transition-all shrink-0 ${
                  pushedCalendar
                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200 border border-transparent'
                }`}
              >
                <CalendarDays className="w-3.5 h-3.5" />
                {pushedCalendar ? 'On Calendar' : pushingCalendar ? 'Adding…' : 'Add to Calendar'}
              </motion.button>
            </div>

            {/* ── Analytics card ───────────────────────────── */}
            {analytics && analytics.markedCount > 0 && (
              <div className="mt-4 card-premium bg-white border border-brand-border rounded-[24px] p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-stone-500 mb-3">
                  Assessment Analytics · {marked}/{sheetMarks.length} marked
                  {unmarked > 0 && <span className="ml-2 text-amber-500">{unmarked} unmarked</span>}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { label: 'Class Avg', value: `${analytics.classAvg}%`, color: analytics.classAvg >= 70 ? 'text-emerald-600' : analytics.classAvg >= 50 ? 'text-amber-600' : 'text-red-500', bg: analytics.classAvg >= 70 ? 'bg-emerald-50' : analytics.classAvg >= 50 ? 'bg-amber-50' : 'bg-red-50' },
                    { label: 'Pass Rate', value: `${analytics.passRate}%`, color: analytics.passRate >= 70 ? 'text-emerald-600' : analytics.passRate >= 50 ? 'text-amber-600' : 'text-red-500', bg: analytics.passRate >= 70 ? 'bg-emerald-50' : analytics.passRate >= 50 ? 'bg-amber-50' : 'bg-red-50' },
                    { label: 'Highest',   value: `${analytics.highest}%`,  color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Lowest',    value: `${analytics.lowest}%`,   color: analytics.lowest >= 50 ? 'text-stone-600' : 'text-red-500', bg: analytics.lowest >= 50 ? 'bg-stone-50' : 'bg-red-50' },
                  ].map(stat => (
                    <div key={stat.label} className={`${stat.bg} rounded-xl p-2.5 text-center`}>
                      <p className={`text-base font-black ${stat.color}`}>{stat.value}</p>
                      <p className="text-[9px] font-bold text-stone-500 uppercase tracking-wider mt-0.5">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* Progress bar showing pass rate */}
                <div className="mt-3">
                  <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${analytics.passRate >= 70 ? 'bg-emerald-500' : analytics.passRate >= 50 ? 'bg-amber-500' : 'bg-red-400'}`}
                      style={{ width: `${analytics.passRate}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-stone-500 mt-1">
                    {analytics.markedCount - Math.round(analytics.markedCount * analytics.passRate / 100)} student{analytics.markedCount - Math.round(analytics.markedCount * analytics.passRate / 100) !== 1 ? 's' : ''} below pass mark
                  </p>
                </div>
              </div>
            )}

            {/* ── Risk banner + campaign ────────────────────── */}
            {atRiskMarks.length > 0 && !riskBannerDismissed && analytics && analytics.markedCount >= 3 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className="mt-3 bg-red-50 border border-red-200 rounded-2xl p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5 flex-1 min-w-0">
                    <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-black text-red-700">
                        {atRiskMarks.length} student{atRiskMarks.length !== 1 ? 's' : ''} below pass mark
                      </p>
                      <p className="text-[11px] text-red-500 mt-0.5">
                        {atRiskMarks.map(m => `${m.student_surname} ${m.student_name?.[0]}.`).slice(0, 3).join(', ')}
                        {atRiskMarks.length > 3 && ` +${atRiskMarks.length - 3} more`}
                      </p>
                    </div>
                  </div>
                  <button onClick={() => setRiskBannerDismissed(true)}
                    className="text-red-300 hover:text-red-500 transition-colors shrink-0">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Campaign button */}
                <div className="mt-3 pt-3 border-t border-red-200">
                  {campaignState === 'done' ? (
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <p className="text-[11px] font-black text-emerald-700">
                        {campaignCount} intervention{campaignCount !== 1 ? 's' : ''} assigned — visible on each student's home
                      </p>
                    </div>
                  ) : (
                    <button
                      onClick={handleCampaign}
                      disabled={campaignState === 'running'}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-black transition-all ${
                        campaignState === 'running'
                          ? 'bg-red-100 text-red-400 cursor-default'
                          : 'bg-red-600 text-white hover:bg-red-700 active:scale-95'
                      }`}
                    >
                      {campaignState === 'running' ? (
                        <><div className="w-3 h-3 border border-red-300 border-t-transparent rounded-full animate-spin" /> Assigning…</>
                      ) : (
                        <><Zap className="w-3 h-3" /> Assign intervention to all {atRiskMarks.length}</>
                      )}
                    </button>
                  )}
                </div>
              </motion.div>
            )}

            {/* Legacy pill row — shown only when nothing is marked yet */}
            {(!analytics || analytics.markedCount === 0) && (
              <div className="mt-4 flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2 bg-white border border-brand-border rounded-xl px-3 py-2">
                  <span className="text-xs font-black text-stone-500 uppercase tracking-widest">Total</span>
                  <span className="text-sm font-black text-brand-dark">{activeSheet.total}</span>
                </div>
                <div className="flex items-center gap-2 bg-white border border-brand-border rounded-xl px-3 py-2">
                  <span className="text-xs font-black text-stone-500 uppercase tracking-widest">Students</span>
                  <span className="text-sm font-black text-brand-dark">{sheetMarks.length}</span>
                </div>
                {unmarked > 0 && (
                  <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
                    <span className="text-xs font-black text-amber-600">{unmarked} unmarked</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {sheetLoading ? (
            <div className="flex items-center justify-center py-24">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                className="w-5 h-5 border-2 border-brand-border border-t-stone-700 rounded-full" />
            </div>
          ) : sheetMarks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center card-premium bg-white rounded-[24px] border border-brand-border">
              <ClipboardList className="w-10 h-10 text-stone-200 mb-4" />
              <p className="text-sm font-bold text-stone-500">No students found for this sheet.</p>
              <p className="text-xs text-stone-400 mt-1">Make sure students are linked to this subject and grade.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {sheetMarks.map((sm, i) => {
                const draft = markDraft[sm.id] ?? { mark: sm.mark !== null ? String(sm.mark) : '', note: sm.note ?? '' };
                const markNum = draft.mark === '' ? null : Number(draft.mark);
                const isInvalid = draft.mark !== '' && (isNaN(markNum!) || markNum! < 0 || markNum! > activeSheet.total);
                const isSaving = savingMark === sm.id;
                const isSaved  = savedMark === sm.id;
                const g = grade(sm.mark, activeSheet.total);

                return (
                  <motion.div
                    key={sm.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="card-premium bg-white rounded-[24px] border border-brand-border px-5 py-4"
                  >
                    <div className="flex items-start gap-4">
                      {/* Student info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center shrink-0">
                            <span className="text-[10px] font-black text-stone-600">
                              {sm.student_surname?.[0]}{sm.student_name?.[0]}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-black text-brand-dark">{sm.student_surname}, {sm.student_name}</p>
                            <p className="text-[10px] text-stone-500 font-bold">{sm.student_code}</p>
                          </div>
                          {sm.mark !== null && (
                            <span className={`ml-auto text-xs font-black ${g.color}`}>{g.label}</span>
                          )}
                        </div>

                        <div className="flex items-center gap-3 flex-wrap">
                          {/* Mark input */}
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min={0}
                              max={activeSheet.total}
                              placeholder="Mark"
                              value={draft.mark}
                              onChange={e => setMarkDraft(prev => ({
                                ...prev,
                                [sm.id]: { ...draft, mark: e.target.value },
                              }))}
                              className={`w-20 px-3 py-1.5 rounded-xl border text-sm font-bold text-brand-dark text-center focus:outline-none focus:ring-2 focus:ring-brand-dark transition-colors ${
                                isInvalid ? 'border-red-300 bg-red-50' : 'border-brand-border'
                              }`}
                            />
                            <span className="text-sm font-black text-stone-500">/ {activeSheet.total}</span>
                            {draft.mark !== '' && !isInvalid && (
                              <span className="text-xs font-bold text-stone-500">
                                {pct(Number(draft.mark), activeSheet.total)}
                              </span>
                            )}
                          </div>

                          {/* Note input */}
                          <input
                            type="text"
                            placeholder="Note (optional)"
                            value={draft.note}
                            onChange={e => setMarkDraft(prev => ({
                              ...prev,
                              [sm.id]: { ...draft, note: e.target.value },
                            }))}
                            className="flex-1 min-w-[140px] px-3 py-1.5 rounded-xl border border-brand-border text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-dark"
                          />

                          {/* Save button */}
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleSaveMark(sm)}
                            disabled={isSaving || isInvalid}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all disabled:opacity-40 ${
                              isSaved
                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                                : 'bg-brand-dark text-white hover:bg-stone-700'
                            }`}
                          >
                            {isSaved
                              ? <><CheckCircle2 className="w-3.5 h-3.5" /> Saved</>
                              : isSaving
                              ? 'Saving…'
                              : <><Circle className="w-3.5 h-3.5" /> Save</>
                            }
                          </motion.button>
                        </div>
                        {isInvalid && (
                          <p className="text-xs text-red-500 font-bold mt-1">Mark must be between 0 and {activeSheet.total}.</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ── Create sheet modal ────────────────────────────────── */}
      <AnimatePresence>
        {createModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => setCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 12, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 8, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-brand-border/60">
                <h2 className="text-base font-black text-brand-dark">New Mark Sheet</h2>
                <button onClick={() => setCreateModal(false)} className="p-1.5 rounded-lg hover:bg-stone-100 transition-colors">
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
                    placeholder="e.g. Chapter 3 Test"
                    className="w-full px-3 py-2.5 rounded-xl border border-brand-border text-sm font-bold text-brand-dark placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-dark"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-2">Subject *</label>
                  <select
                    value={form.subject_id}
                    onChange={e => setForm(f => ({ ...f, subject_id: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-brand-border text-sm font-bold text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-dark bg-white"
                  >
                    <option value="">Select subject…</option>
                    {subjects.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                  </select>
                </div>

                {/* Grade */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-2">Grade *</label>
                  <div className="flex gap-1.5 flex-wrap">
                    {GRADES.map(g => (
                      <button
                        key={g}
                        onClick={() => setForm(f => ({ ...f, grade: String(g) }))}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                          form.grade === String(g) ? 'bg-brand-dark text-white' : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                        }`}
                      >
                        Grade {g}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Scope */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-2">Scope <span className="normal-case font-bold text-stone-400">(optional)</span></label>
                  <input
                    value={form.scope}
                    onChange={e => setForm(f => ({ ...f, scope: e.target.value }))}
                    placeholder="e.g. Term 1, Chapters 1–4"
                    className="w-full px-3 py-2.5 rounded-xl border border-brand-border text-sm font-bold text-brand-dark placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-dark"
                  />
                </div>

                {/* Total */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-2">Total marks *</label>
                  <input
                    type="number"
                    min={1}
                    value={form.total}
                    onChange={e => setForm(f => ({ ...f, total: e.target.value }))}
                    placeholder="e.g. 100"
                    className="w-full px-3 py-2.5 rounded-xl border border-brand-border text-sm font-bold text-brand-dark placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-dark"
                  />
                </div>

                {/* Term */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-2">Term *</label>
                  <div className="flex gap-1.5 flex-wrap">
                    {[1, 2, 3, 4].map(t => (
                      <button
                        key={t}
                        onClick={() => setForm(f => ({ ...f, term: String(t) }))}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                          form.term === String(t) ? 'bg-brand-dark text-white' : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                        }`}
                      >
                        Term {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Weight */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-2">
                    Weight toward final mark <span className="normal-case font-bold text-stone-400">(% — 0 if just for record)</span>
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={form.weight}
                    onChange={e => setForm(f => ({ ...f, weight: e.target.value }))}
                    placeholder="e.g. 20"
                    className="w-full px-3 py-2.5 rounded-xl border border-brand-border text-sm font-bold text-brand-dark placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-dark"
                  />
                  <p className="text-xs text-stone-400 mt-1.5">
                    Weights for this subject, grade and term add up to the final mark once they reach 100%.
                  </p>
                </div>

                {formError && <p className="text-sm font-bold text-red-500">{formError}</p>}
              </div>

              <div className="flex gap-2 px-6 pb-6">
                <button
                  onClick={() => setCreateModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-brand-border text-sm font-black text-stone-600 hover:bg-stone-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={saving}
                  className="flex-1 py-2.5 rounded-xl bg-brand-dark text-white text-sm font-black hover:bg-stone-700 transition-colors disabled:opacity-50"
                >
                  {saving ? 'Creating…' : 'Create & Open'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Delete confirm modal ──────────────────────────────── */}
      <AnimatePresence>
        {deleteSheet && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => setDeleteSheet(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 12, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 8, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6"
              onClick={e => e.stopPropagation()}
            >
              <h2 className="text-base font-black text-brand-dark mb-1">Delete mark sheet?</h2>
              <p className="text-sm text-stone-500 mb-5">
                <strong>{deleteSheet.title}</strong> and all student marks will be permanently deleted.
              </p>
              <div className="flex gap-2">
                <button onClick={() => setDeleteSheet(null)}
                  className="flex-1 py-2.5 rounded-xl border border-brand-border text-sm font-black text-stone-600 hover:bg-stone-50 transition-colors">
                  Cancel
                </button>
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
