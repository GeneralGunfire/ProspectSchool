import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { GraduationCap, BookOpen, Pencil, Plus, Trash2, AlertCircle, ArrowRight } from 'lucide-react';
import {
  fetchStudentDetail, adminUpdateStudent, replaceStudentAssignments, fetchSubjects,
  type StudentDetail, type Subject, type SubjectTeacherPair,
} from '../../../lib/students';
import { fetchSchoolTeachers, type Teacher } from '../../../lib/teachers';
import { fetchStudentRisk, type StudentRiskProfile } from '../../../lib/riskEngine';
import Dropdown from '../../../shared/components/Dropdown';
import Modal from '../../../shared/components/Modal';

const TIER_STYLE: Record<StudentRiskProfile['tier'], { label: string; className: string }> = {
  high: { label: 'High risk', className: 'bg-red-50 text-red-600 border-red-200' },
  moderate: { label: 'Moderate risk', className: 'bg-amber-50 text-amber-700 border-amber-200' },
  none: { label: 'On track', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
};

interface StudentDetailModalProps {
  student_id: number;
  school_id: number;
  onClose: () => void;
  onSaved?: () => void;
}

interface AssignmentRow {
  subject_id: number | null;
  teacher_id: number | null;
}

interface StudentForm {
  name: string;
  surname: string;
  student_code: string;
  pin: string;
  cohort_name: string;
  grade: number;
}

export default function StudentDetailModal({ student_id, school_id, onClose, onSaved }: StudentDetailModalProps) {
  const [detail, setDetail] = useState<StudentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [form, setForm] = useState<StudentForm | null>(null);
  const [rows, setRows] = useState<AssignmentRow[]>([]);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [risk, setRisk] = useState<StudentRiskProfile | null>(null);

  const load = () => {
    setLoading(true);
    fetchStudentDetail(student_id, school_id).then((result) => {
      if (result.success) setDetail(result.detail);
      setLoading(false);
    });
    const todayStr = new Date().toISOString().split('T')[0];
    fetchStudentRisk(student_id, school_id, todayStr).then(setRisk).catch(() => setRisk(null));
  };

  useEffect(() => { load(); }, [student_id, school_id]);

  const openEdit = async () => {
    if (!detail) return;
    const [subjectData, teacherData] = await Promise.all([fetchSubjects(), fetchSchoolTeachers(school_id)]);
    setSubjects(subjectData);
    setTeachers(teacherData.filter((t) => t.is_active));
    setForm({
      name: detail.name,
      surname: detail.surname,
      student_code: detail.student_code,
      pin: '',
      cohort_name: detail.cohort_name ?? '',
      grade: detail.grade,
    });
    setRows(detail.teacherLinks.length > 0
      ? detail.teacherLinks.map((l) => ({ subject_id: l.subject_id, teacher_id: l.teacher_id }))
      : [{ subject_id: null, teacher_id: null }]);
    setFormError(null);
    setEditing(true);
  };

  const setField = (field: keyof StudentForm, value: string | number) =>
    setForm((f) => (f ? { ...f, [field]: value } : f));

  const setRow = (index: number, field: keyof AssignmentRow, value: number) =>
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, [field]: value } : r)));

  const addRow = () => setRows((prev) => [...prev, { subject_id: null, teacher_id: null }]);
  const removeRow = (index: number) => setRows((prev) => prev.filter((_, i) => i !== index));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;

    if (form.pin && !/^\d{4,10}$/.test(form.pin)) {
      setFormError('PIN must be 4-10 digits.');
      return;
    }

    setSubmitting(true);
    setFormError(null);

    const result = await adminUpdateStudent({
      student_id,
      school_id,
      name: form.name,
      surname: form.surname,
      student_code: form.student_code,
      cohort_name: form.cohort_name,
      grade: form.grade,
      pin: form.pin || undefined,
    });

    if (!result.success) { setFormError(result.error); setSubmitting(false); return; }

    const assignments: SubjectTeacherPair[] = rows
      .filter((r): r is { subject_id: number; teacher_id: number } => r.subject_id !== null && r.teacher_id !== null)
      .map((r) => ({ subject_id: r.subject_id, teacher_id: r.teacher_id }));
    await replaceStudentAssignments(student_id, assignments);

    setSubmitting(false);
    setEditing(false);
    load();
    onSaved?.();
  };

  return (
    <Modal
      open
      onClose={onClose}
      title={editing ? 'Edit student' : 'Student details'}
      maxWidth="max-w-lg"
      titleExtra={!editing && detail ? (
        <button onClick={openEdit} aria-label="Edit student" className="p-2 rounded hover:bg-stone-100 text-stone-500 hover:text-stone-700 transition-colors">
          <Pencil className="w-4 h-4" />
        </button>
      ) : undefined}
      footer={editing ? (
        <>
          <button type="button" onClick={() => setEditing(false)}
            className="text-[14px] font-semibold text-stone-500 hover:text-stone-700 transition-colors">
            Cancel
          </button>
          <button type="submit" form="student-edit-form" disabled={submitting}
            className="text-[14px] font-semibold transition-colors disabled:opacity-50 flex items-center gap-2" style={{ color: 'var(--color-navy)' }}>
            {submitting
              ? <div className="w-3.5 h-3.5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
              : <>Save changes <ArrowRight className="w-3.5 h-3.5" /></>
            }
          </button>
        </>
      ) : (
        <button onClick={onClose}
          className="text-[14px] font-semibold text-stone-500 hover:text-stone-700 transition-colors">
          Close
        </button>
      )}
    >
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-5 h-5 border-2 border-brand-border border-t-stone-700 rounded-full animate-spin" />
              </div>
            ) : !detail ? (
              <p className="text-sm text-stone-500 text-center py-12">Student not found.</p>
            ) : editing && form ? (
              <form id="student-edit-form" onSubmit={handleSave} className="space-y-4">
                {formError && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-red-700 text-sm">{formError}</p>
                  </motion.div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-1.5">Name</label>
                    <input required type="text" value={form.name} onChange={(e) => setField('name', e.target.value)}
                      className="w-full px-3 py-2.5 bg-stone-50 border border-brand-border rounded text-sm font-medium text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-1.5">Surname</label>
                    <input required type="text" value={form.surname} onChange={(e) => setField('surname', e.target.value)}
                      className="w-full px-3 py-2.5 bg-stone-50 border border-brand-border rounded text-sm font-medium text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 transition-all" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-1.5">Student Code</label>
                    <input required type="text" value={form.student_code}
                      onChange={(e) => setField('student_code', e.target.value.toUpperCase())}
                      className="w-full px-3 py-2.5 bg-stone-50 border border-brand-border rounded text-sm font-medium tracking-widest text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 transition-all"
                      autoCapitalize="characters" />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-1.5">
                      PIN <span className="normal-case font-medium text-stone-400">(leave blank to keep current)</span>
                    </label>
                    <input type="password" inputMode="numeric" maxLength={10}
                      value={form.pin} onChange={(e) => setField('pin', e.target.value.replace(/\D/g, ''))}
                      className="w-full px-3 py-2.5 bg-stone-50 border border-brand-border rounded text-sm font-medium text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 transition-all tracking-widest"
                      placeholder="••••••••••" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-1.5">Class</label>
                    <input required type="text" value={form.cohort_name} onChange={(e) => setField('cohort_name', e.target.value)}
                      className="w-full px-3 py-2.5 bg-stone-50 border border-brand-border rounded text-sm font-medium text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-1.5">Grade</label>
                    <Dropdown
                      value={String(form.grade)}
                      onChange={(v) => setField('grade', Number(v))}
                      buttonClassName="w-full flex items-center justify-between gap-2 px-3 py-2.5 bg-stone-50 border border-brand-border rounded text-sm font-medium text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 transition-all"
                      options={[8, 9, 10, 11, 12].map((g) => ({ value: String(g), label: `Grade ${g}` }))}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-stone-500 mb-2">Subjects & Teachers</label>
                  <div className="space-y-2">
                    {rows.map((row, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Dropdown
                          value={row.subject_id ? String(row.subject_id) : null}
                          onChange={(v) => setRow(i, 'subject_id', Number(v))}
                          placeholder="Select subject"
                          className="flex-1 min-w-0"
                          buttonClassName="w-full flex items-center justify-between gap-2 px-3 py-2.5 bg-stone-50 border border-brand-border rounded text-sm font-medium text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 transition-all"
                          options={subjects.map((s) => ({ value: String(s.id), label: s.label }))}
                        />
                        <Dropdown
                          value={row.teacher_id ? String(row.teacher_id) : null}
                          onChange={(v) => setRow(i, 'teacher_id', Number(v))}
                          placeholder="Select teacher"
                          className="flex-1 min-w-0"
                          buttonClassName="w-full flex items-center justify-between gap-2 px-3 py-2.5 bg-stone-50 border border-brand-border rounded text-sm font-medium text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 transition-all"
                          options={teachers.map((t) => ({ value: String(t.id), label: `${t.surname}, ${t.name}` }))}
                        />
                        {rows.length > 1 && (
                          <button type="button" onClick={() => removeRow(i)}
                            className="p-2 rounded-lg hover:bg-red-50 text-stone-400 hover:text-red-600 transition-colors shrink-0">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <button type="button" onClick={addRow}
                    className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-brand-dark transition-colors">
                    <Plus className="w-3.5 h-3.5" /> Add another subject
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xl font-black text-brand-dark">{detail.name} {detail.surname}</p>
                    <p className="text-sm font-mono text-stone-500 tracking-widest mt-0.5">{detail.student_code}</p>
                  </div>
                  {risk && (
                    <span className={`px-2.5 py-1 rounded text-[12px] font-semibold border shrink-0 ${TIER_STYLE[risk.tier].className}`}>
                      {TIER_STYLE[risk.tier].label}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-stone-50 rounded border border-brand-border">
                    <p className="text-[12px] text-muted-2 mb-1">Grade</p>
                    <p className="text-sm font-bold text-brand-dark">Grade {detail.grade}</p>
                  </div>
                  <div className="p-3 bg-stone-50 rounded border border-brand-border">
                    <p className="text-[12px] text-muted-2 mb-1">Class</p>
                    <p className="text-sm font-bold text-brand-dark">{detail.cohort_name ?? 'Unassigned'}</p>
                  </div>
                </div>

                {risk && (
                  <div>
                    <p className="text-[15px] text-brand-dark mb-2" style={{ fontWeight: 600 }}>Oversight snapshot</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-stone-50 rounded border border-brand-border">
                        <p className="text-[12px] text-muted-2 mb-1">Attendance (recent)</p>
                        <p className="text-sm font-bold text-brand-dark">
                          {risk.raw.attendanceRateRecent !== null ? `${risk.raw.attendanceRateRecent}%` : '—'}
                        </p>
                      </div>
                      <div className="p-3 bg-stone-50 rounded border border-brand-border">
                        <p className="text-[12px] text-muted-2 mb-1">Serious behaviour (term)</p>
                        <p className="text-sm font-bold text-brand-dark">{risk.raw.behaviourSeriousTerm}</p>
                      </div>
                    </div>
                    {risk.worstSubject && (
                      <p className="text-xs text-stone-500 mt-2">
                        Weakest subject: <span className="font-semibold text-brand-dark capitalize">{risk.worstSubject.subject}</span>
                      </p>
                    )}
                    {risk.reasons.length > 0 && (
                      <ul className="mt-2 space-y-1">
                        {risk.reasons.map((r, i) => (
                          <li key={i} className="text-xs text-stone-500">· {r}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

                <div>
                  <p className="text-[15px] text-brand-dark mb-2 flex items-center gap-1.5" style={{ fontWeight: 600 }}>
                    <BookOpen className="w-3.5 h-3.5" style={{ color: 'var(--color-navy)' }} /> Subjects & teachers
                  </p>
                  {detail.teacherLinks.length === 0 ? (
                    <p className="text-sm text-stone-500">No subject links yet.</p>
                  ) : (
                    <div className="space-y-1.5">
                      {detail.teacherLinks.map((l, i) => (
                        <div key={i} className="flex items-center justify-between px-3 py-2 bg-stone-50 rounded-lg border border-brand-border">
                          <span className="text-sm font-bold text-brand-dark">{l.subject_label}</span>
                          <span className="text-xs text-stone-500 flex items-center gap-1">
                            <GraduationCap className="w-3 h-3" /> {l.teacher_name} {l.teacher_surname}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
    </Modal>
  );
}
