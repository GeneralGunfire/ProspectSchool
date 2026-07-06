// ── Notifications ─────────────────────────────────────────────────────────────
// Bell-icon notifications for teachers and students.
// Table: notifications (id, school_id, user_type, user_id, title, body, read, created_at)

import { supabaseAdmin } from './supabase';

export type NotificationUserType = 'teacher' | 'student';

export interface AppNotification {
  id:        number;
  schoolId:  number;
  userType:  NotificationUserType;
  userId:    number;
  title:     string;
  body:      string | null;
  read:      boolean;
  createdAt: string;
}

function rowToNotification(r: any): AppNotification {
  return {
    id:        r.id,
    schoolId:  r.school_id,
    userType:  r.user_type as NotificationUserType,
    userId:    r.user_id,
    title:     r.title,
    body:      r.body ?? null,
    read:      r.read,
    createdAt: r.created_at,
  };
}

// ── Create a notification ─────────────────────────────────────────────────────
// Fire-and-forget by design — a failed notification write must never block the
// action that triggered it (assigning/completing an intervention, etc).

export async function createNotification(
  schoolId: number,
  userType: NotificationUserType,
  userId:   number,
  title:    string,
  body?:    string,
): Promise<void> {
  const { error } = await supabaseAdmin
    .from('notifications')
    .insert({
      school_id: schoolId,
      user_type: userType,
      user_id:   userId,
      title,
      body: body ?? null,
    });

  if (error) console.error('[notifications] create error:', error.message);
}

// ── Fetch notifications for a user ────────────────────────────────────────────

export async function fetchNotifications(
  userType: NotificationUserType,
  userId:   number,
  limit = 20,
): Promise<AppNotification[]> {
  const { data, error } = await supabaseAdmin
    .from('notifications')
    .select('*')
    .eq('user_type', userType)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error || !data) return [];
  return data.map(rowToNotification);
}

// ── Mark read ──────────────────────────────────────────────────────────────────

export async function markNotificationRead(id: number): Promise<void> {
  const { error } = await supabaseAdmin
    .from('notifications')
    .update({ read: true })
    .eq('id', id);

  if (error) console.error('[notifications] mark read error:', error.message);
}

export async function markAllNotificationsRead(
  userType: NotificationUserType,
  userId:   number,
): Promise<void> {
  const { error } = await supabaseAdmin
    .from('notifications')
    .update({ read: true })
    .eq('user_type', userType)
    .eq('user_id', userId)
    .eq('read', false);

  if (error) console.error('[notifications] mark all read error:', error.message);
}
