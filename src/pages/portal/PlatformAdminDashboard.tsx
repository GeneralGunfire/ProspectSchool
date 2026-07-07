import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogOut, Plus, X, AlertCircle, ArrowRight, Pencil, School, Users, GraduationCap } from 'lucide-react';
import { getPlatformSession, platformLogout, type PlatformSession } from '../../lib/auth';
import {
  fetchAllSchools, updateSchoolName, createSchoolWithAdmin,
  type SchoolWithStats,
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

export default function PlatformAdminDashboard({ onNavigate }: PlatformAdminDashboardProps) {
  const [session, setSession] = useState<PlatformSession | null>(null);
  const [schools, setSchools] = useState<SchoolWithStats[]>([]);
  const [loading, setLoading] = useState(true);

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
      <div className="flex items-center justify-between px-6 md:px-10 h-16 bg-white border-b border-brand-border">
        <button onClick={() => onNavigate('home')} className="flex items-center gap-2 cursor-pointer">
          <img src="/logo.jpg" alt="Prospect" className="w-7 h-7 rounded-lg object-cover shrink-0" />
          <span className="font-serif-accent text-lg text-brand-dark leading-none">Prospect Platform</span>
        </button>
        <div className="flex items-center gap-4">
          <span className="text-sm font-bold text-stone-600">{session.name}</span>
          <button onClick={() => { platformLogout(); onNavigate('portal'); }}
            className="flex items-center gap-1.5 text-sm font-bold text-red-500 hover:text-red-600 transition-colors">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>

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
              <div key={s.id} className="card-premium bg-white border border-brand-border rounded-3xl p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-stone-500 mb-1 font-mono tracking-widest">{s.school_code}</p>
                    <p className="text-lg font-black text-brand-dark">{s.name}</p>
                    {s.province && <p className="text-xs text-stone-500 mt-0.5">{s.province}</p>}
                  </div>
                  <button onClick={() => openEdit(s)}
                    className="p-2 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors shrink-0">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex items-center gap-4 text-xs text-stone-500 font-bold">
                  <span className="flex items-center gap-1.5"><GraduationCap className="w-3.5 h-3.5" /> {s.teacher_count} teachers</span>
                  <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> {s.student_count} students</span>
                </div>
              </div>
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
