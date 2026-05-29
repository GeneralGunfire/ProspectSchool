# Backend Notes — Prospect School Platform

## Architecture overview

All data access uses the Supabase **service role client** (`supabaseAdmin`) directly from the browser bundle. This is a deliberate trade-off: no Supabase CLI, no Edge Functions. Both `homework_completions` and `resources` tables have RLS set to `USING (false)` so direct client access is blocked regardless — all reads/writes go through `supabaseAdmin`.

**Long-term:** move mutations to Edge Functions so the service role key is never in the browser bundle. For now the RLS block provides the safety layer.

---

## Storage buckets

| Bucket | Purpose | Visibility |
|---|---|---|
| `homework-attachments` | Event attachments uploaded by teachers | Private |
| `resources` | Resource files uploaded by teachers | Private |

Both buckets are **private**. Files are never accessed via public URL. The flow is:

1. Upload returns a **storage path** (e.g. `1/1748123456789_abc123.pdf`) stored in `file_url` / `attachment_url`
2. At download time, `createSignedUrl(path, 3600)` generates a 1-hour signed URL
3. That signed URL is opened in a new tab

**Bug fixed (2026-05-29):** Earlier code called `getPublicUrl()` on private buckets and stored the resulting (non-functional) public URL. Changed to store only the storage path and always use `createSignedUrl` at read time. Silent `if (error) return null` was also replaced with `console.error` so upload failures show the actual Supabase error.

---

## Audience targeting

Events and resources both support five `target_type` values:

| `target_type` | Audience | Extra fields required |
|---|---|---|
| `all` | Everyone in the school | — |
| `grade` | Students in selected grades | `target_grades: int[]` |
| `class` | Students in selected cohorts | `target_cohort_ids: bigint[]` |
| `subject` | Students taking selected subjects **and** in selected grades | `target_subject_ids: bigint[]` + `target_grades: int[]` |
| `specific` | Individually named students | `target_student_ids: bigint[]` |

**Important:** `subject` targeting always requires a grade selection too. A resource tagged "Mathematics" without a grade would show to every Maths student across all grades — almost certainly wrong. Both the create form and service-layer filter enforce this.

Student-side filtering happens **client-side after a full school fetch** (no RLS row filter). This is fine at current scale. Add server-side filtering if the resource/event count grows large.

---

## Homework completion tracking

Table: `homework_completions (id, event_id, student_id, school_id, completed_at)`
Unique constraint: `(event_id, student_id)`

- `markHomeworkDone` — upsert (idempotent)
- `unmarkHomeworkDone` — delete by `(event_id, student_id)`
- `fetchStudentCompletions` — returns `Set<number>` of completed event IDs for a student
- `fetchHomeworkCompletionCount` — count of completions for a given event (teacher view)

Completions are loaded once on calendar mount (`fetchStudentCompletions`). Toggle state is updated optimistically in local React state — no page reload needed.

---

## Known limitations

| Issue | Impact | Fix when |
|---|---|---|
| Service role key in browser bundle | Security risk if extracted | Move to Edge Functions when deploying to production |
| Full-school fetch for student resource/event filtering | Performance at scale | Add server-side grade/cohort filters when resource count grows |
| SHA-256 PIN hashing with no salt | Identical PINs have identical hashes | Acceptable for school PINs; add salt if moving to higher-security context |
| No pagination on `fetchTeacherResources` | Could be slow with many resources | Add `.range()` when needed |
