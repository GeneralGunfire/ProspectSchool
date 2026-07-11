import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LogOut, Plus, X, AlertCircle, ArrowRight, Pencil, School, Users, GraduationCap,
  ChevronLeft, ClipboardList, FolderOpen, FileText, Megaphone, Activity, CheckCircle2,
  ClipboardCheck, Layers, ShieldCheck, CalendarDays, Send,
} from 'lucide-react';
import { getPlatformSession, platformLogout, type PlatformSession } from '../../lib/auth';
import {
  fetchAllSchools, updateSchoolName, createSchoolWithAdmin, fetchSchoolStats,
  type SchoolWithStats, type SchoolStats,
} from '../../lib/schools';

interface PlatformAdminDashboardProps {
  onNavigate: (page: string) => void;
}

interface CreateSchoolForm {
  school_name: string;
  school_code: string;
  province: string;
  admin_name: string;
  admin_surname: string;
  admin_code: string;
  admin_pin: string;
}

const EMPTY_CREATE_FORM: CreateSchoolForm = {
  school_name: '', school_code: '', province: '',
  admin_name: '', admin_surname: '', admin_code: '', admin_pin: '',
};

// ── Shared top bar — consistent across the schools list and school detail views ──
// Clicking the logo/name returns to the schools list (never leaves the admin tool
// via a bare "home" link, which would silently drop the admin session context).

function PlatformTopBar({ session, crumb, onHome, onSignOut }: {
  session: PlatformSession;
  crumb: string | null;
  onHome: () => void;
  onSignOut: () => void;
}) {
  return (
    <div className="p-3 pb-0">
      <div className="flex items-center justify-between px-6 md:px-10 h-16 rounded-[14px] bg-white"
        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <div className="flex items-center gap-2 min-w-0">
          <button onClick={onHome} className="flex items-center gap-2 cursor-pointer shrink-0">
            <img src="/logo3.png" alt="Prospect" className="w-7 h-7 rounded-lg object-cover shrink-0" />
            <span className="font-serif-accent text-lg text-brand-dark leading-none">Prospect Platform</span>
          </button>
          {crumb && (
            <>
              <span className="text-stone-300 shrink-0">/</span>
              <span className="text-sm font-bold text-stone-600 truncate">{crumb}</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-[10px]">
            <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center shrink-0">
              <span className="text-accent-foreground font-black text-[10px]">
                {session.name.slice(0, 2).toUpperCase()}
              </span>
            </div>
            <span className="text-[13px] font-bold text-brand-dark">{session.name}</span>
          </div>
          <button onClick={onSignOut}
            className="flex items-center gap-1.5 px-3 py-2 rounded-[10px] text-sm font-bold text-red-500 hover:bg-red-50 transition-all">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PlatformAdminDashboard({ onNavigate }: PlatformAdminDashboardProps) {
  const [session, setSession] = useState<PlatformSession | null>(null);
  const [schools, setSchools] = useState<SchoolWithStats[]>([]);
  const [loading, setLoading] = useState(true);

  const [detailSchool, setDetailSchool] = useState<SchoolWithStats | null>(null);

  const [editingSchool, setEditingSchool] = useState<SchoolWithStats | null>(null);
  const [editName, setEditName] = useState('');
  const [editError, setEditError] = useState<string | null>(null);
  const [editSubmitting, setEditSubmitting] = useState(false);

  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState<CreateSchoolForm>(EMPTY_CREATE_FORM);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createSubmitting, setCreateSubmitting] = useState(false);

  useEffect(() => {
    const s = getPlatformSession();
    if (!s) { onNavigate('platform-login'); return; }
    setSession(s);
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    const data = await fetchAllSchools();
    setSchools(data);
    setLoading(false);
  };

  if (!session) return null;

  if (detailSchool) {
    return (
      <SchoolDetail
        school={detailSchool}
        session={session}
        onBack={() => setDetailSchool(null)}
        onSignOut={() => { platformLogout(); onNavigate('portal'); }}
      />
    );
  }

  // ── Edit school name ─────────────────────────────────────────

  const openEdit = (school: SchoolWithStats) => {
    setEditingSchool(school);
    setEditName(school.name);
    setEditError(null);
  };

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSchool) return;
    setEditSubmitting(true);
    setEditError(null);
    const result = await updateSchoolName(editingSchool.id, editName);
    if (!result.success) { setEditError(result.error); setEditSubmitting(false); return; }
    await load();
    setEditingSchool(null);
    setEditSubmitting(false);
  };

  // ── Create school + admin ────────────────────────────────────

  const openCreate = () => {
    setCreateForm(EMPTY_CREATE_FORM);
    setCreateError(null);
    setShowCreate(true);
  };

  const setCreateField = (field: keyof CreateSchoolForm, value: string) =>
    setCreateForm((f) => ({ ...f, [field]: value }));

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateSubmitting(true);
    setCreateError(null);
    const result = await createSchoolWithAdmin(createForm);
    if (!result.success) { setCreateError(result.error); setCreateSubmitting(false); return; }
    await load();
    setShowCreate(false);
    setCreateSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-dash-bg">
      <PlatformTopBar
        session={session}
        crumb={null}
        onHome={() => {}}
        onSignOut={() => { platformLogout(); onNavigate('portal'); }}
      />

      <div className="px-6 md:px-10 py-8 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8 gap-3 flex-wrap">
          <div>
            <span className="eyebrow">Platform</span>
            <h1 className="text-2xl font-black text-brand-dark tracking-tight">Schools</h1>
            <p className="text-sm text-stone-500 mt-1">{schools.length} school{schools.length === 1 ? '' : 's'} on Prospect.</p>
          </div>
          <motion.button onClick={openCreate} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 bg-brand-dark text-white text-sm font-black px-5 py-2.5 rounded-xl hover:bg-brand-dark/90 transition-colors">
            <Plus className="w-4 h-4" /> New School
          </motion.button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-5 h-5 border-2 border-brand-border border-t-stone-700 rounded-full animate-spin" />
          </div>
        ) : schools.length === 0 ? (
          <div className="card-premium bg-white border border-brand-border rounded-3xl p-12 text-center">
            <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center mx-auto mb-4">
              <School className="w-5 h-5 text-stone-500" />
            </div>
            <p className="font-bold text-brand-dark mb-1">No schools yet</p>
            <p className="text-sm text-stone-500 mb-6">Onboard your first school to get started.</p>
            <button onClick={openCreate}
              className="inline-flex items-center gap-2 text-sm font-bold text-stone-700 hover:text-brand-dark border border-brand-border hover:border-stone-300 px-5 py-2.5 rounded-xl transition-all">
              New School <Plus className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {schools.map((s) => (
              <button
                key={s.id}
                onClick={() => setDetailSchool(s)}
                className="text-left card-premium bg-white border border-brand-border rounded-3xl p-5 hover:border-stone-300 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-stone-500 mb-1 font-mono">{s.school_code}</p>
                    <p className="text-lg font-black text-brand-dark">{s.name}</p>
                    {s.province && <p className="text-xs text-stone-500 mt-0.5">{s.province}</p>}
                  </div>
                  <span
                    role="button"
                    onClick={(e) => { e.stopPropagation(); openEdit(s); }}
                    className="p-2 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors shrink-0"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-stone-500 font-bold">
                  <span className="flex items-center gap-1.5"><GraduationCap className="w-3.5 h-3.5" /> {s.teacher_count} teachers</span>
                  <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> {s.student_count} students</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Edit school modal */}
      <AnimatePresence>
        {editingSchool && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setEditingSchool(null)} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm flex flex-col">
                <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-brand-border/60">
                  <h2 className="text-lg font-black text-brand-dark">Rename School</h2>
                  <button onClick={() => setEditingSchool(null)} className="p-2 rounded-xl hover:bg-stone-100 text-stone-500 hover:text-stone-700 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form id="edit-school-form" onSubmit={handleEditSave} className="px-6 py-4 space-y-4">
                  {editError && (
                    <div className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                      <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      <p className="text-red-700 text-sm">{editError}</p>
                    </div>
                  )}
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-1.5">School Name</label>
                    <input required type="text" value={editName} onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-3 py-2.5 bg-stone-50 border border-brand-border rounded-xl text-sm font-medium text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 transition-all" />
                  </div>
                  <p className="text-xs text-stone-500">School code ({editingSchool.school_code}) cannot be changed.</p>
                </form>

                <div className="flex gap-3 px-6 py-4 border-t border-brand-border/60">
                  <button type="button" onClick={() => setEditingSchool(null)}
                    className="flex-1 py-2.5 text-sm font-bold text-stone-600 border border-brand-border rounded-xl hover:bg-stone-50 transition-all">
                    Cancel
                  </button>
                  <button type="submit" form="edit-school-form" disabled={editSubmitting}
                    className="flex-1 py-2.5 text-sm font-black text-white bg-brand-dark rounded-xl hover:bg-brand-dark/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                    {editSubmitting
                      ? <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      : 'Save'
                    }
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* New school modal */}
      <AnimatePresence>
        {showCreate && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowCreate(false)} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[88vh]">
                <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-brand-border/60 shrink-0">
                  <h2 className="text-lg font-black text-brand-dark">New School</h2>
                  <button onClick={() => setShowCreate(false)} className="p-2 rounded-xl hover:bg-stone-100 text-stone-500 hover:text-stone-700 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="px-6 py-4 overflow-y-auto">
                  <form id="create-school-form" onSubmit={handleCreateSubmit} className="space-y-5">
                    {createError && (
                      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                        className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                        <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                        <p className="text-red-700 text-sm">{createError}</p>
                      </motion.div>
                    )}

                    <div>
                      <p className="text-xs font-black uppercase tracking-widest text-stone-500 mb-2">School</p>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-bold text-stone-500 mb-1.5">School Name</label>
                          <input required type="text" value={createForm.school_name} onChange={(e) => setCreateField('school_name', e.target.value)}
                            className="w-full px-3 py-2.5 bg-stone-50 border border-brand-border rounded-xl text-sm font-medium text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 transition-all"
                            placeholder="e.g. Greenfield High School" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-stone-500 mb-1.5">School Code</label>
                            <input required type="text" value={createForm.school_code}
                              onChange={(e) => setCreateField('school_code', e.target.value.toUpperCase())}
                              className="w-full px-3 py-2.5 bg-stone-50 border border-brand-border rounded-xl text-sm font-medium tracking-widest text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 transition-all"
                              placeholder="e.g. GHS001" autoCapitalize="characters" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-stone-500 mb-1.5">Province</label>
                            <input type="text" value={createForm.province} onChange={(e) => setCreateField('province', e.target.value)}
                              className="w-full px-3 py-2.5 bg-stone-50 border border-brand-border rounded-xl text-sm font-medium text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 transition-all"
                              placeholder="e.g. Gauteng" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-black uppercase tracking-widest text-stone-500 mb-2">First Admin Account</p>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-stone-500 mb-1.5">Name</label>
                            <input required type="text" value={createForm.admin_name} onChange={(e) => setCreateField('admin_name', e.target.value)}
                              className="w-full px-3 py-2.5 bg-stone-50 border border-brand-border rounded-xl text-sm font-medium text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 transition-all" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-stone-500 mb-1.5">Surname</label>
                            <input required type="text" value={createForm.admin_surname} onChange={(e) => setCreateField('admin_surname', e.target.value)}
                              className="w-full px-3 py-2.5 bg-stone-50 border border-brand-border rounded-xl text-sm font-medium text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 transition-all" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-stone-500 mb-1.5">Admin Code</label>
                            <input required type="text" value={createForm.admin_code}
                              onChange={(e) => setCreateField('admin_code', e.target.value.toUpperCase())}
                              className="w-full px-3 py-2.5 bg-stone-50 border border-brand-border rounded-xl text-sm font-medium tracking-widest text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 transition-all"
                              placeholder="e.g. ADM-001" autoCapitalize="characters" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-stone-500 mb-1.5">PIN</label>
                            <input required type="password" inputMode="numeric" maxLength={10}
                              value={createForm.admin_pin} onChange={(e) => setCreateField('admin_pin', e.target.value.replace(/\D/g, ''))}
                              className="w-full px-3 py-2.5 bg-stone-50 border border-brand-border rounded-xl text-sm font-medium text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 transition-all tracking-widest"
                              placeholder="10-digit PIN" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>

                <div className="flex gap-3 px-6 py-4 border-t border-brand-border/60 shrink-0">
                  <button type="button" onClick={() => setShowCreate(false)}
                    className="flex-1 py-2.5 text-sm font-bold text-stone-600 border border-brand-border rounded-xl hover:bg-stone-50 transition-all">
                    Cancel
                  </button>
                  <button type="submit" form="create-school-form" disabled={createSubmitting}
                    className="flex-1 py-2.5 text-sm font-black text-white bg-brand-dark rounded-xl hover:bg-brand-dark/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                    {createSubmitting
                      ? <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating...</>
                      : <>Create School <ArrowRight className="w-4 h-4" /></>
                    }
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── School Detail (drill-down) ───────────────────────────────

function StatTile({ icon: Icon, label, value, sub }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string | number; sub?: string }) {
  return (
    <div className="card-premium bg-white border border-brand-border rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-1.5">
        <Icon className="w-3.5 h-3.5 text-stone-500 shrink-0" />
        <p className="text-[10px] font-black uppercase tracking-widest text-stone-500">{label}</p>
      </div>
      <p className="text-2xl font-black text-brand-dark leading-none">{value}</p>
      {sub && <p className="text-[11px] text-stone-500 mt-1">{sub}</p>}
    </div>
  );
}

function SchoolDetail({ school, session, onBack, onSignOut }: {
  school: SchoolWithStats;
  session: PlatformSession;
  onBack: () => void;
  onSignOut: () => void;
}) {
  const [stats, setStats] = useState<SchoolStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchSchoolStats(school.id).then((data) => { setStats(data); setLoading(false); });
  }, [school.id]);

  const formattedCreated = stats?.created_at
    ? new Date(stats.created_at).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })
    : school.created_at
    ? new Date(school.created_at).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })
    : '—';

  return (
    <div className="min-h-screen bg-dash-bg">
      <PlatformTopBar
        session={session}
        crumb={school.name}
        onHome={onBack}
        onSignOut={onSignOut}
      />

      <div className="px-6 md:px-10 py-8 max-w-6xl mx-auto">
        {/* Back + header */}
        <button onClick={onBack} className="flex items-center gap-1.5 text-[13px] font-bold text-stone-500 hover:text-brand-dark transition-colors mb-4">
          <ChevronLeft className="w-4 h-4" /> All Schools
        </button>
        <div className="mb-8">
          <p className="text-[10px] font-black uppercase tracking-widest text-stone-500 mb-1 font-mono">{school.school_code}</p>
          <h1 className="text-2xl font-black text-brand-dark tracking-tight">{school.name}</h1>
          <p className="text-sm text-stone-500 mt-1">
            {school.province ? `${school.province} · ` : ''}Onboarded {formattedCreated}
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-5 h-5 border-2 border-brand-border border-t-stone-700 rounded-full animate-spin" />
          </div>
        ) : !stats ? (
          <p className="text-sm text-stone-500">Failed to load school stats.</p>
        ) : (
          <div className="space-y-8">

            {/* Roster */}
            <section>
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-stone-500 mb-3">Roster</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <StatTile icon={GraduationCap} label="Teachers" value={stats.teacher_count} />
                <StatTile icon={Users} label="Students" value={stats.student_count} />
                <StatTile icon={ShieldCheck} label="Admins" value={stats.admin_count} />
                <StatTile icon={Layers} label="Classes" value={stats.cohort_count} />
              </div>
            </section>

            {/* Activity / engagement */}
            <section>
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-stone-500 mb-3">Activity & Engagement</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <StatTile icon={ClipboardList} label="Mark Sheets" value={stats.mark_sheet_count} sub={`${stats.marks_entered_count} marks entered`} />
                <StatTile icon={FolderOpen} label="Resources" value={stats.resource_count} />
                <StatTile icon={FileText} label="Past Papers" value={stats.past_paper_count} />
                <StatTile icon={Megaphone} label="Announcements" value={stats.announcement_count} />
              </div>
            </section>

            {/* At-risk / intervention health */}
            <section>
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-stone-500 mb-3">Intervention Health</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <StatTile icon={Activity} label="Active" value={stats.active_interventions} sub="interventions in progress" />
                <StatTile icon={CheckCircle2} label="Completed" value={stats.completed_interventions} />
                <StatTile
                  icon={CheckCircle2}
                  label="Success Rate"
                  value={stats.outcomes_recorded > 0 ? `${stats.success_rate}%` : '—'}
                  sub={stats.outcomes_recorded > 0 ? `${stats.successful_outcomes}/${stats.outcomes_recorded} outcomes improved` : 'No outcomes recorded yet'}
                />
                <StatTile icon={CalendarDays} label="Outcomes Recorded" value={stats.outcomes_recorded} />
              </div>
            </section>

            {/* Topic Tests adoption */}
            <section>
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-stone-500 mb-3">Topic Tests Adoption</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <StatTile icon={ClipboardCheck} label="Tests Created" value={stats.topic_test_count} />
                <StatTile icon={Send} label="Assignments" value={stats.topic_test_assignment_count} />
                <StatTile icon={CheckCircle2} label="Attempts Submitted" value={stats.topic_test_attempt_count} />
                <StatTile
                  icon={AlertCircle}
                  label="Pending Marking"
                  value={stats.topic_test_pending_marking}
                  sub={stats.topic_test_pending_marking > 0 ? 'awaiting teacher review' : 'all caught up'}
                />
              </div>
            </section>

          </div>
        )}
      </div>
    </div>
  );
}
