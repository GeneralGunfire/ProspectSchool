// ── Parent Contact Log ────────────────────────────────────────────────────────
// Simple CRUD for teacher-logged parent contacts.
// Table: parent_contacts (id, student_id, teacher_id, school_id, method, note, created_at)

import { supabaseAdmin } from './supabase';

export type ContactMethod = 'call' | 'email' | 'in_person' | 'sms' | 'other';

export const CONTACT_METHOD_LABELS: Record<ContactMethod, string> = {
  call:      'Phone Call',
  email:     'Email',
  in_person: 'In Person',
  sms:       'SMS',
  other:     'Other',
};

export interface ParentContact {
  id:         number;
  studentId:  number;
  teacherId:  number;
  schoolId:   number;
  method:     ContactMethod;
  note:       string | null;
  createdAt:  string;
}

function rowToContact(r: any): ParentContact {
  return {
    id:        r.id,
    studentId: r.student_id,
    teacherId: r.teacher_id,
    schoolId:  r.school_id,
    method:    r.method as ContactMethod,
    note:      r.note ?? null,
    createdAt: r.created_at,
  };
}

// ── Fetch contacts for a student (teacher-scoped) ─────────────────────────────

export async function fetchParentContacts(
  studentId: number,
  teacherId:  number,
): Promise<ParentContact[]> {
  const { data, error } = await supabaseAdmin
    .from('parent_contacts')
    .select('*')
    .eq('student_id', studentId)
    .eq('teacher_id', teacherId)
    .order('created_at', { ascending: false })
    .limit(20);

  if (error || !data) return [];
  return data.map(rowToContact);
}

// ── Fetch last contact date for multiple students at once ─────────────────────
// Returns a Map<studentId, lastContactIso>. Used by Classes page for "Last Contact" chip.

export async function fetchLastContactDates(
  teacherId:  number,
  schoolId:   number,
  studentIds: number[],
): Promise<Map<number, string>> {
  if (studentIds.length === 0) return new Map();

  const { data } = await supabaseAdmin
    .from('parent_contacts')
    .select('student_id, created_at')
    .eq('teacher_id', teacherId)
    .eq('school_id', schoolId)
    .in('student_id', studentIds)
    .order('created_at', { ascending: false });

  // Keep only the latest per student
  const result = new Map<number, string>();
  for (const row of (data ?? [])) {
    const sid = (row as any).student_id as number;
    if (!result.has(sid)) result.set(sid, (row as any).created_at as string);
  }
  return result;
}

// ── Create a contact log entry ────────────────────────────────────────────────

export async function logParentContact(
  studentId: number,
  teacherId:  number,
  schoolId:   number,
  method:    ContactMethod,
  note:      string,
): Promise<ParentContact | null> {
  const { data, error } = await supabaseAdmin
    .from('parent_contacts')
    .insert({
      student_id: studentId,
      teacher_id: teacherId,
      school_id:  schoolId,
      method,
      note: note.trim() || null,
    })
    .select('*')
    .single();

  if (error || !data) return null;
  return rowToContact(data);
}

// ── Delete a contact log entry ────────────────────────────────────────────────

export async function deleteParentContact(
  id:        number,
  teacherId: number,
): Promise<void> {
  await supabaseAdmin
    .from('parent_contacts')
    .delete()
    .eq('id', id)
    .eq('teacher_id', teacherId);
}

// ── Helper: days since ISO string ─────────────────────────────────────────────

export function daysSince(iso: string): number {
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
}

export function lastContactLabel(iso: string): string {
  const d = daysSince(iso);
  if (d === 0) return 'Today';
  if (d === 1) return '1d ago';
  if (d < 7)   return `${d}d ago`;
  if (d < 30)  return `${Math.floor(d / 7)}w ago`;
  return `${Math.floor(d / 30)}mo ago`;
}
