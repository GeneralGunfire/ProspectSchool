// ── studentTasks.ts — CRUD for student personal study tasks ──────────────────
// All writes use supabaseAdmin (service role) so RLS is bypassed,
// matching the pattern used everywhere else in this codebase.

import { supabaseAdmin } from './supabase';

export interface StudentTask {
  id: number;
  student_id: number;
  school_id: number;
  title: string;
  notes: string | null;
  due_date: string;   // ISO date "YYYY-MM-DD"
  subject: string | null;
  done: boolean;
  created_at: string;
}

export type NewStudentTask = Omit<StudentTask, 'id' | 'created_at' | 'done'>;

// ── Fetch all tasks for a student (all time — we filter by month on the client) ──
export async function fetchStudentTasks(studentId: number): Promise<StudentTask[]> {
  const { data, error } = await supabaseAdmin
    .from('student_tasks')
    .select('*')
    .eq('student_id', studentId)
    .order('due_date', { ascending: true });

  if (error) {
    console.error('[studentTasks] fetchStudentTasks error:', error.message);
    return [];
  }
  return (data ?? []) as StudentTask[];
}

// ── Create a new task ─────────────────────────────────────────────────────────
export async function createStudentTask(task: NewStudentTask): Promise<StudentTask | null> {
  const { data, error } = await supabaseAdmin
    .from('student_tasks')
    .insert({
      student_id: task.student_id,
      school_id:  task.school_id,
      title:      task.title.trim(),
      notes:      task.notes?.trim() || null,
      due_date:   task.due_date,
      subject:    task.subject?.trim() || null,
      done:       false,
    })
    .select()
    .single();

  if (error) {
    console.error('[studentTasks] createStudentTask error:', error.message);
    return null;
  }
  return data as StudentTask;
}

// ── Toggle done state ─────────────────────────────────────────────────────────
export async function updateTaskDone(taskId: number, done: boolean): Promise<boolean> {
  const { error } = await supabaseAdmin
    .from('student_tasks')
    .update({ done })
    .eq('id', taskId);

  if (error) {
    console.error('[studentTasks] updateTaskDone error:', error.message);
    return false;
  }
  return true;
}

// ── Delete a task ─────────────────────────────────────────────────────────────
export async function deleteStudentTask(taskId: number): Promise<boolean> {
  const { error } = await supabaseAdmin
    .from('student_tasks')
    .delete()
    .eq('id', taskId);

  if (error) {
    console.error('[studentTasks] deleteStudentTask error:', error.message);
    return false;
  }
  return true;
}
