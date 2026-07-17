import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Check, ShieldCheck, Plus, AlertCircle, PencilLine, RotateCcw } from 'lucide-react';
import type { AdminSession } from '../../../lib/auth';
import type { Subject } from '../../../lib/students';
import {
  fetchAvailableSubjects, createCustomSubject,
  fetchSchoolGradeSubjects, setSchoolGradeSubjects,
  type SchoolGradeSubject,
} from '../../../lib/schoolGradeSubjects';
import { Shimmer } from '../../../shared/components/Shimmer';
import Dropdown from '../../../shared/components/Dropdown';

const GRADES = [8, 9, 10, 11, 12];

interface SchoolSubjectsAdminPageProps { session: AdminSession; }

interface DraftRow { subject_id: number; is_compulsory: boolean; }

export default function SchoolSubjectsAdminPage({ session }: SchoolSubjectsAdminPageProps) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [offered, setOffered] = useState<SchoolGradeSubject[]>([]);
  const [loading, setLoading] = useState(true);
  const [grade, setGrade] = useState(GRADES[2]); // default Grade 10
  const [customName, setCustomName] = useState('');
  const [customError, setCustomError] = useState<string | null>(null);
  const [addingCustom, setAddingCustom] = useState(false);

  // Same edit/save model as the Timetable page: outside edit mode the table
  // is read-only and shows the last-saved state; entering edit mode seeds a
  // local draft that every checkbox/toggle mutates, and one Save commits the
  // whole grade's changes in a single call instead of a request per click.
  const [draft, setDraft] = useState<DraftRow[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    if (session.school_id) {
      const [subjectData, offeredData] = await Promise.all([
        fetchAvailableSubjects(session.school_id),
        fetchSchoolGradeSubjects(session.school_id),
      ]);
      setSubjects(subjectData);
      setOffered(offeredData);
    }
    setLoading(false);
  };

  const savedRowsForGrade = (): DraftRow[] =>
    offered.filter((o) => o.grade === grade).map((o) => ({ subject_id: o.subject_id, is_compulsory: o.is_compulsory }));

  // Leaving/entering a grade while mid-edit would silently discard changes,
  // so switching grades exits edit mode first (same guard as Timetable's
  // cohort switcher, which disables the selector while editMode is on).
  const changeGrade = (g: number) => {
    if (editMode) return;
    setGrade(g);
  };

  const startEditing = () => {
    setDraft(savedRowsForGrade());
    setDirty(false);
    setSaveError(null);
    setEditMode(true);
  };

  const cancelEditing = () => {
    setDraft([]);
    setDirty(false);
    setSaveError(null);
    setEditMode(false);
  };

  const saveChanges = async () => {
    if (!session.school_id) return;
    setSaving(true);
    setSaveError(null);
    const result = await setSchoolGradeSubjects(session.school_id, grade, draft);
    if (result.success) {
      await load();
      setDirty(false);
      setEditMode(false);
    } else {
      setSaveError(result.error);
    }
    setSaving(false);
  };

  const handleAddCustom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session.school_id) return;
    setAddingCustom(true);
    setCustomError(null);
    const result = await createCustomSubject(session.school_id, customName);
    if (!result.success) {
      setCustomError(result.error);
      setAddingCustom(false);
      return;
    }
    setCustomName('');
    await load();
    setAddingCustom(false);
  };

  const rowsForGrade = editMode ? draft : savedRowsForGrade();
  const isOffered = (subjectId: number) => rowsForGrade.some((r) => r.subject_id === subjectId);
  const rowFor = (subjectId: number) => rowsForGrade.find((r) => r.subject_id === subjectId);

  const toggleOffered = (subjectId: number) => {
    setDraft((prev) => isOffered(subjectId)
      ? prev.filter((r) => r.subject_id !== subjectId)
      : [...prev, { subject_id: subjectId, is_compulsory: false }]);
    setDirty(true);
  };

  const toggleCompulsory = (subjectId: number) => {
    setDraft((prev) => prev.map((r) => r.subject_id === subjectId ? { ...r, is_compulsory: !r.is_compulsory } : r));
    setDirty(true);
  };

  return (
    <div className="student-home min-h-full pb-16">

      {/* ═══ Hero ═══════════════════════════════════════════════ */}
      <div className="relative overflow-hidden bg-brand-dark border-b border-brand-border grain-surface flex flex-col justify-end min-h-[180px] sm:min-h-[220px]">
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 pt-8 sm:pt-11 pb-8 sm:pb-10 w-full flex items-end justify-between gap-4 flex-wrap">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/45 leading-none">Admin</p>
            <h1 className="font-display font-extrabold text-white text-[28px] sm:text-[40px] mt-3 leading-[1.1]"
              style={{ letterSpacing: '-0.02em', textShadow: '0 2px 20px rgba(0,0,0,0.35)' }}>
              Subjects by Grade
            </h1>
            <p className="text-white/60 text-sm mt-2 max-w-lg">
              {editMode
                ? 'Check subjects to offer them, tap Elective/Compulsory to flip it. Nothing is saved until you click Save.'
                : 'Choose which subjects your school offers at each grade. Click Edit to make changes.'}
            </p>
          </div>

          {!loading && (
            <div className="flex items-center gap-2 shrink-0">
              {editMode && <SaveStatusPill dirty={dirty} saving={saving} />}
              {!editMode ? (
                <motion.button onClick={startEditing} whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}
                  className="edge-glow flex items-center gap-2 bg-accent text-white text-sm font-black px-5 py-2.5 rounded shrink-0 transition-colors duration-200 hover:bg-[#2a3350]">
                  <PencilLine className="w-4 h-4" /> Edit Subjects
                </motion.button>
              ) : (
                <>
                  <button onClick={cancelEditing} disabled={saving}
                    className="flex items-center gap-2 bg-white border border-brand-border text-stone-600 text-sm font-black px-4 py-2.5 rounded-xl hover:bg-stone-50 transition-colors disabled:opacity-50">
                    <RotateCcw className="w-3.5 h-3.5" /> Cancel
                  </button>
                  <button onClick={saveChanges} disabled={saving || !dirty}
                    className="flex items-center gap-2 bg-emerald-600 text-white text-sm font-black px-4 py-2.5 rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50 shadow-sm">
                    {saving ? <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Check className="w-4 h-4" />}
                    {saving ? 'Saving…' : 'Save Changes'}
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ═══ Body ═══════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10 space-y-5 sm:space-y-6 pt-6 sm:pt-8">

        {saveError && (
          <div className="flex items-center gap-2.5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <p className="text-sm font-bold text-red-700 flex-1">{saveError}</p>
          </div>
        )}

        {/* Grade selector */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-black uppercase tracking-widest text-stone-500">Grade</span>
          <Dropdown
            value={String(grade)}
            onChange={(v) => changeGrade(Number(v))}
            className="w-40"
            buttonClassName={`w-full flex items-center justify-between gap-2 px-3 py-2.5 bg-white border border-brand-border rounded-xl text-sm font-bold text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 transition-all ${editMode ? 'opacity-50 cursor-not-allowed' : ''}`}
            options={GRADES.map((g) => ({ value: String(g), label: `Grade ${g}` }))}
          />
          {editMode && <span className="text-xs text-stone-400">Finish editing this grade to switch grades.</span>}
        </div>

        {/* Custom subject */}
        <div className="paper-card rounded p-4 sm:p-5">
          <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-2">
            Add a Custom Subject
          </label>
          <form onSubmit={handleAddCustom} className="flex items-center gap-2">
            <input type="text" value={customName} onChange={(e) => setCustomName(e.target.value)}
              placeholder="e.g. Robotics"
              className="flex-1 min-w-0 px-3 py-2.5 bg-stone-50 border border-brand-border rounded-xl text-sm font-medium text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 transition-all" />
            <button type="submit" disabled={addingCustom || !customName.trim()}
              className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2.5 bg-brand-dark text-white text-sm font-black rounded-xl hover:bg-brand-dark/90 transition-all disabled:opacity-40">
              <Plus className="w-4 h-4" /> Add
            </button>
          </form>
          {customError && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className="flex gap-2 mt-3 p-3 bg-red-50 border border-red-200 rounded-xl">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{customError}</p>
            </motion.div>
          )}
          <p className="text-xs text-stone-400 mt-2">Only visible to your school. Check it below once added to offer it at a grade.</p>
        </div>

        {loading ? (
          <div className="paper-card rounded p-5 space-y-3">
            {[0, 1, 2, 3].map(i => <Shimmer key={i} className="h-10 w-full" />)}
          </div>
        ) : (
          <div className="paper-card rounded overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-brand-border/60">
                    <th className="text-left px-5 py-3 text-xs font-black uppercase tracking-widest text-stone-500">Subject</th>
                    <th className="text-left px-5 py-3 text-xs font-black uppercase tracking-widest text-stone-500">Code</th>
                    <th className="text-left px-5 py-3 text-xs font-black uppercase tracking-widest text-stone-500">Offered at Grade {grade}</th>
                    <th className="text-left px-5 py-3 text-xs font-black uppercase tracking-widest text-stone-500">Compulsory</th>
                  </tr>
                </thead>
                <tbody>
                  {subjects.map((s, i) => {
                    const offeredNow = isOffered(s.id);
                    const row = rowFor(s.id);
                    return (
                      <tr key={s.id} className={`border-b border-stone-50 transition-colors ${editMode ? 'hover:bg-stone-50' : ''} ${i === subjects.length - 1 ? 'border-0' : ''} ${!offeredNow ? 'opacity-60' : ''}`}>
                        <td className="px-5 py-3.5">
                          <p className="font-bold text-brand-dark">{s.label}</p>
                        </td>
                        <td className="px-5 py-3.5 font-mono text-stone-500 text-xs tracking-widest">{s.code}</td>
                        <td className="px-5 py-3.5">
                          <button onClick={() => toggleOffered(s.id)} disabled={!editMode}
                            className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all disabled:cursor-default ${
                              offeredNow ? 'bg-brand-dark border-brand-dark' : 'bg-stone-50 border-brand-border hover:border-stone-300'
                            } ${!editMode ? 'hover:border-brand-border' : ''}`}>
                            {offeredNow && <Check className="w-3.5 h-3.5 text-white" />}
                          </button>
                        </td>
                        <td className="px-5 py-3.5">
                          <button onClick={() => toggleCompulsory(s.id)} disabled={!editMode || !offeredNow}
                            className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-bold rounded-lg transition-all disabled:cursor-not-allowed ${
                              !offeredNow ? 'opacity-30' : ''
                            } ${row?.is_compulsory ? 'bg-brand-dark text-white' : 'bg-stone-100 text-stone-500'} ${editMode && offeredNow ? 'hover:bg-stone-200' : ''}`}>
                            {row?.is_compulsory && <ShieldCheck className="w-2.5 h-2.5" />}
                            {row?.is_compulsory ? 'Compulsory' : 'Elective'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!loading && rowsForGrade.length === 0 && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-stone-500 text-center py-4">
            {editMode
              ? `No subjects offered yet at Grade ${grade}. Check a subject above to add it.`
              : `No subjects offered yet at Grade ${grade}. Click Edit Subjects to add some.`}
          </motion.p>
        )}
      </div>
    </div>
  );
}

// ── Save status pill — same recipe as Timetable's ──

function SaveStatusPill({ dirty, saving }: { dirty: boolean; saving: boolean }) {
  const label = saving ? 'Saving…' : dirty ? 'Unsaved changes' : 'All changes saved';
  const dot = saving ? 'bg-blue-400 animate-pulse' : dirty ? 'bg-amber-400' : 'bg-emerald-400';
  return (
    <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/70 border border-stone-200/70 backdrop-blur-sm">
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      <span className="text-[11px] font-bold text-stone-500">{label}</span>
    </div>
  );
}
